"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Exercise, Tri } from "@/content/types";
import { useT } from "@/lib/i18n";
import { speakGerman } from "@/lib/speech";
import { GermanText, SpeakerIcon } from "../german/Gloss";
import { Translatable } from "../german/Translatable";

type Result = Record<string, boolean>;

export function ExercisesSection({
  exercises,
  unitKey,
  onComplete,
}: {
  exercises: Exercise[];
  unitKey: string;
  onComplete: (score: number, total: number) => void;
}) {
  const { g } = useT();
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
      <div className="sticky top-[7.5rem] z-10 mb-5 flex items-center justify-between gap-3 rounded-2xl border border-line bg-paper/95 px-4 py-3 backdrop-blur">
        <div className="flex-1">
          <div className="h-2 overflow-hidden rounded-full bg-cream-deep">
            <div className="h-full rounded-full bg-wine transition-all" style={{ width: `${(answered / exercises.length) * 100}%` }} />
          </div>
        </div>
        <p className="shrink-0 text-sm text-cocoa">
          {g("score")}: <span className="font-semibold text-wine">{score}</span>/{exercises.length}
        </p>
      </div>

      <ol className="space-y-4" key={round}>
        {exercises.map((ex, i) => (
          <li key={ex.id} className="rounded-3xl border border-line bg-paper p-5">
            <div className="mb-3 flex gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cream-deep text-xs font-medium text-cocoa">{i + 1}</span>
              <Translatable de={ex.prompt.de} tr={ex.prompt} unitKey={unitKey} className="flex-1" textClassName="text-[15px] font-medium text-cocoa" />
            </div>
            {ex.type === "choice" && <Choice ex={ex} unitKey={unitKey} onResult={(ok) => record(ex.id, ok)} />}
            {ex.type === "listen" && <Listen ex={ex} unitKey={unitKey} onResult={(ok) => record(ex.id, ok)} />}
            {ex.type === "fill" && <Fill ex={ex} unitKey={unitKey} onResult={(ok) => record(ex.id, ok)} />}
            {ex.type === "order" && <Order ex={ex} unitKey={unitKey} onResult={(ok) => record(ex.id, ok)} />}
            {ex.type === "match" && <Match ex={ex} onResult={(ok) => record(ex.id, ok)} />}
            {ex.type === "rf" && <RichtigFalsch ex={ex} unitKey={unitKey} onResult={(ok) => record(ex.id, ok)} />}
            {ex.type === "write" && <Write ex={ex} unitKey={unitKey} onResult={(ok) => record(ex.id, ok)} />}
          </li>
        ))}
      </ol>

      {finished && (
        <div className="mt-6 rounded-3xl bg-wine p-6 text-center text-cream">
          <p className="font-display text-2xl">{g("exercisesDone")}</p>
          <p className="mt-1 text-cream/80">
            {score}/{exercises.length}
          </p>
          <button type="button" onClick={restart} className="mt-4 rounded-full bg-cream px-5 py-2 text-sm font-medium text-wine hover:bg-paper">
            {g("reset")}
          </button>
        </div>
      )}
    </div>
  );
}

function Feedback({ ok, explanation, extra, unitKey }: { ok: boolean; explanation?: Tri; extra?: string; unitKey: string }) {
  const { g } = useT();
  return (
    <div className={`mt-3 rounded-2xl px-4 py-3 text-sm ${ok ? "bg-sage-soft" : "bg-wine-soft"}`}>
      <p className={`font-semibold ${ok ? "text-sage" : "text-wine"}`}>
        {ok ? g("correct") : g("incorrect")} {extra && <span className="font-display font-normal text-ink">→ {extra}</span>}
      </p>
      {explanation && <Translatable de={explanation.de} tr={explanation} unitKey={unitKey} className="mt-1" textClassName="text-ink/80" />}
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

function OptionButtons({
  options,
  answer,
  picked,
  onPick,
}: {
  options: string[];
  answer: number;
  picked: number | null;
  onPick: (i: number) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((opt, i) => {
        const state = picked === null ? "idle" : i === answer ? "right" : picked === i ? "wrong" : "dim";
        return (
          <button
            key={opt}
            type="button"
            disabled={picked !== null}
            onClick={() => onPick(i)}
            lang="de"
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
  );
}

/* ── Opción múltiple ── */
function Choice({ ex, unitKey, onResult }: { ex: Extract<Exercise, { type: "choice" }>; unitKey: string; onResult: (ok: boolean) => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div>
      {ex.sentence && (
        <p className="mb-3 font-display text-xl text-ink">
          <GermanText text={ex.sentence} unitKey={unitKey} />
        </p>
      )}
      <OptionButtons
        options={ex.options}
        answer={ex.answer}
        picked={picked}
        onPick={(i) => {
          setPicked(i);
          onResult(i === ex.answer);
        }}
      />
      {picked !== null && <Feedback ok={picked === ex.answer} explanation={ex.explanation} unitKey={unitKey} />}
    </div>
  );
}

/* ── Escuchar y elegir ── */
function Listen({ ex, unitKey, onResult }: { ex: Extract<Exercise, { type: "listen" }>; unitKey: string; onResult: (ok: boolean) => void }) {
  const { g } = useT();
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div>
      <button
        type="button"
        onClick={() => speakGerman(ex.audio, ex.voice ?? "m")}
        className="mb-4 inline-flex items-center gap-2.5 rounded-full bg-wine px-5 py-3 text-sm font-medium text-cream shadow-md shadow-wine/20 transition hover:bg-wine-light active:scale-95"
      >
        <SpeakerIcon size={18} /> {g("play")}
      </button>
      <OptionButtons
        options={ex.options}
        answer={ex.answer}
        picked={picked}
        onPick={(i) => {
          setPicked(i);
          onResult(i === ex.answer);
        }}
      />
      {picked !== null && <Feedback ok={picked === ex.answer} explanation={ex.explanation} unitKey={unitKey} />}
    </div>
  );
}

/* ── Completar ── */
const normalize = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/[.!?]+$/, "")
    .replace(/\s+/g, " ");

function Fill({ ex, unitKey, onResult }: { ex: Extract<Exercise, { type: "fill" }>; unitKey: string; onResult: (ok: boolean) => void }) {
  const { g } = useT();
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
        lang="de"
      >
        {before && <span>{before}</span>}
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={checked !== null}
          aria-label="Antwort"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className={`w-36 rounded-xl border-b-2 bg-cream px-3 py-1.5 text-center outline-none transition ${
            checked === null ? "border-cocoa-light focus:border-wine" : checked ? "border-sage bg-sage-soft" : "border-wine bg-wine-soft"
          }`}
        />
        {after && <span>{after}</span>}
        {checked === null && (
          <button type="submit" className="ml-auto rounded-full bg-wine px-4 py-2 font-sans text-sm font-medium text-cream hover:bg-wine-light">
            {g("check")}
          </button>
        )}
      </form>
      <SpecialChars disabled={checked !== null} onInsert={(c) => setValue((v) => v + c)} />
      {ex.hint && checked === null && (
        <button type="button" onClick={() => setShowHint(true)} className="mt-2 block text-xs text-muted hover:text-wine">
          {showHint ? `${g("hint")}: ${ex.hint.de}` : `${g("hint")} →`}
        </button>
      )}
      {checked !== null && <Feedback ok={checked} explanation={ex.explanation} extra={checked ? undefined : ex.answers[0]} unitKey={unitKey} />}
    </div>
  );
}

/** Teclas para ä, ö, ü, ß (útil en teclados sin estas letras) */
function SpecialChars({ onInsert, disabled }: { onInsert: (c: string) => void; disabled: boolean }) {
  if (disabled) return null;
  return (
    <div className="mt-2 flex gap-1.5">
      {["ä", "ö", "ü", "ß"].map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onInsert(c)}
          className="h-8 w-8 rounded-lg border border-line bg-cream/60 font-display text-base text-cocoa hover:border-wine-light"
        >
          {c}
        </button>
      ))}
    </div>
  );
}

/* ── Ordenar palabras ── */
function Order({ ex, unitKey, onResult }: { ex: Extract<Exercise, { type: "order" }>; unitKey: string; onResult: (ok: boolean) => void }) {
  const { g } = useT();
  const pool = useMemo(() => shuffle(ex.words.map((w, i) => ({ w, i }))), [ex.words]);
  const [chosen, setChosen] = useState<number[]>([]);
  const [checked, setChecked] = useState<boolean | null>(null);

  const sentence = chosen.map((i) => ex.words[i]).join(" ");
  const target = ex.words.join(" ");

  const check = () => {
    const ok = sentence === target;
    setChecked(ok);
    onResult(ok);
    speakGerman(target);
  };

  return (
    <div lang="de">
      <div className="flex min-h-14 flex-wrap items-center gap-2 rounded-2xl border border-dashed border-line bg-cream/60 p-3">
        {chosen.length === 0 && <span className="text-sm text-muted">{g("tapToOrder")}</span>}
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
            {g("check")}
          </button>
        )}
      </div>
      {checked !== null && <Feedback ok={checked} explanation={ex.explanation} extra={checked ? undefined : target} unitKey={unitKey} />}
    </div>
  );
}

/* ── Unir parejas ── */
function Match({ ex, onResult }: { ex: Extract<Exercise, { type: "match" }>; onResult: (ok: boolean) => void }) {
  const { loc, g } = useT();
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
        <div className="space-y-2" lang="de">
          {ex.pairs.map((p, i) => (
            <button
              key={p.de}
              type="button"
              disabled={matched.includes(i)}
              onClick={() => {
                setLeft(i);
                speakGerman(p.de);
              }}
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
              {loc(ex.pairs[i].tr)}
            </button>
          ))}
        </div>
      </div>
      {done && (
        <div className={`mt-3 rounded-2xl px-4 py-3 text-sm font-semibold ${mistakes === 0 ? "bg-sage-soft text-sage" : "bg-wine-soft text-wine"}`}>
          {mistakes === 0 ? g("correct") : `${g("incorrect")} (${mistakes})`}
        </div>
      )}
    </div>
  );
}

/* ── Richtig / Falsch (formato Goethe A1) ── */
function RichtigFalsch({ ex, unitKey, onResult }: { ex: Extract<Exercise, { type: "rf" }>; unitKey: string; onResult: (ok: boolean) => void }) {
  const { g } = useT();
  const [picked, setPicked] = useState<boolean | null>(null);
  return (
    <div>
      {ex.context && (
        <div className="mb-4 rounded-2xl border border-line bg-cream/70 p-4 font-display text-[17px] leading-relaxed text-ink shadow-inner" lang="de">
          {ex.contextTitle && <p className="mb-1 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cocoa">{ex.contextTitle}</p>}
          {ex.context.split("\n").map((line, i) => (
            <p key={i}>
              <GermanText text={line} unitKey={unitKey} />
            </p>
          ))}
        </div>
      )}
      <p className="mb-3 font-display text-xl text-ink">
        <GermanText text={ex.statement} unitKey={unitKey} />
      </p>
      <div className="flex gap-2">
        {[true, false].map((v) => {
          const state = picked === null ? "idle" : v === ex.answer ? "right" : picked === v ? "wrong" : "dim";
          return (
            <button
              key={String(v)}
              type="button"
              disabled={picked !== null}
              onClick={() => {
                setPicked(v);
                onResult(v === ex.answer);
              }}
              className={`flex-1 rounded-2xl border px-4 py-3 font-medium transition ${
                state === "idle"
                  ? "border-line bg-cream/60 text-ink hover:border-wine-light"
                  : state === "right"
                    ? "border-sage bg-sage-soft text-sage"
                    : state === "wrong"
                      ? "border-wine bg-wine-soft text-wine"
                      : "border-line opacity-50"
              }`}
            >
              {v ? g("right") : g("wrong")}
            </button>
          );
        })}
      </div>
      {picked !== null && <Feedback ok={picked === ex.answer} explanation={ex.explanation} unitKey={unitKey} />}
    </div>
  );
}

/* ── Escritura libre con modelo ── */
function Write({ ex, unitKey, onResult }: { ex: Extract<Exercise, { type: "write" }>; unitKey: string; onResult: (ok: boolean) => void }) {
  const { g } = useT();
  const [text, setText] = useState("");
  const [shown, setShown] = useState(false);
  const count = text.trim() ? text.trim().split(/\s+/).length : 0;
  return (
    <div>
      <Translatable de={ex.task.de} tr={ex.task} unitKey={unitKey} className="mb-3 rounded-2xl bg-cream/70 p-4" textClassName="text-[16px] leading-relaxed text-ink" />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        lang="de"
        spellCheck={false}
        placeholder={g("yourText")}
        className="w-full rounded-2xl border border-line bg-cream/40 p-4 font-display text-[17px] leading-relaxed text-ink outline-none focus:border-wine"
      />
      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="text-xs text-muted">
          {count} {g("words")}
        </span>
        {!shown && (
          <button
            type="button"
            onClick={() => {
              setShown(true);
              onResult(true);
            }}
            className="rounded-full bg-wine px-4 py-2 text-sm font-medium text-cream hover:bg-wine-light"
          >
            {g("showModel")}
          </button>
        )}
      </div>
      {shown && (
        <div className="mt-3 rounded-2xl border-l-4 border-sage bg-sage-soft p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-sage">{g("model")}</p>
          {ex.model.split("\n").map((line, i) => (
            <p key={i} className="font-display text-[17px] leading-relaxed text-ink">
              <GermanText text={line} unitKey={unitKey} />
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
