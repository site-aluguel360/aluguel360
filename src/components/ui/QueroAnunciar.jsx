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
        bg-primary
        text-accent
        text-[16px]
        font-normal
        hover:bg-primary-light
      "
   >
  Quero anunciar
  <ArrowRight size={16} />
</Button>
  );
}