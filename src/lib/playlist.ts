"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { Voice } from "@/content/types";
import { isSpeechPaused, pauseSpeech, resumeSpeech, speakGerman, stopSpeech } from "./speech";

export type PlaylistItem = { text: string; voice: Voice; id?: string };
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Reproduce varias frases seguidas con pausa, continuar y parar. */
export function usePlaylist() {
  const [state, setState] = useState<"idle" | "playing" | "paused">("idle");
  const [currentId, setCurrentId] = useState<string | null>(null);
  const cancel = useRef(false);

  // Al salir de la página (Next.js la oculta sin desmontarla) se detiene el audio
  useLayoutEffect(
    () => () => {
      cancel.current = true;
      stopSpeech();
    },
    [],
  );

  const play = useCallback(async (items: PlaylistItem[], onLine?: (id: string | undefined) => void) => {
    cancel.current = false;
    setState("playing");
    for (const item of items) {
      if (cancel.current) break;
      setCurrentId(item.id ?? null);
      onLine?.(item.id);
      await speakGerman(item.text, item.voice);
      await sleep(300);
      while (isSpeechPaused() && !cancel.current) await sleep(150);
    }
    if (!cancel.current) {
      setState("idle");
      setCurrentId(null);
    }
  }, []);

  const pause = useCallback(() => {
    pauseSpeech();
    setState("paused");
  }, []);
  const resume = useCallback(() => {
    resumeSpeech();
    setState("playing");
  }, []);
  const stop = useCallback(() => {
    cancel.current = true;
    stopSpeech();
    setState("idle");
    setCurrentId(null);
  }, []);

  return { state, currentId, play, pause, resume, stop };
}
