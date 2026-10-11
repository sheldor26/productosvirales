#!/usr/bin/env node
/**
 * QA semanal de conversion - "cliente fantasma", parte medible.
 *
 * Abre el sitio EN VIVO con puppeteer (viewport celular) y mide, por pagina,
 * que tan facil es llegar al clic de afiliado. Solo lectura: no clickea nada,
 * no escribe en src/, y bloquea GA4 para no inflar las visitas.
 *
 * Paginas a medir:
 *   1. Las que tuvieron clics en Search Console (ultimo export en scripts/gsc/exports)
 *   2. TODO el nicho robot aspiradora (guias + fichas) sacado del sitemap en vivo
 *
 * Uso:
 *   node scripts/qa-semanal/medir.cjs                 # corrida normal
 *   node scripts/qa-semanal/medir.cjs --max 25        # tope de paginas de GSC
 *   node scripts/qa-semanal/medir.cjs --url /guias/robot-aspiradora   # una sola
 *   node scripts/qa-semanal/medir.cjs --out docs/qa-semanal/2026-10-12
 *
 * Salida (en --out, por defecto docs/qa-semanal/AAAA-MM-DD):
 *   medicion.json      una fila por pagina con todas las metricas y banderas
 *   paginas/<slug>.txt texto visible de la pagina (para que Claude haga de comprador)
 *   capturas/<slug>.png primera pantalla en celular
 */
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const ROOT = path.resolve(__dirname, "..", "..");
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://productosvirales.com.ar";
const VIEWPORT = { width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true };

// Umbrales de las banderas. Se ajustan mirando las primeras corridas.
const UMBRAL = {
  primerCtaPantallas: 2.0, // primer boton de compra a mas de 2 pantallas = tarde
  destinosMax: 12, // mas productos distintos que esto = demasiadas opciones, el lector no sabe a cual ir
  linksInternosMax: 60, // links internos a verificar por pagina (tope de cortesia)
};

const args = process.argv.slice(2);
const argVal = (flag, def) => {
  const i = args.indexOf(flag);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
};
const MAX_GSC = parseInt(argVal("--max", "30"), 10);
const SOLO_URL = argVal("--url", null);
const hoy = new Date().toISOString().slice(0, 10);
const OUT = path.resolve(ROOT, argVal("--out", `docs/qa-semanal/${hoy}`));

const slugDe = (url) =>
  new URL(url).pathname.replace(/^\/|\/$/g, "").replace(/\//g, "__").slice(0, 120) || "home";

function ultimoExportGsc() {
  const base = path.join(ROOT, "scripts/gsc/exports");
  if (!fs.existsSync(base)) return null;
  const dirs = fs
    .readdirSync(base)
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && fs.existsSync(path.join(base, d, "page.csv")))
    .sort();
  return dirs.length ? { fecha: dirs[dirs.length - 1], file: path.join(base, dirs[dirs.length - 1], "page.csv") } : null;
}

function paginasConClics() {
  const exp = ultimoExportGsc();
  if (!exp) return { exp: null, filas: [] };
  const lineas = fs.readFileSync(exp.file, "utf8").trim().split("\n").slice(1);
  // page.csv trae filas con #ancla (saltos del indice en Google) ademas de la pagina:
  // se suman a la URL base para no perder ni duplicar clics.
  const porUrl = new Map();
  for (const l of lineas) {
    const [u, , clics, impr, , pos] = l.split(",");
    if (!u) continue;
    const base = u.split("#")[0];
    const a = porUrl.get(base) || { url: base, clics: 0, impresiones: 0, posPeso: 0 };
    a.clics += +clics;
    a.impresiones += +impr;
    a.posPeso += +pos * +impr;
    porUrl.set(base, a);
  }
  const filas = [...porUrl.values()]
    .map((a) => ({
      url: a.url,
      clics: a.clics,
      impresiones: a.impresiones,
      ctr: a.impresiones ? a.clics / a.impresiones : 0,
      posicion: a.impresiones ? a.posPeso / a.impresiones : 0,
    }))
    .filter((f) => f.url.startsWith(SITE) && f.clics > 0)
    .sort((a, b) => b.clics - a.clics)
    .slice(0, MAX_GSC);
  return { exp, filas };
}

async function paginasRobot() {
  const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const noEsRobotAspiradora = /cocina|vidrio|ventana|inalambrica|pileta|piscina|cortacesped/;
  return urls.filter((u) => {
    const p = new URL(u).pathname;
    if (noEsRobotAspiradora.test(p)) return false;
    if (p.startsWith("/guias/")) return /robot-aspirador|aspiradora-robot|robot-aspiradora|trapead|roomba|vacuum/.test(p);
    if (p.startsWith("/producto/")) return /aspiradora.*robot|robot.*aspirad|roomba|vacuum/.test(p);
    return false;
  });
}

async function verificarLinks(urls) {
  // HEAD con tope de cortesia; GET si el server no soporta HEAD. Solo links internos.
  const rotos = [];
  const cola = [...urls];
  const worker = async () => {
    while (cola.length) {
      const u = cola.shift();
      try {
        let r = await fetch(u, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(15000) });
        if (r.status === 405 || r.status === 403) r = await fetch(u, { redirect: "follow", signal: AbortSignal.timeout(15000) });
        if (r.status >= 400) rotos.push({ url: u, status: r.status });
      } catch (e) {
        rotos.push({ url: u, status: "error:" + e.name });
      }
    }
  };
  await Promise.all([worker(), worker(), worker()]);
  return rotos;
}

async function medirPagina(browser, url, meta) {
  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);
  await page.setUserAgent(
    "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36 PV-QA-Semanal"
  );
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    const u = req.url();
    if (/googletagmanager|google-analytics|\/g\/collect|doubleclick/.test(u)) return req.abort();
    req.continue();
  });

  const t0 = Date.now();
  let status = 0;
  try {
    const resp = await page.goto(url, { waitUntil: "networkidle2", timeout: 45000 });
    status = resp ? resp.status() : 0;
  } catch (e) {
    await page.close();
    return { url, ...meta, error: "no_cargo: " + e.message.slice(0, 120) };
  }
  const msCarga = Date.now() - t0;

  const datos = await page.evaluate((vh, origen) => {
    const visible = (el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none";
    };
    const esFijo = (el) => {
      for (let n = el; n && n !== document.body; n = n.parentElement) {
        const p = getComputedStyle(n).position;
        if (p === "fixed" || p === "sticky") return true;
      }
      return false;
    };
    const yAbs = (el) => Math.round(el.getBoundingClientRect().top + window.scrollY);

    const ctas = [...document.querySelectorAll("a[data-cta-location]")].filter(visible).map((a) => ({
      lugar: a.getAttribute("data-cta-location"),
      y: yAbs(a),
      fijo: esFijo(a),
      href: a.href,
      destino: /meli\.la|mercadolibre\.com/.test(a.href) ? "ml" : a.href.startsWith(origen) ? "interno" : "otro",
      sponsored: /sponsored/.test(a.getAttribute("rel") || ""),
      texto: (a.innerText || a.getAttribute("aria-label") || "").trim().slice(0, 60),
    }));

    const linksAfiliado = [...document.querySelectorAll('a[href*="meli.la"], a[href*="mercadolibre.com"]')];
    const sinSponsored = linksAfiliado
      .filter((a) => !/sponsored/.test(a.getAttribute("rel") || ""))
      .map((a) => a.href)
      .slice(0, 10);

    const internos = [
      ...new Set(
        [...document.querySelectorAll("a[href]")]
          .map((a) => a.href.split("#")[0])
          .filter((h) => h.startsWith(origen) && !/\.(png|jpg|jpeg|webp|svg|ico|xml|txt)$/i.test(h))
      ),
    ];

    const h2s = [...document.querySelectorAll("h2")].map((h) => h.innerText.trim());
    const main = document.querySelector("main") || document.body;
    const sinAlt = [...document.querySelectorAll("img")].filter((i) => visible(i) && !i.getAttribute("alt")).length;

    return {
      titulo: document.title,
      h1: (document.querySelector("h1") || {}).innerText || null,
      altoPagina: document.documentElement.scrollHeight,
      ctas,
      cantLinksAfiliado: linksAfiliado.length,
      sinSponsored,
      internos,
      tablas: document.querySelectorAll("table").length,
      cantH2: h2s.length,
      tieneFaq: h2s.some((t) => /pregunta|faq|dudas/i.test(t)) || document.querySelectorAll("details").length > 0,
      tieneVeredicto: ctas.some((c) => /verdict/.test(c.lugar)) || h2s.some((t) => /veredicto|conclusi|cu[aá]l comprar|recomend/i.test(t)),
      tieneBotonFijo: ctas.some((c) => /^sticky/.test(c.lugar)),
      imagenesSinAlt: sinAlt,
      texto: main.innerText.replace(/\n{3,}/g, "\n\n").slice(0, 12000),
    };
  }, VIEWPORT.height, SITE);

  const slug = slugDe(url);
  fs.mkdirSync(path.join(OUT, "paginas"), { recursive: true });
  fs.mkdirSync(path.join(OUT, "capturas"), { recursive: true });
  fs.writeFileSync(path.join(OUT, "paginas", slug + ".txt"), `# ${datos.h1 || datos.titulo}\n${url}\n\n${datos.texto}\n`);
  await page.screenshot({ path: path.join(OUT, "capturas", slug + ".png") });
  await page.close();

  const ctasFlujo = datos.ctas.filter((c) => !c.fijo && c.destino === "ml").sort((a, b) => a.y - b.y);
  const destinosUnicos = new Set(datos.ctas.filter((c) => c.destino === "ml").map((c) => c.href)).size;
  const primero = ctasFlujo[0] || null;
  const primerCtaPantallas = primero ? +(primero.y / VIEWPORT.height).toFixed(2) : null;

  const rotos = await verificarLinks(datos.internos.slice(0, UMBRAL.linksInternosMax));

  const banderas = [];
  if (status !== 200) banderas.push(`http_${status}`);
  if (datos.cantLinksAfiliado === 0) banderas.push("sin_links_afiliado");
  if (datos.cantLinksAfiliado > 0 && !primero) banderas.push("sin_boton_de_compra_visible");
  if (primerCtaPantallas !== null && primerCtaPantallas > UMBRAL.primerCtaPantallas) banderas.push("primer_boton_tarde");
  // Veredicto y "demasiadas opciones" solo tienen sentido en guias; las fichas /producto/ no llevan veredicto por diseno.
  const esGuia = new URL(url).pathname.startsWith("/guias/");
  if (esGuia && destinosUnicos > UMBRAL.destinosMax) banderas.push("demasiadas_opciones");
  if (datos.sinSponsored.length) banderas.push("links_sin_rel_sponsored");
  if (rotos.length) banderas.push("links_internos_rotos");
  if (esGuia && !datos.tieneVeredicto) banderas.push("sin_veredicto");
  if (!datos.tieneBotonFijo) banderas.push("sin_boton_fijo_celular");
  if (datos.altoPagina / VIEWPORT.height > 25) banderas.push("pagina_muy_larga");
  if (datos.imagenesSinAlt > 0) banderas.push("imagenes_sin_alt");

  return {
    url,
    slug,
    ...meta,
    status,
    msCarga,
    titulo: datos.titulo,
    h1: datos.h1,
    pantallasDeAlto: +(datos.altoPagina / VIEWPORT.height).toFixed(1),
    primerCtaPantallas,
    primerCtaLugar: primero ? primero.lugar : null,
    cantBotones: datos.ctas.length,
    destinosUnicos,
    cantLinksAfiliado: datos.cantLinksAfiliado,
    linksSinSponsored: datos.sinSponsored,
    tablas: datos.tablas,
    cantH2: datos.cantH2,
    tieneFaq: datos.tieneFaq,
    tieneVeredicto: datos.tieneVeredicto,
    tieneBotonFijo: datos.tieneBotonFijo,
    imagenesSinAlt: datos.imagenesSinAlt,
    linksInternosRotos: rotos,
    botonesPorLugar: datos.ctas.reduce((acc, c) => ((acc[c.lugar] = (acc[c.lugar] || 0) + 1), acc), {}),
    banderas,
  };
}

(async () => {
  let objetivos = [];
  let exp = null;

  if (SOLO_URL) {
    objetivos = [{ url: SOLO_URL.startsWith("http") ? SOLO_URL : SITE + SOLO_URL, origen: "manual" }];
  } else {
    const gsc = paginasConClics();
    exp = gsc.exp;
    if (!exp) console.warn("AVISO: no hay export de GSC en scripts/gsc/exports; solo se mide robot aspiradora.");
    const vistos = new Set();
    for (const f of gsc.filas) {
      vistos.add(f.url);
      objetivos.push({ url: f.url, origen: "gsc", gsc: { clics: f.clics, impresiones: f.impresiones, ctr: +f.ctr.toFixed(4), posicion: +f.posicion.toFixed(1) } });
    }
    for (const u of await paginasRobot()) {
      if (vistos.has(u)) {
        const o = objetivos.find((x) => x.url === u);
        o.origen = "gsc+robot";
      } else objetivos.push({ url: u, origen: "robot" });
    }
  }

  console.log(`Midiendo ${objetivos.length} paginas${exp ? ` (GSC export ${exp.fecha})` : ""} -> ${path.relative(ROOT, OUT)}`);
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  const filas = [];
  for (const [i, o] of objetivos.entries()) {
    const { url, ...meta } = o;
    process.stdout.write(`[${i + 1}/${objetivos.length}] ${new URL(url).pathname.slice(0, 70)} ... `);
    const fila = await medirPagina(browser, url, meta);
    filas.push(fila);
    console.log(fila.error ? "ERROR " + fila.error : fila.banderas.length ? fila.banderas.join(", ") : "ok");
  }
  await browser.close();

  const resumen = {};
  for (const f of filas) for (const b of f.banderas || []) resumen[b] = (resumen[b] || 0) + 1;

  fs.writeFileSync(
    path.join(OUT, "medicion.json"),
    JSON.stringify({ fecha: hoy, sitio: SITE, gscExport: exp ? exp.fecha : null, umbrales: UMBRAL, resumenBanderas: resumen, paginas: filas }, null, 2)
  );
  console.log("\nResumen de banderas:", resumen);
  console.log("Listo:", path.relative(ROOT, path.join(OUT, "medicion.json")));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
