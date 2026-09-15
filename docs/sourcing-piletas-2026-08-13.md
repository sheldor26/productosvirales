# Sourcing piletas — 2026-08-13

Datos reales traídos con Bright Data (workflow "Scraper puntual", corridas
[31705438323](https://github.com/sheldor26/productosvirales/actions/runs/31705438323) y
[31705700858](https://github.com/sheldor26/productosvirales/actions/runs/31705700858)).
13 URLs scrapeadas, 9 utilizables. Precios y stock al 2026-08-13.

Sirve para el silo de verano (ver la ventana estacional abajo). NO copiar estos
precios a mano en la prosa: usar `{{precio:ID}}` como siempre.

## Inflables (segmento de entrada)

| ID | Producto | Cap. | Precio | Stock | Reseñas |
| :-- | :-- | --: | --: | :-- | --: |
| `MLA15550811` | Bestway 51024 verde 1,02 m | 101 L | $10.990 | +5 | 5 |
| ~~`MLA15550810`~~ | ~~Bestway 51024 rojo~~ | 101 L | $10.990 | +10 | 5 |
| `MLA828733034` | Bestway 51026 infantil | 282 L | $24.990 | +50 | 0 |
| `MLA20664028` | Intex 3 aros 1,47 m | 330 L | $29.517 | +5 | 5 |
| `MLA27804423` | Intex 3 anillos 1,5 m | 288 L | $32.920 | sin dato | 2 |

Los dos Bestway 51024 son el mismo modelo en distinto color y al mismo precio:
va uno solo a la guía, no dos entradas que simulan variedad.

**Por qué quedó el verde y no el rojo.** Al generar los links de afiliado, la
publicación roja (`MLA15550810`) devolvió "Esta URL no está permitida en el
Programa". Eso no se detecta al sourcear, solo al pedir el `meli.la`. Como el
verde es el mismo producto (mismo modelo 51024, misma capacidad, mismo precio) y
ML unifica las reseñas por catálogo, el swap no cambió ni un dato de la guía y
las citas siguen siendo válidas.

Dos diferencias reales entre las dos publicaciones, por si en algún momento hay
que volver: el rojo declaraba más stock (+10 contra +5) y el verde declara en su
ficha **"Accesorios incluidos: Kit de reparación"**, que el rojo no. Ese detalle
obligó a corregir la guía: decía que la Bestway 51026 era "la única con kit de
reparación" y con el verde adentro dejó de ser cierto.

## Estructurales Pelopincho

| ID | Producto | Cap. | Precio | Stock | Reseñas |
| :-- | :-- | --: | --: | :-- | --: |
| `MLA8961674` | Pelopincho 1043 rectangular 2,7x1,6 m | 2.800 L | $210.000 | sin dato | 0 |
| `MLA8961672` | Pelopincho 1055 rectangular 2x3 m | 4.500 L | $324.498 | +25 | 5 |
| `MLA21205956` | Pelopincho RD14 circular | 14.000 L | $1.172.133 | +50 | 5 |
| `MLAU3661578695` | Pelopincho RD14 XL circular | 14.000 L | $1.580.553 | +50 | 0 |

### Las dos RD14: verificado, es el mismo producto (2026-08-13)

`MLA21205956` ($1.172.133) y `MLAU3661578695` ($1.580.553) son la misma pileta.
Se compararon las dos fichas campo por campo:

- Specs idénticas: RD14, 14.000 L, 3,66 m de diámetro, 1,3 m de alto, 66,44 kg,
  armazón de acero inoxidable y PVC, con válvula de desagüe, edad mínima 5 años.
- Descripción idéntica, palabra por palabra (es el texto oficial de Pelopincho).
- Ninguna incluye bomba ni filtro: las dos los mencionan como recomendación de
  uso y ambas declaran "Incluye accesorios: No".

**No hay nada que justifique los $408.420 (35%) de diferencia.** Lo único que
cambia es la financiación y el tipo de publicación: la barata es de catálogo,
tiene 5 reseñas y ofrece 12 cuotas sin interés de $131.712; la cara es
publicación individual, sin reseñas, con 18 cuotas de $87.808 (cuota mensual 33%
más baja, total 35% más caro).

**Decisión: va `MLA21205956`. La cara NO entra a la guía** — serían dos entradas
del mismo producto simulando variedad, con la más cara puesta como si fuera una
alternativa legítima. Sí vale una línea en el cuerpo avisando que en ML hay
publicaciones de esta misma pileta hasta 35% más caras y que la diferencia es el
vendedor y el plan de cuotas, no el producto.

## Sin precio (probablemente pausadas)

`MLAU230841023` (1030, 1.500 L), `MLA1443457661` (1043, 2.800 L),
`MLA1198310879` (1030), `MLAU221605381` (1010, 500 L). Cuatro de ocho en la
primera tanda: es coherente con agosto, fin de temporada. Vale la pena
re-scrapearlas en octubre, cuando entre stock nuevo.

## Por qué ahora y no en octubre

La demanda de pileta arranca en octubre y pica entre diciembre y enero. Una guía
nueva en un dominio sin autoridad tarda entre 6 y 12 semanas en asentarse, así
que publicar en octubre es llegar a la temporada cuando ya terminó. Publicando
en agosto, la guía llega madura a la demanda real.

El costado incómodo de ese timing: hoy el stock está en su punto más bajo del
año (4 de 8 publicaciones de Pelopincho sin precio). La guía se escribe con lo
que tiene stock hoy y **el catálogo se revisa en octubre**, cuando los
vendedores reponen. No al revés.

## Volumen (Keyword Planner, AR)

| Keyword | Vol/mes |
| :-- | --: |
| pileta pelopincho (+ variantes) | 18.100 |
| piletas de lona | 14.800 |
| colchón inflable | 12.100 |
| sombrillas de playa | 6.600 |
| pileta bestway / pileta inflable | 3.600 + 3.600 |
| pileta redonda | 3.600 |
| pelopincho 1076 / pileta sol de verano | 2.900 + 2.900 |
| pileta intex | 1.600 |
| cloro para piletas | 1.000 |

El "HIGH" de competencia que devuelve Keyword Planner es puja publicitaria, no
dificultad SEO: el SERP orgánico de "pileta pelopincho" es 100% retailers
(Frávega, Megatone, Naldo, Coppel, ML, sitio oficial) sin un solo comparador
editorial. Mismo patrón que hizo ganable a `zapatero`.
