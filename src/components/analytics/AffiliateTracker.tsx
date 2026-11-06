"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { SeguirMlBanner } from "@/components/widgets/SeguirMlBanner";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

const SEGUIR_BANNER_CAP_KEY = "pv_seguir_ml_banner_last_shown";
const SEGUIR_BANNER_CAP_DAYS = 7;
const SEGUIR_BANNER_AUTO_HIDE_MS = 6000;

function seguirBannerShownRecently(): boolean {
  try {
    const v = localStorage.getItem(SEGUIR_BANNER_CAP_KEY);
    if (!v) return false;
    const parsed = parseInt(v, 10);
    if (Number.isNaN(parsed)) return false;
    return Date.now() - parsed < SEGUIR_BANNER_CAP_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function markSeguirBannerShown() {
  try {
    localStorage.setItem(SEGUIR_BANNER_CAP_KEY, String(Date.now()));
  } catch {
    // localStorage puede fallar (modo privado); no es crítico.
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
 *
 * El mismo click dispara, además, el aviso "seguinos en ML" (SeguirMlBanner):
 * una vez por semana por navegador, y nunca si el newsletter (NewsletterBanner)
 * ya está abierto — no le pedimos dos cosas a la misma persona a la vez.
 */
export function AffiliateTracker() {
  const [showSeguirBanner, setShowSeguirBanner] = useState(false);
  const seguirBannerHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      // Vercel Web Analytics: pipe first-party e imposible de bloquear, así el
      // evento que vale plata queda medido aunque GA lo bloquee un adblocker o
      // la red. En dev es no-op; solo cuenta en producción.
      track("affiliate_click", {
        cta_location: payload.cta_location,
        page_path: payload.page_path,
        link_url: payload.link_url,
      });

      // El newsletter (NewsletterBanner.tsx) ya ocupa este mismo rincón de
      // pantalla. Si está abierto, no competimos por la atención: no se
      // muestra esta vez y no se gasta el cupo semanal.
      const newsletterShowing = document.querySelector(".newsletter-popup");
      if (newsletterShowing || seguirBannerShownRecently()) return;

      markSeguirBannerShown();
      setShowSeguirBanner(true);
      window.gtag?.("event", "seguir_ml_banner_shown", { page_path: payload.page_path });
      window.clarity?.("event", "seguir_ml_banner_shown");
      if (seguirBannerHideTimer.current) clearTimeout(seguirBannerHideTimer.current);
      seguirBannerHideTimer.current = setTimeout(
        () => setShowSeguirBanner(false),
        SEGUIR_BANNER_AUTO_HIDE_MS
      );
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  return (
    <SeguirMlBanner
      show={showSeguirBanner}
      onClose={() => {
        if (seguirBannerHideTimer.current) clearTimeout(seguirBannerHideTimer.current);
        setShowSeguirBanner(false);
      }}
    />
  );
}
