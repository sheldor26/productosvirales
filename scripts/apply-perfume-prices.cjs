const fs = require('fs');

const fp = 'src/data/curated-products.ts';
const results = JSON.parse(fs.readFileSync('scripts/perfume-price-check.json', 'utf8'));

let src = fs.readFileSync(fp, 'utf8');
const today = new Date().toISOString().slice(0, 10);

let updated = 0;
let skipped = 0;
const log = [];

for (const r of results) {
  if (r.current == null || r.current < 1) {
    skipped.push?.({}); skipped++;
    log.push({ id: r.id, stored: r.stored, current: r.current, action: 'SKIPPED (price=0/null, scrape error)' });
    continue;
  }
  if (Math.abs(r.diff) < 1) {
    log.push({ id: r.id, stored: r.stored, current: r.current, action: 'UNCHANGED' });
    continue;
  }
  // Replace the `price: <stored>` line of this product with the current price
  const re = new RegExp('(id:\\s*[\'"]' + r.id + '[\'"][\\s\\S]*?price:\\s*)' + r.stored.toString().replace('.', '\\.') + '\\b');
  if (!re.test(src)) {
    log.push({ id: r.id, stored: r.stored, current: r.current, action: 'NOT_MATCHED' });
    continue;
  }
  src = src.replace(re, `$1${r.current}`);
  updated++;
  log.push({ id: r.id, stored: r.stored, current: r.current, action: 'UPDATED' });
}

// Bump priceUpdated for Yara Elixir if its price changed (only product with that field)
src = src.replace(/(id:\s*"MLA60836327"[\s\S]*?priceUpdated:\s*)"[^"]+"/, `$1"${today}"`);

fs.writeFileSync(fp, src);
console.log(`Updated ${updated} products. Skipped ${results.filter(r => !r.current || r.current < 1).length} with invalid scrape.\n`);

console.log('Detailed log:');
for (const l of log) console.log(`  ${l.action.padEnd(28)} ${l.id} | $${l.stored} → $${l.current}`);
