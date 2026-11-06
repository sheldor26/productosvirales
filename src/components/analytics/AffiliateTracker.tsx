"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { SeguirMlBanner } from "@/components/widgets/SeguirMlBanner";
import { SeguirMlGate } from "@/components/widgets/SeguirMlGate";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

// v2 (sufijo nuevo a propósito): la clave vieja "pv_seguir_ml_banner_last_shown"
// quedaba escrita en el teléfono de cualquiera que haya disparado el aviso
// pasivo ANTES de que existiera el gate de mobile (SeguirMlGate) — aunque
// nunca lo haya llegado a VER (se mostraba en la pestaña que quedaba atrás,
// invisible en el deep link a la app). Con la clave vieja, ese click viejo
// seguía gastando el cupo semanal del gate nuevo, así que nunca se mostraba
// nada. Confirmado con una grabación de Juan, 2026-11-06.
const SEGUIR_CAP_KEY = "pv_seguir_ml_v2_last_shown";
const SEGUIR_CAP_DAYS = 7;
const SEGUIR_BANNER_AUTO_HIDE_MS = 6000;
// Mismo límite que ya validó Codex en el prototipo: máximo ~1,4s, con
// "Ir ahora" disponible desde el arranque.
const SEGUIR_GATE_DELAY_MS = 1400;
// md:hidden es el breakpoint que ya usa StickyMobileCta.tsx para "esto es mobile".
const MOBILE_BREAKPOINT = 768;
// Pedido de Juan, 2026-11-06, tras probar el gate en vivo: "no queda como
// quiero... que no le aparezca eso a la gente". Y después extendió la misma
// observación al banner pasivo de desktop: con target="_blank", la atención
// de la persona se va a la pestaña nueva de MercadoLibre, no vuelve a la que
// quedó atrás — "no tiene ningún sentido que quede así" en NINGUNO de los
// dos formatos, no solo en mobile. Los dos quedan apagados acá mientras se
// busca otro enfoque de fondo (no es un ajuste de copy o de timing, es la
// premisa completa de "mostrar algo en la pestaña que queda atrás"). Los
// componentes (SeguirMlGate.tsx, SeguirMlBanner.tsx) quedan armados para
// retomarlos — prender esto es el único cambio necesario para el momento en
// que se encuentre un enfoque que sí tenga sentido.
const SEGUIR_FEATURE_ENABLED = false;

function seguirShownRecently(): boolean {
  try {
    const v = localStorage.getItem(SEGUIR_CAP_KEY);
    if (!v) return false;
    const parsed = parseInt(v, 10);
    if (Number.isNaN(parsed)) return false;
    return Date.now() - parsed < SEGUIR_CAP_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function markSeguirShown() {
  try {
    localStorage.setItem(SEGUIR_CAP_KEY, String(Date.now()));
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
 * El mismo click dispara, además, el aviso "seguinos en ML": una vez por
 * semana por navegador, y nunca si el newsletter (NewsletterBanner) ya está
 * abierto — no le pedimos dos cosas a la misma persona a la vez. Dos formatos
 * distintos según el dispositivo (confirmado con Juan en vivo, 2026-11-06):
 *
 * - Desktop: SeguirMlBanner, pasivo, aparece DESPUÉS en la pestaña que queda
 *   atrás (el link de afiliado abre solo, target="_blank", esto nunca lo
 *   demora).
 * - Mobile: SeguirMlGate, un interstitial breve ANTES de navegar. En el
 *   celular el link de afiliado no deja "una pestaña atrás" — salta directo
 *   a la app de MercadoLibre (deep link del SO) y Safari queda en segundo
 *   plano a nivel de todo el sistema, no solo de pestaña — así que el aviso
 *   pasivo nunca llega a verse ahí. Para evitar el riesgo de que el navegador
 *   bloquee un `window.open` disparado después de un delay (lo que marcó la
 *   auditoría externa en el prototipo), la pestaña se abre en blanco DENTRO
 *   del gesto de click original —nunca se bloquea— y recién se redirige a la
 *   URL real cuando el timer termina o se toca "Ir ahora". Ninguna salida del
 *   gate cancela la compra: tocar el fondo, el botón, o dejar correr el
 *   tiempo hacen exactamente lo mismo.
 */
export function AffiliateTracker() {
  const [showSeguirBanner, setShowSeguirBanner] = useState(false);
  const seguirBannerHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [gate, setGate] = useState<{ href: string } | null>(null);
  const gateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gateTab = useRef<Window | null>(null);
  const gateHref = useRef<string | null>(null);

  const proceedGate = useCallback((trigger: "timeout" | "tap") => {
    const href = gateHref.current;
    if (!href) return;
    if (gateTimer.current) clearTimeout(gateTimer.current);
    setGate(null);
    gateHref.current = null;
    window.gtag?.("event", "seguir_ml_gate_proceed", { trigger, page_path: window.location.pathname });
    if (gateTab.current && !gateTab.current.closed) {
      // La pestaña ya estaba abierta (en blanco) desde el click original:
      // redirigirla ahora nunca cuenta como popup bloqueado.
      gateTab.current.location.href = href;
    } else {
      // No se pudo abrir en blanco en su momento (poco común) — último
      // recurso. Puede bloquearse, pero la compra nunca debe perderse.
      window.open(href, "_blank", "noopener");
    }
    gateTab.current = null;
  }, []);

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

      // El newsletter ya ocupa el mismo rincón de pantalla (o, en mobile, el
      // mismo momento de atención). Si está abierto, no competimos: no se
      // muestra esta vez y no se gasta el cupo semanal.
      if (!SEGUIR_FEATURE_ENABLED) return;

      const newsletterShowing = document.querySelector(".newsletter-popup");
      if (newsletterShowing || seguirShownRecently()) return;

      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

      if (isMobile) {
        event.preventDefault();
        markSeguirShown();
        window.gtag?.("event", "seguir_ml_banner_shown", { page_path: payload.page_path, mode: "gate" });
        window.clarity?.("event", "seguir_ml_banner_shown");
        // Abrir la pestaña en blanco DENTRO del gesto de click original: esto
        // nunca lo bloquea un navegador, a diferencia de llamar window.open
        // más tarde desde el setTimeout.
        gateTab.current = window.open("", "_blank");
        gateHref.current = link.href;
        setGate({ href: link.href });
        gateTimer.current = setTimeout(() => proceedGate("timeout"), SEGUIR_GATE_DELAY_MS);
        return;
      }

      markSeguirShown();
      setShowSeguirBanner(true);
      window.gtag?.("event", "seguir_ml_banner_shown", { page_path: payload.page_path, mode: "banner" });
      window.clarity?.("event", "seguir_ml_banner_shown");
      if (seguirBannerHideTimer.current) clearTimeout(seguirBannerHideTimer.current);
      seguirBannerHideTimer.current = setTimeout(
        () => setShowSeguirBanner(false),
        SEGUIR_BANNER_AUTO_HIDE_MS
      );
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, [proceedGate]);

  return (
    <>
      <SeguirMlBanner
        show={showSeguirBanner}
        onClose={() => {
          if (seguirBannerHideTimer.current) clearTimeout(seguirBannerHideTimer.current);
          setShowSeguirBanner(false);
        }}
      />
      <SeguirMlGate
        show={gate !== null}
        durationMs={SEGUIR_GATE_DELAY_MS}
        onProceed={() => proceedGate("tap")}
      />
    </>
  );
}
