from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Address, Session

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    ordering = ['email']
    list_display = ['email', 'nome', 'role', 'is_active', 'created_at']
    list_filter = ['role', 'is_active']
    search_fields = ['email', 'nome', 'cpf_hash']
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Informações Pessoais', {'fields': ('nome', 'cpf_hash', 'telefone', 'data_nascimento', 'avatar_url', 'role')}),
        ('Permissões', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Datas Importantes', {'fields': ('last_login_at', 'created_at', 'updated_at', 'deleted_at')}),
    )
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ['logradouro', 'numero', 'cidade', 'estado', 'user', 'is_primary']
    list_filter = ['estado', 'is_primary']
    search_fields = ['logradouro', 'cidade', 'user__email']

@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ['user', 'device_name', 'ip_address', 'is_active', 'last_seen_at']
    list_filter = ['is_active']
    search_fields = ['user__email', 'device_name', 'ip_address']
