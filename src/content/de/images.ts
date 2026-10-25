/**
 * Imagen (emoji de Twemoji) para cada palabra del vocabulario.
 * La clave es la palabra tal como aparece en el vocabulario (sin artículo).
 * Los SVG se copian a public/emoji/ con scripts/copy-emoji.ts.
 * Ilustraciones: Twemoji © Twitter/X y colaboradores, licencia CC-BY 4.0.
 */
export const IMAGES: Record<string, string> = {
  // 1 Saludos
  Hallo: "👋", "Guten Morgen": "🌅", "Guten Tag": "☀️", "Guten Abend": "🌆", "Gute Nacht": "🌙", Tschüss: "👋",
  "Auf Wiedersehen": "🤝", "Bis später": "⏳", Name: "🏷️", "Wie geht's?": "🙂", "Freut mich": "😊",
  "Herzlich willkommen": "🎉", "Vielen Dank": "🙏", Sprachkurs: "🗣️", Morgen: "🌅", Abend: "🌆", Nacht: "🌙",
  Familie: "👨‍👩‍👧", Rezeption: "🛎️",
  // 2 Alfabeto
  Alphabet: "🔤", Buchstabe: "🔠", buchstabieren: "🔡", Umlaut: "🇩🇪", aussprechen: "👄", langsam: "🐢",
  "noch einmal": "🔁", Wein: "🍷", Wien: "🇦🇹", Brief: "✉️", Haus: "🏠", Schule: "🏫", Sprachschule: "🏫",
  // 3 Países e idiomas
  Sprache: "🗣️", sprechen: "🗣️", "ein bisschen": "🤏", gut: "👍", fließend: "🌊", Muttersprache: "❤️",
  Frankreich: "🇫🇷", Italien: "🇮🇹", Brasilien: "🇧🇷", Peru: "🇵🇪", Chile: "🇨🇱", England: "🇬🇧", Türkei: "🇹🇷",
  USA: "🇺🇸", Niederlande: "🇳🇱", China: "🇨🇳", Französisch: "🇫🇷", Italienisch: "🇮🇹", Portugiesisch: "🇵🇹",
  Arabisch: "🇸🇦", Türkisch: "🇹🇷", Chinesisch: "🇨🇳", Kurs: "📚", Lehrerin: "👩‍🏫", Lehrer: "👨‍🏫", Teilnehmer: "🙋",
  // 4 Números
  Zahl: "🔢", null: "0️⃣", eins: "1️⃣", zwei: "2️⃣", drei: "3️⃣", vier: "4️⃣", fünf: "5️⃣", sechs: "6️⃣", sieben: "7️⃣",
  acht: "8️⃣", neun: "9️⃣", zehn: "🔟", Telefonnummer: "☎️", Handynummer: "📱", Handy: "📱", Alter: "🎂",
  "Jahre alt": "🎂", "sehr gut": "😄", "nicht so gut": "😕", "Es geht": "😐",
  // 5 Familia
  Mutter: "👩", Vater: "👨", Eltern: "👫", Bruder: "👦", Schwester: "👧", Geschwister: "👫", Sohn: "👦", Tochter: "👧",
  Großmutter: "👵", Großvater: "👴", Großeltern: "👵", Mann: "👨", Frau: "👩", Partner: "💑", Onkel: "👨", Tante: "👩",
  verheiratet: "💍", Hund: "🐶", Katze: "🐱", Foto: "📷", Einzelkind: "🧒",
  // 6 Profesiones
  Beruf: "💼", arbeiten: "💼", studieren: "🎓", Arzt: "🧑‍⚕️", Ingenieur: "👷", Verkäufer: "🧑‍💼", Koch: "🧑‍🍳",
  Student: "🧑‍🎓", Krankenpfleger: "🧑‍⚕️", Kellner: "🤵", Programmierer: "🧑‍💻", Friseur: "💇", Rentner: "👴",
  Firma: "🏢", Krankenhaus: "🏥", Restaurant: "🍽️", Universität: "🎓", Medizin: "💊", Informatik: "💻",
  // 7 Precios
  hundert: "💯", Preis: "🏷️", Euro: "💶", Cent: "🪙", teuer: "💸", billig: "🪙", günstig: "👌", Flohmarkt: "🛍️",
  Lampe: "💡", Tisch: "🪑", Stuhl: "🪑", Fahrrad: "🚲", Uhr: "🕒",
  // 8 Objetos
  Kaffee: "☕", Computer: "🖥️", Zeitung: "📰", Tasche: "👜", Buch: "📕", Mädchen: "👧", Zimmer: "🚪", Auto: "🚗",
  Tür: "🚪", Haustür: "🚪", Schlüssel: "🔑", Hausschlüssel: "🔑", Brötchen: "🥖", Montag: "📅", Sommer: "🏖️",
  Information: "ℹ️", Zentrum: "🏙️", Hotel: "🏨",
  // 9 Clase
  Kursraum: "🏫", Stift: "🖊️", Kuli: "🖊️", Bleistift: "✏️", Heft: "📓", Wörterbuch: "📖", Blatt: "📄", Papier: "📄",
  Tafel: "🧑‍🏫", Fenster: "🪟", Laptop: "💻", Hausaufgabe: "📝", Seite: "📄", "Hören Sie": "👂", "Lesen Sie": "📖",
  "Schreiben Sie": "✍️", "Ich verstehe das nicht.": "🤷",
  // 10 Hora
  Uhrzeit: "🕒", Stunde: "⏰", Minute: "⏱️", Viertel: "🕒", halb: "🕧", "Wie spät ist es?": "⌚", Mittag: "🕛",
  Mitternacht: "🌃", Film: "🎬", Zug: "🚆", Gleis: "🛤️", Abfahrt: "🚉", pünktlich: "⏰", spät: "🐌", früh: "🐓",
  Verspätung: "⌛", Durchsage: "📢", Kino: "🍿", geschlossen: "🔒", Bäckerei: "🥐", Brot: "🍞",
  // 11 Días y meses
  Wochenende: "🛋️", Januar: "❄️", Februar: "❄️", März: "🌱", April: "🌷", Mai: "🌸", Juni: "🌞", Juli: "🏖️",
  August: "🌻", September: "🍂", Oktober: "🎃", November: "🍁", Dezember: "🎄", Frühling: "🌷", Herbst: "🍂",
  Winter: "⛄", Monat: "🗓️", Geburtstag: "🎂", Termin: "📌", Feiertag: "🎉", Fußball: "⚽", Yoga: "🧘", Schwimmen: "🏊",
  // 12 Rutina
  frühstücken: "🥐", Frühstück: "🍳", Mittagessen: "🍲", Abendessen: "🍝", duschen: "🚿", Büro: "🏢",
  "nach Hause": "🏠", "zu Hause": "🏡", schlafen: "😴", fahren: "🚗", essen: "🍴", lesen: "📖", sehen: "👀",
  Bus: "🚌", "U-Bahn": "🚇", "spazieren gehen": "🚶", Serie: "📺", Nachtschicht: "🌙", aufstehen: "⏰",
  Nachrichten: "📰", Kollege: "🧑‍💼",
  // 13 Pasatiempos
  Hobby: "🎨", Freizeit: "🏝️", gern: "😊", spielen: "🎲", Tennis: "🎾", Gitarre: "🎸", Klavier: "🎹", Musik: "🎵",
  tanzen: "💃", schwimmen: "🏊", joggen: "🏃", wandern: "🥾", reisen: "✈️", kochen: "🍳", fotografieren: "📸",
  malen: "🎨", "Rad fahren": "🚴", Computerspiele: "🎮", Sport: "🏅", "Freunde treffen": "👯", Park: "🌳",
  nie: "🚫", immer: "♾️",
  // 14 Comida
  Lebensmittel: "🛒", Getränk: "🥤", Apfel: "🍎", Banane: "🍌", Orange: "🍊", Obst: "🍇", Gemüse: "🥦", Tomate: "🍅",
  Kartoffel: "🥔", Salat: "🥗", Käse: "🧀", Butter: "🧈", Ei: "🥚", Fleisch: "🥩", Fisch: "🐟", Hähnchen: "🍗",
  Wurst: "🌭", Reis: "🍚", Nudeln: "🍝", Suppe: "🍲", Kuchen: "🍰", Schokolade: "🍫", Wasser: "💧", Saft: "🧃",
  Milch: "🥛", Tee: "🍵", Bier: "🍺", lecker: "😋", gesund: "💪", Vegetarier: "🥕", Lieblingsessen: "😍", Arepa: "🫓",
  // 15 Café
  Café: "☕", Speisekarte: "📋", Kellnerin: "🤵‍♀️", Gast: "🧑", bestellen: "🗒️", bezahlen: "💳", zahlen: "💳",
  Trinkgeld: "🪙", Rechnung: "🧾", Tasse: "☕", Glas: "🥛", Stück: "🍰", Flasche: "🍾", Cappuccino: "☕",
  Espresso: "☕", Apfelkuchen: "🥧", Käsekuchen: "🍰", Mineralwasser: "💧", Orangensaft: "🧃", Sahne: "🍦", Zucker: "🍬",
  // 16 Compras
  einkaufen: "🛒", Supermarkt: "🏪", Markt: "🧺", Einkaufszettel: "📝", Kasse: "🧾", Angebot: "🏷️", Kilo: "⚖️",
  Gramm: "⚖️", Liter: "🧴", Packung: "📦", Dose: "🥫", Becher: "🥛", Tüte: "🛍️", Joghurt: "🥛", Mehl: "🌾",
  Öl: "🫒", Salz: "🧂", Zwiebel: "🧅", Karotte: "🥕", Erdbeere: "🍓", Hackfleisch: "🥩", Schinken: "🥓",
  Pizza: "🍕", Spaghetti: "🍝", Verkäuferin: "🧑‍💼", Kunde: "🧑", Party: "🥳", Oma: "👵", Plastiktüte: "🛍️",
  frisch: "🌿",
  // 17 Ropa y colores
  Farbe: "🎨", rot: "🔴", blau: "🔵", grün: "🟢", gelb: "🟡", schwarz: "⚫", weiß: "⚪", braun: "🟤",
  orange: "🟠", lila: "🟣", rosa: "🌸", Kleidung: "👕", Hose: "👖", Jeans: "👖", Hemd: "👔", "T-Shirt": "👕",
  Bluse: "👚", Pullover: "🧥", Jacke: "🧥", Mantel: "🧥", Kleid: "👗", Rock: "👗", Schuh: "👟", Mütze: "🧢",
  Socke: "🧦", Größe: "📏", anprobieren: "🪞", Geschäft: "🏬", Sale: "🏷️", schick: "✨", bequem: "😌",
  langweilig: "🥱", hässlich: "🙈",
  // 18 Vivienda
  Wohnung: "🏢", Wohnzimmer: "🛋️", Schlafzimmer: "🛏️", Kinderzimmer: "🧸", Küche: "🍳", Bad: "🛁", Flur: "🚪",
  Balkon: "🪴", Garten: "🌳", Möbel: "🪑", Bett: "🛏️", Schrank: "🗄️", Sofa: "🛋️", Sessel: "🪑", Regal: "📚",
  Teppich: "🟫", Kühlschrank: "🧊", Herd: "🍳", Waschmaschine: "🧺", Dusche: "🚿", Badewanne: "🛁", Miete: "💶",
  ruhig: "🤫", laut: "📢", gemütlich: "🕯️", klein: "🐭", groß: "🐘", alt: "🏚️", neu: "✨", Mitbewohner: "🧑‍🤝‍🧑",
  // 19 Clima
  Wetter: "🌦️", Sonne: "☀️", Regen: "🌧️", Schnee: "❄️", Wind: "💨", Wolke: "☁️", Gewitter: "⛈️", Nebel: "🌫️",
  Grad: "🌡️", Temperatur: "🌡️", Wetterbericht: "📺", Regenschirm: "☂️", "Es regnet.": "🌧️", "Es schneit.": "🌨️",
  "Die Sonne scheint.": "🌞", sonnig: "☀️", bewölkt: "☁️", windig: "💨", neblig: "🌫️", warm: "🌤️", heiß: "🥵",
  kalt: "🥶", kühl: "🍃", nass: "💦", Norden: "⬆️", Süden: "⬇️", Osten: "➡️", Westen: "⬅️", Strand: "🏖️",
  Berg: "⛰️", "Ski fahren": "⛷️", draußen: "🌳",
  // 20 Repaso
  Test: "📝", Wohnort: "📍", Schild: "🪧", Eingang: "🚪", Ausgang: "🚪", geöffnet: "🔓", Anmeldung: "🛎️",
  Aufzug: "🛗", Treppe: "🪜", kaputt: "🛠️", fit: "💪",
};

/** Nombre del archivo SVG de Twemoji para un emoji (sin el selector de variante FE0F). */
export function emojiCode(emoji: string) {
  // Regla de Twemoji: se quita FE0F salvo en secuencias con ZWJ (200D)
  const all = Array.from(emoji).map((c) => c.codePointAt(0)!);
  const cps = all.includes(0x200d) ? all : all.filter((cp) => cp !== 0xfe0f);
  return cps.map((cp) => cp.toString(16)).join("-");
}

export function imageFor(word: string): string | null {
  const e = IMAGES[word];
  return e ? `/emoji/${emojiCode(e)}.svg` : null;
}
