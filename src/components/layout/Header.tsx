"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { SearchInput } from "@/components/ui/SearchInput";
import { MobileNav } from "./MobileNav";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-200",
          scrolled
            ? "bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border)]"
            : "bg-[var(--bg-primary)]"
        )}
      >
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Mobile: hamburger */}
            <button
              className="md:hidden p-2 -ml-2 text-[var(--text-primary)] cursor-pointer"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Menú"
            >
              <Menu size={22} />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-0.5 shrink-0">
              <span className="text-lg font-bold tracking-tight text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                pick
              </span>
              <span className="text-lg font-bold tracking-tight bg-[var(--cta-bg)] text-[var(--cta-text)] px-1.5 py-0.5 rounded-md">
                viral
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { href: "/", label: "Inicio" },
                { href: "/trending", label: "Trending" },
                { href: "/categoria/belleza", label: "Categorías" },
                { href: "/guias", label: "Guías" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-[var(--bg-secondary)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {/* Desktop search */}
              <div className="hidden md:block">
                {searchOpen ? (
                  <SearchInput
                    className="w-56"
                    expandable={false}
                    onSearch={() => setSearchOpen(false)}
                  />
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-secondary)] cursor-pointer"
                    aria-label="Buscar"
                  >
                    <Search size={18} />
                  </button>
                )}
              </div>

              {/* Mobile search */}
              <button
                className="md:hidden p-2 text-[var(--text-secondary)] cursor-pointer"
                aria-label="Buscar"
              >
                <Search size={20} />
              </button>

              {/* Dark mode toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-secondary)] cursor-pointer"
                  aria-label="Cambiar tema"
                >
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  );
}
