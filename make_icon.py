from PIL import Image, ImageDraw, ImageFont

def die(d, x, y, s, pips):
    r = max(3, s // 8)
    d.rounded_rectangle((x - s / 2, y - s / 2, x + s / 2, y + s / 2), radius=r, outline='#1a2744', width=max(2, s // 16))
    off = {
        5: [(-0.28, -0.28), (0.28, -0.28), (0, 0), (-0.28, 0.28), (0.28, 0.28)],
        2: [(-0.28, -0.28), (0.28, 0.28)],
        6: [(-0.28, -0.32), (0.28, -0.32), (-0.28, 0), (0.28, 0), (-0.28, 0.32), (0.28, 0.32)],
    }
    pr = max(1.6, s * 0.07)
    for px, py in off.get(pips, off[5]):
        cx, cy = x + px * s, y + py * s
        d.ellipse((cx - pr, cy - pr, cx + pr, cy + pr), fill='#1a2744')

def draw(size=192):
    im = Image.new('RGB', (size, size), '#f6efe3')
    d = ImageDraw.Draw(im)
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', max(16, size // 10))
        f2 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', max(36, size // 4))
    except Exception:
        font = ImageFont.load_default()
        f2 = font
    t = 'HESAPLA'
    bb = d.textbbox((0, 0), t, font=font)
    d.text(((size - (bb[2] - bb[0])) / 2, size * 0.07), t, font=font, fill='#1a2744')
    cx = size * 0.5
    cy = size * 0.58
    r = size * 0.28
    d.ellipse((cx - r, cy - r, cx + r, cy + r), outline='#1a2744', width=max(3, size // 48))
    r2 = r * 0.86
    d.arc((cx - r2, cy - r2, cx + r2, cy + r2), 180, 360, fill='#c45a4e', width=max(5, size // 22))
    d.arc((cx - r2, cy - r2, cx + r2, cy + r2), 0, 180, fill='#3a6aa8', width=max(5, size // 22))
    bb = d.textbbox((0, 0), '12', font=f2)
    d.text((cx - (bb[2] - bb[0]) / 2, cy - (bb[3] - bb[1]) / 2 - size * 0.02), '12', font=f2, fill='#1a2744')
    ds = size * 0.14
    die(d, cx - r * 0.92, cy, ds, 5)
    die(d, cx + r * 0.92, cy, ds, 2)
    return im

if __name__ == '__main__':
    im = draw(192)
    im.save('apple-touch-icon.png', 'PNG')
    im.save('icon-192.png', 'PNG')
    draw(512).save('icon-512.png', 'PNG')
    print('wrote icons')
