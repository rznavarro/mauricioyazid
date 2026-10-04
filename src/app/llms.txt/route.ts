import { brand, faq, siteUrl } from "@/content/site";

// Se genera en el build como archivo estático y sale de site.ts (mismas palabras que el sitio).
// Formato llmstxt.org: título H1 y una lista; Instagram y el sitio como enlaces markdown.
export const dynamic = "force-static";

export function GET() {
  const [who, what, , , audience, where] = faq.items;
  const lines = [
    `# ${brand.name}`,
    `- ${who.q} ${who.a}`,
    `- ${what.q} ${what.a}`,
    `- ${audience.q} ${audience.a}`,
    `- ${where.q} ${where.a} [Instagram ${brand.instagramHandle}](${brand.instagramUrl})`,
    `- [Sitio web](${siteUrl})`,
  ];

  return new Response(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
