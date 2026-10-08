"use client";

import { Flame, LayoutGrid, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_NAV } from "@/data/category-nav";

interface CategoryTab {
  slug: string;
  label: string;
  icon: LucideIcon;
  isSpecial?: boolean;
  color?: string;
}

// CATEGORY_NAV es la misma fuente que ya usan Header y Footer: antes este
// array vivía duplicado acá con solo 6 de los 11 hubs reales (Música,
// Climatización, Salud y Bienestar, Seguridad y Coleccionables quedaban sin
// filtro en la home, solo accesibles abriendo el menú), y cualquier hub
// nuevo había que acordarse de sumarlo en dos lugares.
const tabs: CategoryTab[] = [
  { slug: "todos", label: "Todos", icon: LayoutGrid },
  { slug: "viral", label: "Viral", icon: Flame, isSpecial: true, color: "#ef4444" },
  ...CATEGORY_NAV.map((c) => ({ slug: c.slug, label: c.label, icon: c.icon })),
];

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
}

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeCategory === tab.slug;
        return (
          <button
            key={tab.slug}
            onClick={() => onCategoryChange(tab.slug)}
            className={cn(
              "snap-start flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium whitespace-nowrap rounded-[var(--radius-pill)] transition-all duration-200 shrink-0 cursor-pointer",
              isActive
                ? tab.isSpecial
                  ? "bg-[#ef4444] text-white"
                  : "bg-[var(--cta-bg)] text-[var(--cta-text)]"
                : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
            )}
          >
            <Icon size={14} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
