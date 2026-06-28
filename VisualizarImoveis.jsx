import { useState } from "react";
import {
  MapPin,Star,Heart,MessageCircle,Mail,Phone,Wifi,Car,Dumbbell,ShieldCheck,ChevronLeft,ChevronRight,BedDouble,Bath,Maximize2,Search,Menu,X,Send,PlayCircle,
} from "lucide-react"; //ícones

// dados
const imovel = {
  id: 1,
  nome: "Apartamento Moderno-Centro",
  tag: "Novo | A opção mais recomendada pelos usuários.",
  preco: 1900,
  endereco: "Rua Barão do Rio Branco, Bairro Cidade Nova, 476",
  cidade: "Cidade Curitiba-Paraná, 83540-000",
  descricao:
    "Um apartamento com 1 dormitório, sala com varanda, cozinha americana e área de serviço. Condomínio com portaria 24h e academia. Próximo ao metrô.",
  informacoesRelevantes:
    "Condomínio localizado no 3º andar. Limpeza das áreas comuns, inspeção no horário de silêncio e portaria 24h. Além disso, o locatário deve zelar pela manutenção e conservação do apartamento, preservando portas, janelas, pinturas e instalações.",
  area: 60,
  quartos: 1,
  banheiros: 1,
  despesas: {
    iptu: 230,
    garantia: "Caução",
    agua: 45,
    energia: 120,
    condominio: 390,
    manutencao: 100,
    seguroIncendio: 30,
  },
  // index 0 = vídeo (sem foto, mostra ícone play), demais = fotos
  midia: [
    { tipo: "video", thumb: null },
    { tipo: "foto",  thumb: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80" },
    { tipo: "foto",  thumb: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80" },
    { tipo: "foto",  thumb: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=80" },
    { tipo: "foto",  thumb: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=900&q=80" },
    { tipo: "foto",  thumb: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=80" },
    { tipo: "foto",  thumb: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=80" },
  ],
  fotoPrincipal: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80",
  avaliacaoMedia: 4,
  totalAvaliacoes: 1490,
  distribuicaoEstrelas: { 5: 60, 4: 55, 3: 30, 2: 15, 1: 8 },
  amenidades: [
    { icon: Wifi,        label: "Wi-Fi" },
    { icon: Car,         label: "Garagem" },
    { icon: Dumbbell,    label: "Academia" },
    { icon: ShieldCheck, label: "Portaria 24h" },
  ],
};

const imoveisRelacionados = [
  {
    id: 2,
    nome: "Apartamento no Centro de floriano com dois qua",
    preco: 2900,
    area: 80,
    quartos: 1,
    endereco: "Rua Ipê Amarelo, 125 - Jardim das Flores",
    foto: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=500&q=80",
    avaliacao: 4,
  },
  {
    id: 3,
    nome: "Apartamento no Centro de floriano com dois qua",
    preco: 2900,
    area: 80,
    quartos: 1,
    endereco: "Rua Ipê Amarelo, 125 - Jardim das Flores",
    foto: "https://images.unsplash.com/photo-1469022563428-aa04fef9f5a2?w=500&q=80",
    avaliacao: 4,
  },
  {
    id: 4,
    nome: "Apartamento no Centro de floriano com dois qua",
    preco: 2900,
    area: 80,
    quartos: 1,
    endereco: "Rua Ipê Amarelo, 125 - Jardim das Flores",
    foto: "https://images.unsplash.com/photo-1432889490240-84df33d47091?w=500&q=80",
    avaliacao: 4,
  },
  {
    id: 5,
    nome: "Apartamento no Centro de floriano com dois qua",
    preco: 2900,
    area: 80,
    quartos: 1,
    endereco: "Rua Ipê Amarelo, 125 - Jardim das Flores",
    foto: "https://images.unsplash.com/photo-1560185008-a33f5c7b1844?w=500&q=80",
    avaliacao: 4,
  },
];
 
// comentários
const avaliacoesIniciais = [
  {
    id: 1,
    nome: "Dina Siqueira",
    estrelas: 4,
    texto: "Imóvel bem localizado e arejado. O atendimento foi rápido.",
    avatar: "DS",
  },
  {
    id: 2,
    nome: "Maria Silva",
    estrelas: 3,
    texto: "O apartamento é exatamente como nas fotos. Apenas o barulho da rua incomoda um pouco à noite.",
    avatar: "MS",
  },
  {
    id: 3,
    nome: "João Rodrigues",
    estrelas: 4,
    texto:
      "O imóvel é bem cuidado e correspondente ao que foi apresentado no anúncio. A localização é boa e facilita o acesso a serviços próximos. O processo de locação foi tranquilo e atendimento claro.",
    avatar: "JR",
  },
];

// auxiliares
function Estrelas({ valor, tamanho = 14 }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={tamanho}
          fill={i <= valor ? G : "none"}
          stroke={i <= valor ? G : "#d1d5db"}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}
//avatar do usuário
function Avatar({ iniciais }) {
  return (
    <div style={{
      width: 36, height: 36, borderRadius: "50%",
      backgroundColor: G, color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: 13, flexShrink: 0,
    }}>
      {iniciais}
    </div>
  );
}

// imóveis relacionados
function CardRelacionado({ im }) {
  const [fav, setFav] = useState(false);
  return (
    <div style={{
      background: "#fff", borderRadius: 12, overflow: "hidden",
      border: "1px solid #e5e7eb", boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
      cursor: "pointer", transition: "all 0.2s",
    }}>
      <div style={{ position: "relative" }}>
        <img src={im.foto} alt={im.nome} style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }} />
        <button
          onClick={() => setFav((f) => !f)}
          style={{ position: "absolute", top: 8, right: 8, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Heart size={13} fill={fav ? "#ef4444" : "none"} stroke={fav ? "#ef4444" : "#9ca3af"} />
        </button>
      </div>
      <div style={{ padding: "10px 12px" }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#111827", marginBottom: 4, lineHeight: 1.4 }}>{im.nome}</p>
        <Estrelas valor={im.avaliacao} tamanho={11} />
        <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, marginBottom: 6 }}>{im.endereco}</p>
        <p style={{ fontSize: 15, fontWeight: 800, color: G }}>R$ {im.preco.toLocaleString("pt-BR")}</p>
        <div style={{ display: "flex", gap: 10, marginTop: 4, fontSize: 11, color: "#9ca3af" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Maximize2 size={10} />{im.area}m²</span>
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}><BedDouble size={10} />{im.quartos} vaga</span>
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}><MapPin size={10} /></span>
        </div>
      </div>
    </div>
  );
}

// Componente principal da página
export default function ImovelDetalhes() {
  const [midiaAtiva, setMidiaAtiva]       = useState(1); // começa na primeira foto (index 1)
  const [favoritado, setFavoritado]       = useState(false);
  const [menuAberto, setMenuAberto]       = useState(false);
  const [novaAvaliacao, setNovaAvaliacao] = useState("");
  const [avaliacoes, setAvaliacoes]       = useState(avaliacoesIniciais);
  const [videoAberto, setVideoAberto]     = useState(false);

  const totalBarras =
    Object.values(imovel.distribuicaoEstrelas).reduce((a, b) => a + b, 0) || 1;

  const pctSatisfacao = Math.round(
    ((imovel.distribuicaoEstrelas[5] + imovel.distribuicaoEstrelas[4]) / totalBarras) * 100
  );

  const itemAtivo = imovel.midia[midiaAtiva];

  function anterior() {
    setMidiaAtiva((p) => (p === 0 ? imovel.midia.length - 1 : p - 1));
  }
  function proximo() {
    setMidiaAtiva((p) => (p === imovel.midia.length - 1 ? 0 : p + 1));
  }

  function enviarAvaliacao() {
    if (!novaAvaliacao.trim()) return;
    setAvaliacoes((prev) => [
      { id: Date.now(), nome: "Você", estrelas: 5, texto: novaAvaliacao.trim(), avatar: "VC" },
      ...prev,
    ]);
    setNovaAvaliacao("");
  }

  // Inline styles (economizar CSS externo)
  const s = {
    page:    { minHeight: "100vh", background: "#f0f2f5", fontFamily: "'Outfit', sans-serif", color: "#1f2937" },

    // Navbar
    nav:     { position: "sticky", top: 0, zIndex: 50, background: "#fff", borderBottom: `2px solid ${GL}`, boxShadow: "0 1px 6px rgba(0,0,0,0.07)" },
    navInner:{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", height: 56, display: "flex", alignItems: "center", gap: 12 },
    logo:    { display: "flex", alignItems: "center", gap: 0, textDecoration: "none", flexShrink: 0 },
    logoText:{ fontSize: 17, fontWeight: 800, color: "#fff", background: G, padding: "3px 8px", borderRadius: 8 },
    logoPin: { fontSize: 11, color: "#6b7280", display: "flex", alignItems: "center", gap: 3, marginTop: 1 },
    searchWrap:{ flex: 1, maxWidth: 420, display: "flex", alignItems: "center", border: "1px solid #e5e7eb", borderRadius: 10, padding: "0 12px", height: 36, background: "#f9fafb", gap: 8 },
    searchInput:{ flex: 1, border: "none", background: "transparent", fontSize: 13, outline: "none", color: "#374151" },
    navLinks:{ display: "flex", gap: 20, fontSize: 13, fontWeight: 500, color: "#6b7280" },
    navLink: { textDecoration: "none", color: "#6b7280", cursor: "pointer" },
    btnCad:  { fontSize: 13, fontWeight: 600, color: "#374151", border: "1.5px solid #d1d5db", borderRadius: 8, padding: "6px 16px", background: "#fff", cursor: "pointer" },
    btnEntr: { fontSize: 13, fontWeight: 600, color: "#fff", background: G, border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 },
    quero:   { fontSize: 11, color: G, textDecoration: "none", fontWeight: 600 },

    // Layout principal
    main:    { maxWidth: 1200, margin: "0 auto", padding: "24px 20px 60px" },

    // Seção
    galSection:{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" },

    // Coluna das thumbs
    thumbCol:{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 },

    // Foto principal
    mainPhoto:{ position: "relative", flex: 1, minWidth: 260, borderRadius: 12, overflow: "hidden", background: "#1f2937" },
    mainImg:  { width: "100%", height: 340, objectFit: "cover", display: "block" },
    arrow:    { position: "absolute", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.85)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" },

    // informações do card
    infoCard: { width: 280, flexShrink: 0, background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb" },

    // Botões de contato
    btnWpp:  { width: "100%", padding: "10px 0", background:"#32ad2e" , color: "#2e6b2a", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 },
    btnChat: { width: "100%", padding: "10px 0", background:"#33626a", color: "#fff", border: `1.5px solid ${G}`, borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 },
    btnMail: { width: "100%", padding: "10px 0", background: "#4b9189", color: "#fff", border: `1.5px solid ${G}`, borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },

    // Seção despesas + avaliação
    midSection:{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 20 },
    despCard:{ flex: 1, minWidth: 240, background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb", fontSize: 13 },
    ratingCard:{ flex: 1, minWidth: 240, background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" },

    // geral
    section: { marginTop: 28 },
    sectionTitle:{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 14 },

    // Cards imóveis relacionados
    relGrid:{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 },
    relCard:{ background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #e5e7eb", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", cursor: "pointer" },
    relImg: { width: "100%", height: 130, objectFit: "cover", display: "block" },

    // Avaliações
    avalList:{ display: "flex", flexDirection: "column", gap: 12 },
    avalCard:{ background: "#fff", borderRadius: 12, padding: "14px 16px", border: "1px solid #e5e7eb", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", maxWidth: 400 },
    avalInput:{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" },
    avalField:{ flex: 1, border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "10px 14px", fontSize: 13, outline: "none", color: "#374151" },
    avalBtn: { width: 40, height: 40, background: G, border: "none", borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },

    // Footer
    footer:{ background: "#fff", borderTop: `2px solid ${GL}`, marginTop: 40, padding: "20px 20px" },
    footerInner:{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 },

    // Modal vídeo
    overlay:{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" },
    videoBox:{ background: "#000", borderRadius: 12, padding: 20, width: "min(640px, 90vw)", position: "relative" },
  };

  // Thumbnail de cada item de mídia
  function Thumb({ item, index }) {
    const ativo = index === midiaAtiva;
    if (item.tipo === "video") {
      return (
        <button
          onClick={() => { setMidiaAtiva(index); setVideoAberto(true); }}
          style={{
            width: 64, height: 64, borderRadius: 8, overflow: "hidden",
            border: ativo ? `2.5px solid ${G}` : "2px solid transparent",
            background: "#0e9880", cursor: "pointer", position: "relative",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <PlayCircle size={28} color="#fff" strokeWidth={1.8} />
        </button>
      );
    }
    return (
      <button
        onClick={() => setMidiaAtiva(index)}
        style={{
          width: 64, height: 64, borderRadius: 8, overflow: "hidden",
          border: ativo ? `2.5px solid ${G}` : "2px solid transparent",
          padding: 0, cursor: "pointer", flexShrink: 0,
          opacity: ativo ? 1 : 0.6,
        }}
      >
        <img src={item.thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </button>
    );
  }

  return (
    <div style={s.page}>

      {/* ══════════════ NAVBAR ══════════════ */}
      <nav style={s.nav}>
        <div style={s.navInner}>
          {/* Logo + endereço */}
          <div style={{ display: "flex", flexDirection: "column", flexShrink: 0 }}>
            <a href="#" style={s.logo}>
              <span style={{ fontSize: 17, fontWeight: 800, color: G }}>Aluguel</span>
              <span style={s.logoText}>360</span>
            </a>
            <div style={s.logoPin}>
              <MapPin size={10} color={G} />
              <span>Informe o seu Endereço</span>
            </div>
          </div>

          {/* Busca */}
          <div style={s.searchWrap} className="hide-mobile">
            <Search size={14} color="#9ca3af" />
            <input style={s.searchInput} placeholder="Busque por cidade, bairro ou tipo de imóvel..." />
            <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}>
              <Search size={15} color="#6b7280" />
            </button>
          </div>

          {/* Links */}
          <div style={s.navLinks} className="hide-mobile">
            <a href="#" style={s.navLink}>Página Inicial</a>
            <a href="#" style={s.navLink}>Contate-nos</a>
            <a href="#" style={s.navLink}>Sobre Nós</a>
          </div>

          <div style={{ marginLeft: "auto" }} />

          {/* Ações */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            <button style={s.btnCad} className="hide-mobile">Cadastrar-se</button>
            <button style={s.btnEntr}>
              <span style={{ fontSize: 15 }}>→</span> Entrar
            </button>
            <a href="#" style={s.quero} className="hide-mobile">Quero anunciar</a>
          </div>

          {}
          <button
            onClick={() => setMenuAberto((m) => !m)}
            style={{ background: "none", border: "none", cursor: "pointer", display: "none", padding: 4 }}
            className="show-mobile"
          >
            {menuAberto ? <X size={22} color="#374151" /> : <Menu size={22} color="#374151" />}
          </button>
        </div>

        {/* Menu mobile */}
        {menuAberto && (
          <div style={{ background: "#fff", borderTop: "1px solid #f3f4f6", padding: "12px 20px" }} className="show-mobile">
            <div style={{ ...s.searchWrap, maxWidth: "100%", marginBottom: 12 }}>
              <Search size={14} color="#9ca3af" />
              <input style={s.searchInput} placeholder="Buscar imóvel..." />
            </div>
            {["Página Inicial", "Contate-nos", "Sobre Nós", "Quero anunciar"].map((l) => (
              <a key={l} href="#" style={{ display: "block", padding: "10px 0", fontSize: 14, color: "#374151", borderBottom: "1px solid #f3f4f6", textDecoration: "none" }}>{l}</a>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button style={{ ...s.btnCad, flex: 1 }}>Cadastrar-se</button>
              <button style={{ ...s.btnEntr, flex: 1 }}>Entrar</button>
            </div>
          </div>
        )}
      </nav>

      {/* ══════════════ CONTEÚDO ══════════════ */}
      <main style={s.main}>

        {/* ── GALERIA + CARD INFO ── */}
        <div style={s.galSection}>

          {/* Coluna thumbnails */}
          <div style={s.thumbCol}>
            {imovel.midia.map((item, i) => (
              <Thumb key={i} item={item} index={i} />
            ))}
          </div>

          {/* Foto / Vídeo principal */}
          <div style={s.mainPhoto}>
            {itemAtivo.tipo === "video" ? (
              <div
                style={{ width: "100%", height: 340, background: "#0e9880", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                onClick={() => setVideoAberto(true)}
              >
                <PlayCircle size={64} color="#fff" strokeWidth={1.5} />
                <span style={{ color: "#fff", fontSize: 15, fontWeight: 600, marginTop: 12 }}>Assistir ao vídeo do imóvel</span>
              </div>
            ) : (
              <img src={itemAtivo.thumb} alt="Foto do imóvel" style={s.mainImg} />
            )}

            {/* Setas de navegação */}
            <button onClick={anterior} style={{ ...s.arrow, left: 10 }}>
              <ChevronLeft size={18} color="#374151" />
            </button>
            <button onClick={proximo} style={{ ...s.arrow, right: 10 }}>
              <ChevronRight size={18} color="#374151" />
            </button>

            {/* Contador */}
            <div style={{ position: "absolute", bottom: 10, right: 12, background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: 11, padding: "3px 10px", borderRadius: 20 }}>
              {midiaAtiva} / {imovel.midia.length - 1}
            </div>
          </div>

          {/* Card de informações */}
          <div style={s.infoCard}>
            {/* Nome + favorito */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: "#111827", lineHeight: 1.2, flex: 1 }}>
                {imovel.nome}
              </h1>
              <button onClick={() => setFavoritado((f) => !f)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0 }}>
                <Heart size={20} fill={favoritado ? "#ef4444" : "none"} stroke={favoritado ? "#ef4444" : "#9ca3af"} strokeWidth={2} />
              </button>
            </div>

            {/* Tag */}
            <p style={{ fontSize: 11, color: G, fontWeight: 500, marginBottom: 8 }}>{imovel.tag}</p>

            {/* Preço */}
            <p style={{ fontSize: 26, fontWeight: 900, color: "#111827", marginBottom: 14 }}>
              R$ <span style={{ color: G }}>{imovel.preco.toLocaleString("pt-BR")}</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: "#9ca3af" }}>/mês</span>
            </p>

            {/* Descrição */}
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Descrição:</p>
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#4b5563", lineHeight: 1.6, marginBottom: 12, minHeight: 80 }}>
              {imovel.descricao}
            </div>

            {/* Localização */}
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Localização:</p>
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#4b5563", lineHeight: 1.6, marginBottom: 16 }}>
              {imovel.endereco}<br />{imovel.cidade}
            </div>

            {/* Botões */}
            <button style={s.btnWpp}><Phone size={15} /> Contate via Whatsapp</button>
            <button style={s.btnChat}><MessageCircle size={15} /> Contato pelo chat interno</button>
            <button style={s.btnMail}><Mail size={15} /> Enviar email</button>
          </div>
        </div>

        {/* ── DESPESAS + AVALIAÇÃO GERAL ── */}
        <div style={s.midSection}>

          {/* Despesas */}
          <div style={s.despCard}>
            <p style={{ fontWeight: 700, color: "#111827", marginBottom: 10, fontSize: 13 }}>Despesas adicionais sobre o imóvel:</p>

            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
              <span>IPTU:</span><span>R$ {imovel.despesas.iptu},00</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, color: "#374151", marginBottom: 8 }}>
              <span>Garantia:</span><span>{imovel.despesas.garantia}</span>
            </div>

            <p style={{ fontWeight: 700, color: "#374151", marginBottom: 6 }}>Outras Taxas:</p>
            {[
              ["Água",           `R$ ${imovel.despesas.agua},00`],
              ["Energia",        `R$ ${imovel.despesas.energia},00`],
              ["Condomínio",     `R$ ${imovel.despesas.condominio},00`],
              ["Manutenção",     `R$ ${imovel.despesas.manutencao},00`],
              ["Seguro Incêndio",`R$ ${imovel.despesas.seguroIncendio},00/mês`],
            ].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", color: "#6b7280", marginBottom: 3, paddingLeft: 8 }}>
                <span>{l}</span><span>{v}</span>
              </div>
            ))}

            <p style={{ fontWeight: 700, color: "#111827", marginTop: 14, marginBottom: 6 }}>Informações relevantes:</p>
            <p style={{ color: "#6b7280", lineHeight: 1.6, fontSize: 12 }}>{imovel.informacoesRelevantes}</p>
          </div>

          {/* Avaliação geral */}
          <div style={s.ratingCard}>
            {/* Número grande */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 52, fontWeight: 900, color: G, lineHeight: 1 }}>
                {imovel.avaliacaoMedia}
              </span>
              <div>
                <Estrelas valor={imovel.avaliacaoMedia} tamanho={20} />
                <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
                  {imovel.totalAvaliacoes.toLocaleString("pt-BR")} avaliações
                </p>
              </div>
            </div>

            {/* Barras */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[5, 4, 3, 2, 1].map((n) => {
                const qtd = imovel.distribuicaoEstrelas[n] ?? 0;
                const pct = Math.round((qtd / totalBarras) * 100);
                return (
                  <div key={n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 3, width: 28, justifyContent: "flex-end", flexShrink: 0 }}>
                      <span style={{ fontSize: 12, color: "#6b7280" }}>{n}</span>
                      <Star size={10} fill={G} stroke={G} />
                    </div>
                    <div style={{ flex: 1, height: 10, background: "#f3f4f6", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: G, borderRadius: 99 }} />
                    </div>
                    <span style={{ fontSize: 11, color: "#9ca3af", width: 20, textAlign: "right" }}>{n === 1 ? "0" : n === 2 ? "0" : ""}</span>
                  </div>
                );
              })}
            </div>

            <p style={{ fontSize: 13, color: G, fontWeight: 600, marginTop: 14 }}>
              Perfeito para {pctSatisfacao}% dos usuários.
            </p>
          </div>
        </div>

        {/* ── IMÓVEIS RELACIONADOS ── */}
        <div style={s.section}>
          <p style={s.sectionTitle}>Imóveis relacionados:</p>
          <div style={s.relGrid}>
            {imoveisRelacionados.map((im) => (
              <CardRelacionado key={im.id} im={im} />
            ))}
          </div>
        </div>

        {/* ── AVALIAÇÕES ── */}
        <div style={s.section}>
          <p style={s.sectionTitle}>Avaliações:</p>

          {/* Campo de envio */}
          <div style={s.avalInput}>
            <input
              value={novaAvaliacao}
              onChange={(e) => setNovaAvaliacao(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && enviarAvaliacao()}
              placeholder="Digite sua avaliação"
              style={s.avalField}
            />
            <button onClick={enviarAvaliacao} style={s.avalBtn}>
              <Send size={16} color="#fff" />
            </button>
          </div>

          {/* Lista */}
          <div style={s.avalList}>
            {avaliacoes.map((av) => (
              <div key={av.id} style={s.avalCard}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <Avatar iniciais={av.avatar} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{av.nome}</p>
                    <Estrelas valor={av.estrelas} tamanho={13} />
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.6 }}>{av.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: G }}>Aluguel</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#fff", background: G, padding: "2px 7px", borderRadius: 7 }}>360</span>
          </div>
          <div style={{ display: "flex", gap: 20, fontSize: 12, color: "#9ca3af" }}>
            <a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>Sobre Nós</a>
            <a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>Privacidade</a>
            <a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>Contato</a>
          </div>
          <p style={{ fontSize: 11, color: "#d1d5db" }}>© 2026 Aluguel360</p>
        </div>
      </footer>

      {/* Modelo video */}
      {videoAberto && (
        <div style={s.overlay} onClick={() => setVideoAberto(false)}>
          <div style={s.videoBox} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Tour virtual — {imovel.nome}</p>
              <button onClick={() => setVideoAberto(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={22} color="#fff" />
              </button>
            </div>
            <div style={{ background: "#111", borderRadius: 10, aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
              <PlayCircle size={64} color="#fff" strokeWidth={1.3} style={{ opacity: 0.7 }} />
              <p style={{ color: "#9ca3af", fontSize: 13 }}>Vídeo do imóvel (simulado)</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

         { box-sizing: border-box; margin: 0; padding: 0; }

        .hide-mobile { display: flex !important; }
        .show-mobile { display: none !important; }

        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }

        @media (max-width: 900px) {
          [data-thumbcol] {
            flex-direction: row !important;
            overflow-x: auto;
          }
        }

        @media (max-width: 700px) {
          [data-galsection] {
            flex-direction: column !important;
          }
          [data-infocard] {
            width: 100% !important;
          }
          [data-midsection] {
            flex-direction: column !important;
          }
        }

        html { scroll-behavior: smooth; }

        nav a:hover { color: #111827 !important; }

        [data-relcard]:hover {
          box-shadow: 0 6px 20px rgba(0,0,0,0.12) !important;
          transform: translateY(-2px);
          transition: all 0.2s;
        }

        input:focus {
          border-color: #1a7a5e !important;
          box-shadow: 0 0 0 2px rgba(26,122,94,0.15);
        }

        /* Scroll suave nas thumbnails em mobile */
        [data-thumbcol] {
          scrollbar-width: none;
        }
        [data-thumbcol]::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

import VisualisarImoveis from "@/pages/VisualizarImoveis";

<Route path="/visualizar-imoveis" element={<VisualisarImoveis />} />