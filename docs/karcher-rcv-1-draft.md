# Borrador — Aspiradora Robot Kärcher RCV 1 (MLA42103831)

> **Pendientes antes de pegar en `src/data/curated-products.ts`:**
> 1. `price` / `originalPrice`: no vinieron en la ficha que pasaste. Completalos con el precio real de ML, o corré el importador (`scripts/ml-product-importer.ts`) que trae precio + imágenes.
> 2. `image` / `images`: faltan las URLs de mlstatic (las que pasaste son capturas). El importador las trae, o copiá las `https://http2.mlstatic.com/...webp` desde la publicación.
> 3. Verificar `freeShipping` en la publicación (lo dejé en `false`).
>
> Todo lo demás (specs, opiniones, schema, rating) sale de datos reales de la ficha.

---

## Notas de revisión SEO + humanizer

- **H1 con ángulo**, no el nombre del producto: posiciona el robot por lo que es (mantenimiento diario + control remoto + perfil bajo) y por lo que NO es (mapeo/app). Eso filtra al comprador equivocado, que es lo que baja las devoluciones y las reseñas de 1 estrella.
- **seoTitle** 56 caracteres, **metaDescription** 152 — dentro de rango, con diferencial + prueba social (4.5★ / 115).
- **Contras reales** apoyados en las opiniones: sin app/mapeo, 500 Pa justos, sin rodillo central. Las reseñas de 1-2★ son todas sobre esto, así que decirlo de frente evita compradores frustrados.
- **Links internos**: no hay otra aspiradora robot en el catálogo, así que comparo contra los robots de limpieza que sí están (limpiavidrios Gadnic y Atma) aclarando que son para vidrios, no pisos, y contra la mopa Suono como alternativa manual de piso. Honesto y útil.
- **Schema** con `aggregateRating` real (4.5 / 115) para habilitar estrellitas en Google.
- Texto pasado por criterio humanizer: sin "elevá tu limpieza", sin rule-of-three forzado, em-dashes moderados, frases cortas.
- Cuando lo publiques, puedo correr `/claude-seo:seo-page` sobre la URL ya en vivo para validar Core Web Vitals, indexación y schema renderizado.

### Keywords integradas (de `keywords/Aspiradoras Robot/`)

Tejidas de forma natural, sin stuffing:

- **Cabeza:** `aspiradora robot` / `robot aspiradora` (27.100) — en title, H1, intro y specs.
- **Trapeadora:** `robot aspiradora y trapeadora`, `aspiradora robot que barre y trapea`, `aspira y trapea` (3.600) — aclarando siempre que es trapeado **en seco**, no con tanque de agua (honestidad).
- **Joya de baja competencia:** `robot aspiradora sin wifi` (SEO difficulty ~4) — encaja exacto con el producto y casi nadie la trabaja. Va en H2 y FAQ.
- **Mascotas:** `robot aspiradora para mascotas` / pelos de perro y gato — en pros, body y FAQ.
- **Intención de compra:** `qué aspiradora robot comprar argentina`, `cuál aspiradora robot conviene` — FAQ dedicada.
- **Comparación (solo en contexto honesto):** `aspiradora robot xiaomi`, `roomba`, `con mapeo`, `samsung`, `atma`, `gadnic` — en la FAQ de diferencias y en la sección de comparación. No las fuerzo en el cuerpo porque la RCV 1 no es ninguna de esas.

**Descartadas a propósito** (alto volumen pero deshonestas para este robot): `con mapeo`, `con tanque de agua`, `con autovaciado`, `con cámara`, `con app`. Usarlas sería atraer clics que terminan en reseñas de 1 estrella.

---

## Objeto `Product` (listo para pegar, completar los 2-3 campos pendientes)

```ts
{
  id: 'MLA42103831',
  title: 'Aspiradora Robot Kärcher RCV 1',
  brand: 'Kärcher',
  line: 'RCV',
  price: 0, // ⚠️ COMPLETAR con precio real de ML
  // originalPrice: 0, // opcional, si está en oferta
  priceUpdated: '2026-06-08',
  priceLastChecked: '2026-06-08',
  priceStatus: 'stale', // pasar a 'fresh' al cargar el precio real
  currency: 'ARS',
  image: 'https://http2.mlstatic.com/REEMPLAZAR.webp', // ⚠️ COMPLETAR
  images: [
    'https://http2.mlstatic.com/REEMPLAZAR-1.webp', // ⚠️ COMPLETAR
  ],
  category: 'Hogar',
  categorySlug: 'hogar',
  permalink: 'https://www.mercadolibre.com.ar/aspiradora-robot-krcher-rcv-1/p/MLA42103831',
  affiliateUrl: 'https://meli.la/12hGhQB',
  condition: 'new',
  freeShipping: false,
  rating: 4.5,
  reviewCount: 115,
  reviewsWithPhotos: 3,
  color: 'Blanco',
  pastelColor: 'var(--pastel-coral)',
  badge: 'trending',
  description: 'La aspiradora robot RCV 1 barre, aspira y pasa un trapo, brindando una limpieza completa y sin esfuerzo. Cuenta con tres modos de limpieza: Automático, Esquinas y Focus, que se adaptan a tus necesidades. Puedes controlarla fácilmente mediante el mando a distancia.',
  aiReviewSummary: 'Es muy práctica y eficiente para mantener el piso libre de polvo y pelos de mascotas. Funciona bien, es silenciosa y aspira una cantidad importante de impurezas invisibles. Además, su manejo con control remoto la hace muy cómoda y fácil de usar.',
  seoTitle: 'Kärcher RCV 1: Aspiradora Robot que Barre, Aspira y Trapea',
  metaDescription: 'Aspiradora robot Kärcher RCV 1: barre, aspira y trapea en seco, ideal para pelos de mascota. Sin WiFi, anda con control remoto. 4.5★ con 115 opiniones.',
  ogTitle: 'Kärcher RCV 1: la aspiradora robot finita que entra bajo la cama',
  ogDescription: '4.5★ con 115 opiniones. Barre, aspira y trapea en seco, 7 cm de alto y control remoto incluido. Sin WiFi ni mapeo: analizamos para quién rinde.',
  h1: 'Aspiradora robot Kärcher RCV 1: barre, aspira y trapea con control remoto, sin WiFi ni mapeo',
  pros: [
    '4.5⭐ con 115 calificaciones y respaldo de marca Kärcher',
    'Solo 7 cm de alto: entra bajo camas, sillones y muebles bajos',
    'Se maneja con control remoto incluido, sin app ni Wi-Fi',
    '3 en 1: barre, aspira y trapea (en seco)',
    'Vuelve solo a la base a cargar',
    'Apto para pelo de mascotas y filtro HEPA incluido',
  ],
  cons: [
    'Sin Wi-Fi ni app y sin mapeo: navega chocando, no recorre ordenado',
    '500 Pa de succión: rinde para mantenimiento, no para limpieza profunda',
    'No tiene cepillo central de rodillo, a veces empuja las migas a los costados',
    'Depósito de polvo chico (310 mL) y trapeado en seco, sin tanque de agua',
  ],
  verdict: 'El Kärcher para mantenimiento diario: si querés que pase todos los días levantando polvo y pelos de mascota bajo los muebles, manejado con control remoto, cumple. Si buscás mapeo, app o limpieza profunda, este no es.',
  articleBody: `## Cómo funciona: barre, aspira y trapea en seco

Como toda aspiradora robot que barre y trapea, la RCV 1 hace tres cosas en una sola pasada. Dos cepillos laterales arrastran la suciedad hacia el centro, la boca de succión de 500 Pa la levanta, y un paño de microfibra montado abajo repasa el piso. Importante: ese repaso es en seco. El depósito de líquidos es de 0 mL, así que no es un robot aspiradora y trapeadora con tanque de agua, sino que pasa un paño que atrapa el polvo fino que la succión deja.

Tiene tres modos. **Auto** recorre toda la superficie disponible, **Esquina** trabaja los bordes y rincones, y **Focus** insiste sobre una zona puntual cuando hay más suciedad concentrada. Los tres se eligen desde el control remoto.

La navegación es por sensores: detecta obstáculos y desniveles para no caerse por las escaleras, pero no arma un mapa de la casa. Se mueve de forma semialeatoria y va corrigiendo cuando choca. Varios compradores lo confirman en las opiniones, así que conviene tenerlo claro antes de comprar.

## Sin WiFi ni app: por qué se maneja con control remoto

Esta es la diferencia más importante con los robots más caros. La RCV 1 es una aspiradora robot sin WiFi: no tiene app, no se conecta al celular y no guarda un plano de los ambientes. Toda la operación pasa por el control remoto incluido (funciona con 2 pilas AA que vienen en la caja).

Para mucha gente eso es una ventaja: no hay que configurar nada, no depende de la conexión, lo prendés y anda. De hecho, el control remoto es de las cosas que más mencionan las opiniones buenas. La contracara es que, sin mapeo, el recorrido no es prolijo: puede dejar zonas sin pasar o repetir otras. Si tu expectativa es un robot que limpia la casa entera de forma ordenada y programada por app, este no lo hace.

## 7 cm de alto: el detalle que más rinde

Mide 29 cm de diámetro y solo 7 cm de alto. Esa altura baja es lo que más aparece en las opiniones positivas: entra bajo la cama, los sillones y los muebles donde no llegás con la escoba ni con una aspiradora de mano. Para mantener esas zonas sin polvo todos los días, el formato funciona.

Pesa 1,8 kg, cubre hasta 90 m² de área máxima por sesión y la batería da hasta 1,5 horas de funcionamiento continuo, con retorno automático a la base y unas 5 horas de recarga. El nivel de ruido es de 70 dB, que varias opiniones describen como silencioso para un robot de este tipo.

## 500 Pa y sin rodillo central: qué limpia bien y qué no

Acá conviene ser realista. Los 500 Pa de succión y la ausencia de un cepillo central de rodillo definen para qué sirve. Levanta bien polvo, pelusa y pelo de mascota, que es justo lo que más destacan los compradores. Donde flaquea es con suciedad más gruesa: sin rodillo, a veces empuja las migas hacia los costados en lugar de aspirarlas, y alguna opinión menciona que deja residuos. El depósito de polvo es de 310 mL, chico, así que en casas grandes o con mascotas que sueltan mucho pelo hay que vaciarlo seguido.

En resumen: es un robot de mantenimiento. Pasarlo a diario para que no se acumule el polvo, sí. Reemplazar una limpieza profunda con aspiradora de mano, no.

## En qué se diferencia de los otros robots del catálogo

La RCV 1 es la única aspiradora robot de piso del catálogo. Los otros robots que tenemos limpian otra cosa: el [Robot Limpia Vidrios Gadnic](/producto/MLA46931846) y el [Robot Limpia Ventanas Atma](/producto/MLA51170872) son para vidrios y ventanas, no para pisos, así que no compiten con esta, se complementan.

Si lo que querés es limpiar pisos pero preferís control total y cero electrónica, la alternativa manual del catálogo es la [Mopa Plana Suono con rociador](/producto/MLA22894851): más trabajo de tu parte, pero llega a donde quieras y no depende de batería. La RCV 1 resuelve lo contrario: el mantenimiento automático del día a día sin que tengas que agacharte.

## Qué incluye la caja

Base de carga, 2 cepillos laterales, control remoto, 1 paño para trapear en seco, depósito de polvo de 310 mL con filtro HEPA, 1 cepillo de limpieza para el mantenimiento del equipo, manual y 2 pilas AA para el control.`,
  specs: [
    { label: 'Marca / Modelo', value: 'Kärcher / RCV 1 (93010500)' },
    { label: 'Tipo', value: 'Robot aspirador 3 en 1 (barre, aspira, paño seco)' },
    { label: 'Succión', value: '500 Pa (nivel estándar)' },
    { label: 'Modos de limpieza', value: 'Auto, Esquina, Focus' },
    { label: 'Navegación', value: 'Sensores de obstáculo y anticaídas (sin mapeo)' },
    { label: 'Control', value: 'Control remoto (sin app / sin Wi-Fi)' },
    { label: 'Depósito de polvo', value: '310 mL' },
    { label: 'Tanque de agua', value: 'No (trapeado en seco)' },
    { label: 'Filtro HEPA', value: 'Incluido' },
    { label: 'Apto alfombras / pelo de mascota', value: 'Sí / Sí' },
    { label: 'Batería', value: '11 V · ~1.500 mAh · hasta 1,5 h' },
    { label: 'Carga', value: '5 h · retorno automático a la base' },
    { label: 'Área máxima', value: '90 m²' },
    { label: 'Nivel de ruido', value: '70 dB' },
    { label: 'Eficiencia energética', value: 'A' },
    { label: 'Dimensiones', value: '29 × 29 × 7 cm' },
    { label: 'Peso', value: '1,8 kg' },
    { label: 'Color / Voltaje', value: 'Blanco / 220 V' },
  ],
  faq: [
    { question: '¿La Kärcher RCV 1 se controla con app o Wi-Fi?', answer: 'No. No tiene Wi-Fi ni app: se maneja por completo con el control remoto incluido, que funciona con 2 pilas AA que vienen en la caja. Es más simple de usar, pero no podés programarla ni controlarla desde el celular.' },
    { question: '¿Mapea la casa y recorre de forma ordenada?', answer: 'No arma un mapa. Usa sensores de obstáculo y anticaídas para no chocar fuerte ni caerse de las escaleras, pero se mueve de forma semialeatoria y corrige cuando toca algo. Puede dejar zonas sin pasar o repetir otras. Si necesitás recorrido ordenado y programado, conviene un robot con mapeo.' },
    { question: '¿Sirve para pelos de mascota?', answer: 'Sí, es apto para pelo de mascota y es de lo que más destacan las opiniones: levanta bien pelos y polvo en el mantenimiento diario. Eso sí, el depósito de polvo es de 310 mL, así que con mascotas que sueltan mucho pelo hay que vaciarlo seguido.' },
    { question: '¿Friega el piso con agua?', answer: 'No con agua. El "fregado" es un paño de microfibra que pasa en seco y atrapa el polvo fino. No tiene tanque de líquidos (0 mL), así que no es un robot de trapeado húmedo.' },
    { question: '¿Entra bajo los muebles?', answer: 'Mide solo 7 cm de alto, así que entra bajo camas, sillones y muebles bajos. Es una de las ventajas más mencionadas por los compradores para limpiar donde no se llega con la escoba.' },
    { question: '¿Es potente? ¿Los 500 Pa alcanzan?', answer: '500 Pa es una succión de nivel estándar: rinde bien para mantenimiento de polvo, pelusa y pelo. Para suciedad gruesa flaquea, y como no tiene cepillo central de rodillo, a veces empuja las migas a los costados. Es un robot para mantener limpio, no para reemplazar una limpieza profunda.' },
    { question: '¿En qué se diferencia de una aspiradora robot Xiaomi o Roomba con mapeo?', answer: 'Una aspiradora robot con mapeo, como las Xiaomi, Roomba o Samsung, arma el plano de la casa con LiDAR o cámara, recorre ordenado, evita zonas y se programa desde la app. La Kärcher RCV 1 no mapea ni tiene WiFi: es más simple y económica, se maneja con control remoto y apunta al mantenimiento diario. La elegís por marca, precio y formato bajo, no por navegación inteligente.' },
    { question: '¿Qué aspiradora robot conviene comprar en Argentina?', answer: 'Depende de qué busques. Si querés mapeo, app y limpieza profunda, vas a un robot de gama más alta como Xiaomi o Roomba. Si buscás una aspiradora robot simple para mantenimiento diario, que barra y trapee en seco, levante pelos de mascota y se maneje con control remoto sin depender del WiFi, la Kärcher RCV 1 cumple ese rol con respaldo de marca.' },
    { question: '¿Qué viene en la caja?', answer: 'Base de carga, 2 cepillos laterales, control remoto, paño para trapear en seco, depósito de polvo de 310 mL con filtro HEPA, cepillo de limpieza para mantenimiento, manual y 2 pilas AA.' },
  ],
  customerReviews: [
    { rating: 5, country: 'Argentina', text: 'Relación precio calidad excelente. No sé si te va a solucionar la vida, pero ayuda. Es verdad que se choca con los objetos, pero por el precio está re bien. Lo tengo hace 6 meses y ni un problema, solo cada tanto le pongo aceite en las rueditas. Hay modelos más potentes pero este cumple.', useful: 1 },
    { rating: 5, country: 'Argentina', text: 'Levanta mucho pelos de mis mascotas, no pensé que se podía juntar tanto.', useful: 0 },
    { rating: 5, country: 'Argentina', text: 'Lo mejor que me pasó y encima se maneja con control remoto.', useful: 1 },
    { rating: 4, country: 'Argentina', text: 'Aspira pero para mí le falta más potencia, porque deja residuos después de que pasa, no aspira todo el polvo.', useful: 7 },
    { rating: 4, country: 'Argentina', text: 'Es un poco más chica que otras marcas que tuve, pero funciona bien. El compartimento de recolección es chico y no tiene rodillos como otras. De todos modos limpia bien y es silenciosa.', useful: 0 },
    { rating: 2, country: 'Argentina', text: 'No tiene cepillo para barrer abajo, lo que hace que no pueda aspirar correctamente y va corriendo las partículas para los costados.', useful: 8 },
    { rating: 2, country: 'Argentina', text: 'Mapea mal. Deja lugares sin limpiar, choca con la estación de carga.', useful: 4 },
  ],
  relatedProducts: ['MLA46931846', 'MLA51170872', 'MLA22894851'],
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Aspiradora Robot Kärcher RCV 1',
    description: 'Aspiradora robot Kärcher RCV 1: barre, aspira y pasa paño en seco con 500 Pa de succión, 3 modos de limpieza (Auto, Esquina, Focus), control remoto, filtro HEPA, sensores de obstáculo y anticaídas, 7 cm de alto y retorno automático a la base.',
    brand: { '@type': 'Brand', name: 'Kärcher' },
    model: 'RCV 1',
    sku: 'MLA42103831',
    category: 'Aspiradoras robot',
    color: 'Blanco',
    image: 'https://http2.mlstatic.com/REEMPLAZAR.webp', // ⚠️ COMPLETAR
    url: 'https://productosvirales.com.ar/producto/MLA42103831',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'ARS',
      price: '0', // ⚠️ COMPLETAR con precio real
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'MercadoLibre Argentina' },
      url: 'https://meli.la/12hGhQB',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '115',
      bestRating: '5',
      worstRating: '1',
    },
  },
},
```
