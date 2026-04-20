const fs = require('fs');
const https = require('https');

// Same 35 perfume IDs from the original import (scripts/import-perfumes.cjs)
const items = [
  ['https://www.mercadolibre.com.ar/al-wataniah-bareeq-al-dhahad-edp-100ml-para-hombre/p/MLA24605489', 'MLA24605489'],
  ['https://www.mercadolibre.com.ar/perfume-mandarine-sky-arabe-masculino-100ml-generico/up/MLAU3812360798', 'MLAU3812360798'],
  ['https://www.mercadolibre.com.ar/perfume-de-hombre-asad-bourbon-marron-100ml-arabe-generico/up/MLAU3798337289', 'MLAU3798337289'],
  ['https://www.mercadolibre.com.ar/set-de-4-perfumes-tubo-fragancias-arabes-de-35ml-unisex/p/MLA52883777', 'MLA52883777'],
  ['https://www.mercadolibre.com.ar/perfume-hombre-jamal-arabe-perfumero-recargable-be-nacional/up/MLAU3407622515', 'MLAU3407622515'],
  ['https://www.mercadolibre.com.ar/kit-x-4-perfumes-tubito-fragancias-arabes-x-35ml-para-hombre/up/MLAU3800115477', 'MLAU3800115477'],
  ['https://www.mercadolibre.com.ar/perfume-erba-pura-arabe-masculino-100ml-generico/up/MLAU3671070084', 'MLAU3671070084'],
  ['https://www.mercadolibre.com.ar/lattafa-qaed-al-fursan-eau-de-parfum-90ml/p/MLA22234109', 'MLA22234109'],
  ['https://www.mercadolibre.com.ar/asad-lattafa-intense-hombre-edp-arabe-elegante-sexy/p/MLA19715215', 'MLA19715215'],
  ['https://www.mercadolibre.com.ar/perfume-hombre-rasasi-hawas-ice-edp-100ml/p/MLA29780185', 'MLA29780185'],
  ['https://www.mercadolibre.com.ar/lattafa-habik-for-men-eau-de-parfum-100-ml/p/MLA54145870', 'MLA54145870'],
  ['https://www.mercadolibre.com.ar/perfume-vintage-radio-lattafa-pride-100-ml/p/MLA29077943', 'MLA29077943'],
  ['https://www.mercadolibre.com.ar/perfume-lattafa-yara-elixir-edp-100ml/p/MLA60836327', 'MLA60836327'],
  ['https://www.mercadolibre.com.ar/perfume-rasasi-hawas-black-100ml-eau-de-parfum-aromatico-frutal-unisex/p/MLA41306043', 'MLA41306043'],
  ['https://www.mercadolibre.com.ar/lattafa-mayar-edp-x100ml/p/MLA25883660', 'MLA25883660'],
  ['https://www.mercadolibre.com.ar/perfume-lattafa-khamrah-qahwa-edp-100ml/p/MLA31178643', 'MLA31178643'],
  ['https://www.mercadolibre.com.ar/bharara-king-eau-de-parfum-100ml-para-hombre/p/MLA19053146', 'MLA19053146'],
  ['https://www.mercadolibre.com.ar/perfume-arabe-maison-alhambra-sceptre-malachite-edp-100-ml/p/MLA27855490', 'MLA27855490'],
  ['https://www.mercadolibre.com.ar/lattafa-her-confession-eau-de-parfum-100ml-volumen-de-la-unidad-100-ml/p/MLA41304983', 'MLA41304983'],
  ['https://www.mercadolibre.com.ar/perfume-sabah-al-ward-mujer-eau-de-parfum-100-ml-floral-oriental/p/MLA49628348', 'MLA49628348'],
  ['https://www.mercadolibre.com.ar/perfume-asad-negro-100ml-estilo-arabe-exquisito-generico/up/MLAU3562485598', 'MLAU3562485598'],
  ['https://www.mercadolibre.com.ar/perfume-lattafa-khamrah-edp-100ml/p/MLA53013853', 'MLA53013853'],
  ['https://www.mercadolibre.com.ar/perfume-afnan-9pm-100-ml-eau-de-parfum-para-caballero/p/MLA19846768', 'MLA19846768'],
  ['https://www.mercadolibre.com.ar/perfume-armaf-odyssey-mandarin-sky-limited-edition-edp-100-m/up/MLAU3452900219', 'MLAU3452900219'],
  ['https://www.mercadolibre.com.ar/perfume-afnan-9-pm-100-ml-eau-de-parfum/p/MLA47054851', 'MLA47054851'],
  ['https://www.mercadolibre.com.ar/perfume-arabe-hombre-masculino-jamal-oud-feromonas-eau-parfum-amaderado-cuero-intenso-larga-duracion-spray-seductor-butterfly-effect-industria-argentina-vegano-cruelty-free-oriental-especiado-vainilla/p/MLA40157772', 'MLA40157772'],
  ['https://www.mercadolibre.com.ar/perfume-mujer-lattafa-badee-al-oud-noble-blush-edp-100ml/p/MLA43643712', 'MLA43643712'],
  ['https://www.mercadolibre.com.ar/perfume-arabe-yara-tous-lattafa-eau-de-parfum-mujer-100-ml/p/MLA40521028', 'MLA40521028'],
  ['https://www.mercadolibre.com.ar/perfume-afnan-9-pm-elixir-100ml/p/MLA53394464', 'MLA53394464'],
  ['https://www.mercadolibre.com.ar/edp-lattafa-fakhar-woman-x-100-ml/p/MLA28060225', 'MLA28060225'],
  ['https://www.mercadolibre.com.ar/lattafa-maahir-legacy-eau-de-parfum-100ml-premium/p/MLA37755803', 'MLA37755803'],
  ['https://www.mercadolibre.com.ar/perfume-hombre-lattafa-the-kingdom-man-100-ml/p/MLA41178086', 'MLA41178086'],
  ['https://www.mercadolibre.com.ar/armaf-club-de-nuit-intense-man-edp-200ml/p/MLA16122300', 'MLA16122300'],
  ['https://www.mercadolibre.com.ar/perfume-unisex-fakhar-lattafa-pride-gold-extract-edp-100-ml/p/MLA32488004', 'MLA32488004'],
  ['https://www.mercadolibre.com.ar/lattafa-emeer-eau-de-parfum-arabe-caja-con-luces-de-100-ml/p/MLA28754461', 'MLA28754461'],
];

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'es-AR,es;q=0.9',
      },
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchHtml(res.headers.location).then(resolve, reject);
      }
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function parsePrice(html) {
  // The first "price":N occurrence in ML pages is the current price
  const m = html.match(/"price":\s*(\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : null;
}

// Read current stored prices from curated-products.ts
const src = fs.readFileSync('src/data/curated-products.ts', 'utf8');
function storedPrice(id) {
  const re = new RegExp('id:\\s*[\'"]' + id + '[\'"][\\s\\S]*?price:\\s*(\\d+(?:\\.\\d+)?)');
  const m = src.match(re);
  return m ? parseFloat(m[1]) : null;
}

(async () => {
  const results = [];
  let i = 0;
  for (const [url, id] of items) {
    i++;
    const stored = storedPrice(id);
    try {
      const html = await fetchHtml(url);
      const current = parsePrice(html);
      if (current == null) {
        console.log(`[${i}/35] FAIL ${id} — could not parse price`);
        results.push({ id, stored, current: null, diff: null });
      } else {
        const diff = stored != null ? current - stored : null;
        const flag = stored == null ? 'NEW' : Math.abs(diff) < 1 ? 'OK ' : (diff > 0 ? 'UP ' : 'DN ');
        console.log(`[${i}/35] ${flag} ${id} | stored=$${stored} → current=$${current}${diff != null && Math.abs(diff) >= 1 ? ` (${diff > 0 ? '+' : ''}$${diff.toFixed(0)})` : ''}`);
        results.push({ id, stored, current, diff });
      }
    } catch (e) {
      console.log(`[${i}/35] ERR ${id} — ${e.message}`);
      results.push({ id, stored, current: null, diff: null, error: e.message });
    }
    await new Promise(r => setTimeout(r, 400));
  }

  fs.writeFileSync('scripts/perfume-price-check.json', JSON.stringify(results, null, 2));

  const changed = results.filter(r => r.current != null && r.stored != null && Math.abs(r.diff) >= 1);
  console.log(`\nSummary: ${changed.length}/35 prices changed.`);
  if (changed.length > 0) {
    console.log('\nChanged products:');
    for (const r of changed) {
      const pct = ((r.diff / r.stored) * 100).toFixed(1);
      console.log(`  ${r.id}: $${r.stored} → $${r.current} (${r.diff > 0 ? '+' : ''}${pct}%)`);
    }
  }
})();
