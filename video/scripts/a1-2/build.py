"""
Guiones de los videos A1.2 (unidades 1–20): todo en alemán sencillo,
con traducción para los subtítulos (es / en). Mismo formato que video/scripts/a1-1/build.py.

Uso: python3 video/scripts/a1-2/build.py   → escribe 01.json … 20.json
"""
import importlib.util, json, os

HERE = os.path.dirname(os.path.abspath(__file__))

# Reutilizamos los ayudantes (D, title, words, …) del guion del A1.1
_spec = importlib.util.spec_from_file_location("a11_build", os.path.join(HERE, "..", "a1-1", "build.py"))
_a11 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_a11)
D, title, words, timeline, tip, sentence = _a11.D, _a11.title, _a11.words, _a11.timeline, _a11.tip, _a11.sentence
R, compare, dialogue, tryit, recap = _a11.R, _a11.compare, _a11.dialogue, _a11.tryit, _a11.recap
LENA, MATEO, LM = _a11.LENA, _a11.MATEO, _a11.LM


def table(heading, gloss, rows, say, size=56, side="", **kw):
    """Tabla con tamaño calculado para que quepa en 1280×720 (fuente manuscrita ≈ 0,47 em por letra)."""
    while True:
        pmax = max(len(r["p"]) for r in rows)
        pw = max(120, pmax * 20 + 52)
        tmax = max(len(r["stem"] + r["end"] + r.get("rest", "")) for r in rows)
        w = pw + 40 + int(tmax * size * 0.47) + 50
        sw = (max(len(x) for x in side.split("\n")) * 19 + 40) if side else 0
        tx = min(360, 1230 - w - sw)
        if tx >= 150 or size <= 40:
            break
        size -= 4
    sc = {"type": "conjugation", "heading": heading, "gloss": gloss, "rows": rows, "say": say,
          "pw": pw, "w": w, "tx": max(150, tx), "size": size, "side": side, **kw}
    sc.setdefault("tableAt", 0)
    return sc


UNITS = {}

# ───────────────────────── 1 · Termine ─────────────────────────
UNITS[1] = ("Termine", "Einen Termin machen", [
    title(["📅", "☎️", "💇"],
          D("Hallo! Willkommen in A1.2! Heute machen wir Termine.", "¡Hola! ¡Bienvenido al A1.2! Hoy hacemos citas.", "Hi! Welcome to A1.2! Today we make appointments."),
          D("Beim Arzt, beim Friseur oder mit Freunden.", "Con el médico, en la peluquería o con amigos.", "At the doctor's, the hairdresser's or with friends.")),
    table("Wann?", "¿cuándo?", [R("Tag", "", "am", 1, " Montag"), R("Uhrzeit", "", "um", 2, " 10 Uhr"), R("Monat", "", "im", 3, " Juni"), R("Zeitraum", "", "von", 4, " 9 bis 12 Uhr")], [
        D("Wann ist der Termin? Diese Wörter brauchst du:", "¿Cuándo es la cita? Necesitas estas palabras:", "When is the appointment? You need these words:"),
        D("Für Tage: am Montag.", "Para días: am Montag (el lunes).", "For days: am Montag (on Monday)."),
        D("Für die Uhrzeit: um zehn Uhr.", "Para la hora: um zehn Uhr (a las diez).", "For the time: um zehn Uhr (at ten)."),
        D("Für Monate: im Juni.", "Para meses: im Juni (en junio).", "For months: im Juni (in June)."),
        D("Und für eine Zeit: von neun bis zwölf.", "Y para un periodo: von neun bis zwölf (de nueve a doce).", "And for a period: von neun bis zwölf (from nine to twelve)."),
    ]),
    sentence("Am Telefon", "por teléfono", "☎️", [
        {"de": "Ich brauche einen Termin.", "es": "Necesito una cita.", "mark": "Termin", "at": 1},
        {"de": "Geht es am Freitag?", "es": "¿Puede ser el viernes?", "mark": "Geht es", "at": 3},
    ], [
        D("Du rufst an und sagst:", "Llamas y dices:", "You call and say:"),
        D("Ich brauche einen Termin.", "Necesito una cita.", "I need an appointment.", "m"),
        D("Dann fragst du:", "Luego preguntas:", "Then you ask:"),
        D("Geht es am Freitag?", "¿Puede ser el viernes?", "Is Friday possible?", "m"),
        D("Geht es heißt: Ist das möglich?", "Geht es significa: ¿es posible?", "Geht es means: is that possible?"),
    ]),
    compare("Passt das?", {"title": "ja", "icon": "👍", "gloss": "sí", "example": "Ja, das passt.", "at": 1},
            {"title": "nein", "icon": "🙅", "gloss": "no", "example": "Da kann ich nicht.", "at": 3}, [
        D("Der Termin ist gut? Dann sagst du:", "¿La cita te sirve? Entonces dices:", "The appointment is good? Then you say:"),
        D("Ja, das passt gut.", "Sí, me queda bien.", "Yes, that suits me.", "f"),
        D("Der Termin ist nicht gut? Dann sagst du:", "¿La cita no te sirve? Entonces dices:", "The appointment isn't good? Then you say:"),
        D("Da kann ich leider nicht.", "Ese día no puedo, lo siento.", "I'm afraid I can't then.", "m"),
    ]),
    dialogue("Beim Friseur", {"Salon": {"icon": "💇‍♀️", "voice": "f"}, "Mateo": MATEO},
             D("Hör zu: Mateo ruft beim Friseur an.", "Escucha: Mateo llama a la peluquería.", "Listen: Mateo calls the hairdresser's."), [
        ("Salon", "Salon Haarmonie, guten Tag!", None, "Salón Haarmonie, ¡buenos días!", "Salon Haarmonie, hello!"),
        ("Mateo", "Ich brauche einen Termin.", None, "Necesito una cita.", "I need an appointment."),
        ("Salon", "Am Dienstag um zehn?", "Geht es am Dienstag um zehn Uhr?", "¿Puede ser el martes a las diez?", "Is Tuesday at ten OK?"),
        ("Mateo", "Da kann ich leider nicht.", None, "Ese día no puedo, lo siento.", "I'm afraid I can't then."),
        ("Salon", "Und am Mittwoch um vier?", "Und am Mittwoch um vier Uhr?", "¿Y el miércoles a las cuatro?", "And Wednesday at four?"),
        ("Mateo", "Ja, das passt gut. Danke!", None, "Sí, me queda bien. ¡Gracias!", "Yes, that suits me. Thanks!"),
    ]),
    tryit("Ich brauche\neinen Termin.\nGeht es am …?", D("Jetzt du! Ruf beim Arzt an. Sag: Ich brauche einen Termin. Geht es am Montag?", "¡Ahora tú! Llama al médico. Di: Necesito una cita. ¿Puede ser el lunes?", "Now you! Call the doctor. Say: I need an appointment. Is Monday possible?"), pause=8),
    recap(["am Montag · um 10 Uhr · im Juni", "Ich brauche einen Termin.", "Geht es am Freitag?", "Ja, das passt. / Da kann ich nicht."],
          D("Du machst Termine und sagst ja oder nein – ganz höflich.", "Haces citas y dices sí o no, con mucha cortesía.", "You make appointments and say yes or no – very politely.")),
])

# ───────────────────────── 2 · Verabredungen ─────────────────────────
UNITS[2] = ("Verabredungen", "Hast du Zeit?", [
    title(["🎬", "☕", "🎉"],
          D("Hallo! Heute machen wir Pläne mit Freunden.", "¡Hola! Hoy hacemos planes con amigos.", "Hi! Today we make plans with friends."),
          D("Hast du Zeit? Hast du Lust?", "¿Tienes tiempo? ¿Tienes ganas?", "Are you free? Do you feel like it?")),
    words("Was machen wir?", "¿qué hacemos?", [
        ("ins Kino gehen", "ir a cine", "🎬", "Gehen wir ins Kino?", "¿Vamos a cine?", "Shall we go to the cinema?"),
        ("Kaffee trinken", "tomar café", "☕", "Trinken wir einen Kaffee?", "¿Tomamos un café?", "Shall we have a coffee?"),
        ("tanzen gehen", "ir a bailar", "💃", "Gehen wir tanzen?", "¿Vamos a bailar?", "Shall we go dancing?"),
        ("ins Konzert gehen", "ir a un concierto", "🎸", "Gehen wir ins Konzert?", "¿Vamos a un concierto?", "Shall we go to a concert?"),
        ("Fußball spielen", "jugar fútbol", "⚽", "Spielen wir Fußball?", "¿Jugamos fútbol?", "Shall we play football?"),
        ("spazieren gehen", "ir a caminar", "🌳", "Gehen wir spazieren?", "¿Vamos a caminar?", "Shall we go for a walk?"),
    ], D("Hier sind Ideen für das Wochenende:", "Aquí hay ideas para el fin de semana:", "Here are ideas for the weekend:")),
    sentence("Fragen", "preguntar", "🙋", [
        {"de": "Hast du am Samstag Zeit?", "es": "¿Tienes tiempo el sábado?", "mark": "Zeit", "at": 1},
        {"de": "Hast du Lust auf Kino?", "es": "¿Tienes ganas de ir a cine?", "mark": "Lust", "at": 3},
    ], [
        D("So fragst du eine Freundin:", "Así le preguntas a una amiga:", "This is how you ask a friend:"),
        D("Hast du am Samstag Zeit?", "¿Tienes tiempo el sábado?", "Are you free on Saturday?", "m"),
        D("Und so fragst du, ob sie möchte:", "Y así preguntas si ella quiere:", "And this is how you ask if she wants to:"),
        D("Hast du Lust auf Kino?", "¿Tienes ganas de ir a cine?", "Do you feel like going to the cinema?", "m"),
    ]),
    compare("Antworten", {"title": "zusagen", "icon": "🥳", "gloss": "aceptar", "example": "Gute Idee!", "at": 1},
            {"title": "absagen", "icon": "😕", "gloss": "rechazar", "example": "Leider nicht.", "at": 3}, [
        D("Du möchtest mitkommen? Dann sagst du:", "¿Quieres ir? Entonces dices:", "You want to come? Then you say:"),
        D("Gute Idee! Gern!", "¡Buena idea! ¡Con gusto!", "Good idea! Gladly!", "f"),
        D("Du hast keine Zeit? Dann sagst du:", "¿No tienes tiempo? Entonces dices:", "You don't have time? Then you say:"),
        D("Leider nicht. Ich muss arbeiten.", "Lastimosamente no. Tengo que trabajar.", "Unfortunately not. I have to work.", "m"),
        D("Sag immer warum. Das ist freundlich.", "Di siempre por qué. Es amable.", "Always say why. That's friendly."),
    ]),
    dialogue("Am Samstag?", LM, D("Hör zu: Lena hat eine Idee.", "Escucha: Lena tiene una idea.", "Listen: Lena has an idea."), [
        ("Lena", "Hast du am Samstag Zeit?", None, "¿Tienes tiempo el sábado?", "Are you free on Saturday?"),
        ("Mateo", "Ja. Was machen wir?", None, "Sí. ¿Qué hacemos?", "Yes. What shall we do?"),
        ("Lena", "Gehen wir ins Kino?", None, "¿Vamos a cine?", "Shall we go to the cinema?"),
        ("Mateo", "Gute Idee! Wann?", None, "¡Buena idea! ¿Cuándo?", "Good idea! When?"),
        ("Lena", "Um acht vor dem Kino?", "Treffen wir uns um acht vor dem Kino?", "¿Nos vemos a las ocho frente al cine?", "Shall we meet at eight in front of the cinema?"),
        ("Mateo", "Super. Bis Samstag!", None, "Súper. ¡Hasta el sábado!", "Great. See you Saturday!"),
    ]),
    tryit("Hast du Zeit?\nGehen wir …?\nTreffen wir uns …?", D("Jetzt du! Lade eine Freundin ein: Hast du Zeit? Gehen wir …? Wann treffen wir uns?", "¡Ahora tú! Invita a una amiga: ¿Tienes tiempo? ¿Vamos a…? ¿Cuándo nos vemos?", "Now you! Invite a friend: Are you free? Shall we go…? When shall we meet?"), pause=10),
    recap(["Hast du Zeit? · Hast du Lust?", "Gehen wir ins Kino?", "Gute Idee! / Leider nicht.", "Treffen wir uns um acht?"],
          D("Du machst Vorschläge, sagst zu oder ab – und erklärst warum.", "Haces propuestas, aceptas o rechazas, y explicas por qué.", "You make suggestions, accept or decline – and explain why.")),
])

# ───────────────────────── 3 · Können und wollen ─────────────────────────
UNITS[3] = ("Können und wollen", "Die Modalverben", [
    title(["🏊", "🚗", "🎸"],
          D("Hallo! Heute lernst du die Modalverben.", "¡Hola! Hoy aprendes los verbos modales.", "Hi! Today you learn the modal verbs."),
          D("Was kannst du? Was willst du? Was musst du?", "¿Qué sabes hacer? ¿Qué quieres? ¿Qué tienes que hacer?", "What can you do? What do you want? What must you do?")),
    words("Vier Modalverben", "cuatro verbos modales", [
        ("können", "poder, saber", "🏊", "können: Ich kann schwimmen.", "können: sé nadar.", "können: I can swim."),
        ("wollen", "querer", "🎯", "wollen: Ich will Deutsch lernen.", "wollen: quiero aprender alemán.", "wollen: I want to learn German."),
        ("müssen", "tener que", "⏰", "müssen: Ich muss arbeiten.", "müssen: tengo que trabajar.", "müssen: I have to work."),
        ("dürfen", "tener permiso", "🚭", "dürfen: Hier darf man nicht rauchen.", "dürfen: aquí no se permite fumar.", "dürfen: you may not smoke here."),
    ], D("Diese vier Verben brauchst du jeden Tag:", "Estos cuatro verbos los necesitas cada día:", "You need these four verbs every day:")),
    table("können", "poder, saber", [R("ich", "", "kann", 1), R("du", "", "kannst", 2), R("er / sie", "", "kann", 3), R("wir", "", "können", 4), R("Sie", "", "können", 5)], [
        D("So konjugierst du können:", "Así se conjuga können:", "This is how you conjugate können:"),
        D("ich kann", "yo puedo", "I can"),
        D("du kannst", "tú puedes", "you can"),
        D("er kann, sie kann", "él puede, ella puede", "he can, she can"),
        D("wir können", "nosotros podemos", "we can"),
        D("Sie können. Achtung: Bei ich und er gibt es keine Endung!", "Usted puede. Ojo: con ich y er no hay terminación.", "You can (formal). Note: ich and er have no ending!"),
    ], size=60, side="ich kann =\ner kann"),
    sentence("Die Satzklammer", "el paréntesis verbal", "📎", [
        {"de": "Ich kann gut kochen.", "es": "Sé cocinar bien.", "mark": "kann", "at": 1},
        {"de": "Er muss heute arbeiten.", "es": "Él tiene que trabajar hoy.", "mark": "arbeiten", "at": 3},
    ], [
        D("Jetzt ein wichtiger Satz:", "Ahora una frase importante:", "Now an important sentence:"),
        D("Ich kann gut kochen.", "Sé cocinar bien.", "I can cook well.", "f"),
        D("Das Modalverb steht auf Position zwei. Das zweite Verb steht am Ende:", "El verbo modal va en la posición dos. El segundo verbo va al final:", "The modal verb is in position two. The second verb goes to the end:"),
        D("Er muss heute arbeiten.", "Él tiene que trabajar hoy.", "He has to work today.", "m"),
        D("Das ist wie eine Klammer: kann … kochen. Muss … arbeiten.", "Es como un paréntesis: kann… kochen. Muss… arbeiten.", "It's like a bracket: kann… kochen. Muss… arbeiten."),
    ], notes=[{"text": "Ende!", "at": 4}], notesX=980),
    dialogue("Kannst du …?", LM, D("Hör zu: Lena und Mateo sprechen über ihre Talente.", "Escucha: Lena y Mateo hablan de sus talentos.", "Listen: Lena and Mateo talk about their talents."), [
        ("Lena", "Kannst du schwimmen?", None, "¿Sabes nadar?", "Can you swim?"),
        ("Mateo", "Ja, sehr gut! Und du?", None, "¡Sí, muy bien! ¿Y tú?", "Yes, very well! And you?"),
        ("Lena", "Nein. Ich will es lernen!", "Nein, aber ich will es lernen.", "No, pero quiero aprender.", "No, but I want to learn."),
        ("Mateo", "Ich kann es dir zeigen!", None, "¡Te puedo enseñar!", "I can show you!"),
        ("Lena", "Super! Am Samstag?", None, "¡Súper! ¿El sábado?", "Great! On Saturday?"),
        ("Mateo", "Da muss ich arbeiten.", None, "Ese día tengo que trabajar.", "I have to work then."),
    ]),
    tryit("Ich kann …\nIch will …\nIch muss …", D("Jetzt du! Sag drei Sätze: Was kannst du? Was willst du? Was musst du heute machen?", "¡Ahora tú! Di tres frases: ¿qué sabes hacer? ¿Qué quieres? ¿Qué tienes que hacer hoy?", "Now you! Say three sentences: what can you do, what do you want, what must you do today?"), pause=10),
    recap(["können · wollen · müssen · dürfen", "ich kann · du kannst · er kann", "Ich kann gut kochen.", "Modalverb (2) … Verb am Ende"],
          D("Du kennst die Modalverben und die Satzklammer. Das zweite Verb steht immer am Ende!", "Conoces los verbos modales y el paréntesis verbal. ¡El segundo verbo siempre va al final!", "You know the modal verbs and the verbal bracket. The second verb always goes to the end!")),
])

# ───────────────────────── 4 · Im Restaurant ─────────────────────────
UNITS[4] = ("Im Restaurant", "Bestellen und bezahlen", [
    title(["🍽️", "🍝", "🧾"],
          D("Hallo! Heute gehen wir ins Restaurant.", "¡Hola! Hoy vamos al restaurante.", "Hi! Today we go to a restaurant."),
          D("Du bestellst, du isst und du bezahlst.", "Pides, comes y pagas.", "You order, you eat and you pay.")),
    words("Die Speisekarte", "la carta", [
        ("die Vorspeise", "la entrada", "🥗", "die Vorspeise: zum Beispiel eine Suppe.", "la entrada: por ejemplo, una sopa.", "the starter: for example a soup."),
        ("das Hauptgericht", "el plato fuerte", "🍝", "das Hauptgericht: Fisch, Fleisch oder Pasta.", "el plato fuerte: pescado, carne o pasta.", "the main course: fish, meat or pasta."),
        ("die Nachspeise", "el postre", "🍰", "die Nachspeise: Kuchen oder Eis.", "el postre: torta o helado.", "the dessert: cake or ice cream."),
        ("die Getränke", "las bebidas", "🥤", "die Getränke: Wasser, Saft, Wein.", "las bebidas: agua, jugo, vino.", "the drinks: water, juice, wine."),
    ], D("Im Restaurant liest du die Speisekarte:", "En el restaurante lees la carta:", "In the restaurant you read the menu:")),
    sentence("Bestellen", "pedir", "🙋", [
        {"de": "Ich hätte gern die Suppe.", "es": "Quisiera la sopa.", "mark": "hätte gern", "at": 1},
        {"de": "Ich nehme den Fisch.", "es": "Tomo el pescado.", "mark": "nehme", "at": 3},
    ], [
        D("Höflich bestellen ist einfach:", "Pedir con cortesía es fácil:", "Ordering politely is easy:"),
        D("Ich hätte gern die Suppe.", "Quisiera la sopa.", "I'd like the soup.", "f"),
        D("Oder kurz:", "O corto:", "Or short:"),
        D("Ich nehme den Fisch.", "Tomo el pescado.", "I'll have the fish.", "m"),
    ]),
    compare("Bezahlen", {"title": "zusammen", "icon": "🧾", "gloss": "todo junto", "example": "Zusammen, bitte.", "at": 2},
            {"title": "getrennt", "icon": "✂️", "gloss": "por separado", "example": "Getrennt, bitte.", "at": 4}, [
        D("Am Ende sagst du: Die Rechnung, bitte! Die Kellnerin fragt: Zusammen oder getrennt?", "Al final dices: ¡La cuenta, por favor! La mesera pregunta: ¿junto o por separado?", "At the end you say: The bill, please! The waitress asks: together or separately?"),
        D("Eine Person bezahlt alles:", "Una persona paga todo:", "One person pays for everything:"),
        D("Zusammen, bitte.", "Todo junto, por favor.", "Together, please.", "m"),
        D("Jede Person bezahlt selbst:", "Cada persona paga lo suyo:", "Everyone pays for themselves:"),
        D("Getrennt, bitte.", "Por separado, por favor.", "Separately, please.", "f"),
    ]),
    tip("Stimmt so!", "💶",
        D("In Deutschland gibt man etwa zehn Prozent Trinkgeld. Das Essen kostet achtzehn Euro? Du gibst zwanzig und sagst:", "En Alemania se da más o menos un diez por ciento de propina. ¿La comida cuesta dieciocho euros? Das veinte y dices:", "In Germany you tip about ten percent. The meal costs eighteen euros? You give twenty and say:"),
        D("Stimmt so!", "¡Así está bien! (quédese con el cambio)", "Keep the change!"), size=80),
    dialogue("Im Restaurant", {"Kellnerin": {"icon": "👩‍🍳", "voice": "f"}, "Mateo": MATEO},
             D("Hör zu: Mateo bestellt.", "Escucha: Mateo pide.", "Listen: Mateo orders."), [
        ("Kellnerin", "Was möchten Sie trinken?", None, "¿Qué desea tomar?", "What would you like to drink?"),
        ("Mateo", "Ein Wasser, bitte.", None, "Un agua, por favor.", "A water, please."),
        ("Kellnerin", "Und zu essen?", "Und was möchten Sie essen?", "¿Y de comer?", "And to eat?"),
        ("Mateo", "Ich nehme die Pasta.", None, "Tomo la pasta.", "I'll have the pasta."),
        ("Mateo", "Die Rechnung, bitte!", None, "¡La cuenta, por favor!", "The bill, please!"),
        ("Kellnerin", "Das macht 14,50 Euro.", "Das macht vierzehn Euro fünfzig.", "Son 14,50 euros.", "That's 14.50 euros."),
    ]),
    tryit("Ich hätte gern …\nIch nehme …\nDie Rechnung, bitte!", D("Jetzt du! Bestell ein Getränk und ein Essen. Dann frag nach der Rechnung.", "¡Ahora tú! Pide una bebida y una comida. Luego pide la cuenta.", "Now you! Order a drink and a meal. Then ask for the bill."), pause=10),
    recap(["Vorspeise · Hauptgericht · Nachspeise", "Ich hätte gern … / Ich nehme …", "Die Rechnung, bitte!", "Zusammen oder getrennt?"],
          D("Du bestellst und bezahlst im Restaurant – wie ein Profi.", "Pides y pagas en el restaurante, como un profesional.", "You order and pay in a restaurant – like a pro.")),
])

# ───────────────────────── 5 · Der Körper ─────────────────────────
UNITS[5] = ("Der Körper", "Was tut dir weh?", [
    title(["💪", "🦶", "🤕"],
          D("Hallo! Heute lernst du den Körper.", "¡Hola! Hoy aprendes el cuerpo.", "Hi! Today you learn the body."),
          D("Und du sagst, was dir wehtut.", "Y dices qué te duele.", "And you say what hurts.")),
    words("Der Körper", "el cuerpo", [
        ("der Kopf", "la cabeza", "🗣️", "der Kopf", "la cabeza", "the head"),
        ("der Arm", "el brazo", "💪", "der Arm", "el brazo", "the arm"),
        ("die Hand", "la mano", "✋", "die Hand", "la mano", "the hand"),
        ("der Bauch", "el estómago", "🫃", "der Bauch", "el estómago, la barriga", "the belly"),
        ("das Bein", "la pierna", "🦵", "das Bein", "la pierna", "the leg"),
        ("der Fuß", "el pie", "🦶", "der Fuß", "el pie", "the foot"),
    ], D("Hör zu und zeig mit:", "Escucha y señala:", "Listen and point:")),
    words("Im Gesicht", "en la cara", [
        ("das Auge", "el ojo", "👁️", "das Auge, die Augen", "el ojo, los ojos", "the eye, the eyes"),
        ("das Ohr", "la oreja", "👂", "das Ohr, die Ohren", "la oreja, las orejas", "the ear, the ears"),
        ("die Nase", "la nariz", "👃", "die Nase", "la nariz", "the nose"),
        ("der Mund", "la boca", "👄", "der Mund", "la boca", "the mouth"),
    ], D("Und im Gesicht:", "Y en la cara:", "And on the face:")),
    table("tut / tun weh", "duele / duelen", [R("1", "Der Kopf ", "tut", 1, " weh."), R("2+", "Die Füße ", "tun", 3, " weh.")], [
        D("Was tut weh? Bei einem Körperteil sagst du tut:", "¿Qué duele? Con una parte del cuerpo dices tut:", "What hurts? With one body part you say tut:"),
        D("Der Kopf tut weh.", "Me duele la cabeza.", "My head hurts."),
        D("Bei zwei oder mehr sagst du tun:", "Con dos o más dices tun:", "With two or more you say tun:"),
        D("Die Füße tun weh.", "Me duelen los pies.", "My feet hurt."),
    ], size=60),
    sentence("Mir tut … weh.", "me duele…", "🤕", [
        {"de": "Mir tut der Bauch weh.", "es": "Me duele el estómago.", "mark": "Mir", "at": 1},
        {"de": "Was tut dir weh?", "es": "¿Qué te duele?", "mark": "dir", "at": 3},
    ], [
        D("Für dich sagst du mir:", "Para ti mismo dices mir:", "For yourself you say mir:"),
        D("Mir tut der Bauch weh.", "Me duele el estómago.", "My stomach hurts.", "m"),
        D("Und eine Freundin fragst du:", "Y a una amiga le preguntas:", "And you ask a friend:"),
        D("Was tut dir weh?", "¿Qué te duele?", "What hurts?", "f"),
    ]),
    dialogue("Was ist los?", LM, D("Hör zu: Mateo geht es nicht gut.", "Escucha: Mateo no se siente bien.", "Listen: Mateo isn't feeling well."), [
        ("Lena", "Was ist los, Mateo?", None, "¿Qué pasa, Mateo?", "What's wrong, Mateo?"),
        ("Mateo", "Mir tut der Kopf weh.", None, "Me duele la cabeza.", "My head hurts."),
        ("Lena", "Oh! Hast du Fieber?", None, "¡Oh! ¿Tienes fiebre?", "Oh! Do you have a fever?"),
        ("Mateo", "Nein, ich bin nur müde.", None, "No, solo estoy cansado.", "No, I'm just tired."),
        ("Lena", "Trink einen Tee!", None, "¡Tómate un té!", "Have a tea!"),
        ("Mateo", "Gute Idee. Danke!", None, "Buena idea. ¡Gracias!", "Good idea. Thanks!"),
    ]),
    tryit("Mir tut … weh.\nMir tun … weh.", D("Jetzt du! Zeig auf deinen Kopf, deinen Arm, deine Füße. Sag: Mir tut … weh.", "¡Ahora tú! Señala tu cabeza, tu brazo, tus pies. Di: Mir tut… weh.", "Now you! Point to your head, arm, feet. Say: Mir tut… weh."), pause=8),
    recap(["Kopf · Arm · Hand · Bauch · Bein · Fuß", "Auge · Ohr · Nase · Mund", "Der Kopf tut weh. / Die Füße tun weh.", "Mir tut der Bauch weh."],
          D("Du kennst den Körper und sagst, was dir wehtut. Gute Besserung!", "Conoces el cuerpo y dices qué te duele. ¡Que te mejores!", "You know the body and say what hurts. Get well soon!")),
])

# ───────────────────────── 6 · Beim Arzt ─────────────────────────
UNITS[6] = ("Beim Arzt", "In der Arztpraxis", [
    title(["🩺", "💊", "🤒"],
          D("Hallo! Heute gehen wir zum Arzt.", "¡Hola! Hoy vamos al médico.", "Hi! Today we go to the doctor."),
          D("Du lernst auch den Imperativ mit Sie.", "También aprendes el imperativo con Sie.", "You also learn the imperative with Sie.")),
    words("Beim Arzt", "en el médico", [
        ("das Fieber", "la fiebre", "🤒", "Ich habe Fieber.", "Tengo fiebre.", "I have a fever."),
        ("der Husten", "la tos", "😷", "Ich habe Husten.", "Tengo tos.", "I have a cough."),
        ("der Schnupfen", "la gripa, el moqueo", "🤧", "Ich habe Schnupfen.", "Tengo gripa.", "I have a cold."),
        ("die Tabletten", "las pastillas", "💊", "Nehmen Sie die Tabletten.", "Tome las pastillas.", "Take the tablets."),
        ("das Rezept", "la fórmula médica", "📝", "Hier ist das Rezept.", "Aquí está la fórmula.", "Here's the prescription."),
        ("die Apotheke", "la farmacia", "🏥", "Die Tabletten gibt es in der Apotheke.", "Las pastillas las venden en la farmacia.", "You get the tablets at the pharmacy."),
    ], D("Diese Wörter hörst du in der Praxis:", "Estas palabras las oyes en el consultorio:", "You hear these words at the practice:")),
    sentence("seit", "desde hace", "📆", [
        {"de": "Seit drei Tagen.", "es": "Desde hace tres días.", "mark": "Seit", "at": 2},
        {"de": "Seit gestern.", "es": "Desde ayer.", "mark": "Seit", "at": 3},
    ], [
        D("Der Arzt fragt: Seit wann sind Sie krank? Du antwortest mit seit:", "El médico pregunta: ¿desde cuándo está enfermo? Respondes con seit:", "The doctor asks: since when have you been ill? You answer with seit:"),
        D("Seit drei Tagen.", "Desde hace tres días.", "For three days.", "m"),
        D("Oder: Seit gestern.", "O: desde ayer.", "Or: since yesterday.", "f"),
    ]),
    table("Imperativ mit Sie", "imperativo formal", [R("trinken", "", "Trinken", 1, " Sie viel Tee!"), R("bleiben", "", "Bleiben", 2, " Sie im Bett!"), R("nehmen", "", "Nehmen", 3, " Sie Tabletten!")], [
        D("Der Arzt sagt, was du machen sollst. Das Verb steht vorne, dann Sie:", "El médico te dice qué hacer. El verbo va adelante y luego Sie:", "The doctor tells you what to do. The verb comes first, then Sie:"),
        D("Trinken Sie viel Tee!", "¡Tome mucho té!", "Drink lots of tea!"),
        D("Bleiben Sie im Bett!", "¡Quédese en cama!", "Stay in bed!"),
        D("Nehmen Sie die Tabletten!", "¡Tómese las pastillas!", "Take the tablets!"),
    ], size=56),
    tip("Notruf:\n112", "🚑",
        D("Sehr wichtig: Im Notfall rufst du die Nummer eins, eins, zwei an.", "Muy importante: en una emergencia llamas al número uno, uno, dos.", "Very important: in an emergency you call one, one, two."),
        D("Eins, eins, zwei.", "Uno, uno, dos.", "One, one, two.")),
    dialogue("In der Praxis", {"Ärztin": {"icon": "👩‍⚕️", "voice": "f"}, "Mateo": MATEO},
             D("Hör zu: Mateo ist beim Arzt.", "Escucha: Mateo está en el médico.", "Listen: Mateo is at the doctor's."), [
        ("Ärztin", "Was fehlt Ihnen?", None, "¿Qué le pasa?", "What's the matter?"),
        ("Mateo", "Ich habe Husten und Fieber.", None, "Tengo tos y fiebre.", "I have a cough and a fever."),
        ("Ärztin", "Seit wann?", "Seit wann haben Sie Fieber?", "¿Desde cuándo?", "Since when?"),
        ("Mateo", "Seit zwei Tagen.", None, "Desde hace dos días.", "For two days."),
        ("Ärztin", "Bleiben Sie im Bett!", None, "¡Quédese en cama!", "Stay in bed!"),
        ("Ärztin", "Trinken Sie viel Tee!", None, "¡Tome mucho té!", "Drink lots of tea!"),
    ]),
    tryit("Ich habe …\nseit …\nMir tut … weh.", D("Jetzt du! Du bist beim Arzt. Was hast du? Seit wann? Was tut dir weh?", "¡Ahora tú! Estás en el médico. ¿Qué tienes? ¿Desde cuándo? ¿Qué te duele?", "Now you! You're at the doctor's. What's wrong? Since when? What hurts?"), pause=10),
    recap(["Fieber · Husten · Schnupfen", "seit drei Tagen · seit gestern", "Trinken Sie viel Tee!", "Notruf: 112"],
          D("Du sprichst mit dem Arzt und verstehst seine Tipps. Gute Besserung!", "Hablas con el médico y entiendes sus consejos. ¡Que te mejores!", "You talk to the doctor and understand the advice. Get well soon!")),
])

# ───────────────────────── 7 · In der Stadt ─────────────────────────
UNITS[7] = ("In der Stadt", "Orte und der Dativ", [
    title(["🏙️", "🏦", "🥨"],
          D("Hallo! Heute gehen wir in die Stadt.", "¡Hola! Hoy vamos a la ciudad.", "Hi! Today we go into town."),
          D("Und du lernst den Dativ. Keine Angst, er ist einfach!", "Y aprendes el dativo. ¡No te preocupes, es fácil!", "And you learn the dative. Don't worry, it's easy!")),
    words("In der Stadt", "en la ciudad", [
        ("der Bahnhof", "la estación", "🚉", "der Bahnhof", "la estación de tren", "the station"),
        ("die Bank", "el banco", "🏦", "die Bank", "el banco", "the bank"),
        ("die Post", "el correo", "📮", "die Post", "la oficina de correos", "the post office"),
        ("die Bäckerei", "la panadería", "🥨", "die Bäckerei", "la panadería", "the bakery"),
        ("das Kino", "el cine", "🎬", "das Kino", "el cine", "the cinema"),
        ("der Park", "el parque", "🌳", "der Park", "el parque", "the park"),
    ], D("Was gibt es in der Stadt?", "¿Qué hay en la ciudad?", "What is there in town?")),
    table("Dativ: Wo?", "¿dónde? (dativo)", [R("der", "in ", "dem", 1, " Park"), R("die", "in ", "der", 2, " Bank"), R("das", "in ", "dem", 3, " Kino"), R("Plural", "in ", "den", 4, " Parks")], [
        D("Wo bist du? Nach in, an, neben und bei kommt der Dativ:", "¿Dónde estás? Después de in, an, neben y bei viene el dativo:", "Where are you? After in, an, neben and bei comes the dative:"),
        D("der wird dem: in dem Park.", "der se vuelve dem: en el parque.", "der becomes dem: in the park."),
        D("die wird der: in der Bank.", "die se vuelve der: en el banco.", "die becomes der: in the bank."),
        D("das wird dem: in dem Kino.", "das se vuelve dem: en el cine.", "das becomes dem: in the cinema."),
        D("Und im Plural: den.", "Y en plural: den.", "And in the plural: den."),
    ], size=60, side="der → dem\ndie → der\ndas → dem"),
    compare("Kurz!", {"title": "im", "icon": "🌳", "gloss": "= in dem", "example": "im Park", "at": 1},
            {"title": "am", "icon": "🚉", "gloss": "= an dem", "example": "am Bahnhof", "at": 3}, [
        D("Wir sprechen schnell. In dem wird im:", "Hablamos rápido. In dem se vuelve im:", "We speak fast. In dem becomes im:"),
        D("Ich bin im Park.", "Estoy en el parque.", "I'm in the park.", "f"),
        D("Und an dem wird am:", "Y an dem se vuelve am:", "And an dem becomes am:"),
        D("Ich warte am Bahnhof.", "Espero en la estación.", "I'm waiting at the station.", "m"),
        D("Genauso: bei dem wird beim. Ich bin beim Arzt.", "Igual: bei dem se vuelve beim. Estoy en el médico.", "The same: bei dem becomes beim. I'm at the doctor's."),
    ]),
    dialogue("Wo bist du?", LM, D("Hör zu: Lena und Mateo telefonieren.", "Escucha: Lena y Mateo hablan por teléfono.", "Listen: Lena and Mateo are on the phone."), [
        ("Mateo", "Hallo Lena! Wo bist du?", None, "¡Hola, Lena! ¿Dónde estás?", "Hi Lena! Where are you?"),
        ("Lena", "Ich bin in der Bäckerei.", None, "Estoy en la panadería.", "I'm at the bakery."),
        ("Mateo", "Ich warte im Park.", None, "Yo espero en el parque.", "I'm waiting in the park."),
        ("Lena", "Neben dem Kino?", None, "¿Al lado del cine?", "Next to the cinema?"),
        ("Mateo", "Ja, genau!", None, "¡Sí, exacto!", "Yes, exactly!"),
        ("Lena", "Ich komme in fünf Minuten.", None, "Llego en cinco minutos.", "I'll be there in five minutes."),
    ]),
    tryit("Ich bin im …\nIch bin in der …", D("Jetzt du! Wo bist du jetzt? Und wo bist du gern? Sag es mit im, am oder in der.", "¡Ahora tú! ¿Dónde estás ahora? ¿Y dónde te gusta estar? Dilo con im, am o in der.", "Now you! Where are you now? And where do you like to be? Say it with im, am or in der."), pause=8),
    recap(["Bahnhof · Bank · Post · Bäckerei", "Wo? → Dativ: dem · der · dem", "im Park · am Bahnhof · beim Arzt", "neben dem Kino"],
          D("Du kennst Orte in der Stadt und sagst mit dem Dativ, wo du bist.", "Conoces lugares de la ciudad y dices con el dativo dónde estás.", "You know places in town and say where you are with the dative.")),
])

# ───────────────────────── 8 · Wie komme ich …? ─────────────────────────
UNITS[8] = ("Wie komme ich …?", "Nach dem Weg fragen", [
    title(["🗺️", "🚦", "⬅️"],
          D("Hallo! Heute fragst du nach dem Weg.", "¡Hola! Hoy preguntas cómo llegar.", "Hi! Today you ask for directions."),
          D("Entschuldigung, wie komme ich zum Bahnhof?", "Disculpe, ¿cómo llego a la estación?", "Excuse me, how do I get to the station?")),
    words("Der Weg", "el camino", [
        ("geradeaus", "derecho", "⬆️", "Gehen Sie geradeaus.", "Siga derecho.", "Go straight ahead."),
        ("links", "a la izquierda", "⬅️", "Gehen Sie nach links.", "Vaya a la izquierda.", "Go left."),
        ("rechts", "a la derecha", "➡️", "Gehen Sie nach rechts.", "Vaya a la derecha.", "Go right."),
        ("die Ampel", "el semáforo", "🚦", "bis zur Ampel", "hasta el semáforo", "as far as the traffic lights"),
        ("die Kreuzung", "el cruce", "✖️", "an der Kreuzung", "en el cruce", "at the crossroads"),
        ("die Ecke", "la esquina", "📐", "an der Ecke", "en la esquina", "on the corner"),
    ], D("Diese Wörter brauchst du:", "Necesitas estas palabras:", "You need these words:")),
    table("Wohin? zu + Dativ", "¿a dónde?", [R("der", "", "zum", 1, " Bahnhof"), R("die", "", "zur", 2, " Post"), R("das", "", "zum", 3, " Kino")], [
        D("Wohin gehst du? Mit zu:", "¿A dónde vas? Con zu:", "Where are you going? With zu:"),
        D("zu dem wird zum: zum Bahnhof.", "zu dem se vuelve zum: a la estación.", "zu dem becomes zum: to the station."),
        D("zu der wird zur: zur Post.", "zu der se vuelve zur: al correo.", "zu der becomes zur: to the post office."),
        D("Und das? Auch zum: zum Kino.", "¿Y das? También zum: al cine.", "And das? Also zum: to the cinema."),
    ], size=60, side="zum = zu dem\nzur = zu der"),
    sentence("Den Weg erklären", "explicar el camino", "🚶", [
        {"de": "Gehen Sie geradeaus.", "es": "Siga derecho.", "mark": "geradeaus", "at": 1},
        {"de": "Biegen Sie links ab.", "es": "Gire a la izquierda.", "mark": "links ab", "at": 3},
    ], [
        D("Jemand erklärt den Weg – mit dem Imperativ:", "Alguien explica el camino, con el imperativo:", "Someone explains the way – with the imperative:"),
        D("Gehen Sie geradeaus.", "Siga derecho.", "Go straight ahead.", "m"),
        D("Und dann:", "Y luego:", "And then:"),
        D("Biegen Sie an der Ampel links ab.", "En el semáforo gire a la izquierda.", "Turn left at the traffic lights.", "m"),
    ]),
    dialogue("Zum Museum", {"Touristin": {"icon": "👩‍🦰", "voice": "f"}, "Mateo": MATEO},
             D("Hör zu: Eine Touristin fragt Mateo.", "Escucha: una turista le pregunta a Mateo.", "Listen: a tourist asks Mateo."), [
        ("Touristin", "Entschuldigung!", None, "¡Disculpe!", "Excuse me!"),
        ("Touristin", "Wie komme ich zum Museum?", None, "¿Cómo llego al museo?", "How do I get to the museum?"),
        ("Mateo", "Gehen Sie geradeaus.", None, "Siga derecho.", "Go straight ahead."),
        ("Mateo", "An der Ampel links.", "An der Ampel biegen Sie links ab.", "En el semáforo, a la izquierda.", "Left at the traffic lights."),
        ("Touristin", "Ist es weit?", None, "¿Es lejos?", "Is it far?"),
        ("Mateo", "Nein, nur fünf Minuten.", None, "No, solo cinco minutos.", "No, just five minutes."),
    ]),
    tryit("Wie komme ich\nzum … / zur …?", D("Jetzt du! Frag höflich nach dem Weg zur Post. Dann erkläre den Weg zu deinem Haus.", "¡Ahora tú! Pregunta con cortesía el camino al correo. Luego explica el camino a tu casa.", "Now you! Ask politely for the way to the post office. Then explain the way to your house."), pause=10),
    recap(["geradeaus · links · rechts", "zum Bahnhof · zur Post", "Gehen Sie geradeaus.", "Biegen Sie links ab."],
          D("Du fragst nach dem Weg und verstehst die Antwort. Du verlierst dich nicht mehr!", "Preguntas el camino y entiendes la respuesta. ¡Ya no te pierdes!", "You ask for directions and understand the answer. You won't get lost anymore!")),
])

# ───────────────────────── 9 · Unterwegs ─────────────────────────
UNITS[9] = ("Unterwegs", "Bus, Bahn und Fahrrad", [
    title(["🚌", "🚆", "🚲"],
          D("Hallo! Heute fahren wir mit Bus und Bahn.", "¡Hola! Hoy viajamos en bus y en tren.", "Hi! Today we travel by bus and train."),
          D("Wie fährst du zur Arbeit?", "¿Cómo vas al trabajo?", "How do you get to work?")),
    words("Verkehrsmittel", "medios de transporte", [
        ("der Bus", "el bus", "🚌", "der Bus", "el bus", "the bus"),
        ("die U-Bahn", "el metro", "🚇", "die U-Bahn", "el metro", "the underground"),
        ("der Zug", "el tren", "🚆", "der Zug", "el tren", "the train"),
        ("das Auto", "el carro", "🚗", "das Auto", "el carro", "the car"),
        ("das Fahrrad", "la bicicleta", "🚲", "das Fahrrad", "la bicicleta", "the bike"),
        ("zu Fuß", "a pie", "🚶", "zu Fuß gehen", "ir a pie", "to walk"),
    ], D("So kommst du von A nach B:", "Así llegas de A a B:", "This is how you get from A to B:")),
    table("mit + Dativ", "en (medio de transporte)", [R("der", "mit ", "dem", 1, " Bus"), R("die", "mit ", "der", 2, " U-Bahn"), R("das", "mit ", "dem", 3, " Fahrrad")], [
        D("Nach mit kommt immer der Dativ:", "Después de mit siempre viene el dativo:", "After mit always comes the dative:"),
        D("Ich fahre mit dem Bus.", "Voy en bus.", "I go by bus."),
        D("Ich fahre mit der U-Bahn.", "Voy en metro.", "I go by underground."),
        D("Ich fahre mit dem Fahrrad.", "Voy en bicicleta.", "I go by bike."),
    ], size=60, side="Achtung:\nzu Fuß gehen"),
    sentence("Am Schalter", "en la taquilla", "🎫", [
        {"de": "Eine Fahrkarte, bitte.", "es": "Un tiquete, por favor.", "mark": "Fahrkarte", "at": 1},
        {"de": "Nach Köln, hin und zurück.", "es": "A Colonia, ida y vuelta.", "mark": "hin und zurück", "at": 3},
    ], [
        D("Am Schalter oder am Automaten kaufst du eine Fahrkarte:", "En la taquilla o en la máquina compras un tiquete:", "At the counter or the machine you buy a ticket:"),
        D("Eine Fahrkarte, bitte.", "Un tiquete, por favor.", "A ticket, please.", "m"),
        D("Wohin? Einfach oder hin und zurück?", "¿A dónde? ¿Solo ida o ida y vuelta?", "Where to? Single or return?"),
        D("Nach Köln, hin und zurück.", "A Colonia, ida y vuelta.", "To Cologne, return.", "m"),
    ]),
    tip("Verspätung\n= tarde", "⏱️", size=70, *[
        D("Am Bahnhof hörst du Durchsagen. Ein sehr wichtiges Wort:", "En la estación oyes anuncios. Una palabra muy importante:", "At the station you hear announcements. A very important word:"),
        D("Der Zug hat zehn Minuten Verspätung.", "El tren tiene diez minutos de retraso.", "The train is ten minutes late."),
    ]),
    dialogue("Wie fährst du?", LM, D("Hör zu: Lena und Mateo sprechen über den Weg zur Arbeit.", "Escucha: Lena y Mateo hablan del camino al trabajo.", "Listen: Lena and Mateo talk about getting to work."), [
        ("Lena", "Wie fährst du zur Arbeit?", None, "¿Cómo vas al trabajo?", "How do you get to work?"),
        ("Mateo", "Mit dem Fahrrad.", "Ich fahre mit dem Fahrrad.", "En bicicleta.", "By bike."),
        ("Lena", "Auch im Winter?", None, "¿También en invierno?", "In winter too?"),
        ("Mateo", "Nein, dann mit der U-Bahn.", "Nein, im Winter fahre ich mit der U-Bahn.", "No, entonces en metro.", "No, then by underground."),
        ("Mateo", "Und du?", None, "¿Y tú?", "And you?"),
        ("Lena", "Ich gehe zu Fuß.", None, "Yo voy a pie.", "I walk."),
    ]),
    tryit("Ich fahre mit\ndem … / der …", D("Jetzt du! Wie fährst du zur Arbeit, zur Uni oder zum Kurs?", "¡Ahora tú! ¿Cómo vas al trabajo, a la universidad o al curso?", "Now you! How do you get to work, uni or class?")),
    recap(["Bus · U-Bahn · Zug · Fahrrad", "mit dem Bus · mit der U-Bahn", "Eine Fahrkarte, bitte.", "hin und zurück · Verspätung"],
          D("Du fährst mit Bus und Bahn, kaufst Fahrkarten und verstehst Durchsagen.", "Viajas en bus y tren, compras tiquetes y entiendes los anuncios.", "You travel by bus and train, buy tickets and understand announcements.")),
])

# ───────────────────────── 10 · Trennbare Verben ─────────────────────────
UNITS[10] = ("Trennbare Verben", "Mein Alltag", [
    title(["⏰", "🛒", "📺"],
          D("Hallo! Heute lernst du trennbare Verben.", "¡Hola! Hoy aprendes los verbos separables.", "Hi! Today you learn separable verbs."),
          D("Diese Verben teilen sich in zwei Teile!", "¡Estos verbos se dividen en dos partes!", "These verbs split into two parts!")),
    timeline("Mein Tag", "mi día", [
        ("aufstehen", "levantarse", "⏰", "Ich stehe um sieben auf.", "Me levanto a las siete.", "I get up at seven."),
        ("anfangen", "empezar", "💼", "Die Arbeit fängt um neun an.", "El trabajo empieza a las nueve.", "Work starts at nine."),
        ("einkaufen", "hacer mercado", "🛒", "Am Nachmittag kaufe ich ein.", "En la tarde hago mercado.", "In the afternoon I go shopping."),
        ("anrufen", "llamar", "📞", "Dann rufe ich meine Mutter an.", "Luego llamo a mi mamá.", "Then I call my mother."),
        ("fernsehen", "ver televisión", "📺", "Am Abend sehe ich fern.", "En la noche veo televisión.", "In the evening I watch TV."),
    ], D("So ist mein Tag:", "Así es mi día:", "This is my day:")),
    table("auf|stehen", "levantarse", [R("ich", "stehe ", "", 1, "… auf"), R("Ich", "stehe um 7 ", "auf", 2, "."), R("Wann", "stehst du ", "auf", 3, "?")], [
        D("Der erste Teil springt ans Ende des Satzes:", "La primera parte salta al final de la frase:", "The first part jumps to the end of the sentence:"),
        D("aufstehen: ich stehe … auf.", "aufstehen: yo me levanto.", "aufstehen: I get up."),
        D("Ich stehe um sieben Uhr auf.", "Me levanto a las siete.", "I get up at seven."),
        D("Wann stehst du auf?", "¿A qué hora te levantas?", "When do you get up?"),
    ], size=60, side="auf → Ende!"),
    tip("ein|kaufen\nan|rufen\nfern|sehen", "✂️", size=72, *[
        D("Wie erkennst du ein trennbares Verb? Die Betonung ist vorne:", "¿Cómo reconoces un verbo separable? El acento va adelante:", "How do you recognise a separable verb? The stress is at the front:"),
        D("EINkaufen, ANrufen, FERNsehen.", "EINkaufen, ANrufen, FERNsehen.", "EINkaufen, ANrufen, FERNsehen."),
    ]),
    dialogue("Am Sonntag", LM, D("Hör zu: Was machen Lena und Mateo am Sonntag?", "Escucha: ¿qué hacen Lena y Mateo el domingo?", "Listen: what do Lena and Mateo do on Sunday?"), [
        ("Lena", "Sonntag: Wann stehst du auf?", "Wann stehst du am Sonntag auf?", "¿A qué hora te levantas el domingo?", "When do you get up on Sunday?"),
        ("Mateo", "Erst um zehn!", "Ich stehe erst um zehn auf!", "¡Hasta las diez!", "Not until ten!"),
        ("Lena", "Und dann?", None, "¿Y luego?", "And then?"),
        ("Mateo", "Ich rufe meine Familie an.", None, "Llamo a mi familia.", "I call my family."),
        ("Lena", "Kaufst du auch ein?", None, "¿También haces mercado?", "Do you go shopping too?"),
        ("Mateo", "Nein, alles ist zu!", "Nein, am Sonntag ist alles zu!", "¡No, el domingo todo está cerrado!", "No, everything's closed on Sunday!"),
    ]),
    tryit("Ich stehe um … auf.\nAm Abend sehe ich …", D("Jetzt du! Erzähl deinen Tag mit aufstehen, einkaufen, anrufen und fernsehen.", "¡Ahora tú! Cuenta tu día con aufstehen, einkaufen, anrufen y fernsehen.", "Now you! Describe your day with aufstehen, einkaufen, anrufen and fernsehen."), pause=10),
    recap(["aufstehen · anfangen · einkaufen", "anrufen · fernsehen", "Ich stehe um 7 Uhr auf.", "Der erste Teil steht am Ende."],
          D("Du kennst trennbare Verben: Der erste Teil springt ans Ende.", "Conoces los verbos separables: la primera parte salta al final.", "You know separable verbs: the first part jumps to the end.")),
])

# ───────────────────────── 11 · Mein, dein, sein ─────────────────────────
UNITS[11] = ("Mein, dein, sein", "Die Possessivartikel", [
    title(["🎒", "🔑", "🐶"],
          D("Hallo! Heute lernst du: mein, dein, sein, ihr.", "¡Hola! Hoy aprendes: mein, dein, sein, ihr.", "Hi! Today you learn: mein, dein, sein, ihr."),
          D("Wem gehört das?", "¿De quién es esto?", "Whose is this?")),
    table("Possessivartikel", "los posesivos", [R("ich", "", "mein", 1, " Hund"), R("du", "", "dein", 2, " Hund"), R("er", "", "sein", 3, " Hund"), R("sie", "", "ihr", 4, " Hund"), R("wir", "", "unser", 5, " Hund")], [
        D("Jede Person hat ein Wort. Hör zu:", "Cada persona tiene una palabra. Escucha:", "Each person has a word. Listen:"),
        D("ich: mein Hund", "yo: mi perro", "I: my dog"),
        D("du: dein Hund", "tú: tu perro", "you: your dog"),
        D("er: sein Hund", "él: su perro (de él)", "he: his dog"),
        D("sie: ihr Hund", "ella: su perro (de ella)", "she: her dog"),
        D("wir: unser Hund", "nosotros: nuestro perro", "we: our dog"),
    ], size=60),
    compare("sein oder ihr?", {"title": "sein", "icon": "👨", "gloss": "de él", "example": "Tom und sein Hund", "at": 1},
            {"title": "ihr", "icon": "👩", "gloss": "de ella", "example": "Anna und ihr Hund", "at": 3}, [
        D("Achtung! Das ist der Hund von Tom:", "¡Ojo! Este es el perro de Tom:", "Careful! This is Tom's dog:"),
        D("Das ist sein Hund.", "Es su perro (de él).", "That's his dog.", "m"),
        D("Und das ist der Hund von Anna:", "Y este es el perro de Anna:", "And this is Anna's dog:"),
        D("Das ist ihr Hund.", "Es su perro (de ella).", "That's her dog.", "f"),
        D("Im Spanischen sagst du für beide su. Im Deutschen nicht!", "En español dices su para los dos. ¡En alemán no!", "In Spanish you say su for both. Not in German!"),
    ]),
    table("Mit -e", "con -e (die / Plural)", [R("der", "", "mein", 1, " Bruder"), R("die", "mein", "e", 2, " Schwester"), R("das", "", "mein", 3, " Auto"), R("Plural", "mein", "e", 4, " Eltern")], [
        D("Wie bei ein und eine: Bei die und im Plural kommt ein e dazu:", "Como con ein y eine: con die y en plural se agrega una e:", "Like ein and eine: with die and the plural you add an e:"),
        D("mein Bruder", "mi hermano", "my brother"),
        D("meine Schwester", "mi hermana", "my sister"),
        D("mein Auto", "mi carro", "my car"),
        D("meine Eltern", "mis papás", "my parents"),
    ], size=60, side="die → meine"),
    dialogue("Wem gehört das?", LM, D("Hör zu: Lena räumt auf.", "Escucha: Lena está ordenando.", "Listen: Lena is tidying up."), [
        ("Lena", "Ist das dein Schlüssel?", None, "¿Es tu llave?", "Is this your key?"),
        ("Mateo", "Ja! Das ist mein Schlüssel.", "Ja, danke! Das ist mein Schlüssel.", "¡Sí, gracias! Es mía.", "Yes, thanks! It's mine."),
        ("Lena", "Und die Jacke?", None, "¿Y la chaqueta?", "And the jacket?"),
        ("Mateo", "Das ist Annas Jacke.", None, "Es la chaqueta de Anna.", "That's Anna's jacket."),
        ("Lena", "Ah, ihre Jacke!", None, "¡Ah, su chaqueta!", "Ah, her jacket!"),
        ("Mateo", "Genau.", None, "Exacto.", "Exactly."),
    ]),
    tryit("Das ist mein …\nDas ist meine …", D("Jetzt du! Zeig drei Dinge und sag: Das ist mein … oder Das ist meine …", "¡Ahora tú! Muestra tres cosas y di: Das ist mein… o Das ist meine…", "Now you! Show three things and say: Das ist mein… or Das ist meine…")),
    recap(["mein · dein · sein · ihr · unser", "sein Hund (Tom) · ihr Hund (Anna)", "meine Schwester · meine Eltern", "Wem gehört das?"],
          D("Du sagst, wem etwas gehört – mit mein, dein, sein und ihr.", "Dices de quién es algo, con mein, dein, sein e ihr.", "You say who something belongs to – with mein, dein, sein and ihr.")),
])

# ───────────────────────── 12 · Arbeit und Alltag ─────────────────────────
UNITS[12] = ("Im Büro", "Arbeit und Alltag", [
    title(["💼", "🖨️", "☕"],
          D("Hallo! Heute sind wir im Büro.", "¡Hola! Hoy estamos en la oficina.", "Hi! Today we're at the office."),
          D("Du bittest um Hilfe und lernst neue Pronomen.", "Pides ayuda y aprendes pronombres nuevos.", "You ask for help and learn new pronouns.")),
    words("Im Büro", "en la oficina", [
        ("der Computer", "el computador", "💻", "der Computer", "el computador", "the computer"),
        ("der Drucker", "la impresora", "🖨️", "der Drucker", "la impresora", "the printer"),
        ("die Besprechung", "la reunión", "👥", "die Besprechung", "la reunión", "the meeting"),
        ("der Kollege", "el compañero", "🧑‍💼", "der Kollege, die Kollegin", "el compañero, la compañera", "the colleague"),
        ("die Pause", "la pausa", "☕", "die Pause", "la pausa", "the break"),
        ("die E-Mail", "el correo", "📧", "die E-Mail", "el correo electrónico", "the email"),
    ], D("Das gibt es im Büro:", "Esto hay en la oficina:", "This is what you find at the office:")),
    table("Akkusativ", "a mí, a ti…", [R("ich", "", "mich", 1), R("du", "", "dich", 2), R("er", "", "ihn", 3), R("sie", "", "sie", 4), R("Sie", "", "Sie", 5)], [
        D("Nach vielen Verben brauchst du den Akkusativ. Zum Beispiel: Ruf mich an!", "Después de muchos verbos necesitas el acusativo. Por ejemplo: ¡llámame!", "Many verbs need the accusative. For example: call me!"),
        D("ich wird mich", "ich se vuelve mich (me)", "ich becomes mich (me)"),
        D("du wird dich", "du se vuelve dich (te)", "du becomes dich (you)"),
        D("er wird ihn", "er se vuelve ihn (lo)", "er becomes ihn (him)"),
        D("sie bleibt sie", "sie se queda sie (la)", "sie stays sie (her)"),
        D("und Sie bleibt Sie.", "y Sie se queda Sie (lo, la, usted).", "and Sie stays Sie."),
    ], size=60, side="Ich rufe dich an.\nIch sehe ihn."),
    sentence("Hilfe!", "¡ayuda!", "🆘", [
        {"de": "Kannst du mir helfen?", "es": "¿Me puedes ayudar?", "mark": "mir", "at": 1},
        {"de": "Kann ich Ihnen helfen?", "es": "¿Le puedo ayudar?", "mark": "Ihnen", "at": 3},
    ], [
        D("Bei helfen sagst du mir und dir:", "Con helfen dices mir y dir:", "With helfen you say mir and dir:"),
        D("Kannst du mir helfen?", "¿Me puedes ayudar?", "Can you help me?", "m"),
        D("Und höflich, mit Sie:", "Y con cortesía, con Sie:", "And politely, with Sie:"),
        D("Kann ich Ihnen helfen?", "¿Le puedo ayudar?", "Can I help you?", "f"),
    ]),
    dialogue("Der Drucker", LM, D("Hör zu: Mateo hat ein Problem.", "Escucha: Mateo tiene un problema.", "Listen: Mateo has a problem."), [
        ("Mateo", "Kannst du mir helfen?", None, "¿Me puedes ayudar?", "Can you help me?"),
        ("Lena", "Klar! Was ist los?", None, "¡Claro! ¿Qué pasa?", "Sure! What's up?"),
        ("Mateo", "Der Drucker geht nicht.", None, "La impresora no funciona.", "The printer isn't working."),
        ("Lena", "Warte, ich helfe dir.", None, "Espera, te ayudo.", "Wait, I'll help you."),
        ("Lena", "So, er geht wieder!", None, "Listo, ¡ya funciona!", "There, it works again!"),
        ("Mateo", "Danke! Ich lade dich ein.", "Danke! Ich lade dich zum Kaffee ein.", "¡Gracias! Te invito a un café.", "Thanks! I'll buy you a coffee."),
    ]),
    tryit("Kannst du mir …?\nIch rufe dich an.", D("Jetzt du! Bitte eine Kollegin um Hilfe: Kannst du mir helfen? Mein Computer geht nicht.", "¡Ahora tú! Pídele ayuda a una compañera: ¿Me puedes ayudar? Mi computador no funciona.", "Now you! Ask a colleague for help: Can you help me? My computer isn't working."), pause=8),
    recap(["Computer · Drucker · Besprechung", "mich · dich · ihn · sie · Sie", "Kannst du mir helfen?", "Kann ich Ihnen helfen?"],
          D("Du sprichst im Büro, bittest um Hilfe und kennst die Pronomen.", "Hablas en la oficina, pides ayuda y conoces los pronombres.", "You talk at the office, ask for help and know the pronouns.")),
])

# ───────────────────────── 13 · Feste feiern ─────────────────────────
UNITS[13] = ("Feste feiern", "Datum und Einladung", [
    title(["🎉", "🎂", "🎄"],
          D("Hallo! Heute feiern wir!", "¡Hola! ¡Hoy celebramos!", "Hi! Today we celebrate!"),
          D("Du lernst das Datum und schreibst eine Einladung.", "Aprendes la fecha y escribes una invitación.", "You learn dates and write an invitation.")),
    words("Feste", "fiestas", [
        ("der Geburtstag", "el cumpleaños", "🎂", "Alles Gute zum Geburtstag!", "¡Feliz cumpleaños!", "Happy birthday!"),
        ("Weihnachten", "Navidad", "🎄", "Frohe Weihnachten!", "¡Feliz Navidad!", "Merry Christmas!"),
        ("Silvester", "fin de año", "🎆", "Frohes neues Jahr!", "¡Feliz año nuevo!", "Happy New Year!"),
        ("Ostern", "Pascua", "🐣", "Frohe Ostern!", "¡Felices Pascuas!", "Happy Easter!"),
        ("die Hochzeit", "la boda", "💍", "Herzlichen Glückwunsch!", "¡Felicitaciones!", "Congratulations!"),
    ], D("Diese Feste gibt es in Deutschland. Und das sagst du:", "Estas fiestas hay en Alemania. Y esto dices:", "These are celebrations in Germany. And this is what you say:")),
    table("Das Datum", "la fecha", [R("1.", "", "der erste", 1), R("3.", "", "der dritte", 2), R("4.", "der vier", "te", 3), R("20.", "der zwanzig", "ste", 4)], [
        D("Für das Datum brauchst du Ordinalzahlen. Zwei sind besonders:", "Para la fecha necesitas números ordinales. Dos son especiales:", "For dates you need ordinal numbers. Two are special:"),
        D("der erste", "el primero", "the first"),
        D("der dritte", "el tercero", "the third"),
        D("Sonst bis neunzehn: plus te. Der vierte.", "Si no, hasta diecinueve: más te. Der vierte (el cuarto).", "Otherwise up to nineteen: add te. Der vierte."),
        D("Ab zwanzig: plus ste. Der zwanzigste.", "Desde veinte: más ste. Der zwanzigste (el vigésimo).", "From twenty: add ste. Der zwanzigste."),
    ], size=60, side="bis 19: -te\nab 20: -ste"),
    sentence("Wann?", "¿cuándo?", "📅", [
        {"de": "Am dritten Mai.", "es": "El tres de mayo.", "mark": "dritten", "at": 1},
        {"de": "Heute ist der 3. Mai.", "es": "Hoy es 3 de mayo.", "mark": "der 3.", "at": 3},
    ], [
        D("Wann ist die Party? Nach am kommt die Endung en:", "¿Cuándo es la fiesta? Después de am viene la terminación en:", "When is the party? After am comes the ending en:"),
        D("Am dritten Mai.", "El tres de mayo.", "On the third of May.", "f"),
        D("Aber ohne am:", "Pero sin am:", "But without am:"),
        D("Heute ist der dritte Mai.", "Hoy es tres de mayo.", "Today is the third of May.", "m"),
    ]),
    dialogue("Eine Einladung", LM, D("Hör zu: Lena macht eine Party.", "Escucha: Lena hace una fiesta.", "Listen: Lena is having a party."), [
        ("Lena", "Ich habe bald Geburtstag!", None, "¡Pronto es mi cumpleaños!", "It's my birthday soon!"),
        ("Mateo", "Wann denn?", None, "¿Y cuándo?", "When?"),
        ("Lena", "Am zwölften Mai.", None, "El doce de mayo.", "On the twelfth of May."),
        ("Lena", "Kommst du zu meiner Party?", None, "¿Vienes a mi fiesta?", "Will you come to my party?"),
        ("Mateo", "Gern! Was bringe ich mit?", "Gern! Was soll ich mitbringen?", "¡Con gusto! ¿Qué llevo?", "Gladly! What should I bring?"),
        ("Lena", "Vielleicht einen Salat.", None, "Tal vez una ensalada.", "Maybe a salad."),
    ]),
    tryit("Ich habe am …\nGeburtstag.", D("Jetzt du! Wann hast du Geburtstag? Sag das Datum: Ich habe am … Geburtstag.", "¡Ahora tú! ¿Cuándo cumples años? Di la fecha: Ich habe am… Geburtstag.", "Now you! When is your birthday? Say the date: Ich habe am… Geburtstag.")),
    recap(["Geburtstag · Weihnachten · Ostern", "der erste · der dritte · der vierte", "am dritten Mai", "Kommst du zu meiner Party?"],
          D("Du sagst das Datum, gratulierst und lädst Freunde ein. Feiern wir!", "Dices la fecha, felicitas e invitas a tus amigos. ¡A celebrar!", "You say dates, congratulate and invite friends. Let's celebrate!")),
])

# ───────────────────────── 14 · Was hast du gemacht? ─────────────────────────
UNITS[14] = ("Das Perfekt", "Was hast du gemacht?", [
    title(["⏪", "📸", "🍕"],
          D("Hallo! Heute sprechen wir über gestern.", "¡Hola! Hoy hablamos de ayer.", "Hi! Today we talk about yesterday."),
          D("Du lernst das Perfekt: Was hast du gemacht?", "Aprendes el Perfekt: ¿qué hiciste?", "You learn the perfect tense: what did you do?")),
    sentence("Das Perfekt", "el pasado", "⏪", [
        {"de": "Ich habe Pizza gegessen.", "es": "Comí pizza.", "mark": "habe", "at": 1},
        {"de": "Wir haben Musik gehört.", "es": "Escuchamos música.", "mark": "gehört", "at": 3},
    ], [
        D("Im Deutschen sprechen wir über die Vergangenheit mit haben und einem Partizip:", "En alemán hablamos del pasado con haben y un participio:", "In German we talk about the past with haben and a participle:"),
        D("Ich habe Pizza gegessen.", "Comí pizza.", "I ate pizza.", "m"),
        D("Haben steht auf Position zwei, das Partizip am Ende:", "Haben va en la posición dos y el participio al final:", "Haben is in position two, the participle at the end:"),
        D("Wir haben Musik gehört.", "Escuchamos música.", "We listened to music.", "f"),
    ], notes=[{"text": "Ende!", "at": 3}], notesX=1010),
    table("ge- … -t", "participio regular", [R("machen", "ge", "mach", 1, "t"), R("kaufen", "ge", "kauf", 2, "t"), R("spielen", "ge", "spiel", 3, "t"), R("arbeiten", "ge", "arbeit", 4, "et")], [
        D("Regelmäßige Verben: ge plus Stamm plus t:", "Verbos regulares: ge más raíz más t:", "Regular verbs: ge plus stem plus t:"),
        D("machen, gemacht", "hacer, hecho", "make, made"),
        D("kaufen, gekauft", "comprar, comprado", "buy, bought"),
        D("spielen, gespielt", "jugar, jugado", "play, played"),
        D("arbeiten, gearbeitet", "trabajar, trabajado", "work, worked"),
    ], size=60),
    table("ge- … -en", "participio irregular", [R("essen", "ge", "gess", 1, "en"), R("trinken", "ge", "trunk", 2, "en"), R("sehen", "ge", "seh", 3, "en"), R("lesen", "ge", "les", 4, "en")], [
        D("Viele wichtige Verben enden auf en. Lern sie wie Vokabeln:", "Muchos verbos importantes terminan en en. Apréndelos como vocabulario:", "Many important verbs end in en. Learn them like vocabulary:"),
        D("essen, gegessen", "comer, comido", "eat, eaten"),
        D("trinken, getrunken", "beber, bebido", "drink, drunk"),
        D("sehen, gesehen", "ver, visto", "see, seen"),
        D("lesen, gelesen", "leer, leído", "read, read"),
    ], size=60, side="Lern sie\nauswendig!"),
    dialogue("Am Montag", LM, D("Hör zu: Es ist Montag. Lena fragt Mateo.", "Escucha: es lunes. Lena le pregunta a Mateo.", "Listen: it's Monday. Lena asks Mateo."), [
        ("Lena", "Was hast du gemacht?", "Was hast du am Wochenende gemacht?", "¿Qué hiciste?", "What did you do?"),
        ("Mateo", "Ich habe Fußball gespielt.", None, "Jugué fútbol.", "I played football."),
        ("Mateo", "Und ich habe gekocht.", None, "Y cociné.", "And I cooked."),
        ("Lena", "Was hast du gekocht?", None, "¿Qué cocinaste?", "What did you cook?"),
        ("Mateo", "Eine Suppe. Und du?", None, "Una sopa. ¿Y tú?", "A soup. And you?"),
        ("Lena", "Ich habe viel gelesen.", None, "Leí mucho.", "I read a lot."),
    ]),
    tryit("Gestern habe ich …", D("Jetzt du! Was hast du gestern gemacht? Sag drei Sätze mit habe.", "¡Ahora tú! ¿Qué hiciste ayer? Di tres frases con habe.", "Now you! What did you do yesterday? Say three sentences with habe."), pause=10),
    recap(["Ich habe Pizza gegessen.", "haben (2) … Partizip (Ende)", "gemacht · gekauft · gespielt", "gegessen · getrunken · gesehen"],
          D("Du erzählst, was du gemacht hast – mit haben und dem Partizip.", "Cuentas lo que hiciste, con haben y el participio.", "You say what you did – with haben and the participle.")),
])

# ───────────────────────── 15 · Am Wochenende ─────────────────────────
UNITS[15] = ("Am Wochenende", "Das Perfekt mit sein", [
    title(["🚆", "🏃", "🏖️"],
          D("Hallo! Wo warst du am Wochenende?", "¡Hola! ¿Dónde estuviste el fin de semana?", "Hi! Where were you at the weekend?"),
          D("Heute lernst du das Perfekt mit sein.", "Hoy aprendes el Perfekt con sein.", "Today you learn the perfect tense with sein.")),
    compare("haben oder sein?", {"title": "haben", "icon": "🍕", "gloss": "la mayoría", "example": "Ich habe gegessen.", "at": 1},
            {"title": "sein", "icon": "🚶", "gloss": "movimiento", "example": "Ich bin gegangen.", "at": 3}, [
        D("Die meisten Verben bilden das Perfekt mit haben:", "La mayoría de los verbos forman el Perfekt con haben:", "Most verbs form the perfect tense with haben:"),
        D("Ich habe gegessen.", "Comí.", "I ate.", "f"),
        D("Aber Verben der Bewegung nehmen sein:", "Pero los verbos de movimiento usan sein:", "But verbs of movement take sein:"),
        D("Ich bin gegangen.", "Fui.", "I went.", "m"),
        D("Von A nach B? Dann sein!", "¿De A a B? ¡Entonces sein!", "From A to B? Then sein!"),
    ]),
    table("Perfekt mit sein", "con sein", [R("gehen", "ich bin ", "gegangen", 1), R("fahren", "ich bin ", "gefahren", 2), R("fliegen", "ich bin ", "geflogen", 3), R("kommen", "ich bin ", "gekommen", 4), R("bleiben", "ich bin ", "geblieben", 5)], [
        D("Diese Verben nehmen sein:", "Estos verbos usan sein:", "These verbs take sein:"),
        D("gehen: ich bin gegangen", "ir: fui", "go: I went"),
        D("fahren: ich bin gefahren", "ir en vehículo: fui", "drive: I drove"),
        D("fliegen: ich bin geflogen", "volar: volé", "fly: I flew"),
        D("kommen: ich bin gekommen", "venir: vine", "come: I came"),
        D("Und eine Ausnahme: bleiben, ich bin geblieben.", "Y una excepción: quedarse, me quedé.", "And an exception: stay, I stayed."),
    ], size=56),
    table("war · hatte", "estaba · tenía", [R("ich", "", "war", 1, " im Kino"), R("du", "", "warst", 2, " zu Hause"), R("ich", "", "hatte", 3, " Zeit"), R("du", "", "hattest", 4, " Glück")], [
        D("Bei sein und haben sagen wir lieber war und hatte:", "Con sein y haben preferimos decir war y hatte:", "With sein and haben we prefer war and hatte:"),
        D("Ich war im Kino.", "Estuve en el cine.", "I was at the cinema."),
        D("Wo warst du?", "¿Dónde estabas?", "Where were you?"),
        D("Ich hatte keine Zeit.", "No tenía tiempo.", "I had no time."),
        D("Du hattest Glück!", "¡Tuviste suerte!", "You were lucky!"),
    ], size=60),
    dialogue("Wo warst du?", LM, D("Hör zu: Mateo war weg.", "Escucha: Mateo estuvo de viaje.", "Listen: Mateo was away."), [
        ("Lena", "Wo warst du am Wochenende?", None, "¿Dónde estuviste el fin de semana?", "Where were you at the weekend?"),
        ("Mateo", "Ich war in Hamburg.", None, "Estuve en Hamburgo.", "I was in Hamburg."),
        ("Lena", "Bist du geflogen?", None, "¿Fuiste en avión?", "Did you fly?"),
        ("Mateo", "Nein, ich bin Zug gefahren.", "Nein, ich bin mit dem Zug gefahren.", "No, fui en tren.", "No, I went by train."),
        ("Lena", "Und wie war es?", None, "¿Y qué tal?", "And how was it?"),
        ("Mateo", "Super! Ich hatte viel Spaß.", None, "¡Súper! Me divertí mucho.", "Great! I had lots of fun."),
    ]),
    tryit("Ich bin … gefahren.\nIch war …", D("Jetzt du! Wo warst du letztes Wochenende? Wohin bist du gegangen oder gefahren?", "¡Ahora tú! ¿Dónde estuviste el fin de semana pasado? ¿A dónde fuiste?", "Now you! Where were you last weekend? Where did you go?"), pause=10),
    recap(["Bewegung → sein", "bin gegangen · gefahren · geflogen", "ich bin geblieben", "ich war · ich hatte"],
          D("Du weißt: Bewegung von A nach B nimmt sein. Und war und hatte für sein und haben.", "Sabes que el movimiento de A a B usa sein. Y war y hatte para sein y haben.", "You know: movement from A to B takes sein. And war and hatte for sein and haben.")),
])

# ───────────────────────── 16 · Urlaub ─────────────────────────
UNITS[16] = ("Urlaub", "Reisen und erzählen", [
    title(["🏖️", "⛰️", "🧳"],
          D("Hallo! Heute sprechen wir über den Urlaub.", "¡Hola! Hoy hablamos de las vacaciones.", "Hi! Today we talk about holidays."),
          D("Wohin fährst du gern?", "¿A dónde te gusta ir?", "Where do you like to go?")),
    words("Wohin?", "¿a dónde?", [
        ("ans Meer", "al mar", "🏖️", "Ich fahre ans Meer.", "Voy al mar.", "I'm going to the seaside."),
        ("in die Berge", "a la montaña", "⛰️", "Ich fahre in die Berge.", "Voy a la montaña.", "I'm going to the mountains."),
        ("an einen See", "a un lago", "🏞️", "Ich fahre an einen See.", "Voy a un lago.", "I'm going to a lake."),
        ("nach Spanien", "a España", "✈️", "Ich fliege nach Spanien.", "Vuelo a España.", "I'm flying to Spain."),
        ("in die Stadt", "a la ciudad", "🏙️", "Ich fahre in die Stadt.", "Voy a la ciudad.", "I'm going to the city."),
        ("aufs Land", "al campo", "🌾", "Ich fahre aufs Land.", "Voy al campo.", "I'm going to the countryside."),
    ], D("Wohin fährst du im Urlaub?", "¿A dónde vas de vacaciones?", "Where do you go on holiday?")),
    tip("nach Spanien\nin die Türkei", "🌍", size=64, *[
        D("Für Länder und Städte sagst du nach: nach Spanien, nach Berlin.", "Para países y ciudades dices nach: a España, a Berlín.", "For countries and cities you say nach: to Spain, to Berlin."),
        D("Aber Länder mit Artikel: in die Türkei, in die Schweiz.", "Pero los países con artículo: a Turquía, a Suiza.", "But countries with an article: to Turkey, to Switzerland."),
    ]),
    words("Das Wetter", "el clima", [
        ("Die Sonne scheint.", "hace sol", "☀️", "Die Sonne scheint.", "Hace sol.", "The sun is shining."),
        ("Es regnet.", "llueve", "🌧️", "Es regnet.", "Llueve.", "It's raining."),
        ("Es ist heiß.", "hace calor", "🥵", "Es ist heiß.", "Hace calor.", "It's hot."),
        ("Es ist kalt.", "hace frío", "🥶", "Es ist kalt.", "Hace frío.", "It's cold."),
    ], D("Und wie ist das Wetter im Urlaub?", "¿Y cómo está el clima en las vacaciones?", "And what's the weather like on holiday?")),
    sentence("Eine Postkarte", "una postal", "💌", [
        {"de": "Viele Grüße aus Rom!", "es": "¡Saludos desde Roma!", "mark": "Grüße aus", "at": 1},
        {"de": "Das Wetter ist super.", "es": "El clima está súper.", "mark": "Wetter", "at": 3},
    ], [
        D("Aus dem Urlaub schreibst du eine Postkarte:", "Desde las vacaciones escribes una postal:", "On holiday you write a postcard:"),
        D("Viele Grüße aus Rom!", "¡Saludos desde Roma!", "Greetings from Rome!", "f"),
        D("Dann erzählst du:", "Luego cuentas:", "Then you tell:"),
        D("Das Wetter ist super. Gestern bin ich ans Meer gefahren.", "El clima está súper. Ayer fui al mar.", "The weather's great. Yesterday I went to the sea.", "f"),
    ]),
    dialogue("Urlaubspläne", LM, D("Hör zu: Lena und Mateo planen den Sommer.", "Escucha: Lena y Mateo planean el verano.", "Listen: Lena and Mateo plan the summer."), [
        ("Mateo", "Wohin fährst du im Sommer?", None, "¿A dónde vas en verano?", "Where are you going in summer?"),
        ("Lena", "Ich fahre ans Meer.", None, "Voy al mar.", "I'm going to the seaside."),
        ("Lena", "Ich schwimme so gern!", None, "¡Me encanta nadar!", "I love swimming!"),
        ("Mateo", "Ich fahre in die Berge.", None, "Yo voy a la montaña.", "I'm going to the mountains."),
        ("Lena", "Wanderst du gern?", None, "¿Te gusta caminar?", "Do you like hiking?"),
        ("Mateo", "Ja, sehr!", None, "¡Sí, mucho!", "Yes, a lot!"),
    ]),
    tryit("Ich fahre ans …\nIch fliege nach …", D("Jetzt du! Wohin fährst du gern im Urlaub? Und wie ist das Wetter dort?", "¡Ahora tú! ¿A dónde te gusta ir de vacaciones? ¿Y cómo es el clima allí?", "Now you! Where do you like to go on holiday? And what's the weather like there?")),
    recap(["ans Meer · in die Berge · aufs Land", "nach Spanien · in die Türkei", "Die Sonne scheint. Es regnet.", "Viele Grüße aus …!"],
          D("Du sprichst über Urlaub, Reiseziele und das Wetter. Gute Reise!", "Hablas de vacaciones, destinos y el clima. ¡Buen viaje!", "You talk about holidays, destinations and the weather. Have a good trip!")),
])

# ───────────────────────── 17 · Im Hotel ─────────────────────────
UNITS[17] = ("Im Hotel", "Ein Zimmer reservieren", [
    title(["🏨", "🛏️", "🔑"],
          D("Hallo! Heute sind wir im Hotel.", "¡Hola! Hoy estamos en el hotel.", "Hi! Today we're at a hotel."),
          D("Du reservierst ein Zimmer und fragst höflich.", "Reservas una habitación y preguntas con cortesía.", "You book a room and ask politely.")),
    words("Im Hotel", "en el hotel", [
        ("das Einzelzimmer", "habitación sencilla", "🛏️", "ein Einzelzimmer: für eine Person", "una habitación sencilla: para una persona", "a single room: for one person"),
        ("das Doppelzimmer", "habitación doble", "🛌", "ein Doppelzimmer: für zwei Personen", "una habitación doble: para dos personas", "a double room: for two people"),
        ("die Rezeption", "la recepción", "🛎️", "die Rezeption", "la recepción", "the reception"),
        ("der Schlüssel", "la llave", "🔑", "der Schlüssel", "la llave", "the key"),
        ("das Frühstück", "el desayuno", "🥐", "mit Frühstück", "con desayuno", "with breakfast"),
        ("das WLAN", "el wifi", "📶", "Das WLAN funktioniert nicht.", "El wifi no funciona.", "The Wi-Fi isn't working."),
    ], D("Diese Wörter brauchst du im Hotel:", "Estas palabras las necesitas en el hotel:", "You need these words at a hotel:")),
    sentence("Reservieren", "reservar", "📞", [
        {"de": "Ich möchte ein Zimmer.", "es": "Quisiera una habitación.", "mark": "möchte", "at": 1},
        {"de": "Vom 3. bis zum 5. Mai.", "es": "Del 3 al 5 de mayo.", "mark": "bis zum", "at": 3},
    ], [
        D("So reservierst du:", "Así reservas:", "This is how you book:"),
        D("Ich möchte ein Doppelzimmer reservieren.", "Quisiera reservar una habitación doble.", "I'd like to book a double room.", "m"),
        D("Wann? Mit vom … bis zum:", "¿Cuándo? Con vom… bis zum (del… al):", "When? With vom… bis zum:"),
        D("Vom dritten bis zum fünften Mai.", "Del tres al cinco de mayo.", "From the third to the fifth of May.", "m"),
    ]),
    compare("Höflich fragen", {"title": "können", "icon": "🙂", "gloss": "¿puede…?", "example": "Können Sie helfen?", "at": 1},
            {"title": "könnten", "icon": "😊", "gloss": "¿podría…?", "example": "Könnten Sie helfen?", "at": 3}, [
        D("Höflich ist: Können Sie …?", "Cortés es: ¿puede…?", "Polite is: können Sie…?"),
        D("Können Sie mir helfen?", "¿Me puede ayudar?", "Can you help me?", "f"),
        D("Noch höflicher ist: Könnten Sie …?", "Aún más cortés es: ¿podría…?", "Even more polite is: könnten Sie…?"),
        D("Könnten Sie mich um sechs Uhr wecken?", "¿Podría despertarme a las seis?", "Could you wake me at six?", "m"),
    ]),
    dialogue("An der Rezeption", {"Rezeption": {"icon": "💁‍♀️", "voice": "f"}, "Mateo": MATEO},
             D("Hör zu: Mateo kommt im Hotel an.", "Escucha: Mateo llega al hotel.", "Listen: Mateo arrives at the hotel."), [
        ("Mateo", "Ich habe reserviert.", "Guten Abend. Ich habe ein Zimmer reserviert.", "Tengo una reserva.", "I have a booking."),
        ("Rezeption", "Wie ist Ihr Name?", None, "¿Cuál es su nombre?", "What's your name?"),
        ("Mateo", "Ríos. Mateo Ríos.", None, "Ríos. Mateo Ríos.", "Ríos. Mateo Ríos."),
        ("Rezeption", "Zimmer 214. Hier, bitte.", "Sie haben Zimmer 214. Hier ist Ihr Schlüssel.", "Habitación 214. Aquí tiene.", "Room 214. Here you are."),
        ("Mateo", "Wann gibt es Frühstück?", None, "¿A qué hora es el desayuno?", "When is breakfast?"),
        ("Rezeption", "Von sieben bis zehn.", "Von sieben bis zehn Uhr.", "De siete a diez.", "From seven to ten."),
    ]),
    tryit("Ich möchte …\nKönnten Sie …?", D("Jetzt du! Ruf ein Hotel an. Reserviere ein Zimmer und frag: Was kostet das?", "¡Ahora tú! Llama a un hotel. Reserva una habitación y pregunta: ¿cuánto cuesta?", "Now you! Call a hotel. Book a room and ask: how much is it?"), pause=10),
    recap(["Einzelzimmer · Doppelzimmer", "Ich möchte ein Zimmer reservieren.", "vom 3. bis zum 5. Mai", "Könnten Sie …?"],
          D("Du reservierst ein Zimmer und fragst sehr höflich. Schönen Aufenthalt!", "Reservas una habitación y preguntas con mucha cortesía. ¡Feliz estadía!", "You book a room and ask very politely. Enjoy your stay!")),
])

# ───────────────────────── 18 · Bitte, mach das! ─────────────────────────
UNITS[18] = ("Bitte, mach das!", "Der Imperativ", [
    title(["👉", "🍳", "🙏"],
          D("Hallo! Heute lernst du den Imperativ.", "¡Hola! Hoy aprendes el imperativo.", "Hi! Today you learn the imperative."),
          D("Mit du, ihr und Sie.", "Con du, ihr y Sie.", "With du, ihr and Sie.")),
    table("Imperativ", "imperativo", [R("du", "", "Komm", 1, "!"), R("ihr", "", "Kommt", 2, "!"), R("Sie", "", "Kommen", 3, " Sie!")], [
        D("Drei Formen, ein Verb. Mit du: ohne du und ohne st:", "Tres formas, un verbo. Con du: sin du y sin st:", "Three forms, one verb. With du: no du and no st:"),
        D("Komm!", "¡Ven!", "Come!"),
        D("Mit ihr: wie ihr kommt, aber ohne ihr:", "Con ihr: como ihr kommt, pero sin ihr:", "With ihr: like ihr kommt, but without ihr:"),
        D("Kommt! Und mit Sie: Kommen Sie!", "¡Vengan! Y con Sie: ¡Venga!", "Come! And with Sie: Kommen Sie!"),
    ], size=64),
    compare("Achtung!", {"title": "du nimmst", "icon": "🤲", "gloss": "tú tomas", "example": "Nimm!", "at": 1},
            {"title": "du fährst", "icon": "🚗", "gloss": "tú manejas", "example": "Fahr!", "at": 3}, [
        D("Bei e zu i bleibt das i:", "Con e a i, la i se queda:", "With e to i, the i stays:"),
        D("Du nimmst. Nimm!", "Tú tomas. ¡Toma!", "You take. Take!", "f"),
        D("Aber bei a zu ä fällt der Umlaut weg:", "Pero con a a ä, se quita la diéresis:", "But with a to ä, the umlaut goes:"),
        D("Du fährst. Fahr!", "Tú manejas. ¡Maneja!", "You drive. Drive!", "m"),
    ]),
    sentence("Freundlich", "amable", "🙏", [
        {"de": "Mach bitte das Licht an!", "es": "¡Prende la luz, por favor!", "mark": "bitte", "at": 1},
        {"de": "Komm doch mit!", "es": "¡Ven con nosotros!", "mark": "doch", "at": 3},
    ], [
        D("Der Imperativ ist direkt. Mit bitte ist er freundlich:", "El imperativo es directo. Con bitte es amable:", "The imperative is direct. With bitte it's friendly:"),
        D("Mach bitte das Licht an!", "¡Prende la luz, por favor!", "Please turn on the light!", "f"),
        D("Und mit doch oder mal klingt es netter:", "Y con doch o mal suena más amable:", "And with doch or mal it sounds nicer:"),
        D("Komm doch mit!", "¡Ven con nosotros!", "Why don't you come along!", "m"),
    ]),
    dialogue("In der Küche", LM, D("Hör zu: Lena und Mateo backen Pfannkuchen.", "Escucha: Lena y Mateo hacen panqueques.", "Listen: Lena and Mateo make pancakes."), [
        ("Lena", "Gib mir bitte die Eier!", None, "¡Pásame los huevos, por favor!", "Please pass me the eggs!"),
        ("Mateo", "Hier, bitte.", None, "Aquí tienes.", "Here you are."),
        ("Lena", "Nimm die Milch und rühr!", "Jetzt nimm die Milch und rühr gut!", "¡Toma la leche y revuelve!", "Take the milk and stir!"),
        ("Mateo", "So?", None, "¿Así?", "Like this?"),
        ("Lena", "Ja! Sei vorsichtig!", "Ja, genau! Sei vorsichtig, die Pfanne ist heiß!", "¡Sí! ¡Ten cuidado!", "Yes! Be careful!"),
        ("Mateo", "Mmh, das riecht gut!", None, "¡Mmm, huele rico!", "Mmm, that smells good!"),
    ]),
    tryit("Komm! Nimm!\nMach bitte …!", D("Jetzt du! Gib einem Freund drei Tipps für das Deutschlernen. Benutze den Imperativ!", "¡Ahora tú! Dale a un amigo tres consejos para aprender alemán. ¡Usa el imperativo!", "Now you! Give a friend three tips for learning German. Use the imperative!"), pause=10),
    recap(["Komm! · Kommt! · Kommen Sie!", "Nimm! · Fahr!", "Mach bitte das Licht an!", "Komm doch mit!"],
          D("Du bittest und gibst Tipps – mit du, ihr und Sie. Und immer mit bitte!", "Pides y das consejos, con du, ihr y Sie. ¡Y siempre con bitte!", "You make requests and give tips – with du, ihr and Sie. And always with bitte!")),
])

# ───────────────────────── 19 · Prüfung A1: Hören und Lesen ─────────────────────────
UNITS[19] = ("Prüfung A1", "Hören und Lesen", [
    title(["📝", "🎧", "📖"],
          D("Hallo! Jetzt trainieren wir für die Prüfung Goethe-Zertifikat A1.", "¡Hola! Ahora entrenamos para el examen Goethe-Zertifikat A1.", "Hi! Now we train for the Goethe-Zertifikat A1 exam."),
          D("Heute: Hören und Lesen.", "Hoy: escucha y lectura.", "Today: listening and reading.")),
    timeline("Die Prüfung", "el examen", [
        ("Hören", "escucha · 20 min", "🎧", "Hören: ungefähr zwanzig Minuten.", "Escucha: unos veinte minutos.", "Listening: about twenty minutes."),
        ("Lesen", "lectura · 25 min", "📖", "Lesen: ungefähr fünfundzwanzig Minuten.", "Lectura: unos veinticinco minutos.", "Reading: about twenty-five minutes."),
        ("Schreiben", "escritura · 20 min", "✍️", "Schreiben: ungefähr zwanzig Minuten.", "Escritura: unos veinte minutos.", "Writing: about twenty minutes."),
        ("Sprechen", "oral · 15 min", "🗣️", "Sprechen: ungefähr fünfzehn Minuten, in der Gruppe.", "Oral: unos quince minutos, en grupo.", "Speaking: about fifteen minutes, in a group."),
    ], D("Die Prüfung hat vier Teile:", "El examen tiene cuatro partes:", "The exam has four parts:")),
    tip("Zuerst die\nAufgabe lesen!", "👀", size=70, *[
        D("Der wichtigste Tipp für das Hören:", "El consejo más importante para la escucha:", "The most important tip for listening:"),
        D("Lies zuerst die Aufgabe. Dann weißt du, was du hören musst.", "Lee primero la tarea. Así sabes qué tienes que escuchar.", "Read the task first. Then you know what to listen for."),
    ]),
    words("Hören", "escucha", [
        ("Teil 1: Gespräche", "conversaciones · 2×", "💬", "Teil eins: kurze Gespräche. Du hörst sie zweimal.", "Parte uno: conversaciones cortas. Las oyes dos veces.", "Part one: short conversations. You hear them twice."),
        ("Teil 2: Durchsagen", "anuncios · 1×", "📢", "Teil zwei: Durchsagen. Du hörst sie nur einmal!", "Parte dos: anuncios. ¡Los oyes solo una vez!", "Part two: announcements. You hear them only once!"),
        ("Teil 3: Telefon", "mensajes · 2×", "☎️", "Teil drei: Nachrichten am Telefon. Zweimal.", "Parte tres: mensajes telefónicos. Dos veces.", "Part three: phone messages. Twice."),
    ], D("Das Hören hat drei Teile:", "La escucha tiene tres partes:", "Listening has three parts:")),
    words("Lesen", "lectura", [
        ("Teil 1: Texte", "correos, cartas", "📧", "Teil eins: kurze Texte, zum Beispiel E-Mails.", "Parte uno: textos cortos, por ejemplo correos.", "Part one: short texts, for example emails."),
        ("Teil 2: Anzeigen", "anuncios · a o b", "🔍", "Teil zwei: Anzeigen. Welche passt, a oder b?", "Parte dos: anuncios. ¿Cuál sirve, a o b?", "Part two: adverts. Which fits, a or b?"),
        ("Teil 3: Schilder", "letreros", "🪧", "Teil drei: Schilder und Aushänge.", "Parte tres: letreros y avisos.", "Part three: signs and notices."),
    ], D("Das Lesen hat auch drei Teile:", "La lectura también tiene tres partes:", "Reading also has three parts:")),
    tip("Zahlen\nZeiten\nOrte", "🔢", size=74, *[
        D("Achte besonders auf Zahlen, Uhrzeiten und Orte. Sie sind fast immer wichtig!", "Fíjate sobre todo en números, horas y lugares. ¡Casi siempre son importantes!", "Pay special attention to numbers, times and places. They're almost always important!"),
        D("Zahlen, Zeiten, Orte.", "Números, horas, lugares.", "Numbers, times, places."),
    ]),
    tryit("Wann? Wo?\nWie viel?", D("Jetzt du! Hör zu und antworte: Der Zug nach Bremen fährt heute um vierzehn Uhr dreißig von Gleis sieben. Wann fährt der Zug?", "¡Ahora tú! Escucha y responde: el tren a Bremen sale hoy a las 14:30 del andén siete. ¿A qué hora sale el tren?", "Now you! Listen and answer: the train to Bremen leaves today at 14:30 from platform seven. When does the train leave?"), pause=6),
    recap(["Hören: 3 Teile · Lesen: 3 Teile", "Zuerst die Aufgabe lesen!", "Durchsagen nur einmal", "Zahlen · Zeiten · Orte"],
          D("Du kennst das Hören und das Lesen in der Prüfung. Und du hast gute Tipps!", "Conoces la escucha y la lectura del examen. ¡Y tienes buenos consejos!", "You know the listening and reading parts of the exam. And you have good tips!")),
])

# ───────────────────────── 20 · Prüfung A1: Schreiben und Sprechen ─────────────────────────
UNITS[20] = ("Prüfung A1", "Schreiben und Sprechen", [
    title(["✍️", "🗣️", "🏆"],
          D("Hallo! Das ist die letzte Einheit von A1. Super!", "¡Hola! Esta es la última unidad del A1. ¡Súper!", "Hi! This is the last unit of A1. Great!"),
          D("Heute: Schreiben und Sprechen für die Prüfung.", "Hoy: escritura y oral para el examen.", "Today: writing and speaking for the exam.")),
    words("Schreiben", "escritura", [
        ("Teil 1: Formular", "llenar un formulario", "📋", "Teil eins: Du füllst ein Formular aus. Nur Wörter und Zahlen!", "Parte uno: llenas un formulario. ¡Solo palabras y números!", "Part one: you fill in a form. Only words and numbers!"),
        ("Teil 2: Nachricht", "un mensaje corto", "✉️", "Teil zwei: Du schreibst eine Nachricht, ungefähr dreißig Wörter.", "Parte dos: escribes un mensaje de unas treinta palabras.", "Part two: you write a message of about thirty words."),
    ], D("Das Schreiben hat zwei Teile:", "La escritura tiene dos partes:", "Writing has two parts:")),
    compare("Anrede und Gruß", {"title": "du", "icon": "😊", "gloss": "informal", "example": "Liebe Anna, …", "at": 1},
            {"title": "Sie", "icon": "🧑‍💼", "gloss": "formal", "example": "Sehr geehrte Frau …", "at": 3}, [
        D("Für Freunde schreibst du:", "Para amigos escribes:", "For friends you write:"),
        D("Liebe Anna. Am Ende: Viele Grüße.", "Querida Anna. Al final: Saludos.", "Dear Anna. At the end: Best wishes.", "f"),
        D("Formell schreibst du:", "Formal escribes:", "Formally you write:"),
        D("Sehr geehrte Frau Weber. Am Ende: Mit freundlichen Grüßen.", "Estimada señora Weber. Al final: Cordialmente.", "Dear Ms Weber. At the end: Yours sincerely.", "m"),
        D("Und schreib zu allen drei Punkten etwas!", "¡Y escribe algo sobre los tres puntos!", "And write something about all three points!"),
    ]),
    words("Sprechen", "oral", [
        ("Teil 1: Ich", "presentarse", "🙋", "Teil eins: Du stellst dich vor.", "Parte uno: te presentas.", "Part one: you introduce yourself."),
        ("Teil 2: Fragen", "preguntar con tarjetas", "❓", "Teil zwei: Du stellst Fragen mit einer Wortkarte.", "Parte dos: haces preguntas con una tarjeta de palabras.", "Part two: you ask questions with a word card."),
        ("Teil 3: Bitten", "pedir algo", "🙏", "Teil drei: Du bittest um etwas mit einer Bildkarte.", "Parte tres: pides algo con una tarjeta de imagen.", "Part three: you make a request with a picture card."),
    ], D("Das Sprechen hat drei Teile. Du sprichst in einer Gruppe:", "La parte oral tiene tres partes. Hablas en grupo:", "Speaking has three parts. You speak in a group:")),
    dialogue("Teil 2 und 3", {"Kofi": {"icon": "🧑🏿", "voice": "m"}, "Lena": LENA},
             D("Hör zu: Kofi und Lena sind in der Prüfung.", "Escucha: Kofi y Lena están en el examen.", "Listen: Kofi and Lena are in the exam."), [
        ("Kofi", "Meine Karte: Wochenende.", "Mein Thema ist Freizeit. Meine Karte ist Wochenende.", "Mi tarjeta: fin de semana.", "My card: weekend."),
        ("Kofi", "Was machst du am Wochenende?", None, "¿Qué haces el fin de semana?", "What do you do at the weekend?"),
        ("Lena", "Ich gehe oft schwimmen.", None, "A menudo voy a nadar.", "I often go swimming."),
        ("Lena", "Gib mir bitte den Stift!", None, "¡Pásame el lápiz, por favor!", "Please give me the pen!"),
        ("Kofi", "Hier, bitte.", None, "Aquí tienes.", "Here you are."),
        ("Lena", "Danke schön!", None, "¡Muchas gracias!", "Thank you!"),
    ]),
    tryit("Name · Alter · Land\nWohnort · Sprachen\nBeruf · Hobby", D("Jetzt du! Stell dich vor wie in der Prüfung: Name, Alter, Land, Wohnort, Sprachen, Beruf und Hobby.", "¡Ahora tú! Preséntate como en el examen: nombre, edad, país, ciudad, idiomas, profesión y pasatiempo.", "Now you! Introduce yourself as in the exam: name, age, country, home, languages, job and hobby."), pause=14),
    recap(["Formular · Nachricht (30 Wörter)", "Liebe … / Sehr geehrte …", "Sprechen: Ich · Fragen · Bitten", "Fit für Goethe A1!"],
          D("Herzlichen Glückwunsch! Du hast A1 geschafft. Jetzt bist du fit für die Prüfung.", "¡Felicitaciones! Terminaste el A1. Ahora estás listo para el examen.", "Congratulations! You've completed A1. Now you're ready for the exam."),
          D("Viel Erfolg – du schaffst das!", "¡Mucho éxito, tú puedes!", "Good luck – you can do it!")),
])


# ═══════════ (unidades 11–20 arriba de esta línea) ═══════════

if __name__ == "__main__":
    for n, (title_de, subtitle, scenes) in UNITS.items():
        script = {"key": f"de/a1-2/{n:02d}", "level": "A1.2", "number": n, "title": title_de, "subtitle": subtitle, "scenes": scenes}
        with open(os.path.join(HERE, f"{n:02d}.json"), "w") as f:
            json.dump(script, f, ensure_ascii=False, indent=2)
            f.write("\n")
    print(f"{len(UNITS)} guiones escritos")
