# Guía pilar `camara-deportiva` — borrador final

> **Estado:** prosa cerrada y specs verificadas. Listo para pasar a `src/data/guides.ts`
> apenas se destrabe MercadoLibre.
> **Bloqueado por:** URLs de imagen de las 5 fichas (`image` es obligatorio en `Product`) y
> citas textuales de reseñas. ML devuelve `gz/account-verification` a nuestra IP desde el
> 2026-08-25 ~13:00, tanto por navegador como por `curl`.
> **Enfoque aprobado por Juan (2026-08-25):** honestidad de generaciones. La guía dice
> abiertamente de qué año es cada cámara y cuál es el modelo actual de cada marca.

---

## 1. Cabecera

| Campo | Valor |
|---|---|
| `slug` | `camara-deportiva` |
| `category` | `camaras-deportivas` (nueva) |
| `silo` | `tech` |
| `pillar` | `true` |
| `title` | Cámara deportiva o de acción: cuál comprar en Argentina [2026] |
| `seoTitle` | Cámara Deportiva: Cuál Comprar en Argentina [2026] |
| `readingTime` | 10 |

### `guideCategories` a agregar

```ts
"camaras-deportivas": {
  name: "Guía de Cámaras Deportivas",
  description:
    "Cámaras deportivas comparadas por lo que decide la compra: cuánto estabilizan de verdad, cuáles se mojan sin carcasa y de qué generación es cada una de las que se consiguen acá.",
},
```

### Fichas (nombres oficiales verificados)

| Producto | ID | Slug canónico | `affiliateUrl` |
|---|---|---|---|
| Cámara 360 Insta360 X3 | MLA19710677 | `/producto/camara-360-insta360-x3-mla19710677` | https://meli.la/2BCnAtc |
| Cámara Deportiva GoPro HERO13 Black | MLA47374183 | `/producto/camara-deportiva-gopro-hero13-black-mla47374183` | https://meli.la/2FcbDMF |
| Cámara Deportiva Gadnic 4K WiFi 170° 16 MP | MLA62771175 | `/producto/camara-deportiva-gadnic-4k-wifi-170-16-mp-mla62771175` | https://meli.la/2j28gDR |
| Cámara Deportiva Akaso V50X | MLA16132352 | `/producto/camara-deportiva-akaso-v50x-mla16132352` | https://meli.la/1bCfmmy |
| Cámara Deportiva DJI Osmo Action 4 | MLA29364436 | `/producto/camara-deportiva-dji-osmo-action-4-mla29364436` | https://meli.la/2aHXLeQ |

> **"Gadnic Air 4K" no es el nombre oficial.** El `<title>`, el `<h1>` y el `og:title` de la
> página de Gadnic dicen los tres "Cámara Deportiva Gadnic 4K WiFi 170° 16 MP", SKU MCDEP017.

---

## 2. Keyword: por qué "cámara deportiva" y no "cámara de acción"

Keyword Planner, 2026-08-25:

| Keyword | Vol/mes |
|---|---:|
| camara deportiva | **720** |
| camara deportiva 4k / camaras deportivas 4k | 320 |
| camara de accion | 260 |
| cámara sumergible | 260 |
| camara tipo gopro / cámaras tipo gopro | 170 + 170 |
| camara deportiva gadnic | 170 |
| **Familia de tipo** | **~2.070** |

`gopro vs insta360` son **10/mes**: el ángulo comparativo de marca está descartado.

**Ojo con el 5.400 de "insta 360":** Google lo agrupa con "instagram 360" e "ig 360", los tres
con volumen idéntico. Buena parte de ese número es gente buscando Instagram, no la marca. El
término limpio es "camera insta360" / "camaras insta 360", **720/mes**.

---

## 3. Las dos tesis de la guía

**Tesis 1: el mercado está partido en dos.** Entre la Akaso ($176.899) y la Insta360 X3
($694.990) hay **$518.091 sin una sola opción**. No hay escalón intermedio.

**Tesis 2: lo que se consigue acá está atrasado.** De las tres cámaras de gama alta, dos están
dos o tres generaciones atrás del modelo actual de su marca. Ningún comparador argentino lo
dice. Es el diferencial de la guía.

---

## 4. Tabla de verdad de superlativos

> Chequear TODA afirmación superlativa contra esto antes de escribir.

| Afirmación | ¿Verdadera? | Dueño |
|---|---|---|
| La más cara | Sí | GoPro HERO13 ($930.999) |
| La más barata | Sí | Gadnic MCDEP017 ($98.749) |
| La más opinada | Sí, por 57 opiniones (3,3%) | Insta360 X3 (1.778) vs GoPro (1.721) |
| El puntaje más alto | **EMPATE** | X3 y GoPro, las dos 4.9 → escribir "junto con" |
| El puntaje más bajo | Sí | Gadnic (4.2) |
| La menos opinada | Sí | DJI Osmo Action 4 (76) |
| **La más vendida** | **EMPATE A TRES** | X3, GoPro y Gadnic, las tres 1.000 → **NUNCA** |
| El sensor más grande | Sí, **de las que lo declaran** | DJI (1/1,3") — Gadnic y Akaso no declaran |
| La más profunda sin carcasa | Sí | DJI (18 m) |
| La más liviana | Sí, **de las que lo declaran** | Gadnic (58 g) — Akaso no declara peso |
| La más pesada | Sí, **de las que lo declaran** | Insta360 X3 (180 g) |
| La única de generación actual | Sí, **entre las tres caras** | GoPro HERO13 Black |

---

## 5. Specs verificadas (11 agentes, verificación adversarial: 134 confirmadas / 36 rechazadas)

### Estabilización, la línea divisoria

| Modelo | Estabilización | Detalle verificado |
|---|---|---|
| Gadnic MCDEP017 | **Ninguna** | Manual oficial, textual: "Antivibración con giroscopio: **N/A**" (igual en ES, PT y EN) |
| Akaso V50X | EIS 2.0 | **Desactivada de fábrica** ("Default setting is off"), y excluyente con la corrección de distorsión |
| Insta360 X3 | FlowState | Activada por defecto, **no se puede desactivar**. Giroscopio de 6 ejes |
| DJI Osmo Action 4 | RockSteady 3.0 / 3.0+ | Con HorizonBalancing y HorizonSteady. No anda en cámara lenta ni timelapse |
| GoPro HERO13 Black | HyperSmooth 6.0 | Nivelación de horizonte en cámara, de 23 a 27 grados |

### Agua

| Modelo | Sin carcasa | Con carcasa |
|---|---|---|
| DJI Osmo Action 4 | **18 m** | 60 m |
| Insta360 X3 | 10 m (IPX8) | 50 m |
| GoPro HERO13 Black | 10 m | — |
| Akaso V50X | **No** | 40 m |
| Gadnic MCDEP017 | **No** | 30 m |

### Autonomía (cada fabricante la mide distinto)

| Modelo | Dato oficial | Medido en |
|---|---|---|
| DJI Osmo Action 4 | 160 min | **1080p/24** (laboratorio). No publica 4K |
| Akaso V50X | ~120 min | 4K (el manual aclara que varía) |
| Gadnic MCDEP017 | 110 min | **1080p**. No publica 4K |
| GoPro HERO13 Black | +1,5 h en 4K30 y 5.3K30; +2,5 h en 1080p30 | El único que publica los dos |
| Insta360 X3 | 81 min | 5.7K30 (laboratorio) |

### Sensor, peso y video

| Modelo | Sensor | Peso | Video máx |
|---|---|---|---|
| DJI Osmo Action 4 | **1/1,3"** | 145 g | 4K a 120 fps |
| GoPro HERO13 Black | 1/1,9" | **159 g** (el 154 era el de la HERO12) | 5.3K a 60 fps |
| Insta360 X3 | 1/2" | 180 g | 5.7K a 30 fps en 360 |
| Gadnic MCDEP017 | No declara | 58 g | 4K a 30 fps |
| Akaso V50X | **No declara** | **No declara** | 4K a 30 fps |

### Diferenciales

- **GoPro HERO13 Black:** lentes intercambiables HB-Series con detección automática. Rosca 1/4-20.
- **Insta360 X3:** 360° real con dos lentes.
- **Akaso V50X:** **dos baterías y cargador doble** en la caja. Ángulo en 4 pasos (70/110/140/170°).
- **DJI Osmo Action 4:** enganche magnético de liberación rápida. Doble pantalla táctil.
- **Gadnic MCDEP017:** 170°, 58 g, batería extraíble de 900 mAh.

### NO publicar (rechazado por el verificador)

Peso, medidas, sensor, chipset y apertura de la Akaso (no los publica). Correspondencia de
grados a nombres del menú de la Akaso. Capacidad máxima de microSD de la Akaso (dos páginas
oficiales se contradicen). Sensor, chipset, audio, banda de WiFi y montura de la Gadnic. Si el
4K de la Gadnic es nativo o interpolado (en ninguna dirección). Autonomía en 4K de la DJI y de
la Gadnic. Rosca de 1/4" en la X3. Cantidad de micrófonos de la X3. Que la Gadnic sea un
rebadge del SJCAM SJ4000 AIR.

---

## 6. Generación actual

| Línea | Tenemos | Actual | Atraso |
|---|---|---|---|
| Insta360 X | X3 (2022) | **X6** (12/08/2026) | **3 generaciones** |
| GoPro HERO | HERO13 Black (2024) | **HERO13 Black** | **ninguno** |
| DJI Osmo Action | Action 4 (2023) | **Action 6** (nov 2025) | **2 generaciones** |

- **Insta360:** X3 → X4 (2024, 8K30) → X5 (2025, sensores 1/1,28" y primeras lentes
  reemplazables) → X6 (2026, sensores 1/1,1", 8K a 50 fps, 20 m sin carcasa, 64 GB de memoria interna). La X4 Air no es
  sucesora, es una variante de entrada.
- **GoPro:** no existe la HERO14. Se salteó el ciclo 2025 por primera vez desde 2016. En 2026
  sacó la línea MISSION 1, que **convive** con HERO. **No prometer una HERO14.**
- **DJI:** Action 4 (2023) → Action 5 Pro (septiembre 2024) → Action 6 (noviembre 2025).
  La Action 6 es la primera cámara de acción con apertura variable. Su 8K llegó por
  firmware en diciembre 2025, no venía de fábrica. **La Action 7 no está anunciada, no mencionarla.**

### Demanda por generación

| Keyword | Vol/mes | ¿Lo tenemos? |
|---|---:|---|
| dji osmo action 6 (+ variante) | ~710 | No |
| insta 360 x5 | 590 | No |
| dji osmo action 4 (+ variante) | ~530 | **Sí** |
| insta 360 x4 | 480 | No |
| insta 360 x3 | 480 | **Sí** |
| gopro mission 1 | 170 | No |
| insta 360 x6 | 40 | No (salió hace 13 días) |

---

## 7. PROSA FINAL

### `directAnswer` / callout "Respuesta rápida"

> Para la mayoría conviene la **[GoPro HERO13 Black](/producto/camara-deportiva-gopro-hero13-black-mla47374183)**
> (alrededor de {{precio:MLA47374183:k}}): de las tres cámaras caras de esta guía es la única
> que sigue siendo el modelo actual de su marca, tiene {{rating:MLA47374183}} estrellas en
> {{reviews:MLA47374183}} opiniones y es la única que acepta lentes intercambiables. Si querés
> grabar en 360 y elegir el encuadre después, la
> **[Insta360 X3](/producto/camara-360-insta360-x3-mla19710677)**, sabiendo que es de 2022 y que
> Insta360 ya va por la X6. Si es tu primera cámara y no querés arriesgar plata, la
> **[Gadnic 4K](/producto/camara-deportiva-gadnic-4k-wifi-170-16-mp-mla62771175)** sale
> {{precio:MLA62771175:k}}, pero su fabricante declara que no tiene estabilización. Y si querés
> lo mejor del tramo económico, la
> **[Akaso V50X](/producto/camara-deportiva-akaso-v50x-mla16132352)**.

### `trust-block` (methodology)

> **Cómo comparamos:** partimos de las cámaras deportivas con más opiniones reales en
> MercadoLibre Argentina y verificamos una por una que estuvieran comprables al armar la guía.
> Ese filtro sacó modelos: hay publicaciones de cámaras muy conocidas que ya no están activas. También aprendimos algo en el camino: un
> mismo modelo puede tener más de una publicación de catálogo en MercadoLibre, y que una esté
> dada de baja no significa que el modelo no se consiga. Las specs las cruzamos contra la página
> oficial de cada fabricante y contra los manuales, nunca contra la ficha del vendedor: así
> descubrimos que el fabricante de la más barata declara que no tiene estabilización, un dato
> que su publicación no menciona. Los precios se revisan contra MercadoLibre tres veces por semana.

### `intro`

Párrafo 1:
> Comprar una cámara deportiva en Argentina tiene dos problemas que no aparecen en ninguna
> comparativa. El primero es que el mercado está partido al medio: las cinco que verificamos con
> stock real van de {{precio:MLA62771175:k}} a {{precio:MLA47374183:k}}, pero no están repartidas
> parejo. Hay dos hasta {{precio:MLA16132352:k}} y tres desde {{precio:MLA19710677:k}} para arriba.
> En el medio no hay nada.

Párrafo 2:
> El segundo es más incómodo y casi nadie lo dice: varias de las que se consiguen acá ya no son
> el modelo actual de su marca. Una de ellas está tres generaciones atrás. Eso no las convierte
> en malas compras, pero cambia bastante la cuenta, sobre todo cuando el precio no bajó en la
> misma proporción. Abajo están las cinco, con precios en vivo, las specs sacadas de los manuales
> de fábrica y el año real de cada una.

### Ranking

Los `h3` no resuelven tokens, así que van sin números.

---

**Kicker:** La más completa, y la única de las caras que no quedó vieja
**`h3`:** GoPro HERO13 Black

`product-card`: `productMlaId: "MLA47374183"`, `label: "Mejor elección general"`,
`labelColor: "green"`, `ranking: 1`,
`description`: `De las tres cámaras caras de la guía, la única que sigue siendo el modelo actual de su marca. {{rating:MLA47374183}} estrellas en {{reviews:MLA47374183}} opiniones.`

> Es la más cara de las cinco, y hoy la única de las tres caras que sigue siendo el modelo actual
> de su marca.
> GoPro no lanzó sucesor de la HERO13 Black: se salteó el ciclo 2025 por primera vez desde 2016
> y en 2026 sacó una línea distinta que convive con esta, no la reemplaza. Comprarla hoy es
> comprar el tope de la línea, no el modelo del año pasado con descuento.
>
> En lo técnico es la que mejor documenta lo que hace. Es la única de las cinco que publica los dos números,
> el de su resolución máxima y el de 1080p: más de una hora y media en 4K30 y en 5.3K30, y más
> de dos horas y media en 1080p30. Graba hasta 5.3K a 60 cuadros por segundo, estabiliza con
> HyperSmooth 6.0 y nivela el horizonte dentro de la cámara. Se moja hasta 10 metros sin carcasa.
>
> El diferencial que no tiene ninguna otra acá: acepta lentes intercambiables de la línea
> HB-Series, y la cámara reconoce sola cuál le pusiste y ajusta los parámetros. Si te interesa el
> macro o el ultra gran angular, es el único camino de esta comparativa.
>
> Pesa 159 gramos con batería y trae rosca de 1/4-20, así que entra en cualquier soporte
> genérico sin adaptador.

`pull-quote`: **PENDIENTE** (reseña real de ML).

---

**Kicker:** La única que graba todo alrededor
**`h3`:** Insta360 X3

`product-card`: `productMlaId: "MLA19710677"`, `label: "La única 360"`,
`labelColor: "blue"`, `ranking: 2`,
`description`: `Dos lentes, esfera completa: no la apuntás, el encuadre lo elegís después. {{rating:MLA19710677}} estrellas en {{reviews:MLA19710677}} opiniones.`

> Es la que más cambia lo que podés filmar, y también la que más atrasada quedó respecto de su
> propia marca. Salió en 2022 e
> Insta360 sacó desde entonces la X4, la X5 y, el 12 de agosto de 2026, la X6. Está tres
> generaciones atrás. Lo decimos porque nadie lo dice: si conseguís una X5 o una X6 a un precio
> razonable, son mejores cámaras. Esta es la que verificamos comprable con stock nacional.
>
> Dicho eso, sigue haciendo algo que ninguna de las otras cuatro hace. Tiene un lente de cada
> lado y graba una esfera completa a 5.7K. No la apuntás: la prendés, la dejás y después elegís
> hacia dónde miraba. Eso resuelve el problema más común de una cámara deportiva, que es volver a
> casa y descubrir que lo bueno pasó fuera de cuadro.
>
> Comparte con la GoPro el puntaje más alto de la guía, {{rating:MLA19710677}} estrellas, y es la
> que más opiniones acumuló, aunque por poco margen. Su estabilización FlowState viene activada
> de fábrica y no se puede apagar desde la cámara. Se moja hasta 10 metros sin carcasa.
>
> Una contra concreta: es la más pesada de las que declaran peso, 180 gramos.

`pull-quote`: **PENDIENTE** (reseña real de ML).

---

**Kicker:** El sensor más grande declarado, por menos que la GoPro
**`h3`:** DJI Osmo Action 4

`product-card`: `productMlaId: "MLA29364436"`, `label: "El sensor más grande declarado"`,
`labelColor: "purple"`, `ranking: 3`,
`description`: `Sensor de 1/1,3 pulgadas, el más grande de las que lo declaran, y la que más profundo se moja sin carcasa.`

> Tiene el sensor más grande de las cinco entre las que publican el dato, 1/1,3 pulgadas contra
> 1/1,9 de la GoPro, y cuesta {{preciodif:MLA29364436:MLA47374183}} menos. Un sensor más grande
> junta más luz, que es lo que se nota cuando el sol se va.
>
> Es además la que más profundo se moja sin carcasa: 18 metros, contra los 10 de la GoPro y la
> Insta360. Y el enganche magnético de liberación rápida es genuinamente más cómodo que atornillar.
>
> Ahora las dos contras, y son importantes. La primera: está dos generaciones atrás. DJI sacó la
> Action 5 Pro en 2024 y la Action 6 en noviembre de 2025, que es la primera cámara de acción con
> apertura variable.
>
> La segunda es un número que engaña. DJI publica 160 minutos de autonomía, pero están medidos
> grabando en 1080p a 24 cuadros por segundo, el modo menos exigente que tiene. No hay dato oficial de cuánto dura en 4K. No es comparable contra los 81 minutos de la
> Insta360, que están medidos a 5.7K.
>
> Es la que menos opiniones tiene de las cinco: {{reviews:MLA29364436}}. Es poca base para sacar
> conclusiones, y conviene tenerlo en cuenta.

---

**Kicker:** Lo mejor del tramo económico
**`h3`:** Akaso V50X

`product-card`: `productMlaId: "MLA16132352"`, `label: "El mejor del tramo económico"`,
`labelColor: "slate"`, `ranking: 4`,
`description`: `{{rating:MLA16132352}} estrellas en {{reviews:MLA16132352}} opiniones, y vienen dos baterías con cargador doble en la caja.`

> Es el techo del tramo barato: cuesta {{precio:MLA16132352}} y tiene {{rating:MLA16132352}}
> estrellas en {{reviews:MLA16132352}} opiniones. Graba 4K a 30 cuadros por segundo y deja elegir
> el ángulo en cuatro pasos, de 70 a 170 grados, desde el menú de la cámara.
>
> El detalle que más se agradece está en la caja: vienen **dos baterías y un cargador doble**. Es
> lo que separa filmar una mañana de filmar un día entero, y no es lo habitual a este precio.
>
> Tiene estabilización electrónica EIS 2.0, con una salvedad que conviene saber antes: **viene
> desactivada de fábrica** y hay que prenderla desde el menú. Además es excluyente con la
> corrección de distorsión, así que usás una o la otra.
>
> Dos límites honestos. No se moja sin carcasa: aguanta 40 metros, pero siempre con la carcasa
> puesta. Y Akaso no publica peso, medidas, sensor ni apertura de este modelo, así que hay cosas
> que no podemos compararte contra las de arriba porque el fabricante no las dice.

---

**Kicker:** La más barata, con una advertencia
**`h3`:** Cámara Deportiva Gadnic 4K

`product-card`: `productMlaId: "MLA62771175"`, `label: "La más barata"`,
`labelColor: "slate"`, `ranking: 5`,
`description`: `La entrada más económica de la guía, con {{reviews:MLA62771175}} opiniones. Su fabricante declara que no tiene estabilización.`

> Sale {{precio:MLA62771175}} y tiene {{reviews:MLA62771175}} opiniones, así que mucha gente la
> compró y la usó. Pesa 58 gramos, es la más liviana de las que declaran peso, graba 4K a 30
> cuadros por segundo con un ángulo de 170 grados y la batería es extraíble.
>
> Pero hay un dato que su publicación no menciona y que cambia la expectativa. Fuimos al manual
> oficial de Gadnic y en la tabla de características dice, textual, **"Antivibración con
> giroscopio: N/A"**. Está igual en las tres versiones del manual, en español, portugués e
> inglés. **No tiene estabilización.**
>
> Eso significa que si la ponés en un casco, en el manubrio de una bici o en una moto, lo que vas
> a grabar va a temblar. Para filmar caminando, en una pileta o apoyada en algún lado, funciona.
> Para filmar en movimiento, no es la herramienta.
>
> Es también la de puntaje más bajo de la guía, {{rating:MLA62771175}} estrellas, y ese número es
> consistente con lo anterior. Tampoco publica autonomía en 4K: los 110 minutos que declara están
> medidos en 1080p.

---

### `h2`: Por qué no hay nada entre las baratas y las caras

> Ordenadas por precio, las cinco quedan así: la Gadnic a {{precio:MLA62771175}}, la Akaso V50X a
> {{precio:MLA16132352}}, la Insta360 X3 a {{precio:MLA19710677}}, la DJI Osmo Action 4 a
> {{precio:MLA29364436}} y la GoPro HERO13 Black a {{precio:MLA47374183}}.
>
> Entre la Akaso y la Insta360 hay {{preciodif:MLA16132352:MLA19710677}} de diferencia. No es un
> escalón, es un pozo. Y no es casualidad: son dos categorías de producto que comparten el
> nombre. Las de abajo son cámaras chicas que graban en alta resolución y aguantan agua adentro de
> una carcasa. Las de arriba estabilizan de verdad, se mojan sin carcasa y publican el tamaño
> de su sensor, cosa que las baratas ni siquiera hacen.
>
> La consecuencia práctica: si tu presupuesto son {{precio:MLA16132352:k}}, no existe la opción de
> poner un poco más y llevar algo bastante mejor. El siguiente escalón cuesta cuatro veces eso.
> Conviene saberlo antes de empezar a mirar.

### `h2`: La estabilización es lo que separa a una cámara barata de una cara

> Si tuviéramos que elegir un solo dato para decidir la compra, sería este. No es la resolución.
> Las cinco graban en 4K o más, y en una pantalla de teléfono cuesta distinguirlas. Lo que se nota
> siempre es si la imagen tiembla.
>
> Y acá el corte es limpio. La Gadnic **no tiene estabilización**, y no es una deducción nuestra:
> su manual oficial lo lista como "N/A" en las tres versiones de idioma. La Akaso sí tiene, EIS
> 2.0, pero viene apagada de fábrica y es excluyente con la corrección de distorsión. Las tres
> caras estabilizan por software y bien: HyperSmooth 6.0 en la GoPro, RockSteady 3.0 en la DJI y
> FlowState en la Insta360, que además ni siquiera se puede desactivar.
>
> Traducido a la práctica: si vas a filmar caminando, en una pileta o con la cámara apoyada, la
> diferencia se te va a escapar. Si vas a filmar corriendo, en bici, en moto o esquiando, la
> diferencia es entre un video que se puede mirar y uno que no.

### `h2`: Cuáles se pueden mojar sin carcasa

> Otra división limpia, y otra que las publicaciones no aclaran bien. Tres de las cinco se meten al
> agua tal como vienen: la DJI Osmo Action 4 hasta 18 metros, y la GoPro HERO13 Black y la Insta360
> X3 hasta 10 metros cada una. La DJI es la que más profundo llega sin nada puesto.
>
> Las otras dos necesitan la carcasa sí o sí. La Akaso V50X aguanta 40 metros con carcasa y la
> Gadnic 30 metros con carcasa, pero ninguna de las dos es sumergible por sí sola.
>
> La diferencia práctica no es la profundidad, porque casi nadie baja a 10 metros. Es la comodidad:
> con carcasa el audio se apaga y las pantallas táctiles dejan de responder. Si el plan es la
> pileta, el mar o la lluvia, poder tirarse sin preparar nada vale más que los metros.

### `h2`: Qué modelo es el actual de cada marca

> Esta sección existe porque casi ninguna comparativa la tiene, y es lo primero que deberías saber
> antes de gastar.
>
> **Insta360.** La X3 de esta guía salió en 2022. Después vinieron la X4 en 2024, la X5 en 2025 y
> la X6 el 12 de agosto de 2026, o sea hace días. La X6 tiene sensores bastante más grandes, graba
> en 8K a 50 cuadros por segundo, se moja hasta 20 metros sin carcasa y trae memoria interna. La X3
> está tres generaciones atrás. Sigue siendo una buena cámara y es la que verificamos con stock
> nacional, pero comprala sabiendo qué estás comprando.
>
> **GoPro.** Acá la noticia es al revés. **No existe la HERO14.** GoPro no lanzó sucesor de la
> HERO13 Black: se salteó el ciclo de 2025, la primera vez que lo hace desde 2016, y en 2026
> presentó una línea nueva y distinta que convive con la línea HERO en vez de reemplazarla. La
> HERO13 Black de esta guía es el modelo actual, no una punta de stock.
>
> **DJI.** La Osmo Action 4 es de 2023. DJI sacó la Action 5 Pro en 2024 y la Action 6 en noviembre
> de 2025, que es la primera cámara de acción con apertura variable. La Action 4 está dos
> generaciones atrás.
>
> De **Gadnic y Akaso** no pudimos establecer un ciclo de generaciones comparable al de las tres de
> arriba, así que no les aplicamos el mismo criterio.
>
> Nuestra recomendación honesta: si vas a gastar arriba de {{precio:MLA19710677:k}}, mirá primero
> si conseguís la generación actual a una diferencia razonable. Y si no la conseguís, comprá la
> vieja sabiendo que es vieja, que es distinto a que te la vendan como si fuera lo último.

### `table` comparativa

`headers`: `["Modelo", "Precio", "Estabilización", "Sumergible sin carcasa", "Año", "Ideal para"]`

| Modelo | Precio | Estabilización | Sumergible sin carcasa | Año | Ideal para |
|---|---|---|---|---|---|
| [GoPro HERO13 Black](https://meli.la/2FcbDMF) | {{precio:MLA47374183}} | HyperSmooth 6.0 | 10 m | 2024, modelo actual | El que quiere lo mejor y no quedar viejo |
| [Insta360 X3](https://meli.la/2BCnAtc) | {{precio:MLA19710677}} | FlowState | 10 m | 2022, 3 atrás | Grabar en 360 y encuadrar después |
| [DJI Osmo Action 4](https://meli.la/2aHXLeQ) | {{precio:MLA29364436}} | RockSteady 3.0 | **18 m** | 2023, 2 atrás | Poca luz y agua |
| [Akaso V50X](https://meli.la/1bCfmmy) | {{precio:MLA16132352}} | EIS 2.0 (apagada de fábrica) | No, 40 m con carcasa | — | El mejor del tramo económico |
| [Gadnic 4K](https://meli.la/2j28gDR) | {{precio:MLA62771175}} | **Ninguna** | No, 30 m con carcasa | — | Primera cámara, sin movimiento fuerte |

### `h2`: Cómo elegir

`h3`: Empezá por dónde la vas a poner
> Si va a un casco, a un manubrio o a una moto, la estabilización manda y el tramo barato queda
> descartado. Si va apoyada, en la mano o en una pileta, cualquiera de las cinco sirve.

`h3`: Después, si vas a editar o no
> Una cámara tradicional te da un video listo para mandar. Una 360 te da material que hay que
> trabajar antes de que sirva. Si nunca editaste y no tenés ganas de empezar, no compres la 360
> por más impresionante que se vea.

`h3`: Recién al final, la resolución
> Es el número que más se publicita y el que menos decide. Las cinco graban en 4K o más. La
> diferencia real está en el sensor, en la estabilización y en el bitrate, no en la cifra grande
> de la caja.

### `h2`: Cuánto cuesta una cámara deportiva en agosto de 2026

> - **Hasta {{precio:MLA16132352:k}}:** el tramo económico. Graban en 4K y se mojan con carcasa.
>   Estabilización nula o apagada de fábrica. Entran acá la Gadnic y la Akaso V50X.
> - **De {{precio:MLA19710677:k}} para arriba:** el tramo de gama alta. Estabilización que
>   funciona, agua sin carcasa y sensor declarado. Entran la Insta360 X3, la DJI Osmo Action 4
>   y la GoPro HERO13 Black.
> - **En el medio:** nada. Es el hueco de {{preciodif:MLA16132352:MLA19710677}} del que hablamos arriba.

### `verdict`

> Para la mayoría, la **[GoPro HERO13 Black](/producto/camara-deportiva-gopro-hero13-black-mla47374183)**
> es la compra más segura de esta guía, y no solo por lo que hace: es la única de las tres caras que
> sigue siendo el modelo actual de su marca, así que no estás comprando una punta de stock. Comparte
> con la Insta360 el puntaje más alto de las cinco. Si lo que te tienta es grabar en 360 y decidir el
> encuadre después, la **[Insta360 X3](/producto/camara-360-insta360-x3-mla19710677)** sigue siendo
> la única de esta guía que lo hace, con la salvedad de que es de 2022 y ya hay tres generaciones
> más nuevas.
> Si querés el sensor más grande de las que publican el dato y la que más profundo se moja sin carcasa, la
> **[DJI Osmo Action 4](/producto/camara-deportiva-dji-osmo-action-4-mla29364436)**. Si tu presupuesto
> es el tramo económico, la **[Akaso V50X](/producto/camara-deportiva-akaso-v50x-mla16132352)** por
> las dos baterías que trae. Y si querés gastar lo mínimo, la
> **[Gadnic 4K](/producto/camara-deportiva-gadnic-4k-wifi-170-16-mp-mla62771175)**, sabiendo que su
> propio fabricante declara que no estabiliza.

### `faq` (7, la primera abierta)

1. **¿Cuánto sale una cámara deportiva en Argentina?**
   Hay dos tramos separados. El económico va de {{precio:MLA62771175}} (Gadnic 4K) a
   {{precio:MLA16132352}} (Akaso V50X). El de gama alta arranca en {{precio:MLA19710677}}
   (Insta360 X3) y llega a {{precio:MLA47374183}} (GoPro HERO13 Black). Entre los dos hay
   {{preciodif:MLA16132352:MLA19710677}} sin ninguna opción.

2. **¿Sirve una cámara deportiva barata o es tirar la plata?**
   Depende de si vas a filmar en movimiento. La Gadnic tiene {{reviews:MLA62771175}} opiniones, así
   que mucha gente la usa y le sirve. Pero su manual declara que no tiene estabilización, y eso se
   nota apenas la ponés en un casco o en una bici. Para filmar caminando o en el agua, alcanza. Para
   filmar en movimiento fuerte, no.

3. **¿Qué es una cámara 360 y en qué se diferencia?**
   Graba una esfera completa con dos lentes en vez de apuntar a un lado. No elegís el encuadre al
   filmar, lo elegís después al editar, así que nunca se te escapa nada fuera de cuadro. La contra es
   que siempre hay que editar antes de que el video sirva. En esta guía la única 360 es la Insta360 X3.

4. **¿Cuáles se pueden meter abajo del agua sin carcasa?**
   Tres de las cinco. La DJI Osmo Action 4 hasta 18 metros, y la GoPro HERO13 Black y la Insta360 X3
   hasta 10 metros cada una. La Akaso V50X (40 m) y la Gadnic (30 m) solo aguantan con la carcasa puesta.

5. **¿Sirve para filmar en moto o en bici?**
   Sí, y es de los usos más comunes, pero define la compra. Lo que decide el resultado no es la
   resolución sino la estabilización, porque el problema real es la vibración. Con las tres de gama
   alta el video sale mirable. Con la Gadnic, que no estabiliza, va a temblar. Con la Akaso acordate
   de prender la estabilización en el menú, porque viene apagada de fábrica.

6. **¿Conviene comprar el modelo del año pasado para ahorrar?**
   A veces sí, pero hay que saber cuánto atrasa. La Insta360 X3 está tres generaciones atrás (ya
   salieron X4, X5 y X6) y la DJI Osmo Action 4 está dos (ya salieron Action 5 Pro y Action 6). La
   GoPro HERO13 Black, en cambio, sigue siendo el modelo actual: GoPro no lanzó sucesor. Si vas a
   gastar en el tramo alto, fijate primero si conseguís la generación actual a una diferencia razonable.

7. **¿Cuánto dura la batería?**
   El problema es que cada fabricante la mide distinto. La GoPro es la única que publica los dos números: más de
   una hora y media en 4K30 y en 5.3K30, y más de dos horas y media en 1080p30. La Insta360 X3 declara 81 minutos a
   5.7K, medidos en laboratorio. La DJI publica 160 minutos, pero medidos en 1080p a 24
   cuadros por segundo, y no da dato en 4K. La Gadnic declara 110 minutos, también en 1080p. Para
   un día entero afuera conviene sumar un [cargador portátil](/guias/tech/cargador-portatil).

---

## 8. Enlazado interno

### Salientes
- `/guias/tech/cargador-portatil` — ancla "cargador portátil" (ya está en la FAQ 7)
- `/guias/tech/power-bank-solar` — ancla "power bank solar"
- `/guias/relojes-garmin/reloj-garmin` — ancla "reloj Garmin"

### Entrantes (obligatorias antes de publicar, si no nace huérfana)
- `power-bank-solar` → ancla "cámara deportiva"
- `cargador-portatil` → ancla "cámara deportiva"
- `reloj-garmin` → ancla "cámara deportiva"

Las tres con `sitemapLastmod` y **sin tocar `updatedDate`**.

---

## 9. Guías hijas planificadas

| Guía hija | Keywords | Vol/mes |
|---|---|---:|
| `gopro-cual-comprar` | gopro, camara gopro, gopro hero 13, gopro mission 1 | 12.100 + 2.400 + 1.300 + 170 |
| `insta360-cual-comprar` | camera insta360, insta 360 x5, x4, x3, x6 | 720 + 1.590 |

---

## 10. Qué falta para publicar

- [ ] URLs de imagen de las 5 fichas (`-F.webp` u `-O.webp`, nunca `-R.webp`). **Bloqueado por ML.**
- [ ] Citas textuales de reseñas: 2 `pull-quote` (GoPro e Insta360) y las contras de las de 1 estrella. **Bloqueado por ML.**
- [ ] Crear las 5 fichas en `src/data/curated-products.ts`.
- [ ] Agregar `camaras-deportivas` a `guideCategories`.
- [ ] Pasar la guía a `src/data/guides.ts`.
- [ ] Verificar si la Insta360 X5/X6 y la DJI Action 6 se consiguen en Argentina. Si se consiguen,
      se suman como fichas y la guía gana el tramo de generación actual.
- [ ] `npm run guides:check` + `npm run lint` + `npm run build` en verde.
- [ ] Trío auditor (Codex + Gemini) → GO.

---

## 11. VERIFICACIÓN EN VIVO (2026-08-25, Chrome de Juan)

MercadoLibre bloqueó el navegador interno y `curl`, pero con la sesión de Chrome de Juan
respondió normal. Las 5 fichas quedaron confirmadas y apareció el dato que faltaba.

### Las 5 de la guía, confirmadas

| Producto | ID | Precio | Rating | Opiniones | Vendidos | Stock | Imagen principal |
|---|---|---:|---:|---:|---|---|---|
| GoPro HERO13 Black | MLA47374183 | $930.999,05 | 4.9 | 1.721 | +1000 | 4 disp. | `D_NQ_NP_864219-MLA98419902588_112025-O.webp` |
| Insta360 X3 | MLA19710677 | $694.990 | 4.9 | 1.778 | +1000 | +10 disp. | `D_NQ_NP_972178-MLA115768957947_082026-O.webp` |
| DJI Osmo Action 4 | MLA29364436 | $799.999 | 4.7 | 76 | +50 | InStock | `D_NQ_NP_934853-MLA110168057727_042026-O.webp` |
| Akaso V50X | MLA16132352 | $176.899 | 4.7 | 710 | +500 | +25 disp. | `D_NQ_NP_767731-MLA99132421216_112025-O.webp` |
| Gadnic 4K | MLA62771175 | $98.749 | 4.2 | 1.245 | +1000 | +50 disp. | `D_NQ_NP_682483-MLA105363034821_012026-O.webp` |

Las cinco con `schema.org/InStock` y ninguna internacional. Todas las imágenes hay que
verificarlas con GET real (no HEAD) antes de guardarlas.

### Dos discrepancias entre la publicación y el fabricante

1. **Gadnic:** la publicación de ML la llama "Gadnic **Air** 4k". La página del fabricante no
   usa "Air" en ningún lado: es "Cámara Deportiva Gadnic 4K WiFi 170° 16 MP", SKU MCDEP017. Las
   specs de la publicación (WiFi, LCD 2", 170°, 16 MP, 900 mAh) coinciden exactas con ese manual,
   así que es el mismo equipo con un nombre agregado por quien cargó la publicación.
2. **Akaso:** la publicación declara **"Sensor IMX386"**. Akaso NO publica el sensor de la V50X
   en ninguna fuente oficial (el verificador ya lo había rechazado). Es dato del vendedor, no del
   fabricante. **No publicarlo como hecho**, pero sí sirve para una observación honesta en la guía.

### LA GENERACIÓN ACTUAL SÍ SE CONSIGUE

Esto invalida la premisa con la que había armado la guía. Verificado en vivo:

| Producto | ID | Precio | Rating | Opiniones | Vendidos | Origen |
|---|---|---:|---:|---:|---|---|
| **Insta360 X5 Essentials Bundle** | MLA50882755 | **$1.759.228,98** | 4.9 | 676 | +100 | nacional |
| **DJI Osmo Action 6 Combo Aventura** | MLA62340610 | **$1.543.649** | 4.9 | 205 | +100 | nacional |

Otras X5 nacionales con ventas: MLA61342704 (Motorcycle, +50) y MLA62219394 (Cycling, +25).
Otra Action 6 nacional: MLA63646601 (Combo Estándar, +25).

**La Insta360 X6 ya está en góndola argentina** (MLA77383959 Standard Bundle, MLA77830391
Essential Bundle, y varias más, todas nacionales) pero **todas sin ventas**: salió hace 13 días.
No califica para ficha todavía. Sí para mencionarla en la sección de generaciones.

### El hallazgo editorial: cuánto cuesta la generación actual

| Línea | Modelo viejo | Precio | Modelo actual | Precio | Multiplicador |
|---|---|---:|---|---:|---:|
| Insta360 X | X3 (2022) | $694.990 | **X5 (2025)** | $1.759.229 | **2,53x** |
| DJI Osmo Action | Action 4 (2023) | $799.999 | **Action 6 (2025)** | $1.543.649 | **1,93x** |
| GoPro HERO | — | — | HERO13 Black (2024) | $930.999 | no aplica, es la actual |

Ésta es la respuesta honesta y con números a "¿conviene comprar lo nuevo?": en Argentina la
generación actual cuesta **entre el doble y dos veces y media**. Y deja a la **GoPro HERO13 Black
como la única forma de comprar generación actual sin pagar más de un millón y medio**, que es un
argumento mucho más fuerte que el que tenía la guía.

### Qué cambia en la guía

- Pasa de **5 a 7 productos**. El tramo de gama alta se parte en dos: generación vieja
  (X3, Action 4) y generación actual (X5, Action 6, y la GoPro que ya lo era).
- La **tesis 1 se refuerza**: el hueco de precio no era uno solo, hay tres tramos.
  Hasta $176.899 / de $694.990 a $930.999 / de $1.543.649 para arriba.
- La sección "Qué modelo es el actual de cada marca" pasa de informativa a **accionable**:
  ahora se puede comprar el actual desde la misma guía.
- **PENDIENTE de Juan:** los `meli.la` de MLA50882755 y MLA62340610.

---

## 12. RESEÑAS REALES (extraídas de ML, 2026-08-25)

> Regla de honestidad: muchas reseñas de ML son de compradores de otros países y vienen
> **traducidas** (ML las marca "Traducido / Ver original"). Atribuir siempre con el país.
> El campo `country` de `customerReviews` existe justo para esto.

### GoPro HERO13 Black

**PULL-QUOTE #1 (Argentina, sin traducir, 4 estrellas o más):**
> "Es una cámara con una definición increíble. En mi caso filmo normalmente en 4k, 19:6 a 60 fps.
> Pero también admite 120 fps en esa resolución. Aunque los 120 fps son más útiles para cuando se
> desee hacer una cámara lenta sin que se perciban tirones. Por ejemplo, debajo del agua. Ahhh. Ya
> la probé realizando una filmación subacuática y los resultados fueron magníficos. Ver los peces
> tropicales de punta cana con semejante nitidez, hicieron que valorara aún más a la cámara."
> — Comprador verificado en MercadoLibre Argentina

**HALLAZGO: se apaga por temperatura. Dos compradores independientes, los dos de Brasil:**
- "La única desventaja es que se calienta mucho y a veces necesita apagarse hasta que vuelva a la
  temperatura normal." (Brasil, traducida)
- "solo tuve un apagón cuando grabé en 5K durante más de 40 minutos, pero por lo demás todo bien."
  (Brasil, traducida)

Esto **califica el dato oficial** de GoPro de "más de 1,5 h en 5.3K30": el límite práctico puede
ser la temperatura, no la batería. Va en la guía, atribuido como opiniones de compradores.

**Otras contras repetidas (Brasil, traducidas):**
- No incluye accesorios más allá del agarre, y **hace falta una microSD para la primera
  configuración** (dos reseñas distintas lo dicen; una recomienda Sandisk Extreme Pro de 128 GB).
- "su batería dura máximo 2 horas encendida... tendrás que comprar un cable magnético para
  conectarla a la Power Bank".

### Insta360 X3

**PULL-QUOTE #2 (Argentina, sin traducir, 4 estrellas):**
> "Es un buen producto. Los puntos negativos que encontré son: necesitas siempre buena luz, en
> entornos con baja luz la calidad se desploma. Cuando se recortan las fotos, se pierde mucha
> calidad y se ve acuarelado. La pantalla a veces tiene lag. El resto, anda bárbaro. Los videos son
> excelentes, la app y el software anda bien."
> — Comprador verificado en MercadoLibre Argentina

**HALLAZGO IMPORTANTE: los lentes expuestos se rompen. TRES compradores, tres países distintos:**
- México: "Se resbaló, cayó de menos de 20 centímetros y se rompió un lente. Tengan mucho cuidado y
  compren los protectores, mi cámara ya va en camino a Hong Kong para reparación."
- Colombia: "es muy delicada, como ya saben esta cámara tiene los lentes expuestos... al tercer uso"
- México: "es algo frágil, comprale todas las protecciones posibles, y compra un buen protector de lente"

Es convergencia de tres fuentes independientes sobre el mismo defecto estructural. **Va sí o sí en
la guía y en las contras de la ficha.** Es el tipo de dato que las specs no muestran y que decide
una compra de {{precio:MLA19710677:k}}.

**Otras contras:**
- Brasil (4 estrellas): "la idea de tener una grabación en 360 es muy buena, pero en la práctica, en
  el día a día, son pocos los casos en los que realmente podemos usarla". Confirma el punto de que
  siempre hay que editar.
- México: "recuerden adquirir también una microSD V30 o mayor, ya que sí falla si se utiliza con una
  memoria convencional". Coincide con la spec verificada (UHS-I V30 o superior).
- México: "para los nuevos usuarios la app para editar es un poco difícil".

---

## 13. TABLA DE VERDAD v2 — los 7 productos

> **Reemplaza a la sección 4.** Toda afirmación superlativa se chequea contra ESTA tabla.

| Producto | Precio | Rating | Opiniones | Vendidos | Generación |
|---|---:|---:|---:|---|---|
| Gadnic MCDEP017 | $98.749 | 4.2 | 1.245 | +1000 | n/a |
| Akaso V50X | $176.899 | 4.7 | 710 | +500 | n/a |
| Insta360 X3 | $694.990 | 4.9 | 1.778 | +1000 | 3 atrás |
| DJI Osmo Action 4 | $799.999 | 4.7 | 76 | +50 | 2 atrás |
| GoPro HERO13 Black | $930.999 | 4.9 | 1.721 | +1000 | **actual** |
| DJI Osmo Action 6 | $1.543.649 | 4.9 | 205 | +100 | **actual** |
| Insta360 X5 | $1.759.229 | 4.9 | 676 | +100 | actual-1 (existe X6) |

### Superlativos recalculados

| Afirmación | Dueño | Ojo |
|---|---|---|
| La más cara | **Insta360 X5** ($1.759.229) | **CAMBIÓ**: antes era la GoPro |
| La más barata | Gadnic ($98.749) | sin cambio |
| La más opinada | Insta360 X3 (1.778) | por 57 sobre la GoPro (3,3%), sigue siendo poco margen |
| El puntaje más alto | **EMPATE A CUATRO** | X3, GoPro, Action 6 y X5, las cuatro 4.9. **NUNCA en singular** |
| El puntaje más bajo | Gadnic (4.2) | sin cambio |
| La menos opinada | DJI Action 4 (76) | sin cambio |
| La más vendida | **EMPATE A TRES** | X3, GoPro y Gadnic, las tres +1000. **NUNCA en singular** |
| El sensor más grande | **PENDIENTE** | la Action 6 declara 1/1,1"; verificar antes de afirmar |
| La más profunda sin carcasa | **PENDIENTE** | la Action 6 declararía 20 m; verificar antes de afirmar |

**Trampa nueva y peor que la anterior:** el empate de 4.9 pasó de dos a **cuatro** productos.
Cualquier "la mejor puntuada" es falso.

### Los tres tramos (la tesis 1, corregida)

| Tramo | Rango | Quiénes |
|---|---|---|
| Económico | $98.749 a $176.899 | Gadnic, Akaso V50X |
| *hueco de $518.091* | | |
| Gama alta | $694.990 a $930.999 | Insta360 X3, DJI Action 4, **GoPro HERO13** |
| *hueco de $612.650* | | |
| Generación actual premium | $1.543.649 a $1.759.229 | DJI Action 6, Insta360 X5 |

**El hallazgo que ordena toda la guía:** el tramo del medio tiene tres cámaras, y **dos son de
generación vieja**. La GoPro HERO13 Black es la **única cámara de generación actual que se consigue
por debajo del millón y medio**. Ese es el argumento de compra más fuerte de la guía, y sale
solo de los datos.

Dicho de otra forma: pasar de la X3 a la X5 cuesta **2,5 veces**; pasar de la Action 4 a la
Action 6 cuesta **1,9 veces**; y comprar generación actual en GoPro **no cuesta ningún salto**,
porque la HERO13 Black ya lo es.

---

## 14. SPECS VERIFICADAS — generación actual (X5 y Action 6)

### Insta360 X5 (MLA50882755) — 22/04/2025

| Spec | Valor verificado |
|---|---|
| Video 360 | 8K (7680 x 3840) a 30 fps. 5.7K a 60 fps. 4K a 120 fps |
| Video un solo lente | 4K a 60 fps. 1080p a 120 fps |
| Foto 360 | 72 MP (11904 x 5952) |
| Sensor | **Doble 1/1,28"**, uno por lente. 144% más grandes que los de la X4 |
| Apertura | F2.0 |
| Estabilización | FlowState + Bloqueo de horizonte 360°. Insta360 no publica número de versión |
| Sumergible sin carcasa | **15 m** (IP68/IPX8). Con carcasa de buceo, 60 m |
| Pantalla | LCD 2,5" (440 x 696) |
| Batería | 2400 mAh extraíble |
| Autonomía | 93 min en 8K30 · 135 min en 5.7K30 · 208 min en 5.7K24 modo Endurance (laboratorio) |
| Carga | 80% en 20 min, 100% en 35 min |
| Peso | 200 g |
| **Lentes reemplazables** | **Sí**, primer sistema de su tipo en una 360. Se cambian sin servicio técnico |
| Montura | Rosca de 1/4" más liberación rápida |
| Memoria interna | No tiene (la X6 sí: 64 GB) |
| Tasa de bits | 180 Mbps |

### DJI Osmo Action 6 (MLA62340610) — noviembre 2025

| Spec | Valor verificado |
|---|---|
| Video | **8K (7680 x 4320) a 30 fps.** Llegó por **firmware 01.02.05.21 del 23/12/2025**, no venía de fábrica |
| Foto | 38 MP (7168 x 5376) |
| Sensor | **1/1,1" CMOS cuadrado**, píxeles de 2,4 μm, 13,5 pasos de rango dinámico |
| Apertura | **f/2.0 a f/4.0 VARIABLE.** DJI la presenta como el fin de la apertura fija |
| Estabilización | RockSteady 3.0 / 3.0+, HorizonBalancing, HorizonSteady. En 8K la estabilización se limita |
| Sumergible sin carcasa | **20 m.** Con carcasa, 60 m |
| Pantallas | Frontal 1,46" (342 x 342) · trasera 2,5" (400 x 712) |
| Batería | 1950 mAh |
| Autonomía | 240 min, medidos en **1080p/24** (laboratorio) |
| Peso | 149 g |
| **Memoria interna** | **64 GB** (50 disponibles), ampliable con microSD |
| Lentes | Tapa de lente reemplazable. Acepta lente Macro y lente FOV Boost |

**RECHAZADO, no publicar:** que el 8K de la Action 6 admita D-Log M de 10 bits (DJI no lo publica).
Que el sensor cuadrado permita reencuadrar sin recorte (DJI nunca lo afirmó).

### Superlativos definitivos de los 7

| Eje | Ganador | Orden completo |
|---|---|---|
| **Más profunda sin carcasa** | **DJI Action 6, 20 m** | Action 6 20 > Action 4 18 > X5 15 > GoPro 10 = X3 10 > Akaso y Gadnic (solo con carcasa) |
| **Sensor más grande declarado** | **DJI Action 6, 1/1,1"** | Action 6 > X5 1/1,28 > Action 4 1/1,3 > GoPro 1/1,9 > X3 1/2 · Akaso y Gadnic no declaran |
| **Más liviana declarada** | Gadnic, 58 g | Gadnic 58 < Action 4 145 < Action 6 149 < HERO12 154 < HERO13 159 < X3 180 < X5 200 · Akaso no declara |
| **Más pesada declarada** | **Insta360 X5, 200 g** | **CAMBIÓ**: antes era la X3 |
| Más cara | Insta360 X5 | |
| Más barata | Gadnic | |

### El hallazgo de autonomía, ahora más fuerte

**DJI mide sus DOS cámaras en 1080p a 24 cuadros por segundo**, el modo menos exigente:
Action 6 → 240 min, Action 4 → 160 min. Ninguna de las dos publica autonomía en 4K ni en 8K.

La X5, en cambio, publica los tres números con su resolución: 93 min en 8K, 135 en 5.7K, 208 en
modo de ahorro. Y la GoPro publica en 4K30, 5.3K30 y 1080p30.

Traducido para el lector: **el número más grande de la guía (240 min) es el menos comparable.**

---

## 15. ESTADO FINAL (2026-08-25)

**IMPLEMENTADO EN EL REPO.** El borrador cumplió su función; la fuente de verdad ahora es el código.

- [x] 7 fichas en `src/data/curated-products.ts` (509 productos en total)
- [x] Guía `camara-deportiva` en `src/data/guides.ts`, silo `tech`, pillar
- [x] Categoría `camaras-deportivas` en `guideCategories`
- [x] `tsc --noEmit` en verde
- [x] Los 8 checks del sitio en verde, corridos por separado
- [x] `npm run build` en verde, las 7 fichas se prerenderizan
- [x] Render verificado en vivo: 0 tokens sin resolver, 42 links de afiliado todos con
      `rel="sponsored nofollow noopener"`, precio adentro del botón, "calificaciones" y no "compras"
- [x] URL real: `/guias/tech/camara-deportiva` (usa el **silo**, no la categoría)

### STAGED hasta que Juan diga

`publishedDate: "2026-09-08"`. Publicar = dar vuelta la fecha.

### Pendiente para el momento de publicar

- [ ] **Links entrantes** (paso 10 de `ARTICLE_CREATION_WORKFLOW.md`). NO se agregaron todavía a
      propósito: la guía está STAGED y un link entrante hoy apuntaría a una página que no renderiza.
      Al publicar, agregar a los `internalLinks` de estas tres, con `sitemapLastmod` y **sin tocar
      `updatedDate`**:
      - `power-bank-solar` → ancla "cámara deportiva"
      - `cargador-portatil` → ancla "cámara deportiva"
      - `reloj-garmin` → ancla "cámara deportiva"
- [ ] Trío auditor sobre el contenido ya implementado.
- [ ] Actualizar `CURRENT_STATE.md` al cerrar la sesión.

### Nota sobre el lint

`npm run lint` falla, pero con **5 errores preexistentes** en archivos que esta tarea no tocó
(`use-saved-products.ts`, `use-recently-viewed.ts`, `Header.tsx`, `RecentlyViewed.tsx`,
`SavedProductsView.tsx`) más warnings en scripts viejos. Ninguno está en `guides.ts` ni en
`curated-products.ts`.

### Nota sobre el árbol de trabajo

`src/data/social-posts.ts` y la ficha `MLA69003496` dentro de `curated-products.ts` son de la
**otra sesión**, no de esta tarea. `scripts/publicar-threads.cjs` tampoco.

---

## 16. AUDITORÍA COMPLETA (2026-08-25)

Cinco frentes, cuatro rondas. **87 correcciones aplicadas.**

| Frente | Hallazgos |
|---|---:|
| Auditoría del borrador (3 lentes adversariales) | 18 |
| Codex (4 pasadas) | 14 |
| Gemini/agy (3 pasadas) | 4 |
| Workflow de 4 lentes sobre el código | 24 |
| Workflow de confirmación (2 lentes) | 4 |
| Mis propios barridos por familia de patrón | 19 |
| Mi lectura de la guía de corrido | 4 |

### Los tres errores más graves, todos míos

1. **"Comparte cuerpo, batería y montura"** entre la Osmo Action 4 y la Action 6. Las baterías son
   distintas (1770 vs 1950 mAh). Salió de transponer una nota que decía Action **3**. Habría hecho
   que alguien comprara baterías de repuesto equivocadas.
2. **Exageré la evidencia de las reseñas.** "Varios compradores cuentan que se les rompieron" cuando
   uno solo reportó rotura, y "los tres siguen recomendándola" cuando dos dejaron puntaje.
3. **Claims sobre todo el mercado argentino** cuando solo verifiqué siete fichas, incluido el título
   del H2 de precios. Agravado porque el trust-block admite que la selección partió de las más
   reseñadas: los huecos de precio son en parte un artefacto del criterio.

### Dos falsos positivos rechazados con evidencia

- **Gemini:** "el H2 de agua canibaliza con la FAQ del mismo tema". Un H2 y una FAQ en la misma
  página no canibalizan, y las dos guías de referencia del sitio lo hacen a propósito
  (`robot-aspiradora` 6 de 6, `pava-electrica` 4 de 6).
- **Codex:** "Las 7 mejores cámaras deportivas en Argentina afirma sobre todo el mercado". Ese
  patrón aparece 72 veces en el sitio, `guias.md` lo prescribe como estilo "best of", y el
  trust-block explica el método.

### Lecciones de proceso

- **Barrer los DOS archivos.** Tres veces corregí `guides.ts` y dejé el mismo error textual en el
  verdict de la ficha correspondiente en `curated-products.ts`.
- **Releer el resultado del parche.** Cuatro hallazgos de la última ronda eran artefactos de mis
  propias correcciones: una oración duplicada, un superlativo desmentido dos renglones después por
  la aclaración que yo mismo había agregado, y texto nuevo que reintrodujo un error ya corregido.
- **Reemplazo global, no `count=1`.** Un umbral fijo quedó en 4 lugares porque reemplacé solo el primero.
- **Ojo con los umbrales fijos en pesos.** "Sin pasar el millón y medio" tenía 2,8% de margen contra
  la Action 6 y los precios se resuelven en vivo: se volvía falso solo, sin que nadie tocara nada.

### Estado

`tsc --noEmit`, los 8 checks del sitio y `npm run build` en verde. Render verificado en vivo:
0 tokens sin resolver, 0 markdown crudo, 42 links de afiliado todos con `rel="sponsored"`,
69 items de lista de los cuales 46 llevan link.

---

> **CORRECCIÓN 2026-08-26 — el 154 g de la HERO13 era un error de copia.** Son los gramos de la
> **HERO12**. La HERO13 Black pesa **159 g con batería y dedos de montaje, 125 g sin batería**,
> según la tabla de specs oficial de GoPro (`gopro.com`, locales US y AR) y su artículo de soporte.
> Lo que cierra el caso es la aritmética del propio comunicado de lanzamiento del 4-sep-2024:
> dice que la HERO pesa 86 g y tiene *"46% less mass than HERO13 Black"*. 86 / 0,54 = 159,3 g.
> Con 154 daría 44%, con 157 daría 45%. **GoPro nunca publicó 154 g para la HERO13.**
> Las dos cámaras comparten cuerpo idéntico (71,8 x 50,8 x 33,6 mm); lo que cambia es la batería,
> 1720 mAh contra 1900. Todo lo que decía "mismo peso" en las guías se reemplazó por
> "mismas medidas de cuerpo", que sí está verificado. NO reintroducir el 154 para la HERO13.

