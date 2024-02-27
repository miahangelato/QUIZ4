from django.urls import path
from .views import *

urlpatterns = [
    path('', get_user, name='profile'),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('register/', registerUser, name='register'),
    path('verify/', verify_otp, name='verify-otp'),
    path('resend_otp/', resend_otp, name='resend-otp'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('send-reset-password-email/', SendPasswordResetEmailView.as_view(), name='send-reset-password-email'),
     path('reset-password/<uid>/<token>/', UserPasswordResetView.as_view(), name='reset-password'),
]