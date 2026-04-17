import { ExternalLink } from "lucide-react";
import type { Guide, LabelColor } from "@/lib/types";
import { getProductById } from "@/lib/products";

interface QuickPicksProps {
  picks: NonNullable<Guide["quickPicks"]>;
}

function inferLabelColor(label: string): LabelColor {
  const l = label.toLowerCase();
  if (l.includes("elec") || l.includes("nuestra")) return "green";
  if (l.includes("econ") || l.includes("accesible") || l.includes("empezar") || l.includes("primera") || l.includes("principiante")) return "purple";
  if (l.includes("alternativa") || l.includes("fresco") || l.includes("vers")) return "blue";
  if (l.includes("premium") || l.includes("exigente") || l.includes("elixir") || l.includes("lujo")) return "amber";
  return "amber";
}

const LABEL_STYLES: Record<LabelColor, { bg: string; fg: string }> = {
  green: { bg: "#DCEAD5", fg: "#1E4F1E" },
  blue: { bg: "#D5E4F0", fg: "#123D6E" },
  amber: { bg: "#F0E4CE", fg: "#7A5620" },
  purple: { bg: "#E5D9EC", fg: "#5A2E75" },
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
        {resolved.map((p) => {
          if (!p.product) return null;
          const palette = LABEL_STYLES[p.color];
          return (
            <div
              key={p.productMlaId}
              className="flex items-start gap-3 rounded-[6px] p-3 bg-[var(--bg-primary)] border"
              style={{ borderColor: "var(--border)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.product.image}
                alt={p.product.title}
                className="shrink-0 w-[80px] h-[80px] object-contain rounded-[4px] p-1"
                style={{ backgroundColor: "var(--bg-secondary)" }}
                loading="lazy"
              />
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <span
                  className="self-start inline-flex items-center px-2 py-[2px] rounded-full text-[10px] font-semibold tracking-wider uppercase"
                  style={{ backgroundColor: palette.bg, color: palette.fg }}
                >
                  {p.label}
                </span>
                <h4
                  className="text-[14px] font-semibold text-[var(--text-primary)] leading-tight line-clamp-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {p.product.title}
                </h4>
                <p className="text-xs text-[var(--text-secondary)] leading-snug line-clamp-2">
                  {p.tagline}
                </p>
                <a
                  href={p.product.affiliateUrl}
                  target="_blank"
                  rel="sponsored nofollow noopener"
                  className="self-start inline-flex items-center gap-1 mt-1 text-xs font-semibold"
                  style={{ color: "var(--editorial-accent)" }}
                >
                  Ver en MercadoLibre
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
