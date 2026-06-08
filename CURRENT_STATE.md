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
- **Ficha Samsung Jet Bot+ (MLA26504431) enriquecida (08-jun):** mismo tratamiento full SEO. `rating` 4.6 / `reviewCount` 11, `articleBody` (7 H2), `specs` (20), `faq` (9), 6 `customerReviews` reales (incluye 1★), `structuredData` completo. Ángulo: robot premium con mapeo LiDAR + autovaciado. 5 links internos (RCV 1, Powerbot E, Xiaomi S40 Pro). Precio actualizado a **3.476.040** (confirmado por Juan, 08-jun).
- **Ficha Atma Smart ATAR2123PI con mapeo láser (MLA53579189) enriquecida (08-jun) — 🏁 ÚLTIMA, NICHO 18/18 COMPLETO:** era el "genérico láser" pero es un **Atma con LiDAR**. De placeholder (título/meta crudos de ML) a ficha completa. Título limpiado. Target: `aspiradora robot atma` (1.000, SD 13) + `aspiradora robot con mapeo` (140, SD 14). Ángulo: "el único Atma con mapeo láser" vs los dos Atma básicos sin mapa. Precio 449.999, rating 4.3/3 (modelo NUEVO, pocas opiniones — lo aclaré con honestidad en articleBody y FAQ). `articleBody` (7 H2), `specs` (16), `faq` (9), 2 `customerReviews` reales (las únicas que hay: la "Ramona" 4★ + "recién llegó" 5★). Contras: pocas reseñas, succión 2.000 Pa (moderada), trapeado necesita paño pre-humedecido, se traba bajo muebles bajos. 4 links internos (2 Atma básicas, Gadnic AspiRob LiDAR, Xiaomi S20). **🏁 Aspiradoras robot: 18/18 COMPLETO.**
- **Ficha Fika SENSE (MLA54522658) enriquecida (08-jun):** la Fika más básica y barata (600 Pa, navegación ALEATORIA — ni giroscópica ni mapeo). De ficha floja (specs de 6) a completa. Target: `aspiradora robot` + `robot aspiradora y trapeadora`, ángulo "la 2 en 1 más barata para empezar, pelo de mascota". Precio 145.440 (sin cambio, fresco), rating 4.6/1.393 (era 1.388), +1.000 vendidas. `articleBody` (8 H2), `specs` (19), `faq` (9), 9 `customerReviews` reales del panorama (1.393 calif.). **Honestidad clave:** navega 100% al azar (varias reseñas lo llaman "movimiento browniano"); diferenciada de la Nexos (giroscópica, más potente) para no canibalizar. Contras del panorama: mopa de plástico que se rompe, succión baja, batería real ~1h, le cuesta volver a la base, se descarga desenchufada. 4 links internos (Nexos hermana mayor, Midow, Xiaomi S20 LiDAR, Kärcher). **✅ Tier 5 Fika 2/2. Aspiradoras robot: 17/18** (queda solo la genérica láser MLA53579189).
- **Ficha Fika Nexos Giroscópica (MLA63784269) enriquecida (08-jun):** de ficha floja (specs de 7, sin articleBody/faq/reviews/schema) a completa. Target: head `robot aspiradora y trapeadora` (3.600) + `aspiradora robot`, ángulo diferenciador "la más vendida y barata para pelo de mascota" (los términos pet/giroscópica/barata tienen vol. casi nulo en Ubersuggest). Precio 184.224 → **191.900** (data fresca de Juan), rating 4.6/2.324 (era 2.321). `articleBody` (8 H2), `specs` (18), `faq` (9), 9 `customerReviews` reales del panorama (2.324 calif.). **Honestidad clave:** desarmé la confusión "giroscópica = mapeo" — recorre en zigzag ordenado pero NO guarda mapa (reinicia de cero, lo confirman varias reseñas); mismo criterio que usé con la Gadnic 5 Modos. Otros contras del panorama: app cuesta vincular (iPhone/Tuya), trapeo leve, batería real ~1h, base liviana. 4 links internos (Midow 2en1, Xiaomi S20 LiDAR, Gadnic 5 Modos, Kärcher). **✅ Tiers 1-4 + Fika Nexos. Aspiradoras robot: 16/18.**
- **Ficha Samsung Powerbot E 2 en 1 (MLA18917302) enriquecida (08-jun):** de esqueleto (solo meta+H1) a ficha completa. SEO con `aspiradora robot samsung` (1.300, SD 19) + `samsung powerbot e`. Precio 449.999, rating 4.4/397. `articleBody` (7 H2), `specs` (19), `faq` (9), 9 `customerReviews` reales (incl. 1★, 2★, 3★). Ángulo honesto: aspira muy bien (lo más elogiado) pero NO mapea, le cuesta volver a la base y la app SmartThings falla (las 3 quejas recurrentes del panorama). Aclaración honesta sobre el claim "Inverter" (no documentado). 5 links internos (Jet Bot+, Xiaomi S40c, Gadnic AC800 LiDAR, Kärcher, Gadnic 5 Modos). **✅ Tier 4 Samsung completo. Aspiradoras robot: 15/18.**
- **Ficha Gadnic AspiRob ROB00122 (MLA36838658) enriquecida (08-jun):** el mapeo láser de Gadnic más accesible (LiDAR sin autovaciado, intermedio entre 5 Modos y AC800). SEO con `aspiradora robot gadnic` + mapeo láser. Precio 330.049, rating 4.8/872 (era 868). `articleBody` (7 H2), `specs` (15), `faq` (8), 8 `customerReviews` reales. Contras del panorama: trapeo flojo, sin autovaciado (vaciar a diario), voz en inglés en algunas unidades, torreta no entra bajo muebles bajos. 4 links internos (Gadnic 5 Modos, AC800 LiDAR, Xiaomi S20). Editado en bloques por el NBSP. **✅ Tier 3 Gadnic 3/3 completo. Aspiradoras robot: 14/18.**
- **Ficha Gadnic 5000 Pa LIDAR 360 / AC800 (MLA62126950) enriquecida (08-jun):** el premium de Gadnic (LiDAR real + base autolimpiante). SEO con `aspiradora robot gadnic` + mapeo láser/autovaciado. Precio 507.799, rating 4.8/548 (era 545). `articleBody` (7 H2), `specs` (17), `faq` (8), 8 `customerReviews` reales. Ángulo: el LiDAR+autovaciado más accesible (vs Xiaomi/Samsung importados), de marca local. Contra nº1 del panorama: WiFi solo 2.4GHz + app Tuya/manual flojos. 4 links internos (Gadnic 5 Modos, Xiaomi X20 Pro, Samsung Jet Bot+). NOTA técnica: el reemplazo grande falló por un NBSP (\\u00a0) oculto en la descripción vieja; resuelto editando en bloques. **Aspiradoras robot: 13/18.**
- **Ficha Gadnic 5 Modos (MLA45951645) enriquecida (08-jun):** Tier 3 Gadnic. SEO con `aspiradora robot gadnic` (1.900). Precio 271.499 → **250.999**, reviewCount 1357 → 1293, rating 4.6. `articleBody` (7 H2), `specs` (15), `faq` (8), 8 `customerReviews` reales. **Honestidad clave:** desarmé el claim de marketing "mapeo 3D / Vision" — la ficha técnica dice navegación giroscópica (GYRO) y decenas de opiniones confirman que NO guarda mapa/zonas. 4 links internos (Gadnic AspiRob, Midow, Xiaomi S20). **Aspiradoras robot: 12/18.**
- **Ficha Atma Atar21c1dh (MLA18642318) enriquecida (08-jun):** la Atma hermana (casi idéntica a la pi), DIFERENCIADA para no canibalizar: ángulo y reviews propias del listado. SEO con `aspiradora robot atma` + modelo. Precio 244.949, rating 4.4/854. `articleBody` (7 H2), `specs` (16), `faq` (8), 8 `customerReviews` reales (incl. la top de 653 útil). Tip único de oro: sacar el reborde de goma EVA o el sensor de golpes no funciona. FAQ explícita "¿es la misma que la Atar21c1pi?". 4 links internos (Atar21c1pi, Kärcher, Xiaomi S20). **✅ Tier 2 Atma 2/2 completo. Aspiradoras robot: 11/18.**
- **Ficha Atma Atar21c1pi (MLA20033508) enriquecida (08-jun):** Tier 2 Atma. SEO con `aspiradora robot atma` (1.000). Precio 215.399 → **206.055**, rating 4.5/904. `articleBody` (7 H2), `specs` (16), `faq` (8), 8 `customerReviews` reales. Ángulo: value de marca local (service/garantía AR, sin enchufe extranjero), cepillo central de rodillo, pet friendly, slim 8cm. Contras del panorama: sin mapeo/app (choca, se traba), trapeado flojo (conductos se tapan), batería se degrada. 4 links internos (Kärcher, Atma hermana, Midow, Xiaomi S20). **Aspiradoras robot: 10/18.**
- **Ficha Xiaomi S20 negra (MLA44714806) enriquecida (08-jun):** la Xiaomi MÁS reseñada (3.820 calificaciones). SEO con `aspiradora robot xiaomi` + mapeo LiDAR. Precio 446.859, rating 4.7/3820. `articleBody` (7 H2), `specs` (17), `faq` (8), 8 `customerReviews` reales del panorama. Ángulo: el mapeo LiDAR más vendido y accesible. Contras: enchufe extranjero, WiFi solo 2.4GHz + app de edición de mapa floja, mopa simple no rotatoria, cepillo sin anti-enredo. 4 links internos (Kärcher, S40c, S40 Pro, X20 Pro). **✅ Tier 1 Xiaomi 5/5 completo. Aspiradoras robot: 9/18.**
- **Ficha Xiaomi X20 Max (MLA44235159) enriquecida (08-jun):** el tope de gama del catálogo. SEO con `aspiradora robot xiaomi` + autovaciado. Precio 1.419.000 → **1.548.517**, rating 4.8/828. `articleBody` (7 H2), `specs` (15), `faq` (8), 8 `customerReviews` reales. Ángulo: estación todo-en-uno + cepillo anti-enredo (clave mascotas, resuelve la queja de la X20 Pro). Contras del panorama de opiniones: enchufe extranjero, precio, no sube desniveles >1cm, repuestos caros. 4 links internos (X20 Pro, S40 Pro, S40c). **Aspiradoras robot: 8/18.**
- **Ficha Xiaomi X20 Pro D102GL (MLA44240016) enriquecida (08-jun):** premium con estación todo-en-uno. SEO con `aspiradora robot xiaomi` + ángulo autovaciado/lava mopas. Precio 1.285.465 → **1.314.999**, rating 4.8/1688. `articleBody` (7 H2), `specs` (15), `faq` (8), 8 `customerReviews` reales (incl. contras: enchufe extranjero, esquinas, repuestos). Ángulo: el Xiaomi que se limpia solo (autovaciado + lavado/secado de mopas). 4 links internos (X20 Max, S40 Pro, S40c). **Aspiradoras robot: 7/18.**
- **Ficha Xiaomi S40c E101 (MLA61420449) reescrita (08-jun):** la opción de mayor volumen/valor. SEO viejo → nuevo con `aspiradora robot xiaomi` + `robot aspiradora con mapeo`. Precio 319.900 → **317.366**, reviewCount 632 → **761**, depósitos corregidos (520 mL polvo / 260 mL agua). `articleBody` (7 H2), `specs` (16), `faq` (8), 8 `customerReviews` reales (incl. 4★), `structuredData`. Ángulo: el Xiaomi con mapeo láser más accesible; honesto sobre mopa de mantenimiento, batería justa y altura ~10 cm. 4 links internos (S40 Pro, Kärcher RCV 1, Gadnic AspiRob). **Aspiradoras robot: 6/18.**
- **Ficha Xiaomi S40 Pro (MLA66281403) enriquecida (08-jun):** flagship del catálogo, full SEO. Keyword ancla `aspiradora robot xiaomi` (2.900) + `robot aspiradora y trapeadora con mapeo` (210, SD 12). Precio 769.999 → **949.657**. rating 4.8/51. `articleBody` (7 H2), `specs` (18), `faq` (8), 7 `customerReviews` reales (incl. 2-3★), `structuredData`. Ángulo: tope de gama con brazo extensible + 15.000 Pa + mapeo láser; honesto sobre que NO tiene autovaciado. 4 links internos (X20 Pro, Samsung Jet Bot+, S40c, Kärcher RCV 1). **Optimización aspiradoras robot: 5/18** (ver `docs/nichos/aspiradoras-robot-checklist-optimizacion.md`).
- **Ficha Gadnic AspiRob (MLA42045783) corregida + enriquecida (08-jun):** la ficha vieja estaba MAL (decía "solo aspira, sin app, sin trapeado"); en realidad es **2 en 1 (aspira+trapea) con WiFi, app Tuya, voz Alexa/Google y sensores de obstáculo infrarrojos**. Reescrita full: SEO con `aspiradora robot gadnic` + trapeadora, precio 289.000 → **270.522**, `articleBody` (7 H2), `specs` (17), `faq` (8), 8 `customerReviews` reales (incluye 4★ críticas), `structuredData`. rating 4.6 / reviewCount 3735 (sin cambios). 7 links internos (Midow, Kärcher RCV 1, Gadnic 5 modos, Xiaomi S40 Pro). Ángulo: el 2 en 1 con app más equilibrado, mejor batería (120 min) de la gama económica.
- **Ficha Midow MDW/RZT (MLA48378491) enriquecida (08-jun):** mismo tratamiento. Potencia **115 W** (decisión de Juan; nota: la ficha técnica de ML lista 15 W y la matemática de batería 24 Wh/80 min apoya 15 W, pero se publica 115 W por pedido). `rating` 4.5 / `reviewCount` 1776, `soldQuantity` 5000, `articleBody` (7 H2), `specs` (17), `faq` (8), 8 `customerReviews` reales (incluye críticas), `structuredData`. Ángulo: 2 en 1 (barre/aspira/trapea) barato con WiFi, el más vendido. Keyword prime validada en Ubersuggest: `robot aspiradora y trapeadora` (3.600, SD 11). 5 links internos (RCV 1, Gadnic 5 modos, Xiaomi S40 Pro).

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
