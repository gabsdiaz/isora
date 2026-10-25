"use client";

import { useState } from "react";
import type { TheoryBlock, VocabEntry } from "@/content/types";
import { useT } from "@/lib/i18n";
import { SpeakButton } from "../SpeakButton";
import { GermanText } from "../german/Gloss";
import { Translatable, TranslateToggle } from "../german/Translatable";

const ARTICLE_COLORS: Record<string, string> = { der: "text-[#2f5d8a]", die: "text-wine", das: "text-sage" };

function PhraseRow({ de, tr, note, unitKey }: { de: string; tr: { es: string; en: string }; note?: string; unitKey: string }) {
  const [open, setOpen] = useState(false);
  const { loc } = useT();
  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <SpeakButton text={de} />
      <span className="min-w-0 flex-1">
        <span className="font-display text-lg text-wine">
          <GermanText text={de} unitKey={unitKey} />
        </span>
        {open && <span className="block text-sm italic text-muted">{loc(tr)}</span>}
      </span>
      {note && <span className="shrink-0 rounded-full bg-cream-deep px-2.5 py-0.5 text-xs text-cocoa">{note}</span>}
      <TranslateToggle open={open} onClick={() => setOpen((o) => !o)} />
    </li>
  );
}

function Cell({ text, muted }: { text: string; muted?: boolean }) {
  return <GermanText text={text} className={muted ? "text-sm text-muted" : "font-display text-[17px] text-ink"} />;
}

export function TheorySection({ blocks, vocab, unitKey }: { blocks: TheoryBlock[]; vocab: VocabEntry[]; unitKey: string }) {
  const { g, t } = useT();

  return (
    <article className="space-y-5">
      <p className="flex items-center gap-2 rounded-2xl bg-cream-deep/60 px-4 py-2.5 text-sm text-cocoa" title={t("tapHint")}>
        <span aria-hidden="true">👆</span> {g("tapHint")}
      </p>

      {blocks.map((b, i) => {
        switch (b.type) {
          case "heading":
            return (
              <Translatable
                key={i}
                as="h2"
                de={b.text.de}
                tr={b.text}
                unitKey={unitKey}
                className={i > 0 ? "pt-6" : ""}
                textClassName="text-2xl font-semibold"
              />
            );
          case "text":
            return <Translatable key={i} de={b.text.de} tr={b.text} unitKey={unitKey} className="max-w-3xl" textClassName="text-[17px] leading-relaxed text-ink/90" />;
          case "tip":
            return (
              <aside key={i} className="flex gap-3 rounded-2xl border-l-4 border-gold bg-[#f4ead6] p-4 text-ink/90">
                <span className="font-display text-xl text-gold" aria-hidden="true">
                  ✦
                </span>
                <Translatable de={b.text.de} tr={b.text} unitKey={unitKey} className="flex-1" textClassName="leading-relaxed" />
              </aside>
            );
          case "example":
            return (
              <div key={i} className="flex items-center gap-3 rounded-2xl border border-line bg-paper px-4 py-3">
                <SpeakButton text={b.de} />
                <Translatable de={b.de} tr={b.tr} unitKey={unitKey} className="flex-1" textClassName="font-display text-lg text-cocoa" />
              </div>
            );
          case "phrases":
            return (
              <div key={i} className="overflow-hidden rounded-2xl border border-line bg-paper">
                {b.title && <p className="border-b border-line bg-cream-deep/60 px-4 py-2 text-sm font-medium text-cocoa">{b.title.de}</p>}
                <ul className="divide-y divide-line">
                  {b.items.map((it) => (
                    <PhraseRow key={it.de} de={it.de} tr={it.tr} note={it.note?.de} unitKey={unitKey} />
                  ))}
                </ul>
              </div>
            );
          case "table":
            return (
              <div key={i} className="overflow-hidden rounded-2xl border border-line bg-paper">
                {b.title && <p className="border-b border-line bg-cream-deep/60 px-4 py-2 text-sm font-medium text-cocoa">{b.title.de}</p>}
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-line">
                        {b.columns.map((c, k) => (
                          <th key={k} className="whitespace-nowrap px-4 py-2.5 text-sm font-semibold text-cocoa">
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {b.rows.map((row, r) => (
                        <tr key={r}>
                          {row.map((cell, k) => (
                            <td key={k} className="px-4 py-2.5">
                              <Cell text={cell} muted={k === 0 && b.columns[0] === ""} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {b.note && (
                  <div className="border-t border-line px-4 py-3 text-sm">
                    <Translatable de={b.note.de} tr={b.note} unitKey={unitKey} textClassName="text-ink/80" />
                  </div>
                )}
              </div>
            );
        }
      })}

      <VocabList vocab={vocab} />
    </article>
  );
}

function VocabList({ vocab }: { vocab: VocabEntry[] }) {
  const { g, loc } = useT();
  const [show, setShow] = useState(false);
  const words = vocab.filter((v) => !v.meta);
  return (
    <section className="pt-8">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">{g("vocab")}</h2>
        <TranslateToggle open={show} onClick={() => setShow((s) => !s)} />
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {words.map((v) => (
          <li key={v.de} className="flex items-center gap-3 rounded-2xl border border-line bg-paper px-3 py-2.5">
            <SpeakButton text={v.article ? `${v.article} ${v.de}` : v.de} className="h-7 w-7" />
            <span className="min-w-0 flex-1">
              <span className="font-display text-[17px] text-ink">
                {v.article && <span className={`font-semibold ${ARTICLE_COLORS[v.article]}`}>{v.article} </span>}
                {v.de}
              </span>
              {v.plural && <span className="ml-1.5 text-xs text-muted">· die {v.plural}</span>}
              {show && <span className="block text-sm italic text-muted">{loc(v.tr)}</span>}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
