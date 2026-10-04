"use client";

import { useRef } from "react";

import { stats } from "@/content/site";
import { deferTask, wakeRender } from "@/lib/defer";
import { gsap, MQ, useGSAP, type MQConditions } from "@/lib/gsap";
import { LazyCountUp } from "@/components/reactbits/lazy";

export function Stats() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const setup = contextSafe!(() => {
        wakeRender(ref.current);
        const q = gsap.utils.selector(ref);
        const mm = gsap.matchMedia();

        mm.add(MQ, (ctx) => {
          if ((ctx.conditions as MQConditions).reduce) return;
          gsap.from(q("[data-stat]"), {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: q("[data-stats-grid]")[0], start: "top 85%" },
          });
        });
      });
      // Bajo el pliegue: se arma en tiempo libre, después de la hidratación.
      return deferTask(setup);
    },
    { scope: ref }
  );

  return (
    <section data-defer-render ref={ref} id={stats.id} aria-labelledby={`${stats.id}-title`} className="py-20 lg:py-28">
      <div className="container-site">
        <h2 id={`${stats.id}-title`} className="sr-only">
          {stats.title}
        </h2>

        <ul data-stats-grid className="grid grid-cols-2 gap-px overflow-hidden border-y border-border bg-border lg:grid-cols-4">
          {stats.items.map((item) => (
            <li
              key={item.label}
              data-stat
              className="flex flex-col bg-background px-2 py-10 min-[380px]:px-3 sm:px-6 lg:px-5 lg:py-14"
            >
              <p className="type-display text-[clamp(3.5rem,7vw,6rem)] leading-[0.95] tracking-[-0.01em] text-primary">
                <span className="sr-only">{`${item.prefix}${item.value}${item.suffix}${item.unit ? ` ${item.unit}` : ""}`}</span>
                {/* La unidad va en su propia línea; se reservan dos líneas para alinear las etiquetas. */}
                <span aria-hidden="true" className="flex min-h-[1.9em] flex-col justify-end">
                  <span>
                    {item.prefix}
                    <LazyCountUp to={item.value} duration={1.6} className="tabular-nums" />
                    {item.suffix}
                  </span>
                  {item.unit && <span>{item.unit}</span>}
                </span>
              </p>
              <p className="mt-4 text-lg leading-snug text-muted-foreground">{item.label}</p>
            </li>
          ))}
        </ul>

        <p className="mt-6 max-w-[65ch] text-base text-muted-foreground">{stats.note}</p>
      </div>
    </section>
  );
}
