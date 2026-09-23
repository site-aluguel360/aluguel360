from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AddressViewSet, FavoritesView, MeView, SessionViewSet, StatsView

router = DefaultRouter()
router.register('addresses', AddressViewSet, basename='my-address')
router.register('sessions', SessionViewSet, basename='my-session')

urlpatterns = [
    path('me/', MeView.as_view(), name='me'),
    path('me/stats/', StatsView.as_view(), name='my-stats'),
    path('me/favorites/', FavoritesView.as_view(), name='my-favorites'),
    path('me/', include(router.urls)),
]
