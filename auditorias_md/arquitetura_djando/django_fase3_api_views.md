# 🐍 SPEC KIT DJANGO — Backend Mobile Aluguel360
## FASE 3 de 4: Serializers, Views, URLs, Filtros e Tarefas Assíncronas

> **REFLEXÃO ANTES DE IMPLEMENTAR:**
> Esta fase é a mais extensa. Princípios que guiam as decisões aqui:
> 1. Serializers de LEITURA separados dos de ESCRITA — feeds mobile precisam de menos campos.
> 2. ViewSets com actions customizadas (`@action`) para operações específicas (favoritar, publicar).
> 3. Filtros declarativos (django-filter) para TODOS os parâmetros de busca do app.
> 4. Celery tasks para TUDO que bloqueia uma requisição: email, push, compressão de imagem.
> 5. Permissões customizadas para garantir que só o dono edita/deleta seus recursos.

---

## 📋 TABELA COMPLETA DE ENDPOINTS DA API MOBILE

**Base URL:** `http://localhost:8000/api/v1/`

### Autenticação (`/auth/`)

| Método | Endpoint | Auth | Descrição | Tela Frontend |
|--------|----------|------|-----------|---------------|
| POST | `/auth/register/` | ❌ | Cadastrar usuário | CadastroUsuario |
| POST | `/auth/login/` | ❌ | Login email+senha → JWT | Login |
| POST | `/auth/token/refresh/` | ❌ | Renovar access token | Automático |
| POST | `/auth/logout/` | ✅ | Blacklist refresh token | Logout |
| POST | `/auth/forgot-password/` | ❌ | Enviar OTP por email | RecuperarSenha step 1 |
| POST | `/auth/verify-otp/` | ❌ | Verificar código OTP | RecuperarSenha step 2 |
| POST | `/auth/reset-password/` | ❌ | Redefinir senha com OTP | RecuperarSenha step 3 |
| POST | `/auth/social/google/` | ❌ | Login com Google | Login (Acessar com Google) |
| POST | `/auth/devices/register/` | ✅ | Registrar token FCM | App mobile boot |
| DELETE | `/auth/devices/{id}/` | ✅ | Remover token FCM | Logout |

### Usuários (`/users/`)

| Método | Endpoint | Auth | Descrição | Tela Frontend |
|--------|----------|------|-----------|---------------|
| GET | `/users/me/` | ✅ | Dados do usuário autenticado | Perfil |
| PATCH | `/users/me/` | ✅ | Atualizar perfil | EditProfile |
| DELETE | `/users/me/` | ✅ | Soft delete (LGPD) | PerfilPrivacidade |
| GET | `/users/me/addresses/` | ✅ | Listar endereços | PerfilEnderecos |
| POST | `/users/me/addresses/` | ✅ | Adicionar endereço | PerfilEnderecos |
| PATCH | `/users/me/addresses/{id}/` | ✅ | Editar endereço | PerfilEnderecos |
| DELETE | `/users/me/addresses/{id}/` | ✅ | Remover endereço | PerfilEnderecos |
| GET | `/users/me/sessions/` | ✅ | Listar dispositivos | PerfilSeguranca |
| DELETE | `/users/me/sessions/{id}/` | ✅ | Desconectar dispositivo | PerfilSeguranca |
| GET | `/users/me/stats/` | ✅ | Estatísticas do usuário | Perfil (cards) |
| GET | `/users/me/favorites/` | ✅ | Imóveis favoritados | Favoritos |

### Imóveis (`/properties/`)

| Método | Endpoint | Auth | Descrição | Tela Frontend |
|--------|----------|------|-----------|---------------|
| GET | `/properties/` | ✅ | Meus imóveis | PerfilMeusImoveis |
| POST | `/properties/` | ✅ | Cadastrar imóvel (steps 1-3) | CadastroImovel |
| GET | `/properties/{id}/` | ✅ | Detalhe do imóvel | CadastroImovel preview |
| PATCH | `/properties/{id}/` | ✅ | Editar imóvel | PerfilMeusImoveis |
| DELETE | `/properties/{id}/` | ✅ | Remover imóvel (soft delete) | PerfilMeusImoveis |

### Anúncios (`/listings/`)

| Método | Endpoint | Auth | Descrição | Tela Frontend |
|--------|----------|------|-----------|---------------|
| GET | `/listings/` | ❌ | Busca pública com filtros | ResultadosPesquisa |
| GET | `/listings/featured/` | ❌ | 6 anúncios em destaque | Home |
| GET | `/listings/nearby/` | ❌ | Anúncios perto de mim (GPS) | App Mobile |
| GET | `/listings/{id}/` | ❌ | Detalhe do anúncio | Detalhe (futuro) |
| POST | `/listings/` | ✅ | Criar anúncio (steps 4-5) | CadastroImovel |
| PATCH | `/listings/{id}/` | ✅ | Editar anúncio | PerfilMeusAnuncios |
| DELETE | `/listings/{id}/` | ✅ | Remover anúncio | PerfilMeusAnuncios |
| POST | `/listings/{id}/publish/` | ✅ | Publicar anúncio | PerfilMeusAnuncios |
| POST | `/listings/{id}/pause/` | ✅ | Pausar anúncio | PerfilMeusAnuncios |
| POST | `/listings/{id}/favorite/` | ✅ | Toggle favorito | Favoritar |
| GET | `/listings/mine/` | ✅ | Meus anúncios | PerfilMeusAnuncios |

### Mídia (`/media/`)

| Método | Endpoint | Auth | Descrição | Tela Frontend |
|--------|----------|------|-----------|---------------|
| GET | `/media/` | ✅ | Listar mídias do usuário | PerfilMidia |
| POST | `/media/upload/` | ✅ | Upload de foto/vídeo | CadastroImovel step 5 |
| PATCH | `/media/{id}/` | ✅ | Editar metadados (nome, ordem) | PerfilMidia |
| DELETE | `/media/{id}/` | ✅ | Deletar mídia (Cloudinary+DB) | PerfilMidia |
| POST | `/media/{id}/set-highlight/` | ✅ | Definir foto de destaque | PerfilMidia |
| GET | `/media/quota/` | ✅ | Quota de armazenamento | PerfilMidia |

### Notificações (`/notifications/`)

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| GET | `/notifications/` | ✅ | Listar notificações do usuário |
| PATCH | `/notifications/{id}/read/` | ✅ | Marcar como lida |
| POST | `/notifications/read-all/` | ✅ | Marcar todas como lidas |

### Busca (`/search/`)

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| GET | `/search/?q=string` | ❌ | Busca full-text unificada |

---

## 🗂️ SERIALIZERS — `apps/authentication/serializers.py`

```python
# apps/authentication/serializers.py

from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from apps.users.models import User, Address
import re


class AddressWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['cep', 'logradouro', 'numero', 'bairro', 'cidade', 'estado', 'complemento']


class RegisterSerializer(serializers.Serializer):
    """Mapeado exatamente dos campos do CadastroUsuario.jsx."""

    nome = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    cpf = serializers.CharField(max_length=14)  # "123.456.789-10"
    senha = serializers.CharField(write_only=True, min_length=8)
    confirmar_senha = serializers.CharField(write_only=True)
    telefone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    data_nascimento = serializers.DateField(required=False, allow_null=True)
    endereco = AddressWriteSerializer(required=False)

    def validate_cpf(self, cpf):
        """Valida formato e algoritmo do CPF brasileiro."""
        digits = re.sub(r'\D', '', cpf)
        if len(digits) != 11:
            raise serializers.ValidationError('CPF inválido.')
        if len(set(digits)) == 1:
            raise serializers.ValidationError('CPF inválido.')
        # Algoritmo de validação dos dígitos verificadores
        for i in range(9, 11):
            s = sum(int(digits[j]) * (i + 1 - j) for j in range(i))
            expected = (s * 10 % 11) % 10
            if expected != int(digits[i]):
                raise serializers.ValidationError('CPF inválido.')
        return cpf

    def validate_email(self, email):
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError('Este email já está cadastrado.')
        return email

    def validate(self, data):
        if data['senha'] != data['confirmar_senha']:
            raise serializers.ValidationError({'confirmar_senha': 'As senhas não coincidem.'})

        cpf_hash = User.hash_cpf(data['cpf'])
        if User.objects.filter(cpf_hash=cpf_hash).exists():
            raise serializers.ValidationError({'cpf': 'Este CPF já está cadastrado.'})
        data['cpf_hash'] = cpf_hash

        try:
            validate_password(data['senha'])
        except Exception as e:
            raise serializers.ValidationError({'senha': list(e.messages)})

        return data

    def create(self, validated_data):
        endereco_data = validated_data.pop('endereco', None)
        validated_data.pop('confirmar_senha')
        validated_data.pop('cpf')
        senha = validated_data.pop('senha')

        user = User.objects.create_user(
            email=validated_data['email'],
            nome=validated_data['nome'],
            cpf=validated_data['cpf_hash'],  # Já hasheado
            senha=senha,
            **{k: v for k, v in validated_data.items() if k not in ['email', 'nome', 'cpf_hash']}
        )

        if endereco_data:
            Address.objects.create(user=user, is_primary=True, **endereco_data)

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    senha = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(
            request=self.context.get('request'),
            email=data['email'],
            password=data['senha']
        )
        if not user:
            raise serializers.ValidationError('Email ou senha incorretos.')
        if not user.is_active:
            raise serializers.ValidationError('Conta desativada.')
        data['user'] = user
        return data


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class VerifyOtpSerializer(serializers.Serializer):
    email = serializers.EmailField()
    codigo = serializers.CharField(min_length=6, max_length=6)


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    codigo = serializers.CharField(min_length=6, max_length=6)
    nova_senha = serializers.CharField(write_only=True, min_length=8)
    confirmar_nova_senha = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['nova_senha'] != data['confirmar_nova_senha']:
            raise serializers.ValidationError({'confirmar_nova_senha': 'As senhas não coincidem.'})
        return data
```

---

## 🗂️ SERIALIZERS — `apps/users/serializers.py`

```python
# apps/users/serializers.py

from rest_framework import serializers
from .models import User, Address, Session


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'cep', 'logradouro', 'numero', 'bairro',
                  'cidade', 'estado', 'complemento', 'is_primary', 'created_at']
        read_only_fields = ['id', 'created_at']


class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ['id', 'device_name', 'device_info', 'ip_address',
                  'is_active', 'created_at', 'last_seen_at']
        read_only_fields = fields


class UserPublicSerializer(serializers.ModelSerializer):
    """Versão pública (para outros usuários verem o dono do anúncio)."""
    class Meta:
        model = User
        fields = ['id', 'nome', 'avatar_url', 'created_at']


class UserMeSerializer(serializers.ModelSerializer):
    """Versão completa para o próprio usuário autenticado."""
    addresses = AddressSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'nome', 'email', 'telefone', 'data_nascimento',
                  'avatar_url', 'role', 'email_verificado', 'created_at', 'addresses']
        read_only_fields = ['id', 'email', 'role', 'email_verificado', 'created_at']


class UserUpdateSerializer(serializers.ModelSerializer):
    """Para PATCH /users/me/ — apenas campos editáveis."""
    class Meta:
        model = User
        fields = ['nome', 'telefone', 'data_nascimento']


class UserStatsSerializer(serializers.Serializer):
    """Resposta do endpoint /users/me/stats/ — para os cards da tela Perfil."""
    imoveis_cadastrados = serializers.IntegerField()
    imoveis_publicados = serializers.IntegerField()
    imoveis_alugados = serializers.IntegerField()
    imoveis_rascunho = serializers.IntegerField()
    anuncios_ativos = serializers.IntegerField()
    total_visualizacoes = serializers.IntegerField()
    total_favoritos = serializers.IntegerField()
    quality_score_medio = serializers.FloatField()
```

---

## 🗂️ SERIALIZERS — `apps/listings/serializers.py`

```python
# apps/listings/serializers.py

from rest_framework import serializers
from apps.properties.models import Property, PropertyRoom
from apps.media.models import Media
from apps.users.serializers import UserPublicSerializer
from .models import Listing


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyRoom
        fields = ['tipo', 'quantidade']


class MediaThumbnailSerializer(serializers.ModelSerializer):
    """Versão mínima de mídia para feeds de listagem."""
    class Meta:
        model = Media
        fields = ['id', 'thumbnail_url', 'url_optimized', 'tipo', 'is_highlight']


class ListingListSerializer(serializers.ModelSerializer):
    """
    VERSÃO ENXUTA para feeds (ResultadosPesquisa, Home).
    Minimiza payload para performance mobile.
    """
    foto_destaque = serializers.SerializerMethodField()
    cidade = serializers.CharField(source='property.cidade')
    estado = serializers.CharField(source='property.estado')
    tipo = serializers.CharField(source='property.tipo')
    area_m2 = serializers.FloatField(source='property.area_m2')
    quartos = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = [
            'id', 'titulo', 'aluguel', 'negociavel',
            'cidade', 'estado', 'tipo', 'area_m2', 'quartos',
            'foto_destaque', 'quality_score', 'views_count', 'favorites_count',
            'published_at',
        ]

    def get_foto_destaque(self, obj):
        foto = obj.media.filter(tipo='FOTO', is_highlight=True).first()
        if not foto:
            foto = obj.media.filter(tipo='FOTO').first()
        if foto:
            return {'url': foto.thumbnail_url or foto.url, 'id': str(foto.id)}
        return None

    def get_quartos(self, obj):
        room = obj.property.rooms.filter(tipo='quartos').first()
        return room.quantidade if room else 0


class ListingDetailSerializer(serializers.ModelSerializer):
    """
    VERSÃO COMPLETA para tela de detalhe do anúncio.
    Inclui todos os campos, fotos, proprietário.
    """
    property_rooms = RoomSerializer(source='property.rooms', many=True)
    property_features = serializers.JSONField(source='property.features')
    property_location = serializers.SerializerMethodField()
    medias = MediaThumbnailSerializer(source='media', many=True)
    owner = UserPublicSerializer()

    class Meta:
        model = Listing
        fields = [
            'id', 'titulo', 'descricao', 'extra_info',
            'aluguel', 'negociavel',
            'condominio_valor', 'condominio_incluido',
            'iptu_valor', 'iptu_incluido',
            'outras_taxas', 'garantia',
            'status', 'views_count', 'favorites_count',
            'quality_score', 'published_at', 'expires_at',
            'property_rooms', 'property_features', 'property_location',
            'medias', 'owner', 'created_at',
        ]

    def get_property_location(self, obj):
        prop = obj.property
        if prop.location:
            return {'latitude': prop.location.y, 'longitude': prop.location.x}
        return None


class ListingWriteSerializer(serializers.ModelSerializer):
    """Para POST/PATCH de anúncios."""
    class Meta:
        model = Listing
        fields = [
            'property', 'titulo', 'descricao', 'extra_info',
            'aluguel', 'negociavel',
            'condominio_valor', 'condominio_incluido',
            'iptu_valor', 'iptu_incluido',
            'outras_taxas', 'garantia',
        ]

    def validate_property(self, property):
        request = self.context['request']
        if property.owner != request.user:
            raise serializers.ValidationError('Você não é dono deste imóvel.')
        return property
```

---

## 🔍 FILTROS — `apps/listings/filters.py`

```python
# apps/listings/filters.py

import django_filters
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from .models import Listing


class ListingFilter(django_filters.FilterSet):
    """
    Filtros mapeados dos componentes do frontend:
    - BarraFiltros.jsx (tipo, cidade)
    - FiltroLateral.jsx (cômodos, características)
    - FiltroPreco.jsx (preço min/max)
    """

    # Tipo de imóvel
    tipo = django_filters.CharFilter(field_name='property__tipo', lookup_expr='iexact')

    # Localização
    cidade = django_filters.CharFilter(field_name='property__cidade', lookup_expr='icontains')
    estado = django_filters.CharFilter(field_name='property__estado', lookup_expr='iexact')
    bairro = django_filters.CharFilter(field_name='property__bairro', lookup_expr='icontains')

    # Preço
    preco_min = django_filters.NumberFilter(field_name='aluguel', lookup_expr='gte')
    preco_max = django_filters.NumberFilter(field_name='aluguel', lookup_expr='lte')

    # Cômodos
    quartos_min = django_filters.NumberFilter(method='filter_quartos_min')
    banheiros_min = django_filters.NumberFilter(method='filter_banheiros_min')
    garagem_min = django_filters.NumberFilter(method='filter_garagem_min')

    # Área
    area_min = django_filters.NumberFilter(field_name='property__area_m2', lookup_expr='gte')
    area_max = django_filters.NumberFilter(field_name='property__area_m2', lookup_expr='lte')

    # Características booleanas (do features JSON)
    pets = django_filters.BooleanFilter(method='filter_feature')
    mobiliado = django_filters.BooleanFilter(method='filter_feature')
    portaria = django_filters.BooleanFilter(method='filter_feature')
    condominio_incluido = django_filters.BooleanFilter(field_name='condominio_incluido')
    iptu_incluido = django_filters.BooleanFilter(field_name='iptu_incluido')

    # Geolocalização — "perto de mim" no app mobile
    lat = django_filters.NumberFilter(method='filter_nearby')
    lng = django_filters.NumberFilter(method='filter_nearby')
    raio_km = django_filters.NumberFilter(method='filter_nearby')

    class Meta:
        model = Listing
        fields = []

    def filter_quartos_min(self, queryset, name, value):
        return queryset.filter(
            property__rooms__tipo='quartos',
            property__rooms__quantidade__gte=value
        )

    def filter_banheiros_min(self, queryset, name, value):
        return queryset.filter(
            property__rooms__tipo='banheiros',
            property__rooms__quantidade__gte=value
        )

    def filter_garagem_min(self, queryset, name, value):
        return queryset.filter(
            property__rooms__tipo='garagem',
            property__rooms__quantidade__gte=value
        )

    def filter_feature(self, queryset, name, value):
        # Filtra no campo JSONField features
        return queryset.filter(**{f'property__features__{name}': value})

    def filter_nearby(self, queryset, name, value):
        # Ativado somente quando lat, lng e raio_km são todos fornecidos
        lat = self.data.get('lat')
        lng = self.data.get('lng')
        raio = self.data.get('raio_km', 5)
        if lat and lng and name == 'lat':
            point = Point(float(lng), float(lat), srid=4326)
            raio_metros = float(raio) * 1000
            return queryset.filter(
                property__location__distance_lte=(point, raio_metros)
            ).annotate(
                distancia=Distance('property__location', point)
            ).order_by('distancia')
        return queryset
```

---

## 👁️ VIEWS — `apps/listings/views.py`

```python
# apps/listings/views.py

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from django.db.models import F
from .models import Listing, Favorite, ListingView, ListingStatus
from .serializers import ListingListSerializer, ListingDetailSerializer, ListingWriteSerializer
from .filters import ListingFilter
from common.pagination import MobileCursorPagination
from common.permissions import IsOwnerOrReadOnly
from .tasks import calculate_quality_score_task


class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.select_related(
        'property', 'owner'
    ).prefetch_related(
        'property__rooms', 'media'
    ).filter(status=ListingStatus.PUBLICADO)

    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = ListingFilter
    ordering_fields = ['aluguel', 'published_at', 'views_count', 'quality_score']
    ordering = ['-published_at']
    pagination_class = MobileCursorPagination

    def get_serializer_class(self):
        if self.action == 'list':
            return ListingListSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return ListingWriteSerializer
        return ListingDetailSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'featured', 'nearby']:
            return [AllowAny()]
        return [IsAuthenticated(), IsOwnerOrReadOnly()]

    def get_queryset(self):
        if self.action == 'mine':
            return Listing.objects.filter(owner=self.request.user)
        return super().get_queryset()

    def retrieve(self, request, *args, **kwargs):
        """Incrementa contador de views ao abrir o detalhe."""
        instance = self.get_object()
        Listing.objects.filter(pk=instance.pk).update(views_count=F('views_count') + 1)
        # Registra view anônima ou autenticada
        ListingView.objects.create(
            listing=instance,
            user=request.user if request.user.is_authenticated else None,
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT', ''),
        )
        instance.refresh_from_db(fields=['views_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def perform_create(self, serializer):
        listing = serializer.save(owner=self.request.user)
        # Calcular quality score via Celery (assíncrono)
        calculate_quality_score_task.delay(str(listing.id))

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def featured(self, request):
        """GET /listings/featured/ — 6 anúncios para a Home."""
        qs = self.get_queryset().order_by('-quality_score', '-views_count')[:6]
        serializer = ListingListSerializer(qs, many=True, context={'request': request})
        return Response({'results': serializer.data})

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def mine(self, request):
        """GET /listings/mine/ — Meus anúncios (PerfilMeusAnuncios)."""
        qs = Listing.objects.filter(owner=request.user).order_by('-created_at')
        page = self.paginate_queryset(qs)
        serializer = ListingDetailSerializer(page, many=True, context={'request': request})
        return self.get_paginated_response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def publish(self, request, pk=None):
        """POST /listings/{id}/publish/ — Publicar anúncio."""
        listing = self.get_object()
        if listing.owner != request.user:
            return Response({'error': 'Sem permissão.'}, status=status.HTTP_403_FORBIDDEN)
        from django.utils import timezone
        import datetime
        listing.status = ListingStatus.PUBLICADO
        listing.published_at = timezone.now()
        listing.expires_at = timezone.now() + datetime.timedelta(days=90)
        listing.save(update_fields=['status', 'published_at', 'expires_at'])
        return Response({'message': 'Anúncio publicado com sucesso.'})

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def pause(self, request, pk=None):
        """POST /listings/{id}/pause/ — Pausar anúncio."""
        listing = self.get_object()
        if listing.owner != request.user:
            return Response({'error': 'Sem permissão.'}, status=status.HTTP_403_FORBIDDEN)
        listing.status = ListingStatus.PAUSADO
        listing.save(update_fields=['status'])
        return Response({'message': 'Anúncio pausado.'})

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def favorite(self, request, pk=None):
        """POST /listings/{id}/favorite/ — Toggle favorito."""
        listing = self.get_object()
        fav, created = Favorite.objects.get_or_create(
            user=request.user, listing=listing
        )
        if not created:
            fav.delete()
            Listing.objects.filter(pk=listing.pk).update(favorites_count=F('favorites_count') - 1)
            return Response({'favorited': False, 'message': 'Removido dos favoritos.'})
        Listing.objects.filter(pk=listing.pk).update(favorites_count=F('favorites_count') + 1)
        return Response({'favorited': True, 'message': 'Adicionado aos favoritos.'})
```

---

## ⚙️ CELERY TASKS — Tarefas Assíncronas

### `apps/listings/tasks.py`

```python
# apps/listings/tasks.py

from celery import shared_task
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def calculate_quality_score_task(self, listing_id: str):
    """
    Calcula e salva o quality score de um anúncio.
    Disparado após create/update de Listing ou upload de mídia.
    """
    try:
        from .models import Listing
        listing = Listing.objects.get(id=listing_id)
        score = listing.calculate_quality_score()
        listing.quality_score = score
        listing.save(update_fields=['quality_score'])
        logger.info(f"Quality score calculado: listing={listing_id}, score={score}")
    except Exception as exc:
        logger.error(f"Erro ao calcular quality score: {exc}")
        raise self.retry(exc=exc, countdown=60)


@shared_task
def expire_old_listings():
    """
    CRON: Roda diariamente às 00:00.
    Marca como EXPIRADO os anúncios com expires_at passado.
    """
    from django.utils import timezone
    from .models import Listing, ListingStatus
    expired = Listing.objects.filter(
        status=ListingStatus.PUBLICADO,
        expires_at__lt=timezone.now()
    )
    count = expired.update(status=ListingStatus.EXPIRADO)
    logger.info(f"Anúncios expirados: {count}")
```

### `apps/authentication/tasks.py`

```python
# apps/authentication/tasks.py

from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def send_otp_email(self, email: str, nome: str, otp_code: str):
    """
    Envia o código OTP por email.
    Disparado em forgot-password — NÃO bloqueia a requisição HTTP.
    """
    try:
        send_mail(
            subject='Aluguel360 — Código de Verificação',
            message=f"""
Olá, {nome}!

Seu código de recuperação de senha é:

    {otp_code}

Este código é válido por {settings.OTP_EXPIRY_MINUTES} minutos.
Se você não solicitou esta recuperação, ignore este email.

— Equipe Aluguel360
            """,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
        logger.info(f"OTP enviado para {email}")
    except Exception as exc:
        logger.error(f"Falha ao enviar OTP para {email}: {exc}")
        raise self.retry(exc=exc, countdown=30)


@shared_task
def send_welcome_email(user_id: str):
    """Envia email de boas-vindas após registro."""
    from apps.users.models import User
    try:
        user = User.objects.get(id=user_id)
        send_mail(
            subject='Bem-vindo ao Aluguel360!',
            message=f"Olá, {user.nome}! Sua conta foi criada com sucesso.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
        )
    except Exception as e:
        logger.error(f"Erro no email de boas-vindas: {e}")
```

### `apps/media/tasks.py`

```python
# apps/media/tasks.py

from celery import shared_task
import logging

logger = logging.getLogger(__name__)


@shared_task
def generate_thumbnail(media_id: str):
    """
    Gera thumbnail via Cloudinary transformation após upload.
    Cloudinary suporta transformações on-the-fly via URL, mas
    pré-geramos para garantir disponibilidade imediata.
    """
    from .models import Media
    import cloudinary
    try:
        media = Media.objects.get(id=media_id)
        if media.tipo == 'FOTO':
            thumb_url = cloudinary.CloudinaryImage(media.public_id).build_url(
                width=400, height=300, crop='fill', quality='auto', format='webp'
            )
            optimized_url = cloudinary.CloudinaryImage(media.public_id).build_url(
                quality='auto:good', format='webp', fetch_format='auto'
            )
            media.thumbnail_url = thumb_url
            media.url_optimized = optimized_url
            media.save(update_fields=['thumbnail_url', 'url_optimized'])
        logger.info(f"Thumbnail gerado para media={media_id}")
    except Exception as e:
        logger.error(f"Erro ao gerar thumbnail: {e}")


@shared_task
def update_storage_quota(user_id: str):
    """Recalcula quota de armazenamento do usuário."""
    from .models import Media, StorageQuota
    from apps.users.models import User
    try:
        user = User.objects.get(id=user_id)
        media_qs = Media.objects.filter(user=user)
        quota, _ = StorageQuota.objects.get_or_create(user=user)
        quota.fotos_count = media_qs.filter(tipo='FOTO').count()
        quota.videos_count = media_qs.filter(tipo='VIDEO').count()
        quota.total_mb_used = sum(m.tamanho_mb for m in media_qs)
        quota.save()
    except Exception as e:
        logger.error(f"Erro ao atualizar quota: {e}")
```

---

## 🗺️ URLs — Configuração de Rotas

### `apps/listings/urls.py`

```python
# apps/listings/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ListingViewSet

router = DefaultRouter()
router.register(r'', ListingViewSet, basename='listing')

urlpatterns = [
    path('', include(router.urls)),
]
```

### `apps/authentication/urls.py`

```python
# apps/authentication/urls.py

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, LoginView, LogoutView,
    ForgotPasswordView, VerifyOtpView, ResetPasswordView,
    RegisterDeviceView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('verify-otp/', VerifyOtpView.as_view(), name='verify_otp'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset_password'),
    path('devices/register/', RegisterDeviceView.as_view(), name='register_device'),
]
```

---

## 🔒 PERMISSÕES — `common/permissions.py`

```python
# common/permissions.py

from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsOwnerOrReadOnly(BasePermission):
    """
    Só o dono do objeto pode editar/deletar.
    Qualquer um pode ler (GET, HEAD, OPTIONS).
    """
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        owner = getattr(obj, 'owner', None) or getattr(obj, 'user', None)
        return owner == request.user


class IsOwner(BasePermission):
    """Só o dono pode acessar — sem permissão de leitura pública."""
    def has_object_permission(self, request, view, obj):
        owner = getattr(obj, 'owner', None) or getattr(obj, 'user', None)
        return owner == request.user
```

---

## ✅ CHECKLIST DA FASE 3

Antes de avançar para a Fase 4 (Segurança, Upload de Mídia e Deploy), confirme:

- [ ] `POST /api/v1/auth/register/` cria usuário, endereço e dispara email de boas-vindas via Celery
- [ ] `POST /api/v1/auth/login/` retorna `accessToken` (15min) e `refreshToken` (7d)
- [ ] `POST /api/v1/auth/token/refresh/` gera novo access token com o refresh token válido
- [ ] `POST /api/v1/auth/forgot-password/` dispara Celery task de envio de OTP (verificar fila Redis)
- [ ] `POST /api/v1/auth/verify-otp/` rejeita código expirado ou com mais de 3 tentativas
- [ ] `GET /api/v1/listings/` retorna array paginado com cursor (sem total_count)
- [ ] `GET /api/v1/listings/?tipo=CASA&preco_max=2000` filtra corretamente
- [ ] `GET /api/v1/listings/?lat=-8.77&lng=-43.15&raio_km=5` retorna imóveis num raio de 5km
- [ ] `POST /api/v1/listings/{id}/favorite/` alterna favorito (cria/deleta) e atualiza contador
- [ ] `GET /api/v1/listings/featured/` retorna exatamente 6 itens
- [ ] `POST /api/v1/media/upload/` com arquivo .jpg salva no Cloudinary e dispara thumbnail task
- [ ] Quality score é calculado via Celery após criação de Listing (verificar no admin)
- [ ] Usuário não autenticado recebe 401 nas rotas protegidas
- [ ] Usuário tenta editar imóvel de outro → 403 Forbidden
- [ ] Documentação Swagger em `http://localhost:8000/api/docs/` lista todos os endpoints

---

*Fase 3 de 4 — Próximo: Fase 4 — Segurança, Mídia, Deploy e Integração Mobile*
