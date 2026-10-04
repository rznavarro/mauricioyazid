"use client";

type Task = () => void;
type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
};

const queue: Task[] = [];
let scheduled = false;

function run() {
  scheduled = false;
  // Una tarea por turno: cada sección arma sus animaciones en su propio bloque corto.
  queue.shift()?.();
  if (queue.length) schedule();
}

function schedule() {
  if (scheduled) return;
  scheduled = true;
  const w = window as IdleWindow;
  if (w.requestIdleCallback) w.requestIdleCallback(run, { timeout: 1000 });
  else window.setTimeout(run, 16);
}

/**
 * Encola trabajo no urgente (animaciones bajo el pliegue) para después de la hidratación.
 * Se ejecuta en orden de llegada, que es el orden de la página: así ScrollTrigger
 * calcula las posiciones teniendo en cuenta el pin de la Historia.
 * Devuelve una función que lo cancela si el componente se desmonta antes.
 */
export function deferTask(task: Task) {
  queue.push(task);
  schedule();
  return () => {
    const index = queue.indexOf(task);
    if (index >= 0) queue.splice(index, 1);
  };
}

/**
 * Activa el render completo del bloque que contiene a `el` (quita `data-defer-render`,
 * que aplica `content-visibility: auto`; ver globals.css). Cada sección lo llama justo antes
 * de armar sus animaciones, así ScrollTrigger mide tamaños reales.
 */
export function wakeRender(el: Element | null) {
  el?.closest("[data-defer-render]")?.removeAttribute("data-defer-render");
}
