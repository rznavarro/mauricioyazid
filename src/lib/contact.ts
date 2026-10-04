import { brand, contactCopy } from "@/content/site";

export type ContactChannel = "whatsapp" | "instagram";

export type Contact = {
  href: string;
  label: string;
  channel: ContactChannel;
};

/** Destino único de todos los botones "Escríbeme" del sitio. */
export function getContact(): Contact {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");

  if (number) {
    return {
      href: `https://wa.me/${number}?text=${encodeURIComponent(contactCopy.whatsappMessage)}`,
      label: contactCopy.label,
      channel: "whatsapp",
    };
  }

  return {
    href: brand.instagramDmUrl,
    label: contactCopy.label,
    channel: "instagram",
  };
}
