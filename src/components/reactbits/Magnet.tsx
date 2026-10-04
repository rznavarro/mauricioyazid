'use client';

/*
 * React Bits · Magnet (variante TS + Tailwind), adaptado:
 * - Solo en escritorio con (hover: hover) y sin reduced-motion; en el resto queda inerte.
 * - La posición se escribe por ref (sin re-render en cada mousemove).
 */

import React, { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';

const MAGNET_QUERY = '(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

interface MagnetProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  wrapperClassName?: string;
  innerClassName?: string;
}

const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.5s ease-in-out',
  wrapperClassName = '',
  innerClassName = '',
  ...props
}) => {
  const magnetRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const allowed = useMediaQuery(MAGNET_QUERY);
  const enabled = allowed && !disabled;

  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    const move = (x: number, y: number, active: boolean) => {
      inner.style.transition = active ? activeTransition : inactiveTransition;
      inner.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    if (!enabled) {
      move(0, 0, false);
      return;
    }

    let active = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (!magnetRef.current) return;

      const { left, top, width, height } = magnetRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const distX = Math.abs(centerX - e.clientX);
      const distY = Math.abs(centerY - e.clientY);

      if (distX < width / 2 + padding && distY < height / 2 + padding) {
        active = true;
        move((e.clientX - centerX) / magnetStrength, (e.clientY - centerY) / magnetStrength, true);
      } else if (active) {
        active = false;
        move(0, 0, false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [enabled, padding, magnetStrength, activeTransition, inactiveTransition]);

  return (
    <div
      ref={magnetRef}
      className={wrapperClassName}
      style={{ position: 'relative', display: 'inline-block' }}
      {...props}
    >
      <div ref={innerRef} className={innerClassName} style={{ willChange: enabled ? 'transform' : undefined }}>
        {children}
      </div>
    </div>
  );
};

export default Magnet;
