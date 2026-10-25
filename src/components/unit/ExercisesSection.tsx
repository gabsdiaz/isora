"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Exercise, Localized } from "@/content/types";
import { useT } from "@/lib/i18n";

type Result = Record<string, boolean>;

export function ExercisesSection({
  exercises,
  onComplete,
}: {
  exercises: Exercise[];
  onComplete: (score: number, total: number) => void;
}) {
  const { t } = useT();
  const [results, setResults] = useState<Result>({});
  const [round, setRound] = useState(0);
  const reported = useRef(false);

  const answered = Object.keys(results).length;
  const score = Object.values(results).filter(Boolean).length;
  const finished = answered === exercises.length;

  useEffect(() => {
    if (finished && !reported.current) {
      reported.current = true;
      onComplete(score, exercises.length);
    }
  }, [finished, score, exercises.length, onComplete]);

  const record = (id: string, ok: boolean) => setResults((r) => (id in r ? r : { ...r, [id]: ok }));

  const restart = () => {
    setResults({});
    reported.current = false;
    setRound((n) => n + 1);
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-line bg-paper px-4 py-3">
        <div className="flex-1">
          <div className="h-2 overflow-hidden rounded-full bg-cream-deep">
            <div className="h-full rounded-full bg-wine transition-all" style={{ width: `${(answered / exercises.length) * 100}%` }} />
          </div>
        </div>
        <p className="shrink-0 text-sm text-cocoa">
          {t("score")}: <span className="font-semibold text-wine">{score}</span>/{exercises.length}
        </p>
      </div>

      <ol className="space-y-4" key={round}>
        {exercises.map((ex, i) => (
          <li key={ex.id} className="rounded-3xl border border-line bg-paper p-5">
            <ExerciseItem index={i + 1} exercise={ex} onResult={(ok) => record(ex.id, ok)} />
          </li>
        ))}
      </ol>

      {finished && (
        <div className="mt-6 rounded-3xl bg-wine p-6 text-center text-cream">
          <p className="font-display text-2xl">{t("exercisesDone")}</p>
          <p className="mt-1 text-cream/80">
            {score}/{exercises.length}
          </p>
          <button type="button" onClick={restart} className="mt-4 rounded-full bg-cream px-5 py-2 text-sm font-medium text-wine hover:bg-paper">
            {t("reset")}
          </button>
        </div>
      )}
    </div>
  );
}

function ExerciseItem({ index, exercise, onResult }: { index: number; exercise: Exercise; onResult: (ok: boolean) => void }) {
  const { loc } = useT();
  return (
    <div>
      <p className="mb-3 flex gap-2 text-sm font-medium text-cocoa">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cream-deep text-xs">{index}</span>
        {loc(exercise.prompt)}
      </p>
      {exercise.type === "choice" && <Choice ex={exercise} onResult={onResult} />}
      {exercise.type === "fill" && <Fill ex={exercise} onResult={onResult} />}
      {exercise.type === "order" && <Order ex={exercise} onResult={onResult} />}
      {exercise.type === "match" && <Match ex={exercise} onResult={onResult} />}
    </div>
  );
}

function Feedback({ ok, explanation, extra }: { ok: boolean; explanation?: Localized; extra?: string }) {
  const { t, loc } = useT();
  return (
    <div className={`mt-3 rounded-2xl px-4 py-3 text-sm ${ok ? "bg-sage-soft text-ink" : "bg-wine-soft text-ink"}`}>
      <p className={`font-semibold ${ok ? "text-sage" : "text-wine"}`}>
        {ok ? t("correct") : t("incorrect")} {extra && <span className="font-display font-normal text-ink">→ {extra}</span>}
      </p>
      {explanation && <p className="mt-1 text-ink/80">{loc(explanation)}</p>}
    </div>
  );
}

const shuffle = <T,>(arr: T[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ── Opción múltiple ── */
function Choice({ ex, onResult }: { ex: Extract<Exercise, { type: "choice" }>; onResult: (ok: boolean) => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div>
      <div className="grid gap-2 sm:grid-cols-2">
        {ex.options.map((opt, i) => {
          const isAnswer = i === ex.answer;
          const state = picked === null ? "idle" : isAnswer ? "right" : picked === i ? "wrong" : "dim";
          return (
            <button
              key={opt}
              type="button"
              disabled={picked !== null}
              onClick={() => {
                setPicked(i);
                onResult(isAnswer);
              }}
              className={`rounded-2xl border px-4 py-3 text-left font-display text-[17px] transition ${
                state === "idle"
                  ? "border-line bg-cream/60 hover:border-wine-light"
                  : state === "right"
                    ? "border-sage bg-sage-soft"
                    : state === "wrong"
                      ? "border-wine bg-wine-soft"
                      : "border-line opacity-50"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {picked !== null && <Feedback ok={picked === ex.answer} explanation={ex.explanation} />}
    </div>
  );
}

/* ── Completar ── */
const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

function Fill({ ex, onResult }: { ex: Extract<Exercise, { type: "fill" }>; onResult: (ok: boolean) => void }) {
  const { t, loc } = useT();
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [before, after] = ex.sentence.split("___");

  const check = () => {
    if (!value.trim()) return;
    const ok = ex.answers.some((a) => normalize(a) === normalize(value));
    setChecked(ok);
    onResult(ok);
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          check();
        }}
        className="flex flex-wrap items-center gap-x-2 gap-y-3 font-display text-xl text-ink"
      >
        <span>{before}</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={checked !== null}
          aria-label="Respuesta"
          autoCapitalize="off"
          autoComplete="off"
          spellCheck={false}
          className={`w-32 rounded-xl border-b-2 bg-cream px-3 py-1.5 text-center outline-none transition ${
            checked === null ? "border-cocoa-light focus:border-wine" : checked ? "border-sage bg-sage-soft" : "border-wine bg-wine-soft"
          }`}
        />
        <span>{after}</span>
        {checked === null && (
          <button type="submit" className="ml-auto rounded-full bg-wine px-4 py-2 font-sans text-sm font-medium text-cream hover:bg-wine-light">
            {t("check")}
          </button>
        )}
      </form>
      {ex.hint && checked === null && (
        <button type="button" onClick={() => setShowHint(true)} className="mt-2 text-xs text-muted hover:text-wine">
          {showHint ? `${t("hint")}: ${loc(ex.hint)}` : `${t("hint")} →`}
        </button>
      )}
      {checked !== null && <Feedback ok={checked} explanation={ex.explanation} extra={checked ? undefined : ex.answers[0]} />}
    </div>
  );
}

/* ── Ordenar palabras ── */
function Order({ ex, onResult }: { ex: Extract<Exercise, { type: "order" }>; onResult: (ok: boolean) => void }) {
  const { t } = useT();
  const pool = useMemo(() => shuffle(ex.words.map((w, i) => ({ w, i }))), [ex.words]);
  const [chosen, setChosen] = useState<number[]>([]);
  const [checked, setChecked] = useState<boolean | null>(null);

  const sentence = chosen.map((i) => ex.words[i]).join(" ");
  const target = ex.words.join(" ");

  const check = () => {
    const ok = sentence === target;
    setChecked(ok);
    onResult(ok);
  };

  return (
    <div>
      <div className="flex min-h-14 flex-wrap items-center gap-2 rounded-2xl border border-dashed border-line bg-cream/60 p-3">
        {chosen.length === 0 && <span className="text-sm text-muted">{t("tapToOrder")}</span>}
        {chosen.map((i) => (
          <button
            key={i}
            type="button"
            disabled={checked !== null}
            onClick={() => setChosen((c) => c.filter((x) => x !== i))}
            className="rounded-xl border border-wine-light bg-paper px-3 py-1.5 font-display text-lg text-wine"
          >
            {ex.words[i]}
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {pool.map(({ w, i }) =>
          chosen.includes(i) ? (
            <span key={i} className="rounded-xl border border-line px-3 py-1.5 font-display text-lg text-transparent">
              {w}
            </span>
          ) : (
            <button
              key={i}
              type="button"
              disabled={checked !== null}
              onClick={() => setChosen((c) => [...c, i])}
              className="rounded-xl border border-line bg-paper px-3 py-1.5 font-display text-lg text-ink hover:border-wine-light"
            >
              {w}
            </button>
          ),
        )}
        {checked === null && chosen.length === ex.words.length && (
          <button type="button" onClick={check} className="ml-auto rounded-full bg-wine px-4 py-2 text-sm font-medium text-cream hover:bg-wine-light">
            {t("check")}
          </button>
        )}
      </div>
      {checked !== null && <Feedback ok={checked} explanation={ex.explanation} extra={checked ? undefined : target} />}
    </div>
  );
}

/* ── Unir parejas ── */
function Match({ ex, onResult }: { ex: Extract<Exercise, { type: "match" }>; onResult: (ok: boolean) => void }) {
  const { loc } = useT();
  const right = useMemo(() => shuffle(ex.pairs.map((_, i) => i)), [ex.pairs]);
  const [left, setLeft] = useState<number | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const done = matched.length === ex.pairs.length;

  const pickRight = (i: number) => {
    if (left === null || matched.includes(i)) return;
    if (i === left) {
      const next = [...matched, i];
      setMatched(next);
      setLeft(null);
      if (next.length === ex.pairs.length) onResult(mistakes === 0);
    } else {
      setMistakes((m) => m + 1);
      setWrong(i);
      setTimeout(() => setWrong(null), 500);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          {ex.pairs.map((p, i) => (
            <button
              key={p.de}
              type="button"
              disabled={matched.includes(i)}
              onClick={() => setLeft(i)}
              className={`w-full rounded-2xl border px-3 py-2.5 text-left font-display text-[17px] transition ${
                matched.includes(i)
                  ? "border-sage bg-sage-soft text-sage"
                  : left === i
                    ? "border-wine bg-wine-soft text-wine"
                    : "border-line bg-cream/60 hover:border-wine-light"
              }`}
            >
              {p.de}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {right.map((i) => (
            <button
              key={i}
              type="button"
              disabled={matched.includes(i)}
              onClick={() => pickRight(i)}
              className={`w-full rounded-2xl border px-3 py-2.5 text-left text-sm transition ${
                matched.includes(i)
                  ? "border-sage bg-sage-soft text-sage"
                  : wrong === i
                    ? "border-wine bg-wine-soft"
                    : "border-line bg-cream/60 hover:border-wine-light"
              }`}
            >
              {loc(ex.pairs[i].meaning)}
            </button>
          ))}
        </div>
      </div>
      {done && <Feedback ok={mistakes === 0} />}
    </div>
  );
}
