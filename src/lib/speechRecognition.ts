"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

/** Reconocimiento de voz del navegador (Chrome, Edge, Safari) en alemán. */
type Rec = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};
type RecCtor = new () => Rec;

const getCtor = (): RecCtor | null => {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecCtor; webkitSpeechRecognition?: RecCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
};
const noop = () => () => {};

export function useSpeechRecognition() {
  const supported = useSyncExternalStore(
    noop,
    () => Boolean(getCtor()),
    () => true,
  );
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const rec = useRef<Rec | null>(null);

  useEffect(() => () => rec.current?.abort(), []);

  const start = useCallback((opts: { continuous?: boolean } = {}) => {
    const Ctor = getCtor();
    if (!Ctor) return;
    rec.current?.abort();
    const r = new Ctor();
    r.lang = "de-DE";
    r.continuous = Boolean(opts.continuous);
    r.interimResults = true;
    let finalText = "";
    r.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) finalText += res[0].transcript + " ";
        else interim += res[0].transcript;
      }
      setTranscript((finalText + interim).trim());
    };
    r.onerror = (e) => setError(e.error);
    r.onend = () => setListening(false);
    rec.current = r;
    setTranscript("");
    setError(null);
    setListening(true);
    r.start();
  }, []);

  const stop = useCallback(() => rec.current?.stop(), []);

  return { supported, listening, transcript, setTranscript, error, start, stop };
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/ß/g, "ss")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);

/** Compara la frase objetivo con lo reconocido: qué palabras salieron bien (LCS). */
export function compareWords(target: string, heard: string) {
  const t = target.split(/\s+/).filter(Boolean);
  const tn = t.map((x) => norm(x).join(""));
  const h = norm(heard);
  const dp = Array.from({ length: tn.length + 1 }, () => new Array<number>(h.length + 1).fill(0));
  for (let i = tn.length - 1; i >= 0; i--)
    for (let j = h.length - 1; j >= 0; j--) dp[i][j] = tn[i] === h[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const ok = new Array<boolean>(tn.length).fill(false);
  let i = 0;
  let j = 0;
  while (i < tn.length && j < h.length) {
    if (tn[i] === h[j]) {
      ok[i] = true;
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  const words = t.map((w, k) => ({ w, ok: ok[k] || !tn[k] }));
  const score = Math.round((words.filter((x) => x.ok).length / Math.max(words.length, 1)) * 100);
  return { words, score };
}
