/**
 * Renderiza un video a partir de su línea de tiempo.
 * Uso: node video/render.mjs de-a1-1-01 [--still=120]
 * Copia el resultado a public/videos/<clave>.mp4 (+ subtítulos y póster).
 */
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.dirname(here);
const slug = process.argv[2];
const stillArg = process.argv.find((a) => a.startsWith("--still="));
const browserExecutable = "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome";

const timeline = JSON.parse(fs.readFileSync(path.join(here, "out", `${slug}.timeline.json`), "utf8"));
const serveUrl = await bundle({ entryPoint: path.join(here, "src", "index.ts"), publicDir: path.join(here, "public") });
const composition = await selectComposition({ serveUrl, id: "Unit", inputProps: timeline, browserExecutable });

if (stillArg) {
  const frames = stillArg.split("=")[1].split(",").map(Number);
  for (const f of frames) {
    const out = path.join(here, "out", `${slug}-f${f}.png`);
    await renderStill({ composition, serveUrl, output: out, frame: f, inputProps: timeline, browserExecutable });
    console.log("still", out);
  }
  process.exit(0);
}

const tmp = path.join(here, "out", `${slug}.raw.mp4`);
let last = -1;
await renderMedia({
  composition,
  serveUrl,
  codec: "h264",
  outputLocation: tmp,
  inputProps: timeline,
  browserExecutable,
  concurrency: os.cpus().length,
  crf: 22,
  onProgress: ({ progress }) => {
    const p = Math.floor(progress * 10);
    if (p !== last) {
      last = p;
      console.log(`  ${p * 10}%`);
    }
  },
});

// Publica en la web: video liviano + subtítulos + póster
const key = timeline.key; // "de/a1-1/01"
const dest = path.join(root, "public", "videos", key);
fs.mkdirSync(path.dirname(dest), { recursive: true });
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", tmp, "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", `${dest}.mp4`]);
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", "3", "-i", `${dest}.mp4`, "-frames:v", "1", "-q:v", "3", `${dest}.jpg`]);
for (const lang of ["de", "es", "en"]) fs.copyFileSync(path.join(here, "out", `${slug}.${lang}.vtt`), `${dest}.${lang}.vtt`);
fs.unlinkSync(tmp);
const seconds = Math.round(timeline.durationInFrames / timeline.fps);

// Actualiza el registro de videos de la web
const media = path.join(root, "src", "content", "generated", "media.ts");
let src = fs.readFileSync(media, "utf8");
const m = src.match(/export const videos: Record<string, \{ duration: number \}> = (\{[\s\S]*?\});/);
const current = m ? JSON.parse(m[1]) : {};
current[key] = { duration: seconds };
src = src.replace(/export const videos: Record<string, \{ duration: number \}> = \{[\s\S]*?\};/, `export const videos: Record<string, { duration: number }> = ${JSON.stringify(current, null, 2)};`);
fs.writeFileSync(media, src);
console.log(`✓ ${key} (${seconds} s)`);
