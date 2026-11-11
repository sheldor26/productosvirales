// Links cortos del sitio que redirigen directo a Mercado Libre (ver src/app/go/[slug]/route.ts).
// Sirven para que un anuncio muestre productosvirales.com.ar/go/<slug> en vez de meli.la,
// sin pasar por ninguna página intermedia. El destino SIEMPRE es un link de afiliado propio
// (meli.la) y se puede cambiar acá sin tocar el anuncio.
//
// Convención: slug en minúsculas, sin espacios. Una entrada por campaña/producto.
export const goLinks: Record<string, string> = {
  // Anuncio X (campaña "Test 1"): PS5 Digital + Astro Bot + GT7, etiqueta de ML `productosviralesx`.
  ps5: "https://meli.la/1rvzYxs",
  // Anuncio X de los cupones del día: lleva al perfil social de ML (jm159) con la etiqueta de
  // seguimiento `productosviralesx`, la misma que resuelve meli.la/1rvzYxs.
  cupones: "https://www.mercadolibre.com.ar/social/jm159?matt_word=productosviralesx&matt_tool=12465328",
};
