from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (DeleteDeviceView, ForgotPasswordView, LoginView, LogoutView,
                    RegisterDeviceView, RegisterView, ResetPasswordView, VerifyOtpView)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('verify-otp/', VerifyOtpView.as_view(), name='verify-otp'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('devices/register/', RegisterDeviceView.as_view(), name='register-device'),
    path('devices/<uuid:pk>/', DeleteDeviceView.as_view(), name='delete-device'),
]
