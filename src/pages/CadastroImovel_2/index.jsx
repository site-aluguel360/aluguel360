// CadastroImovel — orquestrador.
// Layout inspirado em Google Ads / Mercado Livre (3 colunas):
//   [ Sidebar stepper ] [ Formulário do step ] [ Preview lateral ao vivo ]
//
// Para adicionar/remover um step, edite apenas o array STEPS abaixo
// e crie/apague o arquivo StepN correspondente. Nenhuma outra alteração
// é necessária.

import { useMemo, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, ShieldCheck, Zap, BarChart3, Headphones } from "lucide-react";
import { Button } from "../../components/ui/button";

import { initialForm } from "./constants";
import { Sidebar, PreviewCard } from "./shared";

import Step1BasicInfo from "./Step1BasicInfo";
import Step2Localizacao from "./Step2Localizacao";
import Step3Caracteristicas from "./Step3Caracteristicas";
import Step4Fotos from "./Step4Fotos";
import Step5Valores from "./Step5Valores";
import Step6Descricao from "./Step6Descricao";
import Step7Contato from "./Step7Contato";

const STEPS = [
  { id: 1, label: "Informações básicas", sub: "Dados principais do imóvel", Component: Step1BasicInfo },
  { id: 2, label: "Localização", sub: "Endereço e região", Component: Step2Localizacao },
  { id: 3, label: "Características", sub: "Detalhes do imóvel", Component: Step3Caracteristicas },
  { id: 4, label: "Fotos", sub: "Imagens do imóvel", Component: Step4Fotos },
  { id: 5, label: "Valores", sub: "Preço e taxas", Component: Step5Valores },
  { id: 6, label: "Descrição", sub: "Conte mais sobre o imóvel", Component: Step6Descricao },
  { id: 7, label: "Contato", sub: "Como interessados falarão", Component: Step7Contato },
];

const BENEFITS = [
  { icon: ShieldCheck, title: "100% Gratuito", desc: "Não cobramos para anunciar seu imóvel." },
  { icon: Zap, title: "Publicação rápida", desc: "Seu anúncio no ar em poucos minutos." },
  { icon: BarChart3, title: "Mais visibilidade", desc: "Alcance milhares de interessados." },
  { icon: Headphones, title: "Suporte dedicado", desc: "Estamos aqui para ajudar você." },
];

export function CadastroImovel({ onBackToList, onPublish }) {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(1);
  const [maxReached, setMaxReached] = useState(1);

  const activeIndex = STEPS.findIndex((s) => s.id === step);
  const activeStep = STEPS[activeIndex];
  const StepComponent = activeStep?.Component;

  const goTo = (nextId) => {
    if (nextId < 1 || nextId > STEPS.length) return;
    setStep(nextId);
    setMaxReached((prev) => Math.max(prev, nextId));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isLast = activeIndex === STEPS.length - 1;

  const handlePublish = useMemo(
    () => () => {
      if (typeof onPublish === "function") onPublish(form);
      else alert("Anúncio pronto para publicar!");
    },
    [form, onPublish],
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header simples da página */}
      <div className="mx-auto w-full max-w-[1280px] px-4 pt-8 pb-4 sm:px-6">
        <button
          type="button"
          onClick={onBackToList}
          className="flex items-center gap-1.5 font-['Inter'] text-[13px] text-secondary hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para meus imóveis
        </button>

        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-['Poppins'] text-[28px] font-bold leading-tight text-foreground sm:text-[32px]">
              Anuncie seu imóvel
            </h1>
            <p className="mt-1 font-['Inter'] text-[14px] text-muted-foreground">
              Preencha as informações abaixo para criar seu anúncio. É rápido, fácil e gratuito!
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-[10px] bg-white px-3 py-2 shadow-card">
            <ShieldCheck className="h-5 w-5 text-secondary" />
            <div className="min-w-0">
              <p className="font-['Poppins'] text-[13px] font-semibold text-foreground">
                Seus dados estão seguros
              </p>
              <p className="font-['Inter'] text-[11.5px] text-muted-foreground">
                Não compartilhamos suas informações
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid 3 colunas */}
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-8 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)_320px]">
          <Sidebar
            steps={STEPS}
            activeStep={step}
            maxReached={maxReached}
            onSelect={goTo}
          />

          <div className="min-w-0 space-y-4">
            {StepComponent ? (
              isLast ? (
                <StepComponent form={form} setForm={setForm} onPublish={handlePublish} />
              ) : (
                <StepComponent form={form} setForm={setForm} />
              )
            ) : null}

            {/* Navegação inferior */}
            <div className="flex items-center justify-between px-1">
              <Button
                type="button"
                variant="ghost"
                onClick={() => goTo(step - 1)}
                disabled={activeIndex === 0}
                className="h-10 gap-1 rounded-[8px] px-3 font-['Inter'] text-[14px] text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Voltar
              </Button>

              <p className="font-['Inter'] text-[12.5px] text-muted-foreground">
                Etapa {step} de {STEPS.length}
              </p>

              {isLast ? (
                <Button
                  type="button"
                  onClick={handlePublish}
                  className="h-10 rounded-[8px] bg-secondary px-5 font-['Poppins'] text-[14px] font-semibold text-white hover:bg-primary"
                >
                  Publicar
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => goTo(step + 1)}
                  className="h-10 gap-1 rounded-[8px] bg-secondary px-5 font-['Poppins'] text-[14px] font-semibold text-white hover:bg-primary"
                >
                  Salvar e continuar
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <PreviewCard form={form} />
        </div>
      </div>

      {/* Faixa de benefícios */}
      <div className="border-y border-border bg-[#f2f9f8]">
        <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-6 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <div key={b.title} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-secondary shadow-card">
                <b.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="font-['Poppins'] text-[14px] font-semibold text-foreground">
                  {b.title}
                </p>
                <p className="font-['Inter'] text-[12.5px] text-muted-foreground">
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
