import {
  Star,BadgeCheck,MapPin,Home,Clock,ChevronRight,Building2,Shield,
} from "lucide-react";

//Mock do anunciante
const mockAnunciante = {
  nome: "Carlos Alberto Silva",
  tipo: "Corretor Autônomo",
  creci: "CRECI-PI 12.345-F",
  email: "carlos.silva@imobiliaria.com.br",
  telefone: "(86) 99812-3456",
  whatsapp: "5586998123456",
  cidade: "Floriano – PI",
  iniciais: "CA",
  avatarCor: "#0d9488",
  verificado: true,
  membroDesde: "fevereiro de 2023",
  imoveisAnunciados: 8,
  avaliacaoMedia: 4.8,
  totalAvaliacoes: 34,
  tempoResposta: "Responde em até 2h",
  descricao:
    "Corretor com mais de 8 anos de experiência no mercado imobiliário do Piauí. Especializado em locações residenciais e comerciais na região de Floriano e cidades vizinhas.",
};

//Estrelas de avaliação 
function Estrelas({ nota, total }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={13}
            className={
              i <= Math.round(nota)
                ? "text-amber-400 fill-amber-400"
                : "text-gray-200 fill-gray-200"
            }
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-gray-700">{nota}</span>
      <span className="text-xs text-gray-400">({total} avaliações)</span>
    </div>
  );
}

//Card do Anunciante
function CardAnunciante({ anunciante }) {
  const {
    nome, tipo, creci, cidade,iniciais, avatarCor, verificado, membroDesde,imoveisAnunciados, avaliacaoMedia, totalAvaliacoes,tempoResposta, descricao,
  } = anunciante;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-full max-w-sm">

      {/* Faixa superior */}
      <div className="h-14" style={{ background: `linear-gradient(135deg, ${avatarCor}22, ${avatarCor}44)` }} />

      <div className="px-5 pb-5">
        {/* Avatar e badge */}
        <div className="flex items-end justify-between -mt-8 mb-3">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-white shadow-sm shrink-0"
            style={{ backgroundColor: avatarCor }}
          >
            <span className="text-white text-xl font-bold tracking-wide">{iniciais}</span>
          </div>

          {verificado && (
            <div className="flex items-center gap-1 bg-teal-50 text-teal-700 text-xs font-medium px-2.5 py-1 rounded-full border border-teal-100">
              <BadgeCheck size={13} className="text-teal-500" />
              Verificado
            </div>
          )}
        </div>

        {/* Nome, tipo e CRECI */}
        <h2 className="text-base font-semibold text-gray-900 leading-tight">{nome}</h2>
        <p className="text-xs text-gray-400 mt-0.5">{tipo}</p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <Shield size={11} className="text-teal-500" />
          <span className="text-xs text-gray-500">{creci}</span>
        </div>

        {/* Avaliação */}
        <div className="mt-2">
          <Estrelas nota={avaliacaoMedia} total={totalAvaliacoes} />
        </div>

        <div className="border-t border-gray-50 my-4" />

        {/* Métricas */}
        <div className="grid grid-cols-3 gap-2 text-center mb-4">
          <div className="bg-gray-50 rounded-xl py-2.5">
            <p className="text-base font-bold text-teal-600">{imoveisAnunciados}</p>
            <p className="text-[10px] text-gray-400 leading-tight mt-0.5">Anúncios<br />ativos</p>
          </div>
          <div className="bg-gray-50 rounded-xl py-2.5">
            <p className="text-base font-bold text-teal-600">{avaliacaoMedia}</p>
            <p className="text-[10px] text-gray-400 leading-tight mt-0.5">Nota<br />média</p>
          </div>
          <div className="bg-gray-50 rounded-xl py-2.5">
            <p className="text-base font-bold text-teal-600">{totalAvaliacoes}</p>
            <p className="text-[10px] text-gray-400 leading-tight mt-0.5">Avalia-<br />ções</p>
          </div>
        </div>

        {/* Infos complementares */}
        <div className="flex flex-col gap-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin size={12} className="text-gray-300 shrink-0" />
            {cidade}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock size={12} className="text-gray-300 shrink-0" />
            {tempoResposta}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Building2 size={12} className="text-gray-300 shrink-0" />
            Membro desde {membroDesde}
          </div>
        </div>

        {/* Descrição */}
        <p className="text-xs text-gray-500 leading-relaxed">
          {descricao}
        </p>
      </div>
    </div>
  );
}

// Página de exemplo: Detalhes do Imóvel
export default function DetalhesImovel() {
  return (
    <div className="min-h-screen bg-gray-50 font-[Outfit,sans-serif]">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Breadcrumb simulado */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <span className="hover:text-teal-600 cursor-pointer">Início</span>
          <ChevronRight size={11} />
          <span className="hover:text-teal-600 cursor-pointer">Imóveis em Floriano</span>
          <ChevronRight size={11} />
          <span className="text-gray-600">Apartamento – Rua das Flores</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Coluna esquerda: dados do imóvel (simulado) ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">

            {/* Galeria placeholder */}
            <div className="bg-gray-200 rounded-2xl aspect-video flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Home size={36} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">Fotos do imóvel</p>
              </div>
            </div>

            {/* Título e localização */}
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Apartamento 2 quartos - Centro
              </h1>
              <div className="flex items-center gap-1.5 text-sm text-gray-400 mt-1">
                <MapPin size={13} />
                Rua das Flores, 200 - Floriano, PI
              </div>
            </div>

            {/* Preço */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
              <p className="text-xs text-gray-400">Aluguel mensal</p>
              <p className="text-3xl font-bold text-teal-600 mt-0.5">
                R$ 1.200
                <span className="text-base font-normal text-gray-400">/mês</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">+ condomínio R$ 180 · IPTU incluso</p>
            </div>

            {/* Características */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-800 mb-3">Características</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Quartos",    valor: "2" },
                  { label: "Banheiros",  valor: "1" },
                  { label: "Vagas",      valor: "1" },
                  { label: "Área",       valor: "62 m²" },
                ].map(({ label, valor }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-gray-800">{valor}</p>
                    <p className="text-xs text-gray-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Descrição do imóvel */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-800 mb-2">Sobre o imóvel</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Apartamento bem localizado no centro de Floriano, próximo a comércios,
                escolas e transporte público. Imóvel mobiliado, com sala, cozinha americana,
                dois quartos e banheiro reformado. Condomínio com portaria 24h.
              </p>
            </div>
          </div>

          {/* Coluna direita: card do anunciante */}
          <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-6">
            <CardAnunciante anunciante={mockAnunciante} />
          </div>

        </div>
      </div>
    </div>
  );
}