import { Link, Outlet } from "react-router-dom";
import { MapPin } from "lucide-react";
import { SiteHeader } from "./SiteHeader";
import { useAuth } from "../contexts/AuthContext";

export function Layout() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <SiteHeader isAuthenticated={isAuthenticated} />

      <main className="flex flex-1 flex-col bg-background">
        <Outlet />
      </main>

      <footer id="footer" className="bg-primary px-6 pb-6 pt-16 text-white">
        <div className="mx-auto mb-12 grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-4">
          <div className="flex flex-col">
            <div className="mb-6 inline-block w-max rounded-full bg-secondary px-4 py-1.5 text-lg font-bold text-white">
              Aluguel360
            </div>
            <p className="mb-3 text-sm opacity-80">
              Uma plataforma simples e segura para anunciar e encontrar imóveis para aluguel.
            </p>
            <p className="text-xs opacity-60">
              Nosso objetivo é padronizar anúncios, melhorar a qualidade das informações.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="mb-2 text-lg font-semibold">Para usuário</h4>
            <Link to="#" className="text-sm opacity-80 hover:opacity-100 hover:underline">
              Anunciar imóvel
            </Link>
            <Link to="/resultados" className="text-sm opacity-80 hover:opacity-100 hover:underline">
              Buscar imóveis
            </Link>
            <Link to="#" className="text-sm opacity-80 hover:opacity-100 hover:underline">
              Como funciona
            </Link>
            <Link to="#" className="text-sm opacity-80 hover:opacity-100 hover:underline">
              Dicas para um bom anúncio
            </Link>
            <Link to="#" className="text-sm opacity-80 hover:opacity-100 hover:underline">
              Central de ajuda
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="mb-2 text-lg font-semibold">Conta e segurança</h4>
            <Link to="/login" className="text-sm opacity-80 hover:opacity-100 hover:underline">
              Meu perfil
            </Link>
            <Link to="#" className="text-sm opacity-80 hover:opacity-100 hover:underline">
              Meus anúncios
            </Link>
            <Link to="#" className="text-sm opacity-80 hover:opacity-100 hover:underline">
              Privacidade e Dados
            </Link>
            <Link to="#" className="text-sm opacity-80 hover:opacity-100 hover:underline">
              Termos de uso
            </Link>
            <Link to="#" className="text-sm opacity-80 hover:opacity-100 hover:underline">
              Política de privacidade
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="mb-2 text-lg font-semibold">Contato e suporte</h4>
            <p className="flex items-start gap-2 text-sm opacity-80">
              <MapPin className="mt-0.5 h-4 w-4" /> suporte@aluguel360.com.br
            </p>
            <p className="flex items-start gap-2 text-sm opacity-80">
              <MapPin className="mt-0.5 h-4 w-4" /> Atendimento segunda à sexta, das 9h às 18h
            </p>
            <p className="flex items-start gap-2 text-sm opacity-80">
              <MapPin className="mt-0.5 h-4 w-4" /> Plataforma disponível em todo o Brasil
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-7xl border-t border-white/10 pt-6 text-center text-xs opacity-60">
          &copy; 2026 Aluguel360 - Todos os direitos reservados. Projeto acadêmico para fins educacionais.
        </div>
      </footer>
    </div>
  );
}
