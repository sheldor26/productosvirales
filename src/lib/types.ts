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
}

export interface TrendingKeyword {
  keyword: string;
  url: string;
  growth?: string;
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
}
