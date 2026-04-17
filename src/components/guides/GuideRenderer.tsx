import Link from "next/link";
import { ExternalLink, Target, Award, Tag } from "lucide-react";
import { parseInlineLinks } from "@/lib/parse-inline-links";
import type { Guide, GuideSection } from "@/lib/types";
import { ArticleHeader } from "./ArticleHeader";
import { ReadingProgressBar } from "./ReadingProgressBar";
import { TableOfContents } from "./TableOfContents";
import { ProductCard } from "./ProductCard";
import { QuickPicks } from "./QuickPicks";
import { ensureSectionIds, getTocItems } from "@/lib/slug";

interface GuideRendererProps {
  guide: Guide;
}

function SectionRenderer({ section }: { section: GuideSection }) {
  switch (section.type) {
    case "h2":
      return (
        <h2
          id={section.id}
          className="text-[26px] md:text-[32px] font-bold text-[var(--text-primary)] mt-14 md:mt-16 mb-5 pb-2 scroll-mt-20 leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {section.title}
        </h2>
      );

    case "h3":
      return (
        <h3
          id={section.id}
          className="text-xl md:text-[22px] font-semibold text-[var(--text-primary)] mt-10 mb-3 scroll-mt-20 leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {section.title}
        </h3>
      );

    case "p":
      return (
        <p className="text-[17px] md:text-[18px] leading-[1.7] text-[var(--text-secondary)] mb-6">
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
                      {parseInlineLinks(cell)}
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
        <ul className="my-6 space-y-3 pl-1">
          {(section.items as string[])?.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-[17px] md:text-[18px] leading-[1.7] text-[var(--text-secondary)]"
            >
              <span className="shrink-0 mt-[10px] w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--editorial-accent)" }} />
              <span>{parseInlineLinks(item)}</span>
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

    case "image": {
      const size = section.imageSize || "inline-lg";
      const sizeClass = {
        "hero": "w-full max-w-none aspect-[1200/630] object-cover",
        "inline-lg": "max-w-[400px] mx-auto",
        "inline-md": "max-w-[250px] md:float-right md:ml-5 md:mb-3",
        "inline-sm": "max-w-[150px] mx-auto",
      }[size];
      const wrapperClass = size === "inline-md" ? "my-3" : size === "hero" ? "-mx-4 md:-mx-6 my-6" : "my-6";
      return (
        <figure className={wrapperClass}>
          <div className={`rounded-[var(--radius-card)] overflow-hidden border border-[var(--border)] bg-[var(--bg-secondary)] ${size !== "hero" ? sizeClass : ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={section.src || ""}
              alt={section.alt || ""}
              className={size === "hero" ? sizeClass : "w-full h-auto"}
              loading={size === "hero" ? "eager" : "lazy"}
            />
          </div>
        </figure>
      );
    }

    case "product-card":
      return <ProductCard section={section} />;

    case "trust-block": {
      const variant = section.trustVariant || "methodology";
      const defaults = {
        methodology: { Icon: Target, title: "Cómo armamos este análisis" },
        credentials: { Icon: Award, title: "Por qué confiar en esta guía" },
        pricing: { Icon: Tag, title: "Cómo elegimos estos precios" },
      } as const;
      const { Icon, title: defaultTitle } = defaults[variant];
      const title = section.title || defaultTitle;
      return (
        <aside
          className="not-prose my-10 rounded-[8px] border-l-[3px] p-5 md:p-6"
          style={{
            borderLeftColor: "var(--editorial-accent)",
            backgroundColor: "var(--bg-secondary)",
          }}
        >
          <div className="flex items-start gap-3 mb-2">
            <span
              className="shrink-0 mt-[2px]"
              style={{ color: "var(--editorial-accent)" }}
            >
              <Icon size={18} strokeWidth={2.2} />
            </span>
            <h4
              className="text-[17px] md:text-lg font-semibold text-[var(--text-primary)] leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {title}
            </h4>
          </div>
          <div className="pl-7 text-[15px] md:text-base leading-[1.65] text-[var(--text-secondary)]">
            {section.content ? parseInlineLinks(section.content) : null}
          </div>
        </aside>
      );
    }

    case "pull-quote":
      return (
        <blockquote
          className="not-prose my-10 md:my-12 py-6 md:py-8 px-2 md:px-4 border-t border-b relative"
          style={{ borderColor: "var(--border)" }}
        >
          <span
            aria-hidden="true"
            className="absolute -top-3 left-0 text-5xl leading-none"
            style={{ fontFamily: "var(--font-serif)", color: "var(--editorial-accent)" }}
          >
            “
          </span>
          <p
            className="text-[22px] md:text-[26px] leading-[1.35] italic text-[var(--text-primary)]"
            style={{ fontFamily: "var(--font-serif)", fontWeight: 500 }}
          >
            {section.content ? parseInlineLinks(section.content) : null}
          </p>
        </blockquote>
      );

    case "callout": {
      const variant = section.calloutVariant || "note";
      const palette: Record<string, { bg: string; border: string; label: string; title: string }> = {
        note: {
          bg: "rgba(165, 142, 107, 0.06)",
          border: "#8B7355",
          label: "NOTA",
          title: "#5A4A30",
        },
        warning: {
          bg: "rgba(180, 120, 60, 0.08)",
          border: "#B4783C",
          label: "ATENCIÓN",
          title: "#7A4E1A",
        },
        tip: {
          bg: "rgba(80, 130, 80, 0.07)",
          border: "#4F8F4F",
          label: "TIP",
          title: "#2E5F2E",
        },
        update: {
          bg: "rgba(120, 90, 140, 0.07)",
          border: "#7B5A8E",
          label: "ACTUALIZACIÓN",
          title: "#4E3465",
        },
      };
      const p = palette[variant];
      const headerText = section.calloutTitle || p.label;
      const dateText = section.date
        ? ` · ${new Date(section.date).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}`
        : "";
      return (
        <aside
          className="not-prose my-6 rounded-[6px] p-4 md:p-5 border-l-[3px]"
          style={{ backgroundColor: p.bg, borderLeftColor: p.border }}
        >
          <p
            className="text-[11px] font-semibold tracking-[0.14em] mb-2"
            style={{ color: p.title }}
          >
            {headerText}{dateText}
          </p>
          <div className="text-[15px] md:text-base leading-[1.65] text-[var(--text-primary)]">
            {section.content ? parseInlineLinks(section.content) : null}
          </div>
        </aside>
      );
    }

    case "image-grid": {
      const items = section.gridImages || [];
      if (items.length === 0) return null;
      const cols = items.length === 2 ? "grid-cols-2" : items.length === 3 ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2 md:grid-cols-4";
      return (
        <div className={`my-6 grid ${cols} gap-3`}>
          {items.map((it, i) => (
            <figure key={i} className="text-center">
              <div className="relative aspect-square rounded-[var(--radius-card)] overflow-hidden border border-[var(--border)] bg-[var(--bg-secondary)] flex items-center justify-center p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={it.src}
                  alt={it.alt}
                  className="max-w-full max-h-full object-contain"
                  loading="lazy"
                />
              </div>
              {it.caption && (
                <figcaption className="mt-2 text-xs text-[var(--text-muted)]">{it.caption}</figcaption>
              )}
            </figure>
          ))}
        </div>
      );
    }

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

export function GuideRenderer({ guide: rawGuide }: GuideRendererProps) {
  // Inject stable IDs on every H2/H3 so the TOC + in-page anchors work
  const guide = ensureSectionIds(rawGuide);
  const tocItems = getTocItems(guide);

  const introRest = guide.standfirst ? guide.intro : guide.intro.slice(1);

  // Skip first section if it's the hero (ArticleHeader already renders it)
  const firstIsHero =
    guide.sections[0]?.type === "image" && guide.sections[0]?.imageSize === "hero";
  const bodySections = firstIsHero ? guide.sections.slice(1) : guide.sections;

  return (
    <div className="editorial-article">
      <ReadingProgressBar />
      <div className="max-w-[1000px] mx-auto px-4 md:px-6 py-6 md:py-10 lg:grid lg:grid-cols-[200px_minmax(0,720px)] lg:gap-12">
        <TableOfContents items={tocItems} />
        <article className="min-w-0">
          <ArticleHeader guide={guide} />

          {/* Disclosure */}
          {guide.hasDisclosure && (
            <div
              className="mb-8 p-4 rounded-[var(--radius-card)] border-l-[3px] bg-[var(--bg-secondary)]"
              style={{ borderLeftColor: "var(--editorial-accent)" }}
            >
              <p className="text-xs md:text-sm text-[var(--text-muted)] leading-relaxed">
                Transparencia: este artículo tiene enlaces de afiliado a MercadoLibre. Si
                comprás algo a través de ellos, recibimos una comisión chica sin costo
                extra para vos. Eso no cambia nuestras opiniones.
              </p>
            </div>
          )}

          {/* Remaining intro paragraphs */}
          {introRest.map((p, i) => (
            <p
              key={i}
              className="text-[17px] md:text-[18px] leading-[1.7] text-[var(--text-secondary)] mb-6"
            >
              {p}
            </p>
          ))}

          {/* Quick Picks (Wirecutter-style shortcuts after intro) */}
          {guide.quickPicks && guide.quickPicks.length > 0 && (
            <QuickPicks picks={guide.quickPicks} />
          )}

          {/* Sections */}
          {bodySections.map((section, i) => (
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
      </div>
    </div>
  );
}
