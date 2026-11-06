const ML_PROFILE_URL = "https://www.mercadolibre.com.ar/social/jm159";

/**
 * Invitación a seguir el perfil de MercadoLibre, EMBEBIDA en el contenido —
 * no un popup, no depende de ningún click ni timer. Reemplaza el intento
 * anterior (SeguirMlGate/SeguirMlBanner, apagados en AffiliateTracker.tsx):
 * los dos dependían de que la persona volviera a mirar la pestaña que quedó
 * atrás después de comprar, y eso no pasa — la atención se va con la
 * pestaña nueva de MercadoLibre (confirmado por Juan, 2026-11-06).
 *
 * Esto se ve ANTES de que la persona haga cualquier click, en el mismo
 * lugar donde ya está mirando (al lado del botón de compra), así que no
 * importa a dónde se vaya después. Server component puro — sin JS, sin
 * estado, sin posición fija: un link más de la página.
 *
 * Es un link directo al perfil (no al link de afiliado del producto): nunca
 * compite ni se confunde con el botón de compra, que sigue siendo el único
 * CTA amarillo de la página (regla de oro CRO del sitio).
 */
export function SeguirMlInline({ variant = "light" }: { variant?: "light" | "dark" }) {
  const dark = variant === "dark";
  return (
    <a
      id="seguir-ml-inline"
      href={ML_PROFILE_URL}
      target="_blank"
      rel="noopener"
      data-channel-location="product-verdict"
      className={`mt-4 inline-flex items-center gap-2 rounded-[var(--radius-pill)] px-3.5 py-2 text-[12.5px] transition-colors ${
        dark
          ? "bg-white/10 text-white/80 hover:bg-white/15 hover:text-white"
          : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border)] hover:text-[var(--text-primary)]"
      }`}
    >
      <span
        className={`flex items-center gap-1 rounded-full px-1.5 py-1 ${
          dark ? "bg-white" : "bg-[var(--bg-primary)]"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/seguir-ml/ml-logo-name.png" alt="" aria-hidden className="h-[10px] w-auto" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/seguir-ml/ml-seguir-btn.png" alt="" aria-hidden className="h-[15px] w-auto rounded-full" />
      </span>
      <span>
        Seguinos en MercadoLibre para no perderte los próximos cupones
      </span>
    </a>
  );
}
