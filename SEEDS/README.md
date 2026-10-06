# SEEDS — Coleta de imóveis para dados de teste


Reunir até 15 imóveis anunciados publicamente que possuam informações suficientes para preencher integralmente os campos persistíveis do fluxo atual de cadastro.

Os dados serão usados posteriormente para implementar os seeds do banco local.

## Regra de inclusão

Um imóvel somente pode entrar na coleção quando a fonte pública informar todos os campos obrigatórios da ficha `dados.json`, especialmente os campos textuais:

- título;
- descrição;
- informações adicionais;
- tipo;
- área;
- endereço público completo;
- quantidade de todos os cômodos usados;
- aluguel;
- condição de negociação;
- condomínio;
- IPTU;
- outras taxas;
- garantia;
- características e comodidades.

Se qualquer campo necessário não estiver disponível na fonte, o imóvel deve ser descartado ou permanecer em `triagem/pendentes/`. Não usar valores inventados, defaults silenciosos ou textos genéricos como `Não informado` para completar a ficha.

## Dados que não serão coletados

- proprietário;
- corretor;
- telefone;
- e-mail;
- WhatsApp;
- CPF;
- perfil do anunciante;
- qualquer outro dado pessoal.

## Estrutura

```text
SEEDS/
├── imoveis/
   ├── imovel-001-slug/
   │   ├── dados.json
   │   └── midias/
   │       ├── foto_fachada01.ext
   │       ├── foto_sala01.ext
   │       └── foto_quarto01.ext
   └── imovel-002-slug/

```

## `dados.json`

É o arquivo canônico do imóvel. Ele deve conter somente dados que poderão alimentar.

Não incluir usuário, proprietário ou qualquer credencial.

## Mídias

Padrão de nomes:

```text
foto_fachada01.jpg
foto_sala01.jpg
foto_sala02.jpg
foto_quarto01.jpg
foto_suite01.jpg
foto_cozinha01.jpg
foto_banheiro01.jpg
foto_varanda01.jpg
foto_garagem01.jpg
foto_area_lazer01.jpg
foto_outro01.jpg
```

O campo `midias` em `dados.json` deve apontar para os nomes relativos dos arquivos.

## Status do inventário

- `pendente`: ainda falta validar algum campo;
- `completo`: todos os campos persistíveis foram confirmados;
- `descartado`: não atende aos critérios ou não pode ser usado.

Somente imóveis com status `completo` poderão ser usados na futura carga de seeds.
