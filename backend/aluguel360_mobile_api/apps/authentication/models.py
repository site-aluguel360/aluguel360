import uuid
import secrets
from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta


class OtpToken(models.Model):
    """
    Tokens OTP para recuperação de senha.
    O código é armazenado como hash bcrypt (nunca em plain text).
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='otp_tokens'
    )
    # Código de 6 dígitos hasheado com bcrypt
    code_hash = models.CharField(max_length=128)
    attempts = models.PositiveSmallIntegerField(default=0)
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'otp_tokens'
        indexes = [models.Index(fields=['user', 'created_at'])]

    @classmethod
    def create_for_user(cls, user):
        """Gera um novo OTP, invalida os anteriores, retorna o código plain para envio."""
        # Invalidar OTPs anteriores do usuário
        cls.objects.filter(user=user, used_at__isnull=True).update(
            used_at=timezone.now()
        )
        code = ''.join([str(secrets.randbelow(10)) for _ in range(6)])
        import bcrypt
        code_hash = bcrypt.hashpw(code.encode(), bcrypt.gensalt()).decode()
        
        # We need to ensure we use settings correctly. 
        # For OTP_EXPIRY_MINUTES we will default to 15 if not set
        expiry_minutes = getattr(settings, 'OTP_EXPIRY_MINUTES', 15)
        
        otp = cls.objects.create(
            user=user,
            code_hash=code_hash,
            expires_at=timezone.now() + timedelta(minutes=expiry_minutes),
        )
        return otp, code  # code é enviado por email, code_hash fica no banco

    def is_valid(self, code_plain: str) -> bool:
        """Verifica o código e incrementa tentativas."""
        import bcrypt
        if self.used_at or self.expires_at < timezone.now():
            return False
            
        max_attempts = getattr(settings, 'OTP_MAX_ATTEMPTS', 3)
        if self.attempts >= max_attempts:
            return False
            
        self.attempts += 1
        self.save(update_fields=['attempts'])
        return bcrypt.checkpw(code_plain.encode(), self.code_hash.encode())

    def mark_used(self):
        self.used_at = timezone.now()
        self.save(update_fields=['used_at'])


class DeviceToken(models.Model):
    """
    Tokens FCM dos dispositivos para push notifications.
    Um usuário pode ter múltiplos dispositivos (iOS + Android).
    """

    PLATFORM_CHOICES = [
        ('ios', 'iOS'),
        ('android', 'Android'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='device_tokens'
    )
    token = models.CharField(max_length=500, unique=True)
    platform = models.CharField(max_length=10, choices=PLATFORM_CHOICES)
    device_name = models.CharField(max_length=200, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'device_tokens'
        indexes = [models.Index(fields=['user', 'is_active'])]
