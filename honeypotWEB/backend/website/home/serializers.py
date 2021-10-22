from rest_framework import serializers
from .models import Profile, ProfileAction, LoginAttempt


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'


class ProfileActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileAction
        fields = '__all__'


class LoginAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoginAttempt
        fields = '__all__'

