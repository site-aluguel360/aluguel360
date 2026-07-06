# CHECKLIST FINAL DE VALIDAÇÃO E QA — Aluguel360

> **Data de elaboração**: 2026-07-02
> **Objetivo**: Fornecer um roteiro de aceitação (QA - Quality Assurance) definitivo. O projeto só deve ser considerado "Refatorado com Sucesso" se 100% dos itens abaixo forem marcados como válidos após a conclusão da FASE-8.

---

## 1. Arquitetura e Estrutura de Diretórios

- [ ] Nenhum arquivo no projeto possui mais de 800 linhas (Confirmação da extinção dos "God Files" como `CadastroImovel.jsx`).
- [ ] O diretório `src/lib/mock/` existe e é a única fonte de verdade para dados estáticos de teste.
- [ ] Nenhum componente dentro de `src/components/` ou `src/pages/` define arrays de objetos complexos (como Imóveis ou Usuários) internamente.
- [ ] O diretório `src/lib/hooks/` contém hooks para isolar o consumo de dados do componente visual (ex: `useImoveis`, `useAuth`).
- [ ] Os sub-componentes de formulário estão centralizados e reutilizáveis dentro de `src/components/forms/`.

## 2. Design System e CSS

- [ ] O arquivo `App.css` (e seus imports espalhados) foi deletado e extirpado do projeto.
- [ ] O arquivo `index.css` utiliza o `@theme` unificado, não contendo tokens duplicados (como `secondary-hover` e `primary` tendo o mesmo `#hex`).
- [ ] Nenhuma classe Tailwind residual do template (`.vite`, `.counter`) é utilizada no HTML.
- [ ] Todas as definições visuais ocorrem através de classes utilitárias do Tailwind; ou seja, busca global por `style={{` não retorna nenhum uso de cores ou layouts inline espúrios.
- [ ] As 3 implementações conflitantes de Card de Imóvel (Home, Resultados, Detalhe) foram condensadas em uma única estrutura modular (`CardImovel.jsx` com prop de `variant`).

## 3. Roteamento e Proteção

- [ ] Acessar manualmente qualquer URL dentro de `/perfil` ou `/perfil/cadastro-imovel` enquanto *deslogado* resulta em redirecionamento para `/login` (via `PrivateRoute`).
- [ ] A aba/seção de `PerfilAnunciante` obedece rotas reais do react-router (e não troca de contexto simulada via `useState("aba2")`), permitindo funcionamento do botão 'Voltar' do navegador.
- [ ] Rotas inexistentes no navegador encaminham para uma rota de Fallback (Página 404 - NotFound).
- [ ] A página de "Visualizar Imóveis" funciona recebendo o ID dinamicamente pela URL (ex: `/visualizar-imoveis/abc-123`) em conformidade com o Layout global.

## 4. Funcionalidades e UX Core

- [ ] (Busca): Digitar na search-bar do cabeçalho e dar "Enter" altera a URL e reflete na lista de Resultados da Pesquisa.
- [ ] (Filtros): Os filtros laterais em Resultados da Pesquisa alteram a lista de imóveis renderizada ativamente.
- [ ] (Favoritos): O coração de "Favoritar" no Card muda de estado (cheio/vazio) e preserva a mudança ao recarregar a página. Caso deslogado, uma notificação (toast) de aviso de Login deve aparecer.
- [ ] (Alertas Naturais Extintos): Buscas completas no projeto por comandos como `alert(` ou `window.alert(` retornam exatos 0 resultados. Os feedbacks de erro e sucesso utilizam a library `sonner` (Toast).
- [ ] (CEP): Digitar um CEP válido no Formulário de Cadastro autocompleta Rua e Bairro automaticamente consumindo ViaCEP.

## 5. Regras de Negócio: Cadastro de Imóvel

- [ ] O usuário pode preencher parte do Cadastro (ex: Step 2), fechar o navegador, abrir novamente e continuar do ponto onde parou (Persistência via localStorage).
- [ ] Se o Locador não preencher todos os dados mínimos e tentar "Avançar" ou "Publicar", o campo faltante ficará com contorno vermelho (error boundary) e a tela fará scroll para ele, sem exibir janelas popup.
- [ ] Tentar adicionar um "Cômodo Personalizado" com nome já existente exibe um aviso em linha sem quebrar o fluxo.
- [ ] A aba final "Revisão" (Step 6) verifica ativamente a existência dos campos na memória; um aviso de verde passará para vermelho (ou bloqueante) caso o Locador burle o preenchimento ou remova uma foto depois de aprovar.

## 6. HTML Semântico, Acessibilidade e SEO

- [ ] Todo link no sistema utiliza o componente `<Link>` do *react-router-dom*. A âncora ociosa `<a href="#">` está instinta do fluxo.
- [ ] Componentes de botões (`<Button>`) englobando rotas usam `asChild` nativo do Shadcn, sem gerar problemas de botões ou a-tags aninhados ilegalmente no DOM.
- [ ] As tags de Imagem (`<img>`) de Imóveis carregam um atributo `alt` textual derivado do banco mock (ex: `alt="Casa de 3 quartos no Centro"`).
- [ ] Cada página principal altera o `document.title` do navegador de forma independente para rankeamento orgânico.
- [ ] Ícones de navegação e rodapé fazem correspondência com seu significado (Ícone de E-mail para enviar mensagens, Ícone de Relógio para horário - Corrigindo problema do PinMap de localização em todo canto).

---

*Documento gerado com base nas auditorias Bloco 1-4 do Aluguel360. Versão 1.0.*
