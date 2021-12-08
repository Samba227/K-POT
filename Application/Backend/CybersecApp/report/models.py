from django.db import models
from django.db.models.base import Model

# Create your models here.

class Report(models.Model):
    date = models.DateField(blank=False, null=False, unique=True)
    content = models.TextField(blank=True, null=True)

    def __str__(self):
        return '{}'.format(self.date)
