# Mapa de campos para futura implementação dos seeds

| Fonte em `dados.json` | Modelo/tabela | Campo | Observação |
|---|---|---|---|
| `property.tipo` | `Property` | `tipo` | Choices em maiúsculas |
| `property.area_m2` | `Property` | `area_m2` | Número positivo |
| `property.cep` | `Property` | `cep` | Somente imóvel, sem dado de pessoa |
| `property.logradouro` | `Property` | `logradouro` | Endereço público |
| `property.numero` | `Property` | `numero` | Obrigatório na coleção final |
| `property.bairro` | `Property` | `bairro` | Endereço público |
| `property.cidade` | `Property` | `cidade` | Endereço público |
| `property.estado` | `Property` | `estado` | UF |
| `property.complemento` | `Property` | `complemento` | Ex.: bloco, andar, unidade |
| `property.referencia` | `Property` | `referencia` | Ponto de referência público |
| `property.features` | `Property` | `features` | Oito booleanos do formulário |
| `rooms[]` | `PropertyRoom` | `tipo`, `quantidade` | Relação do imóvel |
| `listing.titulo` | `Listing` | `titulo` | Texto original normalizado |
| `listing.descricao` | `Listing` | `descricao` | Sem contato pessoal |
| `listing.extra_info` | `Listing` | `extra_info` | Informação adicional da fonte |
| `listing.aluguel` | `Listing` | `aluguel` | Decimal |
| `listing.negociavel` | `Listing` | `negociavel` | Booleano confirmado |
| `listing.condominio_valor` | `Listing` | `condominio_valor` | Decimal ou nulo se a fonte declarar isento |
| `listing.condominio_incluido` | `Listing` | `condominio_incluido` | Booleano confirmado |
| `listing.iptu_valor` | `Listing` | `iptu_valor` | Decimal ou nulo se declarado isento |
| `listing.iptu_incluido` | `Listing` | `iptu_incluido` | Booleano confirmado |
| `listing.outras_taxas` | `Listing` | `outras_taxas` | Texto obrigatório na coleta |
| `listing.garantia` | `Listing` | `garantia` | Choice do backend |
| `midias[]` | `Media` | arquivo/tipo | Upload local futuro, sem Cloudinary |

## Campos gerados no futuro, não coletados

- `owner` — usuário fictício criado pelo seed;
- `status` — definido pela rotina de seed;
- `published_at`, `created_at`, `updated_at` — definidos pelo banco/rotina;
- `location` — opcional e derivado, se houver regra aprovada;
- contadores e score — dados de teste controlados pela rotina;
- IDs — gerados pelo backend.
