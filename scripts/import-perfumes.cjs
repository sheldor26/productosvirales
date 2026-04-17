const fs = require('fs');
const https = require('https');

// 35 perfumes — URL + affiliate link in matching order
const items = [
  ['https://www.mercadolibre.com.ar/al-wataniah-bareeq-al-dhahad-edp-100ml-para-hombre/p/MLA24605489', 'https://meli.la/1hq7XUU'],
  ['https://www.mercadolibre.com.ar/perfume-mandarine-sky-arabe-masculino-100ml-generico/up/MLAU3812360798', 'https://meli.la/1kRWagc'],
  ['https://www.mercadolibre.com.ar/perfume-de-hombre-asad-bourbon-marron-100ml-arabe-generico/up/MLAU3798337289', 'https://meli.la/1qWMdCK'],
  ['https://www.mercadolibre.com.ar/set-de-4-perfumes-tubo-fragancias-arabes-de-35ml-unisex/p/MLA52883777', 'https://meli.la/1T1B9sw'],
  ['https://www.mercadolibre.com.ar/perfume-hombre-jamal-arabe-perfumero-recargable-be-nacional/up/MLAU3407622515', 'https://meli.la/1TyiGC8'],
  ['https://www.mercadolibre.com.ar/kit-x-4-perfumes-tubito-fragancias-arabes-x-35ml-para-hombre/up/MLAU3800115477', 'https://meli.la/2AWZpVQ'],
  ['https://www.mercadolibre.com.ar/perfume-erba-pura-arabe-masculino-100ml-generico/up/MLAU3671070084', 'https://meli.la/2WydUup'],
  ['https://www.mercadolibre.com.ar/lattafa-qaed-al-fursan-eau-de-parfum-90ml/p/MLA22234109', 'https://meli.la/2TnKuGC'],
  ['https://www.mercadolibre.com.ar/asad-lattafa-intense-hombre-edp-arabe-elegante-sexy/p/MLA19715215', 'https://meli.la/26owfqo'],
  ['https://www.mercadolibre.com.ar/perfume-hombre-rasasi-hawas-ice-edp-100ml/p/MLA29780185', 'https://meli.la/24kQeRc'],
  ['https://www.mercadolibre.com.ar/lattafa-habik-for-men-eau-de-parfum-100-ml/p/MLA54145870', 'https://meli.la/1qWX1xU'],
  ['https://www.mercadolibre.com.ar/perfume-vintage-radio-lattafa-pride-100-ml/p/MLA29077943', 'https://meli.la/2Vzf4eN'],
  ['https://www.mercadolibre.com.ar/perfume-lattafa-yara-elixir-edp-100ml/p/MLA60836327', 'https://meli.la/2NrY6fF'],
  ['https://www.mercadolibre.com.ar/perfume-rasasi-hawas-black-100ml-eau-de-parfum-aromatico-frutal-unisex/p/MLA41306043', 'https://meli.la/2T9ofP2'],
  ['https://www.mercadolibre.com.ar/lattafa-mayar-edp-x100ml/p/MLA25883660', 'https://meli.la/1qrqLzC'],
  ['https://www.mercadolibre.com.ar/perfume-lattafa-khamrah-qahwa-edp-100ml/p/MLA31178643', 'https://meli.la/1B8Vwwf'],
  ['https://www.mercadolibre.com.ar/bharara-king-eau-de-parfum-100ml-para-hombre/p/MLA19053146', 'https://meli.la/2DTqjeW'],
  ['https://www.mercadolibre.com.ar/perfume-arabe-maison-alhambra-sceptre-malachite-edp-100-ml/p/MLA27855490', 'https://meli.la/2x5L5Ei'],
  ['https://www.mercadolibre.com.ar/lattafa-her-confession-eau-de-parfum-100ml-volumen-de-la-unidad-100-ml/p/MLA41304983', 'https://meli.la/1EBDqh9'],
  ['https://www.mercadolibre.com.ar/perfume-sabah-al-ward-mujer-eau-de-parfum-100-ml-floral-oriental/p/MLA49628348', 'https://meli.la/2AcVasU'],
  ['https://www.mercadolibre.com.ar/perfume-asad-negro-100ml-estilo-arabe-exquisito-generico/up/MLAU3562485598', 'https://meli.la/2t9EpWq'],
  ['https://www.mercadolibre.com.ar/perfume-lattafa-khamrah-edp-100ml/p/MLA53013853', 'https://meli.la/139RJXC'],
  ['https://www.mercadolibre.com.ar/perfume-afnan-9pm-100-ml-eau-de-parfum-para-caballero/p/MLA19846768', 'https://meli.la/2WWHx34'],
  ['https://www.mercadolibre.com.ar/perfume-armaf-odyssey-mandarin-sky-limited-edition-edp-100-m/up/MLAU3452900219', 'https://meli.la/1woeKmQ'],
  ['https://www.mercadolibre.com.ar/perfume-afnan-9-pm-100-ml-eau-de-parfum/p/MLA47054851', 'https://meli.la/2Njx2cC'],
  ['https://www.mercadolibre.com.ar/perfume-arabe-hombre-masculino-jamal-oud-feromonas-eau-parfum-amaderado-cuero-intenso-larga-duracion-spray-seductor-butterfly-effect-industria-argentina-vegano-cruelty-free-oriental-especiado-vainilla/p/MLA40157772', 'https://meli.la/1UXLCNo'],
  ['https://www.mercadolibre.com.ar/perfume-mujer-lattafa-badee-al-oud-noble-blush-edp-100ml/p/MLA43643712', 'https://meli.la/1GvwbnM'],
  ['https://www.mercadolibre.com.ar/perfume-arabe-yara-tous-lattafa-eau-de-parfum-mujer-100-ml/p/MLA40521028', 'https://meli.la/1kwTmSn'],
  ['https://www.mercadolibre.com.ar/perfume-afnan-9-pm-elixir-100ml/p/MLA53394464', 'https://meli.la/1nRAN9K'],
  ['https://www.mercadolibre.com.ar/edp-lattafa-fakhar-woman-x-100-ml/p/MLA28060225', 'https://meli.la/2U3GQy8'],
  ['https://www.mercadolibre.com.ar/lattafa-maahir-legacy-eau-de-parfum-100ml-premium/p/MLA37755803', 'https://meli.la/25mgKqX'],
  ['https://www.mercadolibre.com.ar/perfume-hombre-lattafa-the-kingdom-man-100-ml/p/MLA41178086', 'https://meli.la/2aRjHd9'],
  ['https://www.mercadolibre.com.ar/armaf-club-de-nuit-intense-man-edp-200ml/p/MLA16122300', 'https://meli.la/1BzsFJE'],
  ['https://www.mercadolibre.com.ar/perfume-unisex-fakhar-lattafa-pride-gold-extract-edp-100-ml/p/MLA32488004', 'https://meli.la/2RmHufc'],
  ['https://www.mercadolibre.com.ar/lattafa-emeer-eau-de-parfum-arabe-caja-con-luces-de-100-ml/p/MLA28754461', 'https://meli.la/21q6DEg'],
];

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const opts = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'es-AR,es;q=0.9',
      },
    };
    https.get(url, opts, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchHtml(res.headers.location).then(resolve, reject);
      }
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractId(url) {
  const m = url.match(/\/(?:p|up)\/(MLAU?\d+)/);
  return m ? m[1] : null;
}

function parseProduct(html, sourceUrl, affiliate) {
  const id = extractId(sourceUrl);

  // Title
  let title = '';
  const titleH1 = html.match(/<h1[^>]*class="[^"]*ui-pdp-title[^"]*"[^>]*>([^<]+)/);
  if (titleH1) title = titleH1[1].trim();
  else {
    const og = html.match(/property="og:title"\s+content="([^"]+)"/);
    if (og) title = og[1].replace(/\s*\|\s*MercadoLibre.*$/, '').trim();
  }

  // Price (current). Try several patterns; the first "price":N is usually the main one.
  let price;
  const priceMatch = html.match(/"price":\s*(\d+(?:\.\d+)?)/);
  if (priceMatch) price = parseFloat(priceMatch[1]);

  // Original price (when discounted)
  let originalPrice;
  const origMatch = html.match(/"original_price":\s*(\d+(?:\.\d+)?)/);
  if (origMatch) originalPrice = parseFloat(origMatch[1]);

  // Rating + reviews
  let rating;
  const r = html.match(/"ratingValue":\s*"?(\d+\.?\d*)"?/);
  if (r) rating = parseFloat(r[1]);

  let reviewCount;
  const rc = html.match(/"reviewCount":\s*"?(\d+)"?/);
  if (rc) reviewCount = parseInt(rc[1]);

  // Main image
  let image;
  const ogImg = html.match(/property="og:image"\s+content="([^"]+)"/);
  if (ogImg) image = ogImg[1];

  // Multiple images: collect mlstatic.com webp/jpg URLs from the page
  const imgUrls = [...html.matchAll(/https:\/\/http2\.mlstatic\.com\/[^"\s)]+_2X_[^"\s)]+\.(?:webp|jpg)/g)]
    .map(m => m[0]);
  const images = [...new Set(imgUrls)].slice(0, 5);
  if (images.length === 0 && image) images.push(image);

  // Free shipping
  const freeShipping = /env(?:i|í)o\s*gratis/i.test(html);

  // Sold qty
  let soldQuantity;
  const sq = html.match(/(\d+)\s*vendidos/i);
  if (sq) soldQuantity = parseInt(sq[1]);

  return {
    id,
    title,
    price,
    originalPrice: originalPrice && originalPrice > price ? originalPrice : undefined,
    currency: 'ARS',
    image: image || images[0],
    images: images.length ? images : (image ? [image] : []),
    category: 'Belleza',
    categorySlug: 'belleza',
    permalink: sourceUrl.split('#')[0].split('?')[0],
    affiliateUrl: affiliate,
    condition: 'new',
    freeShipping,
    rating,
    soldQuantity,
    pastelColor: 'var(--pastel-pink)',
  };
}

function tsStr(s) {
  if (s == null) return 'undefined';
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"';
}

function serializeProduct(p) {
  const lines = ['  {'];
  lines.push(`    id: ${tsStr(p.id)},`);
  lines.push(`    title: ${tsStr(p.title)},`);
  lines.push(`    price: ${p.price ?? 'undefined'},`);
  lines.push(`    originalPrice: ${p.originalPrice ?? 'undefined'},`);
  lines.push(`    currency: ${tsStr(p.currency)},`);
  lines.push(`    image: ${tsStr(p.image)},`);
  if (p.images && p.images.length) {
    lines.push(`    images: [`);
    p.images.forEach(u => lines.push(`      ${tsStr(u)},`));
    lines.push(`    ],`);
  }
  lines.push(`    category: ${tsStr(p.category)},`);
  lines.push(`    categorySlug: ${tsStr(p.categorySlug)},`);
  lines.push(`    permalink: ${tsStr(p.permalink)},`);
  lines.push(`    affiliateUrl: ${tsStr(p.affiliateUrl)},`);
  lines.push(`    condition: ${tsStr(p.condition)},`);
  lines.push(`    freeShipping: ${p.freeShipping},`);
  if (p.rating != null) lines.push(`    rating: ${p.rating},`);
  if (p.soldQuantity != null) lines.push(`    soldQuantity: ${p.soldQuantity},`);
  lines.push(`    pastelColor: ${tsStr(p.pastelColor)},`);
  lines.push('  },');
  return lines.join('\n');
}

(async () => {
  const products = [];
  let i = 0;
  for (const [url, aff] of items) {
    i++;
    try {
      const html = await fetchHtml(url);
      const p = parseProduct(html, url, aff);
      if (!p.id || !p.title || !p.price) {
        console.log(`[${i}/${items.length}] FAIL ${url} — missing fields`);
        continue;
      }
      products.push(p);
      console.log(`[${i}/${items.length}] OK ${p.id} | $${p.price} | ${p.rating ?? '-'}⭐ | ${p.title.slice(0, 60)}`);
    } catch (e) {
      console.log(`[${i}/${items.length}] ERR ${url} — ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 500));
  }

  const ts = products.map(serializeProduct).join('\n');
  fs.writeFileSync('scripts/perfumes-import.generated.txt', ts);
  console.log(`\nWrote ${products.length}/${items.length} to scripts/perfumes-import.generated.txt`);
})();
