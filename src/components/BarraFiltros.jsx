import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

export function BarraFiltros({ ordering = "-published_at", onOrderingChange }) {
  const estiloBotao = "rounded-full px-6 font-medium text-sm text-gray-700 hover:text-secondary hover:border-secondary";

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm font-medium text-gray-800">Ordenar por:</span>
      <Button type="button" variant="outline" className={estiloBotao} onClick={() => onOrderingChange(ordering === "aluguel" ? "-aluguel" : "aluguel")}>
        Preços {ordering === "aluguel" ? "↑" : ordering === "-aluguel" ? "↓" : ""}
      </Button>
      <Button type="button" variant="outline" className={estiloBotao} onClick={() => onOrderingChange("-views_count")}>
        Mais acessados
      </Button>
      <Button type="button" variant="outline" className={`${estiloBotao} flex items-center gap-2`} onClick={() => onOrderingChange("-published_at")}>
        Mais recentes <SlidersHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
}
