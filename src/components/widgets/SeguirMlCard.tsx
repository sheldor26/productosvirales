import Image from "next/image";
import bannerArt from "../../../public/images/seguir-ml/banner-art.jpg";

const ML_PROFILE_URL = "https://www.mercadolibre.com.ar/social/jm159";

const COPY = {
  default: {
    eyebrow: "Nuestro perfil en MercadoLibre",
    headline: "No te pierdas los próximos cupones",
    sub: "Seguinos una vez y listo — te avisamos de los descuentos antes que nadie.",
  },
  verdict: {
    eyebrow: "¿Te gustó este precio?",
    headline: "Seguinos para ver los próximos",
    sub: "Mismo perfil que verificamos para esta ficha — cupones reales, nada inventado.",
  },
} as const;

/**
 * Invitación a seguir el perfil de MercadoLibre, EMBEBIDA en el contenido —
 * no un popup, no depende de ningún click ni timer. Reemplaza los dos
 * intentos anteriores (SeguirMlGate/SeguirMlBanner, apagados en
 * AffiliateTracker.tsx): los dos dependían de que la persona volviera a
 * mirar la pestaña que quedó atrás después de comprar, y eso no pasa — la
 * atención se va con la pestaña/app nueva de MercadoLibre (confirmado por
 * Juan, 2026-11-06).
 *
 * Esto se ve ANTES de que la persona haga cualquier click, como contenido
 * normal de la página — no importa a dónde se vaya después. Server
 * component puro: sin JS, sin estado, sin posición fija.
 *
 * El fondo (banner-art.jpg) es una ilustración generada con agy a pedido de
 * Juan ("tiene que ser una obra de arte, no algo precario"): gradiente
 * lavanda-coral con los colores reales del logo del sitio (#b8a9d4 /
 * #f4b5a4, ver Header.tsx), no colores inventados. Mismo fondo en las dos
 * variantes de copy para que se sienta como una sola pieza de diseño
 * reconocible, aunque el texto cambie según dónde aparezca — pedido de
 * Juan de que se vea en varios momentos de una guía sin sentirse repetido.
 *
 * Es un link directo al perfil (no al link de afiliado del producto): nunca
 * compite ni se confunde con el botón de compra, que sigue siendo el único
 * CTA amarillo de la página (regla de oro CRO del sitio).
 */
export function SeguirMlCard({
  copy = "default",
  id,
}: {
  copy?: keyof typeof COPY;
  id?: string;
}) {
  const text = COPY[copy];
  return (
    <a
      id={id}
      href={ML_PROFILE_URL}
      target="_blank"
      rel="noopener"
      data-channel-location={`guia-${copy}`}
      className="seguir-ml-card group relative block overflow-hidden rounded-[var(--radius-card)] no-underline"
    >
      <Image
        src={bannerArt}
        alt=""
        aria-hidden
        placeholder="blur"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 768px"
      />
      <div className="relative flex flex-col items-start gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-7">
        <div className="max-w-[420px]">
          <span
            className="mb-1.5 inline-block rounded-full bg-white/50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#4a3b63] backdrop-blur-sm"
          >
            {text.eyebrow}
          </span>
          <h3
            className="text-[20px] font-extrabold leading-tight text-[#2b2140] md:text-[22px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {text.headline}
          </h3>
          <p className="mt-1 text-[13.5px] leading-snug text-[#4a3b63]">{text.sub}</p>
        </div>

        <div className="flex shrink-0 items-center gap-3 rounded-[16px] bg-white/80 p-2.5 pr-4 shadow-[0_4px_18px_rgba(43,33,64,0.18)] backdrop-blur-sm transition-colors group-hover:bg-white">
          <span className="flex items-center gap-1.5 rounded-full bg-white px-2 py-1.5 shadow-sm">
            {/* width/height = dimensión real del PNG (no la renderizada): el navegador
                las usa para reservar el aspect-ratio antes de que cargue la imagen y
                evitar un salto de layout (CLS) — la altura visible la sigue poniendo
                la className (hallazgo trio-auditor, 2026-11-07). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/seguir-ml/ml-logo-name.png" alt="" aria-hidden width={637} height={56} className="h-[11px] w-auto" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/seguir-ml/ml-seguir-btn.png" alt="" aria-hidden width={144} height={61} className="h-[17px] w-auto rounded-full" />
          </span>
          <span className="text-[13px] font-extrabold text-[#2b2140]">Seguir →</span>
        </div>
      </div>
    </a>
  );
}
