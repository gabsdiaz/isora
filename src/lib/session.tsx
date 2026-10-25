"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { firebaseEnabled, getFirebase } from "./firebase";

export type NativeLang = "es" | "en";

export type IsoraUser = {
  uid: string;
  name: string;
  email: string;
  photoURL?: string | null;
};

type Session = {
  user: IsoraUser | null;
  nativeLang: NativeLang | null;
  loading: boolean;
  demoMode: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setNativeLang: (lang: NativeLang) => Promise<void>;
};

const SessionContext = createContext<Session | null>(null);

const DEMO_USER_KEY = "isora.demoUser";
const langKey = (uid: string) => `isora.nativeLang.${uid}`;

function readLocal<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeLocal(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* almacenamiento no disponible: seguimos sin él */
  }
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IsoraUser | null>(null);
  const [nativeLang, setLang] = useState<NativeLang | null>(null);
  const [loading, setLoading] = useState(true);

  // Carga el idioma nativo del usuario (Firestore si existe, si no el navegador)
  const loadProfile = useCallback(async (u: IsoraUser) => {
    let lang = readLocal<NativeLang>(langKey(u.uid));
    const { db } = getFirebase();
    if (db) {
      try {
        const snap = await getDoc(doc(db, "users", u.uid));
        const remote = snap.data()?.nativeLang as NativeLang | undefined;
        if (remote) lang = remote;
      } catch {
        /* sin conexión o reglas aún no configuradas: usamos el valor local */
      }
    }
    setLang(lang);
  }, []);

  useEffect(() => {
    const { auth } = getFirebase();
    if (!auth) {
      // Modo demo: usuario simulado guardado en el navegador
      // (se lee de forma asíncrona, igual que haría Firebase)
      let cancelled = false;
      Promise.resolve().then(() => {
        if (cancelled) return;
        const demo = readLocal<IsoraUser>(DEMO_USER_KEY);
        setUser(demo);
        if (demo) setLang(readLocal<NativeLang>(langKey(demo.uid)));
        setLoading(false);
      });
      return () => {
        cancelled = true;
      };
    }
    return onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setLang(null);
        setLoading(false);
        return;
      }
      const u: IsoraUser = {
        uid: fbUser.uid,
        name: fbUser.displayName ?? "Estudiante",
        email: fbUser.email ?? "",
        photoURL: fbUser.photoURL,
      };
      setUser(u);
      await loadProfile(u);
      setLoading(false);
    });
  }, [loadProfile]);

  const signInWithGoogle = useCallback(async () => {
    const { auth } = getFirebase();
    if (!auth) {
      const demo: IsoraUser = { uid: "demo", name: "Estudiante demo", email: "demo@isora.app" };
      writeLocal(DEMO_USER_KEY, demo);
      setUser(demo);
      setLang(readLocal<NativeLang>(langKey(demo.uid)));
      return;
    }
    await signInWithPopup(auth, new GoogleAuthProvider());
  }, []);

  const signOut = useCallback(async () => {
    const { auth } = getFirebase();
    if (auth) await fbSignOut(auth);
    writeLocal(DEMO_USER_KEY, null);
    setUser(null);
    setLang(null);
  }, []);

  const setNativeLang = useCallback(
    async (lang: NativeLang) => {
      if (!user) return;
      setLang(lang);
      writeLocal(langKey(user.uid), lang);
      const { db } = getFirebase();
      if (db) {
        try {
          await setDoc(
            doc(db, "users", user.uid),
            { nativeLang: lang, name: user.name, email: user.email, updatedAt: serverTimestamp() },
            { merge: true },
          );
        } catch {
          /* se queda guardado localmente */
        }
      }
    },
    [user],
  );

  const value = useMemo<Session>(
    () => ({
      user,
      nativeLang,
      loading,
      demoMode: !firebaseEnabled,
      signInWithGoogle,
      signOut,
      setNativeLang,
    }),
    [user, nativeLang, loading, signInWithGoogle, signOut, setNativeLang],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession debe usarse dentro de <SessionProvider>");
  return ctx;
}
