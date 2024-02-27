from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserSerializer, MyTokenObtainPairSerializer, UserSerializerWithToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
from rest_framework import status
from django.contrib.auth.models import User
from .models import OTP
import pyotp
from . import utils
from rest_framework.generics import UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from .serializers import *
from rest_framework.views import APIView
from .renderers import UserRenderer




class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# Create your views here.
@api_view(['GET'])
def get_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['POST'])
def registerUser(request):
    data = request.data

    # Check if the email already exists
    if User.objects.filter(email=data.get('email')).exists():
        message = {'detail': 'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if the username already exists
    if User.objects.filter(username=data.get('username')).exists():
        message = {'detail': 'User with this username already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Create a new user
        user = User.objects.create(
            username=data.get('username'),
            email=data.get('email'),
            password=make_password(data.get('password')),
            is_active=False
        )

        otp = OTP.objects.create(
            user=user,
            otp_secret=otp_key
        )

        print(otp_code)
        send_otp_email(user.email, otp_code)

        serializer = UserSerializerWithToken(user, many=False)
        return Response({'user_id': user.id, 'data': serializer.data})
    except Exception as e:
        message = {'detail': str(e)}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    
def send_otp_email(email, otp_code):
    data = {
        'email_subject': 'OTP Verification',
        'email_body': f'Hi, your otp is {otp_code}',
        'to_email': email,
    }
    utils.Util.send_email(data)

@api_view(['POST'])
def verify_otp(request):
    print("VERIFY OTP FUNCTION CALLED")
    data = request.data
    print(data)
    try:
        user_id = data['user_id']
        otp_id = data['otp_id']
        otp_code = data['otp_code']
        print(user_id)
        print(otp_id)
        print(otp_code)

        user = User.objects.get(id=user_id)
        otp = OTP.objects.get(id=otp_id, user=user)
        print(otp_code)
        print(otp.otp_secret)

        if user.is_active:
            return Response({'message': 'User is already verified'}, status=status.HTTP_400_BAD_REQUEST)

        if otp.is_verified:
            return Response({'message': 'OTP is already verified'}, status=status.HTTP_400_BAD_REQUEST)
        
        totp = pyotp.TOTP(otp.otp_secret)

        if totp.verify(otp_code, valid_window=7):
            user.is_active = True
            user.save()

            otp.is_verified = True
            otp.save()

            return Response({'message': 'OTP verified successfully'}, status=status.HTTP_200_OK)
        else:
            raise Exception('OTP verification failed')
        
    except Exception as e:
        message = {'message': str(e)}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def resend_otp(request):
    data = request.data
    user_id = data['user_id']
    otp_id = data['otp_id']
    # otp_code = data['otp_code']

    user = User.objects.get(id=user_id)
    otp = OTP.objects.get(id=otp_id, user=user)
    print(otp.otp_secret)
    # print(otp_code)

    otp_key = pyotp.random_base32()
    otp_instance = pyotp.TOTP(otp_key, digits=6)
    otp_code = otp_instance.now()

    otp.otp_secret = otp_key
    otp.is_verified = False
    otp.save()

    send_otp_email(user.email, otp_code)

    return Response({'message': 'OTP has been resent successfully'}, status=status.HTTP_200_OK)
class ChangePasswordView(APIView):
    renderer_classes = (UserRenderer,)
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        print ("Change password request received!")
        print ("Request data:", request.data)
        serializer = UserChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, format=None):
        # Handle PUT request for changing password
        return self.post(request, format)

class SendPasswordResetEmailView(APIView):
    renderer_classes = (UserRenderer,)
    def post(self, request, format=None):
        serializer = SendPasswordResetEmailSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            return Response({'message': 'Password reset email has been sent.'}, status=status.HTTP_200_OK)

class UserPasswordResetView(APIView):
    renderer_classes = (UserRenderer,)
    def post(self, request, uid, token, format=None):
        serializer = UserPasswordResetSerializer(data=request.data, context={'uid': uid, 'token': token})
        if serializer.is_valid(raise_exception=True):
            # Add debugging statement here
            print("Change password request received!")
            print("Request data:", request.data)
            print("UID:", uid)
            serializer.save()  # Save the new password
            return Response({'message': 'Password reset successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)