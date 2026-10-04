import type { Metadata, Viewport } from "next";

import "./globals.css";
import { anton, inter } from "./fonts";
import { brand, seo, siteUrl } from "@/content/site";
import { BrandIconSprite } from "@/components/icons/brand";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: seo.title,
  description: seo.description,
  applicationName: brand.name,
  authors: [{ name: brand.name, url: brand.instagramUrl }],
  creator: brand.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: brand.ogLocale,
    siteName: brand.name,
    url: "/",
    title: seo.title,
    description: seo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0C",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={brand.lang} className={`${anton.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Marca que hay JS antes del primer pintado: habilita los estados iniciales de las animaciones. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <BrandIconSprite />
        {children}
      </body>
    </html>
  );
}
