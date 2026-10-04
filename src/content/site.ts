/**
 * Fuente única de contenido. La interfaz, el JSON-LD y llms.txt leen de aquí.
 * Las frases F1–F9 son textuales de Mauricio: no modificarlas.
 */

export const brand = {
  name: "Mauricio Yazid",
  brand: "Empresa Autónoma",
  motto: "#DoyValor",
  instagramHandle: "@mauricio.yazid",
  instagramUrl: "https://www.instagram.com/mauricio.yazid/",
  instagramDmUrl: "https://ig.me/m/mauricio.yazid",
  bio: "Facturé US$8M al Grupo Telefónica. 4 robos, cerré todo. Ahora Empresa Autónoma sin Equipos, sin Bodega, sin Oficinas. DoyValor a +50",
  audience:
    "personas de +50 años con título, oficio y experiencia que creen que lo único que les queda es trabajar para otros.",
  lang: "es-CL",
  ogLocale: "es_CL",
} as const;

export const quotes = {
  F1: "A los 50 años facturé USD 7,8M en 20 años. A los 50 y tres meses lo había perdido todo. No por incompetencia. Por hacer las cosas como las hacía hace 30 años. No cuidarme de quién me rodeaba.",
  F2: "Mira bien a esta gente, porque esto es lo que más me dolió perder.",
  F3: "Escritorios vacíos = mi mayor fracaso.",
  F4: "Cinco llamadas de cobradores en tres horas. Esto fue real.",
  F5: "No fue quiebra… igual dolió.",
  F6: "Me robaron todo… y entendí esto.",
  F7: "Tres meses después de cerrar mi empresa.",
  F8: "Tienes +50, título, oficio, 30 años de experiencia. ¿Y crees que lo único que te queda es trabajar para otros?",
  F9: "A los 50+ sí se puede.",
} as const;

export const contactCopy = {
  label: "Escríbeme",
  whatsappMessage: "Hola Mauricio, vi tu web y quiero conversar.",
} as const;

export const nav = [
  { label: "Mi historia", href: "#historia" },
  { label: "Empresa Autónoma", href: "#empresa-autonoma" },
  { label: "Contenido", href: "#contenido" },
  { label: "Preguntas", href: "#preguntas" },
] as const;

export const ui = {
  skipLink: "Saltar al contenido",
  openMenu: "Abrir menú",
  closeMenu: "Cerrar menú",
  menuTitle: "Menú",
  homeLink: "Mauricio Yazid, ir al inicio",
  backToTop: "Mauricio Yazid, volver al inicio",
  mainNav: "Principal",
  mobileNav: "Menú móvil",
} as const;

export const images = {
  heroPortrait: {
    file: "mauricio-retrato.png",
    width: 1200,
    height: 1500,
    alt: "Mauricio Yazid, creador de Empresa Autónoma, sonriendo frente a la cámara",
  },
  story01: {
    file: "historia-01-equipo.jpg",
    width: 1600,
    height: 1200,
    alt: "Trabajadores del equipo de Mauricio Yazid instalando tuberías dentro de una zanja",
  },
  story02: {
    file: "historia-02-oficina.jpg",
    width: 1600,
    height: 1200,
    alt: "Oficina con escritorios y sillas vacías tras el cierre de la empresa",
  },
  story03: {
    file: "historia-03-retrato.jpg",
    width: 1600,
    height: 1200,
    alt: "Retrato de Mauricio Yazid con polera negra sobre fondo oscuro",
  },
  story04: {
    file: "historia-04-hoy.jpg",
    width: 1600,
    height: 1200,
    alt: "Mauricio Yazid con camisa a rayas hablando a la cámara",
  },
} as const;

export type ImageKey = keyof typeof images;

export const hero = {
  id: "inicio",
  badge: "Empresa Autónoma · #DoyValor",
  title: "A los 50 lo perdí todo. A los 50+ sí se puede.",
  lead: "Facturé US$8M al Grupo Telefónica. Después de 4 robos, cerré todo. Hoy tengo una Empresa Autónoma: sin equipos, sin bodega, sin oficinas.",
  secondaryCta: { label: "Conoce mi historia", href: "#historia" },
  scrollHint: "Scroll",
  marquee: "MAURICIO YAZID ·",
} as const;

export const stats = {
  id: "cifras",
  title: "Cifras",
  // prefix/suffix van pegados al número; unit va en una segunda línea ("20 años").
  items: [
    { prefix: "US$", value: 8, suffix: "M", unit: "", label: "facturados al Grupo Telefónica" },
    { prefix: "", value: 20, suffix: "", unit: "años", label: "de empresa" },
    { prefix: "", value: 4, suffix: "", unit: "", label: "robos antes de cerrar" },
    { prefix: "", value: 3, suffix: "", unit: "meses", label: "para perderlo todo" },
  ],
  note: "Cifras de la historia personal de Mauricio. No son una promesa de resultados.",
} as const;

export const identify = {
  id: "identificacion",
  label: "¿Te pasa esto?",
  quote: quotes.F8,
  followUp: "Yo también tuve que responder esa pregunta.",
  link: { label: "Mira cómo lo hice", href: "#historia" },
} as const;

export type StoryStage = {
  number: string;
  label: string;
  title: string;
  text: string;
  quote?: string;
  image: ImageKey;
  cta?: boolean;
};

export const story = {
  id: "historia",
  title: "Mi historia",
  intro:
    "Soy Mauricio Yazid. Durante 20 años tuve una empresa que le facturó US$8M al Grupo Telefónica. Después de 4 robos, cerré todo. Hoy tengo una Empresa Autónoma, sin equipos, sin bodega y sin oficinas, y comparto lo que aprendí con personas de +50.",
  stages: [
    {
      number: "01",
      label: "Etapa 01 · Construir",
      title: "20 años de empresa.",
      text: "A los 50 años facturé USD 7,8M en 20 años.",
      quote: quotes.F2,
      image: "story01",
    },
    {
      number: "02",
      label: "Etapa 02 · Los golpes",
      title: "4 robos. Cerré todo.",
      text: quotes.F4,
      quote: quotes.F3,
      image: "story02",
    },
    {
      number: "03",
      label: "Etapa 03 · Entender",
      title: "No fue quiebra. Igual dolió.",
      text: "A los 50 y tres meses lo había perdido todo. No por incompetencia. Por hacer las cosas como las hacía hace 30 años. No cuidarme de quién me rodeaba.",
      image: "story03",
    },
    {
      number: "04",
      label: "Etapa 04 · Hoy",
      title: "Empresa Autónoma.",
      text: "Sin equipos, sin bodega, sin oficinas. Y una misión: #DoyValor a quienes tienen +50.",
      image: "story04",
      cta: true,
    },
  ] satisfies StoryStage[],
} as const;

export const autonomous = {
  id: "empresa-autonoma",
  title: "Qué es una Empresa Autónoma",
  lead: "Es la forma en que trabajo hoy, después de cerrar mi empresa: sin equipos, sin bodega, sin oficinas.",
  cards: [
    {
      number: "01",
      title: "Sin equipos",
      text: "Lo que más me dolió perder fue a mi gente. Hoy trabajo de otra forma.",
    },
    {
      number: "02",
      title: "Sin bodega",
      text: "Menos estructura que mantener y menos que proteger.",
    },
    {
      number: "03",
      title: "Sin oficinas",
      text: "Los escritorios vacíos fueron mi mayor fracaso. Hoy no los necesito.",
    },
  ],
  audienceTitle: "¿Para quién es?",
  audienceText:
    "Para personas de +50 con título, oficio y años de experiencia que no quieren que lo único que les quede sea trabajar para otros.",
} as const;

export const ticker = {
  rowA: "#DOYVALOR ·",
  rowB: "A LOS 50+ SÍ SE PUEDE ·",
} as const;

export const content = {
  id: "contenido",
  title: "Lo que comparto en Instagram",
  lead: "Mi historia, contada sin adornos, para quienes tienen +50.",
  cards: [
    "A los 50+ sí se puede",
    "¿Tienes +50 y crees que solo te queda ser empleado?",
    "Me robaron todo… y entendí esto",
    "No fue quiebra… igual dolió",
    "Escritorios vacíos = mi mayor fracaso",
    "Tres meses después de cerrar mi empresa",
  ],
  cardAriaPrefix: "Ver en Instagram: ",
  followCta: "Seguir en Instagram",
} as const;

export const faq = {
  id: "preguntas",
  title: "Preguntas frecuentes",
  items: [
    {
      q: "¿Quién es Mauricio Yazid?",
      a: "Mauricio Yazid es el creador de Empresa Autónoma. Durante 20 años tuvo una empresa que le facturó US$8M al Grupo Telefónica. Después de 4 robos cerró todo, y hoy comparte su historia con personas de +50 bajo el lema #DoyValor.",
    },
    {
      q: "¿Qué es una Empresa Autónoma?",
      a: "Es la forma en que Mauricio trabaja hoy: una empresa sin equipos, sin bodega y sin oficinas.",
    },
    {
      q: "¿Por qué cerró su empresa?",
      a: "Después de 4 robos. En sus palabras: 'No por incompetencia. Por hacer las cosas como las hacía hace 30 años. No cuidarme de quién me rodeaba.'",
    },
    {
      q: "¿Fue una quiebra?",
      a: "No. Como él mismo dice: 'No fue quiebra… igual dolió.'",
    },
    {
      q: "¿Para quién es su contenido?",
      a: "Para personas de +50 con título, oficio y años de experiencia que creen que lo único que les queda es trabajar para otros.",
    },
    {
      q: "¿Dónde puedo ver su contenido?",
      a: "En Instagram, en @mauricio.yazid.",
    },
    {
      q: "¿Cómo puedo contactar a Mauricio?",
      a: "Con el botón 'Escríbeme' de esta página, que abre una conversación directa con él.",
    },
  ],
} as const;

export const finalCta = {
  id: "contacto",
  title: "Tienes +50. Tienes experiencia. Conversemos.",
  text: "Si te hiciste la misma pregunta que yo, escríbeme.",
  instagramLink: "Sígueme en Instagram",
} as const;

export const footer = {
  tagline: "Empresa Autónoma · #DoyValor",
  disclaimer:
    "Las cifras y experiencias corresponden a la historia personal de Mauricio Yazid y no garantizan resultados.",
  instagramLabel: "Instagram",
  navLabel: "Secciones",
} as const;

export const seo = {
  title: "Mauricio Yazid | Empresa Autónoma · A los 50+ sí se puede",
  description:
    "Mauricio Yazid facturó US$8M, lo perdió todo y hoy tiene una Empresa Autónoma: sin equipos, sin bodega, sin oficinas. Su historia para quienes tienen +50.",
  personDescription:
    "Creador de Empresa Autónoma. Facturó US$8M al Grupo Telefónica, cerró su empresa después de 4 robos y hoy comparte su historia con personas de +50.",
  ogHeadline: ["A LOS 50+", "SÍ SE PUEDE"],
  ogSubline: "Mauricio Yazid · Empresa Autónoma",
  ogAlt: "A los 50+ sí se puede. Mauricio Yazid · Empresa Autónoma",
  monogram: "MY",
} as const;

// URL canónica. Si NEXT_PUBLIC_SITE_URL no está definida, en Vercel se usa el dominio de
// producción del proyecto (VERCEL_PROJECT_PRODUCTION_URL, sin protocolo); en local, localhost.
const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || (vercelProductionUrl ? `https://${vercelProductionUrl}` : "http://localhost:3000")
).replace(/\/$/, "");
