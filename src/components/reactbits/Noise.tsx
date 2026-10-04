'use client';

/*
 * React Bits · Noise (variante TS + Tailwind), adaptado para rendimiento:
 * - El original regeneraba 1024×1024 píxeles con Math.random cada 2 frames.
 *   Aquí se pintan baldosas de `patternSize` como patrón con un desplazamiento
 *   aleatorio: mismo grano, una fracción del costo.
 * - Las baldosas se comparten entre todas las instancias y se generan solo cuando
 *   el canvas entra en pantalla (la primera al instante, el resto en tiempo libre).
 * - Ocupa su contenedor (no la ventana), se pausa fuera de pantalla o con la
 *   pestaña oculta, y queda estático con prefers-reduced-motion o animated={false}.
 * - patternAlpha va de 0 a 255 (15 ≈ 6 % de opacidad). Baldosa de 128 px por defecto.
 */

import React, { useEffect, useRef } from 'react';

interface NoiseProps {
  patternSize?: number;
  patternRefreshInterval?: number;
  patternAlpha?: number;
  animated?: boolean;
  className?: string;
}

const TILE_COUNT = 4;
const tileCache = new Map<string, HTMLCanvasElement[]>();

function createTile(size: number, alpha: number) {
  const tile = document.createElement('canvas');
  tile.width = size;
  tile.height = size;
  const ctx = tile.getContext('2d');
  if (!ctx) return tile;
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const value = Math.random() * 255;
    data[i] = value;
    data[i + 1] = value;
    data[i + 2] = value;
    data[i + 3] = alpha;
  }
  ctx.putImageData(imageData, 0, 0);
  return tile;
}

/** Baldosas compartidas por tamaño y opacidad; se van agregando a medida que se piden. */
function getTiles(size: number, alpha: number, count: number) {
  const key = `${size}:${alpha}`;
  const tiles = tileCache.get(key) ?? [];
  tileCache.set(key, tiles);
  while (tiles.length < count) tiles.push(createTile(size, alpha));
  return tiles;
}

const Noise: React.FC<NoiseProps> = ({
  patternSize = 128,
  patternRefreshInterval = 2,
  patternAlpha = 15,
  animated = true,
  className = ''
}) => {
  const grainRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const hasIdle = typeof window.requestIdleCallback === "function";
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const shouldAnimate = animated && !reduceMotion && patternRefreshInterval > 0;
    const patterns: CanvasPattern[] = [];

    const addPatterns = (count: number) => {
      const tiles = getTiles(patternSize, patternAlpha, count);
      for (let i = patterns.length; i < tiles.length; i++) {
        const pattern = ctx.createPattern(tiles[i], 'repeat');
        if (pattern) patterns.push(pattern);
      }
    };

    let tileIndex = 0;
    const drawGrain = () => {
      if (!patterns.length) return;
      const { width, height } = canvas;
      const offsetX = Math.random() * patternSize;
      const offsetY = Math.random() * patternSize;
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(-offsetX, -offsetY);
      ctx.fillStyle = patterns[tileIndex % patterns.length];
      ctx.fillRect(0, 0, width + patternSize, height + patternSize);
      ctx.restore();
      tileIndex = (tileIndex + 1) % patterns.length;
    };

    let sized = false;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.ceil(rect.width));
      canvas.height = Math.max(1, Math.ceil(rect.height));
      sized = true;
      drawGrain();
    };

    let frame = 0;
    let animationId = 0;
    let idleId = 0;
    let visible = false;

    const loop = () => {
      if (frame % patternRefreshInterval === 0) drawGrain();
      frame++;
      animationId = window.requestAnimationFrame(loop);
    };
    const start = () => {
      if (shouldAnimate && visible && !document.hidden && !animationId) animationId = window.requestAnimationFrame(loop);
    };
    const stop = () => {
      window.cancelAnimationFrame(animationId);
      animationId = 0;
    };

    // Las baldosas extra (para animar) se generan de a una en tiempo libre.
    const fillTilesWhenIdle = () => {
      if (!shouldAnimate || patterns.length >= TILE_COUNT) return;
      const next = () => {
        addPatterns(patterns.length + 1);
        if (patterns.length < TILE_COUNT) schedule();
      };
      const schedule = () => {
        idleId = hasIdle ? window.requestIdleCallback(next) : window.setTimeout(next, 200);
      };
      schedule();
    };

    const resizeObserver = new ResizeObserver(() => sized && resize());
    resizeObserver.observe(canvas);

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !patterns.length) {
        addPatterns(1);
        resize();
        fillTilesWhenIdle();
      }
      if (visible) start();
      else stop();
    });
    intersection.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      if (idleId && hasIdle) window.cancelIdleCallback(idleId);
      else if (idleId) window.clearTimeout(idleId);
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [patternSize, patternRefreshInterval, patternAlpha, animated]);

  return (
    <canvas
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      ref={grainRef}
    />
  );
};

export default Noise;
