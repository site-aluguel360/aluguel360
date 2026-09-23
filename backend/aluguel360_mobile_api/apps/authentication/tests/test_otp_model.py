import pytest
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from apps.authentication.models import OtpToken

User = get_user_model()

@pytest.mark.django_db
class TestOtpTokenModel:

    def test_create_for_user(self):
        user = User.objects.create_user('otp@test.com', 'OTP', '12312312312', 'pass')
        otp, code = OtpToken.create_for_user(user)
        
        assert otp.user == user
        assert len(code) == 6
        assert otp.code_hash != code
        assert otp.used_at is None
        assert otp.expires_at > timezone.now()

    def test_create_invalidates_previous(self):
        user = User.objects.create_user('otp2@test.com', 'OTP2', '22212312312', 'pass')
        otp1, code1 = OtpToken.create_for_user(user)
        otp2, code2 = OtpToken.create_for_user(user)
        
        otp1.refresh_from_db()
        assert otp1.used_at is not None
        assert otp2.used_at is None

    def test_is_valid_success(self):
        user = User.objects.create_user('otp3@test.com', 'OTP3', '33312312312', 'pass')
        otp, code = OtpToken.create_for_user(user)
        
        assert otp.is_valid(code) is True
        assert otp.attempts == 1

    def test_is_valid_wrong_code(self):
        user = User.objects.create_user('otp4@test.com', 'OTP4', '44412312312', 'pass')
        otp, code = OtpToken.create_for_user(user)
        
        assert otp.is_valid('000000') is False
        assert otp.attempts == 1

    def test_is_valid_expired(self):
        user = User.objects.create_user('otp5@test.com', 'OTP5', '55512312312', 'pass')
        otp, code = OtpToken.create_for_user(user)
        
        otp.expires_at = timezone.now() - timedelta(minutes=1)
        otp.save()
        
        assert otp.is_valid(code) is False

    def test_mark_used(self):
        user = User.objects.create_user('otp6@test.com', 'OTP6', '66612312312', 'pass')
        otp, code = OtpToken.create_for_user(user)
        
        otp.mark_used()
        assert otp.used_at is not None
        assert otp.is_valid(code) is False
