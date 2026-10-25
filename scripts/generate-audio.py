"""
Genera los audios con voces neuronales alemanas (Piper) para la lista de scripts/audio-list.ts.

Uso:
  npx tsx scripts/audio-list.ts a1-1 > /tmp/lista.json
  python3 scripts/generate-audio.py /tmp/lista.json

Voces: m = Thorsten (high), f = Kerstin. Los modelos están en $TTS_DIR (por defecto ~/tts).
Solo genera los archivos que faltan en public/audio/.
"""
import json, os, subprocess, sys, tempfile, wave
from concurrent.futures import ProcessPoolExecutor

TTS_DIR = os.environ.get("TTS_DIR", "/home/claude/tts")
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "audio")
MODELS = {
    "m": "vits-piper-de_DE-thorsten-high/de_DE-thorsten-high.onnx",
    "f": "vits-piper-de_DE-kerstin-low/de_DE-kerstin-low.onnx",
}
_voices = {}


def voice(v):
    if v not in _voices:
        from piper import PiperVoice
        _voices[v] = PiperVoice.load(os.path.join(TTS_DIR, MODELS[v]))
    return _voices[v]


def render(item):
    from piper import SynthesisConfig
    dest = os.path.join(OUT, f"{item['key']}.mp3")
    if os.path.exists(dest):
        return 0
    text = item["text"].replace("…", ",").replace("–", ",")
    cfg = SynthesisConfig(length_scale=1 / 0.92, noise_scale=0.6, noise_w_scale=0.7)
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        try:
            with wave.open(tmp.name, "wb") as w:
                voice(item["voice"]).synthesize_wav(text, w, syn_config=cfg)
        except wave.Error:
            print(f"  (sin audio) {item['text']!r}", flush=True)
            os.unlink(tmp.name)
            return 0
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", tmp.name, "-af",
         "silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,loudnorm=I=-18:TP=-2",
         "-ac", "1", "-ar", "24000", "-b:a", "40k", dest],
        check=True,
    )
    os.unlink(tmp.name)
    return 1


if __name__ == "__main__":
    items = json.load(open(sys.argv[1]))
    os.makedirs(OUT, exist_ok=True)
    todo = [i for i in items if not os.path.exists(os.path.join(OUT, f"{i['key']}.mp3"))]
    print(f"{len(items)} textos, faltan {len(todo)}", flush=True)
    done = 0
    with ProcessPoolExecutor(max_workers=4) as ex:
        for n in ex.map(render, todo, chunksize=8):
            done += n
            if done % 100 == 0:
                print(f"  {done}/{len(todo)}", flush=True)
    print(f"listo: {done} audios nuevos", flush=True)
