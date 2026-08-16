# Alto ticket (+$1M) — barrido de ideas, 2026-08-16

Objetivo: encontrar rubros donde el producto supere el millón de pesos, para que una sola
conversión pese lo que hoy pesan varias. La lógica no es reemplazar el catálogo de $200.000 sino
**sumar tiros al arco con premio grande**.

Y hay un argumento de fondo que es mejor que el de la comisión: **nadie gasta un millón de pesos
por impulso.** Esa compra se investiga durante semanas, se comparan modelos, se busca "cuál
conviene". Es exactamente el tipo de búsqueda que una guía comparativa con contras honestas gana,
y donde una ficha de producto barato no aporta nada porque el comprador ya decidió antes de buscar.

## Lo que NO funcionó, y por qué importa

**`/mas-vendidos` no sirve para encontrar productos caros.** Ordena por unidades vendidas, y lo
caro vende pocas unidades por definición. Verificado en 10 categorías:

| Categoría | Producto más caro del top 20 | Sobre $1M |
| :-- | --: | --: |
| Televisores | — | 0 |
| Celulares | — | 0 |
| Refrigeración (heladeras) | $131.666 | 0 |
| Lavado (lavarropas) | $233.982 | 0 |
| Climatización (aires) | $213.333 | 0 |
| Fitness y musculación | $73.158 | 0 |
| Drones | $193.541 | 0 |
| Camas y colchones | $101.823 | 0 |
| Teclados y pianos | $109.767 | 0 |
| Notebooks | $1.071.154 | **1** |

**El listado con filtro de precio tampoco.** `listado.mercadolibre.com.ar/...&_PriceRange_1500000-0`
carga el HTML (522 KB) pero el grid de productos no hidrata y el payload no trae los datos: 0
productos extraíbles. Es el mismo bloqueo que ya conocíamos del buscador.

**Conclusión de método:** para el segmento caro hay que verificar producto por producto en su
página `/p/MLA` (que sí renderiza) o con Bright Data. No hay atajo de descubrimiento masivo.

## Demanda medida (Keyword Planner, Argentina, 2026-08-16)

Ojo con la columna de competencia: es **competencia publicitaria de Google Ads, no dificultad
SEO**. Que diga HIGH significa que hay anunciantes pujando, o sea que el rubro tiene valor
comercial. No dice nada sobre si el SERP orgánico es ganable.

### Grupo A — encajan con lo que este sitio ya sabe ganar

El patrón que funcionó con zapatero, conservadora y estantería flotante: **objetos aburridos,
caros, que se investigan, y sobre los que nadie escribió una comparativa**.

| Keyword | Vol/mes | Comp. Ads | Por qué encaja |
| :-- | --: | :-- | :-- |
| **lavavajillas** | 18.100 | HIGH | Volumen alto, compra muy meditada, y en Argentina está poco cubierto editorialmente. El mejor candidato del barrido |
| **jacuzzi** | 14.800 | **MEDIUM** | Caro sin discusión, se investiga muchísimo, y la competencia publicitaria es media. Sumado a `hidromasaje` (2.400) da 17.200 |
| **compresor de aire** | 14.800 | HIGH | Rubro técnico y aburrido. El comprador compara caudal, litros y HP: es una guía de tabla comparativa de manual |
| **soldadora inverter** | 9.900 | HIGH | Igual que arriba: técnico, se investiga, cero glamour |
| **cuatriciclo** | 9.900 | **LOW** | La anomalía del barrido: volumen alto con competencia publicitaria baja |
| **generador eléctrico** | 5.400 | HIGH | Con los cortes de luz argentinos es compra pensada. Muy técnico |
| **termotanque solar** | 5.400 | HIGH | Caro, técnico, y conecta con la guía de termotanque que ya existe |
| **caja fuerte** | 4.400 | HIGH | Aburrido, se investiga, y el segmento alto pasa el millón |
| **multigimnasio** | 2.400 | HIGH | Caro, ocupa lugar, se piensa mucho antes de comprar |
| **hidrolavadora industrial** | 2.900 | HIGH | Ojo: `hidrolavadora` a secas está marcada ROJA en el barrido del 2026-08-15 (la tiene mejorescompras.com.ar). "Industrial" es otra intención y otro SERP, hay que chequearlo aparte |

### Grupo B — volumen enorme pero probablemente inganable con DA 1

| Keyword | Vol/mes | Por qué desconfiar |
| :-- | --: | :-- |
| iphone 16 | 135.000 | El SERP más disputado de Argentina. Frávega, Claro, Personal, Movistar, más medios internacionales |
| iphone 16 pro max | 74.000 | Igual |
| playstation 5 | 49.500 | Igual |
| bicicleta eléctrica | 22.200 | **Ya tenemos guía publicada.** No es idea nueva |
| macbook air / notebook gamer | 8.100 / 6.600 | Reviews internacionales dominan |
| smart tv 65/75 pulgadas | 3.600 / 2.900 | Retail puro |

Esto no es un "no" definitivo, pero con DA 1 y sin backlinks, meterse ahí es quemar semanas. El
propio barrido del 2026-08-15 ya mostró que los rubros con electrónica o motor están tomados.

### Grupo C — anafe eléctrico, un caso raro

`anafe eléctrico` da **18.100/mes**, que es muchísimo para lo que es. Pero un anafe eléctrico
común está bastante por debajo del millón, así que no cumple el filtro salvo en el segmento de
empotrables premium. Vale como guía por volumen, no por ticket.

## Lo que falta verificar antes de escribir una sola línea

Son dos cosas, y ninguna está hecha:

1. **Que existan productos sobre $1M con stock real en ML** para cada rubro del Grupo A. No se
   pudo automatizar por lo explicado arriba. Se resuelve entrando a mano a 5-6 fichas por rubro,
   o con Bright Data cuando esté la sesión autenticada.
2. **El SERP**, con el criterio que ya usamos: buscar competidores argentinos con formato "los
   mejores X", y confirmar que **MercadoLibre aparece en la primera página**. Un SERP limpio de
   comparadores pero dominado por tiendas propias no sirve, como pasó con matera y con dispenser
   de agua.

## Una advertencia sobre la comisión

Vale la pena que lo mires en el panel de afiliados antes de invertir semanas: **las comisiones de
ML suelen estar topeadas y varían por categoría**, y los rubros de ticket alto (electro,
tecnología) suelen pagar porcentajes más bajos que belleza o deco. Puede pasar que un producto de
$1,5M deje menos que tres de $200.000. No cambia la lógica de sumar tiros al arco, pero sí cambia
cuál rubro conviene atacar primero.

---

# Cruce con Ubersuggest — mismo día

Ubersuggest **confirma exacto** los volúmenes de Keyword Planner (jacuzzi 14.800, lavavajillas
18.100, cuatriciclo 9.900, compresor 14.800). Las dos fuentes coinciden, así que el volumen no está
en discusión.

Lo que suma Ubersuggest y Keyword Planner no da: **dificultad SEO real** y **quién rankea**. Eso
cambió el orden de prioridades respecto de la primera pasada, que estaba armada solo por volumen.

## Dificultad SEO (0-100)

| Keyword | Vol | **SD** | Estacionalidad |
| :-- | --: | --: | :-- |
| jacuzzi | 14.800 | **14** | Pico **enero 22.200**, piso abril-junio 12.100 |
| lavavajillas | 18.100 | 15 | Plano todo el año |
| compresor de aire | 14.800 | **14** | Plano todo el año |
| cuatriciclo | 9.900 | **14** | Pico **enero 22.200**, piso junio 6.600 |
| soldadora inverter | 9.900 | **12** | Plano |
| generador eléctrico | 5.400 | 17 | Leve pico invierno |
| caja fuerte | 4.400 | **9** | Plano |

Todas por debajo de 20. Para un sitio con DA 1 eso es terreno jugable.

## Los SERP, que es lo que decide

### Jacuzzi — VERDE, el mejor del barrido

- **MercadoLibre es #1** con 4.040 clicks estimados. Pasa el filtro de "¿está ML en el SERP?"
- **Cero comparadores editoriales argentinos.** El único contenido editorial es Leroy Merlin
  **España** en la posición 11
- **`hidromasajesdeluxe.com.ar` rankea #8 con DA 1.** Es la prueba más fuerte de que el SERP es
  blando: un dominio con la misma autoridad que la nuestra ya está en página 1
- El resto son tiendas D2C chicas (DA 13, 22, 23) e Instagram

**Cluster completo:** jacuzzi 14.800 + jacuzzi inflable 3.600 (SD 13) + jacuzzi exterior 2.400
(SD 11) + hidromasaje 2.400 = **23.200/mes**.

**Timing:** el pico es enero. Publicar en agosto da los 4-5 meses que un dominio sin autoridad
necesita para asentar una URL, igual que se hizo con el silo de pileta.

**Dos salvedades reales:**
1. **"Jacuzzi" es marca registrada.** Jacuzzi Argentina (Arredobagno) rankea #5 con su sitio. No
   impide escribir una comparativa, pero conviene apoyarse en **"hidromasaje"** como término
   genérico y no dar a entender relación con la marca.
2. El long tail tiene intención hotelera (`hotel con jacuzzi` 1.300, `hotel con jacuzzi en
   habitación` 1.000, `hotel jacuzzi en córdoba` 880). No contamina el término principal, porque
   no hay un solo hotel en el top 10, pero hay que evitar esas variantes al elegir sub-temas.

### Compresor de aire — VERDE

- Frávega #2, **MercadoLibre #3** ✓
- **`gemeloferreteria.com.ar` rankea #5 con DA 1** y 908 clicks estimados. Segunda prueba de SERP
  blando en el barrido
- `casadani.com.ar` (DA 14) en el #10
- Cero comparadores editoriales
- Evergreen, sin estacionalidad

### Cuatriciclo — AMARILLO, con un riesgo que puede matarlo

- **MercadoLibre #1** con 4.950 clicks ✓
- SERP dominado por concesionarias con DA 12 a 29. Blando
- Un solo competidor editorial y débil: `motos0km.com.ar` en #13 con 7 clicks estimados
- Pico enero 22.200

**El riesgo:** es un vehículo, y los programas de afiliados de MercadoLibre suelen **excluir
vehículos**. Si los cuatriciclos están excluidos, no hay comisión posible y la idea muere entera.
**Verificar eso ANTES de escribir una línea**, generando un meli.la de prueba sobre una publicación
de cuatriciclo. Es el mismo tipo de chequeo que ya nos pasó con una publicación excluida en otro
rubro.

### Lavavajillas — se cae, y era mi favorito por volumen

En la primera pasada lo puse primero solo por sus 18.100/mes. El SERP lo desmiente:

- **MercadoLibre está recién #4** (1.320 clicks), muy por debajo de `drean.com.ar` en #2 con
  **7.057 clicks estimados**
- El top lo ocupan las **marcas con sus propios sitios**: Drean, Whirlpool, Bosch, BGH
- Más retail grande: Megatone (DA 48), Frávega (DA 57)

Es exactamente el patrón que ya nos hizo descartar **matera** y **dispenser de agua**: un SERP
dominado por D2C donde ML queda relegado. Ahí el clic de afiliado no tiene a dónde ir.

## Orden recomendado, corregido

| # | Rubro | Por qué |
| --: | :-- | :-- |
| 1 | **Jacuzzi / hidromasaje** | SD 14, ML #1, un DA 1 ya rankea en página 1, cluster de 23.200 y el pico es en enero |
| 2 | **Compresor de aire** | SD 14, ML #3, otro DA 1 rankeando, evergreen, cero editorial |
| 3 | **Soldadora inverter** | SD 12, el más bajo del barrido. Falta chequear SERP |
| 4 | **Caja fuerte** | SD 9, el más bajo de todos. Volumen chico (4.400) pero ticket alto |
| 5 | **Cuatriciclo** | SERP ideal, pero **primero verificar que no esté excluido del programa** |
| — | ~~Lavavajillas~~ | Descartado por SERP: marcas D2C dominan y ML queda #4 |

Sigue pendiente lo mismo que antes, y es lo que ninguna herramienta de keywords puede responder:
**confirmar que existan productos sobre $1M con stock real en ML** para cada rubro.

---

# Investigación profunda — segunda vuelta

Se midieron 46 rubros nuevos con Keyword Planner, se sacó dificultad SEO real de los mejores con
Ubersuggest, se corrieron 7 análisis de SERP y se verificaron precios en fichas reales de ML.

## El hallazgo que condiciona todo lo demás

Arriba del millón de pesos, **los productos casi no tienen reseñas**. Medido sobre las 569 fichas
del propio catálogo del sitio:

| Tramo de precio | Productos | Reseñas (mediana) |
| :-- | --: | --: |
| $0 a $50.000 | 180 | 717 |
| $50.000 a $150.000 | 194 | **1.126** |
| $150.000 a $400.000 | 116 | 1.002 |
| $400.000 a $1.000.000 | 57 | 184 |
| **Más de $1.000.000** | 22 | **56** |

La mediana se derrumba de 1.126 a 56 al cruzar el millón. Veinte veces menos. Y no es teoría: el
sitio ya tiene 22 fichas arriba del millón. Los tres más caros del catálogo tienen 11, 5 y 427
reseñas.

Verificado también en vivo: un jacuzzi de **$2.991.735** en MercadoLibre tiene **1 opinión y 2
vendidos**.

**Por qué importa tanto:** el método editorial de este sitio se apoya en reseñas reales para
escribir las contras honestas. Cada guía cita compradores. Con 56 reseñas de mediana, y varios
productos con menos de 15, ese material no existe en el segmento caro.

**No es un bloqueante, es un cambio de método.** La sesión de hoy probó por dónde va la salida: el
mejor material de la guía de estantería flotante no salió de las reseñas sino de **verificar contra
el fabricante** (los 10 kg que dependen de tu pared) y de **lo que la ficha de ML esconde** (el
espesor cargado 10x, el "formato: unidad" en un combo de tres). Las cuatro guías de hoy tuvieron su
mejor ángulo ahí, no en las opiniones.

Para alto ticket entonces: menos cita de comprador, más verificación de specs, más "esto la
publicación no te lo dice", más historial de precio. Y decir cuántas opiniones tiene cada producto,
como ya se hizo con la Global RGB (9) y con Urbana Fábrica (40).

## Rubros nuevos medidos

Los que superan 5.000/mes y son plausiblemente de ticket alto:

| Keyword | Vol/mes | Comp. | Nota |
| :-- | --: | :-- | :-- |
| hidrolavadora | 40.500 | HIGH | Ya marcada ROJA el 2026-08-15 |
| impresora 3d | 33.100 | HIGH | La mayoría por debajo del millón |
| ups | 33.100 | **LOW** | Idem: las de ticket alto son industriales |
| bomba presurizadora | 22.200 | HIGH | Casi todas por debajo del millón |
| desmalezadora | 18.100 | HIGH | Idem |
| heladera exhibidora | 14.800 | HIGH | **SD 53, muy duro** |
| horno pizzero | 14.800 | HIGH | Comercial, sí supera el millón |
| tanque de agua | 14.800 | HIGH | Por debajo del millón |
| paneles solares | 12.100 | HIGH | **SD 29.** Kit completo sí supera el millón |
| salamandra a leña | 12.100 | HIGH | **SD 11**, el más bajo del barrido |
| pileta de fibra | 12.100 | HIGH | **SD 44, muy duro.** Y pico enero de 40.500 |
| grupo electrógeno | 9.900 | HIGH | Sí supera el millón |
| sauna | 8.100 | **MEDIUM** | Sí supera el millón |

## SERP de los finalistas

### Salamandra a leña — el mejor SERP del barrido, pero falla el filtro de precio

- **puntoparrilla.com rankea #1 con DA 17** y 5.038 clicks estimados
- **misparrillas.com.ar #2, también DA 17**
- MercadoLibre #3
- Cero comparadores editoriales. Dos videos de YouTube en el top 15 respondiendo justo la pregunta
  que nadie contesta por escrito: "simple y doble combustión, experiencia personal"
- SD 11, y el pico es **junio con 49.500** contra 6.600 ahora

Dos dominios con DA 17 ocupando el 1 y el 2 es la señal más fuerte de SERP blando de todo el
barrido. **Pero los precios rondan $350.000 a $750.000**, así que no cumple el filtro de +$1M salvo
en modelos premium puntuales. Queda como la mejor oportunidad de SEO del barrido y la peor por
ticket.

### Jacuzzi — el mejor equilibrio, y el precio está confirmado

- ML #1 con 4.040 clicks, cero comparadores argentinos, `hidromasajesdeluxe.com.ar` en #8 **con DA 1**
- **Precio verificado en vivo: $2.991.735** en una ficha real
- SD 14, cluster de 23.200/mes, pico en enero

### Soldadora inverter — sólido

- ML #1 con 4.764 clicks
- `rspshopmaquinas.com.ar` rankea **con DA 1**
- El único editorial es español (entaban.es)
- SD 12, evergreen

### Caja fuerte — se cae

- SD 9, el más bajo de todos, pero **MercadoLibre recibe apenas 62 clicks estimados** estando #4
- El SERP lo ocupan especialistas D2C con DA 7 a 19 que se llevan todo
- Bonus de contaminación: en el puesto 15 aparece un **juego de mesa** llamado Caja Fuerte

## Orden final

| # | Rubro | SD | ML en SERP | +$1M | Veredicto |
| --: | :-- | --: | :-- | :-- | :-- |
| 1 | **Jacuzzi / hidromasaje** | 14 | #1 | **Sí, $3M verificado** | Ir |
| 2 | **Compresor de aire** | 14 | #3 | A verificar | Ir |
| 3 | **Soldadora inverter** | 12 | #1 | A verificar | Ir |
| 4 | **Paneles solares** | 29 | A verificar | Sí, el kit | Evaluar |
| 5 | **Salamandra a leña** | 11 | #3 | **No, $350-750k** | Solo si se afloja el filtro |
| — | Caja fuerte | 9 | #4, 62 clicks | — | Descartar |
| — | Lavavajillas | 15 | #4 | — | Descartar |
| — | Pileta de fibra | 44 | — | Sí | Descartar por dificultad |
| — | Heladera exhibidora | 53 | — | Sí | Descartar por dificultad |
| — | Cuatriciclo | 14 | #1 | Sí | Verificar exclusión del programa primero |

## La próxima acción concreta

Antes de escribir nada: **mirar en el panel de afiliados si alguna de las 22 fichas que el sitio ya
tiene arriba del millón generó comisión alguna vez.** Es dato propio, real, y responde la pregunta
de fondo mejor que cualquier estimación: si el ticket alto convierte para este sitio o no.

---

# Sourcing de jacuzzi — y el hallazgo que cambia el filtro

Se fue a verificar producto por producto en fichas reales de MercadoLibre. Resultado:

| Producto | Precio | Opiniones | Vendidos |
| :-- | --: | --: | --: |
| Jacuzzi Hidromasaje Exterior 206x198 | $2.991.735 | 1 | 2 |
| Hidromasaje Jacuzzi Acrílico 180x90 | $2.808.000 | **0** | sin dato |
| Hidromasaje Esquinero 129x129 | $1.242.974 | 3 | 4 |
| **Total** | | **4** | **6** |

Tres productos que suman **cuatro opiniones y seis ventas**. La categoría existe, los precios pasan
el filtro de +$1M sin problema, pero **no hay transacciones**.

No hay ranking de más vendidos para la categoría Spa Exterior (MLA455386): MercadoLibre directamente
no lo genera, lo que ya dice bastante sobre el volumen.

## El contraste que lo explica todo

Se verificó el mismo dato en salamandras, el otro finalista:

| Producto | Precio aprox. | Opiniones | Vendidos |
| :-- | --: | --: | --: |
| **Tromen Eco 7000** | ~$400.000-700.000 | **992** | **+1000** |
| Tromen Pehuen 18000 | ~$1.200.000 | 2 | +5 |

La misma marca, el mismo rubro, la misma temporada. El modelo accesible tiene **992 opiniones y más
de mil ventas**. El modelo que cruza el millón tiene **2 opiniones y 5 ventas**.

## La conclusión, que corrige la premisa del pedido

En MercadoLibre Argentina, **arriba del millón de pesos los productos se venden de a unidades**. El
filtro de "+$1M sí o sí" no selecciona productos caros con demanda: selecciona **productos que casi
nadie compra en esa plataforma**.

Y tiene sentido: quien gasta tres millones en un hidromasaje lo compra a una empresa que se lo
instala, no por MercadoLibre. Eso ya lo insinuaba el SERP, donde las que rankean son
`hidromasajesweb`, `hidromasajesdeluxe` y `Arredobagno`, todas D2C con instalación.

Una comisión alta sobre una venta que no ocurre vale cero. La lógica de "sumar tiros al arco" sigue
siendo correcta, pero el arco tiene que existir.

## El filtro que sí sirve

En vez de "más de $1M", el criterio útil es **el precio más alto que todavía tiene ventas reales**.
En este mercado eso cae alrededor de **$400.000 a $900.000**, que es entre dos y cuatro veces el
ticket de $200.000 que el sitio ya trabaja, y con demanda comprobable.

**Salamandra a leña cae exactamente ahí**, y encima tiene el mejor SERP de todo el barrido:

- SD 11, el más bajo medido
- **Dos dominios con DA 17 ocupando el #1 y el #2**
- MercadoLibre #3, y con productos que venden de a miles
- Cero comparadores editoriales; dos videos de YouTube respondiendo la pregunta que nadie contesta
  por escrito ("simple y doble combustión, experiencia personal")
- Pico de **49.500 búsquedas en junio** contra 6.600 ahora: publicar en agosto da diez meses de
  maduración antes de la temporada
- El Tromen Eco 7000 solo ya tiene 992 opiniones, o sea material de sobra para las contras honestas

## Qué queda pendiente de decisión

Es una decisión de negocio, no técnica:

- **Opción A:** mantener el filtro de +$1M y aceptar que se escribe para un rubro sin ventas
  comprobables en ML. El SEO se gana; la comisión es una apuesta.
- **Opción B:** aflojar el filtro a $400.000-$900.000 y arrancar por salamandra a leña, que tiene
  el mejor SERP del barrido, ticket dos a cuatro veces el actual, ventas reales y material de
  reseñas de sobra.

La recomendación es B, y el dato que la sostiene es el de arriba: 992 ventas contra 6.
