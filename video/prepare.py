"""
Prepara un video: genera las voces de cada frase y calcula la línea de tiempo.

Uso: python3 video/prepare.py video/scripts/a1-1/01.json
Salida:
  video/public/audio/<clave>/NN.mp3     (una pista por frase)
  video/out/<clave>.timeline.json        (escenas + tiempos, para Remotion)
  video/public/emoji/*.svg               (ilustraciones usadas)

Voces: Microsoft (edge-tts) si speech.platform.bing.com está habilitado;
si no, voces Piper locales (solo para probar tiempos).
"""
import asyncio, json, os, re, subprocess, sys, wave

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
FPS = 30
TTS_DIR = "/home/claude/tts"

EDGE_VOICES = {
    ("es", "f"): "es-CO-SalomeNeural",
    ("es", "m"): "es-CO-GonzaloNeural",
    ("de", "f"): "de-DE-KatjaNeural",
    ("de", "m"): "de-DE-ConradNeural",
}
PIPER = {
    ("es", "f"): "vits-piper-es_MX-claude-high/es_MX-claude-high.onnx",
    ("es", "m"): "vits-piper-es_MX-claude-high/es_MX-claude-high.onnx",
    ("de", "f"): "vits-piper-de_DE-kerstin-low/de_DE-kerstin-low.onnx",
    ("de", "m"): "vits-piper-de_DE-thorsten-high/de_DE-thorsten-high.onnx",
}

# Velocidad: un poco más lento en alemán para principiantes
EDGE_RATE = {"es": "+0%", "de": "-8%"}


def duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                         capture_output=True, text=True).stdout.strip()
    return float(out)


async def edge_tts(text, lang, voice, dest):
    import os, ssl
    import edge_tts
    import edge_tts.communicate as _c
    ca = os.environ.get("SSL_CERT_FILE") or "/root/.ccr/ca-bundle.crt"
    if os.path.exists(ca):  # entorno con proxy: usa su certificado
        _c._SSL_CTX = ssl.create_default_context(cafile=ca)
    comm = edge_tts.Communicate(text, EDGE_VOICES[(lang, voice)], rate=EDGE_RATE[lang], proxy=os.environ.get("HTTPS_PROXY"))
    await comm.save(dest)


_piper = {}


def piper_tts(text, lang, voice, dest):
    from piper import PiperVoice, SynthesisConfig
    key = (lang, voice)
    if key not in _piper:
        _piper[key] = PiperVoice.load(os.path.join(TTS_DIR, PIPER[key]))
    raw = dest + ".wav"
    with wave.open(raw, "wb") as w:
        _piper[key].synthesize_wav(text, w, syn_config=SynthesisConfig(length_scale=1.1 if lang == "de" else 1.0))
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-ar", "24000", "-b:a", "64k", dest], check=True)
    os.unlink(raw)


def edge_available():
    try:
        import edge_tts  # noqa
        r = subprocess.run(["curl", "-s", "-o", "/dev/null", "-m", "8", "-w", "%{http_code}", "https://speech.platform.bing.com"],
                           capture_output=True, text=True)
        return r.stdout.strip() not in ("000", "")
    except Exception:
        return False


def clean_for_speech(text):
    t = text.replace("…", "...").replace("«", "").replace("»", "").replace("·", ",")
    return re.sub(r"\s+", " ", t).strip()


def emoji_code(e):
    cps = [ord(c) for c in e]
    if 0x200D not in cps:
        cps = [c for c in cps if c != 0xFE0F]
    return "-".join(f"{c:x}" for c in cps)


def collect_emoji(obj, acc):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k in ("icon", "sticker") and isinstance(v, str):
                acc.add(v)
            elif k == "stickers" and isinstance(v, list):
                acc.update(v)
            else:
                collect_emoji(v, acc)
    elif isinstance(obj, list):
        for x in obj:
            collect_emoji(x, acc)


def main(script_path):
    script = json.load(open(script_path))
    slug = script["key"].replace("/", "-")
    audio_dir = os.path.join(HERE, "public", "audio", slug)
    os.makedirs(audio_dir, exist_ok=True)
    os.makedirs(os.path.join(HERE, "out"), exist_ok=True)
    use_edge = edge_available()
    print("voces:", "Microsoft (edge-tts)" if use_edge else "Piper (prueba)", flush=True)

    # Ilustraciones
    emo = set()
    collect_emoji(script, emo)
    emo_dir = os.path.join(HERE, "public", "emoji")
    os.makedirs(emo_dir, exist_ok=True)
    src_dir = os.path.join(ROOT, "node_modules", "@twemoji", "svg")
    for e in emo | {"👩‍🏫", "✅", "✏️", "⭐"}:
        code = emoji_code(e)
        src = os.path.join(src_dir, f"{code}.svg")
        if os.path.exists(src):
            subprocess.run(["cp", src, os.path.join(emo_dir, f"{code}.svg")])
        else:
            print("  falta emoji", e, code)

    total = 0
    n = 0
    cues = []
    for scene in script["scenes"]:
        lead = 1.6 if scene["type"] == "title" else 0.7
        t = lead
        segs = []
        for seg in scene["say"]:
            n += 1
            lang = seg["lang"]
            voice = seg.get("voice", "f")
            suffix = "edge" if use_edge else "piper"
            dest = os.path.join(audio_dir, f"{n:02d}-{suffix}.mp3")
            text = clean_for_speech(seg["text"])
            if not os.path.exists(dest):
                if use_edge:
                    asyncio.run(edge_tts(text, lang, voice, dest))
                else:
                    piper_tts(text, lang, voice, dest)
            d = duration(dest)
            segs.append({**seg, "audio": f"audio/{slug}/{os.path.basename(dest)}", "from": round(t * FPS), "dur": round(d * FPS)})
            cues.append({"start": total / FPS + t, "end": total / FPS + t + d, "seg": seg})
            gap = 0.6 if lang == "de" else 0.3
            t += d + gap
        if scene["type"] == "try":
            t += scene.get("pause", 5)
        t += 0.6
        frames = round(t * FPS)
        scene["segments"] = segs
        scene["from"] = total
        scene["durationInFrames"] = frames
        total += frames

    timeline = {k: v for k, v in script.items() if k != "scenes"}
    timeline.update({"fps": FPS, "width": 1280, "height": 720, "durationInFrames": total + 45, "scenes": script["scenes"]})
    out = os.path.join(HERE, "out", f"{slug}.timeline.json")
    json.dump(timeline, open(out, "w"), ensure_ascii=False, indent=1)

    # Subtítulos
    def ts(x):
        h, r = divmod(x, 3600)
        m, s = divmod(r, 60)
        return f"{int(h):02d}:{int(m):02d}:{s:06.3f}"

    for lang in ("de", "es", "en"):
        lines = ["WEBVTT", ""]
        for i, c in enumerate(cues, 1):
            s = c["seg"]
            if lang == "en":
                txt = s.get("en", s["text"])
            elif lang == "es":
                txt = s["text"] if s["lang"] == "es" else s.get("es", s["text"])
            else:  # "de" = texto original tal como se dice
                txt = s["text"]
            lines += [str(i), f"{ts(c['start'])} --> {ts(c['end'] + 0.2)}", txt, ""]
        open(os.path.join(HERE, "out", f"{slug}.{lang}.vtt"), "w").write("\n".join(lines))
    print(f"✓ {slug}: {total / FPS:.0f} s, {n} frases", flush=True)


if __name__ == "__main__":
    for p in sys.argv[1:]:
        main(p)
