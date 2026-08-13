#!/usr/bin/env node
// Publica un post o una Historia en Instagram vía la Graph API oficial de Meta.
// Uso:
//   node scripts/publicar-instagram.cjs feed  ruta/a/imagen.png "Copy del post"
//   node scripts/publicar-instagram.cjs story ruta/a/imagen.png
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

async function main() {
  const [, , tipo, imagePath, caption] = process.argv;

  if (!tipo || !imagePath || !["feed", "story"].includes(tipo)) {
    console.error('Uso: node scripts/publicar-instagram.cjs <feed|story> <ruta-imagen> ["caption"]');
    process.exit(1);
  }
  if (!fs.existsSync(imagePath)) {
    console.error(`No existe el archivo: ${imagePath}`);
    process.exit(1);
  }
  if (tipo === "story" && caption) {
    console.warn('Aviso: las Historias no admiten caption vía API, se ignora el texto pasado.');
  }

  const accessToken = requireEnv("IG_ACCESS_TOKEN");
  const igUserId = requireEnv("IG_BUSINESS_ACCOUNT_ID");
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

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
