import {
  contarRespondidas,
  cuestionario,
  MAX_RESPUESTA,
  preguntasCuestionario,
  respuestasEnTexto,
  type RespuestasCuestionario,
} from "@/content/cuestionario";

/*
 * Recibe las respuestas del cuestionario (/cuestionario) y las envía por correo con Resend.
 * Variables de entorno (solo servidor):
 * - RESEND_API_KEY        clave de la API de Resend.
 * - CUESTIONARIO_DESTINO  correo que recibe las respuestas.
 * - CUESTIONARIO_REMITENTE opcional; por defecto el remitente de pruebas de Resend, que solo puede
 *   enviar al correo de la cuenta de Resend (usar ese mismo correo como destino).
 */

const MAX_BODY = 200_000;
const IDS = new Set(preguntasCuestionario.map((p) => p.id));

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function respuestasEnHtml(respuestas: RespuestasCuestionario) {
  const secciones = cuestionario
    .map((seccion) => {
      const items = seccion.preguntas
        .map((p) => {
          const numero = preguntasCuestionario.indexOf(p) + 1;
          const respuesta = respuestas[p.id]?.trim();
          return `<p style="margin:0 0 6px;font-weight:600">${numero}. ${escapeHtml(p.texto)}</p>
<p style="margin:0 0 20px;white-space:pre-wrap;color:${respuesta ? "#111" : "#888"}">${escapeHtml(respuesta || "(sin respuesta)")}</p>`;
        })
        .join("\n");
      return `<h2 style="font-size:18px;margin:28px 0 12px;border-bottom:2px solid #FFD60A;padding-bottom:6px">${escapeHtml(seccion.titulo)}</h2>\n${items}`;
    })
    .join("\n");
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;max-width:680px">${secciones}</div>`;
}

/** Solo acepta peticiones del propio sitio (si el navegador envía Origin). */
function mismoOrigen(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!mismoOrigen(request)) {
    return Response.json({ ok: false, error: "origen" }, { status: 403 });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY) {
    return Response.json({ ok: false, error: "demasiado-grande" }, { status: 413 });
  }

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return Response.json({ ok: false, error: "formato" }, { status: 400 });
  }

  const { respuestas: entrada, sitio } = (data ?? {}) as { respuestas?: unknown; sitio?: unknown };

  // Campo trampa: las personas no lo ven; si viene con texto, es un bot. Se responde "ok" sin enviar.
  if (typeof sitio === "string" && sitio.trim() !== "") {
    return Response.json({ ok: true });
  }

  if (!entrada || typeof entrada !== "object" || Array.isArray(entrada)) {
    return Response.json({ ok: false, error: "formato" }, { status: 400 });
  }

  const respuestas: RespuestasCuestionario = {};
  for (const [id, valor] of Object.entries(entrada as Record<string, unknown>)) {
    if (IDS.has(id) && typeof valor === "string") respuestas[id] = valor.slice(0, MAX_RESPUESTA);
  }

  const respondidas = contarRespondidas(respuestas);
  if (respondidas === 0) {
    return Response.json({ ok: false, error: "vacio" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const destino = process.env.CUESTIONARIO_DESTINO;
  if (!apiKey || !destino) {
    return Response.json({ ok: false, error: "no-configurado" }, { status: 503 });
  }

  const total = preguntasCuestionario.length;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CUESTIONARIO_REMITENTE || "Cuestionario web <onboarding@resend.dev>",
      to: [destino],
      subject: `Respuestas de Mauricio Yazid · ${respondidas} de ${total} preguntas`,
      text: respuestasEnTexto(respuestas),
      html: respuestasEnHtml(respuestas),
    }),
  });

  if (!res.ok) {
    console.error("Resend respondió", res.status, await res.text().catch(() => ""));
    return Response.json({ ok: false, error: "envio" }, { status: 502 });
  }

  return Response.json({ ok: true, respondidas, total });
}
