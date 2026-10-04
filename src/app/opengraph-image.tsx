import { seo } from "@/content/site";
import { renderShareImage, shareImageSize } from "@/lib/og";

export const alt = seo.ogAlt;
export const size = shareImageSize;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderShareImage();
}
