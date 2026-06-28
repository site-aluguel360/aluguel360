import { BarraFiltros } from "../components/BarraFiltros";
import { FiltroLateral } from "../components/FiltroLateral";
import { FiltroPreco } from "../components/FiltroPreco";
import { CardImovel } from "../components/CardImovel";


const imoveis = [
  {
    id: 1,
    imagem: "/assets/property_1.png",
    titulo: "Apartamento Moderno - Centro",
    descricao: "",
    preco: "2.300",
    area: 60,
    quartos: 2,
    endereco: "Rua Ipê Amarelo, 128",
  },
  {
    id: 2,
    imagem: "/assets/property_2.png",
    titulo: "Casa Rústica no Campo",
    descricao: "Ambiente tranquilo cercado pela natureza",
    preco: "3.800",
    area: 140,
    quartos: 3,
    endereco: "Estrada das Palmeiras, km 12",
  },
  {
    id: 3,
    imagem: "/assets/property_3.png",
    titulo: "Casa Moderna com Design Minimalista",
    descricao: "Ambientes amplos e iluminação natural",
    preco: "5.200",
    area: 180,
    quartos: 4,
    endereco: "Alameda Horizonte, 220",
  },
  {
    id: 4,
    imagem: "/assets/property_4.jpg",
    titulo: "Casa simples para estudantes",
    descricao: "Ambientes seguro e localização proximo a ponto de onibus",
    preco: "950",
    area: 180,
    quartos: 4,
    endereco: "Rua Amarante, Centro 220",
  },
  {
    id: 5,
    imagem: "/assets/property5.jpg",
    titulo: "Casa forrada ",
    descricao: "localização proximo a farmacia globo",
    preco: "900",
    area: 95,
    quartos: 2,
    endereco: "Rua Defalla atem, Centro 117",
  },
  {
    id: 6,
    imagem: "/assets/property_6.jpg",
    titulo: "Kitnet ",
    descricao: "Ambientes seguro e localização proximo supermercado Jorge",
    preco: "600",
    area: 70,
    quartos: 1,
    endereco: "Rua Mauro neiva, 120",
  },
  {
    id: 7,
    imagem: "/assets/property_7.jpg",
    titulo: "Casa Forrada e murada ",
    descricao: "localização proximo supermercado Jorge",
    preco: "2000",
    area: 160,
    quartos: 6,
    endereco: "Rua Elisa Santana, 120",
  },

];
export function ResultadosPesquisa() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <BarraFiltros />
        <p className="text-sm text-muted-foreground">{imoveis.length} imóveis encontrados</p>

      </div>

      <div className="grid gap-8 min-[1080px]:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden flex-col gap-4 self-start min-[1080px]:flex min-[1080px]:sticky min-[1080px]:top-6">
          <FiltroLateral />
          <FiltroPreco />
        </aside>

        <section className="min-w-0 space-y-5">
          <div className="grid gap-5 min-[1080px]:grid-cols-2 min-[1200px]:grid-cols-3">
            {imoveis.map((imovel) => (
              <CardImovel
                key={imovel.id}
                {...imovel}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}