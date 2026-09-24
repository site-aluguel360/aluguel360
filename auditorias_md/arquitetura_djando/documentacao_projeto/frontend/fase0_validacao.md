# Fase 0 — Registro de Validação

**Data:** 24/09/2026  
**Status:** aprovado

## Verificações executadas

| Item | Comando/método | Resultado |
|---|---|---|
| Estrutura do frontend | Inventário de `src/`, páginas, componentes, contextos e libs | aprovado |
| Scripts reais | Leitura de `package.json` | `dev`, `build`, `lint` e `preview` confirmados |
| Contratos backend | Leitura de `config/urls.py` e `apps/*/urls.py` | prefixo `/api/v1/` e rotas principais confirmados |
| `.env.example` | Verificação do arquivo na raiz | criado sem segredos |
| Build sem variável | `Remove-Item Env:VITE_API_URL; npm run build` | aprovado |
| Build com variável | `$env:VITE_API_URL='http://localhost:8000/api/v1'; npm run build` | aprovado |
| Arquivos da documentação | verificação de existência e tamanho | aprovado |

## Observações

O Vite emitiu apenas um aviso de tamanho de chunk JavaScript acima de 500 kB. O aviso não interrompe o build e não bloqueia o encerramento da Fase 0. Code splitting fica registrado como possível melhoria futura, não como requisito desta fase.

O lint global não foi usado como critério único desta fase porque já possui pendências fora do escopo da integração atual. O build com e sem `VITE_API_URL` foi o critério específico exigido para T-0.1.3 e passou nas duas execuções.

## Conclusão

T-0.1.1, T-0.1.2 e T-0.1.3 estão concluídas com documentação e validação. A Fase I está liberada para execução somente mediante autorização explícita, conforme o protocolo do `FRONTEND_TASKS.md`.
