# Research de keywords — sitio nuevo "deportes" (afiliados), 2026-08-06

Contexto: charla del 2026-08-06 sobre abrir un segundo sitio de afiliados ML Argentina,
dominio nuevo, repo nuevo. Arrancó como "gym" pero se amplió a **deportes en general**:
suplementos, indumentaria deportiva, futbol, tenis, padel, basquet, voley, ciclismo
(accesorios), crossfit, atletismo/running. El equipamiento de gimnasio en sí (mancuernas,
bicicleta fija, etc.) se decidió dejarlo como silo nuevo en **productosvirales**, no en
este sitio — ver `research-keywords-nuevos-rubros-2026-08-05.md`, rubro 1, ya tiene SD
real confirmado y coincide con lo encontrado hoy.

Fuente: **Keyword Planner (Google Ads)**, `kwp.py`, geo Argentina (2032), es (1003).
Solo da volumen real + competencia de **pauta paga**, no dificultad SEO orgánica (SD).
Para SD real hay que cruzar con Ubersuggest `keyword_overview` — no se hizo para las
~1.660 keywords (quota de 100 reportes/día), solo se haría para los candidatos finales
antes de comprometerse a escribir.

## Archivo de datos

CSV completo: [`sitio-deportes-keywords-2026-08-06.csv`](./sitio-deportes-keywords-2026-08-06.csv)
— 1.896 keywords únicas (deduplicadas de 2.000 filas crudas, 10 tandas de 200).

## Limpieza aplicada

Varios seeds (`zapatillas de tenis`, `zapatillas running`, `ropa deportiva`) trajeron
de regreso demanda genérica de calzado/indumentaria de marca (adidas, nike, puma, etc.)
sin relación real con el deporte específico — Google Ads asocia por sustantivo
("zapatillas"), no por contexto deportivo. Se separaron 235 keywords a un bucket
`Calzado/ropa deportiva generica de marca (descartar - ultra competido)` con ~1.477.540
búsquedas/mes agregadas — volumen enorme pero son los términos más competidos que existen
en español (Nike/Adidas/MercadoLibre global, DA 90+). **No usar para arrancar el sitio.**

**Advertencia:** el filtro fue automático por palabra clave y no es perfecto — la
categoría **Tenis** en particular quedó con solo 14 filas y todavía tiene ruido sin
depurar (ojotas nike, botas nike, adidas terrex no son de tenis). Revisar a mano antes
de usar esa categoría.

## Volumen total por categoría (agregado, sin filtrar por dificultad todavía)

| Categoría | Keywords | Volumen total/mes (aprox) |
| :-- | --: | --: |
| Indumentaria deportiva | 200 | ~765.280 |
| Futbol | 198 | ~738.100 |
| Suplementos | 200 | ~548.080 |
| Padel | 194 | ~136.480 |
| Voley | 193 | ~114.720 |
| Basquet | 196 | ~71.100 |
| Tenis | 14 (sucio, revisar) | ~65.600 |
| Ciclismo (accesorios) | 176 | ~59.940 |
| Atletismo/Running | 90 | ~42.850 |
| Crossfit | 200 | ~7.770 |

Nota: "Indumentaria deportiva" y en menor medida "Tenis"/"Atletismo" siguen teniendo
algo de sesgo hacia calzado de marca genérico que el filtro no separó al 100%; los
números de volumen total hay que leerlos con esa salvedad.

## Top 15 por categoría (limpio, ordenado por volumen)

### Suplementos
creatina (74.000) · colageno hidrolizado (33.100) · creatina monohidratada (33.100) ·
creatina monohidrato (33.100) · whey whey protein (22.200) · whey prowin (22.200) ·
creatina ena (9.900) · suplementos deportivos (8.100) · proteina whey (8.100) ·
creatina star nutrition (8.100)

### Futbol
pelota de futbol (40.500) · camisetas de boca (40.500) · adidas botines (33.100) ·
camiseta de futbol (18.100) · botines puma (12.100) · guantes de arquero (9.900) ·
botines futbol 5 (9.900) · botines futsal (9.900) · camiseta river (9.900)

### Padel
paleta de padel (18.100) · zapatillas padel (5.400) · pala padel (5.400) ·
zapatos padel (5.400) · zapatillas de padel (4.400) · paleta bullpadel (2.900)

### Voley
pelota de voley (18.100) · rodilleras voley (4.400) · zapatillas de voley (3.600) ·
red de voley (1.900)

### Basquet
pelota de basquet (8.100) · aro de basquet (4.400) · zapatillas basquet nike (1.600)

### Ciclismo (accesorios)
luces/casco para bicicleta (2.900 c/u, varias variantes) · jersey ciclismo (590) ·
guantes para bicicleta (590)

### Atletismo/Running
cinta caminadora electrica (1.600) · zapatillas trail running mujer (720) ·
chaleco de hidratacion (720) — seeds insuficientes, categoría con menos cobertura (90 kws)

### Crossfit
chaleco con peso (480) · anillas calistenia (480) · cajon de salto (480) —
volumen chico en general, el más chico de todos los rubros

### Tenis (sucio, revisar a mano)
raqueta de tenis (6.600) · pelotas de tenis (4.400) · zapatillas de tenis (2.400) ·
raqueta (2.400) — el resto del top 15 es ruido de calzado que no es de tenis

## Metodología

1. 10 tandas de `kwp.py` con 4-8 seeds semilla por categoría, `--limit 200`.
2. Deduplicado global (primera categoría que trae la keyword se queda con ella).
3. Filtro automático: si la categoría es de deporte específico y la keyword no
   contiene la palabra del deporte (o una marca/término asociado) pero sí contiene
   "zapatilla"/"zapato"/similar → reclasificada al bucket de descarte.
4. Sin cruce de SD real (Ubersuggest) todavía — pendiente para cuando se elijan
   los candidatos finales por categoría.

## SD real confirmado (Ubersuggest) — Futbol y Padel, 2026-08-06

### Futbol
Hallazgo clave: las **camisetas/jerseys son la parte más dificil**, no la más fácil —
son merchandising oficial licenciado (tiendas de club, Adidas oficial). El **equipamiento**
(botines, guantes) está en SD 6-13, mucho más accesible.

| Keyword | Vol/mes | SD | Intent |
| :-- | --: | --: | :-- |
| pelota de futbol | 40.500 | 13 | Informational |
| adidas botines | 33.100 | 13 | Transactional |
| botines puma | 12.100 | 11 | Transactional |
| guantes de arquero | 9.900 | **6** | Transactional |
| botines futbol 5 | 9.900 | 11 | Transactional |
| camiseta river | 9.900 | 12 | Transactional |
| camisetas de boca | 49.500 | **55** ⚠️ evitar | — |
| camiseta de futbol (generico) | 22.200 | **35** ⚠️ evitar | — |

Recomendación: pillar en botines/guantes de arquero, NO en camisetas genéricas ni de Boca.
"camiseta river" (SD12) es una rareza — mucho más accesible que el genérico o Boca, posible
spoke de club puntual a explorar.

### Padel
Categoría muy limpia y pareja, casi todo SD 7-10 — de las mejores relaciones
volumen/dificultad de toda la investigación del día.

| Keyword | Vol/mes | SD | Intent |
| :-- | --: | --: | :-- |
| paleta de padel | 18.100 | **7** | Transactional |
| zapatillas padel | 5.400 | 9 | Transactional |
| zapatillas de padel | 4.400 | 9 | Transactional |
| zapatillas padel mujer | 3.600 | 9 | Transactional |
| paleta bullpadel | 2.900 | 10 | Navigational |
| zapatillas padel hombre | 2.400 | 9 | Transactional |
| paleta adidas | 1.900 | 8 | Transactional |
| pala padel (sinónimo de "paleta") | 6.600 | **50** ⚠️ evitar | — |

**Gotcha importante:** "paleta de padel" y "pala padel" son el mismo objeto de compra,
dicho de dos formas — SD 7 vs SD 50. Usar siempre "paleta", nunca "pala", como término
ancla/título.

## SD real confirmado (Ubersuggest) — Suplementos, 2026-08-06

Contra lo que sugería la competencia de pauta paga (todo "ALTA" en Keyword Planner),
el SD real es mucho más accesible en los términos técnicos/de marca:

| Keyword | Vol/mes | SD | Nota |
| :-- | --: | --: | :-- |
| creatina | 74.000 | 23 | Volumen enorme, dificultad moderada |
| colageno hidrolizado | 33.100 | **11** | Gran volumen, muy accesible |
| creatina monohidrato | 22.200 | 15 | — |
| proteina whey | 8.100 | **10** | — |
| creatina ena | 8.100 | 14 | — |
| creatina star nutrition | 6.600 | **7** | — |
| suplementos deportivos (generico) | 8.100 | 22 | SERP de tienda (Farmacity/ML/Openfarma), evitar como pillar |
| whey prowin (marca) | 22.200 | **55** ⚠️ evitar | No toda marca es fácil, esta la domina el propio vendedor |

Total accesible (excluyendo los dos ⚠️): ~152.000/mes en SD 7-23.

### Marcas nacionales vs. premium internacionales

A pedido de Juan, se chequearon marcas nacionales que "andan muy bien" (Star Nutrition,
Gentech, Ena, Body Advance, Natural Whey, Pulver) vs. premium internacionales (BSN,
Universal Nutrition, Protein Project). **Importante:** se probaron los dos órdenes de
palabra ("marca proteina" y "proteina marca") porque ya habíamos visto que el orden
puede cambiar el SD radicalmente (ver "paleta de padel" SD7 vs "pala padel" SD50 en
Futbol/Padel).

| Marca | "[marca] proteina" | "proteina [marca]" | Mejor forma a usar |
| :-- | --: | --: | :-- |
| Star Nutrition | 5.400 / SD7 | 5.400 / SD6 | Cualquiera, casi igual |
| Ena | 2.400 / SD16 | 2.900 / SD12 | "proteina ena" |
| Body Advance | 70 / SD44 ⚠️ | **480 / SD5** ✅ | **"proteina body advance" — el orden cambia todo** |
| Gentech | 1.300 / SD9 | 1.600 / SD10 | Cualquiera, casi igual |
| Pulver | 390 / SD8 | 390 / SD8 | Idéntico |
| BSN | 110 / SD49 ⚠️ | **170 / SD6** ✅ | **"proteina bsn" — el orden cambia todo** |
| Natural Whey | 30 / SD44 ⚠️ | 40 / SD44 ⚠️ | Mala en los dos ordenes, se descarta |
| Universal Nutrition | 10 / SD44 ⚠️ | 10 / SD44 ⚠️ | Volumen casi nulo en los dos, se descarta |
| Protein Project | 480 / SD20 | (no probado en orden inverso) | Volumen chico, dificultad moderada |

**Ranking final de marcas para spokes, por prioridad:** 1) Star Nutrition (5.400, SD6-7);
2) Ena (2.900, SD12, usando "proteina ena"); 3) Body Advance (480, SD5, usando "proteina
body advance" — la sorpresa de la tanda); 4) Gentech (1.600, SD9); 5) Pulver (390, SD8).
Natural Whey y Universal Nutrition quedan afuera (confirmado en los dos órdenes, no es
un problema de búsqueda). Las premium internacionales en general tienen volumen
insignificante en Argentina (10-480/mes) frente a las nacionales.

## SD real confirmado (Ubersuggest) — Basquet, Voley, Ciclismo, Crossfit, 2026-08-06

### Basquet
Mismo patrón que en futbol/tenis/padel: **zapatillas + marca es zona de riesgo**, pero
solo para algunas marcas — Nike sale mucho más difícil que Adidas en esta categoría.

| Keyword | Vol/mes | SD |
| :-- | --: | --: |
| pelota de basquet | 8.100 | **9** |
| aro de basquet | 4.400 | 13 |
| zapatillas de basquet adidas | 1.300 | 13 |
| zapatillas basquet nike | 1.900 | **44** ⚠️ evitar |

### Voley
La categoría más limpia de todo el día — sin ninguna trampa, SD 9-13 parejo.

| Keyword | Vol/mes | SD |
| :-- | --: | --: |
| pelota de voley | 18.100 | **9** |
| rodilleras voley | 4.400 | 11 |
| zapatillas de voley | 3.600 | 13 |
| red de voley | 2.400 | **9** |

### Ciclismo (accesorios)
Otro gotcha de preposición: "casco **para** bicicleta" (SD10) vs "casco **de** bicicleta"
(SD18) — casi el doble de dificil por cambiar una palabra. Usar "para", no "de".

| Keyword | Vol/mes | SD |
| :-- | --: | --: |
| casco para bicicleta | 2.900 | **10** |
| luces para bicicleta | 2.900 | 10 |
| guantes para bicicleta | 590 | 9 |
| casco de bicicleta | 2.400 | 18 (evitar esta forma) |

### Crossfit
Confirma lo que ya sabíamos: categoría chica en Argentina (todo el rubro suma ~7.770/mes
en 200 keywords relevadas), pero limpia, sin trampas de marca.

| Keyword | Vol/mes | SD |
| :-- | --: | --: |
| cajon de salto | 480 | **6** |
| anillas calistenia | 480 | 14 |
| chaleco con peso | 480 | 15 |
| chaleco lastrado | 170 | 17 |

## SD real confirmado (Ubersuggest) — Atletismo/Running, 2026-08-06

La categoría más floja de las ocho relevadas. La mayoria del volumen de los seeds
"running" es zapatillas de marca (Nike, Asics, Puma) — mismo riesgo que en las demas
categorias. Lo especifico de running tiene volumen chico.

| Keyword | Vol/mes | SD | Nota |
| :-- | --: | --: | :-- |
| cronometro deportivo | 880 | 16 | — |
| cinta caminadora electrica | 1.300 | 9 | ⚠️ Es una cinta de correr (equipo de gimnasio) — se solapa con el silo que va a productosvirales, no es de este sitio |
| chaleco de hidratacion | 720 | **8** | Unico item 100% especifico de running, sin solapamiento |
| zapatillas trail running mujer | 720 | 11 | — |
| mochila de hidratacion | 320 | 9 | — |
| banda para correr | 10 | 32 | Sin volumen real, descartar |

Volumen limpio real (sin la cinta caminadora que es de otro silo, sin la banda muerta):
~2.640/mes — mas chico que crossfit (~7.770/mes agregado). Atletismo/running, con lo
relevado hasta ahora, es la categoria mas debil de las ocho.

## Resumen de las 8 categorias con SD real (2026-08-06) — todo excepto Indumentaria

| Categoria | Mejor volumen limpio/mes (aprox) | Rango SD tipico | Trampa a evitar |
| :-- | --: | :-- | :-- |
| Futbol (gear, sin camisetas) | ~115.400 | 6-13 | Camisetas/jerseys oficiales (SD35-55) |
| Suplementos | ~152.000 | 7-23 | Termino generico "suplementos deportivos" (SERP de tienda); marcas mal buscadas (ver orden de palabras) |
| Voley | ~28.500 | 9-13 | Ninguna encontrada — la mas limpia |
| Padel | ~38.700 | 7-10 | "pala padel" vs "paleta de padel" (SD50 vs SD7, mismo objeto) |
| Basquet | ~13.800 | 9-13 | "zapatillas basquet nike" (SD44) vs adidas (SD13) |
| Ciclismo (accesorios) | ~6.390 | 9-10 | "casco de bicicleta" (SD18) vs "casco para bicicleta" (SD10) |
| Crossfit | ~1.610 (top4) / ~7.770 (agregado 200kw) | 6-17 | Ninguna encontrada, solo volumen chico en general |
| Atletismo/Running | ~2.640 | 8-16 | Casi todo el volumen "running" es zapatillas de marca; cinta caminadora se solapa con gimnasio |

**Patron transversal de todo el dia:** en casi todas las categorias, la forma exacta de
decir la keyword (orden de palabras, preposicion, marca especifica) cambia el SD
drasticamente aunque el volumen sea igual o similar. Nunca asumir el SD de una variante
a partir de otra sin chequearla.

## SD real confirmado (Ubersuggest) — Indumentaria deportiva, 2026-08-06

Juan la dejó para el final por intuir que era "muy competitiva y el ticket no tan alto".
El SD real **corrige parcialmente esa intuición**: evitando el ruido de zapatillas/calzado
de marca (que sí es dificil, SD44-55, visto en todas las demas categorias), la ropa
deportiva generica tiene SD parejo de 11-15 — igual de accesible que futbol, padel o
suplementos. Lo que SÍ se sostiene es el ticket: una prenda cuesta bastante menos que
una paleta de padel o un pote de creatina, entonces la comision por venta es menor.

| Keyword | Vol/mes | SD |
| :-- | --: | --: |
| ropa deportiva | 18.100 | 15 |
| short deportivo | 6.600 | 14 |
| conjunto deportivo mujer | 6.600 | 12 |
| top deportivo mujer | 3.600 | 12 |
| calzas deportivas | 2.900 | **11** |
| buzo deportivo | 1.300 | 13 |
| remera deportiva | 1.000 | **11** |
| musculosa gym | 260 | 11 |

Total: ~40.360/mes en SD 11-15.

## Resumen final de las 9 categorias, 2026-08-06

| Categoria | Volumen limpio/mes (aprox) | Rango SD tipico |
| :-- | --: | :-- |
| Suplementos | ~152.000 | 7-23 |
| Futbol (gear) | ~115.400 | 6-13 |
| Padel | ~38.700 | 7-10 |
| Indumentaria (generica, sin calzado de marca) | ~40.360 | 11-15 |
| Voley | ~28.500 | 9-13 |
| Basquet | ~13.800 | 9-13 |
| Ciclismo (accesorios) | ~6.390 | 9-10 |
| Atletismo/Running | ~2.640 | 8-16 |
| Crossfit | ~1.610 (top4) | 6-17 |

**Trampa transversal confirmada en las 9 categorias:** zapatillas/calzado + marca grande
global (Nike, Adidas, Puma) es sistematicamente dificil (SD35-55), sin importar el
deporte. Todo lo demas — equipamiento, accesorios, indumentaria generica, marcas
nacionales de nicho — ronda SD 6-23 en las 9 categorias.

## Ronda 2: mas deportes + camisetas de clubes, 2026-08-06

A pedido de Juan se sumaron 7 categorias nuevas: Hockey (cesped), Rugby, Boxeo,
Natacion, Pesca, Trekking/Camping, y Camisetas de clubes/selecciones. Nuevo archivo
de datos: [`todas_las_keywords_LIMPIO_v2.csv`]. Total acumulado: **3.368 keywords
unicas** en 16 categorias + el bucket de descarte.

### Camisetas de clubes/selecciones — el mayor giro del dia

Categoria mas grande de todo el research (~844.000/mes en volumen crudo), pero con
SD que varia muchisimo segun la forma exacta de la keyword — el mismo patron de
"pala/paleta" y "casco de/para" visto antes, aca con consecuencias mucho mas grandes.

| Keyword | Vol/mes | SD |
| :-- | --: | --: |
| camiseta argentina (singular) | 40.500 | **13** |
| camiseta de river | 27.100 | **11** |
| remera argentina | 14.800 | **11** |
| remera de boca | 14.800 | 15 |
| camiseta boca (singular, sin "de") | 12.100 | 17 |
| camisetas de boca (plural + "de") | 49.500 | **55** ⚠️ evitar esta forma |

**Regla:** usar singular ("camiseta X"), evitar plural con "de" ("camisetas de X").
Total accesible con las formas correctas: ~109.300/mes en SD 11-17 — una de las
mejores oportunidades de toda la investigacion.

### Hockey (cesped), Rugby, Boxeo, Natacion, Pesca, Trekking/Camping

Todas limpias, sin trampas nuevas (aparte del patron ya conocido de zapatillas+marca).
**Boxeo** fue la sorpresa: el SD mas bajo y parejo del dia.

| Categoria | Keyword | Vol/mes | SD |
| :-- | :-- | --: | --: |
| Boxeo | guantes de boxeo | 14.800 | **7** |
| Boxeo | bolsa de boxeo | 5.400 | **6** |
| Boxeo | vendas de boxeo | 2.900 | **5** |
| Pesca | caña de pescar | 9.900 | 14 |
| Pesca | reel de pesca | 4.400 | **7** |
| Pesca | anzuelos | 2.400 | 12 |
| Trekking/Camping | bolsa de dormir | 8.100 | 10 |
| Trekking/Camping | mochila trekking | 1.900 | 11 |
| Trekking/Camping | bastones de trekking | 1.900 | **8** |
| Hockey (cesped) | palo de hockey | 6.600 | **7** |
| Hockey (cesped) | canilleras hockey | 1.600 | **7** |
| Rugby | pelota de rugby | 4.400 | 9 |
| Rugby | botines de rugby | 1.900 | 13 |
| Natacion | antiparras natacion | 4.400 | **8** |
| Natacion | gorro de natacion | 1.900 | **7** |

### Resumen actualizado — TODAS las categorias con SD real, ordenadas por volumen accesible

| Categoria | Volumen accesible/mes (aprox) | Rango SD |
| :-- | --: | :-- |
| Camisetas de clubes/selecciones (forma correcta) | ~109.300 | 11-17 |
| Suplementos | ~152.000 | 7-23 |
| Futbol (gear, sin camisetas) | ~115.400 | 6-13 |
| Indumentaria (generica) | ~40.360 | 11-15 |
| Padel | ~38.700 | 7-10 |
| Voley | ~28.500 | 9-13 |
| Boxeo | ~23.100 | 5-7 |
| Pesca | ~16.700 | 7-14 |
| Basquet | ~13.800 | 9-13 |
| Trekking/Camping | ~11.900 | 8-11 |
| Hockey (cesped) | ~8.200 | 7 |
| Ciclismo (accesorios) | ~6.390 | 9-10 |
| Rugby | ~6.300 | 9-13 |
| Natacion | ~6.300 | 7-8 |
| Atletismo/Running | ~2.640 | 8-16 |
| Crossfit | ~1.610 | 6-17 |

## Próximo paso sugerido

Elegir 2-3 categorías prioritarias (por volumen + intuición de negocio, ej. futbol y
padel parecen los más sanos y con mejor volumen real después de la limpieza) y correr
`keyword_overview` de Ubersuggest sobre sus top 15-20 candidatos para tener SD real
antes de armar el mapa de silo, igual que se hizo con el research de fitness del
2026-08-05.
