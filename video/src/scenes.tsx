import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, HAND, PRINT } from "./theme";
import { Gloss, Heading, Marker, PostIt, RoughBox, RoughEllipse, RoughLine, Sticker, Underline, Write, prog, usePop } from "./ui";

/* ───────────── tipos de la línea de tiempo ───────────── */

export type Segment = { lang: "es" | "de"; text: string; voice?: string; es?: string; en?: string; audio: string; from: number; dur: number };
export type SceneData = { type: string; segments: Segment[]; durationInFrames: number; from: number } & Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
export type Meta = { level: string; number: number; title: string; subtitle: string };

const segFrom = (s: SceneData, i: number) => s.segments[Math.min(Math.max(i, 0), s.segments.length - 1)]?.from ?? 0;
const segEnd = (s: SceneData, i: number) => {
  const g = s.segments[Math.min(Math.max(i, 0), s.segments.length - 1)];
  return g ? g.from + g.dur : 0;
};
const activeSeg = (s: SceneData, frame: number) => s.segments.findIndex((g) => frame >= g.from && frame < g.from + g.dur);

/** La profe: un sticker que "habla" (rebota) mientras narra (frases sin voz de ejemplo) */
export function Teacher({ scene }: { scene: SceneData }) {
  const frame = useCurrentFrame();
  const i = activeSeg(scene, frame);
  const talking = i >= 0 && (scene.segments[i].lang === "es" || !scene.segments[i].voice);
  const bounce = talking ? Math.abs(Math.sin(frame / 4)) * 6 : 0;
  return (
    <div style={{ position: "absolute", left: 26, bottom: 18, transform: `translateY(${-bounce}px)` }}>
      <Sticker emoji="👩‍🏫" start={0} size={92} rotate={0} float={false} />
    </div>
  );
}

/** Ondas de sonido junto al texto alemán mientras suena */
function SoundWaves({ on }: { on: boolean }) {
  const frame = useCurrentFrame();
  if (!on) return null;
  return (
    <span style={{ display: "inline-flex", gap: 3, marginLeft: 14, verticalAlign: "middle" }}>
      {[0, 1, 2].map((k) => (
        <span key={k} style={{ width: 6, height: 14 + 12 * Math.abs(Math.sin(frame / 3 + k)), background: C.gold, borderRadius: 3, display: "inline-block" }} />
      ))}
    </span>
  );
}

/* ───────────── Portada ───────────── */

export function TitleScene({ scene, meta }: { scene: SceneData; meta: Meta }) {
  const stickers: string[] = scene.stickers ?? [];
  const spots = [
    { left: 900, top: 120, r: -8 },
    { left: 1020, top: 330, r: 7 },
    { left: 860, top: 470, r: -4 },
  ];
  return (
    <>
      <div style={{ position: "absolute", left: 170, top: 150 }}>
        <Gloss start={4} size={30} style={{ letterSpacing: 2 }}>
          {meta.level} · Einheit {meta.number}
        </Gloss>
        <Write start={12} dur={34} size={150} color={C.red}>
          {meta.title}
        </Write>
        <Underline width={Math.min(meta.title.length * 62, 640)} start={44} />
        <Gloss start={56} size={40} style={{ marginTop: 10, color: C.inkSoft }}>
          {meta.subtitle}
        </Gloss>
      </div>
      {stickers.slice(0, 3).map((e, i) => (
        <div key={e} style={{ position: "absolute", ...spots[i] }}>
          <Sticker emoji={e} start={26 + i * 8} size={i === 0 ? 150 : 110} rotate={spots[i].r} />
        </div>
      ))}
      <div style={{ position: "absolute", left: 175, top: 520 }}>
        <Write start={70} size={40} color={C.blue} dur={20}>
          {"Los geht's! →"}
        </Write>
      </div>
    </>
  );
}

/* ───────────── Línea del tiempo (p. ej. saludos del día) ───────────── */

export function TimelineScene({ scene }: { scene: SceneData }) {
  const frame = useCurrentFrame();
  const items = scene.items as { de: string; es: string; icon: string; at: number }[];
  const x0 = 170;
  const x1 = 1130;
  const y = 400;
  const step = (x1 - x0) / items.length;
  const playing = activeSeg(scene, frame);
  return (
    <>
      <Heading text={scene.heading} gloss={scene.gloss} />
      <RoughLine x1={x0 - 20} y1={y} x2={x1 + 30} y2={y} start={20} dur={24} arrow strokeWidth={3} />
      {items.map((it, i) => {
        const at = segFrom(scene, it.at);
        const cx = x0 + step * (i + 0.5);
        const on = playing === it.at;
        return (
          <React.Fragment key={it.de}>
            <div style={{ position: "absolute", left: cx - 50, top: y - 140 }}>
              <Sticker emoji={it.icon} start={at - 6} size={100} rotate={i % 2 ? 6 : -6} />
            </div>
            <RoughEllipse cx={cx} cy={y} w={18} h={18} start={at - 4} fill={C.red} fillStyle="solid" stroke={C.red} />
            <div style={{ position: "absolute", left: cx - step / 2, width: step, top: y + 30, textAlign: "center" }}>
              <Write start={at} size={44} dur={16} style={{ whiteSpace: "nowrap" }}>
                {on ? <Marker start={at}>{it.de}</Marker> : it.de}
              </Write>
              <Gloss start={at + 14} size={22}>
                {it.es}
              </Gloss>
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
}

/* ───────────── Nota adhesiva con un consejo ───────────── */

export function TipScene({ scene }: { scene: SceneData }) {
  const frame = useCurrentFrame();
  const de = scene.segments.length - 1; // la palabra clave se dice al final
  const wiggle = de >= 0 && frame >= segFrom(scene, de) ? Math.sin(frame / 3) * 3 : 0;
  return (
    <>
      <div style={{ position: "absolute", left: 370, top: 170 }}>
        <PostIt start={8} w={540} rotate={-3 + wiggle * 0.3}>
          <div style={{ fontFamily: HAND, fontSize: 84, fontWeight: 700, color: C.ink, textAlign: "center" }}>{scene.note}</div>
        </PostIt>
      </div>
      {scene.sticker && (
        <div style={{ position: "absolute", left: 930, top: 90 }}>
          <Sticker emoji={scene.sticker} start={18} size={130} rotate={12} />
        </div>
      )}
    </>
  );
}

/* ───────────── Frases clave con palabra marcada + notas en lápiz ───────────── */

function MarkedLine({ text, mark, start, on }: { text: string; mark?: string; start: number; on: boolean }) {
  if (!mark || !text.includes(mark)) return <>{text}</>;
  const [a, b] = [text.slice(0, text.indexOf(mark)), text.slice(text.indexOf(mark) + mark.length)];
  return (
    <>
      {a}
      <Marker start={start}>{mark}</Marker>
      {b}
      <SoundWaves on={on} />
    </>
  );
}

export function SentenceScene({ scene }: { scene: SceneData }) {
  const frame = useCurrentFrame();
  const lines = scene.lines as { de: string; es: string; mark?: string; at: number }[];
  const notes = (scene.notes ?? []) as { text: string; at: number }[];
  const playing = activeSeg(scene, frame);
  return (
    <>
      <Heading text={scene.heading} gloss={scene.gloss} />
      {scene.sticker && (
        <div style={{ position: "absolute", right: 120, top: 60 }}>
          <Sticker emoji={scene.sticker} start={10} size={110} rotate={8} />
        </div>
      )}
      {lines.map((l, i) => {
        const at = segFrom(scene, l.at);
        return (
          <div key={l.de} style={{ position: "absolute", left: 170, top: 255 + i * 170 }}>
            <Write start={at - 4} size={86} dur={20}>
              <MarkedLine text={l.de} mark={l.mark} start={at + 18} on={playing === l.at} />
            </Write>
            <Gloss start={at + 20} size={30}>
              {l.es}
            </Gloss>
          </div>
        );
      })}
      {notes.map((n, i) => {
        const at = segFrom(scene, n.at) + i * 40;
        return (
          <div key={n.text} style={{ position: "absolute", left: 860, top: 250 + i * 70 }}>
            <RoughLine x1={-20} y1={22} x2={-90 + i * 30} y2={40 + i * 10} start={at} arrow stroke={C.pencil} strokeWidth={2} />
            <Write start={at + 6} size={42} color={C.blue} dur={14}>
              {n.text}
            </Write>
          </div>
        );
      })}
    </>
  );
}

/* ───────────── Conjugación con terminaciones resaltadas ───────────── */

export function ConjugationScene({ scene }: { scene: SceneData }) {
  const frame = useCurrentFrame();
  const rows = scene.rows as { p: string; stem: string; end: string; at: number }[];
  const ex = scene.example as { de: string; es: string; at: number };
  const playing = activeSeg(scene, frame);
  const tx = 360;
  const ty = 345;
  const rowH = 82;
  const tableStart = segFrom(scene, 2);
  return (
    <>
      <Heading text={scene.heading} gloss={scene.gloss} />
      {scene.sticker && (
        <div style={{ position: "absolute", right: 120, top: 60 }}>
          <Sticker emoji={scene.sticker} start={10} size={110} rotate={-8} />
        </div>
      )}
      <div style={{ position: "absolute", left: 170, top: 225 }}>
        <Write start={segFrom(scene, ex.at) - 4} size={62} dur={20}>
          {ex.de}
          <SoundWaves on={playing === ex.at} />
        </Write>
        <Gloss start={segFrom(scene, ex.at) + 18} size={26}>
          {ex.es}
        </Gloss>
      </div>
      <RoughBox x={tx} y={ty} w={520} h={rows.length * rowH + 24} start={tableStart} dur={22} stroke={C.inkSoft} />
      <RoughLine x1={tx + 150} y1={ty + 14} x2={tx + 150} y2={ty + rows.length * rowH + 10} start={tableStart + 14} stroke={C.inkSoft} strokeWidth={2} />
      {rows.map((r, i) => {
        const at = segFrom(scene, r.at);
        const y = ty + 16 + i * rowH;
        return (
          <React.Fragment key={r.p}>
            <div style={{ position: "absolute", left: tx + 30, top: y + 8, fontFamily: PRINT, fontSize: 40, color: C.pencil, opacity: prog(frame, at - 6, 10) }}>{r.p}</div>
            <div style={{ position: "absolute", left: tx + 190, top: y }}>
              <Write start={at - 4} size={64} dur={14}>
                {r.stem}
                <span style={{ color: C.red }}>
                  <Marker start={at + 12} color={C.markerPeach}>
                    {r.end}
                  </Marker>
                </span>
              </Write>
            </div>
            {i > 0 && <RoughLine x1={tx + 14} y1={y - 4} x2={tx + 506} y2={y - 2} start={at - 8} stroke={C.rule} strokeWidth={2} />}
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: tx + 560, top: ty + 30 }}>
        <Write start={segFrom(scene, rows[0]?.at ?? 0) + 10} size={40} color={C.blue} dur={16}>
          {"← nur das Ende\n    cambia"}
        </Write>
      </div>
    </>
  );
}

/* ───────────── Comparación en dos columnas ───────────── */

export function CompareScene({ scene }: { scene: SceneData }) {
  const frame = useCurrentFrame();
  const playing = activeSeg(scene, frame);
  const sides = [
    { ...scene.left, x: 160, color: C.blue, rot: -2 },
    { ...scene.right, x: 680, color: C.red, rot: 2 },
  ];
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center" }}>
        <Write start={0} size={72} color={C.ink} style={{ display: "inline-block" }}>
          {scene.heading}
        </Write>
      </div>
      {sides.map((s, i) => {
        const appear = segFrom(scene, Math.max(s.at - 1, 0)) + (i === 0 ? 8 : 0);
        const exAt = segFrom(scene, s.at);
        return (
          <React.Fragment key={s.title}>
            <RoughBox x={s.x} y={175} w={440} h={420} start={appear} dur={20} stroke={s.color} strokeWidth={3} seed={i + 11} />
            <div style={{ position: "absolute", left: s.x, width: 440, top: 195, textAlign: "center", transform: `rotate(${s.rot}deg)` }}>
              <Write start={appear + 8} size={130} color={s.color} dur={12} style={{ display: "inline-block" }}>
                {s.title}
              </Write>
              <div style={{ display: "flex", justifyContent: "center", marginTop: -6 }}>
                <Sticker emoji={s.icon} start={appear + 16} size={92} rotate={i ? 6 : -6} />
              </div>
              <Gloss start={appear + 22} size={28} style={{ marginTop: 8 }}>
                {s.gloss}
              </Gloss>
              <div style={{ marginTop: 22, display: "inline-block" }}>
                <Write start={exAt - 2} size={50} dur={16}>
                  {playing === s.at ? <Marker start={exAt}>{s.example}</Marker> : s.example}
                </Write>
              </div>
            </div>
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: 610, top: 360, fontFamily: HAND, fontSize: 44, color: C.pencil, opacity: prog(frame, segFrom(scene, 2) - 10, 10) }}>vs.</div>
    </>
  );
}

/* ───────────── Diálogo con personajes y globos ───────────── */

export function DialogueScene({ scene }: { scene: SceneData }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const people = scene.people as Record<string, { icon: string; voice: string }>;
  const names = Object.keys(people);
  const lines = scene.lines as { who: string; de: string; at: number }[];
  const playing = activeSeg(scene, frame);
  const shown = lines.filter((l) => frame >= segFrom(scene, l.at) - 4);
  const visible = shown.slice(-3);
  return (
    <>
      <Heading text={scene.heading} />
      {names.slice(0, 2).map((n, i) => {
        const speaking = playing >= 0 && lines.some((l) => l.who === n && l.at === playing);
        const hop = speaking ? Math.abs(Math.sin(frame / 4)) * 10 : 0;
        return (
          <div key={n} style={{ position: "absolute", [i === 0 ? "left" : "right"]: 90, top: 430 - hop, textAlign: "center" }}>
            <Sticker emoji={people[n].icon} start={6 + i * 6} size={170} rotate={i ? 4 : -4} float={false} />
            <div style={{ fontFamily: HAND, fontSize: 40, fontWeight: 700, color: i ? C.red : C.blue }}>{n}</div>
          </div>
        );
      })}
      {visible.map((l, k) => {
        const idx = names.indexOf(l.who);
        const age = visible.length - 1 - k;
        const at = segFrom(scene, l.at);
        const pop = interpolate(frame - at + 4, [0, 0.25 * fps], [0.6, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const w = Math.min(640, l.de.length * 19 + 90);
        const h = 92;
        const y = 500 - age * 118;
        const x = idx === 0 ? 290 : 1280 - 290 - w;
        return (
          <div key={l.at} style={{ position: "absolute", left: x, top: y - h, width: w, height: h, opacity: age ? 0.5 : 1, transform: `scale(${pop})`, transformOrigin: idx === 0 ? "left bottom" : "right bottom" }}>
            <RoughBox x={0} y={0} w={w} h={h} start={at - 4} dur={10} stroke={idx === 0 ? C.blue : C.red} fill={idx === 0 ? "#e7eef6" : C.redSoft} fillStyle="solid" seed={l.at + 3} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 22px", fontFamily: HAND, fontSize: 40, fontWeight: 600, color: C.ink, whiteSpace: "nowrap" }}>
              {l.de}
              <SoundWaves on={playing === l.at} />
            </div>
          </div>
        );
      })}
    </>
  );
}

/* ───────────── ¡Ahora tú! con pausa ───────────── */

export function TryScene({ scene }: { scene: SceneData }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = segEnd(scene, 0) + 6;
  const pause = (scene.pause ?? 5) * fps;
  const left = Math.max(0, Math.ceil((start + pause - frame) / fps));
  return (
    <>
      <Heading text={scene.heading} gloss={scene.gloss} />
      <div style={{ position: "absolute", left: 300, top: 220 }}>
        <PostIt start={14} w={640} rotate={-2}>
          <div style={{ fontFamily: HAND, fontSize: 64, fontWeight: 700, color: C.ink, whiteSpace: "pre-line", lineHeight: 1.35 }}>{scene.note}</div>
        </PostIt>
      </div>
      <div style={{ position: "absolute", left: 960, top: 180 }}>
        <Sticker emoji="✏️" start={20} size={100} rotate={20} />
      </div>
      {frame >= start && (
        <>
          <RoughEllipse cx={1080} cy={520} w={130} h={130} start={start} dur={pause} stroke={C.red} strokeWidth={5} roughness={1} />
          <div style={{ position: "absolute", left: 1015, top: 470, width: 130, textAlign: "center", fontFamily: HAND, fontSize: 80, fontWeight: 700, color: C.red, transform: `scale(${usePopSafe(frame, start)})` }}>
            {left > 0 ? left : "✓"}
          </div>
        </>
      )}
    </>
  );
}

function usePopSafe(frame: number, start: number) {
  return interpolate(frame, [start, start + 8], [0.4, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

/* ───────────── Resumen con lista de chequeo ───────────── */

export function RecapScene({ scene }: { scene: SceneData }) {
  const items = scene.items as { text: string; at: number }[];
  const base = segFrom(scene, 1);
  const pop = usePop(base);
  return (
    <>
      <Heading text={scene.heading} />
      {items.map((it, i) => {
        const t = base + i * 22;
        return (
          <div key={it.text} style={{ position: "absolute", left: 200, top: 210 + i * 92, display: "flex", alignItems: "center", gap: 28 }}>
            <div style={{ position: "relative", width: 52, height: 52 }}>
              <RoughBox x={0} y={0} w={52} h={52} start={t - 10} dur={10} stroke={C.inkSoft} />
              <RoughLine x1={10} y1={26} x2={22} y2={40} start={t} dur={6} stroke={C.green} strokeWidth={5} />
              <RoughLine x1={22} y1={40} x2={46} y2={6} start={t + 6} dur={8} stroke={C.green} strokeWidth={5} />
            </div>
            <Write start={t - 6} size={56} dur={16}>
              {it.text}
            </Write>
          </div>
        );
      })}
      <div style={{ position: "absolute", right: 140, top: 420, transform: `scale(${pop})` }}>
        <Sticker emoji="⭐" start={base + items.length * 22} size={150} rotate={10} />
      </div>
    </>
  );
}
