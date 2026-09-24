import { useEffect, useState } from "react";
import { Eye, Heart, MessageCircle, Pause, Play, Trash2 } from "lucide-react";
import { PerfilHeader } from "../components/PerfilHeader";
import { PerfilSidebar } from "../components/PerfilSidebar";
import { PerfilCard } from "../components/PerfilCard";
import { listingApi, normalizeApiList, toApiError, userApi } from "../lib/api";
import { adaptUser } from "../lib/adapters";

const STATUS_LABELS = { PUBLICADO: "Publicado", PAUSADO: "Pausado", RASCUNHO: "Rascunho", EXPIRADO: "Expirado", ALUGADO: "Alugado" };

export function PerfilMeusAnuncios() {
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([userApi.me(), listingApi.mine()])
      .then(([userData, listingsData]) => {
        if (!active) return;
        setUser(adaptUser(userData));
        setListings(normalizeApiList(listingsData));
      })
      .catch((requestError) => active && setError(toApiError(requestError)))
      .finally(() => active && setIsLoading(false));
    return () => { active = false; };
  }, []);

  const updateStatus = async (listing) => {
    try {
      if (listing.status === "PUBLICADO") await listingApi.pause(listing.id);
      else await listingApi.publish(listing.id);
      const refreshed = await listingApi.mine();
      setListings(normalizeApiList(refreshed));
    } catch (requestError) {
      setError(toApiError(requestError));
    }
  };

  const remove = async (listing) => {
    try {
      await listingApi.remove(listing.id);
      setListings((current) => current.filter((item) => item.id !== listing.id));
    } catch (requestError) {
      setError(toApiError(requestError));
    }
  };

  const visibleListings = statusFilter ? listings.filter((listing) => listing.status === statusFilter) : listings;
  if (isLoading) return <p className="mx-auto max-w-7xl px-4 py-12 text-center text-muted-foreground">Carregando anúncios...</p>;
  if (!user) return <p className="mx-auto max-w-7xl px-4 py-12 text-center text-red-600" role="alert">{error || "Não foi possível carregar os anúncios."}</p>;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6"><PerfilHeader usuario={user} /><div className="grid gap-8 min-[1080px]:grid-cols-[280px_minmax(0,1fr)]"><PerfilSidebar /><section className="min-w-0 space-y-5"><PerfilCard titulo="Meus Anúncios" descricao="Anúncios pertencentes ao usuário autenticado.">{error && <p className="mb-4 text-sm text-red-600" role="alert">{error}</p>}<div className="mb-5 flex flex-wrap gap-2">{[["", "Todos"], ["PUBLICADO", "Publicados"], ["PAUSADO", "Pausados"], ["RASCUNHO", "Rascunhos"], ["ALUGADO", "Alugados"]].map(([value, label]) => <button key={value || "all"} type="button" onClick={() => setStatusFilter(value)} className={`rounded-full border px-4 py-2 text-xs font-semibold ${statusFilter === value ? "bg-[#4ECDC4] text-white" : "text-[#2D2D2D]/80"}`}>{label}</button>)}</div>{visibleListings.length === 0 && <p className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">Nenhum anúncio encontrado.</p>}<div className="space-y-4">{visibleListings.map((listing) => <div key={listing.id} className="rounded-lg border border-[#D8E1E7] p-4"><div className="mb-3 flex items-start justify-between"><div><h4 className="text-[14px] font-semibold">{listing.titulo}</h4><p className="text-[12px] text-[#2D2D2D]/60">R$ {Number(listing.aluguel || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/mês</p></div><span className="rounded-full bg-[#4ECDC4]/20 px-3 py-1 text-[10px] font-semibold text-[#2C7E7B]">{STATUS_LABELS[listing.status] || listing.status}</span></div><div className="mb-4 grid gap-2 sm:grid-cols-3"><span className="flex items-center gap-2 rounded-lg bg-[#F0F4F8] p-2 text-xs"><Eye className="h-4 w-4 text-[#2C7E7B]" />{listing.views_count || 0} visualizações</span><span className="flex items-center gap-2 rounded-lg bg-[#F0F4F8] p-2 text-xs"><MessageCircle className="h-4 w-4 text-[#2C7E7B]" />{listing.messages_count || 0} mensagens</span><span className="flex items-center gap-2 rounded-lg bg-[#F0F4F8] p-2 text-xs"><Heart className="h-4 w-4 text-[#2C7E7B]" />{listing.favorites_count || 0} favoritos</span></div><div className="flex flex-wrap gap-3"><button type="button" onClick={() => updateStatus(listing)} className="flex items-center gap-2 text-xs font-semibold text-[#1A535C]">{listing.status === "PUBLICADO" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}{listing.status === "PUBLICADO" ? "Pausar" : "Publicar"}</button><button type="button" onClick={() => remove(listing)} className="flex items-center gap-2 text-xs font-semibold text-[#FF6B6B]"><Trash2 className="h-4 w-4" />Remover</button></div></div>)}</div></PerfilCard></section></div></div>
  );
}
