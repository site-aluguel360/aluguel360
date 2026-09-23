from datetime import timedelta

from django.db.models import F
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from common.pagination import MobileCursorPagination
from .filters import ListingFilter
from .models import Favorite, Listing, ListingStatus, ListingView
from .serializers import ListingDetailSerializer, ListingListSerializer, ListingWriteSerializer
from .tasks import calculate_quality_score_task


class ListingViewSet(viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = ListingFilter
    ordering_fields = ['aluguel', 'published_at', 'views_count', 'quality_score']
    ordering = ['-published_at']
    pagination_class = MobileCursorPagination

    def get_queryset(self):
        base = Listing.objects.select_related('property', 'owner').prefetch_related('property__rooms', 'media')
        if self.action == 'mine':
            return base.filter(owner=self.request.user)
        return base.filter(status=ListingStatus.PUBLICADO)

    def get_serializer_class(self):
        if self.action == 'list':
            return ListingListSerializer
        if self.action in ('create', 'update', 'partial_update'):
            return ListingWriteSerializer
        return ListingDetailSerializer

    def get_permissions(self):
        return [AllowAny()] if self.action in ('list', 'retrieve', 'featured', 'nearby') else [IsAuthenticated()]

    def perform_create(self, serializer):
        listing = serializer.save(owner=self.request.user)
        calculate_quality_score_task.delay(str(listing.pk))

    def perform_destroy(self, instance):
        if instance.owner != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied()
        instance.status = ListingStatus.EXPIRADO
        instance.save(update_fields=['status'])

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        Listing.objects.filter(pk=instance.pk).update(views_count=F('views_count') + 1)
        ListingView.objects.create(listing=instance, user=request.user if request.user.is_authenticated else None,
                                   ip_address=request.META.get('REMOTE_ADDR'), user_agent=request.META.get('HTTP_USER_AGENT', ''))
        instance.refresh_from_db()
        return Response(self.get_serializer(instance).data)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def featured(self, request):
        qs = self.get_queryset().order_by('-quality_score', '-views_count')[:6]
        return Response({'results': ListingListSerializer(qs, many=True, context={'request': request}).data})

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def mine(self, request):
        return self.list(request)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def nearby(self, request):
        return self.list(request)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def publish(self, request, pk=None):
        listing = self.get_object()
        if listing.owner != request.user:
            return Response({'error': 'Sem permissão.'}, status=status.HTTP_403_FORBIDDEN)
        now = timezone.now()
        listing.status, listing.published_at, listing.expires_at = ListingStatus.PUBLICADO, now, now + timedelta(days=90)
        listing.save(update_fields=['status', 'published_at', 'expires_at'])
        return Response({'message': 'Anúncio publicado com sucesso.'})

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def pause(self, request, pk=None):
        listing = self.get_object()
        if listing.owner != request.user:
            return Response({'error': 'Sem permissão.'}, status=status.HTTP_403_FORBIDDEN)
        listing.status = ListingStatus.PAUSADO
        listing.save(update_fields=['status'])
        return Response({'message': 'Anúncio pausado.'})

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def favorite(self, request, pk=None):
        listing = self.get_object()
        favorite, created = Favorite.objects.get_or_create(user=request.user, listing=listing)
        if created:
            Listing.objects.filter(pk=listing.pk).update(favorites_count=F('favorites_count') + 1)
        else:
            favorite.delete()
            Listing.objects.filter(pk=listing.pk, favorites_count__gt=0).update(favorites_count=F('favorites_count') - 1)
        return Response({'favorited': created})
