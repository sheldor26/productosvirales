#!/usr/bin/env node
// Publica un post, un carrusel, una Historia o un Reel en Instagram vía la
// Graph API oficial de Meta.
// Uso:
//   node scripts/publicar-instagram.cjs feed     ruta/a/imagen.png "Copy del post"
//   node scripts/publicar-instagram.cjs carousel ruta/img1.png,ruta/img2.png "Copy del post"
//   node scripts/publicar-instagram.cjs story    ruta/a/imagen.png
//   node scripts/publicar-instagram.cjs reel     https://url-publica-del-video.mp4 "Copy del post"
//
// Reels: a diferencia de feed/story/carousel, el video NO se sube a Vercel
// Blob acá — recibe directo una URL pública ya alojada (ej. el CDN de
// JSON2Video), porque el archivo generado no vive en este repo. Si en el
// futuro se genera el video localmente, se puede sumar un uploadVideoToBlob
// análogo a uploadImageToBlob. El procesamiento de video de Meta tarda más
// que el de imagen, por eso waitUntilReady tiene más intentos/delay para
// este tipo. Elegible para la pestaña Reels (no solo como video post
// suelto): 9:16 y entre 5 y 90 segundos.
// El carrusel saca 2-3x más alcance que la misma imagen sola en Instagram
// (investigación de alcance 2026-08-13, ver memoria reglas-alcance-redes-sociales-2026):
// si el usuario no interactúa con la primera foto, Instagram vuelve a
// mostrar el post más tarde arrancando por la segunda. Usar carrusel de
// precio + beneficios siempre que se generen las 2 imágenes del producto.
//
// Requiere las variables IG_ACCESS_TOKEN, IG_BUSINESS_ACCOUNT_ID y
// BLOB_READ_WRITE_TOKEN ya exportadas en el entorno antes de correr esto
// (mismo criterio que el resto de scripts/*.cjs — no cargan .env solos).
// Ver .env.example para cómo conseguir cada una.
//   set -a; source .env; set +a; node scripts/publicar-instagram.cjs ...
//
// Flujo: sube la imagen a Vercel Blob (la API de Instagram exige URL pública,
// no acepta archivos locales) -> crea el contenedor de medio -> espera a que
// esté listo -> publica. Las Historias no admiten caption vía API (Meta no
// expone ese campo para media_type=STORIES), si se pasa uno para una story
// se ignora con aviso.

const fs = require("fs");
const path = require("path");
const { put } = require("@vercel/blob");

// Versión de la Graph API al momento de escribir este script. Si Meta la
// deprecia, actualizar acá — el error de la API lo va a decir explícitamente.
//
// Usa graph.instagram.com (no graph.facebook.com): la app está configurada
// con el flujo "API setup with Instagram login", que emite tokens (prefijo
// IGAA...) válidos solo contra ese host. graph.facebook.com es para el otro
// flujo ("API setup with Facebook login", vía Página de FB) y devuelve
// "Cannot parse access token" con un token de este tipo.
const GRAPH_API_VERSION = "v21.0";
const GRAPH_API_BASE = `https://graph.instagram.com/${GRAPH_API_VERSION}`;

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Falta la variable de entorno ${name}. Revisá .env.example.`);
    process.exit(1);
  }
  return value;
}

async function uploadImageToBlob(filePath) {
  const token = requireEnv("BLOB_READ_WRITE_TOKEN");
  const filename = `ig-posts/${Date.now()}-${path.basename(filePath)}`;
  const fileBuffer = fs.readFileSync(filePath);
  const { url } = await put(filename, fileBuffer, {
    access: "public",
    token,
    contentType: "image/png",
  });
  return url;
}

async function createMediaContainer({ igUserId, accessToken, imageUrl, mediaType, caption }) {
  const params = new URLSearchParams({
    image_url: imageUrl,
    access_token: accessToken,
  });
  if (mediaType === "STORIES") {
    params.set("media_type", "STORIES");
  } else if (caption) {
    params.set("caption", caption);
  }

  const res = await fetch(`${GRAPH_API_BASE}/${igUserId}/media?${params.toString()}`, {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Error creando el contenedor: ${JSON.stringify(data)}`);
  }
  return data.id;
}

// Item de carrusel: mismo endpoint que un post normal, pero con
// is_carousel_item=true y SIN caption (el caption va solo en el
// contenedor padre que agrupa los items).
async function createCarouselItemContainer({ igUserId, accessToken, imageUrl }) {
  const params = new URLSearchParams({
    image_url: imageUrl,
    is_carousel_item: "true",
    access_token: accessToken,
  });

  const res = await fetch(`${GRAPH_API_BASE}/${igUserId}/media?${params.toString()}`, {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Error creando item de carrusel: ${JSON.stringify(data)}`);
  }
  return data.id;
}

// Contenedor padre que agrupa los items ya creados (sus IDs, no las URLs)
// en un solo post de carrusel.
async function createCarouselContainer({ igUserId, accessToken, childrenIds, caption }) {
  const params = new URLSearchParams({
    media_type: "CAROUSEL",
    children: childrenIds.join(","),
    access_token: accessToken,
  });
  if (caption) {
    params.set("caption", caption);
  }

  const res = await fetch(`${GRAPH_API_BASE}/${igUserId}/media?${params.toString()}`, {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Error creando el contenedor de carrusel: ${JSON.stringify(data)}`);
  }
  return data.id;
}

async function createReelContainer({ igUserId, accessToken, videoUrl, caption }) {
  const params = new URLSearchParams({
    media_type: "REELS",
    video_url: videoUrl,
    access_token: accessToken,
  });
  if (caption) {
    params.set("caption", caption);
  }

  const res = await fetch(`${GRAPH_API_BASE}/${igUserId}/media?${params.toString()}`, {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Error creando el contenedor del Reel: ${JSON.stringify(data)}`);
  }
  return data.id;
}

async function waitUntilReady(containerId, accessToken, { maxAttempts = 10, delayMs = 2000 } = {}) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const params = new URLSearchParams({
      fields: "status_code,status",
      access_token: accessToken,
    });
    const res = await fetch(`${GRAPH_API_BASE}/${containerId}?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(`Error consultando estado del contenedor: ${JSON.stringify(data)}`);
    }
    if (data.status_code === "FINISHED") return;
    if (data.status_code === "ERROR") {
      throw new Error(`El contenedor falló al procesarse: ${JSON.stringify(data)}`);
    }
    console.log(`Contenedor todavía procesando (${data.status_code}), esperando...`);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  throw new Error("El contenedor no terminó de procesarse a tiempo.");
}

async function publishContainer({ igUserId, accessToken, creationId }) {
  const params = new URLSearchParams({
    creation_id: creationId,
    access_token: accessToken,
  });
  const res = await fetch(`${GRAPH_API_BASE}/${igUserId}/media_publish?${params.toString()}`, {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Error publicando: ${JSON.stringify(data)}`);
  }
  return data.id;
}

async function publishFeedOrStory({ tipo, imagePath, caption, igUserId, accessToken }) {
  if (!fs.existsSync(imagePath)) {
    console.error(`No existe el archivo: ${imagePath}`);
    process.exit(1);
  }
  if (tipo === "story" && caption) {
    console.warn('Aviso: las Historias no admiten caption vía API, se ignora el texto pasado.');
  }
  const mediaType = tipo === "story" ? "STORIES" : undefined;

  console.log("Subiendo imagen a Vercel Blob...");
  const imageUrl = await uploadImageToBlob(imagePath);
  console.log(`Imagen pública en: ${imageUrl}`);

  console.log("Creando contenedor de medio...");
  const creationId = await createMediaContainer({ igUserId, accessToken, imageUrl, mediaType, caption });
  console.log(`Contenedor creado: ${creationId}`);

  console.log("Esperando a que Instagram procese la imagen...");
  await waitUntilReady(creationId, accessToken);

  console.log("Publicando...");
  const mediaId = await publishContainer({ igUserId, accessToken, creationId });
  console.log(`¡Publicado! ID: ${mediaId}`);
}

async function publishReel({ videoUrl, caption, igUserId, accessToken }) {
  if (!/^https?:\/\//.test(videoUrl)) {
    console.error("El Reel necesita una URL pública de video (http/https), no una ruta local.");
    process.exit(1);
  }

  console.log(`Video público en: ${videoUrl}`);

  console.log("Creando contenedor del Reel...");
  const creationId = await createReelContainer({ igUserId, accessToken, videoUrl, caption });
  console.log(`Contenedor creado: ${creationId}`);

  console.log("Esperando a que Instagram procese el video (puede tardar más que una imagen)...");
  await waitUntilReady(creationId, accessToken, { maxAttempts: 30, delayMs: 5000 });

  console.log("Publicando...");
  const mediaId = await publishContainer({ igUserId, accessToken, creationId });
  console.log(`¡Publicado! ID: ${mediaId}`);
}

async function publishCarousel({ imagePathsArg, caption, igUserId, accessToken }) {
  const imagePaths = imagePathsArg.split(",").map((p) => p.trim());
  if (imagePaths.length < 2 || imagePaths.length > 10) {
    console.error("Un carrusel necesita entre 2 y 10 imágenes (límite de Instagram).");
    process.exit(1);
  }
  for (const imagePath of imagePaths) {
    if (!fs.existsSync(imagePath)) {
      console.error(`No existe el archivo: ${imagePath}`);
      process.exit(1);
    }
  }

  const childrenIds = [];
  for (const imagePath of imagePaths) {
    console.log(`Subiendo ${imagePath} a Vercel Blob...`);
    const imageUrl = await uploadImageToBlob(imagePath);
    console.log(`Imagen pública en: ${imageUrl}`);

    console.log("Creando item de carrusel...");
    const itemId = await createCarouselItemContainer({ igUserId, accessToken, imageUrl });
    console.log(`Item creado: ${itemId}`);

    console.log("Esperando a que Instagram procese la imagen...");
    await waitUntilReady(itemId, accessToken);

    childrenIds.push(itemId);
  }

  console.log("Creando contenedor de carrusel...");
  const creationId = await createCarouselContainer({ igUserId, accessToken, childrenIds, caption });
  console.log(`Contenedor de carrusel creado: ${creationId}`);

  console.log("Esperando a que Instagram procese el carrusel...");
  await waitUntilReady(creationId, accessToken);

  console.log("Publicando...");
  const mediaId = await publishContainer({ igUserId, accessToken, creationId });
  console.log(`¡Publicado! ID: ${mediaId}`);
}

async function main() {
  const [, , tipo, imagePathArg, caption] = process.argv;

  if (!tipo || !imagePathArg || !["feed", "story", "carousel", "reel"].includes(tipo)) {
    console.error(
      'Uso: node scripts/publicar-instagram.cjs <feed|story> <ruta-imagen> ["caption"]\n' +
      '     node scripts/publicar-instagram.cjs carousel <img1,img2,...> ["caption"]\n' +
      '     node scripts/publicar-instagram.cjs reel <url-publica-del-video> ["caption"]'
    );
    process.exit(1);
  }

  const accessToken = requireEnv("IG_ACCESS_TOKEN");
  const igUserId = requireEnv("IG_BUSINESS_ACCOUNT_ID");

  if (tipo === "carousel") {
    await publishCarousel({ imagePathsArg: imagePathArg, caption, igUserId, accessToken });
  } else if (tipo === "reel") {
    await publishReel({ videoUrl: imagePathArg, caption, igUserId, accessToken });
  } else {
    await publishFeedOrStory({ tipo, imagePath: imagePathArg, caption, igUserId, accessToken });
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
