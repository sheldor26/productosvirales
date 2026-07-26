# Tráfico potencial — documento vivo

**Reporte publicado (Artifact, siempre la misma URL):**
https://claude.ai/code/artifact/a25daea6-9777-4f07-b039-aa8e2a2d6eac

Este archivo es la fuente de datos canónica. El Artifact de arriba es la
versión visual que se le entrega a Juan; se regenera desde esta tabla, nunca
al revés. Mismo patrón que el equivalente en essentialpetgear
(`../essentialpetgear/docs/traffic-potential.md`), adaptado a que
productosvirales ya tiene tráfico real (a diferencia de un sitio nuevo).

## Regla (pedida por Juan 2026-07-26, seguir siempre)

Cada vez que se termina de publicar una guía nueva o un silo completo:

1. **Sacar su keyword principal, volumen (Keyword Planner AR) y estado real
   en GSC** (posición ponderada de la URL en el snapshot más reciente, o
   "Sin datos aún" si es muy nueva) con el mismo método de la sección de
   abajo.
2. **Agregarla a la tabla** con el mismo formato que las filas existentes.
3. **Volver a sumar los totales** (arriba y por estado).
4. **Republicar el Artifact** (mismo `file_path`, mismo `url` de arriba para
   no generar un link nuevo) con la tabla y los totales actualizados.

No hace falta re-auditar filas viejas cada vez, salvo las que ya tengan
datos reales de GSC nuevos que valga la pena refrescar (ver próximo punto).

## Hoy real: refrescar en cada actualización, no solo al agregar filas

A diferencia de volumen (que no cambia) y de la keyword (que no cambia), la
columna **Hoy (clicks reales)** y el **estado real (GSC)** de las filas YA
existentes hay que refrescarlos contra el snapshot más reciente de
`gsc.py` cada vez que se toca este archivo, no solo agregar la fila nueva.
Es el dato que permite comparar la proyección contra la realidad con el
tiempo (ver "Baseline congelado" abajo). Si refrescar las 157 filas es
mucho para una actualización chica, priorizar al menos las guías más viejas
(más probabilidad de que su posición real haya cambiado) y las de mayor
volumen.

## Baseline congelado — NO pisar, solo agregar una fila nueva al lado

Las columnas **Realista 6-12m** y **Techo optimista** de la corrida
**2026-07-26** son la proyección original: quedan congeladas tal cual están
abajo, no se recalculan ni se ajustan con el tiempo. La idea es poder
contestar en 6-12 meses (≈ enero-julio 2027) "¿la proyección le pegó o no
le pegó" comparando el **Hoy real** de ese momento contra el **Realista**
de esta corrida — no contra un número que se fue corrigiendo en el camino.

Si en una actualización futura cambia sustancialmente el método de cálculo
(por ejemplo, si vuelve a haber cupo de Ubersuggest y se suma dificultad
SEO real), no reemplazar esta columna: agregar una columna nueva
("Realista v2, corrida AAAA-MM-DD") al lado, dejando la v1 intacta como
referencia histórica.

## Diferencia clave con el reporte de essentialpetgear

Essentialpetgear es un sitio nuevo sin backlinks: su "hoy" es 0 por
definición, y el tier de dificultad (fácil/medio/difícil) sale de la
`seo_difficulty` de Ubersuggest.

Productosvirales ya tiene Search Console con historial real. Por eso:

1. **"Hoy" no es una suposición, son los clicks reales del snapshot GSC más
   reciente** (`scripts/gsc/gsc.py`, tabla `metrics` dim `page`, URLs
   colapsadas sin fragments `#`).
2. **El "estado" de cada guía es su posición promedio real en GSC**, no un
   tier de dificultad genérico. Bucket real medido, no una dificultad
   estimada a futuro:
   - **Pos ≤10** (ya está bien posicionada)
   - **Pos 11-30** (visible pero floja)
   - **Sin datos aún** (muy nueva, o STAGED sin publicar)
3. **"Realista" y "techo" se calculan desde la posición REAL de cada guía**,
   no desde un piso fijo por tier: `realista_pos = max(3, pos_real × 0.75)`,
   `techo_pos = max(1.5, pos_real × 0.4)`. Un piso conservador (nunca por
   debajo de lo que ya está pasando hoy).
4. **El volumen sale de Google Keyword Planner (Google Ads API,
   `generate_keyword_historical_metrics`, AR/es), no de Ubersuggest.**
   Ubersuggest llegó a su límite diario de reportes (100/día) el mismo día
   en que se armó este reporte (2026-07-26), así que no hubo cruce de
   control por keyword esta vez ni dificultad SEO real (Ubersuggest es la
   única fuente que la da; el `competition_index` de Keyword Planner es
   competencia de anuncios pagos, no dificultad orgánica, y salió saturado
   en HIGH/100 para casi todo — no sirve para diferenciar tiers). Pendiente
   para la próxima actualización: correr el cruce de control cuando
   Ubersuggest libere cupo.

## Alcance: las 157 guías completas, no solo pilares

A diferencia de essentialpetgear (1 fila por categoría), acá se pidió
explícitamente cubrir las 157 guías del sitio, incluidas las satélites de
marca (`microondas-atma`, `microondas-bgh` además de `microondas`). Esto
significa que varias filas comparten esencialmente el mismo espacio de
keyword que su guía pilar — el total de volumen sumado sobreestima la
demanda real por ese solapamiento. Ver caveats.

## Cómo se calcula cada fila

1. **Keyword principal**: derivada del título/H1 de la guía (intención del
   autor), no de la query real que hoy le trae tráfico — para mantener el
   criterio consistente en las 157 filas, incluidas las que todavía no
   tienen tráfico real. Mapeo completo en el histórico de esta sesión
   (`scripts/keyword-planner/bulk_historical_metrics.py` + lista de 157
   keywords).
2. **Volumen**: Google Keyword Planner, AR (`geoTargetConstants/2032`),
   español (`languageConstants/1003`), vía
   `scripts/keyword-planner/bulk_historical_metrics.py` (script nuevo:
   pide métricas EXACTAS para una lista de keywords propias en una sola
   tanda de requests, a diferencia de `kwp.py` que expande a ideas
   relacionadas).
3. **Estado real**: posición promedio ponderada por impresiones de la URL
   de la guía en el snapshot GSC más reciente (#31, 2026-06-27 a
   2026-07-24), fragments `#` ya colapsados a la URL base.
4. **Hoy (clicks reales)**: clicks reales de esa URL en el mismo snapshot.
   No es una proyección.
5. **Realista / techo**: `estimate_serp_clicks` (Ubersuggest, no consume
   cupo de reportes) sobre el volumen de Keyword Planner, en la posición
   `realista_pos` / `techo_pos` calculada desde la posición real (ver
   arriba). Nunca por debajo de los clicks reales de hoy (piso aplicado).

## Tabla (157 guías, 151 publicadas + 6 STAGED, corrida 2026-07-26)

| Guía | Keyword | Vol/mes (Keyword Planner AR) | Estado real (GSC) | Hoy (clicks reales) | Realista 6-12m | Techo optimista |
|---|---|---:|---|---:|---:|---:|
| mejores-freidoras-de-aire-argentina | freidora de aire | 90.500 | Pos 6.7 | 233 | 4.244 | 8.806 |
| perfumes-arabes | perfumes arabes | 90.500 | Pos 8.2 | 7 | 3.059 | 8.806 |
| auriculares-inalambricos | auriculares inalambricos | 74.000 | Pos 5.9 | 3 | 4.877 | 11.988 |
| microondas | microondas | 49.500 | Pos 4.7 | 29 | 3.262 | 8.019 |
| aire-acondicionado-portatil | aire acondicionado portatil | 49.500 | Pos 7.8 | 1 | 1.673 | 4.816 |
| camara-de-seguridad | camara de seguridad | 49.500 | Pos 8.3 | 7 | 1.673 | 4.816 |
| pava-electrica | pava electrica | 49.500 | Pos 5.6 | 82 | 3.262 | 8.019 |
| masajeador | masajeador | 49.500 | Pos 6.6 | 0 | 2.322 | 4.816 |
| termotanque-electrico | termotanque electrico | 49.500 | Pos 8.0 | 5 | 1.673 | 4.816 |
| chromecast | chromecast | 49.500 | Pos 7.1 | 3 | 2.322 | 4.816 |
| horno-electrico | horno electrico | 40.500 | Pos 6.2 | 14 | 1.899 | 6.561 |
| parlante-jbl | parlante jbl | 40.500 | Pos 8.9 | 3 | 1.037 | 2.669 |
| yogurtera | yogurtera | 40.500 | Pos 8.4 | 3 | 1.369 | 3.941 |
| silla-gamer | silla gamer | 33.100 | Pos 7.1 | 8 | 1.552 | 3.221 |
| ventilador-de-techo | ventilador de techo | 33.100 | Pos 9.6 | 1 | 847 | 2.181 |
| ventilador-de-pie | ventilador de pie | 33.100 | STAGED | 0 | 10 | 652 |
| smartwatch | smartwatch | 33.100 | Pos 8.9 | 2 | 847 | 2.181 |
| caloventor | caloventor | 27.100 | Pos 6.0 | 20 | 1.786 | 4.390 |
| licuadora | licuadora | 27.100 | Pos 6.4 | 25 | 1.271 | 2.637 |
| robot-aspiradora | robot aspiradora | 27.100 | Pos 8.0 | 0 | 916 | 2.637 |
| mejor-aspiradora-robot | aspiradora robot | 27.100 | Pos 8.7 | 28 | 916 | 1.786 |
| cafetera-italiana | cafetera italiana | 27.100 | Pos 6.5 | 0 | 1.271 | 2.637 |
| secador-de-pelo | secador de pelo | 27.100 | Pos 7.7 | 13 | 916 | 2.637 |
| estufas-electricas | estufa electrica | 22.200 | Pos 6.8 | 10 | 1.041 | 2.160 |
| balanza-digital | balanza digital | 22.200 | Pos 6.4 | 10 | 1.041 | 2.160 |
| cafetera-express | cafetera express | 22.200 | Pos 8.4 | 63 | 750 | 2.160 |
| humidificador | humidificador | 22.200 | Pos 8.3 | 7 | 750 | 2.160 |
| termo | termo | 22.200 | Pos 8.2 | 4 | 750 | 2.160 |
| nebulizador | nebulizador | 22.200 | Pos 8.9 | 7 | 568 | 1.463 |
| tensiometro-digital | tensiometro digital | 22.200 | Pos 9.3 | 3 | 568 | 1.463 |
| termotanque-a-gas | termotanque a gas | 22.200 | Sin datos aun | 0 | 6 | 437 |
| joystick-ps5 | joystick ps5 | 18.100 | Pos 7.4 | 2 | 612 | 1.761 |
| parlantes | parlantes bluetooth | 18.100 | Pos 7.3 | 4 | 612 | 1.761 |
| auriculares-jbl | auriculares jbl | 18.100 | Pos 6.1 | 0 | 849 | 2.932 |
| mejores-perfumes-arabes-hombre | perfume arabe hombre | 18.100 | Pos 8.9 | 67 | 463 | 1.193 |
| planchita-de-pelo | planchita de pelo | 14.800 | Pos 6.4 | 1 | 694 | 1.440 |
| proyector-portatil | proyector portatil | 14.800 | Pos 7.5 | 22 | 500 | 1.440 |
| cargador-portatil | cargador portatil | 12.100 | Pos 7.8 | 2 | 409 | 1.177 |
| atma-freidoras-de-aire-review | freidora de aire atma | 12.100 | Pos 6.1 | 31 | 567 | 1.960 |
| khamrah-lattafa | khamrah lattafa | 12.100 | Pos 6.7 | 0 | 567 | 1.177 |
| cafetera-nespresso | cafetera nespresso | 12.100 | Pos 16.6 | 2 | 19 | 310 |
| cafetera-oster | cafetera oster | 12.100 | Pos 7.4 | 3 | 409 | 1.177 |
| tostadora | tostadora | 12.100 | Pos 9.0 | 9 | 310 | 797 |
| masajeador-cervical | masajeador cervical | 9.900 | Pos 6.1 | 35 | 464 | 1.604 |
| botella-termica | botella termica | 9.900 | Sin datos aun | 0 | 3 | 195 |
| ducha-electrica | ducha electrica | 9.900 | Sin datos aun | 0 | 3 | 195 |
| termometro-digital | termometro digital | 9.900 | Pos 6.6 | 0 | 464 | 963 |
| camara-de-seguridad-exterior | camara de seguridad exterior | 8.100 | Pos 10.0 | 2 | 160 | 534 |
| pava-electrica-philips | pava electrica philips | 8.100 | Pos 5.9 | 6 | 534 | 1.312 |
| yara-lattafa-guia-completa | yara lattafa | 8.100 | Pos 6.4 | 20 | 380 | 788 |
| cafetera-dolce-gusto | cafetera dolce gusto | 8.100 | Pos 9.9 | 3 | 207 | 534 |
| microondas-bgh | microondas bgh | 6.600 | Pos 6.2 | 0 | 310 | 1.069 |
| recetas-freidora-de-aire | recetas para freidora de aire | 6.600 | Pos 9.1 | 3 | 169 | 435 |
| lattafa-asad-comparativa | lattafa asad | 6.600 | Pos 7.4 | 2 | 223 | 642 |
| maquina-de-afeitar | maquina de afeitar | 6.600 | Pos 8.0 | 0 | 223 | 642 |
| parrilla-electrica | parrilla electrica | 6.600 | STAGED | 0 | 2 | 130 |
| robot-de-cocina | robot de cocina | 5.400 | Pos 7.3 | 10 | 183 | 525 |
| auriculares-gamer | auriculares gamer | 5.400 | Pos 8.8 | 4 | 138 | 356 |
| licuadora-portatil | licuadora portatil | 5.400 | Pos 7.4 | 0 | 183 | 525 |
| masajeador-espalda | masajeador de espalda | 5.400 | Pos 9.3 | 7 | 138 | 356 |
| pistola-masajeadora | pistola masajeadora | 5.400 | Pos 7.8 | 1 | 183 | 525 |
| peabody-freidoras-de-aire-review | freidora de aire peabody | 5.400 | Pos 6.1 | 22 | 253 | 875 |
| teclado-gamer | teclado gamer | 4.400 | Pos 7.5 | 1 | 149 | 428 |
| mouse-gamer | mouse gamer | 4.400 | Pos 7.3 | 0 | 149 | 428 |
| joystick-xbox | joystick xbox | 4.400 | Pos 6.3 | 1 | 206 | 713 |
| licuadora-philips | licuadora philips | 4.400 | Pos 9.1 | 0 | 113 | 290 |
| pava-electrica-atma | pava electrica atma | 4.400 | Pos 9.3 | 2 | 113 | 290 |
| masajeador-facial | masajeador facial | 4.400 | Pos 8.1 | 7 | 149 | 428 |
| masajeador-pies | masajeador de pies | 4.400 | Pos 6.2 | 2 | 206 | 713 |
| philips-freidoras-de-aire-review | freidora de aire philips | 4.400 | Pos 6.4 | 10 | 206 | 428 |
| lattafa-guia-marca | perfumes lattafa | 4.400 | Pos 6.6 | 0 | 206 | 428 |
| cafetera-peabody | cafetera peabody | 4.400 | Pos 9.5 | 0 | 113 | 290 |
| procesadora-de-alimentos | procesadora de alimentos | 4.400 | STAGED | 0 | 1 | 87 |
| alarma-para-casa | alarma para casa | 4.400 | STAGED | 0 | 1 | 87 |
| monitor-gamer | monitor gamer | 3.600 | Pos 7.6 | 0 | 122 | 350 |
| licuadora-oster | licuadora oster | 3.600 | Pos 5.6 | 1 | 237 | 583 |
| pava-electrica-precio | pava electrica precio | 3.600 | Pos 8.3 | 0 | 122 | 350 |
| masajeador-gadnic | masajeador gadnic | 3.600 | Pos 5.9 | 24 | 237 | 583 |
| microondas-atma | microondas atma | 2.900 | Pos 7.7 | 0 | 98 | 282 |
| horno-atma | horno electrico atma | 2.900 | Pos 9.2 | 0 | 74 | 191 |
| joystick-pc | joystick pc | 2.900 | Pos 6.2 | 10 | 136 | 470 |
| torre-de-sonido | torre de sonido | 2.900 | Pos 6.7 | 11 | 136 | 282 |
| parlante-stromberg | parlante stromberg | 2.900 | Pos 6.9 | 6 | 136 | 282 |
| estufa-electrica-bajo-consumo | estufa electrica bajo consumo | 2.900 | Pos 8.9 | 22 | 74 | 191 |
| sillon-masajeador | sillon masajeador | 2.900 | Pos 6.1 | 3 | 136 | 470 |
| mejores-robot-aspiradora-trapeadora | robot aspiradora trapeadora | 2.900 | Pos 11.8 | 0 | 43 | 136 |
| cafetera-de-filtro | cafetera de filtro | 2.900 | Pos 5.9 | 32 | 191 | 470 |
| cortadora-de-pelo | cortadora de pelo | 2.900 | Pos 7.7 | 6 | 98 | 282 |
| cepillo-de-dientes-electrico | cepillo de dientes electrico | 2.900 | STAGED | 0 | 1 | 57 |
| cerradura-inteligente | cerradura inteligente | 2.900 | STAGED | 0 | 1 | 57 |
| joystick-para-celular | joystick para celular | 2.400 | Pos 9.6 | 2 | 61 | 158 |
| pava-electrica-peabody | pava electrica peabody | 2.400 | Pos 7.6 | 8 | 81 | 234 |
| oster-freidoras-de-aire-review | freidora de aire oster | 2.400 | Pos 7.2 | 0 | 113 | 234 |
| licuadora-de-mano | licuadora de mano | 1.900 | Pos 6.8 | 2 | 89 | 185 |
| pava-electrica-liliana | pava electrica liliana | 1.900 | Pos 5.7 | 0 | 125 | 308 |
| cafetera-de-capsulas | cafetera de capsulas | 1.900 | Pos 7.4 | 0 | 64 | 185 |
| cafetera-smartlife | cafetera smartlife | 1.900 | Pos 6.2 | 18 | 89 | 308 |
| masajeador-electrico | masajeador electrico | 1.600 | Pos 9.4 | 1 | 41 | 105 |
| perfumes-arabes-mujer | perfumes arabes mujer | 1.600 | Pos 9.1 | 127 | 127 | 127 |
| robot-aspiradora-roomba | roomba | 1.600 | Pos 10.9 | 1 | 32 | 105 |
| depiladora-electrica | depiladora electrica | 1.600 | Pos 8.7 | 1 | 54 | 105 |
| kit-camaras-seguridad | kit de camaras de seguridad | 1.300 | Pos 11.6 | 1 | 19 | 61 |
| licuadora-atma | licuadora atma | 1.300 | Pos 8.3 | 0 | 44 | 126 |
| pava-electrica-mercadolibre | pava electrica mercadolibre | 1.300 | Pos 9.0 | 0 | 33 | 86 |
| auriculares-deportivos | auriculares deportivos | 1.000 | Pos 7.0 | 1 | 47 | 97 |
| pava-electrica-oster | pava electrica oster | 1.000 | Pos 8.2 | 0 | 34 | 97 |
| gadnic-freidora-review | freidora de aire gadnic | 1.000 | Pos 7.7 | 3 | 34 | 97 |
| robot-aspiradora-samsung | robot aspiradora samsung | 1.000 | Pos 9.0 | 0 | 26 | 66 |
| cafetera-automatica | cafetera automatica | 1.000 | Pos 12.4 | 0 | 15 | 47 |
| bombilla-de-mate | bombilla de mate | 1.000 | Sin datos aun | 0 | 0 | 20 |
| kanji-home-freidora-review | freidora de aire kanji home | 880 | Pos 7.7 | 0 | 30 | 86 |
| suono-airfryer-review | freidora de aire suono | 880 | Pos 6.0 | 0 | 58 | 143 |
| robot-aspiradora-atma | robot aspiradora atma | 880 | Pos 6.9 | 3 | 41 | 86 |
| cafetera-liliana | cafetera liliana | 880 | Pos 6.0 | 1 | 58 | 143 |
| pava-electrica-vidrio | pava electrica de vidrio | 720 | Pos 6.0 | 1 | 47 | 117 |
| pava-electrica-acero-inoxidable | pava electrica acero inoxidable | 720 | Pos 7.4 | 9 | 24 | 70 |
| ninja-crispi-review | ninja crispi | 590 | Pos 9.0 | 0 | 15 | 39 |
| masajeador-espalda-cuello | masajeador de espalda y cuello | 390 | Pos 6.8 | 1 | 18 | 38 |
| accesorios-para-freidora-de-aire | accesorios para freidora de aire | 390 | Pos 8.2 | 0 | 13 | 38 |
| perfumes-arabes-originales | perfumes arabes originales | 390 | Pos 7.3 | 2 | 13 | 38 |
| robot-aspiradora-xiaomi | robot aspiradora xiaomi | 390 | Pos 8.2 | 12 | 13 | 38 |
| kit-gamer | kit gamer | 320 | Pos 7.2 | 0 | 15 | 31 |
| mejores-freidoras-de-aire-doble-canasta | freidora de aire doble canasta | 320 | Pos 6.7 | 6 | 15 | 31 |
| como-usar-una-freidora-de-aire | como usar una freidora de aire | 320 | Pos 7.6 | 0 | 11 | 31 |
| cuanto-consume-freidora-de-aire | cuanto consume una freidora de aire | 320 | Pos 7.5 | 3 | 11 | 31 |
| perfumes-arabes-mas-vendidos-argentina | perfumes arabes mas vendidos | 320 | Pos 5.9 | 97 | 97 | 97 |
| auriculares-profesionales | auriculares profesionales | 260 | Pos 6.1 | 0 | 12 | 42 |
| powerxl-freidora-review | freidora de aire powerxl | 260 | Pos 10.6 | 0 | 5 | 17 |
| perfumes-arabes-precio-argentina | perfumes arabes precio | 260 | Pos 7.2 | 5 | 12 | 25 |
| perfumes-arabes-dupes | dupes de perfumes arabes | 260 | Pos 7.4 | 100 | 100 | 100 |
| freidoras-de-aire-con-grill-argentina | freidora de aire con grill | 170 | Pos 7.2 | 1 | 8 | 17 |
| perfumes-arabes-amaderados | perfumes arabes amaderados | 170 | Pos 7.4 | 22 | 22 | 22 |
| robot-aspiradora-precio-argentina | robot aspiradora precio | 170 | Pos 8.1 | 0 | 6 | 17 |
| robot-aspiradora-gadnic | robot aspiradora gadnic | 170 | Pos 8.9 | 10 | 10 | 11 |
| pava-electrica-control-temperatura | pava electrica con control de temperatura | 90 | Pos 7.1 | 5 | 5 | 9 |
| mejores-freidoras-de-aire-economicas-argentina | freidora de aire economica | 70 | Pos 15.4 | 1 | 1 | 2 |
| que-cafetera-comprar | que cafetera comprar | 70 | Pos 8.3 | 0 | 2 | 7 |
| donde-comprar-perfumes-arabes-argentina | donde comprar perfumes arabes | 50 | Pos 7.9 | 3 | 3 | 5 |
| como-funciona-robot-aspiradora | como funciona un robot aspiradora | 50 | Pos 8.5 | 0 | 2 | 5 |
| mejores-peluches-personajes-argentina | peluches de personajes | 50 | Pos 6.9 | 0 | 2 | 5 |
| pava-electrica-pequena | pava electrica pequeña | 40 | Pos 8.0 | 0 | 1 | 4 |
| horno-electrico-vs-microondas | horno electrico vs microondas | 20 | Pos 8.2 | 1 | 1 | 2 |
| freidora-de-aire-desventajas | desventajas de la freidora de aire | 20 | Pos 9.8 | 0 | 1 | 1 |
| masajeador-donde-comprar-argentina | donde comprar masajeador | 10 | Pos 9.3 | 0 | 0 | 1 |
| mejores-masajeadores-argentina | mejores masajeadores | 10 | Pos 6.4 | 17 | 17 | 17 |
| freidoras-de-aire-gran-capacidad | freidora de aire gran capacidad | 10 | Pos 9.7 | 1 | 1 | 1 |
| freidora-de-aire-vs-horno | freidora de aire vs horno | 10 | Pos 6.2 | 1 | 1 | 2 |
| vale-la-pena-comprar-freidora-de-aire | vale la pena la freidora de aire | 10 | Pos 12.8 | 1 | 1 | 1 |
| donde-comprar-perfumes-arabes-buenos-aires | donde comprar perfumes arabes en buenos aires | 10 | Pos 7.0 | 17 | 17 | 17 |
| hy300-vs-hy320 | hy300 vs hy320 | 10 | Pos 6.0 | 1 | 1 | 2 |
| liliana-vs-peabody-pava-electrica | liliana vs peabody pava electrica | 0 | Pos 3.4 | 0 | 0 | 0 |
| atma-vs-peabody-freidora-de-aire | atma vs peabody freidora de aire | 0 | Pos 5.7 | 13 | 13 | 13 |
| ninja-vs-philips-freidora-de-aire | ninja vs philips freidora de aire | 0 | Pos 6.7 | 0 | 0 | 0 |
| perfumes-arabes-por-color | perfumes arabes por color | 0 | Pos 8.2 | 5 | 5 | 5 |
| robot-aspiradora-con-mapeo-laser | robot aspiradora con mapeo laser | 0 | Pos 9.5 | 0 | 0 | 0 |
| aspiradora-robot-gadnic-vs-xiaomi | gadnic vs xiaomi robot aspiradora | 0 | Pos 4.3 | 22 | 22 | 22 |
| dia-del-nino-argentina | regalos dia del niño | 0 | Pos 5.7 | 6 | 6 | 6 |

## Totales acumulados (corrida 2026-07-26)

| Métrica | Valor |
|---|---:|
| Guías (151 publicadas + 6 STAGED) | 157 |
| Volumen sumado, publicadas (Keyword Planner AR) | 1.597.360 /mes |
| Clicks reales HOY (GSC, snapshot 27/6-24/7) | 1.519 /mes |
| Clicks estimados — realista 6-12 meses | ≈ 64.031 /mes |
| Clicks estimados — techo optimista (12+ meses) | ≈ 164.103 /mes |

### Por estado real (GSC)

| Estado | Guías | Volumen sumado | Hoy (real) | Realista | Techo |
|---|---:|---:|---:|---:|---:|
| Ya en el top 10 (pos ≤10) | 139 | 1.535.120 /mes | 1.513 | 63.884 | 162.577 |
| Visible pero floja (pos 11-30) | 8 | 19.240 /mes | 6 | 135 | 679 |
| Sin datos aún (nueva o STAGED) | 10 | 97.300 /mes | 0 | 28 | 1.917 |

## Caveats (válidos para toda actualización futura)

- **Es tráfico, no ventas** — falta CTR de compra y margen por producto.
- **Es solo la keyword cabeza de cada guía**, no la cola larga que cada
  página también capta (y que en este sitio, con tráfico real, es
  significativa — ver `gsc.py report`).
- **Solapamiento real entre pilares y satélites**: `robot-aspiradora`,
  `mejor-aspiradora-robot` y varias variantes de marca (`robot-aspiradora-atma`,
  `-samsung`, `-xiaomi`, etc.) compiten en gran medida por el mismo tráfico.
  Sumar sus volúmenes por separado sobreestima la demanda real del silo.
  Mismo patrón en `microondas`/`microondas-atma`/`microondas-bgh`,
  `cafetera-*`, `pava-electrica-*`, `masajeador-*` y `perfumes-arabes-*`.
  El total de 1.597.360/mes es una cota superior nominal, no demanda neta.
- **Sin cruce de control de Ubersuggest esta corrida** (cupo diario
  agotado) y sin dificultad SEO orgánica real — ver sección de arriba.
  Repetir el cruce en la próxima actualización.
- **La keyword de cada guía es la intención del título/H1**, no
  necesariamente la query que hoy le trae más tráfico real (que a veces
  difiere, sobre todo en guías satélite con pocas impresiones — ver la
  baranda de cobertura de datos en la skill `optimizador-guias-pv`).
- **"Realista" y "techo" son un piso conservador atado a la posición
  actual**, no una garantía. Guías con muy pocas impresiones reales tienen
  el mismo problema de cobertura de datos de GSC documentado en
  `optimizador-guias-pv` (el umbral de privacidad de Google puede estar
  ocultando volumen real de queries que no se ven).
