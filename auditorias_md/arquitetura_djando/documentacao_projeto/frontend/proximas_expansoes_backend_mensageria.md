# Próximas expansões do backend — Contatos e Mensageria

**Data:** 25/09/2026  
**Status:** planejado — nenhuma rota ou código implementado nesta etapa

## Objetivo

Registrar as expansões necessárias para tornar reais as telas:

- `contato-anunciante`: lado do interessado;
- `visualizacao-contatos`: lado do proprietário/locador.

As telas atuais permanecem sem integração backend até a definição e implementação dos contratos abaixo.

## Modelo de dados proposto

### Conversation

- `id` UUID;
- `listing` FK para `Listing`;
- `interested_user` FK para `User`;
- `owner` FK para `User`;
- `status` (`ATIVA`, `ARQUIVADA`, `BLOQUEADA`);
- `created_at`;
- `updated_at`;
- `last_message_at`.

Restrições:

- Uma conversa por combinação de anúncio e interessado;
- O proprietário deve ser derivado do anúncio;
- O interessado não pode conversar com o próprio anúncio;
- O anúncio deve ser publicado para iniciar novo contato.

### Message

- `id` UUID;
- `conversation` FK;
- `sender` FK para `User`;
- `body` texto;
- `attachment` opcional, somente após definição de política de anexos;
- `read_at` opcional;
- `created_at`;
- `deleted_at` para soft delete, se necessário.

## Endpoints planejados

### Interessado

```text
POST /api/v1/conversations/
GET  /api/v1/conversations/{id}/
GET  /api/v1/conversations/{id}/messages/
POST /api/v1/conversations/{id}/messages/
POST /api/v1/conversations/{id}/read/
```

O `POST /conversations/` deve receber somente o `listing`; o proprietário deve ser obtido no backend.

### Proprietário

```text
GET  /api/v1/conversations/received/
GET  /api/v1/conversations/{id}/
GET  /api/v1/conversations/{id}/messages/
POST /api/v1/conversations/{id}/messages/
POST /api/v1/conversations/{id}/read/
```

`received/` deve retornar somente conversas de anúncios pertencentes ao usuário autenticado.

## Contratos de resposta planejados

### Resumo da conversa

```json
{
  "id": "uuid",
  "listing": {
    "id": "uuid",
    "titulo": "string",
    "foto_destaque": "url ou null"
  },
  "interessado": {
    "id": "uuid",
    "nome": "string",
    "avatar_url": "url ou null"
  },
  "proprietario": {
    "id": "uuid",
    "nome": "string"
  },
  "ultima_mensagem": {
    "texto": "string",
    "created_at": "datetime",
    "sender_id": "uuid"
  },
  "unread_count": 0,
  "updated_at": "datetime"
}
```

### Mensagem

```json
{
  "id": "uuid",
  "sender_id": "uuid",
  "texto": "string",
  "created_at": "datetime",
  "read_at": "datetime ou null"
}
```

## Segurança e autorização

- Somente o interessado e o proprietário do anúncio podem acessar a conversa;
- O proprietário não pode informar outro `owner` no payload;
- O interessado não pode alterar `listing`, `interested_user` ou `owner` após a criação;
- Usuários não autenticados não podem iniciar nem consultar conversas;
- O queryset deve ser sempre filtrado pelo usuário autenticado;
- Mensagens devem ser limitadas por tamanho e frequência para reduzir spam;
- Dados pessoais do interessado não devem aparecer em listagens públicas;
- E-mail e telefone somente devem ser expostos conforme política explícita do produto.

## Regras de negócio pendentes

- [ ] Definir se um anúncio pausado mantém conversas abertas;
- [ ] Definir se anúncios expirados permitem novas mensagens;
- [ ] Definir bloqueio e denúncia de usuário;
- [ ] Definir retenção e exclusão de mensagens;
- [ ] Definir anexos e integração com o storage local de mídia;
- [ ] Definir notificações por e-mail/push;
- [ ] Definir paginação e limite de histórico;
- [ ] Definir ordenação por `last_message_at`.

## Testes backend planejados

- [ ] Interessado cria conversa para anúncio publicado;
- [ ] Interessado não cria conversa para anúncio próprio;
- [ ] Interessado não cria conversa para anúncio inexistente;
- [ ] Proprietário lista somente suas conversas;
- [ ] Usuário externo recebe `403` ou `404` ao acessar conversa alheia;
- [ ] Participante envia mensagem;
- [ ] Não participante não envia mensagem;
- [ ] Marcação de leitura atualiza somente mensagens do participante correto;
- [ ] Paginação mantém ordem cronológica;
- [ ] Soft delete, bloqueio e anúncio inativo obedecem às regras definidas.

## Implementação futura no frontend

### `contato-anunciante`

- Remover `IMOVEL_MOCK`, `LOCADOR_MOCK`, `USUARIO_MOCK` e `HISTORICO_MOCK`;
- Obter `listingId` pela rota ou pelo estado de navegação;
- Criar/obter conversa real;
- Carregar mensagens;
- Enviar mensagens via API;
- Exibir loading, vazio, erro e retry;
- Remover respostas automáticas com `setTimeout`.

### `visualizacao-contatos`

- Remover `MOCK_IMOVEIS`;
- Carregar `/conversations/received/`;
- Agrupar por anúncio;
- Exibir não lidas e última mensagem;
- Abrir a conversa real;
- Marcar mensagens como lidas;
- Manter a busca e o layout visual atual.

## Fora do escopo desta etapa

- Nenhum model foi criado;
- Nenhuma migration foi criada;
- Nenhuma URL foi registrada;
- Nenhum serializer ou ViewSet foi implementado;
- Nenhuma tela de contato foi modificada.
