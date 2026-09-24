export const demoListings = [
  { id: 1, imagem: "/assets/property_1.png", titulo: "Apartamento Moderno - Centro", descricao: "", preco: "2.300", area: 60, quartos: 2, endereco: "Rua Ipê Amarelo, 128" },
  { id: 2, imagem: "/assets/property_2.png", titulo: "Casa Rústica no Campo", descricao: "Ambiente tranquilo cercado pela natureza", preco: "3.800", area: 140, quartos: 3, endereco: "Estrada das Palmeiras, km 12" },
  { id: 3, imagem: "/assets/property_3.png", titulo: "Casa Moderna com Design Minimalista", descricao: "Ambientes amplos e iluminação natural", preco: "5.200", area: 180, quartos: 4, endereco: "Alameda Horizonte, 220" },
];

function firstMedia(item) {
  return item?.media?.[0]?.url || item?.medias?.[0]?.url || item?.cover_url || item?.image_url || "/assets/property_1.png";
}

function propertyAddress(property) {
  const address = property?.address || property?.endereco || property?.owner_address;
  if (typeof address === "string") return address;
  if (!address) return "Endereço não informado";
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
    preco: item?.rent ?? item?.price ?? item?.preco ?? "0",
    area: property?.area ?? property?.area_total ?? item?.area ?? 0,
    quartos: roomCount,
    endereco: propertyAddress(property),
    status: item?.status,
    raw: item,
  };
}

export function adaptListings(payload, useDemo = false) {
  const items = Array.isArray(payload) ? payload : payload?.results || payload?.items || payload?.data || [];
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
