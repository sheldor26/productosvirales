const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Create a clean SVG without <text> (rasterized "vi" as path instead)
// Using a simple design: coral rounded rect + white "V" letter
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="28" fill="#f4b5a4"/>
  <!-- V letter as path -->
  <path d="M32 30 L58 98 L84 30" stroke="white" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Sparkle -->
  <path d="M100 24L103 33L112 36L103 39L100 48L97 39L88 36L97 33Z" fill="white" opacity="0.9"/>
</svg>`;

async function generate() {
  const svgBuf = Buffer.from(svg);

  // Generate PNG at multiple sizes
  const png48 = await sharp(svgBuf).resize(48, 48).png().toBuffer();
  const png32 = await sharp(svgBuf).resize(32, 32).png().toBuffer();
  const png16 = await sharp(svgBuf).resize(16, 16).png().toBuffer();
  const png192 = await sharp(svgBuf).resize(192, 192).png().toBuffer();

  // Save icon.png (48x48 — Google's recommended minimum)
  fs.writeFileSync(path.join('src', 'app', 'icon.png'), png48);
  console.log('OK src/app/icon.png (48x48)');

  // Save apple-icon.png (192x192)
  fs.writeFileSync(path.join('src', 'app', 'apple-icon.png'), png192);
  console.log('OK src/app/apple-icon.png (192x192)');

  // Generate ICO (contains 16x16 + 32x32 PNGs embedded)
  // ICO format: header + directory entries + image data
  const images = [
    { size: 16, data: png16 },
    { size: 32, data: png32 },
  ];

  const HEADER_SIZE = 6;
  const DIR_ENTRY_SIZE = 16;
  const headerSize = HEADER_SIZE + DIR_ENTRY_SIZE * images.length;

  let offset = headerSize;
  const dirEntries = [];
  for (const img of images) {
    dirEntries.push({
      width: img.size,
      height: img.size,
      dataSize: img.data.length,
      offset,
    });
    offset += img.data.length;
  }

  const ico = Buffer.alloc(offset);
  // ICO header: reserved(2) + type(2) + count(2)
  ico.writeUInt16LE(0, 0);      // reserved
  ico.writeUInt16LE(1, 2);      // type = ICO
  ico.writeUInt16LE(images.length, 4); // count

  let pos = HEADER_SIZE;
  for (const entry of dirEntries) {
    ico.writeUInt8(entry.width === 256 ? 0 : entry.width, pos);     // width
    ico.writeUInt8(entry.height === 256 ? 0 : entry.height, pos+1); // height
    ico.writeUInt8(0, pos+2);    // color palette
    ico.writeUInt8(0, pos+3);    // reserved
    ico.writeUInt16LE(1, pos+4); // color planes
    ico.writeUInt16LE(32, pos+6); // bits per pixel
    ico.writeUInt32LE(entry.dataSize, pos+8);  // data size
    ico.writeUInt32LE(entry.offset, pos+12);   // data offset
    pos += DIR_ENTRY_SIZE;
  }

  // Write image data
  for (const img of images) {
    img.data.copy(ico, dirEntries[images.indexOf(img)].offset);
  }

  fs.writeFileSync(path.join('src', 'app', 'favicon.ico'), ico);
  console.log('OK src/app/favicon.ico (16x16 + 32x32)');

  // Also update icon.svg to not use <text>
  fs.writeFileSync(path.join('src', 'app', 'icon.svg'), svg);
  console.log('OK src/app/icon.svg (updated, no <text>)');
}

generate().catch(console.error);
