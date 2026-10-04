'use client';

/*
 * React Bits · CountUp (variante TS + Tailwind), adaptado:
 * - El HTML del servidor trae el valor final (visible sin JS y para buscadores).
 * - Con prefers-reduced-motion se queda en el valor final, sin animar.
 * - Interpolación con duración exacta (animate) en lugar del resorte original, que
 *   tardaba bastante más que `duration` en llegar y mostraba valores intermedios ("19").
 */

import { animate, useInView, useMotionValue } from 'motion/react';
import { useCallback, useEffect, useRef } from 'react';

interface CountUpProps {
  to: number;
  from?: number;
  direction?: 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

export default function CountUp({
  to,
  from = 0,
  direction = 'up',
  delay = 0,
  duration = 2,
  className = '',
  startWhen = true,
  separator = '',
  onStart,
  onEnd
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const canAnimate = useRef(false);
  const motionValue = useMotionValue(direction === 'down' ? to : from);

  const isInView = useInView(ref, { once: true, margin: '0px' });

  const getDecimalPlaces = (num: number): number => {
    const str = num.toString();
    if (str.includes('.')) {
      const decimals = str.split('.')[1];
      if (parseInt(decimals) !== 0) {
        return decimals.length;
      }
    }
    return 0;
  };

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

  const formatValue = useCallback(
    (latest: number) => {
      const hasDecimals = maxDecimals > 0;

      const options: Intl.NumberFormatOptions = {
        useGrouping: !!separator,
        minimumFractionDigits: hasDecimals ? maxDecimals : 0,
        maximumFractionDigits: hasDecimals ? maxDecimals : 0
      };

      const formattedNumber = Intl.NumberFormat('en-US', options).format(latest);

      return separator ? formattedNumber.replace(/,/g, separator) : formattedNumber;
    },
    [maxDecimals, separator]
  );

  // Solo se anima con movimiento permitido: entonces parte desde el valor inicial.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (ref.current) {
      ref.current.textContent = formatValue(direction === 'down' ? to : from);
    }
    canAnimate.current = true;
  }, [from, to, direction, formatValue]);

  useEffect(() => {
    if (canAnimate.current && isInView && startWhen) {
      if (typeof onStart === 'function') {
        onStart();
      }

      let controls: ReturnType<typeof animate> | undefined;
      const timeoutId = setTimeout(() => {
        controls = animate(motionValue, direction === 'down' ? from : to, { duration, ease: [0.16, 1, 0.3, 1] });
      }, delay * 1000);

      const durationTimeoutId = setTimeout(
        () => {
          if (typeof onEnd === 'function') {
            onEnd();
          }
        },
        delay * 1000 + duration * 1000
      );

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(durationTimeoutId);
        controls?.stop();
      };
    }
  }, [isInView, startWhen, motionValue, direction, from, to, delay, onStart, onEnd, duration]);

  useEffect(() => {
    const unsubscribe = motionValue.on('change', (latest: number) => {
      if (ref.current) {
        ref.current.textContent = formatValue(latest);
      }
    });

    return () => unsubscribe();
  }, [motionValue, formatValue]);

  return (
    <span className={className} ref={ref}>
      {formatValue(direction === 'down' ? from : to)}
    </span>
  );
}
