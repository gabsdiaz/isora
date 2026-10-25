"use client";

import { ChatWindow } from "@/components/chat/ChatWindow";
import { TeacherTabs } from "@/components/chat/TeacherTabs";
import { firebaseEnabled } from "@/lib/firebase";
import { useT } from "@/lib/i18n";
import { useSession } from "@/lib/session";

const SUGGESTIONS = [
  "Ich habe eine Frage zu Einheit …",
  "Was ist der Unterschied zwischen … und …?",
  "Kannst du meinen Text korrigieren?",
  "Wie spricht man … aus?",
];

/** Chat del estudiante con una Lehrkraft. */
export default function Chat() {
  const { g, t } = useT();
  const { user } = useSession();
  const online = firebaseEnabled && user && user.uid !== "demo";

  return (
    <div>
      <TeacherTabs />
      <p className="text-sm text-muted">{t("chatTitle")}</p>
      <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">{g("chatTitle")}</h1>
      <p className="mt-2 max-w-2xl text-cocoa">{g("chatBody")}</p>
      <p className="mt-1 max-w-2xl text-sm italic text-muted">{t("chatBody")}</p>

      <div className="mt-6">
        {online ? (
          <ChatWindow
            studentId={user.uid}
            as="student"
            who={{ name: user.name, email: user.email }}
            suggestions={SUGGESTIONS}
            empty={
              <div className="mx-auto max-w-sm py-10 text-center">
                <p className="text-4xl">💬</p>
                <p className="mt-2 font-display text-xl text-wine">Noch keine Nachrichten</p>
                <p className="mt-1 text-sm text-muted">Schreib deine erste Frage – auf Deutsch oder in deiner Sprache.</p>
              </div>
            }
          />
        ) : (
          <div className="rounded-[2rem] border border-dashed border-line bg-paper/70 p-8 text-center">
            <p className="text-4xl">🔒</p>
            <p className="mt-2 font-display text-xl text-wine">{g("chatLogin")}</p>
            <p className="mt-1 text-sm text-muted">{t("chatLogin")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
