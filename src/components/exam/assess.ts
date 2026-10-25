import { LEVEL_ORDER, type LevelTag, type WritingTask } from "@/content/de/exams";

/** Evaluación automática (aproximada) de un texto escrito. */
export function assessWriting(text: string, task: WritingTask) {
  const clean = text.trim();
  const words = clean ? clean.split(/\s+/).length : 0;
  const lower = clean.toLowerCase();
  const checks = (task.checks ?? []).map((c) => ({ label: c.label, ok: new RegExp(c.pattern, "i").test(clean) }));

  const perfekt = /\b(habe|hast|hat|haben|habt|bin|bist|ist|sind|seid)\b[^.!?]{0,70}\b(ge\w+(t|en)|\w+iert)\b/i.test(clean);
  const a2 = (lower.match(/\b(weil|dass|wenn|denn|deshalb|danach|trotzdem|zuerst|später)\b/g) ?? []).length;
  const b1 = (lower.match(/\b(obwohl|damit|nachdem|während|bevor|deswegen|außerdem|einerseits|andererseits|würde|hätte|wäre|könnte)\b/g) ?? []).length;
  const sentences = clean.split(/[.!?]+/).filter((s) => s.trim().split(/\s+/).length >= 3).length;

  let level: LevelTag = "a1-1";
  if (words >= 20 && sentences >= 2) level = "a1-2";
  if (perfekt && words >= 30) level = "a2-1";
  if (perfekt && a2 >= 2 && words >= 40) level = "a2-2";
  if (perfekt && a2 >= 2 && b1 >= 1 && words >= 55) level = "b1-1";
  if (perfekt && a2 >= 3 && b1 >= 3 && words >= 70) level = "b1-2";

  const score = checks.length
    ? Math.round(((checks.filter((c) => c.ok).length + (words >= task.minWords ? 1 : 0)) / (checks.length + 1)) * 100)
    : Math.round(((LEVEL_ORDER.indexOf(level) + 1) / LEVEL_ORDER.length) * 100);

  return { words, checks, level, score, minOk: words >= task.minWords };
}
export type WritingAssessment = ReturnType<typeof assessWriting>;

/**
 * Nivel para empezar según el test: se avanza mientras el nivel esté dominado (≥ 60 %).
 * La escritura limita el resultado: con un texto muy básico no se empieza más arriba de dos niveles.
 */
export function placementLevel(items: { level: LevelTag; correct: boolean }[], writingLevel: LevelTag) {
  const mastered: LevelTag[] = [];
  for (const l of LEVEL_ORDER) {
    const own = items.filter((i) => i.level === l);
    const ok = own.filter((i) => i.correct).length;
    if (own.length >= 2 && ok / own.length >= 0.6) mastered.push(l);
    else break;
  }
  let start = Math.min(mastered.length, LEVEL_ORDER.length - 1);
  start = Math.min(start, LEVEL_ORDER.indexOf(writingLevel) + 2);
  return { start: LEVEL_ORDER[start], mastered: mastered.slice(0, start) };
}
