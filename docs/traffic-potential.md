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
| Cola / marca (creíble en DA1) | 92 | 340.600 /mes | 766 | **10.295** | **29.373** |

**El número para planificar es el de "cola/marca": ≈10.295/mes realista,
≈29.373/mes techo (actualizado 2026-07-26 con el alta de `termo-stanley`, `auriculares-sony`, `microondas-samsung`, `camara-ezviz`, `auriculares-xiaomi`, `proyector-astronauta`, `yogurtera-daewoo` y `camara-tplink-tapo`).** El bloque genérico queda como techo aspiracional,
condicionado a que en algún momento haya link building real — no es algo
que vaya a moverse solo con más guías o mejor enlazado interno.

La columna "Categoría" (`generico` / `cola_marca`) se agregó a la tabla de
abajo. Reglas de clasificación: `generico` si la keyword no tiene marca, no
tiene "vs", y no tiene calificador (precio/review/opiniones/como usar/por
color/cuánto consume/etc.); `cola_marca` en cualquier otro caso. Al agregar
guías nuevas, clasificarlas con el mismo criterio y sumarlas al grupo que
corresponda.

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

| Guía | Keyword | Categoría | Vol/mes (KWP AR) | Estado real (GSC) | Hoy (real) | Realista 6-12m | Techo optimista |
|---|---|---|---:|---|---:|---:|---:|
| mejores-freidoras-de-aire-argentina | freidora de aire | Genérico (alta comp.) | 90.500 | Pos 6.7 | 233 | 4.244 | 8.806 |
| perfumes-arabes | perfumes arabes | Genérico (alta comp.) | 90.500 | Pos 8.2 | 7 | 3.059 | 8.806 |
| auriculares-inalambricos | auriculares inalambricos | Genérico (alta comp.) | 74.000 | Pos 5.9 | 3 | 4.877 | 11.988 |
| microondas | microondas | Genérico (alta comp.) | 49.500 | Pos 4.7 | 29 | 3.262 | 8.019 |
| aire-acondicionado-portatil | aire acondicionado portatil | Genérico (alta comp.) | 49.500 | Pos 7.8 | 1 | 1.673 | 4.816 |
| camara-de-seguridad | camara de seguridad | Genérico (alta comp.) | 49.500 | Pos 8.3 | 7 | 1.673 | 4.816 |
| pava-electrica | pava electrica | Genérico (alta comp.) | 49.500 | Pos 5.6 | 82 | 3.262 | 8.019 |
| masajeador | masajeador | Genérico (alta comp.) | 49.500 | Pos 6.6 | 0 | 2.322 | 4.816 |
| termotanque-electrico | termotanque electrico | Genérico (alta comp.) | 49.500 | Pos 8.0 | 5 | 1.673 | 4.816 |
| chromecast | chromecast | Genérico (alta comp.) | 49.500 | Pos 7.1 | 3 | 2.322 | 4.816 |
| termo-stanley | termo stanley | Cola/marca (viable) | 49.500 | Sin datos aun | 0 | 14 | 975 |
| horno-electrico | horno electrico | Genérico (alta comp.) | 40.500 | Pos 6.2 | 14 | 1.899 | 6.561 |
| parlante-jbl | parlante jbl | Cola/marca (viable) | 40.500 | Pos 8.9 | 3 | 1.037 | 2.669 |
| yogurtera | yogurtera | Genérico (alta comp.) | 40.500 | Pos 8.4 | 3 | 1.369 | 3.941 |
| silla-gamer | silla gamer | Genérico (alta comp.) | 33.100 | Pos 7.1 | 8 | 1.552 | 3.221 |
| ventilador-de-techo | ventilador de techo | Genérico (alta comp.) | 33.100 | Pos 9.6 | 1 | 847 | 2.181 |
| ventilador-de-pie | ventilador de pie | Genérico (alta comp.) | 33.100 | STAGED | 0 | 10 | 652 |
| smartwatch | smartwatch | Genérico (alta comp.) | 33.100 | Pos 8.9 | 2 | 847 | 2.181 |
| caloventor | caloventor | Genérico (alta comp.) | 27.100 | Pos 6.0 | 20 | 1.786 | 4.390 |
| licuadora | licuadora | Genérico (alta comp.) | 27.100 | Pos 6.4 | 25 | 1.271 | 2.637 |
| robot-aspiradora | robot aspiradora | Genérico (alta comp.) | 27.100 | Pos 8.0 | 0 | 916 | 2.637 |
| mejor-aspiradora-robot | aspiradora robot | Genérico (alta comp.) | 27.100 | Pos 8.7 | 28 | 916 | 1.786 |
| cafetera-italiana | cafetera italiana | Genérico (alta comp.) | 27.100 | Pos 6.5 | 0 | 1.271 | 2.637 |
| secador-de-pelo | secador de pelo | Genérico (alta comp.) | 27.100 | Pos 7.7 | 13 | 916 | 2.637 |
| estufas-electricas | estufa electrica | Genérico (alta comp.) | 22.200 | Pos 6.8 | 10 | 1.041 | 2.160 |
| balanza-digital | balanza digital | Genérico (alta comp.) | 22.200 | Pos 6.4 | 10 | 1.041 | 2.160 |
| cafetera-express | cafetera express | Genérico (alta comp.) | 22.200 | Pos 8.4 | 63 | 750 | 2.160 |
| humidificador | humidificador | Genérico (alta comp.) | 22.200 | Pos 8.3 | 7 | 750 | 2.160 |
| termo | termo | Genérico (alta comp.) | 22.200 | Pos 8.2 | 4 | 750 | 2.160 |
| nebulizador | nebulizador | Genérico (alta comp.) | 22.200 | Pos 8.9 | 7 | 568 | 1.463 |
| tensiometro-digital | tensiometro digital | Genérico (alta comp.) | 22.200 | Pos 9.3 | 3 | 568 | 1.463 |
| termotanque-a-gas | termotanque a gas | Genérico (alta comp.) | 22.200 | Sin datos aun | 0 | 6 | 437 |
| joystick-ps5 | joystick ps5 | Genérico (alta comp.) | 18.100 | Pos 7.4 | 2 | 612 | 1.761 |
| parlantes | parlantes bluetooth | Genérico (alta comp.) | 18.100 | Pos 7.3 | 4 | 612 | 1.761 |
| auriculares-jbl | auriculares jbl | Cola/marca (viable) | 18.100 | Pos 6.1 | 0 | 849 | 2.932 |
| mejores-perfumes-arabes-hombre | perfume arabe hombre | Cola/marca (viable) | 18.100 | Pos 8.9 | 67 | 463 | 1.193 |
| planchita-de-pelo | planchita de pelo | Genérico (alta comp.) | 14.800 | Pos 6.4 | 1 | 694 | 1.440 |
| proyector-portatil | proyector portatil | Genérico (alta comp.) | 14.800 | Pos 7.5 | 22 | 500 | 1.440 |
| cargador-portatil | cargador portatil | Genérico (alta comp.) | 12.100 | Pos 7.8 | 2 | 409 | 1.177 |
| atma-freidoras-de-aire-review | freidora de aire atma | Cola/marca (viable) | 12.100 | Pos 6.1 | 31 | 567 | 1.960 |
| khamrah-lattafa | khamrah lattafa | Cola/marca (viable) | 12.100 | Pos 6.7 | 0 | 567 | 1.177 |
| cafetera-nespresso | cafetera nespresso | Cola/marca (viable) | 12.100 | Pos 16.6 | 2 | 19 | 310 |
| cafetera-oster | cafetera oster | Cola/marca (viable) | 12.100 | Pos 7.4 | 3 | 409 | 1.177 |
| tostadora | tostadora | Genérico (alta comp.) | 12.100 | Pos 9.0 | 9 | 310 | 797 |
| masajeador-cervical | masajeador cervical | Cola/marca (viable) | 9.900 | Pos 6.1 | 35 | 464 | 1.604 |
| botella-termica | botella termica | Genérico (alta comp.) | 9.900 | Sin datos aun | 0 | 3 | 195 |
| ducha-electrica | ducha electrica | Genérico (alta comp.) | 9.900 | Sin datos aun | 0 | 3 | 195 |
| termometro-digital | termometro digital | Genérico (alta comp.) | 9.900 | Pos 6.6 | 0 | 464 | 963 |
| camara-de-seguridad-exterior | camara de seguridad exterior | Genérico (alta comp.) | 8.100 | Pos 10.0 | 2 | 160 | 534 |
| pava-electrica-philips | pava electrica philips | Cola/marca (viable) | 8.100 | Pos 5.9 | 6 | 534 | 1.312 |
| yara-lattafa-guia-completa | yara lattafa | Cola/marca (viable) | 8.100 | Pos 6.4 | 20 | 380 | 788 |
| cafetera-dolce-gusto | cafetera dolce gusto | Cola/marca (viable) | 8.100 | Pos 9.9 | 3 | 207 | 534 |
| microondas-bgh | microondas bgh | Cola/marca (viable) | 6.600 | Pos 6.2 | 0 | 310 | 1.069 |
| recetas-freidora-de-aire | recetas para freidora de aire | Genérico (alta comp.) | 6.600 | Pos 9.1 | 3 | 169 | 435 |
| lattafa-asad-comparativa | lattafa asad | Cola/marca (viable) | 6.600 | Pos 7.4 | 2 | 223 | 642 |
| maquina-de-afeitar | maquina de afeitar | Genérico (alta comp.) | 6.600 | Pos 8.0 | 0 | 223 | 642 |
| parrilla-electrica | parrilla electrica | Genérico (alta comp.) | 6.600 | STAGED | 0 | 2 | 130 |
| robot-de-cocina | robot de cocina | Genérico (alta comp.) | 5.400 | Pos 7.3 | 10 | 183 | 525 |
| auriculares-gamer | auriculares gamer | Genérico (alta comp.) | 5.400 | Pos 8.8 | 4 | 138 | 356 |
| licuadora-portatil | licuadora portatil | Genérico (alta comp.) | 5.400 | Pos 7.4 | 0 | 183 | 525 |
| masajeador-espalda | masajeador de espalda | Cola/marca (viable) | 5.400 | Pos 9.3 | 7 | 138 | 356 |
| pistola-masajeadora | pistola masajeadora | Cola/marca (viable) | 5.400 | Pos 7.8 | 1 | 183 | 525 |
| peabody-freidoras-de-aire-review | freidora de aire peabody | Cola/marca (viable) | 5.400 | Pos 6.1 | 22 | 253 | 875 |
| auriculares-sony | auriculares sony | Cola/marca (viable) | 5.400 | Sin datos aun | 0 | 2 | 106 |
| teclado-gamer | teclado gamer | Genérico (alta comp.) | 4.400 | Pos 7.5 | 1 | 149 | 428 |
| mouse-gamer | mouse gamer | Genérico (alta comp.) | 4.400 | Pos 7.3 | 0 | 149 | 428 |
| joystick-xbox | joystick xbox | Genérico (alta comp.) | 4.400 | Pos 6.3 | 1 | 206 | 713 |
| licuadora-philips | licuadora philips | Cola/marca (viable) | 4.400 | Pos 9.1 | 0 | 113 | 290 |
| pava-electrica-atma | pava electrica atma | Cola/marca (viable) | 4.400 | Pos 9.3 | 2 | 113 | 290 |
| masajeador-facial | masajeador facial | Cola/marca (viable) | 4.400 | Pos 8.1 | 7 | 149 | 428 |
| masajeador-pies | masajeador de pies | Cola/marca (viable) | 4.400 | Pos 6.2 | 2 | 206 | 713 |
| philips-freidoras-de-aire-review | freidora de aire philips | Cola/marca (viable) | 4.400 | Pos 6.4 | 10 | 206 | 428 |
| lattafa-guia-marca | perfumes lattafa | Cola/marca (viable) | 4.400 | Pos 6.6 | 0 | 206 | 428 |
| cafetera-peabody | cafetera peabody | Cola/marca (viable) | 4.400 | Pos 9.5 | 0 | 113 | 290 |
| procesadora-de-alimentos | procesadora de alimentos | Genérico (alta comp.) | 4.400 | STAGED | 0 | 1 | 87 |
| alarma-para-casa | alarma para casa | Genérico (alta comp.) | 4.400 | STAGED | 0 | 1 | 87 |
| monitor-gamer | monitor gamer | Genérico (alta comp.) | 3.600 | Pos 7.6 | 0 | 122 | 350 |
| licuadora-oster | licuadora oster | Cola/marca (viable) | 3.600 | Pos 5.6 | 1 | 237 | 583 |
| pava-electrica-precio | pava electrica precio | Cola/marca (viable) | 3.600 | Pos 8.3 | 0 | 122 | 350 |
| masajeador-gadnic | masajeador gadnic | Cola/marca (viable) | 3.600 | Pos 5.9 | 24 | 237 | 583 |
| microondas-samsung | microondas samsung | Cola/marca (viable) | 3.600 | Sin datos aun | 0 | 1 | 71 |
| microondas-atma | microondas atma | Cola/marca (viable) | 2.900 | Pos 7.7 | 0 | 98 | 282 |
| horno-atma | horno electrico atma | Cola/marca (viable) | 2.900 | Pos 9.2 | 0 | 74 | 191 |
| joystick-pc | joystick pc | Genérico (alta comp.) | 2.900 | Pos 6.2 | 10 | 136 | 470 |
| torre-de-sonido | torre de sonido | Genérico (alta comp.) | 2.900 | Pos 6.7 | 11 | 136 | 282 |
| parlante-stromberg | parlante stromberg | Cola/marca (viable) | 2.900 | Pos 6.9 | 6 | 136 | 282 |
| estufa-electrica-bajo-consumo | estufa electrica bajo consumo | Genérico (alta comp.) | 2.900 | Pos 8.9 | 22 | 74 | 191 |
| sillon-masajeador | sillon masajeador | Cola/marca (viable) | 2.900 | Pos 6.1 | 3 | 136 | 470 |
| camara-ezviz | camara ezviz | Cola/marca (viable) | 2.900 | Sin datos aun | 0 | 1 | 57 |
| auriculares-xiaomi | auriculares xiaomi | Cola/marca (viable) | 2.900 | Sin datos aun | 0 | 1 | 57 |
| mejores-robot-aspiradora-trapeadora | robot aspiradora trapeadora | Genérico (alta comp.) | 2.900 | Pos 11.8 | 0 | 43 | 136 |
| cafetera-de-filtro | cafetera de filtro | Genérico (alta comp.) | 2.900 | Pos 5.9 | 32 | 191 | 470 |
| cortadora-de-pelo | cortadora de pelo | Genérico (alta comp.) | 2.900 | Pos 7.7 | 6 | 98 | 282 |
| cepillo-de-dientes-electrico | cepillo de dientes electrico | Genérico (alta comp.) | 2.900 | STAGED | 0 | 1 | 57 |
| cerradura-inteligente | cerradura inteligente | Genérico (alta comp.) | 2.900 | STAGED | 0 | 1 | 57 |
| proyector-astronauta | proyector astronauta / galaxia | Cola/marca (viable) | 2.570 | Sin datos aun | 0 | 1 | 51 |
| joystick-para-celular | joystick para celular | Genérico (alta comp.) | 2.400 | Pos 9.6 | 2 | 61 | 158 |
| pava-electrica-peabody | pava electrica peabody | Cola/marca (viable) | 2.400 | Pos 7.6 | 8 | 81 | 234 |
| oster-freidoras-de-aire-review | freidora de aire oster | Cola/marca (viable) | 2.400 | Pos 7.2 | 0 | 113 | 234 |
| licuadora-de-mano | licuadora de mano | Cola/marca (viable) | 1.900 | Pos 6.8 | 2 | 89 | 185 |
| pava-electrica-liliana | pava electrica liliana | Cola/marca (viable) | 1.900 | Pos 5.7 | 0 | 125 | 308 |
| cafetera-de-capsulas | cafetera de capsulas | Genérico (alta comp.) | 1.900 | Pos 7.4 | 0 | 64 | 185 |
| cafetera-smartlife | cafetera smartlife | Cola/marca (viable) | 1.900 | Pos 6.2 | 18 | 89 | 308 |
| masajeador-electrico | masajeador electrico | Genérico (alta comp.) | 1.600 | Pos 9.4 | 1 | 41 | 105 |
| perfumes-arabes-mujer | perfumes arabes mujer | Cola/marca (viable) | 1.600 | Pos 9.1 | 127 | 127 | 127 |
| robot-aspiradora-roomba | roomba | Cola/marca (viable) | 1.600 | Pos 10.9 | 1 | 32 | 105 |
| yogurtera-daewoo | yogurtera daewoo | Cola/marca (viable) | 1.600 | Sin datos aun | 0 | 1 | 32 |
| depiladora-electrica | depiladora electrica | Genérico (alta comp.) | 1.600 | Pos 8.7 | 1 | 54 | 105 |
| kit-camaras-seguridad | kit de camaras de seguridad | Genérico (alta comp.) | 1.300 | Pos 11.6 | 1 | 19 | 61 |
| licuadora-atma | licuadora atma | Cola/marca (viable) | 1.300 | Pos 8.3 | 0 | 44 | 126 |
| pava-electrica-mercadolibre | pava electrica mercadolibre | Cola/marca (viable) | 1.300 | Pos 9.0 | 0 | 33 | 86 |
| camara-tplink-tapo | camara tp-link tapo | Cola/marca (viable) | 1.020 | Sin datos aun | 0 | 1 | 20 |
| auriculares-deportivos | auriculares deportivos | Genérico (alta comp.) | 1.000 | Pos 7.0 | 1 | 47 | 97 |
| pava-electrica-oster | pava electrica oster | Cola/marca (viable) | 1.000 | Pos 8.2 | 0 | 34 | 97 |
| gadnic-freidora-review | freidora de aire gadnic | Cola/marca (viable) | 1.000 | Pos 7.7 | 3 | 34 | 97 |
| robot-aspiradora-samsung | robot aspiradora samsung | Cola/marca (viable) | 1.000 | Pos 9.0 | 0 | 26 | 66 |
| cafetera-automatica | cafetera automatica | Genérico (alta comp.) | 1.000 | Pos 12.4 | 0 | 15 | 47 |
| bombilla-de-mate | bombilla de mate | Genérico (alta comp.) | 1.000 | Sin datos aun | 0 | 0 | 20 |
| kanji-home-freidora-review | freidora de aire kanji home | Cola/marca (viable) | 880 | Pos 7.7 | 0 | 30 | 86 |
| suono-airfryer-review | freidora de aire suono | Cola/marca (viable) | 880 | Pos 6.0 | 0 | 58 | 143 |
| robot-aspiradora-atma | robot aspiradora atma | Cola/marca (viable) | 880 | Pos 6.9 | 3 | 41 | 86 |
| cafetera-liliana | cafetera liliana | Cola/marca (viable) | 880 | Pos 6.0 | 1 | 58 | 143 |
| pava-electrica-vidrio | pava electrica de vidrio | Cola/marca (viable) | 720 | Pos 6.0 | 1 | 47 | 117 |
| pava-electrica-acero-inoxidable | pava electrica acero inoxidable | Cola/marca (viable) | 720 | Pos 7.4 | 9 | 24 | 70 |
| ninja-crispi-review | ninja crispi | Cola/marca (viable) | 590 | Pos 9.0 | 0 | 15 | 39 |
| masajeador-espalda-cuello | masajeador de espalda y cuello | Cola/marca (viable) | 390 | Pos 6.8 | 1 | 18 | 38 |
| accesorios-para-freidora-de-aire | accesorios para freidora de aire | Genérico (alta comp.) | 390 | Pos 8.2 | 0 | 13 | 38 |
| perfumes-arabes-originales | perfumes arabes originales | Cola/marca (viable) | 390 | Pos 7.3 | 2 | 13 | 38 |
| robot-aspiradora-xiaomi | robot aspiradora xiaomi | Cola/marca (viable) | 390 | Pos 8.2 | 12 | 13 | 38 |
| kit-gamer | kit gamer | Genérico (alta comp.) | 320 | Pos 7.2 | 0 | 15 | 31 |
| mejores-freidoras-de-aire-doble-canasta | freidora de aire doble canasta | Cola/marca (viable) | 320 | Pos 6.7 | 6 | 15 | 31 |
| como-usar-una-freidora-de-aire | como usar una freidora de aire | Cola/marca (viable) | 320 | Pos 7.6 | 0 | 11 | 31 |
| cuanto-consume-freidora-de-aire | cuanto consume una freidora de aire | Cola/marca (viable) | 320 | Pos 7.5 | 3 | 11 | 31 |
| perfumes-arabes-mas-vendidos-argentina | perfumes arabes mas vendidos | Cola/marca (viable) | 320 | Pos 5.9 | 97 | 97 | 97 |
| auriculares-profesionales | auriculares profesionales | Genérico (alta comp.) | 260 | Pos 6.1 | 0 | 12 | 42 |
| powerxl-freidora-review | freidora de aire powerxl | Cola/marca (viable) | 260 | Pos 10.6 | 0 | 5 | 17 |
| perfumes-arabes-precio-argentina | perfumes arabes precio | Cola/marca (viable) | 260 | Pos 7.2 | 5 | 12 | 25 |
| perfumes-arabes-dupes | dupes de perfumes arabes | Cola/marca (viable) | 260 | Pos 7.4 | 100 | 100 | 100 |
| freidoras-de-aire-con-grill-argentina | freidora de aire con grill | Cola/marca (viable) | 170 | Pos 7.2 | 1 | 8 | 17 |
| perfumes-arabes-amaderados | perfumes arabes amaderados | Cola/marca (viable) | 170 | Pos 7.4 | 22 | 22 | 22 |
| robot-aspiradora-precio-argentina | robot aspiradora precio | Cola/marca (viable) | 170 | Pos 8.1 | 0 | 6 | 17 |
| robot-aspiradora-gadnic | robot aspiradora gadnic | Cola/marca (viable) | 170 | Pos 8.9 | 10 | 10 | 11 |
| pava-electrica-control-temperatura | pava electrica con control de temperatura | Cola/marca (viable) | 90 | Pos 7.1 | 5 | 5 | 9 |
| mejores-freidoras-de-aire-economicas-argentina | freidora de aire economica | Cola/marca (viable) | 70 | Pos 15.4 | 1 | 1 | 2 |
| que-cafetera-comprar | que cafetera comprar | Genérico (alta comp.) | 70 | Pos 8.3 | 0 | 2 | 7 |
| donde-comprar-perfumes-arabes-argentina | donde comprar perfumes arabes | Cola/marca (viable) | 50 | Pos 7.9 | 3 | 3 | 5 |
| como-funciona-robot-aspiradora | como funciona un robot aspiradora | Cola/marca (viable) | 50 | Pos 8.5 | 0 | 2 | 5 |
| mejores-peluches-personajes-argentina | peluches de personajes | Cola/marca (viable) | 50 | Pos 6.9 | 0 | 2 | 5 |
| pava-electrica-pequena | pava electrica pequeña | Cola/marca (viable) | 40 | Pos 8.0 | 0 | 1 | 4 |
| horno-electrico-vs-microondas | horno electrico vs microondas | Cola/marca (viable) | 20 | Pos 8.2 | 1 | 1 | 2 |
| freidora-de-aire-desventajas | desventajas de la freidora de aire | Cola/marca (viable) | 20 | Pos 9.8 | 0 | 1 | 1 |
| masajeador-donde-comprar-argentina | donde comprar masajeador | Cola/marca (viable) | 10 | Pos 9.3 | 0 | 0 | 1 |
| mejores-masajeadores-argentina | mejores masajeadores | Genérico (alta comp.) | 10 | Pos 6.4 | 17 | 17 | 17 |
| freidoras-de-aire-gran-capacidad | freidora de aire gran capacidad | Cola/marca (viable) | 10 | Pos 9.7 | 1 | 1 | 1 |
| freidora-de-aire-vs-horno | freidora de aire vs horno | Cola/marca (viable) | 10 | Pos 6.2 | 1 | 1 | 2 |
| vale-la-pena-comprar-freidora-de-aire | vale la pena la freidora de aire | Cola/marca (viable) | 10 | Pos 12.8 | 1 | 1 | 1 |
| donde-comprar-perfumes-arabes-buenos-aires | donde comprar perfumes arabes en buenos aires | Cola/marca (viable) | 10 | Pos 7.0 | 17 | 17 | 17 |
| hy300-vs-hy320 | hy300 vs hy320 | Cola/marca (viable) | 10 | Pos 6.0 | 1 | 1 | 2 |
| liliana-vs-peabody-pava-electrica | liliana vs peabody pava electrica | Cola/marca (viable) | 0 | Pos 3.4 | 0 | 0 | 0 |
| atma-vs-peabody-freidora-de-aire | atma vs peabody freidora de aire | Cola/marca (viable) | 0 | Pos 5.7 | 13 | 13 | 13 |
| ninja-vs-philips-freidora-de-aire | ninja vs philips freidora de aire | Cola/marca (viable) | 0 | Pos 6.7 | 0 | 0 | 0 |
| perfumes-arabes-por-color | perfumes arabes por color | Cola/marca (viable) | 0 | Pos 8.2 | 5 | 5 | 5 |
| robot-aspiradora-con-mapeo-laser | robot aspiradora con mapeo laser | Cola/marca (viable) | 0 | Pos 9.5 | 0 | 0 | 0 |
| aspiradora-robot-gadnic-vs-xiaomi | gadnic vs xiaomi robot aspiradora | Cola/marca (viable) | 0 | Pos 4.3 | 22 | 22 | 22 |
| dia-del-nino-argentina | regalos dia del niño | Cola/marca (viable) | 0 | Pos 5.7 | 6 | 6 | 6 |

## Totales acumulados (corrida base 2026-07-26; +8 filas el mismo día: `termo-stanley`, `auriculares-sony`, `microondas-samsung`, `camara-ezviz`, `auriculares-xiaomi`, `proyector-astronauta`, `yogurtera-daewoo`, `camara-tplink-tapo`)

| Métrica | Valor |
|---|---:|
| Guías (159 publicadas + 6 STAGED) | 165 |
| Volumen sumado, publicadas (Keyword Planner AR) | 1.666.850 /mes |
| Clicks reales HOY (GSC, snapshot 27/6-24/7) | 1.519 /mes |
| Clicks estimados — realista 6-12 meses (bruto, sobreestima) | ≈ 64.053 /mes |
| Clicks estimados — techo optimista (bruto, sobreestima) | ≈ 165.472 /mes |
| **Clicks estimados — realista, solo cola/marca (número creíble)** | **≈ 10.295 /mes** |
| **Clicks estimados — techo, solo cola/marca (número creíble)** | **≈ 29.373 /mes** |

Ver "Corrección del mismo día" más arriba para por qué el bruto sobreestima
y cómo se llega al número de cola/marca.

### Por estado real (GSC)

| Estado | Guías | Volumen sumado | Hoy (real) | Realista | Techo |
|---|---:|---:|---:|---:|---:|
| Ya en el top 10 (pos ≤10) | 139 | 1.535.120 /mes | 1.513 | 63.884 | 162.577 |
| Visible pero floja (pos 11-30) | 8 | 19.240 /mes | 6 | 135 | 679 |
| Sin datos aún (nueva o STAGED) | 18 | 166.790 /mes | 0 | 50 | 3.286 |

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
