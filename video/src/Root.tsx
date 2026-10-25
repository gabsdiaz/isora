import React from "react";
import { Composition, continueRender, delayRender } from "remotion";
import { UnitVideo, type Timeline } from "./Unit";

// Espera a que carguen las fuentes de mano antes de dibujar
const fontsHandle = typeof document !== "undefined" ? delayRender("fuentes") : null;
if (typeof document !== "undefined") {
  Promise.all([
    document.fonts.load("600 48px Caveat"),
    document.fonts.load("700 48px Caveat"),
    document.fonts.load("500 48px Caveat"),
    document.fonts.load("400 24px 'Patrick Hand'"),
  ])
    .catch(() => undefined)
    .then(() => fontsHandle !== null && continueRender(fontsHandle));
}

const empty: Timeline = { key: "", level: "", number: 0, title: "", subtitle: "", fps: 30, width: 1280, height: 720, durationInFrames: 30, scenes: [] };

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Unit"
    component={UnitVideo as unknown as React.FC<Record<string, unknown>>}
    defaultProps={empty as unknown as Record<string, unknown>}
    durationInFrames={30}
    fps={30}
    width={1280}
    height={720}
    calculateMetadata={({ props }) => {
      const t = props as unknown as Timeline;
      return { durationInFrames: Math.max(t.durationInFrames, 30), fps: t.fps, width: t.width, height: t.height };
    }}
  />
);
