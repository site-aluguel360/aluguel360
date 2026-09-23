import re

from django.core.exceptions import ValidationError


def validate_cpf(cpf: str) -> str:
    digits = re.sub(r'\D', '', cpf or '')
    if len(digits) != 11 or len(set(digits)) == 1:
        raise ValidationError('CPF inválido.')
    for position in (9, 10):
        total = sum(int(digits[index]) * (position + 1 - index) for index in range(position))
        if (total * 10 % 11) % 10 != int(digits[position]):
            raise ValidationError('CPF inválido.')
    return digits


def validate_cep(cep: str) -> str:
    digits = re.sub(r'\D', '', cep or '')
    if len(digits) != 8:
        raise ValidationError('CEP inválido.')
    return digits


def validate_telefone(tel: str) -> str:
    digits = re.sub(r'\D', '', tel or '')
    if digits.startswith('55') and len(digits) in (12, 13):
        digits = digits[2:]
    if len(digits) not in (10, 11) or digits[:2].find('0') >= 0:
        raise ValidationError('Telefone inválido.')
    if len(digits) == 11 and digits[2] != '9':
        raise ValidationError('Telefone inválido.')
    if len(digits) == 10 and digits[2] not in '2345':
        raise ValidationError('Telefone inválido.')
    return digits
