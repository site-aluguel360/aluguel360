import logging

from celery import shared_task
from django.utils import timezone

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def calculate_quality_score_task(self, listing_id):
    try:
        from .models import Listing
        listing = Listing.objects.get(pk=listing_id)
        listing.quality_score = listing.calculate_quality_score()
        listing.save(update_fields=['quality_score'])
        return listing.quality_score
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60)


@shared_task
def expire_old_listings():
    from .models import Listing, ListingStatus
    return Listing.objects.filter(status=ListingStatus.PUBLICADO, expires_at__lt=timezone.now()).update(status=ListingStatus.EXPIRADO)


@shared_task
def recalculate_all_quality_scores():
    from .models import Listing
    for listing_id in Listing.objects.exclude(status='EXPIRADO').values_list('id', flat=True):
        calculate_quality_score_task.delay(str(listing_id))
