import type { Tr, VocabEntry } from "../types";
import { commonVocab } from "./common";
import { allUnits } from "./units";

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
  const k = norm(surface);
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

export function lookup(surface: string): Gloss | null {
  const k = norm(surface);
  return index.get(k) ?? index.get(k.replace(/[.,!?;:]+$/, "")) ?? null;
}

export function maxPhraseWords() {
  return maxWords;
}
