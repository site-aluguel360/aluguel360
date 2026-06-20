import { BarraFiltros } from "../components/BarraFiltros";
import { FiltroLateral } from "../components/FiltroLateral";
import {FiltroPreco} from "../components/FiltroPreco";
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
    <div className="p-5">

      <BarraFiltros />

      <div className="flex gap-6 mt-6">

        <div className="flex flex-col gap-4">
          <FiltroLateral />
          <FiltroPreco />
          
        </div>

        <div className="grid flex-1 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {imoveis.map((imovel) => (
            <CardImovel
              key={imovel.id}
              {...imovel}
            />
          ))}
        </div>

      </div>

    </div>
  );
}