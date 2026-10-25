import type { Tr, Voice } from "../types";

/**
 * Geschichten: historias cortas y divertidas por nivel.
 * Escritas con la gramática del A1.1 (presente, haben/sein, Akkusativ, möchten).
 * Narradora = voz "f"; los personajes usan la voz indicada en `voices`.
 */
export type StoryLine = { de: string; tr: Tr; who?: string };
export type StoryScene = { emoji: string; lines: StoryLine[] };
export type Story = {
  id: string;
  title: string;
  titleTr: Tr;
  level: "A1.1";
  theme: string;
  emoji: string;
  color: string;
  minutes: number;
  teaser: { de: string; tr: Tr };
  voices: Record<string, Voice>;
  scenes: StoryScene[];
  quiz: { q: { de: string; tr: Tr }; options: string[]; answer: number }[];
  /** Palabras nuevas de la historia: [de, es, en, artículo?] */
  glossary: [string, string, string, ("der" | "die" | "das")?][];
};

const L = (de: string, es: string, en: string, who?: string): StoryLine => (who ? { de, tr: { es, en }, who } : { de, tr: { es, en } });
const Q = (de: string, es: string, en: string, options: string[], answer: number) => ({ q: { de, tr: { es, en } }, options, answer });

export const STORIES: Story[] = [
  {
    id: "kaffee-dieb",
    title: "Der Kaffee-Dieb",
    titleTr: { es: "El ladrón de café", en: "The coffee thief" },
    level: "A1.1",
    theme: "essen",
    emoji: "☕",
    color: "#f4e1cf",
    minutes: 3,
    teaser: { de: "Jeden Morgen ist der Kaffee von Herrn Becker weg. Wer trinkt ihn?", tr: { es: "Cada mañana desaparece el café del señor Becker. ¿Quién se lo toma?", en: "Every morning Mr Becker's coffee is gone. Who drinks it?" } },
    voices: { "Herr Becker": "m", "Frau Yilmaz": "f", "Frau König": "f" },
    scenes: [
      {
        emoji: "☕",
        lines: [
          L("Das ist Herr Becker. Er ist 52 Jahre alt und arbeitet in einem Büro in Köln.", "Este es el señor Becker. Tiene 52 años y trabaja en una oficina en Colonia.", "This is Mr Becker. He is 52 and works in an office in Cologne."),
          L("Jeden Morgen um acht Uhr macht er einen Kaffee. Mit viel Milch, ohne Zucker.", "Cada mañana a las ocho se prepara un café. Con mucha leche, sin azúcar.", "Every morning at eight he makes a coffee. With lots of milk, no sugar."),
          L("Er stellt die Tasse auf den Tisch und holt die Zeitung.", "Pone la taza en la mesa y va por el periódico.", "He puts the cup on the table and gets the newspaper."),
          L("Aber am Montag ist die Tasse leer! Der Kaffee ist weg.", "¡Pero el lunes la taza está vacía! El café desapareció.", "But on Monday the cup is empty! The coffee is gone."),
        ],
      },
      {
        emoji: "🕵️",
        lines: [
          L("Am Dienstag ist die Tasse wieder leer. Am Mittwoch auch.", "El martes la taza está vacía otra vez. El miércoles también.", "On Tuesday the cup is empty again. On Wednesday too."),
          L("Wer trinkt meinen Kaffee?!", "¡¿Quién se toma mi café?!", "Who is drinking my coffee?!", "Herr Becker"),
          L("Er fragt seine Kollegin Frau Yilmaz.", "Le pregunta a su colega, la señora Yilmaz.", "He asks his colleague Ms Yilmaz."),
          L("Ich? Nein! Ich trinke nur Tee.", "¿Yo? ¡No! Yo solo tomo té.", "Me? No! I only drink tea.", "Frau Yilmaz"),
        ],
      },
      {
        emoji: "📷",
        lines: [
          L("Am Donnerstag hat Herr Becker eine Idee. Er stellt eine kleine Kamera ins Regal.", "El jueves el señor Becker tiene una idea. Pone una pequeña cámara en la estantería.", "On Thursday Mr Becker has an idea. He puts a small camera on the shelf."),
          L("Um acht Uhr zehn kommt der Dieb. Er hat eine Brille und rote Schuhe.", "A las ocho y diez llega el ladrón. Tiene gafas y zapatos rojos.", "At ten past eight the thief arrives. They wear glasses and red shoes."),
          L("Herr Becker sieht das Video und ist sehr überrascht.", "El señor Becker ve el video y está muy sorprendido.", "Mr Becker watches the video and is very surprised."),
        ],
      },
      {
        emoji: "👠",
        lines: [
          L("Es ist die Chefin, Frau König!", "¡Es la jefa, la señora König!", "It's the boss, Ms König!"),
          L("Entschuldigung, Herr Becker! Ihr Kaffee ist so gut. Mein Kaffee ist schrecklich.", "¡Perdón, señor Becker! Su café es tan rico. El mío es horrible.", "Sorry, Mr Becker! Your coffee is so good. Mine is terrible.", "Frau König"),
          L("Herr Becker lacht.", "El señor Becker se ríe.", "Mr Becker laughs."),
          L("Jetzt macht er jeden Morgen zwei Kaffees: einen für sich und einen für die Chefin.", "Ahora cada mañana prepara dos cafés: uno para él y otro para la jefa.", "Now every morning he makes two coffees: one for himself and one for the boss."),
        ],
      },
    ],
    quiz: [
      Q("Was trinkt Herr Becker am Morgen?", "¿Qué toma el señor Becker en la mañana?", "What does Mr Becker drink in the morning?", ["Tee", "Kaffee mit Milch", "Wasser"], 1),
      Q("Was trinkt Frau Yilmaz?", "¿Qué toma la señora Yilmaz?", "What does Ms Yilmaz drink?", ["Kaffee", "Saft", "Tee"], 2),
      Q("Wer ist der Kaffee-Dieb?", "¿Quién es el ladrón de café?", "Who is the coffee thief?", ["die Katze", "Frau Yilmaz", "die Chefin"], 2),
      Q("Was macht Herr Becker jetzt jeden Morgen?", "¿Qué hace ahora el señor Becker cada mañana?", "What does Mr Becker do every morning now?", ["zwei Kaffees", "keinen Kaffee", "einen Tee"], 0),
    ],
    glossary: [
      ["Dieb", "ladrón", "thief", "der"],
      ["Büro", "oficina", "office", "das"],
      ["Zucker", "azúcar", "sugar", "der"],
      ["holt", "trae / va por", "fetches"],
      ["leer", "vacío", "empty"],
      ["weg", "desaparecido / ya no está", "gone"],
      ["Kollegin", "colega", "colleague (f.)", "die"],
      ["Idee", "idea", "idea", "die"],
      ["Regal", "estantería", "shelf", "das"],
      ["Brille", "gafas", "glasses", "die"],
      ["überrascht", "sorprendido", "surprised"],
      ["Chefin", "jefa", "boss (f.)", "die"],
      ["schrecklich", "horrible", "terrible"],
      ["lacht", "se ríe", "laughs"],
      ["sich", "sí mismo / él", "himself"],
      ["stellt", "pone (de pie)", "puts"],
      ["sieht", "ve", "sees"],
    ],
  },
  {
    id: "oma-hilde",
    title: "Oma Hilde und das Handy",
    titleTr: { es: "La abuela Hilde y el celular", en: "Grandma Hilde and the phone" },
    level: "A1.1",
    theme: "familie",
    emoji: "👵",
    color: "#f3dfe0",
    minutes: 3,
    teaser: { de: "Oma Hilde hat ein neues Handy. Am Anfang sieht Leo nur ihre Nase …", tr: { es: "La abuela Hilde tiene un celular nuevo. Al principio Leo solo le ve la nariz…", en: "Grandma Hilde has a new phone. At first Leo only sees her nose…" } },
    voices: { Leo: "m", "Oma Hilde": "f" },
    scenes: [
      {
        emoji: "👵",
        lines: [
          L("Oma Hilde ist 78 Jahre alt. Sie wohnt allein in einem kleinen Haus in Bayern.", "La abuela Hilde tiene 78 años. Vive sola en una casita en Baviera.", "Grandma Hilde is 78. She lives alone in a small house in Bavaria."),
          L("Sie hat ein neues Handy. Es ist ein Geschenk von ihrem Enkel Leo.", "Tiene un celular nuevo. Es un regalo de su nieto Leo.", "She has a new phone. It's a present from her grandson Leo."),
          L("Aber Oma Hilde versteht das Handy nicht. Es hat so viele Knöpfe!", "Pero la abuela Hilde no entiende el celular. ¡Tiene tantos botones!", "But Grandma Hilde doesn't understand the phone. It has so many buttons!"),
        ],
      },
      {
        emoji: "📱",
        lines: [
          L("Am Abend ruft Leo an. Es ist ein Videoanruf.", "En la noche Leo la llama. Es una videollamada.", "In the evening Leo calls. It's a video call."),
          L("Hallo Oma! Wie geht's?", "¡Hola, abuela! ¿Cómo estás?", "Hi Grandma! How are you?", "Leo"),
          L("Hallo? Hallo? Leo, wo bist du? Ich sehe nichts!", "¿Aló? ¿Aló? Leo, ¿dónde estás? ¡No veo nada!", "Hello? Hello? Leo, where are you? I can't see anything!", "Oma Hilde"),
          L("Leo sieht nur eine große Nase. Er lacht und lacht.", "Leo solo ve una nariz grande. Se ríe y se ríe.", "Leo only sees a big nose. He laughs and laughs."),
        ],
      },
      {
        emoji: "📚",
        lines: [
          L("Am Samstag kommt Leo. Er erklärt alles: die Kamera, die Fotos, die Nachrichten.", "El sábado viene Leo. Le explica todo: la cámara, las fotos, los mensajes.", "On Saturday Leo comes. He explains everything: the camera, the photos, the messages."),
          L("Oma Hilde lernt sehr schnell. Sie ist neugierig und hat viel Zeit.", "La abuela Hilde aprende muy rápido. Es curiosa y tiene mucho tiempo.", "Grandma Hilde learns very fast. She's curious and has lots of time."),
          L("Am Sonntag macht sie ihr erstes Video: Oma Hilde kocht Kartoffelsuppe.", "El domingo hace su primer video: la abuela Hilde cocina sopa de papa.", "On Sunday she makes her first video: Grandma Hilde cooks potato soup."),
        ],
      },
      {
        emoji: "🎉",
        lines: [
          L("Zwei Wochen später hat Oma Hilde 5000 Follower.", "Dos semanas después la abuela Hilde tiene 5000 seguidores.", "Two weeks later Grandma Hilde has 5,000 followers."),
          L("Leo hat nur 30 Follower. Er ruft die Oma an.", "Leo solo tiene 30 seguidores. Llama a su abuela.", "Leo only has 30 followers. He calls his grandma."),
          L("Oma, wie machst du das?", "Abuela, ¿cómo lo haces?", "Grandma, how do you do it?", "Leo"),
          L("Ganz einfach, Leo: gute Suppe und viel Liebe!", "Muy fácil, Leo: ¡buena sopa y mucho amor!", "Easy, Leo: good soup and lots of love!", "Oma Hilde"),
        ],
      },
    ],
    quiz: [
      Q("Wie alt ist Oma Hilde?", "¿Cuántos años tiene la abuela Hilde?", "How old is Grandma Hilde?", ["68", "78", "87"], 1),
      Q("Was sieht Leo im Videoanruf?", "¿Qué ve Leo en la videollamada?", "What does Leo see in the video call?", ["eine Nase", "eine Katze", "ein Haus"], 0),
      Q("Wann kommt Leo?", "¿Cuándo viene Leo?", "When does Leo come?", ["am Montag", "am Samstag", "im Mai"], 1),
      Q("Was kocht Oma Hilde im Video?", "¿Qué cocina la abuela Hilde en el video?", "What does Grandma Hilde cook in the video?", ["Pizza", "Fisch", "Kartoffelsuppe"], 2),
    ],
    glossary: [
      ["Oma", "abuela", "grandma", "die"],
      ["allein", "solo / sola", "alone"],
      ["Bayern", "Baviera", "Bavaria"],
      ["Geschenk", "regalo", "present", "das"],
      ["Enkel", "nieto", "grandson", "der"],
      ["Knöpfe", "botones", "buttons"],
      ["ruft", "llama", "calls"],
      ["Videoanruf", "videollamada", "video call", "der"],
      ["nichts", "nada", "nothing"],
      ["Nase", "nariz", "nose", "die"],
      ["erklärt", "explica", "explains"],
      ["alles", "todo", "everything"],
      ["Nachrichten", "mensajes", "messages"],
      ["schnell", "rápido", "fast"],
      ["neugierig", "curiosa", "curious"],
      ["erstes", "primer", "first"],
      ["Kartoffelsuppe", "sopa de papa", "potato soup", "die"],
      ["später", "después", "later"],
      ["Follower", "seguidores", "followers"],
      ["einfach", "fácil / sencillo", "easy"],
      ["Liebe", "amor", "love", "die"],
      ["Suppe", "sopa", "soup", "die"],
    ],
  },
  {
    id: "zimmer-12",
    title: "Das Geheimnis von Zimmer 12",
    titleTr: { es: "El misterio de la habitación 12", en: "The secret of room 12" },
    level: "A1.1",
    theme: "wohnung",
    emoji: "🚪",
    color: "#e3e8dc",
    minutes: 3,
    teaser: { de: "Jede Nacht um drei Uhr sagt eine Stimme: „Guten Morgen!“ Aber wer?", tr: { es: "Cada noche a las tres una voz dice: «¡Buenos días!» ¿Pero quién?", en: "Every night at three a voice says “Good morning!” But who?" } },
    voices: { Ana: "f", "Herr Petrov": "m", Kiki: "m", Stimme: "m" },
    scenes: [
      {
        emoji: "🏠",
        lines: [
          L("Ana kommt aus Chile. Sie macht einen Deutschkurs in Freiburg.", "Ana es de Chile. Hace un curso de alemán en Friburgo.", "Ana is from Chile. She is doing a German course in Freiburg."),
          L("Sie wohnt in Zimmer 11. Das Zimmer ist klein, aber hell und ruhig.", "Vive en la habitación 11. Es pequeña, pero clara y tranquila.", "She lives in room 11. The room is small but bright and quiet."),
          L("Ruhig? Ja … am Tag.", "¿Tranquila? Sí… de día.", "Quiet? Yes… during the day."),
        ],
      },
      {
        emoji: "🌙",
        lines: [
          L("Jede Nacht um drei Uhr hört Ana eine Stimme aus Zimmer 12.", "Cada noche a las tres Ana oye una voz que sale de la habitación 12.", "Every night at three Ana hears a voice from room 12."),
          L("Guten Morgen! Guten Morgen! Wie geht's?", "¡Buenos días! ¡Buenos días! ¿Cómo estás?", "Good morning! Good morning! How are you?", "Stimme"),
          L("Aber es ist Nacht, nicht Morgen! Ana ist müde. Sie schläft nicht gut.", "¡Pero es de noche, no de mañana! Ana está cansada. No duerme bien.", "But it's night, not morning! Ana is tired. She doesn't sleep well."),
        ],
      },
      {
        emoji: "✊",
        lines: [
          L("Am Freitag klopft Ana an die Tür von Zimmer 12.", "El viernes Ana toca la puerta de la habitación 12.", "On Friday Ana knocks on the door of room 12."),
          L("Ein alter Mann öffnet. Er heißt Herr Petrov und kommt aus Bulgarien.", "Un señor mayor abre. Se llama señor Petrov y es de Bulgaria.", "An old man opens. His name is Mr Petrov and he's from Bulgaria."),
          L("Entschuldigung! Wer spricht hier jede Nacht?", "¡Disculpe! ¿Quién habla aquí cada noche?", "Excuse me! Who talks here every night?", "Ana"),
          L("Ach so … Kommen Sie rein!", "Ah, ya… ¡Siga, por favor!", "Oh, I see… Come in!", "Herr Petrov"),
        ],
      },
      {
        emoji: "🦜",
        lines: [
          L("Im Zimmer ist ein großer, grüner Papagei. Er heißt Kiki.", "En la habitación hay un loro grande y verde. Se llama Kiki.", "In the room there's a big green parrot. His name is Kiki."),
          L("Kiki lernt Deutsch – wie Ana! Aber er hat keine Uhr.", "¡Kiki aprende alemán, como Ana! Pero no tiene reloj.", "Kiki is learning German – like Ana! But he has no clock."),
          L("Guten Morgen! Wie geht's?", "¡Buenos días! ¿Cómo estás?", "Good morning! How are you?", "Kiki"),
          L("Ana lacht. Jetzt üben Ana und Kiki zusammen Deutsch. Aber nur am Tag!", "Ana se ríe. Ahora Ana y Kiki practican alemán juntos. ¡Pero solo de día!", "Ana laughs. Now Ana and Kiki practise German together. But only during the day!"),
        ],
      },
    ],
    quiz: [
      Q("Woher kommt Ana?", "¿De dónde es Ana?", "Where is Ana from?", ["aus Chile", "aus Peru", "aus Spanien"], 0),
      Q("Wann hört Ana die Stimme?", "¿Cuándo oye Ana la voz?", "When does Ana hear the voice?", ["um acht Uhr", "um drei Uhr in der Nacht", "am Mittag"], 1),
      Q("Wer spricht in Zimmer 12?", "¿Quién habla en la habitación 12?", "Who is talking in room 12?", ["ein Hund", "ein Student", "ein Papagei"], 2),
      Q("Was machen Ana und Kiki jetzt?", "¿Qué hacen ahora Ana y Kiki?", "What do Ana and Kiki do now?", ["Sie kochen.", "Sie üben Deutsch.", "Sie schlafen."], 1),
    ],
    glossary: [
      ["Geheimnis", "misterio / secreto", "secret", "das"],
      ["Freiburg", "Friburgo", "Freiburg"],
      ["Stimme", "voz", "voice", "die"],
      ["hört", "oye", "hears"],
      ["müde", "cansado", "tired"],
      ["schläft", "duerme", "sleeps"],
      ["klopft", "toca (la puerta)", "knocks"],
      ["alter", "viejo / mayor", "old"],
      ["öffnet", "abre", "opens"],
      ["Bulgarien", "Bulgaria", "Bulgaria"],
      ["Ach so", "ah, ya veo", "oh, I see"],
      ["rein", "adentro", "in"],
      ["Papagei", "loro", "parrot", "der"],
      ["grüner", "verde", "green"],
      ["großer", "grande", "big"],
      ["üben", "practicar", "to practise"],
      ["zusammen", "juntos", "together"],
    ],
  },
  {
    id: "falscher-bus",
    title: "Der falsche Bus",
    titleTr: { es: "El bus equivocado", en: "The wrong bus" },
    level: "A1.1",
    theme: "alltag",
    emoji: "🚌",
    color: "#f6ecc9",
    minutes: 3,
    teaser: { de: "Mateo nimmt den falschen Bus – und hat den besten Samstag seit Langem.", tr: { es: "Mateo toma el bus equivocado y tiene el mejor sábado en mucho tiempo.", en: "Mateo takes the wrong bus – and has his best Saturday in ages." } },
    voices: { Mateo: "m", Verkäuferin: "f" },
    scenes: [
      {
        emoji: "🚌",
        lines: [
          L("Es ist Samstag, neun Uhr. Mateo möchte ins Zentrum fahren.", "Es sábado, las nueve. Mateo quiere ir al centro.", "It's Saturday, nine o'clock. Mateo wants to go to the city centre."),
          L("Er nimmt schnell einen Bus. Er denkt: Das ist die Nummer 7.", "Toma rápido un bus. Piensa: es el número 7.", "He quickly takes a bus. He thinks: this is number 7."),
          L("Er hört Musik und schaut nicht aus dem Fenster.", "Escucha música y no mira por la ventana.", "He listens to music and doesn't look out of the window."),
        ],
      },
      {
        emoji: "🐄",
        lines: [
          L("Nach 40 Minuten schaut Mateo aus dem Fenster. Wo ist die Stadt?", "Después de 40 minutos Mateo mira por la ventana. ¿Dónde está la ciudad?", "After 40 minutes Mateo looks out of the window. Where is the city?"),
          L("Er sieht nur Kühe, Bäume und Felder.", "Solo ve vacas, árboles y campos.", "He only sees cows, trees and fields."),
          L("Oh nein! Das ist der Bus Nummer 17!", "¡Oh no! ¡Es el bus número 17!", "Oh no! This is bus number 17!", "Mateo"),
        ],
      },
      {
        emoji: "🧀",
        lines: [
          L("Mateo steigt aus. Hier ist ein kleines Dorf mit einem Markt.", "Mateo se baja. Aquí hay un pueblito con un mercado.", "Mateo gets off. Here there's a small village with a market."),
          L("Es gibt Käse, Brot, Honig und frische Erdbeeren.", "Hay queso, pan, miel y fresas frescas.", "There's cheese, bread, honey and fresh strawberries."),
          L("Möchten Sie probieren?", "¿Quiere probar?", "Would you like a taste?", "Verkäuferin"),
          L("Mmm! Der Käse ist fantastisch!", "¡Mmm! ¡El queso está buenísimo!", "Mmm! The cheese is fantastic!", "Mateo"),
        ],
      },
      {
        emoji: "☀️",
        lines: [
          L("Mateo kauft Käse, Brot und Erdbeeren. Er sitzt in der Sonne und isst.", "Mateo compra queso, pan y fresas. Se sienta al sol y come.", "Mateo buys cheese, bread and strawberries. He sits in the sun and eats."),
          L("Um 16 Uhr fährt er nach Hause – mit dem richtigen Bus.", "A las 16 vuelve a casa, en el bus correcto.", "At 4 pm he goes home – on the right bus."),
          L("Und jetzt? Jetzt fährt Mateo jeden Samstag mit dem Bus Nummer 17. Absichtlich!", "¿Y ahora? Ahora Mateo toma cada sábado el bus número 17. ¡A propósito!", "And now? Now Mateo takes bus number 17 every Saturday. On purpose!"),
        ],
      },
    ],
    quiz: [
      Q("Wohin möchte Mateo fahren?", "¿Adónde quiere ir Mateo?", "Where does Mateo want to go?", ["ins Zentrum", "zum Markt", "nach Hause"], 0),
      Q("Welcher Bus ist es wirklich?", "¿Qué bus es en realidad?", "Which bus is it really?", ["die Nummer 7", "die Nummer 17", "die Nummer 71"], 1),
      Q("Was gibt es auf dem Markt?", "¿Qué hay en el mercado?", "What is there at the market?", ["Käse und Erdbeeren", "Schuhe und Hosen", "Bücher"], 0),
      Q("Was macht Mateo jetzt jeden Samstag?", "¿Qué hace Mateo ahora cada sábado?", "What does Mateo do every Saturday now?", ["Er bleibt zu Hause.", "Er fährt mit dem Bus 17.", "Er arbeitet."], 1),
    ],
    glossary: [
      ["falsche", "equivocado", "wrong"],
      ["Zentrum", "centro", "centre", "das"],
      ["denkt", "piensa", "thinks"],
      ["Nummer", "número", "number", "die"],
      ["schaut", "mira", "looks"],
      ["Fenster", "ventana", "window", "das"],
      ["Kühe", "vacas", "cows"],
      ["Bäume", "árboles", "trees"],
      ["Felder", "campos", "fields"],
      ["steigt aus", "se baja", "gets off"],
      ["steigt", "sube / baja (del bus)", "gets (off)"],
      ["Dorf", "pueblo", "village", "das"],
      ["Honig", "miel", "honey", "der"],
      ["frische", "frescas", "fresh"],
      ["probieren", "probar", "to taste"],
      ["fantastisch", "fantástico", "fantastic"],
      ["sitzt", "se sienta / está sentado", "sits"],
      ["richtigen", "correcto", "right"],
      ["absichtlich", "a propósito", "on purpose"],
    ],
  },
  {
    id: "opas-knie",
    title: "Opas Knie weiß alles",
    titleTr: { es: "La rodilla del abuelo lo sabe todo", en: "Grandpa's knee knows everything" },
    level: "A1.1",
    theme: "wetter",
    emoji: "🌦️",
    color: "#dde7ef",
    minutes: 2,
    teaser: { de: "Die App sagt: Sonne. Opas Knie sagt: Regen. Wer hat recht?", tr: { es: "La app dice: sol. La rodilla del abuelo dice: lluvia. ¿Quién tiene razón?", en: "The app says: sun. Grandpa's knee says: rain. Who's right?" } },
    voices: { Lisa: "f", "Opa Karl": "m" },
    scenes: [
      {
        emoji: "👴",
        lines: [
          L("Opa Karl ist 81 Jahre alt. Er sagt immer: Mein Knie kennt das Wetter!", "El abuelo Karl tiene 81 años. Siempre dice: ¡mi rodilla conoce el clima!", "Grandpa Karl is 81. He always says: my knee knows the weather!"),
          L("Tut das Knie weh? Dann regnet es bald.", "¿Le duele la rodilla? Entonces pronto lloverá.", "Does his knee hurt? Then it'll rain soon."),
        ],
      },
      {
        emoji: "📱",
        lines: [
          L("Am Sonntag macht die Familie ein Picknick im Park.", "El domingo la familia hace un pícnic en el parque.", "On Sunday the family has a picnic in the park."),
          L("Die App sagt: Sonne und 25 Grad. Super!", "La app dice: sol y 25 grados. ¡Súper!", "The app says: sun and 25 degrees. Great!", "Lisa"),
          L("Mein Knie sagt: Regen. Nehmt einen Regenschirm mit!", "Mi rodilla dice: lluvia. ¡Lleven un paraguas!", "My knee says: rain. Take an umbrella!", "Opa Karl"),
          L("Alle lachen. Nur Opa Karl nimmt einen Regenschirm mit.", "Todos se ríen. Solo el abuelo Karl lleva un paraguas.", "Everyone laughs. Only Grandpa Karl takes an umbrella."),
        ],
      },
      {
        emoji: "⛈️",
        lines: [
          L("Um zwei Uhr ist der Himmel grau. Dann kommt ein Gewitter!", "A las dos el cielo está gris. ¡Luego llega una tormenta!", "At two the sky is grey. Then a thunderstorm comes!"),
          L("Alle sind nass – nur Opa Karl nicht. Er sitzt unter seinem Regenschirm und isst Kuchen.", "Todos están mojados, menos el abuelo Karl. Está sentado bajo su paraguas comiendo torta.", "Everyone is wet – except Grandpa Karl. He sits under his umbrella eating cake."),
        ],
      },
      {
        emoji: "☂️",
        lines: [
          L("Jetzt fragt die Familie immer zuerst Opa Karl. Dann die App.", "Ahora la familia siempre le pregunta primero al abuelo Karl. Luego a la app.", "Now the family always asks Grandpa Karl first. Then the app."),
          L("Mein Knie ist besser als dein Handy!", "¡Mi rodilla es mejor que tu celular!", "My knee is better than your phone!", "Opa Karl"),
        ],
      },
    ],
    quiz: [
      Q("Was sagt die App?", "¿Qué dice la app?", "What does the app say?", ["Regen", "Sonne", "Schnee"], 1),
      Q("Was sagt Opas Knie?", "¿Qué dice la rodilla del abuelo?", "What does Grandpa's knee say?", ["Sonne", "Wind", "Regen"], 2),
      Q("Wer ist nicht nass?", "¿Quién no está mojado?", "Who is not wet?", ["Lisa", "Opa Karl", "die Familie"], 1),
      Q("Wen fragt die Familie jetzt zuerst?", "¿A quién le pregunta primero ahora la familia?", "Whom does the family ask first now?", ["die App", "Opa Karl", "den Wetterbericht"], 1),
    ],
    glossary: [
      ["Opa", "abuelo", "grandpa", "der"],
      ["Knie", "rodilla", "knee", "das"],
      ["weiß", "sabe", "knows"],
      ["kennt", "conoce", "knows"],
      ["tut weh", "duele", "hurts"],
      ["weh", "dolor (tut weh = duele)", "(hurts)"],
      ["tut", "hace (tut weh = duele)", "does"],
      ["bald", "pronto", "soon"],
      ["Picknick", "pícnic", "picnic", "das"],
      ["Park", "parque", "park", "der"],
      ["App", "aplicación", "app", "die"],
      ["nehmt", "lleven (ustedes)", "take (you all)"],
      ["mit", "con", "with"],
      ["Himmel", "cielo", "sky", "der"],
      ["nass", "mojado", "wet"],
      ["unter", "debajo de", "under"],
      ["seinem", "su", "his"],
      ["Kuchen", "torta / pastel", "cake", "der"],
      ["besser als", "mejor que", "better than"],
      ["besser", "mejor", "better"],
      ["als", "que (comparación)", "than"],
    ],
  },
  {
    id: "pizza-wg",
    title: "Pizza um Mitternacht",
    titleTr: { es: "Pizza a medianoche", en: "Pizza at midnight" },
    level: "A1.1",
    theme: "essen",
    emoji: "🍕",
    color: "#f7dccb",
    minutes: 3,
    teaser: { de: "Drei Studenten, eine WG, eine Prüfung – und drei geheime Pizzas.", tr: { es: "Tres estudiantes, un piso compartido, un examen… y tres pizzas secretas.", en: "Three students, one flat share, one exam – and three secret pizzas." } },
    voices: { Pizzabote: "m", Sofía: "f", Jonas: "m" },
    scenes: [
      {
        emoji: "🏠",
        lines: [
          L("In der Bergstraße 5 wohnen drei Studenten in einer WG: Jonas, Sofía und Emre.", "En la Bergstraße 5 viven tres estudiantes en un piso compartido: Jonas, Sofía y Emre.", "Three students share a flat at Bergstraße 5: Jonas, Sofía and Emre."),
          L("Jonas studiert Informatik, Sofía Medizin und Emre Musik.", "Jonas estudia informática, Sofía medicina y Emre música.", "Jonas studies computer science, Sofía medicine and Emre music."),
          L("Morgen haben alle eine Prüfung. Sie lernen bis Mitternacht.", "Mañana todos tienen un examen. Estudian hasta medianoche.", "Tomorrow they all have an exam. They study until midnight."),
        ],
      },
      {
        emoji: "🍕",
        lines: [
          L("Um 23 Uhr hat Jonas Hunger. Er bestellt leise eine Pizza.", "A las 23 Jonas tiene hambre. Pide en silencio una pizza.", "At 11 pm Jonas is hungry. He quietly orders a pizza."),
          L("Sofía hat auch Hunger. Sie bestellt auch eine Pizza – aber sie sagt nichts.", "Sofía también tiene hambre. También pide una pizza, pero no dice nada.", "Sofía is hungry too. She orders a pizza as well – but says nothing."),
          L("Und Emre? Natürlich: Er bestellt auch eine Pizza!", "¿Y Emre? Claro: ¡también pide una pizza!", "And Emre? Of course: he orders a pizza too!"),
        ],
      },
      {
        emoji: "🛵",
        lines: [
          L("Um Mitternacht klingelt es. Der Pizzabote steht vor der Tür mit drei Pizzas.", "A medianoche suena el timbre. El repartidor está en la puerta con tres pizzas.", "At midnight the doorbell rings. The pizza guy is at the door with three pizzas."),
          L("Drei Pizzas für die Bergstraße 5?", "¿Tres pizzas para la Bergstraße 5?", "Three pizzas for Bergstraße 5?", "Pizzabote"),
          L("Jonas, Sofía und Emre kommen aus ihren Zimmern. Sie sehen sich an … und lachen.", "Jonas, Sofía y Emre salen de sus cuartos. Se miran… y se ríen.", "Jonas, Sofía and Emre come out of their rooms. They look at each other… and laugh."),
        ],
      },
      {
        emoji: "🎉",
        lines: [
          L("Sie essen zusammen in der Küche: Salami, Funghi und Margherita.", "Comen juntos en la cocina: salami, champiñones y margarita.", "They eat together in the kitchen: salami, mushroom and margherita."),
          L("Und die Prüfung? Alle drei haben eine Eins!", "¿Y el examen? ¡Los tres sacan la nota máxima!", "And the exam? All three get top marks!"),
          L("Jetzt gibt es jeden Freitag einen Pizza-Abend in der WG. Aber nur mit einer Bestellung!", "Ahora cada viernes hay noche de pizza en el piso. ¡Pero con un solo pedido!", "Now there's a pizza night in the flat every Friday. But with just one order!"),
        ],
      },
    ],
    quiz: [
      Q("Wie viele Studenten wohnen in der WG?", "¿Cuántos estudiantes viven en el piso?", "How many students live in the flat?", ["zwei", "drei", "vier"], 1),
      Q("Was studiert Sofía?", "¿Qué estudia Sofía?", "What does Sofía study?", ["Medizin", "Musik", "Informatik"], 0),
      Q("Wann kommt der Pizzabote?", "¿Cuándo llega el repartidor?", "When does the pizza guy come?", ["um 23 Uhr", "um Mitternacht", "am Morgen"], 1),
      Q("Was gibt es jetzt jeden Freitag?", "¿Qué hay ahora cada viernes?", "What is there every Friday now?", ["eine Prüfung", "einen Pizza-Abend", "einen Kurs"], 1),
    ],
    glossary: [
      ["Mitternacht", "medianoche", "midnight", "die"],
      ["WG", "piso compartido", "flat share", "die"],
      ["Studenten", "estudiantes", "students"],
      ["Informatik", "informática", "computer science", "die"],
      ["Medizin", "medicina", "medicine", "die"],
      ["Prüfung", "examen", "exam", "die"],
      ["bis", "hasta", "until"],
      ["Hunger", "hambre", "hunger", "der"],
      ["bestellt", "pide / ordena", "orders"],
      ["leise", "en silencio", "quietly"],
      ["natürlich", "claro / por supuesto", "of course"],
      ["klingelt", "suena el timbre", "rings"],
      ["Pizzabote", "repartidor de pizza", "pizza delivery guy", "der"],
      ["steht", "está; (escrito) dice", "stands; says"],
      ["vor", "delante de", "in front of"],
      ["ihren", "sus", "their"],
      ["sehen sich an", "se miran", "look at each other"],
      ["Eins", "la nota más alta (1)", "top mark (1)", "die"],
      ["Bestellung", "pedido", "order", "die"],
      ["Pizzas", "pizzas", "pizzas"],
    ],
  },
  {
    id: "flohmarkt-schatz",
    title: "Lenas Flohmarkt-Schatz",
    titleTr: { es: "El tesoro de Lena en el mercado de pulgas", en: "Lena's flea market treasure" },
    level: "A1.1",
    theme: "zeit",
    emoji: "📷",
    color: "#ece3f2",
    minutes: 3,
    teaser: { de: "Eine alte Kamera für fünf Euro. Und darin: ein Film voller Geschichten.", tr: { es: "Una cámara vieja por cinco euros. Y adentro: un rollo lleno de historias.", en: "An old camera for five euros. And inside: a film full of stories." } },
    voices: { Lena: "f", Paul: "m" },
    scenes: [
      {
        emoji: "🛍️",
        lines: [
          L("Es ist Sonntag. Lena ist auf dem Flohmarkt in Berlin.", "Es domingo. Lena está en el mercado de pulgas de Berlín.", "It's Sunday. Lena is at the flea market in Berlin."),
          L("Sie sieht eine alte Kamera. Sie kostet nur fünf Euro.", "Ve una cámara vieja. Cuesta solo cinco euros.", "She sees an old camera. It costs only five euros."),
          L("Fünf Euro? Die nehme ich!", "¿Cinco euros? ¡Me la llevo!", "Five euros? I'll take it!", "Lena"),
        ],
      },
      {
        emoji: "🎞️",
        lines: [
          L("Zu Hause öffnet Lena die Kamera. Da ist noch ein Film!", "En casa Lena abre la cámara. ¡Todavía tiene un rollo!", "At home Lena opens the camera. There's still a film inside!"),
          L("Drei Tage später hat sie die Fotos: eine junge Frau mit einem roten Kleid, ein Hund und ein Haus am See.", "Tres días después tiene las fotos: una mujer joven con un vestido rojo, un perro y una casa junto al lago.", "Three days later she has the photos: a young woman in a red dress, a dog and a house by a lake."),
          L("Auf einem Foto steht: „Für Paul, Sommer 1975“.", "En una foto dice: «Para Paul, verano de 1975».", "One photo says: “For Paul, summer 1975”."),
        ],
      },
      {
        emoji: "🔍",
        lines: [
          L("Am nächsten Sonntag geht Lena wieder zum Flohmarkt. Sie zeigt dem Verkäufer die Fotos.", "El domingo siguiente Lena vuelve al mercado. Le muestra las fotos al vendedor.", "The next Sunday Lena goes back to the market. She shows the seller the photos."),
          L("Das ist ja meine Mutter! Und das ist unser Hund Bello. Ich bin Paul!", "¡Pero si es mi mamá! Y ese es nuestro perro Bello. ¡Yo soy Paul!", "That's my mother! And that's our dog Bello. I'm Paul!", "Paul"),
        ],
      },
      {
        emoji: "❤️",
        lines: [
          L("Paul hat keine Fotos von seiner Mutter aus dieser Zeit. Er weint ein bisschen.", "Paul no tiene fotos de su mamá de esa época. Llora un poquito.", "Paul has no photos of his mother from that time. He cries a little."),
          L("Danke! Das ist das schönste Geschenk!", "¡Gracias! ¡Es el regalo más bonito!", "Thank you! That's the most beautiful present!", "Paul"),
          L("Er gibt Lena die fünf Euro zurück. Und eine schöne Lampe – gratis!", "Le devuelve a Lena los cinco euros. ¡Y una lámpara bonita, gratis!", "He gives Lena her five euros back. And a pretty lamp – for free!"),
        ],
      },
    ],
    quiz: [
      Q("Was kostet die Kamera?", "¿Cuánto cuesta la cámara?", "How much is the camera?", ["fünfzehn Euro", "fünf Euro", "fünfzig Euro"], 1),
      Q("Was ist in der Kamera?", "¿Qué hay en la cámara?", "What's in the camera?", ["ein Film", "Geld", "ein Brief"], 0),
      Q("Wer ist die Frau auf dem Foto?", "¿Quién es la mujer de la foto?", "Who is the woman in the photo?", ["Lenas Oma", "Pauls Mutter", "eine Verkäuferin"], 1),
      Q("Was bekommt Lena gratis?", "¿Qué recibe Lena gratis?", "What does Lena get for free?", ["eine Kamera", "eine Lampe", "einen Hund"], 1),
    ],
    glossary: [
      ["Schatz", "tesoro", "treasure", "der"],
      ["Flohmarkt", "mercado de pulgas", "flea market", "der"],
      ["alte", "vieja", "old"],
      ["Kamera", "cámara", "camera", "die"],
      ["Film", "rollo (de fotos)", "film", "der"],
      ["noch", "todavía", "still"],
      ["junge", "joven", "young"],
      ["roten", "rojo", "red"],
      ["See", "lago", "lake", "der"],
      ["steht", "está; (escrito) dice", "stands; says"],
      ["nächsten", "siguiente", "next"],
      ["zeigt", "muestra", "shows"],
      ["unser", "nuestro", "our"],
      ["seiner", "su (de él)", "his"],
      ["dieser", "esta", "this"],
      ["Zeit", "época / tiempo", "time", "die"],
      ["weint", "llora", "cries"],
      ["schönste", "el más bonito", "most beautiful"],
      ["gibt zurück", "devuelve", "gives back"],
      ["gibt", "da", "gives"],
      ["zurück", "de vuelta", "back"],
      ["gratis", "gratis", "for free"],
      ["ja", "pero si (sorpresa)", "really (surprise)"],
    ],
  },
  {
    id: "ohne-handy",
    title: "Eine Woche ohne Handy",
    titleTr: { es: "Una semana sin celular", en: "A week without a phone" },
    level: "A1.1",
    theme: "alltag",
    emoji: "📵",
    color: "#e2ece6",
    minutes: 3,
    teaser: { de: "Sofías Handy ist kaputt. Eine Katastrophe? Oder ein Anfang?", tr: { es: "El celular de Sofía se dañó. ¿Una catástrofe? ¿O un comienzo?", en: "Sofía's phone is broken. A disaster? Or a beginning?" } },
    voices: { Sofía: "f", "Frau Weiß": "f" },
    scenes: [
      {
        emoji: "📵",
        lines: [
          L("Montagmorgen. Sofías Handy fällt in die Badewanne. Jetzt ist es kaputt.", "Lunes por la mañana. El celular de Sofía se cae en la bañera. Ahora está dañado.", "Monday morning. Sofía's phone falls into the bathtub. Now it's broken."),
          L("Kein Wecker, keine Musik, keine Nachrichten. Oh nein!", "Sin despertador, sin música, sin mensajes. ¡Oh no!", "No alarm, no music, no messages. Oh no!"),
          L("Das neue Handy kommt erst am Freitag.", "El celular nuevo llega solo hasta el viernes.", "The new phone only arrives on Friday."),
        ],
      },
      {
        emoji: "📖",
        lines: [
          L("Am Dienstag frühstückt Sofía ohne Handy. Sie hört die Vögel im Garten.", "El martes Sofía desayuna sin celular. Oye los pájaros en el jardín.", "On Tuesday Sofía has breakfast without her phone. She hears the birds in the garden."),
          L("Am Mittwoch liest sie ein Buch. Ein ganzes Buch!", "El miércoles lee un libro. ¡Un libro entero!", "On Wednesday she reads a book. A whole book!"),
          L("Am Donnerstag geht sie zu Fuß zur Uni und sieht ein kleines Café.", "El jueves va caminando a la universidad y ve un pequeño café.", "On Thursday she walks to uni and sees a small café."),
        ],
      },
      {
        emoji: "🗣️",
        lines: [
          L("Im Café sitzt eine alte Dame. Sie malt ein Bild von der Straße.", "En el café hay una señora mayor sentada. Pinta un cuadro de la calle.", "In the café an old lady is sitting. She's painting a picture of the street."),
          L("Das ist wunderschön! Malen Sie oft?", "¡Qué hermoso! ¿Pinta usted a menudo?", "That's beautiful! Do you paint often?", "Sofía"),
          L("Jeden Tag! Ich bin Frau Weiß. Malst du auch?", "¡Todos los días! Soy la señora Weiß. ¿Tú también pintas?", "Every day! I'm Mrs Weiß. Do you paint too?", "Frau Weiß"),
          L("Nein, aber ich möchte es lernen!", "¡No, pero quiero aprender!", "No, but I'd like to learn!", "Sofía"),
        ],
      },
      {
        emoji: "🎨",
        lines: [
          L("Am Freitag kommt das neue Handy. Sofía ist froh.", "El viernes llega el celular nuevo. Sofía está contenta.", "On Friday the new phone arrives. Sofía is happy."),
          L("Aber am Samstag macht sie etwas Neues: Sie malt mit Frau Weiß im Park.", "Pero el sábado hace algo nuevo: pinta con la señora Weiß en el parque.", "But on Saturday she does something new: she paints with Mrs Weiß in the park."),
          L("Und das Handy? Das bleibt zu Hause.", "¿Y el celular? Se queda en casa.", "And the phone? It stays at home."),
        ],
      },
    ],
    quiz: [
      Q("Was passiert am Montag?", "¿Qué pasa el lunes?", "What happens on Monday?", ["Das Handy ist kaputt.", "Sofía ist krank.", "Es regnet."], 0),
      Q("Was macht Sofía am Mittwoch?", "¿Qué hace Sofía el miércoles?", "What does Sofía do on Wednesday?", ["Sie kocht.", "Sie liest ein Buch.", "Sie schläft."], 1),
      Q("Wer ist Frau Weiß?", "¿Quién es la señora Weiß?", "Who is Mrs Weiß?", ["eine Lehrerin", "eine alte Dame", "eine Freundin aus Spanien"], 1),
      Q("Was macht Sofía am Samstag?", "¿Qué hace Sofía el sábado?", "What does Sofía do on Saturday?", ["Sie kauft ein Handy.", "Sie arbeitet.", "Sie malt im Park."], 2),
    ],
    glossary: [
      ["ohne", "sin", "without"],
      ["fällt", "se cae", "falls"],
      ["Badewanne", "bañera", "bathtub", "die"],
      ["kaputt", "dañado", "broken"],
      ["Wecker", "despertador", "alarm clock", "der"],
      ["erst", "solo / hasta", "only (not until)"],
      ["Vögel", "pájaros", "birds"],
      ["ganzes", "entero", "whole"],
      ["zu Fuß", "a pie", "on foot"],
      ["Fuß", "pie", "foot", "der"],
      ["Uni", "universidad", "uni", "die"],
      ["Dame", "señora", "lady", "die"],
      ["malt", "pinta", "paints"],
      ["Bild", "cuadro / imagen", "picture", "das"],
      ["wunderschön", "hermoso", "beautiful"],
      ["oft", "a menudo", "often"],
      ["froh", "contenta", "happy"],
      ["etwas Neues", "algo nuevo", "something new"],
      ["etwas", "algo", "something"],
      ["bleibt", "se queda", "stays"],
      ["Katastrophe", "catástrofe", "disaster", "die"],
      ["Anfang", "comienzo", "beginning", "der"],
    ],
  },
];

export const getStory = (id: string) => STORIES.find((s) => s.id === id);

/** Palabras que aparecen en varias historias. */
export const STORY_WORDS: [string, string, string, ("der" | "die" | "das")?][] = [
  ["Video", "video", "video", "das"],
  ["geht's", "va / está (wie geht's = ¿cómo estás?)", "goes (wie geht's = how are you?)"],
  ["Ach", "ah", "oh"],
  ["recht", "razón (recht haben = tener razón)", "right (recht haben = to be right)"],
  ["geheime", "secretas", "secret"],
  ["Salami", "salami", "salami", "die"],
  ["Funghi", "champiñones", "mushrooms"],
  ["Margherita", "margarita (pizza)", "margherita"],
  ["Pizza-Abend", "noche de pizza", "pizza night", "der"],
  ["darin", "adentro", "inside"],
  ["bisschen", "poco (ein bisschen = un poco)", "bit (ein bisschen = a bit)"],
  ["Montagmorgen", "lunes por la mañana", "Monday morning", "der"],
  ["passiert", "pasa / sucede", "happens"],
  ["Kaffee-Dieb", "ladrón de café", "coffee thief", "der"],
  ["Flohmarkt-Schatz", "tesoro del mercado de pulgas", "flea market treasure", "der"],
];
