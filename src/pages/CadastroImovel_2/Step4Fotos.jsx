// Step 4 — Fotos e vídeo. Slots dinâmicos derivados de rooms + propertyType.

import { useRef, useState } from "react";
import { Camera, Play, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Shell, TitleBlock, StepLabel, TipCard } from "./shared";

function getRequiredPhotoSlots(form) {
  const slots = ["Capa"];
  if (form.propertyType === "Apartamento") {
    slots.push("Fachada do Prédio", "Entrada / Portaria");
  } else if (form.propertyType === "Casa" || form.propertyType === "Kitnet") {
    slots.push("Fachada");
  }

  const singular = {
    quartos: "Quarto",
    salas: "Sala",
    varandas: "Varanda",
    suites: "Suíte",
    banheiros: "Banheiro",
    garagem: "Garagem",
  };

  form.rooms.forEach((room) => {
    if (room.value > 0) {
      const label = singular[room.id] || room.label;
      if (room.value === 1) slots.push(label);
      else for (let i = 1; i <= room.value; i++) slots.push(`${label} ${i}`);
    }
  });

  return slots;
}

export default function Step4Fotos({ form, setForm }) {
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const extraPhotoInputRef = useRef(null);
  const [activeSlot, setActiveSlot] = useState(null);

  const slots = getRequiredPhotoSlots(form);

  const handlePhotoClick = (slotKey) => {
    setActiveSlot(slotKey);
    if (photoInputRef.current) {
      photoInputRef.current.value = "";
      photoInputRef.current.click();
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file && activeSlot !== null) {
      const url = URL.createObjectURL(file);
      setForm((c) => ({ ...c, photos: { ...c.photos, [activeSlot]: url } }));
    }
    setActiveSlot(null);
  };

  const handleRemovePhoto = (slotKey) => {
    setForm((c) => {
      const p = { ...c.photos };
      if (p[slotKey]) URL.revokeObjectURL(p[slotKey]);
      delete p[slotKey];
      return { ...c, photos: p };
    });
  };

  const handleVideoClick = () => {
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
      videoInputRef.current.click();
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setForm((c) => {
        if (c.video) URL.revokeObjectURL(c.video);
        return { ...c, video: url };
      });
    }
  };

  const handleRemoveVideo = () => {
    setForm((c) => {
      if (c.video) URL.revokeObjectURL(c.video);
      return { ...c, video: null };
    });
  };

  const handleExtraPhotos = (e) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map((f) => URL.createObjectURL(f));
    setForm((c) => ({ ...c, extraPhotos: [...(c.extraPhotos || []), ...urls] }));
    if (extraPhotoInputRef.current) extraPhotoInputRef.current.value = "";
  };

  const handleRemoveExtraPhoto = (index) => {
    setForm((c) => {
      const list = [...(c.extraPhotos || [])];
      URL.revokeObjectURL(list[index]);
      list.splice(index, 1);
      return { ...c, extraPhotos: list };
    });
  };

  return (
    <Shell className="p-6">
      <TitleBlock
        title="Fotos e vídeo"
        subtitle="Anúncios com fotos por cômodo recebem até 5x mais visitas."
      />

      <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
      <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoChange} />
      <input ref={extraPhotoInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleExtraPhotos} />

      <div className="space-y-6">
        <div>
          <StepLabel required>Fotos obrigatórias</StepLabel>
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {slots.map((label, i) => {
              const slotKey = `${label}-${i}`;
              const photoUrl = form.photos?.[slotKey];
              return (
                <div key={slotKey} className="flex min-w-0 flex-col items-center">
                  {photoUrl ? (
                    <div className="relative h-[96px] w-full group">
                      <img
                        src={photoUrl}
                        alt={label}
                        className="h-full w-full cursor-pointer rounded-[8px] object-cover"
                        onClick={() => handlePhotoClick(slotKey)}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(slotKey)}
                        className="absolute -top-1.5 -right-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" strokeWidth={3} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handlePhotoClick(slotKey)}
                      className="flex h-[96px] w-full items-center justify-center rounded-[8px] border border-dashed border-[#bcbcbc] bg-[#f8f8f8] text-[#9a9a9a] transition-colors hover:border-secondary hover:bg-[#f2f9f8] hover:text-secondary"
                    >
                      <span className="flex flex-col items-center gap-1 text-[12px]">
                        <Camera className="h-6 w-6" />
                        Adicionar
                      </span>
                    </button>
                  )}
                  <p className="mt-2 min-h-[32px] w-full text-center font-['Inter'] text-[12.5px] leading-tight text-foreground">
                    {label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {form.extraPhotos?.length > 0 && (
          <div>
            <StepLabel>Fotos adicionais</StepLabel>
            <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {form.extraPhotos.map((url, i) => (
                <div key={`extra-${i}`} className="relative h-[96px] w-full group">
                  <img src={url} alt={`Foto extra ${i + 1}`} className="h-full w-full rounded-[8px] object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveExtraPhoto(i)}
                    className="absolute -top-1.5 -right-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-red-600"
                  >
                    <X className="h-3 w-3" strokeWidth={3} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          onClick={() => extraPhotoInputRef.current?.click()}
          className="h-10 rounded-[8px] border-[#c9c9c9] bg-white px-4 font-['Inter'] text-[13px] text-foreground hover:bg-muted"
        >
          + Adicionar mais fotos (opcional)
        </Button>

        <div className="rounded-[10px] border border-[#e2e8f0] p-4">
          <StepLabel required>Vídeo do imóvel</StepLabel>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            {form.video ? (
              <div className="relative w-full shrink-0 group sm:w-[220px]">
                <video src={form.video} controls className="h-[100px] w-full rounded-[8px] bg-[#ededed] object-cover" />
                <button
                  type="button"
                  onClick={handleRemoveVideo}
                  className="absolute -top-1.5 -right-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-red-600"
                >
                  <X className="h-3 w-3" strokeWidth={3} />
                </button>
              </div>
            ) : (
              <div className="flex h-[100px] w-full shrink-0 items-center justify-center rounded-[8px] bg-[#ededed] text-secondary sm:w-[140px]">
                <Play className="h-8 w-8 fill-current" />
              </div>
            )}
            <p className="max-w-full font-['Inter'] text-[13.5px] leading-snug text-foreground sm:max-w-[320px]">
              Envie um vídeo curto de pelo menos <strong>1 minuto</strong> mostrando todo o imóvel.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleVideoClick}
            className="mt-3 h-10 rounded-[8px] border-[#c9c9c9] bg-white px-4 font-['Poppins'] text-[14px] font-semibold text-foreground hover:bg-muted"
          >
            {form.video ? "Trocar vídeo" : "Enviar vídeo"}
          </Button>
        </div>

        <TipCard title="Fotos de qualidade">
          <p>
            Priorize imagens reais, bem iluminadas e horizontais. Anúncios com fotos claras dos
            principais ambientes convertem muito mais visitas.
          </p>
        </TipCard>
      </div>
    </Shell>
  );
}
