"use client";

import { useEffect, useMemo, useState } from "react";
import type { VocabEntry } from "@/content/types";
import { cardId, dueCards, useDeck, type Card } from "@/lib/flashcards";
import { MiniCard, ReviewSession } from "./Flashcards";
import { Memory } from "../games/Memory";

/** Pestaña "Karteikarten" de una unidad: las palabras se guardan solas en el mazo del estudiante. */
export function UnitCards({ vocab, source }: { vocab: VocabEntry[]; source: string }) {
  const { deck, addCards } = useDeck();
  const [mode, setMode] = useState<"list" | "review" | "memory">("list");
  const words = useMemo(() => vocab.filter((v) => !v.meta), [vocab]);

  // Guarda automáticamente las palabras de la unidad en "Meine Karteikarten"
  useEffect(() => {
    addCards(words.map((v) => ({ de: v.de, article: v.article, plural: v.plural, tr: v.tr, source })));
  }, [words, source, addCards]);

  const cards = words.map((v) => deck[cardId(source, v.de)]).filter(Boolean) as Card[];
  const due = dueCards(Object.fromEntries(cards.map((c) => [c.id, c])));
  const learned = cards.filter((c) => c.box >= 3).length;

  if (mode === "review") {
    const session = (due.length ? due : cards).slice(0, 20);
    return <ReviewSession cards={session} onDone={() => setMode("list")} />;
  }
  if (mode === "memory") return <Memory words={words} onDone={() => setMode("list")} />;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-latte/60 bg-sand p-6 text-ink sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-wine">Karteikarten</p>
          <p className="mt-1 font-display text-2xl">{cards.length} Wörter in dieser Einheit</p>
          <p className="mt-1 text-sm text-cocoa">
            {due.length} fällig · {learned} gut gelernt · automatisch in „Meine Karten“ gespeichert
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setMode("review")} className="rounded-full bg-wine px-5 py-2.5 text-sm font-medium text-cream hover:bg-wine-light">
            ▶ Lernen
          </button>
          <button type="button" onClick={() => setMode("memory")} className="rounded-full border border-cocoa/30 bg-paper px-5 py-2.5 text-sm font-medium text-cocoa hover:border-cocoa">
            🧠 Memory-Spiel
          </button>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <MiniCard key={c.id} card={c} />
        ))}
      </div>
    </div>
  );
}
