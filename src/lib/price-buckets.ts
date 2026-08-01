import { formatPrice } from "@/lib/utils";

export interface PriceBucket {
  min: number;
  /** Infinity para el último bucket ("Más de $X"). */
  max: number;
  label: string;
}

/** Cortes candidatos en ARS. Solo se usan los que caen DENTRO del rango real
 * de precios recibido, así el filtro nunca queda mal calibrado (ej. todos los
 * cortes agrupados en un extremo si la categoría es toda cara o toda barata). */
const BREAKPOINTS = [30000, 60000, 100000, 200000, 400000, 800000];

/** Arma buckets de precio a partir de los precios reales de un listado. Un
 * corte sin ningún producto adentro no genera bucket vacío. Si todo el
 * listado cae en un solo bucket, devuelve [] (no tiene sentido mostrar un
 * filtro de una sola opción). */
export function buildPriceBuckets(prices: number[]): PriceBucket[] {
  if (prices.length === 0) return [];
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const innerEdges = BREAKPOINTS.filter((b) => b > min && b < max);
  const edges = [0, ...innerEdges, Infinity];

  const buckets: PriceBucket[] = [];
  for (let i = 0; i < edges.length - 1; i++) {
    const lo = edges[i];
    const hi = edges[i + 1];
    if (!prices.some((p) => p >= lo && p < hi)) continue;
    const label =
      hi === Infinity
        ? `Más de ${formatPrice(lo)}`
        : lo === 0
          ? `Hasta ${formatPrice(hi)}`
          : `${formatPrice(lo)} - ${formatPrice(hi)}`;
    buckets.push({ min: lo, max: hi, label });
  }
  return buckets.length > 1 ? buckets : [];
}

export function priceInBucket(price: number, bucket: PriceBucket): boolean {
  return price >= bucket.min && price < bucket.max;
}
