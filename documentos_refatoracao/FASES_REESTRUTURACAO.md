# FASES DA REESTRUTURACAO - Aluguel360

> **Fonte de verdade**: Auditorias auditoria_bloco1.md, auditoria_bloco2.md, auditoria_bloco3.md e auditoria_bloco4_final.md.
> **Roadmap de referencia**: ROADMAP_REESTRUTURACAO.md
> **Data de elaboracao**: 2026-07-02
> **Regra geral de sequencia**: Nenhuma fase pode iniciar antes que todos os criterios de conclusao da fase anterior estejam satisfeitos.

---

## Indice de Fases

| ID | Nome | Dependencias |
|---|---|---|
| FASE-0 | Limpeza e Fundacao | Nenhuma |
| FASE-1 | Design System e Tokens | FASE-0 |
| FASE-2 | Camada de Dados Mock e CardImovel | FASE-1 |
| FASE-3 | Integracao do Layout Global (VisualizarImoveis) | FASE-2 |
| FASE-4 | ResultadosPesquisa Funcional | FASE-2 |
| FASE-5 | Decomposicao do CadastroImovel | FASE-1 |
| FASE-6 | Autenticacao, Perfil e Roteamento | FASE-5 |
| FASE-7 | Funcionalidades Transversais | FASE-3, FASE-4, FASE-6 |
| FASE-8 | Polimento e Conformidade | FASE-7 |

---

## Diagrama de Dependencias

```
FASE-0 (Limpeza e Fundacao)
  +-- FASE-1 (Design System e Tokens)
        +-- FASE-2 (Camada de Dados Mock e CardImovel)
        |     +-- FASE-3 (VisualizarImoveis Integrada ao Layout)
        |     +-- FASE-4 (ResultadosPesquisa Funcional)
        +-- FASE-5 (Decomposicao do CadastroImovel)
              +-- FASE-6 (Autenticacao, Perfil e Roteamento)
                    +-- FASE-7 (Funcionalidades Transversais)
                          +-- FASE-8 (Polimento e Conformidade)
```

**Nota de paralelismo**: FASE-3 e FASE-4 podem ser executadas em paralelo (ambas dependem apenas de FASE-2). FASE-5 pode ser executada em paralelo com FASE-3 e FASE-4 (depende apenas de FASE-1). FASE-6 aguarda FASE-5. FASE-7 aguarda a conclusao de FASE-3, FASE-4 e FASE-6.

---

## FASE-0 - Limpeza e Fundacao

### Objetivo

Remover todos os residuos do template Vite, centralizar todos os dados mock em uma camada dedicada (`src/lib/mock/`) e confirmar que os tokens base do `@theme` do `index.css` existem. Garantir que o projeto parte de uma base limpa, sem codigo-lixo e sem dados espalhados por componentes JSX.

### Justificativa

A auditoria identificou (Bloco 4, Secao 17) que o `App.css` contem classes residuais do template Vite (`.counter`, `.hero`, `.vite`, `#center`, `#next-steps`) que nunca foram removidas. Alem disso, dados mock estao hardcoded dentro de componentes JSX (`Perfil.jsx`, `PerfilAnunciante.jsx`, `ResultadosPesquisa.jsx`, `VisualizarImoveis.jsx`, `Home.jsx`), tornando impossivel substitui-los por dados reais sem reescrever os componentes. Qualquer fase subsequente que altere esses componentes tera que lidar com dados embutidos, aumentando o risco de regressao.

### Problemas Resolvidos

| ID Auditoria | Problema |
|---|---|
| M05 | `App.css` com residuos do template Vite |
| Bloco 4 Par.18 | Dados mock hardcoded dentro dos componentes JSX |
| Bloco 2 Par.7 | Impossibilidade de substituir mocks por dados reais |
| LAC-03 | PerfilQualidade.jsx - dependencias de dados nao auditadas em detalhe |

### Pre-requisitos

- Nenhum. Esta e a fase inicial do processo.
- Acesso de leitura e escrita a pasta `src/`.

### Entregaveis

1. `App.css` deletado permanentemente (sem imports remanescentes).
2. Diretorio `src/lib/mock/` criado com os seguintes arquivos JSON populados com dados extraidos dos componentes:
   - `imoveis.json`
   - `anuncios.json`
   - `avaliacoes.json`
   - `usuarios.json`
   - `perfil.json`
3. Diretorio `src/lib/hooks/` criado (vazio ou com placeholder - sera populado na FASE-2).
4. Componentes JSX com dados mock removidos e substituidos por importacao dos arquivos JSON:
   - `Perfil.jsx`
   - `PerfilAnunciante.jsx`
   - `ResultadosPesquisa.jsx`
   - `VisualizarImoveis.jsx`
   - `Home.jsx`
5. `index.css` - confirmacao de que os tokens base do `@theme` existem (sem adicao de novos tokens - isso e FASE-1).

### Riscos

| Risco | Probabilidade | Impacto | Mitigacao |
|---|---|---|---|
| Remover dado mock nao documentado nas auditorias | Medio | Medio - componente para de renderizar | Ler cada componente antes de extrair. Documentar LAC-03 e LAC-04 antes de iniciar. |
| Estrutura do JSON mock diferente do que o componente espera | Baixo | Baixo - renderizacao incorreta | Usar os schemas dos Blocos 2 e 3 como referencia. Manter props identicas. |
| `App.css` sendo importado em lugar nao identificado | Baixo | Baixo - perda de estilo residual | Verificar todos os `import './App.css'` antes de deletar. |

### Criterios de Conclusao

- [ ] `App.css` inexistente no projeto (arquivo deletado, sem imports remanescentes).
- [ ] `src/lib/mock/imoveis.json` existe e contem os campos do schema `GET /imoveis` (Bloco 3, Secao 11).
- [ ] `src/lib/mock/anuncios.json` existe e contem os campos do schema `GET /usuarios/:id/anuncios` (Bloco 3, Secao 11).
- [ ] `src/lib/mock/avaliacoes.json` existe e contem os campos do schema `GET /anuncios/:id/avaliacoes` (Bloco 3, Secao 11).
- [ ] `src/lib/mock/usuarios.json` existe e contem os campos do schema `GET /usuarios/:id/perfil` (Bloco 3, Secao 11).
- [ ] `src/lib/mock/perfil.json` existe e contem o resumo do perfil do usuario.
- [ ] Nenhum dos 5 componentes listados contem objetos ou arrays de dados mock definidos inline no corpo JSX.
- [ ] Todos os componentes afetados continuam renderizando corretamente apos a mudanca (inspecao visual).
- [ ] `index.css` possui `@theme` com tokens de cor `primary`, `secondary`, `background`, `foreground`, `card`, `muted`, `accent`, `destructive`, `border`, `ring` - confirmados sem adicao.

---

## FASE-1 - Design System e Tokens

### Objetivo

Formalizar e unificar o sistema de design no `@theme` do `index.css`, adicionando tokens de tipografia, sombra, radius e a cor ausente `teal-light`. Migrar sistematicamente todas as cores hardcoded dos componentes identificados para tokens. Resolver a duplicidade de tokens (`primary` e `secondary-hover` com o mesmo valor; `destructive` e `action` com o mesmo valor).

### Justificativa

A auditoria identificou (Bloco 4, Secao 16 e 17) tres sistemas visuais paralelos: Tailwind CSS, inline styles e shadcn manual. O maior obstaculo para unificacao e a ausencia de tokens formais de tipografia, sombra e radius, o que faz com que cada componente use valores arbitrarios (`text-[13px]`, `rounded-[9px]`, sombras inline). Enquanto esses tokens nao existirem, qualquer componente novo introduzira inconsistencias. Esta fase precede todas as fases de criacao e modificacao de componentes.

### Problemas Resolvidos

| ID Auditoria | Problema |
|---|---|
| Bloco 4 Par.16 | `primary` e `secondary-hover` com mesmo valor - token duplicado |
| Bloco 4 Par.16 | `destructive` e `action` com mesmo valor - token redundante |
| Bloco 4 Par.16 | Cor `#4ECDC4` sem token correspondente |
| Bloco 4 Par.16 | Escala tipografica sem tokens formais - valores hardcoded em cada componente |
| Bloco 4 Par.16 | Quatro sistemas de sombra diferentes - nenhum token definido |
| Bloco 4 Par.16 | `radius` inconsistente sem padrao |
| M03 | Cores hardcoded por todo o projeto |
| M04 | Escala tipografica sem tokens formais |
| LAC-06 | Tokens CSS propostos podem conflitar com nomes nativos do Tailwind |
| LAC-07 | `secondary-hover` com mesmo valor que `primary` - usos a mapear antes de remover |

### Pre-requisitos

- FASE-0 concluida: `App.css` deletado, mocks em `src/lib/mock/`, componentes sem dados inline.
- Levantamento previo de todos os usos de `secondary-hover` (LAC-07) para garantir que a remocao nao quebre nenhuma classe referenciada.
- Levantamento previo de todos os usos de `action` para confirmar que `destructive` cobre os mesmos casos de uso.

### Entregaveis

1. `index.css` atualizado com os seguintes tokens adicionados ao `@theme`:
   - Cor faltante: `--color-teal-light: #4ECDC4`
   - Escala tipografica: `--font-size-xs` a `--font-size-2xl` (nomes sem conflito com Tailwind nativo)
   - Tokens de sombra: `--shadow-card`, `--shadow-header`, `--shadow-popup`
   - Tokens de radius: `--radius-xs` a `--radius-2xl`
   - Tokens duplicados resolvidos: `secondary-hover` unificado com `primary`; `action` removido ou redirecionado para `destructive`
2. Componentes com cores hardcoded migradas para tokens:
   - `SiteHeader.jsx` - `#1A535C` para `primary`; `#F0F4F8` para `accent`
   - `Login.jsx` - `#4ECDC4` para `teal-light`; `#1A535C` para `primary`
   - `CadastroImovel.jsx` - `#2C7E7B` para `secondary`; `#9c9c9c` para token neutro adequado
   - `PerfilQualidade.jsx` - `#2C7E7B` para `secondary`
   - `PerfilMeusImoveis.jsx` - `#1A535C` para `primary`; `#F0F4F8` para `accent`; `#D8E1E7` para `border`
   - `PerfilMeusAnuncios.jsx` - `#4ECDC4` para `teal-light`; `#D8E1E7` para `border`
   - `VisualizarImoveis.jsx` - apenas tokens de cor, **sem alterar inline styles** (isso e FASE-3)

### Riscos

| Risco | Probabilidade | Impacto | Mitigacao |
|---|---|---|---|
| Token CSS com nome conflitante com classe utilitaria nativa do Tailwind | Medio | Alto - comportamento CSS inesperado | Usar prefixo `--font-size-` em vez de `--text-` (LAC-06) |
| Remover `secondary-hover` sem identificar todos os usos | Medio | Medio - perda de estilo de hover | Mapear todos os usos com busca global antes de remover (LAC-07) |
| Cor `#9c9c9c` sem correspondencia exata nos tokens existentes | Baixo | Baixo | Criar `--color-neutral` se necessario |
| Alterar cores em VisualizarImoveis.jsx antes da FASE-3 causar inconsistencia visual temporaria | Baixo | Baixo | Documentar que o arquivo esta em estado transitorio |

### Criterios de Conclusao

- [ ] `index.css` contem tokens de tipografia (`--font-size-xs` a `--font-size-2xl`) no `@theme`.
- [ ] `index.css` contem tokens de sombra (`--shadow-card`, `--shadow-header`, `--shadow-popup`) no `@theme`.
- [ ] `index.css` contem tokens de radius (`--radius-xs` a `--radius-2xl`) no `@theme`.
- [ ] `index.css` contem `--color-teal-light: #4ECDC4` no `@theme`.
- [ ] Nenhum componente listado nos entregaveis contem os valores hardcoded `#1A535C`, `#2C7E7B`, `#4ECDC4`, `#F0F4F8`, `#D8E1E7`, `#9c9c9c`, `#2D2D2D` diretamente no JSX (busca global confirmada).
- [ ] `secondary-hover` unificado com `primary` - sem duplicidade de valor no `@theme`.
- [ ] `action` removido ou redirecionado - sem duplicidade de valor com `destructive` no `@theme`.
- [ ] Todos os componentes alterados continuam renderizando visualmente identicos ao estado anterior.
- [ ] `SiteHeader.jsx` usa apenas tokens Tailwind para cores (zero hardcoded).

---

## FASE-2 - Camada de Dados Mock e CardImovel

### Objetivo

Criar os hooks de acesso aos dados mock (`useImoveis.js`, `useAuth.js`). Unificar as tres implementacoes diferentes de card de imovel em um unico componente `CardImovel` com variantes (`compact`, `default`, `detailed`). Adicionar o `<Link>` ausente que navega do card para `VisualizarImoveis`.

### Justificativa

A auditoria identificou (Bloco 2, Secao 6 e Bloco 4, Secao 19) tres implementacoes visuais diferentes para o mesmo conceito de card de imovel. O `CardImovel` e o componente mais reutilizado do projeto. O `<Link>` ausente (C01) e um bloqueio critico que impede o fluxo completo do locatario. Os hooks `useImoveis` e `useAuth` sao necessarios para que as fases seguintes consumam dados de forma consistente.

### Problemas Resolvidos

| ID Auditoria | Problema |
|---|---|
| C01 | `CardImovel` nao navega para `VisualizarImoveis` |
| M01 | 3 implementacoes diferentes de card de imovel |
| Bloco 4 Par.18 | `useImoveis.js` e `useAuth.js` ausentes como wrappers dos mocks |
| Bloco 2 Par.6 | `CardImovel` recebe props com schema diferente dependendo da origem |

### Pre-requisitos

- FASE-1 concluida: tokens do `@theme` formalizados (o CardImovel unificado deve usar exclusivamente tokens).
- `src/lib/mock/imoveis.json` populado (FASE-0).

### Entregaveis

1. `src/lib/hooks/useImoveis.js` - hook que le de `src/lib/mock/imoveis.json` e expoe funcoes `getImoveis()`, `getImovelById(id)`.
2. `src/lib/hooks/useAuth.js` - hook que le do `AuthContext` e expoe estado de autenticacao padronizado.
3. `CardImovel.jsx` - componente unificado com:
   - Variante `compact` (uso na Home)
   - Variante `default` (uso em ResultadosPesquisa)
   - Variante `detailed` (substitui `CardRelacionado` em VisualizarImoveis)
   - `<Link to="/visualizar-imoveis/:id">` wrapping o card (corrige C01)
   - Schema de props unificado baseado no modelo `Imovel` definido no Bloco 2, Secao 9
   - Uso exclusivo de tokens Tailwind do `@theme`
   - Estados: `default`, `hovered`, `loading_image` (Bloco 3, Secao 12)
4. `Home.jsx` atualizado para usar `CardImovel` com `variant="compact"`.
5. `ResultadosPesquisa.jsx` atualizado para usar o `CardImovel` unificado.
6. Rota em `App.jsx` ou `router.jsx` atualizada para `/visualizar-imoveis/:id`.

### Riscos

| Risco | Probabilidade | Impacto | Mitigacao |
|---|---|---|---|
| Schema unificado incompativel com dados de algum dos 3 contextos | Medio | Alto | Mapear todos os campos usados nas 3 versoes antes de definir o schema unificado |
| Variante `compact` diferente visualmente do card que existia na Home | Medio | Medio | Manter estrutura visual equivalente; alterar apenas o mecanismo interno |
| `CardRelacionado` usa campos diferentes dos mocks centralizados | Medio | Medio | Conferir campos exatos em VisualizarImoveis antes de criar variante `detailed` (LAC-04) |
| Adicionar `<Link>` no card quebra contexto onde card e renderizado sem ID | Baixo | Baixo | Tornar o `to` condicional: se `id` undefined, renderizar sem Link |

### Criterios de Conclusao

- [ ] `src/lib/hooks/useImoveis.js` existe e importa de `src/lib/mock/imoveis.json`.
- [ ] `src/lib/hooks/useAuth.js` existe e consome `AuthContext`.
- [ ] `CardImovel.jsx` possui as tres variantes `compact`, `default`, `detailed` ativas.
- [ ] `CardImovel.jsx` contem `<Link>` para `/visualizar-imoveis/${id}` em todas as variantes.
- [ ] `CardImovel.jsx` nao contem valores de cor hardcoded.
- [ ] `Home.jsx` nao contem mais `<Card>` shadcn manual para exibicao de imoveis.
- [ ] `ResultadosPesquisa.jsx` usa `CardImovel` unificado.
- [ ] Rota `/visualizar-imoveis/:id` configurada no router.
- [ ] Clicar em um card em ResultadosPesquisa navega para a URL `/visualizar-imoveis/{id}` (validacao manual).
- [ ] As 3 antigas implementacoes de card substituidas ou atualizadas - nenhuma versao orfa remanescente.

---

## FASE-3 - Integracao do Layout Global (VisualizarImoveis)

### Objetivo

Remover a navbar e o footer inline de `VisualizarImoveis.jsx`, integrar a pagina ao `<Layout>` global e reescrever todo o arquivo utilizando Tailwind CSS no lugar dos inline styles (objeto `s`). Implementar `useParams()` para carregar dados do imovel pelo ID da rota. Implementar os estados de UI documentados para essa tela.

### Justificativa

A auditoria classificou este problema como o maior risco arquitetural do projeto (Bloco 4, Secao 20): `VisualizarImoveis` e uma ilha isolada com seu proprio sistema visual (inline styles objeto `s`), propria navbar estatica e proprio footer. Consequencias: usuario autenticado ve navbar de guest, impossivel aplicar tokens de design, responsividade inconsistente.

### Problemas Resolvidos

| ID Auditoria | Problema |
|---|---|
| C02 | `VisualizarImoveis` tem navbar/footer proprios fora do Layout |
| M06 | `VisualizarImoveis` usa inline styles em tudo |
| M08 | `VisualizarImoveis` sem parametro de rota `:id` |
| Bloco 2 Par.6 | Dois sistemas de navbar e dois sistemas de footer |
| Bloco 4 Par.17 | `href="#"` em todos os links de navegacao da pagina |
| Bloco 3 Par.12 | Estados de UI da tela nao implementados (`loading`, `not_found`, etc.) |

### Pre-requisitos

- FASE-2 concluida: `CardImovel` com variante `detailed` disponivel; rota com `:id` configurada; `useImoveis.js` disponivel.
- FASE-1 concluida: tokens de `@theme` disponiveis para substituir inline styles.
- Leitura completa do arquivo `VisualizarImoveis.jsx` atual para mapear todos os sub-componentes inline (LAC-04).

### Entregaveis

1. `src/pages/VisualizarImoveis/index.jsx` - nova estrutura:
   - Sem navbar propria (usa `SiteHeader` do `<Layout>` global)
   - Sem footer proprio (usa footer do `<Layout>` global)
   - Zero inline styles - 100% Tailwind com tokens do `@theme`
   - `useParams('id')` para obter o ID da rota
   - `useImoveis.js` para carregar o imovel pelo ID
   - `CardImovel` com `variant="detailed"` para imoveis relacionados
   - Estado `loading` (skeleton)
   - Estado `not_found` (mensagem contextual com botoes de acao)
   - Estado `video_open` (modal de video)
   - Estado `contact_sent` (feedback apos envio)
   - Estado `favorited` (placeholder via FavoritosContext ate FASE-6)
2. Navbar inline de `VisualizarImoveis` deletada permanentemente.
3. Footer inline de `VisualizarImoveis` deletado permanentemente.
4. Objeto `s` de inline styles deletado permanentemente.
5. `href="#"` substituidos por `<Link>` do React Router.
6. Rota `/visualizar-imoveis/:id` confirmada como envolta em `<Layout>` no `App.jsx`.

### Riscos

| Risco | Probabilidade | Impacto | Mitigacao |
|---|---|---|---|
| Sub-componentes inline de VisualizarImoveis nao mapeados nas auditorias (LAC-04) | Alta | Alto | Ler arquivo original completo antes de iniciar; documentar todos os sub-componentes encontrados |
| Reescrita com Tailwind alterando layout visual significativamente | Alto | Medio | Manter estrutura de secoes identica; alterar apenas mecanismo de estilo |
| `useParams` com ID invalido sem tratamento de not_found quebrando o render | Medio | Medio | Implementar estado `not_found` obrigatoriamente |
| Integracao ao Layout global alterando dimensoes disponiveis | Baixo | Baixo | Ajustar responsividade apos integracao |

### Criterios de Conclusao

- [ ] `VisualizarImoveis` nao contem nenhum elemento `<nav>` proprio.
- [ ] `VisualizarImoveis` nao contem nenhum elemento `<footer>` proprio.
- [ ] O objeto `s` (de inline styles) inexiste no arquivo.
- [ ] Nenhum `style={{...}}` presente no JSX do componente.
- [ ] `useParams` e utilizado para obter o `id` da rota.
- [ ] Pagina renderiza corretamente quando acessada via `/visualizar-imoveis/imovel-001`.
- [ ] Pagina exibe conteudo de fallback adequado quando acessada com ID inexistente.
- [ ] Todos os links de navegacao internas usam `<Link>` do React Router (zero `href="#"`).
- [ ] O `SiteHeader` do Layout exibe corretamente na pagina (inclusive estado autenticado vs. guest).
- [ ] O footer do Layout exibe corretamente na pagina.
- [ ] Imoveis relacionados usam `CardImovel` com `variant="detailed"`.

---

## FASE-4 - ResultadosPesquisa Funcional

### Objetivo

Transformar os filtros decorativos de `ResultadosPesquisa` em filtros funcionais com estado React. Implementar a busca do header conectada ao React Router. Implementar os estados de UI da tela de resultados (`loading`, `success`, `empty`, `error`).

### Justificativa

A auditoria identificou (Bloco 2, Secao 7, G04) que os filtros sao completamente estaticos. O input de busca do header nao tem `onSubmit` conectado (Bloco 1, Secao 2). Isso compromete a jornada do locatario desde a entrada na tela de resultados. O estado `empty` tambem nao existe, fazendo com que o usuario veja um grid vazio sem explicacao.

### Problemas Resolvidos

| ID Auditoria | Problema |
|---|---|
| G04 | Filtros em ResultadosPesquisa nao filtram nada |
| A02 | Search bar do header e decorativa |
| A03 | Filtros em ResultadosPesquisa nao tem estado |
| Bloco 3 Par.12 | Estados de UI `loading`, `empty`, `error` nao implementados |
| G03 | Paginacao ausente (tratamento inicial com lista estatica completa) |

### Pre-requisitos

- FASE-2 concluida: `CardImovel` unificado disponivel; `useImoveis.js` disponivel; rota com `:id` configurada.
- `src/lib/mock/imoveis.json` populado com campos suficientes para filtrar por tipo, preco, quartos.

### Entregaveis

1. `ResultadosPesquisa.jsx` atualizado:
   - `useState` para cada filtro ativo (`tipo`, `precoMin`, `precoMax`, `quartos`)
   - Logica de filtragem aplicada sobre o array de imoveis do mock
   - Estado `loading` com skeleton cards (3-6)
   - Estado `empty`: texto "Nenhum imovel encontrado" + botao "Limpar filtros"
   - Estado `error`: banner de erro + botao "Tentar novamente"
   - Leitura de parametros de URL (`useSearchParams`) para inicializar filtros com query string
2. `BarraFiltros.jsx` conectada ao estado de filtros de `ResultadosPesquisa`.
3. `FiltroLateral.jsx` conectado ao estado de filtros de `ResultadosPesquisa`.
4. `FiltroPreco.jsx` conectado ao estado de filtro de preco.
5. `SiteHeader.jsx` atualizado: input de busca com `onSubmit` navegando para `/resultados?q={termo}`.
6. `Home.jsx` filtros de categoria: clicar navega para `/resultados?tipo={categoria}`.

### Riscos

| Risco | Probabilidade | Impacto | Mitigacao |
|---|---|---|---|
| `BarraFiltros`, `FiltroLateral` e `FiltroPreco` com estado interno nao controlado | Medio | Medio | Verificar a API atual de cada componente antes de conectar |
| Filtro de preco com formato string no mock vs numero no filtro | Baixo | Baixo | Garantir que os valores no JSON mock sao numericos |
| SiteHeader com busca funcional conflitando com navegacao por teclado | Baixo | Baixo | Testar submissao por Enter e por botao |

### Criterios de Conclusao

- [ ] Selecionar filtro de tipo exibe apenas imoveis daquele tipo.
- [ ] Alterar filtro de preco exibe apenas imoveis dentro do intervalo.
- [ ] Com filtros que retornam 0 resultados, o estado `empty` e exibido.
- [ ] Botao "Limpar filtros" reseta todos os filtros e exibe lista completa.
- [ ] Digitar termo no input do header e pressionar Enter navega para `/resultados?q={termo}`.
- [ ] A URL de resultados reflete os filtros aplicados como query params.
- [ ] `BarraFiltros`, `FiltroLateral` e `FiltroPreco` respondem aos filtros sem reload.
- [ ] Filtros da Home navegam para `/resultados?tipo={categoria}`.
- [ ] Estado `loading` (skeleton) e exibido durante carregamento simulado.

---

## FASE-5 - Decomposicao do CadastroImovel

### Objetivo

Dividir o God File `CadastroImovel.jsx` (1.425 linhas) em um diretorio `CadastroImovel/` com `index.jsx` (orquestrador) e `Step1.jsx` a `Step6.jsx`. Externalizar sub-componentes de formulario para `src/components/forms/`. Implementar persistencia de rascunho em `localStorage`. Corrigir o checklist estatico do Step 6 para refletir o estado real do formulario.

### Justificativa

A auditoria classificou `CadastroImovel.jsx` como o segundo maior risco tecnico do projeto (Bloco 4, Secao 18, risco critico). Um arquivo de 1.425 linhas impossibilita manutencao sem risco de regressao. O Step 6 apresenta checklist sempre verde (C04) - revisao enganosa. A ausencia de rascunho (C03) e o principal ponto de abandono do fluxo do proprietario (Bloco 1, Secao 4).

### Problemas Resolvidos

| ID Auditoria | Problema |
|---|---|
| C03 | Formulario sem persistencia - abandono perde tudo |
| C04 | Step 6 com checklist estatico sempre verde |
| M02 | `CadastroImovel.jsx` com 1.425 linhas (God File) |
| Bloco 2 Par.6 | Sub-componentes de CadastroImovel presos num unico arquivo |
| FA-001 | Usuario abandona CadastroImovel no meio |
| FA-002 | Usuario remove foto apos avancar de step |
| RN-007 | Logica de comodos padrao vs. customizados deve ser preservada |
| B07 | `useMemo` ausente em `getRequiredPhotoSlots` |

### Pre-requisitos

- FASE-1 concluida: tokens do `@theme` disponiveis para uso nos novos arquivos.
- FASE-0 concluida: dados mock ja fora dos componentes.
- Leitura completa de `CadastroImovel.jsx` para mapear todos os sub-componentes internos e a logica do `initialForm`, `goNext`, `goBack`, `getRequiredPhotoSlots`, `DEFAULT_ROOM_IDS` antes de iniciar.

### Entregaveis

1. Diretorio `src/pages/CadastroImovel/` criado.
2. `src/pages/CadastroImovel/index.jsx`:
   - Estado global do formulario (`form`, `setForm`)
   - Logica de navegacao entre steps (`step`, `goNext`, `goBack`)
   - Validacoes de avanco de step
   - Persistencia em `localStorage`: salvar form a cada mudanca via `useEffect`; recuperar ao montar
   - `getRequiredPhotoSlots` com `useMemo`
   - Logica `DEFAULT_ROOM_IDS`
3. `Step1.jsx` a `Step6.jsx` como arquivos separados, recebendo `form` e `setForm` via props.
4. `Step6.jsx` com checklist derivado do `form` state real - cada item verifica campo ou slot especifico; botao "Publicar" desabilitado se slots obrigatorios vazios.
5. Componentes externalizados para `src/components/forms/`:
   - `Shell.jsx`, `TipCard.jsx`, `TextField.jsx`, `TextAreaField.jsx`, `CountField.jsx`, `RadioOption.jsx`, `FeatureToggle.jsx`
6. `MenuLogin.jsx` - decisao de manter ou internalizar confirmada e executada (LAC-02).

### Riscos

| Risco | Probabilidade | Impacto | Mitigacao |
|---|---|---|---|
| Logica de estado distribuida entre Steps causar prop drilling excessivo | Alto | Medio | Usar Context interno do CadastroImovel se necessario |
| `localStorage` com dados de rascunho de sessao anterior com schema diferente | Medio | Baixo | Versionar a chave do localStorage (ex: `cadastro_imovel_v1`) |
| `getRequiredPhotoSlots` com `useMemo` com dependencias incorretas | Medio | Baixo | Listar explicitamente todas as dependencias no array de deps |
| Step 6 checklist derivado nao cobrindo todos os campos obrigatorios | Medio | Medio | Mapear todos os campos obrigatorios de cada step antes de implementar |

### Criterios de Conclusao

- [ ] `CadastroImovel.jsx` original inexistente ou substituido pelo diretorio `CadastroImovel/`.
- [ ] `src/pages/CadastroImovel/index.jsx` existe e orquestra todos os steps.
- [ ] `Step1.jsx` a `Step6.jsx` existem como arquivos separados.
- [ ] `src/components/forms/` contem todos os 7 sub-componentes listados.
- [ ] Preencher formulario ate Step 2, fechar e reabrir o browser - dados sao recuperados do `localStorage`.
- [ ] Step 6 exibe status real de cada campo (preenchido / faltando).
- [ ] Botao "Publicar" fica desabilitado quando ha fotos obrigatorias faltando.
- [ ] `getRequiredPhotoSlots` esta envolvido em `useMemo`.
- [ ] Logica de `DEFAULT_ROOM_IDS` e comodos customizaveis preservada e funcionando.
- [ ] Fluxo completo do CadastroImovel (Step 0 ao Step 6) funciona sem erros de console.

---

## FASE-6 - Autenticacao, Perfil e Roteamento

### Objetivo

Implementar o `PrivateRoute` para protecao de rotas autenticadas. Conectar o botao de logout ao `AuthContext`. Criar o `FavoritosContext` com verificacao de autenticacao antes de favoritar. Migrar `PerfilAnunciante` da navegacao por state local para rotas reais do React Router.

### Justificativa

A auditoria identificou (Bloco 2, Secao 7, G06) que nenhum componente chama `logout()`. O `PerfilAnunciante` usa `useState("perfil")` para simular navegacao (Bloco 2, Secao 6), o que impede deep linking, botao voltar do browser e protecao de rotas. O `FavoritosContext` e necessario para que o favorito persista entre navegacoes e exija autenticacao (C05, A04, A05).

### Problemas Resolvidos

| ID Auditoria | Problema |
|---|---|
| C05 | Nenhum componente chama `logout()` |
| A04 | Favoritar sem autenticacao e sem persistencia |
| A05 | `PerfilAnunciante` usa navegacao por state local |
| M07 | Sem protecao de rota autenticada |
| Bloco 2 Par.6 | Duas sidebars de perfil paralelas |
| G06 | Logout ausente na UI |
| FA-006 | Usuario tenta favoritar sem estar logado |

### Pre-requisitos

- FASE-5 concluida: `CadastroImovel` dividido em Steps - `PrivateRoute` pode referenciar as rotas do diretorio.
- `App.jsx` e rotas lidos antes do inicio (LAC-05).
- `AuthContext.jsx` lido - confirmar que `logout()` existe e que `isAuthenticated` e acessivel globalmente.

### Entregaveis

1. `src/router/PrivateRoute.jsx` - verifica `isAuthenticated`; se falso, redireciona para `/login` com estado `{ from: location }`.
2. `App.jsx` atualizado - rotas de perfil e `/perfil/cadastro-imovel` envoltas em `<PrivateRoute>`.
3. `AuthContext.jsx` - `logout()` implementado (reseta estado; limpa localStorage se aplicavel).
4. `PerfilSidebar.jsx` - botao Logout adicionado, chama `logout()`.
5. `PerfilAnunciante.jsx` - navegacao migrada de `useState` para subrotas reais; `SidebarPerfil` interna substituida por `PerfilSidebar` oficial.
6. `src/context/FavoritosContext.jsx`:
   - Lista de IDs favoritados em `localStorage`
   - `toggleFavorito(id)` com verificacao de `isAuthenticated`
   - Se nao autenticado: exibir feedback de login (placeholder toast ate FASE-7)
7. `CardImovel.jsx` atualizado - icone de favorito integrado ao `FavoritosContext`.
8. `VisualizarImoveis/index.jsx` atualizado - icone de favorito integrado ao `FavoritosContext`.

### Riscos

| Risco | Probabilidade | Impacto | Mitigacao |
|---|---|---|---|
| `PrivateRoute` redirecionando usuario autenticado por bug no `AuthContext` | Medio | Alto | Testar com usuario autenticado e nao-autenticado antes de fechar a fase |
| Migracao de `PerfilAnunciante` para React Router quebrando navegacao interna | Alto | Medio | Mapear todas as secoes e criar subrotas equivalentes antes de remover o state local |
| Estrutura atual de `App.jsx` nao auditada (LAC-05) diferente da esperada | Medio | Medio | Ler `App.jsx` antes de iniciar a fase |

### Criterios de Conclusao

- [ ] Acessar `/perfil` sem autenticacao redireciona para `/login`.
- [ ] Acessar `/perfil/cadastro-imovel` sem autenticacao redireciona para `/login`.
- [ ] Botao de Logout existe em `PerfilSidebar` e ao clicar, o usuario e desautenticado e redirecionado.
- [ ] `PerfilAnunciante` usa `<PerfilSidebar>` oficial (nao `SidebarPerfil` interna).
- [ ] Cada secao do `PerfilAnunciante` tem URL propria e e acessivel via deep link.
- [ ] Favoritar um imovel quando autenticado persiste o estado entre navegacoes.
- [ ] Favoritar um imovel quando nao autenticado exibe mensagem de login.
- [ ] Icone de coracao do `CardImovel` reflete estado do `FavoritosContext`.

---

## FASE-7 - Funcionalidades Transversais

### Objetivo

Substituir todos os `alert()` nativos pelo sistema de toast (sonner). Criar a tela de sucesso pos-publicacao. Criar a pagina 404. Implementar os fluxos alternativos FA-001 a FA-004. Integrar o lookup de CEP via ViaCEP no Step 3.

### Justificativa

A auditoria documentou (Bloco 3, Secoes 13 e 14) os fluxos alternativos e de excecao necessarios para uso real. O `alert()` nativo foi classificado como degradacao de UX de 2008 (Bloco 1, Secao 2). A tela de sucesso pos-publicacao (A07) e o terceiro ponto de abandono critico (Bloco 1, Secao 4). A falta da pagina 404 (G09) cria experiencia quebrada para qualquer URL invalida.

### Problemas Resolvidos

| ID Auditoria | Problema |
|---|---|
| A01 | Validacoes usam `alert()` nativo |
| A06 | CEP sem lookup automatico |
| A07 | Sem tela de sucesso apos publicar anuncio |
| B06 | Sem pagina 404 |
| FA-001 | Abandono do CadastroImovel sem salvar |
| FA-002 | Remocao de foto apos avancar de step |
| FA-003 | Comodo duplicado com `alert()` |
| FA-004 | Campo obrigatorio sem feedback inline |
| FE-004 | Erro de busca de CEP sem tratamento |

### Pre-requisitos

- FASE-3 concluida: `VisualizarImoveis` integrada ao Layout.
- FASE-4 concluida: `ResultadosPesquisa` funcional.
- FASE-6 concluida: `AuthContext` estavel.
- Decisao de arquitetura sobre a tela de sucesso confirmada antes de iniciar.

### Entregaveis

1. `src/components/feedback/ToastProvider.jsx` - wrapper do `sonner` integrado no `main.jsx` ou `App.jsx`.
2. Todos os `alert()` nos Steps do CadastroImovel substituidos por `toast.error()` com mensagem inline no campo.
3. Tela de confirmacao pos-publicacao (rota a definir conforme decisao de arquitetura).
4. `src/pages/NotFound.jsx` - com botoes "Buscar imoveis" e "Voltar ao inicio".
5. `App.jsx` - rota `*` apontando para `NotFound`.
6. `CadastroImovel/index.jsx` - FA-001: deteccao de saida + banner "Voce tem um rascunho salvo".
7. `CadastroImovel/Step2.jsx` - FA-002: remover foto obrigatoria desabilita "Publicar" e atualiza checklist.
8. `CadastroImovel/Step1.jsx` - FA-003: erro inline ao adicionar comodo duplicado.
9. `CadastroImovel/Step3.jsx`:
   - FA-004: scroll ate campo invalido + borda vermelha + mensagem inline
   - ViaCEP: `fetch` no `onBlur` do campo CEP com tratamento de erros (FE-004)

### Riscos

| Risco | Probabilidade | Impacto | Mitigacao |
|---|---|---|---|
| ViaCEP API CORS em ambiente de dev | Medio | Medio | ViaCEP permite CORS publicamente; testar antes de confirmar |
| FA-001 com `beforeunload` com comportamento diferente entre browsers | Medio | Baixo | Usar `useEffect` de cleanup como estrategia primaria |
| Tela de sucesso com decisao de arquitetura nao resolvida antes desta fase | Medio | Medio | Confirmar a decisao de arquitetura antes de iniciar |

### Criterios de Conclusao

- [ ] Nenhum `alert()` remanescente em nenhum arquivo do projeto (busca global confirmada).
- [ ] Erros de validacao no CadastroImovel exibem mensagem inline com borda vermelha no campo afetado.
- [ ] Apos publicar anuncio, tela de sucesso/confirmacao e exibida.
- [ ] Acessar URL invalida exibe `NotFound` com botoes funcionais.
- [ ] Rota `*` configurada no router.
- [ ] Fechar o browser durante CadastroImovel e reabrir mostra banner "Voce tem um rascunho salvo".
- [ ] Remover foto obrigatoria no Step 2 desabilita o botao "Publicar" no Step 6.
- [ ] Adicionar comodo com nome duplicado exibe erro inline.
- [ ] Campo CEP preenchido com CEP valido preenche automaticamente rua, bairro e cidade.
- [ ] CEP invalido exibe mensagem de erro inline.

---

## FASE-8 - Polimento e Conformidade

### Objetivo

Corrigir todos os problemas de baixa prioridade identificados na auditoria: semantica HTML incorreta, typos textuais, icones incorretos no footer, caminho de logo com erro, atributos `alt` ausentes ou genericos, e titulos de pagina por rota para SEO.

### Justificativa

Estes itens foram classificados como Baixo pela auditoria (Bloco 4, Secao 19), mas representam conformidade com boas praticas de HTML semantico, acessibilidade e SEO. Esta fase existe para garantir que o projeto seja entregue sem dividas tecnicas de polimento. Deve ser executada por ultimo, pois depende de todas as telas estarem em seu estado final.

### Problemas Resolvidos

| ID Auditoria | Problema |
|---|---|
| B01 | Typo "Meu Imoveis" em `Perfil.jsx` |
| B02 | `<Link>` dentro de `<Button>` na Home |
| B03 | `<button>` dentro de `<Link>` em Perfil |
| B04 | `href="#"` remanescentes em `VisualizarImoveis` |
| B05 | "Acessar com Google" com cor e icone errados |
| B08 | Sem `<title>` por pagina para SEO |
| B09 | Sem `alt` descritivo em imagens de imoveis relacionados |
| M09 | Icones errados no footer (MapPin para e-mail/horario) |
| M10 | `recuperar-senha` usa logo com caminho incorreto |

### Pre-requisitos

- FASE-7 concluida: todas as funcionalidades transversais implementadas.
- Todas as telas em estado final.

### Entregaveis

1. `Home.jsx` - `<Button asChild><Link>` em vez de `<Link>` dentro de `<Button>` (B02).
2. `Perfil.jsx`:
   - Corrigir typo `"Meu Imoveis"` para `"Meus Imoveis"` (B01).
   - Substituir `<Link><button>` por `<Link className="...">` (B03).
3. `VisualizarImoveis/index.jsx` - verificar e remover `href="#"` remanescentes (B04).
4. `Login.jsx` - botao "Acessar com Google": cor `#4285F4` + icone SVG oficial (B05).
5. `Layout.jsx` ou `Footer.jsx` - icones de e-mail (`Mail`) e horario (`Clock`) em vez de `MapPin` (M09).
6. `RecuperarSenha.jsx` - caminho do logo corrigido para `/logoFundoVerde.svg` (M10).
7. Todas as paginas principais - `document.title` definido por rota (B08): Home, ResultadosPesquisa, VisualizarImoveis, Login, CadastroUsuario, RecuperarSenha, Perfil, CadastroImovel.
8. `VisualizarImoveis/index.jsx` - atributo `alt` das imagens de imoveis relacionados usa o nome do imovel (B09).

### Riscos

| Risco | Probabilidade | Impacto | Mitigacao |
|---|---|---|---|
| `Button asChild` com `<Link>` alterando comportamento visual | Baixo | Baixo | Testar visualmente apos substituicao |
| `document.title` conflitando com futuro uso de `react-helmet-async` | Baixo | Baixo | Usar `useEffect` simples; documentar para migracao futura |

### Criterios de Conclusao

- [ ] Nenhum `<Link>` dentro de `<Button>` sem `asChild` no projeto (busca global).
- [ ] Nenhum `<button>` dentro de `<Link>` no projeto (busca global).
- [ ] Texto "Meu Imoveis" inexistente no projeto - corrigido para "Meus Imoveis".
- [ ] Botao "Acessar com Google" usa cor azul do Google.
- [ ] Footer exibe icone `Mail` para e-mail e icone `Clock` para horario.
- [ ] `RecuperarSenha.jsx` carrega logo sem erro de caminho.
- [ ] Cada pagina principal tem `<title>` descritivo e unico.
- [ ] Imagens de imoveis relacionados em `VisualizarImoveis` tem atributo `alt` com nome do imovel.
- [ ] Nenhum `href="#"` remanescente em `VisualizarImoveis`.

---

## Apendice - Rastreabilidade entre Fases e Objetivos do Roadmap

| OBJ (Roadmap) | Fase que atende |
|---|---|
| OBJ-01 - Sistema visual unico com tokens @theme | FASE-1 |
| OBJ-02 - Eliminar God Files | FASE-5 |
| OBJ-03 - VisualizarImoveis no Layout global | FASE-3 |
| OBJ-04 - Corrigir 5 bloqueios criticos C01-C05 | FASE-2 (C01), FASE-3 (C02), FASE-5 (C03, C04), FASE-6 (C05) |
| OBJ-05 - Centralizar mocks em src/lib/mock/ | FASE-0 |
| OBJ-06 - Unificar 3 versoes de CardImovel | FASE-2 |
| OBJ-07 - Criar PrivateRoute | FASE-6 |
| OBJ-08 - Substituir alert() por toast (sonner) | FASE-7 |
| OBJ-09 - Filtros funcionais em ResultadosPesquisa | FASE-4 |
| OBJ-10 - Busca funcional conectada ao React Router | FASE-4 |
| OBJ-11 - ViaCEP no Step 3 | FASE-7 |
| OBJ-12 - PerfilAnunciante com React Router | FASE-6 |
| OBJ-13 - Persistencia de rascunho em localStorage | FASE-5 |
| OBJ-14 - Tela de sucesso pos-publicacao | FASE-7 |
| OBJ-15 - Migrar cores hardcoded para tokens | FASE-1 |
| OBJ-16 - Corrigir inconsistencias HTML e nomenclatura | FASE-8 |

---

*Documento gerado com base nas auditorias Bloco 1-4 do Aluguel360. Versao 1.0.*
