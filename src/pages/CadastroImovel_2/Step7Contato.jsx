// Step 7 — Revisão e publicação.
// Usa apenas campos já presentes no formulário; não adiciona dados novos.

import { Check, MapPin } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Shell, TitleBlock, TipCard } from "./shared";
import { featureOptions } from "./constants";

function Row({ label, value }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3 py-1.5">
      <span className="font-['Inter'] text-[13px] text-muted-foreground">{label}</span>
      <span className="font-['Inter'] text-[13.5px] text-foreground break-words">
        {value || <em className="text-muted-foreground">Não informado</em>}
      </span>
    </div>
  );
}

export default function Step7Contato({ form, onPublish }) {
  const activeFeatures = featureOptions.filter((f) => form.features[f.key]);
  const address = [form.street, form.number, form.neighborhood]
    .filter(Boolean)
    .join(", ");

  return (
    <Shell className="p-6">
      <TitleBlock
        title="Como interessados falarão com você"
        subtitle="Revise as informações antes de publicar. Você poderá editar tudo depois."
      />

      <div className="space-y-6">
        <section>
          <h3 className="font-['Poppins'] text-[14px] font-semibold text-secondary">
            Informações básicas
          </h3>
          <div className="mt-2 divide-y divide-border rounded-[10px] border border-border px-4 py-1">
            <Row label="Tipo de anúncio" value={form.listingType === "vender" ? "Para vender" : "Para alugar"} />
            <Row label="Tipo de imóvel" value={form.propertyType} />
            <Row label="Finalidade" value={form.purpose === "comercial" ? "Comercial" : "Residencial"} />
            <Row label="Título" value={form.title} />
          </div>
        </section>

        <section>
          <h3 className="font-['Poppins'] text-[14px] font-semibold text-secondary">
            Localização
          </h3>
          <div className="mt-2 divide-y divide-border rounded-[10px] border border-border px-4 py-1">
            <Row label="Endereço" value={address} />
            <Row label="CEP" value={form.cep} />
            <Row label="Referência" value={form.reference} />
            <Row label="Destaque" value={form.highlight} />
          </div>
        </section>

        <section>
          <h3 className="font-['Poppins'] text-[14px] font-semibold text-secondary">
            Características
          </h3>
          <div className="mt-2 divide-y divide-border rounded-[10px] border border-border px-4 py-1">
            <Row label="Área total" value={form.area ? `${form.area} m²` : ""} />
            <Row
              label="Cômodos"
              value={form.rooms
                .filter((r) => r.value > 0)
                .map((r) => `${r.value} ${r.label}`)
                .join(" • ")}
            />
            {activeFeatures.length > 0 && (
              <div className="py-2">
                <span className="font-['Inter'] text-[13px] text-muted-foreground">
                  Diferenciais
                </span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {activeFeatures.map((f) => (
                    <span
                      key={f.key}
                      className="flex items-center gap-1 rounded-full bg-[#f2f9f8] px-2.5 py-1 font-['Inter'] text-[12px] text-secondary"
                    >
                      <Check className="h-3 w-3" strokeWidth={3} />
                      {f.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section>
          <h3 className="font-['Poppins'] text-[14px] font-semibold text-secondary">
            Valores
          </h3>
          <div className="mt-2 divide-y divide-border rounded-[10px] border border-border px-4 py-1">
            <Row
              label={form.listingType === "vender" ? "Valor de venda" : "Aluguel"}
              value={form.rent}
            />
            <Row label="Condomínio" value={form.condoFee} />
            <Row label="IPTU" value={form.iptuFee} />
            <Row label="Outras taxas" value={form.otherFees} />
            {form.listingType !== "vender" && <Row label="Garantia" value={form.guarantee} />}
          </div>
        </section>

        <section>
          <h3 className="font-['Poppins'] text-[14px] font-semibold text-secondary">
            Mídia
          </h3>
          <div className="mt-2 divide-y divide-border rounded-[10px] border border-border px-4 py-1">
            <Row
              label="Fotos"
              value={`${Object.keys(form.photos || {}).length} obrigatórias • ${form.extraPhotos?.length || 0} extras`}
            />
            <Row label="Vídeo" value={form.video ? "Enviado" : "Não enviado"} />
          </div>
        </section>

        <TipCard title="Tudo certo?">
          <p>
            Ao publicar, seu anúncio passa por uma revisão rápida e fica visível
            para milhares de interessados na região.
          </p>
        </TipCard>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
          <p className="flex items-center gap-1.5 font-['Inter'] text-[12.5px] text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {address || "Endereço não informado"}
          </p>
          <Button
            type="button"
            onClick={onPublish}
            className="h-11 rounded-[8px] bg-secondary px-6 font-['Poppins'] text-[14px] font-semibold text-white hover:bg-primary"
          >
            Publicar anúncio
          </Button>
        </div>
      </div>
    </Shell>
  );
}
