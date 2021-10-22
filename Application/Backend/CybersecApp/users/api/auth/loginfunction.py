import datetime

import jwt
from django.contrib.auth import login
from users.api.serializers import UserProfileSerializer


def getlogin(request, user, users):
    context = {}
    if user is None or user not in users:
        context['notFound'] = True

    else:
        login(request, user)
        serializer = UserProfileSerializer(user)

        payload = {
            'uid': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, 'secret', algorithm='HS256').encode('utf-8').decode('utf-8')

        context['loginSuccess'] = True
        context['token'] = token
        context['user'] = serializer.data

        # response.set_cookie(key='token', value=token, httponly=True)
    return context
