from rest_framework import serializers
from connexions.models import Frame, HMMLearning, FrameCaptureConf, SuspiciousIp

class FrameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Frame
        fields = '__all__'

class HMMSerializer(serializers.ModelSerializer):
    class Meta:
        model = HMMLearning
        fields = '__all__'


class HMMLabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = HMMLearning
        fields = '__all__'


class FrameCaptureConfSerializer(serializers.ModelSerializer):
    class Meta:
        model = FrameCaptureConf
        fields = '__all__'


class SuspiciousIpSerializer(serializers.ModelSerializer):
    class Meta:
        model = SuspiciousIp
        fields = '__all__'