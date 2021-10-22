from rest_framework import serializers
from .models import HomeProfile, HomeProfileaction, HomeLoginattempt

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeProfile
        fields = '__all__'

class ProfileactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeProfileaction
        fields = '__all__'


class LoginattemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeLoginattempt
        fields = '__all__'
