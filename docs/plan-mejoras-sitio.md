# Plan de mejoras del sitio (auditorías Codex + Gemini, 2026-07-11)

Síntesis de las dos auditorías técnicas (Codex = arquitectura/perf/seguridad; Gemini = diseño/CRO/descubribilidad) cruzada con los hallazgos de GSC. Los dos convergen en lo mismo desde ángulos opuestos: **enlazado interno débil (Gemini) + páginas lentas (Codex) = las dos palancas de DA1**, y explican por qué guías fuertes están clavadas en posición ~9.

Orden por impacto/esfuerzo. Nada del stack base se toca sin OK de Juan (regla 4 de CLAUDE.md).

---

## Tier 1 — Plata rápida de afiliado (bajo–medio esfuerzo, bajo riesgo)

- [x] **1.1 Botón de afiliado más grande en mobile** ✅ 2026-07-11 (44×44 mobile / 40×40 desktop, icono 16px)
  - Por qué: hoy es un ícono de 32×32px (`w-8 h-8`), muy chico para el pulgar → se pierden clicks (= comisiones) por fricción física. Estándar accesible: 44×44.
  - Archivos: `src/components/products/ProductCard.tsx`.
  - Pasos: en mobile, botón full-width (o mínimo 44×44); opcional, que tap en el precio también sea link al afiliado.
  - Riesgo: **bajo** (CSS/markup). Verificar en preview mobile.

- [x] **1.2 PriceHistoryChart prominente en la ficha** ✅ 2026-07-11 (promovido a primera sección tras el buy box, full-width legible)
  - Por qué: prueba social tipo CamelCamelCamel ("precio más bajo en 3 meses") → derriba la duda de compra y genera recurrencia (la gente vuelve a chequear si el precio de ML es "verdad").
  - Archivos: `src/components/products/ProductDetail.tsx` (subirlo above the fold), `src/components/widgets/PriceHistoryChart.tsx` (ya existe), datos en `src/data/price-history.json`.
  - Pasos: reposicionar el chart; estado vacío elegante cuando hay <2 puntos.
  - Riesgo: **bajo**. Ojo: `price-history.json` empezó a alimentarse el 2026-07-09 (Bright Data 3x/semana), todavía hay poca densidad por producto → priorizar productos con historial.

- [~] **1.3 PriceAlert + motor de alertas por email** — 🟡 Código completo 2026-07-11, falta activación de Juan.
  - **Captura:** widget guarda el lead (`/api/subscribe`, `source: "price-alert"`, loading/error/timeout/lock/a11y, copy honesto). Sumado a las 21 fichas sin stock ("avisame cuando vuelva", `ref = productId`).
  - **Motor:** `scripts/notify-price-drops-email.cjs` (dry-run/`--send`) manda las bajas de cada corrida de Bright Data a los suscriptores `price-alert` vía Resend, con link de afiliado. Baja de suscripción: `/api/unsubscribe` + HMAC (`src/lib/unsubscribe-token.ts`) + migración `003`. Paso agregado al workflow `update-prices-brightdata`.
  - **FALTA (Juan) para activarlo:** (1) cuenta Resend + verificar dominio `productosvirales.com.ar`; (2) secrets en **GitHub Actions**: `RESEND_API_KEY`, `EMAIL_FROM`, `UNSUBSCRIBE_SECRET` (aleatorio), `DATABASE_URL` (el de Neon); (3) el MISMO `UNSUBSCRIBE_SECRET` + `DATABASE_URL` en **Vercel** (para `/api/unsubscribe`); (4) correr la migración `scripts/db/003_subscribers_unsubscribe.sql` en Neon.
  - Por qué: la feature más alineada con recurrencia y afiliados; máquina de plata en Hot Sale / Black Friday. Hoy `PriceAlert` solo setea estado local, no guarda nada.
  - Archivos: `src/components/widgets/PriceAlert.tsx`, `src/app/api/subscribe/` (YA existe), Neon (`subscribers` ya existe; falta `price_watches`).
  - Pasos: (a) form que postee a `/api/subscribe` con `source: "price-alert"` + `productId`; (b) tabla `price_watches` en Neon; (c) enganchar al pipeline de precios que YA corre (Bright Data 3x/semana) para disparar la alerta con el link de afiliado por email (Resend) o Telegram.
  - Riesgo: **medio** (toca Neon + cron + Resend). NO usar API de ML (bloqueada) — usar el flujo Bright Data existente.

---

## Tier 2 — Estructural SEO / enlazado interno (medio) — la mayor palanca DA1

- [x] **2.1 Categorías como links reales (matar "categorías fantasma")** ✅ 2026-07-11 (dropdown en Header con los 10 hubs como links reales; `category-nav.ts` liviano; a11y con `inert` tras audit de Codex)
  - Decisión (Juan, 2026-07-11): los **CategoryTabs de la home se quedan como filtro** del feed (no navegan a los hubs). La crawlabilidad de los hubs ya la cubre el dropdown del Header en toda página.
  - Por qué: los `CategoryTabs` de la home son botones de React con `onClick`, **no links `<a>`** → Google no puede crawlear los hubs `/categoria/[slug]` desde la home y quedan huérfanos. El Header además hardcodea `/categoria/belleza`. Enlazado interno = palanca #1 de DA1; conecta directo con el "por qué posición 9".
  - Archivos: `CategoryTabs` (home feed), `src/components/layout/Header.tsx`.
  - Pasos: (a) tabs → `<Link href="/categoria/[slug]">` o que actualicen `?cat=slug`; (b) Header: dropdown "Categorías" con TODOS los hubs (pasa link juice desde el header a todo el sitio).
  - Riesgo: **medio** — toca navegación/home. Mantener el filtrado actual funcionando (pasar a URL-driven sin romper la UX).

- [x] **2.2 Trending pills al buscador interno (frenar fuga de link juice)** ✅ 2026-07-11 (pills → `/?q=` interno con `<Link>`; términos curados a nuestro catálogo; ya no van a mercadolibre.com.ar)
  - Por qué: `TrendingBar`/`TrendingPills` linkean directo a `listado.mercadolibre.com.ar` → echás al usuario y a Google fuera del sitio en el primer pantallazo, sin pasar por el embudo.
  - Archivos: `src/components/.../TrendingBar.tsx`, `TrendingPills.tsx`.
  - Pasos: apuntar a `/buscar?q=...` interno (depende de 2.3).
  - Riesgo: **bajo–medio**.

- [ ] **2.3 Buscador interno `/buscar` con filtros reales**
  - Por qué: retención, más páginas indexables, y destino para las trending pills. Los dos auditores lo piden. Ya existe `/api/search`.
  - Archivos: nueva ruta `src/app/buscar/page.tsx` (server), índice server-only desde `curated-products` (NO búsqueda client sobre todo el catálogo).
  - Pasos: página server con filtros (categoría, precio, rating, envío, priceStatus, descuento, orden).
  - Riesgo: **medio** (feature nueva). Cuidar de no meter el catálogo entero al cliente (ligado a 3.1).

---

## Tier 3 — Técnico de fondo (medio–alto) — levanta el piso de TODO

- [x] **3.1 Sacar el catálogo del bundle cliente (P0 de Codex)** ✅ 2026-07-11 — chunk del catálogo **3,71 MB → 0,22 MB**. HomeFeed recibe DTOs (`toFeedCard`); StickyBuyBar recibe DTO desde GuideRenderer; ProductDetail usa un parser markdown client-safe (`inline-markdown.tsx`) con los tokens de precio resueltos en el server. Verificado: chequeo transitivo limpio + home/ficha/guía andan.
  - Por qué: hay un chunk JS de ~3,7 MB con el catálogo entero (IDs, affiliateUrl, articleBody) porque componentes client importan `curated-products.ts` (~4 MB) y `guides.ts` (~2,2 MB). Mata Core Web Vitals → techo de ranking + UX lenta.
  - Archivos: `src/components/feed/HomeFeed.tsx` (`"use client"` importa `getRotatedVisibleProducts`), `src/lib/products.ts`, `src/app/page.tsx`, `src/components/guides/StickyBuyBar.tsx`, `QuickPicks.tsx`.
  - Pasos: páginas server resuelven productos y pasan DTOs chicos (ya existe `CardProduct` en `types.ts` justo para esto); los componentes client reciben props, no importan la data.
  - Riesgo: **medio–alto** — toca la arquitectura de datos + home. Requiere avisar antes (regla 4). Verificar con `npm run build` + preview.

- [ ] **3.2 `ProductDetail` → RSC + islas cliente**
  - Archivos: `src/components/products/ProductDetail.tsx`.
  - Pasos: contenido, tablas, pros/cons, reviews, FAQ y JSON-LD en server; dejar client solo `ProductGallery`, `PriceHistoryChart`, `ShareButtons`, `StickyMobileCta`. Reemplazar GSAP por CSS transitions o import dinámico.
  - Riesgo: **medio–alto**.

- [ ] **3.3 Home cacheable**
  - Archivos: `src/app/page.tsx` (usa `Math.random()` en `makeRotationSeed()` + `searchParams` → request-driven).
  - Pasos: seed diario determinístico + `revalidate = 86400`; mover búsqueda a `/buscar`.
  - Riesgo: **medio**.

---

## Mantenimiento / aparte (bajo esfuerzo, cuando haya hueco)

- [ ] **Seguridad:** rotar los OAuth tokens y secrets locales (`scripts/gsc/token.json`, `scripts/ga4/token.json`, `scripts/gsc/client_secret.json`, `scripts/keyword-planner/google-ads.yaml`) y cambiar el `*.json` global del `.gitignore` por ignores específicos (para no esconder archivos nuevos sin querer). Están gitignoreados (no se suben), pero conviene rotarlos.
- [ ] **Imágenes:** `<img>` crudo → `next/image` en `QuickPicks`, `guides/ProductCard`, `StickyBuyBar` (control de CLS y formatos).
- [x] **Accesibilidad:** ✅ 2026-07-11 — `MobileNav` con `role="dialog"`/`aria-modal`/foco al abrir/`inert` al cerrar/Escape (+ unificado a los 10 hubs); `aria-label` en el botón limpiar de `SearchInput`; `aria-expanded`/`aria-haspopup` en el hamburguesa. (Falta focus-trap completo; nice-to-have.)
- [ ] **CSP:** sacar `unsafe-eval`/`unsafe-inline` pasando GA/Clarity a nonce o componentes controlados (`next.config.ts`).
- [ ] **URL base:** centralizar en `src/lib/site.ts` (`SITE_URL`, `absoluteUrl(path)`) y usarlo en sitemap, metadata, guide-url, llms, JSON-LD.

---

## Secuencia recomendada

1. **Tier 1 completo** primero — visible, bajo riesgo, plata de afiliado directa. Arrancar por 1.1 (trivial) y 1.2 (alto valor/bajo riesgo); 1.3 como mini-proyecto aparte.
2. **2.1 (categorías como links)** — la mayor palanca DA1, y no depende de guías frescas.
3. **3.1 + 2.3 juntos** — sacar el catálogo del cliente y montar el buscador server-side comparten el mismo trabajo (índice server-only). Es el proyecto técnico de fondo; se planifica y ejecuta con OK explícito.

> Nota: las optimizaciones on-page de guías por posición (freidora, estufas) quedan para cuando maduren — no se re-optimizan guías frescas. Para eso está `gsc.py oportunidades`.
