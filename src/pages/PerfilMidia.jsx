import { useEffect, useRef, useState } from "react";
import { Image as ImageIcon, Play, Trash2, Upload } from "lucide-react";
import { PerfilHeader } from "../components/PerfilHeader";
import { PerfilSidebar } from "../components/PerfilSidebar";
import { PerfilCard } from "../components/PerfilCard";
import { Button } from "@/components/ui/button";
import { mediaApi, normalizeApiList, toApiError, userApi } from "../lib/api";
import { adaptUser } from "../lib/adapters";

const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];
const VIDEO_TYPES = ["video/mp4", "video/quicktime"];

function formatMb(value) {
  return `${Number(value || 0).toFixed(1)} MB`;
}

export function PerfilMidia() {
  const inputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [media, setMedia] = useState([]);
  const [quota, setQuota] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    const [userData, mediaData, quotaData] = await Promise.all([userApi.me(), mediaApi.list(), mediaApi.quota()]);
    setUser(adaptUser(userData));
    setMedia(normalizeApiList(mediaData));
    setQuota(quotaData);
  };

  useEffect(() => {
    let active = true;
    Promise.all([userApi.me(), mediaApi.list(), mediaApi.quota()])
      .then(([userData, mediaData, quotaData]) => {
        if (!active) return;
        setUser(adaptUser(userData));
        setMedia(normalizeApiList(mediaData));
        setQuota(quotaData);
      })
      .catch((requestError) => active && setError(toApiError(requestError)))
      .finally(() => active && setIsLoading(false));
    return () => { active = false; };
  }, []);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const isVideo = file.type.startsWith("video/");
    const allowed = isVideo ? VIDEO_TYPES : PHOTO_TYPES;
    const maxBytes = (isVideo ? 100 : 10) * 1024 * 1024;
    if (!allowed.includes(file.type)) {
      setError("Tipo de arquivo não permitido. Use JPEG, PNG, WebP, HEIC, MP4 ou MOV.");
      return;
    }
    if (file.size > maxBytes) {
      setError(`Arquivo muito grande. O limite para ${isVideo ? "vídeos é 100 MB" : "fotos é 10 MB"}.`);
      return;
    }
    setIsUploading(true);
    setError("");
    setMessage("");
    try {
      await mediaApi.upload(file, { tipo: isVideo ? "VIDEO" : "FOTO", nome: file.name });
      await load();
      setMessage("Mídia enviada com sucesso.");
    } catch (requestError) {
      setError(toApiError(requestError));
    } finally {
      setIsUploading(false);
    }
  };

  const remove = async (item) => {
    try {
      await mediaApi.remove(item.id);
      setMedia((current) => current.filter((mediaItem) => mediaItem.id !== item.id));
      const updatedQuota = await mediaApi.quota();
      setQuota(updatedQuota);
      setMessage("Mídia removida com sucesso.");
    } catch (requestError) {
      setError(toApiError(requestError));
    }
  };

  if (isLoading) return <p className="mx-auto max-w-7xl px-4 py-12 text-center text-muted-foreground">Carregando mídias...</p>;
  if (!user) return <p className="mx-auto max-w-7xl px-4 py-12 text-center text-red-600" role="alert">{error || "Não foi possível carregar as mídias."}</p>;
  const usagePercent = Math.min(100, Number(quota?.usage_percent || 0));

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6"><PerfilHeader usuario={user} /><div className="grid gap-8 min-[1080px]:grid-cols-[280px_minmax(0,1fr)]"><PerfilSidebar /><section className="min-w-0 space-y-5"><PerfilCard titulo="Fotos e Mídias" descricao="Gerencie os arquivos enviados para seus imóveis.">{error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}{message && <p className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700">{message}</p>}<div className="mb-5 grid gap-4 sm:grid-cols-3"><div className="rounded-lg bg-[#F0F4F8] p-4 text-center"><p className="text-3xl font-semibold text-[#2C7E7B]">{quota?.fotos_count || 0}</p><p className="text-xs text-[#2D2D2D]/60">Fotos enviadas</p></div><div className="rounded-lg bg-[#F0F4F8] p-4 text-center"><p className="text-3xl font-semibold text-[#2C7E7B]">{quota?.videos_count || 0}</p><p className="text-xs text-[#2D2D2D]/60">Vídeos</p></div><div className="rounded-lg bg-[#F0F4F8] p-4 text-center"><p className="text-3xl font-semibold text-[#2C7E7B]">{formatMb(quota?.total_mb_used)}</p><p className="text-xs text-[#2D2D2D]/60">Armazenado</p></div></div><div className="space-y-3">{media.length === 0 && <p className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">Nenhuma mídia enviada.</p>}{media.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg border border-[#D8E1E7] p-4"><div className="flex min-w-0 items-center gap-3">{item.tipo === "VIDEO" ? <Play className="h-5 w-5 shrink-0 text-[#FF6B6B]" /> : item.url ? <img src={item.thumbnail_url || item.url} alt={item.nome || "Mídia do imóvel"} className="h-12 w-12 rounded object-cover" /> : <ImageIcon className="h-5 w-5 shrink-0 text-[#2C7E7B]" />}<div className="min-w-0"><p className="truncate text-sm font-semibold">{item.nome || "Mídia"}</p><p className="text-xs text-[#2D2D2D]/60">{formatMb(item.tamanho_mb)} · {item.formato || item.tipo}</p></div></div><button type="button" onClick={() => remove(item)} className="flex shrink-0 items-center gap-2 text-xs font-semibold text-[#FF6B6B]"><Trash2 className="h-4 w-4" />Remover</button></div>)}</div><input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic,video/mp4,video/quicktime" onChange={handleFile} className="hidden" /><Button type="button" disabled={isUploading} onClick={() => inputRef.current?.click()} className="mt-4 w-full"><Upload className="mr-2 h-4 w-4" />{isUploading ? "Enviando..." : "Adicionar mídia"}</Button></PerfilCard><PerfilCard titulo="Limites de armazenamento" descricao="Uso atualizado pela API."><div className="mb-2 flex justify-between text-sm"><span>Uso</span><span>{formatMb(quota?.total_mb_used)} / {formatMb(quota?.total_mb_limit)}</span></div><div className="h-2 overflow-hidden rounded-full bg-[#D8E1E7]"><div className="h-full bg-[#2C7E7B]" style={{ width: `${usagePercent}%` }} /></div><p className="mt-2 text-xs text-[#2D2D2D]/70">{formatMb(quota?.available_mb)} disponíveis.</p></PerfilCard></section></div></div>
  );
}
