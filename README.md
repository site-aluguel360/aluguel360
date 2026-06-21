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

* React
* Tailwind CSS
* shadcn/ui

### Back-end

* Node.js
* Express

### Banco de Dados

* PostgreSQL

## Arquitetura

```text
Frontend (React)
        │
        ▼
API REST (Node.js)
        │
        ▼
PostgreSQL
```

## Estrutura do Projeto

```text
aluguel360/
│
├── frontend/
│
├── backend/
│
├── database/
│
└── docs/
```

## Como Executar

### Clonar o projeto

```bash
git clone https://github.com/seu-usuario/aluguel360.git
```

### Instalar dependências

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

### Executar aplicação

Backend:

```bash
npm run dev
```

Frontend:

```bash
npm run dev
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
