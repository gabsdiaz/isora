"use client";

import { useCallback, useSyncExternalStore } from "react";
import { createStore } from "./progress";
import { LEVEL_ORDER, type LevelTag } from "@/content/de/exams";

/**
 * Niveles del estudiante: cuáles están abiertos (candados), cómo eligió empezar
 * y los resultados de sus exámenes. Se sincroniza con la cuenta (cloud.ts).
 */
export type ExamResult = { score: number; passed: boolean; at: number; level?: string; sections?: Record<string, number> };
export type LevelState = {
  startChoice?: "test" | "scratch";
  unlocked: string[];
  placement?: { level: string; at: number; sections: Record<string, number> };
  exams: Record<string, ExamResult>;
};

export const LEVELS_KEY = "isora.levels.v1";
export const LEVELS_EVENT = "isora:levels";
const EMPTY: LevelState = { unlocked: ["a1-1"], exams: {} };
const store = createStore<LevelState>(LEVELS_KEY, LEVELS_EVENT, EMPTY);

/** Todos los niveles hasta `level` (incluido) */
export const levelsUpTo = (level: string) => LEVEL_ORDER.slice(0, Math.max(0, LEVEL_ORDER.indexOf(level as LevelTag)) + 1);

export function useLevels() {
  const state = useSyncExternalStore(store.subscribe, store.snapshot, () => EMPTY);
  const patch = useCallback((fn: (s: LevelState) => LevelState) => store.save(fn({ ...EMPTY, ...store.snapshot() })), []);

  const isUnlocked = useCallback((level: string) => level === "a1-1" || state.unlocked?.includes(level), [state]);

  const unlock = useCallback((levels: string[]) => patch((s) => ({ ...s, unlocked: Array.from(new Set([...(s.unlocked ?? []), ...levels])) })), [patch]);

  const chooseStart = useCallback((choice: "test" | "scratch") => patch((s) => ({ ...s, startChoice: choice })), [patch]);

  const saveExam = useCallback(
    (id: string, r: ExamResult) =>
      patch((s) => {
        const prev = s.exams?.[id];
        const best = !prev || r.score >= prev.score ? r : { ...prev, passed: prev.passed || r.passed };
        return { ...s, exams: { ...s.exams, [id]: best } };
      }),
    [patch],
  );

  const savePlacement = useCallback(
    (level: string, sections: Record<string, number>) =>
      patch((s) => ({
        ...s,
        startChoice: "test",
        placement: { level, sections, at: Date.now() },
        unlocked: Array.from(new Set([...(s.unlocked ?? []), ...levelsUpTo(level)])),
      })),
    [patch],
  );

  return { levels: state, isUnlocked, unlock, chooseStart, saveExam, savePlacement };
}
