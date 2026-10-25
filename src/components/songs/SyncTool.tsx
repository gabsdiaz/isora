"use client";

import { useEffect, useRef, useState } from "react";
import type { Song } from "@/content/de/songs";
import type { LyricsLine } from "@/lib/lyrics";
import { parseSpotifyTrack, spotifyOpenUrl, spotifySearchUrl, type SpotifyPlayer } from "@/lib/spotify";
import { saveSongConfig, type SongConfig } from "@/lib/songConfig";
import { useSession } from "@/lib/session";

const mmss = (ms: number) => `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, "0")}.${Math.floor((ms % 1000) / 100)}`;

/**
 * Modo Lehrkraft: elegir la versión de Spotify y marcar cuándo empieza cada línea.
 * Se guarda en Firestore (songs/{id}) y desde ahí lo ven todos los estudiantes.
 */
export function SyncTool({
  song,
  lines,
  player,
  config,
  previewUri,
  onPreview,
  onSaved,
}: {
  song: Song;
  lines: LyricsLine[];
  player: SpotifyPlayer;
  config: SongConfig;
  previewUri: string | null;
  onPreview: (uri: string) => void;
  onSaved: (c: SongConfig) => void;
}) {
  const { user } = useSession();
  const [link, setLink] = useState(config.spotify ? spotifyOpenUrl(config.spotify) : "");
  const [linkError, setLinkError] = useState(false);
  const [marks, setMarks] = useState<number[]>([]);
  const [recording, setRecording] = useState(false);
  const [saved, setSaved] = useState<"idle" | "saving" | "ok" | "denied" | "error">("idle");
  const uri = previewUri ?? config.spotify ?? null;
  const complete = marks.length === lines.length;

  const mark = () => {
    if (!recording || marks.length >= lines.length) return;
    const next = [...marks, Math.round(player.position())];
    setMarks(next);
    if (next.length === lines.length) setRecording(false);
  };
  const markRef = useRef(mark);
  useEffect(() => {
    markRef.current = mark;
  });
  // Barra espaciadora = marcar la siguiente línea
  useEffect(() => {
    if (!recording) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault();
        markRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [recording]);

  const start = () => {
    setMarks([]);
    setSaved("idle");
    setRecording(true);
    player.seek(0);
    player.play();
  };

  const save = async () => {
    if (!uri) return;
    setSaved("saving");
    const cfg: SongConfig = { spotify: uri, timings: complete ? marks : uri === config.spotify ? config.timings : undefined };
    const r = await saveSongConfig(song.id, cfg, user?.email ?? "");
    setSaved(r);
    if (r === "ok") onSaved(cfg);
  };

  const btn = "rounded-full px-4 py-2 text-sm font-medium transition disabled:opacity-40";
  return (
    <section className="mt-6 rounded-[2rem] border-2 border-dashed border-wine/40 bg-paper p-5 sm:p-6">
      <p className="font-display text-2xl text-wine">🧑‍🏫 Lehrkraft: Lied einrichten</p>
      <p className="mt-1 text-sm text-cocoa">Solo lo ves en modo Lehrkraft. Lo que guardes aquí lo verán todos los estudiantes.</p>

      {/* 1. Versión de Spotify */}
      <div className="mt-5">
        <p className="text-sm font-medium text-ink">1 · Elige la versión en Spotify</p>
        <p className="text-xs text-muted">
          Elige una versión que cante esta misma letra (las canciones populares tienen variantes). Abre la canción → «Compartir» → «Copiar enlace de la canción» y pégalo aquí.{" "}
          <a href={spotifySearchUrl(song.query)} target="_blank" rel="noreferrer" className="text-wine underline">
            Buscar «{song.query}» en Spotify ↗
          </a>
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <input
            value={link}
            onChange={(e) => {
              setLink(e.target.value);
              setLinkError(false);
            }}
            placeholder="https://open.spotify.com/track/…"
            className="min-w-0 flex-1 rounded-xl border border-line bg-cream px-3 py-2 text-sm outline-none focus:border-wine"
          />
          <button
            type="button"
            onClick={() => {
              const u = parseSpotifyTrack(link);
              if (!u) return setLinkError(true);
              setMarks([]);
              onPreview(u);
            }}
            className={`${btn} bg-wine text-cream hover:bg-wine-light`}
          >
            Laden
          </button>
        </div>
        {linkError && <p className="mt-1 text-xs text-wine">Ese enlace no parece de una canción de Spotify (debe contener /track/…).</p>}
      </div>

      {/* 2. Sincronizar */}
      <div className="mt-6">
        <p className="text-sm font-medium text-ink">2 · Sincroniza la letra (opcional, activa el modo karaoke)</p>
        <p className="text-xs text-muted">
          Pulsa «Aufnahme starten» y toca «Jetzt!» (o la barra espaciadora) justo cuando empieza cada línea. Si te equivocas, deshaz la última marca.
        </p>
        {player.preview && (
          <p className="mt-2 rounded-xl bg-yellow-soft px-3 py-2 text-xs text-ink">
            Spotify está sonando solo el fragmento de 30 s. Inicia sesión en open.spotify.com en este navegador y recarga la página para sincronizar la canción completa.
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button type="button" disabled={!uri || player.status !== "ready"} onClick={start} className={`${btn} border border-cocoa/30 bg-cream text-cocoa hover:border-cocoa`}>
            ⏺ Aufnahme starten
          </button>
          <button
            type="button"
            disabled={!recording}
            onClick={mark}
            className={`${btn} min-w-[10rem] bg-yellow text-ink shadow-md shadow-yellow/40 hover:brightness-95`}
          >
            ⏱ Jetzt! · Zeile {Math.min(marks.length + 1, lines.length)}/{lines.length}
          </button>
          <button type="button" disabled={!marks.length} onClick={() => setMarks((m) => m.slice(0, -1))} className={`${btn} text-cocoa hover:bg-sand`}>
            ↶ Rückgängig
          </button>
        </div>
        {recording && marks.length < lines.length && (
          <p className="mt-3 rounded-2xl bg-sand px-4 py-3 font-display text-xl text-ink">
            <span className="mr-2 text-xs font-sans uppercase tracking-wide text-muted">Nächste Zeile</span>
            {lines[marks.length].de}
          </p>
        )}
        {marks.length > 0 && (
          <ol className="mt-3 max-h-48 space-y-0.5 overflow-auto rounded-xl bg-cream p-2 text-xs text-cocoa">
            {marks.map((m, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-14 shrink-0 tabular-nums text-muted">{mmss(m)}</span>
                <span className="truncate">{lines[i].de}</span>
              </li>
            ))}
          </ol>
        )}
        {!marks.length && config.timings?.length === lines.length && uri === config.spotify && (
          <p className="mt-2 text-xs text-sage">✓ Esta canción ya está sincronizada. Puedes volver a grabarla si quieres.</p>
        )}
      </div>

      {/* 3. Guardar */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" disabled={!uri || saved === "saving" || recording} onClick={save} className={`${btn} bg-wine text-cream hover:bg-wine-light`}>
          {saved === "saving" ? "…" : complete ? "💾 Guardar versión + karaoke" : "💾 Guardar versión"}
        </button>
        {saved === "ok" && <span className="text-sm text-sage">✓ Guardado para todos los estudiantes</span>}
        {saved === "denied" && <span className="text-sm text-wine">Solo las cuentas de Lehrkraft pueden guardar (revisa tu correo en las reglas de Firestore).</span>}
        {saved === "error" && <span className="text-sm text-wine">No se pudo guardar. Intenta de nuevo.</span>}
      </div>
    </section>
  );
}
