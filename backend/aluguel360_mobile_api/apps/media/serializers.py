from rest_framework import serializers

from .models import Media, StorageQuota


class MediaSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    url_optimized = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()

    def _absolute_url(self, value):
        request = self.context.get('request')
        if request and value and value.startswith('/'):
            return request.build_absolute_uri(value)
        return value

    def get_url(self, obj):
        return self._absolute_url(obj.url)

    def get_url_optimized(self, obj):
        return self._absolute_url(obj.url_optimized)

    def get_thumbnail_url(self, obj):
        return self._absolute_url(obj.thumbnail_url)

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
