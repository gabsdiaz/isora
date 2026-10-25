"use client";

import { useState } from "react";
import type { VocabEntry } from "@/content/types";
import { imageFor } from "@/content/de/images";
import { speakGerman } from "@/lib/speech";
import { useT } from "@/lib/i18n";
import { shuffle } from "./shared";

/* ─────────── Memory: une la imagen o la traducción con la palabra alemana ─────────── */

type Tile = { id: string; pair: string; kind: "de" | "pic"; text: string; img?: string | null };

/**
 * Memory: une la palabra alemana con su dibujo / traducción.
 * Se usa en la pestaña Karteikarten (onDone = volver) y en la Spielzone (onRestart = otra partida).
 */
export function Memory({ words, onDone, onRestart, pairs = 6 }: { words: VocabEntry[]; onDone?: () => void; onRestart?: () => void; pairs?: number }) {
  const { loc } = useT();
  const [tiles] = useState<Tile[]>(() => {
    const ok = words.filter((w) => w.de.length < 22);
    const withPic = shuffle(ok.filter((w) => imageFor(w.de)));
    const rest = shuffle(ok.filter((w) => !imageFor(w.de)));
    const pool = [...withPic, ...rest].slice(0, pairs);
    const t: Tile[] = [];
    for (const w of pool) {
      const head = w.article ? `${w.article} ${w.de}` : w.de;
      t.push({ id: `${w.de}-de`, pair: w.de, kind: "de", text: head });
      t.push({ id: `${w.de}-pic`, pair: w.de, kind: "pic", text: loc(w.tr), img: imageFor(w.de) });
    }
    return shuffle(t);
  });
  const [open, setOpen] = useState<string[]>([]);
  const [found, setFound] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const done = found.length === tiles.length / 2;

  const flip = (tile: Tile) => {
    if (open.length === 2 || open.includes(tile.id) || found.includes(tile.pair)) return;
    if (tile.kind === "de") speakGerman(tile.text);
    const next = [...open, tile.id];
    setOpen(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next.map((id) => tiles.find((x) => x.id === id)!);
      if (a.pair === b.pair) {
        setTimeout(() => {
          setFound((f) => [...f, a.pair]);
          setOpen([]);
        }, 450);
      } else {
        setTimeout(() => setOpen([]), 900);
      }
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="font-display text-2xl text-wine">Memory 🧠</p>
        <p className="text-sm text-cocoa">Züge: {moves}</p>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {tiles.map((tile) => {
          const isOpen = open.includes(tile.id) || found.includes(tile.pair);
          const isFound = found.includes(tile.pair);
          return (
            <button
              key={tile.id}
              type="button"
              onClick={() => flip(tile)}
              className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl p-2 text-center transition ${
                isFound ? "bg-sage-soft text-sage" : isOpen ? "bg-paper text-ink shadow-md" : "border border-latte/60 bg-sand text-cocoa hover:bg-sand-deep"
              }`}
            >
              {isOpen ? (
                tile.kind === "pic" ? (
                  <>
                    {tile.img && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={tile.img} alt="" width={44} height={44} draggable={false} />
                    )}
                    <span className="text-xs leading-tight sm:text-sm">{tile.text}</span>
                  </>
                ) : (
                  <span className="font-display text-base leading-tight sm:text-lg">{tile.text}</span>
                )
              ) : (
                <span className="font-display text-2xl text-wine">?</span>
              )}
            </button>
          );
        })}
      </div>
      {done && (
        <div className="mt-5 rounded-[2rem] border border-latte/60 bg-sand p-6 text-center text-ink">
          <p className="font-display text-2xl">Geschafft in {moves} Zügen! 🎉</p>
          <p className="mt-1 text-sm text-cocoa">{moves <= tiles.length / 2 + 2 ? "⭐⭐⭐ Super Gedächtnis!" : moves <= tiles.length ? "⭐⭐ Sehr gut!" : "⭐ Gut gemacht!"}</p>
          <div className="mt-4 flex justify-center gap-2">
            {onRestart && (
              <button type="button" onClick={onRestart} className="rounded-full bg-wine px-5 py-2 text-sm font-medium text-cream hover:bg-wine-light">
                Noch einmal
              </button>
            )}
            {onDone && (
              <button type="button" onClick={onDone} className="rounded-full border border-cocoa/30 bg-paper px-5 py-2 text-sm font-medium text-cocoa">
                Zurück
              </button>
            )}
          </div>
        </div>
      )}
      {!done && onDone && (
        <button type="button" onClick={onDone} className="mt-4 text-sm text-muted hover:text-wine">
          ← Zurück
        </button>
      )}
    </div>
  );
}
