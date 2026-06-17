# Estado actual

> Snapshot del proyecto. Se actualiza al final de cada sesión.
> Última actualización: 2026-06-16 (Optimización SEO cluster perfumes árabes a partir de la medición GSC de fase 2 + fixes de schema de la auditoría).

## Sesión 16-jun — Optimización SEO perfumes árabes (medición GSC fase 2) + fixes de schema

Disparador: medición de impacto SEO de la fase 2 de perfumes árabes (estaba agendada para ~16-jun, 3 semanas desde la primera publicación). Juan pasó 3 exports de GSC + keywords de Ubersuggest. **Atención: parte de esta sesión se cruzó con una segunda sesión de Claude que Juan corrió sin querer en paralelo — ver punto 5.**

1. **Diagnóstico GSC (últimos 3 meses).** Los exports filtrados por query "perfumes arabes" daban 0 clicks y engañaban (GSC solo cuenta esa frase exacta). El export del sitio completo mostró la realidad: el cluster hizo **~29 clicks / ~2.800 impresiones (~13% de los clicks del sitio)**. Casi todas las guías rankean en posiciones 6-20 (puerta de página 1). Hallazgo grande: demanda fuerte en singular "perfume arabe mujer" (22.200, SD 8) donde rankeábamos en página 2. Decisión: **optimizar lo existente antes de crear nuevos artículos** (mover de pos 9→3 en términos de 18-40k búsquedas vale más que un artículo nuevo de 300).

2. **Patrón común detectado y arreglado:** varias guías top tenían `faq: []` vacío → **no se generaba el FAQPage schema** (la página solo lo emite si `faq.length>0`), justo donde hay queries de pregunta con volumen ("como saber si un perfume arabe es original" = 880/mes). Se cargaron FAQs reales (de Ubersuggest) en las que faltaban.

3. **5 guías de perfumes optimizadas** (FAQs + metadata + frescura `updatedDate: 2026-06-16`):
   - `perfumes-arabes-mujer` (era pos 20): 8 FAQs, metaDescription con singular, intro sin relleno.
   - `mejores-perfumes-arabes-hombre` (pos 10): 8 FAQs (incluye dupes), ogTitle/ogDescription propios (eran copia del SEO), meta.
   - `perfumes-arabes` (hub, pos 9): +2 FAQs (definicional + cómo reconocer original), ya tenía 7.
   - `perfumes-arabes-precio-argentina` (pos 7, CTR 0.45%): 5 FAQs, ogDescription, intro sin pin de mes.
   - `perfumes-arabes-por-color`: SIN cambios (ya estaba bien optimizada, no tocar por tocar).

4. **Verificación:** `tsc --noEmit` limpio y `eslint` limpio en los archivos tocados. Build completo de 266 páginas NO corrido (límite del sandbox + perms `.next`); el typecheck es lo que el build valida.

5. **Sesión paralela accidental (segunda instancia de Claude).** Tocó además: `ProductCard.tsx` (arregló el bug del `reviewCount: 1` fijo del schema de product-cards → ahora aggregateRating con datos reales, brand, priceValidUntil, itemCondition, availability por stock, seller), `producto/[slug]/page.tsx` (itemCondition NewCondition en offers), `public/llms.txt` (expandido al catálogo completo) y los seoTitle de `pava-electrica-peabody` y `philips-freidoras-de-aire-review` (CTR). Todo legítimo y de la auditoría SEO pendiente; sin conflictos con lo de perfumes. Creó `.claude/settings.local.json` (config local — NO commitear, conviene gitignorearlo).

6. **Estado git al cierre:** el sandbox NO puede pushear (sin credenciales) y su `.git` es read-only para borrar (deja `.lock` que Juan limpia en su Mac). Quedó commiteado local **solo el bloque perfumes** (`0164f6d`, guides.ts). Pendiente de commit+push por Juan: `ProductCard.tsx` + `page.tsx` (schema-fixes), `public/llms.txt`, y este `CURRENT_STATE.md`.

## Sesión 10-jun — Fichas "agent-ready": una sola fuente de verdad para el Schema

Objetivo: que cada ficha tenga datos estructurados limpios y verificables (rich snippets hoy, comercio agéntico mañana). **Sin commit, a la espera de Juan.**

1. **JSON-LD centralizado en `src/app/producto/[slug]/page.tsx`.** El Schema ahora se arma SIEMPRE desde los campos canónicos del producto: precio/disponibilidad/`priceValidUntil` salen de `price`/`priceStatus`/`priceLastChecked`; `aggregateRating` solo con `rating`+`reviewCount` reales; `review[]` se genera desde `customerReviews` (45 fichas tenían reseñas cargadas que no se publicaban — ahora sí); `specs` se emiten como `additionalProperty`. El `structuredData` manual quedó solo para extras (model, color, origen) y ya no puede contradecir la página. **Esto arregló de una las 87 fichas cuyo Schema publicaba un precio distinto al visible** (drift: `prices:update` actualizaba `price` pero no el bloque manual). De acá en más cada corrida de precios mantiene el Schema sincronizado solo.
2. **3 campos nuevos en `Product` (`src/lib/types.ts`):** `canonicalName` (nombre limpio para JSON-LD/breadcrumbs, fallback `title`), `mpn` (solo si es real), `reviewsSampledAt` (fecha en que se leyeron las reseñas — verificabilidad).
3. **Checklist agent-ready definido** (lo que tiene que tener una ficha completa): canonicalName · brand · description · rating+reviewCount reales · ≥3 customerReviews con fecha · specs · faq · comparador honesto en articleBody con números del catálogo · priceStatus fresh · sin structuredData que duplique datos canónicos.
4. **Ficha piloto: Noble Blush (MLA43643712) completa.** Reviews vía API oficial (`/reviews/item/MLA1482015957?catalog_product_id=...`): rating real 4.7 sobre 790 reseñas (la ficha decía 5 sin reviewCount), breakdown 85% cinco estrellas, 150 textos leídos, 5 curados por votos útiles incluyendo una crítica de 4★ que reporta 3-4h de duración (citada en la FAQ). Agregados: 12 specs, 4 FAQs, `comparedTo` (Delina Exclusif y Good Girl, mencionados en reseñas), bloque "Cómo se compara con otras Lattafa del catálogo" con números reales vs Yara Candy/Her Confession/Yara Elixir, sección "Para quién NO es", links internos a las 3 alternativas. TODO: `soldQuantity` (el endpoint `/items` da 403 con client_credentials — tomarlo a mano).
5. **🏁 Ratings reales aplicados a las 24 fichas visibles que tenían `rating` sin `reviewCount`.** Relevamiento por API (datos en outputs de la sesión): 23 con reseñas reales + el especiero (5★/4 reseñas). Hallazgos: varias fichas inflaban 5★ cuando la realidad es 4.4-4.8 (el set de tubos árabes: 5 → 4.4/122), y el Afnan 9PM decía 4 cuando tiene 4.6/1.864. Ahora todas emiten `aggregateRating` real con `reviewsSampledAt: "2026-06-10"` (170 fichas con estrellas en total). Ojo: 9 de esas publicaciones tienen el prefijo MLA/MLAU mal guardado (problema conocido de MISTAKES) — para la API hubo que sacar el ID real del permalink.
6. **🏁 155 reseñas fechadas en las 23 fichas que las tenían sin fecha** (lotes viejos de aspiradoras robot + TCL). Método: matcheo de texto contra las reseñas reales de la API (similitud por tokens, umbral 0.55; todos los matches aplicados dieron similitud ≥0.75). Bonus: **31 reseñas tenían rating "estimado por tono" distinto al real del comprador — corregidos con el dato de la API** (patrón: a reseñas de tono crítico se les había puesto 4★ cuando el comprador puso 5★; las Samsung al revés). 6 reseñas no aparecieron en la API (quedan sin fecha y fuera del Schema, sin inventar): TCL #5, Samsung Jetbot #3, Xiaomi S20 #7, X20 Max #5, Roomba 692 #0, Combo I5+ #7 — revisar a mano si vale la pena rescatarlas o reemplazarlas. Resultado: **46 fichas emiten `Review[]` en su Schema** (antes 17+Noble Blush).
7. **Pendientes que dejó esta sesión:** (a) las 14 fichas deprioritizadas con rating sin reviewCount quedaron sin tocar (no se renderizan); (b) las 6 reseñas sin match de arriba; (c) menciones de cantidades de reseñas desactualizadas en TEXTOS editoriales (ej. articleBody del proyector MTI dice "298 vs 415" y hoy son 763) — mismo problema que las 158 menciones de precio; (d) `soldQuantity` del Noble Blush a mano.
8. Verificado: `tsc` limpio, build verde (266 páginas), eslint sin regresiones en los archivos tocados. Incidente menor con `git stash` en el sandbox documentado en MISTAKES.md (sin pérdida de datos).

## Sesión 09-jun (2) — Precios por API + auditoría completa del catálogo

1. **`npm run prices:check/update` migrado a API-first.** Los ~195 productos de catálogo/MLAU se chequean contra la API oficial de a 8 en paralelo (segundos, sin navegador); Puppeteer queda solo para las ~13 publicaciones individuales (`articulo...`). Flag nuevo `--api-only` para corridas sin navegador (pensado para agendar). La clasificación va por permalink, no por ID (ver MISTAKES: hay 19 fichas con prefijo MLA/MLAU mal guardado). Un 404 de `/products/{id}/items` = "sin vendedores activos" → se marca `out_of_stock` solo.
2. **Importer reescrito API-first** (`scripts/ml-product-importer.ts`): catálogo y MLAU sin Puppeteer, con modo `--search "keyword"` para descubrir productos de catálogo con precios desde la terminal. Scraper solo como fallback para publicaciones individuales.
3. **Corrida masiva aplicada: 100 precios actualizados de 195 chequeados, 0 fallos.** Incluye el Panini +682% ($11.000→$86.000, verificado real — fiebre Mundial) aplicado con `--max-ratio 10`.
4. **16 productos sin vendedores activos → `visibility: 'deprioritized'`** (total deprioritizados: 26). Duelen: 4 de 6 Panini Mundial muertos EN PLENO MUNDIAL (buscar reemplazos con `--search` urgente), pava ATMA, 4 proyectores Fika/Gadnic, velador Gadnic, 3 de cocina.
5. **Auditoría completa fichas+guías.** Sano: 0 links internos rotos, 0 referencias a productos inexistentes, 0 ids duplicados. Pendientes detectados: **158 menciones de precio en el TEXTO de las guías desactualizadas** (peores: pava-electrica-precio habla de pavas desde $12-15k cuando hoy arrancan en $42k; masajeadores similar) — trabajo editorial por cluster; 61 fichas visibles sin pros/cons/verdict; 20 sin rating (la API ya los trae); 2 guías de perfumes linkean al Afnan 9PM deprioritizado.
6. Verificado: `npm run build` verde, lint sin regresiones. **Sin commit, a la espera de Juan.**

1. **Chip #2 CERRADO — 134 links `/producto/...` → meli.la** en `guides.ts` (eran "~112"; el conteo real fue 134). Todos resueltos contra `affiliateUrl` del catálogo, 0 sin match. Clicks de afiliado que antes pasaban por la ficha interna ahora van directo a ML.
2. **Sticky CTA mobile implementado** (#1 del roadmap de 12 ideas): `src/components/products/StickyMobileCta.tsx` + integración en `ProductDetail`. Barra fija inferior solo mobile con precio + "Ver en MercadoLibre"; aparece al scrollear pasado el CTA principal y se oculta cuando el CTA del final entra en pantalla. **Pendiente: prueba visual en navegador por Juan** (no se pudo probar visualmente en esta sesión).
3. **3 bugs de JSON-LD corregidos** (encontrados por la auditoría, ver MISTAKES.md): image malformado en guías con hero externo, brand=categoría y reviewCount=ventas en el fallback de fichas, URLs legacy en CollectionPage de categorías.
4. **Auditoría SEO live: score 72/100.** Técnico excelente (88); débil en schema (57, ya mejorado con los fixes) y GEO/IA (54). Top pendientes: actualizar llms.txt (lista 4 guías de 66), autor con nombre real + byline, schema en /guias index, itemCondition en offers, home dinámica→estática. Informes en outputs de la sesión: `AUDITORIA-SEO-COMPLETA.md`, `audit-schema.md`, `audit-performance.md`, `audit-geo.md`.
5. **Research próximo cluster** (`proximo-cluster-research.md`): limpiavidrios DESCARTADO (210/mes). **Recomendado: cafeteras** (`cafetera express` 22.200/mes SD 11, evergreen). Calefacción es gigante pero estacional y llegamos tarde → agendar feb-mar 2027 (ver LEARNINGS).

6. **NUEVO NICHO CAFETERAS — 18 fichas importadas** vía API oficial de ML (catálogo pasa a ~208 productos). Categoría `cocina`. Cobertura por tier: filtro/entrada (2 Atma, Ultracomb CA-2205, Electrolux ECM25, Smartlife SL-CM1095, Liliana AC935), express económicas (Ultracomb CE-6108, Liliana 2en1/Prosteam/Latesense, Smartlife SL-EC8501), cápsulas (Moulinex Piccolo XS, Nespresso Inissia, Smartlife 3en1), gama media/alta (Oster BVSTEM5501B, Peabody 5010N) y tope de gama (Oster Perfect Brew EM7301, Peabody PE-CE5023IX). Son placeholders estilo aspiradoras: precio fresco (09-jun), imágenes, brand, description cruda de ML — **falta el enriquecimiento 1 a 1** (seoTitle, articleBody, faq, specs, reviews, structuredData) con el mismo checklist de aspiradoras robot.
   - ✅ **Links de afiliado meli.la aplicados en las 18** (Juan los generó en la misma sesión; cada uno verificado resolviendo el redirect contra su MLA ID). Detalle: la Atma CA8131 y la Nespresso Inissia fueron rechazadas por el programa con la publicación del buy box; entraron con publicaciones alternativas (MLA-3091753002 y MLA-1581204795). La CA8131 quedó con el precio de esa publicación: $45.000 (no $34.500).
   - Nota API: `/sites/MLA/search` está 403 con client_credentials, pero **`/products/search` funciona** (descubrimiento de esta sesión). Dolce Gusto Mini Me / Genio S no aparecieron con oferta activa.
   - **Reviews por API también funcionan**: `GET /reviews/item/{ITEM_ID}?catalog_product_id={MLA}` da rating, desglose por estrellas y textos completos. Con eso se agregaron `rating`/`reviewCount` a las 13 fichas que tienen reviews (5 quedaron sin: CA8131, ECM25, Prosteam, Latesense, Inissia — modelos nuevos).
7. **Doc maestro del nicho**: `docs/nichos/cafeteras.md` — keywords validadas, tabla del catálogo, orden de enriquecimiento por ROI y plan de 8 guías.
8. **🏁 ENRIQUECIMIENTO CAFETERAS 18/18 COMPLETO.** Tras el batch 1 manual, las 15 restantes se hicieron con 3 agentes en paralelo usando datos frescos de la API (specs, precios, reviews completas con likes). Todas con el checklist completo: articleBody 7 H2, specs 14-19, faq 8-9, customerReviews reales con críticas incluidas, structuredData, links internos cruzados según el mapa del doc maestro. Las 5 sin reviews (CA8131, ECM25, Prosteam, Latesense, Inissia) declaran honestamente "sin calificaciones todavía" y no llevan aggregateRating. Correcciones de datos de ML documentadas en las fichas: CA8133 timer No, CA-2205 no hace espresso (dice "Expreso" en ML), CE-6108 15 bar (no 19), Liliana AC985 "2 en 1" = molido + cápsulas Nespresso SIN adaptador Dolce Gusto (las reviews confirman que ya no viene), dimensiones AC985 en cm corregidas. Verificado: build verde con 198 fichas prerrenderizadas, lint sin regresiones, affiliateUrls correctos en las 18.
9. **🏁 CLUSTER CAFETERAS: LAS 8 GUÍAS ESCRITAS Y AGENDADAS** (cadencia 3 días): cafetera-express (09-jun, LIVE), cafetera-oster (12-jun), cafetera-dolce-gusto (15-jun), cafetera-peabody (18-jun), cafetera-de-filtro (21-jun), cafetera-smartlife (24-jun), cafetera-liliana (27-jun), que-cafetera-comprar (30-jun). Todas con product-cards, pull-quotes de reviews textuales, tablas con links meli.la, FAQs y links internos del cluster (solo a guías ya publicadas a su fecha). Hallazgos editoriales de los redactores: la Smartlife 3 en 1 SÍ corta sola (diferenciador vs SL-EC8501), costo por taza cápsula $900-1.300 vs filtro $150-250, veredicto contraintuitivo en que-cafetera-comprar (a la mayoría le conviene cápsulas o filtro, no express). Pendiente post-publicación: pedir indexación en GSC de cada guía cuando salga + agregar links internos hacia las guías nuevas en el pilar.

### Detalle pilar `/guias/cafetera-express` (kw 22.200/mes SD 11, publishedDate 09-jun). Primera guía del cluster (1/8 del plan). Estructura del pilar de aspiradoras: quickPicks (4), trust-block, ranking con 6 product-cards + mención de la Peabody automática, tabla comparativa con links meli.la, sección "cómo elegir" (espumador/molido-cápsulas/corte automático), precios por franja, veredicto y FAQ de 6. 100 links de afiliado en la página renderizada. Pasada por humanizer. **Nueva categoría de guías: `cafeteras`.** Sin internalLinks todavía (no hay otras guías del cluster publicadas — agregarlos cuando salgan las de marca). Próximas por plan: cafetera-oster (14.800 SD 9), cafetera-dolce-gusto (8.100), cafetera-peabody (5.400), cadencia 3 días.
10. **⚠️ node_modules destruido y eliminado** (ver MISTAKES.md): un npm install vía symlink lo rompió sin arreglo. `package.json`/`package-lock.json` intactos. **Juan tiene que correr `npm install` en el proyecto antes del próximo build local.**

### Batch 1 (detalle) — 3 fichas COMPLETAS (checklist heredado de aspiradoras): **Piccolo XS** (4.8★/8.392 — ángulo "la más vendida, pero es 100% manual"; desarmé el dato confuso "tecnología automática" de ML), **Oster BVSTEM5501B** (4.7★/402 — "la Oster de entrada"; contras honestos: corte manual, café tibio, espumador incómodo) y **Smartlife SL-EC8501** (4.6★/1.656 — "20 bares + cápsulas Nespresso"; la joya editorial: el tapón de silicona escondido en el depósito, queja nº1). Las 3 con articleBody 7 H2, specs 18-19, faq 8-9, 8-9 customerReviews reales (incl. críticas), structuredData completo y 4-5 links internos cruzados. **Quedan 15 fichas por enriquecer** (orden en el doc maestro; siguiente: Smartlife 3en1, Perfect Brew EM7301, Peabody 5010N).

Verificado: `npm run lint` (mismos 41 errores preexistentes, sin regresión) + `npm run build` verde con las 18 fichas nuevas prerrenderizadas (build en copia temporal Linux; el `.next` local sigue con el problema de permisos del entorno). **Sin commit, a la espera de Juan.**

## Catálogo

- **~186 productos** en `src/data/curated-products.ts` (170 + 6 Panini + 10 aspiradoras robot nuevas).
- Categorías nuevas: **`coleccionables`** (6 Panini Mundial 2026) y **`aspiradoras-robot`** se sirve vía categorySlug `hogar` para las 18 fichas de robots.
- Productos featured: TCL 43S5K (Smart TV 43" — top del catálogo).
- Precios trackeados con `priceUpdated` + `priceLastChecked` + `priceStatus`.
- Última actualización de precios: 8 aspiradoras robot (2026-06-06).
- **Importación por API oficial de ML validada** (OAuth client_credentials) — ver memoria `ml-api-oficial-funciona`. Credenciales en `.env` local. Sin bloqueos/CAPTCHA.
- **NUEVO NICHO: Roomba / iRobot (08-jun).** Juan agregó 4 modelos al catálogo (total 190 productos). Hueco SEO con buen ROI: `roomba` 1.600/mes SD 11 + `aspiradora roomba` 880 SD 10 (intención comercial, SERP retail → ficha rankea). Optimización 1 a 1, mismo checklist. Orden por ROI: 692 (entry, dueña del head) → Combo i5+ → j7 → j9. Ver tracking en tasks #29-32. **🏁 Estado: 4/4 COMPLETO.**
  - **Ficha Roomba j9 bronce (MLA44718960) enriquecida (08-jun) — cierra nicho Roomba 4/4:** el tope de gama ($2.277.065), rating 4.6/**5** (1 comentario, 3★ crítico). Ángulo: "el Roomba que hace todo" (aspira+trapea+esquiva objetos+mapea) + base premium que se vacía sola Y rellena el agua del trapeado. **Honestidad fuerte** por ser compra cara: aclaré que es de los más caros del catálogo, que hay opciones que hacen casi lo mismo por menos (i5+, Samsung Jet Bot+), y que la única reseña escrita reporta "fallos de diseño". `articleBody` (7 H2), `specs` (17), `faq` (8), 1 `customerReview` real (la 3★). 4 links internos (692, i5+, j7, Samsung Jet Bot+). **🏁 Roomba: 4/4 COMPLETO.**
  - **Ficha Roomba j7 (MLA37360592) enriquecida (08-jun):** el Roomba que esquiva objetos ($1.392.999), rating 5.0/**1** (publicación nueva, poca muestra — manejado con honestidad como la Atma Smart). Ángulo: cámara PrecisionVision (esquiva cables, cordones y sorpresas de mascota) + hasta 10 mapas (resuelve el límite de 1 mapa de la i5+). **Importante:** es la j7 estándar (94J715030), NO la j7+ → solo aspira, sin trapeo ni autovaciado; lo aclaré explícito porque la marketing de iRobot las mezcla. `articleBody` (7 H2), `specs` (17), `faq` (8), 1 `customerReview` real. 4 links internos (692, i5+, j9). **Roomba: 3/4.**
  - **Ficha Roomba Combo i5+ (MLA27941233) enriquecida (08-jun):** el Roomba con autovaciado ($1.287.399), rating 4.3/49. De placeholder a completa. Ángulo honesto: "brilla aspirando (+ se vacía sola 60 días + mapea por habitación), pero el trapeado es flojo". `articleBody` (7 H2), `specs` (17), `faq` (9), 9 `customerReviews` reales (incl. 3★ y 2★). **2 contras clave del panorama:** trapeado "tímido"/pegajoso (la razón nº1 del 4.3) y SOLO guarda 1 mapa (mal para casas de varios niveles). 5 links internos (692, j7, j9, Gadnic AC800 autovaciado, Samsung Jet Bot+, Xiaomi S20). **Roomba: 2/4.**
  - **Ficha Roomba 692 (MLA20657750) enriquecida (08-jun):** el iRobot de entrada ($389.999), rating 4.5/39. De placeholder a completa. Ángulo honesto: "pagás la marca y la durabilidad, no las funciones" — NO mapea (navegación aleatoria), NO trapea, y a su precio varias Xiaomi/Gadnic mapean+trapean. `articleBody` (7 H2), `specs` (13), `faq` (9), 7 `customerReviews` reales (incl. 1★ y 2★ por el cepillo lateral que se rompe — falla recurrente). Corregí el dato erróneo de ML "succión 1 Pa" (iRobot no informa Pa). 5 links internos (Combo i5+, j7, j9, Xiaomi S20, Gadnic AspiRob LiDAR). **Roomba: 1/4.**
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

- **66 guías totales** en `src/data/guides.ts` (54 + 12 de aspiradoras robot).
- Distribución por tema:
  - `freidoras-de-aire`: 23 (varias agendadas a futuro)
  - `pavas-electricas`: 11 (4 agendadas)
  - `perfumes-arabes`: 14 (6 originales + 8 nuevas de fase 2)
  - `masajeadores`: 11 (08-jun: masajeador [pillar head term 49.5K/dif 13], pistola-masajeadora, masajeador-espalda-cuello, masajeador-electrico · 17-jun: masajeador-gadnic [marca, formato cafeteras] + 5 productos Gadnic importados: Cedro MLA18961711 9.455rev, Gunax pistola MLA22138401, 8nodos-lumbar MLA19043353, Sauce asiento MLA19712537, Healthy Leg MLA24043083 — affiliateUrl con matt_tool largo, pendiente pasar a meli.la)
  - `aspiradoras-robot`: **12** (7 originales optimizadas 08-jun + 5 nuevas 08-jun)

### Red aspiradoras robot — 12 guías (7 optimizadas + 5 nuevas, 08-jun)

| # | Slug | Tipo | Estado |
|---|---|---|---|
| 1 | robot-aspiradora | HUB pilar | Optimizada (precios/Samsung/S40 Pro reframe) |
| 2 | mejores-robot-aspiradora-trapeadora | Ranking | Optimizada (precios/ratings) |
| 3 | robot-aspiradora-precio-argentina | Precios | Optimizada (toda la escala de precios + Midow=más barato, Samsung=techo $3.476.040) |
| 4 | robot-aspiradora-xiaomi | Marca | Optimizada (S40 Pro ya no es "gama media") |
| 5 | robot-aspiradora-gadnic | Marca | Optimizada |
| 6 | robot-aspiradora-con-mapeo-laser | Feature | Optimizada (Samsung $3.476.040, X20 Pro $1.314.999) |
| 7 | como-funciona-robot-aspiradora | Informacional | Sin cambios mayores |
| 8 | mejor-aspiradora-robot | Decisión ("cuál comprar") | **NUEVA** — kw `mejor aspiradora robot` 480, `que aspiradora robot comprar` 140 |
| 9 | robot-aspiradora-roomba | Marca (4 Roomba) | **NUEVA** — kw `roomba` 1.600 SD 11, `aspiradora roomba` 880 SD 10 |
| 10 | robot-aspiradora-samsung | Marca (Jet Bot+, Powerbot E) | **NUEVA** — kw `aspiradora robot samsung` 1.300 |
| 11 | robot-aspiradora-atma | Marca (3 Atma) | **NUEVA** — kw `aspiradora robot atma` 1.000 SD 13 |
| 12 | aspiradora-robot-gadnic-vs-xiaomi | Comparativa | **NUEVA** — decisión 2 marcas top (2.900 + 1.900) |

**Optimización 08-jun (precios/ratings frescos de las 22 fichas → guías):** swaps limpios (Fika Nexos $191.900, SENSE $145.440, Gadnic 5 Modos $250.999, 3 Modos $270.522, S40c $317.366, S20 $446.859) + reencuadres editoriales fuertes: **Xiaomi S40 Pro $599.990→$949.657** (ya no "premium accesible casi gama media"; premium ahora arranca ~$950K), **Samsung Jet Bot+ $1.300.000→$3.476.040** (techo del catálogo, reposicionado como outlier de marca), **X20 Pro $1.000.000→$1.314.999**, **X20 Max $1.399.000→$1.548.517**. Corrección de dato: AC800 "más de 1.000 calificaciones" → "más de 1.000 **vendidas**" (son 548 calificaciones; Juan aclaró ventas≠reviews). Corrección: el más barato del catálogo ahora es **Midow $130.979**, no la Fika SENSE. Verificado: `tsc --noEmit` ✓, ESLint ✓, 12 slugs únicos, todos los cross-links y productMlaId resuelven. Build completo bloqueado por permisos del `.next` (entorno, no código). Sin commit (a la espera de Juan).

18 fichas de aspiradoras robot en el catálogo. Doc maestro: `docs/nichos/aspiradoras-robot.md`. Método keywords: CSVs en `Keywords/Aspiradoras Robot/` + MCP Ubersuggest (locId 2032, es).

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
2. ~~Normalización de links históricos~~ ✅ CERRADO 09-jun (134 links convertidos a meli.la).
3. **Upgrade ogTitle/ogDescription**: 11 guías en cola sin estos campos.
4. **Pendientes de la auditoría SEO 09-jun** (orden de impacto): actualizar llms.txt al catálogo completo, autor con nombre real en Article schema + byline visible, schema ItemList/Breadcrumb en /guias, `offers.itemCondition`, FAQPage del HomeFAQ, home dinámica→estática (searchParams), preconnect a mlstatic.

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
