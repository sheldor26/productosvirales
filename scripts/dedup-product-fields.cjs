#!/usr/bin/env node
/**
 * dedup-product-fields.cjs
 * Quita campos duplicados dentro de cada bloque de producto en curated-products.ts.
 * Conserva la PRIMERA aparición (la original curada) y elimina las posteriores.
 * Maneja campos de una línea y multilínea (arrays [...] y articleBody `...`).
 */
const fs = require("node:fs");
const path = require("node:path");
const FILE = path.join(__dirname, "..", "src", "data", "curated-products.ts");
const FIELDS = ["seoTitle", "metaDescription", "verdict", "pros", "cons", "articleBody", "faq"];

let lines = fs.readFileSync(FILE, "utf8").split("\n");

function blockBounds() {
  const idxs = [];
  for (let i = 0; i < lines.length; i++) if (/^\s{4}id:\s*['"]MLA\w+['"]/.test(lines[i])) idxs.push(i);
  return idxs;
}
function fieldExtent(start, field) {
  const line = lines[start];
  const t = line.replace(/\s+$/, "");
  if (t.endsWith("[")) { // array
    for (let i = start + 1; i < lines.length; i++) if (lines[i] === "    ],") return [start, i];
  }
  if (field === "articleBody" && !/`,\s*$/.test(t)) { // backtick multilínea
    for (let i = start + 1; i < lines.length; i++) if (/`,\s*$/.test(lines[i])) return [start, i];
  }
  return [start, start]; // una línea
}

let removed = 0;
let changed = true;
while (changed) {
  changed = false;
  const idxs = blockBounds();
  for (let b = 0; b < idxs.length && !changed; b++) {
    const s = idxs[b], e = b + 1 < idxs.length ? idxs[b + 1] : lines.length;
    for (const f of FIELDS) {
      const starts = [];
      for (let i = s; i < e; i++) if (new RegExp("^\\s{4}" + f + ":").test(lines[i])) starts.push(i);
      if (starts.length > 1) {
        // eliminar la ÚLTIMA aparición (la que agregó el agente), conservar la primera
        const last = starts[starts.length - 1];
        const [a, z] = fieldExtent(last, f);
        lines.splice(a, z - a + 1);
        removed++;
        changed = true;
        break;
      }
    }
  }
}

fs.writeFileSync(FILE, lines.join("\n"), "utf8");
console.log("Campos duplicados eliminados:", removed);
