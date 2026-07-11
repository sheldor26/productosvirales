import { TrendingUp } from "lucide-react";
import { getTrends } from "@/lib/mercadolibre";
import { TrendingPills } from "./TrendingPills";

interface MLTrend {
  keyword: string;
  url: string;
}

// Las pills buscan en NUESTRO catálogo (retención + no fuga de link juice a ML).
// La home ya filtra por ?q= (ver src/app/page.tsx). Antes apuntaban directo a
// listado.mercadolibre.com.ar, sacando al usuario y a Google del sitio.
const toInternal = (keyword: string) => `/?q=${encodeURIComponent(keyword)}`;

// Términos curados que mapean a productos reales de nuestros nichos (para que la
// búsqueda interna no caiga vacía como pasaría con "notebook" o "celulares").
const fallbackTrends: MLTrend[] = [
  "freidora de aire",
  "robot aspiradora",
  "pava electrica",
  "cafetera italiana",
  "perfume arabe",
  "masajeador facial",
  "auriculares bluetooth",
  "parlante jbl",
  "silla gamer",
  "estufa electrica",
].map((keyword) => ({ keyword, url: toInternal(keyword) }));

export async function TrendingBar() {
  let trends: MLTrend[] = [];

  try {
    const data = await getTrends();
    if (Array.isArray(data) && data.length > 0) {
      // Usamos las keywords que trae ML pero apuntando al buscador interno.
      trends = data.slice(0, 20).map((t: MLTrend) => ({
        keyword: t.keyword,
        url: toInternal(t.keyword),
      }));
    }
  } catch {
    // API failed, use fallback
  }

  if (trends.length === 0) {
    trends = fallbackTrends;
  }

  return (
    <div className="flex items-center gap-3 overflow-hidden">
      <div className="flex items-center gap-1.5 text-[var(--text-secondary)] shrink-0">
        <TrendingUp size={14} className="trend-bounce text-[var(--color-trending-up)]" />
        <span className="text-xs font-semibold whitespace-nowrap">Trending ahora</span>
      </div>

      <TrendingPills trends={trends} />
    </div>
  );
}
