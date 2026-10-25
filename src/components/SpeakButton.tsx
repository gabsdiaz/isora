"use client";

import { speakGerman } from "@/lib/speech";
import { useT } from "@/lib/i18n";

export function SpeakButton({ text, className = "" }: { text: string; className?: string }) {
  const { t } = useT();
  return (
    <button
      type="button"
      onClick={() => speakGerman(text)}
      aria-label={`${t("listen")}: ${text}`}
      title={t("listen")}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-cocoa transition hover:border-wine-light hover:text-wine ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 5 6 9H2v6h4l5 4V5z" />
        <path d="M15.5 8.5a5 5 0 0 1 0 7" />
        <path d="M19 5a10 10 0 0 1 0 14" />
      </svg>
    </button>
  );
}
