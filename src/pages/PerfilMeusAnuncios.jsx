import { PerfilHeader } from "../components/PerfilHeader";
import { PerfilSidebar } from "../components/PerfilSidebar";
import { PerfilCard } from "../components/PerfilCard";
import { Eye, MessageCircle, Heart, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";


import perfilMock from "../lib/mock/perfil.json";
import anunciosMockData from "../lib/mock/anuncios.json";

const usuarioMock = perfilMock;
const anunciosMock = anunciosMockData;

export function PerfilMeusAnuncios() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6">
      <PerfilHeader usuario={usuarioMock} />

      <div className="grid gap-8 min-[1080px]:grid-cols-[280px_minmax(0,1fr)]">
        <PerfilSidebar />

        <section className="min-w-0 space-y-5">
          <PerfilCard
            titulo="Meus Anúncios"
            descricao="Gerencie todos os seus anúncios"
          >

            <div className="cursor-pointer mb-4 flex items-center gap-2 rounded-lg bg-accent p-2 border border-[#D8E1E7]">
              <MessageCircle className="h-4 w-4 text-secondary" />
              <Link to={"/visualizacao-contatos"} className="font-['Inter'] text-[12px] text-foreground/80 hover:text-secondary hover:underline">
                Ver Mensagens recebidas nos Anúncios
              </Link>
            </div>


            <div className="space-y-4">
              {anunciosMock.map((anuncio) => (
                <div
                  key={anuncio.id}
                  className="rounded-lg border border-[#D8E1E7] p-4"
                >
                  {/* Header */}
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h4 className="font-['Poppins'] text-[14px] font-semibold text-foreground/90">
                        {anuncio.titulo}
                      </h4>
                      <p className="font-['Inter'] text-[12px] text-foreground/60">
                        {anuncio.endereco}
                      </p>
                    </div>
                    <span className="inline-block rounded-full bg-teal-light/20 px-3 py-1 font-['Inter'] text-[10px] font-semibold text-secondary">
                      {anuncio.status === "ativo" ? "Ativo" : "Inativo"}
                    </span>
                  </div>

                  {/* Preço */}
                  <div className="mb-3 border-t border-[#D8E1E7] pt-3">
                    <p className="font-['Poppins'] text-[16px] font-semibold text-foreground/90">
                      R$ {anuncio.preco}/mês
                    </p>
                  </div>

                  {/* Estatísticas */}
                  <div className="mb-4 grid gap-2 sm:grid-cols-3">
                    <div className="flex items-center gap-2 rounded-lg bg-accent p-2">
                      <Eye className="h-4 w-4 text-secondary" />
                      <span className="font-['Inter'] text-[12px] text-foreground/80">
                        {anuncio.visualizacoes} visualizações
                      </span>
                    </div>
                    <Link to={"/visualizacao-contatos"}>
                      <div className="flex items-center gap-2 rounded-lg bg-accent p-2">
                        <MessageCircle className="h-4 w-4 text-secondary" />
                        <span className="font-['Inter'] text-[12px] text-foreground/80">
                          {anuncio.mensagens} mensagens
                        </span>
                      </div>
                    </Link>
                    <div className="flex items-center gap-2 rounded-lg bg-accent p-2">
                      <Heart className="h-4 w-4 text-secondary" />
                      <span className="font-['Inter'] text-[12px] text-foreground/80">
                        {anuncio.favoritos} favoritos
                      </span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 font-['Inter'] text-[12px] font-semibold text-primary hover:underline">
                      <Edit className="h-4 w-4" /> Editar
                    </button>
                    <button className="flex items-center gap-2 font-['Inter'] text-[12px] font-semibold text-destructive hover:underline">
                      <Trash2 className="h-4 w-4" /> Deletar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </PerfilCard>

          <PerfilCard
            titulo="Filtros de Anúncios"
            descricao="Filtre anúncios por status"
          >
            <div className="flex flex-wrap gap-2">
              <button className="rounded-full bg-teal-light px-4 py-2 font-['Inter'] text-[12px] font-semibold text-white">
                Todos
              </button>
              <button className="rounded-full border border-[#D8E1E7] px-4 py-2 font-['Inter'] text-[12px] font-semibold text-foreground/80 hover:bg-accent">
                Ativos
              </button>
              <button className="rounded-full border border-[#D8E1E7] px-4 py-2 font-['Inter'] text-[12px] font-semibold text-foreground/80 hover:bg-accent">
                Inativos
              </button>
              <button className="rounded-full border border-[#D8E1E7] px-4 py-2 font-['Inter'] text-[12px] font-semibold text-foreground/80 hover:bg-accent">
                Alugados
              </button>
            </div>
          </PerfilCard>
        </section>
      </div>
    </div>
  );
}
