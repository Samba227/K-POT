from rest_framework import serializers
from users.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'last_login',
            'is_superuser',
            'first_name',
            'last_name',
            'email',
            'is_active',
            'date_joined',
            'username',
            'password',
        ]
        # fields = '__all__'
        '''extra_kwargs = {
            'password': {'write_only': True}
        }'''

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'first_name',
            'last_name',
            'email',
            'username',
            'last_login',
            'is_superuser',
            ]
