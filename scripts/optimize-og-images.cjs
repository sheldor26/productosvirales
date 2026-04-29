/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS script */
// Optimize PNG OG/Twitter share images by emitting WebP siblings.
// PNGs are kept (Twitter Cards historically prefer PNG); guide metadata
// in src/data/guides.ts continues to reference the .png URLs.
//
// Run: node scripts/optimize-og-images.cjs
//
// Today this targets public/guias/masajeadores/ — the only folder with
// PNGs larger than 200KB. If you add more share images elsewhere, append
// the path to TARGET_DIRS below.

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const TARGET_DIRS = [
  path.join(__dirname, "..", "public", "guias", "masajeadores"),
];

async function processDir(dir) {
  if (!fs.existsSync(dir)) {
    console.warn(`skip: ${path.relative(process.cwd(), dir)} does not exist`);
    return;
  }
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".png"));
  if (files.length === 0) {
    console.log(`(no .png in ${path.relative(process.cwd(), dir)})`);
    return;
  }
  console.log(`\n→ ${path.relative(process.cwd(), dir)}`);
  for (const f of files) {
    const inPath = path.join(dir, f);
    const outPath = path.join(dir, f.replace(/\.png$/, ".webp"));
    await sharp(inPath).webp({ quality: 80 }).toFile(outPath);
    const before = fs.statSync(inPath).size;
    const after = fs.statSync(outPath).size;
    const pct = Math.round(((before - after) / before) * 100);
    console.log(
      `  ${f} → .webp  ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB  (-${pct}%)`
    );
  }
}

async function run() {
  for (const dir of TARGET_DIRS) {
    await processDir(dir);
  }
  console.log("\ndone.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
