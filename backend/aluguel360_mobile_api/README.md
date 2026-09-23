# Aluguel360 Mobile API — Backend Django

Backend REST do aplicativo móvel Aluguel360. A aplicação é responsável por autenticação, usuários, imóveis, anúncios, mídia, notificações, busca e tarefas assíncronas.

Este documento é o guia principal para qualquer desenvolvedor configurar o projeto, executar a API, rodar os testes e entender o fluxo de funcionamento local.

## 1. Visão geral

A API é construída com Django 5.1 e Django REST Framework. O banco principal é PostgreSQL 16 com PostGIS para consultas geográficas. Redis é usado como cache e broker do Celery. Celery executa operações que não devem bloquear uma requisição HTTP, como envio de email, geração de thumbnails, atualização de quota e cálculo de qualidade dos anúncios.

O ambiente local recomendado é o Docker Compose, porque ele fornece PostgreSQL/PostGIS, Redis, Django, Celery e Celery Beat com a mesma configuração para todos os desenvolvedores.

### Serviços locais

| Serviço | Função | Porta |
|---|---|---:|
| `postgres` | PostgreSQL 16 com PostGIS | `5432` |
| `redis` | Cache e broker do Celery | `6379` |
| `django` | API HTTP de desenvolvimento | `8000` |
| `celery` | Worker de tarefas assíncronas | — |
| `celery-beat` | Agendador de tarefas periódicas | — |

## 2. Stack obrigatória

A stack arquitetural definida para o projeto é:

- Python 3.12;
- Django 5.1.x;
- Django REST Framework 3.15.x;
- PostgreSQL 16 com PostGIS;
- Redis 7;
- Celery 5.4;
- SimpleJWT;
- django-filter;
- GeoDjango;
- Cloudinary para mídia;
- Firebase Admin para push notifications;
- drf-spectacular para Swagger/OpenAPI;
- pytest-django para testes.

> **Atenção:** a Constituição do projeto exige Python 3.12 exato. A `backend/venv` existente nesta máquina foi identificada como Python 3.13.2; ela não deve ser usada como referência para novos ambientes homologados. O `Dockerfile` atual também usa uma imagem Python 3.13 e precisa ser alinhado para Python 3.12 antes do deploy/homologação final.

## 3. Pré-requisitos

### Opção recomendada: Docker

Instale:

- Docker Desktop com Docker Compose habilitado;
- Git;
- acesso ao repositório.

Nessa opção, Python, PostgreSQL, PostGIS e Redis não precisam ser instalados diretamente no computador.

### Opção alternativa: execução com venv

Para executar o Django diretamente no computador, instale:

- Python 3.12;
- PostgreSQL 16 com PostGIS;
- Redis 7;
- bibliotecas nativas GDAL e GEOS para GeoDjango;
- dependências Python do projeto.

No Windows, a opção recomendada continua sendo usar Docker para PostgreSQL/PostGIS e Redis, mesmo quando o Django roda dentro da `venv`.

## 4. Estrutura de diretórios

```text
backend/
├── aluguel360_mobile_api/
│   ├── apps/
│   │   ├── authentication/   # JWT, OTP, sessões e dispositivos
│   │   ├── users/            # usuário, endereços e perfil
│   │   ├── properties/       # entidade física do imóvel
│   │   ├── listings/         # anúncios e favoritos
│   │   ├── media/            # upload, quota e thumbnails
│   │   ├── notifications/    # notificações in-app e push
│   │   └── search/           # busca unificada
│   ├── common/               # validators, permissões, paginação e respostas
│   ├── config/               # settings, URLs, WSGI, ASGI e Celery
│   ├── requirements/         # dependências base, dev e produção
│   ├── manage.py
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── .env.example
│   └── README.md
├── venv/                     # ambiente local opcional, fora do app Django
└── ...
```

## 5. Configuração de variáveis de ambiente

Entre na pasta do backend Django:

```bash
cd backend/aluguel360_mobile_api
```

Copie o arquivo de exemplo:

### Linux/macOS/Git Bash

```bash
cp .env.example .env
```

### PowerShell

```powershell
Copy-Item .env.example .env
```

O arquivo `.env` é local e não deve ser commitado. Nunca coloque chaves reais de Cloudinary, Firebase, SMTP ou JWT no repositório.

### Variáveis principais

| Grupo | Variáveis | Finalidade |
|---|---|---|
| Django | `DJANGO_SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS` | Configuração principal do Django |
| Banco | `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` | Conexão PostgreSQL/PostGIS |
| JWT | `JWT_SECRET` | Assinatura dos tokens da API Django |
| Redis | `REDIS_URL` | Cache, broker e resultado do Celery |
| CORS | `CORS_ALLOWED_ORIGINS` | Origens autorizadas no desenvolvimento |
| Cloudinary | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Upload e remoção de mídia |
| Email | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` | Produção; desenvolvimento usa console email |
| Firebase | `FIREBASE_CREDENTIALS_PATH` | Push notifications |
| OTP | `OTP_EXPIRY_MINUTES`, `OTP_MAX_ATTEMPTS` | Expiração e tentativas de OTP |
| Upload | `MAX_PHOTO_MB`, `MAX_VIDEO_MB`, `MAX_PHOTOS_PER_USER`, `MAX_VIDEOS_PER_USER` | Limites de mídia |

No desenvolvimento, `config.settings.development` usa o backend de email do console. Portanto, emails de boas-vindas e OTP aparecem nos logs do container em vez de serem enviados de verdade.

## 6. Executar com Docker Compose — fluxo recomendado

Todos os comandos desta seção devem ser executados em:

```text
backend/aluguel360_mobile_api
```

### 6.1 Construir e iniciar os serviços

```bash
docker compose up -d --build
```

No Windows, use o mesmo comando no PowerShell dentro da pasta do backend.

Verifique o estado:

```bash
docker compose ps
```

Os containers `postgres`, `redis`, `django`, `celery` e `celery-beat` devem aparecer como `Up`.

### 6.2 Aplicar migrações

Na primeira execução e sempre que houver novas migrações:

```bash
docker compose exec django python manage.py migrate
```

O projeto atual já possui as migrações das fases anteriores. Para confirmar se existem alterações de model sem migração:

```bash
docker compose exec django python manage.py makemigrations --check --dry-run
```

O resultado esperado é `No changes detected`.

### 6.3 Criar usuário administrador

```bash
docker compose exec django python manage.py createsuperuser
```

### 6.4 Acessar a API

- API: <http://localhost:8000/>
- Swagger: <http://localhost:8000/api/docs/>
- Schema OpenAPI: <http://localhost:8000/api/schema/>
- Admin: <http://localhost:8000/admin/>

Para testar endpoints protegidos no Swagger:

1. execute `POST /api/v1/auth/register/` ou `POST /api/v1/auth/login/`;
2. copie o `access_token` retornado;
3. clique em **Authorize**;
4. informe `Bearer SEU_ACCESS_TOKEN`;
5. execute os endpoints protegidos.

### 6.5 Ver logs

```bash
docker compose logs -f django
docker compose logs -f celery
docker compose logs -f celery-beat
```

### 6.6 Parar os serviços

Para parar os containers mantendo os dados do PostgreSQL:

```bash
docker compose stop
```

Para remover os containers, mantendo o volume do banco:

```bash
docker compose down
```

Para remover também o volume local do PostgreSQL — **isso apaga os dados locais**:

```bash
docker compose down -v
```

## 7. Executar com a venv local

Esta opção é útil para desenvolvimento rápido, debugging no IDE e execução fora do container. O ambiente deve ser criado com Python 3.12.

### 7.1 Criar a venv

A pasta recomendada para a venv é `backend/venv`, no mesmo nível de `aluguel360_mobile_api`.

#### Windows PowerShell

```powershell
cd backend
py -3.12 -m venv venv
.\venv\Scripts\Activate.ps1
cd aluguel360_mobile_api
python -m pip install --upgrade pip
pip install -r requirements/development.txt
```

#### Linux/macOS

```bash
cd backend
python3.12 -m venv venv
source venv/bin/activate
cd aluguel360_mobile_api
python -m pip install --upgrade pip
pip install -r requirements/development.txt
```

### 7.2 Dependências nativas

A execução direta exige GDAL, GEOS e PROJ instalados no sistema operacional. A forma mais simples de evitar diferenças entre máquinas é executar Django dentro do Docker.

No Ubuntu/Debian, as dependências normalmente necessárias são:

```bash
sudo apt-get update
sudo apt-get install -y gdal-bin libgdal-dev libgeos-dev libproj-dev
```

### 7.3 Banco e Redis com Docker, Django na venv

Suba apenas a infraestrutura:

```bash
cd backend/aluguel360_mobile_api
docker compose up -d postgres redis
```

No `.env` usado pelo Django local, mantenha:

```env
DB_HOST=localhost
DB_PORT=5432
REDIS_URL=redis://localhost:6379/0
```

Depois execute:

```bash
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

Em outro terminal, com a mesma venv ativada, execute o worker quando precisar testar tasks:

```bash
celery -A config worker -l info
```

E, para tarefas agendadas:

```bash
celery -A config beat -l info
```

## 8. Testes e validações

### Django check

```bash
docker compose run --rm django python manage.py check
```

Ou, com a venv ativada:

```bash
python manage.py check
```

### Suíte completa

```bash
docker compose run --rm django pytest -q
```

Ou:

```bash
pytest -q
```

### Testes específicos

```bash
docker compose run --rm django pytest -q apps/authentication/tests/
docker compose run --rm django pytest -q apps/listings/tests/
```

### Qualidade de código

```bash
docker compose run --rm django black --check .
docker compose run --rm django isort --check-only .
docker compose run --rm django flake8 .
```

Antes de abrir um pull request, o mínimo esperado é:

1. `manage.py check` sem erros;
2. nenhuma migração pendente;
3. suíte pytest passando;
4. endpoints alterados verificados no Swagger;
5. nenhuma credencial ou arquivo `.env` commitado.

## 9. Como o backend funciona

### 9.1 Autenticação

O cadastro recebe email, senha, CPF e dados opcionais de endereço. O CPF é validado no serializer, mas nunca é armazenado em texto puro. O serializer repassa o CPF bruto ao `UserManager`; o `UserManager` é o único responsável pelo hash SHA-256.

O login retorna access token com duração curta e refresh token com duração maior. Sessões são registradas por usuário, IP, dispositivo e JTI do refresh token. Logout adiciona o refresh token à blacklist.

A recuperação de senha usa OTP de seis dígitos. O código é armazenado com bcrypt, possui expiração e número máximo de tentativas. O envio do email ocorre por task Celery.

### 9.2 Property e Listing

`Property` representa o imóvel físico e seu cadastro: endereço, área, tipo, características, localização e cômodos.

`Listing` representa o anúncio comercial do imóvel: título, descrição, aluguel, status, métricas, publicação e validade. Um imóvel pode possuir mais de um anúncio ao longo do tempo.

Listagens públicas usam paginação por cursor. Filtros de preço, tipo, cidade, cômodos, características e distância usam django-filter e PostGIS.

### 9.3 Mídia

O upload valida o MIME real dos primeiros 2 KB do arquivo, verifica tamanho, quota e quantidade máxima antes de enviar o arquivo ao Cloudinary. Depois do upload, a mídia é salva no banco e tasks assíncronas geram thumbnail e recalculam a quota.

Tipos aceitos:

- fotos: JPEG, PNG, WebP e HEIC, até 10 MB;
- vídeos: MP4 e MOV, até 100 MB.

### 9.4 Tasks assíncronas

As tasks Celery são usadas para:

- envio de OTP;
- email de boas-vindas;
- limpeza de OTPs expirados;
- cálculo de qualidade dos anúncios;
- expiração de anúncios antigos;
- geração de thumbnails;
- atualização da quota de armazenamento;
- push notifications via Firebase;
- limpeza de sessões inativas.

## 10. Principais endpoints

A base da API é:

```text
http://localhost:8000/api/v1/
```

| Grupo | Endpoints principais |
|---|---|
| Auth | `/auth/register/`, `/auth/login/`, `/auth/token/refresh/`, `/auth/logout/`, `/auth/forgot-password/`, `/auth/verify-otp/`, `/auth/reset-password/` |
| Usuário | `/users/me/`, `/users/me/addresses/`, `/users/me/sessions/`, `/users/me/stats/`, `/users/me/favorites/` |
| Properties | `/properties/` |
| Listings | `/listings/`, `/listings/featured/`, `/listings/nearby/`, `/listings/mine/`, `/{id}/publish/`, `/{id}/pause/`, `/{id}/favorite/` |
| Media | `/media/`, `/media/upload/`, `/media/quota/`, `/{id}/set-highlight/` |
| Notifications | `/notifications/`, `/{id}/read/`, `/read-all/` |
| Busca | `/search/?q=texto` |

As respostas de sucesso seguem o formato:

```json
{
  "success": true,
  "data": {}
}
```

Erros devem seguir o formato padronizado do exception handler do projeto.

## 11. Convenções importantes para desenvolvedores

- Não armazenar CPF bruto em banco, logs, serializers ou respostas.
- Não alterar o `AUTH_USER_MODEL`.
- Usar UUID como chave primária dos models.
- Respeitar soft delete para usuários, properties e listings.
- Não misturar responsabilidades de `Property` e `Listing`.
- Usar `MobileCursorPagination` para feeds públicos.
- Operações lentas devem ser tasks Celery, não chamadas síncronas na request.
- Toda alteração de model deve gerar migração revisada.
- Toda nova rota deve ser registrada e documentada pelo schema OpenAPI.
- Não commitar `.env`, credenciais Firebase, chaves JWT ou credenciais Cloudinary.
- Consultar `mds/CONSTITUTION.md`, `mds/DJANGO_TASKS.md` e a documentação da fase antes de alterar arquitetura.

## 12. Problemas comuns

### Django não conecta no banco

Confirme se o PostgreSQL está ativo:

```bash
docker compose ps postgres
```

Se Django estiver rodando dentro do Docker, use `DB_HOST=postgres`. Se estiver rodando na venv do computador, use `DB_HOST=localhost`.

### Redis connection refused

Confirme o Redis:

```bash
docker compose ps redis
```

Use `redis://redis:6379/0` dentro do Docker e `redis://localhost:6379/0` fora do Docker.

### Porta 8000 ocupada

Descubra o processo que usa a porta ou altere temporariamente o mapeamento no compose, por exemplo:

```yaml
ports:
  - "8001:8000"
```

Nesse caso, acesse `http://localhost:8001/api/docs/`.

### Alteração de model não aparece

Execute:

```bash
docker compose exec django python manage.py makemigrations

docker compose exec django python manage.py migrate
```

Revise a migration gerada antes de commitá-la.

### Celery não executa tasks

Confirme que Redis, worker e Beat estão ativos:

```bash
docker compose ps
docker compose logs -f celery
```

### Upload falha no desenvolvimento

Cloudinary precisa de credenciais válidas. Para testar apenas os demais endpoints, use uma configuração sem upload ou faça mock da integração nos testes. Não coloque credenciais reais no README ou no Git.

## 13. Pull requests

Antes de abrir um pull request:

```bash
docker compose exec django python manage.py check
docker compose exec django python manage.py makemigrations --check --dry-run
docker compose run --rm django pytest -q
```

Descreva no pull request:

- qual endpoint, model ou task foi alterado;
- quais decisões arquiteturais foram seguidas;
- quais testes foram executados;
- se houve mudança de migration ou variável de ambiente;
- se existe alguma integração externa que exige credencial ou teste manual.

## 14. Referências internas

- Constituição do backend: `../../mds/CONSTITUTION.md`
- Plano de tarefas: `../../mds/DJANGO_TASKS.md`
- Arquitetura da Fase 1: `../../auditorias_md/arquitetura_djando/django_fase1_fundacao.md`
- Arquitetura da Fase 2: `../../auditorias_md/arquitetura_djando/django_fase2_models_banco.md`
- Arquitetura da Fase 3: `../../auditorias_md/arquitetura_djando/django_fase3_api_views.md`
- Arquitetura da Fase 4: `../../auditorias_md/arquitetura_djando/django_fase4_seguranca_deploy.md`
- Auditoria da decisão de CPF: `../../auditorias_md/arquitetura_djando/documentacao_projeto/inconsistencia_cpf_serializer.txt`
