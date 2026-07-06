// Step 5 — Valores, taxas e garantia.

import { Shell, TitleBlock, StepLabel, TextField, TipCard } from "./shared";
import { guaranteeOptions } from "./constants";

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 pb-1 font-['Inter'] text-[13.5px] text-foreground cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-secondary accent-secondary"
      />
      {label}
    </label>
  );
}

export default function Step5Valores({ form, setForm }) {
  const set = (key) => (e) => setForm((c) => ({ ...c, [key]: e.target.value }));
  const toggle = (key) => (e) => setForm((c) => ({ ...c, [key]: e.target.checked }));

  const isSale = form.listingType === "vender";

  return (
    <Shell className="p-6">
      <TitleBlock
        title="Valores"
        subtitle={isSale ? "Defina o preço e taxas do imóvel." : "Defina o valor do aluguel e taxas."}
      />

      <div className="space-y-5">
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <TextField
            label={isSale ? "Valor de venda" : "Valor do aluguel (mensal)"}
            required
            placeholder="Ex: R$ 1.500"
            value={form.rent}
            onChange={set("rent")}
          />
          <Toggle label="Preço negociável" checked={form.negotiable} onChange={toggle("negotiable")} />
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <TextField
            label="Condomínio"
            placeholder="R$ 0,00"
            value={form.condoFee}
            onChange={set("condoFee")}
          />
          <Toggle label="Já incluso no aluguel" checked={form.condoIncluded} onChange={toggle("condoIncluded")} />
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <TextField
            label="IPTU"
            placeholder="R$ 0,00"
            value={form.iptuFee}
            onChange={set("iptuFee")}
          />
          <Toggle label="Já incluso no aluguel" checked={form.iptuIncluded} onChange={toggle("iptuIncluded")} />
        </div>

        <TextField
          label="Outras taxas (se houver)"
          placeholder="Ex: Água, luz, manutenção"
          value={form.otherFees}
          onChange={set("otherFees")}
        />

        {!isSale && (
          <div>
            <StepLabel>Tipo de garantia aceita</StepLabel>
            <div className="mt-2 rounded-[10px] border border-[#c9c9c9] px-4 py-3">
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {guaranteeOptions.map((opt) => {
                  const active = form.guarantee === opt;
                  return (
                    <label
                      key={opt}
                      className="flex items-center gap-2 font-['Inter'] text-[14px] text-foreground cursor-pointer"
                    >
                      <input
                        type="radio"
                        checked={active}
                        onChange={() => setForm((c) => ({ ...c, guarantee: opt }))}
                        className="h-4 w-4 accent-secondary"
                      />
                      {opt}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <TipCard title="Preço competitivo">
          <p>
            Pesquise imóveis similares na sua região. Preços alinhados ao mercado
            recebem muito mais contatos qualificados.
          </p>
        </TipCard>
      </div>
    </Shell>
  );
}
