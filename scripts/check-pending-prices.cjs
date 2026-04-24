const fs = require('fs');
const https = require('https');

const pending = JSON.parse(fs.readFileSync('scripts/pending-price-check.json', 'utf8'));

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
  const patterns = [
    /"price":\s*(\d+(?:\.\d+)?)/,
    /itemprop="price"\s+content="(\d+(?:\.\d+)?)"/,
    /"amount":\s*(\d+(?:\.\d+)?)/,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) {
      const n = parseFloat(m[1]);
      if (n > 1) return n;
    }
  }
  return null;
}

(async () => {
  const results = [];
  for (let i = 0; i < pending.length; i++) {
    const p = pending[i];
    try {
      const { html, status } = await fetchHtml(p.permalink);
      const current = parsePrice(html);
      if (current == null) {
        console.log(`[${i + 1}/${pending.length}] FAIL ${p.id} (HTTP ${status})`);
        results.push({ ...p, current: null, status: 'fail' });
      } else {
        const diff = current - p.storedPrice;
        const flag = Math.abs(diff) < 1 ? 'OK ' : diff > 0 ? 'UP ' : 'DN ';
        const pct = p.storedPrice ? ((diff / p.storedPrice) * 100).toFixed(1) + '%' : '';
        console.log(`[${i + 1}/${pending.length}] ${flag} ${p.id} $${p.storedPrice} → $${current} ${pct}`);
        results.push({ ...p, current, diff, status: Math.abs(diff) < 1 ? 'unchanged' : 'changed' });
      }
    } catch (e) {
      console.log(`[${i + 1}/${pending.length}] ERR ${p.id} — ${e.message}`);
      results.push({ ...p, current: null, status: 'error', error: e.message });
    }
    await new Promise(r => setTimeout(r, 350));
  }

  fs.writeFileSync('scripts/pending-price-results.json', JSON.stringify(results, null, 2));
  const changed = results.filter(r => r.status === 'changed');
  const failed = results.filter(r => r.status === 'fail' || r.status === 'error');
  console.log(`\nSUMMARY: ${changed.length} changed, ${failed.length} failed, ${results.length - changed.length - failed.length} unchanged.`);
})();
