from decimal import Decimal

import pytest
from django.core.cache import cache
from rest_framework.test import APIClient

from apps.listings.models import Listing, ListingStatus
from apps.properties.models import Property, PropertyType
from apps.users.models import User


@pytest.fixture(autouse=True)
def clear_rate_limit_cache():
    cache.clear()
    yield
    cache.clear()


@pytest.mark.django_db
def test_users_me_returns_authenticated_user_data():
    user = User.objects.create_user(
        'checkpoint-user@example.com',
        'Checkpoint User',
        '52998224725',
        'SenhaForte123!',
    )
    client = APIClient()
    client.force_authenticate(user)

    response = client.get('/api/v1/users/me/')

    assert response.status_code == 200
    assert response.data['email'] == user.email
    assert 'cpf_hash' not in response.data


@pytest.mark.django_db
def test_public_listings_filter_by_property_type():
    owner = User.objects.create_user(
        'checkpoint-listings@example.com',
        'Checkpoint Listings',
        '52998224725',
        'SenhaForte123!',
    )
    casa = Property.objects.create(
        owner=owner,
        tipo=PropertyType.CASA,
        area_m2=80,
        cep='01001000',
        logradouro='Rua A',
        numero='1',
        bairro='Centro',
        cidade='São Paulo',
        estado='SP',
        status='ATIVO',
    )
    apartamento = Property.objects.create(
        owner=owner,
        tipo=PropertyType.APARTAMENTO,
        area_m2=60,
        cep='01001001',
        logradouro='Rua B',
        numero='2',
        bairro='Centro',
        cidade='São Paulo',
        estado='SP',
        status='ATIVO',
    )
    Listing.objects.create(
        property=casa,
        owner=owner,
        titulo='Casa checkpoint',
        descricao='Casa pública',
        aluguel=Decimal('1200.00'),
        status=ListingStatus.PUBLICADO,
    )
    Listing.objects.create(
        property=apartamento,
        owner=owner,
        titulo='Apartamento checkpoint',
        descricao='Apartamento público',
        aluguel=Decimal('1400.00'),
        status=ListingStatus.PUBLICADO,
    )

    response = APIClient().get('/api/v1/listings/?tipo=CASA')

    assert response.status_code == 200
    results = response.data['data']['results']
    assert len(results) == 1
    assert results[0]['titulo'] == 'Casa checkpoint'


@pytest.mark.django_db
def test_login_rate_limit_returns_429_on_eleventh_request():
    User.objects.create_user(
        'checkpoint-rate@example.com',
        'Checkpoint Rate',
        '52998224725',
        'SenhaForte123!',
    )
    client = APIClient()
    payload = {'email': 'checkpoint-rate@example.com', 'senha': 'SenhaForte123!'}

    responses = [client.post('/api/v1/auth/login/', payload, format='json') for _ in range(11)]

    assert all(response.status_code == 200 for response in responses[:10])
    assert responses[10].status_code == 429
