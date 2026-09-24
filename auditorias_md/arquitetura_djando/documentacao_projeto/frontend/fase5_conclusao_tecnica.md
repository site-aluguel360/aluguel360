# Fase V — Cadastro e Mídia reais

**Data:** 24/09/2026  
**Status técnico:** concluído

## Cadastro de imóvel

A tela `CadastroImovel.jsx` foi integrada ao backend. O fluxo foi dividido em salvamento de rascunho e publicação explícita.

- **Salvar rascunho:** cria o `Property` (se novo), cria/atualiza o `Listing`, envia os arquivos preservados e mantém o status atual (RASCUNHO). Os arquivos são limpos do estado local após o upload bem-sucedido para evitar reenvio duplicado.
- **Publicar Anúncio:** executa a mesma sequência do rascunho e, ao final, invoca a action `publish` do backend para tornar o anúncio público e definir as datas de vigência.

Os dados são mapeados pelos adaptadores `toPropertyPayload` e `toListingPayload`, garantindo que apenas campos permitidos sejam enviados.

## Mídias e Quota

A tela `PerfilMidia.jsx` foi totalmente integrada. Ela lista as mídias do usuário, permite a remoção e o upload direto de arquivos via `multipart/form-data`.

A quota de armazenamento é consultada em `/media/quota/` e exibida visualmente (uso total, fotos, vídeos e porcentagem). O frontend valida o tipo de arquivo (JPEG, PNG, WebP, HEIC, MP4, MOV) e o tamanho máximo (10MB para fotos, 100MB para vídeos) antes do envio.

## Ajuste no Backend

Foi corrigida a duplicidade na atribuição do proprietário em `PropertyViewSet.perform_create`. Como o `PropertySerializer` já define o `owner` pelo contexto da request, a view passou a chamar apenas `serializer.save()`, evitando erros de argumento duplicado.

## Validações

- ESLint e build do frontend: aprovados.
- Contratos de rascunho, publicação, multipart e quota: aprovados.
- Proteção de rotas privadas: confirmada em blocos anteriores.
- `manage.py check` no backend: aprovado.
- Delegacia de owner no backend: confirmada pelo código.

## Teste manual pendente

Requer a criação de um imóvel completo pelo wizard de seis etapas, conferindo:
1. Consulta de CEP;
2. Envio de fotos e vídeo;
3. Salvamento de rascunho;
4. Publicação final;
5. Verificação da quota e remoção na tela de mídias.
