/**
 * Plan de estudio personalizado.
 *
 * Se calcula con las respuestas del cuestionario (meta, examen, fecha, minutos y días),
 * el nivel de inicio (test de nivel o desde cero) y el avance real del estudiante.
 * Las horas por nivel siguen las estimaciones del Goethe-Institut
 * (A1 ≈ 60–150 h, A2 ≈ 150–260 h, B1 ≈ 260–490 h, B2 ≈ 450–600 h, C1 ≈ 600–750 h en total).
 */
import type { StudentProfile } from "./session";
import { unitKey, unitPercent, type Progress } from "./progress";
import type { LevelState } from "./levels";
import { isUnitAvailable } from "@/content/de/units";
import { STORIES } from "@/content/de/stories";
import { SONGS } from "@/content/de/songs";
import { FINAL_EXAM_OF } from "@/content/de/exams";

export type Tr = { es: string; en: string };
export const DAY = 86_400_000;
export const WEEK = 7 * DAY;

export type Stage = { id: string; label: string; cefr: string; hours: number; content: "ready" | "soon" | "later" };
/** Horas acumuladas: A1 100 · A2 200 · B1 380 · B2 530 · C1 680 (punto medio de los rangos del Goethe-Institut). */
export const STAGES: Stage[] = [
  { id: "a1-1", label: "A1.1", cefr: "A1", hours: 50, content: "ready" },
  { id: "a1-2", label: "A1.2", cefr: "A1", hours: 50, content: "ready" },
  { id: "a2-1", label: "A2.1", cefr: "A2", hours: 50, content: "soon" },
  { id: "a2-2", label: "A2.2", cefr: "A2", hours: 50, content: "soon" },
  { id: "b1-1", label: "B1.1", cefr: "B1", hours: 90, content: "soon" },
  { id: "b1-2", label: "B1.2", cefr: "B1", hours: 90, content: "soon" },
  { id: "b2", label: "B2", cefr: "B2", hours: 150, content: "later" },
  { id: "c1", label: "C1", cefr: "C1", hours: 150, content: "later" },
];
const UNITS_PER_STAGE = 20;
const stageIndex = (id: string) => Math.max(0, STAGES.findIndex((s) => s.id === id));

/** Meta de nivel según el examen o el objetivo elegido. */
const EXAM_TARGET: Record<string, { stage: string; label: string; prep: number }> = {
  "Goethe A1": { stage: "a1-2", label: "Goethe-Zertifikat A1", prep: 10 },
  "Goethe A2": { stage: "a2-2", label: "Goethe-Zertifikat A2", prep: 15 },
  "Goethe B1": { stage: "b1-2", label: "Goethe-Zertifikat B1", prep: 25 },
  "Goethe B2": { stage: "b2", label: "Goethe-Zertifikat B2", prep: 35 },
  "Goethe C1": { stage: "c1", label: "Goethe-Zertifikat C1", prep: 45 },
  telc: { stage: "b1-2", label: "telc Deutsch B1", prep: 25 },
  "ÖSD": { stage: "b1-2", label: "ÖSD Zertifikat B1", prep: 25 },
  TestDaF: { stage: "c1", label: "TestDaF (TDN 4)", prep: 45 },
  DSH: { stage: "c1", label: "DSH-2", prep: 45 },
};
const GOAL_TARGET: Record<string, { stage: string; label: string }> = {
  everyday: { stage: "a2-2", label: "A2 · Alltag" },
  career: { stage: "b2", label: "B2 · Studium & Beruf" },
  relaxed: { stage: "b1-2", label: "B1" },
  exam: { stage: "b1-2", label: "B1" },
};
const DEADLINE_WEEKS: Record<string, number> = { "3m": 13, "6m": 26, "1y": 52 };

export type Pace = { minutes: number; days: number };
export type Scenario = Pace & { id: "current" | "recommended" | "intensive"; finishAt: number };
export type StagePlan = { stage: Stage; remaining: number; startAt: number; endAt: number; status: "done" | "current" | "next"; pct: number };

export type Plan = {
  start: Stage;
  target: Stage;
  targetLabel: string;
  exam?: string;
  alreadyThere: boolean;
  pace: Pace;
  weeklyHours: number;
  doneHours: number;
  remainingHours: number;
  examPrepHours: number;
  finishAt: number;
  examAt?: number;
  deadlineAt?: number;
  status: "ontime" | "tight" | "ambitious" | "free";
  neededMinutes?: number;
  stages: StagePlan[];
  scenarios: Scenario[];
  unitsPerWeek: number;
  current: { level: string; number: number } | null;
};

const ceil5 = (n: number) => Math.max(5, Math.ceil(n / 5) * 5);

/** Unidad en la que va el estudiante (la última que abrió o la primera sin terminar). */
export function currentUnit(progress: Progress, last: { level: string; number: number } | null) {
  if (last && isUnitAvailable(last.level, last.number) && !progress[unitKey("de", last.level, last.number)]?.completed) return { level: last.level, number: last.number };
  for (const st of STAGES)
    for (let n = 1; n <= UNITS_PER_STAGE; n++) if (isUnitAvailable(st.id, n) && !progress[unitKey("de", st.id, n)]?.completed) return { level: st.id, number: n };
  return null;
}

/** Qué fracción de una etapa ya hizo el estudiante (según sus unidades). */
function stageDone(stage: Stage, progress: Progress) {
  if (stage.content !== "ready") return 0;
  let sum = 0;
  for (let n = 1; n <= UNITS_PER_STAGE; n++) sum += unitPercent(progress[unitKey("de", stage.id, n)]);
  return sum / (UNITS_PER_STAGE * 100);
}

export function buildPlan(
  profile: StudentProfile,
  levels: LevelState,
  progress: Progress,
  last: { level: string; number: number } | null,
  now = Date.now(),
  paceOverride?: Pace,
): Plan {
  const pace: Pace = paceOverride ?? { minutes: profile.minutes ?? 20, days: profile.days ?? 5 };
  const startIdx = stageIndex(levels.placement?.level ?? "a1-1");
  const ex = profile.goal === "exam" && profile.exam && profile.exam !== "?" ? EXAM_TARGET[profile.exam] : undefined;
  // Meta propia ("Otro"): apuntamos a B1 y mostramos lo que escribió
  const goal =
    ex ?? (profile.goal === "other" ? { stage: "b1-2", label: profile.other?.goal || "B1" } : (GOAL_TARGET[profile.goal ?? "relaxed"] ?? GOAL_TARGET.relaxed));
  let targetIdx = stageIndex(goal.stage);
  const examPrepHours = profile.goal === "exam" ? (ex?.prep ?? 25) : 0;
  // Según el test ya tiene el nivel de su meta: con examen, solo queda el entrenamiento;
  // sin examen, seguimos con el nivel en el que está.
  const alreadyThere = targetIdx < startIdx;
  if (alreadyThere && !examPrepHours) targetIdx = startIdx;

  const weeklyHours = (pace.minutes * pace.days) / 60;
  const stages: StagePlan[] = [];
  let doneHours = 0;
  let remainingHours = 0;
  let t = now;
  for (let i = 0; i <= targetIdx; i++) {
    const stage = STAGES[i];
    const pct = i < startIdx ? 1 : stageDone(stage, progress);
    const remaining = stage.hours * (1 - pct);
    doneHours += stage.hours * pct;
    if (i < startIdx) continue;
    remainingHours += remaining;
    const weeks = remaining / weeklyHours;
    stages.push({ stage, remaining, startAt: t, endAt: t + weeks * WEEK, status: pct >= 1 ? "done" : stages.some((s) => s.status === "current") ? "next" : "current", pct });
    t += weeks * WEEK;
  }
  const examAt = examPrepHours ? t + (examPrepHours / weeklyHours) * WEEK : undefined;
  const finishAt = examAt ?? t;
  const total = remainingHours + examPrepHours;

  // ¿Llega a tiempo a su fecha?
  const dw = profile.deadline ? DEADLINE_WEEKS[profile.deadline] : undefined;
  const deadlineAt = dw ? (profile.at ?? now) + dw * WEEK : undefined;
  let status: Plan["status"] = "free";
  let neededMinutes: number | undefined;
  if (deadlineAt) {
    const weeksLeft = Math.max(1, (deadlineAt - now) / WEEK);
    neededMinutes = ceil5((total * 60) / (weeksLeft * pace.days));
    status = finishAt <= deadlineAt ? "ontime" : neededMinutes <= 120 ? "tight" : "ambitious";
  }

  const finishWith = (p: Pace) => now + (total / ((p.minutes * p.days) / 60)) * WEEK;
  const scenarios: Scenario[] = [{ id: "current", ...pace, finishAt: finishAt }];
  let rec: Pace;
  if (status === "tight" && neededMinutes) rec = { minutes: neededMinutes, days: pace.days };
  else if (status === "ambitious") rec = { minutes: 60, days: 6 };
  else rec = { minutes: Math.max(pace.minutes, 30), days: Math.max(pace.days, 5) };
  if (rec.minutes !== pace.minutes || rec.days !== pace.days) scenarios.push({ id: "recommended", ...rec, finishAt: finishWith(rec) });
  const intense = { minutes: 90, days: 6 };
  if (pace.minutes * pace.days < intense.minutes * intense.days && !(rec.minutes === 90 && rec.days === 6)) scenarios.push({ id: "intensive", ...intense, finishAt: finishWith(intense) });

  return {
    start: STAGES[startIdx],
    target: STAGES[targetIdx],
    targetLabel: alreadyThere && !examPrepHours ? STAGES[targetIdx].label : goal.label,
    // Examen elegido: el de la lista, el que escribió en "Otro" o, si no sabe aún, "Prüfung"
    exam:
      ex?.label ??
      (profile.goal === "exam"
        ? profile.exam === "other"
          ? profile.other?.exam || "Prüfung"
          : profile.exam && profile.exam !== "?"
            ? profile.exam
            : "Prüfung"
        : undefined),
    alreadyThere,
    pace,
    weeklyHours,
    doneHours,
    remainingHours: total,
    examPrepHours,
    finishAt,
    examAt,
    deadlineAt,
    status,
    neededMinutes,
    stages,
    scenarios,
    unitsPerWeek: (pace.minutes * pace.days) / 150,
    current: currentUnit(progress, last),
  };
}

/* ───────────────────────── Plan de la semana ───────────────────────── */

export type BlockKind = "section" | "review" | "story" | "song" | "game" | "focus" | "exam" | "teacher";
export type Block = {
  id: string;
  kind: BlockKind;
  emoji: string;
  de: string;
  tr: Tr;
  minutes: number;
  href: string;
  level?: string;
  unit?: number;
  section?: string;
  sectionIndex?: number;
  storyId?: string;
  songId?: string;
  /** Si un paso no cabe en un día, se parte: Teil 1, Teil 2… */
  part?: number;
};
export type WeekDay = { day: number; date: number; blocks: Block[] };
export type WeekPlan = { v: number; weekStart: number; profileAt: number; days: WeekDay[]; manual: Record<string, boolean> };
export const WEEK_VERSION = 3;

export const SECTION_BLOCKS: { section: string; emoji: string; de: string; tr: Tr; minutes: number }[] = [
  { section: "video", emoji: "🎬", de: "Video ansehen", tr: { es: "Ver el video", en: "Watch the video" }, minutes: 10 },
  { section: "theory", emoji: "📘", de: "Erklärung lesen", tr: { es: "Leer la explicación y tomar notas", en: "Read the explanation and take notes" }, minutes: 20 },
  { section: "cards", emoji: "🃏", de: "Neue Wörter lernen", tr: { es: "Tarjetas con las palabras nuevas", en: "Flashcards with the new words" }, minutes: 10 },
  { section: "reading", emoji: "📖", de: "Lesen", tr: { es: "Lectura", en: "Reading" }, minutes: 15 },
  { section: "listening", emoji: "🎧", de: "Hören", tr: { es: "Comprensión auditiva", en: "Listening" }, minutes: 15 },
  { section: "speaking", emoji: "🗣️", de: "Sprechen", tr: { es: "Hablar en voz alta", en: "Speaking out loud" }, minutes: 15 },
  { section: "writing", emoji: "✍️", de: "Schreiben", tr: { es: "Escribir y corregir con IA", en: "Write and correct with AI" }, minutes: 20 },
  { section: "exercises", emoji: "✅", de: "Übungen", tr: { es: "Ejercicios", en: "Exercises" }, minutes: 15 },
  { section: "guide", emoji: "📄", de: "Arbeitsblatt", tr: { es: "Guía para repasar", en: "Worksheet to review" }, minutes: 10 },
];
const SECTION_INDEX: Record<string, number> = { video: 0, theory: 1, cards: 2, reading: 3, listening: 4, speaking: 5, writing: 6, exercises: 7, guide: 8 };

/** Qué historias y temas de juego le van a cada interés. */
const INTEREST_STORIES: Record<string, string[]> = {
  food: ["kaffee-dieb", "pizza-wg"],
  cooking: ["pizza-wg", "kaffee-dieb"],
  travel: ["falscher-bus", "opas-knie"],
  tech: ["ohne-handy", "oma-hilde"],
  film: ["zimmer-12", "kaffee-dieb"],
  books: ["zimmer-12", "flohmarkt-schatz"],
  art: ["flohmarkt-schatz"],
  history: ["flohmarkt-schatz", "oma-hilde"],
  nature: ["opas-knie", "falscher-bus"],
  animals: ["falscher-bus", "zimmer-12"],
  music: ["ohne-handy", "pizza-wg"],
  games: ["ohne-handy", "zimmer-12"],
  business: ["kaffee-dieb"],
  science: ["opas-knie"],
  sport: ["falscher-bus"],
  fashion: ["flohmarkt-schatz"],
};
const INTEREST_GAMES: Record<string, string> = {
  food: "essen",
  cooking: "essen",
  fashion: "kleidung",
  travel: "wetter",
  nature: "wetter",
  sport: "alltag",
  business: "berufe",
  tech: "berufe",
  science: "zeit",
  books: "kurs",
  history: "familie",
  animals: "wohnung",
};
const GAME_ROTATION = ["artikel", "memory", "gluecksrad", "galgen"];
const GAME_NAMES: Record<string, string> = { artikel: "Der, die, das", memory: "Memory", gluecksrad: "Glücksrad", galgen: "Galgenmännchen" };

export function recommendedStories(interests: string[] = []) {
  const score = new Map<string, number>();
  interests.forEach((i) => (INTEREST_STORIES[i] ?? []).forEach((id, k) => score.set(id, (score.get(id) ?? 0) + 2 - k * 0.5)));
  return [...STORIES].sort((a, b) => (score.get(b.id) ?? 0) - (score.get(a.id) ?? 0));
}
export function recommendedThemes(interests: string[] = []) {
  const out: string[] = [];
  interests.forEach((i) => INTEREST_GAMES[i] && !out.includes(INTEREST_GAMES[i]) && out.push(INTEREST_GAMES[i]));
  return out.length ? out : ["alltag", "essen"];
}

/** Bloque extra de la semana según lo que más necesita el estudiante. */
export function focusSkill(profile: StudentProfile, levels: LevelState): { section: string; emoji: string; de: string; tr: Tr } {
  const sec = levels.placement?.sections ?? {};
  const weakest = (["listening", "reading", "writing"] as const).filter((k) => typeof sec[k] === "number").sort((a, b) => (sec[a] ?? 0) - (sec[b] ?? 0))[0];
  const r = profile.reasons ?? [];
  const pick =
    weakest && (sec[weakest] ?? 100) < 70
      ? weakest
      : r.includes("exam") || r.includes("study") || r.includes("work")
        ? "writing"
        : r.includes("travel") || r.includes("family") || r.includes("live")
          ? "speaking"
          : "listening";
  const map = {
    writing: { emoji: "✍️", de: "Extra: Schreiben", tr: { es: "Escribe un texto corto más y corrígelo con IA", en: "Write one more short text and correct it with AI" } },
    speaking: { emoji: "🗣️", de: "Extra: Sprechen", tr: { es: "Repite las frases en voz alta hasta que salgan fluidas", en: "Repeat the phrases out loud until they flow" } },
    listening: { emoji: "🎧", de: "Extra: Hören", tr: { es: "Escucha otra vez el diálogo sin leer", en: "Listen to the dialogue again without reading" } },
    reading: { emoji: "📖", de: "Extra: Lesen", tr: { es: "Vuelve a leer la lectura y subraya palabras nuevas", en: "Re-read the text and underline new words" } },
  } as const;
  return { section: pick, ...map[pick as keyof typeof map] };
}

/** 00:00 (hora local) del día de `t`. */
export function dayStart(t: number) {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}
/** 0 = lunes … 6 = domingo */
export const weekday = (t: number) => (new Date(t).getDay() + 6) % 7;
const DAY_PATTERNS: Record<number, number[]> = { 1: [5], 2: [1, 4], 3: [0, 2, 4], 4: [0, 1, 3, 4], 5: [0, 1, 2, 3, 4], 6: [0, 1, 2, 3, 4, 5], 7: [0, 1, 2, 3, 4, 5, 6] };

/**
 * Arma la semana: reparte los pasos de las unidades (desde donde va el estudiante),
 * historias, juegos y repaso en sus días de estudio, según sus minutos por día.
 */
export function buildWeek(plan: Plan, profile: StudentProfile, levels: LevelState, progress: Progress, now = Date.now()): WeekPlan {
  // Los próximos 7 días desde hoy: así la semana siempre trae todos sus días de estudio
  const weekStart = dayStart(now);
  const pattern = DAY_PATTERNS[Math.min(7, Math.max(1, plan.pace.days))] ?? DAY_PATTERNS[5];
  const studyDays = Array.from({ length: 7 }, (_, i) => weekStart + i * DAY).filter((t) => pattern.includes(weekday(t)));

  const stories = recommendedStories(profile.interests).filter((s) => !progress[`story/${s.id}`]);
  const themes = recommendedThemes(profile.interests);
  const focus = focusSkill(profile, levels);
  const scale = plan.current && stageIndex(plan.current.level) >= 4 ? 1.8 : 1;

  // Cola de bloques: unidad actual (sin lo ya visto), luego las siguientes
  const queue: Block[] = [];
  const likesMusic = (profile.interests ?? []).includes("music");
  const cefr = plan.start.cefr;
  const songs = SONGS.filter((s) => !progress[`song/${s.id}`]).sort((a, b) => Number(b.level === cefr) - Number(a.level === cefr) || a.level.localeCompare(b.level));
  let songI = 0;
  let storyI = 0;
  let gameI = 0;
  const extras = (level: string, n: number, withFocus = true) => {
    // A quien le gusta la música le toca una canción cada dos unidades; a los demás, cada cuatro
    const kind = likesMusic ? (n % 2 === 1 ? "song" : "story") : n % 2 === 1 ? "story" : n % 4 === 0 ? "song" : "game";
    if (kind === "story" && stories[storyI]) {
      const s = stories[storyI++];
      queue.push({ id: `story-${s.id}`, kind: "story", emoji: "📚", de: `Geschichte: ${s.title}`, tr: s.titleTr, minutes: 10, href: `/aprender/geschichten/${s.id}`, storyId: s.id });
    } else if (kind === "song" && songs[songI]) {
      const s = songs[songI++];
      queue.push({ id: `song-${s.id}`, kind: "song", emoji: "🎵", de: `Lied: ${s.title}`, tr: { es: "Completa la letra con música", en: "Fill in the lyrics with music" }, minutes: 10, href: `/aprender/lieder/${s.id}`, songId: s.id });
    } else {
      const g = GAME_ROTATION[gameI % GAME_ROTATION.length];
      const th = themes[gameI % themes.length];
      gameI++;
      queue.push({ id: `game-${n}-${g}`, kind: "game", emoji: "🎮", de: `Spiel: ${GAME_NAMES[g]}`, tr: { es: "Juega con el vocabulario", en: "Play with the vocabulary" }, minutes: 10, href: `/aprender/spiele/${g}/${th}` });
    }
    if (!withFocus) return;
    queue.push({
      id: `focus-${level}-${n}`,
      kind: "focus",
      emoji: focus.emoji,
      de: focus.de,
      tr: focus.tr,
      minutes: 10,
      href: `/aprender/de/${level}/${n}`,
      level,
      unit: n,
      sectionIndex: SECTION_INDEX[focus.section],
    });
  };
  const weekMinutes = plan.pace.minutes * studyDays.length;
  // Empieza en la unidad actual; si el test lo puso más adelante, en la primera unidad de ese nivel
  const cur = plan.current && stageIndex(plan.current.level) >= stageIndex(plan.start.id) ? plan.current : null;
  let level = cur?.level ?? plan.start.id;
  let n = cur?.number ?? 1;
  let guard = 0;
  while (queue.reduce((a, b) => a + b.minutes, 0) < weekMinutes + 60 && guard++ < 40) {
    if (!isUnitAvailable(level, n)) {
      // Se acabaron las unidades del nivel: examen final y, si ya hay contenido, el siguiente nivel
      const fin = FINAL_EXAM_OF[level];
      if (fin && !levels.exams?.[fin.id]?.passed && !queue.some((b) => b.id === `exam-${level}`))
        queue.push({ id: `exam-${level}`, kind: "exam", emoji: "📝", de: fin.title, tr: fin.titleTr, minutes: fin.minutes + 10, href: `/aprender/test/${fin.id}` });
      const nextStage = STAGES[stageIndex(level) + 1];
      if (n > 1 && nextStage && isUnitAvailable(nextStage.id, 1)) {
        level = nextStage.id;
        n = 1;
        continue;
      }
      queue.push({ id: `review-extra-${guard}`, kind: "review", emoji: "🔁", de: "Wiederholen", tr: { es: "Repasa tus tarjetas y unidades difíciles", en: "Review your cards and tricky units" }, minutes: 15, href: "/aprender/karten" });
      extras(level, 100 + guard, false);
      if (guard === 2 && !queue.some((b) => b.kind === "teacher"))
        queue.push({ id: "teacher", kind: "teacher", emoji: "🧑‍🏫", de: "Einzelunterricht", tr: { es: "Clase 1:1 con una Lehrkraft (opcional)", en: "1:1 class with a teacher (optional)" }, minutes: 30, href: "/aprender/unterricht" });
      continue;
    }
    const seen = progress[unitKey("de", level, n)]?.sections ?? [];
    for (const b of SECTION_BLOCKS) {
      if (seen.includes(b.section)) continue;
      queue.push({
        id: `${level}-${n}-${b.section}`,
        kind: "section",
        emoji: b.emoji,
        de: b.de,
        tr: b.tr,
        minutes: Math.round(b.minutes * scale),
        href: `/aprender/de/${level}/${n}`,
        level,
        unit: n,
        section: b.section,
        sectionIndex: SECTION_INDEX[b.section],
      });
    }
    extras(level, n);
    n++;
  }

  // Repartir en los días
  const days: WeekDay[] = [];
  for (const date of studyDays) {
    const d = weekday(date);
    let cap = plan.pace.minutes;
    const blocks: Block[] = [];
    if (plan.pace.minutes >= 15) {
      blocks.push({ id: `review-${d}`, kind: "review", emoji: "🔁", de: "Karteikarten wiederholen", tr: { es: "Repaso rápido de tarjetas", en: "Quick flashcard review" }, minutes: 5, href: "/aprender/karten" });
      cap -= 5;
    }
    const fresh = blocks.length;
    const dayCap = cap;
    // Un día puede pasarse un poquito (≈ 20 %) para no partir un paso en dos
    const tol = Math.min(5, Math.round(plan.pace.minutes * 0.2));
    while (cap >= 5 && queue.length) {
      const b = queue[0];
      if (b.minutes <= cap + tol) {
        blocks.push(queue.shift()!);
        cap -= b.minutes;
      } else if (b.kind === "teacher" || b.kind === "exam" || b.section === "video" || b.section === "cards" || b.section === "guide") {
        // Una clase, un examen, el video o las tarjetas no se parten: van enteros al comienzo de un día
        if (blocks.length === fresh) blocks.push(queue.shift()!);
        cap = 0;
      } else if (b.kind !== "section") {
        // Repaso, historia, juego o extra: se acortan al tiempo que queda
        blocks.push({ ...queue.shift()!, minutes: cap });
        cap = 0;
      } else if (cap < 15 && b.minutes <= dayCap + tol) {
        // Queda poco tiempo y el paso cabe entero mañana: lo dejamos para mañana
        cap = 0;
      } else {
        const part = b.part ?? 1;
        const base = b.id.replace(/-t\d+$/, "");
        blocks.push({ ...b, id: `${base}-t${part}`, minutes: cap, part });
        queue[0] = { ...b, id: `${base}-t${part + 1}`, minutes: b.minutes - cap, part: part + 1 };
        cap = 0;
      }
    }
    days.push({ day: d, date, blocks });
  }
  return { v: WEEK_VERSION, weekStart, profileAt: profile.at ?? 0, days, manual: {} };
}

/** ¿Está hecho este bloque? (pestaña vista, historia leída o marcado a mano) */
export function blockDone(b: Block, progress: Progress, manual: Record<string, boolean>) {
  if (manual[b.id]) return true;
  if (b.kind === "section" && b.level && b.unit) return Boolean(progress[unitKey("de", b.level, b.unit)]?.sections?.includes(b.section!));
  if (b.kind === "story" && b.storyId) return Boolean(progress[`story/${b.storyId}`]);
  if (b.kind === "song" && b.songId) return Boolean(progress[`song/${b.songId}`]);
  if (b.kind === "exam") return false;
  return false;
}
