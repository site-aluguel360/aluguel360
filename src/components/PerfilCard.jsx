export function PerfilCard({
  titulo,
  descricao,
  children,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] ${className}`}
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-['Outfit'] text-[16px] font-semibold text-[#111827]">
          {titulo}
        </h3>
        {descricao && (
          <p className="font-['Inter'] text-[13px] text-[#6B7280] mt-0.5">
            {descricao}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
