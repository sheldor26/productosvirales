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

### 1. La controladora de DJ tiene 880 búsquedas al mes, no 11-12k

La estimación previa de ~11-12k agregado a nivel modelo estaba inflada más de diez veces. Sumando `controlador dj` (880) y `dj controlador` (880, la misma consulta invertida), el techo real es de menos de mil.

Y la góndola tampoco acompaña: en el top de más vendidos de Equipos de DJ (MLA435173) **la Pioneer DDJ-FLX4 no aparece**. Lo que domina son bandejas Audio-Technica AT-LP60X, mixers de 4 y 8 canales y máquinas de humo. **Un sub-pilar de controladora de DJ queda descartado.**

### 2. El instrumento más vendido de todo el rubro es un ukelele de menos de $40.000

`MLA19176089` — Ukulele acústico soprano Parquer FZU-002 azul, **$38.903**, 4.7 estrellas, 1.541 opiniones. Es el **1º más vendido de Instrumentos Musicales** y también el 1º de Instrumentos de Cuerdas.

Cruza tres cosas a la vez: 14.800 búsquedas al mes (lo mismo que guitarra criolla), es el producto más vendido del rubro, y el catálogo del sitio no tiene ni uno. Sale menos de la mitad que la guitarra criolla más barata.

## La góndola real, por sub-rubro

### Guitarras (MLA417638): una sola marca

El top de más vendidos de Guitarras trae **cuatro productos y los cuatro son Musette/Femmto**:

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
