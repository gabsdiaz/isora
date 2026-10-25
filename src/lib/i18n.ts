"use client";

import type { Localized } from "@/content/types";
import { useSession, type NativeLang } from "./session";

const strings = {
  tagline: {
    es: "Aprende idiomas con calma, profundidad y un objetivo claro.",
    en: "Learn languages with calm, depth and a clear goal.",
  },
  heroTitle: { es: "Tu camino hacia el alemán, unidad por unidad.", en: "Your path to German, one unit at a time." },
  heroBody: {
    es: "Videos animados, explicaciones claras, lecturas y ejercicios pensados para llevarte del A1 al B1, y más adelante a exámenes como TestDaF y Goethe.",
    en: "Animated videos, clear explanations, readings and exercises designed to take you from A1 to B1, and later to exams like TestDaF and Goethe.",
  },
  signInGoogle: { es: "Continuar con Google", en: "Continue with Google" },
  signingIn: { es: "Abriendo Google…", en: "Opening Google…" },
  demoNotice: {
    es: "Modo demo: el login con Google se activa al conectar Firebase.",
    en: "Demo mode: Google sign-in turns on once Firebase is connected.",
  },
  signOut: { es: "Cerrar sesión", en: "Sign out" },
  onboardingTitle: { es: "¿Cuál es tu idioma nativo?", en: "What is your native language?" },
  onboardingBody: {
    es: "En los primeros niveles te explicaremos todo en tu idioma.",
    en: "In the first levels we'll explain everything in your language.",
  },
  continue: { es: "Continuar", en: "Continue" },
  myCourses: { es: "Mis cursos", en: "My courses" },
  comingSoon: { es: "Próximamente", en: "Coming soon" },
  units: { es: "unidades", en: "units" },
  unit: { es: "Unidad", en: "Unit" },
  level: { es: "Nivel", en: "Level" },
  levels: { es: "Niveles", en: "Levels" },
  start: { es: "Empezar", en: "Start" },
  continueLearning: { es: "Seguir aprendiendo", en: "Continue learning" },
  available: { es: "Disponible", en: "Available" },
  inProduction: { es: "En preparación", en: "In preparation" },
  goals: { es: "En esta unidad aprenderás a", en: "In this unit you will learn to" },
  secVideo: { es: "Video", en: "Video" },
  secTheory: { es: "Explicación", en: "Explanation" },
  secReading: { es: "Lectura", en: "Reading" },
  secExercises: { es: "Ejercicios", en: "Exercises" },
  secGuide: { es: "Guía descargable", en: "Downloadable guide" },
  videoSoon: {
    es: "El video animado de esta unidad está en producción.",
    en: "This unit's animated video is in production.",
  },
  guideSoon: {
    es: "La guía en PDF de esta unidad estará disponible pronto.",
    en: "This unit's PDF guide will be available soon.",
  },
  downloadPdf: { es: "Descargar PDF", en: "Download PDF" },
  listen: { es: "Escuchar", en: "Listen" },
  glossary: { es: "Vocabulario", en: "Vocabulary" },
  comprehension: { es: "Comprensión", en: "Comprehension" },
  showAnswer: { es: "Ver respuesta", en: "Show answer" },
  check: { es: "Comprobar", en: "Check" },
  tryAgain: { es: "Intentar de nuevo", en: "Try again" },
  correct: { es: "¡Correcto!", en: "Correct!" },
  incorrect: { es: "Casi…", en: "Not quite…" },
  hint: { es: "Pista", en: "Hint" },
  reset: { es: "Reiniciar", en: "Reset" },
  score: { es: "Aciertos", en: "Score" },
  next: { es: "Siguiente", en: "Next" },
  previous: { es: "Anterior", en: "Previous" },
  backToLevel: { es: "Volver al nivel", en: "Back to level" },
  unitNotReady: {
    es: "Estamos preparando esta unidad con mucho cuidado. Mientras tanto, empieza por la Unidad 1 de A1.1.",
    en: "We're carefully preparing this unit. Meanwhile, start with Unit 1 of A1.1.",
  },
  goToUnit1: { es: "Ir a la Unidad 1", en: "Go to Unit 1" },
  completed: { es: "Completada", en: "Completed" },
  exercisesDone: { es: "¡Terminaste los ejercicios de esta unidad!", en: "You finished this unit's exercises!" },
  tapToOrder: { es: "Toca las palabras en orden", en: "Tap the words in order" },
  hello: { es: "Hola", en: "Hi" },
  langSpanish: { es: "Español", en: "Spanish" },
  langEnglish: { es: "Inglés", en: "English" },
  english: { es: "Inglés", en: "English" },
  examPrep: { es: "Preparación de exámenes", en: "Exam preparation" },
  settingsLang: { es: "Idioma de explicaciones", en: "Explanation language" },
} satisfies Record<string, Localized>;

export type StringKey = keyof typeof strings;

export function translate(lang: NativeLang, key: StringKey) {
  return strings[key][lang];
}

/** Hook: t("clave") para textos de la interfaz y loc(obj) para contenido. */
export function useT() {
  const { nativeLang } = useSession();
  const lang: NativeLang = nativeLang ?? "es";
  return {
    lang,
    t: (key: StringKey) => strings[key][lang],
    loc: (text: Localized) => text[lang],
  };
}
