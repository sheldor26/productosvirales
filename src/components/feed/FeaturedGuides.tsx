import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Guide } from "@/lib/types";
import { guideHref } from "@/lib/guide-url";
import { getGuideThumbnail } from "@/lib/guide-thumbnail";
import { toPlainText } from "@/lib/parse-inline-links";

function GuideCard({ guide, priority }: { guide: Guide; priority?: boolean }) {
  const thumbnail = getGuideThumbnail(guide);
  const title = guide.ogTitle || guide.title;
  // `ogDescription` no pasa por injectLivePrices (igual que en /guias), así que
  // un {{precio:…}} escrito ahí se vería literal en la tarjeta.
  const dek = toPlainText(guide.ogDescription || guide.metaDescription);

  return (
    <Link
      href={guideHref(guide)}
      className="group flex flex-col rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--bg-primary)] overflow-hidden transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)]"
    >
      {thumbnail && (
        <div className="relative w-full h-[140px] bg-white overflow-hidden">
          <Image
            src={thumbnail.src}
            alt={thumbnail.alt}
            width={thumbnail.width}
            height={thumbnail.height}
            preload={priority}
            className={`w-full h-full ${thumbnail.fit === "contain" ? "object-contain p-3" : "object-cover"}`}
          />
        </div>
      )}
      <div className="flex flex-col flex-1 p-4">
        <h3
          className="text-[15.5px] font-bold leading-[1.25] mb-1.5 text-[var(--text-primary)] line-clamp-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h3>
        <p className="text-[13px] text-[var(--text-secondary)] leading-snug line-clamp-2 mb-3">
          {dek}
        </p>
        <span className="mt-auto inline-flex items-center gap-1 font-bold text-[13px] text-[var(--text-primary)] group-hover:underline">
          Ver guía completa
          <ArrowRight size={14} className="shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

/**
 * Bloque de guías destacadas en la home. La home (la página de mayor
 * autoridad del sitio) no tenía un solo link en el cuerpo hacia ninguna de
 * las guías, que son el activo editorial real: todo el link juice interno se
 * iba al feed de productos. `guides` ya viene rotado y recortado por quien
 * llama (mismo patrón que `getRotatedVisibleProducts` para el feed).
 */
export function FeaturedGuides({ guides }: { guides: Guide[] }) {
  if (guides.length === 0) return null;

  return (
    <section className="not-prose">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2
            className="text-xl md:text-2xl font-bold text-[var(--text-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Guías de compra
          </h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Comparativas honestas: precios reales, opiniones de compradores y los contras que nadie te cuenta
          </p>
        </div>
        <Link
          href="/guias"
          className="shrink-0 text-sm font-semibold text-[var(--text-primary)] hover:underline whitespace-nowrap"
        >
          Ver todas →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
        {guides.map((guide, i) => (
          <GuideCard key={guide.slug} guide={guide} priority={i === 0} />
        ))}
      </div>
    </section>
  );
}
