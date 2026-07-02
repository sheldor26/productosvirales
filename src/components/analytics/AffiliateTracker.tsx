"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

/**
 * Rastreo de clicks de afiliado en TODO el sitio con un solo listener delegado.
 *
 * Cualquier `<a rel="sponsored">` (todos los links de afiliado los tienen, via
 * AffiliateLink y los botones de compra) dispara un evento `affiliate_click` en
 * GA4 con la URL de destino (única por producto), el texto del botón y la ruta
 * de la guía. Así se ve en GA4 qué producto/guía trae más clicks al afiliado.
 * También manda un custom event a Clarity para poder segmentar sesiones.
 *
 * No toca los componentes de botón: escucha a nivel documento (capture) y filtra
 * por el `rel`. Si mañana se agrega otro botón de afiliado, ya queda trackeado.
 */
export function AffiliateTracker() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const el = event.target as HTMLElement | null;
      const link = el?.closest?.<HTMLAnchorElement>('a[rel~="sponsored"]');
      if (!link) return;

      const payload = {
        link_url: link.href,
        link_text: (link.textContent || "").replace(/\s+/g, " ").trim().slice(0, 100),
        // Qué botón se clickeó (above-fold, verdict, sticky, card, ficha…) para
        // saber qué CTA convierte y cuál sobra. "otro" = link sin marcar (prosa).
        cta_location: link.dataset.ctaLocation || "otro",
        page_path: window.location.pathname,
      };

      window.gtag?.("event", "affiliate_click", payload);
      window.clarity?.("event", "affiliate_click");
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  return null;
}
