# Auditoria Aluguel360 — BLOCO 3

---

## 11 — Formato do Dataset (JSON Mock)

Estruturas JSON prontas para uso como mock de API no Frontend.

### `GET /imoveis` — lista de imóveis para busca
```json
[
  {
    "id": "imovel-001",
    "titulo": "Apartamento Moderno - Centro",
    "tipo": "Apartamento",
    "preco": 1900,
    "area": 60,
    "quartos": 1,
    "banheiros": 1,
    "mobiliado": false,
    "fotoPrincipal": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900",
    "endereco": "Rua Barão do Rio Branco, 476",
    "bairro": "Cidade Nova",
    "cidade": "Curitiba",
    "estado": "PR",
    "avaliacaoMedia": 4,
    "totalAvaliacoes": 1490,
    "features": {
      "pets": false,
      "mobiliado": false,
      "portaria": true,
      "condominio": true,
      "escolas": true,
      "transporte": true,
      "suite": false,
      "iptu": false
    },
    "status": "disponivel"
  }
]
```

---

### `GET /imoveis/:id` — detalhe do imóvel
```json
{
  "id": "imovel-001",
  "nome": "Apartamento Moderno - Centro",
  "tag": "Novo | A opção mais recomendada pelos usuários.",
  "preco": 1900,
  "endereco": "Rua Barão do Rio Branco, 476",
  "bairro": "Cidade Nova",
  "cidade": "Curitiba",
  "estado": "PR",
  "cep": "83540-000",
  "descricao": "Um apartamento com 1 dormitório, sala com varanda, cozinha americana e área de serviço.",
  "informacoesRelevantes": "Condomínio localizado no 3º andar. Portaria 24h.",
  "area": 60,
  "quartos": 1,
  "banheiros": 1,
  "tipo": "Apartamento",
  "proprietarioId": "user-001",
  "anuncioId": "anuncio-001",
  "despesas": {
    "iptu": 230,
    "garantia": "Caução",
    "agua": 45,
    "energia": 120,
    "condominio": 390,
    "manutencao": 100,
    "seguroIncendio": 30
  },
  "amenidades": [
    { "key": "wifi",     "label": "Wi-Fi" },
    { "key": "garagem",  "label": "Garagem" },
    { "key": "academia", "label": "Academia" },
    { "key": "portaria", "label": "Portaria 24h" }
  ],
  "midia": [
    { "tipo": "video", "thumb": null },
    { "tipo": "foto",  "thumb": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900" },
    { "tipo": "foto",  "thumb": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900" },
    { "tipo": "foto",  "thumb": "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900" }
  ],
  "fotoPrincipal": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200",
  "avaliacaoMedia": 4,
  "totalAvaliacoes": 1490,
  "distribuicaoEstrelas": { "5": 60, "4": 55, "3": 30, "2": 15, "1": 8 },
  "imoveisRelacionados": ["imovel-002", "imovel-003", "imovel-004"]
}
```

---

### `GET /anuncios/:id/avaliacoes` — lista de avaliações
```json
{
  "anuncioId": "anuncio-001",
  "avaliacaoMedia": 4.0,
  "total": 3,
  "items": [
    {
      "id": "aval-001",
      "autorNome": "Dina Siqueira",
      "autorAvatar": "DS",
      "estrelas": 4,
      "texto": "Imóvel bem localizado e arejado.",
      "criadaEm": "2026-01-15"
    },
    {
      "id": "aval-002",
      "autorNome": "Maria Silva",
      "autorAvatar": "MS",
      "estrelas": 3,
      "texto": "O apartamento é exatamente como nas fotos.",
      "criadaEm": "2026-02-10"
    }
  ]
}
```

---

### `GET /usuarios/:id/perfil` — dados do perfil do usuário autenticado
```json
{
  "id": "user-001",
  "nome": "Fulano de Tal",
  "email": "fulanodetal@gmail.com",
  "cpf": "123.***.***-10",
  "iniciais": "FT",
  "dataCadastro": "2023-02-01",
  "tipo": "pessoa_fisica",
  "creci": null,
  "telefone": "(86) 99812-3456",
  "cadastroCompleto": true,
  "enderecos": [
    {
      "id": "end-001",
      "rua": "Rua Elias Oka, 1354",
      "numero": "123",
      "bairro": "Irapuã",
      "cidade": "Floriano",
      "estado": "PI",
      "cep": "64800-971",
      "isPrincipal": true
    }
  ],
  "resumo": {
    "totalImoveis": 3,
    "imoveisAnunciados": 2,
    "rascunhos": 1,
    "alugados": 1,
    "totalFotos": 12,
    "totalVideos": 3,
    "notaQualidade": 8.5,
    "metodosSeguranca": 1,
    "dispositivosVinculados": 0,
    "alertasSeguranca": 0
  }
}
```

---

### `GET /usuarios/:id/imoveis` — imóveis do proprietário
```json
{
  "items": [
    {
      "id": "imovel-001",
      "titulo": "Casa Moderna no Centro",
      "tipo": "Casa",
      "endereco": "Rua Elisa Oka, 123",
      "preco": 2300,
      "status": "disponivel",
      "anuncioAtivo": true,
      "anuncioId": "anuncio-001"
    }
  ],
  "stats": {
    "total": 2,
    "anunciosAtivos": 2,
    "visualizacoes": 145
  }
}
```

---

### `GET /usuarios/:id/anuncios` — anúncios do proprietário
```json
{
  "items": [
    {
      "id": "anuncio-001",
      "imovelId": "imovel-001",
      "titulo": "Casa Moderna no Centro",
      "endereco": "Rua Elisa Oka, 123",
      "preco": 2300,
      "status": "ativo",
      "visualizacoes": 45,
      "mensagens": 3,
      "favoritos": 8,
      "notaQualidade": 8.0,
      "criadoEm": "2026-01-10"
    }
  ],
  "filtroDisponivel": ["todos", "ativo", "pausado", "encerrado", "rascunho"]
}
```

---

### `POST /anuncios` — criar anúncio (payload do form)
```json
{
  "imovelId": "imovel-001",
  "propertyType": "Casa",
  "area": 160,
  "rooms": [
    { "id": "quartos",   "label": "Quartos",   "value": 3 },
    { "id": "salas",     "label": "Salas",     "value": 1 },
    { "id": "banheiros", "label": "Banheiros", "value": 2 },
    { "id": "garagem",   "label": "Garagem",   "value": 1 }
  ],
  "features": {
    "pets": true, "mobiliado": false, "portaria": false,
    "condominio": false, "escolas": true, "transporte": true,
    "suite": false, "iptu": false
  },
  "endereco": {
    "cep": "64800-971",
    "rua": "Rua Elias Oka",
    "numero": "1354",
    "bairro": "Irapuã",
    "cidade": "Floriano",
    "estado": "PI",
    "complemento": "",
    "referencia": "Próximo à escola",
    "destaque": "Próximo ao centro"
  },
  "precos": {
    "aluguel": 2300,
    "negociavel": false,
    "condominio": 0,
    "condominioIncluido": false,
    "iptu": 150,
    "iptuIncluido": false,
    "outrasTaxas": "",
    "garantia": "Caução"
  },
  "anuncio": {
    "titulo": "Casa aconchegante com 3 quartos no centro",
    "descricao": "Imóvel amplo, bem iluminado e próximo a escolas.",
    "extraInfo": ""
  }
}
```

---

## 12 — Estados do Sistema / UI

### Anuncio.status
| Estado | Label UI | Cor sugerida | Ações disponíveis |
|---|---|---|---|
| `rascunho` | "Rascunho" | amber | Continuar edição, Excluir |
| `pendente_aprovacao` | "Em análise" | blue | Nenhuma (aguarda moderação) |
| `ativo` | "Ativo" | green/teal | Pausar, Editar, Excluir |
| `pausado` | "Pausado" | gray | Reativar, Editar, Excluir |
| `encerrado` | "Encerrado" | gray | Reabrir, Ver histórico |
| `reprovado` | "Reprovado" | red | Ver motivo, Editar, Resubmeter |
| `alugado` | "Alugado" | blue | Encerrar, Ver contrato |

---

### Imovel.status
| Estado | Label UI | Ações disponíveis |
|---|---|---|
| `disponivel` | "Disponível" | Criar anúncio, Editar, Excluir |
| `anunciado` | "Anunciado" | Ver anúncio, Editar imóvel |
| `alugado` | "Alugado" | Marcar como disponível |
| `inativo` | "Inativo" | Reativar, Excluir |

---

### Estados da UI — ResultadosPesquisa
| Estado | Condição | O que mostrar |
|---|---|---|
| `loading` | Aguardando resposta da API | Skeleton cards (3–6) |
| `success` | Lista retornada | Grid de CardImovel |
| `empty` | Nenhum resultado para filtros | Ilustração + "Nenhum imóvel encontrado" + CTA limpar filtros |
| `error` | Falha de rede | Toast/banner de erro + botão tentar novamente |

---

### Estados da UI — VisualizarImoveis
| Estado | Condição | O que mostrar |
|---|---|---|
| `loading` | Carregando dados do imóvel | Skeleton da galeria + card info |
| `success` | Dados carregados | Layout completo |
| `not_found` | ID inválido/imóvel removido | Página 404 contextual |
| `favorited` | Usuário favoritou | Ícone preenchido (vermelho) |
| `video_open` | Modal de vídeo aberto | Overlay escuro + player |
| `contact_sent` | Mensagem enviada | Toast de confirmação |

---

### Estados da UI — CadastroImovel
| Estado | Condição | O que mostrar |
|---|---|---|
| `intro` | step === 0 | Landing motivacional |
| `step_1..5` | step === 1..5 | Form do step + ProgressBar + TipCard |
| `step_2_incomplete` | fotos faltando | Alerta inline nos slots sem foto |
| `step_review` | step === 6 | Checklist real + Preview |
| `uploading` | Upload em andamento | Spinner no slot de foto/vídeo |
| `submitting` | POST em andamento | Botão desabilitado + spinner |
| `success` | Anúncio publicado | Tela de confirmação com próximos passos |
| `draft_saved` | Usuário saiu antes de publicar | Toast "Rascunho salvo automaticamente" |

---

### Estados da UI — Autenticação
| Estado | O que mostrar |
|---|---|
| `guest` | Botões Cadastrar + Entrar, "Quero anunciar" |
| `authenticated` | "Quero Anunciar", "Meu Perfil", "Meus anúncios", "Notificações" |
| `loading_auth` | Spinner no lugar dos botões |

---

### Estados da UI — CardImovel (global)
| Estado | Condição | Comportamento |
|---|---|---|
| `default` | Imóvel disponível | Exibe normalmente |
| `favorited` | Usuário favoritou | Ícone coração preenchido |
| `hovered` | Mouse sobre o card | Eleva sombra, -translate-y-1 |
| `loading_image` | Imagem ainda carregando | Skeleton cinza no lugar da foto |

---

## 13 — Fluxos Alternativos

### FA-001 — Usuário abandona o CadastroImovel no meio
**Gatilho**: fechar aba, navegar para outra página, ou sessão expirar.

**Situação atual**: o formulário é 100% local state. Qualquer abandono perde tudo.

**Comportamento esperado**:
1. Ao detectar saída (evento `beforeunload` ou `useNavigate` interceptado), exibir modal: "Você tem alterações não salvas. Deseja salvar o rascunho?"
2. Se aceitar → `POST /anuncios?status=rascunho` com dados parciais → toast "Rascunho salvo".
3. Se recusar → descartar e navegar.
4. Na próxima entrada em `/perfil/cadastro-imovel` → exibir banner: "Você tem um rascunho salvo. Continuar de onde parou?"

---

### FA-002 — Usuário remove uma foto após avançar de step
**Gatilho**: volta para Step 2 via "Editar fotos" no Step 6.

**Situação atual**: ao remover uma foto obrigatória, o Step 6 não reflete isso — checklist continua marcado.

**Comportamento esperado**:
1. Ao remover foto obrigatória, marcar o anúncio como `incompleto`.
2. Botão "Publicar" fica desabilitado até a foto ser re-adicionada.
3. Checklist do Step 6 reflete estado real: ✅ ou ⚠️ por categoria.

---

### FA-003 — Usuário tenta adicionar cômodo duplicado
**Gatilho**: digitar nome de cômodo que já existe (ex: "Quartos").

**Situação atual**: validação via `alert()` nativo.

**Comportamento esperado**:
1. Mensagem de erro inline abaixo do input: "Este cômodo já existe".
2. Input fica com borda vermelha.
3. Botão "Confirmar" desabilitado.

---

### FA-004 — Usuário tenta avançar sem preencher campo obrigatório
**Gatilho**: clicar em "Próximo" sem CEP/Rua/Bairro (Step 3) ou Aluguel (Step 4).

**Situação atual**: `alert()` nativo do browser.

**Comportamento esperado**:
1. Scroll automático até o primeiro campo inválido.
2. Campo com borda vermelha + mensagem inline: "Campo obrigatório".
3. Sem `alert()`.

---

### FA-005 — Filtros sem resultado em ResultadosPesquisa
**Gatilho**: usuário aplica filtros que retornam 0 imóveis.

**Situação atual**: não existe (filtros são decorativos).

**Comportamento esperado**:
1. Grid some; exibir ilustração + texto "Nenhum imóvel encontrado com esses filtros".
2. Botão "Limpar filtros" que reseta todos os estados de filtro.
3. Manter contagem "0 imóveis encontrados" no topo.

---

### FA-006 — Usuário tenta favoritar sem estar logado
**Gatilho**: clicar no ícone de coração em CardImovel ou VisualizarImoveis.

**Situação atual**: favorito é state local sem verificação de autenticação.

**Comportamento esperado**:
1. Verificar `isAuthenticated` antes de atualizar state.
2. Se não autenticado → exibir modal/toast: "Faça login para salvar favoritos" + botão "Entrar".
3. Após login → redirecionar de volta e aplicar o favorito.

---

### FA-007 — Proprietário tenta publicar anúncio sem todas as fotos
**Gatilho**: chegar ao Step 6 com fotos obrigatórias faltando (ex: cômodo adicionado mas foto não enviada).

**Situação atual**: a validação bloqueia no Step 2 ao clicar "Próximo", mas não impede voltar e remover fotos depois.

**Comportamento esperado**:
1. Botão "Publicar" desabilitado se qualquer slot obrigatório estiver vazio.
2. Checklist do Step 6 mostra quais itens faltam com ícone ⚠️.
3. Clicar em item faltante navega diretamente para o step correspondente.

---

### FA-008 — Editar anúncio existente (duplicação vs. edição)
**Gatilho**: proprietário clica em "Editar" em `PerfilMeusAnuncios`.

**Situação atual**: botão existe mas não tem rota (`#`).

**Comportamento esperado**:
1. Navegar para `/perfil/cadastro-imovel?id=anuncio-001&mode=edit`.
2. Form inicializado com dados do anúncio existente (não com `initialForm`).
3. Publicar sobrescreve o anúncio existente (não cria um novo).

---

## 14 — Fluxos de Exceção

### FE-001 — Sem conexão com a internet
**Onde pode ocorrer**: qualquer requisição (busca, login, upload, publicação).

| Momento | Comportamento esperado |
|---|---|
| Ao carregar ResultadosPesquisa | Banner fixo no topo: "Você está offline. Exibindo dados salvos." + grid com cache (se disponível) |
| Ao tentar publicar anúncio | Toast de erro: "Sem conexão. Seu rascunho foi salvo automaticamente." + botão "Tentar novamente" |
| Ao fazer login | Mensagem inline: "Não foi possível conectar. Verifique sua internet." |
| Ao carregar VisualizarImoveis | Skeleton não sai; exibir: "Não foi possível carregar o imóvel. Tente novamente." + botão retry |

---

### FE-002 — Upload de foto falhou
**Causa**: arquivo muito grande, formato inválido, timeout.

| Tipo de falha | Comportamento esperado |
|---|---|
| Arquivo > limite de tamanho | Erro inline no slot: "Imagem muito grande. Máx: 10MB." |
| Formato inválido | Erro inline: "Formato não suportado. Use JPG, PNG ou WEBP." |
| Timeout de upload | Slot volta para estado vazio + toast: "Falha ao enviar foto. Tente novamente." |
| Erro genérico de rede | Toast de erro com retry |

**Situação atual**: nenhum desses casos tratados. `URL.createObjectURL` é local — sem upload real.

---

### FE-003 — Upload de vídeo falhou ou formato inválido
| Tipo de falha | Comportamento esperado |
|---|---|
| Vídeo < 1 minuto | Após análise do arquivo: "O vídeo deve ter pelo menos 1 minuto." |
| Formato não suportado | Erro inline: "Use MP4, MOV ou AVI." |
| Arquivo muito grande | Erro inline: "Vídeo muito grande. Máx: 500MB." |
| Timeout | Toast com retry |

**Situação atual**: não há validação de duração ou formato além do `accept="video/*"`.

---

### FE-004 — Erro de busca de CEP
| Cenário | Comportamento esperado |
|---|---|
| CEP inválido (< 8 dígitos) | Erro inline: "CEP inválido." |
| CEP não encontrado | Aviso: "CEP não encontrado. Preencha o endereço manualmente." + campos habilitados para edição |
| API de CEP fora do ar | Aviso: "Não foi possível buscar o CEP. Preencha manualmente." |
| Timeout | Idem acima |

**Situação atual**: CEP não tem lookup — campos são preenchidos manualmente já.

---

### FE-005 — Sessão expirada durante operação
**Gatilho**: token JWT expirado (futuro) ao tentar publicar ou salvar.

**Comportamento esperado**:
1. Interceptor de API captura 401 → toast: "Sua sessão expirou. Faça login novamente."
2. Rascunho do formulário é salvo em `localStorage` antes do redirect.
3. Após re-login → redirecionar de volta com dados recuperados.

---

### FE-006 — Imóvel não encontrado (URL inválida)
**Gatilho**: acessar `/visualizar-imoveis?id=xyz` com ID inexistente.

**Comportamento esperado**:
1. API retorna 404.
2. Página exibe: "Este imóvel não está mais disponível." + botões "Buscar outros imóveis" e "Voltar ao início".

**Situação atual**: dados são hardcoded — erro nunca ocorre.

---

### FE-007 — Erro genérico de servidor (500)
**Comportamento esperado**:
- Toast: "Ocorreu um erro inesperado. Tente novamente em instantes."
- Logging silencioso para monitoramento (Sentry / similar).
- Não expor detalhes técnicos ao usuário.

---

## 15 — Escalabilidade do Produto

### Cenários futuros analisados

#### 15.1 Venda de imóveis
**Risco**: o modelo atual presume 100% aluguel. Os campos de preço, garantia e despesas são exclusivos de locação.

**Impacto no frontend**:
- `propertyType` precisaria de um campo `finalidade: 'aluguel' | 'venda' | 'temporada'`.
- Step 4 (preços) precisaria renderizar condicionalmente campos diferentes (aluguel: mensalidade; venda: preço à vista/financiamento).
- `Anuncio.garantia` não faz sentido para venda.
- **Riscos de refactoring**: médio. O `initialForm` teria que ser refatorado ou ter schemas separados por finalidade.

---

#### 15.2 Temporada (aluguel por diária/semana)
**Risco**: a lógica de preço é puramente mensal. Temporada exige calendário de disponibilidade, diária, mínimo de noites, etc.

**Impacto no frontend**:
- Novo componente de calendário (tipo DatePicker range) no cadastro.
- `preco` vira `precoPorNoite` ou `precoPorSemana`.
- `ResultadosPesquisa` precisa de filtros de período (check-in / check-out).
- **Risco**: alto. Temporada é essencialmente um produto diferente embutido na mesma UI.

---

#### 15.3 Sala Comercial / Espaço Profissional
**Impacto no frontend**:
- `propertyType` já tem "Outro" — absorve no curto prazo.
- Porém, os `featureOptions` são residenciais (pets, mobiliado, escolas). Para comercial seriam: estacionamento, ar-condicionado, CNPJ aceito, andar, elevador.
- **Risco**: baixo/médio. Requer versão condicional dos `featureOptions` por tipo de imóvel.

---

#### 15.4 Quartos / Pensões (subaluguéis)
**Impacto no frontend**:
- Exige gestão de múltiplos locatários no mesmo imóvel.
- Cada quarto seria um anúncio independente dentro de um imóvel-pai.
- A entidade `Imovel` precisaria de um campo `tipo_gestao: 'integral' | 'quarto'`.
- **Risco**: alto. Quebra a relação 1:N (imóvel → anúncio) para 1:N:N.

---

#### 15.5 Múltiplas cidades / regiões
**Impacto no frontend**:
- `ResultadosPesquisa` precisaria de paginação (hoje são 7 registros hardcoded).
- Header precisaria de seleção de cidade/região funcional.
- `CardImovel` precisaria exibir cidade/estado quando o contexto não é local.
- **Risco**: baixo. A estrutura de dados já tem `bairro`, `cidade`, `estado`. Requer busca real e paginação.

---

#### 15.6 Anunciante com múltiplos imóveis (imobiliária/corretor)
**Situação atual**: `PerfilAnunciante` já tem campo `creci` e `tipo: "Corretor Autônomo"` — a distinção existe.

**Risco**:
- `PerfilAnunciante.jsx` e `Perfil.jsx` são páginas separadas mas com mesma estrutura. À medida que crescem, virarão dois produtos distintos de backoffice.
- Gerenciar 15+ imóveis com a interface atual (lista simples em `PerfilMeusImoveis`) não escala.
- **Recomendação**: criar um sub-produto de "Backoffice do Anunciante" com tabela paginada, filtros, bulk actions e dashboard de analytics. Separar do perfil do usuário comum.

---

### Tabela de risco por cenário

| Cenário | Impacto UX | Impacto Arquitetura | Risco |
|---|---|---|---|
| Venda | Médio (novo Step 4) | Médio (schema condicional) | ⚠️ Médio |
| Temporada | Alto (calendário, diárias) | Alto (novo modelo de dados) | 🔴 Alto |
| Sala Comercial | Baixo (features condicionais) | Baixo (enum expandido) | 🟢 Baixo |
| Quartos/Pensão | Alto (relação 1:N:N) | Alto (quebra de modelo) | 🔴 Alto |
| Múltiplas cidades | Baixo (paginação) | Baixo (busca real) | 🟢 Baixo |
| Imobiliária/Corretor | Médio (backoffice separado) | Médio (roles distintos) | ⚠️ Médio |

---

*Aguardando "Continue" para o BLOCO 4 (Design System, Consistência Global, Preparação para Dev, Pontos Críticos e Relatório Executivo Final).*
