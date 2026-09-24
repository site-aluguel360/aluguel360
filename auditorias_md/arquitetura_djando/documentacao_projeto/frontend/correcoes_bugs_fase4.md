# Correções de bugs — Fase IV

**Data:** 24/09/2026

## Retomada de anúncio pausado

O erro `No Listing matches the given query.` ocorria porque o `ListingViewSet.get_queryset()` aplicava o filtro público `status=PUBLICADO` também à action `publish`. Depois que o proprietário pausava um anúncio, o registro ficava com status `PAUSADO` e não era encontrado na tentativa de publicação.

A correção foi feita no backend, na regra correta de autorização: as actions `mine`, `publish` e `pause` agora consultam somente registros pertencentes ao usuário autenticado. As actions públicas continuam limitadas a anúncios `PUBLICADO`. Nenhuma permissão foi ampliada para outro usuário.

## Consulta de CEP em endereços

O formulário de `PerfilEnderecos.jsx` não importava nem chamava o módulo ViaCEP. A correção reutiliza `src/lib/viacep.js`: ao completar oito dígitos, o frontend consulta `https://viacep.com.br/ws/{cep}/json/`, preenche `logradouro`, `bairro`, `cidade`, `estado` e normaliza o CEP. O usuário recebe indicação de carregamento e mensagem quando o CEP é inválido ou não encontrado. A requisição é cancelada quando o CEP muda ou o componente é desmontado.

## Validações

- ESLint dos arquivos alterados: aprovado.
- Build do frontend: aprovado.
- `manage.py check`: aprovado.
- Suíte Django autodiscovery: nenhum teste descoberto no container atual; a tentativa por labels específicos falhou porque os módulos de teste não são pacotes importáveis.
- Contratos estáticos de queryset do proprietário e chamada ViaCEP: aprovados.
- ViaCEP real para `01001000`: HTTP 200, retornando Praça da Sé/SP.
