"""Crea una página de vista previa por reloj en r/<enlace>/ con la foto del reloj.

WhatsApp, Instagram y Facebook no ejecutan JavaScript: para mostrar la foto del reloj al
compartir un enlace necesitan una página con las etiquetas og:image ya escritas. Este script
lee la hoja, guarda una foto liviana de cada reloj en r/img/ y escribe r/<enlace>/index.html,
que muestra la vista previa y lleva al cliente a la página con ese reloj abierto.

Uso: python scripts/vistas_previas.py [archivo.csv]   (sin archivo, lee la Google Sheet)
"""
import csv, hashlib, html, io, json, os, re, shutil, sys, unicodedata, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_cfg = open(os.path.join(ROOT, "config.js"), encoding="utf-8").read()
_m = re.search(r'sitio\s*:\s*"([^"]+)"', _cfg)
SITE = os.environ.get("SITE_URL") or (_m.group(1) if _m else "https://juancamilomendoza.github.io/milock/")
SITE = SITE.rstrip("/") + "/"
OUT = os.path.join(ROOT, "r")
IMG = os.path.join(OUT, "img")
MANIFEST = os.path.join(OUT, "fotos.json")
BG = (247, 244, 238)  # marfil del tema
FORMAT = "800-jpg-v2"  # al cambiar el formato de las fotos, se vuelven a crear todas


def strip(s):
    return unicodedata.normalize("NFD", s or "").encode("ascii", "ignore").decode().lower()


def norm(s):
    return re.sub(r"[^a-z]", "", strip(s))


def slug(*parts):
    # Igual que slug() en assets/app.js: marca-modelo-ref-color sin tildes.
    return re.sub(r"[^a-z0-9]+", "-", strip(" ".join(p for p in parts if p))).strip("-")


COLS = {"marca": "brand", "modelo": "model", "referencia": "ref", "ref": "ref", "color": "color",
        "precio": "price", "descuento": "discount", "dcto": "discount", "oferta": "discount",
        "preventa": "presale", "reserva": "presale", "reservar": "presale", "proximamente": "presale",
        "foto": "photo", "imagen": "photo"}


def config():
    src = open(os.path.join(ROOT, "config.js"), encoding="utf-8").read()
    sheet = re.search(r"spreadsheets/d/([\w-]{20,})", src).group(1)
    m = re.search(r'catalogoPestana\s*:\s*"([^"]*)"', src)
    return sheet, (m.group(1) if m else "LISTA")


def get(url, timeout=30):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (vista previa MILOCK)"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def read_sheet():
    sheet, tab = config()
    urls = [f"https://docs.google.com/spreadsheets/d/{sheet}/export?format=csv",
            f"https://docs.google.com/spreadsheets/d/{sheet}/gviz/tq?tqx=out:csv&headers=1&sheet={urllib.parse.quote(tab)}"]
    for u in urls:
        try:
            rows = list(csv.reader(io.StringIO(get(u).decode("utf-8-sig"))))
            if rows and any(norm(h) == "marca" for h in rows[0]):
                return rows
        except Exception as e:  # noqa: BLE001
            print("No se pudo leer", u, e)
    raise SystemExit("No se pudo leer la hoja")


def products(rows):
    keys = [COLS.get(norm(h)) or ("photo" if re.search("foto|imagen", norm(h)) else None) for h in rows[0]]
    for r in rows[1:]:
        p = {}
        for k, v in zip(keys, r):
            v = (v or "").strip()
            if k and v:
                p[k] = p[k] + "\n" + v if k in p else v
        if p.get("brand") or p.get("model"):
            yield p


def photo_url(u):
    u = (u or "").strip()
    m = re.search(r"drive\.google\.com/(?:file/d/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]+)", u)
    if m:
        return f"https://lh3.googleusercontent.com/d/{m.group(1)}=w1200"
    if re.fullmatch(r"https://lh3\.googleusercontent\.com/d/[\w-]+", u):
        return u + "=w1200"
    return u


def price_text(p):
    n = int(re.sub(r"\D", "", p.get("price", "")) or 0)
    d = p.get("discount", "").replace(",", ".")
    try:
        pct = float(re.sub(r"[^\d.]", "", d) or 0)
    except ValueError:
        pct = 0
    if 0 < pct < 1 and "%" not in d:
        pct *= 100
    if n and 0 < pct < 100:
        n = round(n * (1 - pct / 100))
    return ("$" + f"{n:,}".replace(",", ".")) if n else ""


def save_photo(src, dest):
    from PIL import Image
    im = Image.open(io.BytesIO(get(src, 60))).convert("RGBA")
    box = im.getchannel("A").getbbox()  # quita bordes transparentes, como hace la página
    if box:
        im = im.crop(box)
    im.thumbnail((1000, 1000))
    side = max(im.size) + 120
    canvas = Image.new("RGB", (side, side), BG)
    canvas.paste(im, ((side - im.width) // 2, (side - im.height) // 2), im)
    # Siempre 800x800 y JPG normal (no progresivo): es lo que WhatsApp muestra sin problemas.
    canvas = canvas.resize((800, 800), Image.LANCZOS)
    canvas.save(dest, "JPEG", quality=82, optimize=True)


PAGE = """<!doctype html>
<html lang="es"><head>
<meta charset="utf-8">
<title>{title}</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<meta property="og:type" content="website">
<meta property="og:site_name" content="MILOCK Relojería">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{image}">
<meta property="og:image:secure_url" content="{image}">
<meta property="og:image:type" content="{image_type}">
<meta property="og:image:width" content="{image_size}">
<meta property="og:image:height" content="{image_size}">
<meta property="og:image:alt" content="{name}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="{image}">
<!-- Sin redirección en el HTML: WhatsApp la seguiría y mostraría la página general en vez de este reloj.
     Solo las personas (que sí ejecutan JavaScript) pasan a la página con el reloj abierto. -->
<script>location.replace({target_js});</script>
<style>body{{margin:0;min-height:100vh;display:grid;place-items:center;background:#F7F4EE;color:#14242C;font:16px Montserrat,system-ui,sans-serif}}a{{color:inherit}}</style>
</head><body><p><a href="{target}">Ver {name} en MILOCK</a></p></body></html>
"""


def main():
    rows = list(csv.reader(open(sys.argv[1], encoding="utf-8-sig"))) if len(sys.argv) > 1 else read_sheet()
    os.makedirs(IMG, exist_ok=True)
    try:
        manifest = json.load(open(MANIFEST, encoding="utf-8"))
    except (OSError, ValueError):
        manifest = {}
    seen, new_manifest = set(), {}
    for p in products(rows):
        s = slug(p.get("brand"), p.get("model"), p.get("ref"), p.get("color"))
        if not s or s in seen:
            continue
        seen.add(s)
        name = " ".join(x for x in (p.get("brand", "").strip(), p.get("model", "").strip()) if x)
        photos = [photo_url(u) for u in re.split(r"[\s,;|]+", p.get("photo", "")) if u]
        image, image_type, image_size = SITE + "assets/logos/icono-512.png", "image/png", "512"
        if photos:
            src = photos[0] if re.match(r"https?://", photos[0]) else SITE + photos[0].lstrip("/")
            key = hashlib.sha1((src + FORMAT).encode()).hexdigest()
            dest = os.path.join(IMG, s + "-" + key[:8] + ".jpg")
            if manifest.get(s) == key and os.path.exists(dest):
                new_manifest[s] = key
            else:
                try:
                    save_photo(src, dest)
                    new_manifest[s] = key
                    print("Foto lista:", s)
                except Exception as e:  # noqa: BLE001
                    print("Sin foto para", s, e)
            if s in new_manifest:
                image, image_type, image_size = SITE + "r/img/" + s + "-" + key[:8] + ".jpg", "image/jpeg", "800"
        bits = [price_text(p), p.get("ref") and "Ref. " + p["ref"], p.get("color", "").capitalize()]
        presale = norm(p.get("presale", "")) not in ("", "no")
        tail = "Reserva exclusiva por WhatsApp." if presale else "100% original. Atención personalizada por WhatsApp."
        desc = " · ".join(b for b in bits if b) + ". " + tail
        target = SITE + "?reloj=" + s
        page = PAGE.format(title=html.escape(name + " · MILOCK"), desc=html.escape(desc), url=SITE + "r/" + s + "/",
                           image=html.escape(image), image_type=image_type, image_size=image_size, target=html.escape(target), target_js=json.dumps(target),
                           name=html.escape(name))
        d = os.path.join(OUT, s)
        os.makedirs(d, exist_ok=True)
        with open(os.path.join(d, "index.html"), "w", encoding="utf-8") as f:
            f.write(page)
    # Relojes que ya no están en la hoja: se borran su página y su foto.
    for n in os.listdir(OUT):
        if os.path.isdir(os.path.join(OUT, n)) and n != "img" and n not in seen:
            shutil.rmtree(os.path.join(OUT, n))
    keep = {s + "-" + k[:8] + ".jpg" for s, k in new_manifest.items()}
    for n in os.listdir(IMG):
        if n not in keep:
            os.remove(os.path.join(IMG, n))
    with open(MANIFEST, "w", encoding="utf-8") as f:
        json.dump(new_manifest, f, indent=0, sort_keys=True)
    print(len(seen), "relojes con vista previa")


if __name__ == "__main__":
    main()
