from rest_framework.response import Response
from rest_framework.views import APIView
from .models import HomeProfile, HomeProfileaction, HomeLoginattempt
from .serializers import ProfileactionSerializer, LoginattemptSerializer, ProfileSerializer


class HoneypotView(APIView):
    def get(self, request):
        context = {}
        profiles = HomeProfile.objects.values('ip')
        context['success'] = True

        context['IPs'] = [ip['ip'] for ip in profiles]

        return Response(context)

    def post(self, request):
        ip = request.data.get('ip')
        context = {}
        if ip is not None:
            try :
                profile = HomeProfile.objects.filter(ip=ip).first()
            
            except HomeProfile.DoesNotExist:
                context['error'] = True

            finally:
                context['success'] = True
                serializer = ProfileSerializer(profile)

                context['profile'] = serializer.data

                # ------  actions -----------
                actions = HomeProfileaction.objects.filter(profile=profile).values('name', 'value')
                context['actions'] = [action for action in actions]

                # ------  login attempts -----------
                attemps = HomeLoginattempt.objects.filter(profile=profile).order_by('id').values('username', 'password','attempt_time')
                context['loginAttempts'] = [attemp for attemp in attemps]

        else:
            context['fieldsError'] = True
        return Response(context)
