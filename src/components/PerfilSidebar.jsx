import { Link, useLocation } from "react-router-dom";
import {
  User,
  MapPin,
  Home,
  FileText,
  Image as ImageIcon,
  Star,
  Lock,
  Settings,
} from "lucide-react";

export function PerfilSidebar() {
  const location = useLocation();

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

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="hidden min-[1080px]:flex min-[1080px]:sticky min-[1080px]:top-6 self-start flex-col w-[200px]">
      <h3 className="font-['Inter'] text-[14px] font-semibold text-[#2D2D2D] mb-4">
        Minha conta
      </h3>

      <nav className="flex flex-col gap-0.5">
        {menuItems.map(({ label, icon: Icon, path }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center gap-2.5 rounded-md px-2 py-2 font-['Inter'] text-[13px] transition-all duration-200 ${isActive(path)
                ? "bg-[#CAEBEC] text-[#1A535C] font-semibold"
                : "text-[#2D2D2D]/80 hover:bg-[#F0F4F8] hover:text-[#1A535C]"
              }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
