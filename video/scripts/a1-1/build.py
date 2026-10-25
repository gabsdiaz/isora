"""
Guiones de los videos A1.1 (unidades 2–20): todo en alemán sencillo,
con traducción para los subtítulos (es / en).

Uso: python3 video/scripts/a1-1/build.py   → escribe 02.json … 20.json

Tipos de escena: title, words, timeline, tip, sentence, conjugation (tabla),
compare, dialogue, try, recap. "at" = índice de la frase (say) que muestra el elemento.
Frases sin voz = la profe (Katja). voice "m" = Conrad, "f" = Katja como personaje.
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))


def D(text, es, en, v=None):
    x = {"lang": "de", "text": text, "es": es, "en": en}
    if v:
        x["voice"] = v
    return x


def title(stickers, *say):
    return {"type": "title", "stickers": stickers, "say": list(say)}


def words(heading, gloss, items, intro):
    """items: (de, es, icon|"#big", spoken_de, spoken_es, spoken_en)"""
    say = [intro]
    out = []
    for i, (de, es, icon, sde, ses, sen) in enumerate(items, 1):
        it = {"de": de, "es": es, "at": i}
        if icon.startswith("#"):
            it["big"] = icon[1:]
        else:
            it["icon"] = icon
        out.append(it)
        say.append(D(sde, ses, sen))
    return {"type": "words", "heading": heading, "gloss": gloss, "items": out, "say": say}


def timeline(heading, gloss, items, intro, **kw):
    say = [intro]
    out = []
    for i, (de, es, icon, sde, ses, sen) in enumerate(items, 1):
        out.append({"de": de, "es": es, "icon": icon, "at": i})
        say.append(D(sde, ses, sen))
    return {"type": "timeline", "heading": heading, "gloss": gloss, "items": out, "say": say, **kw}


def tip(note, sticker, *say, **kw):
    return {"type": "tip", "note": note, "sticker": sticker, "say": list(say), **kw}


def sentence(heading, gloss, sticker, lines, say, notes=None, notesX=None):
    sc = {"type": "sentence", "heading": heading, "gloss": gloss, "sticker": sticker, "lines": lines, "say": say}
    if notesX:
        sc["notesX"] = notesX
    if notes:
        sc["notes"] = notes
    return sc


def table(heading, gloss, rows, say, example=None, sticker=None, **kw):
    sc = {"type": "conjugation", "heading": heading, "gloss": gloss, "rows": rows, "say": say, **kw}
    if example:
        sc["example"] = example
    if sticker:
        sc["sticker"] = sticker
    if not example:
        sc.setdefault("tableAt", 0)
    return sc


def R(p, stem, end, at, rest=None):
    r = {"p": p, "stem": stem, "end": end, "at": at}
    if rest:
        r["rest"] = rest
    return r


def compare(heading, left, right, say):
    return {"type": "compare", "heading": heading, "left": left, "right": right, "say": say}


def dialogue(heading, people, intro, lines):
    """lines: (who, display_de, spoken_de, es, en)"""
    say = [intro]
    out = []
    for i, (who, de, sde, es, en) in enumerate(lines, 1):
        out.append({"who": who, "de": de, "at": i})
        say.append(D(sde or de, es, en, people[who]["voice"]))
    return {"type": "dialogue", "heading": heading, "people": people, "lines": out, "say": say}


def tryit(note, say, pause=6):
    return {"type": "try", "heading": "Jetzt du!", "gloss": "¡ahora tú!", "note": note, "pause": pause, "say": [say]}


def recap(items, summary, bye=None):
    return {
        "type": "recap",
        "heading": "Das kannst du jetzt",
        "items": [{"text": t, "at": 1} for t in items],
        "say": [
            D("Super! Das kannst du jetzt:", "¡Súper! Esto ya lo puedes hacer:", "Great! Now you can:"),
            summary,
            bye or D("Bis bald!", "¡Hasta pronto!", "See you soon!"),
        ],
    }


LENA = {"icon": "👩", "voice": "f"}
MATEO = {"icon": "🧑", "voice": "m"}
LM = {"Lena": LENA, "Mateo": MATEO}

UNITS = {}

# ───────────────────────── 2 · Das Alphabet ─────────────────────────
UNITS[2] = ("Das Alphabet", "Das ABC", [
    title(["🔤", "✏️", "🗣️"],
          D("Hallo! Heute lernen wir das Alphabet.", "¡Hola! Hoy aprendemos el alfabeto.", "Hi! Today we learn the alphabet."),
          D("Und du lernst die Frage: Wie schreibt man das?", "Y aprendes la pregunta: ¿cómo se escribe?", "And you learn the question: How do you spell that?")),
    words("Das ABC", "el abecedario", [
        ("A wie Apfel", "manzana", "🍎", "A wie Apfel.", "A, como Apfel (manzana).", "A as in Apfel (apple)."),
        ("B wie Ball", "balón", "⚽", "B wie Ball.", "B, como Ball (balón).", "B as in Ball."),
        ("C wie Clown", "payaso", "🤡", "C wie Clown.", "C, como Clown (payaso).", "C as in Clown."),
        ("D wie Delfin", "delfín", "🐬", "D wie Delfin.", "D, como Delfin (delfín).", "D as in Delfin (dolphin)."),
        ("E wie Elefant", "elefante", "🐘", "E wie Elefant.", "E, como Elefant (elefante).", "E as in Elefant (elephant)."),
        ("F wie Fisch", "pez", "🐟", "F wie Fisch.", "F, como Fisch (pez).", "F as in Fisch (fish)."),
    ], D("Das Alphabet hat sechsundzwanzig Buchstaben. Hör zu:", "El alfabeto tiene 26 letras. Escucha:", "The alphabet has 26 letters. Listen:")),
    words("ä · ö · ü · ß", "letras especiales", [
        ("ä – Käse", "queso", "🧀", "ä wie Käse.", "ä, como Käse (queso).", "ä as in Käse (cheese)."),
        ("ö – schön", "bonito", "🌸", "ö wie schön.", "ö, como schön (bonito).", "ö as in schön (beautiful)."),
        ("ü – fünf", "cinco", "🖐️", "ü wie fünf.", "ü, como fünf (cinco).", "ü as in fünf (five)."),
        ("ß – Straße", "calle", "🛣️", "ß wie Straße. Das klingt wie ein doppeltes s.", "ß, como Straße (calle). Suena como una doble s.", "ß as in Straße (street). It sounds like a double s."),
    ], D("Deutsch hat auch besondere Buchstaben. Hör gut zu:", "El alemán también tiene letras especiales. Escucha bien:", "German also has special letters. Listen carefully:")),
    tip("ei → ai\nie → i", "🍷",
        D("Achtung! Zwei Buchstaben, ein Laut. ei sagen wir wie ai:", "¡Ojo! Dos letras, un sonido. ei se dice como ai:", "Careful! Two letters, one sound. We say ei like ai:"),
        D("mein, drei, Wein.", "mein, drei, Wein.", "mein, drei, Wein."),
        D("Und ie sagen wir wie ein langes i:", "Y ie se dice como una i larga:", "And we say ie like a long i:"),
        D("Wien, Brief, sie.", "Wien, Brief, sie.", "Wien, Brief, sie.")),
    sentence("Wie schreibt man das?", "¿cómo se escribe?", "📝", [
        {"de": "Wie schreibt man das?", "es": "¿Cómo se escribe?", "mark": "schreibt", "at": 1},
        {"de": "L – E – N – A", "es": "L – E – N – A", "at": 3},
    ], [
        D("Du verstehst einen Namen nicht? Dann fragst du:", "¿No entiendes un nombre? Entonces preguntas:", "You don't understand a name? Then you ask:"),
        D("Wie schreibt man das?", "¿Cómo se escribe?", "How do you spell that?", "m"),
        D("Und die Person buchstabiert:", "Y la persona deletrea:", "And the person spells:"),
        D("Lena. L, E, N, A.", "Lena. L, E, N, A.", "Lena. L, E, N, A.", "f"),
    ]),
    dialogue("In der Sprachschule", {"Herr Weber": {"icon": "🧔", "voice": "m"}, "Ana": {"icon": "👩", "voice": "f"}},
             D("Hör zu: Ana ist in der Sprachschule.", "Escucha: Ana está en la escuela de idiomas.", "Listen: Ana is at the language school."), [
        ("Herr Weber", "Wie heißen Sie, bitte?", None, "¿Cómo se llama, por favor?", "What's your name, please?"),
        ("Ana", "Ana Gómez.", None, "Ana Gómez.", "Ana Gómez."),
        ("Herr Weber", "Wie schreibt man das?", None, "¿Cómo se escribe?", "How do you spell that?"),
        ("Ana", "G – O – M – E – Z.", "G, O, M, E, Z.", "G – O – M – E – Z.", "G – O – M – E – Z."),
        ("Herr Weber", "Danke, Frau Gómez!", None, "¡Gracias, señora Gómez!", "Thank you, Ms Gómez!"),
    ]),
    tryit("Buchstabiere\ndeinen Namen!", D("Jetzt du! Buchstabiere deinen Namen. Langsam!", "¡Ahora tú! Deletrea tu nombre. ¡Despacio!", "Now you! Spell your name. Slowly!")),
    recap(["A wie Apfel, B wie Ball", "ä · ö · ü · ß", "ei = ai · ie = i", "Wie schreibt man das?"],
          D("Du kennst das Alphabet und die Umlaute. Und du kannst deinen Namen buchstabieren.", "Conoces el alfabeto y las diéresis. Y puedes deletrear tu nombre.", "You know the alphabet and the umlauts. And you can spell your name.")),
])

# ───────────────────────── 3 · Woher kommst du? ─────────────────────────
UNITS[3] = ("Woher kommst du?", "Länder und Sprachen", [
    title(["🌍", "🗣️", "✈️"],
          D("Hallo! Heute geht es um Länder und Sprachen.", "¡Hola! Hoy hablamos de países e idiomas.", "Hi! Today is about countries and languages."),
          D("Woher kommst du? Wo wohnst du? Was sprichst du?", "¿De dónde eres? ¿Dónde vives? ¿Qué idiomas hablas?", "Where are you from? Where do you live? What do you speak?")),
    words("Länder", "países", [
        ("Kolumbien", "Colombia", "🇨🇴", "Kolumbien", "Colombia", "Colombia"),
        ("Mexiko", "México", "🇲🇽", "Mexiko", "México", "Mexico"),
        ("Spanien", "España", "🇪🇸", "Spanien", "España", "Spain"),
        ("Deutschland", "Alemania", "🇩🇪", "Deutschland", "Alemania", "Germany"),
        ("Österreich", "Austria", "🇦🇹", "Österreich", "Austria", "Austria"),
        ("die Schweiz", "Suiza", "🇨🇭", "die Schweiz", "Suiza", "Switzerland"),
    ], D("Hier sind ein paar Länder:", "Aquí hay algunos países:", "Here are a few countries:")),
    sentence("Woher? Wo?", "¿de dónde? ¿dónde?", "🏠", [
        {"de": "Ich komme aus Peru.", "es": "Soy de Perú.", "mark": "aus", "at": 1},
        {"de": "Ich wohne in Berlin.", "es": "Vivo en Berlín.", "mark": "in", "at": 3},
    ], [
        D("Woher kommst du? Hör zu:", "¿De dónde eres? Escucha:", "Where are you from? Listen:"),
        D("Ich komme aus Peru.", "Soy de Perú.", "I'm from Peru.", "m"),
        D("Ich komme aus … das ist mein Land. Und wo wohne ich?", "Ich komme aus… es mi país. ¿Y dónde vivo?", "Ich komme aus… that's my country. And where do I live?"),
        D("Ich wohne in Berlin.", "Vivo en Berlín.", "I live in Berlin.", "m"),
        D("Ich wohne in … das ist meine Stadt.", "Ich wohne in… es mi ciudad.", "Ich wohne in… that's my city."),
    ]),
    table("wohnen", "vivir", [R("ich", "wohn", "e", 3), R("du", "wohn", "st", 4), R("er / sie", "wohn", "t", 5), R("wir", "wohn", "en", 6)], [
        D("Jetzt das Verb wohnen. Hör zu:", "Ahora el verbo wohnen (vivir). Escucha:", "Now the verb wohnen (to live). Listen:"),
        D("Wir wohnen in Bogotá.", "Vivimos en Bogotá.", "We live in Bogotá.", "f"),
        D("Schau auf das Ende:", "Mira el final:", "Look at the ending:"),
        D("ich wohne", "yo vivo", "I live"),
        D("du wohnst", "tú vives", "you live"),
        D("er wohnt, sie wohnt", "él vive, ella vive", "he lives, she lives"),
        D("wir wohnen", "nosotros vivimos", "we live"),
    ], example={"de": "Wir wohnen in Bogotá.", "es": "Vivimos en Bogotá.", "at": 1}, sticker="🏡"),
    compare("sprechen", {"title": "ich", "icon": "🙋", "gloss": "yo hablo", "example": "ich spreche", "at": 1},
            {"title": "du", "icon": "🧑", "gloss": "tú hablas", "example": "du sprichst", "at": 3}, [
        D("Das Verb sprechen ist besonders. Mit ich sagen wir:", "El verbo sprechen (hablar) es especial. Con ich decimos:", "The verb sprechen (to speak) is special. With ich we say:"),
        D("Ich spreche Spanisch.", "Hablo español.", "I speak Spanish.", "f"),
        D("Aber mit du wird das e zu i:", "Pero con du la e se vuelve i:", "But with du the e becomes i:"),
        D("Du sprichst Deutsch.", "Hablas alemán.", "You speak German.", "m"),
        D("Und auch: er spricht, sie spricht.", "Y también: él habla, ella habla.", "And also: he speaks, she speaks."),
    ]),
    dialogue("Im Deutschkurs", {"Jonas": {"icon": "🧔", "voice": "m"}, "Sofía": {"icon": "👩", "voice": "f"}},
             D("Hör zu: Sofía und Jonas sind im Deutschkurs.", "Escucha: Sofía y Jonas están en el curso de alemán.", "Listen: Sofía and Jonas are in German class."), [
        ("Jonas", "Woher kommst du, Sofía?", None, "¿De dónde eres, Sofía?", "Where are you from, Sofía?"),
        ("Sofía", "Ich komme aus Mexiko.", None, "Soy de México.", "I'm from Mexico."),
        ("Jonas", "Und wo wohnst du?", None, "¿Y dónde vives?", "And where do you live?"),
        ("Sofía", "Ich wohne in Hamburg.", None, "Vivo en Hamburgo.", "I live in Hamburg."),
        ("Jonas", "Welche Sprachen sprichst du?", None, "¿Qué idiomas hablas?", "Which languages do you speak?"),
        ("Sofía", "Spanisch und Englisch.", None, "Español e inglés.", "Spanish and English."),
    ]),
    tryit("Ich komme aus …\nIch wohne in …\nIch spreche …", D("Jetzt du! Woher kommst du? Wo wohnst du? Welche Sprachen sprichst du?", "¡Ahora tú! ¿De dónde eres? ¿Dónde vives? ¿Qué idiomas hablas?", "Now you! Where are you from? Where do you live? Which languages do you speak?"), pause=7),
    recap(["Ich komme aus …", "Ich wohne in …", "ich spreche · du sprichst", "ein bisschen Deutsch"],
          D("Du sagst, woher du kommst, wo du wohnst und welche Sprachen du sprichst.", "Dices de dónde eres, dónde vives y qué idiomas hablas.", "You say where you're from, where you live and which languages you speak.")),
])

# ───────────────────────── 4 · Zahlen bis 20 ─────────────────────────
UNITS[4] = ("Zahlen bis 20", "Zahlen, Alter, Wie geht's?", [
    title(["🔢", "📞", "🎂"],
          D("Hallo! Heute zählen wir von null bis zwanzig.", "¡Hola! Hoy contamos de cero a veinte.", "Hi! Today we count from zero to twenty."),
          D("Und du lernst: Wie alt bist du? Wie geht's?", "Y aprendes: ¿Cuántos años tienes? ¿Cómo estás?", "And you learn: How old are you? How are you?")),
    words("Zahlen", "números", [
        ("eins", "uno", "#1", "eins", "uno", "one"),
        ("zwei", "dos", "#2", "zwei", "dos", "two"),
        ("drei", "tres", "#3", "drei", "tres", "three"),
        ("vier", "cuatro", "#4", "vier", "cuatro", "four"),
        ("fünf", "cinco", "#5", "fünf", "cinco", "five"),
        ("sechs", "seis", "#6", "sechs", "seis", "six"),
    ], D("Wir zählen zusammen:", "Contamos juntos:", "Let's count together:")),
    words("Zahlen", "números", [
        ("sieben", "siete", "#7", "sieben", "siete", "seven"),
        ("acht", "ocho", "#8", "acht", "ocho", "eight"),
        ("neun", "nueve", "#9", "neun", "nueve", "nine"),
        ("zehn", "diez", "#10", "zehn", "diez", "ten"),
        ("elf", "once", "#11", "elf", "once", "eleven"),
        ("zwölf", "doce", "#12", "zwölf", "doce", "twelve"),
    ], D("Weiter:", "Seguimos:", "Let's go on:")),
    table("13 bis 19", "del 13 al 19", [R("13", "drei", "zehn", 1), R("14", "vier", "zehn", 2), R("16", "sech", "zehn", 3), R("17", "sieb", "zehn", 4)], [
        D("Ab dreizehn ist es einfach: Zahl plus zehn.", "Desde el trece es fácil: número más diez.", "From thirteen it's easy: number plus ten."),
        D("dreizehn", "trece", "thirteen"),
        D("vierzehn", "catorce", "fourteen"),
        D("sechzehn. Achtung: ohne s!", "dieciséis. ¡Ojo: sin s!", "sixteen. Careful: no s!"),
        D("siebzehn. Achtung: ohne en!", "diecisiete. ¡Ojo: sin en!", "seventeen. Careful: no en!"),
        D("Und dann: zwanzig!", "Y luego: ¡veinte!", "And then: twenty!"),
    ], side="zehn = 10"),
    sentence("Wie alt bist du?", "¿cuántos años tienes?", "🎂", [
        {"de": "Ich bin zwanzig.", "es": "Tengo veinte años.", "mark": "zwanzig", "at": 1},
        {"de": "Ich bin 18 Jahre alt.", "es": "Tengo 18 años.", "mark": "Jahre alt", "at": 3},
    ], [
        D("Wie alt bist du? Hör zu:", "¿Cuántos años tienes? Escucha:", "How old are you? Listen:"),
        D("Ich bin zwanzig.", "Tengo veinte años.", "I'm twenty.", "m"),
        D("Oder lang:", "O más largo:", "Or the long way:"),
        D("Ich bin achtzehn Jahre alt.", "Tengo dieciocho años.", "I'm eighteen years old.", "f"),
        D("Achtung: Auf Deutsch sagen wir sein, nicht haben!", "Ojo: en alemán se usa sein (ser), no haben (tener).", "Note: in German we use sein (to be), not haben (to have)."),
    ]),
    compare("Wie geht's?", {"title": "gut", "icon": "😀", "gloss": "bien", "example": "Danke, gut!", "at": 1},
            {"title": "schlecht", "icon": "😕", "gloss": "mal", "example": "Nicht so gut.", "at": 3}, [
        D("Wie geht's? Wenn alles gut ist, sagst du:", "¿Cómo estás? Si todo va bien, dices:", "How are you? If all is well, you say:"),
        D("Danke, gut!", "¡Bien, gracias!", "Fine, thanks!", "f"),
        D("Und wenn nicht, sagst du:", "Y si no, dices:", "And if not, you say:"),
        D("Nicht so gut.", "No muy bien.", "Not so good.", "m"),
        D("Und dann fragst du: Und dir?", "Y luego preguntas: ¿Y tú?", "And then you ask: And you?"),
    ]),
    dialogue("In der Pause", {"Tim": {"icon": "🧑", "voice": "m"}, "Paula": {"icon": "👩", "voice": "f"}},
             D("Hör zu: Paula und Tim.", "Escucha: Paula y Tim.", "Listen: Paula and Tim."), [
        ("Tim", "Hallo Paula! Wie geht's?", None, "¡Hola, Paula! ¿Cómo estás?", "Hi Paula! How are you?"),
        ("Paula", "Super, danke! Und dir?", None, "¡Súper, gracias! ¿Y tú?", "Great, thanks! And you?"),
        ("Tim", "Es geht. Wie alt bist du?", None, "Más o menos. ¿Cuántos años tienes?", "So-so. How old are you?"),
        ("Paula", "Ich bin neunzehn. Und du?", None, "Tengo diecinueve. ¿Y tú?", "I'm nineteen. And you?"),
        ("Tim", "Ich bin zwanzig.", None, "Tengo veinte.", "I'm twenty."),
    ]),
    tryit("Wie alt bist du?\nIch bin … Jahre alt.", D("Jetzt du! Wie alt bist du? Sag es laut!", "¡Ahora tú! ¿Cuántos años tienes? ¡Dilo en voz alta!", "Now you! How old are you? Say it out loud!")),
    recap(["eins, zwei, drei … zwanzig", "dreizehn = drei + zehn", "Ich bin … Jahre alt.", "Wie geht's? – Danke, gut!"],
          D("Du zählst bis zwanzig, sagst dein Alter und fragst: Wie geht's?", "Cuentas hasta veinte, dices tu edad y preguntas: ¿cómo estás?", "You count to twenty, say your age and ask: How are you?")),
])

# ───────────────────────── 5 · Meine Familie ─────────────────────────
UNITS[5] = ("Meine Familie", "Die Familie", [
    title(["👨‍👩‍👧", "❤️", "🏠"],
          D("Hallo! Heute geht es um die Familie.", "¡Hola! Hoy hablamos de la familia.", "Hi! Today is about the family."),
          D("Wer ist das? Das ist meine Mutter!", "¿Quién es? ¡Es mi mamá!", "Who is that? That's my mother!")),
    words("Die Familie", "la familia", [
        ("der Vater", "el padre", "👨", "der Vater", "el padre", "the father"),
        ("die Mutter", "la madre", "👩", "die Mutter", "la madre", "the mother"),
        ("der Bruder", "el hermano", "👦", "der Bruder", "el hermano", "the brother"),
        ("die Schwester", "la hermana", "👧", "die Schwester", "la hermana", "the sister"),
        ("der Opa", "el abuelo", "👴", "der Opa", "el abuelo", "grandpa"),
        ("die Oma", "la abuela", "👵", "die Oma", "la abuela", "grandma"),
    ], D("Das ist die Familie. Hör zu:", "Esta es la familia. Escucha:", "This is the family. Listen:")),
    table("haben", "tener", [R("ich", "hab", "e", 3), R("du", "ha", "st", 4), R("er / sie", "ha", "t", 5), R("wir", "hab", "en", 6)], [
        D("Das Verb haben ist sehr wichtig. Hör zu:", "El verbo haben (tener) es muy importante. Escucha:", "The verb haben (to have) is very important. Listen:"),
        D("Ich habe einen Bruder.", "Tengo un hermano.", "I have a brother.", "m"),
        D("Schau:", "Mira:", "Look:"),
        D("ich habe", "yo tengo", "I have"),
        D("du hast", "tú tienes", "you have"),
        D("er hat, sie hat", "él tiene, ella tiene", "he has, she has"),
        D("wir haben", "nosotros tenemos", "we have"),
    ], example={"de": "Ich habe einen Bruder.", "es": "Tengo un hermano.", "at": 1}, sticker="🐶", side=""),
    compare("mein oder meine?", {"title": "mein", "icon": "👨", "gloss": "der · das", "example": "mein Vater", "at": 1},
            {"title": "meine", "icon": "👩", "gloss": "die · plural", "example": "meine Mutter", "at": 3}, [
        D("Mein oder meine? Bei der und das sagen wir mein:", "¿Mein o meine? Con der y das decimos mein:", "Mein or meine? With der and das we say mein:"),
        D("mein Vater, mein Kind", "mi padre, mi hijo", "my father, my child"),
        D("Bei die sagen wir meine:", "Con die decimos meine:", "With die we say meine:"),
        D("meine Mutter, meine Eltern", "mi madre, mis padres", "my mother, my parents"),
        D("Und so geht auch dein und deine.", "Y así funciona también dein y deine (tu).", "And dein and deine (your) work the same way."),
    ]),
    dialogue("Geschwister", LM, D("Hör zu: Lena und Mateo sprechen über die Familie.", "Escucha: Lena y Mateo hablan de la familia.", "Listen: Lena and Mateo talk about family."), [
        ("Mateo", "Hast du Geschwister?", None, "¿Tienes hermanos?", "Do you have siblings?"),
        ("Lena", "Ja, ich habe eine Schwester.", None, "Sí, tengo una hermana.", "Yes, I have a sister."),
        ("Mateo", "Wie heißt deine Schwester?", None, "¿Cómo se llama tu hermana?", "What's your sister's name?"),
        ("Lena", "Sie heißt Anna. Und du?", None, "Se llama Anna. ¿Y tú?", "Her name is Anna. And you?"),
        ("Mateo", "Ich habe zwei Brüder.", None, "Tengo dos hermanos.", "I have two brothers."),
    ]),
    tryit("Ich habe …\nMeine Mutter heißt …", D("Jetzt du! Hast du Geschwister? Wie heißt deine Mutter?", "¡Ahora tú! ¿Tienes hermanos? ¿Cómo se llama tu mamá?", "Now you! Do you have siblings? What's your mother's name?")),
    recap(["der Vater · die Mutter", "ich habe · du hast", "mein Vater · meine Mutter", "Hast du Geschwister?"],
          D("Du stellst deine Familie vor. Und du kennst haben und mein, meine.", "Presentas a tu familia. Y conoces haben y mein, meine.", "You introduce your family. And you know haben and mein, meine.")),
])

# ───────────────────────── 6 · Berufe ─────────────────────────
UNITS[6] = ("Berufe", "Was bist du von Beruf?", [
    title(["💼", "👨‍🍳", "💻"],
          D("Hallo! Heute sprechen wir über Berufe.", "¡Hola! Hoy hablamos de profesiones.", "Hi! Today we talk about jobs."),
          D("Was bist du von Beruf?", "¿A qué te dedicas?", "What do you do for a living?")),
    words("Berufe", "profesiones", [
        ("der Arzt", "el médico", "👨‍⚕️", "der Arzt", "el médico", "the doctor"),
        ("der Koch", "el cocinero", "👨‍🍳", "der Koch", "el cocinero", "the cook"),
        ("der Lehrer", "el profesor", "👨‍🏫", "der Lehrer", "el profesor", "the teacher"),
        ("der Kellner", "el mesero", "🤵", "der Kellner", "el mesero", "the waiter"),
        ("der Student", "el estudiante", "🧑‍🎓", "der Student", "el estudiante", "the student"),
        ("der Friseur", "el peluquero", "💇", "der Friseur", "el peluquero", "the hairdresser"),
    ], D("Hier sind ein paar Berufe:", "Aquí hay algunas profesiones:", "Here are a few jobs:")),
    sentence("Was bist du von Beruf?", "¿a qué te dedicas?", "💼", [
        {"de": "Ich bin Lehrer.", "es": "Soy profesor.", "mark": "Lehrer", "at": 1},
        {"de": "Ich bin Ärztin.", "es": "Soy médica.", "mark": "Ärztin", "at": 4},
    ], [
        D("Was bist du von Beruf? Hör zu:", "¿A qué te dedicas? Escucha:", "What do you do? Listen:"),
        D("Ich bin Lehrer.", "Soy profesor.", "I'm a teacher.", "m"),
        D("Achtung: ohne Artikel! Nicht: ein Lehrer.", "¡Ojo: sin artículo! No: ein Lehrer.", "Careful: no article! Not: ein Lehrer."),
        D("Und eine Frau sagt:", "Y una mujer dice:", "And a woman says:"),
        D("Ich bin Ärztin.", "Soy médica.", "I'm a doctor.", "f"),
    ], notes=[{"text": "kein Artikel!", "at": 2}]),
    compare("-in", {"title": "er", "icon": "👨‍🏫", "gloss": "él", "example": "der Lehrer", "at": 1},
            {"title": "sie", "icon": "👩‍🏫", "gloss": "ella", "example": "die Lehrerin", "at": 3}, [
        D("Viele Berufe haben zwei Formen. Für einen Mann:", "Muchas profesiones tienen dos formas. Para un hombre:", "Many jobs have two forms. For a man:"),
        D("der Lehrer", "el profesor", "the (male) teacher"),
        D("Für eine Frau kommt -in ans Ende:", "Para una mujer se agrega -in al final:", "For a woman, -in goes at the end:"),
        D("die Lehrerin", "la profesora", "the (female) teacher"),
        D("Genauso: der Kellner, die Kellnerin.", "Igual: el mesero, la mesera.", "The same: der Kellner, die Kellnerin."),
    ]),
    table("arbeiten", "trabajar", [R("ich", "arbeit", "e", 3), R("du", "arbeit", "est", 4), R("er / sie", "arbeit", "et", 5), R("wir", "arbeit", "en", 6)], [
        D("Wo arbeitest du? Hör zu:", "¿Dónde trabajas? Escucha:", "Where do you work? Listen:"),
        D("Ich arbeite im Krankenhaus.", "Trabajo en el hospital.", "I work at the hospital.", "f"),
        D("Bei arbeiten brauchen wir ein extra e:", "Con arbeiten necesitamos una e extra:", "With arbeiten we need an extra e:"),
        D("ich arbeite", "yo trabajo", "I work"),
        D("du arbeitest", "tú trabajas", "you work"),
        D("er arbeitet, sie arbeitet", "él trabaja, ella trabaja", "he works, she works"),
        D("wir arbeiten", "nosotros trabajamos", "we work"),
    ], example={"de": "Ich arbeite im Krankenhaus.", "es": "Trabajo en el hospital.", "at": 1}, sticker="🏥", side="← extra e"),
    dialogue("Was machen Sie?", {"Herr Braun": {"icon": "🧔", "voice": "m"}, "Frau Kim": {"icon": "👩", "voice": "f"}},
             D("Hör zu: Herr Braun und Frau Kim.", "Escucha: el señor Braun y la señora Kim.", "Listen: Mr Braun and Ms Kim."), [
        ("Herr Braun", "Was sind Sie von Beruf?", None, "¿A qué se dedica usted?", "What do you do for a living?"),
        ("Frau Kim", "Ich bin Programmiererin.", None, "Soy programadora.", "I'm a programmer."),
        ("Herr Braun", "Wo arbeiten Sie?", None, "¿Dónde trabaja?", "Where do you work?"),
        ("Frau Kim", "Bei Siemens. Und Sie?", None, "En Siemens. ¿Y usted?", "At Siemens. And you?"),
        ("Herr Braun", "Ich bin Koch.", None, "Soy cocinero.", "I'm a cook."),
    ]),
    tryit("Ich bin …\nIch arbeite …", D("Jetzt du! Was bist du von Beruf? Wo arbeitest du? Oder was studierst du?", "¡Ahora tú! ¿A qué te dedicas? ¿Dónde trabajas? ¿O qué estudias?", "Now you! What do you do? Where do you work? Or what do you study?"), pause=7),
    recap(["Ich bin Lehrer. (ohne ein!)", "der Lehrer · die Lehrerin", "ich arbeite · du arbeitest", "Was sind Sie von Beruf?"],
          D("Du sprichst über Berufe und sagst, wo du arbeitest.", "Hablas de profesiones y dices dónde trabajas.", "You talk about jobs and say where you work.")),
])

# ───────────────────────── 7 · Zahlen bis 100 ─────────────────────────
UNITS[7] = ("Zahlen bis 100", "Zahlen und Preise", [
    title(["💯", "💶", "🛒"],
          D("Hallo! Heute zählen wir bis hundert – und weiter!", "¡Hola! Hoy contamos hasta cien… ¡y más!", "Hi! Today we count to a hundred – and beyond!"),
          D("Und du fragst: Was kostet das?", "Y preguntas: ¿cuánto cuesta?", "And you ask: How much is that?")),
    words("Die Zehner", "las decenas", [
        ("zwanzig", "veinte", "#20", "zwanzig", "veinte", "twenty"),
        ("dreißig", "treinta", "#30", "dreißig. Mit ß!", "treinta. ¡Con ß!", "thirty. With ß!"),
        ("vierzig", "cuarenta", "#40", "vierzig", "cuarenta", "forty"),
        ("fünfzig", "cincuenta", "#50", "fünfzig", "cincuenta", "fifty"),
        ("sechzig", "sesenta", "#60", "sechzig", "sesenta", "sixty"),
        ("hundert", "cien", "#100", "hundert", "cien", "a hundred"),
    ], D("Das sind die Zehner:", "Estas son las decenas:", "These are the tens:")),
    table("21, 34, 57 …", "primero la unidad", [R("21", "", "ein", 3, "undzwanzig"), R("34", "", "vier", 4, "unddreißig"), R("57", "", "sieben", 5, "undfünfzig")], [
        D("Jetzt ein Trick: Auf Deutsch sagen wir zuerst die Einer, dann die Zehner.", "Ahora un truco: en alemán decimos primero las unidades y luego las decenas.", "Now a trick: in German we say the ones first, then the tens."),
        D("einundzwanzig. Eins und zwanzig.", "veintiuno. Uno y veinte.", "twenty-one. One and twenty."),
        D("Hör zu:", "Escucha:", "Listen:"),
        D("einundzwanzig", "veintiuno", "twenty-one"),
        D("vierunddreißig", "treinta y cuatro", "thirty-four"),
        D("siebenundfünfzig", "cincuenta y siete", "fifty-seven"),
    ], example={"de": "einundzwanzig", "es": "veintiuno = 1 + 20", "at": 1}, w=620, tx=300, size=56, side="1 + 20"),
    sentence("Was kostet das?", "¿cuánto cuesta?", "💶", [
        {"de": "Was kostet der Tisch?", "es": "¿Cuánto cuesta la mesa?", "mark": "kostet", "at": 1},
        {"de": "Er kostet 30 Euro.", "es": "Cuesta 30 euros.", "mark": "30 Euro", "at": 2},
    ], [
        D("Auf dem Flohmarkt fragst du:", "En el mercado de pulgas preguntas:", "At the flea market you ask:"),
        D("Was kostet der Tisch?", "¿Cuánto cuesta la mesa?", "How much is the table?", "f"),
        D("Er kostet dreißig Euro.", "Cuesta treinta euros.", "It costs thirty euros.", "m"),
        D("Und so sagen wir Preise: zwei Euro fünfzig.", "Y así decimos los precios: dos euros cincuenta.", "And this is how we say prices: two euros fifty."),
    ]),
    compare("teuer oder billig?", {"title": "teuer", "icon": "💎", "gloss": "caro", "example": "Das ist zu teuer!", "at": 1},
            {"title": "billig", "icon": "🪙", "gloss": "barato", "example": "Das ist billig!", "at": 3}, [
        D("Hundert Euro für einen Stuhl? Dann sagst du:", "¿Cien euros por una silla? Entonces dices:", "A hundred euros for a chair? Then you say:"),
        D("Das ist zu teuer!", "¡Es demasiado caro!", "That's too expensive!", "f"),
        D("Zwei Euro für eine Lampe? Super:", "¿Dos euros por una lámpara? Súper:", "Two euros for a lamp? Great:"),
        D("Das ist billig!", "¡Es barato!", "That's cheap!", "m"),
        D("Oder freundlicher: Das ist günstig.", "O más amable: Das ist günstig (está a buen precio).", "Or more friendly: Das ist günstig (good value)."),
    ]),
    dialogue("Auf dem Flohmarkt", {"Lena": LENA, "Verkäufer": {"icon": "🧔", "voice": "m"}},
             D("Hör zu: Lena ist auf dem Flohmarkt.", "Escucha: Lena está en el mercado de pulgas.", "Listen: Lena is at the flea market."), [
        ("Lena", "Was kostet die Lampe?", None, "¿Cuánto cuesta la lámpara?", "How much is the lamp?"),
        ("Verkäufer", "Zwölf Euro.", None, "Doce euros.", "Twelve euros."),
        ("Lena", "Und der Stuhl?", None, "¿Y la silla?", "And the chair?"),
        ("Verkäufer", "Fünfundzwanzig Euro.", None, "Veinticinco euros.", "Twenty-five euros."),
        ("Lena", "Das ist zu teuer!", None, "¡Es demasiado caro!", "That's too expensive!"),
        ("Verkäufer", "Okay, zwanzig Euro.", None, "Bueno, veinte euros.", "Okay, twenty euros."),
    ]),
    tryit("20, 30, 40 … 100\n21, 22, 23 …", D("Jetzt du! Zähl laut von zwanzig bis hundert: zwanzig, dreißig, vierzig …", "¡Ahora tú! Cuenta en voz alta de veinte a cien: veinte, treinta, cuarenta…", "Now you! Count out loud from twenty to a hundred: twenty, thirty, forty…"), pause=8),
    recap(["20, 30, 40 … 100", "einundzwanzig = 1 + 20", "Was kostet …?", "Das ist zu teuer!"],
          D("Du zählst bis hundert und fragst nach Preisen.", "Cuentas hasta cien y preguntas precios.", "You count to a hundred and ask about prices.")),
])

# ───────────────────────── 8 · Der, die, das ─────────────────────────
UNITS[8] = ("Der, die, das", "Die Artikel", [
    title(["📚", "🔑", "🚪"],
          D("Hallo! Heute lernen wir die Artikel: der, die, das.", "¡Hola! Hoy aprendemos los artículos: der, die, das.", "Hi! Today we learn the articles: der, die, das."),
          D("Jedes Nomen hat einen Artikel.", "Cada sustantivo tiene un artículo.", "Every noun has an article.")),
    words("der · die · das", "tres artículos", [
        ("der Schlüssel", "la llave", "🔑", "der Schlüssel", "la llave", "the key"),
        ("die Lampe", "la lámpara", "💡", "die Lampe", "la lámpara", "the lamp"),
        ("das Buch", "el libro", "📖", "das Buch", "el libro", "the book"),
        ("der Computer", "el computador", "💻", "der Computer", "el computador", "the computer"),
        ("die Tasche", "el bolso", "👜", "die Tasche", "el bolso", "the bag"),
        ("das Auto", "el carro", "🚗", "das Auto", "el carro", "the car"),
    ], D("Auf Deutsch gibt es drei Artikel: der, die und das. Hör zu:", "En alemán hay tres artículos: der, die y das. Escucha:", "German has three articles: der, die and das. Listen:")),
    tip("Lerne immer\nmit Artikel!", "💡",
        D("Mein Tipp: Lerne jedes Wort mit Artikel. Nicht nur Tisch, sondern:", "Mi consejo: aprende cada palabra con su artículo. No solo Tisch, sino:", "My tip: learn every word with its article. Not just Tisch, but:"),
        D("der Tisch!", "¡der Tisch!", "der Tisch!")),
    table("Tipps", "pistas", [R("-ung", "die Zeit", "ung", 1), R("-e", "die Lamp", "e", 2), R("-chen", "das Mäd", "chen", 3)], [
        D("Ein paar Tipps helfen beim Raten:", "Algunas pistas ayudan a adivinar:", "A few tips help you guess:"),
        D("Wörter mit -ung haben die: die Zeitung.", "Las palabras con -ung llevan die: die Zeitung.", "Words ending in -ung take die: die Zeitung."),
        D("Wörter mit -e haben oft die: die Lampe.", "Las palabras con -e suelen llevar die: die Lampe.", "Words ending in -e often take die: die Lampe."),
        D("Wörter mit -chen haben das: das Mädchen.", "Las palabras con -chen llevan das: das Mädchen.", "Words ending in -chen take das: das Mädchen."),
    ], w=560, tx=330, side=""),
    sentence("Wo ist …?", "¿dónde está…?", "🔑", [
        {"de": "Wo ist der Schlüssel?", "es": "¿Dónde está la llave?", "mark": "der", "at": 1},
        {"de": "Er ist hier.", "es": "Está aquí.", "mark": "Er", "at": 2},
    ], [
        D("Für Sachen sagen wir auch er, sie, es.", "Para cosas también decimos er, sie, es.", "For things we also say er, sie, es."),
        D("Wo ist der Schlüssel?", "¿Dónde está la llave?", "Where is the key?", "m"),
        D("Er ist hier.", "Está aquí.", "It's here.", "f"),
        D("der wird er, die wird sie, das wird es.", "der se vuelve er, die se vuelve sie, das se vuelve es.", "der becomes er, die becomes sie, das becomes es."),
    ], notes=[{"text": "der → er", "at": 3}, {"text": "die → sie", "at": 3}, {"text": "das → es", "at": 3}], notesX=960),
    dialogue("Ist das dein Buch?", LM, D("Hör zu: Lena und Mateo suchen Sachen.", "Escucha: Lena y Mateo buscan cosas.", "Listen: Lena and Mateo are looking for things."), [
        ("Mateo", "Ist das dein Buch?", None, "¿Es este tu libro?", "Is this your book?"),
        ("Lena", "Nein, das ist nicht mein Buch.", None, "No, no es mi libro.", "No, that's not my book."),
        ("Mateo", "Und die Tasche?", None, "¿Y el bolso?", "And the bag?"),
        ("Lena", "Ja, das ist meine Tasche.", None, "Sí, es mi bolso.", "Yes, that's my bag."),
        ("Mateo", "Wo ist der Schlüssel?", None, "¿Dónde está la llave?", "Where is the key?"),
        ("Lena", "Er ist im Auto!", None, "¡Está en el carro!", "It's in the car!"),
    ]),
    tryit("der … · die … · das …", D("Jetzt du! Schau dich um. Was siehst du? Sag das Wort mit Artikel!", "¡Ahora tú! Mira a tu alrededor. ¿Qué ves? ¡Di la palabra con artículo!", "Now you! Look around. What do you see? Say the word with its article!"), pause=7),
    recap(["der Tisch · die Lampe · das Buch", "-ung → die · -chen → das", "der → er · die → sie · das → es", "Ist das dein Buch?"],
          D("Du kennst der, die, das, ein paar Tipps und er, sie, es für Sachen.", "Conoces der, die, das, algunas pistas y er, sie, es para cosas.", "You know der, die, das, a few tips and er, sie, es for things.")),
])

# ───────────────────────── 9 · Im Kurs ─────────────────────────
UNITS[9] = ("Im Kurs", "Im Kursraum", [
    title(["✏️", "📓", "🏫"],
          D("Hallo! Heute sind wir im Kursraum.", "¡Hola! Hoy estamos en el salón de clase.", "Hi! Today we're in the classroom."),
          D("Was ist das? Wie heißt das auf Deutsch?", "¿Qué es eso? ¿Cómo se dice en alemán?", "What's that? What's it called in German?")),
    words("Im Kursraum", "en el salón", [
        ("der Stift", "el esfero", "✏️", "der Stift", "el esfero", "the pen"),
        ("das Heft", "el cuaderno", "📓", "das Heft", "el cuaderno", "the notebook"),
        ("das Buch", "el libro", "📕", "das Buch", "el libro", "the book"),
        ("der Stuhl", "la silla", "🪑", "der Stuhl", "la silla", "the chair"),
        ("das Handy", "el celular", "📱", "das Handy", "el celular", "the phone"),
        ("der Laptop", "el portátil", "💻", "der Laptop", "el portátil", "the laptop"),
    ], D("Was ist im Kursraum? Hör zu:", "¿Qué hay en el salón? Escucha:", "What's in the classroom? Listen:")),
    table("Der Plural", "el plural", [R("der Stift", "die Stift", "e", 1), R("das Buch", "die Büch", "er", 2), R("die Tafel", "die Tafel", "n", 3), R("das Handy", "die Handy", "s", 4)], [
        D("Und der Plural? Im Plural ist der Artikel immer die.", "¿Y el plural? En plural el artículo siempre es die.", "And the plural? In the plural the article is always die."),
        D("der Stift – die Stifte", "el esfero – los esferos", "the pen – the pens"),
        D("das Buch – die Bücher", "el libro – los libros", "the book – the books"),
        D("die Tafel – die Tafeln", "el tablero – los tableros", "the board – the boards"),
        D("das Handy – die Handys", "el celular – los celulares", "the phone – the phones"),
    ], pw=230, w=600, tx=290, side="Plural:\nimmer die!"),
    compare("ein oder kein?", {"title": "ein", "icon": "✏️", "gloss": "un / una", "example": "Das ist ein Stift.", "at": 1},
            {"title": "kein", "icon": "🚫", "gloss": "ningún / no es", "example": "Das ist kein Heft.", "at": 3}, [
        D("Was ist das? Hör zu:", "¿Qué es? Escucha:", "What's that? Listen:"),
        D("Das ist ein Stift.", "Es un esfero.", "That's a pen.", "f"),
        D("Und wenn nicht? Dann sagen wir kein:", "¿Y si no? Entonces decimos kein:", "And if not? Then we say kein:"),
        D("Das ist kein Heft.", "No es un cuaderno.", "That's not a notebook.", "m"),
        D("Mit die sagen wir eine und keine.", "Con die decimos eine y keine.", "With die we say eine and keine."),
    ]),
    sentence("Im Kurs fragen", "preguntar en clase", "🙋", [
        {"de": "Wie heißt das auf Deutsch?", "es": "¿Cómo se dice en alemán?", "mark": "auf Deutsch", "at": 1},
        {"de": "Ich verstehe das nicht.", "es": "No entiendo.", "mark": "nicht", "at": 3},
    ], [
        D("Diese Sätze brauchst du im Kurs:", "Estas frases las necesitas en clase:", "You need these sentences in class:"),
        D("Wie heißt das auf Deutsch?", "¿Cómo se dice en alemán?", "What's that called in German?", "m"),
        D("Und wenn du etwas nicht verstehst:", "Y si no entiendes algo:", "And if you don't understand something:"),
        D("Ich verstehe das nicht.", "No entiendo.", "I don't understand.", "f"),
        D("Kein Problem! Sag einfach: Langsam, bitte.", "¡No hay problema! Solo di: Langsam, bitte (despacio, por favor).", "No problem! Just say: Langsam, bitte (slowly, please)."),
    ]),
    dialogue("Im Kurs", {"Mateo": MATEO, "Lehrerin": {"icon": "👩‍🏫", "voice": "f"}},
             D("Hör zu: Mateo fragt die Lehrerin.", "Escucha: Mateo le pregunta a la profesora.", "Listen: Mateo asks the teacher."), [
        ("Mateo", "Wie heißt das auf Deutsch?", None, "¿Cómo se dice en alemán?", "What's that called in German?"),
        ("Lehrerin", "Das ist ein Radiergummi.", None, "Es un borrador.", "That's an eraser."),
        ("Mateo", "Wie bitte? Langsam, bitte.", None, "¿Cómo? Despacio, por favor.", "Pardon? Slowly, please."),
        ("Lehrerin", "Ra – dier – gum – mi.", "Ra, dier, gum, mi.", "Bo – rra – dor.", "E – ra – ser."),
        ("Mateo", "Danke! Und was ist das?", None, "¡Gracias! ¿Y qué es eso?", "Thanks! And what's that?"),
        ("Lehrerin", "Das ist eine Tafel.", None, "Es un tablero.", "That's a board."),
    ]),
    tryit("Wie heißt das\nauf Deutsch?", D("Jetzt du! Nimm eine Sache in die Hand. Wie heißt das auf Deutsch?", "¡Ahora tú! Toma un objeto. ¿Cómo se dice en alemán?", "Now you! Pick up an object. What's it called in German?")),
    recap(["der Stift · das Heft · das Buch", "Plural: die Stifte, die Bücher", "ein Stift · kein Stift", "Wie heißt das auf Deutsch?"],
          D("Du kennst die Sachen im Kurs, den Plural und ein, kein.", "Conoces las cosas del salón, el plural y ein, kein.", "You know classroom objects, the plural and ein, kein.")),
])

# ───────────────────────── 10 · Wie spät ist es? ─────────────────────────
UNITS[10] = ("Wie spät ist es?", "Die Uhrzeit", [
    title(["⏰", "🕒", "🚆"],
          D("Hallo! Heute lernst du die Uhrzeit.", "¡Hola! Hoy aprendes la hora.", "Hi! Today you learn to tell the time."),
          D("Wie spät ist es?", "¿Qué hora es?", "What time is it?")),
    sentence("Wie spät ist es?", "¿qué hora es?", "🕒", [
        {"de": "Es ist drei Uhr.", "es": "Son las tres.", "mark": "drei Uhr", "at": 1},
        {"de": "Es ist halb vier.", "es": "Son las tres y media.", "mark": "halb vier", "at": 3},
    ], [
        D("Wie spät ist es? Hör zu:", "¿Qué hora es? Escucha:", "What time is it? Listen:"),
        D("Es ist drei Uhr.", "Son las tres.", "It's three o'clock.", "m"),
        D("Und jetzt ein Trick:", "Y ahora un truco:", "And now a trick:"),
        D("Es ist halb vier.", "Son las tres y media.", "It's half past three.", "f"),
        D("Halb vier heißt: eine halbe Stunde vor vier. Also drei Uhr dreißig!", "Halb vier significa: media hora antes de las cuatro. ¡O sea, las tres y media!", "Halb vier means half an hour before four. So, three thirty!"),
    ], notes=[{"text": "halb vier = 3:30", "at": 4}]),
    tip("halb elf\n= 10:30 !", "⚠️",
        D("Achtung, das ist sehr wichtig:", "Ojo, esto es muy importante:", "Careful, this is very important:"),
        D("Halb elf ist zehn Uhr dreißig. Nicht elf Uhr dreißig!", "Halb elf son las diez y media. ¡No las once y media!", "Halb elf is ten thirty. Not eleven thirty!")),
    table("nach · vor", "y · para", [R("10:05", "fünf ", "nach", 1, " zehn"), R("10:15", "Viertel ", "nach", 2, " zehn"), R("10:45", "Viertel ", "vor", 3, " elf"), R("10:55", "fünf ", "vor", 4, " elf")], [
        D("Im Alltag sagen wir nach und vor:", "En el día a día decimos nach (y) y vor (para):", "In everyday speech we say nach (past) and vor (to):"),
        D("fünf nach zehn", "las diez y cinco", "five past ten"),
        D("Viertel nach zehn", "las diez y cuarto", "quarter past ten"),
        D("Viertel vor elf", "un cuarto para las once", "quarter to eleven"),
        D("fünf vor elf", "cinco para las once", "five to eleven"),
    ], w=640, tx=300, size=56, side=""),
    compare("um · von … bis", {"title": "um", "icon": "⏰", "gloss": "a las", "example": "um acht Uhr", "at": 1},
            {"title": "von–bis", "icon": "🕘", "gloss": "de … a", "example": "von 9 bis 17 Uhr", "at": 3}, [
        D("Wann beginnt der Kurs? Wir sagen um:", "¿A qué hora empieza el curso? Decimos um:", "When does the class start? We say um:"),
        D("Der Kurs beginnt um acht Uhr.", "El curso empieza a las ocho.", "The class starts at eight.", "f"),
        D("Und wie lange? Von … bis:", "¿Y cuánto tiempo? Von… bis (de… a):", "And how long? Von… bis (from… to):"),
        D("Ich arbeite von neun bis siebzehn Uhr.", "Trabajo de nueve a diecisiete.", "I work from nine to five.", "m"),
    ]),
    dialogue("Schnell!", LM, D("Hör zu: Mateo hat keine Zeit.", "Escucha: Mateo no tiene tiempo.", "Listen: Mateo is in a hurry."), [
        ("Mateo", "Wie spät ist es?", None, "¿Qué hora es?", "What time is it?"),
        ("Lena", "Viertel nach acht.", None, "Las ocho y cuarto.", "Quarter past eight."),
        ("Mateo", "Oh nein! Der Kurs!", None, "¡Oh no! ¡El curso!", "Oh no! The class!"),
        ("Lena", "Wann beginnt er?", None, "¿A qué hora empieza?", "When does it start?"),
        ("Mateo", "Um halb neun!", None, "¡A las ocho y media!", "At half past eight!"),
        ("Lena", "Dann schnell, los!", None, "¡Entonces rápido, vamos!", "Then hurry, go!"),
    ]),
    tryit("Wie spät ist es\njetzt?", D("Jetzt du! Schau auf die Uhr: Wie spät ist es jetzt?", "¡Ahora tú! Mira el reloj: ¿qué hora es ahora?", "Now you! Look at the clock: what time is it now?")),
    recap(["Wie spät ist es?", "Es ist drei Uhr.", "halb vier = 3:30", "Viertel nach · Viertel vor", "um acht · von 9 bis 17 Uhr"],
          D("Du fragst nach der Uhrzeit und sagst sie – offiziell und im Alltag.", "Preguntas la hora y la dices, de forma oficial y en el día a día.", "You ask for the time and tell it – officially and in everyday speech.")),
])

# ───────────────────────── 11 · Tage und Monate ─────────────────────────
UNITS[11] = ("Tage und Monate", "Die Woche und das Jahr", [
    title(["📅", "🎂", "🍂"],
          D("Hallo! Heute lernen wir die Tage, die Monate und die Jahreszeiten.", "¡Hola! Hoy aprendemos los días, los meses y las estaciones.", "Hi! Today we learn the days, the months and the seasons."),
          D("Wann hast du Geburtstag?", "¿Cuándo es tu cumpleaños?", "When is your birthday?")),
    timeline("Die Woche", "la semana", [
        ("Montag", "lunes", "1️⃣", "Montag", "lunes", "Monday"),
        ("Dienstag", "martes", "2️⃣", "Dienstag", "martes", "Tuesday"),
        ("Mittwoch", "miércoles", "3️⃣", "Mittwoch", "miércoles", "Wednesday"),
        ("Donnerstag", "jueves", "4️⃣", "Donnerstag", "jueves", "Thursday"),
        ("Freitag", "viernes", "5️⃣", "Freitag", "viernes", "Friday"),
        ("Samstag", "sábado", "6️⃣", "Samstag", "sábado", "Saturday"),
        ("Sonntag", "domingo", "7️⃣", "Sonntag", "domingo", "Sunday"),
    ], D("Die Woche hat sieben Tage:", "La semana tiene siete días:", "The week has seven days:")),
    words("Die Jahreszeiten", "las estaciones", [
        ("der Frühling", "primavera · mar–may", "🌷", "der Frühling: März, April, Mai.", "la primavera: marzo, abril, mayo.", "spring: March, April, May."),
        ("der Sommer", "verano · jun–ago", "☀️", "der Sommer: Juni, Juli, August.", "el verano: junio, julio, agosto.", "summer: June, July, August."),
        ("der Herbst", "otoño · sep–nov", "🍂", "der Herbst: September, Oktober, November.", "el otoño: septiembre, octubre, noviembre.", "autumn: September, October, November."),
        ("der Winter", "invierno · dic–feb", "❄️", "der Winter: Dezember, Januar, Februar.", "el invierno: diciembre, enero, febrero.", "winter: December, January, February."),
    ], D("Das Jahr hat vier Jahreszeiten:", "El año tiene cuatro estaciones:", "The year has four seasons:")),
    table("am · im · um", "¿cuándo?", [R("Tag", "", "am", 1, " Montag"), R("Monat", "", "im", 2, " Mai"), R("Uhrzeit", "", "um", 3, " acht Uhr")], [
        D("Wann? Das ist einfach:", "¿Cuándo? Es fácil:", "When? It's easy:"),
        D("Tage: am Montag.", "Días: am Montag (el lunes).", "Days: am Montag (on Monday)."),
        D("Monate: im Mai.", "Meses: im Mai (en mayo).", "Months: im Mai (in May)."),
        D("Uhrzeit: um acht Uhr.", "Hora: um acht Uhr (a las ocho).", "Time: um acht Uhr (at eight)."),
    ], pw=200, w=560, tx=330, side=""),
    sentence("Geburtstag", "cumpleaños", "🎂", [
        {"de": "Ich habe im Mai Geburtstag.", "es": "Cumplo años en mayo.", "mark": "habe", "at": 1},
        {"de": "Alles Gute!", "es": "¡Feliz cumpleaños!", "mark": "Alles Gute", "at": 3},
    ], [
        D("Wann hast du Geburtstag?", "¿Cuándo es tu cumpleaños?", "When is your birthday?"),
        D("Ich habe im Mai Geburtstag.", "Cumplo años en mayo.", "My birthday is in May.", "f"),
        D("Achtung: Wir sagen haben, nicht sein! Und dann sagen alle:", "Ojo: decimos haben (tener), no sein (ser). Y luego todos dicen:", "Note: we say haben (have), not sein (be)! And then everyone says:"),
        D("Alles Gute zum Geburtstag!", "¡Feliz cumpleaños!", "Happy birthday!", "m"),
    ]),
    dialogue("Geburtstag", LM, D("Hör zu: Mateo hat bald Geburtstag.", "Escucha: pronto es el cumpleaños de Mateo.", "Listen: it's Mateo's birthday soon."), [
        ("Lena", "Wann hast du Geburtstag?", None, "¿Cuándo es tu cumpleaños?", "When is your birthday?"),
        ("Mateo", "Im Oktober. Am Freitag!", None, "En octubre. ¡El viernes!", "In October. On Friday!"),
        ("Lena", "Am Freitag? Super!", None, "¿El viernes? ¡Súper!", "On Friday? Great!"),
        ("Mateo", "Hast du am Abend Zeit?", None, "¿Tienes tiempo en la noche?", "Are you free in the evening?"),
        ("Lena", "Ja! Um wie viel Uhr?", None, "¡Sí! ¿A qué hora?", "Yes! At what time?"),
        ("Mateo", "Um acht. Bis Freitag!", None, "A las ocho. ¡Hasta el viernes!", "At eight. See you Friday!"),
    ]),
    tryit("Ich habe im …\nGeburtstag.", D("Jetzt du! Wann hast du Geburtstag? Sag es laut!", "¡Ahora tú! ¿Cuándo es tu cumpleaños? ¡Dilo en voz alta!", "Now you! When is your birthday? Say it out loud!")),
    recap(["Montag, Dienstag … Sonntag", "Frühling, Sommer, Herbst, Winter", "am Montag · im Mai · um acht", "Ich habe im Mai Geburtstag."],
          D("Du kennst die Tage, die Monate und die Jahreszeiten. Und du sagst, wann du Geburtstag hast.", "Conoces los días, los meses y las estaciones. Y dices cuándo cumples años.", "You know the days, months and seasons. And you say when your birthday is.")),
])

# ───────────────────────── 12 · Mein Tag ─────────────────────────
UNITS[12] = ("Mein Tag", "Der Tagesablauf", [
    title(["⏰", "☕", "🚌"],
          D("Hallo! Heute erzählst du deinen Tag.", "¡Hola! Hoy cuentas tu día.", "Hi! Today you describe your day."),
          D("Was machst du am Morgen, am Mittag und am Abend?", "¿Qué haces en la mañana, al mediodía y en la noche?", "What do you do in the morning, at noon and in the evening?")),
    timeline("Mein Tag", "mi día", [
        ("frühstücken", "desayunar", "☕", "Um sieben Uhr frühstücke ich.", "A las siete desayuno.", "At seven I have breakfast."),
        ("duschen", "ducharse", "🚿", "Dann dusche ich.", "Luego me ducho.", "Then I shower."),
        ("arbeiten", "trabajar", "💻", "Von neun bis fünf arbeite ich.", "De nueve a cinco trabajo.", "From nine to five I work."),
        ("lesen", "leer", "📖", "Am Abend lese ich.", "En la noche leo.", "In the evening I read."),
        ("schlafen", "dormir", "😴", "Um elf Uhr schlafe ich.", "A las once duermo.", "At eleven I sleep."),
    ], D("So ist mein Tag:", "Así es mi día:", "This is my day:")),
    table("Position 2", "el verbo en la posición 2", [R("Ich", "", "frühstücke", 1, " um 7."), R("Um 7", "", "frühstücke", 2, " ich."), R("Am Abend", "", "lese", 3, " ich."), R("Dann", "", "dusche", 4, " ich.")], [
        D("Jetzt die goldene Regel: Das Verb steht auf Position zwei.", "Ahora la regla de oro: el verbo va en la posición dos.", "Now the golden rule: the verb is in position two."),
        D("Ich frühstücke um sieben.", "Desayuno a las siete.", "I have breakfast at seven."),
        D("Um sieben frühstücke ich.", "A las siete desayuno.", "At seven I have breakfast."),
        D("Am Abend lese ich.", "En la noche leo.", "In the evening I read."),
        D("Dann dusche ich.", "Luego me ducho.", "Then I shower."),
    ], pw=220, w=640, tx=280, size=54, side="← Verb\n    = Position 2"),
    compare("schlafen", {"title": "ich", "icon": "😴", "gloss": "yo duermo", "example": "ich schlafe", "at": 1},
            {"title": "du", "icon": "🛌", "gloss": "tú duermes", "example": "du schläfst", "at": 3}, [
        D("Einige Verben ändern den Vokal. Mit ich:", "Algunos verbos cambian la vocal. Con ich:", "Some verbs change their vowel. With ich:"),
        D("Ich schlafe.", "Yo duermo.", "I sleep.", "f"),
        D("Aber mit du und er wird a zu ä:", "Pero con du y er la a se vuelve ä:", "But with du and er, a becomes ä:"),
        D("Du schläfst. Er schläft.", "Tú duermes. Él duerme.", "You sleep. He sleeps.", "m"),
        D("Genauso: fahren, du fährst. Und essen, du isst.", "Igual: fahren (ir en vehículo), du fährst. Y essen (comer), du isst.", "The same: fahren, du fährst. And essen, du isst."),
    ]),
    dialogue("Dein Tag", LM, D("Hör zu: Lena fragt Mateo nach seinem Tag.", "Escucha: Lena le pregunta a Mateo por su día.", "Listen: Lena asks Mateo about his day."), [
        ("Lena", "Wann frühstückst du?", None, "¿A qué hora desayunas?", "When do you have breakfast?"),
        ("Mateo", "Um sieben. Dann dusche ich.", None, "A las siete. Luego me ducho.", "At seven. Then I shower."),
        ("Lena", "Fährst du mit dem Bus?", None, "¿Vas en bus?", "Do you go by bus?"),
        ("Mateo", "Nein, mit der U-Bahn.", None, "No, en metro.", "No, by subway."),
        ("Lena", "Und am Abend?", None, "¿Y en la noche?", "And in the evening?"),
        ("Mateo", "Am Abend lese ich.", None, "En la noche leo.", "In the evening I read."),
    ]),
    tryit("Am Morgen …\nAm Abend …", D("Jetzt du! Erzähl deinen Tag. Denk an Position zwei!", "¡Ahora tú! Cuenta tu día. ¡Piensa en la posición dos!", "Now you! Describe your day. Remember position two!"), pause=8),
    recap(["frühstücken · duschen · arbeiten", "Das Verb steht auf Position 2.", "Am Abend lese ich.", "du schläfst · du fährst · du isst"],
          D("Du erzählst deinen Tag – und das Verb steht immer auf Position zwei.", "Cuentas tu día, y el verbo siempre va en la posición dos.", "You describe your day – and the verb is always in position two.")),
])

# ───────────────────────── 13 · Hobbys ─────────────────────────
UNITS[13] = ("Hobbys", "Die Freizeit", [
    title(["⚽", "🎸", "📷"],
          D("Hallo! Heute sprechen wir über Hobbys.", "¡Hola! Hoy hablamos de pasatiempos.", "Hi! Today we talk about hobbies."),
          D("Was machst du gern in der Freizeit?", "¿Qué te gusta hacer en tu tiempo libre?", "What do you like doing in your free time?")),
    words("Hobbys", "pasatiempos", [
        ("Fußball", "fútbol", "⚽", "Ich spiele Fußball.", "Juego fútbol.", "I play football."),
        ("Gitarre", "guitarra", "🎸", "Ich spiele Gitarre.", "Toco guitarra.", "I play guitar."),
        ("schwimmen", "nadar", "🏊", "Ich schwimme.", "Nado.", "I swim."),
        ("tanzen", "bailar", "💃", "Ich tanze.", "Bailo.", "I dance."),
        ("kochen", "cocinar", "🍳", "Ich koche.", "Cocino.", "I cook."),
        ("reisen", "viajar", "✈️", "Ich reise.", "Viajo.", "I travel."),
    ], D("Was machst du in der Freizeit? Hier sind ein paar Hobbys:", "¿Qué haces en tu tiempo libre? Aquí hay algunos pasatiempos:", "What do you do in your free time? Here are a few hobbies:")),
    tip("spielen =\nSport + Musik", "🎹",
        D("Spielen sagen wir für Sport und für Instrumente:", "Spielen se usa para deportes y para instrumentos:", "We use spielen for sports and for instruments:"),
        D("Fußball spielen, Klavier spielen.", "jugar fútbol, tocar piano.", "play football, play the piano."), size=76),
    table("gern", "con gusto", [R("+", "Ich tanze ", "gern", 1, "."), R("++", "Ich koche ", "lieber", 2, "."), R("+++", "Ich lese ", "am liebsten", 3, "."), R("–", "Ich jogge ", "nicht gern", 4, ".")], [
        D("Mit gern sagst du, was du magst:", "Con gern dices lo que te gusta:", "With gern you say what you like:"),
        D("Ich tanze gern.", "Me gusta bailar.", "I like dancing."),
        D("Ich koche lieber.", "Prefiero cocinar.", "I prefer cooking."),
        D("Ich lese am liebsten.", "Lo que más me gusta es leer.", "I like reading best."),
        D("Und ich jogge nicht gern.", "Y no me gusta trotar.", "And I don't like jogging."),
    ], pw=120, w=640, tx=300, size=54, side=""),
    compare("ja · doch", {"title": "ja", "icon": "👍", "gloss": "sí", "example": "Ja, sehr gern!", "at": 1},
            {"title": "doch", "icon": "😄", "gloss": "¡claro que sí!", "example": "Doch, ich koche gern!", "at": 3}, [
        D("Kochst du gern? Dann sagst du:", "¿Te gusta cocinar? Entonces dices:", "Do you like cooking? Then you say:"),
        D("Ja, sehr gern!", "¡Sí, mucho!", "Yes, very much!", "f"),
        D("Aber: Kochst du nicht gern? Ist die Antwort ja, sagst du doch!", "Pero: ¿No te gusta cocinar? Si la respuesta es sí, dices doch.", "But: Don't you like cooking? If the answer is yes, you say doch!"),
        D("Doch, ich koche gern!", "¡Claro que sí, me gusta cocinar!", "Yes I do, I like cooking!", "m"),
        D("Doch ist ein Ja nach einer negativen Frage.", "Doch es un sí después de una pregunta negativa.", "Doch is a yes after a negative question."),
    ]),
    dialogue("Freizeit", LM, D("Hör zu: Lena und Mateo sprechen über Hobbys.", "Escucha: Lena y Mateo hablan de pasatiempos.", "Listen: Lena and Mateo talk about hobbies."), [
        ("Lena", "Was machst du gern?", None, "¿Qué te gusta hacer?", "What do you like doing?"),
        ("Mateo", "Ich spiele gern Fußball.", None, "Me gusta jugar fútbol.", "I like playing football."),
        ("Lena", "Spielst du auch Gitarre?", None, "¿También tocas guitarra?", "Do you play guitar too?"),
        ("Mateo", "Nein, ich lese lieber.", None, "No, prefiero leer.", "No, I prefer reading."),
        ("Lena", "Tanzt du nicht gern?", None, "¿No te gusta bailar?", "Don't you like dancing?"),
        ("Mateo", "Doch, sehr gern!", None, "¡Claro que sí, mucho!", "Oh yes, very much!"),
    ]),
    tryit("Ich … gern.\nIch … nicht gern.", D("Jetzt du! Was machst du gern? Was machst du nicht gern?", "¡Ahora tú! ¿Qué te gusta hacer? ¿Qué no te gusta hacer?", "Now you! What do you like doing? What don't you like doing?"), pause=7),
    recap(["Ich spiele Fußball.", "gern · lieber · am liebsten", "Kochst du nicht gern? – Doch!", "spielen: Sport und Musik"],
          D("Du sprichst über Hobbys und sagst, was du gern machst.", "Hablas de pasatiempos y dices lo que te gusta hacer.", "You talk about hobbies and say what you like doing.")),
])

# ───────────────────────── 14 · Essen und Trinken ─────────────────────────
UNITS[14] = ("Essen und Trinken", "Was isst du gern?", [
    title(["🍎", "🥖", "☕"],
          D("Hallo! Heute geht es um Essen und Trinken.", "¡Hola! Hoy hablamos de comida y bebida.", "Hi! Today is about food and drink."),
          D("Was isst du gern? Was trinkst du?", "¿Qué te gusta comer? ¿Qué tomas?", "What do you like to eat? What do you drink?")),
    words("Essen", "comida", [
        ("der Apfel", "la manzana", "🍎", "der Apfel", "la manzana", "the apple"),
        ("das Brot", "el pan", "🍞", "das Brot", "el pan", "the bread"),
        ("der Käse", "el queso", "🧀", "der Käse", "el queso", "the cheese"),
        ("das Ei", "el huevo", "🥚", "das Ei", "el huevo", "the egg"),
        ("der Fisch", "el pescado", "🐟", "der Fisch", "el pescado", "the fish"),
        ("die Tomate", "el tomate", "🍅", "die Tomate", "el tomate", "the tomato"),
    ], D("Was isst du? Hör zu:", "¿Qué comes? Escucha:", "What do you eat? Listen:")),
    words("Trinken", "bebidas", [
        ("das Wasser", "el agua", "💧", "das Wasser", "el agua", "the water"),
        ("der Kaffee", "el café", "☕", "der Kaffee", "el café", "the coffee"),
        ("der Tee", "el té", "🍵", "der Tee", "el té", "the tea"),
        ("die Milch", "la leche", "🥛", "die Milch", "la leche", "the milk"),
    ], D("Und was trinkst du?", "¿Y qué tomas?", "And what do you drink?")),
    table("Akkusativ", "acusativo", [R("der", "Ich esse ", "einen", 1, " Apfel."), R("die", "Ich esse ", "eine", 2, " Banane."), R("das", "Ich esse ", "ein", 3, " Ei.")], [
        D("Jetzt ein bisschen Grammatik: der Akkusativ. Nur der ändert sich!", "Ahora un poco de gramática: el acusativo. ¡Solo der cambia!", "Now a bit of grammar: the accusative. Only der changes!"),
        D("der Apfel – ich esse einen Apfel.", "la manzana – me como una manzana.", "the apple – I eat an apple."),
        D("die Banane – ich esse eine Banane.", "el banano – me como un banano.", "the banana – I eat a banana."),
        D("das Ei – ich esse ein Ei.", "el huevo – me como un huevo.", "the egg – I eat an egg."),
    ], pw=130, w=600, tx=280, size=56, side="← nur der\n    ändert sich"),
    table("mögen", "gustar", [R("ich", "mag", "", 3), R("du", "mag", "st", 4), R("er / sie", "mag", "", 5), R("wir", "mög", "en", 6)], [
        D("Und was magst du? Das Verb mögen:", "¿Y qué te gusta? El verbo mögen:", "And what do you like? The verb mögen:"),
        D("Ich mag Käse.", "Me gusta el queso.", "I like cheese.", "f"),
        D("Schau:", "Mira:", "Look:"),
        D("ich mag", "a mí me gusta", "I like"),
        D("du magst", "a ti te gusta", "you like"),
        D("er mag, sie mag", "a él le gusta, a ella le gusta", "he likes, she likes"),
        D("wir mögen", "a nosotros nos gusta", "we like"),
    ], example={"de": "Ich mag Käse.", "es": "Me gusta el queso.", "at": 1}, sticker="😋", side="ich mag =\ner mag"),
    dialogue("Essen", LM, D("Hör zu: Lena und Mateo sprechen über das Essen.", "Escucha: Lena y Mateo hablan de comida.", "Listen: Lena and Mateo talk about food."), [
        ("Mateo", "Was isst du gern?", None, "¿Qué te gusta comer?", "What do you like to eat?"),
        ("Lena", "Ich esse gern Fisch.", None, "Me gusta comer pescado.", "I like eating fish."),
        ("Mateo", "Magst du Fleisch?", None, "¿Te gusta la carne?", "Do you like meat?"),
        ("Lena", "Nein, ich esse kein Fleisch.", None, "No, no como carne.", "No, I don't eat meat."),
        ("Mateo", "Und was trinkst du?", None, "¿Y qué tomas?", "And what do you drink?"),
        ("Lena", "Am liebsten Tee!", None, "¡Lo que más me gusta es el té!", "Tea, best of all!"),
    ]),
    tryit("Ich esse gern …\nIch trinke …", D("Jetzt du! Was isst du gern? Was trinkst du gern?", "¡Ahora tú! ¿Qué te gusta comer? ¿Qué te gusta tomar?", "Now you! What do you like to eat? What do you like to drink?")),
    recap(["der Apfel · das Brot · die Milch", "Ich esse einen Apfel.", "ich mag · du magst", "Ich esse kein Fleisch."],
          D("Du sprichst über Essen und Trinken – mit dem Akkusativ und mit mögen.", "Hablas de comida y bebida, con el acusativo y con mögen.", "You talk about food and drink – with the accusative and with mögen.")),
])

# ───────────────────────── 15 · Im Café ─────────────────────────
UNITS[15] = ("Im Café", "Bestellen und bezahlen", [
    title(["☕", "🍰", "🧾"],
          D("Hallo! Heute gehen wir ins Café.", "¡Hola! Hoy vamos al café.", "Hi! Today we go to a café."),
          D("Du bestellst und bezahlst – auf Deutsch!", "Pides y pagas… ¡en alemán!", "You order and pay – in German!")),
    sentence("Bestellen", "pedir", "🍰", [
        {"de": "Ich möchte einen Tee.", "es": "Quisiera un té.", "mark": "möchte", "at": 2},
        {"de": "Ich nehme ein Wasser.", "es": "Tomo un agua.", "mark": "nehme", "at": 4},
    ], [
        D("Im Café fragt der Kellner:", "En el café el mesero pregunta:", "In the café the waiter asks:"),
        D("Was möchten Sie?", "¿Qué desea?", "What would you like?", "m"),
        D("Ich möchte einen Tee, bitte.", "Quisiera un té, por favor.", "I'd like a tea, please.", "f"),
        D("Oder du sagst:", "O dices:", "Or you say:"),
        D("Ich nehme ein Wasser.", "Tomo un agua.", "I'll have a water.", "f"),
    ]),
    table("möchten", "querer (amable)", [R("ich", "möcht", "e", 3), R("du", "möcht", "est", 4), R("er / sie", "möcht", "e", 5), R("wir", "möcht", "en", 6)], [
        D("Möchten ist sehr höflich. Hör zu:", "Möchten es muy cortés. Escucha:", "Möchten is very polite. Listen:"),
        D("Möchtest du einen Kaffee?", "¿Quieres un café?", "Would you like a coffee?", "m"),
        D("Schau auf das Ende:", "Mira el final:", "Look at the ending:"),
        D("ich möchte", "yo quisiera", "I'd like"),
        D("du möchtest", "tú quisieras", "you'd like"),
        D("er möchte, sie möchte", "él quisiera, ella quisiera", "he'd like, she'd like"),
        D("wir möchten", "nosotros quisiéramos", "we'd like"),
    ], example={"de": "Möchtest du einen Kaffee?", "es": "¿Quieres un café?", "at": 1}, sticker="☕"),
    words("Wie viel?", "cantidades", [
        ("eine Tasse", "una taza", "☕", "eine Tasse Kaffee", "una taza de café", "a cup of coffee"),
        ("ein Glas", "un vaso / una copa", "🍷", "ein Glas Wein", "una copa de vino", "a glass of wine"),
        ("eine Flasche", "una botella", "🍾", "eine Flasche Wasser", "una botella de agua", "a bottle of water"),
        ("ein Stück", "un pedazo", "🍰", "ein Stück Kuchen", "un pedazo de torta", "a piece of cake"),
    ], D("Im Café brauchst du diese Wörter:", "En el café necesitas estas palabras:", "In a café you need these words:")),
    compare("Bezahlen", {"title": "zusammen", "icon": "👫", "gloss": "juntos", "example": "Zusammen, bitte.", "at": 1},
            {"title": "getrennt", "icon": "🧾", "gloss": "por separado", "example": "Getrennt, bitte.", "at": 3}, [
        D("Am Ende sagst du: Die Rechnung, bitte! Und der Kellner fragt: Zusammen oder getrennt?", "Al final dices: ¡La cuenta, por favor! Y el mesero pregunta: ¿juntos o por separado?", "At the end you say: The bill, please! And the waiter asks: Together or separately?"),
        D("Zusammen, bitte.", "Juntos, por favor.", "Together, please.", "f"),
        D("Oder jeder bezahlt allein:", "O cada uno paga lo suyo:", "Or everyone pays for themselves:"),
        D("Getrennt, bitte.", "Por separado, por favor.", "Separately, please.", "m"),
        D("Und das Trinkgeld? Du sagst einfach: Dreizehn Euro. Stimmt so!", "¿Y la propina? Solo dices: Trece euros. Stimmt so (quédese con el cambio).", "And the tip? You simply say: Thirteen euros. Keep the change!"),
    ]),
    dialogue("Im Café", {"Kellner": {"icon": "🤵", "voice": "m"}, "Lena": LENA},
             D("Hör zu: Lena bestellt im Café.", "Escucha: Lena pide en el café.", "Listen: Lena orders in a café."), [
        ("Kellner", "Was darf es sein?", None, "¿Qué le traigo?", "What can I get you?"),
        ("Lena", "Ich hätte gern einen Tee.", None, "Quisiera un té.", "I'd like a tea."),
        ("Kellner", "Sonst noch etwas?", None, "¿Algo más?", "Anything else?"),
        ("Lena", "Ein Stück Kuchen, bitte.", None, "Un pedazo de torta, por favor.", "A piece of cake, please."),
        ("Kellner", "Das macht 6,50 €.", "Das macht sechs Euro fünfzig.", "Son 6,50 €.", "That's €6.50."),
        ("Lena", "Sieben Euro. Stimmt so!", None, "Siete euros. ¡Quédese con el cambio!", "Seven euros. Keep the change!"),
    ]),
    tryit("Ich möchte …, bitte.\nDie Rechnung, bitte!", D("Jetzt du! Bestell etwas: Ich möchte …, bitte!", "¡Ahora tú! Pide algo: Ich möchte…, bitte.", "Now you! Order something: Ich möchte…, bitte!")),
    recap(["Ich möchte einen Tee.", "Ich nehme ein Wasser.", "eine Tasse · ein Glas · ein Stück", "Die Rechnung, bitte!", "Zusammen oder getrennt?"],
          D("Du bestellst im Café und bezahlst. Super!", "Pides en el café y pagas. ¡Súper!", "You order in a café and pay. Great!")),
])

# ───────────────────────── 16 · Einkaufen ─────────────────────────
UNITS[16] = ("Einkaufen", "Im Supermarkt", [
    title(["🛒", "🥕", "🧾"],
          D("Hallo! Heute kaufen wir ein.", "¡Hola! Hoy vamos de compras.", "Hi! Today we go shopping."),
          D("Im Supermarkt und auf dem Markt.", "En el supermercado y en el mercado.", "At the supermarket and at the market.")),
    words("Mengen", "cantidades", [
        ("ein Kilo", "un kilo", "⚖️", "ein Kilo Äpfel", "un kilo de manzanas", "a kilo of apples"),
        ("ein Liter", "un litro", "🥛", "ein Liter Milch", "un litro de leche", "a litre of milk"),
        ("eine Packung", "un paquete", "📦", "eine Packung Nudeln", "un paquete de pasta", "a pack of pasta"),
        ("eine Dose", "una lata", "🥫", "eine Dose Tomaten", "una lata de tomates", "a can of tomatoes"),
        ("ein Becher", "un vaso (yogur)", "🥣", "ein Becher Joghurt", "un vaso de yogur", "a pot of yoghurt"),
    ], D("Wie viel brauchst du? Hör zu:", "¿Cuánto necesitas? Escucha:", "How much do you need? Listen:")),
    sentence("Im Supermarkt", "en el supermercado", "🛒", [
        {"de": "Wo finde ich Reis?", "es": "¿Dónde encuentro arroz?", "mark": "Wo finde ich", "at": 1},
        {"de": "Haben Sie Erdbeeren?", "es": "¿Tiene fresas?", "mark": "Haben Sie", "at": 3},
    ], [
        D("Du suchst etwas? Dann fragst du:", "¿Buscas algo? Entonces preguntas:", "Looking for something? Then you ask:"),
        D("Entschuldigung, wo finde ich Reis?", "Disculpe, ¿dónde encuentro arroz?", "Excuse me, where can I find rice?", "f"),
        D("Oder du fragst:", "O preguntas:", "Or you ask:"),
        D("Haben Sie frische Erdbeeren?", "¿Tiene fresas frescas?", "Do you have fresh strawberries?", "f"),
        D("Sag zuerst Entschuldigung. Das ist höflich.", "Di primero Entschuldigung (disculpe). Es cortés.", "Say Entschuldigung (excuse me) first. That's polite."),
    ]),
    table("brauchen", "necesitar", [R("der", "", "einen", 3, " Apfel"), R("die", "", "eine", 4, " Tüte"), R("das", "", "ein", 5, " Brot"), R("kein", "", "keinen", 6, " Reis")], [
        D("Was brauchst du? Hör zu:", "¿Qué necesitas? Escucha:", "What do you need? Listen:"),
        D("Ich brauche Milch.", "Necesito leche.", "I need milk.", "f"),
        D("Nach brauchen, kaufen und haben kommt der Akkusativ:", "Después de brauchen, kaufen y haben viene el acusativo:", "After brauchen, kaufen and haben comes the accusative:"),
        D("Ich brauche einen Apfel.", "Necesito una manzana.", "I need an apple."),
        D("Ich kaufe eine Tüte.", "Compro una bolsa.", "I buy a bag."),
        D("Ich habe ein Brot.", "Tengo un pan.", "I have a loaf of bread."),
        D("Ich habe keinen Reis.", "No tengo arroz.", "I have no rice."),
    ], example={"de": "Ich brauche Milch.", "es": "Necesito leche.", "at": 1}, sticker="📝", side=""),
    tip("Tasche\nmitbringen!", "👜",
        D("Ein Tipp für Deutschland:", "Un consejo para Alemania:", "A tip for Germany:"),
        D("Bring deine Tasche mit. Eine Tüte kostet Geld!", "Lleva tu bolsa. ¡Una bolsa cuesta dinero!", "Bring your own bag. A plastic bag costs money!")),
    dialogue("Auf dem Markt", {"Verkäufer": {"icon": "👨‍🌾", "voice": "m"}, "Lena": LENA},
             D("Hör zu: Lena ist auf dem Markt.", "Escucha: Lena está en el mercado.", "Listen: Lena is at the market."), [
        ("Verkäufer", "Guten Tag! Was möchten Sie?", None, "¡Buen día! ¿Qué desea?", "Hello! What would you like?"),
        ("Lena", "Ein Kilo Tomaten, bitte.", None, "Un kilo de tomates, por favor.", "A kilo of tomatoes, please."),
        ("Verkäufer", "Sonst noch etwas?", None, "¿Algo más?", "Anything else?"),
        ("Lena", "Was kosten die Erdbeeren?", None, "¿Cuánto cuestan las fresas?", "How much are the strawberries?"),
        ("Verkäufer", "Drei Euro das Kilo.", None, "Tres euros el kilo.", "Three euros a kilo."),
        ("Lena", "Gut, ein Kilo. Das ist alles.", None, "Bien, un kilo. Eso es todo.", "Good, one kilo. That's all."),
    ]),
    tryit("Ich brauche …\nWo finde ich …?", D("Jetzt du! Was brauchst du heute? Schreib einen Einkaufszettel!", "¡Ahora tú! ¿Qué necesitas hoy? ¡Escribe una lista de compras!", "Now you! What do you need today? Write a shopping list!"), pause=8),
    recap(["ein Kilo · ein Liter · eine Packung", "Wo finde ich …?", "Ich brauche einen Apfel.", "Das ist alles, danke."],
          D("Du kaufst im Supermarkt und auf dem Markt ein.", "Haces compras en el supermercado y en el mercado.", "You shop at the supermarket and at the market.")),
])

# ───────────────────────── 17 · Farben und Kleidung ─────────────────────────
UNITS[17] = ("Farben und Kleidung", "Wie findest du das?", [
    title(["🎨", "👗", "👟"],
          D("Hallo! Heute lernst du Farben und Kleidung.", "¡Hola! Hoy aprendes colores y ropa.", "Hi! Today you learn colours and clothes."),
          D("Wie findest du die Jacke?", "¿Qué te parece la chaqueta?", "What do you think of the jacket?")),
    words("Farben", "colores", [
        ("rot", "rojo", "🟥", "rot", "rojo", "red"),
        ("blau", "azul", "🟦", "blau", "azul", "blue"),
        ("grün", "verde", "🟩", "grün", "verde", "green"),
        ("gelb", "amarillo", "🟨", "gelb", "amarillo", "yellow"),
        ("schwarz", "negro", "⬛", "schwarz", "negro", "black"),
        ("weiß", "blanco", "⬜", "weiß", "blanco", "white"),
    ], D("Das sind die Farben:", "Estos son los colores:", "These are the colours:")),
    words("Kleidung", "ropa", [
        ("der Mantel", "el abrigo", "🧥", "der Mantel", "el abrigo", "the coat"),
        ("die Hose", "el pantalón", "👖", "die Hose", "el pantalón", "the trousers"),
        ("das Hemd", "la camisa", "👔", "das Hemd", "la camisa", "the shirt"),
        ("das Kleid", "el vestido", "👗", "das Kleid", "el vestido", "the dress"),
        ("das T-Shirt", "la camiseta", "👕", "das T-Shirt", "la camiseta", "the T-shirt"),
        ("die Schuhe", "los zapatos", "👟", "die Schuhe", "los zapatos", "the shoes"),
    ], D("Und das ist Kleidung:", "Y esto es ropa:", "And these are clothes:")),
    sentence("Wie findest du …?", "¿qué te parece…?", "👗", [
        {"de": "Wie findest du den Rock?", "es": "¿Qué te parece la falda?", "mark": "findest", "at": 1},
        {"de": "Ich finde ihn schön!", "es": "¡Me parece bonita!", "mark": "ihn", "at": 2},
    ], [
        D("Im Geschäft fragst du deine Freundin:", "En la tienda le preguntas a tu amiga:", "In the shop you ask your friend:"),
        D("Wie findest du den Rock?", "¿Qué te parece la falda?", "What do you think of the skirt?", "f"),
        D("Ich finde ihn schön!", "¡Me parece bonita!", "I think it's pretty!", "m"),
        D("Achtung: der Rock wird ihn!", "Ojo: der Rock se vuelve ihn.", "Careful: der Rock becomes ihn!"),
    ]),
    table("ihn · sie · es", "lo · la", [R("der Mantel", "Ich finde ", "ihn", 1, " toll."), R("die Jacke", "Ich finde ", "sie", 2, " toll."), R("das Hemd", "Ich finde ", "es", 3, " toll."), R("die Schuhe", "Ich finde ", "sie", 4, " toll.")], [
        D("Nach finden kommt der Akkusativ. Hör zu:", "Después de finden viene el acusativo. Escucha:", "After finden comes the accusative. Listen:"),
        D("Der Mantel? Ich finde ihn toll.", "¿El abrigo? Me parece genial.", "The coat? I think it's great."),
        D("Die Jacke? Ich finde sie toll.", "¿La chaqueta? Me parece genial.", "The jacket? I think it's great."),
        D("Das Hemd? Ich finde es toll.", "¿La camisa? Me parece genial.", "The shirt? I think it's great."),
        D("Die Schuhe? Ich finde sie toll.", "¿Los zapatos? Me parecen geniales.", "The shoes? I think they're great."),
    ], pw=230, w=640, tx=260, size=54, side="← nur der\n    ändert sich"),
    dialogue("Im Geschäft", {"Mateo": MATEO, "Verkäuferin": {"icon": "👩", "voice": "f"}},
             D("Hör zu: Mateo kauft eine Jacke.", "Escucha: Mateo compra una chaqueta.", "Listen: Mateo buys a jacket."), [
        ("Mateo", "Haben Sie die Jacke in Blau?", None, "¿Tiene la chaqueta en azul?", "Do you have the jacket in blue?"),
        ("Verkäuferin", "Ja, hier. Welche Größe?", None, "Sí, aquí. ¿Qué talla?", "Yes, here. Which size?"),
        ("Mateo", "Größe M, bitte.", None, "Talla M, por favor.", "Size M, please."),
        ("Verkäuferin", "Wie finden Sie die Jacke?", None, "¿Qué le parece la chaqueta?", "How do you like the jacket?"),
        ("Mateo", "Sie passt gut. Ich nehme sie!", None, "Me queda bien. ¡Me la llevo!", "It fits well. I'll take it!"),
    ]),
    tryit("Mein T-Shirt ist …\nIch finde es …", D("Jetzt du! Schau deine Kleidung an. Welche Farbe hat dein T-Shirt?", "¡Ahora tú! Mira tu ropa. ¿De qué color es tu camiseta?", "Now you! Look at your clothes. What colour is your T-shirt?")),
    recap(["rot · blau · grün · gelb", "die Hose · das Hemd · der Mantel", "Wie findest du den Rock?", "Ich finde ihn schön."],
          D("Du kennst Farben und Kleidung und sagst deine Meinung.", "Conoces colores y ropa y das tu opinión.", "You know colours and clothes and give your opinion.")),
])

# ───────────────────────── 18 · Meine Wohnung ─────────────────────────
UNITS[18] = ("Meine Wohnung", "Zimmer und Möbel", [
    title(["🏠", "🛋️", "🔑"],
          D("Hallo! Heute zeige ich dir meine Wohnung.", "¡Hola! Hoy te muestro mi apartamento.", "Hi! Today I'll show you my flat."),
          D("Welche Zimmer gibt es? Wie ist sie?", "¿Qué habitaciones hay? ¿Cómo es?", "Which rooms are there? What is it like?")),
    words("Die Wohnung", "el apartamento", [
        ("das Wohnzimmer", "la sala", "🛋️", "das Wohnzimmer", "la sala", "the living room"),
        ("das Schlafzimmer", "la habitación", "🛏️", "das Schlafzimmer", "la habitación", "the bedroom"),
        ("die Küche", "la cocina", "🍳", "die Küche", "la cocina", "the kitchen"),
        ("das Bad", "el baño", "🛁", "das Bad", "el baño", "the bathroom"),
        ("der Flur", "el pasillo", "🚪", "der Flur", "el pasillo", "the hallway"),
        ("der Garten", "el jardín", "🌳", "der Garten", "el jardín", "the garden"),
    ], D("Das ist meine Wohnung. Hör zu:", "Este es mi apartamento. Escucha:", "This is my flat. Listen:")),
    sentence("Es gibt …", "hay…", "🏠", [
        {"de": "Es gibt einen Balkon.", "es": "Hay un balcón.", "mark": "einen", "at": 1},
        {"de": "Es gibt keinen Garten.", "es": "No hay jardín.", "mark": "keinen", "at": 3},
    ], [
        D("Was gibt es in der Wohnung? Hör zu:", "¿Qué hay en el apartamento? Escucha:", "What is there in the flat? Listen:"),
        D("Es gibt einen Balkon.", "Hay un balcón.", "There is a balcony.", "f"),
        D("Nach es gibt kommt der Akkusativ: einen, eine, ein.", "Después de es gibt viene el acusativo: einen, eine, ein.", "After es gibt comes the accusative: einen, eine, ein."),
        D("Es gibt keinen Garten.", "No hay jardín.", "There is no garden.", "f"),
        D("Schade!", "¡Qué pena!", "What a pity!"),
    ]),
    compare("Wie ist die Wohnung?", {"title": "groß", "icon": "🏢", "gloss": "grande", "example": "Die Küche ist groß.", "at": 1},
            {"title": "klein", "icon": "🏠", "gloss": "pequeño", "example": "Das Bad ist klein.", "at": 3}, [
        D("Wie ist die Wohnung? Hör zu:", "¿Cómo es el apartamento? Escucha:", "What is the flat like? Listen:"),
        D("Die Küche ist groß.", "La cocina es grande.", "The kitchen is big.", "f"),
        D("Aber:", "Pero:", "But:"),
        D("Das Bad ist klein.", "El baño es pequeño.", "The bathroom is small.", "f"),
        D("Noch mehr Wörter: hell und dunkel, ruhig und laut.", "Más palabras: claro y oscuro, tranquilo y ruidoso.", "More words: bright and dark, quiet and loud."),
    ]),
    tip("2-Zi.-Whg.\n= 2 Zimmer", "🔑",
        D("In Wohnungsanzeigen siehst du oft Abkürzungen:", "En los anuncios de apartamentos ves a menudo abreviaturas:", "In flat adverts you often see abbreviations:"),
        D("Das heißt: Zwei-Zimmer-Wohnung.", "Significa: apartamento de dos habitaciones.", "It means: two-room flat.")),
    dialogue("Die neue Wohnung", LM, D("Hör zu: Lena hat eine neue Wohnung.", "Escucha: Lena tiene un apartamento nuevo.", "Listen: Lena has a new flat."), [
        ("Mateo", "Wie ist deine neue Wohnung?", None, "¿Cómo es tu nuevo apartamento?", "What's your new flat like?"),
        ("Lena", "Sie ist hell und ruhig.", None, "Es claro y tranquilo.", "It's bright and quiet."),
        ("Mateo", "Wie viele Zimmer hat sie?", None, "¿Cuántas habitaciones tiene?", "How many rooms does it have?"),
        ("Lena", "Zwei – und einen Balkon!", None, "Dos… ¡y un balcón!", "Two – and a balcony!"),
        ("Mateo", "Toll! Ist sie teuer?", None, "¡Genial! ¿Es caro?", "Great! Is it expensive?"),
        ("Lena", "Nein, sie ist günstig.", None, "No, está a buen precio.", "No, it's affordable."),
    ]),
    tryit("Meine Wohnung ist …\nEs gibt …", D("Jetzt du! Beschreib deine Wohnung. Was gibt es? Wie ist sie?", "¡Ahora tú! Describe tu apartamento. ¿Qué hay? ¿Cómo es?", "Now you! Describe your flat. What is there? What is it like?"), pause=8),
    recap(["das Wohnzimmer · die Küche · das Bad", "Es gibt einen Balkon.", "groß · klein · hell · ruhig", "2-Zi.-Whg. = 2 Zimmer"],
          D("Du beschreibst deine Wohnung: die Zimmer und wie sie ist.", "Describes tu apartamento: las habitaciones y cómo es.", "You describe your flat: the rooms and what it's like.")),
])

# ───────────────────────── 19 · Das Wetter ─────────────────────────
UNITS[19] = ("Das Wetter", "Wie ist das Wetter?", [
    title(["☀️", "🌧️", "❄️"],
          D("Hallo! Heute sprechen wir über das Wetter.", "¡Hola! Hoy hablamos del clima.", "Hi! Today we talk about the weather."),
          D("Wie ist das Wetter heute?", "¿Cómo está el clima hoy?", "What's the weather like today?")),
    words("Das Wetter", "el clima", [
        ("sonnig", "soleado", "☀️", "Die Sonne scheint. Es ist sonnig.", "Hace sol. Está soleado.", "The sun is shining. It's sunny."),
        ("Es regnet.", "llueve", "🌧️", "Es regnet.", "Llueve.", "It's raining."),
        ("Es schneit.", "nieva", "❄️", "Es schneit.", "Nieva.", "It's snowing."),
        ("windig", "hace viento", "💨", "Es ist windig.", "Hace viento.", "It's windy."),
        ("bewölkt", "nublado", "☁️", "Es ist bewölkt.", "Está nublado.", "It's cloudy."),
        ("das Gewitter", "la tormenta", "⛈️", "Es gibt ein Gewitter.", "Hay una tormenta.", "There's a thunderstorm."),
    ], D("Wie ist das Wetter? Hör zu:", "¿Cómo está el clima? Escucha:", "What's the weather like? Listen:")),
    sentence("Wie warm ist es?", "¿qué temperatura hace?", "🌡️", [
        {"de": "Es sind 25 Grad.", "es": "Hace 25 grados.", "mark": "sind", "at": 1},
        {"de": "Es ist ein Grad.", "es": "Hace un grado.", "mark": "ist", "at": 3},
    ], [
        D("Wie warm ist es? Hör zu:", "¿Qué temperatura hace? Escucha:", "How warm is it? Listen:"),
        D("Es sind fünfundzwanzig Grad.", "Hace veinticinco grados.", "It's twenty-five degrees.", "m"),
        D("Achtung: Wir sagen sind, denn das ist Plural.", "Ojo: decimos sind, porque es plural.", "Careful: we say sind, because it's plural."),
        D("Nur bei eins sagen wir ist: Es ist ein Grad.", "Solo con uno decimos ist: hace un grado.", "Only with one do we say ist: It's one degree.", "f"),
    ], notes=[{"text": "Plural → sind", "at": 2}]),
    table("Das kleine Wort es", "la palabrita «es»", [R("Es", "", "regnet", 1, " heute."), R("Heute", "", "regnet", 2, " es."), R("Im Winter", "", "schneit", 3, " es oft.")], [
        D("Beim Wetter brauchen wir immer es. Und das Verb steht auf Position zwei:", "Con el clima siempre necesitamos es. Y el verbo va en la posición dos:", "With weather we always need es. And the verb is in position two:"),
        D("Es regnet heute.", "Hoy llueve.", "It's raining today."),
        D("Heute regnet es.", "Hoy llueve.", "Today it's raining."),
        D("Im Winter schneit es oft.", "En invierno nieva a menudo.", "In winter it often snows."),
    ], pw=220, w=640, tx=270, size=56, side="← Verb\n    = Position 2"),
    compare("warm oder kalt?", {"title": "warm", "icon": "🌞", "gloss": "cálido", "example": "Es ist heiß!", "at": 1},
            {"title": "kalt", "icon": "🥶", "gloss": "frío", "example": "Es ist kalt!", "at": 3}, [
        D("Im Sommer ist es warm. Manchmal sagen wir:", "En verano hace calor. A veces decimos:", "In summer it's warm. Sometimes we say:"),
        D("Es ist heiß!", "¡Hace mucho calor!", "It's hot!", "f"),
        D("Und im Winter?", "¿Y en invierno?", "And in winter?"),
        D("Brr! Es ist kalt!", "¡Brr! ¡Hace frío!", "Brr! It's cold!", "m"),
        D("Und bei dir? Wie ist das Wetter heute?", "¿Y donde tú estás? ¿Cómo está el clima hoy?", "And where you are? What's the weather like today?"),
    ]),
    dialogue("Am Telefon", LM, D("Hör zu: Lena und Mateo telefonieren.", "Escucha: Lena y Mateo hablan por teléfono.", "Listen: Lena and Mateo are on the phone."), [
        ("Mateo", "Wie ist das Wetter in Berlin?", None, "¿Cómo está el clima en Berlín?", "What's the weather like in Berlin?"),
        ("Lena", "Es regnet und es ist kalt.", None, "Llueve y hace frío.", "It's raining and it's cold."),
        ("Mateo", "Wie viel Grad sind es?", None, "¿Cuántos grados hace?", "How many degrees is it?"),
        ("Lena", "Nur fünf Grad. Und bei dir?", None, "Solo cinco grados. ¿Y donde ti?", "Only five degrees. And where you are?"),
        ("Mateo", "Die Sonne scheint! 25 Grad!", "Die Sonne scheint! Fünfundzwanzig Grad!", "¡Hace sol! ¡25 grados!", "The sun is shining! 25 degrees!"),
        ("Lena", "Oh, super!", None, "¡Oh, qué bien!", "Oh, great!"),
    ]),
    tryit("Heute ist es …\nEs sind … Grad.", D("Jetzt du! Wie ist das Wetter heute bei dir?", "¡Ahora tú! ¿Cómo está el clima hoy donde estás?", "Now you! What's the weather like where you are today?")),
    recap(["Es regnet. Es schneit.", "Die Sonne scheint.", "Es sind 25 Grad.", "warm · heiß · kalt"],
          D("Du sprichst über das Wetter und sagst die Temperatur.", "Hablas del clima y dices la temperatura.", "You talk about the weather and say the temperature.")),
])

# ───────────────────────── 20 · Wiederholung A1.1 ─────────────────────────
UNITS[20] = ("Wiederholung A1.1", "Fit für die Prüfung", [
    title(["🏆", "📝", "🎉"],
          D("Hallo! Das ist die letzte Einheit von A1.1. Super!", "¡Hola! Esta es la última unidad del A1.1. ¡Súper!", "Hi! This is the last unit of A1.1. Great!"),
          D("Heute wiederholen wir alles – wie in der Prüfung.", "Hoy repasamos todo, como en el examen.", "Today we review everything – like in the exam.")),
    words("Sich vorstellen", "presentarse", [
        ("Name", "nombre", "🏷️", "Name: Ich heiße Valentina.", "Nombre: Me llamo Valentina.", "Name: My name is Valentina."),
        ("Alter", "edad", "🎂", "Alter: Ich bin vierundzwanzig Jahre alt.", "Edad: Tengo veinticuatro años.", "Age: I'm twenty-four."),
        ("Land", "país", "🌍", "Land: Ich komme aus Kolumbien.", "País: Soy de Colombia.", "Country: I'm from Colombia."),
        ("Wohnort", "dónde vives", "🏠", "Wohnort: Ich wohne in Medellín.", "Vivienda: Vivo en Medellín.", "Home: I live in Medellín."),
        ("Sprachen", "idiomas", "🗣️", "Sprachen: Ich spreche Spanisch und ein bisschen Deutsch.", "Idiomas: Hablo español y un poco de alemán.", "Languages: I speak Spanish and a bit of German."),
        ("Beruf", "profesión", "💼", "Beruf: Ich bin Ingenieurin.", "Profesión: Soy ingeniera.", "Job: I'm an engineer."),
    ], D("In der Prüfung stellst du dich vor. Dafür gibt es sechs Wörter:", "En el examen te presentas. Para eso hay seis palabras:", "In the exam you introduce yourself. There are six key words:")),
    table("Position 2", "el verbo en la posición 2", [R("Ich", "", "wohne", 1, " in Bogotá."), R("Am Samstag", "", "spiele", 2, " ich Fußball."), R("Was", "", "machst", 3, " du gern?"), R("Ja / Nein?", "", "Hast", 4, " du Zeit?")], [
        D("Die wichtigste Regel: Das Verb steht auf Position zwei.", "La regla más importante: el verbo va en la posición dos.", "The most important rule: the verb is in position two."),
        D("Ich wohne in Bogotá.", "Vivo en Bogotá.", "I live in Bogotá."),
        D("Am Samstag spiele ich Fußball.", "El sábado juego fútbol.", "On Saturday I play football."),
        D("Was machst du gern?", "¿Qué te gusta hacer?", "What do you like doing?"),
        D("Bei Ja-Nein-Fragen steht das Verb vorne: Hast du Zeit?", "En preguntas de sí o no, el verbo va adelante: ¿Tienes tiempo?", "In yes/no questions the verb comes first: Do you have time?"),
    ], pw=250, w=780, tx=210, size=50, side=""),
    compare("Akkusativ", {"title": "der", "icon": "🍎", "gloss": "nominativo", "example": "Der Apfel ist rot.", "at": 1},
            {"title": "den", "icon": "😋", "gloss": "acusativo", "example": "Ich esse den Apfel.", "at": 3}, [
        D("Noch einmal der Akkusativ. Hier ist der Apfel:", "Una vez más el acusativo. Aquí está la manzana:", "The accusative once more. Here is the apple:"),
        D("Der Apfel ist rot.", "La manzana es roja.", "The apple is red.", "f"),
        D("Und jetzt:", "Y ahora:", "And now:"),
        D("Ich esse den Apfel.", "Me como la manzana.", "I eat the apple.", "m"),
        D("Nur der ändert sich. Die, das und der Plural bleiben gleich.", "Solo der cambia. Die, das y el plural se quedan igual.", "Only der changes. Die, das and the plural stay the same."),
    ]),
    dialogue("In der Prüfung", {"Prüferin": {"icon": "👩‍💼", "voice": "f"}, "Mateo": MATEO},
             D("Hör zu: Mateo ist in der Prüfung.", "Escucha: Mateo está en el examen.", "Listen: Mateo is taking the exam."), [
        ("Prüferin", "Wie heißen Sie?", None, "¿Cómo se llama?", "What's your name?"),
        ("Mateo", "Ich heiße Mateo Ríos.", None, "Me llamo Mateo Ríos.", "My name is Mateo Ríos."),
        ("Prüferin", "Woher kommen Sie?", None, "¿De dónde es usted?", "Where are you from?"),
        ("Mateo", "Aus Kolumbien. Aus Cali.", None, "De Colombia. De Cali.", "From Colombia. From Cali."),
        ("Prüferin", "Was sind Sie von Beruf?", None, "¿A qué se dedica?", "What do you do?"),
        ("Mateo", "Ich bin Student.", None, "Soy estudiante.", "I'm a student."),
    ]),
    tryit("Name · Alter · Land\nWohnort · Sprachen\nBeruf", D("Jetzt du! Stell dich vor: Name, Alter, Land, Wohnort, Sprachen, Beruf. Los!", "¡Ahora tú! Preséntate: nombre, edad, país, dónde vives, idiomas, profesión. ¡Vamos!", "Now you! Introduce yourself: name, age, country, home, languages, job. Go!"), pause=12),
    recap(["Ich stelle mich vor.", "Das Verb auf Position 2", "der → den (Akkusativ)", "am Montag · im Mai · um acht", "Fit für A1.2!"],
          D("Du kannst dich vorstellen und kennst die wichtigste Grammatik. Du bist fit für A1.2. Herzlichen Glückwunsch!", "Puedes presentarte y conoces la gramática más importante. Estás listo para el A1.2. ¡Felicitaciones!", "You can introduce yourself and know the key grammar. You're ready for A1.2. Congratulations!"),
          D("Bis bald in A1.2!", "¡Hasta pronto en el A1.2!", "See you soon in A1.2!")),
])


if __name__ == "__main__":
    for n, (title_de, subtitle, scenes) in UNITS.items():
        script = {"key": f"de/a1-1/{n:02d}", "level": "A1.1", "number": n, "title": title_de, "subtitle": subtitle, "scenes": scenes}
        with open(os.path.join(HERE, f"{n:02d}.json"), "w") as f:
            json.dump(script, f, ensure_ascii=False, indent=2)
            f.write("\n")
    print(f"{len(UNITS)} guiones escritos")
