#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require("fs");
const { spawnSync } = require("child_process");

const candidates = [
  "scripts/price-update-results.json",
  "scripts/pending-price-results.json",
];
const resultsPath = candidates.find((file) => fs.existsSync(file));

if (!resultsPath) {
  console.error("No previous price results found.");
  console.error("Run scripts/check-pending-prices.cjs or scripts/update-prices-from-ml.cjs first.");
  process.exit(1);
}

const all = JSON.parse(fs.readFileSync(resultsPath, "utf8"));
const failed = all.filter((item) => {
  const checkedPrice = Object.prototype.hasOwnProperty.call(item, "currentPrice")
    ? item.currentPrice
    : item.current;
  return (
    item.status === "failed" ||
    item.status === "blocked" ||
    item.status === "suspicious" ||
    checkedPrice == null
  );
});

const ids = failed
  .map((item) => item.id)
  .filter(Boolean)
  .flatMap((id) => ["--id", String(id).toUpperCase()]);

console.log("retry-failed-prices.cjs now uses the no-API MercadoLibre browser scraper.");
console.log(`Loaded ${failed.length} failed/suspicious results from ${resultsPath}.\n`);

if (ids.length === 0) {
  console.log("No failed product ids to retry.");
  process.exit(0);
}

const result = spawnSync(
  process.execPath,
  ["scripts/update-prices-from-ml.cjs", "--dry-run", ...ids, ...process.argv.slice(2)],
  { stdio: "inherit" }
);

process.exit(result.status ?? 1);
