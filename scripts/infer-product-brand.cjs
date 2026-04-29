/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS script */
/**
 * Infer the `brand` field for products in src/data/curated-products.ts
 * by matching their title against a curated whitelist.
 *
 * Default = dry-run: prints a proposed table and exits without writing.
 * Pass `--apply` to actually edit src/data/curated-products.ts.
 *
 * The script ONLY adds a brand to entries that don't already have one
 * and where the match is unambiguous (multi-word brands match before
 * single-word ones, longest match wins).
 *
 * Usage:
 *   node scripts/infer-product-brand.cjs           # dry-run
 *   node scripts/infer-product-brand.cjs --apply   # write
 */

const fs = require("fs");
const path = require("path");

const CURATED_PATH = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "curated-products.ts"
);

// ─── Brand whitelist ───
// Keep multi-word brands BEFORE their single-word fragments so longest
// match wins (e.g. "Maison Alhambra" before "Alhambra"). Order matters.
const BRANDS = [
  // Arabic-style perfume houses
  "Maison Alhambra",
  "Paris Corner",
  "Fragrance World",
  "Al Haramain",
  "Al Wataniah",
  "Lattafa",
  "Afnan",
  "Rasasi",
  "Armaf",
  "Asdaaf",
  "Ajmal",
  "Khadlaj",
  "Riiffs",
  "Manasik",

  // Small / large appliances (Argentina market)
  "Top House",
  "Smart Life",
  "Smartlife",
  "PowerXL",
  "Atma",
  "Peabody",
  "Liliana",
  "Philips",
  "Oster",
  "Gadnic",
  "Suono",
  "Kanji",
  "Ninja",
  "Cecotec",
  "Eufy",
  "Roborock",
  "Ecovacs",
  "Xiaomi",
  "Etheos",
  "Dakota",
  "ViewSonic",
  "TCL",
];

// Build a regex per brand. Case-insensitive, word-boundary on both sides.
// Special-case multi-word: spaces in the brand match \s+.
function brandPattern(brand) {
  const escaped = brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
  // \b only respects ASCII word characters, which is fine here — all
  // brands are ASCII-only.
  return new RegExp(`\\b${escaped}\\b`, "i");
}

function inferBrand(title) {
  for (const brand of BRANDS) {
    if (brandPattern(brand).test(title)) {
      return brand;
    }
  }
  return null;
}

// ─── Read curated-products.ts as text and walk the entries ───
function loadCurated() {
  return fs.readFileSync(CURATED_PATH, "utf8");
}

// Extract every product entry: a `{ ... },` block whose first interesting
// line is `id: '...'` or `id: "..."`. Use a stateful scan because the
// file has nested `{}` (structuredData, specs, etc.).
function findEntries(src) {
  const lines = src.split("\n");
  const entries = []; // { startLine, endLine, id, hasBrand, titleLine }
  let depth = 0;
  let entryStart = -1;
  let id = null;
  let titleLine = -1;
  let hasBrand = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Top-level array open `export const curatedProducts: Product[] = [`
    // followed by entries. Each entry starts with `  {` at exactly 2 spaces
    // and ends with `  },` at the same indent. Use that as the boundary.
    const startMatch = /^ {2}\{\s*$/.test(line);
    const endMatch = /^ {2}\},?\s*$/.test(line);

    if (depth === 0 && startMatch) {
      depth = 1;
      entryStart = i;
      id = null;
      titleLine = -1;
      hasBrand = false;
      continue;
    }
    if (depth >= 1) {
      const idMatch = line.match(/^ {4}id:\s*['"]([^'"]+)['"]/);
      if (idMatch && id == null) id = idMatch[1];
      if (titleLine === -1 && /^ {4}title:\s*/.test(line)) titleLine = i;
      if (/^ {4}brand:\s*/.test(line)) hasBrand = true;

      if (depth === 1 && endMatch) {
        if (id) {
          entries.push({
            startLine: entryStart,
            endLine: i,
            id,
            hasBrand,
            titleLine,
          });
        }
        depth = 0;
        continue;
      }
      // Track nested braces conservatively (only for our own sanity; the
      // 2-space indent pattern is the actual boundary signal).
      const opens = (line.match(/[{[]/g) || []).length;
      const closes = (line.match(/[}\]]/g) || []).length;
      depth += opens - closes;
      if (depth < 1) depth = 1;
    }
  }
  return entries;
}

function getEntryTitle(src, entry) {
  // The title can span multiple lines but the simple cases use a single
  // line. We pull the line and try to extract the quoted string.
  const line = src.split("\n")[entry.titleLine] || "";
  const m = line.match(/title:\s*['"`](.+?)['"`]/);
  return m ? m[1] : "";
}

function buildBrandLine(brand) {
  // Match the dominant style in the file: 4-space indent + double quotes.
  return `    brand: "${brand}",`;
}

function applyBrands(src, plan) {
  // Apply edits bottom-up so line numbers remain valid.
  const sorted = [...plan].sort((a, b) => b.titleLine - a.titleLine);
  let lines = src.split("\n");
  for (const item of sorted) {
    const titleLine = lines[item.titleLine];
    const brandLine = buildBrandLine(item.brand);
    // Insert immediately after the title line.
    lines = [
      ...lines.slice(0, item.titleLine + 1),
      brandLine,
      ...lines.slice(item.titleLine + 1),
    ];
  }
  return lines.join("\n");
}

function main() {
  const apply = process.argv.includes("--apply");
  const src = loadCurated();
  const entries = findEntries(src);
  console.log(`Scanned ${entries.length} product entries in curated-products.ts.`);

  const plan = [];
  let alreadyHadBrand = 0;
  let inferred = 0;
  let noMatch = 0;

  for (const e of entries) {
    if (e.hasBrand) {
      alreadyHadBrand++;
      continue;
    }
    const title = getEntryTitle(src, e);
    const brand = inferBrand(title);
    if (brand) {
      plan.push({
        id: e.id,
        title,
        brand,
        titleLine: e.titleLine,
      });
      inferred++;
    } else {
      noMatch++;
    }
  }

  console.log(`  - already had brand:   ${alreadyHadBrand}`);
  console.log(`  - inferred brand:      ${inferred}`);
  console.log(`  - no whitelist match:  ${noMatch}`);
  console.log("");

  if (plan.length === 0) {
    console.log("Nothing to apply.");
    return;
  }

  // Group by brand for readability
  const byBrand = {};
  for (const p of plan) {
    if (!byBrand[p.brand]) byBrand[p.brand] = [];
    byBrand[p.brand].push(p);
  }
  const sortedBrands = Object.keys(byBrand).sort(
    (a, b) => byBrand[b].length - byBrand[a].length
  );

  console.log("=== Proposed brand assignments ===\n");
  for (const brand of sortedBrands) {
    console.log(`${brand} (${byBrand[brand].length}):`);
    for (const p of byBrand[brand]) {
      const shortTitle = p.title.length > 70 ? p.title.slice(0, 70) + "…" : p.title;
      console.log(`  ${p.id}  ${shortTitle}`);
    }
    console.log("");
  }

  if (!apply) {
    console.log("Dry-run only. Re-run with --apply to write changes.");
    return;
  }

  const next = applyBrands(src, plan);
  fs.writeFileSync(CURATED_PATH, next, "utf8");
  console.log(`Wrote ${plan.length} brand: lines into ${path.relative(process.cwd(), CURATED_PATH)}.`);
}

main();
