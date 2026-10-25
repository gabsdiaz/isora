import type { Tr, VocabEntry } from "../types";
import { a1_1 } from "./units/a1-1";
import { imageFor } from "./images";

/**
 * Temas de la Spielzone. Cada tema reúne el vocabulario de varias unidades
 * del A1.1 y trae preguntas para hablar (ruleta).
 */
export type Theme = {
  id: string;
  /** Nivel del curso (por ahora todos los temas son del A1.1) */
  level: string;
  de: string;
  tr: Tr;
  emoji: string;
  units: number[];
  questions: { de: string; tr: Tr }[];
};

const q = (de: string, es: string, en: string) => ({ de, tr: { es, en } });

export const THEMES: Theme[] = [
  {
    id: "ich",
    level: "a1-1",
    de: "Ich & die Welt",
    tr: { es: "Yo y el mundo", en: "Me & the world" },
    emoji: "🌍",
    units: [1, 3],
    questions: [
      q("Wie heißt du?", "¿Cómo te llamas?", "What's your name?"),
      q("Woher kommst du?", "¿De dónde eres?", "Where are you from?"),
      q("Wo wohnst du?", "¿Dónde vives?", "Where do you live?"),
      q("Welche Sprachen sprichst du?", "¿Qué idiomas hablas?", "Which languages do you speak?"),
      q("Wie alt bist du?", "¿Cuántos años tienes?", "How old are you?"),
      q("Wie geht's?", "¿Cómo estás?", "How are you?"),
    ],
  },
  {
    id: "familie",
    level: "a1-1",
    de: "Familie",
    tr: { es: "Familia", en: "Family" },
    emoji: "👨‍👩‍👧",
    units: [5],
    questions: [
      q("Hast du Geschwister?", "¿Tienes hermanos?", "Do you have siblings?"),
      q("Wie heißt deine Mutter?", "¿Cómo se llama tu mamá?", "What's your mother's name?"),
      q("Wie alt ist dein Vater?", "¿Cuántos años tiene tu papá?", "How old is your father?"),
      q("Hast du Kinder?", "¿Tienes hijos?", "Do you have children?"),
      q("Wo wohnt deine Familie?", "¿Dónde vive tu familia?", "Where does your family live?"),
      q("Hast du einen Hund oder eine Katze?", "¿Tienes un perro o un gato?", "Do you have a dog or a cat?"),
    ],
  },
  {
    id: "berufe",
    level: "a1-1",
    de: "Berufe",
    tr: { es: "Profesiones", en: "Jobs" },
    emoji: "💼",
    units: [6],
    questions: [
      q("Was bist du von Beruf?", "¿A qué te dedicas?", "What do you do for a living?"),
      q("Wo arbeitest du?", "¿Dónde trabajas?", "Where do you work?"),
      q("Was studierst du?", "¿Qué estudias?", "What do you study?"),
      q("Arbeitest du gern?", "¿Te gusta trabajar?", "Do you like working?"),
      q("Was ist dein Traumberuf?", "¿Cuál es la profesión de tus sueños?", "What's your dream job?"),
      q("Was ist deine Mutter von Beruf?", "¿A qué se dedica tu mamá?", "What does your mother do?"),
    ],
  },
  {
    id: "kurs",
    level: "a1-1",
    de: "Im Kurs & Sachen",
    tr: { es: "En clase y objetos", en: "Classroom & things" },
    emoji: "✏️",
    units: [2, 8, 9],
    questions: [
      q("Was ist in deiner Tasche?", "¿Qué hay en tu bolso?", "What's in your bag?"),
      q("Was ist auf deinem Tisch?", "¿Qué hay en tu mesa?", "What's on your table?"),
      q("Wie schreibt man deinen Namen?", "¿Cómo se escribe tu nombre?", "How do you spell your name?"),
      q("Hast du ein Wörterbuch?", "¿Tienes un diccionario?", "Do you have a dictionary?"),
      q("Wie heißt dein Lehrer oder deine Lehrerin?", "¿Cómo se llama tu profesor o tu profesora?", "What's your teacher's name?"),
      q("Wie heißt „lápiz“ auf Deutsch?", "¿Cómo se dice «lápiz» en alemán?", "What's “pencil” in German?"),
    ],
  },
  {
    id: "zeit",
    level: "a1-1",
    de: "Zahlen & Zeit",
    tr: { es: "Números y tiempo", en: "Numbers & time" },
    emoji: "🕒",
    units: [4, 7, 10, 11],
    questions: [
      q("Wie spät ist es jetzt?", "¿Qué hora es ahora?", "What time is it now?"),
      q("Wann hast du Geburtstag?", "¿Cuándo es tu cumpleaños?", "When is your birthday?"),
      q("Was ist deine Telefonnummer?", "¿Cuál es tu número de teléfono?", "What's your phone number?"),
      q("Welcher Tag ist heute?", "¿Qué día es hoy?", "What day is it today?"),
      q("Was machst du am Wochenende?", "¿Qué haces el fin de semana?", "What do you do at the weekend?"),
      q("Was ist deine Lieblingsjahreszeit?", "¿Cuál es tu estación favorita?", "What's your favourite season?"),
    ],
  },
  {
    id: "alltag",
    level: "a1-1",
    de: "Alltag & Hobbys",
    tr: { es: "Día a día y pasatiempos", en: "Daily life & hobbies" },
    emoji: "⚽",
    units: [12, 13],
    questions: [
      q("Wann frühstückst du?", "¿A qué hora desayunas?", "When do you have breakfast?"),
      q("Was machst du am Abend?", "¿Qué haces en la noche?", "What do you do in the evening?"),
      q("Was machst du gern?", "¿Qué te gusta hacer?", "What do you like doing?"),
      q("Spielst du ein Instrument?", "¿Tocas un instrumento?", "Do you play an instrument?"),
      q("Machst du Sport?", "¿Haces deporte?", "Do you do sport?"),
      q("Was machst du nicht gern?", "¿Qué no te gusta hacer?", "What don't you like doing?"),
    ],
  },
  {
    id: "essen",
    level: "a1-1",
    de: "Essen & Trinken",
    tr: { es: "Comida y bebida", en: "Food & drink" },
    emoji: "🍎",
    units: [14, 15, 16],
    questions: [
      q("Was isst du gern?", "¿Qué te gusta comer?", "What do you like to eat?"),
      q("Was trinkst du am Morgen?", "¿Qué tomas en la mañana?", "What do you drink in the morning?"),
      q("Magst du Fisch?", "¿Te gusta el pescado?", "Do you like fish?"),
      q("Was möchtest du im Café?", "¿Qué quieres pedir en el café?", "What would you like at the café?"),
      q("Was brauchst du aus dem Supermarkt?", "¿Qué necesitas del supermercado?", "What do you need from the supermarket?"),
      q("Kochst du gern?", "¿Te gusta cocinar?", "Do you like cooking?"),
    ],
  },
  {
    id: "kleidung",
    level: "a1-1",
    de: "Kleidung & Farben",
    tr: { es: "Ropa y colores", en: "Clothes & colours" },
    emoji: "👕",
    units: [17],
    questions: [
      q("Was ist deine Lieblingsfarbe?", "¿Cuál es tu color favorito?", "What's your favourite colour?"),
      q("Welche Farbe hat dein T-Shirt?", "¿De qué color es tu camiseta?", "What colour is your T-shirt?"),
      q("Wie findest du Rot?", "¿Qué te parece el rojo?", "What do you think of red?"),
      q("Hast du einen Mantel?", "¿Tienes un abrigo?", "Do you have a coat?"),
      q("Kaufst du gern Kleidung?", "¿Te gusta comprar ropa?", "Do you like buying clothes?"),
      q("Welche Schuhe magst du?", "¿Qué zapatos te gustan?", "Which shoes do you like?"),
    ],
  },
  {
    id: "wohnung",
    level: "a1-1",
    de: "Wohnung",
    tr: { es: "Vivienda", en: "Home" },
    emoji: "🏠",
    units: [18],
    questions: [
      q("Wie ist deine Wohnung?", "¿Cómo es tu apartamento?", "What's your flat like?"),
      q("Wie viele Zimmer hat deine Wohnung?", "¿Cuántas habitaciones tiene tu apartamento?", "How many rooms does your flat have?"),
      q("Gibt es einen Balkon?", "¿Hay un balcón?", "Is there a balcony?"),
      q("Was ist in deinem Zimmer?", "¿Qué hay en tu habitación?", "What's in your room?"),
      q("Wohnst du allein?", "¿Vives solo o sola?", "Do you live alone?"),
      q("Ist deine Küche groß oder klein?", "¿Tu cocina es grande o pequeña?", "Is your kitchen big or small?"),
    ],
  },
  {
    id: "wetter",
    level: "a1-1",
    de: "Wetter",
    tr: { es: "Clima", en: "Weather" },
    emoji: "☀️",
    units: [19],
    questions: [
      q("Wie ist das Wetter heute?", "¿Cómo está el clima hoy?", "What's the weather like today?"),
      q("Wie viel Grad sind es?", "¿Cuántos grados hace?", "How many degrees is it?"),
      q("Magst du den Winter?", "¿Te gusta el invierno?", "Do you like winter?"),
      q("Regnet es oft in deiner Stadt?", "¿Llueve a menudo en tu ciudad?", "Does it often rain in your city?"),
      q("Was ist deine Lieblingsjahreszeit?", "¿Cuál es tu estación favorita?", "What's your favourite season?"),
      q("Ist es heute warm oder kalt?", "¿Hoy hace calor o frío?", "Is it warm or cold today?"),
    ],
  },
];

export const ALL_THEME: Theme = {
  id: "alles",
  level: "a1-1",
  de: "Alles gemischt",
  tr: { es: "Todo mezclado", en: "Everything mixed" },
  emoji: "🎲",
  units: a1_1.map((u) => u.number),
  questions: THEMES.flatMap((t) => t.questions),
};

export const ALL_THEMES = [...THEMES, ALL_THEME];

export function getTheme(id: string) {
  return ALL_THEMES.find((t) => t.id === id);
}

/** Palabras del tema (sin frases), sin repetidas. */
export function themeWords(theme: Theme): VocabEntry[] {
  const seen = new Set<string>();
  const out: VocabEntry[] = [];
  for (const u of a1_1) {
    if (!theme.units.includes(u.number)) continue;
    for (const v of u.vocab) {
      if (v.meta || seen.has(v.de)) continue;
      if (/[?!.…]/.test(v.de)) continue;
      seen.add(v.de);
      out.push(v);
    }
  }
  return out;
}

/** Sustantivos con artículo (para der/die/das). */
export const themeNouns = (theme: Theme) => themeWords(theme).filter((v) => v.article && !v.de.includes(" "));

/** Palabras con dibujo (para Memory y "Was ist das?"). */
export const themePictureWords = (theme: Theme) => themeWords(theme).filter((v) => imageFor(v.de));

/** Palabras para el ahorcado: una sola palabra, solo letras. */
export const hangmanWords = (theme: Theme) => themeWords(theme).filter((v) => /^[A-Za-zÄÖÜäöüß-]{3,13}$/.test(v.de));

export const GAMES = [
  { id: "artikel", de: "Der, die, das", tr: { es: "Adivina el artículo", en: "Guess the article" }, emoji: "🎯" },
  { id: "memory", de: "Memory", tr: { es: "Encuentra las parejas", en: "Find the pairs" }, emoji: "🧠" },
  { id: "gluecksrad", de: "Glücksrad", tr: { es: "Ruleta de preguntas", en: "Question wheel" }, emoji: "🎡" },
  { id: "galgen", de: "Galgenmännchen", tr: { es: "Ahorcado", en: "Hangman" }, emoji: "🪢" },
] as const;

export type GameId = (typeof GAMES)[number]["id"];
