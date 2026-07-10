import type { MouseEventHandler, ReactNode } from "react";

interface AffiliateLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  ariaLabel?: string;
  /**
   * Posición del CTA en la página (above-fold, verdict, sticky, card, ficha…).
   * Se emite como `data-cta-location` y lo leen los eventos de analítica
   * (`cta_view` y `affiliate_click`) para saber qué botón trae los clicks.
   */
  ctaLocation?: string;
}

/**
 * Outbound link to MercadoLibre (or any monetised affiliate destination).
 *
 * Always emits `rel="sponsored nofollow noopener"` and `target="_blank"`
 * per Google's qualified-link guidance for paid/affiliate links. Prefer
 * this component over a raw `<a>` for any href that points to `meli.la`,
 * `mercadolibre.com.ar`, or a third-party we monetise from.
 */
export function AffiliateLink({
  href,
  children,
  className,
  onClick,
  ariaLabel,
  ctaLocation,
}: AffiliateLinkProps) {
  // Algunas fichas quedan con el placeholder sin completar porque MercadoLibre
  // rechazó ese link de afiliado puntual (ver comentarios en curated-products.ts).
  // Sin este guard, el placeholder se renderiza como link relativo roto
  // (ej. /producto/PEGAR_MELI_LA) en vez de avisar que no hay compra disponible.
  if (!href || href === "PEGAR_MELI_LA") {
    return (
      <span
        className={className}
        aria-disabled="true"
        style={{ opacity: 0.5, cursor: "not-allowed", pointerEvents: "none" }}
      >
        No disponible por ahora
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener"
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
      data-cta-location={ctaLocation}
    >
      {children}
    </a>
  );
}
