"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Song } from "@/content/de/songs";
import { sameWord, type Blank, type Difficulty, type LyricsLine } from "@/lib/lyrics";
import type { SpotifyPlayer } from "@/lib/spotify";
import { speakGerman } from "@/lib/speech";
import { useProgress } from "@/lib/progress";
import { useDeck } from "@/lib/flashcards";
import { SpeakerIcon } from "../german/Gloss";

type State = "ok" | "half" | "shown";
type Tr = { es: string; en: string };

/**
 * La letra con huecos. En modo karaoke (canción sincronizada) resalta la línea que suena
 * y, si quedan huecos en esa línea, pausa la música hasta que el estudiante los complete.
 */
export function LyricsBoard({
  song,
  lines,
  blanks,
  difficulty,
  player,
  timings,
  lang,
  onAgain,
  onHarder,
}: {
  song: Song;
  lines: LyricsLine[];
  blanks: Blank[];
  difficulty: Difficulty;
  player: SpotifyPlayer;
  timings: number[] | null;
  lang: "es" | "en";
  onAgain: () => void;
  onHarder: (() => void) | null;
}) {
  const L = (t: Tr) => t[lang];
  const T = (es: string, en: string) => (lang === "en" ? en : es);
  const { markUnit } = useProgress();
  const { addCards } = useDeck();
  const [values, setValues] = useState<Record<string, string>>({});
  const [state, setState] = useState<Record<string, State>>({});
  const [hinted, setHinted] = useState<Record<string, boolean>>({});
  const [missed, setMissed] = useState<Record<string, string[]>>({});
  const [active, setActive] = useState<string | null>(blanks[0]?.id ?? null);
  const [showTr, setShowTr] = useState(false);
  const [autoPause, setAutoPause] = useState(true);
  const [current, setCurrent] = useState(-1);
  const [waiting, setWaiting] = useState<number | null>(null);
  const [added, setAdded] = useState(false);
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});
  const waitSince = useRef(0);

  const byLine = useMemo(() => {
    const m = new Map<number, Map<number, Blank>>();
    blanks.forEach((b) => {
      if (!m.has(b.line)) m.set(b.line, new Map());
      m.get(b.line)!.set(b.token, b);
    });
    return m;
  }, [blanks]);

  const solvedCount = blanks.filter((b) => state[b.id]).length;
  const done = blanks.length > 0 && solvedCount === blanks.length;
  const points = blanks.reduce((a, b) => a + (state[b.id] === "ok" ? 1 : state[b.id] === "half" ? 0.5 : 0), 0);
  const pct = blanks.length ? Math.round((points / blanks.length) * 100) : 0;
  const karaoke = Boolean(timings && timings.length === lines.length && player.status === "ready" && !player.preview);

  // Modo karaoke: seguimos la canción y pausamos en las líneas con huecos sin completar
  const live = useRef({ state, waiting, autoPause, karaoke, timings, player, byLine });
  useEffect(() => {
    live.current = { state, waiting, autoPause, karaoke, timings, player, byLine };
  });
  useEffect(() => {
    if (!karaoke) return;
    const t = setInterval(() => {
      const { timings: tm, player: p, state: st, waiting: w, autoPause: ap, byLine: bl } = live.current;
      if (!tm) return;
      const pos = p.position();
      let i = -1;
      while (i + 1 < tm.length && tm[i + 1] <= pos + 150) i++;
      setCurrent(i);
      // Si el estudiante le dio play sin completar la línea, dejamos de esperar
      if (w !== null && !p.paused && performance.now() - waitSince.current > 1500) setWaiting(null);
      if (!ap || w !== null || i < 1 || p.paused) return;
      const prev = i - 1;
      const open = [...(bl.get(prev)?.values() ?? [])].some((b) => !st[b.id]);
      if (open && pos - tm[i] < 1500) {
        p.pause();
        p.seek(tm[i]);
        waitSince.current = performance.now();
        setWaiting(prev);
        const first = [...bl.get(prev)!.values()].find((b) => !st[b.id]);
        if (first) {
          setActive(first.id);
          inputs.current[first.id]?.focus();
        }
      }
    }, 120);
    return () => clearInterval(t);
  }, [karaoke]);

  const solve = (b: Blank, how: State) => {
    const next = { ...state, [b.id]: how };
    setState(next);
    setValues((v) => ({ ...v, [b.id]: b.answer }));
    // ¿Siguiente hueco?
    const after = blanks.find((x) => !next[x.id] && (x.line > b.line || (x.line === b.line && x.token > b.token))) ?? blanks.find((x) => !next[x.id]);
    setActive(after?.id ?? null);
    if (after) setTimeout(() => inputs.current[after.id]?.focus(), 0);
    // Línea completa mientras la música espera: seguimos
    if (waiting === b.line && [...(byLine.get(b.line)?.values() ?? [])].every((x) => next[x.id])) {
      setWaiting(null);
      player.play();
    }
    if (blanks.every((x) => next[x.id])) {
      const pts = blanks.reduce((a, x) => a + (next[x.id] === "ok" ? 1 : next[x.id] === "half" ? 0.5 : 0), 0);
      markUnit(`song/${song.id}`, Math.round(pts), blanks.length);
    }
  };

  const type = (b: Blank, v: string) => {
    setValues((x) => ({ ...x, [b.id]: v }));
    if (sameWord(v, b.answer)) solve(b, hinted[b.id] || missed[b.id]?.length ? "half" : "ok");
  };
  const hint = (b: Blank) => {
    const cur = values[b.id] ?? "";
    const n = sameWord(cur, b.answer.slice(0, cur.length)) ? cur.length + 1 : 1;
    setHinted((h) => ({ ...h, [b.id]: true }));
    if (n >= b.answer.length) return solve(b, "half");
    setValues((x) => ({ ...x, [b.id]: b.answer.slice(0, n) }));
    inputs.current[b.id]?.focus();
  };
  const choose = (b: Blank, w: string) => {
    if (sameWord(w, b.answer)) solve(b, missed[b.id]?.length ? "half" : "ok");
    else setMissed((m) => ({ ...m, [b.id]: [...(m[b.id] ?? []), w] }));
  };
  const revealAll = () => {
    const next = { ...state };
    blanks.forEach((b) => (next[b.id] ??= "shown"));
    setState(next);
    setValues(Object.fromEntries(blanks.map((b) => [b.id, b.answer])));
    setActive(null);
    if (waiting !== null) {
      setWaiting(null);
      player.play();
    }
    const pts = blanks.reduce((a, x) => a + (next[x.id] === "ok" ? 1 : next[x.id] === "half" ? 0.5 : 0), 0);
    markUnit(`song/${song.id}`, Math.round(pts), blanks.length);
  };

  const activeBlank = blanks.find((b) => b.id === active);
  const typed = difficulty !== "leicht";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <button
          type="button"
          onClick={() => setShowTr((s) => !s)}
          aria-pressed={showTr}
          className={`rounded-full border px-3 py-1.5 transition ${showTr ? "border-wine bg-wine text-cream" : "border-latte bg-paper text-cocoa hover:border-cocoa"}`}
        >
          🌐 {T("Traducción", "Translation")}
        </button>
        {karaoke && (
          <button
            type="button"
            onClick={() => setAutoPause((a) => !a)}
            aria-pressed={autoPause}
            className={`rounded-full border px-3 py-1.5 transition ${autoPause ? "border-wine bg-wine text-cream" : "border-latte bg-paper text-cocoa hover:border-cocoa"}`}
          >
            ⏸ Auto-Pause
          </button>
        )}
        <span className="ml-auto tabular-nums text-cocoa">
          {solvedCount}/{blanks.length} Lücken
        </span>
      </div>
      {waiting !== null && (
        <p className="mt-3 rounded-2xl bg-yellow-soft px-4 py-2.5 text-sm text-ink">
          ⏸ {T("La música espera: completa la línea marcada y sigue sonando.", "The music is waiting: fill in the highlighted line and it will continue.")}
        </p>
      )}

      <div className="mt-4 space-y-6">
        {lines
          .reduce<LyricsLine[][]>((acc, l) => {
            (acc[l.stanza] ??= []).push(l);
            return acc;
          }, [])
          .map((stanza, si) => (
            <div key={si} className="space-y-1">
              {stanza.map((line) => {
                const lb = byLine.get(line.index);
                const isCurrent = karaoke && current === line.index;
                const isWaiting = waiting === line.index;
                return (
                  <div
                    key={line.index}
                    className={`group rounded-2xl px-3 py-2 transition ${isWaiting ? "bg-yellow-soft ring-2 ring-yellow" : isCurrent ? "bg-yellow-soft/60" : "hover:bg-sand"}`}
                  >
                    <div className="flex items-start gap-2">
                      <p className="flex-1 font-display text-xl leading-[2.4rem] text-ink sm:text-2xl sm:leading-[2.6rem]">
                        {line.tokens.map((t, ti) => {
                          const b = lb?.get(ti);
                          if (!b) return <span key={ti}>{t.text}</span>;
                          const st = state[b.id];
                          if (st)
                            return (
                              <span key={ti} className={`rounded-md px-0.5 ${st === "ok" ? "text-sage" : st === "half" ? "text-gold" : "text-wine"}`}>
                                {b.answer}
                              </span>
                            );
                          if (!typed)
                            return (
                              <button
                                key={ti}
                                type="button"
                                onClick={() => setActive(b.id)}
                                className={`mx-0.5 inline-block rounded-lg border-b-2 align-baseline font-sans text-base transition ${active === b.id ? "border-wine bg-yellow-soft" : "border-cocoa/40 bg-paper"}`}
                                style={{ width: `${Math.max(3, b.answer.length) * 0.62 + 0.8}em` }}
                                aria-label={T("Hueco: elige la palabra", "Blank: choose the word")}
                              >
                                &nbsp;
                              </button>
                            );
                          const v = values[b.id] ?? "";
                          const wrong = v.length >= b.answer.length && !sameWord(v, b.answer);
                          return (
                            <input
                              key={ti}
                              ref={(el) => {
                                inputs.current[b.id] = el;
                              }}
                              value={v}
                              onFocus={() => setActive(b.id)}
                              onChange={(e) => type(b, e.target.value)}
                              autoCapitalize="none"
                              autoCorrect="off"
                              spellCheck={false}
                              aria-label={T("Escribe la palabra que falta", "Type the missing word")}
                              className={`mx-0.5 inline-block rounded-lg border-b-2 bg-paper px-1 text-center align-baseline font-sans text-base outline-none transition focus:bg-yellow-soft ${
                                wrong ? "border-wine text-wine" : "border-cocoa/40 focus:border-wine"
                              }`}
                              style={{ width: `${Math.max(3, b.answer.length) * 0.62 + 1.2}em` }}
                            />
                          );
                        })}
                      </p>
                      <div className="flex shrink-0 gap-1 pt-1.5">
                        {karaoke && timings && (
                          <button
                            type="button"
                            onClick={() => {
                              player.seek(timings[line.index]);
                              player.play();
                            }}
                            title={T("Escuchar esta línea en la canción", "Hear this line in the song")}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-paper text-sm text-cocoa hover:border-wine hover:text-wine"
                          >
                            ↺
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            player.pause();
                            speakGerman(line.de, "f");
                          }}
                          title={T("Escuchar la línea hablada, despacio", "Hear the line spoken, slowly")}
                          aria-label={`Anhören: ${line.de}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-paper text-cocoa hover:border-wine hover:text-wine"
                        >
                          <SpeakerIcon size={14} />
                        </button>
                      </div>
                    </div>
                    {showTr && <p className="text-sm italic text-muted">{L(line.tr)}</p>}

                    {/* Opciones (Leicht) */}
                    {!typed && activeBlank && activeBlank.line === line.index && !state[activeBlank.id] && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {activeBlank.options?.map((w) => {
                          const bad = missed[activeBlank.id]?.includes(w);
                          return (
                            <button
                              key={w}
                              type="button"
                              disabled={bad}
                              onClick={() => choose(activeBlank, w)}
                              className={`rounded-xl border px-3.5 py-2 text-[15px] transition ${bad ? "border-wine/30 bg-wine-soft text-wine line-through opacity-60" : "border-latte bg-paper text-ink hover:border-wine"}`}
                            >
                              {w}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {/* Pista (Mittel / Schwer) */}
                    {typed && activeBlank && activeBlank.line === line.index && !state[activeBlank.id] && (
                      <div className="mt-1 flex gap-3 text-xs">
                        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => hint(activeBlank)} className="text-cocoa hover:text-wine">
                          💡 {T("Pista: una letra", "Hint: one letter")}
                        </button>
                        <span className="text-muted">
                          {activeBlank.answer.length} {T("letras", "letters")}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
      </div>

      {!done && (
        <div className="mt-6 flex justify-end">
          <button type="button" onClick={revealAll} className="rounded-full px-4 py-2 text-sm text-cocoa transition hover:bg-sand">
            👀 {T("Mostrar la letra completa", "Show full lyrics")}
          </button>
        </div>
      )}

      {done && (
        <div className="mt-8 rounded-[2rem] border border-latte/60 bg-sand p-6 text-center">
          <p className="text-4xl">{pct >= 90 ? "🌟🌟🌟" : pct >= 70 ? "🌟🌟" : pct >= 40 ? "🌟" : "🎵"}</p>
          <p className="mt-2 font-display text-3xl text-wine">{pct >= 90 ? "Wunderbar!" : pct >= 70 ? "Sehr gut!" : pct >= 40 ? "Gut gemacht!" : "Weiter üben!"}</p>
          <p className="mt-1 text-cocoa">
            {Math.round(points * 10) / 10} / {blanks.length} {T("puntos", "points")} · {pct} %
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={onAgain} className="rounded-full bg-wine px-5 py-2.5 text-sm font-medium text-cream transition hover:bg-wine-light">
              ↻ {T("Otra vez (huecos nuevos)", "Again (new blanks)")}
            </button>
            {onHarder && (
              <button type="button" onClick={onHarder} className="rounded-full border border-cocoa/30 bg-paper px-5 py-2.5 text-sm font-medium text-cocoa transition hover:border-cocoa">
                ⬆ {T("Más difícil", "Harder")}
              </button>
            )}
            <button
              type="button"
              disabled={added}
              onClick={() => {
                addCards(song.glossary.map(([de, es, en, article]) => ({ de, article, tr: { es, en }, source: `song/${song.id}` })));
                setAdded(true);
              }}
              className="rounded-full border border-cocoa/30 bg-paper px-5 py-2.5 text-sm font-medium text-cocoa transition hover:border-cocoa disabled:opacity-60"
            >
              {added ? `✓ ${T("En tus tarjetas", "In your cards")}` : `🃏 ${T("Palabras a mis tarjetas", "Words to my cards")}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
