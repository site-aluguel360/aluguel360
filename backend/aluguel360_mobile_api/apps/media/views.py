import magic
from django.conf import settings
from django.db import transaction
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Media, MediaType, StorageQuota
from .serializers import MediaSerializer, StorageQuotaSerializer
from .tasks import generate_thumbnail, update_storage_quota
from .storage import get_media_storage

ALLOWED_PHOTO_MIMES = {'image/jpeg', 'image/png', 'image/webp', 'image/heic'}
ALLOWED_VIDEO_MIMES = {'video/mp4', 'video/quicktime'}


class MediaViewSet(viewsets.ModelViewSet):
    serializer_class = MediaSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return Media.objects.filter(user=self.request.user)

    @method_decorator(ratelimit(key='user', rate='30/h', method='POST', block=True))
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        uploaded = request.FILES.get('file')
        tipo = request.data.get('tipo', MediaType.FOTO)
        if not uploaded:
            return Response({'error': 'Arquivo é obrigatório.'}, status=status.HTTP_400_BAD_REQUEST)
        mime = magic.from_buffer(uploaded.read(2048), mime=True)
        uploaded.seek(0)
        allowed = ALLOWED_PHOTO_MIMES if tipo == MediaType.FOTO else ALLOWED_VIDEO_MIMES
        max_mb = getattr(settings, 'MAX_PHOTO_MB', 10) if tipo == MediaType.FOTO else getattr(settings, 'MAX_VIDEO_MB', 100)
        size_mb = uploaded.size / (1024 * 1024)
        if mime not in allowed:
            return Response({'error': 'Tipo de arquivo não permitido.'}, status=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)
        if size_mb > max_mb:
            return Response({'error': f'Arquivo muito grande. Máximo: {max_mb}MB.'}, status=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE)
        quota, _ = StorageQuota.objects.get_or_create(user=request.user)
        if quota.total_mb_used + size_mb > quota.total_mb_limit:
            return Response({'error': 'Quota de armazenamento excedida.'}, status=status.HTTP_507_INSUFFICIENT_STORAGE)
        count = self.get_queryset().filter(tipo=tipo).count()
        limit = getattr(settings, 'MAX_PHOTOS_PER_USER', 50) if tipo == MediaType.FOTO else getattr(settings, 'MAX_VIDEOS_PER_USER', 5)
        if count >= limit:
            return Response({'error': 'Limite de mídias atingido.'}, status=status.HTTP_400_BAD_REQUEST)
        storage = get_media_storage()
        try:
            stored = storage.save(uploaded, user_id=str(request.user.id), media_type=tipo)
        except Exception as exc:
            return Response({'error': f'Não foi possível armazenar a mídia localmente: {exc}'}, status=status.HTTP_502_BAD_GATEWAY)
        media = Media.objects.create(user=request.user, tipo=tipo, property_id=request.data.get('property') or None,
            listing_id=request.data.get('listing') or None, url=stored.url, public_id=stored.public_id,
            nome=request.data.get('nome', uploaded.name), tamanho_mb=size_mb, formato=mime)
        if getattr(settings, 'MEDIA_STORAGE_BACKEND', 'local') == 'local':
            media.thumbnail_url = stored.url
            media.url_optimized = stored.url
            media.save(update_fields=['thumbnail_url', 'url_optimized'])
        try:
            generate_thumbnail.delay(str(media.id))
        except Exception:
            pass
        update_storage_quota(str(request.user.id))
        return Response(MediaSerializer(media, context={'request': request}).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def set_highlight(self, request, pk=None):
        media = self.get_object()
        if media.tipo != MediaType.FOTO:
            return Response({'error': 'Apenas fotos podem ser destaque.'}, status=400)
        Media.objects.filter(user=request.user, listing=media.listing, is_highlight=True).update(is_highlight=False)
        media.is_highlight = True
        media.save(update_fields=['is_highlight'])
        return Response(MediaSerializer(media, context={'request': request}).data)

    @action(detail=False, methods=['get'])
    def quota(self, request):
        quota, _ = StorageQuota.objects.get_or_create(user=request.user)
        return Response(StorageQuotaSerializer(quota).data)

    def perform_destroy(self, instance):
        storage = get_media_storage()
        storage.delete(instance.public_id)
        user_id = str(instance.user_id)
        instance.delete()
        update_storage_quota(user_id)
