"use client";

import { Search, X } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  expandable?: boolean;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query.trim());
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
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
      />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-9 py-2 text-sm bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-[var(--radius-pill)] border border-[var(--border)] outline-none focus:border-[var(--text-muted)] transition-colors placeholder:text-[var(--text-muted)]"
      />
      {(query || expandable) && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            if (expandable) setExpanded(false);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] cursor-pointer"
        >
          <X size={14} />
        </button>
      )}
    </form>
  );
}
