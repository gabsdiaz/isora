"use client";

import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { getFirebase } from "./firebase";

/**
 * Lo que la Lehrkraft configura para cada canción (Firestore: songs/{id}):
 *  - spotify: URI de la versión elegida (spotify:track:…)
 *  - timings: inicio de cada línea en milisegundos (para el modo karaoke)
 * Sin Firebase (modo demo) se guarda en el navegador.
 */
export type SongConfig = { spotify?: string; timings?: number[]; by?: string };
const LOCAL = "isora.songs.v1";

function readLocal(): Record<string, SongConfig> {
  try {
    return JSON.parse(localStorage.getItem(LOCAL) ?? "{}");
  } catch {
    return {};
  }
}

export async function fetchSongConfigs(): Promise<Record<string, SongConfig>> {
  const { db } = getFirebase();
  if (!db) return readLocal();
  try {
    const snap = await getDocs(collection(db, "songs"));
    const out: Record<string, SongConfig> = {};
    snap.forEach((d) => (out[d.id] = d.data() as SongConfig));
    return out;
  } catch {
    return {};
  }
}

export async function fetchSongConfig(id: string): Promise<SongConfig> {
  const { db } = getFirebase();
  if (!db) return readLocal()[id] ?? {};
  try {
    const snap = await getDoc(doc(db, "songs", id));
    return (snap.data() as SongConfig | undefined) ?? {};
  } catch {
    return {};
  }
}

/** Guarda la configuración. Devuelve "denied" si la cuenta no es de una Lehrkraft (firestore.rules). */
export async function saveSongConfig(id: string, cfg: SongConfig, by: string): Promise<"ok" | "denied" | "error"> {
  const { db } = getFirebase();
  if (!db) {
    try {
      localStorage.setItem(LOCAL, JSON.stringify({ ...readLocal(), [id]: { ...cfg, by } }));
      return "ok";
    } catch {
      return "error";
    }
  }
  try {
    const clean = JSON.parse(JSON.stringify(cfg)) as SongConfig;
    await setDoc(doc(db, "songs", id), { ...clean, by, updatedAt: serverTimestamp() }, { merge: true });
    return "ok";
  } catch (e) {
    return (e as { code?: string }).code === "permission-denied" ? "denied" : "error";
  }
}

export function useSongConfig(id: string) {
  const [config, setConfig] = useState<SongConfig | null>(null);
  useEffect(() => {
    let alive = true;
    fetchSongConfig(id).then((c) => alive && setConfig(c));
    return () => {
      alive = false;
    };
  }, [id]);
  const update = useCallback((c: SongConfig) => setConfig(c), []);
  return { config, update };
}

export function useSongConfigs() {
  const [configs, setConfigs] = useState<Record<string, SongConfig> | null>(null);
  useEffect(() => {
    let alive = true;
    fetchSongConfigs().then((c) => alive && setConfigs(c));
    return () => {
      alive = false;
    };
  }, []);
  return configs;
}
