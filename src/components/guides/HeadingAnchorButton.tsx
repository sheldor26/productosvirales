"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

/** Botón "copiar link a esta sección", visible solo al pasar el mouse sobre
 * el encabezado (el padre pone `group`). Copia la URL completa con el
 * fragmento (#id) para que compartir "mirá esta parte de la guía" no
 * requiera editar el link a mano. */
export function HeadingAnchorButton({ sectionId }: { sectionId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = `${window.location.origin}${window.location.pathname}#${sectionId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Link copiado" : "Copiar link a esta sección"}
      className="ml-2 inline-flex align-middle opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-opacity cursor-pointer"
    >
      {copied ? <Check size={16} /> : <Link2 size={16} />}
    </button>
  );
}
