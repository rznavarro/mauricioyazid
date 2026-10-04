"use client";

import { useRef } from "react";

import { brand, finalCta } from "@/content/site";
import { deferTask, wakeRender } from "@/lib/defer";
import { gsap, MQ, SplitText, useGSAP, type MQConditions } from "@/lib/gsap";
import { InstagramIcon } from "@/components/icons/brand";
import { ContactButton } from "@/components/shared/ContactButton";
import Magnet from "@/components/reactbits/Magnet";
import StarBorder from "@/components/reactbits/StarBorder";

export function FinalCta() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const setup = contextSafe!(() => {
        wakeRender(ref.current);
        const q = gsap.utils.selector(ref);
        const mm = gsap.matchMedia();

        mm.add(MQ, (ctx) => {
          if ((ctx.conditions as MQConditions).reduce) return;
          const title = q("[data-final-title]")[0];

          SplitText.create(title, {
            type: "words",
            mask: "words",
            wordsClass: "split-word",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.words, {
                yPercent: 100,
                duration: 0.9,
                stagger: 0.06,
                ease: "power3.out",
                scrollTrigger: { trigger: title, start: "top 75%" },
              }),
          });

          gsap.fromTo(
            q("[data-final-glow]"),
            { scale: 0.8 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: ref.current, start: "top bottom", end: "center center", scrub: true },
            }
          );
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
      id={finalCta.id}
      aria-labelledby={`${finalCta.id}-title`}
      className="relative isolate overflow-hidden border-t border-border py-28 lg:py-44"
    >
      <div
        aria-hidden="true"
        data-final-glow
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 aspect-square w-[min(110vw,1100px)] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(255,214,10,0.14),transparent)]"
      />

      <div className="container-site flex flex-col items-center text-center">
        <h2 id={`${finalCta.id}-title`} data-final-title className="type-h2 max-w-[18ch] text-balance">
          {finalCta.title}
        </h2>
        <p className="mt-8 text-xl text-foreground/85 lg:text-2xl">{finalCta.text}</p>

        <div className="mt-12">
          {/* Magnet sutil solo en escritorio con puntero fino; StarBorder amarillo alrededor del botón */}
          <Magnet padding={60} magnetStrength={6}>
            <StarBorder as="div" color="#FFD60A" speed="6s" thickness={3} className="rounded-full">
              <ContactButton size="xl" />
            </StarBorder>
          </Magnet>
        </div>

        <a
          href={brand.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex min-h-12 items-center gap-2 text-lg font-semibold text-foreground/85 underline-offset-8 transition-colors hover:text-primary hover:underline"
        >
          <InstagramIcon className="size-5" />
          {finalCta.instagramLink}
        </a>
      </div>
    </section>
  );
}
