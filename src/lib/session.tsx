"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
  getRedirectResult,
  signInWithCredential,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut as fbSignOut,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { firebaseEnabled, getFirebase, isMobileDevice, usesGoogleButton } from "./firebase";

export type NativeLang = "es" | "en";

/** Lo que el estudiante cuenta en el registro (cuestionario de bienvenida). */
export type StudentProfile = {
  name: string;
  age?: string;
  /** Idiomas que quiere aprender ("de", "en", "fr"…) */
  languages?: string[];
  reasons?: string[];
  goal?: string;
  exam?: string;
  deadline?: string;
  minutes?: number;
  interests?: string[];
  at?: number;
};

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
  /** Código del último error de login (para mostrarlo y poder diagnosticar) */
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  /** Inicia sesión con el token del botón oficial de Google (celular) */
  signInWithGoogleToken: (idToken: string) => Promise<void>;
  /** Correo y contraseña: devuelven el código de error de Firebase o null si todo salió bien */
  signUpWithEmail: (email: string, password: string) => Promise<string | null>;
  signInWithEmail: (email: string, password: string) => Promise<string | null>;
  resetPassword: (email: string) => Promise<string | null>;
  profile: StudentProfile | null;
  saveProfile: (p: StudentProfile, lang: NativeLang) => Promise<void>;
  signOut: () => Promise<void>;
  setNativeLang: (lang: NativeLang) => Promise<void>;
};

const SessionContext = createContext<Session | null>(null);

const DEMO_USER_KEY = "isora.demoUser";
const langKey = (uid: string) => `isora.nativeLang.${uid}`;
const profileKey = (uid: string) => `isora.profile.${uid}`;

function readLocal<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

/** Espera una promesa como máximo `ms` milisegundos (en el celular la red puede colgarse). */
function withTimeout<T>(p: Promise<T>, ms: number): Promise<T | undefined> {
  return Promise.race([p, new Promise<undefined>((r) => setTimeout(() => r(undefined), ms))]);
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
  const [authError, setAuthError] = useState<string | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  // Carga el idioma nativo del usuario (Firestore si existe, si no el navegador)
  const loadProfile = useCallback(async (u: IsoraUser) => {
    let lang = readLocal<NativeLang>(langKey(u.uid));
    let prof = readLocal<StudentProfile>(profileKey(u.uid));
    const { db } = getFirebase();
    if (db) {
      try {
        const snap = await withTimeout(getDoc(doc(db, "users", u.uid)), 3500);
        const remote = snap?.data()?.nativeLang as NativeLang | undefined;
        if (remote) lang = remote;
        const rp = snap?.data()?.profile as StudentProfile | undefined;
        if (rp) prof = rp;
      } catch {
        /* sin conexión o reglas aún no configuradas: usamos el valor local */
      }
    }
    setLang(lang);
    setProfile(prof);
  }, []);

  // Señal para el aviso de "navegador sin soporte" (layout.tsx): la app sí arrancó
  useEffect(() => {
    (window as unknown as { __isoraReady?: boolean }).__isoraReady = true;
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
        if (demo) {
          setLang(readLocal<NativeLang>(langKey(demo.uid)));
          setProfile(readLocal<StudentProfile>(profileKey(demo.uid)));
        }
        setLoading(false);
      });
      return () => {
        cancelled = true;
      };
    }
    // Vuelta del login por redirección (celular): si Google devolvió un error, lo mostramos
    if (!usesGoogleButton()) getRedirectResult(auth).catch((e: { code?: string }) => setAuthError(e.code ?? "auth/error"));
    // Si Firebase no responde (red lenta), no dejamos al estudiante mirando el spinner
    const safety = setTimeout(() => setLoading(false), 8000);
    const off = onAuthStateChanged(auth, async (fbUser) => {
      clearTimeout(safety);
      if (!fbUser) {
        setUser(null);
        setLang(null);
        setProfile(null);
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
    return () => {
      clearTimeout(safety);
      off();
    };
  }, [loadProfile]);

  const signInWithGoogle = useCallback(async () => {
    const { auth } = getFirebase();
    if (!auth) {
      const demo: IsoraUser = { uid: "demo", name: "Estudiante demo", email: "demo@isora.app" };
      writeLocal(DEMO_USER_KEY, demo);
      setUser(demo);
      setLang(readLocal<NativeLang>(langKey(demo.uid)));
      setProfile(readLocal<StudentProfile>(profileKey(demo.uid)));
      return;
    }
    const provider = new GoogleAuthProvider();
    setAuthError(null);
    // En el celular: redirección (las ventanas emergentes no vuelven bien a la pestaña)
    if (isMobileDevice()) {
      await signInWithRedirect(auth, provider);
      return;
    }
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      // En algunos celulares la ventana emergente está bloqueada: entramos por redirección
      const code = (e as { code?: string }).code ?? "";
      if (code === "auth/popup-blocked" || code === "auth/operation-not-supported-in-this-environment" || code === "auth/web-storage-unsupported") {
        await signInWithRedirect(auth, provider);
        return;
      }
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return;
      setAuthError(code || "auth/error");
      throw e;
    }
  }, []);

  const signInWithGoogleToken = useCallback(async (idToken: string) => {
    const { auth } = getFirebase();
    if (!auth) return;
    setAuthError(null);
    try {
      const done = await withTimeout(signInWithCredential(auth, GoogleAuthProvider.credential(idToken)), 20000);
      if (!done) setAuthError("auth/timeout");
    } catch (e) {
      setAuthError((e as { code?: string }).code ?? "auth/error");
    }
  }, []);

  // Modo demo (sin Firebase): entramos con un usuario simulado con ese correo
  const demoEmailLogin = useCallback((email: string) => {
    const demo: IsoraUser = { uid: "demo", name: "Estudiante demo", email: email.trim() || "demo@isora.app" };
    writeLocal(DEMO_USER_KEY, demo);
    setUser(demo);
    setLang(readLocal<NativeLang>(langKey(demo.uid)));
    setProfile(readLocal<StudentProfile>(profileKey(demo.uid)));
    return null;
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    const { auth } = getFirebase();
    if (!auth) return demoEmailLogin(email);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      sendEmailVerification(cred.user).catch(() => undefined);
      return null;
    } catch (e) {
      return (e as { code?: string }).code ?? "auth/error";
    }
  }, [demoEmailLogin]);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const { auth } = getFirebase();
    if (!auth) return demoEmailLogin(email);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      return null;
    } catch (e) {
      return (e as { code?: string }).code ?? "auth/error";
    }
  }, [demoEmailLogin]);

  const resetPassword = useCallback(async (email: string) => {
    const { auth } = getFirebase();
    if (!auth) return "auth/not-enabled";
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return null;
    } catch (e) {
      return (e as { code?: string }).code ?? "auth/error";
    }
  }, []);

  const saveProfile = useCallback(
    async (p: StudentProfile, lang: NativeLang) => {
      if (!user) return;
      const full = { ...p, at: Date.now() };
      setProfile(full);
      setLang(lang);
      writeLocal(profileKey(user.uid), full);
      writeLocal(langKey(user.uid), lang);
      const { db, auth } = getFirebase();
      if (auth?.currentUser && p.name && !auth.currentUser.displayName) updateProfile(auth.currentUser, { displayName: p.name }).catch(() => undefined);
      if (db) {
        setDoc(doc(db, "users", user.uid), { nativeLang: lang, name: p.name || user.name, email: user.email, profile: full, updatedAt: serverTimestamp() }, { merge: true }).catch(
          () => undefined,
        );
      }
    },
    [user],
  );

  const signOut = useCallback(async () => {
    const { auth } = getFirebase();
    if (auth) await fbSignOut(auth);
    writeLocal(DEMO_USER_KEY, null);
    setUser(null);
    setLang(null);
    setProfile(null);
  }, []);

  const setNativeLang = useCallback(
    async (lang: NativeLang) => {
      if (!user) return;
      setLang(lang);
      writeLocal(langKey(user.uid), lang);
      const { db } = getFirebase();
      if (db) {
        // Se guarda en la nube en segundo plano (no hacemos esperar al estudiante)
        setDoc(doc(db, "users", user.uid), { nativeLang: lang, name: user.name, email: user.email, updatedAt: serverTimestamp() }, { merge: true }).catch(
          () => undefined,
        );
      }
    },
    [user],
  );

  // El nombre que el estudiante eligió en el cuestionario tiene prioridad sobre el de la cuenta
  const chosenName = profile?.name;
  const shownUser = useMemo(() => (user && chosenName ? { ...user, name: chosenName } : user), [user, chosenName]);

  const value = useMemo<Session>(
    () => ({
      user: shownUser,
      nativeLang,
      loading,
      demoMode: !firebaseEnabled,
      authError,
      signInWithGoogle,
      signInWithGoogleToken,
      signUpWithEmail,
      signInWithEmail,
      resetPassword,
      profile,
      saveProfile,
      signOut,
      setNativeLang,
    }),
    [shownUser, nativeLang, loading, authError, signInWithGoogle, signInWithGoogleToken, signUpWithEmail, signInWithEmail, resetPassword, profile, saveProfile, signOut, setNativeLang],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession debe usarse dentro de <SessionProvider>");
  return ctx;
}
