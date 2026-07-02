import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function FiltroPreco({ filtros, setFiltros }) {
  const handlePrecoChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const toggleAmenidade = (amenidade) => {
    setFiltros(prev => {
      const isSelected = prev.amenidades.includes(amenidade);
      return {
        ...prev,
        amenidades: isSelected 
          ? prev.amenidades.filter(a => a !== amenidade)
          : [...prev.amenidades, amenidade]
      };
    });
  };

  const toggleVagas = () => {
    setFiltros(prev => ({
      ...prev,
      vagas: prev.vagas ? null : 1 // 1 or null
    }));
  };

  return (
    <Card className="w-full p-5 border border-gray-300 rounded-lg font-medium">
      <h2 className="text-primary text-lg mb-4">
        Faixa de Preço
      </h2>

      <div className="flex gap-2 mb-4">
        <div className="flex-1">
          <label className="text-xs text-primary mb-1 block">
            De
          </label>
          <Input
            type="number"
            placeholder="R$ 500"
            className="h-8"
            value={filtros?.precoMin || ''}
            onChange={(e) => handlePrecoChange('precoMin', e.target.value)}
          />
        </div>

        <div className="flex-1">
          <label className="text-xs text-primary mb-1 block">
            Até
          </label>
          <Input
            type="number"
            placeholder="R$ 10.000"
            className="h-8"
            value={filtros?.precoMax || ''}
            onChange={(e) => handlePrecoChange('precoMax', e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 font-light mt-6">
        <label>
          <input 
            type="checkbox" 
            checked={filtros?.amenidades.includes("Mobiliado") || false}
            onChange={() => toggleAmenidade("Mobiliado")}
          />
          <span className="ml-2">Mobiliado</span>
        </label>

        <label>
          <input 
            type="checkbox" 
            checked={filtros?.vagas === 1 || false}
            onChange={toggleVagas}
          />
          <span className="ml-2">Com Vaga</span>
        </label>
      </div>
    </Card>
  );
}