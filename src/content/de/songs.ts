import type { Tr } from "../types";

/**
 * Lieder: canciones para completar la letra mientras suena la música.
 *
 * Solo canciones de DOMINIO PÚBLICO (letras publicadas hace más de 100 años:
 * canciones populares, infantiles clásicas y poemas famosos con música).
 * Las canciones modernas necesitan licencia para mostrar su letra.
 *
 * La versión de Spotify y los tiempos de cada línea los elige la Lehrkraft
 * en la propia página (modo Lehrkraft) y se guardan en Firestore: songs/{id}.
 */
export type SongLine = { de: string; tr: Tr };
export type Song = {
  id: string;
  title: string;
  credit: string;
  level: "A1" | "A2" | "B1" | "B2";
  theme: { de: string; tr: Tr };
  emoji: string;
  /** Búsqueda en Spotify (para elegir otra versión) */
  query: string;
  /** Versión por defecto en Spotify; la Lehrkraft puede cambiarla en el modo Lehrkraft */
  spotify?: string;
  about: Tr;
  stanzas: SongLine[][];
  /** Palabras que preferimos como huecos (vocabulario útil) */
  focus: string[];
  /** Palabras para las tarjetas: [de, es, en, artículo?] */
  glossary: [string, string, string, ("der" | "die" | "das")?][];
};

const l = (de: string, es: string, en: string): SongLine => ({ de, tr: { es, en } });

export const SONGS: Song[] = [
  {
    id: "summ-summ",
    title: "Summ, summ, summ",
    credit: "Text: Hoffmann von Fallersleben (19. Jh.) · Volksweise",
    level: "A1",
    theme: { de: "Natur & Tiere", tr: { es: "Naturaleza y animales", en: "Nature & animals" } },
    emoji: "🐝",
    query: "Summ summ summ Bienchen summ herum",
    spotify: "spotify:track:71FsKMjZ34T5IUZO5kO6bn",
    about: {
      es: "Una de las primeras canciones que aprenden los niños en Alemania. Le cantan a una abejita para que salga a buscar flores.",
      en: "One of the first songs children learn in Germany. They sing to a little bee to go out and look for flowers.",
    },
    stanzas: [
      [
        l("Summ, summ, summ!", "¡Bzz, bzz, bzz!", "Buzz, buzz, buzz!"),
        l("Bienchen, summ herum!", "¡Abejita, zumba por ahí!", "Little bee, buzz around!"),
        l("Ei, wir tun dir nichts zuleide,", "Tranquila, no te haremos daño,", "Oh, we won't do you any harm,"),
        l("flieg nur aus in Wald und Heide!", "¡vuela al bosque y al campo!", "just fly out to the woods and heath!"),
        l("Summ, summ, summ!", "¡Bzz, bzz, bzz!", "Buzz, buzz, buzz!"),
        l("Bienchen, summ herum!", "¡Abejita, zumba por ahí!", "Little bee, buzz around!"),
      ],
      [
        l("Summ, summ, summ!", "¡Bzz, bzz, bzz!", "Buzz, buzz, buzz!"),
        l("Bienchen, summ herum!", "¡Abejita, zumba por ahí!", "Little bee, buzz around!"),
        l("Such in Blumen, such in Blümchen", "Busca en las flores, en las florecitas", "Search in flowers, in little flowers"),
        l("dir ein Tröpfchen, dir ein Krümchen!", "una gotita, una migajita para ti.", "a little drop, a little crumb for you!"),
        l("Summ, summ, summ!", "¡Bzz, bzz, bzz!", "Buzz, buzz, buzz!"),
        l("Bienchen, summ herum!", "¡Abejita, zumba por ahí!", "Little bee, buzz around!"),
      ],
    ],
    focus: ["Bienchen", "Wald", "Blumen", "flieg", "wir", "dir"],
    glossary: [
      ["Biene", "abeja", "bee", "die"],
      ["Wald", "bosque", "forest", "der"],
      ["Blume", "flor", "flower", "die"],
      ["fliegen", "volar", "to fly"],
    ],
  },
  {
    id: "haenschen-klein",
    title: "Hänschen klein",
    credit: "Text: Franz Wiedemann (19. Jh.), heute gesungene Fassung nach Otto Frömmel (1900) · Volksweise",
    level: "A1",
    theme: { de: "Familie", tr: { es: "Familia", en: "Family" } },
    emoji: "🎒",
    query: "Hänschen klein Kinderlied",
    spotify: "spotify:track:3w0LkYVZHtP99iuQlC1JkK",
    about: {
      es: "Hänschen («Juanito») se va solo a recorrer el mundo y su mamá llora. Todo alemán conoce esta melodía: es la misma que se usa para aprender a tocar flauta o piano.",
      en: "Little Hans goes off alone to see the world and his mum cries. Every German knows this tune: it's the one used to learn recorder or piano.",
    },
    stanzas: [
      [
        l("Hänschen klein", "El pequeño Juanito", "Little Hans"),
        l("ging allein", "se fue solo", "went alone"),
        l("in die weite Welt hinein.", "a recorrer el ancho mundo.", "out into the wide world."),
        l("Stock und Hut", "El bastón y el sombrero", "Stick and hat"),
        l("steht ihm gut,", "le quedan bien,", "suit him well,"),
        l("ist gar wohlgemut.", "va muy contento.", "he's in high spirits."),
        l("Aber Mama weinet sehr,", "Pero mamá llora mucho,", "But Mama cries a lot,"),
        l("hat ja nun kein Hänschen mehr.", "ya no tiene a su Juanito.", "she has no little Hans any more."),
        l("„Wünsch dir Glück!“,", "«¡Te deseo suerte!»,", "“I wish you luck!”,"),
        l("sagt ihr Blick,", "dice su mirada,", "says her look,"),
        l("„kehr nur bald zurück!“", "«¡pero vuelve pronto!»", "“just come back soon!”"),
      ],
    ],
    focus: ["klein", "allein", "Welt", "Hut", "gut", "Mama", "Glück", "bald"],
    glossary: [
      ["Welt", "mundo", "world", "die"],
      ["Hut", "sombrero", "hat", "der"],
      ["allein", "solo", "alone"],
      ["Glück", "suerte, felicidad", "luck, happiness", "das"],
      ["bald", "pronto", "soon"],
    ],
  },
  {
    id: "backe-kuchen",
    title: "Backe, backe Kuchen",
    credit: "Kinderreim aus Sachsen und Thüringen (19. Jh.) · Volksweise",
    level: "A1",
    theme: { de: "Essen & Trinken", tr: { es: "Comida y bebida", en: "Food & drink" } },
    emoji: "🎂",
    query: "Backe backe Kuchen Kinderlied",
    spotify: "spotify:track:3UYRIPoWdvDaP6XguW0w0X",
    about: {
      es: "Una receta cantada: las «siete cosas» que necesitas para hornear un pastel. «gel» es una forma antigua de decir «gelb» (amarillo).",
      en: "A sung recipe: the “seven things” you need to bake a cake. “gel” is an old way of saying “gelb” (yellow).",
    },
    stanzas: [
      [
        l("Backe, backe Kuchen,", "Hornea, hornea el pastel,", "Bake, bake a cake,"),
        l("der Bäcker hat gerufen!", "¡el panadero ha llamado!", "the baker has called!"),
        l("Wer will guten Kuchen backen,", "Quien quiera hornear un buen pastel", "Whoever wants to bake a good cake"),
        l("der muss haben sieben Sachen:", "tiene que tener siete cosas:", "must have seven things:"),
        l("Eier und Schmalz,", "huevos y manteca,", "eggs and lard,"),
        l("Butter und Salz,", "mantequilla y sal,", "butter and salt,"),
        l("Milch und Mehl,", "leche y harina,", "milk and flour,"),
        l("Safran macht den Kuchen gel!", "¡el azafrán pone amarillo el pastel!", "saffron makes the cake yellow!"),
        l("Schieb, schieb in den Ofen rein!", "¡Empújalo, empújalo al horno!", "Push, push it into the oven!"),
      ],
    ],
    focus: ["Kuchen", "Bäcker", "sieben", "Eier", "Butter", "Salz", "Milch", "Mehl", "Ofen"],
    glossary: [
      ["Kuchen", "pastel, torta", "cake", "der"],
      ["Bäcker", "panadero", "baker", "der"],
      ["Ei", "huevo", "egg", "das"],
      ["Butter", "mantequilla", "butter", "die"],
      ["Salz", "sal", "salt", "das"],
      ["Milch", "leche", "milk", "die"],
      ["Mehl", "harina", "flour", "das"],
      ["Ofen", "horno", "oven", "der"],
    ],
  },
  {
    id: "kuckuck",
    title: "Kuckuck, Kuckuck, ruft’s aus dem Wald",
    credit: "Text: Hoffmann von Fallersleben (1835) · Volksweise",
    level: "A1",
    theme: { de: "Wetter & Jahreszeiten", tr: { es: "Clima y estaciones", en: "Weather & seasons" } },
    emoji: "🐦",
    query: "Kuckuck Kuckuck ruft's aus dem Wald",
    spotify: "spotify:track:2WGxHo7WuFggpmPLnZqMEF",
    about: {
      es: "Cuando el cuco canta en el bosque, en Alemania se dice que ya llega la primavera. ¡El invierno tiene que irse!",
      en: "When the cuckoo calls in the forest, Germans say spring is coming. Winter has to leave!",
    },
    stanzas: [
      [
        l("Kuckuck, Kuckuck, ruft’s aus dem Wald.", "Cucú, cucú, se oye desde el bosque.", "Cuckoo, cuckoo, calls from the forest."),
        l("Lasset uns singen,", "¡Cantemos,", "Let us sing,"),
        l("tanzen und springen!", "bailemos y saltemos!", "dance and jump!"),
        l("Frühling, Frühling wird es nun bald.", "Pronto, pronto será primavera.", "Spring, spring will soon be here."),
      ],
      [
        l("Kuckuck, Kuckuck lässt nicht sein Schrein:", "Cucú, cucú no deja de cantar:", "Cuckoo, cuckoo won't stop calling:"),
        l("Komm in die Felder,", "¡Ven a los campos,", "Come to the fields,"),
        l("Wiesen und Wälder!", "praderas y bosques!", "meadows and forests!"),
        l("Frühling, Frühling, stelle dich ein!", "¡Primavera, primavera, ven ya!", "Spring, spring, come along!"),
      ],
      [
        l("Kuckuck, Kuckuck, trefflicher Held!", "Cucú, cucú, ¡gran héroe!", "Cuckoo, cuckoo, splendid hero!"),
        l("Was du gesungen,", "Lo que cantaste", "What you have sung"),
        l("ist dir gelungen:", "te salió bien:", "has worked out:"),
        l("Winter, Winter räumet das Feld.", "el invierno, el invierno se retira.", "winter, winter is clearing the field."),
      ],
    ],
    focus: ["Wald", "singen", "tanzen", "springen", "Frühling", "bald", "Felder", "Winter"],
    glossary: [
      ["Frühling", "primavera", "spring", "der"],
      ["Winter", "invierno", "winter", "der"],
      ["singen", "cantar", "to sing"],
      ["tanzen", "bailar", "to dance"],
      ["Feld", "campo", "field", "das"],
    ],
  },
  {
    id: "tannenbaum",
    title: "O Tannenbaum",
    credit: "Text: Ernst Anschütz (1824), nach einem Volkslied · Volksweise",
    level: "A1",
    theme: { de: "Feste & Winter", tr: { es: "Fiestas e invierno", en: "Holidays & winter" } },
    emoji: "🎄",
    query: "O Tannenbaum",
    spotify: "spotify:track:2MAB24iL9zgMKFzcMa2Ym4",
    about: {
      es: "El villancico alemán más famoso del mundo. El abeto sigue verde incluso cuando nieva.",
      en: "The world's most famous German Christmas song. The fir tree stays green even when it snows.",
    },
    stanzas: [
      [
        l("O Tannenbaum, o Tannenbaum,", "Oh abeto, oh abeto,", "O fir tree, o fir tree,"),
        l("wie grün sind deine Blätter!", "¡qué verdes son tus hojas!", "how green are your leaves!"),
        l("Du grünst nicht nur zur Sommerzeit,", "No solo eres verde en verano,", "You're green not only in summertime,"),
        l("nein, auch im Winter, wenn es schneit.", "no, también en invierno, cuando nieva.", "no, also in winter when it snows."),
        l("O Tannenbaum, o Tannenbaum,", "Oh abeto, oh abeto,", "O fir tree, o fir tree,"),
        l("wie grün sind deine Blätter!", "¡qué verdes son tus hojas!", "how green are your leaves!"),
      ],
      [
        l("O Tannenbaum, o Tannenbaum,", "Oh abeto, oh abeto,", "O fir tree, o fir tree,"),
        l("du kannst mir sehr gefallen!", "¡cuánto me gustas!", "how much I like you!"),
        l("Wie oft hat nicht zur Weihnachtszeit", "Cuántas veces en Navidad", "How often at Christmas time"),
        l("ein Baum von dir mich hoch erfreut!", "un árbol como tú me alegró.", "has a tree like you delighted me!"),
        l("O Tannenbaum, o Tannenbaum,", "Oh abeto, oh abeto,", "O fir tree, o fir tree,"),
        l("du kannst mir sehr gefallen!", "¡cuánto me gustas!", "how much I like you!"),
      ],
    ],
    focus: ["grün", "Blätter", "Sommerzeit", "Winter", "schneit", "Weihnachtszeit", "Baum", "gefallen"],
    glossary: [
      ["Baum", "árbol", "tree", "der"],
      ["grün", "verde", "green"],
      ["Winter", "invierno", "winter", "der"],
      ["es schneit", "nieva", "it's snowing"],
      ["Weihnachten", "Navidad", "Christmas", "das"],
    ],
  },
  {
    id: "alle-voegel",
    title: "Alle Vögel sind schon da",
    credit: "Text: Hoffmann von Fallersleben (1835) · Volksweise",
    level: "A2",
    theme: { de: "Wetter & Jahreszeiten", tr: { es: "Clima y estaciones", en: "Weather & seasons" } },
    emoji: "🐤",
    query: "Alle Vögel sind schon da",
    spotify: "spotify:track:6AWgd4SWCBY6gkJabZjeH6",
    about: {
      es: "La canción de la primavera por excelencia: todos los pájaros ya volvieron y cantan. Amsel, Drossel, Fink und Star son mirlo, zorzal, pinzón y estornino.",
      en: "The spring song par excellence: all the birds are back and singing. Amsel, Drossel, Fink und Star are blackbird, thrush, finch and starling.",
    },
    stanzas: [
      [
        l("Alle Vögel sind schon da,", "Todos los pájaros ya llegaron,", "All the birds are already here,"),
        l("alle Vögel, alle!", "¡todos los pájaros, todos!", "all the birds, all of them!"),
        l("Welch ein Singen, Musiziern,", "¡Qué cantos, qué música,", "What singing, what music,"),
        l("Pfeifen, Zwitschern, Tireliern!", "silbidos, trinos y gorjeos!", "whistling, chirping, trilling!"),
        l("Frühling will nun einmarschiern,", "La primavera quiere entrar marchando,", "Spring wants to march in now,"),
        l("kommt mit Sang und Schalle.", "llega con canto y alboroto.", "it comes with song and sound."),
      ],
      [
        l("Wie sie alle lustig sind,", "¡Qué alegres están todos,", "How merry they all are,"),
        l("flink und froh sich regen!", "ágiles y contentos se mueven!", "quick and happy as they move!"),
        l("Amsel, Drossel, Fink und Star", "Mirlo, zorzal, pinzón y estornino", "Blackbird, thrush, finch and starling"),
        l("und die ganze Vogelschar", "y toda la bandada de pájaros", "and the whole flock of birds"),
        l("wünschen dir ein frohes Jahr,", "te desean un año feliz,", "wish you a happy year,"),
        l("lauter Heil und Segen.", "lleno de salud y bendiciones.", "full of health and blessings."),
      ],
    ],
    focus: ["Vögel", "Singen", "Frühling", "lustig", "froh", "ganze", "wünschen", "Jahr"],
    glossary: [
      ["Vogel", "pájaro", "bird", "der"],
      ["Frühling", "primavera", "spring", "der"],
      ["lustig", "alegre, divertido", "merry, funny"],
      ["froh", "contento", "glad"],
      ["Jahr", "año", "year", "das"],
    ],
  },
  {
    id: "maennlein",
    title: "Ein Männlein steht im Walde",
    credit: "Text: Hoffmann von Fallersleben (1843) · Volksweise",
    level: "A2",
    theme: { de: "Kleidung & Farben", tr: { es: "Ropa y colores", en: "Clothes & colours" } },
    emoji: "🍄",
    query: "Ein Männlein steht im Walde",
    spotify: "spotify:track:2KC7oHqkAGccCXC0nqNPAz",
    about: {
      es: "Es una adivinanza: un hombrecito en el bosque, sobre una sola pierna, con un abrigo rojo y una gorrita negra. ¿Quién es? La respuesta: «die Hagebutte», el fruto rojo del rosal silvestre.",
      en: "It's a riddle: a little man in the forest, on one leg, with a red coat and a little black cap. Who is it? The answer: “die Hagebutte”, the red rose hip.",
    },
    stanzas: [
      [
        l("Ein Männlein steht im Walde", "Un hombrecito está en el bosque", "A little man stands in the forest"),
        l("ganz still und stumm,", "muy quieto y callado,", "all quiet and silent,"),
        l("es hat von lauter Purpur", "lleva, todo de púrpura,", "he wears, all of purple,"),
        l("ein Mäntlein um.", "un abriguito puesto.", "a little coat."),
        l("Sagt, wer mag das Männlein sein,", "Digan, ¿quién será el hombrecito", "Say, who might the little man be,"),
        l("das da steht im Wald allein", "que está solo en el bosque", "who stands there alone in the forest"),
        l("mit dem purpurroten Mäntelein?", "con el abriguito rojo púrpura?", "with the purple-red little coat?"),
      ],
      [
        l("Das Männlein steht im Walde", "El hombrecito está en el bosque", "The little man stands in the forest"),
        l("auf einem Bein", "sobre una sola pierna", "on one leg"),
        l("und hat auf seinem Haupte", "y lleva en la cabeza", "and has on his head"),
        l("schwarz Käpplein klein.", "una gorrita negra y pequeña.", "a little black cap."),
        l("Sagt, wer mag das Männlein sein,", "Digan, ¿quién será el hombrecito", "Say, who might the little man be,"),
        l("das da steht im Wald allein", "que está solo en el bosque", "who stands there alone in the forest"),
        l("mit dem kleinen schwarzen Käppelein?", "con la pequeña gorrita negra?", "with the little black cap?"),
      ],
    ],
    focus: ["steht", "Walde", "still", "allein", "Bein", "schwarz", "klein", "kleinen", "schwarzen", "Wald"],
    glossary: [
      ["Mantel", "abrigo", "coat", "der"],
      ["Bein", "pierna", "leg", "das"],
      ["schwarz", "negro", "black"],
      ["rot", "rojo", "red"],
      ["still", "quieto, callado", "quiet"],
    ],
  },
  {
    id: "guten-abend",
    title: "Guten Abend, gut’ Nacht",
    credit: "Text: Des Knaben Wunderhorn (1808) und Georg Scherer (1849) · Musik: Johannes Brahms (1868)",
    level: "A2",
    theme: { de: "Zeit & Alltag", tr: { es: "El tiempo y el día a día", en: "Time & daily life" } },
    emoji: "🌙",
    query: "Guten Abend gut Nacht Brahms Wiegenlied",
    spotify: "spotify:track:6fMSOKjoxqQOZZLWYXNEkp",
    about: {
      es: "La canción de cuna de Brahms, conocida en todo el mundo. Aquí ves cómo se dice buenas noches y «mañana temprano» (morgen früh).",
      en: "Brahms' lullaby, known all over the world. Here you see how to say good night and “tomorrow early” (morgen früh).",
    },
    stanzas: [
      [
        l("Guten Abend, gut’ Nacht,", "Buenas tardes, buenas noches,", "Good evening, good night,"),
        l("mit Rosen bedacht,", "cubierto de rosas,", "covered with roses,"),
        l("mit Näglein besteckt,", "adornado de claveles,", "decked with carnations,"),
        l("schlupf unter die Deck’!", "¡métete bajo la cobija!", "slip under the blanket!"),
        l("Morgen früh, wenn Gott will,", "Mañana temprano, si Dios quiere,", "Tomorrow morning, God willing,"),
        l("wirst du wieder geweckt.", "te despertarán otra vez.", "you'll be woken again."),
      ],
      [
        l("Guten Abend, gut’ Nacht,", "Buenas tardes, buenas noches,", "Good evening, good night,"),
        l("von Englein bewacht,", "cuidado por angelitos,", "watched over by little angels,"),
        l("die zeigen im Traum", "que en el sueño", "who show you in your dream"),
        l("dir Christkindleins Baum.", "te muestran el árbol del Niño Dios.", "the Christ Child's tree."),
        l("Schlaf nun selig und süß,", "Duerme ahora feliz y dulce,", "Now sleep blissfully and sweetly,"),
        l("schau im Traum ’s Paradies.", "mira el paraíso en tu sueño.", "see paradise in your dream."),
      ],
    ],
    focus: ["Abend", "Nacht", "Rosen", "Morgen", "früh", "wieder", "Traum", "Schlaf", "süß"],
    glossary: [
      ["Abend", "tarde, noche (temprano)", "evening", "der"],
      ["Nacht", "noche", "night", "die"],
      ["morgen früh", "mañana temprano", "tomorrow morning"],
      ["Traum", "sueño", "dream", "der"],
      ["schlafen", "dormir", "to sleep"],
    ],
  },
  {
    id: "gedanken-frei",
    title: "Die Gedanken sind frei",
    credit: "Volkslied (um 1800), Fassung nach Hoffmann von Fallersleben (1842)",
    level: "B1",
    theme: { de: "Gefühle & Freiheit", tr: { es: "Sentimientos y libertad", en: "Feelings & freedom" } },
    emoji: "🕊️",
    query: "Die Gedanken sind frei",
    spotify: "spotify:track:0LluXxFJfGEM4mWjtz2Qeh",
    about: {
      es: "Una de las canciones más queridas de Alemania: nadie puede quitarte lo que piensas. Se ha cantado en muchos momentos de la historia como canción de libertad.",
      en: "One of Germany's best-loved songs: nobody can take away your thoughts. It has been sung at many moments in history as a song of freedom.",
    },
    stanzas: [
      [
        l("Die Gedanken sind frei,", "Los pensamientos son libres,", "Thoughts are free,"),
        l("wer kann sie erraten?", "¿quién puede adivinarlos?", "who can guess them?"),
        l("Sie fliegen vorbei", "Pasan volando", "They fly by"),
        l("wie nächtliche Schatten.", "como sombras de la noche.", "like shadows at night."),
        l("Kein Mensch kann sie wissen,", "Nadie puede conocerlos,", "No one can know them,"),
        l("kein Jäger erschießen", "ningún cazador dispararles", "no hunter can shoot them"),
        l("mit Pulver und Blei:", "con pólvora y plomo:", "with powder and lead:"),
        l("Die Gedanken sind frei!", "¡los pensamientos son libres!", "thoughts are free!"),
      ],
      [
        l("Ich denke, was ich will", "Pienso lo que quiero", "I think what I want"),
        l("und was mich beglücket,", "y lo que me hace feliz,", "and what makes me happy,"),
        l("doch alles in der Still’", "pero todo en silencio", "but all in silence"),
        l("und wie es sich schicket.", "y como corresponde.", "and as is fitting."),
        l("Mein Wunsch und Begehren", "Mi deseo y mi anhelo", "My wish and desire"),
        l("kann niemand verwehren,", "nadie me los puede negar,", "no one can deny,"),
        l("es bleibet dabei:", "así seguirá siendo:", "it stays that way:"),
        l("Die Gedanken sind frei!", "¡los pensamientos son libres!", "thoughts are free!"),
      ],
    ],
    focus: ["Gedanken", "frei", "fliegen", "Mensch", "wissen", "denke", "will", "Wunsch", "niemand"],
    glossary: [
      ["Gedanke", "pensamiento", "thought", "der"],
      ["frei", "libre", "free"],
      ["denken", "pensar", "to think"],
      ["Wunsch", "deseo", "wish", "der"],
      ["niemand", "nadie", "nobody"],
    ],
  },
  {
    id: "mond-aufgegangen",
    title: "Der Mond ist aufgegangen",
    credit: "Text: Matthias Claudius (1779) · Musik: Johann Abraham Peter Schulz (1790)",
    level: "B1",
    theme: { de: "Natur & Nacht", tr: { es: "Naturaleza y noche", en: "Nature & night" } },
    emoji: "🌕",
    query: "Der Mond ist aufgegangen",
    spotify: "spotify:track:1ylE2TrrytPVCYZXV9ogFw",
    about: {
      es: "Una canción de la tarde que muchas familias alemanas cantan antes de dormir. Describe la luna, las estrellas, el bosque oscuro y la niebla sobre los prados.",
      en: "An evening song many German families sing before bed. It describes the moon, the stars, the dark forest and the mist over the meadows.",
    },
    stanzas: [
      [
        l("Der Mond ist aufgegangen,", "La luna ha salido,", "The moon has risen,"),
        l("die goldnen Sternlein prangen", "las estrellitas doradas brillan", "the little golden stars shine"),
        l("am Himmel hell und klar;", "en el cielo, claras y luminosas;", "in the sky, bright and clear;"),
        l("der Wald steht schwarz und schweiget,", "el bosque está negro y callado,", "the forest stands black and silent,"),
        l("und aus den Wiesen steiget", "y de los prados sube", "and from the meadows rises"),
        l("der weiße Nebel wunderbar.", "la blanca niebla, maravillosa.", "the white mist, wonderful."),
      ],
      [
        l("Wie ist die Welt so stille", "Qué tranquilo está el mundo", "How still the world is"),
        l("und in der Dämmrung Hülle", "y, envuelto en el crepúsculo,", "and, wrapped in twilight,"),
        l("so traulich und so hold!", "¡tan acogedor y tan dulce!", "so cosy and so lovely!"),
        l("Als eine stille Kammer,", "Como un cuarto silencioso", "Like a quiet chamber"),
        l("wo ihr des Tages Jammer", "donde las penas del día", "where you shall sleep away"),
        l("verschlafen und vergessen sollt.", "deben dormirse y olvidarse.", "and forget the day's sorrows."),
      ],
    ],
    focus: ["Mond", "Himmel", "hell", "klar", "Wald", "schwarz", "Wiesen", "weiße", "Nebel", "Welt", "vergessen"],
    glossary: [
      ["Mond", "luna", "moon", "der"],
      ["Himmel", "cielo", "sky", "der"],
      ["Stern", "estrella", "star", "der"],
      ["Nebel", "niebla", "fog, mist", "der"],
      ["vergessen", "olvidar", "to forget"],
    ],
  },
  {
    id: "lorelei",
    title: "Die Lorelei",
    credit: "Text: Heinrich Heine (1824) · Musik: Friedrich Silcher (1837)",
    level: "B1",
    theme: { de: "Reisen & Legenden", tr: { es: "Viajes y leyendas", en: "Travel & legends" } },
    emoji: "🧜‍♀️",
    query: "Ich weiß nicht was soll es bedeuten Lorelei Silcher",
    spotify: "spotify:track:4WYdR57KwZaGU43sKM4KLB",
    about: {
      es: "La leyenda de la roca Lorelei, sobre el río Rin: una joven peina su cabello dorado y canta tan bonito que los barqueros se distraen. Puedes visitar la roca entre Coblenza y Maguncia.",
      en: "The legend of the Lorelei rock on the Rhine: a young woman combs her golden hair and sings so beautifully that the boatmen get distracted. You can visit the rock between Koblenz and Mainz.",
    },
    stanzas: [
      [
        l("Ich weiß nicht, was soll es bedeuten,", "No sé qué puede significar", "I don't know what it should mean"),
        l("dass ich so traurig bin;", "que esté tan triste;", "that I am so sad;"),
        l("ein Märchen aus alten Zeiten,", "un cuento de tiempos antiguos", "a fairy tale from olden times"),
        l("das kommt mir nicht aus dem Sinn.", "no se me va de la cabeza.", "won't leave my mind."),
        l("Die Luft ist kühl und es dunkelt,", "El aire está fresco y oscurece,", "The air is cool and it's getting dark,"),
        l("und ruhig fließt der Rhein;", "y el Rin fluye tranquilo;", "and the Rhine flows calmly;"),
        l("der Gipfel des Berges funkelt", "la cima de la montaña brilla", "the mountain peak sparkles"),
        l("im Abendsonnenschein.", "con el sol de la tarde.", "in the evening sunshine."),
      ],
      [
        l("Die schönste Jungfrau sitzet", "La doncella más hermosa está sentada", "The fairest maiden sits"),
        l("dort oben wunderbar,", "allá arriba, maravillosa,", "up there, wonderful,"),
        l("ihr goldnes Geschmeide blitzet,", "sus joyas doradas destellan,", "her golden jewels flash,"),
        l("sie kämmt ihr goldenes Haar.", "se peina su cabello dorado.", "she combs her golden hair."),
        l("Sie kämmt es mit goldenem Kamme", "Lo peina con un peine dorado", "She combs it with a golden comb"),
        l("und singt ein Lied dabei;", "y mientras canta una canción;", "and sings a song as she does;"),
        l("das hat eine wundersame,", "una canción de melodía", "it has a wondrous,"),
        l("gewaltige Melodei.", "maravillosa y poderosa.", "mighty melody."),
      ],
    ],
    focus: ["weiß", "traurig", "Märchen", "Zeiten", "Luft", "kühl", "ruhig", "Berges", "schönste", "Haar", "Lied"],
    glossary: [
      ["traurig", "triste", "sad"],
      ["Märchen", "cuento de hadas", "fairy tale", "das"],
      ["Luft", "aire", "air", "die"],
      ["Berg", "montaña", "mountain", "der"],
      ["Haar", "cabello", "hair", "das"],
      ["Lied", "canción", "song", "das"],
    ],
  },
  {
    id: "ode-freude",
    title: "Ode an die Freude",
    credit: "Text: Friedrich Schiller (1785/1808) · Musik: Ludwig van Beethoven, 9. Sinfonie (1824)",
    level: "B2",
    theme: { de: "Kultur & Europa", tr: { es: "Cultura y Europa", en: "Culture & Europe" } },
    emoji: "🎻",
    query: "Freude schöner Götterfunken Beethoven 9 Ode an die Freude",
    spotify: "spotify:track:2nGa3CuSK9t7sQ8308DwpG",
    about: {
      es: "El poema de Schiller que Beethoven puso en su Novena Sinfonía. Su melodía es el himno de la Unión Europea. Lenguaje poético y antiguo: ideal para el B2.",
      en: "Schiller's poem that Beethoven set in his Ninth Symphony. Its melody is the anthem of the European Union. Poetic, old-fashioned language: great for B2.",
    },
    stanzas: [
      [
        l("Freude, schöner Götterfunken,", "Alegría, hermosa chispa divina,", "Joy, beautiful spark of the gods,"),
        l("Tochter aus Elysium,", "hija del Elíseo,", "daughter of Elysium,"),
        l("wir betreten feuertrunken,", "entramos ebrios de fuego,", "we enter, drunk with fire,"),
        l("Himmlische, dein Heiligtum!", "¡oh celestial, en tu santuario!", "heavenly one, your sanctuary!"),
        l("Deine Zauber binden wieder,", "Tu magia vuelve a unir", "Your magic binds again"),
        l("was die Mode streng geteilt;", "lo que la costumbre separó con rigor;", "what custom strictly divided;"),
        l("alle Menschen werden Brüder,", "todos los seres humanos se vuelven hermanos", "all people become brothers"),
        l("wo dein sanfter Flügel weilt.", "donde reposa tu ala suave.", "where your gentle wing rests."),
      ],
    ],
    focus: ["Freude", "schöner", "Tochter", "wieder", "Menschen", "Brüder", "sanfter"],
    glossary: [
      ["Freude", "alegría", "joy", "die"],
      ["Tochter", "hija", "daughter", "die"],
      ["Mensch", "ser humano, persona", "human being", "der"],
      ["Bruder", "hermano", "brother", "der"],
      ["sanft", "suave", "gentle"],
    ],
  },
];

export const SONG_LEVELS = ["A1", "A2", "B1", "B2"] as const;
export const getSong = (id: string) => SONGS.find((s) => s.id === id);
