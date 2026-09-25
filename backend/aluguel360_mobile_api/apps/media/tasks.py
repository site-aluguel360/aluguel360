from celery import shared_task
from django.db.models import Count, Sum


@shared_task
def generate_thumbnail(media_id):
    from .models import Media
    media = Media.objects.get(pk=media_id)
    media.thumbnail_url = media.url
    media.url_optimized = media.url
    media.save(update_fields=['thumbnail_url', 'url_optimized'])
    return media.thumbnail_url


@shared_task
def update_storage_quota(user_id):
    from .models import Media, StorageQuota
    qs = Media.objects.filter(user_id=user_id)
    aggregates = qs.values('tipo').annotate(count=Count('id'), total=Sum('tamanho_mb'))
    counts = {item['tipo']: item for item in aggregates}
    quota, _ = StorageQuota.objects.get_or_create(user_id=user_id)
    photo = counts.get('FOTO', {})
    video = counts.get('VIDEO', {})
    quota.fotos_count = photo.get('count', 0) or 0
    quota.videos_count = video.get('count', 0) or 0
    quota.total_mb_used = (photo.get('total', 0) or 0) + (video.get('total', 0) or 0)
    quota.save()
    return quota.total_mb_used
