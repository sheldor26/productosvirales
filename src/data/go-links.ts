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
};
