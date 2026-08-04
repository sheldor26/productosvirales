#!/usr/bin/env node

const { spawnSync } = require("child_process");

const ids = [
  "MLA24605489",
  "MLAU3812360798",
  "MLAU3798337289",
  "MLA52883777",
  "MLAU3407622515",
  "MLAU3800115477",
  "MLAU3671070084",
  "MLA22234109",
  "MLA19715215",
  "MLA29780185",
  "MLA54145870",
  "MLA29077943",
  "MLA60836327",
  "MLA41306043",
  "MLA25883660",
  "MLA31178643",
  "MLA19053146",
  "MLA27855490",
  "MLA41304983",
  "MLA49628348",
  "MLAU3562485598",
  "MLA53013853",
  "MLA19846768",
  "MLAU3452900219",
  "MLA47054851",
  "MLA40157772",
  "MLA43643712",
  "MLA40521028",
  "MLA53394464",
  "MLA28060225",
  "MLA37755803",
  "MLA41178086",
  "MLA16122300",
  "MLA32488004",
  "MLA28754461",
];

console.log("check-perfume-prices.cjs now uses the no-API MercadoLibre browser scraper.");
console.log(`Checking ${ids.length} perfume products.\n`);

const args = ids.flatMap((id) => ["--id", id]);
const result = spawnSync(
  process.execPath,
  ["scripts/update-prices-from-ml.cjs", "--dry-run", ...args, ...process.argv.slice(2)],
  { stdio: "inherit" }
);

process.exit(result.status ?? 1);
