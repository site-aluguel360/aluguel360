// Step 6 — Descrição livre.

import { Shell, TitleBlock, TextField, TextAreaField, TipCard } from "./shared";

export default function Step6Descricao({ form, setForm }) {
  const set = (key) => (e) => setForm((c) => ({ ...c, [key]: e.target.value }));

  return (
    <Shell className="p-6">
      <TitleBlock
        title="Descrição"
        subtitle="Conte mais sobre o imóvel — ambientes, diferenciais e vizinhança."
      />

      <div className="space-y-5">
        <div>
          <div className="flex items-center justify-between">
            <span className="font-['Inter'] text-[13px] font-medium text-foreground">
              Título do anúncio
            </span>
            <span className="font-['Inter'] text-[11px] text-muted-foreground">
              {(form.title || "").length}/60
            </span>
          </div>
          <TextField
            maxLength={60}
            placeholder="Ex: Apartamento 2 quartos no Centro"
            value={form.title}
            onChange={set("title")}
          />
        </div>

        <TextAreaField
          label="Descrição do imóvel"
          placeholder="Descreva os ambientes, diferenciais, vizinhança, iluminação, acabamento…"
          value={form.description}
          onChange={set("description")}
          className="[&_textarea]:min-h-[140px]"
        />

        <TextAreaField
          label="Informações extras"
          placeholder="Regras do condomínio, disponibilidade para visitas, observações…"
          value={form.extraInfo}
          onChange={set("extraInfo")}
        />

        <TipCard title="Descrição que converte">
          <p>
            Comece pelo diferencial (vista, reforma recente, localização), depois
            liste ambientes e por fim informações práticas (regras, taxas, visitas).
          </p>
        </TipCard>
      </div>
    </Shell>
  );
}
