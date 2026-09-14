# BRIEF UNICO: instrumentos musicales en ProductosVirales

Consolidado de los tres informes, verificado contra el código el 2026-08-26. Todo lo que sigue está chequeado leyendo los archivos, no supuesto.

---

## 0. BLOQUEANTES ANTES DE ESCRIBIR UNA SOLA LINEA

1. **Faltan los 5 links de afiliado `meli.la`.** Sin eso no se puede llenar `affiliateUrl` y la ficha no se puede cargar. Regla del proyecto: Juan pasa los canónicos primero, recién ahí se arma todo. Ojo con el aprendizaje registrado: una publicación puede estar excluida del Programa de Afiliados y eso solo se descubre al generar el link. Si alguna de las 5 rebota, hay que buscar otra ficha del mismo producto antes de descartarlo.
2. **El pedal M-Vave Cube Baby (MLA19464828) todavía no tiene precio ni rating leídos.** Está como "a sourcear". No se carga hasta tener precio, rating y reviewCount reales.
3. **Los títulos exactos de las publicaciones de ML no están confirmados.** El `productSlug` sale del `title` que escribamos: si el título cambia, cambia la URL canónica. Fijar los 5 títulos antes de escribir cualquier link interno.

---

## 1. ROMPIMIENTOS A CORREGIR

### 1.A. Rompimiento real y condicional: uno solo

**Archivo:** `/Users/juan/Proyectos web/productosvirales/src/data/categories.ts`, categoría `audio` (slug en línea 110, bloque de precios en línea ~131).

Se rompe **solo si** la Pioneer se archiva con `categorySlug: "audio"`.

Verbatim actual:
> `Gama alta (JBL Charge, Boombox): <strong>$250.000-$625.000</strong>.`

Y la frase de cobertura, arriba en el mismo bloque:
> `Cubre desde el parlante de mesa de luz hasta el auricular cerrado que usa un editor de audio.`

Por qué rompe: el techo declarado de Audio es $625.000 y la Pioneer entra a $812.242, o sea $187.242 por encima. Y un controlador DJ no es "un parlante ni un auricular".

**Corrección recomendada: no romper nada.** Archivar los instrumentos fuera de Audio (ver sección 2) y el bloque queda intacto tal cual está. Si igual se decide meterlos en Audio, el reemplazo sería:

- Reemplazar la frase de cobertura por: `Cubre desde el parlante de mesa de luz hasta el equipo de un músico o un DJ que arranca.`
- Agregar al final del párrafo de precios: `Instrumentos y equipo de DJ: guitarras de entrada $90.000-$200.000, controladores DJ desde $800.000.`

### 1.B. Claim roto que las fichas nuevas EMPEORAN: cuatro ubicaciones, no tres

El informe 1 encontró tres. Grepeando yo encontré una cuarta que se estaba salteando. Este es el patrón exacto de la lección registrada: corregir la familia, en los DOS archivos, o queda contradicción.

Grep de control (verificado, devuelve estas cuatro líneas más ruido esperado):
```
grep -n "rating más alto de todo\|mejor rating de todo\|más validado de todo" src/data/*.ts
```

| # | Archivo:línea | Verbatim | Reemplazo |
|---|---|---|---|
| 1 | `src/data/curated-products.ts:27180` (bullet de `pros`, **la que faltaba**) | `'4.9⭐ con 929 calificaciones — el mejor rating de todo el sitio'` | `'4.9⭐ con {{reviews:MLA47275624}} calificaciones: el mejor rating de todas las pavas del catálogo'` |
| 2 | `src/data/curated-products.ts:27195` (`verdict`) | `Con 4.9⭐ sobre {{reviews:MLA47275624}} calificaciones es el producto con mejor rating de todo el sitio.` | `Con 4.9⭐ sobre {{reviews:MLA47275624}} calificaciones es la pava con mejor rating del catálogo.` |
| 3 | `src/data/guides.ts:7825` (`description` del product-card) | `4.9 estrellas, el rating más alto de todo el sitio.` | `4.9 estrellas, el rating más alto de todas las pavas del catálogo.` |
| 4 | `src/data/guides.ts:7860` (`verdict` de la guía, 35 líneas más abajo) | `avalada por el rating más alto de todo el catálogo (4.9★)` | `avalada por el rating más alto de todas las pavas del catálogo (4.9★)` |

Por qué: hay 126 fichas con rating 5.0 y 107 con 4.9. Ya era falso antes de esta tanda. La Pioneer entra con 4.9 sobre 4.031 opiniones: **empata en rating y le gana 4x en volumen**, o sea suma un contraejemplo ruidoso justo cuando se abre el rubro.

Detalle del #1: además del claim, tiene `929` hardcodeado mientras el `verdict` de la misma ficha usa `{{reviews:}}`. Pasarlo a token **baja** la deuda del trinquete `check-hardcoded-reviews.cjs`, no la sube, así que el cambio pasa el check.

Las cuatro van en **el mismo commit**. Si se corrige una sola, queda la contradicción.

### 1.C. Claims YA rotos que las fichas nuevas NO tocan (decisión de Juan, no bloquean)

- `curated-products.ts:4592` y `:4610`, Logitech G203: `"por lejos el producto con más reseñas de todo el catálogo"` y `"es el producto con más reseñas de todo el catálogo de ProductosVirales"`. Tiene 55.053. Los Redmi Buds 6 Play tienen 209.870. Falso por factor 4. En `guides.ts:2272` el mismo producto está bien acotado ("el mouse gamer más vendido del país"), así que la corrección natural es alinear la ficha con la guía.
- `curated-products.ts:27626`, pava Oster: `"es el producto más validado de todo el sitio"` con 4.7⭐ / 1.679. La Pioneer le gana en los dos ejes a la vez.
- `"La cafetera más cara de todo el catálogo"` adjudicada a **dos productos distintos**: `curated-products.ts:48467` (Peabody, con `$981.818` hardcodeado que no coincide con el $2.489.999 del catálogo) y `curated-products.ts:48766` (De'Longhi, $1.779.914), más `guides.ts:20045` repitiéndolo para la De'Longhi.

Ninguno de estos tres lo causan las fichas nuevas. Se pueden dejar para otra ronda.

### 1.D. Lo que salió limpio, verificado

- **Ningún superlativo de precio de alcance global se rompe.** La Pioneer a $812.242 queda en el puesto ~72 del catálogo: hay 71 fichas más caras (Samsung Jetbot $3.476.040, cafetera Peabody $2.489.999, DJI Osmo Pocket 4 $2.453.049, De'Longhi $1.779.914). La eléctrica a $199.374 tiene 290 fichas arriba. Confirmado el dato crítico del encargo.
- **Ningún récord de opiniones cambia de dueño.** Máximo: 209.870 (Redmi Buds 6 Play). La Pioneer con 4.031 entra en el puesto 123, la Femmto EAG003 con 3.842 en el 127. Les falta un orden de magnitud y medio.
- **No hay ningún claim de cuántas fichas/guías tiene el sitio de cara al usuario.** Solo dos comentarios de código que no renderizan. El `llms.txt` se genera en build time, se actualiza solo.
- **No hay ningún claim restrictivo de qué rubros cubre el sitio.** La metadata raíz es agnóstica de categoría. El catálogo ya cubre motosierras, colchones, termotanques y salamandras a leña: un instrumento no contradice ninguna promesa.
- **Categoría virgen confirmada.** Cero fichas de instrumentos hoy. Las únicas menciones son de paso (un parlante de karaoke con "entrada para guitarra", auriculares de estudio que hablan de "grabar instrumento") y ninguna afirma exclusividad.
- **Gaming no se rompe.** Su claim "la categoría con más variedad de precio del sitio" cubre un rango de $974.000; un rubro de instrumentos daría $722.243. No le gana.

### 1.E. Trampa a tener en cuenta: colisión de marca Femmto

**Femmto ya está en el catálogo** con dos balanzas digitales, una con 75.996 opiniones, descrita en `curated-products.ts:53006` y `:53009` como **"La más vendida del catálogo por lejos"**. La guitarra Femmto EAG003 con 3.842 opiniones no la desbanca, así que el claim aguanta. Pero **nunca escribir "la Femmto" a secas** en la guía nueva: siempre "la Femmto EAG003" o "la electroacústica Femmto".

---

## 2. DECISION DE SILO: silo propio `musica`

### La decisión

**Silo propio `musica`, con `category: "guitarras"` para la primera guía. Y categoría de producto propia `musica` en `categories.ts`.**

### Por qué no tech, con evidencia de código y no de criterio editorial

El argumento "un instrumento no es tech" es cierto pero blando. Lo que decide son dos cosas concretas del repo:

1. `guideSilos.tech` dice literal: *"Proyectores, smartwatches, streaming y otros gadgets para el día a día."* Meter una guitarra criolla ahí obliga a reescribir la descripción del silo hasta que no describa nada.
2. **`src/app/categoria/[slug]/page.tsx:71`** hace `getPublishedGuides().filter((g) => g.silo === slug)`. O sea, `silo: "tech"` hace que la guía de guitarras aparezca listada dentro de `/categoria/tech`, entre power banks y smartwatches. Es un efecto visible en producción, no cosmético.

Y `audio` es peor que `tech`: ese silo es *"auriculares y parlantes"*, reproducción, no ejecución. Además es el único silo que se rompe por precio (punto 1.A).

### Cuánto cuesta el silo nuevo: casi nada, verificado archivo por archivo

| Qué | Verificado en | Resultado |
|---|---|---|
| Rutas | `src/app/guias/[slug]/[sub]/page.tsx:17-21` | `generateStaticParams` deriva de `g.silo`. **No hay lista hardcodeada ni carpeta que crear.** Y `dynamicParams = true` (línea 12). Cero trabajo |
| Sitemap | `src/app/sitemap.ts:83` vía `guideHref()` en `src/lib/guide-url.ts:10` | Automático |
| Breadcrumbs | `src/components/guides/GuidePageView.tsx:88-110` | El `BreadcrumbList` es fijo (Inicio, Guías, título). El silo no aparece. Nada que romper |
| Kicker del artículo | `src/components/guides/ArticleHeader.tsx:40,67` | Linkea a `/guias#cat-guitarras` y el label sale de `formatCategory()`, que solo hace `split("-")` + `toUpperCase()`. No consulta `guideCategories` |
| Listado `/guias` | `src/app/guias/page.tsx:233-243` | `guideSilos[siloSlug]?.name \|\| siloSlug`. **Si no agregás la entrada, el h2 renderiza el slug crudo `musica` sin descripción.** No rompe, se ve feo. Por eso la entrada es obligatoria en la práctica |
| Nav sticky de `/guias` | `page.tsx:358-368` | Ordenado por cantidad de guías: un silo de 1 queda último. Correcto |
| OG image | `guias/[slug]/[sub]/opengraph-image.tsx` | Genérica, funciona |
| Scripts de check | grep sobre `scripts/*.cjs` | Ninguno tiene registro de silos válidos |

**El costo real está en el `categorySlug` de las fichas, no en el silo de la guía.** Los 14 slugs de `categories.ts` son: `viral, hogar, cocina, tech, gaming, audio, belleza, climatizacion, salud-bienestar, seguridad, juguetes, coleccionables, movilidad, hogar-jardin`. Ninguno es de música. Si le ponés `categorySlug: "musica"` a las fichas **sin crear la categoría**, se rompen tres cosas visibles:

- `src/app/producto/[slug]/page.tsx:345`: el `BreadcrumbList` JSON-LD apunta a `/categoria/musica`
- `src/components/products/ProductDetail.tsx:349` y `:369`: dos links visibles al hub
- `src/app/categoria/[slug]/page.tsx:56`: `notFound()` si el slug no está en `categories.ts`, o sea **404 real**

Precedente exacto: `hogar-jardin` (commit `bb28a29`) tocó los mismos tres lugares. No es territorio nuevo.

### Código exacto a agregar

**(a) `src/data/guides.ts`, línea 28641, al final de `guideSilos`, después de `"hogar-jardin"` y antes del `};` de la línea 28642:**

```ts
  musica: {
    name: "Música e instrumentos",
    description: "Guitarras, controladores y pedales: qué se consigue en MercadoLibre Argentina y qué mirar antes de comprar el primero.",
  },
```

**(b) `src/data/guides.ts`, línea 28666, como PRIMERA clave de `guideCategories`, arriba de `"camaras-vlog"`** (convención confirmada: lo más nuevo va arriba, así se creó `camaras-vlog` en el commit `4cce7f6`):

```ts
  guitarras: {
    name: "Guía de Guitarras",
    description:
      "Criollas, electroacústicas y eléctricas comparadas por lo que decide la compra: qué tipo de cuerda lleva cada una, cuáles vienen con amplificador y cuál sirve de verdad para arrancar.",
  },
```

Nota: el `<h3>` de categoría en `/guias` solo se renderiza si el silo tiene 2 o más categorías (`page.tsx:404`). Con una sola guía no se ve, pero la entrada tiene que estar igual para cuando entren `controladores-dj` y `pedales-efectos`.

**(c) `src/data/categories.ts`, al final del array, después de la entrada `hogar-jardin` que termina en la línea 313:**

```ts
  {
    slug: "musica",
    name: "Música",
    icon: "Music",
    pastel: "var(--color-pastel-purple)",
    h1: "Instrumentos y Equipo Musical",
    description: "Guitarras criollas, electroacústicas y eléctricas, controladores DJ y pedales, con precio real de MercadoLibre",
    buyersGuide: `
      <h2>Qué vas a encontrar en esta categoría</h2>
      <p>...</p>

      <h2>Qué mirar antes de comprar</h2>
      <ul>
        <li>...</li>
      </ul>
    `,
  },
```

Dato verificado que ahorra una discusión: **el campo `icon` de `categories.ts` es un string que no consume ningún componente.** Grepeé `TreePine` en todo `src` y solo aparece en `categories.ts:291`. El ícono real de navegación vive aparte en `src/data/category-nav.ts`, que importa componentes de `lucide-react` a mano. O sea: poner `"Music"` es documentación, no rompe nada aunque el nombre no existiera. Los pastel tokens válidos son los seis de `globals.css:16-21`: `pink, blue, green, amber, purple, coral`.

**(d) `src/data/category-nav.ts` (OPCIONAL, decisión de Juan).** Agregar `musica` acá lo mete en el header y el footer de todo el sitio. Con una sola guía y 5 fichas, mi recomendación es **no agregarlo todavía**: sumar el hub al menú principal antes de que tenga contenido diluye la navegación. Se agrega cuando el silo tenga 2 o 3 guías. Si igual se quiere ahora, hay que importar `Music` (o `Guitar`) de `lucide-react` arriba del archivo.

**Efecto secundario positivo de (c):** crear la categoría suma `/categoria/musica` al sitemap (`sitemap.ts:56-62`) y hace que la guía aparezca listada en ese hub por el match `silo === slug`. Los dos slugs coinciden en `musica`, así que el cruce funciona solo.

---

## 3. PLANTILLA DE GUIA

### 3.0. Decisión editorial previa: qué guía es exactamente

Hay UNA sola criolla en el catálogo. Una guía "las mejores guitarras criollas" con un solo producto pasa `check-guide-monetization.cjs` (pide 1 product-card mínimo) pero es editorialmente pobre y no compite en SERP.

**Ángulo recomendado:** conservar la keyword de cabeza en el H1 y usar las otras dos guitarras como el eje comparativo, que es exactamente la duda real del que arranca.

- `slug`: `guitarra-criolla-cual-comprar`
- `category`: `"guitarras"` · `silo`: `"musica"` · `pillar`: `true` (es la primera y la cabeza del silo)
- H1 sugerido: *"Guitarra criolla para empezar: cuál comprar y en qué se diferencia de la electroacústica y la eléctrica"*
- URL final: `/guias/musica/guitarra-criolla-cual-comprar`

La Pioneer **no entra en esta guía**: queda como ficha suelta esperando su propia guía de `controladores-dj`. Eso está permitido, `check-guide-monetization.cjs` audita guías, no fichas. El pedal M-Vave **sí puede entrar** como accesorio en la sección "qué sumar después", si se consigue el dato.

### 3.1. Interfaces (`src/lib/types.ts`)

```ts
export type LabelColor = "green" | "blue" | "amber" | "purple" | "slate";
export type Intensity = "baja" | "media" | "alta" | "muy alta";
export type CalloutVariant = "note" | "warning" | "tip" | "update";
export type TrustVariant = "methodology" | "credentials" | "pricing";
```

`GuideSection.type` admite: `"p" | "h2" | "h3" | "table" | "card" | "verdict" | "warning" | "bad" | "list" | "toc" | "image" | "svg" | "image-grid" | "product-card" | "callout" | "pull-quote" | "trust-block"`.

Campos de `Guide`: `slug, category, silo?, pillar?, title, seoTitle, metaDescription, ogTitle?, ogDescription?, ogImage?, h1, publishedDate, updatedDate, sitemapLastmod?, intro, sections, faq?, internalLinks?, internalLinksTitle?, hasDisclosure?, standfirst?, directAnswer?, readingTime?, quickPicks?`.

**Orden de campos del molde vivo** (`osmo-pocket-cual-comprar`, `guides.ts:165-291`), copiarlo tal cual: `slug` → `category` → `silo` → `pillar` → `title` → `h1` → `seoTitle` → `metaDescription` → `ogTitle` → `ogDescription` → `ogImage` → `directAnswer` → `publishedDate` → `updatedDate` → `hasDisclosure` → `readingTime` → `standfirst` → `quickPicks` → `intro` → `sections` → `faq` → `internalLinks`. (En el molde `h1` va antes que `seoTitle`, al revés que en la interfaz. No usa `internalLinksTitle` ni `sitemapLastmod`.)

### 3.2. Secuencia sección por sección

```
 1  image          imageSize:"hero", src, alt          (lo consume ArticleHeader; GuideRenderer lo saltea)
 2  callout        calloutVariant:"tip", calloutTitle:"Respuesta rápida"
 3  trust-block    trustVariant:"methodology"
 4  h2             id:"ranking"   "Las 3 guitarras que comparamos"

    -- bloque producto 1: la criolla Musette CG001 --
 5  p              kicker en **negrita**, una línea
 6  h3             nombre del producto
 7  product-card   productMlaId, label, labelColor:"green", ranking:1, description
 8  p              spec dura (nylon vs acero, medida, tapa)
 9  p              el argumento central de la guía
10  p              "Las contras. ..."
11  callout        calloutVariant:"warning", calloutTitle

    -- bloque producto 2: la electroacústica Femmto EAG003 --
12 p (kicker) · 13 h3 · 14 product-card (labelColor:"blue", ranking:2) · 15 p · 16 p · 17 callout warning

    -- bloque producto 3: la eléctrica Musette EG001 + ampli --
18 p (kicker) · 19 h3 · 20 product-card (labelColor:"purple", ranking:3) · 21 p · 22 p · 23 p

24  h2   "Qué cambia de la criolla a la electroacústica, y qué no"
25  p · 26 list (lo que cambia) · 27 p · 28 list (lo que queda igual) · 29 callout warning

30  h2   el ángulo económico propio: "Lo que la guitarra no trae y vas a tener que comprar igual"
31  p · 32 p · 33 p        (púa, funda, afinador, cuerdas de repuesto, cable y ampli en la eléctrica)

34  h2   "Cuánto cuesta una guitarra para empezar"
35  list tramos de precio con tokens {{precio:...}} y links a las fichas

36  table headers: ["Modelo", "Precio", "Tipo de cuerda", "Trae amplificador", "Ideal para"]
                 el nombre de cada fila = link markdown al meli.la

37  h2   "Cómo elegir"
38 h3 · 39 p · 40 h3 · 41 p · 42 h3 · 43 p · 44 h3 · 45 p    (4 pares, el último arranca "Recién al final, ...")

46  verdict   cierre con las 3 guitarras linkeadas a sus fichas
```

Después de `sections`, fuera del array: `faq` (9 items en el molde, la primera se renderiza abierta por `index === 0`, `GuideRenderer.tsx:834`), `RelatedGuides` (automático), `ArticleFooter`, e `internalLinks` (7 items: 3 fichas + 4 guías hermanas).

**El `toc` es automático** (`TableOfContents` desde `getTocItems`) y los `id` de h2/h3 los inyecta `ensureSectionIds`. **El único `id` que va a mano es `"ranking"`.**

Lo que el molde NO usa y conviene no estrenar acá: `pull-quote`, `bigNumber`, `boxed`, `image-grid`, `card`, `bad`, `warning`, `toc`, `svg`, `variant:"compact"`.

### 3.3. Tokens: dónde resuelven y dónde NO

Definidos en `src/lib/price-token.ts`, marcado `import "server-only"`:

| Token | Devuelve |
|---|---|
| `{{precio:MLA123}}` | `$ 812.242` exacto |
| `{{precio:MLA123:k}}` | redondeado al mil, para prosa |
| `{{preciodif:A:B}}` | diferencia absoluta formateada |
| `{{reviews:MLA123}}` | `reviewCount` con separador es-AR |
| `{{rating:MLA123}}` | `rating.toFixed(1)` |

**SI resuelven en:** `metaDescription` y `ogDescription` de la guía, `standfirst`, `directAnswer`, `content` de `p`/`callout`/`verdict`/`trust-block`, `items` de `list`, celdas de `table`, `description` de `product-card`, `tagline` de `quickPicks`, `question` y `answer` del FAQ, `label` de `internalLinks`, `label` de `card.ctas`, el dek de las tarjetas de `/guias`, `feed.xml`. En fichas: `metaDescription`, `articleBody`, `faq`, `description`, `verdict`, `pros`, `cons`.

**NO resuelven, sale el `{{...}}` literal en pantalla:**

1. **`section.title` de cualquier `h2`/`h3`.** `GuideRenderer.tsx:45,96,231,253` lo renderiza crudo, y peor: `ensureSectionIds` arma el ancla con ese texto, así que un token ensucia el `id`, el índice lateral y el link de anclaje. **En títulos va el número aproximado a mano** ("más de 4.000 opiniones").
2. **`guide.title`, `guide.h1`, `guide.seoTitle`, `guide.ogTitle`.** Y el título de las tarjetas en `/guias`.
3. **`alt` y `caption` de imágenes**, y el alt del OG.
4. **`specs` de un producto** (ni `label` ni `value`). `producto/[slug]/page.tsx:144-158` no incluye `specs` en la lista de campos que inyecta. Tampoco `title` ni `seoTitle`.
5. **Cualquier componente client.** `price-token.ts` es `server-only`.
6. **Si el producto no existe o el dato es 0/undefined**, el token queda visible a propósito, para que se note en la revisión. Eso es justo lo que caza `check-price-tokens.cjs`.

### 3.4. Verificación: correr los scripts SUELTOS, no encadenados

`npm run guides:check` encadena ocho scripts con `&&` y **para en el primero que falla**, enmascarando los siguientes (hay lección registrada). Mientras arreglás, correlos uno por uno:

```bash
node scripts/check-price-tokens.cjs
node scripts/check-stale-prose-prices.cjs
node scripts/check-hardcoded-reviews.cjs
node scripts/check-guide-monetization.cjs
node scripts/check-table-product-links.cjs
node scripts/check-canonical-product-links.cjs
node scripts/check-guide-internal-links.cjs
node scripts/check-uncovered-prose-prices.cjs
npm run lint
npm run build          # ESTE es el test: chequea tipos. No hay npm test
node scripts/check-price-guard.cjs
```

**El crítico para el silo nuevo es `check-guide-internal-links.cjs`.** Parsea `slug:` y `silo:` directo del texto de `guides.ts` (líneas 19-33). Si escribís `/guias/guitarra-criolla-cual-comprar` sin el silo, Next devuelve **HTTP 200 con "Guía no encontrada"**: invisible para cualquier chequeo de status code, y ya pasó dos veces en este repo. La forma correcta es siempre `/guias/musica/guitarra-criolla-cual-comprar`.

Dos scripts son trinquetes con baseline (`check-hardcoded-reviews.cjs` lee `scripts/hardcoded-reviews-baseline.json`, y `check-uncovered-prose-prices.cjs`): la deuda puede bajar, nunca subir. O sea, **la guía nueva no puede introducir ni una mención de reseñas hardcodeada nueva**: todo con `{{reviews:}}`, salvo en títulos (donde va el aproximado, y ojo que el trinquete puede contarlo).

---

## 4. PLANTILLA DE FICHA

### 4.1. Los 5 slugs, calculados con la función real

Corrí `slugifyTitle` de `src/lib/product-url.ts` con los títulos propuestos. Resultado verificado:

```
guitarra-criolla-musette-cg001-mla40485883
guitarra-electroacustica-femmto-eag003-mla19491306
guitarra-electrica-musette-eg001-con-amplificador-mla25602058
controlador-dj-pioneer-ddj-flx4-mla23145920
pedal-multiefectos-m-vave-cube-baby-mla19464828
```

Largos de la parte de título: 30, 38, 49, 31, 35. El corte es a 80, así que **ninguno se trunca**. `DDJ-FLX4` conserva el guion como separador (`ddj-flx4`), igual `M-Vave` (`m-vave`), y el acento de "Electroacústica"/"Eléctrica" se normaliza solo.

Regla: `productSlug(p) = slugifyTitle(p.title) + "-" + p.id.toLowerCase()`. **Si cambia el `title`, cambia la URL.** Fijar los títulos antes de escribir un solo link interno.

Estos strings son los que van en `internalLinks`, en los links markdown de la prosa y en el `directAnswer`. **`check-canonical-product-links.cjs` falla si escribís `/producto/MLA40485883` pelado.**

### 4.2. Forma del objeto `Product`

`Product` vive en `src/lib/types.ts:31` y tiene ~140 campos, la mitad metadata de perfume (`olfactiveFamily`, `notes`, `projection`, `volumeUnit`) que acá no aplica. Obligatorios: `id, title, price, currency, image, category, categorySlug, permalink, affiliateUrl, condition, freeShipping`.

**Orden del molde nuevo** (MLA39393179 y MLA68229126, idénticos campo por campo):

```ts
{
  id, title, canonicalName, brand,
  price, currency, image,
  category, categorySlug, permalink, affiliateUrl,
  condition, freeShipping,
  rating, reviewCount, reviewsSampledAt, soldQuantity,
  visibility,
  priceUpdated, priceLastChecked, priceVerifiedAt, priceStatus,
  seoTitle, metaDescription,
  pros,      // 4 bullets, admiten tokens
  cons,      // 4 bullets, admiten tokens
  verdict,
  specs,     // Array<{label, value}>, 14 a 16 filas, el bloque más largo
  relatedProducts,  // 3 IDs
}
```

### 4.3. Convenciones de redacción y valores fijos

- `category: "Música"` (display, capitalizado) vs `categorySlug: "musica"` (URL). Los dos, sí o sí, y el slug tiene que existir en `categories.ts` (ver 2.c) o es 404.
- `image`: sufijo **`-O.webp`**, nunca `-R.webp`. Y verificar la imagen con **GET, no HEAD** (el CDN de ML responde 405 a HEAD y una foto buena parece pesar menos que su miniatura). La resolución real ronda los 1200px.
- `condition: "new"`, `visibility: "normal"`, `freeShipping` según lo que diga la publicación real.
- **`priceVerifiedAt: "2026-08-26"` en las cinco.** Los precios se leyeron a mano hoy: eso las protege 7 días de que Bright Data las pise (el 2026-08-12 pisó 11 de 15 correcciones manuales).
- `relatedProducts`: 3 IDs. Las tres guitarras se enlazan entre sí; la Pioneer y el pedal necesitan un tercero, y como el rubro es nuevo puede tocar linkear a algo de `audio` (auriculares de estudio ATH-M30x calzan bien con la Pioneer).
- **Los `specs` NO resuelven tokens.** El precio nunca va en una spec.
- El molde arranca con un **comentario de bloque arriba del primer producto** documentando qué campo de la ficha de ML está mal y por qué se descartó (`curated-products.ts:970-972`). Es parte del molde, no decoración. Usarlo.
- El molde **no usa**: `originalPrice`, `images`, `description`, `articleBody`, `faq`, `structuredData`, `badge`, `pastelColor`, `customerReviews`, `mpn`. (Además, el `structuredData` de `curated-products.ts` es mayormente inerte: `page.tsx` overridea price y aggregateRating.)
- Voz: rioplatense, sin la frase "producto curado" (no es lenguaje natural argentino). Ante un dato que no está, "No declarada", directo.
- **Regla de honestidad dura, y esta tanda la va a tentar:** toda afirmación **negativa** de spec necesita una fuente que la niegue. La fila ausente en una tabla no cuenta. Aplica en cadena a la sección 5.

---

## 5. LO PUBLICABLE DE LA PIONEER DDJ-FLX4

Todo lo de abajo está verificado contra el manual oficial de AlphaTheta/Pioneer DJ, las páginas de producto de pioneerdj.com y alphatheta.com, y FAQs del Help Center. El manual quedó extraído en `/tmp/flx4.txt` (5.222 líneas) por si hace falta volver a citarlo.

### 5.1. Specs ratificadas

| Dato | Valor | Fuente |
|---|---|---|
| Canales / decks | 2 canales, 2 decks | ficha oficial |
| Pads | **8 pads de goma retroiluminados por deck** (16 sumando los dos) | manual pág. 56 |
| Jog wheels | 2. Tapa superior scratchea con Vinyl mode; el aro exterior hace pitch bend. Vinyl mode se activa desde rekordbox por teclado, no desde la controladora | manual pág. 19 |
| Salida MASTER | RCA no balanceada, 1 juego. 2,1 Vrms / 10 kΩ | manual pág. 159 |
| Salida auriculares | **Mini plug estéreo de 3,5 mm.** Requiere auriculares de **32 Ω o más** | manual págs. 36 y 159 |
| Entrada de micrófono | 1 de 6,35 mm (1/4"), no balanceada, con MIC ATT atrás y MIC LEVEL arriba. Se mezcla también en el stream USB | manual págs. 34 y 159 |
| USB | 2 puertos USB Type-C: uno de datos, otro solo de alimentación | manual págs. 33 y 159 |
| Alimentación | Bus USB 5 V 500 mA desde la compu. Con celular: adaptador o powerbank de **9 V 3 A** (máx. 24 V), sin ahorro de energía | manual págs. 38 y 159 |
| Placa de sonido | Interna, class compliant (sin driver en Mac ni Windows) | ficha oficial |
| Audio | 44,1 / 48 kHz. 16/24 bit. S/N 103 dB (USB). THD 0,005% | manual pág. 158 |
| Bluetooth | Bluetooth Low Energy, ~10 m, 2,4 GHz, FH-SS | manual pág. 160 |
| Medidas | 482 x 272,8 x 59,2 mm | manual pág. 158 |
| Peso | 2,1 kg | manual pág. 158 |
| Otros | Slot Kensington. Switch MONO/STEREO para Android atrás. Uso de +5 a +35 °C | manual págs. 34 y 158 |
| En la caja | Cable USB, garantía (solo Norteamérica y Europa), guía rápida, precauciones | manual pág. 3 |
| Lanzamiento | 8 de noviembre de 2022 | anuncio oficial |
| Precio internacional | USD 329 en pioneerdjstore.com al 26/08/2026. USD 325 al lanzamiento | tienda oficial; Hypebeast 8/11/2022 |
| Firmware más reciente | Ver. 1.07, 4 de septiembre de 2025 | pioneerdj.com |
| Vigencia | Producto **activo** para Argentina según la propia web de Pioneer DJ | pioneerdj.com |

**Modos de pad.** rekordbox (Mac/Windows e iOS/Android), botones dedicados: HOT CUE, PAD FX 1, PAD FX 2, BEAT JUMP, SAMPLER. Con SHIFT: KEYBOARD, BEAT LOOP, KEY SHIFT. Serato DJ Lite: HOT CUE, PAD FX, BEAT JUMP, SAMPLER; con SHIFT: AUTO LOOP. Serato DJ Pro (pago) suma PITCH PLAY, ROLL, KEY SHIFT.

**Software, qué es gratis y qué no.** rekordbox Mac/Windows: gratis, y la FLX4 es dispositivo **Hardware Unlock**, destraba el modo PERFORMANCE sin pagar plan. rekordbox iOS/Android: app gratis, suscripción opcional. Serato DJ Lite: gratis. Serato DJ Pro: pago. djay: gratis, **djay Pro es pago y por suscripción**. Traktor Play: licencia gratis vía Native Access. Además manda MIDI genérico. Streaming compatible según app, con suscripción propia y según país: Apple Music, Beatport Streaming, SoundCloud Go+, Tidal, Spotify.

### 5.2. El ángulo editorial que ninguna publicación de ML aclara

Esto es lo que hace que la ficha valga la pena, y sale de la FAQ oficial "What else do I need to start DJing?".

- **No hace falta notebook**: anda con PC/Mac o con celular. Pero la controladora sola no hace nada, siempre necesita una compu o un celular corriendo la app.
- **Con notebook y nada más ya se puede practicar**: rekordbox para Mac/Windows tiene **PC MASTER OUT, activado por default**, que saca el master por los parlantes de la propia notebook.
- **Con celular hace falta alimentación aparte**: adaptador de pared o powerbank de **9 V 3 A**, que no viene. La ficha oficial avisa que la mayoría de las powerbanks son de 3 V. El celular no alimenta la controladora.
- **El caso más "sin nada más"**: iPhone o iPad con puerto USB-C y rekordbox for iOS, con el cable que viene. Pero tiene letra chica oficial: con esa opción no se puede escuchar por auriculares enchufados a la FLX4, la perilla MASTER LEVEL deja de regular, no sale master por la unidad, y el micrófono conectado a la unidad no sale por el celular.
- **Por Bluetooth el sonido sale del celular, no de la controladora**, y para monitorear con auriculares hace falta un cable splitter que no viene (manual pág. 116).
- **La caja no trae parlantes, ni auriculares, ni cable RCA, ni fuente.**
- **Detalle argentino:** la salida de auriculares es mini plug de 3,5 mm, no de 6,35. La mayoría de los auriculares de DJ vienen con ficha de 6,35 o adaptador. Y tienen que ser de 32 Ω o más: con menos, el manual dice que no funcionan, y que además la unidad puede no andar alimentada por bus USB.

**Contra la FLX2** (lanzada 29/10/2024): la FLX2 baja de 16 a 8 pads, pierde los botones dedicados de modo (se cambia con SHIFT + BEAT SYNC), cambia RCA por mini plug de 3,5 mm en el master, tiene 1 solo puerto USB-C, mide 383,2 x 208 x 48,2 mm y pesa 1,2 kg contra 2,1 kg. La FLX4 es la que se puede sacar a tocar afuera.

**Contra la DDJ-200:** la diferencia que importa es que **la DDJ-200 no tiene placa de sonido**, y la FAQ oficial de AlphaTheta lo dice con todas las letras. Consecuencia: no tiene salida master propia ni salida de auriculares propia (hay que monitorear con un cable splitter en la salida de la compu o el celular), no tiene entrada de micrófono, y tiene 4 pads por deck con los modos elegidos desde la app. La propia página de Pioneer DJ la titula "DDJ-200 (archived)" y la marca como archivada para Argentina: está discontinuada, aunque siga apareciendo en la góndola argentina.

### 5.3. LISTA NEGRA: no publicar, y grepear contra lo escrito antes de cerrar

No alcanza con generarla. Hay lección registrada: hay que **grepear la lista contra el texto ya escrito**.

1. **"Entrada de micrófono TRS" o "entrada TS".** La web oficial dice `1/4" TRS Jack` y el manual dice `1/4" TS jack` más "Only an unbalanced input can be used". Se contradicen entre sí. Publicar solo: "entrada de micrófono de 6,35 mm (1/4"), no balanceada".
2. **Precio de lanzamiento de USD 299.** Aparece en búsquedas, sin fuente oficial ni prensa citable. Los únicos citables son USD 325 y USD 329.
3. **Precio de la versión blanca (DDJ-FLX4-W).** En la tienda oficial hay un USD 339 junto al 329, sin confirmar que corresponda a la blanca.
4. **Precio en pesos o precio de referencia argentino** más allá del $812.242 leído hoy en la publicación.
5. **Diámetro de los jog wheels.** No figura ni en specs oficiales ni en el manual.
6. **"Jogs capacitivos" o "táctiles".** El manual describe qué hace la tapa y qué hace el aro, nunca nombra la tecnología.
7. **"No tiene salida balanceada".** Es ausencia de fila, no negación explícita. Se puede escribir "la única salida master que declara Pioneer DJ es RCA no balanceada".
8. **"La DDJ-FLX2 no tiene entrada de micrófono".** Escribir "la ficha oficial de la FLX2 no lista ninguna entrada de micrófono".
9. **"La DDJ-FLX2 no tiene sección Beat FX".** Mismo caso: solo se puede decir qué lista el diagrama oficial de hardware.
10. **Medidas y peso de la DDJ-200.** La página de specs está archivada y no renderiza la tabla.
11. **Contenido completo de la caja de la DDJ-200.** Lo único citable en fuente global es que el splitter viene con el equipo.
12. **"La FLX4 es la sucesora de la DDJ-400".** Lo dice la prensa, no Pioneer DJ. No presentarlo como declaración del fabricante.
13. **Latencia de Bluetooth vs USB en la FLX4.** La advertencia oficial de latencia es del DDJ-200 con rekordbox for Android, no de la FLX4. No trasladarla.
14. **Autonomía en horas con powerbank.** No hay dato oficial de consumo. Solo el requisito de 9 V 3 A.
15. **"16 pads" a secas como cifra de la ficha oficial.** Publicable como "8 por deck"; el 16 total solo aclarando que es la suma de los dos decks.

**Cuidado especial con el superlativo de precio.** La Pioneer a $812.242 **no** es la ficha más cara del catálogo: hay 71 arriba. Formulación segura, acotada al rubro: *"la ficha más cara del rubro instrumentos del sitio"* o *"el equipo más caro de esta guía"*. **Nunca** "la más cara del sitio", "del catálogo" ni "de ProductosVirales". Misma disciplina para rating (empata con 107 fichas, pierde contra 126) y opiniones (puesto 123).

---

## 6. QUE NO SE PUDO VERIFICAR

Estricto. Nada de esto se escribe hasta resolverlo.

**Bloqueante para cargar las fichas:**

1. **Los 5 links `meli.la`.** No existen todavía. Sin ellos no hay `affiliateUrl`, y encima puede aparecer el caso de publicación excluida del Programa de Afiliados, que solo se detecta al generar el link.
2. **Precio, rating y reviewCount del pedal M-Vave Cube Baby (MLA19464828).** El único dato es "+1000 vendidos". Falta todo lo demás.
3. **Los títulos exactos de las 5 publicaciones de ML.** Los 5 slugs de la sección 4.1 están calculados sobre títulos **propuestos por mí**, no leídos de ML. Si el título final difiere, el slug cambia y hay que recalcular antes de escribir links.
4. **Las URLs de imagen `-O.webp` de los 5 productos.** No obtenidas. Verificar con GET, nunca con HEAD.
5. **`permalink` canónico de cada publicación.** No leído.
6. **`freeShipping` real de cada una.** No leído.

**Bloqueante para escribir la guía:**

7. **Las specs de las tres guitarras.** El informe 3 investigó **solo** la Pioneer. De la Musette CG001, la Femmto EAG003 y la Musette EG001 no hay nada verificado: ni medida (4/4, 3/4), ni tipo de cuerda declarado por el fabricante, ni maderas, ni qué trae el combo de la eléctrica (¿qué amplificador, de cuántos watts?, ¿trae cable?, ¿púa?, ¿funda?). Toda la sección "qué no trae y vas a tener que comprar igual" depende de esto.
8. **Que la ficha técnica de ML sea correcta.** Hay lección registrada: la ficha de ML puede estar **mal etiquetada**, no solo incompleta. Cruzar toda spec numérica contra la web del fabricante antes de publicarla. Con marcas genéricas de ML como Musette y Femmto puede directamente no existir web de fabricante: en ese caso, "No declarada".
9. **Si Musette y Femmto son marcas o son revendedores.** No verificado. Afecta a `brand` y `canonicalName`.
10. **Stock real y vendedor de las 5 publicaciones.** El informe 3 lo declaró explícitamente fuera de alcance. Y `priceStatus` del catálogo puede estar desactualizado: hay que ver la publicación en vivo. Ojo también con la señal registrada de **precio inflado repetido = poco stock**, no error de lectura.
11. **Volumen de búsqueda de "guitarra criolla" en Argentina.** Nadie lo midió. El silo entero se está armando sin dato de demanda. Antes de comprometer el silo conviene pasar la keyword por Keyword Planner, y aplicar la regla dura de medir la curva de EE.UU. contra la argentina.
12. **Estacionalidad del rubro.** No chequeada. En rubros estacionales ML se queda sin stock fuera de temporada. Vale mirar el conteo de publicaciones de la categoría antes de prometer más guías del silo.

**No verificado pero no bloqueante:**

13. **Si conviene sumar `musica` a `CATEGORY_NAV`.** Es decisión de Juan, no dato faltante. Mi recomendación: esperar a tener 2 o 3 guías.
14. **El `relatedProducts` de la Pioneer y del pedal.** Con solo 5 fichas en el rubro, dos de ellas van a tener que apuntar fuera de la categoría. Sin resolver.

---

## ORDEN DE EJECUCION SUGERIDO

1. Pedirle a Juan los 5 `meli.la` y sourcear el precio/rating del pedal.
2. Commit A, independiente y chico: corregir las **cuatro** ubicaciones del claim de rating de la Peabody (1.B) y correr el grep de control.
3. Commit B: `categories.ts` con la categoría `musica` + `guideSilos.musica` + `guideCategories.guitarras`. Build.
4. Commit C: las 5 fichas en `curated-products.ts`, con `priceVerifiedAt: "2026-08-26"`.
5. Commit D: la guía en `guides.ts`, con los links internos **siempre con el silo** (`/guias/musica/...`).
6. Correr los ocho checks sueltos + `lint` + `build`, y recién ahí pasar por el trío auditor con la lista negra de la sección 5.3 como input explícito.