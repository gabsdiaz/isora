"use client";

import Link from "next/link";
import { useState } from "react";
import { ALL_THEMES, GAMES, getTheme, themeWords, type GameId } from "@/content/de/themes";
import { useT } from "@/lib/i18n";
import { DerDieDas } from "./DerDieDas";
import { Hangman } from "./Hangman";
import { Memory } from "./Memory";
import { Wheel } from "./Wheel";
import { useMounted } from "./shared";

/** Página de un juego: cabecera, selector de tema y el juego (se baraja solo en el navegador). */
export function GameView({ gameId, themeId }: { gameId: GameId; themeId: string }) {
  const { g, loc } = useT();
  const mounted = useMounted();
  const [round, setRound] = useState(0);
  const game = GAMES.find((x) => x.id === gameId)!;
  const theme = getTheme(themeId)!;
  const restart = () => setRound((r) => r + 1);

  return (
    <div>
      <Link href="/aprender/spiele" className="text-sm text-muted hover:text-wine">
        ← {g("gameZone")}
      </Link>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            <span aria-hidden="true">{game.emoji}</span> {game.de}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {loc(game.tr)} · <span className="rounded-full bg-cream-deep px-2 py-0.5 text-xs text-cocoa">{theme.level.toUpperCase().replace("-", ".")}</span> · Thema:{" "}
            <b className="text-cocoa">{theme.de}</b>
          </p>
        </div>
      </div>

      <nav className="-mx-4 mt-4 overflow-x-auto px-4 pb-1" aria-label="Themen">
        <ul className="flex gap-2 sm:flex-wrap">
          {ALL_THEMES.filter((t) => t.level === theme.level).map((t) => (
            <li key={t.id} className="shrink-0">
              <Link
                href={`/aprender/spiele/${gameId}/${t.id}`}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${
                  t.id === theme.id ? "border-wine bg-wine text-cream" : "border-line bg-paper text-cocoa hover:border-cocoa-light"
                }`}
              >
                <span aria-hidden="true">{t.emoji}</span> {t.de}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-6">
        {!mounted ? (
          <div className="h-80 animate-pulse rounded-[2rem] bg-cream-deep/60" />
        ) : gameId === "artikel" ? (
          <DerDieDas key={round} theme={theme} onRestart={restart} />
        ) : gameId === "memory" ? (
          <div className="mx-auto max-w-2xl">
            <Memory key={round} words={themeWords(theme)} pairs={8} onRestart={restart} />
          </div>
        ) : gameId === "gluecksrad" ? (
          <Wheel key={round} theme={theme} onRestart={restart} />
        ) : (
          <Hangman key={round} theme={theme} onRestart={restart} />
        )}
      </div>
    </div>
  );
}
