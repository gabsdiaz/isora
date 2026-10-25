"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { german, getUnitMeta } from "@/content/de/course";
import { BOX_LABELS, dueCards, useDeck } from "@/lib/flashcards";
import { useT } from "@/lib/i18n";
import { MiniCard, ReviewSession } from "@/components/flashcards/Flashcards";

/** "Meine Karten": todas las palabras guardadas, con repaso espaciado. */
export default function MyCards() {
  const { deck } = useDeck();
  const { g } = useT();
  const [reviewing, setReviewing] = useState(false);
  const [level, setLevel] = useState<string>("alle");
  const allCards = useMemo(() => Object.values(deck), [deck]);
  const levelOf = (source: string) => (source.includes("/") ? source.split("/")[0] : "mine");
  const cards = useMemo(() => (level === "alle" ? allCards : allCards.filter((c) => levelOf(c.source) === level)), [allCards, level]);
  const due = dueCards(Object.fromEntries(cards.map((c) => [c.id, c])));
  const tabs = [
    { id: "alle", label: "Alle", n: allCards.length },
    ...german.levels.map((l) => ({ id: l.id, label: l.label, n: allCards.filter((c) => levelOf(c.source) === l.id).length })),
    { id: "mine", label: "Eigene Wörter", n: allCards.filter((c) => levelOf(c.source) === "mine").length },
  ];
  const byBox = [0, 1, 2, 3, 4, 5].map((b) => cards.filter((c) => c.box === b).length);

  const groups = useMemo(() => {
    const map = new Map<string, typeof cards>();
    for (const c of cards) map.set(c.source, [...(map.get(c.source) ?? []), c]);
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }));
  }, [cards]);

  if (reviewing) return <ReviewSession cards={due.slice(0, 25)} onDone={() => setReviewing(false)} />;

  return (
    <div>
      <p className="text-sm text-muted">Karteikarten</p>
      <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">{g("myCards")}</h1>

      <nav className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1" aria-label="Niveaus">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            disabled={tab.n === 0 && tab.id !== "alle"}
            onClick={() => setLevel(tab.id)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition disabled:opacity-40 ${
              level === tab.id ? "border-wine bg-wine text-cream" : "border-line bg-paper text-cocoa hover:border-cocoa-light"
            }`}
          >
            {tab.label} <span className="opacity-70">· {tab.n}</span>
          </button>
        ))}
      </nav>

      <div className="mt-5 grid gap-4 md:grid-cols-[1.3fr_1fr]">
        <div className="rounded-[2rem] border border-latte/60 bg-sand p-6 text-ink">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-wine">Heute</p>
          <p className="mt-1 font-display text-4xl">{due.length} Karten fällig</p>
          <p className="mt-2 text-sm text-cocoa">
            Wiederholung mit System: Was du gut kannst, siehst du später wieder. Was schwer ist, kommt bald zurück.
          </p>
          <button
            type="button"
            disabled={!due.length}
            onClick={() => setReviewing(true)}
            className="mt-5 rounded-full bg-wine px-6 py-3 font-medium text-cream transition hover:bg-wine-light disabled:opacity-40"
          >
            ▶ Jetzt wiederholen
          </button>
        </div>
        <div className="rounded-[2rem] border border-line bg-paper p-6">
          <p className="mb-3 text-sm font-semibold text-cocoa">Fortschritt · {cards.length} Karten</p>
          <ul className="space-y-2">
            {byBox.map((n, i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                <span className="w-20 shrink-0 text-muted">{BOX_LABELS[i]}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-cream-deep">
                  <span className="block h-full rounded-full bg-wine" style={{ width: `${cards.length ? (n / cards.length) * 100 : 0}%`, opacity: 0.35 + i * 0.13 }} />
                </span>
                <span className="w-8 text-right text-cocoa">{n}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {cards.length === 0 && (
        <div className="mt-8 rounded-[2rem] border border-dashed border-line p-8 text-center">
          <p className="font-display text-xl text-cocoa">Noch keine Karten</p>
          <p className="mt-2 text-ink/70">Öffne eine Einheit – die neuen Wörter werden automatisch gespeichert.</p>
          <Link href="/aprender/de/a1-1/1" className="mt-5 inline-block rounded-full bg-wine px-5 py-2.5 text-sm font-medium text-cream">
            Einheit 1 öffnen
          </Link>
        </div>
      )}

      {groups.map(([source, list]) => {
        const [level, n] = source.split("/");
        const meta = getUnitMeta(level, Number(n));
        return (
          <section key={source} className="mt-10">
            <h2 className="mb-3 text-xl font-semibold">
              {meta ? `${level.toUpperCase().replace("-", ".")} · Einheit ${n}: ${meta.title}` : "Meine Wörter"}
            </h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((c) => (
                <MiniCard key={c.id} card={c} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
