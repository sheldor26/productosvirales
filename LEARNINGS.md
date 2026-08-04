# Aprendizajes

> Bitácora de cosas que funcionaron bien y vale la pena repetir.
> Formato: fecha — qué funcionó — por qué — cuándo aplicarlo.

<!-- Agregar entradas nuevas arriba. Plantilla:

## 2026-MM-DD — Título breve

**Qué funcionó:** ...

**Por qué:** ...

**Cuándo aplicarlo:** ...

**Archivos involucrados:** `path/a/archivo.ts`
-->

## 2026-08-04 — Verificar en GSC antes de escribir una "guía nueva" que sugiere un reporte automático

**Qué funcionó:** el reporte semanal del `weekly-seo-aeo-loop` proponía una guía comparativa nueva "Yara vs Yara Elixir". Antes de escribirla, correr `scripts/gsc/gsc.py query-pages "yara elixir" "diferencia entre yara y yara elixir"` mostró que `yara-lattafa-guia-completa` YA rankea posición 7.1-2.5 para esas queries — escribir la guía nueva la hubiera canibalizado. El problema real era CTR bajo en una página que ya rankeaba bien, no falta de contenido; se resolvió con un ajuste de `metaDescription`, sin tocar título/H1/slug (freeze de posiciones top).

**Por qué:** un reporte automático (o cualquier lista de "oportunidades") identifica demanda de búsqueda, pero no necesariamente si el sitio ya la está respondiendo. `query-pages` es la única forma de confirmar qué URL está mostrando Google para una query específica antes de decidir crear contenido nuevo — la keyword suelta (volumen + dificultad en Ubersuggest) no alcanza.

**Cuándo aplicarlo:** cada vez que un reporte/checklist sugiera "guía nueva" para una keyword — correr `query-pages` sobre esa keyword exacta (y variantes cercanas) antes de escribir una sola línea. Si ya hay una URL rankeando, el problema casi seguro es de snippet/CTR, no de contenido faltante.

**Archivos involucrados:** `src/data/guides.ts` (slug `yara-lattafa-guia-completa`), `scripts/gsc/gsc.py`.

## 2026-07-19 — El trío auditor destapa deuda vieja de fichas, no solo bugs de la sesión actual

**Qué funcionó:** al publicar 4 guías STAGED viejas con `/trio-auditor`, Codex y Gemini no solo revisaron mi propio diff de la sesión — auditando el contexto completo (guía + fichas asociadas) encontraron inconsistencias de datos que llevaban meses sin tocarse (rating/reviewCount desincronizados, framing que contradecía el precio real, un caso extremo donde toda la narrativa de una ficha estaba armada sobre un precio 75% más bajo que el real). Ninguno de los chequeos mecánicos (`guides:check`, `tsc`) los agarra porque viven en prosa libre de `curated-products.ts`, no en tokens de precio.

**Por qué:** el trío lee la ficha completa con ojo fresco, sin el sesgo de "esto ya lo revisé antes" que tiene Claude sobre contenido que no tocó en la sesión. Es la única capa que compara la narrativa completa (verdict/pros/cons/articleBody/FAQ/structuredData) contra los campos vivos (`price`, `rating`, `reviewCount`) línea por línea.

**Cuándo aplicarlo:** antes de publicar o re-optimizar cualquier guía vieja, pedirle al trío que audite explícitamente las fichas de los productos mencionados, no solo la guía. Si una ficha lleva mucho sin enriquecerse (ver `docs/fichas.md`), asumir que puede tener staleness narrativa aunque el precio del catálogo esté fresco.

**Archivos involucrados:** `src/data/curated-products.ts`, `src/data/guides.ts`.

## 2026-07-05 — Clarity (clics fallidos) + código = diagnóstico UX en minutos

**Qué funcionó:** cruzar el mapa de calor de Clarity filtrado por "clics fallidos" con la lectura del componente. El heatmap mostró clics sobre nombres de producto ("Suono Digital 10L", "Philips HD9270") y sobre la foto grande; `ProductCard.tsx` confirmó que ni el título ni la imagen eran links. Diagnóstico cerrado sin adivinar: la gente toca foto/nombre esperando abrir el producto (hábito de ML/Instagram) y no pasaba nada — 11,7% de las sesiones con al menos un clic fallido.

**Por qué:** el heatmap solo dice *dónde* tocan; el código dice *qué* es clickeable. Juntos convierten un número abstracto ("11,7% dead clicks") en un fix concreto de una tarjeta.

**Cuándo aplicarlo:** cada vez que Clarity muestre clics fallidos, retrocesos rápidos o clics continuos altos: filtrar grabaciones/heatmap por esa métrica, identificar el elemento, y verificar en el componente si es interactivo antes de tocar nada.

**Archivos involucrados:** `src/components/guides/ProductCard.tsx`

## 2026-06-09 — Actualización de precios migrada a la API: 195 productos en segundos

**Qué funcionó:** `npm run prices:check/update` ahora va API-first: los productos de catálogo y MLAU se chequean contra `/products/{id}/items` de a 8 en paralelo (195 productos, 0 fallos, segundos), y Puppeteer queda solo para las ~13 publicaciones individuales. El flag `--api-only` permite corridas sin navegador. Bonus: un 404 en `/items` significa "sin vendedores activos" (no "producto eliminado") — verificado porque el producto sigue saliendo en `/products/search`; el script lo marca `out_of_stock` automáticamente.

**Por qué:** sin navegador no hay CAPTCHA ni riesgo de bloqueo de IP, y la velocidad habilita agendar la actualización diaria sin supervisión.

**Cuándo aplicarlo:** siempre para precios. La auditoría de hoy salió de esto: 100 precios corregidos y 16 productos sin vendedores deprioritizados en una sola corrida.

**Archivos involucrados:** `scripts/update-prices-from-ml.cjs`, `scripts/ml-product-importer.ts`


## 2026-06-09 — `/products/search` de la API de ML funciona con client_credentials (la búsqueda clásica no)

**Qué funcionó:** para descubrir productos nuevos sin scraper, `GET /products/search?status=active&site_id=MLA&q=...` responde bien con el token de `client_credentials`. La búsqueda clásica `/sites/MLA/search` da 403 (PolicyAgent). Con eso + `/products/{id}` + `/products/{id}/items` se importaron las 18 cafeteras en una sesión, sin tocar Puppeteer.

**Por qué:** completa el flujo de la entrada del 06-06: ahora tenemos búsqueda → metadata → precio, todo por API oficial. Limitación encontrada: muchas fichas de catálogo no tienen oferta activa (solo ~40 de 100 candidatas tenían precio), así que conviene buscar de más y filtrar.

**Cuándo aplicarlo:** para abrir cualquier nicho nuevo: buscar por keyword + por marca/modelo específico (las queries de modelo rinden mejor que las genéricas), filtrar por oferta activa, y recién ahí elegir el set a importar.

## 2026-06-09 — Los clusters estacionales se planifican 2-3 meses ANTES del pico

**Qué funcionó:** el keyword research de calefacción mostró números brutales (`caloventor` 165.000 búsquedas en mayo, `estufa eléctrica` 110.000 en junio, SD 12-13 en varios términos) pero llegamos tarde: una guía nueva tarda 4-8 semanas en rankear y en septiembre el volumen cae ~90%. En vez de forzarlo, quedó agendado para febrero-marzo 2027.

**Por qué:** la estacionalidad extrema convierte un cluster excelente en uno mediocre si se publica en el pico en vez de antes. El mismo research sirvió para detectar la alternativa evergreen (cafeteras: `cafetera express` 22.200/mes SD 11).

**Cuándo aplicarlo:** antes de elegir cluster, mirar SIEMPRE el desglose mensual de búsquedas, no solo el promedio. Calendario tentativo: calefacción se arranca feb-mar, ventilación/aires se arrancaría ago-sep, y los evergreen (cafeteras, ollas, cocina) llenan los huecos.

## 2026-06-06 — La API oficial de ML resuelve los precios sin bloqueos (mejor que el scraper)

**Qué funcionó:** registrar una app en developers.mercadolibre.com.ar y usar OAuth `client_credentials` para leer datos de producto. El token sale sin login interactivo (válido 6h). `/products/{id}` da metadata + imágenes; `/products/{id}/items` da el precio del mejor vendedor activo. Cero CAPTCHA, cero IP bloqueada. Se importaron 10 aspiradoras robot así, sin pelear con el anti-bot que justo ese día había escalado a la pared de `/gz/account-verification`.

**Por qué:** el scraping de ML es una pelea constante contra el fingerprint y la reputación de IP. La API oficial es el canal legítimo: estable, legal, sin bloqueos. La trampa era creer que `client_credentials` no servía para leer `/items` — sí sirve vía `/products/{id}/items`. `/items/{id}` directo SÍ está bloqueado por PolicyAgent (403), pero el subendpoint del producto no.

**Cuándo aplicarlo:** para importar productos nuevos o actualizar precios, preferir SIEMPRE la API oficial sobre el scraper Puppeteer. Pendiente: convertirlo en un script reusable que reemplace a `update-prices-from-ml.cjs`.

---

## 2026-06-06 — Workflow multiagente para escribir una red de artículos

**Qué funcionó:** escribir 7 guías SEO interrelacionadas en un solo workflow (7 escritores + 7 revisores en paralelo, ~315k tokens). Clave: dar a cada agente el contexto exacto en el prompt (tipo `Guide`, Master Structure resumida, datos reales de los 18 productos con sus meli.la, mapa de slugs para cross-links, y un ejemplar real). Cada agente devolvió el objeto `Guide` TS completo; después se extrajo el objeto, se insertó y se validó con `npm run build` + checks programáticos (afiliados reales, MLA existentes, slugs de cross-link, palabra "cluster", links `/producto/`).

**Por qué:** los 7 artículos eran independientes (slugs conocidos de antemano), así que el cuello de botella era escribir, no coordinar. Paralelizar bajó el tiempo a minutos y la etapa de revisión por artículo atajó errores.

**Cuándo aplicarlo:** para redes de contenido donde los slugs/cross-links se conocen de antemano. Pasar SIEMPRE: tipo TS + ejemplar real + datos verificados de productos + reglas de enlazado. Validar el TS con build y checks antes de commitear.

---

## 2026-05-26 — Ubersuggest descubrió un cluster de 7.500/mes que no estaba en el radar

**Qué funcionó:** pedir datos de Ubersuggest antes de empezar la fase 2 reveló que la gente busca perfumes árabes por **color del envase** (rosa, dorado, blanco, rojo, azul, marrón). 7.500/mes consolidado con dificultad <20 mayoritariamente. Ningún competidor en AR lo cubre. Se creó la guía `perfumes-arabes-por-color` que no estaba planeada en el roadmap original.

**Por qué:** los SEO tools sacan patrones de demanda real que no salen del sentido común editorial. Antes de armar un calendario completo de cluster, vale la pena cruzar la intuición con datos reales.

**Cuándo aplicarlo:** antes de cerrar el calendario de cualquier cluster nuevo, pedir un dump de Ubersuggest (o Ahrefs/Semrush) con las queries que matcheen el tema y filtrar por dificultad baja + volumen alto. Buscar específicamente patrones inesperados (color, marca específica, atributo físico).

---

## 2026-05-26 — Authority through honesty cuando una premisa editorial cambia

**Qué funcionó:** al armar `lattafa-asad-comparativa`, descubrí que solo 1 de los 3 productos del catálogo es Lattafa oficial — los otros 2 son "genéricos". En vez de tirar el artículo o esconder el dato, lo convertí en el ángulo principal: "qué es oficial, qué es genérico". El artículo terminó siendo más útil para el lector y mejor para SEO que la comparativa original planeada.

**Por qué:** la honestidad editorial sobre una zona gris (originales vs genéricos vs falsificaciones) construye más confianza que pretender que todos los productos son equivalentes. Y captura mejor las queries de gente confundida que tipea "Lattafa Asad Bourbon" sin saber qué es.

**Cuándo aplicarlo:** cuando una premisa editorial cambie a mitad de armar un guide (productos no son los que pensabas, precios no son los que esperabas, marca no cumple lo que prometía), reescribir el ángulo en lugar de forzar el plan original. La honestidad selectiva es uno de los 12 trucos psicológicos catalogados en el Master Structure.

---

## 2026-05-26 — Data del catálogo > opinión propia para rankings

**Qué funcionó:** el guide `perfumes-arabes-mas-vendidos-argentina` se armó usando **conteo real de reseñas del catálogo** (`reviewCount` de cada producto en `curated-products.ts`) en lugar de opinión editorial. El top 1 (Hawas Ice con 9.144 reseñas) salió por número, no por preferencia personal.

**Por qué:** los rankings basados en datos verificables son más defendibles editorialmente, generan más confianza en el lector, y captan SEO de "más vendido" / "más comprado" / "más popular" sin riesgo de manipulación.

**Cuándo aplicarlo:** para cualquier guide tipo "los más vendidos / los más usados / los más reseñados", siempre extraer los datos del catálogo programáticamente y reportar honestamente. Es la mejor versión de specificity bias + social proof estratificado.

---

## 2026-05-26 — Conversion-first beats SEO-internal cuando hay tensión

**Qué funcionó:** después de aplicar la regla de "links a fichas internas siempre" en los 8 guides nuevos, Juan corrigió: prefiere links directos a meli.la para máxima conversión. El SEO interno se construye con cross-links entre guías (que son SEO editorial real), no con links de producto que solo desvían al usuario.

**Por qué:** el sitio es de afiliados, no es Amazon. El valor está en la comisión, no en el page view interno. Las fichas de producto siguen existiendo como destinos SEO orgánicos por su cuenta (rankean para queries de modelo específico). Pero desde un guide, el usuario ya leyó el contexto: cuando hace click en un producto, quiere COMPRAR.

**Cuándo aplicarlo:** la regla está en `docs/POST_MASTER_STRUCTURE.md` sección 4.9 y en `.claude/skills/new-post.md` regla 2. Links a productos → meli.la. Links entre guías → interno.

---

## 2026-05-26 — Cadencia de 3 días entre artículos del mismo cluster

**Qué funcionó:** publicar 8 guías del mismo cluster en bloque (de golpe el mismo día) hubiera mandado señal rara a Google ("contenido masivo de bajo costo"). Espaciar 3 días entre cada uno mantiene la apariencia editorial orgánica.

**Por qué:** Google prefiere señales de "publicación editorial sostenida" sobre "burst de contenido". 2 publicaciones por semana del mismo cluster es el sweet spot que usan publicaciones serias.

**Cuándo aplicarlo:** para cualquier cluster con más de 4 artículos planeados, agendar con `publishedDate` futuro separado por 3-4 días. El sitio tiene ISR diaria que los publica automáticamente sin intervención manual.

---

## 2026-06-10 — Centralizar el JSON-LD arregló 87 fichas de una sola vez

**Qué funcionó:** en vez de corregir a mano los 121 bloques `structuredData` cuyo precio se había desincronizado del campo `price`, se movió la lógica al generador de la página (`producto/[slug]/page.tsx`): los campos canónicos (precio, rating, disponibilidad, reseñas) SIEMPRE ganan, y el bloque manual queda solo para extras. Un solo cambio de ~80 líneas corrigió 87 fichas con precio contradictorio y conectó 45 fichas cuyas reseñas curadas no se publicaban como `Review[]`.

**Por qué funcionó:** el dato vivía duplicado (campo + bloque manual) y solo una de las dos copias se actualizaba automáticamente. Eliminar la duplicación en el punto de render es más barato y más seguro que mantener 121 copias sincronizadas.

**Para repetir:** cuando un dato aparezca duplicado entre campos estructurados y bloques manuales, mover la verdad al campo estructurado y generar el resto. Mismo principio que ya se aplicó con precios API-first.
