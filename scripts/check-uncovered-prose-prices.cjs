#!/usr/bin/env node
/**
 * check-uncovered-prose-prices.cjs
 *
 * Trinquete sobre los precios escritos a mano que check-stale-prose-prices.cjs
 * NO PUEDE verificar. El techo solo puede bajar, nunca subir.
 *
 * Por que existe: check-stale-prose-prices solo compara lineas donde el precio
 * Y el producto son resolubles en la MISMA linea (via link meli.la o id MLA).
 * Un precio suelto en un parrafo de prosa, sin link, es invisible para ese
 * chequeo. El 2026-08-24 aparecieron dos casos reales por casualidad, no por
 * sistema: aire-acondicionado-portatil decia $630.000 para un producto de
 * $848.550 (25,8% de error) y cafetera-dolce-gusto decia $155.132 para uno de
 * $143.045 (8,4%). Los dos pasaron el chequeo en verde.
 *
 * Por que NO intenta adivinar el producto: se probo resolverlo por el codigo de
 * modelo que menciona el texto (PHP35HC7API y similares) y la tasa de falsos
 * positivos fue alta, porque un parrafo sobre el producto A menciona seguido el
 * codigo del producto B para compararlos. Ejemplos reales de ese intento: un
 * parrafo sobre la JBL Tune 770NC quedo asociado a un Sony, y otro que decia
 * "Es la respuesta de Liliana a la Smartlife SL-EC8501" quedo asociado a la
 * Smartlife cuando el precio era el de la Liliana. Un chequeo que grita falsas
 * alarmas es peor que uno ciego: entrena a ignorarlo.
 *
 * Entonces este script NO afirma que esos precios esten mal. Afirma algo mas
 * chico y 100% cierto: que NO ESTAN CUBIERTOS por ninguna verificacion
 * automatica. La solucion de fondo es tokenizarlos con {{precio:ID}}, y
 * mientras tanto el trinquete evita que la deuda crezca.
 *
 * Que NO cuenta (no son claims de precio de un producto):
 *   - tramos y rangos ("mas de $1.500.000", "de $41.000 a $210.000")
 *   - metricas por unidad ("$5.449 el litro") y comparativos ("el mas caro")
 *   - lineas con 2+ precios (comparaciones, tablas de tramos)
 *   - lineas que ya usan un token {{precio...}}
 *   - notacion $K, fragil por diseno
 *
 * Cuando cambian los PATRONES hay que subir VERSION: el techo viejo conto otra
 * cosa y deja de ser comparable, y `--bajar` habilita UNA recalibracion.
 *
 * Uso:
 *   node scripts/check-uncovered-prose-prices.cjs           # chequea
 *   node scripts/check-uncovered-prose-prices.cjs --listar  # muestra la lista
 *   node scripts/check-uncovered-prose-prices.cjs --bajar   # baja el techo a hoy
 */
const fs = require("node:fs");
const path = require("node:path");

const VERSION = 1;
const ROOT = path.join(__dirname, "..");
const BASELINE = path.join(__dirname, "uncovered-prose-prices-baseline.json");
const G_PATH = path.join(ROOT, "src", "data", "guides.ts");
const P_PATH = path.join(ROOT, "src", "data", "curated-products.ts");

const productsSrc = fs.readFileSync(P_PATH, "utf8");
const meliCodes = new Set([...productsSrc.matchAll(/meli\.la\/(\w+)/g)].map((m) => m[1]));

const PRICE = /\$\d{1,3}(?:\.\d{3})+/g;
const RANGO = /\bde\s+\$[\d.]+\s+(?:a|hasta)\b|\bentre\s+\$|\bm[aá]s de\s+\$|\bmenos de\s+\$|\bdesde\s+\$|\barriba de\s+\$|\babajo de\s+\$|\bhasta\s+\$/i;
const METRICA = /\bel litro\b|\bpor (?:litro|metro|persona|mes|d[ií]a|unidad|plaza)\b|\bTotal:|\bde diferencia\b|m[aá]s (?:caro|barat|cara)|menos que|el m[aá]s\b|la m[aá]s\b|tope de gama|doble que|Entrada \(|Medio \(|Premium \(/i;

function resoluble(linea) {
  if (/\bMLA\d+/.test(linea)) return true;
  for (const c of meliCodes) if (linea.includes(`meli.la/${c}`)) return true;
  return false;
}

const lineas = fs.readFileSync(G_PATH, "utf8").split("\n");
const sinCubrir = [];
for (let i = 0; i < lineas.length; i++) {
  const l = lineas[i];
  if (l.includes("{{precio")) continue;
  const ps = l.match(PRICE);
  if (!ps) continue;
  if (/\$\d+\s*[Kk]\b/.test(l)) continue;
  if (ps.length > 1) continue;
  if (METRICA.test(l) || RANGO.test(l)) continue;
  if (resoluble(l)) continue; // esa la cubre check-stale-prose-prices
  sinCubrir.push({ linea: i + 1, precio: ps[0], texto: l.trim().slice(0, 120) });
}
const total = sinCubrir.length;

if (process.argv.includes("--listar")) {
  console.log(`Precios a mano SIN cobertura automatica: ${total}\n`);
  for (const s of sinCubrir) console.log(`  L${String(s.linea).padEnd(7)} ${s.precio.padEnd(12)} ${s.texto}`);
  process.exit(0);
}

const bajar = process.argv.includes("--bajar");
let techo = null;
if (fs.existsSync(BASELINE)) techo = JSON.parse(fs.readFileSync(BASELINE, "utf8"));
const recalibrar = !!techo && techo.version !== VERSION;

if (!techo || bajar) {
  const previo = techo ? techo.total : null;
  if (bajar && previo !== null && total > previo && !recalibrar) {
    console.error(`✖ --bajar no puede SUBIR el techo (${previo} -> ${total}).`);
    console.error(`  Tokenizá los precios nuevos con {{precio:ID}} en vez de subir el techo.`);
    process.exit(1);
  }
  fs.writeFileSync(BASELINE, JSON.stringify({ version: VERSION, total }, null, 2) + "\n");
  if (previo === null) console.log(`Baseline creado: ${total} precios sin cobertura.`);
  else if (total > previo) console.log(`Techo recalibrado (v${techo.version ?? 1} -> v${VERSION}): ${previo} -> ${total}.`);
  else console.log(`Techo bajado: ${previo} -> ${total}`);
  process.exit(0);
}

if (recalibrar) {
  console.log(`Los patrones cambiaron (baseline v${techo.version ?? 1}, script v${VERSION}):`);
  console.log(`  el techo guardado (${techo.total}) no es comparable con el de hoy (${total}).`);
  console.log(`  Recalibrá una vez:  node scripts/check-uncovered-prose-prices.cjs --bajar`);
  process.exit(0);
}

if (total > techo.total) {
  console.error(`✖ Entraron ${total - techo.total} precio(s) a mano nuevos sin cobertura (techo ${techo.total}, hoy ${total}).`);
  console.error(`  Estos precios NO los verifica ningún chequeo: si el producto cambia, quedan viejos y nadie se entera.`);
  console.error(`  Tokenizalos con {{precio:ID}}. Para ver cuáles:`);
  console.error(`    node scripts/check-uncovered-prose-prices.cjs --listar`);
  process.exit(1);
}
console.log(`Precios a mano sin cobertura automática: ${total} (techo ${techo.total}).`);
if (total < techo.total) {
  console.log(`✓ Bajó ${techo.total - total}. Fijá el techo nuevo:`);
  console.log(`  node scripts/check-uncovered-prose-prices.cjs --bajar`);
} else {
  console.log(`✓ No entró deuda nueva.`);
}
process.exit(0);
