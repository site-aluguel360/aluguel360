import { PerfilHeader } from "../components/PerfilHeader";
import { PerfilSidebar } from "../components/PerfilSidebar";
import { PerfilCard } from "../components/PerfilCard";
import { Star, TrendingUp, AlertCircle } from "lucide-react";

import perfilMock from "../lib/mock/perfil.json";

const usuarioMock = perfilMock;

export function PerfilQualidade() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6">
      <PerfilHeader usuario={usuarioMock} />

      <div className="grid gap-8 min-[1080px]:grid-cols-[280px_minmax(0,1fr)]">
        <PerfilSidebar />

        <section className="min-w-0 space-y-5">
          <PerfilCard
            titulo="Qualidade dos Anúncios"
            descricao="Avaliação e métricas de desempenho dos seus anúncios"
          >
            <div className="space-y-6">
              {/* Score Principal */}
              <div className="rounded-lg bg-gradient-to-r from-teal-light to-secondary p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-['Inter'] text-[14px] opacity-90">Nota de Desempenho</p>
                    <p className="font-['Poppins'] text-[48px] font-bold">8.0</p>
                  </div>
                  <Star className="h-16 w-16 opacity-80" fill="currentColor" />
                </div>
              </div>

              {/* Métricas */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-[#D8E1E7] p-4">
                  <p className="font-['Inter'] text-[12px] text-foreground/60 mb-2">
                    Tempo de resposta
                  </p>
                  <p className="font-['Poppins'] text-[24px] font-semibold text-secondary">
                    2h
                  </p>
                  <p className="font-['Inter'] text-[12px] text-foreground/60 mt-2">
                    Excelente
                  </p>
                </div>

                <div className="rounded-lg border border-[#D8E1E7] p-4">
                  <p className="font-['Inter'] text-[12px] text-foreground/60 mb-2">
                    Taxa de conclusão
                  </p>
                  <p className="font-['Poppins'] text-[24px] font-semibold text-secondary">
                    85%
                  </p>
                  <p className="font-['Inter'] text-[12px] text-foreground/60 mt-2">
                    Acima da média
                  </p>
                </div>

                <div className="rounded-lg border border-[#D8E1E7] p-4">
                  <p className="font-['Inter'] text-[12px] text-foreground/60 mb-2">
                    Anúncios ativos
                  </p>
                  <p className="font-['Poppins'] text-[24px] font-semibold text-secondary">
                    3
                  </p>
                  <p className="font-['Inter'] text-[12px] text-foreground/60 mt-2">
                    Bom
                  </p>
                </div>
              </div>
            </div>
          </PerfilCard>

          <PerfilCard
            titulo="Dicas para Melhorar"
            descricao="Recomendações para aumentar a qualidade dos anúncios"
          >
            <div className="space-y-3">
              <div className="flex gap-3 rounded-lg bg-accent p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div className="flex-1">
                  <h4 className="font-['Poppins'] text-[14px] font-semibold text-foreground/90">
                    Adicione mais fotos de alta qualidade
                  </h4>
                  <p className="font-['Inter'] text-[12px] text-foreground/70 mt-1">
                    Anúncios com 5+ fotos têm 3x mais visualizações
                  </p>
                </div>
              </div>

              <div className="flex gap-3 rounded-lg bg-accent p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div className="flex-1">
                  <h4 className="font-['Poppins'] text-[14px] font-semibold text-foreground/90">
                    Complete todas as informações
                  </h4>
                  <p className="font-['Inter'] text-[12px] text-foreground/70 mt-1">
                    Informações completas aumentam a confiança dos usuários
                  </p>
                </div>
              </div>

              <div className="flex gap-3 rounded-lg bg-accent p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div className="flex-1">
                  <h4 className="font-['Poppins'] text-[14px] font-semibold text-foreground/90">
                    Responda rapidamente às mensagens
                  </h4>
                  <p className="font-['Inter'] text-[12px] text-foreground/70 mt-1">
                    Respostas rápidas melhoram sua classificação
                  </p>
                </div>
              </div>
            </div>
          </PerfilCard>

          <PerfilCard
            titulo="Histórico de Desempenho"
            descricao="Acompanhe a evolução dos seus anúncios"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-lg border border-[#D8E1E7] p-4">
                <TrendingUp className="h-5 w-5 text-teal-light" />
                <div className="flex-1">
                  <p className="font-['Poppins'] text-[14px] font-semibold text-foreground/90">
                    Últimos 30 dias
                  </p>
                  <p className="font-['Inter'] text-[12px] text-foreground/60">
                    +15% visualizações comparado ao mês anterior
                  </p>
                </div>
              </div>

              <button className="font-['Inter'] text-[14px] font-semibold text-primary hover:underline">
                Ver análise detalhada
              </button>
            </div>
          </PerfilCard>
        </section>
      </div>
    </div>
  );
}
