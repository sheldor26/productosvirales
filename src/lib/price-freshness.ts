/** La fecha más reciente entre las tres señales de "precio verificado": el
 * scraper toca `priceUpdated` cuando el precio CAMBIA de valor,
 * `priceLastChecked` cuando lo re-confirma aunque siga igual, y
 * `priceVerifiedAt` cuando un humano lo chequeó a mano en MercadoLibre —
 * no hay una prioridad fija entre las tres, cualquiera puede ser la más
 * nueva. Usarlo para mostrar "Actualizado..." o el `lastmod` del sitemap
 * evita mostrar una fecha vieja de una ficha que en realidad se
 * re-confirmó después. */
export function mostRecentPriceCheck(product: {
  priceUpdated?: string;
  priceLastChecked?: string;
  priceVerifiedAt?: string;
}): Date | null {
  const dates = [product.priceUpdated, product.priceLastChecked, product.priceVerifiedAt]
    .filter((d): d is string => !!d)
    .map((d) => new Date(d))
    .filter((d) => !Number.isNaN(d.getTime()));
  return dates.length > 0 ? dates.reduce((latest, d) => (d > latest ? d : latest)) : null;
}
