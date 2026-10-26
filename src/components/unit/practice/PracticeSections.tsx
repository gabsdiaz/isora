"use client";

import { useState } from "react";
import type { TheoryBlock } from "@/content/types";
import type { Practice } from "@/content/de/practice";
import { useT } from "@/lib/i18n";
import { usePlaylist } from "@/lib/playlist";
import { speakGerman } from "@/lib/speech";
import { compareWords, useSpeechRecognition } from "@/lib/speechRecognition";
import { PlayerControls } from "../../PlayerControls";
import { AiCorrection } from "./AiCorrection";

/* ═══════════════ 🎧 Hören ═══════════════ */

export function ListeningSection({ practice, onDone }: { practice: Practice; onDone: (score: number, total: number) => void }) {
  const { g } = useT();
  const L = practice.listening;
  const player = usePlaylist();
  const [answers, setAnswers] = useState<(number | null)[]>(() => L.questions.map(() => null));
  const [showText, setShowText] = useState(false);
  const done = answers.every((a) => a !== null);
  const score = answers.filter((a, i) => a === L.questions[i].answer).length;

  const pick = (qi: number, oi: number) => {
    if (answers[qi] !== null) return;
    const next = answers.map((a, i) => (i === qi ? oi : a));
    setAnswers(next);
    if (next.every((a) => a !== null)) onDone(next.filter((a, i) => a === L.questions[i].answer).length, L.questions.length);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-start gap-4 rounded-[2rem] border border-latte/60 bg-sand p-6 sm:flex-row sm:items-center">
        <span className="text-5xl" aria-hidden="true">🎧</span>
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-wine">Hören</p>
          <p className="font-display text-2xl text-ink">{L.title}</p>
          <p className="text-sm text-cocoa">Hör zuerst gut zu – ohne Text. Dann beantworte die Fragen.</p>
        </div>
        <PlayerControls
          state={player.state}
          label={g("listen")}
          onPlay={() => player.play(L.lines.map((l, i) => ({ text: l.de, voice: l.voice, id: String(i) })))}
          onPause={player.pause}
          onResume={player.resume}
          onStop={player.stop}
        />
      </div>

      <ol className="space-y-4 rounded-[2rem] border border-line bg-paper p-6">
        {L.questions.map((q, qi) => (
          <li key={qi}>
            <p className="font-medium text-ink">
              {qi + 1}. {q.q}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {q.options.map((o, oi) => {
                const a = answers[qi];
                const cls =
                  a === null
                    ? "border-line bg-cream/60 hover:border-cocoa-light"
                    : oi === q.answer
                      ? "border-sage bg-sage-soft text-sage"
                      : oi === a
                        ? "border-wine/40 bg-wine-soft text-wine line-through"
                        : "border-line bg-cream/60 opacity-50";
                return (
                  <button key={oi} type="button" disabled={a !== null} onClick={() => pick(qi, oi)} className={`rounded-xl border px-3.5 py-2 text-sm transition ${cls}`}>
                    {o}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
        {done && (
          <p className="rounded-2xl bg-cream px-4 py-3 font-display text-xl text-wine">
            {score === L.questions.length ? "⭐⭐⭐ Perfekt!" : score >= 2 ? "⭐⭐ Sehr gut!" : "⭐ Hör noch einmal zu!"} {score}/{L.questions.length}
          </p>
        )}
      </ol>

      <div className="rounded-[2rem] border border-line bg-paper p-5">
        <button type="button" onClick={() => setShowText((v) => !v)} className="text-sm font-medium text-wine">
          {showText ? "▾ Text ausblenden" : "▸ Text anzeigen (Transkript)"}
        </button>
        {showText && (
          <div className="mt-3 space-y-2">
            {L.lines.map((l, i) => (
              <p key={i} className={`rounded-xl px-3 py-1.5 font-display text-[17px] ${player.currentId === String(i) ? "bg-gold/15" : ""}`}>
                {l.who && <b className="mr-2 font-sans text-sm text-cocoa">{l.who}:</b>}
                {l.de}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════ 🗣️ Sprechen ═══════════════ */

/** Frases para repetir: salen de las frases de la Erklärung. */
export function phrasesFrom(theory: TheoryBlock[]) {
  const out: string[] = [];
  for (const b of theory) if (b.type === "phrases") for (const it of b.items) if (it.de.split(" ").length >= 2 && it.de.length <= 60 && !it.de.includes("…")) out.push(it.de);
  return out.slice(0, 5);
}

function MicButton({ listening, onStart, onStop, size = "md" }: { listening: boolean; onStart: () => void; onStop: () => void; size?: "md" | "lg" }) {
  const dim = size === "lg" ? "h-16 w-16 text-2xl" : "h-11 w-11 text-lg";
  return (
    <button
      type="button"
      onClick={listening ? onStop : onStart}
      className={`relative flex shrink-0 items-center justify-center rounded-full ${dim} ${listening ? "bg-wine text-cream" : "border border-line bg-paper text-wine hover:border-wine/60"}`}
      aria-label={listening ? "Aufnahme stoppen" : "Sprechen"}
    >
      {listening && <span className="absolute inset-0 animate-ping rounded-full bg-wine/30" />}
      {listening ? "■" : "🎤"}
    </button>
  );
}

function RepeatLine({ text }: { text: string }) {
  const rec = useSpeechRecognition();
  const result = rec.transcript && !rec.listening ? compareWords(text, rec.transcript) : null;
  return (
    <li className="rounded-2xl border border-line bg-paper p-4">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => speakGerman(text)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream-deep text-lg text-cocoa hover:bg-sand-deep" aria-label="Anhören">
          🔊
        </button>
        <p className="min-w-0 flex-1 font-display text-[19px] text-ink">
          {result ? result.words.map((x, k) => <span key={k} className={x.ok ? "text-sage" : "text-wine underline decoration-wavy"}>{x.w} </span>) : text}
        </p>
        <MicButton listening={rec.listening} onStart={() => rec.start()} onStop={rec.stop} />
      </div>
      {rec.listening && <p className="mt-2 text-sm text-cocoa">🎙️ {rec.transcript || "Ich höre zu … sprich jetzt!"}</p>}
      {result && (
        <p className="mt-2 text-sm">
          <span className={result.score >= 80 ? "text-sage" : result.score >= 50 ? "text-gold" : "text-wine"}>
            {result.score >= 80 ? "⭐ Super ausgesprochen!" : result.score >= 50 ? "Fast! Hör noch einmal zu und versuch es wieder." : "Noch einmal – langsam und deutlich."} {result.score}%
          </span>
          <span className="ml-2 text-muted">· Gehört: „{rec.transcript}“</span>
        </p>
      )}
      {rec.error && rec.error !== "aborted" && <p className="mt-2 text-sm text-wine">{rec.error === "not-allowed" ? "Erlaube den Zugriff auf das Mikrofon." : `Fehler: ${rec.error}`}</p>}
    </li>
  );
}

function AnswerQuestion({ q, unitLabel, level }: { q: Practice["speaking"][number]; unitLabel: string; level: string }) {
  const { loc } = useT();
  const rec = useSpeechRecognition();
  return (
    <li className="rounded-[2rem] border border-line bg-paper p-5">
      <div className="flex items-start gap-3">
        <button type="button" onClick={() => speakGerman(q.de, "f")} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream-deep text-lg text-cocoa" aria-label="Anhören">
          🔊
        </button>
        <div className="flex-1">
          <p className="font-display text-xl text-ink">{q.de}</p>
          <p className="text-sm italic text-muted">{loc(q.tr)}</p>
        </div>
      </div>
      <div className="mt-4 flex items-start gap-3">
        <MicButton size="lg" listening={rec.listening} onStart={() => rec.start({ continuous: true })} onStop={rec.stop} />
        <textarea
          value={rec.transcript}
          onChange={(e) => rec.setTranscript(e.target.value)}
          rows={3}
          placeholder={rec.listening ? "Ich höre zu …" : "Tippe auf 🎤 und antworte laut (oder schreib hier)."}
          className="min-h-[64px] flex-1 resize-y rounded-2xl border border-line bg-cream/60 p-3 text-[16px] text-ink outline-none focus:border-wine/60"
        />
      </div>
      {!rec.listening && rec.transcript && <AiCorrection text={rec.transcript} task={q.de} kind="speaking" unitLabel={unitLabel} level={level} />}
    </li>
  );
}

export function SpeakingSection({ practice, phrases, unitLabel, level }: { practice: Practice; phrases: string[]; unitLabel: string; level: string }) {
  const rec = useSpeechRecognition();
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-[2rem] border border-latte/60 bg-sand p-6">
        <span className="text-5xl" aria-hidden="true">🗣️</span>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-wine">Sprechen</p>
          <p className="text-cocoa">Hör zu, sprich nach und antworte laut. Tippe auf 🎤, sprich und tippe wieder, wenn du fertig bist.</p>
        </div>
      </div>
      {!rec.supported && (
        <p className="rounded-2xl bg-yellow-soft/60 px-4 py-3 text-sm text-ink">
          Dein Browser erkennt keine Sprache. Öffne Isora in <b>Chrome</b> oder <b>Safari</b>, um zu sprechen. (Du kannst die Antworten auch schreiben.)
        </p>
      )}

      {phrases.length > 0 && (
        <section>
          <h3 className="mb-3 text-xl font-semibold">1. Nachsprechen</h3>
          <ul className="space-y-2">
            {phrases.map((p) => (
              <RepeatLine key={p} text={p} />
            ))}
          </ul>
        </section>
      )}

      <section>
        <h3 className="mb-3 text-xl font-semibold">2. Antworte laut</h3>
        <ul className="space-y-3">
          {practice.speaking.map((q) => (
            <AnswerQuestion key={q.de} q={q} unitLabel={unitLabel} level={level} />
          ))}
        </ul>
      </section>
    </div>
  );
}

/* ═══════════════ ✍️ Schreiben ═══════════════ */

export function WritingSection({ practice, unitKey, unitLabel, level }: { practice: Practice; unitKey: string; unitLabel: string; level: string }) {
  const { loc } = useT();
  const W = practice.writing;
  const draftKey = `isora.draft.${unitKey}`;
  const [text, setText] = useState(() => {
    try {
      return localStorage.getItem(draftKey) ?? "";
    } catch {
      return "";
    }
  });
  const [showModel, setShowModel] = useState(false);
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-5">
      <div className="rounded-[2rem] border border-latte/60 bg-sand p-6">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-wine">✍️ Schreiben</p>
        <p className="mt-1 font-display text-2xl text-ink">{W.prompt}</p>
        <p className="mt-1 text-sm italic text-muted">{loc(W.promptTr)}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {W.hints.map((h) => (
            <span key={h} className="rounded-full bg-paper px-2.5 py-1 text-xs text-cocoa">
              {h}
            </span>
          ))}
        </div>
      </div>
      <div className="rounded-[2rem] border border-line bg-paper p-5">
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            try {
              localStorage.setItem(draftKey, e.target.value);
            } catch {
              /* sin almacenamiento */
            }
          }}
          rows={7}
          placeholder="Schreib hier auf Deutsch …"
          className="w-full resize-y rounded-2xl border border-line bg-cream/60 p-4 text-[16px] leading-relaxed text-ink outline-none focus:border-wine/60"
        />
        <p className={`mt-2 text-sm ${words >= W.minWords ? "text-sage" : "text-muted"}`}>
          {words} Wörter {words >= W.minWords ? "✓" : `· mindestens ${W.minWords}`}
        </p>
        <AiCorrection text={text} task={W.prompt} kind="writing" unitLabel={unitLabel} level={level} />
      </div>
      <div className="rounded-[2rem] border border-line bg-paper p-5">
        <button type="button" onClick={() => setShowModel((v) => !v)} className="text-sm font-medium text-wine">
          {showModel ? "▾ Mustertext ausblenden" : "▸ Mustertext ansehen"}
        </button>
        {showModel && <p className="mt-3 rounded-2xl bg-cream/70 p-4 font-display text-[17px] italic leading-relaxed text-ink">{W.model}</p>}
      </div>
    </div>
  );
}
