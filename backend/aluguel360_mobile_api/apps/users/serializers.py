from rest_framework import serializers

from .models import Address, Session, User


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'cep', 'logradouro', 'numero', 'bairro', 'cidade', 'estado', 'complemento', 'is_primary', 'created_at']
        read_only_fields = ['id', 'created_at']


class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ['id', 'device_name', 'device_info', 'ip_address', 'is_active', 'created_at', 'last_seen_at']
        read_only_fields = fields


class UserPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'nome', 'avatar_url', 'created_at']


class UserMeSerializer(serializers.ModelSerializer):
    addresses = AddressSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'nome', 'email', 'telefone', 'data_nascimento', 'avatar_url', 'role', 'email_verificado', 'created_at', 'addresses']
        read_only_fields = ['id', 'email', 'role', 'email_verificado', 'created_at']


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['nome', 'telefone', 'data_nascimento']


class UserStatsSerializer(serializers.Serializer):
    imoveis_cadastrados = serializers.IntegerField()
    imoveis_publicados = serializers.IntegerField()
    imoveis_alugados = serializers.IntegerField()
    imoveis_rascunho = serializers.IntegerField()
    anuncios_ativos = serializers.IntegerField()
    total_visualizacoes = serializers.IntegerField()
    total_favoritos = serializers.IntegerField()
    quality_score_medio = serializers.FloatField()
