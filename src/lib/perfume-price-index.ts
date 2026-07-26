import "server-only";
import { curatedProducts } from "@/data/curated-products";
import { isVisible } from "@/lib/products";
import { getPriceHistory } from "@/lib/price-history";
import type { Product } from "@/lib/types";

/** Identifica fichas de perfume árabe: tienen `perfumeType` (dato estructurado
 * de la ficha) o el título menciona perfume/fragancia explícitamente. El
 * campo estructurado solo está completo en 24 de las 60 fichas de "belleza",
 * así que confiar solo en él deja afuera perfumes reales. */
function isArabianPerfume(p: Product): boolean {
  if (p.categorySlug !== "belleza") return false;
  if (p.perfumeType) return true;
  return /perfum|edp|edt|eau de|fragan/i.test(p.title);
}

export interface PerfumeMover {
  id: string;
  title: string;
  brand?: string;
  firstDate: string;
  firstPrice: number;
  lastDate: string;
  lastPrice: number;
  pct: number;
  points: number;
}

export interface PerfumePriceIndex {
  /** Fichas con al menos 4 chequeos de precio reales (curva confiable). */
  movers: PerfumeMover[];
  totalTracked: number;
  usable: number;
  avgPct: number;
  risenCount: number;
  fallenCount: number;
  rangeStart: string;
  rangeEnd: string;
  topGainer: PerfumeMover;
  topLoser: PerfumeMover;
}

const MIN_POINTS = 4;

/** Calcula el índice de precios de perfumes árabes a partir del historial real
 * de Bright Data. Server-only: recorre el catálogo completo y no debe llegar
 * al bundle de cliente. */
export function getPerfumePriceIndex(): PerfumePriceIndex | null {
  const perfumes = curatedProducts.filter((p) => isVisible(p) && isArabianPerfume(p));

  const movers: PerfumeMover[] = [];
  for (const p of perfumes) {
    const raw = getPriceHistory(p.id);
    if (raw.length < MIN_POINTS) continue;
    const sorted = [...raw].sort((a, b) => a.d.localeCompare(b.d));
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    if (first.p <= 0) continue;
    const pct = Math.round(((last.p - first.p) / first.p) * 1000) / 10;
    movers.push({
      id: p.id,
      title: p.canonicalName ?? p.title,
      brand: p.brand,
      firstDate: first.d,
      firstPrice: first.p,
      lastDate: last.d,
      lastPrice: last.p,
      pct,
      points: sorted.length,
    });
  }

  if (movers.length === 0) return null;

  movers.sort((a, b) => b.pct - a.pct);
  const avgPct = Math.round((movers.reduce((sum, m) => sum + m.pct, 0) / movers.length) * 10) / 10;
  const rangeStart = movers.reduce((min, m) => (m.firstDate < min ? m.firstDate : min), movers[0].firstDate);
  const rangeEnd = movers.reduce((max, m) => (m.lastDate > max ? m.lastDate : max), movers[0].lastDate);

  return {
    movers,
    totalTracked: perfumes.length,
    usable: movers.length,
    avgPct,
    risenCount: movers.filter((m) => m.pct > 0).length,
    fallenCount: movers.filter((m) => m.pct < 0).length,
    rangeStart,
    rangeEnd,
    topGainer: movers[0],
    topLoser: movers[movers.length - 1],
  };
}
