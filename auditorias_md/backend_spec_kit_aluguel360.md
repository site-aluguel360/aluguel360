# 🤖 SPEC KIT — Backend Aluguel360
## Guia de Implementação para Agentes de IA

> **INSTRUÇÕES PARA IAs:** Este documento é o seu contexto completo para implementar o backend do Aluguel360.
> Leia-o integralmente ANTES de escrever qualquer linha de código.
> Siga a ordem de implementação descrita na Seção 8.
> Não tome decisões arquiteturais que contradizem este documento.

---

## SEÇÃO 1: IDENTIDADE DO PROJETO

**Nome:** Aluguel360  
**Tipo:** Plataforma de Marketplace de Aluguel de Imóveis  
**Contexto:** Projeto acadêmico com potencial para produção. Conecta proprietários de imóveis com inquilinos.  
**Frontend existente:** React 19 + Vite + TailwindCSS v4, em `src/` do monorepo  
**Status do Frontend:** 16 páginas implementadas, 100% mockadas, SEM backend real

### Fluxos de Negócio Mapeados pelo Frontend

1. **Usuário não autenticado** pode: ver Home, ver Resultados de Busca, ver Sobre
2. **Usuário autenticado** pode: ver/editar Perfil, cadastrar Imóvel (6 etapas), ver Meus Imóveis, ver Meus Anúncios, gerenciar Mídia
3. **Qualquer usuário** pode: recuperar senha via OTP por e-mail

---

## SEÇÃO 2: STACK TECNOLÓGICA OBRIGATÓRIA

> **REGRA ABSOLUTA PARA IAs:** Use EXATAMENTE esta stack. Não substitua por alternativas, mesmo que pareçam equivalentes.

### Backend

| Camada | Tecnologia | Versão | Razão |
|--------|-----------|--------|-------|
| Runtime | Node.js | 20 LTS | Suporte a ES Modules nativos |
| Framework HTTP | Express.js | ^4.21 | Padrão de mercado, documentado |
| ORM | Prisma | ^5.x | Type-safe, migrações, Studio |
| Banco de Dados | PostgreSQL | 16 | Suporte a JSON, UUID, Full-Text Search |
| Autenticação | JWT (jsonwebtoken) | ^9.x | Stateless, escalável |
| Hash de Senha | bcrypt | ^5.x | Padrão de segurança |
| Upload de Arquivos | Multer + Cloudinary | latest | Mídia em nuvem |
| Validação | Zod | ^3.x | Type-safe, compatível com Prisma |
| Email | Nodemailer + SMTP | ^6.x | OTP de recuperação de senha |
| CORS | cors | ^2.x | Configuração de origem |
| Rate Limiting | express-rate-limit | ^7.x | Proteção contra brute force |
| Variáveis de Ambiente | dotenv | ^16.x | Configuração segura |
| Logs | Winston | ^3.x | Logs estruturados |
| Testes | Jest + Supertest | latest | Testes de integração |

### Estrutura de Diretórios do Backend

```
backend/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   └── migrations/            # Histórico de migrações
├── src/
│   ├── config/
│   │   ├── database.js        # Instância do PrismaClient
│   │   ├── cloudinary.js      # Configuração do Cloudinary
│   │   └── email.js           # Configuração do Nodemailer
│   ├── middleware/
│   │   ├── auth.middleware.js  # Verificação de JWT
│   │   ├── validate.middleware.js # Validação com Zod
│   │   └── upload.middleware.js   # Multer config
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.controller.js
│   │   │   └── auth.service.js
│   │   ├── users/
│   │   │   ├── users.routes.js
│   │   │   ├── users.controller.js
│   │   │   └── users.service.js
│   │   ├── properties/
│   │   │   ├── properties.routes.js
│   │   │   ├── properties.controller.js
│   │   │   └── properties.service.js
│   │   ├── listings/
│   │   │   ├── listings.routes.js
│   │   │   ├── listings.controller.js
│   │   │   └── listings.service.js
│   │   └── media/
│   │       ├── media.routes.js
│   │       ├── media.controller.js
│   │       └── media.service.js
│   ├── utils/
│   │   ├── jwt.utils.js       # Gerar/verificar tokens
│   │   ├── otp.utils.js       # Gerar OTP de 6 dígitos
│   │   └── response.utils.js  # Padronizar respostas JSON
│   └── app.js                 # Express app (sem listen)
├── server.js                  # Entry point (apenas listen)
├── .env.example               # Template de variáveis
└── package.json
```

---

## SEÇÃO 3: SCHEMA DO BANCO DE DADOS

> **INSTRUÇÃO PARA IAs:** Este schema Prisma é a fonte de verdade. Implemente-o EXATAMENTE assim no `prisma/schema.prisma`.

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────
// USUÁRIOS
// ─────────────────────────────────────

model User {
  id            String    @id @default(uuid())
  nome          String
  email         String    @unique
  emailVerified Boolean   @default(false)
  telefone      String?
  cpf           String    @unique
  dataNascimento DateTime?
  senhaHash     String
  avatarUrl     String?
  role          UserRole  @default(INQUILINO)
  
  // Auditoria
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime? // Soft delete (LGPD)

  // Relações
  addresses     Address[]
  properties    Property[]
  listings      Listing[]
  media         Media[]
  favorites     Favorite[]
  otpTokens     OtpToken[]
  sessions      Session[]

  @@map("users")
}

enum UserRole {
  INQUILINO
  PROPRIETARIO
  ADMIN
}

// ─────────────────────────────────────
// ENDEREÇOS
// ─────────────────────────────────────

model Address {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  cep         String
  logradouro  String
  numero      String
  bairro      String
  cidade      String
  estado      String   // UF - 2 chars
  complemento String?
  isPrimary   Boolean  @default(false)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("addresses")
}

// ─────────────────────────────────────
// IMÓVEIS (entidade cadastral)
// ─────────────────────────────────────

model Property {
  id              String       @id @default(uuid())
  ownerId         String
  owner           User         @relation(fields: [ownerId], references: [id])
  
  tipo            PropertyType
  area            Float        // m²
  
  // Localização
  cep             String
  logradouro      String
  numero          String
  bairro          String
  cidade          String
  estado          String
  complemento     String?
  referencia      String?
  latitude        Float?
  longitude       Float?
  
  // Cômodos (JSON flexível)
  rooms           Json         // { quartos: 2, banheiros: 1, salas: 1, ... }
  
  // Características (JSON flexível)
  features        Json         // { pets: true, mobiliado: false, ... }
  
  // Status
  status          PropertyStatus @default(RASCUNHO)
  
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
  deletedAt       DateTime?

  // Relações
  listings        Listing[]
  media           Media[]

  @@map("properties")
}

enum PropertyType {
  CASA
  APARTAMENTO
  KITNET
  COMODO
  OUTRO
}

enum PropertyStatus {
  RASCUNHO
  ATIVO
  INATIVO
  ALUGADO
}

// ─────────────────────────────────────
// ANÚNCIOS (entidade de publicação)
// ─────────────────────────────────────

model Listing {
  id              String        @id @default(uuid())
  propertyId      String
  property        Property      @relation(fields: [propertyId], references: [id])
  ownerId         String
  owner           User          @relation(fields: [ownerId], references: [id])
  
  titulo          String
  descricao       String        @db.Text
  extraInfo       String?       @db.Text
  
  // Valores
  aluguel         Decimal       @db.Decimal(10, 2)
  negociavel      Boolean       @default(false)
  condominioValor Decimal?      @db.Decimal(10, 2)
  condominioIncluido Boolean    @default(false)
  iptuValor       Decimal?      @db.Decimal(10, 2)
  iptuIncluido    Boolean       @default(false)
  outrasTabas     String?
  
  // Garantia
  garantia        GarantiaType  @default(SEM_GARANTIA)
  
  // Publicação
  status          ListingStatus @default(RASCUNHO)
  views           Int           @default(0)
  
  // Qualidade (score calculado)
  qualityScore    Float?
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  publishedAt     DateTime?
  expiresAt       DateTime?

  // Relações
  favorites       Favorite[]

  @@map("listings")
}

enum GarantiaType {
  CAUCAO
  FIADOR
  SEM_GARANTIA
  SEGURO_FIANCADO
}

enum ListingStatus {
  RASCUNHO
  PUBLICADO
  PAUSADO
  EXPIRADO
  ALUGADO
}

// ─────────────────────────────────────
// MÍDIA
// ─────────────────────────────────────

model Media {
  id          String    @id @default(uuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  propertyId  String?
  property    Property? @relation(fields: [propertyId], references: [id])
  
  tipo        MediaType
  url         String     // URL Cloudinary
  publicId    String     // ID Cloudinary (para deletar)
  nome        String?
  tamanhoMb   Float
  isHighlight Boolean    @default(false)
  
  createdAt   DateTime  @default(now())

  @@map("media")
}

enum MediaType {
  FOTO
  VIDEO
}

// ─────────────────────────────────────
// FAVORITOS
// ─────────────────────────────────────

model Favorite {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  listingId String
  listing   Listing  @relation(fields: [listingId], references: [id])
  createdAt DateTime @default(now())

  @@unique([userId, listingId])
  @@map("favorites")
}

// ─────────────────────────────────────
// OTP (Recuperação de Senha)
// ─────────────────────────────────────

model OtpToken {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  code      String   // 6 dígitos (hash bcrypt)
  expiresAt DateTime // NOW() + 10 minutos
  usedAt    DateTime?
  createdAt DateTime @default(now())

  @@map("otp_tokens")
}

// ─────────────────────────────────────
// SESSÕES (Auditoria de Dispositivos)
// ─────────────────────────────────────

model Session {
  id         String   @id @default(uuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  deviceInfo String?  // User-Agent
  ipAddress  String?
  isActive   Boolean  @default(true)
  createdAt  DateTime @default(now())
  lastSeenAt DateTime @default(now())

  @@map("sessions")
}
```

---

## SEÇÃO 4: TODOS OS ENDPOINTS DA API

**Base URL:** `http://localhost:3001/api/v1`  
**Formato de resposta padrão:**
```json
{ "success": true, "data": {}, "message": "string" }
{ "success": false, "error": "string", "details": [] }
```

### 4.1 — Auth (`/auth`)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/auth/register` | ❌ | Cadastrar novo usuário |
| POST | `/auth/login` | ❌ | Login com email+senha |
| POST | `/auth/logout` | ✅ | Invalidar sessão |
| POST | `/auth/refresh` | ❌ | Renovar access token |
| POST | `/auth/forgot-password` | ❌ | Enviar OTP por email |
| POST | `/auth/verify-otp` | ❌ | Verificar código OTP |
| POST | `/auth/reset-password` | ❌ | Redefinir senha com OTP |

**POST `/auth/register` — Body:**
```json
{
  "nome": "string (required)",
  "email": "string email (required)",
  "cpf": "string 11 chars (required)",
  "senha": "string min:8 (required)",
  "confirmarSenha": "string (required, deve == senha)",
  "telefone": "string opcional",
  "dataNascimento": "ISO8601 date opcional",
  "endereco": {
    "cep": "string 8 chars (required)",
    "logradouro": "string (required)",
    "numero": "string (required)",
    "bairro": "string (required)",
    "cidade": "string (required)",
    "estado": "string 2 chars UF (required)",
    "complemento": "string opcional"
  }
}
```

**POST `/auth/login` — Body:**
```json
{ "email": "string", "senha": "string" }
```

**POST `/auth/login` — Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "JWT (expira em 15m)",
    "refreshToken": "JWT (expira em 7d)",
    "user": { "id": "uuid", "nome": "string", "email": "string", "role": "string" }
  }
}
```

### 4.2 — Users (`/users`)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/users/me` | ✅ | Dados do usuário autenticado |
| PUT | `/users/me` | ✅ | Atualizar dados pessoais |
| DELETE | `/users/me` | ✅ | Soft delete da conta (LGPD) |
| GET | `/users/me/addresses` | ✅ | Listar endereços |
| POST | `/users/me/addresses` | ✅ | Adicionar endereço |
| PUT | `/users/me/addresses/:id` | ✅ | Editar endereço |
| DELETE | `/users/me/addresses/:id` | ✅ | Remover endereço |
| GET | `/users/me/sessions` | ✅ | Listar dispositivos |
| DELETE | `/users/me/sessions/:id` | ✅ | Desconectar dispositivo |
| GET | `/users/me/stats` | ✅ | Estatísticas do usuário |

### 4.3 — Properties (`/properties`)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/properties/mine` | ✅ | Listar imóveis do dono |
| POST | `/properties` | ✅ | Cadastrar novo imóvel |
| GET | `/properties/:id` | ✅ | Detalhe do imóvel |
| PUT | `/properties/:id` | ✅ | Editar imóvel |
| DELETE | `/properties/:id` | ✅ | Soft delete do imóvel |

### 4.4 — Listings (`/listings`)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/listings` | ❌ | Busca pública de anúncios |
| GET | `/listings/featured` | ❌ | Anúncios em destaque (Home) |
| GET | `/listings/:id` | ❌ | Detalhe do anúncio |
| POST | `/listings` | ✅ | Criar anúncio para um imóvel |
| PUT | `/listings/:id` | ✅ | Editar anúncio |
| DELETE | `/listings/:id` | ✅ | Remover anúncio |
| PATCH | `/listings/:id/publish` | ✅ | Publicar anúncio |
| PATCH | `/listings/:id/pause` | ✅ | Pausar anúncio |
| GET | `/listings/mine` | ✅ | Meus anúncios |
| POST | `/listings/:id/favorite` | ✅ | Favoritar/desfavoritar |
| GET | `/listings/me/favorites` | ✅ | Meus favoritos |

**GET `/listings` — Query Params:**
```
?tipo=CASA|APARTAMENTO|KITNET|COMODO
&cidade=string
&bairro=string
&precoMin=number
&precoMax=number
&quartos=number
&pets=boolean
&mobiliado=boolean
&page=number (default: 1)
&limit=number (default: 20)
&orderBy=preco_asc|preco_desc|views|recente
```

### 4.5 — Media (`/media`)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/media/upload` | ✅ | Upload de foto ou vídeo |
| GET | `/media/mine` | ✅ | Listar mídias do usuário |
| DELETE | `/media/:id` | ✅ | Deletar mídia (Cloudinary + DB) |

**POST `/media/upload` — multipart/form-data:**
```
file: File (max 10MB para foto, 100MB para vídeo)
propertyId: string uuid (opcional)
tipo: "FOTO" | "VIDEO"
nome: string (opcional)
isHighlight: boolean (opcional)
```

---

## SEÇÃO 5: MIDDLEWARE DE AUTENTICAÇÃO

> **INSTRUÇÃO PARA IAs:** Implemente este fluxo EXATAMENTE assim.

### 5.1 — Fluxo de JWT

```
1. Login → gera accessToken (15min) + refreshToken (7d)
2. accessToken → armazenado no cliente (memory ou localStorage)
3. refreshToken → armazenado em HttpOnly Cookie
4. Toda requisição autenticada → Header: Authorization: Bearer <accessToken>
5. Se accessToken expirar → POST /auth/refresh com refreshToken do cookie
6. Middleware auth.middleware.js verifica o Bearer token em cada rota protegida
```

### 5.2 — Código do Middleware

```javascript
// src/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Token não fornecido' });
  }

  const token = authHeader.substring(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub, deletedAt: null }
    });
    if (!user) return res.status(401).json({ success: false, error: 'Usuário não encontrado' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Token inválido ou expirado' });
  }
}
```

---

## SEÇÃO 6: VARIÁVEIS DE AMBIENTE OBRIGATÓRIAS

```env
# .env.example

# Banco de Dados
DATABASE_URL="postgresql://user:password@localhost:5432/aluguel360"

# JWT
JWT_SECRET="min-32-chars-random-string"
JWT_REFRESH_SECRET="outro-min-32-chars-random-string"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Servidor
PORT=3001
NODE_ENV="development" # ou production

# CORS
FRONTEND_URL="http://localhost:5173"

# Email (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="seu@email.com"
SMTP_PASS="app-password"
EMAIL_FROM="noreply@aluguel360.com.br"

# Cloudinary (Upload de Mídia)
CLOUDINARY_CLOUD_NAME="seu-cloud-name"
CLOUDINARY_API_KEY="sua-api-key"
CLOUDINARY_API_SECRET="seu-api-secret"
```

---

## SEÇÃO 7: CONFIGURAÇÃO DO SERVIDOR EXPRESS

```javascript
// src/app.js
import express from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { authRouter } from './modules/auth/auth.routes.js';
import { usersRouter } from './modules/users/users.routes.js';
import { propertiesRouter } from './modules/properties/properties.routes.js';
import { listingsRouter } from './modules/listings/listings.routes.js';
import { mediaRouter } from './modules/media/media.routes.js';

const app = express();

// ── Segurança
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// ── Rate Limiting Global
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 200 }));

// ── Rate Limiting Agressivo para Auth
const authLimiter = rateLimit({ windowMs: 60 * 1000, limit: 10 });
app.use('/api/v1/auth', authLimiter);

// ── Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Rotas
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/properties', propertiesRouter);
app.use('/api/v1/listings', listingsRouter);
app.use('/api/v1/media', mediaRouter);

// ── Health Check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ── Error Handler Global
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ success: false, error: err.message || 'Erro interno' });
});

export { app };
```

---

## SEÇÃO 8: ORDEM DE IMPLEMENTAÇÃO (Para IAs seguirem)

> **INSTRUÇÃO:** Implemente nesta ordem exata. Não pule etapas. Verifique cada etapa antes de avançar.

### Etapa 1 — Fundação (Dia 1)
```
1. mkdir backend && cd backend
2. npm init -y
3. Instalar todas as dependências da Seção 2
4. Criar estrutura de diretórios da Seção 2
5. Configurar .env baseado no .env.example da Seção 6
6. Criar prisma/schema.prisma completo da Seção 3
7. npx prisma migrate dev --name init
8. Criar src/config/database.js (PrismaClient singleton)
9. Criar src/app.js (Seção 7) e server.js
10. Verificar: GET /health retorna { status: "ok" }
```

### Etapa 2 — Autenticação (Dia 1-2)
```
1. Criar src/utils/jwt.utils.js (generateAccessToken, generateRefreshToken, verifyToken)
2. Criar src/utils/response.utils.js (success, error helper functions)
3. Criar src/middleware/auth.middleware.js (Seção 5.2)
4. Implementar auth.service.js:
   - register(data) → hash senha com bcrypt, criar User + Address no Prisma, retornar tokens
   - login(email, senha) → buscar user, comparar bcrypt, criar Session, retornar tokens
   - refreshToken(token) → verificar refresh JWT, gerar novo access token
   - forgotPassword(email) → gerar OTP 6 dígitos, hash com bcrypt, salvar em OtpToken, enviar email
   - verifyOtp(email, code) → buscar OtpToken não expirado, comparar bcrypt, marcar usedAt
   - resetPassword(email, code, novaSenha) → verificar OTP, atualizar senhaHash
5. Criar auth.controller.js (chama service, formata resposta)
6. Criar auth.routes.js (mapeia endpoints da Seção 4.1)
7. Registrar router no app.js
8. Verificar com Postman/REST Client:
   - POST /auth/register → 201 Created
   - POST /auth/login → 200 com tokens
   - POST /auth/login com dados errados → 401
   - POST /auth/forgot-password → email enviado
   - POST /auth/verify-otp → OTP válido e inválido
   - POST /auth/reset-password → senha alterada
```

### Etapa 3 — Perfil do Usuário (Dia 2-3)
```
1. Implementar users.service.js:
   - getMe(userId) → User com addresses
   - updateMe(userId, data) → atualizar nome, email, telefone, dataNascimento
   - deleteMe(userId) → soft delete (deletedAt = now())
   - getAddresses(userId) → listar Address[]
   - createAddress(userId, data) → criar Address
   - updateAddress(userId, addressId, data)
   - deleteAddress(userId, addressId)
   - getSessions(userId) → listar Session[]
   - deleteSession(userId, sessionId) → isActive = false
   - getStats(userId) → count de properties, listings, media
2. Criar controller, routes
3. Todas as rotas usam middleware authenticate
4. Verificar: GET /users/me retorna dados do usuário autenticado
```

### Etapa 4 — Imóveis e Anúncios (Dia 3-4)
```
1. Implementar properties.service.js:
   - getMine(ownerId) → Property[] com listings count
   - create(ownerId, data) → criar Property
   - findById(id, ownerId) → verificar propriedade
   - update(id, ownerId, data)
   - softDelete(id, ownerId)
2. Implementar listings.service.js:
   - search(filters, pagination) → Listing[] público com Property incluído
   - getFeatured() → top 6 por views (para Home.jsx)
   - findById(id) → incrementa views, retorna detalhes
   - create(ownerId, propertyId, data)
   - update(id, ownerId, data)
   - delete(id, ownerId)
   - publish(id, ownerId) → status = PUBLICADO, publishedAt = now()
   - pause(id, ownerId) → status = PAUSADO
   - getMine(ownerId) → Listing[] com property e stats
   - toggleFavorite(userId, listingId) → criar ou deletar Favorite
   - getFavorites(userId)
3. Criar controllers e routes
4. Verificar: GET /listings?cidade=Floriano retorna imóveis filtrados
```

### Etapa 5 — Upload de Mídia (Dia 4-5)
```
1. Criar src/config/cloudinary.js
2. Criar src/middleware/upload.middleware.js:
   - multer com memoryStorage
   - filtro: aceita image/jpeg, image/png, image/webp, video/mp4
   - limite: 10MB para fotos, 100MB para vídeos
3. Implementar media.service.js:
   - upload(userId, file, propertyId, tipo, nome) → 
       upload para Cloudinary, salvar Media no DB
   - getMine(userId) → Media[] com stats de armazenamento
   - delete(userId, mediaId) → deletar do Cloudinary, depois do DB
4. Verificar: POST /media/upload com imagem retorna URL Cloudinary
```

### Etapa 6 — Integração com Frontend (Dia 5-6)
```
1. Instalar axios no frontend: npm install axios
2. Criar src/lib/api.js no frontend:
   - instância axios com baseURL = http://localhost:3001/api/v1
   - interceptor de request: injetar Bearer token
   - interceptor de response: se 401 → chamar /auth/refresh ou redirecionar para /login
3. Atualizar AuthContext.jsx:
   - login() → chamar POST /auth/login, salvar tokens, buscar /users/me
   - logout() → chamar POST /auth/logout, limpar tokens
   - user → objeto com dados reais do backend
4. Criar PrivateRoute.jsx → verificar isAuthenticated, redirect /login
5. Atualizar App.jsx → envolver rotas de perfil com PrivateRoute
6. Integrar Login.jsx → chamar api.login(email, senha)
7. Integrar CadastroUsuario.jsx → chamar api.register(data)
8. Integrar EditProfile.jsx → chamar api.updateMe(data)
9. Integrar CadastroImovel.jsx → POST /properties depois POST /listings
10. Integrar ResultadosPesquisa.jsx → GET /listings com query params dos filtros
11. Integrar RecuperarSenha.jsx → /auth/forgot-password → /auth/verify-otp → /auth/reset-password
12. Integrar Home.jsx → GET /listings/featured
13. Integrar PerfilMeusImoveis.jsx → GET /properties/mine
14. Integrar PerfilMeusAnuncios.jsx → GET /listings/mine
15. Integrar PerfilMidia.jsx → GET /media/mine, POST /media/upload, DELETE /media/:id
```

---

## SEÇÃO 9: REGRAS DE NEGÓCIO CRÍTICAS

> **INSTRUÇÃO:** Estas regras DEVEM ser validadas no backend, não apenas no frontend.

1. **CPF único**: Um CPF só pode ser associado a um usuário
2. **Email único**: Verificar antes de criar usuário
3. **OTP**: Expira em 10 minutos. Máximo 3 tentativas incorretas antes de invalidar o token
4. **Ownership**: Usuário só pode editar/deletar seus próprios Property, Listing, Media
5. **Listing requer Property**: Não é possível criar Listing sem um Property válido do mesmo owner
6. **Soft Delete em cascata**: Deletar User → marcar Properties e Listings como INATIVO
7. **Upload de Mídia**: Máximo 50 fotos e 5 vídeos por usuário (verificar antes do upload)
8. **Qualidade do Anúncio**: Score calculado = (fotos > 0 ? 30 : 0) + (descrição > 100 chars ? 25 : 0) + (endereço completo ? 25 : 0) + (área informada ? 20 : 0)

---

## SEÇÃO 10: PROBLEMAS DO FRONTEND A CORRIGIR NA INTEGRAÇÃO

> **INSTRUÇÃO:** Ao integrar, também corrija estes bugs identificados na auditoria:

| ID Auditoria | Arquivo Frontend | O que corrigir |
|-------------|-----------------|----------------|
| P0-001 | `AuthContext.jsx` | Substituir login/logout fake por chamadas de API reais |
| P0-002 | `App.jsx` | Adicionar `<PrivateRoute>` em todas as rotas de `/perfil` |
| P0-003 | `Login.jsx` | Conectar form ao endpoint `/auth/login` |
| P0-004 | `CadastroUsuario.jsx` | Validar senha == confirmarSenha ANTES de ir para step 2. Conectar ao `/auth/register` |
| P0-005 | `RecuperarSenha.jsx` | Conectar 3 steps aos endpoints de `/auth/forgot-password`, `/auth/verify-otp`, `/auth/reset-password` |
| P0-006 | `EditProfile.jsx` | Conectar formulário ao `/users/me` PUT |
| P0-007 | `CadastroImovel.jsx` | No step final, enviar POST `/properties` depois POST `/listings` |
| P1-001 | Todos perfil/*.jsx | Remover `usuarioMock`, usar dados do `AuthContext.user` |
| P1-003 | `SiteHeader.jsx` | Conectar busca ao `/listings?q=...` com debounce de 300ms |
| P1-004 | `ResultadosPesquisa.jsx` | Conectar filtros ao endpoint `/listings` com query params |
| P2-008 | `RecuperarSenha.jsx` | Corrigir src de `./logoFundoVerde.svg` para `/logo_fundo_removido_aluguel360.svg` |

---

## SEÇÃO 11: CHECKLIST DE VERIFICAÇÃO FINAL

Antes de declarar qualquer módulo completo, verifique:

- [ ] Todos os endpoints retornam `{ success: true/false, data/error }` consistentemente
- [ ] Validação com Zod está em todos os endpoints de POST/PUT
- [ ] Middleware `authenticate` está aplicado em TODAS as rotas protegidas
- [ ] Senhas NUNCA são retornadas nas respostas de API
- [ ] CPF NUNCA é retornado em resposta pública
- [ ] Rate limiting está ativo nas rotas de auth
- [ ] Upload valida tipo e tamanho antes de enviar ao Cloudinary
- [ ] OTP expira em 10 minutos e é hasheado no banco
- [ ] Soft delete funciona (deletedAt, não DROP)
- [ ] CORS permite apenas `FRONTEND_URL`

---

*Documento gerado por: Antigravity AI — 23/09/2026*  
*Projeto: Aluguel360 | Versão do Spec Kit: 1.0.0*
