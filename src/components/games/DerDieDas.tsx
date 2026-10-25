"use client";

import { useState } from "react";
import { imageFor } from "@/content/de/images";
import { themeNouns, type Theme } from "@/content/de/themes";
import { useT } from "@/lib/i18n";
import { speakGerman } from "@/lib/speech";
import { ARTICLE_BG, ARTICLE_TEXT, Progress, ResultCard, shuffle, stars } from "./shared";

const ROUNDS = 10;
const ARTICLES = ["der", "die", "das"] as const;

/** Der, die, das: adivina el artículo de 10 sustantivos del tema. */
export function DerDieDas({ theme, onRestart }: { theme: Theme; onRestart: () => void }) {
  const { g, loc } = useT();
  const [words] = useState(() => shuffle(themeNouns(theme)).slice(0, ROUNDS));
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  if (i >= words.length) {
    return (
      <ResultCard
        emoji={stars(score / words.length)}
        title={`${score} von ${words.length} richtig!`}
        detail={score === words.length ? "Perfekt! Du bist ein Artikel-Profi." : "Lerne jedes Wort mit Artikel – dann klappt es immer besser."}
        onRestart={onRestart}
        restartLabel={g("reset")}
      />
    );
  }

  const w = words[i];
  const img = imageFor(w.de);
  const answer = (a: string) => {
    if (picked) return;
    setPicked(a);
    const ok = a === w.article;
    if (ok) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
    } else setStreak(0);
    speakGerman(`${w.article} ${w.de}`);
  };
  const ok = picked === w.article;

  return (
    <div className="mx-auto max-w-lg">
      <Progress value={i + (picked ? 1 : 0)} max={words.length} />
      <div className="mt-2 flex justify-between text-sm text-cocoa">
        <span>
          {g("score")}: <b className="text-ink">{score}</b>
        </span>
        {streak >= 2 && <span>🔥 {streak} in Folge</span>}
      </div>

      <div className="mt-4 flex flex-col items-center gap-3 rounded-[2rem] border border-line bg-paper p-8 shadow-sm">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt="" width={112} height={112} draggable={false} />
        ) : (
          <span className="font-display text-6xl text-wine/30">?</span>
        )}
        <p className="font-display text-4xl text-ink">
          {picked ? <span className={`font-semibold ${ARTICLE_TEXT[w.article!]}`}>{w.article} </span> : <span className="text-muted">___ </span>}
          {w.de}
        </p>
        {picked && <p className="text-sm text-cocoa">{loc(w.tr)}</p>}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {ARTICLES.map((a) => {
          const state = !picked ? "" : a === w.article ? "ring-4 ring-gold/70" : a === picked ? "opacity-40 line-through" : "opacity-40";
          return (
            <button
              key={a}
              type="button"
              onClick={() => answer(a)}
              disabled={Boolean(picked)}
              className={`rounded-2xl py-4 font-display text-2xl font-semibold transition ${ARTICLE_BG[a]} ${state}`}
            >
              {a}
            </button>
          );
        })}
      </div>

      {picked && (
        <div className={`mt-5 flex items-center justify-between gap-3 rounded-2xl p-4 ${ok ? "bg-sage-soft text-sage" : "bg-wine-soft text-wine"}`}>
          <p className="font-medium">{ok ? `${g("correct")} ✓` : `${g("incorrect")} Es heißt: ${w.article} ${w.de}`}</p>
          <button
            type="button"
            onClick={() => {
              setPicked(null);
              setI((n) => n + 1);
            }}
            className="shrink-0 rounded-full bg-wine px-5 py-2 text-sm font-medium text-cream hover:bg-wine-light"
          >
            {g("continue")} →
          </button>
        </div>
      )}
      <p className="mt-6 text-center text-xs text-muted">
        <span className="text-blue">der</span> = blau · <span className="text-wine">die</span> = rot · <span className="text-sage">das</span> = grün
      </p>
    </div>
  );
}
