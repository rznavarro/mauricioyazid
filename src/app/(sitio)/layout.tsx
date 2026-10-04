import { Footer } from "@/components/layout/Footer";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { Header } from "@/components/layout/Header";
import { SmoothScroll } from "@/components/layout/SmoothScroll";

/** Layout del sitio público: scroll suave, header con anclas, footer y botón de contacto flotante. */
export default function SitioLayout({ children }: LayoutProps<"/">) {
  return (
    <SmoothScroll>
      <Header />
      <main id="contenido-principal" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
      <FloatingContact />
    </SmoothScroll>
  );
}
