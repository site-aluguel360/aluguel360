# Fase II — Recuperação de Senha e OTP

**Data:** 24/09/2026  
**Status:** em progresso

## PLANO [T-2.2.1]

1. Conferir os serializers Django -> usar `email`, `codigo`, `nova_senha` e `confirmar_nova_senha`.
2. Substituir avanço fictício de etapas -> cada etapa deve aguardar resposta real da API.
3. Implementar estados de loading e erros por campo -> preservar mensagens do renderer.
4. Limpar email, OTP e senhas após sucesso -> não manter dados sensíveis na tela.
5. Executar lint e build -> ambos devem passar.

## Alteração realizada

A tela `src/pages/RecuperarSenha.jsx` agora possui quatro estados reais:

1. solicitação do OTP por email;
2. entrada e validação dos seis dígitos;
3. definição e confirmação da nova senha;
4. confirmação de sucesso e acesso ao login.

A tela utiliza os métodos já centralizados em `authApi`:

- `forgotPassword(email)`;
- `verifyOtp(email, codigo)`;
- `resetPassword({ email, codigo, nova_senha, confirmar_nova_senha })`.

O OTP aceita apenas dígitos, avança automaticamente entre campos, suporta colagem de código e permite reenvio. As requisições exibem estado de carregamento e preservam erros retornados pela API. A limpeza de dados sensíveis ocorre somente após a redefinição ser confirmada com sucesso.

## Critério de conclusão pendente

A tarefa ainda precisa de validação automatizada e manual:

- lint específico de `RecuperarSenha.jsx`;
- `npm run build`;
- solicitação de OTP com email existente;
- entrada de OTP incorreto e confirmação de mensagem;
- entrada de OTP correto;
- redefinição de senha e novo login;
- confirmação de que dados sensíveis não permanecem após sucesso.
