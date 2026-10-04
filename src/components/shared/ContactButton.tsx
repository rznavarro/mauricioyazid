import type { ComponentProps } from "react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons/brand";
import { getContact } from "@/lib/contact";

type ContactButtonProps = {
  size?: ComponentProps<typeof Button>["size"];
  className?: string;
  /** Oculta el ícono (por ejemplo, en el header compacto). */
  hideIcon?: boolean;
};

/** Botón "Escríbeme". Todos los CTA de contacto del sitio pasan por aquí. */
export function ContactButton({ size = "default", className, hideIcon = false }: ContactButtonProps) {
  const contact = getContact();
  const Icon = contact.channel === "whatsapp" ? WhatsAppIcon : InstagramIcon;

  return (
    <Button asChild size={size} className={cn(className)}>
      <a href={contact.href} target="_blank" rel="noopener noreferrer" data-contact={contact.channel}>
        {!hideIcon && <Icon />}
        {contact.label}
      </a>
    </Button>
  );
}
