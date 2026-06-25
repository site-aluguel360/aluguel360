import { MenuLogin } from "../components/MenuLogin";
import { CardCadastroImovel } from "../components/CardCadastroImovel";

export function CadastroImovel() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#eef2f5] px-3 py-2 sm:px-4">
      <div className="mx-auto w-full min-w-0 max-w-7xl">
        <MenuLogin />

        <div className="mt-1 min-w-0">
          <CardCadastroImovel />
        </div>
      </div>
    </main>
  );
  
}