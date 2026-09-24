import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const propertyTypes = [
  ["CASA", "Casa"],
  ["APARTAMENTO", "Apartamento"],
  ["KITNET", "Kitnet"],
];

export function FiltroLateral({ filters, onFilterChange }) {
  const tipo = filters?.tipo || "";
  return (
    <Card className="w-72 p-5 border border-gray-300 rounded-lg font-medium">
      <h2 className="text-[#1A535C] text-lg mb-4">Tipo de imóvel</h2>
      <div className="flex flex-col gap-3 font-light">
        {propertyTypes.map(([value, label]) => (
          <label key={value} className="cursor-pointer">
            <input type="checkbox" checked={tipo === value} onChange={() => onFilterChange("tipo", tipo === value ? "" : value)} />
            <span className="ml-2">{label}</span>
          </label>
        ))}
      </div>
      <h2 className="text-[#1A535C] text-lg mb-3 mt-6">Localização</h2>
      <div className="flex flex-col gap-2">
        <Input aria-label="Cidade" value={filters?.cidade || ""} onChange={(event) => onFilterChange("cidade", event.target.value)} placeholder="Cidade" className="h-8" />
        <Input aria-label="Estado" maxLength={2} value={filters?.estado || ""} onChange={(event) => onFilterChange("estado", event.target.value.toUpperCase())} placeholder="UF" className="h-8" />
        <Input aria-label="Bairro" value={filters?.bairro || ""} onChange={(event) => onFilterChange("bairro", event.target.value)} placeholder="Bairro" className="h-8" />
      </div>
      <h2 className="text-[#1A535C] text-lg mb-3 mt-6">Características mínimas</h2>
      <div className="grid grid-cols-3 gap-2">
        <Input aria-label="Quartos mínimos" type="number" min="0" value={filters?.quartos_min || ""} onChange={(event) => onFilterChange("quartos_min", event.target.value)} placeholder="Quartos" className="h-8" />
        <Input aria-label="Banheiros mínimos" type="number" min="0" value={filters?.banheiros_min || ""} onChange={(event) => onFilterChange("banheiros_min", event.target.value)} placeholder="Banheiros" className="h-8" />
        <Input aria-label="Vagas mínimas" type="number" min="0" value={filters?.garagem_min || ""} onChange={(event) => onFilterChange("garagem_min", event.target.value)} placeholder="Vagas" className="h-8" />
      </div>
    </Card>
  );
}
