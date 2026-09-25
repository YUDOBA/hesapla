from PIL import Image, ImageDraw, ImageFont

def die(d, x, y, s, pips):
    r = max(4, int(s * 0.18))
    d.rounded_rectangle(
        (x - s / 2, y - s / 2, x + s / 2, y + s / 2),
        radius=r, fill='#f4eee4', outline='#1a2744', width=max(2, int(s * 0.08))
    )
    off = {
        5: [(-0.26, -0.26), (0.26, -0.26), (0, 0), (-0.26, 0.26), (0.26, 0.26)],
        2: [(-0.26, -0.26), (0.26, 0.26)],
    }
    pr = max(1.8, s * 0.07)
    for px, py in off[pips]:
        cx, cy = x + px * s, y + py * s
        d.ellipse((cx - pr, cy - pr, cx + pr, cy + pr), fill='#1a2744')

def draw(size=512):
    bg = '#f4eee4'
    im = Image.new('RGB', (size, size), bg)
    d = ImageDraw.Draw(im)
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', int(size * 0.088))
        f2 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', int(size * 0.20))
    except Exception:
        font = ImageFont.load_default()
        f2 = font
    t = 'HESAPLA'
    bb = d.textbbox((0, 0), t, font=font)
    d.text(((size - (bb[2] - bb[0])) / 2, size * 0.10), t, font=font, fill='#1a2744')
    cx = size * 0.50
    cy = size * 0.56
    r = size * 0.30
    d.ellipse((cx - r, cy - r, cx + r, cy + r), outline='#1a2744', width=max(4, size // 42))
    r2 = r * 0.88
    d.arc((cx - r2, cy - r2, cx + r2, cy + r2), 188, 352, fill='#c45a4e', width=max(8, size // 20))
    d.arc((cx - r2, cy - r2, cx + r2, cy + r2), 8, 172, fill='#3a6aa8', width=max(8, size // 20))
    bb = d.textbbox((0, 0), '12', font=f2)
    d.text((cx - (bb[2] - bb[0]) / 2, cy - (bb[3] - bb[1]) / 2 - size * 0.02), '12', font=f2, fill='#1a2744')
    ds = size * 0.145
    die(d, cx - r, cy, ds, 5)
    die(d, cx + r, cy, ds, 2)
    return im

if __name__ == '__main__':
    big = draw(512)
    big.save('icon-512.png', 'PNG')
    big.resize((192, 192), Image.LANCZOS).save('icon-192.png', 'PNG')
    big.resize((180, 180), Image.LANCZOS).save('apple-touch-icon.png', 'PNG')
    print('wrote icons')
