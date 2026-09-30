# Auditoria Aluguel360 — BLOCO 4 (FINAL)

---

## 16 — Design System (Tokens Tailwind CSS)

Extraído diretamente de `index.css` (`@theme`) e do uso real nos componentes.

### Paleta de Cores

| Token Tailwind | Valor HEX | Uso |
|---|---|---|
| `bg-primary` | `#1A535C` | Header footer, banners, botão primário |
| `bg-primary-light` | `#2F646C` | Hover de primary em botões |
| `text-primary-foreground` | `#F8FAFC` | Texto sobre fundos primary |
| `bg-secondary` | `#2C7E7B` | Botões de ação principal, progress bar, destaque |
| `bg-secondary-hover` | `#1A535C` | Hover de secondary |
| `text-secondary` | `#2C7E7B` | Links ativos, labels, ícones de destaque |
| `bg-background` | `#F9FAFB` | Fundo geral da aplicação |
| `text-foreground` | `#2D2D2D` | Texto padrão do produto |
| `bg-card` | `#FFFFFF` | Fundo de cards |
| `bg-muted` | `#F1F5F9` | Fundo de inputs desabilitados, badges |
| `text-muted-foreground` | `#64748B` | Texto secundário, placeholders |
| `bg-accent` | `#F0F4F8` | Hover de itens de menu, fundo de campos |
| `text-accent-foreground` | `#2D2D2D` | Texto sobre accent |
| `bg-destructive` | `#FF6B6B` | Botões de deletar, erros |
| `bg-action` | `#FF6B6B` | Alias de destructive (redundante) |
| `border-border` | `#E2E8F0` | Bordas gerais |
| `ring-ring` | `#1A535C` | Foco de inputs |

> ⚠️ **Problema**: `primary` (#1A535C) e `secondary-hover` (#1A535C) têm **o mesmo valor**. São o mesmo token com dois nomes. Isso deve ser unificado.

> ⚠️ **Problema**: `destructive` e `action` têm o mesmo valor (#FF6B6B). Um deve ser removido.

---

### Cores hardcoded fora do sistema de tokens (a migrar)

| Valor hardcoded | Onde aparece | Token mais próximo |
|---|---|---|
| `#1A535C` (direto) | SiteHeader, Login, PerfilMeusImoveis, etc. | `primary` |
| `#2C7E7B` (direto) | CadastroImovel, PerfilQualidade, etc. | `secondary` |
| `#4ECDC4` | Login (botão Google), PerfilMeusAnuncios | Não existe token — criar `--color-teal-light` |
| `#F0F4F8` (direto) | SiteHeader, PerfilMeusImoveis | `accent` |
| `#2D2D2D` (direto) | Múltiplos componentes | `foreground` |
| `#D8E1E7` | PerfilMeusImoveis, PerfilMeusAnuncios | `border` (próximo) |
| `#9c9c9c` | Botão vídeo em CadastroImovel | Sem correspondência — ad-hoc |
| `#0d9488` / `teal-600` | VisualizarImoveis (var `G`) | `secondary` (valor diferente!) |

---

### Tipografia

| Token | Valor | Uso |
|---|---|---|
| `font-sans` (padrão) | Outfit | Body text global |
| `font-['Inter']` | Inter | Labels, textos descritivos, formulários |
| `font-['Poppins']` | Poppins | Headings, botões de ação, destaques |
| `font-['Outfit']` | Outfit | VisualizarImoveis e PerfilAnunciante (inline) |

**Escala tipográfica inferida (não formalizada no projeto):**

| Nível | Tamanho | Uso |
|---|---|---|
| display | 48px / 52px | Score de qualidade (PerfilQualidade) |
| h1 | 32–40px | Headings de página (Login, Home hero) |
| h2 | 22–26px | Subtítulos de seção |
| h3 | 18–20px | Títulos de card |
| h4 | 14–16px | Títulos de item |
| body | 13–14px | Texto padrão |
| caption | 10–12px | Metadados, labels menores |

> ⚠️ Todos os tamanhos são valores hardcoded (`text-[13px]`, `text-[14px]`...) — **nenhum usa a escala Tailwind padrão** (`text-sm`, `text-base`, `text-lg`). Isso impossibilita ajuste centralizado.

---

### Espaçamentos

Sem sistema formal. Uso misto de:
- Classes Tailwind padrão (`p-4`, `gap-2`, `mb-6`)
- Valores arbitrários (`p-2.5`, `px-[45px]`, `py-[51px]`)
- `min-h-[42px]`, `h-[30px]`, `w-[109px]` — dimensões fixas hardcoded em pixels

**Tokens de radius** (definidos no `@theme`):\
`radius-lg: 0.5rem` | `radius-md: calc(0.5rem - 2px)` | `radius-sm: calc(0.5rem - 4px)`\
Na prática, o projeto usa `rounded-[8px]`, `rounded-[9px]`, `rounded-[10px]`, `rounded-xl`, `rounded-2xl`, `rounded-3xl` — **sem consistência**.

---

### Sombras

| Uso | Valor | Componente |
|---|---|---|
| Header | `shadow-[0_2px_2.4px_-1px_rgba(26,83,92,0.6)]` | SiteHeader |
| Botão login | `shadow-[0_0_6.1px_0_rgba(0,0,0,0.41)]` | SiteHeader GuestActions |
| CadastroImovel Shell | `shadow-none` | Shell component |
| VisualizarImoveis card | `box-shadow: 0 2px 12px rgba(0,0,0,0.08)` | Inline styles |
| Shadcn Card | Tailwind padrão | Home |

> Quatro sistemas de sombra diferentes. Nenhum token definido.

---

### Tokens sugeridos a criar no `@theme`

```css
/* Adicionar em @theme no index.css */

/* Cor faltante */
--color-teal-light: #4ECDC4;

/* Tipografia — escala formal */
--text-xs:   0.75rem;   /* 12px */
--text-sm:   0.8125rem; /* 13px */
--text-base: 0.875rem;  /* 14px */
--text-md:   1rem;      /* 16px */
--text-lg:   1.125rem;  /* 18px */
--text-xl:   1.25rem;   /* 20px */
--text-2xl:  1.375rem;  /* 22px */

/* Sombras */
--shadow-card:   0 1px 8px rgba(0,0,0,0.06);
--shadow-header: 0 2px 4px rgba(26,83,92,0.4);
--shadow-popup:  0 4px 16px rgba(0,0,0,0.12);

/* Radius unificado */
--radius-xs:  4px;
--radius-sm:  6px;
--radius-md:  8px;
--radius-lg:  12px;
--radius-xl:  16px;
--radius-2xl: 24px;
```

---

## 17 — Consistência Global

### Nomes inconsistentes

| Conceito | Nome na rota | Nome no código | Nome na UI |
|---|---|---|---|
| Imóvel | `visualizar-imoveis` (plural) | `VisualizarImoveis` | "Ver Imóvel" |
| Anúncio de Imóvel | `perfil/meus-anuncios` | `PerfilMeusAnuncios` | "Meus Anúncios" / "Meu Imóveis" (typo) |
| Perfil anunciante | `perfil-anunciante` | `PerfilAnunciante` | Não acessível via navegação |
| Recuperar senha | `recuperar-senha` | `RecuperarSenha` | "Perdeu a senha?" |
| Qualidade | `perfil/qualidade` | `PerfilQualidade` | "Qualidade dos anúncios" |

**Typo encontrado**: em `Perfil.jsx` linha 113 → `titulo="Meu Imóveis"` (deveria ser "Meus Imóveis").

---

### Comportamentos inconsistentes para a mesma ação

| Ação | Comportamento A | Comportamento B |
|---|---|---|
| Validação de campo | `alert()` nativo (CadastroImovel) | Sem validação (Login, Cadastro) |
| Feedback de erro | Nenhum (maioria) | `alert()` (CadastroImovel) |
| Navegação de perfil | React Router (Perfil, sub-páginas) | State local `paginaAtiva` (PerfilAnunciante) |
| Estilo da UI | Tailwind CSS (90% do projeto) | Inline styles objeto `s` (VisualizarImoveis) |
| Card de imóvel | `<Card>` shadcn + HTML (Home) | `<CardImovel>` custom (ResultadosPesquisa) | Inline `CardRelacionado` (VisualizarImoveis) |
| Avatar de usuário | Div com iniciais + bg-teal (PerfilAnunciante) | Div com iniciais (VisualizarImoveis — Avatar) | Não existe (Perfil.jsx — sem avatar renderizado) |
| Botão de editar | `<button>` com `font-['Inter']` e cor #1A535C | `<button>` com `className="text-teal-600"` | `<Button>` shadcn |
| Footer | Layout.jsx (oficial, 4 colunas) | VisualizarImoveis (inline, 1 linha) |
| Logo | SVG externo (`/logo_fundo_removido_aluguel360.svg`) | Texto `Aluguel` + `<span>360</span>` styled |

---

### Padrões quebrados

1. **`<Link>` dentro de `<Button>`**: em Home.jsx `<Button><Link to="/resultados">...</Link></Button>` — semanticamente incorreto. `Button asChild` com `<Link>` é a forma correta no shadcn.
2. **`<button>` dentro de `<Link>`**: em Perfil.jsx `<Link><button>Alterar Dados</button></Link>` — redundância. Usar apenas o `Link` com estilo de botão ou `Button asChild`.
3. **`href="#"` em tags `<a>`**: em VisualizarImoveis, todos os links de navegação usam `href="#"` — sem React Router, sem navegação real.
4. **`CadastroImovel` fora do `Layout`**: a rota `/perfil/cadastro-imovel` usa o `Layout` (tem header/footer), mas o componente renderiza seu próprio `<main>` com fundo e `<MenuLogin>` interno — dois níveis de shell conflitam.
5. **`VisualizarImoveis` tem sua própria navbar**: fora do `Layout`, o que significa que se o usuário estiver autenticado, a navbar correta não aparece — ele vê uma navbar de convidado estática.
6. **`App.css` é o CSS padrão do Vite**: contém classes `.counter`, `.hero`, `.vite`, `#center`, `#next-steps` — resíduos do template inicial que nunca foram limpos.

---

## 18 — Preparação para Desenvolvimento Frontend

### Ordem ideal de desenvolvimento

#### FASE 0 — Fundação (1–2 dias) ✅ Já parcialmente feito
1. Limpar `App.css` (remover resíduos do Vite).
2. Consolidar tokens no `@theme` do `index.css` (adicionar tipografia, sombras, radius).
3. Criar `src/lib/mock/` com todos os JSONs mock do BLOCO 3 em arquivos separados.
4. Criar `src/hooks/useImoveis.js` e `src/hooks/useAuth.js` como wrappers dos mocks.

---

#### FASE 1 — Componentes base reutilizáveis (2–3 dias)
Nesta ordem de dependência:

1. **`CardImovel`** — unificar as 3 versões num único componente. É o componente mais reutilizado.
2. **`SiteHeader`** — já existe, mas migrar cores hardcoded para tokens.
3. **`Layout`** — já existe. Verificar que `VisualizarImoveis` passa pelo layout.
4. Mover sub-componentes de `CadastroImovel` para `src/components/forms/`:
   - `Shell`, `TipCard`, `TextField`, `TextAreaField`, `CountField`, `RadioOption`, `FeatureToggle`

---

#### FASE 2 — Telas de maior valor para validação de negócio (3–4 dias)
Prioridade pela relevância no fluxo de locatário e de proprietário:

| Prioridade | Tela | Motivo |
|---|---|---|
| 1 | `VisualizarImoveis` | Fluxo principal quebrado; maior riqueza de dados |
| 2 | `ResultadosPesquisa` | Depende do CardImovel; filtros a implementar |
| 3 | `CadastroImovel` | Diferencial do produto; dividir em 6 arquivos |
| 4 | `Home` | Vitrine — depende do CardImovel unificado |

---

#### FASE 3 — Autenticação e perfil (2–3 dias)

| Prioridade | Tela | Motivo |
|---|---|---|
| 1 | `Login` + `AuthContext` (real) | Base de tudo autenticado |
| 2 | `CadastroUsuario` | Fluxo de onboarding |
| 3 | `RecuperarSenha` | Fluxo OTP já modelado na UI |
| 4 | `Perfil` | Dashboard consolidado |
| 5 | `PerfilMeusImoveis` + `PerfilMeusAnuncios` | Gerenciamento |
| 6 | Sub-páginas de perfil | Segurança, Privacidade, Qualidade, Mídia, Endereços |

---

#### FASE 4 — Funcionalidades implícitas críticas (2 dias)

| # | Funcionalidade | Dependência |
|---|---|---|
| 1 | Busca funcional (input → `/resultados?q=`) | FASE 2 completa |
| 2 | Filtros funcionais em ResultadosPesquisa | FASE 2 |
| 3 | Favoritos com Context API | FASE 3 (auth) |
| 4 | Logout | FASE 3 |
| 5 | Link CardImovel → VisualizarImoveis | FASE 2 |

---

### Riscos técnicos (React + Vite)

| Risco | Gravidade | Mitigação |
|---|---|---|
| `VisualizarImoveis` fora do Layout | 🔴 Crítico | Mover para dentro do `<Layout>`, remover navbar/footer próprios |
| `CadastroImovel.jsx` em 1 arquivo (1425 linhas) | 🔴 Crítico | Separar em `CadastroImovel/index.jsx` + `Step1..6.jsx` antes de qualquer feature nova |
| `URL.createObjectURL` sem upload real | 🔴 Crítico | Integrar com storage (S3/Supabase Storage) desde o início — não deixar para depois |
| Sem React Router em PerfilAnunciante | 🟠 Alto | Substituir `useState("perfil")` por rotas reais |
| Leaflet SSR incompatível | 🟡 Médio | Adicionar `dynamic import` com `ssr: false` se migrar para Next.js |
| `App.css` com CSS do template Vite | 🟡 Médio | Deletar completamente antes de iniciar dev |
| Mocks hardcoded dentro dos componentes | 🟡 Médio | Mover todos para `src/lib/mock/` — nunca dentro do JSX |
| Ausência de proteção de rota autenticada | 🟡 Médio | Criar `<PrivateRoute>` que redireciona para login |
| `alert()` nativo em produção | 🟢 Baixo | Substituir por toast system (react-hot-toast ou sonner) |

---

## 19 — Pontos Críticos e Melhorias

### 🔴 Crítico — Bloqueia funcionamento básico

| ID | Problema | Melhoria (Simplicity First) |
|---|---|---|
| C01 | `CardImovel` não navega para `VisualizarImoveis` | Adicionar `<Link to="/visualizar-imoveis?id={id}">` wrapping o card |
| C02 | `VisualizarImoveis` tem navbar/footer próprios fora do `Layout` | Mover para dentro do `<Layout>` e deletar os duplicados |
| C03 | Formulário de cadastro sem persistência — qualquer abandono perde tudo | Salvar form em `localStorage` via `useEffect` no state; recuperar ao montar |
| C04 | Step 6 mostra checklist estático (sempre verde) | Derivar checklist do `form` state real — verificar campos e fotos |
| C05 | Nenhum componente chama `logout()` | Adicionar botão de Logout em `PerfilSidebar` e/ou menu de perfil do header |

---

### 🟠 Alto — Compromete UX significativamente

| ID | Problema | Melhoria |
|---|---|---|
| A01 | Validações usam `alert()` nativo | Substituir por toast (sonner) + mensagem inline com borda vermelha no campo |
| A02 | Search bar do header é decorativa | Conectar ao React Router: `navigate('/resultados?q=' + searchTerm)` no `onSubmit` |
| A03 | Filtros em ResultadosPesquisa não filtram | Adicionar `useState` para cada filtro + filtrar o array de imóveis no render |
| A04 | Favoritar sem autenticação e sem persistência | Criar `FavoritosContext` — verificar auth antes de favoritar, salvar IDs |
| A05 | `PerfilAnunciante` usa navigation por state local em vez de rotas | Substituir por rotas reais do React Router |
| A06 | CEP sem lookup automático | Integrar `ViaCEP` API: `fetch('https://viacep.com.br/ws/{cep}/json/')` no `onBlur` do campo |
| A07 | Sem tela de sucesso após publicar anúncio | Criar componente `PublicacaoSucesso` no Step 7 com próximos passos |
| A08 | `PerfilMeusImoveis` e `PerfilMeusAnuncios` sem ações reais | Conectar botões Editar/Deletar a rotas e handlers com confirmação modal |

---

### 🟡 Médio — Impacta qualidade mas não bloqueia

| ID | Problema | Melhoria |
|---|---|---|
| M01 | 3 implementações diferentes de card de imóvel | Unificar em `CardImovel` com variantes via prop `variant="compact|default|detailed"` |
| M02 | `CadastroImovel.jsx` com 1425 linhas | Separar em 6 Step files + 1 arquivo de sub-componentes de form |
| M03 | Cores hardcoded por todo o projeto | Migrar sistematicamente para os tokens do `@theme` |
| M04 | Escala tipográfica sem tokens formais | Criar CSS vars de tamanho de fonte no `@theme` e usar classes semânticas |
| M05 | `App.css` com resíduos do template Vite | Deletar arquivo completamente |
| M06 | `VisualizarImoveis` usa inline styles em tudo | Reescrever com Tailwind no contexto do Layout global |
| M07 | Sem proteção de rota autenticada | Criar `<PrivateRoute>` wrapper para rotas de perfil e cadastro de imóvel |
| M08 | `VisualizarImoveis` sem parâmetro de rota `:id` | Adicionar `useParams()` e carregar dados pelo ID |
| M09 | Ícones errados no footer (MapPin para e-mail/horário) | Substituir por `Mail` e `Clock` da Lucide |
| M10 | `recuperar-senha` usa `logoFundoVerde.svg` (caminho sem `/public/`) | Corrigir para `/logoFundoVerde.svg` ou usar o SVG já carregado |

---

### 🟢 Baixo — Polimento e boas práticas

| ID | Problema | Melhoria |
|---|---|---|
| B01 | Typo "Meu Imóveis" em `Perfil.jsx` | Corrigir para "Meus Imóveis" |
| B02 | `<Link>` dentro de `<Button>` na Home | Usar `Button asChild` com `<Link>` |
| B03 | `<button>` dentro de `<Link>` em Perfil | Usar `<Link className="...">` direto |
| B04 | `href="#"` em `VisualizarImoveis` | Substituir por `<Link to="...">` do React Router |
| B05 | "Acessar com Google" sem ícone do Google e cor errada | Usar cor `#4285F4` (Google blue) + ícone SVG oficial |
| B06 | Sem página 404 | Criar rota `*` com componente `NotFound` simples |
| B07 | `useMemo` ausente em `getRequiredPhotoSlots` | Envolver em `useMemo` para evitar recálculo a cada render |
| B08 | Sem `<title>` por página para SEO | Adicionar `document.title` ou `react-helmet-async` por rota |
| B09 | Sem `alt` descritivo em imagens de imóveis relacionados | Usar o nome do imóvel como `alt` |

---

## 20 — Relatório Executivo e Checklist Final

### Notas por dimensão

| Dimensão | Nota | Justificativa |
|---|---|---|
| **Produto** | 7.5 / 10 | Diferencial claro (mídia obrigatória), mas jornada do locatário quebrada (C01) e sem modelo de negócio definido |
| **UX** | 6.0 / 10 | Multi-step excelente, TipCards ótimos, preview ao vivo impressionante — mas validações nativas, sem rascunho, sem feedback de progresso |
| **UI** | 6.5 / 10 | Paleta coerente e tipografia adequada; corrompida por 3 sistemas visuais paralelos, inline styles e cores hardcoded |
| **Arquitetura Frontend** | 5.5 / 10 | Estrutura de pastas razoável, shadcn bem integrado, mas God Files, duplicação sistêmica e ausência de PrivateRoute comprometem |
| **Consistência** | 5.0 / 10 | O pior ponto: `VisualizarImoveis` é uma ilha isolada, 3 sistemas de estilo, 4 sistemas de sombra, nav fora do Layout |

---

### Decisão do Principal Architect

> **NÃO AUTORIZO** o início do desenvolvimento com a estrutura atual.

Mas não porque o projeto seja ruim — o nível de detalhe do CadastroImovel e o modelo de dados são impressionantes para um MVP. O problema é estrutural: existem dois "produtos" dentro de um projeto (`VisualizarImoveis` e o restante), e cinco problemas críticos que vão gerar retrabalho certo se não corrigidos antes.

**Posso autorizar** após a conclusão dos itens do Checklist Fase 0 abaixo.

---

### ✅ Checklist de Pendências — Pré-desenvolvimento

#### Fase 0 — Obrigatório antes do primeiro `npm run dev` real

- [ ] **C01** — Adicionar `<Link>` no `CardImovel` para `/visualizar-imoveis?id={id}`
- [ ] **C02** — Mover `VisualizarImoveis` para dentro do `<Layout>` global; deletar navbar/footer inline
- [ ] **C03** — Implementar persistência de rascunho com `localStorage` no `CadastroImovel`
- [ ] **C04** — Corrigir checklist do Step 6 para refletir estado real do form
- [ ] **C05** — Adicionar botão de Logout em `PerfilSidebar`
- [ ] **M05** — Deletar `App.css` (resíduos do template Vite)
- [ ] **M07** — Criar `<PrivateRoute>` para proteger rotas de perfil e cadastro de imóvel
- [ ] **M08** — Adicionar `useParams()` em `VisualizarImoveis` para carregar por ID
- [ ] Criar `src/lib/mock/` com todos os JSONs mock separados por entidade
- [ ] Mover todos os dados mock hardcoded para fora dos componentes

#### Fase 1 — Antes de entregar para dev Frontend completo

- [ ] **A01** — Substituir todos os `alert()` por toast (recomendado: `sonner`)
- [ ] **A02** — Conectar search bar do header a `navigate('/resultados?q=...')`
- [ ] **A03** — Implementar filtros funcionais em `ResultadosPesquisa`
- [ ] **A04** — Criar `FavoritosContext` com verificação de autenticação
- [ ] **A05** — Migrar `PerfilAnunciante` para React Router
- [ ] **A06** — Integrar ViaCEP no Step 3 do CadastroImovel
- [ ] **A07** — Criar tela de sucesso pós-publicação
- [ ] **M01** — Unificar as 3 versões de card de imóvel em `CardImovel` com variantes
- [ ] **M02** — Separar `CadastroImovel.jsx` em 6 Step files + pasta `components/forms/`
- [ ] **M03** — Migrar cores hardcoded para tokens do `@theme`
- [ ] **M06** — Reescrever `VisualizarImoveis` com Tailwind no contexto do Layout
- [ ] **B01** — Corrigir typo "Meu Imóveis" → "Meus Imóveis"
- [ ] **B06** — Criar rota `*` com componente `NotFound`

#### Fase 2 — Antes do release do MVP

- [ ] Implementar upload real de fotos e vídeo (integração com storage)
- [ ] Implementar autenticação real (JWT ou OAuth)
- [ ] Implementar lookup de CEP via ViaCEP
- [ ] Implementar busca e filtros reais com parâmetros de URL
- [ ] Implementar sistema de avaliações com persistência
- [ ] Implementar favoritos persistentes por usuário
- [ ] Adicionar `<title>` e meta description por rota (react-helmet-async)
- [ ] Criar fluxo de moderação/aprovação de anúncio (estado `pendente_aprovacao`)
- [ ] Adicionar tratamento de erros em todos os fluxos de exceção (FE-001 a FE-007)
- [ ] Implementar rascunho automático no CadastroImovel com sincronização de servidor
- [ ] Testes de acessibilidade (contraste WCAG AA, labels de formulário, foco)

---

### Resumo executivo em uma frase por dimensão

- **Produto**: conceito forte com diferencial real, mas a jornada do locatário está quebrada desde o card.
- **UX**: o cadastro de imóvel é o melhor da plataforma; o resto precisa de feedback e persistência.
- **UI**: paleta boa, mas três sistemas visuais paralelos tornam manutenção impossível.
- **Arquitetura**: dois God Files e dois sistemas de estilo devem ser resolvidos antes de escalar o time.
- **Consistência**: `VisualizarImoveis` precisa ser reconstruída dentro do sistema.

---

*Auditoria concluída. 4 blocos, 20 pontos, 5 dimensões avaliadas.*
