const fs = require('fs');
const https = require('https');

const src = fs.readFileSync('src/data/curated-products.ts', 'utf8');

// Extract id + price pairs
const products = [];
const idMatches = [...src.matchAll(/id: '(MLA\w+)'/g)];
for (const m of idMatches) {
  const id = m[1];
  const after = src.slice(m.index, m.index + 300);
  const priceMatch = after.match(/price:\s*([\d.]+)/);
  if (priceMatch) {
    products.push({ id, storedPrice: parseFloat(priceMatch[1]) });
  }
}

function fetchItem(id) {
  return new Promise((resolve, reject) => {
    const url = `https://api.mercadolibre.com/items/${id}`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(data);
          resolve({ id, currentPrice: j.price, status: j.status, title: (j.title || '').slice(0, 50) });
        } catch {
          resolve({ id, error: 'parse error' });
        }
      });
    }).on('error', e => resolve({ id, error: e.message }));
  });
}

(async () => {
  const diffs = [];
  const errors = [];
  let checked = 0;

  // Process in batches of 10 to avoid rate limits
  for (let i = 0; i < products.length; i += 10) {
    const batch = products.slice(i, i + 10);
    const results = await Promise.all(batch.map(p => fetchItem(p.id)));

    for (const r of results) {
      checked++;
      if (r.error) {
        errors.push(`${r.id}: ${r.error}`);
        continue;
      }
      const stored = products.find(p => p.id === r.id);
      if (!stored) continue;

      const diff = Math.abs(r.currentPrice - stored.storedPrice);
      const pct = ((diff / stored.storedPrice) * 100).toFixed(1);

      if (diff > 1) {
        diffs.push({
          id: r.id,
          title: r.title,
          stored: stored.storedPrice,
          current: r.currentPrice,
          diff: r.currentPrice - stored.storedPrice,
          pct,
          status: r.status,
        });
      }
    }

    // Small delay between batches
    if (i + 10 < products.length) await new Promise(r => setTimeout(r, 300));
  }

  console.log(`Checked ${checked}/${products.length} products\n`);

  if (errors.length) {
    console.log(`ERRORS (${errors.length}):`);
    errors.forEach(e => console.log('  ' + e));
    console.log();
  }

  // Sort by absolute pct difference desc
  diffs.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));

  if (diffs.length === 0) {
    console.log('All prices are up to date!');
  } else {
    console.log(`PRICE DIFFERENCES FOUND (${diffs.length}):\n`);
    console.log('ID | Title | Stored | Current | Diff | %');
    console.log('-'.repeat(100));
    for (const d of diffs) {
      const arrow = d.diff > 0 ? '↑' : '↓';
      console.log(`${d.id} | ${d.title} | $${d.stored.toLocaleString()} | $${d.current.toLocaleString()} | ${arrow}$${Math.abs(d.diff).toLocaleString()} | ${d.pct}% ${d.status !== 'active' ? '⚠️ ' + d.status : ''}`);
    }
  }
})();
