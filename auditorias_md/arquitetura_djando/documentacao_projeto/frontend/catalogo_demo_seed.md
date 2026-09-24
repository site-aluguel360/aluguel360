# Seed do catálogo de demonstração

**Data:** 24/09/2026  
**Ambiente:** Docker Desktop / PostgreSQL local

## Objetivo

Substituir os dados fixos usados nos cards da Home por registros persistentes no banco local, sem alterar o contrato da API Django e sem criar CPF em texto puro.

## Proprietário fictício

Foi criado de forma idempotente o terceiro usuário:

- Email: `proprietario.demo@aluguel360.test`
- Nome: `Proprietário Demo Aluguel360`
- Perfil: `PROPRIETARIO`

A senha foi processada pelo `UserManager` e o CPF fornecido ao manager é armazenado somente como hash SHA-256, conforme a Constituição. O usuário é exclusivo para o ambiente local de demonstração.

## Registros criados

Foram persistidos três imóveis ativos e três anúncios publicados, vinculados ao proprietário fictício:

| Título | Tipo | Cidade | Aluguel | Quartos |
|---|---|---|---:|---:|
| Apartamento com Vista Panorâmica - Alto do Horizonte | Apartamento | Florianópolis/SC | R$ 3.600,00 | 4 |
| Casa Rústica - Serra das Palmeiras | Casa | Florianópolis/SC | R$ 2.050,00 | 2 |
| Casa Térrea Aconchegante - Bairro Jardim das Flores | Casa | Florianópolis/SC | R$ 2.300,00 | 3 |

Cada imóvel também possui seu cômodo `quartos` persistido em `property_rooms`.

As imagens antigas continuam sendo assets visuais locais da aplicação até que o fluxo de upload real seja executado; os textos, valores, localização, tipo, área, quartos e status agora vêm do PostgreSQL por meio de `/api/v1/listings/`.

## Comando reproduzível

No container Django:

```bash
python manage.py seed_demo_catalog
```

O comando é idempotente: uma segunda execução atualiza os três anúncios existentes e não cria duplicatas.

## Evidências

- `python manage.py check`: aprovado, sem problemas.
- Primeira execução: `3 anúncios criados`.
- Segunda execução: `0 anúncios criados, 3 anúncios atualizados`.
- Consulta final: `1` usuário demo, `3` imóveis e `3` anúncios publicados.
- Senha armazenada como hash: confirmado.

## Correção posterior

Durante a integração local foi identificado que a API estava retornando dois envelopes `data` aninhados (`data.data.results`). O adaptador `adaptListings` foi tornado tolerante a arrays, paginação e até três níveis de envelope antes de executar `map`.

Também foram encontrados três anúncios legados criados antes da vinculação ao terceiro usuário. Eles não foram apagados fisicamente: o comando marcou esses anúncios como `EXPIRADO` e os imóveis correspondentes como inativos com `deleted_at`, mantendo somente os três anúncios do proprietário demo no catálogo público.

Estado final verificado: `PUBLIC_TOTAL=3`, `DEMO_PUBLIC=3`, `LEGACY_PUBLIC=0`.
