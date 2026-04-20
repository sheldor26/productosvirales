const fs = require('fs');

const updates = [
  { id: 'MLA24605489', price: 32990, status: 'fresh' },
  { id: 'MLAU3812360798', price: 45950, status: 'fresh' },
  { id: 'MLAU3798337289', price: 34259, status: 'fresh' },
  { id: 'MLA52883777', price: 16745, status: 'fresh' },
  { id: 'MLAU3407622515', price: 52610, status: 'fresh' },
  { id: 'MLAU3800115477', price: 16104, status: 'stale' },
  { id: 'MLAU3671070084', price: 73160, status: 'fresh' },
  { id: 'MLA22234109', price: 30051, status: 'fresh' },
  { id: 'MLA19715215', price: 45160, status: 'fresh' },
  { id: 'MLA29780185', price: 83599, status: 'fresh' },
  { id: 'MLA54145870', price: 65799, status: 'fresh' },
  { id: 'MLA29077943', price: 69932, status: 'fresh' },
  { id: 'MLA60836327', price: 68000, status: 'fresh' },
  { id: 'MLA41306043', price: 75388, status: 'fresh' },
  { id: 'MLA25883660', price: 58900, status: 'fresh' },
  { id: 'MLA31178643', price: 49485, status: 'fresh' },
  { id: 'MLA19053146', price: 137817, status: 'fresh' },
  { id: 'MLA27855490', price: 55499, status: 'fresh' },
  { id: 'MLA41304983', price: 65000, status: 'fresh' },
  { id: 'MLA49628348', price: 44086, status: 'fresh' },
  { id: 'MLAU3562485598', price: 37862, status: 'stale' },
  { id: 'MLA53013853', price: 48513, status: 'fresh' },
  { id: 'MLA19846768', price: 47214, status: 'fresh' },
  { id: 'MLAU3452900219', price: 110263, status: 'stale' },
  { id: 'MLA47054851', price: 43998, status: 'fresh' },
  { id: 'MLA40157772', price: 43814, status: 'fresh' },
  { id: 'MLA43643712', price: 57999, status: 'fresh' },
  { id: 'MLA40521028', price: 42545, status: 'fresh' },
  { id: 'MLA53394464', price: 51000, status: 'fresh' },
  { id: 'MLA28060225', price: 44000, status: 'fresh' },
  { id: 'MLA37755803', price: 50999, status: 'fresh' },
  { id: 'MLA41178086', price: 71198, status: 'fresh' },
  { id: 'MLA16122300', price: 139000, status: 'fresh' },
  { id: 'MLA32488004', price: 47574, status: 'fresh' },
  { id: 'MLA28754461', price: 75811, status: 'fresh' },
];

const fp = 'src/data/curated-products.ts';
let src = fs.readFileSync(fp, 'utf8');
const today = '2026-04-20';
let touched = 0;

for (const u of updates) {
  // Locate the entry block: from `id: "MLAxxx"` to the next `^  },`
  const startRe = new RegExp('(^  \\{\\s*\\n\\s*id:\\s*[\'"]' + u.id + '[\'"],?[\\s\\S]*?)(^  \\},)', 'm');
  const m = src.match(startRe);
  if (!m) {
    console.warn('NOT FOUND ' + u.id);
    continue;
  }
  let block = m[1];
  const blockEnd = m[2];

  // 1) Update price field
  block = block.replace(/(\n\s+price:\s*)\d+(?:\.\d+)?(\s*,)/, `$1${u.price}$2`);

  // 2) Set/insert priceUpdated
  if (/\n\s+priceUpdated:\s*"[^"]*"/.test(block)) {
    block = block.replace(/(\n\s+priceUpdated:\s*)"[^"]*"/, `$1"${today}"`);
  } else {
    // insert just after price line
    block = block.replace(/(\n\s+price:\s*\d+(?:\.\d+)?,)/, `$1\n    priceUpdated: "${today}",`);
  }

  // 3) Set/insert priceStatus
  if (/\n\s+priceStatus:\s*"[^"]*"/.test(block)) {
    block = block.replace(/(\n\s+priceStatus:\s*)"[^"]*"/, `$1"${u.status}"`);
  } else {
    block = block.replace(/(\n\s+priceUpdated:\s*"[^"]*",)/, `$1\n    priceStatus: "${u.status}",`);
  }

  src = src.replace(m[1] + m[2], block + blockEnd);
  touched++;
}

fs.writeFileSync(fp, src);
console.log(`Touched ${touched}/${updates.length} products. priceUpdated=${today} on all.`);
