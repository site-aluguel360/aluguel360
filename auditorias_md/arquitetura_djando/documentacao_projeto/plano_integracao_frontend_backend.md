# Plano de integração das telas React com o backend Django

**Projeto:** Aluguel360

**Data do levantamento:** 24/09/2026

**Escopo:** integrar o frontend React existente em `src/` à API Django em `backend/aluguel360_mobile_api`, mantendo o visual das telas e substituindo os estados simulados por dados reais.

## 1. Diagnóstico atual

O frontend possui um conjunto amplo de telas e componentes visuais, mas ainda não possui cliente HTTP, camada de serviços, armazenamento de tokens ou proteção de rotas. O `AuthContext` mantém apenas um booleano em memória; o login chama `login()` sem enviar credenciais; o cadastro de usuário apenas avança entre etapas; e as telas de perfil, imóveis, anúncios e mídia usam objetos `Mock` locais. A tela de resultados também renderiza uma lista fixa de sete imóveis.

O backend está disponível sob o prefixo `/api/v1/` e já oferece endpoints de autenticação, usuários, properties, listings, mídia, notificações e busca. Portanto, a integração deve começar pela infraestrutura do cliente HTTP e autenticação, antes de substituir cada tela isoladamente.

## 2. Contrato base da integração

| Item | Decisão |
|---|---|
| URL local | `http://localhost:8000/api/v1` |
| Variável Vite | `VITE_API_URL` |
| Transporte | `fetch` encapsulado em `src/lib/api.js` ou cliente equivalente |
| Autenticação | `Authorization: Bearer <access_token>` |
| Persistência | `localStorage` para access/refresh token na aplicação web local |
| Renovação | `POST /auth/token/refresh/` quando a API retornar 401 |
| Logout | `POST /auth/logout/`, seguido de limpeza local |
| Erros | Normalizar respostas do renderer Django e erros de validação por campo |
| Upload | `FormData`, sem definir manualmente o header `Content-Type` |
| Prefixo backend | `/api/v1/` |

A implementação deve separar os módulos de transporte (`api.js`), autenticação (`authService.js`), usuários (`userService.js`), imóveis/anúncios (`propertyService.js`/`listingService.js`) e mídia (`mediaService.js`). As telas não devem montar URLs diretamente nem duplicar a lógica de tokens.

## 3. Mapeamento tela → endpoint

| Tela ou fluxo | Endpoint(s) | Estado atual | Adaptação necessária |
|---|---|---|---|
| `Login.jsx` | `POST /auth/login/` | Formulário sem valores/names e login fictício | Enviar `email` e `senha`, armazenar tokens e usuário, redirecionar após sucesso |
| `CadastroUsuario.jsx` | `POST /auth/register/` | Fluxo visual em três etapas | Converter `nascimento` para `data_nascimento`, `confirmarSenha` para `confirmar_senha` e agrupar endereço em `endereco` |
| `RecuperarSenha.jsx` | `POST /auth/forgot-password/`, `POST /auth/verify-otp/`, `POST /auth/reset-password/` | Avança de etapa sem chamadas | Controlar email, código de seis dígitos, nova senha e confirmação |
| `Home.jsx` | `GET /listings/?ordering=-views_count` ou `GET /search/?q=` | Cards fixos | Buscar dados reais e manter fallback de estado vazio/loading |
| `ResultadosPesquisa.jsx` | `GET /listings/` e `GET /search/?q=` | Sete imóveis mockados | Serializar filtros da barra/lateral para query params e mapear resposta paginada |
| `Perfil.jsx` | `GET /users/me/`, `GET /users/me/stats/` | Perfil mockado | Carregar usuário e estatísticas reais |
| `EditProfile.jsx` | `PATCH /users/me/` | Salva somente no estado local | Mapear `dataNascimento` para `data_nascimento` e atualizar o contexto após sucesso |
| `PerfilEnderecos.jsx` | CRUD `/users/me/addresses/` | Endereços mockados | Implementar listagem, criação, edição e exclusão |
| `PerfilMeusImoveis.jsx` | `GET/PATCH/DELETE /properties/` | Imóveis mockados | Carregar por usuário, editar, soft delete e atualizar estatísticas |
| `CadastroImovel.jsx` | `POST /properties/`; depois `POST /listings/` | Formulário de seis etapas sem persistência | Transformar tipo, rooms, endereço e features para o modelo Django; definir quando publicar o anúncio |
| `PerfilMeusAnuncios.jsx` | `GET /listings/?owner=me` ou endpoint equivalente do ViewSet | Anúncios mockados | Confirmar filtro de proprietário no backend; implementar publicar, pausar e editar |
| `PerfilMidia.jsx` | `GET /media/`, `POST /media/` multipart, `GET /media/quota/`, `DELETE /media/{id}/` | Mídias e quota mockadas | Usar file input, FormData, limites, progresso e atualização da quota |
| `PerfilSeguranca.jsx` | sessão/logout e endpoints de autenticação | Conteúdo informativo | Integrar encerramento de sessões em `/users/me/sessions/` e logout |
| `PerfilPrivacidade.jsx` | `DELETE /users/me/` | Ação ainda visual | Adicionar confirmação explícita e chamar soft delete da conta |
| Notificações/header | `GET /notifications/`, `PATCH /notifications/{id}/read/`, `POST /notifications/read-all/` | Ícones sem dados reais | Criar hook de notificações e contador de não lidas |
| Favoritos | endpoint de ação do listing e `GET /users/me/favorites/` | Ícones sem persistência | Confirmar contrato da action de favorite no ViewSet e criar toggle autenticado |

## 4. Incompatibilidades de contrato encontradas

### 4.1 Cadastro de usuário

A tela usa `nascimento` e `confirmarSenha`, enquanto o serializer Django espera `data_nascimento` e `confirmar_senha`. A tela também separa os campos de endereço na raiz; o backend espera um objeto `endereco` com `cep`, `logradouro`, `numero`, `bairro`, `cidade`, `estado` e `complemento`. A UI atual não possui `numero`, `cidade` e `estado` completos nessa etapa. Antes da implementação, esses campos devem ser adicionados ou o endereço deve ser criado posteriormente pela tela de perfil.

### 4.2 Cadastro de imóvel

A UI possui dados de aluguel, condomínio, IPTU, garantia, título, descrição, fotos e vídeo, mas os models devem ser conferidos campo a campo antes do primeiro POST. A sequência recomendada é criar o `Property`, criar o `Listing` associado e, por último, enviar as mídias. Não se deve tentar enviar o estado inteiro do formulário diretamente para a API.

### 4.3 Listings públicos

Os cards atuais usam `preco`, `area`, `quartos`, `endereco` e `imagem`, enquanto os serializers do backend retornam dados distribuídos entre `Listing`, `Property`, `PropertyRoom` e `Media`. Será necessário criar um adaptador de view-model no frontend, em vez de alterar o contrato do backend apenas para acomodar os mocks.

### 4.4 Perfil e autenticação

O email é somente leitura no serializer de perfil, mas a tela de edição permite alterá-lo. A integração deve remover ou desabilitar esse campo na edição, ou abrir uma tarefa arquitetural separada para alteração de email com verificação. CPF não deve ser adicionado a nenhuma resposta do frontend.

### 4.5 Serviços externos

Cloudinary, SMTP, Firebase e Sentry não devem bloquear a primeira integração local. A primeira etapa deve funcionar com o backend local e as tasks mockadas/configuradas para desenvolvimento. Upload real e push devem ser testados em uma etapa posterior, com credenciais próprias.

## 5. Ordem de implementação

### Fase I — Fundação do cliente

Criar `VITE_API_URL`, cliente HTTP, normalização de erros, persistência dos tokens e `AuthContext` real. Adicionar `ProtectedRoute` para as rotas `/perfil/*` e `/perfil/cadastro-imovel`. Corrigir o login e validar o fluxo com o backend local.

**Critério:** cadastro/login/logout funcionam após recarregar o navegador; rota protegida redireciona usuário anônimo para `/login`.

### Fase II — Cadastro e recuperação

Integrar o cadastro de usuário com payload adaptado e mensagens de validação por campo. Depois integrar recuperação de senha em quatro passos: solicitar OTP, informar código, redefinir senha e limpar estado sensível.

**Critério:** usuário criado no PostgreSQL, login subsequente funcionando e erros do serializer exibidos na tela.

### Fase III — Catálogo público

Substituir mocks de `Home.jsx` e `ResultadosPesquisa.jsx` por listings reais, começando com busca simples e paginação. Criar adaptadores de resposta e estados de carregamento, vazio e erro. Integrar favoritos apenas depois de o fluxo autenticado estar estável.

**Critério:** cards exibem dados reais do banco, filtro `tipo=CASA` funciona e a paginação não duplica registros.

### Fase IV — Perfil

Integrar `Perfil`, edição de dados, endereços, estatísticas, imóveis próprios e anúncios. Implementar invalidação/recarregamento dos dados após mutações para evitar mocks residuais.

**Critério:** alterações persistem após refresh e apenas recursos do usuário autenticado são exibidos.

### Fase V — Cadastro de imóvel e mídia

Mapear o formulário de seis etapas para `Property` e `Listing`, adicionar validação final e só então implementar upload de fotos/vídeos usando `FormData`. Exibir quota e permitir remoção de mídia.

**Critério:** criar imóvel em rascunho, publicar anúncio e anexar mídia sem enviar dados fora do contrato.

### Fase VI — Notificações e acabamento

Integrar notificações, sessões, segurança, acessibilidade dos erros, loading states e testes de navegação. Remover todos os `Mock`, `alert`, links `#` relevantes e ações sem handler.

**Critério:** nenhuma tela de negócio depende de dados mockados e o build/lint do frontend passa.

## 6. Critérios de aceite da integração local

1. `npm run build` passa no frontend.
2. `docker compose up -d postgres redis django celery celery-beat` deixa a API acessível em `http://localhost:8000`.
3. `GET /health` retorna `{"status":"ok"}`.
4. Login, cadastro e refresh de token funcionam no navegador.
5. Rotas protegidas não podem ser acessadas sem JWT.
6. Home e resultados exibem dados reais do PostgreSQL.
7. Perfil, endereços e imóveis persistem após recarregar a página.
8. Upload usa MIME e quota do backend; não há upload real obrigatório na primeira etapa sem Cloudinary configurado.
9. Erros 400, 401, 403, 404, 413 e 429 têm mensagens compreensíveis.
10. Não existem CPF, tokens ou credenciais expostos em logs ou respostas visuais.

## 7. Decisão para o próximo passo

O próximo incremento recomendado é **Fase I — Fundação do cliente**, limitado aos arquivos `src/lib/`, `src/contexts/AuthContext.jsx`, um componente `ProtectedRoute` e as telas `Login.jsx` e `CadastroUsuario.jsx`. Não é recomendado começar pelo cadastro de imóvel ou upload antes de estabilizar a autenticação e o adaptador de dados.
