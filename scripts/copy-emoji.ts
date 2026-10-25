/** Copia a public/emoji/ los SVG de Twemoji usados en src/content/de/images.ts (+ los extra de los videos). */
import fs from "node:fs";
import path from "node:path";
import { IMAGES, emojiCode } from "../src/content/de/images";

const src = path.join("node_modules", "@twemoji", "svg");
const dest = path.join("public", "emoji");
fs.mkdirSync(dest, { recursive: true });
const extra = ["🏫", "☎️", "🌍", "📱", "📷", "🕵️", "🛍️", "🤯", "✏️", "⏰", "🗓️", "🌓", "🎸", "🧺", "☕", "🛒", "👗", "🔑", "🏞️", "💌", "🎧", "🗣️", "🧠", "🎯", "⭐", "🔥", "✅", "❌", "💬", "👀", "🃏"];
let ok = 0;
const missing: string[] = [];
for (const e of [...new Set([...Object.values(IMAGES), ...extra])]) {
  const code = emojiCode(e);
  const candidates = [code, code.replace(/-200d/g, "-200d"), code.split("-").filter((p) => p !== "fe0f").join("-")];
  const file = candidates.map((c) => path.join(src, `${c}.svg`)).find((f) => fs.existsSync(f));
  if (file) {
    fs.copyFileSync(file, path.join(dest, `${code}.svg`));
    ok++;
  } else missing.push(`${e} (${code})`);
}
console.log(`${ok} copiados; faltan: ${missing.join(", ") || "ninguno"}`);
