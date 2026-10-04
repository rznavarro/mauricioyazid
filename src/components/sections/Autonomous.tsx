"use client";

import { useRef } from "react";

import { autonomous } from "@/content/site";
import { deferTask, wakeRender } from "@/lib/defer";
import { gsap, MQ, useGSAP, type MQConditions } from "@/lib/gsap";
import { Card } from "@/components/ui/card";
import { ContactButton } from "@/components/shared/ContactButton";
import SpotlightCard from "@/components/reactbits/SpotlightCard";

export function Autonomous() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const setup = contextSafe!(() => {
        wakeRender(ref.current);
        const q = gsap.utils.selector(ref);
        const mm = gsap.matchMedia();

        mm.add(MQ, (ctx) => {
          if ((ctx.conditions as MQConditions).reduce) return;
          gsap.from(q("[data-autonomous-card]"), {
            y: 50,
            opacity: 0,
            duration: 0.9,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: { trigger: q("[data-autonomous-grid]")[0], start: "top 80%" },
          });
        });
      });
      // Bajo el pliegue: se arma en tiempo libre, después de la hidratación.
      return deferTask(setup);
    },
    { scope: ref }
  );

  return (
    <section
      data-defer-render
      ref={ref}
      id={autonomous.id}
      aria-labelledby={`${autonomous.id}-title`}
      className="border-t border-border py-24 lg:py-36"
    >
      <div className="container-site">
        <h2 id={`${autonomous.id}-title`} className="type-h2 max-w-[16ch]">
          {autonomous.title}
        </h2>
        <p className="type-body mt-8 text-foreground/85">{autonomous.lead}</p>

        <ul data-autonomous-grid className="mt-14 grid gap-5 md:grid-cols-3 lg:mt-20 lg:gap-6">
          {autonomous.cards.map((card) => (
            <li key={card.number} data-autonomous-card>
              <SpotlightCard
                spotlightColor="rgba(255, 214, 10, 0.12)"
                className="h-full rounded-2xl border border-border bg-surface [&>div:last-child]:h-full"
              >
                <Card className="h-full gap-0 rounded-none bg-transparent p-8 text-base ring-0 lg:p-10">
                  <span aria-hidden="true" className="type-display text-[3.5rem] text-primary">
                    {card.number}
                  </span>
                  <h3 className="type-h3 mt-6">{card.title}</h3>
                  <p className="mt-4 text-lg leading-relaxed text-foreground/85">{card.text}</p>
                </Card>
              </SpotlightCard>
            </li>
          ))}
        </ul>

        <div className="mt-20 grid gap-8 border-t border-border pt-14 lg:mt-28 lg:grid-cols-12 lg:items-end lg:pt-20">
          <div className="lg:col-span-8">
            <h3 className="type-h3">{autonomous.audienceTitle}</h3>
            <p className="type-body mt-5 text-foreground/85">{autonomous.audienceText}</p>
          </div>
          <div className="lg:col-span-4 lg:flex lg:justify-end">
            <ContactButton />
          </div>
        </div>
      </div>
    </section>
  );
}
