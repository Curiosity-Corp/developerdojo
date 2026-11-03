"""Feather the outer edges of public/images/pagoda-cliff.* so the baked-in mist never ends in a hard rectangle.

Usage: python3 tools/imagery/feather.py   (run on the PNG master; writes png, webp, avif)
Idempotent: always re-derives from public/images/pagoda-cliff.src.png if present, else keeps a copy first.
"""
import shutil
from pathlib import Path
from PIL import Image

IMG = Path(__file__).resolve().parents[2] / 'public' / 'images'
SRC = Path(__file__).resolve().parent / 'pagoda-cliff.src.png'
OUT = IMG / 'pagoda-cliff'


def smooth(t: float) -> float:
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)


def main() -> None:
    if not SRC.exists():
        shutil.copy(OUT.with_suffix('.png'), SRC)
    im = Image.open(SRC).convert('RGBA')
    w, h = im.size
    px = im.load()
    fx, ftop, fbot = 0.28 * w, 0.14 * h, 0.14 * h
    for y in range(h):
        ky = min(smooth(y / ftop), smooth((h - 1 - y) / fbot))
        for x in range(w):
            kx = min(smooth(x / fx), smooth((w - 1 - x) / fx))
            r, g, b, a = px[x, y]
            px[x, y] = (r, g, b, round(a * kx * ky))
    im.save(OUT.with_suffix('.png'), optimize=True)
    im.save(OUT.with_suffix('.webp'), quality=88, method=6)
    im.save(OUT.with_suffix('.avif'), quality=70)


main()
