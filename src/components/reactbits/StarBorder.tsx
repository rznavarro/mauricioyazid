'use client';

/*
 * React Bits · StarBorder (variante TS + Tailwind), adaptado:
 * - Envuelve a un botón existente (as="div"): el contenido interior no recibe
 *   padding, fondo ni borde fijos. Las keyframes viven en globals.css.
 * - Con prefers-reduced-motion la animación se detiene (regla global de CSS).
 */

import React from 'react';

type StarBorderProps = React.HTMLAttributes<HTMLElement> & {
  as?: 'button' | 'div';
  className?: string;
  innerClassName?: string;
  children?: React.ReactNode;
  color?: string;
  speed?: React.CSSProperties['animationDuration'];
  thickness?: number;
};

const StarBorder = ({
  as,
  className = '',
  innerClassName = '',
  color = 'white',
  speed = '6s',
  thickness = 1,
  children,
  ...rest
}: StarBorderProps) => {
  const Component = as || 'button';

  return (
    <Component
      className={`relative inline-block overflow-hidden ${className}`}
      {...rest}
      style={{
        padding: `${thickness}px`,
        ...rest.style
      }}
    >
      <div
        aria-hidden="true"
        className="animate-star-movement-bottom absolute right-[-250%] bottom-[-11px] z-0 h-[50%] w-[300%] rounded-full opacity-70"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed
        }}
      ></div>
      <div
        aria-hidden="true"
        className="animate-star-movement-top absolute top-[-10px] left-[-250%] z-0 h-[50%] w-[300%] rounded-full opacity-70"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed
        }}
      ></div>
      <div className={`relative z-[1] ${innerClassName}`}>{children}</div>
    </Component>
  );
};

export default StarBorder;
