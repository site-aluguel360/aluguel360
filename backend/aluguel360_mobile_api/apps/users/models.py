import uuid
import hashlib
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.contrib.gis.db import models as gis_models
from django.db import models
from django.utils import timezone


class UserRole(models.TextChoices):
    INQUILINO = 'INQUILINO', 'Inquilino'
    PROPRIETARIO = 'PROPRIETARIO', 'Proprietário'
    ADMIN = 'ADMIN', 'Administrador'


class UserManager(BaseUserManager):
    """Manager customizado para User com email como identificador."""

    def create_user(self, email, nome, cpf, senha=None, **extra_fields):
        if not email:
            raise ValueError('O email é obrigatório')
        if not cpf:
            raise ValueError('O CPF é obrigatório')
        email = self.normalize_email(email)
        cpf_hash = self.model.hash_cpf(cpf)
        user = self.model(email=email, nome=nome, cpf_hash=cpf_hash, **extra_fields)
        user.set_password(senha)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, nome, cpf, senha=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', UserRole.ADMIN)
        return self.create_user(email, nome, cpf, senha, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User Model — NUNCA use o User padrão do Django neste projeto.
    AUTH_USER_MODEL = 'users.User' já está configurado no settings.
    
    CPF é armazenado como hash SHA-256 para garantir unicidade sem expor o dado.
    O CPF real só trafega criptografado via HTTPS e nunca é armazenado em plain text.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=200)
    email = models.EmailField(unique=True, db_index=True)

    # CPF armazenado como HASH para unicidade + privacidade (LGPD)
    # cpf_hash = SHA-256(cpf_digits_only)
    cpf_hash = models.CharField(max_length=64, unique=True)

    telefone = models.CharField(max_length=20, blank=True, null=True)
    data_nascimento = models.DateField(blank=True, null=True)
    avatar_url = models.URLField(blank=True, null=True)
    avatar_public_id = models.CharField(max_length=200, blank=True, null=True)  # Cloudinary ID
    role = models.CharField(max_length=20, choices=UserRole.choices, default=UserRole.INQUILINO)
    email_verificado = models.BooleanField(default=False)

    # Django internos
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # Auditoria
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)  # Soft delete (LGPD)
    last_login_at = models.DateTimeField(null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nome', 'cpf_hash']

    class Meta:
        db_table = 'users'
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['cpf_hash']),
            models.Index(fields=['role']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.nome} <{self.email}>"

    @staticmethod
    def hash_cpf(cpf_raw: str) -> str:
        """Normaliza (remove pontos e traços) e retorna o hash SHA-256 do CPF."""
        cpf_digits = ''.join(filter(str.isdigit, cpf_raw))
        return hashlib.sha256(cpf_digits.encode()).hexdigest()

    def soft_delete(self):
        """LGPD: Marca como deletado mas não remove o registro."""
        self.deleted_at = timezone.now()
        self.is_active = False
        self.email = f"deleted_{self.id}@deleted.aluguel360"  # Libera o email
        self.save(update_fields=['deleted_at', 'is_active', 'email'])


class Address(models.Model):
    """Endereços associados a um usuário. Pode ter múltiplos, um como primário."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    cep = models.CharField(max_length=9)
    logradouro = models.CharField(max_length=300)
    numero = models.CharField(max_length=20)
    bairro = models.CharField(max_length=200)
    cidade = models.CharField(max_length=200)
    estado = models.CharField(max_length=2)  # UF
    complemento = models.CharField(max_length=200, blank=True)

    # Geolocalização (PostGIS) — preenchido via ViaCEP + geocoding
    location = gis_models.PointField(geography=True, null=True, blank=True)

    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'addresses'
        verbose_name = 'Endereço'
        verbose_name_plural = 'Endereços'

    def save(self, *args, **kwargs):
        # Garantir que só existe um endereço primário por usuário
        if self.is_primary:
            Address.objects.filter(user=self.user, is_primary=True).exclude(pk=self.pk).update(is_primary=False)
        super().save(*args, **kwargs)


class Session(models.Model):
    """Sessões de dispositivos para auditoria de segurança (tela PerfilSeguranca)."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    device_info = models.CharField(max_length=500, blank=True)  # User-Agent
    device_name = models.CharField(max_length=200, blank=True)  # "iPhone 15 Pro"
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    refresh_token_jti = models.CharField(max_length=100, blank=True)  # JTI do refresh token
    created_at = models.DateTimeField(auto_now_add=True)
    last_seen_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'sessions'
        indexes = [models.Index(fields=['user', 'is_active'])]
