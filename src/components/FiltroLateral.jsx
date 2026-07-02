import { Card } from "@/components/ui/card";

export function FiltroLateral() {
  return (
    <Card className="w-full p-5 border border-gray-300 rounded-lg font-medium">
      <h2 className="text-primary text-lg mb-4">
        Tipo de imóvel
      </h2>

      <div className="flex flex-col gap-3 font-light">

        <label>
          <input type="checkbox" />
          <span className="ml-2 ">Casa</span>
        </label>

        <label>
          <input type="checkbox" />
          <span className="ml-2">Apartamento</span>
        </label>

        <label>
          <input type="checkbox" />
          <span className="ml-2">Kitnet</span>
        </label>

        <label>
          <input type="checkbox" />
          <span className="ml-2">Casa de Condomínio</span>
        </label>

      </div>

    </Card>
  );
}