# Tracking de optimizaciones de guías (SEO)

> Archivo interno de seguimiento. Registra el estado **ANTES** de optimizar cada guía (baseline en GSC) para poder medir la evolución después.
> La skill `optimizador-guias-pv` lee este archivo antes de optimizar una guía: si la URL ya tiene baseline, lo usa para comparar; si no, la agrega.
>
> **Regla de oro:** el baseline NO se pisa. Cuando re-medimos, agregamos una columna/sección nueva con la fecha, no reemplazamos el número viejo. Así se ve la curva real.

---

## Cómo usar este archivo

1. **Antes de optimizar** una URL, buscala en la tabla "Baseline". Si está, ese era su estado previo (impresiones, clicks, posición). Sirve para saber de dónde partimos.
2. **Después de optimizar**, agregá o actualizá la fila: completá `Optimizada` con la fecha (`AAAA-MM-DD`) y dejá el baseline intacto.
3. **Para medir evolución** (a las ~3-4 semanas de optimizar): exportar GSC del **sitio completo** (no filtrado por query), últimos 3 meses. Comparar impresiones / clicks / posición actuales contra el baseline. Anotar el resultado en la sección **"Mediciones posteriores"** con su fecha.
4. **Criterio de éxito** por tipo de cambio:
   - Snippet/CTR (title y meta): subió el CTR a misma o mejor posición.
   - Empuje de ranking (tabla, profundidad, enlazado): bajó el número de posición (ej. 10 → 6).
   - Página nueva o página 2: aparecieron impresiones/clicks que antes no estaban.

### Notas de medición
- `Pos` = posición media en GSC (más bajo es mejor). `n/d` = sin datos suficientes para promediar.
- `CTR` = clicks / impresiones del período.
- Las URLs son `https://productosvirales.com.ar/guias/<slug>`.

---

## Baseline (snapshot GSC 2026-06-25, últimos 3 meses)

Estado **previo** a la primera tanda de optimización del 2026-06-26.

| Slug | Impr | Clicks | Pos | CTR | Publicada | Optimizada |
| :-- | --: | --: | --: | --: | :-- | :-- |
| atma-freidoras-de-aire-review | 2725 | 46 | 7.10 | 1.69% | 2026-04-18 | 2026-06-26 |
| mejores-freidoras-de-aire-argentina | 1863* | 31* | 9.60* | 1.66%* | 2026-04-15 | 2026-06-28 |
| philips-freidoras-de-aire-review | 1446 | 11 | 8.20 | 0.76% | 2026-04-27 | 2026-06-26 |
| mejores-perfumes-arabes-hombre | 1262 | 14 | 9.97 | 1.11% | 2026-04-17 | 2026-06-26 |
| masajeador-cervical | 1092 | 16 | 9.26 | 1.47% | 2026-04-11 | 2026-06-26 |
| perfumes-arabes-mujer | 1075 | 10 | 18.18 | 0.93% | 2026-04-17 | 2026-06-26 |
| mejores-masajeadores-argentina | 914 | 15 | 7.59 | 1.64% | 2026-04-11 | 2026-06-26 |
| perfumes-arabes-amaderados | 513 | 5 | 8.37 | 0.97% | 2026-04-17 | 2026-06-26 |
| pava-electrica-philips | 412 | 7 | 7.87 | 1.70% | 2026-04-13 | 2026-06-26 |
| mejor-aspiradora-robot | 369 | 3 | 15.08 | 0.81% | 2026-06-08 | revisada s/cambios (nueva) |
| perfumes-arabes-precio-argentina | 343 | 1 | 7.10 | 0.29% | 2026-04-17 | 2026-06-26 |
| pava-electrica-precio | 332 | 6 | 7.65 | 1.81% | 2026-04-25 | 2026-06-26 |
| perfumes-arabes | 271 | 2 | 8.48 | 0.74% | 2026-04-27 | 2026-06-26 |
| pava-electrica-peabody | 268 | 4 | 7.72 | 1.49% | 2026-05-09 | 2026-06-26 |
| pava-electrica-atma | 238 | 1 | 10.66 | 0.42% | 2026-04-20 | 2026-06-26 |
| masajeador-espalda | 201 | 6 | 11.72 | 2.99% | 2026-04-24 | 2026-06-26 |
| perfumes-arabes-originales | 169 | 1 | 7.62 | 0.59% | 2026-05-26 | 2026-06-26 |
| masajeador-donde-comprar-argentina | 11 | 1 | n/d | — | 2026-04-11 | 2026-06-26 |
| pava-electrica-mercadolibre | 4 | 0 | n/d | 0% | 2026-05-02 | 2026-06-26 |
| masajeador-gadnic | n/d | n/d | n/d | — | 2026-06-17 | revisada s/optimización (nueva, 11 días) |
| perfumes-arabes-por-color | 296 | 0 | 8.90 | 0% | 2026-06-01 | 2026-06-29 |
| producto/carrito-organizador (MLA64582730) | 216 | 0 | 3.70 | 0% | 2026-04-11 | 2026-06-29 |
| peabody-freidoras-de-aire-review | 385 | 8 | 6.70 | 2.1% | 2026-04-22 | 2026-06-29 |

**perfumes-arabes-por-color (2026-06-29):** baseline del snapshot 2026-06-27 (primera optimización). Rankeaba 9º con 296 impresiones y **0 clicks** (CTR puro). Las queries reales son combinaciones de dos colores, sobre todo "[color] + dorado" ("perfume árabe azul y dorado", "celeste con dorado", "blanco con dorado", "azul con tapa dorada"). Cambios: seoTitle reordenado a colores de más demanda, metaDescription reescrita (estaba en 167 car., apuntada ahora a la intención real) y **sección nueva "frascos de dos colores (con dorado)"** que mapea cada combinación a su producto. Cambio de CTR + empuje de ranking. Re-medir ~2026-07-27.

**peabody-freidoras-de-aire-review (2026-06-29):** del silo freidoras (el de más tráfico), escrita 2026-04-15, nunca optimizada. Ya tenía la estructura ganadora (4 product-cards, tabla, FAQ, igual que atma-freidoras), así que NO le faltaba estructura. El problema era CTR: rankeaba **pos 2-6 para queries de marca con 0 clicks** ("freidora de aire peabody" pos 2.4, "air fryer peabody" pos 2.7, "...opiniones" pos 5.8). Causa principal: **seoTitle de 77 caracteres** (Google lo truncaba). Keyword "freidora de aire peabody" = 5.400/mes (Ubersuggest, SD 37), alto valor. SERP: competimos con TikTok (opiniones), ML/Bidcom (compra), tuquejasuma (quejas) y la web oficial; el ángulo ganador es "opiniones reales + contras honestas" para el que investiga antes de comprar. Cambios: seoTitle 77→52 ("opiniones y cuál conviene"), metaDescription con ángulo honesto + modelo héroe PE-AFD720N, h1 corregido (gramática). OJO canibalización: `atma-vs-peabody-freidora-de-aire` también rankea para queries peabody, vigilar. Re-medir ~2026-07-27.

**producto/carrito-organizador MTL (MLA64582730) (2026-06-29):** ficha ya completa (última opt. 2026-04-11). Anomalía: rankeaba **pos 3.7 con 216 impresiones y 0 clicks**. GSC anonimizó las queries (muchas micro-queries transaccionales). La SERP de "carrito organizador" (1.900/mes, Ubersuggest) está copada por Shopping/ML, así que el techo de una ficha-review es bajo. Cambios: seoTitle con ángulo ("¿conviene?"), metaDescription honesta (estaba genérica y pasada de 155), arreglo de un pro VIEJO ("54% OFF a $29.990" cuando hoy vale $70.000), rating contradictorio (texto 4.2/5 vs campo 4.6/43, alineado a 4.6/43), y limpieza de guiones largos + emojis (⚠️/⭐) en todo el bloque. Expectativa moderada por la SERP transaccional. Re-medir ~2026-07-27.

**masajeador-gadnic (2026-06-28):** guía nueva (11 días), sin baseline en GSC todavía. No se re-optimizó por ser muy nueva (mismo criterio que `mejor-aspiradora-robot`). Sí se hizo un cambio de contenido puntual: el asiento Sauce (MLA19712537) quedó discontinuado en ML, se reemplazó por el Gadnic Acacia (MLA21263803, shiatsu, 4.7, ~$438.000) y se pasaron los links de afiliado a meli.la propios. `updatedDate` → 2026-06-28. Medir en la próxima tanda.

**mejores-freidoras-de-aire-argentina (2026-06-28):** guía pilar que la tanda del 26-06 NO había tocado (plateau real, nunca modificada desde 04-15). `*` = baseline de ventana 28 días (snapshot GSC propio 2026-06-26 vía el lector `scripts/gsc/`), no de 3 meses como el resto de la tabla. **Bug crítico encontrado y corregido:** los 20 links de afiliado "Ver en Mercado Libre" estaban rotos (`https://productosvirales.com.arhttps://meli.la/...` → 404); se arreglaron los 20 + 4 en atma-review + 4 en peabody-review (28 en total, la guía rankeaba sin monetizar). Optimización: seoTitle afilado a 57 car. con keyword al inicio e intención ("cuál comprar"), meta ≤155, bloque de respuesta directa tras el "Resumen rápido" para ganar el snippet de "cuál es la mejor freidora de aire en argentina" (pos 11), `updatedDate` → 2026-06-28. Contenido ya robusto (20 modelos + tabla + FAQ), no se reescribió. Medir en la próxima tanda.

**Qué se hizo en la tanda 2026-06-26 (resumen):** las 18 se llevaron al estándar de embudo de la skill (respuesta directa + tabla comparativa + pros/contras + FAQ + CTAs), se reforzó el enlazado interno hacia los hubs de cada silo, se dedujeron los heros duplicados (cada guía con imagen única), se limpiaron anglicismos crudos y se actualizó `updatedDate` a 2026-06-26. `mejor-aspiradora-robot` se revisó pero se dejó igual por ser muy nueva (18 días).

**Silo cocina (nuevo, STAGED — sin publicar, 2026-06-28):** 7 guías creadas y optimizadas el mismo día con investigación de fabricante (potencia de salida real vs consumo, garantías, convección confirmada, temperatura máx, dimensiones) ANTES de publicar: `microondas`, `horno-electrico`, `horno-electrico-vs-microondas`, `microondas-bgh`, `microondas-atma`, `horno-atma`, `robot-de-cocina`. Todas con `publishedDate: 2026-09-01` (ocultas hasta que Google procese las tandas anteriores). **Sin baseline GSC todavía** (nunca estuvieron en vivo). Optimización: seoTitles 52-54 car. con keyword al inicio, metas ≤155, fichas con datos técnicos verificados de fabricante y garantías. Correcciones factuales de la investigación: el BGH 65L NO pide toma de 20A (la ficha oficial dice 10A; el 20A era de otro modelo), el BGH 23L SÍ tiene grill, el "1500W" del BGH 28L es consumo (salida real 900W), Smartlife tiene 2 años de garantía (diferenciador), LG da 10 años al magnetrón. Medir una vez publicadas + crawleadas.

**mouse-gamer (creada 2026-07-01, STAGED):** guía nueva del silo gaming, creada con la skill en modo CREAR y specs verificadas contra fabricante (Logitech/Redragon: sensor, DPI real, peso, batería, garantía). Sin baseline (nunca publicada); `publishedDate: 2026-09-01`. Keyword "mouse gamer" (4.400/mes, KD 19). Medir desde el día uno cuando se publique con el resto del silo gaming. Recordatorio al publicar: restaurar los internalLinks de `silla-gamer` hacia los satélites gaming.

**monitor-gamer (creada 2026-07-01, STAGED):** guía nueva que cierra el contenido core del silo gaming (skill en modo CREAR, specs verificadas contra fabricante: panel, Hz reales, puertos, curvatura). Sin baseline (nunca publicada); `publishedDate: 2026-09-01`. Keyword "monitor gamer" (3.600/mes, KD 11). Correcciones del research: CRG5 es 4ms GtG y 1800R (no 1ms/1000R), G5 del catálogo ML = LS27AG550 (165Hz por DP confirmado), Gigabyte es "HDR Ready" (no HDR10 certificado), y el Philips más vendido es 75Hz de oficina (presentado honesto). Medir desde el día uno cuando se publique el silo.

**secador-de-pelo (creada 2026-07-02, STAGED):** guía pilar nueva, primera del silo `cuidado-personal` (creada con la skill `optimizador-guias-pv` en modo CREAR). Productos traídos vía API oficial de ML (client_credentials), rankeados por `reviewCount` como proxy de ventas dentro de la categoría "Secadores de Pelo" (MLA4597): Daewoo DHD-7007 (8.633 reseñas), Spica SP-1900 (2.067), Silfab By-520S (433), Yelmo SC-3630 (330), Vanta 3800 Mini Compact (948) y GA.MA Italy Brilliant Blue Titanium (100). Specs verificadas contra fabricante donde existe sitio oficial: Yelmo (yelmo.com.ar, confirma motor AC profesional 2200W) y GA.MA Italy (gamaitalyonline.com.ar, confirma motor DC real 2200W, línea "Secadores Motor DC"); el resto (Daewoo, Spica, Silfab, Vanta) son marcas sin fabricante rastreable online, sostenidas con ficha técnica ML + reseñas (caso normal según `docs/fichas.md`). Sin baseline (nunca publicada); `publishedDate: 2026-09-01`. Keyword "secador de pelo" (27.100/mes, KD 14). **Links de afiliado:** los 6 `meli.la` reales ya fueron generados por Juan y aplicados en `curated-products.ts` (02-jul). Medir desde el día uno cuando se publique junto con `maquina-de-afeitar` y `cortadora-de-pelo` (ver `docs/clusters/cuidado-personal/NEXT_ARTICLES.md`).

**maquina-de-afeitar (creada 2026-07-02, STAGED):** guía satélite del silo `cuidado-personal`, enlazada en ambos sentidos con el pilar `secador-de-pelo` (creada con la skill `optimizador-guias-pv` en modo CREAR). Anti-canibalización: "máquina de afeitar" y "afeitadora eléctrica" son el mismo producto → una sola guía (no dos); "cortadora de pelo" (corta longitud, no afeita a ras) queda para una guía futura y no comparte productos. Productos traídos vía API oficial de ML, rankeados por `reviewCount` dentro de la categoría "Afeitadoras Eléctricas": GA.MA Italy G-Blade Wet & Dry (1.134 reseñas, #1 la más vendida), Kemei KM-1102 (38, #2 la más económica), GA.MA Italy GSH700 Tracker (308, #3 doble pista + trimmer retráctil), Wahl Travel Shaver 7 Piezas (181, #4 kit de viaje), Remington R31A (213, #5 única rotativa) y GA.MA Italy GSH987 Sport (142, #6 premium wet&dry). Se excluyeron candidatos con más reseñas que en realidad eran recortadoras de barba/pelo o repuestos de cabezal (no son afeitadoras a ras) para no listar productos mal categorizados. Specs verificadas contra fabricante en gamaitalyonline.com.ar para las 3 GA.MA Italy (confirma sistema Double Track, cuchillas flotantes, autonomía); Kemei, Wahl y Remington sin fabricante rastreable online, sostenidas con ficha técnica ML + reseñas (caso normal según `docs/fichas.md`). No se encontró ningún producto tipo OneBlade (híbrido trim/shave) con ofertas activas en la API — se cubre el concepto de forma educativa en "cómo elegir" y en una FAQ, sin inventar un pick. Sin baseline (nunca publicada); `publishedDate: 2026-09-01`. Keywords "máquina de afeitar" (8.100/mes) + "afeitadora eléctrica" (4.400/mes) combinadas en una sola guía. **Links de afiliado:** los 6 `meli.la` reales ya fueron generados por Juan y aplicados en `curated-products.ts` (02-jul). Medir desde el día uno cuando se publique junto con `secador-de-pelo` y `cortadora-de-pelo` (ver `docs/clusters/cuidado-personal/NEXT_ARTICLES.md`).

**cortadora-de-pelo (creada 2026-07-02, STAGED):** guía satélite del silo `cuidado-personal`, cierra el silo según `plan.md`. Enlazada en ambos sentidos con el pilar `secador-de-pelo` y con `maquina-de-afeitar` (creada con la skill `optimizador-guias-pv` en modo CREAR). Anti-canibalización explícita en la guía: una cortadora corta longitud con peines guía, una máquina de afeitar rasura al ras (guía distinta); se excluyeron candidatos de pet-grooming, kits de navajas de afeitar manuales mal categorizados como "cortadora" (ej. Gadnic Kit Barbería con porta-navajas) y trimmers de barba solamente. Productos traídos vía API oficial de ML (categoría "Cortadoras de Pelo" MLA5411), rankeados por `reviewCount`. Ranking inicial (v1): Remington HC5850 (#1), Philco HC9901PN (#2, económica), Wahl Magic Clip (#3, profesional), Gadnic CP140 (#4, inalámbrica), Vanta Patillera 1100 (#5, pantalla digital), Philco HC9902PN (#6, más peines). **Al generar los links de afiliado, MercadoLibre rechazó las 2 fichas Philco** ("Esta URL no está permitida en el Programa") — se marcaron `visibility: 'deprioritized'` (no se borraron, per regla de contenido editorial) y se reemplazaron en el ranking (v2, misma sesión) por Kemei KM-1951 (21 reseñas, #2 la más económica, $24.240, mejor calificación de la guía con 4.9) y Teknikpro Silver (19 reseñas, #6 la "multigroomer", funciona con o sin cable, cuchilla especial para dibujos). Specs verificadas contra fabricante: Remington (remingtoncolombia.com / remingtonlatam.com, regional LatAm), Wahl (ar.wahl.com, sitio argentino) y Gadnic (gadnic.com.ar); Vanta, Kemei y Teknikpro sin fabricante rastreable online, sostenidas con ficha ML + reseñas (caso normal según `docs/fichas.md`). Sin baseline (nunca publicada); `publishedDate: 2026-09-01`. Keyword "cortadora de pelo" (2.900/mes). **Links de afiliado:** 4 de 6 ya generados y aplicados (Remington, Wahl, Gadnic, Vanta); faltan Kemei KM-1951 y Teknikpro Silver, los 2 reemplazos nuevos. Con esta guía el silo `cuidado-personal` queda completo (3 de 3 guías del plan); medir desde el día uno cuando se publiquen juntas.

**Silo gaming publicado (2026-07-02, 2da tanda):** las 4 guías satélite (auriculares-gamer, teclado-gamer, mouse-gamer, monitor-gamer) pasaron de STAGED a publicadas; el pilar silla-gamer ya estaba en vivo (01/07) y se le restauraron los internalLinks hacia los 4. Sin baseline (guías nuevas); publishedDate=updatedDate=2026-07-02. Auditoría Fase 4 OK (seoTitle 50-52, meta 143-154, FAQ 5-6, afiliados limpios, hub-and-spoke completo). Medir desde el día uno; los guiones largos en h3 son convención del sitio (igual que freidoras/cafeteras). Re-medición del lote junio: ~20-24 de julio.

> Las fichas de producto (`/producto/`) se trackean aparte en [`seo-tracking-productos.md`](seo-tracking-productos.md).

---

## Mediciones posteriores

> Agregar acá cada re-medición. Formato sugerido: una subsección por fecha de export, con las URLs que cambiaron y el delta contra el baseline (o contra la medición anterior).

### Próxima medición agendada: ~2026-07-24 (≈4 semanas)

_(pendiente: exportar GSC del sitio completo y comparar contra el baseline)_

<!--
Plantilla para cada medición nueva:

### Medición AAAA-MM-DD (export GSC últimos 3 meses)

| Slug | Impr (antes→ahora) | Clicks (antes→ahora) | Pos (antes→ahora) | Lectura |
| :-- | :-- | :-- | :-- | :-- |
| ejemplo-slug | 343 → 520 | 1 → 6 | 7.10 → 5.8 | CTR recuperado + subió posición |
-->
