"use client";

import Link from "next/link";
import { german } from "@/content/de/course";
import { isUnitAvailable } from "@/content/de/units";
import { useT } from "@/lib/i18n";
import { useSession } from "@/lib/session";
import { unitKey, unitPercent, useLastVisit, useProgress } from "@/lib/progress";
import { getUnitMeta } from "@/content/de/course";
import type { StringKey } from "@/lib/i18n";
import { dueCards, useDeck } from "@/lib/flashcards";

const TILE = "mt-4 flex items-center justify-between gap-4 rounded-3xl border border-latte/60 bg-sand p-5 shadow-sm shadow-espresso/5 transition hover:border-cocoa-light hover:bg-sand-deep";
const SECTION_LABELS: StringKey[] = ["secVideo", "secTheory", "secCards", "secReading", "secExercises", "secGuide"];

export default function Dashboard() {
  const { g } = useT();
  const { user } = useSession();
  const { progress } = useProgress();
  const { last } = useLastVisit();

  // Siguiente unidad disponible y no completada
  let nextUnit: { level: string; label: string; number: number; title: string; section?: number } | null = null;
  for (const lvl of german.levels) {
    for (const u of lvl.units) {
      if (isUnitAvailable(lvl.id, u.number) && !progress[unitKey("de", lvl.id, u.number)]?.completed) {
        nextUnit = { level: lvl.id, label: lvl.label, number: u.number, title: u.title };
        break;
      }
    }
    if (nextUnit) break;
  }
  // …pero si el estudiante ya empezó algo, seguimos justo donde quedó
  if (last && isUnitAvailable(last.level, last.number)) {
    const lvl = german.levels.find((l) => l.id === last.level);
    const meta = getUnitMeta(last.level, last.number);
    if (lvl && meta) nextUnit = { level: lvl.id, label: lvl.label, number: last.number, title: meta.title, section: last.section };
  }
  const nextPct = nextUnit ? unitPercent(progress[unitKey("de", nextUnit.level, nextUnit.number)]) : 0;

  return (
    <div>
      <p className="text-sm text-cocoa">
        {g("hello")}, {user?.name.split(" ")[0]}
      </p>
      <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">{g("myCourses")}</h1>

      {/* Cursos */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-wine bg-paper p-4 shadow-md shadow-wine/10">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">A1 → B1</p>
          <p className="font-display text-xl text-wine">{german.name.de}</p>
          <p className="mt-1 text-sm text-ink/70">A1.1 – B1.2 · 120 {g("units")}</p>
        </div>
        {[g("english"), g("examPrep")].map((name) => (
          <div key={name} className="rounded-2xl border border-dashed border-line bg-paper/50 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">{g("comingSoon")}</p>
            <p className="font-display text-xl text-cocoa/70">{name}</p>
            <p className="mt-1 text-sm text-muted">{name === g("examPrep") ? "TestDaF · Goethe · IELTS · TOEFL" : "A1 – B2"}</p>
          </div>
        ))}
      </div>

      {/* Continuar */}
      {nextUnit && (
        <Link
          href={`/aprender/de/${nextUnit.level}/${nextUnit.number}`}
          className="group mt-8 flex items-center justify-between gap-4 rounded-3xl border border-latte/60 bg-sand p-6 text-ink shadow-md shadow-espresso/5 transition hover:border-cocoa-light hover:bg-sand-deep"
        >
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-wine">
              {g("continueLearning")} · {nextUnit.label} · {g("unit")} {nextUnit.number}
            </p>
            <p className="mt-1 font-display text-2xl">
              {nextUnit.title}
              {nextUnit.section !== undefined && <span className="ml-2 align-middle text-base text-cocoa">· {g(SECTION_LABELS[nextUnit.section] ?? "secVideo")}</span>}
            </p>
            <div className="mt-3 flex max-w-sm items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper">
                <div className="h-full rounded-full bg-wine" style={{ width: `${nextPct}%` }} />
              </div>
              <span className="text-xs tabular-nums text-cocoa">{nextPct}%</span>
            </div>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-wine text-cream transition group-hover:translate-x-1">
            →
          </span>
        </Link>
      )}

      <CardsTile />
      <Link
        href="/aprender/geschichten"
        className={TILE}
      >
        <div className="flex items-center gap-4">
          <span className="text-3xl" aria-hidden="true">📚</span>
          <div>
            <p className="font-display text-xl text-wine">{g("stories")}</p>
            <p className="text-sm text-cocoa">Der Kaffee-Dieb · Oma Hilde und das Handy · Pizza um Mitternacht …</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-wine px-4 py-2 text-sm font-medium text-cream">Lesen →</span>
      </Link>
      <Link
        href="/aprender/spiele"
        className={TILE}
      >
        <div className="flex items-center gap-4">
          <span className="text-3xl" aria-hidden="true">🎮</span>
          <div>
            <p className="font-display text-xl text-wine">{g("gameZone")}</p>
            <p className="text-sm text-cocoa">Der, die, das · Memory · Glücksrad · Galgenmännchen</p>
          </div>
        </div>
        <span className="rounded-full bg-wine px-4 py-2 text-sm font-medium text-cream">{g("games")} →</span>
      </Link>
      <Link
        href="/aprender/unterricht"
        className={TILE}
      >
        <div className="flex items-center gap-4">
          <span className="text-3xl" aria-hidden="true">🧑‍🏫</span>
          <div>
            <p className="font-display text-xl text-wine">{g("lessonTitle")}</p>
            <p className="text-sm text-cocoa">{g("lessonQuestion")}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-wine px-4 py-2 text-sm font-medium text-cream">{g("bookNow")} →</span>
      </Link>

      {/* Niveles */}
      <h2 className="mt-10 text-2xl font-semibold">{g("levels")}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {german.levels.map((lvl) => {
          const available = lvl.units.filter((u) => isUnitAvailable(lvl.id, u.number)).length;
          const done = lvl.units.filter((u) => progress[unitKey("de", lvl.id, u.number)]?.completed).length;
          return (
            <Link
              key={lvl.id}
              href={`/aprender/de/${lvl.id}`}
              className="group flex flex-col rounded-3xl border border-line bg-paper p-5 transition hover:-translate-y-0.5 hover:border-cocoa-light hover:shadow-lg hover:shadow-cocoa/10"
            >
              <div className="flex items-start justify-between">
                <span className="font-display text-3xl font-semibold text-wine">{lvl.label}</span>
                <span className="rounded-full bg-cream-deep px-2.5 py-1 text-xs text-cocoa">20 {g("units")}</span>
              </div>
              <p className="mt-1 font-medium text-cocoa">{lvl.name.de}</p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">{lvl.description.de}</p>
              <div className="mt-4">
                <div className="h-1.5 overflow-hidden rounded-full bg-cream-deep">
                  <div className="h-full rounded-full bg-wine" style={{ width: `${(done / 20) * 100}%` }} />
                </div>
                <p className="mt-2 text-xs text-muted">
                  {done}/20 · {available > 0 ? `${available} ${g("available")}` : g("comingSoon")}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function CardsTile() {
  const { deck } = useDeck();
  const { g } = useT();
  const total = Object.keys(deck).length;
  const due = dueCards(deck).length;
  if (!total) return null;
  return (
    <Link
      href="/aprender/karten"
      className={TILE}
    >
      <div className="flex items-center gap-4">
        <span className="text-3xl" aria-hidden="true">🃏</span>
        <div>
          <p className="font-display text-xl text-wine">{g("myCards")}</p>
          <p className="text-sm text-cocoa">
            {total} Karten · {due} heute fällig
          </p>
        </div>
      </div>
      <span className="rounded-full bg-wine px-4 py-2 text-sm font-medium text-cream">Wiederholen →</span>
    </Link>
  );
}
