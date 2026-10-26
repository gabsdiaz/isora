"use client";

import Link from "next/link";
import { german, getLevel } from "@/content/de/course";
import { isUnitAvailable } from "@/content/de/units";
import { FINAL_EXAM_OF, levelLabel, UNLOCKS_AFTER } from "@/content/de/exams";
import { useT } from "@/lib/i18n";
import { unitKey, unitPercent, useProgress } from "@/lib/progress";
import { useLevels } from "@/lib/levels";
import { useMounted } from "./games/shared";

export function LevelView({ levelId }: { levelId: string }) {
  const level = getLevel(levelId)!;
  const { g, loc } = useT();
  const { progress } = useProgress();
  const { levels, isUnlocked } = useLevels();
  const mounted = useMounted();
  const locked = mounted && !isUnlocked(level.id);
  const finalExam = FINAL_EXAM_OF[level.id];
  const finalResult = finalExam ? levels.exams?.[finalExam.id] : undefined;
  const opens = finalExam ? UNLOCKS_AFTER[finalExam.id] : undefined;

  return (
    <div>
      {/* Selector de nivel */}
      <nav className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1" aria-label={g("levels")}>
        <Link href="/aprender" className="shrink-0 rounded-full px-3 py-1.5 text-sm text-muted hover:text-wine">
          ←
        </Link>
        {german.levels.map((l) => (
          <Link
            key={l.id}
            href={`/aprender/de/${l.id}`}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              l.id === level.id ? "border-wine bg-wine text-cream" : "border-line bg-paper text-cocoa hover:border-cocoa-light"
            }`}
          >
            {mounted && !isUnlocked(l.id) && <span aria-label="gesperrt">🔒 </span>}
            {l.label}
          </Link>
        ))}
      </nav>

      <header className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
          {g("level")} · {level.name.de}
        </p>
        <h1 className="mt-1 text-4xl font-semibold sm:text-5xl">{level.label}</h1>
        <p className="mt-3 max-w-2xl text-ink/75">{level.description.de}</p>
      </header>

      {locked && (
        <div className="mb-8 flex flex-col items-start gap-4 rounded-[2rem] border-2 border-dashed border-wine/40 bg-sand p-6 sm:flex-row sm:items-center">
          <span className="text-5xl" aria-hidden="true">🔒</span>
          <div className="flex-1">
            <p className="font-display text-2xl text-wine">Dieses Niveau ist noch gesperrt</p>
            <p className="mt-1 text-sm text-cocoa">Zeig in einem Mini-Test (8 Fragen, ca. 4 Min.), dass du bereit bist – oder mach den Einstufungstest.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/aprender/test/zugang-${level.id}`} className="rounded-full bg-wine px-5 py-2.5 text-sm font-medium text-cream hover:bg-wine-light">
              🔓 Mini-Test starten
            </Link>
            <Link href="/aprender/test/einstufung" className="rounded-full border border-cocoa/30 bg-paper px-5 py-2.5 text-sm font-medium text-cocoa">
              🎯 Einstufungstest
            </Link>
          </div>
        </div>
      )}

      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {level.units.map((u) => {
          const available = isUnitAvailable(level.id, u.number) && !locked;
          const up = progress[unitKey("de", level.id, u.number)];
          const done = up?.completed;
          const pct = unitPercent(up);
          const body = (
            <>
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-display text-lg font-semibold ${
                  done ? "bg-sage text-cream" : available ? "bg-wine text-cream" : "bg-cream-deep text-cocoa/60"
                }`}
              >
                {done ? "✓" : u.number}
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block truncate font-display text-lg ${available ? "text-ink" : "text-ink/50"}`}>{u.title}</span>
                {available && pct > 0 && (
                  <span className="mt-1 flex items-center gap-2">
                    <span className="h-1 flex-1 overflow-hidden rounded-full bg-cream-deep">
                      <span className="block h-full rounded-full bg-yellow" style={{ width: `${pct}%` }} />
                    </span>
                    <span className="text-[11px] tabular-nums text-muted">{pct}%</span>
                  </span>
                )}
              </span>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs ${
                  done ? "bg-sage-soft text-sage" : available ? "bg-wine-soft text-wine" : "text-muted"
                }`}
              >
                {done ? g("completed") : available ? (pct > 0 ? g("continue") : g("start")) : g("comingSoon")}
              </span>
            </>
          );
          return (
            <li key={u.number} title={loc(u.topic)}>
              {available ? (
                <Link
                  href={`/aprender/de/${level.id}/${u.number}`}
                  className="flex items-center gap-4 rounded-2xl border border-line bg-paper p-3 pr-4 transition hover:border-cocoa-light hover:shadow-md hover:shadow-cocoa/10"
                >
                  {body}
                </Link>
              ) : (
                <div className="flex items-center gap-4 rounded-2xl border border-line/70 bg-paper/50 p-3 pr-4" aria-disabled="true">
                  {body}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {finalExam && (
        <Link
          href={`/aprender/test/${finalExam.id}`}
          className="mt-6 flex items-center justify-between gap-4 rounded-[2rem] border-2 border-wine/60 bg-sand p-6 transition hover:bg-sand-deep"
        >
          <span className="flex items-center gap-4">
            <span className="text-5xl" aria-hidden="true">🏆</span>
            <span>
              <span className="block font-display text-2xl text-wine">{finalExam.title}</span>
              <span className="block text-sm text-cocoa">
                Grammatik · Lesen · Hören · Schreiben – alle Themen von {level.label}.{" "}
                {level.id === "a1-2" ? "Wie im Goethe-Zertifikat A1!" : opens ? `Bestanden = ${levelLabel(opens)} frei!` : ""}
              </span>
              {finalResult && (
                <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs ${finalResult.passed ? "bg-sage-soft text-sage" : "bg-wine-soft text-wine"}`}>
                  {finalResult.passed ? "✓ Bestanden" : "Noch nicht bestanden"} · {finalResult.score} %
                </span>
              )}
            </span>
          </span>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-wine text-cream">→</span>
        </Link>
      )}
    </div>
  );
}
