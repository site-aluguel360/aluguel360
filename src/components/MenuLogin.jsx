import { IconePerfil } from "./IconePerfil";

export function MenuLogin() {
  return (
    <header className="rounded-[12px] border border-[#e1e6ea] bg-white shadow-[0_2px_8px_rgba(26,83,92,0.08)]">
      <div className="mx-auto flex items-center justify-between px-4 py-4 sm:px-6">

        <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[#1A535C]">
          Aluguel360
        </h1>

        <div className="flex items-center gap-3">
          <span className="text-[18px] text-[#111]">
            Olá, José!
          </span>

          <div className="scale-[1.55]">
            <IconePerfil />
          </div>
        </div>

      </div>
    </header>
  );
}