# Handoff para Codex: operar la cuenta de Threads @productosvirales.com.ar

Escrito el 2026-11-04 por Claude. Juan se queda sin tokens de Claude hasta el viernes 2026-11-06. Hasta que vuelva Claude, Codex opera la cuenta con este documento. Si algo de acá choca con lo que diga Juan en el chat, manda Juan.

Quién es Juan: founder solo, no técnico, Virasoro (Corrientes, Argentina). Español rioplatense casual, respuestas cortas y directas. Siempre cerrá cada reporte con la próxima acción concreta que Juan puede tomar hoy. Nunca le propongas entrevistas, encuestas ni investigación de mercado.

## 1. Qué se hace (resumen)

La cuenta de Threads publica ofertas de MercadoLibre con links de afiliado (`meli.la/...`) y promociona el perfil social de afiliado de ML: https://www.mercadolibre.com.ar/social/jm159 (listas por cupón, cupones del día). Objetivo del perfil: subir seguidores (el 04/11 tenía +30).

Cada día:
1. Juan pega mensajes de ML con cupones y ofertas. Esa es la fuente. Si no pegó nada, pedile los cupones temprano (primer mensaje del día).
2. Se publican posts de producto (carrusel de 2 placas + copy), posts de perfil (lista de un cupón) y 1-2 preguntas casuales.
3. Se responden los comentarios (cortos, primera hora).
4. Todo se loguea en el repo y se verifica contra la API de Threads.

Volumen: bajo y espaciado. El alcance real es de 1 a 16 vistas por post (4 y 5 de noviembre). Ráfagas de 20+ posts por día lo empeoraron en septiembre. Meta: entre 6 y 10 posts por día contando los de perfil, nunca dos con menos de 25 minutos de distancia.

## 2. Requisitos de entorno (verificar primero)

Repo: `/Users/juan/Proyectos web/productosvirales`. Helpers fuera del repo: `~/.pv-helpers/`. Si tu sandbox no ve esas rutas, pedile a Juan que te las habilite (en Codex: `--add-dir ~/.pv-helpers` y `--add-dir` del repo, con red).

Credenciales: `.env` del repo (`THREADS_ACCESS_TOKEN`, `THREADS_USER_ID`, `BLOB_READ_WRITE_TOKEN`). Siempre cargarlas así antes de cualquier comando de Threads:

```bash
cd "/Users/juan/Proyectos web/productosvirales" && set -a && . ./.env; set +a
```

Al arrancar cada día:
- Chequear el token: `curl -s "https://graph.threads.net/v1.0/me?fields=id,username&access_token=$THREADS_ACCESS_TOKEN"` debe devolver `productosvirales.com.ar`. El token vence cada 60 días: renovar antes del 2026-12-10.
- Hora real: la Mac puede atrasar horas. Usar siempre `curl -sI https://www.google.com | grep -i '^date'` (GMT; Argentina = GMT-3). Nunca confiar en `date`.
- Posts de hoy: `curl -s "https://graph.threads.net/v1.0/me/threads?fields=id,timestamp,topic_tag,text,permalink&limit=12&access_token=$THREADS_ACCESS_TOKEN"`.
- Comentarios de un post: `/{id}/conversation?fields=id,text,username`. Insights: `/{id}/insights?metric=views,likes,replies`.

Navegador: para verificar precios, ver fichas y generar links de afiliado hace falta un navegador con la sesión de Juan en MercadoLibre (Claude usaba la extensión Claude in Chrome en el Chrome de Juan). Si Codex no tiene un navegador con esa sesión, no inventes nada: pedile a Juan los links `meli.la` ya generados y los precios actuales, y limitate a las partes que no lo necesitan (preguntas, respuestas, reposts de productos ya verificados el mismo día, posts de perfil con placas ya armadas).

## 3. Reglas duras (no negociables)

- Nunca inventar IDs de ML, precios, ratings, cupones, vigencias ni experiencia personal de Juan. Todo dato sale de la ficha en vivo o del mensaje de ML.
- No commitear nada salvo que Juan lo pida (en ese caso, un solo commit por tanda con `git add` de archivos puntuales, nunca `git add -A`, y revisar el index antes). No `git push`.
- Verificar precio y stock en vivo justo antes de publicar cada producto. Si la ficha dice "Publicación pausada" o "no está disponible por el momento", descartar.
- Precio:
  - Se publica el precio vivo, no el del mensaje de ML (el mensaje suele estar desactualizado: pasó con TCL, iPhone, heladera y aire).
  - Ignorar el tachado inflado. El copy dice "Hoy a $X".
  - Comparar con `docs/precios-referencia.md` (mínimos históricos por producto). Hasta ~+10% sobre el mínimo se publica; más que eso no se presenta como oferta. Nunca escribir "mejor precio" si está por encima de la referencia.
  - En las fichas de catálogo hay dos opciones: "Mejor precio" (otro vendedor, a veces mucho más barato) y "En cuotas" (preseleccionada). Si la diferencia es grande, el copy dice "Hoy a $X (elegí la opción "Mejor precio")" y "O 12 cuotas sin interés de $Y".
- Cuotas "sin interés": solo si el mensaje de ML las afirma (se ponen en la placa con el campo `cuotas` y en una línea del copy). Si no, no se mencionan.
- Cupones: solo los que Juan pega en el chat. Se agregan SIEMPRE al copy, sin probarlos ni preguntar. Para cupones de monto por tramo se usa el tramo más alto cuya mínima sea menor al precio del producto (por ejemplo, con mínimas 250k/500k/1M y un producto de $939.999 va el tramo de 500k). Productos por debajo de la mínima más baja no llevan cupón. Siempre con la mínima y la vigencia exactas del mensaje ("válido hoy hasta las 23:59", "pagando con Mercado Pago", etc.). Si el mensaje no da vigencia, no la inventes.
- Nada de urgencia falsa. "Oferta relámpago", "Más vendido" o "Última unidad" solo si figura en la ficha en ese momento.
- Palabras prohibidas: "cluster". No mencionar Claude, IA ni Codex en nada público. No usar "producto curado".
- No comentar desde la cuenta en cuentas de terceros.
- Prioridad de sourcing: gaming, TVs y notebooks; variar la categoría dentro del día (no dos notebooks seguidas). Fuera de foco (moda, belleza, tablets, celulares) solo si Juan lo pide o pega el mensaje.
- El sitio vestuario.com.ar es otro proyecto: no mezclar.

## 4. Anatomía de un post de producto

Es un carrusel de 2 imágenes (placa de precio + placa de beneficios) con copy y link. Se publica con `~/.pv-helpers/pub.sh`.

### 4.1 Datos a juntar de la ficha (en el navegador, página `/p/MLA...` o `/up/MLAU...`)

Con JavaScript en la página: precio vivo con `document.querySelector('.ui-pdp-price__second-line .andes-money-amount').getAttribute('aria-label')` (no leer el precio con regex del texto), stock ("Stock disponible", "+50 disponibles"), "Publicación pausada", rating y cantidad de opiniones (`.ui-pdp-review__rating`, `.ui-pdp-review__amount`), ranking ("N° en Categoría"), vendidos, vendedor ("Tienda oficial ..."), especificaciones de las filas `tr`, y las imágenes de la galería (`img` con clase que contenga "gallery", naturalWidth mayor a 300). El valor `"Tamaño del sensor"` es un default de ML, no es dato real. Hay fichas con atributos mal etiquetados (memoria/RAM invertidas en algunos Motorola): en ese caso no se cita.

Nota: el JS del navegador de Claude bloqueaba devolver URLs con query string y números largos pegados; si te pasa, devolvé solo el path o usá el aria-label.

### 4.2 Link de afiliado propio

1. Abrir https://www.mercadolibre.com.ar/afiliados/linkbuilder (con la sesión de Juan).
2. Pegar la URL canónica del producto (sin query).
3. En el desplegable "Etiqueta en uso" elegir **instagram** (el default "internacionales" está mal: nunca usarlo).
4. "Generar". Se pueden pegar varias URLs separadas por enter y salen varios links en orden. Leer los links desde el valor del `textarea` (JS), no a ojo.
5. Verificar cada link abriendo `https://meli.la/XXXX`: tiene que mostrar el producto, el precio, y la URL final debe contener `matt_word=instagram`. Que caiga en `/social/jm159` está bien (es la tarjeta de perfil).
6. Un producto puede haber sido excluido del Programa de Afiliados: el linkbuilder avisa. Descartarlo.

### 4.3 Placa 1 (precio) y placa 2 (beneficios)

Placa 1 con `~/.pv-helpers/poster.cjs`:

```bash
node ~/.pv-helpers/poster.cjs '{"bg":"/ruta/fondo.jpg","badge":"MÁS VENDIDO","kicker":"GOOGLE TV | 4K | HDR","title":"SMART TV TCL 55\" 4K","rating":"4.9","sold":"+10 mil vendidos","newPrice":"679.999","cuotas":"O 12 cuotas sin interés de $67.647"}' salida.png
```

Campos: `bg` (obligatorio, imagen 1080x1350), `badge` (solo si la ficha lo respalda: MÁS VENDIDO, OFERTA RELÁMPAGO, TIENDA OFICIAL), `kicker` (línea chica arriba del título), `title` (máx. 24 a 27 caracteres para que no salte de línea), `rating` + `sold` (o `noStar:true` y solo `sold`; si el rating tiene muy pocas opiniones no se muestra), `newPrice`, `oldPrice`/`offPct` (solo si el tachado es un precio de lista genuino, por ejemplo el oficial de Nintendo; si es inflado, no), `cuotas`.

El fondo (`bg`) se arma con PIL: lienzo 1080x1350 oscuro con un degradé violeta arriba, tarjeta blanca redondeada de 960x640 en (60, 170) con la foto del producto centrada (foto de la galería de ML; evitar fotos con personas famosas, banners o fotos de otros productos relacionados). El script que se usó está resumido así:

```python
from PIL import Image, ImageDraw
W,H=1080,1350; im=Image.open("foto.webp").convert("RGB")
g=Image.new("RGB",(W,H),(11,6,24)); d=ImageDraw.Draw(g)
for y in range(500):
    a=int(40*(1-y/500)); d.line([(0,y),(W,y)],fill=(11+a,6+int(a*0.3),24+int(a*1.2)))
ch=640; card=Image.new("RGB",(960,ch),(255,255,255))
r=min(900/im.width,(ch-40)/im.height)
ph=im.resize((int(im.width*r),int(im.height*r)),Image.LANCZOS)
card.paste(ph,((960-ph.width)//2,(ch-ph.height)//2))
m=Image.new("L",(960,ch),0); ImageDraw.Draw(m).rounded_rectangle([0,0,959,ch-1],radius=40,fill=255)
g.paste(card,(60,170),m); g.save("bg.jpg",quality=92)
```

Si hay línea de cuotas en la placa, usar la tarjeta de 640 de alto (con 720 el kicker se pisa con la tarjeta). Siempre mirar la imagen resultante antes de publicar (título en una línea, nada pisado, precio correcto).

Placa 2 con el generador del repo (4 beneficios de la ficha real, nunca inventados):

```bash
node scripts/generar-imagen-beneficios-threads.cjs '{"imgUrl":"https://http2.mlstatic.com/D_NQ_NP_2X_xxx-F.webp","title":"Nombre del producto","benefits":[{"icon":"📺","title":"Pantalla QLED 55\" 4K","desc":"Resolución de 3840 x 2160 píxeles"}, ... 4 en total ...]}' salida-b.png
```

Fotos en alta resolución: las miniaturas de ML terminan en `-AB.webp` y son de 448 px. Cambiar `D_Q_NP_2X_<id>-AB.webp` por `D_NQ_NP_2X_<id>-F.webp` da 830 a 1200 px.

### 4.4 Archivos que espera `pub.sh`

En `~/.pv-helpers/assets/` con un prefijo corto (por ejemplo `sy1`): `sy1.png` (placa de precio), `sy1-b.png` (placa de beneficios) y `sy1-copy.txt` (el texto).

Formato del copy (todo en un solo bloque, el link siempre es la última línea y pegado a `👉` sin espacio):

```
📺 SMART TV TCL 55" 4K GOOGLE TV
Hoy a $679.999 ✅ (elegí la opción "Mejor precio")
💳 O 12 cuotas sin interés de $67.647
⭐ 4.9/5 (2.773 opiniones) — 6° en Televisores
🎁 Google TV, HDR, 3 HDMI, Wi-Fi y Bluetooth
🎟️ Cupón MELIROMPETODO: $45.000 OFF (mín. $500.000), válido hoy hasta las 23:59
🔔 Seguinos en ML para ver los cupones: mercadolibre.com.ar/social/jm159
⚠️ El vendedor puede cambiar: mirá quién lo vende antes de comprar
👉meli.la/33tSwiC
```

Líneas opcionales según corresponda: ⭐ (solo con rating confiable, se agrega el ranking si es de categoría), 🏬 vendedor oficial y vendidos, 🎁 una línea de características reales, 🎟️ cupón, 💳 cuotas. Máximo 500 caracteres. La línea 🔔 es fija en todos los posts de producto (decisión de Juan del 04/11).

### 4.5 Publicar

```bash
cd "/Users/juan/Proyectos web/productosvirales" && set -a && . ./.env; set +a
~/.pv-helpers/pub.sh sy1 "<topic_tag>" "<título>" "<url de la foto>" "<precio nuevo sin puntos>" "<precio viejo = nuevo si no hay tachado genuino>" "<offPct: 0>" "<sección>" "<título de referencia>" "<nota de referencia>" "<link meli.la completo>"
```

- Debe terminar en `ok`. Si dice `NO PUBLICADO`, leer el error. Si dice que falta el espaciado de 25 minutos, esperar (no usar `ALLOW_FAST_PUBLISH=1` sin autorización explícita de Juan).
- `pub.sh` publica el carrusel, verifica la hora y loguea en `src/data/social-posts.ts` y en `docs/precios-referencia.md`.
- La `sección` debe ser un encabezado `## ` existente de `docs/precios-referencia.md`: Gaming, Electro, Pequeños electrodomésticos, Herramientas, Deportes y Fitness, Descanso, Gadgets, Salud, Belleza, Mascotas, Hogar, Instrumentos Musicales, Moda, Pendiente de revisar. Los monitores se loguean en Gaming; notebooks y celulares en Gadgets.
- La nota de referencia es el rastro auditable: precio de referencia usado, qué se ignoró (tachado), vendedor, rating, vendidos, cupón aplicado, si es repost y por qué.
- Si "fetch failed" aparece al publicar, puede haber publicado igual: mirar la API antes de reintentar.
- Después de publicar, verificar con la API que el texto termina con el link y que el `topic_tag` es el correcto.

### 4.6 topic_tag (siempre uno, nunca vacío; variar)

Pool: Hogar, electrodomesticos (TVs y electro), Gadgets, Notebooks, Auriculares, celulares, compras, Argentina, Mercadolibre, Ofertas (no abusar). "Gaming Threads" solo para productos genuinamente gamer, y nunca dos seguidos. Mirar el tag del post anterior antes de elegir y no repetir dos seguidos.

## 5. Posts de perfil (listas por cupón)

Perfil: https://www.mercadolibre.com.ar/social/jm159 (Lists en `/social/jm159/lists`). Las listas del 04/11 son "Cupon CYBERENCENDIDO", "Cupon MELIROMPETODO", "Cupon CYBERALMAX", "Cupon 80mil OFF HP", "Cupon 80mil OFF AMD", "Cupon 100mil OFF Intel", "Cupon 10pct OFF LOreal", "Cupon PUMACYBER", "Cupon CYBERNB10" y "Cupon CYBERHOGAR10". Las listas viejas no se borran (decisión de Juan); lo que se renueva a diario es la descripción del perfil (90 caracteres máximo, en https://www.mercadolibre.com.ar/afiliados/perfil#hub, con "Guardar" y esperando el toast) con solo los cupones vigentes de hoy.

Hay dos tipos de cupón:
- **Por código y monto con compra mínima** (ejemplo del 04/11: CYBERALMAX $20.000/mín. $250.000, MELIROMPETODO $45.000/mín. $500.000, CYBERENCENDIDO $80.000/mín. $1.000.000). Aplican por precio a cualquier producto. La lista asociada junta productos que superan la mínima.
- **Por productos seleccionados** (Intel, AMD, HP, L'Oréal, Puma). La lista de cada cupón es exactamente la de la página `listado.mercadolibre.com.ar/_Container_<id>` que trae el mensaje de ML (o el botón "Buscar" en https://www.mercadolibre.com.ar/cupones). No se infiere por precio.

Crear/llenar una lista: ficha del producto → "Agregar a una lista" → "Crear nueva lista" → tipo "Lista de afiliados" (la otra no comisiona) → nombre (máx. 25 caracteres, sin "%") → "Crear lista" → pasar a "Pública". El modal es un iframe que tarda 7 a 10 segundos; si no cargó, los clics caen en la página. Las listas se arman en lotes chicos (3 o 4 productos por tanda).

### Placa nítida de la lista (`listplate.cjs`)

No usar capturas de pantalla (salen pixeladas: ML muestra miniaturas de 448 px). Usar:

```bash
node ~/.pv-helpers/listplate.cjs '{"code":"MELIROMPETODO","off":"$45.000","min":"$500.000","items":[{"img":"https://http2.mlstatic.com/D_NQ_NP_2X_<id>-F.webp","brand":"GOPRO","name":"Hero 12 Black 5,3K","price":619990}, ... 6 items ...]}' salida.jpg
```

Las URLs de las fotos salen del DOM de la página de la lista (después de scrollear, porque carga lazy) y el orden de las imágenes coincide con el de las tarjetas. Los precios, del `aria-label` de `.andes-money-amount` ("Ahora: ..."). Elegir 6 productos variados, vigentes (descartar "Publicación pausada") y que superen la mínima. Mirar la placa antes de publicar.

### Copy del post de perfil (máx. 500 caracteres)

```
🎟️ CÓDIGO MELIROMPETODO: $45.000 OFF
En compras desde $500.000, hoy hasta las 23:59.
Armamos una lista con productos que pasan esa mínima (cámaras GoPro, cocinas, calefones, robots aspiradores y más). Entrás, elegís y ponés el código en el carrito.
👉 Lista: https://www.mercadolibre.com.ar/social/jm159/lists/<id-de-la-lista>
🔔 Seguinos en mi perfil para no perderte los próximos cupones: https://www.mercadolibre.com.ar/social/jm159
```

Se publica con el opt-out del guardrail de link (es el único caso en que corresponde, porque el link va en el cuerpo y es el del perfil/lista, no un `meli.la`):

```bash
ALLOW_NO_LINK_IN_POST=1 node scripts/publicar-threads.cjs post /ruta/placa.jpg "$(cat copy.txt)" "<topic_tag>"
```

Sin cupón del día o sin lista armada, se puede hacer un post de perfil de la descripción ("Cupones de hoy") con el mismo CTA. Por día: al menos 1 post de perfil, hasta uno por lista de código.

## 6. Preguntas y comentarios

- 2 preguntas por día, tono casual, sin "¿" de apertura, 1 o 2 líneas cortas, sin precio ni link. Ejemplo: "12 cuotas sin interés o contado con descuento? / Cuenten cuál eligen 👇". Publicar con `node scripts/publicar-threads.cjs text "texto" "<topic_tag>"`. No inventar experiencia de Juan ("yo uso...").
- Responder comentarios en la primera hora, de una línea: `~/.pv-helpers/reply.sh <id-del-comentario-o-post> "texto"`.
- Revisar comentarios con `/conversation` en cada post del día, al arrancar y por la tarde.

## 7. Programar publicaciones

`~/.pv-helpers/waituntil.sh "YYYY-MM-DD HH:MM:SS"` (hora argentina) espera usando la hora de internet y puede terminar antes (máx. 2 horas por corrida): después de que termina, volver a chequear la hora real con la cabecera Date de Google. Correrlo en segundo plano (no con `&` suelto si tu herramienta necesita notificación) y no hacer `sleep` largo en primer plano. Para encadenar varios posts, escribir un script corto (ejemplo: `~/.pv-helpers/assets/perfil-last.sh`). Los scripts leen los archivos al momento de publicar, así que se pueden corregir antes de la hora. Cada publicación se separa 25 minutos de la anterior; el script ya bloquea si no se cumple.

## 8. Reporte a Juan (cada vez que se publica)

Una línea por post: hora (ART), qué es, precio y tag. Después: qué quedó pendiente y la próxima acción concreta de Juan. Si algo no se pudo verificar, decirlo. No ocultar errores. Si algo se publicó mal, no se puede editar (Threads no deja): avisar y corregir en el siguiente post.

Cierre del día: dejar el log actualizado (`src/data/social-posts.ts`, `docs/precios-referencia.md`) y una entrada breve en la bitácora de `docs/threads-estrategia.md` con lo publicado y las vistas. No commitear salvo pedido de Juan.

## 9. Trampas conocidas

- Los archivos temporales de las sesiones de Claude (scratchpad) se borraron más de una vez; los fondos de placas se arman de cero desde la foto de ML. Todo lo que se necesite después va en `~/.pv-helpers/assets/`.
- Un producto puede tener varias fichas de catálogo y hay publicaciones excluidas del Programa de Afiliados: el linkbuilder avisa.
- El buscador de ML no renderiza bien para scraping; las páginas `listado.mercadolibre.com.ar/_Container_...` y `/mas-vendidos` sí.
- No usamos la API oficial de ML (prohibido por sus términos): solo el navegador y Bright Data para precios de catálogo.
- Si una placa sale con el título en dos líneas, acortarlo; si sale con el rótulo "Cyber Monday" y la fecha ya pasó, sacarlo.
- Al cerrar el tooltip "Compartí y generá más ventas" de una lista, no hacer clic en la zona de tarjetas: abre una ficha.

## 10. Estado al 2026-11-04 y pendientes

- Hoy salieron 10 posts: heladera Philco, aire Sansei, TCL 55" 4K, Samsung QLED 55" (productos); posts de perfil de las listas HP, CYBERENCENDIDO, MELIROMPETODO y CYBERALMAX; aviso del código FAMILIA (texto) y repost del monitor MSI con ese cupón. Los mensajes de ML del día traían además AIWA torre de sonido y dos cafeteras (fuera de foco, no se publicaron).
- Cupones del 04/11: CYBERALMAX $20.000 (mín. $250.000), MELIROMPETODO $45.000 (mín. $500.000) y CYBERENCENDIDO $80.000 (mín. $1.000.000), de 10:00 a 23:59; FAMILIA $8.000 (mín. $80.000, solo con Mercado Pago) vencía a las 15:30 y ya venció; CYBERMONDAY y CYBERLUNES $7.500 cada uno (mín. $80.000), sin vigencia informada (anunciados a las 15:06 ART; no inventar horario). Cuando un producto de $80.000 a $250.000 no tiene otro cupón, se le puede sumar uno de estos dos.
- Seguidores del perfil al arrancar el día: +30. Pedirle a Juan el número actual al empezar cada día para medir si el formato de perfil sirve.
- Sin publicar: Moto G17 (descartado: precio vivo $399.999 contra $349.999 del mensaje). Ideas: iPad Air M4 y las cámaras de acción de las listas.
- Ayer (03/11) salieron: monitor MSI Pro, robot Gadnic, deshumidificador Gadnic, ASUS Vivobook 14 Core 3, TV Noblex 65", iPad 11, Galaxy A37, iPhone 15, Edge 70 Fusion, Razr 70 y una pregunta.
- Hasta el viernes 06/11 operás vos. Cuando vuelva Claude, Juan le pasa el relevo con la bitácora de `docs/threads-estrategia.md`.
- Más contexto: memorias de Claude en `~/.claude/projects/-Users-juan-Proyectos-web-productosvirales/memory/` (índice en `MEMORY.md`); las más relevantes empiezan con `threads-`, `ml-` y `cupones-`.
