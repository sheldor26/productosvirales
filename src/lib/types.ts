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
}

export interface TrendingKeyword {
  keyword: string;
  url: string;
  growth?: string;
}

export interface GuideSection {
  type: "p" | "h2" | "h3" | "table" | "card" | "verdict" | "warning" | "bad" | "list" | "toc" | "image" | "image-grid";
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
