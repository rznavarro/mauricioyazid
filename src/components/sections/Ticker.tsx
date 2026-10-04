"use client";

import { useEffect, useRef } from "react";

import { ticker } from "@/content/site";
import { deferTask, wakeRender } from "@/lib/defer";
import { LazyScrollVelocity } from "@/components/reactbits/lazy";

const mapping = { input: [0, 1000] as [number, number], output: [0, 3] as [number, number] };

/** Banda decorativa: repite textos que ya están en el sitio. Estática con reduced-motion. */
export function Ticker() {
  const ref = useRef<HTMLDivElement>(null);

  // Render diferido como las secciones vecinas: se activa en su turno de la cola.
  useEffect(() => deferTask(() => wakeRender(ref.current)), []);

  return (
    <div ref={ref} data-defer-render aria-hidden="true" className="overflow-hidden border-y border-border py-8 select-none lg:py-12">
      <LazyScrollVelocity
        texts={[ticker.rowA]}
        velocity={40}
        numCopies={6}
        velocityMapping={mapping}
        className="type-display text-[clamp(3.5rem,9vw,7rem)] leading-[1.05] text-primary"
      />
      <LazyScrollVelocity
        texts={[ticker.rowB]}
        velocity={-40}
        numCopies={4}
        velocityMapping={mapping}
        className="type-display text-outline text-[clamp(3.5rem,9vw,7rem)] leading-[1.05] [--outline-color:rgb(245_245_242/0.4)]"
      />
    </div>
  );
}
