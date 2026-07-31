/** Subconjunto de Product que necesita la tarjeta de la grilla. Las páginas
 * server-side mapean a esto antes de pasarle productos a ProductGrid (client):
 * pasar el Product completo serializa articleBody/faq/reviews de cada producto
 * en el payload RSC del HTML (~1 MB extra por página de categoría). */
export type CardProduct = Pick<
  Product,
  | "id"
  | "title"
  | "price"
  | "originalPrice"
  | "image"
  | "category"
  | "categorySlug"
  | "affiliateUrl"
  | "tiktokViews"
  | "badge"
  | "pastelColor"
  | "priceStatus"
  | "rating"
  | "soldQuantity"
  | "freeShipping"
> & {
  /** true si el precio actual está en su mínimo histórico (o a <=5% de él),
   * según `analyzePriceHistory`. Derivado en el server al armar la tarjeta,
   * no es un campo real del catálogo. */
  bestPrice?: boolean;
};

export interface Product {
  id: string;
  title: string;
  /** Nombre canónico limpio del producto (ej. "Lattafa Asad Intense EDP 100ml").
   * Se usa en JSON-LD `name`, breadcrumbs y comparativas. Fallback: `title`. */
  canonicalName?: string;
  /** MPN real del fabricante. NUNCA inventar; omitir si no se conoce. */
  mpn?: string;
  /** Verificabilidad editorial: fecha ISO en que se leyeron las reseñas de ML
   * para curar `customerReviews` (ej. "2026-06-10"). */
  reviewsSampledAt?: string;
  price: number;
  originalPrice?: number;
  currency: string;
  image: string;
  images?: string[];
  category: string;
  categorySlug: string;
  permalink: string;
  affiliateUrl: string;
  condition: "new" | "used";
  freeShipping: boolean;
  rating?: number;
  soldQuantity?: number;
  tiktokViews?: string;
  tiktokVideoUrl?: string;
  badge?: "viral" | "trending" | "hot-deal" | "bestseller" | "summer-pick" | "tiktok-viral" | "collector";
  pastelColor?: string;
  pros?: string[];
  cons?: string[];
  verdict?: string;
  description?: string;
  // ─── SEO & Content ───
  seoTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  h1?: string;
  articleBody?: string;
  faq?: Array<{ question: string; answer: string }>;
  specs?: Array<{ label: string; value: string }>;
  structuredData?: Record<string, unknown>;
  relatedProducts?: string[]; // Array of product IDs for cross-linking
  visibility?: "featured" | "normal" | "deprioritized"; // Default: "normal" when omitted

  // ─── Perfume metadata (optional, used by individual fichas) ───
  brand?: string;
  line?: string;            // e.g. "Yara"
  version?: string;         // e.g. "Elixir"
  gender?: "Hombre" | "Mujer" | "Unisex";
  perfumeType?: string;     // e.g. "Eau de Parfum"
  concentration?: string;   // "EDP" | "EDT" | "Parfum" | "EDC"
  volume?: number;          // numeric volume
  volumeUnit?: "mL" | "L";
  color?: string;
  priceUpdated?: string;    // ISO date when the price was last verified
  /** ISO date the price was last checked. Drives JSON-LD `priceValidUntil` (we add 30 days). */
  priceLastChecked?: string;
  /** "fresh" = price verified recently. "stale" = could not auto-verify, may be outdated. "out_of_stock" = listing inactive. */
  priceStatus?: "fresh" | "stale" | "out_of_stock";
  reviewCount?: number;
  reviewsWithPhotos?: number;
  /** Approximate distribution of star ratings from ML. Strings to allow "70%+" wording. */
  ratingBreakdown?: {
    five?: string;
    four?: string;
    three?: string;
    two?: string;
    one?: string;
  };
  /** Curated customer reviews for the ficha individual. */
  customerReviews?: Array<{
    rating: number;
    country?: string;
    date?: string;
    text: string;
    useful?: number;
  }>;
  /** Editorial best-fit signals derived from review patterns. */
  bestSeason?: string[];
  bestOccasion?: string[];
  notRecommendedFor?: string[];
  /** Comparisons to other fragrances mentioned in reviews. */
  comparedTo?: Array<{ name: string; similarity: string }>;
  aiReviewSummary?: string;

  // Olfactive data
  olfactiveFamily?: string[];
  notes?: {
    top?: string[];
    heart?: string[];
    base?: string[];
  };
  /** Editorial caveat shown next to the olfactive notes when sources disagree. */
  notesDisclaimer?: string;

  duration?: string;        // human-readable, e.g. "8 horas"
  durationHours?: number;
  /** Vendor's official duration claim, in hours, when it disagrees with field reports. */
  durationOfficial?: number;
  /** Editorial caveat about the duration mismatch. */
  durationDisclaimer?: string;
  projection?: string;      // "Baja" | "Media" | "Media-alta" | "Alta"
  /** Editorial note about projection (e.g. recommended sprays). */
  projectionNote?: string;

  originCountry?: string;
  launchYear?: number;
  /** Year the parent line launched (e.g. Asad original 2021 vs Intense 2024). */
  originalLineYear?: number;
  crueltyFree?: boolean;
  vegan?: boolean;
  alcoholFree?: boolean;

  applicationFormat?: "Spray" | "Roll-on" | "Splash" | "Atomizador";
  refillable?: boolean;
  includesCase?: boolean;
  isSet?: boolean;

  packageDimensions?: {
    heightCm?: number;
    lengthCm?: number;
    widthCm?: number;
    weightGrams?: number;
  };

  // Editorial copy (separate from generic description)
  headline?: string;
  shortDescription?: string;
  longDescription?: string;
}

export interface Coupon {
  code: string;
  discountAmount: number;
  minPurchase: number;
  /** ISO datetime start. `null`/omitido = válido desde cualquier hora. */
  validFrom?: string | null;
  /** ISO datetime end. `null`/omitido = sin vencimiento confirmado por MELI. */
  validUntil?: string | null;
  active: boolean;
}

export interface TrendingKeyword {
  keyword: string;
  url: string;
  growth?: string;
}

export type LabelColor = "green" | "blue" | "amber" | "purple" | "slate";
export type Intensity = "baja" | "media" | "alta" | "muy alta";
export type CalloutVariant = "note" | "warning" | "tip" | "update";
export type TrustVariant = "methodology" | "credentials" | "pricing";

export interface GuideSection {
  type:
    | "p"
    | "h2"
    | "h3"
    | "table"
    | "card"
    | "verdict"
    | "warning"
    | "bad"
    | "list"
    | "toc"
    | "image"
    | "svg"
    | "image-grid"
    | "product-card"
    | "callout"
    | "pull-quote"
    | "trust-block";
  id?: string;
  title?: string;
  /** `h3` only: renderiza el número inicial del título ("1. Título") como ancla visual grande. No afecta h3 sin este flag. */
  bigNumber?: boolean;
  content?: string;
  items?: string[] | Array<{ label: string; href?: string }>;
  /** `list` only: envuelve la lista en una caja con fondo gris sutil (bg-secondary), separándola del texto circundante. */
  boxed?: boolean;
  headers?: string[];
  rows?: string[][];
  card?: {
    heading: string;
    paragraphs: string[];
    ctas?: Array<{ label: string; href: string }>;
  };
  src?: string;
  /** Required for new content. Used as the `alt` for `image` and as the
   * accessible label for screen readers. Empty strings are not allowed. */
  alt?: string;
  /** Optional caption rendered below the image. Also used as fallback
   * `alt` text when `alt` is missing. Required for new content if `alt`
   * is not descriptive on its own. */
  caption?: string;
  imageSize?: "hero" | "inline-lg" | "inline-md" | "inline-sm";
  /** Intrinsic image width in px. Lets next/image reserve layout box
   * without `fill`. Defaults: hero → 1200, inline → 800 when omitted. */
  width?: number;
  /** Intrinsic image height in px. Defaults: hero → 630, inline → 600. */
  height?: number;
  /** `alt` is required on every grid item in new content. */
  gridImages?: Array<{
    src: string;
    alt: string;
    caption?: string;
    width?: number;
    height?: number;
  }>;

  // ── product-card fields ─────────────────────────────
  productMlaId?: string;
  label?: string;
  labelColor?: LabelColor;
  ranking?: number;
  description?: string;
  notes?: string[];
  longevity?: Intensity;
  projection?: Intensity;
  /** "default" = full card (rankings, head-to-head). "compact" = dense, 1-line description, no notes. */
  variant?: "default" | "compact";

  // ── callout fields ──────────────────────────────────
  calloutVariant?: CalloutVariant;
  /** Date for "update" variant, ISO string (e.g. "2026-04-17"). */
  date?: string;
  /** Optional override of the default label (NOTA/ATENCIÓN/TIP/ACTUALIZACIÓN). */
  calloutTitle?: string;

  // ── trust-block fields ──────────────────────────────
  trustVariant?: TrustVariant;

  // ── pull-quote attribution (optional) ───────────────
  /** Author/source line shown beneath a pull-quote (e.g. "— Comprador en Argentina, sept 2024"). */
  attribution?: string;
}

export interface GuideFAQ {
  question: string;
  answer: string;
}

export interface Guide {
  slug: string;
  category: string; // e.g. "masajeadores"
  /** Si está presente, la guía vive en `/guias/{silo}/{slug}` (silo nuevo con subdirectorio,
   * ej. "climatizacion"). Si falta, vive en `/guias/{slug}` (legacy plano, no se migra). */
  silo?: string;
  /** Marca la guía pilar (hub/ranking) de su categoría. Se renderiza como card destacada en /guias. */
  pillar?: boolean;
  title: string;
  seoTitle: string;
  metaDescription: string;
  ogTitle?: string;
  ogDescription?: string;
  /** Foto de producto (URL) para la imagen OpenGraph. Si está, la ruta opengraph-image
   * la compone sobre el fondo de marca en vez del gradiente con solo el título. */
  ogImage?: string;
  h1: string;
  publishedDate: string;
  updatedDate: string;
  /** Fecha (YYYY-MM-DD) para el <lastmod> del sitemap cuando hubo cambios menores
   * (links internos, seoTitle) que ameritan re-crawl pero NO cuentan como
   * actualización editorial: updatedDate queda intacta para no resetear las
   * ventanas de maduración del loop SEO semanal. El sitemap usa la más reciente
   * de las dos. */
  sitemapLastmod?: string;
  intro: string[];
  sections: GuideSection[];
  faq?: GuideFAQ[];
  internalLinks?: Array<{ label: string; href: string }>;
  internalLinksTitle?: string;
  hasDisclosure?: boolean;
  /** Standfirst / dek shown under the H1. If absent, first intro paragraph is used. */
  standfirst?: string;
  /** Respuesta directa (caja "Respuesta rápida" antes de la intro): 40-60 palabras que
   * responden la pregunta principal de la guía. Es el bloque que extraen AI Overviews
   * y los LLMs para citarnos. Formato: "Para la mayoría conviene X; si [caso], Y."
   * Soporta **negrita**, [links](...) y tokens {{precio:ID:k}}. */
  directAnswer?: string;
  /** Override the auto-computed reading time in minutes. */
  readingTime?: number;
  /** Optional curated shortcuts shown right after intro (Wirecutter "Our picks" style). */
  quickPicks?: Array<{
    productMlaId: string;
    label: string;
    labelColor?: LabelColor;
    tagline: string;
  }>;
}

export interface Category {
  slug: string;
  name: string;
  icon: string;
  pastel: string;
  mlCategoryId?: string;
  description?: string;
  h1?: string;
  isSpecial?: boolean;
  color?: string;
  buyersGuide?: string;
}

// ML API response types

export interface MLItem {
  id: string;
  title: string;
  price: number;
  original_price: number | null;
  currency_id: string;
  thumbnail: string;
  pictures: Array<{
    id: string;
    url: string;
    secure_url: string;
    size: string;
    max_size: string;
  }>;
  permalink: string;
  condition: string;
  shipping: { free_shipping: boolean };
  sold_quantity: number;
  category_id: string;
  status: string;
  available_quantity: number;
  initial_quantity: number;
  attributes: Array<{
    id: string;
    name: string;
    value_name: string | null;
  }>;
}

export interface MLCategory {
  id: string;
  name: string;
  path_from_root: Array<{ id: string; name: string }>;
}

export interface MLReviews {
  rating_average: number;
  total: number;
}
