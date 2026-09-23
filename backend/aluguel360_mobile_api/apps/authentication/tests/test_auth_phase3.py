from unittest.mock import patch

import pytest
from django.core.cache import cache
from rest_framework.test import APIClient

from apps.authentication.models import OtpToken
from apps.users.models import User


@pytest.fixture(autouse=True)
def clear_rate_limit_cache():
    cache.clear()
    yield
    cache.clear()


@pytest.mark.django_db
def test_register_passes_raw_cpf_to_manager_and_returns_tokens():
    client = APIClient()
    payload = {
        'nome': 'Usuário API', 'email': 'api@example.com', 'cpf': '123.456.789-09',
        'senha': 'SenhaForte123!', 'confirmar_senha': 'SenhaForte123!',
    }
    with patch('apps.authentication.views.send_welcome_email.delay'):
        response = client.post('/api/v1/auth/register/', payload, format='json')
    assert response.status_code == 201
    assert response.data['access_token']
    assert response.data['refresh_token']
    user = User.objects.get(email='api@example.com')
    assert user.cpf_hash == User.hash_cpf(payload['cpf'])
    assert payload['cpf'] not in str(response.data)


@pytest.mark.django_db
def test_register_rejects_invalid_cpf_and_duplicate_email():
    client = APIClient()
    invalid = {'nome': 'A', 'email': 'bad@example.com', 'cpf': '123.456.789-10', 'senha': 'SenhaForte123!', 'confirmar_senha': 'SenhaForte123!'}
    assert client.post('/api/v1/auth/register/', invalid, format='json').status_code == 400
    User.objects.create_user('existing@example.com', 'Existing', '52998224725', 'SenhaForte123!')
    duplicate = {**invalid, 'cpf': '12345678909', 'email': 'existing@example.com'}
    assert client.post('/api/v1/auth/register/', duplicate, format='json').status_code == 400


@pytest.mark.django_db
def test_login_returns_jwt():
    User.objects.create_user('login@example.com', 'Login', '52998224725', 'SenhaForte123!')
    response = APIClient().post('/api/v1/auth/login/', {'email': 'login@example.com', 'senha': 'SenhaForte123!'}, format='json')
    assert response.status_code == 200
    assert response.data['access_token']


@pytest.mark.django_db
def test_forgot_password_does_not_reveal_unknown_email():
    with patch('apps.authentication.views.send_otp_email.delay'):
        response = APIClient().post('/api/v1/auth/forgot-password/', {'email': 'unknown@example.com'}, format='json')
    assert response.status_code == 200


@pytest.mark.django_db
def test_otp_verification():
    user = User.objects.create_user('otp-api@example.com', 'OTP API', '52998224725', 'SenhaForte123!')
    otp, code = OtpToken.create_for_user(user)
    response = APIClient().post('/api/v1/auth/verify-otp/', {'email': user.email, 'codigo': code}, format='json')
    assert response.status_code == 200
    assert otp.used_at is None
