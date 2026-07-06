# CadastroImovel — pasta modular

Refatoração do `CadastroImovel.jsx` monolítico em uma pasta com controlador +
7 steps independentes, no layout de 3 colunas (stepper | formulário | preview
ao vivo) inspirado em Google Ads / Mercado Livre.

## Estrutura

```
CadastroImovel/
├── index.jsx                 # Orquestrador + layout de 3 colunas
├── constants.js              # initialForm, propertyTypes, featureOptions, guaranteeOptions
├── shared.jsx                # Shell, TextField, CountField, Sidebar, PreviewCard, TipCard…
├── Step1BasicInfo.jsx        # Tipo de anúncio, tipo de imóvel, título, finalidade
├── Step2Localizacao.jsx      # CEP, endereço, mapa Leaflet
├── Step3Caracteristicas.jsx  # Área, cômodos, informações extras
├── Step4Fotos.jsx            # Fotos por cômodo + extras + vídeo
├── Step5Valores.jsx          # Aluguel/venda, condomínio, IPTU, garantia
├── Step6Descricao.jsx        # Título, descrição, extras
└── Step7Contato.jsx          # Revisão final + publicar
```

## Como usar

Solte a pasta dentro do seu `src/pages/` (ou onde preferir) e importe:

```jsx
import CadastroImovel from "./pages/CadastroImovel";

<CadastroImovel
  onBackToList={() => navigate("/meus-imoveis")}
  onPublish={(form) => {/* enviar para API */}}
/>
```

## Dependências (já usadas no projeto original)

- `react`, `lucide-react`
- `react-leaflet`, `leaflet` (Step 2)
- `../components/ui/{button,input,textarea}` (shadcn)

## Adicionar / remover um step

Edite apenas o array `STEPS` em `index.jsx` e crie/remova o arquivo `StepN*.jsx`
correspondente. O stepper, a navegação e o preview se ajustam automaticamente.

```jsx
const STEPS = [
  { id: 1, label: "…", sub: "…", Component: Step1BasicInfo },
  // adicione ou remova aqui
];
```

## Observações

- O Step 7 é uma **revisão final + publicar**. Não foram inventados campos de
  contato porque o `initialForm` original não os possui.
- O preview lateral (`PreviewCard`) atualiza ao vivo a cada `setForm`.
- Cores usam os tokens do seu `index.css` (`secondary`, `primary`,
  `muted-foreground`, etc.).
- Nenhum campo novo foi introduzido além dos já existentes em `CadastroImovel.jsx`.
