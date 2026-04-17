const fs = require('fs');
const https = require('https');
const path = require('path');

const outDir = 'C:/Users/juanm/OneDrive/Escritorio/perfumes-imagenes';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// 35 perfume IDs in original order with friendly filenames
const mapping = [
  ['MLA24605489', '01-AlWataniah-BareeqAlDhahad-100ml'],
  ['MLAU3812360798', '02-MandarineSky-Arabe-100ml'],
  ['MLAU3798337289', '03-AsadBourbonMarron-100ml'],
  ['MLA52883777', '04-Set4Perfumes-Tubo-35ml-Unisex'],
  ['MLAU3407622515', '05-Jamal-Perfumero-Recargable'],
  ['MLAU3800115477', '06-Kit4Perfumes-Tubito-35ml-Hombre'],
  ['MLAU3671070084', '07-ErbaPura-Arabe-100ml'],
  ['MLA22234109', '08-Lattafa-QaedAlFursan-90ml'],
  ['MLA19715215', '09-Asad-LattafaIntense-Hombre'],
  ['MLA29780185', '10-Rasasi-HawasIce-100ml'],
  ['MLA54145870', '11-Lattafa-Habik-100ml'],
  ['MLA29077943', '12-Lattafa-VintageRadioPride-100ml'],
  ['MLA60836327', '13-Lattafa-YaraElixir-100ml'],
  ['MLA41306043', '14-Rasasi-HawasBlack-100ml-Unisex'],
  ['MLA25883660', '15-Lattafa-Mayar-100ml'],
  ['MLA31178643', '16-Lattafa-KhamrahQahwa-100ml'],
  ['MLA19053146', '17-Bharara-King-100ml'],
  ['MLA27855490', '18-MaisonAlhambra-SceptreMalachite-100ml'],
  ['MLA41304983', '19-Lattafa-HerConfession-100ml'],
  ['MLA49628348', '20-SabahAlWard-Mujer-100ml'],
  ['MLAU3562485598', '21-AsadNegro-100ml-Generico'],
  ['MLA53013853', '22-Lattafa-Khamrah-100ml'],
  ['MLA19846768', '23-Afnan-9PM-100ml-Caballero'],
  ['MLAU3452900219', '24-Armaf-OdysseyMandarinSky-100ml'],
  ['MLA47054851', '25-Afnan-9PM-100ml'],
  ['MLA40157772', '26-JamalOud-ButterflyEffect-Feromonas'],
  ['MLA43643712', '27-Lattafa-BadeeAlOudNobleBlush-Mujer'],
  ['MLA40521028', '28-Lattafa-YaraTous-Mujer-100ml'],
  ['MLA53394464', '29-Afnan-9PMElixir-100ml'],
  ['MLA28060225', '30-Lattafa-FakharWoman-100ml'],
  ['MLA37755803', '31-Lattafa-MaahirLegacy-100ml'],
  ['MLA41178086', '32-Lattafa-TheKingdomMan-100ml'],
  ['MLA16122300', '33-Armaf-ClubDeNuitIntenseMan-200ml'],
  ['MLA32488004', '34-Lattafa-FakharPrideGoldExtract-Unisex'],
  ['MLA28754461', '35-Lattafa-Emeer-CajaConLuces-100ml'],
];

const content = fs.readFileSync('src/data/curated-products.ts', 'utf8');

function download(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://productosvirales.com.ar/',
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, filepath).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('HTTP ' + res.statusCode));
      }
      const file = fs.createWriteStream(filepath);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
      file.on('error', reject);
    }).on('error', reject);
  });
}

(async () => {
  let ok = 0, miss = 0, err = 0;
  for (const [id, name] of mapping) {
    // Find image URL in curated-products.ts for this id
    const re = new RegExp('id:\\s*[\'"]' + id + '[\'"][\\s\\S]*?image:\\s*[\'"]([^\'"]+)[\'"]');
    const m = content.match(re);
    if (!m) {
      console.log('MISS ' + id + ' — not in curated-products');
      miss++;
      continue;
    }
    const url = m[1];
    const ext = url.match(/\.(\w+)(?:\?|$)/)?.[1] || 'webp';
    const filepath = path.join(outDir, name + '.' + ext);
    try {
      await download(url, filepath);
      console.log('OK ' + name + '.' + ext);
      ok++;
    } catch (e) {
      console.log('ERR ' + name + ' — ' + e.message);
      err++;
    }
    await new Promise(r => setTimeout(r, 200));
  }
  console.log(`\n${ok}/${mapping.length} downloaded — ${err} errors, ${miss} missing`);
  console.log('Saved to: ' + outDir);
})();
