import type { Tr, UnitContent } from "../types";
import { allUnits } from "./units";

/** Busca una frase de ejemplo real (de la misma unidad) que contenga la palabra. */
export function exampleFor(word: string, source: string): { de: string; tr: Tr } | null {
  const [level, num] = source.split("/");
  const unit = allUnits.find((u) => u.level === level && String(u.number) === num);
  const units: UnitContent[] = unit ? [unit, ...allUnits.filter((u) => u !== unit)] : allUnits;
  const re = new RegExp(`(^|[^\\p{L}])${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^\\p{L}]|$)`, "iu");
  for (const u of units) {
    const pool: { de: string; tr: Tr }[] = [];
    for (const b of u.theory) {
      if (b.type === "example") pool.push({ de: b.de, tr: b.tr });
      if (b.type === "phrases") b.items.forEach((i) => pool.push({ de: i.de, tr: i.tr }));
    }
    u.readings.forEach((r) => r.lines.forEach((l) => pool.push({ de: l.de, tr: l.tr })));
    const hit = pool.find((p) => p.de !== word && p.de.length < 90 && re.test(p.de));
    if (hit) return hit;
  }
  return null;
}
