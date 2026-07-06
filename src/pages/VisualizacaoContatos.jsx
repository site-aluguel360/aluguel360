
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Search,
  Paperclip,
  Send,
  User,
  Home,
  Inbox,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const COLORS = {
  primary: "#0F766E",
  primaryDark: "#0B5B54",
  primarySoft: "#E6F2F0",
  bubble: "#ECEBF7",
  bubbleText: "#4B4B6A",
  border: "#E5E7EB",
  bg: "#F5F6F8",
  card: "#FFFFFF",
  textMain: "#1F2937",
  textMuted: "#6B7280",
  textSoft: "#9CA3AF",
};

const FONT = `'Outfit', 'Inter', system-ui, -apple-system, sans-serif`;

const MOCK_IMOVEIS = [
  {
    id: "im-1",
    titulo: "Apartamento Moderno - Centro",
    endereco: "Rua Barão do Rio Branco, 476 - Curitiba/PR",
    foto: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80",
    preco: 1900,
    contatos: [
      {
        id: "c-1",
        nome: "João Afonso",
        email: "joao.afonso@email.com",
        telefone: "(41) 99123-4567",
        avatar: "JA",
        naoLidas: 2,
        ultimaMensagem: "Gostaria de saber quais são as formas de pagamento do aluguel.",
        ultimaData: "12:45",
        mensagens: [
          { id: 1, autor: "interessado", texto: "Olá! Tenho interesse no imóvel anunciado. Ele ainda está disponível?", hora: "12:30", data: "21 de julho" },
          { id: 2, autor: "locador", texto: "Olá! Sim, o imóvel está disponível. Posso te passar mais informações?", hora: "12:35", data: "21 de julho" },
          { id: 3, autor: "interessado", texto: "Gostaria de saber quais são as formas de pagamento do aluguel.", hora: "12:45", data: "21 de julho" },
        ],
      },
      {
        id: "c-2",
        nome: "Marina Costa",
        email: "marina.costa@email.com",
        telefone: "(41) 98876-1122",
        avatar: "MC",
        naoLidas: 0,
        ultimaMensagem: "Perfeito, muito obrigada pela atenção!",
        ultimaData: "Ontem",
        mensagens: [
          { id: 1, autor: "interessado", texto: "Boa tarde, o imóvel aceita pet?", hora: "10:12", data: "20 de julho" },
          { id: 2, autor: "locador", texto: "Boa tarde Marina, sim aceitamos pets de pequeno porte.", hora: "10:40", data: "20 de julho" },
          { id: 3, autor: "interessado", texto: "Perfeito, muito obrigada pela atenção!", hora: "10:42", data: "20 de julho" },
        ],
      },
    ],
  },
  {
    id: "im-2",
    titulo: "Casa Jardim das Flores",
    endereco: "Rua Ipê Amarelo, 125 - Jardim das Flores",
    foto: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80",
    preco: 2900,
    contatos: [
      {
        id: "c-3",
        nome: "Rafael Nogueira",
        email: "rafael.n@email.com",
        telefone: "(41) 99000-8877",
        avatar: "RN",
        naoLidas: 1,
        ultimaMensagem: "Posso agendar uma visita ainda essa semana?",
        ultimaData: "09:20",
        mensagens: [
          { id: 1, autor: "interessado", texto: "Olá, a casa tem quintal fechado?", hora: "09:05", data: "22 de julho" },
          { id: 2, autor: "locador", texto: "Olá Rafael, sim, o quintal é murado e cercado.", hora: "09:10", data: "22 de julho" },
          { id: 3, autor: "interessado", texto: "Posso agendar uma visita ainda essa semana?", hora: "09:20", data: "22 de julho" },
        ],
      },
    ],
  },
];

const START_EMPTY = false;

function Avatar({ iniciais, size = 40, bg = COLORS.primarySoft, color = COLORS.primary }) {
  return (
    <div
      data-testid="avatar-iniciais"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: size * 0.38,
        flexShrink: 0,
      }}
    >
      {iniciais}
    </div>
  );
}




function EstadoVazio() {
  return (
    <div
      data-testid="empty-state"
      style={{
        background: COLORS.card,
        border: `1px dashed ${COLORS.border}`,
        borderRadius: 16,
        padding: "56px 24px",
        textAlign: "center",
        color: COLORS.textMuted,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: COLORS.primarySoft,
          color: COLORS.primary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
        }}
      >
        <Inbox size={34} />
      </div>
      <h3 style={{ color: COLORS.textMain, fontSize: 18, fontWeight: 700, margin: 0 }}>
        Nenhum contato recebido ainda
      </h3>
      <p style={{ margin: "8px auto 0", maxWidth: 380, fontSize: 14, lineHeight: 1.5 }}>
        Quando um interessado entrar em contato pelos seus anúncios, a conversa aparecerá aqui de forma centralizada.
      </p>
    </div>
  );
}


function EstadoCarregando() {
  const shimmer = {
    background: "linear-gradient(90deg, #eee 0%, #f5f5f5 50%, #eee 100%)",
    backgroundSize: "200% 100%",
    animation: "aluguel360-shimmer 1.4s infinite",
    borderRadius: 8,
  };
  return (
    <div data-testid="loading-state" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <style>{`
        @keyframes aluguel360-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      {[1, 2].map((g) => (
        <div
          key={g}
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 14,
            padding: 16,
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
            <div style={{ ...shimmer, width: 56, height: 56, borderRadius: 10 }} />
            <div style={{ flex: 1 }}>
              <div style={{ ...shimmer, height: 14, width: "60%", marginBottom: 8 }} />
              <div style={{ ...shimmer, height: 10, width: "40%" }} />
            </div>
          </div>
          {[1, 2].map((c) => (
            <div key={c} style={{ display: "flex", gap: 12, padding: "10px 0" }}>
              <div style={{ ...shimmer, width: 40, height: 40, borderRadius: "50%" }} />
              <div style={{ flex: 1 }}>
                <div style={{ ...shimmer, height: 12, width: "35%", marginBottom: 6 }} />
                <div style={{ ...shimmer, height: 10, width: "70%" }} />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}


function CardContato({ contato, onAbrir }) {
  return (
    <button
      data-testid={`contato-card-${contato.id}`}
      onClick={() => onAbrir(contato)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        background: "#fff",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        cursor: "pointer",
        textAlign: "left",
        transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = COLORS.primary;
        e.currentTarget.style.boxShadow = "0 4px 14px rgba(15,118,110,0.10)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = COLORS.border;
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <Avatar iniciais={contato.avatar} size={44} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
          <strong style={{ color: COLORS.textMain, fontSize: 15 }}>{contato.nome}</strong>
          <span style={{ fontSize: 12, color: COLORS.textSoft, flexShrink: 0 }}>{contato.ultimaData}</span>
        </div>
        <p
          style={{
            margin: "4px 0 0",
            fontSize: 13,
            color: COLORS.textMuted,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {contato.ultimaMensagem}
        </p>
      </div>
      {contato.naoLidas > 0 && (
        <span
          data-testid={`badge-nao-lidas-${contato.id}`}
          style={{
            background: COLORS.primary,
            color: "#fff",
            fontSize: 11,
            fontWeight: 700,
            borderRadius: 999,
            minWidth: 22,
            height: 22,
            padding: "0 7px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {contato.naoLidas}
        </span>
      )}
    </button>
  );
}


function GrupoImovel({ imovel, onAbrirContato }) {
  const [aberto, setAberto] = useState(true);
  return (
    <div
      data-testid={`grupo-imovel-${imovel.id}`}
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 14,
        padding: 14,
      }}
    >
      <button
        onClick={() => setAberto((a) => !a)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <img
          src={imovel.foto}
          alt={imovel.titulo}
          style={{ width: 56, height: 56, borderRadius: 10, objectFit: "cover", flexShrink: 0 }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <Home size={14} style={{ color: COLORS.primary }} />
            <strong style={{ color: COLORS.textMain, fontSize: 15 }}>{imovel.titulo}</strong>
          </div>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: COLORS.textMuted }}>{imovel.endereco}</p>
          <span
            style={{
              display: "inline-block",
              marginTop: 6,
              fontSize: 12,
              fontWeight: 600,
              color: COLORS.primary,
              background: COLORS.primarySoft,
              padding: "2px 8px",
              borderRadius: 999,
            }}
          >
            {imovel.contatos.length} interessado{imovel.contatos.length > 1 ? "s" : ""}
          </span>
        </div>
        {aberto ? (
          <ChevronUp size={20} style={{ color: COLORS.textMuted }} />
        ) : (
          <ChevronDown size={20} style={{ color: COLORS.textMuted }} />
        )}
      </button>

      {aberto && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
          {imovel.contatos.map((c) => (
            <CardContato key={c.id} contato={c} onAbrir={(ct) => onAbrirContato(ct, imovel)} />
          ))}
        </div>
      )}
    </div>
  );
}


function ListaContatos({ imoveis, onAbrirContato, busca, setBusca }) {
  const imoveisFiltrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return imoveis;
    return imoveis
      .map((im) => ({
        ...im,
        contatos: im.contatos.filter(
          (c) =>
            c.nome.toLowerCase().includes(q) ||
            im.titulo.toLowerCase().includes(q) ||
            c.ultimaMensagem.toLowerCase().includes(q)
        ),
      }))
      .filter((im) => im.contatos.length > 0);
  }, [imoveis, busca]);

  const total = imoveisFiltrados.reduce((acc, im) => acc + im.contatos.length, 0);

  return (
    <div data-testid="lista-contatos" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <MessageCircle size={22} style={{ color: COLORS.primary }} />
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: COLORS.textMain }}>
            Contatos recebidos
          </h1>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: COLORS.textMuted }}>
          Acompanhe as solicitações dos interessados nos seus imóveis.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "#fff",
          border: `1px solid ${COLORS.border}`,
          borderRadius: 10,
          padding: "0 12px",
          height: 42,
        }}
      >
        <Search size={17} style={{ color: COLORS.textSoft }} />
        <input
          data-testid="input-busca-contatos"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por interessado, imóvel ou mensagem..."
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: 14,
            color: COLORS.textMain,
            fontFamily: FONT,
          }}
        />
      </div>

      {total === 0 ? (
        <EstadoVazio />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {imoveisFiltrados.map((im) => (
            <GrupoImovel key={im.id} imovel={im} onAbrirContato={onAbrirContato} />
          ))}
        </div>
      )}
    </div>
  );
}


function Mensagem({ msg }) {
  const eu = msg.autor === "locador";
  return (
    <div
      data-testid={`mensagem-${msg.id}`}
      style={{
        display: "flex",
        justifyContent: eu ? "flex-end" : "flex-start",
        gap: 10,
        marginBottom: 18,
      }}
    >
      {!eu && <Avatar iniciais="" size={34} bg="#fff" color={COLORS.textSoft} />}
      <div
        style={{
          maxWidth: "72%",
          display: "flex",
          flexDirection: "column",
          alignItems: eu ? "flex-end" : "flex-start",
        }}
      >
        <div
          style={{
            background: COLORS.bubble,
            color: COLORS.bubbleText,
            padding: "12px 16px",
            borderRadius: 12,
            fontSize: 14,
            lineHeight: 1.45,
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          }}
        >
          {msg.texto}
        </div>
        <span style={{ fontSize: 11, color: COLORS.textSoft, marginTop: 4 }}>{msg.hora}</span>
      </div>
      {eu && <Avatar iniciais="" size={34} bg={COLORS.primarySoft} color={COLORS.primary} />}
    </div>
  );
}

function ConversaHeader({ contato, imovel, onVoltar }) {
  return (
    <div
      data-testid="conversa-header"
      style={{
        background: "#fff",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 14,
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <button
        data-testid="btn-voltar-lista"
        onClick={onVoltar}
        aria-label="Voltar"
        style={{
          background: COLORS.primarySoft,
          color: COLORS.primary,
          border: "none",
          borderRadius: 10,
          width: 38,
          height: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <ArrowLeft size={18} />
      </button>
      <Avatar iniciais={contato.avatar} size={46} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <strong style={{ fontSize: 17, color: COLORS.textMain, display: "block" }}>
          {contato.nome}
        </strong>
        <span style={{ fontSize: 12, color: COLORS.textMuted }}>
          {contato.email} • {contato.telefone}
        </span>
      </div>
      <div
        data-testid="conversa-imovel-info"
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          background: COLORS.primarySoft,
          borderRadius: 10,
          padding: "6px 10px",
          maxWidth: 260,
        }}
      >
        <img
          src={imovel.foto}
          alt={imovel.titulo}
          style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }}
        />
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: COLORS.primary,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 180,
            }}
          >
            {imovel.titulo}
          </div>
          <div style={{ fontSize: 11, color: COLORS.textMuted }}>
            R$ {imovel.preco.toLocaleString("pt-BR")}/mês
          </div>
        </div>
      </div>
    </div>
  );
}

function TelaConversa({ contato, imovel, onVoltar, onEnviar }) {
  const [texto, setTexto] = useState("");

  const grupos = useMemo(() => {
    const map = new Map();
    contato.mensagens.forEach((m) => {
      if (!map.has(m.data)) map.set(m.data, []);
      map.get(m.data).push(m);
    });
    return Array.from(map.entries());
  }, [contato.mensagens]);

  function submeter(e) {
    e?.preventDefault?.();
    const t = texto.trim();
    if (!t) return;
    onEnviar(t);
    setTexto("");
  }

  return (
    <div data-testid="tela-conversa" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <ConversaHeader contato={contato} imovel={imovel} onVoltar={onVoltar} />

      <div
        data-testid="area-mensagens"
        style={{
          background: "#fff",
          border: `1px solid ${COLORS.border}`,
          borderRadius: 14,
          padding: "20px 20px 8px",
          minHeight: 380,
          maxHeight: "58vh",
          overflowY: "auto",
        }}
      >
        {grupos.map(([data, msgs]) => (
          <div key={data}>
            <div style={{ display: "flex", justifyContent: "center", margin: "6px 0 18px" }}>
              <span
                style={{
                  fontSize: 12,
                  color: COLORS.textSoft,
                  background: COLORS.bg,
                  padding: "4px 12px",
                  borderRadius: 999,
                }}
              >
                {data}
              </span>
            </div>
            {msgs.map((m) => (
              <Mensagem key={m.id} msg={m} />
            ))}
          </div>
        ))}
      </div>

      <form
        data-testid="form-resposta"
        onSubmit={submeter}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "#fff",
          border: `1px solid ${COLORS.border}`,
          borderRadius: 999,
          padding: "6px 8px 6px 16px",
        }}
      >
        <button
          type="button"
          aria-label="Anexar arquivo"
          data-testid="btn-anexar"
          style={{
            background: "transparent",
            border: "none",
            color: COLORS.textMuted,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Paperclip size={20} />
        </button>
        <input
          data-testid="input-resposta"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escreva ao interessado"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: 14,
            color: COLORS.textMain,
            fontFamily: FONT,
            background: "transparent",
            padding: "10px 4px",
          }}
        />
        <button
          type="submit"
          data-testid="btn-enviar-mensagem"
          aria-label="Enviar mensagem"
          disabled={!texto.trim()}
          style={{
            background: texto.trim() ? COLORS.primary : COLORS.primarySoft,
            color: texto.trim() ? "#fff" : COLORS.primary,
            border: "none",
            width: 44,
            height: 44,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: texto.trim() ? "pointer" : "not-allowed",
            transition: "background 0.15s ease",
            flexShrink: 0,
          }}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

export default function ContatosRecebidos() {
  const [imoveis, setImoveis] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [view, setView] = useState("lista");
  const [contatoAtivo, setContatoAtivo] = useState(null);
  const [imovelAtivo, setImovelAtivo] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setImoveis(START_EMPTY ? [] : MOCK_IMOVEIS);
      setCarregando(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  function abrirContato(contato, imovel) {
    setContatoAtivo(contato);
    setImovelAtivo(imovel);
    setView("conversa");
  }

  function voltarLista() {
    setView("lista");
    setContatoAtivo(null);
    setImovelAtivo(null);
  }

  function enviarMensagem(texto) {
    setImoveis((prev) =>
      prev.map((im) => {
        if (im.id !== imovelAtivo.id) return im;
        return {
          ...im,
          contatos: im.contatos.map((c) => {
            if (c.id !== contatoAtivo.id) return c;
            const nova = {
              id: Date.now(),
              autor: "locador",
              texto,
              hora: new Date().toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              data: "Hoje",
            };
            const atualizado = {
              ...c,
              mensagens: [...c.mensagens, nova],
              ultimaMensagem: texto,
              ultimaData: nova.hora,
              naoLidas: 0,
            };
            setContatoAtivo(atualizado);
            return atualizado;
          }),
        };
      })
    );
  }

  return (
    <div
      data-testid="pagina-contatos-recebidos"
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        fontFamily: FONT,
        color: COLORS.textMain,
      }}
    >


      <main
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "24px 20px 60px",
        }}
      >
        {carregando ? (
          <EstadoCarregando />
        ) : view === "lista" ? (
          <ListaContatos
            imoveis={imoveis}
            onAbrirContato={abrirContato}
            busca={busca}
            setBusca={setBusca}
          />
        ) : (
          contatoAtivo &&
          imovelAtivo && (
            <TelaConversa
              contato={contatoAtivo}
              imovel={imovelAtivo}
              onVoltar={voltarLista}
              onEnviar={enviarMensagem}
            />
          )
        )}
      </main>

      <style>{`
        @media (max-width: 640px) {
          [data-testid="conversa-header"], { flex-wrap: wrap; }
          [data-testid="conversa-imovel-info"] ,{ max-width: 100% !important; width: 100%; }
          [data-testid="user-greeting"] ,{ display: none; }
        }
      `}</style>
    </div>
  );
}

export { ContatosRecebidos as VisualizacaoContatos };
