"use client";

import { useSyncExternalStore } from "react";
import type { VocabEntry } from "@/content/types";

export function shuffle<X>(a: readonly X[]): X[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

export const sample = <X,>(a: readonly X[]) => a[Math.floor(Math.random() * a.length)];

export const headword = (v: Pick<VocabEntry, "de" | "article">) => (v.article ? `${v.article} ${v.de}` : v.de);

export const ARTICLE_TEXT: Record<string, string> = { der: "text-blue", die: "text-wine", das: "text-sage" };
export const ARTICLE_BG: Record<string, string> = {
  der: "bg-blue text-cream hover:brightness-110",
  die: "bg-wine text-cream hover:bg-wine-light",
  das: "bg-sage text-cream hover:brightness-110",
};

/** true solo en el navegador: los juegos barajan al azar y no deben prerenderizarse. */
const noop = () => () => {};
export const useMounted = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

export function Progress({ value, max }: { value: number; max: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-cream-deep">
        <div className="h-full rounded-full bg-wine transition-all duration-500" style={{ width: `${(value / max) * 100}%` }} />
      </div>
      <span className="text-sm tabular-nums text-cocoa">
        {value}/{max}
      </span>
    </div>
  );
}

export function ResultCard({ emoji, title, detail, onRestart, restartLabel }: { emoji: string; title: string; detail: string; onRestart: () => void; restartLabel: string }) {
  return (
    <div className="mx-auto max-w-md rounded-[2rem] border border-latte/60 bg-sand p-8 text-center">
      <p className="text-5xl">{emoji}</p>
      <p className="mt-3 font-display text-3xl text-ink">{title}</p>
      <p className="mt-2 text-cocoa">{detail}</p>
      <button type="button" onClick={onRestart} className="mt-6 rounded-full bg-wine px-6 py-2.5 font-medium text-cream hover:bg-wine-light">
        {restartLabel}
      </button>
    </div>
  );
}

export const stars = (ratio: number) => (ratio >= 0.9 ? "⭐⭐⭐" : ratio >= 0.6 ? "⭐⭐" : ratio > 0 ? "⭐" : "💪");
