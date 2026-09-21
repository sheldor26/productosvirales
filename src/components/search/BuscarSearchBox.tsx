"use client";

import { useRouter } from "next/navigation";
import { SearchInput } from "@/components/ui/SearchInput";

interface BuscarSearchBoxProps {
  /** Categoría activa (si hay), para no perderla al reescribir la búsqueda. */
  categoria?: string;
}

/** Input de búsqueda de /buscar. Mismo componente que usa el Header (con
 * autocomplete contra /api/search/suggest), pero el submit navega dentro de
 * /buscar en vez de a la home — ver src/components/layout/Header.tsx. */
export function BuscarSearchBox({ categoria }: BuscarSearchBoxProps) {
  const router = useRouter();

  const handleSearch = (query: string) => {
    const params = new URLSearchParams();
    params.set("q", query);
    if (categoria) params.set("categoria", categoria);
    router.push(`/buscar?${params.toString()}`);
  };

  return <SearchInput placeholder="Buscar productos..." onSearch={handleSearch} />;
}
