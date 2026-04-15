const fs = require('fs');
const path = require('path');

const src = 'C:/Users/juanm/OneDrive/Escritorio/freidoras-imagenes';
const dst = 'public/images/freidoras';

const map = [
  ['01-Atma-FR248ABP-8L.webp', 'atma-fr248abp-8l.webp'],
  ['02-Atma-Pro-FR60AR-6.5L.webp', 'atma-pro-fr60ar-6-5l.webp'],
  ['03-Atma-FR901DP-Grill-6.3L.webp', 'atma-fr901dp-grill.webp'],
  ['04-Atma-Pro-Doble-FRD248AP-8.5L.webp', 'atma-pro-doble-frd248ap.webp'],
  ['05-Peabody-PE-AFD650N-6.5L.webp', 'peabody-pe-afd650n.webp'],
  ['06-Peabody-PE-AFD720N-7.2L.webp', 'peabody-pe-afd720n-visor.webp'],
  ['07-Peabody-PE-AFDL102N-Doble-Piso-10L.webp', 'peabody-pe-afdl102n-10l.webp'],
  ['08-Peabody-PE-AFG01IX-Grill-6L.webp', 'peabody-pe-afg01ix-grill.webp'],
  ['09-Philips-NA12000-4.2L.webp', 'philips-na12000-4-2l.webp'],
  ['10-Philips-PHNA35100-Doble-9L.webp', 'philips-phna35100-doble.webp'],
  ['11-Philips-PHNA23100-6.2L.webp', 'philips-phna23100-13en1.webp'],
  ['12-Philips-HD9280-Essential-XL.webp', 'philips-hd9280-xl.webp'],
  ['13-Philips-HD9270-Essential-6.2L.webp', 'philips-hd9270-6-2l.webp'],
  ['14-Oster-Dual-7.6L.webp', 'oster-dual-7-6l-diamondforce.webp'],
  ['15-Oster-Digital-Ventana-4L.webp', 'oster-digital-ventana-4l.webp'],
  ['16-Ninja-Crispi-5.2L.webp', 'ninja-crispi-5-2l.webp'],
  ['17-PowerXL-3.8L.webp', 'powerxl-af-e4001-ar-3-8l.webp'],
  ['18-Kanji-Home-KJH1700DC-8L.webp', 'kanji-home-kjh-1700dc-8l.webp'],
  ['19-Gadnic-6.5L.webp', 'gadnic-airfryer-6-5l.webp'],
  ['20-Suono-Airfryer-10L.webp', 'suono-airfryer-digital-10l.webp'],
];

if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true });

let ok = 0;
for (const [from, to] of map) {
  const a = path.join(src, from);
  const b = path.join(dst, to);
  if (!fs.existsSync(a)) { console.log('MISS ' + from); continue; }
  fs.copyFileSync(a, b);
  console.log('OK ' + to);
  ok++;
}
console.log('\n' + ok + '/' + map.length + ' copied to ' + dst);
