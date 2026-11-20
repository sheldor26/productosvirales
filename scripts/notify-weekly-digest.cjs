#!/usr/bin/env node

/**
 * Digest semanal por EMAIL (Resend) a los suscriptores con source='newsletter'
 * (los que se anotaron desde NewsletterBanner, no desde el widget de alerta de
 * precio puntual). Muestra las bajas de precio reales más grandes de los
 * últimos 7 días, calculadas directo desde price-history.json — no depende
 * del archivo efímero .cache/pending-price-drops.json que usa
 * notify-price-drops-email.cjs (ese es por corrida de Bright Data; este es
 * semanal e independiente).
 *
 * Corre 1 vez por semana vía .github/workflows/digest-semanal.yml
 * (viernes 10am hora Argentina, decidido por Juan el 2026-10-24).
 *
 * Diseño: template compartido en scripts/lib/email-brand.cjs.
 *
 * DRY-RUN por defecto. Con --send envía. Con --preview escribe un HTML de
 * ejemplo a .cache/digest-preview.html sin tocar la base ni enviar nada.
 * Requiere en el env: RESEND_API_KEY, EMAIL_FROM, DATABASE_URL,
 * UNSUBSCRIBE_SECRET, (SITE_URL opcional)
 *
 * Uso:
 *   node scripts/notify-weekly-digest.cjs            # dry-run
 *   node scripts/notify-weekly-digest.cjs --preview   # HTML de ejemplo local
 *   node scripts/notify-weekly-digest.cjs --send      # envía
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { fmtPrice, truncateWords, productRow, renderShell, renderPlainText } = require("./lib/email-brand.cjs");

const HISTORY_PATH = path.resolve("src/data/price-history.json");
const CATALOG_PATH = path.resolve("src/data/curated-products.ts");
const SITE_URL = (process.env.SITE_URL || "https://productosvirales.com.ar").replace(/\/$/, "");
const FROM = process.env.EMAIL_FROM || "ProductosVirales <ofertas@productosvirales.com.ar>";
const SEND = process.argv.includes("--send");
const MAX_ITEMS = 6;
const LOOKBACK_DAYS = 7;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function unsubToken(email) {
  return crypto
    .createHmac("sha256", process.env.UNSUBSCRIBE_SECRET || "")
    .update(email.trim().toLowerCase())
    .digest("hex")
    .slice(0, 32);
}
function unsubUrl(email) {
  return `${SITE_URL}/api/unsubscribe?email=${encodeURIComponent(email)}&token=${unsubToken(email)}`;
}

// title/image/affiliateUrl/rating por id, parseando el catálogo (.ts) — mismo
// approach que notify-price-drops-email.cjs, para no requerir un TS a un
// script .cjs.
function catalogLookup(idSet) {
  const src = fs.readFileSync(CATALOG_PATH, "utf8");
  // Separa también las fichas `const nombre: Product = {...}` extraídas antes
  // del array (fix TS2590, ver tasks/lessons.md) — si no, quedan invisibles acá.
  const blocks = src.split(/\n(?:  \{|const \w+: Product = \{)\n/).slice(1);
  const map = {};
  for (const b of blocks) {
    const idm = b.match(/(?:^|\n)\s*id:\s*['"`]([^'"`]+)['"`]/);
    if (!idm) continue;
    const id = idm[1].toUpperCase();
    if (!idSet.has(id)) continue;
    const title = b.match(/(?:^|\n)\s*title:\s*['"`]([^'"`]+)['"`]/);
    const aff = b.match(/affiliateUrl:\s*['"`]([^'"`]+)['"`]/);
    const img = b.match(/(?:^|\n)\s*image:\s*['"`]([^'"`]+)['"`]/);
    const rat = b.match(/(?:^|\n)\s{4}rating:\s*([\d.]+)/);
    const rev = b.match(/(?:^|\n)\s{4}reviewCount:\s*(\d+)/);
    map[id] = {
      title: title ? title[1] : id,
      affiliateUrl: aff ? aff[1] : null,
      image: img ? img[1] : null,
      rating: rat ? Number(rat[1]) : null,
      reviewCount: rev ? Number(rev[1]) : null,
    };
  }
  return map;
}

function offerLink(id, cat) {
  const c = cat[id.toUpperCase()] || {};
  return c.affiliateUrl || `${SITE_URL}/producto/${id.toLowerCase()}`;
}

/** Baja real de los últimos LOOKBACK_DAYS días para un producto, o null si no
 * hay suficientes datos o el precio no bajó (nunca inventamos una baja). */
function weeklyDrop(id, points) {
  if (!points || points.length < 2) return null;
  const cutoff = Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000;
  const inWindow = points.filter((p) => new Date(p.d + "T12:00:00").getTime() >= cutoff);
  if (inWindow.length === 0) return null;
  const first = inWindow[0].p;
  const current = points[points.length - 1].p;
  if (current >= first) return null; // solo bajas reales, nunca subas presentadas como oferta
  const pct = Math.round(((current - first) / first) * 100);
  return { id, stored: first, scraped: current, pct };
}

function subject(shown) {
  const top = shown[0];
  return top ? `Esta semana bajó: ${truncateWords(top.title || top.id, 40)}` : "Las bajas de precio de la semana";
}

function dropRowsHtml(drops, cat) {
  return drops
    .map((d, i) => {
      const c = cat[d.id.toUpperCase()] || {};
      return productRow({
        title: c.title || d.id,
        href: offerLink(d.id, cat),
        image: c.image,
        rating: c,
        stored: d.stored,
        scraped: d.scraped,
        pct: d.pct,
        isFirst: i === 0,
        isLast: i === drops.length - 1,
        heroLabel: "La baja más grande de la semana",
        ctaLabel: "Ver precio actual",
      });
    })
    .join("");
}

function emailHtml(shown, cat, email) {
  const top = shown[0];
  const topTitle = top ? (cat[top.id.toUpperCase()] || {}).title || top.id : "";
  const preheader = top
    ? `${truncateWords(topTitle, 44)} quedó en ${fmtPrice(top.scraped)}. Los precios pueden cambiar.`
    : "Repaso semanal de precios en MercadoLibre.";
  return renderShell({
    title: "Las bajas de precio de la semana",
    kicker: null,
    intro: "Seguimos el precio real en MercadoLibre. Esto es lo que bajó de verdad en los últimos 7 días — el precio puede cambiar, confirmalo en el link.",
    trustLine: "Calculado con el historial de precios de los últimos 7 días",
    rowsHtml: dropRowsHtml(shown, cat),
    moreLineHtml: null,
    preheader,
    siteUrl: SITE_URL,
    email,
    unsubUrl: unsubUrl(email),
  });
}

function emailText(shown, cat, email) {
  return renderPlainText({
    title: "Las bajas de precio de la semana",
    introText: "Seguimos el precio real en MercadoLibre. Esto es lo que bajó de verdad en los últimos 7 días en productosvirales.com.ar — confirmá el precio en el link antes de comprar.",
    items: shown.map((d) => {
      const c = cat[d.id.toUpperCase()] || {};
      return { title: c.title || d.id, href: offerLink(d.id, cat), stored: d.stored, scraped: d.scraped, pct: d.pct };
    }),
    siteUrl: SITE_URL,
    unsubUrl: unsubUrl(email),
  });
}

function computeWeeklyDrops() {
  const history = JSON.parse(fs.readFileSync(HISTORY_PATH, "utf8"));
  const drops = [];
  for (const [id, points] of Object.entries(history)) {
    const d = weeklyDrop(id, points);
    if (d) drops.push(d);
  }
  drops.sort((a, b) => a.pct - b.pct); // mayor baja primero
  return drops;
}

async function getSubscribers(sql) {
  const rows = await sql`
    SELECT email FROM subscribers
    WHERE source = 'newsletter' AND unsubscribed = false
  `;
  return rows.map((r) => r.email);
}

async function main() {
  if (process.argv.includes("--preview")) {
    const drops = computeWeeklyDrops().slice(0, MAX_ITEMS);
    const cat = catalogLookup(new Set(drops.map((d) => d.id.toUpperCase())));
    const out = path.resolve(".cache/digest-preview.html");
    const outTxt = path.resolve(".cache/digest-preview.txt");
    fs.mkdirSync(path.dirname(out), { recursive: true });
    const shown = drops.length > 0 ? drops : [];
    fs.writeFileSync(out, emailHtml(shown, cat, "vos@ejemplo.com"));
    fs.writeFileSync(outTxt, emailText(shown, cat, "vos@ejemplo.com"));
    console.log(`[digest] preview -> ${out} (y ${outTxt}) (${drops.length} bajas reales encontradas)`);
    return;
  }

  const drops = computeWeeklyDrops();
  if (drops.length === 0) {
    console.log("[digest] sin bajas reales en los últimos 7 días — nada que mandar esta semana.");
    return;
  }
  const shown = drops.slice(0, MAX_ITEMS);
  const cat = catalogLookup(new Set(shown.map((d) => d.id.toUpperCase())));

  console.log(`[digest] bajas reales últimos ${LOOKBACK_DAYS} días: ${drops.length} | modo: ${SEND ? "ENVÍO" : "DRY-RUN"}`);
  shown.forEach((d) => {
    const title = (cat[d.id.toUpperCase()] || {}).title || d.id;
    console.log(`   -${Math.abs(d.pct)}%  ${title}  ${fmtPrice(d.stored)}→${fmtPrice(d.scraped)}`);
  });

  if (!SEND) {
    console.log("[digest] DRY-RUN: no se envió nada. Corré con --send para enviar.");
    return;
  }

  if (!process.env.RESEND_API_KEY) return void console.log("[digest] falta RESEND_API_KEY — no se envió.");
  if (!process.env.UNSUBSCRIBE_SECRET) return void console.log("[digest] falta UNSUBSCRIBE_SECRET — no se envió.");
  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!dbUrl) return void console.log("[digest] falta DATABASE_URL — no se envió.");

  const { neon } = require("@neondatabase/serverless");
  const sql = neon(dbUrl);
  const emails = await getSubscribers(sql);
  if (emails.length === 0) return void console.log("[digest] no hay suscriptores 'newsletter' — nada que mandar.");

  const { Resend } = require("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const subj = subject(shown.map((d) => ({ ...d, title: (cat[d.id.toUpperCase()] || {}).title })));

  let sent = 0;
  for (const email of emails) {
    const idem =
      "wd-" +
      crypto
        .createHash("sha256")
        .update(email + "|" + new Date().toISOString().slice(0, 10) + "|" + shown.map((d) => d.id).join(","))
        .digest("hex")
        .slice(0, 24);
    try {
      const { error } = await resend.emails.send(
        {
          from: FROM,
          to: email,
          subject: subj,
          html: emailHtml(shown, cat, email),
          text: emailText(shown, cat, email),
          headers: {
            "List-Unsubscribe": `<${unsubUrl(email)}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
        },
        { idempotencyKey: idem }
      );
      if (error) {
        console.error(`[digest] error a ${email}:`, error);
      } else {
        sent++;
      }
    } catch (e) {
      console.error(`[digest] excepción a ${email}:`, e.message);
    }
    await sleep(150);
  }
  console.log(`[digest] enviados: ${sent} | total suscriptores: ${emails.length}`);
}

main().catch((e) => {
  console.error("[digest] fallo:", e);
  process.exit(1);
});
