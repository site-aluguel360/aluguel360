# Fase III — Filtros do Catálogo Público

**Data:** 24/09/2026  
**Status:** em progresso

## Implementação

A tela `ResultadosPesquisa.jsx` passou a manter um estado único de filtros e a reconstruir a query string sempre que um controle é alterado. Os parâmetros atualmente conectados são:

| Controle | Query param |
|---|---|
| Tipo de imóvel | `tipo` |
| Preço inicial | `preco_min` |
| Preço final | `preco_max` |
| Mobiliado | `mobiliado=true` |
| Ordenação por preço | `ordering=aluguel` ou `ordering=-aluguel` |
| Mais acessados | `ordering=-views_count` |
| Mais recentes | `ordering=-published_at` |

Os componentes `BarraFiltros`, `FiltroLateral` e `FiltroPreco` agora recebem valores controlados e callbacks, sem montar URLs diretamente. A responsabilidade de comunicação permanece centralizada em `listingApi`.

## Evidências de API

No backend local, as requisições foram verificadas:

- `/api/v1/listings/?tipo=CASA` retornou 2 anúncios, ambos `CASA`;
- `/api/v1/listings/?preco_max=2200` retornou 1 anúncio;
- nenhum arquivo Django foi alterado nesta tarefa.

## Validação

- ESLint dos quatro componentes e da página: aprovado;
- `npm run build`: aprovado;
- aviso existente de chunk JavaScript acima de 500 kB permanece não bloqueante.

## Pendências da Fase III

Ainda faltam controles de cidade, estado, quartos, banheiros, garagem e localização, além da paginação cursor com navegação por `next` e `previous`. Esses itens serão tratados antes do checkpoint da fase.
