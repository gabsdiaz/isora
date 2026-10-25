"use client";

import { useEffect, useState } from "react";
import { imageFor } from "@/content/de/images";
import { hangmanWords, type Theme } from "@/content/de/themes";
import { useT } from "@/lib/i18n";
import { speakGerman } from "@/lib/speech";
import { ARTICLE_TEXT, ResultCard, headword, shuffle, stars } from "./shared";

const LIVES = 8;
const WORDS_PER_GAME = 6;
const KEYS = ["QWERTZUIOPÜ", "ASDFGHJKLÖÄ", "YXCVBNMß"];

/** Mayúscula que conserva ß (toUpperCase la convertiría en "SS"). */
const up = (c: string) => (c === "ß" ? "ß" : c.toLocaleUpperCase("de-DE"));
const isLetter = (c: string) => /\p{L}/u.test(c);

/** Galgenmännchen (ahorcado) con palabras del tema. */
export function Hangman({ theme, onRestart }: { theme: Theme; onRestart: () => void }) {
  const { g, loc } = useT();
  const [words] = useState(() => shuffle(hangmanWords(theme)).slice(0, WORDS_PER_GAME));
  const [i, setI] = useState(0);
  const [guessed, setGuessed] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [hint, setHint] = useState(false);

  const w = words[i];
  const letters = w ? [...w.de] : [];
  const wrong = guessed.filter((l) => !letters.some((c) => up(c) === l)).length;
  const won = Boolean(w) && letters.every((c) => !isLetter(c) || guessed.includes(up(c)));
  const lost = wrong >= LIVES;
  const over = won || lost;

  const guess = (l: string) => {
    if (over || guessed.includes(l)) return;
    const next = [...guessed, l];
    setGuessed(next);
    const nowWon = letters.every((c) => !isLetter(c) || next.includes(up(c)));
    const nowWrong = next.filter((x) => !letters.some((c) => up(c) === x)).length;
    if (nowWon) {
      setScore((s) => s + 1);
      speakGerman(headword(w));
    } else if (nowWrong >= LIVES) speakGerman(headword(w));
  };

  // Teclado físico
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.length === 1 ? up(e.key) : "";
      if (KEYS.join("").includes(k) && k) guess(k);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!w) {
    return (
      <ResultCard
        emoji={stars(score / words.length)}
        title={`${score} von ${words.length} Wörtern!`}
        detail="Gut gespielt. Noch eine Runde mit neuen Wörtern?"
        onRestart={onRestart}
        restartLabel={g("reset")}
      />
    );
  }

  const next = () => {
    setGuessed([]);
    setHint(false);
    setI((n) => n + 1);
  };
  const img = imageFor(w.de);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between text-sm text-cocoa">
        <span>
          Wort {i + 1} von {words.length}
        </span>
        <span>
          {g("score")}: <b className="text-ink">{score}</b>
        </span>
      </div>

      <div className="mt-4 grid items-center gap-6 md:grid-cols-[220px_1fr]">
        <Gallows wrong={wrong} />
        <div>
          <div className="flex items-center gap-3">
            {img && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img} alt="" width={56} height={56} className={hint || over ? "" : "opacity-90"} />
            )}
            <div className="text-sm text-cocoa">
              <p>
                Noch <b className="text-wine">{LIVES - wrong}</b> Versuche {"❤️".repeat(Math.max(0, Math.min(3, LIVES - wrong)))}
              </p>
              <button type="button" onClick={() => setHint(true)} className="mt-1 text-muted underline decoration-dotted hover:text-wine">
                {hint || over ? `🌐 ${loc(w.tr)}` : `💡 ${g("hint")}`}
              </button>
            </div>
          </div>

          <p className="mt-5 flex flex-wrap items-end gap-x-1.5 gap-y-3 font-display text-3xl sm:text-4xl" aria-live="polite">
            {w.article && <span className={`mr-2 text-2xl ${ARTICLE_TEXT[w.article]}`}>{w.article}</span>}
            {letters.map((c, k) =>
              isLetter(c) ? (
                <span key={k} className={`inline-flex w-[0.85em] justify-center border-b-2 ${over && !guessed.includes(up(c)) ? "border-wine text-wine" : "border-ink text-ink"}`}>
                  {guessed.includes(up(c)) || over ? (k === 0 && w.article ? c : c) : " "}
                </span>
              ) : (
                <span key={k}>{c}</span>
              ),
            )}
          </p>

          {over && (
            <div className={`mt-5 flex items-center justify-between gap-3 rounded-2xl p-4 ${won ? "bg-sage-soft text-sage" : "bg-wine-soft text-wine"}`}>
              <p className="font-medium">{won ? `${g("correct")} 🎉` : `Das Wort war: ${headword(w)}`}</p>
              <button type="button" onClick={next} className="shrink-0 rounded-full bg-wine px-5 py-2 text-sm font-medium text-cream hover:bg-wine-light">
                {g("continue")} →
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-1.5">
        {KEYS.map((row) => (
          <div key={row} className="flex justify-center gap-1 sm:gap-1.5">
            {[...row].map((l) => {
              const used = guessed.includes(l);
              const hit = used && letters.some((c) => up(c) === l);
              return (
                <button
                  key={l}
                  type="button"
                  disabled={used || over}
                  onClick={() => guess(l)}
                  className={`h-10 w-[8.4%] max-w-11 rounded-lg text-sm font-semibold transition sm:h-11 sm:text-base ${
                    hit ? "bg-sage text-cream" : used ? "bg-cream-deep text-muted line-through" : "border border-line bg-paper text-ink hover:border-cocoa-light disabled:opacity-60"
                  }`}
                >
                  {l}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Dibujo estilo cuaderno: aparece una parte por cada error. */
function Gallows({ wrong }: { wrong: number }) {
  const parts = [
    <line key="base" x1="20" y1="190" x2="140" y2="190" />,
    <line key="pole" x1="50" y1="190" x2="50" y2="20" />,
    <line key="beam" x1="48" y1="22" x2="130" y2="22" />,
    <line key="rope" x1="128" y1="22" x2="128" y2="48" />,
    <circle key="head" cx="128" cy="64" r="16" />,
    <line key="body" x1="128" y1="80" x2="128" y2="128" />,
    <path key="arms" d="M106 104 L128 92 L150 104" />,
    <path key="legs" d="M110 160 L128 128 L146 160" />,
  ];
  return (
    <svg viewBox="0 0 170 200" className="mx-auto h-48 w-44 rounded-2xl border border-line bg-paper p-2" aria-label={`${wrong} Fehler`}>
      {[40, 80, 120, 160].map((y) => (
        <line key={y} x1="0" y1={y} x2="170" y2={y} stroke="#e2d8c6" strokeWidth="1" />
      ))}
      <g fill="none" stroke="#2e2019" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        {parts.slice(0, wrong)}
      </g>
      {wrong >= LIVES && (
        <text x="128" y="70" textAnchor="middle" fontSize="14">
          ✖✖
        </text>
      )}
    </svg>
  );
}
