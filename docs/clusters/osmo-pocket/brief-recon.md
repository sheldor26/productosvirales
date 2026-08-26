# BRIEF DE CONSOLIDACIÓN — Línea DJI Osmo Pocket (guía nueva + 4 fichas)

Fecha: 2026-08-26. Consolidado de los dos informes de reconocimiento, con verificación propia contra el repo (los datos que verifiqué yo van marcados **[verificado]**).

---

## 1. ROMPIMIENTOS A CORREGIR

Diez hallazgos del Informe 1, más uno propio. Los cité verbatim contra el archivo real, así que las frases de abajo son las que están hoy en disco, no las del informe.

### R1 — ROMPE — `src/data/guides.ts`, guía `dji-cual-comprar`, campo `standfirst` (hoy línea 180)

**Verbatim [verificado]:**
> `Las cinco cámaras DJI que verificamos con stock real en Argentina van de {{precio:MLA29364436:k}} a {{precio:MLA62340610:k}}.`

**Qué la rompe:** el sujeto no es "las cinco de esta guía", es "las cámaras DJI que verificamos con stock real en Argentina". Con las 4 Pocket pasan a ser **9**, y el techo del rango deja de ser 1.543.649 (Action 6) para ser **2.453.049** (Pocket 4 Creator). El piso, 799.999, no cambia.

**Corrección:**
> Las cinco cámaras DJI de acción y 360 que verificamos con stock real en Argentina van de {{precio:MLA29364436:k}} a {{precio:MLA62340610:k}}. El problema para elegir no es el precio: es que DJI mete cuatro formas de cámara distintas bajo un mismo nombre, Osmo, así que "quiero una DJI" no dice casi nada. Las de bolsillo, la línea Osmo Pocket, van aparte y las comparamos en su propia guía. La decisión se toma con dos datos, y los dos están mal cargados en las publicaciones de MercadoLibre.

---

### R2 — ROMPE — `src/data/guides.ts`, misma guía, campo `metaDescription` (hoy línea 171)

**PAR ESPEJO INTERNO DE R1.** Están a nueve líneas de distancia y se olvida uno de los dos.

**Verbatim [verificado]:**
> `5 cámaras DJI con stock real verificado en Argentina, de {{precio:MLA29364436:k}} a {{precio:MLA62340610:k}}.`

**Qué la rompe:** idéntico a R1, en el snippet que ve Google.

**Corrección:**
> 5 cámaras DJI de acción y 360 con stock real verificado en Argentina, de {{precio:MLA29364436:k}} a {{precio:MLA62340610:k}}. Cuál graba 4K a 120 cuadros, cuál se moja 20 metros y por qué la Action 5 Pro conviene más que la Action 6.

---

### R3 — ROMPE — `src/data/guides.ts`, `faq`, pregunta "¿Cuál es la cámara DJI más nueva?" (hoy línea 317)

**Verbatim [verificado]:**
> `Depende de la línea, porque DJI actualiza cada una por su cuenta. En la línea Osmo Action la más nueva es la [Osmo Action 6](...), de noviembre de 2025. La [Osmo Nano](...) salió en septiembre de 2025 y la [Osmo 360](...) en julio de 2025. Las otras dos son más viejas: la [Osmo Action 5 Pro](...) es de septiembre de 2024 y la [Osmo Action 4](...) de 2023. Que un modelo sea más nuevo no lo hace la mejor compra: (…)`

**Qué la rompe:** la pregunta no tiene alcance de guía, dice "la cámara DJI más nueva" a secas. La respuesta cubre **tres** líneas cuando la propia guía dice arriba que DJI tiene **cuatro**, y se detiene en noviembre de 2025. La Osmo Pocket 4 queda afuera justo siendo (presuntamente, ver R3-riesgo en §6) la más nueva.

**Corrección:** conservar el texto actual entero y meter, después de "en julio de 2025":
> Fuera de estas tres líneas, la más nueva de todo el catálogo DJI del sitio es la [Osmo Pocket 4](/producto/camara-dji-osmo-pocket-4-combo-estandar-mla68244220), de la línea de bolsillo, que comparamos en [qué Osmo Pocket comprar](/guias/tech/SLUG-DEFINITIVO).

**Bloqueante:** esta corrección afirma que la Pocket 4 es posterior a noviembre de 2025. **Nadie lo verificó.** Ver §6, riesgo 1.

---

### R4 — ROMPE — `src/data/guides.ts`, cuarto item de la lista bajo el h2 "Las cuatro líneas de cámara de DJI, y cuál es la actual de cada una" (hoy línea 238)

**Verbatim [verificado]:**
> `**Osmo Pocket:** las de bolsillo con estabilizador de tres ejes integrado. No entran en esta comparativa porque no son cámaras de acción: son cámaras pensadas para grabarse hablando, no para colgar de un casco.`

**Qué la rompe:** la exclusión sigue siendo correcta y **no hay que sacarla**. Lo que rompe es el h2 que la encabeza: promete "cuál es la actual de cada una" y este es el único de los cuatro items que no nombra ningún modelo ni ninguna fecha **[verificado: los otros tres sí nombran modelo y fecha]**. Es además el único item de los cuatro sin un solo link interno.

**Corrección:**
> **Osmo Pocket:** las de bolsillo con estabilizador de tres ejes integrado. No entran en esta comparativa porque no son cámaras de acción: son cámaras pensadas para grabarse hablando, no para colgar de un casco. Están en el sitio y las comparamos aparte en [qué Osmo Pocket comprar](/guias/tech/SLUG-DEFINITIVO): la actual es la [Osmo Pocket 4](/producto/camara-dji-osmo-pocket-4-combo-estandar-mla68244220) y la anterior, la [Osmo Pocket 3](/producto/camara-dji-osmo-pocket-3-combo-estandar-mla39393179), sigue con stock.

**Este es el que vive en LOS DOS ARCHIVOS. Su mitad en `curated-products.ts` es R5.**

---

### R5 — ROZA — `src/data/curated-products.ts`, las cinco fichas DJI (líneas ~691 a 970)

**SEGUNDA MITAD DEL PAR ESPEJO DE R4.**

**Estado verificado hoy [verificado, leí los cinco arrays]:**

| Ficha | `relatedProducts` actual |
|---|---|
| MLA62340610 Osmo Action 6 | `["MLA66182550", "MLA29364436", "MLA53612281"]` |
| MLA29364436 Osmo Action 4 | `["MLA66182550", "MLA62340610", "MLA47374183"]` |
| MLA66182550 Osmo Action 5 Pro | `["MLA62340610", "MLA29364436", "MLA47374183"]` |
| MLA53612281 Osmo 360 | `["MLA49100446", "MLA57726638", "MLA62340610"]` |
| MLA58197668 Osmo Nano | `["MLA39997069", "MLA66182550", "MLA70063378"]` |

**Qué la rompe:** en `curated-products.ts` **no existe una sola mención a la línea Osmo Pocket** en ninguna de las cinco fichas DJI, ni en prosa ni en `relatedProducts`. Si el enlace a la línea Pocket sale solo desde la guía, el enlazado queda a medias: cuatro fichas nuevas sin ningún enlace entrante desde las cinco DJI que ya rankean.

**Corrección propuesta (Informe 1):** en la Osmo Nano, `relatedProducts: ["MLA39997069", "MLA66182550", "MLA39393179"]`, y sumar al `verdict` o a un párrafo del cuerpo una línea del tipo *"Si lo que querés es grabarte hablando y no colgar la cámara de nada, eso lo hace la línea Osmo Pocket, que comparamos aparte."* Mismo cruce en las otras cuatro.

**Objeción mía:** ese cambio **saca a la GoPro MISSION 1 PRO (MLA70063378)** de los relacionados de la Nano. Es la segunda cámara más cara del catálogo (1.749.999) y tiene solo 18 opiniones **[verificado]**, así que probablemente sea el sacrificio correcto, pero es una decisión, no un reemplazo neutro. Decidilo explícito.

---

### R6 — ROZA — `src/data/guides.ts`, `trust-block` de metodología (hoy línea 194)

**Verbatim [verificado]:**
> `**Cómo comparamos:** partimos de la tienda oficial de DJI en MercadoLibre Argentina y verificamos una por una que las cinco estuvieran comprables, con stock nacional y no por importación.`

**Qué la rompe:** da a entender que en la tienda oficial de DJI había cinco cámaras comprables. Pasan a ser 9. Es el bloque que sostiene la confianza de la guía, así que conviene que diga en voz alta qué quedó afuera a propósito.

**Corrección:** cambiar "que las cinco estuvieran comprables" por "que **las cinco de esta guía** estuvieran comprables", y agregar después de "no por importación":
> Dejamos afuera a propósito la línea Osmo Pocket, que es otra categoría de cámara y tiene su propia guía.

El resto del bloque queda igual.

---

### R7 — ROZA — `src/data/guides.ts`, h2 "Cuánto sube el precio de un modelo al siguiente" (hoy línea 272)

**Verbatim [verificado]:**
> `La escalera de DJI en Argentina no tiene pozos: los cinco modelos suben de a poco y no hay un salto que corte la línea en dos gamas.`

**Qué la rompe:** el sujeto es "la escalera de DJI en Argentina", no "la de esta guía". Esa escalera pasa a tener 9 peldaños y a terminar en 2.453.049. La afirmación de fondo aguanta (el salto de 1.649.999 a 2.087.949 es de 438.000, comparable a los 332.250 que ya hay entre la Nano y la Osmo 360), pero el techo deja de ser la Action 6.

**Corrección:**
> La escalera de las cinco de esta guía no tiene pozos: suben de a poco y no hay un salto que corte la línea en dos gamas. Si sumás la línea Osmo Pocket, la escalera sigue hacia arriba: ahí está la DJI más cara que se consigue en Argentina.

---

### R8 — ROZA — `src/data/guides.ts`, h3 "Tercero, cuánta evidencia de uso querés" (hoy línea 295)

**Verbatim [verificado]:**
> `La Osmo 360 tiene {{reviews:MLA53612281}} opiniones, la Action 5 Pro {{reviews:MLA66182550}} y la Osmo Nano {{reviews:MLA58197668}}. La Action 4, {{reviews:MLA29364436}}. Si preferís comprar algo que ya usó mucha gente antes que la novedad, ese número pesa tanto como las specs.`

**Qué la rompe:** la sección ordena las DJI por evidencia de uso y deja arriba a la Osmo 360 con 402. El Pack Creadores Pocket 3 tiene **1.183**, casi el triple **[verificado: hoy la DJI con más opiniones del sitio es la Osmo 360 con 402]**.

**Corrección:** dejar el texto y agregar al final:
> Fuera de esta guía, la DJI con más opiniones del sitio es el pack de la Osmo Pocket 3, con {{reviews:MLA37134971}}, aunque es otra categoría de cámara.

---

### R9 — ROZA — `src/data/guides.ts`, guía `insta360-cual-comprar`, item "Línea Luna" (hoy línea 99)

**Verbatim [verificado]:**
> `**Línea Luna:** cámaras de bolsillo con estabilizador de tres ejes integrado, que compiten con la DJI Osmo Pocket. Debutó en junio de 2026.`

**Qué la rompe:** nada de dato. El contenido es correcto. Lo que cambia es que "DJI Osmo Pocket" deja de ser una referencia externa y pasa a ser un producto del sitio, y sigue en texto plano. Es la única mención a la línea Pocket en toda esa guía y es un enlace natural al silo nuevo.

**Corrección:**
> **Línea Luna:** cámaras de bolsillo con estabilizador de tres ejes integrado, que compiten con la [DJI Osmo Pocket](/guias/tech/SLUG-DEFINITIVO). Debutó en junio de 2026.

---

### R10 — ROZA — `src/data/curated-products.ts`, ficha MLA66182550, campo `verdict` (hoy línea 837)

**Verbatim [verificado]:**
> `Es la DJI que más cámara te da por peso: el mismo 4K a 120 cuadros y los mismos 20 metros de agua que la Action 6, por bastante menos plata. Si la apertura variable no te mueve la aguja, es la compra inteligente de la línea. La contra es que el sensor sigue siendo el de 1/1,3 pulgadas de la Action 4.`

**Qué la rompe:** el alcance es "la DJI", sin acotar. Competía contra 4 DJI, ahora contra 8, con la Pocket 3 Combo Estándar a 1.100.000 en el medio. Sigue defendible, pero se declaró sobre un universo que ya no se resolvió entero.

**Corrección:** cambiar la primera frase a `Es la DJI de acción que más cámara te da por peso: (…)`. El resto igual.

---

### R11 — ROZA — HALLAZGO PROPIO, no está en ninguno de los dos informes

`src/data/guides.ts`, `intro[0]` de `dji-cual-comprar` (hoy dentro del bloque 164-200).

**Verbatim [verificado]:**
> `DJI hace cuatro formas de cámara distintas al mismo tiempo: rectangulares de acción, una 360 de dos lentes, una diminuta que se cuelga con imán y una de bolsillo con estabilizador. **Las cuatro se llaman Osmo.** Las tres primeras son las que entran en esta guía (…)`

**No rompe:** el alcance está bien acotado ("las tres primeras"). Lo señalo porque es el **primer párrafo de la guía**, la única otra mención a la línea de bolsillo, y hoy no enlaza a ningún lado. Si el paso 10 del workflow pide 2 a 4 enlaces entrantes desde 3 orígenes distintos, este es el enlace de mayor peso de todos los disponibles. Sugerencia mínima: `(…) y una de bolsillo con estabilizador, [que comparamos aparte](/guias/tech/SLUG-DEFINITIVO).`

---

### Resumen de pares espejo (regla del proyecto: corregir en los DOS archivos)

- **R4 + R5**: el único par que cruza archivos. `guides.ts:238` (item de lista) y las cinco fichas DJI de `curated-products.ts:691-970`. Reportados como filas separadas a propósito.
- **R1 + R2**: par interno dentro de `guides.ts`, a nueve líneas de distancia. Es el que más fácil se olvida a la mitad.
- Los ocho restantes son de un solo lugar.

**Ojo con los números de línea:** cualquier edición desplaza el resto. Aplicar de abajo hacia arriba, o buscar por texto y no por línea.

---

## 2. CÓMO CREAR LA CATEGORÍA NUEVA

### Los pasos, completos

Son **dos ediciones, las dos en `src/data/guides.ts`**. Nada más.

**Paso 1.** Agregar la entrada al objeto `guideCategories` (arranca en la línea 28535 **[verificado: existe, es `Record<string, { name: string; description: string }>`, dos campos, ambos obligatorios]**):

```ts
  "camaras-vlog": {
    name: "Guía de Cámaras para Vlog",
    description:
      "Cámaras de bolsillo con estabilizador de tres ejes comparadas por lo que decide la compra: cuánto sensor trae cada una, qué micrófono viene en cada combo y cuánto cuesta el escalón de una generación a la otra.",
  },
```

**Paso 2.** En el objeto `Guide` nuevo: `category: "camaras-vlog"`, `silo: "tech"`, y **`pillar: true`** (ver abajo por qué).

**Eso es todo.** Cero cambios en `src/app/`, sitemap, breadcrumbs o rutas. Lo respalda el commit `96f9232` que creó `camaras-deportivas` el 2026-08-25: tocó 4 archivos y ninguno en `src/app/`.

### Los tres mapas que no hay que confundir

| Mapa | Línea | Qué es | ¿Tocarlo? |
|---|---|---|---|
| `guideSilos` | 28455 | metadata del silo | **No.** `tech` ya está declarado **[verificado, lo leí]** |
| `categorySiloFallback` | 28522 | solo para categorías legacy sin campo `silo` | **No.** La guía nueva lleva `silo: "tech"` |
| `guideCategories` | 28535 | metadata de la categoría | **Sí.** Es el único |

### Convención del `name` (obligatoria)

Siempre `"Guía de <Tema>"` o `"Guías de <Tema>"`, nunca el tema pelado. Singular si es una sola categoría de producto. **[verificado: las 18 entradas que leí lo cumplen sin excepción]**.

### Veredicto: ¿una categoría con UNA sola guía rompe algo?

**No rompe nada.** Verificado leyendo el código, no supuesto:

- **No existe página de categoría.** `src/app/guias/` tiene `page.tsx`, `layout.tsx`, `[slug]/` y `[slug]/[sub]/`. Las URLs las arma `guideHref()` con `silo` + `slug`. **El campo `category` no entra nunca en una URL.**
- **`/guias`** agrupa por `guide.category` a partir de las guías **publicadas**. Nunca itera `guideCategories` para generar secciones, así que una categoría vacía no puede aparecer.
- **Si te olvidás la entrada del Paso 1:** `guideCategories[categorySlug]` da `undefined` y cae a `{cat?.name || categorySlug}`. Sale el slug crudo, `camaras-vlog`, sin descripción. **Feo, no roto. Y ningún script de `guides:check` lo valida.** Este es el único riesgo real de todo el punto 2.
- **El `h3` de categoría SÍ se va a renderizar:** la condición es `silo.categories.length > 1` **[verificado]**, y el silo tech ya tiene al menos 7 categorías distintas (`camaras-deportivas`, `proyectores`, `streaming-tv`, `smartwatches`, `relojes-garmin`, `impresoras-3d`, `tech`) **[verificado por grep]**.
- **Poné `pillar: true`.** `const pillar = categoryGuides.find((g) => g.pillar)` **[verificado, línea 393 de `src/app/guias/page.tsx`]**. Sin el flag, la única guía cae a la grilla de `SatelliteCard` y perdés la card destacada. Funciona igual, pero se ve peor. Ojo: `dji-cual-comprar` **no** tiene `pillar`, el pilar de `camaras-deportivas` es `camara-deportiva`.
- **`related-guides.ts`** ya resuelve el caso: el propio comentario del archivo dice que 47 de 70 categorías tienen una sola guía. Hay red de seguridad por `silo` y fallback de heading a "Más sobre tech". No devuelve array vacío.
- **Sitemap:** itera `getPublishedGuides()` y usa `guideHref()`. Nunca lee `category`. Cero impacto.
- **`generateStaticParams`** mapea `{ slug: g.silo, sub: g.slug }`. Con `silo: "tech"` ya existente, no hay ruta nueva que registrar.

---

## 3. PLANTILLA DE GUÍA

### Header del objeto, en este orden literal (molde `dji-cual-comprar`)

`slug` · `category` · `silo` · `title` · `h1` · `seoTitle` · `metaDescription` · `ogTitle` · `ogDescription` · `ogImage` · `directAnswer` · `publishedDate` · `updatedDate` · `hasDisclosure` · `readingTime` · `standfirst` · `quickPicks` · `intro` · `sections` · `faq` · `internalLinks`

Sumale `pillar: true` (ver §2).

### Secuencia de `sections[]`, adaptada de 5 productos a 4

El molde tiene 72 elementos en el array. Con 4 productos en vez de 5 y el mismo patrón:

| # | type | Contenido |
|---|---|---|
| 1 | `image` | `imageSize: "hero"`, foto de la Pocket que encabece el ranking, `alt` obligatorio y descriptivo |
| 2 | `callout` | `calloutVariant: "tip"`, `calloutTitle: "Respuesta rápida"`, con los 4 links de ficha |
| 3 | `trust-block` | `trustVariant: "methodology"` |
| 4 | `h2` | `Las 4 Osmo Pocket que comparamos`, `id: "ranking"` |
| 5 | `p` | bajada de una línea en negrita, tipo `**La del medio, y la que más conviene**` |
| 6 | `h3` | nombre del modelo Nº1 |
| 7 | `product-card` | ranking 1, `label` + `labelColor`, `description` con `{{rating:}}` y `{{reviews:}}` |
| 8-11 | `p` ×2 a 4 | specs, contras, comparación contra la hermana |
| 12+ | | repetir h3 / product-card / párrafos para los rankings 2, 3 y 4, intercalando 1 a 2 `callout` de `calloutVariant: "warning"` donde haya un dato que la publicación de ML declara mal o a medias |
| … | `h2` | `Qué cambia de la Pocket 3 a la Pocket 4` + `p` + `list` (2 a 3 items) + `p` |
| … | `h2` | `Combo Estándar o Creator: qué trae cada caja` + `p` + `list` |
| … | `h2` | `Cuánto sube el precio de un modelo al siguiente` + `p` + `list` de saltos con `{{preciodif:}}` + `p` |
| … | `table` | headers `[Modelo, Precio, Sensor, Video máximo, Qué trae el combo, Ideal para]`, 4 filas |
| … | `h2` | `Cómo elegir` + 3 o 4 `h3` con un `p` cada uno |
| … | `h2` | `Cuánto cuesta una Osmo Pocket` + `list` de franjas |
| … | `verdict` | cierre |

Cerrá con `faq` (el molde tiene 10 preguntas) e `internalLinks` (el molde tiene 8: guías hermanas + fichas + el pilar `camara-deportiva`).

### `quickPicks`: 4 entradas, una por ficha

Estructura: `{ productMlaId, label, labelColor, tagline }`. Etiquetas del molde para calcar el criterio: "Mejor elección general" (green), "La más capaz" / "La 360 de DJI" (blue/purple), "La más barata" (slate).

### `LabelColor`: usá cuatro de los cinco

```ts
type LabelColor = "green" | "blue" | "amber" | "purple" | "slate";
```

**No uses `amber`.** Es legacy y el ámbar está reservado al botón de compra (`docs/guias.md` §2.1). El molde usa green, blue, purple y slate. Declaralo siempre explícito: si lo omitís, `ProductCard.tsx` y `QuickPicks.tsx` lo infieren por keyword del label y te la juega.

### Tokens: dónde SÍ y dónde NO resuelven

| Token | Sintaxis | Sale |
|---|---|---|
| Precio exacto | `{{precio:MLA39393179}}` | `$ 1.100.000`. Tablas y product-cards |
| Precio al mil | `{{precio:MLA39393179:k}}` | `$ 1.100.000`. Prosa ("alrededor de $X") |
| Diferencia | `{{preciodif:MLA_A:MLA_B}}` | resta en valor absoluto, siempre fresca |
| Opiniones | `{{reviews:MLA37134971}}` | `1.183` |
| Rating | `{{rating:MLA39393179}}` | `4.9`, con punto, no coma |

**NO resuelven (salen literales a la vista):**

1. **`section.title` de h2 y h3.** El más importante: además de salir literal, **ensucia el ancla y el índice scroll-spy**, porque el ancla se genera con `slugify(title)`. En títulos, aproximado a mano ("los más de mil compradores").
2. `section.calloutTitle`
3. `section.caption` y `section.alt` de imágenes
4. `section.attribution` de pull-quotes
5. **`quickPicks[].label` y el `label` del `product-card`** (el `tagline` y la `description` sí resuelven)
6. **`ogDescription` en las tarjetas de `/guias`**: ahí pasa solo por `toPlainText()` sin `injectLivePrices`. En la metadata OG sí resuelve. Si ponés un token, sale literal en el índice.
7. `headers` de tabla (las **celdas** de `rows` sí resuelven)

**Sí resuelven:** `metaDescription`, `directAnswer`, `standfirst`, `intro`, `content` de p/verdict/callout/trust-block/pull-quote, celdas de `table`, `items` de `list`, `description` de product-card, `tagline` de quickPicks, `faq` entera, `internalLinks[].label`, `card.ctas[].label`, feed RSS.

### La norma de la tabla que se olvida siempre

`docs/guias.md` §5, norma de auditoría 2026-07: **la primera columna es link markdown al afiliado, no texto plano.** Lo valida `scripts/check-table-product-links.cjs`.

```
[`[DJI Osmo Pocket 3](https://meli.la/XXXXX)`, `{{precio:MLA39393179}}`, `1"`, `4K a 60 fps`, `Cámara + trípode`, `Grabarte hablando gastando lo mínimo`]
```

### Antes de publicar

```bash
node scripts/check-price-tokens.cjs
node scripts/check-stale-prose-prices.cjs
node scripts/check-hardcoded-reviews.cjs
node scripts/check-guide-monetization.cjs
node scripts/check-table-product-links.cjs
node scripts/check-canonical-product-links.cjs
node scripts/check-guide-internal-links.cjs
node scripts/check-uncovered-prose-prices.cjs
node scripts/check-price-guard.cjs
npm run lint
npm run build
```

**Uno por uno, nunca `npm run guides:check`**: la cadena `&&` para en el primero que falla y te tapa el resto.

Notas operativas:
- `check-uncovered-prose-prices.cjs` es un **trinquete** contra `scripts/uncovered-prose-prices-baseline.json`. Si metés precios en prosa sin token, el total sube y falla.
- `check-guide-internal-links.cjs` es el que atrapa el bug que ya pasó dos veces: **`/guias/<slug>` sin el segmento de silo devuelve HTTP 200 con "Guía no encontrada"**, invisible para cualquier chequeo de status. Todo link a la guía nueva va como `/guias/tech/<slug>`.

### Paso que no es un script

Antes de publicar, sumar **2 a 4 enlaces ENTRANTES desde guías que ya existen**, desde 3 orígenes distintos, con `sitemapLastmod` en las guías de origen y **sin tocar su `updatedDate`**. Orígenes naturales acá: `camara-deportiva` (el pilar), `dji-cual-comprar`, `gopro-cual-comprar`, `insta360-cual-comprar`. **Dato práctico [verificado]:** `dji-cual-comprar` tiene `publishedDate` y `updatedDate` en **2026-08-26**, o sea hoy, así que en esa guía el truco de `sitemapLastmod` no hace falta, ya está fresca.

---

## 4. PLANTILLA DE FICHA

### Los cuatro slugs, calculados corriendo `productSlug()` real

```
camara-dji-osmo-pocket-3-combo-estandar-mla39393179
camara-dji-osmo-pocket-3-pack-creadores-mla37134971
camara-dji-osmo-pocket-4-combo-estandar-mla68244220
camara-dji-osmo-pocket-4-creator-combo-mla68229126
```

`productSlug()` = `slugifyTitle(product.title)` + `-` + `product.id.toLowerCase()`. Sale del **`title`**, no del `canonicalName`. Corta a 80 caracteres. `normalize("NFD")` borra los diacríticos, así que **el slug es idéntico con o sin tilde**, pero el `title` de la ficha debe llevar las tildes correctas (`Cámara`, `Estándar`) como el resto del catálogo.

**`scripts/check-canonical-product-links.cjs` replica esta función y falla si un link interno usa un slug distinto o la forma pelada `/producto/MLA…`.** Estos cuatro strings son los que van, literales, en `internalLinks`, en la prosa, en el `directAnswer` y en las correcciones R3 y R4 de la §1.

**Advertencia:** los slugs de arriba asumen los títulos que vinieron en el encargo. Si el `title` real de ML difiere en una palabra, el slug cambia. Fijá los títulos definitivos **antes** de escribir un solo link.

### Orden exacto de campos (molde nuevo, MLA66182550 y MLA53612281, 26 claves)

```
id
title              // "Cámara …" completo, tal como figura en ML, con tildes
canonicalName      // nombre limpio: "DJI Osmo Pocket 4"
brand              // "DJI"
price
currency           // "ARS"
image              // CDN de ML, sufijo -O.webp, NUNCA -R
category           // "Tech"
categorySlug       // "tech"
permalink          // https://www.mercadolibre.com.ar/p/MLA…
affiliateUrl       // https://meli.la/…
condition          // "new"
freeShipping       // false
rating
reviewCount
reviewsSampledAt   // "2026-08-26"
soldQuantity
visibility         // "normal"
priceUpdated
priceLastChecked
priceVerifiedAt    // los tres con la misma fecha
priceStatus        // "fresh"
seoTitle           // "<Modelo>: precio en Argentina, specs y opiniones"
metaDescription    // lleva {{precio:<su propio id>}} adentro
pros               // 4 items
cons               // 4 items
verdict            // 3 frases
specs              // 14-15 pares {label, value}
relatedProducts    // 3 ids MLA
```

Lo que el molde nuevo **NO** trae y las fichas viejas sí: `images`, `h1`, `articleBody`, `faq`, `customerReviews`, `structuredData`, `pastelColor`, `badge`, `description`. No los agregues.

**Solo 13 campos son obligatorios por la interfaz:** `id`, `title`, `price`, `currency`, `image`, `category`, `categorySlug`, `permalink`, `affiliateUrl`, `condition`, `freeShipping`. Todo el resto es opcional, pero el molde es el molde.

### Convenciones de redacción

- **`pros`:** 4 items, y cada uno un **dato comparativo contra otro producto del catálogo**, no un adjetivo. No "graba muy bien", sí "el mismo sensor de 1 pulgada que la Pocket 4, por {{preciodif:…}} menos".
- **`cons`:** 4 contras reales. Admiten `{{preciodif:}}`.
- **`verdict`:** exactamente 3 frases, en este orden: qué te da, para quién, y **LA** contra.
- **`specs`:** cada valor con la fuente pegada al dato cuando el número es discutible (`"confirmado por DJI"`). Regla de la memoria del proyecto: **cruzar toda spec numérica contra la web del fabricante**, la ficha técnica de ML puede estar mal etiquetada, no solo incompleta.
- **Toda afirmación NEGATIVA de spec** ("no tiene GPS") necesita una fuente que lo niegue. **La fila ausente en la ficha de ML no cuenta como prueba.**
- Voz rioplatense. Nada de "producto curado". Links de afiliado con `rel="sponsored"`.
- Antes de importar: `docs/fichas.md` es obligatorio.
- **Antes de cargar precios: verificar con Bright Data.** Si difiere del encargo, actualizar el catálogo, no solo avisar. NO usar la API de ML, está bloqueada con 401.

---

## 5. QUÉ NO PUEDO AFIRMAR

Todo lo de abajo NO fue verificado por ninguno de los dos informes ni por mí. Verificar antes de escribir una sola línea de la guía.

1. **Los precios, rating y opiniones de los 4 productos.** Vienen del encargo. Nadie los cruzó contra MercadoLibre ni contra Bright Data. Regla del proyecto: se verifica antes de publicar, y si difieren, se actualiza el catálogo.
2. **La fecha de lanzamiento de la Pocket 4 y de la Pocket 3.** La corrección R3 depende enteramente de que la Pocket 4 sea posterior a noviembre de 2025. Nadie fue a dji.com.
3. **Las specs de las cuatro.** Sensor, resolución máxima, autonomía, medidas, qué trae cada combo, qué micrófono es el "Mic 2". Cero verificación. Los pesos que el Informe 1 usa en sus notas (190,5 g la Pocket 4, 116 g la Pocket 3) aparecen sin fuente declarada.
4. **Que las Pocket no se sumergen.** Es la premisa que salva los cuatro claims de "20 metros, el máximo del catálogo" y el de "la cámara de acción más capaz". Es casi seguro cierto, pero está asumido, no citado.
5. **Los `image`, `permalink` y `affiliateUrl` de las 4 fichas: no existen todavía.** Regla dura de la memoria del proyecto: **Juan pasa los `meli.la` canónicos ANTES de que se arme nada**. Sin ellos no hay ficha, no hay tabla y no hay `check-table-product-links.cjs` que pase. Además, una publicación puede estar excluida del Programa de Afiliados y eso solo se detecta al generar el `meli.la`.
6. **`soldQuantity`, `reviewsWithPhotos`, `ratingBreakdown`.** Ninguno provisto.
7. **Que las 4 tengan stock nacional en la tienda oficial de DJI**, que es lo que el `trust-block` de metodología va a afirmar.
8. **Los títulos exactos de ML.** Los del encargo vienen sin tildes. De ahí salen los cuatro slugs de la §4.
9. **La demanda de búsqueda.** Ningún informe midió volumen ni miró el SERP de "osmo pocket" en Argentina. No sé si esta guía tiene mercado.
10. **El nombre y el slug de la categoría.** `camaras-vlog` / "Guía de Cámaras para Vlog" es una propuesta del Informe 2, no una decisión.
11. **El slug de la guía.** `dji-osmo-pocket-cual-comprar` es una propuesta del Informe 1. Aparece en **cinco reemplazos distintos** (R3, R4, R9, R11 y los enlaces entrantes). **Fijalo antes de aplicar un solo parche.** Las hermanas se llaman `dji-cual-comprar`, `gopro-cual-comprar`, `insta360-cual-comprar`, así que `osmo-pocket-cual-comprar` también entra en la convención.
12. **No corrí ningún script de verificación** ni `npm run build`. Todo lo de la §3 sobre scripts viene del Informe 2.
13. **El "paso 10" del `ARTICLE_CREATION_WORKFLOW.md`.** Verifiqué que la regla de `sitemapLastmod` existe en ese doc (línea 117), pero no confirmé que la numeración del paso ni la exigencia de "3 orígenes distintos" estén escritas así.
14. **Los números de línea de todo este brief** son de hoy, antes de tocar nada. Se desplazan con la primera edición.

---

## 6. RIESGOS

### 1. El riesgo que puede invertir una corrección entera

**R3 afirma que la Osmo Pocket 4 es la cámara DJI más nueva del sitio.** Nadie verificó su fecha de lanzamiento. Si la Pocket 4 resultara ser anterior a la Action 6 (noviembre de 2025), la corrección **introduce** un error factual en la FAQ en lugar de arreglarlo, y encima en la guía madre de la marca. Antes de escribir R3, la fecha de la Pocket 4 tiene que salir de dji.com. Si no aparece, R3 se reescribe sin la palabra "más nueva".

### 2. Dos premisas del encargo son falsas (confirmé las dos)

- **"La Pocket 4 Creator pasaría a ser la cámara más cara del catálogo": cierto como CÁMARA, falso como PRODUCTO.** Podio real de precios del catálogo **[verificado]**: Bicicleta Eléctrica HONEYWHALE F6 Pro-S 2.099.000, Sillón Melfit Maui 1.899.999, Garmin Fenix 7 Pro 1.899.999, y además el Informe 1 tenía razón con la Aspiradora Samsung Jetbot a **3.476.040** (línea 42683) y la cafetera Peabody PE-CE5023IX a **2.489.999** (línea 48242), que mi primer barrido no capturó porque usan comillas simples en el `title`. **El único superlativo que se banca es "la cámara más cara del sitio", nunca "el producto más caro del catálogo".**
- **"El Pack Creadores entraría tercero entre las cámaras más reseñadas": entra CUARTO.** Podio real de cámaras deportivas y 360 **[verificado]**: GoPro HERO13 1723, Insta360 X3 1691, Gadnic 4K 1550, y recién ahí 1183. Empuja a la Insta360 X4 (1158) del cuarto al quinto puesto. Lo que sí es cierto y es el dato fuerte: **1183 lo convierte en la DJI con más opiniones del sitio por lejos**, hoy la mayor es la Osmo 360 con 402.

Dicho de otro modo: el Informe 1 chequeó las premisas del encargo en vez de repetirlas, y encontró que dos estaban mal. Confirmé sus dos correcciones. Ninguna de las dos premisas falsas debe entrar como superlativo en la guía nueva.

### 3. El dato fino que ninguno de los dos informes menciona

**La segunda cámara más cara del catálogo es la GoPro MISSION 1 PRO a 1.749.999 [verificado]**, a solo 10.230 pesos del Insta360 X5 Essentials Bundle (1.759.229). El Informe 1 nombra solo el Bundle. No cambia ningún claim, pero si en la guía nueva se escribe "la cámara más cara, por encima de X", el segundo puesto es un empate técnico y el orden puede darse vuelta con cualquier corrida de precios.

### 4. Contradicciones internas del Informe 2

- Dice **"Obligatorios (7)"** en el encabezado de la tabla de `Guide`, después lista **10** campos y cierra con "son 10 en total". El número que vale es el que no lleva `?` en `src/lib/types.ts`. No lo verifiqué. **Contá vos los `?` antes de asumir 7 o 10.**
- Dice **"Secuencia de sections (54 bloques)"** en el título de la tabla y después aclara que **"el total real de elementos del array es 72"**. La discrepancia es porque la tabla agrupa los `p` consecutivos. El molde tiene 72.

Ninguna de las dos rompe nada, pero muestran que el informe se editó a mitad de camino: tratá sus conteos como aproximados y sus rutas de archivo como exactas.

### 5. La corrección R5 tiene un costo escondido

El Informe 1 propone `relatedProducts: ["MLA39997069", "MLA66182550", "MLA39393179"]` para la Osmo Nano sin decir que eso **saca a la GoPro MISSION 1 PRO** de sus relacionados. Verifiqué el array actual y es exactamente eso. No es un reemplazo neutro, es una decisión editorial. Además el Informe 1 dice "hacer el mismo cruce en las otras cuatro fichas DJI" **sin especificar qué se saca de cada una**, y las otras cuatro ya tienen sus tres slots llenos **[verificado, los cuatro arrays]**. Alguien tiene que decidir cuatro sacrificios más, no está resuelto.

### 6. Riesgo comercial: ÚLTIMA UNIDAD

La **Pocket 4 Combo Estándar (MLA68244220)** figura con última unidad, y es una de las dos fichas que R3 y R4 van a enlazar desde la guía madre de DJI. El `trust-block` de la guía nueva **no puede prometer "stock real verificado"** sobre una publicación de una sola unidad sin salvedad, porque es justo el tipo de claim que se cae en días. Y si esa publicación muere, R3 y R4 quedan apuntando a una ficha sin stock desde la guía DJI, que es contenido que ya rankea.

Contexto de la memoria del proyecto que aplica acá: **un precio inflado repetido suele ser señal de poco stock, no un error**, y `deprioritized` es preferible a borrar.

### 7. Riesgo de proceso: el olvido silencioso

**Ningún script valida que exista la entrada en `guideCategories`.** Si te olvidás el Paso 1 de la §2, `/guias` muestra `camaras-vlog` en crudo, sin descripción, y **todos los checks pasan**. `npm run build` pasa. Es la única falla de este trabajo que no tiene trinquete automático.

### 8. Riesgo de alcance

De la memoria del proyecto: *"inventariar TODAS las variantes antes de arreglar un patrón de texto"*, y *"corregir la familia, en los DOS archivos, y releer el parche: los parches generan errores nuevos"*. El Informe 1 barrió y dejó documentado qué NO se rompe (peso, agua, 360 con más sensor, la DJI más barata, la entrada más económica de deportivas, los superlativos de las guías GoPro e Insta360, los labels de `internalLinks`), lo cual es lo que evita que el alcance crezca de 10 a 20 hallazgos a mitad del trabajo. **Ese inventario es el activo más valioso de los dos informes: no lo re-audites, pero tampoco lo amplíes sin volver a barrer.**

### 9. Cosa que ninguno de los dos miró

Nadie preguntó si esta guía **conviene**. No hay volumen de búsqueda, no hay SERP, no hay chequeo de si el nicho de cámaras de bolsillo tiene lugar editorial en Google Argentina. Los dos informes respondieron "cómo hacerlo bien", ninguno respondió "si hacerlo". Con el silo de cámaras deportivas publicado hace un día (2026-08-25), vale la pena la pregunta antes de escribir 72 bloques.