"use client";

import { useState } from "react";
import type { Reading } from "@/content/types";
import { useT } from "@/lib/i18n";
import { speakGerman } from "@/lib/speech";
import { SpeakButton } from "../SpeakButton";

export function ReadingSection({ readings }: { readings: Reading[] }) {
  return (
    <div className="space-y-10">
      {readings.map((r) => (
        <ReadingCard key={r.title} reading={r} />
      ))}
    </div>
  );
}

function ReadingCard({ reading }: { reading: Reading }) {
  const { t, loc } = useT();
  const speakers = Array.from(new Set(reading.lines.map((l) => l.speaker).filter(Boolean)));
  const fullText = reading.lines.map((l) => l.de).join(" ");

  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_17rem]">
      <div className="rounded-3xl border border-line bg-paper p-5 sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">{loc(reading.kind)}</p>
            <h2 className="text-2xl font-semibold">{reading.title}</h2>
          </div>
          <button
            type="button"
            onClick={() => speakGerman(fullText)}
            className="shrink-0 rounded-full border border-line px-3 py-1.5 text-sm text-cocoa hover:border-wine-light hover:text-wine"
          >
            ▶ {t("listen")}
          </button>
        </div>
        <div className="space-y-2.5">
          {reading.lines.map((line, i) => {
            const right = speakers.indexOf(line.speaker) % 2 === 1;
            return (
              <div key={i} className={`flex items-end gap-2 ${right ? "flex-row-reverse" : ""}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    right ? "rounded-br-md bg-wine-soft" : "rounded-bl-md bg-cream-deep/70"
                  }`}
                >
                  {line.speaker && <p className={`text-xs font-semibold ${right ? "text-wine" : "text-cocoa"}`}>{line.speaker}</p>}
                  <p className="font-display text-[17px] leading-snug text-ink">{line.de}</p>
                </div>
                <SpeakButton text={line.de} className="mb-1 h-7 w-7" />
              </div>
            );
          })}
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-3xl border border-line bg-paper p-5">
          <p className="mb-3 text-sm font-medium text-cocoa">{t("glossary")}</p>
          <dl className="space-y-2.5">
            {reading.glossary.map((g) => (
              <div key={g.de}>
                <dt className="font-display text-wine">{g.de}</dt>
                <dd className="text-sm text-ink/70">{loc(g.meaning)}</dd>
              </div>
            ))}
          </dl>
        </div>
        {reading.questions && (
          <div className="rounded-3xl border border-line bg-paper p-5">
            <p className="mb-3 text-sm font-medium text-cocoa">{t("comprehension")}</p>
            <ul className="space-y-3">
              {reading.questions.map((q, i) => (
                <Question key={i} q={loc(q.q)} a={loc(q.a)} />
              ))}
            </ul>
          </div>
        )}
      </aside>
    </section>
  );
}

function Question({ q, a }: { q: string; a: string }) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  return (
    <li>
      <p className="text-sm text-ink">{q}</p>
      {open ? (
        <p className="mt-1 text-sm font-medium text-sage">{a}</p>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className="mt-1 text-xs text-wine underline-offset-2 hover:underline">
          {t("showAnswer")}
        </button>
      )}
    </li>
  );
}
