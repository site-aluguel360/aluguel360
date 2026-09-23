from rest_framework import serializers

from .models import Media, StorageQuota


class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ['id', 'property', 'listing', 'tipo', 'url', 'url_optimized', 'thumbnail_url', 'public_id', 'nome', 'tamanho_mb', 'largura', 'altura', 'duracao_segundos', 'formato', 'is_highlight', 'ordem', 'created_at']
        read_only_fields = ['id', 'url', 'url_optimized', 'thumbnail_url', 'public_id', 'tamanho_mb', 'created_at']


class StorageQuotaSerializer(serializers.ModelSerializer):
    usage_percent = serializers.FloatField(read_only=True)
    available_mb = serializers.FloatField(read_only=True)

    class Meta:
        model = StorageQuota
        fields = ['fotos_count', 'videos_count', 'total_mb_used', 'total_mb_limit', 'usage_percent', 'available_mb', 'updated_at']
        read_only_fields = fields
