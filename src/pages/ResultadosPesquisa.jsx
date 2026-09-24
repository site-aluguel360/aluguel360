import { useEffect, useState } from "react";
import { BarraFiltros } from "../components/BarraFiltros";
import { FiltroLateral } from "../components/FiltroLateral";
import { FiltroPreco } from "../components/FiltroPreco";
import { CardImovel } from "../components/CardImovel";
import { listingApi, normalizeApiList, toApiError } from "../lib/api";
import { adaptListings } from "../lib/adapters";

export function ResultadosPesquisa() {
  const [imoveis, setImoveis] = useState(() => adaptListings([], true));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    listingApi.list()
      .then((payload) => {
        if (!active) return;
        const realItems = normalizeApiList(payload);
        setImoveis(adaptListings(realItems, true));
      })
      .catch((requestError) => {
        if (!active) return;
        setError(toApiError(requestError));
        setImoveis(adaptListings([], true));
      })
      .finally(() => active && setIsLoading(false));
    return () => { active = false; };
  }, []);

  return <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6"><div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><BarraFiltros /><p className="text-sm text-muted-foreground">{isLoading ? "Carregando..." : `${imoveis.length} imóveis encontrados`}</p></div>{error && <p className="mb-4 rounded-md bg-amber-50 p-3 text-sm text-amber-800">API indisponível no momento. Exibindo dados de demonstração.</p>}<div className="grid gap-8 min-[1080px]:grid-cols-[280px_minmax(0,1fr)]"><aside className="hidden flex-col gap-4 self-start min-[1080px]:flex min-[1080px]:sticky min-[1080px]:top-6"><FiltroLateral /><FiltroPreco /></aside><section className="min-w-0 space-y-5"><div className="grid gap-5 min-[1080px]:grid-cols-2 min-[1200px]:grid-cols-3">{imoveis.map((imovel) => <CardImovel key={imovel.id} {...imovel} />)}</div></section></div></div>;
}
