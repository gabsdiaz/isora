"use client";

import Link from "next/link";
import { useState } from "react";
import { german } from "@/content/de/course";
import { ALL_THEMES, GAMES, themeNouns, themeWords } from "@/content/de/themes";
import { useT } from "@/lib/i18n";

/** Spielzone: primero el tema, luego el juego. */
export default function GameZone() {
  const { g, t, loc } = useT();
  const [levelId, setLevelId] = useState("a1-1");
  const [themeId, setThemeId] = useState("alles");
  const themes = ALL_THEMES.filter((x) => x.level === levelId);
  const theme = themes.find((x) => x.id === themeId) ?? themes[0];

  return (
    <div>
      <p className="text-sm text-muted">{t("gameZone")}</p>
      <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">{g("gameZone")} 🎮</h1>
      <p className="mt-2 max-w-xl text-cocoa">{g("gameZoneBody")}</p>

      <h2 className="mt-8 text-xl font-semibold">1. {g("chooseLevel")}</h2>
      <nav className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1" aria-label="Niveaus">
        {german.levels.map((l) => {
          const has = ALL_THEMES.some((x) => x.level === l.id);
          return (
            <button
              key={l.id}
              type="button"
              disabled={!has}
              onClick={() => setLevelId(l.id)}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition disabled:opacity-45 ${
                l.id === levelId ? "border-wine bg-wine text-cream" : "border-line bg-paper text-cocoa hover:border-cocoa-light"
              }`}
            >
              {l.label} {!has && <span className="opacity-70">· bald</span>}
            </button>
          );
        })}
      </nav>

      <h2 className="mt-8 text-xl font-semibold">2. {g("chooseTheme")}</h2>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {themes.map((th) => {
          const active = th.id === themeId;
          return (
            <button
              key={th.id}
              type="button"
              onClick={() => setThemeId(th.id)}
              aria-pressed={active}
              className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                active ? "border-wine bg-wine-soft shadow-sm" : "border-line bg-paper hover:border-cocoa-light"
              }`}
            >
              <span className="text-2xl" aria-hidden="true">
                {th.emoji}
              </span>
              <span className="min-w-0">
                <span className={`block font-display text-lg leading-tight ${active ? "text-wine" : "text-ink"}`}>{th.de}</span>
                <span className="block truncate text-xs text-muted">
                  {loc(th.tr)} · {themeWords(th).length} Wörter
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <h2 className="mt-8 text-xl font-semibold">3. {g("chooseGame")}</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {GAMES.map((game) => (
          <Link
            key={game.id}
            href={`/aprender/spiele/${game.id}/${theme.id}`}
            className="group flex items-center gap-4 rounded-3xl border border-latte/60 bg-sand p-5 transition hover:border-cocoa-light hover:bg-sand-deep"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-paper text-3xl shadow-sm" aria-hidden="true">
              {game.emoji}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-2xl text-wine">{game.de}</span>
              <span className="block text-sm text-cocoa">
                {loc(game.tr)} · {theme.emoji} {theme.de}
                {game.id === "artikel" && ` · ${themeNouns(theme).length} Nomen`}
              </span>
            </span>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-wine text-cream transition group-hover:translate-x-1">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
