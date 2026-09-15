const fs = require('fs');
const { estaProtegido, avisarProtegidos, leerVerificadoAt, FORCE_FLAG } = require('./lib/price-guard.cjs');

// Este script no pisa el PRECIO, pero marca priceStatus: "stale" cuando el
// scrapeo falla. Sobre un precio verificado a mano hace pocos dias eso es
// falso al reves: no esta viejo, es el dato mas confiable del catalogo, y
// marcarlo hace que el sitio le avise al lector que desconfie del unico
// precio que si se comprobo. Por eso respeta la misma marca que los demas.
const forzar = process.argv.includes(FORCE_FLAG);

const all = JSON.parse(fs.readFileSync('scripts/pending-price-results.json', 'utf8'));
const failed = all.filter(r => r.current == null);
let src = fs.readFileSync('src/data/curated-products.ts', 'utf8');
let touched = 0;
const protegidos = [];

for (const r of failed) {
  const startRe = new RegExp('(^  \\{\\s*\\n\\s*id:\\s*[\'"]' + r.id + '[\'"],?[\\s\\S]*?)(^  \\},)', 'm');
  const m = src.match(startRe);
  if (!m) {
    console.log('NOT FOUND ' + r.id);
    continue;
  }
  let block = m[1];
  if (estaProtegido(block, { forzar })) {
    protegidos.push({
      id: r.id,
      actual: 'priceStatus actual',
      propuesto: 'stale',
      verificadoAt: leerVerificadoAt(block),
    });
    continue;
  }
  if (/\n\s+priceStatus:\s*"[^"]*"/.test(block)) {
    block = block.replace(/(\n\s+priceStatus:\s*)"[^"]*"/, `$1"stale"`);
  } else if (/\n\s+priceUpdated:\s*"[^"]*"/.test(block)) {
    block = block.replace(/(\n\s+priceUpdated:\s*"[^"]*",)/, `$1\n    priceStatus: "stale",`);
  } else {
    block = block.replace(/(\n\s+price:\s*\d+(?:\.\d+)?,)/, `$1\n    priceStatus: "stale",`);
  }
  src = src.replace(m[1] + m[2], block + m[2]);
  touched++;
}

fs.writeFileSync('src/data/curated-products.ts', src);
console.log(`Marked ${touched}/${failed.length} as stale`);
avisarProtegidos(protegidos, 'scripts/mark-stale-prices.cjs');
