// Links cortos del sitio que redirigen directo a Mercado Libre (ver src/app/go/[slug]/route.ts).
// Sirven para que un anuncio muestre productosvirales.com.ar/go/<slug> en vez de meli.la,
// sin pasar por ninguna página intermedia. El destino SIEMPRE es un link de afiliado propio
// (meli.la) y se puede cambiar acá sin tocar el anuncio.
//
// Convención: slug en minúsculas, sin espacios. Una entrada por campaña/producto.
export const goLinks: Record<string, string> = {
  // Anuncio X (campaña "Test 1"): PS5 Digital + Astro Bot + GT7, etiqueta de ML `productosviralesx`.
  ps5: "https://meli.la/1rvzYxs",
  // Anuncio X de los cupones del día: link oficial de ML generado con "Compartir lista" de la
  // lista "Cupon MELIDOBLEON" del perfil social (jm159). Es una herramienta de monetización
  // generada por ML (lleva matt_tool); NO armar URLs de afiliado a mano.
  cupones: "https://meli.la/1jKpgEV",
  // Un link por cupón del 11.11 (anuncios de X, uno por lista): cada meli.la lo generó ML con
  // "Compartir lista" de la lista correspondiente del perfil social.
  cupon10: "https://meli.la/2xJTYsc", // lista Cupon 11X11MELI ($10.000 desde $150.000)
  cupon20: "https://meli.la/1RGQ5et", // lista Cupon 11FECHADOBLE26 ($20.000 desde $250.000)
  cupon45: "https://meli.la/1jKpgEV", // lista Cupon MELIDOBLEON ($45.000 desde $500.000)
  // Pruebas de producto en X (2026-11-11), etiqueta de ML `productosviralesx`. Cada meli.la lo
  // generó el linkbuilder oficial de ML (un producto por vez).
  hidrolavadora: "https://meli.la/13qFrtG", // Trent HLT203 1600 PSI (MLA53151118), 15%
  colchon: "https://meli.la/2PN1ifQ", // Colchon Calm 1 plaza (MLA18635355), 15%
  zapatillas: "https://meli.la/2CwBLzb", // Puma Flexfocus Lite Modern (MLAU3175612911), 15%
  aire: "https://meli.la/1LczACS", // Aire Philco Split Inverter frio/calor (MLA63226247), 7%
  // Segunda ronda de pruebas en X (2026-11-12): una etiqueta de ML por producto (xcaminadora,
  // xrobot, xhidro, xtv) para medir cada anuncio por separado en el panel de afiliados. Cada
  // meli.la lo generó el linkbuilder oficial con su etiqueta y se verificó que resuelve con
  // matt_word=<etiqueta> y el matt_tool de Juan.
  caminadora: "https://meli.la/1UHKUA3", // Caminadora Enerfit T2000a (MLA46209019), 15%, etiqueta xcaminadora
  robot: "https://meli.la/25KGqEk", // Robot aspiradora Gadnic 5000 Pa LIDAR (MLA62127506), 7%, etiqueta xrobot
  hidrogamma: "https://meli.la/2micgVH", // Hidrolavadora Gamma Pro Wash 2000 (MLA23772846), 15%, etiqueta xhidro
  tv55: "https://meli.la/1aWHttb", // Smart TV Samsung 55 QLED 4K (MLA66850209), 7%, etiqueta xtv
  iphone: "https://meli.la/2KB3pL1", // iPhone 18 Pro Max 256 GB Borgoña, Tienda oficial de Apple (MLA1077855480, item MLA4018945000), 7%, etiqueta xiphone
};
