import jwt, datetime, os
from rest_framework import exceptions
from rest_framework.response import Response
from rest_framework.authentication import BaseAuthentication, get_authorization_header
from .models import CustomUser

ACCESS_SECRET = os.environ.get("ACCESS_SECRET")
REFRESH_SECRET = os.environ.get("REFRESH_SECRET")


class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth = get_authorization_header(request).split()

        if auth and len(auth) == 2:
            access_token = auth[1].decode("utf-8")
            id = decode_access_token(access_token)
            user = CustomUser.objects.filter(id=id).first()

            if user is None:
                raise exceptions.AuthenticationFailed("Authentication error 4!")

            return (user, None)

        raise exceptions.AuthenticationFailed("Authentication error 1!")


def create_access_token(id):
    return jwt.encode(
        {
            "user_id": id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(seconds=60),
            "iat": datetime.datetime.utcnow(),
        },
        ACCESS_SECRET,
        algorithm="HS256",
    )


def create_refresh_token(id):
    return jwt.encode(
        {
            "user_id": id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=30),
            "iat": datetime.datetime.utcnow(),
        },
        REFRESH_SECRET,
        algorithm="HS256",
    )


def decode_access_token(token):
    try:
        payload = jwt.decode(token, ACCESS_SECRET, algorithms=["HS256"])
        return payload["user_id"]
    except:
        raise exceptions.AuthenticationFailed("Authentication error 2!")


def decode_refresh_token(token):
    try:
        payload = jwt.decode(token, REFRESH_SECRET, algorithms=["HS256"])
        return payload["user_id"]
    except:
        raise exceptions.AuthenticationFailed("Authentication error 5!")
