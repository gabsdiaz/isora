import type { Course, Level, UnitMeta } from "../types";

/**
 * Temario de Alemán (propuesta basada en el MCER).
 * Para cambiar un tema, edita el título aquí: el resto de la app se actualiza sola.
 */
const u = (number: number, title: string, es: string, en: string): UnitMeta => ({
  number,
  title,
  topic: { es, en },
});

const a1_1: Level = {
  id: "a1-1",
  label: "A1.1",
  name: { es: "Principiante I", en: "Beginner I" },
  description: {
    es: "Tus primeras palabras: saludar, presentarte y hablar de lo más cercano.",
    en: "Your first words: greeting, introducing yourself and talking about everyday things.",
  },
  units: [
    u(1, "Vorstellung", "Presentarse y saludar", "Introductions and greetings"),
    u(2, "Das Alphabet", "El alfabeto y deletrear", "The alphabet and spelling"),
    u(3, "Woher kommst du?", "Países e idiomas", "Countries and languages"),
    u(4, "Zahlen bis 20", "Números hasta 20", "Numbers up to 20"),
    u(5, "Meine Familie", "La familia", "Family"),
    u(6, "Berufe", "Profesiones", "Jobs"),
    u(7, "Zahlen bis 100", "Números hasta 100", "Numbers up to 100"),
    u(8, "Der, die, das", "Artículos y género", "Articles and gender"),
    u(9, "Im Klassenzimmer", "En el salón de clases", "In the classroom"),
    u(10, "Wie spät ist es?", "La hora", "Telling the time"),
    u(11, "Tage und Monate", "Días y meses", "Days and months"),
    u(12, "Mein Tag", "Mi rutina", "My daily routine"),
    u(13, "Hobbys", "Pasatiempos", "Hobbies"),
    u(14, "Essen und Trinken", "Comida y bebida", "Food and drink"),
    u(15, "Im Café", "En el café", "At the café"),
    u(16, "Einkaufen", "De compras", "Shopping"),
    u(17, "Farben und Kleidung", "Colores y ropa", "Colours and clothes"),
    u(18, "Meine Wohnung", "Mi apartamento", "My flat"),
    u(19, "Das Wetter", "El clima", "The weather"),
    u(20, "Wiederholung A1.1", "Repaso del nivel", "Level review"),
  ],
};

const a1_2: Level = {
  id: "a1-2",
  label: "A1.2",
  name: { es: "Principiante II", en: "Beginner II" },
  description: {
    es: "Citas, restaurantes, la ciudad y tus primeras frases en pasado.",
    en: "Appointments, restaurants, the city and your first sentences in the past.",
  },
  units: [
    u(1, "Termine", "Hacer citas", "Making appointments"),
    u(2, "Verabredungen", "Quedar con amigos", "Making plans with friends"),
    u(3, "Können und wollen", "Verbos modales I", "Modal verbs I"),
    u(4, "Im Restaurant", "En el restaurante", "At the restaurant"),
    u(5, "Der Akkusativ", "El acusativo", "The accusative case"),
    u(6, "Der Körper", "El cuerpo", "The body"),
    u(7, "Beim Arzt", "En el médico", "At the doctor's"),
    u(8, "In der Stadt", "La ciudad", "In the city"),
    u(9, "Wegbeschreibung", "Pedir y dar direcciones", "Asking for directions"),
    u(10, "Verkehrsmittel", "Medios de transporte", "Transport"),
    u(11, "Trennbare Verben", "Verbos separables", "Separable verbs"),
    u(12, "Possessivartikel", "Los posesivos", "Possessive articles"),
    u(13, "Feste und Feiertage", "Fiestas y celebraciones", "Holidays and celebrations"),
    u(14, "Arbeit und Alltag", "Trabajo y vida diaria", "Work and everyday life"),
    u(15, "Das Perfekt", "El Perfekt (pasado)", "The perfect tense"),
    u(16, "Am Wochenende", "El fin de semana", "The weekend"),
    u(17, "Reisen", "Viajes", "Travel"),
    u(18, "Im Hotel", "En el hotel", "At the hotel"),
    u(19, "Der Imperativ", "El imperativo", "The imperative"),
    u(20, "Wiederholung A1.2", "Repaso del nivel", "Level review"),
  ],
};

const a2_1: Level = {
  id: "a2-1",
  label: "A2.1",
  name: { es: "Básico I", en: "Elementary I" },
  description: {
    es: "Cuenta tu historia, habla de salud y vivienda, y conecta ideas.",
    en: "Tell your story, talk about health and housing, and connect ideas.",
  },
  units: [
    u(1, "Mein Lebenslauf", "Mi historia personal", "My life story"),
    u(2, "Perfekt mit sein", "Perfekt con sein", "Perfect tense with sein"),
    u(3, "Schule und Ausbildung", "Educación y formación", "School and training"),
    u(4, "Der Dativ", "El dativo", "The dative case"),
    u(5, "Wechselpräpositionen", "Preposiciones de doble caso", "Two-way prepositions"),
    u(6, "Umziehen", "Mudarse", "Moving house"),
    u(7, "Gesundheit", "Salud", "Health"),
    u(8, "Müssen, dürfen, sollen", "Verbos modales II", "Modal verbs II"),
    u(9, "Medien", "Medios de comunicación", "Media"),
    u(10, "Komparativ und Superlativ", "Comparativos y superlativos", "Comparatives and superlatives"),
    u(11, "Mode", "Ropa y moda", "Fashion"),
    u(12, "Adjektive I", "Declinación del adjetivo I", "Adjective endings I"),
    u(13, "Reflexive Verben", "Verbos reflexivos", "Reflexive verbs"),
    u(14, "Freundschaft", "La amistad", "Friendship"),
    u(15, "Sätze mit weil", "Oraciones con weil", "Clauses with weil"),
    u(16, "Sätze mit dass", "Oraciones con dass", "Clauses with dass"),
    u(17, "Natur und Umwelt", "Naturaleza y medio ambiente", "Nature and environment"),
    u(18, "Präteritum: war, hatte", "Pretérito de sein y haben", "Past tense of sein and haben"),
    u(19, "E-Mails schreiben", "Escribir correos", "Writing emails"),
    u(20, "Wiederholung A2.1", "Repaso del nivel", "Level review"),
  ],
};

const a2_2: Level = {
  id: "a2-2",
  label: "A2.2",
  name: { es: "Básico II", en: "Elementary II" },
  description: {
    es: "El mundo laboral, trámites, cortesía y planes a futuro.",
    en: "The working world, errands, politeness and future plans.",
  },
  units: [
    u(1, "Arbeitswelt", "El mundo laboral", "The working world"),
    u(2, "Die Bewerbung", "Postularse a un empleo", "Job applications"),
    u(3, "Telefonieren", "Hablar por teléfono", "Phone calls"),
    u(4, "Sätze mit wenn", "Oraciones con wenn", "Clauses with wenn"),
    u(5, "Höflich bitten", "Pedir con cortesía (Konjunktiv II)", "Polite requests (Konjunktiv II)"),
    u(6, "Essen und Kultur", "Comida y cultura", "Food and culture"),
    u(7, "Verben mit Präpositionen", "Verbos con preposición", "Verbs with prepositions"),
    u(8, "Eine Reise planen", "Planear un viaje", "Planning a trip"),
    u(9, "Bank und Post", "Banco y correo", "Bank and post office"),
    u(10, "Indirekte Fragen", "Preguntas indirectas", "Indirect questions"),
    u(11, "Adjektive II", "Declinación del adjetivo II", "Adjective endings II"),
    u(12, "Sport", "Deporte y bienestar", "Sport and wellbeing"),
    u(13, "Als oder wenn?", "Als o wenn", "Als or wenn"),
    u(14, "Feste in Deutschland", "Fiestas en Alemania", "Celebrations in Germany"),
    u(15, "Technik im Alltag", "Tecnología cotidiana", "Everyday technology"),
    u(16, "Der Genitiv", "El genitivo", "The genitive case"),
    u(17, "Sich beschweren", "Quejarse y reclamar", "Making complaints"),
    u(18, "Pläne mit werden", "El futuro con werden", "Future with werden"),
    u(19, "D-A-CH", "Alemania, Austria y Suiza", "Germany, Austria and Switzerland"),
    u(20, "Wiederholung A2.2", "Repaso del nivel", "Level review"),
  ],
};

const b1_1: Level = {
  id: "b1-1",
  label: "B1.1",
  name: { es: "Intermedio I", en: "Intermediate I" },
  description: {
    es: "Opina, narra en pasado y entiende textos reales.",
    en: "Give opinions, narrate in the past and understand real texts.",
  },
  units: [
    u(1, "Beziehungen", "Relaciones personales", "Relationships"),
    u(2, "Das Präteritum", "El pretérito", "The simple past"),
    u(3, "Erinnerungen", "Recuerdos", "Memories"),
    u(4, "Relativsätze", "Oraciones de relativo", "Relative clauses"),
    u(5, "Wohnen in Zukunft", "La vivienda del futuro", "Housing of the future"),
    u(6, "Arbeit und Karriere", "Trabajo y carrera", "Work and career"),
    u(7, "Das Passiv", "La voz pasiva", "The passive voice"),
    u(8, "Nachrichten", "Noticias y medios", "News and media"),
    u(9, "Infinitiv mit zu", "Infinitivo con zu", "Infinitive with zu"),
    u(10, "Meinungen äußern", "Expresar opiniones", "Expressing opinions"),
    u(11, "Deshalb und trotzdem", "Conectores: deshalb, trotzdem", "Connectors: deshalb, trotzdem"),
    u(12, "Nachhaltigkeit", "Sostenibilidad", "Sustainability"),
    u(13, "Ernährung", "Alimentación y salud", "Diet and health"),
    u(14, "Plusquamperfekt", "El pluscuamperfecto", "The past perfect"),
    u(15, "Studieren in Deutschland", "Estudiar en Alemania", "Studying in Germany"),
    u(16, "Wünsche und Träume", "Deseos (Konjunktiv II)", "Wishes (Konjunktiv II)"),
    u(17, "Kunst und Kultur", "Arte y cultura", "Art and culture"),
    u(18, "Formelle E-Mails", "Correos formales", "Formal emails"),
    u(19, "Diskutieren", "Debatir y argumentar", "Discussing and arguing"),
    u(20, "Wiederholung B1.1", "Repaso del nivel", "Level review"),
  ],
};

const b1_2: Level = {
  id: "b1-2",
  label: "B1.2",
  name: { es: "Intermedio II", en: "Intermediate II" },
  description: {
    es: "Argumenta con soltura y prepárate para el examen B1.",
    en: "Argue fluently and get ready for the B1 exam.",
  },
  units: [
    u(1, "Heimat", "Migración y hogar", "Migration and home"),
    u(2, "Passiv im Präteritum", "Pasiva en pasado", "Passive in the past"),
    u(3, "Werbung und Konsum", "Publicidad y consumo", "Advertising and consumption"),
    u(4, "Sowohl … als auch", "Conectores dobles", "Two-part connectors"),
    u(5, "Gesellschaft", "Política y sociedad", "Politics and society"),
    u(6, "Die n-Deklination", "La declinación en -n", "The n-declension"),
    u(7, "Wissenschaft und Technik", "Ciencia y tecnología", "Science and technology"),
    u(8, "Um … zu und damit", "Oraciones finales", "Purpose clauses"),
    u(9, "Präsentieren", "Hacer presentaciones", "Giving presentations"),
    u(10, "Sätze mit obwohl", "Oraciones con obwohl", "Clauses with obwohl"),
    u(11, "Abenteuer", "Viajes y aventuras", "Adventures"),
    u(12, "Verben mit Präpositionen II", "Verbos con preposición II", "Verbs with prepositions II"),
    u(13, "Literatur", "Literatura", "Literature"),
    u(14, "Indirekte Rede", "Estilo indirecto", "Reported speech"),
    u(15, "Ehrenamt", "Voluntariado", "Volunteering"),
    u(16, "Grafiken beschreiben", "Describir gráficas", "Describing charts"),
    u(17, "Konflikte lösen", "Resolver conflictos", "Resolving conflicts"),
    u(18, "Prüfung: Lesen und Hören", "Examen: lectura y escucha", "Exam: reading and listening"),
    u(19, "Prüfung: Schreiben und Sprechen", "Examen: escritura y expresión oral", "Exam: writing and speaking"),
    u(20, "Abschlusstest B1", "Examen final B1", "Final B1 test"),
  ],
};

export const german: Course = {
  lang: "de",
  name: { es: "Alemán", en: "German" },
  nativeName: "Deutsch",
  levels: [a1_1, a1_2, a2_1, a2_2, b1_1, b1_2],
};

export function getLevel(id: string) {
  return german.levels.find((l) => l.id === id) ?? null;
}

export function getUnitMeta(levelId: string, number: number) {
  return getLevel(levelId)?.units.find((u) => u.number === number) ?? null;
}
