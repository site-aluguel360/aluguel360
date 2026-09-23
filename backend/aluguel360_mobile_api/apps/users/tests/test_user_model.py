import pytest
from django.contrib.auth import get_user_model
from apps.users.models import UserRole, Address

User = get_user_model()

@pytest.mark.django_db
class TestUserModel:

    def test_create_user_normalizes_email_and_hashes_cpf(self):
        email = 'TEST@ALUGUEL360.COM'
        cpf = '123.456.789-10'
        user = User.objects.create_user(email=email, nome='Test User', cpf=cpf, senha='password123')
        
        assert user.email == 'TEST@aluguel360.com'
        assert user.cpf_hash == User.hash_cpf(cpf)
        assert user.role == UserRole.INQUILINO
        assert user.check_password('password123') is True
        assert user.is_active is True

    def test_create_superuser(self):
        user = User.objects.create_superuser('admin@aluguel360.com', 'Admin', '11122233344', 'adminpass')
        assert user.is_superuser is True
        assert user.is_staff is True
        assert user.role == UserRole.ADMIN

    def test_soft_delete(self):
        user = User.objects.create_user('delete_me@test.com', 'To Delete', '00011122233', 'pass')
        original_id = user.id
        
        user.soft_delete()
        
        user.refresh_from_db()
        assert user.deleted_at is not None
        assert user.is_active is False
        assert user.email == f"deleted_{original_id}@deleted.aluguel360"


@pytest.mark.django_db
class TestAddressModel:

    def test_only_one_primary_address(self):
        user = User.objects.create_user('addr@test.com', 'Addr', '99988877766', 'pass')
        
        addr1 = Address.objects.create(
            user=user, cep='11111-111', logradouro='Rua A', 
            numero='1', bairro='B', cidade='C', estado='SP', is_primary=True
        )
        
        addr2 = Address.objects.create(
            user=user, cep='22222-222', logradouro='Rua B', 
            numero='2', bairro='B', cidade='C', estado='SP', is_primary=True
        )
        
        addr1.refresh_from_db()
        assert addr1.is_primary is False
        assert addr2.is_primary is True
