import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function FiltroPreco({ filters, onFilterChange }) {
  return (
    <Card className="w-72 p-5 border border-gray-300 rounded-lg font-medium">
      <h2 className="text-[#1A535C] text-lg mb-4">Faixa de Preço</h2>
      <div className="flex gap-2 mb-4">
        <div className="flex-1">
          <label htmlFor="preco-min" className="text-xs text-[#1A535C] mb-1 block">De</label>
          <Input id="preco-min" type="number" min="0" value={filters?.preco_min || ""} onChange={(event) => onFilterChange("preco_min", event.target.value)} placeholder="R$ 500" className="h-8" />
        </div>
        <div className="flex-1">
          <label htmlFor="preco-max" className="text-xs text-[#1A535C] mb-1 block">Até</label>
          <Input id="preco-max" type="number" min="0" value={filters?.preco_max || ""} onChange={(event) => onFilterChange("preco_max", event.target.value)} placeholder="R$ 10.000" className="h-8" />
        </div>
      </div>
      <h2 className="text-[#1A535C] text-lg mb-3 mt-5">Metragem</h2>
      <div className="flex gap-2 mb-4">
        <Input aria-label="Área mínima" type="number" min="0" value={filters?.area_min || ""} onChange={(event) => onFilterChange("area_min", event.target.value)} placeholder="Mín. m²" className="h-8" />
        <Input aria-label="Área máxima" type="number" min="0" value={filters?.area_max || ""} onChange={(event) => onFilterChange("area_max", event.target.value)} placeholder="Máx. m²" className="h-8" />
      </div>
      <label className="cursor-pointer font-light">
        <input type="checkbox" checked={Boolean(filters?.mobiliado)} onChange={(event) => onFilterChange("mobiliado", event.target.checked)} />
        <span className="ml-2">Mobiliado</span>
      </label>
    </Card>
  );
}
