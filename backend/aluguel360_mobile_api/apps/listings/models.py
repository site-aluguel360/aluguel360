import uuid
from django.db import models
from django.conf import settings
from apps.properties.models import Property


class GarantiaType(models.TextChoices):
    CAUCAO = 'CAUCAO', 'Caução'
    FIADOR = 'FIADOR', 'Fiador'
    SEM_GARANTIA = 'SEM_GARANTIA', 'Sem garantia'
    SEGURO_FIANCADO = 'SEGURO_FIANCADO', 'Seguro Fiançado'


class ListingStatus(models.TextChoices):
    RASCUNHO = 'RASCUNHO', 'Rascunho'
    PUBLICADO = 'PUBLICADO', 'Publicado'
    PAUSADO = 'PAUSADO', 'Pausado'
    EXPIRADO = 'EXPIRADO', 'Expirado'
    ALUGADO = 'ALUGADO', 'Alugado'


class Listing(models.Model):
    """
    Anúncio público de um imóvel.
    Um Property pode ter múltiplos Listings (histórico de anúncios).
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='listings')
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='listings'
    )

    titulo = models.CharField(max_length=300)
    descricao = models.TextField()
    extra_info = models.TextField(blank=True)

    # Valores financeiros — Decimal para precisão monetária
    aluguel = models.DecimalField(max_digits=10, decimal_places=2)
    negociavel = models.BooleanField(default=False)
    condominio_valor = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    condominio_incluido = models.BooleanField(default=False)
    iptu_valor = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    iptu_incluido = models.BooleanField(default=False)
    outras_taxas = models.TextField(blank=True)

    garantia = models.CharField(
        max_length=20,
        choices=GarantiaType.choices,
        default=GarantiaType.SEM_GARANTIA
    )

    status = models.CharField(
        max_length=20,
        choices=ListingStatus.choices,
        default=ListingStatus.RASCUNHO,
        db_index=True
    )

    # Métricas (para tela PerfilQualidade e PerfilMeusAnuncios)
    views_count = models.PositiveIntegerField(default=0)
    favorites_count = models.PositiveIntegerField(default=0)  # Cache denormalizado
    messages_count = models.PositiveIntegerField(default=0)   # Futuro: mensagens

    # Quality Score calculado pelo Celery (0-10)
    # Critérios: fotos, descrição, completude, tempo de resposta
    quality_score = models.FloatField(null=True, blank=True)

    # Datas de publicação
    published_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)  # Expiração automática (90 dias)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'listings'
        verbose_name = 'Anúncio'
        verbose_name_plural = 'Anúncios'
        indexes = [
            models.Index(fields=['status', 'published_at']),
            models.Index(fields=['owner', 'status']),
            models.Index(fields=['aluguel']),
            models.Index(fields=['quality_score']),
        ]

    def __str__(self):
        return f"[{self.status}] {self.titulo} — R$ {self.aluguel}"

    def calculate_quality_score(self) -> float:
        """
        Calcula o score de qualidade do anúncio (0-10).
        Critérios mapeados da tela PerfilQualidade.jsx.
        """
        score = 0.0
        fotos = self.media.filter(tipo='FOTO').count()
        if fotos >= 5:
            score += 3.0
        elif fotos >= 1:
            score += 1.5

        if len(self.descricao) >= 200:
            score += 2.5
        elif len(self.descricao) >= 100:
            score += 1.5

        if self.titulo and len(self.titulo) >= 20:
            score += 1.5

        prop = self.property
        if prop.location:
            score += 1.0
        if prop.area_m2:
            score += 1.0
        if prop.rooms.exists():
            score += 0.5

        return round(min(score, 10.0), 2)


class ListingView(models.Model):
    """
    Registra cada visualização de um anúncio.
    Permite análise de tendências e relatórios de engajamento.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='views')
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True  # Visualizações anônimas também são registradas
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=500, blank=True)
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'listing_views'
        indexes = [
            models.Index(fields=['listing', 'viewed_at']),
        ]


class Favorite(models.Model):
    """Imóveis favoritados pelo usuário (tela Favoritos)."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='favorites'
    )
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='favorites')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'favorites'
        unique_together = [['user', 'listing']]
        indexes = [models.Index(fields=['user', 'created_at'])]
