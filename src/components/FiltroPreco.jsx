import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function FiltroPreco() {
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
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 font-light">
        <label>
          <input type="checkbox" />
          <span className="ml-2">Região/Bairro</span>
        </label>

        <label>
          <input type="checkbox" />
          <span className="ml-2">Mobiliado</span>
        </label>

        <label>
          <input type="checkbox" />
          <span className="ml-2">Metragem</span>
        </label>

        <label>
          <input type="checkbox" />
          <span className="ml-2">Vagas</span>
        </label>
      </div>
    </Card>
  );
}