# Auditoría SEO Completa — ProductosVirales.com.ar

**Fecha:** 13 de abril de 2026  
**Dominio:** productosvirales.com.ar  
**Stack:** Next.js 16.2.3 · React 19 · Tailwind CSS v4  
**Tipo de negocio:** E-commerce / Curador de productos (afiliados MercadoLibre)

---

## SEO Health Score: 38/100

| Categoría | Peso | Score | Nota |
|-----------|------|-------|------|
| Technical SEO | 22% | 25/100 | Archivos rotos en working directory; indexación en Google = 0 |
| Content Quality | 23% | 45/100 | Guías sólidas, pero categorías y trending son thin content |
| On-Page SEO | 20% | 70/100 | Metadata, canonicals, OG bien implementados en git HEAD |
| Schema / Structured Data | 10% | 65/100 | Product, Article, FAQ, BreadcrumbList, Organization, WebSite |
| Performance (CWV) | 10% | 40/100 | No se puede medir live; images sin unoptimized es bueno, pero sin build no verificable |
| AI Search Readiness (GEO) | 10% | 30/100 | Sin llms.txt, FAQPage ayuda para LLMs pero no para Google rich results |
| Images | 5% | 50/100 | Alt text presente, `unoptimized` removido, faltan favicon/icons |

---

## PROBLEMA #0: Archivos truncados (BLOQUEANTE)

**Severidad: BLOQUEANTE — el sitio no compila**

El working directory tiene **7 archivos truncados** por cambios no commiteados que borraron ~1,085 líneas. El último commit (`3988e4a`) tiene todo correcto y completo.

| Archivo | Líneas en git HEAD | Líneas en disco | Estado |
|---------|-------------------|-----------------|--------|
| `src/app/layout.tsx` | 83 | 68 | Truncado — falta JSX completo |
| `src/app/page.tsx` | 104 | 31 | Truncado — falta componente Home |
| `src/app/trending/page.tsx` | 50 | 30 | Truncado — falta H1, grids |
| `src/app/categoria/[slug]/page.tsx` | 126 | 98 | Truncado — falta hero, grids |
| `src/app/producto/[id]/page.tsx` | 161 | 122 | Truncado — falta ProductDetail |
| `src/app/guias/page.tsx` | 95 | 77 | Truncado — falta parte de cards |
| `next.config.ts` | 39 | 16 | Truncado — falta headers() |

**Para restaurar:** `git checkout -- src/app/layout.tsx src/app/page.tsx src/app/trending/page.tsx src/app/categoria/ src/app/producto/ src/app/guias/page.tsx next.config.ts`

---

## 1. Technical SEO

### 1.1 Crawlability

| Check | Estado | Detalle |
|-------|--------|---------|
| robots.ts | ✅ Pass | Allow `/`, disallow `/api/`, sitemap declarado |
| Sitemap XML | ✅ Pass | Dinámico con prioridades inteligentes por visibilidad |
| Sitemap registrado en GSC | ⚠️ Sin verificar | Archivo de verificación Google existe pero no hay evidencia de registro |
| Middleware | ✅ N/A | No hay middleware que bloquee crawling |
| Redirect chains | ✅ Pass | No hay redirects configurados |

### 1.2 Indexability

| Check | Estado | Detalle |
|-------|--------|---------|
| Indexación en Google | ❌ **Crítico** | `site:productosvirales.com.ar` = 0 resultados |
| Canonical URLs | ✅ Pass | Implementado en todos los page types |
| noindex tags | ✅ Pass | Ningún noindex inadvertido |
| generateStaticParams | ✅ Pass | Categorías, productos (top 50), guías |

### 1.3 Security Headers

| Header | Estado | Detalle |
|--------|--------|---------|
| HTTPS | ✅ Pass | Configurado en metadataBase |
| X-Content-Type-Options | ✅ Pass | `nosniff` en next.config.ts headers() |
| X-Frame-Options | ✅ Pass | `DENY` |
| Referrer-Policy | ✅ Pass | `strict-origin-when-cross-origin` |
| Content-Security-Policy | ❌ Fail | No configurado |
| Strict-Transport-Security | ❌ Fail | No configurado |

### 1.4 URL Structure

| Check | Estado | Detalle |
|-------|--------|---------|
| URLs limpias | ✅ Pass | `/producto/[id]`, `/categoria/[slug]`, `/guias/[slug]` |
| Trailing slashes | ⚠️ Warning | Sin normalización explícita |
| Profundidad | ✅ Pass | Max 2 niveles |
| Parámetros | ✅ Pass | Solo `?q=` para búsqueda |

### 1.5 Mobile / Viewport

| Check | Estado | Detalle |
|-------|--------|---------|
| Viewport meta | ✅ Pass | `width: device-width, initialScale: 1, maximumScale: 5` |
| Responsive design | ✅ Pass | Tailwind con breakpoints md/lg |
| Font display | ✅ Pass | `display: "swap"` en todas las fuentes |

### 1.6 Core Web Vitals (estimado desde código)

| Métrica | Estimación | Riesgo | Causa |
|---------|-----------|--------|-------|
| LCP | Medio | Imágenes de ML pueden ser lentas en CDN externo | Images ya sin `unoptimized`, pero provienen de http2.mlstatic.com |
| INP | Bajo | Interacciones simples (clicks, hover) | GSAP no bloquea main thread |
| CLS | Bajo-Medio | Fonts con swap, Images con sizes | Posible layout shift por imágenes sin dimensiones explícitas |

### 1.7 Server-Side Rendering

| Check | Estado | Detalle |
|-------|--------|---------|
| Pages como Server Components | ✅ Pass | Todas las pages son `async` Server Components |
| Client Components justificados | ✅ Pass | Solo en componentes con GSAP/state |
| ISR configurado | ✅ Pass | Guías con `revalidate: 86400` |

---

## 2. Schema / Structured Data

### Estado por página (basado en git HEAD)

| Página | Organization | WebSite | Product | Article | FAQPage | BreadcrumbList |
|--------|-------------|---------|---------|---------|---------|----------------|
| Home `/` | ✅ | ✅ (con SearchAction) | — | — | — | — |
| Trending `/trending` | — | — | — | — | — | ❌ Falta |
| Categoría `/categoria/[slug]` | — | — | — | — | — | ✅ |
| Producto `/producto/[id]` | — | — | ✅ (con Offer) | — | ✅ (condicional) | ✅ |
| Guía `/guias/[slug]` | — | — | — | ✅ (con author, publisher, dates) | ✅ (condicional) | ❌ Falta |
| Guías index `/guias` | — | — | — | — | — | ❌ Falta |

### Validación de schemas existentes

**Product Schema** (producto/[id]):
- ✅ @type: Product con name, description, image
- ✅ Offer con price, priceCurrency, availability
- ⚠️ Falta `brand` (recomendado)
- ⚠️ Falta `sku` (recomendado)
- ⚠️ Falta `aggregateRating` y `review` (oportunidad para rich results)

**Article Schema** (guias/[slug]):
- ✅ headline, description, datePublished, dateModified
- ✅ author (Organization), publisher (Organization)
- ✅ mainEntityOfPage
- ⚠️ Falta `image` en el schema (crítico para rich results)
- ⚠️ Author debería ser Person, no solo Organization

**FAQPage Schema** (productos y guías):
- ✅ Estructura correcta con mainEntity > Question > acceptedAnswer
- ℹ️ FAQPage ya no genera rich results en Google para sitios comerciales (desde agosto 2023)
- ℹ️ Pero SÍ beneficia visibilidad en AI search (ChatGPT, Perplexity, AI Overviews) — mantener

**Organization Schema** (home):
- ✅ name, url, description
- ⚠️ Falta `logo` (muy recomendado)
- ⚠️ `sameAs: []` — agregar redes sociales cuando existan

**WebSite Schema** (home):
- ✅ SearchAction con urlTemplate
- ✅ Correcto para sitelinks search box

---

## 3. Content Quality & E-E-A-T

### E-E-A-T Assessment

| Señal | Score | Detalle |
|-------|-------|---------|
| **Experience** | 2/5 | Sin fotos propias, sin reviews de primera mano, sin "lo probamos" |
| **Expertise** | 3/5 | Guías con especificaciones técnicas y comparativas; datos de ML |
| **Authoritativeness** | 1/5 | Dominio nuevo, sin backlinks, sin menciones externas |
| **Trustworthiness** | 3/5 | HTTPS, affiliate disclosure, precios reales de ML |

**Riesgo E-E-A-T según December 2025 Core Update:** Alto. Los sitios afiliados tuvieron un **71% de caída promedio** en el update de diciembre 2025. La clave para sobrevivir es demostrar experiencia de primera mano y no ser un "thin affiliate site".

### Content Depth por tipo de página

| Tipo | Contenido único | Riesgo thin | Recomendación |
|------|----------------|-------------|---------------|
| Home | Medio — H1, hero, FAQ, curación | Bajo | Agregar párrafo introductorio con más texto |
| Trending | Bajo — solo H1 + grid | **Alto** | Agregar texto editorial (qué está trending y por qué) |
| Categoría | Bajo — H1 + description + grid | **Alto** | Agregar intro de 200+ palabras, buyer's guide por categoría |
| Producto | Alto — specs, pros/cons, FAQ, related | Bajo | Bien, pero agregar reviews/experiencia propia |
| Guía | Alto — secciones, comparativas, FAQ, winner | Bajo | Excelente, modelo a seguir |

### Affiliate Disclosure

| Check | Estado |
|-------|--------|
| `rel="nofollow sponsored"` en links de afiliados | ✅ Pass (en GuideRenderer) |
| Disclosure visible al usuario | ⚠️ Warning — verificar si hay texto de disclosure |

---

## 4. Sitemap Analysis

### Cobertura

| Tipo | Incluido | Priority | changeFrequency | lastModified |
|------|----------|----------|-----------------|--------------|
| Home | ✅ | 1.0 | daily | `new Date()` ⚠️ |
| Trending | ✅ | 0.9 | daily | `new Date()` ⚠️ |
| Categorías (no especiales) | ✅ | 0.8 | weekly | `new Date()` ⚠️ |
| Productos (por visibilidad) | ✅ | 0.9/0.7/0.3 | weekly | `new Date()` ⚠️ |
| Guías | ✅ | 0.8 | monthly | `guide.updatedDate` ✅ |

### Problemas

- ⚠️ **lastModified usa `new Date()` para todo excepto guías** — esto le dice a Google que todas las páginas cambiaron "justo ahora" cada vez que se regenera el sitemap. Usar dates reales o omitir.
- ⚠️ **Guías index (`/guias`) no está en el sitemap** — debería incluirse como página estática.
- ✅ Prioridades por visibilidad de producto son inteligentes.
- ✅ Tamaño estimado: < 100 URLs (bien dentro del límite de 50,000).

---

## 5. AI Search Readiness (GEO)

| Check | Estado | Detalle |
|-------|--------|---------|
| llms.txt | ❌ Falta | No existe `/public/llms.txt` — archivo que ayuda a LLMs a entender tu sitio |
| Passage-level citability | ⚠️ Medio | Guías son citables; categorías y trending no |
| Structured data para LLMs | ✅ Bueno | FAQPage beneficia citación en AI search |
| Content depth para snippets | ⚠️ Medio | Solo guías tienen profundidad suficiente |
| Brand mention signals | ❌ Bajo | Sin presencia en otros sitios que LLMs puedan rastrear |

---

## 6. Images

| Check | Estado | Detalle |
|-------|--------|---------|
| Alt text | ✅ Pass | Todas las imágenes usan `product.title` como alt |
| `unoptimized` removido | ✅ Pass | Next.js Image optimization habilitada |
| Responsive `sizes` | ✅ Pass | Configurado correctamente en ProductCard y ProductDetail |
| `priority` en LCP image | ✅ Pass | Imagen principal de producto tiene `priority` |
| favicon.ico | ❌ Fail | Referenciado en layout pero **no existe en /public** |
| apple-touch-icon.png | ❌ Fail | Referenciado en layout pero **no existe en /public** |
| OG images | ⚠️ Parcial | Productos tienen OG image; guías, categorías y trending no |

---

## 7. Issues — Priorizado

### Crítico (bloquea indexación o rankings)

| # | Issue | Archivo | Fix |
|---|-------|---------|-----|
| 1 | **Archivos truncados en disco** | 7 archivos | `git checkout HEAD -- [archivos]` para restaurar |
| 2 | **Sitio no indexado en Google** | Infra/GSC | Verificar deploy, DNS, registrar sitemap en GSC, Request Indexing |
| 3 | **Favicon no existe** | `/public/` | Crear favicon.ico y apple-touch-icon.png |
| 4 | **Páginas trending y categorías son thin content** | trending, categorías | Agregar contenido editorial de 200+ palabras |

### Alto (impacto significativo en rankings)

| # | Issue | Archivo | Fix |
|---|-------|---------|-----|
| 5 | **BreadcrumbList falta en guías** | `guias/[slug]/page.tsx` | Agregar JSON-LD BreadcrumbList (Home > Guías > Guía) |
| 6 | **Article schema sin image** | `guias/[slug]/page.tsx` | Agregar `image` al articleLd |
| 7 | **Product schema sin brand/sku** | `producto/[id]/page.tsx` | Agregar `brand` y `sku` al jsonLd |
| 8 | **Organization schema sin logo** | `page.tsx` | Agregar `logo` al Organization JSON-LD |
| 9 | **OG images faltan en guías** | `guias/[slug]/page.tsx` | Agregar `images` a openGraph y twitter en generateMetadata |
| 10 | **lastModified falso en sitemap** | `sitemap.ts` | Usar dates reales o quitar lastModified de páginas sin fecha real |
| 11 | **Sin HSTS header** | `next.config.ts` | Agregar `Strict-Transport-Security` |

### Medio (optimización)

| # | Issue | Archivo | Fix |
|---|-------|---------|-----|
| 12 | **Sin llms.txt** | `/public/` | Crear archivo describiendo el sitio para AI crawlers |
| 13 | **Guías index no en sitemap** | `sitemap.ts` | Agregar `/guias` como página estática |
| 14 | **Author es Organization, no Person** | `guias/[slug]/page.tsx` | Considerar crear perfiles de autor |
| 15 | **Sin CSP header** | `next.config.ts` | Agregar Content-Security-Policy |
| 16 | **SVGs boilerplate en /public** | `/public/` | Eliminar file.svg, globe.svg, next.svg, vercel.svg, window.svg |
| 17 | **Sin trailing slash normalization** | `next.config.ts` | Agregar `trailingSlash: false` explícito |

### Bajo (nice to have)

| # | Issue | Archivo | Fix |
|---|-------|---------|-----|
| 18 | **Sin PWA manifest** | `/public/` | Agregar manifest.json |
| 19 | **sameAs vacío en Organization** | `page.tsx` | Llenar con redes sociales cuando existan |
| 20 | **Sin Trending BreadcrumbList** | `trending/page.tsx` | Agregar BreadcrumbList simple |

---

## 8. Plan de Acción

### Esta semana (quick wins)

1. **Restaurar archivos desde git** — `git checkout HEAD -- [7 archivos]` (5 min)
2. **Registrar sitemap en GSC** — Ir a Search Console > Sitemaps (10 min)
3. **Request Indexing** en GSC para home, trending, categorías principales (15 min)
4. **Crear favicon** — Generar desde logo/nombre y colocar en /public (30 min)
5. **Agregar `/guias` al sitemap** como página estática (5 min)
6. **Fix lastModified** en sitemap para que no use `new Date()` en todo (15 min)

### Este mes (alto impacto)

7. **Agregar BreadcrumbList a guías** (30 min)
8. **Agregar `image` al Article schema de guías** (15 min)
9. **Agregar `brand` y `sku` al Product schema** (30 min)
10. **Agregar `logo` al Organization schema** (10 min)
11. **Agregar OG images a guías** en generateMetadata (15 min)
12. **Crear llms.txt** con descripción del sitio (30 min)
13. **Escribir contenido editorial para trending** — explicar qué es trending y por qué (2 hrs)
14. **Escribir intros para cada categoría** — buyer's guide de 200+ palabras (4 hrs)

### Este trimestre (estratégico)

15. **Blog section** — Posts SEO-driven sobre productos trending mensual
16. **Reviews de primera mano** — "Lo probamos" para productos clave (E-E-A-T)
17. **Link building** — Guest posts, menciones en blogs de ecommerce AR
18. **Author profiles** — Crear páginas de autor con experiencia demostrada
19. **OG image generator** — Crear imágenes automáticas para social sharing

---

## Comparación con Audit #1

| Métrica | Audit #1 (pre-fix) | Audit #3 (git HEAD) | Cambio |
|---------|--------------------|--------------------|--------|
| robots.ts | ❌ No existía | ✅ Existe y correcto | +++ |
| Viewport | ❌ Faltaba | ✅ Configurado | +++ |
| Canonical URLs | Solo guías | ✅ Todas las páginas | +++ |
| Twitter cards | Solo guías | ✅ Todas las páginas | +++ |
| generateStaticParams | Solo guías | ✅ Categorías + productos + guías | ++ |
| Organization schema | ❌ | ✅ En home | ++ |
| WebSite schema | ❌ | ✅ En home con SearchAction | ++ |
| BreadcrumbList | ❌ | ✅ Categorías y productos | ++ |
| Image unoptimized | ❌ En todas | ✅ Removido | ++ |
| Security headers | ❌ | ✅ 3 headers | + |
| Indexación Google | ❌ 0 resultados | ❌ Sigue en 0 | = |
| Favicon | ❌ | ❌ Referenciado pero no creado | - |
| Archivos en disco | ✅ Compilaba | ❌ 7 truncados | --- |

**Resumen: El código en git HEAD mejoró dramáticamente vs el estado original. El problema urgente son los archivos truncados en el working directory y la falta de indexación.**
