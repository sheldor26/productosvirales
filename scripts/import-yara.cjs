const fs = require('fs');
const https = require('https');

const items = [
  ['https://www.mercadolibre.com.ar/lattafa-yara-candy-edp-100-ml/p/MLA39865991', 'https://meli.la/2XYzvaU'],
  ['https://www.mercadolibre.com.ar/set-coleccion-de-perfumes-arabes-my-yara-collection-lattafa-pack-x4/p/MLA51612102', 'https://meli.la/2jd7cJf'],
  ['https://www.mercadolibre.com.ar/set-lattafa-yara-rosa-candy-5to-aniversario/p/MLA45984979', 'https://meli.la/2qjxA7G'],
  ['https://www.mercadolibre.com.ar/lattafa-yara-moi-eau-de-parfum-spray-100ml-mujer/p/MLA32288168', 'https://meli.la/1qBuAFB'],
  ['https://www.mercadolibre.com.ar/perfume-de-mujer-lattafa-yara-edp-100-ml-arabe-original/up/MLAU2983186467', 'https://meli.la/2nDMa11'],
];

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'es-AR,es;q=0.9',
      },
    }, (res) => {
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
  let title = '';
  const t = html.match(/<h1[^>]*class="[^"]*ui-pdp-title[^"]*"[^>]*>([^<]+)/);
  if (t) title = t[1].trim();
  else {
    const og = html.match(/property="og:title"\s+content="([^"]+)"/);
    if (og) title = og[1].replace(/\s*\|\s*MercadoLibre.*$/, '').trim();
  }

  let price;
  const pm = html.match(/"price":\s*(\d+(?:\.\d+)?)/);
  if (pm) price = parseFloat(pm[1]);

  let originalPrice;
  const om = html.match(/"original_price":\s*(\d+(?:\.\d+)?)/);
  if (om) originalPrice = parseFloat(om[1]);

  let rating;
  const r = html.match(/"ratingValue":\s*"?(\d+\.?\d*)"?/);
  if (r) rating = parseFloat(r[1]);

  let reviewCount;
  const rc = html.match(/"reviewCount":\s*"?(\d+)"?/);
  if (rc) reviewCount = parseInt(rc[1]);

  let image;
  const ogImg = html.match(/property="og:image"\s+content="([^"]+)"/);
  if (ogImg) image = ogImg[1];

  const imgUrls = [...html.matchAll(/https:\/\/http2\.mlstatic\.com\/[^"\s)]+_2X_[^"\s)]+\.(?:webp|jpg)/g)].map(m => m[0]);
  const images = [...new Set(imgUrls)].slice(0, 5);
  if (images.length === 0 && image) images.push(image);

  const freeShipping = /env(?:i|í)o\s*gratis/i.test(html);

  return {
    id, title, price,
    originalPrice: originalPrice && originalPrice > price ? originalPrice : undefined,
    currency: 'ARS',
    image: image || images[0],
    images,
    category: 'Belleza',
    categorySlug: 'belleza',
    permalink: sourceUrl.split('#')[0].split('?')[0],
    affiliateUrl: affiliate,
    condition: 'new',
    freeShipping,
    rating,
    reviewCount,
    pastelColor: 'var(--pastel-pink)',
  };
}

function tsStr(s) {
  if (s == null) return 'undefined';
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
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
        console.log(`[${i}/5] FAIL ${url}`);
        continue;
      }
      products.push(p);
      console.log(`[${i}/5] OK ${p.id} | $${p.price} | ${p.rating || '-'}⭐ | ${p.title.slice(0, 60)}`);
    } catch (e) {
      console.log(`[${i}/5] ERR ${url} — ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 500));
  }

  // Decode HTML entities
  let ts = products.map(serializeProduct).join('\n');
  const map = { '&#x27;': "'", '&#39;': "'", '&amp;': '&', '&quot;': '"' };
  for (const [k, v] of Object.entries(map)) ts = ts.split(k).join(v);
  ts = ts.replace(/&#x([0-9A-Fa-f]+);/g, (_, c) => String.fromCharCode(parseInt(c, 16)));
  ts = ts.replace(/&#(\d+);/g, (_, c) => String.fromCharCode(parseInt(c, 10)));

  fs.writeFileSync('scripts/yara-import.generated.txt', ts);
  console.log(`\nWrote ${products.length}/5 to scripts/yara-import.generated.txt`);
})();
