"use client";

import { useEffect, useMemo, useState } from "react";
import { exampleFor } from "@/content/de/examples";
import { imageFor } from "@/content/de/images";
import { speakGerman } from "@/lib/speech";
import { useT } from "@/lib/i18n";
import { type Card, type Rating, useDeck } from "@/lib/flashcards";
import { SpeakerIcon } from "../german/Gloss";

const ARTICLE_COLORS: Record<string, string> = { der: "text-blue", die: "text-wine", das: "text-sage" };

const headword = (c: Pick<Card, "de" | "article">) => (c.article ? `${c.article} ${c.de}` : c.de);

/** Tarjeta que se voltea: frente en alemán (imagen + palabra), reverso café oscuro con la traducción. */
export function FlipCard({ card, flipped, onFlip }: { card: Card; flipped: boolean; onFlip: () => void }) {
  const { loc } = useT();
  const src = imageFor(card.de);
  const example = useMemo(() => exampleFor(card.de, card.source), [card.de, card.source]);

  return (
    <div className="mx-auto w-full max-w-md [perspective:1200px]">
      <button
        type="button"
        onClick={onFlip}
        aria-label={flipped ? "Vorderseite" : "Rückseite zeigen"}
        className="relative block h-80 w-full text-left transition-transform duration-500 [transform-style:preserve-3d]"
        style={{ transform: flipped ? "rotateY(180deg)" : "none" }}
      >
        {/* Frente */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-[2rem] border border-line bg-paper p-6 shadow-xl shadow-espresso/10 [backface-visibility:hidden]">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt="" width={96} height={96} draggable={false} />
          ) : (
            <span className="font-display text-6xl text-wine/30">Aa</span>
          )}
          <p className="text-center font-display text-4xl text-ink">
            {card.article && <span className={`font-semibold ${ARTICLE_COLORS[card.article]}`}>{card.article} </span>}
            {card.de}
          </p>
          <span className="text-xs uppercase tracking-[0.14em] text-muted">Tippen zum Umdrehen</span>
        </div>
        {/* Reverso */}
        <div className="absolute inset-0 flex flex-col justify-center gap-3 rounded-[2rem] bg-espresso p-7 text-cream shadow-xl shadow-espresso/30 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="font-display text-3xl text-[#f3c9a8]">{loc(card.tr)}</p>
          <p className="font-display text-xl text-cream/90">
            {headword(card)}
            {card.plural && <span className="ml-2 text-sm text-latte">· Plural: die {card.plural}</span>}
          </p>
          {example && (
            <div className="mt-2 border-l-2 border-wine-light pl-3">
              <p className="font-display text-[17px] leading-snug text-cream">{example.de}</p>
              <p className="mt-1 text-sm italic text-latte">{loc(example.tr)}</p>
            </div>
          )}
        </div>
      </button>
      <div className="mt-3 flex justify-center">
        <button
          type="button"
          onClick={() => speakGerman(headword(card))}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-sm text-cocoa hover:border-wine-light hover:text-wine"
        >
          <SpeakerIcon size={15} /> Anhören
        </button>
      </div>
    </div>
  );
}

/** Sesión de repaso: voltear y calificar (Nochmal / Gut / Leicht). */
export function ReviewSession({ cards, onDone }: { cards: Card[]; onDone?: () => void }) {
  const { review } = useDeck();
  const { t } = useT();
  const [queue] = useState(() => cards.map((c) => c.id));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [stats, setStats] = useState({ again: 0, good: 0, easy: 0 });
  const { deck } = useDeck();
  const card = deck[queue[index]] ?? cards.find((c) => c.id === queue[index]);

  useEffect(() => {
    if (card && !flipped) speakGerman(headword(card));
    // solo al cambiar de tarjeta
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  if (!card || index >= queue.length) {
    const total = stats.again + stats.good + stats.easy;
    return (
      <div className="mx-auto max-w-md rounded-[2rem] bg-espresso p-8 text-center text-cream">
        <p className="text-5xl">🎉</p>
        <p className="mt-3 font-display text-3xl">Super gemacht!</p>
        <p className="mt-2 text-cream/80">
          {total} Karten · ✅ {stats.good + stats.easy} · 🔁 {stats.again}
        </p>
        {onDone && (
          <button type="button" onClick={onDone} className="mt-6 rounded-full bg-wine px-6 py-2.5 font-medium text-cream hover:bg-wine-light">
            {t("continue")}
          </button>
        )}
      </div>
    );
  }

  const rate = (r: Rating) => {
    review(card.id, r);
    setStats((s) => ({ ...s, [r]: s[r] + 1 }));
    setFlipped(false);
    setIndex((i) => i + 1);
  };

  return (
    <div>
      <div className="mx-auto mb-5 flex max-w-md items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-cream-deep">
          <div className="h-full rounded-full bg-wine transition-all" style={{ width: `${(index / queue.length) * 100}%` }} />
        </div>
        <span className="text-sm text-cocoa">
          {index + 1}/{queue.length}
        </span>
      </div>
      <FlipCard card={card} flipped={flipped} onFlip={() => setFlipped((f) => !f)} />
      <div className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-2">
        {flipped ? (
          <>
            <button type="button" onClick={() => rate("again")} className="rounded-2xl border border-wine/30 bg-wine-soft px-3 py-3 text-sm font-semibold text-wine hover:border-wine">
              Nochmal
              <span className="block text-[11px] font-normal text-wine/70">otra vez</span>
            </button>
            <button type="button" onClick={() => rate("good")} className="rounded-2xl bg-espresso px-3 py-3 text-sm font-semibold text-cream hover:bg-espresso-light">
              Gut
              <span className="block text-[11px] font-normal text-cream/60">bien</span>
            </button>
            <button type="button" onClick={() => rate("easy")} className="rounded-2xl border border-sage/40 bg-sage-soft px-3 py-3 text-sm font-semibold text-sage hover:border-sage">
              Leicht
              <span className="block text-[11px] font-normal text-sage/70">fácil</span>
            </button>
          </>
        ) : (
          <button type="button" onClick={() => setFlipped(true)} className="col-span-3 rounded-2xl bg-wine px-4 py-3 font-medium text-cream hover:bg-wine-light">
            Umdrehen
          </button>
        )}
      </div>
    </div>
  );
}

/** Mini tarjeta para listas (vista de mazo) */
export function MiniCard({ card, onClick }: { card: Card; onClick?: () => void }) {
  const { loc } = useT();
  const [show, setShow] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        setShow((s) => !s);
        speakGerman(headword(card));
        onClick?.();
      }}
      className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${show ? "border-espresso bg-espresso text-cream" : "border-line bg-paper hover:border-cocoa-light"}`}
    >
      {imageFor(card.de) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageFor(card.de)!} alt="" width={36} height={36} draggable={false} />
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cream-deep font-display text-cocoa">{card.de[0]}</span>
      )}
      <span className="min-w-0 flex-1">
        <span className={`block truncate font-display text-[17px] ${show ? "text-cream" : "text-ink"}`}>
          {card.article && <span className={show ? "text-latte" : ARTICLE_COLORS[card.article]}>{card.article} </span>}
          {card.de}
        </span>
        {show && <span className="block truncate text-sm text-[#f3c9a8]">{loc(card.tr)}</span>}
      </span>
      <BoxDots box={card.box} dark={show} />
    </button>
  );
}

export function BoxDots({ box, dark }: { box: number; dark?: boolean }) {
  return (
    <span className="flex shrink-0 gap-0.5" title={`Box ${box}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`h-1.5 w-1.5 rounded-full ${i <= box ? (dark ? "bg-latte" : "bg-wine") : dark ? "bg-cream/20" : "bg-line"}`} />
      ))}
    </span>
  );
}
