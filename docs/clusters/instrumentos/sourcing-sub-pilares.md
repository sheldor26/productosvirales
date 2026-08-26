# Sourcing para los sub-pilares del silo música

Verificado a mano en MercadoLibre Argentina el 2026-08-26, con el navegador de Juan (el navegador interno lo bloquea) y el Keyword Planner de Google Ads.

**Cómo se leyó cada dato.** Los listados de categoría (`listado.mercadolibre.com.ar/...`) **no renderizan**: el stream de React se cuelga y el body queda con header y footer nada más. Lo que sí funciona es `/mas-vendidos/<CAT_ID>`. Los precios salen de `meta[itemprop=price]` en la ficha de catálogo, nunca de un regex sobre el texto.

## IDs de categoría de MercadoLibre

| Categoría | ID |
|---|---|
| Instrumentos Musicales (raíz) | MLA1182 |
| Instrumentos de Cuerdas | MLA4611 |
| — Guitarras | MLA417638 |
| — — Acústicas | MLA4274 |
| — — Criollas | MLA2989 |
| — — Eléctricas | MLA4275 |
| — — Kits Guitarras y Amplificador | MLA455583 |
| — Ukeleles | MLA377642 |
| — Violines | MLA53801 |
| Teclados y Pianos | MLA2100 |
| Equipos de DJ y Accesorios | MLA435173 |
| Baterías y Percusión | MLA3024 |
| Instrumentos de Viento | MLA3005 |
| Pedales y Accesorios | MLA434786 |
| Micrófonos y Amplificadores | MLA434816 |
| Parlantes y Bafles | MLA434927 |
| Estudio de Grabación | MLA434917 |

## Volumen de búsqueda (Keyword Planner, Argentina, 2026-08-26)

| Keyword | Vol/mes | Competencia |
|---|---|---|
| guitarra electrica | 22.200 | HIGH 99 |
| **ukelele** | **14.800** | HIGH 92 |
| guitarra criolla | 14.800 | HIGH 100 |
| organo musical | 5.400 | HIGH 97 |
| teclado musical | 4.400 | HIGH 100 |
| piano electrico | 2.900 | HIGH 100 |
| guitarra criolla precio | 1.900 | HIGH 99 |
| teclado yamaha | 1.900 | HIGH 100 |
| teclado casio | 1.600 | HIGH 100 |
| piano digital | 1.000 | HIGH 89 |
| ukelele mercado libre | 1.000 | HIGH 100 |
| **controlador dj** | **880** | HIGH 100 |
| ukelele precio | 720 | HIGH 100 |

`bancos piano` devuelve 60.500 con competencia LOW 5 y `pian o` 33.100: son ruido del Planner, no se usan.

## Los dos hallazgos que dan vuelta la prioridad

### 1. En DJ la palabra argentina es "consola", y aun así el sub-pilar no va

La estimación previa de ~11-12k estaba inflada. Pero la primera medición de esta página también erró, por medir la palabra equivocada:

| Vocabulario | Vol/mes agregado |
|---|---|
| **consola** (consola dj 1.900 + consola de dj 880 + consola dj pioneer 390) | **3.170** |
| controladora (controladora dj 260 + controladores dj 110) | 370 |

**En Argentina se dice consola, no controladora**, por casi diez a uno. Ese dato se aplicó al pilar, que ahora nombra las dos formas.

Aun así el sub-pilar **no se hace**, y la razón no es la góndola. La categoría Controladores (`MLA435204`) tiene Pioneer DJ (216 publicaciones), Hercules (239), Roland (82), Numark (58) y Behringer (52), de $239.994 a $7.471.344: alcanza y sobra. La razón es el SERP.

**La dificultad está invertida:** en la cabeza la SD es baja (consola dj 8, controladora dj 7) pero los primeros 20 resultados son todos catálogo de tienda, sin una sola pieza editorial y sin AI Overview. En la cola editorial la SD **sube** a 36-44, que es donde pelean Reddit, Red Bull y la guía del propio Pioneer. Cuando la cola es más difícil que la cabeza, el SERP no quiere un documento: quiere un catálogo. Es exactamente la pelea que ya se perdió en perfumes árabes.

Y el pilar ya tiene adentro casi una página de DJ: h3, product-card, dos párrafos, el aviso de la fuente de 9 V, el quickPick, la fila de tabla y la pregunta frecuente de la notebook.

**Dos datos que sí sirven, aunque el sub-pilar no se haga:** existe la **Pioneer DDJ-FLX2** (`MLA45220958`) a **$383.922** (4.8, 121 opiniones) y la **Numark DJ2GO2 Touch** (`MLA15553082`) a **$239.994** (4.7, 135 opiniones). O sea que la DDJ-FLX4 de $812.242 que tiene el catálogo no es la puerta de entrada al DJ, es bastante más que eso. El pilar ahora lo aclara.

### 2. El instrumento más vendido de todo el rubro es un ukelele de menos de $40.000

`MLA19176089` — Ukulele acústico soprano Parquer FZU-002 azul, **$38.903**, 4.7 estrellas, 1.541 opiniones. Es el **1º más vendido de Instrumentos Musicales** y también el 1º de Instrumentos de Cuerdas.

Cruza tres cosas a la vez: 14.800 búsquedas al mes (lo mismo que guitarra criolla), es el producto más vendido del rubro, y el catálogo del sitio no tiene ni uno. Sale menos de la mitad que la guitarra criolla más barata.

## La góndola real, por sub-rubro

### Guitarras: el top de más vendidos engaña

**Corrección importante.** La primera lectura de esta página decía que la góndola de guitarras "la domina una sola marca". Era falso, y el error fue de método: se miró solo `/mas-vendidos/MLA417638`, que devuelve cuatro productos. El listado completo cuenta otra cosa.

**Criollas** (`.../guitarras/criollas/nuevo/`): **4.810 publicaciones nuevas**, con Gracia (546), Fonseca (471), La Alpujarra (288), **Yamaha (273)**, Rómulo García (211), Parquer (81), Gadnic (18), Fender (10), Femmto (5).

**Eléctricas** (MLA4275): el listado declara **+9.999 resultados** (tope de la interfaz), con Epiphone (1.104), Ibanez (1.094), **Fender (656)**, Cort (477), SX (404), Yamaha (228), Gibson (222), Jackson (166).

O sea: **las marcas internacionales sí están en MercadoLibre Argentina, y con volumen.** Lo que pasa es que no son las más vendidas: el top de ventas lo ocupan las marcas de entrada porque son las baratas. Verificado a mano: la **Yamaha C40** (`MLA16059072`) sale **$389.700**, tiene 4.8 estrellas y **633 opiniones** — más de cuatro veces la criolla Femmto del catálogo.

Esto obligó a corregir una pregunta frecuente del pilar, que decía que en el tramo de entrada aparecen "marcas económicas, no las que uno tiene en la cabeza".

El top de más vendidos, para referencia:

| MLA | Producto | Precio | Rating | Opiniones |
|---|---|---|---|---|
| MLA19491306 | Electroacústica Femmto EAG003 | $112.714 | 4.5 | 3.842 |
| MLA40485883 | Criolla Femmto CG001 | $89.999 | 4.6 | 1.348 |
| MLA17485251 | **Acústica AG002** (no la tenemos) | $96.880 | 4.7 | +1000 vendidos |
| MLA17375288 | **Eléctrica EG001 negra** (no la tenemos) | $191.384 | 4.7 | 1.665 |

Un sub-pilar de guitarra criolla o de guitarra eléctrica tendría que comparar variantes de una misma marca. Se puede, pero es una guía más pobre.

### La misma eléctrica tiene dos fichas de catálogo, con $78.615 de diferencia

| | MLA25602058 (la que tenemos) | MLA17375288 |
|---|---|---|
| Color | Azul | Negro |
| Precio | $269.999 | **$191.384** |
| Opiniones | 3.475 | 1.665 |
| Rating | 4.7 | 4.7 |
| Incluye estuche | **Sí** | **No** |

Mismo modelo EG001, mismos 22 trastes, 3 micrófonos, escala de 650 mm y diapasón de MDF. Lo único que cambia en la ficha técnica es el estuche. **$78.615 por un estuche de guitarra de entrada es material editorial de primera**, y la guía actual manda a la cara sin mencionar que existe la otra.

### Teclados y pianos (MLA2100): la mejor góndola del rubro

18 productos en el top, con marcas que la gente reconoce y un rango de $66.000 a $488.000:

| MLA | Producto | Precio | Rating |
|---|---|---|---|
| MLA44710176 | **Yamaha PSR-E383** 61 teclas | $487.890 | 4.9 |
| MLA16107361 | **Casio CTK-3500** 61 teclas | $357.570 | 4.8 |
| MLA16109682 | **Casio Casiotone CT-S100** 61 teclas | $291.396 | 4.9 |
| MLA24603460 | **Arturia MiniLab 3** controlador MIDI | $170.490 | 4.9 |
| MLA19783696 | Parquer K186BK sensitivo 61 teclas | $167.268 | 4.8 |
| MLA22991652 | Parquer sensitivo 5 octavas | ~$17x.000 | 4.7 |
| MLA20725089 | Parquer 54 teclas principiante | ~$11x.000 | 4.8 |
| MLA19931801 | Gadnic 61 teclas 200 ritmos | $131.149 | 4.4 |
| MLA63579452 | Dyvan T61 61 teclas | $78.790 | 4.5 |
| MLA47420971 | Dakota 61 teclas | ~$75.600 | 4.5 |
| MLA19783697 | Gadnic 54 teclas | ~$66.000 | 4.5 |

Es el único sub-rubro donde aparecen **Yamaha, Casio y Arturia**. La premisa de que las marcas internacionales no se consiguen vale para guitarras, no para teclados.

### Otros candidatos vistos en el camino

| MLA | Producto | Precio | Rating | Nota |
|---|---|---|---|---|
| MLA25728563 | Flauta dulce **Yamaha** YRS23 | $14.000 | 4.9 | +10mil vendidos |
| MLA45178842 | Flauta melódica Ramallo Lincoln 32 notas | $39.275 | 4.9 | +1000 vendidos |
| MLA47090748 | Melódica Leonard 32 teclas | $37.890 | 4.8 | +1000 vendidos |
| MLA21868235 | Encordado clásica **D'Addario** EJ27N | $33.761 | 4.8 | +10mil vendidos |
| MLA21272052 | Encordado **Ernie Ball** Regular Slinky | $19.995 | 4.8 | +10mil vendidos |
| MLA34010611 | Controlador MIDI **Akai** MPK Mini MK2 | $224.263 | 4.9 | +500 vendidos |
| MLA49647360 | Criolla Rosalila 4/4 3/4 1/2, zurdos | $132.999 | — | cubre zurdos y chicos |
| MLA77260613 | Funda acolchada para criolla | $20.175 | 4.8 | el accesorio que falta |

## Precios verificados de las cinco fichas que ya tenemos

| MLA | Catálogo del sitio | MercadoLibre hoy | |
|---|---|---|---|
| MLA40485883 criolla | $89.999 | $89.999 | coincide |
| MLA19491306 electroacústica | $112.714 | $112.714 | coincide |
| MLA25602058 eléctrica | ~~$199.374~~ | **$269.999** | **corregido** |
| MLA23145920 Pioneer | $812.242 | $812.242 | coincide |
| MLA19464828 M-Vave | $87.139 | $87.139 | coincide |

Las cinco con stock disponible, ninguna pausada.

## Lo que falta de Juan

Nada de esto se puede convertir en ficha sin los links `meli.la`, que salen de su panel de afiliados. Los candidatos por orden de prioridad están más abajo, en el plan.

---

# El plan: dos sub-pilares, no tres

Cruce de las mediciones de keywords, la góndola verificada y la canibalización contra el pilar y las otras 210 guías.

## 1º — Guitarra criolla

**Slug sugerido:** `/guias/musica/guitarra-criolla-precio`
**Keyword principal:** `guitarra criolla precio` (1.900/mes, SD 8), con el H1 escrito como la pregunta rioplatense: **"cuánto sale una guitarra criolla"** (260/mes, SD 7).

Va primera porque gana en los dos criterios que pesan más que el volumen bruto:

- **El SERP no tiene muro de autoridad.** En "cuánto sale una guitarra criolla" rankean sonidosmdp.com.ar con **DA 1**, antiguacasanunez con DA 5, freemusic con DA 9, musicshaker y audiorosario con DA 11. Con DA 1 y sin backlinks, es el único SERP del silo donde eso no es una condena.
- **El hueco editorial está probado por ausencia.** El único competidor editorial del rubro, therockstore.com.ar (DA 15, con sección de guías), rankea sexto en "diferencia entre guitarra acústica y criolla" y **su guía no da precios**. Google está sirviendo páginas de categoría a una pregunta, porque no hay nada mejor.

**El formato que gana es "cuánto sale", no "cuál comprar".** La familia de precio suma ~3.400/mes con SD 7-9. Todo el racimo "mejor / cuál comprar" junto no llega a 400/mes y tiene el SD más alto del sub-rubro (21-36).

**Dónde está la plata:** la cola de accesorios y repuestos suma **~5.400/mes** con SD 6-12 y `paid_difficulty` 87-100 (anunciantes pagando = intención de compra real): cuerdas ~1.860, clavijas 480, funda ~650, encordado 320, correa 210, micrófono 210. Encaja exacto con el ángulo que el pilar ya prometió.

**Trampas a esquivar:** el head "guitarra criolla" (14.800) está diluido 2.500-3.000/mes por tarea escolar (dibujo, partes, acordes, notas, png). "Guitarra criolla eléctrica" tiene 720/mes pero **SD 44**, el salto más grande del sub-rubro. Y "afinador de guitarra criolla" (1.000/mes) parece oro y no lo es: esa familia la domina la intención de afinador online gratis, el SERP lo ganan web apps.

**Timing:** el head hace pico en noviembre (22.200) y piso en febrero (12.100). Es compra de regalo de fin de año. Si sale STAGED ahora, llega indexado al pico.

**Candidatos verificados a mano** (falta el `meli.la` de cada uno):

| MLA | Producto | Precio |
|---|---|---|
| MLA16059072 | **Yamaha C40** — 4.8, 633 opiniones | $389.700 |
| MLA44345937 | Fonseca 25 Op Libertella | $224.627 |
| MLA68992218 | Rómulo García A100 Plus + accesorios | $149.531 |
| MLA47118056 | Parquer electrocriolla con ecualizador | $140.259 |
| MLA35245846 | Gadnic + estuche de transporte | $105.139 |
| MLA25482706 | Parquer niño, principiante con funda | $87.308 |
| MLA77260613 | Funda acolchada (accesorio) | $20.175 |
| MLA21868235 | Encordado D'Addario EJ27N (accesorio) | $33.761 |
| — | Femmto CG001, **ya en el catálogo** | $89.999 |

## 2º — Guitarra eléctrica

**Slug sugerido:** `/guias/musica/guitarra-electrica-precio`
**Keyword principal:** `guitarra electrica precio` (590/mes, SD 9), H1 como **"cuánto sale una guitarra eléctrica en Argentina"** (260/mes, SD 8).

Dato de vocabulario: en argentino **"cuánto sale" (260) le gana a "cuánto cuesta" (90) y "cuánto vale" (70) juntos**, y encima "cuánto cuesta" tiene SD 34 contra SD 8. Cuatro veces más difícil por decirlo distinto.

Va segunda pese a tener más volumen bruto (22.200) por dos motivos:

1. **Hay un lío de catálogo que resolver antes de escribir.** La EG001 tiene dos fichas: la azul (la nuestra) a $269.999 con estuche, y la negra `MLA17375288` a $191.384 sin estuche, que es la Nº1 más vendida de la categoría eléctricas.
2. La poda del pilar es acá la más quirúrgica de todo el silo.

**El spoke más limpio del silo:** `tipos de guitarra electrica`, 720/mes, SD 11, con el `paid_difficulty` más bajo del barrido (54). Verificado por grep: Stratocaster, Les Paul, Telecaster, SG, humbucker y single coil **no aparecen en ninguna de las 211 guías ni en ninguna de las 530 fichas**.

**Trampas:** el formato "cuál comprar" es volumen de juguete con dificultad de cabeza (mejor guitarra eléctrica 30/mes SD 43, barata 70/mes SD 44, kit 40/mes SD 44). Y "guitarra eléctrica con amplificador" (590/mes) tiene SD 36, cuatro veces el resto de su familia: va como sección adentro, nunca como eje.

**Candidatos:** MLA17375288 (EG001 negra), MLA17488700 (Jackson JS11 Dinky $432.918), MLA17473751 (Epiphone Les Paul Melody Maker $464.899), MLA18068441 (Epiphone SG Special), MLA17469502 (Ibanez GRX40), MLA40731408 (Parquer ST300 $281.148).

## 3º — Ukelele, en el lugar que iba a ocupar DJ

14.800/mes, lo mismo que guitarra criolla. Es el **producto Nº1 más vendido de todo Instrumentos Musicales** y el catálogo no tiene ni uno. `MLA19176089`, Parquer FZU-002, $38.903, 4.7 con 1.541 opiniones.

## La poda del pilar, y cuándo hacerla

El pilar canibaliza a sus propios sub-pilares en cinco puntos de gravedad alta. **El recorte va en el MISMO commit que la publicación de cada sub-pilar**, ni antes ni después, o el pilar queda un rato sin respuesta de precio o contradiciendo a su hija.

| Pieza del pilar | Qué hacer |
|---|---|
| h2 `Cuánto cuesta empezar` | **El recorte que hay que hacer sí o sí.** Son cuatro bullets con token de precio por instrumento: es literalmente la versión corta de las dos guías que se van a escribir. |
| FAQ `¿Cuánto sale empezar a tocar en Argentina?` | **Re-apuntar, no borrar.** Borrarla es regalar el slot de AI Overview. Cambia la respuesta, no la pregunta. |
| h3 `Guitarra eléctrica Femmto EG001 con amplificador` | **Renombrar** a `Guitarra eléctrica Femmto EG001`. El h3 actual es la keyword "guitarra eléctrica con amplificador" (590/mes) escrita letra por letra en un encabezado. |
| h3 `Tercero, cuánto podés sumarle al precio` | Fusionar con el h2 de precio: es la tercera vez que la misma página habla de plata. |
| h3 de la criolla + su callout de los dos datos que no cierran | Recortar a product-card + un párrafo. El callout es contenido de nivel modelo. |
| h3 del pedal M-Vave | Recortar a product-card + un párrafo. |
| h2 `Lo que vas a tener que comprar aparte` | **No se borra**, es el ángulo prometido desde el ogDescription. Se despoja: cada bullet en un renglón genérico, sin marca ni precio. |
| h2 `Criolla, acústica o eléctrica` | **No se toca nada.** Es la keyword propia y exclusiva del pilar ("diferencia entre guitarra acústica y criolla", 320/mes, SD 6), la única del silo con SERP editorial real. |
| FAQ `¿Qué diferencia hay entre criolla y acústica?` | Tampoco se toca, por lo mismo. |
| FAQ `¿Una guitarra eléctrica suena sin amplificador?` | Se queda en el pilar y se le **prohíbe** al sub-pilar. Pero bajar la redundancia: hoy la misma afirmación aparece en cinco lugares. |
| Todo lo de DJ | **No se recorta**, porque el sub-pilar de DJ no va a existir. |
| h2 `Por qué no están el teclado, el bajo ni la batería` | Re-apuntar: es el lugar natural para que el pilar enlace hacia abajo. |

## Riesgos anotados

- **Stock fino.** 22 de las 68 tarjetas de la primera página de criollas (32%) traen cartel de últimas unidades. Gracia M3 con 2 disponibles, Famusic con 2, Parquer electrocriolla con 3. Solo cinco candidatos aguantan las semanas que tarda una guía en madurar.
- **Precios inflados confirmados.** `MLA27868425` es la **misma** Femmto CG001 (misma familia de catálogo, mismas 1.348 opiniones) publicada a **$500.000** contra los $89.999 de la nuestra. Es el patrón del vendedor sin stock que evita que ML le pause la publicación.
- **Las 4.810 publicaciones no son 4.810 productos.** La Yamaha C40 aparece al menos cinco veces con precios distintos ($389.700 / $417.591 / $477.000) y la Rómulo García A-100 otras cinco. Al armar la tabla hay que chequear que no sea el mismo modelo repetido.
- **En eléctrica, descuentos declarados de 51% a 63%.** No usar el precio de lista ni el porcentaje como ancla.
- **Ningún check del repo agarra canibalización.** El tipo `Guide` no tiene campo de keyword: la única forma de detectar que un sub-pilar duplica el h2 de su pilar es leyendo el texto. Los nueve checks y el build pasan igual.
