import { TrendingUp } from "lucide-react";
import { getTrends } from "@/lib/mercadolibre";
import { TrendingPills } from "./TrendingPills";

interface MLTrend {
  keyword: string;
  url: string;
}

const fallbackTrends = [
  { keyword: "zapatillas hombre", url: "https://listado.mercadolibre.com.ar/zapatillas-hombre" },
  { keyword: "freidora de aire", url: "https://listado.mercadolibre.com.ar/freidora-de-aire" },
  { keyword: "auriculares inalambricos", url: "https://listado.mercadolibre.com.ar/auriculares-inalambricos" },
  { keyword: "notebook", url: "https://listado.mercadolibre.com.ar/notebook" },
  { keyword: "silla gamer", url: "https://listado.mercadolibre.com.ar/silla-gamer" },
  { keyword: "aire acondicionado", url: "https://listado.mercadolibre.com.ar/aire-acondicionado" },
  { keyword: "termo stanley", url: "https://listado.mercadolibre.com.ar/termo-stanley" },
  { keyword: "celulares", url: "https://listado.mercadolibre.com.ar/celulares" },
  { keyword: "cortinas blackout", url: "https://listado.mercadolibre.com.ar/cortinas-blackout" },
  { keyword: "pava electrica", url: "https://listado.mercadolibre.com.ar/pava-electrica" },
];

export async function TrendingBar() {
  let trends: MLTrend[] = [];

  try {
    const data = await getTrends();
    if (Array.isArray(data) && data.length > 0) {
      trends = data.slice(0, 20);
    }
  } catch {
    // API failed, use fallback
  }

  if (trends.length === 0) {
    trends = fallbackTrends;
  }

  return (
    <div className="flex items-center gap-3 overflow-hidden">
      <div className="flex items-center gap-1.5 text-[var(--text-muted)] shrink-0">
        <TrendingUp size={14} />
        <span className="text-xs font-medium whitespace-nowrap">Trending en ML</span>
      </div>

      <TrendingPills trends={trends} />
    </div>
  );
}
