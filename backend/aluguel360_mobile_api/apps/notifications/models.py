import uuid
from django.db import models
from django.conf import settings


class NotificationType(models.TextChoices):
    NOVO_FAVORITO = 'NOVO_FAVORITO', 'Novo Favorito'
    NOVA_MENSAGEM = 'NOVA_MENSAGEM', 'Nova Mensagem'
    ANUNCIO_EXPIRADO = 'ANUNCIO_EXPIRADO', 'Anúncio Expirado'
    OTP_ENVIADO = 'OTP_ENVIADO', 'OTP Enviado'
    BOAS_VINDAS = 'BOAS_VINDAS', 'Boas-vindas'
    SISTEMA = 'SISTEMA', 'Sistema'


class Notification(models.Model):
    """
    Notificações in-app. Sincronizado com push notifications Firebase.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    tipo = models.CharField(max_length=30, choices=NotificationType.choices)
    titulo = models.CharField(max_length=200)
    mensagem = models.TextField()
    data = models.JSONField(default=dict, blank=True)  # Dados extras (listing_id, etc.)
    lida = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'lida', 'created_at']),
        ]
