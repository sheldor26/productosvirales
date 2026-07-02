"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Rastreo de profundidad de lectura en TODO el sitio.
 *
 * Mide hasta dónde baja el lector y dispara un evento `scroll_depth` en GA4 al
 * cruzar cada hito (25/50/75/90%), una sola vez por hito y por página. Con eso,
 * cruzado contra `affiliate_click`, se puede ver por guía dónde deja de leer la
 * gente: si cae al 40% y el botón de compra está al 70%, nunca lo ve. Ahí está
 * la fuga concreta que se optimiza (subir el CTA, cortar el relleno del medio).
 *
 * Detalles:
 * - Se resetea en cada cambio de ruta (App Router no remonta el layout, así que
 *   escuchamos `usePathname`).
 * - En páginas cortas que no scrollean, marca 90% al toque (el lector vio todo).
 * - Manda el `percent` y el `page_path` para poder agrupar por guía en GA4.
 * - Pasivo y con throttle por rAF: cero impacto en el scroll.
 */
const THRESHOLDS = [25, 50, 75, 90] as const;

export function ScrollDepthTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const fired = new Set<number>();
    let ticking = false;

    function measure() {
      ticking = false;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      // Página que no scrollea (más corta que el viewport): el lector ve todo.
      const ratio = scrollable <= 0 ? 1 : (window.scrollY + window.innerHeight) / doc.scrollHeight;
      const percent = Math.min(100, Math.round(ratio * 100));

      for (const t of THRESHOLDS) {
        if (percent >= t && !fired.has(t)) {
          fired.add(t);
          window.gtag?.("event", "scroll_depth", {
            percent: t,
            page_path: window.location.pathname,
          });
        }
      }
      if (fired.size === THRESHOLDS.length) {
        window.removeEventListener("scroll", onScroll);
      }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(measure);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    measure(); // por si la página ya carga corta o scrolleada
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
}
