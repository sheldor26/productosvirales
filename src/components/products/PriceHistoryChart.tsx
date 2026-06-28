import { formatPrice } from "@/lib/utils";
import type { PriceChartData, PriceVerdictTone } from "@/lib/price-history";

const TONE: Record<PriceVerdictTone, { line: string; bgTint: string }> = {
  good: { line: "#16a34a", bgTint: "rgba(22,163,74,0.10)" },
  neutral: { line: "#3483fa", bgTint: "rgba(52,131,250,0.10)" },
  wait: { line: "#ef4444", bgTint: "rgba(239,68,68,0.10)" },
};

// Geometría del SVG (coordenadas internas; el SVG escala al ancho del contenedor).
const W = 720;
const H = 260;
const PAD = { l: 52, r: 16, t: 16, b: 30 };
const PLOT_W = W - PAD.l - PAD.r;
const PLOT_H = H - PAD.t - PAD.b;

function toMs(iso: string): number {
  return Date.parse(`${iso}T00:00:00Z`);
}

function compact(v: number): string {
  return `$${Math.round(v / 1000)}k`;
}

export function PriceHistoryChart({ data }: { data: PriceChartData }) {
  const { points, min, max, current, verdict } = data;
  const tone = TONE[verdict.tone];

  // Escala Y con un margen del 15% arriba y abajo para que la línea no toque el borde.
  const range = max - min || max * 0.1 || 1;
  const pad = range * 0.15;
  const yLo = Math.max(0, min - pad);
  const yHi = max + pad;

  const t0 = toMs(points[0].d);
  const tN = toMs(points[points.length - 1].d);
  const tSpan = tN - t0 || 1;

  const x = (iso: string) => PAD.l + ((toMs(iso) - t0) / tSpan) * PLOT_W;
  const y = (p: number) => PAD.t + (1 - (p - yLo) / (yHi - yLo)) * PLOT_H;

  // Línea escalonada: el precio se sostiene hasta el próximo cambio (step-after).
  let line = `M ${x(points[0].d).toFixed(1)} ${y(points[0].p).toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    line += ` L ${x(points[i].d).toFixed(1)} ${y(points[i - 1].p).toFixed(1)}`;
    line += ` L ${x(points[i].d).toFixed(1)} ${y(points[i].p).toFixed(1)}`;
  }
  const baseY = PAD.t + PLOT_H;
  const area = `${line} L ${x(points[points.length - 1].d).toFixed(1)} ${baseY} L ${x(points[0].d).toFixed(1)} ${baseY} Z`;

  // Grilla horizontal + etiquetas tipo "$210k".
  const TICKS = 4;
  const ticks = Array.from({ length: TICKS + 1 }, (_, i) => {
    const val = yHi - (i / TICKS) * (yHi - yLo);
    return { val, yPos: PAD.t + (i / TICKS) * PLOT_H };
  });

  const gradId = `ph-grad-${verdict.tone}`;
  const cx = x(points[points.length - 1].d);
  const cy = y(current);

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`Evolución del precio. Mínimo ${formatPrice(min)}, máximo ${formatPrice(max)}, actual ${formatPrice(current)}.`}
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={tone.line} stopOpacity="0.22" />
            <stop offset="100%" stopColor={tone.line} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Grilla + etiquetas del eje Y */}
        {ticks.map((t, i) => (
          <g key={i}>
            <line
              x1={PAD.l}
              y1={t.yPos}
              x2={W - PAD.r}
              y2={t.yPos}
              stroke="var(--border)"
              strokeWidth="1"
              strokeDasharray={i === 0 || i === TICKS ? "0" : "3 4"}
              opacity="0.6"
            />
            <text
              x={PAD.l - 8}
              y={t.yPos + 4}
              textAnchor="end"
              fontSize="12"
              fill="var(--text-muted)"
            >
              {compact(t.val)}
            </text>
          </g>
        ))}

        {/* Área + línea */}
        <path d={area} fill={`url(#${gradId})`} />
        <path d={line} fill="none" stroke={tone.line} strokeWidth="2.5" strokeLinejoin="round" />

        {/* Punto del precio actual */}
        <circle cx={cx} cy={cy} r="4.5" fill={tone.line} stroke="var(--bg-primary)" strokeWidth="2" />

        {/* Etiquetas del eje X: primera y última fecha */}
        <text x={PAD.l} y={H - 8} textAnchor="start" fontSize="12" fill="var(--text-muted)">
          {points[0].d.split("-").reverse().slice(0, 2).join("/")}
        </text>
        <text x={W - PAD.r} y={H - 8} textAnchor="end" fontSize="12" fill="var(--text-muted)">
          {points[points.length - 1].d.split("-").reverse().slice(0, 2).join("/")}
        </text>
      </svg>

      {/* Veredicto honesto + mínimo/máximo */}
      <div
        className="mt-4 rounded-[var(--radius-badge)] p-3.5 text-sm font-medium leading-relaxed"
        style={{ background: tone.bgTint, color: "var(--text-primary)" }}
      >
        {verdict.text}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">Mínimo</div>
          <div className="text-sm font-bold text-[#16a34a]">{formatPrice(min)}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">Hoy</div>
          <div className="text-sm font-bold text-[var(--text-primary)]">{formatPrice(current)}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">Máximo</div>
          <div className="text-sm font-bold text-[var(--text-secondary)]">{formatPrice(max)}</div>
        </div>
      </div>
    </div>
  );
}
