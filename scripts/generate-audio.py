"""
Genera los audios de la web con voces neuronales de Microsoft (edge-tts)
para la lista de scripts/audio-list.ts.

Uso:
  npx tsx scripts/audio-list.ts a1-1 > /tmp/lista.json
  python3 scripts/generate-audio.py /tmp/lista.json [--all]

Voces: m = de-DE-ConradNeural, f = de-DE-KatjaNeural.
Solo genera los archivos que faltan en public/audio/ (con --all los rehace todos).
Requiere acceso a speech.platform.bing.com.
"""
import asyncio, json, os, ssl, subprocess, sys, tempfile

import edge_tts
import edge_tts.communicate as _c

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "audio")
VOICES = {"m": "de-DE-ConradNeural", "f": "de-DE-KatjaNeural"}
RATE = "-8%"
PROXY = os.environ.get("HTTPS_PROXY")
CA = os.environ.get("SSL_CERT_FILE") or "/root/.ccr/ca-bundle.crt"
if os.path.exists(CA):  # entorno con proxy: usa su certificado
    _c._SSL_CTX = ssl.create_default_context(cafile=CA)


async def render(item, sem):
    dest = os.path.join(OUT, f"{item['key']}.mp3")
    text = item["text"].replace("…", ",").replace("–", ",")
    async with sem:
        for attempt in range(3):
            try:
                with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
                    raw = tmp.name
                await edge_tts.Communicate(text, VOICES[item["voice"]], rate=RATE, proxy=PROXY).save(raw)
                break
            except Exception as e:  # noqa: BLE001
                if attempt == 2:
                    print(f"  (sin audio) {item['text']!r}: {e}", flush=True)
                    return 0
                await asyncio.sleep(2)
    proc = await asyncio.create_subprocess_exec(
        "ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-af",
        "silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,loudnorm=I=-18:TP=-2",
        "-ac", "1", "-ar", "24000", "-b:a", "48k", dest,
    )
    await proc.wait()
    os.unlink(raw)
    return 1


async def main(items, redo):
    os.makedirs(OUT, exist_ok=True)
    todo = items if redo else [i for i in items if not os.path.exists(os.path.join(OUT, f"{i['key']}.mp3"))]
    print(f"{len(items)} textos, a generar {len(todo)}", flush=True)
    sem = asyncio.Semaphore(8)
    done = 0
    for chunk in range(0, len(todo), 100):
        done += sum(await asyncio.gather(*(render(i, sem) for i in todo[chunk:chunk + 100])))
        print(f"  {done}/{len(todo)}", flush=True)
    print(f"listo: {done} audios", flush=True)


if __name__ == "__main__":
    asyncio.run(main(json.load(open(sys.argv[1])), "--all" in sys.argv))
