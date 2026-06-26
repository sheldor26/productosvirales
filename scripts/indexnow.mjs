// Avisa a IndexNow (Bing, Yandex, etc.) que el contenido cambio, sin esperar
// a que los buscadores nos crawleen solos. Para un sitio con poca autoridad
// de dominio, es un empujon gratis para que indexen las guias/fichas nuevas.
//
// Como funciona: baja el sitemap EN VIVO del sitio, saca todas las URLs y se
// las manda a IndexNow en un solo POST. La clave publica vive en
// public/<KEY>.txt y IndexNow la verifica ahi.
//
// Uso:
//   node scripts/indexnow.mjs                 # envia TODAS las URLs del sitemap
//   node scripts/indexnow.mjs --match yara    # solo las URLs que contengan "yara"
//   node scripts/indexnow.mjs --dry-run       # muestra que enviaria, sin enviar
//
// No usa dependencias nuevas: fetch es nativo en Node 18+.

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://productosvirales.com.ar").replace(/\/$/, "");
const KEY = "a0cf2ba0f6361ca7d4f0516c7f30b9b1";
const HOST = new URL(SITE_URL).host;
const KEY_LOCATION = `${SITE_URL}/${KEY}.txt`;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const matchIdx = args.indexOf("--match");
const match = matchIdx !== -1 ? args[matchIdx + 1] : null;

function log(msg) {
  process.stdout.write(`[indexnow] ${msg}\n`);
}

async function getSitemapUrls() {
  const res = await fetch(`${SITE_URL}/sitemap.xml`, {
    headers: { "User-Agent": "productosvirales-indexnow/1.0" },
  });
  if (!res.ok) {
    throw new Error(`No pude bajar el sitemap (${res.status} ${res.statusText})`);
  }
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1].trim());
  if (urls.length === 0) {
    throw new Error("El sitemap no tiene URLs (¿formato inesperado?)");
  }
  return urls;
}

async function main() {
  log(`Host: ${HOST}`);
  let urls = await getSitemapUrls();
  log(`Sitemap: ${urls.length} URLs`);

  if (match) {
    urls = urls.filter((u) => u.includes(match));
    log(`Filtro "--match ${match}": ${urls.length} URLs`);
  }

  if (urls.length === 0) {
    log("No hay URLs para enviar. Nada que hacer.");
    return;
  }

  if (dryRun) {
    log("DRY RUN — estas URLs se enviarian:");
    urls.forEach((u) => process.stdout.write(`  ${u}\n`));
    return;
  }

  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  // IndexNow devuelve 200 (ok) o 202 (aceptado, en cola). Otros = problema.
  if (res.status === 200 || res.status === 202) {
    log(`OK (${res.status}): ${urls.length} URLs enviadas a IndexNow.`);
    return;
  }

  const text = await res.text().catch(() => "");
  throw new Error(`IndexNow respondio ${res.status} ${res.statusText}. ${text}`);
}

main().catch((err) => {
  log(`ERROR: ${err.message}`);
  process.exit(1);
});
