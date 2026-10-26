import type { ListenLine, Practice } from "./practice";

/**
 * Práctica de cada unidad del A1.2 (misma estructura que el A1.1):
 *  - Hören: un diálogo corto con 3 preguntas
 *  - Sprechen: 2 preguntas para responder en voz alta
 *  - Schreiben: una tarea con pistas y texto modelo
 */
const f = (who: string, de: string): ListenLine => ({ who, voice: "f", de });
const m = (who: string, de: string): ListenLine => ({ who, voice: "m", de });
const q = (q: string, options: string[], answer: number) => ({ q, options, answer });
const s = (de: string, es: string, en: string) => ({ de, tr: { es, en } });
const w = (prompt: string, es: string, en: string, hints: string[], minWords: number, model: string) => ({ prompt, promptTr: { es, en }, hints, minWords, model });

export const PRACTICE_A1_2: Record<number, Practice> = {
  1: {
    listening: {
      title: "Ein Termin beim Friseur",
      lines: [
        f("Salon", "Salon Haarmonie, guten Tag!"),
        m("Herr Ortiz", "Guten Tag, hier ist Ortiz. Ich möchte gern einen Termin machen."),
        f("Salon", "Geht es am Donnerstag um zehn Uhr?"),
        m("Herr Ortiz", "Nein, am Vormittag arbeite ich. Geht es auch am Nachmittag?"),
        f("Salon", "Ja, um halb fünf. Passt das?"),
        m("Herr Ortiz", "Ja, das passt gut. Vielen Dank!"),
      ],
      questions: [
        q("Wo ruft Herr Ortiz an?", ["beim Arzt", "beim Friseur", "im Restaurant"], 1),
        q("Warum geht zehn Uhr nicht?", ["Er arbeitet am Vormittag.", "Er hat einen Arzttermin.", "Er schläft lange."], 0),
        q("Wann ist der Termin?", ["am Donnerstag um 10 Uhr", "am Donnerstag um 16:30 Uhr", "am Dienstag um 16:30 Uhr"], 1),
      ],
    },
    speaking: [
      s("Wann stehst du am Montag auf und wann fängt deine Arbeit oder dein Kurs an?", "¿A qué hora te levantas el lunes y a qué hora empieza tu trabajo o tu curso?", "When do you get up on Monday and when does your work or class start?"),
      s("Du möchtest einen Termin beim Arzt. Was sagst du am Telefon?", "Quieres una cita con el médico. ¿Qué dices por teléfono?", "You want a doctor's appointment. What do you say on the phone?"),
    ],
    writing: w(
      "Du hast morgen um 9 Uhr einen Termin beim Zahnarzt, aber du kannst nicht kommen. Schreib eine kurze E-Mail: Entschuldige dich und frag nach einem neuen Termin.",
      "Mañana a las 9 tienes cita con el dentista, pero no puedes ir. Escribe un correo corto: discúlpate y pide una cita nueva.",
      "You have a dentist's appointment tomorrow at 9 but can't come. Write a short email: apologise and ask for a new appointment.",
      ["Sehr geehrte Damen und Herren,", "leider kann ich morgen nicht …", "Geht es vielleicht am … um …?", "Mit freundlichen Grüßen"],
      25,
      "Sehr geehrte Damen und Herren,\nich habe morgen um 9 Uhr einen Termin. Leider kann ich nicht kommen, ich muss arbeiten. Geht es vielleicht am Freitag um 15 Uhr?\nMit freundlichen Grüßen\nLucía Rojas",
    ),
  },
  2: {
    listening: {
      title: "Gehen wir ins Kino?",
      lines: [
        m("Ben", "Hallo Ines! Hast du am Samstag Zeit? Ich möchte ins Kino gehen."),
        f("Ines", "Am Samstag kann ich leider nicht. Da besuche ich meine Oma."),
        m("Ben", "Schade! Und am Sonntag?"),
        f("Ines", "Am Sonntag habe ich Zeit. Wann beginnt der Film?"),
        m("Ben", "Um acht. Treffen wir uns um halb acht vor dem Kino?"),
        f("Ines", "Gute Idee! Bis Sonntag!"),
      ],
      questions: [
        q("Was macht Ines am Samstag?", ["Sie geht ins Kino.", "Sie besucht ihre Oma.", "Sie arbeitet."], 1),
        q("Wann beginnt der Film?", ["um 19:30 Uhr", "um 20 Uhr", "um 18 Uhr"], 1),
        q("Wo treffen sie sich?", ["vor dem Kino", "bei Ines", "am Bahnhof"], 0),
      ],
    },
    speaking: [
      s("Was machst du gern am Wochenende mit Freunden?", "¿Qué te gusta hacer el fin de semana con amigos?", "What do you like doing at the weekend with friends?"),
      s("Eine Freundin fragt: „Hast du heute Abend Zeit?“ Du hast keine Zeit. Was antwortest du?", "Una amiga pregunta: «¿Tienes tiempo esta noche?». No tienes tiempo. ¿Qué respondes?", "A friend asks: “Are you free tonight?” You aren't. What do you answer?"),
    ],
    writing: w(
      "Lade eine Freundin oder einen Freund ein. Schreib: Was wollt ihr machen? Wann? Wo trefft ihr euch?",
      "Invita a un amigo o una amiga. Escribe: ¿qué quieren hacer?, ¿cuándo?, ¿dónde se encuentran?",
      "Invite a friend. Write: what do you want to do, when, and where will you meet?",
      ["Hallo …, hast du Lust?", "Wir können … gehen.", "Treffen wir uns um … am/vor …?", "Liebe Grüße"],
      25,
      "Hallo Tim,\nhast du am Freitag Lust auf ein Konzert? Im Park spielt eine Band aus Kolumbien. Das Konzert beginnt um 19 Uhr. Treffen wir uns um halb sieben an der U-Bahn?\nLiebe Grüße\nSara",
    ),
  },
  3: {
    listening: {
      title: "Was kannst du gut?",
      lines: [
        f("Mira", "Du, Pablo, kannst du schwimmen?"),
        m("Pablo", "Ja, sehr gut! Aber ich kann nicht Auto fahren. Ich will es dieses Jahr lernen."),
        f("Mira", "Ich muss morgen früh arbeiten, aber am Abend können wir zusammen schwimmen gehen."),
        m("Pablo", "Super! Darf mein Bruder auch mitkommen?"),
        f("Mira", "Klar, natürlich!"),
      ],
      questions: [
        q("Was kann Pablo nicht?", ["schwimmen", "Auto fahren", "kochen"], 1),
        q("Was muss Mira morgen früh machen?", ["schwimmen", "arbeiten", "lernen"], 1),
        q("Wer möchte auch mitkommen?", ["Pablos Bruder", "Miras Schwester", "Pablos Freundin"], 0),
      ],
    },
    speaking: [
      s("Was kannst du gut und was kannst du nicht so gut?", "¿Qué sabes hacer bien y qué no tan bien?", "What can you do well and what not so well?"),
      s("Was musst du diese Woche machen und was willst du am Wochenende machen?", "¿Qué tienes que hacer esta semana y qué quieres hacer el fin de semana?", "What do you have to do this week and what do you want to do at the weekend?"),
    ],
    writing: w(
      "Schreib über dich: Was kannst du gut? Was willst du lernen? Was musst du jeden Tag machen?",
      "Escribe sobre ti: ¿qué sabes hacer bien?, ¿qué quieres aprender?, ¿qué tienes que hacer cada día?",
      "Write about yourself: what can you do well, what do you want to learn, what do you have to do every day?",
      ["Ich kann gut …", "Ich will … lernen.", "Jeden Tag muss ich …"],
      25,
      "Ich kann gut kochen und tanzen. Ich kann nicht gut singen. Dieses Jahr will ich Deutsch lernen und im Sommer will ich nach Berlin fliegen. Jeden Tag muss ich früh aufstehen und arbeiten.",
    ),
  },
  4: {
    listening: {
      title: "Bestellen, bitte!",
      lines: [
        m("Kellner", "Guten Abend! Was möchten Sie trinken?"),
        f("Frau Silva", "Ein Mineralwasser, bitte."),
        m("Kellner", "Und was möchten Sie essen?"),
        f("Frau Silva", "Ich nehme die Gemüsesuppe und dann den Fisch mit Kartoffeln."),
        m("Kellner", "Gern. Möchten Sie auch ein Dessert?"),
        f("Frau Silva", "Nein, danke. Später möchte ich bitte zahlen."),
      ],
      questions: [
        q("Was trinkt Frau Silva?", ["einen Weißwein", "ein Mineralwasser", "einen Kaffee"], 1),
        q("Was isst sie zuerst?", ["eine Gemüsesuppe", "einen Salat", "den Fisch"], 0),
        q("Nimmt sie ein Dessert?", ["Ja, ein Eis.", "Ja, einen Kuchen.", "Nein."], 2),
      ],
    },
    speaking: [
      s("Du bist im Restaurant. Bestell ein Getränk und ein Essen.", "Estás en un restaurante. Pide una bebida y una comida.", "You're in a restaurant. Order a drink and a meal."),
      s("Was isst du gern und was isst du nicht gern?", "¿Qué te gusta comer y qué no?", "What do you like and dislike eating?"),
    ],
    writing: w(
      "Schreib über dein Lieblingsrestaurant: Wo ist es? Was isst und trinkst du dort? Wie viel kostet das Essen?",
      "Escribe sobre tu restaurante favorito: ¿dónde está?, ¿qué comes y bebes allí?, ¿cuánto cuesta la comida?",
      "Write about your favourite restaurant: where is it, what do you eat and drink there, how much does it cost?",
      ["Mein Lieblingsrestaurant heißt …", "Dort esse ich oft …", "Das Essen kostet …"],
      25,
      "Mein Lieblingsrestaurant heißt „Casa Mía“. Es ist in der Altstadt. Dort esse ich oft Pasta mit Tomatensoße und ich trinke eine Limonade. Das Mittagsmenü kostet nur zwölf Euro. Das Essen ist super!",
    ),
  },
  5: {
    listening: {
      title: "Was fehlt dir?",
      lines: [
        f("Laura", "Hallo Felix! Du siehst nicht gut aus. Was ist los?"),
        m("Felix", "Mir tut der Kopf weh und mein Hals auch."),
        f("Laura", "Oh, hast du Fieber?"),
        m("Felix", "Nein, aber ich bin sehr müde. Ich gehe jetzt nach Hause und trinke einen Tee."),
        f("Laura", "Gute Idee. Gute Besserung!"),
      ],
      questions: [
        q("Was tut Felix weh?", ["der Bauch und der Rücken", "der Kopf und der Hals", "die Füße"], 1),
        q("Hat Felix Fieber?", ["Ja.", "Nein.", "Das weiß man nicht."], 1),
        q("Was macht Felix jetzt?", ["Er geht zum Arzt.", "Er geht nach Hause.", "Er geht zur Arbeit."], 1),
      ],
    },
    speaking: [
      s("Zeig auf deinen Körper und sag: Das ist mein Kopf, das sind meine Hände …", "Señala tu cuerpo y di: esta es mi cabeza, estas son mis manos…", "Point to your body and say: this is my head, these are my hands…"),
      s("Was machst du, wenn dir der Kopf wehtut?", "¿Qué haces cuando te duele la cabeza?", "What do you do when you have a headache?"),
    ],
    writing: w(
      "Du bist krank und kannst nicht zum Kurs kommen. Schreib deiner Lehrerin: Was tut dir weh? Was machst du jetzt?",
      "Estás enfermo/a y no puedes ir al curso. Escríbele a tu profesora: ¿qué te duele?, ¿qué vas a hacer?",
      "You're ill and can't come to class. Write to your teacher: what hurts, what are you doing now?",
      ["Liebe Frau …,", "ich bin krank. Mir tut … weh.", "Ich bleibe heute zu Hause.", "Viele Grüße"],
      20,
      "Liebe Frau Weber,\nich kann heute leider nicht zum Kurs kommen. Ich bin krank. Mir tun der Kopf und der Bauch weh. Ich bleibe zu Hause und schlafe viel.\nViele Grüße\nAna",
    ),
  },
  6: {
    listening: {
      title: "In der Arztpraxis",
      lines: [
        f("Ärztin", "Guten Tag, Herr Demir. Was fehlt Ihnen?"),
        m("Herr Demir", "Ich habe seit drei Tagen Husten und Halsschmerzen."),
        f("Ärztin", "Haben Sie auch Fieber?"),
        m("Herr Demir", "Ja, ein bisschen."),
        f("Ärztin", "Bleiben Sie zwei Tage zu Hause und trinken Sie viel Tee. Nehmen Sie diese Tabletten dreimal am Tag."),
        m("Herr Demir", "Danke, Frau Doktor. Gibt es die Tabletten in der Apotheke?"),
        f("Ärztin", "Ja, hier ist das Rezept."),
      ],
      questions: [
        q("Seit wann ist Herr Demir krank?", ["seit gestern", "seit drei Tagen", "seit einer Woche"], 1),
        q("Was soll er trinken?", ["viel Kaffee", "viel Tee", "viel Saft"], 1),
        q("Wie oft soll er die Tabletten nehmen?", ["einmal am Tag", "zweimal am Tag", "dreimal am Tag"], 2),
      ],
    },
    speaking: [
      s("Du bist beim Arzt. Sag, was dir wehtut und seit wann.", "Estás donde el médico. Di qué te duele y desde cuándo.", "You're at the doctor's. Say what hurts and since when."),
      s("Gib einem Patienten zwei Tipps mit dem Imperativ (Sie).", "Dale a un paciente dos consejos en imperativo (Sie).", "Give a patient two tips using the imperative (Sie)."),
    ],
    writing: w(
      "Dein Kollege ist krank. Schreib ihm drei Tipps: Was soll er machen? Was soll er nicht machen?",
      "Tu compañero de trabajo está enfermo. Escríbele tres consejos: ¿qué debe hacer?, ¿qué no debe hacer?",
      "Your colleague is ill. Write him three tips: what should he do and not do?",
      ["Lieber …,", "Bleib … / Trink … / Geh …", "Arbeite heute nicht!", "Gute Besserung!"],
      20,
      "Lieber Tom,\nbleib heute im Bett und schlaf viel! Trink viel Tee mit Honig. Geh morgen zum Arzt und arbeite nicht zu viel. Gute Besserung!\nDeine Carla",
    ),
  },
  7: {
    listening: {
      title: "Wo bist du gerade?",
      lines: [
        m("Leo", "Hallo Hanna! Wo bist du gerade?"),
        f("Hanna", "Ich bin in der Bäckerei. Danach gehe ich noch zur Post."),
        m("Leo", "Ich warte am Marktplatz, neben dem Café."),
        f("Hanna", "Okay. Ich bin in zehn Minuten bei dir."),
      ],
      questions: [
        q("Wo ist Hanna gerade?", ["in der Bäckerei", "in der Post", "im Café"], 0),
        q("Wo wartet Leo?", ["am Bahnhof", "am Marktplatz", "im Park"], 1),
        q("Wann kommt Hanna?", ["in fünf Minuten", "in zehn Minuten", "in einer Stunde"], 1),
      ],
    },
    speaking: [
      s("Was gibt es in deiner Stadt oder in deinem Viertel?", "¿Qué hay en tu ciudad o en tu barrio?", "What is there in your town or neighbourhood?"),
      s("Wo kaufst du Brot, Medikamente und Kleidung?", "¿Dónde compras pan, medicamentos y ropa?", "Where do you buy bread, medicine and clothes?"),
    ],
    writing: w(
      "Beschreib dein Viertel: Was gibt es dort? Was ist neben deinem Haus? Wo bist du gern?",
      "Describe tu barrio: ¿qué hay allí?, ¿qué hay al lado de tu casa?, ¿dónde te gusta estar?",
      "Describe your neighbourhood: what is there, what is next to your house, where do you like to be?",
      ["In meinem Viertel gibt es …", "Neben dem/der … ist …", "Ich bin gern im/am …"],
      25,
      "In meinem Viertel gibt es eine Bäckerei, einen Supermarkt und eine Apotheke. Neben meinem Haus ist ein kleiner Park. Am Wochenende bin ich gern im Café an der Ecke. Dort trinke ich Kaffee und lese.",
    ),
  },
  8: {
    listening: {
      title: "Entschuldigung, wo ist …?",
      lines: [
        f("Touristin", "Entschuldigung, wie komme ich zum Stadtmuseum?"),
        m("Mann", "Gehen Sie hier geradeaus bis zur Ampel. Dann biegen Sie links ab."),
        f("Touristin", "Bis zur Ampel und dann links. Und dann?"),
        m("Mann", "Dann sehen Sie das Museum. Es ist neben der Kirche."),
        f("Touristin", "Ist es weit?"),
        m("Mann", "Nein, nur fünf Minuten zu Fuß."),
      ],
      questions: [
        q("Wohin möchte die Frau?", ["zum Bahnhof", "zum Stadtmuseum", "zur Kirche"], 1),
        q("Wo biegt sie ab?", ["an der Ampel rechts", "an der Ampel links", "an der Kirche links"], 1),
        q("Wie lange geht sie?", ["fünf Minuten", "fünfzehn Minuten", "eine halbe Stunde"], 0),
      ],
    },
    speaking: [
      s("Wie kommt man von deiner Wohnung zum Supermarkt? Erklär den Weg.", "¿Cómo se llega de tu casa al supermercado? Explica el camino.", "How do you get from your flat to the supermarket? Explain the way."),
      s("Frag höflich nach dem Weg zum Bahnhof.", "Pregunta con amabilidad cómo llegar a la estación.", "Ask politely for the way to the station."),
    ],
    writing: w(
      "Eine Freundin besucht dich. Erklär ihr den Weg vom Bahnhof zu deiner Wohnung.",
      "Una amiga viene a visitarte. Explícale el camino de la estación a tu casa.",
      "A friend is visiting. Explain the way from the station to your flat.",
      ["Geh zuerst geradeaus …", "Dann bieg … ab.", "Mein Haus ist neben dem/der …"],
      25,
      "Liebe Clara,\nvom Bahnhof ist es nicht weit. Geh zuerst geradeaus bis zur Post. Dann bieg rechts ab in die Rosenstraße. Mein Haus ist neben dem Supermarkt, Nummer 12. Bis bald!\nSofía",
    ),
  },
  9: {
    listening: {
      title: "Am Bahnhof",
      lines: [
        f("Durchsage", "Achtung an Gleis drei: Der Zug nach Hamburg hat zehn Minuten Verspätung."),
        m("Kemal", "Oh nein! Ich fahre nach Hamburg."),
        f("Petra", "Kein Problem, wir haben Zeit. Fährst du immer mit dem Zug?"),
        m("Kemal", "Ja, meistens. Zur Arbeit fahre ich aber mit dem Fahrrad."),
        f("Petra", "Ich fahre jeden Tag mit der U-Bahn."),
      ],
      questions: [
        q("Wohin fährt der Zug?", ["nach Hamburg", "nach Bremen", "nach Berlin"], 0),
        q("Wie viele Minuten Verspätung hat der Zug?", ["fünf", "zehn", "zwanzig"], 1),
        q("Wie fährt Kemal zur Arbeit?", ["mit dem Bus", "mit der U-Bahn", "mit dem Fahrrad"], 2),
      ],
    },
    speaking: [
      s("Wie fährst du zur Arbeit, zur Uni oder zum Kurs? Wie lange dauert das?", "¿Cómo vas al trabajo, a la universidad o al curso? ¿Cuánto tarda?", "How do you get to work, uni or class? How long does it take?"),
      s("Du bist am Fahrkartenschalter. Kauf eine Fahrkarte nach Köln.", "Estás en la taquilla. Compra un tiquete a Colonia.", "You're at the ticket office. Buy a ticket to Cologne."),
    ],
    writing: w(
      "Schreib eine Nachricht: Du kommst heute später, dein Zug hat Verspätung. Wann kommst du an? Wo soll man dich abholen?",
      "Escribe un mensaje: hoy llegas más tarde, tu tren tiene retraso. ¿A qué hora llegas? ¿Dónde te deben recoger?",
      "Write a message: you're late today because your train is delayed. When will you arrive, where should someone pick you up?",
      ["Hallo …, mein Zug hat … Minuten Verspätung.", "Ich komme um … an.", "Kannst du mich am … abholen?"],
      20,
      "Hallo Mama, mein Zug hat leider dreißig Minuten Verspätung. Ich komme erst um 18:40 Uhr in Leipzig an. Kannst du mich bitte am Hauptbahnhof abholen? Danke! Kuss, Elena",
    ),
  },
  10: {
    listening: {
      title: "Mein Tag",
      lines: [
        m("Julián", "Ich stehe jeden Tag um sechs Uhr auf."),
        f("Lena", "So früh? Ich wache um acht auf!"),
        m("Julián", "Ich fange um sieben mit der Arbeit an. Am Nachmittag kaufe ich ein und am Abend sehe ich fern."),
        f("Lena", "Und am Wochenende?"),
        m("Julián", "Da räume ich meine Wohnung auf und rufe meine Familie in Kolumbien an."),
      ],
      questions: [
        q("Wann steht Julián auf?", ["um sechs Uhr", "um sieben Uhr", "um acht Uhr"], 0),
        q("Was macht er am Abend?", ["Er kauft ein.", "Er sieht fern.", "Er räumt auf."], 1),
        q("Wen ruft er am Wochenende an?", ["seine Chefin", "seine Familie", "Lena"], 1),
      ],
    },
    speaking: [
      s("Erzähl deinen Tag: Wann stehst du auf? Wann fängst du an? Was machst du am Abend?", "Cuenta tu día: ¿a qué hora te levantas?, ¿cuándo empiezas?, ¿qué haces en la noche?", "Describe your day: when do you get up, when do you start, what do you do in the evening?"),
      s("Was räumst du gern auf und was räumst du nicht gern auf?", "¿Qué te gusta ordenar y qué no?", "What do you like and dislike tidying?"),
    ],
    writing: w(
      "Beschreib deinen Sonntag. Benutze mindestens drei trennbare Verben (aufstehen, einkaufen, anrufen, fernsehen …).",
      "Describe tu domingo. Usa al menos tres verbos separables (aufstehen, einkaufen, anrufen, fernsehen…).",
      "Describe your Sunday. Use at least three separable verbs (aufstehen, einkaufen, anrufen, fernsehen…).",
      ["Am Sonntag stehe ich um … auf.", "Dann rufe ich … an.", "Am Abend sehe ich …"],
      25,
      "Am Sonntag stehe ich erst um zehn Uhr auf. Ich frühstücke lange mit meinem Freund. Am Nachmittag rufe ich meine Eltern an. Dann räume ich die Küche auf. Am Abend sehe ich einen Film fern.",
    ),
  },
  11: {
    listening: {
      title: "Wem gehört das?",
      lines: [
        f("Frau Becker", "Ist das deine Jacke, Lukas?"),
        m("Lukas", "Nein, meine Jacke ist blau. Das ist die Jacke von Emma."),
        f("Frau Becker", "Und die Schuhe? Sind das eure Schuhe, Emma und Ben?"),
        f("Emma", "Ja, das sind unsere Sportschuhe. Danke!"),
      ],
      questions: [
        q("Welche Farbe hat Lukas' Jacke?", ["rot", "blau", "schwarz"], 1),
        q("Wem gehört die Jacke?", ["Lukas", "Emma", "Frau Becker"], 1),
        q("Was sind die Schuhe?", ["Sportschuhe", "Hausschuhe", "Winterschuhe"], 0),
      ],
    },
    speaking: [
      s("Beschreib deine Familie mit mein/meine: Wer ist das? Wie ist sie/er?", "Describe a tu familia con mein/meine: ¿quién es?, ¿cómo es?", "Describe your family with mein/meine: who is it, what are they like?"),
      s("Was ist in deiner Tasche? Sag: Das ist mein …", "¿Qué hay en tu bolso? Di: Das ist mein…", "What's in your bag? Say: Das ist mein…"),
    ],
    writing: w(
      "Schreib über deine Wohnung oder dein Zimmer: Was ist dein Lieblingsding? Was gehört deinem Mitbewohner oder deiner Familie?",
      "Escribe sobre tu casa o tu cuarto: ¿cuál es tu cosa favorita?, ¿qué es de tu compañero de casa o de tu familia?",
      "Write about your flat or room: what's your favourite thing, what belongs to your flatmate or family?",
      ["Mein Lieblingsding ist …", "Das ist das Fahrrad von meinem …", "Unsere Küche ist …"],
      25,
      "Mein Lieblingsding ist mein Sofa. Es ist grün und sehr bequem. Ich wohne mit meiner Schwester. Ihre Bücher sind überall! Unsere Küche ist klein, aber unser Balkon ist groß.",
    ),
  },
  12: {
    listening: {
      title: "Im Büro",
      lines: [
        f("Frau Krüger", "Herr Ramírez, können Sie mir bitte helfen? Der Drucker geht nicht."),
        m("Herr Ramírez", "Ja, gern. Ich sehe ihn mir an."),
        f("Frau Krüger", "Danke! Und rufen Sie mich bitte an, wenn er wieder funktioniert."),
        m("Herr Ramírez", "Natürlich. Ich rufe Sie in zehn Minuten an."),
      ],
      questions: [
        q("Was funktioniert nicht?", ["der Computer", "der Drucker", "das Telefon"], 1),
        q("Wer hilft?", ["Herr Ramírez", "Frau Krüger", "die Chefin"], 0),
        q("Wann ruft er an?", ["in fünf Minuten", "in zehn Minuten", "morgen"], 1),
      ],
    },
    speaking: [
      s("Was machst du bei der Arbeit oder im Studium jeden Tag?", "¿Qué haces cada día en el trabajo o en los estudios?", "What do you do every day at work or in your studies?"),
      s("Bitte eine Kollegin um Hilfe. Benutze „Kannst du mir …?“ oder „Können Sie mir …?“.", "Pídele ayuda a una compañera. Usa «Kannst du mir…?» o «Können Sie mir…?».", "Ask a colleague for help. Use “Kannst du mir…?” or “Können Sie mir…?”."),
    ],
    writing: w(
      "Schreib einer Kollegin: Du brauchst Hilfe. Was ist das Problem? Wann hat sie Zeit?",
      "Escríbele a una compañera de trabajo: necesitas ayuda. ¿Cuál es el problema? ¿Cuándo tiene tiempo?",
      "Write to a colleague: you need help. What's the problem, when does she have time?",
      ["Hallo …,", "kannst du mir bitte helfen?", "Mein Computer …", "Hast du heute Zeit? Danke dir!"],
      20,
      "Hallo Sabine,\nkannst du mir bitte helfen? Ich verstehe das neue Programm nicht. Hast du heute nach der Mittagspause Zeit? Ich rufe dich um 14 Uhr an. Danke dir!\nPaul",
    ),
  },
  13: {
    listening: {
      title: "Eine Einladung",
      lines: [
        f("Marie", "Hallo Jonas! Ich habe am zwölften Mai Geburtstag. Ich mache eine Party."),
        m("Jonas", "Toll! Wann beginnt die Party?"),
        f("Marie", "Am Samstag um acht Uhr abends, bei mir zu Hause."),
        m("Jonas", "Soll ich etwas mitbringen?"),
        f("Marie", "Ja, vielleicht einen Salat. Getränke habe ich schon."),
      ],
      questions: [
        q("Wann hat Marie Geburtstag?", ["am zweiten Mai", "am zwölften Mai", "am zwanzigsten Mai"], 1),
        q("Wo ist die Party?", ["in einem Restaurant", "bei Marie zu Hause", "im Park"], 1),
        q("Was soll Jonas mitbringen?", ["Getränke", "einen Kuchen", "einen Salat"], 2),
      ],
    },
    speaking: [
      s("Wann hast du Geburtstag und wie feierst du?", "¿Cuándo es tu cumpleaños y cómo lo celebras?", "When is your birthday and how do you celebrate?"),
      s("Welches Fest feierst du gern? Erzähl ein bisschen.", "¿Qué fiesta te gusta celebrar? Cuenta un poco.", "Which festival do you like to celebrate? Tell us a bit."),
    ],
    writing: w(
      "Schreib eine Einladung zu deiner Party: Was feierst du? Wann (Datum, Uhrzeit)? Wo? Was sollen die Gäste mitbringen?",
      "Escribe una invitación a tu fiesta: ¿qué celebras?, ¿cuándo (fecha, hora)?, ¿dónde?, ¿qué deben traer los invitados?",
      "Write an invitation to your party: what are you celebrating, when (date, time), where, what should guests bring?",
      ["Liebe Freunde,", "am … feiere ich …", "Die Party beginnt um …", "Bringt bitte … mit!"],
      30,
      "Liebe Freunde,\nam Samstag, dem einundzwanzigsten Juni, feiere ich meinen dreißigsten Geburtstag. Die Party beginnt um 19 Uhr in meinem Garten. Es gibt Musik und ein Grillbuffet. Bringt bitte gute Laune und etwas zu trinken mit!\nEure Lola",
    ),
  },
  14: {
    listening: {
      title: "Was hast du gemacht?",
      lines: [
        m("Diego", "Hallo Julia! Wie war dein Wochenende?"),
        f("Julia", "Sehr schön! Am Samstag habe ich meine Freundin besucht. Wir haben zusammen gekocht."),
        m("Diego", "Was habt ihr gekocht?"),
        f("Julia", "Eine Gemüsesuppe. Und am Sonntag habe ich viel gelesen. Und du?"),
        m("Diego", "Ich habe gearbeitet. Leider!"),
      ],
      questions: [
        q("Wen hat Julia am Samstag besucht?", ["ihre Mutter", "ihre Freundin", "ihren Bruder"], 1),
        q("Was haben sie gekocht?", ["Pasta", "eine Gemüsesuppe", "Pfannkuchen"], 1),
        q("Was hat Diego gemacht?", ["Er hat gearbeitet.", "Er hat gelesen.", "Er hat gekocht."], 0),
      ],
    },
    speaking: [
      s("Was hast du gestern gemacht? Erzähl drei Dinge.", "¿Qué hiciste ayer? Cuenta tres cosas.", "What did you do yesterday? Tell three things."),
      s("Was hast du heute schon gegessen und getrunken?", "¿Qué has comido y bebido hoy?", "What have you eaten and drunk today?"),
    ],
    writing: w(
      "Schreib einer Freundin über dein Wochenende im Perfekt: Was hast du gemacht? Mit wem?",
      "Escríbele a una amiga sobre tu fin de semana en Perfekt: ¿qué hiciste?, ¿con quién?",
      "Write to a friend about your weekend in the Perfekt: what did you do and with whom?",
      ["Am Samstag habe ich …", "Wir haben … gekauft / gespielt / gekocht.", "Am Sonntag habe ich …"],
      30,
      "Liebe Anna,\nmein Wochenende war super! Am Samstag habe ich lange geschlafen. Dann habe ich mit meinem Bruder Fußball gespielt. Am Abend haben wir Pizza gemacht. Am Sonntag habe ich für die Prüfung gelernt.\nViele Grüße\nTomás",
    ),
  },
  15: {
    listening: {
      title: "Eine Reise nach Dresden",
      lines: [
        f("Sandra", "Wo warst du letzte Woche, Andrés?"),
        m("Andrés", "Ich war in Dresden. Ich bin mit dem Zug gefahren."),
        f("Sandra", "Und wie war es?"),
        m("Andrés", "Toll! Ich bin viel spazieren gegangen und ich bin ins Museum gegangen."),
        f("Sandra", "Hattest du gutes Wetter?"),
        m("Andrés", "Ja, aber am Sonntag hat es geregnet. Da bin ich im Hotel geblieben."),
      ],
      questions: [
        q("Wie ist Andrés nach Dresden gefahren?", ["mit dem Auto", "mit dem Zug", "mit dem Bus"], 1),
        q("Wohin ist er gegangen?", ["ins Kino", "ins Museum", "ins Konzert"], 1),
        q("Was hat er am Sonntag gemacht?", ["Er ist im Hotel geblieben.", "Er ist spazieren gegangen.", "Er ist nach Hause gefahren."], 0),
      ],
    },
    speaking: [
      s("Wo warst du letztes Jahr im Urlaub? Wie bist du gefahren?", "¿Dónde estuviste de vacaciones el año pasado? ¿Cómo viajaste?", "Where were you on holiday last year? How did you travel?"),
      s("Wann bist du heute aufgestanden und wohin bist du gegangen?", "¿A qué hora te levantaste hoy y a dónde fuiste?", "When did you get up today and where did you go?"),
    ],
    writing: w(
      "Schreib über eine Reise: Wohin bist du gefahren? Wie war das Wetter? Was hast du gemacht?",
      "Escribe sobre un viaje: ¿a dónde fuiste?, ¿cómo estuvo el clima?, ¿qué hiciste?",
      "Write about a trip: where did you go, what was the weather like, what did you do?",
      ["Im … bin ich nach … gefahren.", "Das Wetter war …", "Ich bin … gegangen und habe … gesehen."],
      30,
      "Im Dezember bin ich nach Cartagena geflogen. Das Wetter war sehr heiß und sonnig. Ich bin jeden Tag an den Strand gegangen. Am Abend habe ich frischen Fisch gegessen. Ich hatte eine tolle Zeit!",
    ),
  },
  16: {
    listening: {
      title: "Urlaubspläne",
      lines: [
        m("Max", "Wohin fährst du im Sommer, Elena?"),
        f("Elena", "Ich fahre ans Meer, nach Portugal. Und du?"),
        m("Max", "Ich fahre in die Berge. Ich wandere gern."),
        f("Elena", "Schön! Wo schläfst du?"),
        m("Max", "In einer Pension. Das ist nicht so teuer."),
      ],
      questions: [
        q("Wohin fährt Elena?", ["in die Berge", "ans Meer", "an einen See"], 1),
        q("Was macht Max gern?", ["schwimmen", "wandern", "Ski fahren"], 1),
        q("Wo schläft Max?", ["im Hotel", "im Zelt", "in einer Pension"], 2),
      ],
    },
    speaking: [
      s("Wohin fährst du gern im Urlaub: ans Meer, in die Berge oder in eine Stadt? Warum?", "¿A dónde te gusta ir de vacaciones: al mar, a la montaña o a una ciudad? ¿Por qué?", "Where do you like to go on holiday: the sea, the mountains or a city? Why?"),
      s("Was packst du für eine Reise in den Koffer?", "¿Qué empacas en la maleta para un viaje?", "What do you pack in your suitcase for a trip?"),
    ],
    writing: w(
      "Schreib eine Postkarte aus dem Urlaub: Wo bist du? Wie ist das Wetter? Was machst du jeden Tag?",
      "Escribe una postal desde tus vacaciones: ¿dónde estás?, ¿cómo está el clima?, ¿qué haces cada día?",
      "Write a holiday postcard: where are you, what's the weather like, what do you do each day?",
      ["Liebe …, viele Grüße aus …!", "Das Wetter ist …", "Jeden Tag …", "Bis bald!"],
      30,
      "Liebe Carla,\nviele Grüße aus Lissabon! Das Wetter ist super, es ist sonnig und warm. Jeden Tag gehe ich in der Altstadt spazieren und esse Pastéis de Nata. Gestern bin ich ans Meer gefahren. Bis bald!\nDeine Mira",
    ),
  },
  17: {
    listening: {
      title: "An der Rezeption",
      lines: [
        f("Rezeption", "Guten Abend! Kann ich Ihnen helfen?"),
        m("Herr Torres", "Guten Abend. Ich habe ein Einzelzimmer für zwei Nächte reserviert. Mein Name ist Torres."),
        f("Rezeption", "Ja, Herr Torres. Sie haben Zimmer 214 im zweiten Stock. Das Frühstück ist von sieben bis zehn Uhr."),
        m("Herr Torres", "Danke. Könnten Sie mich bitte morgen um sechs Uhr wecken?"),
        f("Rezeption", "Natürlich. Gute Nacht!"),
      ],
      questions: [
        q("Wie lange bleibt Herr Torres?", ["eine Nacht", "zwei Nächte", "eine Woche"], 1),
        q("Welche Zimmernummer hat er?", ["114", "204", "214"], 2),
        q("Was soll die Rezeption morgen machen?", ["ihm Frühstück bringen", "ihn um sechs Uhr wecken", "ein Taxi rufen"], 1),
      ],
    },
    speaking: [
      s("Du bist im Hotel. Das WLAN funktioniert nicht. Was sagst du an der Rezeption?", "Estás en el hotel. El wifi no funciona. ¿Qué dices en la recepción?", "You're at a hotel. The Wi-Fi doesn't work. What do you say at reception?"),
      s("Frag höflich: Wann gibt es Frühstück? Benutze „Könnten Sie …?“.", "Pregunta con cortesía: ¿a qué hora es el desayuno? Usa «Könnten Sie…?».", "Ask politely: when is breakfast? Use “Könnten Sie…?”."),
    ],
    writing: w(
      "Schreib eine formelle E-Mail an ein Hotel: Du möchtest ein Zimmer reservieren. Wann? Für wie viele Personen? Frag nach dem Preis.",
      "Escribe un correo formal a un hotel: quieres reservar una habitación. ¿Cuándo? ¿Para cuántas personas? Pregunta el precio.",
      "Write a formal email to a hotel: you want to book a room. When, for how many people? Ask about the price.",
      ["Sehr geehrte Damen und Herren,", "ich möchte vom … bis zum … ein … reservieren.", "Was kostet …?", "Mit freundlichen Grüßen"],
      30,
      "Sehr geehrte Damen und Herren,\nich möchte vom 3. bis zum 5. August ein Doppelzimmer reservieren. Wir sind zwei Personen. Was kostet das Zimmer pro Nacht mit Frühstück? Gibt es einen Parkplatz?\nMit freundlichen Grüßen\nValentina Ruiz",
    ),
  },
  18: {
    listening: {
      title: "Kochen mit Oma",
      lines: [
        f("Oma", "So, Kinder, wascht zuerst eure Hände!"),
        m("Jakob", "Okay, Oma! Und was machen wir jetzt?"),
        f("Oma", "Jakob, nimm die Eier und die Milch. Lea, gib mir bitte das Mehl."),
        f("Lea", "Hier, bitte!"),
        f("Oma", "Jetzt rührt alles gut. Und seid vorsichtig, die Pfanne ist heiß!"),
      ],
      questions: [
        q("Was sollen die Kinder zuerst machen?", ["die Hände waschen", "die Eier nehmen", "den Tisch decken"], 0),
        q("Was gibt Lea der Oma?", ["die Milch", "die Eier", "das Mehl"], 2),
        q("Was ist heiß?", ["der Ofen", "die Pfanne", "der Tee"], 1),
      ],
    },
    speaking: [
      s("Gib einem Freund drei Tipps für das Deutschlernen. Benutze den Imperativ (du).", "Dale a un amigo tres consejos para aprender alemán. Usa el imperativo (du).", "Give a friend three tips for learning German. Use the imperative (du)."),
      s("Erklär ein einfaches Rezept in drei Schritten.", "Explica una receta sencilla en tres pasos.", "Explain a simple recipe in three steps."),
    ],
    writing: w(
      "Schreib ein einfaches Rezept aus deinem Land. Benutze den Imperativ: Nimm …, schneide …, koch …",
      "Escribe una receta sencilla de tu país. Usa el imperativo: Nimm…, schneide…, koch…",
      "Write a simple recipe from your country. Use the imperative: Nimm…, schneide…, koch…",
      ["Du brauchst: …", "Nimm zuerst …", "Dann koch/back …", "Guten Appetit!"],
      30,
      "Arepas\nDu brauchst: Maismehl, Wasser, Salz und Käse.\nNimm zuerst eine Schüssel. Misch das Mehl mit Wasser und Salz. Mach kleine Kugeln und drück sie flach. Back die Arepas in der Pfanne. Iss sie warm mit Käse. Guten Appetit!",
    ),
  },
  19: {
    listening: {
      title: "Prüfung Hören: Eine Durchsage",
      lines: [
        f("Durchsage", "Liebe Kundinnen und Kunden, heute gibt es im Kaufhaus Krause alle Sportschuhe zwanzig Prozent billiger."),
        f("Durchsage", "Die Sportabteilung finden Sie im dritten Stock."),
        f("Durchsage", "Und bitte beachten Sie: Heute schließen wir schon um achtzehn Uhr."),
      ],
      questions: [
        q("Was ist heute billiger?", ["Sportschuhe", "Jacken", "Fahrräder"], 0),
        q("Wo ist die Sportabteilung?", ["im Erdgeschoss", "im zweiten Stock", "im dritten Stock"], 2),
        q("Wann schließt das Kaufhaus heute?", ["um 18 Uhr", "um 19 Uhr", "um 20 Uhr"], 0),
      ],
    },
    speaking: [
      s("Wie lernst du für die Prüfung? Was machst du jeden Tag?", "¿Cómo estudias para el examen? ¿Qué haces cada día?", "How do you study for the exam? What do you do each day?"),
      s("Was machst du, wenn du im Hören ein Wort nicht verstehst?", "¿Qué haces si en la prueba auditiva no entiendes una palabra?", "What do you do if you don't understand a word in the listening test?"),
    ],
    writing: w(
      "Schreib einer Freundin: Du hast nächste Woche die Prüfung. Wann ist sie? Wie lernst du? Frag: Kannst du mit mir üben?",
      "Escríbele a una amiga: la próxima semana tienes el examen. ¿Cuándo es? ¿Cómo estudias? Pregunta: ¿puedes practicar conmigo?",
      "Write to a friend: you have the exam next week. When is it, how are you studying? Ask: can you practise with me?",
      ["Liebe …,", "nächste Woche habe ich …", "Ich lerne jeden Tag …", "Kannst du …?"],
      30,
      "Liebe Hanna,\nnächsten Freitag habe ich die Prüfung Goethe-Zertifikat A1. Ich bin ein bisschen nervös! Ich lerne jeden Tag eine Stunde und höre deutsche Podcasts. Kannst du am Mittwoch mit mir Sprechen üben?\nViele Grüße\nCamila",
    ),
  },
  20: {
    listening: {
      title: "Prüfung Sprechen: Bitten",
      lines: [
        m("Prüfer", "Bitte nehmen Sie eine Karte und formulieren Sie eine Bitte."),
        f("Lucía", "Ich habe ein Bild mit einem Glas Wasser. Kofi, gib mir bitte ein Glas Wasser!"),
        m("Kofi", "Hier, bitte."),
        f("Lucía", "Danke schön!"),
        m("Kofi", "Auf meiner Karte ist ein Fenster. Lucía, mach bitte das Fenster auf!"),
        f("Lucía", "Ja, gern."),
      ],
      questions: [
        q("Was ist auf Lucías Karte?", ["ein Glas Wasser", "ein Fenster", "ein Buch"], 0),
        q("Was sagt Kofi, wenn er das Glas gibt?", ["Danke schön!", "Hier, bitte.", "Ja, gern."], 1),
        q("Was soll Lucía machen?", ["das Fenster aufmachen", "das Fenster zumachen", "das Licht anmachen"], 0),
      ],
    },
    speaking: [
      s("Stell dich vor wie in der Prüfung: Name, Alter, Land, Wohnort, Sprachen, Beruf, Hobby.", "Preséntate como en el examen: nombre, edad, país, ciudad, idiomas, profesión, pasatiempo.", "Introduce yourself as in the exam: name, age, country, home, languages, job, hobby."),
      s("Thema „Freizeit“, Wortkarte „Wochenende“: Stell eine Frage und beantworte sie.", "Tema «tiempo libre», tarjeta «fin de semana»: haz una pregunta y respóndela.", "Topic “free time”, card “weekend”: ask a question and answer it."),
    ],
    writing: w(
      "Schreiben Teil 2: Ihr Freund Jan hat am Samstag Geburtstag, aber Sie können nicht kommen. Schreiben Sie: Gratulieren Sie. Warum kommen Sie nicht? Machen Sie einen neuen Vorschlag.",
      "Escritura parte 2: tu amigo Jan cumple años el sábado, pero no puedes ir. Escribe: felicítalo, ¿por qué no vas?, propón otro plan.",
      "Writing part 2: your friend Jan's birthday is on Saturday but you can't come. Write: congratulate him, why can't you come, suggest something else.",
      ["Lieber Jan,", "herzlichen Glückwunsch zum Geburtstag!", "Leider kann ich nicht kommen, ich …", "Gehen wir am … zusammen …?", "Viele Grüße"],
      30,
      "Lieber Jan,\nherzlichen Glückwunsch zum Geburtstag! Leider kann ich am Samstag nicht kommen. Ich besuche meine Eltern in Bonn. Gehen wir am Montag zusammen essen? Ich lade dich ein!\nViele Grüße\nKofi",
    ),
  },
};
