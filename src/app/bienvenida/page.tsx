"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, type NativeLang } from "@/lib/session";
import { translate } from "@/lib/i18n";
import { Logo } from "@/components/Logo";
import { FullPageLoader } from "@/components/AppShell";

const options: { id: NativeLang; label: string; sub: string; flag: string }[] = [
  { id: "es", label: "Español", sub: "Las explicaciones estarán en español", flag: "ES" },
  { id: "en", label: "English", sub: "Explanations will be in English", flag: "EN" },
];

function Onboarding() {
  const { user, nativeLang, loading, setNativeLang } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const [choice, setChoice] = useState<NativeLang>(nativeLang ?? "es");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/");
  }, [loading, user, router]);

  if (loading || !user) return <FullPageLoader />;

  const next = params.get("next");
  const safeNext = next && next.startsWith("/aprender") ? next : "/aprender";

  const submit = async () => {
    setSaving(true);
    await setNativeLang(choice);
    router.replace(safeNext);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex h-20 w-full max-w-5xl items-center px-4 sm:px-6">
        <Logo />
      </header>
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 pb-24">
        <p className="text-sm text-muted">
          {translate(choice, "hello")}, {user.name.split(" ")[0]} 👋
        </p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{translate(choice, "onboardingTitle")}</h1>
        <p className="mt-3 text-ink/80">{translate(choice, "onboardingBody")}</p>

        <div className="mt-8 space-y-3" role="radiogroup">
          {options.map((o) => {
            const active = choice === o.id;
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setChoice(o.id)}
                className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                  active ? "border-wine bg-paper shadow-md shadow-wine/10" : "border-line bg-paper/60 hover:border-cocoa-light"
                }`}
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl font-display text-sm font-semibold ${
                    active ? "bg-wine text-cream" : "bg-cream-deep text-cocoa"
                  }`}
                >
                  {o.flag}
                </span>
                <span className="flex-1">
                  <span className="block font-display text-lg text-ink">{o.label}</span>
                  <span className="block text-sm text-muted">{o.sub}</span>
                </span>
                <span
                  className={`h-5 w-5 rounded-full border-2 ${active ? "border-wine bg-wine shadow-[inset_0_0_0_3px_var(--color-paper)]" : "border-line"}`}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={saving}
          className="mt-8 rounded-full bg-wine px-6 py-3.5 font-medium text-cream transition hover:bg-wine-light disabled:opacity-70"
        >
          {translate(choice, "continue")}
        </button>
      </main>
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
