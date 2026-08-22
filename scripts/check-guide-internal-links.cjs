#!/usr/bin/env node
/**
 * Chequea que TODO link interno a /guias/... apunte a una guía que existe,
 * con el silo correcto.
 *
 * Por qué existe: una guía con `silo` vive en /guias/{silo}/{slug} y una sin
 * `silo` en /guias/{slug}. Si el link se equivoca de forma, Next NO devuelve
 * 404: devuelve HTTP 200 con la página "Guía no encontrada". O sea que el link
 * roto es invisible para cualquier chequeo que mire solo el código de estado.
 * Ya pasó dos veces (12 links en guías publicadas, y /guias/cocina/pava-electrica
 * en la guía de tostadora).
 */
const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "..", "src", "data", "guides.ts");
const lines = fs.readFileSync(FILE, "utf8").split("\n");

// slug → silo (la indentación del archivo no es uniforme: hay guías a 4 y a 6 espacios)
const guides = [];
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(/^\s{2,8}slug:\s*["'`]([^"'`]+)["'`]/);
  if (!m) continue;
  let silo = null;
  for (let j = i + 1; j < Math.min(i + 60, lines.length); j++) {
    if (/^\s{2,8}slug:\s*["'`]/.test(lines[j])) break;
    const s = lines[j].match(/^\s{2,8}silo:\s*["'`]([^"'`]+)["'`]/);
    if (s) { silo = s[1]; break; }
  }
  guides.push({ slug: m[1], silo });
}

const valid = new Set(guides.map((g) => (g.silo ? `/guias/${g.silo}/${g.slug}` : `/guias/${g.slug}`)));
const bySlug = new Map(guides.map((g) => [g.slug, g]));

// href: "/guias/..." y links markdown [texto](/guias/...)
const found = new Map();
lines.forEach((l, idx) => {
  const push = (u) => {
    if (!found.has(u)) found.set(u, []);
    found.get(u).push(idx + 1);
  };
  for (const m of l.matchAll(/href:\s*["'`](\/guias\/[^"'`#?]+)["'`]/g)) push(m[1]);
  for (const m of l.matchAll(/\]\((\/guias\/[^)\s#?]+)\)/g)) push(m[1]);
});

const roto = [];
for (const [url, lns] of found) {
  const clean = url.replace(/\/$/, "");
  if (valid.has(clean)) continue;
  const slug = clean.split("/").filter(Boolean).pop();
  const g = bySlug.get(slug);
  roto.push({
    url: clean,
    lns,
    correcto: g ? (g.silo ? `/guias/${g.silo}/${g.slug}` : `/guias/${g.slug}`) : null,
  });
}

console.log(`Guías: ${guides.length} | URLs internas distintas: ${found.size} | rotas: ${roto.length}`);
if (roto.length === 0) {
  console.log("✓ Todos los links internos a guías apuntan a una ruta que existe.");
  process.exit(0);
}
for (const r of roto) {
  console.error(`\n✗ ${r.url}  (líneas ${r.lns.join(", ")})`);
  console.error(r.correcto ? `  correcto: ${r.correcto}` : `  esa guía no existe`);
}
console.error(`\n${roto.length} link(s) interno(s) roto(s). Devuelven 200 con "Guía no encontrada", no 404.`);
process.exit(1);
