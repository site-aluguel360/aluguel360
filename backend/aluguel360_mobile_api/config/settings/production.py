"""Settings for the hardened staging/production environment."""

from .base import *  # noqa: F401,F403

DEBUG = False

# HTTPS is terminated by Nginx in front of Gunicorn.
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'

# Secure session and CSRF cookies.
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = 'Lax'
CSRF_TRUSTED_ORIGINS = config('CSRF_TRUSTED_ORIGINS', cast=Csv(), default='')

# Content Security Policy. Cloudinary is the only external media origin.
MIDDLEWARE = [
    'whitenoise.middleware.WhiteNoiseMiddleware',
    *MIDDLEWARE,
    'csp.middleware.CSPMiddleware',
]
CSP_DEFAULT_SRC = ("'self'",)
CSP_IMG_SRC = ("'self'", 'data:', 'https://res.cloudinary.com')
CSP_MEDIA_SRC = ("'self'", 'https://res.cloudinary.com')
CSP_CONNECT_SRC = ("'self'", 'https://api.cloudinary.com')

# PostgreSQL must use TLS outside the local Docker development network.
DATABASES['default']['OPTIONS']['sslmode'] = config('DB_SSLMODE', default='require')

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Sentry is enabled only when a DSN is configured; staging can run without one.
SENTRY_DSN = config('SENTRY_DSN', default='').strip()
if SENTRY_DSN:
    import sentry_sdk
    from sentry_sdk.integrations.celery import CeleryIntegration
    from sentry_sdk.integrations.django import DjangoIntegration

    sentry_sdk.init(
        dsn=SENTRY_DSN,
        integrations=[DjangoIntegration(), CeleryIntegration()],
        traces_sample_rate=config('SENTRY_TRACES_SAMPLE_RATE', default=0.1, cast=float),
        send_default_pii=False,
    )
