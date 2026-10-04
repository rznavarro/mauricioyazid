import { InstagramIcon, WhatsAppIcon } from "@/components/icons/brand";
import { getContact } from "@/lib/contact";

/** Botón de contacto fijo, visible en todo el sitio. Círculo en móvil, píldora en escritorio. */
export function FloatingContact() {
  const contact = getContact();
  const Icon = contact.channel === "whatsapp" ? WhatsAppIcon : InstagramIcon;

  return (
    <a
      href={contact.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={contact.label}
      data-contact={contact.channel}
      className="fixed right-5 bottom-[calc(20px+env(safe-area-inset-bottom))] z-[60] inline-flex size-14 items-center justify-center gap-2.5 rounded-full bg-primary text-primary-foreground shadow-[0_10px_30px_-8px_rgba(255,214,10,0.45)] transition-colors duration-200 hover:bg-primary-hover lg:size-auto lg:min-h-14 lg:px-6"
    >
      <Icon className="size-6" />
      <span className="hidden text-lg font-semibold lg:inline">{contact.label}</span>
    </a>
  );
}
