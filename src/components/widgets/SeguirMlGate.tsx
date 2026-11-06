"use client";

/**
 * Interstitial breve, SOLO mobile: en el celular, un click de afiliado salta
 * directo a la app de MercadoLibre (deep link del sistema operativo) en vez
 * de abrir una pestaña de Safari que queda atrás — por eso el aviso pasivo
 * de SeguirMlBanner.tsx nunca llega a verse ahí (confirmado por Juan,
 * 2026-11-06: "en todas las que hago click en el celular, se va directo a
 * la app de meli"). Este componente SÍ corre antes de esa navegación, con
 * "Ir ahora" disponible desde el arranque y un máximo de ~1,4s, siguiendo el
 * límite original de Codex. Nunca cancela la compra: tocar el fondo o el
 * botón hacen lo mismo que dejar correr el tiempo — todas las salidas llevan
 * a MercadoLibre, ninguna la aborta (ver AffiliateTracker.tsx, que maneja el
 * timer real y abre el link).
 *
 * Copy (2026-11-06, pedido de Juan): la primera versión decía "Cuando abra
 * Mercado Libre, tocá Seguir" — una orden, sin ningún motivo para querer
 * hacerlo. Reescrito como pregunta + reciprocidad: la persona ACABA de
 * encontrar un precio que le gustó (por eso está por comprar), así que en
 * vez de instruir la acción se la encuadra como algo que la persona elige a
 * cambio de lo que ya recibió, no como un paso obligatorio más. El fondo
 * (bg-black/8) es apenas perceptible a propósito, para que la tarjeta se
 * sienta como una invitación y no como un modal que bloquea la pantalla.
 */
export function SeguirMlGate({
  show,
  durationMs,
  onProceed,
}: {
  show: boolean;
  durationMs: number;
  onProceed: () => void;
}) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/8 px-4 transition-opacity duration-150 print:hidden ${
        show ? "opacity-100" : "opacity-0 invisible pointer-events-none"
      }`}
      onClick={onProceed}
    >
      <div
        role="status"
        aria-live="polite"
        className="relative w-full max-w-[300px] overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--bg-primary)] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <span
          className={`absolute top-0 left-0 h-[3px] w-full origin-left bg-[var(--cta-bg)] ${
            show ? "seguir-ml-countdown" : ""
          }`}
          style={{ animationDuration: `${durationMs}ms` }}
        />
        <div className="mb-3 flex items-center justify-center gap-2 rounded-[12px] bg-[var(--bg-secondary)] px-3 py-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/seguir-ml/ml-logo-name.png" alt="Productos Virales en MercadoLibre" className="h-3.5 w-auto opacity-85" />
          <span className="relative flex flex-shrink-0 items-center">
            <span className="pointer-events-none absolute -inset-1 rounded-full border-2 border-[var(--color-discount)]" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/seguir-ml/ml-seguir-btn.png" alt="Botón Seguir" className="h-[22px] w-auto rounded-full" />
          </span>
        </div>
        <p
          className="mb-1 text-center text-[15px] font-extrabold leading-tight text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          ¿Te gustó este precio?
        </p>
        <p className="mb-3.5 text-center text-[13px] leading-tight text-[var(--text-secondary)]">
          Seguinos en Mercado Libre y enterate de los próximos
        </p>
        <button
          type="button"
          onClick={onProceed}
          className="w-full rounded-[var(--radius-pill)] bg-[var(--cta-bg)] px-4 py-2.5 text-[14px] font-bold text-[var(--cta-text)] active:scale-[0.98] transition-transform"
        >
          Ir ahora →
        </button>
      </div>
    </div>
  );
}
