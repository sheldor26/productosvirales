# Errores

> Bitácora de cosas que salieron mal. Crece con cada error.
> Formato: fecha — qué pasó — por qué — cómo evitarlo la próxima vez.

<!-- Agregar entradas nuevas arriba. Plantilla:

## 2026-MM-DD — Título breve del error

**Qué pasó:** ...

**Por qué:** ...

**Cómo evitarlo:** ...

**Archivos involucrados:** `path/a/archivo.ts`
-->

## 2026-06-09 — Un npm install vía symlink destruyó el node_modules local

**Qué pasó:** para verificar el build en el sandbox Linux, se armó una copia del proyecto en /tmp con `node_modules` como symlink al del proyecto real. Un `npm install --force` de binarios nativos Linux corrió A TRAVÉS del symlink y npm empezó a "retirar" (renombrar) y reinstalar paquetes en el node_modules real del Mac de Juan. El proceso falló a mitad de camino y dejó 541 de 561 paquetes rotos. Se recuperó parte con los renames de npm, pero al final fue irrecuperable.

**Por qué:** npm sigue symlinks para resolver la raíz de node_modules; `--force` además dispara reinstalaciones agresivas. Y el binario era para otra plataforma (linux-arm64 vs darwin).

**Cómo evitarlo:** NUNCA correr npm con un node_modules symlinkeado al árbol real. Para builds de verificación en sandbox: copiar el proyecto SIN node_modules y hacer `npm install` limpio en la copia (con `PUPPETEER_SKIP_DOWNLOAD=true` tarda ~1 min con cache). El node_modules es regenerable por diseño — la solución correcta fue borrarlo y reinstalar, no "repararlo".

**Resolución:** node_modules eliminado; Juan tiene que correr `npm install` en el proyecto (1-2 min). `package.json` y `package-lock.json` intactos, cero impacto en el código.

**Archivos involucrados:** `node_modules/` (descartable), ninguno versionado.

## 2026-06-09 — Tres bugs de JSON-LD vivían en producción (los encontró la auditoría)

**Qué pasó:** la auditoría SEO del sitio live encontró tres bugs de datos estructurados que estaban deployados: (1) el `image` del Article de guías concatenaba el dominio a URLs que ya eran absolutas de mlstatic (`com.arhttps://...`), generando una URL inválida en guías con hero externo; (2) el schema fallback de fichas usaba la categoría como `brand.name` (`"brand": "Cocina"`); (3) el mismo fallback usaba `soldQuantity` como `reviewCount` — dato factualmente incorrecto, con riesgo de penalización por reviews engañosas.

**Por qué:** los tres son fallbacks que nadie miraba porque las fichas "buenas" tienen `structuredData` propio que los pisa. El código de fallback nunca se validó contra el HTML real renderizado.

**Cómo evitarlo:** al tocar JSON-LD, validar el output renderizado de una página que use el FALLBACK, no solo de las que tienen datos propios. Y nunca prepender dominio a un src sin chequear `startsWith("/")`.

**Archivos involucrados:** `src/app/guias/[slug]/page.tsx`, `src/app/producto/[slug]/page.tsx`, `src/app/categoria/[slug]/page.tsx` (los tres corregidos 09-jun).

## 2026-06-06 — El parser de precios concatenaba centavos basura ($121.339,23)

**Qué pasó:** al actualizar precios de aspiradoras robot con el scraper, dos quedaron con decimales raros (`$121.339,23`, `$130.978,56`). El `readMoneyElement` (en `scraper.ts` y duplicado en `update-prices-from-ml.cjs`) concatenaba `__fraction` (el entero) con `__cents` del DOM, pero ese `__cents` no es el centavo del precio real (es de cuotas u otro valor). En ML Argentina los precios de PDP son enteros.

**Por qué:** el parser asumía que `__cents` siempre correspondía al precio principal. Además la lógica estaba **duplicada** en dos archivos, así que el bug vivía en los dos lados.

**Cómo evitarlo:** para precios ARS, usar solo `__fraction` y `Math.round`, nunca concatenar `__cents`. Ya arreglado en ambos archivos. Lección general: cuando una lógica está copiada en dos lados, el fix hay que hacerlo en los dos (idealmente, unificar — está flageado).

**Archivos involucrados:** `src/lib/scraper.ts`, `scripts/update-prices-from-ml.cjs`.

---

## 2026-06-06 — Scrapear muchas veces en una sesión escala el bloqueo de IP de ML

**Qué pasó:** tras ~8 chequeos de precio + varios intentos de import en la misma sesión, ML escaló de CAPTCHA simple a la pared dura `/gz/account-verification` (pide login), bloqueando incluso `curl`. Quedó imposible scrapear por horas, incluso headful.

**Por qué:** ML trackea reputación de IP. Demasiados requests seguidos desde la misma IP en poco tiempo la marcan, y el bloqueo escala.

**Cómo evitarlo:** preferir la API oficial (no tiene anti-bot). Si se usa el scraper: pocos requests, delays largos (ya en 8-20s), y NO insistir cuando ya bloqueó (empeora). Ver memoria `ml-scraper-correr-local-argentina`.

**Archivos involucrados:** `src/lib/scraper.ts`.

---

## 2026-05-26 — Edit que duplicó un h2 "Veredicto" en perfumes-arabes-por-color

**Qué pasó:** al reemplazar un callout en `perfumes-arabes-por-color`, mi `new_string` agregó accidentalmente un `{ type: "h2", title: "Veredicto" }` que ya existía más adelante en el array de sections. Resultó en dos h2 "Veredicto" consecutivos. Lo detecté al hacer una auditoría post-cambio con grep, y lo arreglé.

**Por qué:** cuando hago Edits sobre un bloque que está dentro de una estructura grande (un guide de 200+ líneas), si el `new_string` agrega elementos sin verificar el contexto inmediatamente posterior, puede duplicar elementos que ya estaban en el array.

**Cómo evitarlo:** después de cada Edit que **agrega** secciones nuevas a un array (no solo reemplaza texto), hacer un `grep` rápido del título/identificador para detectar duplicados antes de pasar al siguiente cambio. Para guides nuevos, considerar leer 5-10 líneas alrededor del punto de inserción para confirmar que no hay duplicado contextual.

**Archivos involucrados:** `src/data/guides.ts` (línea ~9035 en su momento).

---

## 2026-05-26 — Asumí que "Asad Bourbon" del catálogo era Lattafa oficial

**Qué pasó:** al planificar el guide `lattafa-asad-comparativa` (comparativa entre Asad Intense, Bourbon y Negro), asumí que los 3 eran productos Lattafa oficiales. Al chequear el catálogo descubrí que solo Asad Intense (MLA19715215) es Lattafa real — los otros 2 están etiquetados explícitamente como "genérico" en su `title` de MercadoLibre. Tuve que reescribir el ángulo del guide a último momento.

**Por qué:** asumí marca por nombre del producto sin verificar el campo `brand` (que estaba vacío) y sin leer el `title` con atención completa. La palabra "Genérico" estaba ahí.

**Cómo evitarlo:** antes de armar cualquier guide tipo "comparativa entre versiones de la misma línea", chequear que **TODOS** los productos comparten realmente la marca: leer el `title` completo de cada uno + el campo `brand` + cualquier mención de "genérico", "inspirado", "estilo X" en title/description. Si un producto tiene una marca distinta o ausente, el guide no es comparativa de versiones — es algo distinto.
