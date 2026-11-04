# Diseño: tandas en paralelo para optimizar guías (v3, Slice-and-Stitch + fixes de integridad)

Documento de diseño, todavía sin implementar. v1 (pipeline con candado de escritura global + semáforos) se mandó a auditar a Gemini como segunda opinión de arquitectura; v2 adoptó su propuesta de Slice-and-Stitch. Esta versión (v3) suma una segunda revisión independiente, de Codex, sobre la v2 ya escrita: encontró fallas de integridad de datos reales que Gemini no había visto (condiciones de carrera entre tandas, reversión destructiva, rangos que se corren dentro del propio Stitch, fichas compartidas sin dueño). Este archivo ya incorpora esos fixes.

## 0. Qué cambió respecto a v1 y por qué

Gemini señaló (acertadamente) que v1 resolvía con semáforos de JavaScript en memoria una contención que en realidad es de recursos externos, y que el verdadero reloj del sistema es Codex corriendo en serie (ley de Amdahl: no importa cuánto se paralelice el resto, el tiempo total lo fija el paso serial más lento). Tres defectos concretos de v1:

1. **El candado de escritura disparaba un agente LLM + `tsc` + 8 checks completos en cada micro-edición** (redacción, cada fix de auto-revisión, cada fix de auditor). Eso lo convertía en el cuello de botella real, no la cantidad de guías en paralelo.
2. **Orden Gemini-antes-que-Codex con una sola "versión" global por guía:** un fix de Codex (dato/link/tipo) invalidaba el GO de Gemini aunque el fix no tocara nada de SEO/copy, generando posible ping-pong entre los dos auditores.
3. **Sin plan de reversión** si una escritura rompía `guides.ts` a mitad de tanda: la guía siguiente se chocaba con el archivo roto.

La corrección que propuso Gemini para el punto 1 ("no uses un agente, hacé el reemplazo de texto determinístico") choca con una restricción real documentada en la investigación de v1: el script de `Workflow` es JavaScript plano **sin acceso al sistema de archivos** — solo un `agent()` puede tocar el repo, porque solo un agente tiene herramientas (Edit/Bash). No se puede eliminar el agente de la escritura. Lo que sí se puede eliminar es la razón por la que ese agente necesitaba correr pesado: si cada guía trabaja sobre su **propio archivo aislado** en vez del archivo compartido de 38k/114k líneas, la escritura intermedia deja de necesitar `tsc` ni los 8 checks (no hay nada compartido para romper), y el candado global desaparece por completo.

Esa es la idea de **Slice-and-Stitch** que propuso Gemini, adaptada a la restricción de filesystem: en vez de “candado sobre el archivo compartido durante todo el proceso”, se corta (slice) el objeto de cada guía a un archivo propio en el scratch de la tanda, se trabaja ahí sin ningún candado, y se cose (stitch) todo de vuelta al archivo real en un solo paso determinístico al final, con los checks pesados corriendo una sola vez.

Los puntos 2 y 3 de Gemini se adoptan directo (separación de dominios entre auditores; sin plan de reversión necesario porque ahora nada tocaba el archivo real hasta el final).

## 0.1 Qué cambió de v2 a v3 (revisión independiente de Codex)

Codex auditó v2 sin ver la opinión de Gemini (segunda opinión de verdad, no una validación en cadena) y encontró que Slice-and-Stitch resuelve los 3 problemas de v1 pero introduce 4 problemas nuevos, todos sobre integridad de datos en el momento de escribir de verdad al repo:

1. **Sin exclusión mutua entre tandas (TOCTOU).** El chequeo de hash (verificar que la zona no cambió antes de pisarla) tiene una ventana entre "verifico" y "escribo": dos tandas corriendo a la vez, o Juan editando a mano mientras una tanda está abierta, pueden las dos validar en base al mismo estado y una pisar a la otra. **Fix: un lease global** (archivo de lock con `batchId`, PID, commit base y timestamp, creado atómicamente antes del Stitch) que impide que dos tandas escriban a la vez, más la exigencia de un árbol de git limpio en `src/data/` antes de arrancar el Slice.
2. **`git checkout --` como reversión puede borrar trabajo ajeno.** Si Juan tocó a mano otra parte de `guides.ts` mientras la tanda corría y el build final falla, un `git checkout -- src/data/guides.ts` se lleva puesto también ese cambio manual, no solo lo que escribió la tanda. **Fix: snapshot + journal.** Antes de escribir, el Stitch guarda una copia exacta de los archivos que va a tocar. Si hay que revertir, solo restaura si el archivo en disco todavía coincide con el hash de lo que el propio Stitch escribió; si no coincide (alguien más lo tocó después), no sobrescribe: para y reporta el conflicto para que Juan lo resuelva a mano.
3. **Los rangos de línea se invalidan dentro del propio Stitch.** Al reemplazar el primer objeto de una guía, su cantidad de líneas cambia y el rango guardado para la siguiente guía ya no apunta al lugar correcto. **Fix: anclar por identidad, no por rango fijo.** El Stitch no usa el rango capturado en el Slice como ancla primaria: en el momento de escribir, vuelve a ubicar el objeto por su `slug` (o su id de producto) dentro del archivo, calcula el hash de lo que encuentra ahí y recién ahí lo compara contra el hash del Slice. El rango original queda solo como dato de diagnóstico, no como la fuente de verdad de dónde escribir.
4. **Fichas de producto compartidas entre dos guías de la misma tanda no tienen dueño.** Si dos guías de la tanda usan el mismo MLA y las dos quieren tocar su ficha, pueden generar dos versiones distintas sin que nada lo detecte a tiempo. **Fix: un solo dueño por ficha compartida, decidido en el Slice.** El mapa de `productosCompartidos` que ya armaba el Slice (sección 2) ahora además asigna, para cada MLA compartido dentro de la tanda, una sola guía "dueña" de esa ficha (la primera en el orden de prioridad de Juan). Las demás guías de la tanda solo pueden **leer** esa ficha, nunca editarla; si necesitan un cambio ahí, lo piden como `pedidoDeFicha` y lo aplica la guía dueña en su propio ciclo.

Además, Codex corrigió el criterio de separación de dominios (sección 4) y el cortacircuito de cupo (sección 5), ver esas secciones.

---

## 1. Lo que se investigó del repo (sin cambios respecto a v1 — no depende de la arquitectura elegida)

**Repo y datos**
- `src/data/guides.ts`: 38.809 líneas, un solo array `export const guides: Guide[] = [...]`. Tipo `Guide` en `src/lib/types.ts:305`. `internalLinks?: Array<{label, href}>`. `sitemapLastmod` existe para cambios menores (no toca `updatedDate`).
- `src/data/curated-products.ts`: 114.442 líneas, el segundo archivo compartido. Un superlativo corregido en una guía puede seguir vivo, textual, en la ficha del producto (LEARNINGS 2026-10-30): un refresh de guía casi siempre toca también fichas.
- `npm run guides:check` es una cadena de 8 scripts con `&&` que revisa los archivos **enteros**, no una guía sola. `check-hardcoded-reviews.cjs --bajar` y `check-uncovered-prose-prices.cjs --bajar` reescriben trinquetes globales (se niegan a subir el techo). `npm run prices:check` pisa un solo JSON (`scripts/price-update-results.json`).
- `voice.md` y `audience.md` **no existen en productosvirales** (sí en otros proyectos); la skill los nombra igual. Hoy la voz sale de CLAUDE.md + `docs/guias.md` + las guías que mejor rinden.
- `docs/seo-tracking-optimizaciones.md` no tiene orden fijo (mezcla entradas arriba y abajo).

**GSC, GA4, Keyword Planner, precios**
- `gsc.py` guarda en SQLite. `fetch` inserta un snapshot y pisa CSV; dos `fetch` en el mismo día rompen `alerts` (compara los últimos 2 snapshots). `audit`, `report`, `query-pages`, `history` son de solo lectura, seguros en paralelo.
- `get_service()` puede reescribir `token.json` al refrescar OAuth (riesgo bajo de carrera si dos procesos refrescan a la vez). `kwp.py` no guarda estado.
- Ubersuggest también tiene cupo limitado (ya se agotó una vez, CURRENT_STATE 2026-08-05).

**Dónde corren los agentes de Workflow** (probado con transcripts reales de 27 corridas anteriores)
- `cwd` = la carpeta del proyecto. Corren Bash local de verdad, con las credenciales de Juan (no un sandbox separado): `kwp.py` y `gsc.py` devolvieron datos reales, se usó `mcp__ubersuggest__serp_analysis`.
- **[NO VERIFICADO]** Ningún agente de Workflow, en ningún proyecto, corrió nunca `codex` ni `agy`. Esto sigue siendo la incógnita más importante de todo el diseño (ver sección 6).
- 10 CPUs → tope de agentes simultáneos de Workflow = min(16, 10−2) = **8**.

**Worktrees**
- La convención del repo (`docs/sesiones-paralelas.md`, `scripts/nueva-sesion.sh`) es que el contenido se trabaja en un worktree afuera del repo (`../pv-sesiones/<nombre>`), no en `.claude/worktrees/` (que pesan hasta 3,2 GB y Next/tsc los escanean).

**API de `Workflow`** (de la skill `workflow-authoring`)
- `export const meta`, `agent(prompt, {label, phase, schema, model, effort, isolation, agentType})` (devuelve `null` si el agente muere), `pipeline(items, ...stages)`, `parallel(thunks)` como barrera, `phase()`, `log()`, `args`.
- JavaScript plano: sin `Date.now()`/`Math.random()`/`new Date()` sin argumentos, **sin acceso al filesystem**. Máximo 1.000 agentes por run, 4.096 ítems por `pipeline`.

**El patrón de bug dominante**
- MISTAKES.md tiene ≥8 entradas del mismo tipo: superlativos que se rompen al cambiar el plantel, el precio o el `reviewCount`. La "tabla de verdad" (LEARNINGS 2026-08-16: pasarle al auditor una tabla con los datos de cada producto y la columna "campos que NO publica") ya encontró 32 errores que ningún script detectó. La auto-revisión de este diseño se apoya en esa práctica.

---

## 2. Arquitectura: Slice → Procesar → Stitch

```
LOOP PRINCIPAL (fuera del Workflow): worktree de contenido | git status | slugs priorizados | FECHA | SCRATCH
        |
======================================= WORKFLOW =======================================

[SLICE]  1 agente, una sola vez para toda la tanda
  - gsc history -> fetch SOLO si no hay snapshot de hoy | ga4 affiliates | prices:check --api-only
  - slug-map.json (todas las guías del sitio: slug, href, silo, pillar — para detectar enlaces y canibalización)
  - Por cada guía de la tanda: extrae su objeto Guide COMPLETO a scratch/<slug>/guia.json
    y las fichas de SUS productos a scratch/<slug>/fichas.json. Guarda también el rango de
    líneas original de cada uno (para detectar en el Stitch si alguien más editó esa zona
    mientras corría la tanda) y el hash sha256 de cada slice.
  - Mapa cruzado: hub de cada guía, enlaces salientes/entrantes, MLA compartidos entre guías
    de la tanda, hermanas fuera de la tanda que van a necesitar link recíproco.
  A partir de aquí, NINGÚN paso de Procesar toca guides.ts ni curated-products.ts.
  Cada guía vive y se edita solo en su propio scratch/<slug>/*.json.
        |
        +----------+----------+----------+----------+
        v          v          v          v          v
     guía 1      guía 2      guía 3    (espera)   (espera)     <- pipeline(): cada guía
                                                                   avanza sola, SIN barreras
   [PROCESAR, por guía, sin candado — cada una edita solo su propio JSON]
   Investigar [gate 3] -> Redactar [gate 2-3, escribe directo en su guia.json]
     -> Autorevisión (tabla de verdad + superlativos + enlaces, solo lectura+su JSON)
     -> Auditoría Gemini [gate 2] --NO_GO--> fix (edita su JSON) --> autorev --> Gemini de nuevo
     -> Auditoría Codex  [gate 1, FIFO con prioridad] --NO_GO--> fix --> autorev --> confirma
        * version por DOMINIO, no global: versionContenido (le importa a Gemini) y
          versionDatos (le importa a Codex). Un fix de Codex que no toca copy/SEO
          NO invalida el GO ya dado por Gemini, y viceversa.
        * QUOTA_EXHAUSTED -> cortacircuito de ESE auditor para toda la tanda; la guía
          queda PENDIENTE_CODEX / PENDIENTE_GEMINI con su JSON aprobado intacto en disco.
        |          |          |          |          |
        +----------+----------+----------+----------+
                        |  barrera real (la única del sistema, una sola vez al final):
                        |  todas las guías llegaron a un estado terminal
                        v
[STITCH]  1 agente, al final, una sola vez
  0. Adquiere el LEASE global (archivo de lock atómico con batchId/PID/commit base/
     timestamp en, por ej., .claude/tandas.lock). Si ya hay un lease vivo de otra tanda,
     NO escribe nada: reporta y espera. Exige git status limpio en src/data/*.ts antes
     de seguir (si Juan tiene algo sin commitear ajeno a la tanda, aborta y avisa).
  1. Guarda un SNAPSHOT exacto de guides.ts y curated-products.ts antes de tocar nada
     (para el rollback del paso 4).
  2. Por cada guía CERRADA_GO_GO (y PENDIENTE_* si Juan decide stitchear lo parcial):
     la ubica por IDENTIDAD (busca `slug: "<slug>"` en el archivo actual, no por el
     rango de línea capturado en el Slice), calcula el hash de ESE objeto recién
     encontrado y lo compara contra el hash guardado en el Slice. Si coincide,
     reemplaza. Si no coincide, aborta solo esa guía (alguien la tocó a mano mientras
     corría la tanda) y la deja en scratch para la próxima corrida. Igual criterio
     para las fichas de curated-products.ts, usando su dueño único (ver 0.1).
     Procesa las guías de cada archivo de atrás para adelante (por posición en el
     archivo) para que un reemplazo que cambia la cantidad de líneas no corra el
     ancla de las guías que todavía faltan escribir — aun así la identidad del punto
     anterior es la que manda, el orden es solo para evitar trabajo de más.
  3. Pedidos de enlace recíproco deduplicados por guía destino (una edición por destino,
     solo internalLinks + sitemapLastmod).
  4. Corre los 8 checks de guides:check UNA SOLA VEZ, npx tsc --noEmit, npm run build
     (reintento si falla por la falla intermitente conocida de fuentes de Google).
  5. Si algo de esto falla: compara el archivo actual contra lo que el propio Stitch
     escribió en el paso 2 (por hash). Si coincide (nadie más lo tocó desde que
     escribió el Stitch), restaura el SNAPSHOT del paso 1. Si no coincide (algo más
     lo modificó después de este Stitch), NO sobrescribe nada: para y reporta el
     conflicto para que Juan lo resuelva a mano. Nunca un `git checkout` ciego.
  6. Libera el LEASE. git status (archivos sin trackear) + git diff --stat.
[REGISTRO]  entrada por guía en docs/seo-tracking-optimizaciones.md (CERRADA_GO_GO normal;
            PENDIENTE_* con la línea de "auditoría pendiente, cupo agotado <fecha>")
[REPORTE]   resumen consolidado -> Juan revisa el diff -> Juan decide si se commitea
==========================================================================================
```

### Por qué esto resuelve los 3 defectos de v1
- **Sin candado global:** no hay nada compartido que proteger durante Procesar, porque cada guía edita solo su propio JSON en scratch. El único punto serial de verdad es Codex (ineludible, es el recurso escaso) y el Stitch final (una sola vez, no por guía).
- **Sin tsc/checks repetidos:** durante Procesar alcanza con validaciones livianas sobre el JSON propio (JSON.parse, regex de tokens, la tabla de verdad). Los 8 checks + tsc + build pesados corren **una sola vez**, en el Stitch, para toda la tanda junta.
- **Reversión segura, no ciega:** si el Stitch falla, restaura desde el snapshot que guardó antes de escribir — y solo si nadie más tocó el archivo después de él. Nunca pisa un cambio manual ajeno (ver 0.1, fix 2).
- **Resumible de verdad:** si Codex se queda sin cupo (como pasó hoy con `camara-de-seguridad-exterior`), el JSON de esa guía con el GO de Gemini ya está guardado en disco en `scratch/<slug>/`. Al otro día se retoma corriendo Codex directo sobre ese JSON, sin reconstruir nada en memoria ni repetir Gemini.

### Qué todavía NO resuelve (ver 0.1 para los fixes): sin el lease global y el anclaje por identidad, dos tandas simultáneas o una edición manual de Juan mientras la tanda corre pueden perderse un cambio sin que nadie lo note hasta mucho después. Esos dos fixes son obligatorios antes de implementar, no una mejora opcional.

---

## 3. Concurrencia por fase

| Fase | Límite | Por qué |
|---|---|---|
| Slice | 1 | Es el único paso que toca GSC fetch / GA4 / precios / lee los archivos compartidos para cortar los JSONs |
| Investigar | 3 | Ubersuggest y Google Ads tienen límites de cupo propios |
| Redactar | 3 | Ya no hay candado que proteger (cada guía escribe su propio JSON), pero seguir abriendo la concurrencia al máximo no suma nada: el cuello de botella real es Codex más adelante, así que no tiene sentido quemar tokens de redacción en guías que van a esperar en la cola igual |
| Autorevisión | sin límite propio (tope global 8) | Solo lectura + su propio JSON, no hay cupo externo que gastar |
| Gemini | 2 | Deja avanzar una guía mientras otra corrige, sin saturar llamadas |
| Codex | 1, FIFO con prioridad (rondas de cierre primero) + cortacircuito | El verdadero reloj del sistema. Paralelizarlo no reduce llamadas, solo adelanta el reloj — y si el cupo muere con N llamadas en vuelo, mueren las N a la vez sin ninguna cerrada |
| Stitch / Registro / Reporte | 1 | Única escritura real al repo, una sola vez, con el build final |

**Tamaño de la primera tanda real: 2 guías**, no 5 o 6 — es una arquitectura nueva sin probar en producción todavía (coincide con la recomendación de Gemini). Si funciona limpio, subir a 4-6 en la siguiente.

---

## 4. Separación de dominios entre auditores (fix al ping-pong)

Cada guía ya no tiene una sola `version`: tiene `versionContenido` y `versionDatos`. Cuando se aplica un fix (de auto-revisión, de Gemini o de Codex), el agente que redacta el fix declara qué dominio tocó:

- **`contenido`** (le importa a Gemini): copy, estructura H1-H3, intención de búsqueda, FAQ, snippet, imágenes/alt.
- **`datos`** (le importa a Codex): precios/reviews/specs, tokens `{{...}}`, enlazado interno, tipos/estructura del objeto, canibalización.

Un fix de Codex que solo tocó `datos` **no** sube `versionContenido` → el GO que ya dio Gemini sigue vigente, no hay que volver a auditarlo. Mismo criterio al revés. Solo si un fix toca los dos dominios a la vez (pasa, por ejemplo cuando se suma un producto nuevo al plantel y hay que tocar tanto la prosa como la tabla de specs) se invalidan los dos GO y se re-audita con ambos.

**Corrección de Codex:** la clasificación "contenido" vs. "datos" es más ambigua de lo que parece en la práctica — sumar o sacar un producto cambia datos Y copy a la vez; un link interno nuevo es estructura técnica Y SEO; una FAQ puede mencionar precio o stock (datos) dentro de una respuesta de intención de búsqueda (contenido). No conviene confiar en que el agente que redacta el fix "declare" bien el dominio por su cuenta. Regla dura: **ante la duda, invalidar los dos GO**, no solo el que el agente cree que corresponde — clasificar mal y subauditar es mucho peor que una ronda de más. Además, cada GO no guarda solo un número de versión: guarda también el hash del JSON completo que se auditó **y de sus dependencias** (las fichas de producto que usó, los `pedidosDeEnlace` vigentes, el snapshot de precios con el que se verificó). Si cualquiera de esos hashes cambió, el GO deja de ser válido aunque el contador de versión no se haya movido.

---

## 5. Cortacircuito de cupo (versión corregida)

Problemas que tenía v1 y cómo se corrigen (v2 + ajustes de Codex en v3):

1. **Falso positivo por texto en el contenido auditado.** v1 buscaba `"usage limit|quota|rate limit|429"` en todo el stdout/stderr, lo cual dispararía si una guía habla de códigos HTTP. Corrección: exigir **exit code no-cero** del proceso de `codex`/`agy` **y** separar los canales — stdout y stderr del propio CLI se capturan aparte del contenido auditado (nunca mezclados en el mismo archivo que después se escanea), así el texto del documento nunca puede disparar el cortacircuito por accidente. Preferir, cuando esté disponible, parsear la salida **estructurada** de `codex exec --output-schema` en vez de inferir el estado de logs en texto libre — el esquema de salida ya distingue el veredicto del resto.
2. **Rate limit transitorio vs. cupo agotado de verdad.** v3 usa una tabla de clasificación, no una sola regla: (a) límite explícito de cuenta con hora de reintento (como el de hoy: *"You've hit your usage limit... try again at..."*) → terminal, dispara el cortacircuito; (b) `429`/error de transporte → transitorio, reintento con backoff respetando el `retry-after` si lo da, hasta 2 veces, antes de declarar nada; (c) timeout, proceso matado, fallo de autenticación o schema inválido → `INFRA_ERROR` (reintenta una vez), **nunca** se clasifica como `QUOTA_EXHAUSTED` solo por no tener una respuesta.
3. **Estados por guía:** `CERRADA_GO_GO`, `PENDIENTE_CODEX`, `PENDIENTE_GEMINI`, `PENDIENTE_AMBOS`, `BLOQUEADA_RONDAS`, `BLOQUEADA_AUDITOR_ESCRIBIO`, `NO_TOCAR`, `ERROR`. (`BLOQUEADA_MECANICO` ya no aplica igual que en v1: un fallo de escritura ahora solo afecta el JSON propio de esa guía en scratch, nunca al repo real.)
4. **Retomar:** corrida nueva con `previo: {slug: {hashGuiaJson, versionContenido, geminiGo, versionDatos, codexGo}}`. Si el hash del JSON de la guía no cambió desde la corrida anterior, se reusan los GO ya obtenidos y solo se gasta el auditor que faltaba.

---

## 6. Supuestos sin verificar, en orden de qué probar primero

Orden ajustado por Codex en la revisión de v3 (antes de medir cupo o memoria, confirmar que el sistema no pueda perder o corromper un cambio):

1. **`cwd` real de los agentes, worktree de la sesión y árbol base limpio.** La convención del repo pone el contenido en `../pv-sesiones/<nombre>`, afuera del repo. Si los agentes de Workflow en realidad corren contra `/Users/juan/Proyectos web/productosvirales` (lo observado en corridas anteriores) en vez de ese worktree, van a tocar `master` con cambios sin commitear ajenos. Hay que confirmarlo ANTES de lo demás porque todo lo que sigue asume un árbol limpio al arrancar.
2. **[EL MÁS CRÍTICO, sin cambios desde v1] Que `codex` y `agy` corran de verdad dentro de un agente de `Workflow`.** Nunca se probó. Riesgo concreto: un subagente de Workflow no tiene terminal interactiva (TTY); si cualquiera de las dos CLIs detecta `stdout.isTTY === false` y aborta, o si `agy --mode plan` intenta pedir confirmación de alguna tool en background, el proceso muere o queda colgado para siempre. **Prueba aislada antes de construir nada más:** un Workflow de un solo agente que corra exactamente el binario y las credenciales de producción — `codex exec --cd "$PWD" --skip-git-repo-check --sandbox read-only --ephemeral --ask-for-approval never "respondé OK"` y `agy -p "respondé OK" --add-dir "$PWD" --model "Gemini 3.8 Flash (Medium)" --mode plan` — con un timeout deliberadamente observable y, si es posible, pidiendo salida con `--output-schema`/JSON. Si esto falla, ninguna versión del diseño sirve tal como está.
3. **Exclusión mutua entre dos corridas de Workflow y recuperación si el proceso muere a mitad del Stitch.** No alcanza con probar que el lease funcione en el caso feliz: hay que simular dos tandas sobre la misma guía/producto a la vez, una edición manual de Juan mientras una tanda está abierta, y matar el proceso justo durante el Stitch, para confirmar que el lease y el snapshot/journal (sección 2, 0.1) se comportan como se espera y no dejan el repo a medio escribir.
4. **Timeout de 10 minutos del Bash dentro del agente.** `codex exec` con razonamiento medio sobre un bundle real puede superar los 10 minutos; en macOS no hay `timeout` nativo. Sin confirmar que un agente de Workflow pueda lanzar con `nohup` y esperar a que aparezca el archivo de salida (patrón que sí usa la skill `trio-auditor` en sesiones normales, con `run_in_background`, pero no está confirmado que un subagente de Workflow reciba esa notificación).
5. **Serialización del objeto `Guide` a JSON y de vuelta a literal TypeScript.** Hay que confirmar que ningún campo del tipo `Guide` sea algo que JSON no pueda representar 1:1 (función, `Date`, etc. — por lo visto hasta ahora son todos strings/arrays/objetos planos, pero no se confirmó recorriendo el 100% del tipo). Si hay algún campo no serializable, el Slice tiene que excluirlo y el Stitch reconstruirlo aparte.
6. **Anclaje por identidad, orden de aplicación entre guías del mismo archivo y hashes** (ver sección 0.1, fix 3) — probar específicamente que reemplazar una guía no deje mal ubicada a la siguiente del mismo archivo.
7. **Conflictos de fichas compartidas y enlaces recíprocos** (ver sección 0.1, fix 4 y la política de dueño único) — probar con una tanda real donde dos guías compartan un MLA.
8. **`--output-schema` de Codex:** no se sabe qué dialecto de JSON Schema acepta.
9. **Memoria/tokens del script orquestador.** Aunque el script no puede escribir a disco, sí acumula en variables JS el estado de cada guía (research, draft, rondas, alertas) durante toda la corrida. Con 2-6 guías esto probablemente no es problema, pero no está medido.
10. **Herramientas MCP (Ubersuggest) conectadas desde un agente de Workflow en esta sesión en particular** — anduvo en corridas de agosto, no garantiza nada para hoy.
11. **`prices:check -- --api-only`** saltea las publicaciones que necesitan Puppeteer (~13 hoy); si una guía de la tanda usa una, su precio/stock no se verifica en Slice y la Investigación lo tiene que marcar pendiente para Juan.
12. **`voice.md`/`audience.md` no existen en este repo** aunque la skill los nombra — o se crean, o se corrige la skill.
13. **Cancelación o caída del Workflow a mitad del Stitch** (más allá de la prueba de choque del punto 3): qué journal/estado queda y cómo se detecta al retomar.
14. **Limpieza y retención de scratch y manifiestos de tanda** entre corridas — hoy no hay una regla de cuándo se borran los `scratch/<slug>/*.json` ya stitcheados.
15. **Efectos secundarios de los checks globales que reescriben archivos** (los trinquetes `--bajar` de `check-hardcoded-reviews.cjs`/`check-uncovered-prose-prices.cjs`, que SÍ corren dentro del Stitch): confirmar que corren una sola vez para toda la tanda y no una vez por guía.
16. **Aplicación parcial dentro del mismo Stitch:** si la guía A se escribe bien y la guía B entra en conflicto de hash un segundo después, ¿el Stitch sigue con el resto de la tanda o aborta todo? (Hoy el diseño asume que sigue con el resto y solo esa guía queda pendiente — falta confirmarlo explícitamente en la implementación.)
17. **No va a commitear.** Ningún prompt deja hacer `add`/`commit`/`stash`/`push`. Si el Stitch falla, se revierte desde el snapshot (nunca con `git checkout` ciego, ver sección 0.1) y se reporta qué guías quedaron sin stitchear (su JSON sigue en scratch, listo para la próxima corrida).

---

## 7. Recomendación concreta de cómo empezar

1. **Hoy/cuando haya cupo:** correr la prueba del punto 1 de la sección 6 (el spike de `codex`/`agy` dentro de un Workflow real). Es la única cosa que puede invalidar todo el diseño de entrada, y cuesta casi nada probarla.
2. Si el spike funciona: implementar Slice + Procesar + Stitch para una tanda de **2 guías** primero (ninguna tanda grande hasta confirmar que el ciclo completo cierra limpio una vez).
3. Recién después de una corrida limpia de 2, subir a 4-6 guías por tanda.

## 8. Piloto real corrido (2026-11-03) — resultado y lo que hay que corregir

Se corrió el spike (punto 1) y una versión simplificada del pipeline completo (sin Slice-to-JSON ni lease/snapshot — edición directa sobre el archivo real bajo un candado de escritura único, igual que v1, pero SIN correr `tsc`/los 8 checks en cada micro-edición, solo una vez al final) sobre una tanda real de 3 guías. Resultado:

- **El spike confirmó el supuesto #2 de la sección 6:** `codex exec` y `agy --mode plan` SÍ corren de verdad dentro de un agente de Workflow, en el cwd real del repo (no un worktree), con el árbol de trabajo tal como estaba (no exige limpieza por sí solo).
- **El cuello de botella real no fue la arquitectura, fue el contenido.** De 3 guías, 2 se auto-excluyeron casi al instante por una razón legítima que nadie había visto antes de lanzar la tanda: son grupos de un experimento A/B activo (`docs/qa-semanal/experimentos.md`), y tocarlas habría contaminado esa medición. Toda la tanda terminó dependiendo de UNA sola guía (`perfumes-arabes-por-color`), así que no hubo nada que paralelizar de verdad — el tiempo total fue básicamente el de optimizar esa guía sola. **Lección: antes de armar una tanda, confirmar cuántas de las guías candidatas van a necesitar trabajo real (no asumirlo de la lista de prioridad) — si la mayoría se auto-excluye, no hay beneficio de paralelismo que medir.**
- **Bug real encontrado en la separación de dominios (sección 4):** la condición para decidir si un fix invalida el GO del otro auditor quedó escrita al revés (resetear a Codex cuando el hallazgo de Gemini era "contenido", en vez de resetearlo solo cuando el hallazgo era "datos"/"ambos"). Como casi todo lo que encuentra Gemini es "contenido" por definición, esto convertía casi cualquier corrección en una vuelta extra innecesaria del otro auditor — el ping-pong que se quería evitar, reintroducido por un error de signo en la condición. **Antes de confiar en esta lógica, escribir 3-4 casos de prueba a mano (fix de dominio X → ¿se resetea el auditor Y?) y verificarlos uno por uno, no solo leer el código y asumir que la intención quedó bien traducida.**
- **`agy --mode plan` sin `--dangerously-skip-permissions` falló 4 de 6 veces** en modo headless con "a tool required the command permission that headless mode cannot prompt for, auto-denied" — sobre el mismo tipo de comando que en otras corridas de la misma sesión había funcionado sin el flag. No parece depender de un comando puntual sin aprobar; se resolvió pidiéndole el OK puntual a Juan y usando `--dangerously-skip-permissions` (con verificación de `shasum` después, que confirmó que no escribió nada). **Para producción: no vale la pena diseñar un mecanismo de reintento sin el flag — pedir la autorización de Juan una vez al iniciar la tanda (no por guía) y usarlo durante toda la corrida, verificando con hash después de cada llamada que ninguno de los dos auditores escribió nada.**
- **El scratchpad de la sesión se vació solo, al menos dos veces, a mitad de la tanda**, sin relación con nada que el script hiciera (los agentes de Workflow no tienen acceso a filesystem, así que no fue el propio script). Perdió prompts y salidas de auditoría ya generadas. **El diseño de Preparar/Slice no puede asumir que el scratch persiste indefinidamente durante una tanda larga — conviene que cada paso que dependa de un archivo de scratch anterior lo verifique (`ls`/lectura) antes de usarlo, no solo la primera vez.**
- **No se probó el mecanismo de lease/snapshot/anclaje por identidad de la sección 0.1** en este piloto (se usó candado de escritura simple, suficiente para una sola tanda manual) — sigue pendiente de probar antes de correr dos tandas a la vez.
