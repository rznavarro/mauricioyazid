import { ArrowDown } from "lucide-react";

import { identify } from "@/content/site";
import { AnchorLink } from "@/components/shared/AnchorLink";
import ScrollReveal from "@/components/reactbits/ScrollReveal";

export function Identify() {
  return (
    <section
      data-defer-render
      id={identify.id}
      aria-labelledby={`${identify.id}-title`}
      className="flex min-h-svh items-center py-24"
    >
      <div className="container-site flex flex-col items-center text-center">
        <h2 id={`${identify.id}-title`} className="sr-only">
          {identify.label}
        </h2>
        <p aria-hidden="true" className="type-label text-primary">
          {identify.label}
        </p>

        {/* Queda 100 % legible cuando la cita llega al 40 % del viewport. Opacidad base 0,4 (no 0,25):
            así el estado atenuado mantiene contraste AA para texto grande (3,5:1). */}
        <ScrollReveal
          as="blockquote"
          enableBlur
          blurStrength={4}
          baseOpacity={0.4}
          baseRotation={0}
          wordAnimationEnd="top 40%"
          containerClassName="mt-8"
          textClassName="mx-auto max-w-[24ch] text-[clamp(1.75rem,4vw,3.25rem)] leading-[1.25] font-semibold text-balance text-foreground"
        >
          {identify.quote}
        </ScrollReveal>

        <p className="mt-10 text-xl text-muted-foreground lg:text-2xl">{identify.followUp}</p>

        <AnchorLink
          href={identify.link.href}
          className="group mt-6 inline-flex min-h-12 items-center gap-2 text-lg font-semibold text-primary underline-offset-8 hover:underline"
        >
          {identify.link.label}
          <ArrowDown aria-hidden="true" className="size-5 transition-transform group-hover:translate-y-0.5" />
        </AnchorLink>
      </div>
    </section>
  );
}
