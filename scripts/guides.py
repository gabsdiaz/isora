"""
Genera las guías PDF de un nivel a partir de las páginas /guia/... (la app debe estar corriendo).
Uso: python3 scripts/guides.py a1-1 [http://localhost:3100]
"""
import asyncio, json, os, re, sys
from playwright.async_api import async_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
LEVEL = sys.argv[1] if len(sys.argv) > 1 else "a1-1"
BASE = sys.argv[2] if len(sys.argv) > 2 else "http://localhost:3100"


def count_pages(path):
    data = open(path, "rb").read()
    return len(re.findall(rb"/Type\s*/Page[^s]", data))


async def main():
    out = os.path.join(ROOT, "public", "guides", "de", LEVEL)
    os.makedirs(out, exist_ok=True)
    results = {}
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page()
        for n in range(1, 21):
            r = await pg.goto(f"{BASE}/guia/de/{LEVEL}/{n}", wait_until="networkidle")
            if not r or r.status != 200:
                continue
            await pg.evaluate("document.fonts.ready")
            dest = os.path.join(out, f"{n:02d}.pdf")
            await pg.pdf(path=dest, format="A4", print_background=True, prefer_css_page_size=True)
            results[f"de/{LEVEL}/{n:02d}"] = {"pages": count_pages(dest)}
            print(f"  ✓ {n:02d}: {results[f'de/{LEVEL}/{n:02d}']['pages']} páginas", flush=True)
        await b.close()

    media = os.path.join(ROOT, "src", "content", "generated", "media.ts")
    src = open(media).read()
    m = re.search(r"export const guides: Record<string, \{ pages: number \}> = (\{.*?\});", src, re.S)
    current = json.loads(m.group(1)) if m else {}
    current.update(results)
    line = "export const guides: Record<string, { pages: number }> = " + json.dumps(current, indent=2, sort_keys=True) + ";"
    src = re.sub(r"export const guides: Record<string, \{ pages: number \}> = \{.*?\};", lambda _: line, src, flags=re.S)
    open(media, "w").write(src)


asyncio.run(main())
