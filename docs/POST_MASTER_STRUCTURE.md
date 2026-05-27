# Master Structure — cómo escribir un post en ProductosVirales

> Biblia editorial. Cómo armar una guía que ranquea en Google **y** convierte clicks a MercadoLibre.
> Agnóstica al producto: sirve para perfumes, freidoras, aspiradoras, lo que sea.

Antes de leer: para la parte **técnica** (cómo se guarda en `guides.ts`, qué campos tiene un `Guide`, qué tipos de section existen) ver [ARTICLE_CREATION_WORKFLOW.md](ARTICLE_CREATION_WORKFLOW.md).
Este documento es lo **editorial** y lo **psicológico** que va arriba de esa base técnica.

---

## 1. Antes de escribir: definir el tipo de post

Cuatro tipos cubren el 95% de los casos. La estructura cambia según el tipo.

| Tipo | Cuándo se usa | Ejemplo en el sitio |
|---|---|---|
| **Ranking top-N** | "Los 15 mejores X" — el caballito de batalla | `mejores-perfumes-arabes-hombre` |
| **Review individual** | Un producto puntual o una marca completa | `philips-freidoras-de-aire-review` |
| **Comparativa A vs B** | Versus entre 2-3 productos o marcas | `atma-vs-peabody-freidora-de-aire` |
| **Informacional / soporte** | "Cómo usar X", "X vale la pena", "Cuánto consume X" | `como-usar-una-freidora-de-aire` |

La psicología no cambia. La estructura sí. Más abajo está el esqueleto de cada uno.

---

## 2. SEO base — el frontmatter (mismo para los 4 tipos)

| Campo | Regla | Por qué |
|---|---|---|
| `slug` | Kebab-case, en español, sin tildes. Coincide con keyword principal. Ej: `mejores-perfumes-arabes-hombre`. | Es la URL pública. Google lo lee. Cambiar slug = perder rankings. |
| `title` | Lo que ve el usuario en el sitio. Puede ser igual al `seoTitle`. | — |
| `seoTitle` | 50-60 chars. Incluye keyword principal + año + "Argentina" cuando entre. | Google trunca >60 chars. |
| `metaDescription` | 150-160 chars. Promete el valor concreto y termina con CTA implícito. **No genérica**. | Lo que se ve en SERP. CTR ↑ |
| `ogTitle` | Distinto al `seoTitle` — gancho emocional. Puede ser más largo (hasta ~90 chars). | Lo que se ve cuando se comparte en WhatsApp / redes. |
| `ogDescription` | Distinto a `metaDescription` — más emocional, menos SEO. | Mismo motivo. |
| `h1` | Largo descriptivo. Incluye número (si es ranking), año, y "Argentina" o variante regional. | Es el primer encabezado que Google lee. |
| `publishedDate` | Fecha real de publicación. **No tocar después.** | Afecta `datePublished` en JSON-LD. Cambiar = penalización. |
| `updatedDate` | Bumpear cada vez que se actualiza el contenido. | Señal de "vivo" para Google. |
| `hasDisclosure` | `true` siempre que haya links de afiliado. | Cumplimiento legal + confianza. |
| `quickPicks` | 3-4 productos destacados con label + tagline corto. **Obligatorio en rankings y comparativas.** | Decisión rápida para usuarios que no leen. Captura conversiones del 30%+ que no llegan al cuerpo. |

### Checklist anti-error en metadata
- [ ] `seoTitle` no tiene paréntesis vacíos `()` ni placeholders sin completar.
- [ ] `metaDescription` menciona **al menos un nombre propio** (marca, modelo o feature concreto).
- [ ] `ogTitle` y `ogDescription` son **distintos** de `seoTitle` / `metaDescription`.
- [ ] El año en `seoTitle` y `h1` es el año en curso (no quedaron strings de "2025" en 2026).
- [ ] El `slug` no existe ya en `guides.ts` (chequear con `grep`).

---

## 3. Estructura editorial — el orden que convierte

### Patrón base (rankings y comparativas)

```
1. Imagen hero (1200×630, imageSize: "hero")
2. Callout de oportunidad / scarcity   ← (opcional, si hay timing real)
3. h2: "Antes de comprar, X cosas prácticas"
   - 3-4 párrafos cortos que EDUCAN sin vender
   - Embedded: 1 product-card del "kit para empezar" o entrada de gama
4. h2: "El ranking" / "La comparativa"
   - h3 numerado por cada producto (1. Producto X)
   - product-card por producto
   - 1-2 párrafos: por qué está en esta posición, variantes, link interno
5. h2 deep-dive en el #1: "Qué dicen los X compradores del [producto]"
   - h3 "Lo que la mayoría destaca" + 2 párrafos + pull-quote
   - h3 "Lo que algunos advierten" + 1-2 párrafos + pull-quote
   - h3 "Sobre autenticidad" (si aplica) + lista + pull-quote
6. h2: "Cuál elegir según tu caso"
   - Lista por perfil (oficina, salida, presupuesto, etc.)
7. h2: "Preguntas frecuentes" → FAQ con 4-7 entradas long-tail
8. internalLinks block (guías relacionadas del cluster)
```

### Patrón base (review individual de producto o marca)

```
1. Imagen hero del producto principal
2. h2: "Lo bueno y lo malo en una mirada"
   - Lista de pros (5-7)
   - Lista de cons (3-5, honestos)
3. h2: "Análisis a fondo"
   - h3 por feature (potencia, capacidad, controles, etc.)
4. h2: "Qué dicen los compradores"
   - Pull-quotes + síntesis
5. h2: "Versus alternativas" / "Comparación con otras marcas"
   - Mini-tabla o párrafos comparativos
6. h2: "Para quién es y para quién no es"
7. h2: "Preguntas frecuentes"
8. internalLinks
```

### Patrón base (comparativa A vs B)

```
1. Imagen hero (puede ser composición A + B)
2. h2: "¿Cuál conviene, A o B?"  ← RESPUESTA DIRECTA en el primer párrafo (featured snippet)
3. h2: "Tabla comparativa"
4. h2: "Dónde gana A"
5. h2: "Dónde gana B"
6. h2: "Precio y dónde conseguir"
7. h2: "Para quién es A" / "Para quién es B" (listas)
8. h2: "Alternativas a tener en mente"
9. FAQ
10. internalLinks
```

### Patrón base (informacional / soporte)

```
1. Imagen hero
2. Respuesta directa en el primer párrafo (featured snippet)
3. h2 con la pregunta literal del slug
4. h2: contexto / cómo funciona
5. h2: lista o pasos numerados (si aplica)
6. h2: errores comunes / qué evitar
7. h2: cuándo conviene y cuándo no
8. h2: productos relacionados (con 2-3 product-cards)
9. FAQ
10. internalLinks
```

---

## 4. Trucos psicológicos — catálogo y dónde aplicarlos

Cada truco va etiquetado. Cuando uses uno, anotalo mentalmente para no abusar.

### 4.1 Anchoring (ancla de precio)
**Qué hace**: poner un precio alto al principio para que el del producto que recomendás parezca chico.
**Dónde**: intro o callout inicial.
**Ejemplo real**: *"Hace dos años, comprar un Creed Aventus en Argentina costaba 8 sueldos mínimos."*
**Cuándo no usar**: si el producto del post no tiene un "premium" caro como referencia.

### 4.2 Social proof estratificado
**Qué hace**: apilar varios signos de validación en una sola línea.
**Dónde**: en cada product-card del top 3.
**Ejemplo real**: *"4.9⭐ con 461 calificaciones — el mejor rating del sitio"*. Después: pull-quote con *"180 personas lo encontraron útil"*.
**Cuándo no usar**: si los números son flojos (rating < 4.0 o reviews < 50). Mejor no mostrarlos.

### 4.3 Specificity bias
**Qué hace**: los números específicos generan más confianza que los redondos.
**Cómo aplicarlo**: en vez de "más de 1000 reseñas" → "1.247 reseñas". En vez de "dura mucho" → "8-10 horas en piel".
**Dónde**: todo el cuerpo.

### 4.4 Loss aversion suave
**Qué hace**: "si comprás mal, perdés X". Pero educando, no asustando.
**Dónde**: sección de autenticidad, errores comunes, "qué mirar antes de comprar".
**Ejemplo real**: *"Si te dura menos de 6 horas, probablemente sea una falsificación."*

### 4.5 Authority through honesty
**Qué hace**: reconocer una limitación del producto en mitad del review aumenta confianza en el resto.
**Dónde**: dentro de cada product-card. En h3 "Lo que algunos advierten".
**Ejemplo real**: *"El audio 10W es débil — patrón consistente en reviews"*. O *"En verano matás a alguien."*

### 4.6 Endowment effect (entry-level)
**Qué hace**: un kit pequeño / modelo de entrada → bajo costo de entrada → una vez comprado, el usuario se siente "ya parte del nicho" y vuelve por más.
**Dónde**: en quickPicks como "Para empezar" + embedded product-card variant="compact" en la sección educativa inicial.

### 4.7 Comparison framing (alternativa accesible)
**Qué hace**: comparar contra una marca occidental famosa cara.
**Dónde**: secciones tipo "X vs Y (occidental premium)".
**Ejemplo real**: *"Hawas Ice es el Invictus árabe a 1/3 del precio."*
**Cuándo no usar**: si el producto del post NO tiene un referente conocido. Forzar el paralelo se siente falso.

### 4.8 Identification language (porteño/argentino)
**Qué hace**: usar frases del habla cotidiana argentina genera identificación.
**Ejemplos**: *"que da calambre"*, *"matás a alguien"*, *"le gusta a todo el mundo"*, *"no falla"*, *"te deja colgada"*, *"pegó un giro"*.
**Cuándo no usar**: en sección de specs, FAQs o JSON-LD. Ahí pidén lenguaje neutro.

### 4.9 Path to action embedded
**Qué hace**: cada vez que aparece el nombre de un producto, debe ser clickeable (product-card o link inline).
**Dónde**: en TODO el cuerpo. No esperar al final.
**Regla**: si mencionás un producto en un párrafo y no hay link, falta link.

### 4.10 Pull-quote con atribución
**Qué hace**: cita textual de un comprador + atribución detallada.
**Formato**: *"texto"* — Comprador en Argentina, septiembre 2024 · 180 personas lo encontraron útil.
**Dónde**: al menos 2 por ranking, 1 por review individual.

### 4.11 Scarcity / urgency real (no falsa)
**Qué hace**: avisar de una oportunidad de precio que **realmente** existe.
**Dónde**: callout al inicio.
**Ejemplo real**: *"Está en un momento de precio atractivo. La baja puede deberse a competencia y no es seguro que se mantenga."*
**Cuándo NO usar**: si el precio no bajó en serio. Las urgencias falsas matan la confianza.

### 4.12 Trust block / "Cómo elegimos"
**Qué hace**: explica el método editorial. Wirecutter-style.
**Dónde**: una sola vez en el cuerpo, idealmente arriba.
**Formato**: bloque `trust-block` con `trustVariant: "methodology"`.

---

## 5. Imágenes — reglas

### Origen
1. **Preferencia**: hero del producto principal sacada del primer `images[]` del producto en `curated-products.ts`. URLs `http2.mlstatic.com` ya están permitidas en `next.config.ts`.
2. **Si el cluster tiene imágenes locales** (`/public/images/<cluster>/`): usarlas. Mejor LCP.
3. **Si no hay producto específico**: usar la imagen del producto más representativo del catálogo que cubra el tema.

### Specs técnicas
- **Hero**: `imageSize: "hero"` (default 1200×630). Va al inicio de `sections`.
- **Inline grandes**: `imageSize: "inline-lg"` (800×600).
- **Inline medianas**: `imageSize: "inline-md"`.
- **`alt` obligatorio**: descriptivo, incluye marca/modelo. No "imagen 1".
- **Formato**: WebP cuando se descarga local. Para URLs de ML, dejarlo como viene.

### Densidad visual
- 1 hero arriba. Mínimo.
- 1 imagen cada 600-800 palabras es ideal. Más que eso satura.
- Si el post es review individual: image-grid de 4-6 fotos del producto en alguna sección.

---

## 6. Workflow recomendado para escribir un post nuevo

### Paso 1 — Definir target
- ¿Qué query exacta querés rankear? (sacarla de GSC si ya hay impresiones, o de Google "people also ask").
- ¿Qué tipo de post es? (ranking, review, comparativa, informacional).
- ¿Qué slug va a tener?

### Paso 2 — Importar productos a `curated-products.ts`
- Listar los MLA IDs que vas a mencionar en el post.
- Usar `scripts/ml-product-importer.ts` o el script del cluster correspondiente.
- Verificar que cada producto tiene: imagen, precio, rating, reviews, descripción.
- Con esto las imágenes para el post ya quedan resueltas.

### Paso 3 — Escribir
- Elegir el esqueleto del tipo (sección 3).
- Llenar metadata según la sección 2.
- Aplicar al menos **3 trucos psicológicos diferentes** del catálogo (sección 4). No usar siempre los mismos.
- Insertar `product-card` por cada producto mencionado.
- Cerrar con FAQ + `internalLinks`.

### Paso 4 — Validar SEO
- [ ] `seoTitle` ≤ 60 chars.
- [ ] `metaDescription` 150-160 chars y no genérica.
- [ ] `ogTitle` y `ogDescription` distintos del seoTitle/metaDescription.
- [ ] Slug en kebab-case sin tildes.
- [ ] Keyword en H1 + primer párrafo + al menos 2 H2.
- [ ] Mínimo 3 enlaces internos a otras guías del cluster.
- [ ] FAQ con preguntas long-tail (sacar de "People Also Ask").
- [ ] Todas las imágenes con `alt` descriptivo.
- [ ] `hasDisclosure: true`.

### Paso 5 — Validar técnico
- `npm run lint` (solo errores nuevos cuentan).
- `npm run build`.
- `npm run dev` → abrir `/guias/<slug>` y revisar visualmente.

### Paso 6 — Publicar
- Si `publishedDate` es hoy o anterior → ya sale.
- Si `publishedDate` es futura → sale automático en esa fecha (ISR diaria).

---

## 7. Tipos de section disponibles (referencia rápida)

Para detalle de cada uno, ver `src/lib/types.ts` (interface `GuideSection`).

| Type | Cuándo usarlo |
|---|---|
| `p` | Párrafo. El básico. Soporta `[texto](url)` inline. |
| `h2`, `h3` | Subtítulos. H2 va al TOC. |
| `image` | Imagen suelta. Usar `imageSize: "hero" | "inline-lg" | "inline-md" | "inline-sm"`. |
| `image-grid` | Grilla de 2-4 imágenes (galería de producto). |
| `table` | Tabla comparativa. Usar `headers` + `rows`. |
| `list` | Lista bullet. |
| `card` | Card con heading + paragraphs + CTAs. |
| `product-card` | Card conectada a un producto por `productMlaId`. Variantes: `default` (full) o `compact`. |
| `callout` | Aviso resaltado. `calloutVariant: "note" | "warning" | "tip" | "update"`. |
| `pull-quote` | Cita destacada. Aceptar `attribution`. |
| `verdict` | Conclusión editorial. |
| `warning` / `bad` | Variantes específicas de aviso. |
| `trust-block` | Bloque metodológico. `trustVariant: "methodology" | "credentials" | "pricing"`. |

---

## 8. Cosas que NUNCA hacer

- ❌ Borrar `publishedDate` o cambiarla retroactivamente.
- ❌ Reusar un slug existente.
- ❌ Hardcodear un link a MercadoLibre en un párrafo (usar `affiliateUrl` del producto o el componente `AffiliateLink`).
- ❌ Inventar reviews / cantidades de reseñas. Si no las tenés, no las pongas.
- ❌ Usar urgency falsa ("solo por hoy").
- ❌ Llenar de keywords (keyword stuffing). Google penaliza.
- ❌ Copiar texto de otra guía dentro del mismo cluster. Cada post tiene que aportar algo único o el cluster se canibaliza.
- ❌ Publicar sin `hasDisclosure: true` cuando hay links de afiliado.

---

## 9. Ejemplos del sitio para inspirarse

Mejores referencias para clonar la estructura, cada una de un tipo distinto:

- **Ranking**: [`mejores-perfumes-arabes-hombre`](../src/data/guides.ts) — el más completo. Tiene callout de oportunidad, deep-dive del #1, pull-quotes con atribución y sección de autenticidad.
- **Review individual de marca**: [`atma-freidoras-de-aire-review`](../src/data/guides.ts) — h3 por modelo con product-card.
- **Comparativa**: [`atma-vs-peabody-freidora-de-aire`](../src/data/guides.ts) — respuesta directa arriba + tabla.
- **Informacional**: [`como-usar-una-freidora-de-aire`](../src/data/guides.ts) — pasos numerados + product-cards al final.

---

## 10. Mantenimiento

- Cada 60-90 días: revisar precios con `npm run prices:update -- --match <cluster>`.
- Cuando subís el precio de un producto que aparece en post antiguo: bumpear `updatedDate` del post.
- Cuando Google Search Console muestra una query con impresiones pero 0 clicks: revisar `seoTitle` y `metaDescription` de la página que la recibe.
- Cuando hay una guía con `updatedDate` > 6 meses y todavía recibe tráfico: revisar y refrescar.

Cualquier mejora a este documento va al PR junto con el cambio que la motivó.
