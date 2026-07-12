import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number, currency = "ARS"): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDiscount(original: number, current: number): number {
  return Math.round(((original - current) / original) * 100);
}

export function getFullSizeImage(thumbnail: string): string {
  return thumbnail.replace(/-I\.jpg$/, "-O.jpg");
}

export function buildAffiliateUrl(permalink: string): string {
  return permalink;
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/** Normaliza texto para búsqueda: minúsculas + sin acentos. Liviano (sin
 * imports pesados) para poder usarlo tanto en server (precomputar el haystack)
 * como en cliente (normalizar la query) sin arrastrar el catálogo al bundle. */
export function normalizeSearch(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}
