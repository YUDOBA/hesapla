from PIL import Image, ImageDraw, ImageFont

def die(d, x, y, s, pips):
    half = s / 2.0
    d.rectangle((x - half, y - half, x + half, y + half), fill='#ffffff', outline='#1a2744', width=max(3, int(s * 0.1)))
    spots = {
        5: [(-0.28, -0.28), (0.28, -0.28), (0.0, 0.0), (-0.28, 0.28), (0.28, 0.28)],
        2: [(-0.28, -0.28), (0.28, 0.28)],
    }
    pr = max(2.2, s * 0.08)
    for px, py in spots[pips]:
        sx = x + px * s
        sy = y + py * s
        d.ellipse((sx - pr, sy - pr, sx + pr, sy + pr), fill='#1a2744')

def draw(size=512):
    im = Image.new('RGB', (size, size), '#f4eee4')
    d = ImageDraw.Draw(im)
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', int(size * 0.09))
        f2 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', int(size * 0.20))
    except Exception:
        font = ImageFont.load_default()
        f2 = font
    title = 'HESAPLA'
    bb = d.textbbox((0, 0), title, font=font)
    d.text(((size - (bb[2] - bb[0])) / 2.0, size * 0.10), title, font=font, fill='#1a2744')
    cx = size * 0.5
    cy = size * 0.56
    r = size * 0.29
    d.ellipse((cx - r, cy - r, cx + r, cy + r), outline='#1a2744', width=max(4, size // 40))
    r2 = r * 0.86
    d.arc((cx - r2, cy - r2, cx + r2, cy + r2), 180, 360, fill='#c45a4e', width=max(8, size // 18))
    d.arc((cx - r2, cy - r2, cx + r2, cy + r2), 0, 180, fill='#3a6aa8', width=max(8, size // 18))
    bb = d.textbbox((0, 0), '12', font=f2)
    d.text((cx - (bb[2] - bb[0]) / 2.0, cy - (bb[3] - bb[1]) / 2.0 - size * 0.02), '12', font=f2, fill='#1a2744')
    ds = size * 0.17
    die(d, cx - r, cy, ds, 5)
    die(d, cx + r, cy, ds, 2)
    return im

if __name__ == '__main__':
    big = draw(512)
    big.save('icon-512.png', 'PNG')
    big.resize((192, 192), Image.LANCZOS).save('icon-192.png', 'PNG')
    big.resize((180, 180), Image.LANCZOS).save('apple-touch-icon.png', 'PNG')
    print('wrote icons with dice')
