from PIL import Image, ImageDraw, ImageFont

def draw(size=192):
    im = Image.new('RGB', (size, size), '#f6efe3')
    d = ImageDraw.Draw(im)
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', max(14, size // 11))
        f2 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', max(28, size // 5))
    except Exception:
        font = ImageFont.load_default()
        f2 = font
    t = 'HESAPLA'
    bb = d.textbbox((0, 0), t, font=font)
    d.text(((size - (bb[2] - bb[0])) / 2, size * 0.08), t, font=font, fill='#1a2744')
    cx = cy = size * 0.58
    r = size * 0.30
    d.ellipse((cx - r, cy - r, cx + r, cy + r), outline='#1a2744', width=max(3, size // 48))
    inner = r * 0.90
    d.arc((cx - inner, cy - inner, cx + inner, cy + inner), 180, 360, fill='#c45a4e', width=max(6, size // 24))
    d.arc((cx - inner, cy - inner, cx + inner, cy + inner), 0, 180, fill='#3a6aa8', width=max(6, size // 24))
    bb = d.textbbox((0, 0), '12', font=f2)
    d.text((cx - (bb[2] - bb[0]) / 2, cy - (bb[3] - bb[1]) / 2 - size * 0.02), '12', font=f2, fill='#1a2744')
    return im

if __name__ == '__main__':
    im = draw(192)
    im.save('apple-touch-icon.png', 'PNG')
    im.save('icon-192.png', 'PNG')
    draw(512).save('icon-512.png', 'PNG')
    print('wrote icons')
