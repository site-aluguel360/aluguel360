# TASKS DA REESTRUTURACAO - Aluguel360

> **Referencia**: FASES_REESTRUTURACAO.md e ROADMAP_REESTRUTURACAO.md
> **Fonte de verdade**: Auditorias Bloco 1-4
> **Convencao de status**:
>   - `[ ]` Nao iniciada
>   - `[/]` Em andamento
>   - `[x]` Concluida
>   - `[~]` Bloqueada (aguardando dependencia)
>
> **Convencao de prioridade**: CRITICA | ALTA | MEDIA | BAIXA
> **Convencao de complexidade**: BAIXA | MEDIA | ALTA | MUITO_ALTA

---


---

# FASE-0 - Limpeza e Fundacao

---

## MT-0.1 - Remover residuos do template Vite

### TASK-001

- [x] **TASK-001**
- **Titulo**: Localizar e auditar todos os imports de App.css no projeto
- **Descricao**: Realizar busca global no projeto por `import './App.css'` e `import '../App.css'` para identificar todos os arquivos que importam o App.css antes de deleta-lo.
- **Objetivo**: Garantir que nenhum arquivo dependente de App.css quebre apos a remocao.
- **Arquivos afetados**: Busca global em `src/`
- **Dependencias**: Nenhuma
- **Prioridade**: CRITICA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Lista completa dos arquivos que importam App.css documentada.
  - Confirmacao de que nenhum estilo critico esta definido em App.css (apenas residuos do template).
- **Observacoes**: App.css contem `.counter`, `.hero`, `.vite`, `#center`, `#next-steps` - classes que nao sao usadas em nenhum componente do produto.
- **Status**: [x]

---

### TASK-002

- [x] **TASK-002**
- **Titulo**: Deletar o arquivo App.css
- **Descricao**: Deletar o arquivo `src/App.css` do projeto apos confirmacao de que nenhum estilo relevante sera perdido (TASK-001 concluida).
- **Objetivo**: Eliminar o unico arquivo de CSS residual do template Vite identificado na auditoria.
- **Arquivos afetados**: `src/App.css` (deletar)
- **Dependencias**: TASK-001
- **Prioridade**: CRITICA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Arquivo `App.css` inexistente no sistema de arquivos.
  - Nenhum erro de build ou runtime apos a remocao.
  - Nenhuma classe visual ausente nas telas do produto.
- **Observacoes**: Remover tambem os imports identificados na TASK-001.
- **Status**: [x]

---

## MT-0.2 - Criar camada de dados mock centralizada

### TASK-003

- [x] **TASK-003**
- **Titulo**: Criar estrutura de diretorios `src/lib/mock/` e `src/lib/hooks/`
- **Descricao**: Criar os diretorios `src/lib/mock/` e `src/lib/hooks/` no projeto. Estes diretorios nao existem atualmente. Criar arquivos `.gitkeep` ou arquivos de indice vazios para inicializar os diretorios.
- **Objetivo**: Estabelecer a estrutura de pastas que ira receber os dados mock centralizados e os hooks de acesso a dados.
- **Arquivos afetados**: `src/lib/mock/` (criar), `src/lib/hooks/` (criar)
- **Dependencias**: Nenhuma
- **Prioridade**: CRITICA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Diretorio `src/lib/mock/` existe.
  - Diretorio `src/lib/hooks/` existe.
- **Observacoes**: Nenhum conteudo ainda - apenas a estrutura.
- **Status**: [x]

---

### TASK-004

- [x] **TASK-004**
- **Titulo**: Extrair dados mock de imoveis para `src/lib/mock/imoveis.json`
- **Descricao**: Identificar todos os arrays e objetos de dados de imoveis hardcoded em `ResultadosPesquisa.jsx` e `Home.jsx`. Extrair esses dados para um unico arquivo `src/lib/mock/imoveis.json` seguindo o schema `GET /imoveis` definido no Bloco 3, Secao 11. Substituir os dados inline nos componentes por importacao do arquivo JSON.
- **Objetivo**: Centralizar todos os dados de listagem de imoveis em um unico ponto de verdade.
- **Arquivos afetados**: `src/lib/mock/imoveis.json` (criar), `ResultadosPesquisa.jsx` (modificar), `Home.jsx` (modificar)
- **Dependencias**: TASK-003
- **Prioridade**: CRITICA
- **Complexidade**: MEDIA
- **Criterios de aceite**:
  - `src/lib/mock/imoveis.json` existe com pelo menos os campos: `id`, `titulo`, `tipo`, `preco`, `area`, `quartos`, `banheiros`, `mobiliado`, `fotoPrincipal`, `endereco`, `bairro`, `cidade`, `estado`, `avaliacaoMedia`, `totalAvaliacoes`, `features`, `status`.
  - `ResultadosPesquisa.jsx` nao contem arrays de imoveis definidos inline.
  - `Home.jsx` nao contem arrays de imoveis definidos inline.
  - Ambas as telas continuam renderizando os imoveis corretamente apos a mudanca.
- **Observacoes**: O schema de referencia esta no Bloco 3, Secao 11 (`GET /imoveis`). Campos adicionais presentes nos mocks atuais devem ser mantidos.
- **Status**: [x]

---

### TASK-005

- [x] **TASK-005**
- **Titulo**: Extrair dados mock do imovel detalhado para `src/lib/mock/imoveis.json` (schema detalhe)
- **Descricao**: Identificar o objeto de dados do imovel detalhado hardcoded em `VisualizarImoveis.jsx`. Adicionar esse objeto ao `src/lib/mock/imoveis.json` com o schema completo do `GET /imoveis/:id` (Bloco 3, Secao 11), incluindo campos de `despesas`, `amenidades`, `midia`, `imoveisRelacionados`. Substituir o dado inline no componente por importacao do JSON.
- **Objetivo**: Centralizar os dados do detalhe do imovel junto aos dados de listagem.
- **Arquivos afetados**: `src/lib/mock/imoveis.json` (modificar), `VisualizarImoveis.jsx` (modificar)
- **Dependencias**: TASK-004
- **Prioridade**: CRITICA
- **Complexidade**: MEDIA
- **Criterios de aceite**:
  - `src/lib/mock/imoveis.json` contem pelo menos um objeto com campos de detalhe: `despesas`, `amenidades`, `midia`, `imoveisRelacionados`, `distribuicaoEstrelas`.
  - `VisualizarImoveis.jsx` nao contem objeto de imovel definido inline.
  - A pagina `VisualizarImoveis` continua renderizando corretamente apos a mudanca.
- **Observacoes**: LAC-04 - VisualizarImoveis.jsx nao foi completamente auditada. Ler o arquivo antes de extrair para garantir que todos os campos sejam capturados.
- **Status**: [x]

---

### TASK-006

- [x] **TASK-006**
- **Titulo**: Criar `src/lib/mock/avaliacoes.json`
- **Descricao**: Identificar o array de avaliacoes hardcoded em `VisualizarImoveis.jsx` (variavel `avaliacoesIniciais` ou similar). Extrair para `src/lib/mock/avaliacoes.json` seguindo o schema `GET /anuncios/:id/avaliacoes` (Bloco 3, Secao 11). Substituir o dado inline por importacao do JSON.
- **Objetivo**: Centralizar dados de avaliacoes fora dos componentes.
- **Arquivos afetados**: `src/lib/mock/avaliacoes.json` (criar), `VisualizarImoveis.jsx` (modificar)
- **Dependencias**: TASK-003
- **Prioridade**: ALTA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - `src/lib/mock/avaliacoes.json` existe com campos: `anuncioId`, `avaliacaoMedia`, `total`, `items` (com `id`, `autorNome`, `autorAvatar`, `estrelas`, `texto`, `criadaEm`).
  - `VisualizarImoveis.jsx` nao contem array de avaliacoes definido inline.
  - Avaliacoes continuam renderizando na pagina apos a mudanca.
- **Observacoes**: Estrutura baseada no schema do Bloco 3, Secao 11.
- **Status**: [x]

---

### TASK-007

- [x] **TASK-007**
- **Titulo**: Criar `src/lib/mock/usuarios.json` e `src/lib/mock/perfil.json`
- **Descricao**: Identificar os objetos de dados de usuario e resumo de perfil hardcoded em `Perfil.jsx` e `PerfilAnunciante.jsx`. Extrair para `src/lib/mock/usuarios.json` (schema `GET /usuarios/:id/perfil`) e `src/lib/mock/perfil.json` (resumo do dashboard do perfil). Substituir os dados inline por importacoes dos JSONs.
- **Objetivo**: Centralizar dados de usuario e perfil fora dos componentes.
- **Arquivos afetados**: `src/lib/mock/usuarios.json` (criar), `src/lib/mock/perfil.json` (criar), `Perfil.jsx` (modificar), `PerfilAnunciante.jsx` (modificar)
- **Dependencias**: TASK-003
- **Prioridade**: ALTA
- **Complexidade**: MEDIA
- **Criterios de aceite**:
  - `src/lib/mock/usuarios.json` existe com campos do schema `GET /usuarios/:id/perfil` (Bloco 3, Secao 11).
  - `src/lib/mock/perfil.json` existe com os dados de resumo do dashboard.
  - `Perfil.jsx` e `PerfilAnunciante.jsx` nao contem objetos de usuario ou resumo definidos inline.
  - Ambas as paginas continuam renderizando corretamente.
- **Observacoes**: LAC-03 - PerfilQualidade.jsx foi mencionado mas nao completamente auditado. Verificar se tambem possui dados inline antes de fechar esta task.
- **Status**: [x]

---

### TASK-008

- [x] **TASK-008**
- **Titulo**: Criar `src/lib/mock/anuncios.json`
- **Descricao**: Identificar arrays de anuncios hardcoded em `PerfilMeusAnuncios.jsx` e `PerfilAnunciante.jsx`. Extrair para `src/lib/mock/anuncios.json` seguindo o schema `GET /usuarios/:id/anuncios` (Bloco 3, Secao 11). Substituir os dados inline por importacoes do JSON.
- **Objetivo**: Centralizar dados de anuncios fora dos componentes.
- **Arquivos afetados**: `src/lib/mock/anuncios.json` (criar), `PerfilMeusAnuncios.jsx` (modificar), `PerfilAnunciante.jsx` (modificar)
- **Dependencias**: TASK-003
- **Prioridade**: ALTA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - `src/lib/mock/anuncios.json` existe com campos: `id`, `imovelId`, `titulo`, `endereco`, `preco`, `status`, `visualizacoes`, `mensagens`, `favoritos`, `notaQualidade`, `criadoEm`.
  - `PerfilMeusAnuncios.jsx` e `PerfilAnunciante.jsx` nao contem arrays de anuncios inline.
  - Paginas continuam renderizando corretamente.
- **Observacoes**: LAC-01 - PerfilMeusAnuncios.jsx e PerfilMeusImoveis.jsx sao mencionados como stubs. Verificar conteudo antes de iniciar esta task.
- **Status**: [x]

---

### TASK-009

- [x] **TASK-009**
- **Titulo**: Confirmar tokens base do @theme em index.css
- **Descricao**: Ler o arquivo `src/index.css` e confirmar que os tokens de cor base estao definidos no bloco `@theme`: `primary`, `secondary`, `background`, `foreground`, `card`, `muted`, `accent`, `destructive`, `border`, `ring`. Documentar quais estao presentes e quais estao ausentes. Nao adicionar nem remover tokens - apenas auditoria e documentacao.
- **Objetivo**: Estabelecer o inventario exato dos tokens existentes antes de adicionar novos na FASE-1.
- **Arquivos afetados**: `src/index.css` (leitura apenas)
- **Dependencias**: Nenhuma
- **Prioridade**: ALTA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Lista completa dos tokens presentes no `@theme` documentada.
  - Lista dos tokens ausentes documentada.
  - Nenhuma alteracao feita no arquivo.
- **Observacoes**: Esta task e de auditoria/verificacao. O resultado alimenta o planejamento da FASE-1.
- **Status**: [x]

---


---

# FASE-1 - Design System e Tokens

---

## MT-1.1 - Resolver tokens duplicados e criar tokens faltantes

### TASK-010

- [x] **TASK-010**
- **Titulo**: Mapear todos os usos do token `secondary-hover` no projeto
- **Descricao**: Realizar busca global por `secondary-hover` em todos os arquivos JSX e CSS do projeto. Documentar cada arquivo e linha onde o token e usado. Verificar se `secondary-hover` e `primary` realmente tem o mesmo valor (`#1A535C`).
- **Objetivo**: Garantir que a unificacao de `secondary-hover` com `primary` nao quebre nenhum estilo antes de executar a mudanca.
- **Arquivos afetados**: Busca global em `src/`
- **Dependencias**: TASK-009
- **Prioridade**: ALTA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Lista completa de arquivos e linhas que usam `secondary-hover` documentada.
  - Confirmacao ou refutacao de que `secondary-hover` e `primary` tem o mesmo valor hex.
- **Observacoes**: LAC-07 - Esta task e o prerequisito para a TASK-011.
- **Status**: [x]

---

### TASK-011

- [x] **TASK-011**
- **Titulo**: Unificar `secondary-hover` com `primary` no @theme e atualizar referencias
- **Descricao**: Apos mapeamento completo (TASK-010), remover o token `secondary-hover` do `@theme` em `index.css`. Substituir todas as ocorrencias de `secondary-hover` nos componentes pelo token `primary`. Verificar que nenhum componente perdeu estilo de hover.
- **Objetivo**: Eliminar token duplicado do design system.
- **Arquivos afetados**: `src/index.css` (modificar), todos os arquivos identificados na TASK-010
- **Dependencias**: TASK-010
- **Prioridade**: ALTA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Busca global por `secondary-hover` retorna zero resultados.
  - Todos os componentes que usavam `secondary-hover` continuam com o mesmo comportamento visual.
  - Token `secondary-hover` nao existe mais no `@theme`.
- **Observacoes**: Substituicao direta - mesmo valor, apenas nome diferente.
- **Status**: [x]

---

### TASK-012

- [x] **TASK-012**
- **Titulo**: Mapear todos os usos do token `action` no projeto
- **Descricao**: Realizar busca global por `bg-action` e `text-action` em todos os arquivos JSX do projeto. Documentar cada uso. Confirmar que `action` e `destructive` tem o mesmo valor (`#FF6B6B`).
- **Objetivo**: Prerequisito para remocao do token redundante `action`.
- **Arquivos afetados**: Busca global em `src/`
- **Dependencias**: TASK-009
- **Prioridade**: MEDIA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Lista completa de arquivos e linhas que usam `action` documentada.
  - Confirmacao de que `action` e `destructive` tem o mesmo valor.
- **Observacoes**: Paralela a TASK-010.
- **Status**: [x]

---

### TASK-013

- [x] **TASK-013**
- **Titulo**: Remover token `action` do @theme e substituir por `destructive`
- **Descricao**: Remover o token `action` do `@theme` em `index.css`. Substituir todas as ocorrencias de `bg-action` e `text-action` por `bg-destructive` e `text-destructive` nos componentes identificados.
- **Objetivo**: Eliminar token redundante do design system.
- **Arquivos afetados**: `src/index.css` (modificar), todos os arquivos identificados na TASK-012
- **Dependencias**: TASK-012
- **Prioridade**: MEDIA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Busca global por `bg-action` e `text-action` retorna zero resultados.
  - Token `action` nao existe mais no `@theme`.
  - Todos os componentes afetados continuam com o mesmo visual.
- **Observacoes**: Substituicao direta - mesmo valor, apenas nome diferente.
- **Status**: [x]

---

### TASK-014

- [x] **TASK-014**
- **Titulo**: Adicionar token de cor `--color-teal-light` ao @theme
- **Descricao**: Adicionar o token `--color-teal-light: #4ECDC4` ao bloco `@theme` do arquivo `index.css`. Este token nao existe atualmente e a cor e usada diretamente como `#4ECDC4` em `Login.jsx` e `PerfilMeusAnuncios.jsx`.
- **Objetivo**: Criar token para a cor teal-light usada no botao Google e em alguns destaques do perfil.
- **Arquivos afetados**: `src/index.css` (modificar)
- **Dependencias**: TASK-009
- **Prioridade**: ALTA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - `src/index.css` contem `--color-teal-light: #4ECDC4` no bloco `@theme`.
  - O token e acessivel via classe Tailwind `bg-teal-light` e `text-teal-light`.
- **Observacoes**: Verificar convencao de nomenclatura do Tailwind para custom colors antes de adicionar.
- **Status**: [x]

---

## MT-1.2 - Adicionar tokens de tipografia, sombra e radius

### TASK-015

- [x] **TASK-015**
- **Titulo**: Adicionar escala tipografica formal ao @theme
- **Descricao**: Adicionar tokens de tamanho de fonte ao `@theme` do `index.css` usando a convencao `--font-size-` para evitar conflito com tokens nativos do Tailwind (LAC-06): `--font-size-xs: 0.75rem`, `--font-size-sm: 0.8125rem`, `--font-size-base: 0.875rem`, `--font-size-md: 1rem`, `--font-size-lg: 1.125rem`, `--font-size-xl: 1.25rem`, `--font-size-2xl: 1.375rem`.
- **Objetivo**: Formalizar a escala tipografica para que os valores de fonte possam ser centralizados.
- **Arquivos afetados**: `src/index.css` (modificar)
- **Dependencias**: TASK-009
- **Prioridade**: ALTA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Os 7 tokens de `--font-size-xs` a `--font-size-2xl` existem no `@theme`.
  - Os valores correspondem aos tamanhos identificados na auditoria (Bloco 4, Secao 16).
  - Nenhum conflito com tokens nativos do Tailwind (ex: `--text-xs` seria conflitante - `--font-size-xs` nao e).
- **Observacoes**: LAC-06 - usar prefixo `--font-size-` e nao `--text-`.
- **Status**: [x]

---

### TASK-016

- [x] **TASK-016**
- **Titulo**: Adicionar tokens de sombra ao @theme
- **Descricao**: Adicionar tokens de sombra ao `@theme` do `index.css`: `--shadow-card: 0 1px 8px rgba(0,0,0,0.06)`, `--shadow-header: 0 2px 4px rgba(26,83,92,0.4)`, `--shadow-popup: 0 4px 16px rgba(0,0,0,0.12)`. Esses tokens unificam os 4 sistemas de sombra diferentes identificados na auditoria.
- **Objetivo**: Criar um sistema de sombras unificado para substituir os 4 sistemas paralelos existentes.
- **Arquivos afetados**: `src/index.css` (modificar)
- **Dependencias**: TASK-009
- **Prioridade**: ALTA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - `--shadow-card`, `--shadow-header`, `--shadow-popup` existem no `@theme`.
- **Observacoes**: Os valores foram sugeridos no Bloco 4, Secao 16 da auditoria.
- **Status**: [x]

---

### TASK-017

- [x] **TASK-017**
- **Titulo**: Unificar tokens de radius no @theme
- **Descricao**: Adicionar ou revisar tokens de radius no `@theme` do `index.css` para cobrir a escala: `--radius-xs: 4px`, `--radius-sm: 6px`, `--radius-md: 8px`, `--radius-lg: 12px`, `--radius-xl: 16px`, `--radius-2xl: 24px`. O `@theme` atual ja tem `radius-lg`, `radius-md` e `radius-sm` - verificar se os valores sao compatibles ou se precisam ser atualizados.
- **Objetivo**: Criar escala formal de radius para substituir o uso de `rounded-[8px]`, `rounded-[9px]`, `rounded-[10px]`, etc.
- **Arquivos afetados**: `src/index.css` (modificar)
- **Dependencias**: TASK-009
- **Prioridade**: MEDIA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Os 6 tokens de radius existem no `@theme` com valores coerentes.
  - Nenhum token existente foi removido sem verificar seus usos.
- **Observacoes**: Verificar os tokens `radius-lg`, `radius-md`, `radius-sm` existentes antes de adicionar.
- **Status**: [x]

---

## MT-1.3 - Migrar cores hardcoded para tokens

### TASK-018

- [x] **TASK-018**
- **Titulo**: Migrar cores hardcoded em SiteHeader.jsx para tokens
- **Descricao**: Substituir `#1A535C` por `bg-primary`/`text-primary` e `#F0F4F8` por `bg-accent` em `SiteHeader.jsx`. Realizar busca completa no arquivo por qualquer outro valor hexadecimal e migrar para o token mais proximo.
- **Objetivo**: SiteHeader.jsx sem nenhuma cor hardcoded.
- **Arquivos afetados**: `SiteHeader.jsx`
- **Dependencias**: TASK-011, TASK-014
- **Prioridade**: ALTA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Busca por `#` no arquivo `SiteHeader.jsx` retorna zero valores hexadecimais de cor.
  - Header renderiza visualmente identico ao estado anterior.
- **Observacoes**: Verificar se `secondary-hover` ja foi removido (TASK-011) antes de iniciar.
- **Status**: [x]

---

### TASK-019

- [x] **TASK-019**
- **Titulo**: Migrar cores hardcoded em Login.jsx para tokens
- **Descricao**: Substituir `#4ECDC4` por `bg-teal-light` e `#1A535C` por token `primary` em `Login.jsx`. Nota: o botao "Acessar com Google" com `bg-[#4ECDC4]` deve ter a cor corrigida para `teal-light` aqui; a correcao para a cor correta do Google (`#4285F4`) e responsabilidade da FASE-8 (TASK-070).
- **Objetivo**: Login.jsx sem nenhuma cor hardcoded (a cor semantica do botao Google sera corrigida na FASE-8).
- **Arquivos afetados**: `Login.jsx`
- **Dependencias**: TASK-014
- **Prioridade**: ALTA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Busca por `#` no arquivo `Login.jsx` retorna zero valores hexadecimais de cor.
  - Login renderiza visualmente identico ao estado anterior.
- **Observacoes**: A semantica do botao Google (cor azul correta) sera resolvida na FASE-8.
- **Status**: [x]

---

### TASK-020

- [x] **TASK-020**
- **Titulo**: Migrar cores hardcoded em CadastroImovel.jsx para tokens
- **Descricao**: Substituir `#2C7E7B` por `secondary` e `#9c9c9c` pelo token neutro mais adequado (provavelmente `muted` ou criar `--color-neutral`) em `CadastroImovel.jsx`. Realizar busca completa no arquivo por qualquer outro valor hexadecimal.
- **Objetivo**: CadastroImovel.jsx sem nenhuma cor hardcoded.
- **Arquivos afetados**: `CadastroImovel.jsx`
- **Dependencias**: TASK-009, TASK-013
- **Prioridade**: ALTA
- **Complexidade**: MEDIA
- **Criterios de aceite**:
  - Busca por `#` no arquivo `CadastroImovel.jsx` retorna zero valores hexadecimais de cor.
  - O formulario de cadastro renderiza visualmente identico ao estado anterior.
- **Observacoes**: CadastroImovel.jsx tem 1.425 linhas - a busca deve ser cuidadosa. Nao alterar logica, apenas substituicoes de cor.
- **Status**: [x]

---

### TASK-021

- [x] **TASK-021**
- **Titulo**: Migrar cores hardcoded em PerfilQualidade.jsx, PerfilMeusImoveis.jsx e PerfilMeusAnuncios.jsx para tokens
- **Descricao**: Substituir em cada arquivo:
  - `PerfilQualidade.jsx`: `#2C7E7B` por `secondary`
  - `PerfilMeusImoveis.jsx`: `#1A535C` por `primary`, `#F0F4F8` por `accent`, `#D8E1E7` por `border`
  - `PerfilMeusAnuncios.jsx`: `#4ECDC4` por `teal-light`, `#D8E1E7` por `border`
- **Objetivo**: Tres arquivos de perfil sem nenhuma cor hardcoded.
- **Arquivos afetados**: `PerfilQualidade.jsx`, `PerfilMeusImoveis.jsx`, `PerfilMeusAnuncios.jsx`
- **Dependencias**: TASK-011, TASK-014
- **Prioridade**: ALTA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Busca por `#` nos tres arquivos retorna zero valores hexadecimais de cor.
  - As paginas de perfil renderizam visualmente identicas ao estado anterior.
- **Observacoes**: LAC-01 - PerfilMeusImoveis e PerfilMeusAnuncios sao stubs. Verificar conteudo real antes de iniciar.
- **Status**: [x]

---

### TASK-022

- [x] **TASK-022**
- **Titulo**: Migrar cores hardcoded em VisualizarImoveis.jsx para tokens (apenas cores, nao inline styles)
- **Descricao**: Dentro do objeto `s` de inline styles de `VisualizarImoveis.jsx`, substituir os valores de cor hardcoded pelos tokens CSS correspondentes (usando `var(--color-primary)` etc.). NAO alterar a estrutura de inline styles - isso sera feito na FASE-3. Apenas as cores dentro dos valores inline devem ser convertidas para variaveis CSS.
- **Objetivo**: Preparar VisualizarImoveis.jsx para a reescrita da FASE-3 sem introducao de novas inconsistencias de cor.
- **Arquivos afetados**: `VisualizarImoveis.jsx`
- **Dependencias**: TASK-014, TASK-015, TASK-016, TASK-017
- **Prioridade**: MEDIA
- **Complexidade**: MEDIA
- **Criterios de aceite**:
  - Nenhum valor hexadecimal de cor fora do objeto `s` no arquivo.
  - Dentro do objeto `s`, os valores de cor usam `var(--color-X)` em vez de hex direto.
  - A pagina renderiza visualmente identica ao estado anterior.
- **Observacoes**: Estado transitorio - o arquivo sera completamente reescrito na FASE-3. Esta task apenas para a introducao de novas inconsistencias.
- **Status**: [x]

---


---

# FASE-2 - Camada de Dados Mock e CardImovel

---

## MT-2.1 - Criar hooks de acesso a dados

### TASK-023

- [x] **TASK-023**
- **Titulo**: Criar hook `useImoveis.js`
- **Descricao**: Criar o arquivo `src/lib/hooks/useImoveis.js`. O hook deve importar `src/lib/mock/imoveis.json` e expor as funcoes: `getImoveis()` (retorna array completo), `getImovelById(id)` (retorna objeto pelo id), `getImoveisRelacionados(ids)` (retorna array de imoveis pelos ids). Simular comportamento assincrono com Promise resolvida para facilitar migracao futura para API real.
- **Objetivo**: Abstrair o acesso aos dados de imoveis para que os componentes nao importem JSON diretamente.
- **Arquivos afetados**: `src/lib/hooks/useImoveis.js` (criar)
- **Dependencias**: TASK-004, TASK-005
- **Prioridade**: CRITICA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - `useImoveis.js` existe e exporta as funcoes `getImoveis`, `getImovelById`, `getImoveisRelacionados`.
  - `getImovelById('imovel-001')` retorna o objeto correto.
  - `getImoveis()` retorna o array completo.
- **Observacoes**: Nao e necessario React hook (useState/useEffect) nesta versao - pode ser modulo de funcoes puras que retornam dados do JSON.
- **Status**: [x]

---

### TASK-024

- [x] **TASK-024**
- **Titulo**: Criar hook `useAuth.js`
- **Descricao**: Criar o arquivo `src/lib/hooks/useAuth.js`. O hook deve consumir o `AuthContext` e expor: `isAuthenticated` (boolean), `usuario` (objeto do usuario logado ou null), `login(credentials)`, `logout()`. E um wrapper que padroniza o acesso ao contexto de autenticacao.
- **Objetivo**: Padronizar o acesso ao estado de autenticacao para todos os componentes.
- **Arquivos afetados**: `src/lib/hooks/useAuth.js` (criar)
- **Dependencias**: TASK-003
- **Prioridade**: ALTA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - `useAuth.js` existe e exporta `isAuthenticated`, `usuario`, `login`, `logout`.
  - O hook pode ser importado e usado em qualquer componente sem importar `AuthContext` diretamente.
- **Observacoes**: Wrapper simples sobre o AuthContext existente.
- **Status**: [x]

---

## MT-2.2 - Unificar CardImovel

### TASK-025

- [x] **TASK-025**
- **Titulo**: Mapear os tres schemas de props usados pelas 3 versoes de CardImovel
- **Descricao**: Documentar os campos de props aceitos por cada uma das 3 implementacoes de card de imovel: (1) `<Card>` shadcn + HTML manual na `Home.jsx`, (2) `<CardImovel>` customizado em `ResultadosPesquisa.jsx`, (3) `CardRelacionado` inline em `VisualizarImoveis.jsx`. Criar um schema unificado que cubra todos os campos das 3 versoes.
- **Objetivo**: Definir o schema de props antes de criar o CardImovel unificado.
- **Arquivos afetados**: `Home.jsx` (leitura), `ResultadosPesquisa.jsx` (leitura), `VisualizarImoveis.jsx` (leitura), `CardImovel.jsx` (leitura)
- **Dependencias**: TASK-005 (para ter os dados do detalhe mapeados)
- **Prioridade**: CRITICA
- **Complexidade**: MEDIA
- **Criterios de aceite**:
  - Schema unificado de props documentado com todos os campos necessarios.
  - Identificacao de quais campos sao obrigatorios em todas as variantes e quais sao opcionais por variante.
- **Observacoes**: LAC-04 - VisualizarImoveis nao foi completamente auditada. Ler o arquivo antes.
- **Status**: [x]

---

### TASK-026

- [x] **TASK-026**
- **Titulo**: Criar variante `default` do CardImovel unificado
- **Descricao**: Reescrever `CardImovel.jsx` com a variante `default` (uso atual em ResultadosPesquisa). Implementar o prop `variant` como parametro com valor padrao `"default"`. Adicionar `<Link to={'/visualizar-imoveis/' + id}>` wrapping o card inteiro. O componente deve usar exclusivamente tokens do `@theme`. Manter todos os estados: `default`, `hovered` (sombra elevada), `loading_image` (skeleton cinza).
- **Objetivo**: Criar a variante principal do CardImovel com navegacao funcional.
- **Arquivos afetados**: `CardImovel.jsx` (modificar/reescrever)
- **Dependencias**: TASK-025, TASK-018 (tokens disponíveis)
- **Prioridade**: CRITICA
- **Complexidade**: MEDIA
- **Criterios de aceite**:
  - `CardImovel` renderiza na variante `default` identico ao card atual de `ResultadosPesquisa`.
  - Clicar no card navega para `/visualizar-imoveis/{id}`.
  - Nenhum valor de cor hardcoded no componente.
  - Estado `hovered` eleva a sombra e aplica `-translate-y-1`.
- **Observacoes**: Esta e a variante mais importante - prioridade critica.
- **Status**: [x]

---

### TASK-027

- [x] **TASK-027**
- **Titulo**: Adicionar variante `compact` ao CardImovel (para uso na Home)
- **Descricao**: Adicionar a variante `compact` ao `CardImovel.jsx`. Esta variante deve ser equivalente ao card que atualmente existe na `Home.jsx` (usando `<Card>` shadcn + HTML manual). Deve ter aparencia mais compacta que a variante `default`.
- **Objetivo**: Substituir os 3 cards da Home pelo componente unificado.
- **Arquivos afetados**: `CardImovel.jsx` (modificar), `Home.jsx` (modificar)
- **Dependencias**: TASK-026
- **Prioridade**: ALTA
- **Complexidade**: MEDIA
- **Criterios de aceite**:
  - `<CardImovel variant="compact" />` renderiza equivalente ao card atual da Home.
  - `Home.jsx` usa `<CardImovel variant="compact">` em vez do `<Card>` shadcn manual.
  - Home renderiza visualmente identica ao estado anterior.
- **Observacoes**: Manter props compatíveis com o schema unificado da TASK-025.
- **Status**: [x]

---

### TASK-028

- [x] **TASK-028**
- **Titulo**: Adicionar variante `detailed` ao CardImovel (para imoveis relacionados em VisualizarImoveis)
- **Descricao**: Adicionar a variante `detailed` ao `CardImovel.jsx`. Esta variante deve ser equivalente ao `CardRelacionado` inline atualmente em `VisualizarImoveis.jsx`. Deve exibir mais informacoes que a variante `compact` mas pode ser mais estreita que a variante `default`.
- **Objetivo**: Substituir o CardRelacionado inline de VisualizarImoveis pelo componente unificado.
- **Arquivos afetados**: `CardImovel.jsx` (modificar)
- **Dependencias**: TASK-026
- **Prioridade**: ALTA
- **Complexidade**: MEDIA
- **Criterios de aceite**:
  - `<CardImovel variant="detailed" />` renderiza equivalente ao CardRelacionado atual de VisualizarImoveis.
  - A variante contem `<Link>` para navegacao para o imovel.
  - Nenhum valor de cor hardcoded.
- **Observacoes**: LAC-04 - verificar campos exatos do CardRelacionado antes de implementar.
- **Status**: [x]

---

### TASK-029

- [x] **TASK-029**
- **Titulo**: Atualizar ResultadosPesquisa.jsx para usar CardImovel unificado
- **Descricao**: Atualizar `ResultadosPesquisa.jsx` para usar `<CardImovel variant="default">` em vez do `<CardImovel>` antigo (se houver diferenca de props). Garantir que os dados do mock `imoveis.json` sao passados com o schema correto.
- **Objetivo**: ResultadosPesquisa usa o CardImovel unificado.
- **Arquivos afetados**: `ResultadosPesquisa.jsx`
- **Dependencias**: TASK-026
- **Prioridade**: ALTA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - `ResultadosPesquisa.jsx` usa `<CardImovel variant="default">`.
  - Os cards renderizam identicos ao estado anterior.
  - Clicar em qualquer card navega para `/visualizar-imoveis/{id}`.
- **Observacoes**: Pode ser uma mudanca minima se o CardImovel antigo ja existia com props similares.
- **Status**: [x]

---

### TASK-030

- [x] **TASK-030**
- **Titulo**: Configurar rota `/visualizar-imoveis/:id` no router
- **Descricao**: Atualizar `App.jsx` (ou arquivo de rotas equivalente) para que a rota de `VisualizarImoveis` aceite o parametro `:id`. Verificar a estrutura atual de rotas antes de alterar (LAC-05 - App.jsx nao foi completamente auditado).
- **Objetivo**: Habilitar navegacao por ID para a pagina de detalhe do imovel.
- **Arquivos afetados**: `App.jsx` (ou arquivo de rotas)
- **Dependencias**: TASK-024 (LAC-05 - ler App.jsx antes)
- **Prioridade**: CRITICA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Acessar `/visualizar-imoveis/imovel-001` carrega a pagina sem erro de rota.
  - O parametro `id` esta disponivel via `useParams()` dentro de VisualizarImoveis.
- **Observacoes**: Verificar se a rota existente e `/visualizar-imoveis` (sem :id) e atualizar para `/visualizar-imoveis/:id`.
- **Status**: [x]

---


---

# FASE-3 - Integracao do Layout Global (VisualizarImoveis)

---

## MT-3.1 - Preparacao e auditoria de VisualizarImoveis

### TASK-031

- [x] **TASK-031**
- **Titulo**: Mapear todos os sub-componentes inline de VisualizarImoveis.jsx
- **Descricao**: Ler o arquivo completo `VisualizarImoveis.jsx` (686 linhas) e documentar todos os sub-componentes implementados inline: navbar propria, footer proprio, galeria de fotos, modal de video, secao de avaliacoes, formulario de contato, cards de imoveis relacionados, secao de despesas, secao de amenidades. Para cada sub-componente, documentar: nome, responsabilidade, campos de dados usados, estados gerenciados.
- **Objetivo**: Garantir que nenhum sub-componente seja omitido na reescrita.
- **Arquivos afetados**: `VisualizarImoveis.jsx` (leitura)
- **Dependencias**: TASK-028
- **Prioridade**: CRITICA
- **Complexidade**: MEDIA
- **Criterios de aceite**:
  - Lista completa de sub-componentes documentada com responsabilidade e dados.
  - Identificacao do objeto `s` de inline styles e todos os seus campos.
  - Mapa de estado local do componente (useState, handlers).
- **Observacoes**: LAC-04 - Esta task e o prerequisito obrigatorio antes de iniciar a reescrita.
- **Status**: [x]

---

## MT-3.2 - Reescrever VisualizarImoveis integrada ao Layout

### TASK-032

- [x] **TASK-032**
- **Titulo**: Criar estrutura base de `src/pages/VisualizarImoveis/index.jsx` integrada ao Layout
- **Descricao**: Criar o diretorio `src/pages/VisualizarImoveis/` e o arquivo `index.jsx`. O arquivo deve: (1) NAO conter navbar nem footer proprios, (2) usar `useParams('id')` para obter o ID, (3) usar `useImoveis.getImovelById(id)` para carregar os dados, (4) implementar os estados `loading`, `not_found`, `success`. Verificar que a rota `/visualizar-imoveis/:id` usa `<Layout>` no router.
- **Objetivo**: Estabelecer a estrutura base da nova VisualizarImoveis sem os sistemas paralelos.
- **Arquivos afetados**: `src/pages/VisualizarImoveis/index.jsx` (criar), `App.jsx` (verificar rota com Layout)
- **Dependencias**: TASK-031, TASK-023, TASK-030
- **Prioridade**: CRITICA
- **Complexidade**: ALTA
- **Criterios de aceite**:
  - Arquivo `src/pages/VisualizarImoveis/index.jsx` existe.
  - A rota `/visualizar-imoveis/:id` usa o `<Layout>` global (SiteHeader + footer aparecem na pagina).
  - Nenhum `<nav>` proprio na pagina.
  - Nenhum `<footer>` proprio na pagina.
  - `useParams` retorna o `id` corretamente.
  - Estado `loading` exibe skeleton.
  - Estado `not_found` exibe mensagem de fallback.
- **Observacoes**: Esta task cria a estrutura; as secoes de conteudo sao TASK-033 a TASK-038.
- **Status**: [x]

---

### TASK-033

- [x] **TASK-033**
- **Titulo**: Implementar secao de galeria de fotos e modal de video em Tailwind
- **Descricao**: Reescrever a galeria de fotos com thumbnails e navegacao de `VisualizarImoveis` usando Tailwind CSS (zero inline styles). Implementar o estado `video_open` com modal de video usando overlay escuro. Os dados de `midia` devem vir do mock via `useImoveis`.
- **Objetivo**: Galeria de fotos e modal de video funcionando sem inline styles.
- **Arquivos afetados**: `src/pages/VisualizarImoveis/index.jsx`
- **Dependencias**: TASK-032
- **Prioridade**: ALTA
- **Complexidade**: ALTA
- **Criterios de aceite**:
  - Galeria exibe thumbnails de fotos navegaveis.
  - Clicar na thumbnail de video abre o modal com overlay.
  - Fechar o modal retorna ao estado normal.
  - Zero `style={{...}}` nesta secao.
  - Usa tokens do `@theme` para cores e sombras.
- **Observacoes**: Estado `video_open` documentado no Bloco 3, Secao 12.
- **Status**: [x]

---

### TASK-034

- [x] **TASK-034**
- **Titulo**: Implementar secao de detalhes do imovel (amenidades, despesas, localizacao) em Tailwind
- **Descricao**: Reescrever a secao de informacoes detalhadas do imovel (area, quartos, banheiros, amenidades, despesas/precos) usando Tailwind CSS. Os dados devem vir do mock via `useImoveis`.
- **Objetivo**: Secao de detalhes do imovel sem inline styles.
- **Arquivos afetados**: `src/pages/VisualizarImoveis/index.jsx`
- **Dependencias**: TASK-032
- **Prioridade**: ALTA
- **Complexidade**: MEDIA
- **Criterios de aceite**:
  - Amenidades renderizam com icones e labels.
  - Despesas renderizam com valores.
  - Zero `style={{...}}` nesta secao.
- **Observacoes**: Paralela a TASK-033 - mesma base.
- **Status**: [x]

---

### TASK-035

- [x] **TASK-035**
- **Titulo**: Implementar secao de avaliacoes em Tailwind
- **Descricao**: Reescrever a secao de avaliacoes (stars, distribuicao, lista de comentarios) usando Tailwind CSS. Os dados devem vir de `src/lib/mock/avaliacoes.json` via importacao ou hook. Estado local de avaliacao (adicionar nova avaliacao) deve ser preservado.
- **Objetivo**: Secao de avaliacoes sem inline styles.
- **Arquivos afetados**: `src/pages/VisualizarImoveis/index.jsx`
- **Dependencias**: TASK-032, TASK-006
- **Prioridade**: ALTA
- **Complexidade**: MEDIA
- **Criterios de aceite**:
  - Lista de avaliacoes renderiza corretamente.
  - Distribuicao de estrelas exibe corretamente.
  - Estado de avaliacao media e preservado.
  - Zero `style={{...}}` nesta secao.
- **Observacoes**: Sistema de avaliacoes com state local deve ser preservado conforme F10 da auditoria.
- **Status**: [x]

---

### TASK-036

- [x] **TASK-036**
- **Titulo**: Implementar secao de contato em Tailwind com estado `contact_sent`
- **Descricao**: Reescrever o formulario de contato da `VisualizarImoveis` usando Tailwind CSS. Implementar o estado `contact_sent` que exibe feedback visual apos o envio. Os campos de contato (mensagem, email, telefone) devem ser preservados.
- **Objetivo**: Formulario de contato sem inline styles, com estado de feedback.
- **Arquivos afetados**: `src/pages/VisualizarImoveis/index.jsx`
- **Dependencias**: TASK-032
- **Prioridade**: MEDIA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Formulario de contato renderiza com campos corretos.
  - Apos envio, estado `contact_sent` exibe feedback (toast ou mensagem inline).
  - Zero `style={{...}}` nesta secao.
- **Observacoes**: Estado `contact_sent` documentado no Bloco 3, Secao 12.
- **Status**: [x]

---

### TASK-037

- [x] **TASK-037**
- **Titulo**: Implementar secao de imoveis relacionados usando CardImovel variante `detailed`
- **Descricao**: Reescrever a secao de imoveis relacionados usando `<CardImovel variant="detailed">`. Os dados de `imoveisRelacionados` devem ser obtidos via `useImoveis.getImoveisRelacionados(ids)`.
- **Objetivo**: Imoveis relacionados usando o componente unificado, sem `CardRelacionado` inline.
- **Arquivos afetados**: `src/pages/VisualizarImoveis/index.jsx`
- **Dependencias**: TASK-032, TASK-028
- **Prioridade**: ALTA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Secao de imoveis relacionados renderiza com `<CardImovel variant="detailed">`.
  - Clicar em um card relacionado navega para a pagina do imovel correto.
  - Zero `style={{...}}` nesta secao.
  - Zero `CardRelacionado` inline.
- **Observacoes**: Depende da TASK-028 (variante detailed do CardImovel).
- **Status**: [x]

---

### TASK-038

- [x] **TASK-038**
- **Titulo**: Substituir todos os `href="#"` por `<Link>` do React Router em VisualizarImoveis
- **Descricao**: Identificar todos os elementos `<a href="#">` na nova implementacao de `VisualizarImoveis/index.jsx` e substituir por `<Link to="...">` do React Router com as rotas corretas. Para links sem destino definido no momento, usar `<Link to="/">` ou botao sem href.
- **Objetivo**: Zero `href="#"` em VisualizarImoveis.
- **Arquivos afetados**: `src/pages/VisualizarImoveis/index.jsx`
- **Dependencias**: TASK-032
- **Prioridade**: MEDIA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Busca por `href="#"` no arquivo retorna zero resultados.
  - Todos os links de navegacao tem destino semantico ou sao substituidos por botoes.
- **Observacoes**: B04 da auditoria.
- **Status**: [x]

---

### TASK-039

- [x] **TASK-039**
- **Titulo**: Adicionar atributos `alt` descritivos nas imagens de VisualizarImoveis
- **Descricao**: Garantir que todas as imagens em `VisualizarImoveis/index.jsx` possuem atributo `alt` com o nome do imovel ou descricao da foto (ex: `alt={imovel.nome + ' - foto da galeria'}`). Zero imagens com `alt=""` ou sem `alt`.
- **Objetivo**: Acessibilidade basica nas imagens da pagina de detalhe.
- **Arquivos afetados**: `src/pages/VisualizarImoveis/index.jsx`
- **Dependencias**: TASK-032
- **Prioridade**: BAIXA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Todas as tags `<img>` na pagina possuem `alt` descritivo com nome do imovel.
  - B09 da auditoria resolvido.
- **Observacoes**: Pode ser feito junto com TASK-038.
- **Status**: [x]

---


---

# FASE-4 - ResultadosPesquisa Funcional

---

## MT-4.1 - Implementar filtros funcionais

### TASK-040

- [x] **TASK-040**
- **Titulo**: Adicionar estado de filtros em ResultadosPesquisa.jsx
- **Descricao**: Adicionar `useState` para cada filtro em `ResultadosPesquisa.jsx`: `filtroTipo` (string|null), `filtroPrecoMin` (number|null), `filtroPrecoMax` (number|null), `filtroQuartos` (number|null). Implementar `useSearchParams` para inicializar os filtros a partir dos query params da URL (ex: `/resultados?tipo=Apartamento`).
- **Objetivo**: Estabelecer o estado de filtros como unica fonte de verdade em ResultadosPesquisa.
- **Arquivos afetados**: `ResultadosPesquisa.jsx`
- **Dependencias**: TASK-029
- **Prioridade**: ALTA
- **Complexidade**: MEDIA
- **Criterios de aceite**:
  - Os 4 estados de filtro existem como `useState`.
  - `useSearchParams` inicializa os filtros a partir da URL ao montar o componente.
  - Nenhuma logica de filtragem ainda (apenas estado).
- **Observacoes**: Esta task apenas estabelece o estado. A logica de filtragem e a TASK-041.
- **Status**: [x]

---

### TASK-041

- [x] **TASK-041**
- **Titulo**: Implementar logica de filtragem do array de imoveis
- **Descricao**: Implementar a logica de filtragem em `ResultadosPesquisa.jsx` usando `useMemo` ou derivacao direta no render. A filtragem deve: (1) filtrar por tipo quando `filtroTipo` nao e null, (2) filtrar por preco quando `filtroPrecoMin` ou `filtroPrecoMax` nao sao null, (3) filtrar por quartos quando `filtroQuartos` nao e null. A lista filtrada deve ser usada no render dos `CardImovel`.
- **Objetivo**: Filtros efetivamente reduzem o numero de imoveis exibidos.
- **Arquivos afetados**: `ResultadosPesquisa.jsx`
- **Dependencias**: TASK-040
- **Prioridade**: ALTA
- **Complexidade**: MEDIA
- **Criterios de aceite**:
  - Selecionar tipo "Apartamento" exibe apenas imoveis com `tipo === "Apartamento"`.
  - Definir preco maximo de 2000 exibe apenas imoveis com `preco <= 2000`.
  - Definir quartos 2 exibe apenas imoveis com `quartos >= 2`.
  - Combinacao de filtros aplica todos simultaneamente (AND logic).
- **Observacoes**: A logica deve ser simples - nao normalizar strings, nao fazer busca por similaridade.
- **Status**: [x]

---

### TASK-042

- [x] **TASK-042**
- **Titulo**: Implementar estados de UI `loading`, `empty` e `error` em ResultadosPesquisa
- **Descricao**: Implementar os tres estados de UI: (1) `loading` - exibir 3-6 skeleton cards enquanto os dados nao estao disponiveis (simular com timeout breve), (2) `empty` - exibir texto "Nenhum imovel encontrado com esses filtros" + botao "Limpar filtros" quando o array filtrado esta vazio, (3) `error` - exibir banner de erro + botao "Tentar novamente" em caso de falha.
- **Objetivo**: ResultadosPesquisa com feedback visual em todos os estados possiveis.
- **Arquivos afetados**: `ResultadosPesquisa.jsx`
- **Dependencias**: TASK-041
- **Prioridade**: ALTA
- **Complexidade**: MEDIA
- **Criterios de aceite**:
  - Estado `loading` exibe skeleton cards durante carregamento inicial.
  - Estado `empty` exibe mensagem e botao quando nenhum resultado e encontrado.
  - Clicar "Limpar filtros" reseta todos os estados de filtro para null.
  - Estado `error` exibe banner quando ocorre falha.
- **Observacoes**: Estados de UI documentados no Bloco 3, Secao 12.
- **Status**: [x]

---

## MT-4.2 - Conectar componentes de filtro ao estado

### TASK-043

- [x] **TASK-043**
- **Titulo**: Conectar BarraFiltros.jsx ao estado de filtros
- **Descricao**: Verificar a API atual de `BarraFiltros.jsx` (se e controlado ou nao-controlado). Adicionar props `filtroAtivo` e `onFiltroChange` para tornar o componente controlado pelo estado de `ResultadosPesquisa`. Atualizar `ResultadosPesquisa.jsx` para passar o estado e o handler para `BarraFiltros`.
- **Objetivo**: BarraFiltros reflete e altera o estado de filtro de tipo.
- **Arquivos afetados**: `BarraFiltros.jsx`, `ResultadosPesquisa.jsx`
- **Dependencias**: TASK-040
- **Prioridade**: ALTA
- **Complexidade**: MEDIA
- **Criterios de aceite**:
  - Clicar em um filtro de tipo na BarraFiltros atualiza o estado `filtroTipo` em ResultadosPesquisa.
  - O filtro ativo e visualmente destacado na BarraFiltros.
  - Clicar no filtro ativo o desativa (toggle).
- **Observacoes**: Verificar se BarraFiltros ja tem estado interno de selecao - pode precisar de refatoracao para tornar-se controlada.
- **Status**: [x]

---

### TASK-044

- [x] **TASK-044**
- **Titulo**: Conectar FiltroLateral.jsx ao estado de filtros
- **Descricao**: Verificar a API atual de `FiltroLateral.jsx`. Adicionar props para `filtroQuartos`, `filtroPrecoMin`, `filtroPrecoMax` e handlers correspondentes. Atualizar `ResultadosPesquisa.jsx` para passar estado e handlers para `FiltroLateral`.
- **Objetivo**: FiltroLateral reflete e altera os estados de filtro de quartos e preco.
- **Arquivos afetados**: `FiltroLateral.jsx`, `ResultadosPesquisa.jsx`
- **Dependencias**: TASK-040, TASK-044 nao depende de TASK-043 (paralela)
- **Prioridade**: ALTA
- **Complexidade**: MEDIA
- **Criterios de aceite**:
  - Selecionar numero de quartos no FiltroLateral atualiza `filtroQuartos` em ResultadosPesquisa.
  - Os filtros combinam corretamente com os filtros da BarraFiltros.
- **Observacoes**: Verificar se FiltroLateral usa FiltroPreco internamente.
- **Status**: [x]

---

### TASK-045

- [x] **TASK-045**
- **Titulo**: Conectar FiltroPreco.jsx ao estado de preco
- **Descricao**: Verificar a API atual de `FiltroPreco.jsx`. Adicionar props `precoMin`, `precoMax`, `onPrecoChange` para tornar o componente controlado. Atualizar o componente pai (`FiltroLateral` ou `ResultadosPesquisa`) para passar o estado.
- **Objetivo**: FiltroPreco reflete e altera os estados de preco minimo e maximo.
- **Arquivos afetados**: `FiltroPreco.jsx`, `FiltroLateral.jsx` (ou `ResultadosPesquisa.jsx`)
- **Dependencias**: TASK-044
- **Prioridade**: ALTA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Definir preco minimo e maximo no FiltroPreco atualiza os estados em ResultadosPesquisa.
  - Os valores numericos sao usados corretamente na logica de filtragem.
- **Observacoes**: Garantir que os valores sao tratados como numeros, nao strings.
- **Status**: [x]

---

## MT-4.3 - Conectar busca do header

### TASK-046

- [ ] **TASK-046**
- **Titulo**: Conectar o input de busca do SiteHeader ao React Router
- **Descricao**: Adicionar `onSubmit` ao formulario (ou `onKeyDown` Enter) do input de busca em `SiteHeader.jsx`. Ao submeter, navegar para `/resultados?q={termo}` usando `useNavigate` do React Router. O termo de busca deve ser lido via `useSearchParams` em `ResultadosPesquisa.jsx` para exibir resultados filtrados.
- **Objetivo**: Input de busca do header funcional e conectado a pagina de resultados.
- **Arquivos afetados**: `SiteHeader.jsx`, `ResultadosPesquisa.jsx`
- **Dependencias**: TASK-040
- **Prioridade**: ALTA
- **Complexidade**: MEDIA
- **Criterios de aceite**:
  - Digitar "Apartamento" no input do header e pressionar Enter navega para `/resultados?q=Apartamento`.
  - `ResultadosPesquisa` exibe apenas imoveis cujo titulo contem o termo buscado.
  - URL reflete o termo de busca como query param.
- **Observacoes**: A02 da auditoria. Busca simples por substring no titulo - nao e necessario busca avancada.
- **Status**: [ ]

---

### TASK-047

- [ ] **TASK-047**
- **Titulo**: Conectar filtros de categoria da Home ao React Router
- **Descricao**: Verificar como os filtros de categoria da `Home.jsx` funcionam atualmente. Alterar o comportamento para que ao clicar em um filtro (ex: "Casas", "Apartamentos"), o usuario seja redirecionado para `/resultados?tipo={categoria}` em vez de filtrar na propria Home.
- **Objetivo**: Filtros da Home navegam para ResultadosPesquisa com filtro pre-aplicado.
- **Arquivos afetados**: `Home.jsx`
- **Dependencias**: TASK-040
- **Prioridade**: MEDIA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Clicar em "Casas" na Home navega para `/resultados?tipo=Casa`.
  - `ResultadosPesquisa` inicializa com `filtroTipo = "Casa"` ao receber esse query param.
- **Observacoes**: Simplifica a Home - remove logica de filtro local.
- **Status**: [ ]

---


---

# FASE-5 - Decomposicao do CadastroImovel

---

## MT-5.1 - Preparacao e leitura do God File

### TASK-048

- [ ] **TASK-048**
- **Titulo**: Mapear toda a estrutura de CadastroImovel.jsx (1.425 linhas)
- **Descricao**: Ler o arquivo completo `CadastroImovel.jsx` e documentar: (1) todos os sub-componentes definidos inline com suas props, (2) o shape completo do objeto `initialForm`, (3) a logica de `goNext()` e `goBack()`, (4) a funcao `getRequiredPhotoSlots()` e suas dependencias, (5) a constante `DEFAULT_ROOM_IDS`, (6) handlers de eventos por step, (7) onde o `MenuLogin` e usado e o que faz. Este mapeamento e o prerequisito para toda a FASE-5.
- **Objetivo**: Garantir que nenhuma logica ou sub-componente seja perdido na decomposicao.
- **Arquivos afetados**: `CadastroImovel.jsx` (leitura)
- **Dependencias**: TASK-020 (tokens migrados - evitar confusao visual)
- **Prioridade**: CRITICA
- **Complexidade**: ALTA
- **Criterios de aceite**:
  - Lista completa dos sub-componentes inline com suas props documentada.
  - Shape do `initialForm` documentado com todos os campos.
  - Logica de validacao de cada step documentada.
  - Decisao sobre `MenuLogin.jsx` documentada (LAC-02).
- **Observacoes**: LAC-02 - A relacao exata de MenuLogin com o fluxo de autenticacao deve ser clarificada aqui.
- **Status**: [ ]

---

## MT-5.2 - Externalizar sub-componentes de formulario

### TASK-049

- [ ] **TASK-049**
- **Titulo**: Criar `src/components/forms/` e externalizar `Shell.jsx`
- **Descricao**: Criar o diretorio `src/components/forms/`. Extrair o sub-componente `Shell` de `CadastroImovel.jsx` para `src/components/forms/Shell.jsx`. O componente deve ter a mesma API de props que tinha inline.
- **Objetivo**: Primeiro componente de formulario externalizado.
- **Arquivos afetados**: `src/components/forms/Shell.jsx` (criar), `CadastroImovel.jsx` (modificar - remover definicao inline)
- **Dependencias**: TASK-048
- **Prioridade**: ALTA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - `src/components/forms/Shell.jsx` existe e exporta o componente.
  - `CadastroImovel.jsx` importa `Shell` de `components/forms/Shell`.
  - O formulario renderiza identico ao estado anterior.
- **Observacoes**: Comecar pelo mais simples para validar o processo.
- **Status**: [ ]

---

### TASK-050

- [ ] **TASK-050**
- **Titulo**: Externalizar `TipCard.jsx` para `src/components/forms/`
- **Descricao**: Extrair o sub-componente `TipCard` de `CadastroImovel.jsx` para `src/components/forms/TipCard.jsx`. Manter a mesma API de props.
- **Objetivo**: TipCard disponivel como componente reutilizavel.
- **Arquivos afetados**: `src/components/forms/TipCard.jsx` (criar), `CadastroImovel.jsx` (modificar)
- **Dependencias**: TASK-049
- **Prioridade**: ALTA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - `src/components/forms/TipCard.jsx` existe e exporta o componente.
  - `CadastroImovel.jsx` importa `TipCard` de `components/forms/TipCard`.
  - Os TipCards de todos os steps continuam exibindo.
- **Observacoes**: TipCards sao os cards de dica laterais de cada step.
- **Status**: [ ]

---

### TASK-051

- [ ] **TASK-051**
- **Titulo**: Externalizar `TextField.jsx` e `TextAreaField.jsx` para `src/components/forms/`
- **Descricao**: Extrair os sub-componentes `TextField` e `TextAreaField` de `CadastroImovel.jsx` para `src/components/forms/TextField.jsx` e `src/components/forms/TextAreaField.jsx`. Manter as APIs de props identicas.
- **Objetivo**: Componentes de input reutilizaveis externalizados.
- **Arquivos afetados**: `src/components/forms/TextField.jsx` (criar), `src/components/forms/TextAreaField.jsx` (criar), `CadastroImovel.jsx` (modificar)
- **Dependencias**: TASK-049
- **Prioridade**: ALTA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Ambos os arquivos existem em `src/components/forms/`.
  - `CadastroImovel.jsx` importa ambos de `components/forms/`.
  - Campos de texto dos steps continuam funcionando.
- **Observacoes**: Paralelo com TASK-050.
- **Status**: [ ]

---

### TASK-052

- [ ] **TASK-052**
- **Titulo**: Externalizar `CountField.jsx`, `RadioOption.jsx` e `FeatureToggle.jsx` para `src/components/forms/`
- **Descricao**: Extrair os sub-componentes `CountField`, `RadioOption` e `FeatureToggle` de `CadastroImovel.jsx` para arquivos separados em `src/components/forms/`.
- **Objetivo**: Todos os 7 sub-componentes de formulario externalizados.
- **Arquivos afetados**: `src/components/forms/CountField.jsx` (criar), `src/components/forms/RadioOption.jsx` (criar), `src/components/forms/FeatureToggle.jsx` (criar), `CadastroImovel.jsx` (modificar)
- **Dependencias**: TASK-049
- **Prioridade**: ALTA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Os 3 arquivos existem em `src/components/forms/`.
  - `CadastroImovel.jsx` importa todos de `components/forms/`.
  - Contador de quartos, radio de tipo e toggles de features continuam funcionando.
- **Observacoes**: Paralelo com TASK-050 e TASK-051.
- **Status**: [ ]

---

## MT-5.3 - Dividir CadastroImovel em Steps

### TASK-053

- [ ] **TASK-053**
- **Titulo**: Criar estrutura do diretorio `src/pages/CadastroImovel/` e o `index.jsx` orquestrador
- **Descricao**: Criar o diretorio `src/pages/CadastroImovel/`. Criar `index.jsx` que contem: (1) o objeto `initialForm` com todos os campos, (2) o estado `form` e `setForm`, (3) o estado `step` e as funcoes `goNext()` e `goBack()` com logica de validacao por step, (4) a constante `DEFAULT_ROOM_IDS`, (5) a funcao `getRequiredPhotoSlots()` envolvida em `useMemo`, (6) a logica de persistencia em `localStorage` via `useEffect`.
- **Objetivo**: Orquestrador do formulario multi-step com estado centralizado.
- **Arquivos afetados**: `src/pages/CadastroImovel/index.jsx` (criar)
- **Dependencias**: TASK-048, TASK-052
- **Prioridade**: CRITICA
- **Complexidade**: ALTA
- **Criterios de aceite**:
  - `index.jsx` existe com o estado `form`, `step`, funcoes de navegacao.
  - `getRequiredPhotoSlots` esta em `useMemo`.
  - `DEFAULT_ROOM_IDS` esta definida.
  - Logica de persistencia em `localStorage` salva o `form` a cada mudanca via `useEffect`.
  - Ao montar, tenta recuperar `form` do `localStorage`.
- **Observacoes**: A chave do localStorage deve ser versionada: `cadastro_imovel_v1`.
- **Status**: [ ]

---

### TASK-054

- [ ] **TASK-054**
- **Titulo**: Criar `Step1.jsx` (tipo, area, comodos, features)
- **Descricao**: Extrair o painel Step 1 de `CadastroImovel.jsx` para `src/pages/CadastroImovel/Step1.jsx`. O componente recebe `form` e `setForm` como props (e `DEFAULT_ROOM_IDS` se necessario). Deve conter: selecao de tipo de imovel, campo de area, contador de comodos, toggles de features e logica de adicionar/remover comodos customizados.
- **Objetivo**: Step 1 em arquivo separado, preservando toda a logica de negocio.
- **Arquivos afetados**: `src/pages/CadastroImovel/Step1.jsx` (criar)
- **Dependencias**: TASK-053
- **Prioridade**: CRITICA
- **Complexidade**: ALTA
- **Criterios de aceite**:
  - `Step1.jsx` existe e renderiza o formulario do Step 1.
  - Adicionar e remover comodos customizados funciona (RN-007).
  - Comodos padrao (DEFAULT_ROOM_IDS) nao podem ser deletados.
  - Selecao de tipo de imovel atualiza `form.propertyType`.
- **Observacoes**: RN-007 - logica de comodos padrao vs customizados deve ser integralmente preservada.
- **Status**: [ ]

---

### TASK-055

- [ ] **TASK-055**
- **Titulo**: Criar `Step2.jsx` (fotos por slot e video obrigatorio)
- **Descricao**: Extrair o painel Step 2 de `CadastroImovel.jsx` para `src/pages/CadastroImovel/Step2.jsx`. O componente recebe `form`, `setForm` e `requiredSlots` (resultado de `getRequiredPhotoSlots`). Deve conter: grade de slots de fotos obrigatorias, upload de foto extra, upload de video obrigatorio. A logica de `URL.createObjectURL` deve ser preservada.
- **Objetivo**: Step 2 em arquivo separado, preservando toda a logica de upload.
- **Arquivos afetados**: `src/pages/CadastroImovel/Step2.jsx` (criar)
- **Dependencias**: TASK-053
- **Prioridade**: CRITICA
- **Complexidade**: ALTA
- **Criterios de aceite**:
  - `Step2.jsx` existe e renderiza os slots de fotos corretamente.
  - O numero de slots varia com base no tipo de imovel e numero de comodos.
  - Upload de video funciona (aceita arquivo de video).
  - `form.photos` e `form.video` sao atualizados corretamente.
- **Observacoes**: RN-001, RN-002, RN-003, RN-004 - logicas de slots obrigatorios devem ser preservadas.
- **Status**: [ ]

---

### TASK-056

- [ ] **TASK-056**
- **Titulo**: Criar `Step3.jsx` (endereco e mapa Leaflet)
- **Descricao**: Extrair o painel Step 3 de `CadastroImovel.jsx` para `src/pages/CadastroImovel/Step3.jsx`. O componente recebe `form` e `setForm`. Deve conter: campos de endereco (CEP, rua, numero, bairro, complemento, referencia, destaque) e mapa Leaflet com marcador arrastavel. O CEP nao tem autocomplete ainda (isso e FASE-7).
- **Objetivo**: Step 3 em arquivo separado com mapa Leaflet preservado.
- **Arquivos afetados**: `src/pages/CadastroImovel/Step3.jsx` (criar)
- **Dependencias**: TASK-053
- **Prioridade**: ALTA
- **Complexidade**: MEDIA
- **Criterios de aceite**:
  - `Step3.jsx` existe e renderiza os campos de endereco e o mapa.
  - O marcador do mapa e arrastavel.
  - `form.cep`, `form.street`, `form.neighborhood`, etc. sao atualizados.
  - RN-005 - sem CEP, Rua e Bairro, o usuario nao avanca.
- **Observacoes**: A integracao do ViaCEP sera adicionada na FASE-7 (TASK-063).
- **Status**: [ ]

---

### TASK-057

- [ ] **TASK-057**
- **Titulo**: Criar `Step4.jsx` (precos e garantias)
- **Descricao**: Extrair o painel Step 4 de `CadastroImovel.jsx` para `src/pages/CadastroImovel/Step4.jsx`. O componente recebe `form` e `setForm`. Deve conter: campo de aluguel, negociavel toggle, condominio, IPTU, outras taxas, garantia. RN-006 - sem valor de aluguel, o usuario nao avanca.
- **Objetivo**: Step 4 em arquivo separado.
- **Arquivos afetados**: `src/pages/CadastroImovel/Step4.jsx` (criar)
- **Dependencias**: TASK-053
- **Prioridade**: ALTA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - `Step4.jsx` existe e renderiza os campos de preco.
  - RN-006 - campo de aluguel obrigatorio para avancar.
  - `form.rent`, `form.guarantee`, etc. sao atualizados.
- **Observacoes**: RN-006 ja existe como validacao em `goNext()` - preservar.
- **Status**: [ ]

---

### TASK-058

- [ ] **TASK-058**
- **Titulo**: Criar `Step5.jsx` (titulo, descricao e preview ao vivo)
- **Descricao**: Extrair o painel Step 5 de `CadastroImovel.jsx` para `src/pages/CadastroImovel/Step5.jsx`. O componente recebe `form` e `setForm`. Deve conter: campos de titulo e descricao, extraInfo, e o preview ao vivo do `<CardImovel variant="default">` renderizado com os dados do form em tempo real.
- **Objetivo**: Step 5 em arquivo separado com preview ao vivo preservado.
- **Arquivos afetados**: `src/pages/CadastroImovel/Step5.jsx` (criar)
- **Dependencias**: TASK-053, TASK-026 (CardImovel disponivel)
- **Prioridade**: ALTA
- **Complexidade**: MEDIA
- **Criterios de aceite**:
  - `Step5.jsx` existe e renderiza os campos de titulo e descricao.
  - O `<CardImovel>` no preview reflete os dados do form em tempo real.
  - `form.title`, `form.description`, `form.extraInfo` sao atualizados.
- **Observacoes**: O preview ao vivo e um diferencial do produto - preservar com atencao.
- **Status**: [ ]

---

### TASK-059

- [ ] **TASK-059**
- **Titulo**: Criar `Step6.jsx` com checklist real derivado do form state
- **Descricao**: Extrair o painel Step 6 de `CadastroImovel.jsx` para `src/pages/CadastroImovel/Step6.jsx`. O componente recebe `form`, `setForm`, `goToStep` e `requiredSlots`. O checklist DEVE ser derivado do `form` state real: (1) verificar cada campo obrigatorio de cada step, (2) verificar cada slot de foto obrigatorio, (3) exibir check ou aviso para cada item, (4) desabilitar botao "Publicar" enquanto houver itens incompletos, (5) clicar em item incompleto deve navegar para o step correspondente via `goToStep(N)`.
- **Objetivo**: Step 6 com revisao real e honesta do estado do formulario.
- **Arquivos afetados**: `src/pages/CadastroImovel/Step6.jsx` (criar)
- **Dependencias**: TASK-053, TASK-054, TASK-055, TASK-056, TASK-057, TASK-058
- **Prioridade**: CRITICA
- **Complexidade**: ALTA
- **Criterios de aceite**:
  - Checklist exibe status real (preenchido/faltando) para cada campo obrigatorio.
  - Botao "Publicar" esta desabilitado enquanto houver itens incompletos.
  - Clicar em item incompleto navega para o step correto.
  - Remover foto obrigatoria no Step 2 e voltar ao Step 6 mostra o item como incompleto.
  - Publicar com tudo preenchido avanca para a proxima etapa (FASE-7 cria a tela de sucesso).
- **Observacoes**: C04 da auditoria - checklist estatico sempre verde e o problema a ser corrigido.
- **Status**: [ ]

---


---

# FASE-6 - Autenticacao, Perfil e Roteamento

---

## MT-6.1 - Implementar PrivateRoute

### TASK-060

- [ ] **TASK-060**
- **Titulo**: Ler e documentar a estrutura atual de App.jsx e rotas
- **Descricao**: Ler o arquivo `App.jsx` (ou equivalente de rotas) e documentar: (1) como as rotas estao organizadas, (2) quais rotas precisam de protecao, (3) se ja existe alguma estrutura de rota privada, (4) como o Layout e aplicado as rotas. Esta informacao e critica para a implementacao correta do PrivateRoute.
- **Objetivo**: Entender a estrutura de rotas antes de modificar.
- **Arquivos afetados**: `App.jsx` (leitura)
- **Dependencias**: TASK-053 (CadastroImovel ja em diretorio)
- **Prioridade**: CRITICA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Estrutura completa de rotas documentada.
  - Lista de rotas que precisam de PrivateRoute identificada.
- **Observacoes**: LAC-05 - App.jsx nao foi completamente auditado.
- **Status**: [ ]

---

### TASK-061

- [ ] **TASK-061**
- **Titulo**: Criar `src/router/PrivateRoute.jsx`
- **Descricao**: Criar o componente `src/router/PrivateRoute.jsx`. O componente deve: (1) consumir `isAuthenticated` do `AuthContext`, (2) se autenticado, renderizar `<Outlet>` (ou `children`), (3) se nao autenticado, redirecionar para `/login` com `state: { from: location }` usando `<Navigate>` do React Router, preservando a URL de origem para redirect pos-login.
- **Objetivo**: Componente de protecao de rotas autenticadas.
- **Arquivos afetados**: `src/router/PrivateRoute.jsx` (criar)
- **Dependencias**: TASK-060
- **Prioridade**: CRITICA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Acessar `/perfil` sem autenticacao redireciona para `/login`.
  - Acessar `/perfil` com autenticacao renderiza a pagina corretamente.
  - A URL de origem e preservada no state do redirect.
- **Observacoes**: M07 da auditoria.
- **Status**: [ ]

---

### TASK-062

- [ ] **TASK-062**
- **Titulo**: Aplicar PrivateRoute nas rotas de perfil e cadastro em App.jsx
- **Descricao**: Atualizar `App.jsx` (ou arquivo de rotas) para envolver com `<PrivateRoute>` todas as rotas que exigem autenticacao: `/perfil`, `/perfil/*`, `/perfil/cadastro-imovel/*`.
- **Objetivo**: Todas as rotas de perfil protegidas por autenticacao.
- **Arquivos afetados**: `App.jsx` (modificar)
- **Dependencias**: TASK-061
- **Prioridade**: CRITICA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Acessar `/perfil` sem autenticacao redireciona para `/login`.
  - Acessar `/perfil/cadastro-imovel` sem autenticacao redireciona para `/login`.
  - Acessar qualquer subrota de `/perfil` sem autenticacao redireciona para `/login`.
- **Observacoes**: Verificar estrutura de rotas documentada na TASK-060 para aplicar corretamente.
- **Status**: [ ]

---

## MT-6.2 - Implementar Logout

### TASK-063

- [ ] **TASK-063**
- **Titulo**: Implementar `logout()` no AuthContext
- **Descricao**: Verificar a implementacao atual de `AuthContext.jsx`. Garantir que a funcao `logout()` existe e: (1) reseta `isAuthenticated` para `false`, (2) limpa dados do usuario do estado, (3) limpa qualquer dado de autenticacao do `localStorage` se aplicavel.
- **Objetivo**: Logout funcional que limpa o estado de autenticacao.
- **Arquivos afetados**: `AuthContext.jsx` (modificar)
- **Dependencias**: TASK-060
- **Prioridade**: ALTA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Chamar `logout()` reseta `isAuthenticated` para `false`.
  - `SiteHeader` exibe botoes de guest apos logout.
  - `localStorage` e limpo dos dados de autenticacao (se havia).
- **Observacoes**: C05 da auditoria - nenhum componente chama logout atualmente.
- **Status**: [ ]

---

### TASK-064

- [ ] **TASK-064**
- **Titulo**: Adicionar botao Logout em PerfilSidebar.jsx
- **Descricao**: Adicionar um botao "Sair" (Logout) em `PerfilSidebar.jsx`. O botao deve chamar `logout()` do `AuthContext` (via `useAuth`) e redirecionar o usuario para a Home apos o logout.
- **Objetivo**: Logout acessivel para o usuario autenticado.
- **Arquivos afetados**: `PerfilSidebar.jsx` (modificar)
- **Dependencias**: TASK-063
- **Prioridade**: ALTA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Botao "Sair" visivel na sidebar do perfil.
  - Clicar no botao chama `logout()` e redireciona para `/`.
  - Apos logout, `isAuthenticated` e false e o header exibe botoes de guest.
- **Observacoes**: C05 da auditoria.
- **Status**: [ ]

---

## MT-6.3 - Implementar FavoritosContext

### TASK-065

- [ ] **TASK-065**
- **Titulo**: Criar `src/context/FavoritosContext.jsx`
- **Descricao**: Criar o arquivo `src/context/FavoritosContext.jsx`. O context deve: (1) manter uma lista de IDs de imoveis favoritados em estado + sincronizar com `localStorage`, (2) expor `favoritos` (array de IDs), `isFavoritado(id)` (boolean), `toggleFavorito(id)` (adiciona ou remove), (3) em `toggleFavorito`, verificar `isAuthenticated` via `useAuth` - se nao autenticado, nao adicionar e exibir placeholder de feedback (pode ser `console.warn` ate FASE-7 adicionar o toast).
- **Objetivo**: Estado de favoritos persistente com verificacao de autenticacao.
- **Arquivos afetados**: `src/context/FavoritosContext.jsx` (criar)
- **Dependencias**: TASK-063
- **Prioridade**: ALTA
- **Complexidade**: MEDIA
- **Criterios de aceite**:
  - `FavoritosContext` existe e pode ser consumido via hook customizado `useFavoritos`.
  - Favoritar com usuario autenticado persiste no `localStorage`.
  - Recarregar a pagina mantem os favoritos.
  - Tentar favoritar sem autenticacao nao adiciona ao estado.
- **Observacoes**: A04 da auditoria. O feedback visual para usuario nao autenticado sera o toast da FASE-7.
- **Status**: [ ]

---

### TASK-066

- [ ] **TASK-066**
- **Titulo**: Integrar FavoritosContext ao CardImovel e a VisualizarImoveis
- **Descricao**: Atualizar `CardImovel.jsx` para usar `useFavoritos()` no icone de coracao: (1) `isFavoritado(id)` determina se o coracao esta preenchido, (2) clicar no coracao chama `toggleFavorito(id)`. Atualizar `VisualizarImoveis/index.jsx` com o mesmo comportamento no icone de favorito da pagina de detalhe.
- **Objetivo**: Icone de favorito reflete e altera o FavoritosContext.
- **Arquivos afetados**: `CardImovel.jsx` (modificar), `src/pages/VisualizarImoveis/index.jsx` (modificar)
- **Dependencias**: TASK-065
- **Prioridade**: ALTA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Favoritar um imovel em ResultadosPesquisa e depois abrir a pagina de detalhe mostra o imovel como favoritado.
  - Desfavoritar remove o ID do localStorage.
  - O coracao preenchido indica imovel favoritado em ambos os contextos.
- **Observacoes**: Estado `favorited` documentado no Bloco 3, Secao 12.
- **Status**: [ ]

---

## MT-6.4 - Migrar PerfilAnunciante para React Router

### TASK-067

- [ ] **TASK-067**
- **Titulo**: Mapear as secoes de PerfilAnunciante.jsx e criar subrotas equivalentes
- **Descricao**: Ler o arquivo `PerfilAnunciante.jsx` e documentar: (1) quais sao as secoes navegaveis via `paginaAtiva` state, (2) quais componentes renderiza cada secao, (3) qual e o menu de navegacao interno (`SidebarPerfil`). Com base nisso, definir as subrotas React Router correspondentes (ex: `/perfil-anunciante`, `/perfil-anunciante/imoveis`, `/perfil-anunciante/anuncios`).
- **Objetivo**: Plano de subrotas para PerfilAnunciante antes de implementar.
- **Arquivos afetados**: `PerfilAnunciante.jsx` (leitura)
- **Dependencias**: TASK-060
- **Prioridade**: ALTA
- **Complexidade**: MEDIA
- **Criterios de aceite**:
  - Lista de secoes de PerfilAnunciante documentada.
  - Mapa de subrotas definido.
  - Decisao sobre qual sidebar usar (PerfilSidebar oficial vs SidebarPerfil interna) confirmada.
- **Observacoes**: A05 da auditoria. Bloco 2 Par.6 - duas sidebars de perfil paralelas.
- **Status**: [ ]

---

### TASK-068

- [ ] **TASK-068**
- **Titulo**: Migrar PerfilAnunciante.jsx de state local para React Router
- **Descricao**: Refatorar `PerfilAnunciante.jsx` para usar subrotas reais do React Router em vez de `useState("paginaAtiva")`. Substituir `SidebarPerfil` interna por `PerfilSidebar` oficial. Adicionar as subrotas ao `App.jsx`. Cada secao do anunciante deve ter sua propria URL.
- **Objetivo**: PerfilAnunciante com navegacao real, deep link funcional e sidebar unificada.
- **Arquivos afetados**: `PerfilAnunciante.jsx` (modificar), `App.jsx` (modificar - adicionar subrotas), `PerfilSidebar.jsx` (verificar se atende o menu do anunciante)
- **Dependencias**: TASK-067, TASK-062
- **Prioridade**: ALTA
- **Complexidade**: ALTA
- **Criterios de aceite**:
  - `PerfilAnunciante` usa `<PerfilSidebar>` oficial (sem `SidebarPerfil` interna).
  - Cada secao tem URL propria acessivel via deep link.
  - Botao voltar do browser funciona para navegar entre secoes.
  - `paginaAtiva` state local nao existe mais.
- **Observacoes**: Esta e a task de maior risco da FASE-6 pela complexidade da migracao.
- **Status**: [ ]

---


---

# FASE-7 - Funcionalidades Transversais

---

## MT-7.1 - Implementar sistema de toast

### TASK-069

- [ ] **TASK-069**
- **Titulo**: Instalar e configurar o sistema de toast (sonner)
- **Descricao**: Verificar se a biblioteca `sonner` ja esta instalada no projeto. Se nao, adicionar ao `package.json`. Criar `src/components/feedback/ToastProvider.jsx` que envolve o `<Toaster>` do sonner. Integrar o `ToastProvider` em `main.jsx` ou `App.jsx` para que o toast esteja disponivel globalmente.
- **Objetivo**: Sistema de toast disponivel em toda a aplicacao.
- **Arquivos afetados**: `package.json` (se precisar instalar), `src/components/feedback/ToastProvider.jsx` (criar), `main.jsx` ou `App.jsx` (modificar)
- **Dependencias**: Nenhuma (pode iniciar apos FASE-6 concluida)
- **Prioridade**: CRITICA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - `sonner` disponivel no projeto.
  - `<Toaster>` renderiza na aplicacao.
  - Chamar `toast.success("teste")` exibe o toast visualmente.
- **Observacoes**: A01 da auditoria. Sonner e recomendado pela auditoria.
- **Status**: [ ]

---

### TASK-070

- [ ] **TASK-070**
- **Titulo**: Substituir todos os `alert()` nos Steps do CadastroImovel por toast + mensagem inline
- **Descricao**: Buscar globalmente por `alert(` em todos os arquivos do CadastroImovel (index.jsx e Steps 1-6). Para cada `alert()` encontrado: (1) remover o `alert()`, (2) adicionar `toast.error("mensagem")` para notificar o usuario, (3) se o erro e de campo obrigatorio, adicionar borda vermelha + texto de erro inline no campo afetado (sem depender apenas do toast).
- **Objetivo**: Zero `alert()` no fluxo de cadastro de imovel.
- **Arquivos afetados**: `src/pages/CadastroImovel/index.jsx`, `Step1.jsx`, `Step2.jsx`, `Step3.jsx`, `Step4.jsx`, `Step5.jsx`, `Step6.jsx`
- **Dependencias**: TASK-069, TASK-059
- **Prioridade**: CRITICA
- **Complexidade**: MEDIA
- **Criterios de aceite**:
  - Busca global por `alert(` no diretorio CadastroImovel retorna zero resultados.
  - Tentativa de avancar sem campo obrigatorio exibe mensagem inline com borda vermelha no campo.
  - Toast de erro aparece em adicao a mensagem inline.
- **Observacoes**: FA-003 e FA-004 da auditoria - erros de validacao devem ser inline, nao modal.
- **Status**: [ ]

---

## MT-7.2 - Criar tela de sucesso pos-publicacao

### TASK-071

- [ ] **TASK-071**
- **Titulo**: Decidir e implementar a tela de sucesso pos-publicacao
- **Descricao**: Com base na decisao de arquitetura (step 7 no mesmo componente ou rota separada `/perfil/publicacao-sucesso`), implementar a tela de confirmacao que e exibida apos o usuario clicar "Publicar" no Step 6. A tela deve exibir: (1) confirmacao visual de sucesso, (2) resumo do anuncio criado, (3) botoes de proximos passos ("Ver meu anuncio", "Criar outro anuncio", "Ir para o perfil").
- **Objetivo**: Tela de sucesso clara e com proximos passos apos publicacao.
- **Arquivos afetados**: `src/pages/CadastroImovel/Step6.jsx` ou `src/pages/PublicacaoSucesso.jsx` (criar conforme decisao), `App.jsx` (se rota separada)
- **Dependencias**: TASK-069, TASK-059
- **Prioridade**: ALTA
- **Complexidade**: MEDIA
- **Criterios de aceite**:
  - Apos clicar "Publicar" no Step 6, tela de sucesso e exibida.
  - A tela confirma que o anuncio foi publicado.
  - Botoes de proximos passos sao funcionais.
  - A tela usa o Layout global.
- **Observacoes**: A07 da auditoria. Decisao de arquitetura LAC pendente do Roadmap deve ser tomada antes de iniciar.
- **Status**: [ ]

---

## MT-7.3 - Criar pagina 404

### TASK-072

- [ ] **TASK-072**
- **Titulo**: Criar `src/pages/NotFound.jsx` e rota `*`
- **Descricao**: Criar o componente `src/pages/NotFound.jsx` com mensagem de "Pagina nao encontrada" e dois botoes: "Buscar imoveis" (navega para `/resultados`) e "Voltar ao inicio" (navega para `/`). Adicionar a rota `*` no `App.jsx` apontando para `NotFound`. A pagina deve usar o Layout global.
- **Objetivo**: Pagina 404 para qualquer URL invalida.
- **Arquivos afetados**: `src/pages/NotFound.jsx` (criar), `App.jsx` (modificar - adicionar rota `*`)
- **Dependencias**: TASK-060
- **Prioridade**: MEDIA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Acessar `/rota-invalida` exibe a pagina NotFound.
  - Botao "Buscar imoveis" navega para `/resultados`.
  - Botao "Voltar ao inicio" navega para `/`.
  - A pagina usa o Layout global (header e footer aparecem).
- **Observacoes**: B06 da auditoria.
- **Status**: [ ]

---

## MT-7.4 - Implementar fluxos alternativos

### TASK-073

- [ ] **TASK-073**
- **Titulo**: Implementar FA-001 - Recuperacao de rascunho ao entrar no CadastroImovel
- **Descricao**: Em `CadastroImovel/index.jsx`, ao montar o componente, verificar se existe rascunho no `localStorage` com a chave `cadastro_imovel_v1`. Se existir, exibir um banner ou modal: "Voce tem um rascunho salvo. Continuar de onde parou?". Se usuario aceitar, inicializar o `form` com os dados do rascunho. Se recusar, inicializar com `initialForm` e limpar o rascunho do localStorage.
- **Objetivo**: Usuario pode retomar formulario de onde parou.
- **Arquivos afetados**: `src/pages/CadastroImovel/index.jsx` (modificar)
- **Dependencias**: TASK-053, TASK-069
- **Prioridade**: ALTA
- **Complexidade**: MEDIA
- **Criterios de aceite**:
  - Preencher Step 2 do CadastroImovel, fechar o browser e reabrir exibe o banner de rascunho.
  - Aceitar o rascunho restaura os dados do form.
  - Recusar o rascunho inicia o form em branco e limpa o localStorage.
- **Observacoes**: FA-001 da auditoria. O salvamento automatico ja e feito pela TASK-053 (useEffect).
- **Status**: [ ]

---

### TASK-074

- [ ] **TASK-074**
- **Titulo**: Implementar FA-002 - Remocao de foto obrigatoria invalida botao Publicar
- **Descricao**: Em `CadastroImovel/Step2.jsx`, adicionar logica que: ao remover uma foto de um slot obrigatorio, marca o anuncio como `incompleto` no estado. Em `CadastroImovel/Step6.jsx`, verificar se algum slot obrigatorio esta vazio e desabilitar o botao "Publicar" e exibir aviso no checklist.
- **Objetivo**: Impossivel publicar anuncio com fotos obrigatorias faltando, mesmo apos voltar do Step 6.
- **Arquivos afetados**: `src/pages/CadastroImovel/Step2.jsx` (modificar), `src/pages/CadastroImovel/Step6.jsx` (modificar)
- **Dependencias**: TASK-055, TASK-059
- **Prioridade**: ALTA
- **Complexidade**: MEDIA
- **Criterios de aceite**:
  - Adicionar foto, avancar para Step 6, voltar para Step 2 e remover a foto, avancar para Step 6 novamente - botao "Publicar" esta desabilitado.
  - Checklist do Step 6 mostra o item de foto como incompleto.
- **Observacoes**: FA-002 da auditoria.
- **Status**: [ ]

---

### TASK-075

- [ ] **TASK-075**
- **Titulo**: Implementar FA-003 - Erro inline ao adicionar comodo duplicado
- **Descricao**: Em `CadastroImovel/Step1.jsx`, substituir o `alert()` de comodo duplicado por: (1) mensagem de erro inline abaixo do campo de nome do comodo ("Este comodo ja existe"), (2) borda vermelha no input, (3) botao "Confirmar" desabilitado enquanto o erro persiste. Remover o `alert()` completamente.
- **Objetivo**: Erro de comodo duplicado com feedback inline, sem `alert()`.
- **Arquivos afetados**: `src/pages/CadastroImovel/Step1.jsx` (modificar)
- **Dependencias**: TASK-054, TASK-069
- **Prioridade**: MEDIA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Tentar adicionar comodo com nome duplicado exibe erro inline (sem `alert()`).
  - Input fica com borda vermelha.
  - Botao "Confirmar" fica desabilitado.
  - Corrigir o nome remove o erro.
- **Observacoes**: FA-003 da auditoria.
- **Status**: [ ]

---

### TASK-076

- [ ] **TASK-076**
- **Titulo**: Implementar FA-004 - Scroll e erro inline em campos obrigatorios
- **Descricao**: Em `CadastroImovel/Step3.jsx` (e outros steps com validacao), substituir `alert()` de campo obrigatorio por: (1) scroll automatico ate o primeiro campo invalido, (2) borda vermelha no campo, (3) mensagem "Campo obrigatorio" abaixo do campo. RN-005 ja tem a logica de validacao - apenas alterar o mecanismo de feedback.
- **Objetivo**: Validacao de campos obrigatorios com feedback inline e scroll automatico.
- **Arquivos afetados**: `src/pages/CadastroImovel/Step3.jsx` (modificar), outros Steps com validacao
- **Dependencias**: TASK-056, TASK-069
- **Prioridade**: MEDIA
- **Complexidade**: MEDIA
- **Criterios de aceite**:
  - Clicar "Proximo" sem CEP no Step 3 foca no campo CEP com borda vermelha + mensagem (sem `alert()`).
  - Scroll automatico leva o usuario ao campo invalido.
  - Corrigir o campo remove o erro.
- **Observacoes**: FA-004 da auditoria.
- **Status**: [ ]

---

### TASK-077

- [ ] **TASK-077**
- **Titulo**: Implementar integracao ViaCEP no Step 3
- **Descricao**: Em `CadastroImovel/Step3.jsx`, adicionar logica no `onBlur` do campo CEP: (1) validar se o CEP tem 8 digitos, (2) fazer fetch para `https://viacep.com.br/ws/{cep}/json/`, (3) se sucesso, preencher automaticamente `form.street`, `form.neighborhood`, `form.city`, `form.state`, (4) se CEP nao encontrado, exibir aviso inline "CEP nao encontrado. Preencha o endereco manualmente" com campos habilitados para edicao, (5) se API fora do ar ou timeout, exibir aviso "Nao foi possivel buscar o CEP. Preencha manualmente."
- **Objetivo**: CEP preenchido automaticamente via ViaCEP API.
- **Arquivos afetados**: `src/pages/CadastroImovel/Step3.jsx` (modificar)
- **Dependencias**: TASK-056, TASK-069
- **Prioridade**: ALTA
- **Complexidade**: MEDIA
- **Criterios de aceite**:
  - Digitar CEP valido e sair do campo preenche rua, bairro, cidade e estado automaticamente.
  - CEP invalido (menos de 8 digitos) exibe erro inline.
  - CEP nao encontrado exibe aviso inline com campos editaveis.
  - Falha de rede exibe aviso inline.
  - Nenhum `alert()` em qualquer cenario.
- **Observacoes**: A06 e FE-004 da auditoria. ViaCEP permite CORS publico.
- **Status**: [ ]

---


---

# FASE-8 - Polimento e Conformidade

---

## MT-8.1 - Corrigir semantica HTML

### TASK-078

- [ ] **TASK-078**
- **Titulo**: Corrigir `<Link>` dentro de `<Button>` na Home.jsx
- **Descricao**: Em `Home.jsx`, substituir o padrao `<Button><Link to="...">...</Link></Button>` pelo padrao correto do shadcn: `<Button asChild><Link to="...">...</Link></Button>`. Verificar todos os botoes da pagina que usam esse padrao incorreto.
- **Objetivo**: Semantica HTML correta nos botoes de navegacao da Home.
- **Arquivos afetados**: `Home.jsx`
- **Dependencias**: TASK-071 (todas as telas em estado final)
- **Prioridade**: BAIXA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Nenhum `<Link>` dentro de `<Button>` sem `asChild` em `Home.jsx`.
  - Os botoes continuam navegando corretamente.
  - B02 da auditoria resolvido.
- **Observacoes**: B02 da auditoria.
- **Status**: [ ]

---

### TASK-079

- [ ] **TASK-079**
- **Titulo**: Corrigir `<button>` dentro de `<Link>` e typo em Perfil.jsx
- **Descricao**: Em `Perfil.jsx`: (1) substituir `<Link><button>Alterar Dados</button></Link>` por `<Link className="...">Alterar Dados</Link>` com estilo de botao, (2) corrigir o typo `titulo="Meu Imoveis"` para `titulo="Meus Imoveis"`.
- **Objetivo**: Semantica HTML correta e typo corrigido em Perfil.jsx.
- **Arquivos afetados**: `Perfil.jsx`
- **Dependencias**: TASK-071
- **Prioridade**: BAIXA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Nenhum `<button>` dentro de `<Link>` em `Perfil.jsx`.
  - Texto "Meu Imoveis" inexistente no arquivo.
  - B01 e B03 da auditoria resolvidos.
- **Observacoes**: B01 e B03 da auditoria.
- **Status**: [ ]

---

### TASK-080

- [ ] **TASK-080**
- **Titulo**: Corrigir botao "Acessar com Google" em Login.jsx
- **Descricao**: Em `Login.jsx`, corrigir o botao "Acessar com Google": (1) alterar a cor de fundo para `#4285F4` (Google Blue) ou criar um token `--color-google-blue` no @theme, (2) substituir o icone `Globe` por um icone SVG adequado para OAuth/Google. Nota: esta alteracao e apenas visual - autenticacao real e escopo futuro.
- **Objetivo**: Botao Google com cor e icone corretos.
- **Arquivos afetados**: `Login.jsx`
- **Dependencias**: TASK-071
- **Prioridade**: BAIXA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Botao "Acessar com Google" usa cor azul (nao teal).
  - Icone nao e `Globe`.
  - B05 da auditoria resolvido.
- **Observacoes**: B05 da auditoria. Autenticacao real e escopo futuro (MVP).
- **Status**: [ ]

---

## MT-8.2 - Corrigir icones e caminhos incorretos

### TASK-081

- [ ] **TASK-081**
- **Titulo**: Corrigir icones errados no footer (MapPin -> Mail e Clock)
- **Descricao**: Em `Layout.jsx` ou `Footer.jsx`, localizar os itens de contato/suporte que usam o icone `MapPin` incorretamente. Substituir pelo icone `Mail` (da Lucide) para e-mail e `Clock` para horario de atendimento.
- **Objetivo**: Icones do footer semanticamente corretos.
- **Arquivos afetados**: `Layout.jsx` ou `Footer.jsx`
- **Dependencias**: TASK-071
- **Prioridade**: BAIXA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Nenhum icone `MapPin` usado em contexto de e-mail ou horario no footer.
  - Icone `Mail` aparece ao lado do e-mail de contato.
  - Icone `Clock` aparece ao lado do horario de atendimento.
  - M09 da auditoria resolvido.
- **Observacoes**: M09 da auditoria.
- **Status**: [ ]

---

### TASK-082

- [ ] **TASK-082**
- **Titulo**: Corrigir caminho do logo em RecuperarSenha.jsx
- **Descricao**: Em `RecuperarSenha.jsx`, corrigir o caminho da imagem do logo de `logoFundoVerde.svg` (relativo, incorreto) para `/logoFundoVerde.svg` (absoluto, a partir do diretorio `public/`). Verificar se o arquivo existe em `public/` antes de corrigir.
- **Objetivo**: Logo carrega corretamente na pagina de recuperacao de senha.
- **Arquivos afetados**: `RecuperarSenha.jsx`
- **Dependencias**: TASK-071
- **Prioridade**: BAIXA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Logo carrega sem erro de 404 na pagina RecuperarSenha.
  - M10 da auditoria resolvido.
- **Observacoes**: M10 da auditoria.
- **Status**: [ ]

---

## MT-8.3 - Implementar titles por pagina e verificacao final

### TASK-083

- [ ] **TASK-083**
- **Titulo**: Adicionar `document.title` descritivo em todas as paginas principais
- **Descricao**: Adicionar `document.title = "..."` via `useEffect` (sem dependencias, executado uma vez ao montar) nas seguintes paginas: Home (`"Aluguel360 - Encontre seu imovel"`), ResultadosPesquisa (`"Resultados da Busca - Aluguel360"`), VisualizarImoveis (`"${imovel.nome} - Aluguel360"`), Login (`"Entrar - Aluguel360"`), CadastroUsuario (`"Criar Conta - Aluguel360"`), RecuperarSenha (`"Recuperar Senha - Aluguel360"`), Perfil (`"Meu Perfil - Aluguel360"`), CadastroImovel (`"Anunciar Imovel - Aluguel360"`).
- **Objetivo**: Cada pagina tem um titulo unico e descritivo para SEO e usabilidade.
- **Arquivos afetados**: Todos os arquivos das paginas listadas
- **Dependencias**: TASK-071
- **Prioridade**: BAIXA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Cada pagina principal exibe um titulo unico na aba do browser.
  - VisualizarImoveis usa o nome do imovel carregado no titulo.
  - B08 da auditoria resolvido.
- **Observacoes**: B08 da auditoria. Usar `useEffect` simples - documentar que pode ser migrado para react-helmet-async no futuro.
- **Status**: [ ]

---

### TASK-084

- [ ] **TASK-084**
- **Titulo**: Verificacao final - busca global por padroes proibidos
- **Descricao**: Realizar buscas globais no projeto para confirmar que todos os itens foram corrigidos: (1) `alert(` - deve retornar zero resultados, (2) `href="#"` - deve retornar zero resultados fora de contextos validos, (3) `#1A535C`, `#2C7E7B`, `#4ECDC4`, `#F0F4F8` como valores inline - deve retornar zero, (4) `<Link>` filho direto de `<Button>` sem `asChild`, (5) `<button>` filho direto de `<Link>`.
- **Objetivo**: Confirmacao de conformidade com todos os criterios da reestruturacao.
- **Arquivos afetados**: Busca global em `src/`
- **Dependencias**: TASK-083
- **Prioridade**: CRITICA
- **Complexidade**: BAIXA
- **Criterios de aceite**:
  - Todas as 5 buscas globais retornam zero resultados problematicos.
  - Relatorio de verificacao documentado.
- **Observacoes**: Task de verificacao final - nao gera codigo, apenas confirma conformidade.
- **Status**: [ ]

---


---

# Apendice - Indice de Tasks por ID

| ID | Fase | Titulo Resumido |
|---|---|---|
| TASK-001 | FASE-0 | Auditar imports de App.css |
| TASK-002 | FASE-0 | Deletar App.css |
| TASK-003 | FASE-0 | Criar diretorios src/lib/mock/ e src/lib/hooks/ |
| TASK-004 | FASE-0 | Extrair dados de imoveis para imoveis.json |
| TASK-005 | FASE-0 | Extrair dados do detalhe do imovel para imoveis.json |
| TASK-006 | FASE-0 | Criar avaliacoes.json |
| TASK-007 | FASE-0 | Criar usuarios.json e perfil.json |
| TASK-008 | FASE-0 | Criar anuncios.json |
| TASK-009 | FASE-0 | Confirmar tokens base do @theme |
| TASK-010 | FASE-1 | Mapear usos de secondary-hover |
| TASK-011 | FASE-1 | Unificar secondary-hover com primary |
| TASK-012 | FASE-1 | Mapear usos do token action |
| TASK-013 | FASE-1 | Remover token action redundante |
| TASK-014 | FASE-1 | Adicionar --color-teal-light ao @theme |
| TASK-015 | FASE-1 | Adicionar escala tipografica ao @theme |
| TASK-016 | FASE-1 | Adicionar tokens de sombra ao @theme |
| TASK-017 | FASE-1 | Unificar tokens de radius no @theme |
| TASK-018 | FASE-1 | Migrar cores hardcoded de SiteHeader.jsx |
| TASK-019 | FASE-1 | Migrar cores hardcoded de Login.jsx |
| TASK-020 | FASE-1 | Migrar cores hardcoded de CadastroImovel.jsx |
| TASK-021 | FASE-1 | Migrar cores hardcoded de PerfilQualidade, PerfilMeusImoveis e PerfilMeusAnuncios |
| TASK-022 | FASE-1 | Migrar cores hardcoded de VisualizarImoveis.jsx (apenas cores) |
| TASK-023 | FASE-2 | Criar hook useImoveis.js |
| TASK-024 | FASE-2 | Criar hook useAuth.js |
| TASK-025 | FASE-2 | Mapear schemas das 3 versoes de CardImovel |
| TASK-026 | FASE-2 | Criar variante default do CardImovel unificado |
| TASK-027 | FASE-2 | Adicionar variante compact ao CardImovel |
| TASK-028 | FASE-2 | Adicionar variante detailed ao CardImovel |
| TASK-029 | FASE-2 | Atualizar ResultadosPesquisa para CardImovel unificado |
| TASK-030 | FASE-2 | Configurar rota /visualizar-imoveis/:id |
| TASK-031 | FASE-3 | Mapear sub-componentes inline de VisualizarImoveis |
| TASK-032 | FASE-3 | Criar estrutura base de VisualizarImoveis/index.jsx |
| TASK-033 | FASE-3 | Implementar galeria de fotos e modal de video em Tailwind |
| TASK-034 | FASE-3 | Implementar secao de detalhes do imovel em Tailwind |
| TASK-035 | FASE-3 | Implementar secao de avaliacoes em Tailwind |
| TASK-036 | FASE-3 | Implementar formulario de contato em Tailwind |
| TASK-037 | FASE-3 | Implementar imoveis relacionados com CardImovel detailed |
| TASK-038 | FASE-3 | Substituir href="#" por Link em VisualizarImoveis |
| TASK-039 | FASE-3 | Adicionar alt descritivo nas imagens de VisualizarImoveis |
| TASK-040 | FASE-4 | Adicionar estado de filtros em ResultadosPesquisa |
| TASK-041 | FASE-4 | Implementar logica de filtragem do array de imoveis |
| TASK-042 | FASE-4 | Implementar estados loading, empty e error em ResultadosPesquisa |
| TASK-043 | FASE-4 | Conectar BarraFiltros ao estado de filtros |
| TASK-044 | FASE-4 | Conectar FiltroLateral ao estado de filtros |
| TASK-045 | FASE-4 | Conectar FiltroPreco ao estado de preco |
| TASK-046 | FASE-4 | Conectar busca do SiteHeader ao React Router |
| TASK-047 | FASE-4 | Conectar filtros de categoria da Home ao React Router |
| TASK-048 | FASE-5 | Mapear estrutura completa de CadastroImovel.jsx |
| TASK-049 | FASE-5 | Criar src/components/forms/ e externalizar Shell.jsx |
| TASK-050 | FASE-5 | Externalizar TipCard.jsx |
| TASK-051 | FASE-5 | Externalizar TextField.jsx e TextAreaField.jsx |
| TASK-052 | FASE-5 | Externalizar CountField, RadioOption, FeatureToggle |
| TASK-053 | FASE-5 | Criar CadastroImovel/index.jsx orquestrador |
| TASK-054 | FASE-5 | Criar Step1.jsx |
| TASK-055 | FASE-5 | Criar Step2.jsx |
| TASK-056 | FASE-5 | Criar Step3.jsx |
| TASK-057 | FASE-5 | Criar Step4.jsx |
| TASK-058 | FASE-5 | Criar Step5.jsx |
| TASK-059 | FASE-5 | Criar Step6.jsx com checklist real |
| TASK-060 | FASE-6 | Ler e documentar estrutura de App.jsx |
| TASK-061 | FASE-6 | Criar PrivateRoute.jsx |
| TASK-062 | FASE-6 | Aplicar PrivateRoute nas rotas de perfil |
| TASK-063 | FASE-6 | Implementar logout() no AuthContext |
| TASK-064 | FASE-6 | Adicionar botao Logout no PerfilSidebar |
| TASK-065 | FASE-6 | Criar FavoritosContext.jsx |
| TASK-066 | FASE-6 | Integrar FavoritosContext ao CardImovel e VisualizarImoveis |
| TASK-067 | FASE-6 | Mapear secoes de PerfilAnunciante e criar subrotas |
| TASK-068 | FASE-6 | Migrar PerfilAnunciante para React Router |
| TASK-069 | FASE-7 | Instalar e configurar sonner (toast system) |
| TASK-070 | FASE-7 | Substituir alert() nos Steps por toast + mensagem inline |
| TASK-071 | FASE-7 | Criar tela de sucesso pos-publicacao |
| TASK-072 | FASE-7 | Criar NotFound.jsx e rota * |
| TASK-073 | FASE-7 | Implementar FA-001 - recuperacao de rascunho |
| TASK-074 | FASE-7 | Implementar FA-002 - remocao de foto invalida botao Publicar |
| TASK-075 | FASE-7 | Implementar FA-003 - erro inline comodo duplicado |
| TASK-076 | FASE-7 | Implementar FA-004 - scroll e erro inline em campos obrigatorios |
| TASK-077 | FASE-7 | Implementar integracao ViaCEP no Step 3 |
| TASK-078 | FASE-8 | Corrigir Link dentro de Button na Home |
| TASK-079 | FASE-8 | Corrigir button dentro de Link e typo em Perfil |
| TASK-080 | FASE-8 | Corrigir botao Google em Login.jsx |
| TASK-081 | FASE-8 | Corrigir icones errados no footer |
| TASK-082 | FASE-8 | Corrigir caminho do logo em RecuperarSenha |
| TASK-083 | FASE-8 | Adicionar document.title em todas as paginas |
| TASK-084 | FASE-8 | Verificacao final - busca global por padroes proibidos |

---

*Documento gerado com base nas auditorias Bloco 1-4 do Aluguel360. Total: 84 tasks distribuidas em 9 fases. Versao 1.0.*
