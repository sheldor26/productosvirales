import historyData from "@/data/price-history.json";
import { formatPrice } from "@/lib/utils";

/** Un punto de la serie histórica de precio. `d` = fecha ISO (YYYY-MM-DD), `p` = precio en ARS. */
export interface PricePoint {
  d: string;
  p: number;
}

const history = historyData as Record<string, PricePoint[]>;

/** Historial crudo de un producto (vacío si no hay datos). */
export function getPriceHistory(id: string): PricePoint[] {
  return history[id] ?? [];
}

export type PriceVerdictTone = "good" | "neutral" | "wait";

/** Datos listos para el gráfico + veredicto honesto de "¿buen momento?". */
export interface PriceChartData {
  points: PricePoint[];
  min: number;
  max: number;
  minDate: string;
  current: number;
  /** Cuánto está el precio actual por encima del mínimo histórico, en %. */
  pctFromMin: number;
  /** Promedio simple de los precios registrados (incluye el de hoy). */
  avg: number;
  /** Días reales entre el primer y el último punto — para no inventar un
   * período fijo ("90 días") cuando el historial real todavía es más corto. */
  rangeDays: number;
  verdict: { tone: PriceVerdictTone; text: string };
}

function shortDate(iso: string): string {
  // "2026-06-06" -> "6 jun". Parseamos a mano para evitar corrimientos de zona horaria.
  const [, m, d] = iso.split("-").map(Number);
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${d} ${meses[(m ?? 1) - 1]}`;
}

/**
 * Construye los datos del gráfico para un producto. Devuelve null si no hay
 * suficiente historial (necesitamos al menos 2 puntos para una curva honesta).
 * Siempre agrega (o corrige) un punto en la fecha de hoy con el precio actual,
 * aunque no haya cambiado desde el último chequeo registrado: sin esto, la
 * línea se cortaba en la fecha del último chequeo real (ej. el último
 * lunes/miércoles/viernes que corrió Bright Data) en vez de llegar hasta hoy,
 * dando la impresión de que el seguimiento estaba muerto.
 */
export function analyzePriceHistory(
  id: string,
  currentPrice?: number,
): PriceChartData | null {
  const raw = getPriceHistory(id);
  if (raw.length === 0) return null;

  const points: PricePoint[] = raw.map((pt) => ({ d: pt.d, p: pt.p }));
  const last = points[points.length - 1];
  const today = new Date().toISOString().slice(0, 10);
  const price = currentPrice && currentPrice > 0 ? currentPrice : last.p;
  if (last.d !== today) {
    points.push({ d: today, p: price });
  } else if (price !== last.p) {
    points[points.length - 1] = { d: today, p: price };
  }
  if (points.length < 2) return null;

  const prices = points.map((pt) => pt.p);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const minPoint = points.find((pt) => pt.p === min) ?? points[0];
  const current = points[points.length - 1].p;
  const pctFromMin = min > 0 ? Math.round(((current - min) / min) * 100) : 0;

  let verdict: PriceChartData["verdict"];
  if (current <= min) {
    verdict = {
      tone: "good",
      text: "Hoy está en su precio más bajo registrado. Buen momento para comprar.",
    };
  } else if (pctFromMin <= 5) {
    verdict = {
      tone: "good",
      text: `Está a solo ${pctFromMin}% de su mínimo histórico (${formatPrice(min)}). Buen precio.`,
    };
  } else if (current >= max) {
    verdict = {
      tone: "wait",
      text: "Hoy está en su precio más alto registrado. Si no es urgente, conviene esperar.",
    };
  } else {
    verdict = {
      tone: "neutral",
      text: `Hoy está ${pctFromMin}% arriba de su mínimo (${formatPrice(min)} el ${shortDate(minPoint.d)}). Ni el mejor ni el peor momento.`,
    };
  }

  const avg = Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length);
  const rangeDays = Math.max(
    1,
    Math.round(
      (new Date(points[points.length - 1].d).getTime() - new Date(points[0].d).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  return { points, min, max, minDate: minPoint.d, current, pctFromMin, avg, rangeDays, verdict };
}
