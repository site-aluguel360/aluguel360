# Fase 0 — Diagnóstico do Frontend

**Projeto:** Aluguel360  
**Data:** 24/09/2026  
**Status:** concluída

## 1. Escopo analisado

Foi analisado o frontend React localizado na raiz do projeto, principalmente os diretórios `src/`, `src/pages/`, `src/components/`, `src/contexts/` e `src/lib/`. Também foram conferidos `package.json`, `vite.config.js`, `eslint.config.js`, as rotas do backend Django e o plano de integração existente.

A Fase 0 não altera modelos, serializers, views ou URLs do backend. Seu objetivo é estabelecer uma base documentada para as próximas integrações.

## 2. Stack e comandos reais

O frontend utiliza React com Vite. Os scripts efetivamente declarados em `package.json` são:

| Comando | Finalidade |
|---|---|
| `npm install` | Instalar dependências do frontend. |
| `npm run dev` | Iniciar o servidor de desenvolvimento Vite. |
| `npm run build` | Gerar o build de produção. |
| `npm run lint` | Executar ESLint no projeto inteiro. |
| `npm run preview` | Servir localmente o build gerado. |

Dependências relevantes para a integração atual incluem React, `react-router-dom`, `lucide-react`, Leaflet/React Leaflet e utilitários Tailwind. O cliente HTTP foi implementado com `fetch`, sem adicionar uma biblioteca de transporte.

## 3. Estrutura funcional encontrada

### Páginas públicas e autenticação

- `src/pages/Home.jsx` — página inicial e catálogo visual;
- `src/pages/ResultadosPesquisa.jsx` — resultados e filtros;
- `src/pages/About.jsx` — apresentação;
- `src/pages/Login.jsx` — login;
- `src/pages/CadastroUsuario.jsx` — cadastro em etapas;
- `src/pages/RecuperarSenha.jsx` — recuperação de senha.

### Páginas autenticadas e perfil

- `src/pages/Perfil.jsx`;
- `src/pages/EditProfile.jsx`;
- `src/pages/PerfilEnderecos.jsx`;
- `src/pages/PerfilMeusImoveis.jsx`;
- `src/pages/PerfilMeusAnuncios.jsx`;
- `src/pages/PerfilMidia.jsx`;
- `src/pages/PerfilSeguranca.jsx`;
- `src/pages/PerfilPrivacidade.jsx`;
- `src/pages/PerfilQualidade.jsx`;
- `src/pages/CadastroImovel.jsx`.

### Componentes e infraestrutura

- componentes de layout, header, sidebar e cards em `src/components/`;
- contexto de autenticação em `src/contexts/AuthContext.jsx`;
- cliente e adaptadores em `src/lib/`;
- assets visuais em `src/assets/`.

## 4. Estado encontrado antes da Fase 0

O frontend foi inicialmente construído para demonstração visual. As telas de catálogo, perfil, imóveis, anúncios e mídia continham dados simulados ou ações sem persistência. O plano de integração já havia identificado esses pontos para substituição gradual, sem alterar o visual aprovado.

A primeira integração já executada criou:

- `src/lib/api.js` para transporte, tokens, refresh e serviços da API;
- `src/lib/viacep.js` para consulta de CEP no cliente;
- `src/lib/adapters.js` para separar o formato da API do formato visual;
- `src/contexts/AuthContext.jsx` com sessão real;
- login real em `Login.jsx`;
- cadastro real, com número, cidade, estado e ViaCEP, em `CadastroUsuario.jsx`;
- resultados conectados à API em `ResultadosPesquisa.jsx`;
- email bloqueado para edição em `EditProfile.jsx`.

Essas alterações não substituem as próximas tarefas. Ainda permanecem pendentes a proteção formal das rotas, logout visual, recuperação de senha, Home real, perfil, cadastro de imóvel, mídia, notificações e favoritos.

## 5. Mocks e fallback

Os dados fictícios não devem ser enviados ao backend nem ser tratados como fonte principal de negócio. A estratégia definida é:

1. a tela chama o serviço centralizado;
2. a resposta real é convertida por um adaptador;
3. estados de loading, vazio e erro são tratados separadamente;
4. o fallback visual somente é permitido onde estiver documentado e deve ser identificável durante o desenvolvimento.

A próxima tarefa deve remover gradualmente a dependência funcional desses mocks, sem apagar dados de demonstração enquanto eles ainda forem necessários para apresentação visual.

## 6. Variáveis de ambiente

Foi definida a variável pública do Vite:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

Ela não contém segredo. Tokens e credenciais nunca devem ser colocados em arquivos `.env.example` ou registrados nesta documentação.

## 7. Pendências encaminhadas

| ID | Pendência | Próxima fase |
|---|---|---|
| T-1.1.5 | Criar `ProtectedRoute` para áreas privadas. | Fase I |
| T-1.1.6 | Integrar logout visual e limpeza da sessão. | Fase I |
| T-2.2.1 | Integrar recuperação de senha e OTP. | Fase II |
| T-3.1.3 | Integrar Home com listings reais. | Fase III |
| T-4.x | Integrar perfil e recursos do usuário. | Fase IV |
| T-5.x | Integrar cadastro de imóvel e mídia. | Fase V |
| T-6.x | Integrar notificações, favoritos e privacidade. | Fase VI |

## 8. Conclusão

O diagnóstico e o mapeamento de contratos foram concluídos. A configuração local do Vite foi documentada e validada na Fase 0. O frontend está apto a avançar para a Fase I, mas deve manter a regra de não alterar o backend sem uma tarefa específica e sem registrar eventual incompatibilidade contratual.
