"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session";
import { useT } from "@/lib/i18n";
import { Logo } from "@/components/Logo";
import { FullPageLoader } from "@/components/AppShell";
import { GoogleButton } from "@/components/GoogleButton";
import { GOOGLE_CLIENT_ID, isMobileDevice } from "@/lib/firebase";

/** Navegadores internos de apps (Instagram, Facebook, TikTok…): Google no permite iniciar sesión ahí. */
const IN_APP = /FBAN|FBAV|Instagram|Line\/|TikTok|Snapchat|; wv\)/i;
const noop = () => () => {};
const useMobileGoogle = () =>
  useSyncExternalStore(
    noop,
    () => Boolean(GOOGLE_CLIENT_ID) && isMobileDevice(),
    () => false,
  );
const useInAppBrowser = () =>
  useSyncExternalStore(
    noop,
    () => IN_APP.test(navigator.userAgent),
    () => false,
  );

export default function Landing() {
  const { user, nativeLang, loading, demoMode, authError, signInWithGoogle, signInWithGoogleToken } = useSession();
  const mobileGoogle = useMobileGoogle();
  const { t } = useT();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inApp = useInAppBrowser();

  useEffect(() => {
    if (!loading && user) router.replace(nativeLang ? "/aprender" : "/bienvenida");
  }, [loading, user, nativeLang, router]);

  if (loading || user) return <FullPageLoader />;

  const handleSignIn = async () => {
    setBusy(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch {
      setError("No se pudo iniciar sesión. Intenta de nuevo.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex h-20 w-full max-w-5xl items-center px-4 sm:px-6">
        <Logo />
      </header>

      <main className="mx-auto grid w-full max-w-5xl flex-1 items-center gap-12 px-4 pb-16 sm:px-6 md:grid-cols-[1.1fr_0.9fr]">
        <section>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-cocoa">
            Deutsch · A1 → B1
          </p>
          <h1 className="text-4xl font-semibold leading-[1.1] sm:text-5xl">{t("heroTitle")}</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/80">{t("heroBody")}</p>

          <div className="mt-8 flex flex-col items-start gap-3">
            {mobileGoogle ? (
              <GoogleButton onToken={signInWithGoogleToken} onError={setError} />
            ) : (
              <button
                type="button"
                onClick={handleSignIn}
                disabled={busy}
                className="inline-flex items-center gap-3 rounded-full bg-wine px-6 py-3.5 text-base font-medium text-cream shadow-md shadow-wine/20 transition hover:bg-wine-light disabled:opacity-70"
              >
                <GoogleIcon />
                {busy ? t("signingIn") : t("signInGoogle")}
              </button>
            )}
            {demoMode && <p className="text-xs text-muted">{t("demoNotice")}</p>}
            {(error || authError) && (
              <p className="text-sm text-wine">
                {error ?? "No se pudo iniciar sesión. Intenta de nuevo."} {authError && <span className="text-xs text-muted">({authError})</span>}
              </p>
            )}
            {inApp && (
              <p className="max-w-sm rounded-2xl bg-yellow-soft px-4 py-3 text-sm text-ink">
                Para iniciar sesión con Google, abre este enlace en <b>Chrome</b> o <b>Safari</b> (menú ⋯ → «Abrir en el navegador»).
              </p>
            )}
          </div>
        </section>

        <HeroCard />
      </main>
    </div>
  );
}

function HeroCard() {
  const rows = [
    { de: "Guten Morgen!", es: "¡Buenos días!" },
    { de: "Ich heiße Lena.", es: "Me llamo Lena." },
    { de: "Woher kommst du?", es: "¿De dónde eres?" },
  ];
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="absolute -right-4 -top-4 h-full w-full rounded-[2rem] border border-line bg-cream-deep" aria-hidden="true" />
      <div className="relative rounded-[2rem] border border-line bg-paper p-7 shadow-xl shadow-cocoa/10">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">A1.1 · Einheit 1</p>
        <h2 className="mt-1 text-3xl font-semibold">Vorstellung</h2>
        <ul className="mt-6 space-y-3">
          {rows.map((r) => (
            <li key={r.de} className="rounded-2xl border border-line bg-cream px-4 py-3">
              <p className="font-display text-lg text-cocoa">{r.de}</p>
              <p className="text-sm text-muted">{r.es}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-center gap-2">
          {["Video", "Teoría", "Lectura", "Ejercicios", "PDF"].map((s, i) => (
            <span key={s} className={`h-1.5 flex-1 rounded-full ${i < 2 ? "bg-wine" : "bg-line"}`} title={s} />
          ))}
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
      <svg width="14" height="14" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17.1z" />
        <path fill="#FBBC05" d="M10.6 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.9-6.1z" />
        <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.2-8.5 2.2-6.2 0-11.5-4.1-13.4-9.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z" />
      </svg>
    </span>
  );
}
