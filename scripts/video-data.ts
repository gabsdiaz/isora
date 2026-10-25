/**
 * Exporta los guiones de video de un nivel como JSON para el generador (scripts/video/render.py).
 * Uso: npx tsx scripts/video-data.ts a1-1 > guiones.json
 */
import { allUnits } from "../src/content/de/units";
import { getLevel, getUnitMeta } from "../src/content/de/course";
import { IMAGES, emojiCode } from "../src/content/de/images";

const levelId = process.argv[2] ?? "a1-1";
const level = getLevel(levelId)!;
const out = allUnits
  .filter((u) => u.level === levelId)
  .map((u) => {
    const meta = getUnitMeta(levelId, u.number)!;
    return {
      key: `de/${levelId}/${String(u.number).padStart(2, "0")}`,
      level: level.label,
      number: u.number,
      title: meta.title,
      topic: meta.topic,
      goals: u.goals,
      video: u.video,
      vocab: u.vocab
        .filter((v) => !v.meta && IMAGES[v.de])
        .map((v) => ({ de: v.de, article: v.article ?? null, img: emojiCode(IMAGES[v.de]) })),
      images: Object.fromEntries(Object.entries(IMAGES).map(([k, e]) => [k, emojiCode(e)])),
      // Mini quiz del video: preguntas de opción múltiple de la unidad
      quiz: u.exercises
        .filter((e) => e.type === "choice" && e.options.every((o) => o.length < 40))
        .slice(0, 2)
        .map((e) => e.type === "choice" && { prompt: e.prompt, sentence: e.sentence, options: e.options, answer: e.answer, explanation: e.explanation }),
    };
  });
console.log(JSON.stringify(out, null, 1));
