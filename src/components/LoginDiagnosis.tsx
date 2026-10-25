"use client";

import { useEffect, useState } from "react";
import { firebaseApiKey } from "@/lib/firebase";

type Row = { label: string; result: string; ok: boolean | null };

const timeout = <T,>(p: Promise<T>, ms: number) => Promise.race([p, new Promise<"timeout">((r) => setTimeout(() => r("timeout"), ms))]);

async function checkFetch(url: string) {
  const t0 = performance.now();
  try {
    // no-cors: solo nos interesa si el servidor contesta
    const r = await timeout(fetch(url, { cache: "no-store", mode: "no-cors" }), 8000);
    const ms = Math.round(performance.now() - t0);
    if (r === "timeout") return { result: "sin respuesta (8 s)", ok: false };
    return { result: `responde en ${ms} ms`, ok: true };
  } catch (e) {
    return { result: `bloqueado (${(e as Error).message})`, ok: false };
  }
}

async function checkIndexedDB() {
  try {
    const r = await timeout(
      new Promise<string>((resolve, reject) => {
        const req = indexedDB.open("isora-test");
        req.onsuccess = () => {
          req.result.close();
          resolve("ok");
        };
        req.onerror = () => reject(req.error);
      }),
      3000,
    );
    return r === "timeout" ? { result: "se cuelga", ok: false } : { result: "ok", ok: true };
  } catch (e) {
    return { result: `error (${(e as Error).message})`, ok: false };
  }
}

/** Diagnóstico del inicio de sesión: se muestra si el login falla, para saber exactamente qué bloquea. */
export function LoginDiagnosis() {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => {
    let alive = true;
    (async () => {
      const out: Row[] = [];
      const push = (label: string, r: { result: string; ok: boolean | null }) => {
        out.push({ label, ...r });
        if (alive) setRows([...out]);
      };
      push("Conexión", { result: navigator.onLine ? "en línea" : "sin conexión", ok: navigator.onLine });
      push("Servidor de login (identitytoolkit)", await checkFetch(`https://identitytoolkit.googleapis.com/v1/projects?key=${firebaseApiKey}`));
      push("Servidor de sesiones (securetoken)", await checkFetch(`https://securetoken.googleapis.com/v1/token?key=${firebaseApiKey}`));
      push("Base de datos (firestore)", await checkFetch("https://firestore.googleapis.com/"));
      push("Almacenamiento (IndexedDB)", await checkIndexedDB());
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="mt-2 w-full max-w-sm rounded-2xl border border-line bg-paper p-4 text-left">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">Diagnóstico · mándale una captura a soporte</p>
      <ul className="mt-2 space-y-1 text-xs">
        {rows.map((r) => (
          <li key={r.label} className="flex justify-between gap-3">
            <span className="text-cocoa">{r.label}</span>
            <span className={r.ok ? "text-sage" : "text-wine"}>
              {r.ok ? "✓" : "✗"} {r.result}
            </span>
          </li>
        ))}
        {rows.length < 5 && <li className="text-muted">Revisando…</li>}
      </ul>
    </div>
  );
}
