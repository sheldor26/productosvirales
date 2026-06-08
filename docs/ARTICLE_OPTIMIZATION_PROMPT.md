# Prompt para crear/optimizar artículos de producto

Plantilla reutilizable basada en la ingeniería inversa de la página de la **Atma FR901DP**
(`/producto/freidora-de-aire-y-grill-digital-atma-fr901dp-6-3-litros-mla37004216`),
que es uno de los artículos mejor armados del catálogo.

Cada artículo de producto en este sitio es un objeto `Product` dentro de
`src/data/curated-products.ts`. No es un texto suelto: cada campo se renderiza en una
parte distinta de la página. Optimizar un artículo = llenar bien todos estos campos.

---

## Parte 1 — Por qué la página del FR901DP funciona (lo que hay que copiar)

Antes del prompt, esto es lo que hace buena a esa página, para que sepas qué estás replicando:

1. **El H1 tiene un ángulo, no es el nombre del producto.**
   No dice "Freidora Atma FR901DP". Dice *"la única Atma que llega a 260°C e incluye termómetro"*.
   Promete algo concreto y diferencial. Ese es el gancho de Google y del lector.

2. **Pros y contras honestos.** Los contras son reales (precio alto, pesa 8 kg, ocupa lugar).
   Eso genera confianza y filtra al comprador equivocado, que es lo que sube la conversión.

3. **El veredicto resume en una línea para quién es.**
   "Si querés sellar carnes dentro de casa, es la única de la línea que lo resuelve bien."

4. **El cuerpo (`articleBody`) explica el *cómo funciona*, no repite la ficha.**
   Cada sección H2 responde una pregunta real: cómo funciona, qué incluye, en qué se
   diferencia de los otros modelos. Compara contra productos del propio catálogo con
   links internos (`/producto/MLA...`).

5. **Tabla de specs completa** → datos duros que el lector quiere y que Google indexa.

6. **FAQ que ataca las dudas reales de compra** (¿hace marcas de parrilla?, ¿cuánto
   espacio ocupa?, ¿en qué se diferencia del modelo barato?). Cada respuesta es
   autosuficiente.

7. **Datos estructurados (`structuredData`)** con rating real y reviewCount → habilita
   las estrellitas en Google.

8. **Todo apoyado en datos reales de la ficha de ML** (peso, dimensiones, potencia, rating
   con cantidad de calificaciones). Nada inventado; cuando algo no está confirmado, el texto
   lo aclara ("la ficha solo lista X, pero la descripción confirma Y").

---

## Parte 2 — El prompt

Copiá y pegá esto, completando la sección `DATOS DE ENTRADA` con la info del producto nuevo.

```
Sos el editor de ProductosVirales (PickViral), un sitio argentino de curación de productos
de MercadoLibre. Tu tarea: generar el objeto `Product` completo para un artículo nuevo,
optimizado para SEO y conversión, listo para pegar en src/data/curated-products.ts.

# REGLAS DE TONO
- Español rioplatense (vos, tenés, conviene). Cercano pero informado, nunca publicitario vacío.
- Honesto: los contras tienen que ser contras reales. La confianza vende más que el hype.
- Nada inventado. Si un dato no está en la ficha de ML, no lo afirmes. Si lo deducís, aclaralo.
- Frases cortas. Cero relleno tipo "en el mundo actual" o "la mejor opción del mercado".
- No uses emojis dentro del articleBody ni en las specs.

# DATOS DE ENTRADA (completar antes de generar)
- URL de MercadoLibre:
- Nombre/título de la publicación:
- Marca y modelo:
- Precio actual / precio anterior:
- Rating y cantidad de calificaciones:
- Specs de la ficha (capacidad, potencia, voltaje, dimensiones, peso, etc.):
- Qué incluye la caja / accesorios:
- Productos del catálogo con los que se compara (IDs MLA...):
- Diferencial principal (qué lo hace distinto a su competencia directa):

# QUÉ TENÉS QUE PRODUCIR (todos los campos del objeto Product)

1. seoTitle (≤60 car aprox): modelo + el diferencial. Ej: "Atma FR901DP: Freidora de Aire y Grill con 260°C y Termómetro".
2. metaDescription (≤155 car): el diferencial + prueba social (rating + nº de calificaciones). Tiene que dar ganas de clickear.
3. ogTitle / ogDescription: variantes para redes, un poco más punchy. ogDescription puede sumar el ángulo "analizamos si X justifica el precio".
4. h1: NO el nombre del producto. Un ángulo con promesa concreta y diferencial. Ej: "...: la única Atma que llega a 260°C e incluye termómetro".
5. pros (5-6 ítems): empezar por el más fuerte (rating si es alto). Cada uno concreto y verificable, no adjetivos sueltos.
6. cons (3-4 ítems): contras REALES (precio, peso, tamaño, algo que no trae). Honestidad = confianza.
7. verdict (1 frase): para quién es y qué problema resuelve. Empieza con el rasgo más fuerte.
8. articleBody (markdown, 4-6 secciones H2): este es el corazón. Reglas:
   - Cada H2 responde una pregunta real de compra, no repite la ficha.
   - Secciones recomendadas: "Cómo funciona", "Qué incluye / accesorio clave",
     "En qué se diferencia de [modelo competidor]", "Dimensiones y peso: lo que cambia en la práctica".
   - Comparar SIEMPRE contra otros productos del catálogo con links internos: [Nombre](/producto/MLA...).
   - Explicar el "por qué importa" de cada spec (ej: "los 60°C extra sirven para sellar carnes").
   - Usar negrita para los nombres de modos/funciones, no para frases enteras.
9. specs (tabla, 10-14 filas): Marca/Modelo, Capacidad, Potencia, Voltaje, Temperatura,
   Control, Programas, funciones clave, Dimensiones, Peso, Color. Datos exactos de la ficha.
10. faq (6-8 preguntas): las dudas reales antes de comprar. Incluir SIEMPRE:
    - "¿En qué se diferencia de [el modelo más barato/competidor]?"
    - "¿Cuánto espacio ocupa / cuánto pesa?"
    - "¿Qué viene incluido en la caja?"
    - preguntas sobre la función diferencial.
    Cada respuesta autosuficiente (que se entienda sin leer el resto).
11. description: las primeras ~250 car de la descripción del vendedor (tal cual, para contexto).
12. relatedProducts: array de IDs MLA del catálogo, idealmente los competidores ya comparados.
13. structuredData (schema.org/Product): name, description, brand, model, sku (=ID MLA),
    category, color, image, url, offers (price, ARS, InStock, url afiliado), aggregateRating
    (ratingValue, reviewCount, bestRating 5, worstRating 1). El rating y reviewCount tienen que
    ser los REALES de la ficha — esto habilita las estrellitas en Google.

# CHECKLIST FINAL (verificá antes de entregar)
[ ] El H1 promete algo concreto, no es el nombre del producto.
[ ] Hay al menos 3 contras reales.
[ ] El articleBody compara contra ≥1 producto del catálogo con link interno.
[ ] Ningún dato está inventado; lo no confirmado está aclarado.
[ ] La FAQ incluye la comparación con el modelo más barato y el tema espacio/peso.
[ ] El structuredData usa rating y reviewCount reales.
[ ] seoTitle y metaDescription respetan el largo y contienen el diferencial.
```

---

## Parte 3 — Cómo usarlo en la práctica

1. Sacá los datos de la ficha de MercadoLibre (o importá con `scripts/ml-product-importer.ts`).
2. Pegá el prompt, completá `DATOS DE ENTRADA`, generá el objeto.
3. Pegá el resultado en `src/data/curated-products.ts` siguiendo
   `docs/ARTICLE_CREATION_WORKFLOW.md`.
4. Correr `npm run lint && npm run build` antes de cerrar.

Para **optimizar un artículo que ya existe** (en vez de crear uno nuevo): pasale el prompt
junto con el objeto `Product` actual y pedile que aplique el CHECKLIST FINAL — que reescriba
el H1 con ángulo, agregue contras reales si faltan, sume comparaciones internas y complete
la FAQ. Eso levanta un artículo flojo sin rehacerlo de cero.

---

## Parte 4 — Checklist estándar (aplicar SIEMPRE, en cada optimización)

Este es el estándar fijo. Toda ficha optimizada tiene que cumplir todo esto, no se saltea nada:

1. **Keyword research antes de escribir.**
   - Mirar la carpeta `Keywords/<nicho>/` (exports de Ubersuggest) para el seed y los long-tail.
   - Validar/expandir con el **MCP de Ubersuggest** (Argentina nacional = `locId 2032`, `language: es`):
     `keyword_overview` para volumen + dificultad, `keyword_suggestions` para huecos.
   - Elegir 1 término cabeza + 2-3 long-tail honestos al producto. Descartar los de alto
     volumen que no describan el producto real (atraen clics que terminan en 1 estrella).

2. **Metadatos** — `seoTitle` (≤60, con la frase exacta de más volumen al frente),
   `metaDescription` (≤155, diferencial + prueba social), `ogTitle`/`ogDescription`, y `h1`
   con ángulo (no el nombre del producto).

3. **Snippets / schema** — `structuredData` Product con `aggregateRating` (rating + reviewCount
   reales) y `offers` con precio real. La página ya genera FAQPage y BreadcrumbList solas si
   cargás `faq`. Sin precio válido el snippet de Oferta no valida en Google.

4. **Links internos juicy** — 3 a 5 links en el `articleBody` a **productos reales del catálogo**
   (verificar que los IDs existan), idealmente competidores/alternativas. Más `relatedProducts`
   bien elegidos (mismo nicho, buen rating). Tejer la red interna del nicho.

5. **Contenido** — `articleBody` (5-7 H2 que respondan dudas de compra, no repitan la ficha),
   `specs` completas, `pros`/`cons` honestos, `verdict`, `faq` (6-9), y `customerReviews`
   reales **incluyendo las críticas** (1-2★). La honestidad sube la conversión y baja devoluciones.

6. **Humanizer** — pasar todo el texto por el criterio humanizer: sin relleno de IA,
   em-dashes moderados, comillas rectas, frases cortas, voz rioplatense.

7. **Verificar** — `npm run lint`; que el objeto parsee; que todos los links internos y
   `relatedProducts` resuelvan a IDs existentes; largos de title/meta en rango.

8. **Cerrar** — actualizar `CURRENT_STATE.md`. Commit solo si Juan lo pide; push lo corre Juan
   (credenciales).
