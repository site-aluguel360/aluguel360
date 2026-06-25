import { useState } from "react";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Check,
  CirclePlus,
  House,
  Heart,
  MapPin,
  PencilLine,
  Play,
  Minus,
  Plus,
  Ruler,
  Sofa,
  SquareCheckBig,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";



const maxStep = 6;

const DEFAULT_ROOM_IDS = ["quartos", "salas", "garagem", "varandas", "suites", "banheiros"];

const propertyTypes = ["Casa", "Apartamento", "Kitnet", "Cômodo", "Outro"];

const featureOptions = [
  { key: "pets", label: "Aceita pets" },
  { key: "condominio", label: "Condomínio incluso" },
  { key: "suite", label: "Quarto suíte" },
  { key: "mobiliado", label: "Mobiliado" },
  { key: "iptu", label: "IPTU incluso" },
  { key: "portaria", label: "Portaria" },
  { key: "escolas", label: "Próximo à escolas" },
  {
    key: "transporte",
    label: "Próximo ao transporte público",
  },
];

const guaranteeOptions = ["Caução", "Fiador", "Sem garantia", "Seguro Fiançado"];

const photoSlots = [
  "Fachada do Prédio",
  "Entrada / Portaria",
  "Sala",
  "Cozinha",
  "Banheiro Principal",
  "Quarto 1",
  "Quarto 2",
  "Varanda",
];

const initialForm = {
  propertyType: "Casa",
  area: "160",
  rooms: [
    { id: "quartos", label: "Quartos", value: 0 },
    { id: "salas", label: "Salas", value: 0 },
    { id: "garagem", label: "Garagem", value: 0 },
    { id: "varandas", label: "Varandas", value: 0 },
    { id: "suites", label: "Banheiro Suít", value: 0 },
    { id: "banheiros", label: "Banheiros", value: 0 },
  ],
  features: {
    pets: true,
    condominio: true,
    suite: true,
    mobiliado: true,
    iptu: true,
    portaria: true,
    escolas: true,
    transporte: true,
  },
  cep: "",
  street: "",
  neighborhood: "",
  reference: "",
  complement: "",
  number: "",
  highlight: "",
  rent: "",
  negotiable: false,
  condoFee: "R$ 0,00",
  condoIncluded: false,
  iptuFee: "R$ 0,00",
  iptuIncluded: false,
  otherFees: "",
  guarantee: "Sem garantia",
  title: "",
  description: "",
  extraInfo: "",
};

const SIDEBAR_STEP_GRID = "grid min-w-0 gap-2 xl:grid-cols-[minmax(0,1fr)_240px]";

function Shell({ children, className = "" }) {
  return (
    <div
      className={`min-w-0 rounded-[8px] bg-white shadow-none ${className}`}
    >
      {children}
    </div>
  );
}

function TitleBlock({ title, subtitle }) {
  return (
    <div className="mb-1.5">
      <h2 className="font-['Poppins'] text-[20px] font-semibold leading-tight text-[#515151] sm:text-[24px]">
        {title}
      </h2>
      <p className="mt-1.5 font-['Inter'] text-[14px] leading-snug text-[#2d2d2d] sm:text-[16px]">
        {subtitle}
      </p>
    </div>
  );
}

function StepLabel({ children }) {
  return <p className="font-['Inter'] text-[14px] font-medium text-[#111]">{children}</p>;
}

function TextField({ label, hint, className = "", ...props }) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <StepLabel>{label}</StepLabel>
      <Input


        className="mt-2 h-9 w-full min-w-0 rounded-[10px] border border-[#c9c9c9] bg-white px-3 font-['Inter'] text-[14px] text-[#333] shadow-none transition-colors duration-200 placeholder:text-[#999] focus-visible:border-[#2c7e7b] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2c7e7b]"
        {...props}
      />
      {hint ? <p className="mt-1 font-['Inter'] text-[10px] text-[#555]">{hint}</p> : null}
    </label>
  );
}

function TextAreaField({ label, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      <StepLabel>{label}</StepLabel>
      <Textarea
        className="mt-2 min-h-[40px] rounded-[10px] border border-[#c9c9c9] bg-white px-3 py-2 font-['Inter'] text-[15px] text-[#333] shadow-none transition-colors duration-200 placeholder:text-[#999] focus-visible:border-[#2c7e7b] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2c7e7b]"
        {...props}
      />
    </label>
  );
}

function TipCard({ title, children }) {
  return (
    <div className="h-fit rounded-[4px] bg-white px-2.5 py-2 shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
      <h3 className="font-['Poppins'] text-[20px] font-semibold leading-tight text-[#2c7e7b]">
        {title}
      </h3>

      <div className="mt-1.5 space-y-1.5 font-['Inter'] text-[13px] leading-snug text-[#242424]">
        {children}
      </div>
    </div>
  );
}

function ProgressBar({ step }) {
  const progress = `${(step / maxStep) * 100}%`;

  return (
    <div className={`mx-auto w-full min-w-0 max-w-full px-2 sm:px-3 xl:max-w-[800px] ${step === 6 ? "-mt-3" : ""}`}>
      <div className="h-2 rounded-full bg-[#d9d9d9]">
        <div
          className="h-2 rounded-full bg-[#2c7e7b]"
          style={{ width: progress }}
        />
      </div>

      <p className="font-['Inter'] text-[15px] text-[#111]">
        Etapa {step} de 6
      </p>
    </div>
  );
}

function FooterNav({ step, onBack, onNext }) {
  return (
    <div className="mt-1 flex min-w-0 flex-wrap items-center justify-between gap-2 px-2 sm:px-1">
      <Button
        type="button"
        onClick={onBack}
        variant="ghost"
        className="h-auto gap-2 rounded-none p-0 font-['Inter'] text-[18px] font-normal text-[#555] shadow-none hover:bg-transparent hover:text-[#2c7e7b]"
      >
        <ChevronLeft className="h-6 w-6" strokeWidth={2.25} />
        Voltar
      </Button>

      {step < maxStep ? (
        <Button
          type="button"
          onClick={onNext}
          className="mt-2 h-[30px] rounded-[10px] bg-[#2c7e7b] px-5 font-['Poppins'] text-[18px] font-semibold text-white shadow-[0_1px_4px_rgba(0,0,0,0.18)] hover:bg-[#256d6a]"
        >
          Próximo &gt;&gt;
        </Button>
      ) : (
        <div className="flex-1" />
      )}

    </div>
  );
}


function CountField({ label, value, onDecrease, onIncrease }) {
  return (
    <div className="min-w-0 flex flex-col items-center">
      <p className="h-5 w-full text-center font-['Inter'] text-[16px] text-[#2c7e7b]">
        {label}
      </p>

      <div className="mt-2 flex w-fit overflow-hidden rounded-[4px] border border-[#d9d9d9] bg-white">

        <button
          type="button"
          onClick={onDecrease}
          className="flex h-8 w-8 items-center justify-center text-[#c8c8c8] hover:bg-[#f3f6f6] hover:text-[#2c7e7b]"
        >
          <span className="relative -left-[1px] text-[15px] leading-none">
            −
          </span>
        </button>

        <div className="flex h-8 w-8 items-center justify-center border-x border-[#d9d9d9] font-['Inter'] text-[16px] text-[#2c7e7b]">
          {value}
        </div>

        <button
          type="button"
          onClick={onIncrease}
          className="flex h-8 w-8 items-center justify-center text-[#c8c8c8] hover:bg-[#f3f6f6] hover:text-[#2c7e7b]"
        >
          <span className="relative left-[1px] text-[15px] leading-none">
            +
          </span>
        </button>

      </div>
    </div>
  );
}
function ListingPreview({ form }) {
  return (
    <div className="relative flex h-auto w-full min-w-0 flex-col items-center rounded-[4px] border border-[#bfc7cb] bg-white p-0">
      <span className="absolute right-6 top-5 text-white">
        <Heart className="h-6 w-6 fill-transparent stroke-[2.2px]" />
      </span>
      <img
        src="/assets/property_1.png"
        alt="Prévia do anúncio"
        className="h-[180px] w-full max-w-[250px] rounded-[4px] object-cover"
      />
      <div className="mt-3 w-full max-w-[300px]">
        <h4 className="font-['Inter'] text-[20px] font-semibold leading-tight text-[#111]">
          {form.title || "Título do anúncio"}
        </h4>
        <p className="mt-1.5 font-['Inter'] text-[13px] leading-tight text-[#444]">
          {form.description || "Descrição do anúncio aparecerá aqui..."}
        </p>
        {form.extraInfo && (
          <p className="mt-2 font-['Inter'] text-[13px] text-[#555]">
            {form.extraInfo}
          </p>
        )}
        <p className="mt-3 font-['Inter'] text-[20px] font-semibold text-[#111]">R$ 2.900</p>
        <div className="mt-3 flex items-center gap-6 text-[13px] text-[#666]">
          <span className="flex items-center gap-1.5">
            <Ruler className="h-4 w-4" /> 60m²
          </span>
          <span className="flex items-center gap-1.5">
            <Sofa className="h-4 w-4" /> 1 quarto
          </span>
        </div>
        <p className="mt-3 flex items-center gap-2 text-[12px] text-[#666]">
          <MapPin className="h-4 w-4" /> Rua Ipê Amarelo, 128 – Jardim das Flores
        </p>
      </div>
    </div>
  );
}

function RadioOption({ label, checked, onChange }) {
  return (
    <label className="flex min-w-0 items-center gap-3 text-[16px] text-[#2c7e7b]">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 accent-[#2c7e7b]"
      />
      <span className="min-w-0">{label}</span>
    </label>
  );
}

function FeatureToggle({ label, checked, onChange }) {
  return (
    <label className="flex min-w-0 items-center gap-3 text-[17px] text-[#111]">
      <span
        className={`h-5 w-5 min-h-6 min-w-6 shrink-0 flex items-center justify-center rounded-[3px] border ${checked
          ? "border-[#2c7e7b] bg-[#2c7e7b] text-white"
          : "border-[#c8c8c8] bg-white text-transparent"
          }`}
      >
        <Check className="h-4 w-2[4" strokeWidth={2.5} />
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

function StepOnePanel({ form, setForm }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newRoomLabel, setNewRoomLabel] = useState("");

  const handleDeleteRoom = (roomId) => {
    setForm((current) => ({
      ...current,
      rooms: current.rooms.filter((room) => room.id !== roomId),
    }));
  };

  const updateRoomValue = (roomId, delta) => {
    setForm((current) => ({
      ...current,
      rooms: current.rooms.map((room) =>
        room.id === roomId
          ? { ...room, value: Math.max(0, room.value + delta) }
          : room
      ),
    }));
  };

  const handleAddRoom = () => {
    const trimmedLabel = newRoomLabel.trim();
    if (!trimmedLabel) return;

    const exists = form.rooms.some(
      (r) => r.label.toLowerCase() === trimmedLabel.toLowerCase()
    );
    if (exists) {
      alert("Este cômodo já existe.");
      return;
    }

    const newId = (typeof crypto !== "undefined" && crypto.randomUUID)
      ? crypto.randomUUID()
      : `room_${Math.random().toString(36).substring(2, 9)}`;

    const newRoom = { id: newId, label: trimmedLabel, value: 0 };

    setForm((current) => ({
      ...current,
      rooms: [...current.rooms, newRoom],
    }));

    setNewRoomLabel("");
    setIsAdding(false);
  };

  return (
    <div className={SIDEBAR_STEP_GRID}>
      <Shell className="p-2 sm:p-3">
        <div className="rounded-[4px] border border-[#d9d9d9] p-1.5">
          <div className="rounded-[4px] border border-[#ededed] bg-white px-3 py-2 shadow-[0_0_1px_rgba(0,0,0,0.04)]">
            <p className="font-['Inter'] text-[18px] text-[#111]">Tipo imóvel</p>
            <div className="mt-2 grid grid-cols-2 gap-y-2 sm:grid-cols-3 xl:grid-cols-5">
              {propertyTypes.map((type) => (
                <RadioOption
                  key={type}
                  label={type}
                  checked={form.propertyType === type}
                  onChange={() => setForm((current) => ({ ...current, propertyType: type }))}
                />
              ))}
            </div>
          </div>

          <div className="mt-3 rounded-[4px] border border-[#ededed] bg-white px-3 py-2">
            <div className="ml-2 flex items-center gap-4">
              <StepLabel>Área total (m²)</StepLabel>

              <Input
                value={form.area}
                onChange={(event) =>
                  setForm((current) => ({ ...current, area: event.target.value }))
                }
                className="h-8 w-16 rounded-[8px] border-[#b9b9b9] px-2 text-center font-['Inter'] text-[16px] text-[#444] shadow-none focus-visible:ring-1 focus-visible:ring-[#2c7e7b]"
              />
            </div>
          </div>
          <div className="mt-3 ml-2">
            <StepLabel>Informe a quantidade de cada cômodo</StepLabel>
            <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-3 xl:grid-cols-6">
              {form.rooms.map((room) => {
                const isCustom = !DEFAULT_ROOM_IDS.includes(room.id);
                return (
                  <div
                    key={room.id}
                    className="relative flex flex-col items-center group w-full min-w-0"
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
                        className="absolute -top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full border border-[#ededed] bg-white text-red-500 shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-red-50 hover:text-red-600 z-10 cursor-pointer"
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
              <div className="mt-3 ml-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-sm">
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
                  className="h-9 rounded-[10px] border border-[#c9c9c9] bg-white px-3 font-['Inter'] text-[14px] text-[#333] shadow-none focus-visible:border-[#2c7e7b] focus-visible:ring-[#2c7e7b]"
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleAddRoom}
                    className="h-9 rounded-[10px] bg-[#2c7e7b] px-4 font-['Poppins'] text-[14px] font-semibold text-white hover:bg-[#256d6a]"
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
                    className="h-9 rounded-[10px] border border-[#b8b8b8] bg-white px-3 font-['Inter'] text-[14px] text-[#555] hover:bg-[#f5faf9]"
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
                className="mt-3 ml-6 h-12 rounded-[4px] border border-[#b8b8b8] bg-white px-5 text-left font-['Inter'] text-[14px] text-[#2c7e7b] shadow-none hover:bg-[#f5faf9]"
              >
                <div className="flex flex-col items-center gap-1">
                  <span>Adicionar cômodo</span>
                  <CirclePlus className="h-4 w-4" />
                </div>
              </Button>
            )}
          </div>

        </div>

        <div className="mt-2 rounded-[4px] border border-[#d9d9d9] p-2 sm:p-2.5">
          <StepLabel>Informações Extras</StepLabel>
          <div className="mt-1.5 grid grid-cols-1 gap-y-1.5 gap-x-3 sm:grid-cols-2 xl:grid-cols-4">
            {featureOptions.map((option) => (
              <FeatureToggle
                key={option.key}
                label={option.label}
                checked={form.features[option.key]}
                onChange={() =>
                  setForm((current) => ({
                    ...current,
                    features: {
                      ...current.features,
                      [option.key]: !current.features[option.key],
                    },
                  }))
                }
              />
            ))}
          </div>
        </div>
      </Shell>

      <Shell className="p-2 sm:p-2.5">
        <div className="rounded-[4px] border border-[#d9d9d9] p-3 h-fit">
          <TipCard title="Dicas rápidas">
            <p>Mais detalhes para seu anúncio ajudam a receber mais visitas e contatos qualificados.</p>

            <p className="font-semibold">
              Tenha em mãos no mínimo uma foto por item adicionado.
            </p>

            <p>
              Marcar 3 quartos? Prepare ao menos 1 foto por quarto. Se for apartamento, inclua
              foto da fachada/portaria.
            </p>
          </TipCard>
        </div>
      </Shell>
    </div>
  );
}

function StepTwoPanel() {
  return (
    <div className={SIDEBAR_STEP_GRID}>
      <Shell className="p-2 sm:p-3">
        <div className="rounded-[4px] border border-[#d9d9d9] p-0 pb-2">

          <div className="ml-3">
            <StepLabel>Fotos Obrigatórias</StepLabel>
          </div>

          <div className="mt-2 -ml-8 grid grid-cols-4 gap-x-3 gap-y-3">
            {photoSlots.map((label) => (
              <div key={label} className="flex min-w-0 flex-col items-center">
                <button
                  type="button"
                  className="flex h-[66px] w-full max-w-[110px] items-center justify-center rounded-[8px] border border-[#bcbcbc] bg-[#f8f8f8] text-[#9a9a9a] transition-colors hover:border-[#2c7e7b] hover:bg-[#f5faf9] hover:text-[#2c7e7b]"
                >
                  <span className="flex flex-col items-center gap-0.5 text-[13px]">
                    <Camera className="h-6 w-6" />
                    Adicionar Foto
                  </span>
                </button>

                <p className="mt-2 min-h-[40px] w-full max-w-[110px] text-center font-['Inter'] text-[13px] leading-tight text-[#333]">
                  {label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-0 ml-7">
            <Button
              type="button"
              variant="outline"
              className="h-8 w-full max-w-[250px] rounded-[8px] border border-[#b4c2c8] bg-[#f1f4f6] px-1 font-['Inter'] text-[14px] text-[#555] shadow-none whitespace-nowrap hover:bg-[#e8edf0]"
            >
              + Adicionar mais fotos (opcional)
            </Button>
          </div>
        </div>

        <div className="mt-3 rounded-[4px] border border-[#d9d9d9] px-3 pt-3 pb-[8px] sm:px-4">
          <StepLabel>Vídeo do Imóvel</StepLabel>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex h-[72px] w-[112px] items-center justify-center rounded-[10px] bg-[#ededed] text-[#2c7e7b]">
              <Play className="h-7 w-7 fill-current" />
            </div>
            <p className="max-w-full font-['Inter'] text-[14px] leading-tight text-[#2d2d2d] sm:max-w-[280px]">
              Envie um Vídeo curto de pelo menos <strong>1 minuto</strong> mostrando todo o imóvel.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="mt-3 h-[38px] rounded-[10px] border-[1px] border-[#111] bg-[#9c9c9c] px-4 font-['Poppins'] text-[16px] font-semibold text-[#333] shadow-none hover:bg-[#8f8f8f]"
          >
            Enviar vídeo
          </Button>
        </div>
      </Shell>

      <Shell className="p-2 sm:p-3">
        <div className="rounded-[4px] border border-[#d9d9d9] p-3 h-fit">
          <TipCard title="Dicas rápidas">
            <p className="font-semibold">
              As fotos são essenciais para que as pessoas entendam melhor o imóvel e se interessem
              pelo anúncio.
            </p>
            <p>
              Para seguir com a publicação, é necessário enviar as fotos obrigatórias e o vídeo
              solicitado.
            </p>
            <p>
              Priorize imagens reais, bem iluminadas e que mostrem os principais ambientes de forma
              clara.
            </p>
            <p>
              Fotos completas e de boa qualidade melhoram a experiência dos interessados e ajudam seu
              imóvel a se destacar nos resultados.
            </p>
          </TipCard>
        </div>
      </Shell>
    </div>
  );
}

function StepThreePanel({ form, setForm }) {
  const [position, setPosition] = useState([
    -5.0892,
    -42.8016,
  ]);

  const [editing, setEditing] = useState(false);
  return (
    <div className={SIDEBAR_STEP_GRID}>
      <Shell className="p-2 sm:p-3">
        <div className="grid min-w-0 grid-cols-1 gap-3 xl:grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)]">
          <div className="min-w-0 rounded-[4px] border border-[#d2d2d2] bg-white px-2.5 pt-2.5 pb-1">
            <TextField
              label="CEP"
              placeholder="Digite o CEP"
              hint="Buscaremos automaticamente rua e bairro."
              value={form.cep}
              onChange={(event) => setForm((current) => ({ ...current, cep: event.target.value }))}
            />

            <div className="mt-2 grid gap-2">
              <TextField
                label="Rua"
                placeholder="Rua ou Avenida"
                value={form.street}
                onChange={(event) =>
                  setForm((current) => ({ ...current, street: event.target.value }))
                }
              />
              <TextField
                label="Bairro"
                placeholder="Nome do Bairro"
                value={form.neighborhood}
                onChange={(event) =>
                  setForm((current) => ({ ...current, neighborhood: event.target.value }))
                }
              />

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <TextField
                  label="Ponto de Referência"
                  placeholder="Digite algo próximo"
                  value={form.reference}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, reference: event.target.value }))
                  }
                />
                <TextField
                  label="Complemento"
                  placeholder="complemento"
                  value={form.complement}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, complement: event.target.value }))
                  }
                />
              </div>

              <TextField
                label="Número"
                placeholder="0000"
                hint="se não houver, deixe em branco"
                value={form.number}
                onChange={(event) =>
                  setForm((current) => ({ ...current, number: event.target.value }))
                }
              />

              <TextAreaField
                label="Destaque da localização"
                placeholder="Digite o diferencial da localização do seu imóvel.\nEx: Próximo ao Centro"
                value={form.highlight}
                onChange={(event) =>
                  setForm((current) => ({ ...current, highlight: event.target.value }))
                }
              />
            </div>
          </div>

          <div className="min-w-0 rounded-[4px] border border-[#d2d2d2] bg-[#eceff1] p-2.5">
            <StepLabel>Localização no Mapa</StepLabel>
            <div className="mt-2 h-[220px] min-w-0 overflow-hidden rounded-[8px] sm:h-[280px] xl:h-[335px]">
              <MapContainer
                center={position}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker
                  position={position}
                  draggable={editing}
                  eventHandlers={{
                    dragend: (e) => {
                      const novaPosicao = e.target.getLatLng();
                      setPosition([
                        novaPosicao.lat,
                        novaPosicao.lng,
                      ]);
                    },
                  }}
                />
              </MapContainer>
            </div>
            <p className="mt-2 font-['Inter'] text-[18px] leading-snug text-[#222]">
              Confirme se o mapa corresponde ao endereço informado.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditing(!editing)}
              className="mt-1.5 h-10 rounded-[10px] border-[#9fb7c0] bg-[#f4f4f4] px-4 font-['Inter'] text-[16px] text-[#555] shadow-none hover:bg-[#ececec]"
            >
              Ajustar marcador manualmente
            </Button>
          </div>
        </div>
      </Shell>

      <Shell className="p-2 sm:p-3">
        <div className="rounded-[4px] border-[0.5px] border-[#d9d9d9] p-3 h-fit">
          <TipCard title="Dicas rápidas">
            <p className="font-semibold">
              Capriche no endereço: anúncios com localização clara recebem mais visitas.
            </p>
            <p>
              Endereços completos ajudam o interessado a confiar no anúncio e tornam a busca mais
              precisa.
            </p>
            <p>
              Se não quiser informar o número exato, deixe o campo em branco e use um ponto de
              referência bem descritivo.
            </p>
          </TipCard>
        </div>
      </Shell>
    </div>
  );
}

function StepFourPanel({ form, setForm }) {
  return (
    <div className={SIDEBAR_STEP_GRID}>
      <Shell className="p-2 sm:p-3">
        <div className="rounded-[4px] border border-[#d9d9d9] p-3 pb-7">
          <div className="grid gap-3">
            <div className="grid grid-cols-1 gap-1.5 md:grid-cols-[minmax(0,460px)_auto] md:gap-6 md:items-end">
              <TextField
                label="Valor do Aluguel (mensal)"
                placeholder="Ex: R$ 1.500"
                value={form.rent}
                onChange={(event) => setForm((current) => ({ ...current, rent: event.target.value }))}
              />
              <label className="flex shrink-0 items-center gap-2 pb-0 font-['Inter'] text-[16px] text-[#2d2d2d] md:pb-2">
                <input
                  type="checkbox"
                  checked={form.negotiable}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, negotiable: event.target.checked }))
                  }
                  className="h-5 w-5 rounded border-[#2c7e7b] accent-[#2c7e7b]"
                />
                Preço negociável?
              </label>
            </div>

            <div className="grid grid-cols-1 gap-1.5 md:grid-cols-[minmax(0,460px)_auto] md:gap-6 md:items-end">
              <TextField
                label="Condomínio"
                placeholder="R$ 0,00"
                value={form.condoFee}
                onChange={(event) =>
                  setForm((current) => ({ ...current, condoFee: event.target.value }))
                }
              />
              <label className="flex shrink-0 items-center gap-2 pb-0 font-['Inter'] text-[16px] text-[#2d2d2d] md:pb-2">
                <input
                  type="checkbox"
                  checked={form.condoIncluded}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, condoIncluded: event.target.checked }))
                  }
                  className="h-5 w-5 rounded border-[#2c7e7b] accent-[#2c7e7b]"
                />
                Já incluso no aluguel?
              </label>
            </div>

            <div className="grid grid-cols-1 gap-1.5 md:grid-cols-[minmax(0,460px)_auto] md:gap-6 md:items-end">
              <TextField
                label="IPTU"
                placeholder="R$ 0,00"
                value={form.iptuFee}
                onChange={(event) =>
                  setForm((current) => ({ ...current, iptuFee: event.target.value }))
                }
              />
              <label className="flex items-center gap-2 whitespace-nowrap pb-0 font-['Inter'] text-[16px] text-[#2d2d2d] md:pb-2">
                <input
                  type="checkbox"
                  checked={form.iptuIncluded}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, iptuIncluded: event.target.checked }))
                  }
                  className="h-5 w-5 rounded border-[#2c7e7b] accent-[#2c7e7b]"
                />
                Já incluso no aluguel?
              </label>
            </div>

            <div className="grid grid-cols-1 gap-1.5 md:grid-cols-[minmax(0,460px)_auto] md:gap-6 md:items-end">
              <TextField
                label="Outras taxas (se houver)"
                placeholder="Ex: Água, luz, Manutenção"
                value={form.otherFees}
                onChange={(event) =>
                  setForm((current) => ({ ...current, otherFees: event.target.value }))
                }
              />
              <label className="flex shrink-0 items-center gap-2 pb-0 font-['Inter'] text-[16px] text-[#2d2d2d] md:pb-2">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-[#2c7e7b] accent-[#2c7e7b]"
                />
                Já incluso no aluguel?
              </label>
            </div>

            <div>
              <p className="font-['Inter'] text-[16px] font-medium text-[#111]">Tipo de garantia Aceita</p>
              <div className="mt-2 rounded-[10px] border border-[#c8c8c8] px-3 py-2.5">
                <div className="flex flex-wrap gap-4">
                  {guaranteeOptions.map((option) => {
                    const active = form.guarantee === option;
                    return (
                      <label key={option} className="flex items-center gap-3 font-['Inter'] text-[14px] text-[#2d2d2d]">
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-[4px] border ${active
                            ? "border-[#2c7e7b] bg-[#2c7e7b] text-white"
                            : "border-[#c8c8c8] bg-white text-transparent"
                            }`}
                        >
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        </span>
                        <input
                          type="radio"
                          checked={active}
                          onChange={() => setForm((current) => ({ ...current, guarantee: option }))}
                          className="sr-only"
                        />
                        <span>{option}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <p className="mt-1.5 font-['Inter'] text-[12px] text-[#444]">
                Quanto mais opções, maior o número de interessados.
              </p>
            </div>
          </div>
        </div>
      </Shell>

      <Shell className="p-2 sm:p-3">
        <div className="rounded-[4px] border-[0.5px] border-[#d9d9d9] p-3 h-fit">
          <TipCard title="Dicas rápidas">
            <p className="font-semibold">
              Imóveis com preços alinhados ao mercado recebem mais visualizações e aumentam as
              chances de contrato.
            </p>

            <p>
              Anúncios com valores irreais, simbólicos ou fora do mercado podem ser reprovados.
            </p>

            <p>
              Preços muito abaixo ou acima do mercado podem gerar contatos desqualificados ou atrasar
              a aprovação do anúncio por falta de informações claras.
            </p>

            <p>
              Valores como “0” ou “1.111” ou similares prejudicam a qualidade do anúncio e
              dificultam sua aprovação.
            </p>
          </TipCard>
        </div>
      </Shell>
    </div>
  );
}

function StepFivePanel({ form, setForm, setStep }) {
  return (
    <div className="grid min-w-0 gap-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <Shell className="p-2 sm:p-3">
        <div className="mt-0 rounded-[4px] border border-[#d9d9d9] px-6 pt-1 pb-34">
          <TextField
            label="Título do anúncio"
            placeholder="Ex.: Apartamento iluminado com 2 quartos no Centro."
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          />

          <div className="mt-3">
            <TextAreaField
              label="Descrição do anúncio"
              placeholder={"Ex.: Ambiente arejado/iluminado;\nessse imóvel fica localizado perto de escolas/mercados\nimóvel contém varanda....."}
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
            />
          </div>

          <div className="my-3 border-t border-[#e5e5e5]"></div>

          <div className="mt-3">
            <TextAreaField
              label="Informações relevantes (opcional)"
              placeholder="Escreva aqui informações relevantes que você acha que deveria conter no seu anúncio"
              value={form.extraInfo}
              onChange={(event) =>
                setForm((current) => ({ ...current, extraInfo: event.target.value }))
              }
            />
          </div>
        </div>
      </Shell>

      <Shell className="p-2 sm:p-3 -mt-5">
        <p className="text-center font-['Inter'] text-[14px] text-[#111]">
          Veja como seu anúncio será exibido para os usuários
        </p>
        <AdPreview form={form} />
      </Shell>
    </div>
  );
}
import { IconeFavorito } from "./IconeFavorito";
function AdPreview({ form }) {
  return (
    <div className="relative flex w-full min-w-0 flex-col items-center rounded-[4px] border border [#d9d9d9] bg-white px-4 pb-4 pt-5">

      {/* ícone favorito */}
      {/* imagem + favorito */}
      <div className="relative h-[220px] w-full max-w-[300px]">

        <img
          src={form.image || "/assets/property_1.png"}
          alt="Prévia do anúncio"
          className="h-full w-full rounded-[4px] object-cover"
        />


        <span className="absolute right-3 top-3 z-10">
          <IconeFavorito />
        </span>

      </div>


      <div className="mt-4 w-full max-w-[300px]">


        {/* título */}
        <h4 className="font-['Inter'] text-[20px] font-semibold leading-tight text-[#111]">
          {form.title || "Título do anúncio"}
        </h4>


        {/* descrição */}
        <p className="mt-2 font-['Inter'] text-[13px] leading-tight text-[#444]">
          {form.description || "Descrição do anúncio aparecerá aqui..."}
        </p>


        {/* informações extras */}
        {form.extraInfo && (
          <p className="mt-2 font-['Inter'] text-[13px] leading-tight text-[#555]">
            {form.extraInfo}
          </p>
        )}

        {/* valor */}
        <p className="mt-3 font-['Inter'] text-[20px] font-semibold text-[#111]">
          {form.rent || "R$ 2.900"}
        </p>


        {/* área e quarto */}
        <div className="mt-3 flex items-center gap-6 font-['Inter'] text-[13px] text-[#666]">

          <span className="flex items-center gap-1.5">
            <Ruler className="h-4 w-4" />
            {form.area || "60"}m²
          </span>


          <span className="flex items-center gap-1.5">
            <Sofa className="h-4 w-4" />
            {(form.rooms?.find(r => r.id === "quartos")?.value ?? 0)} quarto
          </span>

        </div>


        {/* endereço */}
        <p className="mt-3 flex items-center gap-2 font-['Inter'] text-[12px] text-[#666]">

          <MapPin className="h-4 w-4" />

          {form.street || "Rua Ipê Amarelo, 128 – Jardim das Flores"}

        </p>


      </div>

    </div>
  );
}

function StepSixPanel({ setStep, form }) {
  return (
    <div className="grid min-w-0 gap-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <Shell className="p-2 sm:p-3">
        <StepLabel>Informações preenchidas</StepLabel>
        <div className="mt-2]0 rounded-[4px] border border-[#bfc7cb] p-3 pb-0 pt-2">
          <div className="space-y-3 font-['Inter'] text-[15px] text-[#2d2d2d]">
            {[
              "Informações básicas concluídas",
              "Localização Confirmada",
              "Fotos Adicionadas",
              "Vídeo Enviado",
              "Preço Definido",
            ].map((item) => (
              <div key={item} className="flex items-center gap-4">
                <Check className="h-5 w-5 text-[#2c7e7b]" strokeWidth={2.6} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-1.5 font-['Inter'] text-[12px] text-[#333]">
          Anúncios completos recebem mais visitas e contatos
        </p>

        <div className="mt-3">
          <StepLabel>Editar Informações do imóvel</StepLabel>
          <div className="mt-2 rounded-[4px] border border-[#bfc7cb] p-2.5 font-['Inter'] text-[16px] text-[#2c7e7b] pb-16">
            <div className="space-y-1.5">
              {[
                "Editar Preços e Condições",
                "Editar localização do imóvel",
                "Editar fotos e vídeos do imóvel",
                "Editar texto de anúncio do imóvel",
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    if (item === "Editar Preços e Condições") {
                      setStep(4);
                    }

                    if (item === "Editar localização do imóvel") {
                      setStep(3);
                    }

                    if (item === "Editar fotos e vídeos do imóvel") {
                      setStep(2);
                    }

                    if (item === "Editar texto de anúncio do imóvel") {
                      setStep(5);
                    }
                  }}
                  className="flex items-center gap-2 text-left hover:underline"
                >
                  <PencilLine className="h-4 w-4" />
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Shell>

      <Shell className="p-2 sm:p-3 -mt-1 pb-[2px]">
        <p className="text-center font-['Inter'] text-[16px] text-[#111]">
          Veja como seu anúncio será exibido para os usuários
        </p>
        <AdPreview form={form} />
      </Shell>
    </div>
  );
}

export function CardCadastroImovel() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);

  const goBack = () => setStep((current) => Math.max(0, current - 1));
  const goNext = () => setStep((current) => Math.min(maxStep, current + 1));

  return (
    <div className="flex min-w-0 flex-col">
      <Shell className={`w-full overflow-x-hidden px-3 sm:px-4 ${step === 0
        ? "py-6 sm:py-7"
        : "pt-6 pb-2 sm:pt-7 sm:pb-2"
        }`}>
        {step === 0 ? (
          <div className="grid min-w-0 gap-6 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-center lg:gap-6">
            <div className="min-w-0 max-w-[520px]">
              <h2 className="font-['Poppins'] text-[22px] font-semibold leading-tight text-[#515151] sm:text-[30px]">
                Anuncie seu imóvel de forma <span className="text-[#2c7e7b] underline decoration-4 underline-offset-4">simples</span> e <span className="text-[#2c7e7b] underline decoration-4 underline-offset-4">rápida</span>!
              </h2>

              <p className="mt-3 font-['Inter'] text-[16px] font-semibold text-[#2c7e7b]">
                Tudo guiado passo a passo.
              </p>
              <p className="mt-3 font-['Inter'] text-[16px] text-[#111]">Leva de 3 a 5 minutos.</p>
              <p className="mt-2 font-['Inter'] text-[18px] text-[#111]">
                Anúncios completos recebem até 3x mais contatos.
              </p>

              <p className="mt-3 font-['Inter'] text-[16px] text-[#111]">
                Estratégias para <span className="text-[#2c7e7b] underline decoration-2 underline-offset-4">reduzir curiosos</span>
              </p>

              <p className="mt-2 max-w-[460px] font-['Inter'] text-[18px] leading-[1.5] text-[#555]">
                Para melhor experiência no seu anúncio, pediremos um vídeo de no mínimo <strong className="text-[#111]">1 minuto</strong> do seu imóvel.
              </p>

              <Button
                type="button"
                onClick={goNext}
                className="mt-3 h-[42px] rounded-[10px] bg-[#2c7e7b] px-3 font-['Poppins'] text-[16px] font-semibold text-white shadow-[0_3px_8px_rgba(0,0,0,0.2)] hover:bg-[#256d6a]"
              >
                Quero anunciar <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
            </div>
            <div className="flex min-w-0 flex-col items-center justify-center gap-2">
              <img
                src="/assets/Casaimovel.png"
                alt="Casa para anúncio"
                className="w-[300px] max-w-full object-contain"
              />

              <div className="flex w-full max-w-[220px] flex-col items-center space-y-1.5 font-['Inter'] text-[16px] text-[#1f645d]">
                <div className="flex w-full items-center gap-2 font-semibold">
                  <SquareCheckBig className="h-5 w-5 shrink-0" /> Cadastro
                </div>
                <div className="flex w-full items-center gap-2 font-semibold">
                  <House className="h-5 w-5 shrink-0" /> Informações do imóvel
                </div>
                <div className="flex w-full items-center gap-2 font-semibold">
                  <Camera className="h-5 w-5 shrink-0" /> Fotos
                </div>
                <div className="flex w-full items-center gap-2 font-semibold">
                  <Play className="h-5 w-5 shrink-0" /> Publicação
                </div>
              </div>
            </div>
          </div>
        ) : step === 1 ? (
          <div className="pb-0">
            <TitleBlock
              title="Informações básicas do imóvel"
              subtitle="Preencha os dados principais. Isso leva menos que 1 minuto."
            />

            <StepOnePanel form={form} setForm={setForm} />
          </div>

        ) : step === 2 ? (
          <>
            <TitleBlock
              title="Foto e Vídeo do Imóvel"
              subtitle="Imagens detalhadas aumentam o número de interessados. Capriche!"
            />
            <StepTwoPanel />
          </>
        ) : step === 3 ? (
          <>
            <TitleBlock
              title="Localização do imóvel"
              subtitle="Capriche no endereço: anúncios com localização clara recebem mais visitas."
            />
            <StepThreePanel form={form} setForm={setForm} />
          </>
        ) : step === 4 ? (
          <>
            <TitleBlock
              title="Preços e Condições"
              subtitle="Defina valores claros para receber interessados qualificados"
            />
            <StepFourPanel form={form} setForm={setForm} />
          </>
        ) : step === 5 ? (
          <>
            <TitleBlock
              title="Título e descrição do anúncio"
              subtitle="Use um bom título e descreva o imóvel de forma clara"
            />
            <StepFivePanel
              form={form}
              setForm={setForm}
              setStep={setStep}
            />
          </>
        ) : (
          <>
            <TitleBlock
              title="Revisar e Publicar anúncio"
              subtitle="Confira os dados do seu imóvel antes de publicar."
            />
            <StepSixPanel
              setStep={setStep}
              form={form}
            />
          </>
        )}


        <div className={`relative mt-${step === 0 ? '2' : '0.5'} pb-1 sm:pb-2`}>
          {step === 6 ? (
            <div className="mb-6 flex justify-center">
              <Button
                type="button"
                className="h-[28px] w-full max-w-[200px] rounded-[8px] bg-[#2c7e7b] px-2 font-['Poppins'] text-[16px] font-semibold text-white shadow-[0_1px_5px_rgba(0,0,0,0.22)] hover:bg-[#256d6a] sm:w-auto sm:min-w-[260px]"
              >
                Publicar Anúncio
              </Button>
            </div>
          ) : null}
          <ProgressBar step={step} />
        </div>
      </Shell>
      <FooterNav step={step} onBack={goBack} onNext={goNext} />
    </div>
  );
}