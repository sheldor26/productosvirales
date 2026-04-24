const fs = require('fs');
const https = require('https');

const all = JSON.parse(fs.readFileSync('scripts/pending-price-results.json', 'utf8'));
const failed = all.filter(r => r.current == null || (r.current < 500 && r.storedPrice > 5000));

console.log(`Re-trying ${failed.length} failed/suspicious products with 1.5s delay...\n`);

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
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
    /"price":\s*(\d{4,}(?:\.\d+)?)/,  // require 4+ digits to avoid garbage
    /itemprop="price"\s+content="(\d{4,}(?:\.\d+)?)"/,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) {
      const n = parseFloat(m[1]);
      if (n > 1000) return n;
    }
  }
  return null;
}

(async () => {
  const updated = [];
  for (let i = 0; i < failed.length; i++) {
    const p = failed[i];
    let success = false;
    for (let attempt = 0; attempt < 2 && !success; attempt++) {
      try {
        const { html } = await fetchHtml(p.permalink);
        const current = parsePrice(html);
        if (current != null) {
          const diff = current - p.storedPrice;
          const flag = Math.abs(diff) < 1 ? 'OK ' : diff > 0 ? 'UP ' : 'DN ';
          console.log(`[${i + 1}/${failed.length}] ${flag} ${p.id} $${p.storedPrice} → $${current}`);
          updated.push({ ...p, current, diff, status: Math.abs(diff) < 1 ? 'unchanged' : 'changed' });
          success = true;
        } else {
          if (attempt === 1) {
            console.log(`[${i + 1}/${failed.length}] STILL FAIL ${p.id}`);
            updated.push({ ...p, current: null, status: 'fail' });
          }
        }
      } catch (e) {
        if (attempt === 1) {
          console.log(`[${i + 1}/${failed.length}] ERR ${p.id} — ${e.message}`);
          updated.push({ ...p, current: null, status: 'error', error: e.message });
        }
      }
      if (!success) await new Promise(r => setTimeout(r, 2500));
    }
    await new Promise(r => setTimeout(r, 1500));
  }

  // Merge with original results
  const map = new Map(all.map(r => [r.id, r]));
  for (const u of updated) map.set(u.id, u);
  const merged = Array.from(map.values());
  fs.writeFileSync('scripts/pending-price-results.json', JSON.stringify(merged, null, 2));
  const stillFailed = updated.filter(u => u.current == null);
  console.log(`\nRetry summary: ${updated.length - stillFailed.length} recovered, ${stillFailed.length} still failed.`);
})();
