# Regras de validação da coleta

## Princípio

A coleção final deve conter somente imóveis cuja fonte pública permita preencher todos os campos armazenáveis pelo fluxo atual. Não preencher ausências com valores fictícios, `null`, `0`, string vazia ou `Não informado` quando o campo for textual obrigatório.

## Campos obrigatórios confirmados na fonte

### Imóvel

- tipo;
- área em m²;
- CEP;
- logradouro;
- número;
- bairro;
- cidade;
- estado;
- complemento ou indicação pública equivalente;
- ponto de referência;
- todos os oito indicadores de características.

### Cômodos

- quantidade de quartos;
- suítes;
- banheiros;
- salas;
- vagas/garagem;
- varandas;
- outros cômodos, quando exibidos.

### Anúncio

- título;
- descrição completa;
- informações adicionais;
- aluguel;
- negociável;
- valor e regra do condomínio;
- valor e regra do IPTU;
- outras taxas;
- garantia.

### Mídia

- pelo menos uma foto pública utilizável;
- ambiente identificável em cada foto;
- uma foto de destaque.

## Normalizações permitidas

- moeda brasileira para número decimal;
- CEP para `00000-000`;
- UF para duas letras maiúsculas;
- conversão dos rótulos de garantia para os choices do backend;
- renomeação técnica das fotos sem alterar seu conteúdo;
- remoção de telefone, e-mail e dados pessoais da descrição.

## Normalizações proibidas

- estimar CEP, número, área, taxas ou quantidades;
- inventar amenidades;
- escrever descrições genéricas para preencher campos;
- copiar nome ou contato do anunciante;
- misturar dados de anúncios diferentes;
- usar o default do formulário para esconder ausência da fonte.

## Critério de descarte

Se a origem não possuir um campo obrigatório, mover a pasta para `triagem/pendentes/` com um `coleta.txt` explicando o campo ausente. Só mover para `imoveis/` quando todos os critérios forem validados.
