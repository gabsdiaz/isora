"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EXAMS, gateExam, levelLabel, LEVEL_ORDER, type LevelTag } from "@/content/de/exams";
import { useLevels } from "@/lib/levels";
import { useMounted } from "../games/shared";
import { ExamRunner, type ExamOutcome } from "./ExamRunner";

/** Página de un examen: guarda el resultado y abre los niveles que correspondan. */
export function TestView({ id }: { id: string }) {
  const mounted = useMounted();
  const router = useRouter();
  const { savePlacement, saveExam, unlock } = useLevels();
  const [round, setRound] = useState(0);
  const gateLevel = id.startsWith("zugang-") ? (id.slice(7) as LevelTag) : null;
  const exam = gateLevel ? gateExam(gateLevel) : EXAMS[id];
  if (!exam) return null;
  const mode = id === "einstufung" ? "placement" : "pass";

  const onFinish = (o: ExamOutcome) => {
    if (mode === "placement") {
      savePlacement(o.start!, o.sections as Record<string, number>);
      return;
    }
    saveExam(exam.id, { score: o.score, passed: o.passed, at: Date.now(), sections: o.sections as Record<string, number> });
    if (o.passed && gateLevel) unlock([gateLevel]);
    if (o.passed && exam.id === "abschluss-a1-1") unlock(["a1-2"]);
  };

  const btn = "rounded-full px-5 py-2.5 text-sm font-medium transition";
  const actions = (o: ExamOutcome) => {
    if (mode === "placement")
      return (
        <>
          <button type="button" onClick={() => router.push(`/aprender/de/${o.start}`)} className={`${btn} bg-wine text-cream hover:bg-wine-light`}>
            Mit {levelLabel(o.start!)} starten →
          </button>
          {o.start !== "a1-1" && (
            <Link href="/aprender/de/a1-1/1" className={`${btn} border border-cocoa/30 bg-paper text-cocoa`}>
              Lieber von Anfang an (A1.1)
            </Link>
          )}
        </>
      );
    const target = gateLevel ?? (exam.id === "abschluss-a1-1" ? "a1-2" : null);
    return (
      <>
        {o.passed && target && (
          <Link href={`/aprender/de/${target}`} className={`${btn} bg-wine text-cream hover:bg-wine-light`}>
            🔓 Zu {levelLabel(target)} →
          </Link>
        )}
        {!o.passed && (
          <button type="button" onClick={() => setRound((r) => r + 1)} className={`${btn} bg-wine text-cream hover:bg-wine-light`}>
            Noch einmal versuchen
          </button>
        )}
        {!o.passed && gateLevel && (
          <Link href={`/aprender/de/${LEVEL_ORDER[LEVEL_ORDER.indexOf(gateLevel) - 1]}`} className={`${btn} border border-cocoa/30 bg-paper text-cocoa`}>
            Erst wiederholen
          </Link>
        )}
        <Link href="/aprender" className={`${btn} border border-cocoa/30 bg-paper text-cocoa`}>
          Zur Startseite
        </Link>
      </>
    );
  };

  return (
    <div>
      <Link href="/aprender" className="text-sm text-muted hover:text-wine">
        ← Startseite
      </Link>
      <div className="mt-4">
        {mounted ? (
          <ExamRunner key={round} exam={exam} mode={mode} onFinish={onFinish} actions={actions} />
        ) : (
          <div className="mx-auto h-96 max-w-2xl animate-pulse rounded-[2rem] bg-cream-deep/60" />
        )}
      </div>
    </div>
  );
}
