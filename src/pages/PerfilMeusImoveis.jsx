import { useEffect, useState } from "react";
import { Home, Edit, Trash2 } from "lucide-react";
import { PerfilHeader } from "../components/PerfilHeader";
import { PerfilSidebar } from "../components/PerfilSidebar";
import { PerfilCard } from "../components/PerfilCard";
import { propertyApi, normalizeApiList, toApiError, userApi } from "../lib/api";
import { adaptUser } from "../lib/adapters";

function addressLabel(property) {
  return `${property.logradouro}, ${property.numero} — ${property.bairro}, ${property.cidade}/${property.estado}`;
}

export function PerfilMeusImoveis() {
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([userApi.me(), propertyApi.list()])
      .then(([userData, propertiesData]) => {
        if (!active) return;
        setUser(adaptUser(userData));
        setProperties(normalizeApiList(propertiesData));
      })
      .catch((requestError) => active && setError(toApiError(requestError)))
      .finally(() => active && setIsLoading(false));
    return () => { active = false; };
  }, []);

  const remove = async (property) => {
    try {
      await propertyApi.remove(property.id);
      setProperties((current) => current.filter((item) => item.id !== property.id));
    } catch (requestError) {
      setError(toApiError(requestError));
    }
  };

  if (isLoading) return <p className="mx-auto max-w-7xl px-4 py-12 text-center text-muted-foreground">Carregando imóveis...</p>;
  if (!user) return <p className="mx-auto max-w-7xl px-4 py-12 text-center text-red-600" role="alert">{error || "Não foi possível carregar os imóveis."}</p>;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6"><PerfilHeader usuario={user} /><div className="grid gap-8 min-[1080px]:grid-cols-[280px_minmax(0,1fr)]"><PerfilSidebar /><section className="min-w-0 space-y-5"><PerfilCard titulo="Meus Imóveis" descricao="Imóveis cadastrados no seu usuário.">{error && <p className="mb-4 text-sm text-red-600" role="alert">{error}</p>}{properties.length === 0 && <p className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">Nenhum imóvel cadastrado.</p>}<div className="space-y-4">{properties.map((property) => <div key={property.id} className="rounded-lg border border-[#D8E1E7] p-4"><div className="mb-3 flex items-start justify-between"><div className="flex items-center gap-3"><Home className="h-5 w-5 text-[#2C7E7B]" /><div><h4 className="text-[14px] font-semibold">{property.tipo}</h4><p className="text-[12px] text-[#2D2D2D]/60">{addressLabel(property)}</p></div></div><span className="rounded-full bg-[#4ECDC4]/20 px-3 py-1 text-[10px] font-semibold text-[#2C7E7B]">{property.status}</span></div><div className="flex gap-3 border-t pt-3"><button type="button" className="flex items-center gap-2 text-[12px] font-semibold text-[#1A535C]"><Edit className="h-4 w-4" />Editar</button><button type="button" onClick={() => remove(property)} className="flex items-center gap-2 text-[12px] font-semibold text-[#FF6B6B]"><Trash2 className="h-4 w-4" />Deletar</button></div></div>)}</div></PerfilCard></section></div></div>
  );
}
