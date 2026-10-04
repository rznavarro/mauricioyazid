import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { seo } from "@/content/site";

// Fuentes estáticas (OFL) para Satori, que no lee las de next/font.
const fontDir = join(process.cwd(), "assets", "fonts");
const loadAnton = () => readFile(join(fontDir, "Anton-Regular.ttf"));
const loadInter = () => readFile(join(fontDir, "Inter-SemiBold.ttf"));

const COLORS = { background: "#0B0B0C", primary: "#FFD60A", foreground: "#F5F5F2", border: "#26262A" };

export const shareImageSize = { width: 1200, height: 630 };

/** Imagen para compartir (Open Graph y Twitter): 1200×630. */
export async function renderShareImage() {
  const [anton, inter] = await Promise.all([loadAnton(), loadInter()]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: COLORS.background,
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", width: 120, height: 8, background: COLORS.primary }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "Anton",
            fontSize: 164,
            lineHeight: 1.08,
            color: COLORS.primary,
            textTransform: "uppercase",
          }}
        >
          {seo.ogHeadline.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Inter",
            fontSize: 44,
            color: COLORS.foreground,
            borderTop: `2px solid ${COLORS.border}`,
            paddingTop: 28,
          }}
        >
          {seo.ogSubline}
        </div>
      </div>
    ),
    {
      ...shareImageSize,
      fonts: [
        { name: "Anton", data: anton, style: "normal", weight: 400 },
        { name: "Inter", data: inter, style: "normal", weight: 600 },
      ],
    }
  );
}

/** Ícono "MY" en Anton amarillo sobre #0B0B0C. */
export async function renderMonogram(size: number) {
  const anton = await loadAnton();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: COLORS.background,
          fontFamily: "Anton",
          fontSize: Math.round(size * 0.62),
          lineHeight: 1,
          color: COLORS.primary,
          letterSpacing: "-0.01em",
        }}
      >
        {seo.monogram}
      </div>
    ),
    {
      width: size,
      height: size,
      fonts: [{ name: "Anton", data: anton, style: "normal", weight: 400 }],
    }
  );
}
