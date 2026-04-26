/**
 * Canonical URL helpers for product pages.
 *
 * URL shape: `/producto/<slug>-<mla-id>` (e.g. `/producto/lattafa-khamrah-qahwa-edp-100ml-mla31178643`).
 * The MLA ID is preserved at the end so lookup stays O(1) and legacy
 * URLs of the form `/producto/MLA12345` keep resolving (the parser
 * tolerates them and the page redirects to the canonical form).
 */

const SLUG_MAX_LENGTH = 80;

interface ProductLike {
  id: string;
  title: string;
}

function slugifyTitle(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX_LENGTH)
    .replace(/-+$/, "");
}

/** Canonical URL slug for a product, e.g. `lattafa-khamrah-qahwa-...-mla31178643`. */
export function productSlug(product: ProductLike): string {
  const titlePart = slugifyTitle(product.title);
  const idPart = product.id.toLowerCase();
  return titlePart ? `${titlePart}-${idPart}` : idPart;
}

/** Canonical pathname for a product, e.g. `/producto/lattafa-khamrah-...-mla31178643`. */
export function productHref(product: ProductLike): string {
  return `/producto/${productSlug(product)}`;
}

/**
 * Extract the MLA ID from a slug. Tolerates legacy bare-ID URLs
 * (`/producto/MLA12345`) and stale title prefixes (slug rewritten after
 * a title edit). Returns `{ id: null }` if no valid pattern matches.
 */
export function parseProductSlug(slug: string): { id: string | null } {
  const match = slug.match(/(?:^|-)(MLAU?\d+)$/i);
  return { id: match ? match[1].toUpperCase() : null };
}
