from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Profile, ProfileAction, LoginAttempt
from .serializers import ProfileSerializer, ProfileActionSerializer, LoginAttemptSerializer

class ProfileView(APIView):

    def post(self, request):
        context = {}
        ip = request.data.get('ip')
        if ip is not None:
            profile = Profile.objects.filter(ip__iexact=ip).first()
            
            if profile is None:
                serializer = ProfileSerializer(data=request.data)
                
                if serializer.is_valid(raise_exception=True):
                    serializer.save()
                    context['success'] = True
            else:
                context['exist'] = True
        return Response(context)


class ActionView(APIView):
    def post(self, request):
        context = {}
        ip = request.data.get('profile')
        action_name = request.data.get('name')
        if ip is not None and action_name is not None:
            profile = Profile.objects.filter(ip__iexact=ip).first()
            if profile is not None:
                action = ProfileAction.objects.filter(profile=profile, name__iexact=action_name).first()
                if action is None:
                    serializer = ProfileActionSerializer(data=request.data)
                    if serializer.is_valid(raise_exception=True):
                        serializer.save()
                        context['success'] = True
                else:
                    serializer = ProfileActionSerializer(action, data=request.data)
                    if serializer.is_valid(raise_exception=True):
                        print(float(action.value) > float(request.data.get('value')))
                        if float(action.value) > float(request.data.get('value')):
                            serializer.save()
                            context['updated'] = True
        return Response(context)


class LoginAttemptView(APIView):
    def post(self, request):
        context = {}
        ip = request.data.get('profile')
        if ip is not None:
            profile = Profile.objects.filter(ip__iexact=ip).first()
            if profile is not None:
                serializer = LoginAttemptSerializer(data=request.data)
                if serializer.is_valid(raise_exception=True):
                    serializer.save()
                    context['success'] = True
        return Response(context)
