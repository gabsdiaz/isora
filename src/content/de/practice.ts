import type { Tr, Voice } from "../types";

/**
 * Práctica de cada unidad del A1.1:
 *  - Hören: un diálogo corto (audio) con 3 preguntas
 *  - Sprechen: preguntas para responder en voz alta (corrección con IA)
 *  - Schreiben: una tarea corta con texto modelo (corrección con IA o con la Lehrkraft)
 * Las frases para "Nachsprechen" salen de las frases de la Erklärung de la unidad.
 */
export type ListenLine = { who?: string; voice: Voice; de: string };
export type Practice = {
  listening: { title: string; lines: ListenLine[]; questions: { q: string; options: string[]; answer: number }[] };
  speaking: { de: string; tr: Tr }[];
  writing: { prompt: string; promptTr: Tr; hints: string[]; minWords: number; model: string };
};

const f = (who: string, de: string): ListenLine => ({ who, voice: "f", de });
const m = (who: string, de: string): ListenLine => ({ who, voice: "m", de });
const q = (q: string, options: string[], answer: number) => ({ q, options, answer });
const s = (de: string, es: string, en: string) => ({ de, tr: { es, en } });
const w = (prompt: string, es: string, en: string, hints: string[], minWords: number, model: string) => ({ prompt, promptTr: { es, en }, hints, minWords, model });

export const PRACTICE: Record<number, Practice> = {
  1: {
    listening: {
      title: "Im Deutschkurs",
      lines: [f("Frau Schulz", "Guten Morgen! Ich bin Frau Schulz, die Lehrerin. Wie heißen Sie?"), m("Carlos", "Guten Morgen! Ich heiße Carlos Pérez."), f("Frau Schulz", "Woher kommen Sie, Herr Pérez?"), m("Carlos", "Ich komme aus Mexiko.")],
      questions: [q("Wer ist Frau Schulz?", ["die Lehrerin", "eine Studentin", "die Chefin"], 0), q("Wie heißt der Mann?", ["Carlos Pérez", "Carlos Schulz", "Pedro Pérez"], 0), q("Woher kommt Carlos?", ["aus Spanien", "aus Mexiko", "aus Kolumbien"], 1)],
    },
    speaking: [s("Wie heißt du?", "¿Cómo te llamas?", "What's your name?"), s("Woher kommst du?", "¿De dónde eres?", "Where are you from?")],
    writing: w("Stell dich kurz vor: Name, Herkunft, wie geht es dir?", "Preséntate brevemente: nombre, de dónde eres y cómo estás.", "Introduce yourself briefly: name, where you're from, how you are.", ["Hallo! Ich heiße …", "Ich komme aus …", "Mir geht es …"], 12, "Hallo! Ich heiße Lucía. Ich komme aus Kolumbien. Mir geht es gut. Tschüss!"),
  },
  2: {
    listening: {
      title: "Wie schreibt man das?",
      lines: [m("Herr Braun", "Wie ist Ihr Name, bitte?"), f("Frau Okafor", "Okafor."), m("Herr Braun", "Wie schreibt man das?"), f("Frau Okafor", "O, K, A, F, O, R."), m("Herr Braun", "Danke schön!")],
      questions: [q("Was fragt Herr Braun zuerst?", ["den Namen", "die Telefonnummer", "das Alter"], 0), q("Wie schreibt man den Namen?", ["O-K-A-F-O-R", "O-C-A-F-O-R", "O-K-A-V-O-R"], 0), q("Was sagt Herr Braun am Ende?", ["Tschüss!", "Danke schön!", "Bitte!"], 1)],
    },
    speaking: [s("Buchstabiere deinen Vornamen.", "Deletrea tu nombre.", "Spell your first name."), s("Wie schreibt man deinen Nachnamen?", "¿Cómo se escribe tu apellido?", "How do you spell your surname?")],
    writing: w("Schreib deinen Namen und buchstabiere ihn. Schreib auch drei Wörter mit ä, ö oder ü.", "Escribe tu nombre y deletréalo. Escribe también tres palabras con ä, ö o ü.", "Write your name and spell it. Also write three words with ä, ö or ü.", ["Ich heiße …", "Man schreibt: …", "Käse, schön, fünf …"], 12, "Ich heiße Mateo. Man schreibt: M, A, T, E, O. Wörter mit Umlaut: Käse, schön, fünf."),
  },
  3: {
    listening: {
      title: "Neue Nachbarn",
      lines: [f("Anna", "Hallo, ich bin Anna. Ich wohne hier im zweiten Stock."), m("Kenji", "Hallo Anna! Ich bin Kenji. Ich komme aus Japan, aber ich wohne jetzt in München."), f("Anna", "Sprichst du gut Deutsch?"), m("Kenji", "Ein bisschen. Ich spreche Japanisch und Englisch.")],
      questions: [q("Woher kommt Kenji?", ["aus China", "aus Japan", "aus Korea"], 1), q("Wo wohnt Kenji jetzt?", ["in Berlin", "in München", "in Tokio"], 1), q("Welche Sprachen spricht Kenji gut?", ["Japanisch und Englisch", "Deutsch und Englisch", "nur Japanisch"], 0)],
    },
    speaking: [s("Woher kommst du und wo wohnst du?", "¿De dónde eres y dónde vives?", "Where are you from and where do you live?"), s("Welche Sprachen sprichst du?", "¿Qué idiomas hablas?", "Which languages do you speak?")],
    writing: w("Schreib über eine Freundin oder einen Freund: Woher kommt sie/er? Wo wohnt sie/er? Welche Sprachen spricht sie/er?", "Escribe sobre un amigo o una amiga: ¿de dónde es?, ¿dónde vive?, ¿qué idiomas habla?", "Write about a friend: where are they from, where do they live, which languages do they speak?", ["Das ist …", "Sie kommt aus …", "Er wohnt in …", "Sie spricht …"], 20, "Das ist meine Freundin Camila. Sie kommt aus Chile, aber sie wohnt jetzt in Madrid. Sie spricht Spanisch, Englisch und ein bisschen Deutsch."),
  },
  4: {
    listening: {
      title: "Am Telefon",
      lines: [m("Jonas", "Hallo Mia! Wie geht's?"), f("Mia", "Danke, gut! Du, wie ist deine Telefonnummer?"), m("Jonas", "Null, eins, sieben, sechs – drei, vier, fünf – zwölf, achtzehn."), f("Mia", "Danke! Und wie alt ist dein Bruder?"), m("Jonas", "Er ist sechzehn.")],
      questions: [q("Wie geht es Mia?", ["gut", "nicht so gut", "schlecht"], 0), q("Wie alt ist der Bruder von Jonas?", ["6", "16", "60"], 1), q("Welche Zahl hörst du in der Telefonnummer?", ["achtzehn", "neunzehn", "zwanzig"], 0)],
    },
    speaking: [s("Wie alt bist du?", "¿Cuántos años tienes?", "How old are you?"), s("Zähl von zehn bis zwanzig.", "Cuenta del diez al veinte.", "Count from ten to twenty.")],
    writing: w("Schreib eine kurze Nachricht an eine neue Freundin: Wie alt bist du? Wie ist deine Telefonnummer? Wie geht es dir?", "Escribe un mensaje corto a una amiga nueva: ¿cuántos años tienes?, ¿tu número de teléfono?, ¿cómo estás?", "Write a short message to a new friend: how old are you, your phone number, how are you?", ["Ich bin … Jahre alt.", "Meine Nummer ist …", "Mir geht es …"], 15, "Hallo Sara! Mir geht es super. Ich bin neunzehn Jahre alt. Meine Nummer ist null, eins, fünf, zwei, acht, drei. Bis bald!"),
  },
  5: {
    listening: {
      title: "Fotos von der Familie",
      lines: [f("Lena", "Schau, das ist meine Familie. Das sind meine Eltern."), m("Mateo", "Und wer ist das?"), f("Lena", "Das ist mein Bruder Paul. Er hat zwei Kinder."), m("Mateo", "Und hast du auch Kinder?"), f("Lena", "Nein, aber ich habe eine Katze!")],
      questions: [q("Wer ist Paul?", ["Lenas Vater", "Lenas Bruder", "Lenas Sohn"], 1), q("Wie viele Kinder hat Paul?", ["eins", "zwei", "drei"], 1), q("Was hat Lena?", ["zwei Kinder", "einen Hund", "eine Katze"], 2)],
    },
    speaking: [s("Hast du Geschwister?", "¿Tienes hermanos?", "Do you have siblings?"), s("Wie heißt deine Mutter und wie alt ist sie?", "¿Cómo se llama tu mamá y cuántos años tiene?", "What's your mother's name and how old is she?")],
    writing: w("Stell deine Familie vor: Wer ist in deiner Familie? Wie heißen sie? Wie alt sind sie?", "Presenta a tu familia: ¿quiénes son?, ¿cómo se llaman?, ¿cuántos años tienen?", "Introduce your family: who's in it, their names and ages.", ["Meine Mutter heißt …", "Mein Bruder ist … Jahre alt.", "Ich habe …"], 25, "Meine Familie ist klein. Meine Mutter heißt Rosa und sie ist fünfzig Jahre alt. Mein Vater heißt Luis. Ich habe eine Schwester. Sie heißt Ana und sie ist zwanzig. Wir haben auch einen Hund."),
  },
  6: {
    listening: {
      title: "Was machst du beruflich?",
      lines: [m("Tom", "Was bist du von Beruf, Julia?"), f("Julia", "Ich bin Ärztin. Ich arbeite im Krankenhaus."), m("Tom", "Super! Ich bin Koch. Ich arbeite in einem Restaurant."), f("Julia", "Und dein Bruder?"), m("Tom", "Er studiert Informatik.")],
      questions: [q("Was ist Julia von Beruf?", ["Lehrerin", "Ärztin", "Köchin"], 1), q("Wo arbeitet Tom?", ["im Krankenhaus", "in einem Restaurant", "an der Uni"], 1), q("Was macht Toms Bruder?", ["Er arbeitet als Koch.", "Er studiert Informatik.", "Er ist Arzt."], 1)],
    },
    speaking: [s("Was bist du von Beruf oder was studierst du?", "¿A qué te dedicas o qué estudias?", "What do you do or what do you study?"), s("Wo arbeitest du?", "¿Dónde trabajas?", "Where do you work?")],
    writing: w("Schreib über deinen Beruf oder dein Studium: Was machst du? Wo? Arbeitest du gern?", "Escribe sobre tu trabajo o tus estudios: ¿qué haces?, ¿dónde?, ¿te gusta?", "Write about your job or studies: what you do, where, do you like it?", ["Ich bin … von Beruf.", "Ich arbeite bei/in …", "Ich studiere …"], 20, "Ich bin Ingenieurin von Beruf. Ich arbeite bei einer Firma in Bogotá. Ich arbeite gern, aber ich arbeite sehr viel. Mein Mann ist Lehrer."),
  },
  7: {
    listening: {
      title: "Auf dem Flohmarkt",
      lines: [f("Kundin", "Entschuldigung, was kostet die Lampe?"), m("Verkäufer", "Die Lampe kostet fünfundzwanzig Euro."), f("Kundin", "Das ist zu teuer! Und der Stuhl?"), m("Verkäufer", "Der Stuhl kostet nur zwölf Euro fünfzig."), f("Kundin", "Gut, den nehme ich.")],
      questions: [q("Was kostet die Lampe?", ["15 €", "25 €", "52 €"], 1), q("Was kostet der Stuhl?", ["12,50 €", "20,50 €", "2,50 €"], 0), q("Was kauft die Frau?", ["die Lampe", "den Stuhl", "nichts"], 1)],
    },
    speaking: [s("Was kostet ein Kaffee in deiner Stadt?", "¿Cuánto cuesta un café en tu ciudad?", "How much is a coffee in your city?"), s("Zähl in Zehnern bis hundert.", "Cuenta de diez en diez hasta cien.", "Count in tens up to a hundred.")],
    writing: w("Du verkaufst drei Sachen auf dem Flohmarkt. Schreib eine kleine Anzeige mit Preisen.", "Vendes tres cosas en un mercado de pulgas. Escribe un anuncio corto con los precios.", "You're selling three things at a flea market. Write a short ad with prices.", ["Ich verkaufe …", "Der Tisch kostet …", "Das ist sehr günstig!"], 20, "Ich verkaufe einen Tisch, eine Lampe und zwei Stühle. Der Tisch kostet dreißig Euro. Die Lampe kostet acht Euro fünfzig. Die Stühle kosten zusammen zwanzig Euro. Das ist sehr günstig!"),
  },
  8: {
    listening: {
      title: "Wo ist mein Schlüssel?",
      lines: [m("Max", "Lisa, wo ist mein Schlüssel?"), f("Lisa", "Ist er auf dem Tisch?"), m("Max", "Nein. Da ist nur das Buch und die Lampe."), f("Lisa", "Und in der Tasche?"), m("Max", "Ja! Da ist er. Danke!")],
      questions: [q("Was sucht Max?", ["das Buch", "den Schlüssel", "die Tasche"], 1), q("Was ist auf dem Tisch?", ["das Buch und die Lampe", "der Schlüssel", "die Tasche"], 0), q("Wo ist der Schlüssel?", ["auf dem Tisch", "in der Tasche", "im Auto"], 1)],
    },
    speaking: [s("Was ist auf deinem Tisch? Sag die Wörter mit Artikel.", "¿Qué hay en tu mesa? Di las palabras con su artículo.", "What's on your table? Say the words with their article."), s("Was ist in deiner Tasche?", "¿Qué hay en tu bolso?", "What's in your bag?")],
    writing: w("Schreib fünf Sachen aus deinem Zimmer mit Artikel und einen Satz mit er, sie oder es.", "Escribe cinco cosas de tu habitación con artículo y una frase con er, sie o es.", "Write five things from your room with their article and one sentence with er, sie or es.", ["der …", "die …", "das …", "Der Tisch? Er ist …"], 15, "In meinem Zimmer sind: der Tisch, die Lampe, das Bett, der Computer und das Buch. Die Lampe ist neu. Sie ist sehr schön."),
  },
  9: {
    listening: {
      title: "Im Kursraum",
      lines: [f("Lehrerin", "Öffnen Sie bitte das Buch auf Seite zehn."), m("Student", "Entschuldigung, ich habe kein Buch."), f("Lehrerin", "Kein Problem. Hier ist ein Buch für Sie."), m("Student", "Danke! Wie heißt das auf Deutsch?"), f("Lehrerin", "Das ist ein Radiergummi.")],
      questions: [q("Auf welcher Seite sollen sie das Buch öffnen?", ["auf Seite zehn", "auf Seite zwei", "auf Seite zwölf"], 0), q("Was hat der Student nicht?", ["ein Heft", "ein Buch", "einen Stift"], 1), q("Was ist das Wort am Ende?", ["der Bleistift", "der Radiergummi", "die Tafel"], 1)],
    },
    speaking: [s("Was hast du im Kurs dabei? Sag es mit ein oder eine.", "¿Qué tienes contigo en clase? Dilo con ein o eine.", "What do you have with you in class? Say it with ein or eine."), s("Was sagst du, wenn du etwas nicht verstehst?", "¿Qué dices cuando no entiendes algo?", "What do you say when you don't understand something?")],
    writing: w("Schreib, was in deinem Rucksack ist (mit ein/eine) und was nicht (mit kein/keine).", "Escribe qué hay en tu mochila (con ein/eine) y qué no hay (con kein/keine).", "Write what's in your backpack (with ein/eine) and what isn't (with kein/keine).", ["In meinem Rucksack ist ein …", "Ich habe eine …", "Ich habe kein …"], 20, "In meinem Rucksack ist ein Heft, ein Kuli und eine Flasche Wasser. Ich habe auch ein Handy. Aber ich habe kein Wörterbuch und keine Stifte."),
  },
  10: {
    listening: {
      title: "Wann beginnt der Film?",
      lines: [m("Ben", "Wie spät ist es?"), f("Clara", "Es ist Viertel nach sieben."), m("Ben", "Wann beginnt der Film?"), f("Clara", "Um halb acht. Wir haben noch fünfzehn Minuten."), m("Ben", "Dann los!")],
      questions: [q("Wie spät ist es?", ["7:15 Uhr", "7:45 Uhr", "8:15 Uhr"], 0), q("Wann beginnt der Film?", ["um 7:30 Uhr", "um 8:30 Uhr", "um 7:00 Uhr"], 0), q("Wie viele Minuten haben sie noch?", ["5", "15", "50"], 1)],
    },
    speaking: [s("Wie spät ist es jetzt?", "¿Qué hora es ahora?", "What time is it now?"), s("Wann beginnt dein Tag und wann endet er?", "¿A qué hora empieza y termina tu día?", "When does your day start and end?")],
    writing: w("Schreib deinen Plan für morgen mit Uhrzeiten (mindestens drei Termine).", "Escribe tu plan para mañana con horas (mínimo tres citas).", "Write your plan for tomorrow with times (at least three appointments).", ["Um … Uhr …", "Von … bis …", "Um halb …"], 20, "Morgen beginnt mein Deutschkurs um neun Uhr. Von zwölf bis eins habe ich Pause. Um halb drei habe ich einen Termin beim Arzt. Um acht Uhr sehe ich einen Film."),
  },
  11: {
    listening: {
      title: "Geburtstag im Mai",
      lines: [f("Sofía", "Wann hast du Geburtstag, Leo?"), m("Leo", "Im Mai. Am Samstag, den zwölften."), f("Sofía", "Oh, das ist bald! Machst du eine Party?"), m("Leo", "Ja, am Abend um acht. Kommst du?"), f("Sofía", "Natürlich!")],
      questions: [q("Wann hat Leo Geburtstag?", ["im März", "im Mai", "im Juni"], 1), q("An welchem Tag ist die Party?", ["am Freitag", "am Samstag", "am Sonntag"], 1), q("Um wie viel Uhr beginnt die Party?", ["um 6 Uhr", "um 7 Uhr", "um 8 Uhr"], 2)],
    },
    speaking: [s("Wann hast du Geburtstag?", "¿Cuándo es tu cumpleaños?", "When is your birthday?"), s("Was ist deine Lieblingsjahreszeit und warum?", "¿Cuál es tu estación favorita y por qué?", "What's your favourite season and why?")],
    writing: w("Schreib eine Einladung zu deinem Geburtstag: Wann? Um wie viel Uhr? Wo?", "Escribe una invitación a tu cumpleaños: ¿cuándo?, ¿a qué hora?, ¿dónde?", "Write an invitation to your birthday: when, what time, where?", ["Ich habe am … Geburtstag.", "Die Party ist am … um …", "Kommst du?"], 20, "Liebe Freunde, ich habe am Freitag Geburtstag! Die Party ist am Samstag um acht Uhr bei mir zu Hause. Es gibt Pizza und Musik. Kommt ihr?"),
  },
  12: {
    listening: {
      title: "Mein Montag",
      lines: [f("Erzählerin", "Am Montag stehe ich um sechs Uhr auf. Zuerst dusche ich, dann frühstücke ich."), f("Erzählerin", "Um sieben Uhr fahre ich mit dem Bus ins Büro."), f("Erzählerin", "Am Mittag esse ich mit meinen Kollegen. Am Abend lese ich ein Buch und um elf schlafe ich.")],
      questions: [q("Was macht die Frau zuerst?", ["Sie frühstückt.", "Sie duscht.", "Sie liest."], 1), q("Wie fährt sie ins Büro?", ["mit dem Auto", "mit dem Bus", "mit dem Fahrrad"], 1), q("Was macht sie am Abend?", ["Sie liest ein Buch.", "Sie kocht.", "Sie arbeitet."], 0)],
    },
    speaking: [s("Was machst du am Morgen? Erzähl mit zuerst, dann, danach.", "¿Qué haces en la mañana? Cuéntalo con zuerst, dann, danach.", "What do you do in the morning? Use zuerst, dann, danach."), s("Was machst du am Abend?", "¿Qué haces en la noche?", "What do you do in the evening?")],
    writing: w("Beschreib deinen Tag. Achtung: das Verb steht auf Position 2!", "Describe tu día. ¡Ojo: el verbo va en la posición 2!", "Describe your day. Careful: the verb is in position 2!", ["Um … Uhr frühstücke ich.", "Dann …", "Am Abend …"], 30, "Ich stehe um sieben Uhr auf. Zuerst trinke ich einen Kaffee. Dann dusche ich und fahre mit der U-Bahn zur Uni. Am Mittag esse ich in der Mensa. Am Abend koche ich und sehe einen Film."),
  },
  13: {
    listening: {
      title: "Was machst du gern?",
      lines: [m("Nico", "Spielst du gern Fußball, Emma?"), f("Emma", "Nein, nicht so gern. Ich tanze lieber."), m("Nico", "Und was machst du am liebsten?"), f("Emma", "Am liebsten fotografiere ich. Und du?"), m("Nico", "Ich spiele Gitarre – jeden Tag!")],
      questions: [q("Spielt Emma gern Fußball?", ["Ja, sehr gern.", "Nein, nicht so gern.", "Ja, jeden Tag."], 1), q("Was macht Emma am liebsten?", ["tanzen", "fotografieren", "Gitarre spielen"], 1), q("Wie oft spielt Nico Gitarre?", ["nie", "manchmal", "jeden Tag"], 2)],
    },
    speaking: [s("Was machst du in deiner Freizeit gern?", "¿Qué te gusta hacer en tu tiempo libre?", "What do you like doing in your free time?"), s("Was machst du nicht gern?", "¿Qué no te gusta hacer?", "What don't you like doing?")],
    writing: w("Schreib über deine Hobbys: Was machst du gern, lieber, am liebsten? Wie oft?", "Escribe sobre tus pasatiempos: ¿qué te gusta, qué prefieres, qué es lo que más te gusta?, ¿con qué frecuencia?", "Write about your hobbies: what you like, prefer, like best, and how often.", ["Ich … gern.", "Ich … lieber …", "Am liebsten …", "oft / manchmal / nie"], 25, "In meiner Freizeit lese ich gern. Ich spiele auch gern Tennis, aber ich schwimme lieber. Am liebsten reise ich. Ich koche manchmal, aber ich jogge nie."),
  },
  14: {
    listening: {
      title: "Was isst du zum Frühstück?",
      lines: [f("Anna", "Was isst du zum Frühstück, Paul?"), m("Paul", "Ich esse ein Brötchen mit Käse und trinke einen Kaffee."), f("Anna", "Ich mag keinen Kaffee. Ich trinke Tee."), m("Paul", "Und was isst du?"), f("Anna", "Ein Müsli mit Banane.")],
      questions: [q("Was trinkt Paul?", ["Tee", "Kaffee", "Saft"], 1), q("Was mag Anna nicht?", ["Tee", "Kaffee", "Bananen"], 1), q("Was isst Anna?", ["ein Brötchen mit Käse", "ein Müsli mit Banane", "ein Ei"], 1)],
    },
    speaking: [s("Was isst du gern zum Frühstück?", "¿Qué te gusta desayunar?", "What do you like for breakfast?"), s("Was magst du nicht?", "¿Qué no te gusta?", "What don't you like?")],
    writing: w("Was isst und trinkst du an einem normalen Tag? Benutze den Akkusativ (einen, eine, ein, keinen).", "¿Qué comes y bebes en un día normal? Usa el acusativo (einen, eine, ein, keinen).", "What do you eat and drink on a normal day? Use the accusative.", ["Zum Frühstück esse ich …", "Ich trinke einen …", "Ich mag keinen …"], 25, "Zum Frühstück esse ich ein Brot mit Butter und trinke einen Kaffee. Am Mittag esse ich einen Salat oder Reis mit Hähnchen. Am Abend esse ich eine Suppe. Ich mag keinen Fisch."),
  },
  15: {
    listening: {
      title: "Im Café",
      lines: [m("Kellner", "Guten Tag! Was möchten Sie?"), f("Gast", "Ich möchte einen Tee und ein Stück Schokoladenkuchen, bitte."), m("Kellner", "Gern. Möchten Sie den Tee mit Milch?"), f("Gast", "Nein, danke. Was macht das?"), m("Kellner", "Das macht sechs Euro vierzig.")],
      questions: [q("Was bestellt die Frau zu trinken?", ["einen Kaffee", "einen Tee", "eine Cola"], 1), q("Möchte sie Milch?", ["Ja.", "Nein.", "Das sagt sie nicht."], 1), q("Was kostet alles?", ["4,60 €", "6,40 €", "16,40 €"], 1)],
    },
    speaking: [s("Du bist im Café. Bestell ein Getränk und etwas zu essen.", "Estás en un café. Pide una bebida y algo de comer.", "You're in a café. Order a drink and something to eat."), s("Frag nach der Rechnung und bezahl.", "Pide la cuenta y paga.", "Ask for the bill and pay.")],
    writing: w("Schreib einen Dialog im Café: bestellen und bezahlen (mindestens 4 Sätze).", "Escribe un diálogo en un café: pedir y pagar (mínimo 4 frases).", "Write a café dialogue: ordering and paying (at least 4 sentences).", ["Was möchten Sie?", "Ich möchte …", "Ich nehme …", "Die Rechnung, bitte."], 25, "Kellner: Guten Tag, was möchten Sie? – Gast: Ich möchte einen Kaffee und ein Stück Apfelkuchen, bitte. – Kellner: Gern. – Gast: Die Rechnung, bitte. – Kellner: Das macht fünf Euro achtzig. – Gast: Sechs Euro. Stimmt so!"),
  },
  16: {
    listening: {
      title: "Im Supermarkt",
      lines: [f("Kundin", "Entschuldigung, wo finde ich Reis?"), m("Verkäufer", "Der Reis ist dort hinten, neben den Nudeln."), f("Kundin", "Danke. Und haben Sie frische Erdbeeren?"), m("Verkäufer", "Ja, ein Kilo kostet drei Euro neunzig.")],
      questions: [q("Was sucht die Frau zuerst?", ["Nudeln", "Reis", "Erdbeeren"], 1), q("Wo ist der Reis?", ["neben den Nudeln", "neben dem Obst", "an der Kasse"], 0), q("Was kostet ein Kilo Erdbeeren?", ["3,90 €", "9,30 €", "1,90 €"], 0)],
    },
    speaking: [s("Was kaufst du diese Woche im Supermarkt?", "¿Qué compras esta semana en el supermercado?", "What are you buying at the supermarket this week?"), s("Frag eine Verkäuferin nach einem Produkt.", "Pregúntale a una vendedora por un producto.", "Ask a shop assistant for a product.")],
    writing: w("Schreib deinen Einkaufszettel mit Mengen und einen Satz: Was brauchst du heute?", "Escribe tu lista de compras con cantidades y una frase: ¿qué necesitas hoy?", "Write your shopping list with quantities and one sentence: what do you need today?", ["ein Kilo …", "eine Packung …", "ein Liter …", "Ich brauche …"], 15, "Mein Einkaufszettel: ein Kilo Tomaten, eine Packung Nudeln, ein Liter Milch, sechs Eier und eine Dose Bohnen. Heute brauche ich auch Brot."),
  },
  17: {
    listening: {
      title: "Im Kleidungsgeschäft",
      lines: [f("Kundin", "Haben Sie die Jacke auch in Grün?"), m("Verkäufer", "Ja, hier. Welche Größe brauchen Sie?"), f("Kundin", "Größe M, bitte. Kann ich sie anprobieren?"), m("Verkäufer", "Natürlich. Die Kabine ist dort."), f("Kundin", "Die Jacke passt super. Ich nehme sie!")],
      questions: [q("Welche Farbe möchte die Frau?", ["Grün", "Blau", "Rot"], 0), q("Welche Größe braucht sie?", ["S", "M", "L"], 1), q("Kauft sie die Jacke?", ["Ja.", "Nein.", "Vielleicht."], 0)],
    },
    speaking: [s("Was trägst du heute? Welche Farben?", "¿Qué llevas puesto hoy? ¿De qué colores?", "What are you wearing today? What colours?"), s("Wie findest du Rot? Und Schwarz?", "¿Qué te parece el rojo? ¿Y el negro?", "What do you think of red? And black?")],
    writing: w("Beschreib deine Lieblingskleidung: Was ist es? Welche Farbe? Wie findest du es?", "Describe tu prenda favorita: ¿qué es?, ¿de qué color?, ¿qué te parece?", "Describe your favourite clothes: what, which colour, what you think of it.", ["Mein Lieblingspullover ist …", "Ich finde ihn …", "Die Hose ist …"], 20, "Meine Lieblingsjacke ist blau und sehr warm. Ich finde sie super schön. Ich trage sie im Winter. Ich habe auch eine schwarze Hose. Ich finde sie elegant."),
  },
  18: {
    listening: {
      title: "Eine Wohnung zu vermieten",
      lines: [m("Vermieter", "Die Wohnung hat zwei Zimmer, eine Küche und ein Bad."), f("Interessentin", "Gibt es einen Balkon?"), m("Vermieter", "Ja, es gibt einen Balkon, aber keinen Garten."), f("Interessentin", "Ist die Wohnung ruhig?"), m("Vermieter", "Ja, sehr ruhig und hell. Sie kostet sechshundert Euro warm.")],
      questions: [q("Wie viele Zimmer hat die Wohnung?", ["eins", "zwei", "drei"], 1), q("Was gibt es nicht?", ["einen Balkon", "einen Garten", "ein Bad"], 1), q("Was kostet die Wohnung?", ["500 €", "600 €", "660 €"], 1)],
    },
    speaking: [s("Wie ist deine Wohnung?", "¿Cómo es tu apartamento?", "What is your flat like?"), s("Was gibt es in deinem Zimmer?", "¿Qué hay en tu habitación?", "What's in your room?")],
    writing: w("Beschreib deine Wohnung oder dein Haus: Zimmer, Möbel, wie ist sie? Was gibt es, was gibt es nicht?", "Describe tu apartamento o casa: habitaciones, muebles, ¿cómo es? ¿Qué hay y qué no hay?", "Describe your flat or house: rooms, furniture, what it's like, what there is and isn't.", ["Meine Wohnung ist …", "Es gibt einen/eine/ein …", "Es gibt keinen …"], 30, "Meine Wohnung ist klein, aber gemütlich. Es gibt ein Schlafzimmer, ein Wohnzimmer, eine Küche und ein Bad. Im Wohnzimmer gibt es ein Sofa und einen Tisch. Es gibt keinen Balkon, aber die Wohnung ist sehr hell."),
  },
  19: {
    listening: {
      title: "Der Wetterbericht",
      lines: [m("Sprecher", "Und jetzt das Wetter für morgen."), m("Sprecher", "Im Norden regnet es den ganzen Tag. Es sind nur zehn Grad."), m("Sprecher", "Im Süden scheint die Sonne. Es wird warm, bis zu fünfundzwanzig Grad."), m("Sprecher", "Am Abend gibt es im Westen Gewitter.")],
      questions: [q("Wie ist das Wetter im Norden?", ["Es regnet.", "Die Sonne scheint.", "Es schneit."], 0), q("Wie warm wird es im Süden?", ["10 Grad", "20 Grad", "25 Grad"], 2), q("Was gibt es am Abend im Westen?", ["Schnee", "Gewitter", "Nebel"], 1)],
    },
    speaking: [s("Wie ist das Wetter heute bei dir?", "¿Cómo está el clima hoy donde estás?", "What's the weather like where you are today?"), s("Wie ist das Wetter in deinem Land im Dezember?", "¿Cómo es el clima en tu país en diciembre?", "What's the weather like in your country in December?")],
    writing: w("Schreib eine Postkarte aus dem Urlaub: Wo bist du? Wie ist das Wetter? Was machst du?", "Escribe una postal de tus vacaciones: ¿dónde estás?, ¿cómo está el clima?, ¿qué haces?", "Write a holiday postcard: where you are, the weather, what you're doing.", ["Liebe …", "Ich bin in …", "Die Sonne scheint / Es regnet …", "Es sind … Grad."], 25, "Liebe Carla, ich bin in Cartagena! Das Wetter ist super: Die Sonne scheint und es sind dreißig Grad. Am Morgen schwimme ich im Meer und am Abend esse ich Fisch. Viele Grüße, Juan"),
  },
  20: {
    listening: {
      title: "Die Prüfung: Sich vorstellen",
      lines: [f("Prüferin", "Bitte stellen Sie sich vor."), m("Kandidat", "Ich heiße David Moreno. Ich bin achtundzwanzig Jahre alt und komme aus Ecuador."), m("Kandidat", "Ich wohne in Quito. Ich spreche Spanisch, Englisch und ein bisschen Deutsch."), m("Kandidat", "Ich bin Programmierer. In meiner Freizeit spiele ich gern Fußball.")],
      questions: [q("Wie alt ist David?", ["18", "28", "38"], 1), q("Woher kommt David?", ["aus Ecuador", "aus Peru", "aus Spanien"], 0), q("Was ist David von Beruf?", ["Lehrer", "Programmierer", "Koch"], 1)],
    },
    speaking: [s("Stell dich vor wie in der Prüfung: Name, Alter, Land, Wohnort, Sprachen, Beruf, Hobbys.", "Preséntate como en el examen: nombre, edad, país, ciudad, idiomas, profesión, pasatiempos.", "Introduce yourself as in the exam: name, age, country, city, languages, job, hobbies."), s("Was hast du in A1.1 gelernt? Nenn drei Dinge.", "¿Qué aprendiste en el A1.1? Nombra tres cosas.", "What did you learn in A1.1? Name three things.")],
    writing: w("Schreib eine E-Mail an deine neue Lehrerin: Stell dich vor und sag, warum du Deutsch lernst.", "Escribe un correo a tu nueva profesora: preséntate y di por qué aprendes alemán.", "Write an email to your new teacher: introduce yourself and say why you're learning German.", ["Liebe Frau …", "Ich heiße … und komme aus …", "Ich lerne Deutsch, denn …", "Viele Grüße"], 35, "Liebe Frau Weber, ich heiße Valentina und ich komme aus Kolumbien. Ich bin vierundzwanzig Jahre alt und wohne in Medellín. Ich bin Ingenieurin. Ich lerne Deutsch, denn ich möchte in Deutschland arbeiten. Ich spreche Spanisch und Englisch. Viele Grüße, Valentina"),
  },
};
