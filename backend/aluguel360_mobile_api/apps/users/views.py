from django.db.models import Avg, Sum
from django.utils import timezone
from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.listings.models import Listing, ListingStatus
from .models import Address, Session
from .serializers import AddressSerializer, SessionSerializer, UserMeSerializer, UserStatsSerializer, UserUpdateSerializer


class MeView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserMeSerializer

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserMeSerializer(request.user, context={'request': request}).data)

    def perform_destroy(self, instance):
        instance.soft_delete()


class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SessionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Session.objects.filter(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        session = self.get_object()
        session.is_active = False
        session.save(update_fields=['is_active'])
        return Response(status=status.HTTP_204_NO_CONTENT)


class StatsView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        listings = request.user.listings.all()
        properties = request.user.properties.all()
        data = {
            'imoveis_cadastrados': properties.count(),
            'imoveis_publicados': listings.filter(status=ListingStatus.PUBLICADO).count(),
            'imoveis_alugados': properties.filter(status='ALUGADO').count(),
            'imoveis_rascunho': properties.filter(status='RASCUNHO').count(),
            'anuncios_ativos': listings.filter(status=ListingStatus.PUBLICADO).count(),
            'total_visualizacoes': listings.aggregate(value=Sum('views_count'))['value'] or 0,
            'total_favoritos': listings.aggregate(value=Sum('favorites_count'))['value'] or 0,
            'quality_score_medio': listings.aggregate(value=Avg('quality_score'))['value'] or 0.0,
        }
        return Response(UserStatsSerializer(data).data)


class FavoritesView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Listing.objects.filter(favorites__user=self.request.user).select_related('property')

    def get_serializer_class(self):
        from apps.listings.serializers import ListingListSerializer
        return ListingListSerializer
