import { Star } from "lucide-react";

/**
 * Estrellas fraccionadas que reflejan el rating real de ML.
 * Relleno = rating / 5 * 100% (ver docs/guias.md §4).
 */
export function Stars({ rating, size = 15 }: { rating: number; size?: number }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));

  const row = (color: string) => (
    <span className="flex" style={{ color }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={size} className="fill-current shrink-0" strokeWidth={0} />
      ))}
    </span>
  );

  return (
    <span
      className="relative inline-flex shrink-0"
      role="img"
      aria-label={`${rating.toFixed(1)} de 5 estrellas`}
    >
      {row("var(--border)")}
      <span
        className="absolute left-0 top-0 overflow-hidden"
        style={{ width: `${pct}%` }}
        aria-hidden="true"
      >
        {row("var(--star)")}
      </span>
    </span>
  );
}
