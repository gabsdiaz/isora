"use client";

import { useRef, useState } from "react";
import type { VocabEntry } from "@/content/types";
import { imageFor } from "@/content/de/images";
import { themeNouns, themePictureWords, themeWords, type Theme } from "@/content/de/themes";
import { useT } from "@/lib/i18n";
import { speakGerman } from "@/lib/speech";
import { ARTICLE_BG, Progress, ResultCard, headword, sample, shuffle, stars } from "./shared";

/* Casillas de la ruleta */
const SEGMENTS = [
  { id: "bild", de: "Was ist das?", emoji: "🖼️", color: "#940d00", text: "#fbf9f4" },
  { id: "sprich", de: "Sprich!", emoji: "🗣️", color: "#f3ead9", text: "#940d00" },
  { id: "artikel", de: "der, die, das?", emoji: "🎯", color: "#6b4a3a", text: "#fbf9f4" },
  { id: "hoer", de: "Hör zu!", emoji: "🎧", color: "#e8d9c2", text: "#4a3326" },
  { id: "uebersetze", de: "Übersetze!", emoji: "🔤", color: "#940d00", text: "#fbf9f4" },
  { id: "joker", de: "Joker!", emoji: "⭐", color: "#c08a3e", text: "#fbf9f4" },
] as const;
type SegId = (typeof SEGMENTS)[number]["id"];

const SPINS = 8;
const N = SEGMENTS.length;
const SLICE = 360 / N;

type Question =
  | { kind: "bild" | "hoer" | "uebersetze"; word: VocabEntry; options: VocabEntry[] }
  | { kind: "artikel"; word: VocabEntry }
  | { kind: "sprich"; de: string; tr: { es: string; en: string } }
  | { kind: "joker" };

function makeQuestion(kind: SegId, theme: Theme): Question {
  const words = themeWords(theme).filter((w) => w.de.length < 24);
  const choices = (pool: VocabEntry[]) => {
    const word = sample(pool);
    const others = shuffle(pool.filter((w) => w.de !== word.de)).slice(0, 3);
    return { word, options: shuffle([word, ...others]) };
  };
  switch (kind) {
    case "bild": {
      const pics = themePictureWords(theme);
      return { kind, ...choices(pics.length >= 4 ? pics : words) };
    }
    case "hoer":
    case "uebersetze":
      return { kind, ...choices(words) };
    case "artikel":
      return { kind, word: sample(themeNouns(theme)) };
    case "sprich":
      return { kind, ...sample(theme.questions) };
    default:
      return { kind: "joker" };
  }
}

/** Ruleta de preguntas: gira, responde y suma puntos (8 giros por partida). */
export function Wheel({ theme, onRestart }: { theme: Theme; onRestart: () => void }) {
  const { g, loc } = useT();
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);
  const [answered, setAnswered] = useState<string | null>(null);
  const [spins, setSpins] = useState(0);
  const [score, setScore] = useState(0);
  const [showTr, setShowTr] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const spin = () => {
    if (spinning || question) return;
    const idx = Math.floor(Math.random() * N);
    const center = idx * SLICE + SLICE / 2;
    const base = rotation - (rotation % 360);
    const target = base + 360 * 5 + ((360 - center) % 360);
    setRotation(target);
    setSpinning(true);
    timer.current = setTimeout(() => {
      setSpinning(false);
      const q = makeQuestion(SEGMENTS[idx].id, theme);
      setQuestion(q);
      setAnswered(null);
      setShowTr(false);
      if (q.kind === "hoer") speakGerman(headword(q.word));
      if (q.kind === "sprich") speakGerman(q.de, "f");
      if (q.kind === "joker") setScore((s) => s + 2);
    }, 3700);
  };

  const finish = () => {
    setQuestion(null);
    setSpins((n) => n + 1);
  };

  const pick = (value: string, correct: string, say: string) => {
    if (answered) return;
    setAnswered(value);
    if (value === correct) setScore((s) => s + 1);
    speakGerman(say);
  };

  if (spins >= SPINS) {
    return (
      <ResultCard
        emoji={stars(score / (SPINS + 2))}
        title={`${score} ${g("score")}!`}
        detail={`${SPINS} Runden gespielt. Noch eine Runde?`}
        onRestart={onRestart}
        restartLabel={g("reset")}
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Progress value={spins} max={SPINS} />
      <p className="mt-2 text-sm text-cocoa">
        {g("score")}: <b className="text-ink">{score}</b>
      </p>

      <div className="mt-4 grid items-center gap-6 md:grid-cols-[1fr_1.1fr]">
        {/* La ruleta */}
        <div className="relative mx-auto aspect-square w-full max-w-[320px]">
          <div className="absolute left-1/2 top-[-6px] z-10 -translate-x-1/2 text-3xl text-wine drop-shadow" aria-hidden="true">
            ▼
          </div>
          <svg
            viewBox="-100 -100 200 200"
            className="h-full w-full drop-shadow-md"
            style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? "transform 3.6s cubic-bezier(.17,.67,.21,1)" : "none" }}
          >
            {SEGMENTS.map((s, i) => {
              const a0 = ((i * SLICE - 90) * Math.PI) / 180;
              const a1 = (((i + 1) * SLICE - 90) * Math.PI) / 180;
              const mid = i * SLICE + SLICE / 2;
              return (
                <g key={s.id}>
                  <path d={`M0 0 L${96 * Math.cos(a0)} ${96 * Math.sin(a0)} A96 96 0 0 1 ${96 * Math.cos(a1)} ${96 * Math.sin(a1)} Z`} fill={s.color} stroke="#fbf9f4" strokeWidth="1.5" />
                  <g transform={`rotate(${mid}) translate(0 -62)`}>
                    <text textAnchor="middle" fontSize="20" y="4">
                      {s.emoji}
                    </text>
                    <text textAnchor="middle" fontSize="9" y="22" fill={s.text} fontWeight="600">
                      {s.de}
                    </text>
                  </g>
                </g>
              );
            })}
            <circle r="97" fill="none" stroke="#4a3326" strokeWidth="2.5" />
            {SEGMENTS.map((s, i) => (
              <circle key={s.id} cx={0} cy={-97} r="2.2" fill="#fbf9f4" transform={`rotate(${i * SLICE})`} />
            ))}
            <circle r="16" fill="#fbf9f4" stroke="#4a3326" strokeWidth="2" />
          </svg>
          <button
            type="button"
            onClick={spin}
            disabled={spinning || Boolean(question)}
            className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-wine text-xs font-bold text-cream shadow-lg transition hover:scale-105 disabled:opacity-60"
          >
            {spinning ? "…" : "Drehen!"}
          </button>
        </div>

        {/* La pregunta */}
        <div className="min-h-[260px] rounded-[2rem] border border-line bg-paper p-6 shadow-sm">
          {!question ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
              <p className="text-4xl">🎡</p>
              <p className="font-display text-2xl text-wine">{spinning ? "Das Rad dreht sich …" : "Dreh das Rad!"}</p>
              <p className="text-sm text-muted">Bild, Artikel, Hören, Übersetzen, Sprechen – oder Joker.</p>
            </div>
          ) : (
            <QuestionView q={question} answered={answered} showTr={showTr} setShowTr={setShowTr} pick={pick} loc={loc} />
          )}
          {question && (question.kind === "joker" || question.kind === "sprich" || answered) && (
            <div className="mt-5 flex justify-end gap-2">
              {question.kind === "sprich" && (
                <button type="button" onClick={() => {
                    setScore((s) => s + 1);
                    finish();
                  }} className="rounded-full bg-sage px-5 py-2 text-sm font-medium text-cream">
                  Ich habe geantwortet ✓
                </button>
              )}
              <button type="button" onClick={finish} className="rounded-full bg-wine px-5 py-2 text-sm font-medium text-cream hover:bg-wine-light">
                {g("continue")} →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuestionView({
  q,
  answered,
  showTr,
  setShowTr,
  pick,
  loc,
}: {
  q: Question;
  answered: string | null;
  showTr: boolean;
  setShowTr: (v: boolean) => void;
  pick: (value: string, correct: string, say: string) => void;
  loc: (tr: { es: string; en: string }) => string;
}) {
  const optionClass = (value: string, correct: string) =>
    !answered
      ? "border-line bg-cream hover:border-cocoa-light"
      : value === correct
        ? "border-sage bg-sage-soft text-sage"
        : value === answered
          ? "border-wine/40 bg-wine-soft text-wine line-through"
          : "border-line bg-cream opacity-50";

  if (q.kind === "joker")
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <p className="text-5xl">⭐</p>
        <p className="font-display text-2xl text-wine">Joker! +2 Punkte</p>
        <p className="text-sm text-muted">Glück gehabt!</p>
      </div>
    );

  if (q.kind === "sprich")
    return (
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-gold">🗣️ Sprich!</p>
        <button type="button" onClick={() => speakGerman(q.de, "f")} className="mt-2 text-left font-display text-3xl text-ink hover:text-wine">
          {q.de} 🔊
        </button>
        <p className="mt-3 text-sm text-cocoa">Antworte laut auf Deutsch – in einem ganzen Satz.</p>
        <button type="button" onClick={() => setShowTr(!showTr)} className="mt-3 text-sm text-muted underline decoration-dotted">
          {showTr ? loc(q.tr) : "🌐 Übersetzung"}
        </button>
      </div>
    );

  if (q.kind === "artikel") {
    const w = q.word;
    return (
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-blue">🎯 der, die, das?</p>
        <div className="mt-3 flex items-center gap-4">
          {imageFor(w.de) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageFor(w.de)!} alt="" width={64} height={64} />
          )}
          <p className="font-display text-3xl text-ink">
            {answered ? w.article : "___"} {w.de}
          </p>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {(["der", "die", "das"] as const).map((a) => (
            <button
              key={a}
              type="button"
              disabled={Boolean(answered)}
              onClick={() => pick(a, w.article!, `${w.article} ${w.de}`)}
              className={`rounded-xl py-3 font-display text-xl font-semibold transition ${ARTICLE_BG[a]} ${answered && a !== w.article ? "opacity-40" : ""}`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const w = q.word;
  const prompt =
    q.kind === "bild" ? (
      <div className="flex items-center gap-4">
        {imageFor(w.de) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageFor(w.de)!} alt="" width={80} height={80} />
        ) : (
          <p className="font-display text-2xl">{loc(w.tr)}</p>
        )}
      </div>
    ) : q.kind === "hoer" ? (
      <button type="button" onClick={() => speakGerman(headword(w))} className="rounded-full border border-line bg-cream px-5 py-3 text-lg hover:border-cocoa-light">
        🔊 Noch einmal hören
      </button>
    ) : (
      <p className="font-display text-3xl text-ink">„{loc(w.tr)}“</p>
    );
  const label = q.kind === "bild" ? "🖼️ Was ist das?" : q.kind === "hoer" ? "🎧 Hör zu! Welches Wort ist das?" : "🔤 Wie heißt das auf Deutsch?";

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-wine">{label}</p>
      <div className="mt-3">{prompt}</div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {q.options.map((o) => (
          <button
            key={o.de}
            type="button"
            disabled={Boolean(answered)}
            onClick={() => pick(o.de, w.de, headword(w))}
            className={`rounded-xl border px-3 py-2.5 text-left font-display text-lg transition ${optionClass(o.de, w.de)}`}
          >
            {headword(o)}
          </button>
        ))}
      </div>
      {answered && <p className="mt-3 text-sm text-cocoa">{loc(w.tr)}</p>}
    </div>
  );
}
