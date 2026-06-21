import { PerfilHeader } from "../components/PerfilHeader";
import { PerfilSidebar } from "../components/PerfilSidebar";
import { PerfilCard } from "../components/PerfilCard";
import { Edit } from "lucide-react";
import { Link } from "react-router-dom";

const usuarioMock = {
  nome: "Fulano de Tal",
  email: "fulanodetal@gmail.com",
  iniciais: "FT",
  dataCadastro: "01/02/2023",
  cpf: "123.***.***-10"
};

export function Perfil() {
  return (

    /*
      const menuItems = [
    { label: "Perfil", icon: User, path: "/perfil" },
    { label: "Endereços", icon: MapPin, path: "/perfil/enderecos" },
    { label: "Meus Imóveis", icon: Home, path: "/perfil/meus-imoveis" },
    { label: "Meus Anúncios", icon: FileText, path: "/perfil/meus-anuncios" },
    { label: "Fotos e Mídias", icon: ImageIcon, path: "/perfil/midia" },
    { label: "Qualidade dos Anúncios", icon: Star, path: "/perfil/qualidade" },
    { label: "Segurança", icon: Lock, path: "/perfil/seguranca" },
    { label: "Configurações", icon: Settings, path: "/perfil/configuracoes" },
  ];
    */
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
      {/* Main Layout Grid */}
      <div className="grid gap-8 min-[1080px]:grid-cols-[200px_minmax(0,1fr)]">
        {/* Sidebar Left */}
        <PerfilSidebar />

        {/* Content Right */}
        <div className="flex flex-col min-w-0">
          {/* Header */}
          <PerfilHeader usuario={usuarioMock} />

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {/* LINHA 1 */}
            {/* Informações do Perfil */}
            <PerfilCard
              titulo="Informações do perfil"
              descricao="Acesse seus dados pessoais"
            >
              <div className="flex flex-col gap-2.5 mb-6">
                <p className="font-['Inter'] text-[13px] text-[#2D2D2D]">
                  <span className="font-semibold mr-1">Nome:</span> Fulano de Tal
                </p>
                <p className="font-['Inter'] text-[13px] text-[#2D2D2D]">
                  <span className="font-semibold mr-1">CPF:</span> 123.***.***-10
                </p>
                <p className="font-['Inter'] text-[13px] text-[#2D2D2D]">
                  <span className="font-semibold mr-1">Data de Cadastro:</span> 01/02/2023
                </p>
              </div>
              <button className="flex items-center gap-1.5 font-['Inter'] text-[13px] text-[#1A535C] hover:text-[#2F646C] transition">
                <Edit className="h-3.5 w-3.5" />
                Alterar Dados
              </button>
            </PerfilCard>

            {/* Endereços */}
            <PerfilCard
              titulo="Endereços"
              descricao="Endereços associados à sua conta"
            >
              <div className="flex flex-col gap-3 mb-6">
                <p className="font-['Inter'] text-[13px] text-[#2D2D2D]">
                  2 endereços cadastrados
                </p>
                <div>
                  <p className="font-['Inter'] text-[13px] font-semibold text-[#2D2D2D] mb-0.5">
                    Endereço Principal
                  </p>
                  <p className="font-['Inter'] text-[13px] text-[#2D2D2D]/80 leading-relaxed">
                    Rua Elias Oka 1354, 123, Irapuã- Floriano- PI<br />CEP:64800-971
                  </p>
                </div>
              </div>
              <Link to="/perfil/enderecos">
                <button className="flex items-center gap-1.5 font-['Inter'] text-[13px] text-[#1A535C] hover:text-[#2F646C] transition">
                  <Edit className="h-3.5 w-3.5" />
                  Gerenciar Endereços
                </button>
              </Link>
            </PerfilCard>

            {/* Segurança */}
            <PerfilCard
              titulo="Segurança"
              descricao="Configurações de segurança da sua conta"
            >
              <div className="flex flex-col gap-3 mb-6">
                <p className="font-['Inter'] text-[13px] text-[#2D2D2D]/80">
                  1 Método de verificação da conta
                </p>
                <p className="font-['Inter'] text-[13px] text-[#2D2D2D]/80">
                  0 dispositivos vinculados
                </p>
                <p className="font-['Inter'] text-[13px] text-[#2D2D2D]/80">
                  0 Alertas de Segurança
                </p>
                <p className="font-['Inter'] text-[13px] text-[#2D2D2D]/80">
                  Permissão de localização: Ativada
                </p>
              </div>
              <Link to="/perfil/seguranca">
                <button className="flex items-center gap-1.5 font-['Inter'] text-[13px] text-[#1A535C] hover:text-[#2F646C] transition">
                  <Edit className="h-3.5 w-3.5" />
                  Ver mais detalhes
                </button>
              </Link>
            </PerfilCard>

            {/* LINHA 2 */}
            {/* Meu Imóveis */}
            <PerfilCard
              titulo="Meu Imóveis"
              descricao="Imóveis associados à sua conta"
            >
              <div className="flex flex-col gap-3 mb-6">
                <p className="font-['Inter'] text-[13px] text-[#2D2D2D]/80">
                  3 imóveis cadastrados
                </p>
                <p className="font-['Inter'] text-[13px] text-[#2D2D2D]/80">
                  2 imóveis Anunciados
                </p>
                <p className="font-['Inter'] text-[13px] text-[#2D2D2D]/80">
                  1 cadastro em rascunho
                </p>
                <p className="font-['Inter'] text-[13px] text-[#2D2D2D]/80">
                  1 Alugado
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Link to="/perfil/meus-imoveis">
                  <button className="flex items-center gap-1.5 font-['Inter'] text-[13px] text-[#1A535C] hover:text-[#2F646C] transition w-fit">
                    <Edit className="h-3.5 w-3.5" />
                    Gerenciar imóveis
                  </button>
                </Link>
                <Link to="/perfil/meus-anuncios">
                  <button className="flex items-center gap-1.5 font-['Inter'] text-[13px] text-[#1A535C] hover:text-[#2F646C] transition w-fit">
                    <Edit className="h-3.5 w-3.5" />
                    Gerenciar Anuncios
                  </button>
                </Link>
              </div>
            </PerfilCard>

            {/* Qualidade dos anúncios */}
            <PerfilCard
              titulo="Qualidade dos anúncios"
              descricao="Avaliação dos seus anúncios"
            >
              <div className="flex flex-col mb-6">
                <p className="font-['Inter'] text-[12px] text-[#2D2D2D]/70 mb-5 leading-relaxed">
                  A nota de desempenho é calculada usando a qualidade e detalhes das informações fornecidas e pelos usuários que acessaram seu anuncios
                </p>

                <p className="font-['Inter'] text-[13px] font-semibold text-[#2D2D2D] mb-3">
                  Nota média de desempenho
                </p>

                <div className="relative pt-1">
                  <div className="h-2 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div className="h-full bg-[#1A535C] rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <div className="flex justify-between mt-1 font-['Inter'] text-[11px] text-[#2D2D2D]/60">
                    <span>0</span>
                    <span className="ml-[70%]">8.5</span>
                    <span>10</span>
                  </div>
                </div>
              </div>
              <Link to="/perfil/qualidade">
                <button className="font-['Inter'] text-[13px] text-[#1A535C] hover:text-[#2F646C] transition">
                  Ver mais detalhes&gt;&gt;
                </button>
              </Link>
            </PerfilCard>

            {/* Privacidade */}
            <PerfilCard
              titulo="Privacidade"
              descricao="Preferências e controle do uso de seus dados"
            >
              <div className="flex flex-col gap-3 mb-6">
                <p className="font-['Inter'] text-[13px] text-[#2D2D2D]/80">
                  Dados de localização essenciais para gestão
                </p>
                <p className="font-['Inter'] text-[13px] text-[#2D2D2D]/80">
                  Informações sobre a navegação na plataforma
                </p>
                <p className="font-['Inter'] text-[13px] text-[#2D2D2D]/80">
                  0 Alertas de Segurança
                </p>
                <p className="font-['Inter'] text-[13px] text-[#2D2D2D]/80">
                  Permissão de localização: Ativada
                </p>
              </div>
              <button className="flex items-center gap-1.5 font-['Inter'] text-[13px] text-[#1A535C] hover:text-[#2F646C] transition">
                <Edit className="h-3.5 w-3.5" />
                Gerenciar permissões
              </button>
            </PerfilCard>

            {/* LINHA 3 */}
            {/* Fotos e Mídias */}
            <PerfilCard
              titulo="Fotos e Mídias"
              descricao="Mídias enviadas para seus imóveis"
            >
              <div className="flex flex-col gap-2 mb-6">
                <p className="font-['Inter'] text-[13px] text-[#2D2D2D]/80">
                  12 Fotos enviadas
                </p>
                <p className="font-['Inter'] text-[13px] text-[#2D2D2D]/80">
                  3 vídeos enviados
                </p>
              </div>
              <Link to="/perfil/midia">
                <button className="font-['Inter'] text-[13px] text-[#1A535C] hover:text-[#2F646C] transition">
                  Ver mais detalhes&gt;&gt;
                </button>
              </Link>
            </PerfilCard>

          </div>
        </div>
      </div>
    </div>
  );
}
