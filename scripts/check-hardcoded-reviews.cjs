#!/usr/bin/env node
/**
 * check-hardcoded-reviews.cjs
 *
 * Cuenta las menciones de reseñas con numero tipeado a mano ("4.486 opiniones")
 * y falla si SUBEN respecto al maximo registrado. Es un trinquete: la deuda
 * puede bajar, nunca subir.
 *
 * Por que un trinquete y no un check comun: al 2026-08-13 hay ~700 menciones
 * hardcodeadas repartidas en 130+ guias. Un check que falle por todas seria
 * ruido que se termina ignorando; uno que solo mire lo NUEVO deja que la deuda
 * baje sola a medida que se tocan las guias, y evita que crezca mientras tanto.
 *
 * El numero exacto envejece mal: la guia de teclados decia "4.486 opiniones"
 * cuando el catalogo ya iba en 4.585. Para eso estan {{reviews:ID}} y
 * {{rating:ID}} (ver src/lib/price-token.ts y docs/guias.md).
 *
 * NO cuenta los aproximados ("mas de 4.100 opiniones"): esos envejecen bien,
 * siguen siendo verdad cuando el conteo sube, y no hay que tokenizarlos.
 *
 * Uso:
 *   node scripts/check-hardcoded-reviews.cjs            # chequea
 *   node scripts/check-hardcoded-reviews.cjs --bajar    # baja el techo a lo que haya hoy
 */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const BASELINE = path.join(__dirname, "hardcoded-reviews-baseline.json");
const ARCHIVOS = ["src/data/guides.ts", "src/data/curated-products.ts"];

// Numero pegado a una palabra de reseñas, en cualquiera de los dos ordenes:
// "4.486 opiniones" y "respaldo de reseñas (4.486 contra ...)".
const PALABRA = "(?:reseñas|reseña|opiniones|opinión|calificaciones|valoraciones)";
const DESPUES = new RegExp(`([0-9][0-9.]{0,9})\\s*${PALABRA}`, "gi");
const ANTES = new RegExp(`${PALABRA}\\s*\\(([0-9][0-9.]{0,9})\\s*contra`, "gi");
// "mas de 4.100 opiniones" y amigos: aproximados a proposito, no son deuda.
const APROX = /(m[áa]s de|cerca de|casi|arriba de|unas|unos|superan?(?: las| los)?)\s*$/i;

function contar(archivo) {
  const src = fs.readFileSync(path.join(ROOT, archivo), "utf8");
  let n = 0;
  for (const re of [DESPUES, ANTES]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(src)) !== null) {
      const antes = src.slice(Math.max(0, m.index - 40), m.index);
      if (APROX.test(antes.replace(/\s+/g, " "))) continue;
      n++;
    }
  }
  return n;
}

const actual = {};
let total = 0;
for (const a of ARCHIVOS) {
  actual[a] = contar(a);
  total += actual[a];
}

const bajar = process.argv.includes("--bajar");
let techo = null;
if (fs.existsSync(BASELINE)) techo = JSON.parse(fs.readFileSync(BASELINE, "utf8"));

if (!techo || bajar) {
  const previo = techo ? techo.total : null;
  if (bajar && previo !== null && total > previo) {
    console.error(`✖ --bajar no puede SUBIR el techo (${previo} -> ${total}).`);
    console.error(`  Migrá las menciones nuevas a {{reviews:ID}} en vez de subir el techo.`);
    process.exit(1);
  }
  fs.writeFileSync(BASELINE, JSON.stringify({ total, porArchivo: actual }, null, 2) + "\n");
  console.log(previo === null ? `Baseline creado: ${total}` : `Techo bajado: ${previo} -> ${total}`);
  process.exit(0);
}

for (const a of ARCHIVOS) {
  const d = actual[a] - (techo.porArchivo[a] ?? 0);
  const señal = d > 0 ? `+${d} NUEVAS` : d < 0 ? `${d} migradas` : "sin cambios";
  console.log(`  ${a}: ${actual[a]} (${señal})`);
}

if (total > techo.total) {
  console.error(`\n✖ Menciones de reseñas hardcodeadas: ${techo.total} -> ${total} (+${total - techo.total}).`);
  console.error(`  Usá {{reviews:ID}} y {{rating:ID}} en vez de tipear el número.`);
  console.error(`  Si son aproximados a propósito, escribilos como "más de N" y no cuentan.`);
  console.error(`  Detalle de la regla: docs/guias.md`);
  process.exit(1);
}

if (total < techo.total) {
  console.log(`\n✓ Bajó de ${techo.total} a ${total}. Fijá el techo nuevo:`);
  console.log(`  node scripts/check-hardcoded-reviews.cjs --bajar`);
} else {
  console.log(`\n✓ Sin menciones nuevas (techo: ${techo.total}).`);
}
