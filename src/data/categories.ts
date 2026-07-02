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
];
