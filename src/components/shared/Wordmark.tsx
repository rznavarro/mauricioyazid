import { cn } from "cn";

/** Logo tipográfico: "MAURICIO YAZID" en Anton blanco + punto final amarillo. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("type-display inline-block whitespace-nowrap text-[40px] text-foreground", className)}>
      Mauricio Yazid<span className="text-primary">.</span>
    </span>
  );
}
