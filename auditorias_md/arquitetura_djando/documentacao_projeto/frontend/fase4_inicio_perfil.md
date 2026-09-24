# Fase IV — Perfil e recursos privados

**Data de início:** 24/09/2026  
**Motivo:** checkpoint manual da Fase III aprovado pelo usuário.

## Primeiro escopo

Integrar a tela principal de perfil aos endpoints autenticados:

- `GET /api/v1/users/me/`;
- `GET /api/v1/users/me/stats/`.

A tela não deve inventar CPF: o serializer Django não devolve esse campo e a Constituição proíbe sua exposição em texto puro. O email será exibido somente para leitura.

## Critério técnico

A tela deve carregar dados depois do refresh, apresentar loading/erro e substituir os números mockados de perfil, endereços, imóveis e qualidade por valores derivados das respostas reais.
