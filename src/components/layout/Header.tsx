"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const handleSearch = (query: string) => {
    setSearchOpen(false);
    router.push(`/?q=${encodeURIComponent(query)}`);
  };

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
            <Link href="/" className="flex flex-col items-start shrink-0 leading-none gap-0">
              <div className="flex items-center gap-0.5">
                <span
                  className="text-xl font-bold tracking-tight"
                  style={{ fontFamily: "var(--font-display)", color: "#b8a9d4" }}
                >
                  productos
                </span>
                <span
                  className="text-xl font-bold tracking-tight px-2 py-0.5 rounded-lg text-white relative"
                  style={{ backgroundColor: "#f4b5a4", fontFamily: "var(--font-display)" }}
                >
                  virales
                  {/* Trend arrow icon */}
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="absolute -top-0.5 -right-1"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 9L6 5L8 7L11 3"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 3H11V6"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
              <span
                className="text-[10px] tracking-wide hidden sm:block mt-0.5"
                style={{ fontFamily: "var(--font-script)", color: "#f4b5a4" }}
              >
                productosvirales.com.ar
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
                    onSearch={handleSearch}
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
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search size={20} />
              </button>

              {/* Dark mode toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={cn(
                  "p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-secondary)] cursor-pointer",
                  !mounted && "opacity-0"
                )}
                aria-label="Cambiar tema"
                aria-hidden={!mounted}
              >
                {mounted && theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>

          {/* Mobile search bar */}
          {searchOpen && (
            <div className="md:hidden px-4 pb-3">
              <SearchInput
                onSearch={handleSearch}
              />
            </div>
          )}
        </div>
      </header>

      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  );
}
