/**
 * Chequea que la proteccion de precios verificados a mano siga en pie.
 *
 * Por que existe: el 2026-08-12 Bright Data piso 11 de 15 precios verificados
 * a mano. Se cerro el agujero con scripts/lib/price-guard.cjs, pero una
 * proteccion asi se rompe callada: alguien agrega un script de precios nuevo
 * sin el guard, o refactoriza y el import se pierde, y no se nota hasta que
 * vuelve a pasar. Esto lo detecta.
 *
 * Uso: node scripts/check-price-guard.cjs
 * Sale con codigo 1 si algo se rompio, asi sirve en CI.
 */
const path = require("path");
const fs = require("fs");
const REPO = path.join(__dirname, "..");
const g = require(path.join(REPO, "scripts/lib/price-guard.cjs"));

let fallos = 0;
function ok(cond, msg) {
  console.log(`  ${cond ? "OK  " : "FALLA"}  ${msg}`);
  if (!cond) fallos++;
}
function hoyMas(dias) {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
}
const bloque = (v) => `    id: 'MLA1',\n    price: 100,\n${v ? `    priceVerifiedAt: '${v}',\n` : ""}  },`;

console.log("\n=== diasDesde / estaProtegido: casos borde ===");
ok(g.diasDesde(null) === Infinity, "fecha ausente -> Infinity (no protege)");
ok(g.diasDesde("no-es-fecha") === Infinity, "fecha invalida -> Infinity (no protege)");
ok(g.diasDesde(hoyMas(0)) === 0, "verificado hoy -> 0 dias");
ok(g.diasDesde(hoyMas(5)) < 0, "fecha FUTURA -> negativo");

ok(g.estaProtegido(bloque(hoyMas(0))) === true, "verificado hoy -> PROTEGIDO");
ok(g.estaProtegido(bloque(hoyMas(-7))) === true, `exactamente ${g.PROTECCION_MANUAL_DIAS}d -> PROTEGIDO (limite inclusivo)`);
ok(g.estaProtegido(bloque(hoyMas(-8))) === false, "8 dias -> ya NO protegido (caduco)");
ok(g.estaProtegido(bloque(null)) === false, "sin marca -> NO protegido");
ok(g.estaProtegido(bloque("basura")) === false, "marca invalida -> NO protegido (no bloquea el pipeline)");
ok(g.estaProtegido(bloque(hoyMas(5))) === true, "fecha futura -> PROTEGIDO (no se cuela por el borde)");
ok(g.estaProtegido(bloque(hoyMas(0)), { forzar: true }) === false, "--force-manual-price desactiva la proteccion");

console.log("\n=== bloqueDeProducto sobre el catalogo REAL ===");
const src = fs.readFileSync(path.join(REPO, "src/data/curated-products.ts"), "utf8");
const ids = [...src.matchAll(/^    id: ['"]([^'"]+)['"],/gm)].map((m) => m[1]);
ok(ids.length > 500, `el catalogo tiene ${ids.length} productos`);

let bloquesMal = 0;
for (const id of ids) {
  const b = g.bloqueDeProducto(src, id);
  // Cada bloque tiene que contener SU id y ningun otro id de nivel producto.
  const idsDentro = [...b.matchAll(/^    id: ['"]([^'"]+)['"],/gm)].map((m) => m[1]);
  if (idsDentro.length !== 1 || idsDentro[0] !== id) bloquesMal++;
}
ok(bloquesMal === 0, `ningun bloque se come a otro producto (${bloquesMal} mal de ${ids.length})`);

const ultimo = g.bloqueDeProducto(src, ids[ids.length - 1]);
ok(!ultimo.includes("categoryPastels"), "el ULTIMO producto no arrastra lo que viene despues del array");

console.log("\n=== los scripts que escriben precio importan el guard ===");
for (const f of [
  "apply-brightdata-prices.cjs",
  "apply-pending-prices.cjs",
  "apply-perfume-prices.cjs",
  "sync-perfume-prices-2026-04-20.cjs",
  "update-prices-from-ml.cjs",
  "mark-stale-prices.cjs",
]) {
  const s = fs.readFileSync(path.join(REPO, "scripts", f), "utf8");
  ok(s.includes("price-guard.cjs"), `${f} requiere el guard`);
}
const bs = fs.readFileSync(path.join(REPO, "scripts/batch-scrape.ts"), "utf8");
ok(bs.includes("si-quiero-regenerar-todo"), "batch-scrape.ts aborta sin confirmacion explicita");

console.log(fallos === 0 ? "\nTODO OK\n" : `\n${fallos} FALLAS\n`);
process.exit(fallos === 0 ? 0 : 1);
