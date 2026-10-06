# Aluguel 360

Sistema web para gerenciamento de locações imobiliárias, desenvolvido como projeto acadêmico com foco na centralização de informações sobre imóveis, contratos, locatários e pagamentos.

## Sobre o Projeto

O Aluguel 360 foi idealizado para auxiliar administradoras imobiliárias e proprietários na gestão do ciclo completo de locação de imóveis.

A proposta é reunir em uma única plataforma funcionalidades que normalmente são controladas por meio de planilhas, documentos e sistemas separados.

## Funcionalidades

### Implementadas

* Cadastro de imóveis
* Cadastro de locatários
* Cadastro de contratos
* Consulta de contratos
* Controle básico de pagamentos
* Dashboard com informações gerais
* **Tela de Perfil do Usuário** com sidebar de navegação
  - Gerenciamento de endereços
  - Configurações de segurança
  - Preferências de privacidade
  - Avaliação de qualidade de anúncios
  - Gerenciamento de fotos e mídias
  - Listagem de imóveis cadastrados
  - Gerenciamento de anúncios (Ver [PERFIL_USUARIO.md](PERFIL_USUARIO.md) para detalhes)

### Futuras melhorias

* Assinatura eletrônica de contratos
* Integração com serviços de pagamento
* Notificações automáticas
* Aplicativo mobile
* Relatórios avançados

## Tecnologias Utilizadas

### Front-end

* React 18 + Vite
* Tailwind CSS
* shadcn/ui

### Back-end

* Django 5 (Python 3.12)
* Django REST Framework (DRF)
* Celery + Redis (Processamento Assíncrono)
* Swagger/OpenAPI (drf-spectacular)

### Banco de Dados

* PostgreSQL (com extensão PostGIS para geolocalização)
* Redis (Cache e Broker)

## Arquitetura

```text
Frontend (React/Vite)
        │
        ▼
API REST (Django/DRF)
        │
        ▼
PostgreSQL + Redis
```

## Estrutura do Projeto

```text
aluguel360/
│
├── backend/aluguel360_mobile_api/   # API Django, Celery e Docker Compose
├── public/                          # Assets estáticos do Frontend
├── src/                             # Código fonte do Frontend (React)
├── mds/                             # Documentação, Requisitos e Tarefas
└── package.json                     # Dependências do Frontend
```

## Como Executar (Configuração em um PC Novo)

### Pré-requisitos
* **Node.js** (v18+)
* **Python** (3.12+)
* **Docker Desktop** instalado e em execução

### 1. Clonar o projeto

```bash
git clone https://github.com/site-aluguel360/aluguel360.git
cd aluguel360
```

### 2. Configurar e Executar o Backend (Django + Docker)

O backend é totalmente containerizado utilizando Docker Compose, facilitando o processo.

```bash
cd backend/aluguel360_mobile_api

# Crie o arquivo de variáveis de ambiente a partir do exemplo
cp .env.example .env
# (Edite o .env se necessário, as configurações padrão funcionam localmente)

# Suba os containers (Postgres, Redis, Django, Celery, Celery Beat)
docker compose up -d --build

# Execute as migrações do banco de dados
docker compose exec django python manage.py migrate

# Crie um superusuário para acessar o painel Admin
docker compose exec django python manage.py createsuperuser
```

O Backend estará disponível em:
* API e Swagger: [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)
* Admin Django: [http://localhost:8000/admin/](http://localhost:8000/admin/)

### 3. Configurar e Executar o Frontend (React/Vite)

Volte para a raiz do projeto (onde o `package.json` está localizado):

```bash
cd ../../
# ou abra um novo terminal na pasta raiz 'aluguel360'

# Instale as dependências
npm install

# Execute a aplicação
npm run dev
```

### Popular Banco de Dados de Teste (Seeds)

O projeto possui um conjunto de dados fakes (proprietários, anúncios e imagens) prontos para uso em desenvolvimento. Para limpar o banco atual e carregar esses dados iniciais, utilize os scripts de seed:

**Rodando com Docker:**
```bash
# 1. Limpa o banco atual (preserva a conta admin@admin.com)
docker exec aluguel360_mobile_api-django-1 python manage.py reset_demo_database

# 2. Carrega proprietários, imóveis, anúncios e fotos
docker exec aluguel360_mobile_api-django-1 python manage.py seed_imoveis
```

**Rodando localmente (Venv):**
```bash
cd backend/aluguel360_mobile_api
python manage.py reset_demo_database
python manage.py seed_imoveis
```

## Fluxo Principal

```text
Cadastro de Imóvel
        ↓
Cadastro de Locatário
        ↓
Criação de Contrato
        ↓
Controle de Pagamentos
        ↓
Acompanhamento da Locação
```

## Objetivos Acadêmicos

Este projeto foi desenvolvido para aplicação prática dos conceitos de:

* Engenharia de Software
* Desenvolvimento Web Full Stack
* Banco de Dados
* Arquitetura em Camadas
* Metodologias Ágeis
* Integração Front-end e Back-end

## Equipe

* Nome dos integrantes
* Curso
* Instituição

## Licença

Projeto desenvolvido para fins acadêmicos.

---

Pelo contexto do Aluguel 360 que você apresentou anteriormente, eu ainda adicionaria no topo do README uma imagem do sistema e um GIF demonstrando o fluxo principal. Em GitHub isso costuma valorizar bastante a apresentação do projeto e passa uma impressão melhor do que longas descrições.
