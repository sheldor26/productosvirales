"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Rastreo de VISIBILIDAD de los botones de afiliado (evento `cta_view`).
 *
 * Con un IntersectionObserver, dispara `cta_view` la primera vez que cada botón
 * de compra entra en pantalla. Cruzado contra `affiliate_click`, da la métrica
 * clave de un sitio de afiliados:
 *
 *     affiliate_click / cta_view = % que, habiendo VISTO el botón, lo clickeó
 *
 * Eso separa las dos fugas que el scroll-depth solo no distingue:
 *   - pocos cta_view  -> nunca llegan al botón (subir el CTA, acortar el medio)
 *   - muchos cta_view, pocos clicks -> lo ven pero no convence (copy, precio)
 *
 * Manda el `cta_location` (above-fold, verdict, sticky, card, ficha…) para saber
 * qué botón se ve y cuál se clickea. Una vez por botón y por página; se resetea
 * al cambiar de ruta. Un MutationObserver engancha los botones que aparecen
 * después (ej. la barra sticky que se monta al scrollear).
 */
export function CtaTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const seen = new WeakSet<Element>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const link = entry.target as HTMLAnchorElement;
          io.unobserve(link);
          if (seen.has(link)) continue;
          seen.add(link);
          window.gtag?.("event", "cta_view", {
            link_url: link.href,
            cta_location: link.dataset.ctaLocation || "otro",
            page_path: window.location.pathname,
          });
        }
      },
      { threshold: 0.5 }
    );

    function observeAll(root: ParentNode) {
      root.querySelectorAll<HTMLAnchorElement>('a[rel~="sponsored"]').forEach((a) => {
        if (!seen.has(a)) io.observe(a);
      });
    }

    observeAll(document);

    // Botones que se montan después (barra sticky, contenido diferido).
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          const el = node as Element;
          if (el.matches?.('a[rel~="sponsored"]') && !seen.has(el)) {
            io.observe(el as HTMLAnchorElement);
          }
          observeAll(el);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
