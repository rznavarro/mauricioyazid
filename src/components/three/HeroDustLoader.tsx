"use client";

import { Component, useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";

import { MQ } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/use-media-query";

// Three.js nunca se renderiza en el servidor ni entra al bundle inicial.
const HeroDust = dynamic(() => import("./HeroDust"), { ssr: false, loading: () => null });

/** Si WebGL falla, no se muestra nada: queda el resplandor radial estático detrás del retrato. */
class DustErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

/** Monta HeroDust solo en escritorio con movimiento permitido, después del primer pintado. */
export function HeroDustLoader({ className }: { className?: string }) {
  const desktop = useMediaQuery(MQ.desktop);
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    if (!desktop || idle) return;
    const w = window as IdleWindow;
    if (w.requestIdleCallback && w.cancelIdleCallback) {
      const id = w.requestIdleCallback(() => setIdle(true), { timeout: 2500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const timer = window.setTimeout(() => setIdle(true), 1200);
    return () => window.clearTimeout(timer);
  }, [desktop, idle]);

  if (!desktop || !idle) return null;

  return (
    <DustErrorBoundary>
      <HeroDust className={className} />
    </DustErrorBoundary>
  );
}
