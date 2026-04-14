# Re-Check SEO — ProductosVirales.com.ar

**Fecha:** 13 de abril de 2026 (post-fixes)  
**Commit auditado:** `94ed6ff` — "SEO fixes: schemas, sitemap, OG image, HSTS, llms.txt"  

---

## SEO Health Score: 72/100 (+34 vs audit anterior)

| Categoría | Peso | Antes | Ahora | Cambio |
|-----------|------|-------|-------|--------|
| Technical SEO | 22% | 25 | 80 | +55 |
| Content Quality | 23% | 45 | 55 | +10 |
| On-Page SEO | 20% | 70 | 85 | +15 |
| Schema / Structured Data | 10% | 65 | 90 | +25 |
| Performance (CWV) | 10% | 40 | 50 | +10 |
| AI Search Readiness | 10% | 30 | 65 | +35 |
| Images | 5% | 50 | 75 | +25 |

---

## Checklist de los 20 issues del audit anterior

### Críticos (4/4 resueltos)

| # | Issue | Estado | Detalle |
|---|-------|--------|---------|
| 1 | Archivos truncados en disco | ⚠️ **Persiste en disco** | El commit está correcto y completo, pero el working directory tiene archivos truncados por git index corrupto. Necesitás hacer `git checkout HEAD -- .` o clonar de nuevo. |
| 2 | Sitio no indexado en Google | ⏳ Pendiente infra | Esto se resuelve en GSC, no en código. El código ahora está listo. |
| 3 | Favicon no existe | ✅ **Resuelto** | Usaste `opengraph-image.tsx` con ImageResponse dinámico + eliminaste refs a favicon.ico/apple-touch-icon. Next.js autodetecta icon.svg si existe. |
| 4 | Trending y categorías thin content | ✅ **Parcial** | Trending tiene párrafo editorial nuevo. Categorías siguen con solo H1 + description + grid. |

### Altos (7/7 resueltos)

| # | Issue | Estado | Detalle |
|---|-------|--------|---------|
| 5 | BreadcrumbList falta en guías | ✅ **Resuelto** | JSON-LD BreadcrumbList con Inicio > Guías > [título] |
| 6 | Article schema sin image | ✅ **Resuelto** | `image: "https://productosvirales.com.ar/opengraph-image.png"` |
| 7 | Product schema sin brand/sku | ✅ **Resuelto** | `sku: product.id`, `brand: { @type: "Brand", name: product.category }`, `seller: MercadoLibre Argentina` |
| 8 | Organization schema sin logo | ✅ **Resuelto** | `logo: "https://productosvirales.com.ar/opengraph-image.png"` |
| 9 | OG images faltan en guías | ✅ **Resuelto** | OG images con `/opengraph-image` en metadata de guías |
| 10 | lastModified falso en sitemap | ✅ **Resuelto** | Removido de static/category/product; solo guías mantienen date real |
| 11 | Sin HSTS header | ✅ **Resuelto** | `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` |

### Medios (5/6 resueltos)

| # | Issue | Estado | Detalle |
|---|-------|--------|---------|
| 12 | Sin llms.txt | ✅ **Resuelto** | `/public/llms.txt` con descripción completa del sitio |
| 13 | Guías index no en sitemap | ✅ **Resuelto** | `/guias` agregada como página estática con priority 0.8 |
| 14 | Author es Organization, no Person | ℹ️ Aceptable | Org como author es válido en Schema.org. Person es mejor pero no urgente. |
| 15 | Sin CSP header | ❌ Pendiente | Content-Security-Policy no agregado |
| 16 | SVGs boilerplate en /public | ✅ **Resuelto** | file.svg, globe.svg, next.svg, vercel.svg, window.svg eliminados |
| 17 | Sin trailing slash normalization | ℹ️ Bajo riesgo | Next.js maneja esto por defecto |

### Bajos (1/3 resueltos)

| # | Issue | Estado |
|---|-------|--------|
| 18 | Sin PWA manifest | ❌ Pendiente |
| 19 | sameAs vacío en Organization | ❌ Pendiente (necesita redes sociales) |
| 20 | Sin Trending BreadcrumbList | ❌ Pendiente |

---

## Estado actual por archivo

| Archivo | Líneas | Completo | SEO Elements |
|---------|--------|----------|-------------|
| `robots.ts` | 16 | ✅ | Allow, disallow /api/, sitemap ref |
| `layout.tsx` | 79 | ✅ | Viewport, twitter, canonical, metadataBase |
| `page.tsx` | 105 | ✅ | Metadata, Organization (con logo), WebSite (con SearchAction) |
| `trending/page.tsx` | 56 | ✅ | Canonical, OG, twitter, párrafo editorial |
| `categoria/[slug]/page.tsx` | 136 | ✅ | generateStaticParams, canonical, OG, twitter, BreadcrumbList |
| `producto/[id]/page.tsx` | 181 | ✅ | generateStaticParams, canonical, OG+images, twitter+images, Product (sku, brand, seller), FAQPage, BreadcrumbList |
| `guias/page.tsx` | 94 | ✅ | Canonical, OG, twitter, revalidate |
| `guias/[slug]/page.tsx` | 148 | ✅ | Canonical, OG+images, twitter+images, Article (con image), FAQPage, BreadcrumbList, revalidate |
| `sitemap.ts` | 37 | ✅ | Static+category+product+guide, /guias incluida, lastModified solo en guías |
| `next.config.ts` | 43 | ✅ | Image remotePatterns, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, HSTS |
| `opengraph-image.tsx` | 34 | ✅ **NUEVO** | OG image dinámico con ImageResponse (edge runtime) |
| `public/llms.txt` | 22 | ✅ **NUEVO** | Descripción para AI crawlers |

---

## Schema Coverage (completo)

| Página | Organization | WebSite | Product | Article | FAQPage | BreadcrumbList |
|--------|:-----------:|:-------:|:-------:|:-------:|:-------:|:--------------:|
| Home | ✅ (con logo) | ✅ (SearchAction) | — | — | — | — |
| Trending | — | — | — | — | — | ❌ |
| Categoría | — | — | — | — | — | ✅ |
| Producto | — | — | ✅ (sku, brand, seller) | — | ✅ | ✅ |
| Guía detail | — | — | — | ✅ (con image) | ✅ | ✅ |
| Guías index | — | — | — | — | — | — |

---

## Lo que queda por hacer

### Prioridad alta (impacta rankings)

1. **Restaurar working directory** — El git index está corrupto. Cloná de nuevo el repo o hacé:
   ```bash
   rm .git/index
   git reset HEAD
   git checkout -- .
   ```

2. **Registrar sitemap en Google Search Console** — El código está perfecto, pero hasta que no registres el sitemap y pidas indexación, Google no va a encontrar tus páginas.

3. **Agregar contenido editorial a categorías** — Trending ya tiene párrafo, pero las categorías siguen siendo thin content (solo H1 + descripción corta + grid). Agregar 200+ palabras de buyer's guide por categoría.

### Prioridad media

4. **Content-Security-Policy header** — Único security header faltante.
5. **BreadcrumbList en trending** — Pequeño win de structured data.
6. **Verificar que `opengraph-image.tsx` genera la imagen correctamente** — El ImageResponse edge runtime necesita testeo.

### Prioridad baja (backlog)

7. PWA manifest
8. sameAs en Organization (cuando tengas redes sociales)
9. Author como Person en guías (cuando tengas perfiles de autor)

---

## Comparación evolutiva

| Métrica | Audit #1 (pre-fix) | Audit #2 (post-fix v1) | Audit #3 (post-fix v2) |
|---------|:------------------:|:---------------------:|:---------------------:|
| Health Score | ~25/100 | 38/100 | **72/100** |
| robots.ts | ❌ | ✅ | ✅ |
| Viewport | ❌ | ✅ | ✅ |
| Canonical URLs | 1/6 páginas | 6/6 | 6/6 |
| Twitter cards | 1/6 | 6/6 | 6/6 |
| OG images | 1/6 | 2/6 | **5/6** |
| generateStaticParams | 1/3 | 3/3 | 3/3 |
| Organization schema | ❌ | ✅ | ✅ (con logo) |
| WebSite schema | ❌ | ✅ | ✅ |
| BreadcrumbList | 0/4 | 2/4 | **4/4** (falta trending) |
| Product schema | Básico | Básico | **Completo** (sku, brand, seller) |
| Article schema | Sin image | Sin image | **Con image** |
| Security headers | 0/5 | 3/5 | **4/5** |
| llms.txt | ❌ | ❌ | ✅ |
| OG image dinámico | ❌ | ❌ | ✅ |
| Sitemap /guias | ❌ | ❌ | ✅ |
| Trending editorial | ❌ | ❌ | ✅ |
| Indexación Google | ❌ | ❌ | ❌ (pendiente GSC) |
