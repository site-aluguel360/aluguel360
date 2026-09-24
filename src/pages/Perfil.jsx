import { useEffect, useState } from "react";
import { Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { PerfilHeader } from "../components/PerfilHeader";
import { PerfilSidebar } from "../components/PerfilSidebar";
import { PerfilCard } from "../components/PerfilCard";
import { toApiError, userApi } from "../lib/api";
import { adaptUser } from "../lib/adapters";

function addressLabel(address) {
  if (!address) return "Nenhum endereço cadastrado.";
  return `${address.logradouro}, ${address.numero} — ${address.bairro}, ${address.cidade} - ${address.estado} | CEP: ${address.cep}`;
}

export function Perfil() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([userApi.me(), userApi.stats()])
      .then(([userData, statsData]) => {
        if (!active) return;
        setUser(adaptUser(userData));
        setStats(statsData);
      })
      .catch((requestError) => active && setError(toApiError(requestError)))
      .finally(() => active && setIsLoading(false));
    return () => { active = false; };
  }, []);

  if (isLoading) return <p className="mx-auto max-w-7xl px-4 py-12 text-center text-muted-foreground">Carregando perfil...</p>;
  if (error) return <p className="mx-auto max-w-7xl px-4 py-12 text-center text-red-600" role="alert">{error}</p>;
  if (!user || !stats) return null;

  const addresses = user.addresses || [];
  const quality = Number(stats.quality_score_medio || 0);
  const qualityPercent = Math.min(100, Math.max(0, quality * 10));

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
      <div className="grid gap-8 min-[1080px]:grid-cols-[200px_minmax(0,1fr)]">
        <PerfilSidebar />
        <div className="flex min-w-0 flex-col">
          <PerfilHeader usuario={user} />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <PerfilCard titulo="Informações do perfil" descricao="Acesse seus dados pessoais">
              <div className="mb-6 flex flex-col gap-2.5 text-[13px] text-[#2D2D2D]">
                <p><span className="mr-1 font-semibold">Nome:</span>{user.nome}</p>
                <p><span className="mr-1 font-semibold">Email:</span>{user.email}</p>
                <p><span className="mr-1 font-semibold">Data de Cadastro:</span>{user.dataCadastro || "Não informado"}</p>
              </div>
              <Link to="/perfil/editar" className="flex items-center gap-1.5 text-[13px] text-[#1A535C]"><Edit className="h-3.5 w-3.5" />Alterar Dados</Link>
            </PerfilCard>

            <PerfilCard titulo="Endereços" descricao="Endereços associados à sua conta">
              <div className="mb-6 flex flex-col gap-3 text-[13px] text-[#2D2D2D]">
                <p>{addresses.length} endereço(s) cadastrado(s)</p>
                <div><p className="font-semibold">Endereço Principal</p><p className="leading-relaxed text-[#2D2D2D]/80">{addressLabel(addresses.find((address) => address.is_primary) || addresses[0])}</p></div>
              </div>
              <Link to="/perfil/enderecos" className="flex items-center gap-1.5 text-[13px] text-[#1A535C]"><Edit className="h-3.5 w-3.5" />Gerenciar Endereços</Link>
            </PerfilCard>

            <PerfilCard titulo="Meu Imóveis" descricao="Imóveis associados à sua conta">
              <div className="mb-6 flex flex-col gap-3 text-[13px] text-[#2D2D2D]/80">
                <p>{stats.imoveis_cadastrados} imóveis cadastrados</p>
                <p>{stats.imoveis_publicados} imóveis anunciados</p>
                <p>{stats.imoveis_rascunho} cadastros em rascunho</p>
                <p>{stats.imoveis_alugados} imóveis alugados</p>
              </div>
              <div className="flex flex-col gap-2 text-[13px] text-[#1A535C]"><Link to="/perfil/meus-imoveis">Gerenciar imóveis</Link><Link to="/perfil/meus-anuncios">Gerenciar anúncios</Link></div>
            </PerfilCard>

            <PerfilCard titulo="Qualidade dos anúncios" descricao="Avaliação dos seus anúncios">
              <div className="mb-6 flex flex-col">
                <p className="mb-5 text-[12px] leading-relaxed text-[#2D2D2D]/70">A nota média é calculada pelo backend com base na qualidade dos anúncios.</p>
                <p className="mb-3 text-[13px] font-semibold text-[#2D2D2D]">Nota média de desempenho: {quality.toFixed(1)}</p>
                <div className="h-2 overflow-hidden rounded-full bg-[#E5E7EB]"><div className="h-full rounded-full bg-[#1A535C]" style={{ width: `${qualityPercent}%` }} /></div>
                <div className="mt-1 flex justify-between text-[11px] text-[#2D2D2D]/60"><span>0</span><span>10</span></div>
              </div>
              <Link to="/perfil/qualidade" className="text-[13px] text-[#1A535C]">Ver mais detalhes&gt;&gt;</Link>
            </PerfilCard>

            <PerfilCard titulo="Desempenho" descricao="Indicadores reais dos seus anúncios">
              <div className="flex flex-col gap-3 text-[13px] text-[#2D2D2D]/80"><p>{stats.anuncios_ativos} anúncios ativos</p><p>{stats.total_visualizacoes} visualizações</p><p>{stats.total_favoritos} favoritos</p></div>
            </PerfilCard>

            <PerfilCard titulo="Verificação da conta" descricao="Status dos dados de acesso">
              <div className="mb-6 flex flex-col gap-3 text-[13px] text-[#2D2D2D]/80"><p>Email: {user.email_verificado ? "verificado" : "pendente"}</p><p>Perfil: {user.role}</p><p>O CPF não é exibido por segurança.</p></div>
              <Link to="/perfil/seguranca" className="text-[13px] text-[#1A535C]">Ver detalhes de segurança</Link>
            </PerfilCard>
          </div>
        </div>
      </div>
    </div>
  );
}
