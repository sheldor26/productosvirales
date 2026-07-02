#!/usr/bin/env npx tsx
/**
 * Genera todos los CSV de Pinterest de un comando, sin levantar el server.
 * Un archivo por TABLERO (agrupa por el board real de cada Pin, así nada queda
 * afuera), listo para arrastrar al importador "Cargá un CSV o TXT" de Pinterest.
 * Reusa la misma lógica que la ruta /api/pinterest-feed (src/lib/pinterest-feed.ts).
 *
 * Uso:
 *   npx tsx scripts/pinterest-csv.ts                 # -> ~/Downloads/pinterest/
 *   npx tsx scripts/pinterest-csv.ts --out ./pins    # carpeta destino
 *   npx tsx scripts/pinterest-csv.ts --porDia 5      # escalona 5 Pins/día
 *   npx tsx scripts/pinterest-csv.ts --match cocina  # solo esa categoría/silo
 *
 * Recordatorio: el nombre del tablero en Pinterest tiene que EXISTIR y coincidir
 * con el board de cada CSV (Gaming, Cocina, ...) o Pinterest descarta esas filas.
 */
import { mkdirSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import { buildPins, pinsToCsv, type Pin } from "../src/lib/pinterest-feed";

const args = process.argv.slice(2);
function flag(name: string): string | undefined {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : undefined;
}

const outDir = path.resolve(flag("out") || path.join(os.homedir(), "Downloads", "pinterest"));
const porDia = Number(flag("porDia")) || 0;
const match = flag("match");

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

mkdirSync(outDir, { recursive: true });

// Limpiamos CSV de corridas anteriores (ej. tableros que se consolidaron) para
// que la carpeta refleje siempre el estado actual, sin duplicados sueltos.
if (!match) {
  for (const f of readdirSync(outDir)) {
    if (/^pinterest-.*\.csv$/.test(f)) rmSync(path.join(outDir, f));
  }
}

// Un solo build; agrupamos por el tablero real de cada Pin (nada queda afuera).
const pins = buildPins(match ? { categoria: match } : {});
const groups = new Map<string, Pin[]>();
for (const p of pins) {
  const arr = groups.get(p.board);
  if (arr) arr.push(p);
  else groups.set(p.board, [p]);
}

let files = 0;
for (const [board, ps] of [...groups].sort((a, b) => b[1].length - a[1].length)) {
  const file = path.join(outDir, `pinterest-${slugify(board)}.csv`);
  writeFileSync(file, pinsToCsv(ps, porDia), "utf8");
  console.log(`  ${board.padEnd(18)} ${String(ps.length).padStart(3)} Pins  ->  ${file}`);
  files += 1;
}

console.log(`\n${files} tableros, ${pins.length} Pins en ${outDir}`);
if (porDia > 0) console.log(`Fechas escalonadas: ${porDia} Pins/día desde mañana.`);
