# Auditoria Aluguel360 — BLOCO 2

---

## 6 — Auditoria de Componentização Avançada

### Problemas de granularidade

**Componentes grandes demais (God Files)**

| Arquivo | Linhas | Problema |
|---|---|---|
| `CadastroImovel.jsx` | 1.425 | Contém lógica de estado global do formulário + 6 Step Panels + 10 sub-componentes internos. Um único arquivo que deveria ser um diretório. |
| `VisualizarImoveis.jsx` | 686 | Contém dados mock hardcoded, navbar própria, footer próprio, 5+ sub-componentes inline e ~70 objetos de estilo num único objeto `s`. |
| `PerfilAnunciante.jsx` | 431 | Duplica integralmente a estrutura da página `Perfil.jsx` com componentes próprios e dados mock próprios. |

**Repetições e duplicações críticas**

1. **Duas navbars**: `SiteHeader.jsx` é o header oficial do `Layout`. Mas `VisualizarImoveis.jsx` tem sua **própria navbar** implementada com inline styles — completamente fora do sistema de design. São dois sistemas de navegação paralelos para a mesma aplicação.

2. **Dois footers**: `Layout.jsx` tem o footer oficial. `VisualizarImoveis.jsx` tem um footer próprio com inline styles.

3. **Dois sistemas de card de perfil**: `Perfil.jsx` usa `PerfilCard` (componente externo). `PerfilAnunciante.jsx` redefine um `Card` interno com a mesma responsabilidade mas API diferente.

4. **Duas sidebars de perfil**: `PerfilSidebar.jsx` é a sidebar oficial. `PerfilAnunciante.jsx` tem `SidebarPerfil` — componente interno com mesma função, menu diferente, routing via state local (sem `react-router-dom`).

5. **Dois sistemas de estilo**: 90% do projeto usa Tailwind CSS. `VisualizarImoveis.jsx` usa **exclusivamente inline styles** com um objeto `s` gigante. Isso torna imposível aplicar tokens de design e responsividade consistentes.

6. **`CardImovel` x cards inline da Home**: a Home usa `<Card>` shadcn + HTML manual para os 3 imóveis. `ResultadosPesquisa` usa `<CardImovel>`. `VisualizarImoveis` tem `CardRelacionado` inline com estilos próprios. São 3 implementações diferentes para o mesmo conceito visual.

**Componentes pequenos demais / desnecessários**

- `MenuLogin.jsx` (707 bytes): utilizado apenas dentro de `CadastroImovel.jsx`, e é basicamente um `<Link>` para a página inicial. Poderia ser inline.
- `PerfilCard.jsx` (706 bytes): wrapper genérico que só renderiza `children`. Justo, mas sem documentação de uso.

### Reorganização sugerida (React + Vite)

```
src/
  components/
    layout/          # Layout, SiteHeader, Footer (extraído)
    property/        # CardImovel, CardRelacionado (unificados)
    profile/         # PerfilSidebar, PerfilHeader, PerfilCard (oficializados)
    forms/           # Shell, TipCard, TextField, TextAreaField, CountField, etc.
    ui/              # shadcn (já existe)
  pages/
    CadastroImovel/
      index.jsx      # Orquestrador + estado
      Step1.jsx
      Step2.jsx
      Step3.jsx
      Step4.jsx
      Step5.jsx
      Step6.jsx
    VisualizarImoveis/
      index.jsx      # Usa Layout global (sem navbar/footer próprios)
```

---

## 7 — Arquitetura Funcional

### Funcionalidades existentes (implementadas)

| # | Funcionalidade | Onde |
|---|---|---|
| F01 | Login simulado (toggle de estado global) | `Login.jsx` + `AuthContext` |
| F02 | Cadastro de usuário (sem validação real) | `CadastroUsuario.jsx` |
| F03 | Recuperação de senha (fluxo de UI) | `RecuperarSenha.jsx` |
| F04 | Header responsivo com estado auth | `SiteHeader.jsx` |
| F05 | Busca de imóveis (lista estática) | `ResultadosPesquisa.jsx` |
| F06 | Filtros de categoria e preço (estáticos, sem estado) | `BarraFiltros`, `FiltroLateral`, `FiltroPreco` |
| F07 | Visualização detalhada de imóvel | `VisualizarImoveis.jsx` |
| F08 | Galeria de fotos com thumbnails e navegação | `VisualizarImoveis.jsx` |
| F09 | Modal de vídeo | `VisualizarImoveis.jsx` |
| F10 | Sistema de avaliações (state local, sem persistência) | `VisualizarImoveis.jsx` |
| F11 | Favoritar imóvel (state local, perde ao navegar) | `CardImovel.jsx` + `VisualizarImoveis` |
| F12 | Cadastro de imóvel multi-step (6 etapas) | `CadastroImovel.jsx` |
| F13 | Upload de fotos por cômodo (file input, URL.createObjectURL) | `CadastroImovel` Step 2 |
| F14 | Upload de vídeo obrigatório | `CadastroImovel` Step 2 |
| F15 | Mapa interativo com marcador arrastável (Leaflet) | `CadastroImovel` Step 3 |
| F16 | Preview ao vivo do card do anúncio | `CadastroImovel` Step 5 e 6 |
| F17 | Navegação de edição por step a partir da revisão | `CadastroImovel` Step 6 |
| F18 | Dashboard de perfil do proprietário | `Perfil.jsx` + `PerfilAnunciante.jsx` |
| F19 | Qualidade do anúncio com score visual | `PerfilQualidade.jsx` + `PerfilAnunciante` |

### Funcionalidades implícitas (inferidas, não implementadas)

| # | Funcionalidade | Evidência |
|---|---|---|
| I01 | **Moderação/aprovação de anúncio** | TipCard: "anúncios reprovados" e "aprovação" |
| I02 | **Persistência de rascunho** | Step 6 lista "rascunho" como estado, Perfil mostra "1 cadastro em rascunho" |
| I03 | **Chat interno** | Botão "Contato pelo chat interno" em `VisualizarImoveis` |
| I04 | **Sistema de notificações** | Ícone e link "Notificações" no header autenticado |
| I05 | **Lookup de CEP** | Campo CEP com hint "Buscaremos automaticamente" mas sem implementação |
| I06 | **Busca funcional** | Input de busca no header e em `ResultadosPesquisa` sem estado |
| I07 | **Autenticação real** (OAuth Google) | Botão "Acessar com Google" no Login |
| I08 | **Perfil público do anunciante** | Link `perfil-anunciante` existe nas rotas mas não é acessado de nenhum card |
| I09 | **Sistema de favoritos persistente** | Ícone `IconeFavorito` no header (sem rota/contexto) |
| I10 | **Exclusão/pausa de anúncio** | `PerfilMeusAnuncios.jsx` existe mas é stub |

### Funcionalidades que estão faltando (gaps críticos)

| # | Gap | Impacto |
|---|---|---|
| G01 | **`<Link>` no CardImovel → VisualizarImoveis** | CRÍTICO — locatário não consegue ver detalhes de imóvel |
| G02 | **Tela de sucesso pós-publicação** | Alto — usuário não sabe se o anúncio foi publicado |
| G03 | **Paginação nos resultados** | Alto — 7 imóveis estáticos, não escalável |
| G04 | **Filtros funcionais** | Alto — filtros de categoria e preço não filtram nada |
| G05 | **Confirmação de e-mail no cadastro** | Alto — sem verificação de identidade |
| G06 | **Logout** | Médio — `AuthContext` tem `logout()` mas nenhum componente o chama |
| G07 | **Gerenciar Imóveis/Anúncios** | Médio — páginas existem mas são stubs (sem dados, sem ações) |
| G08 | **Mapa na visualização do imóvel** | Médio — sem localização visual para o locatário |
| G09 | **Página 404** | Baixo — sem fallback de rota |
| G10 | **Validação de formato de rent** | Baixo — campo aceita qualquer string |

---

## 8 — Regras Implícitas de Negócio

Inferidas a partir do código. Todas precisam ser formalizadas antes do desenvolvimento.

| ID | Regra | Onde inferida |
|---|---|---|
| RN-001 | Se o imóvel tem N quartos, o sistema exige N fotos de quartos. Idem para salas, varandas, suítes, banheiros, garagem. | `getRequiredPhotoSlots()` em CadastroImovel |
| RN-002 | Todo imóvel exige obrigatoriamente ao menos 1 foto de Capa. | Slot "Capa" sempre presente em `getRequiredPhotoSlots()` |
| RN-003 | Apartamentos exigem foto de "Fachada do Prédio" e "Entrada / Portaria". Casas e Kitnets exigem foto de "Fachada". Outros tipos não têm fachada obrigatória. | `getRequiredPhotoSlots()` — switch por `propertyType` |
| RN-004 | Todo imóvel exige obrigatoriamente um vídeo de no mínimo 1 minuto. | Validação em `goNext()` + texto da landing de cadastro |
| RN-005 | Sem CEP, Rua e Bairro preenchidos, o usuário não avança do Step 3. | Validação em `goNext()` step === 3 |
| RN-006 | Sem valor de aluguel, o usuário não avança do Step 4. | Validação em `goNext()` step === 4 |
| RN-007 | O proprietário pode adicionar cômodos personalizados (além dos 6 padrões). Esses cômodos extras podem ser deletados; os 6 padrões não podem. | `DEFAULT_ROOM_IDS` + lógica `isCustom` em StepOnePanel |
| RN-008 | Valores de aluguel "irreais" (0, 1111, etc.) podem causar reprovação do anúncio. | TipCard do Step 4 |
| RN-009 | A garantia padrão é "Sem garantia". Aceitar mais tipos de garantia aumenta o número de interessados. | `initialForm.guarantee` + TipCard Step 4 |
| RN-010 | Anúncios completos recebem "até 3x mais contatos". | Texto marketing na tela inicial de cadastro — pode ser um threshold de qualidade. |
| RN-011 | Um imóvel pode estar em estado: cadastrado (rascunho), anunciado (ativo), pausado, encerrado, alugado. | Dados mock em `Perfil.jsx` e `PerfilAnunciante.jsx` |
| RN-012 | O anúncio tem uma "nota de qualidade" calculada por completude de informações + engajamento de usuários (0–10). | `PerfilQualidade.jsx` + `PerfilAnunciante` — `CardQualidade` |
| RN-013 | O sistema distingue "Imóvel" (entidade física) de "Anúncio" (publicação). Um imóvel pode ter múltiplos anúncios históricos (ativo, encerrado). | Separação `PerfilMeusImoveis` vs `PerfilMeusAnuncios` nas rotas |
| RN-014 | O proprietário pode ter tipo: "Corretor Autônomo" (com CRECI) ou pessoa física comum. | Campo `creci` e `tipo` em `PerfilAnunciante` mock |
| RN-015 | A avaliação de um imóvel é composta por: estrelas (1–5) + texto + identificação do avaliador. | Estrutura de `avaliacoesIniciais` em `VisualizarImoveis` |
| RN-016 | Despesas do imóvel incluem: aluguel base + IPTU + condomínio + água + energia + manutenção + seguro incêndio. Cada uma pode ser "inclusa no aluguel" ou separada. | Step 4 + objeto `despesas` em `VisualizarImoveis` |
| RN-017 | Fotos extras além das obrigatórias são permitidas (opcional, múltiplos arquivos). | `extraPhotos` em initialForm + handleExtraPhotos |

---

## 9 — Modelo de Entidades Frontend

Entidades lógicas necessárias para navegação e estado da UI (não é modelagem de banco).

### Usuario
```
Usuario {
  id: string
  nome: string
  email: string
  cpf: string (mascarado)
  iniciais: string          // avatar fallback
  dataCadastro: string
  tipo: 'pessoa_fisica' | 'corretor'
  creci?: string            // só para corretor
  telefone?: string
  isAuthenticated: boolean
  cadastroCompleto: boolean
}
```
**Relacionamentos**: possui → Enderecos[], possui → Imoveis[], possui → Anuncios[]

---

### Endereco
```
Endereco {
  id: string
  usuarioId: string
  rua: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  cep: string
  isPrincipal: boolean
}
```

---

### Imovel
```
Imovel {
  id: string
  proprietarioId: string
  tipo: 'Casa' | 'Apartamento' | 'Kitnet' | 'Cômodo' | 'Outro'
  area: number              // m²
  comodos: Comodo[]
  features: Features        // pets, mobiliado, portaria, etc.
  endereco: EnderecoImovel  // endereço físico do imóvel
  status: 'rascunho' | 'disponivel' | 'anunciado' | 'alugado' | 'inativo'
  midia: Midia              // fotos por slot + vídeo
  criadoEm: string
}
```

---

### Comodo
```
Comodo {
  id: string
  label: string             // 'Quartos', 'Salas', etc.
  quantidade: number
  isPadrao: boolean         // DEFAULT_ROOM_IDS
}
```

---

### Anuncio
```
Anuncio {
  id: string
  imovelId: string
  proprietarioId: string
  titulo: string
  descricao: string
  extraInfo?: string
  aluguelBase: number
  condominioFee?: number
  condominioIncluido: boolean
  iptuFee?: number
  iptuIncluido: boolean
  outrasTaxas?: string
  garantia: 'Caução' | 'Fiador' | 'Sem garantia' | 'Seguro Fiançado'
  negociavel: boolean
  status: 'rascunho' | 'pendente_aprovacao' | 'ativo' | 'pausado' | 'encerrado' | 'reprovado'
  notaQualidade: number     // 0–10
  visualizacoes: number
  contatosRecebidos: number
  criadoEm: string
  atualizadoEm: string
}
```
**Tag inferida**: `Anuncio.status` é mais rico que `Imovel.status` — é o anúncio que tem ciclo de aprovação, não o imóvel.

---

### Midia
```
Midia {
  imovelId: string
  fotos: FotoSlot[]         // { slotKey: string, url: string, label: string }
  fotosExtras: string[]     // URLs adicionais
  video?: string            // URL do vídeo
  totalFotos: number
  totalVideos: number
}
```

---

### Avaliacao
```
Avaliacao {
  id: string
  anuncioId: string
  autorId: string
  autorNome: string
  autorAvatar: string       // iniciais
  estrelas: number          // 1–5
  texto: string
  criadaEm: string
}
```

---

### Amenidade (valor lookup, não entidade própria)
```
Amenidade {
  key: string               // 'wifi', 'garagem', 'academia', etc.
  label: string
  icon: LucideIcon
}
```

---

### Relações conceituais para navegação
```
Usuario (1) ──→ (N) Imovel
Imovel  (1) ──→ (N) Anuncio
Anuncio (1) ──→ (N) Avaliacao
Anuncio (1) ──→ (1) Midia
Imovel  (1) ──→ (N) Comodo
```

---

## 10 — Estrutura de Dados Necessários por Tela

### Home (`/`)
```json
{
  "imoveisDestaque": [
    {
      "id": "string",
      "titulo": "string",
      "preco": "number",
      "area": "number",
      "quartos": "number",
      "fotoPrincipal": "string (url)",
      "endereco": "string",
      "avaliacaoMedia": "number",
      "totalEstrelas": "number"
    }
  ]
}
```
*Filtros da Home* (estado local, sem dado de API):
```json
{ "filtroAtivo": "Casas | Apartamentos | Kitnets | Mobiliado | null" }
```

---

### ResultadosPesquisa (`/resultados`)
```json
{
  "imoveis": [
    {
      "id": "string",
      "imagem": "string (url)",
      "titulo": "string",
      "descricao": "string",
      "preco": "number",
      "area": "number",
      "quartos": "number",
      "endereco": "string",
      "tipo": "Casa | Apartamento | Kitnet | Cômodo | Outro",
      "mobiliado": "boolean"
    }
  ],
  "total": "number",
  "filtros": {
    "tipo": "string | null",
    "precoMin": "number | null",
    "precoMax": "number | null",
    "quartos": "number | null",
    "area": "number | null"
  }
}
```

---

### VisualizarImoveis (`/visualizar-imoveis`)
```json
{
  "imovel": {
    "id": "string",
    "nome": "string",
    "tag": "string",
    "preco": "number",
    "endereco": "string",
    "cidade": "string",
    "descricao": "string",
    "informacoesRelevantes": "string",
    "area": "number",
    "quartos": "number",
    "banheiros": "number",
    "amenidades": [{ "icon": "string", "label": "string" }],
    "midia": [
      { "tipo": "video | foto", "thumb": "string | null" }
    ],
    "fotoPrincipal": "string",
    "avaliacaoMedia": "number",
    "totalAvaliacoes": "number",
    "distribuicaoEstrelas": { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 },
    "despesas": {
      "iptu": "number",
      "garantia": "string",
      "agua": "number",
      "energia": "number",
      "condominio": "number",
      "manutencao": "number",
      "seguroIncendio": "number"
    }
  },
  "imoveisRelacionados": [
    {
      "id": "string",
      "nome": "string",
      "preco": "number",
      "area": "number",
      "quartos": "number",
      "endereco": "string",
      "foto": "string",
      "avaliacao": "number"
    }
  ],
  "avaliacoes": [
    {
      "id": "string | number",
      "nome": "string",
      "estrelas": "number",
      "texto": "string",
      "avatar": "string (iniciais)"
    }
  ]
}
```

---

### CadastroImovel (`/perfil/cadastro-imovel`) — form state
```json
{
  "propertyType": "Casa | Apartamento | Kitnet | Cômodo | Outro",
  "area": "string",
  "rooms": [
    { "id": "string", "label": "string", "value": "number" }
  ],
  "features": {
    "pets": "boolean", "condominio": "boolean", "suite": "boolean",
    "mobiliado": "boolean", "iptu": "boolean", "portaria": "boolean",
    "escolas": "boolean", "transporte": "boolean"
  },
  "cep": "string",
  "street": "string",
  "neighborhood": "string",
  "reference": "string",
  "complement": "string",
  "number": "string",
  "highlight": "string",
  "rent": "string",
  "negotiable": "boolean",
  "condoFee": "string",
  "condoIncluded": "boolean",
  "iptuFee": "string",
  "iptuIncluded": "boolean",
  "otherFees": "string",
  "guarantee": "Caução | Fiador | Sem garantia | Seguro Fiançado",
  "title": "string",
  "description": "string",
  "extraInfo": "string",
  "photos": { "[slotKey: string]": "string (objectURL)" },
  "extraPhotos": ["string (objectURL)"],
  "video": "string | null (objectURL)"
}
```

---

### Perfil (`/perfil`)
```json
{
  "usuario": {
    "nome": "string",
    "email": "string",
    "iniciais": "string",
    "dataCadastro": "string",
    "cpf": "string (mascarado)"
  },
  "resumo": {
    "enderecos": { "total": "number", "principal": "Endereco" },
    "seguranca": { "metodos": "number", "dispositivos": "number", "alertas": "number", "localizacao": "boolean" },
    "imoveis": { "total": "number", "anunciados": "number", "rascunho": "number", "alugados": "number" },
    "qualidade": { "nota": "number", "maximo": "number" },
    "midia": { "fotos": "number", "videos": "number" }
  }
}
```

---

### PerfilAnunciante (`/perfil-anunciante`)
Dados mock já bem estruturados em `PerfilAnunciante.jsx` — ver `mockAnunciante`. Adicionar:
```json
{
  "anuncios": {
    "ativos": "number",
    "pausados": "number",
    "encerrados": "number",
    "visualizacoesTotal": "number",
    "contatosRecebidos": "number",
    "notaMedia": "number",
    "notaMaxima": "number"
  }
}
```

---

### Login (`/login`) — sem dado de API, apenas estado local
```json
{
  "email": "string",
  "password": "string",
  "rememberMe": "boolean",
  "isLoading": "boolean",
  "error": "string | null"
}
```

---

*Aguardando "Continue" para o BLOCO 3.*
