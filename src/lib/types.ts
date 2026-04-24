export interface Product {
  id: string;
  title: string;
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
  badge?: "viral" | "trending" | "hot-deal";
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

export interface TrendingKeyword {
  keyword: string;
  url: string;
  growth?: string;
}

export type LabelColor = "green" | "blue" | "amber" | "purple";
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
    | "image-grid"
    | "product-card"
    | "callout"
    | "pull-quote"
    | "trust-block";
  id?: string;
  title?: string;
  content?: string;
  items?: string[] | Array<{ label: string; href?: string }>;
  headers?: string[];
  rows?: string[][];
  card?: {
    heading: string;
    paragraphs: string[];
    ctas?: Array<{ label: string; href: string }>;
  };
  src?: string;
  alt?: string;
  imageSize?: "hero" | "inline-lg" | "inline-md" | "inline-sm";
  gridImages?: Array<{ src: string; alt: string; caption?: string }>;

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
  title: string;
  seoTitle: string;
  metaDescription: string;
  ogTitle?: string;
  ogDescription?: string;
  h1: string;
  publishedDate: string;
  updatedDate: string;
  intro: string[];
  sections: GuideSection[];
  faq?: GuideFAQ[];
  internalLinks?: Array<{ label: string; href: string }>;
  internalLinksTitle?: string;
  hasDisclosure?: boolean;
  /** Standfirst / dek shown under the H1. If absent, first intro paragraph is used. */
  standfirst?: string;
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
