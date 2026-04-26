import type { MouseEventHandler, ReactNode } from "react";

interface AffiliateLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  ariaLabel?: string;
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
}: AffiliateLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener"
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
