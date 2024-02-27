from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from . import utils
from django.utils.encoding import DjangoUnicodeDecodeError
from rest_framework.exceptions import ValidationError





class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data

        for [k, v] in serializer.items():
            data[k] = v

        return data

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin']

    def get__id(self, obj):
        return obj.id
    
    def get_isAdmin(self, obj):
        return obj.is_staff

    def get_name(self, obj):
        name = obj.first_name
        if name == '':
            name = obj.email

        return name
    
class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin', 'token']
    
    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)
    

class UserChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)
    password = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)
    password2 = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)

    def validate(self, attrs):
        old_password = attrs.get('password')
        password = attrs.get('password')
        password2 = attrs.get('password2')
        
        # Check if the old password matches the user's current password
        user = self.context['request'].user
        if not user.check_password(old_password):
            raise serializers.ValidationError({'old_password': 'Old password is incorrect'})
        
        # Check if the new passwords match
        if password != password2:
            raise serializers.ValidationError({'password': 'Password fields didn\'t match'})
        
        return attrs

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['password'])
        user.save()
        return user

class SendPasswordResetEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)

    def validate(self, attrs):
        email = attrs.get('email')
        try:
            user = User.objects.get(email=email)
            uid_bytes = force_bytes(user.pk)
            uid = urlsafe_base64_encode(uid_bytes)
            token = PasswordResetTokenGenerator().make_token(user)
            link = f'http://localhost:5173/reset-password/{uid}/{token}/'
            utils.Util.send_email({'to_email': email, 'email_subject': 'Password Reset', 'email_body': link})
            return attrs
        except User.DoesNotExist:
            raise serializers.ValidationError({'email': 'Email is not registered'})

class UserPasswordResetSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)
    password2 = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)

    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        if password != password2:
            raise serializers.ValidationError({'password': 'Password fields didn\'t match'})
        return attrs

    def save(self, **kwargs):
        uid = self.context.get('uid')
        token = self.context.get('token')

        # Check if uid and token are provided
        if not uid or not token:
            raise serializers.ValidationError({'detail': 'UID or token is missing'})

        try:
            id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError({'detail': 'Invalid token'})

        if not PasswordResetTokenGenerator().check_token(user, token):
            raise serializers.ValidationError({'detail': 'Token is invalid or expired'})

        user.set_password(self.validated_data['password'])
        user.save()

        return user