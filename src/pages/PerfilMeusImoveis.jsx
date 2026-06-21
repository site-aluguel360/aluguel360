import { PerfilHeader } from "../components/PerfilHeader";
import { PerfilSidebar } from "../components/PerfilSidebar";
import { PerfilCard } from "../components/PerfilCard";
import { Home, Edit, Trash2 } from "lucide-react";

const usuarioMock = {
  nome: "Fulano de Tal",
  email: "fulanodetal@gmail.com",
  iniciais: "FT",
  dataCadastro: "01/02/2023",
};

const imoveisMock = [
  {
    id: 1,
    titulo: "Casa Moderna no Centro",
    endereco: "Rua Elisa Oka, 123",
    tipo: "Casa",
    preco: "2.300",
  },
  {
    id: 2,
    titulo: "Apartamento Aconchegante",
    endereco: "Avenida Getúlio Vargas, 456",
    tipo: "Apartamento",
    preco: "1.800",
  },
];

export function PerfilMeusImoveis() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6">
      <PerfilHeader usuario={usuarioMock} />

      <div className="grid gap-8 min-[1080px]:grid-cols-[280px_minmax(0,1fr)]">
        <PerfilSidebar />

        <section className="min-w-0 space-y-5">
          <PerfilCard
            titulo="Meus Imóveis"
            descricao="Gerencie todos os imóveis cadastrados"
          >
            <div className="space-y-4">
              {imoveisMock.map((imovel) => (
                <div
                  key={imovel.id}
                  className="rounded-lg border border-[#D8E1E7] p-4"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Home className="mt-1 h-5 w-5 text-[#2C7E7B] shrink-0" />
                      <div>
                        <h4 className="font-['Poppins'] text-[14px] font-semibold text-[#2D2D2D]/90">
                          {imovel.titulo}
                        </h4>
                        <p className="font-['Inter'] text-[12px] text-[#2D2D2D]/60">
                          {imovel.endereco}
                        </p>
                      </div>
                    </div>
                    <span className="inline-block rounded-full bg-[#4ECDC4]/20 px-3 py-1 font-['Inter'] text-[10px] font-semibold text-[#2C7E7B]">
                      {imovel.tipo}
                    </span>
                  </div>

                  <div className="mb-3 flex items-center justify-between border-t border-[#D8E1E7] pt-3">
                    <p className="font-['Poppins'] text-[16px] font-semibold text-[#2D2D2D]/90">
                      R$ {imovel.preco}
                    </p>
                    <span className="font-['Inter'] text-[12px] text-[#2D2D2D]/60">
                      /mês
                    </span>
                  </div>

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
            titulo="Estatísticas"
            descricao="Informações sobre seus imóveis"
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-[#F0F4F8] p-4 text-center">
                <p className="font-['Poppins'] text-[32px] font-semibold text-[#2C7E7B]">
                  2
                </p>
                <p className="font-['Inter'] text-[12px] text-[#2D2D2D]/60 mt-1">
                  Imóveis Cadastrados
                </p>
              </div>
              <div className="rounded-lg bg-[#F0F4F8] p-4 text-center">
                <p className="font-['Poppins'] text-[32px] font-semibold text-[#2C7E7B]">
                  2
                </p>
                <p className="font-['Inter'] text-[12px] text-[#2D2D2D]/60 mt-1">
                  Anúncios Ativos
                </p>
              </div>
              <div className="rounded-lg bg-[#F0F4F8] p-4 text-center">
                <p className="font-['Poppins'] text-[32px] font-semibold text-[#2C7E7B]">
                  145
                </p>
                <p className="font-['Inter'] text-[12px] text-[#2D2D2D]/60 mt-1">
                  Visualizações
                </p>
              </div>
            </div>
          </PerfilCard>
        </section>
      </div>
    </div>
  );
}
