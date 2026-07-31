"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

/**
 * Rescate contextual de la 404: lee el path roto (esto exige un client
 * component — not-found.tsx es server y no conoce la URL pedida) y arma un
 * link a la búsqueda interna con las palabras del slug. Una URL vieja o un
 * producto dado de baja es tráfico con intención de compra: mejor ofrecer
 * "buscá esto" que solo el menú genérico. Si el path no deja palabras
 * útiles (ej. "/xyz"), no renderiza nada — sin promesas débiles.
 */
const ROUTE_PREFIXES = ["producto", "guias", "categoria", "guardados", "trending"];

function termsFromPath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const last = segments.filter((s) => !ROUTE_PREFIXES.includes(s)).pop() ?? "";
  const words = last
    .toLowerCase()
    .replace(/mla[uf]?\d+/g, "") // el id MLA no aporta a una búsqueda por texto
    .split("-")
    .filter((w) => w.length >= 3 && !/^\d+$/.test(w));
  return words.slice(0, 5).join(" ");
}

export function NotFoundSearchHint() {
  const pathname = usePathname();
  const terms = termsFromPath(pathname ?? "");
  if (terms.split(" ").filter(Boolean).length < 1 || terms.length < 4) return null;

  return (
    <Link
      href={`/?q=${encodeURIComponent(terms)}`}
      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-[6px] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--border)] transition-colors"
    >
      <Search size={15} />
      Buscar &ldquo;{terms}&rdquo;
    </Link>
  );
}
