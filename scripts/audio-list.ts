/**
 * Lista todos los textos que la app puede pronunciar (con su voz y su clave de archivo).
 * Uso: npx tsx scripts/audio-list.ts a1-1 > lista.json
 */
import { allUnits } from "../src/content/de/units";
import { commonVocab } from "../src/content/de/common";
import { audioKey, normalizeSpeech } from "../src/lib/speech";
import type { Voice } from "../src/content/types";

const level = process.argv[2];
const out = new Map<string, { text: string; voice: Voice }>();
const add = (text: string, voice: Voice = "m") => {
  const t = normalizeSpeech(text);
  if (t) out.set(audioKey(t, voice), { text: t, voice });
};
const head = (v: { de: string; article?: string }) => (v.article ? `${v.article} ${v.de}` : v.de);

for (const u of allUnits) {
  if (level && u.level !== level) continue;
  u.vocab.forEach((v) => add(head(v)));
  for (const b of u.theory) {
    if (b.type === "phrases") b.items.forEach((i) => add(i.de));
    if (b.type === "example") add(b.de);
  }
  for (const r of u.readings) for (const l of r.lines) add(l.de, (l.speaker && r.speakers?.[l.speaker]) || "m");
  for (const e of u.exercises) {
    if (e.type === "listen") add(e.audio, e.voice ?? "m");
    if (e.type === "order") add(e.words.join(" "));
    if (e.type === "match") e.pairs.forEach((p) => add(p.de));
  }
}
commonVocab.forEach((v) => add(head(v)));
console.log(JSON.stringify([...out.entries()].map(([key, v]) => ({ key, ...v }))));
