"use client";

import { useEffect, useState } from "react";
import type { UnitContent } from "@/content/types";
import { useT } from "@/lib/i18n";
import { SpeakButton } from "../SpeakButton";

const MOMENTS = [
  { de: "Guten Morgen!", sky: "#f3dcc4", x: 16, y: 34, moon: false },
  { de: "Guten Tag!", sky: "#efe3cf", x: 50, y: 22, moon: false },
  { de: "Guten Abend!", sky: "#e2b9a4", x: 84, y: 34, moon: false },
  { de: "Gute Nacht!", sky: "#3b2a33", x: 70, y: 26, moon: true },
];

export function VideoSection({ video, title }: { video: UnitContent["video"]; title: string }) {
  const { t, loc } = useT();

  return (
    <section>
      <div className="overflow-hidden rounded-3xl border border-line bg-paper shadow-sm">
        {video.src ? (
          <video controls preload="metadata" poster={video.poster} className="aspect-video w-full bg-ink">
            <source src={video.src} type="video/mp4" />
          </video>
        ) : (
          <VideoPlaceholder />
        )}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-5 py-4">
          <p className="font-display text-lg text-wine">{title}</p>
          {video.duration && <span className="text-sm text-muted">{video.duration}</span>}
        </div>
      </div>
      <p className="mt-4 text-ink/80">{loc(video.description)}</p>
      {!video.src && <p className="mt-2 text-sm text-muted">{t("videoSoon")}</p>}
    </section>
  );
}

/** Adelanto animado del estilo de los videos (mientras se produce el video real). */
function VideoPlaceholder() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % MOMENTS.length), 2600);
    return () => clearInterval(id);
  }, []);
  const m = MOMENTS[i];
  const night = m.moon;

  return (
    <div className="relative aspect-video w-full transition-colors duration-1000" style={{ background: m.sky }}>
      <svg viewBox="0 0 100 56.25" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {night &&
          [12, 28, 41, 57, 88, 93, 20].map((x, k) => (
            <circle key={k} cx={x} cy={6 + ((k * 7) % 18)} r="0.35" fill="#f6efe3" opacity="0.8" />
          ))}
        <circle
          cx={m.x}
          cy={m.y}
          r="5"
          fill={night ? "#f6efe3" : "#b8893e"}
          style={{ transition: "cx 1.2s ease, cy 1.2s ease, fill 1s" }}
        />
        {night && <circle cx={m.x + 2} cy={m.y - 1.2} r="4.2" fill={m.sky} style={{ transition: "cx 1.2s ease, cy 1.2s ease" }} />}
        {/* Silueta de ciudad */}
        <path
          d="M0 56.25V44h6v-6h5v8h4V36h6v10h3v-7h7v9h5V33l4-3 4 3v15h4v-9h6v7h5V38h6v10h4v-6h6v-5h5v8h5v-6h6v9h4V40h5v16.25z"
          fill={night ? "#1f1418" : "#6e1e2b"}
          opacity={night ? 1 : 0.92}
          style={{ transition: "fill 1s" }}
        />
        {/* Ventanas */}
        {[8, 18, 36, 52, 70, 84, 92].map((x, k) => (
          <rect key={k} x={x} y={47 + (k % 2) * 3} width="1.4" height="1.6" fill={night ? "#e8c27a" : "#f1dfdc"} opacity={night ? 0.9 : 0.5} />
        ))}
      </svg>
      <div className="absolute inset-x-0 top-[8%] flex flex-col items-center">
        <p
          key={m.de}
          className="animate-[fadeUp_0.6s_ease] font-display text-3xl font-semibold sm:text-5xl"
          style={{ color: night ? "#f6efe3" : "#4a2e22" }}
        >
          {m.de}
        </p>
        <SpeakButton text={m.de} className="mt-3" />
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
