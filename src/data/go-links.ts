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
};
