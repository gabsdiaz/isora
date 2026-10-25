import type { Tr, Voice } from "../types";

/**
 * Exámenes de Isora:
 *  - Einstufungstest (test de nivel): gramática, lectura, comprensión auditiva y escritura (A1.1 → B1.2)
 *  - Zugangstest (mini prueba para abrir un nivel): 8 preguntas del nivel anterior
 *  - Abschlusstest A1.1 (examen final del módulo)
 * Cada pregunta lleva el nivel al que pertenece, para calcular el nivel del estudiante.
 */
export type LevelTag = "a1-1" | "a1-2" | "a2-1" | "a2-2" | "b1-1" | "b1-2";
export const LEVEL_ORDER: LevelTag[] = ["a1-1", "a1-2", "a2-1", "a2-2", "b1-1", "b1-2"];
export const levelLabel = (l: string) => l.toUpperCase().replace("-", ".");

export type MCQuestion = { id: string; q: string; options: string[]; answer: number; level: LevelTag };
export type ReadingBlock = { id: string; title: string; text: string[]; questions: MCQuestion[] };
export type ListeningBlock = { id: string; audio: string; voice: Voice; questions: MCQuestion[] };
export type WritingTask = {
  id: string;
  prompt: string;
  promptTr: Tr;
  hints: string[];
  minWords: number;
  /** Puntos de control (expresiones regulares) para dar retroalimentación al estudiante */
  checks?: { label: string; pattern: string }[];
  model: string;
};

export type ExamSection =
  | { kind: "grammar"; title: string; questions: MCQuestion[]; /** preguntas al azar (mini prueba) */ sample?: number }
  | { kind: "reading"; title: string; blocks: ReadingBlock[] }
  | { kind: "listening"; title: string; blocks: ListeningBlock[] }
  | { kind: "writing"; title: string; task: WritingTask };

export type Exam = {
  id: string;
  title: string;
  titleTr: Tr;
  emoji: string;
  intro: Tr;
  minutes: number;
  sections: ExamSection[];
  /** Porcentaje mínimo para aprobar (no aplica al test de nivel) */
  pass?: number;
  allowDontKnow?: boolean;
};

let n = 0;
const mc = (level: LevelTag, q: string, options: string[], answer: number): MCQuestion => ({ id: `q${++n}`, q, options, answer, level });

/* ───────────── Banco de gramática y vocabulario por nivel ───────────── */

export const BANK: Record<LevelTag, MCQuestion[]> = {
  "a1-1": [
    mc("a1-1", "Ich ___ aus Kolumbien.", ["komme", "kommst", "kommt"], 0),
    mc("a1-1", "Wie ___ du?", ["heiße", "heißt", "heißen"], 1),
    mc("a1-1", "Das ist ___ Lampe.", ["der", "die", "das"], 1),
    mc("a1-1", "Ich habe ___ Bruder.", ["ein", "eine", "einen"], 2),
    mc("a1-1", "Wir ___ in Berlin.", ["wohnt", "wohnen", "wohne"], 1),
    mc("a1-1", "Welcher Satz ist richtig?", ["Am Abend ich lese ein Buch.", "Am Abend lese ich ein Buch.", "Lese am Abend ich ein Buch."], 1),
    mc("a1-1", "Es ist halb acht. Wie spät ist es?", ["7:30 Uhr", "8:30 Uhr", "8:00 Uhr"], 0),
    mc("a1-1", "Du ___ gern Pizza.", ["isst", "esst", "esse"], 0),
    mc("a1-1", "Ich trinke ___ Kaffee. Ich trinke Tee.", ["kein", "keinen", "keine"], 1),
    mc("a1-1", "Der Rock ist schön. Ich finde ___ toll.", ["er", "ihn", "es"], 1),
    mc("a1-1", "Wann hast du Geburtstag? – ___ Mai.", ["Am", "Im", "Um"], 1),
    mc("a1-1", "Was ___ Sie von Beruf?", ["ist", "sind", "bist"], 1),
  ],
  "a1-2": [
    mc("a1-2", "Gestern ___ ich ins Kino gegangen.", ["habe", "bin", "war"], 1),
    mc("a1-2", "Du ___ hier nicht rauchen. Das ist verboten.", ["darfst", "willst", "magst"], 0),
    mc("a1-2", "Ich gebe ___ Mann das Buch.", ["der", "dem", "den"], 1),
    mc("a1-2", "Welcher Satz ist richtig?", ["Der Zug fährt um 8 Uhr ab.", "Der Zug abfährt um 8 Uhr.", "Der Zug fährt ab um 8 Uhr."], 0),
    mc("a1-2", "Wir haben gestern Pizza ___.", ["gegessen", "geesst", "essen"], 0),
    mc("a1-2", "Ich wohne noch ___ meinen Eltern.", ["mit", "bei", "zu"], 1),
    mc("a1-2", "Entschuldigung, wie komme ich ___ Bahnhof?", ["zum", "zur", "zu die"], 0),
    mc("a1-2", "Ich fahre ___ Bus zur Arbeit.", ["mit dem", "mit den", "mit die"], 0),
    mc("a1-2", "Er hat mir ein Geschenk ___.", ["gegeben", "gibt", "gegebt"], 0),
    mc("a1-2", "___ Sie bitte das Fenster!", ["Öffnen", "Öffnet", "Öffnest"], 0),
  ],
  "a2-1": [
    mc("a2-1", "Ich lerne Deutsch, ___ ich in Deutschland studieren möchte.", ["weil", "denn", "deshalb"], 0),
    mc("a2-1", "Ich glaube, ___.", ["dass er morgen kommt", "dass er kommt morgen", "dass kommt er morgen"], 0),
    mc("a2-1", "Früher ___ ich in Cali.", ["wohnte", "wohnen", "gewohnt"], 0),
    mc("a2-1", "Berlin ist ___ als München.", ["größer", "großer", "am größten"], 0),
    mc("a2-1", "Ich interessiere ___ sehr für Musik.", ["mich", "mir", "sich"], 0),
    mc("a2-1", "Gestern ___ ich leider keine Zeit.", ["hatte", "habe", "hätte"], 0),
    mc("a2-1", "Das Kleid gefällt ___ sehr gut.", ["mich", "mir", "ich"], 1),
    mc("a2-1", "___ es morgen regnet, bleiben wir zu Hause.", ["Wenn", "Wann", "Als"], 0),
  ],
  "a2-2": [
    mc("a2-2", "Das ist der Mann, ___ neben mir wohnt.", ["der", "den", "dem"], 0),
    mc("a2-2", "Ich kaufe einen ___ Pullover.", ["roten", "rote", "roter"], 0),
    mc("a2-2", "___ ich ein Kind war, wohnte ich auf dem Land.", ["Als", "Wenn", "Wann"], 0),
    mc("a2-2", "Kannst du mir sagen, wo ___?", ["der Bahnhof ist", "ist der Bahnhof", "der Bahnhof"], 0),
    mc("a2-2", "Das Haus ___ gerade renoviert.", ["wird", "ist", "hat"], 0),
    mc("a2-2", "Ich ___ gern mehr Zeit für meine Hobbys.", ["hätte", "habe", "würde"], 0),
    mc("a2-2", "Das ist die Frau, ___ ich gestern geholfen habe.", ["der", "die", "den"], 0),
    mc("a2-2", "Wegen ___ Regens bleiben wir zu Hause.", ["des", "dem", "den"], 0),
  ],
  "b1-1": [
    mc("b1-1", "___ es regnete, gingen wir spazieren.", ["Obwohl", "Weil", "Damit"], 0),
    mc("b1-1", "Ich spare Geld, ___ mir ein Auto zu kaufen.", ["um", "damit", "für"], 0),
    mc("b1-1", "Nachdem er gegessen ___, ging er schlafen.", ["hatte", "hat", "war"], 0),
    mc("b1-1", "Wenn ich mehr Zeit ___, würde ich mehr reisen.", ["hätte", "habe", "hatte"], 0),
    mc("b1-1", "Das Museum ___ im Jahr 1890 gebaut.", ["wurde", "wird", "worden"], 0),
    mc("b1-1", "Ich habe lange mit dem ___ gesprochen.", ["Nachbarn", "Nachbar", "Nachbars"], 0),
    mc("b1-1", "Er ___ gestern einen langen Brief.", ["schrieb", "schreibte", "geschrieben"], 0),
    mc("b1-1", "Ich freue mich schon ___ die Ferien.", ["auf", "über", "an"], 0),
  ],
  "b1-2": [
    mc("b1-2", "Je mehr ich übe, ___ besser spreche ich.", ["desto", "als", "so"], 0),
    mc("b1-2", "Er spricht ___ Englisch ___ Französisch.", ["sowohl … als auch", "weder … oder", "entweder … und"], 0),
    mc("b1-2", "Die Aufgabe muss bis morgen ___ werden.", ["erledigt", "erledigen", "erledigte"], 0),
    mc("b1-2", "Wenn ich das gewusst ___, wäre ich früher gekommen.", ["hätte", "habe", "wäre"], 0),
    mc("b1-2", "Das ___ Kind spielt im Garten.", ["lachende", "gelachte", "lachen"], 0),
    mc("b1-2", "Sie sagte, sie ___ krank.", ["sei", "seid", "wäre gewesen"], 0),
    mc("b1-2", "___ des schlechten Wetters haben wir einen Ausflug gemacht.", ["Trotz", "Wegen", "Statt"], 0),
    mc("b1-2", "Es lohnt sich, früh ___.", ["aufzustehen", "aufstehen", "zu aufstehen"], 0),
  ],
};

/* ───────────── Einstufungstest ───────────── */

const placementGrammar = LEVEL_ORDER.flatMap((l) => BANK[l].slice(0, 3));

export const PLACEMENT: Exam = {
  id: "einstufung",
  title: "Einstufungstest",
  titleTr: { es: "Test de nivel", en: "Placement test" },
  emoji: "🎯",
  minutes: 20,
  allowDontKnow: true,
  intro: {
    es: "Grammatik, Lesen, Hören y un poco de Schreiben. Si no sabes una respuesta, toca «Weiß ich nicht»: así el resultado es más exacto.",
    en: "Grammar, reading, listening and a little writing. If you don't know an answer, tap “Weiß ich nicht” – that makes the result more accurate.",
  },
  sections: [
    { kind: "grammar", title: "Grammatik & Wortschatz", questions: placementGrammar },
    {
      kind: "reading",
      title: "Lesen",
      blocks: [
        {
          id: "r1",
          title: "Hallo, ich bin Mara!",
          text: [
            "Hallo! Ich heiße Mara und komme aus Brasilien. Ich wohne seit einem Jahr in Leipzig.",
            "Ich arbeite als Krankenschwester in einem großen Krankenhaus. Am Wochenende spiele ich Volleyball oder ich gehe mit meiner Freundin ins Café.",
            "Mein Deutsch ist noch nicht perfekt, aber ich lerne jeden Tag.",
          ],
          questions: [
            mc("a1-1", "Woher kommt Mara?", ["aus Brasilien", "aus Leipzig", "aus Spanien"], 0),
            mc("a1-1", "Was ist Mara von Beruf?", ["Lehrerin", "Krankenschwester", "Kellnerin"], 1),
            mc("a1-2", "Was macht Mara am Wochenende?", ["Sie arbeitet im Krankenhaus.", "Sie spielt Volleyball.", "Sie lernt nur Deutsch."], 1),
          ],
        },
        {
          id: "r2",
          title: "Eine E-Mail von Tobias",
          text: [
            "Liebe Jana, wie geht es dir? Ich bin letzte Woche umgezogen!",
            "Meine neue Wohnung ist kleiner als die alte, aber sie hat einen Balkon und liegt direkt im Zentrum.",
            "Leider war der Umzug sehr anstrengend, weil der Aufzug kaputt war und wir alles in den vierten Stock tragen mussten.",
            "Am Samstag mache ich eine kleine Party. Hast du Lust zu kommen? Bring gern etwas zu trinken mit! Liebe Grüße, Tobias",
          ],
          questions: [
            mc("a2-1", "Wie ist die neue Wohnung?", ["größer als die alte", "kleiner, aber mit Balkon", "im Zentrum, aber ohne Balkon"], 1),
            mc("a2-1", "Warum war der Umzug anstrengend?", ["Der Aufzug funktionierte nicht.", "Es hat die ganze Zeit geregnet.", "Tobias war krank."], 0),
            mc("a2-2", "Was soll Jana zur Party mitbringen?", ["etwas zu essen", "etwas zu trinken", "Möbel für die Wohnung"], 1),
          ],
        },
        {
          id: "r3",
          title: "Arbeiten im Homeoffice",
          text: [
            "Immer mehr Menschen in Deutschland arbeiten im Homeoffice. Viele schätzen die Flexibilität: Sie sparen den Weg zur Arbeit und können ihre Zeit besser einteilen.",
            "Allerdings berichten manche Beschäftigte auch von Nachteilen. Ohne den direkten Kontakt zu Kolleginnen und Kollegen fühlen sie sich manchmal isoliert, und die Grenze zwischen Arbeit und Freizeit verschwimmt.",
            "Experten empfehlen deshalb, feste Arbeitszeiten einzuhalten und regelmäßig Pausen zu machen.",
          ],
          questions: [
            mc("b1-1", "Welchen Vorteil nennt der Text?", ["Man hat mehr Kontakt zu Kollegen.", "Man spart den Weg zur Arbeit.", "Man verdient mehr Geld."], 1),
            mc("b1-1", "Welches Problem wird genannt?", ["Arbeit und Freizeit lassen sich schwer trennen.", "Das Internet ist oft zu langsam.", "Die Wohnungen sind zu klein."], 0),
            mc("b1-2", "Was empfehlen Experten?", ["mehr Überstunden zu machen", "feste Arbeitszeiten einzuhalten", "wieder jeden Tag ins Büro zu gehen"], 1),
          ],
        },
      ],
    },
    {
      kind: "listening",
      title: "Hören",
      blocks: [
        {
          id: "h1",
          audio: "Guten Tag! Ich möchte bitte einen Kaffee und ein Stück Apfelkuchen.",
          voice: "f",
          questions: [
            mc("a1-1", "Was bestellt die Frau?", ["einen Tee und Kuchen", "einen Kaffee und Apfelkuchen", "einen Kaffee und ein Brötchen"], 1),
            mc("a1-1", "Wo ist die Frau wahrscheinlich?", ["im Café", "im Supermarkt", "in der Schule"], 0),
          ],
        },
        {
          id: "h2",
          audio: "Achtung, eine Durchsage: Der Regionalexpress nach Hamburg, planmäßige Abfahrt vierzehn Uhr zweiunddreißig, fährt heute von Gleis sieben statt von Gleis fünf. Wir bitten um Entschuldigung.",
          voice: "m",
          questions: [
            mc("a1-2", "Wohin fährt der Zug?", ["nach Hamburg", "nach Hannover", "nach Bremen"], 0),
            mc("a2-1", "Von welchem Gleis fährt der Zug heute?", ["von Gleis 5", "von Gleis 7", "von Gleis 14"], 1),
          ],
        },
        {
          id: "h3",
          audio:
            "Hallo Paul, hier ist Sabine. Ich wollte dir nur sagen, dass ich unser Treffen morgen leider absagen muss. Mein Chef hat kurzfristig eine wichtige Besprechung angesetzt. Könnten wir uns stattdessen am Donnerstagabend sehen? Ruf mich einfach zurück, wenn es dir passt.",
          voice: "f",
          questions: [
            mc("a2-2", "Warum sagt Sabine das Treffen ab?", ["Sie ist krank.", "Sie hat eine Besprechung.", "Sie hat keine Lust."], 1),
            mc("b1-1", "Was schlägt Sabine vor?", ["sich am Donnerstagabend zu treffen", "am Freitag zu telefonieren", "das Treffen ganz abzusagen"], 0),
          ],
        },
      ],
    },
    {
      kind: "writing",
      title: "Schreiben",
      task: {
        id: "w-einstufung",
        prompt: "Was hast du am letzten Wochenende gemacht? Schreib 40–80 Wörter.",
        promptTr: { es: "¿Qué hiciste el fin de semana pasado? Escribe entre 40 y 80 palabras.", en: "What did you do last weekend? Write 40–80 words." },
        hints: ["Wo warst du?", "Mit wem?", "Was hast du gemacht?", "Wie war es? Warum?"],
        minWords: 25,
        model:
          "Am Samstag habe ich lange geschlafen. Danach bin ich mit meiner Schwester in die Stadt gefahren, weil wir neue Schuhe kaufen wollten. Am Abend haben wir Freunde getroffen und zusammen gekocht. Am Sonntag war das Wetter schön, deshalb sind wir im Park spazieren gegangen. Es war ein sehr entspanntes Wochenende.",
      },
    },
  ],
};

/* ───────────── Abschlusstest A1.1 ───────────── */

export const FINAL_A1_1: Exam = {
  id: "abschluss-a1-1",
  title: "Abschlusstest A1.1",
  titleTr: { es: "Examen final A1.1", en: "A1.1 final exam" },
  emoji: "🏆",
  minutes: 20,
  pass: 60,
  intro: {
    es: "El examen final del A1.1 con todos los temas del módulo: gramática y vocabulario, lectura, comprensión auditiva y una pequeña presentación escrita. Necesitas 60 % para aprobar y abrir el A1.2.",
    en: "The A1.1 final exam with every topic of the module: grammar and vocabulary, reading, listening and a short written introduction. You need 60% to pass and unlock A1.2.",
  },
  sections: [
    { kind: "grammar", title: "Grammatik & Wortschatz", questions: BANK["a1-1"] },
    {
      kind: "reading",
      title: "Lesen",
      blocks: [
        {
          id: "fr1",
          title: "Sprachschule Sonnenberg – Kursplan",
          text: [
            "Montag und Mittwoch: Deutsch A1, 9:00 bis 12:00 Uhr, Raum 3.",
            "Dienstag und Donnerstag: Deutsch A2, 18:00 bis 20:30 Uhr, Raum 5.",
            "Freitag: Konversation, 16:00 Uhr, im Café im Erdgeschoss.",
            "Anmeldung: Frau Wagner, Telefon 0761 34 56 78.",
          ],
          questions: [
            mc("a1-1", "Wann ist der A1-Kurs?", ["am Montag und Mittwoch", "am Dienstag und Donnerstag", "am Freitag"], 0),
            mc("a1-1", "Wo ist die Konversation?", ["in Raum 3", "im Café", "in Raum 5"], 1),
            mc("a1-1", "Wer macht die Anmeldung?", ["Frau Wagner", "Herr Sonnenberg", "die Lehrerin"], 0),
          ],
        },
        {
          id: "fr2",
          title: "Eine Nachricht von Elena",
          text: [
            "Hallo Lukas, ich bin jetzt in Wien! Meine Wohnung ist klein, aber hell.",
            "Ich habe zwei Zimmer, eine Küche und ein Bad. Leider gibt es keinen Balkon.",
            "Morgen beginnt mein Deutschkurs um neun Uhr. Am Samstag möchte ich ins Museum gehen. Kommst du mit? Viele Grüße, Elena",
          ],
          questions: [
            mc("a1-1", "Wo ist Elena jetzt?", ["in Wien", "in Berlin", "in Zürich"], 0),
            mc("a1-1", "Was hat die Wohnung nicht?", ["eine Küche", "einen Balkon", "ein Bad"], 1),
            mc("a1-1", "Was möchte Elena am Samstag machen?", ["arbeiten", "ins Museum gehen", "kochen"], 1),
          ],
        },
      ],
    },
    {
      kind: "listening",
      title: "Hören",
      blocks: [
        {
          id: "fh1",
          audio: "Hallo, ich bin Nina. Ich bin zweiundzwanzig Jahre alt und komme aus Österreich.",
          voice: "f",
          questions: [
            mc("a1-1", "Wie alt ist Nina?", ["12", "22", "32"], 1),
            mc("a1-1", "Woher kommt Nina?", ["aus Deutschland", "aus Österreich", "aus der Schweiz"], 1),
          ],
        },
        {
          id: "fh2",
          audio: "Das macht zusammen sieben Euro achtzig, bitte.",
          voice: "m",
          questions: [mc("a1-1", "Wie viel kostet es?", ["7,80 €", "8,70 €", "17,80 €"], 0)],
        },
        {
          id: "fh3",
          audio: "Der Deutschkurs beginnt heute nicht um neun Uhr, sondern um halb elf. Bitte kommen Sie in Raum zwölf.",
          voice: "f",
          questions: [
            mc("a1-1", "Wann beginnt der Kurs heute?", ["um 9:00 Uhr", "um 10:30 Uhr", "um 11:30 Uhr"], 1),
            mc("a1-1", "In welchen Raum kommen die Teilnehmer?", ["Raum 2", "Raum 12", "Raum 20"], 1),
          ],
        },
      ],
    },
    {
      kind: "writing",
      title: "Schreiben",
      task: {
        id: "w-a1-1",
        prompt: "Stell dich deiner neuen Kursgruppe vor: Name, Herkunft, Wohnort, Sprachen, Beruf oder Studium, Hobbys. Mindestens 30 Wörter.",
        promptTr: {
          es: "Preséntate a tu nuevo grupo del curso: nombre, de dónde eres, dónde vives, idiomas, profesión o estudios, pasatiempos. Mínimo 30 palabras.",
          en: "Introduce yourself to your new class: name, origin, where you live, languages, job or studies, hobbies. At least 30 words.",
        },
        hints: ["Ich heiße …", "Ich komme aus …", "Ich wohne in …", "Ich spreche …", "Ich bin … / Ich studiere …", "Ich … gern."],
        minWords: 30,
        checks: [
          { label: "Name (Ich heiße … / Ich bin …)", pattern: "\\b(hei(ß|ss)e|mein name ist|ich bin [A-ZÄÖÜ])" },
          { label: "Herkunft (Ich komme aus …)", pattern: "\\bkomme aus\\b" },
          { label: "Wohnort (Ich wohne in …)", pattern: "\\bwohne in\\b" },
          { label: "Sprachen (Ich spreche …)", pattern: "\\bspreche\\b" },
          { label: "Beruf / Studium", pattern: "\\b(von beruf|arbeite|studiere|student|studentin|bin (lehrer|ingenieur|arzt|koch|kellner))" },
          { label: "Hobbys (… gern / Hobby)", pattern: "\\b(gern|hobby|hobbys)\\b" },
        ],
        model:
          "Hallo! Ich heiße Laura und ich komme aus Kolumbien. Ich wohne jetzt in Bogotá. Ich spreche Spanisch, Englisch und ein bisschen Deutsch. Ich bin Studentin und studiere Mathematik. In der Freizeit lese ich gern und ich spiele gern Volleyball. Bis bald!",
      },
    },
  ],
};

/* ───────────── Mini prueba para abrir un nivel ───────────── */

export function gateExam(level: LevelTag): Exam | null {
  const i = LEVEL_ORDER.indexOf(level);
  if (i <= 0) return null;
  const prev = LEVEL_ORDER[i - 1];
  return {
    id: `zugang-${level}`,
    title: `Mini-Test: ${levelLabel(level)} freischalten`,
    titleTr: { es: `Mini prueba para abrir ${levelLabel(level)}`, en: `Mini test to unlock ${levelLabel(level)}` },
    emoji: "🔓",
    minutes: 4,
    pass: 75,
    intro: {
      es: `8 preguntas sobre el nivel ${levelLabel(prev)}. Con 6 respuestas correctas abres ${levelLabel(level)}.`,
      en: `8 questions about level ${levelLabel(prev)}. Get 6 right to unlock ${levelLabel(level)}.`,
    },
    sections: [{ kind: "grammar", title: `Grammatik ${levelLabel(prev)}`, questions: BANK[prev], sample: 8 }],
  };
}

export const EXAMS: Record<string, Exam> = { [PLACEMENT.id]: PLACEMENT, [FINAL_A1_1.id]: FINAL_A1_1 };

/** Todos los audios de los exámenes (para generarlos con voces de Microsoft) */
export const EXAM_AUDIO: { text: string; voice: Voice }[] = [PLACEMENT, FINAL_A1_1].flatMap((e) =>
  e.sections.flatMap((s) => (s.kind === "listening" ? s.blocks.map((b) => ({ text: b.audio, voice: b.voice })) : [])),
);
