"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, type NativeLang, type StudentProfile } from "@/lib/session";
import { Logo } from "@/components/Logo";
import { FullPageLoader } from "@/components/AppShell";
import { SpeakButton } from "@/components/SpeakButton";
import { AGES, DAYS, DEADLINES, EXAMS, GOALS, INTERESTS, LANGS, Q, REASONS, TIMES, type Choice } from "@/content/onboarding";
import { useLevels } from "@/lib/levels";

type Step = "lang" | "name" | "age" | "learn" | "why" | "goal" | "time" | "interests" | "done";
const STEPS: Step[] = ["lang", "name", "age", "learn", "why", "goal", "time", "interests", "done"];

type Txt = { es: string; en: string };
const UI = {
  next: { es: "Weiter", en: "Weiter" },
  back: { es: "Zurück", en: "Zurück" },
  step: { es: "Paso", en: "Step" },
  of: { es: "de", en: "of" },
  namePh: { es: "Tu nombre", en: "Your name" },
  psst: { es: "Psst… cada pregunta ya te enseña un poco de alemán 😉", en: "Psst… every question already teaches you a bit of German 😉" },
  soon: { es: "Pronto", en: "Soon" },
  soonNote: {
    es: "¡Genial! Te avisaremos cuando ese idioma esté listo. Mientras tanto puedes empezar con alemán.",
    en: "Great! We'll let you know when that language is ready. Meanwhile you can start with German.",
  },
  whichExam: { es: "¿Cuál examen?", en: "Which exam?" },
  notSure: { es: "Aún no sé", en: "Not sure yet" },
  when: { es: "¿Para cuándo?", en: "By when?" },
  doneTitle: { es: "¡Listo! Este es tu plan", en: "All set! Here's your plan" },
  planGoal: { es: "Meta", en: "Goal" },
  planTime: { es: "Tu ritmo", en: "Your pace" },
  planWhy: { es: "Porque", en: "Because" },
  planLikes: { es: "Te gusta", en: "You like" },
  doneNext: {
    es: "Con esto armamos tu plan de estudio personalizado: semana a semana, con tu meta, tu ritmo y tus temas favoritos.",
    en: "With this we'll build your personalised study plan: week by week, with your goal, your pace and your favourite topics.",
  },
  daysQ: { es: "¿Cuántos días a la semana?", en: "How many days a week?" },
  hoursWeek: { es: "horas por semana", en: "hours a week" },
  go: { es: "📅 Mein Lernplan →", en: "📅 Mein Lernplan →" },
  save: { es: "Guardar cambios", en: "Save changes" },
  edit: { es: "Cambiar respuestas", en: "Change answers" },
} satisfies Record<string, Txt>;

function Onboarding() {
  const { user, loading } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) router.replace("/");
  }, [loading, user, router]);
  if (loading || !user) return <FullPageLoader />;
  // Montamos el cuestionario cuando ya cargó el perfil, para rellenarlo con lo guardado
  return <Wizard key={user.uid} />;
}

function Wizard() {
  const { user: maybeUser, nativeLang, profile, saveProfile } = useSession();
  const user = maybeUser!;
  const router = useRouter();
  const params = useSearchParams();
  const editing = params.get("edit") === "1";

  const [lang, setLang] = useState<NativeLang>(nativeLang ?? (typeof navigator !== "undefined" && navigator.language?.startsWith("en") ? "en" : "es"));
  const [step, setStep] = useState(0);
  const [name, setName] = useState(profile?.name ?? (user && user.name !== "Estudiante" && user.name !== "Estudiante demo" ? user.name.split(" ")[0] : ""));
  const [age, setAge] = useState(profile?.age ?? "");
  const [languages, setLanguages] = useState<string[]>(profile?.languages ?? ["de"]);
  const [reasons, setReasons] = useState<string[]>(profile?.reasons ?? []);
  const [goal, setGoal] = useState(profile?.goal ?? "");
  const [exam, setExam] = useState(profile?.exam ?? "");
  const [deadline, setDeadline] = useState(profile?.deadline ?? "");
  const [minutes, setMinutes] = useState<number | null>(profile?.minutes ?? null);
  const [days, setDays] = useState<number>(profile?.days ?? 5);
  const { levels } = useLevels();
  const [interests, setInterests] = useState<string[]>(profile?.interests ?? []);
  const [saving, setSaving] = useState(false);
  const auto = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (auto.current) clearTimeout(auto.current);
    },
    [],
  );

  const L = (t: Txt) => t[lang];
  const id = STEPS[step];

  const valid: Record<Step, boolean> = {
    lang: true,
    name: name.trim().length > 0,
    age: Boolean(age),
    learn: languages.length > 0,
    why: reasons.length > 0,
    goal: Boolean(goal) && (goal !== "exam" || Boolean(exam)) && Boolean(deadline),
    time: minutes !== null,
    interests: interests.length > 0,
    done: true,
  };

  const go = (d: number) => setStep((s) => Math.min(Math.max(s + d, 0), STEPS.length - 1));
  // Preguntas de una sola respuesta: avanzan solas tras elegir
  const pickAndGo = (fn: () => void) => {
    fn();
    if (auto.current) clearTimeout(auto.current);
    auto.current = setTimeout(() => go(1), 280);
  };
  const toggle = (list: string[], set: (v: string[]) => void, v: string) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const finish = async () => {
    setSaving(true);
    const p: StudentProfile = {
      name: name.trim(),
      age,
      languages,
      reasons,
      goal,
      exam: goal === "exam" ? exam : undefined,
      deadline,
      minutes: minutes ?? undefined,
      days,
      interests,
    };
    // Firestore no acepta undefined
    (Object.keys(p) as (keyof StudentProfile)[]).forEach((k) => p[k] === undefined && delete p[k]);
    await saveProfile(p, lang);
    // Con las respuestas armamos el plan de estudio; si aún no sabemos su nivel, primero test o desde cero
    router.replace(editing ? "/aprender/plan" : levels.startChoice ? "/aprender/plan?neu=1" : "/aprender/start");
  };

  const q = id !== "done" ? Q[id] : null;
  const total = STEPS.length - 1;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex h-20 w-full max-w-2xl items-center justify-between px-4 sm:px-6">
        <Logo />
        {id !== "done" && (
          <span className="text-sm text-muted">
            {L(UI.step)} {step + 1} {L(UI.of)} {total}
          </span>
        )}
      </header>

      <div className="mx-auto w-full max-w-2xl px-4 sm:px-6">
        <div className="h-2 overflow-hidden rounded-full bg-sand-deep/70" role="progressbar" aria-valuenow={step} aria-valuemin={0} aria-valuemax={total}>
          <div className="h-full rounded-full bg-yellow transition-all duration-500" style={{ width: `${(Math.min(step, total) / total) * 100}%` }} />
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
        <div key={id} className="motion-safe:animate-[isora-in_.35s_ease-out]">
          {q && (
            <>
              {step === 0 && (
                <p className="mb-2 text-sm text-cocoa">
                  Hallo{user.name && !user.name.startsWith("Estudiante") ? `, ${user.name.split(" ")[0]}` : ""}! 👋 {lang === "en" ? "Let's get to know you." : "Vamos a conocerte."}
                </p>
              )}
              <div className="flex items-start gap-3">
                <h1 className="font-display text-3xl font-semibold leading-tight text-wine sm:text-4xl">{q.de}</h1>
                <SpeakButton text={q.de} voice="f" className="mt-1.5" />
              </div>
              <p className="mt-2 text-ink/75">{L(q.t)}</p>
            </>
          )}

          <div className="mt-8">
            {id === "lang" && (
              <div className="space-y-3" role="radiogroup">
                {(
                  [
                    { id: "es", code: "ES", label: "Español", sub: "Las explicaciones y subtítulos estarán en español" },
                    { id: "en", code: "EN", label: "English", sub: "Explanations and subtitles will be in English" },
                  ] as const
                ).map((o) => (
                  <BigOption key={o.id} active={lang === o.id} badge={o.code} title={o.label} sub={o.sub} onClick={() => pickAndGo(() => setLang(o.id))} />
                ))}
              </div>
            )}

            {id === "name" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (valid.name) go(1);
                }}
              >
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 40))}
                  placeholder={L(UI.namePh)}
                  autoComplete="given-name"
                  name="given-name"
                  className="w-full rounded-2xl border border-line bg-paper px-5 py-4 font-display text-2xl text-ink outline-none transition placeholder:text-muted/60 focus:border-wine"
                />
                <p className="mt-4 min-h-[2rem] font-display text-xl text-cocoa">
                  {name.trim() ? (
                    <>
                      → Ich heiße <span className="text-wine">{name.trim()}</span>. 😊
                    </>
                  ) : (
                    <span className="text-muted">→ Ich heiße …</span>
                  )}
                </p>
              </form>
            )}

            {id === "age" && (
              <div className="flex flex-wrap gap-2.5">
                {AGES.map((a) => (
                  <Chip key={a.id} c={a} lang={lang} active={age === a.id} onClick={() => pickAndGo(() => setAge(a.id))} />
                ))}
              </div>
            )}

            {id === "learn" && (
              <div className="space-y-3">
                {LANGS.map((o) => (
                  <BigOption
                    key={o.id}
                    multi
                    active={languages.includes(o.id)}
                    badge={o.code}
                    title={`${o.de} · ${L(o.t)}`}
                    sub={o.sub ? L(o.sub) : undefined}
                    tag={o.soon ? L(UI.soon) : undefined}
                    onClick={() => toggle(languages, setLanguages, o.id)}
                  />
                ))}
                {languages.some((l) => l !== "de") && <p className="rounded-2xl bg-yellow-soft/70 px-4 py-3 text-sm text-ink">{L(UI.soonNote)}</p>}
              </div>
            )}

            {id === "why" && (
              <div className="grid gap-2.5 sm:grid-cols-2">
                {REASONS.map((r) => (
                  <Tile key={r.id} c={r} lang={lang} active={reasons.includes(r.id)} onClick={() => toggle(reasons, setReasons, r.id)} />
                ))}
              </div>
            )}

            {id === "goal" && (
              <div>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {GOALS.map((g) => (
                    <Tile key={g.id} c={g} lang={lang} active={goal === g.id} onClick={() => setGoal(g.id)} />
                  ))}
                </div>
                {goal === "exam" && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-cocoa">
                      Welche Prüfung? <span className="font-normal text-muted">· {L(UI.whichExam)}</span>
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {[...EXAMS, "?"].map((e) => (
                        <Chip
                          key={e}
                          c={{ id: e, de: e === "?" ? L(UI.notSure) : e, t: { es: "", en: "" } }}
                          lang={lang}
                          active={exam === e}
                          onClick={() => setExam(e)}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {goal && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-cocoa">
                      Bis wann? <span className="font-normal text-muted">· {L(UI.when)}</span>
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {DEADLINES.map((d) => (
                        <Chip key={d.id} c={d} lang={lang} active={deadline === d.id} onClick={() => setDeadline(d.id)} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {id === "time" && (
              <div>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {TIMES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      aria-pressed={minutes === t.minutes}
                      onClick={() => setMinutes(t.minutes)}
                      className={`flex flex-col items-center gap-1 rounded-3xl border p-4 text-center transition ${
                        minutes === t.minutes ? "border-wine bg-paper shadow-md shadow-wine/10" : "border-latte/60 bg-sand hover:border-cocoa-light hover:bg-sand-deep"
                      }`}
                    >
                      <span className="text-3xl" aria-hidden="true">
                        {t.emoji}
                      </span>
                      <span className="font-display text-lg text-ink">{t.de}</span>
                      <span className="text-xs text-muted">{L(t.t)}</span>
                    </button>
                  ))}
                </div>
                <p className="mt-7 text-sm font-medium text-cocoa">
                  An wie vielen Tagen pro Woche? <span className="font-normal text-muted">· {L(UI.daysQ)}</span>
                </p>
                <div className="mt-2 flex gap-2">
                  {DAYS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      aria-pressed={days === d}
                      onClick={() => setDays(d)}
                      className={`h-12 flex-1 rounded-2xl border font-display text-lg transition ${
                        days === d ? "border-wine bg-wine text-cream shadow-md shadow-wine/15" : "border-latte/60 bg-sand text-ink hover:border-cocoa-light hover:bg-sand-deep"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                {minutes !== null && (
                  <p className="mt-4 text-sm text-cocoa">
                    → {minutes} Min. × {days} Tage = <b>{Math.round(((minutes * days) / 60) * 10) / 10} {L(UI.hoursWeek)}</b>
                  </p>
                )}
              </div>
            )}

            {id === "interests" && (
              <div className="flex flex-wrap gap-2.5">
                {INTERESTS.map((i) => (
                  <Chip key={i.id} c={i} lang={lang} active={interests.includes(i.id)} onClick={() => toggle(interests, setInterests, i.id)} />
                ))}
              </div>
            )}

            {id === "done" && <Summary L={L} lang={lang} name={name.trim()} goal={goal} exam={exam} deadline={deadline} minutes={minutes} days={days} reasons={reasons} interests={interests} />}
          </div>

          {(id === "why" || id === "interests" || id === "name") && <p className="mt-6 text-sm text-muted">{L(UI.psst)}</p>}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-10">
          {step > 0 ? (
            <button type="button" onClick={() => go(-1)} className="rounded-full px-4 py-3 text-sm text-cocoa transition hover:bg-sand">
              ← {L(UI.back)}
            </button>
          ) : (
            <span />
          )}
          {id === "done" ? (
            <div className="flex flex-wrap items-center justify-end gap-2">
              <button type="button" onClick={() => setStep(1)} className="rounded-full px-4 py-3 text-sm text-cocoa transition hover:bg-sand">
                {L(UI.edit)}
              </button>
              <button
                type="button"
                onClick={finish}
                disabled={saving}
                className="rounded-full bg-wine px-7 py-3.5 font-medium text-cream shadow-md shadow-wine/20 transition hover:bg-wine-light disabled:opacity-70"
              >
                {editing ? L(UI.save) : L(UI.go)}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => go(1)}
              disabled={!valid[id]}
              className="rounded-full bg-wine px-7 py-3.5 font-medium text-cream transition hover:bg-wine-light disabled:cursor-not-allowed disabled:opacity-35"
            >
              {L(UI.next)} →
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

function BigOption({
  active,
  badge,
  title,
  sub,
  tag,
  multi,
  onClick,
}: {
  active: boolean;
  badge: string;
  title: string;
  sub?: string;
  tag?: string;
  multi?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={active}
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-3xl border p-4 text-left transition ${
        active ? "border-wine bg-paper shadow-md shadow-wine/10" : "border-latte/60 bg-sand hover:border-cocoa-light hover:bg-sand-deep"
      }`}
    >
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-display text-sm font-semibold ${active ? "bg-wine text-cream" : "bg-paper text-cocoa"}`}>
        {badge}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2 font-display text-lg text-ink">
          {title}
          {tag && <span className="rounded-full bg-yellow-soft px-2 py-0.5 font-sans text-[11px] font-medium text-cocoa">{tag}</span>}
        </span>
        {sub && <span className="block text-sm text-muted">{sub}</span>}
      </span>
      <span
        className={`h-5 w-5 shrink-0 border-2 ${multi ? "rounded-md" : "rounded-full"} ${
          active ? "border-wine bg-wine shadow-[inset_0_0_0_3px_var(--color-paper)]" : "border-latte"
        }`}
        aria-hidden="true"
      />
    </button>
  );
}

function Tile({ c, lang, active, onClick }: { c: Choice; lang: NativeLang; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-3xl border p-4 text-left transition ${
        active ? "border-wine bg-paper shadow-md shadow-wine/10" : "border-latte/60 bg-sand hover:border-cocoa-light hover:bg-sand-deep"
      }`}
    >
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-2xl ${active ? "bg-yellow-soft" : "bg-paper"}`} aria-hidden="true">
        {c.emoji}
      </span>
      <span className="min-w-0">
        <span className="block font-display text-lg leading-tight text-ink">{c.de}</span>
        <span className="block text-sm text-muted">
          {c.t[lang]}
          {c.sub && ` · ${c.sub[lang]}`}
        </span>
      </span>
    </button>
  );
}

function Chip({ c, lang, active, onClick }: { c: Choice; lang: NativeLang; active: boolean; onClick: () => void }) {
  const sub = c.t[lang];
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-4 py-2.5 text-left transition ${
        active ? "border-wine bg-wine text-cream shadow-md shadow-wine/15" : "border-latte/60 bg-sand text-ink hover:border-cocoa-light hover:bg-sand-deep"
      }`}
    >
      {c.emoji && (
        <span className="mr-1.5" aria-hidden="true">
          {c.emoji}
        </span>
      )}
      <span className="font-medium">{c.de}</span>
      {sub && sub !== c.de && <span className={`ml-1.5 text-sm ${active ? "text-cream/80" : "text-muted"}`}>· {sub}</span>}
    </button>
  );
}

function Summary({
  L,
  lang,
  name,
  goal,
  exam,
  deadline,
  minutes,
  days,
  reasons,
  interests,
}: {
  days: number;
  L: (t: Txt) => string;
  lang: NativeLang;
  name: string;
  goal: string;
  exam: string;
  deadline: string;
  minutes: number | null;
  reasons: string[];
  interests: string[];
}) {
  const g = GOALS.find((x) => x.id === goal);
  const d = DEADLINES.find((x) => x.id === deadline);
  const t = TIMES.find((x) => x.minutes === minutes);
  const pick = (list: Choice[], ids: string[]) => list.filter((x) => ids.includes(x.id));
  return (
    <div>
      <div className="flex items-start gap-3">
        <h1 className="font-display text-3xl font-semibold leading-tight text-wine sm:text-4xl">Super, {name}! 🎉</h1>
        <SpeakButton text="Super! Los geht's!" voice="f" className="mt-1.5" />
      </div>
      <p className="mt-2 text-ink/75">{L(UI.doneTitle)}</p>

      <div className="mt-6 rounded-[2rem] border border-latte/60 bg-sand p-5 sm:p-6">
        <Row label={`Ziel · ${L(UI.planGoal)}`}>
          {g?.emoji} {g?.de}
          {goal === "exam" && exam && exam !== "?" && <span className="text-wine"> · {exam}</span>}
          {d && <span className="text-muted"> · {d.t[lang]}</span>}
        </Row>
        <Row label={`Pro Woche · ${L(UI.planTime)}`}>
          {t?.emoji} {t?.de} × {days} Tage
        </Row>
        <Row label={`Warum · ${L(UI.planWhy)}`}>
          <span className="flex flex-wrap gap-1.5">
            {pick(REASONS, reasons).map((r) => (
              <span key={r.id} className="rounded-full bg-paper px-3 py-1 text-sm">
                {r.emoji} {r.de}
              </span>
            ))}
          </span>
        </Row>
        <Row label={`Interessen · ${L(UI.planLikes)}`} last>
          <span className="flex flex-wrap gap-1.5">
            {pick(INTERESTS, interests).map((r) => (
              <span key={r.id} className="rounded-full bg-paper px-3 py-1 text-sm">
                {r.emoji} {r.de}
              </span>
            ))}
          </span>
        </Row>
      </div>
      <p className="mt-5 text-cocoa">{L(UI.doneNext)}</p>
    </div>
  );
}

function Row({ label, children, last }: { label: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={`py-3 ${last ? "" : "border-b border-latte/40"}`}>
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">{label}</p>
      <div className="mt-1 font-display text-lg text-ink">{children}</div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <Onboarding />
    </Suspense>
  );
}
