from datetime import timedelta

from celery import shared_task
from django.utils import timezone


@shared_task
def cleanup_inactive_sessions():
    from .models import Session
    return Session.objects.filter(is_active=True, last_seen_at__lt=timezone.now() - timedelta(days=90)).update(is_active=False)
