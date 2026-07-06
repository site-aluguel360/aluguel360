// Step 3 — Características (área, cômodos, features).

import { useState } from "react";
import { CirclePlus, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Shell,
  TitleBlock,
  StepLabel,
  CountField,
  FeatureToggle,
  TipCard,
} from "./shared";
import { DEFAULT_ROOM_IDS, featureOptions } from "./constants";

export default function Step3Caracteristicas({ form, setForm }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newRoomLabel, setNewRoomLabel] = useState("");

  const updateRoomValue = (roomId, delta) => {
    setForm((c) => ({
      ...c,
      rooms: c.rooms.map((r) =>
        r.id === roomId ? { ...r, value: Math.max(0, r.value + delta) } : r,
      ),
    }));
  };

  const handleDeleteRoom = (roomId) => {
    setForm((c) => ({ ...c, rooms: c.rooms.filter((r) => r.id !== roomId) }));
  };

  const handleAddRoom = () => {
    const trimmed = newRoomLabel.trim();
    if (!trimmed) return;
    if (form.rooms.some((r) => r.label.toLowerCase() === trimmed.toLowerCase())) {
      alert("Este cômodo já existe.");
      return;
    }
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `room_${Math.random().toString(36).slice(2, 9)}`;
    setForm((c) => ({
      ...c,
      rooms: [...c.rooms, { id, label: trimmed, value: 0 }],
    }));
    setNewRoomLabel("");
    setIsAdding(false);
  };

  return (
    <Shell className="p-6">
      <TitleBlock
        title="Características"
        subtitle="Detalhe o tamanho, cômodos e comodidades do imóvel."
      />

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <StepLabel>Área total (m²)</StepLabel>
          <Input
            value={form.area}
            onChange={(e) => setForm((c) => ({ ...c, area: e.target.value }))}
            className="h-9 w-24 rounded-[8px] border-[#c9c9c9] px-3 text-center font-['Inter'] text-[14px] text-foreground focus-visible:ring-1 focus-visible:ring-secondary"
          />
        </div>

        <div>
          <StepLabel>Informe a quantidade de cada cômodo</StepLabel>
          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {form.rooms.map((room) => {
              const isCustom = !DEFAULT_ROOM_IDS.includes(room.id);
              return (
                <div
                  key={room.id}
                  className="relative group flex w-full min-w-0 flex-col items-center"
                >
                  <CountField
                    label={room.label}
                    value={room.value}
                    onDecrease={() => updateRoomValue(room.id, -1)}
                    onIncrease={() => updateRoomValue(room.id, 1)}
                  />
                  {isCustom && (
                    <button
                      type="button"
                      onClick={() => handleDeleteRoom(room.id)}
                      className="absolute -top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full border border-[#ededed] bg-white text-destructive opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-red-50 z-10"
                      title="Excluir cômodo"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {isAdding ? (
            <div className="mt-4 flex max-w-md flex-col gap-2 sm:flex-row">
              <Input
                type="text"
                placeholder="Ex: Escritório, Copa"
                value={newRoomLabel}
                onChange={(e) => setNewRoomLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddRoom();
                  } else if (e.key === "Escape") {
                    setIsAdding(false);
                    setNewRoomLabel("");
                  }
                }}
                autoFocus
                className="h-10 rounded-[8px] border border-[#c9c9c9] px-3 font-['Inter'] text-[14px] focus-visible:border-secondary focus-visible:ring-secondary"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleAddRoom}
                  className="h-10 rounded-[8px] bg-secondary px-4 font-['Poppins'] text-[14px] font-semibold text-white hover:bg-primary"
                >
                  Confirmar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsAdding(false);
                    setNewRoomLabel("");
                  }}
                  className="h-10 rounded-[8px] border border-[#c9c9c9] bg-white px-3 font-['Inter'] text-[14px] text-foreground hover:bg-muted"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsAdding(true)}
              className="mt-4 h-10 rounded-[8px] border border-dashed border-secondary bg-white px-4 font-['Inter'] text-[13px] text-secondary hover:bg-[#f2f9f8]"
            >
              <CirclePlus className="mr-1.5 h-4 w-4" />
              Adicionar cômodo
            </Button>
          )}
        </div>

        <div>
          <StepLabel>Informações extras</StepLabel>
          <div className="mt-3 grid grid-cols-1 gap-y-2.5 gap-x-4 sm:grid-cols-2 lg:grid-cols-3">
            {featureOptions.map((opt) => (
              <FeatureToggle
                key={opt.key}
                label={opt.label}
                checked={form.features[opt.key]}
                onChange={() =>
                  setForm((c) => ({
                    ...c,
                    features: { ...c.features, [opt.key]: !c.features[opt.key] },
                  }))
                }
              />
            ))}
          </div>
        </div>

        <TipCard title="Mais detalhes, mais interessados">
          <p>
            Preenchendo os cômodos com precisão, seu anúncio aparece nos filtros
            certos. Prepare ao menos uma foto por cômodo marcado.
          </p>
        </TipCard>
      </div>
    </Shell>
  );
}
