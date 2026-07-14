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

## 2026-07-09 — `git stash` sobre un árbol con trabajo sin commitear de Juan

**Qué pasó:** para verificar si un check fallaba antes de mis cambios, se intentó `git stash` en un working tree que tenía trabajo previo de Juan sin commitear (ArticleFooter, curated-products, scripts). Falló por un `.git/index.lock` viejo que el sandbox no puede borrar — de pura suerte, porque si funcionaba habría stasheado el trabajo de Juan mezclado con el de la sesión.

**Por qué:** se asumió que el árbol solo tenía los cambios de la sesión, sin correr `git status` antes.

**Cómo evitarlo:** nunca usar `git stash` en este repo. Para aislar cambios propios, comparar con `git diff` de archivos puntuales o leer el archivo en HEAD con `git show HEAD:path`. Siempre `git status` antes de cualquier operación de git que mueva estado.

**Archivos involucrados:** ninguno dañado; `.git/index.lock` sigue pendiente de borrar a mano (el sandbox no tiene permiso de unlink).

## 2026-07-06 — Guía de consumo eléctrico calculaba con tarifa 400 veces menor a la real

**Qué pasó:** la guía `cuanto-consume-freidora-de-aire` (publicada 2026-06-14) calculaba todos sus ejemplos con electricidad a $0,30-$0,50 por kWh. La tarifa real de Edenor/Edesur en julio 2026 es de ~$154-155/kWh antes de impuestos (~$180-230 con IVA y cargos, sin subsidio; ~$55-70 con subsidio dentro del bloque). Toda la guía decía que usar la freidora costaba "$8-14 al mes"; el número real (uso moderado, sin subsidio) es más cercano a $3.600-4.600 al mes. Se detectó al hacer una auditoría de candidatas a re-optimizar por SEO (el error no lo encontró ningún chequeo técnico, sino comparar esta guía contra otra del sitio, `estufa-electrica-bajo-consumo`, que sí tenía la tarifa correcta).

**Por qué:** el número de tarifa no se validó contra una fuente real al escribir la guía (parece un valor inventado o de un contexto/moneda distinto, nunca corregido). Al no haber un chequeo cruzado entre guías del mismo sitio que citan el mismo dato (precio del kWh), la inconsistencia quedó invisible durante 3 semanas.

**Cómo evitarlo:** cualquier guía que cite un precio de servicio público (luz, gas, agua) tiene que sacar el número de una fuente oficial citable (ENRE, cuadro tarifario de la distribuidora) en el momento de escribirla, no de memoria. Si dos guías del sitio citan el mismo tipo de dato (ej. precio del kWh), deberían coincidir en orden de magnitud — vale la pena un grep rápido de "kWh" en `guides.ts` antes de cerrar una guía nueva sobre consumo eléctrico, para detectar justamente este tipo de contradicción interna.

**Archivos involucrados:** `src/data/guides.ts` (guía `cuanto-consume-freidora-de-aire`)

## 2026-07-02 — Microsoft Clarity nunca grabó una sesión: faltaba en el CSP

**Qué pasó:** el tag de Microsoft Clarity estaba bien instalado en `layout.tsx` (ID `xgasuwpism`, script válido, evento `affiliate_click` cableado), pero el dashboard mostraba cero datos. La causa: el `Content-Security-Policy` en `next.config.ts` no incluía ningún dominio de `clarity.ms`, así que el navegador de TODOS los visitantes bloqueaba el script antes de cargarlo. Prueba limpia: en el navegador GA cargaba (estaba en el CSP) y Clarity daba `Failed to fetch` (no estaba).

**Por qué:** cuando se agregó Clarity, se sumó el `<Script>` pero no se actualizó la lista blanca del CSP. GA sí estaba en el CSP de antes, entonces el bug pasó desapercibido: parecía que "el tracking andaba".

**Cómo evitarlo:** cada vez que se agrega un tracker/script de un dominio externo nuevo, actualizar el CSP en `next.config.ts` en la MISMA tanda: `script-src` (cargar el JS), `connect-src` (mandar los datos) y a veces `img-src` (beacons tipo `c.gif`). OJO con los sub-dominios: Clarity carga el tag desde `www.clarity.ms` pero la librería real desde `scripts.clarity.ms` y colecta en `l.clarity.ms`, así que hace falta el comodín `https://*.clarity.ms` en `script-src` y `connect-src`, no solo `www`. Verificar SIEMPRE en el navegador (no solo leyendo el config): `window.clarity.v === true` y cookie `_clck` seteada. Que el tag dé 200 no alcanza — el bundle de segunda etapa puede seguir bloqueado.

**Archivos involucrados:** `next.config.ts` (CSP), `src/app/layout.tsx`.

## 2026-06-09 — 19 fichas con el prefijo del ID mal guardado (MLA en vez de MLAU)

**Qué pasó:** la auditoría completa del catálogo encontró 19 fichas cuyo `id` dice `MLA...` pero el permalink real es `/up/MLAU...` (user-products). Consultar la API con ese ID da 404 falso — al principio parecían 10 productos muertos que en realidad estaban vivos.

**Por qué:** imports viejos (scraper) derivaban el ID del lugar equivocado y le comieron la "U". Además, clasificar productos por cantidad de dígitos del ID es frágil.

**Cómo evitarlo:** clasificar SIEMPRE por el permalink (`/p/` = catálogo, `/up/` = user-product, `articulo.` = publicación individual). Los scripts de precios e importer ya lo hacen así; los IDs guardados quedan como están porque las rutas del sitio los usan — corregirlos solo si se verifica que nada los referencia.

**Archivos involucrados:** `src/data/curated-products.ts`, `scripts/update-prices-from-ml.cjs`


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

---

## 2026-06-10 — git stash en el sandbox dejó un index.lock huérfano

**Qué pasó:** para verificar si unos errores de lint eran preexistentes, corrí `git stash` desde el sandbox de Cowork. El sandbox no tiene permisos de escritura completos sobre `.git/`, el stash falló a mitad de camino y quedó un `.git/index.lock` huérfano que bloqueaba cualquier operación git. No se perdió nada (el stash nunca llegó a crearse y el working tree quedó intacto), y el lock se eliminó después de habilitar permisos de borrado.

**Por qué:** usé una operación git que escribe en `.git/` para algo que se podía responder de otra forma (los archivos con errores de lint ni siquiera estaban entre los modificados).

**Cómo evitarlo:** en este entorno, no usar operaciones git que escriben (`stash`, `add`, `commit`, `checkout`) — solo lectura (`status`, `diff`, `log`). Para saber si un error es preexistente, comparar la lista de archivos con error contra `git status --short`.

**Archivos involucrados:** `.git/index.lock` (eliminado).

## 2026-07-14 — "Tier 1: listas para escribir" del radar de oportunidades era 100% falso positivo

**Qué pasó:** en el radar de oportunidades de contenido (investigación con 3 agentes en paralelo), uno de los agentes recomendó 6 guías "listas para escribir ya" (cámaras por marca en seguridad, mouse/monitor/teclado/silla gamer por marca, auriculares Audio-Technica) basándose en "categoría con N productos, 0-1 guías dedicadas". Al ir a escribir la primera (cámaras Gadnic/Tapo/Ezviz) descubrí que los 12 productos del silo seguridad YA están cubiertos con contenido completo (H3 + product-card + 2 párrafos + pull-quote) repartidos entre 3 guías existentes (`camara-de-seguridad`, `camara-de-seguridad-exterior`, `kit-camaras-seguridad`). Verifiqué los otros 5 candidatos de la misma forma (grep de `productMlaId` y de `type: "h3"` dentro del rango de líneas de cada guía) y los 5 dieron el mismo resultado: Logitech (mouse-gamer), Samsung Odyssey (monitor-gamer), Redragon (teclado-gamer), Alpina/Cougar (silla-gamer) y Audio-Technica (auriculares-profesionales) ya tienen cobertura completa e individual dentro de guías "best-of" consolidadas.

**Por qué:** el agente de investigación contó "productos por categoría" vs. "guías por categoría" (grep de `category:` en curated-products.ts vs. `category:` en guides.ts) pero nunca verificó si esos productos ya estaban referenciados dentro del contenido de guías existentes. En los silos de aspiradoras/pavas/masajeadores el patrón real del sitio es "una guía por marca o formato" (bajo ratio productos/guía), pero en gaming y seguridad el sitio adoptó el patrón inverso: pocas guías "best-of" muy densas que ya cubren cada producto individualmente (alto ratio productos/guía). Un conteo a nivel categoría no distingue estos dos patrones.

**Cómo evitarlo:** antes de recomendar o escribir una guía de marca nueva, nunca alcanza con contar productos-por-categoría vs. guías-por-categoría. Hay que grepear los `productMlaId` (o equivalente) que aparecen DENTRO del contenido de las guías existentes de esa categoría/silo y cruzarlos contra los IDs de los productos candidatos. Si ya aparecen con su propio `h3`/`product-card`, es cobertura real aunque la guía "genérica" no tenga el nombre de la marca en el título — no es un hueco, es (en el mejor de los casos) una oportunidad de re-titular como se hizo hoy con `masajeador-espalda`, nunca de duplicar contenido.

**Archivos involucrados:** ninguno modificado (se detectó antes de escribir). Afecta la metodología de investigación de huecos de contenido en general.
