import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, BedDouble, Ruler, Star, MapPin, SquareDashedBottomCode } from "lucide-react";
import { Link } from "react-router-dom";

const singularMap = {
  "Quartos": "Quarto",
  "Salas": "Sala",
  "Varandas": "Varanda",
  "Suítes": "Suíte",
  "Banheiros": "Banheiro",
};

export function CardImovel({
  id,
  variant = "default", // "compact", "default", "detailed"
  titulo,
  descricao,
  preco,
  area,
  quartos,
  rooms = [],
  endereco,
  fotoPrincipal,
  imagem, // fallback for legacy prop
  avaliacaoMedia,
  banheiros,
  className = "",
}) {
  const [favorito, setFavorito] = useState(false);
  const imgSrc = fotoPrincipal || imagem;

  // Build items for room info grid (mostly used in default/detailed variants)
  const roomItems = [];
  if (area) roomItems.push({ label: `${area}m²`, hasIcon: true });

  if (rooms && rooms.length > 0) {
    rooms.forEach((room) => {
      const displayLabel = room.value === 1 ? (singularMap[room.label] || room.label) : room.label;
      roomItems.push({ label: `${room.value} ${displayLabel}` });
    });
  } else if (variant !== "compact") {
    if (quartos) roomItems.push({ label: `${quartos} ${quartos === 1 ? 'Quarto' : 'Quartos'}` });
    roomItems.push({ label: `1 Sala` });
    roomItems.push({ label: `1 Garagem` });
    roomItems.push({ label: `1 Varanda` });
    if (banheiros) roomItems.push({ label: `${banheiros} ${banheiros === 1 ? 'Banheiro' : 'Banheiros'}` });
    else roomItems.push({ label: `1 Banheiro` });
    roomItems.push({ label: `Extra` }); // triggers "Saiba mais"
  } else if (quartos) {
    roomItems.push({ label: `${quartos} quartos`, hasIcon: true, isBed: true });
  }

  const hasMore = roomItems.length > 6;
  const displayItems = hasMore
    ? [...roomItems.slice(0, 5), { label: "Saiba mais", isMore: true }]
    : roomItems;

  const innerCard = (
    <Card
      className={`
        w-full h-full flex flex-col rounded-xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 duration-300 border-border group relative
        ${className}
      `}
    >
      <div className={`relative overflow-hidden ${variant === "compact" ? "h-52" : "h-64"}`}>
        <img src={imgSrc} alt={titulo} className="w-full h-full object-cover" />
        <button
          onClick={(e) => {
            e.preventDefault();
            setFavorito(!favorito);
          }}
          className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-white/90 hover:bg-white transition"
        >
          <Heart className={`w-5 h-5 transition-colors duration-300 ${favorito ? "text-red-500 fill-current" : "text-gray-400"}`} />
        </button>
      </div>

      <CardContent className="p-5 flex-1 flex flex-col">
        <h3 className={`font-semibold text-foreground mb-2 ${variant === "compact" ? "text-lg line-clamp-2 h-14" : "text-lg"}`}>
          {titulo}
        </h3>

        {/* Compact variant shows stars */}
        {variant === "compact" && avaliacaoMedia && (
          <div className="flex text-amber-400 mb-2 gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.floor(avaliacaoMedia) ? "fill-current" : "text-gray-300"}`} />
            ))}
          </div>
        )}

        {/* Default variant shows description */}
        {variant !== "compact" && descricao && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{descricao}</p>
        )}

        <div className={`font-bold mt-4 ${variant === "compact" ? "text-2xl mb-4" : "text-2xl"}`}>
          R$ {preco}
        </div>

        {/* Info Grid for compact */}
        {variant === "compact" && (
          <div className="flex gap-4 text-muted-foreground text-sm border-b pb-4 mb-4">
            {area && <span className="flex items-center gap-1.5"><SquareDashedBottomCode className="w-4 h-4" /> {area}m²</span>}
            {quartos && <span className="flex items-center gap-1.5"><BedDouble className="w-4 h-4" /> {quartos} quartos</span>}
          </div>
        )}

        {/* Info Grid for default / detailed */}
        {variant !== "compact" && (
          <div className="grid grid-cols-3 gap-x-4 gap-y-2 mt-4 text-sm text-muted-foreground border-b pb-4 mb-4">
            {displayItems.map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-1 ${item.isMore ? "text-secondary cursor-pointer font-medium underline underline-offset-2" : ""}`}
              >
                {item.hasIcon && !item.isBed && <Ruler className="w-4 h-4 shrink-0" />}
                {item.isBed && <BedDouble className="w-4 h-4 shrink-0" />}
                <span className="truncate">{item.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Address */}
        <div className={`text-sm text-muted-foreground mt-auto ${variant === "compact" ? "flex items-start gap-2 line-clamp-2" : "pt-2"}`}>
          {variant === "compact" && <MapPin className="w-4 h-4 mt-0.5 shrink-0" />}
          <span className={variant === "compact" ? "" : "truncate block"}>{endereco}</span>
        </div>
      </CardContent>
    </Card>
  );

  if (id) {
    return (
      <Link to={`/visualizar-imoveis/${id}`} className="block h-full">
        {innerCard}
      </Link>
    );
  }

  return innerCard;
}
