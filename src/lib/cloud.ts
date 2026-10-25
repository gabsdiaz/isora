"use client";

import { useEffect } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { firebaseEnabled, getFirebase } from "./firebase";
import { LAST_EVENT, LAST_KEY, PROGRESS_EVENT, PROGRESS_KEY, type LastVisit, type Progress } from "./progress";
import { CARDS_EVENT, CARDS_KEY, type Card } from "./flashcards";

/**
 * Guarda el progreso, las flashcards y "dónde quedé" en Firestore
 * (users/{uid}/data/state) para tenerlos en todos los dispositivos.
 * Al iniciar sesión se mezclan los datos de la nube con los del navegador.
 */
type Deck = Record<string, Card>;

function read<T>(key: string, empty: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : empty;
  } catch {
    return empty;
  }
}
function write(key: string, event: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* sin almacenamiento */
  }
  window.dispatchEvent(new Event(event));
}
const parse = <T,>(raw: unknown, empty: T): T => {
  try {
    return typeof raw === "string" ? (JSON.parse(raw) as T) ?? empty : empty;
  } catch {
    return empty;
  }
};

function mergeProgress(a: Progress, b: Progress): Progress {
  const out: Progress = { ...b, ...a };
  for (const k of Object.keys(b)) {
    if (!a[k]) continue;
    const x = a[k];
    const y = b[k];
    out[k] = {
      completed: Boolean(x.completed || y.completed),
      score: Math.max(x.score ?? 0, y.score ?? 0) || undefined,
      total: x.total ?? y.total,
      sections: Array.from(new Set([...(x.sections ?? []), ...(y.sections ?? [])])),
      at: Math.max(x.at ?? 0, y.at ?? 0) || undefined,
    };
  }
  return out;
}

function mergeCards(a: Deck, b: Deck): Deck {
  const out: Deck = { ...b, ...a };
  for (const k of Object.keys(b)) if (a[k] && b[k].reviews > a[k].reviews) out[k] = b[k];
  return out;
}

const mergeLast = (a: LastVisit | null, b: LastVisit | null) => (!a ? b : !b ? a : a.at >= b.at ? a : b);

export function useCloudSync(uid: string | undefined) {
  useEffect(() => {
    if (!firebaseEnabled || !uid || uid === "demo") return;
    const { db } = getFirebase();
    if (!db) return;
    const ref = doc(db, "users", uid, "data", "state");
    let ready = false;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const upload = () =>
      setDoc(ref, {
        progress: JSON.stringify(read<Progress>(PROGRESS_KEY, {})),
        cards: JSON.stringify(read<Deck>(CARDS_KEY, {})),
        last: JSON.stringify(read<LastVisit | null>(LAST_KEY, null)),
        updatedAt: serverTimestamp(),
      }).catch(() => undefined);
    const push = () => {
      if (!ready) return;
      clearTimeout(timer);
      timer = setTimeout(upload, 2500);
    };
    const flush = () => {
      if (ready && timer) {
        clearTimeout(timer);
        timer = undefined;
        upload();
      }
    };

    (async () => {
      try {
        const remote = (await getDoc(ref)).data();
        if (remote && !stopped) {
          write(PROGRESS_KEY, PROGRESS_EVENT, mergeProgress(read<Progress>(PROGRESS_KEY, {}), parse<Progress>(remote.progress, {})));
          write(CARDS_KEY, CARDS_EVENT, mergeCards(read<Deck>(CARDS_KEY, {}), parse<Deck>(remote.cards, {})));
          write(LAST_KEY, LAST_EVENT, mergeLast(read<LastVisit | null>(LAST_KEY, null), parse<LastVisit | null>(remote.last, null)));
        }
      } catch {
        /* sin conexión: seguimos con los datos del navegador */
      }
      if (stopped) return;
      ready = true;
      push();
    })();

    const events = [PROGRESS_EVENT, CARDS_EVENT, LAST_EVENT];
    events.forEach((e) => window.addEventListener(e, push));
    window.addEventListener("pagehide", flush);
    return () => {
      stopped = true;
      flush();
      events.forEach((e) => window.removeEventListener(e, push));
      window.removeEventListener("pagehide", flush);
    };
  }, [uid]);
}
