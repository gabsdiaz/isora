"use client";

import { getFirebase } from "./firebase";

export type Correction = {
  corrected: string;
  score: number;
  taskDone: boolean;
  summary: string;
  errors: { original: string; correction: string; explanation: string; type: string }[];
  tip: string;
  remaining?: number;
};

export type CorrectionError = "not-configured" | "unauthorized" | "limit" | "empty" | "ai-failed" | "ai-format" | "network";

/** Pide la corrección con IA al servidor de Isora. */
export async function requestCorrection(input: { text: string; task: string; level: string; kind: "writing" | "speaking"; lang: "es" | "en" }): Promise<{ ok: true; data: Correction } | { ok: false; error: CorrectionError }> {
  const { auth } = getFirebase();
  const token = await auth?.currentUser?.getIdToken().catch(() => null);
  try {
    const r = await fetch("/api/correct", {
      method: "POST",
      headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(input),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return { ok: false, error: (j.error as CorrectionError) ?? "ai-failed" };
    return { ok: true, data: j as Correction };
  } catch {
    return { ok: false, error: "network" };
  }
}
