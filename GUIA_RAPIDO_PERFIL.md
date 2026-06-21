# 📚 Guia Rápido - Tela de Perfil

## 🚀 Início Rápido

### Acessar a Página
```
/perfil - Página principal
```

### Componentes Principais

#### 1. PerfilHeader
```jsx
<PerfilHeader usuario={usuarioData} />
```
Exibe: Avatar, Nome, Email, CPF, Data de Cadastro

#### 2. PerfilSidebar
```jsx
<PerfilSidebar />
```
Menu lateral com navegação automática para a rota ativa

#### 3. PerfilCard
```jsx
<PerfilCard 
  titulo="Título" 
  descricao="Descrição opcional"
>
  {/* Conteúdo aqui */}
</PerfilCard>
```

---

## 📁 Estrutura

```
src/
├── components/
│   ├── PerfilHeader.jsx
│   ├── PerfilSidebar.jsx
│   └── PerfilCard.jsx
└── pages/
    ├── Perfil.jsx
    ├── PerfilEnderecos.jsx
    ├── PerfilSeguranca.jsx
    ├── PerfilPrivacidade.jsx
    ├── PerfilQualidade.jsx
    ├── PerfilMidia.jsx
    ├── PerfilMeusImoveis.jsx
    └── PerfilMeusAnuncios.jsx
```

---

## 🎯 Seções Disponíveis

| Seção | URL | Função |
|-------|-----|--------|
| **Perfil** | `/perfil` | Overview geral |
| **Endereços** | `/perfil/enderecos` | CRUD de endereços |
| **Segurança** | `/perfil/seguranca` | Configs de segurança |
| **Privacidade** | `/perfil/privacidade` | Preferências |
| **Qualidade** | `/perfil/qualidade` | Score de anúncios |
| **Mídias** | `/perfil/midia` | Fotos/vídeos |
| **Imóveis** | `/perfil/meus-imoveis` | Lista de imóveis |
| **Anúncios** | `/perfil/meus-anuncios` | Gerenciar anúncios |

---

## 🔗 Integração com Outras Páginas

### Adicionar link no Layout
```jsx
<Link to="/perfil">Meu Perfil</Link>
```

### Adicionar no Footer
```jsx
<Link to="/login" className="...">
  Meu perfil
</Link>
```

### Adicionar no Header
```jsx
<Link to="/perfil">
  <IconePerfil />
</Link>
```

---

## 🎨 Customização

### Cores (Tailwind)
- Primary: `#1A535C` → `bg-[#1A535C]`
- Secondary: `#4ECDC4` → `bg-[#4ECDC4]`
- Danger: `#FF6B6B` → `bg-[#FF6B6B]`

### Fontes
- Headings: `font-['Poppins']`
- Body: `font-['Inter']`

### Espaçamento
- Container: `max-w-7xl`
- Padding: `px-4 py-6`

---

## 💾 Mock Data Usado

```jsx
const usuarioMock = {
  nome: "Fulano de Tal",
  email: "fulanodetal@gmail.com",
  iniciais: "FT",
  dataCadastro: "01/02/2023",
};
```

Substitua por dados reais da API quando integrar.

---

## 🔄 Fluxo de Componentes

```
Layout
  └─ PerfilHeader
  └─ PerfilSidebar (navbar)
  └─ PerfilCard (reutilizável)
      ├─ Título
      ├─ Descrição
      ├─ Conteúdo
      └─ Ações
```

---

## 📦 Dependências Incluídas

```json
{
  "react": "^18.0.0",
  "react-router-dom": "^6.0.0",
  "lucide-react": "latest",
  "tailwindcss": "^3.0.0"
}
```

---

## ✅ Checklista de Uso

- [ ] Importar páginas no App.jsx
- [ ] Adicionar rotas
- [ ] Estilizar conforme marca
- [ ] Integrar com API
- [ ] Validar formulários
- [ ] Testar responsividade
- [ ] Implementar autenticação

---

## 🐛 Troubleshooting

**Erro: Componente não encontrado**
```bash
# Verificar imports
import { Perfil } from "@/pages/Perfil";
```

**Erro: Rota não funciona**
```jsx
// Verificar App.jsx tem a rota
<Route path="perfil" element={<Perfil />} />
```

**Erro: Estilos não aparecem**
```jsx
// Usar className completo
className="bg-[#1A535C] text-white"
```

---

## 📞 Suporte

Consulte:
- `PERFIL_USUARIO.md` - Documentação completa
- `IMPLEMENTACAO_PERFIL_RESUMO.md` - Resumo visual
- `GUIA_DA_EQUIPE.md` - Padrões do projeto

---

**Última atualização**: 2026-06-19
**Versão**: 1.0
**Status**: ✅ Pronto para uso
