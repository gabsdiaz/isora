"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, type NativeLang, type StudentProfile } from "@/lib/session";
import { useLevels } from "@/lib/levels";
import { Logo } from "@/components/Logo";
import { FullPageLoader } from "@/components/AppShell";
import { AGES, DAYS, DEADLINES, EXAMS_BY_SUBJECT, GOALS, INTERESTS, OTHER, Q, REASONS, SUBJECTS, TIMES, type Choice, type L as Txt } from "@/content/onboarding";

type Step = "lang" | "name" | "age" | "learn" | "why" | "goal" | "time" | "interests" | "done";
const STEPS: Step[] = ["lang", "name", "age", "learn", "why", "goal", "time", "interests", "done"];
type Other = NonNullable<StudentProfile["other"]>;

const UI = {
  next: { es: "Siguiente", en: "Next" },
  back: { es: "Atrás", en: "Back" },
  step: { es: "Paso", en: "Step" },
  of: { es: "de", en: "of" },
  hello: { es: "¡Hola! 👋 Vamos a conocerte.", en: "Hi! 👋 Let's get to know you." },
  namePh: { es: "Tu nombre", en: "Your name" },
  other: { es: "Otro", en: "Other" },
  otherGoal: { es: "Otra meta", en: "Another goal" },
  otherPh: { es: "Escríbelo aquí…", en: "Write it here…" },
  languages: { es: "Idiomas", en: "Languages" },
  sciences: { es: "Ciencias · más adelante", en: "Sciences · later" },
  ready: { es: "Disponible", en: "Available" },
  soon: { es: "Pronto", en: "Soon" },
  later: { es: "Más adelante", en: "Later" },
  soonNote: {
    es: "¡Genial! Te avisaremos cuando esté listo. Por ahora Isora tiene alemán: si quieres, puedes empezar con él mientras tanto.",
    en: "Great! We'll let you know when it's ready. For now Isora has German: you can start with it in the meantime.",
  },
  whichExam: { es: "¿Cuál examen?", en: "Which exam?" },
  notSure: { es: "Aún no sé", en: "Not sure yet" },
  otherExam: { es: "Otro examen", en: "Another exam" },
  when: { es: "¿Para cuándo?", en: "By when?" },
  daysQ: { es: "¿Cuántos días a la semana?", en: "How many days a week?" },
  perWeek: { es: "horas por semana", en: "hours a week" },
  min: { es: "min", en: "min" },
  daysWord: { es: "días", en: "days" },
  doneTitle: { es: "Esto es lo que nos contaste", en: "Here's what you told us" },
  sumLearn: { es: "Quieres aprender", en: "You want to learn" },
  sumGoal: { es: "Tu meta", en: "Your goal" },
  sumPace: { es: "Tu ritmo", en: "Your pace" },
  sumWhy: { es: "Porque", en: "Because" },
  sumLikes: { es: "Te gusta", en: "You like" },
  doneNext: {
    es: "Con esto armamos tu plan de estudio personalizado: semana a semana, con tu meta, tu ritmo y tus temas favoritos.",
    en: "With this we'll build your personalised study plan: week by week, with your goal, your pace and your favourite topics.",
  },
  go: { es: "Ver mi plan de estudio →", en: "See my study plan →" },
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
  const { levels } = useLevels();

  const [lang, setLang] = useState<NativeLang>(nativeLang ?? (typeof navigator !== "undefined" && navigator.language?.startsWith("en") ? "en" : "es"));
  const [step, setStep] = useState(0);
  const [name, setName] = useState(profile?.name ?? (user.name !== "Estudiante" && user.name !== "Estudiante demo" ? user.name.split(" ")[0] : ""));
  const [age, setAge] = useState(profile?.age ?? "");
  const [subjects, setSubjects] = useState<string[]>(profile?.languages ?? ["de"]);
  const [reasons, setReasons] = useState<string[]>(profile?.reasons ?? []);
  const [goal, setGoal] = useState(profile?.goal ?? "");
  const [exam, setExam] = useState(profile?.exam ?? "");
  const [deadline, setDeadline] = useState(profile?.deadline ?? "");
  const [minutes, setMinutes] = useState<number | null>(profile?.minutes ?? null);
  const [days, setDays] = useState<number>(profile?.days ?? 5);
  const [interests, setInterests] = useState<string[]>(profile?.interests ?? []);
  const [other, setOther] = useState<Other>(profile?.other ?? {});
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
  const filled = (k: keyof Other) => Boolean(other[k]?.trim());
  const setOtherText = (k: keyof Other, v: string) => setOther((o) => ({ ...o, [k]: v.slice(0, 80) }));

  const valid: Record<Step, boolean> = {
    lang: true,
    name: name.trim().length > 0,
    age: Boolean(age),
    learn: subjects.length > 0 && (!subjects.includes(OTHER) || filled("learn")),
    why: reasons.length > 0 && (!reasons.includes(OTHER) || filled("why")),
    goal:
      Boolean(goal) &&
      (goal !== OTHER || filled("goal")) &&
      (goal !== "exam" || (Boolean(exam) && (exam !== OTHER || filled("exam")))) &&
      Boolean(deadline),
    time: minutes !== null,
    interests: interests.length > 0 && (!interests.includes(OTHER) || filled("interests")),
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
    // Solo guardamos los textos de "Otro" que siguen elegidos
    const o: Other = {};
    if (subjects.includes(OTHER) && filled("learn")) o.learn = other.learn!.trim();
    if (reasons.includes(OTHER) && filled("why")) o.why = other.why!.trim();
    if (goal === OTHER && filled("goal")) o.goal = other.goal!.trim();
    if (goal === "exam" && exam === OTHER && filled("exam")) o.exam = other.exam!.trim();
    if (interests.includes(OTHER) && filled("interests")) o.interests = other.interests!.trim();
    const p: StudentProfile = {
      name: name.trim(),
      age,
      languages: subjects,
      reasons,
      goal,
      exam: goal === "exam" ? exam : undefined,
      deadline,
      minutes: minutes ?? undefined,
      days,
      interests,
      other: Object.keys(o).length ? o : undefined,
    };
    // Firestore no acepta undefined
    (Object.keys(p) as (keyof StudentProfile)[]).forEach((k) => p[k] === undefined && delete p[k]);
    await saveProfile(p, lang);
    // Con las respuestas armamos el plan de estudio; si aún no sabemos su nivel, primero test o desde cero
    router.replace(editing ? "/aprender/plan" : levels.startChoice ? "/aprender/plan?neu=1" : "/aprender/start");
  };

  const q = id !== "done" ? Q[id] : null;
  const total = STEPS.length - 1;
  const examList = Array.from(new Set(subjects.flatMap((s) => EXAMS_BY_SUBJECT[s] ?? [])));
  if (!examList.length) examList.push(...EXAMS_BY_SUBJECT.de);
  const statusLabel = { ready: L(UI.ready), soon: L(UI.soon), later: L(UI.later) };

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
              {step === 0 && <p className="mb-2 text-sm text-cocoa">{L(UI.hello)}</p>}
              <h1 className="font-display text-3xl font-semibold leading-tight text-wine sm:text-4xl">{L(q.t)}</h1>
              <p className="mt-2 text-ink/75">{L(q.sub)}</p>
            </>
          )}

          <div className="mt-8">
            {id === "lang" && (
              <div className="space-y-3" role="radiogroup">
                {(
                  [
                    { id: "es", badge: "ES", label: "Español", sub: "Las explicaciones, traducciones y subtítulos estarán en español" },
                    { id: "en", badge: "EN", label: "English", sub: "Explanations, translations and subtitles will be in English" },
                  ] as const
                ).map((o) => (
                  <BigOption key={o.id} active={lang === o.id} badge={o.badge} title={o.label} sub={o.sub} onClick={() => pickAndGo(() => setLang(o.id))} />
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
              </form>
            )}

            {id === "age" && (
              <div className="flex flex-wrap gap-2.5">
                {AGES.map((a) => (
                  <Chip key={a.id} label={L(a.t)} active={age === a.id} onClick={() => pickAndGo(() => setAge(a.id))} />
                ))}
              </div>
            )}

            {id === "learn" && (
              <div>
                {(["lang", "science"] as const).map((g) => (
                  <div key={g} className="mb-5">
                    <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-muted">{g === "lang" ? L(UI.languages) : L(UI.sciences)}</p>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {SUBJECTS.filter((s) => s.group === g).map((s) => (
                        <BigOption
                          key={s.id}
                          multi
                          active={subjects.includes(s.id)}
                          badge={s.badge}
                          title={L(s.t)}
                          sub={s.sub ? L(s.sub) : undefined}
                          tag={statusLabel[s.status]}
                          tagReady={s.status === "ready"}
                          onClick={() => toggle(subjects, setSubjects, s.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                <OtherField
                  label={L(UI.other)}
                  active={subjects.includes(OTHER)}
                  onToggle={() => toggle(subjects, setSubjects, OTHER)}
                  value={other.learn ?? ""}
                  onChange={(v) => setOtherText("learn", v)}
                  placeholder={lang === "en" ? "E.g. Japanese, chemistry…" : "Ej.: japonés, química…"}
                />
                {subjects.length > 0 && !subjects.includes("de") && <p className="mt-4 rounded-2xl bg-yellow-soft/70 px-4 py-3 text-sm text-ink">{L(UI.soonNote)}</p>}
              </div>
            )}

            {id === "why" && (
              <div>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {REASONS.map((r) => (
                    <Tile key={r.id} c={r} lang={lang} active={reasons.includes(r.id)} onClick={() => toggle(reasons, setReasons, r.id)} />
                  ))}
                </div>
                <div className="mt-3">
                  <OtherField
                    label={L(UI.other)}
                    active={reasons.includes(OTHER)}
                    onToggle={() => toggle(reasons, setReasons, OTHER)}
                    value={other.why ?? ""}
                    onChange={(v) => setOtherText("why", v)}
                    placeholder={L(UI.otherPh)}
                  />
                </div>
              </div>
            )}

            {id === "goal" && (
              <div>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {GOALS.map((g) => (
                    <Tile key={g.id} c={g} lang={lang} active={goal === g.id} onClick={() => setGoal(g.id)} />
                  ))}
                </div>
                <div className="mt-3">
                  <OtherField
                    label={L(UI.otherGoal)}
                    active={goal === OTHER}
                    onToggle={() => setGoal(goal === OTHER ? "" : OTHER)}
                    value={other.goal ?? ""}
                    onChange={(v) => setOtherText("goal", v)}
                    placeholder={L(UI.otherPh)}
                  />
                </div>
                {goal === "exam" && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-cocoa">{L(UI.whichExam)}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {examList.map((e) => (
                        <Chip key={e} label={e} active={exam === e} onClick={() => setExam(e)} />
                      ))}
                      <Chip label={L(UI.notSure)} active={exam === "?"} onClick={() => setExam("?")} />
                    </div>
                    <div className="mt-2">
                      <OtherField
                        label={L(UI.otherExam)}
                        active={exam === OTHER}
                        onToggle={() => setExam(exam === OTHER ? "" : OTHER)}
                        value={other.exam ?? ""}
                        onChange={(v) => setOtherText("exam", v)}
                        placeholder={L(UI.otherPh)}
                      />
                    </div>
                  </div>
                )}
                {goal && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-cocoa">{L(UI.when)}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {DEADLINES.map((d) => (
                        <Chip key={d.id} label={L(d.t)} active={deadline === d.id} onClick={() => setDeadline(d.id)} />
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
                      <span className="font-display text-lg text-ink">{L(t.t)}</span>
                      {t.sub && <span className="text-xs text-muted">{L(t.sub)}</span>}
                    </button>
                  ))}
                </div>
                <p className="mt-7 text-sm font-medium text-cocoa">{L(UI.daysQ)}</p>
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
                    → {minutes} {L(UI.min)} × {days} {L(UI.daysWord)} = <b>{Math.round(((minutes * days) / 60) * 10) / 10} {L(UI.perWeek)}</b>
                  </p>
                )}
              </div>
            )}

            {id === "interests" && (
              <div>
                <div className="flex flex-wrap gap-2.5">
                  {INTERESTS.map((i) => (
                    <Chip key={i.id} label={L(i.t)} emoji={i.emoji} active={interests.includes(i.id)} onClick={() => toggle(interests, setInterests, i.id)} />
                  ))}
                </div>
                <div className="mt-3">
                  <OtherField
                    label={L(UI.other)}
                    active={interests.includes(OTHER)}
                    onToggle={() => toggle(interests, setInterests, OTHER)}
                    value={other.interests ?? ""}
                    onChange={(v) => setOtherText("interests", v)}
                    placeholder={lang === "en" ? "E.g. astronomy, dance…" : "Ej.: astronomía, baile…"}
                  />
                </div>
              </div>
            )}

            {id === "done" && (
              <Summary
                L={L}
                name={name.trim()}
                subjects={subjects}
                goal={goal}
                exam={exam}
                deadline={deadline}
                minutes={minutes}
                days={days}
                reasons={reasons}
                interests={interests}
                other={other}
              />
            )}
          </div>
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

/** Opción "Otro": al marcarla aparece un campo para escribir. */
function OtherField({
  label,
  active,
  onToggle,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        aria-pressed={active}
        onClick={onToggle}
        className={`rounded-full border px-4 py-2.5 transition ${
          active ? "border-wine bg-wine text-cream shadow-md shadow-wine/15" : "border-dashed border-cocoa/40 bg-paper text-ink hover:border-cocoa"
        }`}
      >
        <span className="mr-1.5" aria-hidden="true">
          ✏️
        </span>
        <span className="font-medium">{label}</span>
        {!active && <span className="text-muted">: ____</span>}
      </button>
      {active && (
        <input
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={label}
          className="min-w-[12rem] flex-1 rounded-2xl border border-line bg-paper px-4 py-2.5 text-ink outline-none transition placeholder:text-muted/60 focus:border-wine"
        />
      )}
    </div>
  );
}

function BigOption({
  active,
  badge,
  title,
  sub,
  tag,
  tagReady,
  multi,
  onClick,
}: {
  active: boolean;
  badge: string;
  title: string;
  sub?: string;
  tag?: string;
  tagReady?: boolean;
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
          {tag && (
            <span className={`rounded-full px-2 py-0.5 font-sans text-[11px] font-medium ${tagReady ? "bg-sage-soft text-sage" : "bg-yellow-soft text-cocoa"}`}>{tag}</span>
          )}
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
        <span className="block font-display text-lg leading-tight text-ink">{c.t[lang]}</span>
        {c.sub && <span className="block text-sm text-muted">{c.sub[lang]}</span>}
      </span>
    </button>
  );
}

function Chip({ label, emoji, active, onClick }: { label: string; emoji?: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-4 py-2.5 text-left transition ${
        active ? "border-wine bg-wine text-cream shadow-md shadow-wine/15" : "border-latte/60 bg-sand text-ink hover:border-cocoa-light hover:bg-sand-deep"
      }`}
    >
      {emoji && (
        <span className="mr-1.5" aria-hidden="true">
          {emoji}
        </span>
      )}
      <span className="font-medium">{label}</span>
    </button>
  );
}

function Summary({
  L,
  name,
  subjects,
  goal,
  exam,
  deadline,
  minutes,
  days,
  reasons,
  interests,
  other,
}: {
  L: (t: Txt) => string;
  name: string;
  subjects: string[];
  goal: string;
  exam: string;
  deadline: string;
  minutes: number | null;
  days: number;
  reasons: string[];
  interests: string[];
  other: Other;
}) {
  const g = GOALS.find((x) => x.id === goal);
  const d = DEADLINES.find((x) => x.id === deadline);
  const t = TIMES.find((x) => x.minutes === minutes);
  const pills = (list: Choice[], ids: string[], otherText?: string) => [
    ...list.filter((x) => ids.includes(x.id)).map((x) => ({ k: x.id, label: `${x.emoji ? `${x.emoji} ` : ""}${L(x.t)}` })),
    ...(ids.includes(OTHER) && otherText?.trim() ? [{ k: OTHER, label: `✏️ ${otherText.trim()}` }] : []),
  ];
  const examText = exam === OTHER ? other.exam?.trim() : exam && exam !== "?" ? exam : "";
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold leading-tight text-wine sm:text-4xl">¡Súper, {name}! 🎉</h1>
      <p className="mt-2 text-ink/75">{L(UI.doneTitle)}</p>

      <div className="mt-6 rounded-[2rem] border border-latte/60 bg-sand p-5 sm:p-6">
        <Row label={L(UI.sumLearn)}>
          <Pills items={pills(SUBJECTS, subjects, other.learn)} />
        </Row>
        <Row label={L(UI.sumGoal)}>
          {goal === OTHER ? `✏️ ${other.goal?.trim() ?? ""}` : `${g?.emoji ?? ""} ${g ? L(g.t) : ""}`}
          {goal === "exam" && examText && <span className="text-wine"> · {examText}</span>}
          {d && <span className="text-muted"> · {L(d.t)}</span>}
        </Row>
        <Row label={L(UI.sumPace)}>
          {t?.emoji} {t ? L(t.t) : ""} × {days} {L(UI.daysWord)}
        </Row>
        <Row label={L(UI.sumWhy)}>
          <Pills items={pills(REASONS, reasons, other.why)} />
        </Row>
        <Row label={L(UI.sumLikes)} last>
          <Pills items={pills(INTERESTS, interests, other.interests)} />
        </Row>
      </div>
      <p className="mt-5 text-cocoa">{L(UI.doneNext)}</p>
    </div>
  );
}

function Pills({ items }: { items: { k: string; label: string }[] }) {
  return (
    <span className="flex flex-wrap gap-1.5">
      {items.map((x) => (
        <span key={x.k} className="rounded-full bg-paper px-3 py-1 font-sans text-sm">
          {x.label}
        </span>
      ))}
    </span>
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
