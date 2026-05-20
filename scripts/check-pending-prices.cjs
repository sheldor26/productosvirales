#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require("fs");
const { spawnSync } = require("child_process");

const pendingPath = "scripts/pending-price-check.json";
const pending = JSON.parse(fs.readFileSync(pendingPath, "utf8"));
const ids = pending
  .map((item) => item.id)
  .filter(Boolean)
  .flatMap((id) => ["--id", id]);

console.log("check-pending-prices.cjs now uses the no-API MercadoLibre browser scraper.");
console.log(`Loaded ${ids.length / 2} ids from ${pendingPath}.\n`);

const result = spawnSync(
  process.execPath,
  ["scripts/update-prices-from-ml.cjs", "--dry-run", ...ids, ...process.argv.slice(2)],
  { stdio: "inherit" }
);

process.exit(result.status ?? 1);
