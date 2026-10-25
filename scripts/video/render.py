"""
Generador de videos estilo 3Blue1Brown para Isora (Manim + voces Piper).

Uso:
  npx tsx scripts/video-data.ts a1-1 > /tmp/guiones.json
  python3 scripts/video/render.py /tmp/guiones.json [número de unidad …]

Para cada unidad crea en public/videos/<clave>:
  .mp4  (video 1280×720 con narración en alemán)
  .jpg  (póster)
  .de.vtt / .es.vtt / .en.vtt  (subtítulos)
"""
import hashlib, json, os, re, shutil, subprocess, sys, tempfile, wave

from manim import *  # noqa: F401,F403

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT_DIR = os.path.join(ROOT, "public", "videos")
CACHE = os.environ.get("VIDEO_CACHE", "/home/claude/video-cache")
TTS_DIR = os.environ.get("TTS_DIR", "/home/claude/tts")
VOICE_MODELS = {
    "m": "vits-piper-de_DE-thorsten-high/de_DE-thorsten-high.onnx",
    "f": "vits-piper-de_DE-kerstin-low/de_DE-kerstin-low.onnx",
}

# ── Paleta Isora ──
CREAM = "#f5f1e8"
CREAM_DEEP = "#ebe3d4"
PAPER = "#fbf9f4"
LINE = "#e2d8c6"
WINE = "#940d00"
WINE_LIGHT = "#b3200f"
WINE_SOFT = "#f6e0da"
COCOA = "#4a3326"
ESPRESSO = "#2e2019"
ESPRESSO_LIGHT = "#45322a"
LATTE = "#c9a98b"
INK = "#1b1714"
MUTED = "#6e6156"
GOLD = "#c08a3e"
SAGE = "#5f7a5a"
SAGE_SOFT = "#e3eadc"
BLUE = "#2f5d8a"
EMOJI_DIR = os.path.join(ROOT, "public", "emoji")

SERIF = "Fraunces"
SANS = "Inter"

config.pixel_width = 1280
config.pixel_height = 720
config.frame_rate = 30
config.background_color = CREAM
config.verbosity = "WARNING"
config.progress_bar = "none"

# ─────────────────────────── Voz ───────────────────────────
_voices = {}


def tts(text, voice="m", speed=0.9):
    """Sintetiza (con caché) y devuelve (ruta_wav, duración)."""
    from piper import PiperVoice, SynthesisConfig

    clean = re.sub(r"\*\*", "", text).replace("…", ",").replace("–", ",").replace("→", ",")
    clean = strip_emoji(clean).strip()
    h = hashlib.sha1(f"{voice}|{speed}|{clean}".encode()).hexdigest()[:16]
    os.makedirs(os.path.join(CACHE, "tts"), exist_ok=True)
    path = os.path.join(CACHE, "tts", f"{h}.wav")
    if not os.path.exists(path):
        if voice not in _voices:
            _voices[voice] = PiperVoice.load(os.path.join(TTS_DIR, VOICE_MODELS[voice]))
        cfg = SynthesisConfig(length_scale=1 / speed, noise_scale=0.6, noise_w_scale=0.7)
        raw = path + ".raw.wav"
        with wave.open(raw, "wb") as w:
            _voices[voice].synthesize_wav(clean, w, syn_config=cfg)
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-af",
             "silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,loudnorm=I=-17:TP=-2",
             "-ar", "44100", "-ac", "1", path],
            check=True,
        )
        os.unlink(raw)
    with wave.open(path, "rb") as r:
        return path, r.getnframes() / r.getframerate()


EMOJI = re.compile("[\U0001F000-\U0001FAFF☀-➿️‍]")


def strip_emoji(s):
    return EMOJI.sub("", s).strip()


# ─────────────────────────── Texto ───────────────────────────


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def markup(s, color=WINE):
    """Convierte **x** en resaltado vino + negrita (Pango markup)."""
    parts = esc(strip_emoji(s)).split("**")
    out = ""
    for i, p in enumerate(parts):
        out += f'<span foreground="{color}" weight="bold">{p}</span>' if i % 2 else p
    return out


def wrap(s, width=30):
    words, lines, cur = s.split(), [], ""
    for w in words:
        if cur and len(cur) + 1 + len(w) > width:
            lines.append(cur)
            cur = w
        else:
            cur = f"{cur} {w}".strip()
    if cur:
        lines.append(cur)
    return "\n".join(lines)


def T(s, size=40, color=INK, font=SERIF, weight=NORMAL, max_w=12.4, hl=WINE):
    m = MarkupText(markup(s, hl), font=font, font_size=size, color=color, weight=weight)
    if m.width > max_w:
        m.scale_to_fit_width(max_w)
    return m


def label(s, size=22, color=COCOA, weight=NORMAL):
    return Text(strip_emoji(s), font=SANS, font_size=size, color=color, weight=weight)


# ─────────────────────────── Imágenes (Twemoji) ───────────────────────────

IMAGES = {}
ART = re.compile(r"^(der|die|das|ein|eine|einen)\s+", re.I)


def image_code(text):
    w = ART.sub("", strip_emoji(text)).strip()
    for cand in (w, w.rstrip("!?."), w.split(":")[0].strip(), w.split(" ")[0].rstrip("!?.,")):
        if cand in IMAGES:
            return IMAGES[cand]
    return None


def img(code, height=1.0):
    path = os.path.join(EMOJI_DIR, f"{code}.svg")
    if not code or not os.path.exists(path):
        return None
    m = SVGMobject(path)
    m.scale_to_fit_height(height)
    return m


def img_for(text, height=1.0):
    return img(image_code(text), height)


# ─────────────────────────── Ilustraciones ───────────────────────────


def illustration(kind):
    k = kind or ""
    if k == "clock":
        face = Circle(radius=1.1, color=WINE, stroke_width=8).set_fill(PAPER, 1)
        ticks = VGroup(*[Line(UP * 0.9, UP * 1.02, color=COCOA, stroke_width=4).rotate(-i * TAU / 12, about_point=ORIGIN) for i in range(12)])
        h = Line(ORIGIN, UP * 0.55, color=COCOA, stroke_width=8)
        m = Line(ORIGIN, UP * 0.85, color=WINE, stroke_width=6).rotate(-TAU / 4, about_point=ORIGIN)
        g = VGroup(face, ticks, h, m, Dot(color=GOLD, radius=0.08))
        g.minute_hand = m
        return g
    if k in ("calendar", "review"):
        body = RoundedRectangle(corner_radius=0.15, width=2.2, height=2, color=WINE, stroke_width=6).set_fill(PAPER, 1)
        top = Rectangle(width=2.2, height=0.45, color=WINE, stroke_width=0).set_fill(WINE, 1).align_to(body, UP)
        dots = VGroup(*[Square(0.22, stroke_width=0).set_fill(GOLD if (i == 9) else LINE, 1) for i in range(15)]).arrange_in_grid(3, 5, buff=0.14).next_to(top, DOWN, buff=0.22)
        return VGroup(body, top, dots)
    if k == "globe":
        c = Circle(radius=1.1, color=WINE, stroke_width=7).set_fill(PAPER, 1)
        lines = VGroup(
            Ellipse(width=1.1, height=2.2, color=COCOA, stroke_width=3),
            Line(LEFT * 1.1, RIGHT * 1.1, color=COCOA, stroke_width=3),
            Line(LEFT * 0.95 + UP * 0.55, RIGHT * 0.95 + UP * 0.55, color=COCOA, stroke_width=2),
            Line(LEFT * 0.95 + DOWN * 0.55, RIGHT * 0.95 + DOWN * 0.55, color=COCOA, stroke_width=2),
        )
        return VGroup(c, lines, Dot(UP * 0.3 + RIGHT * 0.35, color=GOLD, radius=0.12))
    if k in ("alphabet", "articles", "classroom"):
        txt = {"alphabet": "ABC", "articles": "der die das", "classroom": "ABC"}[k]
        board = RoundedRectangle(corner_radius=0.12, width=3.2, height=1.9, color=COCOA, stroke_width=8).set_fill(SAGE, 1)
        t = Text(txt, font=SERIF, font_size=44 if k != "articles" else 30, color=CREAM)
        return VGroup(board, t)
    if k in ("numbers", "price"):
        t = Text("1 2 3" if k == "numbers" else "€ 9,90", font=SERIF, font_size=72, color=WINE, weight=BOLD)
        return VGroup(SurroundingRectangle(t, color=GOLD, buff=0.3, corner_radius=0.2, stroke_width=6), t)
    if k in ("cafe", "food", "shopping"):
        cup = RoundedRectangle(corner_radius=0.2, width=1.6, height=1.3, color=WINE, stroke_width=0).set_fill(WINE, 1)
        handle = Arc(radius=0.35, start_angle=-PI / 2, angle=PI, color=WINE, stroke_width=10).next_to(cup, RIGHT, buff=-0.08)
        steam = VGroup(*[FunctionGraph(lambda x: 0.12 * np.sin(4 * x), x_range=[0, 1.6], color=GOLD, stroke_width=5).rotate(PI / 2).shift(RIGHT * (i - 1) * 0.45 + UP * 1.6) for i in range(3)])
        saucer = Ellipse(width=2.4, height=0.35, color=COCOA, stroke_width=0).set_fill(COCOA, 1).next_to(cup, DOWN, buff=-0.05)
        return VGroup(steam, cup, handle, saucer)
    if k == "home":
        base = Square(1.8, color=WINE, stroke_width=0).set_fill(WINE, 1)
        roof = Triangle(color=COCOA, stroke_width=0).set_fill(COCOA, 1).stretch_to_fit_width(2.4).stretch_to_fit_height(1).next_to(base, UP, buff=0)
        door = Rectangle(width=0.5, height=0.8, stroke_width=0).set_fill(CREAM, 1).align_to(base, DOWN)
        win = Square(0.45, stroke_width=0).set_fill(GOLD, 1).move_to(base.get_center() + UP * 0.35 + RIGHT * 0.45)
        return VGroup(base, roof, door, win)
    if k == "weather":
        sun = Circle(radius=0.7, stroke_width=0).set_fill(GOLD, 1).shift(UP * 0.4 + LEFT * 0.4)
        cloud = VGroup(*[Circle(radius=r, stroke_width=0).set_fill(PAPER, 1).shift(p) for r, p in [(0.55, LEFT * 0.6), (0.75, ORIGIN + UP * 0.2), (0.5, RIGHT * 0.7)]]).shift(DOWN * 0.3 + RIGHT * 0.3)
        outline = VGroup(*[Circle(radius=r, color=COCOA, stroke_width=4).shift(p) for r, p in [(0.55, LEFT * 0.6), (0.75, ORIGIN + UP * 0.2), (0.5, RIGHT * 0.7)]]).shift(DOWN * 0.3 + RIGHT * 0.3)
        return VGroup(sun, outline, cloud)
    if k in ("family", "work", "hobbies", "day", "clothes"):
        colors = [WINE, GOLD, SAGE]
        people = VGroup(*[VGroup(Circle(radius=0.32, stroke_width=0).set_fill(c, 1), RoundedRectangle(corner_radius=0.3, width=0.9, height=1.0, stroke_width=0).set_fill(c, 1).shift(DOWN * 0.85)) for c in colors]).arrange(RIGHT, buff=0.3)
        people[1].scale(0.8).align_to(people[0], DOWN)
        return people
    # greeting / default: dos burbujas de diálogo
    b1 = RoundedRectangle(corner_radius=0.3, width=2.2, height=1.1, stroke_width=0).set_fill(WINE, 1).shift(LEFT * 0.5 + UP * 0.4)
    b2 = RoundedRectangle(corner_radius=0.3, width=1.8, height=0.9, stroke_width=0).set_fill(GOLD, 1).shift(RIGHT * 0.7 + DOWN * 0.7)
    t1 = Text("Hallo!", font=SERIF, font_size=34, color=CREAM).move_to(b1)
    t2 = Text("Hi!", font=SERIF, font_size=30, color=INK).move_to(b2)
    return VGroup(b1, t1, b2, t2)


# ─────────────────────────── Personajes ───────────────────────────


def character(color, name, flip=False):
    body = RoundedRectangle(corner_radius=0.75, width=1.5, height=1.9, stroke_width=0).set_fill(color, 1)
    eyes = VGroup()
    for dx in (-0.3, 0.3):
        white = Circle(radius=0.2, stroke_width=0).set_fill(WHITE, 1).move_to(body.get_center() + UP * 0.35 + RIGHT * dx)
        pupil = Circle(radius=0.09, stroke_width=0).set_fill(INK, 1).move_to(white.get_center() + RIGHT * (0.06 if not flip else -0.06))
        eyes.add(VGroup(white, pupil))
    smile = Arc(radius=0.28, start_angle=-PI * 0.8, angle=PI * 0.6, color=CREAM, stroke_width=5).move_to(body.get_center() + DOWN * 0.15)
    tag = Text(name, font=SANS, font_size=22, color=COCOA, weight=BOLD).next_to(body, DOWN, buff=0.18)
    g = VGroup(body, eyes, smile, tag)
    g.eyes = eyes
    return g


def bubble(text, color, text_color, max_chars=28):
    t = MarkupText(markup(wrap(text, max_chars), color=WINE), font=SERIF, font_size=34, color=text_color)
    if t.width > 7.4:
        t.scale_to_fit_width(7.4)
    box = RoundedRectangle(corner_radius=0.3, width=t.width + 0.7, height=t.height + 0.55, stroke_width=0).set_fill(color, 1)
    t.move_to(box)
    return VGroup(box, t)


def speaker_waves(mob):
    arcs = VGroup(*[Arc(radius=0.18 + 0.14 * i, start_angle=-PI / 4, angle=PI / 2, color=GOLD, stroke_width=5) for i in range(3)])
    arcs.next_to(mob, RIGHT, buff=0.3)
    return arcs


# ─────────────────────────── Escena ───────────────────────────


class UnitVideo(Scene):
    data: dict = {}

    def setup(self):
        self.cues = []

    # ---- utilidades de narración ----
    def now(self):
        return self.renderer.time

    def say(self, de, tr=None, voice="m", anims=None, anim_time=None, pad=0.45, speed=0.9, cue=True):
        """Reproduce la narración y opcionalmente anima durante ella. Registra el subtítulo."""
        path, dur = tts(de, voice, speed)
        start = self.now()
        self.add_sound(path)
        used = 0.0
        if anims:
            rt = anim_time if anim_time is not None else min(max(dur * 0.6, 0.6), 1.6)
            self.play(*anims, run_time=rt)
            used = rt
        rest = dur - used + pad
        if rest > 0:
            self.wait(rest)
        if cue:
            self.cues.append({"start": start, "end": start + dur, "de": strip_emoji(de).replace("**", ""),
                              "es": (tr or {}).get("es", ""), "en": (tr or {}).get("en", "")})
        return dur

    def clear_stage(self, keep=()):
        mobs = [m for m in self.mobjects if m not in keep]
        if mobs:
            self.play(*[FadeOut(m, shift=UP * 0.3) for m in mobs], run_time=0.5)

    def heading(self, text):
        h = T(text, size=46, color=WINE, weight=BOLD).to_edge(UP, buff=0.55)
        line = Line(LEFT, RIGHT, color=GOLD, stroke_width=5).set_width(min(h.width, 4)).next_to(h, DOWN, buff=0.18)
        self.play(Write(h), GrowFromCenter(line), run_time=0.9)
        return VGroup(h, line)

    # ---- fondo café oscuro para secciones especiales ----
    def dark(self, on=True):
        if on:
            self.bg = Rectangle(width=config.frame_width + 0.2, height=config.frame_height + 0.2, stroke_width=0).set_fill(ESPRESSO, 1)
            self.bg.set_z_index(-10)
            self.play(FadeIn(self.bg), run_time=0.5)
        elif getattr(self, "bg", None) is not None:
            self.play(FadeOut(self.bg), run_time=0.5)
            self.bg = None

    def heading_dark(self, text):
        h = T(text, size=46, color=CREAM, weight=BOLD, hl=GOLD).to_edge(UP, buff=0.55)
        line = Line(LEFT, RIGHT, color=WINE_LIGHT, stroke_width=6).set_width(min(h.width, 4)).next_to(h, DOWN, buff=0.18)
        self.play(Write(h), GrowFromCenter(line), run_time=0.9)
        return VGroup(h, line)

    # ---- partes del video ----
    def construct(self):
        d = self.data
        v = d["video"]
        IMAGES.update(d.get("images", {}))
        self.badge = label(f"{d['level']} · Einheit {d['number']}", size=20, color=MUTED).to_corner(UL, buff=0.35)
        self.title_card(d, v)
        for beat in v["beats"]:
            getattr(self, f"beat_{beat['type']}")(beat)
        self.dark(True)
        self.practice(v)
        self.picture_quiz(d)
        for q in d.get("quiz", []):
            self.quiz(q)
        self.outro(d, v)

    def title_card(self, d, v):
        self.dark(True)
        ill = illustration(v.get("illustration")).scale(0.85).shift(UP * 1.35)
        kicker = label(f"{d['level']} · EINHEIT {d['number']}", size=24, color=LATTE, weight=BOLD)
        title = T(d["title"], size=84, color=CREAM, weight=BOLD)
        group = VGroup(kicker, title).arrange(DOWN, buff=0.3).next_to(ill, DOWN, buff=0.55)
        underline = Line(LEFT, RIGHT, color=WINE_LIGHT, stroke_width=8).set_width(title.width * 0.6).next_to(title, DOWN, buff=0.25)
        # imágenes de la unidad que flotan alrededor
        floats = VGroup()
        spots = [(-5.4, 2.2), (5.3, 2.4), (-5.8, -0.6), (5.8, -0.4), (-4.4, -2.8), (4.5, -2.7)]
        for (x, y), voc in zip(spots, d.get("vocab", [])[:6]):
            m = img(voc["img"], 0.95)
            if m is not None:
                m.move_to([x, y, 0]).rotate((x * 7 % 20 - 10) * DEGREES)
                floats.add(m)
        self.play(DrawBorderThenFill(ill), LaggedStart(*[FadeIn(f, scale=0.4) for f in floats], lag_ratio=0.15), run_time=1.4)
        if hasattr(ill, "minute_hand"):
            self.play(Rotate(ill.minute_hand, angle=-TAU, about_point=ill[0].get_center()), run_time=1.0)
        self.play(FadeIn(kicker, shift=UP * 0.2), Write(title), *[f.animate.shift(UP * 0.15) for f in floats], run_time=1.2)
        self.play(GrowFromCenter(underline), *[f.animate.shift(DOWN * 0.15) for f in floats], run_time=0.6)
        self.wait(0.5)
        self.play(VGroup(ill, group, underline).animate.scale(0.5).to_edge(UP, buff=0.35).set_opacity(0.4),
                  *[f.animate.set_opacity(0.25) for f in floats], run_time=0.8)
        intro = v["intro"]
        lines = T(wrap(intro["de"], 44), size=34, color=CREAM, max_w=11.5, hl=GOLD).shift(DOWN * 0.7)
        self.say(intro["de"], intro, anims=[FadeIn(lines, shift=UP * 0.2)], anim_time=1.0)
        self.clear_stage()
        self.bg = None
        self.play(FadeIn(self.badge), run_time=0.3)

    def beat_phrase(self, b):
        pic = img_for(b["de"], 1.5)
        phrase = T(b["de"], size=88, color=WINE, weight=BOLD)
        if pic is not None:
            VGroup(pic, phrase).arrange(DOWN, buff=0.5).move_to(UP * 0.4)
            self.play(FadeIn(pic, scale=0.5), run_time=0.5)
        else:
            phrase.shift(UP * 0.3)
        waves = speaker_waves(phrase)
        self.play(Write(phrase), run_time=1.1)
        anims = [LaggedStart(*[Create(a) for a in waves], lag_ratio=0.3)]
        if pic is not None:
            anims.append(Wiggle(pic, scale_value=1.08))
        self.say(b["de"], b.get("tr"), anims=anims, anim_time=0.7, speed=0.82)
        under = Underline(phrase, color=GOLD, stroke_width=6, buff=0.15)
        self.say(b["de"], b.get("tr"), anims=[Create(under)], anim_time=0.8, speed=0.7, cue=False)
        if b.get("say"):
            grp = VGroup(*(m for m in (pic, phrase) if m is not None))
            self.play(grp.animate.scale(0.6).to_edge(UP, buff=0.8), FadeOut(waves), FadeOut(under), run_time=0.6)
            body = T(wrap(b["say"]["de"], 44), size=32, color=INK, max_w=11.5).shift(DOWN * 0.9)
            self.say(b["say"]["de"], b["say"], anims=[FadeIn(body, shift=UP * 0.2)])
        self.clear_stage(keep=[self.badge])

    def beat_list(self, b):
        head = self.heading(b["title"]["de"])
        items = VGroup()
        any_img = False
        for it in b["items"]:
            pic = img_for(it["de"], 0.62)
            if pic is not None:
                any_img = True
                marker = pic
            else:
                marker = Dot(radius=0.08, color=GOLD)
            t = T(it["de"], size=40, color=INK)
            row = VGroup(marker, t).arrange(RIGHT, buff=0.35)
            items.add(row)
        if any_img:
            for row in items:
                row[0].move_to(row[1].get_left() + LEFT * 0.7)
        items.arrange(DOWN, aligned_edge=LEFT, buff=0.3)
        if items.height > 5.2:
            items.scale_to_fit_height(5.2)
        items.next_to(head, DOWN, buff=0.5)
        if items.width > 12:
            items.scale_to_fit_width(12)
        items.set_x(0)
        for row, it in zip(items, b["items"]):
            anims = [FadeIn(row[1], shift=RIGHT * 0.3), GrowFromCenter(row[0])]
            self.say(it["de"], it.get("tr"), anims=anims, anim_time=0.55, speed=0.82, pad=0.35)
        if b.get("say"):
            box = SurroundingRectangle(items, color=GOLD, buff=0.3, corner_radius=0.15, stroke_width=3)
            self.say(b["say"]["de"], b["say"], anims=[Create(box)], anim_time=1.0)
        self.wait(0.3)
        self.clear_stage(keep=[self.badge])

    def build_table(self, columns, rows):
        has_head = any(c.strip() for c in columns)
        ncol = max(len(columns), max(len(r) for r in rows))
        cells = []
        if has_head:
            cells.append([label(c, size=22, color=COCOA, weight=BOLD) if c.strip() else VMobject() for c in columns] + [VMobject()] * (ncol - len(columns)))
        for r in rows:
            row = []
            for j in range(ncol):
                s = r[j] if j < len(r) else ""
                s = strip_emoji(s)
                row.append(MarkupText(markup(s), font=SERIF, font_size=34, color=INK) if s else VMobject())
            cells.append(row)
        widths = [max((c[j].width for c in cells), default=0.5) for j in range(ncol)]
        heights = [max((c.height for c in row), default=0.4) for row in cells]
        gap_x, gap_y = 0.7, 0.42
        total_w = sum(widths) + gap_x * (ncol - 1)
        total_h = sum(heights) + gap_y * (len(cells) - 1)
        y = total_h / 2
        rows_g = VGroup()
        for i, row in enumerate(cells):
            x = -total_w / 2
            yc = y - heights[i] / 2
            g = VGroup()
            for j, c in enumerate(row):
                if len(c.points) or c.submobjects:
                    c.move_to([x + c.width / 2, yc, 0])
                g.add(c)
                x += widths[j] + gap_x
            rows_g.add(g)
            y -= heights[i] + gap_y
        frame = RoundedRectangle(corner_radius=0.2, width=total_w + 0.9, height=total_h + 0.7, stroke_width=0).set_fill(PAPER, 1)
        rules = VGroup()
        for i in range(1, len(rows_g)):
            yy = (rows_g[i - 1].get_bottom()[1] + rows_g[i].get_top()[1]) / 2 if rows_g[i].get_top()[1] != 0 else 0
            rules.add(Line([-total_w / 2 - 0.3, yy, 0], [total_w / 2 + 0.3, yy, 0], color=LINE, stroke_width=2))
        table = VGroup(frame, rules, rows_g)
        return table, rows_g, has_head

    def beat_table(self, b):
        head = self.heading(b["title"]["de"])
        table, rows_g, has_head = self.build_table(b["columns"], b["rows"])
        max_h = 7.2 - 1.9
        if table.height > max_h:
            table.scale_to_fit_height(max_h)
        if table.width > 12.5:
            table.scale_to_fit_width(12.5)
        table.next_to(head, DOWN, buff=0.45).set_x(0)
        self.play(FadeIn(table[0]), Create(table[1]), run_time=0.6)
        reveal = [FadeIn(r, shift=RIGHT * 0.2) for r in rows_g]
        if b.get("say"):
            path, dur = tts(b["say"]["de"], "m", 0.9)
            per = max(min((dur * 0.75) / max(len(reveal), 1), 1.6), 0.35)
            start = self.now()
            self.add_sound(path)
            for r in reveal:
                self.play(r, run_time=per * 0.6)
                self.wait(per * 0.4)
            # resalta las partes en negrita (terminaciones)
            elapsed = self.now() - start
            self.wait(max(dur - elapsed, 0) + 0.5)
            self.cues.append({"start": start, "end": start + dur, "de": b["say"]["de"], "es": b["say"]["es"], "en": b["say"]["en"]})
        else:
            for r in reveal:
                self.play(r, run_time=0.5)
            self.wait(2.0)
        self.play(Indicate(rows_g, color=WINE_LIGHT, scale_factor=1.03), run_time=0.8)
        self.wait(0.4)
        self.clear_stage(keep=[self.badge])

    def beat_dialogue(self, b):
        names = list(b["speakers"].keys())
        palette = [WINE, SAGE, GOLD, BLUE]
        chars = {}
        for i, n in enumerate(names[:2]):
            c = character(palette[i], n, flip=(i == 1)).scale(0.9)
            c.move_to(LEFT * 5.4 + DOWN * 2.2 if i == 0 else RIGHT * 5.4 + DOWN * 2.2)
            chars[n] = c
        self.play(*[FadeIn(c, shift=UP * 0.4) for c in chars.values()], run_time=0.7)
        stack = []
        for line in b["lines"]:
            sp = line["speaker"]
            idx = names.index(sp) if sp in names else 0
            color = WINE_SOFT if idx == 0 else CREAM_DEEP
            bub = bubble(line["de"], color, INK)
            bub.move_to([(-1.4 if idx == 0 else 1.4), -1.7, 0])
            anims = [FadeIn(bub, shift=UP * 0.3, scale=0.92)]
            dy = bub.height + 0.3
            for old in stack:
                anims.append(old.animate.shift(UP * dy).set_opacity(0.4))
            ch = chars.get(sp)
            if ch is not None:
                anims.append(ch.animate.shift(UP * 0.15))
                other = [c for n2, c in chars.items() if n2 != sp]
            voice = b["speakers"].get(sp, "m")
            stack.append(bub)
            self.say(line["de"], line.get("tr"), voice=voice, anims=anims, anim_time=0.5, speed=0.88, pad=0.45)
            if ch is not None:
                self.play(ch.animate.shift(DOWN * 0.15), run_time=0.15)
            # quita las burbujas que ya salieron por arriba
            gone = [o for o in stack if o.get_top()[1] > 3.2]
            if gone:
                self.play(*[FadeOut(o) for o in gone], run_time=0.25)
                stack = [o for o in stack if o not in gone]
        self.wait(0.5)
        self.clear_stage(keep=[self.badge])

    def beat_rule(self, b):
        raw = b["text"]["de"]
        parts = [p.strip() for p in re.split(r"\s+·\s+|\s{3,}", raw) if p.strip()]
        text = T("\n".join(wrap(p, 34) for p in parts), size=52, color=WINE, weight=BOLD, max_w=11)
        box = SurroundingRectangle(text, color=GOLD, buff=0.5, corner_radius=0.25, stroke_width=6)
        fill = box.copy().set_fill(PAPER, 1).set_stroke(width=0)
        star = Text("✦", font=SANS, font_size=40, color=GOLD).next_to(box, UP, buff=0.2)
        self.play(FadeIn(fill), Create(box), run_time=0.7)
        self.play(Write(text), FadeIn(star, scale=0.5), run_time=1.0)
        narration = b.get("say") or b["text"]
        self.say(narration["de"], narration, anims=[Indicate(text, color=WINE_LIGHT, scale_factor=1.05)], anim_time=0.9)
        self.clear_stage(keep=[self.badge])

    def beat_transform(self, b):
        a = T(b["from"], size=60, color=INK).shift(UP * 0.6)
        z = T(b["to"], size=60, color=WINE, weight=BOLD).shift(UP * 0.6)
        self.play(Write(a), run_time=1.0)
        self.say(b["from"], None, speed=0.85, pad=0.3, cue=False)
        self.play(TransformMatchingShapes(a, z, path_arc=PI / 3), run_time=1.6)
        self.say(b["to"], b.get("tr"), speed=0.85, pad=0.3)
        if b.get("say"):
            body = T(wrap(b["say"]["de"], 46), size=30, color=INK, max_w=11.5).shift(DOWN * 1.6)
            self.say(b["say"]["de"], b["say"], anims=[FadeIn(body, shift=UP * 0.2)])
        self.clear_stage(keep=[self.badge])

    def practice(self, v):
        """Sprich nach! – escuchar y repetir con una pausa para el estudiante (fondo café)."""
        items = []
        for b in v["beats"]:
            if b["type"] == "phrase":
                items.append(b["de"])
            elif b["type"] == "list":
                items += [i["de"] for i in b["items"] if ":" not in i["de"]]
            elif b["type"] == "dialogue":
                items += [l["de"] for l in b["lines"]]
        items = [strip_emoji(x) for x in items if 2 < len(strip_emoji(x)) <= 34]
        seen, picked = set(), []
        for x in items:
            if x not in seen:
                seen.add(x)
                picked.append(x)
        picked = picked[:5]
        if len(picked) < 2:
            return
        self.play(FadeOut(self.badge), run_time=0.2)
        mic = img("1f5e3", 0.8)
        head = self.heading_dark("Sprich nach!")
        if mic is not None:
            mic.next_to(head, LEFT, buff=0.3)
            self.play(FadeIn(mic, scale=0.5), run_time=0.3)
        self.say("Jetzt bist du dran. Hör zu und sprich nach!",
                 {"es": "Ahora te toca a ti. Escucha y repite.", "en": "Now it's your turn. Listen and repeat."}, pad=0.3)
        dots = VGroup(*[Dot(radius=0.09, color=ESPRESSO_LIGHT) for _ in picked]).arrange(RIGHT, buff=0.25).to_edge(DOWN, buff=0.5)
        self.play(FadeIn(dots), run_time=0.3)
        for i, x in enumerate(picked):
            pic = img_for(x, 1.2)
            phrase = T(x, size=70, color=CREAM, weight=BOLD, hl=GOLD)
            grp = VGroup(pic, phrase).arrange(DOWN, buff=0.4) if pic is not None else VGroup(phrase)
            grp.move_to(UP * 0.1)
            self.play(FadeIn(grp, shift=UP * 0.2), dots[i].animate.set_color(GOLD).scale(1.4), run_time=0.4)
            dur = self.say(x, None, speed=0.82, pad=0.2, cue=False)
            ring = Circle(radius=0.42, color=WINE_LIGHT, stroke_width=9).next_to(grp, DOWN, buff=0.45)
            you = label("Du!", size=24, color=CREAM, weight=BOLD).move_to(ring)
            self.add(you)
            self.play(Create(ring), run_time=max(dur * 1.35, 1.7), rate_func=linear)
            self.play(FadeOut(grp), FadeOut(ring), FadeOut(you), run_time=0.3)
        self.play(*[FadeOut(m) for m in (head, dots, mic) if m is not None], run_time=0.4)

    def picture_quiz(self, d):
        """Was passt? – escuchar una palabra y elegir la imagen correcta."""
        voc = [x for x in d.get("vocab", []) if x.get("article") and img(x["img"], 0.5) is not None]
        # sin repetir imágenes
        uniq, seen = [], set()
        for x in voc:
            if x["img"] not in seen:
                seen.add(x["img"])
                uniq.append(x)
        if len(uniq) < 4:
            return
        head = self.heading_dark("Welches Bild passt?")
        self.say("Hör gut zu und zeig auf das richtige Bild!",
                 {"es": "¡Escucha bien y señala la imagen correcta!", "en": "Listen carefully and point to the right picture!"}, pad=0.2)
        rounds = [(uniq[0:4], 2), (uniq[4:8] if len(uniq) >= 8 else uniq[1:5], 0)]
        for options, correct in rounds:
            cards = VGroup()
            for i, x in enumerate(options):
                card = RoundedRectangle(corner_radius=0.25, width=2.5, height=2.5, stroke_width=3, color=ESPRESSO_LIGHT).set_fill(ESPRESSO_LIGHT, 1)
                pic = img(x["img"], 1.5).move_to(card)
                letter = label("ABCD"[i], size=22, color=LATTE, weight=BOLD).next_to(card, DOWN, buff=0.2)
                cards.add(VGroup(card, pic, letter))
            cards.arrange(RIGHT, buff=0.45).shift(DOWN * 0.2)
            self.play(LaggedStart(*[FadeIn(c, shift=UP * 0.3) for c in cards], lag_ratio=0.12), run_time=0.9)
            target = options[correct]
            word = f"{target['article']} {target['de']}" if target.get("article") else target["de"]
            self.say(word, None, speed=0.82, pad=0.1, cue=False)
            timer = Circle(radius=0.32, color=GOLD, stroke_width=7).to_corner(DR, buff=0.55)
            self.play(Create(timer), run_time=2.6, rate_func=linear)
            right = cards[correct]
            answer = T(word, size=44, color=GOLD, weight=BOLD).next_to(cards, DOWN, buff=0.75)
            self.play(right[0].animate.set_stroke(GOLD, 8),
                      *[c.animate.set_opacity(0.25) for i, c in enumerate(cards) if i != correct],
                      FadeOut(timer), Write(answer), run_time=0.7)
            self.say(word, {"es": word, "en": word}, speed=0.82, anims=[Indicate(right[1], color=GOLD, scale_factor=1.15)], anim_time=0.6, pad=0.5)
            self.play(FadeOut(cards), FadeOut(answer), run_time=0.4)
        self.play(FadeOut(head), run_time=0.3)

    def quiz(self, q):
        head = self.heading_dark("Kurzes Quiz")
        prompt = T(wrap(q["prompt"]["de"], 40), size=38, color=CREAM, max_w=11.5, hl=GOLD)
        parts = [prompt]
        if q.get("sentence"):
            parts.append(T(q["sentence"], size=40, color=GOLD))
        top = VGroup(*parts).arrange(DOWN, buff=0.3).next_to(head, DOWN, buff=0.45)
        opts = VGroup()
        for i, o in enumerate(q["options"]):
            letter = label("ABCD"[i], size=24, color=CREAM, weight=BOLD)
            disc = Circle(radius=0.26, stroke_width=0).set_fill(WINE, 1)
            letter.move_to(disc)
            t = T(o, size=36, color=INK, max_w=8)
            row = VGroup(VGroup(disc, letter), t).arrange(RIGHT, buff=0.3)
            box = RoundedRectangle(corner_radius=0.2, width=max(row.width + 0.7, 5), height=row.height + 0.4, stroke_width=0).set_fill(CREAM, 1)
            row.move_to(box).align_to(box, LEFT).shift(RIGHT * 0.3)
            opts.add(VGroup(box, row))
        opts.arrange(DOWN, buff=0.22).next_to(top, DOWN, buff=0.45)
        if opts.get_bottom()[1] < -3.6:
            VGroup(top, opts).scale_to_fit_height(5.9).next_to(head, DOWN, buff=0.35)
        self.play(FadeIn(top, shift=UP * 0.2), run_time=0.6)
        self.play(LaggedStart(*[FadeIn(o, shift=RIGHT * 0.3) for o in opts], lag_ratio=0.2), run_time=1.0)
        self.say("Was ist richtig? Denk kurz nach!", {"es": "¿Qué es correcto? ¡Piénsalo un momento!", "en": "What's correct? Think for a moment!"}, pad=0.1)
        timer = Circle(radius=0.35, color=GOLD, stroke_width=7).to_corner(DR, buff=0.6)
        pause = label("Pause!", size=22, color=LATTE, weight=BOLD).next_to(timer, LEFT, buff=0.25)
        self.play(Create(timer), FadeIn(pause), run_time=3.5, rate_func=linear)
        right = opts[q["answer"]]
        self.play(right[0].animate.set_fill(SAGE_SOFT, 1).set_stroke(SAGE, 5),
                  *[o.animate.set_opacity(0.3) for i, o in enumerate(opts) if i != q["answer"]],
                  FadeOut(timer), FadeOut(pause), run_time=0.6)
        self.say(q["options"][q["answer"]], None, speed=0.85, pad=0.2, cue=False)
        ex = q["explanation"]
        self.say(ex["de"], ex, pad=0.6)
        self.play(*[FadeOut(m) for m in (head, top, opts)], run_time=0.5)

    def outro(self, d, v):
        head = self.heading_dark("Heute gelernt")
        checks = VGroup()
        for g in d.get("goals", [])[:4]:
            mark = Text("✓", font=SANS, font_size=34, color=GOLD, weight=BOLD)
            t = T(wrap(g["de"], 46), size=30, color=CREAM, max_w=10.5, hl=GOLD)
            checks.add(VGroup(mark, t).arrange(RIGHT, buff=0.3, aligned_edge=UP))
        checks.arrange(DOWN, aligned_edge=LEFT, buff=0.35).next_to(head, DOWN, buff=0.6).set_x(0)
        if checks.height > 4.6:
            checks.scale_to_fit_height(4.6).next_to(head, DOWN, buff=0.5)
        self.play(LaggedStart(*[FadeIn(c, shift=RIGHT * 0.3) for c in checks], lag_ratio=0.35), run_time=1.8)
        o = v["outro"]
        self.say(o["de"], o, anims=[Indicate(checks, color=GOLD, scale_factor=1.02)], anim_time=1.2)
        self.play(FadeOut(head), FadeOut(checks), run_time=0.5)
        mark = VGroup(Circle(radius=0.6, stroke_width=0).set_fill(WINE, 1),
                      Arc(radius=0.42, start_angle=PI * 0.15, angle=PI * 0.7, color=CREAM, stroke_width=7).shift(DOWN * 0.15),
                      Dot(UP * 0.32, color=GOLD, radius=0.07))
        name = Text("Isora", font=SERIF, font_size=72, color=CREAM, weight=BOLD)
        logo = VGroup(mark, name).arrange(RIGHT, buff=0.35)
        self.play(GrowFromCenter(mark), Write(name), run_time=1.2)
        self.wait(1.5)


# ─────────────────────────── Salida ───────────────────────────


def ts(t):
    h, rem = divmod(max(t, 0), 3600)
    m, s = divmod(rem, 60)
    return f"{int(h):02d}:{int(m):02d}:{s:06.3f}"


def write_vtt(cues, lang, path):
    lines = ["WEBVTT", ""]
    for i, c in enumerate(cues, 1):
        txt = c.get(lang) or c["de"]
        if not txt:
            continue
        lines += [str(i), f"{ts(c['start'])} --> {ts(c['end'] + 0.25)}", wrap(txt, 60), ""]
    open(path, "w").write("\n".join(lines))


def render_unit(data):
    key = data["key"]
    dest = os.path.join(OUT_DIR, key)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    work = tempfile.mkdtemp(prefix="isora-video-")
    config.media_dir = work
    config.output_file = "video"
    UnitVideo.data = data
    scene = UnitVideo()
    scene.render()
    raw = str(scene.renderer.file_writer.movie_file_path)
    # Re-codifica: más liviano, arranque rápido en web
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-c:v", "libx264", "-preset", "veryfast", "-crf", "26",
         "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", dest + ".mp4"],
        check=True,
    )
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", "3.6", "-i", dest + ".mp4", "-frames:v", "1", "-q:v", "3", dest + ".jpg"], check=True)
    for lang in ("de", "es", "en"):
        write_vtt(scene.cues, lang, f"{dest}.{lang}.vtt")
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", dest + ".mp4"],
                               capture_output=True, text=True).stdout.strip())
    shutil.rmtree(work, ignore_errors=True)
    return dur


def update_manifest(results):
    path = os.path.join(ROOT, "src", "content", "generated", "media.ts")
    src = open(path).read()
    m = re.search(r"export const videos: Record<string, \{ duration: number \}> = (\{.*?\});", src, re.S)
    current = json.loads(m.group(1)) if m and m.group(1).strip() not in ("{}",) else {}
    current.update({k: {"duration": round(v)} for k, v in results.items()})
    new_line = "export const videos: Record<string, { duration: number }> = " + json.dumps(current, indent=2, sort_keys=True) + ";"
    src = re.sub(r"export const videos: Record<string, \{ duration: number \}> = \{.*?\};", lambda _: new_line, src, flags=re.S)
    open(path, "w").write(src)


if __name__ == "__main__":
    units = json.load(open(sys.argv[1]))
    only = {int(x) for x in sys.argv[2:]}
    results = {}
    for u in units:
        if only and u["number"] not in only:
            continue
        print(f"▶ {u['key']} {u['title']}", flush=True)
        d = render_unit(u)
        results[u["key"]] = d
        update_manifest({u["key"]: d})
        print(f"  ✓ {d:.0f} s", flush=True)
