"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";

import { images, story } from "@/content/site";
import type { ImageAvailability } from "@/lib/images";
import { deferTask, wakeRender } from "@/lib/defer";
import { gsap, MQ, useGSAP, type MQConditions } from "@/lib/gsap";
import { ContactButton } from "@/components/shared/ContactButton";
import { ImageFallback } from "@/components/shared/ImageFallback";

type StoryProps = { available: ImageAvailability };

export function Story({ available }: StoryProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const setup = contextSafe!(() => {
        wakeRender(ref.current);
        const q = gsap.utils.selector(ref);
        const mm = gsap.matchMedia();

        mm.add(MQ, (ctx) => {
          const { desktop, mobile, reduce } = ctx.conditions as MQConditions;
          if (reduce) return;

          const pin = q("[data-story-pin]")[0] as HTMLElement;
          const track = q("[data-story-track]")[0] as HTMLElement;
          const panels = q("[data-story-panel]") as HTMLElement[];

          if (desktop) {
            // Scroll horizontal fijado
            const distance = () => track.scrollWidth - window.innerWidth;

            const horizontal = gsap.to(track, {
              x: () => -distance(),
              ease: "none",
              scrollTrigger: {
                trigger: pin,
                pin: true,
                start: "top top",
                end: () => "+=" + distance(),
                scrub: 1,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });

            gsap.fromTo(
              q("[data-story-progress]"),
              { scaleX: 0 },
              {
                scaleX: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: pin,
                  start: "top top",
                  end: () => "+=" + distance(),
                  scrub: 1,
                  invalidateOnRefresh: true,
                },
              }
            );

            panels.forEach((panel, index) => {
              const inView = { trigger: panel, containerAnimation: horizontal, start: "left right", end: "right left", scrub: true };

              gsap.fromTo(
                panel.querySelector("[data-story-media-inner]"),
                { xPercent: -8 },
                { xPercent: 8, ease: "none", scrollTrigger: inView }
              );
              gsap.fromTo(
                panel.querySelector("[data-story-number]"),
                { xPercent: 20 },
                { xPercent: -20, ease: "none", scrollTrigger: inView }
              );
              gsap.from(panel.querySelectorAll("[data-story-reveal]"), {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                // El primer panel ya está en pantalla al fijarse: se revela al llegar a la sección.
                scrollTrigger:
                  index === 0
                    ? { trigger: pin, start: "top 60%" }
                    : { trigger: panel, containerAnimation: horizontal, start: "left 70%" },
              });
            });
          }

          if (mobile) {
            // Apilado vertical con línea de progreso
            gsap.fromTo(
              q("[data-story-line]"),
              { scaleY: 0 },
              {
                scaleY: 1,
                ease: "none",
                scrollTrigger: { trigger: track, start: "top 60%", end: "bottom 60%", scrub: true },
              }
            );

            panels.forEach((panel) => {
              gsap.from(panel, {
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: { trigger: panel, start: "top 85%" },
              });
            });
          }
        });
      });
      // Bajo el pliegue: se arma en tiempo libre, después de la hidratación.
      return deferTask(setup);
    },
    { scope: ref }
  );

  return (
    <section data-defer-render ref={ref} id={story.id} aria-labelledby={`${story.id}-title`} className="relative pb-24 hz:pb-0">
      <div className="container-site pt-24 pb-16 lg:pt-32 lg:pb-20">
        <h2 id={`${story.id}-title`} className="type-h2">
          {story.title}
        </h2>
        <p className="type-body mt-8 text-foreground/85">{story.intro}</p>
      </div>

      <div data-story-pin className="relative hz:h-svh hz:overflow-hidden">
        <div
          aria-hidden="true"
          data-story-progress
          className="absolute inset-x-0 top-[var(--header-h)] z-20 hidden h-[3px] origin-left scale-x-0 bg-primary hz:block"
        />

        <div className="relative container-site hz:max-w-none hz:px-0">
          {/* Línea vertical (móvil y reduced-motion) */}
          <div aria-hidden="true" className="absolute inset-y-0 left-4 w-px bg-border sm:left-6 hz:hidden">
            <div data-story-line className="h-full w-full origin-top scale-y-0 bg-primary" />
          </div>

          <ol
            data-story-track
            className="flex flex-col gap-24 pl-8 sm:pl-12 lg:pl-16 hz:h-svh hz:w-max hz:flex-row hz:gap-0 hz:pr-[8vw] hz:pl-[8vw]"
          >
            {story.stages.map((stage) => {
              const image = images[stage.image];
              return (
                <li
                  key={stage.number}
                  data-story-panel
                  className="relative hz:flex hz:h-full hz:w-[78vw] hz:items-center hz:pt-[var(--header-h)] hz:pr-[6vw]"
                >
                  <span
                    aria-hidden="true"
                    data-story-number
                    className="type-display text-outline pointer-events-none absolute -top-20 right-0 text-[clamp(8rem,22vw,20rem)] leading-none select-none hz:top-[calc(var(--header-h)+2vh)] hz:right-[4vw]"
                    style={{ "--outline-color": "var(--border)" } as CSSProperties}
                  >
                    {stage.number}
                  </span>

                  <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12 xl:gap-16">
                    <div>
                      <p data-story-reveal className="type-label text-primary">
                        {stage.label}
                      </p>
                      <h3 data-story-reveal className="type-h3 mt-4">
                        {stage.title}
                      </h3>
                      <p data-story-reveal className="type-body mt-5 text-foreground/85">
                        {stage.text}
                      </p>
                      {stage.quote && (
                        <blockquote
                          data-story-reveal
                          className="mt-7 max-w-[34ch] border-l-[3px] border-primary pl-5 text-xl leading-snug font-semibold text-foreground lg:text-2xl"
                        >
                          <p>
                            <span aria-hidden="true">“</span>
                            {stage.quote}
                            <span aria-hidden="true">”</span>
                          </p>
                        </blockquote>
                      )}
                      {stage.cta && <ContactButton className="mt-9" />}
                    </div>

                    <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-surface">
                      <div data-story-media-inner className="absolute inset-y-0 -left-[10%] w-[120%]">
                        {available[stage.image] ? (
                          <Image
                            src={`/images/${image.file}`}
                            alt={image.alt}
                            fill
                            sizes="(min-width: 1024px) 45vw, 100vw"
                            className="object-cover"
                          />
                        ) : (
                          <ImageFallback
                            label={stage.number}
                            outlineColor="var(--border)"
                            labelClassName="text-[clamp(6rem,14vw,12rem)] [-webkit-text-stroke-width:2px]"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
