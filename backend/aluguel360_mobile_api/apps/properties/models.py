import uuid
from django.contrib.gis.db import models as gis_models
from django.db import models
from django.conf import settings


class PropertyType(models.TextChoices):
    CASA = 'CASA', 'Casa'
    APARTAMENTO = 'APARTAMENTO', 'Apartamento'
    KITNET = 'KITNET', 'Kitnet'
    COMODO = 'COMODO', 'Cômodo'
    OUTRO = 'OUTRO', 'Outro'


class PropertyStatus(models.TextChoices):
    RASCUNHO = 'RASCUNHO', 'Rascunho'
    ATIVO = 'ATIVO', 'Ativo'
    INATIVO = 'INATIVO', 'Inativo'
    ALUGADO = 'ALUGADO', 'Alugado'


class Property(models.Model):
    """
    Entidade física do imóvel. Separada do anúncio (Listing).
    Um imóvel pode ter múltiplos anúncios ao longo do tempo.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='properties'
    )
    tipo = models.CharField(max_length=20, choices=PropertyType.choices)
    area_m2 = models.FloatField(help_text='Área em metros quadrados')

    # Localização
    cep = models.CharField(max_length=9)
    logradouro = models.CharField(max_length=300)
    numero = models.CharField(max_length=20)
    bairro = models.CharField(max_length=200)
    cidade = models.CharField(max_length=200, db_index=True)
    estado = models.CharField(max_length=2, db_index=True)
    complemento = models.CharField(max_length=200, blank=True)
    referencia = models.CharField(max_length=300, blank=True)

    # Geolocalização PostGIS (para busca "Imóveis perto de mim")
    location = gis_models.PointField(geography=True, null=True, blank=True)

    # Características flexíveis (JSON — mapeado do frontend CadastroImovel.jsx)
    # Exemplo: {"pets": true, "mobiliado": false, "portaria": true, ...}
    features = models.JSONField(default=dict, blank=True)

    status = models.CharField(
        max_length=20,
        choices=PropertyStatus.choices,
        default=PropertyStatus.RASCUNHO,
        db_index=True
    )

    # Auditoria
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)  # Soft delete

    class Meta:
        db_table = 'properties'
        verbose_name = 'Imóvel'
        verbose_name_plural = 'Imóveis'
        indexes = [
            models.Index(fields=['owner', 'status']),
            models.Index(fields=['cidade', 'estado']),
            models.Index(fields=['tipo']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.tipo} — {self.logradouro}, {self.numero}, {self.cidade}"


class PropertyRoom(models.Model):
    """
    Cômodos de um imóvel.
    Separado em tabela própria para permitir queries como 'imóveis com 3+ quartos'.
    Mapeado dos campos rooms[] do CadastroImovel.jsx.
    """

    ROOM_TYPES = [
        ('quartos', 'Quartos'),
        ('suites', 'Suítes'),
        ('banheiros', 'Banheiros'),
        ('salas', 'Salas'),
        ('garagem', 'Garagem'),
        ('varandas', 'Varandas'),
        ('outros', 'Outros'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='rooms')
    tipo = models.CharField(max_length=30, choices=ROOM_TYPES)
    quantidade = models.PositiveSmallIntegerField(default=0)

    class Meta:
        db_table = 'property_rooms'
        unique_together = [['property', 'tipo']]
