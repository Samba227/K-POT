# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class HomeProfile(models.Model):
    id = models.BigAutoField(primary_key=True)
    ip = models.CharField(unique=True, max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    region = models.CharField(max_length=100, blank=True, null=True)
    country_name = models.CharField(max_length=100, blank=True, null=True)
    time_zone_name = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'home_profile'



class HomeLoginattempt(models.Model):
    id = models.BigAutoField(primary_key=True)
    username = models.CharField(max_length=100, blank=True, null=True)
    password = models.CharField(max_length=100, blank=True, null=True)
    attempt_time = models.CharField(max_length=100, blank=True, null=True)
    profile = models.ForeignKey('HomeProfile', to_field='ip', on_delete=models.CASCADE)

    class Meta:
        managed = False
        db_table = 'home_loginattempt'

class HomeProfileaction(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    value = models.CharField(max_length=100, blank=True, null=True)
    profile = models.ForeignKey('HomeProfile', to_field='ip', on_delete=models.CASCADE)

    class Meta:
        managed = False
        db_table = 'home_profileaction'
