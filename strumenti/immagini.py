"""Prepara le immagini del sito in piu' misure (webp + jpg), senza dati EXIF/GPS.
Uso: python3 strumenti/immagini.py <foto-sorgente.jpg> <nome> [larghezze...]"""
import sys
from PIL import Image
src, name = sys.argv[1], sys.argv[2]
widths = [int(w) for w in sys.argv[3:]] or [800, 1400, 2000]
im = Image.open(src).convert('RGB')
for w in widths:
    if w > im.width: w = im.width
    r = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    r.save(f'assets/img/{name}-{w}.webp', quality=78, method=6)
    r.save(f'assets/img/{name}-{w}.jpg', quality=80, optimize=True, progressive=True)
print(name, im.size)
