"use client";

import { useState } from "react";
import type { Tr } from "@/content/types";
import { useT } from "@/lib/i18n";
import { GermanText } from "./Gloss";

/** Botón pequeño para mostrar/ocultar la traducción */
export function TranslateToggle({ open, onClick, className = "" }: { open: boolean; onClick: () => void; className?: string }) {
  const { g, t } = useT();
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-pressed={open}
      aria-label={t("translate")}
      title={g("translate")}
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold transition ${
        open ? "border-wine bg-wine text-cream" : "border-line bg-paper text-muted hover:border-cocoa-light hover:text-cocoa"
      } ${className}`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m5 8 6 6" />
        <path d="m4 14 6-6 2-3" />
        <path d="M2 5h12" />
        <path d="M7 2h1" />
        <path d="m22 22-5-10-5 10" />
        <path d="M14 18h6" />
      </svg>
    </button>
  );
}

/** Texto alemán (palabras tocables) + traducción completa al pedirla */
export function Translatable({
  de,
  tr,
  unitKey,
  as = "p",
  className = "",
  textClassName = "",
}: {
  de: string;
  tr: Tr;
  unitKey?: string;
  as?: "p" | "h1" | "h2" | "h3" | "div";
  className?: string;
  textClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const { loc } = useT();
  const Tag = as;
  return (
    <div className={`group ${className}`}>
      <div className="flex items-start gap-2">
        <Tag className={`min-w-0 flex-1 ${textClassName}`}>
          <GermanText text={de} unitKey={unitKey} />
        </Tag>
        <TranslateToggle open={open} onClick={() => setOpen((o) => !o)} className="mt-0.5" />
      </div>
      {open && <p className="mt-1.5 border-l-2 border-gold/60 pl-3 text-[15px] italic leading-relaxed text-muted">{loc(tr)}</p>}
    </div>
  );
}
