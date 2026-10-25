"use client";

import Link from "next/link";
import { useState } from "react";
import { getLevel, getUnitMeta } from "@/content/de/course";
import { getUnitContent } from "@/content/de/units";
import { useT, type StringKey } from "@/lib/i18n";
import { unitKey, useProgress } from "@/lib/progress";
import { VideoSection } from "./VideoSection";
import { TheorySection } from "./TheorySection";
import { ReadingSection } from "./ReadingSection";
import { ExercisesSection } from "./ExercisesSection";
import { GuideSection } from "./GuideSection";

const SECTIONS: { id: string; label: StringKey; icon: string }[] = [
  { id: "video", label: "secVideo", icon: "▶" },
  { id: "theory", label: "secTheory", icon: "✎" },
  { id: "reading", label: "secReading", icon: "❝" },
  { id: "exercises", label: "secExercises", icon: "✓" },
  { id: "guide", label: "secGuide", icon: "↓" },
];

export function UnitView({ levelId, number }: { levelId: string; number: number }) {
  const level = getLevel(levelId)!;
  const meta = getUnitMeta(levelId, number)!;
  const content = getUnitContent(levelId, number);
  const { t, loc } = useT();
  const { progress, markUnit } = useProgress();
  const [active, setActive] = useState(0);
  const done = progress[unitKey("de", levelId, number)]?.completed;

  const header = (
    <header className="mb-6">
      <Link href={`/aprender/de/${levelId}`} className="text-sm text-muted hover:text-wine">
        ← {level.label} · {loc(level.name)}
      </Link>
      <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-muted">
        {level.label} · {t("unit")} {number}
        {done && <span className="ml-2 rounded-full bg-sage-soft px-2 py-0.5 normal-case tracking-normal text-sage">✓ {t("completed")}</span>}
      </p>
      <h1 className="mt-1 text-4xl font-semibold sm:text-5xl">{meta.title}</h1>
      <p className="mt-2 text-lg text-cocoa">{loc(meta.topic)}</p>
    </header>
  );

  if (!content) {
    return (
      <div>
        {header}
        <div className="rounded-3xl border border-dashed border-line bg-paper/60 p-8 text-center">
          <p className="font-display text-xl text-cocoa">{t("inProduction")}</p>
          <p className="mx-auto mt-2 max-w-md text-ink/70">{t("unitNotReady")}</p>
          <Link href="/aprender/de/a1-1/1" className="mt-6 inline-block rounded-full bg-wine px-5 py-2.5 text-sm font-medium text-cream hover:bg-wine-light">
            {t("goToUnit1")}
          </Link>
        </div>
      </div>
    );
  }

  const go = (i: number) => {
    setActive(i);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      {header}

      {/* Objetivos */}
      <section className="mb-6 rounded-3xl border border-line bg-paper p-5">
        <p className="text-sm font-medium text-cocoa">{t("goals")}:</p>
        <ul className="mt-2 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
          {content.goals.map((g, i) => (
            <li key={i} className="flex gap-2 text-sm text-ink/80">
              <span className="text-gold">◆</span>
              {loc(g)}
            </li>
          ))}
        </ul>
      </section>

      {/* Pasos de la unidad */}
      <nav className="sticky top-16 z-20 -mx-4 mb-6 border-b border-line bg-cream/90 px-4 backdrop-blur" aria-label="Secciones">
        <ol className="flex gap-1 overflow-x-auto py-2">
          {SECTIONS.map((s, i) => (
            <li key={s.id} className="shrink-0">
              <button
                type="button"
                onClick={() => go(i)}
                aria-current={active === i ? "step" : undefined}
                className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-sm transition ${
                  active === i ? "bg-wine text-cream" : "text-cocoa hover:bg-cream-deep"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
                    active === i ? "bg-cream text-wine" : "bg-cream-deep text-cocoa"
                  }`}
                >
                  {i + 1}
                </span>
                {t(s.label)}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div className="min-h-[40vh]">
        {active === 0 && <VideoSection video={content.video} title={meta.title} />}
        {active === 1 && <TheorySection blocks={content.theory} />}
        {active === 2 && <ReadingSection readings={content.readings} />}
        {active === 3 && (
          <ExercisesSection
            exercises={content.exercises}
            onComplete={(score, total) => markUnit(unitKey("de", levelId, number), score, total)}
          />
        )}
        {active === 4 && <GuideSection guide={content.guide} />}
      </div>

      {/* Navegación anterior / siguiente */}
      <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
        <button
          type="button"
          onClick={() => go(active - 1)}
          disabled={active === 0}
          className="rounded-full px-4 py-2 text-sm text-cocoa transition hover:bg-cream-deep disabled:invisible"
        >
          ← {active > 0 && t(SECTIONS[active - 1].label)}
        </button>
        {active < SECTIONS.length - 1 ? (
          <button
            type="button"
            onClick={() => go(active + 1)}
            className="rounded-full bg-wine px-5 py-2.5 text-sm font-medium text-cream transition hover:bg-wine-light"
          >
            {t(SECTIONS[active + 1].label)} →
          </button>
        ) : (
          <Link href={`/aprender/de/${levelId}`} className="rounded-full bg-wine px-5 py-2.5 text-sm font-medium text-cream hover:bg-wine-light">
            {t("backToLevel")}
          </Link>
        )}
      </div>
    </div>
  );
}
