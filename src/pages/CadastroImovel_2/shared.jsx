// Componentes visuais compartilhados entre todos os steps do CadastroImovel.
// Inspiração: layout de anunciar do Mercado Livre / Google Ads (3 colunas).
//
// O <PreviewCard /> reutiliza o seu próprio componente <CardImovel />
// (../components/CardImovel). Ajuste o caminho do import se a sua estrutura
// de pastas for diferente.

import { Check, ShieldCheck } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { CardImovel } from "../../components/CardImovel";

/* ------------------------------------------------------------------ */
/* Wrappers                                                           */
/* ------------------------------------------------------------------ */

export function Shell({ children, className = "" }) {
  return (
    <div className={`min-w-0 rounded-[12px] bg-white shadow-card ${className}`}>
      {children}
    </div>
  );
}

export function TitleBlock({ title, subtitle }) {
  return (
    <div className="mb-4">
      <h2 className="font-['Poppins'] text-[22px] font-semibold leading-tight text-primary">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-1 font-['Inter'] text-[14px] leading-snug text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export function StepLabel({ children, required = false }) {
  return (
    <p className="font-['Inter'] text-[13px] font-medium text-foreground">
      {children}
      {required ? <span className="ml-0.5 text-destructive">*</span> : null}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Campos                                                             */
/* ------------------------------------------------------------------ */

export function TextField({ label, hint, required, className = "", ...props }) {
  return (
    <label className={`block min-w-0 ${className}`}>
      {label ? <StepLabel required={required}>{label}</StepLabel> : null}
      <Input
        className="mt-1.5 h-10 w-full min-w-0 rounded-[8px] border border-[#c9c9c9] bg-white px-3 font-['Inter'] text-[14px] text-[#333] shadow-none transition-colors duration-200 placeholder:text-[#999] focus-visible:border-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary"
        {...props}
      />
      {hint ? (
        <p className="mt-1 font-['Inter'] text-[11px] text-muted-foreground">{hint}</p>
      ) : null}
    </label>
  );
}

export function TextAreaField({ label, hint, required, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      {label ? <StepLabel required={required}>{label}</StepLabel> : null}
      <Textarea
        className="mt-1.5 min-h-[80px] w-full rounded-[8px] border border-[#c9c9c9] bg-white px-3 py-2 font-['Inter'] text-[14px] text-[#333] shadow-none transition-colors duration-200 placeholder:text-[#999] focus-visible:border-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary"
        {...props}
      />
      {hint ? (
        <p className="mt-1 font-['Inter'] text-[11px] text-muted-foreground">{hint}</p>
      ) : null}
    </label>
  );
}

export function CountField({ label, value, onDecrease, onIncrease }) {
  return (
    <div className="min-w-0 flex flex-col items-center">
      <p className="h-4 w-full text-center font-['Inter'] text-[13px] font-medium text-secondary">
        {label}
      </p>

      <div className="mt-1.5 flex w-fit overflow-hidden rounded-[6px] border border-[#d9d9d9] bg-white">
        <button
          type="button"
          onClick={onDecrease}
          className="flex h-9 w-9 items-center justify-center text-[#c8c8c8] hover:bg-[#f3f6f6] hover:text-secondary"
        >
          <span className="relative -left-[1px] text-[16px] leading-none">−</span>
        </button>

        <div className="flex h-9 w-10 items-center justify-center border-x border-[#d9d9d9] font-['Inter'] text-[16px] text-secondary">
          {value}
        </div>

        <button
          type="button"
          onClick={onIncrease}
          className="flex h-9 w-9 items-center justify-center text-[#c8c8c8] hover:bg-[#f3f6f6] hover:text-secondary"
        >
          <span className="relative left-[1px] text-[16px] leading-none">+</span>
        </button>
      </div>
    </div>
  );
}

export function RadioOption({ label, checked, onChange }) {
  return (
    <label className="flex min-w-0 items-center gap-3 text-[14px] text-foreground cursor-pointer">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 accent-secondary"
      />
      <span className="min-w-0">{label}</span>
    </label>
  );
}

export function FeatureToggle({ label, checked, onChange }) {
  return (
    <label className="flex min-w-0 items-center gap-2 text-[13px] text-foreground cursor-pointer">
      <span
        className={`h-5 w-5 shrink-0 flex items-center justify-center rounded-[4px] border transition-colors ${checked
          ? "border-secondary bg-secondary text-white"
          : "border-[#c8c8c8] bg-white text-transparent"
          }`}
      >
        <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
      </span>

      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />

      <span className="min-w-0">{label}</span>
    </label>
  );
}

/* Card grande e clicável (Alugar / Vender, Residencial / Comercial) */
export function ChoiceCard({ label, description, checked, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-w-0 rounded-[10px] border-2 px-4 py-4 text-left transition-all ${checked
        ? "border-secondary bg-[#f2f9f8] shadow-sm"
        : "border-[#dcdcdc] bg-white hover:border-secondary/60"
        }`}
    >
      <p
        className={`font-['Poppins'] text-[16px] font-semibold ${checked ? "text-secondary" : "text-foreground"
          }`}
      >
        {label}
      </p>
      {description ? (
        <p className="mt-1 font-['Inter'] text-[13px] text-muted-foreground">
          {description}
        </p>
      ) : null}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* TipCard                                                            */
/* ------------------------------------------------------------------ */

export function TipCard({ title, children }) {
  return (
    <div className="rounded-[10px] bg-white p-4 shadow-card">
      <h3 className="font-['Poppins'] text-[15px] font-semibold leading-tight text-secondary">
        {title}
      </h3>
      <div className="mt-2 space-y-2 font-['Inter'] text-[12.5px] leading-snug text-foreground">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar (stepper vertical, coluna esquerda)                        */
/* ------------------------------------------------------------------ */

export function Sidebar({ steps, activeStep, maxReached, onSelect }) {
  return (
    <aside className="min-w-0 space-y-6">
      <nav aria-label="Etapas do cadastro" className="space-y-1">
        {steps.map((s) => {
          const isActive = s.id === activeStep;
          const isDone = s.id < activeStep;
          const canGo = s.id <= maxReached;

          return (
            <button
              key={s.id}
              type="button"
              disabled={!canGo}
              onClick={() => canGo && onSelect(s.id)}
              className={`w-full min-w-0 flex items-start gap-3 rounded-[8px] px-3 py-3 text-left transition-colors ${isActive
                ? "bg-[#f2f9f8]"
                : canGo
                  ? "hover:bg-muted"
                  : "opacity-60 cursor-not-allowed"
                }`}
            >
              <span
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold transition-colors ${isActive || isDone
                  ? "bg-secondary text-white"
                  : "border border-[#c8c8c8] text-muted-foreground bg-white"
                  }`}
              >
                {isDone ? <Check className="h-4 w-4" strokeWidth={2.5} /> : s.id}
              </span>
              <span className="min-w-0">
                <span
                  className={`block font-['Poppins'] text-[14px] font-semibold ${isActive ? "text-secondary" : "text-foreground"
                    }`}
                >
                  {s.label}
                </span>
                <span className="block font-['Inter'] text-[12px] text-muted-foreground">
                  {s.sub}
                </span>
              </span>
            </button>
          );
        })}
      </nav>

      <TipCard title="Dica">
        <p>
          Você pode salvar e continuar depois. Seu anúncio ficará como rascunho
          até a publicação.
        </p>
      </TipCard>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Preview lateral (coluna direita, sticky)                           */
/* Reaproveita o componente <CardImovel /> do projeto.                */
/* ------------------------------------------------------------------ */

function pickCoverPhoto(photos) {
  if (!photos) return null;
  const capaKey = Object.keys(photos).find((k) => k.startsWith("Capa"));
  if (capaKey) return photos[capaKey];
  const first = Object.values(photos)[0];
  return first || null;
}

// Placeholder inline (SVG data-url) usado quando ainda não há capa carregada.
const PLACEHOLDER_COVER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 260'>
       <rect width='400' height='260' fill='#eef2f4'/>
       <path d='M0 260 L120 120 L180 180 L260 80 L400 240 L400 260 Z' fill='#c5cdd3'/>
       <circle cx='300' cy='60' r='20' fill='#c5cdd3'/>
       <text x='200' y='140' text-anchor='middle' font-family='Inter,Arial' font-size='14' fill='#8a97a0'>
         Adicione fotos do imóvel
       </text>
     </svg>`
  );

export function PreviewCard({ form }) {
  const cover = pickCoverPhoto(form.photos) || PLACEHOLDER_COVER;

  // Rooms no formato que o CardImovel espera: [{ label, value }]
  const rooms = (form.rooms || [])
    .filter((r) => Number(r.value) > 0)
    .map((r) => ({ label: r.label, value: Number(r.value) }));

  const titulo = form.title?.trim() || "Título do seu anúncio";
  const descricao = form.description?.trim() || "";
  // O CardImovel renderiza "R$ {preco}" — passamos só o número/valor limpo.
  const precoRaw = form.rent?.toString().replace(/^R\$\s*/i, "").trim();
  const preco = precoRaw || "0";

  const neighborhood = form.neighborhood?.trim() || "Bairro";
  const street = form.street?.trim() || "Rua";
  const endereco = `${neighborhood}, ${street}`;

  return (
    <div className="min-w-0 space-y-4 lg:sticky lg:top-6">
      <div>
        <h3 className="font-['Poppins'] text-[16px] font-semibold text-foreground">
          Pré-visualização
        </h3>
        <p className="mt-0.5 font-['Inter'] text-[12.5px] text-muted-foreground">
          Veja como seu anúncio aparecerá para os interessados.
        </p>
      </div>

      {/* Wrapper relativo para posicionar o badge "Rascunho" sobre a capa */}
      <div className="relative">
        <CardImovel
          variant="default"
          titulo={titulo}
          descricao={descricao}
          preco={preco}
          area={form.area || ""}
          rooms={rooms}
          endereco={endereco}
          fotoPrincipal={cover}
        />
        <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-white/90 px-2.5 py-0.5 font-['Inter'] text-[11px] font-medium text-muted-foreground shadow-sm">
          Rascunho
        </span>
      </div>

      <div className="rounded-[12px] bg-white p-4 shadow-card">
        <h4 className="font-['Poppins'] text-[14px] font-semibold text-foreground">
          Precisa de ajuda?
        </h4>
        <p className="mt-1 font-['Inter'] text-[12.5px] text-muted-foreground">
          Nossa equipe está pronta para ajudar você a criar o melhor anúncio.
        </p>
        <button
          type="button"
          className="mt-3 w-full rounded-[8px] border border-secondary bg-white px-3 py-2 font-['Poppins'] text-[13px] font-semibold text-secondary transition-colors hover:bg-[#f2f9f8]"
        >
          Falar com especialista
        </button>
      </div>

      <div className="flex items-start gap-2 px-1">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
        <p className="font-['Inter'] text-[12px] text-muted-foreground">
          Seus dados estão seguros. Não compartilhamos suas informações.
        </p>
      </div>
    </div>
  );
}
