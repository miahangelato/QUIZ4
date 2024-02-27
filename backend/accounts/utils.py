from django.core.mail import EmailMessage
import os
from django.conf import settings
# from django.core.mail import send_mail
class Util:
    @staticmethod
    def send_email(data):
        email = EmailMessage(subject=data['email_subject'], body=data['email_body'], from_email=settings.EMAIL_HOST_USER, to=[data['to_email']])
        email.send()
