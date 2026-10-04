"use client";

import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { cn } from "cn";

import { nav, ui } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AnchorLink } from "@/components/shared/AnchorLink";
import { ContactButton } from "@/components/shared/ContactButton";
import { Wordmark } from "@/components/shared/Wordmark";

const SCROLL_THRESHOLD = 80;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigatingRef = useRef(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <a
        href="#contenido-principal"
        className="sr-only z-[70] rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {ui.skipLink}
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 h-[var(--header-h)] border-b transition-[background-color,border-color,backdrop-filter] duration-300",
          scrolled
            ? "border-border bg-background/85 backdrop-blur-md"
            : "border-transparent bg-transparent"
        )}
      >
        <div className="container-site flex h-full items-center justify-between gap-3">
          <AnchorLink href="#inicio" aria-label={ui.homeLink} className="inline-flex min-h-12 shrink-0 items-center rounded-sm">
            <Wordmark />
          </AnchorLink>

          <nav aria-label={ui.mainNav} className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <AnchorLink
                    href={item.href}
                    className="inline-flex min-h-12 items-center rounded-full px-4 text-base font-medium whitespace-nowrap text-foreground/85 transition-colors hover:text-primary"
                  >
                    {item.label}
                  </AnchorLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ContactButton className="hidden sm:inline-flex" />

            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="xl:hidden" aria-label={ui.openMenu}>
                  <Menu className="size-7" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="border-border px-6 pt-20 pb-8 data-[side=right]:w-full data-[side=right]:max-w-sm"
                onCloseAutoFocus={(event) => {
                  // Al elegir un enlace, el foco va a la sección de destino, no al botón de menú.
                  if (navigatingRef.current) {
                    event.preventDefault();
                    navigatingRef.current = false;
                  }
                }}
              >
                <SheetTitle className="sr-only">{ui.menuTitle}</SheetTitle>
                <SheetDescription className="sr-only">{ui.homeLink}</SheetDescription>
                <nav aria-label={ui.mobileNav}>
                  <ul className="flex flex-col">
                    {nav.map((item) => (
                      <li key={item.href} className="border-b border-border">
                        <AnchorLink
                          href={item.href}
                          onClick={() => {
                            navigatingRef.current = true;
                            setMenuOpen(false);
                          }}
                          className="flex min-h-16 items-center text-xl font-semibold text-foreground transition-colors hover:text-primary"
                        >
                          {item.label}
                        </AnchorLink>
                      </li>
                    ))}
                  </ul>
                </nav>
                <ContactButton className="mt-6 w-full" />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
