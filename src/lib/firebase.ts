import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
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

/** Celular o tablet: ahí el login va por redirección y desde el propio dominio de Isora. */
export const isMobileDevice = () => typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

/** En el celular el login usa el dominio de la app (proxy en next.config.ts) en vez de firebaseapp.com. */
function authDomain() {
  if (typeof window === "undefined") return config.authDomain;
  const local = /^(localhost|127\.|192\.168\.)/.test(window.location.hostname);
  return isMobileDevice() && !local ? window.location.host : config.authDomain;
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

export function getFirebase() {
  if (!firebaseEnabled) return { app: null, auth: null, db: null };
  if (!app) {
    app = getApps()[0] ?? initializeApp({ ...config, authDomain: authDomain() });
    auth = getAuth(app);
    db = getFirestore(app);
  }
  return { app, auth, db };
}
