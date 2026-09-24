# FRONTEND_TASKS — Plano de Integração Executável
## Frontend React — Aluguel360

> **LEIA ANTES DE QUALQUER AÇÃO:**
> 1. Leia `mds/CONSTITUTION.md` integralmente.
> 2. Consulte `mds/DJANGO_TASKS.md` antes de alterar contratos consumidos pela API.
> 3. Consulte `auditorias_md/arquitetura_djando/documentacao_projeto/plano_integracao_frontend_backend.md` antes de iniciar cada fase.
> 4. Declare a tarefa iniciada, os arquivos envolvidos, as dependências e o critério de conclusão.
> 5. Ao concluir uma tarefa, atualize seu status somente após executar a validação especificada.
> 6. Ao concluir uma fase, execute o checkpoint completo e aguarde autorização explícita antes da próxima fase.
>
> **Escopo:** integrar as telas React existentes em `src/` à API Django local em `backend/aluguel360_mobile_api`, preservando o visual aprovado, removendo dependências de mocks nas telas de negócio e mantendo o backend sem alterações não previstas.
>
> **Regra de precedência:** a Constituição continua sendo a fonte superior para as decisões do backend e para os contratos de segurança. Este documento detalha somente o trabalho do frontend. Em caso de conflito com a Constituição, o trabalho deve parar e a inconsistência deve ser registrada.

**Legenda:** [PENDENTE] | [EM PROGRESSO] | [CONCLUÍDA] | [PARCIAL] | [BLOQUEADA]

---

## FASE 0 — Diagnóstico, Contratos e Ambiente

### Objetivo
Ao final desta fase devem estar documentados:
- a estrutura real do frontend;
- os scripts de instalação, desenvolvimento, build e lint;
- os endpoints Django consumidos pelo frontend;
- o formato de resposta `{ success, data }` e o formato de erros;
- os mocks, placeholders e ações sem handler existentes;
- as variáveis de ambiente públicas necessárias ao Vite.

### Pré-requisitos
- Node.js e npm instalados;
- API Django local disponível para consulta;
- leitura da Constituição e do `DJANGO_TASKS.md` concluída.

### T-0.1.1 — Inventariar telas, componentes e mocks [CONCLUÍDA]
- **Arquivos:** `src/`, `src/pages/`, `src/components/`, `src/contexts/`
- **Ações:** listar telas, rotas, dados fictícios, chamadas HTTP existentes e handlers ausentes.
- **Critério de conclusão:** diagnóstico registrado em `plano_integracao_frontend_backend.md`.

### T-0.1.2 — Mapear contratos da API Django [CONCLUÍDA]
- **Dependência:** T-0.1.1
- **Arquivos de referência:** `backend/aluguel360_mobile_api/config/urls.py`, `apps/*/urls.py`, serializers e views.
- **Ações:** registrar prefixo `/api/v1/`, autenticação Bearer, envelope de resposta, payloads de auth, users, listings, properties e media.
- **Critério de conclusão:** tabela tela → endpoint registrada no plano de integração.

### T-0.1.3 — Definir configuração local do Vite [CONCLUÍDA]
- **Dependência:** T-0.1.2
- **Arquivo:** `.env.example` na raiz do frontend.
- **Ações:** documentar `VITE_API_URL=http://localhost:8000/api/v1` sem inserir segredos.
- **Critério de conclusão:** `npm run build` funciona com a variável ausente usando o fallback local e com a variável definida usando a URL configurada.

### CHECKPOINT — FASE 0

| # | Verificação | Comando/Método | Esperado |
|---|---|---|---|
| 1 | Diagnóstico frontend | documentação em `documentacao_projeto/frontend/fase0_diagnostico_frontend.md` | inventário registrado |
| 2 | Contratos API | documentação em `documentacao_projeto/frontend/fase0_contratos_api.md` | rotas e formato registrados |
| 3 | Variável pública | `.env.example` | `VITE_API_URL` sem segredos |
| 4 | Build sem variável | `npm run build` sem `VITE_API_URL` | aprovado com fallback local |
| 5 | Build com variável | `npm run build` com `VITE_API_URL` | aprovado com URL configurada |
| 6 | Registro de evidências | `documentacao_projeto/frontend/fase0_validacao.md` | evidências persistidas |

> **CHECKPOINT APROVADO EM 24/09/2026.**
> A Fase I deve aguardar autorização explícita antes de começar.

---

## FASE I — Fundação do Cliente HTTP e Autenticação

### Objetivo
Ao final desta fase devem existir:
- cliente HTTP centralizado;
- persistência e limpeza dos tokens JWT;
- renovação automática após HTTP 401;
- contexto de autenticação real;
- login e cadastro conectados à API;
- rota protegida para áreas autenticadas;
- logout funcional;
- nenhum token exibido na interface.

### Pré-requisitos
- Fase 0 concluída;
- endpoints de autenticação da Fase 3 do backend disponíveis;
- backend local iniciado com Docker Desktop.

### T-1.1.1 — Criar cliente HTTP centralizado [CONCLUÍDA]
- **Arquivo:** `src/lib/api.js`
- **Ações:** implementar `fetch` encapsulado, `VITE_API_URL`, headers JSON, `FormData`, envelope `{ success, data }` e mensagens de erro.
- **Decisões obrigatórias:** não definir manualmente `Content-Type` em uploads multipart; não duplicar URLs nas telas.
- **Critério de conclusão:** importação do módulo sem erro e chamadas `get`, `post`, `patch`, `put` e `delete` disponíveis.
- **Validação:** lint específico do arquivo e `npm run build`.

### T-1.1.2 — Implementar persistência e refresh de tokens [CONCLUÍDA]
- **Arquivo:** `src/lib/api.js`
- **Dependência:** T-1.1.1
- **Ações:** persistir access/refresh token em `localStorage`, renovar access token em 401 e limpar sessão quando o refresh falhar.
- **Critério de conclusão:** funções `setTokens`, `clearTokens`, `getAccessToken`, `getRefreshToken` e refresh automático existem e são usadas pelo cliente.
- **Observação de segurança:** não registrar tokens em `console`, mensagens visuais ou payloads de demonstração.

### T-1.1.3 — Implementar `AuthContext` real [CONCLUÍDA]
- **Arquivo:** `src/contexts/AuthContext.jsx`
- **Dependência:** T-1.1.2
- **Ações:** carregar usuário persistido, consultar `/users/me/`, expor `login`, `register`, `logout`, `user`, `isAuthenticated` e `isLoading`.
- **Critério de conclusão:** o contexto não depende de booleano fictício e restaura a sessão após recarregar o navegador.
- **Validação:** lint específico e build aprovados.

### T-1.1.4 — Integrar tela de login [CONCLUÍDA]
- **Arquivo:** `src/pages/Login.jsx`
- **Dependência:** T-1.1.3
- **Ações:** enviar `email` e `senha` para `POST /auth/login/`, mostrar erro da API, mostrar estado de submissão e redirecionar após sucesso.
- **Critério de conclusão:** login não utiliza dados mockados nem apenas estado local.
- **Validação:** teste manual com usuário existente e lint específico.

### T-1.1.5 — Criar `ProtectedRoute` [PENDENTE]
- **Arquivos:** `src/components/ProtectedRoute.jsx`, `src/App.jsx` ou arquivo de rotas equivalente.
- **Dependência:** T-1.1.3
- **Ações:** bloquear `/perfil/*` e `/perfil/cadastro-imovel`, mostrar loading durante restauração e redirecionar anônimos para `/login`.
- **Critério de conclusão:** acesso anônimo às rotas protegidas não renderiza dados privados.

### T-1.1.6 — Integrar logout e limpeza de sessão [PENDENTE]
- **Arquivos:** `src/components/Layout.jsx`, `src/components/SiteHeader.jsx` ou componente efetivamente responsável pelo logout.
- **Dependência:** T-1.1.3
- **Ações:** chamar `POST /auth/logout/`, limpar tokens mesmo quando a chamada falhar e atualizar o contexto.
- **Critério de conclusão:** após logout, refresh token, usuário armazenado e acesso às rotas protegidas são removidos.

### CHECKPOINT — FASE I

| # | Verificação | Comando/Método | Esperado |
|---|---|---|---|
| 1 | Dependências instaladas | `npm install` | sem erro |
| 2 | Cliente HTTP | lint específico | 0 erros nos arquivos da fase |
| 3 | Build | `npm run build` | concluído com sucesso |
| 4 | Cadastro/login | navegador + API local | usuário criado e login retorna JWT |
| 5 | Sessão persistida | recarregar navegador | usuário continua autenticado |
| 6 | Refresh de token | expirar/substituir access token | sessão tenta renovar sem sair abruptamente |
| 7 | Rota protegida | navegador anônimo | redirecionamento para `/login` |
| 8 | Logout | navegador autenticado | tokens removidos e rota privada bloqueada |

> **PARE.** Não avance para a Fase II sem verificar os itens acima e registrar as evidências.

---

## FASE II — Cadastro, CEP e Recuperação de Senha

### Objetivo
Ao final desta fase devem existir:
- cadastro de usuário conectado ao backend;
- campos `numero`, `cidade` e `estado` na interface;
- consulta leve ao ViaCEP no cliente;
- payload de endereço compatível com `AddressWriteSerializer`;
- mensagens de erro por campo;
- fluxo completo de recuperação com OTP.

### T-2.1.1 — Integrar cadastro de usuário [CONCLUÍDA]
- **Arquivo:** `src/pages/CadastroUsuario.jsx`
- **Dependência:** T-1.1.3
- **Ações:** converter `nascimento` para `data_nascimento`, `confirmarSenha` para `confirmar_senha` e agrupar endereço em `endereco`.
- **Critério de conclusão:** submit chama o método `register` e envia somente campos previstos pelo backend.
- **Validação:** lint específico e build aprovados.

### T-2.1.2 — Adicionar consulta de CEP no cliente [CONCLUÍDA]
- **Arquivo:** `src/lib/viacep.js`
- **Dependência:** T-2.1.1
- **Ações:** consultar ViaCEP somente com 8 dígitos, suportar cancelamento da requisição, preencher logradouro, bairro, cidade e estado e tratar CEP inexistente.
- **Critério de conclusão:** consulta não bloqueia a tela e não altera o backend.
- **Validação:** teste manual com CEP válido e inválido.

### T-2.1.3 — Centralizar adaptação do payload de cadastro [CONCLUÍDA]
- **Arquivo:** `src/lib/adapters.js`
- **Dependência:** T-2.1.1
- **Ações:** implementar `toRegisterPayload` com normalização de CEP, UF e campos de endereço.
- **Critério de conclusão:** a tela não monta o payload final espalhando regras de conversão.

### T-2.2.1 — Integrar recuperação de senha [PENDENTE]
- **Arquivo:** `src/pages/RecuperarSenha.jsx`
- **Dependência:** T-1.1.1
- **Ações:** implementar solicitação de OTP, verificação do código e redefinição de senha com limpeza dos dados sensíveis ao concluir.
- **Endpoints:** `/auth/forgot-password/`, `/auth/verify-otp/`, `/auth/reset-password/`.
- **Critério de conclusão:** os quatro estados visuais da tela correspondem a respostas reais da API.

### CHECKPOINT — FASE II

| # | Verificação | Comando/Método | Esperado |
|---|---|---|---|
| 1 | Campos de endereço | navegador / cadastro | número, cidade e estado visíveis |
| 2 | ViaCEP válido | informar CEP válido | endereço preenchido |
| 3 | ViaCEP inválido | informar CEP inexistente | mensagem compreensível |
| 4 | Payload | Network do navegador | `endereco` aninhado e nomes Django |
| 5 | Persistência | banco + novo login | usuário e endereço salvos |
| 6 | Erros de cadastro | CPF/email/senha inválidos | erro visível sem expor CPF hash |
| 7 | Recuperação | fluxo completo | OTP validado e senha redefinida |

---

## FASE III — Catálogo Público e Adaptadores de View-Model

### Objetivo
Ao final desta fase devem existir:
- Home e resultados consumindo listings reais;
- adaptador único entre resposta Django e componentes visuais;
- estados de loading, vazio e erro;
- filtros convertidos em query params;
- paginação cursor sem duplicação;
- dados fictícios isolados como fallback explícito, não como fonte primária.

### T-3.1.1 — Criar adaptadores de dados [CONCLUÍDA]
- **Arquivo:** `src/lib/adapters.js`
- **Dependência:** T-1.1.1
- **Ações:** adaptar listing, usuário, endereço, mídia e lista paginada sem alterar o contrato Django.
- **Critério de conclusão:** componentes recebem view-model estável mesmo quando o backend distribui dados entre Listing, Property, rooms e Media.

### T-3.1.2 — Integrar resultados de pesquisa [CONCLUÍDA]
- **Arquivo:** `src/pages/ResultadosPesquisa.jsx`
- **Dependência:** T-3.1.1
- **Ações:** buscar `/listings/`, tratar resposta paginada, exibir estado de carregamento/erro e usar fallback de demonstração apenas quando não houver dados reais.
- **Critério de conclusão:** tela não depende exclusivamente da lista fixa anterior.
- **Validação:** build e lint específico aprovados.

### T-3.1.3 — Integrar Home [PENDENTE]
- **Arquivo:** `src/pages/Home.jsx`
- **Dependência:** T-3.1.1
- **Ações:** substituir cards mockados por listings reais e preservar estado vazio quando não houver anúncios.
- **Critério de conclusão:** cards da Home refletem o banco local.

### T-3.2.1 — Integrar filtros e busca [PENDENTE]
- **Arquivos:** `src/components/BarraFiltros.*`, `src/components/FiltroLateral.*`, `src/pages/ResultadosPesquisa.jsx`.
- **Dependência:** T-3.1.2
- **Ações:** converter tipo, cidade, estado, preço, quartos, banheiros, garagem e localização para os parâmetros documentados.
- **Critério de conclusão:** filtro `tipo=CASA` e filtros financeiros alteram a requisição sem reload manual.

### T-3.2.2 — Integrar paginação cursor [PENDENTE]
- **Dependência:** T-3.2.1
- **Ações:** usar `next`/`previous` devolvidos pelo backend sem offset e impedir registros duplicados.
- **Critério de conclusão:** navegar entre páginas não duplica cards e preserva os filtros atuais.

### CHECKPOINT — FASE III

| # | Verificação | Comando/Método | Esperado |
|---|---|---|---|
| 1 | Listings reais | navegador + banco | cards exibem dados do PostgreSQL |
| 2 | Estado loading | throttling do navegador | indicador aparece |
| 3 | Estado vazio | API sem registros | mensagem de vazio |
| 4 | Filtro tipo | `?tipo=CASA` | somente tipo solicitado |
| 5 | Paginação cursor | botão/scroll de próxima página | sem duplicação |
| 6 | Fallback | API indisponível | demonstração sinalizada ao usuário |
| 7 | Build/lint | `npm run build` + lint específico | sucesso |

---

## FASE IV — Perfil, Endereços, Imóveis e Anúncios

### Objetivo
Ao final desta fase devem existir:
- perfil carregado de `/users/me/`;
- estatísticas reais;
- email somente leitura;
- CRUD de endereços;
- imóveis e anúncios do usuário autenticado;
- atualização após mutações e refresh da página;
- isolamento visual de recursos privados.

### T-4.1.1 — Integrar perfil e estatísticas [PENDENTE]
- **Arquivos:** `src/pages/Perfil.jsx` e componentes relacionados.
- **Dependência:** Fase I concluída.
- **Endpoints:** `GET /users/me/`, `GET /users/me/stats/`.
- **Critério de conclusão:** dados exibidos são recuperados da API e permanecem após refresh.

### T-4.1.2 — Bloquear edição de email [CONCLUÍDA]
- **Arquivo:** `src/pages/EditProfile.jsx`
- **Dependência:** T-4.1.1
- **Ações:** manter email somente leitura/desabilitado e permitir apenas campos suportados pelo `UserUpdateSerializer`.
- **Critério de conclusão:** nenhum PATCH envia email.

### T-4.2.1 — Integrar CRUD de endereços [PENDENTE]
- **Arquivo:** `src/pages/PerfilEnderecos.jsx`
- **Dependência:** T-2.1.1
- **Endpoints:** `/users/me/addresses/` e `/users/me/addresses/{id}/`.
- **Critério de conclusão:** criar, editar, excluir e definir endereço sem dados mockados.

### T-4.3.1 — Integrar imóveis próprios [PENDENTE]
- **Arquivo:** `src/pages/PerfilMeusImoveis.jsx`
- **Dependência:** T-4.1.1
- **Ações:** listar properties do usuário, atualizar e solicitar soft delete conforme API.
- **Critério de conclusão:** usuário não visualiza recursos de outro proprietário.

### T-4.3.2 — Integrar anúncios próprios [PENDENTE]
- **Arquivo:** `src/pages/PerfilMeusAnuncios.jsx`
- **Dependência:** T-4.3.1
- **Ações:** listar, publicar, pausar e editar listings conforme actions reais do ViewSet.
- **Critério de conclusão:** ações refletem no catálogo após recarregar.

### CHECKPOINT — FASE IV

| # | Verificação | Comando/Método | Esperado |
|---|---|---|---|
| 1 | Perfil | navegador autenticado | dados reais do usuário |
| 2 | Email | tela de edição + Network | campo bloqueado e ausente no PATCH |
| 3 | Estatísticas | endpoint + tela | números coerentes |
| 4 | Endereço | CRUD manual | persistência após refresh |
| 5 | Isolamento | dois usuários | cada um vê apenas seus recursos |
| 6 | Imóvel/anúncio | criar/editar/publicar | status refletido no catálogo |

---

## FASE V — Cadastro de Imóvel e Mídia

### Objetivo
Ao final desta fase devem existir:
- mapeamento explícito das seis etapas para Property e Listing;
- criação de imóvel em rascunho;
- publicação separada do anúncio;
- upload real via `FormData`;
- validação de tamanho e tipo antes do envio;
- quota e remoção de mídia visíveis.

### T-5.1.1 — Mapear formulário para Property [PENDENTE]
- **Arquivo:** `src/pages/CadastroImovel.jsx`, `src/lib/adapters.js` ou módulo de formulário definido antes da implementação.
- **Dependência:** Fase IV concluída.
- **Ações:** mapear endereço, tipo, área, características e cômodos para os campos reais do model.
- **Regra:** não enviar o estado inteiro da tela diretamente para a API.
- **Critério de conclusão:** POST de Property em rascunho aceita somente campos documentados.

### T-5.1.2 — Criar e publicar Listing [PENDENTE]
- **Dependência:** T-5.1.1
- **Ações:** criar Listing associado ao Property e separar ações de salvar rascunho, publicar e pausar.
- **Critério de conclusão:** a publicação não ocorre implicitamente antes da confirmação do usuário.

### T-5.2.1 — Integrar upload seguro de mídia [PENDENTE]
- **Arquivos:** `src/pages/PerfilMidia.jsx`, `src/lib/api.js`, adaptadores.
- **Dependência:** T-5.1.1
- **Ações:** enviar `FormData`, não sobrescrever `Content-Type`, mostrar progresso/erro, respeitar limites do backend e atualizar lista.
- **Critério de conclusão:** JPEG/PNG/WebP permitido conforme backend; arquivo inválido é rejeitado visualmente.

### T-5.2.2 — Integrar quota e remoção [PENDENTE]
- **Dependência:** T-5.2.1
- **Endpoints:** `/media/quota/`, `/media/{id}/`.
- **Critério de conclusão:** quota e mídia são atualizadas após upload ou remoção.

### CHECKPOINT — FASE V

| # | Verificação | Comando/Método | Esperado |
|---|---|---|---|
| 1 | Property rascunho | formulário + Network | payload compatível |
| 2 | Listing | publicar/pausar | status persistente |
| 3 | Multipart | Network | request `multipart/form-data` |
| 4 | MIME/tamanho | arquivos válidos e inválidos | mensagens claras |
| 5 | Quota | tela de mídia | uso atualizado |
| 6 | Remoção | excluir mídia | item removido da API e tela |

---

## FASE VI — Recuperação, Notificações, Favoritos e Qualidade

### Objetivo
Ao final desta fase devem existir:
- recuperação de senha completa;
- notificações reais e contador de não lidas;
- sessões e encerramento remoto;
- favoritos persistidos;
- privacidade/soft delete com confirmação;
- remoção dos mocks de negócio;
- acessibilidade básica e estados de erro consistentes.

### T-6.1.1 — Notificações [PENDENTE]
- **Arquivos:** header, tela/componente de notificações e `src/lib/api.js`.
- **Endpoints:** `/notifications/`, `/notifications/{id}/read/`, `/notifications/read-all/`.
- **Critério de conclusão:** contador e leitura refletem o backend.

### T-6.1.2 — Favoritos [PENDENTE]
- **Dependência:** Fase III e autenticação concluídas.
- **Ações:** toggle autenticado, listagem de favoritos e tratamento de usuário anônimo.
- **Critério de conclusão:** favorito permanece após refresh e aparece em `/users/me/favorites/`.

### T-6.1.3 — Segurança e privacidade da conta [PENDENTE]
- **Arquivos:** `PerfilSeguranca.jsx`, `PerfilPrivacidade.jsx`.
- **Ações:** listar/encerrar sessões e solicitar confirmação explícita antes de soft delete.
- **Critério de conclusão:** ações destrutivas não ocorrem sem confirmação e não executam DELETE físico no frontend.

### T-6.2.1 — Remover dependência funcional dos mocks [PENDENTE]
- **Ações:** localizar `Mock`, `alert`, links `#` e botões sem handler em telas de negócio.
- **Regra:** dados fictícios podem permanecer somente como fallback demonstrativo claramente sinalizado.
- **Critério de conclusão:** nenhuma tela integrada depende de mock para fluxo principal.

### T-6.2.2 — Qualidade final [PENDENTE]
- **Comandos:** `npm run build`; lint restrito ao código do frontend; testes manuais dos fluxos principais.
- **Critério de conclusão:** build aprovado, erros de integração documentados e checklist final preenchido.

### CHECKPOINT — FASE VI / INTEGRAÇÃO FINAL

| # | Verificação | Comando/Método | Esperado |
|---|---|---|---|
| 1 | Login/cadastro | navegador | fluxo real completo |
| 2 | Recuperação | navegador + OTP | senha redefinida |
| 3 | Catálogo | banco local | sem dependência de mock primário |
| 4 | Perfil | refresh | dados persistentes |
| 5 | Imóvel/mídia | upload local | API recebe contrato correto |
| 6 | Notificações | usuário autenticado | contador e leitura funcionais |
| 7 | Favoritos | toggle + refresh | persistência confirmada |
| 8 | Privacidade | confirmação | soft delete solicitado corretamente |
| 9 | Build | `npm run build` | sucesso |
| 10 | Lint | lint do código frontend | sem erros próprios da integração |

---

## CRITÉRIOS GERAIS DE ACEITE

1. O frontend utiliza `VITE_API_URL` e mantém `http://localhost:8000/api/v1` somente como fallback de desenvolvimento.
2. Nenhuma tela monta URLs de API diretamente quando existir serviço no cliente HTTP.
3. Tokens não aparecem em logs, mensagens, componentes ou adaptadores visuais.
4. CPF nunca é exibido nem armazenado pelo frontend além do envio necessário no cadastro.
5. O email permanece somente leitura até existir fluxo arquitetural de verificação de alteração.
6. Upload utiliza `FormData` e respeita as validações reais do backend.
7. Dados fictícios são permitidos somente como fallback demonstrativo identificado, nunca como substituição silenciosa de uma resposta real.
8. Os endpoints devem respeitar o envelope `{ success: true, data: {} }` e o formato de erro documentado pelo backend.
9. As rotas privadas exigem autenticação e não exibem dados de outro usuário.
10. Cada tarefa só pode ser marcada como concluída após código, validação e teste correspondente.

---

## MATRIZ DE DEPENDÊNCIAS

| ID | Título resumido | Predecessora(s) | Fase | Paralelo? | Bloqueio |
|---|---|---|---:|---|---|
| T-0.1.1 | Inventário frontend | — | 0 | Não | Nenhum |
| T-0.1.2 | Contratos API | T-0.1.1 | 0 | Não | Backend disponível |
| T-0.1.3 | `.env.example` frontend | T-0.1.2 | 0 | Sim | Nenhum |
| T-1.1.1 | Cliente HTTP | T-0.1.2 | I | Não | Contrato API |
| T-1.1.2 | Tokens e refresh | T-1.1.1 | I | Não | JWT backend |
| T-1.1.3 | AuthContext | T-1.1.2 | I | Não | Cliente HTTP |
| T-1.1.4 | Login | T-1.1.3 | I | Não | AuthContext |
| T-1.1.5 | ProtectedRoute | T-1.1.3 | I | Sim | Rotas existentes |
| T-1.1.6 | Logout | T-1.1.3 | I | Sim | AuthContext |
| T-2.1.1 | Cadastro | T-1.1.3 | II | Não | Serializer register |
| T-2.1.2 | ViaCEP | T-2.1.1 | II | Sim | Serviço público ViaCEP |
| T-2.1.3 | Adaptador cadastro | T-2.1.1 | II | Sim | Payload Django |
| T-2.2.1 | Recuperação OTP | T--1.1.1 | II | Sim | Endpoints OTP |
| T-3.1.1 | Adaptadores view-model | T-1.1.1 | III | Sim | Serializers listings |
| T-3.1.2 | Resultados | T-3.1.1 | III | Não | Adaptador |
| T-3.1.3 | Home | T-3.1.1 | III | Sim | Listings públicos |
| T-3.2.1 | Filtros | T-3.1.2 | III | Não | Contrato filters |
| T-3.2.2 | Cursor | T-3.2.1 | III | Não | Paginação backend |
| T-4.1.1 | Perfil/stats | T-1.1.5 | IV | Não | JWT |
| T-4.1.2 | Email bloqueado | T-4.1.1 | IV | Sim | Serializer readonly |
| T-4.2.1 | Endereços | T-2.1.1 | IV | Sim | CRUD users |
| T-4.3.1 | Imóveis próprios | T-4.1.1 | IV | Sim | Properties |
| T-4.3.2 | Anúncios próprios | T-4.3.1 | IV | Não | Listings actions |
| T-5.1.1 | Property | T-4.3.1 | V | Não | Mapeamento de model |
| T-5.1.2 | Listing | T-5.1.1 | V | Não | Property criado |
| T-5.2.1 | Upload | T-5.1.1 | V | Sim | MIME/storage |
| T-5.2.2 | Quota | T-5.2.1 | V | Não | Upload |
| T-6.1.1 | Notificações | T-1.1.3 | VI | Sim | API notifications |
| T-6.1.2 | Favoritos | T-3.2.2 | VI | Sim | Auth + listings |
| T-6.1.3 | Segurança/privacidade | T-1.1.6 | VI | Sim | Sessões |
| T-6.2.1 | Remover mocks funcionais | T-3.1.3, T-4.3.2, T-5.2.2 | VI | Não | Todas as telas integradas |
| T-6.2.2 | Qualidade final | T-6.2.1 | VI | Não | Todas as fases |

---

## SITUAÇÃO ATUAL DO PLANO

### Fases

| Fase | Status | Observação |
|---|---|---|
| Fase 0 | Concluída | Diagnóstico, contratos, `.env.example` e builds com e sem variável validados. |
| Fase I | Parcial | Cliente HTTP, tokens, AuthContext e login concluídos; ProtectedRoute e logout visual pendentes. |
| Fase II | Parcial | Cadastro, campos de endereço, ViaCEP e adaptador concluídos; recuperação OTP pendente. |
| Fase III | Parcial | Adaptadores e Resultados concluídos; Home, filtros e paginação cursor pendentes. |
| Fase IV | Parcial | Email bloqueado concluído; perfil, endereços, imóveis e anúncios pendentes. |
| Fase V | Pendente | Cadastro de imóvel e upload ainda não integrados. |
| Fase VI | Pendente | Notificações, favoritos, privacidade e acabamento ainda pendentes. |

### Evidências já registradas

- `npm run build`: aprovado após a integração atual.
- Lint específico dos arquivos alterados: aprovado.
- Arquivos de integração presentes e não vazios.
- Lint geral do projeto permanece bloqueado por problemas preexistentes fora do escopo atual, incluindo arquivos estáticos em `backend/venv`, `src/App copy.jsx`, `vite.config.js` e avisos de componentes antigos.
- A aprovação de uma tarefa neste documento não substitui os testes manuais contra o backend Docker local.

---

## REGISTRO DE EXECUÇÃO — INTEGRAÇÃO FRONTEND

### 24/09/2026 — Primeira implementação

Foram implementados no frontend autorizado:

- `src/lib/api.js`, com cliente HTTP, tokens, refresh, logout e serviços de domínio;
- `src/lib/viacep.js`, com consulta cancelável ao ViaCEP;
- `src/lib/adapters.js`, com adaptação de listings, usuários, mídias e payload de cadastro;
- `src/contexts/AuthContext.jsx`, com sessão real;
- `src/pages/Login.jsx`, com login real e mensagens de erro;
- `src/pages/CadastroUsuario.jsx`, com `numero`, `cidade`, `estado`, consulta de CEP e cadastro real;
- `src/pages/ResultadosPesquisa.jsx`, com consulta de listings e fallback demonstrativo;
- `src/pages/EditProfile.jsx`, com email bloqueado para edição.

Validações executadas:

- `npm run build`: aprovado;
- lint específico dos arquivos alterados: aprovado;
- verificação de existência e tamanho dos arquivos: aprovada;
- `npm run lint` global: não aprovado por arquivos e dependências fora do escopo da integração atual.

### Próximo incremento autorizado

O próximo incremento recomendado é concluir a **Fase I**, implementando `ProtectedRoute` e conectando o logout visual. Em seguida deve ser executada a recuperação de senha da Fase II antes de iniciar as telas de imóveis e upload.

---

*FRONTEND_TASKS v1.0.0 | Aluguel360 | 24/09/2026*
