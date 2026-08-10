#!/usr/bin/env node
/**
 * check-catalogo-fresco.cjs
 *
 * Detecta cuando el CATALOGO dejo de reflejar la realidad de MercadoLibre.
 *
 * Por que existe: el 2026-08-07 el workflow de precios se rompio en silencio
 * y el catalogo quedo congelado cinco dias. Los nueve scripts de check que ya
 * tenia el repo siguieron dando verde TODOS esos dias, porque comparan el
 * sitio contra el catalogo (coherencia interna) y el catalogo era coherente
 * consigo mismo: solo estaba viejo. Cuando se destapo, habia desvios de hasta
 * +107% (el Liliana VTHI513 mostraba $105.990 y valia $219.429) y productos
 * presentados como recomendacion #1 que no se podian comprar.
 *
 * Este script cubre el hueco: no chequea coherencia, chequea FRESCURA.
 *
 * NO scrapea nada. Solo lee los dos archivos de datos del repo, asi que corre
 * gratis en CI y no toca el limite de MercadoLibre (que ademas prohibe el
 * scraping en su clausula 12, y por eso el volumen que si se scrapea se
 * mantiene chico y desde Argentina).
 *
 * Lo que hace en cambio es decir QUE verificar y en que orden, para que la
 * verificacion en vivo (Bright Data o navegador) se gaste en las fichas que
 * mueven plata y no en las 576 del catalogo.
 *
 * Tres detecciones:
 *
 *   1. PIPELINE CONGELADO (critico). Si el priceLastChecked MAS RECIENTE de
 *      todo el catalogo tiene mas de --dias-pipeline dias, nadie escribio el
 *      catalogo en ese tiempo: el workflow esta roto o dejo de correr. Es la
 *      senal que falto en agosto y la mas barata de todas, porque un solo
 *      numero delata el problema entero.
 *
 *   2. SIN STOCK EN ROL CRITICO (critico). Un producto out_of_stock que es
 *      recomendacion #1, ranking #1, ancla de precio del standfirst o
 *      quickPick de una guia PUBLICADA. La guia esta mandando gente a algo
 *      que no se puede comprar.
 *
 *   3. DATOS VIEJOS EN ALTO IMPACTO (aviso). Fichas que aparecen en guias
 *      publicadas con priceLastChecked de mas de --dias-ficha dias,
 *      ordenadas por impacto para que la lista de verificacion venga
 *      priorizada sola.
 *
 * Uso:
 *   node scripts/check-catalogo-fresco.cjs                # reporte completo
 *   node scripts/check-catalogo-fresco.cjs --lista        # solo permalinks a verificar
 *   node scripts/check-catalogo-fresco.cjs --dias-pipeline 4 --dias-ficha 21
 *   node scripts/check-catalogo-fresco.cjs --hoy 2026-08-10   # para tests
 *
 * Sale con codigo 1 si hay algo CRITICO. Los avisos no rompen el build.
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const P_PATH = path.join(ROOT, "src", "data", "curated-products.ts");
const G_PATH = path.join(ROOT, "src", "data", "guides.ts");

// ── argumentos ────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const opt = (name, def) => {
  const i = argv.indexOf(`--${name}`);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : def;
};

// El workflow de precios corre 3x/semana, asi que mas de 4 dias sin escribir
// el catalogo ya es anomalo aunque el workflow no haya "fallado" formalmente.
const DIAS_PIPELINE = Number(opt("dias-pipeline", 4));
const DIAS_FICHA = Number(opt("dias-ficha", 21));
const SOLO_LISTA = flag("lista");
const HOY = opt("hoy", new Date().toISOString().slice(0, 10));

const dias = (fecha) => {
  if (!fecha) return Infinity;
  const ms = Date.parse(HOY) - Date.parse(fecha);
  return Number.isFinite(ms) ? Math.floor(ms / 86400000) : Infinity;
};

// ── parseo ────────────────────────────────────────────────────────────────
// Se corta por INDENTACION exacta (4 espacios), no por /id:/ suelto: hay ids
// anidados dentro de structuredData y relatedProducts, y un regex ingenuo hace
// que un "bloque" se coma decenas de productos. Ya paso: un cruce mal parseado
// reporto 48 productos sin stock y 43 guias afectadas, dos numeros inventados
// por el parser.
function bloques(texto, campo) {
  const lineas = texto.split("\n");
  const re = new RegExp(`^    ${campo}: ["']([^"']+)["']`);
  const marcas = [];
  lineas.forEach((l, i) => {
    const m = l.match(re);
    if (m) marcas.push({ clave: m[1], i });
  });
  return marcas.map((m, k) => ({
    clave: m.clave,
    texto: lineas.slice(m.i, k + 1 < marcas.length ? marcas[k + 1].i : lineas.length).join("\n"),
  }));
}

const campo = (txt, nombre) => {
  const m = txt.match(new RegExp(`^\\s*${nombre}: ["']?([^,"'\\n]+)`, "m"));
  return m ? m[1].trim() : null;
};

const productosSrc = fs.readFileSync(P_PATH, "utf8");
const productos = new Map();
for (const b of bloques(productosSrc, "id")) {
  productos.set(b.clave, {
    id: b.clave,
    nombre: campo(b.texto, "canonicalName") || campo(b.texto, "title") || "(sin nombre)",
    precio: Number(campo(b.texto, "price")) || null,
    estado: campo(b.texto, "priceStatus"),
    chequeado: campo(b.texto, "priceLastChecked"),
    permalink: campo(b.texto, "permalink"),
  });
}

const guiasSrc = fs.readFileSync(G_PATH, "utf8");
const guias = bloques(guiasSrc, "slug")
  .map((g) => ({ slug: g.clave, texto: g.texto, fecha: campo(g.texto, "publishedDate") }))
  .filter((g) => g.fecha && g.fecha <= HOY); // misma regla de publicacion que el sitio

// ── roles: donde aparece cada producto dentro de una guia ─────────────────
// El peso es lo que decide el orden de la lista de verificacion. Un producto
// que es la recomendacion #1 de un pilar cuesta mucho mas caro que una mencion
// suelta en el cuerpo.
const ROLES = [
  { nombre: "RECOMENDACION #1", peso: 100, test: (t, id) => enCampo(t, "directAnswer", id) },
  { nombre: "ANCLA DE PRECIO", peso: 90, test: (t, id) => enCampo(t, "standfirst", id) },
  { nombre: "ranking #1", peso: 80, test: (t, id) => rankingDe(t, id) === 1 },
  { nombre: "quickPick", peso: 60, test: (t, id) => enLista(t, "quickPicks", id) },
  { nombre: "ranking top-3", peso: 40, test: (t, id) => [2, 3].includes(rankingDe(t, id)) },
  { nombre: "tabla", peso: 20, test: (t, id) => enTabla(t, id) },
];

function enCampo(txt, nombre, id) {
  const m = txt.match(new RegExp(`${nombre}: \`[\\s\\S]*?\`,\\n`));
  return Boolean(m && m[0].includes(id));
}
function enLista(txt, nombre, id) {
  const m = txt.match(new RegExp(`${nombre}: \\[[\\s\\S]*?\\n    \\],`));
  return Boolean(m && m[0].includes(id));
}
function rankingDe(txt, id) {
  const m = txt.match(new RegExp(`productMlaId: ["']${id}["'][^}]*ranking: (\\d+)`));
  return m ? Number(m[1]) : null;
}
function enTabla(txt, id) {
  return txt.split(/type: "table"/).slice(1).some((s) => s.slice(0, 3000).includes(id));
}

const apariciones = [];
for (const g of guias) {
  for (const [id, p] of productos) {
    if (!g.texto.includes(id)) continue;
    const roles = ROLES.filter((r) => r.test(g.texto, id));
    apariciones.push({
      guia: g.slug,
      producto: p,
      roles: roles.length ? roles.map((r) => r.nombre) : ["mencion suelta"],
      peso: roles.length ? Math.max(...roles.map((r) => r.peso)) : 5,
    });
  }
}

// ── 1. pipeline congelado ─────────────────────────────────────────────────
const fechas = [...productos.values()].map((p) => p.chequeado).filter(Boolean).sort();
const ultimaEscritura = fechas[fechas.length - 1] || null;
const diasSinEscribir = dias(ultimaEscritura);
const pipelineCongelado = diasSinEscribir > DIAS_PIPELINE;

// ── 2. sin stock en rol critico ───────────────────────────────────────────
const CRITICO = /RECOMENDACION #1|ANCLA DE PRECIO|ranking #1|quickPick/;
const sinStockCritico = apariciones.filter(
  (a) => a.producto.estado === "out_of_stock" && a.roles.some((r) => CRITICO.test(r))
);

// ── 3. datos viejos en alto impacto ───────────────────────────────────────
// Se queda con la aparicion de mayor peso por producto: lo que importa es el
// rol mas caro que ocupa, no en cuantas guias esta.
const porProducto = new Map();
for (const a of apariciones) {
  const prev = porProducto.get(a.producto.id);
  if (!prev || a.peso > prev.peso) porProducto.set(a.producto.id, a);
}
const viejos = [...porProducto.values()]
  .filter((a) => a.producto.estado !== "out_of_stock" && dias(a.producto.chequeado) > DIAS_FICHA)
  .sort((a, b) => b.peso - a.peso || dias(b.producto.chequeado) - dias(a.producto.chequeado));

// ── salida ────────────────────────────────────────────────────────────────
if (SOLO_LISTA) {
  // Modo para pegarle a Bright Data o al navegador: solo permalinks, ya
  // priorizados. Primero lo critico, despues lo viejo.
  const urls = [
    ...sinStockCritico.map((a) => a.producto.permalink),
    ...viejos.map((a) => a.producto.permalink),
  ].filter(Boolean);
  console.log([...new Set(urls)].join("\n"));
  process.exit(0);
}

const money = (n) => (n ? "$" + n.toLocaleString("es-AR") : "?");
let critico = false;

console.log(`\ncheck-catalogo-fresco — ${HOY}`);
console.log(`${productos.size} productos · ${guias.length} guías publicadas · ${apariciones.length} apariciones\n`);

console.log("[1] PIPELINE");
if (!ultimaEscritura) {
  critico = true;
  console.log("  ✗ CRÍTICO: ninguna ficha tiene priceLastChecked. El catálogo nunca se verificó.");
} else if (pipelineCongelado) {
  critico = true;
  console.log(`  ✗ CRÍTICO: hace ${diasSinEscribir} días que no se escribe el catálogo (última: ${ultimaEscritura}).`);
  console.log(`    El workflow de precios corre 3x/semana. Más de ${DIAS_PIPELINE} días significa que está roto o no corre.`);
  console.log(`    Revisar: gh run list --workflow="Actualizar precios via Bright Data"`);
} else {
  console.log(`  ✓ Última escritura hace ${diasSinEscribir} día(s) (${ultimaEscritura}).`);
}

console.log("\n[2] SIN STOCK EN ROL CRÍTICO");
if (sinStockCritico.length === 0) {
  console.log("  ✓ Ninguna guía publicada recomienda un producto sin stock en un rol principal.");
} else {
  critico = true;
  console.log(`  ✗ CRÍTICO: ${sinStockCritico.length} caso(s). La guía manda gente a algo que no se puede comprar.\n`);
  for (const a of sinStockCritico) {
    console.log(`    ${a.guia}`);
    console.log(`      ${a.producto.id} ${a.producto.nombre.slice(0, 46)}`);
    console.log(`      ${a.roles.join(" | ")}`);
  }
}

console.log(`\n[3] DATOS DE MÁS DE ${DIAS_FICHA} DÍAS EN GUÍAS PUBLICADAS`);
if (viejos.length === 0) {
  console.log("  ✓ Ninguna ficha con rol en guías tiene datos viejos.");
} else {
  console.log(`  ${viejos.length} ficha(s), ordenadas por impacto. Ésta es la cola de verificación:\n`);
  for (const a of viejos.slice(0, 25)) {
    const d = dias(a.producto.chequeado);
    console.log(
      `    ${String(d).padStart(3)}d  ${money(a.producto.precio).padStart(12)}  ${a.roles[0].padEnd(17)}  ${a.guia}`
    );
    console.log(`          ${a.producto.id} ${a.producto.nombre.slice(0, 50)}`);
  }
  if (viejos.length > 25) console.log(`\n    … y ${viejos.length - 25} más. Correr con --lista para los permalinks.`);
}

console.log("");
if (critico) {
  console.log("RESULTADO: hay problemas CRÍTICOS. El catálogo no refleja la realidad.\n");
  process.exit(1);
}
console.log("RESULTADO: catálogo fresco.\n");
