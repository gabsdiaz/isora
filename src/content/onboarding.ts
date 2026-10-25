/**
 * Cuestionario de bienvenida (registro). Cada pregunta va en alemán sencillo
 * con su traducción, así el estudiante ya aprende mientras se registra.
 */
type L = { es: string; en: string };
export type Choice = { id: string; de: string; emoji?: string; t: L; sub?: L };

export const Q = {
  lang: { de: "Welche Sprache sprichst du?", t: { es: "¿Qué idioma hablas? Lo usaremos para las explicaciones.", en: "Which language do you speak? We'll use it for explanations." } },
  name: { de: "Wie heißt du?", t: { es: "¿Cómo te llamas?", en: "What's your name?" } },
  age: { de: "Wie alt bist du?", t: { es: "¿Cuántos años tienes?", en: "How old are you?" } },
  learn: { de: "Welche Sprache möchtest du lernen?", t: { es: "¿Qué idioma quieres aprender? Puedes elegir varios.", en: "Which language do you want to learn? You can pick several." } },
  why: { de: "Warum lernst du Deutsch?", t: { es: "¿Por qué quieres aprender? Elige todas las que quieras.", en: "Why do you want to learn? Pick as many as you like." } },
  goal: { de: "Was ist dein Ziel?", t: { es: "¿Cuál es tu meta?", en: "What's your goal?" } },
  time: { de: "Wie viel Zeit hast du pro Tag?", t: { es: "¿Cuánto tiempo tienes al día?", en: "How much time do you have per day?" } },
  interests: { de: "Was interessiert dich?", t: { es: "¿Qué te interesa? Elegiremos historias y ejemplos con esto.", en: "What are you into? We'll pick stories and examples with this." } },
} as const;

export const AGES: Choice[] = [
  { id: "u18", de: "unter 18", t: { es: "menos de 18", en: "under 18" } },
  { id: "18-24", de: "18–24", t: { es: "18–24 años", en: "18–24" } },
  { id: "25-34", de: "25–34", t: { es: "25–34 años", en: "25–34" } },
  { id: "35-44", de: "35–44", t: { es: "35–44 años", en: "35–44" } },
  { id: "45-54", de: "45–54", t: { es: "45–54 años", en: "45–54" } },
  { id: "55+", de: "55+", t: { es: "55 o más", en: "55 or more" } },
  { id: "na", de: "Lieber nicht sagen", t: { es: "Prefiero no decirlo", en: "Rather not say" } },
];

export const LANGS: (Choice & { soon?: boolean; code: string })[] = [
  { id: "de", code: "DE", de: "Deutsch", t: { es: "Alemán", en: "German" }, sub: { es: "Disponible · A1 → B1 · Goethe, telc, TestDaF", en: "Available · A1 → B1 · Goethe, telc, TestDaF" } },
  { id: "en", code: "EN", soon: true, de: "Englisch", t: { es: "Inglés", en: "English" }, sub: { es: "Muy pronto · IELTS, TOEFL", en: "Coming soon · IELTS, TOEFL" } },
  { id: "fr", code: "FR", soon: true, de: "Französisch", t: { es: "Francés", en: "French" }, sub: { es: "Más adelante · DELF", en: "Later · DELF" } },
];

export const REASONS: Choice[] = [
  { id: "study", emoji: "🎓", de: "Studium", t: { es: "Estudiar en la universidad", en: "University studies" } },
  { id: "work", emoji: "💼", de: "Arbeit", t: { es: "Trabajo", en: "Work" } },
  { id: "live", emoji: "🏡", de: "Im Ausland leben", t: { es: "Vivir en otro país", en: "Living abroad" } },
  { id: "exam", emoji: "📝", de: "Prüfung", t: { es: "Un examen oficial", en: "An official exam" } },
  { id: "travel", emoji: "✈️", de: "Reisen", t: { es: "Viajar", en: "Travel" } },
  { id: "family", emoji: "❤️", de: "Familie & Liebe", t: { es: "Familia o pareja", en: "Family or partner" } },
  { id: "culture", emoji: "🎶", de: "Kultur", t: { es: "Por gusto y cultura", en: "Fun and culture" } },
  { id: "challenge", emoji: "🧠", de: "Herausforderung", t: { es: "Un reto personal", en: "A personal challenge" } },
];

export const GOALS: Choice[] = [
  { id: "exam", emoji: "📝", de: "Eine Prüfung bestehen", t: { es: "Aprobar un examen", en: "Pass an exam" }, sub: { es: "Goethe, telc, TestDaF, DSH…", en: "Goethe, telc, TestDaF, DSH…" } },
  { id: "everyday", emoji: "🗣️", de: "Im Alltag sprechen", t: { es: "Defenderme en el día a día", en: "Get by in everyday life" }, sub: { es: "Compras, citas, conversaciones", en: "Shopping, appointments, small talk" } },
  { id: "career", emoji: "🚀", de: "Studium oder Beruf", t: { es: "Nivel para estudiar o trabajar", en: "A level for study or work" }, sub: { es: "B1 / B2", en: "B1 / B2" } },
  { id: "relaxed", emoji: "🌱", de: "In meinem Tempo", t: { es: "Aprender a mi ritmo", en: "Learn at my own pace" }, sub: { es: "Sin presión", en: "No pressure" } },
];

export const EXAMS = ["Goethe A1", "Goethe A2", "Goethe B1", "Goethe B2", "Goethe C1", "telc", "TestDaF", "DSH", "ÖSD"];

export const DEADLINES: Choice[] = [
  { id: "3m", de: "In 3 Monaten", t: { es: "En 3 meses", en: "In 3 months" } },
  { id: "6m", de: "In 6 Monaten", t: { es: "En 6 meses", en: "In 6 months" } },
  { id: "1y", de: "In einem Jahr", t: { es: "En un año", en: "In a year" } },
  { id: "free", de: "Kein Stress", t: { es: "Sin fecha", en: "No deadline" } },
];

export const TIMES: (Choice & { minutes: number })[] = [
  { id: "5", minutes: 5, emoji: "☕", de: "5 Minuten", t: { es: "Lo que dura un café", en: "A coffee break" } },
  { id: "10", minutes: 10, emoji: "🥨", de: "10 Minuten", t: { es: "Una pausa corta", en: "A short break" } },
  { id: "20", minutes: 20, emoji: "📖", de: "20 Minuten", t: { es: "En serio", en: "Serious" } },
  { id: "30", minutes: 30, emoji: "🚀", de: "30+ Minuten", t: { es: "Modo intensivo", en: "Intensive mode" } },
];

export const INTERESTS: Choice[] = [
  { id: "music", emoji: "🎵", de: "Musik", t: { es: "Música", en: "Music" } },
  { id: "film", emoji: "🎬", de: "Filme & Serien", t: { es: "Cine y series", en: "Films & series" } },
  { id: "travel", emoji: "🧳", de: "Reisen", t: { es: "Viajes", en: "Travel" } },
  { id: "food", emoji: "🍝", de: "Essen", t: { es: "Comida", en: "Food" } },
  { id: "sport", emoji: "⚽", de: "Sport", t: { es: "Deporte", en: "Sports" } },
  { id: "tech", emoji: "💻", de: "Technik", t: { es: "Tecnología", en: "Tech" } },
  { id: "science", emoji: "🔬", de: "Wissenschaft", t: { es: "Ciencia", en: "Science" } },
  { id: "art", emoji: "🎨", de: "Kunst", t: { es: "Arte", en: "Art" } },
  { id: "books", emoji: "📚", de: "Bücher", t: { es: "Libros", en: "Books" } },
  { id: "business", emoji: "📈", de: "Wirtschaft", t: { es: "Negocios", en: "Business" } },
  { id: "nature", emoji: "🌿", de: "Natur", t: { es: "Naturaleza", en: "Nature" } },
  { id: "games", emoji: "🎮", de: "Videospiele", t: { es: "Videojuegos", en: "Video games" } },
  { id: "fashion", emoji: "👗", de: "Mode", t: { es: "Moda", en: "Fashion" } },
  { id: "history", emoji: "🏛️", de: "Geschichte", t: { es: "Historia", en: "History" } },
  { id: "animals", emoji: "🐶", de: "Tiere", t: { es: "Animales", en: "Animals" } },
  { id: "cooking", emoji: "🥐", de: "Kochen & Backen", t: { es: "Cocinar y hornear", en: "Cooking & baking" } },
];

/** Textos que se pronuncian en el cuestionario (para generar los audios). */
export const ONBOARDING_AUDIO = [...Object.values(Q).map((q) => q.de), "Super! Los geht's!"];
