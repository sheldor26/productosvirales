"use client";

import { ArrowRight, X } from "lucide-react";

const ML_PROFILE_URL = "https://www.mercadolibre.com.ar/social/jm159";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

/**
 * Aviso no bloqueante que invita a seguir el perfil de MercadoLibre, disparado
 * por AffiliateTracker.tsx en el primer click a un link de afiliado por
 * visita. Nunca demora ni condiciona esa navegación: el link de afiliado ya
 * abrió solo (target="_blank"), esto es un segundo pedido en paralelo que
 * corre en la pestaña que se queda acá.
 *
 * Mismo "slot" que NewsletterBanner.tsx (bottom-[84px] en mobile, por encima
 * de la barra de compra de StickyMobileCta.tsx; bottom-5 right-5 en desktop)
 * para no pelear por el mismo rincón de pantalla. Si el newsletter ya está
 * abierto, AffiliateTracker.tsx no llega a mostrar este aviso esa vez (ver
 * ese archivo) y no gasta su cupo semanal — hay otra oportunidad más adelante.
 *
 * La captura (logo + botón Seguir) está recortada a propósito sin mostrar
 * conteo de seguidores ni códigos de cupón: esos datos se desactualizan y
 * quedarían mintiendo apenas cambien en MercadoLibre.
 */
export function SeguirMlBanner({ show, onClose }: { show: boolean; onClose: () => void }) {
  return (
    <div className="fixed z-40 left-3 right-3 bottom-[84px] sm:left-auto sm:right-5 sm:bottom-5 sm:w-[340px] print:hidden">
      <div
        role="status"
        aria-live="polite"
        tabIndex={show ? 0 : -1}
        onClick={() => {
          window.gtag?.("event", "seguir_ml_banner_click", { page_path: window.location.pathname });
          window.clarity?.("event", "seguir_ml_banner_click");
          window.open(ML_PROFILE_URL, "_blank", "noopener");
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            (e.currentTarget as HTMLDivElement).click();
          }
        }}
        aria-label="Seguinos en Mercado Libre: cupones nuevos todas las semanas"
        className={`relative flex items-center gap-3 overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--bg-primary)] p-3 shadow-[0_12px_32px_rgba(0,0,0,0.16)] cursor-pointer transition-[transform,opacity,box-shadow] duration-300 hover:shadow-[0_16px_40px_rgba(0,0,0,0.2)] active:scale-[0.98] ${
          show ? "translate-y-0 opacity-100 visible" : "translate-y-4 opacity-0 invisible pointer-events-none"
        }`}
      >
        <span
          className={`absolute bottom-0 left-0 h-[3px] w-full origin-left bg-[var(--cta-bg)] ${
            show ? "seguir-ml-countdown" : ""
          }`}
        />
        <span className="relative flex h-[50px] w-[50px] flex-shrink-0 items-center justify-center rounded-[13px] bg-[var(--bg-secondary)]">
          <span className="pointer-events-none absolute h-[17px] w-[33px] rounded-full border-2 border-[var(--color-discount)]" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/seguir-ml/ml-seguir-btn.png" alt="" aria-hidden className="h-[23px] w-auto rounded-full" />
        </span>
        <span className="min-w-0 flex-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/seguir-ml/ml-logo-name.png" alt="" aria-hidden className="mb-1 h-3 w-auto opacity-80" />
          <span className="block text-[14px] font-extrabold leading-tight text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
            Cupones nuevos todas las semanas
          </span>
          <span className="block text-[12.5px] leading-tight text-[var(--text-secondary)]">
            Tocá para seguirnos en Mercado Libre
          </span>
        </span>
        <ArrowRight size={16} className="hidden flex-shrink-0 text-[var(--border)] sm:block" aria-hidden />
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Cerrar aviso"
        className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bg-primary)]/85 text-[var(--text-secondary)] hover:bg-[var(--border)] hover:text-[var(--text-primary)] ${
          show ? "" : "pointer-events-none"
        }`}
      >
        <X size={12} />
      </button>
    </div>
  );
}
