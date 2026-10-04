import { brand, footer, nav, ui } from "@/content/site";
import { InstagramIcon } from "@/components/icons/brand";
import { AnchorLink } from "@/components/shared/AnchorLink";
import { Wordmark } from "@/components/shared/Wordmark";

export function Footer() {
  const year = new Date().getFullYear();

  // Nada se mide después del footer: puede quedar con render diferido permanente (content-visibility).
  return (
    <footer className="border-t border-border bg-background pt-16 pb-36 [contain-intrinsic-size:auto_640px] [content-visibility:auto] lg:pb-32">
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <AnchorLink href="#inicio" className="inline-flex min-h-12 items-center rounded-sm" aria-label={ui.backToTop}>
            <Wordmark />
          </AnchorLink>
          <p className="mt-3 text-lg text-muted-foreground">{footer.tagline}</p>
        </div>

        <nav aria-label={footer.navLabel} className="lg:col-span-6">
          <ul className="grid gap-x-8 sm:grid-cols-2">
            {nav.map((item) => (
              <li key={item.href}>
                <AnchorLink
                  href={item.href}
                  className="inline-flex min-h-12 items-center text-lg text-foreground/85 transition-colors hover:text-primary"
                >
                  {item.label}
                </AnchorLink>
              </li>
            ))}
            <li>
              <a
                href={brand.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-2 text-lg text-foreground/85 transition-colors hover:text-primary"
              >
                <InstagramIcon className="size-5" />
                {footer.instagramLabel} {brand.instagramHandle}
              </a>
            </li>
          </ul>
        </nav>

        <div className="border-t border-border pt-8 lg:col-span-12">
          <p className="max-w-[65ch] text-base text-muted-foreground">{footer.disclaimer}</p>
          <p className="mt-4 text-base text-muted-foreground">
            © {year} {brand.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
