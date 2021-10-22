from rest_framework.views import APIView
from django.contrib.auth import authenticate, logout
from rest_framework.response import Response
from .auth_serializer import AuthSerializer
from ...models import User

from .loginfunction import getlogin


class RegisterView(APIView):

    def post(self, request):

        context = {}
        username = request.data.get('username')
        password = request.data.get('password')

        # check that username and password fields exists
        if username is not None and password is not None:
            # verify if a user already exist
            user = User.objects.filter(username=username).first()
            if user is not None:
                context['userExist'] = True

            # new user registration
            else:
                serializer = AuthSerializer(data=request.data)
                if serializer.is_valid(raise_exception=True):
                    serializer.save()
                    user = User.objects.filter(username=username).first()
                    # set user status by inactive by default
                    user.is_active = False
                    user.save()
                    context['registerSuccess'] = True
                else:
                    context['failure'] = True
        else:
            context['fieldsError'] = True

        return Response(context)


# normal user login view
class LoginView(APIView):
    def post(self, request):
        context = {}
        response = Response()
        username = request.data.get('username')
        password = request.data.get('password')

        # check that username and password fields exists
        if username is not None and password is not None:
            users = User.objects.exclude(is_superuser=True)  # because we need only non admin users
            user = authenticate(request, username=username, password=password)

            context = getlogin(request, user, users)

        else:
            context['fieldsError'] = True
        response.data = context
        return response


class AdminLoginView(APIView):
    def post(self, request):
        context = {}
        response = Response()
        username = request.data.get('username')
        password = request.data.get('password')

        # check that username and password fields exists
        if username is not None and password is not None:
            users = User.objects.filter(is_superuser=True)  # because we need only admin users

            user = authenticate(request, username=username, password=password)

            context = getlogin(request, user, users)

        else:
            context['fieldsError'] = True
        response.data = context
        return response


class LogoutView(APIView):
    def get(self, request):
        logout(request)
        response = Response()
        # response.delete_cookie('token')
        response.data = {'logoutSuccess': True}
        return response

