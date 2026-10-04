"use client";

/*
 * Carga diferida de los componentes de React Bits que dependen de motion
 * (ScrollVelocity y CountUp). motion queda fuera del JavaScript inicial:
 * - El HTML del servidor muestra la versión en reposo (filas quietas, cifra final),
 *   con la misma estructura, así que el cambio no mueve nada (CLS = 0).
 * - El componente animado se descarga en el primer momento libre tras la hidratación.
 * - Con prefers-reduced-motion no se descarga: la versión en reposo es la definitiva.
 */

import { useEffect, useState, type ComponentProps, type ReactNode } from "react";
import dynamic from "next/dynamic";

import { REDUCED_MOTION_QUERY, useMediaQuery } from "@/hooks/use-media-query";
import type { ScrollVelocity as ScrollVelocityType } from "./ScrollVelocity";
import type CountUpType from "./CountUp";

const ScrollVelocity = dynamic(() => import("./ScrollVelocity").then((m) => m.ScrollVelocity), { ssr: false });
const CountUp = dynamic(() => import("./CountUp"), { ssr: false });

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

/** true después del primer momento libre tras montar (nunca con reduced-motion). */
function useIdleActivation() {
  const reduceMotion = useMediaQuery(REDUCED_MOTION_QUERY, true);
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    if (reduceMotion || idle) return;
    const w = window as IdleWindow;
    if (w.requestIdleCallback && w.cancelIdleCallback) {
      const id = w.requestIdleCallback(() => setIdle(true), { timeout: 2000 });
      return () => w.cancelIdleCallback?.(id);
    }
    const timer = window.setTimeout(() => setIdle(true), 300);
    return () => window.clearTimeout(timer);
  }, [reduceMotion, idle]);

  return idle && !reduceMotion;
}

type ScrollVelocityProps = ComponentProps<typeof ScrollVelocityType>;

/** Misma estructura que ScrollVelocity, sin movimiento. */
function ScrollVelocityStatic({
  texts,
  className = "",
  numCopies = 6,
  parallaxClassName = "parallax",
  scrollerClassName = "scroller",
}: ScrollVelocityProps) {
  return (
    <div>
      {texts.map((text: ReactNode, index: number) => (
        <div key={index} className={`${parallaxClassName} relative overflow-hidden`}>
          <div className={`${scrollerClassName} flex whitespace-nowrap`}>
            {Array.from({ length: numCopies }, (_, i) => (
              <span key={i} className={`flex-shrink-0 ${className}`}>
                {text}&nbsp;
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function LazyScrollVelocity(props: ScrollVelocityProps) {
  const active = useIdleActivation();
  return active ? <ScrollVelocity {...props} /> : <ScrollVelocityStatic {...props} />;
}

type CountUpProps = ComponentProps<typeof CountUpType>;

export function LazyCountUp(props: CountUpProps) {
  const active = useIdleActivation();
  const { to, from = 0, direction = "up", className = "" } = props;
  return active ? <CountUp {...props} /> : <span className={className}>{direction === "down" ? from : to}</span>;
}
