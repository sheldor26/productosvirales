# Threads — análisis de rendimiento y experimentos propuestos

> Escrito el 2026-08-29 con datos reales de la API oficial de Threads (118 posts, cuenta `@productosvirales.com.ar`) más research de cuentas del mismo nicho. Es el análisis agregado — el log post-por-post sigue en `docs/threads-tracking.md`.

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
2. Subir la proporción de contenido gaming/tech de ticket alto en Threads; bajar la de electrodomésticos chicos/baratos ahí (siguen siendo la apuesta fuerte del sitio para SEO, solo no para este canal).
3. Concentrar posteos en 8-10hs y 18hs, miércoles y sábado.
4. Preferir carrusel sobre imagen sola o texto plano.

**Requieren decisión de Juan antes de aplicar (tocan el formato o piden más laburo operativo):**
5. **Sumar cuotas al copy**, cuando el dato sea general (no por banco específico) — ver el gotcha ya documentado sobre cuotas "solo con bancos seleccionados" en `threads-formato-hype-cupon-no-curador-honesto`. Si el dato es por banco, se puede seguir omitiendo en vez de escribir la cifra pelada.
6. **Sumar la posición en el ranking de la categoría** ("6° en Microondas") cuando esté disponible en MercadoLibre, como dato extra de prueba social.
7. **Probar un post-roundup de cupones generales de ML** (sin producto específico), una vez por semana, como formato nuevo — mide si genera más clics de afiliado a la página `/enlaces` que un post de producto individual.
8. **Subir la cadencia de posteo.** Las dos cuentas comparables postean varias veces por hora; esta cuenta postea unas pocas veces por día. Antes de subir cadencia sin más, confirmar que el pipeline de verificación de precios/stock (Bright Data + chequeo manual) aguanta el volumen sin bajar la calidad — la regla de "nunca inventar ni inflar un descuento" no se negocia por volumen.
9. **Test paralelo explícito de 1-2 posts/semana en tono "opinión/hot-take"** (sin hype, con una postura real), midiendo respuestas específicamente — la señal de la sección 2 sugiere que esto podría mover el número de replies, que hoy está en casi cero.

**No replicable directamente, pero vale tenerlo en mente:**
10. Los concursos/juegos de la cuenta oficial de MercadoLibre generan el mayor volumen de respuestas visto en todo este research, pero dependen de poder ofrecer un premio real (cupón propio) — no es gratis. Si en algún momento se evalúa invertir en esto, es la palanca de reply más fuerte de las cuatro cuentas revisadas.

## Bitácora de experimentos corridos

_(completar a medida que se prueba cada punto de la sección 4)_
