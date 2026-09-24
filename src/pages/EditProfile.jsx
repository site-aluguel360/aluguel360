import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PerfilHeader } from "../components/PerfilHeader";
import { PerfilSidebar } from "../components/PerfilSidebar";
import { PerfilCard } from "../components/PerfilCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toApiError, userApi } from "../lib/api";
import { adaptUser } from "../lib/adapters";

export function EditProfile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ nome: "", telefone: "", data_nascimento: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;
    userApi.me()
      .then((data) => {
        if (!active) return;
        const currentUser = adaptUser(data);
        setUser(currentUser);
        setForm({ nome: currentUser.nome || "", telefone: currentUser.telefone || "", data_nascimento: currentUser.data_nascimento || "" });
      })
      .catch((requestError) => active && setError(toApiError(requestError)))
      .finally(() => active && setIsLoading(false));
    return () => { active = false; };
  }, []);

  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSave = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setMessage("");
    try {
      const updated = await userApi.updateMe({
        nome: form.nome.trim(),
        telefone: form.telefone.trim(),
        data_nascimento: form.data_nascimento || null,
      });
      setUser(adaptUser(updated));
      setMessage("Alterações salvas com sucesso!");
    } catch (requestError) {
      setError(toApiError(requestError));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <p className="mx-auto max-w-7xl px-4 py-12 text-center text-muted-foreground">Carregando perfil...</p>;
  if (error && !user) return <p className="mx-auto max-w-7xl px-4 py-12 text-center text-red-600" role="alert">{error}</p>;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
      <div className="grid gap-8 min-[1080px]:grid-cols-[200px_minmax(0,1fr)]">
        <PerfilSidebar />
        <div className="flex min-w-0 flex-col">
          <PerfilHeader usuario={user} />
          <PerfilCard titulo="Editar Perfil" descricao="Atualize somente os dados aceitos pelo seu perfil.">
            <form onSubmit={handleSave} className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-1"><label htmlFor="profile-name" className="text-[14px] font-medium">Nome Completo</label><Input id="profile-name" type="text" name="nome" value={form.nome} onChange={handleChange} required className="h-[41px]" /></div>
              <div className="flex flex-col gap-1"><label htmlFor="profile-email" className="text-[14px] font-medium">E-mail</label><Input id="profile-email" type="email" value={user.email || ""} readOnly disabled className="h-[41px] bg-[#F0F4F8] opacity-80" /><small className="text-[11px] text-muted-foreground">O email não pode ser alterado nesta etapa.</small></div>
              <div className="flex flex-col gap-1"><label htmlFor="profile-birth" className="text-[14px] font-medium">Data de Nascimento</label><Input id="profile-birth" type="date" name="data_nascimento" value={form.data_nascimento || ""} onChange={handleChange} className="h-[41px]" /></div>
              <div className="flex flex-col gap-1"><label htmlFor="profile-phone" className="text-[14px] font-medium">Telefone</label><Input id="profile-phone" type="text" name="telefone" value={form.telefone} onChange={handleChange} className="h-[41px]" /></div>
              <p className="text-xs text-muted-foreground md:col-span-2">Endereços são gerenciados separadamente em <Link to="/perfil/enderecos" className="text-[#1A535C] underline">Meus Endereços</Link>.</p>
              {error && <p className="text-sm text-red-600 md:col-span-2" role="alert">{error}</p>}
              {message && <p className="rounded-lg bg-green-50 p-4 text-sm text-green-700 md:col-span-2">{message}</p>}
              <div className="flex justify-end gap-4 md:col-span-2"><Link to="/perfil"><Button type="button" variant="outline">Cancelar</Button></Link><Button type="submit" disabled={isSaving}>{isSaving ? "Salvando..." : "Salvar Alterações"}</Button></div>
            </form>
          </PerfilCard>
        </div>
      </div>
    </div>
  );
}
