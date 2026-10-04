"use client";

import type { ComponentProps, MouseEvent } from "react";

import { useLenis } from "@/components/layout/SmoothScroll";

const HEADER_OFFSET = -80;

type AnchorLinkProps = ComponentProps<"a"> & { href: `#${string}` };

/** Lleva el foco a la sección de destino sin volver a mover el scroll. */
function focusTarget(target: HTMLElement) {
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}

/** Enlace a una sección de la página: scroll suave con Lenis, o salto directo sin él. */
export function AnchorLink({ href, onClick, children, ...props }: AnchorLinkProps) {
  const lenis = useLenis();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const target = document.getElementById(href.slice(1));
    if (!target) return;

    event.preventDefault();
    window.history.replaceState(null, "", href);

    if (lenis) {
      lenis.scrollTo(target, { offset: HEADER_OFFSET, onComplete: () => focusTarget(target) });
    } else {
      // Sin Lenis (reduced-motion): salto inmediato; scroll-margin-top compensa el header.
      target.scrollIntoView({ block: "start" });
      focusTarget(target);
    }
  };

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
