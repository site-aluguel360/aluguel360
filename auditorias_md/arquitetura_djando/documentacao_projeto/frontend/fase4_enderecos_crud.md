# Fase IV — CRUD de endereços

**Data:** 24/09/2026  
**Status técnico:** concluído

`PerfilEnderecos.jsx` deixou de utilizar `enderecosMock` e passou a consumir exclusivamente os serviços autenticados:

- `GET /users/me/addresses/`;
- `POST /users/me/addresses/`;
- `PATCH /users/me/addresses/{id}/`;
- `DELETE /users/me/addresses/{id}/`.

A tela permite listar endereços, abrir formulário de criação, editar registros existentes, excluir registros e marcar um endereço como principal. Após criação ou edição, os dados são recarregados da API. Erros, carregamento e mensagens de sucesso são exibidos na tela.

A exclusão usa o endpoint do `AddressViewSet`, que restringe o queryset ao usuário autenticado. O frontend não aceita IDs de outro usuário nem consulta dados públicos de endereço.

## Validações

- ESLint de `api.js` e `PerfilEnderecos.jsx`: aprovado.
- Build do frontend: aprovado.
- Serviços `addresses`, `createAddress`, `updateAddress` e `deleteAddress`: presentes.
- Strings e arrays mockados antigos: removidos.

## Teste manual pendente

Ainda é necessário testar no navegador a criação, edição, exclusão, definição de principal e persistência após refresh com um usuário autenticado.
