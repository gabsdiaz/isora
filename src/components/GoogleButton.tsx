"use client";

import { useEffect, useRef, useState } from "react";
import { GOOGLE_CLIENT_ID } from "@/lib/firebase";

type GsiResponse = { credential: string };
type Gsi = {
  accounts: {
    id: {
      initialize: (o: Record<string, unknown>) => void;
      renderButton: (el: HTMLElement, o: Record<string, unknown>) => void;
    };
  };
};

let loader: Promise<void> | null = null;
function loadGsi() {
  if (!loader)
    loader = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://accounts.google.com/gsi/client";
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("gsi"));
      document.head.appendChild(s);
    });
  return loader;
}

/**
 * Botón oficial "Continuar con Google" (Google Identity Services).
 * En el celular evita las ventanas emergentes y redirecciones de Firebase:
 * Google entrega un token y con él iniciamos sesión en Firebase.
 */
export function GoogleButton({ onToken, onError, locale = "es" }: { onToken: (idToken: string) => void; onError: (code: string) => void; locale?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    loadGsi()
      .then(() => {
        const google = (window as unknown as { google?: Gsi }).google;
        if (!alive || !google || !box.current) return;
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (r: GsiResponse) => onToken(r.credential),
          ux_mode: "popup",
          use_fedcm_for_button: true,
        });
        google.accounts.id.renderButton(box.current, { type: "standard", theme: "filled_black", size: "large", shape: "pill", text: "continue_with", locale, width: 280 });
        setReady(true);
      })
      .catch(() => onError("gsi/load-failed"));
    return () => {
      alive = false;
    };
  }, [onToken, onError, locale]);

  return (
    <div className="min-h-[44px]">
      {!ready && <div className="h-11 w-[280px] animate-pulse rounded-full bg-cream-deep" />}
      <div ref={box} />
    </div>
  );
}
