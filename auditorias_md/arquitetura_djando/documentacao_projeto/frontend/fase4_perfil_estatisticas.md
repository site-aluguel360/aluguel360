# Fase IV — Perfil e estatísticas reais

**Data:** 24/09/2026  
**Status do bloco T-4.1:** concluído tecnicamente

## Implementação

`Perfil.jsx` agora consulta os endpoints autenticados `/users/me/` e `/users/me/stats/`. O componente apresenta loading e erro, adapta as iniciais e a data de cadastro, exibe os endereços retornados pelo usuário, estatísticas de imóveis e anúncios, visualizações, favoritos e qualidade média.

Os valores fictícios da tela principal foram removidos. O CPF não é exibido, pois não faz parte do serializer de leitura e sua exposição violaria a regra de segurança do projeto.

`EditProfile.jsx` agora carrega os dados reais e envia somente os campos permitidos por `UserUpdateSerializer`: `nome`, `telefone` e `data_nascimento`. O email permanece somente leitura, desabilitado no formulário e ausente do PATCH.

O cliente HTTP passou a desembalar até quatro níveis de envelopes `{ success, data }`, compatibilizando as respostas atuais do renderer sem alterar o backend.

## Validações

- ESLint de `api.js`, `Perfil.jsx` e `EditProfile.jsx`: aprovado.
- `npm run build`: aprovado.
- Verificação estática do contrato do PATCH: email ausente; campos permitidos presentes.
- Rotas `/users/me/` e `/users/me/stats/` sem token: HTTP 401, confirmando proteção.

## Próximo bloco

A próxima tarefa é integrar o CRUD de endereços em `PerfilEnderecos.jsx`, preservando o isolamento pelo `AddressViewSet` autenticado.
