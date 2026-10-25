"use client";

import type { Tr } from "@/content/types";
import { useSession, type NativeLang } from "./session";

/**
 * Textos de la interfaz.
 * La plataforma se muestra en alemán (g = german); el idioma nativo (t)
 * se usa en ayudas (tooltips), traducciones y en la pantalla de bienvenida.
 */
const strings = {
  // Inicio y bienvenida (idioma nativo)
  heroTitle: { de: "Dein Weg zum Deutsch – Einheit für Einheit.", es: "Tu camino hacia el alemán, unidad por unidad.", en: "Your path to German, one unit at a time." },
  heroBody: {
    de: "Animierte Videos, klare Erklärungen, Texte und Übungen – von A1 bis B1.",
    es: "Videos animados, explicaciones claras, lecturas y ejercicios para llevarte del A1 al B1, y más adelante a exámenes como TestDaF y Goethe.",
    en: "Animated videos, clear explanations, readings and exercises to take you from A1 to B1, and later to exams like TestDaF and Goethe.",
  },
  signInGoogle: { de: "Mit Google anmelden", es: "Continuar con Google", en: "Continue with Google" },
  signingIn: { de: "Google wird geöffnet …", es: "Abriendo Google…", en: "Opening Google…" },
  demoNotice: { de: "Demo-Modus", es: "Modo demo: el login con Google se activa al conectar Firebase.", en: "Demo mode: Google sign-in turns on once Firebase is connected." },
  onboardingTitle: { de: "Was ist deine Muttersprache?", es: "¿Cuál es tu idioma nativo?", en: "What is your native language?" },
  onboardingBody: {
    de: "Alles ist auf Deutsch. Tippe auf ein Wort, und du siehst die Übersetzung.",
    es: "Todo está en alemán. Toca cualquier palabra y verás su traducción en tu idioma.",
    en: "Everything is in German. Tap any word to see its translation in your language.",
  },
  continue: { de: "Weiter", es: "Continuar", en: "Continue" },
  hello: { de: "Hallo", es: "Hola", en: "Hi" },
  settingsLang: { de: "Übersetzungen auf", es: "Traducciones en", en: "Translations in" },
  signOut: { de: "Abmelden", es: "Cerrar sesión", en: "Sign out" },

  // Plataforma (alemán)
  myCourses: { de: "Meine Kurse", es: "Mis cursos", en: "My courses" },
  comingSoon: { de: "Bald verfügbar", es: "Próximamente", en: "Coming soon" },
  units: { de: "Einheiten", es: "unidades", en: "units" },
  unit: { de: "Einheit", es: "Unidad", en: "Unit" },
  level: { de: "Niveau", es: "Nivel", en: "Level" },
  levels: { de: "Niveaus", es: "Niveles", en: "Levels" },
  start: { de: "Starten", es: "Empezar", en: "Start" },
  available: { de: "verfügbar", es: "disponibles", en: "available" },
  continueLearning: { de: "Weiterlernen", es: "Seguir aprendiendo", en: "Continue learning" },
  english: { de: "Englisch", es: "Inglés", en: "English" },
  examPrep: { de: "Prüfungsvorbereitung", es: "Preparación de exámenes", en: "Exam preparation" },
  inProduction: { de: "In Vorbereitung", es: "En preparación", en: "In preparation" },
  unitNotReady: { de: "Diese Einheit ist noch in Vorbereitung.", es: "Estamos preparando esta unidad.", en: "We're preparing this unit." },
  goToUnit1: { de: "Zu Einheit 1", es: "Ir a la Unidad 1", en: "Go to Unit 1" },
  completed: { de: "Fertig", es: "Completada", en: "Completed" },
  backToLevel: { de: "Zurück zum Niveau", es: "Volver al nivel", en: "Back to level" },
  goals: { de: "In dieser Einheit lernst du", es: "En esta unidad aprenderás", en: "In this unit you will learn" },
  secVideo: { de: "Video", es: "Video", en: "Video" },
  secTheory: { de: "Erklärung", es: "Explicación", en: "Explanation" },
  secReading: { de: "Lesen", es: "Lectura", en: "Reading" },
  secExercises: { de: "Übungen", es: "Ejercicios", en: "Exercises" },
  secGuide: { de: "Arbeitsblatt", es: "Guía descargable", en: "Worksheet" },
  vocab: { de: "Wortschatz", es: "Vocabulario", en: "Vocabulary" },
  secCards: { de: "Karteikarten", es: "Flashcards", en: "Flashcards" },
  myCards: { de: "Meine Karten", es: "Mis flashcards", en: "My flashcards" },
  learn: { de: "Lernen", es: "Aprender", en: "Learn" },
  tapHint: {
    de: "Tippe auf ein Wort: Übersetzung und Aussprache.",
    es: "Toca una palabra para ver su traducción y escuchar cómo se pronuncia. El botón de idioma traduce la frase completa.",
    en: "Tap a word to see its translation and hear it. The language button translates the whole sentence.",
  },
  translate: { de: "Übersetzen", es: "Traducir", en: "Translate" },
  listen: { de: "Anhören", es: "Escuchar", en: "Listen" },
  play: { de: "Abspielen", es: "Reproducir", en: "Play" },
  subtitles: { de: "Untertitel", es: "Subtítulos", en: "Subtitles" },
  videoSoon: { de: "Das Video zu dieser Einheit kommt bald.", es: "El video de esta unidad está en producción.", en: "This unit's video is in production." },
  comprehension: { de: "Hast du alles verstanden?", es: "¿Entendiste todo?", en: "Did you understand everything?" },
  showAnswer: { de: "Antwort zeigen", es: "Ver respuesta", en: "Show answer" },
  check: { de: "Prüfen", es: "Comprobar", en: "Check" },
  correct: { de: "Richtig!", es: "¡Correcto!", en: "Correct!" },
  incorrect: { de: "Leider falsch.", es: "Incorrecto.", en: "Not quite." },
  hint: { de: "Tipp", es: "Pista", en: "Hint" },
  score: { de: "Punkte", es: "Puntos", en: "Score" },
  reset: { de: "Noch einmal", es: "Repetir", en: "Try again" },
  exercisesDone: { de: "Super! Alle Übungen gemacht.", es: "¡Terminaste los ejercicios!", en: "You finished the exercises!" },
  tapToOrder: { de: "Tippe die Wörter in der richtigen Reihenfolge an.", es: "Toca las palabras en orden.", en: "Tap the words in order." },
  right: { de: "Richtig", es: "Verdadero", en: "True" },
  wrong: { de: "Falsch", es: "Falso", en: "False" },
  yourText: { de: "Dein Text …", es: "Tu texto…", en: "Your text…" },
  showModel: { de: "Musterlösung zeigen", es: "Ver modelo de respuesta", en: "Show model answer" },
  model: { de: "Musterlösung", es: "Modelo de respuesta", en: "Model answer" },
  words: { de: "Wörter", es: "palabras", en: "words" },
  downloadPdf: { de: "PDF herunterladen", es: "Descargar PDF", en: "Download PDF" },
  pages: { de: "Seiten", es: "páginas", en: "pages" },
  guideSoon: { de: "Das Arbeitsblatt kommt bald.", es: "La guía en PDF estará disponible pronto.", en: "The PDF worksheet is coming soon." },
} satisfies Record<string, { de: string; es: string; en: string }>;

export type StringKey = keyof typeof strings;

export function translate(lang: NativeLang | "de", key: StringKey) {
  return strings[key][lang];
}

/**
 * g(key)  → texto en alemán (interfaz de la plataforma)
 * t(key)  → texto en el idioma nativo (ayudas, bienvenida)
 * loc(tr) → traducción de contenido al idioma nativo
 */
export function useT() {
  const { nativeLang } = useSession();
  const lang: NativeLang = nativeLang ?? "es";
  return {
    lang,
    g: (key: StringKey) => strings[key].de,
    t: (key: StringKey) => strings[key][lang],
    loc: (tr: Tr) => tr[lang],
  };
}
