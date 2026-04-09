"use client";

import Link from "next/link";
import { X, Flame, Heart, Smartphone, Home, Dumbbell, ShoppingBag, ChefHat, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const navCategories = [
  { slug: "viral", label: "Viral ahora", icon: Flame, color: "#ef4444" },
  { slug: "belleza", label: "Belleza", icon: Heart },
  { slug: "tech", label: "Tech", icon: Smartphone },
  { slug: "hogar", label: "Hogar", icon: Home },
  { slug: "fitness", label: "Fitness", icon: Dumbbell },
  { slug: "moda", label: "Moda", icon: ShoppingBag },
  { slug: "cocina", label: "Cocina", icon: ChefHat },
  { slug: "gadgets", label: "Gadgets", icon: Zap },
];

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/40 transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-[var(--bg-primary)] shadow-xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <span className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Menú
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[var(--bg-secondary)] cursor-pointer"
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          <Link
            href="/"
            onClick={onClose}
            className="block px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]"
          >
            Inicio
          </Link>
          <Link
            href="/trending"
            onClick={onClose}
            className="block px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]"
          >
            Trending
          </Link>

          <div className="pt-3 pb-2">
            <span className="px-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
              Categorías
            </span>
          </div>

          {navCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={cat.slug === "viral" ? "/trending" : `/categoria/${cat.slug}`}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <Icon size={16} style={cat.color ? { color: cat.color } : undefined} />
                {cat.label}
              </Link>
            );
          })}

          <div className="pt-3">
            <Link
              href="/guias"
              onClick={onClose}
              className="block px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]"
            >
              Guías
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
