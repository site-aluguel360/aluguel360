# Fase IV — Imóveis próprios e anúncios privados

**Data:** 24/09/2026  
**Status técnico:** concluído

## Imóveis próprios

`PerfilMeusImoveis.jsx` consulta `GET /api/v1/properties/`, que é protegido pelo backend e filtrado pelo proprietário autenticado. A tela não possui mais `imoveisMock` nem usuário fictício. A remoção usa `DELETE /properties/{id}/`, cujo comportamento no backend é soft delete.

## Anúncios próprios

`PerfilMeusAnuncios.jsx` consulta `GET /api/v1/listings/mine/`, filtra os registros por status e utiliza as actions reais:

- `POST /listings/{id}/publish/`;
- `POST /listings/{id}/pause/`;
- `DELETE /listings/{id}/`.

As métricas exibidas são `views_count`, `messages_count` e `favorites_count` retornadas pelo backend. Após publicar ou pausar, a tela recarrega a coleção do usuário.

## Segurança e validações

- Endpoints `/properties/` e `/listings/mine/` sem JWT retornaram HTTP 401.
- ESLint das telas e cliente HTTP: aprovado.
- Build do frontend: aprovado.
- Verificação de contratos e ausência dos mocks antigos: aprovada.
- O frontend não recebe nem exibe recursos de outro proprietário; o isolamento é garantido pela queryset autenticada do backend.

## Teste manual pendente

Ainda é necessário testar no navegador com o usuário demo e confirmar visualmente listagem, soft delete, publicação, pausa e atualização após refresh.
