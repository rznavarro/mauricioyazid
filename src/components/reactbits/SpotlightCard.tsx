'use client';

/*
 * React Bits · SpotlightCard (variante TS + Tailwind), adaptado:
 * - Solo se activa en dispositivos con (hover: hover) y sin reduced-motion.
 * - La posición del foco se escribe por ref (sin re-render en cada mousemove).
 * - Sin colores ni padding fijos: los define quien lo usa.
 */

import React, { useRef } from 'react';

import { HOVER_QUERY, REDUCED_MOTION_QUERY, useMediaQuery } from '@/hooks/use-media-query';

interface SpotlightCardProps extends React.PropsWithChildren {
  className?: string;
  spotlightColor?: `rgba(${number}, ${number}, ${number}, ${number})`;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(255, 255, 255, 0.25)'
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const canHover = useMediaQuery(HOVER_QUERY);
  const reduceMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  const enabled = canHover && !reduceMotion;

  const setOpacity = (value: number) => {
    if (overlayRef.current) overlayRef.current.style.opacity = String(value);
  };

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = e => {
    if (!divRef.current || !overlayRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    overlayRef.current.style.background = `radial-gradient(circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, ${spotlightColor}, transparent 80%)`;
  };

  return (
    <div
      ref={divRef}
      onMouseMove={enabled ? handleMouseMove : undefined}
      onMouseEnter={enabled ? () => setOpacity(0.6) : undefined}
      onMouseLeave={enabled ? () => setOpacity(0) : undefined}
      className={`relative overflow-hidden ${className}`}
    >
      {enabled && (
        <div
          ref={overlayRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
};

export default SpotlightCard;
