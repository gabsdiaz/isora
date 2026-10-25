"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/session";
import { useT } from "@/lib/i18n";
import { Logo } from "./Logo";
import { APP_NAME } from "@/lib/brand";

/** Protege las páginas internas: exige sesión y que el idioma nativo esté elegido. */
export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, nativeLang, loading } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/");
    else if (!nativeLang) router.replace(`/bienvenida?next=${encodeURIComponent(pathname)}`);
  }, [loading, user, nativeLang, router, pathname]);

  if (loading || !user || !nativeLang) return <FullPageLoader />;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-20 pt-6 sm:px-6">{children}</main>
      <footer className="border-t border-line py-6 text-center text-xs text-muted">
        {APP_NAME} · {new Date().getFullYear()}
      </footer>
    </div>
  );
}

function Header() {
  const { user, signOut, setNativeLang } = useSession();
  const { t, lang } = useT();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const initials = (user?.name ?? "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Logo href="/aprender" />
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full border border-line bg-paper py-1 pl-1 pr-3 text-sm transition hover:border-cocoa-light"
            aria-haspopup="menu"
            aria-expanded={open}
          >
            {user?.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.photoURL} alt="" className="h-7 w-7 rounded-full" referrerPolicy="no-referrer" />
            ) : (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-wine text-xs font-semibold text-cream">
                {initials}
              </span>
            )}
            <span className="hidden max-w-[10rem] truncate text-ink sm:inline">{user?.name}</span>
          </button>
          {open && (
            <div role="menu" className="absolute right-0 mt-2 w-60 rounded-2xl border border-line bg-paper p-2 shadow-lg shadow-cocoa/10">
              <p className="px-3 pb-1 pt-2 text-xs font-medium uppercase tracking-wide text-muted">{t("settingsLang")}</p>
              <div className="flex gap-1 px-2 pb-2">
                {(["es", "en"] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setNativeLang(l)}
                    className={`flex-1 rounded-lg px-2 py-1.5 text-sm transition ${
                      lang === l ? "bg-wine text-cream" : "text-ink hover:bg-cream-deep"
                    }`}
                  >
                    {l === "es" ? "Español" : "English"}
                  </button>
                ))}
              </div>
              <div className="my-1 border-t border-line" />
              <button
                type="button"
                role="menuitem"
                onClick={async () => {
                  await signOut();
                  router.replace("/");
                }}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-cream-deep"
              >
                {t("signOut")}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function FullPageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-line border-t-wine" aria-label="Cargando" />
    </div>
  );
}
