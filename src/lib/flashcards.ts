"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Tr } from "@/content/types";

/**
 * Flashcards con repetición espaciada (sistema Leitner, 5 cajas).
 * Las tarjetas se guardan en el navegador. Próximo paso: sincronizarlas con Firestore.
 */
export type Card = {
  id: string; // "a1-1/3:Sprache"
  de: string;
  article?: "der" | "die" | "das";
  plural?: string;
  tr: Tr;
  source: string; // "a1-1/3" o "mine"
  box: number; // 0 = nueva, 1–5
  due: number; // timestamp
  reviews: number;
  added: number;
};

type Deck = Record<string, Card>;

const KEY = "isora.cards.v1";
const EVENT = "isora:cards";
const DAY = 24 * 60 * 60 * 1000;
/** Días hasta el próximo repaso según la caja */
const INTERVAL_DAYS = [0, 0, 1, 3, 7, 21];

let cacheRaw: string | null = null;
let cache: Deck = {};
const EMPTY: Deck = {};

function snapshot(): Deck {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  if (raw !== cacheRaw) {
    cacheRaw = raw;
    try {
      cache = raw ? (JSON.parse(raw) as Deck) : {};
    } catch {
      cache = {};
    }
  }
  return cache;
}

function save(deck: Deck) {
  try {
    localStorage.setItem(KEY, JSON.stringify(deck));
  } catch {
    /* sin almacenamiento */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export type NewCard = Pick<Card, "de" | "article" | "plural" | "tr" | "source">;

export const cardId = (source: string, de: string) => `${source}:${de}`;

export type Rating = "again" | "good" | "easy";

export function useDeck() {
  const deck = useSyncExternalStore(subscribe, snapshot, () => EMPTY);

  /** Agrega tarjetas nuevas (las que ya existen no se tocan). */
  const addCards = useCallback((cards: NewCard[]) => {
    const current = { ...snapshot() };
    let changed = false;
    const now = Date.now();
    for (const c of cards) {
      const id = cardId(c.source, c.de);
      if (current[id]) continue;
      current[id] = { ...c, id, box: 0, due: now, reviews: 0, added: now };
      changed = true;
    }
    if (changed) save(current);
  }, []);

  const removeCard = useCallback((id: string) => {
    const current = { ...snapshot() };
    delete current[id];
    save(current);
  }, []);

  const review = useCallback((id: string, rating: Rating) => {
    const current = { ...snapshot() };
    const c = current[id];
    if (!c) return;
    const box = rating === "again" ? 1 : Math.min(5, Math.max(1, c.box) + (rating === "easy" ? 2 : 1));
    const due = rating === "again" ? Date.now() + 60 * 1000 : Date.now() + INTERVAL_DAYS[box] * DAY;
    current[id] = { ...c, box, due, reviews: c.reviews + 1 };
    save(current);
  }, []);

  return { deck, addCards, removeCard, review };
}

export function dueCards(deck: Deck, now = Date.now()) {
  return Object.values(deck)
    .filter((c) => c.due <= now)
    .sort((a, b) => a.box - b.box || a.due - b.due);
}

export const BOX_LABELS = ["Neu", "Lernen", "1 Tag", "3 Tage", "1 Woche", "Gelernt"];
