import { brand, faq, images, seo, siteUrl } from "@/content/site";

/**
 * Datos estructurados (schema.org) en un único @graph: WebSite, Person y FAQPage.
 * Todo sale de site.ts, igual que la interfaz y llms.txt.
 * Marca personal sin dirección física: Person (no LocalBusiness).
 */
export function buildJsonLd({ hasPortrait }: { hasPortrait: boolean }) {
  const url = siteUrl;
  const personId = `${siteUrl}/#person`;
  const websiteId = `${siteUrl}/#website`;
  // Si el retrato aún no está en /public/images, se usa la imagen para compartir.
  const image = hasPortrait ? `${siteUrl}/images/${images.heroPortrait.file}` : `${siteUrl}/opengraph-image`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: brand.name,
        url,
        inLanguage: brand.lang,
        publisher: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: brand.name,
        url,
        image,
        description: seo.personDescription,
        sameAs: [brand.instagramUrl],
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#preguntas`,
        url,
        inLanguage: brand.lang,
        isPartOf: { "@id": websiteId },
        mainEntity: faq.items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
}

/** Serializa para <script type="application/ld+json"> escapando "<" (evita cerrar el script). */
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
