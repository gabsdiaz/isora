"use client";

import { useState } from "react";
import type { Reading } from "@/content/types";
import { useT } from "@/lib/i18n";
import { usePlaylist } from "@/lib/playlist";
import { PlayerControls } from "../PlayerControls";
import { emojiCode } from "@/content/de/images";
import { SpeakButton } from "../SpeakButton";
import { GermanText } from "../german/Gloss";
import { Translatable, TranslateToggle } from "../german/Translatable";

export function ReadingSection({ readings, unitKey }: { readings: Reading[]; unitKey: string }) {
  const { g, t } = useT();
  return (
    <div className="space-y-10">
      <p className="flex items-center gap-2 rounded-2xl bg-cream-deep/60 px-4 py-2.5 text-sm text-cocoa" title={t("tapHint")}>
        <span aria-hidden="true">👆</span> {g("tapHint")}
      </p>
      {readings.map((r) => (
        <ReadingCard key={r.title} reading={r} unitKey={unitKey} />
      ))}
    </div>
  );
}

function ReadingCard({ reading, unitKey }: { reading: Reading; unitKey: string }) {
  const { g } = useT();
  const player = usePlaylist();
  const speakers = Array.from(new Set(reading.lines.map((l) => l.speaker).filter(Boolean))) as string[];
  const isDialogue = speakers.length > 0;

  // Lee todo el texto línea por línea con la voz de cada personaje (con pausa y stop)
  const playAll = () =>
    player.play(reading.lines.map((line, i) => ({ text: line.de, voice: (line.speaker && reading.speakers?.[line.speaker]) || "m", id: String(i) })));

  return (
    <section className="rounded-3xl border border-line bg-paper p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {reading.emoji && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/emoji/${emojiCode(reading.emoji)}.svg`} alt="" width={44} height={44} className="shrink-0" draggable={false} />
          )}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">{reading.kind.de}</p>
            <h2 className="text-2xl font-semibold">{reading.title}</h2>
          </div>
        </div>
        <span className="shrink-0">
          <PlayerControls small state={player.state} label={g("listen")} onPlay={playAll} onPause={player.pause} onResume={player.resume} onStop={player.stop} />
        </span>
      </div>

      <div className={isDialogue ? "space-y-2.5" : "space-y-3"}>
        {reading.lines.map((line, i) => {
          const right = isDialogue && speakers.indexOf(line.speaker!) % 2 === 1;
          const voice = (line.speaker && reading.speakers?.[line.speaker]) || "m";
          return <Line key={i} line={line} right={right} dialogue={isDialogue} voice={voice} unitKey={unitKey} active={player.currentId === String(i)} />;
        })}
      </div>

      {reading.questions && (
        <div className="mt-6 rounded-2xl bg-cream/70 p-4">
          <p className="mb-3 text-sm font-semibold text-cocoa">{g("comprehension")}</p>
          <ul className="space-y-4">
            {reading.questions.map((q, i) => (
              <Question key={i} q={q} unitKey={unitKey} />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function Line({
  line,
  right,
  dialogue,
  voice,
  unitKey,
  active,
}: {
  line: Reading["lines"][number];
  right: boolean;
  dialogue: boolean;
  voice: "m" | "f";
  unitKey: string;
  active: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { loc } = useT();

  if (!dialogue) {
    return (
      <div className={`-mx-2 flex items-start gap-2 rounded-xl px-2 transition ${active ? "bg-gold/15" : ""}`}>
        <p className="min-w-0 flex-1 font-display text-[18px] leading-relaxed text-ink">
          <GermanText text={line.de} unitKey={unitKey} />
          {open && <span className="mt-1 block font-sans text-[15px] italic text-muted">{loc(line.tr)}</span>}
        </p>
        <SpeakButton text={line.de} voice={voice} className="h-7 w-7" />
        <TranslateToggle open={open} onClick={() => setOpen((o) => !o)} />
      </div>
    );
  }

  return (
    <div className={`flex items-end gap-1.5 rounded-2xl transition ${right ? "flex-row-reverse" : ""} ${active ? "bg-gold/15" : ""}`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${right ? "rounded-br-md bg-wine-soft" : "rounded-bl-md bg-cream-deep/70"}`}>
        {line.speaker && <p className={`text-xs font-semibold ${right ? "text-wine" : "text-cocoa"}`}>{line.speaker}</p>}
        <p className="font-display text-[17px] leading-snug text-ink">
          <GermanText text={line.de} unitKey={unitKey} />
        </p>
        {open && <p className="mt-1 text-sm italic text-muted">{loc(line.tr)}</p>}
      </div>
      <div className="mb-1 flex flex-col gap-1">
        <SpeakButton text={line.de} voice={voice} className="h-7 w-7" />
        <TranslateToggle open={open} onClick={() => setOpen((o) => !o)} />
      </div>
    </div>
  );
}

function Question({ q, unitKey }: { q: NonNullable<Reading["questions"]>[number]; unitKey: string }) {
  const { g } = useT();
  const [open, setOpen] = useState(false);
  return (
    <li>
      <Translatable de={q.q.de} tr={q.q} unitKey={unitKey} textClassName="text-[15px] font-medium text-ink" />
      {open ? (
        <Translatable de={q.a.de} tr={q.a} unitKey={unitKey} className="mt-1.5" textClassName="text-[15px] text-sage" />
      ) : (
        <button type="button" onClick={() => setOpen(true)} className="mt-1 text-xs font-medium text-wine underline-offset-2 hover:underline">
          {g("showAnswer")}
        </button>
      )}
    </li>
  );
}
