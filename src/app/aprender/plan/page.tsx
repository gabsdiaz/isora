"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/lib/session";
import { useT } from "@/lib/i18n";
import { useLevels } from "@/lib/levels";
import { jumpToSection, useLastVisit, useProgress } from "@/lib/progress";
import { useStudyPlan } from "@/lib/useStudyPlan";
import { buildPlan, focusSkill, recommendedStories, recommendedThemes, type Block, type Pace, type Plan, type Tr } from "@/lib/studyPlan";
import { useMounted } from "@/components/games/shared";
import { ALL_THEMES } from "@/content/de/themes";
import { REASONS } from "@/content/onboarding";

const deMonth = (t: number) => new Date(t).toLocaleDateString("de-DE", { month: "long", year: "numeric" });
const deDay = (t: number) => new Date(t).toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit" });
const CARD = "rounded-[2rem] border border-latte/60 bg-sand p-5 sm:p-6";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PlanPage />
    </Suspense>
  );
}

function PlanPage() {
  const params = useSearchParams();
  const isNew = params.get("neu") === "1";
  const { profile } = useSession();
  const { lang } = useT();
  const T = (es: string, en: string) => (lang === "en" ? en : es);
  const L = (t: Tr) => t[lang];
  const { plan, week, isDone, toggle, replan, stats, now } = useStudyPlan();
  const { levels } = useLevels();
  const mounted = useMounted();

  if (!mounted || !plan || !profile) return <p className="py-20 text-center text-muted">…</p>;

  return (
    <div className="mx-auto max-w-4xl">
      {/* Encabezado */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          {isNew && <p className="mb-3 inline-flex rounded-full bg-yellow-soft px-3 py-1 text-sm text-ink">🎉 {T("¡Tu plan de estudio está listo!", "Your study plan is ready!")}</p>}
          <p className="text-sm text-cocoa">{T(`Hecho a tu medida, ${profile.name}`, `Made for you, ${profile.name}`)}</p>
          <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">Mein Lernplan</h1>
          <p className="mt-2 max-w-2xl text-ink/75">
            {T(
              "Lo armamos con tus respuestas y tu nivel, y se actualiza solo a medida que avanzas.",
              "We built it from your answers and your level, and it updates itself as you progress.",
            )}
          </p>
        </div>
        <div className="flex gap-2 print:hidden">
          <Link href="/bienvenida?edit=1" className="rounded-full border border-cocoa/30 bg-paper px-4 py-2 text-sm text-cocoa transition hover:border-cocoa">
            ✎ {T("Cambiar respuestas", "Change answers")}
          </Link>
          <button type="button" onClick={() => window.print()} className="rounded-full border border-cocoa/30 bg-paper px-4 py-2 text-sm text-cocoa transition hover:border-cocoa">
            🖨️ {T("Imprimir", "Print")}
          </button>
        </div>
      </div>

      <Overview plan={plan} T={T} startedFromTest={Boolean(levels.placement)} />
      <Status plan={plan} T={T} />

      {/* Semana */}
      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">Deine Woche</h2>
            <p className="text-sm text-muted">
              {T("Tu semana, paso a paso. Se marca sola cuando abres cada parte.", "Your week, step by step. It ticks itself off as you open each part.")}
              {week && ` · ${deDay(week.weekStart)} – ${deDay(week.weekStart + 6 * 86_400_000)}`}
            </p>
          </div>
          <button type="button" onClick={replan} className="rounded-full px-3 py-1.5 text-sm text-cocoa transition hover:bg-sand print:hidden">
            ↻ {T("Rearmar semana", "Re-plan week")}
          </button>
        </div>
        {week && (
          <>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-sand-deep/70">
                <div className="h-full rounded-full bg-yellow transition-all" style={{ width: `${stats.minutes ? (stats.doneMinutes / stats.minutes) * 100 : 0}%` }} />
              </div>
              <span className="text-sm tabular-nums text-cocoa">
                {stats.done}/{stats.total} · {stats.doneMinutes}/{stats.minutes} Min.
              </span>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
              {week.days.map((d) => {
                const today = d.date <= now && now < d.date + 86_400_000;
                const past = d.date + 86_400_000 <= now;
                const mins = d.blocks.reduce((a, b) => a + b.minutes, 0);
                return (
                  <div
                    key={d.date}
                    className={`rounded-3xl border p-4 transition ${today ? "border-yellow bg-paper shadow-md shadow-yellow/30 ring-2 ring-yellow/60" : "border-latte/60 bg-sand"} ${past ? "opacity-70" : ""}`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <p className="font-display text-lg capitalize text-ink">
                        {deDay(d.date)}
                        {today && <span className="ml-2 rounded-full bg-yellow px-2 py-0.5 font-sans text-xs font-medium text-ink">Heute</span>}
                      </p>
                      <span className="text-xs text-muted">{mins} Min.</span>
                    </div>
                    <ul className="space-y-1.5">
                      {d.blocks.map((b) => (
                        <BlockRow key={b.id} b={b} done={isDone(b)} onToggle={() => toggle(b.id)} L={L} />
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>

      <Roadmap plan={plan} T={T} />
      <Focus plan={plan} T={T} L={L} />
      {plan.exam && <ExamInfo plan={plan} T={T} examKey={profile.exam} />}
      <PaceAdjuster plan={plan} T={T} />

      <p className="mt-10 text-xs leading-relaxed text-muted">
        {T(
          "Las horas por nivel son estimaciones del Goethe-Institut (en total: A1 ≈ 60–150 h, A2 ≈ 150–260 h, B1 ≈ 260–490 h, B2 ≈ 450–600 h, C1 ≈ 600–750 h); usamos el punto medio. Cada persona avanza distinto, por eso el plan se recalcula con tu avance real.",
          "Hours per level are Goethe-Institut estimates (in total: A1 ≈ 60–150 h, A2 ≈ 150–260 h, B1 ≈ 260–490 h, B2 ≈ 450–600 h, C1 ≈ 600–750 h); we use the midpoint. Everyone learns differently, so the plan recalculates with your real progress.",
        )}{" "}
        <a href="https://www.goethe.de/ins/gb/de/sta/lon/kur/faq.html" target="_blank" rel="noreferrer" className="underline hover:text-wine print:hidden">
          Goethe-Institut
        </a>
      </p>
    </div>
  );
}

function BlockRow({ b, done, onToggle, L }: { b: Block; done: boolean; onToggle: () => void; L: (t: Tr) => string }) {
  const router = useRouter();
  const auto = b.kind === "section" || b.kind === "story" || b.kind === "song";
  const open = () => {
    if (b.level && b.unit && b.sectionIndex !== undefined) jumpToSection(b.level, b.unit, b.sectionIndex);
    router.push(b.href);
  };
  return (
    <li className="flex items-center gap-2">
      <button
        type="button"
        onClick={onToggle}
        disabled={auto && done}
        aria-pressed={done}
        aria-label={done ? "Erledigt" : "Als erledigt markieren"}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 text-xs transition ${done ? "border-sage bg-sage text-cream" : "border-latte bg-paper hover:border-cocoa"}`}
      >
        {done && "✓"}
      </button>
      <button type="button" onClick={open} className={`group flex min-w-0 flex-1 items-center gap-2 rounded-xl px-2 py-1.5 text-left transition hover:bg-cream-deep ${done ? "opacity-60" : ""}`}>
        <span aria-hidden="true">{b.emoji}</span>
        <span className="min-w-0 flex-1">
          <span className={`block truncate text-[15px] text-ink ${done ? "line-through decoration-cocoa/40" : ""}`}>
            {b.de}
            {b.part && <span className="text-muted"> · Teil {b.part}</span>}
            {b.unit && b.unit < 100 && <span className="text-muted"> · E{b.unit}</span>}
          </span>
          <span className="block truncate text-xs text-muted">{L(b.tr)}</span>
        </span>
        <span className="shrink-0 text-xs tabular-nums text-muted">{b.minutes}′</span>
        <span className="shrink-0 text-cocoa opacity-0 transition group-hover:opacity-100" aria-hidden="true">
          →
        </span>
      </button>
    </li>
  );
}

function Overview({ plan, T, startedFromTest }: { plan: Plan; T: (es: string, en: string) => string; startedFromTest: boolean }) {
  const total = plan.doneHours + plan.remainingHours;
  const pct = total ? (plan.doneHours / total) * 100 : 0;
  const stats = [
    { emoji: "🎯", label: "Ziel", value: plan.targetLabel, sub: plan.exam && plan.exam !== plan.targetLabel ? plan.exam : `${T("nivel", "level")} ${plan.target.label}` },
    { emoji: "📍", label: "Start", value: plan.start.label, sub: startedFromTest ? T("según tu test", "from your test") : T("desde cero", "from scratch") },
    { emoji: "⏱️", label: "Pro Woche", value: `${plan.pace.minutes} Min. × ${plan.pace.days}`, sub: `≈ ${plan.weeklyHours.toFixed(1).replace(".0", "")} ${T("horas", "hours")}` },
    { emoji: "🏁", label: "Ziel erreicht", value: deMonth(plan.finishAt), sub: T("con tu ritmo actual", "at your current pace") },
  ];
  return (
    <section className={`mt-6 ${CARD}`}>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
              {s.emoji} {s.label}
            </p>
            <p className="mt-1 font-display text-xl leading-tight text-ink sm:text-2xl">{s.value}</p>
            <p className="text-xs text-muted">{s.sub}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-3">
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-paper">
          <div className="h-full rounded-full bg-yellow" style={{ width: `${Math.max(pct, 1.5)}%` }} />
        </div>
        <span className="text-sm tabular-nums text-cocoa">
          {Math.round(plan.doneHours)} / {Math.round(total)} Std.
        </span>
      </div>
    </section>
  );
}

function Status({ plan, T }: { plan: Plan; T: (es: string, en: string) => string }) {
  const { profile, nativeLang, saveProfile } = useSession();
  const date = (t: number) => new Date(t).toLocaleDateString(T("es-CO", "en-GB"), { month: "long", year: "numeric" });
  const tone = { ontime: "bg-sage-soft", tight: "bg-yellow-soft/80", ambitious: "bg-wine-soft", free: "bg-sand" }[plan.status];
  const apply = (p: Pace) => profile && saveProfile({ ...profile, minutes: p.minutes, days: p.days }, nativeLang ?? "es");

  let msg: string;
  if (plan.alreadyThere && plan.examPrepHours)
    msg = T(
      `¡Según tu test ya tienes el nivel de tu meta! 🎉 Tu plan se enfoca en el entrenamiento para el examen (≈ ${plan.examPrepHours} h).`,
      `According to your test you already have your goal level! 🎉 Your plan focuses on exam training (≈ ${plan.examPrepHours} h).`,
    );
  else if (plan.status === "ontime")
    msg = T(
      `✓ ¡Vas a tiempo! Con tu ritmo terminas aprox. en ${date(plan.finishAt)}, antes de tu fecha (${date(plan.deadlineAt!)}).`,
      `✓ You're on track! At your pace you'll finish around ${date(plan.finishAt)}, before your date (${date(plan.deadlineAt!)}).`,
    );
  else if (plan.status === "tight")
    msg = T(
      `Para llegar a tu fecha (${date(plan.deadlineAt!)}) necesitas unos ${plan.neededMinutes} minutos al día, ${plan.pace.days} días por semana. Con tu ritmo actual terminarías en ${date(plan.finishAt)}.`,
      `To reach your date (${date(plan.deadlineAt!)}) you need about ${plan.neededMinutes} minutes a day, ${plan.pace.days} days a week. At your current pace you'd finish in ${date(plan.finishAt)}.`,
    );
  else if (plan.status === "ambitious")
    msg = T(
      `Tu fecha (${date(plan.deadlineAt!)}) es muy ambiciosa: te faltan unas ${Math.round(plan.remainingHours)} horas de estudio, es decir ~${Math.round((plan.neededMinutes ?? 0) / 6) / 10} h al día. Te proponemos un ritmo intenso pero realista, o mover la fecha (puedes hacerlo en «Cambiar respuestas»).`,
      `Your date (${date(plan.deadlineAt!)}) is very ambitious: you have about ${Math.round(plan.remainingHours)} hours of study left, ~${Math.round((plan.neededMinutes ?? 0) / 6) / 10} h a day. We suggest an intense but realistic pace, or moving the date (in "Change answers").`,
    );
  else
    msg = T(
      `Sin prisa 🌱 Con tu ritmo llegas a tu meta aprox. en ${date(plan.finishAt)}. Si un día quieres ir más rápido, aquí tienes otras opciones:`,
      `No rush 🌱 At your pace you'll reach your goal around ${date(plan.finishAt)}. If you ever want to go faster, here are other options:`,
    );

  const names = { current: ["Dein Tempo", T("tu ritmo actual", "your current pace")], recommended: ["Empfohlen", T("recomendado", "recommended")], intensive: ["Intensiv", T("intensivo", "intensive")] };
  return (
    <section className={`mt-4 rounded-[2rem] p-5 sm:p-6 ${tone}`}>
      <p className="text-[15px] leading-relaxed text-ink">{msg}</p>
      {plan.scenarios.length > 1 && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {plan.scenarios.map((s) => (
            <div key={s.id} className={`flex flex-col rounded-3xl border p-4 ${s.id === "current" ? "border-cocoa/30 bg-paper/70" : "border-latte/60 bg-paper"}`}>
              <p className="font-display text-lg text-ink">
                {names[s.id][0]} <span className="font-sans text-xs text-muted">· {names[s.id][1]}</span>
              </p>
              <p className="mt-1 text-sm text-cocoa">
                {s.minutes} Min. × {s.days} {T("días", "days")}
              </p>
              <p className="text-sm text-ink">
                🏁 {deMonth(s.finishAt)}
                {plan.deadlineAt && (s.finishAt <= plan.deadlineAt ? <span className="text-sage"> ✓</span> : null)}
              </p>
              {s.id !== "current" && (
                <button type="button" onClick={() => apply(s)} className="mt-3 rounded-full bg-wine px-4 py-2 text-sm font-medium text-cream transition hover:bg-wine-light print:hidden">
                  {T("Usar este ritmo", "Use this pace")}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Roadmap({ plan, T }: { plan: Plan; T: (es: string, en: string) => string }) {
  const chip = (c: "ready" | "soon" | "later") =>
    c === "ready" ? null : (
      <span className="rounded-full bg-paper px-2 py-0.5 text-[11px] text-cocoa">{c === "soon" ? T("contenido en producción", "content in production") : T("más adelante en Isora", "later in Isora")}</span>
    );
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold">Dein Weg zum Ziel</h2>
      <p className="text-sm text-muted">{T("Cada etapa con sus horas aproximadas y cuándo la terminarías.", "Each stage with its approximate hours and when you'd finish it.")}</p>
      <ol className="relative mt-5 space-y-3 border-l-2 border-dashed border-latte pl-6">
        {plan.stages.map((s) => (
          <li key={s.stage.id} className="relative">
            <span
              className={`absolute -left-[33px] top-4 flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                s.status === "done" ? "border-sage bg-sage" : s.status === "current" ? "border-wine bg-yellow" : "border-latte bg-paper"
              }`}
            />
            <div className={`rounded-3xl border p-4 ${s.status === "current" ? "border-wine/50 bg-paper shadow-sm" : "border-latte/60 bg-sand"}`}>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-xl text-ink">{s.stage.label}</p>
                {s.status === "current" && <span className="rounded-full bg-yellow px-2 py-0.5 text-[11px] font-medium text-ink">{T("ahora", "now")}</span>}
                {s.status === "done" && <span className="rounded-full bg-sage-soft px-2 py-0.5 text-[11px] text-sage">✓</span>}
                {chip(s.stage.content)}
                <span className="ml-auto text-sm text-cocoa">
                  ≈ {Math.round(s.remaining)} Std. · bis {deMonth(s.endAt)}
                </span>
              </div>
              {s.status === "current" && s.pct > 0 && (
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand-deep/70">
                  <div className="h-full rounded-full bg-yellow" style={{ width: `${s.pct * 100}%` }} />
                </div>
              )}
            </div>
          </li>
        ))}
        {plan.examAt && (
          <li className="relative">
            <span className="absolute -left-[33px] top-4 h-4 w-4 rounded-full border-2 border-wine bg-paper" />
            <div className="rounded-3xl border border-latte/60 bg-sand p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-xl text-ink">📝 Prüfungstraining</p>
                <span className="ml-auto text-sm text-cocoa">≈ {plan.examPrepHours} Std.</span>
              </div>
              <p className="mt-1 text-sm text-cocoa">{T("Modelos de examen, tiempo cronometrado y las 4 habilidades.", "Mock exams, timed practice and all 4 skills.")}</p>
            </div>
          </li>
        )}
        <li className="relative">
          <span className="absolute -left-[35px] top-3 text-xl">🎓</span>
          <div className="rounded-3xl border-2 border-wine/60 bg-paper p-4">
            <p className="font-display text-xl text-wine">
              {plan.exam ?? plan.targetLabel} · ca. {deMonth(plan.finishAt)}
            </p>
            {plan.deadlineAt && (
              <p className="text-sm text-cocoa">
                {T("Tu fecha deseada", "Your target date")}: {deMonth(plan.deadlineAt)} {plan.finishAt <= plan.deadlineAt ? "✓" : ""}
              </p>
            )}
          </div>
        </li>
      </ol>
      {plan.stages.some((s) => s.stage.content !== "ready") && (
        <p className="mt-3 text-xs text-muted">
          {T(
            "Hoy Isora tiene completo todo el A1 (A1.1 y A1.2); los siguientes niveles se van abriendo. Tu plan se ajusta solo cuando lleguen.",
            "Today Isora has all of A1 complete (A1.1 and A1.2); the next levels are opening step by step. Your plan adjusts when they arrive.",
          )}
        </p>
      )}
    </section>
  );
}

const REASON_TIPS: Record<string, Tr> = {
  study: { es: "Para la universidad necesitas escribir textos formales: usa cada semana el Schreiben con corrección por IA.", en: "University needs formal writing: use Schreiben with AI correction every week." },
  work: { es: "Practica en Sprechen cómo presentarte y hablar de tu trabajo; guarda en tus tarjetas las palabras de tu profesión.", en: "Practise introducing yourself and talking about your job in Sprechen." },
  live: { es: "Practica situaciones reales (citas, compras, trámites) con Hören y Sprechen.", en: "Practise real situations (appointments, shopping, paperwork) with Hören and Sprechen." },
  exam: { es: "Desde la mitad del plan, haz un mini-test cada mes para medir tu avance.", en: "From halfway through, take a mini test every month to measure your progress." },
  travel: { es: "Aprende frases completas para viajar y dilas en voz alta: así salen solas cuando las necesitas.", en: "Learn whole travel phrases and say them out loud so they come naturally." },
  family: { es: "Habla cada día un poquito en alemán con tu familia o pareja, aunque sean tres frases.", en: "Speak a little German every day with your family or partner, even three sentences." },
  culture: { es: "Escucha música y series en alemán con subtítulos en alemán: entrena el oído sin darte cuenta.", en: "Listen to German music and series with German subtitles." },
  challenge: { es: "Mejor 10 minutos todos los días que 2 horas una vez por semana: cuida tu racha.", en: "Better 10 minutes every day than 2 hours once a week: keep your streak." },
};

function Focus({ plan, T, L }: { plan: Plan; T: (es: string, en: string) => string; L: (t: Tr) => string }) {
  const { profile } = useSession();
  const { levels } = useLevels();
  const f = focusSkill(profile!, levels);
  const sec = levels.placement?.sections ?? {};
  const weakVal = sec[f.section as keyof typeof sec];
  const stories = recommendedStories(profile?.interests).slice(0, 3);
  const themeLevel = plan.current?.level === "a1-2" ? "a1-2" : "a1-1";
  const themes = recommendedThemes(profile?.interests, themeLevel)
    .map((id) => ALL_THEMES.find((t) => t.id === id))
    .filter(Boolean)
    .slice(0, 3);
  const reasonTips = (profile?.reasons ?? []).filter((r) => REASON_TIPS[r]).slice(0, 2);

  const tips: { emoji: string; title: string; body: string }[] = [
    {
      emoji: f.emoji,
      title: f.de,
      body:
        typeof weakVal === "number" && weakVal < 70
          ? T(`En tu test, esta fue tu parte más floja (${weakVal} %). Por eso cada unidad trae 10 minutos extra de esto.`, `This was your weakest part in the test (${weakVal}%). That's why every unit has 10 extra minutes of it.`)
          : T(`Por lo que quieres lograr, cada unidad trae 10 minutos extra de esto: ${L(f.tr).charAt(0).toLowerCase() + L(f.tr).slice(1)}.`, `Because of your goals, every unit has 10 extra minutes of this: ${L(f.tr).charAt(0).toLowerCase() + L(f.tr).slice(1)}.`),
    },
    ...reasonTips.map((r) => {
      const c = REASONS.find((x) => x.id === r)!;
      return { emoji: c.emoji ?? "💡", title: L(c.t), body: L(REASON_TIPS[r]) };
    }),
    {
      emoji: "🔁",
      title: "Jeden Tag wiederholen",
      body: T(
        "Lo que más funciona: estudiar poquito pero todos los días y repasar tus tarjetas (repetición espaciada). Por eso cada día empieza con 5 minutos de tarjetas.",
        "What works best: a little every day plus reviewing your cards (spaced repetition). That's why each day starts with 5 minutes of cards.",
      ),
    },
  ];
  if (plan.weeklyHours >= 3 || plan.exam)
    tips.push({
      emoji: "🧑‍🏫",
      title: "Einzelunterricht",
      body: T("Una clase 1:1 al mes con una Lehrkraft te ayuda muchísimo con Sprechen y Schreiben.", "A 1:1 class a month with a teacher helps a lot with speaking and writing."),
    });

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold">Deine Schwerpunkte</h2>
      <p className="text-sm text-muted">{T("Lo que tu plan refuerza, según tus respuestas.", "What your plan reinforces, based on your answers.")}</p>
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {tips.map((t) => (
          <div key={t.title} className="flex gap-3 rounded-3xl border border-latte/60 bg-sand p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-paper text-xl" aria-hidden="true">
              {t.emoji}
            </span>
            <div>
              <p className="font-display text-lg text-ink">{t.title}</p>
              <p className="text-sm text-cocoa">{t.body}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-3xl border border-latte/60 bg-sand p-4">
        <p className="font-display text-lg text-ink">
          Für dich ausgesucht <span className="font-sans text-sm text-muted">· {T("según tus intereses", "based on your interests")}</span>
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {stories.map((s) => (
            <Link key={s.id} href={`/aprender/geschichten/${s.id}`} className="rounded-full bg-paper px-3 py-1.5 text-sm text-ink transition hover:bg-cream-deep">
              {s.emoji} {s.title}
            </Link>
          ))}
          {themes.map((t) => (
            <Link key={t!.id} href={`/aprender/spiele/memory/${t!.id}`} className="rounded-full bg-paper px-3 py-1.5 text-sm text-ink transition hover:bg-cream-deep">
              🎮 {t!.emoji} {t!.de}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const EXAM_INFO: Record<string, Tr> = {
  goethe: {
    es: "Tiene cuatro partes: Lesen, Hören, Schreiben y Sprechen. Se aprueba con el 60 %. Desde el B1, los módulos se pueden presentar por separado.",
    en: "Four parts: Lesen, Hören, Schreiben and Sprechen. You pass with 60%. From B1 on, modules can be taken separately.",
  },
  telc: {
    es: "Partes: Leseverstehen, Sprachbausteine (gramática), Hörverstehen, Schreiben y examen oral.",
    en: "Parts: reading, Sprachbausteine (grammar), listening, writing and an oral exam.",
  },
  "ÖSD": { es: "Examen austriaco reconocido internacionalmente: Lesen, Hören, Schreiben y Sprechen.", en: "Internationally recognised Austrian exam: reading, listening, writing and speaking." },
  TestDaF: {
    es: "Lesen, Hören, Schreiben y Sprechen, en formato digital. Para estudiar, las universidades suelen pedir TDN 4 en las cuatro partes.",
    en: "Reading, listening, writing and speaking, in digital format. Universities usually ask for TDN 4 in all four parts.",
  },
  DSH: {
    es: "Lo organiza cada universidad alemana, con parte escrita y oral. La mayoría pide DSH-2 para empezar a estudiar.",
    en: "Run by each German university, with a written and an oral part. Most ask for DSH-2 to start studying.",
  },
};

function ExamInfo({ plan, T, examKey }: { plan: Plan; T: (es: string, en: string) => string; examKey?: string }) {
  const key = examKey?.startsWith("Goethe") ? "goethe" : (examKey ?? "");
  const info = EXAM_INFO[key];
  return (
    <section className={`mt-10 ${CARD}`}>
      <h2 className="text-2xl font-semibold">📝 {plan.exam}</h2>
      {info && <p className="mt-2 text-cocoa">{T(info.es, info.en)}</p>}
      <p className="mt-2 text-cocoa">
        {T(
          `Las últimas ≈ ${plan.examPrepHours} horas de tu plan son de entrenamiento para el examen. Con tu ritmo, el examen te quedaría para ${deMonth(plan.finishAt)}: inscríbete con tiempo, los cupos se llenan.`,
          `The last ≈ ${plan.examPrepHours} hours of your plan are exam training. At your pace, the exam would be around ${deMonth(plan.finishAt)}: register early, places fill up.`,
        )}
      </p>
    </section>
  );
}

function PaceAdjuster({ plan, T }: { plan: Plan; T: (es: string, en: string) => string }) {
  const { profile, nativeLang, saveProfile } = useSession();
  const { levels } = useLevels();
  const { progress } = useProgress();
  const { last } = useLastVisit();
  const [pace, setPace] = useState<Pace>(plan.pace);
  const [now] = useState(() => Date.now());
  const preview = useMemo(() => (profile ? buildPlan(profile, levels, progress, last, now, pace) : null), [profile, levels, progress, last, now, pace]);
  const changed = pace.minutes !== plan.pace.minutes || pace.days !== plan.pace.days;

  return (
    <section className={`mt-10 print:hidden ${CARD}`}>
      <h2 className="text-2xl font-semibold">Tempo anpassen</h2>
      <p className="text-sm text-muted">{T("Mueve tu ritmo y mira cómo cambia tu fecha.", "Move your pace and see how your date changes.")}</p>
      <div className="mt-5 grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="flex items-baseline justify-between text-sm text-cocoa">
            Minuten pro Tag <span className="font-display text-2xl text-ink">{pace.minutes}</span>
          </span>
          <input
            type="range"
            min={5}
            max={180}
            step={5}
            value={pace.minutes}
            onChange={(e) => setPace((p) => ({ ...p, minutes: Number(e.target.value) }))}
            className="mt-2 w-full accent-wine"
          />
        </label>
        <div>
          <span className="text-sm text-cocoa">Tage pro Woche</span>
          <div className="mt-2 flex gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setPace((p) => ({ ...p, days: d }))}
                aria-pressed={pace.days === d}
                className={`h-10 flex-1 rounded-xl text-sm font-medium transition ${pace.days === d ? "bg-wine text-cream" : "bg-paper text-ink hover:bg-cream-deep"}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>
      {preview && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-paper px-4 py-3">
          <p className="text-ink">
            🏁 {T("Llegarías aprox. en", "You'd get there around")} <b>{deMonth(preview.finishAt)}</b>
            {preview.deadlineAt && (preview.finishAt <= preview.deadlineAt ? <span className="text-sage"> · {T("a tiempo ✓", "on time ✓")}</span> : <span className="text-wine"> · {T("después de tu fecha", "after your date")}</span>)}
          </p>
          <button
            type="button"
            disabled={!changed}
            onClick={() => profile && saveProfile({ ...profile, minutes: pace.minutes, days: pace.days }, nativeLang ?? "es")}
            className="rounded-full bg-wine px-5 py-2 text-sm font-medium text-cream transition hover:bg-wine-light disabled:opacity-40"
          >
            {T("Guardar mi ritmo", "Save my pace")}
          </button>
        </div>
      )}
    </section>
  );
}
