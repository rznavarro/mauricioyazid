"use client";

import dynamic from "next/dynamic";

// Solo en el navegador: el formulario parte desde el borrador guardado en este dispositivo.
const CuestionarioForm = dynamic(() => import("./CuestionarioForm"), {
  ssr: false,
  loading: () => <p className="mt-12 text-lg text-muted-foreground">Cargando el cuestionario…</p>,
});

export function CuestionarioLoader() {
  return <CuestionarioForm />;
}
