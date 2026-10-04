import type { Metadata } from "next";
import Link from "next/link";

import { cuestionarioIntro } from "@/content/cuestionario";
import { brand, ui } from "@/content/site";
import { CuestionarioLoader } from "@/components/cuestionario/CuestionarioLoader";
import { Wordmark } from "@/components/shared/Wordmark";

// Página interna: sin indexar, fuera del sitemap y sin enlaces desde el sitio.
export const metadata: Metadata = {
  title: `${cuestionarioIntro.titulo} · ${brand.name}`,
  description: "Cuestionario interno para mejorar el sitio.",
  alternates: { canonical: "/cuestionario" },
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: { title: `${cuestionarioIntro.titulo} · ${brand.name}`, url: "/cuestionario" },
};

export default function CuestionarioPage() {
  return (
    <>
      <header className="border-b border-border">
        <div className="container-site flex h-[var(--header-h)] max-w-3xl items-center">
          <Link href="/" aria-label={ui.homeLink} className="inline-flex min-h-12 items-center rounded-sm">
            <Wordmark />
          </Link>
        </div>
      </header>

      <main id="contenido-principal" className="container-site max-w-3xl pt-12 pb-32 lg:pt-16">
        <h1 className="type-h2">{cuestionarioIntro.titulo}</h1>
        <p className="type-body mt-8 font-semibold text-foreground">{cuestionarioIntro.saludo}</p>
        <p className="type-body mt-3 text-foreground/85">{cuestionarioIntro.texto}</p>
        <p className="type-body mt-3 text-muted-foreground">{cuestionarioIntro.guardado}</p>
        <noscript>
          <p className="type-body mt-8 text-primary">Para responder el cuestionario hay que activar JavaScript en el navegador.</p>
        </noscript>
        <CuestionarioLoader />
      </main>
    </>
  );
}
