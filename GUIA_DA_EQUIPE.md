# 🚀 Guia de Onboarding e Execução - Aluguel360 (React)

Bem-vindo(a) à documentação da versão React do projeto **Aluguel360**. 
Este documento foi criado para ajudar todos os desenvolvedores da equipe a configurarem o projeto localmente e também guiar os estudos sobre as tecnologias (Stack) utilizadas nesta aplicação.

---

## 💻 1. Como rodar o projeto localmente

Para rodar este projeto na sua máquina, você precisa ter o **Node.js** (versão 18 ou superior) instalado.

### Passo a Passo

1. **Abra o terminal** na pasta raiz do repositório (`Aluguel360`).
2. **Navegue até a pasta do projeto em React:**
   ```bash
   cd emReact
   ```npm
3. **Instale as dependências** do projeto (isso irá ler o `package.json` e baixar todas as bibliotecas necessárias na pasta `node_modules`):
   ```bash
   npm install
   ```
4. **Inicie o servidor de desenvolvimento local:**
   ```bash
   npm run dev
   ```
5. **Acesse no navegador:** O terminal mostrará uma URL (geralmente `http://localhost:5173/`). Clique nela ou copie e cole no seu navegador para ver o projeto rodando. 
*Nota: Graças ao Vite, as atualizações de código que você fizer refletirão no navegador instantaneamente.*

---

## 📚 2. O que a equipe precisa estudar? (Trilha de Aprendizado)

Nós utilizamos uma stack moderna e muito valorizada pelo mercado. Se você está chegando agora, aqui está a ordem sugerida do que você deve aprender:

### Nível 1: A Base (Obrigatório)
Antes de mergulhar no React, é fundamental ter uma base sólida nestes três pilares:
- **HTML5 Semântico:** Entender tags como `<main>`, `<header>`, `<section>`, `<nav>`, estruturação de formulários.
- **CSS Avançado:** Flexbox e CSS Grid (fundamentais para posicionamento de elementos).
- **JavaScript (ES6+):** O mais importante! Estude:
  - Arrow functions (`const funcao = () => {}`)
  - Desestruturação de objetos e arrays (`const { nome, idade } = usuario`)
  - Métodos de Array (`.map()`, `.filter()`, `.reduce()`)
  - Promessas (Promises) e Async/Await.
  - Template literals (`` `texto ${variavel}` ``)

### Nível 2: O Framework Principal (React + Vite)
- **Vite:** É a ferramenta que usamos no lugar do antigo "Create React App" ou Webpack para rodar e compilar o projeto super rápido.
- **React.js:** A biblioteca principal para criar a interface do usuário. O que focar:
  - **Componentização:** Como quebrar a interface em partes reutilizáveis (ex: `<Header />`, `<Card />`).
  - **JSX:** A sintaxe que mistura HTML dentro do JavaScript.
  - **Props (Propriedades):** Como passar dados de um componente "Pai" para um "Filho".
  - **Hooks Principais:** O coração do React moderno. Estude incansavelmente o `useState` (para guardar variáveis de tela) e o `useEffect` (para ações automáticas quando a tela carrega ou algo muda).

### Nível 3: Roteamento de Páginas
- **React Router DOM v7:** Como o React é uma SPA (Single Page Application - Aplicativo de Página Única), usamos essa biblioteca para simular a troca de páginas (ex: navegar da Home para "Sobre Nós" ou "Contato" sem recarregar o navegador).
  - Estude: `BrowserRouter`, `Routes`, `Route`, `Link`, e o componente `<Outlet />` (que usamos no nosso arquivo `Layout.jsx` para manter cabeçalho e rodapé fixos).

### Nível 4: Estilização e Design System
- **Tailwind CSS v4:** É o nosso framework CSS. Em vez de criar classes longas em arquivos `.css`, nós estilizamos tudo diretamente no JSX com classes utilitárias.
  - Exemplo: `className="flex flex-col items-center bg-blue-500 text-white p-4"`
  - *Dica de Ouro:* Instale a extensão "Tailwind CSS IntelliSense" no seu VSCode para autocompletar as classes.
- **shadcn/ui:** Não é uma biblioteca de componentes instalável convencional (como Bootstrap ou Material UI). São componentes base (arquivos de código, ex: `Button.jsx`, `Input.jsx`, `Card.jsx`) que são copiados para nossa pasta `src/components/ui/` (usando Radix UI por baixo dos panos) e que vêm pré-estilizados com Tailwind. Isso nos dá 100% de controle sobre a customização e garante acessibilidade.
- **Lucide React:** Nossa biblioteca oficial de ícones SVG. É o padrão utilizado pelo shadcn/ui.

---

## 🔗 Links e Recursos Recomendados

- **Documentação Oficial do React (Nova e interativa):** [react.dev/learn](https://react.dev/learn)
- **Documentação do Tailwind CSS:** [tailwindcss.com](https://tailwindcss.com/)
- **Documentação do shadcn/ui:** [ui.shadcn.com](https://ui.shadcn.com/)
- **React Router:** [reactrouter.com](https://reactrouter.com/)
- **Curso Gratuito Base:** Recomenda-se buscar cursos gratuitos no YouTube sobre "React JS para iniciantes", focando na versão com "Hooks" e "Componentes Funcionais".

**Bom trabalho e ótimos estudos! Qualquer dúvida, olhe como o arquivo `src/pages/Home.jsx` foi construído, ele é um ótimo exemplo prático de todas essas tecnologias juntas.**
