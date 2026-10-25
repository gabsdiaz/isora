"use client";

import Link from "next/link";
import { STORIES } from "@/content/de/stories";
import { getTheme } from "@/content/de/themes";
import { emojiCode } from "@/content/de/images";
import { useT } from "@/lib/i18n";
import { useProgress } from "@/lib/progress";

/** Geschichten: biblioteca de historias por nivel. */
export default function Stories() {
  const { g, t, loc } = useT();
  const { progress } = useProgress();
  const read = STORIES.filter((s) => progress[`story/${s.id}`]?.completed).length;

  return (
    <div>
      <p className="text-sm text-muted">{t("stories")}</p>
      <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">{g("stories")} 📚</h1>
      <p className="mt-2 max-w-xl text-cocoa">{g("storiesBody")}</p>
      <p className="mt-1 max-w-xl text-sm italic text-muted">{t("storiesBody")}</p>

      <div className="mt-8 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold">A1.1 · Anfänger</h2>
        <p className="text-sm text-muted">
          {read}/{STORIES.length} gelesen
        </p>
      </div>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {STORIES.map((s) => {
          const done = progress[`story/${s.id}`];
          const theme = getTheme(s.theme);
          return (
            <Link
              key={s.id}
              href={`/aprender/geschichten/${s.id}`}
              className="group flex gap-4 rounded-3xl border border-line bg-paper p-4 transition hover:border-cocoa-light hover:shadow-md hover:shadow-espresso/10"
            >
              <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl" style={{ background: s.color }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/emoji/${emojiCode(s.emoji)}.svg`} alt="" width={56} height={56} className="transition group-hover:scale-110" draggable={false} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted">
                  <span className="rounded-full bg-cream-deep px-2 py-0.5 text-cocoa">{s.level}</span>
                  {theme && (
                    <span>
                      {theme.emoji} {theme.de}
                    </span>
                  )}
                  <span>· {s.minutes} Min.</span>
                  {done && <span className="rounded-full bg-sage-soft px-2 py-0.5 text-sage">✓ gelesen</span>}
                </span>
                <span className="mt-1 block font-display text-xl leading-tight text-wine">{s.title}</span>
                <span className="mt-1 block text-sm leading-snug text-cocoa">{s.teaser.de}</span>
                <span className="mt-1 block text-xs italic text-muted">{loc(s.titleTr)}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
