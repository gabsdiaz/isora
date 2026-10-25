"use client";

import Link from "next/link";
import { useLayoutEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getSong } from "@/content/de/songs";
import { makeBlanks, songLines, type Difficulty } from "@/lib/lyrics";
import { spotifyOpenUrl, spotifySearchUrl, useSpotifyPlayer } from "@/lib/spotify";
import { useSongConfig, type SongConfig } from "@/lib/songConfig";
import { stopSpeech } from "@/lib/speech";
import { useT } from "@/lib/i18n";
import { useMounted } from "../games/shared";
import { LyricsBoard } from "./LyricsBoard";
import { SyncTool } from "./SyncTool";

const LEVELS: { id: Difficulty; de: string; es: string; en: string }[] = [
  { id: "leicht", de: "Leicht", es: "eliges la palabra", en: "pick the word" },
  { id: "mittel", de: "Mittel", es: "la escribes", en: "type it" },
  { id: "schwer", de: "Schwer", es: "muchos huecos", en: "lots of blanks" },
];

export function SongView({ id }: { id: string }) {
  const song = getSong(id)!;
  const params = useSearchParams();
  const teacher = params.get("lehrkraft") === "1";
  const { lang } = useT();
  const T = (es: string, en: string) => (lang === "en" ? en : es);
  const mounted = useMounted();
  const { config, update } = useSongConfig(id);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  // Versión elegida por la Lehrkraft o, si no hay, la versión por defecto de la canción
  const uri = previewUri ?? (config ? (config.spotify ?? song.spotify ?? null) : null);
  const [attachPlayer, player] = useSpotifyPlayer(mounted ? uri : null);
  const lines = useMemo(() => songLines(song), [song]);
  const [difficulty, setDifficulty] = useState<Difficulty>("leicht");
  const [round, setRound] = useState(0);
  const blanks = useMemo(() => makeBlanks(song, difficulty, round), [song, difficulty, round]);
  const timings = config && !previewUri && config.timings?.length === lines.length ? config.timings : null;

  // Al salir de la página, que no siga sonando nada
  useLayoutEffect(() => () => stopSpeech(), []);

  const nextLevel = LEVELS[LEVELS.findIndex((l) => l.id === difficulty) + 1];

  return (
    <div className="mx-auto max-w-3xl">
      <Link href={teacher ? "/aprender/lieder?lehrkraft=1" : "/aprender/lieder"} className="text-sm text-muted hover:text-wine">
        ← Lieder
      </Link>
      <header className="mt-4 flex items-start gap-4">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-sand text-4xl" aria-hidden="true">
          {song.emoji}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
            {song.level} · {song.theme.de}
          </p>
          <h1 className="mt-1 text-3xl font-semibold leading-tight sm:text-4xl">{song.title}</h1>
          <p className="mt-1 text-xs text-muted">{song.credit}</p>
        </div>
      </header>
      <p className="mt-4 text-cocoa">{song.about[lang]}</p>

      {/* Reproductor */}
      <section className="mt-5 rounded-[2rem] border border-latte/60 bg-sand p-4 sm:p-5">
        {uri && player.status !== "error" && (
          <div className="relative min-h-[152px]">
            <div ref={attachPlayer} className="overflow-hidden rounded-2xl" />
            {player.status === "loading" && <p className="absolute inset-0 flex items-center justify-center text-sm text-muted">Spotify lädt …</p>}
          </div>
        )}
        {(!uri || player.status === "error") && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1db954] text-2xl text-white" aria-hidden="true">
              ♫
            </span>
            <div className="min-w-[12rem] flex-1">
              <p className="font-display text-lg text-ink">{T("Escúchala en Spotify", "Listen on Spotify")}</p>
              <p className="text-sm text-cocoa">
                {player.status === "error"
                  ? T("El reproductor de Spotify no cargó aquí. Ábrela en Spotify mientras completas la letra.", "The Spotify player didn't load here. Open it in Spotify while you fill in the lyrics.")
                  : T("Ábrela en Spotify y completa la letra mientras suena. También puedes oír cada línea hablada con 🔊.", "Open it in Spotify and fill in the lyrics while it plays. You can also hear each line spoken with 🔊.")}
              </p>
            </div>
            <a
              href={uri ? spotifyOpenUrl(uri) : spotifySearchUrl(song.query)}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[#1db954] px-4 py-2 text-sm font-medium text-white transition hover:brightness-95"
            >
              {uri ? T("Abrir en Spotify", "Open in Spotify") : T("Buscar en Spotify", "Search on Spotify")} ↗
            </a>
          </div>
        )}
        {uri && player.status === "ready" && (
          <p className="mt-2 text-xs text-muted">
            {player.preview
              ? T("Spotify suena un fragmento de 30 s. Para la canción completa, inicia sesión en Spotify en este navegador.", "Spotify is playing a 30-second preview. Log in to Spotify in this browser for the full song.")
              : timings
                ? T("🎤 Modo karaoke: la letra sigue la canción y la música te espera en cada hueco.", "🎤 Karaoke mode: the lyrics follow the song and the music waits for you at each blank.")
                : T("Dale ▶ y completa la letra mientras suena.", "Press ▶ and fill in the lyrics while it plays.")}
          </p>
        )}
      </section>

      {teacher && config && (
        <SyncTool
          song={song}
          lines={lines}
          player={player}
          config={config}
          previewUri={previewUri}
          onPreview={setPreviewUri}
          onSaved={(c: SongConfig) => {
            update(c);
            setPreviewUri(null);
          }}
        />
      )}

      {/* Dificultad */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {LEVELS.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setDifficulty(l.id)}
            aria-pressed={difficulty === l.id}
            className={`rounded-full border px-4 py-2 text-sm transition ${difficulty === l.id ? "border-wine bg-wine text-cream" : "border-latte bg-paper text-ink hover:border-cocoa"}`}
          >
            <b className="font-medium">{l.de}</b> <span className={difficulty === l.id ? "text-cream/80" : "text-muted"}>· {lang === "en" ? l.en : l.es}</span>
          </button>
        ))}
        <button type="button" onClick={() => setRound((r) => r + 1)} className="rounded-full px-3 py-2 text-sm text-cocoa transition hover:bg-sand">
          ↻ {T("Otros huecos", "New blanks")}
        </button>
      </div>

      <section className="mt-5 rounded-[2rem] border border-latte/60 bg-paper p-4 sm:p-6">
        {mounted ? (
          <LyricsBoard
            key={`${difficulty}-${round}`}
            song={song}
            lines={lines}
            blanks={blanks}
            difficulty={difficulty}
            player={player}
            timings={timings}
            lang={lang}
            onAgain={() => setRound((r) => r + 1)}
            onHarder={nextLevel ? () => setDifficulty(nextLevel.id) : null}
          />
        ) : (
          <p className="py-10 text-center text-muted">…</p>
        )}
      </section>
    </div>
  );
}
