// Step 1 — Informações básicas.
// Campos: listingType (alugar/vender), propertyType, title, purpose.

import { Shell, TitleBlock, StepLabel, TextField, ChoiceCard, TipCard } from "./shared";
import { propertyTypes } from "./constants";

export default function Step1BasicInfo({ form, setForm }) {
  const update = (patch) => setForm((c) => ({ ...c, ...patch }));

  return (
    <Shell className="p-6">
      <TitleBlock
        title="Informações básicas"
        subtitle="Vamos começar com os dados principais do seu imóvel."
      />

      <div className="space-y-6">
        {/* <div>
          <StepLabel required>Tipo de anúncio</StepLabel>
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ChoiceCard
              label="Para alugar"
              description="Quero alugar meu imóvel"
              checked={form.listingType === "alugar"}
              onClick={() => update({ listingType: "alugar" })}
            />
            <ChoiceCard
              label="Para vender"
              description="Quero vender meu imóvel"
              checked={form.listingType === "vender"}
              onClick={() => update({ listingType: "vender" })}
            />
          </div>
        </div> */}

        <div>
          <StepLabel required>Tipo de imóvel</StepLabel>
          <select
            value={form.propertyType}
            onChange={(e) => update({ propertyType: e.target.value })}
            className="mt-2 h-10 w-full rounded-[8px] border border-[#c9c9c9] bg-white px-3 font-['Inter'] text-[14px] text-foreground focus-visible:border-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary"
          >
            <option value="" disabled>
              Selecione o tipo de imóvel
            </option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <StepLabel required>Título do anúncio</StepLabel>
            <span className="font-['Inter'] text-[11px] text-muted-foreground">
              {(form.title || "").length}/60
            </span>
          </div>
          <TextField
            maxLength={60}
            placeholder="Ex: Apartamento 2 quartos no Centro"
            value={form.title}
            onChange={(e) => update({ title: e.target.value })}
          />
        </div>

        <div>
          <StepLabel required>Finalidade</StepLabel>
          <div className="mt-2 flex flex-wrap gap-6">
            <label className="flex items-center gap-2 font-['Inter'] text-[14px] text-foreground cursor-pointer">
              <input
                type="radio"
                checked={form.purpose === "residencial"}
                onChange={() => update({ purpose: "residencial" })}
                className="h-4 w-4 accent-secondary"
              />
              Residencial
            </label>
            <label className="flex items-center gap-2 font-['Inter'] text-[14px] text-foreground cursor-pointer">
              <input
                type="radio"
                checked={form.purpose === "comercial"}
                onChange={() => update({ purpose: "comercial" })}
                className="h-4 w-4 accent-secondary"
              />
              Comercial
            </label>
          </div>
        </div>

        <TipCard title="Comece com o essencial">
          <p>
            Um bom título é curto, descritivo e destaca o principal diferencial
            do imóvel — tipo, número de quartos e localização já são um ótimo
            começo.
          </p>
        </TipCard>
      </div>
    </Shell>
  );
}
