import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Heart, Star, SquareDashedBottomCode, BedDouble, MapPin, SlidersHorizontal, Image as ImageIcon, User, ListOrdered, BadgeCheck, Clock, PhoneCall, Pointer, Share2, LogIn } from "lucide-react";

export function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="relative h-[500px] flex items-center justify-center text-center text-white pb-16">
        <div
          className="absolute inset-0 bg-black/40 z-0 bg-blend-overlay"
          style={{
            backgroundImage: "url('/assets/hero_bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "rgba(23, 72, 82, 0.7)"
          }}
        />
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Encontre seu lugar ideal<br />sem complicações!
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl">
            Busque, compare e encontre o lugar perfeito para você.
          </p>

          <Button size="lg" className="bg-secondary hover:bg-secondary-hover text-white text-lg px-8">
            <Link to="/resultados">
              Explorar Imóveis
            </Link>
          </Button>

        </div>
      </section>

      {/* MAIN WRAPPER CONTAINER */}
      <div className="max-w-7xl mx-auto w-full px-6 -mt-16 relative z-20 mb-16">
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100">

          {/* FILTERS */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {["Casas", "Apartamentos", "Kitnets", "Mobiliado"].map(filter => (
              <Button key={filter} variant="outline" className="rounded-full px-6 text-foreground font-medium hover:text-secondary hover:border-secondary">
                {filter}
              </Button>
            ))}
            <Button variant="outline" className="rounded-full px-6 text-foreground font-medium hover:text-secondary hover:border-secondary gap-2">
              Mais Opções <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {/* PROPERTIES */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">Imóveis mais acessados no momento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Property 1 */}
              <Card className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 duration-300 border-border group relative">
                <div className="relative h-52 overflow-hidden">
                  <img src="/assets/property_1.png" alt="Property 1" className="w-full h-full object-cover" />
                  <Button size="icon" variant="secondary" className="absolute top-4 right-4 rounded-full bg-white/80 hover:bg-white text-muted-foreground hover:text-red-500 w-9 h-9">
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg line-clamp-2 h-14 mb-2 text-foreground">Apartamento com Vista Panorâmica - Alto do Horizonte</h3>
                  <div className="flex text-amber-400 mb-2 gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <div className="text-2xl font-bold mb-4">R$ 3.600</div>
                  <div className="flex gap-4 text-muted-foreground text-sm border-b pb-4 mb-4">
                    <span className="flex items-center gap-1.5"><SquareDashedBottomCode className="w-4 h-4" /> 80m²</span>
                    <span className="flex items-center gap-1.5"><BedDouble className="w-4 h-4" /> 4 quartos</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground line-clamp-2">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>Rua Pássaros, 350 - Condomínio Vista Alta - Agronômica</span>
                  </div>
                </CardContent>
              </Card>

              {/* Property 2 */}
              <Card className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 duration-300 border-border group relative">
                <div className="relative h-52 overflow-hidden">
                  <img src="/assets/property_2.png" alt="Property 2" className="w-full h-full object-cover" />
                  <Button size="icon" variant="secondary" className="absolute top-4 right-4 rounded-full bg-white/80 hover:bg-white text-muted-foreground hover:text-red-500 w-9 h-9">
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg line-clamp-2 h-14 mb-2 text-foreground">Casa Rústica - Serra das Palmeiras</h3>
                  <div className="flex text-amber-400 mb-2 gap-0.5">
                    {[...Array(4)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    <Star className="w-4 h-4 text-gray-300" />
                  </div>
                  <div className="text-2xl font-bold mb-4">R$ 2.050</div>
                  <div className="flex gap-4 text-muted-foreground text-sm border-b pb-4 mb-4">
                    <span className="flex items-center gap-1.5"><SquareDashedBottomCode className="w-4 h-4" /> 65m²</span>
                    <span className="flex items-center gap-1.5"><BedDouble className="w-4 h-4" /> 2 quartos</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground line-clamp-2">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>Estrada das Palmeiras, km 4 - Lote 15</span>
                  </div>
                </CardContent>
              </Card>

              {/* Property 3 */}
              <Card className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 duration-300 border-border group relative">
                <div className="relative h-52 overflow-hidden">
                  <img src="/assets/property_3.png" alt="Property 3" className="w-full h-full object-cover" />
                  <Button size="icon" variant="secondary" className="absolute top-4 right-4 rounded-full bg-white/80 hover:bg-white text-muted-foreground hover:text-red-500 w-9 h-9">
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg line-clamp-2 h-14 mb-2 text-foreground">Casa Térrea Aconchegante - Bairro Jardim das Flores</h3>
                  <div className="flex text-amber-400 mb-2 gap-0.5">
                    {[...Array(4)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    <Star className="w-4 h-4 text-gray-300" />
                  </div>
                  <div className="text-2xl font-bold mb-4">R$ 2.300</div>
                  <div className="flex gap-4 text-muted-foreground text-sm border-b pb-4 mb-4">
                    <span className="flex items-center gap-1.5"><SquareDashedBottomCode className="w-4 h-4" /> 110m²</span>
                    <span className="flex items-center gap-1.5"><BedDouble className="w-4 h-4" /> 3 quartos</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground line-clamp-2">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>Rua do Encanto, 128 - Jardim das Flores</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* BANNER SPLIT 1 */}
          <section className="flex flex-col md:flex-row rounded-3xl overflow-hidden mb-16 bg-primary text-white">
            <div className="md:w-1/2 min-h-[300px]">
              <img src="/assets/banner_plant.png" alt="Interior decor" className="w-full h-full object-cover" />
            </div>
            <div className="md:w-1/2 p-10 lg:p-14 flex flex-col justify-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-3 leading-tight">
                Acesso <u className="decoration-secondary decoration-4 underline-offset-4">simples</u> e <u className="decoration-secondary decoration-4 underline-offset-4">rápido</u>, do jeito que você merece!
              </h2>
              <p className="text-xl opacity-90 mb-6">Transparência e agilidade do início ao fim.</p>
              <p className="opacity-80 mb-8 leading-relaxed max-w-lg">
                Em poucos cliques você descobre imóveis, compara preços, e realiza seu primeiro contato.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/login">
                  <Button variant="outline" className="border-white/40 bg-transparent hover:bg-white/10 text-white gap-2">
                    <LogIn className="w-4 h-4" /> Acessar minha conta
                  </Button>
                </Link>
                <Link to="/about">
                  <Button className="bg-secondary hover:bg-secondary-hover text-white">
                    Ver mais sobre nós
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* FEATURES STEPS */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 text-center">
            <div className="p-8 border rounded-2xl hover:border-secondary transition-colors hover:-translate-y-1 duration-300">
              <h4 className="font-semibold text-lg mb-2">Pesquise no catálogo</h4>
              <div className="w-20 h-20 mx-auto my-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                <ImageIcon className="w-10 h-10" />
              </div>
              <p className="text-muted-foreground text-sm mb-6 h-10">Aproveite ofertas e contate o proprietário</p>
              <Button size="sm" className="bg-secondary hover:bg-secondary-hover text-white w-full">Mostrar Catálogo</Button>
            </div>
            <div className="p-8 border rounded-2xl hover:border-secondary transition-colors hover:-translate-y-1 duration-300">
              <h4 className="font-semibold text-lg mb-2">Entre na sua conta</h4>
              <div className="w-20 h-20 mx-auto my-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                <User className="w-10 h-10" />
              </div>
              <p className="text-muted-foreground text-sm mb-6 h-10">Aproveite ofertas e contate o proprietário</p>
              <Link to="/login">
                <Button size="sm" className="bg-secondary hover:bg-secondary-hover text-white w-full">Acessar minha conta</Button>
              </Link>
            </div>
            <div className="p-8 border rounded-2xl hover:border-secondary transition-colors hover:-translate-y-1 duration-300">
              <h4 className="font-semibold text-lg mb-2">Nossas Categorias</h4>
              <div className="w-20 h-20 mx-auto my-6 rounded-full bg-teal-50 text-secondary flex items-center justify-center">
                <ListOrdered className="w-10 h-10" />
              </div>
              <p className="text-muted-foreground text-sm mb-6 h-10">Filtre os resultados e encontre o melhor para você</p>
              <Button size="sm" className="bg-secondary hover:bg-secondary-hover text-white w-full">Mostrar Catálogo</Button>
            </div>
            <div className="p-8 border rounded-2xl hover:border-secondary transition-colors hover:-translate-y-1 duration-300">
              <h4 className="font-semibold text-lg mb-2">Mais acessados</h4>
              <div className="w-20 h-20 mx-auto my-6 rounded-full bg-green-50 text-emerald-500 flex items-center justify-center">
                <BadgeCheck className="w-10 h-10" />
              </div>
              <p className="text-muted-foreground text-sm mb-6 h-10">Aproveite ofertas e contate o proprietário</p>
              <Button size="sm" className="bg-secondary hover:bg-secondary-hover text-white w-full">Ver a lista</Button>
            </div>
          </section>

          {/* BANNER SPLIT 2 */}
          <section className="flex flex-col md:flex-row rounded-3xl overflow-hidden mb-16 bg-primary text-white">
            <div className="md:w-1/2 p-10 lg:p-14 flex flex-col justify-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-3 leading-tight">
                Perfeito para Proprietários<br />e Anfitriões
              </h2>
              <p className="text-xl opacity-90 mb-6">Transforme seu imóvel em renda extra</p>
              <p className="opacity-80 mb-8 leading-relaxed max-w-lg">
                Anunciar é simples e rápido. Você controla disponibilidade, preço e regras para quem busca exatamente o que você oferece.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-secondary hover:bg-secondary-hover text-white">
                  Anunciar meu imóvel
                </Button>
                <Link to="/login">
                  <Button variant="outline" className="border-white/40 bg-transparent hover:bg-white/10 text-white gap-2">
                    <LogIn className="w-4 h-4" /> Acessar minha conta
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 min-h-[300px]">
              <img src="/assets/banner_city.png" alt="City view" className="w-full h-full object-cover" />
            </div>
          </section>

          {/* WHY USE */}
          <section className="mb-16">
            <h3 className="text-2xl font-bold mb-8">Por que usar o Aluguel360?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="border rounded-xl p-6 text-center">
                <h5 className="font-semibold flex items-center justify-center gap-2 mb-2"><Clock className="w-5 h-5 text-secondary" /> Economia de Tempo</h5>
                <p className="text-sm text-muted-foreground">Tudo em um só lugar</p>
              </div>
              <div className="border rounded-xl p-6 text-center">
                <h5 className="font-semibold flex items-center justify-center gap-2 mb-2"><PhoneCall className="w-5 h-5 text-secondary" /> Contato mais Rápido</h5>
                <p className="text-sm text-muted-foreground">Clique - visualize - converse</p>
              </div>
              <div className="border rounded-xl p-6 text-center">
                <h5 className="font-semibold flex items-center justify-center gap-2 mb-2"><Pointer className="w-5 h-5 text-secondary" /> Navegação Simplificada</h5>
                <p className="text-sm text-muted-foreground">+ funções em - cliques</p>
              </div>
              <div className="border rounded-xl p-6 text-center">
                <h5 className="font-semibold flex items-center justify-center gap-2 mb-2"><Share2 className="w-5 h-5 text-secondary" /> Catálogo Diversificado</h5>
                <p className="text-sm text-muted-foreground">Seu novo lar te espera aqui</p>
              </div>
            </div>
          </section>

          {/* BOTTOM BANNER CTA */}
          <section className="relative rounded-3xl overflow-hidden p-12 md:p-16 text-center text-white">
            <div
              className="absolute inset-0 bg-primary/90 z-0 bg-blend-overlay"
              style={{
                backgroundImage: "url('/assets/banner_city.png')",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            />
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                Criamos conexões entre proprietários e<br />seus clientes
              </h2>
              <p className="text-xl opacity-90 mb-4">Praticidade para você!</p>
              <p className="opacity-80 mb-8 max-w-2xl">
                Nossa missão é tornar mais fácil e acessível para as pessoas encontrarem um lugar para chamar de lar, mesmo que por alguns dias.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="bg-secondary hover:bg-secondary-hover text-white px-6 py-6 text-base">
                  Anunciar meu imóvel
                </Button>
                <Link to="/resultados">
                  <Button className="bg-primary hover:bg-primary-light text-white px-6 py-6 text-base">
                    Encontrar um imóvel
                  </Button>
                </Link>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
