"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { STORIES, type Story, type StoryLine } from "@/content/de/stories";
import { getTheme } from "@/content/de/themes";
import { emojiCode } from "@/content/de/images";
import type { Voice } from "@/content/types";
import { useT } from "@/lib/i18n";
import { useProgress } from "@/lib/progress";
import { speakGerman, stopSpeech } from "@/lib/speech";
import { SpeakButton } from "../SpeakButton";
import { GermanText } from "../german/Gloss";
import { TranslateToggle } from "../german/Translatable";

const Emoji = ({ e, size }: { e: string; size: number }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={`/emoji/${emojiCode(e)}.svg`} alt="" width={size} height={size} draggable={false} />
);

export function StoryReader({ story }: { story: Story }) {
  const { g, t, loc } = useT();
  const theme = getTheme(story.theme);
  const [playing, setPlaying] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const cancel = useRef(false);
  const voiceOf = (l: StoryLine): Voice => (l.who ? (story.voices[l.who] ?? "m") : "f");

  // Al salir de la historia (Next.js oculta la página) se detiene el audio
  useLayoutEffect(
    () => () => {
      cancel.current = true;
      stopSpeech();
    },
    [],
  );

  const playAll = async () => {
    if (playing) {
      cancel.current = true;
      stopSpeech();
      setPlaying(null);
      return;
    }
    cancel.current = false;
    for (const [si, scene] of story.scenes.entries()) {
      for (const [li, line] of scene.lines.entries()) {
        if (cancel.current) return;
        setPlaying(`${si}-${li}`);
        document.getElementById(`line-${si}-${li}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        await speakGerman(line.de, voiceOf(line));
        await new Promise((r) => setTimeout(r, 300));
      }
    }
    setPlaying(null);
  };

  const idx = STORIES.findIndex((s) => s.id === story.id);
  const next = STORIES[(idx + 1) % STORIES.length];

  return (
    <article className="mx-auto max-w-3xl">
      <Link href="/aprender/geschichten" className="text-sm text-muted hover:text-wine">
        ← {g("stories")}
      </Link>

      <header className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-center">
        <span className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl shadow-sm" style={{ background: story.color }}>
          <Emoji e={story.emoji} size={68} />
        </span>
        <div>
          <p className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted">
            <span className="rounded-full bg-cream-deep px-2 py-0.5 text-cocoa">{story.level}</span>
            {theme && (
              <span>
                {theme.emoji} {theme.de}
              </span>
            )}
            <span>· {story.minutes} Min.</span>
          </p>
          <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">{story.title}</h1>
          <p className="mt-1 text-sm italic text-muted">{loc(story.titleTr)}</p>
        </div>
      </header>

      <div className="sticky top-16 z-10 -mx-4 mt-6 flex flex-wrap items-center gap-2 border-b border-line bg-cream/95 px-4 py-2.5 backdrop-blur">
        <button type="button" onClick={playAll} className="rounded-full bg-wine px-4 py-2 text-sm font-medium text-cream transition hover:bg-wine-light">
          {playing ? "■ Stopp" : `▶ ${g("listenStory")}`}
        </button>
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          aria-pressed={showAll}
          className={`rounded-full border px-4 py-2 text-sm transition ${showAll ? "border-gold bg-gold/15 text-ink" : "border-line bg-paper text-cocoa hover:border-cocoa-light"}`}
        >
          🌐 {showAll ? g("hideTranslation") : g("showTranslation")}
        </button>
        <span className="ml-auto hidden text-xs text-muted sm:inline" title={t("tapHint")}>
          👆 {g("tapHint")}
        </span>
      </div>

      <div className="mt-6 space-y-6">
        {story.scenes.map((scene, si) => (
          <section key={si} className="flex gap-4 rounded-3xl border border-line bg-paper p-5 sm:p-6">
            <span className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl sm:flex" style={{ background: story.color }} aria-hidden="true">
              <Emoji e={scene.emoji} size={40} />
            </span>
            <div className="min-w-0 flex-1 space-y-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl sm:hidden" style={{ background: story.color }} aria-hidden="true">
                <Emoji e={scene.emoji} size={30} />
              </span>
              {scene.lines.map((line, li) => (
                <Line key={li} id={`line-${si}-${li}`} line={line} voice={voiceOf(line)} active={playing === `${si}-${li}`} showAll={showAll} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <Quiz story={story} />

      <Link
        href={`/aprender/geschichten/${next.id}`}
        className="mt-8 flex items-center justify-between gap-4 rounded-3xl border border-latte/60 bg-sand p-5 transition hover:border-cocoa-light hover:bg-sand-deep"
      >
        <span className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: next.color }}>
            <Emoji e={next.emoji} size={34} />
          </span>
          <span>
            <span className="block text-xs uppercase tracking-wide text-muted">{g("nextStory")}</span>
            <span className="block font-display text-xl text-wine">{next.title}</span>
          </span>
        </span>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-wine text-cream">→</span>
      </Link>
    </article>
  );
}

function Line({ id, line, voice, active, showAll }: { id: string; line: StoryLine; voice: Voice; active: boolean; showAll: boolean }) {
  const { loc } = useT();
  const [open, setOpen] = useState(false);
  const shown = open || showAll;
  const highlight = active ? "bg-gold/15 ring-1 ring-gold/40" : "";

  if (line.who) {
    return (
      <div id={id} className={`flex items-start gap-2 rounded-2xl transition ${highlight}`}>
        <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md bg-cream-deep/70 px-4 py-2.5">
          <p className="text-xs font-semibold text-wine">{line.who}</p>
          <p className="font-display text-[18px] leading-snug text-ink">
            „<GermanText text={line.de} />“
          </p>
          {shown && <p className="mt-1 text-sm italic text-muted">{loc(line.tr)}</p>}
        </div>
        <div className="flex flex-col gap-1 pt-1">
          <SpeakButton text={line.de} voice={voice} className="h-7 w-7" />
          <TranslateToggle open={shown} onClick={() => setOpen((o) => !o)} />
        </div>
      </div>
    );
  }
  return (
    <div id={id} className={`-mx-2 flex items-start gap-2 rounded-xl px-2 py-1 transition ${highlight}`}>
      <p className="min-w-0 flex-1 font-display text-[19px] leading-relaxed text-ink">
        <GermanText text={line.de} />
        {shown && <span className="mt-1 block font-sans text-[15px] italic text-muted">{loc(line.tr)}</span>}
      </p>
      <SpeakButton text={line.de} voice={voice} className="mt-1 h-7 w-7" />
      <TranslateToggle open={shown} onClick={() => setOpen((o) => !o)} className="mt-1" />
    </div>
  );
}

function Quiz({ story }: { story: Story }) {
  const { g, loc } = useT();
  const { markUnit } = useProgress();
  const [answers, setAnswers] = useState<(number | null)[]>(() => story.quiz.map(() => null));
  const done = answers.every((a) => a !== null);
  const score = answers.filter((a, i) => a === story.quiz[i].answer).length;

  const pick = (qi: number, oi: number) => {
    if (answers[qi] !== null) return;
    const next = answers.map((a, i) => (i === qi ? oi : a));
    setAnswers(next);
    if (next.every((a) => a !== null)) {
      const s = next.filter((a, i) => a === story.quiz[i].answer).length;
      markUnit(`story/${story.id}`, s, story.quiz.length);
    }
  };

  return (
    <section className="mt-8 rounded-3xl border border-latte/60 bg-sand p-5 sm:p-6">
      <h2 className="text-2xl font-semibold">{g("comprehension")}</h2>
      <ol className="mt-4 space-y-5">
        {story.quiz.map((q, qi) => (
          <li key={qi}>
            <p className="font-medium text-ink">
              {qi + 1}. {q.q.de} <span className="text-sm font-normal italic text-muted">· {loc(q.q.tr)}</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {q.options.map((o, oi) => {
                const a = answers[qi];
                const cls =
                  a === null
                    ? "border-line bg-paper hover:border-cocoa-light"
                    : oi === q.answer
                      ? "border-sage bg-sage-soft text-sage"
                      : oi === a
                        ? "border-wine/40 bg-wine-soft text-wine line-through"
                        : "border-line bg-paper opacity-50";
                return (
                  <button key={oi} type="button" disabled={a !== null} onClick={() => pick(qi, oi)} className={`rounded-xl border px-3.5 py-2 text-sm transition ${cls}`}>
                    {o}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ol>
      {done && (
        <p className="mt-5 rounded-2xl bg-paper px-4 py-3 font-display text-xl text-wine">
          {score === story.quiz.length ? "⭐⭐⭐ " : score >= story.quiz.length / 2 ? "⭐⭐ " : "⭐ "}
          {score}/{story.quiz.length} {g("correct").replace("!", "")} – {score === story.quiz.length ? "Perfekt!" : "Gut gemacht!"}
        </p>
      )}
    </section>
  );
}
