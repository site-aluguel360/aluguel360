import { Button } from "./button";
import { ArrowRight } from "lucide-react";
export function QueroAnunciar() {
  return (
    <Button
      className="
        h-10
        w-[162px]
        gap-1
         items-center
          justify-center
        rounded-[9px]
        bg-[#1A535C]
        text-[#F0F4F8]
        text-[16px]
        font-normal
        hover:bg-[#2F646C]
      "
   >
  Quero anunciar
  <ArrowRight size={16} />
</Button>
  );
}