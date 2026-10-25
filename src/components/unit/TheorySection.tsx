"use client";

import type { TheoryBlock } from "@/content/types";
import { useT } from "@/lib/i18n";
import { SpeakButton } from "../SpeakButton";

export function TheorySection({ blocks }: { blocks: TheoryBlock[] }) {
  const { loc } = useT();

  return (
    <article className="space-y-5">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "heading":
            return (
              <h2 key={i} className={`text-2xl font-semibold ${i > 0 ? "pt-6" : ""}`}>
                {loc(b.text)}
              </h2>
            );
          case "paragraph":
            return (
              <p key={i} className="max-w-3xl text-[17px] leading-relaxed text-ink/90">
                {loc(b.text)}
              </p>
            );
          case "tip":
            return (
              <aside key={i} className="flex gap-3 rounded-2xl border-l-4 border-gold bg-[#f4ead6] p-4 text-ink/90">
                <span className="font-display text-xl text-gold" aria-hidden="true">
                  ✦
                </span>
                <p className="leading-relaxed">{loc(b.text)}</p>
              </aside>
            );
          case "example":
            return (
              <div key={i} className="flex items-center gap-3 rounded-2xl border border-line bg-paper px-4 py-3">
                <SpeakButton text={b.de} />
                <div>
                  <p className="font-display text-lg text-cocoa">{b.de}</p>
                  <p className="text-sm text-muted">{loc(b.meaning)}</p>
                </div>
              </div>
            );
          case "phrases":
            return (
              <div key={i} className="overflow-hidden rounded-2xl border border-line bg-paper">
                {b.title && <p className="border-b border-line bg-cream-deep/60 px-4 py-2 text-sm font-medium text-cocoa">{loc(b.title)}</p>}
                <ul className="divide-y divide-line">
                  {b.items.map((it) => (
                    <li key={it.de} className="flex items-center gap-3 px-4 py-3">
                      <SpeakButton text={it.de} />
                      <span className="min-w-0 flex-1">
                        <span className="font-display text-lg text-wine">{it.de}</span>
                        <span className="block text-sm text-ink/70">{loc(it.meaning)}</span>
                      </span>
                      {it.note && <span className="shrink-0 rounded-full bg-cream-deep px-2.5 py-0.5 text-xs text-cocoa">{loc(it.note)}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            );
          case "table":
            return (
              <div key={i} className="overflow-x-auto rounded-2xl border border-line bg-paper">
                {b.title && <p className="border-b border-line bg-cream-deep/60 px-4 py-2 text-sm font-medium text-cocoa">{loc(b.title)}</p>}
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-line">
                      {b.columns.map((c, k) => (
                        <th key={k} className="px-4 py-2.5 text-sm font-semibold text-cocoa">
                          {loc(c)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {b.rows.map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, k) => (
                          <td key={k} className={`px-4 py-2.5 ${k === 0 && b.columns.length > 2 ? "text-sm text-muted" : "font-display text-[17px] text-ink"}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </article>
  );
}
