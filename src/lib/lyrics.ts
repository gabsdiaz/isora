/**
 * Huecos para completar la letra de una canción.
 * Elige palabras útiles (sobre todo las de `focus`) de forma reproducible con una semilla.
 */
import type { Song } from "@/content/de/songs";

export type Difficulty = "leicht" | "mittel" | "schwer";
export type Token = { text: string; word: boolean };
export type Blank = { id: string; line: number; token: number; answer: string; options?: string[] };
export type LyricsLine = { index: number; stanza: number; de: string; tokens: Token[]; tr: Song["stanzas"][number][number]["tr"] };

const STOP = new Set(
  "der die das den dem des ein eine einen einem einer eines und oder aber ist sind war hat haben nicht nur auch wie was wer wo dass mit von aus auf für bei zum zur ins im in an am es sie ihr ihm ihn ich du er wir uns euch mich dich sich mir dir so da nun ja noch schon ganz gar sehr doch als wenn kann will mag lasset dabei".split(
    " ",
  ),
);

export function tokenize(line: string): Token[] {
  return Array.from(line.matchAll(/([\p{L}’']+)|([^\p{L}’']+)/gu), (m) => ({ text: m[0], word: Boolean(m[1]) }));
}

export function songLines(song: Song): LyricsLine[] {
  const out: LyricsLine[] = [];
  song.stanzas.forEach((st, si) => st.forEach((l) => out.push({ index: out.length, stanza: si, de: l.de, tr: l.tr, tokens: tokenize(l.de) })));
  return out;
}

/** Generador pseudoaleatorio con semilla (mulberry32) */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hash = (s: string) => Array.from(s).reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0, 7);

export function makeBlanks(song: Song, difficulty: Difficulty, round: number): Blank[] {
  const lines = songLines(song);
  const rand = rng(hash(`${song.id}|${difficulty}|${round}`));
  const focus = new Set(song.focus.map((f) => f.toLowerCase()));
  const isCandidate = (t: Token) => t.word && /^\p{L}{3,}$/u.test(t.text) && (focus.has(t.text.toLowerCase()) || !STOP.has(t.text.toLowerCase()));
  const share = difficulty === "leicht" ? 0 : difficulty === "mittel" ? 0.3 : 0.55;

  const blanks: Blank[] = [];
  for (const line of lines) {
    const cands = line.tokens.map((t, i) => ({ t, i })).filter(({ t }) => isCandidate(t));
    if (!cands.length) continue;
    // Prioridad: palabras de vocabulario, luego al azar
    const ranked = cands.map((c) => ({ ...c, score: (focus.has(c.t.text.toLowerCase()) ? 1 : 0) + rand() * 0.9 })).sort((a, b) => b.score - a.score);
    const n = difficulty === "leicht" ? 1 : Math.max(1, Math.round(cands.length * share));
    for (const c of ranked.slice(0, n)) blanks.push({ id: `${line.index}-${c.i}`, line: line.index, token: c.i, answer: c.t.text });
  }
  blanks.sort((a, b) => a.line - b.line || a.token - b.token);

  if (difficulty === "leicht") {
    // Opciones: la respuesta + 3 palabras de la canción, de largo parecido
    const seen = new Map<string, string>();
    lines.forEach((l) => l.tokens.filter(isCandidate).forEach((t) => !seen.has(t.text.toLowerCase()) && seen.set(t.text.toLowerCase(), t.text)));
    const pool = [...seen.values()];
    for (const b of blanks) {
      const others = pool
        .filter((w) => w.toLowerCase() !== b.answer.toLowerCase())
        .map((w) => ({ w, s: Math.abs(w.length - b.answer.length) + rand() * 3 }))
        .sort((x, y) => x.s - y.s)
        .slice(0, 3)
        .map((x) => x.w);
      b.options = [...others, b.answer].map((w) => ({ w, s: rand() })).sort((x, y) => x.s - y.s).map((x) => x.w);
    }
  }
  return blanks;
}

/** Compara sin importar mayúsculas y aceptando ae/oe/ue/ss en vez de ä/ö/ü/ß. */
export function sameWord(a: string, b: string) {
  const n = (s: string) =>
    s
      .toLowerCase()
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .replace(/[^a-z]/g, "");
  return n(a) === n(b) && n(a).length > 0;
}
