import type { Guide, LabelColor } from "@/lib/types";
import { getProductById } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { injectLivePrices } from "@/lib/price-token";
import { Stars } from "./Stars";

interface QuickPicksProps {
  picks: NonNullable<Guide["quickPicks"]>;
}

function inferLabelColor(label: string): LabelColor {
  const l = label.toLowerCase();
  if (l.includes("elec") || l.includes("nuestra")) return "green";
  if (l.includes("econ") || l.includes("accesible") || l.includes("empezar") || l.includes("primera") || l.includes("principiante")) return "purple";
  if (l.includes("alternativa") || l.includes("fresco") || l.includes("vers")) return "blue";
  // "premium"/"exigente"/etc. ya NO van a ámbar: el amarillo es exclusivo del botón.
  if (l.includes("premium") || l.includes("exigente") || l.includes("elixir") || l.includes("lujo")) return "purple";
  return "slate";
}

// Pasteles desaturados / gris. NINGUNO usa amarillo ni ámbar (regla de oro CRO).
const LABEL_STYLES: Record<LabelColor, { bg: string; fg: string }> = {
  green: { bg: "#DCEAD5", fg: "#1E4F1E" },
  blue: { bg: "#D5E4F0", fg: "#123D6E" },
  amber: { bg: "#EEF1F5", fg: "#4A5568" },
  purple: { bg: "#E5D9EC", fg: "#5A2E75" },
  slate: { bg: "#EEF1F5", fg: "#4A5568" },
};

export function QuickPicks({ picks }: QuickPicksProps) {
  if (!picks || picks.length === 0) return null;

  const resolved = picks
    .map((p) => ({
      ...p,
      product: getProductById(p.productMlaId),
      color: p.labelColor || inferLabelColor(p.label),
    }))
    .filter((p) => p.product);

  if (resolved.length === 0) return null;

  return (
    <section
      aria-label="Nuestras elecciones"
      className="not-prose my-10 rounded-[8px] border p-5 md:p-6"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--bg-secondary)",
      }}
    >
      <p
        className="text-[11px] font-semibold tracking-[0.14em] mb-4"
        style={{ color: "var(--editorial-accent)" }}
      >
        NUESTRAS ELECCIONES
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {resolved.map((p, idx) => {
          if (!p.product) return null;
          const palette = LABEL_STYLES[p.color];
          const isWin = idx === 0;
          const priceText = p.product.price
            ? formatPrice(p.product.price, p.product.currency)
            : null;
          return (
            <div
              key={p.productMlaId}
              className="flex flex-col gap-2 rounded-[var(--radius-card)] p-3.5 bg-[var(--bg-primary)]"
              style={
                isWin
                  ? { border: "2px solid #111", boxShadow: "0 4px 16px rgba(0,0,0,.07)" }
                  : { border: "1px solid var(--border)" }
              }
            >
              {isWin && (
                <span className="text-[10.5px] font-extrabold tracking-[0.06em] uppercase text-[var(--text-primary)]">
                  ★ Elección general
                </span>
              )}
              <span
                className="self-start inline-flex items-center px-2 py-[2px] rounded-[8px] text-[11px] font-semibold"
                style={{ backgroundColor: palette.bg, color: palette.fg }}
              >
                {p.label}
              </span>
              <a
                href={p.product.affiliateUrl}
                target="_blank"
                rel="sponsored nofollow noopener"
                data-cta-location="quickpick-image"
                aria-label={`Ver ${p.product.title} en MercadoLibre`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.product.image}
                  alt={p.product.title}
                  className="w-full h-[92px] object-contain rounded-[9px] p-1"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                  loading="lazy"
                />
              </a>
              <h4
                className="text-[14px] font-semibold text-[var(--text-primary)] leading-tight line-clamp-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <a
                  href={p.product.affiliateUrl}
                  target="_blank"
                  rel="sponsored nofollow noopener"
                  data-cta-location="quickpick-title"
                  className="hover:underline underline-offset-2"
                >
                  {p.product.title}
                </a>
              </h4>
              {p.product.rating ? (
                <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
                  <Stars rating={p.product.rating} size={12} />
                  <span className="font-medium text-[var(--text-secondary)]">
                    {p.product.rating.toFixed(1)}
                  </span>
                  {p.product.reviewCount ? (
                    <span>· {p.product.reviewCount.toLocaleString("es-AR")}</span>
                  ) : null}
                </div>
              ) : null}
              <p className="flex-1 text-xs text-[var(--text-secondary)] leading-snug line-clamp-2">
                {injectLivePrices(p.tagline)}
              </p>
              <div className="mt-1">
                {isWin ? (
                  <a
                    href={p.product.affiliateUrl}
                    target="_blank"
                    rel="sponsored nofollow noopener"
                    data-cta-location="quickpick"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-[13.5px] font-extrabold rounded-[var(--radius-button)] transition-transform hover:-translate-y-px"
                    style={{
                      backgroundColor: "var(--cta-action)",
                      color: "var(--cta-action-text)",
                      border: "1px solid rgba(0,0,0,.18)",
                      boxShadow: "0 3px 10px rgba(180,150,0,.30)",
                    }}
                  >
                    {priceText ? `Comprar a ${priceText}` : "Comprar en MercadoLibre"}
                    <span aria-hidden="true" className="font-extrabold">→</span>
                  </a>
                ) : (
                  <a
                    href={p.product.affiliateUrl}
                    target="_blank"
                    rel="sponsored nofollow noopener"
                    data-cta-location="quickpick"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-bold rounded-[var(--radius-button)] bg-[var(--bg-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                    style={{ border: "1.5px solid var(--border)" }}
                  >
                    {priceText ? `Ver a ${priceText}` : "Ver en MercadoLibre"}
                    <span aria-hidden="true">→</span>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
