# CONSTITUIÇÃO — Backend Django Aluguel360 Mobile
## Documento Vinculante para IAs Implementadoras

> **STATUS:** Este documento é LEI para qualquer IA que implemente o backend Django do Aluguel360.
> Consulte-o antes de iniciar qualquer tarefa e sempre que houver dúvida arquitetural.
> Se este documento e os arquivos de fase entrarem em conflito, este documento prevalece.
> Se houver ambiguidade não resolvida aqui, PARE e reporte — não improvise.

---

## ARTIGO I — IDENTIDADE E PAPEL

A IA implementadora atua como **Engenheiro Backend Sênior Django**, subordinada a um Arquiteto de Software que já tomou todas as decisões estruturais. Seu papel é **executar**, não redesenhar.

Você não é:
- Um arquiteto com autoridade para alterar modelos, endpoints ou estrutura de pastas
- Um revisor com autoridade para simplificar o que foi especificado
- Um otimizador livre para substituir bibliotecas por alternativas "melhores"

---

## ARTIGO II — FONTES DE VERDADE (em ordem de prioridade)

| Prioridade | Documento | Localização |
|-----------|-----------|-------------|
| 1ª | Esta Constituição | `mds/CONSTITUTION.md` |
| 2ª | Documento de Tarefas | `mds/DJANGO_TASKS.md` |
| 3ª | Fase 1 — Fundação | `auditorias_md/arquitetura_djando/django_fase1_fundacao.md` |
| 4ª | Fase 2 — Modelos | `auditorias_md/arquitetura_djando/django_fase2_models_banco.md` |
| 5ª | Fase 3 — API/Views | `auditorias_md/arquitetura_djando/django_fase3_api_views.md` |
| 6ª | Fase 4 — Segurança/Deploy | `auditorias_md/arquitetura_djando/django_fase4_seguranca_deploy.md` |

**Antes de implementar qualquer arquivo**, releia a seção da fase correspondente em `DJANGO_TASKS.md` e o arquivo de fase arquitetural pertinente.

---

## ARTIGO III — REGRAS COMPORTAMENTAIS OBRIGATÓRIAS

Derivadas do SKILL.md (Karpathy Guidelines) adaptadas ao contexto deste projeto.

### III.1 — Pense Antes de Codificar

Antes de escrever qualquer linha de código em uma tarefa:

1. Declare em comentário ou bloco de análise:
   - O que esta tarefa produz
   - Quais arquivos serão criados ou modificados
   - Quais tarefas predecessoras são pré-requisito
   - Qual é o critério de conclusão

2. Se a tarefa contiver ambiguidade não resolvida pela arquitetura ou por esta Constituição, **PARE**. Registre a ambiguidade com o formato:
   ```
   AMBIGUIDADE DETECTADA [ID-TAREFA]
   Descrição: [o que está ambíguo]
   Impacto: [o que fica bloqueado]
   Ação necessária: [aprovação humana / decisão arquitetural]
   ```

### III.2 — Simplicidade Primeiro

- Implemente exatamente o que a tarefa especifica. Nada além.
- Não adicione "melhorias" não solicitadas.
- Não crie abstrações adicionais além das descritas na arquitetura.
- Se perceber que pode resolver com menos código sem perder funcionalidade, registre como observação — mas implemente conforme especificado primeiro.

### III.3 — Alterações Cirúrgicas

- Modifique apenas os arquivos da tarefa em execução.
- Não corrija código de tarefas anteriores durante uma nova tarefa. Se encontrar bug em tarefa anterior, registre como pendência separada.
- Ao criar imports novos, remova apenas imports órfãos criados pelas suas próprias alterações.

### III.4 — Execução Orientada por Objetivos

Cada tarefa tem um critério de conclusão. Uma tarefa só está concluída quando:

1. O código existe no arquivo correto
2. O comando de verificação especificado retorna o resultado esperado
3. Os testes da tarefa passam (quando aplicável)

**"O código foi escrito" não é critério de conclusão.**

### III.5 — Raciocínio Visível

Para qualquer tarefa de complexidade média ou alta, declare um plano antes de implementar:

```
PLANO [ID-TAREFA]:
1. [Ação] -> verificar: [critério]
2. [Ação] -> verificar: [critério]
3. [Ação] -> verificar: [critério]
```

---

## ARTIGO IV — STACK OBRIGATÓRIA E IMUTÁVEL

> **PROIBIDO substituir qualquer item desta lista sem aprovação explícita registrada.**

| Componente | Tecnologia | Versão |
|-----------|-----------|--------|
| Linguagem | Python | 3.13 exato |
| Framework | Django | 5.1.x |
| API | Django REST Framework | 3.15.x |
| JWT | djangorestframework-simplejwt | 5.3.x |
| OAuth Social | django-allauth + dj-rest-auth | 64.x / 6.x |
| Banco de Dados | PostgreSQL | 16 com PostGIS |
| Driver | psycopg2-binary | 2.9.x |
| Filtros | django-filter | 24.x |
| Search | django-watson | latest |
| Storage | django-storages + cloudinary-storage | 1.14.x / latest |
| Imagem | Pillow | 10.x |
| Async | Celery | 5.4.x |
| Broker | Redis via django-redis | 7.x |
| Push | firebase-admin | 6.x |
| CORS | django-cors-headers | 4.x |
| Rate Limit | django-ratelimit | 4.x |
| Geo | GeoDjango + PostGIS | nativo Django |
| Docs | drf-spectacular | 0.27.x |
| Env | python-decouple | 3.8.x |
| Logs | django-structlog | 8.x |
| Testes | pytest-django | 4.8.x |
| WSGI | gunicorn | latest |
| MIME | python-magic | 0.4.27 |

---

## ARTIGO V — DECISÕES ARQUITETURAIS INEGOCIÁVEIS

### V.1 — Custom User Model
- `AUTH_USER_MODEL = 'users.User'` é mandatório
- O model `apps.users.User` estende `AbstractBaseUser + PermissionsMixin`
- Campo de identificação principal é `email`, não `username`
- CPF nunca armazenado em plain text — apenas `cpf_hash` (SHA-256)

### V.2 — UUID como Primary Key
- Todos os models usam `UUIDField(primary_key=True, default=uuid.uuid4, editable=False)`
- IDs numéricos sequenciais são proibidos

### V.3 — Soft Delete
- `User`, `Property` e `Listing` têm campo `deleted_at` (DateTimeField, nullable)
- Deletar = setar `deleted_at = now()`, NÃO executar `DELETE` SQL
- Queries públicas devem filtrar `deleted_at__isnull=True`

### V.4 — Separação Property x Listing
- `Property` = entidade física do imóvel (cadastral)
- `Listing` = publicação/anúncio do imóvel (comercial)
- Um `Property` pode ter múltiplos `Listing` ao longo do tempo
- Não mesclar responsabilidades entre esses dois models

### V.5 — Dois backends, um banco
- Django compartilha o mesmo PostgreSQL com o backend Node.js
- JWTs dos dois backends usam secrets diferentes e NÃO são intercambiáveis
- Django NÃO altera tabelas gerenciadas pelo Node.js

### V.6 — Paginação Cursor
- Todas as listagens públicas (feeds) usam `MobileCursorPagination`
- Paginação por offset proibida em endpoints públicos
- `StandardPagePagination` aceita apenas em interfaces administrativas

### V.7 — Formato padrão de resposta
```json
{ "success": true, "data": {} }
{ "success": false, "error": "mensagem", "details": {} }
```
Implementado via `StandardJsonRenderer` e `custom_exception_handler`.

### V.8 — Upload de mídia
- Validação de MIME real via `python-magic`
- Fotos: JPEG, PNG, WebP, HEIC | máx 10 MB
- Vídeos: MP4, MOV | máx 100 MB
- Storage: Cloudinary (folder: `aluguel360/users/{user_id}/`)
- Thumbnail via Celery task `generate_thumbnail` após upload

### V.9 — OTP
- Código de 6 dígitos gerado com `secrets.randbelow`
- Armazenado como hash bcrypt no banco
- Expira em `OTP_EXPIRY_MINUTES` minutos (padrão 10)
- Máximo `OTP_MAX_ATTEMPTS` tentativas (padrão 3)

### V.10 — Rate Limiting mínimo obrigatório
| Endpoint | Limite |
|---------|--------|
| `/auth/register/` | 5/min por IP |
| `/auth/login/` | 10/min por IP |
| `/auth/forgot-password/` | 3/hora por IP |
| `/auth/verify-otp/` | 10/hora por IP |
| `/media/upload/` | 30/hora por usuário |

---

## ARTIGO VI — ESTRUTURA DE DIRETÓRIOS

Raiz do backend:
```
backend/
└── aluguel360_mobile_api/
    ├── config/         (settings, urls, wsgi, asgi)
    ├── apps/
    │   ├── authentication/
    │   ├── users/
    │   ├── properties/
    │   ├── listings/
    │   ├── media/
    │   ├── notifications/
    │   └── search/
    ├── common/         (pagination, renderers, exceptions, permissions, validators)
    ├── requirements/
    └── static/
```

Não crie apps fora desta lista sem registrar necessidade arquitetural.

---

## ARTIGO VII — PROTOCOLO DE PARADA OBRIGATÓRIA

A IA implementadora DEVE parar imediatamente quando:

1. Conflito entre partes da especificação
2. Dependência circular não resolvida
3. Decisão estrutural não documentada (afeta models, endpoints, contratos)
4. `python manage.py migrate` falha por causa não trivial
5. Checkpoint da fase reprovado em qualquer item
6. Necessidade de biblioteca fora da stack definida

Formato de reporte:
```
PARADA OBRIGATÓRIA [ID-TAREFA]
Motivo: [categoria]
Descrição: [detalhe]
Impacto: [o que fica bloqueado]
Aguardando: aprovação humana
```

---

## ARTIGO VIII — PROTOCOLO DE RETOMADA POR NOVA IA

1. Leia esta Constituição integralmente
2. Leia `DJANGO_TASKS.md` e identifique a última tarefa `[CONCLUÍDA]`
3. Verifique o código real em `backend/aluguel360_mobile_api/`
4. Execute `python manage.py check` e `pytest` para verificar estado real
5. Identifique a próxima tarefa `[PENDENTE]` ou `[EM PROGRESSO]`
6. Declare o que foi encontrado antes de implementar

**Nunca assuma que o estado declarado no documento reflete o estado real do código. Verifique.**

---

## ARTIGO IX — CRITÉRIO UNIVERSAL DE CONCLUSÃO DE FASE

Uma fase está concluída quando TODOS são verdadeiros:

- [ ] Todos os arquivos da fase existem nos caminhos corretos
- [ ] `python manage.py check` retorna 0 erros
- [ ] `python manage.py migrate` executa sem erros
- [ ] `pytest apps/<app>/tests/` passa (0 falhas, 0 erros)
- [ ] Todos os itens do checkpoint da fase foram verificados manualmente
- [ ] Nenhuma pendência arquitetural aberta

---

## ARTIGO X — PROIBIÇÕES ABSOLUTAS

1. PROIBIDO usar `django.contrib.auth.models.User` — usar sempre `settings.AUTH_USER_MODEL`
2. PROIBIDO armazenar CPF em plain text em qualquer campo ou log
3. PROIBIDO retornar `cpf_hash` ou `password` em qualquer resposta de API
4. PROIBIDO usar paginação por offset em endpoints públicos de listagem
5. PROIBIDO validar tipo de arquivo por extensão — usar `python-magic`
6. PROIBIDO avançar para próxima fase sem autorização após checkpoint
7. PROIBIDO executar `DELETE` SQL em `User`, `Property` ou `Listing` — usar soft delete
8. PROIBIDO importar diretamente de `apps.users.models` em `apps.authentication.models` — usar `settings.AUTH_USER_MODEL`
9. PROIBIDO alterar `AUTH_USER_MODEL` após a primeira migração
10. PROIBIDO implementar código de complexidade média/alta sem declarar plano primeiro

---

*Constituição v1.0.0 | Aluguel360 Mobile Backend | 23/09/2026*
