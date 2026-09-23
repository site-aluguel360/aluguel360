# DJANGO_TASKS — Plano de Implementacao Executavel
## Backend Django Mobile — Aluguel360

> **LEIA ANTES DE QUALQUER ACAO:**
> 1. Leia `mds/CONSTITUTION.md` integralmente
> 2. Leia o arquivo de fase arquitetural correspondente antes de iniciar
> 3. Declare qual tarefa esta iniciando
> 4. Ao concluir cada tarefa, atualize status para [CONCLUIDA]
> 5. Ao concluir cada FASE, execute o checkpoint e aguarde autorizacao

**Legenda:** [PENDENTE] | [EM PROGRESSO] | [CONCLUIDA] | [BLOQUEADA]

---

## FASE 1 — Fundacao, Ambiente e Configuracao Base

### Objetivo
Ao final desta fase devem existir:
- `backend/aluguel360_mobile_api/` com estrutura completa de apps e config
- Virtualenv Python 3.12 com `requirements/base.txt` instalado
- Docker Compose subindo PostgreSQL com PostGIS e Redis sem erros
- `python manage.py check` com 0 erros
- `python manage.py migrate` sem erros
- Admin em `http://localhost:8000/admin/`
- Swagger em `http://localhost:8000/api/docs/`

### Pre-requisitos
- Python 3.12 instalado; Docker Desktop em execucao

---

### 1.1 Ambiente Python

#### T-1.1.1 — Criar virtualenv Python 3.12 [CONCLUIDA]
- **Objetivo:** Criar ambiente Python isolado em `backend/`
- **Arquivos:** `backend/venv/`
- **Acoes:** `cd backend && python3.12 -m venv venv` (Windows: `py -3.12 -m venv venv`)
- **Decisao arquitetural:** Python 3.12 exato. Nao usar 3.11 ou 3.13.
- **Criterio de conclusao:** `venv/pyvenv.cfg` contem `version = 3.12.x`

#### T-1.1.2 — Criar `requirements/base.txt` [CONCLUIDA]
- **Dependencia:** T-1.1.1
- **Arquivo:** `backend/aluguel360_mobile_api/requirements/base.txt`
- **Acoes:** Criar com conteudo exato da secao "requirements/base.txt" do documento `django_fase4_seguranca_deploy.md`
- **Decisao arquitetural:** Versoes sao fixas. Nao atualizar sem aprovacao.
- **Criterio de conclusao:** Arquivo existe com todos os pacotes listados na Fase 4

#### T-1.1.3 — Criar `requirements/development.txt` [CONCLUIDA]
- **Dependencia:** T-1.1.2
- **Arquivo:** `backend/aluguel360_mobile_api/requirements/development.txt`
- **Acoes:** Criar com `-r base.txt` na linha 1 + pacotes de dev (pytest-django, factory-boy, model-bakery, django-debug-toolbar, black, isort)
- **Criterio de conclusao:** Arquivo existe e inclui `-r base.txt`

#### T-1.1.4 — Instalar dependencias [CONCLUIDA]
- **Dependencias:** T-1.1.1, T-1.1.2
- **Acoes:** Ativar venv + `pip install -r requirements/development.txt`
- **Criterio de conclusao:** `pip list | grep Django` retorna `Django 5.1.x`
- **Validacao:** `pip check` sem conflitos

---

### 1.2 Estrutura do Projeto Django

#### T-1.2.1 — Inicializar projeto Django [CONCLUIDA]
- **Dependencia:** T-1.1.4
- **Acoes:** `cd backend/aluguel360_mobile_api && django-admin startproject config .`
- **DECISAO CRITICA:** O ponto final e obrigatorio. O projeto fica em `aluguel360_mobile_api/`, nao na raiz de `backend/`
- **Criterio de conclusao:** `manage.py` existe em `backend/aluguel360_mobile_api/`

#### T-1.2.2 — Criar `config/settings/` como pacote [CONCLUIDA]
- **Dependencia:** T-1.2.1
- **Arquivos:**
  - REMOVER: `config/settings.py`
  - CRIAR: `config/settings/__init__.py` (vazio)
  - CRIAR: `config/settings/base.py` (conteudo exato de `django_fase1_fundacao.md`)
  - CRIAR: `config/settings/development.py` (conteudo de `django_fase4_seguranca_deploy.md`)
  - CRIAR: `config/settings/production.py` (conteudo de `django_fase4_seguranca_deploy.md`)
- **ALERTA CRITICO:** `AUTH_USER_MODEL = 'users.User'` DEVE estar em `base.py` ANTES da primeira migration. Se omitido, o projeto precisara ser recriado do zero.
- **Criterio de conclusao:** Tres arquivos em `config/settings/`

#### T-1.2.3 — Criar os 7 apps Django [CONCLUIDA]
- **Dependencia:** T-1.2.1
- **Acoes:**
  ```
  mkdir apps && cd apps
  python ../manage.py startapp authentication
  python ../manage.py startapp users
  python ../manage.py startapp properties
  python ../manage.py startapp listings
  python ../manage.py startapp media
  python ../manage.py startapp notifications
  python ../manage.py startapp search
  ```
- **Decisao arquitetural:** Apps ficam em `apps/`. O `apps.py` de cada app deve ter `name = 'apps.<nome>'`
- **Criterio de conclusao:** 7 diretorios com `models.py` em `apps/`

#### T-1.2.4 — Criar diretorio `common/` [CONCLUIDA]
- **Dependencia:** T-1.2.1 (pode executar em paralelo com T-1.2.3)
- **Arquivos a criar:**
  - `common/__init__.py`
  - `common/pagination.py` — conteudo de `django_fase1_fundacao.md`, secao "Paginacao"
  - `common/renderers.py` — conteudo de `django_fase1_fundacao.md`, secao "Renderer"
  - `common/exceptions.py` — conteudo de `django_fase1_fundacao.md`, secao "Exception Handler"
  - `common/permissions.py` — conteudo de `django_fase3_api_views.md`, secao "Permissoes"
  - `common/validators.py` — modulo vazio (implementado na Fase 3)
  - `common/utils.py` — modulo vazio
- **Criterio de conclusao:** `common/pagination.py` contem `class MobileCursorPagination`

---

### 1.3 Variaveis de Ambiente

#### T-1.3.1 — Criar `.env.example` [CONCLUIDA]
- **Dependencia:** T-1.2.2
- **Arquivo:** `backend/aluguel360_mobile_api/.env.example`
- **Acoes:** Criar com conteudo exato da secao "Variaveis de Ambiente" de `django_fase1_fundacao.md`
- **Criterio de conclusao:** Arquivo existe com todas as variaveis listadas

#### T-1.3.2 — Criar `.env` de desenvolvimento [CONCLUIDA]
- **Dependencia:** T-1.3.1
- **Arquivo:** `backend/aluguel360_mobile_api/.env`
- **ALERTA DE SEGURANCA:** Este arquivo NAO deve ser commitado. Verificar `.gitignore`
- **Acoes:** Copiar `.env.example` e preencher: DJANGO_SECRET_KEY (50 chars), DEBUG=True, credenciais PostgreSQL/Redis locais. Placeholders para Cloudinary, Firebase, SMTP sao aceitaveis em dev.
- **Criterio de conclusao:** `python -c "from decouple import config; print(config('DEBUG'))"` retorna `True`

---

### 1.4 Docker

#### T-1.4.1 — Criar `docker-compose.yml` [CONCLUIDA]
- **Dependencia:** Nenhuma (pode executar em paralelo)
- **Arquivo:** `backend/aluguel360_mobile_api/docker-compose.yml`
- **Acoes:** Criar com conteudo exato de `django_fase1_fundacao.md`, secao "Docker Compose"
- **Decisao arquitetural:** Imagem DEVE ser `postgis/postgis:16-3.4`, NAO `postgres:16`
- **Criterio de conclusao:** Arquivo contem servicos postgres, redis, django, celery, celery-beat

#### T-1.4.2 — Subir servicos Docker [CONCLUIDA]
- **Dependencia:** T-1.4.1
- **Acoes:** `docker-compose up -d postgres redis`
- **Criterio de conclusao:**
  - `docker ps` mostra postgres e redis com status Up
  - `psql -h localhost -U postgres -d aluguel360 -c "SELECT PostGIS_Version();"` retorna versao

---

### 1.5 Settings e URLs Raiz

#### T-1.5.1 — Corrigir `apps.py` de cada app [CONCLUIDA]
- **Dependencia:** T-1.2.3
- **Arquivos:** `apps/*/apps.py` (todos os 7)
- **Acoes:** Em cada `apps.py`, alterar o atributo `name` de `'<nome>'` para `'apps.<nome>'`
- **Criterio de conclusao:** Todos os 7 `apps.py` tem `name = 'apps.<nome_do_app>'`

#### T-1.5.2 — Configurar `config/urls.py` [CONCLUIDA]
- **Dependencia:** T-1.2.3
- **Arquivo:** `config/urls.py`
- **Acoes:** Substituir pelo conteudo exato de `django_fase1_fundacao.md`, secao "Roteamento Raiz"
- **Decisao arquitetural:** Prefixo e `api/v1/`. Nao alterar.
- **Criterio de conclusao:** Arquivo tem importacao de `drf_spectacular` e 7 rotas de apps

#### T-1.5.3 — Configurar `config/wsgi.py` e `config/asgi.py` [CONCLUIDA]
- **Dependencia:** T-1.5.2
- **Acoes:** Garantir `DJANGO_SETTINGS_MODULE=config.settings.development` em ambos os arquivos
- **Criterio de conclusao:** Ambos referenciam `config.settings.development`

---

### 1.6 Verificacao e Migracao Inicial

#### T-1.6.1 — Executar verificacao do Django [CONCLUIDA]
- **Dependencias:** T-1.5.3, T-1.3.2, T-1.4.2
- **Acoes:** `python manage.py check`
- **Criterio de conclusao:** "System check identified no issues"
- **ALERTA:** Se erros relacionados a AUTH_USER_MODEL, verificar se `AUTH_USER_MODEL = 'users.User'` esta em `base.py`

#### T-1.6.2 — Executar migracoes iniciais [CONCLUIDA]
- **Dependencia:** T-1.6.1
- **Acoes:** `python manage.py migrate`
- **Criterio de conclusao:** Migrations executam sem erros
- **ALERTA:** Se falhar por PostGIS, executar no banco: `CREATE EXTENSION postgis;`

#### T-1.6.3 — Criar superusuario inicial [CONCLUIDA]
- **Dependencia:** T-1.6.2
- **Acoes:** `python manage.py createsuperuser`
- **Decisao arquitetural:** Campo de login e `email`, nao `username`
- **ALERTA:** Se pedir `username`, AUTH_USER_MODEL nao esta configurado. Revisar T-1.2.2.
- **Criterio de conclusao:** Login em `/admin/` bem-sucedido

#### T-1.6.4 — Verificar Swagger UI [CONCLUIDA]
- **Dependencia:** T-1.6.2
- **Acoes:** `python manage.py runserver`, acessar `http://localhost:8000/api/docs/`
- **Criterio de conclusao:** Pagina Swagger carrega sem erro 500

---

### CHECKPOINT — FASE 1

| # | Verificacao | Comando | Esperado |
|---|------------|---------|---------|
| 1 | Virtualenv Python 3.12 | `python --version` | Python 3.12.x |
| 2 | 7 apps criados | `ls apps/` | 7 diretorios |
| 3 | common/ com modulos | `ls common/*.py` | 6+ arquivos |
| 4 | Docker rodando | `docker ps` | postgres e redis Up |
| 5 | PostGIS habilitado | `SELECT PostGIS_Version();` | retorna versao |
| 6 | manage.py check | `python manage.py check` | 0 issues |
| 7 | Migrations OK | `python manage.py showmigrations` | marcados [X] |
| 8 | Admin acessivel | Browser /admin/ | Tela de login |
| 9 | Swagger acessivel | Browser /api/docs/ | Swagger UI |
| 10 | AUTH_USER_MODEL | `python -c "from django.conf import settings; print(settings.AUTH_USER_MODEL)"` | users.User |

> **PARE.**
> Nao avance para a Fase 2.
> Verifique cada item, revise contra `django_fase1_fundacao.md` e aguarde autorizacao explicita.

---

## FASE 2 — Models e Schema do Banco de Dados

### Objetivo
Ao final devem existir:
- Todos os models implementados nos 7 apps
- Migracoes geradas e aplicadas
- Tabelas verificaveis via dbshell
- Indices SQL extras criados
- Admin exibindo todos os models
- Testes de models passando

### Pre-requisitos
- Fase 1 concluida e checkpoint aprovado
- `AUTH_USER_MODEL = 'users.User'` confirmado

### Ordem obrigatoria (dependencias de FK)
1. `apps.users` (base de todas as FKs)
2. `apps.authentication` (FK para users)
3. `apps.properties` (FK para users)
4. `apps.listings` (FK para properties e users)
5. `apps.media` (FK para properties e listings)
6. `apps.notifications` (FK para users)

---

### 2.1 App `users` — Models

#### T-2.1.1 — Implementar `apps/users/models.py` [PENDENTE]
- **Arquivo:** `apps/users/models.py`
- **Dependencia:** T-1.6.2
- **Acoes:** Substituir conteudo pelo da secao "apps/users/models.py" de `django_fase2_models_banco.md`
- **Decisoes obrigatorias:**
  - `User` estende `AbstractBaseUser, PermissionsMixin`
  - `UserManager.create_user(email, nome, cpf, senha)`
  - `cpf_hash = CharField(max_length=64, unique=True)` — nunca o CPF real
  - `USERNAME_FIELD = 'email'`; `REQUIRED_FIELDS = ['nome', 'cpf_hash']`
  - `User.hash_cpf(cpf_raw)` retorna SHA-256 hex
  - `User.soft_delete()`: seta `deleted_at`, `is_active=False`, libera email
  - `Address.save()`: garante apenas um `is_primary=True` por usuario
- **Criterio de conclusao:** `python manage.py makemigrations users` gera migracao sem erros

#### T-2.1.2 — Registrar models em `apps/users/admin.py` [PENDENTE]
- **Dependencia:** T-2.1.1
- **Acoes:** Implementar `UserAdmin` (extendendo `BaseUserAdmin`) e `AddressAdmin`
- **Criterio de conclusao:** `/admin/users/user/` exibe lista de usuarios

---

### 2.2 App `authentication` — Models

#### T-2.2.1 — Implementar `apps/authentication/models.py` [PENDENTE]
- **Arquivo:** `apps/authentication/models.py`
- **Dependencia:** T-2.1.1
- **Acoes:** Substituir pelo conteudo da secao "apps/authentication/models.py" de `django_fase2_models_banco.md`
- **Decisoes obrigatorias:**
  - `OtpToken.code_hash = CharField(max_length=128)` — hash bcrypt
  - `OtpToken.create_for_user()` invalida OTPs anteriores antes de criar novo
  - `OtpToken.is_valid()` incrementa `attempts` a cada chamada
  - FKs usam `settings.AUTH_USER_MODEL` — NAO importam User diretamente
- **Criterio de conclusao:** `makemigrations authentication` gera migracao sem erros

---

### 2.3 Apps de negocio — Models

#### T-2.3.1 — Implementar `apps/properties/models.py` [PENDENTE]
- **Arquivo:** `apps/properties/models.py`
- **Dependencia:** T-2.1.1
- **Acoes:** Substituir pelo conteudo da secao "apps/properties/models.py" de `django_fase2_models_banco.md`
- **Decisoes obrigatorias:**
  - `Property.location = gis_models.PointField(geography=True, null=True, blank=True)`
  - `Property.features = JSONField(default=dict, blank=True)`
  - `PropertyRoom`: `unique_together = [['property', 'tipo']]`
- **Criterio de conclusao:** `makemigrations properties` gera migracao com PointField

#### T-2.3.2 — Implementar `apps/listings/models.py` [PENDENTE]
- **Arquivo:** `apps/listings/models.py`
- **Dependencia:** T-2.3.1
- **Acoes:** Substituir pelo conteudo da secao "apps/listings/models.py" de `django_fase2_models_banco.md`
- **Decisoes obrigatorias:**
  - `Listing.aluguel = DecimalField(max_digits=10, decimal_places=2)` — nao FloatField
  - `Listing.calculate_quality_score()` retorna float entre 0 e 10
  - `ListingView.user`: `on_delete=models.SET_NULL` (views anonimas permitidas)
  - `Favorite`: `unique_together = [['user', 'listing']]`
- **Criterio de conclusao:** `makemigrations listings` gera migracao sem erros

#### T-2.3.3 — Implementar `apps/media/models.py` [PENDENTE]
- **Arquivo:** `apps/media/models.py`
- **Dependencias:** T-2.3.1, T-2.3.2
- **Acoes:** Substituir pelo conteudo da secao "apps/media/models.py" de `django_fase2_models_banco.md`
- **Decisoes obrigatorias:**
  - `Media.property` e `Media.listing`: `on_delete=models.SET_NULL`
  - `Media.public_id = CharField(max_length=300, unique=True)`
  - `StorageQuota`: `OneToOneField` com `primary_key=True`
  - `StorageQuota.usage_percent` e `available_mb` sao `@property`, nao campos do banco
- **Criterio de conclusao:** `makemigrations media` gera migracao sem erros

#### T-2.3.4 — Implementar `apps/notifications/models.py` [PENDENTE]
- **Arquivo:** `apps/notifications/models.py`
- **Dependencia:** T-2.1.1
- **Acoes:** Criar model `Notification` com: `id (UUIDField PK)`, `user (FK, CASCADE)`, `tipo (CharField, choices)`, `titulo (CharField)`, `mensagem (TextField)`, `data (JSONField, default=dict)`, `lida (BooleanField, default=False)`, `created_at (auto_now_add)`
- **Criterio de conclusao:** `makemigrations notifications` gera migracao sem erros

---

### 2.4 Geracao e Aplicacao de Migracoes

#### T-2.4.1 — Gerar todas as migracoes [PENDENTE]
- **Dependencias:** T-2.1.1, T-2.2.1, T-2.3.1, T-2.3.2, T-2.3.3, T-2.3.4
- **Acoes:** `python manage.py makemigrations users authentication properties listings media notifications`
- **Criterio de conclusao:** 6 arquivos `0001_initial.py` criados, um por app
- **ALERTA:** Se `makemigrations` nao detectar mudancas, o app nao esta em `INSTALLED_APPS` de `base.py`

#### T-2.4.2 — Aplicar todas as migracoes [PENDENTE]
- **Dependencia:** T-2.4.1
- **Acoes:** `python manage.py migrate`
- **Criterio de conclusao:** `python manage.py showmigrations` mostra todas com [X]

#### T-2.4.3 — Aplicar indices SQL extras [PENDENTE]
- **Dependencia:** T-2.4.2
- **Acoes:** Via `python manage.py dbshell`, executar:
  ```sql
  CREATE INDEX idx_listings_fts ON listings USING gin(to_tsvector('portuguese', titulo || ' ' || descricao));
  CREATE INDEX idx_properties_location ON properties USING gist(location);
  CREATE INDEX idx_listings_price_status ON listings(aluguel, status) WHERE status = 'PUBLICADO';
  CREATE INDEX idx_properties_city_type ON properties(cidade, tipo, status);
  ```
- **Criterio de conclusao:** `\di idx_properties_location` no psql mostra o indice criado

---

### 2.5 Testes de Models

#### T-2.5.1 — Testes de `users` models [PENDENTE]
- **Arquivos:** `apps/users/tests/__init__.py`, `apps/users/tests/test_user_model.py`
- **Dependencia:** T-2.4.2
- **Verificacoes obrigatorias:**
  1. `User.hash_cpf('123.456.789-09')` retorna string de 64 chars hex
  2. `User.hash_cpf('123.456.789-09')` == `User.hash_cpf('12345678909')` (normalizacao)
  3. `User.soft_delete()` seta `deleted_at` e `is_active=False`
  4. `User.soft_delete()` altera email para `deleted_{uuid}@deleted.aluguel360`
  5. `Address.save()` com `is_primary=True` desmarca outros primarios do mesmo usuario
- **Criterio de conclusao:** `pytest apps/users/tests/test_user_model.py` retorna 0 falhas

#### T-2.5.2 — Testes de `OtpToken` [PENDENTE]
- **Arquivos:** `apps/authentication/tests/__init__.py`, `apps/authentication/tests/test_otp_model.py`
- **Dependencia:** T-2.5.1
- **Verificacoes obrigatorias:**
  1. `OtpToken.create_for_user(user)` retorna `(otp, code)` onde `code` tem 6 digitos
  2. `code_hash` no banco NAO e igual ao `code` plain
  3. `otp.is_valid(code)` retorna True antes da expiracao
  4. `otp.is_valid(codigo_errado)` retorna False e incrementa `attempts`
  5. OTP expirado retorna False em `is_valid()`
  6. Novo OTP para mesmo usuario invalida o anterior
- **Criterio de conclusao:** `pytest apps/authentication/tests/test_otp_model.py` retorna 0 falhas

---

### CHECKPOINT — FASE 2

| # | Verificacao | Comando/Metodo | Esperado |
|---|------------|----------------|---------|
| 1 | Todas migracoes aplicadas | `python manage.py showmigrations` | Todos [X] |
| 2 | Tabela users com UUID PK | `\d users` (psql) | id uuid primary key |
| 3 | Sem campo username | `\d users` (psql) | Sem coluna username |
| 4 | cpf_hash em users | `\d users` (psql) | cpf_hash varchar(64) unique |
| 5 | PointField em properties | `\d properties` (psql) | location geography |
| 6 | PointField em addresses | `\d addresses` (psql) | location geography |
| 7 | Indice GiST em properties | `\di idx_properties_location` | indice existe |
| 8 | Indice FTS em listings | `\di idx_listings_fts` | indice existe |
| 9 | hash_cpf testes | `pytest apps/users/tests/` | verde |
| 10 | OtpToken testes | `pytest apps/authentication/tests/` | 0 falhas |
| 11 | Admin mostra models | Browser /admin/ | users, addresses visiveis |
| 12 | StorageQuota criada | Criar user, verificar DB | storagequota criada |

> **PARE.**
> Nao avance para a Fase 3.
> Execute os testes, verifique os modelos no banco e aguarde autorizacao explicita.

---

## FASE 3 — API: Serializers, Views, URLs e Celery

### Objetivo
Ao final devem existir:
- Todos os serializers com separacao Read/Write/List
- ViewSets e APIViews com permissoes corretas
- URLs de todos os apps registradas
- Filtros de busca funcionais (django-filter + PostGIS)
- Rate limiting ativo nos endpoints de auth
- Tasks Celery implementadas e disparando
- Testes de integracao para endpoints criticos passando

### Pre-requisitos
- Fase 2 concluida e checkpoint aprovado

---

### 3.1 Validadores Compartilhados

#### T-3.1.1 — Implementar `common/validators.py` [PENDENTE]
- **Arquivo:** `common/validators.py`
- **Dependencia:** T-2.4.2
- **Acoes:** Criar funcoes:
  - `validate_cpf(cpf: str) -> str` — valida formato e digitos verificadores, retorna CPF limpo ou lanca ValidationError
  - `validate_cep(cep: str) -> str` — valida 8 digitos
  - `validate_telefone(tel: str) -> str` — valida formato brasileiro
- **Criterio de conclusao:** `from common.validators import validate_cpf; validate_cpf('123.456.789-09')` sem excecao

---

### 3.2 App `authentication` — Serializers, Tasks e Views

#### T-3.2.1 — Implementar `apps/authentication/serializers.py` [PENDENTE]
- **Arquivo:** `apps/authentication/serializers.py`
- **Dependencia:** T-3.1.1
- **Acoes:** Criar com conteudo exato da secao "apps/authentication/serializers.py" de `django_fase3_api_views.md`:
  - `AddressWriteSerializer`
  - `RegisterSerializer` — valida CPF (algoritmo completo), email unico, senhas iguais, chama `User.hash_cpf()`
  - `LoginSerializer` — usa `authenticate()` do Django
  - `ForgotPasswordSerializer`, `VerifyOtpSerializer`, `ResetPasswordSerializer`
- **Decisoes obrigatorias:**
  - `RegisterSerializer.validate_cpf()` implementa os dois digitos verificadores (nao so formato)
  - CPF nao aparece no `validated_data` final — apenas `cpf_hash`
  - `RegisterSerializer.create()` cria User e Address em operacao unica
- **Criterio de conclusao:** `from apps.authentication.serializers import RegisterSerializer` sem ImportError

#### T-3.2.2 — Implementar `apps/authentication/tasks.py` [PENDENTE]
- **Arquivo:** `apps/authentication/tasks.py`
- **Dependencia:** T-3.2.1
- **Acoes:** Criar `@shared_task`:
  - `send_otp_email(email, nome, otp_code)` — `max_retries=3`, retry em 30s
  - `send_welcome_email(user_id)`
  - `cleanup_expired_otps()` — para Celery Beat
- **Criterio de conclusao:** `celery -A config inspect registered` lista as tasks

#### T-3.2.3 — Implementar `apps/authentication/views.py` [PENDENTE]
- **Arquivo:** `apps/authentication/views.py`
- **Dependencias:** T-3.2.1, T-3.2.2
- **Acoes:** Criar com conteudo da secao "apps/authentication/views.py" de `django_fase4_seguranca_deploy.md`:
  - `RegisterView` — `@ratelimit(rate='5/m')`, cria User, gera JWT, cria Session, dispara `send_welcome_email.delay()`
  - `LoginView` — `@ratelimit(rate='10/m')`, autentica, JWT, atualiza Session
  - `ForgotPasswordView` — `@ratelimit(rate='3/h')`, `OtpToken.create_for_user()`, `send_otp_email.delay()`
  - `VerifyOtpView` — `@ratelimit(rate='10/h')`, verifica OTP sem marcar como usado
  - `ResetPasswordView` — verifica OTP, atualiza senha, `otp.mark_used()`, invalida sessions
  - `LogoutView` — blacklist do refresh token via simplejwt
  - `RegisterDeviceView` — cria/atualiza `DeviceToken`
- **DECISAO CRITICA:** `ForgotPasswordView` SEMPRE retorna 200 independente de o email existir
- **Criterio de conclusao:** Todos os 7 views importam sem erro

#### T-3.2.4 — Configurar `apps/authentication/urls.py` [PENDENTE]
- **Arquivo:** `apps/authentication/urls.py`
- **Dependencia:** T-3.2.3
- **Acoes:** Criar com conteudo exato da secao "apps/authentication/urls.py" de `django_fase3_api_views.md`
- **Criterio de conclusao:** `python manage.py show_urls | grep api/v1/auth` lista 8+ URLs

---

### 3.3 App `users` — Serializers e Views

#### T-3.3.1 — Implementar `apps/users/serializers.py` [PENDENTE]
- **Arquivo:** `apps/users/serializers.py`
- **Dependencia:** T-3.2.1
- **Acoes:** Criar com conteudo da secao "apps/users/serializers.py" de `django_fase3_api_views.md`:
  - `AddressSerializer` (Read)
  - `SessionSerializer` (Read-only)
  - `UserPublicSerializer` — apenas `id, nome, avatar_url, created_at`
  - `UserMeSerializer` — completo com `addresses` aninhados
  - `UserUpdateSerializer` — apenas `nome, telefone, data_nascimento`
  - `UserStatsSerializer` — para cards da tela Perfil
- **DECISAO:** `cpf_hash` NAO aparece em NENHUM serializer

#### T-3.3.2 — Implementar `apps/users/views.py` e `urls.py` [PENDENTE]
- **Arquivos:** `apps/users/views.py`, `apps/users/urls.py`
- **Dependencia:** T-3.3.1
- **Endpoints a implementar:**
  - `GET/PATCH/DELETE /users/me/`
  - `GET/POST /users/me/addresses/`; `PATCH/DELETE /users/me/addresses/{id}/`
  - `GET /users/me/sessions/`; `DELETE /users/me/sessions/{id}/`
  - `GET /users/me/stats/` — agrega contagens de properties, listings, media
  - `GET /users/me/favorites/` — lista Favorites do usuario
- **Criterio de conclusao:** `GET /api/v1/users/me/` com JWT valido retorna dados do usuario

---

### 3.4 Apps `properties` e `listings`

#### T-3.4.1 — Implementar `apps/listings/filters.py` [PENDENTE]
- **Arquivo:** `apps/listings/filters.py`
- **Dependencia:** T-2.3.2
- **Acoes:** Criar `ListingFilter` com conteudo exato da secao "apps/listings/filters.py" de `django_fase3_api_views.md`, incluindo:
  - Filtros: tipo, cidade, estado, bairro
  - Filtros financeiros: preco_min, preco_max
  - Filtros de comodos: quartos_min, banheiros_min, garagem_min
  - Filtros de features JSON: pets, mobiliado, portaria
  - Filtro geoespacial: lat, lng, raio_km (PostGIS Distance)
- **Criterio de conclusao:** `GET /api/v1/listings/?tipo=CASA` filtra corretamente

#### T-3.4.2 — Implementar serializers, views e URLs de listings e properties [PENDENTE]
- **Arquivos:**
  - `apps/listings/serializers.py`, `apps/listings/views.py`, `apps/listings/urls.py`
  - `apps/properties/serializers.py`, `apps/properties/views.py`, `apps/properties/urls.py`
- **Dependencias:** T-3.4.1, T-3.3.1
- **Acoes — Serializers (de `django_fase3_api_views.md`):**
  - `ListingListSerializer` — payload enxuto para feeds (sem dados pessoais do dono)
  - `ListingDetailSerializer` — completo com rooms, features, owner (UserPublicSerializer)
  - `ListingWriteSerializer` — valida que `property` pertence ao usuario autenticado
- **Acoes — ViewSet (`ListingViewSet`):**
  - `get_serializer_class()`: list -> ListingListSerializer, retrieve -> Detail, create/update -> Write
  - `get_queryset()`: publica filtra por `status=PUBLICADO`; action `mine` filtra por `owner=request.user`
  - `retrieve()` override: incrementa `views_count` via `F()`, cria `ListingView`
  - `perform_create()`: salva `owner=request.user`, dispara `calculate_quality_score_task.delay()`
  - Actions: `featured` (6 itens, AllowAny), `mine` (IsAuthenticated), `publish`, `pause`, `favorite`
- **Criterio de conclusao:**
  - `GET /api/v1/listings/` retorna lista paginada
  - `GET /api/v1/listings/featured/` retorna exatamente 6 itens
  - `POST /api/v1/listings/{id}/favorite/` alterna favorito

#### T-3.4.3 — Implementar `apps/listings/tasks.py` [PENDENTE]
- **Arquivo:** `apps/listings/tasks.py`
- **Dependencia:** T-3.4.2
- **Acoes:** Criar com conteudo de `django_fase3_api_views.md`, secao "apps/listings/tasks.py":
  - `calculate_quality_score_task(listing_id)` — `@shared_task(bind=True, max_retries=3)`, calcula e salva `quality_score`
  - `expire_old_listings()` — bulk update status para EXPIRADO
  - `recalculate_all_quality_scores()` — recalcula todos os listings ativos
- **Criterio de conclusao:** `calculate_quality_score_task.delay(str(listing.id))` executa no worker sem erro

---

### 3.5 App `media` — Upload Seguro

#### T-3.5.1 — Implementar `apps/media/views.py` [PENDENTE]
- **Arquivo:** `apps/media/views.py`
- **Dependencias:** T-2.3.3, T-3.3.1
- **Acoes:** Implementar com conteudo exato da secao "apps/media/views.py" de `django_fase4_seguranca_deploy.md`
- **Fluxo obrigatorio de upload (nesta ordem):**
  1. Validar MIME real via `python-magic` (primeiros 2KB do arquivo)
  2. Verificar tamanho: fotos max 10MB, videos max 100MB
  3. Verificar quota via `StorageQuota`
  4. Verificar limites de quantidade (MAX_PHOTOS_PER_USER, MAX_VIDEOS_PER_USER)
  5. Upload para Cloudinary com folder `aluguel360/users/{user_id}/`
  6. Criar `Media` no banco
  7. Disparar `generate_thumbnail.delay()` e `update_storage_quota.delay()`
- **Actions obrigatorias:** `set_highlight`, `quota`
- **`perform_destroy`:** deletar do Cloudinary ANTES de deletar do banco
- **Criterio de conclusao:** `POST /api/v1/media/upload/` com JPEG retorna URL Cloudinary; com .exe retorna 415

#### T-3.5.2 — Implementar `apps/media/tasks.py` [PENDENTE]
- **Arquivo:** `apps/media/tasks.py`
- **Dependencia:** T-3.5.1
- **Acoes:** Criar com conteudo de `django_fase3_api_views.md`, secao "apps/media/tasks.py":
  - `generate_thumbnail(media_id)` — gera URLs WebP via Cloudinary transformations
  - `update_storage_quota(user_id)` — recalcula contagens e MB usados na `StorageQuota`

---

### 3.6 App `notifications`

#### T-3.6.1 — Implementar views e tasks de notificacoes [PENDENTE]
- **Arquivos:** `apps/notifications/views.py`, `apps/notifications/tasks.py`, `apps/notifications/urls.py`
- **Dependencia:** T-2.3.4
- **Endpoints a implementar:**
  - `GET /notifications/` — lista paginada, ordenada por `created_at` desc
  - `PATCH /notifications/{id}/read/` — seta `lida=True`
  - `POST /notifications/read-all/` — marca todas do usuario como lidas
- **Task:** `send_push_notification(user_id, titulo, mensagem, data)` — usa Firebase FCM para todos os `DeviceToken` ativos do usuario; desativa tokens invalidos automaticamente

---

### 3.7 Configuracao do Celery

#### T-3.7.1 — Criar `config/celery.py` com Beat schedule [PENDENTE]
- **Arquivo:** `config/celery.py`
- **Dependencias:** T-3.4.3, T-3.5.2
- **Acoes:** Criar com conteudo exato da secao "config/celery.py" de `django_fase4_seguranca_deploy.md`:
  - Inicializacao do app Celery
  - `beat_schedule` com 4 tarefas periodicas:
    - `expire-old-listings` — diariamente as 00:00
    - `recalculate-quality-scores` — a cada hora
    - `cleanup-expired-otps` — a cada hora (xx:30)
    - `cleanup-inactive-sessions` — domingo as 2h
- **Criterio de conclusao:** `celery -A config beat --loglevel=info` inicia sem erros

---

### 3.8 Testes de Integracao

#### T-3.8.1 — Testes de autenticacao [PENDENTE]
- **Arquivos:** `apps/authentication/tests/test_register.py`, `test_login.py`, `test_otp.py`
- **Dependencia:** T-3.2.4
- **Verificacoes obrigatorias:**
  - `POST /auth/register/` com dados validos -> 201 com access_token e refresh_token
  - `POST /auth/register/` com email duplicado -> 400
  - `POST /auth/register/` com CPF invalido -> 400
  - `POST /auth/register/` com senhas diferentes -> 400
  - `POST /auth/login/` com credenciais corretas -> 200 com tokens
  - `POST /auth/login/` com senha errada -> 400
  - `POST /auth/forgot-password/` com email inexistente -> 200 (nao revela ausencia)
  - `POST /auth/verify-otp/` com OTP correto -> 200
  - `POST /auth/verify-otp/` com OTP expirado -> 400
- **Criterio de conclusao:** `pytest apps/authentication/tests/` retorna 0 falhas

#### T-3.8.2 — Testes de listagem publica [PENDENTE]
- **Arquivo:** `apps/listings/tests/test_listings_api.py`
- **Dependencia:** T-3.4.2
- **Verificacoes obrigatorias:**
  - `GET /listings/` sem autenticacao -> 200 com lista paginada
  - `GET /listings/?tipo=CASA` -> filtra apenas CASAs
  - `GET /listings/?preco_max=1500` -> filtra por preco
  - `GET /listings/featured/` -> maximo 6 itens
  - `POST /listings/{id}/favorite/` sem auth -> 401
  - `POST /listings/{id}/favorite/` com auth valida -> 200, alterna favorito
- **Criterio de conclusao:** `pytest apps/listings/tests/` retorna 0 falhas

---

### CHECKPOINT — FASE 3

| # | Verificacao | Metodo | Esperado |
|---|------------|--------|---------|
| 1 | `POST /auth/register/` | pytest | 201 com tokens |
| 2 | `POST /auth/login/` | pytest | 200 com tokens |
| 3 | `GET /users/me/` com JWT | pytest | 200 com dados |
| 4 | `GET /listings/` sem auth | pytest | 200 paginado |
| 5 | Filtro `?tipo=CASA` | pytest | Apenas CASAs |
| 6 | `GET /listings/featured/` | pytest | Exatamente 6 itens |
| 7 | Upload JPEG | Postman manual | URL Cloudinary retornada |
| 8 | Upload .exe | Postman manual | 415 Unsupported Media Type |
| 9 | OTP via email | Celery worker logs | Task `send_otp_email` executada |
| 10 | Thumbnail gerado | DB apos upload | `thumbnail_url` preenchida |
| 11 | Rate limit login | 11 requests rapidos | 429 na 11a request |
| 12 | Swagger completo | Browser /api/docs/ | 30+ endpoints listados |

> **PARE.**
> Nao avance para a Fase 4.
> Execute todos os testes, verifique upload e rate limiting manualmente, e aguarde autorizacao.

---

## FASE 4 — Seguranca, Producao e Deploy

### Objetivo
Ao final devem existir:
- `config/settings/production.py` funcional
- HTTPS ativo com SSL
- Nginx como reverse proxy
- Gunicorn como servico systemd
- Celery workers como servicos systemd
- Firebase inicializado para push
- Health check endpoint funcionando

### Pre-requisitos
- Fase 3 concluida e checkpoint aprovado
- Servidor de producao configurado (Ubuntu 22.04 recomendado)
- Certificado SSL disponivel

---

### 4.1 Settings de Producao

#### T-4.1.1 — Finalizar `config/settings/production.py` [PENDENTE]
- **Arquivo:** `config/settings/production.py`
- **Dependencia:** T-1.2.2
- **Acoes:** Garantir conteudo exato de `django_fase4_seguranca_deploy.md`, secao "production.py":
  - `DEBUG = False`
  - `SECURE_SSL_REDIRECT = True`
  - `SECURE_HSTS_SECONDS = 31536000`; `SECURE_HSTS_INCLUDE_SUBDOMAINS = True`; `SECURE_HSTS_PRELOAD = True`
  - `SESSION_COOKIE_SECURE = True`; `CSRF_COOKIE_SECURE = True`
  - `X_FRAME_OPTIONS = 'DENY'`; `SECURE_CONTENT_TYPE_NOSNIFF = True`
  - Configuracao Sentry via `sentry_sdk.init()`
  - `DATABASES['default']['OPTIONS']['sslmode'] = 'require'`
- **Criterio de conclusao:** `python manage.py check --deploy --settings=config.settings.production` retorna 0 erros criticos

#### T-4.1.2 — Adicionar health check endpoint [PENDENTE]
- **Arquivo:** `config/urls.py`
- **Dependencia:** T-1.5.2 (pode executar em paralelo com T-4.1.1)
- **Acoes:** Adicionar em `urlpatterns`:
  ```python
  from django.http import JsonResponse
  path('health', lambda r: JsonResponse({'status': 'ok'})),
  ```
- **Criterio de conclusao:** `GET /health` retorna `{"status": "ok"}`

---

### 4.2 Nginx e Gunicorn

#### T-4.2.1 — Criar configuracao do Nginx [PENDENTE]
- **Arquivo:** `/etc/nginx/sites-available/aluguel360-django`
- **Dependencia:** T-4.1.1
- **Acoes:** Criar com conteudo exato de `django_fase4_seguranca_deploy.md`, secao "Nginx"
- **Decisoes obrigatorias:**
  - `client_max_body_size 110M` — para suportar upload de videos ate 100MB
  - Rate limiting de auth no Nginx: 10 req/min
  - Admin restrito por IP da equipe
  - Redirect HTTP -> HTTPS
- **Criterio de conclusao:** `nginx -t` passa sem erros de sintaxe

#### T-4.2.2 — Criar servico systemd para Gunicorn [PENDENTE]
- **Arquivo:** `/etc/systemd/system/aluguel360-django.service`
- **Dependencia:** T-4.2.1
- **Acoes:** Criar unit file systemd com gunicorn apontando para `config.wsgi:application`, 4 workers, timeout 120s
- **Criterio de conclusao:** `systemctl status aluguel360-django` mostra Active: active (running)

---

### 4.3 Firebase

#### T-4.3.1 — Configurar Firebase Admin SDK [PENDENTE]
- **Dependencia:** T-3.6.1
- **Acoes:**
  1. Obter `firebase_credentials.json` do Firebase Console (Service Account)
  2. Colocar em `backend/aluguel360_mobile_api/firebase_credentials.json`
  3. Garantir que `.gitignore` ignora este arquivo
  4. Verificar que `FIREBASE_CREDENTIALS_PATH` no `.env` aponta para o arquivo
  5. Verificar que `apps/notifications/tasks.py` inicializa o SDK corretamente
- **Criterio de conclusao:** Push notification entregue em dispositivo fisico de teste

---

### CHECKPOINT — FASE 4

| # | Verificacao | Metodo | Esperado |
|---|------------|--------|---------|
| 1 | `manage.py check --deploy` | Terminal | 0 criticos |
| 2 | Nginx rodando | `systemctl status nginx` | Active |
| 3 | Gunicorn rodando | `systemctl status aluguel360-django` | Active |
| 4 | HTTPS funcionando | `curl -I https://.../health` | 200 OK |
| 5 | HSTS presente | Headers da response | Strict-Transport-Security |
| 6 | Admin restrito por IP | Acesso sem IP autorizado | 403 |
| 7 | Celery worker ativo | `systemctl status celery` | Active |
| 8 | Push notification | Teste em device fisico | Notificacao recebida |
| 9 | Sentry recebendo | Gerar erro intencional | Aparece no dashboard |
| 10 | Upload video 100MB | Postman manual | Completo sem timeout |

> **PARE.**
> Nao declare o backend como pronto para producao sem todos os 10 itens aprovados.
> Realize testes de carga minimos e aguarde autorizacao explicita.

---

## MATRIZ DE DEPENDENCIAS COMPLETA

| ID | Titulo Resumido | Predecessora(s) | Fase | Paralelo? | Bloqueio |
|----|----------------|-----------------|------|-----------|---------|
| T-1.1.1 | Virtualenv | — | 1 | Nao | Nenhum |
| T-1.1.2 | requirements/base.txt | T-1.1.1 | 1 | Nao | Nenhum |
| T-1.1.3 | requirements/development.txt | T-1.1.2 | 1 | Nao | Nenhum |
| T-1.1.4 | Instalar dependencias | T-1.1.1, T-1.1.2 | 1 | Nao | PyPI |
| T-1.2.1 | Init projeto Django | T-1.1.4 | 1 | Nao | Nenhum |
| T-1.2.2 | config/settings/ | T-1.2.1 | 1 | Nao | CRITICO: antes de migrate |
| T-1.2.3 | Criar 7 apps | T-1.2.1 | 1 | Sim (c/ T-1.2.4) | Nenhum |
| T-1.2.4 | Criar common/ | T-1.2.1 | 1 | Sim (c/ T-1.2.3) | Nenhum |
| T-1.3.1 | .env.example | T-1.2.2 | 1 | Nao | Nenhum |
| T-1.3.2 | .env | T-1.3.1 | 1 | Nao | Credenciais externas |
| T-1.4.1 | docker-compose.yml | — | 1 | Sim | Nenhum |
| T-1.4.2 | Subir Docker | T-1.4.1 | 1 | Nao | Docker Hub |
| T-1.5.1 | Corrigir apps.py | T-1.2.3 | 1 | Nao | Nenhum |
| T-1.5.2 | config/urls.py | T-1.2.3 | 1 | Nao | Nenhum |
| T-1.5.3 | wsgi.py e asgi.py | T-1.5.2 | 1 | Nao | Nenhum |
| T-1.6.1 | manage.py check | T-1.5.3, T-1.3.2, T-1.4.2 | 1 | Nao | Todos acima |
| T-1.6.2 | Migrate inicial | T-1.6.1 | 1 | Nao | T-1.6.1 OK |
| T-1.6.3 | Criar superusuario | T-1.6.2 | 1 | Nao | T-1.6.2 OK |
| T-1.6.4 | Verificar Swagger | T-1.6.2 | 1 | Nao | T-1.6.2 OK |
| T-2.1.1 | users/models.py | T-1.6.2 | 2 | Nao | CRITICO: primeiro model |
| T-2.1.2 | users/admin.py | T-2.1.1 | 2 | Nao | Nenhum |
| T-2.2.1 | authentication/models.py | T-2.1.1 | 2 | Sim (c/ T-2.1.2) | T-2.1.1 |
| T-2.3.1 | properties/models.py | T-2.1.1 | 2 | Sim (c/ T-2.2.1) | T-2.1.1 |
| T-2.3.2 | listings/models.py | T-2.3.1 | 2 | Nao | T-2.3.1 |
| T-2.3.3 | media/models.py | T-2.3.1, T-2.3.2 | 2 | Nao | T-2.3.2 |
| T-2.3.4 | notifications/models.py | T-2.1.1 | 2 | Sim (c/ T-2.3.1) | T-2.1.1 |
| T-2.4.1 | makemigrations | T-2.1.1~T-2.3.4 | 2 | Nao | Todos models OK |
| T-2.4.2 | migrate | T-2.4.1 | 2 | Nao | T-2.4.1 |
| T-2.4.3 | Indices SQL extras | T-2.4.2 | 2 | Nao | PostGIS ativo |
| T-2.5.1 | Testes users models | T-2.4.2 | 2 | Sim | T-2.4.2 |
| T-2.5.2 | Testes OtpToken | T-2.5.1 | 2 | Nao | T-2.5.1 |
| T-3.1.1 | common/validators.py | T-2.4.2 | 3 | Nao | Nenhum |
| T-3.2.1 | auth/serializers.py | T-3.1.1 | 3 | Nao | T-3.1.1 |
| T-3.2.2 | auth/tasks.py | T-3.2.1 | 3 | Nao | Redis e SMTP |
| T-3.2.3 | auth/views.py | T-3.2.1, T-3.2.2 | 3 | Nao | T-3.2.2 |
| T-3.2.4 | auth/urls.py | T-3.2.3 | 3 | Nao | T-3.2.3 |
| T-3.3.1 | users/serializers.py | T-3.2.1 | 3 | Sim (c/ T-3.2.2) | T-3.2.1 |
| T-3.3.2 | users/views.py e urls.py | T-3.3.1 | 3 | Nao | T-3.3.1 |
| T-3.4.1 | listings/filters.py | T-2.3.2 | 3 | Sim | T-2.3.2 |
| T-3.4.2 | listings serializers/views/urls | T-3.4.1, T-3.3.1 | 3 | Nao | T-3.4.1 |
| T-3.4.3 | listings/tasks.py | T-3.4.2 | 3 | Nao | Celery ativo |
| T-3.5.1 | media/views.py | T-2.3.3, T-3.3.1 | 3 | Nao | Cloudinary |
| T-3.5.2 | media/tasks.py | T-3.5.1 | 3 | Nao | T-3.5.1 |
| T-3.6.1 | notifications views+tasks | T-2.3.4 | 3 | Sim | Firebase |
| T-3.7.1 | config/celery.py Beat | T-3.4.3, T-3.5.2 | 3 | Nao | T-3.4.3 |
| T-3.8.1 | Testes auth integracao | T-3.2.4 | 3 | Sim | T-3.2.4 |
| T-3.8.2 | Testes listings integracao | T-3.4.2 | 3 | Sim | T-3.4.2 |
| T-4.1.1 | settings/production.py | T-1.2.2 | 4 | Nao | Servidor prod |
| T-4.1.2 | Health check endpoint | T-1.5.2 | 4 | Sim (c/ T-4.1.1) | Nenhum |
| T-4.2.1 | Nginx config | T-4.1.1 | 4 | Nao | Servidor + SSL |
| T-4.2.2 | Gunicorn systemd | T-4.2.1 | 4 | Nao | T-4.2.1 |
| T-4.3.1 | Firebase SDK init | T-3.6.1 | 4 | Nao | firebase_credentials.json |

---

*DJANGO_TASKS v1.0.0 | Aluguel360 Mobile Backend | 23/09/2026*
