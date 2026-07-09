# Tracking de optimizaciones de fichas de producto (SEO)

> Archivo interno de seguimiento de las páginas `/producto/`. Registra el estado **ANTES** de optimizar cada ficha (baseline en GSC) para poder medir la evolución después.
> Gemelo de `seo-tracking-optimizaciones.md`, que es para las guías `/guias/`. Se mantienen separados para no mezclar.
>
> **Regla de oro:** el baseline NO se pisa. Cuando re-medimos, agregamos una sección nueva con la fecha, no reemplazamos el número viejo. Así se ve la curva real.

---

## Cómo usar este archivo

1. **Antes de optimizar** una ficha, buscala en la tabla "Baseline". Si está, ese era su estado previo (impresiones, clicks, posición). Sirve para saber de dónde partimos.
2. **Después de optimizar**, agregá o actualizá la fila: completá `Optimizada` con la fecha (`AAAA-MM-DD`) y dejá el baseline intacto.
3. **Para medir evolución** (a las ~3-4 semanas de optimizar): exportar GSC del **sitio completo** (no filtrado por query), últimos 3 meses. Comparar impresiones / clicks / posición actuales contra el baseline. Anotar el resultado en la sección **"Mediciones posteriores"** con su fecha.
4. **Criterio de éxito** por tipo de cambio:
   - Snippet/CTR (title y meta): subió el CTR a misma o mejor posición.
   - Empuje de ranking (enlazado interno, profundidad): bajó el número de posición (ej. 10 → 6).
   - Página nueva o página 2: aparecieron impresiones/clicks que antes no estaban.

### Notas de medición
- `Pos` = posición media en GSC (más bajo es mejor). `n/d` = sin datos suficientes para promediar.
- `CTR` = clicks / impresiones del período.
- Las URLs son `https://productosvirales.com.ar/producto/<slug>`.
- El freno de CTR en estas fichas no suele ser el snippet sino la **posición** (puesto 7-10) en una SERP transaccional dominada por MercadoLibre. La palanca real de posición es el enlazado interno + autoridad de dominio.

---

## Baseline (snapshot GSC 2026-06-28, período 8 abr – 26 jun)

Primera tanda de optimización de páginas `/producto/` (2026-06-28). Hallazgo: el 80% de las fichas con tráfico **ya estaban optimizadas** (seoTitle + metaDescription + veredicto + FAQ). El laburo real fue acotado: completar las pocas que corrían con el título crudo de ML, dos retoques de gancho/FAQ en las páginas top, y enlazado interno desde guías de marca hacia su ficha.

| Ficha (id ML) | Impr | Clicks | Pos | CTR | Qué se hizo | Optimizada |
| :-- | --: | --: | --: | --: | :-- | :-- |
| MLA47275624 (pava Peabody PE-DK2200N) | 554 | 7 | 6.94 | 1.3% | meta con gancho mate | 2026-06-28 |
| MLA39861162 (freidora Atma FR248ABP 8L) | 196 | 0 | 8.24 | 0% | link interno desde guía Atma | 2026-06-28 |
| MLA38663195 (lámpara velador Dakota) | 70 | 0 | 7.66 | 0% | metaDescription nueva | 2026-06-28 |
| MLA43422049 (cepillo eléctrico 9 en 1) | 67 | 1 | 6.66 | 1.5% | metaDescription nueva | 2026-06-28 |
| MLA43928643 (proyector Gadnic P-3129) | 66 | 0 | 8.59 | 0% | metaDescription nueva | 2026-06-28 |
| MLA1454279831 (velador mesa USB-C) | 63 | 0 | 8.05 | 0% | seoTitle + meta nuevos | 2026-06-28 |
| MLA43926951 (proyector Android HY300 9000lm) | 50 | 1 | 7.74 | 2.0% | seoTitle + meta nuevos | 2026-06-28 |
| MLA62320294 (freidora Ninja Crispi 5.2L) | 44 | 0 | 16.59 | 0% | seoTitle + meta nuevos | 2026-06-28 |
| MLA24692647 (proyector LED Dakota 8500lm) | 34 | 1 | 11.74 | 2.9% | metaDescription nueva | 2026-06-28 |
| MLA42113760 (freidora Kanji Home 8L) | 34 | 0 | 10.06 | 0% | meta nueva + link interno desde guía Kanji | 2026-06-28 |
| MLAU3407622515 (perfume Jamal árabe) | 32 | 2 | 8.06 | 6.2% | seoTitle + meta nuevos | 2026-06-28 |
| MLA38719920 (secador vidrios Kiokio) | 30 | 0 | 12.20 | 0% | metaDescription nueva | 2026-06-28 |
| MLA19053146 (Bharara King EDP) | 19 | 0 | 6.26 | 0% | FAQ alineada a query "árabe o americano" | 2026-06-28 |

---

## Silo gaming (STAGED, sin publicar — enriquecido 2026-06-30)

Las 17 fichas gaming importadas de ML en jun 2026 estaban **peladas** (solo specs + description, sin seoTitle/verdict/pros/cons/articleBody/faq). Se llevaron al estándar de oro de `/producto/` el 2026-06-30: investigación de specs reales contra el sitio del fabricante (Alpina, Cougar, Corsair, Redragon, HyperX, Aula, Logitech, Razer, Kotion) y desmentido de exageraciones típicas del nicho (7.1 surround que es virtual y solo en PC, RGB por zonas vs por tecla, layouts sin ñ, pesos máximos inflados, apoyabrazos fijos que la publicación no aclara). **Sin "Voz del comprador"**: la API de opiniones de ML está cerrada, así que los contras salen de specs y límites técnicos reales, no de reseñas. **Sin baseline GSC** (nunca estuvieron en vivo). Precio/rating/reviewCount se mantuvieron tal cual del bloque (datos reales de ML).

| Tipo | Fichas (id ML) |
| :-- | :-- |
| Sillas | MLA47061669 (Alpina FT-088), MLA26019250 (Cougar Armor Elite), MLA69124616 (Cougar Fusion EX), MLA47084299 (Alpina PRE-FT055), MLA16171813 (Corsair T3 Rush) |
| Teclados | MLA16369071 (Redragon Kumara K552), MLA14075573 (HyperX Alloy Core), MLA57380272 (Aula F75), MLA8906508 (Logitech G213), MLA19893399 (Redragon K622 Horus), MLA16085611 (Razer Huntsman Mini) |
| Auriculares | MLA9406415 (Kotion Each G9000), MLA16280514 (Razer BlackShark V2 X), MLA18651915 (Logitech G435), MLA8732921 (HyperX Cloud Alpha), MLA58836044 (Redragon Ire Pro H848), MLA16269737 (Logitech G733) |

Medir una vez publicadas + crawleadas.

---

## Monitores gaming (STAGED, sin publicar — enriquecidos 2026-07-03/04)

Las 7 fichas de monitores importadas de ML en jul 2026 estaban **peladas** (solo specs cortas + description, sin seoTitle/verdict/pros/cons/articleBody/faq/customerReviews). Se llevaron al estándar de oro de `/producto/` producto por producto, con la skill `optimizador-productos-pv`.

**Bloqueo de API encontrado en el camino:** la API oficial de ML dejó de funcionar por completo durante esta sesión (401 `access not granted by applications` en todo, incluso endpoints públicos) — la app quedó **bloqueada** por MercadoLibre (hipótesis: `INTEGRATORS_DATA_INFRACTION`, ticket de soporte ODDS-20643 abierto, ver memoria `ml-api-401-access-not-granted`). Esto tumbó también `prices:check`/`update`. Se resolvió el enriquecido igual: specs y rating/reviewCount ya cargados (frescos, del 02-jul) + verificación de specs contra la página oficial del fabricante por web (Samsung, Noblex, Philips, Xiaomi, Gigabyte) + **reseñas reales pegadas a mano por Juan** desde MercadoLibre para cada uno de los 7 (a diferencia del silo gaming de sillas/teclados/auriculares, que no tuvo "Voz del comprador" por el bloqueo de la API de opiniones; acá sí hay reseñas reales citadas).

Hallazgos de honestidad por ficha (marketing vs. realidad, cruzado contra reseñas + fabricante):

| Ficha (id ML) | Modelo | Hallazgo principal |
| :-- | :-- | :-- |
| MLA63267892 | Samsung Odyssey G3 G30D 24 180Hz | Viene en 60Hz de fábrica, hay que activar los 180Hz desde el menú del monitor (no Windows); panel VA, no todas las unidades traen cable HDMI |
| MLA43961816 | Samsung Odyssey CRG5 24 Curvo 144Hz | La ficha declara VESA 75x75; ≥5 reseñas independientes confirman que **no** trae los agujeros de fábrica. Ghosting real a 144Hz en oscuros, mitigable a 120Hz |
| MLA45717120 | Noblex NXSM2700 27 IPS 100Hz | Único panel IPS de la selección; la versión actual trae **2 HDMI** (no 1 como en algunas fichas); sin G-Sync/FreeSync Premium |
| MLA43960948 | Philips 241V8L 24 FHD | El más vendido del catálogo (2.468 calificaciones); honesto: **no sirve para gaming** (ghosting, contraste débil confirmado por review de 50 útiles); "75Hz" real ronda 74Hz sobre panel nativo de 60Hz |
| MLA45717136 | Noblex NXSM2200 22 100Hz | Mismo truco del 60Hz de fábrica; el modo "1ms real" oscurece tanto la pantalla que casi nadie lo usa (confirmado por reseña); pie se inclina pero es fácil de romper si se ajusta con la pantalla montada |
| MLA43960827 | Samsung Odyssey G5 27 QHD 165Hz | Pocas opiniones (26, declarado de frente en la ficha); mismo patrón de cable HDMI no incluido pese a figurar en la publicación |
| MLA43960787 | Xiaomi G34WQi 34 Ultrawide 180Hz | La publicación dice panel **IPS**; es VA, confirmado por el fabricante y por reseñas independientes de Argentina, México y Colombia |
| MLA28853185 | Gigabyte GS34WQC 34 Ultrawide | Mejor puntaje de los 7 (4.9); HDR "Ready" no certificado, reseñas lo confirman como básico; ángulos de visión limitados típicos de VA |

Precio/rating/reviewCount actualizados a lo más fresco disponible (specs de fabricante + reseñas pegadas por Juan el 2026-07-03/04; reviewCount de algunos productos difiere del que trajo la API en jul porque se tomó el número visto en vivo en ML al momento de pegar las reseñas). Sin baseline GSC (nunca estuvieron en vivo).

Medir una vez publicadas + crawleadas.

---

## Mouse gamer (STAGED, sin publicar — enriquecidos 2026-07-04)

Las 6 fichas de mouse gamer importadas de ML en jul 2026 estaban **peladas** (mismo patrón que los monitores: solo specs cortas + description, sin seoTitle/verdict/pros/cons/articleBody/faq/customerReviews). Mismo método que los monitores: API de ML seguía bloqueada (ver [[ml-api-401-access-not-granted]]), así que specs/rating/reviewCount ya cargados + verificación de specs contra la página oficial del fabricante (Logitech G, Redragon) + **reseñas reales pegadas a mano por Juan** desde MercadoLibre para cada uno de los 6.

Hallazgos de honestidad / técnicos por ficha:

| Ficha (id ML) | Modelo | Hallazgo principal |
| :-- | :-- | :-- |
| MLA44849297 | Logitech G203 Lightsync | El más vendido del catálogo (52.576 calificaciones); preocupación recurrente por falsificaciones (cajas con sellos rotos, mayoría confirma original vía G HUB); switches Omron de 10M clics (vs 50M de gama alta) |
| MLA11259955 | Logitech G305 Lightspeed | Viene en modo ahorro de fábrica (125Hz de polling, no 1.000Hz) hasta que se cambia en G HUB; receptor Lightspeed propietario, sin reposición oficial si se rompe |
| MLA17743447 | Redragon Centrophorus M601 RGB | El más barato del catálogo; reseña técnica confirma que el sensor Pixart 3317 pierde precisión con DPI bajo y movimientos rápidos/bruscos, no recomendado para competitivo exigente |
| MLA40568693 | Logitech G309 Lightspeed | Sucesor directo del G305: resuelve el problema de doble clic que ese modelo desarrolla a los 3-4 años, pero la batería dura bastante menos (~1 mes intensivo vs 3 del G305) |
| MLA14428767 | Logitech G Pro Wireless | Mismo sensor HERO 25K que el PRO X Superlight 2 (10g más pesado, teflón común); de 7 ranuras de botones laterales, el software solo reconoce 5 simultáneas |
| MLA28598537 | Logitech PRO X Superlight 2 | Tope de gama (60g); el modo 8.000Hz de polling baja la batería a ~20h (vs 95h estándar); varias reseñas de distintos países cuestionan si el precio se justifica |

Precio/rating/reviewCount actualizados a lo más fresco disponible (mismo criterio que monitores: número visto en vivo en ML al pegar las reseñas, no el de la API). Sin baseline GSC (nunca estuvieron en vivo).

Medir una vez publicadas + crawleadas.

---

## Fix masivo: metaDescription faltante (2026-07-04)

Un audit de Ahrefs detectó que 38 fichas del cluster "bazar" (limpieza de vidrios, mopas, veladores/tiras LED, freidoras de aire, pavas eléctricas, mini-proyectores) mostraban en `<meta name="description">` el texto **crudo scrapeado del vendedor de ML** (mayúsculas sostenidas, cortado a mitad de frase a los 300 caracteres). Causa raíz: `generateMetadata` en `src/app/producto/[slug]/page.tsx` cae a `product.description` (el campo crudo) cuando `product.metaDescription` está vacío — y en estas 38 fichas estaba vacío. El resto del contenido editorial (`verdict`/`pros`/`cons`/`articleBody`) ya estaba bien curado en cada una; el problema era puntual a ese campo.

Se completó `metaDescription` en las 38, derivada del `verdict` ya existente (sin reescribir la ficha). Verificado en build + HTML servido en vivo.

**Nota:** 6 de estas 38 (MLA38663195, MLA1454279831, MLA43928643, MLA24692647, MLA42113760, MLA38719920) ya figuraban en el baseline del 2026-06-28 arriba como "metaDescription nueva" — pero el campo estaba vacío en el código antes de este fix. Posible pérdida de un cambio no commiteado en esa sesión. No investigado a fondo, queda anotado por si se repite.

| id ML | Categoría |
| :-- | :-- |
| MLA62915210, MLA214572440, MLA65086798, MLA24824959, MLA33974728, MLA23485318, MLA38663276, MLA156843560, MLA57493486, MLA52016063, MLA24314471, MLA22894851, MLA45107869, MLA23571779, MLA3514734808, MLA1360766060, MLA20032873, MLA3372015976, MLA44863825, MLA23532244 | Hogar (vidrios, mopas, veladores/tiras LED, cepillos, aspiradora) |
| MLA2351761364, MLA62559448, MLA1100090508, MLA19589524, MLA15276005, MLA27849823, MLA11145437, MLA8993736, MLA28709303, MLA41041543, MLA36974228, MLA44142280, MLA54106293 | Cocina (organizadores, pavas, freidoras) |
| MLA52364259, MLA42238146, MLA43932163, MLA22975097, MLA42796008 | Tech (mini-proyectores) |

Sin baseline GSC propio (ninguna de estas 38 tenía fila en este archivo antes). Medir en ~4 semanas si Google actualiza el snippet en SERP.

---

## Lote perfumes árabes: 31 fichas (skill `optimizador-productos-pv`, arranca 2026-07-09)

Lote de 31 fichas de perfumes árabes procesadas una por una (modo OPTIMIZAR sobre fichas ya existentes en `curated-products.ts`). Se agrega una fila por ficha a medida que se procesan.

| Ficha (id ML) | Producto | Qué se hizo | Optimizada |
| :-- | :-- | :-- | :-- |
| MLA24605489 | Al Wataniah Bareeq Al Dhahab EDP 100ml (hombre) | Ficha estaba pelada (solo pros/cons/verdict cortos, sin articleBody/specs/faq/customerReviews/relatedProducts). Se completaron las 11 secciones del estándar de oro. Research en vivo por Chrome: `reviewCount` real es **6.075** (la ficha tenía 1.946 desactualizado) con rating 4.6; se corrigió también un pro falso ("Rating 5/5") y un con obsoleto ("comunidad de reviews chica", ya no aplica con ese volumen). Al Wataniah **sí tiene sitio oficial verificable** (alwataniah.com), caso no tan común en perfumes árabes de casas chicas: notas cruzadas y coincidentes entre ML y el fabricante (salida azafrán/pimienta/rosa, corazón oud/pachulí/caramelo, fondo almizcle/incienso/ámbar). 4 `customerReviews` reales citadas (3 positivas + 1 de 4 estrellas con matices reales, no hay reseñas negativas de peso en el desglose de estrellas del producto). `relatedProducts`: Qaed Al Fursan (MLA22234109), Kingdom Man (MLA41178086), Afnan 9PM (MLA19846768). Enlazado interno: ya estaba mencionada en `perfumes-arabes-amaderados` y `perfumes-arabes-precio-argentina`; **pendiente** sumarle un link desde la guía pilar `perfumes-arabes` en `guides.ts` (no tocado en esta corrida a propósito: ese archivo ya tenía cambios sin commitear de otra sesión). Se limpiaron guiones largos y se ajustó el precio hardcodeado de la copy SEO (sub-$33.000 → sub-$35.000, el precio real subió). Verificación: `npx tsc --noEmit` limpio. | 2026-07-09 |
| MLA22234109 | Lattafa Qaed Al Fursan EDP 90ml (unisex, vendido en AR como hombre) | Ficha tenía pros/cons/verdict pero le faltaban articleBody/specs/faq/customerReviews/relatedProducts (no existía ese campo en el objeto). Research en vivo por Chrome: `rating`/`reviewCount` estaban muy desactualizados (4.6/879 → real **4.8/8.704**). **Hallazgo grande de honestidad**: la pirámide olfativa que traía la ficha (top cardamomo/azafrán/bergamota, corazón oud/rosa/pachulí, base almizcle/cuero/ámbar gris) no coincide con ninguna fuente verificable. Se corrigió cruzando la descripción propia del vendedor en ML ("apertura con ananá/piña, acordes cálidos y amaderados") contra Fragrantica (ficha `Qaed-Al-Fursan-67996`, lanzamiento 2016, familia Oriental Amaderada, top piña/azafrán, corazón abeto balsámico/jazmín, base cedro/ámbar/oud) y contra 3 perfumerías argentinas independientes (Perfumia, Perfumistas.com.ar, Ambrosía) que confirman la misma pirámide; las notas nuevas quedaron reflejadas en `notes` + `notesDisclaimer` explicando la discrepancia con la propia tabla de specs de ML (que trae "almizcle, musgo de roble, vainilla" y familia "Frutales", un dato genérico de categoría). También se corrigió: duración (la ficha decía 10-12h; el vendedor declara 8h, con `durationOfficial`/`durationDisclaimer` documentando 2 reseñas negativas de duración de minutos con olor a alcohol); estación/ocasión (la ficha la encasillaba en otoño-invierno-noche; se ajustó a primavera-verano/uso diario, más acorde al perfil frutal dulce); género (`gender` pasó de "Hombre" a "Unisex" ya que Lattafa la lanza y vende para hombre y mujer, aunque en ML Argentina figura catalogada como perfume de hombre, documentado en specs y copy); y se desmintió el campo "Versión: Nicho" de la tabla de características de ML (Lattafa es una casa comercial grande, no un perfumista de nicho). 4 `customerReviews` reales (2 México 5★, 1 Argentina 4★, 1 Argentina 1★ crítica real sobre olor a alcohol). `relatedProducts` agregado (no existía): Bareeq Al Dhahab (MLA24605489), Kingdom Man (MLA41178086), Asad Intense (MLA19715215), con links cruzados en el `articleBody` + mención de la guía pilar `perfumes-arabes` (no se tocó `guides.ts`). Sin advertencias de stock; el precio guardado ($41.183, actualizado 2026-07-08) sigue dentro del rango visto en vivo. Verificación: `npx tsc --noEmit` limpio. | 2026-07-09 |
| MLA54145870 | Lattafa Habik For Men EDP 100ml (hombre) | Ficha estaba pelada (solo description/pros/cons/verdict cortos y con datos falsos: "rating 5/5" cuando el real es 4.8, y `reviewCount` desactualizado en 69). Research en vivo por Chrome: `reviewCount` real es **253** (rating 4.8 ya estaba bien). **Cruce fuerte de honestidad, esta vez favorable**: la pirámide olfativa de la ficha de ML (specs + descripción del vendedor) coincide nota por nota con Fragrantica (ficha `Habik-For-Men-110353`, lanzamiento 2025, familia Amaderada Aromática, 917 votos y 4.12/5 independientes de ML) — salida cardamomo/pimienta/abrótano/bergamota, corazón lavanda/canela/salvia, fondo haba tonka/sándalo/pachulí/almizcle/amberwood; único matiz, el vendedor usa "absenta" y "madera de ámbar" en la descripción corta en vez de "abrótano" y "amberwood", documentado en `notesDisclaimer` como la misma nota sin contradicción real. Se corrigió la duración: la ficha no traía dato, el vendedor declara 12h en la publicación pero ninguna reseña la confirma (una compradora de México reporta 2-6h, otra de Brasil describe 8h de fijación con solo 2h de proyección real), documentado en `durationOfficial`/`durationDisclaimer`. Se sumó `comparedTo`: los compradores comparan el perfume con Lattafa Asad ("un Asad pero dulzón y más especiado") y con el discontinuado Jean Paul Gaultier Le Male, coincidiendo ambas comparaciones con las fragancias similares que sugiere el propio algoritmo de Fragrantica. 4 `customerReviews` reales (3 positivas + 1 de México con 4★ y quejas reales de duración y arrepentimiento de compra). `relatedProducts` agregado (no existía): Asad Intense (MLA19715215), Qaed Al Fursan (MLA22234109), Kingdom Man (MLA41178086), con links cruzados en el `articleBody` + mención de la guía pilar `perfumes-arabes` (no se tocó `guides.ts`). Sin advertencias de stock; precio guardado ($59.999) no se tocó (fuera del alcance de esta skill, aunque en vivo se vio a $55.000 el día de la research). Verificación: `npx tsc --noEmit` limpio. | 2026-07-09 |
| MLA29077943 | Perfume Vintage Radio Lattafa Pride 100ml (unisex) | Ficha ya tenía meta+SEO, h1, pros/cons/verdict y bestSeason/Occasion, pero le faltaban articleBody/specs/faq/customerReviews/relatedProducts. Research en vivo por Chrome (ML + Fragrantica): `rating`/`reviewCount` estaban muy desactualizados (4.6/170 → real **4.8/1.457**, con 913 comentarios), y `soldQuantity` (500 → 1.000+). **Dos hallazgos grandes de honestidad**: (1) `gender` decía "Hombre" y es incorrecto — ML lo marca como "Sin género", el propio vendedor lo describe como "un perfume sin género" en la descripción, y Fragrantica lo cataloga como fragancia para mujeres y hombres (lanzamiento 2023, confirmado también por ML); se corrigió a "Unisex" y se reescribió toda la copy (description/pros/verdict/articleBody) que asumía "para hombre". (2) La pirámide olfativa anterior (top cardamomo, corazón rosa/ámbar gris/cuero) no coincide ni con Fragrantica (ficha `Vintage-Radio-89454`: top lavanda/salvia/bergamota, corazón ciruela/palo santo/pimienta negra, base sándalo/oud) ni con la propia ficha técnica de ML (limón/bergamota/lavanda/salvia/pimienta/sándalo, sin oud); se reemplazaron las notas por la pirámide de Fragrantica y se documentó la discrepancia con ML en `notesDisclaimer`. También se corrigió la duración: la ficha decía "8-10 horas" sin respaldo; ML declara 6h oficiales y la reseña más útil (41 votos) confirma 5-6h reales, caso raro donde el dato oficial no está inflado (`durationOfficial`/`durationDisclaimer`), y se bajó `projection` de "Media-alta" a "Media". Se eliminó un con falso ("500 unidades, comunidad de reviews chica") que ya no aplica con 913 comentarios reales. 4 `customerReviews` reales extraídas de Mercado Libre vía JS del iframe de opiniones (3 positivas de México/Brasil + 1 crítica de Argentina, 2★, parafraseada para sacar una expresión coloquial despectiva sin alterar el sentido de la queja). `relatedProducts` agregado: Qaed Al Fursan (MLA22234109), Asad Intense (MLA19715215), Habik For Men (MLA54145870), con links cruzados en el `articleBody` + mención de la guía pilar `perfumes-arabes` (no se tocó `guides.ts`). Sin advertencias de stock; precio guardado ($61.700) coincide con la mejor oferta vista en vivo (vendedor "jye store"). Verificación: `npx tsc --noEmit` limpio. | 2026-07-09 |

---

## Mediciones posteriores

> Agregar acá cada re-medición. Formato sugerido: una subsección por fecha de export, con las URLs que cambiaron y el delta contra el baseline (o contra la medición anterior).

### Próxima medición agendada: ~2026-07-26 (≈4 semanas)

_(pendiente: exportar GSC del sitio completo y comparar las 13 fichas contra el baseline 2026-06-28)_

<!--
Plantilla para cada medición nueva:

### Medición AAAA-MM-DD (export GSC últimos 3 meses)

| Ficha (id ML) | Impr (antes→ahora) | Clicks (antes→ahora) | Pos (antes→ahora) | Lectura |
| :-- | :-- | :-- | :-- | :-- |
| MLA47275624 | 554 → ___ | 7 → ___ | 6.94 → ___ | ___ |
-->
