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

## 2026-08-13 — Publicación automática de Instagram: dos bugs reales antes de que funcionara

**Qué pasó:** al armar `scripts/publicar-instagram.cjs`, dos fallos consecutivos antes de la primera publicación exitosa. (1) El script apuntaba a `graph.facebook.com`, y con un token generado por el flujo "API setup with Instagram login" eso devuelve `"Cannot parse access token"` (código 190) — parecía un token mal copiado (probé recopiarlo dos veces) pero el token estaba bien, el host era el que no correspondía. (2) La primera Historia de prueba se publicó con la imagen del post cuadrado (1080×1350, formato Threads/feed) en vez de una imagen 9:16 — se veía bien en la versión web de Instagram (letterboxed, sin recortar) pero en el celular (donde las Historias son siempre pantalla completa) salió recortada.

**Por qué:** Meta tiene dos flujos de Instagram Graph API con hosts distintos según cómo se conectó la cuenta — "Instagram login" usa `graph.instagram.com`, "Facebook login" (vía Página de FB) usa `graph.facebook.com` — y usan el mismo formato de token (`IGAA...`) así que el error no lo delata a simple vista. Y la plantilla dedicada para Historias (1080×1920, ya diseñada y auditada en la sesión del formato hype/cupón) nunca se guardó en el repo — vivía solo en el scratchpad de esa sesión, que es efímero, así que se perdió al cerrar la sesión.

**Cómo evitarlo:** si un script de Graph API devuelve "Cannot parse access token" con un token que parece bien formado, chequear primero qué flujo de conexión se usó (Instagram login vs Facebook login) antes de sospechar del token. Y toda plantilla HTML/CSS que pase el trío auditor y se vaya a reusar debe guardarse en el repo (`scripts/`) en el momento, no dejarla en scratchpad — ver `LEARNINGS.md` de la misma fecha.

**Archivos involucrados:** `scripts/publicar-instagram.cjs`, `scripts/threads-post-template-story.html`, `scripts/generar-imagen-story-instagram.cjs`

## 2026-08-12 — Diagnostiqué un bug de indentación que no existía, y el "arreglo" rompió el YAML

**Qué pasó:** al escribir el workflow `check-catalogo-fresco.yml` sospeché que el heredoc que arma el cuerpo del issue preservaba la indentación del YAML, y que por eso GitHub iba a renderizar el issue entero como un bloque de código (4+ espacios al principio de línea = code block en Markdown). Reescribí ese workflow y también `avisar-fallas.yml` para pegar el heredoc al margen izquierdo. Resultado: el heredoc en columna 0 rompió el bloque literal `run: |` y el YAML dejó de parsear.

**Por qué:** el test con el que "confirmé" el bug corría bash directo sobre un archivo `.sh` que yo mismo había escrito con 10 espacios de indentación. Ese test se saltea justo el paso que importa: **YAML quita la indentación común del bloque `run: |` antes de que bash vea nada**. Verificándolo bien (parsear el YAML con PyYAML y mirar el string que sale) el bash recibe todo en columna 0 y el cuerpo del issue siempre estuvo bien.

**Cómo evitarlo:** para verificar el comportamiento de un script embebido en YAML, extraerlo **parseando el YAML**, nunca reescribiéndolo a mano en un archivo aparte. El bug estaba en mi reproducción, no en el código. Y antes de "arreglar" un archivo que ya funcionaba (`avisar-fallas.yml` no había fallado nunca), pedir una prueba de que está roto, no una sospecha.

**Archivos involucrados:** `.github/workflows/check-catalogo-fresco.yml`, `.github/workflows/avisar-fallas.yml`

## 2026-08-12 — Arrastré la fecha del contexto y escribí datos con 2 días de atraso

**Qué pasó:** la sesión venía de una conversación anterior con fecha 2026-08-10 y seguí usando esa fecha durante todo el trabajo, aunque el calendario ya marcaba 11 y después 12. Se escribieron `priceLastChecked`, `priceUpdated`, `reviewsSampledAt`, `updatedDate` y `sitemapLastmod` con una fecha anterior a la real, y la entrada de `CURRENT_STATE.md` se tituló con el día equivocado.

**Por qué:** asumí la fecha del contexto heredado en vez de consultarla. En una sesión que dura varios días de calendario, la fecha "de la sesión" y la de hoy dejan de coincidir sin que nada lo avise.

**Cómo evitarlo:** correr `date` antes de escribir cualquier campo de fecha en el catálogo o en una guía, y de nuevo al cerrar la sesión. Es especialmente crítico acá porque `check-catalogo-fresco` usa `priceLastChecked` para decidir si el pipeline está congelado: fechas atrasadas a mano envenenan justo la señal que ese script mide.

**Archivos involucrados:** `src/data/curated-products.ts`, `src/data/guides.ts`, `CURRENT_STATE.md`

## 2026-08-12 — Llamé "récord" a un número mirando solo los últimos días de la serie

**Qué pasó:** Juan reportó 111 clicks y respondí que era "otro récord". Me corrigió: el récord son 158 clicks, del 27/07. El dato estaba en la misma serie diaria que yo había bajado minutos antes.

**Por qué:** leí la cola reciente de la serie (92 → 95 → 104 → 111, todo en alza) y generalicé a "récord" sin escanear la serie completa buscando el máximo. Un pico aislado varias semanas atrás no aparece si solo mirás la tendencia de los últimos días.

**Cómo evitarlo:** antes de decir "récord", "máximo" o "el mejor", calcular el máximo de la serie explícitamente (`max()`), no inferirlo de la tendencia. Y el error importaba: 158 clicks con 7.081 impresiones prueba que el sitio ya hizo más clicks con menos impresiones, o sea que el techo es más alto que el que yo estaba describiendo.

**Archivos involucrados:** ninguno (análisis de GSC)

## 2026-08-12 — Generalicé una afirmación a partir de un párrafo que hablaba de un solo modelo

**Qué pasó:** al escribir el `directAnswer` de `atma-freidoras-de-aire-review` afirmé que "ningún modelo de la marca trae programas sofisticados". El cuerpo de la guía dice eso del FR248ABP. Los otros tres modelos sí traen: el catálogo lista 8, 6, 12 y 6 programas, y la ficha de ML del propio FR248ABP dice "8 programas preestablecidos". La afirmación era falsa dos veces.

**Por qué:** leí un párrafo sobre un producto ("si querés programas preestablecidos, acá no va") y lo elevé a afirmación sobre la marca entera sin chequear los otros tres. Es el mismo patrón que ya está anotado del 05/08: los datos viven repetidos en varias capas y una lectura parcial produce un claim global falso.

**Cómo evitarlo:** cuando una frase diga "ninguno", "todos" o "la marca entera", verificar el dato en las N fichas del catálogo, no en la prosa de la guía. La prosa habla de un producto por vez; el catálogo tiene el campo por producto.

**Archivos involucrados:** `src/data/guides.ts` (guía `atma-freidoras-de-aire-review`)

## 2026-08-05 — Cambiar la cantidad de productos de una guía a mitad de escritura dejó claims de ranking desactualizados

**Qué pasó:** la guía `bicicleta-rodado-29` se escribió primero con 4 productos, pasó el trío auditor, y después Juan pidió que fuera de 6. Al sumar los 2 productos nuevos reescribí el ranking y los superlativos ("la más elegida", "la más liviana", "la más cara") pero no propagué el cambio a todas las capas: quedaron fichas en `curated-products.ts` diciendo "de las 4 bicicletas" o "la más barata" (cuando el producto nuevo pasó a serlo), un producto etiquetado "segunda más elegida" cuando en realidad pasó a ser la tercera en reseñas, y el `standfirst` de la guía siguió citando al producto viejo como "el más caro" cuando el nuevo pasó a costar más. El trío auditor (Codex) lo detectó en 2 pasadas separadas — la primera encontró 4 bloqueantes, la segunda encontró 1 residuo que se había escapado incluso después de la corrección grande.

**Por qué:** al reescribir a mano fui bloque por bloque (ficha por ficha, sección por sección de la guía) en vez de primero hacer un inventario de TODOS los superlativos existentes en el documento y verificar cada uno contra los datos nuevos antes de tocar nada. Los superlativos viven repetidos en varias capas del mismo dato (ficha: `description`/`verdict`/`pros`/`articleBody`/`faq`; guía: `standfirst`/`quickPicks`/`product-card`/párrafos/`tabla`/`precios`/`veredicto`/`faq`) y alcanza con no tocar una sola aparición para que quede una inconsistencia factual real.

**Cómo evitarlo:** cuando cambie la composición de un ranking (sumar/sacar productos, o que un producto cambie de precio/rating/reviewCount), antes de dar por cerrado correr un grep explícito de los superlativos usados ("la más X", "segunda/tercera Y", "de las N productos") sobre el bloque completo (ficha + guía) y recalcular cada uno a mano contra los datos actuales, no solo revisar visualmente los bloques que se tocaron directamente.

**Archivos involucrados:** `src/data/curated-products.ts`, `src/data/guides.ts` (guía `bicicleta-rodado-29`)

## 2026-08-04 — Pegué el mensaje de un commit anterior en un commit nuevo (copy-paste sin revisar)

**Qué pasó:** al commitear el fix de `metaDescription` de `yara-lattafa-guia-completa`, copié y pegué el heredoc del mensaje de commit de una tarea anterior en la misma sesión ("SEO semanal 2026-08-03: seoTitles + links contextuales...") en vez de escribir uno nuevo describiendo el cambio real de Yara. El commit quedó con un mensaje que no correspondía al diff.

**Por qué:** reutilicé la plantilla del comando anterior (heredoc `git commit -m "$(cat <<'EOF' ... EOF)"`) sin releer el contenido antes de ejecutar — el patrón visual del comando era idéntico al de momentos antes, así que no lo noté hasta revisar `git log` después.

**Cómo evitarlo:** antes de correr `git commit`, releer el mensaje completo contra el diff real que se está commiteando, no solo confiar en que el comando "se ve bien" porque sigue la misma estructura de uno anterior. Como no se había pusheado todavía, se corrigió con `git commit --amend` (seguro en este caso puntual: confirmado con `git merge-base --is-ancestor` que el commit no estaba en `origin/master` antes de amendear).

**Archivos involucrados:** `src/data/guides.ts` (commit `8169207`, mensaje corregido).

## 2026-07-26 — Sugerí auditar un "bug" de JSON-LD que en realidad no existía en producción

**Qué pasó:** mientras escribía la guía `proyector-astronauta`, encontré que la ficha `MLA46927234` tenía un bloque JSON-LD manual (`aggregateRating.reviewCount: '415'`, `offers.price: 20999`) desincronizado del campo dinámico real (`reviewCount: 870`, `price: 18673`). Sin revisar cómo se consume ese campo, lo reporté como bug real y lo flageé con `spawn_task` para auditoría aparte. Juan corrió esa tarea en otra sesión; al retomarla yo mismo, leí el renderer real (`src/app/producto/[slug]/page.tsx`) y descubrí que el `aggregateRating` se calcula en vivo desde `product.rating`/`product.reviewCount` cuando ambos existen (que es el caso en 229 de 231 productos con bloque manual) y el `offers.price` siempre usa `product.price` porque el spread lo pisa al final — el bloque manual nunca llega a renderizarse para casi ningún producto. No había ningún bug visible en producción.

**Por qué:** asumí que un dato crudo desincronizado en el archivo fuente implicaba necesariamente una salida incorrecta, sin verificar primero el componente que efectivamente arma el HTML/JSON-LD final. El patrón "dato viejo en curated-products.ts" ya había sido un bug real varias veces esta sesión (Xiaomi, Ezviz, Tapo) porque esos SÍ se leían directo en la prosa de las guías — pero ese precedente no aplicaba acá, porque este campo específico tiene una capa de protección explícita en el código (comentario "aggregateRating SOLO con datos reales").

**Cómo evitarlo:** antes de reportar o delegar la auditoría de un dato "desactualizado", buscar dónde se LEE ese campo (`grep` del nombre del campo en `src/app`/`src/components`) y confirmar si hay lógica que lo transforma/prioriza antes de llegar a la salida final. Un valor crudo desincronizado en la fuente de datos no es lo mismo que un bug de cara al usuario — sobre todo en un código base donde ya existen guardas explícitas para este patrón exacto.

**Archivos involucrados:** `src/data/curated-products.ts` (dato crudo, sin cambios — no hizo falta), `src/app/producto/[slug]/page.tsx` (donde estaba la protección que no había leído).

## 2026-07-19 — `until true; do ...; done` como loop de espera: nunca corre el body

**Qué pasó:** al esperar en background 5 auditorías paralelas de Codex/Gemini (trio-auditor sobre 4 guías), escribí un script de espera con `until true; do ... sleep 10; done`. El Monitor devolvió "DONE" casi al instante, mucho antes de que los procesos reales terminaran. Traté 3 de los 5 resultados como completos sin verificarlos.

**Por qué:** `until` corre el body mientras la condición sea FALSA. `true` (el comando) siempre devuelve éxito (0 = verdadero), así que `until true` nunca entra al loop — es lo opuesto de lo que quería (`while true` sí lo hace). El bug es puramente de shell, no del Monitor tool.

**Cómo evitarlo:** para loops de "esperar hasta que se cumpla una condición", usar `while <condición-negativa-o-comando-que-falla>; do sleep N; done` o directamente `while [ ! -s "$archivo" ]; do sleep N; done`. Nunca usar `until true`. Si un Monitor devuelve DONE sospechosamente rápido para un proceso backgroundeado de larga duración, verificar con `ps aux` antes de confiar en el resultado.

**Archivos involucrados:** ninguno del repo (script de shell ad-hoc en la sesión).

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

## 2026-08-15 — Declaré "0 links rotos" midiendo solo la mitad del problema

Al corregir los links internos hacia guías con silo, escribí un script que buscaba únicamente
`href: "/guias/<slug>"`. Dio 12, los corregí, volví a correrlo, dio 0, y le dije a Juan que estaba
resuelto. **No lo estaba.** Faltaban 11 links en formato markdown dentro de la prosa,
`](/guias/<slug>)`, que aparecen en `content` de párrafos, FAQ y veredictos. Los encontró Codex de
casualidad, porque su log mostró líneas de la guía de piletas que yo no había mirado.

**Por qué pasó:** asumí que los links internos entre guías vivían solo en el campo `internalLinks`.
En este repo también van embebidos en la prosa como markdown, que es incluso el caso más
frecuente.

**Regla:** antes de declarar un defecto resuelto por grep, enumerar todas las sintaxis en que ese
defecto puede escribirse en el repo. Para links internos son dos: el campo `href:` y el markdown
`](...)`. Un "0" que sale de una sola expresión no es un 0.

## 2026-08-15 — La verificación de imágenes que manda docs/fichas.md no funciona

`docs/fichas.md` mandaba verificar con `HEAD` que la imagen `-O`/`-F` pesara más que la miniatura
`-R`. El CDN de ML responde **405 a HEAD** y devuelve el `content-length` de su página de error
(600-1.400 bytes). O sea que el chequeo compara dos páginas de error.

Casi descarto la foto de la conservadora Mor 12 L porque "pesaba" 634 bytes contra 926 de su
miniatura. Por GET pesa 8.182 y es un webp válido.

**Regla:** verificar con GET (`curl -s -o /tmp/img -w "%{http_code} %{size_download}"`) y confirmar
el mime type. Ya quedó corregido en `docs/fichas.md`.

## 2026-08-15 — Confundí "es de metal" con "es apta para exterior", en tres lugares

Escribiendo la guía de mesa ratona di por hecho que una mesa de acero sirve para el balcón. No
es así: **la aptitud para exterior es un atributo declarado en la ficha, no una consecuencia del
material.** La Popstore la declara; la Mobilarg es de acero macizo y su propia ficha dice que NO
es apta.

El error se me coló en tres lugares distintos y los tres los encontró Codex, no yo:

1. La ficha de Popstore decía "una de las dos aptas para exterior", contradiciendo a la guía que
   decía "solo la Popstore". Contradicción pública entre dos páginas del sitio.
2. El párrafo de materiales de la guía decía que el metal "es lo único que aguanta exterior".
3. El FAQ decía "Solo si es de metal", y esa se me escapó **incluso después de corregir las otras
   dos** en la misma pasada.

**Regla:** cuando un atributo funcional (apta para exterior, apta para lavavajillas, resistente
al agua) se puede confundir con una propiedad del material, tratarlo como dato declarado y
grepear la afirmación completa en guía y fichas antes de darla por corregida. Que sea de acero
no dice nada sobre humedad, igual que ser de vidrio no dice nada sobre horno.

**Y el meta-error:** corregí dos de las tres apariciones y declaré el punto resuelto. Es el mismo
patrón del grep incompleto de los links internos del mismo día: arreglar las ocurrencias que veo
en vez de buscar todas las formas en que el error puede estar escrito.

## 2026-08-15 — Le pedí al auditor que vigilara un error y lo cometí igual, en la misma tanda

En la guía de lámpara de pie el ángulo editorial principal era "4 de las 5 no traen la
lamparita". **Son 3.** La Global RGB también tiene LED integrado; lo que pasa es que con 5 W es
decorativa y no funciona como lámpara de uso. Yo mismo lo había verificado y escrito en su ficha,
y aun así generalicé mal en la guía.

**Lo que hace grave a este caso:** en el prompt del trío auditor escribí, textualmente, que
revisaran si había "afirmaciones mal generalizadas... sobre qué producto incluye foco". Le pedí
al auditor que buscara exactamente el error que estaba cometiendo mientras lo escribía.

Los dos auditores lo encontraron por separado. Gemini le puso **4/10 en honestidad**, la nota más
baja de toda la sesión, y con razón: el error estaba en el ángulo central, o sea en lo que más se
lee y lo más probable de que cite un AI Overview.

**La conclusión que importa, y es distinta a la de las entradas anteriores:** tener la regla
escrita no alcanza. Ya estaba en este archivo desde la guía de mesa ratona, la había leído, y se
la pasé al auditor. El error igual salió, porque el problema no es no saber la regla: es que la
generalización cómoda ("las demás", "la única", "4 de 5") se escribe sola mientras uno está
pensando en el argumento, no en el conteo.

**Lo único que funcionó:** pedir calificación numérica en vez de GO/NO-GO. Con un veredicto
binario esto pasaba: la guía está bien estructurada, monetiza bien y el defecto es una palabra
repetida. Obligar a poner un número obligó a los dos auditores a buscar el motivo del descuento.

**Regla operativa:** antes de escribir cualquier claim con número o superlativo sobre el conjunto
("N de M", "la única", "las demás", "el resto"), contar producto por producto contra la tabla de
datos, no de memoria. Y al corregirlo, grepear TODAS las formas del claim antes de darlo por
cerrado: en esta guía había 11 apariciones en 2 archivos.

## 2026-08-15 — Arreglar un subconjunto y declarar la tarea cerrada (estantería flotante, 14 rondas)

**Qué pasó.** La guía de estantería flotante necesitó **catorce pasadas** del auditor para llegar a 10/10.
Casi ningún hallazgo fue un dato mal sourceado: fueron claims míos que se propagaron a varios lugares y que
corregí de a pedazos.

**El patrón, siempre el mismo:**

1. El auditor señala un claim falso en un lugar.
2. Lo corrijo ahí, hago un grep, veo cero residuos, declaro cerrado.
3. El auditor lo encuentra vivo en otro campo del mismo objeto.

Pasó cuatro veces con cuatro familias distintas:

| Familia | Dónde sobrevivió después de "arreglarlo" |
| :-- | :-- |
| Recuento de carga declarada | intro, tabla, FAQ y callout, en tres rondas distintas |
| Superlativos de precio | `cons` arreglado, `verdict` no; celda de tabla; `seoTitle` acotado y `verdict` no |
| Identidad de producto | guía arreglada, `seoTitle` y FAQ de la ficha no |
| Tarugo "igual al de un estante largo" | seis lugares, y un séptimo apareció después |

**Las tres causas reales:**

- **Grep que muestra solo el primer match de la línea.** Un `verdict` largo contenía la versión correcta al
  principio y la incorrecta más adelante. Mi barrido lo daba por limpio. Hay que iterar TODOS los matches por
  línea, no usar `grep -n` y leer el fragmento que imprime.
- **Grep sin acotar al bloque nuevo.** `grep -c` sobre el archivo entero devolvía decenas de coincidencias de
  otras guías y enmascaraba si las mías estaban bien o mal.
- **Parchar sin releer el objeto entero.** Al reemplazar un pro falso del Exahome kit escribí otro que decía
  "los mismos 20 cm que el kit más caro, sin pagar esa diferencia" cuando ese kit **es** el más caro, y quedó
  contradiciendo su propio `cons`. Un arreglo puede introducir un error nuevo.

**Regla operativa.** Cuando un auditor marca un claim de conteo, exclusividad, precio o identidad:

1. No corregir el lugar señalado. Primero **listar todas las apariciones de esa familia** en el bloque nuevo
   de los dos archivos, iterando cada match de cada línea, no el primero.
2. Evaluar cada aparición contra la tabla de datos, producto por producto, y anotar contra qué está acotada.
3. Corregirlas todas en una sola pasada y **releer el objeto completo** (verdict, description, pros, cons,
   articleBody, faq, specs, seoTitle, metaDescription), no solo el campo tocado.
4. Recién ahí volver a barrer y declarar cerrado.

**Lo que también salió de acá:** nunca afirmé un precio relativo sin dividir. "Comprar suelto sale peor que
cualquier kit" sonaba obvio y era falso: la unidad de 40 cm le gana por centímetro a dos de los tres kits y es
la más barata por estante en absoluto. Antes de escribir cualquier comparación de precio, hacer la cuenta.
