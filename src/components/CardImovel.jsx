import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, BedDouble, Ruler } from "lucide-react";

const singularMap = {
  "Quartos": "Quarto",
  "Salas": "Sala",
  "Varandas": "Varanda",
  "Suítes": "Suíte",
  "Banheiros": "Banheiro",
};

export function CardImovel({
  imagem,
  titulo,
  descricao,
  preco,
  area,
  quartos,
  rooms = [],
  endereco,
}) {

  const [favorito, setFavorito] = useState(false);

  // Build items for room info grid
  const roomItems = [];
  if (area) roomItems.push({ label: `${area}m²`, hasIcon: true });

  if (rooms.length > 0) {
    rooms.forEach((room) => {
      const displayLabel =
        room.value === 1
          ? (singularMap[room.label] || room.label)
          : room.label;
      roomItems.push({ label: `${room.value} ${displayLabel}` });
    });
  } else if (quartos) {
    roomItems.push({ label: `${quartos} quartos`, hasIcon: true, isBed: true });
  }

  const hasMore = roomItems.length > 6;
  const displayItems = hasMore
    ? [...roomItems.slice(0, 5), { label: "Saiba mais", isMore: true }]
    : roomItems;

  return (
   <Card
  className="
    rounded-xl
    overflow-hidden
    hover:shadow-lg
    transition-all
    hover:-translate-y-1
    duration-300
    border-border
    group
    relative
  "
>

      <div className="relative h-64 overflow-hidden">

        <img
          src={imagem}
          alt={titulo}
          className="
            w-full
            h-full
            object-cover
          "
        />

        <button
          onClick={() => setFavorito(!favorito)}
          className="
            absolute
            top-4
            right-4
            flex
            items-center
            justify-center
            w-10
            h-10
            rounded-full
            bg-white/90
            hover:bg-white
            transition
          "
        >

         <Heart
  className={`
    w-5
    h-5
    transition-colors
    duration-300
    ${
      favorito
        ? "text-red-500"
        : "text-gray-400"
    }
  `}
/>

        </button>

      </div>

      <CardContent className="p-5">

        <h3 className="text-lg font-medium">
          {titulo}
        </h3>
    
        <p className="text-sm text-gray-500 mt-2">
          {descricao}
        </p>

        <p className="font-semibold text-2xl mt-4">
          R$ {preco}
        </p>

       <div className="grid grid-cols-3 gap-x-4 gap-y-2 mt-4 text-sm text-muted-foreground border-b pb-4 mb-4">
          {displayItems.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-1 ${
                item.isMore
                  ? "text-secondary cursor-pointer font-medium underline underline-offset-2"
                  : ""
              }`}
            >
              {item.hasIcon && !item.isBed && (
                <Ruler className="w-4 h-4 shrink-0" />
              )}
              {item.isBed && (
                <BedDouble className="w-4 h-4 shrink-0" />
              )}
              <span className="truncate">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm text-gray-500">
          {endereco}
        </div>

      </CardContent>

    </Card>
  );
}
