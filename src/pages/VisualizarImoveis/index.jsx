import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BedDouble, Heart, MapPin, Ruler, Star } from "lucide-react";
import { Button } from "../../components/ui/button";
import { listingApi, toApiError } from "../../lib/api";

function money(value) {
  return Number(value || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

function mediaUrl(media) {
  return media?.url_optimized || media?.thumbnail_url || media?.url || "";
}

export function VisualizarImoveis() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [activeMedia, setActiveMedia] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    listingApi.detail(id)
      .then((data) => active && setListing(data))
      .catch((requestError) => active && setError(toApiError(requestError)))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [id]);

  if (loading) return <div className="mx-auto max-w-7xl px-5 py-16 text-center text-muted-foreground">Carregando imóvel...</div>;
  if (error || !listing) return <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-5 py-16 text-center"><p className="text-red-600" role="alert">{error || "Imóvel não encontrado."}</p><Link to="/resultados"><Button variant="outline">Voltar para resultados</Button></Link></div>;

  const address = listing.property_address || {};
  const rooms = listing.property_rooms || [];
  const photos = (listing.medias || []).filter((item) => item.tipo === "FOTO" && mediaUrl(item));
  const videos = (listing.medias || []).filter((item) => item.tipo === "VIDEO" && mediaUrl(item));
  const gallery = [...photos, ...videos];
  const current = gallery[activeMedia] || null;
  const location = [address.logradouro, address.numero, address.bairro].filter(Boolean).join(", ");
  const cityState = [address.cidade, address.estado].filter(Boolean).join(" - ");
  const bedrooms = rooms.find((room) => room.tipo === "quartos")?.quantidade || 0;
  const quality = Math.round(Number(listing.quality_score || 0) / 2);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-8">
      <Link to="/resultados" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-secondary"><ArrowLeft className="h-4 w-4" />Voltar para resultados</Link>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section>
          <div className="relative flex h-[360px] items-center justify-center overflow-hidden rounded-xl bg-slate-900 md:h-[480px]">
            {current?.tipo === "VIDEO" ? <video src={mediaUrl(current)} controls className="h-full w-full object-contain" /> : current ? <img src={mediaUrl(current)} alt={listing.titulo} className="h-full w-full object-cover" /> : <div className="text-sm text-white/70">Este anúncio ainda não possui mídia.</div>}
          </div>
          {gallery.length > 0 && <div className="mt-3 flex gap-2 overflow-x-auto">{gallery.map((item, index) => <button type="button" key={item.id || index} onClick={() => setActiveMedia(index)} className={`h-16 w-20 shrink-0 overflow-hidden rounded-md border-2 ${index === activeMedia ? "border-secondary" : "border-transparent"}`}>{item.tipo === "VIDEO" ? <span className="flex h-full items-center justify-center bg-secondary text-xs text-white">Vídeo</span> : <img src={mediaUrl(item)} alt="Miniatura do imóvel" className="h-full w-full object-cover" />}</button>)}</div>}
          <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm"><div className="flex items-start justify-between gap-4"><div><h1 className="text-2xl font-bold text-foreground">{listing.titulo || "Imóvel sem título"}</h1><div className="mt-2 flex items-center gap-2 text-amber-500">{[1, 2, 3, 4, 5].map((item) => <Star key={item} className={`h-4 w-4 ${item <= quality ? "fill-current" : "text-gray-300"}`} />)}<span className="ml-1 text-xs text-muted-foreground">{listing.views_count || 0} visualizações</span></div></div><button type="button" onClick={() => setFavorite((value) => !value)} aria-label="Favoritar imóvel"><Heart className={`h-6 w-6 ${favorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} /></button></div><p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{listing.descricao || "Descrição não informada."}</p></div>
        </section>
        <aside className="h-fit rounded-xl border bg-white p-6 shadow-sm"><p className="text-3xl font-black">R$ {money(listing.aluguel)}<span className="text-sm font-normal text-muted-foreground">/mês</span></p><div className="mt-5 space-y-3 border-y py-5 text-sm text-muted-foreground"><p className="flex items-center gap-2"><Ruler className="h-4 w-4 text-secondary" />{address.area_m2 || 0} m²</p><p className="flex items-center gap-2"><BedDouble className="h-4 w-4 text-secondary" />{bedrooms} quartos</p><p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" /><span>{location || "Endereço não informado"}{cityState && <><br />{cityState}</>}</span></p></div><div className="space-y-2 text-sm"><p><strong>Garantia:</strong> {listing.garantia || "Sem garantia"}</p><p><strong>Condomínio:</strong> {listing.condominio_incluido ? "Incluso" : `R$ ${money(listing.condominio_valor)}`}</p><p><strong>IPTU:</strong> {listing.iptu_incluido ? "Incluso" : `R$ ${money(listing.iptu_valor)}`}</p></div><Button className="mt-6 w-full bg-secondary hover:bg-secondary-hover">Tenho interesse</Button></aside>
      </div>
    </main>
  );
}
