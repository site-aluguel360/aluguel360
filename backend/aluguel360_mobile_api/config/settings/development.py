# config/settings/development.py

from .base import *

DEBUG = True

INSTALLED_APPS += ['debug_toolbar']
MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']
INTERNAL_IPS = ['127.0.0.1']

# Em dev, aceitar qualquer origem CORS
CORS_ALLOW_ALL_ORIGINS = True

# Emails no console (não envia de verdade em dev)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
