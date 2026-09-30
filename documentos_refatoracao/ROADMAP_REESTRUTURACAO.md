# ROADMAP DE REESTRUTURAÇÃO — Aluguel360

> **Fonte de verdade**: Auditorias auditoria_bloco1.md, auditoria_bloco2.md, auditoria_bloco3.md e auditoria_bloco4_final.md.
> **Data de elaboração**: 2026-07-02
> **Status do projeto antes da reestruturação**: NÃO AUTORIZADO para desenvolvimento — decisão do Principal Architect (Bloco 4, Seção 20).

---

## 1. Visão Geral da Reestruturação

O projeto Aluguel360 é uma plataforma B2C2B de locação de imóveis onde proprietários cadastram imóveis e geram anúncios, e inquilinos buscam e contatam. A auditoria identificou que o projeto possui um conceito de produto sólido e um diferencial técnico real (cadastro de imóvel com mídia obrigatória por cômodo), porém está estruturalmente comprometido por:

1. **Dois "produtos" dentro de um único projeto**: `VisualizarImoveis` é uma ilha completamente isolada do restante do sistema — tem sua própria navbar, footer, sistema de estilos (inline styles) e não usa o `Layout` global.
2. **God Files**: `CadastroImovel.jsx` (1.425 linhas) e `VisualizarImoveis.jsx` (686 linhas) concentram lógica, apresentação e sub-componentes num único arquivo cada.
3. **Três sistemas visuais paralelos**: Tailwind CSS (90% do projeto), inline styles com objeto `s` (VisualizarImoveis) e shadcn Card manual (Home).
4. **Cinco problemas críticos que bloqueiam o funcionamento básico**: fluxo do locatário quebrado (CardImovel sem Link), checklist falso no Step 6, sem logout, sem persistência de rascunho e VisualizarImoveis fora do Layout.
5. **Dados mock hardcoded dentro dos componentes**: impossível substituir por dados reais sem reescrever componentes.
6. **Ausência de proteção de rotas autenticadas**: qualquer usuário acessa qualquer rota de perfil.

A reestruturação não é uma reescrita total. O modelo de dados está bem modelado, o CadastroImovel multi-step tem lógica de negócio complexa que deve ser preservada e apenas reorganizada. O objetivo é normalizar a estrutura para que o projeto possa ser desenvolvido de forma consistente e segura.

---

## 2. Objetivos

| ID | Objetivo | Origem |
|---|---|---|
| OBJ-01 | Estabelecer um único sistema visual baseado nos tokens do @theme do index.css | Bloco 4, Seção 16–17 |
| OBJ-02 | Eliminar todos os God Files (acima de 500 linhas por arquivo) | Bloco 2, Seção 6 |
| OBJ-03 | Integrar VisualizarImoveis ao Layout global (eliminar navbar/footer inline) | Bloco 4, Seção 19, C02 |
| OBJ-04 | Corrigir os 5 bloqueios críticos (C01 a C05) antes de qualquer nova feature | Bloco 4, Seção 19 |
| OBJ-05 | Centralizar todos os dados mock em src/lib/mock/ (eliminar mocks inline nos componentes) | Bloco 4, Seção 18 |
| OBJ-06 | Unificar as 3 versões de card de imóvel em um único CardImovel com variantes | Bloco 4, Seção 19, M01 |
| OBJ-07 | Criar PrivateRoute para proteger rotas autenticadas | Bloco 4, Seção 19, M07 |
| OBJ-08 | Substituir todos os alert() nativos por sistema de toast (sonner) | Bloco 4, Seção 19, A01 |
| OBJ-09 | Implementar filtros funcionais em ResultadosPesquisa | Bloco 4, Seção 19, A03 |
| OBJ-10 | Implementar busca funcional conectada ao React Router | Bloco 4, Seção 19, A02 |
| OBJ-11 | Implementar lookup de CEP via ViaCEP no Step 3 do CadastroImovel | Bloco 4, Seção 19, A06 |
| OBJ-12 | Migrar PerfilAnunciante para React Router (remover navegação por state local) | Bloco 4, Seção 19, A05 |
| OBJ-13 | Implementar persistência de rascunho no CadastroImovel (localStorage) | Bloco 4, Seção 19, C03 |
| OBJ-14 | Criar tela de sucesso pós-publicação de anúncio | Bloco 4, Seção 19, A07 |
| OBJ-15 | Migrar cores hardcoded para tokens do @theme | Bloco 4, Seção 16 |
| OBJ-16 | Corrigir inconsistências de nomenclatura e padrões quebrados de HTML semântico | Bloco 4, Seção 17 |

---

## 3. Estado Desejado

Ao final da reestruturação, o projeto deve atingir o seguinte estado:

### Arquitetura de Arquivos Alvo

```
src/
  components/
    layout/          # Layout.jsx, SiteHeader.jsx, Footer.jsx (extraído do Layout)
    property/        # CardImovel.jsx (único, com variantes), CardRelacionado removido
    profile/         # PerfilSidebar.jsx, PerfilHeader.jsx, PerfilCard.jsx
    forms/           # Shell, TipCard, TextField, TextAreaField, CountField, RadioOption, FeatureToggle
    ui/              # shadcn (inalterado)
    feedback/        # ToastProvider (sonner), sistema de mensagens inline
  pages/
    Home/
    ResultadosPesquisa/
    VisualizarImoveis/
      index.jsx      # Integrada ao Layout global — sem navbar/footer próprios
    CadastroImovel/
      index.jsx      # Orquestrador + estado do form
      Step1.jsx
      Step2.jsx
      Step3.jsx
      Step4.jsx
      Step5.jsx
      Step6.jsx
    Perfil/
    PerfilAnunciante/
      index.jsx      # Roteamento via React Router (não via state local)
    auth/
      Login.jsx
      CadastroUsuario.jsx
      RecuperarSenha.jsx
    NotFound.jsx     # Rota * para 404
  lib/
    mock/
      imoveis.json
      anuncios.json
      avaliacoes.json
      usuarios.json
      perfil.json
    hooks/
      useImoveis.js
      useAuth.js
      useFavoritos.js
  router/
    PrivateRoute.jsx  # Proteção de rotas autenticadas
  context/
    AuthContext.jsx
    FavoritosContext.jsx
```

### Design System Alvo
- Um único sistema de tokens no @theme do index.css (cores, tipografia, sombras, radius)
- Zero cores hardcoded nos componentes
- Zero inline styles — VisualizarImoveis totalmente reescrita em Tailwind
- Escala tipográfica formalizada com CSS vars
- Tokens de sombra unificados

### Funcionalidades Corrigidas ao Final
- CardImovel navega para VisualizarImoveis por ID de rota
- VisualizarImoveis integrada ao Layout global (navbar/footer oficiais)
- Step 6 do CadastroImovel mostra checklist real derivado do form state
- Logout implementado e acessível no PerfilSidebar
- Rascunho salvo em localStorage durante CadastroImovel
- Filtros funcionais em ResultadosPesquisa
- Busca conectada ao React Router
- ViaCEP integrado no Step 3
- Tela de sucesso após publicação
- PerfilAnunciante com navegação por React Router
- FavoritosContext com verificação de autenticação
- Página 404 (rota *)
- PrivateRoute protegendo rotas de perfil e cadastro

---

## 4. Dependências entre Fases

```
FASE 0 (Limpeza e Fundação)
  └── FASE 1 (Design System e Tokens)
        └── FASE 2 (Camada de Dados Mock e CardImovel)
              ├── FASE 3 (VisualizarImoveis Integrada ao Layout)
              ├── FASE 4 (ResultadosPesquisa Funcional)
              └── FASE 5 (Decomposição do CadastroImovel)
                    └── FASE 6 (Autenticação, Perfil e Roteamento)
                          └── FASE 7 (Funcionalidades Transversais)
                                └── FASE 8 (Polimento e Conformidade)
```

**Regra geral**: nenhuma fase deve iniciar com componentes ou padrões que ainda serão alterados numa fase anterior não concluída. A FASE 3 não pode iniciar antes da FASE 2 porque VisualizarImoveis depende do CardImovel unificado (cards relacionados). A FASE 6 não pode iniciar antes da FASE 5 porque o PrivateRoute precisa referenciar as rotas do CadastroImovel já decompostas.

---

## 5. Ordem Correta de Execução

| Sequência | Fase | Nome |
|---|---|---|
| 1 | FASE 0 | Limpeza e Fundação |
| 2 | FASE 1 | Design System e Tokens |
| 3 | FASE 2 | Camada de Dados Mock e CardImovel |
| 4 | FASE 3 | Integração do Layout Global (VisualizarImoveis) |
| 5 | FASE 4 | ResultadosPesquisa Funcional |
| 6 | FASE 5 | Decomposição do CadastroImovel |
| 7 | FASE 6 | Autenticação, Perfil e Roteamento |
| 8 | FASE 7 | Funcionalidades Transversais |
| 9 | FASE 8 | Polimento e Conformidade |

---

## 6. Critérios para Iniciar Cada Fase

| Fase | Critérios de Entrada |
|---|---|
| FASE 0 | Nenhum pré-requisito — é a fase inicial |
| FASE 1 | FASE 0 concluída: App.css deletado, mocks movidos para src/lib/mock/, tokens base confirmados no @theme |
| FASE 2 | FASE 1 concluída: tokens de cor, tipografia, sombra e radius formalizados no @theme |
| FASE 3 | FASE 2 concluída: CardImovel unificado com variantes, camada mock estruturada |
| FASE 4 | FASE 2 concluída: CardImovel disponível para uso em ResultadosPesquisa |
| FASE 5 | FASE 1 concluída: componentes de forms externalizados em components/forms/ |
| FASE 6 | FASE 5 concluída: PrivateRoute pode referenciar as rotas do CadastroImovel já decompostas |
| FASE 7 | FASES 3, 4 e 6 concluídas: funcionalidades transversais dependem de todas as telas e do contexto de autenticação |
| FASE 8 | FASE 7 concluída: polimento final sem dependência de funcionalidades em aberto |

---

## 7. Critérios para Concluir Cada Fase

| Fase | Critérios de Saída |
|---|---|
| FASE 0 | App.css deletado; mocks em src/lib/mock/; @theme com todos os tokens base; zero dados mock dentro de componentes JSX |
| FASE 1 | Zero cores hardcoded nos componentes migrados; escala tipográfica formalizada; tokens de sombra e radius disponíveis; SiteHeader usando tokens |
| FASE 2 | CardImovel unificado com variantes compact, default e detailed; todas as 3 ocorrências antigas removidas; hooks useImoveis e useAuth criados |
| FASE 3 | VisualizarImoveis integrada ao Layout; navbar e footer inline deletados; zero inline styles; useParams() funcionando para carregar por ID |
| FASE 4 | Filtros em ResultadosPesquisa funcionando por estado React; busca do header navegando para /resultados?q=; estado empty exibido quando sem resultados |
| FASE 5 | CadastroImovel.jsx substituído por diretório CadastroImovel/ com index.jsx + Step1.jsx a Step6.jsx; components/forms/ populado; rascunho em localStorage; checklist real no Step 6 |
| FASE 6 | PrivateRoute protegendo rotas de perfil; FavoritosContext com verificação de auth; Logout no PerfilSidebar; PerfilAnunciante com React Router |
| FASE 7 | Toast system (sonner) substituindo todos os alert(); tela de sucesso pós-publicação; página 404 criada; fluxos alternativos FA-001 a FA-004 tratados |
| FASE 8 | Zero Link dentro de Button sem asChild; zero href="#" em VisualizarImoveis; typos corrigidos; ícones do footer corretos; sem resíduos do template Vite |

---

## 8. Marcos (Milestones)

| Milestone | Descrição | Fase que conclui |
|---|---|---|
| M1 — Fundação Limpa | O projeto pode ser iniciado sem resíduos do template Vite, com mocks centralizados e tokens base definidos | FASE 0 + FASE 1 |
| M2 — Componentes Base | CardImovel unificado disponível; camada mock estruturada | FASE 2 |
| M3 — Jornada do Locatário Desbloqueada | Usuário consegue ir de Home → ResultadosPesquisa → VisualizarImoveis sem bloqueios | FASE 3 + FASE 4 |
| M4 — Cadastro Decomposível | CadastroImovel em diretório com Steps separados; rascunho persistente; Step 6 real | FASE 5 |
| M5 — Autenticação e Perfil Funcionais | Login, logout, proteção de rotas, favoritos com auth, PerfilAnunciante com React Router | FASE 6 |
| M6 — Sistema Coerente | Toast system, tela de sucesso, 404, fluxos de exceção tratados | FASE 7 |
| M7 — Projeto Pronto para MVP | Zero problemas de polimento, semântica HTML correta, conformidade com design system | FASE 8 |

---

## 9. Estimativa de Impacto por Fase

| Fase | Arquivos Afetados (est.) | Impacto no Produto | Risco de Regressão |
|---|---|---|---|
| FASE 0 | 3–5 | Nenhum impacto visual | Muito baixo |
| FASE 1 | 15–20 | Nenhum impacto visual se tokens forem equivalentes | Baixo |
| FASE 2 | 8 | Visual do card altera se variantes forem diferentes | Médio |
| FASE 3 | 3–4 | Alto — tela inteiramente reescrita | Alto |
| FASE 4 | 4–5 | Funcionalidade nova — filtros passam a funcionar | Médio |
| FASE 5 | 10+ | Alto — God File dividido | Alto |
| FASE 6 | 8 | Alto — autenticação e favoritos afetam múltiplas telas | Médio-Alto |
| FASE 7 | 10+ | Melhora UX significativamente | Baixo |
| FASE 8 | 6–8 | Visual e semântica | Muito baixo |

---

## 10. Prioridades

| Prioridade | Fase | Justificativa |
|---|---|---|
| Crítica | FASE 0 | Fundação obrigatória — sem ela, nenhuma fase seguinte tem base estável |
| Crítica | FASE 3 | VisualizarImoveis fora do Layout é o maior risco arquitetural identificado na auditoria |
| Crítica | FASE 5 | CadastroImovel com 1.425 linhas é o maior risco de manutenção identificado |
| Alta | FASE 1 | Sem design system unificado, cada componente alterado nas fases seguintes continuará introduzindo inconsistências |
| Alta | FASE 2 | CardImovel é o componente mais reutilizado — unificá-lo antes das fases seguintes evita retrabalho |
| Alta | FASE 4 | Jornada do locatário sem filtros funcionais é o segundo maior ponto de abandono |
| Média | FASE 6 | Autenticação simulada funciona para desenvolvimento; PrivateRoute é necessário antes de entregar para QA |
| Média | FASE 7 | Toast e tela de sucesso melhoram UX mas não bloqueiam fluxos |
| Baixa | FASE 8 | Polimento final — nenhum item bloqueia funcionamento |

---

## 11. Componentes Afetados por Fase

### FASE 0 — Limpeza e Fundação
- App.css (deletar)
- index.css (@theme — confirmar tokens existentes)
- Criar src/lib/mock/, src/lib/hooks/
- Mover dados mock de: Perfil.jsx, PerfilAnunciante.jsx, ResultadosPesquisa.jsx, VisualizarImoveis.jsx, Home.jsx

### FASE 1 — Design System e Tokens
- index.css (adicionar tokens de tipografia, sombra, radius, cor faltante teal-light)
- SiteHeader.jsx (migrar cores #1A535C, #F0F4F8 para tokens)
- Login.jsx (migrar #4ECDC4, #1A535C)
- CadastroImovel.jsx (migrar #2C7E7B, #9c9c9c)
- PerfilQualidade.jsx (migrar #2C7E7B)
- PerfilMeusImoveis.jsx (migrar #1A535C, #F0F4F8, #D8E1E7)
- PerfilMeusAnuncios.jsx (migrar #4ECDC4, #D8E1E7)
- VisualizarImoveis.jsx — somente tokens de cor; inline style completo será tratado na FASE 3
- Tokens duplicados: unificar primary e secondary-hover (mesmo valor #1A535C); remover action ou destructive

### FASE 2 — Camada de Dados Mock e CardImovel
- src/lib/mock/imoveis.json
- src/lib/mock/anuncios.json
- src/lib/mock/avaliacoes.json
- src/lib/mock/usuarios.json
- src/lib/mock/perfil.json
- src/lib/hooks/useImoveis.js
- src/lib/hooks/useAuth.js
- CardImovel.jsx (unificação das 3 versões, adição de variantes)
- Home.jsx (remover card shadcn inline, usar CardImovel variant=compact)
- ResultadosPesquisa.jsx (ajustar para CardImovel unificado)

### FASE 3 — Integração do Layout Global
- VisualizarImoveis.jsx (completo — reescrita em Tailwind dentro do Layout)
- App.jsx / router.jsx (adicionar :id como parâmetro da rota)
- Layout.jsx (verificar que a rota de VisualizarImoveis está coberta)

### FASE 4 — ResultadosPesquisa Funcional
- ResultadosPesquisa.jsx (estado de filtros, lógica de filtragem, estados de UI: loading, empty, error)
- BarraFiltros.jsx (conectar ao estado)
- FiltroLateral.jsx (conectar ao estado)
- FiltroPreco.jsx (conectar ao estado)
- SiteHeader.jsx (conectar busca ao navigate('/resultados?q=...'))
- CardImovel.jsx (confirmar Link para /visualizar-imoveis/:id)

### FASE 5 — Decomposição do CadastroImovel
- CadastroImovel.jsx → dividido em: CadastroImovel/index.jsx, Step1.jsx a Step6.jsx
- src/components/forms/Shell.jsx
- src/components/forms/TipCard.jsx
- src/components/forms/TextField.jsx
- src/components/forms/TextAreaField.jsx
- src/components/forms/CountField.jsx
- src/components/forms/RadioOption.jsx
- src/components/forms/FeatureToggle.jsx
- CadastroImovel/index.jsx (persistência em localStorage)
- CadastroImovel/Step6.jsx (checklist derivado do form state real)
- MenuLogin.jsx (avaliar internalização)

### FASE 6 — Autenticação, Perfil e Roteamento
- src/router/PrivateRoute.jsx (novo)
- App.jsx / router (adicionar PrivateRoute nas rotas de perfil e cadastro)
- AuthContext.jsx (adicionar logout() funcional)
- PerfilSidebar.jsx (adicionar botão Logout)
- PerfilAnunciante.jsx (migrar de state local para React Router)
- src/context/FavoritosContext.jsx (novo)
- CardImovel.jsx (integrar verificação de auth no favorito)
- VisualizarImoveis/index.jsx (integrar FavoritosContext)

### FASE 7 — Funcionalidades Transversais
- Todos os componentes com alert(): CadastroImovel Steps 1–6
- src/components/feedback/ToastProvider.jsx (novo)
- CadastroImovel/Step6.jsx ou tela de sucesso separada (pós-publicação)
- src/pages/NotFound.jsx (novo)
- App.jsx / router (rota * para NotFound)
- CadastroImovel/index.jsx (fluxos alternativos FA-001 e FA-002)
- CadastroImovel/Step1.jsx (FA-003)
- CadastroImovel/Step3.jsx (FA-004 + integração ViaCEP)

### FASE 8 — Polimento e Conformidade
- Home.jsx (corrigir Link dentro de Button sem asChild)
- Perfil.jsx (corrigir button dentro de Link; typo "Meu Imóveis")
- VisualizarImoveis/index.jsx (substituir href="#" por Link React Router)
- Login.jsx (botão Google: cor correta e ícone correto)
- Layout.jsx ou Footer.jsx (ícones errados MapPin → Mail/Clock)
- RecuperarSenha.jsx (corrigir caminho do logo)
- CadastroImovel/Step2.jsx (useMemo em getRequiredPhotoSlots)
- Todas as páginas principais (document.title por rota)
- VisualizarImoveis/index.jsx (alt descritivo nas imagens)

---

## 12. Observações Importantes

### Inconsistências e Lacunas identificadas nas Auditorias

| ID | Lacuna/Inconsistência | Impacto no Planejamento |
|---|---|---|
| LAC-01 | PerfilMeusImoveis.jsx e PerfilMeusAnuncios.jsx são mencionados como "stubs" mas sem detalhe do conteúdo | Confirmar conteúdo antes de iniciar FASE 6 |
| LAC-02 | MenuLogin.jsx (707 bytes) — relação exata com fluxo de autenticação do CadastroImovel não completamente auditada | Confirmar comportamento antes de decidir internalizar (FASE 5) |
| LAC-03 | PerfilQualidade.jsx mencionado mas sem detalhe de estrutura ou dependências | Confirmar dependências antes de mover dados mock na FASE 2 |
| LAC-04 | VisualizarImoveis.jsx com 686 linhas — sub-componentes inline não totalmente mapeados | Ler arquivo completo antes de iniciar reescrita na FASE 3 |
| LAC-05 | Estrutura atual de App.jsx e rotas não auditada em detalhe | Ler App.jsx antes de iniciar FASE 6 |
| LAC-06 | Tokens CSS sugeridos (--text-xs a --text-2xl) podem conflitar com nomes nativos do Tailwind | Na FASE 1, usar nomes que não conflitem (ex: --font-size-xs) |
| LAC-07 | secondary-hover (#1A535C) com mesmo valor que primary — usos específicos não mapeados | Na FASE 1, mapear todos os usos antes de remover o token |

### Decisões de Arquitetura Pendentes (a confirmar antes das fases indicadas)

1. **Tela de sucesso pós-publicação** (antes da FASE 7): definir se será step 7 no mesmo componente ou rota separada /perfil/publicacao-sucesso.
2. **MenuLogin.jsx** (antes da FASE 5): decidir se internaliza dentro do CadastroImovel ou mantém como componente.
3. **PerfilCard.jsx** (antes da FASE 6): decidir se mantém, expande ou remove o wrapper genérico.

### Regras de Execução

- Nenhuma fase pode introduzir novas features não planejadas neste roadmap.
- Cada fase deve ser executada atomicamente.
- O estado de cada fase deve ser validado contra os critérios de saída antes de iniciar a próxima.
- Dados mock NUNCA devem ser escritos diretamente dentro de componentes JSX após a FASE 0.
- Todo componente novo criado nas fases seguintes deve usar exclusivamente tokens do @theme.

---

*Documento gerado com base nas auditorias Bloco 1–4 do Aluguel360. Versão 1.0.*
