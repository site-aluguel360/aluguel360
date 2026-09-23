from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import MediaViewSet

router = DefaultRouter()
router.register('', MediaViewSet, basename='media')
urlpatterns = [path('', include(router.urls))]
