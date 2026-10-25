/**
 * Pronunciación.
 * 1) Usa los audios pregrabados con voz neural (public/audio/<clave>.mp3).
 * 2) Si un audio no existe todavía, usa la voz del navegador como respaldo.
 */
import type { Voice } from "@/content/types";

/** Normaliza el texto igual que el generador de audios (scripts/gen_audio.py). */
export function normalizeSpeech(text: string) {
  return text
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Hash cyrb53 → base36. Debe coincidir con la versión en Python. */
export function audioKey(text: string, voice: Voice = "m") {
  const str = `${voice}|${normalizeSpeech(text)}`;
  let h1 = 0xdeadbeef ^ 0;
  let h2 = 0x41c6ce57 ^ 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

let current: HTMLAudioElement | null = null;

/** Elige la voz alemana más natural del navegador (Edge "Natural", Google Deutsch, voces Premium de Apple…) */
const PREFERRED = [/natural/i, /google deutsch/i, /premium|enhanced|erweitert/i, /anna|petra|helena|katja|conrad|markus|yannick/i];
const MALE = /conrad|markus|yannick|stefan|killian|männlich|male/i;

function pickVoice(voice: Voice) {
  const all = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith("de"));
  const byGender = all.filter((v) => (voice === "m" ? MALE.test(v.name) : !MALE.test(v.name)));
  const pool = byGender.length ? byGender : all;
  for (const re of PREFERRED) {
    const hit = pool.find((v) => re.test(v.name));
    if (hit) return hit;
  }
  return pool[0];
}

function browserSpeak(text: string, voice: Voice = "m"): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return resolve();
    const synth = window.speechSynthesis;
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(normalizeSpeech(text).replace(/…/g, ""));
    utter.lang = "de-DE";
    utter.rate = 0.9;
    const v = pickVoice(voice);
    if (v) utter.voice = v;
    utter.onend = () => resolve();
    utter.onerror = () => resolve();
    synth.speak(utter);
  });
}

/** Reproduce el texto; la promesa se resuelve cuando termina el audio. */
export function speakGerman(text: string, voice: Voice = "m"): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  current?.pause();
  window.speechSynthesis?.cancel();
  const audio = new Audio(`/audio/${audioKey(text, voice)}.mp3`);
  current = audio;
  return new Promise((resolve) => {
    let settled = false;
    const done = () => {
      if (!settled) {
        settled = true;
        resolve();
      }
    };
    let fellBack = false;
    const fallback = () => {
      if (fellBack || current !== audio) return done();
      fellBack = true;
      browserSpeak(text, voice).then(done);
    };
    audio.onended = done;
    audio.onpause = () => current !== audio && done();
    audio.onerror = fallback;
    audio.play().catch((err: DOMException) => {
      if (err?.name === "NotAllowedError" || err?.name === "AbortError") done();
      else fallback();
    });
  });
}
