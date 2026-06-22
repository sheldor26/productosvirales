# fichas.md — Cómo se arma una ficha de producto (estándar de importación)

> Proceso OFICIAL para importar y enriquecer una ficha de producto en `src/data/curated-products.ts`.
> Toda ficha nueva sigue esto. Complementa a `docs/guias.md` (diseño de guías) y al `Product` type en `src/lib/types.ts`.

## Principio

Una ficha de ProductosVirales **no copia el texto del vendedor de MercadoLibre**. Se construye cruzando datos duros con la voz real de los compradores, en tono honesto y anti-marketing. El diferencial del sitio es la honestidad: toda ficha lleva los **contras reales**.

## Fuentes y jerarquía de verdad

Se usan hasta 4 fuentes. Cuando una contradice a otra, gana la de más abajo:

1. **API oficial de ML** (datos crudos): precio, atributos/ficha técnica, imágenes, rating, reviewCount, desglose por estrellas, y el **texto real de las reseñas** (con fecha y "útiles"). Es la base.
2. **Ficha técnica de ML** (los `attributes`): specs declaradas. Más confiable que el título/descripción del vendedor.
3. **Página oficial del fabricante** (Nespresso, Philips, Atma, etc.): se usa **a favor** para completar specs (potencia, materiales, dimensiones, funciones) y para entender los ángulos de venta del producto.
4. **Reseñas de compradores de ML**: el **filtro de verdad**. Validan o desmienten los claims de marketing. Por encima de todo lo demás cuando hay conflicto.

**Regla de oro del marketing:** la página del fabricante (y la publicación) son marketing. Sirven para **specs y ángulos**, NO para validar claims. Todo claim ("automática", "19 bares", "del grano a la taza") se cruza contra la ficha técnica + las reseñas antes de afirmarlo.

## Paso a paso

1. **Traer datos de la API** (precio, attributes, imágenes, rating, reviewCount, breakdown, reseñas). Nunca scrapear ni inventar.
2. **Buscar la página oficial del fabricante** y completar/verificar specs. Reglas:
   - Tomar el dato del fabricante **solo si el modelo matchea exactamente** la publicación argentina (cuidado con sub-modelos y specs por región: el modelo de EE.UU. ≠ el de AR). Si no estás seguro de que sea el mismo modelo, **omitir** el dato.
   - Usar al fabricante para specs y para entender el producto, **no** para los claims (esos van contra reseñas).
   - Si la página carga con JavaScript y vuelve incompleta, o está bloqueada, marcar "sin verificar en fabricante" y seguir. No frenar la ficha por esto.
3. **Caso sin fabricante (marcas chinas / chicas / genéricas):** muchísimos productos no tienen fabricante encontrable online. **Es normal y no bloquea.** La ficha se sostiene perfectamente con **API + ficha técnica de ML + reseñas**. No inventar specs para "rellenar".
4. **Cruzar y escribir** en la voz del sitio (honesto, argentino, anti-marketing): desarmar los datos confusos del vendedor, aclarar lo que las reseñas contradicen.
5. **Curar 3-4 reseñas reales** (ordenadas por "útiles") como `customerReviews`, con su fecha; usar la(s) mejor(es) como cita. **Nunca inventar reseñas.** Incluir al menos una crítica honesta si la hay.
6. **Completar el checklist agent-ready** (ver abajo) y el `structuredData` (Schema con rating y precio reales).

## Checklist agent-ready (campos de una ficha completa)

- `canonicalName` · `brand` · `description` (corta, honesta)
- `rating` + `reviewCount` **reales** + `ratingBreakdown`
- `specs` (12-16, verificadas; fabricante + ficha técnica ML)
- `customerReviews` ≥3 reales con fecha · `reviewsSampledAt`
- `pros` / `cons` honestos · `verdict`
- `articleBody` (6-7 H2: qué es, cómo funciona, contras, para quién, veredicto) con números reales
- `faq` (6-8) · `seoTitle` / `metaDescription`
- `structuredData` Product + Offer + aggregateRating (datos reales, sin placeholders)
- `priceUpdated` / `priceLastChecked` / `priceStatus: "fresh"` · `affiliateUrl` (meli.la, verificado)
- `relatedProducts` (links internos cruzados)

## Reglas de honestidad (no negociables)

- Si un dato no se conoce con certeza → **se omite**, no se inventa (vale para specs, mpn, soldQuantity, duración, etc.).
- Toda ficha incluye **contras reales** sacados de las reseñas.
- Las reseñas se citan textuales, con fuente ML y fecha.
- No usar fotos de compradores (derechos del autor); sí las imágenes del listado oficial.
