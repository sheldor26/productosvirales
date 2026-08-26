# BRIEF DE EJECUCIÓN — Guía hija DJI + 3 fichas nuevas
**Repo:** `/Users/juan/Proyectos web/productosvirales` · **Fecha:** 2026-08-26 · Consolidado de 4 informes de reconocimiento, con datos re-verificados contra el archivo en disco.

---

## DECISIÓN DE ARQUITECTURA (leer antes que nada, define el 80% del trabajo)

Los cuatro informes discuten los rompimientos asumiendo que **las 3 fichas DJI entran a la guía pilar `camara-deportiva`**. Eso es un supuesto, no un hecho, y **el patrón ya establecido del silo dice lo contrario**:

- GoPro tiene **6 fichas** en catálogo, pero en el pilar hay **una sola** (HERO13 Black). Las otras cinco viven solo en `gopro-cual-comprar`.
- Insta360 tiene **6 fichas** en catálogo, pero en el pilar hay **dos** (X3 y X5). Las otras cuatro viven solo en `insta360-cual-comprar`.

**RECOMENDACIÓN FIRME: escenario A.** Las 3 DJI nuevas entran **solo a la guía hija nueva** (`dji-cual-comprar`). El pilar `camara-deportiva` **sigue con sus 7 cámaras y sus dos DJI**. Bajo el escenario A, casi todos los "ROMPE" del Informe 1 **no ocurren**, porque están scopeados con "de las siete", "de la guía", "de esta guía", y ese conjunto no cambia.

El escenario B (meter las 3 al pilar) obligaría a rehacer la tesis de "tres tramos y dos pozos", que es el esqueleto del pilar (standfirst + intro + un H2 entero + FAQ), reescribir 19 apariciones de "siete", y romper el enlazado de precios. No hay ninguna razón editorial para hacerlo: el pilar es la comparativa entre marcas, la hija es la comparativa dentro de la marca.

**Todo lo que sigue está escrito para el escenario A.** Donde algo cambiaría bajo B, lo digo explícito.

---

# 1. ROMPIMIENTOS A CORREGIR

Lista cerrada. Numerada. Los que dicen **DOS ARCHIVOS** son los que en este proyecto ya se olvidaron tres veces: hay que tocar `guides.ts` **y** `curated-products.ts` en el mismo commit.

---

### R1. "lo más profundo que llega una cámara de acción del catálogo" — **ROMPE (empate)** — **DOS ARCHIVOS**

**Archivo 1:** `src/data/curated-products.ts`, ficha `MLA62340610` (DJI Osmo Action 6), array `pros`, tercer ítem (≈ línea 715).
**Verbatim:**
> `"20 metros sumergible sin carcasa, lo más profundo que llega una cámara de acción del catálogo",`

**Archivo 2:** `src/data/guides.ts`, pilar `camara-deportiva`, lista de sumergibles (≈ línea 394), primer ítem.
**Verbatim:**
> `` `**DJI Osmo Action 6:** 20 metros sin carcasa, 60 con carcasa. Es la que más profundo llega sin nada puesto.` ``

**Archivo 2 bis:** `src/data/guides.ts`, mismo pilar, párrafo de la ficha Action 6 (línea 358).
**Verbatim:**
> `` `También es **la que más profundo se moja sin carcasa: 20 metros**, contra los 18 de la Osmo Action 4, los 15 de la Insta360 X5 y los 10 de la GoPro y la X3. …` ``

**Por qué rompe con el número exacto:** la **Osmo Action 5 Pro declara los mismos 20 m sin carcasa**. Deja de ser "la que más" y pasa a ser empate 20 = 20. Además ya hoy empata con la GoPro MISSION 1 PRO (20 m), que se salva solo porque está clasificada como cine compacto y no como cámara de acción: ese salvavidas se agota acá.

**Corrección propuesta (texto listo):**
- `curated-products.ts` pro → `"20 metros sumergible sin carcasa, lo máximo que declara una cámara de acción del catálogo, empatada con la Osmo Action 5 Pro"`
- `guides.ts` lista → `` `**DJI Osmo Action 6:** 20 metros sin carcasa, 60 con carcasa. Es el máximo de esta guía sin nada puesto.` `` (el scope "de esta guía" sigue siendo verdadero bajo escenario A, pero conviene sacar el superlativo absoluto igual)
- `guides.ts` línea 358 → cambiar "**la que más profundo se moja sin carcasa: 20 metros**" por "**la que más profundo se moja sin carcasa de esta guía: 20 metros**".

**PRECONDICIÓN:** verificar contra dji.com que la Action 5 Pro es 20 m. Si resulta ser otra cifra, R1 se cae y no se toca nada.

---

### R2. Peso: "la cámara de acción más liviana del catálogo" — **ROMPE (ya estaba roto)** — **DOS ARCHIVOS**

**Archivo 1:** `curated-products.ts`, ficha `MLA62771175` (Gadnic MCDEP017), `pros`.
**Verbatim:**
> `"Pesa 58 g: es la cámara de acción más liviana del catálogo entre las que declaran peso",`

**Archivo 2:** `guides.ts`, pilar, párrafo de la ficha Gadnic.
**Verbatim (fragmento):** `Pesa 58 gramos, es la más liviana de las que declaran peso`

**Por qué rompe:** **ya es falso hoy**, sin las DJI. La Insta360 GO 3S está en el catálogo (`MLA39997069`) y declara **39,1 g** la cámara sola. La Osmo Nano lo agrava (DJI declara ~52 g la unidad de cámara sola, dato **a verificar**). Este es un pasivo pre-existente que el trabajo nuevo obliga a saldar.

**Corrección propuesta:**
- `curated-products.ts` → `"Pesa 58 g: es la más liviana de las cámaras de acción rectangulares del catálogo"` (las que se cuelgan con imán, GO 3S y Osmo Nano, son otro formato y no compiten)
- `guides.ts` → `Pesa 58 gramos, es la más liviana de las siete`

Si la corrección de "rectangulares" no convence, la alternativa honesta es borrar el superlativo y dejar solo el dato: `"Pesa 58 g con la batería puesta"`.

---

### R3. Ítem "**DJI.**" de la sección de generaciones — **ROMPE por incompletitud** — `guides.ts`

**Archivo:** `src/data/guides.ts`, pilar `camara-deportiva`, sección H2 `Qué modelo es el actual de cada marca`, tercer ítem de la `list` (línea 414).
**Verbatim:**
> `` `**DJI.** La [Osmo Action 4](/producto/camara-deportiva-dji-osmo-action-4-mla29364436) es de 2023. DJI sacó la Action 5 Pro en 2024 y la [Action 6](/producto/camara-deportiva-dji-osmo-action-6-combo-aventura-mla62340610) en noviembre de 2025. La Action 4 está dos generaciones atrás.` ``

**Por qué rompe:** el ítem se titula "**DJI.**", la marca entera, y describe una sola línea. Los otros dos ítems hacen lo mismo pero les alcanza porque sus marcas están representadas por una línea. Al publicar una guía DJI que cubre **tres líneas** (Osmo Action, Osmo 360, Osmo Nano), este ítem queda como un retrato incompleto de la marca **escrito por nosotros mismos**. Además nombra la Action 5 Pro sin link cuando ya va a tener ficha propia.

**Corrección propuesta (texto listo):**
> `` `**DJI (línea Osmo Action).** La [Osmo Action 4](/producto/camara-deportiva-dji-osmo-action-4-mla29364436) es de 2023, la [Action 5 Pro](/producto/camara-deportiva-dji-osmo-action-5-pro-mla66182550) de 2024 y la [Action 6](/producto/camara-deportiva-dji-osmo-action-6-combo-aventura-mla62340610) de noviembre de 2025. La Action 4 está dos generaciones atrás. DJI además tiene una línea 360 y una de cámaras diminutas, que comparamos en [qué DJI comprar](/guias/tech/dji-cual-comprar).` ``

Este es también **el link entrante en prosa del pilar hacia la hija nueva**, que es obligatorio por patrón (ver §3).

---

### R4. "DJI mide sus dos cámaras" — **ROMPE por lectura ambigua** — **DOS ARCHIVOS (guides.ts x2)**

**Archivo:** `guides.ts`, pilar, sección H2 `Cuidado con el número de autonomía` (línea 406).
**Verbatim:**
> `` `**DJI mide sus dos cámaras en el modo menos exigente que tienen**, 1080p a 24 cuadros por segundo: 240 minutos en la Osmo Action 6, que es el número más grande de la guía, y 160 en la Osmo Action 4. Ninguna de las dos publica cuánto dura en 4K, y la Action 6 tampoco en 8K.` ``

**Segunda aparición:** mismo archivo, FAQ `¿Cuánto dura la batería de una cámara deportiva?`.
**Verbatim (fragmento):**
> `El número más alto de todos es de DJI, 240 minutos en la Osmo Action 6, y la Osmo Action 4 declara 160, pero los dos están medidos en 1080p a 24 cuadros por segundo y DJI no da el dato en 4K.`

**Por qué rompe:** "sus dos cámaras" se lee como "las dos cámaras que hace DJI". En cuanto el sitio publica cinco fichas DJI, esa frase es falsa a la lectura. El fondo del hallazgo (DJI mide en 1080p/24 y no publica 4K) sigue siendo cierto y es **el hallazgo firmado del sitio sobre DJI**: no se toca, se re-scopea.

**Corrección propuesta:**
- Línea 406 → `**DJI mide las dos de esta guía en el modo menos exigente que tienen**, 1080p a 24 cuadros por segundo: 240 minutos en la Osmo Action 6…`
- FAQ → `…pero las dos están medidas en 1080p a 24 cuadros por segundo y DJI no da el dato en 4K.`

**OJO adicional:** si la Action 5 Pro también declara 240 minutos en 1080p/24 (**a verificar en dji.com**), la frase "que es el número más grande de la guía" sigue siendo cierta bajo escenario A (la Action 5 Pro no está en el pilar), pero **en la guía nueva no se puede decir que la Action 6 tenga el número más grande de DJI** sin chequearlo.

---

### R5. "RockSteady 3.0 en las dos DJI" — **ROZA, corregir igual** — `guides.ts`

**Archivo:** `guides.ts`, pilar, sección de estabilización (línea 389).
**Verbatim (fragmento):**
> `Las cinco que no son del tramo económico estabilizan por software y bien: HyperSmooth 6.0 en la GoPro, RockSteady 3.0 en las dos DJI y FlowState en las dos Insta360, que en el caso de la X3 ni siquiera se puede desactivar.`

**Por qué:** mismo problema de lectura que R4, y además la Osmo 360 **no** usa RockSteady (usa estabilización de 360 con nivelación de horizonte), así que la atribución no sobrevive si alguien la generaliza.
**Corrección propuesta:** `…RockSteady 3.0 en las dos DJI de esta guía y FlowState en las dos Insta360…`

---

### R6. "la única que trae memoria interna" — **ROZA fuerte (falso a nivel sitio, verdadero a nivel guía)** — **DOS ARCHIVOS**

**Archivo 1:** `guides.ts`, pilar, párrafo de la Action 6 (línea 358).
**Verbatim (fragmento):** `Y trae 64 GB de memoria interna, de los cuales quedan 50 disponibles, así que se puede empezar a usar sin comprar tarjeta, algo que ninguna otra de esta guía permite.`

**Archivo 1 bis:** mismo archivo, FAQ `¿Qué accesorios hacen falta para empezar?`.
**Verbatim (fragmento):** `Sobre todo una **tarjeta de memoria**, porque en seis de las siete hay que comprarla aparte. … La única que zafa es la [DJI Osmo Action 6](…), que trae 64 GB internos.`

**Archivo 1 ter:** mismo archivo, FAQ `¿Necesito comprar tarjeta de memoria aparte?`.
**Verbatim:** `En seis de las siete, sí. La única que trae memoria interna es la [DJI Osmo Action 6](…), con 64 GB de los cuales quedan 50 disponibles.`

**Archivo 2:** `curated-products.ts`, ficha `MLA62340610`, `pros`, cuarto ítem.
**Verbatim:** `"64 GB de memoria interna, así que se puede usar sin comprar tarjeta",` (este está bien, no lleva superlativo, **no tocar**).

**Por qué:** el producto nuevo se llama literalmente **"Camara DJI Osmo Nano 64GB"**. La memoria interna está en el nombre comercial. Bajo escenario A las tres frases del pilar siguen siendo **técnicamente verdaderas** ("de esta guía", "de las siete"), pero un lector que llega por búsqueda y ve en el mismo sitio una DJI con 64 GB en el título va a leerlas como mentira. Este es el riesgo #1 de todo el trabajo.

**Corrección propuesta (no borrar el dato, precisarlo):**
- Línea 358 → `…algo que ninguna otra de las siete permite.`
- FAQ accesorios → `La única de las siete que zafa es la [DJI Osmo Action 6](…), que trae 64 GB internos. En la línea DJI hay otras con memoria interna: las comparamos en [qué DJI comprar](/guias/tech/dji-cual-comprar).`
- FAQ tarjeta → `En seis de las siete, sí. La única de esta guía que trae memoria interna es la [DJI Osmo Action 6](…), con 64 GB de los cuales quedan 50 disponibles.`

**PRECONDICIÓN:** confirmar en la publicación de ML / dji.com que la Nano efectivamente trae 64 GB internos y no una microSD de 64 GB en el combo. Si es lo segundo, R6 desaparece entero.

---

### R7. "En esta guía las 360 son la X3 y la X5" — **ROZA** — `guides.ts`

**Archivo:** `guides.ts`, pilar, FAQ `¿Qué es una cámara 360 y en qué se diferencia?` (línea 447).
**Verbatim (fragmento):** `En esta guía las 360 son la [Insta360 X3](…) y la [Insta360 X5](…).`

**Por qué:** el scope "en esta guía" la salva bajo escenario A. Pero el sitio va a tener 7 cámaras 360 en catálogo, incluida una DJI de 1.418.249. Vale sumar la salida.
**Corrección propuesta:** agregar al final: ` Si te interesa el formato, en el catálogo hay más 360, incluida la de DJI, comparadas en [qué DJI comprar](/guias/tech/dji-cual-comprar).`

---

### R8. metaDescription del pilar: "cuál es el modelo actual de GoPro, DJI e Insta360" — **ROZA** — `guides.ts`

**Archivo:** `guides.ts`, pilar, `metaDescription` (línea 313).
**Verbatim:**
> `` `7 cámaras deportivas con stock real en Argentina, de {{precio:MLA62771175:k}} a {{precio:MLA62340610:k}}. Cuáles estabilizan de verdad, cuáles se mojan sin carcasa y cuál es el modelo actual de GoPro, DJI e Insta360.` ``

**Por qué:** presupone un único modelo actual por marca. Con tres líneas DJI conviviendo, eso deja de ser cierto para DJI.
**Corrección propuesta:** `…y cuál es el modelo actual de cada marca.` (mismo largo aproximado, no cambia el conteo "7", no exige tocar `updatedDate`).

---

### R9. Enlazado del silo: el pilar no linkea a la hija nueva — **FALTANTE OBLIGATORIO** — `guides.ts` (3 lugares)

Por patrón del silo, cada hija recibe **dos** links entrantes del pilar. Hoy no existen para DJI.

1. **En prosa**, dentro del bloque de la marca en el ranking. Ya resuelto en **R3** (el ítem "DJI." de generaciones). Alternativa/adicional: sumarlo al párrafo de la Osmo Action 6 (línea 357-358), imitando el de GoPro: `Y si tu decisión es entre modelos de DJI y no entre marcas, la desarrollamos entera en [qué DJI comprar](/guias/tech/dji-cual-comprar).`
2. **En `internalLinks` del pilar**, como **tercera entrada**, después de las otras dos hermanas:
   ```ts
   { label: `Qué DJI comprar: 5 modelos comparados`, href: `/guias/tech/dji-cual-comprar` },
   ```
3. **En las dos hermanas**, sumar la nueva a sus `internalLinks` (gopro: junto a la de Insta360, al principio; insta360: al final, junto a la de GoPro).

**Y en los tres casos**, tocar **`sitemapLastmod: "2026-08-26"`**, **NUNCA `updatedDate`**. `src/app/sitemap.ts` toma la más reciente de las dos. Regla de `docs/guias.md` §6.0: "Nunca tocar `updatedDate` sin un cambio real de contenido". Sumar un link interno no lo es, y tocarlo resetea las ventanas de maduración del loop SEO.

---

### R10. `relatedProducts` de las dos DJI viejas — **FALTANTE** — `curated-products.ts`

- `MLA62340610` (Action 6) hoy: `["MLA29364436", "MLA47374183", "MLA50882755"]`
- `MLA29364436` (Action 4) hoy: `["MLA62340610", "MLA47374183", "MLA16132352"]`

Los cruces son recíprocos por convención. Con tres DJI nuevas, al menos la Action 6 debería apuntar a la Osmo 360 y la Action 4 a la Action 5 Pro. Decidir el mapa completo en la carga (ver §4).

---

### R11. `cons` de la Action 4 ahora tiene link disponible — **MEJORA, no rompimiento** — `curated-products.ts`

**Verbatim:** `"Es de 2023: ya salieron la Action 5 Pro y la Action 6",`
Sigue siendo cierto. Los `cons` son `string[]` planos sin links, así que no se toca la ficha. Pero **en la guía nueva** la Action 5 Pro tiene que ir linkeada cada vez que se la nombre.

---

### LO QUE **NO** SE ROMPE (chequeado uno por uno, para que nadie corrija de más)

- Todos los superlativos de `gopro-cual-comprar` e `insta360-cual-comprar`: están blindados por scope de marca ("de las seis GoPro que comparamos", "de las seis"). Las DJI no entran en esos conjuntos. **No tocar nada de esas dos guías salvo el `internalLinks` de R9.**
- `guides.ts:257` (gopro): `la Insta360 X3 está tres generaciones atrás y la DJI Osmo Action 4 dos` → sigue siendo cierto.
- `curated-products.ts` `MLA62771175`: `"Es la entrada más económica del catálogo de cámaras deportivas"` → 98.749, sigue siendo el mínimo. **OK.**
- `curated-products.ts` `MLA62771175`: `"Es la de puntaje más bajo del catálogo de cámaras deportivas"` → 4.2 contra 4.9 de las tres nuevas. **OK.**
- `curated-products.ts` `MLA29364436` verdict: `"su base de opiniones es la más chica de las siete de nuestra guía de cámaras deportivas"` → 76 sigue siendo el mínimo **de las siete**. **OK bajo escenario A.** (A nivel catálogo ya era falso antes: MISSION 1 PRO 18, GO 3S 33, X4 Air 37, LIT HERO 62. El scope la salva.)
- `guides.ts` pilar: `es **la menos opinada de la guía**, con {{reviews:MLA29364436}} opiniones` → **OK bajo escenario A.**
- `curated-products.ts` `MLA19710677` verdict: `comparte el puntaje más alto de las siete` → el verbo "comparte" y el scope "de las siete" lo salvan. **OK.**
- FAQ `¿Cuál es la mejor alternativa barata a una GoPro?`: `La Akaso V50X … Es la más barata de las que estabilizan` → 176.899 vs 962.099 de la nueva más barata. **OK.**
- Toda la tesis de "tres tramos y dos pozos" (standfirst, intro, H2 de tramos, FAQ de precios, escalera ordenada de las siete). **OK bajo escenario A. Se cae entera bajo escenario B.**
- `curated-products.ts` `MLA62340610` verdict: `"Es la cámara de acción tradicional más capaz del catálogo"` → la Action 5 Pro está por debajo de la Action 6 en sensor y video; la Osmo 360 y la Nano no son "tradicionales". **OK**, pero es el claim más frágil que sobrevive: si alguna vez entra una Action 7 o una cámara de acción con sensor de 1 pulgada, se cae.

---

# 2. TABLA DE VERDAD DE LAS 19 CÁMARAS

Datos leídos directo de `src/data/curated-products.ts` líneas 14-901 el 2026-08-26 (no de los informes). Precios en ARS.

| # | Modelo | ID | Precio | Rating | Opiniones | Formato | Marca |
|---|---|---|---|---|---|---|---|
| 1 | Gadnic MCDEP017 (4K WiFi) | MLA62771175 | 98.749 | 4.2 | 1.245 | tradicional | Gadnic |
| 2 | Akaso V50X | MLA16132352 | 176.899 | 4.7 | 710 | tradicional | Akaso |
| 3 | GoPro HERO (2024) | MLA50182399 | 439.894 | 4.6 | 163 | tradicional | GoPro |
| 4 | GoPro LIT HERO | MLA57723897 | 549.999 | 4.7 | 62 | tradicional | GoPro |
| 5 | Insta360 X3 | MLA19710677 | 694.990 | 4.9 | 1.778 | 360 | Insta360 |
| 6 | GoPro HERO12 Black | MLA27104632 | 749.999 | 4.8 | 809 | tradicional | GoPro |
| 7 | DJI Osmo Action 4 | MLA29364436 | 799.999 | 4.7 | 76 | tradicional | DJI |
| 8 | Insta360 GO 3S | MLA39997069 | 897.468 | 4.9 | 33 | diminuta | Insta360 |
| 9 | GoPro HERO13 Black | MLA47374183 | 930.999 | 4.9 | 1.721 | tradicional | GoPro |
| 10 | Insta360 X4 | MLA36223181 | 949.999 | 4.8 | 1.156 | 360 | Insta360 |
| **11** | **DJI Osmo Action 5 Pro** | **MLA66182550** | **962.099** | **4.9** | **133** | **tradicional** | **DJI** |
| 12 | Insta360 X4 Air | MLA62879003 | 999.990 | 4.9 | 37 | 360 | Insta360 |
| 13 | GoPro MAX2 | MLA57726638 | 1.049.999 | 4.9 | 163 | 360 | GoPro |
| **14** | **DJI Osmo Nano 64GB** | **MLA58197668** | **1.085.999** | **4.9** | **130** | **diminuta** | **DJI** |
| 15 | Insta360 X5 | MLA49100446 | 1.334.000 | 4.9 | 577 | 360 | Insta360 |
| **16** | **DJI Osmo 360** | **MLA53612281** | **1.418.249** | **4.9** | **402** | **360** | **DJI** |
| 17 | DJI Osmo Action 6 | MLA62340610 | 1.543.649 | 4.9 | 205 | tradicional | DJI |
| 18 | GoPro MISSION 1 PRO | MLA70063378 | 1.749.999 | 5.0 | 18 | tradicional (cine compacto) | GoPro |
| 19 | Insta360 X5 Essentials Bundle | MLA50882755 | 1.759.229 | 4.9 | 676 | 360 | Insta360 |

Las **negritas** son las tres fichas nuevas. Nota: la fila 19 es **el mismo producto** que la 15 (mismo `canonicalName: "Insta360 X5"`), en versión con accesorios. Conviven a propósito. Cualquier superlativo de precio tiene que decidir si el bundle cuenta.

### Superlativos del conjunto completo de 19

- **Más cara:** Insta360 X5 Essentials Bundle (1.759.229). **Sin contar bundles:** GoPro MISSION 1 PRO (1.749.999). Diferencia: 9.230. Frágil, son precios en vivo.
- **Más barata:** Gadnic MCDEP017 (98.749). Cómodo, el segundo está a 78.150 de distancia.
- **Más reseñada:** Insta360 X3 (1.778). Segunda: GoPro HERO13 Black (1.721). Margen: 57. **Frágil**, cualquier refresco de `reviewCount` lo puede dar vuelta.
- **Menos reseñada:** GoPro MISSION 1 PRO (18).
- **Mejor puntuada:** GoPro MISSION 1 PRO (5.0), única por encima de 4.9. Detrás, empate a 4.9 de **once** cámaras: X3, X4 Air, X5, X5 Bundle, GO 3S, MAX2, HERO13, Action 6 y **las tres nuevas**.
- **Peor puntuada:** Gadnic MCDEP017 (4.2).
- **Más liviana declarada:** Insta360 GO 3S (39,1 g cámara sola). La Osmo Nano probablemente se meta acá: **dato no verificado, ver §5.**

### Superlativos restringidos al subconjunto DJI (5 fichas tras la carga)

Escalera DJI: **799.999 → 962.099 → 1.085.999 → 1.418.249 → 1.543.649**
Saltos: 162.100 · 123.900 · 332.250 · 125.400. Total Action 4 a Action 6: **743.650** (ratio **1,93x**, "casi el doble", ya validado y publicado).

- **Más cara de DJI:** Osmo Action 6 (1.543.649)
- **Más barata de DJI:** Osmo Action 4 (799.999)
- **Más reseñada de DJI:** Osmo 360 (402), casi el doble que la segunda
- **Menos reseñada de DJI:** Osmo Action 4 (76)
- **Mejor puntuada de DJI:** empate a 4.9 entre Action 5 Pro, Osmo Nano, Osmo 360 y Action 6. La Action 4 (4.7) es **la única DJI que no llega a 4.9**. Ese es el ángulo honesto: no hay "la mejor puntuada", hay "la única que se queda afuera del empate".
- **Escalera sin pozos:** los cuatro saltos DJI van de 123.900 a 332.250. Hay un salto notoriamente más grande (Nano a Osmo 360, 332.250) pero **no hay pozos** como en el pilar. La tesis de la guía DJI **no puede ser "tres tramos y dos pozos"**: eso ya es del pilar y acá no aplica.

### Superlativos restringidos al subconjunto 360 (7 fichas)

X3 (694.990) · X4 (949.999) · X4 Air (999.990) · MAX2 (1.049.999) · X5 (1.334.000) · **Osmo 360 (1.418.249)** · X5 Bundle (1.759.229)

- **Más cara 360:** X5 Essentials Bundle (1.759.229). Sin bundles: **Osmo 360 (1.418.249)**. Es decir: **la Osmo 360 es la 360 más cara del catálogo entre las versiones peladas.** Redactar con cuidado.
- **Más barata 360:** Insta360 X3 (694.990)
- **Más reseñada 360:** Insta360 X3 (1.778). La Osmo 360 con 402 queda **cuarta**, detrás de X3, X4 (1.156) y X5 Bundle (676). **No destrona nada**: los claims de "la más elegida" y "la que más gente compró" de la X3 quedan intactos.
- **Mejor puntuada 360:** empate a 4.9 de todas salvo la X4 (4.8).
- **Única 360 con GPS:** claim de GoPro sobre la MAX2, atribuido. Ver §5, sin verificar para la Osmo 360.

---

# 3. PLANTILLA DE GUÍA

**Slug propuesto:** `dji-cual-comprar` · **Ruta:** `/guias/tech/dji-cual-comprar` (`guideHref()` en `src/lib/guide-url.ts`: `` g.silo ? `/guias/${g.silo}/${g.slug}` : `/guias/${g.slug}` ``)

### 3.1 Campos del objeto `Guide` (`src/lib/types.ts:289-345`)

Obligatorios: `slug`, `category`, `title`, `seoTitle`, `metaDescription`, `h1`, `publishedDate`, `updatedDate`, `intro`, `sections`.
Opcionales que las dos hermanas usan (usarlos todos): `silo`, `ogTitle`, `ogDescription`, `ogImage`, `faq`, `internalLinks`, `hasDisclosure`, `standfirst`, `directAnswer`, `readingTime`, `quickPicks`.
Opcionales que las hermanas **no** usan (no inventarlos): `pillar`, `internalLinksTitle`, `sitemapLastmod` (solo se agrega después, si hay un cambio menor).

Valores fijos:
```ts
slug: "dji-cual-comprar",
category: "camaras-deportivas",
silo: "tech",
hasDisclosure: true,
publishedDate: "2026-08-26",   // = updatedDate. Si es futura la guía NO se publica
updatedDate: "2026-08-26",
readingTime: 11,
```

### 3.2 Metadata SEO, con longitudes objetivo (medidas sobre las dos hermanas)

| campo | patrón exacto | largo objetivo |
|---|---|---|
| `title` | `Qué DJI comprar en Argentina [2026]: 5 modelos comparados` | 55-65 |
| `h1` | **copia literal de `title`** | idem |
| `seoTitle` | Title Case, distinto del title: `Qué DJI Comprar en Argentina [2026]: Guía por Modelo` | 52-58 |
| `metaDescription` | abre con `5 cámaras DJI con stock real verificado en Argentina, de {{precio:MLA29364436:k}} a {{precio:MLA62340610:k}}.` + 2 o 3 datos diferenciales | 195-215 |
| `ogTitle` | sin `[2026]`: `Qué DJI comprar en Argentina: 5 opciones comparadas` | 50-58 |
| `ogDescription` | lista de modelos + `Con el dato que decide la compra y que ninguna publicación aclara.` | 125-140 |
| `ogImage` | misma URL que la `image` hero. `https://http2.mlstatic.com/D_NQ_NP_…-O.webp`. **Nunca `-R.webp`, nunca `D_Q_NP_`** | |
| `standfirst` | 3 frases: rango de precios con tokens → por qué es difícil elegir → los 2 datos que deciden | 390-460 |
| `directAnswer` | 4 recomendaciones con `**[Nombre](/producto/…)**` + tokens de precio. Soporta `**negrita**`, links y tokens | 710-730 |

### 3.3 `quickPicks` — exactamente 4, patrón de color fijo

```ts
quickPicks: [
  { productMlaId: "MLA…", label: "Mejor elección general", labelColor: "green",  tagline: "…" },
  { productMlaId: "MLA…", label: "…",                      labelColor: "blue",   tagline: "…" },
  { productMlaId: "MLA…", label: "La 360 de DJI",          labelColor: "purple", tagline: "…" },
  { productMlaId: "MLA…", label: "La más barata",          labelColor: "slate",  tagline: "…" },
],
```
`LabelColor = "green" | "blue" | "amber" | "purple" | "slate"`. **`amber` está prohibido cerca del CTA** (`docs/guias.md` §2 regla 1) y las tres guías del silo no lo usan. `tagline` es `<Modelo>: <dos datos duros>`.

### 3.4 Secuencia exacta de `sections[]`

Objetivo: **~62-73 secciones**, 5 product-cards, 8 FAQ, 8-9 internalLinks. `GuideSection` solo exige `type`; todo lo demás es opcional.

**Cabecera (4 secciones, orden fijo):**
1. `{ type: "image", src: "<url mlstatic -O.webp>", alt: "…", imageSize: "hero" }`
2. `{ type: "callout", calloutVariant: "tip", calloutTitle: "Respuesta rápida", content: "…" }`
3. `{ type: "trust-block", trustVariant: "methodology", content: "**Cómo comparamos:** … Los precios se revisan contra MercadoLibre tres veces por semana." }`
4. `{ type: "h2", title: "Las 5 DJI que comparamos", id: "ranking" }` ← **`id: "ranking"` es el único `id` que usan las tres guías del silo**

**Ranking (5 bloques, molde repetible, uno por modelo):**
```ts
{ type: "p", content: `**<kicker de beneficio, negrita sola, sin punto>**` },
{ type: "h3", title: `<Nombre exacto del modelo>` },   // los h3 NO resuelven tokens: nunca meter {{precio}} acá
{ type: "product-card", productMlaId: "MLA…", label: "<Label>", labelColor: "<green|blue|purple|slate>", ranking: N,
  description: `<1-2 frases beneficio-first + {{rating:ID}} estrellas en {{reviews:ID}} opiniones.>` },
{ type: "p", content: `…` },   // specs duras
{ type: "p", content: `…` },   // la función que decide la compra
{ type: "p", content: `…` },   // contras
{ type: "callout", calloutVariant: "warning", calloutTitle: "<título corto y concreto>", content: `…` },  // opcional, 2-3 en toda la guía
```
Orden de ranking sugerido (a validar por el autor): 1 Action 6 (green) · 2 Action 5 Pro (blue) · 3 Osmo 360 (purple) · 4 Osmo Nano (purple o slate) · 5 Action 4 (slate).

**Después del ranking (secciones temáticas, 4 o 5 H2 con 2-5 `p` cada uno).** Temas que la evidencia sostiene:
- `h2` **Las tres líneas de DJI, y cuál es la actual de cada una** ← la sección diferencial de esta guía. Es el hueco que el pilar no cubre y la razón de existir de la hija.
- `h2` **Cuidado con el número de autonomía** ← repetir el hallazgo firmado del sitio (DJI mide en 1080p/24, no publica 4K) sin contradecir la redacción del pilar.
- `h2` **Cuál se moja sin carcasa y hasta dónde**
- `h2` **Cuánto sube el precio de un modelo al siguiente** ← acá van los cuatro saltos DJI de §2. Sin pozos: es una escalera.
- `h2` **Qué modelo es el actual de DJI** ← acá va el **enlace de salida al pilar**, siguiendo el patrón de gopro: `[guía de cámaras deportivas](/guias/tech/camara-deportiva)`.

**Tabla (1 sección).** Patrón de las hermanas: 6 columnas, una fila por modelo, primera celda con **link `meli.la` de afiliado en markdown**, precio con token exacto.
```ts
{ type: "table",
  headers: [`Modelo`, `Precio`, `Sensor`, `Agua sin carcasa`, `Memoria interna`, `Ideal para`],
  rows: [
    [`[DJI Osmo Action 6](https://meli.la/1aZAhAC)`, `{{precio:MLA62340610}}`, `1/1,1"`, `20 m`, `64 GB`, `…`],
    …
  ] },
```
**`check-table-product-links.cjs` exige que todo producto de la tabla esté linkeado.** Los `meli.la` de los tres nuevos **no existen todavía**: los pasa Juan (regla dura del proyecto: pedir los links canónicos ANTES de armar nada). **No inventarlos.**

**Cierre:**
- `h2` **Cómo elegir** + 4 `h3`+`p`: `Primero, …` / `Segundo, …` / `Tercero, …` / `Recién al final, la resolución`.
- `h2` **Cuánto cuesta una DJI** + `{ type: "list", items: [...] }` de 3 tramos, con `**Desde {{precio:ID:k}} para arriba:**` en negrita al inicio de cada ítem.
- `{ type: "verdict", content: "…" }` ← **último elemento del array, siempre.**

**No usar** en esta guía (las hermanas no los usan): `toc`, `card`, `warning`, `svg`, `image-grid`, `pull-quote`, `bigNumber`, `boxed`, `notes`, `variant`, `longevity`, `projection`. La sección `bad` aparece una sola vez en toda la guía de GoPro: usarla como mucho una vez, para una contra que mata la venta.

### 3.5 `faq` — 8 entradas

`GuideFAQ = { question: string; answer: string }`. Las respuestas resuelven tokens y aceptan links markdown. Preguntas que la evidencia sostiene: cuánto sale una DJI, cuál es la actual, cuáles se mojan sin carcasa, cuánto dura la batería (con el caveat de 1080p/24), qué diferencia hay entre la Action y la Osmo 360, para qué sirve la Nano, hace falta tarjeta de memoria, conviene la Action 4 para ahorrar.

### 3.6 `internalLinks` — 8 entradas, orden fijo por patrón

Patrón de gopro: `[hermana, fichas…, pilar, guía auxiliar]`.
```ts
internalLinks: [
  { label: `Qué GoPro comprar: los 6 modelos comparados`, href: `/guias/tech/gopro-cual-comprar` },
  { label: `DJI Osmo Action 6: ficha y opiniones`,  href: `/producto/camara-deportiva-dji-osmo-action-6-combo-aventura-mla62340610` },
  { label: `DJI Osmo Action 5 Pro: ficha y opiniones`, href: `/producto/camara-deportiva-dji-osmo-action-5-pro-mla66182550` },
  { label: `DJI Osmo 360: ficha y opiniones`,       href: `/producto/camara-dji-osmo-360-combo-aventura-mla53612281` },
  { label: `DJI Osmo Nano: ficha y opiniones`,      href: `/producto/camara-dji-osmo-nano-64gb-mla58197668` },
  { label: `DJI Osmo Action 4: ficha y opiniones`,  href: `/producto/camara-deportiva-dji-osmo-action-4-mla29364436` },
  { label: `Cámara deportiva: cuál comprar en Argentina`, href: `/guias/tech/camara-deportiva` },
  { label: `Qué Insta360 comprar: 6 opciones comparadas`, href: `/guias/tech/insta360-cual-comprar` },
],
```

### 3.7 Tokens de precio en vivo (`src/lib/price-token.ts`)

- `{{precio:MLA53612281}}` → `"$ 1.418.249"` exacto. Para tablas, product-cards, FAQ de precios.
- `{{precio:MLA53612281:k}}` → redondeado al mil. Para prosa.
- `{{preciodif:MLA_A:MLA_B}}` → valor absoluto de la resta, ya formateado. **La palabra "más" o "menos" la escribe el editor.**
- `{{reviews:MLA53612281}}` → cantidad con separador es-AR.
- `{{rating:MLA53612281}}` → un decimal con **punto** ("4.9").

Reglas duras: **los `h2`/`h3` NO resuelven tokens** (salen literales y ensucian el ancla). Si el producto no existe o le falta el dato, el token queda visible en producción. **Nunca escribir un precio ni un conteo de reseñas a mano en prosa**: `check-hardcoded-reviews.cjs` es un trinquete que falla si suben las menciones tipeadas a mano.

### 3.8 Longitud objetivo

| | insta360 | gopro | **objetivo DJI** |
|---|---|---|---|
| caracteres del objeto `Guide` | 25.948 | 29.246 | **26.000-29.000** |
| `sections[]` | 62 | 73 | **62-70** |
| product-cards | 5 | 6 | **5** |
| quickPicks | 4 | 4 | **4** |
| FAQ | 8 | 8 | **8** |
| internalLinks | 7 | 9 | **8** |

### 3.9 Validación antes de dar por cerrado

`guides:check` encadena con `&&` y **la cadena enmascara fallas**: el primer fallo corta y los siguientes nunca corren. Correr por separado:
```bash
cd "/Users/juan/Proyectos web/productosvirales"
npm run lint
npm run build
node scripts/check-price-tokens.cjs
node scripts/check-canonical-product-links.cjs
node scripts/check-guide-monetization.cjs
node scripts/check-table-product-links.cjs
node scripts/check-guide-internal-links.cjs
node scripts/check-stale-prose-prices.cjs
node scripts/check-hardcoded-reviews.cjs
node scripts/check-uncovered-prose-prices.cjs
node scripts/check-price-guard.cjs
node scripts/check-catalogo-fresco.cjs
```
`npm run build` es el único test de tipos. No existe `npm test`.

---

# 4. PLANTILLA DE FICHA

### 4.1 Los tres slugs, calculados con la función real (`src/lib/product-url.ts`)

El slug sale de `title`, no del título crudo de ML: `toLowerCase` → `NFD` + quita diacríticos → todo lo no alfanumérico colapsa a un guión → trim → **`.slice(0, 80)` corte duro que parte palabras** → trim final → `+ "-" + id.toLowerCase()`. **Con o sin acentos el slug sale idéntico**, así que se escribe el `title` con acentos correctos como hacen las 4 fichas molde.

**Usar títulos cortos, tipo molde. No arrastrar el chorizo de specs del vendedor.** Con los títulos crudos de ML los tres slugs salen truncados a la mitad de una palabra (`…-rocksteady-hor-`, `…-rockste-`). Títulos y slugs recomendados, verificados corriendo la función:

| ID | `title` recomendado | slug resultante |
|---|---|---|
| MLA53612281 | `Cámara DJI Osmo 360 Combo Aventura` | `camara-dji-osmo-360-combo-aventura-mla53612281` |
| MLA66182550 | `Cámara Deportiva DJI Osmo Action 5 Pro` | `camara-deportiva-dji-osmo-action-5-pro-mla66182550` |
| MLA58197668 | `Cámara DJI Osmo Nano 64GB` | `camara-dji-osmo-nano-64gb-mla58197668` |

URL final: `/producto/<slug>`. `parseProductSlug` extrae el ID con `/(?:^|-)(MLAU?\d+)$/i`, así que la ficha sigue resolviendo aunque después se edite el título.
**`check-canonical-product-links.cjs` rechaza todo link interno a `/producto/MLA…` pelada.** Siempre la canónica con slug.

### 4.2 Orden de campos, idéntico en las 4 fichas molde. Respetarlo.

```
id → title → canonicalName → brand → price → currency → image → category → categorySlug →
permalink → affiliateUrl → condition → freeShipping → rating → reviewCount → reviewsSampledAt →
soldQuantity → visibility → priceUpdated → priceLastChecked → priceVerifiedAt → priceStatus →
seoTitle → metaDescription → pros → cons → verdict → specs → relatedProducts
```
Comillas dobles en todos los valores. Indentación 2/4/6. Trailing comma en todo.

**Campos que las fichas molde del silo NO usan y que hay que NO inventar:** `mpn` (nunca inventar), `originalPrice`, `images`, `badge`, `pastelColor`, `description`, `articleBody`, `faq`, `structuredData`, `customerReviews`, `ratingBreakdown`, `ogTitle`, `ogDescription`, `h1`, `comparedTo`, `aiReviewSummary`, `packageDimensions`. Las fichas del silo tech de agosto 2026 son **más compactas** que el checklist máximo de `docs/fichas.md`: el molde real es la ficha de la Action 6, no el checklist.

### 4.3 Valores fijos para las tres

```ts
brand: "DJI",
currency: "ARS",
category: "Tech",
categorySlug: "tech",
permalink: "https://www.mercadolibre.com.ar/p/MLA…",
condition: "new",
freeShipping: <dato real de la publicación, no aspiracional>,
visibility: "normal",              // "featured" es escaso, uno por familia, y la familia ya lo tiene
reviewsSampledAt: "2026-08-26",
priceUpdated: "2026-08-26",
priceLastChecked: "2026-08-26",
priceVerifiedAt: "2026-08-26",     // SOLO porque un humano miró la publicación en ML hoy. Ningún scraper lo escribe.
priceStatus: "fresh",
```
`priceVerifiedAt` protege el precio 7 días de `apply-brightdata-prices.cjs`. Nació porque el 2026-08-12 Bright Data pisó 11 de 15 precios verificados a mano. Los datos que pasó Juan son de verificación en vivo del 2026-08-26, así que corresponde ponerlo.

`soldQuantity`: **es el escalón que muestra ML (25, 50, 100), no un número exacto.** Si no se leyó, **omitir el campo**, no inventarlo.

**Ubicación en el archivo:** contiguas a las dos DJI existentes (`curated-products.ts` líneas 690-800), después de la Action 6 y la Action 4, antes de la Akaso. Conviene abrir el bloque con un comentario de marca, imitando el de Insta360 (línea 11-12):
```ts
// ─── DJI: los modelos verificados con stock nacional (ago 2026). Silo tech ───
// Specs verificadas contra dji.com y el manual online oficial.
```

### 4.4 `image` — regla del CDN

Formato: `https://http2.mlstatic.com/D_NQ_NP_<seq>-MLA<idFoto>_<MMAAAA>-O.webp`
- Prefijo `D_NQ_NP_` (completa). **Nunca `D_Q_NP_`** (reducida): son rutas distintas del CDN, no sufijos.
- Sufijo `-O.webp` o `-F.webp`. **Nunca `-R.webp`** (miniatura de búsqueda, a veces menos de 1 KB, pixelada en el hero).
- **Verificar SIEMPRE con GET, nunca con HEAD.** El CDN devuelve 405 a HEAD y el `content-length` de la página de error hace que una foto buena parezca pesar menos que su miniatura:
```bash
curl -s -o /tmp/img -w "%{http_code} %{size_download}" "https://http2.mlstatic.com/<archivo>.webp"; file -b --mime-type /tmp/img
```
La resolución real de las fotos de ML es ~1200px, no 819. No generalizar desde una muestra.

### 4.5 Convenciones de redacción

**`title`** — título de la publicación de ML limpiado y capitalizado, 4 a 7 palabras. Patrón del silo: `Cámara Deportiva <Marca> <Modelo>` para las rectangulares, `Cámara 360 <Marca> <Modelo>` para las 360, `Cámara <Marca> <Modelo>` para las diminutas.
**`canonicalName`** — nombre limpio de fábrica, sin "Cámara" ni la variante de combo. 3-4 palabras: `DJI Osmo 360`, `DJI Osmo Action 5 Pro`, `DJI Osmo Nano`.

**`pros` / `cons` — exactamente 4 de cada uno. Sin excepción en las 4 fichas molde.**
- 6 a 20 palabras. Frase sin punto final. Empieza con el dato, no con "Tiene" ni "Ofrece".
- **Cada uno lleva un número o un hecho verificable**, nunca adjetivos sueltos.
- Comparan explícitamente contra otro producto del catálogo **por nombre**.
- Superlativos siempre acotados: `del catálogo`, `de nuestra guía de cámaras deportivas`, `de las Insta360 que comparamos`. **Nunca un superlativo absoluto sin ancla.** Y al escribir un ancla nueva, chequear que el conjunto que nombra siga siendo el que uno cree (ver §1).
- Los `cons` son contras reales, **incluyendo las que matan la venta**: obsolescencia, metodología tramposa del fabricante, precio, base de opiniones chica.
- **Patrón que aparece en las 4 fichas molde: al menos un `con` denuncia que el número oficial está medido en condiciones favorables** (1080p/24 en vez de 4K). En las tres DJI nuevas esto va a aplicar casi seguro.
- Aceptan tokens vivos: `{{preciodif:A:B}}`.
- Mayúsculas de énfasis puntuales para la contra fuerte, como en la GO 3S: `"el Action Pod aguanta salpicaduras pero NO se sumerge"`.

**`verdict`** — 2 a 4 oraciones, **40-65 palabras**, una sola cadena sin saltos de línea. Estructura fija:
(1) qué es, en una frase de posicionamiento relativo al catálogo → (2) para quién conviene, "si …, es la que" → (3) **cierra SIEMPRE con la contra**: "Ojo con…", "La contra es que…", "La contra a tener clara antes de comprarla es…".
Voz rioplatense en segunda persona: "si ya tenés palo y tarjeta", "que cambiás en casa si rompés uno".

**`seoTitle`** — base: `<canonicalName>: precio en Argentina, specs y opiniones`. Se varía cuando el producto tiene un ángulo propio (`…, specs y la versión sin accesorios` · `…, cuánto dura y qué es el Action Pod`). 55-70 caracteres.

**`metaDescription`** — arranca `<canonicalName> a {{precio:<ID>}}. ` y sigue con **dos o tres hechos numéricos**. 150-160 caracteres. **Nunca precio hardcodeado**: lo valida `check-price-tokens.cjs`.

**`specs`** — **13 a 15 entradas** (`docs/fichas.md` pide 12-16).
- `label` en español, sin dos puntos, capitalización de oración. Vocabulario del silo: `Resolución de video máxima`, `Resolución de foto`, `Sensor`, `Apertura`, `Estabilización`, `Sumergible sin carcasa`, `Pantalla trasera`, `Pantalla frontal`, `Batería`, `Autonomía`, `Peso`, `Memoria interna`, `Lente`/`Lentes`, `Montura`, `Medidas`, `Versión`.
- `value` **no es un dato pelado: es dato + contexto o caveat en la misma cadena.** Ejemplo del molde: `"240 minutos, medidos en laboratorio grabando 1080p a 24 cuadros por segundo. DJI no publica el dato en 4K ni en 8K"`.
- **Cuando el dato no se conoce con certeza, el `value` lo dice explícitamente en vez de omitirlo en silencio.** Ejemplo del molde: `"Para 8K, dos fuentes oficiales de Insta360 dan cifras distintas, así que no la publicamos"`.
- Formato argentino: **coma decimal** (`1/1,3 pulgadas`, `2,5 pulgadas`, `7,5 Wh`, `70,5 x 44,2 x 32,8 mm`), resoluciones con `x` minúscula y espacios (`7680 x 4320`).
- Unidades escritas: `cuadros por segundo` (**no "fps"** en specs), `metros`, `g` o `gramos`, `mAh`.
- Orden: empieza por lo que decide la compra (video, foto, sensor, apertura, estabilización) y termina en lo secundario (montura, versión, medidas).
- Las specs se cruzan contra **dji.com y el manual oficial, nunca contra la ficha del vendedor**. La ficha técnica de ML puede estar mal etiquetada, no solo incompleta.

**`relatedProducts`** — exactamente **3 IDs**, cruzados, recíprocos. Mezcla: un producto de la misma marca o generación vecina + dos de marcas rivales del silo. Al cargar las tres nuevas, actualizar también los arrays de `MLA62340610` y `MLA29364436` (ver R10).

### 4.6 Regla transversal de `docs/fichas.md`
**Si un dato no se conoce con certeza, se omite. No se inventa.** Aplica a specs, `mpn`, `soldQuantity`, autonomía, profundidad, peso.

---

# 5. QUÉ NO PUEDO AFIRMAR

Los datos que Juan verificó en vivo el 2026-08-26 son **solo estos cinco por producto**: ID, título de ML, precio, rating, cantidad de opiniones, y el formato (360 / tradicional / diminuta). **Todo lo demás está sin verificar.** La regla del proyecto es no publicar el dato antes que publicar un dato dudoso.

**Nada de lo siguiente puede aparecer en la guía ni en las fichas hasta estar verificado contra dji.com o el manual oficial:**

1. **Profundidad sumergible sin carcasa de la Osmo Action 5 Pro.** El Informe 1 asume 20 m. **No verificado.** De este número depende R1 entero.
2. **Autonomía declarada de la Osmo Action 5 Pro**, y en qué resolución la mide DJI. El Informe 1 asume 240 minutos en 1080p/24. **No verificado.** De esto depende si "el número más grande de la guía" de la Action 6 queda empatado.
3. **Tamaño de sensor de la Osmo 360.** El Informe 1 dice "sensores cuadrados de 1/1,1 pulgadas, el mismo tamaño". **No verificado.** De esto depende si el pro de sensor de la Action 6 pasa a ser empate.
4. **Peso oficial de la Osmo Nano.** El Informe 1 dice "~52 g la unidad de cámara sola". El "~" delata la estimación. **No verificado.** De esto depende R2.
5. **Si la Osmo 360 tiene GNSS/GPS integrado.** GoPro afirma que la MAX2 es la única 360 con GPS, y el sitio publica esa afirmación **atribuida** (`GoPro afirma que…`). Mientras esté atribuida no es falsa, pero si la Osmo 360 tiene GPS y no lo verificamos, estamos vendiendo las dos y callando el dato. **No verificado.**
6. **Si la Osmo Nano trae 64 GB de memoria INTERNA o una microSD de 64 GB en el combo.** El título de ML dice "64GB" y nada más. **No verificado.** De esto depende R6, que es el rompimiento de mayor exposición.
7. **Todas las specs restantes de las tres nuevas**: resolución de video y foto, apertura, sistema de estabilización, pantallas, batería en mAh, montura, medidas, lentes. Cero verificado. Hay que armar las 13-15 specs de cada ficha desde dji.com y el manual.
8. **Los tres links `meli.la` de afiliado.** No existen. Regla dura del proyecto: **Juan pasa los links canónicos ANTES de que se arme nada**. Sin ellos no se puede escribir la tabla (la bloquea `check-table-product-links.cjs`) ni las fichas. **No inventar un `meli.la`, no usar el `matt_tool` del importador.**
9. **Las tres URLs de imagen de mlstatic.** No están en ningún informe. Hay que sacarlas de la publicación y verificarlas con GET.
10. **`freeShipping` y `soldQuantity` de las tres.** No verificados. `freeShipping` es dato real de la publicación, no aspiracional. `soldQuantity` se omite si no se leyó.
11. **Fecha de lanzamiento de la Osmo 360 y de la Osmo Nano.** Sin eso no se puede escribir la sección "cuál es la actual de cada línea", que es la razón de existir de la guía. **Hay que verificarlo antes de escribir esa sección, no durante.**

**Prohibiciones explícitas heredadas de decisiones ya tomadas:**
- **No mencionar una Osmo Action 7.** No está anunciada (`docs/clusters/camaras-deportivas/borrador-guia.md:180`).
- **No afirmar que la Action 4 y la Action 6 comparten cuerpo, batería o montura.** Es falso y ya se corrigió una vez: las baterías son 1770 vs 1950 mAh (`borrador-guia.md:894`).
- **No afirmar que el 8K de la Action 6 admite D-Log M de 10 bits** ni **que el sensor cuadrado permite reencuadrar sin recorte.** Los dos están marcados RECHAZADO, NO PUBLICAR por falta de fuente (`borrador-guia.md:808-809`).
- **"Es la primera cámara de acción con apertura variable"** es un claim de mercado absoluto que ya está publicado en cuatro lugares. Si la guía nueva lo repite, **repetirlo idéntico**, no reformularlo.

---

# 6. RIESGOS Y CONTRADICCIONES ENTRE INFORMES

**RG1. El supuesto no declarado que atraviesa el Informe 1.** Todo su bloque de "rompimientos" asume que las 3 DJI entran al pilar. Nunca lo dice como supuesto: lo presenta como consecuencia. Bajo el escenario A (el patrón real del silo) **la mayoría de esos ROMPE no ocurren**. Si el escritor toma el Informe 1 al pie de la letra sin leer esta sección, va a reescribir la tesis del pilar sin necesidad, tocar `updatedDate` y resetear las ventanas de maduración SEO de la guía más importante del silo. Este es el riesgo mayor del paquete.

**RG2. Contradicción de conteo entre informes.** Informe 1 dice "las 16 fichas de cámara". Informe 4 dice "DJI solo tiene 2 fichas" y "16 fichas de cámara". Verifiqué en disco: **16 fichas de cámara, líneas 14-901**, y la 17ª (`MLA23076923`, línea 905) ya es otra categoría. Confirmado. Pero el Informe 4 también avisa que `CURRENT_STATE.md:11` dice "208 guías" cuando el archivo tiene 203: **`CURRENT_STATE.md` está desactualizado y no es fuente confiable de conteos.**

**RG3. Datos que el Informe 1 dio por buenos sin evidencia.** Los cinco numerados en §5 puntos 1 a 5 (profundidad, autonomía y sensor de los modelos nuevos, peso de la Nano, GPS de la Osmo 360). El propio informe lo confiesa al final: *"no me los pasaron; solo tengo precio, rating, opiniones y tipo de las 3 nuevas"*. Marcó como ROZA lo que depende de ellos, lo cual es correcto, pero **también los usó como argumento en varios ROMPE**. Tratarlos todos como no verificados.

**RG4. Claim aritmético frágil ya publicado.** `guides.ts:251` (guía GoPro): *"De la MAX2 a la MISSION 1 PRO hay {{preciodif:…}} de diferencia, que es más que todos los escalones anteriores juntos"*. Los escalones suman 610.105 y la diferencia es 700.000: **el margen es de 89.895 sobre seis precios en vivo.** Un movimiento normal de precio lo da vuelta sin que nadie se entere. No lo tocan las DJI, pero conviene saber que está ahí.

**RG5. Bomba de tiempo por doble ficha de X5.** `guides.ts` (guía Insta360): *"{{reviews:MLA19710677}} opiniones, más que la X4 y la X5 juntas"*. Verificado: 1.778 contra 1.156 + 577 = 1.733. **Verdadero por 45 opiniones.** Doblemente frágil: (a) cualquier refresco de `reviewCount` lo invierte; (b) si "la X5" se leyera como el bundle (676) en vez de la pelada (577), la cuenta da 1.832 y la frase es **falsa**. Con dos fichas de X5 vivas, esa frase es un pasivo. No la tocan las DJI. No corregirla en este trabajo, pero dejarla anotada.

**RG6. Superlativo "más cara del catálogo" desplazado.** La X5 Essentials Bundle (1.759.229) es más cara que la MISSION 1 PRO (1.749.999) por 9.230. Ningún claim publicado se apoya en eso hoy (el de la MISSION 1 PRO dice "de las seis", scopeado a GoPro), pero si la guía DJI escribe "la Osmo 360 es la más cara del catálogo" **es falso**, y si escribe "la 360 más cara del catálogo" **también es falso** por culpa del bundle. Redactar como "la 360 más cara entre las versiones sin accesorios", o directamente no usar ese superlativo.

**RG7. El Informe 3 y el Informe 2 discrepan sobre `docs/fichas.md`.** El Informe 3 dice que el molde real del silo tech es más compacto que el checklist de `docs/fichas.md` (sin `articleBody`, `faq`, `structuredData`, `customerReviews`). Es correcto y verificado. Pero `CLAUDE.md` dice "leer SIEMPRE `docs/fichas.md` antes de importar un producto". **Resolución: leer `docs/fichas.md` para el proceso de verificación de fuentes y las reglas de honestidad, y copiar la FORMA de la ficha de `MLA62340610`.** El proceso manda, la forma la dicta el molde vecino.

**RG8. El Informe 3 calculó los slugs sobre los títulos crudos de ML y salen truncados.** Sus tres slugs (`…-rocksteady-hor-`, `…-rockste-`, `…-camara-negro-`) son correctos como cálculo pero **malos como decisión**. El propio informe lo recomienda al final. Los slugs de §4.1 de este brief son los que hay que usar. **No usar los del Informe 3.**

**RG9. Canibalización a vigilar.** Las dos fichas DJI ya targetean el modelo exacto (`DJI Osmo Action 6: precio en Argentina, specs y opiniones`) y las tres nuevas van a hacer lo mismo. En este sitio **las fichas rankean para modelo exacto y las guías para búsqueda de categoría**. La guía nueva tiene que targetear "qué DJI comprar" / "cámara DJI cuál comprar", **no** "dji osmo action 5 pro precio". Si el `seoTitle` de la guía se acerca al de una ficha, se canibalizan.

**RG10. `check-guide-monetization.cjs` bloquea la publicación de una guía sin `product-card` real.** Con 5 fichas DJI (2 existentes + 3 nuevas) el requisito se cumple, pero **las 3 fichas nuevas tienen que estar cargadas y con `affiliateUrl` real ANTES de que la guía compile.** Orden de trabajo obligatorio: links de Juan → verificación de specs en dji.com → 3 fichas → correcciones de §1 → guía nueva → checks.

---

## ORDEN DE EJECUCIÓN SUGERIDO

1. Pedir a Juan los **3 links `meli.la`**. Sin eso no arranca nada.
2. Verificar en dji.com y manuales los **11 puntos de §5**. Anotar cuáles quedan sin dato: esos van con caveat explícito en el `value` de la spec, o no van.
3. Cargar las **3 fichas** en `curated-products.ts`, contiguas a las dos DJI, con el orden de campos de §4.2.
4. Aplicar **R1 a R8 y R10** en `guides.ts` **y** `curated-products.ts` en el mismo pase. Releer el parche después de aplicarlo: en este proyecto los parches generan errores nuevos.
5. Escribir la **guía `dji-cual-comprar`** con la plantilla de §3.
6. Aplicar **R9**: links entrantes del pilar y de las dos hermanas + `sitemapLastmod: "2026-08-26"` en las tres. **Nunca `updatedDate`.**
7. Correr los checks de §3.9 **uno por uno**, no encadenados.
8. Trío auditor con la tabla de verdad de §2 como input, indicándole explícitamente que verifique **consistencia cruzada de superlativos en los dos archivos**.
9. Actualizar `CURRENT_STATE.md` (que ya está desactualizado en el conteo de guías). No commitear salvo que Juan lo pida.