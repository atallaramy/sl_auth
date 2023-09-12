import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import exceptions
from google.oauth2 import id_token
from google.auth.transport.requests import Request as GoogleRequest
from .authentication import JWTAuthentication
from .serializers import UserSerializer
from .models import CustomUser, UserToken
from .authentication import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
)


class RegisterAPIView(APIView):
    def post(self, request):
        data = request.data
        if data["password"] != data["password_confirm"]:
            raise exceptions.APIException("Passwords do not match!")
        serializer = UserSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class LoginAPIView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = CustomUser.objects.filter(email=email).first()
        if user is None:
            raise exceptions.AuthenticationFailed("Invalid Credentials, Try Again")

        if not user.check_password(password):
            raise exceptions.AuthenticationFailed("Invalid Credentials, Try Again")

        access_token = create_access_token(user.id)
        refresh_token = create_refresh_token(user.id)

        UserToken.objects.create(
            user_id=user.id,
            token=refresh_token,
            # check if the expiring time need to be added manulally.
            expired_at=datetime.datetime.utcnow() + datetime.timedelta(days=30),
        )

        response = Response()
        response.set_cookie(key="refresh_token", value=refresh_token, httponly=True)
        response.data = {"access_token": access_token}

        return response


class UserAPIView(APIView):
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class RefreshAPIView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        id = decode_refresh_token(refresh_token)

        if not UserToken.objects.filter(
            user_id=id,
            token=refresh_token,
            expired_at__gt=datetime.datetime.now(tz=datetime.timezone.utc),
        ).exists():
            raise exceptions.AuthenticationFailed("Authentication error 7!")

        access_token = create_access_token(id)

        return Response({"access_token": access_token})


class LogoutAPIView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        UserToken.objects.filter(token=refresh_token).delete()
        response = Response()
        response.delete_cookie("refresh_token")
        response.data = {"message": "success"}

        return response


class GoogleAuthAPIView(APIView):
    def post(self, request):
        token = request.data.get("token")

        googleUser = id_token.verify_oauth2_token(token, GoogleRequest())
        if not googleUser:
            raise exceptions.AuthenticationFailed("Authentication error 8!")

        user = CustomUser.objects.filter(email=googleUser["email"]).first()

        if not user:
            user = CustomUser.objects.create(
                email=googleUser["email"],
                first_name=googleUser["given_name"],
                last_name=googleUser["family_name"],
            )
            user.set_unusable_password()
            user.save()

        access_token = create_access_token(user.id)
        refresh_token = create_refresh_token(user.id)

        UserToken.objects.create(
            user_id=user.id,
            token=refresh_token,
            expired_at=datetime.datetime.utcnow() + datetime.timedelta(days=30),
        )

        response = Response()
        response.set_cookie(key="refresh_token", value=refresh_token, httponly=True)
        response.data = {"access_token": access_token}
        return response
