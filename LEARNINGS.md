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
