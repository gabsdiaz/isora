"use client";

import Link from "next/link";
import { german, getLevel } from "@/content/de/course";
import { isUnitAvailable } from "@/content/de/units";
import { useT } from "@/lib/i18n";
import { unitKey, useProgress } from "@/lib/progress";

export function LevelView({ levelId }: { levelId: string }) {
  const level = getLevel(levelId)!;
  const { t, loc } = useT();
  const { progress } = useProgress();

  return (
    <div>
      {/* Selector de nivel */}
      <nav className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1" aria-label={t("levels")}>
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
            {l.label}
          </Link>
        ))}
      </nav>

      <header className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
          {t("level")} · {loc(level.name)}
        </p>
        <h1 className="mt-1 text-4xl font-semibold sm:text-5xl">{level.label}</h1>
        <p className="mt-3 max-w-2xl text-ink/75">{loc(level.description)}</p>
      </header>

      <ol className="grid gap-3 sm:grid-cols-2">
        {level.units.map((u) => {
          const available = isUnitAvailable(level.id, u.number);
          const done = progress[unitKey("de", level.id, u.number)]?.completed;
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
                <span className="block truncate text-sm text-muted">{loc(u.topic)}</span>
              </span>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs ${
                  done ? "bg-sage-soft text-sage" : available ? "bg-wine-soft text-wine" : "text-muted"
                }`}
              >
                {done ? t("completed") : available ? t("start") : t("comingSoon")}
              </span>
            </>
          );
          return (
            <li key={u.number}>
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
    </div>
  );
}
