import re

from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from rest_framework import serializers

from apps.users.models import Address, User


class AddressWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['cep', 'logradouro', 'numero', 'bairro', 'cidade', 'estado', 'complemento']


class RegisterSerializer(serializers.Serializer):
    nome = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    cpf = serializers.CharField(max_length=14, write_only=True)
    senha = serializers.CharField(write_only=True, min_length=8)
    confirmar_senha = serializers.CharField(write_only=True)
    telefone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    data_nascimento = serializers.DateField(required=False, allow_null=True)
    endereco = AddressWriteSerializer(required=False)

    def validate_cpf(self, value):
        digits = re.sub(r'\D', '', value)
        if len(digits) != 11 or len(set(digits)) == 1:
            raise serializers.ValidationError('CPF inválido.')
        for position in (9, 10):
            total = sum(int(digits[index]) * (position + 1 - index) for index in range(position))
            if (total * 10 % 11) % 10 != int(digits[position]):
                raise serializers.ValidationError('CPF inválido.')
        return digits

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('Este email já está cadastrado.')
        return value

    def validate(self, data):
        if data['senha'] != data['confirmar_senha']:
            raise serializers.ValidationError({'confirmar_senha': 'As senhas não coincidem.'})
        if User.objects.filter(cpf_hash=User.hash_cpf(data['cpf'])).exists():
            raise serializers.ValidationError({'cpf': 'Este CPF já está cadastrado.'})
        try:
            validate_password(data['senha'])
        except Exception as exc:
            raise serializers.ValidationError({'senha': list(exc.messages)}) from exc
        return data

    @transaction.atomic
    def create(self, validated_data):
        address_data = validated_data.pop('endereco', None)
        validated_data.pop('confirmar_senha')
        senha = validated_data.pop('senha')
        cpf = validated_data.pop('cpf')
        user = User.objects.create_user(cpf=cpf, senha=senha, **validated_data)
        if address_data:
            Address.objects.create(user=user, is_primary=True, **address_data)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    senha = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(request=self.context.get('request'), email=data['email'], password=data['senha'])
        if not user:
            raise serializers.ValidationError('Email ou senha incorretos.')
        if not user.is_active:
            raise serializers.ValidationError('Conta desativada.')
        data['user'] = user
        return data


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class VerifyOtpSerializer(serializers.Serializer):
    email = serializers.EmailField()
    codigo = serializers.CharField(min_length=6, max_length=6)


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    codigo = serializers.CharField(min_length=6, max_length=6)
    nova_senha = serializers.CharField(write_only=True, min_length=8)
    confirmar_nova_senha = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['nova_senha'] != data['confirmar_nova_senha']:
            raise serializers.ValidationError({'confirmar_nova_senha': 'As senhas não coincidem.'})
        validate_password(data['nova_senha'])
        return data
