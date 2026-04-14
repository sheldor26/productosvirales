# Prompt: Fix SEO completo — ProductosVirales (v2)

Copiá este prompt en una nueva sesión de Claude para ejecutar todos los fixes.

---

## PROMPT

Necesito que soluciones todos los problemas SEO pendientes de mi proyecto Next.js (productosvirales.com.ar). **Leé AGENTS.md y GSAP_MIGRATION.md antes de tocar código.** Leé la guía de Next.js en `node_modules/next/dist/docs/` antes de usar cualquier API de Next.js.

**IMPORTANTE:** Primero restaurá los archivos truncados desde git, después hacé los fixes SEO. Al final, corré `npm run build` y verificá que compile limpio.

---

## PASO 0: Restaurar archivos truncados

Hay 7 archivos con cambios no commiteados que los truncaron. El último commit (`3988e4a`) tiene todo correcto. Restaurá ejecutando:

```bash
git checkout HEAD -- src/app/layout.tsx src/app/page.tsx src/app/trending/page.tsx "src/app/categoria/[slug]/page.tsx" "src/app/producto/[id]/page.tsx" src/app/guias/page.tsx next.config.ts src/data/curated-products.ts src/data/guides.ts src/components/products/ProductCard.tsx src/components/products/ProductDetail.tsx
```

Verificá que `npm run build` pase limpio antes de continuar. Si no compila, **no sigas** — primero arreglá lo que falle.

---

## PASO 1: Crear favicon y apple-touch-icon

El layout.tsx ya referencia `/favicon.ico` y `/apple-touch-icon.png`, pero los archivos no existen en `/public`. Crealos:

1. Generá un favicon simple: las letras "PV" en bold sobre fondo con gradiente naranja-rosa (#f97316 a #ec4899), texto blanco, 32x32px. Guardalo como `/public/favicon.ico`.
2. Generá el mismo diseño en 180x180px como `/public/apple-touch-icon.png`.
3. Eliminá los SVGs boilerplate de Next.js que no se usan: `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` de `/public/`.

---

## PASO 2: BreadcrumbList schema en guías — `src/app/guias/[slug]/page.tsx`

En el JSX del return, justo antes de `<GuideRenderer guide={guide} />`, agregá el BreadcrumbList JSON-LD:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: "https://productosvirales.com.ar",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Guías",
          item: "https://productosvirales.com.ar/guias",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: guide.title,
          item: `https://productosvirales.com.ar/guias/${guide.slug}`,
        },
      ],
    }),
  }}
/>
```

---

## PASO 3: Agregar `image` al Article schema de guías — `src/app/guias/[slug]/page.tsx`

En el objeto `articleLd` (alrededor de línea 55 en la versión de git HEAD), agregá el campo `image` después de `description`:

```ts
const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: guide.title,
  description: guide.metaDescription,
  image: "https://productosvirales.com.ar/og-default.png", // OG image por defecto
  datePublished: guide.publishedDate,
  // ... resto igual
};
```

**Nota:** Como las guías no tienen campo `image` en el tipo Guide, usá una imagen OG por defecto. Cuando se tenga imágenes por guía, se puede cambiar.

---

## PASO 4: OG images en guías metadata — `src/app/guias/[slug]/page.tsx`

En `generateMetadata`, agregá `images` a openGraph y twitter:

Modificar el return del generateMetadata así:

```ts
return {
  title: guide.seoTitle,
  description: guide.metaDescription,
  alternates: {
    canonical: `https://productosvirales.com.ar/guias/${guide.slug}`,
  },
  openGraph: {
    type: "article",
    title: guide.ogTitle || guide.seoTitle,
    description: guide.ogDescription || guide.metaDescription,
    url: `https://productosvirales.com.ar/guias/${guide.slug}`,
    siteName: "Productos Virales",
    locale: "es_AR",
    publishedTime: guide.publishedDate,
    modifiedTime: guide.updatedDate,
    images: [
      {
        url: "https://productosvirales.com.ar/og-default.png",
        width: 1200,
        height: 630,
        alt: guide.ogTitle || guide.seoTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: guide.ogTitle || guide.seoTitle,
    description: guide.ogDescription || guide.metaDescription,
    images: ["https://productosvirales.com.ar/og-default.png"],
  },
};
```

---

## PASO 5: Agregar `brand` y `sku` al Product schema — `src/app/producto/[id]/page.tsx`

En el objeto `jsonLd` (alrededor de línea 79 en git HEAD), agregar brand y sku:

```ts
const jsonLd = product.structuredData || {
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.title,
  description: product.description,
  image: product.image,
  sku: product.id,
  brand: {
    "@type": "Brand",
    name: product.category,
  },
  offers: {
    "@type": "Offer",
    url: product.affiliateUrl,
    priceCurrency: product.currency,
    price: product.price,
    availability: "https://schema.org/InStock",
    seller: {
      "@type": "Organization",
      name: "MercadoLibre Argentina",
    },
  },
};
```

**Nota:** Usamos `product.id` como SKU (es el ID de MercadoLibre) y `product.category` como brand genérico. Si tenés campo brand en los datos, usá ese.

---

## PASO 6: Agregar `logo` al Organization schema — `src/app/page.tsx`

En el JSON-LD de Organization en el home (alrededor de línea 43 en git HEAD), agregar logo:

```ts
{
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ProductosVirales",
  url: "https://productosvirales.com.ar",
  logo: "https://productosvirales.com.ar/apple-touch-icon.png",
  description: "Curador de productos virales y trending de MercadoLibre Argentina",
  sameAs: [],
}
```

---

## PASO 7: Fix sitemap lastModified — `src/app/sitemap.ts`

El sitemap usa `new Date()` como lastModified para casi todo, lo cual le dice a Google que todas las páginas cambiaron "ahora" cada vez que se regenera. Corregir:

```ts
import type { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { getSitemapProducts } from "@/lib/products";
import { getPublishedGuides } from "@/data/guides";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://productosvirales.com.ar";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/trending`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/guias`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((c) => !c.isSpecial)
    .map((cat) => ({
      url: `${SITE_URL}/categoria/${cat.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const productPages: MetadataRoute.Sitemap = getSitemapProducts().map(({ product, priority }) => ({
    url: `${SITE_URL}/producto/${product.id}`,
    changeFrequency: "weekly" as const,
    priority,
  }));

  const guidePages: MetadataRoute.Sitemap = getPublishedGuides().map((guide) => ({
    url: `${SITE_URL}/guias/${guide.slug}`,
    lastModified: new Date(guide.updatedDate),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...productPages, ...guidePages];
}
```

**Cambios clave:**
- Removido `lastModified: new Date()` de static, category y product pages (si no tenés fecha real, es mejor omitirlo)
- Guías mantienen `lastModified` porque SÍ tienen `updatedDate` real
- Agregada `/guias` como página estática que faltaba

---

## PASO 8: Crear OG image por defecto — `public/og-default.png`

Generá una imagen OG de 1200x630px para usar como default en social sharing:
- Fondo con gradiente naranja a rosa (#f97316 a #ec4899)
- Texto "ProductosVirales" en blanco, bold, centrado
- Subtítulo "Lo más trending de MercadoLibre" debajo
- Guardala como `/public/og-default.png`

---

## PASO 9: Crear `public/llms.txt` para AI Search

Crear el archivo `/public/llms.txt` con este contenido:

```
# ProductosVirales.com.ar

## About
ProductosVirales is a curated product discovery platform for MercadoLibre Argentina. We showcase trending and viral products, publish buying guides with honest comparisons, and help Argentine consumers find the best deals on products that are popular on TikTok and social media.

## Content Types
- Product pages: Individual product reviews with prices, pros/cons, specs, and FAQ
- Buying guides: In-depth comparisons (e.g., "Best massagers in Argentina 2026")
- Category pages: Curated collections by category (Home, Kitchen, Beauty, Tech, Fitness, Fashion)
- Trending page: Products currently trending on MercadoLibre and TikTok

## Key Topics
- Viral products from TikTok and social media available on MercadoLibre Argentina
- Product comparisons with real prices in Argentine Pesos (ARS)
- Buying guides for Argentine consumers
- Trending deals and offers on MercadoLibre

## Language
Spanish (Argentina)

## Contact
Website: https://productosvirales.com.ar
```

---

## PASO 10: Agregar contenido editorial a Trending — `src/app/trending/page.tsx`

La página trending es thin content (solo H1 + grid). Agregar un párrafo introductorio después del H1:

Buscar el cierre de `</p>` después de "Lo que todos están buscando y comprando ahora mismo" y agregar debajo:

```tsx
<p className="mt-3 text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
  Actualizamos esta selección todos los días con los productos que más se buscan
  en MercadoLibre Argentina. Usamos datos reales de ventas, búsquedas y
  tendencias de TikTok para mostrarte lo que realmente está explotando. Si un
  producto está acá, es porque miles de personas lo están comprando ahora mismo.
</p>
```

---

## PASO 11: Agregar HSTS header — `next.config.ts`

En el array de headers dentro de `async headers()`, agregar HSTS:

```ts
{
  key: "Strict-Transport-Security",
  value: "max-age=63072000; includeSubDomains; preload",
},
```

---

## PASO 12: Verificación final

```bash
npm run build
```

Si el build pasa limpio, verificar manualmente con `npm run dev`:

1. `localhost:3000/robots.txt` — devuelve reglas correctas con sitemap
2. `localhost:3000/sitemap.xml` — incluye todas las URLs, `/guias` incluida
3. View Source en home — verificar Organization + WebSite JSON-LD con logo
4. View Source en una guía — verificar Article (con image) + BreadcrumbList + FAQPage
5. View Source en un producto — verificar Product (con brand, sku, seller) + BreadcrumbList + FAQPage
6. Verificar que favicon aparece en el tab del browser
7. Verificar `/llms.txt` devuelve el contenido correcto

---

## Resumen de archivos a tocar

| # | Archivo | Acción |
|---|---------|--------|
| 0 | 7+ archivos | `git checkout HEAD --` para restaurar |
| 1 | `/public/favicon.ico` | **CREAR** |
| 1 | `/public/apple-touch-icon.png` | **CREAR** |
| 1 | `/public/*.svg` (5 archivos) | **ELIMINAR** boilerplate |
| 2 | `src/app/guias/[slug]/page.tsx` | Agregar BreadcrumbList JSON-LD |
| 3 | `src/app/guias/[slug]/page.tsx` | Agregar `image` al Article schema |
| 4 | `src/app/guias/[slug]/page.tsx` | Agregar images a OG/twitter en metadata |
| 5 | `src/app/producto/[id]/page.tsx` | Agregar `brand`, `sku`, `seller` al Product schema |
| 6 | `src/app/page.tsx` | Agregar `logo` al Organization schema |
| 7 | `src/app/sitemap.ts` | Fix lastModified, agregar `/guias` |
| 8 | `/public/og-default.png` | **CREAR** OG image |
| 9 | `/public/llms.txt` | **CREAR** para AI search |
| 10 | `src/app/trending/page.tsx` | Agregar párrafo introductorio |
| 11 | `next.config.ts` | Agregar HSTS header |
| 12 | — | Build verification |

**Total: 8 archivos a modificar, 5 archivos a crear, 5 archivos a eliminar, 12 pasos.**
