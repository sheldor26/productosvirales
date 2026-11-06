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

- **2026-10-27 — cambio de formato (decisión de Juan: "tenemos que encontrar nuestro formato")**: el promedio de vistas bajó de 82/post (semana del 9/9) a ~12 (semana del 19/10), con 14 likes y 1 respuesta en 400 posts. Test de 7 días con 5 posts/día: 3 de oferta como hasta ahora (control), 1 con copy de dato técnico/pregunta + placa póster (arte de fondo generado con agy desde la foto real del producto, precio grande en blanco; script `~/.pv-helpers/poster.cjs`), 1 hilo (post principal con el gancho; links en respuestas, script `~/.pv-helpers/reply.sh`; ejemplo: duelo de dos TVs con póster + tabla, `~/.pv-helpers/duelo.cjs`). Responder cada comentario en la primera hora. Medir vistas, likes y respuestas por formato con Insights; variables confundidas (placa + copy cambian juntas), anotarlo. Primer post del formato nuevo: monitor ASRock 27" curvo, 12:34. Research de cuentas del exterior: sin estudios sobre cuentas de ofertas; lo verificable es el estudio de Buffer (128 mil posts, ~42% más engagement si el autor responde), que Meta no degrada posts con link (Mosseri 2025) y que @mkbhd/@mrwhosetheboss abren con opinión o comparación y sin link en el post.

- **2026-10-30 — primera lectura del test de formato (a 4 días):** posts de oferta con placa póster y cupón (Asus TUF 32 vistas, Valkyrie 14, Zeus Pro 12, Samsung 27" 19) siguen en el mismo rango que el control viejo (1-14), con 0 likes y 0 comentarios. El post de **pregunta pura** ("$1.500.000 para gaming: ¿PS5, Switch 2 o armar PC?") hizo 35 vistas, 1 like y 4 respuestas (2 de un usuario real, contestadas), lo mejor de la semana y el único con conversación. El de opinión (100 Hz vs 240 Hz) quedó en 1 vista a la hora; el hilo del duelo de TVs (27/10) hizo 14 vistas, 0 comentarios. Ojo: placa y copy cambiaron juntos y la muestra es chica. Hipótesis para seguir: las preguntas abiertas mueven más que las ofertas; probar 1-2 por día. El Philips 43" (tag "compras", 29/10) hizo 1 vista: sospechar del tag.

- **2026-11-02 y 11-03 — lectura de Cyber Monday y martes (formato póster + cupón + cuotas):** el lunes salieron 12 posts de producto, un banner y 2 preguntas; el alcance de las ofertas quedó en 2-23 vistas (outlier: Switch 2 + FC27 con 44, monitor Xiaomi A27Qi con 55 y 2 likes). Las preguntas casuales dieron 9-18 vistas, o sea mejor piso que las ofertas, pero sin comentarios. Hoy martes salieron 10 posts de producto (monitor MSI, robot Gadnic, deshumidificador, ASUS Vivobook, TV Noblex 65", iPad 11, y cuatro celulares con 12 cuotas sin interés pedidos por Juan) más 1 pregunta; las primeras horas dieron 4-16 vistas por post y cero comentarios. Los cupones nuevos de ML (MELIMODOCYBER/CYBEREXPLOTA/ARRANCAMELI) van desde el primer post. Sin conclusión todavía: volver a leer Insights mañana y comparar contra el control de la semana del 19/10. Lección operativa: el scratchpad de la sesión se limpia entre horas, no dejar ahí fondos ni plantillas que se necesiten después (el fondo de la placa ahora se arma de cero con PIL desde la foto de ML).

- **2026-11-06 — lectura de la semana de Cyber (3 al 6/11, 25 posts):** vistas por post de 0 a 34, 1 solo like y 0 respuestas en todo el período. Los posts de producto con placa dieron 1-34 vistas (máx. TV Noblex 65" con 34 y Razr 70 con 22); los posts de perfil/lista de cupón dieron 1-18 (CYBERALMAX 18, MELIROMPETODO 11, HP 1) y los avisos de cupón de texto 6-14. Las 3 preguntas casuales dieron 0, 6 y 2 vistas. Conclusión: ni el formato de perfil ni el de pregunta mueven la aguja; el tope es el alcance de la cuenta, no el formato. Codex operó el 5/11 con solo 3 posts (aviso de cupones y 2 preguntas, sin productos por falta de navegador con sesión de ML). Pendiente de medir: seguidores del perfil jm159 (Juan no informó el número; arrancó el 4/11 en +30).

_(completar a medida que se prueba cada punto de la sección 4)_


## Relevo operativo 2026-11-05

Juan autorizó operar hasta el regreso del viernes 6/11 según los tres runbooks. Hora local contrastada con el header Date de Google (10:37 ART al iniciar).

- Sitio: cupones MELICYBERON ($20.000/mín. $250.000), MELIOTRARONDA ($45.000/mín. $500.000) y SEGUIMOSCONTODO ($80.000/mín. $1.000.000), hasta 5/11 23:59 confirmado por Juan. Build y push ya realizados, commit d6b0be7. Producción revisada.
- ML: sesión de afiliado correcta disponible por control nativo de `/Applications/Microsoft Edge.app`; navegador integrado sin sesión. Descripción actualizada y confirmada tras recarga: `Cupones de hoy: MELICYBERON | MELIOTRARONDA | SEGUIMOSCONTODO` (61/90). Listas viejas preservadas.
- 10:42:43 ART: aviso de cupones del día publicado, tag Mercadolibre. ID 18121061566969078, https://www.threads.com/@productosvirales.com.ar/post/DfXKbtoEf9l. Primer intento falló en polling de contenedor; se consultó API, no había post, contenedor 18131678638893064 FINISHED. Se publicó ese mismo contenedor y se verificaron texto, hora, tag y permalink. No duplicar.
- Revisados los 11 posts del 4/11 vía conversation: sin comentarios pendientes. Todavía sin lectura de insights del nuevo post.
- Lista `Cupon MELIOTRARONDA` creada con GoPro HERO12 MLA27104632, precio vivo $619.990, stock +50. Verificada en Favoritos: 1 producto; pasada a Pública y toast confirmado. Falta ampliar surtido antes de promocionar la lista.
- Lista `Cupon MELICYBERON` creada con cocina Escorial Candor S2 MLA6056509, precio vivo principal $373.999, stock disponible. Falta verificar conteo/publicación; no anunciarla aún.
- Pendiente inmediato: crear SEGUIMOSCONTODO (candidato DJI Osmo Pocket 3 Pack Creadores MLA37134971) y completar las tres listas con más productos verificados, en tandas chicas. Preparar placas de 6 productos para posts de listas cuando estén listas. Priorizar gaming/TV/notebooks para posts individuales.
- Seguimiento temporal configurado en este chat cada 30 min, solo hasta 6/11 inclusive o aviso de regreso, con silencio sin novedades y operación normal 08–21 ART. No extender cupones del 5/11 al 6/11. Respetar 25 min entre TODO post: próximo no antes de 11:07:43 ART. Esta publicación de texto no actualiza el guardrail de producto, así que revisar también API.
- Se pidió a Juan número actual de seguidores de ML y ofertas nuevas para priorizar. No commitear esta bitácora ni otros archivos sin pedido.

- Primera lectura del aviso (10:43–10:44 ART): 0 vistas, 0 likes, 0 respuestas. Muy temprano para evaluar.

- Actualización posterior: las TRES listas nuevas quedaron públicas y verificadas en `/social/jm159/lists`: `Cupon MELICYBERON`, `Cupon SEGUIMOSCONTODO`, `Cupon MELIOTRARONDA`. Cada una tiene solo 1 producto por ahora. No duplicarlas; ampliar las existentes. La de SEGUIMOSCONTODO contiene DJI Osmo Pocket 3 Pack Creadores MLA37134971, precio vivo principal $1.200.036,09, stock disponible (otra opción desde $1.134.015,28; ambas califican). El perfil público mantiene +30 seguidores. Falta completar 6 productos variados por lista, hacer placas y posts de listas con espaciado. Captura del perfil guardada como entregable en el chat. Seguimiento activo id `relevo-productos-virales-hasta-el-6-11`.

- Juan pidió completar más las listas. Objetivo inmediato: al menos 6 productos variados por lista (hoy solo tienen 1 cada una). Preparados 15 candidatos, 5 por tramo, en `work/relevo-2026-11-05/candidatos-listas.json`; sus precios del repo NO están verificados. Calefón Escorial MLA18991396 visto en navegador público con mejor precio $403.721,76 y última unidad, entra MELICYBERON; volver a confirmar vendedor/precio en Edge antes de agregar.
- Interrupción de control: al continuar en Edge el usuario cambió la pestaña hacia Analytics; dos acciones devolvieron interrupción por cambio del usuario. No insistir ni tocar Analytics. Se comprobó Chrome por ruta completa: está con cuenta Óptica y redirige a landing de afiliados, NO usarla ni cambiar de cuenta. Se preguntó por entrada async si puede dejar libre Edge (opciones usar ahora/más tarde). Esa respuesta sigue pendiente al escribir esto. Esperar respuesta antes de retomar acciones en Edge. Mientras tanto avanzar solo preparación independiente. No afirmar que las listas ya están completas.


### Listas completas, tanda del 5/11 (Edge)

Juan confirmó usar Edge ahora. Se retomó y se completaron las listas existentes, sin duplicarlas. Conteos finales leídos en Favoritos y confirmados visualmente: las tres son listas de afiliado PÚBLICAS con 6 productos cada una (18 en total, 15 incorporaciones nuevas).

- MELICYBERON: cocina Escorial Candor S2 (inicial); calefón Escorial MLA18991396 ($403.721,76); Creality Ender 3 V3 SE MLA44124693 ($415.999); robot Gadnic AspiRob MLA36838658 ($284.999); Garmin Forerunner 55 MLA44250809, redirige a MLA18347134 ($342.000 principal, otra opción $336.256,65); freezer Philco 65L MLA20038035 ($369.999).
- MELIOTRARONDA: GoPro HERO12 (inicial); Bambu Lab A1 mini MLA44143658 ($673.900 principal, otra opción $642.900); freezer Midea 160L MLA23435743 ($662.499 principal, otra opción $630.555); calefón Rheem MLA53227874, redirige a MLA59815497 ($599.999 principal, otra opción $549.999); GoPro HERO13 MLA47374183 ($784.247); Insta360 X3 MLA19710677 ($787.015,32 principal, otra opción $743.199,20).
- SEGUIMOSCONTODO: DJI Osmo Pocket 3 Pack Creadores (inicial); Bambu Lab A1 Combo MLA69826952 ($1.483.036,10); cocina Drean con air fryer MLA48950671 ($1.544.299 principal, otra opción $1.398.098,40); bicicleta HONEYWHALE K6S MLA62339970 ($2.133.029); DJI Osmo 360 Combo Aventura MLA53612281 ($1.377.390); DJI Osmo Action 6 Combo Aventura MLA62340610 ($1.546.390).

Todos verificados en fichas vivas de Edge con stock disponible al agregarlos; el calefón Escorial indicaba última unidad. Precios son evidencia de esta tanda, no reutilizarlos mañana sin verificar. Se preservaron selecciones preexistentes de listas anteriores al confirmar cada producto.

Descartados de esta tanda: Sherman MLA15780691 por diferencias de precio entre opciones que lo cruzan de tramo ($544.999 principal / $428.500 otra); Insta360 X5 MLA49100446 para SEGUIMOSCONTODO porque hay otra opción de $942.303,03, por debajo de la mínima de $1M. No se agregó a ninguna lista nueva.

Captura de prueba de conteos: `/Users/juan/Documents/Codex/2026-11-05/le-agents-md-y-docs-cupones/outputs/listas-cupones-completas-edge.png`.

Pendiente del seguimiento: preparar placas nítidas de las listas con 6 productos y promocionarlas con los links reales de las NUEVAS listas. NO usar UUIDs de ayer. Próximo post no antes de 11:07:43 ART, respetar tag distinto a Mercadolibre (último). Verificar API para evitar duplicados de otras sesiones. No hay bloqueo por falta de autorización de Edge: Juan ya confirmó usarlo; si vuelve a cambiar la pestaña, refrescar estado y no tocar sus páginas ajenas. No commitear ni pushear esta tanda.


### 5/11, ampliación terminada: 15 productos por lista

Juan pidió explícitamente AL MENOS 15 productos en cada lista, usando más vendidos de ML si hace falta. Objetivo CUMPLIDO en Edge: Favoritos muestra `Pública | 15 productos` para MELICYBERON, MELIOTRARONDA y SEGUIMOSCONTODO (45 total). Captura final `/Users/juan/Documents/Codex/2026-11-05/le-agents-md-y-docs-cupones/outputs/listas-15-productos-edge.png`. No seguir agregando por rutina salvo nuevo pedido; próximo pendiente: placas y promoción de las listas.

Se retomó con conteos 10/10/7 (la PS5 ya se había incorporado). En esta última tanda se sumaron 18 productos. Fuente: rankings públicos de más vendidos de ML (Televisores MLA1002; Refrigeración MLA1576; Lavado MLA438282; Notebooks MLA1652; y ranking general). Cada ficha se abrió y se verificó precio y stock vivo en Edge antes de agregar. Se preservaron otras selecciones/listas preexistentes.

MELICYBERON, últimos 5: Philips 43 MLA46536597 ($465.018,59, otra opción $438.999); Noblex Roku 43 MLA68385201 ($389.399,41); TCL QLED 32 MLA49197371 ($334.999); Philips 40 MLA55872039 ($423.999); Samsung 43 MLA60251338 ($489.999, otra opción $453.704). Antes de estos ya se habían agregado monitor Samsung CRG5 MLA43961816, TCL 43 MLA49197748, aire Sansei MLA61382173 que redirige a MLA73939385, silla Cougar MLA26019250: los cuatro explican el paso de 6 a 10.

MELIOTRARONDA, últimos 5: Samsung QLED 55 MLA66850209 ($819.999, otra opción $746.199); TCL 55 MLA61350331 ($811.646,11, otra opción $763.399); Samsung 50 MLA60250499 ($719.999, otra opción $689.999); Philips 50 MLA48941448 ($612.163,45); aire Philco inverter MLA63226247 ($792.705,61, otra opción $712.949). Antes ya se habían sumado Samsung Odyssey G5 MLA43960827/MLA43960188, Xiaomi G34WQi MLA43960787, Noblex 50 MLA69003496 y Surrey MLA54689994 (paso 6 a 10).

SEGUIMOSCONTODO, últimas 8: Samsung QLED 65 MLA66787374 ($1.399.999, otra opción $1.273.999); heladera Samsung RT32K5930SL MLA24515757 ($1.326.699, otra opción $1.299.762); secarropas Drean 10kg MLA75714296 ($1.199.999); Lenovo V15 Ryzen7 MLA40930226 ($1.340.807,60); HP 255R G10 Ryzen7 24GB MLA64642701 ($2.000.999); Acer Aspire Go15 Ryzen7 MLA67292236 ($1.279.999, otra opción $1.080.402,88); Lenovo Slim3 Ryzen7 MLA65915102 ($1.729.999); HP15 Ryzen7 MLA65697857 ($1.499.999). PS5 Digital + Astro Bot + GT7 MLA61403702 ya estaba, daba conteo 7. Todos estos cumplen mínima incluso considerando la alternativa más económica observada.

Se descartó Hisense MLA45915864 para el tramo $1M: principal $1.121.339,37 pero otra opción $792.160. No se agregó a ninguna lista nueva en esta tanda.

Links públicos REALES de hoy (leídos en el perfil, no usar UUIDs de ayer):
- MELICYBERON: https://www.mercadolibre.com.ar/social/jm159/lists/da4196d2-8720-4bc0-ab91-8b5d68c73ad4
- MELIOTRARONDA: https://www.mercadolibre.com.ar/social/jm159/lists/22e0bd27-c9b8-4962-98e4-ddbfb1da5fa5
- SEGUIMOSCONTODO: https://www.mercadolibre.com.ar/social/jm159/lists/7ed10858-066a-481c-abf8-c99f383df8a9

No se publicó en Threads durante esta ampliación. Consultar API antes del próximo post; no asumir que el único post del día siga siendo el aviso de las 10:42. Sin commit ni push de esta tanda.

- Seguimiento 5/11, 15:56:42 ART: pregunta casual gaming publicada y verificada por API. ID 17957851752272594, tag Gaming Threads, https://www.threads.com/@productosvirales.com.ar/post/DfXuevXIHi0. Texto: Si hoy pudieras cambiar una sola cosa para jugar, elegís monitor, consola o PC? / Los leo 👇. Antes se consultaron los posts: solo estaba el aviso de 10:42 y no tenía comentarios. Son 2 posts hoy al verificar. Próximo post no antes de 16:21:42 ART. Seguimiento actualizado para NO ampliar las listas ya completas (15/15/15); pendientes placas y promoción. Sin commit/push. La primera escritura del log falló al interpretar ISO +0000; publicación verificada y registrada aquí, NO republicar.

- Seguimiento 5/11 16:26 ART: Mac bloqueada; control de Edge informa que no pudo desbloquear automáticamente y requiere desbloqueo manual de Juan. No se tocó la sesión ni se publicaron precios sin verificación. Pendiente inmediato: recuperar fotos/precios actuales de seis productos por lista en Edge para generar placas nítidas y promover listas. No usar capturas como placas ni reutilizar precios sin refrescar. Threads API revisada: solo 2 posts hoy; pregunta 15:56 tiene 1 vista, 0 likes, 0 respuestas; aviso 10:42 tiene 4 vistas, 0 likes, 0 respuestas. Sin comentarios para responder. No nueva publicación en esta corrida. Avisar a Juan una vez que debe desbloquear la Mac; si sigue bloqueada, mantener silencio en próximos chequeos sin repetir el aviso.

- Seguimiento 5/11 16:56 ART: Mac desbloqueada, pero Edge en uso por Juan (Prensarank/Analytics); al abrir pestaña de lista hubo interrupción por cambio de usuario. Se releyó estado y no se insistió ni se alteraron sus páginas. No nuevo aviso de intervención, para no repetir pedidos. Sin comentarios nuevos en los 2 posts de hoy (API). Preparados y validados (<500 caracteres) tres copys de perfil en ~/.pv-helpers/assets/perfil-1105-{melicyberon,meliotraronda,seguimoscontodo}-copy.txt, con links reales y vigencia 5/11 23:59. Son BORRADORES, no publicados. Falta obtener fotos/precios actuales en Edge y generar/revisar placas de 6 productos. Elegir tag sin repetir el último real de la API. No publicar estos copys después del vencimiento. Sin commit/push.

- Seguimientos 17:28 y 17:59 ART: se abrió la lista pública MELICYBERON en Edge, seguía mostrando 15 productos. Precios de tarjetas observados: Samsung43 $489.999; Philips40 $423.999; TCL32 $334.999; Noblex43 $403.999; Philips43 $465.018; Cougar $349.899; Sansei $459.999; TCL43 $459.999; monitor CRG5 $370.929; freezer Philco $424.999; Garmin55 $342.000; robot Gadnic $284.999. Refrescar antes de publicar, no reutilizar mañana. No se modificó ninguna lista. Recuperación de foto de Samsung43: desde galería se abrió una pestaña de imagen nítida cuyo título es D_NQ_NP_2X_781807-MLA95283852822_102025-F.webp (686x428); falta recuperar su URL completa y las otras cinco fotos para la placa. Intento quedó interrumpido, NO hay placa generada ni publicación nueva. Último estado de Edge muestra diálogo de login de Dropbox con Google, ajeno a esta rutina: no tocar ni cerrar ni autorizar. Postergar UI mientras Juan usa la cuenta. API Threads 17:59: aviso 5 vistas; pregunta 2 vistas; ambos 0 likes y 0 respuestas. Sin comentarios pendientes, 2 posts hoy. Sin commit/push. Mantener silencio sin repetir avisos sobre Edge.

- Seguimiento 5/11 18:30:25 ART: segunda pregunta casual del día publicada y verificada por API, tag Hogar, ID 18099782021432183, https://www.threads.com/@productosvirales.com.ar/post/DfYAE2elElV. Texto: Qué tenés más ganas de renovar en casa: la tele, la heladera o el aire? / Vale elegir eso que viene aguantando hace años 👇. Total confirmado 3 posts hoy (aviso + 2 preguntas). NO publicar más preguntas hoy: máximo 2 ya cumplido. Próximo post no antes de 18:55:25 ART. API previa: sin comentarios pendientes en los 2 posts anteriores. Edge nuevamente interrumpido por cambio de usuario al intentar abrir lista; no insistir ni tocar páginas ajenas. Siguen pendientes las placas y la promoción de listas. Sin commit/push.

- Seguimiento 5/11 20:30 ART: date y Date de Google coinciden. API confirma los mismos 3 posts, sin comentarios pendientes: aviso 5 vistas, pregunta gaming 4, pregunta hogar 1; todos 0 likes/respuestas. Evidencia work/relevo-2026-11-05/insights-2028.json. Sin nueva publicación ni cambios de listas. Las dos preguntas diarias ya están cumplidas; siguen pendientes placas con fotos/precios vivos antes de promoción. Cupones todavía vigentes hasta 23:59, sin prolongarlos. Sin commit/push.

### 6/11, 09:12 ART: retiro de cupones vencidos

Date local y header Google coinciden. En Edge, perfil de afiliado jm159: se borró de Descripción el texto de MELICYBERON, MELIOTRARONDA y SEGUIMOSCONTODO, vencidos ayer 23:59. Guardar devolvió Actualizaste tu perfil; recarga confirmó campo vacío, contador 0/90. Listas anteriores preservadas, sin agregar productos. No prolongar ni promocionar los borradores del 5/11. Faltan cupones/ofertas del 6/11 provistos por Juan. Sin commit/push.
