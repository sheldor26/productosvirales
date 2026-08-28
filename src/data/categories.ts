import type { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "viral",
    name: "Viral ahora",
    icon: "Flame",
    pastel: "--color-discount",
    isSpecial: true,
    color: "#ef4444",
    h1: "Productos Virales",
    description: "Lo que todo el mundo está comprando ahora mismo",
  },
  {
    slug: "hogar",
    name: "Hogar",
    icon: "Home",
    pastel: "var(--color-pastel-amber)",
    mlCategoryId: "MLA1574",
    h1: "Productos para el Hogar Virales",
    description: "Organización, decoración, limpieza y electrodomésticos que todos quieren",
    buyersGuide: `
      <h2>Qué vas a encontrar en esta categoría</h2>
      <p>En productos virales de hogar mostramos lo que está rompiendo en MercadoLibre Argentina: organizadores que te ordenan la cocina o el placard, accesorios de limpieza inteligente, electrodomésticos compactos para espacios chicos y decoración que aparece todo el tiempo en TikTok. La mayoría resuelve un problema cotidiano concreto (el cajón que explota, el baño sin espacio, el polvo imposible) de una forma que se ve simple una vez que la descubrís.</p>

      <h2>Qué mirar antes de comprar</h2>
      <ul>
        <li><strong>Materiales:</strong> para organizadores, fijate que el plástico sea ABS o PP (no PVC barato), y que las piezas de metal sean acero inoxidable si van a tocar agua.</li>
        <li><strong>Medidas reales:</strong> en MercadoLibre las fotos engañan con la escala. Leé siempre las dimensiones en la descripción antes de comprar un organizador o mueble chico.</li>
        <li><strong>Envío:</strong> priorizá productos con Envío Gratis y Full — llegan en 24-48hs y la devolución es sin trámite si no te gusta.</li>
        <li><strong>Vendedor:</strong> buscá MercadoLíder Platinum o vendedores con +10.000 ventas. Evita cuentas nuevas aunque tengan precio tentador.</li>
      </ul>

      <h2>Rangos de precios típicos</h2>
      <p>En Argentina, un organizador modular de buena calidad ronda los <strong>$8.000 a $25.000</strong> según tamaño. Los accesorios de limpieza inteligentes (mopas giratorias, aspiradoras de mano) van de <strong>$30.000 a $120.000</strong>. Los electrodomésticos compactos virales (freidoras de aire, pavas eléctricas, licuadoras portátiles) están entre <strong>$50.000 y $200.000</strong> dependiendo de marca y capacidad. Si ves algo muchísimo más barato que estos rangos, probablemente sea réplica o material inferior.</p>
    `,
  },
  {
    slug: "cocina",
    name: "Cocina",
    icon: "ChefHat",
    pastel: "var(--color-pastel-coral)",
    mlCategoryId: "MLA1144",
    h1: "Productos de Cocina Virales",
    description: "Utensilios, pavas, sartenes y electrodomésticos que son furor",
    buyersGuide: `
      <h2>Qué vas a encontrar en esta categoría</h2>
      <p>Pavas eléctricas con control de temperatura, sartenes antiadherentes de cerámica o acero, freidoras de aire, licuadoras portátiles USB, gadgets para picar, pelar y cortar en segundos. TikTok convirtió la cocina en un laboratorio de gadgets: recetas virales que necesitan herramientas específicas (batidores de matcha, moldes para huevo, accesorios para pasta) llegan a MercadoLibre Argentina en pocas semanas.</p>

      <h2>Qué mirar antes de comprar</h2>
      <ul>
        <li><strong>Materiales en contacto con alimentos:</strong> buscá "apto PFOA free", "libre de BPA" y revestimientos cerámicos para antiadherentes. El teflón de baja calidad se descascara en 6 meses.</li>
        <li><strong>Potencia real:</strong> una pava eléctrica de marca tiene 1800-2200W. Si ves una de 1000W, va a tardar el doble en hervir.</li>
        <li><strong>Garantía en Argentina:</strong> marcas como Philips, Oster, Liliana, Peabody, Atma tienen service oficial. Marcas genéricas pueden ser buenas, pero si falla te quedás sin backup.</li>
        <li><strong>Repuestos:</strong> para sartenes, pavas y cafeteras, verificá si hay filtros o piezas de recambio disponibles.</li>
      </ul>

      <h2>Rangos de precios típicos</h2>
      <p>Pavas eléctricas: básicas <strong>$25.000-$45.000</strong>, premium con control de temperatura <strong>$60.000-$120.000</strong>. Sartenes antiadherentes de calidad: <strong>$20.000-$60.000</strong>. Freidoras de aire: entrada <strong>$120.000-$180.000</strong>, grandes (5L+) <strong>$200.000-$350.000</strong>. Gadgets pequeños virales (picadores, licuadoras portátiles) entre <strong>$8.000 y $40.000</strong>. Siempre compará el mismo modelo en varias publicaciones antes de comprar — las diferencias de precio son grandes.</p>
    `,
  },
  {
    slug: "musica",
    name: "Música",
    icon: "Music",
    pastel: "var(--color-pastel-purple)",
    mlCategoryId: "MLA1182",
    h1: "Instrumentos Musicales",
    description: "Guitarras, teclados y equipos para el que empieza a tocar",
    buyersGuide: `
      <h2>Qué vas a encontrar en esta categoría</h2>
      <p>Instrumentos de entrada para el que arranca: guitarras criollas, electroacústicas y eléctricas, controladores de DJ y los accesorios que hacen falta para poder tocar de verdad. La mayoría de lo que se vende son marcas genéricas de entrada, más baratas y con la góndola más completa. Pero las marcas internacionales sí están: Fender, Gibson, Gretsch y Yamaha se consiguen, solo que salen bastante más y no son las que más se venden. Acá comparamos las dos cosas: lo genérico y lo de marca.</p>
      <h2>Lo que casi nadie te aclara</h2>
      <p>Ningún instrumento de entrada viene completo. Una guitarra criolla necesita púas, funda y afinador; una eléctrica trae un amplificador que suele ser de juguete; un controlador de DJ no trae parlantes ni auriculares, y con celular necesita una fuente aparte. El precio de la publicación casi nunca es el precio de empezar a tocar.</p>
    `,
  },
  {
    slug: "tech",
    name: "Tech",
    icon: "Smartphone",
    pastel: "var(--color-pastel-blue)",
    mlCategoryId: "MLA1051",
    h1: "Tecnología Viral",
    description: "Proyectores, gadgets y tecnología que son tendencia",
    buyersGuide: `
      <h2>Qué vas a encontrar en esta categoría</h2>
      <p>Proyectores portátiles tipo "astronauta" que son furor en habitaciones gamer, auriculares inalámbricos de marcas conocidas y alternativas económicas, cargadores magnéticos, hubs USB, lámparas LED con efectos, accesorios para celular y tablet. El mundo tech viral mezcla productos de marca (con garantía oficial en Argentina) y genéricos importados de calidad variable.</p>

      <h2>Qué mirar antes de comprar</h2>
      <ul>
        <li><strong>Compatibilidad:</strong> verificá voltaje (220V), conectores (USB-C vs micro-USB), y sistema operativo. Un proyector Miracast puede no funcionar con un iPhone sin adaptador.</li>
        <li><strong>Garantía oficial vs importación:</strong> productos de Samsung, Xiaomi, JBL con garantía oficial argentina valen la diferencia. Los "importados" sin respaldo son lotería.</li>
        <li><strong>Lumens reales (proyectores):</strong> marcas serias declaran ANSI lumens. Las fichas genéricas inflan los números x10. Un proyector decente para uso hogareño tiene 300+ ANSI lumens reales.</li>
        <li><strong>Reviews con fotos:</strong> filtrá las reviews con fotos en MercadoLibre. Las sin fotos suelen ser reseñas infladas por el vendedor.</li>
      </ul>

      <h2>Rangos de precios típicos</h2>
      <p>Proyectores portátiles virales: económicos <strong>$80.000-$150.000</strong>, calidad media <strong>$200.000-$400.000</strong>, premium <strong>$500.000+</strong>. Auriculares TWS: genéricos <strong>$15.000-$30.000</strong>, marcas como JBL/Xiaomi/Redmi <strong>$40.000-$90.000</strong>. Cargadores magnéticos MagSafe compatibles: <strong>$8.000-$25.000</strong>. Accesorios USB-C/hubs: <strong>$10.000-$35.000</strong>. Para tech, la regla es simple: si un producto "igual" al de una marca grande sale 70% menos, hay gato encerrado en durabilidad o performance.</p>
    `,
  },
  {
    slug: "gaming",
    name: "Gaming",
    icon: "Gamepad2",
    pastel: "var(--color-pastel-blue)",
    h1: "Setup Gamer: lo mejor en MercadoLibre Argentina",
    description: "Mouse, teclados, sillas, monitores y auriculares para armar tu setup",
    buyersGuide: `
      <h2>Qué vas a encontrar en esta categoría</h2>
      <p>Mouse y teclados gamer de Logitech, Redragon y Razer, monitores curvos de alta tasa de refresco (Samsung Odyssey, Xiaomi, Gigabyte), sillas ergonómicas (Alpina, Cougar, Corsair) y auriculares con sonido envolvente para competitivo. Es la categoría con más variedad de precio del sitio: desde un mouse de $26.000 hasta un monitor curvo de casi $1.000.000.</p>

      <h2>Qué mirar antes de comprar</h2>
      <ul>
        <li><strong>Tasa de refresco (monitores):</strong> para juegos competitivos (shooters) buscá mínimo 144Hz. Para uso general o juegos de historia, 100Hz alcanza y sobra.</li>
        <li><strong>Sensor del mouse:</strong> los sensores ópticos de Logitech (HERO) y Razer son los más consistentes. Desconfiá de mouse "gamer" sin marca que prometen 16.000 DPI — casi nunca los usás realmente.</li>
        <li><strong>Switch del teclado:</strong> mecánico rojo (lineal, silencioso) para juegos rápidos, azul (clicky) si te gusta el feedback pero es ruidoso para compartir ambiente.</li>
        <li><strong>Sillas — capacidad de peso y garantía:</strong> fijate el peso máximo soportado (suele estar en la ficha) y si la garantía cubre el mecanismo de reclinado, que es lo primero que falla.</li>
      </ul>

      <h2>Rangos de precios típicos</h2>
      <p>Mouse gamer: entrada <strong>$26.000-$40.000</strong>, gama media Logitech G <strong>$56.000-$140.000</strong>, alta gama (Pro X Superlight) <strong>$280.000+</strong>. Teclados mecánicos: <strong>$62.000-$140.000</strong>. Auriculares gamer: <strong>$40.000-$150.000</strong>, inalámbricos de gama alta <strong>$150.000-$210.000</strong>. Sillas gamer: entrada <strong>$140.000-$260.000</strong>, gama alta (Cougar, Corsair) <strong>$380.000-$790.000</strong>. Monitores curvos: <strong>$140.000-$365.000</strong> en FHD/QHD, ultrawide 34" desde <strong>$550.000</strong>. Si el presupuesto es ajustado, priorizá teclado y mouse antes que la silla — el impacto en cómo jugás es mayor.</p>
    `,
  },
  {
    slug: "audio",
    name: "Audio",
    icon: "Headphones",
    pastel: "var(--color-pastel-blue)",
    h1: "Parlantes y Auriculares Virales",
    description: "Parlantes portátiles JBL, auriculares Sony, Xiaomi y de estudio Audio-Technica",
    buyersGuide: `
      <h2>Qué vas a encontrar en esta categoría</h2>
      <p>Parlantes portátiles JBL (Go, Flip, Charge, Boombox) y alternativas como Stromberg y Xiaomi, auriculares inalámbricos deportivos y de uso diario (Sony, Xiaomi Redmi Buds, Samsung Galaxy Buds), y auriculares de estudio para monitoreo (Audio-Technica ATH-M series, Sennheiser HD 280 Pro). Cubre desde el parlante de mesa de luz hasta el auricular cerrado que usa un editor de audio.</p>

      <h2>Qué mirar antes de comprar</h2>
      <ul>
        <li><strong>Resistencia al agua (parlantes):</strong> buscá el código IPX. IPX5 o más aguanta salpicaduras y lluvia liviana; para pileta directamente necesitás IPX7.</li>
        <li><strong>Autonomía real:</strong> la batería declarada en la ficha suele ser con volumen medio. En uso real (volumen alto, afuera) calculá 20-30% menos horas.</li>
        <li><strong>Auriculares de estudio vs consumo:</strong> los Audio-Technica M-series son "flat" (sonido neutro, sin graves exagerados) — ideales para mezclar audio, pero suenan "aburridos" si buscás algo bien bass-heavy para escuchar música.</li>
        <li><strong>Bluetooth vs cable:</strong> para monitoreo profesional siempre cable (sin latencia). Para uso diario, Bluetooth 5.0+ ya anda bien sin cortes.</li>
      </ul>

      <h2>Rangos de precios típicos</h2>
      <p>Parlantes portátiles chicos (JBL Go, Xiaomi Pocket): <strong>$33.000-$57.000</strong>. Gama media (JBL Flip, Stromberg): <strong>$80.000-$180.000</strong>. Gama alta (JBL Charge, Boombox): <strong>$250.000-$625.000</strong>. Auriculares inalámbricos de uso diario: <strong>$23.000-$80.000</strong>, gama alta (Galaxy Buds Pro) <strong>$330.000</strong>. Auriculares de estudio Audio-Technica: entrada <strong>$135.000-$157.000</strong>, gama alta (ATH-M50x) <strong>$317.000</strong>. Para uso diario no hace falta ir a gama de estudio — esa plata rinde más en un buen inalámbrico.</p>
    `,
  },
  {
    slug: "belleza",
    name: "Belleza",
    icon: "Heart",
    pastel: "var(--color-pastel-pink)",
    mlCategoryId: "MLA1246",
    h1: "Productos de Belleza Virales",
    description: "Skincare, masajeadores y cuidado personal que arrasan en redes",
    buyersGuide: `
      <h2>Qué vas a encontrar en esta categoría</h2>
      <p>Masajeadores faciales (gua sha, rodillos de jade, lifting devices), herramientas de skincare (limpiadores ultrasónicos, LED masks), planchitas y secadores inteligentes, depiladoras IPL de hogar, accesorios para maquillaje. TikTok Argentina impulsa tendencias de K-beauty, rutinas minimalistas y devices que prometen resultados de consultorio en casa. Algunos funcionan, otros son puro marketing.</p>

      <h2>Qué mirar antes de comprar</h2>
      <ul>
        <li><strong>ANMAT / registro:</strong> para cualquier device eléctrico que toca la piel (IPL, radiofrecuencia, microcorriente), buscá que tenga registro ANMAT o al menos CE/FCC. Sin eso, es apuesta.</li>
        <li><strong>Batería vs cable:</strong> los masajeadores faciales con batería de litio son más cómodos, pero revisá autonomía real (declarada vs reviews).</li>
        <li><strong>Intensidad ajustable:</strong> buenos devices de belleza tienen al menos 3-5 niveles. Los que tienen uno solo suelen ser demasiado suaves o demasiado agresivos.</li>
        <li><strong>Consumibles:</strong> algunos requieren gel conductor o recambios. Calculá ese costo antes de comprar.</li>
      </ul>

      <h2>Rangos de precios típicos</h2>
      <p>Rodillos gua sha y jade: <strong>$3.000-$15.000</strong>. Masajeadores faciales eléctricos: <strong>$20.000-$80.000</strong>. Limpiadores faciales ultrasónicos: <strong>$15.000-$45.000</strong>. LED masks: <strong>$50.000-$200.000</strong> (las buenas arrancan en $120K). Depiladoras IPL caseras: <strong>$100.000-$400.000</strong>. Planchitas de alta gama: <strong>$80.000-$250.000</strong>. En belleza, el "dupe" barato muchas veces funciona — pero en devices eléctricos invertí en marcas con respaldo: la piel no se banca experimentos.</p>
    `,
  },
  {
    slug: "climatizacion",
    name: "Climatización",
    icon: "Thermometer",
    pastel: "var(--color-pastel-green)",
    h1: "Climatización Viral",
    description: "Aires acondicionados, ventiladores de techo, estufas eléctricas y a leña, y termotanques",
    buyersGuide: `
      <h2>Qué vas a encontrar en esta categoría</h2>
      <p>Aires acondicionados portátiles para cuartos sin salida de aire fijo, ventiladores de techo de 3 y 4 palas, estufas eléctricas de bajo consumo, caloventores y termotanques eléctricos. Productos de temporada: la demanda de aires se dispara en verano y la de estufas y termotanques en invierno, así que los precios se mueven bastante según la época.</p>

      <h2>Qué mirar antes de comprar</h2>
      <ul>
        <li><strong>Frigorías/BTU reales (aires):</strong> calculá 100 frigorías por m² como mínimo. Un aire de 2650 frigorías rinde en un cuarto de hasta 20-25 m², no más.</li>
        <li><strong>Potencia real (estufas y caloventores):</strong> las de bajo consumo rondan 400-1200W; las convencionales, 1500-2200W. Más potencia calienta más rápido pero pesa más en la factura.</li>
        <li><strong>Instalación (termotanques):</strong> los eléctricos de más de 60 litros suelen pedir circuito dedicado. Confirmá tu instalación antes de comprar uno grande.</li>
        <li><strong>Garantía en Argentina:</strong> marcas como BGH, Philco, Liliana, Atma y Rheem tienen service oficial. Es un plus real en un electrodoméstico que se usa temporada tras temporada.</li>
      </ul>

      <h2>Rangos de precios típicos</h2>
      <p>Aires acondicionados portátiles: <strong>$400.000-$700.000</strong> según frigorías y si tienen función frío/calor. Ventiladores de techo: <strong>$60.000-$180.000</strong>. Estufas eléctricas de bajo consumo: <strong>$40.000-$90.000</strong>. Caloventores: <strong>$25.000-$60.000</strong>. Termotanques eléctricos: <strong>$150.000-$300.000</strong> según litros. Comparar la misma marca y modelo en varias publicaciones sirve, porque en esta categoría el precio varía bastante según la temporada.</p>
    `,
  },
  {
    slug: "salud-bienestar",
    name: "Salud y Bienestar",
    icon: "HeartPulse",
    pastel: "var(--color-pastel-purple)",
    h1: "Salud y Bienestar Viral",
    description: "Balanzas digitales, masajeadores y productos para cuidar tu salud en casa",
    buyersGuide: `
      <h2>Qué vas a encontrar en esta categoría</h2>
      <p>Balanzas digitales de baño (simples y con análisis de composición corporal por Bluetooth), masajeadores cervicales, de pies y de cuerpo completo. Son productos que se compran una vez y se usan durante años, así que vale la pena elegir bien desde el principio.</p>

      <h2>Qué mirar antes de comprar</h2>
      <ul>
        <li><strong>Capacidad de peso (balanzas):</strong> la mayoría soporta 150-200 kg. Confirmá que alcance para todos los que la van a usar en casa.</li>
        <li><strong>Bluetooth y app (balanzas de composición corporal):</strong> las que miden grasa, músculo y agua corporal necesitan una app para ver el detalle. Fijate que la app tenga soporte en español y no pida datos de más.</li>
        <li><strong>Intensidad ajustable (masajeadores):</strong> los buenos tienen 3 o más niveles. Uno solo suele quedar demasiado suave o demasiado fuerte.</li>
        <li><strong>Garantía:</strong> marcas con presencia en Argentina (Omron, Xiaomi, Gadnic, Femmto) tienen más respaldo si falla algo pasado el primer año.</li>
      </ul>

      <h2>Rangos de precios típicos</h2>
      <p>Balanzas digitales simples: <strong>$15.000-$35.000</strong>. Balanzas con Bluetooth y análisis corporal: <strong>$35.000-$70.000</strong>. Masajeadores cervicales: <strong>$25.000-$60.000</strong>. Masajeadores de pies: <strong>$40.000-$90.000</strong>. Si el precio de una balanza "inteligente" es igual al de una simple, desconfiá — probablemente el Bluetooth sea decorativo.</p>
    `,
  },
  {
    slug: "seguridad",
    name: "Seguridad",
    icon: "Shield",
    pastel: "var(--color-pastel-blue)",
    h1: "Seguridad para el Hogar Viral",
    description: "Cámaras de seguridad WiFi, interior y exterior, con y sin mensualidad",
    buyersGuide: `
      <h2>Qué vas a encontrar en esta categoría</h2>
      <p>Cámaras de seguridad WiFi para interior y exterior, motorizadas (con seguimiento de movimiento) y fijas, individuales o en kits de varias unidades para cubrir toda la casa. La ventaja de esta generación es que graban en la nube o en microSD sin depender de una alarma con abono mensual.</p>

      <h2>Qué mirar antes de comprar</h2>
      <ul>
        <li><strong>Interior vs exterior:</strong> las de interior no tienen la certificación IP para lluvia o sol directo. Para el patio o la entrada, elegí específicamente un modelo de exterior (IP65 o más).</li>
        <li><strong>Almacenamiento:</strong> la mayoría no incluye microSD ni tiene grabación en la nube gratis ilimitada — es un gasto aparte que conviene calcular antes de comprar.</li>
        <li><strong>WiFi de 2.4 GHz:</strong> casi todas las cámaras hogareñas solo se conectan a la banda de 2.4 GHz, no a la de 5 GHz. Confirmá que tu router tenga esa red separada o combinada.</li>
        <li><strong>Detección de movimiento vs de figura humana:</strong> la detección de movimiento simple salta con cualquier cosa (mascotas, sombras). La detección de figura humana da muchas menos falsas alarmas.</li>
      </ul>

      <h2>Rangos de precios típicos</h2>
      <p>Cámaras WiFi de interior básicas: <strong>$40.000-$70.000</strong>. Cámaras motorizadas con seguimiento: <strong>$70.000-$120.000</strong>. Cámaras de exterior: <strong>$90.000-$160.000</strong>. Kits de 3 cámaras: <strong>$180.000-$280.000</strong>. Ojo con las marcas sin presencia en Argentina: si falla la app o el servidor de la nube, no tenés a quién reclamarle.</p>
    `,
  },
  {
    slug: "juguetes",
    name: "Juguetes",
    icon: "ToyBrick",
    pastel: "var(--color-pastel-pink)",
    h1: "Juguetes Virales para Regalar",
    description: "Los juguetes que están pegando fuerte en Argentina, por edad: bebés, niños, niñas y adolescentes",
    buyersGuide: `
      <h2>Qué vas a encontrar en esta categoría</h2>
      <p>Juguetes que hoy están vendiendo fuerte en MercadoLibre Argentina y aparecen seguido en redes: alfombras y gimnasios sensoriales para bebés, bloques magnéticos y cocinas de juguete para los más chicos, sets de construcción y autos a control remoto para la primaria, y coleccionables tipo blind-box, drones chicos y gadgets antiestrés para preadolescentes. Organizado por franja de edad, no por marca, porque es lo que más define si un juguete conviene o no.</p>

      <h2>Qué mirar antes de comprar</h2>
      <ul>
        <li><strong>Edad mínima recomendada:</strong> la ficha técnica de MercadoLibre suele declarar una edad mínima real, distinta a veces de lo que dice el título del vendedor. Priorizá siempre el dato de la ficha técnica.</li>
        <li><strong>Certificado de seguridad del juguete:</strong> en Argentina los juguetes deben tener un número de certificado de seguridad (Resolución de Seguridad de Producto). Está declarado en la ficha técnica de la mayoría de las publicaciones serias.</li>
        <li><strong>Piezas chicas:</strong> para menores de 3 años, evitá cualquier juguete con piezas desmontables chicas (riesgo de asfixia), aunque el vendedor no lo aclare.</li>
        <li><strong>Licencia oficial vs genérico:</strong> en coleccionables tipo blind-box, muchas publicaciones no confirman ser mercadería oficialmente licenciada. Revisá el campo "Marca" de la ficha técnica, no solo el título.</li>
      </ul>

      <h2>Rangos de precios típicos</h2>
      <p>Juguetes sensoriales para bebés: <strong>$6.000 a $25.000</strong>. Bloques de construcción y cocinas de juguete: <strong>$25.000 a $35.000</strong>. Sets LEGO con licencia: <strong>$60.000 a $150.000</strong> según la línea. Autos a control remoto: <strong>$25.000 a $45.000</strong>. Coleccionables blind-box: <strong>$6.000 a $10.000</strong> la unidad. Drones chicos con cámara: <strong>$40.000 a $60.000</strong>.</p>
    `,
  },
  {
    slug: "coleccionables",
    name: "Coleccionables",
    icon: "Trophy",
    pastel: "var(--color-pastel-purple)",
    h1: "Coleccionables Virales",
    description: "Figuritas, álbumes y objetos de colección que son furor en Argentina",
    buyersGuide: `
      <h2>Qué vas a encontrar en esta categoría</h2>
      <p>Sobres y packs de figuritas oficiales (como los del álbum del Mundial), álbumes y accesorios para completarlos. Son productos de temporada: la demanda se dispara con cada evento grande y baja el resto del año.</p>

      <h2>Qué mirar antes de comprar</h2>
      <ul>
        <li><strong>Oficialidad:</strong> comprá siempre de la marca licenciataria (por ejemplo Panini para el Mundial); las versiones truchas no tienen el mismo papel ni terminación.</li>
        <li><strong>Stock del vendedor:</strong> estos productos se agotan rápido en temporada alta; revisá que la publicación tenga stock real antes de pagar.</li>
        <li><strong>Precio por sobre:</strong> comparalo contra comprar sobres sueltos — los packs grandes no siempre salen más baratos.</li>
        <li><strong>Al azar:</strong> las figuritas vienen aleatorias, ningún pack garantiza cuáles te van a tocar.</li>
      </ul>
    `,
  },
  {
    slug: "movilidad",
    name: "Movilidad",
    icon: "Bike",
    pastel: "var(--color-pastel-blue)",
    h1: "Movilidad Personal: Bicicletas, Monopatines y Scooters",
    description: "Bicicletas, monopatines eléctricos y scooters para moverte por la ciudad, comparados con precio real de MercadoLibre",
    buyersGuide: `
      <h2>Qué vas a encontrar en esta categoría</h2>
      <p>Bicicletas rodado 29 tipo mountain bike y monopatines/scooters eléctricos, las dos categorías de movilidad personal con más demanda en MercadoLibre Argentina. Comparamos modelos reales por precio, respaldo de reseñas y componentes (frenos, cambios, cuadro), no por lo que dice el título del vendedor.</p>

      <h2>Qué mirar antes de comprar</h2>
      <ul>
        <li><strong>Material del cuadro (bicicletas):</strong> acero es más pesado pero más barato; aluminio pesa menos pero cuesta más. La ficha técnica de MercadoLibre lo declara, no siempre coincide con lo que sugiere el título.</li>
        <li><strong>Marca real del cambio de velocidades:</strong> varios títulos mencionan "Shimano" cuando solo una de las dos piezas (delantera o trasera) es de esa marca. Revisá siempre la ficha técnica completa.</li>
        <li><strong>Peso máximo soportado:</strong> varía bastante entre modelos (115 a 125 kg en bicicletas). Confirmalo antes de comprar si estás cerca del límite.</li>
        <li><strong>Respaldo de reseñas:</strong> un rating alto con pocas opiniones no es lo mismo que un rating sostenido por miles de compradores reales.</li>
      </ul>
    `,
  },
  {
    slug: "hogar-jardin",
    name: "Hogar y Jardín",
    icon: "TreePine",
    pastel: "var(--color-pastel-green)",
    h1: "Hogar y Jardín: Organización, Exterior y Herramientas",
    description: "Muebles de organización, artículos de pileta/verano, herramientas de jardín y eléctricas, comparados con precio real de MercadoLibre",
    buyersGuide: `
      <h2>Qué vas a encontrar en esta categoría</h2>
      <p>Muebles chicos de organización (zapateros, estanterías), artículos de pileta y verano, herramientas de jardín y herramientas eléctricas — todo lo que hace falta para equipar y mantener la casa y el patio. Comparamos productos reales de MercadoLibre Argentina por precio, respaldo de reseñas y specs verificadas, no por lo que promete el título del vendedor.</p>

      <h2>Qué mirar antes de comprar</h2>
      <ul>
        <li><strong>Medidas reales:</strong> en muebles chicos y organizadores las fotos engañan con la escala. Leé siempre las dimensiones en la descripción antes de comprar.</li>
        <li><strong>Material:</strong> para organizadores y muebles, fijate que sea metal/acero si va a cargar peso, o plástico ABS/PP si es liviano — evitar PVC barato que se rompe rápido.</li>
        <li><strong>Potencia y batería (herramientas eléctricas):</strong> comparar Watts o Voltios reales de la ficha técnica, no solo el nombre del producto.</li>
        <li><strong>Respaldo de reseñas:</strong> un rating alto con pocas opiniones no es lo mismo que un rating sostenido por cientos o miles de compradores reales.</li>
      </ul>
    `,
  },
];
