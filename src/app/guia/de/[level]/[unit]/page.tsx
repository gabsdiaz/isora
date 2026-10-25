import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLevel, getUnitMeta } from "@/content/de/course";
import { allUnits } from "@/content/de/units";
import { imageFor } from "@/content/de/images";
import type { Exercise, TheoryBlock, Tri } from "@/content/types";

/**
 * Hoja de trabajo imprimible (se convierte a PDF con scripts/guides.py).
 * Todo en alemán; el vocabulario lleva traducción al español y al inglés.
 */

export function generateStaticParams() {
  return allUnits.map((u) => ({ level: u.level, unit: String(u.number) }));
}

export const metadata: Metadata = { title: "Arbeitsblatt", robots: { index: false } };

const ART: Record<string, string> = { der: "#2f5d8a", die: "#940d00", das: "#5f7a5a" };

function Bold({ text }: { text: string }) {
  return (
    <>
      {text.split("**").map((p, i) =>
        i % 2 ? (
          <b key={i} style={{ color: "#940d00" }}>
            {p}
          </b>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

/** Mezcla determinista (para que el PDF sea siempre igual) */
function seededShuffle<X>(arr: X[], seed: number) {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Theory({ b }: { b: TheoryBlock }) {
  switch (b.type) {
    case "heading":
      return <h3 className="ws-h3">{b.text.de}</h3>;
    case "text":
      return (
        <p className="ws-p">
          <Bold text={b.text.de} />
        </p>
      );
    case "tip":
      return (
        <p className="ws-tip">
          ✦ <Bold text={b.text.de} />
        </p>
      );
    case "example":
      return <p className="ws-ex">▸ {b.de}</p>;
    case "phrases":
      return (
        <div className="ws-box">
          {b.title && <p className="ws-boxtitle">{b.title.de}</p>}
          {b.items.map((it) => (
            <p key={it.de} className="ws-phrase">
              {it.de}
              {it.note && <span className="ws-note"> ({it.note.de})</span>}
            </p>
          ))}
        </div>
      );
    case "table":
      return (
        <div className="ws-box">
          {b.title && <p className="ws-boxtitle">{b.title.de}</p>}
          <table className="ws-table">
            {b.columns.some((c) => c.trim()) && (
              <thead>
                <tr>
                  {b.columns.map((c, i) => (
                    <th key={i}>{c}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j}>
                      <Bold text={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {b.note && <p className="ws-note-p">{b.note.de}</p>}
        </div>
      );
  }
}

function Lines({ n = 2 }: { n?: number }) {
  return (
    <div>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="ws-line" />
      ))}
    </div>
  );
}

function ExerciseItem({ ex, i, seed }: { ex: Exercise; i: number; seed: number }) {
  const head = (
    <p className="ws-q">
      <span className="ws-num">{i}</span> {ex.prompt.de}
    </p>
  );
  switch (ex.type) {
    case "choice":
    case "listen":
      return (
        <div className="ws-item">
          {head}
          {ex.type === "listen" && <p className="ws-hint">🎧 Hör-Übung: online anhören oder Lehrer/in liest vor: „{ex.audio}“</p>}
          {ex.type === "choice" && ex.sentence && <p className="ws-sent">{ex.sentence}</p>}
          <p className="ws-opts">
            {ex.options.map((o, k) => (
              <span key={k}>
                ☐ {String.fromCharCode(97 + k)}) {o}
              </span>
            ))}
          </p>
        </div>
      );
    case "fill":
      return (
        <div className="ws-item">
          {head}
          <p className="ws-sent">{ex.sentence.replace("___", "______________")}</p>
        </div>
      );
    case "order":
      return (
        <div className="ws-item">
          {head}
          <p className="ws-words">{seededShuffle(ex.words, seed + i).join("  /  ")}</p>
          <Lines n={1} />
        </div>
      );
    case "match": {
      const right = seededShuffle(
        ex.pairs.map((p) => p.tr.es),
        seed + i,
      );
      return (
        <div className="ws-item">
          {head}
          <table className="ws-match">
            <tbody>
              {ex.pairs.map((p, k) => (
                <tr key={k}>
                  <td>
                    {k + 1}. {p.de}
                  </td>
                  <td className="ws-dots">______</td>
                  <td>
                    {String.fromCharCode(97 + k)}) {right[k]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    case "rf":
      return (
        <div className="ws-item">
          {head}
          {ex.context && (
            <div className="ws-context">
              {ex.contextTitle && <b>{ex.contextTitle}</b>}
              {ex.context.split("\n").map((l, k) => (
                <p key={k}>{l}</p>
              ))}
            </div>
          )}
          <p className="ws-sent">
            {ex.statement} <span className="ws-rf">☐ richtig ☐ falsch</span>
          </p>
        </div>
      );
    case "write":
      return (
        <div className="ws-item">
          {head}
          <p className="ws-p">{ex.task.de}</p>
          <Lines n={5} />
        </div>
      );
  }
}

function solution(ex: Exercise, seed: number, i: number): string {
  switch (ex.type) {
    case "choice":
    case "listen":
      return `${String.fromCharCode(97 + ex.answer)}) ${ex.options[ex.answer]}`;
    case "fill":
      return ex.answers[0];
    case "order":
      return ex.words.join(" ");
    case "match": {
      const right = seededShuffle(
        ex.pairs.map((p) => p.tr.es),
        seed + i,
      );
      return ex.pairs.map((p, k) => `${k + 1}–${String.fromCharCode(97 + right.indexOf(p.tr.es))}`).join(", ");
    }
    case "rf":
      return ex.answer ? "richtig" : "falsch";
    case "write":
      return `Muster: ${ex.model.replace(/\n/g, " ")}`;
  }
}

const tri = (t: Tri) => t.de;

export default async function Page({ params }: PageProps<"/guia/de/[level]/[unit]">) {
  const { level: levelId, unit } = await params;
  const n = Number(unit);
  const level = getLevel(levelId);
  const meta = getUnitMeta(levelId, n);
  const content = allUnits.find((u) => u.level === levelId && u.number === n);
  if (!level || !meta || !content) notFound();
  const seed = n * 17 + 3;
  const words = content.vocab.filter((v) => !v.meta);
  const reading = content.readings[content.readings.length - 1];

  return (
    <div className="ws">
      <style>{CSS}</style>
      <header className="ws-cover">
        <div className="ws-brand">
          <span className="ws-logo">◠</span> Isora
        </div>
        <p className="ws-kicker">
          {level.label} · Einheit {n} · Arbeitsblatt
        </p>
        <h1>{meta.title}</h1>
        <p className="ws-sub">
          Name: ______________________ &nbsp;&nbsp; Datum: ____________
        </p>
      </header>

      <section>
        <h2>Ziele</h2>
        <ul className="ws-goals">
          {content.goals.map((g, i) => (
            <li key={i}>☐ {tri(g)}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>1. Erklärung</h2>
        {content.theory.map((b, i) => (
          <Theory key={i} b={b} />
        ))}
      </section>

      <section className="ws-break">
        <h2>2. Wortschatz</h2>
        <table className="ws-vocab">
          <thead>
            <tr>
              <th />
              <th>Deutsch</th>
              <th>Español</th>
              <th>English</th>
            </tr>
          </thead>
          <tbody>
            {words.map((v) => {
              const img = imageFor(v.de);
              return (
                <tr key={v.de}>
                  <td className="ws-img">
                    {img && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt="" width={20} height={20} />
                    )}
                  </td>
                  <td>
                    {v.article && <b style={{ color: ART[v.article] }}>{v.article} </b>}
                    {v.de}
                    {v.plural && <span className="ws-note"> · die {v.plural}</span>}
                  </td>
                  <td>{v.tr.es}</td>
                  <td>{v.tr.en}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {reading && (
        <section className="ws-break">
          <h2>3. Lesen: {reading.title}</h2>
          <div className="ws-reading">
            {reading.lines.map((l, i) => (
              <p key={i}>
                {l.speaker && <b>{l.speaker}: </b>}
                {l.de}
              </p>
            ))}
          </div>
          {reading.questions && (
            <>
              <h3 className="ws-h3">Fragen zum Text</h3>
              {reading.questions.map((q, i) => (
                <div key={i} className="ws-item">
                  <p className="ws-q">
                    <span className="ws-num">{i + 1}</span> {q.q.de}
                  </p>
                  <Lines n={1} />
                </div>
              ))}
            </>
          )}
        </section>
      )}

      <section className="ws-break">
        <h2>4. Übungen</h2>
        {content.exercises.map((ex, i) => (
          <ExerciseItem key={ex.id} ex={ex} i={i + 1} seed={seed} />
        ))}
      </section>

      <section className="ws-break">
        <h2>Lösungen</h2>
        <ol className="ws-solutions">
          {content.exercises.map((ex, i) => (
            <li key={ex.id}>{solution(ex, seed, i + 1)}</li>
          ))}
        </ol>
        {reading?.questions && (
          <>
            <h3 className="ws-h3">Fragen zum Text</h3>
            <ol className="ws-solutions">
              {reading.questions.map((q, i) => (
                <li key={i}>{q.a.de}</li>
              ))}
            </ol>
          </>
        )}
        <p className="ws-foot">Isora · Deutsch lernen · Illustrationen: Twemoji (CC-BY 4.0)</p>
      </section>
    </div>
  );
}

const CSS = `
@page { size: A4; margin: 16mm 15mm 18mm; }
html, body { background: #fff !important; }
body { background-image: none !important; }
.ws { font-family: "Inter Variable", system-ui, sans-serif; color: #1b1714; font-size: 11pt; line-height: 1.45; max-width: 180mm; margin: 0 auto; }
.ws h1, .ws h2, .ws h3 { font-family: "Fraunces Variable", Georgia, serif; color: #940d00; }
.ws-cover { border-bottom: 3px solid #940d00; padding-bottom: 10px; margin-bottom: 14px; }
.ws-brand { font-family: "Fraunces Variable", serif; font-weight: 700; color: #2e2019; font-size: 13pt; }
.ws-logo { display: inline-block; background: #940d00; color: #f5f1e8; border-radius: 50%; width: 20px; height: 20px; text-align: center; line-height: 20px; font-size: 10pt; }
.ws-kicker { text-transform: uppercase; letter-spacing: .12em; font-size: 8.5pt; color: #6e6156; margin: 8px 0 0; }
.ws h1 { font-size: 30pt; margin: 2px 0 6px; }
.ws-sub { color: #4a3326; font-size: 10pt; }
.ws h2 { font-size: 16pt; margin: 18px 0 8px; padding: 4px 10px; background: #2e2019; color: #f5f1e8; border-radius: 6px; }
.ws-h3 { font-size: 12.5pt; margin: 12px 0 4px; }
.ws-p { margin: 4px 0; }
.ws-tip { background: #f3e8d6; border-left: 3px solid #c08a3e; padding: 6px 10px; margin: 6px 0; border-radius: 4px; }
.ws-ex { margin: 3px 0; font-family: "Fraunces Variable", serif; }
.ws-box { border: 1px solid #e2d8c6; border-radius: 6px; padding: 6px 10px; margin: 8px 0; break-inside: avoid; }
.ws-boxtitle { font-weight: 600; color: #4a3326; margin: 0 0 4px; font-size: 10pt; }
.ws-phrase { margin: 2px 0; font-family: "Fraunces Variable", serif; }
.ws-note { color: #6e6156; font-size: 9pt; }
.ws-note-p { font-size: 9.5pt; color: #4a3326; margin: 4px 0 0; }
.ws-table { border-collapse: collapse; width: 100%; font-family: "Fraunces Variable", serif; }
.ws-table th { text-align: left; font-family: "Inter Variable", sans-serif; font-size: 9pt; color: #4a3326; border-bottom: 1px solid #e2d8c6; padding: 3px 6px; }
.ws-table td { border-bottom: 1px solid #f0e9dc; padding: 3px 6px; }
.ws-vocab { border-collapse: collapse; width: 100%; font-size: 10pt; }
.ws-vocab th { text-align: left; background: #f5f1e8; padding: 4px 6px; font-size: 9pt; }
.ws-vocab td { border-bottom: 1px solid #ece4d6; padding: 3px 6px; vertical-align: middle; }
.ws-vocab td:nth-child(2) { font-family: "Fraunces Variable", serif; font-size: 11pt; }
.ws-img { width: 24px; }
.ws-goals { list-style: none; padding: 0; margin: 0; }
.ws-reading { border: 1px solid #e2d8c6; border-radius: 8px; padding: 8px 12px; font-family: "Fraunces Variable", serif; font-size: 11.5pt; }
.ws-reading p { margin: 3px 0; }
.ws-item { margin: 10px 0; break-inside: avoid; }
.ws-q { margin: 0 0 4px; font-weight: 500; }
.ws-num { display: inline-block; width: 18px; height: 18px; border-radius: 50%; background: #940d00; color: #fff; text-align: center; font-size: 8.5pt; line-height: 18px; margin-right: 4px; }
.ws-sent { font-family: "Fraunces Variable", serif; font-size: 12pt; margin: 4px 0 4px 22px; }
.ws-opts { display: flex; flex-wrap: wrap; gap: 6px 22px; margin: 4px 0 0 22px; font-family: "Fraunces Variable", serif; }
.ws-words { margin: 4px 0 4px 22px; font-family: "Fraunces Variable", serif; color: #4a3326; }
.ws-hint { margin: 2px 0 4px 22px; font-size: 9.5pt; color: #6e6156; }
.ws-line { border-bottom: 1px solid #b9ab98; height: 22px; margin-left: 22px; }
.ws-match { margin-left: 22px; border-collapse: collapse; font-family: "Fraunces Variable", serif; }
.ws-match td { padding: 3px 10px 3px 0; }
.ws-dots { color: #b9ab98; }
.ws-context { margin: 4px 0 4px 22px; border: 1.5px dashed #c9a98b; border-radius: 6px; padding: 6px 10px; font-family: "Fraunces Variable", serif; background: #fbf9f4; }
.ws-context p { margin: 1px 0; }
.ws-rf { font-family: "Inter Variable", sans-serif; font-size: 10pt; margin-left: 10px; white-space: nowrap; }
.ws-solutions { font-size: 10.5pt; }
.ws-solutions li { margin: 2px 0; }
.ws-break { break-before: page; }
.ws-foot { margin-top: 24px; font-size: 8.5pt; color: #6e6156; text-align: center; }
`;
