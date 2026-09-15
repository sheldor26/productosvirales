# Guía `osmo-pocket-cual-comprar` — documento de trabajo

> Silo nuevo. La línea Osmo Pocket NO es una cámara deportiva: no se moja, no se cuelga de un casco.
> Categoría propuesta: `camaras-vlog` dentro del silo `tech`.
> Estado: sourcing cerrado, specs y combos en verificación contra DJI.

---

## 1. Por qué este nicho, y por qué es de marca y no de rubro

| Familia | Vol/mes |
|---|---:|
| **Osmo Pocket** (marca + modelos) | **~12.130** |
| Categoría genérica ("cámara para vlogs", "de bolsillo") | ~920 |

Desglose de la familia (Keyword Planner, AR/es, 2026-08-26):

| Keyword | Vol/mes |
|---|---:|
| **osmo pocket 3** | **6.600** |
| osmo pocket | 1.900 |
| osmo pocket 4 | 1.900 |
| dji osmo pocket 4 | 880 |
| camara pocket | 390 |
| camara osmo pocket | 170 |
| osmo pocket 2 | 140 |
| osmo pocket 1 | 70 |
| resto (cámara dji osmo pocket, osmo pocket 5, cámara osmo pocket) | 80 |

**`osmo pocket 3` sola vale 6.600/mes**, más que cualquier keyword suelta del silo de cámaras
deportivas y más de la mitad de toda la marca GoPro (12.100). La genérica es **13 veces más chica**
que la de marca: este nicho se busca por modelo. Por eso la guía es de marca, no de rubro.

Fuera de alcance a propósito: los **estabilizadores/gimbals** (estabilizador dji 320, estabilizador
de camara 260, gimbal para camara 210, etc.) son accesorio, no cámara. Otra góndola.

### Anti-canibalización

Ninguna de las 209 guías del sitio apunta a "osmo pocket". Las únicas dos menciones en el repo son
líneas que escribí yo mismo diciendo que el Pocket queda afuera:

- `dji-cual-comprar`: *"**Osmo Pocket:** las de bolsillo con estabilizador de tres ejes integrado.
  No entran en esta comparativa porque no son cámaras de acción."*
- `insta360-cual-comprar`: *"**Línea Luna:** cámaras de bolsillo con estabilizador de tres ejes
  integrado, que compiten con la DJI Osmo Pocket."*

Las dos quedaron listas para ser el ancla del link entrante.

---

## 2. El ángulo: no hay contra quién comparar, y el problema es el combo

**DJI no tiene competencia real en este rubro en Argentina.** La **Insta360 Luna Ultra**, que es la
respuesta directa al Pocket, ya está listada en la tienda oficial de Insta360 en MercadoLibre
(MLA69620414 y MLAU4846065535) pero con **cero ventas**. Lo mismo la Insta360 X6. Sin ventas no hay
reseñas, y sin reseñas no hay evidencia que citar.

Entonces la decisión del comprador no es de marca. Es **qué generación y, sobre todo, qué combo** —
y ahí está el problema real, que ninguna publicación explica:

> **La misma Osmo Pocket 3 se vende a $1.100.000 y a $2.200.000 según el combo.**
> Exactamente el doble, por accesorios, en la misma cámara.

Un millón cien mil de diferencia es más que el precio entero de la mayoría de las cámaras del
catálogo. Es el mismo patrón que el bundle de la Insta360 X5, pero mucho más extremo.

---

## 3. La góndola (verificado en vivo 2026-08-26)

| Producto | ID | Precio | Rating | Opiniones | Vendidos | Stock |
|---|---|---:|---:|---:|---|---|
| Pocket 3 Combo Estándar | MLA39393179 | $1.100.000 | 4.9 | 76 | +100 | ✅ |
| Pocket 3 Pack Creadores (+ Mic 2) | MLA37134971 | $1.649.999 | 4.9 | **1.183** | +500 | ✅ |
| Pocket 3 Creator Combo | MLA65324256 | $2.200.000 | 4.9 | 42 | +100 | ⚠️ última |
| Pocket 4 Combo Estándar | MLA68244220 | $2.087.949 | 4.9 | 97 | +50 | ⚠️ **última** |
| Pocket 4 Creator combo | MLA68229126 | $2.453.049 | 4.9 | 296 | +100 | ✅ |

**Alcance elegido: 3 fichas** (decisión de Juan, 2026-08-26).

| # | Producto | ID | Precio |
|---|---|---|---:|
| 1 | Pocket 3 Combo Estándar | MLA39393179 | $1.100.000 |
| 2 | Pocket 3 Pack Creadores | MLA37134971 | $1.649.999 |
| 3 | Pocket 4 Creator combo | MLA68229126 | $2.453.049 |

**Quedan afuera dos, las dos por stock:**

- **Pocket 4 Combo Estándar (MLA68244220).** El stock cayó de "últimas 2 unidades" a "¡última
  unidad!" durante la sesión. Cargarla significaría que la guía recomiende algo agotado en días.
  El link de afiliado ya existe y queda guardado abajo: cuando reponga stock se suma en una pasada
  aditiva, que es barata. Es el escalón más barato de la Pocket 4, así que vale la pena sumarla.
- **Pocket 3 Creator Combo (MLA65324256), $2.200.000.** Última unidad y redundante con el Pack
  Creadores. No se pidió link.

Consecuencia editorial: el eje de la guía es **el combo de la Pocket 3**, que además es donde está
la evidencia (1.183 opiniones contra 76 de la Estándar). La Pocket 4 entra como el escalón de
arriba, no como el otro brazo de un 2×2.

### Links de afiliado (Juan, 2026-08-26)

| Producto | `affiliateUrl` |
|---|---|
| Pocket 3 Combo Estándar | https://meli.la/1mFyVcB |
| Pocket 3 Pack Creadores | https://meli.la/1KuDocK |
| Pocket 4 Creator combo | https://meli.la/2M4iC1d |
| ~~Pocket 4 Combo Estándar~~ (sin usar, guardado) | https://meli.la/1qKrPjm |

Los cuatro resuelven 200 a la landing de afiliados con `ref` cifrado, igual que los 15 que ya están
en producción. `curl -I` da 405: hay que usar GET.

### Imágenes (verificadas con GET, no HEAD)

| Producto | Resultado |
|---|---|
| Pocket 3 Estándar | 200 · image/webp · 11.486 b · 197×500 |
| Pocket 3 Pack Creadores | 200 · image/webp · 8.122 b · 263×500 |
| Pocket 4 Estándar | 200 · image/webp · 8.004 b · 500×500 |
| Pocket 4 Creator | 200 · image/webp · 7.236 b · 500×500 |

---

## 4. Las fichas de ML vuelven a mentir, y ahora es un patrón

### El campo "Tamaño del sensor" de MercadoLibre no es confiable

| Publicación | Su propio título dice | Su ficha técnica dice |
|---|---|---|
| Pocket 3 Estándar (MLA39393179) | "Sensor **1 Pulgada**" | **1/2.3"** |
| Pocket 3 Pack Creadores (MLA37134971) | "**CMOS 1\"**" | **1/2.3"** |
| DJI Osmo 360 (MLA53612281) | "última generación de 1/1.1" | **1/2.3"** |

Tres publicaciones distintas, el mismo valor equivocado. **`1/2.3"` es el valor por defecto que ML
pone en la categoría de cámaras**, no un dato del producto. Ya se descartó una vez con la Osmo 360
(el real son dos sensores de 1/1,1"). Regla: **nunca tomar "Tamaño del sensor" de la ficha de ML.**

Curiosamente las dos publicaciones de la Pocket 4 sí lo declaran bien (`1 "`).

### Otras contradicciones de la propia ficha

- **Pack Creadores: "Peso: 179 kg".** Son gramos, obviamente.
- **Pocket 4: las dos publicaciones de la misma cámara se contradicen entre sí.** La Estándar
  declara zoom digital **4x** y autonomía **110 min**; la Creator declara **2x** y **4 h**.
  Y el título de la Estándar dice "Zoom 2x" mientras su propia ficha dice 4x.
- **Pocket 3: una publicación declara 4K/60 y la otra 4K/120** como máximo.
- "Duración máxima de la batería: 140 m / 166 m / 110 m" — minutos mal etiquetados como metros,
  igual que en las fichas DJI de la sesión anterior.
- Pocket 3 Estándar: "Es a prueba de agua: No" y "Es resistente al agua: Sí", en la misma tabla.
- El Pack Creadores declara `Modelo: "Pocket 3 Creator Combo"` mientras su título dice
  "Pack Creadores + Mic 2". Hay que resolver qué trae realmente la caja.

**Nada de esto se publica sin ratificar contra dji.com.** Verificación en curso.

---

## 5. Pendiente de ratificación

1. Sensor real de la Pocket 3 y de la Pocket 4 (¿las dos son de 1 pulgada?).
2. Resolución y fps máximos reales de cada una. El "4K/240" del título de la Pocket 4.
3. Zoom de la Pocket 4: ¿2x o 4x? ¿óptico o digital?
4. Almacenamiento interno: la Pocket 4 declara 107 GB internos y la Pocket 3 parece no tener.
5. Peso real del Pack Creadores.
6. **Qué trae exactamente cada combo, pieza por pieza.** Es la sección más importante de la guía.
7. Qué cambia entre Pocket 3 y Pocket 4, y qué queda igual.

---

## 6. Chequeo cruzado obligatorio

Sumar 3 fichas lleva el catálogo de 522 a 525 y el grupo de cámaras de 19 a 22. Dos cosas que
seguro rompen algo:

- **La Pocket 4 Creator a $2.453.049 pasaría a ser la cámara más cara del catálogo**, desplazando a
  la Insta360 X5 Essentials Bundle ($1.759.229).
- **La Pocket 3 Pack Creadores con 1.183 opiniones** entraría tercera entre las más reseñadas,
  detrás de la GoPro HERO13 (1.723) y la Insta360 X3 (1.691).

Y la regla que ya falló cuatro veces: **corregir en `guides.ts` Y en `curated-products.ts`**, con
reemplazo global, no en la primera ocurrencia.

---

## 7. Estado final (2026-08-26)

### Lo que se construyó

**Guía `osmo-pocket-cual-comprar`** — STAGED (`publishedDate: 2026-09-20`), `pillar: true`.
URL al publicar: `/guias/tech/osmo-pocket-cual-comprar`. 3 product-cards, 3 quickPicks, 9 FAQ,
7 internalLinks, tabla de 3 filas con link de afiliado en cada una.

**Categoría nueva `camaras-vlog`** en el objeto `guideCategories`. Son dos ediciones, las dos en
`guides.ts`: la entrada de la categoría y el campo `category` de la guía. Cero cambios en rutas,
sitemap o breadcrumbs. Verificado en el navegador: `/guias` muestra "Guía de Cámaras para Vlog",
no el slug crudo.

> ⚠️ **Esa es la única falla del trabajo sin trinquete automático.** Si falta la entrada en
> `guideCategories`, `/guias` renderiza `camaras-vlog` en crudo y **los nueve checks pasan igual**,
> `npm run build` también. Ningún script lo valida.

**Tres fichas** (catálogo 522 → 525):

| ID | canonicalName | Precio | Slug |
|---|---|---:|---|
| MLA39393179 | DJI Osmo Pocket 3 | $1.100.000 | `camara-dji-osmo-pocket-3-combo-estandar-mla39393179` |
| MLA37134971 | DJI Osmo Pocket 3 Pack Creadores | $1.649.999 | `camara-dji-osmo-pocket-3-pack-creadores-mla37134971` |
| MLA68229126 | DJI Osmo Pocket 4 | $2.453.049 | `camara-dji-osmo-pocket-4-creator-combo-mla68229126` |

### La tesis

**La Pocket 3 tiene el mismo gimbal, la misma lente y el mismo sensor de 1 pulgada que la Pocket 4**,
que sale $1.353.049 más. Lo que sube en la 4 es el procesado, no la óptica ni el estabilizador,
que es el corazón de una Osmo Pocket. Y el gancho de apertura es el dato que ninguna publicación
aclara: **la Pocket 3 no tiene memoria interna y la tarjeta no viene en la caja.**

### Los tres errores de MercadoLibre, ratificados contra DJI

| Dato | ML decía | DJI oficial |
|---|---|---|
| Sensor de las dos Pocket 3 | 1/2.3" | **1 pulgada** |
| Peso de la Pocket 3 | 116 g en una, **"179 kg"** en la otra | **179 g** |
| Zoom y autonomía de la Pocket 4 | 4x y 110 min en una publicación, 2x y 4 h en la otra | 4x digital en 4K |

El del sensor ya es un patrón confirmado en tres publicaciones distintas y quedó guardado como
regla: `1/2.3"` es el valor por defecto de la categoría cámaras en ML, no un dato del producto.

### La cuenta del combo, que se da vuelta en Argentina

| | DJI oficial | Argentina |
|---|---:|---:|
| Paquete base | USD 499 | $1.100.000 |
| Con accesorios | USD 629 | $2.200.000 |
| **Brecha** | **+26%** | **+100%** |

Y esos accesorios sueltos en la tienda de DJI suman USD 252 contra los 130 que cuesta la brecha:
**afuera el combo es el camino barato, acá te cobran el doble por él.**

### Ocho correcciones a `dji-cual-comprar`, publicada horas antes

Sumar fichas de la línea Pocket cambió el alcance de esa guía, que se había escrito cuando el
Pocket no existía en el sitio. Se corrigieron el `standfirst` y la `metaDescription` (su sujeto era
"las cámaras DJI que verificamos", que pasaban de 5 a 8), el `trust-block`, la escalera de precios,
la sección de evidencia de uso, la FAQ de novedad (la Pocket 4 es de abril de 2026, o sea la DJI
más nueva del sitio), el ítem de la línea Osmo Pocket y el `verdict` de la Action 5 Pro.

### Dos premisas propias que el reconocimiento corrigió

1. Dije que la Pocket 4 sería "la cámara más cara del catálogo". Cierto como **cámara**, falso como
   **producto**: el catálogo tiene una aspiradora Samsung a $3.476.040 y una cafetera a $2.489.999.
2. Dije que el Pack Creadores entraría **tercero** entre las más reseñadas. Entra **cuarto**. Lo que
   sí es cierto y es más fuerte: es la DJI con más opiniones del sitio, contra 402 de la Osmo 360.

Las dos habrían entrado como superlativos si nadie las cruzaba contra el repo.

### Verificación

`tsc --noEmit` y `npm run build` en verde. Los nueve checks de contenido en verde, corridos por
separado. Render en el dev server: cero tokens sin resolver, **24 links `meli.la` y los 24 con
`rel="sponsored"`**, y `/guias` con el nombre de la categoría correcto.

**Gemini: GO**, cero bloqueantes. Sumó una FAQ que faltaba y que cierra el bucle de la propia tesis:
qué tarjeta comprar y de cuántos GB. Con 128 GB la tarjeta aguanta 134 minutos y la batería declara
116 grabando 4K a 60, así que **el límite es la carga, no la memoria**.

**Codex quedó sin cuota** ("usage limit", reintentar 14:15). Se reemplazó su rol con una auditoría
adversarial de tres lentes independientes: superlativos y aritmética, mecánica del repo, y
cumplimiento de la lista negra.

### Al publicar

1. `publishedDate` y `updatedDate` de `osmo-pocket-cual-comprar` → la fecha de publicación.
2. `dji-cual-comprar`, ítem de la línea Osmo Pocket: sumar el link a la guía nueva.
3. `dji-cual-comprar`, `intro[0]`: sumar el link donde nombra la línea de bolsillo.
4. `insta360-cual-comprar`, ítem "Línea Luna": linkear "DJI Osmo Pocket", que hoy es texto plano.
5. `internalLinks` de `dji-cual-comprar`, `camara-deportiva` e `insta360-cual-comprar`.
6. `sitemapLastmod` de las guías tocadas. **Nunca `updatedDate`.**

### Lo que queda afuera, con el link ya generado

**Osmo Pocket 4 Combo Estándar (MLA68244220)**, $2.087.949, `https://meli.la/1qKrPjm`. Se cayó a una
unidad durante la sesión. Es el escalón más barato de la Pocket 4 y vale la pena sumarla cuando
repongan stock: es una pasada aditiva de una sola ficha.

---

## 8. Auditoría (2026-08-26)

**Gemini: GO** en la primera pasada, cero bloqueantes. Aportó la FAQ de la microSD, que cierra el
bucle de la propia tesis de la guía.

**Codex quedó sin cuota** ("usage limit", reintentar 14:15). Se reemplazó su rol con una auditoría
adversarial de tres lentes independientes —superlativos y aritmética, mecánica del repo, y
cumplimiento de la lista negra— más un sintetizador que verificó cada hallazgo contra el archivo
antes de aceptarlo. **Veredicto: NO-GO, 7 bloqueantes reales.**

### Los 7, y qué los causó

| # | Qué decía | Por qué estaba mal |
|---|---|---|
| 1 | "el combo cuesta **el doble**" | Era cierto con 4 fichas. Al bajar a 3 salió el producto que hacía 2x y quedó apuntando al que hace 1,5x |
| 2 | "**el mismo sensor**" en 9 lugares | La Pocket 4 tiene un sensor **distinto del mismo tamaño**. 9,4 MP contra 37 MP no salen del mismo sensor |
| 3 | Afirmaba qué trae el Pack Creadores, en 3 lugares | Contra el ítem 23 de la lista negra. Uno estaba **a cuatro líneas de mi propio callout** que dice "contá los transmisores en la foto" |
| 4 | "la versión con más opiniones **del sitio**" | 286 fichas del catálogo superan las 1.183. Se me cayó el "DJI" |
| 5 | "la **única** con memoria interna" | La guía de DJI publicada horas antes lista cuatro cámaras DJI con memoria interna |
| 6 | "**ninguna** Osmo Pocket tiene zoom óptico" | La Pocket 4 Pro sí lo tiene, y está en la lista negra |
| 7 | "**no es sumergible ni resistente al agua**" | Afirmación negativa sin fuente que la niegue. Tercera vez hoy |

### El patrón

Cinco de los siete son **superlativos o negaciones sobre un conjunto que no medí**. Es el mismo
error que apareció en las guías de DJI, de GoPro y de Insta360. No es descuido de un caso: es la
forma que toma el error cuando se escribe rápido sobre un catálogo grande.

El más instructivo es el #1, porque **no lo causó escribir mal sino achicar el alcance**. La frase
era verdadera con 4 fichas y se volvió falsa al pasar a 3, sin que nadie la tocara: el referente
implícito ("el combo con accesorios") se re-apuntó solo al producto más cercano que quedaba.
Quedó guardado como [[achicar-el-alcance-invalida-comparaciones]].

### Falsos positivos descartados por el sintetizador

- Un lente reportó "596 fichas con más de 1.183 opiniones". Son **286**. El hallazgo se sostenía,
  la cifra no.
- Un lente objetó la cuenta de la tarjeta de 128 GB. La verificación dio que "alrededor de dos
  horas y cuarto" cae entre los 131 minutos decimales y los 141 binarios, y ya está marcada como
  cuenta propia. No se tocó.
- Los tres lentes marcaron "la cámara más cara de nuestro catálogo" como correcto, y el
  sintetizador lo confirmó recorriendo los 845 campos `price`: arriba de $2.453.049 hay dos
  productos y **ninguno es cámara**.

### Mejoras aplicadas

"45% más de **autonomía**" en vez de "de batería" (la batería como capacidad sube 19%, no 45%);
la tabla muestra `166 min (116 en 4K/60)`, que es el número útil según el informe; los 130 Mbps
pasan a declararse como bitrate máximo sin asignarlos a un modo; los dos "menos de la mitad"
—un ratio que ningún check vigila— pasaron a token `{{preciodif:}}`; y se acotaron la afirmación
de mercado sobre la competencia y el "la más barata de la línea".


---

## 9. Cierre de auditoría: GO

| Pasada | Veredicto |
|---|---|
| Gemini (SERP/GEO) | **GO**, cero bloqueantes |
| Adversarial 1ª | NO-GO, 7 |
| Adversarial 2ª | NO-GO, 5 |
| Adversarial 3ª | NO-GO, 4 |
| Adversarial 4ª | NO-GO, 4 |
| **Cierre** | **GO** |

**20 bloqueantes reales corregidos.** Codex no participó: quedó sin cuota de uso.

### El patrón, que es lo que hay que llevarse

Casi todos los 20 fueron **superlativos o negaciones sobre un conjunto que no se midió**. Y desde la
segunda pasada en adelante, **la mayoría los introdujeron las correcciones anteriores**: cada arreglo
abría una familia que no se barría entera. Ejemplos concretos:

- Corregir "la única con memoria interna" → "la única **Osmo Pocket** con memoria interna" introdujo
  un error nuevo, porque existe la Pocket 4 Pro. Terminó en "la **primera**".
- Corregir la FAQ de novedad acotándola a "las que se consiguen en Argentina" declaró el mercado
  argentino entero, que tampoco se midió. Terminó en "las tres que verificamos".
- El arreglo del pack decía "un transmisor es el Creator Combo", pero hay **tres** Vlog Combo con un
  solo transmisor. Y la autonomía de 6 horas colgaba de esa identificación.

La familia del micrófono abrió bloqueantes en las cuatro pasadas. Es la que más caro sale porque
mezcla tres cosas que cambian juntas: qué combo es, cuántos transmisores trae y qué autonomía tiene.

### Salvedad sobre el auditor de cierre

Afirma que la Pocket 4 es "el producto más caro de las 496 fichas". **Es incorrecto**: son 525 fichas
y hay una aspiradora Samsung a $3.476.040 y una cafetera a $2.489.999. Su veredicto sobre esa línea
es correcto igual, porque el texto publicado dice "la cámara más cara", que es la versión angosta y
verdadera. Pero el razonamiento no se puede reusar. Es el tercer auditor de esta sesión que llega a
la conclusión correcta con una premisa falsa sobre el precio máximo del catálogo.
