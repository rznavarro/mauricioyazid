"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type Lenis from "lenis";

import { gsap, MQ, ScrollTrigger } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);

/** Instancia global de Lenis, o null con prefers-reduced-motion: reduce. */
export function useLenis() {
  return useContext(LenisContext);
}

/** Única instancia de Lenis del sitio, sincronizada con ScrollTrigger mediante gsap.ticker. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const reduceQuery = window.matchMedia(MQ.reduce);
    let cancelled = false;
    let starting = false;
    let instance: Lenis | null = null;
    let raf: ((time: number) => void) | null = null;

    // Lenis se descarga aparte (no va en el JavaScript inicial).
    const start = async () => {
      if (instance || starting) return;
      starting = true;
      const { default: LenisClass } = await import("lenis");
      starting = false;
      if (cancelled || instance || reduceQuery.matches) return;
      const created = new LenisClass({ lerp: 0.1, smoothWheel: true });
      created.on("scroll", ScrollTrigger.update);
      raf = (time: number) => created.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      instance = created;
      setLenis(created);
    };

    const stop = () => {
      if (raf) gsap.ticker.remove(raf);
      instance?.destroy();
      gsap.ticker.lagSmoothing(500, 33);
      raf = null;
      instance = null;
      setLenis(null);
    };

    // Con reduced-motion, Lenis no se inicializa. Se crea en el primer momento libre:
    // su constructor lee la posición de scroll y forzaría un layout durante la hidratación.
    const hasIdle = typeof window.requestIdleCallback === "function";
    const startWhenIdle = () => {
      if (!reduceQuery.matches) void start();
    };
    const idleId = hasIdle ? window.requestIdleCallback(startWhenIdle, { timeout: 500 }) : window.setTimeout(startWhenIdle, 100);
    const onReduceChange = () => (reduceQuery.matches ? stop() : void start());
    reduceQuery.addEventListener("change", onReduceChange);

    // Recalcular posiciones cuando cargan las fuentes y las imágenes. ScrollTrigger ya se
    // recalcula solo en el evento load; aquí se cubre lo que llega después (fuentes tardías
    // e imágenes con lazy loading).
    let refreshTimer = 0;
    const scheduleRefresh = () => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => {
        if (!cancelled) ScrollTrigger.refresh();
      }, 150);
    };
    document.fonts?.ready.then(() => {
      if (document.readyState === "complete") scheduleRefresh();
    });
    const onImageLoad = (event: Event) => {
      if (event.target instanceof HTMLImageElement) scheduleRefresh();
    };
    document.addEventListener("load", onImageLoad, true);

    return () => {
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
      window.clearTimeout(refreshTimer);
      reduceQuery.removeEventListener("change", onReduceChange);
      document.removeEventListener("load", onImageLoad, true);
      stop();
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
