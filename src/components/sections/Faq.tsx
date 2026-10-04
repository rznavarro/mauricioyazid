"use client";

import { useRef } from "react";

import { faq } from "@/content/site";
import { deferTask, wakeRender } from "@/lib/defer";
import { gsap, MQ, ScrollTrigger, useGSAP, type MQConditions } from "@/lib/gsap";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function Faq() {
  const ref = useRef<HTMLElement>(null);
  const refreshTimer = useRef<number>(0);

  useGSAP(
    (_, contextSafe) => {
      const setup = contextSafe!(() => {
        wakeRender(ref.current);
        const q = gsap.utils.selector(ref);
        const mm = gsap.matchMedia();

        mm.add(MQ, (ctx) => {
          if ((ctx.conditions as MQConditions).reduce) return;
          gsap.from(q("[data-faq-reveal]"), {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: q("[data-faq-reveal]")[0], start: "top 85%" },
          });
        });
      });
      // Bajo el pliegue: se arma en tiempo libre, después de la hidratación.
      return deferTask(setup);
    },
    { scope: ref }
  );

  // Abrir o cerrar una respuesta cambia el alto de la página: recalcular los ScrollTrigger de abajo.
  const handleValueChange = () => {
    window.clearTimeout(refreshTimer.current);
    refreshTimer.current = window.setTimeout(() => ScrollTrigger.refresh(), 350);
  };

  return (
    <section
      data-defer-render
      ref={ref}
      id={faq.id}
      aria-labelledby={`${faq.id}-title`}
      className="border-t border-border py-24 lg:py-36"
    >
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id={`${faq.id}-title`} className="type-h2 lg:sticky lg:top-28">
            {faq.title}
          </h2>
        </div>

        <div data-faq-reveal className="lg:col-span-8">
          <Accordion type="single" collapsible onValueChange={handleValueChange} className="border-t border-border">
            {faq.items.map((item, index) => (
              <AccordionItem key={item.q} value={`pregunta-${index + 1}`} className="border-b border-border">
                <AccordionTrigger>{item.q}</AccordionTrigger>
                {/* forceMount: la respuesta siempre está en el HTML; se oculta con CSS cuando está cerrada. */}
                <AccordionContent forceMount>
                  <p>{item.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
