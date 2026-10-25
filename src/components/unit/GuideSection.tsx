"use client";

import { guides } from "@/content/generated/media";
import { useT } from "@/lib/i18n";
import { Translatable } from "../german/Translatable";

const GUIDE_BODY = {
  de: "Drucke das Arbeitsblatt aus und löse die Aufgaben auf Papier. Die Lösungen sind auf der letzten Seite.",
  es: "Imprime la guía y resuelve los ejercicios en papel. Las soluciones están en la última página.",
  en: "Print the worksheet and solve the tasks on paper. The answers are on the last page.",
};

export function GuideSection({ mediaKey, title }: { mediaKey: string; title: string }) {
  const { g } = useT();
  const info = guides[mediaKey];
  return (
    <section className="flex flex-col items-center rounded-3xl border border-line bg-paper p-8 text-center sm:flex-row sm:items-start sm:text-left">
      <div className="mb-5 flex h-32 w-24 shrink-0 flex-col justify-between rounded-lg border border-line bg-cream p-3 shadow-md shadow-cocoa/10 sm:mb-0 sm:mr-8" aria-hidden="true">
        <span className="h-1.5 w-10 rounded bg-wine" />
        <span className="space-y-1.5">
          <span className="block h-1 w-14 rounded bg-line" />
          <span className="block h-1 w-10 rounded bg-line" />
          <span className="block h-1 w-12 rounded bg-line" />
          <span className="block h-1 w-9 rounded bg-line" />
        </span>
        <span className="text-[10px] font-semibold text-wine">PDF</span>
      </div>
      <div className="flex-1">
        <h2 className="text-2xl font-semibold">
          {g("secGuide")}: {title}
        </h2>
        {info ? (
          <>
            <Translatable de={GUIDE_BODY.de} tr={GUIDE_BODY} className="mt-2" textClassName="text-ink/75" />
            <a
              href={`/guides/${mediaKey}.pdf`}
              download
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-wine px-5 py-2.5 text-sm font-medium text-cream hover:bg-wine-light"
            >
              ↓ {g("downloadPdf")} <span className="text-cream/70">· {info.pages} {g("pages")}</span>
            </a>
          </>
        ) : (
          <>
            <p className="mt-2 text-ink/75">{g("guideSoon")}</p>
            <span className="mt-5 inline-block rounded-full border border-line px-5 py-2.5 text-sm text-muted">{g("comingSoon")}</span>
          </>
        )}
      </div>
    </section>
  );
}
