import { useEffect, useRef, useState } from "react";
import {
  MessageCircle,
  ArrowLeft,
  Send,
  Paperclip,
  User,
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  Check,
  CheckCheck,
} from "lucide-react";

const IMOVEL_MOCK = {
  id: "imv-1024",
  titulo: "Apartamento 2 quartos - Centro",
  endereco: "Rua das Flores, 123 - Centro, Teresina - PI",
  preco: 1450,
  quartos: 2,
  banheiros: 1,
  areaM2: 68,
  imagem:
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
};

const LOCADOR_MOCK = { id: "loc-001", nome: "João Afonso" };
const USUARIO_MOCK = { id: "usr-jose", nome: "José" };

// Histórico simulado
const HISTORICO_MOCK = [
  {
    id: "h1",
    autor: "usuario",
    texto: "Olá! Tenho interesse no imóvel anunciado. Ele ainda está disponível?",
    hora: "12:30",
    grupo: "21 de julho",
    status: "entregue",
  },
  {
    id: "h2",
    autor: "locador",
    texto: "Olá! Sim, o imóvel está disponível. Posso te passar mais informações?",
    hora: "12:35",
    grupo: "21 de julho",
  },
  {
    id: "h3",
    autor: "usuario",
    texto: "Gostaria de saber quais são as formas de pagamento do aluguel.",
    hora: "12:45",
    grupo: "21 de julho",
    status: "entregue",
  },
];

// Respostas automáticas do locador — usadas em rotação para simular a conversa
const respostas_locador = [
  "Claro! Aceitamos pagamento via boleto, PIX ou transferência bancária.",
  "Posso agendar uma visita para você conhecer o imóvel pessoalmente, se quiser.",
  "O contrato costuma ser de 12 meses, com possibilidade de renovação.",
  "Fico à disposição para tirar qualquer outra dúvida sobre o imóvel!",
];

const contatoService = {
  enviarMensagem: (payload) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...payload, id: crypto.randomUUID(), status: "enviada" });
      }, 400);
    }),
};

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  });
}

function horaAtual() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function CartaoImovel({ imovel }) {
  return (
    <div className="flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-2.5">
      <img
        src={imovel.imagem}
        alt={imovel.titulo}
        className="h-11 w-11 flex-shrink-0 rounded-lg object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-800">{imovel.titulo}</p>
        <p className="truncate text-xs text-gray-500">{imovel.endereco}</p>
      </div>
      <p className="flex-shrink-0 text-sm font-bold text-teal-700">
        {formatarPreco(imovel.preco)}
        <span className="text-[11px] font-normal text-gray-500">/mês</span>
      </p>
    </div>
  );
}


function Avatar({ tamanho = 36, preenchido = false }) {
  return (
    <div
      style={{ width: tamanho, height: tamanho }}
      className={`flex flex-shrink-0 items-center justify-center rounded-full border-2 border-white shadow-sm ${
        preenchido ? "bg-teal-700 text-white" : "border-teal-300 bg-teal-50 text-teal-700"
      }`}
    >
      <User size={tamanho * 0.5} />
    </div>
  );
}

function DivisorData({ texto }) {
  return (
    <div className="my-4 flex items-center justify-center">
      <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-500">
        {texto}
      </span>
    </div>
  );
}

function MensagemChat({ mensagem, ehUsuario }) {
  return (
    <div className={`flex flex-col ${ehUsuario ? "items-end" : "items-start"}`}>
      <div className="z-10 -mb-3">
        <Avatar tamanho={32} preenchido />
      </div>
      <div
        className={`max-w-[75%] rounded-xl px-3.5 pb-2.5 pt-4 text-sm leading-relaxed ${
          ehUsuario ? "bg-teal-50 text-gray-800" : "bg-gray-100 text-gray-800"
        }`}
      >
        <p>{mensagem.texto}</p>
      </div>
      <div className="mt-1 flex items-center gap-1 px-1 text-[11px] text-gray-400">
        <span>{mensagem.hora}</span>
        {ehUsuario &&
          (mensagem.status === "entregue" ? (
            <CheckCheck size={13} className="text-teal-600" aria-label="Entregue" />
          ) : (
            <Check size={13} aria-label="Enviado" />
          ))}
      </div>
    </div>
  );
}

function DigitandoIndicador() {
  return (
    <div className="flex flex-col items-start">
      <div className="z-10 -mb-3">
        <Avatar tamanho={32} preenchido />
      </div>
      <div className="flex items-center gap-1 rounded-xl bg-gray-100 px-4 pb-2.5 pt-4">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
      </div>
    </div>
  );
}

function ChatContato({ imovel, locador, usuario, aoVoltar }) {
  const [conversa, setConversa] = useState(HISTORICO_MOCK);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [locadorDigitando, setLocadorDigitando] = useState(false);
  const [toast, setToast] = useState("");
  const [respostaIndice, setRespostaIndice] = useState(0);
  const scrollRef = useRef(null);
  const primeiraMensagemHoje = useRef(true);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversa, locadorDigitando]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  async function handleEnviar(e) {
    e.preventDefault();
    const texto = novaMensagem.trim();
    if (!texto) return;

    const id = crypto.randomUUID();
    setConversa((prev) => [
      ...prev,
      { id, autor: "usuario", texto, hora: horaAtual(), grupo: "Hoje", status: "enviado" },
    ]);
    setNovaMensagem("");

    await contatoService.enviarMensagem({
      imovelId: imovel.id,
      locadorId: locador.id,
      autorId: usuario.id,
      texto,
    });

    if (primeiraMensagemHoje.current) {
      setToast("Mensagem enviada com sucesso!");
      primeiraMensagemHoje.current = false;
    }

    setTimeout(() => {
      setConversa((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: "entregue" } : m))
      );
    }, 500);

    // Simula o locador respondendo, para deixar o chat interativo
    setTimeout(() => setLocadorDigitando(true), 900);
    setTimeout(() => {
      setLocadorDigitando(false);
      setConversa((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          autor: "locador",
          texto: respostas_locador[respostaIndice % resposta_locador.length],
          hora: horaAtual(),
          grupo: "Hoje",
        },
      ]);
      setRespostaIndice((i) => i + 1);
    }, 2300);
  }

  let ultimoGrupo = null;

  return (
    <div className="flex h-[100dvh] w-full flex-col bg-white sm:mx-auto sm:h-[85vh] sm:max-w-2xl sm:overflow-hidden sm:rounded-2xl sm:border sm:border-gray-100 sm:shadow-lg">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={aoVoltar}
            aria-label="Voltar para o imóvel"
            className="rounded-full p-1.5 text-gray-500 transition hover:bg-gray-100"
          >
            <ArrowLeft size={19} />
          </button>
          <span className="rounded-full bg-teal-800 px-3 py-1 text-sm font-semibold text-white">
            Aluguel<span className="text-teal-300">360</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-gray-500 sm:inline">Olá, {usuario.nome}!</span>
          <Avatar tamanho={34} />
        </div>
      </div>

      {/* Contato */}
      <div className="flex items-center gap-2.5 bg-gray-50 px-4 py-3">
        <Avatar tamanho={34} />
        <p className="font-semibold text-gray-800">{locador.nome}</p>
      </div>

      {/* Informações do imóvel associadas ao contato */}
      <CartaoImovel imovel={imovel} />

      {/* Corpo do chat */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {conversa.map((m) => {
          const mostrarDivisor = m.grupo !== ultimoGrupo;
          ultimoGrupo = m.grupo;
          return (
            <div key={m.id}>
              {mostrarDivisor && <DivisorData texto={m.grupo} />}
              <MensagemChat mensagem={m} ehUsuario={m.autor === "usuario"} />
            </div>
          );
        })}
        {locadorDigitando && <DigitandoIndicador />}
      </div>

      {/* Formulário de mensagem (campo de composição do chat) */}
      <form
        onSubmit={handleEnviar}
        className="flex items-center gap-2 border-t border-gray-100 px-3 py-3"
      >
        <button
          type="button"
          className="p-2 text-gray-400 hover:text-gray-600"
          aria-label="Anexar arquivo"
          title="Em breve"
          disabled
        >
          <Paperclip size={18} />
        </button>
        <input
          type="text"
          value={novaMensagem}
          onChange={(e) => setNovaMensagem(e.target.value)}
          placeholder="Escreva ao vendedor"
          aria-label="Escreva sua mensagem"
          className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-teal-500"
        />
        <button
          type="submit"
          disabled={!novaMensagem.trim()}
          aria-label="Enviar mensagem"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal-600 text-white transition hover:bg-teal-700 disabled:opacity-40"
        >
          <Send size={16} />
        </button>
      </form>

      {/* Confirmação visual de envio */}
      {toast && (
        <div className="pointer-events-none absolute left-1/2 top-16 -translate-x-1/2 rounded-full bg-gray-900/90 px-4 py-2 text-xs font-medium text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

export function BotaoEntrarEmContato({ onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 active:scale-[0.98] ${className}`}
    >
      <MessageCircle size={18} />
      Entrar em Contato
    </button>
  );
}

export default function PaginaImovel({
  imovel = IMOVEL_MOCK,
  locador = LOCADOR_MOCK,
  usuario = USUARIO_MOCK,
}) {
  const [tela, setTela] = useState("imovel"); 

  if (tela === "chat") {
    return (
      <div className="relative min-h-screen bg-gray-100 sm:flex sm:items-center sm:justify-center sm:py-8">
        <ChatContato
          imovel={imovel}
          locador={locador}
          usuario={usuario}
          aoVoltar={() => setTela("imovel")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-white shadow-sm">
        <img
          src={imovel.imagem}
          alt={imovel.titulo}
          className="h-64 w-full object-cover sm:h-80"
        />

        <div className="p-5 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{imovel.titulo}</h1>
              <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                <MapPin size={14} />
                {imovel.endereco}
              </p>
            </div>
            <p className="text-2xl font-bold text-teal-700">
              {formatarPreco(imovel.preco)}
              <span className="text-sm font-normal text-gray-500">/mês</span>
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-4 border-y border-gray-100 py-4 text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <BedDouble size={16} className="text-teal-600" />
              {imovel.quartos} quartos
            </span>
            <span className="flex items-center gap-1.5">
              <Bath size={16} className="text-teal-600" />
              {imovel.banheiros} banheiro
            </span>
            <span className="flex items-center gap-1.5">
              <Ruler size={16} className="text-teal-600" />
              {imovel.areaM2} m²
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Avatar tamanho={44} />
              <div>
                <p className="text-xs text-gray-400">Anunciado por</p>
                <p className="font-semibold text-gray-800">{locador.nome}</p>
              </div>
            </div>

            <BotaoEntrarEmContato
              onClick={() => setTela("chat")}
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
