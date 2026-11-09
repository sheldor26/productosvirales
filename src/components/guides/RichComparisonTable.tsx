import Image from "next/image";
import Link from "next/link";
import type { GuideSection } from "@/lib/types";
import { getProductById } from "@/lib/products";
import { productHref } from "@/lib/product-url";
import { parseInlineLinks } from "@/lib/parse-inline-links";
import { AffiliateLink } from "@/components/affiliate/AffiliateLink";

/**
 * Variante "rica" de la tabla comparativa, con foto de producto en la primera
 * columna y la columna de precio como botón de compra. Opt-in: solo se usa
 * cuando `section.rowProductIds` está presente (ver `GuideSection` en
 * `src/lib/types.ts`). La tabla de texto plano de siempre (`case "table"` en
 * `GuideRenderer.tsx`) sigue siendo el default para el resto de las guías.
 */

// Primera celda: extrae {anchor, href} de un link markdown "[Nombre](url)",
// igual criterio que la tabla de texto plano (TableCellLink en GuideRenderer).
function parseMarkdownLink(cell: string): { anchor: string; href: string } | null {
  const m = cell.trim().match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  return m ? { anchor: m[1], href: m[2] } : null;
}

export function RichComparisonTable({ section }: { section: GuideSection }) {
  const headers = section.headers ?? [];
  const rows = section.rows ?? [];
  const rowProductIds = section.rowProductIds ?? [];
  const priceColIndex = headers.findIndex((h) => /precio/i.test(h));

  return (
    <div className="guide-comparison-table-rich my-8 overflow-x-auto rounded-[var(--radius-card)] border border-[var(--border)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[var(--bg-secondary)]">
            {headers.map((h, j) => (
              <th
                key={h}
                className="px-5 py-4 text-left font-semibold text-[var(--text-primary)] border-b border-[var(--border)] whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const product = rowProductIds[i] ? getProductById(rowProductIds[i] as string) : undefined;
            return (
              <tr key={i} className={i % 2 === 1 ? "bg-[var(--bg-secondary)]/40" : ""}>
                {row.map((cell, j) => {
                  if (j === 0) {
                    const link = parseMarkdownLink(cell);
                    const name = link?.anchor ?? cell;
                    const href = link?.href ?? (product ? productHref(product) : undefined);
                    const thumb = product?.image ? (
                      <div className="relative shrink-0 w-16 h-16 rounded-[var(--radius-card)] overflow-hidden border border-[var(--border)] bg-[var(--bg-secondary)]">
                        <Image
                          src={product.image}
                          alt={name}
                          fill
                          sizes="64px"
                          className="object-contain p-1"
                        />
                      </div>
                    ) : null;
                    const nameEl = (
                      <span className="font-semibold text-[var(--text-primary)] leading-snug">
                        {name}
                      </span>
                    );
                    return (
                      <td
                        key={j}
                        className="px-5 py-4 border-t border-[var(--border)] align-middle"
                      >
                        <div className="flex items-center gap-3 min-w-[200px]">
                          {thumb}
                          {href ? (
                            href.startsWith("/") ? (
                              <Link href={href} prefetch={false} className="hover:underline underline-offset-2">
                                {nameEl}
                              </Link>
                            ) : (
                              <a
                                href={href}
                                target="_blank"
                                rel="nofollow sponsored noopener"
                                data-cta-location="tabla-rica-modelo"
                                className="hover:underline underline-offset-2"
                              >
                                {nameEl}
                              </a>
                            )
                          ) : (
                            nameEl
                          )}
                        </div>
                      </td>
                    );
                  }

                  if (j === priceColIndex) {
                    return (
                      <td key={j} className="px-5 py-4 border-t border-[var(--border)] align-middle">
                        {product?.affiliateUrl ? (
                          <AffiliateLink
                            href={product.affiliateUrl}
                            ctaLocation="tabla-rica-precio"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold text-white whitespace-nowrap"
                            style={{ backgroundColor: "var(--editorial-accent)" }}
                          >
                            {parseInlineLinks(cell)}
                          </AffiliateLink>
                        ) : (
                          <span className="font-semibold text-[var(--text-primary)]">
                            {parseInlineLinks(cell)}
                          </span>
                        )}
                      </td>
                    );
                  }

                  return (
                    <td
                      key={j}
                      className="px-5 py-4 text-[var(--text-secondary)] border-t border-[var(--border)] align-middle"
                    >
                      {parseInlineLinks(cell)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
