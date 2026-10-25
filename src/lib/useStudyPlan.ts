"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useSession } from "./session";
import { useLevels } from "./levels";
import { createStore, useLastVisit, useProgress } from "./progress";
import { blockDone, buildPlan, buildWeek, WEEK, WEEK_VERSION, type Block, type Pace, type WeekPlan } from "./studyPlan";

/** La semana del plan se guarda al armarla, para ir marcando lo que el estudiante hace. */
const weekStore = createStore<WeekPlan | null>("isora.week.v1", "isora:week", null);

export function useStudyPlan(paceOverride?: Pace) {
  const { profile } = useSession();
  const { levels } = useLevels();
  const { progress } = useProgress();
  const { last } = useLastVisit();
  const [now] = useState(() => Date.now());
  const stored = useSyncExternalStore(weekStore.subscribe, weekStore.snapshot, () => null);

  const plan = useMemo(() => (profile ? buildPlan(profile, levels, progress, last, now, paceOverride) : null), [profile, levels, progress, last, now, paceOverride]);

  // Semana vigente: se rearma cada 7 días o cuando el estudiante cambia su ritmo o sus respuestas
  const fresh = Boolean(stored && stored.v === WEEK_VERSION && now - stored.weekStart < WEEK && stored.profileAt === (profile?.at ?? 0));
  const week = fresh ? stored : null;

  // Semana nueva: se arma con el avance de este momento y luego queda fija
  useEffect(() => {
    if (!profile || !plan || fresh) return;
    weekStore.save(buildWeek(plan, profile, levels, progress, now));
  }, [fresh, profile, plan, levels, progress, now]);

  const isDone = useCallback((b: Block) => Boolean(week && blockDone(b, progress, week.manual)), [week, progress]);
  const toggle = useCallback(
    (id: string) => {
      const w = weekStore.snapshot();
      if (w) weekStore.save({ ...w, manual: { ...w.manual, [id]: !w.manual[id] } });
    },
    [],
  );
  const replan = useCallback(() => {
    if (profile && plan) weekStore.save(buildWeek(plan, profile, levels, progress, Date.now()));
  }, [profile, plan, levels, progress]);

  const stats = useMemo(() => {
    const all = week?.days.flatMap((d) => d.blocks) ?? [];
    const done = all.filter((b) => isDone(b));
    return {
      total: all.length,
      done: done.length,
      minutes: all.reduce((a, b) => a + b.minutes, 0),
      doneMinutes: done.reduce((a, b) => a + b.minutes, 0),
    };
  }, [week, isDone]);

  return { plan, week, isDone, toggle, replan, stats, now };
}
