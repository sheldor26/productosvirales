#!/usr/bin/env node
/* eslint-disable no-console */

const { spawnSync } = require("child_process");

console.log("check-prices.cjs now uses the no-API MercadoLibre browser scraper.");
console.log("Pass filters through, for example: --match freidora --limit 5\n");

const args = [
  "scripts/update-prices-from-ml.cjs",
  "--dry-run",
  ...process.argv.slice(2),
];

if (!process.argv.slice(2).some((arg) => arg === "--limit" || arg === "--all")) {
  args.push("--limit", "20");
}

const result = spawnSync(process.execPath, args, { stdio: "inherit" });
process.exit(result.status ?? 1);
