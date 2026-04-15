const fs = require('fs');
const https = require('https');
const path = require('path');

const outDir = 'C:/Users/juanm/OneDrive/Escritorio/freidoras-imagenes';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const content = fs.readFileSync('src/data/curated-products.ts', 'utf8');
const mapping = [
  ['MLA39861162', '01-Atma-FR248ABP-8L'],
  ['MLA27351841', '02-Atma-Pro-FR60AR-6.5L'],
  ['MLA37004216', '03-Atma-FR901DP-Grill-6.3L'],
  ['MLA40161710', '04-Atma-Pro-Doble-FRD248AP-8.5L'],
  ['MLA44703897', '05-Peabody-PE-AFD650N-6.5L'],
  ['MLA41829394', '06-Peabody-PE-AFD720N-7.2L'],
  ['MLA53776810', '07-Peabody-PE-AFDL102N-Doble-Piso-10L'],
  ['MLA23318618', '08-Peabody-PE-AFG01IX-Grill-6L'],
  ['MLA61393261', '09-Philips-NA12000-4.2L'],
  ['MLA55779230', '10-Philips-PHNA35100-Doble-9L'],
  ['MLA53675940', '11-Philips-PHNA23100-6.2L'],
  ['MLA19630913', '12-Philips-HD9280-Essential-XL'],
  ['MLA19630911', '13-Philips-HD9270-Essential-6.2L'],
  ['MLA28709303', '14-Oster-Dual-7.6L'],
  ['MLA41041543', '15-Oster-Digital-Ventana-4L'],
  ['MLA62320294', '16-Ninja-Crispi-5.2L'],
  ['MLA36974228', '17-PowerXL-3.8L'],
  ['MLA42113760', '18-Kanji-Home-KJH1700DC-8L'],
  ['MLA44142280', '19-Gadnic-6.5L'],
  ['MLA54106293', '20-Suono-Airfryer-10L'],
];

function download(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error('HTTP ' + res.statusCode));
        return;
      }
      const file = fs.createWriteStream(filepath);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
      file.on('error', reject);
    }).on('error', reject);
  });
}

(async () => {
  let ok = 0;
  for (const [id, name] of mapping) {
    const re = new RegExp("id: '" + id + "'[\\s\\S]*?image: '([^']+)'");
    const m = content.match(re);
    if (!m) { console.log('MISS ' + name); continue; }
    const url = m[1];
    const ext = url.endsWith('.jpg') ? 'jpg' : 'webp';
    const filepath = path.join(outDir, name + '.' + ext);
    try {
      await download(url, filepath);
      console.log('OK ' + name + '.' + ext);
      ok++;
    } catch (e) {
      console.log('ERR ' + name + ' - ' + e.message);
    }
  }
  console.log('\n' + ok + '/20 descargadas en ' + outDir);
})();
