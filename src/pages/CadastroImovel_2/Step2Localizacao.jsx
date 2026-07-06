// Step 2 — Localização (CEP, endereço, mapa Leaflet).

import { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "../../components/ui/button";
import {
  Shell,
  TitleBlock,
  StepLabel,
  TextField,
  TextAreaField,
  TipCard,
} from "./shared";

export default function Step2Localizacao({ form, setForm }) {
  const [position, setPosition] = useState([-5.0892, -42.8016]);
  const [editing, setEditing] = useState(false);
  const set = (key) => (e) => setForm((c) => ({ ...c, [key]: e.target.value }));

  return (
    <Shell className="p-6">
      <TitleBlock
        title="Localização"
        subtitle="Informe o endereço para os interessados encontrarem seu imóvel."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <TextField
            label="CEP"
            required
            placeholder="Digite o CEP"
            hint="Buscaremos automaticamente rua e bairro."
            value={form.cep}
            onChange={set("cep")}
          />
          <TextField
            label="Rua"
            placeholder="Rua ou Avenida"
            value={form.street}
            onChange={set("street")}
          />
          <TextField
            label="Bairro"
            placeholder="Nome do bairro"
            value={form.neighborhood}
            onChange={set("neighborhood")}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField
              label="Ponto de referência"
              placeholder="Digite algo próximo"
              value={form.reference}
              onChange={set("reference")}
            />
            <TextField
              label="Complemento"
              placeholder="Complemento"
              value={form.complement}
              onChange={set("complement")}
            />
          </div>

          <TextField
            label="Número"
            placeholder="0000"
            hint="Se não houver, deixe em branco."
            value={form.number}
            onChange={set("number")}
          />

          <TextAreaField
            label="Destaque da localização"
            placeholder="Ex: Próximo ao Centro, à padaria e transporte público."
            value={form.highlight}
            onChange={set("highlight")}
          />
        </div>

        <div className="space-y-3">
          <StepLabel>Localização no mapa</StepLabel>
          <div className="h-[260px] min-w-0 overflow-hidden rounded-[10px] border border-[#d2d2d2]">
            <MapContainer
              center={position}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker
                position={position}
                draggable={editing}
                eventHandlers={{
                  dragend: (e) => {
                    const p = e.target.getLatLng();
                    setPosition([p.lat, p.lng]);
                  },
                }}
              />
            </MapContainer>
          </div>
          <p className="font-['Inter'] text-[13px] leading-snug text-muted-foreground">
            Confirme se o mapa corresponde ao endereço informado.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => setEditing(!editing)}
            className="h-9 rounded-[8px] border-[#c9c9c9] bg-white px-4 font-['Inter'] text-[13px] text-foreground hover:bg-muted"
          >
            {editing ? "Concluir ajuste" : "Ajustar marcador manualmente"}
          </Button>

          <TipCard title="Endereço claro, mais visitas">
            <p>
              Anúncios com endereço completo recebem mais contatos. Se preferir
              não informar o número, use um ponto de referência descritivo.
            </p>
          </TipCard>
        </div>
      </div>
    </Shell>
  );
}
