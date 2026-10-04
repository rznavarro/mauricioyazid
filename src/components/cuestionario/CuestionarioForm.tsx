"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Check, Download, Send } from "lucide-react";

import {
  contarRespondidas,
  cuestionario,
  MAX_RESPUESTA,
  preguntasCuestionario,
  respuestasEnTexto,
  type RespuestasCuestionario,
} from "@/content/cuestionario";
import { Button } from "@/components/ui/button";

const CLAVE_BORRADOR = "cuestionario-mauricio-v1";

function leerBorrador(): RespuestasCuestionario {
  try {
    const guardado = window.localStorage.getItem(CLAVE_BORRADOR);
    const datos = guardado ? (JSON.parse(guardado) as unknown) : null;
    return datos && typeof datos === "object" ? (datos as RespuestasCuestionario) : {};
  } catch {
    return {};
  }
}

function guardarBorrador(respuestas: RespuestasCuestionario) {
  try {
    window.localStorage.setItem(CLAVE_BORRADOR, JSON.stringify(respuestas));
  } catch {
    // Sin almacenamiento disponible (modo privado): el formulario sigue funcionando.
  }
}

type Estado =
  | { tipo: "inicial" }
  | { tipo: "enviando" }
  | { tipo: "enviado" }
  | { tipo: "error"; mensaje: string };

const MENSAJES_ERROR: Record<string, string> = {
  vacio: "Responde al menos una pregunta antes de enviar.",
  "no-configurado":
    "El envío todavía no está activado. Toca «Descargar mis respuestas» y mándanos el archivo por WhatsApp o correo.",
};
const ERROR_GENERAL =
  "No pudimos enviar tus respuestas. Revisa tu conexión e inténtalo de nuevo. Tus respuestas siguen guardadas.";

/** Formulario del cuestionario. Se carga solo en el navegador (lee el borrador guardado). */
export default function CuestionarioForm() {
  const [respuestas, setRespuestas] = useState<RespuestasCuestionario>(leerBorrador);
  const [estado, setEstado] = useState<Estado>({ tipo: "inicial" });
  const trampaRef = useRef<HTMLInputElement>(null);

  const total = preguntasCuestionario.length;
  const respondidas = contarRespondidas(respuestas);

  // Guardado automático en este dispositivo.
  useEffect(() => {
    const timer = window.setTimeout(() => guardarBorrador(respuestas), 400);
    return () => window.clearTimeout(timer);
  }, [respuestas]);

  const responder = (id: string, valor: string) => {
    setRespuestas((prev) => ({ ...prev, [id]: valor }));
    if (estado.tipo !== "enviando") setEstado({ tipo: "inicial" });
  };

  const enviar = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (respondidas === 0) {
      setEstado({ tipo: "error", mensaje: MENSAJES_ERROR.vacio });
      return;
    }
    setEstado({ tipo: "enviando" });
    try {
      const res = await fetch("/api/cuestionario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ respuestas, sitio: trampaRef.current?.value ?? "" }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) setEstado({ tipo: "enviado" });
      else setEstado({ tipo: "error", mensaje: MENSAJES_ERROR[data.error ?? ""] ?? ERROR_GENERAL });
    } catch {
      setEstado({ tipo: "error", mensaje: ERROR_GENERAL });
    }
  };

  const descargar = () => {
    const blob = new Blob([respuestasEnTexto(respuestas)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "respuestas-cuestionario-mauricio-yazid.txt";
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <form onSubmit={enviar} noValidate className="mt-12">
      <div className="sticky top-0 z-10 -mx-4 border-b border-border bg-background/90 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6">
        <p className="text-lg font-semibold">
          Respondidas: <span className="text-primary">{respondidas}</span> de {total}
        </p>
        <div aria-hidden="true" className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${(respondidas / total) * 100}%` }} />
        </div>
      </div>

      {/* Campo trampa para bots: invisible para las personas. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="sitio">No completar</label>
        <input ref={trampaRef} id="sitio" name="sitio" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {cuestionario.map((seccion) => (
        <fieldset key={seccion.id} className="mt-14 first-of-type:mt-10">
          <legend className="type-display text-[2.5rem] text-foreground">{seccion.titulo}</legend>
          <div className="mt-6 space-y-10">
            {seccion.preguntas.map((pregunta) => {
              const numero = preguntasCuestionario.indexOf(pregunta) + 1;
              const id = `pregunta-${pregunta.id}`;
              return (
                <div key={pregunta.id}>
                  <label htmlFor={id} className="block text-xl leading-snug font-semibold lg:text-2xl">
                    <span className="text-primary">{numero}.</span> {pregunta.texto}
                  </label>
                  {pregunta.ayuda && (
                    <p id={`${id}-ayuda`} className="mt-2 text-base text-muted-foreground">
                      {pregunta.ayuda}
                    </p>
                  )}
                  <textarea
                    id={id}
                    name={pregunta.id}
                    value={respuestas[pregunta.id] ?? ""}
                    onChange={(e) => responder(pregunta.id, e.target.value)}
                    aria-describedby={pregunta.ayuda ? `${id}-ayuda` : undefined}
                    maxLength={MAX_RESPUESTA}
                    rows={4}
                    className="mt-4 block min-h-32 w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-lg leading-relaxed text-foreground placeholder:text-muted-foreground [field-sizing:content]"
                    placeholder="Escribe tu respuesta aquí"
                  />
                </div>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className="mt-16 border-t border-border pt-10">
        <p className="text-lg text-muted-foreground">
          Respondiste {respondidas} de {total} preguntas. Puedes enviar ahora y completar el resto otro día.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button type="submit" disabled={estado.tipo === "enviando"}>
            {estado.tipo === "enviado" ? <Check /> : <Send />}
            {estado.tipo === "enviando" ? "Enviando…" : estado.tipo === "enviado" ? "Enviado" : "Enviar respuestas"}
          </Button>
          <Button type="button" variant="outline" onClick={descargar}>
            <Download />
            Descargar mis respuestas
          </Button>
        </div>

        <div role="status" aria-live="polite" className="mt-6 min-h-8 text-lg">
          {estado.tipo === "enviado" && (
            <p className="font-semibold text-primary">
              ¡Listo, Mauricio! Recibimos tus respuestas. Muchas gracias. Si quieres corregir algo, edítalo y vuelve a enviar.
            </p>
          )}
          {estado.tipo === "error" && <p className="font-semibold text-destructive">{estado.mensaje}</p>}
        </div>
      </div>
    </form>
  );
}
