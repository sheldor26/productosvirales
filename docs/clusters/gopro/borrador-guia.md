# Guía hija `gopro-cual-comprar` — documento de trabajo

> Hija de marca del pilar `camara-deportiva`, publicado el 2026-08-25.
> Estado: sourcing cerrado, specs en verificación.

---

## 1. Cabecera propuesta

| Campo | Valor |
|---|---|
| `slug` | `gopro-cual-comprar` |
| `category` | `camaras-deportivas` (la misma del pilar) |
| `silo` | `tech` |
| `pillar` | `false` (es hija) |
| URL | `/guias/tech/gopro-cual-comprar` |

## 2. Keywords (Keyword Planner, 2026-08-25)

| Keyword | Vol/mes |
|---|---:|
| **gopro** | **12.100** |
| camara gopro / camaras go pro | 2.400 |
| gopro hero 13 (+ variantes) | ~1.300 |
| go pro hero | 720 |
| gopro hero 12 (+ variantes) | ~620 |
| **go pro hero 4** | **480** |
| **go pro 360** | **390** |
| gopro mission 1 | 170 |
| gopro hero 14 (NO EXISTE) | ~110 |

Dos rarezas del rubro: **la Hero 4, de 2014, todavía se busca 480 veces por mes**, y hay 390/mes
de gente que asocia GoPro con 360, que es justo donde GoPro no lidera la conversación.

### Anti-canibalización con el pilar

El pilar `camara-deportiva` apunta a "camara deportiva" (720/mes) y compara MARCAS distintas.
Esta hija apunta a "gopro" (12.100/mes) y compara MODELOS de una sola marca. Intenciones
distintas, sin superposición de keyword objetivo. Las dos enlazan a la misma ficha de la HERO13.

## 3. Los 6 productos (todos nacionales, todos InStock, verificado 2026-08-25)

| Producto | ID | Precio | Rating | Opiniones | Vendidos | `affiliateUrl` |
|---|---|---:|---:|---:|---|---|
| GoPro HERO (2024) | MLA50182399 | $439.894 | 4.6 | 163 | +500 | https://meli.la/1QBoj7j |
| GoPro LIT HERO | MLA57723897 | $549.999 | 4.7 | 62 | +50 | https://meli.la/1mSw7tg |
| GoPro HERO12 Black | MLA27104632 | $749.999 | 4.8 | 809 | +1000 | https://meli.la/2LwDkrh |
| GoPro HERO13 Black | MLA47374183 | $930.999 | 4.9 | 1.721 | +1000 | (ya en catálogo) |
| GoPro MAX2 360 | MLA57726638 | $1.049.999 | 4.9 | 163 | +50 | https://meli.la/2UFxMYf |
| GoPro MISSION 1 PRO | MLA70063378 | $1.749.999 | 5.0 | 18 | +5 | https://meli.la/2wfoNsW |

### Slugs canónicos (calculados con productSlug() real)

```
/producto/camara-deportiva-gopro-hero-2024-mla50182399
/producto/camara-deportiva-gopro-lit-hero-mla57723897
/producto/camara-deportiva-gopro-hero12-black-mla27104632
/producto/camara-deportiva-gopro-hero13-black-mla47374183   (ya existe)
/producto/camara-360-gopro-max2-mla57726638
/producto/camara-gopro-mission-1-pro-mla70063378
```

### Imágenes (verificadas con GET real, no HEAD)

| ID | Bytes | URL |
|---|---:|---|
| MLA50182399 | 10.540 | `D_NQ_NP_928940-MLA95635379046_102025-O.webp` |
| MLA57723897 | 10.754 | `D_NQ_NP_733257-MLA111917618490_062026-O.webp` |
| MLA27104632 | 11.242 | `D_NQ_NP_807706-MLA99475263428_112025-O.webp` |
| MLA57726638 | 20.124 | `D_NQ_NP_643268-MLA92893481526_092025-O.webp` |
| MLA70063378 | 9.176 | `D_NQ_NP_961798-MLA111078257278_052026-O.webp` |

---

## 4. TABLA DE VERDAD — chequear TODO superlativo contra esto

| Afirmación | Dueño | Ojo |
|---|---|---|
| La más cara | MISSION 1 PRO ($1.749.999) | |
| La más barata | HERO (2024) ($439.894) | |
| La más opinada | HERO13 Black (1.721) | |
| La menos opinada | MISSION 1 PRO (18) | |
| **El puntaje más alto** | **MISSION 1 PRO (5.0)** | **TRAMPA: son 18 opiniones. Es cierto y no significa nada. Nunca usarlo sin la base al lado** |
| El puntaje más bajo | HERO (2024) (4.6) | |
| **La más vendida** | **EMPATE A DOS** | HERO12 y HERO13, las dos +1000. **NUNCA en singular** |
| Rating 4.9 | **EMPATE A DOS** | HERO13 y MAX2 |
| Sensor más grande | MISSION 1 PRO (1") | Después MAX2, HERO13/HERO12 (1/1,9"), HERO 2024 (1/2,8") |
| La más profunda sin carcasa | MISSION 1 PRO (20 m) | HERO12 y HERO13 10 m; HERO 2024 y LIT HERO 5 m |
| La más liviana | HERO (2024) (86 g) | LIT HERO 93 g; HERO12 154 g; HERO13 159 g |

**La escalera de precios es PAREJA**, sin huecos: 440k → 550k → 750k → 931k → 1.050k → 1.750k.
Es el contraste exacto de la tesis del pilar, donde había dos pozos. Sirve para explicar por qué
comprar dentro de una marca es distinto a comprar por categoría.

---

## 5. Specs verificadas (fuente: gopro.com e investor.gopro.com)

### GoPro HERO12 Black

| Spec | Valor |
|---|---|
| **GPS** | **NO TIENE.** Primera GoPro insignia sin GPS desde la HERO5 de 2016. GoPro sacó el hardware; la HERO11 sí lo tenía |
| Sensor | CMOS 1/1,9", 8:7, 27,6 MP activos |
| Video | 5.3K a 60 fps (16:9); 4K a 120; 2.7K a 240; 1080p a 240 |
| Estabilización | HyperSmooth 6.0 con AutoBoost |
| Batería | Enduro extraíble de 1720 mAh |
| Autonomía | 70 min en 5.3K60 · +95 min en 5.3K30 · 58 min en 4K120 · +155 min en 1080p30 |
| Sumergible | 10 m sin carcasa; 60 m con carcasa |
| Peso | HERO12: 154 g con batería y dedos; 121 g sin. HERO13: 159 g / 125 g |
| Pantallas | Trasera táctil 2,27" y frontal a color 1,4" |

**NO publicar de la HERO12** (el verificador los dejó en duda): capacidad máxima de microSD,
cantidad de micrófonos, rango ISO, apertura del lente, y si hace 5.3K a 50 fps.

### GoPro HERO (2024)

| Spec | Valor |
|---|---|
| Sensor | CMOS de **1/2,8"** (bastante más chico que el 1/1,9" de las Black) |
| Peso | **86 g** |
| Ángulo | 165 grados |
| **Estabilización** | **HyperSmooth que NO se aplica en la cámara: se aplica al reproducir, dentro de la app Quik** |
| **Batería** | **Integrada, no se puede sacar ni cambiar.** Carga por USB-C |
| Autonomía | Hasta 100 min continuos en su modo de video más alto (4K a 30 fps) |
| Sumergible | 5 m sin carcasa |
| Pantalla | Táctil trasera LCD de 1,76" |

**NO publicar de la HERO (2024):** capacidad de la batería en mAh (GoPro no la publica; el 1.255
mAh que aparece en la ficha de ML circula en bases de datos de terceros), el procesador, y las
medidas exactas (dos fuentes de GoPro se contradicen).

**OJO CON EL NOMBRE:** la publicación de ML la llama "GoPro HERO Fraction Mini". Ese nombre NO
existe en el catálogo de GoPro. El código de modelo de la publicación es **CHDHF-131-AT** y las
specs declaradas (86 g, 5 m, 4K, 12 MP) coinciden exacto con la **HERO (2024)**. Es el mismo caso
que la "Gadnic Air".

### GoPro MISSION 1 PRO

| Spec | Valor |
|---|---|
| Sensor | **1 pulgada** tipo 4:3, Quad Bayer, 50 MP (7680 x 5760) |
| Video a sensor completo (4:3) | 8K a 30 fps y 4K a 120. La MISSION 1 base NO llega a 8K en 4:3 |
| Autonomía (oficial) | 5 h en 1080p30 (modo ahorro) · +3 h en 4K30 · 1,5 h en 8K30 |
| Batería | Enduro 2 de 2150 mAh extraíble, **compatible con las baterías de la HERO13 Black** |
| Sumergible | **20 m sin carcasa** (sube desde los 10 m de la generación anterior); 60 m con carcasa |
| Pantallas | Trasera OLED táctil de **2,59"**; frontal LCD de 1,4" |
| Apertura | F2.8 |
| Zoom | 2x real aprovechando el sensor Quad Bayer |
| Estabilización | HyperSmooth con bloqueo de horizonte de 360 grados |

**NO publicar de la MISSION 1 PRO:** el peso (gopro.com dice 207 g y otra fuente 208 g, se
contradicen), el tiempo de carga rápida (27 min vs 20 min según fuente), y la autonomía a 8K60.

### PENDIENTE de verificación

- **LIT HERO**: specs completas, sobre todo qué hace la luz LED y si estabiliza en cámara.
- **MAX2**: resolución 360, sensor, GPS, lentes reemplazables, sumergible, autonomía.
- **¿La HERO13 Black tiene GPS?** Es el dato que decide la comparativa HERO12 vs HERO13.

---

## 6. Contradicción heredada del pilar, para no tropezar dos veces

**Resuelto el 2026-08-26: la HERO13 pesa 159 g.** Lo que decía esta sección era falso en
las dos mitades: el comunicado de lanzamiento NO declara ningún peso, y la ficha de specs
que decía 154 era la de la HERO12. Ver el bloque de corrección al final del documento.

---

## 7. El ángulo de la guía

**La pregunta que la sostiene: HERO12 contra HERO13, por $181.105 de diferencia.** Las dos tienen
+1000 vendidos, el mismo sensor de 1/1,9", el mismo 5.3K a 60 fps, los mismos 10 m de agua y el
mismas medidas de cuerpo (71,8 x 50,8 x 33,6 mm). NO el mismo peso: la HERO12 pesa 154 g y la
HERO13 159 g. Lo que cambia hay que decirlo con precisión, y por eso importa el dato de GPS.

**Segundo ángulo: GoPro sí tiene una 360, y casi nadie lo sabe.** La MAX2 hace 8K en 360 y sale
$709.230 menos que la Insta360 X5 del pilar. Eso le contesta con producto real a los 390/mes de
"go pro 360" y conecta los dos silos.

**Tercer ángulo: la barata de GoPro tiene una trampa.** La HERO (2024) no estabiliza en la cámara,
lo hace después en la app. Para alguien que compra una GoPro justamente por la estabilización, eso
cambia la expectativa, y su publicación no lo menciona.

---

## 8. EL DATO QUE ORDENA LA GUÍA: el GPS

Fuente madre: GoPro Support, "How To Turn On GPS With GoPro Cameras", actualizado 03/08/2026.
Lista textual de cámaras compatibles con GPS.

| Modelo | GPS | Evidencia |
|---|---|---|
| **HERO13 Black** | **SÍ** | Tres fuentes oficiales: artículo de soporte propio, comunicado del 04/09/2024 ("GPS + Performance Stickers") y la página de producto |
| **HERO12 Black** | **NO** | Ausente de la lista oficial. GoPro le sacó el hardware; primera insignia sin GPS desde la HERO5 de 2016 |
| **HERO (2024)** | **NO** | **Negación explícita**: la ficha oficial tiene la fila "GPS ---", que es como GoPro marca "no disponible" |
| **LIT HERO** | **NO** | Ausencia triple: no está en la lista, no aparece en la ficha, y cero menciones en las 1.557 líneas del manual |
| **MAX2** | **SÍ** | GoPro afirma que es la única cámara 360 con GPS integrado |
| MISSION 1 (serie) | SÍ | En la lista oficial |

### Qué se pierde sin GPS, textual de GoPro

1. Los **Performance Stickers** de la app Quik: velocímetro, terreno, recorrido, gráfico de
   velocidad, altitud y fuerza G, superpuestos al video.
2. El dato **GPMF** para apps de terceros (velocidad, altitud, ruta).
3. La detección de momentos para las ediciones automáticas de Quik.

### GOTCHA para el auditor, escrito a propósito

La solapa de specs de gopro.com de la HERO13 Black **NO tiene fila "GPS"** en "Connected
Features": solo Wi-Fi, Bluetooth, USB y Auto Upload. Es una inconsistencia de la tabla de GoPro,
no significa que no lo tenga. La misma página, en la nota al pie de autonomía, aclara que la
medición se hace "voice control and GPS off". Si alguien audita mirando solo esa tabla, va a
concluir que falta. La evidencia real son las tres fuentes de arriba.

---

## 9. Specs verificadas de LIT HERO y MAX2

### GoPro LIT HERO (CHDHF-132)

| Spec | Valor |
|---|---|
| **Luz LED** | **Tres niveles** (bajo, medio, alto) con botón dedicado. Funciona **incluso con la cámara apagada**, o sea que sirve de linterna |
| **Lo que cuesta la luz** | 175 min en 1080p30 con la luz apagada contra **112 min con el LED al máximo**: unos **63 minutos menos**, alrededor de un tercio |
| **Estabilización** | **NO estabiliza en la cámara.** Textual de la ficha: "Image stabilization applied in post". El video sale sin estabilizar en la pantalla de la cámara, en apps de terceros y en la biblioteca de gopro.com. Hay que pasarlo por Quik |
| **Batería** | **Integrada de 1255 mAh, NO se puede sacar.** GoPro dice que hay que llamar al servicio técnico por cualquier tema de batería. No existe llevar una de repuesto |
| Autonomía (luz apagada) | 113 min en 4K30 · 175 min en 1080p30 · 141 min en 1080p60 |
| Sumergible | 5 m sin carcasa, con la tapa trabada. **No es sumergible mientras carga** |
| Video | 4K a 60/30 fps (el 4K60 se graba desde el modo Slo-Mo, no desde Video) · 1080p a 60/30 |
| Cámara lenta | 2x, en 4K60 y 1080p60 |

**NO publicar:** el brillo de la luz en lúmenes. GoPro no lo publica en ninguna fuente.

### GoPro MAX2 (CHDHZ-311)

| Spec | Valor |
|---|---|
| Video 360 | **8K (7680 x 3840) a 30 fps** · 5.6K a 60 · 4K a 100 |
| Video con un solo lente | 4K a 60 fps en 16:9, 9:16 y 4:3 |
| Sensor | 1/2,3". Dos sensores que suman 29 millones de píxeles |
| Apertura | F1.8 |
| **GPS** | **Sí.** GoPro afirma que es la única 360 con GPS integrado |
| **Lentes reemplazables** | **Sí, "Twist-and-Go": los cambia el usuario en el momento, sin herramientas ni calibración.** La Insta360 X5 necesita kit y recalibrar la costura |
| **Sumergible** | **Solo 5 m**, y GoPro aclara que **no está pensada para uso bajo el agua** porque la imagen se distorsiona: el sellado es para salpicaduras y lluvia |
| Batería | Enduro de 1960 mAh, extraíble |
| Peso | 195 g |
| Pantalla | Táctil LCD de 1,82" |

**NO publicar de la MAX2:** la autonomía (GoPro no publica ningún número oficial y las fuentes de
prensa se contradicen) y la tasa de bits (la landing dice 300 Mbps y la ficha técnica 120 Mbps).

---

## 10. EL ÁNGULO DEFINITIVO

**La pregunta de la guía: ¿qué comprás con los $181.105 que separan a la HERO12 de la HERO13?**

Las dos comparten sensor (1/1,9"), video máximo (5.3K a 60 fps), agua (10 m), medidas de cuerpo y
las dos tienen +1000 vendidos. La respuesta concreta y verificable es **el GPS**: GoPro se lo
sacó a la HERO12 y se lo devolvió a la HERO13. Sin GPS no tenés velocímetro, altitud, recorrido
ni fuerza G superpuestos al video.

Traducido a la decisión: si filmás en moto, bici, esquí o corriendo y querés esos datos en
pantalla, la HERO13. Si no te interesan, **la HERO12 es prácticamente la misma cámara por
$181.105 menos**, y eso ningún comparador argentino lo dice.

**Segundo ángulo: las dos GoPro baratas no estabilizan en la cámara.** Ni la HERO (2024) ni la
LIT HERO. Aplican HyperSmooth recién al pasar el video por la app Quik. Quien compra una GoPro
justamente por la estabilización tiene que saberlo, y ninguna de las dos publicaciones lo menciona.

**Tercer ángulo: GoPro sí tiene una 360 y contesta los 390/mes de "go pro 360".** La MAX2 hace 8K,
tiene GPS y sus lentes se cambian sin herramientas, algo que la Insta360 X5 del pilar no permite.
Pero se moja solo 5 m contra los 15 de la X5, y GoPro admite que no es para usar bajo el agua.

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

