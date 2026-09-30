# Auditoria Aluguel360 — BLOCO 1

---

## `<premissas>`

1. **Plataforma de locação B2C2B**: proprietários cadastram imóveis e geram anúncios; inquilinos buscam e contatam. O sistema diferencia "Imóvel" (entidade física) de "Anúncio" (publicação do imóvel) — essa distinção já existe no código (`PerfilMeusImoveis` vs. `PerfilMeusAnuncios`).
2. **Autenticação é simulada**: `AuthContext` seta `isAuthenticated = true` em qualquer submit de login — sem validação real. Pressupõe-se que a autenticação real virá de uma API futura.
3. **Aprovação de anúncio existe implicitamente**: o texto de UX menciona "anúncios reprovados" e "aprovação", mas não há tela, estado ou fluxo para isso. Assume-se que existe um fluxo de moderação previsto, ainda não modelado na UI.
4. **CEP não chama API real**: o campo existe, mas não há lookup automático (ViaCEP ou similar) implementado; o mapa usa coordenadas fixas (Floriano-PI).
5. **Ambiguidade — duplo papel do usuário**: qualquer usuário pode ser locador e locatário ao mesmo tempo. Não há separação de roles visível na UI (ex: um locatário não deveria ver "Anunciar" como ação primária).

---

## 1 — Visão Geral do Produto

**Nota: 7,5 / 10**

**Proposta de valor**
- Diferencial real e defensável: anúncios extremamente completos (fotos por cômodo + vídeo obrigatório). Resolve um problema genuíno de mercado — a baixa qualidade dos anúncios em plataformas genéricas.
- O posicionamento está correto: não é "mais um OLX", é uma plataforma com padrão de qualidade forçado.

**O que está bem**
- O conceito do cadastro multi-step com validação de mídia obrigatória é o maior diferencial e está implementado.
- A separação Imóvel vs. Anúncio é conceitualmente madura (proprietário pode ter imóveis sem anúncios ativos).
- Fluxo de cadastro de imóvel com preview ao vivo (Step 5 e 6) é de nível profissional.
- Uso de Leaflet para mapa interativo com marcador arrastável é tecnicamente correto e agrega credibilidade.

**Riscos e fraquezas**
- **Barreira de entrada altíssima para o proprietário**: obrigar foto por cômodo + vídeo de 1 minuto logo no primeiro anúncio pode gerar taxa de abandono crítica. Não há fluxo de rascunho salvo (o formulário é 100% local state — fechar a aba perde tudo).
- **Nenhum diferencial para o locatário**: a experiência do inquilino (busca, filtros, visualização) está muito rasa. `ResultadosPesquisa` é basicamente um grid de cards estáticos, sem filtro funcional.
- **Monetização não modelada**: não há pricing, planos, destaque pago ou qualquer indicativo de modelo de negócio. Isso não impede o MVP, mas é um risco de produto de médio prazo.
- **Ausência de sistema de aprovação na UI**: o texto avisa que anúncios podem ser reprovados, mas não há estado, tela ou fluxo para isso.
- **Contato imóvel → proprietário**: a página `VisualizarImoveis` tem campos de contato (mensagem, email, telefone), mas não há rota de navegação ligando `CardImovel` (em ResultadosPesquisa) à `VisualizarImoveis`. Fluxo quebrado.

---

## 2 — Auditoria de UX

### O que está bom
- **Cadastro guiado (CadastroImovel)**: a progressão em 6 steps com ProgressBar, TitleBlock e TipCard lateral é excelente. Reduz carga cognitiva ao dividir decisões.
- **TipCards laterais**: contexto e justificativa para cada etapa — boa prática de UX de formulário.
- **Preview ao vivo no Step 5**: mostrar o `CardImovel` renderizado em tempo real com os dados do form é uma microinteração poderosa.
- **Validação de mídia obrigatória**: a função `getRequiredPhotoSlots` é inteligente — gera slots dinâmicos baseados no número de cômodos declarados. Isso força qualidade.
- **Header responsivo**: SiteHeader tem versão mobile com menu hamburger funcional.
- **Navegação por edição no Step 6**: links de "Editar X" que voltam para steps específicos é boa solução para formulários longos.

### O que está ruim
- **Carga cognitiva no step 0 (tela de intro)**: lista 4 bullets informativos + botão. Tela de intro desnecessária — prolonga o fluxo. Remover e ir direto para Step 1 é mais eficiente.
- **Feedback inexistente em validações**: erros são `alert()` nativo do browser. Não há mensagem inline, destaque de campo inválido ou toast system. É UX de 2008.
- **Nenhum estado de loading**: uploads de foto/vídeo não têm indicador de progresso ou feedback visual.
- **Nenhum estado de "rascunho salvo"**: fechar o browser durante o cadastro perde todo o progresso. Crítico para um fluxo que exige 5+ minutos.
- **Favoritar sem autenticação**: o `CardImovel` tem botão de favorito (state local) que não pede login. O estado é perdido em qualquer navegação.
- **Search bar no Header não funciona**: o `<Input>` de busca não tem `onSubmit`, `onChange` conectado a nenhum state ou navegação. É decorativo.
- **"Quero anunciar" no Header (guest)** leva para `#` (nada). Deveria ir para `/login` ou `/perfil/cadastro-imovel`.
- **Contato → Footer com MapPin**: no rodapé, todos os 3 itens de contato/suporte usam ícone `MapPin` (localização). O contexto é e-mail e horário — ícones errados, prejudica clareza.
- **Step 2 (fotos) sem indicação de progresso parcial**: o usuário não sabe quantas fotos já preencheu vs. total obrigatório enquanto está na tela.
- **Step 6 (revisão) não mostra os dados reais**: mostra lista estática de "checkboxes" sempre marcados, independente do que foi preenchido. Revisão enganosa.

### Curva de aprendizado
- Para o **locatário**: baixa. A Home é intuitiva.
- Para o **proprietário**: alta demais. O fluxo de cadastro do imóvel exige muita preparação prévia (fotos prontas, vídeo gravado), sem comunicação dessa necessidade antes de iniciar.

---

## 3 — Auditoria Visual

### Hierarquia e tipografia
- **Bom**: uso consistente de Poppins (headings) + Inter (body) ao longo do projeto.
- **Ruim**: tamanhos de fonte ad-hoc com valores hardcoded (`text-[13px]`, `text-[14px]`, `text-[16px]`, `text-[18px]`...). Sem escala tipográfica definida — cada componente tem valores próprios.
- **Ruim**: a `Home` mistura tokens Tailwind semânticos (`text-foreground`, `text-muted-foreground`) com valores hardcoded — inconsistência entre páginas.

### Cores
- **Boa paleta base**: primary `#1A535C` (teal profundo) + secondary (teal médio) + accent (fundo claro). Coerente com o contexto imobiliário.
- **Problema**: `secondary` e `secondary-hover` são usados como tokens Tailwind, mas em vários componentes a cor `#1A535C` é escrita diretamente (`bg-[#1A535C]`, `text-[#1A535C]`). Duplicidade que vai gerar inconsistência ao mudar a paleta.
- **Botão de vídeo (Step 2)**: `bg-[#9c9c9c]` — cinza neutro sem relação com a paleta. Parece não-intencional.
- **"Acessar com Google" (Login)**: `bg-[#4ECDC4]` (teal claro) não é a cor do Google. Confunde o usuário sobre o que é OAuth. Ícone usado é `Globe`, não o ícone do Google.

### Contraste e acessibilidade
- **Problema sério**: `opacity-80`, `opacity-60` aplicados sobre texto branco em fundos `bg-primary` podem cair abaixo de WCAG AA (4.5:1). Não foi testado formalmente, mas é risco real.
- **Labels sem `for`**: `TextField` e `TextAreaField` usam padrão `<label>` wrapping `<Input>` — ok. Mas o `Field` no Login usa `<label>` wrapping sem conectar ao input por `id`. Acessibilidade parcial.

### Consistência
- **Home**: usa `<Card>` shadcn com `CardContent` para imóveis.
- **ResultadosPesquisa**: usa `<CardImovel>` customizado (diferente de Home).
- **VisualizarImoveis**: os dados de imóveis relacionados têm estrutura diferente dos mocks de `ResultadosPesquisa`.
- Três formas diferentes de exibir um imóvel em três telas diferentes.

### Responsividade
- Header tem breakpoint mobile funcional.
- `CadastroImovel` usa grid responsivo adequado.
- `ResultadosPesquisa`: filtro lateral some em mobile sem alternativa (sem botão de filtro flutuante ou modal).
- `Home`: hero section sem controle de altura mínima em mobile — pode ficar cortada.

---

## 4 — Jornada Completa do Usuário

### Jornada do Locatário (Inquilino)

| Etapa | Tela | Fricção |
|---|---|---|
| Chega ao site | `Home` | Boa primeira impressão. Hero OK. |
| Quer buscar imóvel | Clica em "Explorar Imóveis" ou filtra na Home | Filtros da Home não fazem nada (sem rota) |
| Vai para Resultados | `ResultadosPesquisa` | Filtros laterais são estáticos, sem estado |
| Clica em um card | `CardImovel` não tem `<Link>` | **BLOQUEIO CRÍTICO**: CardImovel não navega para `VisualizarImoveis`. O fluxo está quebrado. |
| Visualiza o imóvel | `VisualizarImoveis` | Só acessível via URL direta. Boa página quando chegada. |
| Quer contatar | Formulário de contato na VisualizarImoveis | Sem envio real, sem autenticação exigida |
| Abandono | — | Alta probabilidade por filtros não funcionais |

### Jornada do Proprietário (Anunciante)

| Etapa | Tela | Fricção |
|---|---|---|
| Descobre a plataforma | `Home` — banner "Anunciar meu imóvel" | Botão existe mas não tem rota definida (`#`) |
| Tenta criar conta | `CadastroUsuario` | Sem validação real, sem confirmação de e-mail |
| Faz login | `Login` | Qualquer credencial funciona |
| Vai para perfil | `Perfil` | Visual adequado, cards de resumo claros |
| Quer anunciar | Header → "Quero Anunciar" → `/perfil/cadastro-imovel` | OK quando autenticado |
| Inicia cadastro | `CadastroImovel` Step 0 | Tela intro desnecessária |
| Preenche Step 1 | Tipo, cômodos, features | Bom. CountField intuitivo. |
| Preenche Step 2 | Fotos + vídeo obrigatórios | **Ponto de maior abandono esperado** — sem rascunho, sem upload progress |
| Preenche Step 3 | CEP sem autocomplete → mapa com pin fixo | Frustração: CEP não busca automaticamente |
| Preenche Step 4 | Preços e garantias | Adequado |
| Preenche Step 5 | Título + descrição + preview ao vivo | Excelente UX |
| Revisão Step 6 | Checklist estático + preview | Revisão falsa: não valida dados reais |
| Publica | Botão "Publicar Anúncio" | Sem feedback de confirmação, sem rota pós-publicação |

### Pontos de abandono críticos
1. **Step 2**: usuário sem fotos prontas abandona.
2. **Step 3**: CEP sem autocomplete gera digitação manual desnecessária.
3. **CardImovel → VisualizarImoveis**: fluxo do locatário quebrado.
4. **Pós-publicação**: sem tela de sucesso ou próximo passo.

---

## 5 — Arquitetura da Interface (Componentização Inicial)

### Grupo 1 — Layout Global
| Componente | Arquivo | Responsabilidade |
|---|---|---|
| `Layout` | `Layout.jsx` | Shell da aplicação: Header + Outlet + Footer |
| `SiteHeader` | `SiteHeader.jsx` | Navbar sticky com busca, nav links e ações de autenticação |
| `BrandBlock` | interno SiteHeader | Logo + localização (sub-componente de SiteHeader) |
| `SearchNavigation` | interno SiteHeader | Input de busca + links de nav |
| `GuestActions` | interno SiteHeader | Botões Cadastrar/Entrar para não-autenticado |
| `AuthenticatedActions` | interno SiteHeader | Botões Anunciar/Meu Perfil/Notificações para autenticado |

### Grupo 2 — Imóveis / Anúncios
| Componente | Arquivo | Responsabilidade |
|---|---|---|
| `CardImovel` | `CardImovel.jsx` | Card de imóvel reutilizável em ResultadosPesquisa, Step5, Step6, Home (parcialmente) |
| `BarraFiltros` | `BarraFiltros.jsx` | Barra de tags de filtro horizontal |
| `FiltroLateral` | `FiltroLateral.jsx` | Sidebar de filtros na página de resultados |
| `FiltroPreco` | `FiltroPreco.jsx` | Filtro específico de preço |

### Grupo 3 — Cadastro de Imóvel (interno)
| Componente | Arquivo | Responsabilidade |
|---|---|---|
| `Shell` | interno CadastroImovel | Wrapper de card branco com sombra leve |
| `TitleBlock` | interno CadastroImovel | H2 + subtítulo de cada step |
| `TipCard` | interno CadastroImovel | Card de dicas laterais |
| `ProgressBar` | interno CadastroImovel | Barra de progresso + texto "Etapa X de 6" |
| `FooterNav` | interno CadastroImovel | Botões Voltar/Próximo |
| `CountField` | interno CadastroImovel | Contador +/- para cômodos |
| `RadioOption` | interno CadastroImovel | Radio visual customizado |
| `FeatureToggle` | interno CadastroImovel | Checkbox visual customizado |
| `TextField` | interno CadastroImovel | Input com label e hint |
| `TextAreaField` | interno CadastroImovel | Textarea com label |
| `StepOnePanel` | interno CadastroImovel | Tela Step 1 (tipo, área, cômodos, features) |
| `StepTwoPanel` | interno CadastroImovel | Tela Step 2 (fotos obrigatórias + vídeo) |
| `StepThreePanel` | interno CadastroImovel | Tela Step 3 (endereço + mapa) |
| `StepFourPanel` | interno CadastroImovel | Tela Step 4 (preços e garantias) |
| `StepFivePanel` | interno CadastroImovel | Tela Step 5 (título, descrição, preview) |
| `StepSixPanel` | interno CadastroImovel | Tela Step 6 (revisão e publicação) |

### Grupo 4 — Perfil do Usuário
| Componente | Arquivo | Responsabilidade |
|---|---|---|
| `PerfilSidebar` | `PerfilSidebar.jsx` | Menu lateral de navegação do perfil |
| `PerfilHeader` | `PerfilHeader.jsx` | Cabeçalho do perfil com avatar e nome |
| `PerfilCard` | `PerfilCard.jsx` | Card genérico de seção do perfil |

### Grupo 5 — Ícones de Ação (Header Autenticado)
| Componente | Arquivo | Responsabilidade |
|---|---|---|
| `IconeAnunciar` | `IconeAnunciar.jsx` | Ícone SVG de anúncio |
| `IconeFavorito` | `IconeFavorito.jsx` | Ícone de favorito (coração) |
| `IconeNotificacao` | `IconeNotificacao.jsx` | Ícone de notificação (sino) |
| `IconePerfil` | `IconePerfil.jsx` | Ícone de perfil (usuário) |

### Grupo 6 — Autenticação
| Componente | Arquivo | Responsabilidade |
|---|---|---|
| `MenuLogin` | `MenuLogin.jsx` | Mini-menu de login dentro do CadastroImovel (fora do Layout) |
| `AuthProvider` | `AuthContext` | Context API para estado de autenticação global |

### Regras de reuso
- `CardImovel` é o único componente verdadeiramente reutilizado entre páginas, mas recebe props com schema diferente dependendo da origem (mock do ResultadosPesquisa vs. form do CadastroImovel). **Risco de prop-type inconsistente**.
- Os sub-componentes de `CadastroImovel` (`Shell`, `TipCard`, `TextField` etc.) poderiam ser externalizados para `components/forms/` — hoje estão presos em um arquivo de 1425 linhas.
- `PerfilCard` é genérico e reutilizável, mas só é usado na página `Perfil` — potencial para ser usado nas sub-páginas de perfil também.

---

*Aguardando "Continue" para o BLOCO 2.*
