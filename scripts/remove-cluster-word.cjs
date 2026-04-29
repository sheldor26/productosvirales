const fs = require('fs');

// Files to process — only user-visible content. Skip planning/internal docs in docs/clusters/freidoras-de-aire/.
const targets = [
  'src/data/curated-products.ts',
  'src/data/guides.ts',
  'docs/clusters/freidoras-de-aire/pilar/mejores-freidoras-de-aire-argentina.md',
];

// Replacements ordered most-specific → least-specific.
// Match the word "cluster"/"Cluster" with surrounding context to keep prose natural.
function transform(line) {
  // Skip lines that reference the folder path `docs/clusters/freidoras-de-aire/`
  if (/docs\/clusters\/freidoras-de-aire\//.test(line)) return line;
  let s = line;
  // contextual phrases first
  s = s.replace(/\bdel mismo cluster\b/gi, 'del mismo catálogo');
  s = s.replace(/\beste cluster de\b/gi, 'este catálogo de');
  s = s.replace(/\bdel cluster de\b/gi, 'del catálogo de');
  s = s.replace(/\bel cluster astronauta\b/gi, 'el catálogo de astronautas');
  s = s.replace(/\bcluster astronauta\b/gi, 'catálogo de astronautas');
  s = s.replace(/\bcluster corta papas\b/gi, 'catálogo de cortadoras de papa');
  s = s.replace(/\bcluster retr[aá]ctil\b/gi, 'catálogo de retráctiles');
  // generic
  s = s.replace(/\bClusters\b/g, 'Catálogos');
  s = s.replace(/\bclusters\b/g, 'catálogos');
  s = s.replace(/\bCluster\b/g, 'Catálogo');
  s = s.replace(/\bcluster\b/g, 'catálogo');
  return s;
}

let totalLines = 0, totalFiles = 0;
for (const fp of targets) {
  if (!fs.existsSync(fp)) { console.log('MISS ' + fp); continue; }
  const src = fs.readFileSync(fp, 'utf8');
  const out = src.split('\n').map(transform).join('\n');
  if (out === src) { console.log('NOCHANGE ' + fp); continue; }
  fs.writeFileSync(fp, out);
  const before = (src.match(/cluster/gi) || []).length;
  const after = (out.match(/cluster/gi) || []).length;
  console.log(`OK ${fp}: ${before} → ${after} occurrences (skipped folder paths)`);
  totalFiles++;
}
console.log(`\n${totalFiles} files updated.`);
