import { Suspense } from "react";

import { getImageAvailability } from "@/lib/images";
import { buildJsonLd, serializeJsonLd } from "@/lib/jsonld";
import { Autonomous } from "@/components/sections/Autonomous";
import { Content } from "@/components/sections/Content";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Identify } from "@/components/sections/Identify";
import { Stats } from "@/components/sections/Stats";
import { Story } from "@/components/sections/Story";
import { Ticker } from "@/components/sections/Ticker";

export default function Home() {
  const available = getImageAvailability();
  const jsonLd = buildJsonLd({ hasPortrait: available.heroPortrait });

  // Cada sección bajo el pliegue va en su propio <Suspense>: el HTML es el mismo, pero React
  // la hidrata como una unidad aparte y cede el hilo entre ellas (menos tareas largas).
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <Hero hasPortrait={available.heroPortrait} />
      <Suspense>
        <Stats />
      </Suspense>
      <Suspense>
        <Identify />
      </Suspense>
      <Suspense>
        <Story available={available} />
      </Suspense>
      <Suspense>
        <Autonomous />
      </Suspense>
      <Suspense>
        <Ticker />
      </Suspense>
      <Suspense>
        <Content />
      </Suspense>
      <Suspense>
        <Faq />
      </Suspense>
      <Suspense>
        <FinalCta />
      </Suspense>
    </>
  );
}
