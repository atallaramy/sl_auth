from django.urls import path
from .views import (
    UserAPIView,
    RefreshAPIView,
    LogoutAPIView,
    GoogleAuthAPIView,
)

urlpatterns = [
    path("user/", UserAPIView.as_view(), name="user"),
    path("refresh/", RefreshAPIView.as_view(), name="refresh"),
    path("logout/", LogoutAPIView.as_view(), name="logout"),
    path("google/", GoogleAuthAPIView.as_view(), name="google"),
]
