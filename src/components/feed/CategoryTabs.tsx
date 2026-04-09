"use client";

import { useState } from "react";
import {
  Flame,
  Heart,
  Smartphone,
  Home,
  Dumbbell,
  ShoppingBag,
  ChefHat,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryTab {
  slug: string;
  label: string;
  icon: LucideIcon;
  isSpecial?: boolean;
  color?: string;
}

const tabs: CategoryTab[] = [
  { slug: "viral", label: "Viral ahora", icon: Flame, isSpecial: true, color: "#ef4444" },
  { slug: "belleza", label: "Belleza", icon: Heart },
  { slug: "tech", label: "Tech", icon: Smartphone },
  { slug: "hogar", label: "Hogar", icon: Home },
  { slug: "fitness", label: "Fitness", icon: Dumbbell },
  { slug: "moda", label: "Moda", icon: ShoppingBag },
  { slug: "cocina", label: "Cocina", icon: ChefHat },
  { slug: "gadgets", label: "Gadgets", icon: Zap },
];

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
}

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeCategory === tab.slug;
        return (
          <button
            key={tab.slug}
            onClick={() => onCategoryChange(tab.slug)}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium whitespace-nowrap rounded-[var(--radius-pill)] transition-all duration-200 shrink-0 cursor-pointer",
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
