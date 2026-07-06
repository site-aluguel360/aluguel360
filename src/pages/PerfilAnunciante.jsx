import { useState } from "react";
import {
  User, MapPin, Home, Megaphone, Image, Star, ShieldCheck, Settings, Pencil, AlertCircle,Phone, Mail, Building2, TrendingUp, Clock, CheckCircle2,
} from "lucide-react";

import usuariosMock from "../lib/mock/usuarios.json";

const mockAnunciante = usuariosMock;

// Sidebar 
const menuItems = [
  { label: "Perfil",               icon: User,        key: "perfil" },
  { label: "Endereços",            icon: MapPin,       key: "enderecos" },
  { label: "Meus Imóveis",         icon: Home,         key: "imoveis" },
  { label: "Meus Anúncios",        icon: Megaphone,    key: "anuncios" },
  { label: "Fotos e Mídias",       icon: Image,        key: "midias" },
  { label: "Qualidade dos Anúncios", icon: Star,       key: "qualidade" },
  { label: "Segurança",            icon: ShieldCheck,  key: "seguranca" },
  { label: "Configurações",        icon: Settings,     key: "configuracoes" },
];

function SidebarPerfil({ ativo, onNavegar }) {
  return (
    <aside className="w-52 shrink-0">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
        Minha conta
      </p>
      <nav className="flex flex-col gap-0.5">
        {menuItems.map(({ label, icon: Icon, key }) => {
          const isActive = ativo === key;
          return (
            <button
              key={key}
              onClick={() => onNavegar(key)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors w-full text-left ${
                isActive
                  ? "bg-teal-50 text-teal-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={15} className={isActive ? "text-teal-600" : "text-gray-400"} />
              {label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

//Header do perfil
function HeaderPerfil({ nome, email, telefone, iniciais, cadastroCompleto, tipo, creci }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-start justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center shrink-0">
          <span className="text-white text-xl font-semibold tracking-wide">{iniciais}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <h1 className="text-lg font-semibold text-gray-900">{nome}</h1>
          <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full w-fit">
            {tipo}
          </span>
          <p className="text-xs text-gray-400 mt-1">{creci}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Mail size={11} /> {email}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Phone size={11} /> {telefone}
            </span>
          </div>
          {!cadastroCompleto && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <AlertCircle size={12} className="text-amber-500" />
              <p className="text-xs text-gray-500">
                Cadastro incompleto —{" "}
                <button className="text-teal-600 hover:underline font-medium">
                  Completar cadastro
                </button>
              </p>
            </div>
          )}
        </div>
      </div>

      <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300 rounded-lg px-3 py-2 transition-colors font-medium shrink-0">
        <Pencil size={12} />
        Editar Perfil
      </button>
    </div>
  );
}

//Cards reutilizáveis
function Card({ titulo, subtitulo, children, acao, onAcao }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col gap-3 h-full">
      <div>
        <h2 className="text-sm font-semibold text-gray-800">{titulo}</h2>
        {subtitulo && <p className="text-xs text-gray-400 mt-0.5">{subtitulo}</p>}
      </div>
      <div className="flex-1">{children}</div>
      {acao && (
        <button
          onClick={onAcao}
          className="flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors w-fit mt-auto"
        >
          <Pencil size={12} />
          {acao}
        </button>
      )}
    </div>
  );
}

function InfoLinha({ label, valor, destaque }) {
  return (
    <p className="text-sm text-gray-600">
      <span className="text-gray-400">{label}: </span>
      <span className={destaque ? "text-teal-600 font-medium" : ""}>{valor}</span>
    </p>
  );
}

// Card: Informações pessoai
function CardInfoPessoal({ nome, cpf, dataCadastro, creci, telefone, email }) {
  return (
    <Card titulo="Informações do perfil" subtitulo="Seus dados pessoais e profissionais" acao="Alterar Dados">
      <div className="flex flex-col gap-1.5">
        <InfoLinha label="Nome"           valor={nome} />
        <InfoLinha label="CPF"            valor={cpf} />
        <InfoLinha label="CRECI"          valor={creci} />
        <InfoLinha label="Telefone"       valor={telefone} />
        <InfoLinha label="E-mail"         valor={email} />
        <InfoLinha label="Cadastro desde" valor={dataCadastro} />
      </div>
    </Card>
  );
}

//Card: Endereço
function CardEnderecos({ total, principal }) {
  return (
    <Card titulo="Endereços" subtitulo="Endereços associados à sua conta" acao="Gerenciar Endereços">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-500">{total} endereços cadastrados</p>
        <div className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            Endereço Principal
          </p>
          <p>{principal.rua}</p>
          <p>{principal.bairro} · {principal.cidade} – {principal.estado}</p>
          <p className="text-gray-400 text-xs mt-0.5">CEP {principal.cep}</p>
        </div>
      </div>
    </Card>
  );
}

//Card: Desempenho dos anúncios
function CardDesempenho({ ativos, pausados, encerrados, visualizacoesTotal, contatosRecebidos }) {
  const stats = [
    { label: "Anúncios ativos",    valor: ativos,              cor: "text-teal-600" },
    { label: "Pausados",           valor: pausados,            cor: "text-amber-500" },
    { label: "Encerrados",         valor: encerrados,          cor: "text-gray-400" },
    { label: "Visualizações",      valor: visualizacoesTotal,  cor: "text-blue-500" },
    { label: "Contatos recebidos", valor: contatosRecebidos,   cor: "text-purple-500" },
  ];

  return (
    <Card titulo="Desempenho dos Anúncios" subtitulo="Resumo da sua atividade como anunciante" acao="Ver relatório completo">
      <div className="grid grid-cols-2 gap-2">
        {stats.map(({ label, valor, cor }) => (
          <div key={label} className="bg-gray-50 rounded-xl p-3">
            <p className={`text-xl font-bold ${cor}`}>{valor.toLocaleString("pt-BR")}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

// Card: Qualidade dos anuncios
function CardQualidade({ notaMedia, notaMaxima }) {
  const pct = Math.min((notaMedia / notaMaxima) * 100, 100);
  const cor = pct >= 80 ? "bg-teal-500" : pct >= 50 ? "bg-amber-400" : "bg-red-400";

  return (
    <Card titulo="Qualidade dos Anúncios" subtitulo="Avaliação baseada em detalhes e engajamento">
      <div className="flex flex-col gap-3">
        <p className="text-xs text-gray-500 leading-relaxed">
          A nota é calculada pela completude das informações e pelo engajamento dos visitantes.
        </p>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-teal-600">{notaMedia}</span>
          <span className="text-sm text-gray-400 mb-1">/ {notaMaxima}</span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full ${cor} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
        </div>
        <button className="text-xs text-teal-600 hover:text-teal-700 font-medium w-fit">
          Ver mais detalhes »
        </button>
      </div>
    </Card>
  );
}

//Card: Imóveis
function CardImoveis({ total, alugados, disponíveis, rascunho }) {
  return (
    <Card titulo="Meus Imóveis" subtitulo="Imóveis cadastrados na plataforma">
      <div className="flex flex-col gap-1.5">
        <InfoLinha label="Total cadastrados" valor={`${total} imóveis`} />
        <InfoLinha label="Disponíveis"       valor={disponíveis} destaque />
        <InfoLinha label="Alugados"          valor={alugados} />
        <InfoLinha label="Em rascunho"       valor={rascunho} />
      </div>
      <div className="flex flex-col gap-1 mt-3">
        <button className="flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors">
          <Pencil size={12} /> Gerenciar imóveis
        </button>
        <button className="flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors">
          <Pencil size={12} /> Gerenciar Anúncios
        </button>
      </div>
    </Card>
  );
}

//Card: Mídias
function CardMidias({ fotos, videos }) {
  return (
    <Card titulo="Fotos e Mídias" subtitulo="Mídias enviadas para seus imóveis">
      <div className="flex gap-4">
        <div className="bg-teal-50 rounded-xl p-4 flex-1 text-center">
          <p className="text-2xl font-bold text-teal-600">{fotos}</p>
          <p className="text-xs text-gray-400 mt-0.5">Fotos</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 flex-1 text-center">
          <p className="text-2xl font-bold text-blue-500">{videos}</p>
          <p className="text-xs text-gray-400 mt-0.5">Vídeos</p>
        </div>
      </div>
      <button className="text-xs text-teal-600 hover:text-teal-700 font-medium mt-3 block">
        Ver mais detalhes »
      </button>
    </Card>
  );
}

//Card: Segurança
function CardSeguranca({ metodosVerificacao, dispositivosVinculados, alertas, permissaoLocalizacao }) {
  const itens = [
    { label: `${metodosVerificacao} método de verificação`,    ok: metodosVerificacao > 0 },
    { label: `${dispositivosVinculados} dispositivos vinculados`, ok: true },
    { label: `${alertas} alertas de segurança`,                ok: alertas === 0 },
    { label: `Localização ${permissaoLocalizacao ? "ativada" : "desativada"}`, ok: permissaoLocalizacao },
  ];

  return (
    <Card titulo="Segurança" subtitulo="Configurações de segurança da conta" acao="Ver mais detalhes">
      <div className="flex flex-col gap-2">
        {itens.map(({ label, ok }) => (
          <div key={label} className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle2 size={13} className={ok ? "text-teal-500" : "text-gray-300"} />
            {label}
          </div>
        ))}
      </div>
    </Card>
  );
}

//Card: Privacidade
function CardPrivacidade({ alertas, permissaoLocalizacao }) {
  return (
    <Card titulo="Privacidade" subtitulo="Controle do uso dos seus dados" acao="Gerenciar permissões">
      <div className="flex flex-col gap-1.5 text-sm text-gray-600">
        <p>Dados de localização essenciais para gestão</p>
        <p>Informações de navegação na plataforma</p>
        <p>{alertas} alertas de privacidade</p>
        <p>
          Localização:{" "}
          <span className={permissaoLocalizacao ? "text-teal-600 font-medium" : "text-red-500 font-medium"}>
            {permissaoLocalizacao ? "Ativada" : "Desativada"}
          </span>
        </p>
      </div>
    </Card>
  );
}

//Página principal
export function PerfilAnunciante() {
  const [paginaAtiva, setPaginaAtiva] = useState("perfil");
  const u = mockAnunciante;

  return (
    <div className="min-h-screen bg-gray-50 font-[Outfit,sans-serif]">
      <div className="max-w-6xl mx-auto px-4 py-10 flex gap-8">

        {/* Sidebar */}
        <SidebarPerfil ativo={paginaAtiva} onNavegar={setPaginaAtiva} />

        {/* Conteúdo */}
        <main className="flex-1 flex flex-col gap-5 min-w-0">

          {/* Header */}
          <HeaderPerfil
            nome={u.nome}
            email={u.email}
            telefone={u.telefone}
            iniciais={u.iniciais}
            cadastroCompleto={u.cadastroCompleto}
            tipo={u.tipo}
            creci={u.creci}
          />

          {/* Grade principal — 3 colunas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <CardInfoPessoal
              nome={u.nome}
              cpf={u.cpf}
              dataCadastro={u.dataCadastro}
              creci={u.creci}
              telefone={u.telefone}
              email={u.email}
            />
            <CardEnderecos
              total={u.enderecos.total}
              principal={u.enderecos.principal}
            />
            <CardSeguranca
              metodosVerificacao={u.seguranca.metodosVerificacao}
              dispositivosVinculados={u.seguranca.dispositivosVinculados}
              alertas={u.seguranca.alertas}
              permissaoLocalizacao={u.seguranca.permissaoLocalizacao}
            />
            <CardImoveis
              total={u.imoveis.total}
              alugados={u.imoveis.alugados}
              disponíveis={u.imoveis.disponíveis}
              rascunho={u.imoveis.rascunho}
            />
            <CardQualidade
              notaMedia={u.anuncios.notaMedia}
              notaMaxima={u.anuncios.notaMaxima}
            />
            <CardPrivacidade
              alertas={u.privacidade.alertas}
              permissaoLocalizacao={u.privacidade.permissaoLocalizacao}
            />
          </div>

          {/* Linha inferior — 2 colunas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CardDesempenho
              ativos={u.anuncios.ativos}
              pausados={u.anuncios.pausados}
              encerrados={u.anuncios.encerrados}
              visualizacoesTotal={u.anuncios.visualizacoesTotal}
              contatosRecebidos={u.anuncios.contatosRecebidos}
            />
            <CardMidias
              fotos={u.midias.fotos}
              videos={u.midias.videos}
            />
          </div>

        </main>
      </div>
    </div>
  );
}