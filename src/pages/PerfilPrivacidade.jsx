import { PerfilHeader } from "../components/PerfilHeader";
import { PerfilSidebar } from "../components/PerfilSidebar";
import { PerfilCard } from "../components/PerfilCard";

const usuarioMock = {
  nome: "Fulano de Tal",
  email: "fulanodetal@gmail.com",
  iniciais: "FT",
  dataCadastro: "01/02/2023",
};

export function PerfilPrivacidade() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6">
      <PerfilHeader usuario={usuarioMock} />

      <div className="grid gap-8 min-[1080px]:grid-cols-[280px_minmax(0,1fr)]">
        <PerfilSidebar />

        <section className="min-w-0 space-y-5">
          <PerfilCard
            titulo="Preferências de Privacidade"
            descricao="Controle o uso dos seus dados pessoais"
          >
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F0F4F8] cursor-pointer transition">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-[#1A535C] text-[#1A535C] focus:ring-[#1A535C]"
                />
                <span className="font-['Inter'] text-[14px] text-[#2D2D2D]/90">
                  Dados de localização essenciais para gestão
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F0F4F8] cursor-pointer transition">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#1A535C] text-[#1A535C] focus:ring-[#1A535C]"
                />
                <span className="font-['Inter'] text-[14px] text-[#2D2D2D]/90">
                  Alertas de Segurança
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F0F4F8] cursor-pointer transition">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-[#1A535C] text-[#1A535C] focus:ring-[#1A535C]"
                />
                <span className="font-['Inter'] text-[14px] text-[#2D2D2D]/90">
                  Permissão de localização: Ativada
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F0F4F8] cursor-pointer transition">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#1A535C] text-[#1A535C] focus:ring-[#1A535C]"
                />
                <span className="font-['Inter'] text-[14px] text-[#2D2D2D]/90">
                  Receber newsletter com dicas e promoções
                </span>
              </label>
            </div>
          </PerfilCard>

          <PerfilCard
            titulo="Dados de Localização"
            descricao="Gerencie como seus dados de localização são usados"
          >
            <div className="space-y-4">
              <div className="rounded-lg bg-[#F0F4F8] p-4">
                <p className="font-['Inter'] text-[14px] text-[#2D2D2D]/80 mb-4">
                  Seus dados de localização ajudam a fornecer anúncios mais relevantes e melhorar a experiência. Você pode controlar isso a qualquer momento.
                </p>
                <button className="w-full rounded-[9px] border border-[#1A535C] px-4 py-3 font-['Inter'] text-[14px] font-semibold text-[#1A535C] hover:bg-[#F0F4F8] transition">
                  Ajustar Permissões
                </button>
              </div>
            </div>
          </PerfilCard>

          <PerfilCard
            titulo="Comunicações"
            descricao="Escolha que tipos de comunicação você deseja receber"
          >
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F0F4F8] cursor-pointer transition">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-[#1A535C] text-[#1A535C] focus:ring-[#1A535C]"
                />
                <span className="font-['Inter'] text-[14px] text-[#2D2D2D]/90">
                  Notificações de anúncios relevantes
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F0F4F8] cursor-pointer transition">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#1A535C] text-[#1A535C] focus:ring-[#1A535C]"
                />
                <span className="font-['Inter'] text-[14px] text-[#2D2D2D]/90">
                  Notificações de mensagens
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F0F4F8] cursor-pointer transition">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#1A535C] text-[#1A535C] focus:ring-[#1A535C]"
                />
                <span className="font-['Inter'] text-[14px] text-[#2D2D2D]/90">
                  Emails de marketing
                </span>
              </label>
            </div>
          </PerfilCard>

          <PerfilCard
            titulo="Exclusão de Dados"
            descricao="Solicite a exclusão dos seus dados"
          >
            <div className="space-y-4">
              <div className="rounded-lg bg-[#FFF5F5] border border-[#FFE8E8] p-4">
                <p className="font-['Inter'] text-[14px] text-[#2D2D2D]/80">
                  Se desejar remover sua conta e todos os seus dados, você pode solicitar a exclusão permanente. Esta ação é irreversível.
                </p>
              </div>

              <button className="w-full rounded-[9px] bg-[#FF6B6B] px-4 py-3 font-['Inter'] text-[14px] font-semibold text-white hover:bg-[#ef5555] transition">
                Solicitar Exclusão de Dados
              </button>
            </div>
          </PerfilCard>
        </section>
      </div>
    </div>
  );
}
