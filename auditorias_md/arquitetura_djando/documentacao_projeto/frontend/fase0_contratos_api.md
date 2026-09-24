# Fase 0 — Contratos da API para o Frontend

**Projeto:** Aluguel360  
**Data:** 24/09/2026  
**Fonte:** código efetivo do backend local

## 1. URL base

O backend registra `API_PREFIX = 'api/v1/'`. Para execução local do frontend, a URL base é:

```text
http://localhost:8000/api/v1
```

A configuração deve ser feita por `VITE_API_URL`. O frontend não deve duplicar esse prefixo em cada tela.

O health check fica fora do prefixo da API:

```text
GET http://localhost:8000/health
```

Resposta esperada:

```json
{"status": "ok"}
```

## 2. Autenticação

As rotas protegidas usam:

```http
Authorization: Bearer <access_token>
```

| Método | Endpoint | Uso |
|---|---|---|
| POST | `/auth/register/` | Criar usuário e endereço. |
| POST | `/auth/login/` | Autenticar por email e senha. |
| POST | `/auth/token/refresh/` | Renovar access token. |
| POST | `/auth/logout/` | Invalidar refresh token. |
| POST | `/auth/forgot-password/` | Solicitar OTP. |
| POST | `/auth/verify-otp/` | Validar código OTP. |
| POST | `/auth/reset-password/` | Redefinir senha. |
| POST | `/auth/devices/register/` | Registrar dispositivo. |
| DELETE | `/auth/devices/{id}/` | Remover dispositivo. |

O frontend deve armazenar somente os tokens necessários à sessão local e nunca mostrar tokens na interface ou em logs.

## 3. Usuário autenticado

| Método | Endpoint | Uso |
|---|---|---|
| GET | `/users/me/` | Carregar usuário atual. |
| PATCH | `/users/me/` | Atualizar campos permitidos. |
| DELETE | `/users/me/` | Solicitar soft delete da conta. |
| GET/POST | `/users/me/addresses/` | Listar/criar endereços. |
| PATCH/DELETE | `/users/me/addresses/{id}/` | Alterar/remover endereço. |
| GET | `/users/me/sessions/` | Listar sessões. |
| DELETE | `/users/me/sessions/{id}/` | Encerrar sessão. |
| GET | `/users/me/stats/` | Carregar estatísticas do perfil. |
| GET | `/users/me/favorites/` | Listar favoritos. |

O email deve permanecer somente leitura no frontend até existir fluxo de alteração com verificação.

## 4. Imóveis e anúncios

| Método | Endpoint | Uso |
|---|---|---|
| GET/POST | `/properties/` | Listar/criar imóveis conforme permissão. |
| GET/PATCH/DELETE | `/properties/{id}/` | Consultar/editar/soft delete. |
| GET/POST | `/listings/` | Listar/criar anúncios. |
| GET/PATCH/DELETE | `/listings/{id}/` | Consultar/editar/remover anúncio. |
| GET | `/listings/featured/` | Listar anúncios destacados. |
| GET | `/listings/mine/` | Listar anúncios do usuário. |
| POST | `/listings/{id}/publish/` | Publicar anúncio. |
| POST | `/listings/{id}/pause/` | Pausar anúncio. |
| POST | `/listings/{id}/favorite/` | Alternar favorito, conforme action efetiva. |

Listagens públicas devem respeitar paginação cursor. O frontend não deve introduzir paginação por offset.

## 5. Mídia

| Método | Endpoint | Uso |
|---|---|---|
| GET/POST | `/media/` | Listar/enviar mídia. |
| GET/DELETE | `/media/{id}/` | Consultar/remover mídia. |
| GET | `/media/quota/` | Consultar quota. |
| POST | `/media/{id}/set-featured/` | Definir mídia em destaque, conforme action efetiva. |

Uploads devem utilizar `FormData` e não devem definir manualmente o header `Content-Type`. O backend é responsável pela validação do MIME real, limites e storage.

## 6. Notificações e busca

| Método | Endpoint | Uso |
|---|---|---|
| GET | `/notifications/` | Listar notificações do usuário. |
| PATCH | `/notifications/{id}/read/` | Marcar uma notificação como lida. |
| POST | `/notifications/read-all/` | Marcar todas como lidas. |
| GET | `/search/?q=...` | Buscar anúncios/imóveis. |

## 7. Respostas

O renderer padrão do backend deve ser tratado pelo frontend no formato:

```json
{"success": true, "data": {}}
```

Erros devem ser tratados no formato geral:

```json
{"success": false, "error": "mensagem", "details": {}}
```

Também podem existir erros de validação por campo. O cliente deve preservar `details` para que as telas possam exibir mensagens próximas dos campos correspondentes.

## 8. Decisões obrigatórias

- Não enviar `cpf_hash` para o backend a partir do frontend;
- enviar CPF bruto somente no cadastro, quando exigido pelo contrato, sem persistir esse valor em logs;
- não alterar o backend para acomodar os formatos dos mocks;
- adaptar respostas Django para view-models no frontend;
- não usar dados de outro usuário em telas autenticadas;
- não tratar um fallback de demonstração como confirmação de persistência;
- não colocar credenciais Cloudinary, Firebase, SMTP ou Sentry no bundle público.

## 9. Pontos a confirmar antes das próximas fases

Antes das tarefas de imóveis, mídia e favoritos, a implementação deve conferir no schema Swagger e nos serializers a assinatura final das actions do ViewSet. Caso o contrato efetivo diverja deste registro, deve ser criada uma pendência de contrato antes da implementação, conforme a Constituição.
