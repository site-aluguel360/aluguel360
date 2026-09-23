from datetime import timedelta

from django.db import transaction
from django.utils import timezone
from django.views.decorators.cache import never_cache
from django.utils.decorators import method_decorator
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django_ratelimit.decorators import ratelimit

from apps.users.models import Session, User
from .models import DeviceToken, OtpToken
from .serializers import (ForgotPasswordSerializer, LoginSerializer, RegisterSerializer,
                          ResetPasswordSerializer, VerifyOtpSerializer)
from .tasks import send_otp_email, send_welcome_email


def token_response(user):
    refresh = RefreshToken.for_user(user)
    return {'access_token': str(refresh.access_token), 'refresh_token': str(refresh), 'user': {
        'id': str(user.id), 'nome': user.nome, 'email': user.email, 'role': user.role,
        'avatar_url': user.avatar_url,
    }}, refresh


@method_decorator(ratelimit(key='ip', rate='5/m', method='POST', block=True), name='post')
class RegisterView(APIView):
    permission_classes = [AllowAny]

    @transaction.atomic
    def post(self, request):
        serializer = RegisterSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        payload, refresh = token_response(user)
        Session.objects.create(user=user, device_info=request.META.get('HTTP_USER_AGENT', ''),
                               ip_address=request.META.get('REMOTE_ADDR'), refresh_token_jti=str(refresh['jti']))
        send_welcome_email.delay(str(user.id))
        return Response(payload, status=status.HTTP_201_CREATED)


@method_decorator(ratelimit(key='ip', rate='10/m', method='POST', block=True), name='post')
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        payload, refresh = token_response(user)
        Session.objects.update_or_create(user=user, ip_address=request.META.get('REMOTE_ADDR'), defaults={
            'device_info': request.META.get('HTTP_USER_AGENT', ''), 'is_active': True,
            'refresh_token_jti': str(refresh['jti']),
        })
        User.objects.filter(pk=user.pk).update(last_login_at=timezone.now())
        return Response(payload)


@method_decorator(ratelimit(key='ip', rate='3/h', method='POST', block=True), name='post')
class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.filter(email__iexact=serializer.validated_data['email'], is_active=True).first()
        if user:
            _, code = OtpToken.create_for_user(user)
            send_otp_email.delay(user.email, user.nome, code)
        return Response({'message': 'Se este email estiver cadastrado, você receberá um código.'})


@method_decorator(ratelimit(key='ip', rate='10/h', method='POST', block=True), name='post')
class VerifyOtpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOtpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.filter(email__iexact=serializer.validated_data['email']).first()
        otp = OtpToken.objects.filter(user=user, used_at__isnull=True).order_by('-created_at').first() if user else None
        if not otp or not otp.is_valid(serializer.validated_data['codigo']):
            return Response({'error': 'Código inválido ou expirado.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'Código verificado com sucesso.'})


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        user = User.objects.filter(email__iexact=data['email']).first()
        otp = OtpToken.objects.filter(user=user, used_at__isnull=True).order_by('-created_at').first() if user else None
        if not otp or not otp.is_valid(data['codigo']):
            return Response({'error': 'Código inválido.'}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(data['nova_senha'])
        user.save(update_fields=['password'])
        otp.mark_used()
        Session.objects.filter(user=user).update(is_active=False)
        return Response({'message': 'Senha redefinida com sucesso.'})


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            token = RefreshToken(request.data['refresh_token'])
            token.blacklist()
            Session.objects.filter(user=request.user, refresh_token_jti=str(token['jti'])).update(is_active=False)
        except Exception:
            return Response({'error': 'Token inválido.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'Logout realizado com sucesso.'})


class RegisterDeviceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        token = request.data.get('token')
        platform = request.data.get('platform')
        if not token or platform not in ('ios', 'android'):
            return Response({'error': 'Token e plataforma são obrigatórios.'}, status=status.HTTP_400_BAD_REQUEST)
        DeviceToken.objects.update_or_create(token=token, defaults={
            'user': request.user, 'platform': platform, 'device_name': request.data.get('device_name', ''), 'is_active': True,
        })
        return Response({'message': 'Dispositivo registrado.'})


class DeleteDeviceView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        deleted, _ = DeviceToken.objects.filter(pk=pk, user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT if deleted else status.HTTP_404_NOT_FOUND)
