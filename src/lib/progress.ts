"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Progreso del estudiante. Se guarda en el navegador y, si hay sesión con Google,
 * también en Firestore (ver cloud.ts) para tenerlo en todos los dispositivos.
 *
 * - progress: por unidad ("de/a1-1/3") o historia ("story/kaffee-dieb"):
 *   ejercicios terminados (completed, score) y secciones vistas.
 * - last: dónde quedó el estudiante (unidad + pestaña) para "Weiterlernen".
 */
export type UnitProgress = { completed?: boolean; score?: number; total?: number; sections?: string[]; at?: number };
export type Progress = Record<string, UnitProgress>;
export type LastVisit = { level: string; number: number; section: number; at: number };

export const PROGRESS_KEY = "isora.progress.v1";
export const PROGRESS_EVENT = "isora:progress";
export const LAST_KEY = "isora.last.v1";
export const LAST_EVENT = "isora:last";

/** Almacén sencillo en localStorage con caché (para useSyncExternalStore). */
function createStore<T>(key: string, event: string, empty: T) {
  let cacheRaw: string | null = null;
  let cache: T = empty;
  const snapshot = (): T => {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(key);
    } catch {
      return empty;
    }
    if (raw !== cacheRaw) {
      cacheRaw = raw;
      try {
        cache = raw ? (JSON.parse(raw) as T) : empty;
      } catch {
        cache = empty;
      }
    }
    return cache;
  };
  const save = (value: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* sin almacenamiento */
    }
    window.dispatchEvent(new Event(event));
  };
  const subscribe = (cb: () => void) => {
    window.addEventListener(event, cb);
    window.addEventListener("storage", cb);
    return () => {
      window.removeEventListener(event, cb);
      window.removeEventListener("storage", cb);
    };
  };
  return { snapshot, save, subscribe, empty };
}

const EMPTY: Progress = {};
const progressStore = createStore<Progress>(PROGRESS_KEY, PROGRESS_EVENT, EMPTY);
const lastStore = createStore<LastVisit | null>(LAST_KEY, LAST_EVENT, null);

export function useProgress() {
  const progress = useSyncExternalStore(progressStore.subscribe, progressStore.snapshot, () => EMPTY);

  const markUnit = useCallback((key: string, score: number, total: number) => {
    const all = progressStore.snapshot();
    progressStore.save({ ...all, [key]: { ...all[key], completed: true, score, total, at: Date.now() } });
  }, []);

  const markSection = useCallback((key: string, section: string) => {
    const all = progressStore.snapshot();
    const seen = all[key]?.sections ?? [];
    if (seen.includes(section)) return;
    progressStore.save({ ...all, [key]: { ...all[key], sections: [...seen, section], at: Date.now() } });
  }, []);

  return { progress, markUnit, markSection };
}

export function useLastVisit() {
  const last = useSyncExternalStore(lastStore.subscribe, lastStore.snapshot, () => null);
  const setLast = useCallback((level: string, number: number, section: number) => {
    const cur = lastStore.snapshot();
    if (cur && cur.level === level && cur.number === number && cur.section === section) return;
    lastStore.save({ level, number, section, at: Date.now() });
  }, []);
  return { last, setLast };
}

export const unitKey = (lang: string, level: string, n: number) => `${lang}/${level}/${n}`;

/** Porcentaje de una unidad: 6 secciones vistas + ejercicios terminados. */
export function unitPercent(p: UnitProgress | undefined, sections = 6) {
  if (!p) return 0;
  const seen = Math.min(p.sections?.length ?? 0, sections);
  return Math.round(((seen + (p.completed ? 2 : 0)) / (sections + 2)) * 100);
}
