# Fase V — Mapeamento do cadastro e preparação de mídia

**Data de início:** 24/09/2026  
**Status:** em progresso

## Mapeamento explícito

Foram adicionados os adaptadores `toPropertyPayload(form)` e `toListingPayload(form, propertyId)`. O estado visual das seis etapas não é enviado diretamente para a API.

O Property recebe apenas os campos documentados pelo `PropertySerializer`: tipo, área, endereço, referência, features e cômodos. Os nomes visuais são convertidos para os nomes Django, incluindo `propertyType` para `tipo`, `area` para `area_m2`, `street` para `logradouro`, `number` para `numero` e `extraInfo` para o campo do anúncio.

O Listing recebe apenas os campos documentados por `ListingWriteSerializer`, mantendo criação e publicação como ações separadas. A publicação ainda não foi conectada ao botão final nesta etapa.

## Mídia

O cadastro agora preserva os objetos `File` separadamente das URLs `blob:` usadas somente para preview. Isso permite o envio multipart posterior sem tentar reenviar URLs locais do navegador.

`mediaApi.upload` cria `FormData`, envia `file`, `tipo`, vínculos de Property/Listing e nome opcional. O cliente HTTP não define manualmente `Content-Type`, preservando o boundary do navegador. Também foi disponibilizado `mediaApi.quota()`.

## Localização

A etapa de localização do cadastro consulta ViaCEP ao completar oito dígitos e preenche rua, bairro, cidade e estado.

## Validações

- Contratos estáticos de adaptadores e multipart: aprovados.
- ESLint e build: aprovados após remoção de imports legados não utilizados.
- Nenhuma publicação ou upload foi executado implicitamente.

## Próximo bloco

Conectar o botão final para criar Property em rascunho, criar Listing separado e publicar somente após confirmação explícita. Em seguida, integrar os arquivos preservados ao endpoint de mídia e substituir a tela `PerfilMidia.jsx` pelos dados reais.
