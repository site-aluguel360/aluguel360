import logging

from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def send_otp_email(self, email, nome, otp_code):
    try:
        send_mail(
            'Aluguel360 — Código de Verificação',
            f'Olá, {nome}! Seu código de recuperação é {otp_code}.',
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
    except Exception as exc:
        raise self.retry(exc=exc, countdown=30)


@shared_task
def send_welcome_email(user_id):
    from apps.users.models import User
    user = User.objects.get(pk=user_id)
    send_mail('Bem-vindo ao Aluguel360!', f'Olá, {user.nome}! Sua conta foi criada.', settings.DEFAULT_FROM_EMAIL, [user.email])


@shared_task
def cleanup_expired_otps():
    from .models import OtpToken
    return OtpToken.objects.filter(expires_at__lt=timezone.now(), used_at__isnull=True).update(used_at=timezone.now())
