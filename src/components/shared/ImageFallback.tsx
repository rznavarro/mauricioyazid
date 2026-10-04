import type { CSSProperties } from "react";
import { cn } from "cn";

import Noise from "@/components/reactbits/Noise";

type ImageFallbackProps = {
  /** Texto en Anton con contorno: "MY" en el hero, "01"… en las etapas. */
  label: string;
  outlineColor: string;
  className?: string;
  labelClassName?: string;
};

/** Panel #151517 con textura Noise que reemplaza a una imagen faltante. Ocupa exactamente el mismo espacio (CLS = 0). */
export function ImageFallback({ label, outlineColor, className, labelClassName }: ImageFallbackProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative flex h-full w-full items-center justify-center overflow-hidden bg-surface", className)}
    >
      <Noise animated={false} patternAlpha={18} />
      <span
        className={cn("type-display text-outline relative select-none", labelClassName)}
        style={{ "--outline-color": outlineColor } as CSSProperties}
      >
        {label}
      </span>
    </div>
  );
}
