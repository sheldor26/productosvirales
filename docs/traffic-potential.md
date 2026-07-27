# Tráfico potencial — documento vivo

**Reporte publicado (Artifact, siempre la misma URL):**
https://claude.ai/code/artifact/a25daea6-9777-4f07-b039-aa8e2a2d6eac

Este archivo es la fuente de datos canónica. El Artifact de arriba es la
versión visual que se le entrega a Juan; se regenera desde esta tabla, nunca
al revés. Mismo patrón que el equivalente en essentialpetgear
(`../essentialpetgear/docs/traffic-potential.md`), adaptado a que
productosvirales ya tiene tráfico real (a diferencia de un sitio nuevo).

## Regla (pedida por Juan 2026-07-26, seguir siempre)

Cada vez que se termina de publicar una guía nueva o un silo completo:

1. **Sacar su keyword principal, volumen (Keyword Planner AR) y estado real
   en GSC** (posición ponderada de la URL en el snapshot más reciente, o
   "Sin datos aún" si es muy nueva) con el mismo método de la sección de
   abajo.
2. **Agregarla a la tabla** con el mismo formato que las filas existentes.
3. **Volver a sumar los totales** (arriba y por estado).
4. **Republicar el Artifact** (mismo `file_path`, mismo `url` de arriba para
   no generar un link nuevo) con la tabla y los totales actualizados.

No hace falta re-auditar filas viejas cada vez, salvo las que ya tengan
datos reales de GSC nuevos que valga la pena refrescar (ver próximo punto).

## Hoy real: refrescar en cada actualización, no solo al agregar filas

A diferencia de volumen (que no cambia) y de la keyword (que no cambia), la
columna **Hoy (clicks reales)** y el **estado real (GSC)** de las filas YA
existentes hay que refrescarlos contra el snapshot más reciente de
`gsc.py` cada vez que se toca este archivo, no solo agregar la fila nueva.
Es el dato que permite comparar la proyección contra la realidad con el
tiempo (ver "Baseline congelado" abajo). Si refrescar las 157 filas es
mucho para una actualización chica, priorizar al menos las guías más viejas
(más probabilidad de que su posición real haya cambiado) y las de mayor
volumen.

## Baseline congelado — NO pisar, solo agregar una fila nueva al lado

Las columnas **Realista 6-12m** y **Techo optimista** de la corrida
**2026-07-26** son la proyección original: quedan congeladas tal cual están
abajo, no se recalculan ni se ajustan con el tiempo. La idea es poder
contestar en 6-12 meses (≈ enero-julio 2027) "¿la proyección le pegó o no
le pegó" comparando el **Hoy real** de ese momento contra el **Realista**
de esta corrida — no contra un número que se fue corrigiendo en el camino.

Si en una actualización futura cambia sustancialmente el método de cálculo
(por ejemplo, si vuelve a haber cupo de Ubersuggest y se suma dificultad
SEO real), no reemplazar esta columna: agregar una columna nueva
("Realista v2, corrida AAAA-MM-DD") al lado, dejando la v1 intacta como
referencia histórica.

## Corrección del mismo día (2026-07-26): el bruto sobreestima, separado por competencia

Pregunta de Juan tras ver el total: "¿siendo dominio uno [DA1], podemos
llegar a esos números?". Respuesta corta: al número bruto, no; a la mitad
de abajo, sí.

**El problema del bruto:** "realista" y "techo" se calculan proyectando la
posición REAL PROMEDIO de cada guía (ponderada por todas sus queries). Ese
promedio lo levanta cola larga fácil (preguntas específicas, comparativas
de marca, reviews puntuales) que no tiene nada que ver con la dificultad de
ganarle a Mercado Libre, Amazon o Falabella en el término corto y genérico
que se usó para sacar el volumen. Una guía puede tener posición promedio
6-7 en su mezcla de 50 queries y seguir estando lejísimos del top de
Google para las 2-3 palabras exactas de su keyword principal.

**La corrección:** clasificar las 157 filas en dos grupos según con quién
compite de verdad la keyword principal:

- **Genérico / alta competencia**: término de categoría desnudo, sin marca
  ni calificador (`freidora de aire`, `microondas`, `pava electrica`,
  `camara de seguridad`...). Compite directo contra sitios de autoridad muy
  alta. **Aspiracional — necesita backlinks reales, el ritmo de contenido
  actual no lo destraba.**
- **Cola / marca**: tiene marca (Atma, Peabody, JBL, Lattafa...),
  comparación ("vs"), o un calificador (precio, review, opiniones, cómo
  usar, por color, cuánto consume, etc.). Compite contra contenido fino,
  no contra DA alta. **Es el número creíble hoy** — básicamente una
  extensión de lo que ya está pasando (139/151 guías ya rankean top 10 en
  su mezcla real de queries).

| Grupo | Guías (publicadas) | Volumen | Hoy (real) | Realista | Techo |
|---|---:|---:|---:|---:|---:|
| Genérico / alta competencia | 67 | 1.326.250 /mes | 753 | 53.758 | 136.099 |
| Cola / marca (creíble en DA1) | 93 | 341.320 /mes | 766 | **10.296** | **29.387** |

**El número para planificar es el de "cola/marca": ≈10.296/mes realista,
≈29.387/mes techo (actualizado 2026-07-26 con el alta de las 9 guías nuevas del loop del día: `termo-stanley`, `auriculares-sony`, `microondas-samsung`, `camara-ezviz`, `auriculares-xiaomi`, `proyector-astronauta`, `yogurtera-daewoo`, `camara-tplink-tapo` y `microondas-lg`).** El bloque genérico queda como techo aspiracional,
condicionado a que en algún momento haya link building real — no es algo
que vaya a moverse solo con más guías o mejor enlazado interno.

La columna "Categoría" (`generico` / `cola_marca`) se agregó a la tabla de
abajo. Reglas de clasificación: `generico` si la keyword no tiene marca, no
tiene "vs", y no tiene calificador (precio/review/opiniones/como usar/por
color/cuánto consume/etc.); `cola_marca` en cualquier otro caso. Al agregar
guías nuevas, clasificarlas con el mismo criterio y sumarlas al grupo que
corresponda.

## Edad de dominio / "sandbox" (agregado 2026-07-26, pregunta de Juan)

El sitio nació ~10 de abril de 2026. Hoy (26 de julio) tiene ~3,5 meses. Es
una variable DISTINTA de "DA1 sin backlinks" que hasta ahora no se había
nombrado por separado, aunque ya está implícita en los datos:

- **Las columnas "Realista"/"Techo" ya están descontadas por esto**, porque
  parten de la posición REAL de hoy en GSC (que ya refleja cualquier freno
  de dominio nuevo que exista) — no es una proyección ciega.
- **Para el bloque "genérico"**, la edad de dominio empeora el diagnóstico
  ya pesimista: aunque hubiera backlinks reales mañana, un dominio de 3-4
  meses no le compite a Mercado Libre en un término genérico — hace falta
  autoridad Y tiempo acumulado. Sigue siendo aspiracional, ahora con un
  motivo adicional.
- **Para el bloque "cola/marca" (el número creíble)**, hay un viento de cola
  que el cálculo actual NO suma: la proyección a 6-12 meses solo asume
  mejora por más contenido/enlazado interno, no contempla que el dominio
  puede "madurar" solo con el paso del tiempo (patrón anecdótico de la
  industria SEO, sin confirmación oficial de Google, típicamente entre los
  6 y 12 meses de vida). Si eso pasa, el **techo real probablemente sea más
  alto que el ≈29.387/mes actual**, sin que haga falta tocar nada.

**Hitos para vigilar:** 10 de octubre de 2026 (6 meses) y 10 de abril de
2027 (1 año). Checkpoint sugerido: en octubre, revisar si alguna guía subió
de posición **sin haber recibido ninguna edición de contenido** en el medio
— eso sería evidencia de maduración de dominio, distinta de una mejora por
trabajo editorial.

## Diferencia clave con el reporte de essentialpetgear

Essentialpetgear es un sitio nuevo sin backlinks: su "hoy" es 0 por
definición, y el tier de dificultad (fácil/medio/difícil) sale de la
`seo_difficulty` de Ubersuggest.

Productosvirales ya tiene Search Console con historial real. Por eso:

1. **"Hoy" no es una suposición, son los clicks reales del snapshot GSC más
   reciente** (`scripts/gsc/gsc.py`, tabla `metrics` dim `page`, URLs
   colapsadas sin fragments `#`).
2. **El "estado" de cada guía es su posición promedio real en GSC**, no un
   tier de dificultad genérico. Bucket real medido, no una dificultad
   estimada a futuro:
   - **Pos ≤10** (ya está bien posicionada)
   - **Pos 11-30** (visible pero floja)
   - **Sin datos aún** (muy nueva, o STAGED sin publicar)
3. **"Realista" y "techo" se calculan desde la posición REAL de cada guía**,
   no desde un piso fijo por tier: `realista_pos = max(3, pos_real × 0.75)`,
   `techo_pos = max(1.5, pos_real × 0.4)`. Un piso conservador (nunca por
   debajo de lo que ya está pasando hoy).
4. **El volumen sale de Google Keyword Planner (Google Ads API,
   `generate_keyword_historical_metrics`, AR/es), no de Ubersuggest.**
   Ubersuggest llegó a su límite diario de reportes (100/día) el mismo día
   en que se armó este reporte (2026-07-26), así que no hubo cruce de
   control por keyword esta vez ni dificultad SEO real (Ubersuggest es la
   única fuente que la da; el `competition_index` de Keyword Planner es
   competencia de anuncios pagos, no dificultad orgánica, y salió saturado
   en HIGH/100 para casi todo — no sirve para diferenciar tiers). Pendiente
   para la próxima actualización: correr el cruce de control cuando
   Ubersuggest libere cupo.

## Dificultad real (SD) cruzada contra el track record del sitio (2026-07-27)

Pedido de Juan: "agregá el número especulativo de tráfico teniendo en cuenta
la dificultad de las keywords y cómo vengo posicionando mi sitio". Esto
retoma el pendiente que había quedado anotado desde la corrida base
(Ubersuggest sin cupo ese día): se bajó el **SD real** (SEO Difficulty,
Ubersuggest, `locId=2032`, Argentina/español) de las 167 keywords, ahora sí
completo. Columna nueva `SD real` en la tabla de arriba.

**Lo que se intentó primero (y no funcionó como se esperaba):** cruzar el SD
real de cada keyword contra la posición real que esa guía ya logró en GSC,
para ver si el sitio rinde peor en keywords más difíciles — el dato que
Juan pidió ("cómo vengo posicionando"). Resultado: **correlación
prácticamente nula** (Pearson r = 0.026 sobre 147 guías con datos reales).
Guías con SD 71-76 (los más difíciles del catálogo: `microondas`,
`chromecast`, `perfumes-arabes`, `yogurtera`) tienen, en promedio, la
MISMA posición real (~7-8) que guías con SD 10-20 (los más fáciles). El
96% de las guías con datos está en top 10 sin importar el SD de su keyword
principal.

**Por qué pasa esto (y no es un error del cálculo):** la columna "Estado
real (GSC)" de este reporte es la posición promedio ponderada por TODAS
las queries que le traen impresiones a esa URL, no solo la keyword
principal. Una guía con keyword de cabeza muy difícil (`microondas`, SD 76)
casi seguro NO está en el top 10 para "microondas" a secas, pero sí está
arriba para decenas de variantes de cola larga más fáciles dentro de la
misma página (marca, modelo, "cuál elegir", etc.) — y esas son las que
levantan el promedio. Este mismo fenómeno ya estaba anotado en los caveats
de este archivo ("una guía puede tener posición promedio 6-7 en su mezcla
de 50 queries y seguir estando lejísimos del top para las 2-3 palabras de
su keyword principal"), pero hasta ahora no había un número real para
confirmarlo. Ahora lo hay: con el dato de SD real, se puede afirmar que
el "Pos" de este reporte **no sirve para medir qué tan bien rankea la
keyword principal específica**, solo qué tan bien rankea la página en
conjunto.

**Consecuencia honesta:** no se puede construir con los datos actuales un
"Realista v2" ajustado por dificultad que sea más preciso que el bruto
existente — intentarlo daría una falsa sensación de precisión. Para
hacerlo bien haría falta el ranking real de cada guía específicamente para
su keyword de cabeza (167 chequeos de SERP puntuales, o una herramienta de
rank tracking), no la posición promedio que ya se tiene. Es un paso
concreto que se puede hacer si Juan lo pide, pero es una tarea aparte, más
grande que agregar una columna.

**Lo que el SD real SÍ permite validar con números reales — la separación
genérico vs. cola/marca no es solo una intuición de patrón de keyword,
tiene una brecha de dificultad real detrás:**

| Categoría | Guías | SD promedio | SD mediana | Rango |
|---|--:|--:|--:|--:|
| Genérico (alta comp.) | 73 | 53.5 | 51 | 33-76 |
| Cola/marca (viable) | 94 | 39.7 | 44 | 4-63 |

Una brecha real de ~14 puntos de SD entre los dos grupos. El criterio de
clasificación (marca/comparación/calificador vs. término desnudo) termina
capturando una diferencia de dificultad real, no solo un patrón de texto.

**Distribución completa de dificultad real (167 keywords):**

| SD | Etiqueta | Guías | Volumen/mes |
|--:|---|--:|--:|
| 0-20 | Muy fácil | 12 | 970 |
| 21-35 | Fácil | 6 | 7.050 |
| 36-50 | Medio | 103 | 316.450 |
| 51-65 | Difícil | 33 | 803.900 |
| 66-100 | Muy difícil | 13 | 597.900 |

**Casos puntuales para revisar la clasificación** (no cambia el total, es
para decisiones futuras de qué contenido priorizar):

- **"Genérico" con SD sorprendentemente bajo (≤45), candidatos a no ser tan
  aspiracionales como se asumió**: `recetas-freidora-de-aire` (SD 33),
  `estufa-electrica-bajo-consumo` (SD 36), `cepillo-de-dientes-electrico`
  (SD 36, STAGED), `kit-camaras-seguridad` (SD 36), `torre-de-sonido` (SD
  44), `cafetera-de-filtro` (SD 44), `cortadora-de-pelo` (SD 44),
  `robot-de-cocina` (SD 45), `procesadora-de-alimentos` (SD 45, STAGED),
  `alarma-para-casa` (SD 45, STAGED) — vale la pena revisar si alguna de
  estas merece más enlazado interno o una re-optimización, ya que su techo
  real puede ser más alto de lo que sugiere la etiqueta "aspiracional".
- **"Cola/marca" con SD sorprendentemente alto (≥55), más difíciles de lo
  que asume la categoría**: `termo-stanley` (SD 63, sin datos aún — vigilar
  de cerca cuando indexe), `parlante-jbl` (SD 61), `robot-aspiradora-roomba`
  (SD 59, "roomba" es prácticamente un término genérico de marca registrada
  a esta altura, compite como tal).

**El número para planificar sigue siendo el mismo que antes: ≈10.297/mes
realista, ≈29.474/mes techo (solo cola/marca)** — pero ahora con una base
más sólida: no es solo "nos parece que estos son más fáciles", hay una
brecha de dificultad real medida detrás. No hay un número "v2" más preciso
que ofrecer sin el ranking específico por keyword.

## Alcance: las 157 guías completas, no solo pilares

A diferencia de essentialpetgear (1 fila por categoría), acá se pidió
explícitamente cubrir las 157 guías del sitio, incluidas las satélites de
marca (`microondas-atma`, `microondas-bgh` además de `microondas`). Esto
significa que varias filas comparten esencialmente el mismo espacio de
keyword que su guía pilar — el total de volumen sumado sobreestima la
demanda real por ese solapamiento. Ver caveats.

## Cómo se calcula cada fila

1. **Keyword principal**: derivada del título/H1 de la guía (intención del
   autor), no de la query real que hoy le trae tráfico — para mantener el
   criterio consistente en las 157 filas, incluidas las que todavía no
   tienen tráfico real. Mapeo completo en el histórico de esta sesión
   (`scripts/keyword-planner/bulk_historical_metrics.py` + lista de 157
   keywords).
2. **Volumen**: Google Keyword Planner, AR (`geoTargetConstants/2032`),
   español (`languageConstants/1003`), vía
   `scripts/keyword-planner/bulk_historical_metrics.py` (script nuevo:
   pide métricas EXACTAS para una lista de keywords propias en una sola
   tanda de requests, a diferencia de `kwp.py` que expande a ideas
   relacionadas).
3. **Estado real**: posición promedio ponderada por impresiones de la URL
   de la guía en el snapshot GSC más reciente (#31, 2026-06-27 a
   2026-07-24), fragments `#` ya colapsados a la URL base.
4. **Hoy (clicks reales)**: clicks reales de esa URL en el mismo snapshot.
   No es una proyección.
5. **Realista / techo**: `estimate_serp_clicks` (Ubersuggest, no consume
   cupo de reportes) sobre el volumen de Keyword Planner, en la posición
   `realista_pos` / `techo_pos` calculada desde la posición real (ver
   arriba). Nunca por debajo de los clicks reales de hoy (piso aplicado).

## Tabla (157 guías, 151 publicadas + 6 STAGED, corrida 2026-07-26, con clasificación por competencia)

| Guía | Keyword | SD real | Categoría | Vol/mes (KWP AR) | Estado real (GSC) | Hoy (real) | Realista 6-12m | Techo optimista |
|---|---|--:|---|--:|---|--:|--:|--:|
| mejores-freidoras-de-aire-argentina | freidora de aire | 71 | Genérico (alta comp.) | 90.500 | Pos 6.7 | 233 | 4.244 | 8.806 |
| perfumes-arabes | perfumes arabes | 76 | Genérico (alta comp.) | 90.500 | Pos 8.2 | 7 | 3.059 | 8.806 |
| auriculares-inalambricos | auriculares inalambricos | 71 | Genérico (alta comp.) | 74.000 | Pos 5.9 | 3 | 4.877 | 11.988 |
| microondas | microondas | 76 | Genérico (alta comp.) | 49.500 | Pos 4.7 | 29 | 3.262 | 8.019 |
| aire-acondicionado-portatil | aire acondicionado portatil | 58 | Genérico (alta comp.) | 49.500 | Pos 7.8 | 1 | 1.673 | 4.816 |
| camara-de-seguridad | camara de seguridad | 58 | Genérico (alta comp.) | 49.500 | Pos 8.3 | 7 | 1.673 | 4.816 |
| pava-electrica | pava electrica | 63 | Genérico (alta comp.) | 49.500 | Pos 5.6 | 82 | 3.262 | 8.019 |
| masajeador | masajeador | 72 | Genérico (alta comp.) | 49.500 | Pos 6.6 | 0 | 2.322 | 4.816 |
| termotanque-electrico | termotanque electrico | 63 | Genérico (alta comp.) | 49.500 | Pos 8.0 | 5 | 1.673 | 4.816 |
| chromecast | chromecast | 76 | Genérico (alta comp.) | 49.500 | Pos 7.1 | 3 | 2.322 | 4.816 |
| termo-stanley | termo stanley | 63 | Cola/marca (viable) | 49.500 | Sin datos aun | 0 | 14 | 975 |
| horno-electrico | horno electrico | 61 | Genérico (alta comp.) | 40.500 | Pos 6.2 | 14 | 1.899 | 6.561 |
| parlante-jbl | parlante jbl | 61 | Cola/marca (viable) | 40.500 | Pos 8.9 | 3 | 1.037 | 2.669 |
| yogurtera | yogurtera | 74 | Genérico (alta comp.) | 40.500 | Pos 8.4 | 3 | 1.369 | 3.941 |
| silla-gamer | silla gamer | 58 | Genérico (alta comp.) | 33.100 | Pos 7.1 | 8 | 1.552 | 3.221 |
| ventilador-de-techo | ventilador de techo | 53 | Genérico (alta comp.) | 33.100 | Pos 9.6 | 1 | 847 | 2.181 |
| ventilador-de-pie | ventilador de pie | 53 | Genérico (alta comp.) | 33.100 | STAGED | 0 | 10 | 652 |
| smartwatch | smartwatch | 71 | Genérico (alta comp.) | 33.100 | Pos 8.9 | 2 | 847 | 2.181 |
| caloventor | caloventor | 70 | Genérico (alta comp.) | 27.100 | Pos 6.0 | 20 | 1.786 | 4.390 |
| licuadora | licuadora | 70 | Genérico (alta comp.) | 27.100 | Pos 6.4 | 25 | 1.271 | 2.637 |
| robot-aspiradora | robot aspiradora | 57 | Genérico (alta comp.) | 27.100 | Pos 8.0 | 0 | 916 | 2.637 |
| mejor-aspiradora-robot | aspiradora robot | 57 | Genérico (alta comp.) | 27.100 | Pos 8.7 | 28 | 916 | 1.786 |
| cafetera-italiana | cafetera italiana | 57 | Genérico (alta comp.) | 27.100 | Pos 6.5 | 0 | 1.271 | 2.637 |
| secador-de-pelo | secador de pelo | 52 | Genérico (alta comp.) | 27.100 | Pos 7.7 | 13 | 916 | 2.637 |
| estufas-electricas | estufa electrica | 55 | Genérico (alta comp.) | 22.200 | Pos 6.8 | 10 | 1.041 | 2.160 |
| balanza-digital | balanza digital | 55 | Genérico (alta comp.) | 22.200 | Pos 6.4 | 10 | 1.041 | 2.160 |
| cafetera-express | cafetera express | 55 | Genérico (alta comp.) | 22.200 | Pos 8.4 | 63 | 750 | 2.160 |
| humidificador | humidificador | 68 | Genérico (alta comp.) | 22.200 | Pos 8.3 | 7 | 750 | 2.160 |
| termo | termo | 68 | Genérico (alta comp.) | 22.200 | Pos 8.2 | 4 | 750 | 2.160 |
| nebulizador | nebulizador | 68 | Genérico (alta comp.) | 22.200 | Pos 8.9 | 7 | 568 | 1.463 |
| tensiometro-digital | tensiometro digital | 55 | Genérico (alta comp.) | 22.200 | Pos 9.3 | 3 | 568 | 1.463 |
| termotanque-a-gas | termotanque a gas | 50 | Genérico (alta comp.) | 22.200 | Sin datos aun | 0 | 6 | 437 |
| joystick-ps5 | joystick ps5 | 54 | Genérico (alta comp.) | 18.100 | Pos 7.4 | 2 | 612 | 1.761 |
| parlantes | parlantes bluetooth | 54 | Genérico (alta comp.) | 18.100 | Pos 7.3 | 4 | 612 | 1.761 |
| auriculares-jbl | auriculares jbl | 54 | Cola/marca (viable) | 18.100 | Pos 6.1 | 0 | 849 | 2.932 |
| mejores-perfumes-arabes-hombre | perfume arabe hombre | 49 | Cola/marca (viable) | 18.100 | Pos 8.9 | 67 | 463 | 1.193 |
| planchita-de-pelo | planchita de pelo | 48 | Genérico (alta comp.) | 14.800 | Pos 6.4 | 1 | 694 | 1.440 |
| proyector-portatil | proyector portatil | 53 | Genérico (alta comp.) | 14.800 | Pos 7.5 | 22 | 500 | 1.440 |
| cargador-portatil | cargador portatil | 52 | Genérico (alta comp.) | 12.100 | Pos 7.8 | 2 | 409 | 1.177 |
| atma-freidoras-de-aire-review | freidora de aire atma | 39 | Cola/marca (viable) | 12.100 | Pos 6.1 | 31 | 567 | 1.960 |
| khamrah-lattafa | khamrah lattafa | 52 | Cola/marca (viable) | 12.100 | Pos 6.7 | 0 | 567 | 1.177 |
| cafetera-nespresso | cafetera nespresso | 52 | Cola/marca (viable) | 12.100 | Pos 16.6 | 2 | 19 | 310 |
| cafetera-oster | cafetera oster | 52 | Cola/marca (viable) | 12.100 | Pos 7.4 | 3 | 409 | 1.177 |
| tostadora | tostadora | 65 | Genérico (alta comp.) | 12.100 | Pos 9.0 | 9 | 310 | 797 |
| masajeador-cervical | masajeador cervical | 51 | Cola/marca (viable) | 9.900 | Pos 6.1 | 35 | 464 | 1.604 |
| botella-termica | botella termica | 51 | Genérico (alta comp.) | 9.900 | Sin datos aun | 0 | 3 | 195 |
| ducha-electrica | ducha electrica | 51 | Genérico (alta comp.) | 9.900 | Sin datos aun | 0 | 3 | 195 |
| termometro-digital | termometro digital | 51 | Genérico (alta comp.) | 9.900 | Pos 6.6 | 0 | 464 | 963 |
| camara-de-seguridad-exterior | camara de seguridad exterior | 38 | Genérico (alta comp.) | 8.100 | Pos 10.0 | 2 | 160 | 534 |
| pava-electrica-philips | pava electrica philips | 46 | Cola/marca (viable) | 8.100 | Pos 5.9 | 6 | 534 | 1.312 |
| yara-lattafa-guia-completa | yara lattafa | 51 | Cola/marca (viable) | 8.100 | Pos 6.4 | 20 | 380 | 788 |
| cafetera-dolce-gusto | cafetera dolce gusto | 46 | Cola/marca (viable) | 8.100 | Pos 9.9 | 3 | 207 | 534 |
| microondas-bgh | microondas bgh | 50 | Cola/marca (viable) | 6.600 | Pos 6.2 | 0 | 310 | 1.069 |
| recetas-freidora-de-aire | recetas para freidora de aire | 33 | Genérico (alta comp.) | 6.600 | Pos 9.1 | 3 | 169 | 435 |
| lattafa-asad-comparativa | lattafa asad | 50 | Cola/marca (viable) | 6.600 | Pos 7.4 | 2 | 223 | 642 |
| maquina-de-afeitar | maquina de afeitar | 45 | Genérico (alta comp.) | 6.600 | Pos 8.0 | 0 | 223 | 642 |
| parrilla-electrica | parrilla electrica | 50 | Genérico (alta comp.) | 6.600 | STAGED | 0 | 2 | 130 |
| robot-de-cocina | robot de cocina | 45 | Genérico (alta comp.) | 5.400 | Pos 7.3 | 10 | 183 | 525 |
| auriculares-gamer | auriculares gamer | 50 | Genérico (alta comp.) | 5.400 | Pos 8.8 | 4 | 138 | 356 |
| licuadora-portatil | licuadora portatil | 50 | Genérico (alta comp.) | 5.400 | Pos 7.4 | 0 | 183 | 525 |
| masajeador-espalda | masajeador de espalda | 45 | Cola/marca (viable) | 5.400 | Pos 9.3 | 7 | 138 | 356 |
| pistola-masajeadora | pistola masajeadora | 50 | Cola/marca (viable) | 5.400 | Pos 7.8 | 1 | 183 | 525 |
| peabody-freidoras-de-aire-review | freidora de aire peabody | 37 | Cola/marca (viable) | 5.400 | Pos 6.1 | 22 | 253 | 875 |
| auriculares-sony | auriculares sony | 50 | Cola/marca (viable) | 5.400 | Sin datos aun | 0 | 2 | 106 |
| teclado-gamer | teclado gamer | 50 | Genérico (alta comp.) | 4.400 | Pos 7.5 | 1 | 149 | 428 |
| mouse-gamer | mouse gamer | 50 | Genérico (alta comp.) | 4.400 | Pos 7.3 | 0 | 149 | 428 |
| joystick-xbox | joystick xbox | 50 | Genérico (alta comp.) | 4.400 | Pos 6.3 | 1 | 206 | 713 |
| licuadora-philips | licuadora philips | 50 | Cola/marca (viable) | 4.400 | Pos 9.1 | 0 | 113 | 290 |
| pava-electrica-atma | pava electrica atma | 45 | Cola/marca (viable) | 4.400 | Pos 9.3 | 2 | 113 | 290 |
| masajeador-facial | masajeador facial | 50 | Cola/marca (viable) | 4.400 | Pos 8.1 | 7 | 149 | 428 |
| masajeador-pies | masajeador de pies | 45 | Cola/marca (viable) | 4.400 | Pos 6.2 | 2 | 206 | 713 |
| philips-freidoras-de-aire-review | freidora de aire philips | 37 | Cola/marca (viable) | 4.400 | Pos 6.4 | 10 | 206 | 428 |
| lattafa-guia-marca | perfumes lattafa | 50 | Cola/marca (viable) | 4.400 | Pos 6.6 | 0 | 206 | 428 |
| cafetera-peabody | cafetera peabody | 50 | Cola/marca (viable) | 4.400 | Pos 9.5 | 0 | 113 | 290 |
| reloj-garmin | reloj garmin | 50 | Cola/marca (viable) | 4.400 | Sin datos aun (publicada 2026-07-27) | 0 | 1 | 87 |
| procesadora-de-alimentos | procesadora de alimentos | 45 | Genérico (alta comp.) | 4.400 | STAGED | 0 | 1 | 87 |
| alarma-para-casa | alarma para casa | 45 | Genérico (alta comp.) | 4.400 | STAGED | 0 | 1 | 87 |
| monitor-gamer | monitor gamer | 50 | Genérico (alta comp.) | 3.600 | Pos 7.6 | 0 | 122 | 350 |
| licuadora-oster | licuadora oster | 50 | Cola/marca (viable) | 3.600 | Pos 5.6 | 1 | 237 | 583 |
| pava-electrica-precio | pava electrica precio | 45 | Cola/marca (viable) | 3.600 | Pos 8.3 | 0 | 122 | 350 |
| masajeador-gadnic | masajeador gadnic | 50 | Cola/marca (viable) | 3.600 | Pos 5.9 | 24 | 237 | 583 |
| microondas-samsung | microondas samsung | 50 | Cola/marca (viable) | 3.600 | Sin datos aun | 0 | 1 | 71 |
| microondas-atma | microondas atma | 49 | Cola/marca (viable) | 2.900 | Pos 7.7 | 0 | 98 | 282 |
| horno-atma | horno electrico atma | 44 | Cola/marca (viable) | 2.900 | Pos 9.2 | 0 | 74 | 191 |
| joystick-pc | joystick pc | 49 | Genérico (alta comp.) | 2.900 | Pos 6.2 | 10 | 136 | 470 |
| torre-de-sonido | torre de sonido | 44 | Genérico (alta comp.) | 2.900 | Pos 6.7 | 11 | 136 | 282 |
| parlante-stromberg | parlante stromberg | 49 | Cola/marca (viable) | 2.900 | Pos 6.9 | 6 | 136 | 282 |
| estufa-electrica-bajo-consumo | estufa electrica bajo consumo | 36 | Genérico (alta comp.) | 2.900 | Pos 8.9 | 22 | 74 | 191 |
| sillon-masajeador | sillon masajeador | 49 | Cola/marca (viable) | 2.900 | Pos 6.1 | 3 | 136 | 470 |
| camara-ezviz | camara ezviz | 49 | Cola/marca (viable) | 2.900 | Sin datos aun | 0 | 1 | 57 |
| auriculares-xiaomi | auriculares xiaomi | 49 | Cola/marca (viable) | 2.900 | Sin datos aun | 0 | 1 | 57 |
| mejores-robot-aspiradora-trapeadora | robot aspiradora trapeadora | 44 | Genérico (alta comp.) | 2.900 | Pos 11.8 | 0 | 43 | 136 |
| cafetera-de-filtro | cafetera de filtro | 44 | Genérico (alta comp.) | 2.900 | Pos 5.9 | 32 | 191 | 470 |
| cortadora-de-pelo | cortadora de pelo | 44 | Genérico (alta comp.) | 2.900 | Pos 7.7 | 6 | 98 | 282 |
| cepillo-de-dientes-electrico | cepillo de dientes electrico | 36 | Genérico (alta comp.) | 2.900 | STAGED | 0 | 1 | 57 |
| cerradura-inteligente | cerradura inteligente | 49 | Genérico (alta comp.) | 2.900 | STAGED | 0 | 1 | 57 |
| proyector-astronauta | proyector astronauta / galaxia | 36 | Cola/marca (viable) | 2.570 | Sin datos aun | 0 | 1 | 51 |
| joystick-para-celular | joystick para celular | 44 | Genérico (alta comp.) | 2.400 | Pos 9.6 | 2 | 61 | 158 |
| pava-electrica-peabody | pava electrica peabody | 44 | Cola/marca (viable) | 2.400 | Pos 7.6 | 8 | 81 | 234 |
| oster-freidoras-de-aire-review | freidora de aire oster | 36 | Cola/marca (viable) | 2.400 | Pos 7.2 | 0 | 113 | 234 |
| licuadora-de-mano | licuadora de mano | 43 | Cola/marca (viable) | 1.900 | Pos 6.8 | 2 | 89 | 185 |
| pava-electrica-liliana | pava electrica liliana | 44 | Cola/marca (viable) | 1.900 | Pos 5.7 | 0 | 125 | 308 |
| cafetera-de-capsulas | cafetera de capsulas | 44 | Genérico (alta comp.) | 1.900 | Pos 7.4 | 0 | 64 | 185 |
| cafetera-smartlife | cafetera smartlife | 49 | Cola/marca (viable) | 1.900 | Pos 6.2 | 18 | 89 | 308 |
| masajeador-electrico | masajeador electrico | 49 | Genérico (alta comp.) | 1.600 | Pos 9.4 | 1 | 41 | 105 |
| perfumes-arabes-mujer | perfumes arabes mujer | 44 | Cola/marca (viable) | 1.600 | Pos 9.1 | 127 | 127 | 127 |
| robot-aspiradora-roomba | roomba | 59 | Cola/marca (viable) | 1.600 | Pos 10.9 | 1 | 32 | 105 |
| yogurtera-daewoo | yogurtera daewoo | 49 | Cola/marca (viable) | 1.600 | Sin datos aun | 0 | 1 | 32 |
| depiladora-electrica | depiladora electrica | 49 | Genérico (alta comp.) | 1.600 | Pos 8.7 | 1 | 54 | 105 |
| kit-camaras-seguridad | kit de camaras de seguridad | 36 | Genérico (alta comp.) | 1.300 | Pos 11.6 | 1 | 19 | 61 |
| licuadora-atma | licuadora atma | 49 | Cola/marca (viable) | 1.300 | Pos 8.3 | 0 | 44 | 126 |
| pava-electrica-mercadolibre | pava electrica mercadolibre | 44 | Cola/marca (viable) | 1.300 | Pos 9.0 | 0 | 33 | 86 |
| camara-tplink-tapo | camara tp-link tapo | 44 | Cola/marca (viable) | 1.020 | Sin datos aun | 0 | 1 | 20 |
| auriculares-deportivos | auriculares deportivos | 49 | Genérico (alta comp.) | 1.000 | Pos 7.0 | 1 | 47 | 97 |
| pava-electrica-oster | pava electrica oster | 44 | Cola/marca (viable) | 1.000 | Pos 8.2 | 0 | 34 | 97 |
| gadnic-freidora-review | freidora de aire gadnic | 36 | Cola/marca (viable) | 1.000 | Pos 7.7 | 3 | 34 | 97 |
| robot-aspiradora-samsung | robot aspiradora samsung | 44 | Cola/marca (viable) | 1.000 | Pos 9.0 | 0 | 26 | 66 |
| cafetera-automatica | cafetera automatica | 49 | Genérico (alta comp.) | 1.000 | Pos 12.4 | 0 | 15 | 47 |
| bombilla-de-mate | bombilla de mate | 42 | Genérico (alta comp.) | 1.000 | Sin datos aun | 0 | 0 | 20 |
| kanji-home-freidora-review | freidora de aire kanji home | 36 | Cola/marca (viable) | 880 | Pos 7.7 | 0 | 30 | 86 |
| suono-airfryer-review | freidora de aire suono | 36 | Cola/marca (viable) | 880 | Pos 6.0 | 0 | 58 | 143 |
| robot-aspiradora-atma | robot aspiradora atma | 44 | Cola/marca (viable) | 880 | Pos 6.9 | 3 | 41 | 86 |
| cafetera-liliana | cafetera liliana | 49 | Cola/marca (viable) | 880 | Pos 6.0 | 1 | 58 | 143 |
| pava-electrica-vidrio | pava electrica de vidrio | 36 | Cola/marca (viable) | 720 | Pos 6.0 | 1 | 47 | 117 |
| pava-electrica-acero-inoxidable | pava electrica acero inoxidable | 36 | Cola/marca (viable) | 720 | Pos 7.4 | 9 | 24 | 70 |
| microondas-lg | microondas lg | 48 | Cola/marca (viable) | 720 | Sin datos aun | 0 | 1 | 14 |
| ninja-crispi-review | ninja crispi | 49 | Cola/marca (viable) | 590 | Pos 9.0 | 0 | 15 | 39 |
| masajeador-espalda-cuello | masajeador de espalda y cuello | 36 | Cola/marca (viable) | 390 | Pos 6.8 | 1 | 18 | 38 |
| accesorios-para-freidora-de-aire | accesorios para freidora de aire | 36 | Genérico (alta comp.) | 390 | Pos 8.2 | 0 | 13 | 38 |
| perfumes-arabes-originales | perfumes arabes originales | 44 | Cola/marca (viable) | 390 | Pos 7.3 | 2 | 13 | 38 |
| robot-aspiradora-xiaomi | robot aspiradora xiaomi | 44 | Cola/marca (viable) | 390 | Pos 8.2 | 12 | 13 | 38 |
| kit-gamer | kit gamer | 48 | Genérico (alta comp.) | 320 | Pos 7.2 | 0 | 15 | 31 |
| mejores-freidoras-de-aire-doble-canasta | freidora de aire doble canasta | 36 | Cola/marca (viable) | 320 | Pos 6.7 | 6 | 15 | 31 |
| como-usar-una-freidora-de-aire | como usar una freidora de aire | 14 | Cola/marca (viable) | 320 | Pos 7.6 | 0 | 11 | 31 |
| cuanto-consume-freidora-de-aire | cuanto consume una freidora de aire | 20 | Cola/marca (viable) | 320 | Pos 7.5 | 3 | 11 | 31 |
| perfumes-arabes-mas-vendidos-argentina | perfumes arabes mas vendidos | 35 | Cola/marca (viable) | 320 | Pos 5.9 | 97 | 97 | 97 |
| auriculares-profesionales | auriculares profesionales | 49 | Genérico (alta comp.) | 260 | Pos 6.1 | 0 | 12 | 42 |
| powerxl-freidora-review | freidora de aire powerxl | 36 | Cola/marca (viable) | 260 | Pos 10.6 | 0 | 5 | 17 |
| perfumes-arabes-precio-argentina | perfumes arabes precio | 42 | Cola/marca (viable) | 260 | Pos 7.2 | 5 | 12 | 25 |
| perfumes-arabes-dupes | dupes de perfumes arabes | 19 | Cola/marca (viable) | 260 | Pos 7.4 | 100 | 100 | 100 |
| freidoras-de-aire-con-grill-argentina | freidora de aire con grill | 36 | Cola/marca (viable) | 170 | Pos 7.2 | 1 | 8 | 17 |
| perfumes-arabes-amaderados | perfumes arabes amaderados | 41 | Cola/marca (viable) | 170 | Pos 7.4 | 22 | 22 | 22 |
| robot-aspiradora-precio-argentina | robot aspiradora precio | 44 | Cola/marca (viable) | 170 | Pos 8.1 | 0 | 6 | 17 |
| robot-aspiradora-gadnic | robot aspiradora gadnic | 44 | Cola/marca (viable) | 170 | Pos 8.9 | 10 | 10 | 11 |
| pava-electrica-control-temperatura | pava electrica con control de temperatura | 36 | Cola/marca (viable) | 90 | Pos 7.1 | 5 | 5 | 9 |
| mejores-freidoras-de-aire-economicas-argentina | freidora de aire economica | 36 | Cola/marca (viable) | 70 | Pos 15.4 | 1 | 1 | 2 |
| que-cafetera-comprar | que cafetera comprar | 44 | Genérico (alta comp.) | 70 | Pos 8.3 | 0 | 2 | 7 |
| donde-comprar-perfumes-arabes-argentina | donde comprar perfumes arabes | 33 | Cola/marca (viable) | 50 | Pos 7.9 | 3 | 3 | 5 |
| como-funciona-robot-aspiradora | como funciona un robot aspiradora | 14 | Cola/marca (viable) | 50 | Pos 8.5 | 0 | 2 | 5 |
| mejores-peluches-personajes-argentina | peluches de personajes | 28 | Cola/marca (viable) | 50 | Pos 6.9 | 0 | 2 | 5 |
| pava-electrica-pequena | pava electrica pequeña | 41 | Cola/marca (viable) | 40 | Pos 8.0 | 0 | 1 | 4 |
| horno-electrico-vs-microondas | horno electrico vs microondas | 28 | Cola/marca (viable) | 20 | Pos 8.2 | 1 | 1 | 2 |
| freidora-de-aire-desventajas | desventajas de la freidora de aire | 11 | Cola/marca (viable) | 20 | Pos 9.8 | 0 | 1 | 1 |
| masajeador-donde-comprar-argentina | donde comprar masajeador | 44 | Cola/marca (viable) | 10 | Pos 9.3 | 0 | 0 | 1 |
| mejores-masajeadores-argentina | mejores masajeadores | 49 | Genérico (alta comp.) | 10 | Pos 6.4 | 17 | 17 | 17 |
| freidoras-de-aire-gran-capacidad | freidora de aire gran capacidad | 36 | Cola/marca (viable) | 10 | Pos 9.7 | 1 | 1 | 1 |
| freidora-de-aire-vs-horno | freidora de aire vs horno | 36 | Cola/marca (viable) | 10 | Pos 6.2 | 1 | 1 | 2 |
| vale-la-pena-comprar-freidora-de-aire | vale la pena la freidora de aire | 36 | Cola/marca (viable) | 10 | Pos 12.8 | 1 | 1 | 1 |
| donde-comprar-perfumes-arabes-buenos-aires | donde comprar perfumes arabes en buenos aires | 31 | Cola/marca (viable) | 10 | Pos 7.0 | 17 | 17 | 17 |
| hy300-vs-hy320 | hy300 vs hy320 | 44 | Cola/marca (viable) | 10 | Pos 6.0 | 1 | 1 | 2 |
| liliana-vs-peabody-pava-electrica | liliana vs peabody pava electrica | 4 | Cola/marca (viable) | 0 | Pos 3.4 | 0 | 0 | 0 |
| atma-vs-peabody-freidora-de-aire | atma vs peabody freidora de aire | 4 | Cola/marca (viable) | 0 | Pos 5.7 | 13 | 13 | 13 |
| ninja-vs-philips-freidora-de-aire | ninja vs philips freidora de aire | 4 | Cola/marca (viable) | 0 | Pos 6.7 | 0 | 0 | 0 |
| perfumes-arabes-por-color | perfumes arabes por color | 4 | Cola/marca (viable) | 0 | Pos 8.2 | 5 | 5 | 5 |
| robot-aspiradora-con-mapeo-laser | robot aspiradora con mapeo laser | 4 | Cola/marca (viable) | 0 | Pos 9.5 | 0 | 0 | 0 |
| aspiradora-robot-gadnic-vs-xiaomi | gadnic vs xiaomi robot aspiradora | 4 | Cola/marca (viable) | 0 | Pos 4.3 | 22 | 22 | 22 |
| dia-del-nino-argentina | regalos dia del niño | 4 | Cola/marca (viable) | 0 | Pos 5.7 | 6 | 6 | 6 |

## Totales acumulados (corrida base 2026-07-26; +9 filas loop del día anterior + 1 fila nueva 2026-07-27: `reloj-garmin`)

| Métrica | Valor |
|---|---:|
| Guías (161 publicadas + 6 STAGED) | 167 |
| Volumen sumado, publicadas (Keyword Planner AR) | 1.671.970 /mes |
| Clicks reales HOY (GSC, snapshot 27/6-24/7) | 1.519 /mes |
| Clicks estimados — realista 6-12 meses (bruto, sobreestima) | ≈ 64.055 /mes |
| Clicks estimados — techo optimista (bruto, sobreestima) | ≈ 165.573 /mes |
| **Clicks estimados — realista, solo cola/marca (número creíble)** | **≈ 10.297 /mes** |
| **Clicks estimados — techo, solo cola/marca (número creíble)** | **≈ 29.474 /mes** |

Ver "Corrección del mismo día" más arriba para por qué el bruto sobreestima
y cómo se llega al número de cola/marca.

### Por estado real (GSC)

| Estado | Guías | Volumen sumado | Hoy (real) | Realista | Techo |
|---|---:|---:|---:|---:|---:|
| Ya en el top 10 (pos ≤10) | 139 | 1.535.120 /mes | 1.513 | 63.884 | 162.577 |
| Visible pero floja (pos 11-30) | 8 | 19.240 /mes | 6 | 135 | 679 |
| Sin datos aún (nueva o STAGED) | 20 | 171.910 /mes | 0 | 52 | 3.387 |

## Caveats (válidos para toda actualización futura)

- **Es tráfico, no ventas** — falta CTR de compra y margen por producto.
- **Es solo la keyword cabeza de cada guía**, no la cola larga que cada
  página también capta (y que en este sitio, con tráfico real, es
  significativa — ver `gsc.py report`).
- **Solapamiento real entre pilares y satélites**: `robot-aspiradora`,
  `mejor-aspiradora-robot` y varias variantes de marca (`robot-aspiradora-atma`,
  `-samsung`, `-xiaomi`, etc.) compiten en gran medida por el mismo tráfico.
  Sumar sus volúmenes por separado sobreestima la demanda real del silo.
  Mismo patrón en `microondas`/`microondas-atma`/`microondas-bgh`,
  `cafetera-*`, `pava-electrica-*`, `masajeador-*` y `perfumes-arabes-*`.
  El total de 1.597.360/mes es una cota superior nominal, no demanda neta.
- **Sin cruce de control de Ubersuggest esta corrida** (cupo diario
  agotado) y sin dificultad SEO orgánica real — ver sección de arriba.
  Repetir el cruce en la próxima actualización.
- **La keyword de cada guía es la intención del título/H1**, no
  necesariamente la query que hoy le trae más tráfico real (que a veces
  difiere, sobre todo en guías satélite con pocas impresiones — ver la
  baranda de cobertura de datos en la skill `optimizador-guias-pv`).
- **"Realista" y "techo" son un piso conservador atado a la posición
  actual**, no una garantía. Guías con muy pocas impresiones reales tienen
  el mismo problema de cobertura de datos de GSC documentado en
  `optimizador-guias-pv` (el umbral de privacidad de Google puede estar
  ocultando volumen real de queries que no se ven).
