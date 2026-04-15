const fs = require('fs');

const target = 'src/data/guides.ts';
const src = fs.readFileSync(target, 'utf8');
const block = fs.readFileSync('scripts/freidoras-guides.generated.txt', 'utf8').trimEnd();

if (src.includes('slug: "mejores-freidoras-de-aire-argentina"')) {
  console.log('Already inserted — skipping.');
  process.exit(0);
}

// Insert before the closing `];` that ends the guides array (first top-level `];`)
const marker = '\n];\n\nexport const guideCategories';
const idx = src.indexOf(marker);
if (idx === -1) { console.error('marker not found'); process.exit(1); }

const before = src.slice(0, idx);
const after = src.slice(idx);
// before ends with `  },` of last guide. Append comma-newline then our block, then newline.
const insertion = '\n' + block + ',';
let out = before + insertion + after;

// Add freidoras-de-aire to guideCategories if missing
if (!out.includes('"freidoras-de-aire":') && !out.includes('freidoras-de-aire: {')) {
  out = out.replace(
    /(\s*)"pavas-electricas": \{[\s\S]*?\},(\s*)\};/,
    (m, pre, post) => m.replace(/\};$/, '') +
      `  "freidoras-de-aire": {\n    name: "Guía de Freidoras de Aire",\n    description:\n      "Comparativas honestas de freidoras de aire en MercadoLibre Argentina: Atma, Peabody, Philips, Ninja, Oster y más. Reviews por marca, recetas y guías de uso.",\n  },\n};`
  );
}

fs.writeFileSync(target, out);
console.log('Inserted 23 guides + freidoras-de-aire category. File now ' + out.split('\n').length + ' lines.');
