"use client";

import { useState } from "react";
import type { Exam, ExamSection, ListeningBlock, MCQuestion, ReadingBlock, WritingTask, LevelTag } from "@/content/de/exams";
import { useT } from "@/lib/i18n";
import { speakGerman } from "@/lib/speech";
import { shuffle } from "../games/shared";
import { assessWriting, placementLevel, type WritingAssessment } from "./assess";

type Kind = ExamSection["kind"];
type Step =
  | { type: "section"; kind: Kind; title: string }
  | { type: "mc"; kind: Kind; q: MCQuestion; options: { text: string; i: number }[]; reading?: ReadingBlock; listening?: ListeningBlock }
  | { type: "writing"; task: WritingTask };

export type ExamOutcome = {
  score: number;
  passed: boolean;
  sections: Partial<Record<Kind, number>>;
  start?: LevelTag;
  mastered?: LevelTag[];
  writing?: WritingAssessment;
  wrong: { q: string; chosen: string | null; correct: string }[];
};

const KIND = {
  grammar: { emoji: "📝", es: "Elige la respuesta correcta.", en: "Choose the correct answer." },
  reading: { emoji: "📖", es: "Lee el texto y responde.", en: "Read the text and answer." },
  listening: { emoji: "🎧", es: "Escucha el audio (máximo 2 veces) y responde.", en: "Listen to the audio (max. twice) and answer." },
  writing: { emoji: "✍️", es: "Escribe un texto corto.", en: "Write a short text." },
} as const;
const WEIGHTS: Record<Kind, number> = { grammar: 0.35, reading: 0.25, listening: 0.25, writing: 0.15 };

function buildSteps(exam: Exam): Step[] {
  const steps: Step[] = [];
  const opts = (q: MCQuestion) => shuffle(q.options.map((text, i) => ({ text, i })));
  for (const s of exam.sections) {
    steps.push({ type: "section", kind: s.kind, title: s.title });
    if (s.kind === "grammar") {
      const qs = s.sample ? shuffle(s.questions).slice(0, s.sample) : s.questions;
      qs.forEach((q) => steps.push({ type: "mc", kind: "grammar", q, options: opts(q) }));
    } else if (s.kind === "reading") {
      s.blocks.forEach((b) => b.questions.forEach((q) => steps.push({ type: "mc", kind: "reading", q, options: opts(q), reading: b })));
    } else if (s.kind === "listening") {
      s.blocks.forEach((b) => b.questions.forEach((q) => steps.push({ type: "mc", kind: "listening", q, options: opts(q), listening: b })));
    } else {
      steps.push({ type: "writing", task: s.task });
    }
  }
  return steps;
}

/** Motor de exámenes: test de nivel, mini pruebas y examen final. */
export function ExamRunner({
  exam,
  mode,
  onFinish,
  actions,
}: {
  exam: Exam;
  mode: "placement" | "pass";
  onFinish: (o: ExamOutcome) => void;
  actions: (o: ExamOutcome) => React.ReactNode;
}) {
  const { loc, lang } = useT();
  const [steps] = useState(() => buildSteps(exam));
  const [i, setI] = useState(-1);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [picked, setPicked] = useState<number | null>(null);
  const [plays, setPlays] = useState<Record<string, number>>({});
  const [text, setText] = useState("");
  const [outcome, setOutcome] = useState<ExamOutcome | null>(null);
  const totalQ = steps.filter((s) => s.type !== "section").length;
  const doneQ = steps.slice(0, Math.max(i, 0)).filter((s) => s.type !== "section").length;

  const finish = (finalAnswers: Record<string, number>, writingText: string) => {
    const mcs = steps.filter((s): s is Extract<Step, { type: "mc" }> => s.type === "mc");
    const sections: Partial<Record<Kind, number>> = {};
    for (const k of ["grammar", "reading", "listening"] as Kind[]) {
      const own = mcs.filter((s) => s.kind === k);
      if (own.length) sections[k] = Math.round((own.filter((s) => finalAnswers[s.q.id] === s.q.answer).length / own.length) * 100);
    }
    const wTask = steps.find((s): s is Extract<Step, { type: "writing" }> => s.type === "writing")?.task;
    const writing = wTask ? assessWriting(writingText, wTask) : undefined;
    if (writing) sections.writing = writing.score;
    const kinds = Object.keys(sections) as Kind[];
    const wsum = kinds.reduce((a, k) => a + WEIGHTS[k], 0);
    const score = Math.round(kinds.reduce((a, k) => a + (sections[k] ?? 0) * WEIGHTS[k], 0) / wsum);
    const wrong = mcs
      .filter((s) => finalAnswers[s.q.id] !== s.q.answer)
      .map((s) => ({ q: s.q.q, chosen: finalAnswers[s.q.id] >= 0 ? s.q.options[finalAnswers[s.q.id]] : null, correct: s.q.options[s.q.answer] }));
    const o: ExamOutcome = { score, passed: score >= (exam.pass ?? 0), sections, writing, wrong };
    if (mode === "placement") {
      const p = placementLevel(
        mcs.map((s) => ({ level: s.q.level, correct: finalAnswers[s.q.id] === s.q.answer })),
        writing?.level ?? "a1-1",
      );
      o.start = p.start;
      o.mastered = p.mastered;
      o.passed = true;
    }
    setOutcome(o);
    onFinish(o);
  };

  const next = (a = answers, w = text) => {
    setPicked(null);
    if (i + 1 >= steps.length) finish(a, w);
    else setI(i + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const choose = (value: number) => {
    const step = steps[i];
    if (step.type !== "mc" || picked !== null) return;
    setPicked(value);
    const a = { ...answers, [step.q.id]: value };
    setAnswers(a);
    setTimeout(() => next(a), 350);
  };

  /* ───── Resultado ───── */
  if (outcome) return <Result exam={exam} mode={mode} o={outcome} actions={actions(outcome)} />;

  /* ───── Presentación ───── */
  if (i < 0) {
    return (
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-latte/60 bg-sand p-7 text-center sm:p-10">
        <p className="text-6xl">{exam.emoji}</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{exam.title}</h1>
        <p className="mt-1 text-sm italic text-muted">{loc(exam.titleTr)}</p>
        <p className="mx-auto mt-4 max-w-md text-cocoa">{loc(exam.intro)}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {exam.sections.map((s) => (
            <span key={s.title} className="rounded-full bg-paper px-3 py-1.5 text-sm text-cocoa">
              {KIND[s.kind].emoji} {s.title}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">
          ⏱ ca. {exam.minutes} Min. · {totalQ} {totalQ === 1 ? "Aufgabe" : "Aufgaben"}
        </p>
        <button type="button" onClick={() => setI(0)} className="mt-6 rounded-full bg-wine px-8 py-3 text-lg font-medium text-cream shadow-md shadow-wine/20 transition hover:bg-wine-light">
          Los geht&apos;s! →
        </button>
      </div>
    );
  }

  const step = steps[i];
  const bar = (
    <div className="mb-5 flex items-center gap-3">
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-cream-deep">
        <div className="h-full rounded-full bg-yellow transition-all duration-500" style={{ width: `${(doneQ / totalQ) * 100}%` }} />
      </div>
      <span className="text-sm tabular-nums text-cocoa">
        {doneQ}/{totalQ}
      </span>
    </div>
  );

  /* ───── Inicio de sección ───── */
  if (step.type === "section") {
    return (
      <div className="mx-auto max-w-xl">
        {bar}
        <div className="rounded-[2rem] border border-line bg-paper p-8 text-center">
          <p className="text-6xl">{KIND[step.kind].emoji}</p>
          <h2 className="mt-3 text-3xl font-semibold">{step.title}</h2>
          <p className="mt-2 text-cocoa">{lang === "en" ? KIND[step.kind].en : KIND[step.kind].es}</p>
          <button type="button" onClick={() => next()} className="mt-6 rounded-full bg-wine px-7 py-2.5 font-medium text-cream hover:bg-wine-light">
            Weiter →
          </button>
        </div>
      </div>
    );
  }

  /* ───── Escritura ───── */
  if (step.type === "writing") {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    return (
      <div className="mx-auto max-w-2xl">
        {bar}
        <div className="rounded-[2rem] border border-line bg-paper p-6 sm:p-8">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-wine">✍️ Schreiben</p>
          <p className="mt-2 font-display text-2xl text-ink">{step.task.prompt}</p>
          <p className="mt-1 text-sm italic text-muted">{loc(step.task.promptTr)}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {step.task.hints.map((h) => (
              <span key={h} className="rounded-full bg-cream-deep px-2.5 py-1 text-xs text-cocoa">
                {h}
              </span>
            ))}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder="Schreib hier auf Deutsch …"
            className="mt-4 w-full resize-y rounded-2xl border border-line bg-cream/60 p-4 text-[16px] leading-relaxed text-ink outline-none focus:border-wine/60"
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <span className={`text-sm ${words >= step.task.minWords ? "text-sage" : "text-muted"}`}>
              {words} Wörter {words >= step.task.minWords ? "✓" : `· mindestens ${step.task.minWords}`}
            </span>
            <button type="button" onClick={() => next(answers, text)} className="rounded-full bg-wine px-6 py-2.5 font-medium text-cream hover:bg-wine-light">
              Abgeben ✓
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ───── Pregunta ───── */
  const blockId = step.listening?.id ?? "";
  const left = 2 - (plays[blockId] ?? 0);
  return (
    <div className="mx-auto max-w-2xl">
      {bar}
      {step.reading && (
        <div className="mb-4 rounded-[2rem] border border-latte/60 bg-sand p-5 sm:p-6">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-wine">📖 {step.reading.title}</p>
          <div className="mt-2 space-y-2 font-display text-[17px] leading-relaxed text-ink">
            {step.reading.text.map((p, k) => (
              <p key={k}>{p}</p>
            ))}
          </div>
        </div>
      )}
      {step.listening && (
        <div className="mb-4 flex items-center gap-4 rounded-[2rem] border border-latte/60 bg-sand p-5">
          <button
            type="button"
            disabled={left <= 0}
            onClick={() => {
              setPlays((p) => ({ ...p, [blockId]: (p[blockId] ?? 0) + 1 }));
              speakGerman(step.listening!.audio, step.listening!.voice);
            }}
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-wine text-2xl text-cream shadow-md transition hover:scale-105 disabled:opacity-40"
            aria-label="Audio abspielen"
          >
            ▶
          </button>
          <div>
            <p className="font-medium text-ink">🎧 Hör gut zu!</p>
            <p className="text-sm text-cocoa">{left > 0 ? `Du kannst den Text noch ${left}× hören.` : "Kein Abspielen mehr übrig."}</p>
          </div>
        </div>
      )}
      <div className="rounded-[2rem] border border-line bg-paper p-6 sm:p-8">
        <p className="font-display text-2xl leading-snug text-ink">{step.q.q}</p>
        <div className="mt-5 grid gap-2.5">
          {step.options.map((o, k) => (
            <button
              key={o.i}
              type="button"
              onClick={() => choose(o.i)}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-[16px] transition ${
                picked === o.i ? "border-wine bg-wine-soft text-wine" : "border-line bg-cream/60 text-ink hover:border-cocoa-light hover:bg-cream"
              }`}
            >
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${picked === o.i ? "bg-wine text-cream" : "bg-cream-deep text-cocoa"}`}>
                {"ABC"[k]}
              </span>
              {o.text}
            </button>
          ))}
          {exam.allowDontKnow && (
            <button type="button" onClick={() => choose(-1)} className="mt-1 self-start rounded-full px-3 py-1.5 text-sm text-muted hover:bg-cream-deep hover:text-cocoa">
              🤷 Weiß ich nicht
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const SECTION_LABEL: Record<Kind, string> = { grammar: "Grammatik", reading: "Lesen", listening: "Hören", writing: "Schreiben" };
const NAMES: Record<string, string> = {
  "a1-1": "Anfänger I",
  "a1-2": "Anfänger II",
  "a2-1": "Grundstufe I",
  "a2-2": "Grundstufe II",
  "b1-1": "Mittelstufe I",
  "b1-2": "Mittelstufe II",
};

function Result({ exam, mode, o, actions }: { exam: Exam; mode: "placement" | "pass"; o: ExamOutcome; actions: React.ReactNode }) {
  const label = (l: string) => l.toUpperCase().replace("-", ".");
  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-[2rem] border border-latte/60 bg-sand p-7 text-center sm:p-10">
        {mode === "placement" ? (
          <>
            <p className="text-5xl">🎉</p>
            <p className="mt-2 text-sm uppercase tracking-[0.14em] text-muted">Dein Startniveau</p>
            <p className="mt-1 font-display text-7xl font-semibold text-wine">{label(o.start!)}</p>
            <p className="mt-1 text-lg text-cocoa">{NAMES[o.start!]}</p>
            <p className="mx-auto mt-3 max-w-md text-sm text-cocoa">
              {o.mastered && o.mastered.length
                ? `Super! Du kannst schon ${o.mastered.map(label).join(", ")}. Diese Niveaus sind jetzt freigeschaltet.`
                : "Perfekt zum Starten: Wir beginnen ganz am Anfang – Schritt für Schritt."}
            </p>
          </>
        ) : (
          <>
            <p className="text-5xl">{o.passed ? "🏆" : "💪"}</p>
            <p className="mt-2 font-display text-4xl font-semibold text-wine">{o.passed ? "Bestanden!" : "Noch nicht bestanden"}</p>
            <p className="mt-1 text-lg text-cocoa">
              {o.score} % · {exam.pass} % zum Bestehen
            </p>
          </>
        )}

        <div className="mx-auto mt-6 max-w-sm space-y-2 text-left">
          {(Object.keys(o.sections) as Kind[]).map((k) => (
            <div key={k} className="flex items-center gap-3 text-sm">
              <span className="w-24 shrink-0 text-cocoa">
                {KIND[k].emoji} {SECTION_LABEL[k]}
              </span>
              <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-paper">
                <span className="block h-full rounded-full bg-yellow" style={{ width: `${o.sections[k]}%` }} />
              </span>
              <span className="w-10 text-right tabular-nums text-ink">{o.sections[k]}%</span>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-2">{actions}</div>
      </div>

      {o.writing && (
        <div className="mt-5 rounded-[2rem] border border-line bg-paper p-6">
          <p className="font-display text-xl text-wine">✍️ Dein Text</p>
          <p className="mt-1 text-sm text-cocoa">{o.writing.words} Wörter</p>
          {o.writing.checks.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm">
              {o.writing.checks.map((c) => (
                <li key={c.label} className={c.ok ? "text-sage" : "text-wine"}>
                  {c.ok ? "✓" : "✗"} {c.label}
                </li>
              ))}
              <li className={o.writing.minOk ? "text-sage" : "text-wine"}>{o.writing.minOk ? "✓" : "✗"} Länge</li>
            </ul>
          )}
          {(exam.sections.find((s) => s.kind === "writing") as Extract<ExamSection, { kind: "writing" }> | undefined) && (
            <details className="mt-3 text-sm">
              <summary className="cursor-pointer text-wine">Mustertext ansehen</summary>
              <p className="mt-2 rounded-xl bg-cream/70 p-3 italic text-ink">
                {(exam.sections.find((s) => s.kind === "writing") as Extract<ExamSection, { kind: "writing" }>).task.model}
              </p>
            </details>
          )}
        </div>
      )}

      {mode === "pass" && o.wrong.length > 0 && (
        <div className="mt-5 rounded-[2rem] border border-line bg-paper p-6">
          <p className="font-display text-xl text-wine">🔎 Deine Fehler</p>
          <ul className="mt-3 space-y-3 text-sm">
            {o.wrong.map((w, k) => (
              <li key={k}>
                <p className="font-medium text-ink">{w.q}</p>
                <p className="text-wine">✗ {w.chosen ?? "—"}</p>
                <p className="text-sage">✓ {w.correct}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
