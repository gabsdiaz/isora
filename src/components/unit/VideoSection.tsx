"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { VideoScript } from "@/content/types";
import { videos } from "@/content/generated/media";
import { useT } from "@/lib/i18n";
import { Translatable } from "../german/Translatable";

type Track = "de" | "es" | "en" | "off";

export function VideoSection({ script, title, mediaKey, unitKey }: { script: VideoScript; title: string; mediaKey: string; unitKey: string }) {
  const { g, lang } = useT();
  const info = videos[mediaKey];
  const ref = useRef<HTMLVideoElement>(null);
  // Por defecto: subtítulos en la lengua materna (el audio ya está en alemán)
  const [choice, setTrack] = useState<Track | null>(null);
  const track: Track = choice ?? lang;
  const base = `/videos/${mediaKey}`;

  // Al salir de la unidad (o cambiar de pestaña) Next.js oculta la página sin desmontarla:
  // pausamos el video para que no siga sonando de fondo.
  useLayoutEffect(() => {
    const v = ref.current;
    return () => v?.pause();
  }, [info]);

  // Activa la pista de subtítulos elegida
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const apply = () => {
      for (const t of Array.from(v.textTracks)) t.mode = t.language === track ? "showing" : "disabled";
    };
    apply();
    v.textTracks.addEventListener?.("addtrack", apply);
    return () => v.textTracks.removeEventListener?.("addtrack", apply);
  }, [track, info]);

  const options: { id: Track; label: string }[] = [
    { id: "de", label: "Deutsch" },
    { id: lang, label: lang === "es" ? "Español" : "English" },
    { id: "off", label: "Aus" },
  ];

  return (
    <section>
      <div className="overflow-hidden rounded-3xl border border-line bg-paper shadow-sm">
        {info ? (
          <video ref={ref} controls playsInline preload="metadata" poster={`${base}.jpg`} className="aspect-video w-full bg-cream" crossOrigin="anonymous">
            <source src={`${base}.mp4`} type="video/mp4" />
            <track kind="subtitles" srcLang="de" label="Deutsch" src={`${base}.de.vtt`} />
            <track kind="subtitles" srcLang="es" label="Español" src={`${base}.es.vtt`} />
            <track kind="subtitles" srcLang="en" label="English" src={`${base}.en.vtt`} />
          </video>
        ) : (
          <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 bg-cream-deep/60 p-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-wine text-xl text-cream">▶</span>
            <p className="max-w-sm text-sm text-muted">{g("videoSoon")}</p>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3.5">
          <p className="font-display text-lg text-wine">{title}</p>
          {info && (
            <div className="flex items-center gap-1.5 text-sm">
              <span className="mr-1 text-muted">{g("subtitles")}:</span>
              {options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setTrack(o.id)}
                  className={`rounded-full px-2.5 py-1 transition ${track === o.id ? "bg-wine text-cream" : "text-cocoa hover:bg-cream-deep"}`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <Translatable de={script.intro.de} tr={script.intro} unitKey={unitKey} className="mt-4" textClassName="text-ink/80" />
    </section>
  );
}
