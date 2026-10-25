"use client";

import type { UnitContent } from "@/content/types";
import { useT } from "@/lib/i18n";

export function GuideSection({ guide }: { guide?: UnitContent["guide"] }) {
  const { t } = useT();
  return (
    <section className="flex flex-col items-center rounded-3xl border border-line bg-paper p-8 text-center sm:flex-row sm:text-left">
      <div className="mb-5 flex h-28 w-22 shrink-0 flex-col justify-between rounded-lg border border-line bg-cream p-3 shadow-md shadow-cocoa/10 sm:mb-0 sm:mr-8" aria-hidden="true">
        <span className="h-1.5 w-10 rounded bg-wine" />
        <span className="space-y-1.5">
          <span className="block h-1 w-12 rounded bg-line" />
          <span className="block h-1 w-9 rounded bg-line" />
          <span className="block h-1 w-11 rounded bg-line" />
        </span>
        <span className="text-[10px] font-semibold text-wine">PDF</span>
      </div>
      <div className="flex-1">
        <h2 className="text-2xl font-semibold">{t("secGuide")}</h2>
        <p className="mt-2 text-ink/75">{guide ? `${guide.pages ?? ""} ${guide.pages ? "págs." : ""}` : t("guideSoon")}</p>
        {guide ? (
          <a
            href={guide.href}
            download
            className="mt-5 inline-block rounded-full bg-wine px-5 py-2.5 text-sm font-medium text-cream hover:bg-wine-light"
          >
            ↓ {t("downloadPdf")}
          </a>
        ) : (
          <span className="mt-5 inline-block rounded-full border border-line px-5 py-2.5 text-sm text-muted">{t("comingSoon")}</span>
        )}
      </div>
    </section>
  );
}
