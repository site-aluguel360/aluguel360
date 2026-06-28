import { PerfilHeader } from "../components/PerfilHeader";
import { PerfilSidebar } from "../components/PerfilSidebar";
import { PerfilCard } from "../components/PerfilCard";
import { Image as ImageIcon, Play, Plus } from "lucide-react";

const usuarioMock = {
  nome: "Fulano de Tal",
  email: "fulanodetal@gmail.com",
  iniciais: "FT",
  dataCadastro: "01/02/2023",
};

const midasMock = [
  { id: 1, tipo: "foto", nome: "Sala principal", tamanho: "2.5 MB" },
  { id: 2, tipo: "foto", nome: "Quarto 1", tamanho: "1.8 MB" },
  { id: 3, tipo: "video", nome: "Tour virtual", tamanho: "45 MB" },
];

export function PerfilMidia() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6">
      <PerfilHeader usuario={usuarioMock} />

      <div className="grid gap-8 min-[1080px]:grid-cols-[280px_minmax(0,1fr)]">
        <PerfilSidebar />

        <section className="min-w-0 space-y-5">
          <PerfilCard
            titulo="Fotos e Mídias"
            descricao="Gerencie as mídias enviadas para seus imóveis"
          >
            <div className="space-y-4">
              {/* Estatísticas */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-[#F0F4F8] p-4 text-center">
                  <p className="font-['Poppins'] text-[32px] font-semibold text-[#2C7E7B]">
                    12
                  </p>
                  <p className="font-['Inter'] text-[12px] text-[#2D2D2D]/60 mt-1">
                    Fotos enviadas
                  </p>
                </div>
                <div className="rounded-lg bg-[#F0F4F8] p-4 text-center">
                  <p className="font-['Poppins'] text-[32px] font-semibold text-[#2C7E7B]">
                    3
                  </p>
                  <p className="font-['Inter'] text-[12px] text-[#2D2D2D]/60 mt-1">
                    Vídeos
                  </p>
                </div>
                <div className="rounded-lg bg-[#F0F4F8] p-4 text-center">
                  <p className="font-['Poppins'] text-[32px] font-semibold text-[#2C7E7B]">
                    156 MB
                  </p>
                  <p className="font-['Inter'] text-[12px] text-[#2D2D2D]/60 mt-1">
                    Armazenado
                  </p>
                </div>
              </div>
            </div>
          </PerfilCard>

          <PerfilCard
            titulo="Mídias Recentes"
            descricao="Lista de arquivos mais recentes"
          >
            <div className="space-y-3">
              {midasMock.map((midia) => (
                <div
                  key={midia.id}
                  className="flex items-center justify-between rounded-lg border border-[#D8E1E7] p-4"
                >
                  <div className="flex items-center gap-3">
                    {midia.tipo === "foto" ? (
                      <ImageIcon className="h-5 w-5 text-[#2C7E7B]" />
                    ) : (
                      <Play className="h-5 w-5 text-[#FF6B6B]" />
                    )}
                    <div>
                      <p className="font-['Inter'] text-[14px] font-semibold text-[#2D2D2D]/90">
                        {midia.nome}
                      </p>
                      <p className="font-['Inter'] text-[12px] text-[#2D2D2D]/60">
                        {midia.tamanho}
                      </p>
                    </div>
                  </div>
                  <button className="font-['Inter'] text-[12px] font-semibold text-[#FF6B6B] hover:underline">
                    Deletar
                  </button>
                </div>
              ))}

              <button className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#D8E1E7] py-4 font-['Inter'] text-[14px] font-semibold text-[#1A535C] transition hover:border-[#1A535C] hover:bg-[#F0F4F8]">
                <Plus className="h-4 w-4" /> Adicionar mais mídias
              </button>
            </div>
          </PerfilCard>

          <PerfilCard
            titulo="Limites de Armazenamento"
            descricao="Informações sobre seu uso de armazenamento"
          >
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-['Inter'] text-[14px] font-medium text-[#2D2D2D]/80">
                    Uso de armazenamento
                  </span>
                  <span className="font-['Poppins'] text-[14px] font-semibold text-[#2D2D2D]/90">
                    156 MB / 1 GB
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#D8E1E7]">
                  <div
                    className="h-full bg-gradient-to-r from-[#4ECDC4] to-[#2C7E7B]"
                    style={{ width: "15.6%" }}
                  ></div>
                </div>
              </div>

              <p className="font-['Inter'] text-[12px] text-[#2D2D2D]/70">
                Você está usando 15.6% do seu armazenamento. Você pode fazer upload de até 843 MB de conteúdo adicional.
              </p>
            </div>
          </PerfilCard>
        </section>
      </div>
    </div>
  );
}
