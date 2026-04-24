const fs = require('fs');

const fp = 'src/data/curated-products.ts';
let src = fs.readFileSync(fp, 'utf8');
const today = '2026-04-20';

const results = JSON.parse(fs.readFileSync('scripts/pending-price-results.json', 'utf8'));
const log = { applied: 0, skipped: 0, suspicious: 0, failed: 0 };
const detail = [];

for (const r of results) {
  if (r.current == null) {
    log.failed++;
    detail.push({ id: r.id, action: 'FAILED_FETCH', stored: r.storedPrice, current: null });
    continue;
  }
  if (r.status === 'unchanged') {
    log.skipped++;
    detail.push({ id: r.id, action: 'UNCHANGED', stored: r.storedPrice, current: r.current });
    continue;
  }

  // Sanity filter: ignore implausible deltas (>80% drop or current price < $500)
  const ratio = r.current / r.storedPrice;
  if (ratio < 0.2 || r.current < 500) {
    log.suspicious++;
    detail.push({ id: r.id, action: 'SUSPICIOUS', stored: r.storedPrice, current: r.current, ratio: ratio.toFixed(2) });
    continue;
  }

  // Update price + priceUpdated. Don't add priceStatus if the product already has one.
  const startRe = new RegExp('(^  \\{\\s*\\n\\s*id:\\s*[\'"]' + r.id + '[\'"],?[\\s\\S]*?)(^  \\},)', 'm');
  const m = src.match(startRe);
  if (!m) {
    detail.push({ id: r.id, action: 'NOT_FOUND', stored: r.storedPrice, current: r.current });
    continue;
  }
  let block = m[1];
  // Update price
  block = block.replace(/(\n\s+price:\s*)\d+(?:\.\d+)?(\s*,)/, `$1${r.current}$2`);
  // Set/insert priceUpdated
  if (/\n\s+priceUpdated:\s*"[^"]*"/.test(block)) {
    block = block.replace(/(\n\s+priceUpdated:\s*)"[^"]*"/, `$1"${today}"`);
  } else {
    block = block.replace(/(\n\s+price:\s*\d+(?:\.\d+)?,)/, `$1\n    priceUpdated: "${today}",`);
  }
  // priceStatus stays untouched if already set; otherwise mark fresh
  if (!/\n\s+priceStatus:\s*"[^"]*"/.test(block)) {
    block = block.replace(/(\n\s+priceUpdated:\s*"[^"]*",)/, `$1\n    priceStatus: "fresh",`);
  }
  src = src.replace(m[1] + m[2], block + m[2]);
  log.applied++;
  detail.push({ id: r.id, action: 'APPLIED', stored: r.storedPrice, current: r.current });
}

fs.writeFileSync(fp, src);
console.log('Summary:', log);
console.log('\nDetail:');
for (const d of detail) {
  const tag = d.action.padEnd(14);
  console.log(`  ${tag} ${d.id}: $${d.stored} → $${d.current}${d.ratio ? ' (ratio ' + d.ratio + ')' : ''}`);
}
