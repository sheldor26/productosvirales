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

## 2026-08-16 — Pasarle al auditor una tabla de verdad, no solo el diff

**Qué funcionó:** en las cinco guías del día, el prompt de Codex arrancó con una **tabla de verdad**
armada a mano: cada producto con precio, medidas, peso, capacidad, opiniones y qué campos NO publica
su ficha. Después la instrucción explícita de chequear toda afirmación comparativa contra esa tabla,
recorriendo **todas** las coincidencias por línea y no la primera.

**Por qué funcionó:** con la tabla adelante, Codex encontró **32 errores factuales** que ninguno de
los cinco scripts de check del repo detectó. Y no eran errores sutiles: "4 colchones de 2 plazas"
cuando uno era Queen, "la densidad más alta del grupo" cuando dos de cinco no publican densidad, "el
único con manijas laterales" cuando otro simplemente no llena ese campo.

Sin la tabla, el auditor tendría que reconstruir los datos leyendo las mismas fichas que yo leí, y
heredaría mis errores de lectura. Con la tabla, tiene una fuente independiente contra la cual medir.

**El límite que quedó claro:** un script valida **qué producto gana un superlativo**. No valida **si
la frase aplica a quien decís que aplica**. Esa distinción es la que explica por qué mis chequeos
mecánicos dieron 9/9 en verde mientras Codex encontraba siete errores en el mismo texto.

**Cuándo aplicarlo:** en toda guía comparativa, siempre. Armar la tabla es media hora y ahorra dos o
tres pasadas de auditoría. Incluir explícitamente la columna de **"campos que este producto NO
publica"**, porque convertir un dato ausente en un "no lo tiene" fue el error más repetido del día:
siete de los ocho de la última guía.

## 2026-08-13 — Publicación automática de Instagram (feed + Historias) quedó funcionando de punta a punta

**Qué funcionó:** `scripts/publicar-instagram.cjs` publica posts y Historias reales en `@productosvirales.ok` vía la Instagram Graph API oficial (flujo "API setup with Instagram login", app Meta "ProductosVirales Social"). Sube la imagen a Vercel Blob (público), crea el media container, espera a que Instagram lo procese, y publica. Reusa el generador de imágenes del post cuadrado (`generar-imagen-post-threads.cjs`) para el feed, y usa un generador nuevo (`generar-imagen-story-instagram.cjs` + `threads-post-template-story.html`, 1080×1920) para Historias — nunca la misma imagen del feed, Instagram la recorta en 9:16 en el celular.

**Por qué:** todo el trabajo pesado (crear la app en Meta, agregar el caso de uso Instagram, sumar los permisos `instagram_business_basic` + `instagram_business_content_publish`, agregar `productosvirales.ok` como Instagram Tester, conectar el Blob store al proyecto) se hizo una sola vez en el browser; de acá en adelante publicar es un solo comando. División de tareas clara: yo armé y depuré todo el código, pero el token de acceso, el `BLOB_READ_WRITE_TOKEN` y la aceptación de la invitación de tester los hizo Juan directamente (nunca manejo credenciales).

**Cuándo aplicarlo:** cualquier publicación futura a Instagram (feed o Historia) de un producto ya verificado en vivo — mismo criterio de datos reales que Threads/X. El token de acceso dura 60 días, hay que regenerarlo antes de que expire (recordar chequear fecha).

**Archivos involucrados:** `scripts/publicar-instagram.cjs`, `scripts/generar-imagen-story-instagram.cjs`, `scripts/threads-post-template-story.html`, `.env.example`

## 2026-08-12 — La palabra de la query dice la intención mejor que la posición

**Qué funcionó:** al mirar por qué la marca Atma rendía mal en GSC (133 queries, 839 impresiones, 7 clicks), en vez de leer el promedio apareció un patrón nítido al ordenar por texto de la query:

| Query | Impr | Pos | Clicks |
|---|---|---|---|
| freidora de aire atma **8 litros opiniones** | 84 | 4,8 | 2 |
| freidora de aire atma **opiniones** | 43 | 5,2 | 2 |
| freidora de aire atma *(pelada)* | 48 | **2,9** | **0** |

La query pelada está **mejor posicionada** y hace cero; las que llevan "opiniones" están más abajo y sí convierten. Verificado en la SERP en vivo: la pelada devuelve Shopping, patrocinados y fichas de tienda (intención de compra), y ahí una guía no compite por más que esté tercera.

**Por qué:** la posición mide dónde te muestra Google, no si el que busca quiere lo que tenés. Dos queries del mismo producto pueden tener intenciones opuestas, y el promedio de CTR de la marca las mezcla y no dice nada. La palabra que agrega el usuario ("opiniones", "reviews", "vs", "sirve para") es la señal de intención más barata que hay.

**Cuándo aplicarlo:** antes de tocar una página que rankea bien y no convierte, agrupar sus queries por la palabra modificadora y no por la posición. Si las de intención de lectura convierten y las de compra no, el problema no es la página: es que hay queries que no se pueden ganar con contenido informativo. Sirve también al revés, para elegir qué contenido escribir: las de "opiniones" y "vs" son las que un sitio con DA baja puede pelear.

**Archivos involucrados:** `scripts/gsc/gsc.py` (consulta por dimensión `query`)

## 2026-08-12 — Chequear una capa que ningún test miraba: frescura, no coherencia

**Qué funcionó:** el repo tenía nueve scripts de check y todos dieron verde durante los cinco días en que el catálogo estuvo congelado con precios hasta 107% desviados. No era un bug de esos scripts: **todos comparan el sitio contra el catálogo**, y el catálogo era perfectamente coherente consigo mismo. Solo estaba viejo. El script nuevo (`check-catalogo-fresco.cjs`) no chequea coherencia sino frescura, y con un solo número — el `priceLastChecked` más reciente de todo el catálogo — delata el problema entero.

**Por qué:** una batería de tests puede estar completa dentro de su propio marco y ciega a una capa entera. Acá el marco era "¿el sitio dice lo mismo que el catálogo?" y la pregunta que faltaba era "¿el catálogo dice lo mismo que la realidad?". Ninguna cantidad de tests del primer tipo responde el segundo.

**Cuándo aplicarlo:** cuando algo se rompa y los tests hayan dado verde, no buscar el bug en los tests: preguntar qué capa no está mirando ninguno. Y al escribir un verificador, dejar explícito qué NO cubre — este mismo mide frescura y no veracidad, y el 12/08 daba verde con 11 precios falsos porque eran recién escritos.

**Archivos involucrados:** `scripts/check-catalogo-fresco.cjs`, `.github/workflows/check-catalogo-fresco.yml`

## 2026-08-12 — El trío atrapa sobre todo comparaciones que un cambio de precio vuelve falsas

**Qué funcionó:** 43 bloqueantes en tres tandas de auditoría (17 en `secador-de-pelo`, 22 en `ventilador-de-techo`, 4 en `atma-freidoras-de-aire-review`), y casi todos del mismo tipo: **afirmaciones relativas que un cambio de dato volvió falsas**. "El más liviano" del Vanta cuando el Spica también declara 400 g. "Los tres secadores iónicos" cuando son cuatro. "Casi el triple" cuando es 2,18x. "13 centímetros en radio" cuando son de diámetro. Más `structuredData` con el Peabody en `InStock` y conteos de reseñas viejos en seis fichas.

**Por qué:** un cambio de precio o de composición del ranking no toca solo el número: invalida toda la red de comparaciones construida sobre él, y esa red vive repartida en `standfirst`, `quickPicks`, `product-card`, prosa, tabla, veredicto, FAQ, y además en las fichas del silo. Es demasiada superficie para revisar a ojo, y es exactamente lo que un auditor externo con el dato correcto en la mano encuentra rápido.

**Cuándo aplicarlo:** darle al trío los datos reales verificados **en el prompt**, y pedirle explícitamente aritmética literal ("si dice el doble, chequeá que lo sea"). Ahí rinde. Y correr una pasada extra sobre las fichas del silo, no solo sobre la guía: en las tres tandas aparecieron más bloqueantes en fichas que en la guía misma.

**Archivos involucrados:** `src/data/guides.ts`, `src/data/curated-products.ts`

## 2026-08-12 — Verificar la premisa del auditor antes de aplicar su corrección

**Qué funcionó:** agy dio un NO-GO afirmando que el modelo correcto era "FR248AP" y pidiendo reemplazar las 9 menciones de "FR248ABP" del cuerpo de la guía. En vez de aplicarlo, se fue a la ficha técnica de MercadoLibre: dice literalmente `Línea: FR248 / Modelo: FR248ABP`. El cuerpo estaba bien; el que estaba mal era el `directAnswer` nuevo, que había copiado el nombre del **título de la publicación**. La corrección se aplicó al revés de lo pedido.

**Por qué:** el título de una publicación de ML lo escribe el vendedor y suele tener el modelo mal tipeado; la ficha técnica es el campo estructurado. Un auditor que lee el título como fuente llega a la conclusión opuesta con total seguridad. De haberle hecho caso se rompían nueve lugares correctos para dejar uno incorrecto.

**Cuándo aplicarlo:** siempre que un auditor pida un cambio masivo basado en un dato de producto (modelo, capacidad, potencia), verificar ese dato en la ficha técnica antes de tocar nada. Complementa lo ya anotado sobre chequear las premisas que uno mismo le afirma al auditor: también hay que chequear las que el auditor trae.

**Archivos involucrados:** `src/data/guides.ts` (guía `atma-freidoras-de-aire-review`)

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

## 2026-08-15 — El auditor externo encontró un bug del sitio entero, no de la guía

Codex marcó NO-GO en la guía de conservadoras por tres `internalLinks` que apuntaban a
`/guias/<slug>` sin el silo. Lo importante no fue el hallazgo puntual sino lo que apareció al
medirlo: **23 links rotos en total, y solo 3 eran de la guía nueva**. El resto estaba en guías ya
publicadas, propagado por copiar los `internalLinks` de una guía a la siguiente.

Tres cosas que dejó esto:

1. **Cuando un auditor marca un defecto en contenido nuevo, medir el alcance en todo el sitio
   antes de corregir solo lo señalado.** El contenido nuevo casi siempre se escribe copiando el
   anterior, así que un defecto en lo nuevo es evidencia de que existe en lo viejo. Corregir solo
   lo que el auditor vio deja el 87% del problema intacto.

2. **Un bug puede vivir en dos sintaxis y es fácil medir solo una.** El primer barrido buscó
   `href: "/guias/<slug>"` y dio 12: parecía resuelto. Faltaban 11 más en formato markdown dentro
   de la prosa, `](/guias/<slug>)`. El "0 links rotos" del primer chequeo era falso. Al grepear un
   defecto, enumerar todas las formas en que ese defecto puede escribirse antes de declarar limpio.

3. **Un auditor puede dar NO-GO sobre una versión que ya no existe.** En la segunda pasada Codex
   listó 4 bloqueantes; 3 ya estaban corregidos en disco cuando emitió el veredicto, porque había
   leído el archivo al arrancar y las correcciones entraron mientras razonaba. Antes de aceptar un
   bloqueante de una pasada larga, verificar cada punto contra el archivo actual. Uno de los cuatro
   era real y se corrigió; los otros tres habrían sido trabajo repetido.
