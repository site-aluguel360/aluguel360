# Fase III — Catálogo Público: Home

**Data de início:** 24/09/2026  
**Status:** em progresso

## Escopo executado

A seção de imóveis mais acessados da `src/pages/Home.jsx` deixou de utilizar cards fixos de demonstração. A tela consulta o endpoint público `GET /api/v1/listings/` com ordenação por visualizações e limita a exibição inicial aos seis primeiros resultados.

A resposta é convertida pelo adaptador `adaptListings`, sem alteração no backend. O adaptador foi ajustado para reconhecer os campos efetivamente devolvidos por `ListingListSerializer`: `titulo`, `aluguel`, `cidade`, `estado`, `area_m2`, `quartos` e `foto_destaque`.

A Home possui estados explícitos para carregamento, erro da API e ausência de anúncios. Não é usado fallback fictício nessa seção; quando o banco não possui listings publicados, a mensagem informa que não há imóveis disponíveis.

## Validações pendentes

A conclusão da tarefa exige:

- lint de `Home.jsx` e `adapters.js`;
- build do frontend;
- teste manual com listing publicado no PostgreSQL;
- teste com banco sem listings;
- teste com API indisponível;
- confirmação de que o card não exibe os títulos antigos de demonstração.

## Observação de navegação

Os cards direcionam para `/resultados`, que é a rota de catálogo existente. A rota de detalhe individual não foi criada nesta etapa e não foi inventada no frontend.
