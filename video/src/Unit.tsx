import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import "@fontsource/caveat/500.css";
import "@fontsource/caveat/600.css";
import "@fontsource/caveat/700.css";
import "@fontsource/patrick-hand/400.css";
import { C } from "./theme";
import {
  CompareScene,
  ConjugationScene,
  DialogueScene,
  RecapScene,
  SentenceScene,
  Teacher,
  TimelineScene,
  TipScene,
  TitleScene,
  TryScene,
  type Meta,
  type SceneData,
} from "./scenes";

export type Timeline = Meta & { key: string; fps: number; width: number; height: number; durationInFrames: number; scenes: SceneData[] };

/** Fondo de cuaderno: papel crema, renglones y margen rojo */
function Paper() {
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0px, transparent 47px, ${C.rule} 47px, ${C.rule} 48px)`,
          backgroundPosition: "0 22px",
          opacity: 0.8,
        }}
      />
      <div style={{ position: "absolute", left: 128, top: 0, bottom: 0, width: 2, background: C.margin, opacity: 0.8 }} />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 140px rgba(120, 90, 60, 0.16)" }} />
      {/* agujeros del cuaderno */}
      {[150, 360, 570].map((y) => (
        <div key={y} style={{ position: "absolute", left: 44, top: y, width: 26, height: 26, borderRadius: 13, background: "#e6dece", boxShadow: "inset 2px 2px 4px rgba(0,0,0,0.15)" }} />
      ))}
    </AbsoluteFill>
  );
}

function SceneSwitch({ scene, meta }: { scene: SceneData; meta: Meta }) {
  switch (scene.type) {
    case "title":
      return <TitleScene scene={scene} meta={meta} />;
    case "timeline":
      return <TimelineScene scene={scene} />;
    case "tip":
      return <TipScene scene={scene} />;
    case "sentence":
      return <SentenceScene scene={scene} />;
    case "conjugation":
      return <ConjugationScene scene={scene} />;
    case "compare":
      return <CompareScene scene={scene} />;
    case "dialogue":
      return <DialogueScene scene={scene} />;
    case "try":
      return <TryScene scene={scene} />;
    case "recap":
      return <RecapScene scene={scene} />;
    default:
      return null;
  }
}

/** Página que entra y sale con un pequeño deslizamiento (como pasar la hoja) */
function Page({ scene, meta }: { scene: SceneData; meta: Meta }) {
  const frame = useCurrentFrame();
  const d = scene.durationInFrames;
  const opacity = interpolate(frame, [0, 8, d - 8, d], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x = interpolate(frame, [0, 10], [24, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity, transform: `translateX(${x}px)` }}>
      <SceneSwitch scene={scene} meta={meta} />
      {scene.type !== "dialogue" && scene.type !== "title" && <Teacher scene={scene} />}
      {scene.segments.map((g, i) => (
        <Sequence key={i} from={g.from} durationInFrames={g.dur + 5}>
          <Audio src={staticFile(g.audio)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}

export function UnitVideo(props: Timeline) {
  const meta: Meta = { level: props.level, number: props.number, title: props.title, subtitle: props.subtitle };
  return (
    <AbsoluteFill>
      <Paper />
      {props.scenes.map((s) => (
        <Sequence key={s.from} from={s.from} durationInFrames={s.durationInFrames}>
          <Page scene={s} meta={meta} />
        </Sequence>
      ))}
      <Sequence from={props.durationInFrames - 45}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
}

function Outro() {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#2e2019", opacity: o, alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 70, height: 70, borderRadius: 35, background: C.red }} />
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: 96, fontWeight: 700, color: C.paper }}>Isora</div>
      </div>
    </AbsoluteFill>
  );
}
