const fs = require('fs');
const https = require('https');

const src = fs.readFileSync('src/data/curated-products.ts', 'utf8');

// Extract all products: id + permalink + storedPrice
// Split by product boundaries (each top-level object in the array)
function extractProducts() {
  // Split file into product blocks using the top-level object pattern
  const blocks = src.split(/\n  \{/);
  const products = [];
  for (const block of blocks) {
    const idMatch = block.match(/id:\s*'([^']+)'/);
    const permaMatch = block.match(/permalink:\s*'([^']+)'/);
    const priceMatch = block.match(/price:\s*([\d.]+)/);
    if (idMatch && permaMatch && priceMatch) {
      products.push({
        id: idMatch[1],
        url: permaMatch[1],
        storedPrice: parseFloat(priceMatch[1]),
      });
    }
  }
  return products;
}

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
      res.on('end', () => resolve({ html: data, status: res.statusCode }));
    }).on('error', reject);
  });
}

function parsePrice(html) {
  // Try multiple patterns ML uses
  const patterns = [
    /"price":\s*(\d+(?:\.\d+)?)/,
    /itemprop="price"\s+content="(\d+(?:\.\d+)?)"/,
    /"amount":\s*(\d+(?:\.\d+)?)/,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) return parseFloat(m[1]);
  }
  return null;
}

(async () => {
  const products = extractProducts();
  console.log(`Checking ${products.length} products...\n`);

  const results = [];

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    try {
      const { html, status } = await fetchHtml(p.url);
      const current = parsePrice(html);
      if (current == null) {
        console.log(`[${i+1}/${products.length}] FAIL  ${p.id} (status ${status}) — could not parse price`);
        results.push({ ...p, current: null });
      } else {
        const diff = current - p.storedPrice;
        const pct = ((diff / p.storedPrice) * 100).toFixed(1);
        const flag = Math.abs(diff) < 1 ? 'OK  ' : diff > 0 ? 'UP  ' : 'DOWN';
        const diffStr = Math.abs(diff) >= 1 ? ` → $${current.toLocaleString('es-AR')} (${diff > 0 ? '+' : ''}${pct}%)` : '';
        console.log(`[${i+1}/${products.length}] ${flag} ${p.id} $${p.storedPrice.toLocaleString('es-AR')}${diffStr}`);
        results.push({ ...p, current, diff });
      }
    } catch (e) {
      console.log(`[${i+1}/${products.length}] ERR   ${p.id} — ${e.message}`);
      results.push({ ...p, current: null, error: e.message });
    }
    await new Promise(r => setTimeout(r, 400));
  }

  const changed = results.filter(r => r.current != null && Math.abs(r.diff) >= 1);
  const failed = results.filter(r => r.current == null);

  console.log('\n' + '='.repeat(80));
  console.log(`SUMMARY: ${changed.length} changed, ${failed.length} failed, ${products.length - changed.length - failed.length} OK\n`);

  if (changed.length > 0) {
    changed.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
    console.log('PRICE CHANGES:');
    for (const r of changed) {
      const pct = ((r.diff / r.storedPrice) * 100).toFixed(1);
      const arrow = r.diff > 0 ? '↑' : '↓';
      console.log(`  ${arrow} ${r.id}: $${r.storedPrice.toLocaleString('es-AR')} → $${r.current.toLocaleString('es-AR')} (${r.diff > 0 ? '+' : ''}${pct}%)`);
    }
  }

  if (failed.length > 0) {
    console.log('\nFAILED (could not fetch price):');
    failed.forEach(r => console.log(`  ${r.id}: ${r.error || 'parse error'}`));
  }

  fs.writeFileSync('scripts/price-check-all.json', JSON.stringify(results, null, 2));
  console.log('\nFull results saved to scripts/price-check-all.json');
})();
