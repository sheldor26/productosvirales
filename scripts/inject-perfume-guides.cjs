const fs = require('fs');

const target = 'src/data/guides.ts';
const src = fs.readFileSync(target, 'utf8');
const block = fs.readFileSync('scripts/perfumes-guides.generated.txt', 'utf8').trimEnd();

if (src.includes('slug: "yara-lattafa-guia-completa"')) {
  console.log('Already inserted — skipping.');
  process.exit(0);
}

const marker = '\n];\n\nexport const guideCategories';
const idx = src.indexOf(marker);
if (idx === -1) { console.error('marker not found'); process.exit(1); }

const before = src.slice(0, idx);
const after = src.slice(idx);
const insertion = '\n  // GRUPO: PERFUMES ÁRABES (Lote 1 - 5 artículos)\n' + block + ',';
let out = before + insertion + after;

if (!out.includes('"perfumes-arabes":')) {
  out = out.replace(
    /(\s*)"freidoras-de-aire": \{[\s\S]*?\},(\s*)\};/,
    (m) => m.replace(/\};$/, '') +
      `  "perfumes-arabes": {\n    name: "Guía de Perfumes Árabes",\n    description:\n      "Comparativas honestas de perfumes árabes en Argentina: Lattafa, Afnan, Rasasi, Armaf y más. Reviews por marca, género, presupuesto y notas.",\n  },\n};`
  );
}

fs.writeFileSync(target, out);
console.log('Inserted 5 perfume guides + perfumes-arabes category. File now ' + out.split('\n').length + ' lines.');
