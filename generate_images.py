#!/usr/bin/env python3
"""
Script auxiliar que genera imágenes de ejemplo a partir de prompts.txt.
Intenta crear PNGs usando Pillow (PIL). Si Pillow no está instalado, genera SVGs como fallback.
No usa IA; crea marcadores de posición que incluyen el prompt en el texto/desc para facilitar pruebas.
"""
import os
import sys
from textwrap import shorten

BASE = os.path.dirname(__file__)
prompts_path = os.path.join(BASE, 'prompts.txt')
images_dir = os.path.join(BASE, 'images')

if not os.path.exists(images_dir):
    os.makedirs(images_dir)

with open(prompts_path, 'r', encoding='utf-8') as f:
    lines = [l.strip() for l in f.readlines() if l.strip()]

# Extract lines that are prompts (skip the header/instructions)
prompts = []
for line in lines:
    # lines starting with a digit or wrapped in quotes
    if line[0].isdigit() or (line.startswith('"') and line.endswith('"')):
        # remove leading numbering like '1) ' if present
        p = line
        if ')' in p and p.split(')')[0].strip().isdigit():
            p = p.split(')',1)[1].strip()
        # strip quotes
        p = p.strip(' "')
        if p:
            prompts.append(p)

if not prompts:
    print('No se encontraron prompts en prompts.txt. Asegúrate de seguir el formato del archivo.'); sys.exit(1)

# limit to first 6 prompts
prompts = prompts[:6]

use_pil = False
try:
    from PIL import Image, ImageDraw, ImageFont
    use_pil = True
except Exception:
    use_pil = False

for i,p in enumerate(prompts, start=1):
    name_base = f'product{str(i).zfill(2)}'
    # try to write PNG if PIL available
    if use_pil:
        w,h = 1200,800
        img = Image.new('RGB', (w,h), color=(245,245,245))
        draw = ImageDraw.Draw(img)
        try:
            font = ImageFont.truetype('DejaVuSans.ttf', 48)
        except Exception:
            font = ImageFont.load_default()
        title = 'Imagen generada (placeholder)'
        draw.text((50,80), title, fill=(30,30,30), font=font)
        # draw prompt (shortened)
        prompt_short = shorten(p, width=140, placeholder='...')
        draw.text((50,160), f'Prompt: {prompt_short}', fill=(90,90,90), font=ImageFont.load_default())
        png_path = os.path.join(images_dir, f'{name_base}.png')
        img.save(png_path)
        print('Wrote', png_path)
    else:
        # fallback to SVG
        svg_path = os.path.join(images_dir, f'{name_base}.svg')
        content = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <desc>{p}</desc>
  <rect width="100%" height="100%" fill="#f5f5f5"/>
  <text x="50" y="120" font-size="48" fill="#333">Imagen generada (placeholder)</text>
  <text x="50" y="180" font-size="20" fill="#666">Prompt: {p}</text>
</svg>'''
        with open(svg_path, 'w', encoding='utf-8') as out:
            out.write(content)
        print('Wrote', svg_path)

if use_pil:
    print('Generados PNGs de ejemplo en images/ (usa Pillow)')
else:
    print('Pillow no encontrado: generados SVGs de ejemplo en images/ como fallback')

