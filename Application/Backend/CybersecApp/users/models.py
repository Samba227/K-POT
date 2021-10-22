from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []
