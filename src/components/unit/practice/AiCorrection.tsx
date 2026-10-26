"use client";

import { useState } from "react";
import { requestCorrection, type Correction, type CorrectionError } from "@/lib/correct";
import { sendMessage } from "@/lib/chat";
import { firebaseEnabled } from "@/lib/firebase";
import { useT } from "@/lib/i18n";
import { useSession } from "@/lib/session";

const ERR: Record<CorrectionError, { es: string; en: string }> = {
  "not-configured": {
    es: "La corrección con IA se activa muy pronto. Mientras tanto, compara con el texto modelo o envíaselo a la Lehrkraft.",
    en: "AI correction is coming very soon. Meanwhile, compare with the model text or send it to the teacher.",
  },
  unauthorized: { es: "Inicia sesión con Google para usar la corrección con IA.", en: "Sign in with Google to use AI correction." },
  limit: { es: "Llegaste al límite de correcciones de hoy. ¡Vuelve mañana!", en: "You've reached today's correction limit. Come back tomorrow!" },
  empty: { es: "Escribe un poco más antes de corregir.", en: "Write a bit more before correcting." },
  "ai-failed": { es: "La corrección no funcionó esta vez. Intenta de nuevo en un momento.", en: "The correction didn't work this time. Try again in a moment." },
  "ai-format": { es: "La corrección no funcionó esta vez. Intenta de nuevo.", en: "The correction didn't work this time. Try again." },
  network: { es: "Sin conexión. Revisa tu internet e intenta de nuevo.", en: "No connection. Check your internet and try again." },
};

const TYPE: Record<string, string> = { grammar: "Grammatik", spelling: "Rechtschreibung", "word-order": "Wortstellung", vocabulary: "Wortschatz" };

/** Botones "Mit KI korrigieren" y "An die Lehrkraft schicken" + resultado de la corrección. */
export function AiCorrection({ text, task, kind, unitLabel, level = "A1.1" }: { text: string; task: string; kind: "writing" | "speaking"; unitLabel: string; level?: string }) {
  const { lang } = useT();
  const { user } = useSession();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Correction | null>(null);
  const [error, setError] = useState<CorrectionError | null>(null);
  const [sent, setSent] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const canTeacher = firebaseEnabled && user && user.uid !== "demo";

  const correct = async () => {
    setBusy(true);
    setError(null);
    const r = await requestCorrection({ text, task, level, kind, lang });
    setBusy(false);
    if (r.ok) setResult(r.data);
    else setError(r.error);
  };

  const toTeacher = async () => {
    if (!user) return;
    setSent("sending");
    try {
      await sendMessage(user.uid, "student", `${kind === "writing" ? "✍️ Schreibaufgabe" : "🗣️ Sprechaufgabe"} · ${unitLabel}\nAufgabe: ${task}\n\n${text}`, { name: user.name, email: user.email });
      setSent("sent");
    } catch {
      setSent("error");
    }
  };

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={correct} disabled={busy || text.trim().length < 3} className="rounded-full bg-wine px-5 py-2.5 text-sm font-medium text-cream transition hover:bg-wine-light disabled:opacity-40">
          {busy ? "✨ Korrigiere …" : "✨ Mit KI korrigieren"}
        </button>
        {canTeacher && (
          <button
            type="button"
            onClick={toTeacher}
            disabled={sent === "sending" || sent === "sent" || text.trim().length < 3}
            className="rounded-full border border-cocoa/30 bg-paper px-5 py-2.5 text-sm font-medium text-cocoa transition hover:border-cocoa disabled:opacity-50"
          >
            {sent === "sent" ? "✓ An die Lehrkraft geschickt" : sent === "sending" ? "…" : "🧑‍🏫 An die Lehrkraft schicken"}
          </button>
        )}
      </div>
      {sent === "sent" && <p className="mt-2 text-sm text-sage">Die Lehrkraft antwortet dir im Chat (Menü → Lehrkraft).</p>}
      {sent === "error" && <p className="mt-2 text-sm text-wine">No se pudo enviar. Intenta de nuevo.</p>}
      {error && <p className="mt-3 rounded-2xl bg-yellow-soft/60 px-4 py-3 text-sm text-ink">{lang === "en" ? ERR[error].en : ERR[error].es}</p>}

      {result && (
        <div className="mt-5 rounded-[2rem] border border-latte/60 bg-sand p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-display text-2xl text-wine">✨ Korrektur</p>
            <div className="flex items-center gap-2">
              {result.taskDone ? (
                <span className="rounded-full bg-sage-soft px-3 py-1 text-xs text-sage">✓ Aufgabe erfüllt</span>
              ) : (
                <span className="rounded-full bg-wine-soft px-3 py-1 text-xs text-wine">Aufgabe nicht ganz erfüllt</span>
              )}
              <span className="rounded-full bg-paper px-3 py-1 font-display text-lg text-ink">{result.score}/10</span>
            </div>
          </div>
          <p className="mt-3 text-cocoa">{result.summary}</p>

          <div className="mt-4 rounded-2xl bg-paper p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Korrigierte Version</p>
            <p className="mt-1 whitespace-pre-wrap font-display text-[17px] leading-relaxed text-ink">{result.corrected}</p>
          </div>

          {result.errors?.length > 0 && (
            <ul className="mt-4 space-y-2">
              {result.errors.map((e, k) => (
                <li key={k} className="rounded-2xl bg-paper px-4 py-3">
                  <p className="text-[15px]">
                    <span className="text-wine line-through decoration-wine/60">{e.original}</span> <span className="text-muted">→</span>{" "}
                    <span className="font-medium text-sage">{e.correction}</span>
                    <span className="ml-2 rounded-full bg-cream-deep px-2 py-0.5 text-[11px] text-cocoa">{TYPE[e.type] ?? e.type}</span>
                  </p>
                  <p className="mt-1 text-sm text-cocoa">{e.explanation}</p>
                </li>
              ))}
            </ul>
          )}
          {result.tip && <p className="mt-4 text-sm text-ink">💡 {result.tip}</p>}
          {typeof result.remaining === "number" && <p className="mt-3 text-xs text-muted">Heute noch {result.remaining} Korrekturen.</p>}
        </div>
      )}
    </div>
  );
}
