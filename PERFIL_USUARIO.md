# Tela de Perfil do Usuário - Documentação

## 📋 Visão Geral

A tela de perfil do usuário foi implementada como uma funcionalidade completa de gerenciamento de conta, permitindo que os usuários visualizem e gerenciem suas informações pessoais, endereços, segurança, privacidade, dados de qualidade de anúncios, mídias e imóveis.

## 🎯 Funcionalidades Implementadas

### 1. Perfil Principal (`/perfil`)
- **Header do Perfil**: Exibe avatar com iniciais do usuário, nome, email, CPF e data de cadastro
- **Informações do Perfil**: Visualização dos dados pessoais
- **Endereços**: Gerenciamento de endereços cadastrados
- **Qualidade dos Anúncios**: Avaliação e métricas de desempenho
- **Segurança**: Status da verificação de conta
- **Privacidade**: Preferências de privacidade
- **Fotos e Mídias**: Estatísticas de mídias enviadas

### 2. Endereços (`/perfil/enderecos`)
- Listagem de endereços cadastrados
- Editar endereços
- Deletar endereços
- Adicionar novo endereço

### 3. Segurança (`/perfil/seguranca`)
- Verificação de email e telefone
- Autenticação de dois fatores
- Gerenciamento de dispositivos conectados
- Histórico de acessos

### 4. Privacidade (`/perfil/privacidade`)
- Preferências de privacidade
- Controle de dados de localização
- Preferências de comunicações
- Opção de exclusão de dados

### 5. Qualidade dos Anúncios (`/perfil/qualidade`)
- Score de desempenho dos anúncios
- Métricas de tempo de resposta, taxa de conclusão, anúncios ativos
- Dicas para melhorar qualidade
- Histórico de desempenho

### 6. Fotos e Mídias (`/perfil/midia`)
- Estatísticas de fotos e vídeos
- Listagem de mídias recentes
- Gerenciamento de limite de armazenamento
- Fazer upload de novas mídias

### 7. Meus Imóveis (`/perfil/meus-imoveis`)
- Listagem de imóveis cadastrados
- Editar/Deletar imóveis
- Estatísticas gerais (imóveis, anúncios ativos, visualizações)

### 8. Meus Anúncios (`/perfil/meus-anuncios`)
- Listagem de anúncios com filtros
- Estatísticas por anúncio (visualizações, mensagens, favoritos)
- Editar/Deletar anúncios
- Filtrar por status (todos, ativos, inativos, alugados)

## 📁 Estrutura de Arquivos

### Componentes (`src/components/`)
```
PerfilHeader.jsx       - Header com avatar e informações básicas do usuário
PerfilSidebar.jsx      - Menu lateral com navegação
PerfilCard.jsx         - Componente reutilizável para cards de informação
```

### Páginas (`src/pages/`)
```
Perfil.jsx             - Página principal de perfil
PerfilEnderecos.jsx    - Gerenciamento de endereços
PerfilSeguranca.jsx    - Configurações de segurança
PerfilPrivacidade.jsx  - Configurações de privacidade
PerfilQualidade.jsx    - Qualidade dos anúncios
PerfilMidia.jsx        - Gerenciamento de fotos/mídias
PerfilMeusImoveis.jsx  - Listagem de imóveis
PerfilMeusAnuncios.jsx - Gerenciamento de anúncios
```

## 🎨 Padrões de Design

### Componentes Reutilizáveis

Todos os componentes seguem o padrão já estabelecido no projeto:

- **PerfilCard**: Componente wrapper que padroniza a exibição de informações
  - Título e descrição
  - Conteúdo flexível
  - Ações opcionais no rodapé

- **PerfilHeader**: Exibe informações do usuário
  - Avatar circular com iniciais
  - Dados pessoais
  - Botão de edição

- **PerfilSidebar**: Menu lateral responsivo
  - Organizado por seções
  - Highlight da rota ativa
  - Botão de logout

### Estilos e Tailwind

- **Paleta de Cores Consistente**:
  - Primary: `#1A535C`
  - Secondary: `#4ECDC4`
  - Success: `#2C7E7B`
  - Danger: `#FF6B6B`
  - Background: `#F0F4F8`
  - Border: `#D8E1E7`

- **Tipografia**:
  - Headings: `font-['Poppins']`
  - Body: `font-['Inter']`

- **Responsividade**:
  - Sidebar oculta em mobile
  - Visível em `min-[1080px]`
  - Grid adaptativo

## 🔗 Rotas

```
GET  /perfil                      - Página inicial de perfil
GET  /perfil/enderecos            - Gerenciamento de endereços
GET  /perfil/seguranca            - Configurações de segurança
GET  /perfil/privacidade          - Configurações de privacidade
GET  /perfil/qualidade            - Qualidade dos anúncios
GET  /perfil/midia                - Fotos e mídias
GET  /perfil/meus-imoveis         - Meus imóveis
GET  /perfil/meus-anuncios        - Meus anúncios
```

## 🚀 Como Usar

### Acessar a página de perfil

```jsx
import { Perfil } from "@/pages/Perfil";

// Via navegação
<Link to="/perfil">Acessar Perfil</Link>
```

### Estrutura de uma página de perfil

```jsx
import { PerfilHeader } from "../components/PerfilHeader";
import { PerfilSidebar } from "../components/PerfilSidebar";
import { PerfilCard } from "../components/PerfilCard";

export function PerfilExample() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6">
      <PerfilHeader usuario={usuarioData} />
      
      <div className="grid gap-8 min-[1080px]:grid-cols-[280px_minmax(0,1fr)]">
        <PerfilSidebar />
        
        <section className="min-w-0 space-y-5">
          <PerfilCard
            titulo="Título da Seção"
            descricao="Descrição opcional"
          >
            {/* Conteúdo aqui */}
          </PerfilCard>
        </section>
      </div>
    </div>
  );
}
```

## 📦 Dependências Utilizadas

- **React Router**: Navegação entre páginas
- **Lucide React**: Ícones (Edit, Trash2, Plus, etc.)
- **Tailwind CSS**: Estilos
- **shadcn/ui**: Componentes base (Button, Card, Input)

## 🔄 Fluxo de Navegação

```
/perfil (Página Principal)
    ├── Informações do Perfil
    ├── Endereços (link -> /perfil/enderecos)
    ├── Qualidade (link -> /perfil/qualidade)
    ├── Segurança (link -> /perfil/seguranca)
    ├── Privacidade (link -> /perfil/privacidade)
    ├── Fotos (link -> /perfil/midia)
    ├── Imóveis (link -> /perfil/meus-imoveis)
    └── Anúncios (link -> /perfil/meus-anuncios)
```

## 💡 Próximos Passos / Melhorias

- [ ] Integração com API backend para persistência de dados
- [ ] Validação de formulários
- [ ] Upload real de fotos/mídias
- [ ] Edição de informações do perfil
- [ ] Notificações em tempo real
- [ ] Paginação em listas grandes
- [ ] Exportação de dados
- [ ] Modo escuro

## 🎓 Padrões Aplicados

1. **Componentes Reutilizáveis**: PerfilCard, PerfilHeader, PerfilSidebar
2. **Props Genéricas**: Componentes flexíveis para múltiplos casos de uso
3. **Consistent UI**: Cores, espaçamentos e tipografia uniformes
4. **Responsive Design**: Mobile-first com breakpoints Tailwind
5. **Accessibility**: Uso de labels, alt texts e estrutura semântica
6. **Performance**: Lazy loading de páginas via React Router

## 📝 Notas

- Os dados exibidos são mockados para demonstração
- A integração com backend deve ser implementada conforme necessário
- A autenticação deve ser verificada antes de acessar as páginas de perfil
- Componentes são totalmente reutilizáveis em outras páginas do projeto
