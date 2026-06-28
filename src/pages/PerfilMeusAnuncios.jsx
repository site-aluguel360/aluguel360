import { PerfilHeader } from "../components/PerfilHeader";
import { PerfilSidebar } from "../components/PerfilSidebar";
import { PerfilCard } from "../components/PerfilCard";
import { Eye, MessageCircle, Heart, Edit, Trash2 } from "lucide-react";

const usuarioMock = {
  nome: "Fulano de Tal",
  email: "fulanodetal@gmail.com",
  iniciais: "FT",
  dataCadastro: "01/02/2023",
};

const anunciosMock = [
  {
    id: 1,
    titulo: "Casa Moderna no Centro",
    endereco: "Rua Elisa Oka, 123",
    preco: "2.300",
    status: "ativo",
    visualizacoes: 45,
    mensagens: 3,
    favoritos: 8,
  },
  {
    id: 2,
    titulo: "Apartamento Aconchegante",
    endereco: "Avenida Getúlio Vargas, 456",
    preco: "1.800",
    status: "ativo",
    visualizacoes: 32,
    mensagens: 1,
    favoritos: 5,
  },
];

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
            <div className="space-y-4">
              {anunciosMock.map((anuncio) => (
                <div
                  key={anuncio.id}
                  className="rounded-lg border border-[#D8E1E7] p-4"
                >
                  {/* Header */}
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h4 className="font-['Poppins'] text-[14px] font-semibold text-[#2D2D2D]/90">
                        {anuncio.titulo}
                      </h4>
                      <p className="font-['Inter'] text-[12px] text-[#2D2D2D]/60">
                        {anuncio.endereco}
                      </p>
                    </div>
                    <span className="inline-block rounded-full bg-[#4ECDC4]/20 px-3 py-1 font-['Inter'] text-[10px] font-semibold text-[#2C7E7B]">
                      {anuncio.status === "ativo" ? "Ativo" : "Inativo"}
                    </span>
                  </div>

                  {/* Preço */}
                  <div className="mb-3 border-t border-[#D8E1E7] pt-3">
                    <p className="font-['Poppins'] text-[16px] font-semibold text-[#2D2D2D]/90">
                      R$ {anuncio.preco}/mês
                    </p>
                  </div>

                  {/* Estatísticas */}
                  <div className="mb-4 grid gap-2 sm:grid-cols-3">
                    <div className="flex items-center gap-2 rounded-lg bg-[#F0F4F8] p-2">
                      <Eye className="h-4 w-4 text-[#2C7E7B]" />
                      <span className="font-['Inter'] text-[12px] text-[#2D2D2D]/80">
                        {anuncio.visualizacoes} visualizações
                      </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-[#F0F4F8] p-2">
                      <MessageCircle className="h-4 w-4 text-[#2C7E7B]" />
                      <span className="font-['Inter'] text-[12px] text-[#2D2D2D]/80">
                        {anuncio.mensagens} mensagens
                      </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-[#F0F4F8] p-2">
                      <Heart className="h-4 w-4 text-[#2C7E7B]" />
                      <span className="font-['Inter'] text-[12px] text-[#2D2D2D]/80">
                        {anuncio.favoritos} favoritos
                      </span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 font-['Inter'] text-[12px] font-semibold text-[#1A535C] hover:underline">
                      <Edit className="h-4 w-4" /> Editar
                    </button>
                    <button className="flex items-center gap-2 font-['Inter'] text-[12px] font-semibold text-[#FF6B6B] hover:underline">
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
              <button className="rounded-full bg-[#4ECDC4] px-4 py-2 font-['Inter'] text-[12px] font-semibold text-white">
                Todos
              </button>
              <button className="rounded-full border border-[#D8E1E7] px-4 py-2 font-['Inter'] text-[12px] font-semibold text-[#2D2D2D]/80 hover:bg-[#F0F4F8]">
                Ativos
              </button>
              <button className="rounded-full border border-[#D8E1E7] px-4 py-2 font-['Inter'] text-[12px] font-semibold text-[#2D2D2D]/80 hover:bg-[#F0F4F8]">
                Inativos
              </button>
              <button className="rounded-full border border-[#D8E1E7] px-4 py-2 font-['Inter'] text-[12px] font-semibold text-[#2D2D2D]/80 hover:bg-[#F0F4F8]">
                Alugados
              </button>
            </div>
          </PerfilCard>
        </section>
      </div>
    </div>
  );
}
