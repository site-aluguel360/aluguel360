# 🐍 SPEC KIT DJANGO — Backend Mobile Aluguel360
## FASE 4 de 4: Segurança, Upload de Mídia, Deploy e Integração Mobile

> **REFLEXÃO ANTES DE IMPLEMENTAR:**
> Esta fase transforma o sistema de "funcional em dev" para "seguro em produção".
> Pontos críticos:
> 1. Upload de arquivo: validar MIME real (python-magic), não apenas extensão.
> 2. Segurança Django: HTTPS obrigatório, HSTS, Secure Cookies, CSP.
> 3. Rate limiting: senhas e OTP têm limites agressivos (3-10/min).
> 4. Push notifications: Firebase Admin SDK envia para iOS e Android via FCM.
> 5. Deploy: Nginx → Gunicorn → Django → PostgreSQL/Redis (nunca Django diretamente).

---

## 📦 REQUIREMENTS — Arquivos de Dependências

### `requirements/base.txt`

```txt
# ─── Django Core
Django==5.1.4
djangorestframework==3.15.2
djangorestframework-simplejwt==5.3.1
django-cors-headers==4.6.0
django-filter==24.3
python-decouple==3.8

# ─── Banco de Dados
psycopg2-binary==2.9.10
django-extensions==3.2.3

# ─── GeoDjango (PostGIS)
# GDAL e GEOS devem ser instalados no SO:
# Ubuntu: apt-get install gdal-bin python3-gdal libgeos-dev libproj-dev
# Docker: usar imagem postgis/postgis que já inclui

# ─── Autenticação Social
django-allauth==64.2.1
dj-rest-auth==6.0.0

# ─── Upload e Armazenamento de Mídia
cloudinary==1.41.0
cloudinary-storage==0.3.0
django-storages==1.14.4
Pillow==10.4.0
python-magic==0.4.27       # Validação de MIME real
boto3==1.35.80             # Compatibilidade S3 (backup)

# ─── Cache e Filas
django-redis==5.4.0
celery==5.4.0
redis==5.2.1
flower==2.0.1              # Monitoramento Celery (dev/staging)

# ─── Push Notifications
firebase-admin==6.6.0

# ─── Email
# Usa django.core.mail nativo (configurado via SMTP)
sendgrid==6.11.0           # Opcional: SDK SendGrid

# ─── Full-Text Search
django-watson==1.6.3

# ─── Documentação API
drf-spectacular==0.27.2

# ─── Rate Limiting
django-ratelimit==4.1.0

# ─── Logs Estruturados
django-structlog==8.1.0
structlog==24.4.0

# ─── Validação e Segurança
bcrypt==4.2.0
cryptography==43.0.3

# ─── Utilitários
Faker==30.0.0              # Dados de teste
```

### `requirements/development.txt`

```txt
-r base.txt

# Testes
pytest==8.3.4
pytest-django==4.9.0
pytest-cov==6.0.0
factory-boy==3.3.1         # Fixtures de test
model-bakery==1.20.0       # Fixtures simplificadas

# Debug
django-debug-toolbar==4.4.6
ipython==8.28.0
django-shell-plus          # Shell com auto-imports

# Qualidade de Código
black==24.10.0
isort==5.13.2
flake8==7.1.1
pre-commit==4.0.1
```

### `requirements/production.txt`

```txt
-r base.txt

# Servidor WSGI
gunicorn==23.0.0
uvicorn[standard]==0.32.1  # ASGI (futuro WebSockets)

# Monitoramento
sentry-sdk[django]==2.17.0
django-health-check==3.18.3

# Segurança
django-csp==3.8            # Content Security Policy
```

---

## 🔒 CONFIGURAÇÕES DE PRODUÇÃO — `config/settings/production.py`

```python
# config/settings/production.py

from .base import *

DEBUG = False

# ── Segurança HTTPS
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000          # 1 ano
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# ── Cookies Seguros
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'

# ── Content Security Policy (django-csp)
MIDDLEWARE += ['csp.middleware.CSPMiddleware']
CSP_DEFAULT_SRC = ("'self'",)
CSP_IMG_SRC = ("'self'", "data:", "https://res.cloudinary.com")
CSP_CONNECT_SRC = ("'self'", "https://api.cloudinary.com")

# ── Headers de Segurança
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'

# ── Banco de Dados com SSL
DATABASES['default']['OPTIONS']['sslmode'] = 'require'

# ── Static Files (WhiteNoise ou CDN)
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')

# ── Sentry (Error Tracking)
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration
from sentry_sdk.integrations.celery import CeleryIntegration

sentry_sdk.init(
    dsn=config('SENTRY_DSN', default=''),
    integrations=[DjangoIntegration(), CeleryIntegration()],
    traces_sample_rate=0.1,
    send_default_pii=False,  # LGPD: não enviar dados pessoais ao Sentry
)
```

---

## 🔒 CONFIGURAÇÃO DE DESENVOLVIMENTO — `config/settings/development.py`

```python
# config/settings/development.py

from .base import *

DEBUG = True

INSTALLED_APPS += ['debug_toolbar']
MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']
INTERNAL_IPS = ['127.0.0.1']

# Em dev, aceitar qualquer origem CORS
CORS_ALLOW_ALL_ORIGINS = True

# Emails no console (não envia de verdade em dev)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
```

---

## 🛡️ RATE LIMITING GRANULAR — `apps/authentication/views.py`

> **INSTRUÇÃO:** Rate limiting por IP + endpoint. Senhas e OTP têm limites agressivos.

```python
# apps/authentication/views.py

from django.views.decorators.cache import never_cache
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from .serializers import (
    RegisterSerializer, LoginSerializer,
    ForgotPasswordSerializer, VerifyOtpSerializer, ResetPasswordSerializer
)
from .models import OtpToken, DeviceToken
from .tasks import send_otp_email, send_welcome_email
from apps.users.models import User, Session


@method_decorator(ratelimit(key='ip', rate='5/m', method='POST', block=True), name='post')
class RegisterView(APIView):
    """POST /auth/register/ — Máx 5 registros por IP por minuto."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Gerar tokens JWT
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        # Criar sessão
        Session.objects.create(
            user=user,
            device_info=request.META.get('HTTP_USER_AGENT', ''),
            ip_address=request.META.get('REMOTE_ADDR'),
            refresh_token_jti=str(refresh['jti']),
        )

        # Email de boas-vindas (assíncrono)
        send_welcome_email.delay(str(user.id))

        return Response({
            'access_token': str(access),
            'refresh_token': str(refresh),
            'user': {
                'id': str(user.id),
                'nome': user.nome,
                'email': user.email,
                'role': user.role,
            }
        }, status=status.HTTP_201_CREATED)


@method_decorator(ratelimit(key='ip', rate='10/m', method='POST', block=True), name='post')
class LoginView(APIView):
    """POST /auth/login/ — Máx 10 tentativas por IP por minuto."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        # Registrar/atualizar sessão
        Session.objects.update_or_create(
            user=user,
            ip_address=request.META.get('REMOTE_ADDR'),
            defaults={
                'device_info': request.META.get('HTTP_USER_AGENT', ''),
                'is_active': True,
                'refresh_token_jti': str(refresh['jti']),
            }
        )

        # Atualizar last_login
        User.objects.filter(pk=user.pk).update(last_login_at=__import__('django.utils.timezone', fromlist=['timezone']).timezone.now())

        return Response({
            'access_token': str(access),
            'refresh_token': str(refresh),
            'user': {
                'id': str(user.id),
                'nome': user.nome,
                'email': user.email,
                'role': user.role,
                'avatar_url': user.avatar_url,
            }
        })


@method_decorator(ratelimit(key='ip', rate='3/h', method='POST', block=True), name='post')
class ForgotPasswordView(APIView):
    """
    POST /auth/forgot-password/
    Máx 3 solicitações de OTP por IP por hora — evita spam de email.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        try:
            user = User.objects.get(email=email, is_active=True)
            otp, code = OtpToken.create_for_user(user)
            # Celery: envia OTP por email (não bloqueia a resposta)
            send_otp_email.delay(user.email, user.nome, code)
        except User.DoesNotExist:
            pass  # Segurança: não revelar se email existe ou não

        # Sempre retorna sucesso (não revela se o email existe)
        return Response({'message': 'Se este email estiver cadastrado, você receberá um código.'})


@method_decorator(ratelimit(key='ip', rate='10/h', method='POST', block=True), name='post')
class VerifyOtpView(APIView):
    """POST /auth/verify-otp/ — Máx 10 verificações por hora."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOtpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        code = serializer.validated_data['codigo']

        try:
            user = User.objects.get(email=email)
            otp = OtpToken.objects.filter(
                user=user, used_at__isnull=True
            ).order_by('-created_at').first()

            if not otp or not otp.is_valid(code):
                return Response(
                    {'error': 'Código inválido ou expirado.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            # NÃO marca como usado ainda — só na troca de senha
            return Response({'message': 'Código verificado com sucesso.'})

        except User.DoesNotExist:
            return Response({'error': 'Código inválido.'}, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(APIView):
    """POST /auth/reset-password/ — Redefinir senha com OTP."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            user = User.objects.get(email=data['email'])
            otp = OtpToken.objects.filter(
                user=user, used_at__isnull=True
            ).order_by('-created_at').first()

            if not otp or not otp.is_valid(data['codigo']):
                return Response({'error': 'Código inválido.'}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(data['nova_senha'])
            user.save(update_fields=['password'])
            otp.mark_used()

            # Invalidar TODOS os tokens ativos do usuário (segurança)
            Session.objects.filter(user=user).update(is_active=False)

            return Response({'message': 'Senha redefinida com sucesso.'})

        except User.DoesNotExist:
            return Response({'error': 'Operação inválida.'}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """POST /auth/logout/ — Blacklist do refresh token."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()
            Session.objects.filter(
                user=request.user,
                refresh_token_jti=str(token['jti'])
            ).update(is_active=False)
            return Response({'message': 'Logout realizado com sucesso.'})
        except Exception:
            return Response({'error': 'Token inválido.'}, status=status.HTTP_400_BAD_REQUEST)


class RegisterDeviceView(APIView):
    """POST /auth/devices/register/ — Registrar token FCM para push notifications."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        token = request.data.get('token')
        platform = request.data.get('platform')  # 'ios' ou 'android'
        device_name = request.data.get('device_name', '')

        if not token or platform not in ['ios', 'android']:
            return Response({'error': 'Token e plataforma são obrigatórios.'}, status=400)

        DeviceToken.objects.update_or_create(
            token=token,
            defaults={
                'user': request.user,
                'platform': platform,
                'device_name': device_name,
                'is_active': True,
            }
        )
        return Response({'message': 'Dispositivo registrado.'})
```

---

## 📸 UPLOAD SEGURO DE MÍDIA — `apps/media/views.py`

```python
# apps/media/views.py

import magic  # python-magic: valida MIME real (não extensão)
import cloudinary.uploader
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from .models import Media, MediaType, StorageQuota
from .serializers import MediaSerializer, StorageQuotaSerializer
from .tasks import generate_thumbnail, update_storage_quota
from django.conf import settings


# Tipos MIME permitidos (validação real, não por extensão)
ALLOWED_PHOTO_MIMES = {'image/jpeg', 'image/png', 'image/webp', 'image/heic'}
ALLOWED_VIDEO_MIMES = {'video/mp4', 'video/quicktime', 'video/x-msvideo'}
ALL_ALLOWED_MIMES = ALLOWED_PHOTO_MIMES | ALLOWED_VIDEO_MIMES


class MediaViewSet(viewsets.ModelViewSet):
    serializer_class = MediaSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return Media.objects.filter(user=self.request.user).order_by('-created_at')

    @method_decorator(ratelimit(key='user', rate='30/h', method='POST', block=True))
    def upload(self, request):
        """
        POST /media/upload/
        Valida MIME real, verifica quota, faz upload para Cloudinary.
        Máx 30 uploads por hora por usuário.
        """
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'Arquivo não enviado.'}, status=400)

        # 1. Verificar MIME real (não confiar na extensão)
        file_bytes = file.read(2048)  # Ler apenas os primeiros 2KB para detecção
        file.seek(0)
        mime_type = magic.from_buffer(file_bytes, mime=True)

        if mime_type not in ALL_ALLOWED_MIMES:
            return Response({
                'error': f'Tipo de arquivo não permitido: {mime_type}'
            }, status=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)

        tipo = MediaType.FOTO if mime_type in ALLOWED_PHOTO_MIMES else MediaType.VIDEO

        # 2. Verificar tamanho
        tamanho_mb = file.size / (1024 * 1024)
        max_mb = settings.MAX_PHOTO_MB if tipo == MediaType.FOTO else settings.MAX_VIDEO_MB
        if tamanho_mb > max_mb:
            return Response({
                'error': f'Arquivo muito grande. Máximo: {max_mb}MB'
            }, status=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE)

        # 3. Verificar quota do usuário
        quota, _ = StorageQuota.objects.get_or_create(user=request.user)
        if quota.total_mb_used + tamanho_mb > quota.total_mb_limit:
            return Response({
                'error': 'Quota de armazenamento excedida.',
                'quota': StorageQuotaSerializer(quota).data
            }, status=status.HTTP_507_INSUFFICIENT_STORAGE)

        # 4. Verificar limites por tipo
        if tipo == MediaType.FOTO and quota.fotos_count >= settings.MAX_PHOTOS_PER_USER:
            return Response({'error': f'Limite de {settings.MAX_PHOTOS_PER_USER} fotos atingido.'}, status=400)
        if tipo == MediaType.VIDEO and quota.videos_count >= settings.MAX_VIDEOS_PER_USER:
            return Response({'error': f'Limite de {settings.MAX_VIDEOS_PER_USER} vídeos atingido.'}, status=400)

        # 5. Upload para Cloudinary
        resource_type = 'image' if tipo == MediaType.FOTO else 'video'
        folder = f"aluguel360/users/{request.user.id}/{resource_type}s"

        try:
            result = cloudinary.uploader.upload(
                file,
                folder=folder,
                resource_type=resource_type,
                quality='auto',
                fetch_format='auto' if tipo == MediaType.FOTO else None,
            )
        except Exception as e:
            return Response({'error': f'Erro no upload: {str(e)}'}, status=500)

        # 6. Salvar no banco
        property_id = request.data.get('property_id')
        listing_id = request.data.get('listing_id')

        media = Media.objects.create(
            user=request.user,
            property_id=property_id or None,
            listing_id=listing_id or None,
            tipo=tipo,
            url=result['secure_url'],
            public_id=result['public_id'],
            nome=request.data.get('nome', file.name),
            tamanho_mb=round(tamanho_mb, 2),
            largura=result.get('width'),
            altura=result.get('height'),
            duracao_segundos=int(result.get('duration', 0)) or None,
            formato=result.get('format', ''),
            is_highlight=request.data.get('is_highlight', False),
        )

        # 7. Celery: gerar thumbnail e atualizar quota (assíncronos)
        generate_thumbnail.delay(str(media.id))
        update_storage_quota.delay(str(request.user.id))

        return Response(MediaSerializer(media).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def set_highlight(self, request, pk=None):
        """POST /media/{id}/set-highlight/ — Define foto de destaque do anúncio."""
        media = self.get_object()
        if media.tipo != MediaType.FOTO:
            return Response({'error': 'Apenas fotos podem ser destaque.'}, status=400)

        # Remover destaque das outras fotos do mesmo anúncio
        if media.listing:
            Media.objects.filter(
                listing=media.listing, is_highlight=True
            ).exclude(pk=media.pk).update(is_highlight=False)

        media.is_highlight = True
        media.save(update_fields=['is_highlight'])
        return Response({'message': 'Foto de destaque definida.'})

    @action(detail=False, methods=['get'])
    def quota(self, request):
        """GET /media/quota/ — Quota de armazenamento (tela PerfilMidia)."""
        quota, _ = StorageQuota.objects.get_or_create(user=request.user)
        return Response(StorageQuotaSerializer(quota).data)

    def perform_destroy(self, instance):
        """Deletar do Cloudinary antes de deletar do banco."""
        import cloudinary.uploader as cu
        resource_type = 'image' if instance.tipo == MediaType.FOTO else 'video'
        try:
            cu.destroy(instance.public_id, resource_type=resource_type)
        except Exception:
            pass  # Se falhar no Cloudinary, ainda remove do banco
        instance.delete()
        update_storage_quota.delay(str(self.request.user.id))
```

---

## 🔔 PUSH NOTIFICATIONS — `apps/notifications/tasks.py`

```python
# apps/notifications/tasks.py

from celery import shared_task
from django.conf import settings
import firebase_admin
from firebase_admin import credentials, messaging
import logging

logger = logging.getLogger(__name__)

# Inicializar Firebase Admin SDK (singleton)
if not firebase_admin._apps:
    cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
    firebase_admin.initialize_app(cred)


@shared_task(bind=True, max_retries=3)
def send_push_notification(self, user_id: str, titulo: str, mensagem: str, data: dict = None):
    """
    Envia push notification via Firebase Cloud Messaging para todos os
    dispositivos ativos do usuário.
    
    Disparado por: novo favorito, nova mensagem, anúncio expirado, etc.
    """
    from apps.authentication.models import DeviceToken
    from apps.notifications.models import Notification, NotificationType
    from apps.users.models import User

    try:
        user = User.objects.get(id=user_id)
        tokens = list(
            DeviceToken.objects.filter(user=user, is_active=True)
            .values_list('token', flat=True)
        )

        if not tokens:
            return

        # Criar notificação in-app
        Notification.objects.create(
            user=user,
            tipo=data.get('tipo', NotificationType.SISTEMA),
            titulo=titulo,
            mensagem=mensagem,
            data=data or {},
        )

        # Enviar via FCM (Multi-cast para todos os dispositivos)
        message = messaging.MulticastMessage(
            notification=messaging.Notification(title=titulo, body=mensagem),
            data={k: str(v) for k, v in (data or {}).items()},  # FCM exige strings
            tokens=tokens,
            android=messaging.AndroidConfig(
                priority='high',
                notification=messaging.AndroidNotification(
                    sound='default',
                    click_action='FLUTTER_NOTIFICATION_CLICK',
                ),
            ),
            apns=messaging.APNSConfig(
                payload=messaging.APNSPayload(
                    aps=messaging.Aps(sound='default', badge=1)
                )
            ),
        )

        response = messaging.send_each_for_multicast(message)

        # Desativar tokens inválidos
        for i, result in enumerate(response.responses):
            if not result.success:
                error_code = result.exception.code if result.exception else None
                if error_code in ['registration-token-not-registered', 'invalid-argument']:
                    DeviceToken.objects.filter(token=tokens[i]).update(is_active=False)

        logger.info(f"Push enviado: user={user_id}, sucesso={response.success_count}, falha={response.failure_count}")

    except Exception as exc:
        logger.error(f"Erro no push notification: {exc}")
        raise self.retry(exc=exc, countdown=60)
```

---

## ⏰ CELERY BEAT — Tarefas Periódicas Agendadas

```python
# config/celery.py

import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')

app = Celery('aluguel360')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

app.conf.beat_schedule = {
    # Expirar anúncios — todos os dias à meia-noite
    'expire-old-listings': {
        'task': 'apps.listings.tasks.expire_old_listings',
        'schedule': crontab(hour=0, minute=0),
    },
    # Recalcular quality scores — toda hora
    'recalculate-quality-scores': {
        'task': 'apps.listings.tasks.recalculate_all_quality_scores',
        'schedule': crontab(minute=0),  # A cada hora
    },
    # Limpeza de OTPs expirados — toda hora
    'cleanup-expired-otps': {
        'task': 'apps.authentication.tasks.cleanup_expired_otps',
        'schedule': crontab(minute=30),  # xx:30 de cada hora
    },
    # Limpeza de sessions inativas — toda semana
    'cleanup-inactive-sessions': {
        'task': 'apps.users.tasks.cleanup_inactive_sessions',
        'schedule': crontab(hour=2, minute=0, day_of_week=0),  # Domingo 2h
    },
}
```

---

## 🌐 NGINX — Configuração de Produção

```nginx
# /etc/nginx/sites-available/aluguel360-django

upstream django_app {
    server 127.0.0.1:8000;
    keepalive 32;
}

server {
    listen 80;
    server_name api-mobile.aluguel360.com.br;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api-mobile.aluguel360.com.br;

    # SSL (Let's Encrypt via Certbot)
    ssl_certificate /etc/letsencrypt/live/api-mobile.aluguel360.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api-mobile.aluguel360.com.br/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Limites para upload de mídia
    client_max_body_size 110M;   # Máximo: 100MB vídeo + 10MB overhead
    client_body_timeout 120s;

    # Headers de Segurança
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # Rate Limiting no Nginx (complementar ao Django)
    limit_req_zone $binary_remote_addr zone=auth:10m rate=10r/m;
    limit_req_zone $binary_remote_addr zone=api:10m rate=200r/m;

    location /api/v1/auth/ {
        limit_req zone=auth burst=5 nodelay;
        proxy_pass http://django_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        limit_req zone=api burst=50 nodelay;
        proxy_pass http://django_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 90s;
    }

    location /admin/ {
        # Restringir admin a IPs específicos em produção
        allow 177.xxx.xxx.xxx;  # IP da equipe
        deny all;
        proxy_pass http://django_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static/ {
        alias /app/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 📱 INTEGRAÇÃO REACT NATIVE — Guia de Consumo da API

> **INSTRUÇÃO PARA DEVS MOBILE:** Configure o cliente HTTP no app React Native assim.

### `src/services/api.js` (React Native)

```javascript
// src/services/api.js — React Native / Expo

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = __DEV__
  ? 'http://192.168.0.100:8000/api/v1'   // IP local da máquina de dev
  : 'https://api-mobile.aluguel360.com.br/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Injeta Bearer token em toda requisição autenticada
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@aluguel360:accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Renovar token automaticamente se expirado (401)
api.interceptors.response.use(
  (response) => response.data.data,  // Extrai 'data' do wrapper { success, data }
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem('@aluguel360:refreshToken');
        const { data } = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });
        await AsyncStorage.setItem('@aluguel360:accessToken', data.data.access);
        originalRequest.headers.Authorization = `Bearer ${data.data.access}`;
        return api(originalRequest);
      } catch {
        // Refresh falhou → logout
        await AsyncStorage.multiRemove(['@aluguel360:accessToken', '@aluguel360:refreshToken']);
        // Navegar para Login (implementar via callback/event)
      }
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// Upload de mídia (multipart/form-data)
export const uploadMedia = async (fileUri, fileType, extraData = {}) => {
  const formData = new FormData();
  formData.append('file', {
    uri: fileUri,
    type: fileType,   // 'image/jpeg' ou 'video/mp4'
    name: `media_${Date.now()}.${fileType.split('/')[1]}`,
  });
  Object.entries(extraData).forEach(([k, v]) => formData.append(k, v));

  const token = await AsyncStorage.getItem('@aluguel360:accessToken');
  const response = await axios.post(`${BASE_URL}/media/upload/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
    onUploadProgress: (event) => {
      // Progresso do upload (0-100%)
      const percent = Math.round((event.loaded * 100) / event.total);
      console.log(`Upload: ${percent}%`);
    },
  });
  return response.data.data;
};

export default api;
```

### Registrar token FCM no login (React Native + Expo)

```javascript
// src/hooks/usePushNotifications.js

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import api from '../services/api';

export async function registerPushToken() {
  if (!Device.isDevice) return; // Simulador não suporta push

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  // Ou para FCM nativo: await Notifications.getDevicePushTokenAsync()

  await api.post('/auth/devices/register/', {
    token,
    platform: Platform.OS,  // 'ios' ou 'android'
    device_name: Device.deviceName,
  });
}
```

---

## 📊 DIAGRAMA COMPLETO DE DEPLOY

```
Internet
    │
    ▼
[CloudFlare CDN / DNS]
    │ HTTPS (443)
    ▼
[Nginx] ── /static/ → Arquivos estáticos locais
    │ proxy_pass
    ▼
[Gunicorn] (4 workers × 2 threads)
    │ WSGI
    ▼
[Django 5.1] ── settings/production.py
    │
    ├── [PostgreSQL 16 + PostGIS] ← Dados principais
    │
    ├── [Redis 7]  ← Cache + Celery Broker
    │
    ├── [Celery Workers] ← Tarefas assíncronas
    │   └── [Celery Beat]  ← Agendador cron
    │
    ├── [Cloudinary] ← Fotos e vídeos (CDN externo)
    │
    ├── [Firebase FCM] ← Push notifications iOS/Android
    │
    └── [SendGrid/SMTP] ← Emails transacionais
```

---

## ✅ CHECKLIST FINAL — FASE 4

### Segurança

- [ ] `DEBUG = False` em produção
- [ ] `SECURE_SSL_REDIRECT = True` ativo
- [ ] Cookies com `Secure=True` e `HttpOnly=True`
- [ ] Rate limiting ativo em `/auth/forgot-password/` (3/h por IP)
- [ ] Rate limiting ativo em `/auth/login/` (10/m por IP)
- [ ] Upload valida MIME real (python-magic), não extensão
- [ ] Cloudinary folder separado por usuário (`users/{user_id}/`)
- [ ] CPF não aparece em NENHUMA resposta de API (apenas `cpf_hash`)
- [ ] Admin Django restrito por IP no Nginx

### Mídia

- [ ] `POST /media/upload/` com JPEG → salva no Cloudinary e retorna URL
- [ ] `POST /media/upload/` com arquivo `.exe` → 415 Unsupported Media Type
- [ ] `POST /media/upload/` com arquivo > 10MB (foto) → 413 Too Large
- [ ] Thumbnail gerado via Celery após upload (verificar `thumbnail_url` no banco)
- [ ] Quota atualizada corretamente após upload e delete
- [ ] `GET /media/quota/` retorna `total_mb_used`, `total_mb_limit`, `usage_percent`

### Notificações

- [ ] `POST /auth/devices/register/` registra token FCM no banco
- [ ] `send_push_notification.delay(user_id, ...)` entrega notificação no dispositivo físico
- [ ] Tokens inválidos são automaticamente desativados após erro FCM
- [ ] Notificações in-app aparecem em `GET /notifications/`

### Deploy

- [ ] `gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 4` inicia sem erros
- [ ] Nginx repassa requisições para Gunicorn
- [ ] SSL/HTTPS funcionando (testar com `curl -I https://api-mobile.aluguel360.com.br/health`)
- [ ] `celery -A config worker` e `celery -A config beat` rodando como services systemd
- [ ] Sentry recebendo eventos de erro de produção

### Integração Mobile

- [ ] App React Native consegue fazer login e armazenar tokens
- [ ] Interceptor de renovação automática de token funciona
- [ ] Upload de foto do dispositivo funciona via `uploadMedia()`
- [ ] Push notification chega no dispositivo físico (iOS e Android)

---

## 📚 ÍNDICE DAS 4 FASES

| Fase | Documento | Conteúdo |
|------|-----------|----------|
| 1 | [django_fase1_fundacao.md](file:///C:/Users/LAB_01/.gemini/antigravity-ide/brain/3b37bc6b-a920-434d-86f0-2dacb93a6d9c/django_fase1_fundacao.md) | Arquitetura, stack, diretórios, settings base, Docker, URLs raiz |
| 2 | [django_fase2_models_banco.md](file:///C:/Users/LAB_01/.gemini/antigravity-ide/brain/3b37bc6b-a920-434d-86f0-2dacb93a6d9c/django_fase2_models_banco.md) | Todos os models Django, schema BD, diagrama ER, admin |
| 3 | [django_fase3_api_views.md](file:///C:/Users/LAB_01/.gemini/antigravity-ide/brain/3b37bc6b-a920-434d-86f0-2dacb93a6d9c/django_fase3_api_views.md) | Serializers, ViewSets, filtros, tasks Celery, tabela de endpoints |
| 4 | [django_fase4_seguranca_deploy.md](file:///C:/Users/LAB_01/.gemini/antigravity-ide/brain/3b37bc6b-a920-434d-86f0-2dacb93a6d9c/django_fase4_seguranca_deploy.md) | Segurança, upload seguro, Firebase, Nginx, React Native, deploy |

---

*Fase 4 de 4 — Spec Kit Django Aluguel360 Mobile API — COMPLETO*  
*Gerado por: Antigravity AI — 23/09/2026 | Versão: 1.0.0*
