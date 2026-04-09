"use client";

import { TrendingUp } from "lucide-react";
import type { TrendingKeyword } from "@/lib/types";

const mockTrending: TrendingKeyword[] = [
  { keyword: "air fryer", url: "#", growth: "+340%" },
  { keyword: "sérum vitamina c", url: "#", growth: "+220%" },
  { keyword: "auriculares bluetooth", url: "#", growth: "+180%" },
  { keyword: "zapatillas plataforma", url: "#", growth: "+150%" },
  { keyword: "ring light", url: "#", growth: "+120%" },
  { keyword: "organizador maquillaje", url: "#", growth: "+95%" },
  { keyword: "bandas elásticas", url: "#", growth: "+88%" },
  { keyword: "proyector portátil", url: "#", growth: "+75%" },
  { keyword: "cargador inalámbrico", url: "#", growth: "+60%" },
  { keyword: "crema coreana", url: "#", growth: "+55%" },
];

export function TrendingBar() {
  return (
    <div className="flex items-center gap-3 overflow-hidden">
      <div className="flex items-center gap-1.5 text-[var(--text-muted)] shrink-0">
        <TrendingUp size={14} />
        <span className="text-xs font-medium whitespace-nowrap">Trending en ML</span>
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar">
        {mockTrending.map((item) => (
          <a
            key={item.keyword}
            href={item.url}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-[var(--radius-pill)] whitespace-nowrap hover:bg-[var(--border)] transition-colors shrink-0"
          >
            {item.keyword}
            {item.growth && (
              <span className="text-[var(--color-trending-up)] text-[10px] font-medium">
                {item.growth}
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
