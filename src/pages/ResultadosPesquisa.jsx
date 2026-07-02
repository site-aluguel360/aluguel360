import { BarraFiltros } from "../components/BarraFiltros";
import { FiltroLateral } from "../components/FiltroLateral";
import { FiltroPreco } from "../components/FiltroPreco";
import { CardImovel } from "../components/CardImovel";


import { useState, useEffect } from "react";
import { useImoveis } from "../lib/hooks/useImoveis";

export function ResultadosPesquisa() {
  const { getImoveis } = useImoveis();
  const [imoveis, setImoveis] = useState([]);
  const [filtros, setFiltros] = useState({
    tipos: [],
    precoMin: "",
    precoMax: "",
    amenidades: [],
    ordenacao: null
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getImoveis(filtros).then(data => setImoveis(data));
  }, [filtros, getImoveis]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <BarraFiltros filtros={filtros} setFiltros={setFiltros} onOpenModal={() => setIsModalOpen(true)} />
        <p className="text-sm text-muted-foreground">{imoveis.length} imóveis encontrados</p>

      </div>

      <div className="grid gap-8 min-[1080px]:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden flex-col gap-4 self-start min-[1080px]:flex min-[1080px]:sticky min-[1080px]:top-[120px]">
          <FiltroLateral filtros={filtros} setFiltros={setFiltros} />
          <FiltroPreco filtros={filtros} setFiltros={setFiltros} />
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

      {/* Modal Mais Filtros */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4 text-primary">Mais Filtros</h2>
            <p className="text-gray-500 mb-6">Opções avançadas de filtragem serão adicionadas aqui na próxima iteração.</p>
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors" onClick={() => setIsModalOpen(false)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}