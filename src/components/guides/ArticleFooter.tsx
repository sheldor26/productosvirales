import Link from "next/link";
import type { Guide } from "@/lib/types";
import { getRelatedGuides } from "@/data/guides";
import { calcReadingTime } from "@/lib/reading-time";
import { NewsletterForm } from "./NewsletterForm";

interface ArticleFooterProps {
  guide: Guide;
}

function formatCategory(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ArticleFooter({ guide }: ArticleFooterProps) {
  const related = getRelatedGuides(guide, 4);
  const categoryLabel = formatCategory(guide.category);
  const hasUpdate = guide.updatedDate && guide.updatedDate !== guide.publishedDate;

  return (
    <footer className="not-prose mt-14 md:mt-16 space-y-12">
      {/* About this guide / author bio */}
      <section
        aria-label="Sobre esta guía"
        className="pt-8 border-t"
        style={{ borderTopColor: "var(--border)" }}
      >
        <p
          className="text-[11px] font-semibold tracking-[0.14em] mb-4"
          style={{ color: "var(--editorial-accent)" }}
        >
          SOBRE ESTA GUÍA
        </p>
        <div className="flex items-start gap-4">
          <div
            aria-hidden="true"
            className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white text-base"
            style={{ backgroundColor: "var(--editorial-accent)" }}
          >
            PV
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-semibold text-[var(--text-primary)]">
              Escrito por Equipo productosvirales
            </p>
            <p className="mt-1 text-[14px] leading-relaxed text-[var(--text-secondary)]">
              Analizamos el mercado argentino de {categoryLabel.toLowerCase()} desde 2024.
              Probamos cada producto antes de recomendarlo y actualizamos precios y
              disponibilidad semanalmente.
            </p>
            <p className="mt-3 text-xs text-[var(--text-muted)]">
              Publicado: {formatDate(guide.publishedDate)}
              {hasUpdate && <> · Última actualización: {formatDate(guide.updatedDate)}</>}
              {" · "}
              {calcReadingTime(guide)} min de lectura
            </p>
          </div>
        </div>
      </section>

      {/* Related guides */}
      {related.length > 0 && (
        <section
          aria-label="Más guías relacionadas"
          className="pt-8 border-t"
          style={{ borderTopColor: "var(--border)" }}
        >
          <p
            className="text-[11px] font-semibold tracking-[0.14em] mb-5"
            style={{ color: "var(--editorial-accent)" }}
          >
            MÁS GUÍAS DE {categoryLabel.toUpperCase()}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((g) => (
              <Link
                key={g.slug}
                href={`/guias/${g.slug}`}
                className="group block rounded-[6px] border p-3 md:p-4 transition-colors hover:bg-[var(--bg-secondary)]"
                style={{ borderColor: "var(--border)" }}
              >
                <p
                  className="text-[13px] md:text-sm font-semibold text-[var(--text-primary)] leading-tight line-clamp-4 group-hover:opacity-80"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {g.h1}
                </p>
                <p className="mt-2 text-xs text-[var(--text-muted)]">
                  {calcReadingTime(g)} min
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section
        aria-label="Newsletter"
        className="pt-8 border-t"
        style={{ borderTopColor: "var(--border)" }}
      >
        <p
          className="text-[11px] font-semibold tracking-[0.14em] mb-3"
          style={{ color: "var(--editorial-accent)" }}
        >
          NEWSLETTER
        </p>
        <h3
          className="text-xl md:text-2xl font-semibold text-[var(--text-primary)] leading-tight mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Recibí las nuevas guías por email
        </h3>
        <p className="text-sm text-[var(--text-secondary)] mb-4 max-w-md">
          Sin spam. Solo cuando publicamos contenido nuevo.
        </p>
        <NewsletterForm />
      </section>
    </footer>
  );
}
