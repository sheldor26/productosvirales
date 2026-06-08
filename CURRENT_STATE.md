# Estado actual

> Snapshot del proyecto. Se actualiza al final de cada sesión.
> Última actualización: 2026-06-08 (ficha Kärcher RCV 1 enriquecida full SEO).

## Catálogo

- **~186 productos** en `src/data/curated-products.ts` (170 + 6 Panini + 10 aspiradoras robot nuevas).
- Categorías nuevas: **`coleccionables`** (6 Panini Mundial 2026) y **`aspiradoras-robot`** se sirve vía categorySlug `hogar` para las 18 fichas de robots.
- Productos featured: TCL 43S5K (Smart TV 43" — top del catálogo).
- Precios trackeados con `priceUpdated` + `priceLastChecked` + `priceStatus`.
- Última actualización de precios: 8 aspiradoras robot (2026-06-06).
- **Importación por API oficial de ML validada** (OAuth client_credentials) — ver memoria `ml-api-oficial-funciona`. Credenciales en `.env` local. Sin bloqueos/CAPTCHA.
- **Ficha Kärcher RCV 1 (MLA42103831) enriquecida (08-jun):** de placeholder a ficha completa con SEO real (seoTitle/meta/H1/OG con keywords de `Keywords/Aspiradoras Robot`), `rating` 4.5 / `reviewCount` 115, `articleBody` (6 H2), `specs` (18), `faq` (9 → FAQPage), 7 `customerReviews` reales, `structuredData` Product+Offer+aggregateRating, y 3 links internos a robots reales (2 Atma + Xiaomi S40c). Ángulo honesto: robot de mantenimiento sin WiFi/mapeo. Texto pasado por humanizer.
- **Ficha Samsung Jet Bot+ (MLA26504431) enriquecida (08-jun):** mismo tratamiento full SEO. `rating` 4.6 / `reviewCount` 11, `articleBody` (7 H2), `specs` (20), `faq` (9), 6 `customerReviews` reales (incluye 1★), `structuredData` completo. Ángulo: robot premium con mapeo LiDAR + autovaciado. 5 links internos (RCV 1, Powerbot E, Xiaomi S40 Pro). **OJO precio:** actualicé `price` de 1.300.000 → **3.476.040** (valor que pasó Juan); CONFIRMAR cuál es el correcto.

## Guías publicadas / agendadas

- **61 guías totales** en `src/data/guides.ts` (54 + 7 nuevas de aspiradoras robot).
- Distribución por tema:
  - `freidoras-de-aire`: 23 (varias agendadas a futuro)
  - `pavas-electricas`: 11 (4 agendadas)
  - `perfumes-arabes`: 14 (6 originales + 8 nuevas de fase 2)
  - `masajeadores`: 10 (4 nuevas 08-jun: masajeador [pillar head term 49.5K/dif 13], pistola-masajeadora, masajeador-espalda-cuello, masajeador-electrico)
  - `aspiradoras-robot`: **7** (red nueva, todas live desde 06-jun)

### Red aspiradoras robot — completa ✅ (06-jun)

| # | Slug | Tipo |
|---|---|---|
| 1 | robot-aspiradora | HUB pilar (3.673 palabras) |
| 2 | mejores-robot-aspiradora-trapeadora | Ranking |
| 3 | robot-aspiradora-precio-argentina | Precios |
| 4 | robot-aspiradora-xiaomi | Marca |
| 5 | robot-aspiradora-gadnic | Marca |
| 6 | robot-aspiradora-con-mapeo-laser | Feature |
| 7 | como-funciona-robot-aspiradora | Informacional |

18 fichas de aspiradoras robot en el catálogo. Doc maestro: `docs/nichos/aspiradoras-robot.md`.

### Cluster perfumes árabes — Fase 2 cerrada ✅

| # | Slug | Fecha | Estado |
|---|---|---|---|
| 1 | perfumes-arabes-originales | 26-may | ✅ Live |
| 2 | donde-comprar-perfumes-arabes-argentina | 26-may | ✅ Live |
| 3 | lattafa-guia-marca | 29-may | Agendado |
| 4 | perfumes-arabes-por-color | 1-jun | Agendado |
| 5 | perfumes-arabes-dupes | 4-jun | Agendado |
| 6 | perfumes-arabes-mas-vendidos-argentina | 7-jun | Agendado |
| 7 | lattafa-asad-comparativa | 10-jun | Agendado |
| 8 | donde-comprar-perfumes-arabes-buenos-aires | 13-jun | Agendado |

Cierre del cluster: 13 de junio 2026.

### Cola de freidoras agendadas (no escritas por Claude)

10 guías agendadas entre 27-may y 02-jul. Estado:
- Ninguna tiene `product-card` ni `quickPicks` (deuda estructural).
- 12 sin `ogTitle`/`ogDescription` (chip flageado para upgrade).
- 4 con fixes ya aplicados (powerxl, economicas, desventajas, ninja).

### Cola de pavas eléctricas agendadas

4 guías agendadas entre 30-may y 20-jun. Mismo patrón: sin product-cards.

## Configuración del proyecto

- Next.js 16.2.3, React 19, Tailwind v4, TypeScript estricto.
- Sin DB. Contenido en `src/data/*.ts`.
- ISR diaria en `/guias` y `/guias/[slug]` (revalidate 86400).
- Filtro `publishedDate <= hoy` en `getPublishedGuides()`.
- CSP estricto y headers de seguridad en `next.config.ts`.
- Hook Stop activo: pide actualizar SESSION_LOG, CURRENT_STATE, MISTAKES, LEARNINGS al cerrar sesión.

## Reglas editoriales activas

Documentadas en `docs/POST_MASTER_STRUCTURE.md`:
- **Links a productos en texto**: directo a meli.la (afiliado).
- **Links entre guías**: URL interna (`/guias/...`) — SEO interno editorial.
- **product-card componente**: ya configurado óptimo (CTA principal a ML).
- **Cadencia de publicación recomendada**: 3 días entre artículos del mismo cluster.

## Métricas SEO (último GSC export — 26-may, últimos 3 meses)

- Top 4 guías por clicks: atma-freidoras-de-aire-review (18), home (13), mejores-freidoras-de-aire-argentina (7), masajeador-cervical (6).
- 4 guías optimizadas en GSC esperando re-indexación:
  - philips-freidoras-de-aire-review (CTR 0.49% → mejorada con metadata nueva)
  - atma-vs-peabody-freidora-de-aire (pos 4.96 → mejorada con respuesta directa)
  - masajeador-cervical (pos 26.58 query genérica → mejorada)
  - perfumes-arabes-mujer (pos 14.89 → og diferenciado + respuesta directa)

## Chips abiertos (deuda flageada para sesiones futuras)

1. **Lint cleanup**: 41 errores ESLint preexistentes en archivos como Header.tsx, slug.ts, ProductCard.tsx.
2. **Normalización de links históricos**: ~112 links inline `/producto/...` en guías viejas → convertir a meli.la siguiendo la regla nueva.
3. **Upgrade ogTitle/ogDescription**: 11 guías en cola sin estos campos.

## Próximas decisiones esperando a Juan

- Pedir reindexación en GSC de las 2 guías de fase 2 que ya salieron (perfumes-arabes-originales, donde-comprar-perfumes-arabes-argentina).
- Decidir si arrancar con mejoras de sitio (12 ideas en SESSION_LOG, top 3: sticky CTA mobile, hero featured, price drop alerts).
- Definir próximo cluster temático cuando perfumes árabes esté completamente publicado (limpiavidrios fue mencionado en commits previos como candidato).
- Medir impacto SEO de fase 2 a partir del ~16-jun (3 semanas desde la primera publicación).

## Salud del proyecto

- ✅ Build verde: `npm run build` pasa sin errores en 2.6-3.0s.
- ⚠️ Lint: 41 errores preexistentes (flageados, no son regresión).
- ✅ Working tree clean.
- ✅ Branch up-to-date con `origin/master`.
- ✅ Master Structure consolidado y aplicado consistentemente en los 8 guides nuevos.
