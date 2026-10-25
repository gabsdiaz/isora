import type { UnitContent } from "../../../types";

const unit: UnitContent = {
  level: "a1-1",
  number: 1,
  goals: [
    { es: "Saludar y despedirte según la hora del día", en: "Greet and say goodbye depending on the time of day" },
    { es: "Decir tu nombre y de dónde eres", en: "Say your name and where you are from" },
    { es: "Preguntar a otros por su nombre y origen", en: "Ask others for their name and origin" },
    { es: "Distinguir entre du (informal) y Sie (formal)", en: "Tell du (informal) and Sie (formal) apart" },
  ],
  video: {
    duration: "4 min",
    description: {
      es: "Un paseo animado por un día en Berlín: de Guten Morgen a Gute Nacht, con la escritura y la pronunciación de cada saludo.",
      en: "An animated walk through a day in Berlin: from Guten Morgen to Gute Nacht, showing how each greeting is written and pronounced.",
    },
  },
  theory: [
    { type: "heading", text: { es: "1. Saludos: depende de la hora", en: "1. Greetings depend on the time of day" } },
    {
      type: "paragraph",
      text: {
        es: "En alemán, como en español, el saludo cambia según el momento del día. Hallo sirve siempre, pero es informal: úsalo con amigos y personas de tu edad.",
        en: "In German the greeting changes with the time of day. Hallo always works, but it is informal: use it with friends and people your age.",
      },
    },
    {
      type: "phrases",
      title: { es: "Saludos", en: "Greetings" },
      items: [
        { de: "Hallo!", meaning: { es: "¡Hola!", en: "Hi! / Hello!" }, note: { es: "informal", en: "informal" } },
        { de: "Guten Morgen!", meaning: { es: "¡Buenos días! (hasta ~11 h)", en: "Good morning! (until ~11 am)" } },
        { de: "Guten Tag!", meaning: { es: "¡Buen día! / ¡Buenas tardes! (formal)", en: "Good day! / Good afternoon! (formal)" } },
        { de: "Guten Abend!", meaning: { es: "¡Buenas noches! (al llegar, desde ~18 h)", en: "Good evening! (from ~6 pm)" } },
      ],
    },
    {
      type: "phrases",
      title: { es: "Despedidas", en: "Goodbyes" },
      items: [
        { de: "Tschüss!", meaning: { es: "¡Chao!", en: "Bye!" }, note: { es: "informal", en: "informal" } },
        { de: "Auf Wiedersehen!", meaning: { es: "¡Adiós! / ¡Hasta luego!", en: "Goodbye!" }, note: { es: "formal", en: "formal" } },
        { de: "Bis später!", meaning: { es: "¡Hasta más tarde!", en: "See you later!" } },
        { de: "Gute Nacht!", meaning: { es: "¡Buenas noches! (al irse a dormir)", en: "Good night! (going to bed)" } },
      ],
    },
    {
      type: "tip",
      text: {
        es: "Guten Abend se usa para saludar; Gute Nacht solo para despedirse antes de dormir. ¡No los confundas!",
        en: "Guten Abend is a greeting; Gute Nacht is only for saying goodbye before bed. Don't mix them up!",
      },
    },

    { type: "heading", text: { es: "2. ¿Cómo te llamas?", en: "2. What's your name?" } },
    {
      type: "paragraph",
      text: {
        es: "Para decir tu nombre tienes dos opciones igual de comunes: Ich heiße … (me llamo …) o Ich bin … (soy …). El verbo heißen significa «llamarse».",
        en: "To say your name you have two equally common options: Ich heiße … (my name is …) or Ich bin … (I am …). The verb heißen means “to be called”.",
      },
    },
    { type: "example", de: "Hallo, ich heiße Lena. Und du?", meaning: { es: "Hola, me llamo Lena. ¿Y tú?", en: "Hi, my name is Lena. And you?" } },
    { type: "example", de: "Ich bin Mateo.", meaning: { es: "Soy Mateo.", en: "I'm Mateo." } },

    { type: "heading", text: { es: "3. du o Sie: informal y formal", en: "3. du or Sie: informal and formal" } },
    {
      type: "paragraph",
      text: {
        es: "El alemán distingue claramente entre du (tú) y Sie (usted). Sie siempre se escribe con mayúscula. Con un profesor, en una tienda o con un desconocido adulto, usa Sie hasta que te ofrezcan el du.",
        en: "German clearly distinguishes du (informal “you”) from Sie (formal “you”). Sie is always capitalised. With a teacher, in a shop or with an adult stranger, use Sie until they offer du.",
      },
    },
    {
      type: "table",
      title: { es: "Preguntas básicas", en: "Basic questions" },
      columns: [
        { es: "Informal (du)", en: "Informal (du)" },
        { es: "Formal (Sie)", en: "Formal (Sie)" },
      ],
      rows: [
        ["Wie heißt du?", "Wie heißen Sie?"],
        ["Woher kommst du?", "Woher kommen Sie?"],
        ["Wie geht's dir?", "Wie geht es Ihnen?"],
      ],
    },

    { type: "heading", text: { es: "4. Los verbos de la unidad", en: "4. This unit's verbs" } },
    {
      type: "paragraph",
      text: {
        es: "Los verbos alemanes cambian su terminación según la persona. Fíjate: con ich casi siempre termina en -e, con du en -st, y con Sie es igual al infinitivo.",
        en: "German verbs change their ending depending on the person. Notice: with ich it usually ends in -e, with du in -st, and with Sie it matches the infinitive.",
      },
    },
    {
      type: "table",
      title: { es: "Conjugación", en: "Conjugation" },
      columns: [
        { es: "Persona", en: "Person" },
        { es: "heißen", en: "heißen" },
        { es: "kommen", en: "kommen" },
        { es: "sein", en: "sein" },
      ],
      rows: [
        ["ich", "heiße", "komme", "bin"],
        ["du", "heißt", "kommst", "bist"],
        ["Sie", "heißen", "kommen", "sind"],
      ],
    },
    {
      type: "tip",
      text: {
        es: "heißen ya termina en ß, por eso con du solo se añade -t: du heißt (no «heißst»).",
        en: "heißen already ends in ß, so with du you only add -t: du heißt (not “heißst”).",
      },
    },

    { type: "heading", text: { es: "5. ¿De dónde eres?", en: "5. Where are you from?" } },
    {
      type: "paragraph",
      text: {
        es: "Para tu país de origen usa Ich komme aus … Algunos países llevan artículo: aus der Schweiz, aus den USA. La mayoría no: aus Kolumbien, aus Spanien, aus Mexiko.",
        en: "For your country of origin use Ich komme aus … Some countries take an article: aus der Schweiz, aus den USA. Most don't: aus Kolumbien, aus England, aus Kanada.",
      },
    },
    { type: "example", de: "Ich komme aus Kolumbien. Und Sie?", meaning: { es: "Soy de Colombia. ¿Y usted?", en: "I'm from Colombia. And you?" } },
    { type: "example", de: "Ich wohne in Berlin.", meaning: { es: "Vivo en Berlín.", en: "I live in Berlin." } },
  ],
  readings: [
    {
      title: "Im Sprachkurs",
      kind: { es: "Diálogo informal", en: "Informal dialogue" },
      lines: [
        { speaker: "Lena", de: "Hallo! Ich bin Lena. Wie heißt du?" },
        { speaker: "Mateo", de: "Hallo, Lena! Ich heiße Mateo." },
        { speaker: "Lena", de: "Woher kommst du, Mateo?" },
        { speaker: "Mateo", de: "Ich komme aus Kolumbien, aus Bogotá. Und du?" },
        { speaker: "Lena", de: "Ich komme aus Österreich. Aber ich wohne jetzt in Berlin." },
        { speaker: "Mateo", de: "Cool! Ich wohne auch in Berlin." },
        { speaker: "Lena", de: "Super! Bis später, Mateo!" },
        { speaker: "Mateo", de: "Tschüss, Lena!" },
      ],
      glossary: [
        { de: "der Sprachkurs", meaning: { es: "el curso de idiomas", en: "the language course" } },
        { de: "aber", meaning: { es: "pero", en: "but" } },
        { de: "jetzt", meaning: { es: "ahora", en: "now" } },
        { de: "wohnen", meaning: { es: "vivir (residir)", en: "to live (reside)" } },
        { de: "auch", meaning: { es: "también", en: "also, too" } },
      ],
      questions: [
        { q: { es: "¿De dónde es Mateo?", en: "Where is Mateo from?" }, a: { es: "De Colombia (Bogotá).", en: "From Colombia (Bogotá)." } },
        { q: { es: "¿Dónde vive Lena ahora?", en: "Where does Lena live now?" }, a: { es: "En Berlín.", en: "In Berlin." } },
      ],
    },
    {
      title: "An der Rezeption",
      kind: { es: "Diálogo formal", en: "Formal dialogue" },
      lines: [
        { speaker: "Frau Weber", de: "Guten Tag! Wie heißen Sie, bitte?" },
        { speaker: "Herr Rojas", de: "Guten Tag! Mein Name ist Daniel Rojas." },
        { speaker: "Frau Weber", de: "Woher kommen Sie, Herr Rojas?" },
        { speaker: "Herr Rojas", de: "Ich komme aus Mexiko." },
        { speaker: "Frau Weber", de: "Herzlich willkommen! Auf Wiedersehen." },
        { speaker: "Herr Rojas", de: "Vielen Dank. Auf Wiedersehen!" },
      ],
      glossary: [
        { de: "die Rezeption", meaning: { es: "la recepción", en: "the reception" } },
        { de: "bitte", meaning: { es: "por favor", en: "please" } },
        { de: "Mein Name ist …", meaning: { es: "Mi nombre es …", en: "My name is …" } },
        { de: "Herzlich willkommen!", meaning: { es: "¡Bienvenido!", en: "Welcome!" } },
        { de: "Vielen Dank", meaning: { es: "Muchas gracias", en: "Thank you very much" } },
      ],
    },
  ],
  exercises: [
    {
      id: "e1",
      type: "choice",
      prompt: { es: "Son las 8:00 de la mañana. ¿Cómo saludas a tu profesora?", en: "It's 8:00 am. How do you greet your teacher?" },
      options: ["Guten Abend!", "Guten Morgen!", "Gute Nacht!", "Tschüss!"],
      answer: 1,
      explanation: {
        es: "Por la mañana se dice Guten Morgen. Gute Nacht es para despedirse antes de dormir y Tschüss es una despedida.",
        en: "In the morning you say Guten Morgen. Gute Nacht is for going to bed and Tschüss is a goodbye.",
      },
    },
    {
      id: "e2",
      type: "fill",
      prompt: { es: "Completa con la forma correcta de heißen.", en: "Fill in the correct form of heißen." },
      sentence: "Wie ___ du?",
      answers: ["heißt", "heisst"],
      hint: { es: "Con du: raíz + -t", en: "With du: stem + -t" },
      explanation: {
        es: "Con du el verbo heißen se conjuga heißt.",
        en: "With du, heißen becomes heißt.",
      },
    },
    {
      id: "e3",
      type: "choice",
      prompt: { es: "¿Cuál es la pregunta formal?", en: "Which question is formal?" },
      options: ["Woher kommst du?", "Woher kommen Sie?", "Woher komme Sie?"],
      answer: 1,
      explanation: {
        es: "Sie va con el verbo en infinitivo: kommen. Y Sie siempre con mayúscula.",
        en: "Sie takes the infinitive form: kommen. And Sie is always capitalised.",
      },
    },
    {
      id: "e4",
      type: "fill",
      prompt: { es: "Completa con la forma correcta de sein.", en: "Fill in the correct form of sein." },
      sentence: "Ich ___ Sofía.",
      answers: ["bin"],
      explanation: { es: "ich bin = yo soy.", en: "ich bin = I am." },
    },
    {
      id: "e5",
      type: "order",
      prompt: { es: "Ordena las palabras para formar la frase.", en: "Put the words in order." },
      words: ["Ich", "komme", "aus", "Kolumbien"],
      explanation: {
        es: "En una frase afirmativa el verbo va en segunda posición: Ich komme aus Kolumbien.",
        en: "In a statement the verb comes second: Ich komme aus Kolumbien.",
      },
    },
    {
      id: "e6",
      type: "order",
      prompt: { es: "Ordena la pregunta.", en: "Put the question in order." },
      words: ["Wie", "heißen", "Sie"],
      explanation: {
        es: "En preguntas con palabra interrogativa (W-Frage) el verbo va justo después: Wie heißen Sie?",
        en: "In W-questions the verb comes right after the question word: Wie heißen Sie?",
      },
    },
    {
      id: "e7",
      type: "match",
      prompt: { es: "Une cada expresión con su significado.", en: "Match each expression with its meaning." },
      pairs: [
        { de: "Tschüss!", meaning: { es: "¡Chao!", en: "Bye!" } },
        { de: "Guten Abend!", meaning: { es: "¡Buenas noches! (saludo)", en: "Good evening!" } },
        { de: "Auf Wiedersehen!", meaning: { es: "¡Adiós! (formal)", en: "Goodbye! (formal)" } },
        { de: "Bis später!", meaning: { es: "¡Hasta más tarde!", en: "See you later!" } },
      ],
    },
    {
      id: "e8",
      type: "fill",
      prompt: { es: "Completa con la forma correcta de kommen.", en: "Fill in the correct form of kommen." },
      sentence: "Woher ___ du?",
      answers: ["kommst"],
      explanation: { es: "Con du: komm + -st = kommst.", en: "With du: komm + -st = kommst." },
    },
  ],
};

export default unit;
