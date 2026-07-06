import { Button } from "@/components/ui/button";
import { SlidersHorizontal, ChevronUp, ChevronDown } from "lucide-react";

export function BarraFiltros({ filtros, setFiltros, onOpenModal }) {
  const toggleOrdenacao = (campo) => {
    setFiltros(prev => {
      let novaDirecao = 'asc';
      if (prev.ordenacao && prev.ordenacao.campo === campo) {
        novaDirecao = prev.ordenacao.direcao === 'asc' ? 'desc' : 'asc';
      }
      return {
        ...prev,
        ordenacao: { campo, direcao: novaDirecao }
      };
    });
  };

  const getEstiloBotao = (campo) => {
    const isActive = filtros?.ordenacao?.campo === campo;
    return `rounded-full px-6 font-medium text-sm flex items-center gap-1.5 transition-colors ${
      isActive 
        ? "bg-primary text-white border-primary hover:bg-primary/90 hover:text-white" 
        : "text-gray-700 hover:text-secondary hover:border-secondary"
    }`;
  };

  const renderIcon = (campo) => {
    if (filtros?.ordenacao?.campo !== campo) return null;
    return filtros.ordenacao.direcao === 'asc' 
      ? <ChevronUp className="w-4 h-4 opacity-70" /> 
      : <ChevronDown className="w-4 h-4 opacity-70" />;
  };

  const toggleMobiliado = () => {
    setFiltros(prev => {
      const isSelected = prev.amenidades.includes("Mobiliado");
      return {
        ...prev,
        amenidades: isSelected 
          ? prev.amenidades.filter(a => a !== "Mobiliado")
          : [...prev.amenidades, "Mobiliado"]
      };
    });
  };

  const isMobiliado = filtros?.amenidades?.includes("Mobiliado");

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm font-medium text-gray-800">
        Ordenar por:
      </span>

      <Button variant="outline" className={getEstiloBotao('preco')} onClick={() => toggleOrdenacao('preco')}>
        Preços {renderIcon('preco')}
      </Button>

      <Button variant="outline" className={getEstiloBotao('quartos')} onClick={() => toggleOrdenacao('quartos')}>
        Quartos {renderIcon('quartos')}
      </Button>

      <Button variant="outline" className={getEstiloBotao('banheiros')} onClick={() => toggleOrdenacao('banheiros')}>
        Banheiros {renderIcon('banheiros')}
      </Button>

      <Button variant="outline" className={getEstiloBotao('vagas')} onClick={() => toggleOrdenacao('vagas')}>
        Vagas {renderIcon('vagas')}
      </Button>

      <Button 
        variant="outline" 
        className={`rounded-full px-6 font-medium text-sm transition-colors ${isMobiliado ? "bg-teal-600 text-white border-teal-600 hover:bg-teal-700 hover:text-white" : "text-gray-700 hover:text-teal-600 hover:border-teal-600"}`} 
        onClick={toggleMobiliado}
      >
        Mobiliado
      </Button>

      <Button
        variant="outline"
        className="rounded-full px-6 font-medium text-sm text-gray-700 hover:text-secondary hover:border-secondary flex items-center gap-2"
        onClick={onOpenModal}
      >
        Mais Filtros
        <SlidersHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
}