import { Card } from "@/components/ui/card";

export function FiltroLateral({ filtros, setFiltros }) {
  const toggleTipo = (tipo) => {
    setFiltros(prev => {
      const isSelected = prev.tipos.includes(tipo);
      return {
        ...prev,
        tipos: isSelected 
          ? prev.tipos.filter(t => t !== tipo)
          : [...prev.tipos, tipo]
      };
    });
  };

  const tipos = ["Casa", "Apartamento", "Kitnet", "Casa de Condomínio"];

  return (
    <Card className="w-full p-5 border border-gray-300 rounded-lg font-medium">
      <h2 className="text-primary text-lg mb-4">
        Tipo de imóvel
      </h2>

      <div className="flex flex-col gap-3 font-light">
        {tipos.map(tipo => (
          <label key={tipo}>
            <input 
              type="checkbox" 
              checked={filtros?.tipos.includes(tipo) || false}
              onChange={() => toggleTipo(tipo)}
            />
            <span className="ml-2">{tipo}</span>
          </label>
        ))}
      </div>
    </Card>
  );
}