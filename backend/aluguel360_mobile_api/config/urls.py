# config/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from .health import health_check

API_PREFIX = 'api/v1/'

urlpatterns = [
    path('health', health_check, name='health'),
    # Admin Django
    path('admin/', admin.site.urls),

    # Documentação OpenAPI
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    # Apps
    path(API_PREFIX + 'auth/', include('apps.authentication.urls')),
    path(API_PREFIX + 'users/', include('apps.users.urls')),
    path(API_PREFIX + 'properties/', include('apps.properties.urls')),
    path(API_PREFIX + 'listings/', include('apps.listings.urls')),
    path(API_PREFIX + 'media/', include('apps.media.urls')),
    path(API_PREFIX + 'notifications/', include('apps.notifications.urls')),
    path(API_PREFIX + 'search/', include('apps.search.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
