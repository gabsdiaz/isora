"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SONGS, SONG_LEVELS } from "@/content/de/songs";
import { useSongConfigs } from "@/lib/songConfig";
import { useProgress } from "@/lib/progress";
import { useT } from "@/lib/i18n";
import { useMounted } from "../games/shared";

const LEVEL_NAME: Record<string, { de: string; es: string; en: string }> = {
  A1: { de: "Zum Einstieg", es: "para empezar", en: "to get started" },
  A2: { de: "Ein bisschen mehr", es: "un poco más", en: "a bit more" },
  B1: { de: "Klassiker", es: "clásicos", en: "classics" },
  B2: { de: "Poesie", es: "poesía", en: "poetry" },
};

/** Lista de canciones por nivel, con el avance del estudiante. */
export function SongList() {
  const params = useSearchParams();
  const teacher = params.get("lehrkraft") === "1";
  const { lang } = useT();
  const T = (es: string, en: string) => (lang === "en" ? en : es);
  const { progress } = useProgress();
  const configs = useSongConfigs();
  const mounted = useMounted();
  const q = teacher ? "?lehrkraft=1" : "";

  return (
    <div>
      <p className="text-sm text-cocoa">Deutsch mit Musik 🎵</p>
      <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">Lieder</h1>
      <p className="mt-2 max-w-2xl text-ink/75">
        {T(
          "Canciones clásicas que todo alemán conoce. Escúchalas en Spotify y completa la letra: primero eligiendo la palabra, luego escribiéndola.",
          "Classic songs every German knows. Listen on Spotify and fill in the lyrics: first by picking the word, then by typing it.",
        )}
      </p>

      {teacher && (
        <div className="mt-5 rounded-[2rem] border-2 border-dashed border-wine/40 bg-paper p-5 text-sm text-cocoa">
          <p className="font-display text-xl text-wine">🧑‍🏫 Modo Lehrkraft</p>
          <p className="mt-1">
            Cada canción ya trae una versión de Spotify. Si prefieres otra, pega su enlace; y si quieres el modo karaoke, sincroniza las líneas.{" "}
            {configs && `${SONGS.filter((s) => configs[s.id]?.timings?.length).length}/${SONGS.length} sincronizadas.`}
          </p>
        </div>
      )}

      {SONG_LEVELS.map((lv) => {
        const list = SONGS.filter((s) => s.level === lv);
        if (!list.length) return null;
        return (
          <section key={lv} className="mt-8">
            <h2 className="text-xl font-semibold">
              {lv} · {LEVEL_NAME[lv].de} <span className="font-sans text-sm font-normal text-muted">· {LEVEL_NAME[lv][lang]}</span>
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {list.map((s) => {
                const p = mounted ? progress[`song/${s.id}`] : undefined;
                const cfg = configs?.[s.id];
                const pct = p?.total ? Math.round(((p.score ?? 0) / p.total) * 100) : null;
                return (
                  <Link
                    key={s.id}
                    href={`/aprender/lieder/${s.id}${q}`}
                    className="group flex items-center gap-4 rounded-3xl border border-latte/60 bg-sand p-4 shadow-sm shadow-espresso/5 transition hover:border-cocoa-light hover:bg-sand-deep"
                  >
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-paper text-3xl" aria-hidden="true">
                      {s.emoji}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display text-lg text-ink">{s.title}</span>
                      <span className="block truncate text-sm text-cocoa">
                        {s.theme.de} <span className="text-muted">· {s.theme.tr[lang]}</span>
                      </span>
                      <span className="mt-1 flex flex-wrap gap-1.5 text-[11px]">
                        {(cfg?.spotify || s.spotify) && <span className="rounded-full bg-[#1db954]/15 px-2 py-0.5 text-[#14833b]">♫ Spotify</span>}
                        {cfg?.timings?.length && <span className="rounded-full bg-yellow-soft px-2 py-0.5 text-ink">🎤 Karaoke</span>}
                        {pct !== null && <span className="rounded-full bg-sage-soft px-2 py-0.5 text-sage">✓ {pct} %</span>}
                        {teacher && !cfg?.spotify && <span className="rounded-full bg-paper px-2 py-0.5 text-cocoa">versión por defecto</span>}
                      </span>
                    </span>
                    <span className="text-cocoa transition group-hover:translate-x-1" aria-hidden="true">
                      →
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
