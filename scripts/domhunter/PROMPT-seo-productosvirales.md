# Prompt: diagnóstico y optimización SEO — productosvirales.com.ar

**v5** — revisado tras cuatro rondas de chequeo contra el código y los datos reales del proyecto. Los cambios respecto de v1 están
marcados con ⟳ para que se entienda qué premisa cayó y por qué.

> **Cómo usar:** pegalo completo como primer mensaje en una sesión de Claude Code abierta en
> la raíz del proyecto.

---

## Contexto

Sos un especialista en SEO técnico y de contenidos trabajando sobre `productosvirales.com.ar`,
sitio en español (audiencia argentina) de guías de compra de productos.

**Estado (Google Search Console, 25 jun – 25 jul 2026):**

- 1.849 clicks, 126.061 impresiones, CTR 1,47%, posición promedio 7,46
  (snapshot #30 en local: 27/6 – 24/7, cifras levemente distintas — usá el snapshot)
- Creciendo +142% mes a mes. **El sitio funciona. No hay que refundarlo.**
- 157 guías existen; ~140 tienen impresiones. 793 URLs con datos en total
- Dos clusters son el 43% de todo: **perfumes árabes** (30.477 impresiones) y
  **freidoras de aire** (23.776)
- 90% de los clicks son de Argentina

⟳ **Estas cifras pueden estar corridas unos días. Antes de confiar en ellas, corré
`scripts/gsc/gsc.py fetch` y recalculá.** No solo refresques los números: **recalculá la
priorización**, porque el orden de las tareas depende de ellos. Si el ranking de oportunidad
cambió, decímelo antes de seguir.

---

## Arquitectura conocida ⟳

Ya está relevada — no la redescubras:

- **No hay CMS ni MDX.** Todo el contenido vive en `src/data/guides.ts` (~22.600 líneas).
- **`seoTitle` y `metaDescription` son campos escritos a mano por guía**, no generados por
  plantilla. Verificado: los títulos de las 4 páginas de este diagnóstico son únicos y
  específicos, ninguno genérico ni duplicado.
- Existe `scripts/gsc/gsc.py` con acceso real a Search Console.

**Consecuencia práctica:** al editar `guides.ts`, hacé ediciones quirúrgicas sobre los campos
puntuales. No reescribas bloques grandes ni reformatees el archivo — un diff de 22.600 líneas
es imposible de revisar y de revertir.

**Lo único que falta relevar:** cómo se construyen los enlaces internos entre guías y hacia
fichas `/producto/`. Averigualo antes de la Fase 1.

---

## Trabajo previo — no lo repitas ⟳

Ya se auditaron **enlaces internos guía-a-guía en las 157 guías**, y se corrigieron 23 con
pocos o ningún enlace entrante. Validado con el trío auditor.

Partí de ahí. El esfuerzo nuevo va al **cruce guía ↔ producto**, que no se tocó.

---

## FASE 1 — Diagnóstico

Para cada hipótesis declará **CONFIRMADA / REFUTADA / NO VERIFICABLE** con evidencia concreta.
Una hipótesis refutada es un resultado válido y útil. Si se refuta, no busques otro cambio
para justificar el trabajo: reportá y seguí.

---

### H1 — `perfumes-arabes-por-color` pierde clicks por canibalización ⟳

**Dato:** 3.350 impresiones, **5 clicks**, CTR 0,15% en posición 8,2. Esperado: 1,36%. Está a
un décimo de lo normal — demasiado para explicarlo con AI Overviews.

⟳ **La hipótesis cambió.** v1 sospechaba de un title generado por plantilla; eso quedó
descartado (los títulos son manuales y únicos). Al caerse esa explicación, la causa más
probable pasa a ser **canibalización dentro del cluster de perfumes árabes**, que tiene al
menos 4 URLs compitiendo: `-mujer`, `-hombre`, `-dupes`, `-mas-vendidos-argentina`,
`-por-color`.

### ⚠️ Paso 0 de H1 — descartar el falso positivo de sitelinks (hacelo primero) ⟳

**Precedente real en este proyecto:** ya hubo un caso donde una canibalización "parecía real"
y resultó ser **sitelinks automáticos de Google** — la URL base sí tenía los clics, solo que
el reporte los agrupaba distinto. La lección quedó anotada: *siempre cruzar contra la URL base
antes de actuar*.

**Y el artefacto está activo hoy.** En el análisis de este mismo mes hay **12 URLs con ancla
(`#`) que suman 17.794 impresiones con 0% de CTR**, de las cuales 7.530 pertenecen a
`perfumes-arabes-mujer` y 8.190 a `mejores-freidoras-de-aire-argentina`. Google le está
armando índice de contenidos a las guías del cluster. No es una hipótesis: es medible.

**Antes de cualquier otra cosa, hacé la consulta al revés: query → página, no página → query.**

> **Principio general, no solo para esta hipótesis:** *página→query* sirve cuando ya sospechás
> de una página concreta y querés ver por qué rinde mal. *query→página* es la única dirección
> que permite **descubrir** robo de keyword cuando no sabés de antemano cuál de las URLs se
> está quedando con la búsqueda. Con 4 páginas de perfumes árabes compitiendo y ningún
> sospechoso obvio, este es exactamente el caso que exige el pivot. Aplicalo en cualquier
> diagnóstico futuro de canibalización.

**Cómo hacerlo con las herramientas que ya existen** ⟳ — `gsc.py fetch` ya trae y guarda el par
`(page, query)` completo (dimensión `page_query`, ver `cmd_fetch` ~línea 200). **No hace falta
pegarle a la API de nuevo.** Lo que falta es leerlo al revés: `audit` / `report` / `oportunidades`
filtran por `key1` (página); para este pivot hay que filtrar por `key2` (query) y agrupar por página.

Dos caminos:

- **Ahora, sin tocar código:** cada `fetch` exporta `page_query.csv` en `docs/../exports/<fecha>/`
  (ver `_export_csv` en el loop de `cmd_fetch`). Abrilo y filtrá por
  `query = "perfumes árabes por color"`.
- **Si se va a usar seguido:** un `cmd_query_pages` que haga ese filtro sobre el snapshot ya
  guardado en SQLite, sin pegarle a la API.

⚠️ **Spec obligatoria para `cmd_query_pages`:** debe **colapsar los fragmentos `#` a su URL base
por defecto**, con un flag para ver el desglose. Si no lo hace, el comando reproduce exactamente
el falso positivo de sitelinks que este Paso 0 existe para evitar.

Listá **qué URLs reciben impresiones para esa query**, con los fragmentos ya sumados a su base.

- Si la query la gana la pilar o `perfumes-arabes-mas-vendidos-argentina`, y `-por-color`
  aparece como resultado secundario o sitelink → **no hay canibalización, hay agrupación de
  reporte.** Declará H1 REFUTADA y no toques nada.
- Si dos URLs distintas alternan como resultado principal para la misma query → canibalización
  real, seguí con el resto de la verificación.
- **Si no aparece ninguna otra URL compitiendo → NO cierres acá.** Leé el bloque de cobertura
  que sigue antes de sacar conclusiones.

**Este paso es barato y bloquea todo el resto de H1. No lo saltees.**

### ⚠️ Límite de cobertura — vale para TODO análisis por query de este proyecto ⟳

**GSC no reporta cada query individual.** Tiene un umbral de privacidad y omite las más raras.
Sumar `page_query` para una URL casi nunca da el total del dato de página. Medido en el
snapshot #30 (27/6 – 24/7):

| URL | impresiones reales (dim `page`) | visibles por query | cobertura |
|---|---|---|---|
| `perfumes-arabes-por-color` | 3.111 | 732 | **24%** |
| `mejores-perfumes-arabes-hombre` | 7.927 | 3.962 | 50% |
| `perfumes-arabes-mujer` | 7.448 | 2.505 | 34% |
| `perfumes-arabes-mas-vendidos-argentina` | 3.364 | 1.388 | 41% |

**Consecuencia dura: "ninguna otra URL compite" con 24% de cobertura NO refuta la
canibalización.** Solo dice que no la ves en el cuarto de los datos que GSC te muestra.
`cmd_query_pages` ya imprime el % de cobertura y degrada el veredicto a NO VERIFICABLE cuando
está flojo — respetá esa degradación, no la interpretes como negativo.

**Aplicá este límite a toda conclusión por query, no solo a H1.** Y ojo con el efecto
compuesto: `gsc.py audit -v` (sección [3], canibalización site-wide) tiene piso
`MIN_IMPRESSIONS=30`; sumado al umbral de privacidad, una query repartida entre dos URLs a 15
impresiones cada una es **doblemente invisible**. Por eso existe `cmd_query_pages`: consulta
dirigida, sin piso.

**Con cobertura baja, el único chequeo que cierra el diagnóstico es el manual:** buscar la
query en incógnito desde Argentina y ver qué URL muestra Google. No es opcional acá.

### Cuarta explicación posible: cola larga difusa ⟳

Antes de asumir que algo está roto, considerá esto — la cobertura del 24% lo sugiere y las
variantes de "por color" lo confirman (todas entre 1 y 28 impresiones):

**Puede que `-por-color` no esté ni canibalizada ni rota, sino recogiendo impresiones
marginales en miles de queries donde apenas es relevante.** Si aparecés en posición 8 para
búsquedas que no son tuyas, un CTR de 0,15% es la consecuencia esperable, no un síntoma.

**Cómo distinguirlo:** mirá la distribución de las queries visibles. Pocas queries con muchas
impresiones cada una = la página tiene intención definida y algo falla. Muchísimas queries con
1-5 impresiones cada una = cola difusa, la página no tiene una búsqueda propia que ganar.

**Medido en el snapshot #30:** 116 de 145 queries visibles tienen 1-5 impresiones. La cola
difusa es real para el ~80% de la demanda de esta página.

### ⚠️ Pero antes de cerrar en inacción: mirá el top-N ⟳

**Cola difusa no equivale a "nada que hacer".** Dentro de una cola difusa puede haber un
bolsillo concentrado de demanda que la cola tapa. Ya apareció uno en esta misma página:

> `perfume arabe blanco y dorado` (135 impresiones) + `perfume arabe blanco con dorado` (51)
> = **186 impresiones en posición ~10**. Es la misma búsqueda con dos frasings. La guía
> organiza por color único (blanco, dorado, azul…) y menciona "detalles dorados" solo de paso
> dentro de la sección "blanco" — **no tiene sección propia para la combinación bicolor**.

**Procedimiento:** ordená las queries visibles por impresiones y mirá el top 10. Buscá
**variantes de la misma búsqueda** — frasings distintos que expresan una intención única.
Sumalas: si dos o tres variantes de un mismo concepto acumulan un volumen comparable al de las
queries que sí tenés cubiertas, hay un bolsillo real.

⚠️ **Medí la concentración contra las impresiones REALES, no contra las visibles.** El umbral
de privacidad omite preferentemente las queries raras, así que el set visible está **sesgado
hacia la cabeza**. En el ejemplo: 186 sobre 732 visibles es 25%, pero sobre 3.111 reales es
**6%**. Si usás el porcentaje sobre visibles como criterio, toda página con cobertura baja va a
parecer concentrada y vas a generar falsos positivos justo donde menos datos tenés.
El número que importa es el **absoluto** —186 impresiones en posición 10 es accionable por sí
mismo— no la proporción.

### Tercera acción posible: sección chica y quirúrgica ⟳

Si aparece un bolsillo, la acción no es ni "no tocar" ni "consolidar". Es **agregar una sección
propia y acotada** dentro de la guía existente, que cubra esa combinación con su frasing real.

Bajo costo, alta precisión, y deja intacto el resto de la cola que sí conviene ignorar. Nombrá
esta acción explícitamente en el reporte: es la más barata de las tres y la más fácil de pasar
por alto cuando el marco mental es "arreglar / fusionar / abandonar".

### Cierre de la rama

- **Hay bolsillo concentrado** → sección quirúrgica. H1 REFUTADA como canibalización, pero
  **con acción** de contenido acotada.
- **Solo cola difusa, sin bolsillo** → H1 **REFUTADA sin acción**. Sacá la página de la lista de
  prioridades y no le busques otra cosa que optimizar. Esta salida existe justamente porque su
  acción correcta es no hacer nada, y sin nombrarla un agente sigue buscando qué reparar.

---

**Si el Paso 0 confirma canibalización real, verificá en este orden:**

1. **Alcance.** ¿Cuántas queries del cluster tienen más de una URL compitiendo? Una query
   suelta no justifica consolidar; un patrón en 10 queries sí.
2. **Solapamiento de contenido.** ¿Qué cubre `-por-color` que no cubran las otras cuatro?
   Si la respuesta es "nada sustancial", el problema es de arquitectura de contenido.
3. **Alineación con la intención.** Leé el contenido real. "Perfumes árabes por color"
   sugiere una clasificación cromática. ¿La página entrega eso, o es otro listado genérico
   con un título distinto?
4. Solo si nada de lo anterior explica: longitud del title renderizado (>60 caracteres se
   trunca), canonical, `robots`.

**Si se confirma canibalización:** proponé consolidación —fusionar `-por-color` en la guía
más fuerte del cluster con redirect 301, o diferenciarla de verdad. **Traeme las dos opciones
con su costo y riesgo. No ejecutes ninguna.** Un 301 mal hecho sobre una página con 3.350
impresiones es más caro que dejarla como está.

**Si se refuta todo:** reportá que la página es un caso anómalo sin causa identificable
y no la toques.

---

### H2 — `mejores-perfumes-arabes-hombre` es más débil que sus hermanas

**Dato:** 8.389 impresiones (casi las mismas que la versión de mujer) pero posición **8,8**,
contra 7,9 de `perfumes-arabes-mujer` y 6,1 de `perfumes-arabes-mas-vendidos-argentina`.

**Compará las tres lado a lado:**

| Dimensión | Qué medir |
|---|---|
| Extensión | palabras de contenido real |
| Estructura | cantidad y jerarquía de H2/H3 |
| Profundidad | productos cubiertos, tabla comparativa sí/no |
| Enlaces internos entrantes | incluyendo los que llegan desde fichas `/producto/` |
| Datos estructurados | ItemList / Product / FAQPage |
| Frescura | última actualización |

**Confirmación:** queda por debajo en 3 o más dimensiones.

**Si se confirma:** nivelala hacia arriba. Prioridad a enlaces internos entrantes, que es lo
más barato. No reescribas la guía de cero.

**Si se refuta** (es igual o mejor y aun así rankea peor): el problema es competencia externa.
Reportalo y no toques nada.

**Nota:** esta hipótesis se solapa con H1. Si el cluster tiene canibalización, puede ser la
causa común de ambas. Resolvé H1 primero y reevaluá H2 después.

⟳ **Cobertura:** `mejores-perfumes-arabes-hombre` tiene 50% de cobertura por query y
`perfumes-arabes-mujer` 34%. Cualquier comparación entre hermanas **a nivel query** arrastra
ese sesgo, y no es parejo entre las dos. Las dimensiones de la tabla de arriba (extensión,
estructura, enlaces, schema) se miden sobre el código y **no** tienen este problema — priorizá
esas. Usá las queries solo como contexto.

---

### H3 — `estufa-electrica-bajo-consumo` pierde el clic contra el AI Overview ⟳

**Dato:** 4.296 impresiones, 22 clicks, CTR 0,51% (esperado 1,26%) en posición 8,7.
La query "que estufa electrica gasta menos" da 254 impresiones y **1 click** en posición 8,3.

⟳ **La hipótesis cambió, y el chequeo la volvió más fuerte, no más débil.** El `seoTitle` ya
es literalmente `"¿Qué estufa eléctrica gasta menos?"` — coincidencia exacta con la query.
Que con el título perfecto el CTR siga en 0,51% **descarta la metadata como causa** y deja la
explicación estructural: las queries en formato pregunta disparan AI Overviews el 85,9% de
las veces. Google responde arriba tuyo y el usuario no baja.

**No toques title ni description. Ya están bien.** El trabajo es de cuerpo — pero solo si el
Paso 0 lo justifica.

### ⚠️ Paso 0 de H3 — ¿ya estás citado en el AIO? (hacelo primero) ⟳

Confirmar que *existe* un AIO para la query no alcanza como punto final. La pregunta que
decide todo es otra: **¿productosvirales ya es una de las fuentes citadas dentro de ese AIO?**

**Verificable barato:** buscá a mano `"que estufa electrica gasta menos"` en Google. Hacelo
**desde Argentina, en ventana de incógnito y sin sesión**, porque la personalización y el geo
cambian el AIO. Repetilo 2-3 veces en días distintos: la presencia de AIO fluctúa.

Anotá: ¿aparece AIO? ¿productosvirales figura entre las fuentes citadas? Guardá captura.

**Las dos ramas llevan a lugares opuestos:**

- **NO está citado** → el diagnóstico de citabilidad es correcto. Seguí con la verificación
  de abajo; la tabla temprana es la palanca.
- **SÍ está citado y el CTR sigue en 0,51%** → **la citabilidad no es el problema, ya la tenés.**
  El usuario lee la respuesta en el AIO y no necesita entrar. Optimizar citabilidad acá sería
  mejorar algo que ya funciona mientras el problema real queda intacto.
  En ese caso: **declará H3 REFUTADA, no toques la página, y reportá.** Es posible que esta
  query simplemente no sea recuperable con AIO de por medio, y la respuesta correcta sea
  desinvertir y mover el esfuerzo a queries transaccionales, que disparan AIO solo el 5% de
  las veces. Abandonar una query es un resultado válido.

**No sigas a la verificación de abajo sin haber hecho este chequeo.**

---

**Solo si NO estás citado, verificá:**

1. ¿La respuesta a "cuál gasta menos" aparece en los primeros 150 palabras, o está enterrada?
2. ¿Hay **tabla con consumo en watts y costo por hora en pesos**? Ese dato concreto es lo que
   un AIO puede citar. Prosa vaga no es citable.
3. ¿Los encabezados están formulados como las preguntas que la gente hace?
4. ¿Cubre las preguntas de seguimiento (cuánto consume por mes, cuál conviene por ambiente)?
5. ¿Hay `FAQPage` schema con esas preguntas?

**Si se confirma** (la respuesta no está temprano o no hay datos duros): agregá un bloque de
respuesta directa arriba, con tabla de consumo real. El objetivo **no es "responder rápido"
sino ser citable**: dato concreto, atribuible, en formato extraíble. Las marcas citadas en un
AIO reciben 120% más clicks que las no citadas en la misma SERP.

> **Patrón general, documentado en la skill de guías de este sitio:** cuando la posición se
> mantiene pero el CTR cae, la causa más probable es un AIO quedándose con el clic. La jugada
> es hacer el bloque más citable —respuesta directa temprana, formato tabla, cobertura de
> preguntas de seguimiento— no reescribir de cero. Pero verificá primero si ya estás citado:
> si lo estás, el patrón no aplica.

**Marca temporal:** si hoy es posterior al **15 de septiembre de 2026**, degradá a prioridad
baja — la ventana estacional argentina cerró y el esfuerzo rinde más en otro lado.

---

### H4 — El enlazado guía ↔ producto está sin explotar ⟳

⟳ **Alcance reducido.** La auditoría guía-a-guía ya se hizo (157 guías, 23 corregidas).
**No la repitas.**

**Lo que falta:** las ~793 URLs indexadas incluyen fichas `/producto/` que no entraron en esa
auditoría. Ahí está el trabajo nuevo.

### ⚠️ Filtro obligatorio antes de priorizar ⟳

**Colapsá los fragmentos `#` a su URL base antes de armar cualquier lista de "páginas con
tráfico casi nulo".** Las 12 URLs con ancla (17.794 impresiones, 0% de CTR) van a aparecer como
páginas de alto volumen y cero clicks, es decir como el peor caso de la lista — y no son páginas:
son índices de contenido que Google arma solo, y sus clicks se acreditan a la URL madre.

Sin este filtro vas a gastar el esfuerzo de H4 en fragmentos que no tienen ningún problema real,
mientras las fichas `/producto/` que sí lo tienen quedan abajo en la priorización.

Aplicá el mismo colapso a cualquier ranking por impresiones o CTR que generes en este trabajo.

**Verificá:**

- Construí el grafo de enlaces solo para el eje **guía ↔ producto**.
- ¿Las fichas de producto enlazan a las guías donde ese producto aparece? Es el enlace más
  natural y probablemente el más ausente.
- ¿Hay fichas huérfanas, o que sean callejones sin salida?
- ¿Cuántas fichas apuntan a los dos clusters principales?

**Confirmación:** las fichas no enlazan sistemáticamente a las guías que las mencionan.

**Si se confirma:** proponé el plan. **Mostrame la lista antes de tocar archivos.**

**Reglas duras:** máximo 3-4 enlaces internos nuevos por página, solo donde tengan sentido
editorial, con anchor text descriptivo y variado. Un bloque de 20 links al pie es señal de
spam, no optimización.

---

## FASE 2 — Aplicación

Aplicá **solo** lo CONFIRMADO, en este orden:

0. **Los dos "Paso 0"** (¿citado en el AIO? / ¿sitelinks o canibalización real?). Son
   chequeos manuales de minutos que pueden refutar H3 y H1 enteras. **Hacelos antes que nada
   y reportá el resultado.** Si ambos refutan, el trabajo se reduce a H2 y H4.
1. **H3** — tiene fecha de vencimiento estacional
2. **H1** — pero solo el diagnóstico; la consolidación viene con opciones, no ejecutada
3. **H2** — reevaluada después de H1, empezando por enlaces internos
4. **H4** — solo con plan aprobado

### Gate de calidad ⟳

Antes de mi aprobación, **cada cambio pasa por el trío auditor (Codex + Gemini), estándar del
proyecto.** No reemplaza mi aprobación: la antecede.

Una salvedad sobre el umbral: exigir 10/10 unánime en una reescritura de metadata puede
trabar por desacuerdo estilístico más que por sustancia. Sugiero que para cambios de
title/description el criterio sea **"cero riesgo de regresión"** en vez de "perfecto", y que
el 10/10 quede para cambios de contenido, schema y enlazado, donde el riesgo es real.
**Decidilo vos y avisame** — si preferís 10/10 para todo, se aplica para todo.

**Además:** mostrame el diff propuesto y esperá aprobación. No hagas commit. No pushees.
No toques `next.config`, dependencias ni build.

---

## FASE 3 — Verificación

- El sitio compila y las páginas modificadas renderizan.
- Los metadatos nuevos aparecen en el HTML servido, no solo en el fuente.
- El diff sobre `guides.ts` toca solo los campos previstos. Si supera ~50 líneas por guía,
  algo salió mal.
- Ninguna URL cambió. **Si una URL tiene que cambiar, pará y avisá** — perder una página con
  8.000 impresiones por un slug modificado cuesta más que todo lo que se pueda ganar acá.
- Datos estructurados siguen validando.
- Los enlaces internos agregados no dan 404.

---

## Qué NO hacer

- **No refundar el sitio.** Crece 142% mensual: lo que está hecho funciona.
- **No tocar `mejores-freidoras-de-aire-argentina` ni `perfumes-arabes-mujer`.** Son las que
  mejor performan; el riesgo de romperlas supera cualquier ganancia de esta lista.
- **No cambiar URLs ni rutas.**
- **No ejecutar redirects 301** sin aprobación explícita.
- **No reescribir title/description de `estufa-electrica-bajo-consumo`.** Ya están correctos.
- **No repetir la auditoría de enlaces guía-a-guía.** Ya está hecha.
- **No reformatear `guides.ts`.**
- **No generar contenido en masa** para "cubrir más keywords".
- **No comprar ni sugerir comprar backlinks.**
- **No asumir canibalización sin cruzar contra la URL base.** Hay precedente de falso
  positivo en este sitio por sitelinks automáticos.
- **No optimizar citabilidad en una página que ya está citada en el AIO.** Es mejorar lo que
  funciona mientras el problema real queda intacto.
- **No priorizar ninguna lista por impresiones o CTR sin colapsar antes los fragmentos `#`
  a su URL base.** Son 17.794 impresiones fantasma que distorsionan cualquier ranking.
- **No declarar "ninguna otra URL compite" a partir de datos por query sin reportar la
  cobertura.** Con 24-50% de visibilidad, la ausencia de evidencia no es evidencia de ausencia.
- **No optimizar una página cuya cola de queries es difusa** — pero revisá el top-10 antes de
  descartarla: puede haber un bolsillo concentrado escondido en la cola.
- **No medir concentración de demanda como % de impresiones visibles.** El set visible está
  sesgado hacia la cabeza; usá volúmenes absolutos o el % sobre impresiones reales.

---

## Reporte final

```
DATOS
  (¿cambió la priorización tras correr gsc.py fetch? sí/no + qué cambió)

ENLAZADO
  (cómo se construyen los enlaces internos — lo único que faltaba relevar)

DIAGNÓSTICO
  H1  CONFIRMADA / REFUTADA / NO VERIFICABLE — evidencia en 2-3 líneas
  H2  ...
  H3  ...
  H4  ...
  (para cada hipótesis apoyada en datos por query: indicá el % de cobertura)

APLICADO
  (archivo · qué cambió · por qué · veredicto del trío auditor)

PROPUESTO SIN EJECUTAR
  (consolidación del cluster de perfumes, plan de enlazado guía↔producto)

BOLSILLOS DE DEMANDA
  (variantes de una misma búsqueda encontradas en el top-10 de páginas con cola difusa:
   query, impresiones absolutas, posición, y si la guía ya la cubre)

NO APLICADO
  (hipótesis refutadas y qué se encontró realmente)

HALLAZGOS NUEVOS
  (ordenados por impacto)

RIESGOS
  (lo que requiere mi decisión)
```

---

## Cómo medir si funcionó

Con `gsc.py`, filtrando por cada URL tocada:

- **CTR** — se mueve en 1-2 semanas si el cambio fue de metadata
- **Posición** — 3-6 semanas si fue contenido o enlaces internos
- **Impresiones** — confirma que Google reevaluó la página

Compará cada URL contra **su propio período previo, no contra el promedio del sitio**: el
sitio entero crece 142% mensual, así que el promedio hace parecer exitoso cualquier cosa.
Si a las 6 semanas una página tocada no se movió mientras el resto sí, revertí ese cambio.
