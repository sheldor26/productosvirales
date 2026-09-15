#!/usr/bin/env node
// Genera un video MP4 (1080x1920, Reels) a partir de las dos tarjetas PNG ya
// generadas para un producto (precio + beneficios), con un efecto de
// pan/zoom (Ken Burns) sobre cada una. Primera versión: sin audio.
// Uso: node scripts/generar-video-reel.cjs <precio.png> <beneficios.png> [salida.mp4]
//
// No regenera las imágenes — las toma como ya hechas por
// scripts/generar-imagen-post-threads.cjs y scripts/generar-imagen-beneficios-threads.cjs
// (ambas 1080x1350). Reels espera 9:16 (1080x1920): en vez de recortar la
// tarjeta (perdería el precio), se rellena arriba/abajo con el stop medio
// del degradé de marca (#F9EEFA, threads-post-template.html) en vez de negro.

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const FFMPEG_PATH = process.env.FFMPEG_PATH || "ffmpeg";
const SECONDS_PER_IMAGE = 4;
const FPS = 25;
const PAD_COLOR = "0xF9EEFA";

function main() {
  const [, , precioPath, beneficiosPath, outputArg] = process.argv;

  if (!precioPath || !beneficiosPath) {
    console.error(
      "Uso: node scripts/generar-video-reel.cjs <precio.png> <beneficios.png> [salida.mp4]"
    );
    process.exit(1);
  }
  if (!fs.existsSync(precioPath)) {
    console.error(`No existe el archivo: ${precioPath}`);
    process.exit(1);
  }
  if (!fs.existsSync(beneficiosPath)) {
    console.error(`No existe el archivo: ${beneficiosPath}`);
    process.exit(1);
  }

  const outPath = outputArg
    ? path.resolve(outputArg)
    : path.join(fs.mkdtempSync(path.join(require("os").tmpdir(), "pv-reel-")), "reel.mp4");

  // zoompan's `d` ya multiplica frames de salida POR cada frame de entrada
  // que recibe — si el input (`-loop 1 -t N`) emite N*fps frames, zoompan
  // multiplica ESO por `d` de nuevo (bug clásico: termina generando
  // N*fps*d frames en vez de d). El fix es no acotar el input con `-t` y en
  // cambio recortar la salida de cada rama con `trim`, para que la
  // grilla de filtros solo tire de 1 frame de entrada por imagen.
  const zoomFrames = SECONDS_PER_IMAGE * FPS;
  const filterComplex =
    `[0:v]scale=2160:2700,zoompan=z='min(zoom+0.0008,1.15)':d=${zoomFrames}:s=1080x1350:fps=${FPS},` +
    `trim=end_frame=${zoomFrames},setpts=PTS-STARTPTS,` +
    `pad=1080:1920:0:(1920-1350)/2:color=${PAD_COLOR}[v0];` +
    `[1:v]scale=2160:2700,zoompan=z='min(zoom+0.0008,1.15)':d=${zoomFrames}:s=1080x1350:fps=${FPS},` +
    `trim=end_frame=${zoomFrames},setpts=PTS-STARTPTS,` +
    `pad=1080:1920:0:(1920-1350)/2:color=${PAD_COLOR}[v1];` +
    `[v0][v1]concat=n=2:v=1:a=0[outv]`;

  execFileSync(
    FFMPEG_PATH,
    [
      "-y",
      "-loop", "1", "-i", precioPath,
      "-loop", "1", "-i", beneficiosPath,
      "-filter_complex", filterComplex,
      "-map", "[outv]",
      "-r", String(FPS),
      "-pix_fmt", "yuv420p",
      "-c:v", "libx264",
      "-movflags", "+faststart",
      "-an",
      outPath,
    ],
    { stdio: "inherit" }
  );

  console.log(outPath);
}

main();
