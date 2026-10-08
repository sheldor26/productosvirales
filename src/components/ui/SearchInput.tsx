"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, X, Clock, SearchX } from "lucide-react";
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
const RECENT_KEY = "pv_recent_searches";
const MAX_RECENT = 5;

function readRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeRecent(terms: string[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(terms));
  } catch {
    // localStorage puede fallar (modo privado); no es crítico, solo no persiste.
  }
}

/** Envuelve en <mark> la porción de `text` que matchea `query` (sin case),
 * para que la sugerencia resaltada sea evidente de un vistazo. Si `query`
 * no aparece tal cual (la búsqueda es fuzzy, puede matchear sin substring
 * exacto), devuelve el texto sin tocar en vez de forzar un resaltado falso. */
function highlightMatch(text: string, query: string) {
  const trimmed = query.trim();
  if (!trimmed) return text;
  const idx = text.toLowerCase().indexOf(trimmed.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-transparent text-[var(--text-primary)] font-semibold">
        {text.slice(idx, idx + trimmed.length)}
      </mark>
      {text.slice(idx + trimmed.length)}
    </>
  );
}

export function SearchInput({
  placeholder = "Buscar productos...",
  onSearch,
  className,
  expandable = false,
}: SearchInputProps) {
  const [expanded, setExpanded] = useState(!expandable);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const collapsedButtonRef = useRef<HTMLButtonElement>(null);
  // Si el botón "Limpiar" colapsa el buscador (expandable=true), el foco que
  // tenía (el propio botón recién clickeado) desaparece del DOM en el mismo
  // render y el navegador lo manda al <body> — quien navega con teclado
  // pierde el lugar por completo. Mismo criterio que ya usan MobileNav.tsx y
  // TableOfContents.tsx: devolver el foco al disparador que abrió esto.
  const wasExpandedRef = useRef(false);
  useEffect(() => {
    if (expanded) {
      wasExpandedRef.current = true;
    } else if (wasExpandedRef.current) {
      wasExpandedRef.current = false;
      collapsedButtonRef.current?.focus();
    }
  }, [expanded]);
  const router = useRouter();
  const suggestListId = useId();

  // Foco automático al montar (no en el botón colapsado, que ya se enfoca a
  // mano con su propio timeout): cubre tanto el click en la lupa como el
  // atajo de teclado Cmd/Ctrl+K de Header.tsx, que monta este componente
  // recién en ese momento — sin esto, el atajo abre el input pero el
  // visitante tiene que hacer un click más para poder tipear.
  useEffect(() => {
    if (!expandable) inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autocomplete en vivo: sugerencias del catálogo local mientras se tipea,
  // sin reemplazar el submit tradicional (Enter sigue yendo a /?q=... si no
  // se eligió ninguna sugerencia — fallback natural si falla el fetch).
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Búsquedas recientes: cuando el input está vacío, en vez de no mostrar
  // nada, ofrece retomar una búsqueda ya hecha sin volver a tipearla. Vive en
  // localStorage (sin cuentas), igual que guardados/vistos recientemente.
  // Lazy initializer (no useEffect): lee localStorage ya en el primer render
  // del cliente. El componente de /buscar (BuscarSearchBox) SÍ puede venir en
  // el HTML servido, y el botón de búsqueda del Header enfoca el input solo
  // con montar (efecto ya existente, más arriba en el archivo) — con un
  // useEffect separado para cargar `recent`, ese autofocus disparaba
  // onFocus ANTES de que este efecto corriera (los efectos de un mismo
  // commit corren en orden de declaración, no hay re-render entre uno y
  // otro), así que el primer foco veía `recent` todavía vacío y nunca abría
  // el dropdown. El lazy initializer resuelve esto sin carrera porque corre
  // sincrónico, como parte del render mismo.
  const [recent, setRecent] = useState<string[]>(() =>
    typeof window === "undefined" ? [] : readRecent()
  );

  // Escribe en localStorage DIRECTO (no adentro del updater de setRecent):
  // esto se llama siempre junto con onSearch, que navega — y en el buscador
  // expandible del Header, esa navegación desmonta este componente en el
  // mismo render (searchOpen pasa a false). Si el guardado dependiera de que
  // React procese el updater de estado, React puede saltearlo directamente
  // al ver que el hijo ya no está en el próximo árbol — el guardado se
  // perdía en silencio. Mismo patrón que ya usa use-saved-products.ts.
  function addRecent(term: string) {
    const trimmed = term.trim();
    if (!trimmed) return;
    const deduped = readRecent().filter((t) => t.toLowerCase() !== trimmed.toLowerCase());
    const next = [trimmed, ...deduped].slice(0, MAX_RECENT);
    writeRecent(next);
    setRecent(next);
  }

  function clearRecent() {
    setRecent([]);
    writeRecent([]);
  }

  // true: el dropdown muestra "Búsquedas recientes" (input vacío). false:
  // muestra las sugerencias del catálogo de siempre. Una sola lista visible
  // a la vez, así que reutilizan el mismo índice de resaltado y las mismas
  // flechas de teclado.
  const showingRecent = query.trim().length === 0;
  const activeList = showingRecent ? recent : suggestions;

  function runSearch(term: string) {
    setSuggestOpen(false);
    setQuery(term);
    addRecent(term);
    onSearch?.(term);
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    // Con red lenta y tipeo rápido, el fetch de una query vieja puede
    // resolver DESPUÉS del de una más nueva — sin cancelarlo, sus datos
    // pisan las sugerencias correctas (ej. Flecha abajo + Enter llevaría a
    // un producto que no coincide con lo que la persona terminó escribiendo).
    abortRef.current?.abort();
    const trimmed = query.trim();
    // Query corta: no hay nada que buscar. Se resuelve en el onChange (ver
    // más abajo), no acá, para no llamar setState de forma síncrona en el
    // cuerpo del efecto.
    if (trimmed.length < MIN_QUERY_LENGTH) return;
    debounceRef.current = setTimeout(() => {
      const controller = new AbortController();
      abortRef.current = controller;
      fetch(`/api/search/suggest?q=${encodeURIComponent(trimmed)}`, { signal: controller.signal })
        .then((res) => (res.ok ? res.json() : []))
        .then((data: Suggestion[]) => {
          setSuggestions(data);
          // Abre igual con 0 resultados: antes se cerraba en silencio y la
          // persona no sabía si la búsqueda falló, seguía cargando, o
          // simplemente no hay nada — ahora el estado vacío de abajo lo
          // confirma al toque, sin esperar al submit completo a /buscar.
          setSuggestOpen(true);
          setHighlighted(-1);
        })
        .catch((err) => {
          if (err?.name === "AbortError") return; // cancelado por una query más nueva, no un error real
          // Sin sugerencias por falla de red: el submit normal sigue andando.
          setSuggestions([]);
          setSuggestOpen(false);
        });
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, [query]);

  const selectSuggestion = (s: Suggestion) => {
    setSuggestOpen(false);
    addRecent(query);
    setQuery("");
    router.push(productHref(s));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestOpen && highlighted >= 0 && activeList[highlighted]) {
      if (showingRecent) {
        runSearch(activeList[highlighted] as string);
      } else {
        selectSuggestion(activeList[highlighted] as Suggestion);
      }
      return;
    }
    if (query.trim() && onSearch) {
      setSuggestOpen(false);
      addRecent(query.trim());
      onSearch(query.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!suggestOpen || activeList.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((i) => (i + 1) % activeList.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((i) => (i <= 0 ? activeList.length - 1 : i - 1));
    } else if (e.key === "Escape") {
      setSuggestOpen(false);
    }
  };

  if (expandable && !expanded) {
    return (
      <button
        ref={collapsedButtonRef}
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
        type="search"
        enterKeyHint="search"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        value={query}
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);
          const trimmed = value.trim();
          if (trimmed.length === 0) {
            // Campo vacío de nuevo (lo borraron, no que recién empiezan a
            // tipear): mostrar recientes al toque en vez de esperar un
            // re-foco, mismo gesto que ya esperan de un buscador.
            setSuggestions([]);
            setHighlighted(-1);
            setSuggestOpen(recent.length > 0);
          } else if (trimmed.length < MIN_QUERY_LENGTH) {
            setSuggestions([]);
            setSuggestOpen(false);
          }
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (showingRecent ? recent.length > 0 : suggestions.length > 0) setSuggestOpen(true);
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        role="combobox"
        aria-expanded={suggestOpen}
        aria-autocomplete="list"
        aria-controls={suggestListId}
        aria-activedescendant={
          suggestOpen && highlighted >= 0 ? `${suggestListId}-option-${highlighted}` : undefined
        }
        autoComplete="off"
        // `type="search"` le pide a WebKit/Chrome su propia "x" nativa de
        // limpiar — quedaría duplicada con el botón "Limpiar búsqueda" que
        // ya tiene el componente, así que se apaga la nativa explícito.
        className="w-full pl-9 pr-9 py-2 text-sm bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-[var(--radius-pill)] border border-[var(--border)] outline-none focus:border-[var(--text-muted)] transition-colors placeholder:text-[var(--text-muted)] [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
      />
      {(query || expandable) && (
        <button
          type="button"
          aria-label="Limpiar búsqueda"
          onClick={() => {
            setQuery("");
            setSuggestOpen(false);
            setHighlighted(-1);
            if (expandable) {
              // El colapso saca este botón del DOM en el mismo render; el
              // efecto de arriba devuelve el foco al ícono de lupa.
              setExpanded(false);
            } else {
              // No colapsa nada, pero este mismo botón SÍ desaparece del
              // DOM (su condición de render depende de `query`), así que
              // sin este refoco explícito el foco también caía al <body>.
              inputRef.current?.focus();
            }
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] cursor-pointer"
        >
          <X size={14} />
        </button>
      )}

      {suggestOpen && showingRecent && recent.length > 0 && (
        <div className="absolute z-20 top-full left-0 right-0 mt-1.5 py-1.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-[var(--radius-card)] shadow-lg overflow-hidden">
          <ul id={suggestListId} role="listbox" aria-label="Búsquedas recientes">
            {recent.map((term, i) => (
              <li
                key={term}
                id={`${suggestListId}-option-${i}`}
                role="option"
                aria-selected={i === highlighted}
              >
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => runSearch(term)}
                  onMouseEnter={() => setHighlighted(i)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 text-left cursor-pointer",
                    i === highlighted ? "bg-[var(--bg-secondary)]" : "hover:bg-[var(--bg-secondary)]"
                  )}
                >
                  <Clock size={14} className="shrink-0 text-[var(--text-muted)]" />
                  <span className="min-w-0 flex-1 text-sm text-[var(--text-primary)] truncate">
                    {term}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={clearRecent}
            className="block px-3 pt-1 pb-0.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] cursor-pointer"
          >
            Borrar búsquedas recientes
          </button>
        </div>
      )}

      {suggestOpen && !showingRecent && suggestions.length > 0 && (
        <ul
          id={suggestListId}
          role="listbox"
          className="absolute z-20 top-full left-0 right-0 mt-1.5 py-1.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-[var(--radius-card)] shadow-lg overflow-hidden"
        >
          {suggestions.map((s, i) => (
            <li
              key={s.id}
              id={`${suggestListId}-option-${i}`}
              role="option"
              aria-selected={i === highlighted}
            >
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
                  <span className="block text-sm text-[var(--text-primary)] truncate">
                    {highlightMatch(s.title, query)}
                  </span>
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

      {suggestOpen && !showingRecent && suggestions.length === 0 && (
        // Antes esto cerraba el dropdown en silencio: no había forma de
        // distinguir "todavía está buscando" de "no hay nada" sin mandar el
        // submit completo a /buscar. role="status" (no "alert"): es
        // informativo, no un error que interrumpa.
        <div
          role="status"
          className="absolute z-20 top-full left-0 right-0 mt-1.5 px-4 py-5 text-center bg-[var(--bg-primary)] border border-[var(--border)] rounded-[var(--radius-card)] shadow-lg"
        >
          <SearchX size={18} className="mx-auto text-[var(--text-muted)]" />
          <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
            Sin resultados para &quot;{query.trim()}&quot;
          </p>
        </div>
      )}
    </form>
  );
}
