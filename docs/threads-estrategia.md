# Threads — análisis de rendimiento y experimentos propuestos

> Escrito el 2026-08-29 con datos reales de la API oficial de Threads (118 posts, cuenta `@productosvirales.com.ar`) más research de cuentas del mismo nicho. Es el análisis agregado — el log post-por-post sigue en `docs/threads-tracking.md`.

## 0. Plan de acción vigente (desde 2026-09-22)

Leer esto primero al armar cualquier tanda pensada para Threads. Reemplaza cualquier instrucción de horario/día/categoría de las secciones de abajo que la contradiga (quedan como historial, ver actualización 2026-09-22 en la sección 4).

**Cadencia semanal — NO es "solo viernes", es "todos los días + refuerzo el viernes":**
- **Lunes a jueves, sábado y domingo: cadencia normal, sin cambios.** Se sigue posteando en Threads todos los días como hasta ahora (tandas variadas, categorías mixtas) — no tiene sentido parar, el tráfico SEO del sitio no depende de Threads y además hace falta seguir generando datos de días no-viernes para poder comparar. Reglas fijas de siempre: tag, carrusel, franjas 6-11hs/18-21hs, evitar 11-14hs y después de las 21hs.
- **Viernes = día fuerte, además de lo normal.** Ahí se concentra la tanda más grande/completa de la semana (8 productos, como las tandas ya rodadas), priorizando el top 5 de categorías de abajo, arrancando en la franja 6-11hs y, si da el tiempo, sumando una segunda tanda en la franja 18-21hs. En prueba desde el 2026-09-22 — invierte el hallazgo de agosto que marcaba a viernes como el peor día, con muestra 3,7x más grande.

**Qué producto elegir cuando se arma contenido para Threads (no para el sitio en general):**
Priorizar en este orden — ticket alto + objeto grande, no la etiqueta "gaming" per se:
1. Monitor gamer
2. Consola PS5/Switch
3. PC gamer / notebook gamer
4. TV
5. Electro grande de línea blanca (heladera, lavarropas, aire acondicionado, termotanque)

Evitar como cabeza de tanda para Threads (rinden 5-10x peor, aunque sigan siendo parte normal del catálogo del sitio): accesorios gaming chicos (mouse, auriculares, joystick, teclado, silla, gabinete), electrodomésticos chicos de cocina, gadgets/streaming, salud, belleza. Si una tanda variada de 8 productos mezcla categorías (como se viene haciendo), tratar de que al menos 3-4 de los 8 caigan en el top 5 de arriba — no hace falta que sea 8/8.

**Reglas fijas, sin excepción:**
- `topic_tag` en el 100% de los posts (nunca vacío) — sigue siendo la variable con más impacto medido de todas (7x).
- Carrusel de 2 imágenes (precio + beneficios), nunca imagen sola ni texto plano.

**Qué NO esperar de esto solo:** categoría/horario/día mueven el promedio de vistas, pero no resuelven el problema de fondo — la interacción real (likes/respuestas) sigue en ~0,1 por post y es lo que le pone techo a todo lo demás según el algoritmo de Threads. Este plan optimiza dentro de ese techo, no lo rompe.

**Revisión:** volver a medir con la API después de 3-4 viernes de datos (fines de octubre aprox.) y actualizar la bitácora de la sección 4.

## 1. El problema estructural, antes que cualquier otra cosa

**24 likes y 31 respuestas en 118 posts.** Promedio: 0,2 likes por post, prácticamente cero interacción. El algoritmo de Threads en 2026 distribuye contenido por **velocidad de engagement, no por cantidad de seguidores** — si nadie interactúa rápido, el post no sale del círculo de seguidores actuales por más "bueno" que sea el gancho. Esto pone un techo a todo lo demás: cualquier mejora de categoría/formato/horario ayuda, pero mientras la interacción real siga en cero, el techo de alcance sigue bajo.

## 2. Lo que predice más vistas en la cuenta propia (medido)

Con 90 posts de 5+ días (para que las vistas ya se hayan asentado):

**Categoría — la variable más fuerte, 10x de diferencia:**

| Categoría | Posts | Vistas promedio |
|---|---|---|
| Notebook/PC gamer | 3 | 113,7 |
| Consola PS5/Switch | 11 | 100,9 |
| Monitor gamer | 3 | 94,3 |
| TV | 2 | 82,5 |
| Auriculares | 3 | 41,3 |
| Freidora de aire | 7 | 20,3 |
| Cargador portátil | 3 | 8,0 |
| Smartwatch | 1 | 8,0 |
| Masajeador | 2 | 5,0 |

La audiencia de Threads de esta cuenta es de gaming/tech de ticket alto, no la misma que llega por Google buscando "freidora de aire". Lo que convierte bien por SEO en el sitio es justo lo que peor anda en este canal.

**`topic_tag` — bug gratis, no decisión de estrategia.** 29 de 90 posts maduros (32%) no llevan ningún tag. Esos promedian 12,1 vistas. Los que sí llevan "Gaming Threads" promedian 109,1. Se corrige poniendo tag siempre.

**Formato:** carrusel (51,3 vistas prom.) > imagen sola (37,9) > solo texto (13,7).

**Horario (hora Argentina):** 8-10hs (49-55 vistas prom.) y 18hs (62,8) rinden mejor que 11-12hs (24-33) o después de las 20hs. Días: miércoles (58,2) y sábado (53,6) los mejores; viernes (19,3) el peor.

> ⚠️ **Ver actualización 2026-09-22 más abajo — el hallazgo de "viernes peor día" se invirtió con muestra 3,7x más grande.**

**Señal chica, sin confirmar (n bajo):** los pocos posts con una opinión fuerte y sin hype ("el mercado de cafeteras está saturado de marketing engañoso") generan más respuestas relativas a sus vistas que los product-cards puros. El formato hype/cupón vigente es una decisión ya tomada a conciencia (ver `threads-formato-hype-cupon-no-curador-honesto` en memoria) — esto no es una sugerencia de volver al formato viejo, es una hipótesis para probar en paralelo, sin tocar el resto.

## 3. Qué hacen cuentas reales del mismo nicho (research 2026-08-29)

Tres cuentas argentinas de curación de ofertas de MercadoLibre revisadas en Threads (perfiles públicos, sin login):

**`@ofertasdescuentosar`** (27,5 mil seguidores) — el comparable más directo. Formato casi idéntico al que ya usamos (emoji + ❌precio viejo ✅precio nuevo + % OFF), pero con tres agregados que nosotros no hacemos sistemáticamente:
- **Cadencia mucho más alta:** posts cada 1-4 horas, no unas pocas veces por día.
- **Cuotas explícitas en casi todos los posts** ("💳 3 cuotas de $59.333 con tarjeta Mercado Pago").
- **Posición en el ranking de la categoría** ("⭐ 4.9 estrellas (+1000 vendidos) - 6° en Microondas") como prueba social extra, más allá de "+X vendidos".
- Ocasionalmente un post sin producto, puro tono personal/motivacional ("Manifiesto ventas extraordinarias hoy sábado..."), que igual linkea al perfil de MercadoLibre — parece relleno para sostener la cadencia, no algo para copiar.

**`@tebuscodescuentos`** (55,6 mil seguidores, cuenta más grande, multi-rubro no solo tech) — dos cosas que nosotros no publicamos nunca:
- **Roundup de cupones generales de MercadoLibre**, sin atarlos a un producto puntual ("📢 Cupones para usar en Mercado Libre: OCHOX2 $20.000 OFF, TDTOCHO $7.500 OFF..." con 3-4 códigos juntos en un solo post).
- **Cross-promoción activa a Instagram** en la bio ("Seguime en IG todos los días subo promociones en historias").
- Cadencia altísima: varios posts por hora.

**`@mercadolibre.arg`** (313 mil seguidores, cuenta oficial de la marca, no un curador) — mecánica completamente distinta y la que más replies generó de las tres: **concursos/juegos** ("Adivina el adivinador: encontrá en la app un producto que sea chiquito, ideal para la casa, eléctrico... comentá con el print y sumá 10 ganadores de un cupón"), con 17-36 comentarios reales por post. No es replicable 1 a 1 (tienen presupuesto de cupones que un afiliado no tiene), pero confirma el patrón de la sección 1: pedirle una acción concreta a la audiencia (comentar, etiquetar a alguien) genera órdenes de magnitud más respuestas que un post puramente informativo.

## 4. Experimentos propuestos, priorizados

**Sin costo, aplicar ya:**
1. `topic_tag` en el 100% de los posts, nunca vacío.
2. Priorizar en Threads: monitor gamer > consola PS5/Switch > PC/notebook gamer > TV > electro grande de línea blanca (heladera/lavarropas/AC/termotanque). Bajar accesorios gaming chicos (mouse/auriculares/joystick/silla) y electrodomésticos chicos ahí — siguen siendo la apuesta fuerte del sitio para SEO, solo no para este canal.
3. Concentrar posteos en 6-11hs y 18-21hs. **Día: viernes (en prueba desde 2026-09-22, ver actualización más abajo — invierte el hallazgo original de agosto que lo marcaba como el peor día).**
4. Preferir carrusel sobre imagen sola o texto plano.

**Requieren decisión de Juan antes de aplicar (tocan el formato o piden más laburo operativo):**
5. **Sumar cuotas al copy**, cuando el dato sea general (no por banco específico) — ver el gotcha ya documentado sobre cuotas "solo con bancos seleccionados" en `threads-formato-hype-cupon-no-curador-honesto`. Si el dato es por banco, se puede seguir omitiendo en vez de escribir la cifra pelada.
6. **Sumar la posición en el ranking de la categoría** ("6° en Microondas") cuando esté disponible en MercadoLibre, como dato extra de prueba social.
7. **Probar un post-roundup de cupones generales de ML** (sin producto específico), una vez por semana, como formato nuevo — mide si genera más clics de afiliado a la página `/enlaces` que un post de producto individual.
8. **Subir la cadencia de posteo.** Las dos cuentas comparables postean varias veces por hora; esta cuenta postea unas pocas veces por día. Antes de subir cadencia sin más, confirmar que el pipeline de verificación de precios/stock (Bright Data + chequeo manual) aguanta el volumen sin bajar la calidad — la regla de "nunca inventar ni inflar un descuento" no se negocia por volumen.
9. **Test paralelo explícito de 1-2 posts/semana en tono "opinión/hot-take"** (sin hype, con una postura real), midiendo respuestas específicamente — la señal de la sección 2 sugiere que esto podría mover el número de replies, que hoy está en casi cero.

**No replicable directamente, pero vale tenerlo en mente:**
10. Los concursos/juegos de la cuenta oficial de MercadoLibre generan el mayor volumen de respuestas visto en todo este research, pero dependen de poder ofrecer un premio real (cupón propio) — no es gratis. Si en algún momento se evalúa invertir en esto, es la palanca de reply más fuerte de las cuatro cuentas revisadas.

## Actualización 2026-09-22 (407 posts, API oficial de Threads)

Muestra 3,7x más grande que el análisis original (336 posts maduros de 5+ días, vs 90 en agosto). Se reconfirma casi todo, con una inversión importante.

**Categoría — se reconfirma y se afina (misma conclusión, más data):**

| Categoría | Posts | Vistas promedio |
|---|---|---|
| Monitor gamer | 29 | 152,7 |
| Consola PS5/Switch | 39 | 130,5 |
| PC/Notebook gamer | 15 | 104,4 |
| TV | 51 | 93,2 |
| Electro grande hogar (heladera/lavarropas/AC/termotanque) | 18 | 81,2 |
| Notebook (no gamer) | 20 | 63,5 |
| — resto (accesorios gaming chicos, electro chico cocina, gadgets, salud, belleza) | — | 12-40 |

Los 15 posts con menos vistas de toda la cuenta son casi todos accesorios gaming chicos (mouse, auriculares, joystick, micrófono streaming) o electro chico (pava, planchita, caloventor). Confirma: no es la etiqueta "gaming", es ticket alto + objeto grande.

**`topic_tag`:** se reconfirma el 100%. Sin tag = 15,8 vistas prom., con tag = 60-113. El 10,7% de posts maduros sin tag es **enteramente histórico** — todos de antes del 29/8 (fecha en que se fijó la regla), el último es del 28/8. Desde entonces, cumplimiento perfecto, ningún leak activo.

**Formato:** se reconfirma — carrusel (78,1) > imagen sola (38,0) > texto (13,9).

**Horario:** se reconfirma — 6-11hs (79,6) y 18-21hs (79,8) mejor que 11-14hs (58,0), la franja más floja.

**Día de la semana — SE INVIRTIÓ.** Muestra grande en ambos lados, no es ruido:

| Día | Posts | Vistas promedio | Agosto (118 posts) |
|---|---|---|---|
| **Viernes** | 45 | **127,3** | 19,3 (peor día) |
| Domingo | 26 | 110,3 | — |
| Sábado | 34 | 93,6 | 53,6 (2º mejor) |
| Martes | 84 | 61,2 | — |
| Lunes | 55 | 59,4 | — |
| Miércoles | 62 | 41,6 | 58,2 (mejor día) |
| Jueves | 30 | 38,6 | — |

**Decisión de Juan (2026-09-22): probar viernes como día fuerte de acá en adelante**, concentrando tandas ahí (sobre todo en las franjas 6-11hs / 18-21hs ya confirmadas) en vez de miércoles/sábado. Sigue siendo una prueba, no una regla cerrada — la sección 4 se actualiza más abajo.

**Interacción — sigue siendo el techo real, y no mejoró:** 43 likes / 33 respuestas en 407 posts = 0,106 likes/post, **peor** que el 0,2 de agosto pese a cumplir mejor las reglas de tag/carrusel/horario. Categoría/formato/horario mueven el promedio dentro de un techo bajo — el techo en sí lo pone la falta de engagement real, no algo que se arregla solo con mejor targeting de producto.

## Bitácora de experimentos corridos

- **2026-09-22 — viernes como día fuerte:** en prueba desde esta fecha. Sin resultados todavía, completar acá cuando haya 3-4 viernes de datos.

_(completar a medida que se prueba cada punto de la sección 4)_
