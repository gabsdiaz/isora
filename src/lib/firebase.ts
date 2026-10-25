import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { browserLocalPersistence, getAuth, initializeAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

/**
 * Configuración de Firebase. Los valores vienen de variables de entorno
 * (archivo .env.local en tu computador, o "Environment Variables" en Vercel).
 * Si faltan, la app funciona en "modo demo" (login simulado, datos en el navegador).
 */
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseEnabled = Boolean(config.apiKey && config.authDomain && config.projectId);
export const firebaseApiKey = config.apiKey ?? "";

/** ID de cliente web de Google (Credenciales de Google Cloud). Es público: va en el navegador. */
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "412381183744-p7u847fisobeloafo2kad3p2a8qprdld.apps.googleusercontent.com";

/** Celular o tablet: ahí usamos el botón oficial de Google (ver GoogleButton.tsx). */
export const isMobileDevice = () => typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

/** Celular con ID de cliente: se entra con el botón oficial de Google. */
export const usesGoogleButton = () => typeof window !== "undefined" && isMobileDevice() && Boolean(GOOGLE_CLIENT_ID);

/** En el celular el login usa el dominio de la app (proxy en next.config.ts) en vez de firebaseapp.com. */
function authDomain() {
  if (typeof window === "undefined") return config.authDomain;
  const local = /^(localhost|127\.|192\.168\.)/.test(window.location.hostname);
  // Con el botón de Google (GIS) ya no hace falta el dominio propio; se deja como respaldo sin ID de cliente
  return isMobileDevice() && !local && !GOOGLE_CLIENT_ID ? window.location.host : config.authDomain;
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

export function getFirebase() {
  if (!firebaseEnabled) return { app: null, auth: null, db: null };
  if (!app) {
    app = getApps()[0] ?? initializeApp({ ...config, authDomain: authDomain() });
    if (usesGoogleButton()) {
      // Celular: sin el "ayudante" de ventanas/redirecciones de Firebase (un iframe que Chrome móvil
      // bloquea y deja el login esperando para siempre). Iniciamos sesión con el token del botón de Google.
      try {
        Object.keys(sessionStorage)
          .filter((k) => k.startsWith("firebase:pendingRedirect") || k.startsWith("firebase:redirectEvent"))
          .forEach((k) => sessionStorage.removeItem(k));
      } catch {
        /* sin sessionStorage */
      }
      // localStorage en vez de IndexedDB (en algunos celulares IndexedDB se cuelga al abrir)
      auth = initializeAuth(app, { persistence: browserLocalPersistence });
    } else {
      auth = getAuth(app);
    }
    db = getFirestore(app);
  }
  return { app, auth, db };
}
