/**
 * Cuestionario interno para Mauricio (página oculta /cuestionario).
 * Fuente única: lo usan el formulario, la descarga en .txt y el correo con las respuestas.
 */

import { content, stats } from "@/content/site";

export type Pregunta = { id: string; texto: string; ayuda?: string };
export type SeccionCuestionario = { id: string; titulo: string; preguntas: Pregunta[] };

export const cuestionarioIntro = {
  titulo: "Cuestionario para mejorar tu web",
  saludo: "Hola, Mauricio.",
  texto:
    "Estas preguntas nos ayudan a contar mejor tu historia y a que más personas de +50 te escriban. Responde con tus palabras, como si conversáramos. Puedes saltarte las que no quieras responder.",
  guardado:
    "Tus respuestas se guardan solas en este dispositivo: puedes cerrar la página y seguir después. Cuando termines, toca «Enviar respuestas».",
} as const;

const [montoFacturado] = stats.items;

export const cuestionario: SeccionCuestionario[] = [
  {
    id: "importante",
    titulo: "Lo más importante",
    preguntas: [
      {
        id: "oferta",
        texto:
          "Cuando alguien te escribe por «Escríbeme», ¿qué le ofreces? ¿Una conversación, asesoría, mentoría, un programa o un curso? ¿Es gratis o pagado?",
      },
      {
        id: "proceso",
        texto:
          "¿Qué pasa después de ese primer mensaje? ¿Cuánto tardas en responder y cuál es el siguiente paso (una llamada, una reunión, un pago)?",
      },
      {
        id: "canal",
        texto: "¿Prefieres que te escriban por WhatsApp o por Instagram? Si es WhatsApp, ¿qué número usamos?",
      },
      {
        id: "cifra",
        texto: `En la web aparece «${montoFacturado.prefix}${montoFacturado.value}${montoFacturado.suffix} facturados al Grupo Telefónica» y también «USD 7,8M en 20 años». ¿Cuál cifra quieres usar, o están bien las dos?`,
      },
      {
        id: "telefonica",
        texto: "¿Tienes autorización para nombrar al Grupo Telefónica públicamente como cliente?",
      },
      {
        id: "fotos-equipo",
        texto: "¿Las personas que salen en las fotos de tu equipo aceptan aparecer en la web?",
      },
    ],
  },
  {
    id: "empresa-autonoma",
    titulo: "Tu Empresa Autónoma hoy",
    preguntas: [
      { id: "a-que-se-dedica", texto: "¿A qué se dedica hoy tu Empresa Autónoma? ¿Qué vendes o qué servicio das?" },
      {
        id: "como-funciona",
        texto:
          "¿Cómo funciona en la práctica «sin equipos, sin bodega, sin oficinas»? ¿Con quién trabajas, desde dónde y con qué herramientas?",
      },
      {
        id: "tres-pasos",
        texto:
          "Si tuvieras que explicarle a alguien de 55 años en tres pasos cómo armar su propia Empresa Autónoma, ¿cuáles serían esos pasos?",
      },
      {
        id: "primer-paso",
        texto: "¿Qué es lo primero que debería hacer una persona de +50 que quiere dejar de trabajar para otros?",
      },
    ],
  },
  {
    id: "historia",
    titulo: "Tu historia",
    preguntas: [
      { id: "empresa-anterior", texto: "¿Cómo se llamaba tu empresa, en qué rubro trabajaba y en qué años funcionó?" },
      { id: "robos", texto: "¿Qué pasó en los 4 robos que estés dispuesto a contar públicamente?" },
      { id: "que-entendiste", texto: "En tu reel «Me robaron todo… y entendí esto», ¿qué fue exactamente lo que entendiste?" },
      { id: "lecciones", texto: "¿Cuáles son las 3 lecciones más importantes que te dejó cerrar la empresa?" },
      {
        id: "tres-meses",
        texto: "¿Qué hiciste en esos «tres meses después de cerrar»? ¿Cuál fue el punto de quiebre?",
      },
    ],
  },
  {
    id: "confianza",
    titulo: "Prueba y confianza",
    preguntas: [
      {
        id: "testimonios",
        texto: "¿Has ayudado ya a personas de +50? ¿Alguna aceptaría dar un testimonio con nombre y foto?",
      },
      {
        id: "cifras-reales",
        texto:
          "¿Tienes cifras reales que podamos mostrar? Por ejemplo: seguidores, personas con las que has conversado o años de experiencia en tu rubro.",
      },
      { id: "medios", texto: "¿Te han entrevistado en medios, podcasts o eventos?" },
      { id: "trayectoria", texto: "¿Tienes estudios, certificaciones o trayectoria profesional que quieras destacar?" },
    ],
  },
  {
    id: "contenido",
    titulo: "Tu contenido",
    preguntas: [
      {
        id: "enlaces-reels",
        texto:
          "¿Nos pasas el enlace de cada uno de estos reels, para que cada tarjeta de la web lleve a su video y no solo a tu perfil?",
        ayuda: content.cards.map((titulo) => `«${titulo}»`).join(" · "),
      },
      { id: "reels-exito", texto: "¿Cuáles son tus reels con más respuesta? ¿Por qué crees que funcionaron?" },
      { id: "otras-redes", texto: "¿Estás en otras redes, como Facebook, YouTube, TikTok o LinkedIn? ¿Con qué cuenta?" },
      { id: "frecuencia", texto: "¿Con qué frecuencia publicas y qué temas vienen?" },
    ],
  },
  {
    id: "publico",
    titulo: "Tu público",
    preguntas: [
      { id: "quien-escribe", texto: "¿Quién te escribe hoy? Edad, profesión, ciudad o país." },
      {
        id: "preguntas-frecuentes",
        texto: "¿Cuáles son las 5 preguntas que más te hacen?",
        ayuda: "Las usaríamos en la sección de preguntas frecuentes de la web.",
      },
      { id: "paises", texto: "¿Tu público es solo de Chile o también de otros países de Latinoamérica?" },
      {
        id: "busquedas",
        texto: "¿Qué escribiría en Google alguien que te debería encontrar?",
        ayuda: "Por ejemplo: «emprender después de los 50».",
      },
    ],
  },
  {
    id: "objetivos",
    titulo: "Objetivos y próximos pasos",
    preguntas: [
      {
        id: "exito",
        texto: "¿Qué tendría que pasar para decir que la web funciona? ¿Cuántos mensajes o conversaciones por semana?",
      },
      {
        id: "herramientas",
        texto:
          "¿Te gustaría agregar una agenda para reservar llamadas, un formulario, un regalo descargable a cambio del correo (como una guía) o un boletín por correo?",
      },
      { id: "lanzamientos", texto: "¿Tienes planes de lanzar un programa, curso, comunidad o evento en los próximos meses?" },
      { id: "nunca", texto: "¿Hay alguna palabra, tema o frase que nunca quieras ver en tu web?" },
      {
        id: "dominio",
        texto: "¿Tienes un dominio propio (por ejemplo, mauricioyazid.cl) o hay que comprarlo?",
      },
    ],
  },
  {
    id: "final",
    titulo: "Para cerrar",
    preguntas: [{ id: "algo-mas", texto: "¿Algo más que quieras contarnos o que te gustaría ver en tu web?" }],
  },
];

export const preguntasCuestionario = cuestionario.flatMap((s) => s.preguntas);

export type RespuestasCuestionario = Record<string, string>;

/** Límite de caracteres por respuesta (se aplica en el formulario y en el servidor). */
export const MAX_RESPUESTA = 5000;

/** Respuestas en texto plano, ordenadas por sección (descarga .txt y cuerpo del correo). */
export function respuestasEnTexto(respuestas: RespuestasCuestionario) {
  const bloques = cuestionario.map((seccion) => {
    const items = seccion.preguntas.map((p) => {
      const respuesta = respuestas[p.id]?.trim();
      const numero = preguntasCuestionario.indexOf(p) + 1;
      return `${numero}. ${p.texto}\n${respuesta || "(sin respuesta)"}`;
    });
    return `== ${seccion.titulo} ==\n\n${items.join("\n\n")}`;
  });
  return `${cuestionarioIntro.titulo}\n\n${bloques.join("\n\n\n")}\n`;
}

export function contarRespondidas(respuestas: RespuestasCuestionario) {
  return preguntasCuestionario.filter((p) => respuestas[p.id]?.trim()).length;
}
