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
 * El conteo no es solo "numero + palabra de reseñas". Al 2026-08-17 se sumaron
 * tres familias mas que envejecen igual de mal y se le escapaban al trinquete:
 *
 *   - "los 7.137 compradores"        (la palabra es compradores, no opiniones)
 *   - "68 opiniones contra 3.846"    (el SEGUNDO numero de una comparacion)
 *   - "las 6.131 de la Escorial"     (el numero queda suelto, sin la palabra)
 *
 * La tercera es la delicada: "las 300 del Kann Livet" tambien son kilos y "las
 * 980 del album" tambien son figuritas. Por eso no alcanza la forma, y se pide
 * ademas una palabra de reseñas cerca (VENTANA chars antes). Es el precio de no
 * llenar el baseline de falsos positivos que despues nadie sabe si son deuda.
 *
 * Cuando cambian los PATRONES hay que subir VERSION. El techo viejo conto otra
 * cosa, asi que deja de ser comparable: con la version cambiada, `--bajar` deja
 * recalibrar UNA vez hacia arriba. Fuera de ese caso sigue negandose a subir.
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

const PALABRA = "(?:reseñas|reseña|opiniones|opinión|calificaciones|valoraciones)";
// El numero tiene que terminar en digito: si no, "…4,7. Compradores confirman"
// se lee como el numero "7." pegado a la palabra.
const NUM = "([0-9](?:[0-9.]{0,8}[0-9])?)";
// Igual pero de dos caracteres para arriba. Un digito solo en la forma "las N
// de …" casi nunca es un conteo de reseñas y sí suele ser otra cosa ("las 3 de
// esta guía", "no las 8 de la ficha").
const NUM2 = "([0-9][0-9.]{0,8}[0-9])";

// Subir cuando cambian los PATRONES: el techo guardado deja de ser comparable
// con el nuevo conteo y `--bajar` habilita UNA recalibracion (ver mas abajo).
const VERSION = 2;

// Cada patron captura en el grupo 1 el numero hardcodeado. `contexto: true`
// significa que la forma sola es ambigua y hace falta una palabra de reseñas
// cerca para contarlo.
const PATRONES = [
  // "4.486 opiniones"
  { re: new RegExp(`${NUM}\\s*${PALABRA}`, "gi") },
  // "respaldo de reseñas (4.486 contra ...)"
  { re: new RegExp(`${PALABRA}\\s*\\(${NUM}\\s*contra`, "gi") },
  // "los 7.137 compradores", "las 6.632 compradoras", "4.8⭐ con 770 compradores"
  { re: new RegExp(`${NUM}\\s*compradora?e?s\\b`, "gi") },
  // "68 opiniones contra 3.846", "12.296 calificaciones contra las 350"
  { re: new RegExp(`${PALABRA}\\s+contra\\s+(?:las?|los)?\\s*${NUM}`, "gi") },
  // "las 6.131 de la Escorial", "las 8.942 del Calm", "las 155 de la Devoto"
  { re: new RegExp(`\\blas\\s+${NUM2}\\s+de(?:l|\\s+(?:la|las|los))?\\s+`, "gi"), contexto: true },
];

// "mas de 4.100 opiniones" y amigos: aproximados a proposito, no son deuda.
const APROX = /(m[áa]s de|cerca de|casi|arriba de|unas|unos|superan?(?: las| los)?)\s*$/i;
// Cuanto se mira hacia atras buscando la palabra de reseñas en los patrones
// ambiguos. 200 alcanza para "9 opiniones. Contra las 1.159 de la tripode
// nordica o las 155 de la Devoto" (el segundo numero queda lejos de la palabra).
const VENTANA = 200;
const CERCA = new RegExp(`${PALABRA}|compradora?e?s`, "i");

function contar(archivo) {
  const src = fs.readFileSync(path.join(ROOT, archivo), "utf8");
  // Un mismo numero puede caer en dos patrones ("calificaciones contra las
  // 2.221 del Gadnic" es CONTRA y tambien la forma "las N de/del"): se cuenta
  // por posicion del numero, no por cantidad de matches.
  const posiciones = new Set();
  for (const { re, contexto } of PATRONES) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(src)) !== null) {
      const pos = m.index + m[0].indexOf(m[1]);
      const antes = src.slice(Math.max(0, pos - VENTANA), pos).replace(/\s+/g, " ");
      if (APROX.test(antes)) continue;
      if (contexto && !CERCA.test(antes)) continue;
      posiciones.add(pos);
    }
  }
  return posiciones.size;
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

// Un techo de una VERSION anterior conto otros patrones: no es comparable con
// el conteo de hoy. En ese caso `--bajar` puede subirlo UNA vez, para dejar el
// trinquete armado de nuevo sobre la definicion nueva.
const recalibrar = !!techo && techo.version !== VERSION;

if (!techo || bajar) {
  const previo = techo ? techo.total : null;
  if (bajar && previo !== null && total > previo && !recalibrar) {
    console.error(`✖ --bajar no puede SUBIR el techo (${previo} -> ${total}).`);
    console.error(`  Migrá las menciones nuevas a {{reviews:ID}} en vez de subir el techo.`);
    process.exit(1);
  }
  fs.writeFileSync(
    BASELINE,
    JSON.stringify({ version: VERSION, total, porArchivo: actual }, null, 2) + "\n"
  );
  if (previo === null) console.log(`Baseline creado: ${total}`);
  else if (total > previo) {
    console.log(`Techo recalibrado por cambio de patrones (v${techo.version ?? 1} -> v${VERSION}): ${previo} -> ${total}.`);
    console.log(`  Ojo: recalibrar CONGELA la deuda que haya hoy. Si entró deuda nueva`);
    console.log(`  desde el último techo, queda adentro y el trinquete deja de verla.`);
  } else console.log(`Techo bajado: ${previo} -> ${total}`);
  process.exit(0);
}

if (recalibrar) {
  console.log(`Los patrones cambiaron (baseline v${techo.version ?? 1}, script v${VERSION}):`);
  console.log(`  el techo guardado (${techo.total}) no es comparable con el conteo de hoy (${total}).`);
  console.log(`  Recalibrá una vez:  node scripts/check-hardcoded-reviews.cjs --bajar`);
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
