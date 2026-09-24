from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Property
from .serializers import PropertySerializer


class PropertyViewSet(viewsets.ModelViewSet):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False) or not self.request.user.is_authenticated:
            return Property.objects.none()
        return Property.objects.filter(owner=self.request.user, deleted_at__isnull=True).prefetch_related('rooms')

    def perform_destroy(self, instance):
        from django.utils import timezone
        instance.deleted_at = timezone.now()
        instance.status = 'INATIVO'
        instance.save(update_fields=['deleted_at', 'status'])

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
