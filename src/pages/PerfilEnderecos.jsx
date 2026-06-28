import { PerfilHeader } from "../components/PerfilHeader";
import { PerfilSidebar } from "../components/PerfilSidebar";
import { PerfilCard } from "../components/PerfilCard";
import { ButtonForms } from "../components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";

const usuarioMock = {
  nome: "Fulano de Tal",
  email: "fulanodetal@gmail.com",
  iniciais: "FT",
  dataCadastro: "01/02/2023",
};

const enderecosMock = [
  {
    id: 1,
    tipo: "Principal",
    rua: "Rua Elisa Oka",
    numero: "123",
    complemento: "Apto 45",
    bairro: "Centro",
    cidade: "Floriano",
    cep: "64800-000",
  },
  {
    id: 2,
    tipo: "Secundário",
    rua: "Avenida Getúlio Vargas",
    numero: "456",
    complemento: "",
    bairro: "São João",
    cidade: "Teresina",
    cep: "64000-000",
  },
];

export function PerfilEnderecos() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6">
      <PerfilHeader usuario={usuarioMock} />

      <div className="grid gap-8 min-[1080px]:grid-cols-[280px_minmax(0,1fr)]">
        <PerfilSidebar />

        <section className="min-w-0 space-y-5">
          <PerfilCard
            titulo="Meus Endereços"
            descricao="Gerencie todos os seus endereços cadastrados"
          >
            <div className="space-y-4">
              {enderecosMock.map((endereco) => (
                <div
                  key={endereco.id}
                  className="rounded-lg border border-[#D8E1E7] p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="inline-block rounded-full bg-[#4ECDC4]/20 px-3 py-1 font-['Inter'] text-[12px] font-semibold text-[#2C7E7B]">
                      {endereco.tipo}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="font-['Inter'] text-[14px] font-semibold text-[#2D2D2D]/90">
                      {endereco.rua}, {endereco.numero}
                      {endereco.complemento && ` - ${endereco.complemento}`}
                    </p>
                    <p className="font-['Inter'] text-[14px] text-[#2D2D2D]/70">
                      {endereco.bairro}, {endereco.cidade} - {endereco.cep}
                    </p>
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

              <button className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#D8E1E7] py-4 font-['Inter'] text-[14px] font-semibold text-[#1A535C] transition hover:border-[#1A535C] hover:bg-[#F0F4F8]">
                <Plus className="h-4 w-4" /> Adicionar novo endereço
              </button>
            </div>
          </PerfilCard>
        </section>
      </div>
    </div>
  );
}
