import { BarraFiltros } from "../components/BarraFiltros";
import { FiltroLateral } from "../components/FiltroLateral";
import { FiltroPreco } from "../components/FiltroPreco";
import { CardImovel } from "../components/CardImovel";


import { useState, useEffect } from "react";
import { useImoveis } from "../lib/hooks/useImoveis";

export function ResultadosPesquisa() {
  const { getImoveis } = useImoveis();
  const [imoveis, setImoveis] = useState([]);

  useEffect(() => {
    getImoveis().then(data => setImoveis(data));
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <BarraFiltros />
        <p className="text-sm text-muted-foreground">{imoveis.length} imóveis encontrados</p>

      </div>

      <div className="grid gap-8 min-[1080px]:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden flex-col gap-4 self-start min-[1080px]:flex min-[1080px]:sticky min-[1080px]:top-[120px]">
          <FiltroLateral />
          <FiltroPreco />
        </aside>

        <section className="min-w-0 space-y-5">
          <div className="grid gap-5 min-[1080px]:grid-cols-2 min-[1200px]:grid-cols-3">
            {imoveis.map((imovel) => (
              <CardImovel
                key={imovel.id}
                {...imovel}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}