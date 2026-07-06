import { Edit } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export function PerfilHeader({ usuario = {} }) {
  const {
    nome = "Fulano de Tal",
    email = "fulanodetal@gmail.com",
    iniciais = "FT",
  } = usuario;

  return (
    <div className="mb-8 bg-transparent">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="flex h-[70px] w-[70px] items-center justify-center rounded-full bg-teal-light font-['Poppins'] text-[28px] font-semibold text-foreground">
            {iniciais}
          </div>

          {/* Informações Básicas */}
          <div className="flex flex-col gap-0.5">
            <h2 className="font-['Outfit'] text-[24px] font-medium text-foreground">
              {nome}
            </h2>
            <p className="font-['Inter'] text-[14px] font-normal text-foreground/70">
              {email}
            </p>
            <p className="font-['Inter'] text-[12px] text-foreground/60 mt-1">
              Cadastro incompleto, vamos{" "}
              <button className="font-semibold text-primary hover:text-primary-light underline transition">
                Completar seu Cadastro
              </button>
            </p>
          </div>
        </div>

        {/* Botão de Editar */}
        <Link to="/perfil/editar">
          <Button
            variant="outline"
            className="gap-2 border-[#D8E1E7] text-foreground/80 hover:bg-accent hover:text-foreground rounded-[6px] h-[36px] px-4 font-['Inter'] font-medium"
          >
            <Edit className="h-4 w-4" />
            Editar Perfil
          </Button>
        </Link>
      </div>
    </div>
  );
}
