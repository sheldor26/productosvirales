#!/usr/bin/env node
/**
 * check-table-product-links.cjs
 *
 * REGLA OBLIGATORIA (docs/guias.md §5): en toda tabla comparativa cuyo primer
 * header sea "Modelo" o "Producto", el nombre del producto en cada fila TIENE
 * que ser un link markdown ([Nombre](https://meli.la/... o /producto/...)),
 * nunca texto plano. La tabla ya soporta esto (parseInlineLinks agrega
 * rel="sponsored" solo); si el nombre queda sin link, el lector no tiene forma
 * de hacer clic en esa fila.
 *
 * Parser real (no regex ingenuo): recorre el archivo char por char, respeta
 * strings (backtick/simple/doble, con escapes) para contar profundidad de
 * `[`/`]` y `{`/`}` correctamente. Evita falsos positivos con texto que
 * contiene comillas literales (ej. 22" de pulgadas) o secciones vecinas.
 *
 * Uso:  node scripts/check-table-product-links.cjs
 */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const GUIDES = path.join(ROOT, "src", "data", "guides.ts");
const src = fs.readFileSync(GUIDES, "utf8");

// Tokenizer minimo: devuelve la posicion de cierre de un string que arranca en `i`
// (src[i] es la comilla de apertura: ` ' o "), respetando escapes \x.
function skipString(s, i) {
  const q = s[i];
  i++;
  while (i < s.length) {
    if (s[i] === "\\") { i += 2; continue; }
    if (s[i] === q) return i + 1;
    i++;
  }
  return i;
}

// Devuelve el indice de cierre del bracket que abre en `openIdx` (s[openIdx] es '[' o '{'),
// contando profundidad y saltando strings.
function matchBracket(s, openIdx) {
  const open = s[openIdx];
  const close = open === "[" ? "]" : "}";
  let depth = 1;
  let i = openIdx + 1;
  while (i < s.length && depth > 0) {
    const c = s[i];
    if (c === "'" || c === '"' || c === "`") { i = skipString(s, i); continue; }
    if (c === open) depth++;
    else if (c === close) depth--;
    i++;
  }
  return i - 1; // indice del char de cierre
}

// Extrae el PRIMER string literal (backtick/simple/doble) dentro de un rango [start,end).
function firstStringLiteral(s, start, end) {
  let i = start;
  while (i < end) {
    const c = s[i];
    if (c === "'" || c === '"' || c === "`") {
      const closeIdx = skipString(s, i);
      return s.slice(i + 1, closeIdx - 1);
    }
    i++;
  }
  return null;
}

// Parte los elementos top-level de un array (contenido entre [ y ] ya identificado),
// respetando anidamiento y strings.
function splitTopLevelArrayItems(s, contentStart, contentEnd) {
  const items = [];
  let i = contentStart;
  let itemStart = -1;
  let depth = 0;
  while (i < contentEnd) {
    const c = s[i];
    if (c === "'" || c === '"' || c === "`") { i = skipString(s, i); continue; }
    if (c === "[" || c === "{" || c === "(") {
      if (depth === 0 && itemStart === -1) itemStart = i;
      depth++;
    } else if (c === "]" || c === "}" || c === ")") {
      depth--;
    } else if (c === "," && depth === 0) {
      if (itemStart !== -1) items.push([itemStart, i]);
      itemStart = -1;
    } else if (depth === 0 && itemStart === -1 && !/\s/.test(c)) {
      itemStart = i;
    }
    i++;
  }
  if (itemStart !== -1) items.push([itemStart, contentEnd]);
  return items;
}

const MODELO_HEADER_RE = /^(modelo|producto)$/i;
const slugMatches = [...src.matchAll(/slug:\s*[`"]([^`"]+)[`"]/g)];

function slugAt(idx) {
  let best = null;
  for (const m of slugMatches) {
    if (m.index <= idx) best = m[1];
    else break;
  }
  return best;
}

const problems = [];
const tableTagRe = /type:\s*[`"]table[`"]/g;
let tm;
while ((tm = tableTagRe.exec(src)) !== null) {
  // Encontrar el '{' que abre esta section (el mas cercano hacia atras) y su cierre.
  const openBrace = src.lastIndexOf("{", tm.index);
  const closeBrace = matchBracket(src, openBrace);
  const sectionSrc = src.slice(openBrace, closeBrace + 1);

  const headersIdx = sectionSrc.indexOf("headers:");
  const rowsIdx = sectionSrc.indexOf("rows:");
  if (headersIdx === -1 || rowsIdx === -1) continue;

  const headersOpen = sectionSrc.indexOf("[", headersIdx);
  const headersClose = matchBracket(sectionSrc, headersOpen);
  const firstHeader = firstStringLiteral(sectionSrc, headersOpen + 1, headersClose);
  if (!firstHeader || !MODELO_HEADER_RE.test(firstHeader.trim())) continue;

  const rowsOpen = sectionSrc.indexOf("[", rowsIdx);
  const rowsClose = matchBracket(sectionSrc, rowsOpen);
  const rowItems = splitTopLevelArrayItems(sectionSrc, rowsOpen + 1, rowsClose);

  const slug = slugAt(openBrace);
  for (const [rs, re] of rowItems) {
    if (sectionSrc[rs] !== "[") continue; // fila valida es un array
    const rowClose = matchBracket(sectionSrc, rs);
    const firstCell = firstStringLiteral(sectionSrc, rs + 1, rowClose);
    if (firstCell === null || firstCell.trim() === "") continue;

    const linkMatch = firstCell.match(/\[[^\]]+\]\(([^)]+)\)/);
    if (!linkMatch) {
      problems.push({ slug, cell: firstCell, kind: "sin-link" });
      continue;
    }
    const url = linkMatch[1];
    const isDirectProduct = /^https?:\/\/|^\/producto\//.test(url);
    if (!isDirectProduct) {
      problems.push({ slug, cell: firstCell, kind: "link-indirecto", url });
    }
  }
}

const sinLink = problems.filter((p) => p.kind === "sin-link");
const indirecto = problems.filter((p) => p.kind === "link-indirecto");

if (problems.length === 0) {
  console.log("✓ Todas las tablas de producto tienen el nombre linkeado directo al afiliado/ficha.");
  process.exit(0);
}

function printGroup(title, list, showUrl) {
  if (list.length === 0) return;
  const bySlug = new Map();
  for (const p of list) {
    if (!bySlug.has(p.slug)) bySlug.set(p.slug, []);
    bySlug.get(p.slug).push(p);
  }
  console.log(`${title} (${bySlug.size} guía(s)):\n`);
  for (const [slug, items] of bySlug) {
    console.log(`  [${slug}] ${items.length} fila(s):`);
    for (const it of items) console.log(`      "${it.cell}"` + (showUrl ? `  -> ${it.url}` : ""));
  }
  console.log("");
}

console.log(`✗ ${problems.length} fila(s) de tabla no linkean directo al afiliado/ficha:\n`);
printGroup("SIN NINGÚN LINK (el nombre no es clickeable)", sinLink, false);
printGroup("LINK INDIRECTO (va a otra guía, no directo al producto)", indirecto, true);
console.log(`Cada nombre de producto en la primera columna tiene que ser [Nombre](https://meli.la/... o /producto/...).`);
process.exit(1);
