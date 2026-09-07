# Estrategia — dónde está el crecimiento y dónde no

> Documento de referencia, no reporte semanal. Los reportes de `docs/seo-reports/` dicen qué hacer esta semana; este dice **por qué**. Escrito el 2026-08-25 con datos del snapshot #42 de Search Console (26/7 a 22/8) y GA4 a 28 días.
>
> Cuando dudes qué tocar, empezá por acá. Cada número tiene su fuente; los que son estimación están marcados como tales.

---

## La tesis en tres líneas

Ganaste la batalla del tráfico: 229.733 impresiones y 3.235 clicks orgánicos en 28 días, con cinco meses de sitio. Lo que está flojo es lo que pasa **después** del click: de esos 3.235 clicks salen ~1.000 clicks de afiliado, y el hueco está concentrado en un solo silo. La palanca de crecimiento hoy **no es rankear mejor, es convertir mejor** — y encima esa palanca no depende del algoritmo ni de esperar 28 días.

---

## 1. El dato que ordena todo: CTR por intención

Todas las queries que están en página 1 (posición < 10), segmentadas por tipo de búsqueda. Están todas en posiciones parecidas, así que se comparan de igual a igual.

| Tipo de búsqueda | CTR | Impresiones | Posición prom. |
|---|---|---|---|
| "dupe de X" / equivalencias | **3,21%** | 934 | 6,5 |
| "el mejor X" / rankings | 2,17% | 10.134 | 6,9 |
| Preguntas (cuál, qué, cómo, dónde) | 2,10% | 10.762 | 6,5 |
| Código o modelo puntual | 1,65% | 788 | 7,1 |
| Producto seco (1-2 palabras) | 1,24% | 4.590 | **5,8** |
| "opiniones de la marca X" | 0,89% | 1.234 | 6,4 |
| "precio de X" | **0,30%** | 1.002 | **5,1** |

**Lo que hay que entender:** las búsquedas de precio están en la mejor posición promedio del sitio (5,1) y convierten diez veces peor que las de dupes, que están más abajo. Producto seco: segunda mejor posición, casi el peor CTR.

Eso no lo arregla ningún título. Cuando alguien busca "tostadora de pan" o "precio cafetera nespresso" quiere **comprar**, y Google le pone arriba el carrusel de Shopping con ML, Fravega y Garbarino. Una guía en el puesto 5 orgánico queda debajo del pliegue.

**Regla que sale de acá:** perseguí preguntas, superlativos y equivalencias. No persigas sustantivos secos ni precios, por más impresiones que tengan.

> ⚠️ **Alcance de esta tabla.** La dimensión `query` de Search Console cubre **62.154 de las 229.733 impresiones del sitio (27%)**: Google anonimiza el resto. Las conclusiones de intención salen de poco más de un cuarto del tráfico. Es la mejor evidencia disponible, pero no es censo.

### El corolario incómodo

La curva de CTR del sitio por posición es baja en todos los puestos: 4,07% en posición 1-3, 2,23% en 3-5, 1,60% en 5-7, 0,97% en 7-10. Un sitio sano en posición 1-3 saca 20-30%. Parte se explica por lo anterior (competís en SERPs llenas de Shopping), parte porque en posición 1-3 tenés 1.337 queries con 3,07 impresiones cada una, o sea cola larguísima y rara. No leas ese 4,07% como un fracaso: leelo como que el techo de este negocio está en las búsquedas de opinión, no en las de compra.

---

## 2. Las dos palancas, medidas

| Palanca | Qué implica | Ganancia estimada / 28 días |
|---|---|---|
| **A — Subir página 2 a página 1** (solo intenciones ganables) | Links internos, contenido, esperar 28 días | +49 clicks orgánicos → **+8 a +14 de afiliado** |
| **B — Convertir mejor el tráfico que ya llega** (top ~20 guías al 26%) | Editar la página, efecto en días | **+376 clicks de afiliado** |

Entre 27 y 47 a 1, sobre una base de ~1.000.

**Cómo sale el cálculo.** En página 2 con al menos 50 impresiones hay 11.363 impresiones en total, de las cuales **4.957 son de intención ganable** (dupe + pregunta + mejor). Subirlas a página 1 suma ~1 punto de CTR → +49 clicks orgánicos. Esos clicks convierten a afiliado entre el 16% (supuesto conservador) y el 29% (la tasa real observada del sitio: 886 clicks de afiliado sobre 3.041 clicks orgánicos a guías) → +8 a +14. La palanca B toma las ~20 guías con más vistas y las lleva al 26% de `cafetera-express`.

**Por qué la palanca A rinde tan poco acá.** Tres multiplicaciones que se comen todo: el volumen ganable en página 2 es flaco; subirlo a página 1 suma 1-2 puntos de CTR, no diez; y solo una fracción de esos clicks llega a un link de afiliado.

**Dónde este modelo puede estar equivocado.** El clasificador manda "perfumes arabes de hombre" (2.079 impresiones, posición 11,4) al cajón de "no perseguir" porque no tiene signo de pregunta ni la palabra "mejor". Eso es probablemente demasiado pesimista: esa guía sí es la respuesta a esa búsqueda, y a posición 5-6 podría hacer 2-3%. Es la excepción conocida a la regla.

---

## 3. Dónde está el hueco de conversión

Vistas GA4 contra clicks de afiliado, 28 días. La referencia son las dos mejores del sitio, que ya están probadas.

| Guía | Vistas | Afiliado | Conversión |
|---|---|---|---|
| `pava-electrica` | 297 | 82 | **27,6%** |
| `cafetera-express` | 288 | 75 | **26,0%** |
| `mejores-freidoras-de-aire-argentina` | 574 | 130 | 22,6% |
| `cocina/horno-electrico` | 135 | 25 | 18,5% |
| `licuadora` | 93 | 14 | 15,1% |
| `cocina/yogurtera` | 174 | 22 | 12,6% |
| `perfumes-arabes-mujer` | 328 | 37 | 11,3% |
| `mejores-perfumes-arabes-hombre` | 273 | 27 | 9,9% |
| `perfumes-arabes-mas-vendidos-argentina` | 230 | 17 | **7,4%** |
| `perfumes-arabes-dupes` | 314 | 18 | **5,7%** |
| `perfumes-arabes-amaderados` | 73 | 2 | **2,7%** |

Las guías de cocina y electro que aparecen en el top de vistas convierten entre **12,6% y 27,6%**; las de perfumes, entre **2,7% y 11,3%**. Y perfumes se lleva el 29,4% de las impresiones del sitio (67.490 de 229.733). Ahí está el grueso del hueco.

Puede que el 26% no sea alcanzable en perfumes: quien lee sobre una cafetera está por comprar, quien mira perfumes muchas veces está paseando. Pero incluso con un objetivo conservador del 15%, el silo solo da **+82 clicks de afiliado**: dupes +29, más-vendidos +18, hombre +14, mujer +12, amaderados +9.

> ⚠️ `ga4.py overview` devuelve solo las 25 páginas más vistas, así que no se puede calcular la conversión de un silo completo — solo de las guías que entran en ese top. Las cifras de arriba son por guía, no por silo.

### El patrón que funciona, probado tres veces

**El link de afiliado en el nombre del producto, en la primera columna de la tabla comparativa.**

- 10/8 — se aplicó en `perfumes-arabes-dupes`: pasó de 0 a 10 clicks de afiliado.
- 17/8 — se replicó en `perfumes-arabes-mujer` (commit `9b70e75`): pasó de 23 a 37, y **21 de esos 37 son de los 7 días siguientes**.
- El mismo patrón sostiene a `cafetera-express` y `pava-electrica` en 26-27%.

No es un botón al final del artículo ni un product-card suelto: es el nombre del producto, linkeado, dentro de la tabla que la gente lee para decidir.

**Pendiente conocido:** `perfumes-arabes-mas-vendidos-argentina` es la única guía grande de perfumes **sin ninguna sección `type: "table"`**. Tiene 10 product-cards y ninguna comparativa. Es el hueco más grande y más fácil que queda.

---

## 4. Las fichas no son un vehículo para posicionar

| | URLs | Impresiones | Por URL | Clicks |
|---|---|---|---|---|
| `/guias/` | 202 | 216.731 | **1.073** | 3.041 |
| `/producto/` | 634 | 15.343 | **24** | 169 |

Una guía vale 45 fichas en impresiones. De las 634 fichas, **539 (85%) tienen cero clicks** y solo 36 llegan a 2 o más.

Pero las que funcionan tienen un patrón claro, y varias convierten por encima del promedio del sitio (1,4%):

| Ficha | Clicks | Impr. | CTR |
|---|---|---|---|
| `bicicleta-electrica-r29-350w-shimano` | 4 | 77 | **5,19%** |
| `colchon-kann-livet-kl-eterna-1-plaza` | 4 | 79 | **5,06%** |
| `multi-cepillo-9-en-1-rotativo` | 4 | 80 | **5,00%** |
| `silla-gamer-cougar-fusion-ex` | 7 | 198 | 3,54% |
| `freidora-de-aire-atma-fr248ap` | 5 | 158 | 3,16% |
| `pava-electrica-peabody-digital` | 8 | 281 | 2,85% |

Y a nivel de búsqueda puntual el efecto es más fuerte: la query "pava peabody pe-dk2200n digital 1,5 litros negro" le da a esa ficha **CTR 9,3%**, cuando el promedio del sitio es 1,4%. Nombre de modelo exacto.

**Regla:** las fichas **capturan** al que ya sabe qué modelo quiere; no **generan** demanda. No crees fichas para posicionar. Creá fichas porque una guía las necesita, y cuidá que el título tenga el nombre de modelo completo, que es lo único que rankean.

---

## 5. El punto ciego: ticket y comisión

Ticket del catálogo por categoría (**745 productos**):

| Categoría | Productos | Ticket mediana | Ticket promedio |
|---|---|---|---|
| movilidad | 32 | **$315.402** | $661.973 |
| tech | 71 | **$261.385** | $496.273 |
| climatización | 28 | $219.429 | $334.599 |
| audio | 27 | $158.910 | $169.691 |
| hogar | 121 | $149.999 | $353.209 |
| seguridad | 20 | $124.529 | $168.490 |
| cocina | 164 | $122.999 | $223.018 |
| gaming | 58 | $91.379 | $205.260 |
| hogar-jardín | 81 | $82.986 | $134.795 |
| salud-bienestar | 18 | $59.999 | $52.075 |
| belleza (perfumes) | 105 | **$58.294** | $122.485 |
| coleccionables | 6 | $45.000 | $51.647 |
| juguetes | 14 | $25.990 | $32.275 |

Tus clicks de afiliado se concentran en las categorías baratas: perfumes (~103 clicks, mediana $58.294) y cocina (mediana $122.999). Movilidad, con mediana **cinco veces** la de perfumes, hace ~24 clicks. Una bicicleta eléctrica del catálogo promedia $1.944.579 — treinta veces un perfume.

**El ingreso no es clicks.** Es `clicks × conversión a venta × ticket × % comisión`. Este documento, GA4 y Search Console solo miden el primer factor. Los otros tres están en el panel de afiliados de MercadoLibre.

Es posible que movilidad, con 24 clicks, ya facture más que perfumes con 103. También es posible que no, porque nadie compra una bici de $2M por un link de afiliado con la misma facilidad que un perfume de $58k. **Hasta que no se mire el panel de ML, la priorización del punto 6 está apoyada en un supuesto sin verificar.**

> ⚠️ No se puede atribuir clicks de afiliado a productos individuales: GA4 no tiene `link_url` registrado como dimensión personalizada (lo aclara el propio `scripts/ga4/ga4.py`). La asociación categoría ↔ clicks es por silo de guía, aproximada.

---

## 6. Qué posicionar, en tres niveles

**1. Movilidad — validado, subexplotado, y arranca la temporada.** Silo publicado el 5-6/8; con 17 días de datos ya hace ~6.600 impresiones (rodado-29 2.384 · monopatín eléctrico 1.923 · bici eléctrica 890 · casco 828 · monopatín infantil 607). Hay queries en posición 5-8 con cero clicks esperando: "mejor bicicleta eléctrica argentina" 49 impr pos 7,9 · "cual es la mejor bicicleta eléctrica en argentina" 24 pos 7,5 · "cuánto cuesta una bicicleta eléctrica" 20 pos 5,0. Ticket mediano $315.402 y septiembre arranca la temporada de bici. **Es lo primero que profundizaría.**

**2. Aire acondicionado — el activo caro que se está desaprovechando.** Tenés 5 aires portátiles en catálogo que promedian **$837.235**, el ticket más alto de climatización. La guía `aire-acondicionado-portatil` existe pero **cayó de 242 a 176 impresiones** y lleva 49 días sin refrescar. La ventana es septiembre-octubre, o sea ahora.

  Aclaración importante: **no tenés ni un solo split en catálogo.** El hueco de split es real y el ticket es alto, pero es un hueco doble (sin productos y sin guía), así que primero es una decisión de sourcing y recién después de contenido. Validar volumen en Ubersuggest antes de invertir, como marca el proceso del repo.

**3. Jardín/exterior — está validando solo.** Publicado el 18/8; con 4-5 días de datos: hidrolavadora 420 impresiones, bordeadora 373, cortadora de césped 168. La primavera lo empuja hasta diciembre.

**Descartados por ahora:** consola/PS5 (10 productos sin guía, pero solo 29 impresiones de demanda y en gaming se compra en retail). Smart TV: el catálogo tiene 2 televisores reales y 4 sticks de streaming, no es una categoría todavía. `gopro-cual-comprar` e `impresora-3d` se publicaron el 25/8, sin datos aún.

---

## 7. Calendario estacional

| Ventana | Qué preparar | Cuándo tocarlo |
|---|---|---|
| Septiembre-octubre | Ventiladores, aire portátil, bicicletas | **Agosto** — antes del pico |
| Octubre | Día de la Madre | Septiembre |
| Noviembre | Black Friday / Cyber Monday | Octubre |
| Diciembre | Navidad, piletas, verano, conservadoras | Noviembre |
| Marzo | Estufas, caloventores, termotanques | Marzo, antes de abril-mayo |
| Enero | Refresh masivo de títulos [año viejo] → [año nuevo] | Enero |

Regla: **siempre antes del pico, nunca durante.** Una guía refrescada en pleno pico ya perdió media temporada esperando que Google la reevalúe.

---

## 8. Reglas de decisión

1. **Antes de reescribir un título, mirá la fecha del último cambio en git.** Si tiene menos de 21 días está madurando: el dato es ruido y no se toca. Links internos sí se pueden sumar siempre.
2. **Antes de perseguir una query, clasificá la intención.** Si es precio o sustantivo seco, no la persigas por más impresiones que tenga.
3. **Antes de crear una guía nueva, preguntate si el hueco es de tráfico o de conversión.** Casi siempre es de conversión, y sale más barato.
4. **Antes de crear una ficha, preguntate qué guía la necesita.** Si ninguna, no la crees.
5. **`pillar: true` no es un dato de rendimiento**, es una etiqueta editorial. En el snapshot #42 hay 18 pilares con cero clicks, entre ellos `masajeador` (42 impresiones) y `zapatero` (60). Para priorizar usá impresiones y clicks de afiliado reales.
6. **Un precio verificado a mano no se pisa solo.** `priceVerifiedAt` lo protege 7 días. Ver `scripts/lib/price-guard.cjs`.

---

## 9. Lo que este documento no sabe

- **Comisión y facturación real por categoría.** Está en el panel de afiliados de ML. Es la consulta con mejor relación esfuerzo/valor disponible hoy, y puede reordenar todo el punto 6.
- **Volumen de búsqueda de lo que todavía no rankea** (split, smart TV, consolas). Search Console solo muestra dónde ya aparecés. Eso se valida en Ubersuggest.
- **Si el carrusel de Shopping es lo que se come los clicks.** Se dedujo del patrón de datos, no se verificó mirando SERPs. Chequeo de dos minutos: buscar a mano "tostadora de pan" y "cual es la mejor tostadora" y comparar qué hay arriba. Confirma o tira abajo buena parte del punto 1.

---

## Notas de método

Las impresiones por página se calculan **sin** las filas de ancla (`#seccion`), que duplican el conteo; el `audit` de `gsc.py` no las filtra, este documento sí. Las fechas de cambio de título salen de `git log`, no de `updatedDate`, que a veces queda desactualizado. Los clicks de fichas se cuentan con la dimensión `page`, no con `page_query`, que Google trunca fuerte (a nivel `page_query` las fichas muestran 25 clicks contra 169 reales) — no mezclar las dos. Los totales de afiliado de GA4 varían ±3 entre consultas; no persigas diferencias de esa magnitud. Al parsear `curated-products.ts` hay que aceptar comillas simples **y** dobles: hacerlo solo con dobles deja afuera 223 de los 745 productos.
