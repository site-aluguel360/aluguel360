const CEP_PATTERN = /^\d{8}$/;

export async function lookupCep(value, signal) {
  const cep = String(value || "").replace(/\D/g, "");
  if (!CEP_PATTERN.test(cep)) return null;

  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, { signal });
  if (!response.ok) throw new Error("Não foi possível consultar o CEP.");
  const data = await response.json();
  if (data.erro) throw new Error("CEP não encontrado.");
  return {
    cep,
    logradouro: data.logradouro || "",
    bairro: data.bairro || "",
    cidade: data.localidade || "",
    estado: data.uf || "",
  };
}
