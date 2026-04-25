const fs = require('fs');

const updates = [
  ['pava-electrica-precio', '2026-04-25'],
  ['pava-electrica-mercadolibre', '2026-05-02'],
  ['pava-electrica-peabody', '2026-05-09'],
  ['pava-electrica-liliana', '2026-05-16'],
  ['pava-electrica-oster', '2026-05-23'],
  ['pava-electrica-control-temperatura', '2026-05-30'],
  ['pava-electrica-vidrio', '2026-06-06'],
  ['pava-electrica-acero-inoxidable', '2026-06-13'],
  ['pava-electrica-pequena', '2026-06-20'],
];

let src = fs.readFileSync('src/data/guides.ts', 'utf8');
let count = 0;

for (const [slug, newDate] of updates) {
  const idx = src.indexOf(`slug: "${slug}"`);
  if (idx === -1) { console.log('NOT FOUND:', slug); continue; }

  // Find next publishedDate within 2000 chars after slug
  const segment = src.slice(idx, idx + 2000);
  const m = segment.match(/publishedDate:\s*"([\d-]+)"/);
  if (!m) { console.log('NO publishedDate:', slug); continue; }

  const oldDate = m[1];
  const newSegment = segment.replace(/publishedDate:\s*"[\d-]+"/, `publishedDate: "${newDate}"`);
  // Also update updatedDate if it matches the old publishedDate
  const finalSegment = newSegment.replace(
    new RegExp(`updatedDate:\\s*"${oldDate}"`),
    `updatedDate: "${newDate}"`
  );
  src = src.slice(0, idx) + finalSegment + src.slice(idx + 2000);
  console.log(`${slug}: ${oldDate} -> ${newDate}`);
  count++;
}

fs.writeFileSync('src/data/guides.ts', src);
console.log(`Done. Updated ${count} dates.`);
