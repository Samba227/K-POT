from django.db import models
from django.db.models.base import Model

# Create your models here.


class Report(models.Model):
    date = models.CharField(max_length=100, blank=False, null=False, unique=True)
    total_data = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    data_by_device = models.JSONField(blank=True, null=True)
    connections_by_device = models.JSONField(blank=True, null=True)

    def __str__(self):
        return 'report of {}'.format(self.date)
