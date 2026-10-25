import type { Course, Level, UnitMeta } from "../types";

/**
 * Temario de Alemán · alineado con el MCER y el Goethe-Zertifikat A1 (Start Deutsch 1).
 * A1.1 + A1.2 = nivel A1 completo. Para cambiar un tema, edita aquí.
 */
const u = (number: number, title: string, _sub: string, es: string, en: string): UnitMeta => ({
  number,
  title,
  topic: { es, en },
});

const a1_1: Level = {
  id: "a1-1",
  label: "A1.1",
  name: { de: "Anfänger I", es: "Principiante I", en: "Beginner I" },
  description: {
    de: "Die ersten Wörter: grüßen, sich vorstellen, über Familie, Essen und Alltag sprechen.",
    es: "Las primeras palabras: saludar, presentarse y hablar de familia, comida y vida diaria.",
    en: "Your first words: greeting, introducing yourself and talking about family, food and daily life.",
  },
  units: [
    u(1, "Vorstellung", "Grüßen und sich vorstellen", "Saludar y presentarse", "Greetings and introductions"),
    u(2, "Das Alphabet", "Buchstaben, Laute und Buchstabieren", "Letras, sonidos y deletrear", "Letters, sounds and spelling"),
    u(3, "Woher kommst du?", "Länder, Sprachen und W-Fragen", "Países, idiomas y preguntas con W", "Countries, languages and W-questions"),
    u(4, "Zahlen bis 20", "Zahlen, Telefonnummer und Alter", "Números, teléfono y edad", "Numbers, phone numbers and age"),
    u(5, "Meine Familie", "Familie und das Verb haben", "La familia y el verbo haben", "Family and the verb haben"),
    u(6, "Berufe", "Was sind Sie von Beruf?", "Profesiones", "Jobs"),
    u(7, "Zahlen bis 100", "Große Zahlen, Preise und Adressen", "Números grandes, precios y direcciones", "Big numbers, prices and addresses"),
    u(8, "Der, die, das", "Nomen, Artikel und Gegenstände", "Sustantivos, artículos y objetos", "Nouns, articles and objects"),
    u(9, "Im Kurs", "Gegenstände, Plural und Kursfragen", "Objetos, plural y preguntas en clase", "Objects, plurals and classroom questions"),
    u(10, "Wie spät ist es?", "Die Uhrzeit", "La hora", "Telling the time"),
    u(11, "Tage und Monate", "Wochentage, Monate und Jahreszeiten", "Días, meses y estaciones", "Days, months and seasons"),
    u(12, "Mein Tag", "Tagesablauf und Satzbau", "Rutina diaria y orden de la frase", "Daily routine and word order"),
    u(13, "Hobbys", "Freizeit, gern und Ja/Nein-Fragen", "Tiempo libre, gern y preguntas sí/no", "Free time, gern and yes/no questions"),
    u(14, "Essen und Trinken", "Lebensmittel und der Akkusativ", "Alimentos y el acusativo", "Food and the accusative"),
    u(15, "Im Café", "Bestellen mit möchten", "Pedir con möchten", "Ordering with möchten"),
    u(16, "Einkaufen", "Im Supermarkt: Mengen und Preise", "En el supermercado: cantidades y precios", "At the supermarket: quantities and prices"),
    u(17, "Farben und Kleidung", "Kleidung kaufen und Meinungen", "Comprar ropa y dar opiniones", "Buying clothes and giving opinions"),
    u(18, "Meine Wohnung", "Zimmer, Möbel und es gibt", "Habitaciones, muebles y es gibt", "Rooms, furniture and es gibt"),
    u(19, "Das Wetter", "Wetter und Jahreszeiten", "El clima y las estaciones", "Weather and seasons"),
    u(20, "Wiederholung A1.1", "Alles wiederholen und testen", "Repaso y mini examen", "Review and mini test"),
  ],
};

const a1_2: Level = {
  id: "a1-2",
  label: "A1.2",
  name: { de: "Anfänger II", es: "Principiante II", en: "Beginner II" },
  description: {
    de: "Termine, Stadt, Gesundheit, Reisen und das Perfekt – und dann: fit für die Prüfung Goethe A1.",
    es: "Citas, ciudad, salud, viajes y el Perfekt; al final, listo para el examen Goethe A1.",
    en: "Appointments, the city, health, travel and the perfect tense, then ready for the Goethe A1 exam.",
  },
  units: [
    u(1, "Termine", "Termine machen und Präpositionen der Zeit", "Hacer citas y preposiciones de tiempo", "Making appointments and time prepositions"),
    u(2, "Verabredungen", "Vorschläge machen, zusagen, absagen", "Proponer, aceptar y rechazar planes", "Making, accepting and declining plans"),
    u(3, "Können und wollen", "Die Modalverben und die Satzklammer", "Los verbos modales", "Modal verbs"),
    u(4, "Im Restaurant", "Bestellen, bezahlen, reklamieren", "Pedir, pagar y reclamar", "Ordering, paying and complaining"),
    u(5, "Der Körper", "Körperteile und Mir tut … weh", "El cuerpo y Mir tut … weh", "Body parts and what hurts"),
    u(6, "Beim Arzt", "Beim Arzt und der Imperativ mit Sie", "En el médico e imperativo con Sie", "At the doctor's and the Sie imperative"),
    u(7, "In der Stadt", "Orte in der Stadt und der Dativ", "Lugares de la ciudad y el dativo", "Places in town and the dative"),
    u(8, "Wie komme ich …?", "Nach dem Weg fragen", "Pedir y dar direcciones", "Asking for directions"),
    u(9, "Unterwegs", "Verkehrsmittel und Fahrkarten", "Medios de transporte y billetes", "Transport and tickets"),
    u(10, "Trennbare Verben", "Der Alltag mit trennbaren Verben", "La rutina con verbos separables", "Daily life with separable verbs"),
    u(11, "Mein, dein, sein", "Die Possessivartikel", "Los posesivos", "Possessive articles"),
    u(12, "Arbeit und Alltag", "Am Arbeitsplatz und Personalpronomen", "En el trabajo y pronombres", "At work and personal pronouns"),
    u(13, "Feste feiern", "Feste, Datum und Einladungen", "Fiestas, fechas e invitaciones", "Celebrations, dates and invitations"),
    u(14, "Was hast du gemacht?", "Das Perfekt mit haben", "El Perfekt con haben", "The perfect tense with haben"),
    u(15, "Am Wochenende", "Das Perfekt mit sein", "El Perfekt con sein", "The perfect tense with sein"),
    u(16, "Urlaub", "Reisen und vom Urlaub erzählen", "Viajar y contar las vacaciones", "Travel and holiday stories"),
    u(17, "Im Hotel", "Ein Zimmer reservieren", "Reservar una habitación", "Booking a room"),
    u(18, "Bitte, mach das!", "Der Imperativ: du, ihr, Sie", "El imperativo: du, ihr, Sie", "The imperative: du, ihr, Sie"),
    u(19, "Prüfung A1: Hören und Lesen", "Prüfungstraining Goethe-Zertifikat A1", "Entrenamiento examen: escucha y lectura", "Exam training: listening and reading"),
    u(20, "Prüfung A1: Schreiben und Sprechen", "Prüfungstraining Goethe-Zertifikat A1", "Entrenamiento examen: escritura y oral", "Exam training: writing and speaking"),
  ],
};

const a2_1: Level = {
  id: "a2-1",
  label: "A2.1",
  name: { de: "Grundstufe I", es: "Básico I", en: "Elementary I" },
  description: {
    de: "Erzähl deine Geschichte, sprich über Gesundheit und Wohnen und verbinde Ideen.",
    es: "Cuenta tu historia, habla de salud y vivienda, y conecta ideas.",
    en: "Tell your story, talk about health and housing, and connect ideas.",
  },
  units: [
    u(1, "Mein Lebenslauf", "Über das eigene Leben erzählen", "Mi historia personal", "My life story"),
    u(2, "Schule und Ausbildung", "Schule, Studium, Ausbildung", "Educación y formación", "School and training"),
    u(3, "Der Dativ", "Dativ: Artikel und Pronomen", "El dativo", "The dative case"),
    u(4, "Wechselpräpositionen", "Wo? Wohin? Präpositionen", "Preposiciones de doble caso", "Two-way prepositions"),
    u(5, "Umziehen", "Eine neue Wohnung finden", "Mudarse", "Moving house"),
    u(6, "Gesundheit", "Gesund leben", "Salud", "Health"),
    u(7, "Müssen, dürfen, sollen", "Pflichten und Regeln", "Verbos modales II", "Modal verbs II"),
    u(8, "Medien", "Handy, Internet, Fernsehen", "Medios de comunicación", "Media"),
    u(9, "Besser, am besten", "Komparativ und Superlativ", "Comparativos y superlativos", "Comparatives and superlatives"),
    u(10, "Mode", "Kleidung und Geschmack", "Ropa y moda", "Fashion"),
    u(11, "Adjektive I", "Adjektivendungen I", "Declinación del adjetivo I", "Adjective endings I"),
    u(12, "Reflexive Verben", "sich freuen, sich treffen", "Verbos reflexivos", "Reflexive verbs"),
    u(13, "Freundschaft", "Freunde und Beziehungen", "La amistad", "Friendship"),
    u(14, "Weil …", "Gründe nennen mit weil", "Oraciones con weil", "Clauses with weil"),
    u(15, "Dass …", "Meinungen mit dass", "Oraciones con dass", "Clauses with dass"),
    u(16, "Natur und Umwelt", "Natur, Tiere, Umwelt", "Naturaleza y medio ambiente", "Nature and environment"),
    u(17, "War und hatte", "Präteritum von sein und haben", "Pretérito de sein y haben", "Past of sein and haben"),
    u(18, "E-Mails schreiben", "Persönliche und formelle E-Mails", "Escribir correos", "Writing emails"),
    u(19, "Wenn …", "Bedingungen mit wenn", "Oraciones con wenn", "Clauses with wenn"),
    u(20, "Wiederholung A2.1", "Alles wiederholen", "Repaso del nivel", "Level review"),
  ],
};

const a2_2: Level = {
  id: "a2-2",
  label: "A2.2",
  name: { de: "Grundstufe II", es: "Básico II", en: "Elementary II" },
  description: {
    de: "Arbeitswelt, Behörden, Höflichkeit und Pläne für die Zukunft.",
    es: "El mundo laboral, trámites, cortesía y planes a futuro.",
    en: "The working world, errands, politeness and future plans.",
  },
  units: [
    u(1, "Arbeitswelt", "Berufe und Arbeitsplatz", "El mundo laboral", "The working world"),
    u(2, "Die Bewerbung", "Sich bewerben", "Postularse a un empleo", "Job applications"),
    u(3, "Telefonieren", "Am Telefon", "Hablar por teléfono", "Phone calls"),
    u(4, "Könnten Sie …?", "Höflich bitten mit Konjunktiv II", "Pedir con cortesía", "Polite requests"),
    u(5, "Essen und Kultur", "Essgewohnheiten", "Comida y cultura", "Food and culture"),
    u(6, "Verben mit Präpositionen", "warten auf, denken an", "Verbos con preposición", "Verbs with prepositions"),
    u(7, "Eine Reise planen", "Reiseplanung", "Planear un viaje", "Planning a trip"),
    u(8, "Bank und Post", "Dienstleistungen", "Banco y correo", "Bank and post office"),
    u(9, "Indirekte Fragen", "Wissen Sie, wo …?", "Preguntas indirectas", "Indirect questions"),
    u(10, "Adjektive II", "Adjektivendungen II", "Declinación del adjetivo II", "Adjective endings II"),
    u(11, "Sport", "Sport und Fitness", "Deporte y bienestar", "Sport and wellbeing"),
    u(12, "Als oder wenn?", "Vergangenheit mit als und wenn", "Als o wenn", "Als or wenn"),
    u(13, "Feste in D-A-CH", "Traditionen und Bräuche", "Fiestas en Alemania, Austria y Suiza", "Celebrations in D-A-CH"),
    u(14, "Technik im Alltag", "Geräte und Probleme", "Tecnología cotidiana", "Everyday technology"),
    u(15, "Der Genitiv", "Der Genitiv", "El genitivo", "The genitive case"),
    u(16, "Sich beschweren", "Reklamieren und beschweren", "Quejarse y reclamar", "Making complaints"),
    u(17, "Pläne mit werden", "Die Zukunft", "El futuro con werden", "Future with werden"),
    u(18, "Behörden", "Formulare und Ämter", "Trámites", "Official errands"),
    u(19, "Prüfung A2", "Prüfungstraining Goethe A2", "Entrenamiento examen A2", "A2 exam training"),
    u(20, "Wiederholung A2.2", "Alles wiederholen", "Repaso del nivel", "Level review"),
  ],
};

const b1_1: Level = {
  id: "b1-1",
  label: "B1.1",
  name: { de: "Mittelstufe I", es: "Intermedio I", en: "Intermediate I" },
  description: {
    de: "Meinungen äußern, in der Vergangenheit erzählen und echte Texte verstehen.",
    es: "Opina, narra en pasado y entiende textos reales.",
    en: "Give opinions, narrate in the past and understand real texts.",
  },
  units: [
    u(1, "Beziehungen", "Menschen und Beziehungen", "Relaciones personales", "Relationships"),
    u(2, "Das Präteritum", "Erzählen im Präteritum", "El pretérito", "The simple past"),
    u(3, "Erinnerungen", "Kindheit und Erinnerungen", "Recuerdos", "Memories"),
    u(4, "Relativsätze", "Der Mann, der …", "Oraciones de relativo", "Relative clauses"),
    u(5, "Wohnen in Zukunft", "Wohnformen", "La vivienda del futuro", "Housing of the future"),
    u(6, "Arbeit und Karriere", "Beruf und Karriere", "Trabajo y carrera", "Work and career"),
    u(7, "Das Passiv", "Passiv Präsens", "La voz pasiva", "The passive voice"),
    u(8, "Nachrichten", "Medien und Nachrichten", "Noticias y medios", "News and media"),
    u(9, "Infinitiv mit zu", "Es ist wichtig, … zu …", "Infinitivo con zu", "Infinitive with zu"),
    u(10, "Meinungen äußern", "Ich finde, dass …", "Expresar opiniones", "Expressing opinions"),
    u(11, "Deshalb und trotzdem", "Konnektoren", "Conectores", "Connectors"),
    u(12, "Nachhaltigkeit", "Umwelt und Konsum", "Sostenibilidad", "Sustainability"),
    u(13, "Ernährung", "Essen und Gesundheit", "Alimentación y salud", "Diet and health"),
    u(14, "Plusquamperfekt", "Vorvergangenheit", "El pluscuamperfecto", "The past perfect"),
    u(15, "Studieren in Deutschland", "Uni und Studium", "Estudiar en Alemania", "Studying in Germany"),
    u(16, "Wünsche und Träume", "Konjunktiv II", "Deseos (Konjunktiv II)", "Wishes (Konjunktiv II)"),
    u(17, "Kunst und Kultur", "Museum, Musik, Theater", "Arte y cultura", "Art and culture"),
    u(18, "Formelle E-Mails", "Formell schreiben", "Correos formales", "Formal emails"),
    u(19, "Diskutieren", "Argumentieren", "Debatir y argumentar", "Discussing and arguing"),
    u(20, "Wiederholung B1.1", "Alles wiederholen", "Repaso del nivel", "Level review"),
  ],
};

const b1_2: Level = {
  id: "b1-2",
  label: "B1.2",
  name: { de: "Mittelstufe II", es: "Intermedio II", en: "Intermediate II" },
  description: {
    de: "Flüssig argumentieren und sich auf die Prüfung B1 vorbereiten.",
    es: "Argumenta con soltura y prepárate para el examen B1.",
    en: "Argue fluently and get ready for the B1 exam.",
  },
  units: [
    u(1, "Heimat", "Migration und Heimat", "Migración y hogar", "Migration and home"),
    u(2, "Passiv Präteritum", "Passiv in der Vergangenheit", "Pasiva en pasado", "Passive in the past"),
    u(3, "Werbung und Konsum", "Werbung verstehen", "Publicidad y consumo", "Advertising and consumption"),
    u(4, "Sowohl … als auch", "Zweiteilige Konnektoren", "Conectores dobles", "Two-part connectors"),
    u(5, "Gesellschaft", "Politik und Gesellschaft", "Política y sociedad", "Politics and society"),
    u(6, "n-Deklination", "der Kollege, den Kollegen", "La declinación en -n", "The n-declension"),
    u(7, "Wissenschaft und Technik", "Erfindungen", "Ciencia y tecnología", "Science and technology"),
    u(8, "Um … zu, damit", "Finalsätze", "Oraciones finales", "Purpose clauses"),
    u(9, "Präsentieren", "Eine Präsentation halten", "Hacer presentaciones", "Giving presentations"),
    u(10, "Obwohl …", "Konzessive Sätze", "Oraciones con obwohl", "Clauses with obwohl"),
    u(11, "Abenteuer", "Reisen und Abenteuer", "Viajes y aventuras", "Adventures"),
    u(12, "Präpositionalverben II", "sich interessieren für …", "Verbos con preposición II", "Verbs with prepositions II"),
    u(13, "Literatur", "Lesen und Literatur", "Literatura", "Literature"),
    u(14, "Indirekte Rede", "Er sagt, dass …", "Estilo indirecto", "Reported speech"),
    u(15, "Ehrenamt", "Sich engagieren", "Voluntariado", "Volunteering"),
    u(16, "Grafiken beschreiben", "Statistiken beschreiben", "Describir gráficas", "Describing charts"),
    u(17, "Konflikte lösen", "Streiten und sich einigen", "Resolver conflictos", "Resolving conflicts"),
    u(18, "Prüfung B1: Lesen und Hören", "Prüfungstraining", "Examen: lectura y escucha", "Exam: reading and listening"),
    u(19, "Prüfung B1: Schreiben und Sprechen", "Prüfungstraining", "Examen: escritura y oral", "Exam: writing and speaking"),
    u(20, "Abschlusstest B1", "Der große Test", "Examen final B1", "Final B1 test"),
  ],
};

export const german: Course = {
  lang: "de",
  name: { de: "Deutsch", es: "Alemán", en: "German" },
  levels: [a1_1, a1_2, a2_1, a2_2, b1_1, b1_2],
};

export function getLevel(id: string) {
  return german.levels.find((l) => l.id === id) ?? null;
}

export function getUnitMeta(levelId: string, number: number) {
  return getLevel(levelId)?.units.find((x) => x.number === number) ?? null;
}
