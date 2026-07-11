"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, Sun, Moon, Search, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { SearchInput } from "@/components/ui/SearchInput";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { CATEGORY_NAV } from "@/data/category-nav";
import { MobileNav } from "./MobileNav";

const NAV_LINK_CLS =
  "px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-[var(--bg-secondary)]";

const WHATSAPP_CHANNEL_URL = "https://whatsapp.com/channel/0029Vb8OJXB6mYPIHG0M4a1t";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
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

  // Cerrar el dropdown de categorías con Escape.
  useEffect(() => {
    if (!catOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCatOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [catOpen]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-200 border-b",
          scrolled
            ? "bg-[var(--bg-primary)]/80 backdrop-blur-xl border-[var(--border)]"
            : "bg-[var(--bg-primary)] border-transparent"
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
              <Link href="/" className={NAV_LINK_CLS}>
                Inicio
              </Link>
              <Link href="/trending" className={NAV_LINK_CLS}>
                Trending
              </Link>

              {/* Categorías: dropdown con todos los hubs (enlazado interno real,
                  crawleable desde toda página). Reemplaza el link hardcodeado. */}
              <div
                className="relative"
                onMouseEnter={() => setCatOpen(true)}
                onMouseLeave={() => setCatOpen(false)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) setCatOpen(false);
                }}
              >
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={catOpen}
                  onClick={() => setCatOpen((v) => !v)}
                  className={cn(NAV_LINK_CLS, "inline-flex items-center gap-1 cursor-pointer")}
                >
                  Categorías
                  <ChevronDown
                    size={14}
                    className={cn("transition-transform duration-200", catOpen && "rotate-180")}
                  />
                </button>
                <div
                  inert={!catOpen}
                  className={cn(
                    "absolute left-0 top-full pt-2 w-[360px] transition-all duration-200 origin-top",
                    catOpen
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 -translate-y-1 pointer-events-none"
                  )}
                >
                  <div className="grid grid-cols-2 gap-0.5 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--bg-primary)] p-2 shadow-[0_12px_28px_-8px_rgba(0,0,0,0.18)]">
                    {CATEGORY_NAV.map((c) => {
                      const Icon = c.icon;
                      return (
                        <Link
                          key={c.slug}
                          href={`/categoria/${c.slug}`}
                          onClick={() => setCatOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                          <Icon size={15} className="shrink-0 text-[var(--text-muted)]" />
                          {c.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              <Link href="/guias" className={NAV_LINK_CLS}>
                Guías
              </Link>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {/* Canal de WhatsApp (solo desktop; en mobile vive en el menú) */}
              <a
                href={WHATSAPP_CHANNEL_URL}
                target="_blank"
                rel="noopener"
                data-channel-location="header"
                className="hidden md:inline-flex items-center gap-1.5 mr-1 px-3.5 py-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--cta-bg)", color: "var(--cta-text)" }}
              >
                <WhatsAppIcon size={15} />
                Sumate a WhatsApp
              </a>

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
