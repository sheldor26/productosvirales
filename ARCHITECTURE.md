# Arquitectura — ProductosVirales

Snapshot técnico. Apunta a explicar **qué hay y por qué** antes de cambiar algo.

## Stack

| Capa | Tecnología | Versión | Por qué |
|------|------------|---------|---------|
| Framework | Next.js (App Router) | 16.2.3 | SSG + ISR para SEO. Soporta sitemap/robots/metadata como código. |
| UI | React | 19.2 | Lo que pide Next 16. |
| Estilos | Tailwind v4 + `@tailwindcss/typography` | 4.x | Sin CSS custom global salvo `globals.css`. |
| Componentes accesibles | Radix UI (`dialog`, `dropdown-menu`, `tooltip`) | 1.x | Headless, sin lock-in visual. |
| Animaciones | GSAP + `@gsap/react` | 3.14 | Migrado desde Framer Motion (ver `GSAP_MIGRATION.md` si reaparece). |
| Iconos | `lucide-react` | 1.x | |
| Tema oscuro/claro | `next-themes` | 0.4 | |
| Scraping | Puppeteer | 24.x | Solo en scripts y `/api/scrape` (dev-only). |
| Imágenes | `next/image` + `sharp` | — | `sharp` para generar OG. Dominios remotos: `*.mlstatic.com`. |
| Analytics | `@vercel/analytics` | 2.x | |
| Hosting | Vercel | — | |

**No hay base de datos.** El contenido se versiona en git como TypeScript.

## Estructura de carpetas

```
src/
  app/              App Router. Rutas:
    page.tsx          → / (home con feed)
    guias/            → /guias y /guias/[slug]
    producto/[slug]   → /producto/<slug-mla-id>
    categoria/[slug]  → /categoria/<slug>
    trending/         → ranking
    sobre-nosotros, privacidad, terminos
    api/              → /api/import, /api/scrape, /api/search,
                        /api/subscribe, /api/trends
    sitemap.ts, robots.ts, opengraph-image.tsx, layout.tsx
  components/
    feed/             home (HomeFeed, HeroBanner, TrendingBar...)
    products/         tarjetas, grid, detalle, galería
    guides/           renderer de artículos + TOC + reading progress
    layout/           Header, Footer, MobileNav, ThemeProvider
    ui/               primitivos (Badge, Button, Skeleton, SearchInput)
    widgets/          DiscountBadge, PriceAlert, TikTokBadge, WhatsAppCTA
    affiliate/        AffiliateLink (link con tracking)
  data/
    curated-products.ts   ← catálogo de productos (170 entradas)
    guides.ts             ← artículos publicados (46 guías)
    categories.ts         ← categorías top-nivel del feed
    guides-freidoras-additions.ts
  lib/
    types.ts              Product, Guide, GuideSection, Category, MLItem...
    products.ts           getVisibleProducts, getProductById, sitemap helper
    product-url.ts        slug canónico /producto/<title>-<mla-id>
    slug.ts               slugify + ensureSectionIds + getTocItems
    reading-time.ts       cálculo de minutos de lectura
    api-auth.ts           guard x-pv-secret para /api/*
    mercadolibre.ts       cliente API ML (opcional, via OAuth)
    scraper.ts            wrapper Puppeteer
    parse-inline-links.tsx  renderer de [texto](url) dentro de párrafos
    utils.ts              cn, formatPrice, formatDiscount, truncate
    gsap-config.ts        registro de plugins GSAP
public/
  guias/                  imágenes por guía
  images/                 imágenes generales
  llms.txt, favicons, og default
scripts/                  utilidades node (CJS y TS). Ver más abajo.
docs/
  ARTICLE_CREATION_WORKFLOW.md
  clusters/
    freidoras-de-aire/    borradores editoriales + script de conversión
    perfumes-arabes/      borradores + plantillas + roadmap (NEXT_ARTICLES.md)
```

## Modelo de datos (en `src/lib/types.ts`)

- `Product` — id MLA, precios (con `priceStatus: fresh|stale|out_of_stock`), imagen, categoría, copia editorial (pros/cons/verdict/articleBody/faq/specs/structuredData), `visibility: featured|normal|deprioritized`, y metadata extendida para perfumes (notas olfativas, duración, proyección, etc.).
- `Guide` — slug, categoría editorial (distinta de las categorías del feed), `publishedDate`/`updatedDate`, `intro[]`, `sections[]` (bloques tipados: `p`, `h2`, `h3`, `table`, `list`, `image`, `image-grid`, `product-card`, `callout`, `pull-quote`, `verdict`, `warning`, `bad`, `card`, `toc`, `trust-block`), `faq[]`, `internalLinks[]`, `quickPicks[]`.
- `Category` — categoría del feed (hogar, cocina, tech, belleza, viral) con `mlCategoryId` y `buyersGuide` (HTML inline).

## Decisiones tomadas

1. **Contenido en TypeScript, no en CMS.** Versionado en git, sin caída por DB, type-safe. Trade-off: editar requiere abrir el repo.
2. **URLs canónicas de producto: `/producto/<slug-titulo>-<MLAID>`.** Slug humano + ID al final → SEO + lookup O(1). Legacy `/producto/MLA12345` sigue resolviendo y redirige (`parseProductSlug` en `lib/product-url.ts`).
3. **`visibility: "deprioritized"`** oculta de feeds/sitemap pero deja la URL accesible — preserva long-tail SEO de productos descontinuados.
4. **ISR diaria** en `/guias` y `/guias/[slug]` (`revalidate = 86400`) para que las guías agendadas (`publishedDate` futura) salgan automáticamente.
5. **Filtro `publishedDate <= hoy`** en `getPublishedGuides()` — permite agendar artículos sin esconderlos manualmente.
6. **CSP y headers de seguridad** definidos en `next.config.ts` (HSTS, X-Frame-Options DENY, CSP estricto). Dominios permitidos para imágenes: `http2.mlstatic.com`, `*.mlstatic.com`.
7. **APIs internas (`/api/import`, `/api/scrape`, `/api/search`, `/api/trends`) gated por `PV_API_SECRET`** via header `x-pv-secret` en producción (`lib/api-auth.ts`).
8. **Scraping en producción off por defecto.** `/api/scrape` requiere `ENABLE_SCRAPE=true` en Vercel.
9. **MercadoLibre sin API por defecto.** `ML_IMPORT_SOURCE=scraper` usa Puppeteer; modo API existe en `lib/mercadolibre.ts` si hay token.
10. **JSON-LD Product offers con `priceValidUntil`** (30 días desde `priceLastChecked`) — requisito Google para rich results.
11. **`noindex` en home cuando `?q=` está presente** — evita indexar páginas de búsqueda internas.
12. **Tipografía:** `Plus_Jakarta_Sans` (UI), `DM_Sans` (texto), `Dancing_Script` (display). Cargadas vía `next/font` con `display: optional` (no bloquea render).

## Scripts útiles

```bash
npm run dev                        # next dev
npm run build                      # next build
npm run lint                       # eslint
npm run prices:check  -- --match <slug>   # dry-run precios desde ML
npm run prices:update -- --match <slug>   # aplica precios a curated-products.ts
```

Scripts más específicos en `scripts/` (importar perfumes, freidoras, optimizar OG, batch scrape, marcar precios stale, etc.). Son CLIs de un solo uso, no parte del runtime.

## Flujo de un cambio típico

- **Subir un producto nuevo** → script de import (`scripts/ml-product-importer.ts` o equivalente del cluster) → revisar entrada en `curated-products.ts` → `npm run build`.
- **Publicar una guía** → borrador en `docs/clusters/<cluster>/` → convertir/copiar a objeto `Guide` en `src/data/guides.ts` → revisar `internalLinks` no rotos → `npm run build`.
- **Actualizar precios** → `npm run prices:update -- --match <pattern>`.
- **Deprecar un producto** → marcarlo `visibility: "deprioritized"` (no borrar).

## Variables de entorno (ver `.env.example`)

- `PV_API_SECRET` — gatekeeper de `/api/*` en prod.
- `ENABLE_SCRAPE` — habilita `/api/scrape` en prod (default `false`).
- `ML_IMPORT_SOURCE` — `scraper` (default) o `api`.
- `ML_SCRAPER_HEADFUL`, `ML_SCRAPER_PROFILE_DIR` — para resolver desafíos de seguridad de ML.
- `ML_ACCESS_TOKEN`, `ML_REFRESH_TOKEN`, `ML_APP_ID`, `ML_SECRET` — solo si se usa la API de ML.
- `NEXT_PUBLIC_SITE_URL` — usado por `sitemap.ts`, `robots.ts`, canonicals y OG.
- `NEXT_PUBLIC_GA_ID` — opcional.

## Lo que NO existe (a propósito)

- Sin base de datos.
- Sin sistema de auth de usuarios.
- Sin checkout — todo va a MercadoLibre por afiliado.
- Sin CMS — el contenido se edita en código.
- Sin framework de tests automatizados todavía. La verificación principal es `npm run build` (chequea tipos) + revisar el cambio en `next dev`.
