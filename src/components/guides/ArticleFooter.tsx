import Link from "next/link";
import type { Guide } from "@/lib/types";
import { getRelatedGuides } from "@/data/guides";
import { guideHref } from "@/lib/guide-url";
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
  // Las fechas del contenido son "YYYY-MM-DD" sin hora: new Date() las lee como
  // medianoche UTC y, renderizadas en horario argentino (UTC-3), caian un dia antes.
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
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
              Escrito por el Equipo de Productos Virales
            </p>
            <p className="mt-1 text-[14px] leading-relaxed text-[var(--text-secondary)]">
              Curamos el mercado argentino de {categoryLabel.toLowerCase()} a partir de
              reseñas reales de compradores y fichas técnicas del fabricante, y
              verificamos precios y disponibilidad de forma constante.
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

      {/* Canal de Telegram + WhatsApp: bajas de precio verificadas */}
      <section
        aria-label="Canales de bajas de precio"
        className="pt-8 border-t"
        style={{ borderTopColor: "var(--border)" }}
      >
        <p
          className="text-[11px] font-semibold tracking-[0.14em] mb-3"
          style={{ color: "var(--editorial-accent)" }}
        >
          BAJAS DE PRECIO
        </p>
        <h3
          className="text-xl md:text-2xl font-semibold text-[var(--text-primary)] leading-tight mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Te aviso yo cuando baja de precio de verdad
        </h3>
        <p className="text-sm text-[var(--text-secondary)] mb-4 max-w-md">
          Chequeo los precios a mano antes de avisar. Nada de &ldquo;ofertas&rdquo; infladas ni urgencia falsa.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://t.me/productosvirales_argentina"
            target="_blank"
            rel="noopener"
            data-channel-location="footer"
            className="not-prose inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-[6px] text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--editorial-accent)" }}
          >
            Sumarme al canal de Telegram
          </a>
          <a
            href="https://whatsapp.com/channel/0029Vb8OJXB6mYPIHG0M4a1t"
            target="_blank"
            rel="noopener"
            data-channel-location="footer"
            className="not-prose inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-[6px] text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--editorial-accent)" }}
          >
            Sumarme al canal de WhatsApp
          </a>
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
                href={guideHref(g)}
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
        <NewsletterForm source={guideHref(guide)} />
      </section>
    </footer>
  );
}
