const fs = require('fs');
const path = require('path');

const base = 'cluster-freidoras-de-aire';
const schedule = [
  ['pilar/mejores-freidoras-de-aire-argentina.md', '2026-04-15'],
  ['reviews/atma-freidoras-de-aire-review.md', '2026-04-18'],
  ['reviews/peabody-freidoras-de-aire-review.md', '2026-04-22'],
  ['informacionales/recetas-freidora-de-aire.md', '2026-04-25'],
  ['reviews/philips-freidoras-de-aire-review.md', '2026-04-29'],
  ['informacionales/accesorios-para-freidora-de-aire.md', '2026-05-02'],
  ['reviews/oster-freidoras-de-aire-review.md', '2026-05-06'],
  ['comparativas/atma-vs-peabody-freidora-de-aire.md', '2026-05-09'],
  ['informacionales/como-usar-una-freidora-de-aire.md', '2026-05-13'],
  ['reviews/gadnic-freidora-review.md', '2026-05-16'],
  ['reviews/kanji-home-freidora-review.md', '2026-05-20'],
  ['reviews/ninja-crispi-review.md', '2026-05-23'],
  ['comparativas/ninja-vs-philips-freidora-de-aire.md', '2026-05-27'],
  ['comparativas/mejores-freidoras-de-aire-doble-canasta.md', '2026-05-30'],
  ['comparativas/freidoras-de-aire-con-grill-argentina.md', '2026-06-03'],
  ['comparativas/mejores-freidoras-de-aire-economicas-argentina.md', '2026-06-07'],
  ['comparativas/freidoras-de-aire-gran-capacidad.md', '2026-06-11'],
  ['informacionales/cuanto-consume-freidora-de-aire.md', '2026-06-14'],
  ['informacionales/freidora-de-aire-vs-horno.md', '2026-06-18'],
  ['informacionales/vale-la-pena-comprar-freidora-de-aire.md', '2026-06-21'],
  ['reviews/powerxl-freidora-review.md', '2026-06-25'],
  ['reviews/suono-airfryer-review.md', '2026-06-28'],
  ['informacionales/freidora-de-aire-desventajas.md', '2026-07-02'],
];

let ok = 0, miss = 0;
for (const [rel, date] of schedule) {
  const fp = path.join(base, rel);
  if (!fs.existsSync(fp)) { console.log('MISS ' + rel); miss++; continue; }
  let txt = fs.readFileSync(fp, 'utf8');
  const before = txt;
  txt = txt.replace(/^publishDate:\s*"[^"]*"/m, `publishDate: "${date}"`);
  txt = txt.replace(/^lastModified:\s*"[^"]*"/m, `lastModified: "${date}"`);
  if (txt === before) { console.log('NOCHANGE ' + rel); continue; }
  fs.writeFileSync(fp, txt);
  console.log('OK ' + rel + ' -> ' + date);
  ok++;
}
console.log('\n' + ok + '/' + schedule.length + ' updated, ' + miss + ' missing');
