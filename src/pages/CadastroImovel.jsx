import { useState, useRef } from "react";
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
  Ruler,
  Sofa,
  SquareCheckBig,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { CardImovel } from "../components/CardImovel";
import { MenuLogin } from "../components/MenuLogin";

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


const initialForm = {
  propertyType: "Casa",
  area: "160",
  rooms: [
    { id: "quartos", label: "Quartos", value: 0 },
    { id: "salas", label: "Salas", value: 0 },
    { id: "garagem", label: "Garagem", value: 0 },
    { id: "varandas", label: "Varandas", value: 0 },
    { id: "suites", label: "Suítes", value: 0 },
    { id: "banheiros", label: "Banheiros", value: 0 },
  ],
  features: {
    pets: false,
    condominio: false,
    suite: false,
    mobiliado: false,
    iptu: false,
    portaria: false,
    escolas: false,
    transporte: false,
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
  photos: {},
  extraPhotos: [],
  video: null,
};

const SIDEBAR_STEP_GRID = "grid min-w-0 gap-1 lg:grid-cols-[1fr_minmax(180px,240px)]";

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
    <div className="mb-1">
      <h2 className="font-['Poppins'] text-[18px] font-semibold leading-tight text-secondary sm:text-[20px]">
        {title}
      </h2>
      <p className="mt-1 font-['Inter'] text-[13px] leading-snug text-foreground sm:text-[14px]">
        {subtitle}
      </p>
    </div>
  );
}

function StepLabel({ children }) {
  return <p className="font-['Inter'] text-[13px] font-medium text-[#111]">{children}</p>;
}

function TextField({ label, hint, className = "", ...props }) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <StepLabel>{label}</StepLabel>
      <Input


        className="mt-1 h-8 w-full min-w-0 rounded-[8px] border border-[#c9c9c9] bg-white px-2 font-['Inter'] text-[13px] text-[#333] shadow-none transition-colors duration-200 placeholder:text-[#999] focus-visible:border-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary"
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
        className="mt-1 min-h-[36px] rounded-[8px] border border-[#c9c9c9] bg-white px-2 py-1.5 font-['Inter'] text-[13px] text-[#333] shadow-none transition-colors duration-200 placeholder:text-[#999] focus-visible:border-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary"
        {...props}
      />
    </label>
  );
}

function TipCard({ title, children }) {
  return (
    <div className="h-fit rounded-[4px] bg-white px-2.5 py-1.5 shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
      <h3 className="font-['Poppins'] text-[16px] font-semibold leading-tight text-secondary">
        {title}
      </h3>

      <div className="mt-1 space-y-1 font-['Inter'] text-[12px] leading-snug text-[#242424]">
        {children}
      </div>
    </div>
  );
}

function ProgressBar({ step }) {
  const progress = `${(step / maxStep) * 100}%`;

  return (
    <div className={`mx-auto w-full min-w-0 max-w-2xl px-2 sm:px-3 ${step === 6 ? "-mt-1" : ""}`}>
      <div className="h-1.5 rounded-full bg-[#d9d9d9]">
        <div
          className="h-1.5 rounded-full bg-secondary"
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
        className="h-auto gap-1 rounded-none p-0 font-['Inter'] text-[14px] font-normal text-[#555] shadow-none hover:bg-transparent hover:text-secondary"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={2.25} />
        Voltar
      </Button>

      {step < maxStep ? (
        <Button
          type="button"
          onClick={onNext}
          className="mt-1 h-[28px] rounded-[6px] bg-secondary px-4 font-['Poppins'] text-[14px] font-semibold text-white shadow-[0_1px_4px_rgba(0,0,0,0.18)] hover:bg-primary"
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
      <p className="h-4 w-full text-center font-['Inter'] text-[13px] font-medium text-secondary">
        {label}
      </p>

      <div className="mt-1.5 flex w-fit overflow-hidden rounded-[4px] border border-[#d9d9d9] bg-white">

        <button
          type="button"
          onClick={onDecrease}
          className="flex h-8 w-8 items-center justify-center text-[#c8c8c8] hover:bg-[#f3f6f6] hover:text-secondary"
        >
          <span className="relative -left-[1px] text-[15px] leading-none">
            −
          </span>
        </button>

        <div className="flex h-8 w-8 items-center justify-center border-x border-[#d9d9d9] font-['Inter'] text-[16px] text-secondary">
          {value}
        </div>

        <button
          type="button"
          onClick={onIncrease}
          className="flex h-8 w-8 items-center justify-center text-[#c8c8c8] hover:bg-[#f3f6f6] hover:text-secondary"
        >
          <span className="relative left-[1px] text-[15px] leading-none">
            +
          </span>
        </button>

      </div>
    </div>
  );
}

function RadioOption({ label, checked, onChange }) {
  return (
    <label className="flex min-w-0 items-center gap-3 text-[16px] text-secondary">
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

function FeatureToggle({ label, checked, onChange }) {
  return (
    <label className="flex min-w-0 items-center gap-2 text-[13px] text-[#111]">
      <span
        className={`h-5 w-5 shrink-0 flex items-center justify-center rounded-[3px] border ${checked
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
            <div className="mt-2 grid grid-cols-2 gap-y-2 sm:grid-cols-3 md:grid-cols-5">
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
                className="h-8 w-16 rounded-[8px] border-[#b9b9b9] px-2 text-center font-['Inter'] text-[16px] text-[#444] shadow-none focus-visible:ring-1 focus-visible:ring-secondary"
              />
            </div>
          </div>
          <div className="mt-3 ml-2">
            <StepLabel>Informe a quantidade de cada cômodo</StepLabel>
            <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
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
                  className="h-9 rounded-[10px] border border-[#c9c9c9] bg-white px-3 font-['Inter'] text-[14px] text-[#333] shadow-none focus-visible:border-secondary focus-visible:ring-secondary"
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleAddRoom}
                    className="h-9 rounded-[10px] bg-secondary px-4 font-['Poppins'] text-[14px] font-semibold text-white hover:bg-primary"
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
                className="mt-3 ml-6 h-12 rounded-[4px] border border-[#b8b8b8] bg-white px-5 text-left font-['Inter'] text-[14px] text-secondary shadow-none hover:bg-[#f5faf9]"
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
          <div className="mt-1.5 grid grid-cols-1 gap-y-1.5 gap-x-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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

function getRequiredPhotoSlots(form) {
  const slots = ["Capa"];
  if (form.propertyType === "Apartamento") {
    slots.push("Fachada do Prédio", "Entrada / Portaria");
  } else if (form.propertyType === "Casa" || form.propertyType === "Kitnet") {
    slots.push("Fachada");
  }

  const getSingular = (id, label) => {
    const map = { quartos: "Quarto", salas: "Sala", varandas: "Varanda", suites: "Suíte", banheiros: "Banheiro", garagem: "Garagem" };
    return map[id] || label;
  };

  form.rooms.forEach((room) => {
    if (room.value > 0) {
      const singularLabel = getSingular(room.id, room.label);
      if (room.value === 1) {
        slots.push(singularLabel);
      } else {
        for (let i = 1; i <= room.value; i++) {
          slots.push(`${singularLabel} ${i}`);
        }
      }
    }
  });

  return slots;
}

function StepTwoPanel({ form, setForm }) {
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const extraPhotoInputRef = useRef(null);
  const [activeSlot, setActiveSlot] = useState(null);

  const dynamicPhotoSlots = getRequiredPhotoSlots(form);

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
      setForm((current) => ({
        ...current,
        photos: { ...current.photos, [activeSlot]: url },
      }));
    }
    setActiveSlot(null);
  };

  const handleRemovePhoto = (slotKey) => {
    setForm((current) => {
      const newPhotos = { ...current.photos };
      if (newPhotos[slotKey]) {
        URL.revokeObjectURL(newPhotos[slotKey]);
        delete newPhotos[slotKey];
      }
      return { ...current, photos: newPhotos };
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
      setForm((current) => {
        if (current.video) URL.revokeObjectURL(current.video);
        return { ...current, video: url };
      });
    }
  };

  const handleRemoveVideo = () => {
    setForm((current) => {
      if (current.video) URL.revokeObjectURL(current.video);
      return { ...current, video: null };
    });
  };

  const handleExtraPhotos = (e) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map((f) => URL.createObjectURL(f));
    setForm((current) => ({
      ...current,
      extraPhotos: [...(current.extraPhotos || []), ...urls],
    }));
    if (extraPhotoInputRef.current) extraPhotoInputRef.current.value = "";
  };

  const handleRemoveExtraPhoto = (index) => {
    setForm((current) => {
      const newExtra = [...(current.extraPhotos || [])];
      URL.revokeObjectURL(newExtra[index]);
      newExtra.splice(index, 1);
      return { ...current, extraPhotos: newExtra };
    });
  };

  return (
    <div className={SIDEBAR_STEP_GRID}>
      {/* Hidden file inputs */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoChange}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleVideoChange}
      />
      <input
        ref={extraPhotoInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleExtraPhotos}
      />

      <Shell className="p-2 sm:p-3">
        <div className="rounded-[4px] border border-[#d9d9d9] p-0 pb-2">

          <div className="ml-3">
            <StepLabel>Fotos Obrigatórias</StepLabel>
          </div>

          <div className="mt-2 grid grid-cols-4 gap-x-3 gap-y-3">
            {dynamicPhotoSlots.map((label, i) => {
              const slotKey = `${label}-${i}`;
              const photoUrl = form.photos?.[slotKey];
              return (
                <div key={slotKey} className="flex min-w-0 flex-col items-center">
                  {photoUrl ? (
                    <div className="relative h-[66px] w-full group">
                      <img
                        src={photoUrl}
                        alt={label}
                        className="h-full w-full rounded-[8px] object-cover cursor-pointer"
                        onClick={() => handlePhotoClick(slotKey)}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(slotKey)}
                        className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                      >
                        <X className="h-3 w-3" strokeWidth={3} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handlePhotoClick(slotKey)}
                      className="flex h-[66px] w-full items-center justify-center rounded-[8px] border border-[#bcbcbc] bg-[#f8f8f8] text-[#9a9a9a] transition-colors hover:border-secondary hover:bg-[#f5faf9] hover:text-secondary"
                    >
                      <span className="flex flex-col items-center gap-0.5 text-[13px]">
                        <Camera className="h-6 w-6" />
                        Adicionar Foto
                      </span>
                    </button>
                  )}

                  <p className="mt-2 min-h-[40px] w-full text-center font-['Inter'] text-[13px] leading-tight text-[#333]">
                    {label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Extra photos preview */}
          {form.extraPhotos?.length > 0 && (
            <div className="mt-2 px-3 grid grid-cols-4 gap-x-3 gap-y-3">
              {form.extraPhotos.map((url, i) => (
                <div key={`extra-${i}`} className="relative h-[66px] w-full group">
                  <img
                    src={url}
                    alt={`Foto extra ${i + 1}`}
                    className="h-full w-full rounded-[8px] object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExtraPhoto(i)}
                    className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                  >
                    <X className="h-3 w-3" strokeWidth={3} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => extraPhotoInputRef.current?.click()}
              className="h-8 w-full max-w-[250px] rounded-[8px] border border-[#b4c2c8] bg-[#f1f4f6] px-1 font-['Inter'] text-[14px] text-[#555] shadow-none whitespace-nowrap hover:bg-[#e8edf0]"
            >
              + Adicionar mais fotos (opcional)
            </Button>
          </div>
        </div>

        <div className="mt-3 rounded-[4px] border border-[#d9d9d9] px-3 pt-3 pb-[8px] sm:px-4">
          <StepLabel>Vídeo do Imóvel</StepLabel>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
            {form.video ? (
              <div className="relative w-full sm:w-[200px] shrink-0 group">
                <video
                  src={form.video}
                  controls
                  className="h-[72px] w-full rounded-[10px] object-cover bg-[#ededed]"
                />
                <button
                  type="button"
                  onClick={handleRemoveVideo}
                  className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                >
                  <X className="h-3 w-3" strokeWidth={3} />
                </button>
              </div>
            ) : (
              <div className="flex h-[72px] w-full sm:w-[112px] shrink-0 items-center justify-center rounded-[10px] bg-[#ededed] text-secondary">
                <Play className="h-7 w-7 fill-current" />
              </div>
            )}
            <p className="max-w-full font-['Inter'] text-[14px] leading-tight text-foreground sm:max-w-[280px]">
              Envie um Vídeo curto de pelo menos <strong>1 minuto</strong> mostrando todo o imóvel.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleVideoClick}
            className="mt-3 h-[38px] rounded-[10px] border-[1px] border-[#111] bg-neutral px-4 font-['Poppins'] text-[16px] font-semibold text-[#333] shadow-none hover:bg-[#8f8f8f]"
          >
            {form.video ? "Trocar vídeo" : "Enviar vídeo"}
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
        <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)]">
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
                placeholder={"Digite o diferencial da localização do seu imóvel.\nEx: Próximo ao Centro"}
                value={form.highlight}
                onChange={(event) =>
                  setForm((current) => ({ ...current, highlight: event.target.value }))
                }
              />
            </div>
          </div>

          <div className="min-w-0 rounded-[4px] border border-[#d2d2d2] bg-[#eceff1] p-2.5">
            <StepLabel>Localização no Mapa</StepLabel>
            <div className="mt-1 h-[160px] min-w-0 overflow-hidden rounded-[8px] sm:h-[180px] xl:h-[220px]">
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
            <p className="mt-2 font-['Inter'] text-[14px] leading-snug text-[#222]">
              Confirme se o mapa corresponde ao endereço informado.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditing(!editing)}
              className="mt-1.5 h-8 rounded-[8px] border-[#9fb7c0] bg-[#f4f4f4] px-4 font-['Inter'] text-[13px] text-[#555] shadow-none hover:bg-[#ececec]"
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
            <div className="grid grid-cols-1 gap-1.5 md:grid-cols-[1fr_auto] md:gap-6 md:items-end">
              <TextField
                label="Valor do Aluguel (mensal)"
                placeholder="Ex: R$ 1.500"
                value={form.rent}
                onChange={(event) => setForm((current) => ({ ...current, rent: event.target.value }))}
              />
              <label className="flex shrink-0 items-center gap-2 pb-0 font-['Inter'] text-[16px] text-foreground md:pb-2">
                <input
                  type="checkbox"
                  checked={form.negotiable}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, negotiable: event.target.checked }))
                  }
                  className="h-5 w-5 rounded border-secondary accent-secondary"
                />
                Preço negociável?
              </label>
            </div>

            <div className="grid grid-cols-1 gap-1.5 md:grid-cols-[1fr_auto] md:gap-6 md:items-end">
              <TextField
                label="Condomínio"
                placeholder="R$ 0,00"
                value={form.condoFee}
                onChange={(event) =>
                  setForm((current) => ({ ...current, condoFee: event.target.value }))
                }
              />
              <label className="flex shrink-0 items-center gap-2 pb-0 font-['Inter'] text-[16px] text-foreground md:pb-2">
                <input
                  type="checkbox"
                  checked={form.condoIncluded}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, condoIncluded: event.target.checked }))
                  }
                  className="h-5 w-5 rounded border-secondary accent-secondary"
                />
                Já incluso no aluguel?
              </label>
            </div>

            <div className="grid grid-cols-1 gap-1.5 md:grid-cols-[1fr_auto] md:gap-6 md:items-end">
              <TextField
                label="IPTU"
                placeholder="R$ 0,00"
                value={form.iptuFee}
                onChange={(event) =>
                  setForm((current) => ({ ...current, iptuFee: event.target.value }))
                }
              />
              <label className="flex items-center gap-2 whitespace-nowrap pb-0 font-['Inter'] text-[16px] text-foreground md:pb-2">
                <input
                  type="checkbox"
                  checked={form.iptuIncluded}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, iptuIncluded: event.target.checked }))
                  }
                  className="h-5 w-5 rounded border-secondary accent-secondary"
                />
                Já incluso no aluguel?
              </label>
            </div>

            <div className="grid grid-cols-1 gap-1.5 md:grid-cols-[1fr_auto] md:gap-6 md:items-end">
              <TextField
                label="Outras taxas (se houver)"
                placeholder="Ex: Água, luz, Manutenção"
                value={form.otherFees}
                onChange={(event) =>
                  setForm((current) => ({ ...current, otherFees: event.target.value }))
                }
              />
              <label className="flex shrink-0 items-center gap-2 pb-0 font-['Inter'] text-[16px] text-foreground md:pb-2">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-secondary accent-secondary"
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
                      <label key={option} className="flex items-center gap-3 font-['Inter'] text-[14px] text-foreground">
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-[4px] border ${active
                            ? "border-secondary bg-secondary text-white"
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
              Valores como "0" ou "1.111" ou similares prejudicam a qualidade do anúncio e
              dificultam sua aprovação.
            </p>
          </TipCard>
        </div>
      </Shell>
    </div>
  );
}

function getFirstPhotoUrl(form) {
  if (form.photos && form.photos["Capa-0"]) {
    return form.photos["Capa-0"];
  }
  return "/assets/property_1.png";
}

function StepFivePanel({ form, setForm }) {
  const firstPhoto = getFirstPhotoUrl(form);
  const activeRooms = form.rooms?.filter((r) => r.value > 0) || [];

  return (
    <div className="grid min-w-0 gap-2 lg:grid-cols-2">
      <Shell className="p-2 sm:p-3">
        <div className="mt-0 rounded-[4px] border border-[#d9d9d9] px-6 pt-1 pb-6">
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

      <Shell className="p-2 sm:p-3">
        <p className="text-center font-['Inter'] text-[14px] text-[#111]">
          Veja como seu anúncio será exibido para os usuários
        </p>
        <div className="mt-4 flex justify-center">
          <div className="w-full max-w-[300px]">
            <CardImovel
              imagem={firstPhoto}
              titulo={form.title || "Título do anúncio"}
              descricao={form.description || "Descrição do anúncio aparecerá aqui..."}
              preco={form.rent || "2.900"}
              area={form.area || "60"}
              rooms={activeRooms}
              endereco={form.street || "Rua Ipê Amarelo, 128 – Jardim das Flores"}
            />
          </div>
        </div>
      </Shell>
    </div>
  );
}



function StepSixPanel({ setStep, form }) {
  const firstPhoto = getFirstPhotoUrl(form);
  const activeRooms = form.rooms?.filter((r) => r.value > 0) || [];

  return (
    <div className="grid min-w-0 gap-2 lg:grid-cols-2">
      <Shell className="p-2 sm:p-3">
        <StepLabel>Informações preenchidas</StepLabel>
        <div className="mt-2 rounded-[4px] border border-[#bfc7cb] p-3 pb-0 pt-2">
          <div className="space-y-3 font-['Inter'] text-[15px] text-foreground">
            {[
              "Informações básicas concluídas",
              "Localização Confirmada",
              "Fotos Adicionadas",
              "Vídeo Enviado",
              "Preço Definido",
            ].map((item) => (
              <div key={item} className="flex items-center gap-4">
                <Check className="h-5 w-5 text-secondary" strokeWidth={2.6} />
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
          <div className="mt-2 rounded-[4px] border border-[#bfc7cb] p-2.5 font-['Inter'] text-[16px] text-secondary pb-4">
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

      <Shell className="p-2 sm:p-3 pb-[2px]">
        <p className="text-center font-['Inter'] text-[16px] text-[#111]">
          Veja como seu anúncio será exibido para os usuários
        </p>
        <div className="mt-4 flex justify-center">
          <div className="w-full max-w-[300px]">
            <CardImovel
              imagem={firstPhoto}
              titulo={form.title || "Título do anúncio"}
              descricao={form.description || "Descrição do anúncio aparecerá aqui..."}
              preco={form.rent || "2.900"}
              area={form.area || "60"}
              rooms={activeRooms}
              endereco={form.street || "Rua Ipê Amarelo, 128 – Jardim das Flores"}
            />
          </div>
        </div>
      </Shell>
    </div>
  );
}

export function CadastroImovel() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);

  const goBack = () => setStep((current) => Math.max(0, current - 1));
  const goNext = () => {
    if (step === 2) {
      const requiredSlots = getRequiredPhotoSlots(form);
      const missingPhotos = requiredSlots.some((label, i) => {
        const slotKey = `${label}-${i}`;
        return !form.photos[slotKey];
      });

      if (missingPhotos) {
        alert("Por favor, adicione todas as fotos obrigatórias (incluindo a Capa) antes de prosseguir.");
        return;
      }
      if (!form.video) {
        alert("Por favor, envie o vídeo obrigatório do imóvel antes de prosseguir.");
        return;
      }
    }
    if (step === 3) {
      if (!form.cep.trim() || !form.street.trim() || !form.neighborhood.trim()) {
        alert("Por favor, preencha os campos obrigatórios de localização (CEP, Rua e Bairro) antes de prosseguir.");
        return;
      }
    }
    if (step === 4) {
      if (!form.rent.trim()) {
        alert("Por favor, informe o Valor do Aluguel antes de prosseguir.");
        return;
      }
    }
    setStep((current) => Math.min(maxStep, current + 1));
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#eef2f5] px-3 py-2 sm:px-4">
      <div className="mx-auto w-full min-w-0 max-w-7xl">
        <MenuLogin />

        <div className="mt-1 min-w-0">
          <div className="flex min-w-0 flex-col">
            <Shell className={`w-full overflow-x-hidden px-2 sm:px-3 ${step === 0
              ? "py-3 sm:py-4"
              : "pt-3 pb-1 sm:pt-4 sm:pb-1"
              }`}>
              {step === 0 ? (
                <div className="grid min-w-0 gap-6 pb-8 md:grid-cols-[1fr_minmax(0,0.8fr)] lg:items-center lg:gap-6">
                  <div className="min-w-0 max-w-[520px]">
                    <h2 className="font-['Poppins'] text-[18px] font-semibold leading-tight text-secondary sm:text-[22px]">
                      Anuncie seu imóvel de forma <span className="text-secondary underline decoration-4 underline-offset-4">simples</span> e <span className="text-secondary underline decoration-4 underline-offset-4">rápida</span>!
                    </h2>

                    <p className="mt-2 font-['Inter'] text-[14px] font-semibold text-secondary">
                      Tudo guiado passo a passo.
                    </p>
                    <p className="mt-2 font-['Inter'] text-[14px] text-[#111]">Leva de 3 a 5 minutos.</p>
                    <p className="mt-1 font-['Inter'] text-[15px] text-[#111]">
                      Anúncios completos recebem até 3x mais contatos.
                    </p>

                    <p className="mt-2 font-['Inter'] text-[14px] text-[#111]">
                      Estratégias para <span className="text-secondary underline decoration-2 underline-offset-4">reduzir curiosos</span>
                    </p>

                    <p className="mt-1 max-w-[460px] font-['Inter'] text-[14px] leading-[1.5] text-[#555]">
                      Para melhor experiência no seu anúncio, pediremos um vídeo de no mínimo <strong className="text-[#111]">1 minuto</strong> do seu imóvel.
                    </p>

                    <Button
                      type="button"
                      onClick={goNext}
                      className="mt-3 h-[42px] rounded-[10px] bg-secondary px-3 font-['Poppins'] text-[16px] font-semibold text-white shadow-[0_3px_8px_rgba(0,0,0,0.2)] hover:bg-primary"
                    >
                      Quero anunciar <ChevronRight className="ml-1 h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex min-w-0 flex-col items-center justify-center gap-2">
                    <img
                      src="/assets/Casaimovel.png"
                      alt="Casa para anúncio"
                      className="w-[200px] max-w-full object-contain"
                    />

                    <div className="flex w-full max-w-[220px] flex-col items-center space-y-1 font-['Inter'] text-[14px] text-[#1f645d]">
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
                  <StepTwoPanel form={form} setForm={setForm} />
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
                      className="mx-auto mt-2 flex h-9 lg:h-10 w-full max-w-xs sm:w-auto sm:min-w-[200px] items-center justify-center gap-2 rounded-[6px] bg-secondary px-6 font-['Poppins'] text-[15px] font-semibold text-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-colors hover:bg-primary"
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
        </div>
      </div>
    </main>
  );
}