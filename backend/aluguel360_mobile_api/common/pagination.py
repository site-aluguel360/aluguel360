from rest_framework.pagination import CursorPagination, PageNumberPagination
from rest_framework.response import Response


class MobileCursorPagination(CursorPagination):
    """
    Paginação por cursor para scroll infinito no mobile.
    O cursor é opaco para o cliente (string base64 encodada).
    """
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 50
    ordering = '-created_at'

    def get_paginated_response(self, data):
        return Response({
            'success': True,
            'data': {
                'results': data,
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
                'count': None,  # Cursor pagination não conta total (performance)
            }
        })


class StandardPagePagination(PageNumberPagination):
    """Para listagens administrativas onde offset é aceitável."""
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100
