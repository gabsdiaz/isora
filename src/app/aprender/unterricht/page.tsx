"use client";

import { useState } from "react";
import { TEACHERS, type Teacher } from "@/content/teachers";
import { useT } from "@/lib/i18n";
import { TeacherTabs } from "@/components/chat/TeacherTabs";

const TOPICS = [
  { emoji: "❓", de: "Fragen zu einer Einheit", tr: { es: "Resolver dudas de una unidad", en: "Questions about a unit" } },
  { emoji: "🗣️", de: "Sprechen üben", tr: { es: "Practicar la conversación", en: "Speaking practice" } },
  { emoji: "📝", de: "Texte korrigieren", tr: { es: "Corregir tus textos", en: "Get your writing corrected" } },
  { emoji: "🎓", de: "Prüfungstraining", tr: { es: "Entrenar para el examen", en: "Exam training" } },
];

const STEPS = [
  { de: "Termin wählen", tr: { es: "Elige un horario libre", en: "Pick a free slot" } },
  { de: "Bestätigung per E-Mail – mit Google-Meet-Link", tr: { es: "Recibes la confirmación por correo con el enlace de Google Meet", en: "You get an email confirmation with the Google Meet link" } },
  { de: "Online-Stunde: einfach auf den Link klicken", tr: { es: "La clase es en línea: solo entra al enlace", en: "The lesson is online: just open the link" } },
];

/** Unterricht: clases 1:1 con una Lehrkraft, reservadas con Google Calendar + Meet. */
export default function Lessons() {
  const { g, t, loc } = useT();
  const [selected, setSelected] = useState(TEACHERS[0]?.id);
  const teacher = TEACHERS.find((x) => x.id === selected) ?? TEACHERS[0];

  return (
    <div>
      <TeacherTabs />
      <p className="text-sm text-muted">{t("lessons")}</p>
      <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">{g("lessonTitle")}</h1>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-[2rem] border border-latte/60 bg-sand p-6">
          <p className="font-display text-2xl text-ink">{g("lessonQuestion")}</p>
          <p className="mt-2 text-cocoa">{g("lessonBody")}</p>
          <p className="mt-3 text-sm italic text-muted">{t("lessonQuestion")} {t("lessonBody")}</p>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {TOPICS.map((x) => (
              <li key={x.de} className="flex items-center gap-3 rounded-2xl bg-paper px-3 py-2.5">
                <span className="text-xl" aria-hidden="true">
                  {x.emoji}
                </span>
                <span>
                  <span className="block text-sm font-medium text-ink">{x.de}</span>
                  <span className="block text-xs text-muted">{loc(x.tr)}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[2rem] border border-line bg-paper p-6">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-wine">So funktioniert&apos;s</p>
          <ol className="mt-3 space-y-4">
            {STEPS.map((s, i) => (
              <li key={s.de} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-wine-soft text-sm font-semibold text-wine">{i + 1}</span>
                <span>
                  <span className="block text-sm font-medium text-ink">{s.de}</span>
                  <span className="block text-xs text-muted">{loc(s.tr)}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-5 flex items-center gap-2 text-xs text-muted">
            <span aria-hidden="true">📅</span> Google Calendar · <span aria-hidden="true">🎥</span> Google Meet
          </p>
        </div>
      </div>

      <h2 className="mt-10 text-xl font-semibold">{g("chooseTeacher")}</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TEACHERS.map((x) => (
          <TeacherCard key={x.id} teacher={x} active={x.id === teacher?.id} onSelect={() => setSelected(x.id)} />
        ))}
      </div>

      {teacher && <Booking teacher={teacher} />}
    </div>
  );
}

function TeacherCard({ teacher, active, onSelect }: { teacher: Teacher; active: boolean; onSelect: () => void }) {
  const { loc } = useT();
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`rounded-3xl border p-5 text-left transition ${active ? "border-wine bg-wine-soft/60 shadow-sm" : "border-line bg-paper hover:border-cocoa-light"}`}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-paper text-2xl shadow-sm" aria-hidden="true">
          {teacher.emoji}
        </span>
        <span>
          <span className="block font-display text-xl text-wine">{teacher.name || teacher.role.de}</span>
          <span className="block text-xs text-muted">{teacher.name ? teacher.role.de : loc(teacher.role.tr)}</span>
        </span>
      </div>
      <p className="mt-3 text-xs text-cocoa">🌐 {teacher.languages.join(" · ")}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {teacher.focus.map((f) => (
          <span key={f.de} title={loc(f.tr)} className="rounded-full bg-cream-deep px-2.5 py-1 text-xs text-cocoa">
            {f.de}
          </span>
        ))}
      </div>
    </button>
  );
}

function Booking({ teacher }: { teacher: Teacher }) {
  const { g, t } = useT();
  return (
    <section className="mt-6 overflow-hidden rounded-[2rem] border border-line bg-paper shadow-sm" aria-label={g("bookNow")}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
        <p className="font-display text-xl text-ink">
          {g("bookNow")} · {teacher.name || teacher.role.de}
        </p>
        {teacher.bookingUrl && (
          <a href={teacher.bookingUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-wine px-5 py-2 text-sm font-medium text-cream hover:bg-wine-light">
            {g("openCalendar")} ↗
          </a>
        )}
      </div>
      {teacher.embedUrl ? (
        <iframe src={teacher.embedUrl} title={g("bookNow")} className="h-[680px] w-full border-0 bg-white" loading="lazy" />
      ) : teacher.bookingUrl ? (
        <div className="px-6 py-10 text-center">
          <p className="text-4xl">📅</p>
          <p className="mt-2 text-cocoa">{g("bookingHint")}</p>
          <p className="mt-1 text-sm text-muted">{t("bookingHint")}</p>
        </div>
      ) : (
        <div className="px-6 py-10 text-center">
          <p className="text-4xl">🗓️</p>
          <p className="mt-2 font-display text-xl text-wine">{g("bookingSoon")}</p>
          <p className="mt-1 text-sm text-muted">{t("bookingSoon")}</p>
        </div>
      )}
    </section>
  );
}
