import type { Tr, VocabEntry } from "../types";
import { commonVocab } from "./common";
import { allUnits } from "./units";
import { STORIES, STORY_WORDS } from "./stories";

/**
 * Diccionario para "tocar una palabra".
 * Une el léxico común (common.ts) con el vocabulario de todas las unidades.
 * Cada palabra sabe de qué unidad viene (source) para subrayar las palabras nuevas.
 */
export type Gloss = {
  de: string;
  tr: Tr;
  article?: "der" | "die" | "das";
  plural?: string;
  source?: string;
  meta?: boolean;
};

const index = new Map<string, Gloss>();
let maxWords = 1;

const norm = (s: string) => s.toLowerCase().replace(/[’]/g, "'").replace(/\s+/g, " ").trim();

function add(surface: string, g: Gloss, overwrite: boolean) {
  // Sin puntuación final: "Klar!" o "Das passt." se encuentran al tocar "klar" / "das passt"
  const k = norm(surface).replace(/[.,!?;:…]+$/, "").trim();
  if (!k) return;
  if (!overwrite && index.has(k)) return;
  index.set(k, g);
  maxWords = Math.max(maxWords, k.split(" ").length);
}

function register(v: VocabEntry, source: string | undefined, overwrite: boolean) {
  const g: Gloss = { de: v.de, tr: v.tr, article: v.article, plural: v.plural, source, meta: v.meta };
  add(v.de, g, overwrite);
  if (v.article) add(`${v.article} ${v.de}`, g, overwrite);
  if (v.plural) add(v.plural, g, false);
  v.forms?.forEach((f) => add(f, g, false));
}

// 1) vocabulario de las unidades (la primera unidad donde aparece una palabra es su "origen")
for (const unit of allUnits) {
  const source = `${unit.level}/${unit.number}`;
  for (const v of unit.vocab) register(v, source, false);
}
// 2) léxico común: solo rellena lo que falte
for (const v of commonVocab) register(v, undefined, false);
// 3) palabras de las Geschichten
for (const story of STORIES)
  for (const [de, es, en, article] of story.glossary) register({ de, tr: { es, en }, article }, undefined, false);
for (const [de, es, en, article] of STORY_WORDS) register({ de, tr: { es, en }, article }, undefined, false);

const UMLAUT: Record<string, string> = { ä: "a", ö: "o", ü: "u" };
const deUmlaut = (s: string) => s.replace(/[äöü](?=[^äöü]*$)/, (c) => UMLAUT[c]);

/** Variantes simples para encontrar la forma base: adjetivos (kleine → klein), plurales (Ländern → Land),
 *  imperativos (Schreib → schreiben) y verbos conjugados (denkt → denken). */
function candidates(k: string): string[] {
  const out: string[] = [];
  if (k.length < 4) return out;
  for (const end of ["en", "em", "er", "es", "e", "n", "s"]) {
    if (k.endsWith(end) && k.length - end.length >= 3) {
      const base = k.slice(0, -end.length);
      out.push(base, deUmlaut(base));
    }
  }
  if (k.endsWith("ern")) out.push(deUmlaut(k.slice(0, -3)));
  // verbos: denkt/denkst → denken, zählt → zählen; imperativo: schreib → schreiben
  if (k.endsWith("st")) out.push(k.slice(0, -2) + "en");
  if (k.endsWith("t")) out.push(k.slice(0, -1) + "en", k.slice(0, -1) + "n");
  out.push(k + "en", k + "n");
  if (k.endsWith("e")) out.push(k + "n");
  return out;
}

/* ── Números escritos en palabras: "neunundneunzig" → 99 ── */
const UNITS: Record<string, number> = { ein: 1, eins: 1, eine: 1, zwei: 2, drei: 3, vier: 4, fünf: 5, sechs: 6, sieben: 7, acht: 8, neun: 9 };
const TEENS: Record<string, number> = { zehn: 10, elf: 11, zwölf: 12, dreizehn: 13, vierzehn: 14, fünfzehn: 15, sechzehn: 16, siebzehn: 17, achtzehn: 18, neunzehn: 19 };
const TENS: Record<string, number> = { zwanzig: 20, dreißig: 30, vierzig: 40, fünfzig: 50, sechzig: 60, siebzig: 70, achtzig: 80, neunzig: 90 };

function below100(s: string): number | null {
  if (s === "") return 0;
  if (s in UNITS) return UNITS[s];
  if (s in TEENS) return TEENS[s];
  if (s in TENS) return TENS[s];
  const m = s.match(/^(.+?)und(zwanzig|dreißig|vierzig|fünfzig|sechzig|siebzig|achtzig|neunzig)$/);
  if (m && m[1] in UNITS) return UNITS[m[1]] + TENS[m[2]];
  return null;
}
function below1000(s: string): number | null {
  const i = s.indexOf("hundert");
  if (i < 0) return below100(s);
  const h = s.slice(0, i);
  const hv = h === "" ? 1 : UNITS[h];
  const rest = below100(s.slice(i + 7));
  return hv && rest !== null ? hv * 100 + rest : null;
}
export function parseGermanNumber(word: string): number | null {
  const s = word.toLowerCase();
  if (s.length < 3) return null;
  const i = s.indexOf("tausend");
  if (i < 0) return below1000(s);
  const t = s.slice(0, i);
  const tv = t === "" ? 1 : below1000(t);
  const rest = below1000(s.slice(i + 7));
  return tv && rest !== null ? tv * 1000 + rest : null;
}

export function lookup(surface: string): Gloss | null {
  const k = norm(surface).replace(/[.,!?;:]+$/, "");
  const direct = index.get(k);
  if (direct) return direct;
  const n = !k.includes(" ") && /^[a-zäöüß]+$/.test(k) ? parseGermanNumber(k) : null;
  if (n !== null && n > 12) return { de: k, tr: { es: `número ${n.toLocaleString("es")}`, en: `number ${n.toLocaleString("en")}` } };
  if (k.includes(" ")) return null;
  for (const c of candidates(k)) {
    const g = index.get(c);
    if (g) return g;
  }
  return null;
}

export function maxPhraseWords() {
  return maxWords;
}
