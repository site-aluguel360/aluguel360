# Auditoria de bugs e integrações — 25/09/2026

## Escopo

Auditoria dos fluxos de:

- Salvamento de anúncio e rascunho;
- Exclusão de anúncio;
- Fotos e mídias do perfil;
- Cards da tela de resultados;
- Filtros rápidos da Home;
- Visualização detalhada de imóvel;
- Contato do interessado com o anunciante;
- Visualização de contatos pelo locador.

**Regra de preservação:** a interface de `VisualizarImoveis/index_original.jsx` deve permanecer estruturalmente intacta. A refatoração deve substituir somente a origem e o formato dos dados.

---

## 1. Diagnóstico dos bugs reportados

### 1.1 Erro HTTP 500 ao salvar anúncio, embora o rascunho seja criado

#### Causa provável identificada

O fluxo atual de `CadastroImovel.jsx` é sequencial:

1. Cria ou atualiza `Property`;
2. Cria ou atualiza `Listing`;
3. Envia fotos e vídeo através de `mediaApi.upload`;
4. Limpa os arquivos locais;
5. Exibe sucesso.

O anúncio pode ser criado corretamente e o erro 500 ocorrer no passo posterior de mídia, especialmente na integração Cloudinary ou na geração assíncrona de thumbnail. Por isso o usuário vê o rascunho no banco mesmo recebendo erro.

#### Tarefas necessárias

- [ ] Separar o resultado de `Property`, `Listing` e mídia no frontend;
- [ ] Exibir mensagem específica: “Rascunho salvo, mas algumas mídias não foram enviadas”;
- [ ] Não repetir automaticamente o cadastro do anúncio quando somente o upload falhar;
- [ ] Persistir IDs de `property` e `listing` para permitir retry de mídia;
- [ ] Validar configuração Cloudinary e capturar exceções no backend;
- [ ] Fazer o endpoint de mídia retornar erro estruturado, sem ocultar a criação já concluída;
- [ ] Criar teste de criação de rascunho sem mídias;
- [ ] Criar teste de criação de rascunho com falha de mídia;
- [ ] Criar teste de retry de mídia após rascunho existente.

#### Observação arquitetural

Não é recomendável envolver criação de banco e upload externo em uma transação única, pois Cloudinary não participa da transação PostgreSQL. O fluxo deve ser explicitamente dividido em etapas idempotentes.

---

### 1.2 `No Listing matches the given query` ao remover anúncio

#### Causa confirmada

Em `apps/listings/views.py`, `get_queryset()` filtra por proprietário somente para as actions `mine`, `publish` e `pause`. Para `destroy`, o queryset cai no filtro público:

```python
return base.filter(status=ListingStatus.PUBLICADO)
```

Assim, anúncios `RASCUNHO`, `PAUSADO` ou `EXPIRADO` não são encontrados pelo DELETE, mesmo pertencendo ao usuário autenticado.

#### Tarefas necessárias

- [ ] Incluir `destroy`, `update` e `partial_update` no queryset privado do proprietário;
- [ ] Garantir que DELETE de qualquer status permitido seja soft delete;
- [ ] Garantir que usuário não consiga remover anúncio de outro proprietário;
- [ ] Retornar resposta consistente após soft delete;
- [ ] Atualizar a listagem privada para remover o item localmente somente após resposta 2xx;
- [ ] Criar testes para excluir anúncio publicado, pausado e rascunho;
- [ ] Criar teste de tentativa de exclusão por outro usuário.

#### Correção esperada no backend

A separação deve ser semelhante a:

```python
private_actions = ('mine', 'create', 'update', 'partial_update', 'destroy', 'publish', 'pause')
if self.action in private_actions:
    return base.filter(owner=self.request.user)
```

A lista pública deve continuar exibindo somente `PUBLICADO`.

---

### 1.3 Mídias do usuário não aparecem em `PerfilMidia`

#### Situação encontrada

O frontend chama corretamente:

```text
GET /api/v1/media/
GET /api/v1/media/quota/
```

O backend usa:

```python
Media.objects.filter(user=self.request.user)
```

O contrato aparentemente existe, mas ainda precisa de validação com token real e banco. Os pontos de risco são:

- Envelope/paginação da resposta de `/media/`;
- Upload criado antes da falha posterior e sem retorno visual consistente;
- Mídia persistida sem URL de thumbnail enquanto a task ainda não executou;
- Task Celery/Cloudinary falhando silenciosamente;
- Status 401/403 ao acessar a rota com token renovado;
- Quota atualizada de forma assíncrona, deixando a tela momentaneamente inconsistente.

#### Tarefas necessárias

- [ ] Testar `/api/v1/media/` autenticado com o usuário que possui arquivos;
- [ ] Confirmar se a resposta é array, paginação ou envelope e cobrir todos os formatos no normalizador;
- [ ] Exibir mídia usando `url`, mesmo quando `thumbnail_url` ainda estiver vazia;
- [ ] Exibir estado “processando miniatura” quando a mídia existe sem thumbnail;
- [ ] Verificar falhas de `generate_thumbnail.delay()` e Cloudinary;
- [ ] Garantir que uploads do cadastro e uploads do perfil utilizem o mesmo contrato;
- [ ] Atualizar quota após upload e exclusão sem depender somente de Celery;
- [ ] Criar teste de listagem autenticada por usuário;
- [ ] Criar teste de isolamento: usuário A não vê mídias do usuário B;
- [ ] Criar teste de upload, listagem e exclusão.

---

### 1.4 Cards de resultados com alturas diferentes

#### Causa no frontend

`CardImovel.jsx` possui altura variável no conteúdo, principalmente pela descrição sem limite de linhas e pelo container externo sem `h-full`/`flex`.

#### Tarefas necessárias

- [ ] Aplicar `h-full flex flex-col` no card;
- [ ] Aplicar `flex-1` no `CardContent`;
- [ ] Fixar altura do bloco de imagem, já existente;
- [ ] Limitar descrição com `line-clamp` e altura mínima consistente;
- [ ] Manter o botão de favorito sem navegar para o detalhe;
- [ ] Testar grid com títulos e descrições curtos e longos em desktop e mobile.

---

### 1.5 Filtros rápidos da Home

#### Situação encontrada

Os botões “Casas”, “Apartamentos”, “Kitnets”, “Mobiliado” e “Mais Opções” são atualmente apenas visuais.

#### Tarefas necessárias

- [ ] Usar `Link` ou `useNavigate` para `/resultados`;
- [ ] Casas: `tipo=CASA`;
- [ ] Apartamentos: `tipo=APARTAMENTO`;
- [ ] Kitnets: `tipo=KITNET`;
- [ ] Mobiliado: `mobiliado=true`;
- [ ] Mais Opções: abrir `/resultados` sem filtro adicional;
- [ ] Preservar a ordenação e permitir combinação posterior com os filtros laterais;
- [ ] Testar cada botão verificando URL e resultado da API.

---

## 2. Visualização de imóvel — estratégia de preservação

### Regra principal

Não reescrever a interface de `index_original.jsx`. A tela original contém funcionalidades que foram removidas na versão simplificada:

- Card lateral completo;
- Botão WhatsApp;
- Chat no Aluguel360;
- Enviar e-mail;
- Card de detalhes e custos;
- Avaliação geral;
- Distribuição de estrelas;
- Imóveis relacionados;
- Comentários dos hóspedes;
- Modal de vídeo;
- Navegação entre mídias;
- Favorito;
- Player de vídeo.

### Refatoração proposta

Criar uma camada de adaptação entre o payload do backend e o contrato visual original:

```text
API ListingDetailSerializer
        ↓
adaptListingDetailForVisualPage()
        ↓
contrato antigo de VisualizarImoveis
        ↓
index_original.jsx sem alteração estrutural
```

### Mapeamento previsto

| Contrato visual original | Origem real |
|---|---|
| `imovel.titulo` | `titulo` |
| `imovel.preco` | `aluguel` |
| `imovel.descricao` | `descricao` |
| `imovel.endereco` | `property_address.logradouro + numero + bairro` |
| `imovel.cidade` | `property_address.cidade + estado` |
| `imovel.quartos` | `property_rooms[tipo=quartos].quantidade` |
| `imovel.area` | `property_address.area_m2` |
| `imovel.midia` | `medias` convertidas para `tipo`, `thumb` e `url` visuais |
| `imovel.despesas.condominio` | `condominio_valor` |
| `imovel.despesas.iptu` | `iptu_valor` |
| `imovel.despesas.garantia` | `garantia` convertida para rótulo amigável |
| `imovel.informacoesRelevantes` | `extra_info` |
| avaliação média | endpoint/modelo de avaliações, ainda inexistente |
| distribuição de estrelas | endpoint/modelo de avaliações, ainda inexistente |
| relacionados | nova consulta pública de listings, excluindo o atual |

### Fallback obrigatório

Quando o backend não fornecer um campo, a interface deve exibir:

```text
Não informado
```

Não usar dados mockados como fallback de produção.

### Lacunas de backend para a tela

- [ ] Avaliações persistentes ainda não possuem modelo/endpoint identificado;
- [ ] Favoritos precisam usar as actions existentes do modelo `Favorite`;
- [ ] WhatsApp precisa de telefone real do anunciante ou deve ficar desabilitado com “Não informado”;
- [ ] E-mail precisa de política de exposição do e-mail do proprietário;
- [ ] Relacionados precisam de endpoint/query real;
- [ ] Mídias precisam ser normalizadas para o formato da interface original;
- [ ] O detalhe deve preservar o incremento de `views_count` já implementado.

---

## 3. Contato do interessado — `contato-anunciante`

### Situação atual

A tela é totalmente mockada:

- Imóvel mockado;
- Locador mockado;
- Usuário mockado;
- Histórico mockado;
- Respostas automáticas locais;
- `contatoService.enviarMensagem()` usa somente `setTimeout`.

Não existe endpoint de conversa/mensagem identificado nas rotas atuais do backend.

### Tarefas necessárias

#### Backend

- [ ] Criar modelo de conversa/thread;
- [ ] Criar modelo de mensagem;
- [ ] Associar conversa a `Listing`, interessado e proprietário;
- [ ] Criar endpoints para criar/obter conversa;
- [ ] Criar endpoint para listar mensagens;
- [ ] Criar endpoint para enviar mensagem;
- [ ] Criar paginação de mensagens;
- [ ] Criar status de leitura/entrega;
- [ ] Garantir que somente interessado e proprietário participantes vejam a conversa;
- [ ] Bloquear conversa para anúncio expirado/removido, conforme regra de negócio;
- [ ] Adicionar validações anti-spam e limite de envio.

#### Frontend

- [ ] Ler `listingId` da rota ou do state de navegação;
- [ ] Buscar o Listing real para o cartão superior;
- [ ] Buscar/criar a conversa real;
- [ ] Substituir histórico mockado por mensagens da API;
- [ ] Enviar mensagem via API;
- [ ] Remover respostas automáticas locais;
- [ ] Exibir loading, vazio, erro e retry;
- [ ] Persistir a conversa ao recarregar a página;
- [ ] Desabilitar anexos até existir endpoint de anexos de mensagem ou implementar o contrato.

---

## 4. Visualização de contatos do locador — `visualizacao-contatos`

### Situação atual

A tela também é totalmente mockada:

- Lista de imóveis mockada;
- Contatos mockados;
- Mensagens mockadas;
- Busca somente em memória;
- Estado de leitura somente local;
- Nenhum serviço HTTP de mensagens.

### Tarefas necessárias

- [ ] Criar endpoint autenticado de conversas recebidas pelo proprietário;
- [ ] Agrupar conversas por anúncio;
- [ ] Retornar resumo do interessado, última mensagem, data e não lidas;
- [ ] Criar endpoint para abrir uma conversa;
- [ ] Criar endpoint para marcar mensagens como lidas;
- [ ] Aplicar isolamento por proprietário;
- [ ] Implementar busca por nome, título do anúncio e texto da última mensagem;
- [ ] Substituir `MOCK_IMOVEIS` por payload adaptado;
- [ ] Substituir mensagens locais pela API;
- [ ] Adicionar estados de carregamento, erro e vazio já previstos visualmente.

---

## 5. Ordem de execução recomendada

### P0 — Corrigir regressões e dados existentes

1. Corrigir queryset privado de Listings para `destroy/update/partial_update`;
2. Diagnosticar e separar erro de upload do sucesso do rascunho;
3. Validar `/media/` autenticado e corrigir listagem/thumbnail;
4. Uniformizar delete e mensagens de erro no frontend;
5. Corrigir altura dos cards;
6. Implementar filtros rápidos da Home.

### P1 — Restaurar detalhe sem alterar interface

1. Manter `index_original.jsx` como base visual;
2. Criar `adaptListingDetailForVisualPage`;
3. Criar método `listingApi.detail` já existente e conectar ao adapter;
4. Mapear mídias, endereço, custos e cômodos;
5. Implementar fallback “Não informado”;
6. Implementar relacionados reais;
7. Conectar favorito e documentar avaliações ainda ausentes;
8. Validar todas as funções originais com dados reais.

### P2 — Mensageria

1. Modelos e permissões backend;
2. Endpoints de conversa e mensagens;
3. Integração do lado interessado;
4. Integração do lado locador;
5. Leitura, não lidas, busca e paginação;
6. Testes de isolamento entre usuários.

---

## 6. Critérios de aceite

- [ ] Salvar rascunho sem mídia não retorna 500;
- [ ] Falha de mídia não apaga nem duplica o rascunho;
- [ ] Excluir rascunho/pausado/publicado funciona com soft delete;
- [ ] Usuário não acessa anúncios ou mídias de outro usuário;
- [ ] Todas as mídias próprias aparecem em Perfil > Fotos e Mídias;
- [ ] Cards de resultados possuem altura uniforme;
- [ ] Filtros rápidos da Home redirecionam com query correta;
- [ ] Visualização mantém o layout e todas as funções de `index_original.jsx`;
- [ ] Campos ausentes exibem “Não informado”;
- [ ] Contato do interessado persiste mensagens;
- [ ] Locador visualiza somente conversas dos próprios anúncios;
- [ ] Build, lint e testes Django passam antes do teste manual.

## Conclusão

A próxima implementação deve começar pelos itens P0. A tela de visualização não deve ser novamente simplificada: o trabalho correto é restaurar a versão original e aplicar um adaptador de dados real, mantendo sua estrutura e seus componentes visuais.
