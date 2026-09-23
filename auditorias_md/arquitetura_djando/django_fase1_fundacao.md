# 🐍 SPEC KIT DJANGO — Backend Mobile Aluguel360
## FASE 1 de 4: Fundação, Arquitetura e Estrutura do Projeto

> **INSTRUÇÕES PARA IAs:** Este é o documento de fundação.
> Leia as 4 fases em ordem antes de implementar qualquer coisa.
> Cada fase termina com um checklist de verificação obrigatório.
> NÃO avance para a próxima fase sem completar o checklist da atual.

---

## 🗺️ VISÃO GERAL DO ECOSSISTEMA

O Aluguel360 terá **dois backends independentes e um banco de dados compartilhado**:

```
┌─────────────────────────────────────────────────────────────┐
│                    ALUGUEL360 — ECOSSISTEMA                  │
├─────────────────┬───────────────────────────────────────────┤
│  CLIENTES       │  BACKENDS                                  │
├─────────────────┼───────────────────────────────────────────┤
│                 │                                            │
│  React Web  ───►│  Node.js/Express API  ──┐                 │
│  (Browser)      │  (Web API - Port 3001)   │                 │
│                 │                          ▼                 │
│                 │                   PostgreSQL 16           │
│                 │                   (Banco Único)           │
│  React Native ─►│  Django/DRF API   ──────┘                 │
│  (iOS + Android)│  (Mobile API - Port 8000)                 │
│                 │                          │                 │
└─────────────────┴──────────────────────────┼────────────────┘
                                             │
                         ┌───────────────────┼────────────────┐
                         │   SERVIÇOS EXTERNOS                 │
                         ├──────────────────────────────────── ┤
                         │  Cloudinary (Fotos/Vídeos)          │
                         │  SMTP/SendGrid (Emails)             │
                         │  Firebase FCM (Push Notifications)  │
                         │  Redis (Cache + Celery Queue)       │
                         │  ViaCEP (Auto-preenchimento CEP)    │
                         └─────────────────────────────────────┘
```

> **DECISÃO ARQUITETURAL:** Os dois backends compartilham o mesmo PostgreSQL, mas cada um tem sua camada de autenticação (JWT próprios com secrets diferentes). Um token emitido pelo Django NÃO é válido no Node.js e vice-versa. Isso é intencional para isolamento de segurança.

---

## 📦 STACK TECNOLÓGICA OBRIGATÓRIA — DJANGO MOBILE

> **REGRA:** Use as versões exatas. Não substitua por alternativas.

| Camada | Tecnologia | Versão | Razão |
|--------|-----------|--------|-------|
| Linguagem | Python | 3.12 | Suporte longo, performance |
| Framework Web | Django | 5.1 | LTS, admin panel, ORM maduro |
| API REST | Django REST Framework (DRF) | 3.15 | Padrão da indústria Python |
| Autenticação JWT | djangorestframework-simplejwt | 5.3 | JWT moderno, refresh nativo |
| OAuth2 Social | django-allauth + dj-rest-auth | 64.x / 6.x | Google/Apple Sign-In |
| Banco de Dados | PostgreSQL | 16 | UUID, JSON, Full-Text, PostGIS |
| Driver DB | psycopg2-binary | 2.9 | Driver nativo PostgreSQL |
| Filtros/Busca | django-filter | 24.x | Filtros declarativos |
| Busca Full-Text | django-watson | latest | Search no PostgreSQL |
| Upload de Mídia | django-storages + boto3 | 1.14 / latest | S3-compatible storage |
| Storage em Nuvem | Cloudinary via cloudinary-storage | latest | Fotos/Vídeos otimizados |
| Compressão de Imagem | Pillow | 10.x | Processamento de imagem |
| Tarefas Assíncronas | Celery | 5.4 | Emails, notificações, processamento |
| Broker de Mensagens | Redis | 7.x (via django-redis) | Cache + Celery broker |
| Push Notifications | firebase-admin | 6.x | FCM para iOS e Android |
| Email | django.core.mail + SendGrid | nativo | OTP, notificações |
| CORS | django-cors-headers | 4.x | Requisições cross-origin |
| Rate Limiting | django-ratelimit | 4.x | Brute force protection |
| Geolocalização | GeoDjango + PostGIS | nativo | Busca por proximidade |
| Documentação API | drf-spectacular | 0.27 | OpenAPI 3.0 automático |
| Variáveis de Ambiente | python-decouple | 3.8 | .env seguro |
| Logs Estruturados | django-structlog | 8.x | JSON logs |
| Testes | pytest-django | 4.8 | Testes unitários e integração |
| WSGI/ASGI | gunicorn + uvicorn | latest | Servidor de produção |

---

## 🗂️ ESTRUTURA DE DIRETÓRIOS COMPLETA

```
aluguel360_mobile_api/          # Raiz do projeto Django
│
├── manage.py
├── requirements/
│   ├── base.txt                # Dependências comuns
│   ├── development.txt         # Dev: pytest, debug-toolbar
│   └── production.txt          # Prod: gunicorn, sentry-sdk
│
├── .env                        # NÃO commitar. Derivado do .env.example
├── .env.example                # Template público
├── pytest.ini                  # Configuração de testes
├── Dockerfile                  # Container Docker
├── docker-compose.yml          # Dev: Django + PostgreSQL + Redis
│
├── config/                     # Configurações do projeto Django
│   ├── __init__.py
│   ├── settings/
│   │   ├── __init__.py
│   │   ├── base.py             # Configurações comuns
│   │   ├── development.py      # Override para dev
│   │   └── production.py       # Override para prod
│   ├── urls.py                 # Router raiz
│   ├── wsgi.py                 # WSGI entry point
│   └── asgi.py                 # ASGI entry point (WebSockets futuros)
│
├── apps/                       # Apps Django (módulos de negócio)
│   │
│   ├── authentication/         # APP 1: Autenticação e JWT
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py           # OtpToken, DeviceToken (FCM)
│   │   ├── serializers.py      # RegisterSerializer, LoginSerializer
│   │   ├── views.py            # RegisterView, LoginView, OtpViews
│   │   ├── urls.py
│   │   ├── signals.py          # Pós-registro: enviar email boas-vindas
│   │   ├── tasks.py            # Celery: enviar OTP por email
│   │   └── tests/
│   │       ├── test_register.py
│   │       ├── test_login.py
│   │       └── test_otp.py
│   │
│   ├── users/                  # APP 2: Perfil e dados do usuário
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py           # User (Custom), Address, Session
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── permissions.py      # IsOwner, IsPropertyOwner
│   │   └── tests/
│   │
│   ├── properties/             # APP 3: Imóveis (entidade cadastral)
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py           # Property, Room
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── filters.py          # django-filter: tipo, cidade, quartos
│   │   └── tests/
│   │
│   ├── listings/               # APP 4: Anúncios (publicação pública)
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py           # Listing, Favorite, ListingView
│   │   ├── serializers.py      # ListingListSerializer, ListingDetailSerializer
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── filters.py          # Filtros de busca pública
│   │   ├── tasks.py            # Celery: expirar anúncios, calcular quality score
│   │   └── tests/
│   │
│   ├── media/                  # APP 5: Upload e gerenciamento de mídia
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py           # Media, StorageQuota
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── tasks.py            # Celery: comprimir imagem, gerar thumbnail
│   │   ├── utils.py            # Cloudinary helpers, validação de arquivo
│   │   └── tests/
│   │
│   ├── notifications/          # APP 6: Push Notifications e alertas
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py           # Notification, PushToken
│   │   ├── serializers.py
│   │   ├── views.py            # Registrar dispositivo FCM, listar notificações
│   │   ├── urls.py
│   │   ├── tasks.py            # Celery: enviar push via Firebase
│   │   └── tests/
│   │
│   └── search/                 # APP 7: Busca avançada (futuro: ElasticSearch)
│       ├── __init__.py
│       ├── apps.py
│       ├── views.py            # SearchView unificada
│       ├── urls.py
│       └── indexes.py          # django-watson search indexes
│
├── common/                     # Código compartilhado entre apps
│   ├── __init__.py
│   ├── exceptions.py           # Custom DRF exceptions
│   ├── pagination.py           # CursorPagination para mobile
│   ├── permissions.py          # Permissões globais reutilizáveis
│   ├── renderers.py            # JSONRenderer customizado (formato padrão)
│   ├── validators.py           # Validar CPF, CEP, telefone
│   └── utils.py                # Helpers gerais
│
└── static/                     # Arquivos estáticos (admin Django)
```

---

## ⚙️ CONFIGURAÇÃO DJANGO — `config/settings/base.py`

> **INSTRUÇÃO PARA IAs:** Este é o arquivo `base.py` completo. Implemente exatamente assim.

```python
# config/settings/base.py

from pathlib import Path
from decouple import config, Csv
import os

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = config('DJANGO_SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', cast=Csv())

# ── Apps Instalados
DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.gis',          # GeoDjango (localização)
]

THIRD_PARTY_APPS = [
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'django_filters',
    'drf_spectacular',
    'cloudinary',
    'cloudinary_storage',
    'storages',
    'watson',                       # Full-text search
    'django_structlog',             # JSON logging
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
]

LOCAL_APPS = [
    'apps.authentication',
    'apps.users',
    'apps.properties',
    'apps.listings',
    'apps.media',
    'apps.notifications',
    'apps.search',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

# ── Middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',        # CORS primeiro!
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
    'django_structlog.middlewares.RequestMiddleware',  # Logs
]

ROOT_URLCONF = 'config.urls'
WSGI_APPLICATION = 'config.wsgi.application'
ASGI_APPLICATION = 'config.asgi.application'

# ── Banco de Dados (PostgreSQL com PostGIS)
DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='5432'),
        'OPTIONS': {
            'connect_timeout': 10,
        },
        'CONN_MAX_AGE': 60,        # Connection pooling
    }
}

# ── Custom User Model
AUTH_USER_MODEL = 'users.User'

# ── Django REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_PAGINATION_CLASS': 'common.pagination.MobileCursorPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_RENDERER_CLASSES': [
        'common.renderers.StandardJsonRenderer',
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'EXCEPTION_HANDLER': 'common.exceptions.custom_exception_handler',
}

# ── JWT Configuration
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,         # Gerar novo refresh a cada uso
    'BLACKLIST_AFTER_ROTATION': True,      # Invalidar o antigo
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': config('JWT_SECRET'),
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}

# ── CORS
CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', cast=Csv())
CORS_ALLOW_CREDENTIALS = True

# ── Redis (Cache + Celery)
REDIS_URL = config('REDIS_URL', default='redis://localhost:6379/0')

CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': REDIS_URL,
        'OPTIONS': {'CLIENT_CLASS': 'django_redis.client.DefaultClient'},
        'TIMEOUT': 300,
    }
}

# ── Celery
CELERY_BROKER_URL = REDIS_URL
CELERY_RESULT_BACKEND = REDIS_URL
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_TIMEZONE = 'America/Sao_Paulo'

# ── Cloudinary Storage (Fotos e Vídeos)
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': config('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': config('CLOUDINARY_API_KEY'),
    'API_SECRET': config('CLOUDINARY_API_SECRET'),
}
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

# ── Email
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = config('SMTP_HOST', default='smtp.sendgrid.net')
EMAIL_PORT = config('SMTP_PORT', default=587, cast=int)
EMAIL_USE_TLS = True
EMAIL_HOST_USER = config('SMTP_USER')
EMAIL_HOST_PASSWORD = config('SMTP_PASS')
DEFAULT_FROM_EMAIL = config('EMAIL_FROM', default='noreply@aluguel360.com.br')

# ── Firebase (Push Notifications)
FIREBASE_CREDENTIALS_PATH = config('FIREBASE_CREDENTIALS_PATH', default='firebase_credentials.json')

# ── Internacionalização
LANGUAGE_CODE = 'pt-br'
TIME_ZONE = 'America/Sao_Paulo'
USE_I18N = True
USE_TZ = True

# ── Static Files
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# ── Documentação API (drf-spectacular)
SPECTACULAR_SETTINGS = {
    'TITLE': 'Aluguel360 Mobile API',
    'DESCRIPTION': 'API REST para o aplicativo móvel Aluguel360',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'COMPONENT_SPLIT_REQUEST': True,
}

# ── Logs Estruturados
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'json': {
            '()': 'django_structlog.formatters.FlatStructuredFormatter',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'json',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': config('LOG_LEVEL', default='INFO'),
    },
}
```

---

## 🌍 VARIÁVEIS DE AMBIENTE — `.env.example`

```env
# ─── Django Core
DJANGO_SECRET_KEY=your-50-chars-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
LOG_LEVEL=DEBUG

# ─── Banco de Dados PostgreSQL
DB_NAME=aluguel360
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

# ─── JWT
JWT_SECRET=your-jwt-secret-min-32-chars

# ─── Redis
REDIS_URL=redis://localhost:6379/0

# ─── CORS (origens permitidas)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,exp://192.168.0.1:8081

# ─── Cloudinary (Fotos e Vídeos)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# ─── Email SMTP
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
EMAIL_FROM=noreply@aluguel360.com.br

# ─── Firebase Push Notifications
FIREBASE_CREDENTIALS_PATH=firebase_credentials.json

# ─── OTP
OTP_EXPIRY_MINUTES=10
OTP_MAX_ATTEMPTS=3

# ─── Upload de Mídia (limites)
MAX_PHOTO_MB=10
MAX_VIDEO_MB=100
MAX_PHOTOS_PER_USER=50
MAX_VIDEOS_PER_USER=5
```

---

## 🐳 DOCKER COMPOSE — Ambiente de Desenvolvimento

```yaml
# docker-compose.yml

version: '3.9'

services:
  postgres:
    image: postgis/postgis:16-3.4
    environment:
      POSTGRES_DB: aluguel360
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  django:
    build: .
    command: python manage.py runserver 0.0.0.0:8000
    volumes:
      - .:/app
    ports:
      - "8000:8000"
    environment:
      - DJANGO_SETTINGS_MODULE=config.settings.development
    depends_on:
      - postgres
      - redis

  celery:
    build: .
    command: celery -A config worker -l info
    volumes:
      - .:/app
    environment:
      - DJANGO_SETTINGS_MODULE=config.settings.development
    depends_on:
      - postgres
      - redis

  celery-beat:
    build: .
    command: celery -A config beat -l info
    volumes:
      - .:/app
    environment:
      - DJANGO_SETTINGS_MODULE=config.settings.development
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
```

---

## 📡 ROTEAMENTO RAIZ — `config/urls.py`

```python
# config/urls.py

from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerUIView

API_PREFIX = 'api/v1/'

urlpatterns = [
    # Admin Django
    path('admin/', admin.site.urls),

    # Documentação OpenAPI
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerUIView.as_view(url_name='schema'), name='swagger-ui'),

    # Apps
    path(API_PREFIX + 'auth/', include('apps.authentication.urls')),
    path(API_PREFIX + 'users/', include('apps.users.urls')),
    path(API_PREFIX + 'properties/', include('apps.properties.urls')),
    path(API_PREFIX + 'listings/', include('apps.listings.urls')),
    path(API_PREFIX + 'media/', include('apps.media.urls')),
    path(API_PREFIX + 'notifications/', include('apps.notifications.urls')),
    path(API_PREFIX + 'search/', include('apps.search.urls')),
]
```

---

## 🔧 PAGINAÇÃO PARA MOBILE — `common/pagination.py`

> **DECISÃO TÉCNICA:** Apps mobile usam scroll infinito. Offset pagination quebra quando novos itens são inseridos. Cursor pagination é a solução correta.

```python
# common/pagination.py

from rest_framework.pagination import CursorPagination, PageNumberPagination
from rest_framework.response import Response


class MobileCursorPagination(CursorPagination):
    """
    Paginação por cursor para scroll infinito no mobile.
    O cursor é opaco para o cliente (string base64 encodada).
    """
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 50
    ordering = '-created_at'

    def get_paginated_response(self, data):
        return Response({
            'success': True,
            'data': {
                'results': data,
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
                'count': None,  # Cursor pagination não conta total (performance)
            }
        })


class StandardPagePagination(PageNumberPagination):
    """Para listagens administrativas onde offset é aceitável."""
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100
```

---

## 📐 RENDERER PADRÃO — `common/renderers.py`

```python
# common/renderers.py

from rest_framework.renderers import JSONRenderer
import json


class StandardJsonRenderer(JSONRenderer):
    """
    Envolve TODAS as respostas no formato:
    { "success": true/false, "data": {}, "message": "" }
    
    Views de sucesso retornam apenas 'data'.
    O error handler cuida das respostas de erro.
    """

    def render(self, data, accepted_media_type=None, renderer_context=None):
        response = renderer_context.get('response')
        
        if response and response.status_code >= 400:
            # Erro: deixa o exception handler formatar
            return super().render(data, accepted_media_type, renderer_context)
        
        wrapped = {
            'success': True,
            'data': data,
        }
        return super().render(wrapped, accepted_media_type, renderer_context)
```

---

## 🚨 EXCEPTION HANDLER — `common/exceptions.py`

```python
# common/exceptions.py

from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        error_data = {
            'success': False,
            'error': str(exc),
            'details': response.data if isinstance(response.data, (list, dict)) else {},
        }
        response.data = error_data

    return response
```

---

## ✅ CHECKLIST DA FASE 1

Antes de avançar para a Fase 2 (Models e Banco de Dados), confirme:

- [ ] Projeto criado com `django-admin startproject config .` dentro de `aluguel360_mobile_api/`
- [ ] Todos os apps criados com `python manage.py startapp` dentro de `apps/`
- [ ] `requirements/base.txt` instalado em virtualenv Python 3.12
- [ ] Arquivo `.env` criado a partir do `.env.example` com valores reais
- [ ] `docker-compose up` sobe PostgreSQL (PostGIS) e Redis sem erros
- [ ] `python manage.py check` retorna 0 erros
- [ ] `python manage.py migrate` executa sem erros
- [ ] `http://localhost:8000/admin/` carrega o painel Django
- [ ] `http://localhost:8000/api/docs/` carrega o Swagger UI
- [ ] `http://localhost:8000/api/v1/auth/` retorna 404 (ainda sem rotas, mas sem erro 500)

---

*Fase 1 de 4 — Próximo: Fase 2 — Modelos e Schema do Banco de Dados*
