# MATRIZ DE DEPENDÊNCIAS E RISCOS — Aluguel360

> **Data de elaboração**: 2026-07-02
> **Referência**: ROADMAP_REESTRUTURACAO.md e FASES_REESTRUTURACAO.md
> **Objetivo**: Mapear as interdependências entre os módulos funcionais, definir a ordem estrita de execução técnica e analisar os riscos de impacto sistêmico durante a refatoração.

---

## 1. Matriz de Dependência de Módulos (Topológica)

A tabela abaixo define quais módulos/componentes dependem da conclusão de outros antes que possam ser refatorados com segurança.

| Módulo Alvo | Depende de | Justificativa Técnica |
|---|---|---|
| **Design System (Tokens)** | Limpeza (App.css removido) | Evitar conflitos de especificidade CSS com classes residuais do template Vite. |
| **Camada de Dados Mock** | Nenhuma | Dados devem ser extraídos antes que a refatoração dos componentes mude sua estrutura interna. |
| **Hooks de Acesso a Dados** | Camada de Dados Mock | Hooks (`useImoveis`) precisam do arquivo físico `imoveis.json` para importar. |
| **CardImovel (Unificado)** | Design System, Hooks | Precisa de tokens para o visual e a estrutura final de dados (`useImoveis`) para consolidar suas `props`. |
| **VisualizarImoveis (Layout)** | CardImovel, Design System | Precisa da variante `detailed` do CardImovel para os "Imóveis Relacionados" e tokens para substituir o objeto de estilos inline `s`. |
| **ResultadosPesquisa (Filtros)** | CardImovel, Hooks | Precisa da variante `default` do CardImovel para renderizar os resultados e da matriz de dados via hooks para realizar filtragem. |
| **CadastroImovel (Steps)** | Design System | Os novos componentes de formulário extraídos (TextField, Shell, etc.) já devem nascer utilizando as variáveis de tokens finais. |
| **PrivateRoute (Rotas)** | CadastroImovel (Decomposto) | As rotas filhas do Cadastro (Step1, Step2...) precisam existir como componentes importáveis para o roteador aplicá-las dentro da rota privada. |
| **PerfilAnunciante (Rotas)** | PrivateRoute | A migração da navegação por estado local para rotas precisa que o mecanismo de proteção de rotas já esteja implementado. |
| **Fluxos Alternativos / Toasts** | Todas as Telas Principais | Substituir `alert()` por toast exige que os componentes finais (Steps do Cadastro, Login, etc.) já estejam em seus arquivos e arquiteturas definitivas. |
| **Polimento HTML / SEO** | Todo o Produto | Alterações semânticas e injeção de `<title>` devem ser a última etapa para não gerar conflito de merge com refatorações estruturais em andamento. |

---

## 2. Ordem de Execução Crítica (Gargalos)

Os seguintes itens formam o "caminho crítico" (Critical Path) da refatoração. Atrasos nestes itens atrasarão todo o projeto:

1. **`index.css` (@theme)**: Bloqueia 100% da refatoração visual.
2. **`src/lib/mock/imoveis.json`**: Bloqueia a criação do `CardImovel` unificado e dos Hooks.
3. **`CardImovel.jsx` unificado**: É o componente mais consumido. Bloqueia a Home, Pesquisa e VisualizarImóveis.
4. **Decomposição do `CadastroImovel.jsx`**: Bloqueia a implementação do Rascunho (`localStorage`) e correção da UX de validação.

---

## 3. Matriz de Análise de Riscos e Impacto

Análise dos maiores pontos de falha possíveis durante a implementação, sua gravidade e a estratégia de contenção obrigatória.

| ID Risco | Componente Afetado | Probabilidade | Impacto Sistêmico | Estratégia de Mitigação Obrigatória |
|---|---|---|---|---|
| **R01** | `App.jsx` (Roteamento) | Média | **CRÍTICO** (App quebrado) | Ler e documentar detalhadamente o arquivo antes da implementação da **FASE-6** (PrivateRoute e Perfil). Mapear todas as rotas atuais. |
| **R02** | `VisualizarImoveis.jsx` | Alta | ALTO (Página quebrada) | **LAC-04**: Leitura completa do arquivo original mapeando *todos* os sub-componentes inline antes de iniciar a **FASE-3**. Não assumir comportamento. |
| **R03** | Formulário de Cadastro | Média | ALTO (Perda de dados) | Testar profundamente a migração da matriz de estado unificada (`form`) para o repasse via `props` (`setForm`) nos múltiplos arquivos de *Steps*. |
| **R04** | Variáveis CSS vs Tailwind | Baixa | MÉDIO (Visual inconsistente) | **LAC-06**: Restringir nomes customizados para evitar sobreposição (ex: usar `--font-size-` em vez de `--text-` no `@theme`). |
| **R05** | Token `secondary-hover` | Alta | MÉDIO (Botões sem hover) | **LAC-07**: Busca global (CTRL+SHIFT+F) pelo nome do token antes de deletá-lo. Unificar para `primary` em todos os botões e links. |

---

## 4. Árvore de Dependência de Dados (Data Flow)

Como os dados fluem na nova arquitetura e como isso impacta a refatoração:

```text
JSON (src/lib/mock/)
  │
  ├──> useImoveis.js
  │      ├──> ResultadosPesquisa (Lê, filtra, passa para CardImovel)
  │      ├──> Home (Lê, passa para CardImovel)
  │      └──> VisualizarImoveis (Lê por ID, lê relacionados)
  │
  ├──> useAuth.js
  │      ├──> PrivateRoute (Checa auth)
  │      ├──> SiteHeader (Toggle login/guest ui)
  │      └──> FavoritosContext (Valida auth antes de favoritar)
  │
  └──> FavoritosContext
         ├──> CardImovel (Checa se ID está na lista)
         └──> VisualizarImoveis (Checa se ID está na lista)
```

**Regra Arquitetural Decorrente:**
Componentes de UI puros (`CardImovel`, `FiltroLateral`, `Steps` do Cadastro) não devem acessar Hooks diretamente se puderem receber os dados via `props` do componente pai/página (Padrão Container/Presenter).

---

*Documento gerado com base nas auditorias Bloco 1-4 do Aluguel360. Versão 1.0.*
