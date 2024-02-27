from django.db import models
from django.contrib.auth.models import User
import pyotp


# Create your models here.
class OTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    otp_secret = models.CharField(max_length=16)
    is_verified = models.BooleanField(default=False)
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username
    
    def generate_otp(self):
        totp = pyotp.TOTP(self.otp_secret)
        return totp.now()

    def verify(self, entered_otp):
        totp = pyotp.TOTP(self.otp_secret)
        return totp.verify(entered_otp)