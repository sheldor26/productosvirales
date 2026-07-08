#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Arma docs/tendencias-detectadas.md a partir de los datasets de TikTok
 * (collector "TikTok - Posts by Search URL Fast API", Bright Data) de una
 * corrida semanal. No toca el catalogo — es solo un reporte para que Juan
 * decida que vale la pena convertir en guia/producto nuevo.
 *
 * Uso:
 *   node scripts/detect-tiktok-trends.cjs <niche_label> <dataset.json> [--timeout]
 *
 * --timeout indica que esta busqueda se corto por el limite de 5 min del
 * workflow (igual se reporta lo que se llego a juntar).
 */

const fs = require("fs");
const path = require("path");

const REPORT_PATH = path.resolve("docs/tendencias-detectadas.md");
const TOP_N = 8;

const REPORT_INTRO = `# Tendencias detectadas (TikTok)

> Posts de mayor engagement por búsqueda de nicho, de la corrida semanal
> automática. Es un generador de ideas de contenido — mirá si algún
> producto/modelo mencionado vale la pena chequear en MercadoLibre y
> convertir en guía o ficha. Entradas nuevas arriba.

`;

function usage() {
  console.log(`Uso:
  node scripts/detect-tiktok-trends.cjs <niche_label> <dataset.json> [--timeout]`);
}

function engagementScore(p) {
  const shares = Number(p.share_count) || 0;
  return (p.digg_count || 0) + shares * 3 + (p.collect_count || 0) * 2 + (p.comment_count || 0);
}

function dedupe(posts) {
  const seen = new Set();
  const out = [];
  for (const p of posts) {
    const key = p.post_id || p.url;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}

function buildSection(niche, posts, timedOut) {
  // El collector de TikTok repite posts (a veces el mismo varias veces) en
  // vez de avanzar la paginacion — dedupe por post_id antes de rankear.
  const unique = dedupe(posts);
  const ranked = unique
    .filter((p) => p.description || p.url)
    .sort((a, b) => engagementScore(b) - engagementScore(a))
    .slice(0, TOP_N);

  const note = timedOut
    ? " _(se cortó por el límite de tiempo del workflow — muestra parcial)_"
    : "";
  const lines = ranked.map((p) => {
    const desc = (p.description || "(sin descripción)").replace(/\s+/g, " ").trim().slice(0, 140);
    const likes = p.digg_count || 0;
    const shares = p.share_count || 0;
    const saves = p.collect_count || 0;
    const comments = p.comment_count || 0;
    return `- ${desc}\n  - ${likes.toLocaleString("es-AR")} likes · ${Number(shares).toLocaleString("es-AR")} shares · ${saves.toLocaleString("es-AR")} guardados · ${comments.toLocaleString("es-AR")} comentarios\n  - ${p.url}`;
  });

  return `### ${niche}${note} (${unique.length} posts únicos de ${posts.length} recibidos)\n\n${lines.join("\n") || "_Sin resultados esta semana._"}\n\n`;
}

function appendToReport(niche, posts, timedOut, today) {
  const existing = fs.existsSync(REPORT_PATH) ? fs.readFileSync(REPORT_PATH, "utf8") : REPORT_INTRO;
  const section = buildSection(niche, posts, timedOut);

  // Buscar si ya hay una seccion de hoy (## fecha) para agrupar todos los
  // nichos de la misma corrida bajo el mismo encabezado de fecha.
  const todayHeader = `## ${today}\n\n`;
  const todayIdx = existing.indexOf(todayHeader);

  let next;
  if (todayIdx !== -1) {
    const insertAt = todayIdx + todayHeader.length;
    next = existing.slice(0, insertAt) + section + existing.slice(insertAt);
  } else {
    const firstSectionIdx = existing.indexOf("\n## ");
    const newBlock = todayHeader + section;
    next =
      firstSectionIdx === -1
        ? existing.trimEnd() + "\n\n" + newBlock
        : existing.slice(0, firstSectionIdx + 1) + newBlock + existing.slice(firstSectionIdx + 1);
  }
  fs.writeFileSync(REPORT_PATH, next);
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    usage();
    process.exit(1);
  }
  const [niche, datasetPath] = args;
  const timedOut = args.includes("--timeout");

  let posts = [];
  try {
    posts = JSON.parse(fs.readFileSync(datasetPath, "utf8"));
    if (!Array.isArray(posts)) posts = [];
  } catch {
    posts = [];
  }

  const today = new Date().toISOString().slice(0, 10);
  appendToReport(niche, posts, timedOut, today);
  console.log(`"${niche}": ${posts.length} posts agregados a docs/tendencias-detectadas.md${timedOut ? " (parcial, timeout)" : ""}`);
}

main();
