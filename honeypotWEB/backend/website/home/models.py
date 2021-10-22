from django.db import models


# Create your models here.
class Profile(models.Model):
    ip = models.CharField(max_length=100, blank=True, null=True, unique=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    region = models.CharField(max_length=100, blank=True, null=True)
    country_name = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    time_zone_name = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return '{} ({})'.format(self.ip, self.country_name)


class ProfileAction(models.Model):
    profile = models.ForeignKey(Profile, to_field='ip', on_delete=models.CASCADE)
    name = models.CharField(max_length=100, blank=True, null=True)
    value = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return '{} ({} = {})'.format(self.profile, self.name, self.value)


class LoginAttempt(models.Model):
    profile = models.ForeignKey(Profile, to_field='ip', on_delete=models.CASCADE)
    username = models.CharField(max_length=100, blank=True, null=True)
    password = models.CharField(max_length=100, blank=True, null=True)
    attempt_time = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return '{} ( at {})'.format(self.profile, self.attempt_time)

