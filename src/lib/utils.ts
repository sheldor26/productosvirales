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

/** Distancia de edición (Levenshtein) con salida anticipada: si la diferencia
 * de largo ya supera `max`, ni arma la matriz. Se usa SOLO como fallback de
 * búsqueda (ver `fuzzyWordMatch`) cuando la coincidencia exacta no encuentra
 * nada — no reemplaza el matcheo rápido de todos los días. */
function levenshteinWithinTolerance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

/** ¿Alguna palabra del haystack se parece a `queryWord` con un margen de
 * error chico (typos de tipeo)? Palabras cortas (<=3) exigen match exacto
 * para no generar falsos positivos ("tv" no debe "parecerse" a cualquier
 * cosa de 2-3 letras). */
export function fuzzyWordMatch(queryWord: string, haystackWords: string[]): boolean {
  if (queryWord.length <= 3) return haystackWords.includes(queryWord);
  const tolerance = queryWord.length <= 6 ? 1 : 2;
  return haystackWords.some((hw) => levenshteinWithinTolerance(queryWord, hw, tolerance) <= tolerance);
}
