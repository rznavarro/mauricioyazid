"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// Registro único de plugins. Todo el sitio importa GSAP desde aquí.
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

// Evita recalcular (y saltos) cuando la barra del navegador móvil aparece o desaparece.
ScrollTrigger.config({ ignoreMobileResize: true });

/** Condiciones de gsap.matchMedia() usadas en todas las secciones. */
export const MQ = {
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
} as const;

export type MQConditions = { [K in keyof typeof MQ]: boolean };

export { gsap, ScrollTrigger, SplitText, useGSAP };
