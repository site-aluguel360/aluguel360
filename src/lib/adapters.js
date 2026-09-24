export const demoListings = [
  { id: 1, imagem: "/assets/property_1.png", titulo: "Apartamento Moderno - Centro", descricao: "", preco: "2.300", area: 60, quartos: 2, endereco: "Rua Ipê Amarelo, 128" },
  { id: 2, imagem: "/assets/property_2.png", titulo: "Casa Rústica no Campo", descricao: "Ambiente tranquilo cercado pela natureza", preco: "3.800", area: 140, quartos: 3, endereco: "Estrada das Palmeiras, km 12" },
  { id: 3, imagem: "/assets/property_3.png", titulo: "Casa Moderna com Design Minimalista", descricao: "Ambientes amplos e iluminação natural", preco: "5.200", area: 180, quartos: 4, endereco: "Alameda Horizonte, 220" },
];

function firstMedia(item) {
  return item?.foto_destaque?.url || item?.media?.[0]?.url || item?.medias?.[0]?.url || item?.cover_url || item?.image_url || "/assets/property_1.png";
}

function propertyAddress(property) {
  const address = property?.address || property?.endereco || property?.owner_address;
  if (typeof address === "string") return address;
  if (!address) return "";
  return [address.logradouro, address.numero, address.bairro, address.cidade, address.estado].filter(Boolean).join(", ");
}

export function adaptListing(item, index = 0) {
  const property = item?.property || item?.imovel || item;
  const rooms = property?.rooms || property?.property_rooms || [];
  const roomCount = property?.bedrooms ?? property?.quartos ?? rooms.find((room) => /quarto/i.test(room.name || room.label))?.quantity ?? 0;
  return {
    id: item?.id ?? property?.id ?? index,
    imagem: firstMedia(item),
    titulo: item?.title || item?.titulo || property?.title || property?.name || "Imóvel sem título",
    descricao: item?.description || item?.descricao || property?.description || "",
    preco: item?.aluguel ?? item?.rent ?? item?.price ?? item?.preco ?? "0",
    area: item?.area_m2 ?? property?.area ?? property?.area_total ?? item?.area ?? 0,
    quartos: roomCount,
    endereco: propertyAddress(property) || [item?.cidade, item?.estado].filter(Boolean).join(" - ") || "Endereço não informado",
    status: item?.status,
    raw: item,
  };
}

export function adaptListings(payload, useDemo = false) {
  let items = payload;
  for (let depth = 0; depth < 3 && !Array.isArray(items); depth += 1) {
    if (!items || typeof items !== "object") {
      items = [];
      break;
    }
    items = items.results || items.items || items.data || [];
  }
  if (!Array.isArray(items)) items = [];
  if (!items.length && useDemo) return demoListings;
  return items.map(adaptListing);
}

export function adaptUser(user) {
  if (!user) return null;
  return {
    ...user,
    iniciais: (user.nome || "U").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
    dataCadastro: user.created_at ? new Date(user.created_at).toLocaleDateString("pt-BR") : "",
  };
}

export function adaptAddress(address) {
  return {
    ...address,
    descricao: [address.logradouro, address.numero, address.bairro, address.cidade, address.estado].filter(Boolean).join(", "),
  };
}

export function adaptMedia(media) {
  return {
    ...media,
    tipo: media.mime_type?.startsWith("video/") || media.media_type === "video" ? "video" : "foto",
    nome: media.original_name || media.filename || media.name || "Mídia",
    tamanho: media.size ? `${(media.size / 1024 / 1024).toFixed(1)} MB` : "",
  };
}

export function toRegisterPayload(form) {
  return {
    nome: form.nome.trim(),
    email: form.email.trim().toLowerCase(),
    telefone: form.telefone.trim(),
    data_nascimento: form.nascimento || null,
    cpf: form.cpf,
    senha: form.senha,
    confirmar_senha: form.confirmarSenha,
    endereco: {
      cep: form.cep.replace(/\D/g, ""),
      logradouro: form.logradouro.trim(),
      numero: form.numero.trim(),
      bairro: form.bairro.trim(),
      cidade: form.cidade.trim(),
      estado: form.estado.trim().toUpperCase(),
      complemento: form.complemento.trim(),
    },
  };
}

const propertyTypeMap = {
  Casa: "CASA",
  Apartamento: "APARTAMENTO",
  Kitnet: "KITNET",
  Cômodo: "COMODO",
  Outro: "OUTRO",
};

export function toPropertyPayload(form) {
  return {
    tipo: propertyTypeMap[form.propertyType] || String(form.propertyType || "OUTRO").toUpperCase(),
    area_m2: Number(form.area) || 0,
    cep: String(form.cep || "").replace(/\D/g, ""),
    logradouro: String(form.street || "").trim(),
    numero: String(form.number || "").trim(),
    bairro: String(form.neighborhood || "").trim(),
    cidade: String(form.city || "").trim(),
    estado: String(form.state || "").trim().toUpperCase(),
    complemento: String(form.complement || "").trim(),
    referencia: String(form.reference || "").trim(),
    features: form.features || {},
    rooms: (form.rooms || []).map((room) => ({ tipo: room.id, quantidade: Number(room.value) || 0 })),
  };
}

export function toListingPayload(form, propertyId) {
  return {
    property: propertyId,
    titulo: String(form.title || "").trim(),
    descricao: String(form.description || "").trim(),
    extra_info: String(form.extraInfo || "").trim(),
    aluguel: Number(String(form.rent || "0").replace(/\./g, "").replace(",", ".")) || 0,
    negociavel: Boolean(form.negotiable),
    condominio_valor: Number(String(form.condoFee || "0").replace(/[^0-9,.-]/g, "").replace(",", ".")) || 0,
    condominio_incluido: Boolean(form.condoIncluded),
    iptu_valor: Number(String(form.iptuFee || "0").replace(/[^0-9,.-]/g, "").replace(",", ".")) || 0,
    iptu_incluido: Boolean(form.iptuIncluded),
    outras_taxas: String(form.otherFees || "").trim(),
    garantia: String(form.guarantee || "").trim(),
  };
}
