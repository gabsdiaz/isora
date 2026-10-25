import React from "react";
import rough from "roughjs";
import { Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, HAND, PRINT } from "./theme";

const gen = rough.generator();

/* ───────────── utilidades de tiempo ───────────── */

export const prog = (frame: number, start: number, dur: number) =>
  interpolate(frame, [start, start + Math.max(dur, 1)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

export function usePop(start: number, delay = 0) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - start - delay, fps, config: { damping: 12, stiffness: 140, mass: 0.6 } });
}

/* ───────────── trazos a mano (rough.js) ───────────── */

type RoughOpts = { stroke?: string; strokeWidth?: number; roughness?: number; seed?: number; fill?: string; fillStyle?: string; bowing?: number; hachureGap?: number };

function Paths({ drawable, progress, w, h }: { drawable: ReturnType<typeof gen.rectangle>; progress: number; w: number; h: number }) {
  const paths = gen.toPaths(drawable);
  return (
    <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          stroke={p.stroke}
          strokeWidth={p.strokeWidth}
          fill={p.fill ?? "none"}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - progress}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: p.fill && p.fill !== "none" ? progress : 1 }}
        />
      ))}
    </svg>
  );
}

const base = (o: RoughOpts) => ({ stroke: o.stroke ?? C.ink, strokeWidth: o.strokeWidth ?? 2.6, roughness: o.roughness ?? 1.4, seed: o.seed ?? 7, bowing: o.bowing ?? 1.2, fill: o.fill, fillStyle: o.fillStyle ?? "hachure", hachureGap: o.hachureGap ?? 8 });

/** Rectángulo dibujado a mano que se traza solo */
export function RoughBox({ x, y, w, h, start, dur = 18, ...o }: { x: number; y: number; w: number; h: number; start: number; dur?: number } & RoughOpts) {
  const frame = useCurrentFrame();
  const d = gen.rectangle(4, 4, w - 8, h - 8, base(o));
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      <Paths drawable={d} progress={prog(frame, start, dur)} w={w} h={h} />
    </div>
  );
}

export function RoughEllipse({ cx, cy, w, h, start, dur = 16, ...o }: { cx: number; cy: number; w: number; h: number; start: number; dur?: number } & RoughOpts) {
  const frame = useCurrentFrame();
  const d = gen.ellipse(w / 2 + 6, h / 2 + 6, w, h, base({ roughness: 1.8, ...o }));
  return (
    <div style={{ position: "absolute", left: cx - w / 2 - 6, top: cy - h / 2 - 6, width: w + 12, height: h + 12 }}>
      <Paths drawable={d} progress={prog(frame, start, dur)} w={w + 12} h={h + 12} />
    </div>
  );
}

export function RoughLine({ x1, y1, x2, y2, start, dur = 14, arrow = false, ...o }: { x1: number; y1: number; x2: number; y2: number; start: number; dur?: number; arrow?: boolean } & RoughOpts) {
  const frame = useCurrentFrame();
  const opts = base(o);
  const line = gen.line(x1, y1, x2, y2, opts);
  const p = prog(frame, start, dur);
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const head = 16;
  const a1 = gen.line(x2, y2, x2 - head * Math.cos(ang - 0.45), y2 - head * Math.sin(ang - 0.45), opts);
  const a2 = gen.line(x2, y2, x2 - head * Math.cos(ang + 0.45), y2 - head * Math.sin(ang + 0.45), opts);
  return (
    <div style={{ position: "absolute", left: 0, top: 0 }}>
      <Paths drawable={line} progress={p} w={1} h={1} />
      {arrow && <Paths drawable={a1} progress={prog(frame, start + dur, 6)} w={1} h={1} />}
      {arrow && <Paths drawable={a2} progress={prog(frame, start + dur, 6)} w={1} h={1} />}
    </div>
  );
}

/** Subrayado a mano debajo de un bloque */
export function Underline({ width, start, color = C.red, seed = 3, top = 0 }: { width: number; start: number; color?: string; seed?: number; top?: number }) {
  const frame = useCurrentFrame();
  const d = gen.curve(
    [
      [2, 8],
      [width * 0.35, 4],
      [width * 0.7, 9],
      [width - 2, 5],
    ],
    { stroke: color, strokeWidth: 4, roughness: 1.2, seed },
  );
  return (
    <div style={{ position: "relative", height: 14, width, marginTop: top }}>
      <Paths drawable={d as ReturnType<typeof gen.rectangle>} progress={prog(frame, start, 14)} w={width} h={14} />
    </div>
  );
}

/* ───────────── texto escrito a mano ───────────── */

/** Texto que se "escribe" de izquierda a derecha */
export function Write({
  children,
  start,
  dur = 22,
  size = 48,
  color = C.ink,
  font = HAND,
  weight = 600,
  style,
}: {
  children: React.ReactNode;
  start: number;
  dur?: number;
  size?: number;
  color?: string;
  font?: string;
  weight?: number;
  style?: React.CSSProperties;
}) {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + dur], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        fontFamily: font,
        fontSize: size,
        fontWeight: weight,
        color,
        lineHeight: 1.15,
        clipPath: `inset(-20% ${p >= 100 ? -10 : (100 - p) * 1.1 - 10}% -30% -5%)`,
        whiteSpace: "pre-line",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Traducción en lápiz (gris, letra de imprenta) */
export function Gloss({ children, start, size = 26, style }: { children: React.ReactNode; start: number; size?: number; style?: React.CSSProperties }) {
  const frame = useCurrentFrame();
  return (
    <div style={{ fontFamily: PRINT, fontSize: size, color: C.pencil, opacity: prog(frame, start, 12), transform: `translateY(${(1 - prog(frame, start, 12)) * 6}px)`, ...style }}>
      {children}
    </div>
  );
}

/** Resaltador de marcador detrás de una palabra */
export function Marker({ children, start, color = C.marker }: { children: React.ReactNode; start: number; color?: string }) {
  const frame = useCurrentFrame();
  const p = prog(frame, start, 12);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span
        style={{
          position: "absolute",
          left: -6,
          right: -6,
          top: "38%",
          bottom: "2%",
          background: color,
          borderRadius: "6px 14px 8px 12px",
          transformOrigin: "left center",
          transform: `scaleX(${p}) rotate(-1deg)`,
          zIndex: 0,
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </span>
  );
}

/* ───────────── ilustraciones ───────────── */

export function emojiCode(e: string) {
  const all = Array.from(e).map((c) => c.codePointAt(0)!);
  const cps = all.includes(0x200d) ? all : all.filter((c) => c !== 0xfe0f);
  return cps.map((c) => c.toString(16)).join("-");
}

/** Ilustración tipo "sticker" con borde blanco que aparece con rebote */
export function Sticker({ emoji, start, size = 90, rotate = -6, style, float = true }: { emoji: string; start: number; size?: number; rotate?: number; style?: React.CSSProperties; float?: boolean }) {
  const frame = useCurrentFrame();
  const s = usePop(start);
  const bob = float ? Math.sin((frame - start) / 18) * 3 : 0;
  return (
    <div style={{ width: size, height: size, transform: `scale(${s}) rotate(${rotate + bob * 0.4}deg) translateY(${bob}px)`, filter: "drop-shadow(0 0 0 #fff) drop-shadow(2px 4px 0 rgba(46,32,25,0.18))", ...style }}>
      <Img
        src={staticFile(`emoji/${emojiCode(emoji)}.svg`)}
        style={{ width: "100%", height: "100%", filter: "drop-shadow(3px 0 0 #fff) drop-shadow(-3px 0 0 #fff) drop-shadow(0 3px 0 #fff) drop-shadow(0 -3px 0 #fff)" }}
      />
    </div>
  );
}

/** Nota adhesiva (post-it) */
export function PostIt({ children, start, w = 420, rotate = -3, style }: { children: React.ReactNode; start: number; w?: number; rotate?: number; style?: React.CSSProperties }) {
  const s = usePop(start);
  return (
    <div
      style={{
        width: w,
        padding: "34px 30px 30px",
        background: C.postit,
        transform: `scale(${s}) rotate(${rotate}deg)`,
        boxShadow: "6px 10px 18px rgba(46,32,25,0.18)",
        borderRadius: "2px 2px 18px 2px",
        position: "relative",
        ...style,
      }}
    >
      <div style={{ position: "absolute", top: -14, left: "50%", width: 110, height: 30, marginLeft: -55, background: "rgba(255,255,255,0.55)", transform: "rotate(2deg)" }} />
      {children}
    </div>
  );
}

/** Encabezado de escena: título a mano + traducción en lápiz + subrayado */
export function Heading({ text, gloss, start = 0, x = 150, y = 60 }: { text: string; gloss?: string; start?: number; x?: number; y?: number }) {
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      <Write start={start} size={72} color={C.red} dur={20}>
        {text}
      </Write>
      <Underline width={Math.min(text.length * 30, 520)} start={start + 16} />
      {gloss && (
        <Gloss start={start + 22} size={28} style={{ marginTop: 2 }}>
          {gloss}
        </Gloss>
      )}
    </div>
  );
}
