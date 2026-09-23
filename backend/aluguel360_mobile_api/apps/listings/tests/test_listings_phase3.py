from decimal import Decimal
from unittest.mock import patch

import pytest
from rest_framework.test import APIClient

from apps.listings.models import Listing, ListingStatus
from apps.properties.models import Property, PropertyType
from apps.users.models import User


@pytest.fixture
def listing_data(db):
    owner = User.objects.create_user('owner@example.com', 'Owner', '52998224725', 'SenhaForte123!')
    prop = Property.objects.create(owner=owner, tipo=PropertyType.CASA, area_m2=80, cep='01001000', logradouro='Rua A', numero='1', bairro='Centro', cidade='São Paulo', estado='SP', status='ATIVO')
    listing = Listing.objects.create(property=prop, owner=owner, titulo='Casa publicada', descricao='Descrição da casa', aluguel=Decimal('1200.00'), status=ListingStatus.PUBLICADO)
    return owner, prop, listing


@pytest.mark.django_db
def test_public_listings_and_price_filter(listing_data):
    response = APIClient().get('/api/v1/listings/')
    assert response.status_code == 200
    assert len(response.data['data']['results']) == 1
    filtered = APIClient().get('/api/v1/listings/?preco_max=1000')
    assert filtered.status_code == 200
    assert filtered.data['data']['results'] == []


@pytest.mark.django_db
def test_featured_has_at_most_six(listing_data):
    response = APIClient().get('/api/v1/listings/featured/')
    assert response.status_code == 200
    assert len(response.data['results']) <= 6


@pytest.mark.django_db
def test_favorite_requires_auth_and_toggles(listing_data):
    owner, _, listing = listing_data
    anonymous = APIClient().post(f'/api/v1/listings/{listing.id}/favorite/', {}, format='json')
    assert anonymous.status_code == 401
    client = APIClient()
    client.force_authenticate(owner)
    with patch('apps.listings.views.calculate_quality_score_task.delay'):
        response = client.post(f'/api/v1/listings/{listing.id}/favorite/', {}, format='json')
    assert response.status_code == 200
    assert response.data['favorited'] is True
    response = client.post(f'/api/v1/listings/{listing.id}/favorite/', {}, format='json')
    assert response.data['favorited'] is False
