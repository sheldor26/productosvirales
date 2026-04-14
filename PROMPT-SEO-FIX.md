# Prompt: Solucionar todos los problemas SEO de ProductosVirales

Copiá y pegá este prompt en una nueva conversación de Claude para ejecutar todos los fixes.

---

## PROMPT

Necesito que soluciones TODOS los problemas SEO de mi proyecto Next.js. El sitio es productosvirales.com.ar — un curador de productos virales de MercadoLibre Argentina. **Leé AGENTS.md y GSAP_MIGRATION.md antes de tocar cualquier archivo.** Leé la guía de Next.js en `node_modules/next/dist/docs/` antes de usar cualquier API de Next.js (esta versión tiene breaking changes).

El sitio actualmente NO está indexado en Google. Necesito que hagas TODOS estos cambios de forma incremental (uno por uno, testeando que compile después de cada uno). Al final, corré `npm run build` para verificar que todo compila.

---

### 1. Crear `src/app/robots.ts` (ARCHIVO NUEVO)

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://productosvirales.com.ar";
  
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
```

---

### 2. Agregar viewport export a `src/app/layout.tsx`

Después de la línea `import "./globals.css";`, agregar:

```ts
import type { Viewport } from "next";
```

Después del cierre de `export const metadata: Metadata = { ... };`, agregar:

```ts
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};
```

En el mismo archivo, agregar al objeto `metadata` existente estas propiedades que faltan:

```ts
export const metadata: Metadata = {
  title: {
    default: "ProductosVirales — Lo más trending de MercadoLibre",
    template: "%s | ProductosVirales",
  },
  description:
    "Descubrí los productos más virales y trending de MercadoLibre Argentina. Ofertas, tendencias de TikTok y lo que todos están comprando.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://productosvirales.com.ar"
  ),
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "ProductosVirales",
  },
  twitter: {
    card: "summary_large_image",
    site: "@productosvirales",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://productosvirales.com.ar",
  },
};
```

---

### 3. Agregar metadata y structured data al Home — `src/app/page.tsx`

Agregar estos imports al inicio:

```ts
import type { Metadata } from "next";
```

Agregar antes del `export default`:

```ts
export const metadata: Metadata = {
  title: "Productos Virales de MercadoLibre Argentina — Lo más trending",
  description:
    "Descubrí los productos más virales y trending de MercadoLibre Argentina. Ofertas, tendencias TikTok y lo que todos están comprando hoy.",
  alternates: {
    canonical: "https://productosvirales.com.ar",
  },
  openGraph: {
    title: "ProductosVirales — Lo más trending de MercadoLibre",
    description: "Los productos que explotan en Internet, actualizados todos los días.",
    url: "https://productosvirales.com.ar",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProductosVirales — Lo más trending de MercadoLibre",
    description: "Los productos que explotan en Internet, actualizados todos los días.",
  },
};
```

Dentro del JSX, antes del `<HeroBanner />`, agregar los schemas JSON-LD de Organization y WebSite:

```tsx
{/* JSON-LD Structured Data */}
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "ProductosVirales",
      url: "https://productosvirales.com.ar",
      description: "Curador de productos virales y trending de MercadoLibre Argentina",
      sameAs: [],
    }),
  }}
/>
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "ProductosVirales",
      url: "https://productosvirales.com.ar",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://productosvirales.com.ar/?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    }),
  }}
/>
```

---

### 4. Agregar canonical y twitter a Trending — `src/app/trending/page.tsx`

Modificar el export de metadata existente para agregar las propiedades faltantes:

```ts
export const metadata: Metadata = {
  title: "Trending — Lo más buscado en MercadoLibre",
  description:
    "Descubrí los productos que están en tendencia ahora mismo en MercadoLibre Argentina.",
  alternates: {
    canonical: "https://productosvirales.com.ar/trending",
  },
  openGraph: {
    title: "Productos Trending en MercadoLibre Argentina",
    description: "Los productos más buscados y comprados ahora mismo.",
    url: "https://productosvirales.com.ar/trending",
  },
  twitter: {
    card: "summary_large_image",
    title: "Productos Trending en MercadoLibre Argentina",
    description: "Los productos más buscados y comprados ahora mismo.",
  },
};
```

---

### 5. Agregar canonical, OG, twitter, generateStaticParams y BreadcrumbList a Categorías — `src/app/categoria/[slug]/page.tsx`

Agregar import de `categories` (ya está importado). Agregar `generateStaticParams`:

```ts
export function generateStaticParams() {
  return categories.filter((c) => !c.isSpecial).map((c) => ({ slug: c.slug }));
}
```

Modificar `generateMetadata` para agregar canonical, OG y twitter:

```ts
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) return { title: "Categoría no encontrada" };

  const title = category.h1 || category.name;
  const description = category.description || `Los mejores productos de ${category.name} en MercadoLibre Argentina.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://productosvirales.com.ar/categoria/${slug}`,
    },
    openGraph: {
      title: `${title} | ProductosVirales`,
      description,
      url: `https://productosvirales.com.ar/categoria/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ProductosVirales`,
      description,
    },
  };
}
```

En el JSX, agregar BreadcrumbList schema al inicio del return (dentro del div principal):

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
          name: category.name,
          item: `https://productosvirales.com.ar/categoria/${slug}`,
        },
      ],
    }),
  }}
/>
```

---

### 6. Agregar canonical, twitter, generateStaticParams y BreadcrumbList a Productos — `src/app/producto/[id]/page.tsx`

Agregar `generateStaticParams` para los productos featured:

```ts
export function generateStaticParams() {
  return curatedProducts
    .filter((p) => p.visibility !== "deprioritized")
    .slice(0, 50)
    .map((p) => ({ id: p.id }));
}
```

Modificar `generateMetadata` para agregar canonical y twitter:

```ts
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = curatedProducts.find((p) => p.id === id);
  if (!product) return { title: "Producto no encontrado" };

  const title = product.seoTitle || product.title;
  const description =
    product.metaDescription ||
    product.description ||
    `Comprá ${product.title} al mejor precio en MercadoLibre Argentina.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://productosvirales.com.ar/producto/${id}`,
    },
    openGraph: {
      title: product.ogTitle || title,
      description: product.ogDescription || description,
      images: [product.image],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.ogTitle || title,
      description: product.ogDescription || description,
      images: [product.image],
    },
  };
}
```

En el JSX, agregar BreadcrumbList schema justo después del FAQ JSON-LD script:

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
          name: product.category,
          item: `https://productosvirales.com.ar/categoria/${product.categorySlug}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: product.title,
          item: `https://productosvirales.com.ar/producto/${product.id}`,
        },
      ],
    }),
  }}
/>
```

---

### 7. Remover `unoptimized` de TODAS las Image components

Buscar en todo el proyecto `unoptimized` y eliminarlo de cada `<Image>` component. Los archivos afectados son:

- `src/components/products/ProductCard.tsx` — buscar `unoptimized` y eliminar esa prop
- `src/components/products/ProductDetail.tsx` — buscar TODAS las instancias de `unoptimized` y eliminar esa prop (hay varias: imagen principal, imágenes de productos relacionados)

Esto habilita la optimización automática de Next.js (WebP, responsive sizes, lazy loading).

---

### 8. Agregar `twitter` a guías index — `src/app/guias/page.tsx`

Modificar el metadata existente para agregar twitter card:

```ts
export const metadata: Metadata = {
  title: "Guías de compra — Productos Virales",
  description:
    "Comparativas honestas y guías de compra para elegir bien en MercadoLibre Argentina. Masajeadores, gadgets virales y más.",
  alternates: {
    canonical: "https://productosvirales.com.ar/guias",
  },
  openGraph: {
    title: "Guías de compra — Productos Virales",
    description: "Comparativas honestas y guías de compra para elegir bien en MercadoLibre Argentina.",
    url: "https://productosvirales.com.ar/guias",
  },
  twitter: {
    card: "summary_large_image",
    title: "Guías de compra — Productos Virales",
    description: "Comparativas honestas y guías de compra para elegir bien en MercadoLibre Argentina.",
  },
};
```

---

### 9. Agregar headers SEO en `next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "http2.mlstatic.com",
      },
      {
        protocol: "https",
        hostname: "*.mlstatic.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

### 10. Verificación final

Después de hacer TODOS los cambios, corré:

```bash
npm run build
```

Si hay errores, corregí cada uno. El build tiene que pasar limpio.

Después verificá manualmente:
- Que `localhost:3000/robots.txt` devuelva las reglas correctas
- Que `localhost:3000/sitemap.xml` liste todas las URLs
- Que cada página tenga canonical, OG y twitter card (inspeccioná el HTML con View Source)
- Que los JSON-LD aparezcan correctamente (usá el Rich Results Test de Google mentalmente)

---

### Resumen de archivos a modificar/crear

| Archivo | Acción |
|---------|--------|
| `src/app/robots.ts` | **CREAR** (nuevo) |
| `src/app/layout.tsx` | Agregar viewport export, twitter, icons, canonical |
| `src/app/page.tsx` | Agregar metadata export, Organization + WebSite schemas |
| `src/app/trending/page.tsx` | Agregar canonical, OG, twitter al metadata |
| `src/app/categoria/[slug]/page.tsx` | Agregar generateStaticParams, canonical, OG, twitter, BreadcrumbList |
| `src/app/producto/[id]/page.tsx` | Agregar generateStaticParams, canonical, twitter, BreadcrumbList |
| `src/app/guias/page.tsx` | Agregar OG, twitter al metadata |
| `src/components/products/ProductCard.tsx` | Remover `unoptimized` |
| `src/components/products/ProductDetail.tsx` | Remover `unoptimized` (todas las instancias) |
| `next.config.ts` | Agregar security headers |
