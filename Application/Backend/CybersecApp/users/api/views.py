from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserProfileSerializer, UserSerializer
from ..models import User
import jwt
from jwt.exceptions import DecodeError, ExpiredSignatureError


class UserView(APIView):
    def post(self, request):
        context = {}
        token = request.data.get('token')
        request_user = None
        if token is not None:
            try:
                payload = jwt.decode(token, 'secret', algorithms=['HS256'])
            except DecodeError:
                return Response({'decodeError': True})
            except ExpiredSignatureError:
                return Response({'ExpiredSignatureError': True})

            uid = payload.get('uid')
            if uid is not None:
                try:
                    request_user = User.objects.get(pk=uid)
                except User.DoesNotExist:
                    return Response({'userDoesNotExist': True})
                finally:
                    serializer = UserProfileSerializer(request_user)
                    context['profileSuccess'] = True
                    context['user'] = serializer.data
            else:
                context['fieldError'] = True
        else:
            context['tokenNotSet'] = True
        return Response(context)

    def put(self, request):
        context = {}
        data = request.data
        if data.get('id') is not None:
            try:
                user = User.objects.get(pk=data['id'])
                serializer = UserProfileSerializer(user, data=data)
                if serializer.is_valid():
                    serializer.save()
                    context['updateSuccess'] = True
                else:
                    context['updateFailed'] = True
            except User.DoesNotExist:
                return Response({'doesNotExist': True})
        else:
            context['fieldError'] = True

        return Response(context)


class UsersListView(APIView):
    # get all users list
    def get(self, request):
        users = User.objects.order_by('username')
        serializer = UserSerializer(users, many=True)
        active_users = User.objects.filter(is_active=True).count()
        not_active_users = users.count() - active_users
        superusers = User.objects.filter(is_superuser=True).count()
        data = {
            'users': serializer.data,
            'activeUsers': active_users,
            'notActiveUsers': not_active_users,
            'superUsers': superusers
        }
        return Response(data)

    # add a new user
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
                serializer = UserSerializer(data=request.data)
                if serializer.is_valid(raise_exception=True):
                    serializer.save()
                    context['userAddSuccess'] = True
                else:
                    context['failure'] = True
        else:
            context['fieldsError'] = True

        return Response(context)

    # update an existing user
    def put(self, request):
        uid = request.data.get('id')
        if uid is None:
            return Response({'failure': True})
        else:
            try:
                user = User.objects.get(id=uid)
                serializer = UserSerializer(user, data=request.data)
                if serializer.is_valid():
                    serializer.save()
                    return Response({'success': True})
            except User.DoesNotExist:
                return Response({'failure': True})

    # delete an existing user
    def delete(self, request, uid=0):
        try:
            user = User.objects.get(id=uid)
            print('deleting user with id = {}'.format(uid))
            user.delete()
            return Response({'deleteSuccess': True})
        except User.DoesNotExist:
            return Response({'failure': True})
