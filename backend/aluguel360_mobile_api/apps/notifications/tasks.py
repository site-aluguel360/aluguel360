import logging

from celery import shared_task

logger = logging.getLogger(__name__)


@shared_task
def send_push_notification(user_id, titulo, mensagem, data=None):
    from apps.authentication.models import DeviceToken
    from .models import Notification, NotificationType
    notification = Notification.objects.create(user_id=user_id, tipo=NotificationType.SISTEMA, titulo=titulo, mensagem=mensagem, data=data or {})
    try:
        import firebase_admin
        from firebase_admin import messaging
        if not firebase_admin._apps:
            firebase_admin.initialize_app()
        tokens = list(DeviceToken.objects.filter(user_id=user_id, is_active=True).values_list('token', flat=True))
        for token in tokens:
            try:
                messaging.send(messaging.Message(notification=messaging.Notification(title=titulo, body=mensagem), data={str(k): str(v) for k, v in (data or {}).items()}, token=token))
            except Exception:
                DeviceToken.objects.filter(token=token).update(is_active=False)
    except Exception as exc:
        logger.warning('Push notification não enviada: %s', exc)
    return str(notification.id)
