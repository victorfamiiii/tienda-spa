#!/usr/bin/env python3
"""
Script auxiliar que genera SVGs de ejemplo a partir de prompts.txt.
No usa IA; crea representaciones SVG simples que incluyen el prompt en el <desc>.
Puedes usar este script para regenerar los SVGs si editas prompts.txt.
"""
import os

BASE = os.path.dirname(__file__)
prompts_path = os.path.join(BASE, 'prompts.txt')
images_dir = os.path.join(BASE, 'images')

if not os.path.exists(images_dir):
    os.makedirs(images_dir)

with open(prompts_path, 'r', encoding='utf-8') as f:
    lines = [l.strip() for l in f.readlines() if l.strip()]

prompts = [l for l in lines if l and l[0].isdigit()==False or l[0].isdigit()]
# we'll pick last 6 prompts (the file contains only our prompts)
prompts = [l for l in lines if l.strip()][:6]

for i,p in enumerate(prompts, start=1):
    svg_path = os.path.join(images_dir, f'product{str(i).zfill(2)}.svg')
    content = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <desc>{p}</desc>
  <rect width="100%" height="100%" fill="#f5f5f5"/>
  <text x="50" y="120" font-size="48" fill="#333">Imagen generada (placeholder)</text>
  <text x="50" y="180" font-size="20" fill="#666">Prompt: {p}</text>
</svg>'''
    with open(svg_path, 'w', encoding='utf-8') as out:
        out.write(content)
    print('Wrote', svg_path)

print('Generados SVGs de ejemplo en images/')
