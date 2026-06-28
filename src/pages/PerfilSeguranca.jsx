import { PerfilHeader } from "../components/PerfilHeader";
import { PerfilSidebar } from "../components/PerfilSidebar";
import { PerfilCard } from "../components/PerfilCard";
import { Check, AlertCircle } from "lucide-react";

const usuarioMock = {
  nome: "Fulano de Tal",
  email: "fulanodetal@gmail.com",
  iniciais: "FT",
  dataCadastro: "01/02/2023",
};

export function PerfilSeguranca() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6">
      <PerfilHeader usuario={usuarioMock} />

      <div className="grid gap-8 min-[1080px]:grid-cols-[280px_minmax(0,1fr)]">
        <PerfilSidebar />

        <section className="min-w-0 space-y-5">
          <PerfilCard
            titulo="Verificação de Conta"
            descricao="Métodos de verificação e autenticação"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-lg border border-[#D8E1E7] p-4">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#4ECDC4]" />
                <div className="flex-1">
                  <h4 className="font-['Poppins'] text-[14px] font-semibold text-[#2D2D2D]/90">
                    Email verificado
                  </h4>
                  <p className="font-['Inter'] text-[12px] text-[#2D2D2D]/60 mt-1">
                    fulanodetal@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-[#FFE8E8] bg-[#FFF5F5] p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#FF6B6B]" />
                <div className="flex-1">
                  <h4 className="font-['Poppins'] text-[14px] font-semibold text-[#2D2D2D]/90">
                    Telefone não verificado
                  </h4>
                  <p className="font-['Inter'] text-[12px] text-[#2D2D2D]/60 mt-1">
                    Adicione um número de telefone para aumentar a segurança
                  </p>
                  <button className="mt-2 font-['Inter'] text-[12px] font-semibold text-[#FF6B6B] hover:underline">
                    Adicionar telefone
                  </button>
                </div>
              </div>
            </div>
          </PerfilCard>

          <PerfilCard
            titulo="Verificação em Dois Fatores"
            descricao="Proteja sua conta com autenticação adicional"
          >
            <div className="space-y-4">
              <div className="rounded-lg bg-[#F0F4F8] p-4">
                <p className="font-['Inter'] text-[14px] text-[#2D2D2D]/80">
                  A verificação em dois fatores adiciona uma camada extra de segurança à sua conta. Você precisará fornecer um código de confirmação além da senha.
                </p>
              </div>

              <button className="w-full rounded-[9px] bg-[#1A535C] px-4 py-3 font-['Inter'] text-[14px] font-semibold text-white hover:bg-[#2F646C] transition">
                Ativar Verificação em Dois Fatores
              </button>
            </div>
          </PerfilCard>

          <PerfilCard
            titulo="Dispositivos Conectados"
            descricao="Gerencie seus dispositivos autenticados"
          >
            <div className="space-y-4">
              <div className="rounded-lg border border-[#D8E1E7] p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-['Poppins'] text-[14px] font-semibold text-[#2D2D2D]/90">
                    Windows PC
                  </p>
                  <span className="inline-block rounded-full bg-[#4ECDC4]/20 px-3 py-1 font-['Inter'] text-[10px] font-semibold text-[#2C7E7B]">
                    Ativo
                  </span>
                </div>
                <p className="font-['Inter'] text-[12px] text-[#2D2D2D]/60">
                  Último acesso: Hoje às 14:30
                </p>
                <button className="mt-3 font-['Inter'] text-[12px] font-semibold text-[#FF6B6B] hover:underline">
                  Desconectar
                </button>
              </div>
            </div>
          </PerfilCard>

          <PerfilCard
            titulo="Histórico de Acessos"
            descricao="Acompanhe o histórico de login da sua conta"
          >
            <div className="space-y-2">
              <div className="rounded-lg border border-[#D8E1E7] p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-['Inter'] text-[14px] font-semibold text-[#2D2D2D]/90">
                    Acesso via Web
                  </p>
                </div>
                <p className="font-['Inter'] text-[12px] text-[#2D2D2D]/60">
                  19 de junho de 2026 às 14:30 - IP: 192.168.1.1
                </p>
              </div>

              <button className="font-['Inter'] text-[14px] font-semibold text-[#1A535C] hover:underline">
                Ver histórico completo
              </button>
            </div>
          </PerfilCard>
        </section>
      </div>
    </div>
  );
}
