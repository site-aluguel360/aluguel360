import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin, Star, Heart, MessageCircle, Mail, Phone,
  ChevronLeft, ChevronRight, PlayCircle, Send,
  Maximize2, BedDouble, X
} from "lucide-react";
import { useImoveis } from "../../lib/hooks/useImoveis";
import { CardImovel } from "../../components/CardImovel";
import { Button } from "../../components/ui/button";

import avaliacoesMock from "../../lib/mock/avaliacoes.json";

function Avatar({ iniciais }) {
  return (
    <div className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
      {iniciais}
    </div>
  );
}

function Estrelas({ valor, tamanho = 14 }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={tamanho}
          className={i <= valor ? "fill-teal-600 text-teal-600" : "fill-transparent text-gray-300"}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}

export function VisualizarImoveis() {
  const { id } = useParams();
  const { getImovelById, getImoveisRelacionados } = useImoveis();

  const [imovel, setImovel] = useState(null);
  const [imoveisRelacionados, setImoveisRelacionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [midiaAtiva, setMidiaAtiva] = useState(1);
  const [favoritado, setFavoritado] = useState(false);
  const [videoAberto, setVideoAberto] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [novaAvaliacao, setNovaAvaliacao] = useState("");
  const [avaliacoes, setAvaliacoes] = useState([]);

  useEffect(() => {
    setLoading(true);
    // Fallback para 1 caso o id venha nulo no debug
    const imovelId = id || 1;
    
    getImovelById(imovelId)
      .then(data => {
        setImovel(data);
        if (data && data.imoveisRelacionados) {
          // A API mocada já traz o array inteiro nos mockados, ou IDs. 
          // Se trouxer objetos inteiros, a gente seta direto:
          if (typeof data.imoveisRelacionados[0] === 'object') {
             setImoveisRelacionados(data.imoveisRelacionados);
          } else {
             getImoveisRelacionados(data.imoveisRelacionados).then(setImoveisRelacionados);
          }
        }
        setAvaliacoes(avaliacoesMock.filter(a => a.imovelId == imovelId));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, getImovelById, getImoveisRelacionados]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">Carregando imóvel...</div>;
  if (error || !imovel) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-muted-foreground">
      <p>Imóvel não encontrado.</p>
      <Link to="/resultados"><Button variant="outline">Ver outros imóveis</Button></Link>
    </div>
  );

  const totalBarras = imovel.distribuicaoEstrelas ? Object.values(imovel.distribuicaoEstrelas).reduce((a, b) => a + b, 0) : 1;
  const distEstrelas = imovel.distribuicaoEstrelas || { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 };
  const pctSatisfacao = Math.round(((distEstrelas[5] + distEstrelas[4]) / (totalBarras || 1)) * 100);

  const midias = imovel.midia || [];
  const itemAtivo = midias[midiaAtiva] || {};

  function anterior() {
    setIsPlaying(false);
    setMidiaAtiva((p) => (p === 0 ? midias.length - 1 : p - 1));
  }
  function proximo() {
    setIsPlaying(false);
    setMidiaAtiva((p) => (p === midias.length - 1 ? 0 : p + 1));
  }
  function enviarAvaliacao() {
    if (!novaAvaliacao.trim()) return;
    setAvaliacoes((prev) => [
      { id: Date.now(), nome: "Você", estrelas: 5, texto: novaAvaliacao.trim(), avatar: "VC" },
      ...prev,
    ]);
    setNovaAvaliacao("");
  }

  return (
    <div className="min-h-screen font-sans pb-16 bg-gray-50/30">
      <main className="max-w-7xl mx-auto px-5 py-8">
        
        {/* ── GALERIA E CARD ── */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Thumbnails */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible shrink-0 pb-2 lg:pb-0 order-2 lg:order-1 w-full lg:w-auto scrollbar-hide">
            {midias.map((item, i) => {
              const ativo = i === midiaAtiva;
              if (item.tipo === "video") {
                return (
                  <button
                    key={i}
                    onClick={() => { setIsPlaying(false); setMidiaAtiva(i); if(!item.url) setVideoAberto(true); }}
                    className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden flex items-center justify-center bg-teal-600 transition-all ${ativo ? "border-2 border-teal-600 scale-[1.02]" : "border-2 border-transparent opacity-80"}`}
                    aria-label="Abrir vídeo"
                  >
                    <PlayCircle size={28} className="text-white" strokeWidth={1.8} />
                  </button>
                );
              }
              return (
                <button
                  key={i}
                  onClick={() => { setIsPlaying(false); setMidiaAtiva(i); }}
                  className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden transition-all ${ativo ? "border-2 border-teal-600 scale-[1.02]" : "border-2 border-transparent opacity-60 hover:opacity-100"}`}
                  aria-label={`Visualizar foto ${i}`}
                >
                  <img src={item.thumb} alt={`Miniatura ${i}`} className="w-full h-full object-cover" />
                </button>
              );
            })}
          </div>

          {/* Foto Principal */}
          <div className="relative flex-1 rounded-xl overflow-hidden bg-gray-900 w-full order-1 lg:order-2 h-[340px] md:h-[420px] shadow-sm">
            {itemAtivo.tipo === "video" ? (
              itemAtivo.url ? (
                isPlaying ? (
                  <video src={itemAtivo.url} controls autoPlay className="w-full h-full bg-black object-contain" />
                ) : (
                  <div
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer bg-black/40 transition relative group"
                    onClick={() => setIsPlaying(true)}
                  >
                    <img src={itemAtivo.thumb || imovel.fotoPrincipal || imovel.imagem} className="w-full h-full object-cover absolute inset-0 -z-10 brightness-50 group-hover:brightness-40 transition" alt="Video thumb" />
                    <PlayCircle size={72} className="text-white mb-4 opacity-90 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                    <span className="text-white font-semibold shadow-black drop-shadow-md">Reproduzir Tour Virtual</span>
                  </div>
                )
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-center cursor-pointer bg-teal-700 hover:bg-teal-800 transition"
                  onClick={() => setVideoAberto(true)}
                >
                  <PlayCircle size={72} className="text-white mb-4 opacity-90" strokeWidth={1.5} />
                  <span className="text-white font-semibold">Assistir ao vídeo do imóvel</span>
                </div>
              )
            ) : (
              <img src={itemAtivo.thumb} alt={imovel.titulo || imovel.nome || "Foto do imóvel"} className="w-full h-full object-cover" />
            )}
            
            <button onClick={anterior} className="absolute top-1/2 -translate-y-1/2 left-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-md transition" aria-label="Anterior">
              <ChevronLeft size={20} className="text-gray-800" />
            </button>
            <button onClick={proximo} className="absolute top-1/2 -translate-y-1/2 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-md transition" aria-label="Próxima">
              <ChevronRight size={20} className="text-gray-800" />
            </button>
            
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium">
              {midiaAtiva} / {midias.length - 1}
            </div>
          </div>

          {/* Info Card */}
          <div className="w-full lg:w-[300px] shrink-0 bg-white rounded-xl p-6 shadow-sm border border-border order-3">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-xl font-bold text-foreground leading-tight flex-1 pr-2">
                {imovel.titulo || imovel.nome}
              </h1>
              <button onClick={() => setFavoritado(!favoritado)} className="p-1 shrink-0 -mt-1 -mr-1">
                <Heart size={22} className={favoritado ? "fill-red-500 text-red-500 transition-colors" : "text-gray-400 transition-colors"} strokeWidth={1.5} />
              </button>
            </div>
            {imovel.tag && <p className="text-xs text-teal-600 font-medium mb-3">{imovel.tag}</p>}
            
            <p className="text-[28px] font-black text-foreground mb-5 tracking-tight">
              R$ <span className="text-teal-600">{(imovel.preco || 0).toLocaleString("pt-BR")}</span>
              <span className="text-sm font-medium text-muted-foreground ml-1">/mês</span>
            </p>

            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Descrição</p>
            <div className="border border-border bg-gray-50/50 rounded-lg p-3 text-sm text-gray-600 leading-relaxed mb-4 min-h-[90px]">
              {imovel.descricao}
            </div>

            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Localização</p>
            <div className="border border-border bg-gray-50/50 rounded-lg p-3 text-sm text-gray-600 leading-relaxed mb-6">
              <MapPin className="inline-block w-4 h-4 mr-1 -mt-1 text-teal-600" />
              {imovel.endereco}<br />{imovel.cidade && <span className="text-muted-foreground text-xs mt-1 block">{imovel.cidade}</span>}
            </div>

            <div className="flex flex-col gap-2.5">
              <Button className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white gap-2 font-semibold">
                <Phone size={16} /> WhatsApp
              </Button>
              <Button variant="outline" className="w-full gap-2 font-semibold text-teal-700 border-teal-200 hover:bg-teal-50">
                <MessageCircle size={16} /> Chat Interno
              </Button>
              <Button variant="outline" className="w-full gap-2 font-semibold text-gray-600">
                <Mail size={16} /> Enviar E-mail
              </Button>
            </div>
          </div>
        </div>

        {/* ── DESPESAS E AVALIAÇÃO GERAL ── */}
        <div className="flex flex-col md:flex-row gap-5 mt-6">
          {/* Despesas */}
          <div className="flex-1 min-w-[240px] bg-white rounded-xl p-5 shadow-sm border border-border">
            <p className="font-bold text-foreground mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-teal-600" /> Detalhes & Custos
            </p>
            
            <div className="flex justify-between font-semibold text-gray-800 mb-2 bg-gray-50 p-2 rounded-md">
              <span>IPTU:</span><span>R$ {imovel.despesas?.iptu || 0},00</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-800 mb-4 bg-gray-50 p-2 rounded-md">
              <span>Garantia Exigida:</span><span className="text-teal-700">{imovel.despesas?.garantia || "Caução"}</span>
            </div>

            <p className="font-semibold text-gray-700 mb-2 mt-4 text-sm">Taxas Adicionais</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground pl-1"><span>Água</span><span className="font-medium text-gray-600">R$ {imovel.despesas?.agua || 0},00</span></div>
              <div className="flex justify-between text-muted-foreground pl-1"><span>Energia</span><span className="font-medium text-gray-600">R$ {imovel.despesas?.energia || 0},00</span></div>
              <div className="flex justify-between text-muted-foreground pl-1"><span>Condomínio</span><span className="font-medium text-gray-600">R$ {imovel.despesas?.condominio || 0},00</span></div>
              <div className="flex justify-between text-muted-foreground pl-1"><span>Manutenção</span><span className="font-medium text-gray-600">R$ {imovel.despesas?.manutencao || 0},00</span></div>
              <div className="flex justify-between text-muted-foreground pl-1"><span>Seguro Incêndio</span><span className="font-medium text-gray-600">R$ {imovel.despesas?.seguroIncendio || 0},00/mês</span></div>
            </div>

            {imovel.informacoesRelevantes && (
              <>
                <p className="font-semibold text-gray-700 mt-5 mb-2 text-sm">Regras e Observações</p>
                <p className="text-muted-foreground leading-relaxed text-sm bg-blue-50/50 p-3 rounded-md border border-blue-100/50">
                  {imovel.informacoesRelevantes}
                </p>
              </>
            )}
          </div>

          {/* Avaliação Geral */}
          <div className="flex-1 min-w-[240px] bg-white rounded-xl p-6 shadow-sm border border-border flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-6xl font-black text-teal-600 tracking-tighter">
                {imovel.avaliacaoMedia || 0}
              </span>
              <div>
                <Estrelas valor={imovel.avaliacaoMedia || 0} tamanho={22} />
                <p className="text-sm text-muted-foreground mt-1.5 font-medium">
                  {(imovel.totalAvaliacoes || 0).toLocaleString("pt-BR")} avaliações
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              {[5, 4, 3, 2, 1].map((n) => {
                const qtd = distEstrelas[n] ?? 0;
                const pct = Math.round((qtd / (totalBarras || 1)) * 100);
                return (
                  <div key={n} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-8 justify-end shrink-0 text-sm font-medium text-gray-600">
                      <span>{n}</span>
                      <Star size={12} className="fill-teal-600 text-teal-600 -mt-0.5" />
                    </div>
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground w-6 text-right font-medium">{n <= 2 && qtd === 0 ? "0%" : `${pct}%`}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-3 bg-teal-50 text-teal-800 rounded-lg font-medium text-sm text-center border border-teal-100">
              Perfeito para {pctSatisfacao}% dos inquilinos!
            </div>
          </div>
        </div>

        {/* ── IMÓVEIS RELACIONADOS ── */}
        {imoveisRelacionados && imoveisRelacionados.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
              Você também pode gostar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {imoveisRelacionados.map((im) => (
                <CardImovel 
                  key={im.id} 
                  id={im.id}
                  titulo={im.titulo || im.nome}
                  preco={im.preco}
                  area={im.area}
                  quartos={im.quartos}
                  endereco={im.endereco}
                  imagem={im.imagem || im.fotoPrincipal || im.foto}
                  avaliacaoMedia={im.avaliacaoMedia || im.avaliacao}
                  variant="compact" 
                />
              ))}
            </div>
          </div>
        )}

        {/* ── AVALIAÇÕES ── */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-foreground mb-5">Comentários dos Hóspedes</h2>
          
          <div className="flex gap-3 mb-6 items-center max-w-2xl bg-white p-2 rounded-xl shadow-sm border border-border">
            <input
              className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-gray-400"
              value={novaAvaliacao}
              onChange={(e) => setNovaAvaliacao(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && enviarAvaliacao()}
              placeholder="Como foi sua experiência neste imóvel?"
            />
            <Button onClick={enviarAvaliacao} className="bg-teal-600 hover:bg-teal-700 text-white shrink-0 px-5 rounded-lg shadow-sm">
              Enviar <Send size={16} className="ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {avaliacoes.map((av) => (
              <div key={av.id} className="bg-white rounded-xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar iniciais={av.avatar} />
                  <div>
                    <p className="text-sm font-bold text-foreground">{av.nome}</p>
                    <Estrelas valor={av.estrelas} tamanho={12} />
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{av.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal de Vídeo */}
      {videoAberto && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setVideoAberto(false)}>
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-4 w-full max-w-4xl relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 text-white px-2">
              <p className="font-bold text-lg">Tour virtual — {imovel.titulo || imovel.nome}</p>
              <button onClick={() => setVideoAberto(false)} className="p-2 hover:bg-gray-800 rounded-full transition-colors" aria-label="Fechar vídeo">
                <X size={24} />
              </button>
            </div>
            <div className="bg-[#111] rounded-xl aspect-video flex flex-col items-center justify-center gap-4 overflow-hidden relative">
              <PlayCircle size={72} className="text-white opacity-40 hover:opacity-80 transition-opacity cursor-pointer" strokeWidth={1} />
              <p className="text-gray-500 text-sm font-medium tracking-wide uppercase">Vídeo Demonstrativo</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
