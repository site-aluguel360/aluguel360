# Aluguel360 — Resumos da Auditoria (Blocos 1 a 4)

---

## BLOCO 1 — Resumo

### `<premissas>`
5 suposições levantadas antes da análise: plataforma B2C2B, auth simulada, aprovação implícita, CEP sem API real, e ambiguidade de role (locatário/proprietário no mesmo usuário).

---

### 1 – Visão Geral do Produto · **7,5/10**
- Diferencial real e implementado: fotos obrigatórias por cômodo + vídeo.
- **Risco crítico**: formulário sem persistência (fechar aba = perder tudo), nenhum fluxo de aprovação na UI, e o link `CardImovel → VisualizarImoveis` está **quebrado** (sem `<Link>`).

### 2 – Auditoria de UX
- **Bom**: multi-step guiado com tips laterais, preview ao vivo, validação de mídia obrigatória dinâmica.
- **Ruim**: validações usam `alert()` nativo; busca no header é decorativa; favoritar é state local (perde ao navegar); step 0 é intro desnecessária; step 6 mostra checklist sempre verde (revisão falsa).

### 3 – Auditoria Visual
- **Bom**: paleta teal consistente, tipografia Poppins + Inter.
- **Ruim**: fontes hardcoded por toda parte (`text-[13px]`), 3 formas diferentes de exibir card de imóvel, `MapPin` como ícone de e-mail no footer, cor do botão "Google" é teal (não é Google).

### 4 – Jornada do Usuário
- **Locatário**: **bloqueio crítico** — `CardImovel` não navega para detalhes do imóvel.
- **Proprietário**: maior ponto de abandono no Step 2 (upload de fotos sem rascunho/progresso); CEP sem autocomplete; pós-publicação sem tela de sucesso.

### 5 – Arquitetura (Componentização)
- 6 grupos mapeados: Layout Global, Imóveis/Anúncios, Cadastro Imóvel (interno), Perfil, Ícones, Auth.
- **Alerta**: `CadastroImovel.jsx` tem **1.425 linhas** — precisa ser dividido. `CardImovel` recebe props com schema inconsistente dependendo da origem.

---

## BLOCO 2 — Resumo

### 6 – Componentização Avançada
- **3 God Files**: `CadastroImovel.jsx` (1.425 linhas), `VisualizarImoveis.jsx` (686 linhas), `PerfilAnunciante.jsx` (431 linhas).
- **2 navbars paralelas**: `SiteHeader.jsx` (oficial) + navbar interna de `VisualizarImoveis` com inline styles — sistemas completamente separados.
- **2 footers, 2 sidebars de perfil, 3 implementações de card de imóvel** — duplicação sistêmica.
- **2 sistemas de estilo**: Tailwind em 90% do projeto vs. objeto `s` de inline styles em `VisualizarImoveis`.
- Proposta de reorganização por diretório por feature.

### 7 – Arquitetura Funcional
- **19 funcionalidades existentes** mapeadas (F01–F19).
- **10 funcionalidades implícitas** (I01–I10): moderação, chat, lookup de CEP, OAuth, favoritos persistentes, etc.
- **10 gaps críticos** (G01–G10): o maior é G01 — `CardImovel` não tem `<Link>` para `VisualizarImoveis`, quebrando o fluxo principal do locatário. G06 = **nenhum componente chama `logout()`**.

### 8 – Regras de Negócio Implícitas
- **17 regras** (RN-001 a RN-017) extraídas do código:
  - `RN-001 a RN-004`: obrigatoriedade de foto por cômodo + vídeo de 1 min.
  - `RN-011`: ciclo de vida do imóvel: rascunho → disponível → anunciado → alugado → inativo.
  - `RN-013`: distinção clara Imóvel vs. Anúncio — um imóvel pode ter múltiplos anúncios históricos.

### 9 – Modelo de Entidades Frontend
- **7 entidades** mapeadas: `Usuario`, `Endereco`, `Imovel`, `Comodo`, `Anuncio`, `Midia`, `Avaliacao`.
- `Anuncio.status` é mais rico que `Imovel.status` — o ciclo de aprovação vive no Anúncio.
- Relacionamentos conceituais definidos para navegação.

### 10 – Estrutura de Dados por Tela
- JSON schema para **8 telas**: Home, ResultadosPesquisa, VisualizarImoveis, CadastroImovel (form state), Perfil, PerfilAnunciante, Login.
- Cada schema documenta campos, tipos e arrays necessários para mockar a API.

---

## BLOCO 3 — Resumo

### 11 – Dataset JSON Mock
- **7 endpoints mockados** prontos para uso no frontend:
  - `GET /imoveis` (lista com filtros), `GET /imoveis/:id` (detalhe completo), `GET /anuncios/:id/avaliacoes`, `GET /usuarios/:id/perfil`, `GET /usuarios/:id/imoveis`, `GET /usuarios/:id/anuncios`, `POST /anuncios` (payload completo do form).

### 12 – Estados do Sistema / UI
- **Anuncio.status**: 7 estados (`rascunho → pendente_aprovacao → ativo → pausado → encerrado → reprovado → alugado`).
- **Imovel.status**: 4 estados com ações por estado.
- Estados por tela: `ResultadosPesquisa` (4 estados), `VisualizarImoveis` (6 estados), `CadastroImovel` (8 estados), `Autenticação` (3 estados), `CardImovel` (4 estados).

### 13 – Fluxos Alternativos
- **8 fluxos** mapeados: abandono do formulário (FA-001), remoção de foto após avançar (FA-002), cômodo duplicado (FA-003), campo obrigatório vazio (FA-004), filtros sem resultado (FA-005), favoritar sem login (FA-006), publicar sem todas as fotos (FA-007), editar anúncio existente (FA-008).

### 14 – Fluxos de Exceção
- **7 cenários de erro** com comportamento esperado da UI: offline, upload de foto falhou, upload de vídeo inválido, CEP com erro, sessão expirada, imóvel não encontrado (404), erro 500 genérico.
- **Diagnóstico crítico**: `CadastroImovel` usa `URL.createObjectURL` local — **nenhum** desses erros de upload pode ser tratado sem implementar upload real.

### 15 – Escalabilidade
- **6 cenários futuros** analisados com tabela de risco:
  - 🟢 Baixo: Sala Comercial, Múltiplas cidades
  - ⚠️ Médio: Venda, Imobiliária/Corretor
  - 🔴 Alto: **Temporada** (calendário + diárias = produto diferente) e **Quartos/Pensão** (quebra o modelo 1:N para 1:N:N)

---

## BLOCO 4 — Resumo Final

### 16 – Design System (Tokens Tailwind)
- **17 tokens** extraídos do `@theme` do `index.css` — paleta bem definida.
- **Bug crítico**: `primary` (#1A535C) e `secondary-hover` (#1A535C) são **o mesmo valor** com dois nomes. `destructive` e `action` também são idênticos — redundância.
- Cores hardcoded em pelo menos 8 variações diferentes pelo projeto (`#2C7E7B` direto, `teal-600` no VisualizarImoveis com valor diferente, etc.).
- Sem escala tipográfica formal — todos os tamanhos são `text-[13px]` hardcoded.
- 4 sistemas de sombra paralelos. Tokens de sombra sugeridos para criar.

### 17 – Consistência Global
- **5 pares de comportamento inconsistente** para a mesma ação (validação, navegação, estilo, card de imóvel, avatar).
- **6 padrões quebrados**: `<Link>` dentro de `<Button>`, `href="#"` em vez de React Router, CadastroImovel fora do Layout com shell conflitante, VisualizarImoveis com navbar própria, App.css com resíduo do template Vite.
- **Typo** em `Perfil.jsx`: "Meu Imóveis" → "Meus Imóveis".

### 18 – Preparação para Dev
- **4 fases** de desenvolvimento com ordem de dependência clara.
- Fase 0 (2 dias): tokens, mocks em arquivos, hooks.
- Fase 1 (3–4 dias): `CardImovel` unificado → `Layout` → `VisualizarImoveis` → `ResultadosPesquisa` → `CadastroImovel`.
- **9 riscos técnicos** mapeados com gravidade e mitigação.

### 19 – Pontos Críticos
- **5 Críticos** (C01–C05), **8 Altos** (A01–A08), **10 Médios** (M01–M10), **9 Baixos** (B01–B09).
- Total: **32 pontos de melhoria** catalogados e priorizados.

### 20 – Relatório Executivo

| Dimensão | Nota |
|---|---|
| Produto | **7,5 / 10** |
| UX | **6,0 / 10** |
| UI | **6,5 / 10** |
| Arquitetura Frontend | **5,5 / 10** |
| Consistência | **5,0 / 10** |

> **Veredicto**: ❌ **Não autorizo** o desenvolvimento com a estrutura atual.
> ✅ **Autorizo** após os 10 itens obrigatórios do Checklist Fase 0 — especialmente C01 (link do card quebrado), C02 (VisualizarImoveis fora do Layout) e M07 (PrivateRoute ausente).

---

### Checklist de Liberação — Fase 0 (obrigatório antes do primeiro commit real)

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
