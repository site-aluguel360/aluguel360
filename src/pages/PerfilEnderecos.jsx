import { useEffect, useState } from "react";
import { Edit, Plus, Trash2, X } from "lucide-react";
import { PerfilHeader } from "../components/PerfilHeader";
import { PerfilSidebar } from "../components/PerfilSidebar";
import { PerfilCard } from "../components/PerfilCard";
import { ButtonForms } from "../components/ui/button";
import { Input } from "@/components/ui/input";
import { normalizeApiList, toApiError, userApi } from "../lib/api";
import { adaptUser } from "../lib/adapters";
import { lookupCep } from "../lib/viacep";

const EMPTY_FORM = {
  cep: "",
  logradouro: "",
  numero: "",
  bairro: "",
  cidade: "",
  estado: "",
  complemento: "",
  is_primary: false,
};

export function PerfilEnderecos() {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState("");

  const loadData = async () => {
    const [userData, addressData] = await Promise.all([userApi.me(), userApi.addresses()]);
    setUser(adaptUser(userData));
    setAddresses(normalizeApiList(addressData));
  };

  useEffect(() => {
    let active = true;
    Promise.all([userApi.me(), userApi.addresses()])
      .then(([userData, addressData]) => {
        if (!active) return;
        setUser(adaptUser(userData));
        setAddresses(normalizeApiList(addressData));
      })
      .catch((requestError) => active && setError(toApiError(requestError)))
      .finally(() => active && setIsLoading(false));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const normalizedCep = String(form.cep || "").replace(/\D/g, "");
    if (normalizedCep.length !== 8) return undefined;
    const controller = new AbortController();
    lookupCep(normalizedCep, controller.signal)
      .then((address) => address && setForm((current) => ({ ...current, ...address })))
      .catch((requestError) => {
        if (requestError.name !== "AbortError") setCepError(toApiError(requestError));
      })
      .finally(() => setCepLoading(false));
    return () => controller.abort();
  }, [form.cep]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setMessage("");
    setError("");
    setIsFormOpen(true);
  };

  const openEdit = (address) => {
    setEditingId(address.id);
    setForm({ ...EMPTY_FORM, ...address });
    setMessage("");
    setError("");
    setIsFormOpen(true);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (name === "cep") {
      const normalizedCep = value.replace(/\D/g, "");
      setCepError("");
      setCepLoading(normalizedCep.length === 8);
    }
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setMessage("");
    const payload = {
      cep: form.cep.trim(),
      logradouro: form.logradouro.trim(),
      numero: form.numero.trim(),
      bairro: form.bairro.trim(),
      cidade: form.cidade.trim(),
      estado: form.estado.trim().toUpperCase(),
      complemento: form.complemento.trim(),
      is_primary: form.is_primary,
    };
    try {
      if (editingId) await userApi.updateAddress(editingId, payload);
      else await userApi.createAddress(payload);
      await loadData();
      setIsFormOpen(false);
      setMessage(editingId ? "Endereço atualizado com sucesso." : "Endereço criado com sucesso.");
    } catch (requestError) {
      setError(toApiError(requestError));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (address) => {
    setError("");
    setMessage("");
    try {
      await userApi.deleteAddress(address.id);
      setAddresses((current) => current.filter((item) => item.id !== address.id));
      setMessage("Endereço removido com sucesso.");
    } catch (requestError) {
      setError(toApiError(requestError));
    }
  };

  if (isLoading) return <p className="mx-auto max-w-7xl px-4 py-12 text-center text-muted-foreground">Carregando endereços...</p>;
  if (!user) return <p className="mx-auto max-w-7xl px-4 py-12 text-center text-red-600" role="alert">{error || "Não foi possível carregar o perfil."}</p>;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6">
      <PerfilHeader usuario={user} />
      <div className="grid gap-8 min-[1080px]:grid-cols-[280px_minmax(0,1fr)]">
        <PerfilSidebar />
        <section className="min-w-0 space-y-5">
          <PerfilCard titulo="Meus Endereços" descricao="Gerencie os endereços associados à sua conta.">
            {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
            {message && <p className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700">{message}</p>}
            <div className="space-y-4">
              {addresses.length === 0 && <p className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">Nenhum endereço cadastrado.</p>}
              {addresses.map((address) => (
                <div key={address.id} className="rounded-lg border border-[#D8E1E7] p-4">
                  <div className="mb-3 flex items-center justify-between"><span className="inline-block rounded-full bg-[#4ECDC4]/20 px-3 py-1 text-[12px] font-semibold text-[#2C7E7B]">{address.is_primary ? "Principal" : "Endereço"}</span></div>
                  <p className="text-[14px] font-semibold text-[#2D2D2D]/90">{address.logradouro}, {address.numero}{address.complemento && ` - ${address.complemento}`}</p>
                  <p className="text-[14px] text-[#2D2D2D]/70">{address.bairro}, {address.cidade} - {address.estado} | CEP: {address.cep}</p>
                  <div className="mt-4 flex gap-3"><button type="button" onClick={() => openEdit(address)} className="flex items-center gap-2 text-[12px] font-semibold text-[#1A535C] hover:underline"><Edit className="h-4 w-4" />Editar</button><button type="button" onClick={() => handleDelete(address)} className="flex items-center gap-2 text-[12px] font-semibold text-[#FF6B6B] hover:underline"><Trash2 className="h-4 w-4" />Deletar</button></div>
                </div>
              ))}
              <button type="button" onClick={openCreate} className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#D8E1E7] py-4 text-[14px] font-semibold text-[#1A535C] transition hover:border-[#1A535C] hover:bg-[#F0F4F8]"><Plus className="h-4 w-4" />Adicionar novo endereço</button>
            </div>
          </PerfilCard>

          {isFormOpen && (
            <PerfilCard titulo={editingId ? "Editar endereço" : "Novo endereço"} descricao="Informe os dados do endereço.">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[["cep", "CEP"], ["logradouro", "Logradouro"], ["numero", "Número"], ["bairro", "Bairro"], ["cidade", "Cidade"], ["estado", "Estado"], ["complemento", "Complemento"]].map(([name, label]) => <div key={name} className="flex flex-col gap-1"><label htmlFor={`address-${name}`} className="text-sm font-medium">{label}</label><Input id={`address-${name}`} name={name} maxLength={name === "estado" ? 2 : undefined} value={form[name]} onChange={handleChange} required={!["complemento"].includes(name)} className="h-10" /></div>)}
                {(cepLoading || cepError) && <p className={`text-xs md:col-span-2 ${cepError ? "text-red-600" : "text-muted-foreground"}`}>{cepLoading ? "Consultando CEP..." : cepError}</p>}
                <label className="flex items-center gap-2 text-sm md:col-span-2"><input type="checkbox" name="is_primary" checked={form.is_primary} onChange={handleChange} />Definir como endereço principal</label>
                <div className="flex justify-end gap-3 md:col-span-2"><ButtonForms type="button" variant="outline" onClick={() => setIsFormOpen(false)}><X className="mr-1 h-4 w-4" />Cancelar</ButtonForms><ButtonForms type="submit" disabled={isSaving}>{isSaving ? "Salvando..." : "Salvar endereço"}</ButtonForms></div>
              </form>
            </PerfilCard>
          )}
        </section>
      </div>
    </div>
  );
}
