import Link from "next/link";
import type { Guide } from "@/lib/types";
import { calcReadingTime } from "@/lib/reading-time";
import { parseInlineLinks } from "@/lib/parse-inline-links";
import { ShareButtons } from "@/components/widgets/ShareButtons";
import { getCategoryName } from "@/lib/category-labels";

interface ArticleHeaderProps {
  guide: Guide;
}

function formatDate(iso: string): string {
  // Las fechas del contenido son "YYYY-MM-DD" sin hora: new Date() las lee como
  // medianoche UTC y, renderizadas en horario argentino (UTC-3), caian un dia antes.
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function ArticleHeader({ guide }: ArticleHeaderProps) {
  const readingTime = calcReadingTime(guide);
  const standfirst = guide.standfirst || guide.intro[0];
  const categoryLabel = getCategoryName(guide.category).toUpperCase();
  const hasUpdate = guide.updatedDate && guide.updatedDate !== guide.publishedDate;

  return (
    <header className="mb-8 md:mb-10">
      {/* Breadcrumb. En mobile es, junto al eyebrow, el único texto navegable
          arriba del fold. Estaba en --text-muted (#999), que sobre blanco da
          2,85:1 de contraste: por debajo del mínimo accesible. Subrayado
          punteado para que se lea como link sin depender del hover, que en
          celular no existe. */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-[13px] text-[var(--text-secondary)] mb-5"
      >
        <Link href="/" className="hover:text-[var(--text-primary)] underline underline-offset-2 decoration-dotted decoration-[var(--text-muted)] transition-colors">
          Inicio
        </Link>
        <span aria-hidden="true" className="text-[var(--text-muted)]">→</span>
        <Link href="/guias" className="hover:text-[var(--text-primary)] underline underline-offset-2 decoration-dotted decoration-[var(--text-muted)] transition-colors">
          Guías
        </Link>
      </nav>

      {/* Eyebrow. Es el único enlace interno arriba del fold además del
          breadcrumb: manda al hub de guías, anclado en esta categoría. */}
      <p className="text-[11px] md:text-xs font-semibold tracking-[0.14em] mb-4">
        <Link
          href={`/guias#cat-${guide.category}`}
          className="hover:underline underline-offset-2"
          style={{ color: "var(--editorial-accent)" }}
        >
          GUÍAS · {categoryLabel}
        </Link>
      </p>

      {/* H1 */}
      <h1
        className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] leading-[1.08] tracking-tight mb-5 text-balance"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {guide.h1}
      </h1>

      {/* Standfirst */}
      {standfirst && (
        <p className="text-lg md:text-xl leading-[1.55] text-[var(--text-secondary)] mb-6 max-w-[640px] text-pretty">
          {parseInlineLinks(standfirst)}
        </p>
      )}

      {/* Byline */}
      <div className="flex flex-wrap items-center gap-3 pt-5 pb-5 border-t border-b border-[var(--border)] text-sm">
        {/* Avatar (initials) */}
        <div
          aria-hidden="true"
          className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-semibold text-white"
          style={{ backgroundColor: "var(--editorial-accent)" }}
        >
          PV
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[var(--text-muted)]">
          <Link
            href="/sobre-nosotros"
            className="text-[var(--text-secondary)] font-medium hover:underline underline-offset-2"
          >
            Por Equipo productosvirales
          </Link>
          <span aria-hidden="true" className="text-[var(--text-muted)]">
            ·
          </span>
          <time dateTime={hasUpdate ? guide.updatedDate : guide.publishedDate}>
            {hasUpdate ? "Actualizado " : "Publicado "}
            {formatDate(hasUpdate ? guide.updatedDate : guide.publishedDate)}
          </time>
          <span aria-hidden="true" className="text-[var(--text-muted)]">
            ·
          </span>
          <span>{readingTime} min de lectura</span>
        </div>
        <div className="ml-auto">
          <ShareButtons title={guide.h1} />
        </div>
      </div>

      {/* Disclosure de afiliados: antes era una caja con borde propia, una más
          de 4-5 cajas apiladas antes del primer párrafo de contenido real
          (hallazgo de la ronda de mejoras de UX). Una línea discreta acá,
          justo debajo del byline, sigue siendo clara y visible arriba del
          fold sin sumar otra caja. */}
      {guide.hasDisclosure && (
        <p className="pt-3 text-xs text-[var(--text-muted)] leading-relaxed">
          Contiene enlaces de afiliado a MercadoLibre: si comprás a través de ellos, recibimos una comisión chica sin costo extra para vos.{" "}
          <Link href="/metodologia" className="underline underline-offset-2 hover:text-[var(--text-secondary)]">
            Cómo funciona
          </Link>
        </p>
      )}
    </header>
  );
}
