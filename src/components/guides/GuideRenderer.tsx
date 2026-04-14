import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { parseInlineLinks } from "@/lib/parse-inline-links";
import type { Guide, GuideSection } from "@/lib/types";

interface GuideRendererProps {
  guide: Guide;
}

function SectionRenderer({ section }: { section: GuideSection }) {
  switch (section.type) {
    case "h2":
      return (
        <h2
          id={section.id}
          className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mt-10 mb-4 pb-2 border-b border-[var(--border)] scroll-mt-20"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {section.title}
        </h2>
      );

    case "h3":
      return (
        <h3
          id={section.id}
          className="text-lg md:text-xl font-bold text-[var(--text-primary)] mt-6 mb-3 scroll-mt-20"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {section.title}
        </h3>
      );

    case "p":
      return (
        <p className="text-[15px] md:text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          {section.content ? parseInlineLinks(section.content) : null}
        </p>
      );

    case "table":
      return (
        <div className="my-6 overflow-x-auto rounded-[var(--radius-card)] border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--bg-secondary)]">
                {section.headers?.map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-semibold text-[var(--text-primary)] border-b border-[var(--border)]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.rows?.map((row, i) => (
                <tr
                  key={i}
                  className={i % 2 === 1 ? "bg-[var(--bg-secondary)]/40" : ""}
                >
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="px-4 py-3 text-[var(--text-secondary)] border-t border-[var(--border)]"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "card":
      if (!section.card) return null;
      return (
        <div className="my-6 p-5 md:p-6 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--bg-primary)]">
          <h3
            className="text-lg md:text-xl font-bold text-[var(--text-primary)] mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {section.card.heading}
          </h3>
          {section.card.paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-[15px] leading-relaxed text-[var(--text-secondary)] mb-3"
            >
              {p}
            </p>
          ))}
          {section.card.ctas && section.card.ctas.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {section.card.ctas.map((cta) => (
                <a
                  key={cta.href}
                  href={cta.href}
                  target="_blank"
                  rel="nofollow sponsored noopener"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-[var(--radius-pill)] bg-[var(--cta-bg)] text-[var(--cta-text)] hover:bg-[var(--cta-hover)] transition-colors"
                >
                  {cta.label}
                  <ExternalLink size={13} />
                </a>
              ))}
            </div>
          )}
        </div>
      );

    case "verdict":
      return (
        <div className="my-5 p-4 rounded-[var(--radius-card)] border-l-4 border-[var(--color-trending-up)] bg-[var(--color-trending-up)]/10">
          <p className="text-[15px] leading-relaxed text-[var(--text-primary)] font-medium">
            {section.content}
          </p>
        </div>
      );

    case "warning":
      return (
        <div className="my-5 p-4 rounded-[var(--radius-card)] border-l-4 border-amber-500 bg-amber-500/10">
          <p className="text-[15px] leading-relaxed text-[var(--text-primary)]">
            {section.content}
          </p>
        </div>
      );

    case "list":
      return (
        <ul className="my-4 space-y-2 pl-1">
          {(section.items as string[])?.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-[15px] leading-relaxed text-[var(--text-secondary)]"
            >
              <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]" />
              {item}
            </li>
          ))}
        </ul>
      );

    case "bad":
      return (
        <div className="my-5 p-4 rounded-[var(--radius-card)] border-l-4 border-[var(--color-discount)] bg-[var(--color-discount)]/10">
          {section.title && (
            <p className="text-[15px] font-bold text-[var(--text-primary)] mb-2">
              {section.title}
            </p>
          )}
          <p className="text-[15px] leading-relaxed text-[var(--text-primary)]">
            {section.content}
          </p>
        </div>
      );

    case "image":
      return (
        <figure className="my-6">
          <div className="rounded-[var(--radius-card)] overflow-hidden border border-[var(--border)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={section.src || ""}
              alt={section.alt || ""}
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
          {section.alt && (
            <figcaption className="mt-2 text-xs text-[var(--text-muted)] text-center">
              {section.alt}
            </figcaption>
          )}
        </figure>
      );

    case "toc":
      return (
        <nav className="my-6 p-5 rounded-[var(--radius-card)] bg-[var(--bg-secondary)] border border-[var(--border)]">
          <p className="font-semibold text-[var(--text-primary)] mb-2">
            {section.title}
          </p>
          <ul className="space-y-1.5">
            {(section.items as Array<{ label: string; href: string }>)?.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm text-[var(--cta-bg)] hover:underline"
                >
                  → {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      );

    default:
      return null;
  }
}

export function GuideRenderer({ guide }: GuideRendererProps) {
  return (
    <article className="max-w-[780px] mx-auto px-4 md:px-6 py-6 md:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-4">
        <Link href="/" className="hover:text-[var(--text-secondary)] transition-colors">
          Inicio
        </Link>
        <span>→</span>
        <Link
          href="/guias"
          className="hover:text-[var(--text-secondary)] transition-colors"
        >
          Guías
        </Link>
        <span>→</span>
        <span className="text-[var(--text-secondary)] truncate">{guide.title}</span>
      </nav>

      {/* H1 */}
      <h1
        className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] leading-tight mb-3"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {guide.h1}
      </h1>

      {/* Meta */}
      <p className="text-sm text-[var(--text-muted)] mb-6">
        Actualizado{" "}
        {new Date(guide.updatedDate).toLocaleDateString("es-AR", {
          year: "numeric",
          month: "long",
        })}{" "}
        · productosvirales.com.ar
      </p>

      {/* Disclosure */}
      {guide.hasDisclosure && (
        <div className="mb-8 p-3 md:p-4 rounded-[var(--radius-card)] border-l-2 border-[var(--border)] bg-[var(--bg-secondary)]">
          <p className="text-xs md:text-sm text-[var(--text-muted)] leading-relaxed">
            Transparencia: este artículo tiene enlaces de afiliado a MercadoLibre. Si
            comprás algo a través de ellos, recibimos una comisión chica sin costo extra
            para vos. Eso no cambia nuestras opiniones.
          </p>
        </div>
      )}

      {/* Intro */}
      {guide.intro.map((p, i) => (
        <p
          key={i}
          className="text-[15px] md:text-base leading-relaxed text-[var(--text-secondary)] mb-4"
        >
          {p}
        </p>
      ))}

      {/* Sections */}
      {guide.sections.map((section, i) => (
        <SectionRenderer key={i} section={section} />
      ))}

      {/* FAQ */}
      {guide.faq && guide.faq.length > 0 && (
        <div id="faq" className="mt-10 space-y-4">
          {!guide.sections.some((s) => s.id === "faq") && (
            <h2
              className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mt-10 mb-4 pb-2 border-b border-[var(--border)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Preguntas frecuentes
            </h2>
          )}
          {guide.faq.map((item) => (
            <details
              key={item.question}
              className="group rounded-[var(--radius-card)] border border-[var(--border)] overflow-hidden"
            >
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer text-[15px] font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors">
                {item.question}
                <span className="shrink-0 ml-2 transition-transform group-open:rotate-90">
                  →
                </span>
              </summary>
              <div className="px-4 pb-4 text-[15px] text-[var(--text-secondary)] leading-relaxed">
                {parseInlineLinks(item.answer)}
              </div>
            </details>
          ))}
        </div>
      )}

      {/* Internal links */}
      {guide.internalLinks && guide.internalLinks.length > 0 && (
        <aside className="mt-10 p-5 rounded-[var(--radius-card)] bg-[var(--bg-secondary)] border border-[var(--border)]">
          <p className="font-semibold text-[var(--text-primary)] mb-3">
            {guide.internalLinksTitle || "Guías relacionadas"}
          </p>
          <div className="flex flex-wrap gap-2">
            {guide.internalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-block px-3 py-1.5 text-sm rounded-[var(--radius-pill)] bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--cta-bg)] hover:bg-[var(--bg-secondary)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </aside>
      )}
    </article>
  );
}
