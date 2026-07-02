import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Globe, LogIn } from "lucide-react";
import { Button, ButtonForms } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "../lib/hooks/useAuth";

function Field({ label, type = "text", placeholder, className = "", ...props }) {
  return (
    <label className={`flex flex-col gap-1 text-[14px] font-medium text-black sm:text-[16px] ${className}`}>
      <span>{label}</span>
      <Input
        type={type}
        placeholder={placeholder}
        className="h-[41px] rounded-[9px] border-primary bg-white px-2 text-[14px] font-light text-foreground shadow-none placeholder:text-black/60 focus-visible:ring-1 focus-visible:ring-primary sm:text-[15px]"
        {...props}
      />
    </label>
  );
}

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    login(); // Define isAuthenticated = true globalmente
    navigate("/"); // Redireciona para a página inicial
  };

  return (
    <main className="min-h-screen bg-accent px-4 py-6 sm:px-6 sm:py-8 lg:p-0 min-[1080px]:px-8 min-[1080px]:py-12">
      <section className="mx-auto grid w-full max-w-[1200px] overflow-hidden rounded-[8px] border border-[#515151]/80 bg-white shadow-[0_0_2.2px_0_#1A535C] lg:max-w-none lg:min-h-screen lg:grid-cols-2 lg:rounded-none lg:border-none lg:shadow-none min-[1080px]:max-w-[1200px] min-[1080px]:min-h-0 min-[1080px]:rounded-[8px] min-[1080px]:border min-[1080px]:border-[#515151]/80 min-[1080px]:shadow-[0_0_2.2px_0_#1A535C]">
        <aside className="flex min-h-[180px] items-center justify-center bg-primary px-8 py-10 text-center sm:min-h-[240px] lg:min-h-[560px]">
          <Link to="/" aria-label="Voltar para a página inicial">
            <img
              src="/logo_fundo_removido_aluguel360.svg"
              alt="Aluguel360"
              className="h-auto w-[240px] max-w-full sm:w-[320px] lg:w-[447px]"
            />
          </Link>
        </aside>

        <section className="flex items-center justify-center px-5 py-8 sm:px-8 sm:py-10 lg:min-h-[560px] lg:px-10">
          <form onSubmit={handleLogin} className="w-full max-w-[472px] space-y-5 rounded-[12px] border border-transparent bg-white p-0">
            <div className="w-full max-w-[472px] text-foreground/90">
              <h1 className="font-['Poppins'] text-[26px] font-semibold leading-normal sm:text-[32px]">Acessar</h1>
              <p className="font-['Inter'] text-[14px] leading-normal sm:text-[16px]">Entre com seus dados para continuar.</p>
            </div>

            <div className="grid w-full gap-5">
              <Field label="E-mail" type="email" placeholder="Digite o email" />

              <label className="flex flex-col gap-1 text-[14px] font-medium text-black sm:text-[16px]">
                <span>Senha</span>
                <div className="flex items-center rounded-[9px] border border-primary bg-white px-2 shadow-none focus-within:ring-1 focus-within:ring-primary">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite a senha"
                    className="h-[41px] flex-1 rounded-none border-0 bg-transparent px-0 text-[14px] font-light text-foreground shadow-none placeholder:text-black/60 focus-visible:ring-0 sm:text-[15px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="ml-2 rounded-full p-2 text-primary transition hover:bg-accent"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              <label className="flex items-center gap-2 text-[14px] text-foreground/90 sm:text-[16px]">
                <input type="checkbox" className="h-4 w-4 rounded border-primary text-primary focus:ring-primary" />
                Lembre-se de mim
              </label>
            </div>

            <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row sm:gap-5">
              <ButtonForms
                type="button"
                variant="danger"
                className="w-full sm:w-[128px]"
              >
                <Link to="/resultados">
                Cancelar
                </Link>
              </ButtonForms>

              <ButtonForms
                type="submit"
                className="w-full sm:w-[128px]"
              > 
                Entrar
              </ButtonForms>
             
            </div>

            <div className="flex items-center gap-3 text-[14px] text-[#515151] sm:text-[16px]">
              <div className="h-px flex-1 bg-[#D8E1E7]" />
              <span>ou</span>
              <div className="h-px flex-1 bg-[#D8E1E7]" />
            </div>

            <button
              type="button"
              className="h-[56px] w-full rounded-[9px] border-teal-light bg-teal-light text-[16px] font-medium text-foreground/90 shadow-[0_1px_6.1px_0_rgba(0,0,0,0.41)] hover:bg-[#44c2b9] sm:text-[18px]"
            >
              <svg className="mr-2 inline h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Acessar com Google
            </button>

            <div className="space-y-2 text-[14px] text-foreground sm:text-[16px]">
              <Link to="/recuperar-senha" className="block text-primary underline decoration-primary/30 underline-offset-4 hover:text-primary-light">
                Esqueceu a senha?
              </Link>
              <p>
                Ainda não tem conta?{' '} 
                <Link to="/cadastro" className="font-semibold text-primary underline decoration-primary/30 underline-offset-4 hover:text-primary-light">
                  Cadastre-se
                </Link>
              </p>
              <Link to="/" className="block text-primary hover:underline">Voltar à tela inicial</Link>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}
