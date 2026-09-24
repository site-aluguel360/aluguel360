import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarraFiltros } from "../components/BarraFiltros";
import { FiltroLateral } from "../components/FiltroLateral";
import { FiltroPreco } from "../components/FiltroPreco";
import { CardImovel } from "../components/CardImovel";
import { listingApi, normalizeApiPage, toApiError } from "../lib/api";
import { adaptListings } from "../lib/adapters";

const INITIAL_FILTERS = {
  tipo: "",
  preco_min: "",
  preco_max: "",
  cidade: "",
  estado: "",
  quartos_min: "",
  banheiros_min: "",
  garagem_min: "",
  area_min: "",
  area_max: "",
  bairro: "",
  mobiliado: false,
  ordering: "-published_at",
};

function buildQuery(filters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== false) params.set(key, value);
  });
  return params.toString();
}

export function ResultadosPesquisa() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [pageUrl, setPageUrl] = useState("");
  const [page, setPage] = useState({ next: null, previous: null });
  const [imoveis, setImoveis] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const request = pageUrl ? listingApi.listUrl(pageUrl) : listingApi.list(buildQuery(filters));

    request
      .then((payload) => {
        if (!active) return;
        const normalized = normalizeApiPage(payload);
        setImoveis(adaptListings(normalized.results));
        setPage({ next: normalized.next, previous: normalized.previous });
      })
      .catch((requestError) => {
        if (!active) return;
        setError(toApiError(requestError));
        setImoveis([]);
        setPage({ next: null, previous: null });
      })
      .finally(() => active && setIsLoading(false));

    return () => { active = false; };
  }, [filters, pageUrl]);

  const updateFilter = (name, value) => {
    setIsLoading(true);
    setError("");
    setPageUrl("");
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const changePage = (url) => {
    if (!url || isLoading) return;
    setIsLoading(true);
    setError("");
    setPageUrl(url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <BarraFiltros ordering={filters.ordering} onOrderingChange={(value) => updateFilter("ordering", value)} />
        <p className="text-sm text-muted-foreground">{isLoading ? "Carregando..." : `${imoveis.length} imóveis nesta página`}</p>
      </div>
      {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
      <div className="grid gap-8 min-[1080px]:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden flex-col gap-4 self-start min-[1080px]:flex min-[1080px]:sticky min-[1080px]:top-6">
          <FiltroLateral filters={filters} onFilterChange={updateFilter} />
          <FiltroPreco filters={filters} onFilterChange={updateFilter} />
        </aside>
        <section className="min-w-0 space-y-5">
          {!isLoading && !error && imoveis.length === 0 && <p className="rounded-md border border-dashed p-10 text-center text-muted-foreground">Nenhum imóvel encontrado com esses filtros.</p>}
          <div className="grid gap-5 min-[1080px]:grid-cols-2 min-[1200px]:grid-cols-3">
            {imoveis.map((imovel) => <Link to={`/visualizar-imoveis/${imovel.id}`} key={imovel.id} className="block"><CardImovel {...imovel} /></Link>)}
          </div>
          {(page.previous || page.next) && (
            <nav className="flex items-center justify-center gap-4 pt-4" aria-label="Paginação do catálogo">
              <button type="button" disabled={!page.previous || isLoading} onClick={() => changePage(page.previous)} className="rounded-md border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50">Anterior</button>
              <button type="button" disabled={!page.next || isLoading} onClick={() => changePage(page.next)} className="rounded-md border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50">Próxima</button>
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}
