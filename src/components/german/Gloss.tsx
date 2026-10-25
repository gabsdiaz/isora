"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { lookup, maxPhraseWords, type Gloss } from "@/content/de/dictionary";
import { useT } from "@/lib/i18n";
import { speakGerman } from "@/lib/speech";

/* ─────────────── Popover global de traducción ─────────────── */

type Open = { gloss: Gloss; surface: string; rect: DOMRect } | null;
const GlossContext = createContext<{ open: (g: Gloss, surface: string, el: HTMLElement) => void; activeKey: string | null } | null>(null);

const ARTICLE_COLORS: Record<string, string> = {
  der: "text-[#2f5d8a]",
  die: "text-wine",
  das: "text-sage",
};

export function GlossProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Open>(null);
  const close = useCallback(() => setState(null), []);

  const open = useCallback((gloss: Gloss, surface: string, el: HTMLElement) => {
    setState((s) => (s && s.surface === surface && s.rect.top === el.getBoundingClientRect().top ? null : { gloss, surface, rect: el.getBoundingClientRect() }));
  }, []);

  useEffect(() => {
    if (!state) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
    };
  }, [state, close]);

  const value = useMemo(() => ({ open, activeKey: state ? state.surface : null }), [open, state]);

  return (
    <GlossContext.Provider value={value}>
      {children}
      {state && <GlossPopover state={state} onClose={close} />}
    </GlossContext.Provider>
  );
}

function GlossPopover({ state, onClose }: { state: NonNullable<Open>; onClose: () => void }) {
  const { loc } = useT();
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const { gloss, rect } = state;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const margin = 12;
    let left = rect.left + rect.width / 2 - w / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - w - margin));
    let top = rect.bottom + 8;
    if (top + h > window.innerHeight - margin) top = rect.top - h - 8;
    setPos({ top, left });
  }, [rect]);

  useEffect(() => {
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    // en el siguiente tick para no cerrar con el mismo toque que abrió
    const id = setTimeout(() => {
      document.addEventListener("mousedown", onDown);
      document.addEventListener("touchstart", onDown);
    });
    return () => {
      clearTimeout(id);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [onClose]);

  const headword = gloss.article ? `${gloss.article} ${gloss.de}` : gloss.de;

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={headword}
      className="fixed z-50 w-max min-w-[11rem] max-w-[18rem] rounded-2xl border border-line bg-paper p-3.5 shadow-xl shadow-cocoa/15"
      style={pos ? { top: pos.top, left: pos.left } : { visibility: "hidden", top: 0, left: 0 }}
    >
      <div className="flex items-start gap-2.5">
        <button
          type="button"
          onClick={() => speakGerman(headword)}
          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cream-deep text-cocoa hover:text-wine"
          aria-label="Anhören"
        >
          <SpeakerIcon />
        </button>
        <div className="min-w-0">
          <p className="font-display text-lg leading-tight text-ink">
            {gloss.article && <span className={`${ARTICLE_COLORS[gloss.article]} font-semibold`}>{gloss.article} </span>}
            {gloss.de}
          </p>
          {gloss.plural && <p className="text-xs text-muted">Plural: die {gloss.plural}</p>}
          <p className="mt-1 text-[15px] text-cocoa">{loc(gloss.tr)}</p>
        </div>
      </div>
    </div>
  );
}

export function SpeakerIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M19 5a10 10 0 0 1 0 14" />
    </svg>
  );
}

/* ─────────────── Texto alemán con palabras tocables ─────────────── */

type Token = { text: string; word: boolean };

function tokenize(s: string): Token[] {
  const out: Token[] = [];
  const re = /\p{L}[\p{L}'’-]*/gu;
  let last = 0;
  for (const m of s.matchAll(re)) {
    if (m.index! > last) out.push({ text: s.slice(last, m.index), word: false });
    out.push({ text: m[0], word: true });
    last = m.index! + m[0].length;
  }
  if (last < s.length) out.push({ text: s.slice(last), word: false });
  return out;
}

/** Divide por **resaltado** */
function splitEmphasis(s: string) {
  const parts = s.split("**");
  return parts.map((text, i) => ({ text, em: i % 2 === 1 }));
}

type Piece = { kind: "text"; text: string; em: boolean } | { kind: "gloss"; text: string; em: boolean; gloss: Gloss; isNew: boolean };

function segment(s: string, unitKey?: string): Piece[] {
  const pieces: Piece[] = [];
  const maxN = Math.max(1, Math.min(4, maxPhraseWords()));
  for (const { text, em } of splitEmphasis(s)) {
    const toks = tokenize(text);
    let i = 0;
    while (i < toks.length) {
      const t = toks[i];
      if (!t.word) {
        pieces.push({ kind: "text", text: t.text, em });
        i++;
        continue;
      }
      let matched = false;
      // frases de varias palabras: palabra (espacio palabra)*
      for (let n = maxN; n >= 1 && !matched; n--) {
        const span: Token[] = [];
        let words = 0;
        let j = i;
        while (j < toks.length && words < n) {
          const tk = toks[j];
          if (tk.word) words++;
          else if (!/^\s+$/.test(tk.text) && !/^['’]$/.test(tk.text)) break;
          span.push(tk);
          j++;
        }
        if (words !== n) continue;
        const phrase = span.map((x) => x.text).join("").replace(/\s+/g, " ");
        const candidates = [phrase, phrase.replace(/[?!.]$/, "")];
        const g = candidates.map(lookup).find(Boolean) ?? null;
        if (g) {
          pieces.push({ kind: "gloss", text: phrase, em, gloss: g, isNew: !!unitKey && g.source === unitKey && !g.meta });
          i = j;
          matched = true;
        }
      }
      if (!matched) {
        pieces.push({ kind: "text", text: t.text, em });
        i++;
      }
    }
  }
  return pieces;
}

export function GermanText({ text, unitKey, className = "" }: { text: string; unitKey?: string; className?: string }) {
  const ctx = useContext(GlossContext);
  const pieces = useMemo(() => segment(text, unitKey), [text, unitKey]);

  return (
    <span className={className} lang="de">
      {pieces.map((p, i) => {
        const inner = p.em ? <strong className="font-semibold text-wine">{p.text}</strong> : p.text;
        if (p.kind === "text" || !ctx) return <span key={i}>{inner}</span>;
        return (
          <span
            key={i}
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              ctx.open(p.gloss, `${i}:${p.text}:${text.length}`, e.currentTarget);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                ctx.open(p.gloss, `${i}:${p.text}:${text.length}`, e.currentTarget as HTMLElement);
              }
            }}
            className={`cursor-pointer rounded-[4px] transition-colors hover:bg-wine-soft ${
              p.isNew ? "underline decoration-gold/70 decoration-dotted decoration-2 underline-offset-[5px]" : ""
            }`}
          >
            {inner}
          </span>
        );
      })}
    </span>
  );
}
