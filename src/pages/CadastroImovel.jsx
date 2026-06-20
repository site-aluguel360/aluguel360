import { MenuLogin } from "../components/MenuLogin";
import { CardCadastroImovel } from "../components/CardCadastroImovel";

export function CadastroImovel() {
  return (
    <main className="min-h-screen bg-[#eef2f5] px-4 py-4 sm:px-6">
      <div className="mx-auto max-w-[1400px]">
        <MenuLogin />

        <div className="mt-3">
          <CardCadastroImovel />
        </div>
      </div>
    </main>
  );
}