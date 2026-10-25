"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getLevel, getUnitMeta } from "@/content/de/course";
import { getUnitContent } from "@/content/de/units";
import { useT, type StringKey } from "@/lib/i18n";
import { unitKey as progressKey, useLastVisit, useProgress } from "@/lib/progress";
import { useMounted } from "../games/shared";
import { useLevels } from "@/lib/levels";
import { Translatable } from "../german/Translatable";
import { VideoSection } from "./VideoSection";
import { TheorySection } from "./TheorySection";
import { ReadingSection } from "./ReadingSection";
import { ExercisesSection } from "./ExercisesSection";
import { GuideSection } from "./GuideSection";
import { UnitCards } from "../flashcards/UnitCards";

const SECTIONS: { id: string; label: StringKey }[] = [
  { id: "video", label: "secVideo" },
  { id: "theory", label: "secTheory" },
  { id: "cards", label: "secCards" },
  { id: "reading", label: "secReading" },
  { id: "exercises", label: "secExercises" },
  { id: "guide", label: "secGuide" },
];

export function UnitView({ levelId, number }: { levelId: string; number: number }) {
  const level = getLevel(levelId)!;
  const meta = getUnitMeta(levelId, number)!;
  const content = getUnitContent(levelId, number);
  const { g } = useT();
  const { progress, markUnit, markSection } = useProgress();
  const { last, setLast } = useLastVisit();
  const { isUnlocked } = useLevels();
  const mounted = useMounted();
  const pk = progressKey("de", levelId, number);
  // Pestaña: la elegida ahora, o la última que el estudiante abrió en esta unidad
  const [chosen, setActive] = useState<number | null>(null);
  const stored = last && last.level === levelId && last.number === number ? last.section : 0;
  const active = chosen ?? Math.min(stored, SECTIONS.length - 1);
  const seen = progress[pk]?.sections ?? [];
  const done = progress[pk]?.completed;

  // Guarda dónde va el estudiante (solo en el navegador, tras leer lo guardado)
  useEffect(() => {
    if (!mounted || !content) return;
    setLast(levelId, number, active);
    markSection(pk, SECTIONS[active].id);
  }, [mounted, content, levelId, number, active, pk, setLast, markSection]);
  const key = `${levelId}/${number}`;
  const mediaKey = `de/${levelId}/${String(number).padStart(2, "0")}`;

  const header = (
    <header className="mb-6">
      <Link href={`/aprender/de/${levelId}`} className="text-sm text-muted hover:text-wine">
        ← {level.label} · {level.name.de}
      </Link>
      <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-muted">
        {level.label} · {g("unit")} {number}
        {done && <span className="ml-2 rounded-full bg-sage-soft px-2 py-0.5 normal-case tracking-normal text-sage">✓ {g("completed")}</span>}
      </p>
      <Translatable as="h1" de={meta.title} tr={meta.topic} className="mt-1" textClassName="text-4xl font-semibold sm:text-5xl" />
    </header>
  );

  if (mounted && !isUnlocked(levelId)) {
    return (
      <div>
        {header}
        <div className="rounded-[2rem] border-2 border-dashed border-wine/40 bg-sand p-8 text-center">
          <p className="text-5xl">🔒</p>
          <p className="mt-2 font-display text-2xl text-wine">{level.label} ist noch gesperrt</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-cocoa">Mach zuerst den Mini-Test, um dieses Niveau freizuschalten.</p>
          <Link href={`/aprender/test/zugang-${levelId}`} className="mt-5 inline-block rounded-full bg-wine px-5 py-2.5 text-sm font-medium text-cream hover:bg-wine-light">
            🔓 Mini-Test starten
          </Link>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div>
        {header}
        <div className="rounded-3xl border border-dashed border-line bg-paper/60 p-8 text-center">
          <p className="font-display text-xl text-cocoa">{g("inProduction")}</p>
          <p className="mx-auto mt-2 max-w-md text-ink/70">{g("unitNotReady")}</p>
          <Link href="/aprender/de/a1-1/1" className="mt-6 inline-block rounded-full bg-wine px-5 py-2.5 text-sm font-medium text-cream hover:bg-wine-light">
            {g("goToUnit1")}
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

      <section className="mb-6 rounded-3xl border border-line bg-paper p-5">
        <p className="mb-2 text-sm font-semibold text-cocoa">{g("goals")}:</p>
        <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {content.goals.map((goal, i) => (
            <li key={i} className="flex gap-2 text-sm text-ink/85">
              <span className="mt-1 text-gold">◆</span>
              <Translatable de={goal.de} tr={goal} unitKey={key} className="flex-1" />
            </li>
          ))}
        </ul>
      </section>

      <nav className="sticky top-16 z-20 -mx-4 mb-6 border-b border-line bg-cream/95 px-4 backdrop-blur" aria-label="Abschnitte">
        <ol className="flex gap-1 overflow-x-auto py-2">
          {SECTIONS.map((s, i) => (
            <li key={s.id} className="shrink-0">
              <button
                type="button"
                onClick={() => go(i)}
                aria-current={active === i ? "step" : undefined}
                className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-sm transition ${active === i ? "bg-wine text-cream shadow-sm shadow-wine/20" : "text-cocoa hover:bg-cream-deep"}`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
                    active === i ? "bg-cream/25 text-cream" : seen.includes(s.id) ? "bg-sage-soft text-sage" : "bg-cream-deep text-cocoa"
                  }`}
                >
                  {active !== i && seen.includes(s.id) ? "✓" : i + 1}
                </span>
                {g(s.label)}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div className="min-h-[40vh]">
        {active === 0 && <VideoSection script={content.video} title={meta.title} mediaKey={mediaKey} unitKey={key} />}
        {active === 1 && <TheorySection blocks={content.theory} vocab={content.vocab} unitKey={key} />}
        {active === 2 && <UnitCards vocab={content.vocab} source={key} />}
        {active === 3 && <ReadingSection readings={content.readings} unitKey={key} />}
        {active === 4 && (
          <ExercisesSection
            exercises={content.exercises}
            unitKey={key}
            onComplete={(score, total) => markUnit(pk, score, total)}
          />
        )}
        {active === 5 && <GuideSection mediaKey={mediaKey} title={meta.title} />}
      </div>

      <Link
        href="/aprender/unterricht"
        className="mt-10 flex items-center justify-between gap-3 rounded-2xl border border-dashed border-latte bg-paper/70 px-4 py-3 text-sm text-cocoa transition hover:border-cocoa-light hover:text-wine"
      >
        <span>
          <span aria-hidden="true">🧑‍🏫</span> {g("lessonCta")}
        </span>
        <span className="shrink-0 font-medium text-wine">{g("bookNow")} →</span>
      </Link>

      <div className="mt-6 flex items-center justify-between border-t border-line pt-6">
        <button
          type="button"
          onClick={() => go(active - 1)}
          disabled={active === 0}
          className="rounded-full px-4 py-2 text-sm text-cocoa transition hover:bg-cream-deep disabled:invisible"
        >
          ← {active > 0 && g(SECTIONS[active - 1].label)}
        </button>
        {active < SECTIONS.length - 1 ? (
          <button type="button" onClick={() => go(active + 1)} className="rounded-full bg-wine px-5 py-2.5 text-sm font-medium text-cream transition hover:bg-wine-light">
            {g(SECTIONS[active + 1].label)} →
          </button>
        ) : (
          <NextUnitLink levelId={levelId} number={number} />
        )}
      </div>
    </div>
  );
}

function NextUnitLink({ levelId, number }: { levelId: string; number: number }) {
  const { g } = useT();
  const next = getUnitContent(levelId, number + 1);
  if (!next && levelId === "a1-1") {
    return (
      <Link href="/aprender/test/abschluss-a1-1" className="rounded-full bg-wine px-5 py-2.5 text-sm font-medium text-cream hover:bg-wine-light">
        🏆 Abschlusstest A1.1 →
      </Link>
    );
  }
  if (next) {
    return (
      <Link href={`/aprender/de/${levelId}/${number + 1}`} className="rounded-full bg-wine px-5 py-2.5 text-sm font-medium text-cream hover:bg-wine-light">
        {g("unit")} {number + 1} →
      </Link>
    );
  }
  return (
    <Link href={`/aprender/de/${levelId}`} className="rounded-full bg-wine px-5 py-2.5 text-sm font-medium text-cream hover:bg-wine-light">
      {g("backToLevel")}
    </Link>
  );
}
