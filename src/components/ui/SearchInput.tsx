"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useState, useRef, useEffect, useId } from "react";
import { cn, formatPrice } from "@/lib/utils";
import { productHref } from "@/lib/product-url";

interface SearchInputProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  expandable?: boolean;
}

interface Suggestion {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
}

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 250;

export function SearchInput({
  placeholder = "Buscar productos...",
  onSearch,
  className,
  expandable = false,
}: SearchInputProps) {
  const [expanded, setExpanded] = useState(!expandable);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const suggestListId = useId();

  // Autocomplete en vivo: sugerencias del catálogo local mientras se tipea,
  // sin reemplazar el submit tradicional (Enter sigue yendo a /?q=... si no
  // se eligió ninguna sugerencia — fallback natural si falla el fetch).
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = query.trim();
    // Query corta: no hay nada que buscar. Se resuelve en el onChange (ver
    // más abajo), no acá, para no llamar setState de forma síncrona en el
    // cuerpo del efecto.
    if (trimmed.length < MIN_QUERY_LENGTH) return;
    debounceRef.current = setTimeout(() => {
      fetch(`/api/search/suggest?q=${encodeURIComponent(trimmed)}`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data: Suggestion[]) => {
          setSuggestions(data);
          setSuggestOpen(data.length > 0);
          setHighlighted(-1);
        })
        .catch(() => {
          // Sin sugerencias por falla de red: el submit normal sigue andando.
          setSuggestions([]);
          setSuggestOpen(false);
        });
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const selectSuggestion = (s: Suggestion) => {
    setSuggestOpen(false);
    setQuery("");
    router.push(productHref(s));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestOpen && highlighted >= 0 && suggestions[highlighted]) {
      selectSuggestion(suggestions[highlighted]);
      return;
    }
    if (query.trim() && onSearch) {
      setSuggestOpen(false);
      onSearch(query.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!suggestOpen || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Escape") {
      setSuggestOpen(false);
    }
  };

  if (expandable && !expanded) {
    return (
      <button
        onClick={() => {
          setExpanded(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        className="p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-secondary)] cursor-pointer"
        aria-label="Buscar"
      >
        <Search size={20} />
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setSuggestOpen(false);
      }}
      className={cn("relative", className)}
    >
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
      />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);
          if (value.trim().length < MIN_QUERY_LENGTH) {
            setSuggestions([]);
            setSuggestOpen(false);
          }
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (suggestions.length > 0) setSuggestOpen(true);
        }}
        placeholder={placeholder}
        role="combobox"
        aria-expanded={suggestOpen}
        aria-autocomplete="list"
        aria-controls={suggestListId}
        autoComplete="off"
        className="w-full pl-9 pr-9 py-2 text-sm bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-[var(--radius-pill)] border border-[var(--border)] outline-none focus:border-[var(--text-muted)] transition-colors placeholder:text-[var(--text-muted)]"
      />
      {(query || expandable) && (
        <button
          type="button"
          aria-label="Limpiar búsqueda"
          onClick={() => {
            setQuery("");
            setSuggestOpen(false);
            if (expandable) setExpanded(false);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] cursor-pointer"
        >
          <X size={14} />
        </button>
      )}

      {suggestOpen && suggestions.length > 0 && (
        <ul
          id={suggestListId}
          role="listbox"
          className="absolute z-20 top-full left-0 right-0 mt-1.5 py-1.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-[var(--radius-card)] shadow-lg overflow-hidden"
        >
          {suggestions.map((s, i) => (
            <li key={s.id} role="option" aria-selected={i === highlighted}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectSuggestion(s)}
                onMouseEnter={() => setHighlighted(i)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 text-left cursor-pointer",
                  i === highlighted ? "bg-[var(--bg-secondary)]" : "hover:bg-[var(--bg-secondary)]"
                )}
              >
                <Image
                  src={s.image}
                  alt=""
                  width={32}
                  height={32}
                  className="rounded-md object-contain shrink-0 bg-[var(--bg-secondary)]"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-[var(--text-primary)] truncate">{s.title}</span>
                  <span className="block text-xs text-[var(--text-muted)]">{s.category}</span>
                </span>
                <span className="text-sm font-semibold text-[var(--text-primary)] shrink-0">
                  {formatPrice(s.price)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
