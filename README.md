# Mauricio Yazid · Empresa Autónoma

Sitio de una sola página. Next.js (App Router) + React + TypeScript + Tailwind CSS 4 + shadcn/ui, con GSAP/ScrollTrigger, Lenis, React Three Fiber y componentes de React Bits.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción (debe terminar sin errores ni warnings)
npm start          # sirve el build
npm run lint
```

## Variables de entorno

Copiar `.env.example` a `.env.local` (local) o configurarlas en el hosting:

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL canónica sin barra final (ej. `https://mauricioyazid.cl`). Se usa en canonical, Open Graph, sitemap, robots, JSON-LD y `llms.txt`. En Vercel, si no se define, se usa el dominio de producción del proyecto; conviene definirla igual con el dominio definitivo. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Opcional. Número en formato internacional sin `+` ni espacios. Si existe, todos los "Escríbeme" abren WhatsApp; si no, el mensaje directo de Instagram. |

Son variables `NEXT_PUBLIC_`: se fijan al construir. Después de cambiarlas hay que volver a ejecutar `npm run build`.

### Cuestionario interno (`/cuestionario`)

Página oculta (sin enlaces, fuera del sitemap y con `noindex`) para que Mauricio responda preguntas sobre su empresa. Guarda el avance en su dispositivo, permite descargar las respuestas y las envía por correo con [Resend](https://resend.com):

| Variable | Uso |
|---|---|
| `RESEND_API_KEY` | Clave de la API de Resend (solo servidor; nunca con prefijo `NEXT_PUBLIC_`). |
| `CUESTIONARIO_DESTINO` | Correo que recibe las respuestas. Con el remitente por defecto debe ser el mismo correo de la cuenta de Resend. |
| `CUESTIONARIO_REMITENTE` | Opcional. Remitente con dominio verificado en Resend (por defecto `onboarding@resend.dev`). |

Sin estas variables, el formulario avisa que el envío no está activado y ofrece descargar las respuestas.

## Fotos

Copiar a `public/images/` con estos nombres exactos:

| Archivo | Sección | Tamaño |
|---|---|---|
| `mauricio-retrato.png` | Hero (PNG con transparencia) | 1200×1500 |
| `historia-01-equipo.jpg` | Historia, etapa 01 | 1600×1200 |
| `historia-02-oficina.jpg` | Historia, etapa 02 | 1600×1200 |
| `historia-03-retrato.jpg` | Historia, etapa 03 | 1600×1200 |
| `historia-04-hoy.jpg` | Historia, etapa 04 | 1600×1200 |

Mientras falte una foto se muestra su panel de reemplazo. La página se genera estática, así que **después de agregar o cambiar fotos hay que volver a construir** (`npm run build`).

## Despliegue en Vercel

Importar el repositorio en Vercel (se detecta Next.js solo; sin configuración extra). Cada push a `main` publica en producción. Después de conectar el dominio propio, definir `NEXT_PUBLIC_SITE_URL` en *Settings → Environment Variables* y volver a desplegar.

Las fuentes de `assets/fonts/` (Anton e Inter, licencia SIL OFL 1.1, ver `OFL-*.txt`) solo se usan para generar la imagen para compartir y los íconos.

## Dónde está cada cosa

- `src/content/site.ts`: todo el texto del sitio (fuente única para la interfaz, el JSON-LD y `llms.txt`).
- `src/lib/contact.ts`: destino de los botones "Escríbeme".
- `src/components/sections/`: las secciones, en el orden de la página.
- `src/components/reactbits/`: componentes de React Bits (adaptados; cada archivo explica qué cambió y por qué).
- `src/components/three/HeroDust.tsx`: partículas 3D del hero (solo escritorio).
- `src/app/`: layout raíz, metadata, imagen OG, íconos, sitemap, robots y `llms.txt`; el landing vive en `src/app/(sitio)/` y el cuestionario en `src/app/cuestionario/` (preguntas en `src/content/cuestionario.ts`).

## Notas de rendimiento

- Las animaciones bajo el pliegue se arman en tiempo libre después de la hidratación (`src/lib/defer.ts`), y esas secciones usan `content-visibility: auto` hasta que les toca.
- motion (ScrollVelocity, CountUp), Lenis y Three.js se cargan aparte, fuera del JavaScript inicial.
- Con `prefers-reduced-motion: reduce` no hay Lenis, pin, scrub ni 3D, y todo el contenido queda visible.
