/**
 * Revisa qué palabras alemanas de las unidades NO tienen traducción al tocarlas.
 * Uso: npx tsx scripts/coverage.ts [nivel]
 */
import { allUnits } from "../src/content/de/units";
import { lookup, maxPhraseWords } from "../src/content/de/dictionary";

const level = process.argv[2];
const strings: string[] = [];
const walk = (v: unknown, key = "") => {
  if (typeof v === "string") {
    if (["de", "sentence", "statement", "context", "model", "audio", "title", ""].includes(key) || key === "cell" || key === "opt" || key === "word") strings.push(v);
    return;
  }
  if (Array.isArray(v)) {
    const k = key === "rows" ? "cell" : key === "options" ? "opt" : key === "words" ? "word" : key === "columns" ? "cell" : "";
    v.forEach((x) => walk(x, Array.isArray(x) ? "rows" : k));
    return;
  }
  if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) if (!["es", "en", "tr", "id", "type", "illustration", "level", "speakers", "speaker", "voice"].includes(k)) walk(x, k);
};

const missing = new Map<string, number>();
for (const u of allUnits) {
  if (level && u.level !== level) continue;
  strings.length = 0;
  walk(u);
  for (const s of strings) {
    const toks = [...s.replace(/\*\*/g, "").matchAll(/\p{L}[\p{L}'’-]*/gu)].map((m) => m[0]);
    let i = 0;
    while (i < toks.length) {
      let matched = 0;
      for (let n = Math.min(4, maxPhraseWords()); n >= 1; n--) {
        if (i + n > toks.length) continue;
        const p = toks.slice(i, i + n).join(" ");
        if (lookup(p) || lookup(p.replace(/[?!.]$/, ""))) { matched = n; break; }
      }
      if (matched) i += matched;
      else {
        const w = toks[i];
        if (!/^[A-Z]{1,3}$/.test(w)) missing.set(w, (missing.get(w) ?? 0) + 1);
        i++;
      }
    }
  }
}
const list = [...missing.entries()].sort((a, b) => b[1] - a[1]);
console.log(`${list.length} palabras sin traducción`);
console.log(list.map(([w, n]) => `${w}(${n})`).join(" "));
