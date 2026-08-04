#!/usr/bin/env node

const { spawnSync } = require("child_process");

console.log("check-all-prices.cjs now uses the no-API MercadoLibre browser scraper.");
console.log("This can take a while; it checks the full catalog with throttling.\n");

const args = [
  "scripts/update-prices-from-ml.cjs",
  "--dry-run",
  "--all",
  ...process.argv.slice(2),
];

const result = spawnSync(process.execPath, args, { stdio: "inherit" });
process.exit(result.status ?? 1);
