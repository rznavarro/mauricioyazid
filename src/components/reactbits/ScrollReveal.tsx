'use client';

/*
 * React Bits · ScrollReveal (variante TS + Tailwind), adaptado:
 * - useGSAP con scope y gsap.matchMedia(): limpia solo sus propios ScrollTrigger
 *   (el original mataba todos los del sitio con ScrollTrigger.getAll().kill()).
 * - Etiqueta configurable (aquí, blockquote) en lugar de un h2 fijo.
 * - Accesible: texto completo para lectores de pantalla, palabras con aria-hidden.
 * - Con prefers-reduced-motion el texto queda estático y 100 % visible.
 */

import React, { useMemo, useRef, type ReactNode, type RefObject } from 'react';

import { deferTask, wakeRender } from '@/lib/defer';
import { gsap, MQ, useGSAP, type MQConditions } from '@/lib/gsap';

interface ScrollRevealProps {
  children: ReactNode;
  as?: 'div' | 'blockquote' | 'section';
  scrollContainerRef?: RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  as: Tag = 'div',
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const text = typeof children === 'string' ? children : '';

  const splitText = useMemo(() => {
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="word inline-block" key={index}>
          {word}
        </span>
      );
    });
  }, [text]);

  useGSAP(
    (_, contextSafe) => {
      const setup = contextSafe!(() => {
        const el = containerRef.current;
        if (!el) return;
        wakeRender(el);
        const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;
        const mm = gsap.matchMedia();

        mm.add(MQ, ctx => {
          if ((ctx.conditions as MQConditions).reduce) return;

          if (baseRotation !== 0) {
            gsap.fromTo(
              el,
              { transformOrigin: '0% 50%', rotate: baseRotation },
              {
                ease: 'none',
                rotate: 0,
                scrollTrigger: { trigger: el, scroller, start: 'top bottom', end: rotationEnd, scrub: true }
              }
            );
          }

          const wordElements = el.querySelectorAll<HTMLElement>('.word');
          const wordTrigger = { trigger: el, scroller, start: 'top bottom-=20%', end: wordAnimationEnd, scrub: true };

          gsap.fromTo(
            wordElements,
            { opacity: baseOpacity, willChange: 'opacity' },
            { ease: 'none', opacity: 1, stagger: 0.05, scrollTrigger: wordTrigger }
          );

          if (enableBlur) {
            gsap.fromTo(
              wordElements,
              { filter: `blur(${blurStrength}px)` },
              { ease: 'none', filter: 'blur(0px)', stagger: 0.05, scrollTrigger: wordTrigger }
            );
          }
        });
      });
      // Bajo el pliegue: se arma en tiempo libre, después de la hidratación.
      return deferTask(setup);
    },
    {
      scope: containerRef,
      dependencies: [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]
    }
  );

  return (
    <Tag ref={containerRef as RefObject<HTMLDivElement & HTMLQuoteElement>} className={containerClassName}>
      <p className={textClassName}>
        <span className="sr-only">{text}</span>
        <span aria-hidden="true">{splitText}</span>
      </p>
    </Tag>
  );
};

export default ScrollReveal;
