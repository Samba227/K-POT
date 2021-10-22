from django.contrib import admin
from .models import Profile, ProfileAction, LoginAttempt
# Register your models here.

admin.site.register(Profile)
admin.site.register(ProfileAction)
admin.site.register(LoginAttempt)
