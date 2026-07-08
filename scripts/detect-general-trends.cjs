#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Arma docs/radar-tendencias-argentina.md a partir de la pagina "Tendencias
 * actuales" de Google Trends para Argentina (scrapeada con Web Unlocker,
 * Bright Data). Sin filtrar por categoria: mezcla deportes/politica con
 * shopping/entretenimiento a proposito, para no perderse algo raro (ej. el
 * furor de figuritas Panini antes de un Mundial) por filtrar de mas.
 * Juan revisa la lista una vez por semana con su propio criterio.
 *
 * Uso:
 *   node scripts/detect-general-trends.cjs <pagina.md>
 */

const fs = require("fs");
const path = require("path");

const REPORT_PATH = path.resolve("docs/radar-tendencias-argentina.md");
const TOP_N = 30;

const REPORT_INTRO = `# Radar de tendencias (Argentina)

> Términos con mayor volumen de búsqueda en Argentina (Google Trends,
> últimos 7 días), sin filtrar por categoría — va a tener deportes y
> política mezclado con lo que realmente sirve. Es a propósito: la idea es
> no perderse algo como el furor de figuritas Panini antes de un Mundial
> por filtrar de más. Mirar una vez por semana con criterio propio.
> Entradas nuevas arriba.

`;

function usage() {
  console.log("Uso:\n  node scripts/detect-general-trends.cjs <pagina.md>");
}

function parseTrends(text) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const items = [];
  // Pagina en espanol (hl=es): "1 M+ búsquedas", "200 mil+ búsquedas".
  const volumeRe = /^([\d.,]+\s*(?:mil|M)?\+?)\s*b[uú]squedas$/i;

  for (let i = 1; i < lines.length; i++) {
    const volMatch = lines[i].match(volumeRe);
    if (!volMatch) continue;
    const title = lines[i - 1];
    if (!title || title.length < 2 || title.length > 80) continue;

    let growth = null;
    let ago = null;
    for (let j = i + 1; j < Math.min(lines.length, i + 14); j++) {
      if (!growth) {
        const g = lines[j].match(/^([\d][\d.,\s]*)\s*%$/);
        if (g) growth = g[1].replace(/\s+/g, "");
      }
      if (!ago) {
        const a = lines[j].match(/^hace (.+)$/) || lines[j].match(/^ayer$|^anteayer$/);
        if (a) ago = a[1] || lines[j];
      }
      if (growth && ago) break;
    }

    items.push({ title, volume: volMatch[1].trim(), growth, ago });
  }
  return items;
}

function dedupe(items) {
  const seen = new Set();
  return items.filter((it) => {
    if (seen.has(it.title)) return false;
    seen.add(it.title);
    return true;
  });
}

function volumeToNumber(v) {
  const m = v.match(/([\d.,]+)\s*(mil|M)?/i);
  if (!m) return 0;
  const n = parseFloat(m[1].replace(/[.,]/g, ""));
  const unit = (m[2] || "").toLowerCase();
  if (unit === "m") return n * 1_000_000;
  if (unit === "mil") return n * 1_000;
  return n;
}

function buildSection(items) {
  const ranked = dedupe(items)
    .sort((a, b) => volumeToNumber(b.volume) - volumeToNumber(a.volume))
    .slice(0, TOP_N);

  const lines = ranked.map((it) => {
    const extra = [it.growth ? `+${it.growth}%` : null, it.ago ? it.ago : null].filter(Boolean).join(", ");
    return `- **${it.title}** — ${it.volume} búsquedas${extra ? ` (${extra})` : ""}`;
  });

  return lines.join("\n") || "_No se pudo leer la página esta vez._";
}

function appendToReport(items, today) {
  const existing = fs.existsSync(REPORT_PATH) ? fs.readFileSync(REPORT_PATH, "utf8") : REPORT_INTRO;
  const section = `## ${today}\n\n${buildSection(items)}\n\n`;

  const firstSectionIdx = existing.indexOf("\n## ");
  const next =
    firstSectionIdx === -1
      ? existing.trimEnd() + "\n\n" + section
      : existing.slice(0, firstSectionIdx + 1) + section + existing.slice(firstSectionIdx + 1);
  fs.writeFileSync(REPORT_PATH, next);
}

function main() {
  const [mdPath] = process.argv.slice(2);
  if (!mdPath) {
    usage();
    process.exit(1);
  }
  const text = fs.readFileSync(mdPath, "utf8");
  const items = parseTrends(text);

  const today = new Date().toISOString().slice(0, 10);
  appendToReport(items, today);
  console.log(`${dedupe(items).length} tendencias agregadas a docs/radar-tendencias-argentina.md`);
}

main();
