"use client";

import { useEffect, useState } from "react";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { subscribeInbox, type ChatThread } from "@/lib/chat";
import { firebaseEnabled } from "@/lib/firebase";
import { useSession } from "@/lib/session";

const when = (d: Date | null) => (d ? d.toLocaleString("de-DE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "");

/** Postfach de la Lehrkraft: todas las conversaciones (solo con permiso en firestore.rules). */
export default function TeacherInbox() {
  const { user } = useSession();
  const [threads, setThreads] = useState<ChatThread[] | null>(null);
  const [denied, setDenied] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const online = firebaseEnabled && user && user.uid !== "demo";

  useEffect(() => {
    if (!online) return;
    return subscribeInbox(setThreads, () => setDenied(true));
  }, [online]);

  if (!online || denied)
    return (
      <div className="rounded-[2rem] border border-dashed border-line bg-paper/70 p-8 text-center">
        <p className="text-4xl">🔒</p>
        <p className="mt-2 font-display text-xl text-wine">Nur für Lehrkräfte</p>
        <p className="mt-1 text-sm text-muted">Diese Seite ist für Lehrkräfte von Isora.</p>
      </div>
    );

  const current = threads?.find((t) => t.id === open);

  return (
    <div>
      <p className="text-sm text-muted">Lehrkraft</p>
      <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">Postfach 📬</h1>
      <p className="mt-2 text-cocoa">
        {threads?.length ?? 0} Gespräche · {threads?.filter((t) => t.unreadTeacher).length ?? 0} ungelesen
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-[300px_1fr]">
        <ul className={`space-y-2 ${current ? "hidden md:block" : ""}`}>
          {threads === null && <li className="text-sm text-muted">…</li>}
          {threads?.length === 0 && <li className="rounded-2xl border border-dashed border-line p-4 text-sm text-muted">Noch keine Nachrichten.</li>}
          {threads?.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => setOpen(t.id)}
                className={`w-full rounded-2xl border p-3 text-left transition ${t.id === open ? "border-wine bg-wine-soft/60" : "border-line bg-paper hover:border-cocoa-light"}`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium text-ink">{t.name || "Student"}</span>
                  {t.unreadTeacher && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-wine" aria-label="ungelesen" />}
                </span>
                <span className="block truncate text-sm text-cocoa">
                  {t.lastFrom === "teacher" ? "Du: " : ""}
                  {t.lastText}
                </span>
                <span className="block text-[11px] text-muted">
                  {t.email} · {when(t.updatedAt)}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className={current ? "" : "hidden md:block"}>
          {current ? (
            <>
              <button type="button" onClick={() => setOpen(null)} className="mb-2 text-sm text-muted hover:text-wine md:hidden">
                ← Postfach
              </button>
              <p className="mb-2 font-display text-xl text-wine">{current.name}</p>
              <ChatWindow key={current.id} studentId={current.id} as="teacher" who={{ name: "Lehrkraft" }} />
            </>
          ) : (
            <div className="flex h-[560px] items-center justify-center rounded-[2rem] border border-dashed border-line text-sm text-muted">Wähle ein Gespräch.</div>
          )}
        </div>
      </div>
    </div>
  );
}
