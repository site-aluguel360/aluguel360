from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Minimal custom user model to satisfy AUTH_USER_MODEL for initial setup
    pass
