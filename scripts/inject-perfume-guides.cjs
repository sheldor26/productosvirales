const fs = require('fs');

const target = 'src/data/guides.ts';
const src = fs.readFileSync(target, 'utf8');
const block = fs.readFileSync('scripts/perfumes-guides.generated.txt', 'utf8').trimEnd();

const startMarker = '  // GRUPO: PERFUMES ÁRABES (Lote 1 - 5 artículos)';
const endMarker = '\n];\n\nexport const guideCategories';

const startIdx = src.indexOf(startMarker);
const endIdx = src.indexOf(endMarker);
if (endIdx === -1) { console.error('end marker not found'); process.exit(1); }

let before, after;
if (startIdx !== -1 && startIdx < endIdx) {
  // Replace existing perfume block
  before = src.slice(0, startIdx);
  after = src.slice(endIdx);
  console.log('Replacing existing perfume block...');
} else {
  // First insertion
  before = src.slice(0, endIdx);
  after = src.slice(endIdx);
}

const insertion = '  // GRUPO: PERFUMES ÁRABES (Lote 1 - 5 artículos)\n' + block + ',';
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
