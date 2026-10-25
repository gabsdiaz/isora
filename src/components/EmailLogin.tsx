"use client";

import { useState } from "react";
import { useSession } from "@/lib/session";

type Mode = "signin" | "signup" | "reset";

/** Mensajes claros para los errores de Firebase con correo y contraseña. */
const MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "Correo o contraseña incorrectos.",
  "auth/wrong-password": "Correo o contraseña incorrectos.",
  "auth/user-not-found": "No hay ninguna cuenta con este correo. ¿Quieres crear una?",
  "auth/invalid-email": "Ese correo no parece válido. Revísalo.",
  "auth/missing-email": "Escribe tu correo.",
  "auth/missing-password": "Escribe tu contraseña.",
  "auth/email-already-in-use": "Ya existe una cuenta con este correo. Inicia sesión (o entra con Google si la creaste así).",
  "auth/weak-password": "La contraseña es muy débil. Usa al menos 8 caracteres.",
  "auth/password-does-not-meet-requirements": "La contraseña es muy débil. Usa al menos 8 caracteres, con letras y números.",
  "auth/too-many-requests": "Demasiados intentos. Espera unos minutos e intenta de nuevo.",
  "auth/network-request-failed": "Sin conexión. Revisa tu internet e intenta de nuevo.",
  "auth/operation-not-allowed": "El acceso con correo todavía no está activado. Mientras tanto, entra con Google.",
  "auth/user-disabled": "Esta cuenta está desactivada.",
};
const message = (code: string) => MESSAGES[code] ?? `No se pudo continuar (${code}). Intenta de nuevo.`;

/**
 * Entrar o crear cuenta con correo y contraseña. Usa un <form> real con los
 * atributos autocomplete correctos para que el navegador ofrezca guardar la contraseña.
 */
export function EmailLogin() {
  const { signInWithEmail, signUpWithEmail, resetPassword } = useSession();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const switchMode = (m: Mode) => {
    setMode(m);
    setError(null);
    setInfo(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (!email.trim()) return setError(message("auth/missing-email"));
    if (mode !== "reset" && !password) return setError(message("auth/missing-password"));
    if (mode === "signup" && password.length < 8) return setError(message("auth/weak-password"));
    setBusy(true);
    const code = mode === "signin" ? await signInWithEmail(email, password) : mode === "signup" ? await signUpWithEmail(email, password) : await resetPassword(email);
    setBusy(false);
    if (code) {
      // Por seguridad, el restablecimiento no dice si el correo existe o no
      if (mode === "reset" && code === "auth/user-not-found") setInfo("Si hay una cuenta con ese correo, te llegará un enlace para crear una nueva contraseña.");
      else setError(message(code));
      return;
    }
    if (mode === "reset") setInfo("Listo. Si hay una cuenta con ese correo, te llegará un enlace para crear una nueva contraseña (revisa también el spam).");
    // signin / signup: la sesión cambia y la página nos lleva al cuestionario o al curso
  };

  const strength = password.length === 0 ? 0 : password.length < 8 ? 1 : /[0-9]/.test(password) && /[a-zA-Z]/.test(password) && password.length >= 10 ? 3 : 2;

  return (
    <div className="w-full max-w-[320px] rounded-[1.75rem] border border-latte/60 bg-sand p-4 sm:p-5">
      {mode !== "reset" && (
        <div className="mb-4 grid grid-cols-2 rounded-full bg-paper p-1 text-sm" role="tablist">
          {(
            [
              ["signin", "Iniciar sesión"],
              ["signup", "Crear cuenta"],
            ] as const
          ).map(([m, label]) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => switchMode(m)}
              className={`rounded-full px-3 py-2 transition ${mode === m ? "bg-yellow font-medium text-ink shadow-sm" : "text-cocoa hover:text-ink"}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      {mode === "reset" && (
        <div className="mb-4">
          <p className="font-display text-xl text-ink">Passwort vergessen?</p>
          <p className="text-sm text-muted">Te enviamos un enlace para crear una contraseña nueva.</p>
        </div>
      )}

      <form onSubmit={submit} method="post" action="#" className="space-y-3" noValidate>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">Correo</span>
          <input
            type="email"
            name="email"
            inputMode="email"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            placeholder="tu@correo.com"
            className="mt-1 w-full rounded-2xl border border-line bg-paper px-4 py-3 text-ink outline-none transition placeholder:text-muted/60 focus:border-wine"
          />
        </label>

        {mode !== "reset" && (
          <label className="block">
            <span className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-muted">
              Contraseña
              {mode === "signin" && (
                <button type="button" onClick={() => switchMode("reset")} className="normal-case tracking-normal text-wine hover:underline">
                  ¿La olvidaste?
                </button>
              )}
            </span>
            <span className="relative mt-1 block">
              <input
                type={show ? "text" : "password"}
                name="password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder={mode === "signup" ? "Mínimo 8 caracteres" : "Tu contraseña"}
                className="w-full rounded-2xl border border-line bg-paper py-3 pl-4 pr-20 text-ink outline-none transition placeholder:text-muted/60 focus:border-wine"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-3 py-1.5 text-xs text-cocoa hover:bg-sand"
                aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {show ? "Ocultar" : "Mostrar"}
              </button>
            </span>
            {mode === "signup" && password && (
              <span className="mt-2 flex items-center gap-2">
                <span className="flex flex-1 gap-1">
                  {[1, 2, 3].map((i) => (
                    <span key={i} className={`h-1.5 flex-1 rounded-full ${strength >= i ? (strength === 1 ? "bg-wine-light" : strength === 2 ? "bg-yellow" : "bg-sage") : "bg-paper"}`} />
                  ))}
                </span>
                <span className="text-xs text-muted">{strength === 1 ? "Muy corta" : strength === 2 ? "Bien" : "¡Fuerte!"}</span>
              </span>
            )}
          </label>
        )}

        {error && <p className="text-sm text-wine">{error}</p>}
        {info && <p className="rounded-2xl bg-sage-soft px-4 py-3 text-sm text-ink">{info}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-wine px-6 py-3 font-medium text-cream shadow-md shadow-wine/20 transition hover:bg-wine-light disabled:opacity-70"
        >
          {busy ? "…" : mode === "signin" ? "Entrar" : mode === "signup" ? "Crear mi cuenta" : "Enviar enlace"}
        </button>
        {mode === "reset" && (
          <button type="button" onClick={() => switchMode("signin")} className="w-full text-sm text-cocoa hover:underline">
            ← Volver a iniciar sesión
          </button>
        )}
        {mode === "signup" && <p className="text-xs text-muted">Te enviaremos un correo para confirmar tu cuenta.</p>}
      </form>
    </div>
  );
}
