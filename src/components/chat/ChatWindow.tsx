"use client";

import { useEffect, useRef, useState } from "react";
import { MAX_LEN, markRead, sendMessage, subscribeMessages, type ChatMessage } from "@/lib/chat";

const time = (d: Date | null) =>
  d ? d.toLocaleString("de-DE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "…";

/** Conversación entre un estudiante y la Lehrkraft (la usan las dos vistas). */
export function ChatWindow({
  studentId,
  as,
  who,
  suggestions = [],
  empty,
}: {
  studentId: string;
  as: "student" | "teacher";
  who: { name: string; email?: string };
  suggestions?: string[];
  empty?: React.ReactNode;
}) {
  const [messages, setMessages] = useState<ChatMessage[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const off = subscribeMessages(
      studentId,
      (m) => {
        setMessages(m);
        if (m.length) markRead(studentId, as);
      },
      (e) => setError(e.message),
    );
    return off;
  }, [studentId, as]);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages?.length]);

  const send = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      await sendMessage(studentId, as, text, who);
      setText("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-[560px] flex-col overflow-hidden rounded-[2rem] border border-line bg-paper">
      <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
        {messages === null && !error && <p className="text-center text-sm text-muted">…</p>}
        {messages?.length === 0 && empty}
        {messages?.map((m) => {
          const mine = m.from === as;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[82%] rounded-2xl px-4 py-2.5 ${mine ? "rounded-br-md bg-wine-soft" : "rounded-bl-md border border-latte/60 bg-sand"}`}>
                <p className={`text-xs font-semibold ${mine ? "text-wine" : "text-cocoa"}`}>{m.from === "teacher" ? "🧑‍🏫 Lehrkraft" : m.name || "Student"}</p>
                <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-ink">{m.text}</p>
                <p className="mt-1 text-right text-[10px] text-muted">{time(m.createdAt)}</p>
              </div>
            </div>
          );
        })}
        {error && (
          <p className="rounded-xl bg-wine-soft px-3 py-2 text-sm text-wine">
            Der Chat ist gerade nicht erreichbar. ({error.includes("permission") ? "Keine Berechtigung" : error})
          </p>
        )}
        <div ref={end} />
      </div>

      {suggestions.length > 0 && !text && (
        <div className="flex gap-2 overflow-x-auto border-t border-line px-4 py-2">
          {suggestions.map((s) => (
            <button key={s} type="button" onClick={() => setText(s)} className="shrink-0 rounded-full border border-line bg-cream px-3 py-1 text-xs text-cocoa hover:border-cocoa-light">
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        className="flex items-end gap-2 border-t border-line bg-cream/60 p-3"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_LEN))}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          rows={2}
          placeholder={as === "teacher" ? "Antwort schreiben …" : "Schreib deine Frage …"}
          className="min-h-[48px] flex-1 resize-none rounded-2xl border border-line bg-paper px-4 py-2.5 text-[15px] text-ink outline-none focus:border-wine/60"
        />
        <button type="submit" disabled={!text.trim() || sending} className="h-12 shrink-0 rounded-full bg-wine px-5 text-sm font-medium text-cream transition hover:bg-wine-light disabled:opacity-40">
          {sending ? "…" : "Senden"}
        </button>
      </form>
    </div>
  );
}
