// Constantes e estado inicial do cadastro de imóvel.
// Mantém somente os campos já presentes no CadastroImovel.jsx original.

export const DEFAULT_ROOM_IDS = [
  "quartos",
  "salas",
  "garagem",
  "varandas",
  "suites",
  "banheiros",
];

export const propertyTypes = ["Casa", "Apartamento", "Kitnet", "Cômodo", "Outro"];

export const featureOptions = [
  { key: "pets", label: "Aceita pets" },
  { key: "condominio", label: "Condomínio incluso" },
  { key: "suite", label: "Quarto suíte" },
  { key: "mobiliado", label: "Mobiliado" },
  { key: "iptu", label: "IPTU incluso" },
  { key: "portaria", label: "Portaria" },
  { key: "escolas", label: "Próximo à escolas" },
  { key: "transporte", label: "Próximo ao transporte público" },
];

export const guaranteeOptions = [
  "Caução",
  "Fiador",
  "Sem garantia",
  "Seguro Fiançado",
];

export const initialForm = {
  // finalidade de anúncio (para alugar / vender) — reaproveita o vocabulário
  // já existente no fluxo, sem inventar campo novo. Default: alugar.
  listingType: "alugar",
  purpose: "residencial", // residencial | comercial

  propertyType: "Casa",
  area: "160",
  rooms: [
    { id: "quartos", label: "Quartos", value: 0 },
    { id: "salas", label: "Salas", value: 0 },
    { id: "garagem", label: "Garagem", value: 0 },
    { id: "varandas", label: "Varandas", value: 0 },
    { id: "suites", label: "Suítes", value: 0 },
    { id: "banheiros", label: "Banheiros", value: 0 },
  ],
  features: {
    pets: false,
    condominio: false,
    suite: false,
    mobiliado: false,
    iptu: false,
    portaria: false,
    escolas: false,
    transporte: false,
  },
  cep: "",
  street: "",
  neighborhood: "",
  reference: "",
  complement: "",
  number: "",
  highlight: "",
  rent: "",
  negotiable: false,
  condoFee: "R$ 0,00",
  condoIncluded: false,
  iptuFee: "R$ 0,00",
  iptuIncluded: false,
  otherFees: "",
  guarantee: "Sem garantia",
  title: "",
  description: "",
  extraInfo: "",
  photos: {},
  extraPhotos: [],
  video: null,
};
