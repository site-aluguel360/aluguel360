import uuid
from django.db import models
from django.conf import settings
from apps.properties.models import Property
from apps.listings.models import Listing


class MediaType(models.TextChoices):
    FOTO = 'FOTO', 'Foto'
    VIDEO = 'VIDEO', 'Vídeo'


class Media(models.Model):
    """
    Mídias (fotos e vídeos) associadas a imóveis e anúncios.
    Armazenamento abstrato. Em desenvolvimento, os arquivos ficam em MEDIA_ROOT;
    Cloudinary pode ser habilitado posteriormente por ambiente.
    
    Suporta:
    - Fotos: JPEG, PNG, WebP (max 10MB)
    - Vídeos: MP4, MOV (max 100MB)
    - URLs e thumbnails compatíveis com storage local ou externo
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='media'
    )
    # Associação opcional — pode ser foto do perfil (sem property/listing)
    property = models.ForeignKey(
        Property,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='media'
    )
    listing = models.ForeignKey(
        Listing,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='media'
    )

    tipo = models.CharField(max_length=10, choices=MediaType.choices)

    # O public_id identifica o arquivo no backend de storage selecionado.
    url = models.URLField(max_length=500)                  # URL da mídia original
    url_optimized = models.URLField(max_length=500, blank=True)  # WebP otimizado
    thumbnail_url = models.URLField(max_length=500, blank=True)  # Thumb 400x300
    public_id = models.CharField(max_length=300, unique=True)    # ID no Cloudinary

    # Metadados
    nome = models.CharField(max_length=200, blank=True)
    tamanho_mb = models.FloatField()
    largura = models.PositiveIntegerField(null=True, blank=True)   # px (fotos)
    altura = models.PositiveIntegerField(null=True, blank=True)    # px (fotos)
    duracao_segundos = models.PositiveIntegerField(null=True, blank=True)  # (vídeos)
    formato = models.CharField(max_length=20, blank=True)          # jpeg, mp4, etc.

    # Controle de exibição
    is_highlight = models.BooleanField(default=False)  # Foto de destaque do anúncio
    ordem = models.PositiveSmallIntegerField(default=0)  # Ordem no carrossel

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'media'
        verbose_name = 'Mídia'
        verbose_name_plural = 'Mídias'
        ordering = ['ordem', 'created_at']
        indexes = [
            models.Index(fields=['user', 'tipo']),
            models.Index(fields=['property']),
            models.Index(fields=['listing', 'is_highlight']),
        ]

    def __str__(self):
        return f"[{self.tipo}] {self.nome or self.public_id}"


class StorageQuota(models.Model):
    """
    Quota de armazenamento por usuário.
    Mapeado da tela PerfilMidia.jsx — "156 MB / 1 GB".
    Atualizado via Celery signal após cada upload/delete.
    """

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='storage_quota',
        primary_key=True
    )
    fotos_count = models.PositiveIntegerField(default=0)
    videos_count = models.PositiveIntegerField(default=0)
    total_mb_used = models.FloatField(default=0.0)
    total_mb_limit = models.FloatField(default=1024.0)  # 1 GB padrão
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'storage_quotas'

    @property
    def usage_percent(self) -> float:
        if self.total_mb_limit == 0:
            return 0
        return round((self.total_mb_used / self.total_mb_limit) * 100, 1)

    @property
    def available_mb(self) -> float:
        return max(0, self.total_mb_limit - self.total_mb_used)
