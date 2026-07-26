import { formatPrice } from "@/lib/utils";
import type { PerfumeMover } from "@/lib/perfume-price-index";

const GOOD = "#16a34a"; // sube (contra del comprador)
const BAD = "#ef4444"; // baja (a favor del comprador)

/** Barras horizontales con las fichas que más subieron y más bajaron de precio.
 * HTML/CSS en vez de SVG: el truncado de títulos largos con `truncate` es
 * confiable de un lado a otro del ancho disponible, cosa que un `<text>` de
 * SVG en un viewBox porcentual no garantiza (el texto puede desbordar el
 * viewBox y cortarse a la mitad de una palabra). */
export function PriceMoversChart({ movers, title }: { movers: PerfumeMover[]; title: string }) {
  const maxAbs = Math.max(...movers.map((m) => Math.abs(m.pct)), 1);

  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-[var(--text-muted)] mb-2">{title}</div>
      <div className="space-y-2.5">
        {movers.map((m) => {
          const positive = m.pct >= 0;
          const color = positive ? GOOD : BAD;
          const widthPct = Math.max((Math.abs(m.pct) / maxAbs) * 100, 4);
          return (
            <div key={m.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
              <div className="min-w-0">
                <div className="text-xs text-[var(--text-primary)] truncate" title={m.title}>
                  {m.title}
                </div>
                <div className="mt-1 h-2 rounded-full bg-[var(--bg-secondary)] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${widthPct}%`, background: color, opacity: 0.85 }}
                  />
                </div>
              </div>
              <div className="text-sm font-bold tabular-nums shrink-0" style={{ color }}>
                {positive ? "+" : ""}
                {m.pct}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Fila de detalle debajo del gráfico: precio inicial → final y fechas reales. */
export function PriceMoversTable({ movers }: { movers: PerfumeMover[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
            <th className="pb-2 pr-3 font-medium">Perfume</th>
            <th className="pb-2 pr-3 font-medium text-right">Precio inicial</th>
            <th className="pb-2 pr-3 font-medium text-right">Precio hoy</th>
            <th className="pb-2 font-medium text-right">Variación</th>
          </tr>
        </thead>
        <tbody>
          {movers.map((m) => (
            <tr key={m.id} className="border-t border-[var(--border)]">
              <td className="py-2 pr-3 text-[var(--text-primary)]">{m.title}</td>
              <td className="py-2 pr-3 text-right text-[var(--text-secondary)] tabular-nums">
                {formatPrice(m.firstPrice)}
                <span className="text-[var(--text-muted)]"> ({m.firstDate.split("-").reverse().slice(0, 2).join("/")})</span>
              </td>
              <td className="py-2 pr-3 text-right text-[var(--text-secondary)] tabular-nums">
                {formatPrice(m.lastPrice)}
                <span className="text-[var(--text-muted)]"> ({m.lastDate.split("-").reverse().slice(0, 2).join("/")})</span>
              </td>
              <td
                className="py-2 text-right font-bold tabular-nums"
                style={{ color: m.pct >= 0 ? GOOD : BAD }}
              >
                {m.pct >= 0 ? "+" : ""}
                {m.pct}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
