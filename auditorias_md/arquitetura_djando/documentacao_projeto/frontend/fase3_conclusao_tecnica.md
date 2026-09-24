# Fase III — Conclusão técnica do catálogo público

**Data:** 24/09/2026  
**Status técnico:** concluída  
**Testes manuais de interface:** pendentes, conforme solicitado

## Entregas

A Home consome listings reais por meio de `listingApi` e `adaptListings`, com estados de carregamento, erro e catálogo vazio. Os cards antigos deixaram de ser a fonte primária.

A tela de resultados consulta os filtros documentados pelo backend: tipo, cidade, estado, bairro, preço mínimo e máximo, quartos, banheiros, garagem, área mínima e máxima, mobiliado e ordenação. Cada alteração reconstrói a query string e reinicia a paginação na primeira página.

A paginação cursor consome os links opacos `next` e `previous` devolvidos pelo Django. O cliente HTTP aceita links absolutos, e a tela substitui os cards ao navegar, evitando duplicação. Nenhum cursor é calculado ou modificado pelo frontend.

O normalizador de respostas suporta arrays, respostas paginadas e os envelopes `success/data` usados pelo renderer atual, inclusive quando há mais de um nível de `data`.

## Evidências automatizadas

- ESLint dos arquivos da Fase III: aprovado.
- `npm run build`: aprovado.
- `GET /api/v1/listings/?tipo=CASA`: 2 resultados.
- `GET /api/v1/listings/?preco_max=2200`: 1 resultado.
- `GET /api/v1/listings/?area_min=100`: 1 resultado.
- `GET /api/v1/listings/?quartos_min=3`: 2 resultados.
- Cursor com `page_size=1`: primeira e segunda páginas retornaram IDs distintos.
- Nenhuma alteração nos modelos, serializers, views ou rotas do backend.

## Pendências manuais para o checkpoint

A conclusão funcional da fase ainda requer somente a verificação no navegador: cards reais na Home, loading, estado vazio, filtros, navegação anterior/próxima e comportamento visual em diferentes larguras. Esses testes não foram executados automaticamente nesta etapa.
