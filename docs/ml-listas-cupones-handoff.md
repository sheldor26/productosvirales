# Handoff para Codex: listas de afiliado por cupón y descripción del perfil de ML

Escrito el 2026-11-04 por Claude. Juan se queda sin tokens de Claude hasta el viernes 2026-11-06; hasta entonces Codex opera esto. Si algo de acá choca con lo que diga Juan en el chat, manda Juan.

Complementa dos documentos que ya existen y que hay que leer también: [cupones-runbook.md](cupones-runbook.md) (cargar los cupones en el sitio) y [handoff-codex-threads.md](handoff-codex-threads.md) (la cuenta de Threads). Este cubre lo que vive **dentro de MercadoLibre**: el perfil social de afiliado y sus listas.

## 1. Qué es y para qué sirve

El perfil social de afiliado de Juan es https://www.mercadolibre.com.ar/social/jm159 ("Productos Virales"). Muestra:

- una **descripción** corta editable (máx. 90 caracteres) donde va "Cupones de hoy: ...";
- la lista "Mis recomendaciones" (la predeterminada, pública);
- las **listas de afiliado** públicas, ordenadas de la más nueva a la más vieja.

La idea la copiamos de un competidor ("Lulu ahorra", +3.200 seguidores): una lista por cupón, con el código en el nombre, con los productos donde ese cupón rinde, y la descripción con los códigos de hoy. Los links de afiliado se generan solos: todo producto que se agrega a una lista de afiliado comisiona para Juan.

El perfil NO es una fuente de tráfico propia (casi nadie lo descubre dentro de ML): es una página de destino a la que se manda gente desde Threads, X, WhatsApp y el sitio. Es un canal chico; no le dediques más de lo que pide Juan.

## 2. Decisiones de Juan (no las reabras)

- **Las listas de cupones vencidos NO se borran ni se archivan.** Las nuevas quedan arriba y las viejas se hunden solas, como en la competencia.
- **Lo único que se renueva todos los días es la descripción del perfil**, con solo los cupones vigentes de hoy.
- Los cupones que pasa Juan se muestran siempre, sin probarlos en el carrito.
- Armar las listas sin números de "hoy" ni fechas en el nombre (envejecen).

## 3. Reglas duras

- Nunca comprar nada. Nunca modificar otra cosa de la cuenta de ML (ajustes, datos, direcciones, medios de pago).
- No usar la API de ML (prohibido por los términos). Solo la interfaz web con la sesión de Juan.
- No loguearte vos en la cuenta de Juan ni pedirle contraseñas. Si el navegador no tiene la sesión de afiliado, parar y avisarle.
- Nada de inventar: productos, precios, mínimas, topes ni vigencias salen de ML en vivo o del mensaje que pega Juan.
- No commitear ni pushear nada salvo lo que autoriza el runbook de cupones para `src/data/coupons.ts`.
- No mencionar Claude, IA ni Codex en nada de cara al público. Nunca la palabra "cluster".
- **La hora real se lee con `date` en Bash y se contrasta con el header Date de Google (`curl -sI https://www.google.com | grep -i '^date'`).** Nunca del navegador: hoy un `toLocaleTimeString` en formato de 12 horas me hizo creer que era medianoche y corté un chequeo por error.

## 4. Requisitos de entorno

Hace falta un navegador con la **sesión de ML de la cuenta de afiliado de Juan** (no la de Óptica Carballo: con esa, `/afiliados/...` redirige a la landing de registro). Hoy se usó el Edge de Juan ("Edge - Threads y demas") controlado desde la extensión Claude in Chrome.

Si tu entorno no tiene un navegador controlable con esa sesión, **no improvises**: hacé la parte de preparación (secciones 6 y 7: elegir productos y armar el listado de URLs) y dale a Juan los pasos manuales de la sección 5 para que los ejecute él. Son pocos clics por producto.

## 5. Cómo se arma una lista (flujo probado)

Todo parte de la **ficha del producto** (`https://www.mercadolibre.com.ar/p/MLA...` o `/up/MLAU...`).

1. En la ficha, link **"Agregar a una lista"** (debajo de "Compra Protegida"). Abre un modal que vive en un **iframe**: tarda 8 a 15 segundos en cargar y no se puede tocar con JavaScript de la página; hay que esperar y operar por coordenadas o clics.
2. Primera vez (lista nueva): **"Crear nueva lista"** -> elegir **"Lista de afiliados"** (la otra opción, "Lista de productos", no comisiona) -> nombre -> **"Crear lista"**. Al crearla ya agrega ese producto.
   - El nombre admite **máximo 25 caracteres** y **no acepta el símbolo `%`** (escribí "10pct").
3. Productos siguientes: en el modal tildá la lista (queda en la **2da fila**, debajo de "Mis favoritos", porque es la más nueva) y **"Confirmar"**. Sale el toast "Agregaste el producto a la lista".
4. **Publicar**: abrí la lista desde https://myaccount.mercadolibre.com.ar/bookmarks/list?tab=list, selector "Privada" arriba a la derecha -> **"Pública"** ("se muestra en tu perfil social"). Sale el toast "Publicaste la lista en tu perfil".
5. **Verificar siempre el conteo** en `/bookmarks/list?tab=list` ("Pública | N productos") y que aparezca en `/social/jm159/lists`.

Ayuda para operar por coordenadas (valen para el 2026-11-04; **medilas de nuevo**):

| Ancho del frame del screenshot | Casillero 2da fila | Confirmar |
|---|---|---|
| 1564x784 | (946, 268) | (662, 626) |
| 1512x800 | (914, 266) | (640, 642) |

La ventana cambia de tamaño entre cargas. Si el clic cae en el borde del modal, el casillero queda a medias y **no agrega nada aunque parezca que confirmó**. Por eso: ver el ancho del frame en cada screenshot, hacer zoom al modal antes de confirmar y contar los productos al final de cada tanda.

Trampas comprobadas:

- Si el modal no terminó de cargar, el primer clic cae en la página y puede tildar otra lista por error: **destildar antes de Confirmar** (Confirmar queda deshabilitado mientras no haya nada tildado).
- El botón "Compartir" de la barra de afiliados (arriba de la ficha) agrega ese producto a "Mis recomendaciones" como efecto colateral. El corazón agrega a "Mis favoritos". Ninguno de los dos es lo que querés.
- Algunas fichas no muestran "Agregar a una lista": las que redirigen a otro catálogo, o donde la barra de afiliado no cargó. Probá otra publicación del mismo producto (un mismo producto tiene varias publicaciones con IDs distintos) o salteala.
- Tandas largas se cortan por tiempo o pierden la conexión del navegador: cargá de a 3 o 4 productos y verificá el conteo.
- Tras ~100 cargas de ficha seguidas ML se pone lento o devuelve una página de error unos minutos: esperá y reintentá.

## 6. De dónde salen los productos de cada lista

**Caso A: el cupón trae un link `listado.mercadolibre.com.ar/_Container_...`** (los cupones "en productos seleccionados": Puma, New Balance, Hogar). Esa página lista **exactamente** los productos donde vale: la lista se arma con todos (o los mejores). No agregues otros del mismo vendedor: se probó con una Puma que no estaba en el contenedor y el cupón no se aplicó.

Para leer los IDs de un contenedor abierto en el navegador:

```js
[...document.querySelectorAll('.poly-card')].map(c=>{const a=c.querySelector('a[href*="MLA"]');return (a.href.match(/(MLAU?\d+)/)||[])[1]+' '+(a.innerText||'').trim().slice(0,45)}).join('\n')
```

Los IDs `MLAU` (publicación por variante) pueden cambiar de una lectura a otra: comparar por título.

**Caso B: cupón activable desde https://www.mercadolibre.com.ar/cupones.** Cada cupón tiene "Aplicar" (lo activa en la cuenta; queda con tilde verde) y después "Buscar", que abre su contenedor `_Container_...?coupon_campaign_id=...` con todos los productos elegibles (cada tarjeta dice "con Cupón"). Con eso se armaron las listas de Intel, AMD, HP y L'Oréal. Mirá la **compra mínima y el tope** del cupón: listá solo productos que la superen por sí solos (un producto de $822.000 no sirve para un cupón con mínima de $1.000.000). Los cupones pueden desaparecer de la página durante el día.

**Caso C: cupón general ("En todos los productos") por tramo de precio**, como CYBERALMAX ($20.000 desde $250.000), MELIROMPETODO ($45.000 desde $500.000) y CYBERENCENDIDO ($80.000 desde $1.000.000). No hay contenedor: la lista se arma con productos del catálogo de Juan (`src/data/curated-products.ts`) cuyo **precio en vivo** cae en el tramo. Para sacar candidatos del catálogo por tramo:

```bash
cd "/Users/juan/Proyectos web/productosvirales" && npx --yes tsx -e '
import { curatedProducts as p } from "/Users/juan/Proyectos web/productosvirales/src/data/curated-products";
const tier=(n:number)=> n>=1_000_000?"1M+":n>=500_000?"500k":"250k";
const vis=p.filter((x:any)=>x.visibility!=="deprioritized"&&x.condition==="new"&&/^MLA\d+$/.test(x.id)&&x.price>=250000);
for (const t of ["1M+","500k","250k"]) { console.log("== "+t);
  vis.filter((x:any)=>tier(x.price)===t).sort((a:any,b:any)=>(b.soldQuantity||0)-(a.soldQuantity||0)).slice(0,25)
  .forEach((x:any)=>console.log([x.id,(x.canonicalName||x.title).slice(0,48),x.price,x.categorySlug,x.soldQuantity||0].join(" | "))); }'
```

Los precios del repo están desactualizados (casi todos son anteriores a noviembre). Antes de listar, **refrescá el precio en vivo** de cada candidato desde una pestaña de mercadolibre.com.ar: `fetch('/p/'+id,{credentials:'include'}).then(r=>r.text())` y el primer `"price":` del HTML. Se hace en un bucle async sin `await` guardando en `window.__RES` y se lee después. Ese precio sale absurdo a veces (3 de 35 el 4/11): descartá lo que no cierre y lo que quede en otro tramo muévelo de tramo. Juan pidió que el mix priorice **lo que ya vendemos, los más vendidos y los de precio más alto** (más comisión).

**Caso D: cupón de perfumes (cupón flash)**, como el "20% OFF en fragancias". No está en `/cupones`: aparece en https://www.mercadolibre.com.ar/cyber-monday en "Aprovechá los cupones" con cuenta regresiva. "Aplicar" y después "Buscar" abre `..._Container_mkp-t1-cyber-monday-noviembre-2026-cupones-beauty-fragrances` (casi 10.000 perfumes). Se puede filtrar por marca anteponiendo la búsqueda a ese contenedor: `https://listado.mercadolibre.com.ar/lattafa_Container_mkp-t1-cyber-monday-noviembre-2026-cupones-beauty-fragrances`. Cruzá con los perfumes del catálogo (`categorySlug: "belleza"`, marcas Lattafa, Rasasi, Afnan, Armaf, Maison Alhambra). Con 20% y tope de $10.000, solo los de más de $50.000 aprovechan el descuento entero.

**Cupones con medio de pago o sin alcance claro** (ej. FAMILIA, $8.000 desde $80.000, solo con Mercado Pago): no se arman listas, porque no hay forma de saber qué productos cubren. Solo van a la descripción.

## 7. La descripción del perfil (la rutina diaria)

1. Abrir https://www.mercadolibre.com.ar/afiliados/perfil#hub (anda solo con la cuenta de afiliado).
2. Campo "Descripción": seleccionar todo y escribir, máximo **90 caracteres** (hay contador). Formato: `Cupones de hoy: CODIGO1 | CODIGO2 | ...`.
3. Tocar **"Guardar"** y esperar unos 5 segundos (el botón queda cargando; sale el toast "Actualizaste tu perfil"). **El primer intento a veces no guarda**: recargar la página y leer el valor del campo para confirmar.
4. Poner solo cupones **vigentes**. Los que vencen en el día se sacan cuando vencen.

Estado al 2026-11-04 15:00: "Cupones de hoy: FAMILIA | CYBERALMAX | MELIROMPETODO | CYBERENCENDIDO | 20% Perfumes". FAMILIA vence a las 15:30 y los otros a las 23:59.

## 8. Rutina diaria sugerida

1. `date` + header de Google: hora real.
2. Cuando Juan pega el mensaje de cupones: (a) cargarlos en el sitio según [cupones-runbook.md](cupones-runbook.md); (b) actualizar la descripción del perfil (sección 7); (c) armar las listas que correspondan (sección 6).
3. A media jornada y a la tarde: si el mensaje trajo contenedores `_Container_`, **releerlos**: ML suele sumar productos durante el día. Si hay productos nuevos, agregarlos a la lista de ese cupón.
4. Al cerrar: nada que borrar (ver sección 2).

Nota: el chequeo horario que dejé corriendo es una tarea de **mi sesión**, muere cuando Claude se desconecta. Si querés ese chequeo, programalo vos.

## 9. Inventario al 2026-11-04

Perfil `jm159`. Todas las listas son de afiliado y están **públicas**, salvo las marcadas.

| Lista | Productos | Origen |
|---|---|---|
| Cupon 20pct Fragancias | 11 | cupón flash de perfumes (vence el mismo día) |
| Cupon CYBERALMAX | 10 | tramo $250.000, catálogo |
| Cupon MELIROMPETODO | 9 | tramo $500.000, catálogo |
| Cupon CYBERENCENDIDO | 9 | tramo $1.000.000, catálogo |
| Cupon 10pct OFF LOreal | 12 | contenedor de /cupones |
| Cupon 80mil OFF HP | 11 | contenedor de /cupones |
| Cupon 80mil OFF AMD | 12 | contenedor de /cupones |
| Cupon 100mil OFF Intel | 12 | contenedor de /cupones |
| Cupon CYBERHOGAR10 | 11 | contenedor del mensaje (textiles) |
| Cupon CYBERNB10 | 2 | contenedor del mensaje (New Balance 574 x2) |
| Cupon PUMACYBER | 2 | contenedor del mensaje (Puma Court Classic y Shuffle Downtown) |
| Mis recomendaciones | 299 (tope probable ~300) | predeterminada; el linkbuilder agrega solo |
| Freidoras de Aire, Duchas Eléctricas, Bombillas, Termómetros Digitales, Juguetes, Microondas | varias | **privadas**, de antes; no tocar |

Chequeo de los contenedores del mensaje (Puma, NB, Hogar), que sirvió para ver si ML sumaba productos:

- https://listado.mercadolibre.com.ar/_Container_cyber-miercoles-afiliados-puma-10off-1p (2)
- https://listado.mercadolibre.com.ar/_Container_cyber-afiliados-new-balance-10off (2)
- https://listado.mercadolibre.com.ar/_Container_cyber-afiliados-fh-asp-textiles-10off (11)

## 10. Cómo reportarle a Juan

Español rioplatense, directo, corto. Una tabla de lo que quedó (lista, productos, publicada o no) y solo lo que cambia su lectura: productos que no entraron, cupones sin vigencia, condiciones que el sitio no puede mostrar. Cerrá con la próxima acción concreta que Juan puede tomar hoy. Nunca le propongas entrevistas, encuestas ni investigación de mercado.
