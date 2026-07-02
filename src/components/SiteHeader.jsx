import { useState } from "react";
import { Link } from "react-router-dom";
import { LogIn, MapPin, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconeAnunciar } from "./IconeAnunciar";
import { IconeNotificacao } from "./IconeNotificacao";
import { IconePerfil } from "./IconePerfil";

function BrandBlock() {
  return (
    <div className="flex shrink-0 flex-col items-start justify-center">
      <Link
        to="/"
        className="block w-[129px] px-4 py-1.5 overflow-hidden rounded-full bg-primary"
        aria-label="Aluguel360"
      >
        <img
          src="/logo_fundo_removido_aluguel360.svg"
          alt="Aluguel360"
          className="h-full w-full object-cover"
        />
      </Link>
      <span className="mt-1 flex max-w-[112px] items-start gap-1 font-['Inter'] text-[12px] font-light leading-tight text-black">
        <MapPin className="mt-0.5 h-[22px] w-[22px] shrink-0 text-foreground" />
        Informe o Endereço
      </span>
    </div>
  );
}

function SearchNavigation() {
  return (
    <div className="flex w-full max-w-[443px] flex-1 flex-col items-center gap-2">
      <div className="flex h-[42px] w-full items-center overflow-hidden rounded-[9px] border border-primary px-2 pr-4 shadow-[0_0_4px_0_rgba(0,0,0,0.25)] focus-within:ring-1 focus-within:ring-primary">
        <Input
          type="text"
          placeholder="Busque por cidade, bairro ou tipo de imóvel..."
          className="h-full rounded-none border-0 px-0 font-['Poppins'] text-[14px] text-[#515151]/80 shadow-none placeholder:text-[#515151]/80 focus-visible:ring-0"
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full bg-white text-primary hover:bg-accent"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
      <nav className="flex flex-wrap justify-center gap-x-9 gap-y-2 font-['Inter'] text-[12px] text-foreground/90">
        <Link to="/" className="transition-colors hover:text-primary">
          Página inicial
        </Link>
        <Link to="#footer" className="transition-colors hover:text-primary">
          Contate-nos
        </Link>
        <Link to="/about" className="transition-colors hover:text-primary">
          Sobre nós
        </Link>
      </nav>
    </div>
  );
}

function GuestActions() {
  return (
    <div className="flex shrink-0 flex-col items-end gap-1 w-full lg:w-auto">
      <div className="flex flex-wrap items-center justify-end gap-3 w-full lg:w-auto">
        <Button
          asChild
          className="h-8 w-[139px] rounded-[9px] bg-accent font-['Poppins'] text-[16px] font-normal text-foreground/90 shadow-[0_0_2.5px_0_rgba(0,0,0,0.41)] hover:bg-[#CAEBEC]"
        >
          <Link to="/cadastro">Cadastrar-se</Link>
        </Button>
        <Button
          asChild
          className="h-8 w-[109px] gap-2 rounded-[9px] bg-primary font-['Poppins'] text-[16px] font-normal text-accent shadow-[0_0_6.1px_0_rgba(0,0,0,0.41)] hover:bg-primary-light"
        >
          <Link to="/login">
            <LogIn className="h-5 w-5" /> Entrar
          </Link>
        </Button>
      </div>
      <Link to="#"
        className="font-['Inter'] text-[12px] text-foreground/90 transition-colors hover:text-primary pr-2"
      >
        Quero anunciar
      </Link>
    </div>
  );
}

function AuthenticatedActions() {
  return (
    <div className="flex shrink-0 flex-col items-end gap-2 w-full lg:w-auto">
      <div className="flex items-center gap-3 w-full justify-end lg:w-auto">
        <Link to="perfil/cadastro-imovel">
          <Button
            variant="ghost"
            className="h-8 gap-1 rounded-[9px] px-2 font-['Poppins'] text-[12px] text-primary hover:bg-accent"
          >
            <IconeAnunciar />
            Quero Anunciar
          </Button>
        </Link>

        <Button
          asChild
          className="h-[30px] w-[105px] gap-1 rounded-[9px] bg-accent px-1 font-['Poppins'] text-[12px] text-foreground/90 shadow-[0_0_2.5px_0_rgba(0,0,0,0.41)] hover:bg-[#CAEBEC]"
        >
          <Link to="/perfil">
            Meu Perfil
            <IconePerfil />
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-end gap-4 pr-1 font-['Inter'] text-[12px] text-foreground/90 w-full lg:w-auto">
        <Link to="/perfil/meus-anuncios" className="transition-colors hover:text-primary">
          Meus anúncios
        </Link>

        <Link to="#" className="flex items-center gap-1 transition-colors hover:text-primary">
          <IconeNotificacao />
          Notificações
        </Link>
      </div>
    </div>
  );
}

export function SiteHeader({ isAuthenticated = false }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-primary/30 bg-white shadow-header">
      {/* Desktop & Mobile Header Container */}
      <div className="mx-auto flex min-h-[92px] max-w-[1037px] items-center justify-between px-4 py-3 lg:py-0">

        {/* Left: Brand */}
        <BrandBlock />

        {/* Mobile Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className="text-primary lg:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        {/* Desktop: Center & Right */}
        <div className="hidden flex-1 items-center justify-between gap-4 pl-8 lg:flex">
          <div className="flex flex-1 justify-center">
            <SearchNavigation />
          </div>
          <div className="flex shrink-0 justify-end">
            {isAuthenticated ? <AuthenticatedActions /> : <GuestActions />}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="flex flex-col items-center gap-6 border-t border-primary/10 bg-white px-4 py-6 shadow-md lg:hidden">
          <SearchNavigation />
          {isAuthenticated ? <AuthenticatedActions /> : <GuestActions />}
        </div>
      )}
    </header>
  );
}
