import os

from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
app = Celery('aluguel360')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.conf.beat_schedule = {
    'expire-old-listings': {'task': 'apps.listings.tasks.expire_old_listings', 'schedule': crontab(hour=0, minute=0)},
    'recalculate-quality-scores': {'task': 'apps.listings.tasks.recalculate_all_quality_scores', 'schedule': 3600},
    'cleanup-expired-otps': {'task': 'apps.authentication.tasks.cleanup_expired_otps', 'schedule': crontab(minute=30)},
    'cleanup-inactive-sessions': {'task': 'apps.users.tasks.cleanup_inactive_sessions', 'schedule': crontab(hour=2, day_of_week=0)},
}
app.autodiscover_tasks()
