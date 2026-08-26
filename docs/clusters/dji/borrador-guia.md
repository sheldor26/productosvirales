# Guía hija `dji-cual-comprar` — documento de trabajo

> Hija de marca del pilar `camara-deportiva`, publicado el 2026-08-25.
> Tercera hija del silo, después de `gopro-cual-comprar` e `insta360-cual-comprar`.
> Estado: sourcing cerrado. Specs en verificación contra DJI.

---

## 1. Cabecera propuesta

| Campo | Valor |
|---|---|
| `slug` | `dji-cual-comprar` |
| `category` | `camaras-deportivas` (la misma del pilar) |
| `silo` | `tech` |
| `pillar` | `false` (es hija) |
| URL | `/guias/tech/dji-cual-comprar` |

## 2. Keywords (Keyword Planner, 2026-08-26, AR/es)

### Cabecera de marca — el objetivo de la guía

| Keyword | Vol/mes |
|---|---:|
| **camara dji** | **880** |
| dji camaras | 390 |
| camara osmo | 390 |
| osmo camara | 110 |
| cámara osmo | 90 |
| camara deportiva dji | 40 |
| camara de accion dji | 30 |
| dji action cam / action cam dji | 60 |
| dji camara deportiva | 20 |
| camera dji osmo | 10 |
| **Subtotal marca** | **~2.020** |

### Por familia de producto

| Familia | Keywords | Vol/mes |
|---|---|---:|
| **Osmo Action** | osmo action 5 pro 390 · dji osmo action 4 390 · dji osmo action 6 320 · dji osmo action 170 · osmo action 90 · cámara dji osmo action 70 · dji osmo action 3 70 · resto ~210 | **~1.710** |
| **Osmo 360** | dji osmo 360 480 · osmo 360 260 · camara 360 dji 50 | **~790** |
| **Osmo Nano** | osmo nano 320 | **~320** |
| **TOTAL cámaras DJI** | sin drones ni estabilizadores | **~4.840** |

**Dos hechos que ordenan la guía:**

1. **La Action 5 Pro (390/mes) se busca más que la Action 6 (320/mes)**, siendo la 6 más nueva.
   No es ruido: es el patrón de "el modelo anterior es el que conviene" y es el eje del artículo.
2. Las tres cámaras que se suman ahora valen **1.500/mes de búsqueda por modelo exacto**
   (790 + 390 + 320) que hoy el sitio no captura con ninguna ficha.

### Fuera de alcance, a propósito

La familia **Osmo Pocket** suma mucho más (osmo pocket 3 6.600 · osmo pocket 4 1.900 + 880 ·
osmo pocket 1.900 · camara pocket 390 · camara osmo pocket 170) pero **no es una cámara deportiva**:
es una cámara de vlog con gimbal. Meterla acá ensucia el silo. Va en guía y silo propios.

Lo mismo con **drones DJI** (~9.400/mes) y **estabilizadores** (~700/mes): otra góndola.

### Anti-canibalización

- El pilar `camara-deportiva` apunta a "camara deportiva" (720/mes) y compara **marcas distintas**.
- `gopro-cual-comprar` apunta a "gopro" (12.100/mes), modelos de una marca.
- `insta360-cual-comprar` apunta a "insta360", modelos de una marca.
- Esta hija apunta a **"camara dji" (880/mes) + la cabecera de marca**, modelos de una marca.

Ninguna comparte keyword objetivo. Las cuatro enlazan a las mismas fichas de Action 4 y Action 6.

---

## 3. El ángulo editorial

**DJI mete cuatro formas de cámara distintas bajo un mismo nombre: Osmo.** (Insta360 también cubre los cuatro formatos, con las líneas X, GO, Ace y Luna, pero con nombres distintos: por eso el diferencial de DJI es el nombre, no la variedad.)

| Formato | GoPro | Insta360 | DJI |
|---|---|---|---|
| Acción tradicional | HERO13, HERO12, LIT HERO, HERO (2024) | — | Action 4, Action 5 Pro, Action 6 |
| 360 | MAX2 | X3, X4, X4 Air, X5 | **Osmo 360** |
| Diminuta | MISSION 1 PRO | GO 3S | **Osmo Nano** |
| Bolsillo con gimbal | — | — | Osmo Pocket 3, Pocket 4 |

Consecuencia: **"quiero una DJI" es la búsqueda que menos te dice qué comprar**, porque DJI
tiene un producto bueno en cada formato. Ese es el trabajo de la guía, y es un trabajo distinto
del que hacen las hijas de GoPro y de Insta360, que comparan modelos de un mismo formato.

Segundo eje: **el escalón generacional dentro de Osmo Action**. Action 4 (2023) → Action 5 Pro
(2024) → Action 6 (2025), tres generaciones vivas y con stock al mismo tiempo, con la del medio
siendo la más buscada. Es el mismo ángulo de honestidad de generaciones del pilar, aplicado adentro
de una sola marca.

---

## 4. Los 3 productos nuevos (verificado en vivo 2026-08-26)

| Producto | ID | Precio | Rating | Opiniones | Vendidos | Stock | Vendedor |
|---|---|---:|---:|---:|---|---|---|
| DJI Osmo 360 Combo Aventura | MLA53612281 | $1.418.249 | 4.9 | 402 | +100 | Sí | Tienda oficial DJI |
| DJI Osmo Action 5 Pro Estándar | MLA66182550 | $962.099 | 4.9 | 133 | +100 | Sí | SKY-VISION |
| DJI Osmo Nano 64 GB | MLA58197668 | $1.085.999 | 4.9 | 130 | +25 | **Últimas 3 unidades** | — |

### Links de afiliado (Juan, 2026-08-26)

| Producto | `affiliateUrl` |
|---|---|
| Osmo 360 | https://meli.la/2naAZa4 |
| Osmo Action 5 Pro | https://meli.la/1huzN54 |
| Osmo Nano 64 GB | https://meli.la/24FBCnU |

Los tres resuelven 200 a la landing de afiliados `/social/jm159` con `ref` cifrado. **Eso es el
comportamiento normal**: se contrastó contra `meli.la/1aZAhAC` y `meli.la/2aHXLeQ`, ya publicados
hace semanas, y hacen exactamente lo mismo. El destino lo resuelve la app de ML (`forceInApp=true`),
no la web de escritorio. `curl -I` da 405: hay que usar GET.

### Imágenes (verificadas con GET, no HEAD)

| Producto | URL | Resultado |
|---|---|---|
| Osmo 360 | `D_NQ_NP_891130-MLA98865268363_112025-O.webp` | 200 · image/webp · 19.002 b · 500×444 |
| Action 5 Pro | `D_NQ_NP_855156-MLA107408029988_032026-O.webp` | 200 · image/webp · 17.444 b · 500×406 |
| Osmo Nano | `D_NQ_NP_667144-MLA99624766844_122025-O.webp` | 200 · image/webp · 12.734 b · 426×500 |

Existe variante `_2X_` de mayor resolución (~1000 px) y funciona, pero **las 16 fichas de cámara
del catálogo usan el formato normal**. Se mantiene la convención del silo.

---

## 5. Ficha técnica cruda de ML (SIN ratificar — ver sección 6)

### Osmo 360 — MLA53612281 · 29 campos · Tienda oficial DJI

Peso 183 g · Pantalla 2,25" · Batería 1,3 Ah · Video 8K · Foto 12 Mpx ·
Micro-SD UHS-I · Bluetooth + Wi-Fi · USB-C · MOV/MP4 · pantalla táctil ·
enfoque manual · cámara lenta · estabilizador · a prueba de agua

> ⚠️ **CONTRADICCIÓN INTERNA DE LA PROPIA PÁGINA.** La ficha técnica dice
> **"Tamaño del sensor: 1/2.3"**, pero el texto descriptivo de la misma página dice
> **"última generación de 1/1.1 pulgada"**. No se puede publicar ninguno de los dos
> hasta ratificar contra DJI. Es el dato que define si le gana o no a la Insta360 X5 (1/1.28").
>
> ⚠️ "Duración máxima de la batería: 100 m" — la unidad está mal etiquetada en ML,
> son minutos, no metros. No copiar el campo tal cual.
>
> ⚠️ Foto declarada 12 Mpx en la ficha técnica, pero el título dice 120 MP. Otra contradicción interna.

### Osmo Action 5 Pro — MLA66182550 · solo 13 campos · ficha pobre

Marca DJI · Modelo Action 5 Pro · CMOS · a prueba de agua · Li-ion · NTSC/PAL ·
Resoluciones declaradas: 1080p/240, 2.7K/60, **4K/60**

> ⚠️ **4K/60 como máximo huele a incompleto** — 13 campos es muy poco.
> Ratificar el máximo real contra DJI antes de escribir.

### Osmo Nano 64 GB — MLA58197668 · 25 campos

Peso **52 g** · 2,8 × 2,95 cm · Pantalla 1,96" · Batería 530 mAh ·
Video 3840×2160 / 2880×2160 / 1920×1080 · Foto 6880×5160 · Micro-SD ·
Wi-Fi + Bluetooth · MP4 · a prueba de agua · sensor CMOS 1/1.3" (del título)

> ⚠️ **Los 52 g: ¿son el módulo solo o el módulo + Vision Dock?** DJI vende la Nano
> en dos piezas que se separan. Comparar la pieza equivocada contra la Insta360 GO 3S
> es el error más fácil de cometer acá.
>
> ⚠️ "Duración máxima de la batería: 200 m" — otra vez minutos mal etiquetados.

---

## 6. Pendiente de ratificación contra el fabricante

1. Sensor real de la Osmo 360 (1/2.3" vs 1/1.1") y la comparación honesta contra la X5.
2. Resolución y fps máximos reales de la Action 5 Pro.
3. A qué pieza corresponden los 52 g de la Nano, y contra qué pieza de la GO 3S se compara.
4. Qué cambia exactamente entre Action 4 → Action 5 Pro → Action 6.

**Regla: lo que no se ratifique, no se publica.** Preferimos omitir el dato antes que publicar
un dato dudoso. Ya pasó con la autonomía en 8K de la Insta360 X5: dos fuentes oficiales daban
93 y 100 minutos, y no se publicó ninguna de las dos.

---

## 7. Chequeo cruzado obligatorio antes de escribir

Sumar 3 fichas al grupo de cámaras lo lleva de 16 a **19**. Cada vez que se sumaron fichas a este
silo se rompieron afirmaciones ya publicadas: 5 al sumar las GoPro, 4 al sumar las Insta360.

Superlativos a re-verificar con los números nuevos:

- Todo claim de precio: la Osmo 360 ($1.418.249) cae entre la Insta360 X5 y la Action 6.
- Todo claim de "la más reseñada" entre 360: la Osmo 360 tiene **402 opiniones**.
- Todo claim de "la más chica / más liviana": entra la Nano.
- Todo claim de "las dos DJI" / "ambas DJI": pasan de 2 a 5.
- Cuántas cámaras 360 hay en el catálogo.
- **Auditoría aritmética**: toda relación numérica dicha en palabras ("el doble", "la mitad")
  se recalcula contra los números reales. Este error ya se cometió dos veces.

**Y la regla que ya falló tres veces: corregir en `guides.ts` Y en `curated-products.ts`,
con reemplazo global, no en la primera ocurrencia.**

---

## 8. Estado final (2026-08-26)

### Lo que se construyó

**Guía `dji-cual-comprar`** en `src/data/guides.ts` — **PUBLICADA el 2026-08-26**.
URL al publicar: `/guias/tech/dji-cual-comprar`. 5 product-cards, 4 quickPicks, 8 FAQ,
8 internalLinks, tabla comparativa de 5 filas con link de afiliado en cada una.

**Tres fichas** en `src/data/curated-products.ts` (el catálogo pasó de 519 a 522):

| ID | canonicalName | Precio | Slug |
|---|---|---:|---|
| MLA66182550 | DJI Osmo Action 5 Pro | $962.099 | `camara-deportiva-dji-osmo-action-5-pro-mla66182550` |
| MLA53612281 | DJI Osmo 360 | $1.418.249 | `camara-dji-osmo-360-combo-aventura-mla53612281` |
| MLA58197668 | DJI Osmo Nano | $1.085.999 | `camara-dji-osmo-nano-64gb-mla58197668` |

### La tesis de la guía

**La del medio es la que conviene.** La Osmo Action 5 Pro graba el mismo 4K a 120 cuadros
y se moja los mismos 20 metros que la Action 6, por $581.550 menos. Lo único que suma la 6
es la apertura variable y el sensor de 1/1,1. Y el dato de búsqueda lo respalda: la 5 Pro
se busca 390 veces por mes contra 320 de la Action 6, que es más nueva.

### Ratificación de specs: los dos errores de MercadoLibre

| Dato | ML decía | DJI oficial | Fuente |
|---|---|---|---|
| Sensor Osmo 360 | 1/2.3" | **dos de 1/1,1"** | `dji.com/360/faq` + `dji.com/360/specs` |
| Video Action 5 Pro | 4K/60 | **4K/120** | `dji.com/osmo-action-5-pro/specs` |

El informe completo, con lista negra de 37 datos no publicables, está en
[`specs-ratificadas.md`](specs-ratificadas.md). El reconocimiento del catálogo, en
[`brief-recon.md`](brief-recon.md).

### Decisión de arquitectura

Las 3 fichas entran **solo a la guía hija**, no al pilar. Es el patrón que ya seguía el silo
sin estar escrito: GoPro tiene 6 fichas y 1 sola en el pilar; Insta360 tiene 6 y 2 en el pilar.
Así el pilar sigue con sus siete cámaras y su tesis de "tres tramos y dos pozos" queda intacta.

### Correcciones de consistencia aplicadas a contenido ya publicado

| # | Qué decía | Por qué se rompía | Archivos |
|---|---|---|---|
| R1 | Action 6: "lo más profundo que llega una cámara de acción del catálogo" | La Action 5 Pro declara los mismos 20 m | guides.ts (2) + curated (1) |
| R2 | Gadnic: "la cámara de acción más liviana del catálogo" | **Ya era falso**: la Insta360 GO 3S declara 39,1 g contra 58 | guides.ts + curated |
| R3 | Ítem "**DJI.**" describía una sola línea | DJI tiene tres líneas de cámara | guides.ts |
| R4 | "DJI mide sus dos cámaras" | Se lee como "las dos que hace DJI"; ahora hay cinco fichas | guides.ts (2) |
| R5 | "RockSteady 3.0 en las dos DJI" | La Osmo 360 no usa RockSteady | guides.ts |
| R6 | "la única que trae memoria interna" | La Osmo Nano trae 64 GB, y lo dice en el nombre | guides.ts (3) |
| R7 | "En esta guía las 360 son la X3 y la X5" | El catálogo pasó a tener siete cámaras 360 | guides.ts |
| R8 | metaDescription: "el modelo actual de GoPro, DJI e Insta360" | Presupone un modelo actual por marca | guides.ts |
| R10 | `relatedProducts` de las dos DJI viejas | Cruces recíprocos con las nuevas | curated (2) |

Además, dos errores **propios** encontrados releyendo lo recién escrito:

- Escribí *"la única de las cuatro cámaras 360 de nuestro catálogo"* cuando el catálogo tiene
  **siete**. Corregido en 6 lugares: ahora nombra las tres cámaras cuyo techo sí se verificó
  (X5, X4 y MAX2) en vez de reclamar exclusividad sobre un conjunto que no medí.
- Escribí que los 20 m eran el máximo del catálogo sin decir que la **GoPro MISSION 1 PRO
  también declara 20 m**. Es empate a tres. Corregido en 4 lugares, en los dos archivos.

### Publicación (hecha el 2026-08-26)

Durante la construcción no se agregaron links entrantes, porque `findGuideByPath` filtra por
`getPublishedGuides()` y una guía STAGED devuelve 404. Al publicar se hicieron los seis pasos:

1. ✅ `publishedDate` y `updatedDate` de `dji-cual-comprar` → 2026-08-26.
✅ 2. Pilar `camara-deportiva`, ítem "DJI (línea Osmo Action)": agregar al final
   `DJI además tiene una línea 360 y una de cámaras diminutas: las comparamos en [qué DJI comprar](/guias/tech/dji-cual-comprar).`
✅ 3. Pilar, FAQ "¿Qué accesorios hacen falta para empezar?": agregar
   `En la línea DJI hay otras con memoria interna: las comparamos en [qué DJI comprar](/guias/tech/dji-cual-comprar).`
✅ 4. Pilar, FAQ "¿Qué es una cámara 360 y en qué se diferencia?": agregar
   `Si te interesa el formato, en el catálogo hay más, incluida la de DJI, comparadas en [qué DJI comprar](/guias/tech/dji-cual-comprar).`
✅ 5. `internalLinks` de las tres guías del silo: agregar
   `{ label: 'Qué DJI comprar: 5 modelos comparados', href: '/guias/tech/dji-cual-comprar' },`
✅ 6. `sitemapLastmod` de las tres guías del silo → la fecha de publicación. **Nunca `updatedDate`.**

### Verificación

`tsc --noEmit` y `npm run build` en verde. Los nueve checks de contenido en verde, corridos
por separado. Renderizado en el dev server: cero tokens sin resolver, cero tokens filtrados a
títulos, cero imágenes rotas, 34 links con `rel="sponsored"`, tabla con los 5 links de afiliado.

Dos checks fallan, **los dos preexistentes en HEAD y ajenos a este trabajo**:
`check-catalogo-fresco` (119 productos viejos con precio ancla) y `npm run lint`
(5 errores de `react-hooks/set-state-in-effect` en componentes que no se tocaron).

### Pendiente

La familia **Osmo Pocket** suma ~12.050/mes y el Pack Creadores del Pocket 3 tiene 1.183
opiniones, más que cualquier cámara DJI del país. Es la oportunidad más grande que dejó este
trabajo, y necesita silo propio: no es una cámara deportiva.

---

## 9. Trío auditor (2026-08-26)

| Pasada | Codex | Gemini |
|---|---|---|
| 1ª | **NO-GO** — 3 bloqueantes | timeout, sin salida |
| 2ª | **NO-GO** — 1 bloqueante, confirma las 5 correcciones | **GO** en 4 de 5, NO-GO por cobertura |
| 3ª | **NO-GO** — 1 bloqueante en alcance, 1 fuera de alcance | **GO** |
| 4ª | **GO** | — |

Los cinco hallazgos de Codex fueron reales. **Ningún falso positivo en tres pasadas**, que es
inusual: la causa probable es que el prompt llevaba las reglas de estilo intencionales y la lista
de lo ya verificado, que es lo que suele generar el ruido de la primera pasada.

### Los cinco bloqueantes de Codex

1. **GPS de la Osmo 360.** Se publicaba "no trae GPS integrado" en tres lugares, y la lista negra
   del propio informe de specs lo prohibía: DJI no lo lista *ni lo niega*, y su tabla omite filas
   enteras. Es el mismo caso de la GoPro HERO13 de la sesión anterior. Ahora se publica solo el
   hecho positivo del control remoto Osmo Action GPS Bluetooth.
2. **La comparación 5 Pro contra Action 6 omitía el 8K**, que la misma guía menciona tres párrafos
   más abajo. Se contradecía sola. Ahora nombra tres diferencias, no dos.
3. **"La 360 más cara entre las versiones sin accesorios"** — la ficha misma es el Combo Aventura.
   Ahora dice "la segunda 360 más cara, solo por debajo del Insta360 X5 Essentials Bundle".
4. **"DJI es la única marca grande con cuatro formatos"** — Insta360 también los cubre (X, GO, Ace,
   Luna) y lo dice nuestra propia guía hermana publicada un día antes. El reencuadre quedó mejor
   que el original: el diferencial de DJI no es la variedad, es que **las cuatro se llaman Osmo**.
5. Mejora aplicada: el salto Action 4 → 5 Pro también sube el 4K en 4:3 de 60 a 120 cuadros.

### El bloqueante de Gemini: la activación con DJI Mimo

Faltaba un dato que ninguna publicación de MercadoLibre menciona y que sorprende al comprador:
**las cinco cámaras se activan con la app DJI Mimo antes del primer uso.** Se verificó leyendo los
manuales PDF oficiales de los cuatro modelos y el soporte de DJI, y el alcance quedó acotado:

- El botón **"Omitir (intentos restantes: 5)"** DJI lo documenta **solo para la línea Osmo Action**.
- Para la Osmo 360 y la Osmo Nano el texto dice que **DJI no documenta ese margen**, que no es lo
  mismo que decir que no lo tienen. Misma regla que falló con el GPS.
- El requisito de internet durante la activación se atribuye **solo a la Action 5 Pro**, la única
  cuyo manual lo pide.

Corrección de una premisa propia: los "5 intentos" **no** salen de una reseña de un comprador, los
documenta DJI textualmente en su soporte oficial.

### Un hallazgo propio entre pasadas, que ningún auditor reportó

Aplicando la regla nueva de **grepear lo escrito contra la lista negra**, apareció que las specs de
estabilización de las tres fichas estaban mal:

| Ficha | Decía | Dice ahora (dji.com) |
|---|---|---|
| Osmo 360 | "**No usa RockSteady**" | RockSteady 3.0 y HorizonSteady |
| Osmo Nano | RockSteady y HorizonSteady | RockSteady 3.0 y **HorizonBalancing** |
| Action 5 Pro | RockSteady 3.0 y 3.0+ (copiado del molde) | RockSteady, sin versión: DJI no la publica |

La de la Osmo 360 era otra afirmación negativa sin fuente, y encima contradicha por una
investigación que ya estaba en el repo. La regla quedó guardada en memoria.

### Auditoría aritmética

Las 20 relaciones numéricas expresadas en palabras se recalcularon una por una contra los números
del repo. Todas cierran: "un 50% más" (240/160 = 1,50), "más del doble" (105/47 = 2,23 y
90/38 = 2,37), "un 8% menos" (183/200 y 124/135,4), "casi el doble" (1,93), "el salto más grande
de los cuatro" (332.250 contra 162.100, 123.900 y 125.400).


### Veredicto final: GO de los dos

Codex cerró en la cuarta pasada validando por su cuenta la aritmética ("casi el doble", "más del
doble", "un 50% más", "8% menos" cierran contra los datos del repo), los tokens de precio y prueba
social, y los links internos canónicos. Gemini cerró en la tercera.

En total: **6 bloqueantes reales, cero falsos positivos en cuatro pasadas.**


---

## 10. Publicado (2026-08-26)

La guía está en vivo en `/guias/tech/dji-cual-comprar`. Verificado en el dev server:

- La guía y las 3 fichas devuelven **200**, y las cuatro URLs están en el `sitemap.xml`.
- El pilar tiene **12 anclas** hacia la guía nueva: las 4 que se agregaron a mano (3 en prosa más
  la de `internalLinks`) más las que el propio sistema genera en "guías relacionadas", que ahora
  la incluyen porque `getRelatedGuides` filtra por `publishedDate`.
- Cero tokens sin resolver, 17 links `meli.la` y los 17 con `rel="sponsored"`.
- `updatedDate` de las tres guías del silo quedó intacto en 2026-08-25: solo se movió
  `sitemapLastmod` a 2026-08-26, que es lo que pide `docs/guias.md` §6.0.
