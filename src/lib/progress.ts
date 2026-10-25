"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Progreso del estudiante (por ahora en el navegador).
 * Próximo paso: sincronizarlo con Firestore en users/{uid}/progress.
 */
type Progress = Record<string, { completed: boolean; score?: number; total?: number }>;

const KEY = "isora.progress.v1";
const EVENT = "isora:progress";
const EMPTY: Progress = {};

let cacheRaw: string | null = null;
let cache: Progress = EMPTY;

function snapshot(): Progress {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  if (raw !== cacheRaw) {
    cacheRaw = raw;
    try {
      cache = raw ? (JSON.parse(raw) as Progress) : EMPTY;
    } catch {
      cache = EMPTY;
    }
  }
  return cache;
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function useProgress() {
  const progress = useSyncExternalStore(subscribe, snapshot, () => EMPTY);

  const markUnit = useCallback((key: string, score: number, total: number) => {
    const next = { ...snapshot(), [key]: { completed: true, score, total } };
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* sin almacenamiento */
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { progress, markUnit };
}

export const unitKey = (lang: string, level: string, n: number) => `${lang}/${level}/${n}`;
