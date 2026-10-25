/**
 * Cuestionario de bienvenida (registro).
 * Va en el idioma del estudiante (español, o inglés si lo elige), porque Isora no es
 * solo alemán: también vendrán otros idiomas y, más adelante, ciencias.
 * Varias preguntas tienen "Otro" para que el estudiante escriba su respuesta.
 */
export type L = { es: string; en: string };
export type Choice = { id: string; emoji?: string; t: L; sub?: L };

/** Valor especial de las opciones "Otro" (el texto va en profile.other). */
export const OTHER = "other";

export const Q = {
  lang: { t: { es: "¿En qué idioma quieres las explicaciones?", en: "Which language do you want explanations in?" }, sub: { es: "Lo usamos para las explicaciones, traducciones y subtítulos.", en: "We use it for explanations, translations and subtitles." } },
  name: { t: { es: "¿Cómo te llamas?", en: "What's your name?" }, sub: { es: "Así te vamos a saludar.", en: "That's how we'll greet you." } },
  age: { t: { es: "¿Cuántos años tienes?", en: "How old are you?" }, sub: { es: "Nos ayuda a elegir ejemplos y temas para ti.", en: "It helps us pick examples and topics for you." } },
  learn: { t: { es: "¿Qué quieres aprender?", en: "What do you want to learn?" }, sub: { es: "Puedes elegir varias opciones.", en: "You can pick several." } },
  why: { t: { es: "¿Por qué quieres aprenderlo?", en: "Why do you want to learn it?" }, sub: { es: "Elige todas las que quieras.", en: "Pick as many as you like." } },
  goal: { t: { es: "¿Cuál es tu meta?", en: "What's your goal?" }, sub: { es: "Con esto ajustamos el nivel al que quieres llegar.", en: "This sets the level you want to reach." } },
  time: { t: { es: "¿Cuánto tiempo tienes para estudiar?", en: "How much time do you have to study?" }, sub: { es: "Con esto armamos tu plan de estudio.", en: "We'll build your study plan with this." } },
  interests: { t: { es: "¿Qué te interesa?", en: "What are you into?" }, sub: { es: "Elegiremos historias, canciones y ejemplos con esto.", en: "We'll pick stories, songs and examples with this." } },
} as const;

export const AGES: Choice[] = [
  { id: "u18", t: { es: "Menos de 18", en: "Under 18" } },
  { id: "18-24", t: { es: "18 – 24", en: "18 – 24" } },
  { id: "25-34", t: { es: "25 – 34", en: "25 – 34" } },
  { id: "35-44", t: { es: "35 – 44", en: "35 – 44" } },
  { id: "45-54", t: { es: "45 – 54", en: "45 – 54" } },
  { id: "55+", t: { es: "55 o más", en: "55 or more" } },
  { id: "na", t: { es: "Prefiero no decirlo", en: "Rather not say" } },
];

export type Subject = Choice & { badge: string; group: "lang" | "science"; status: "ready" | "soon" | "later" };
export const SUBJECTS: Subject[] = [
  { id: "de", badge: "DE", group: "lang", status: "ready", t: { es: "Alemán", en: "German" }, sub: { es: "A1 → B1 · Goethe, telc, TestDaF", en: "A1 → B1 · Goethe, telc, TestDaF" } },
  { id: "en", badge: "EN", group: "lang", status: "soon", t: { es: "Inglés", en: "English" }, sub: { es: "IELTS, TOEFL, Cambridge", en: "IELTS, TOEFL, Cambridge" } },
  { id: "fr", badge: "FR", group: "lang", status: "later", t: { es: "Francés", en: "French" }, sub: { es: "DELF, DALF", en: "DELF, DALF" } },
  { id: "it", badge: "IT", group: "lang", status: "later", t: { es: "Italiano", en: "Italian" } },
  { id: "pt", badge: "PT", group: "lang", status: "later", t: { es: "Portugués", en: "Portuguese" } },
  { id: "math", badge: "∑", group: "science", status: "later", t: { es: "Matemáticas", en: "Maths" } },
  { id: "physics", badge: "⚛", group: "science", status: "later", t: { es: "Física", en: "Physics" } },
];

export const REASONS: Choice[] = [
  { id: "study", emoji: "🎓", t: { es: "Estudiar en la universidad", en: "University studies" } },
  { id: "work", emoji: "💼", t: { es: "Trabajo", en: "Work" } },
  { id: "live", emoji: "🏡", t: { es: "Vivir en otro país", en: "Living abroad" } },
  { id: "exam", emoji: "📝", t: { es: "Presentar un examen oficial", en: "Taking an official exam" } },
  { id: "travel", emoji: "✈️", t: { es: "Viajar", en: "Travel" } },
  { id: "family", emoji: "❤️", t: { es: "Familia o pareja", en: "Family or partner" } },
  { id: "culture", emoji: "🎶", t: { es: "Por gusto y cultura", en: "Fun and culture" } },
  { id: "challenge", emoji: "🧠", t: { es: "Un reto personal", en: "A personal challenge" } },
];

export const GOALS: Choice[] = [
  { id: "exam", emoji: "📝", t: { es: "Aprobar un examen", en: "Pass an exam" }, sub: { es: "Un certificado oficial", en: "An official certificate" } },
  { id: "everyday", emoji: "🗣️", t: { es: "Defenderme en el día a día", en: "Get by in everyday life" }, sub: { es: "Compras, citas, conversaciones", en: "Shopping, appointments, small talk" } },
  { id: "career", emoji: "🚀", t: { es: "Nivel para estudiar o trabajar", en: "A level for study or work" }, sub: { es: "B1 / B2", en: "B1 / B2" } },
  { id: "relaxed", emoji: "🌱", t: { es: "Aprender a mi ritmo", en: "Learn at my own pace" }, sub: { es: "Sin presión", en: "No pressure" } },
];

/** Exámenes según lo que quiere aprender */
export const EXAMS_BY_SUBJECT: Record<string, string[]> = {
  de: ["Goethe A1", "Goethe A2", "Goethe B1", "Goethe B2", "Goethe C1", "telc", "TestDaF", "DSH", "ÖSD"],
  en: ["IELTS", "TOEFL", "Cambridge"],
  fr: ["DELF", "DALF"],
};

export const DEADLINES: Choice[] = [
  { id: "3m", t: { es: "En 3 meses", en: "In 3 months" } },
  { id: "6m", t: { es: "En 6 meses", en: "In 6 months" } },
  { id: "1y", t: { es: "En un año", en: "In a year" } },
  { id: "free", t: { es: "Sin fecha", en: "No deadline" } },
];

export const TIMES: (Choice & { minutes: number })[] = [
  { id: "5", minutes: 5, emoji: "☕", t: { es: "5 minutos", en: "5 minutes" }, sub: { es: "Lo que dura un café", en: "A coffee break" } },
  { id: "10", minutes: 10, emoji: "🥨", t: { es: "10 minutos", en: "10 minutes" }, sub: { es: "Una pausa corta", en: "A short break" } },
  { id: "20", minutes: 20, emoji: "📖", t: { es: "20 minutos", en: "20 minutes" }, sub: { es: "En serio", en: "Serious" } },
  { id: "30", minutes: 30, emoji: "🎧", t: { es: "30 minutos", en: "30 minutes" }, sub: { es: "Media hora diaria", en: "Half an hour a day" } },
  { id: "60", minutes: 60, emoji: "🚀", t: { es: "1 hora", en: "1 hour" }, sub: { es: "Modo intensivo", en: "Intensive mode" } },
  { id: "90", minutes: 90, emoji: "🔥", t: { es: "90+ minutos", en: "90+ minutes" }, sub: { es: "Modo examen", en: "Exam mode" } },
];

export const DAYS = [2, 3, 4, 5, 6, 7];

export const INTERESTS: Choice[] = [
  { id: "music", emoji: "🎵", t: { es: "Música", en: "Music" } },
  { id: "film", emoji: "🎬", t: { es: "Cine y series", en: "Films & series" } },
  { id: "travel", emoji: "🧳", t: { es: "Viajes", en: "Travel" } },
  { id: "food", emoji: "🍝", t: { es: "Comida", en: "Food" } },
  { id: "sport", emoji: "⚽", t: { es: "Deporte", en: "Sports" } },
  { id: "tech", emoji: "💻", t: { es: "Tecnología", en: "Tech" } },
  { id: "science", emoji: "🔬", t: { es: "Ciencia", en: "Science" } },
  { id: "art", emoji: "🎨", t: { es: "Arte", en: "Art" } },
  { id: "books", emoji: "📚", t: { es: "Libros", en: "Books" } },
  { id: "business", emoji: "📈", t: { es: "Negocios", en: "Business" } },
  { id: "nature", emoji: "🌿", t: { es: "Naturaleza", en: "Nature" } },
  { id: "games", emoji: "🎮", t: { es: "Videojuegos", en: "Video games" } },
  { id: "fashion", emoji: "👗", t: { es: "Moda", en: "Fashion" } },
  { id: "history", emoji: "🏛️", t: { es: "Historia", en: "History" } },
  { id: "animals", emoji: "🐶", t: { es: "Animales", en: "Animals" } },
  { id: "cooking", emoji: "🥐", t: { es: "Cocinar y hornear", en: "Cooking & baking" } },
];
