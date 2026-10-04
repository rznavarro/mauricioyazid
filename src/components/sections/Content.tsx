"use client";

import { useRef } from "react";
import { Play } from "lucide-react";

import { brand, content } from "@/content/site";
import { deferTask, wakeRender } from "@/lib/defer";
import { gsap, MQ, ScrollTrigger, useGSAP, type MQConditions } from "@/lib/gsap";
import { Button } from "@/components/ui/button";
import { InstagramIcon } from "@/components/icons/brand";
import { ContactButton } from "@/components/shared/ContactButton";
import GlareHover from "@/components/reactbits/GlareHover";

export function Content() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const setup = contextSafe!(() => {
        wakeRender(ref.current);
        const q = gsap.utils.selector(ref);
        const mm = gsap.matchMedia();

        mm.add(MQ, (ctx) => {
          if ((ctx.conditions as MQConditions).reduce) return;
          const cards = q("[data-content-card]");
          gsap.set(cards, { y: 40, opacity: 0 });
          ScrollTrigger.batch(cards, {
            start: "top 85%",
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "power3.out", overwrite: true }),
          });
        });
      });
      // Bajo el pliegue: se arma en tiempo libre, después de la hidratación.
      return deferTask(setup);
    },
    { scope: ref }
  );

  return (
    <section data-defer-render ref={ref} id={content.id} aria-labelledby={`${content.id}-title`} className="py-24 lg:py-36">
      <div className="container-site">
        <h2 id={`${content.id}-title`} className="type-h2 max-w-[16ch]">
          {content.title}
        </h2>
        <p className="type-body mt-8 text-foreground/85">{content.lead}</p>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-6">
          {content.cards.map((title) => (
            <li key={title} data-content-card>
              <GlareHover glareColor="#FFD60A" glareOpacity={0.18} glareSize={250} transitionDuration={800} className="rounded-2xl">
              <a
                href={brand.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${content.cardAriaPrefix}${title}`}
                className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface p-7 transition-colors duration-300 can-hover:hover:border-primary/60 lg:p-8"
              >
                <span aria-hidden="true" className="flex items-center gap-2 text-base text-muted-foreground">
                  <InstagramIcon className="size-5" />
                  {brand.instagramHandle}
                </span>

                <span
                  aria-hidden="true"
                  className="absolute top-6 right-6 flex size-14 items-center justify-center rounded-full bg-background/70 text-primary ring-1 ring-border lg:top-7 lg:right-7"
                >
                  <Play className="size-6 translate-x-px fill-current" />
                </span>

                <h3 className="type-display text-[clamp(2.5rem,3.4vw,3.25rem)] leading-[1.02] text-balance text-primary">
                  {title}
                </h3>
              </a>
              </GlareHover>
            </li>
          ))}
        </ul>

        <div className="mt-14 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="outline">
            <a href={brand.instagramUrl} target="_blank" rel="noopener noreferrer">
              <InstagramIcon />
              {content.followCta}
            </a>
          </Button>
          <ContactButton />
        </div>
      </div>
    </section>
  );
}
