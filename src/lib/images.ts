import fs from "node:fs";
import path from "node:path";

import { images, type ImageKey } from "@/content/site";

export type ImageAvailability = Record<ImageKey, boolean>;

/** Solo en el servidor: indica qué imágenes existen en /public/images. Las que faltan usan su fallback. */
export function getImageAvailability(): ImageAvailability {
  const dir = path.join(process.cwd(), "public", "images");
  return Object.fromEntries(
    (Object.keys(images) as ImageKey[]).map((key) => [key, fs.existsSync(path.join(dir, images[key].file))])
  ) as ImageAvailability;
}
