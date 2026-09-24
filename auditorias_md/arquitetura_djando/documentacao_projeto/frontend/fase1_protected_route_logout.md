# Fase I — ProtectedRoute e Logout

**Data:** 24/09/2026  
**Status:** concluída

## PLANO [T-1.1.5/T-1.1.6]

1. Criar um guardião baseado em `useAuth` -> verificar carregamento e redirecionamento.
2. Envolver todas as rotas `perfil/*` -> verificar que páginas privadas não são filhas diretas sem proteção.
3. Passar o logout do contexto ao header -> verificar chamada visual e limpeza local.
4. Executar lint e build -> ambos devem terminar sem erros.

## Arquivos criados ou modificados

- Criado `src/components/ProtectedRoute.jsx`;
- Modificado `src/App.jsx`;
- Modificado `src/contexts/AuthContext.jsx`;
- Modificado `src/components/Layout.jsx`;
- Modificado `src/components/SiteHeader.jsx`.

## Implementação

`ProtectedRoute` consulta `isLoading` e `isAuthenticated` do `AuthContext`. Enquanto a sessão é restaurada, mostra uma mensagem de carregamento. Usuários não autenticados são redirecionados para `/login`, preservando a localização de origem no estado da navegação. Usuários autenticados recebem o conteúdo por meio de `Outlet`.

Todas as rotas `perfil/*`, incluindo `perfil/cadastro-imovel`, agora são filhas de `ProtectedRoute`.

O `Layout` passa a ação `logout` ao `SiteHeader`. O header autenticado exibe a ação `Sair` em desktop e mobile. O contexto chama o endpoint de logout e, em `finally`, limpa o usuário em memória. Se a API estiver indisponível, a sessão local também é encerrada sem rejeição não tratada.

## Validações executadas

| Verificação | Resultado |
|---|---|
| ESLint dos arquivos alterados | aprovado |
| `npm run build` | aprovado |
| Presença de `ProtectedRoute` | aprovado |
| Rotas privadas envolvidas | aprovado |
| `authApi.logout` conectado ao header | aprovado |

O build emite somente o aviso não bloqueante de chunk JavaScript acima de 500 kB.

## Teste manual do checkpoint

O usuário informou que executou no navegador, com a API local em funcionamento:

1. abrir `/perfil` em janela anônima e confirmar redirecionamento para `/login`;
2. autenticar um usuário;
3. recarregar a página e confirmar permanência na sessão;
4. clicar em `Sair`;
5. confirmar que `/perfil` volta a redirecionar para `/login`.

Resultado informado: aprovado. A Fase I está concluída e a Fase II foi liberada.
