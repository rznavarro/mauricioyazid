"use client";

import { useRef } from "react";
import Image from "next/image";

import { hero, images } from "@/content/site";
import { gsap, MQ, SplitText, useGSAP, type MQConditions } from "@/lib/gsap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnchorLink } from "@/components/shared/AnchorLink";
import { ContactButton } from "@/components/shared/ContactButton";
import { ImageFallback } from "@/components/shared/ImageFallback";
import Noise from "@/components/reactbits/Noise";
import { LazyScrollVelocity } from "@/components/reactbits/lazy";
import { HeroDustLoader } from "@/components/three/HeroDustLoader";

type HeroProps = { hasPortrait: boolean };

/** Patrón de líneas diagonales detrás del retrato. */
function DiagonalPattern({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} width="100%" height="100%">
      <defs>
        <pattern id="hero-diagonal" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="22" stroke="#1C1C1F" strokeWidth="3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hero-diagonal)" />
    </svg>
  );
}

export function Hero({ hasPortrait }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const portrait = images.heroPortrait;

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const mm = gsap.matchMedia();

      mm.add(MQ, (ctx) => {
        const { desktop, reduce } = ctx.conditions as MQConditions;
        if (reduce) return;

        // Entrada al cargar. El H1 se pinta desde el primer frame: solo se desplaza dentro de su máscara.
        SplitText.create(q("[data-hero-title]"), {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, { yPercent: 100, duration: 0.9, stagger: 0.12, ease: "power3.out" }),
        });

        gsap.fromTo(
          q("[data-hero-fade]"),
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, delay: 0.35, ease: "power3.out" }
        );

        gsap.fromTo(q("[data-hero-portrait]"), { scale: 1.06 }, { scale: 1, duration: 1.2, ease: "power3.out" });

        // Scroll (solo escritorio): el retrato baja y el texto sube y se atenúa.
        if (desktop) {
          gsap
            .timeline({
              scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: 0.6 },
            })
            .to(q("[data-hero-visual]"), { yPercent: 12, ease: "none" }, 0)
            .to(q("[data-hero-text]"), { yPercent: -8, opacity: 0.3, ease: "none" }, 0);
        }
      });
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      id={hero.id}
      aria-labelledby={`${hero.id}-title`}
      className="relative isolate overflow-hidden"
    >
      {/* Capas de fondo, de atrás hacia adelante: HeroDust (solo escritorio), ScrollVelocity y Noise */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <HeroDustLoader className="absolute inset-0" />
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
          <LazyScrollVelocity
            texts={[hero.marquee, hero.marquee]}
            velocity={30}
            numCopies={4}
            velocityMapping={{ input: [0, 1000], output: [0, 3] }}
            className="type-display text-outline text-[18vw] leading-[0.95] [--outline-color:var(--surface-2)] [-webkit-text-stroke-width:2px]"
          />
        </div>
        <Noise patternAlpha={15} />
      </div>

      <div className="container-site grid min-h-svh items-center gap-14 pt-[calc(var(--header-h)+2.5rem)] pb-20 lg:grid-cols-12 lg:gap-10 lg:pt-[calc(var(--header-h)+1rem)] lg:pb-16">
        <div data-hero-text className="lg:col-span-7">
          <div data-hero-fade>
            <Badge variant="outline" className="border-primary/40 bg-background/60 text-foreground">
              <span aria-hidden="true" className="size-2 rounded-full bg-primary" />
              {hero.badge}
            </Badge>
          </div>

          <h1 id={`${hero.id}-title`} data-hero-title className="type-h1 mt-6 max-w-[13ch] text-balance">
            {hero.title}
          </h1>

          <p data-hero-fade className="type-body mt-6 text-foreground/85">
            {hero.lead}
          </p>

          <div data-hero-fade className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ContactButton />
            <Button asChild variant="outline">
              <AnchorLink href={hero.secondaryCta.href}>{hero.secondaryCta.label}</AnchorLink>
            </Button>
          </div>
        </div>

        <div data-hero-visual className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
          {/* Patrón gráfico y resplandor detrás del retrato */}
          <DiagonalPattern className="absolute inset-0 translate-x-4 translate-y-4 lg:translate-x-6 lg:translate-y-6" />
          <div
            aria-hidden="true"
            className="absolute inset-[-15%] bg-[radial-gradient(closest-side,rgba(255,214,10,0.08),transparent)]"
          />

          <div data-hero-portrait className="relative aspect-[4/5] w-full overflow-hidden">
            {hasPortrait ? (
              <Image
                src={`/images/${portrait.file}`}
                alt={portrait.alt}
                width={portrait.width}
                height={portrait.height}
                preload
                sizes="(min-width: 1024px) 40vw, (min-width: 640px) 28rem, 100vw"
                className="h-full w-full object-contain object-bottom"
              />
            ) : (
              <ImageFallback
                label="MY"
                outlineColor="var(--primary)"
                labelClassName="text-[clamp(10rem,30vw,22rem)] [-webkit-text-stroke-width:2px]"
              />
            )}
          </div>
        </div>
      </div>

      {/* Indicador de scroll (decorativo) */}
      <div aria-hidden="true" className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex">
        <span className="type-label text-muted-foreground">{hero.scrollHint}</span>
        <span className="relative block h-12 w-px overflow-hidden bg-border">
          <span className="scroll-line-fill absolute inset-0 bg-primary" />
        </span>
      </div>
    </section>
  );
}
