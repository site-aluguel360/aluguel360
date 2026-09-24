from django.http import JsonResponse
from rest_framework.exceptions import APIException


class RatelimitExceeded(APIException):
    status_code = 429
    default_detail = 'Muitas tentativas. Tente novamente mais tarde.'
    default_code = 'rate_limit_exceeded'


def ratelimit_view(request, exception):
    return JsonResponse(
        {
            'success': False,
            'error': 'Muitas tentativas. Tente novamente mais tarde.',
        },
        status=429,
    )
