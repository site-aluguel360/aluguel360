from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsOwnerOrReadOnly(BasePermission):
    """Permite leitura pública e escrita somente ao proprietário do objeto."""

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return getattr(obj, 'owner_id', None) == request.user.id or getattr(obj, 'user_id', None) == request.user.id
