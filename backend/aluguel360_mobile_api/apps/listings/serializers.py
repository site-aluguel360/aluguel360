from rest_framework import serializers

from apps.media.models import Media
from apps.properties.models import Property, PropertyRoom
from apps.users.serializers import UserPublicSerializer
from .models import Listing


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyRoom
        fields = ['tipo', 'quantidade']


class MediaThumbnailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ['id', 'thumbnail_url', 'url_optimized', 'tipo', 'is_highlight']


class ListingListSerializer(serializers.ModelSerializer):
    foto_destaque = serializers.SerializerMethodField()
    cidade = serializers.CharField(source='property.cidade', read_only=True)
    estado = serializers.CharField(source='property.estado', read_only=True)
    tipo = serializers.CharField(source='property.tipo', read_only=True)
    area_m2 = serializers.FloatField(source='property.area_m2', read_only=True)
    quartos = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = ['id', 'titulo', 'aluguel', 'negociavel', 'cidade', 'estado', 'tipo', 'area_m2', 'quartos', 'foto_destaque', 'quality_score', 'views_count', 'favorites_count', 'published_at']

    def get_foto_destaque(self, obj):
        photo = obj.media.filter(tipo='FOTO', is_highlight=True).first() or obj.media.filter(tipo='FOTO').first()
        return {'url': photo.thumbnail_url or photo.url, 'id': str(photo.id)} if photo else None

    def get_quartos(self, obj):
        room = obj.property.rooms.filter(tipo='quartos').first()
        return room.quantidade if room else 0


class ListingDetailSerializer(serializers.ModelSerializer):
    property_rooms = RoomSerializer(source='property.rooms', many=True, read_only=True)
    property_features = serializers.JSONField(source='property.features', read_only=True)
    property_location = serializers.SerializerMethodField()
    medias = MediaThumbnailSerializer(source='media', many=True, read_only=True)
    owner = UserPublicSerializer(read_only=True)

    class Meta:
        model = Listing
        fields = ['id', 'titulo', 'descricao', 'extra_info', 'aluguel', 'negociavel', 'condominio_valor', 'condominio_incluido', 'iptu_valor', 'iptu_incluido', 'outras_taxas', 'garantia', 'status', 'views_count', 'favorites_count', 'quality_score', 'published_at', 'expires_at', 'property_rooms', 'property_features', 'property_location', 'medias', 'owner', 'created_at']

    def get_property_location(self, obj):
        return {'latitude': obj.property.location.y, 'longitude': obj.property.location.x} if obj.property.location else None


class ListingWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = ['property', 'titulo', 'descricao', 'extra_info', 'aluguel', 'negociavel', 'condominio_valor', 'condominio_incluido', 'iptu_valor', 'iptu_incluido', 'outras_taxas', 'garantia']

    def validate_property(self, value):
        if value.owner != self.context['request'].user:
            raise serializers.ValidationError('Você não é dono deste imóvel.')
        return value
