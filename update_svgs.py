import re

with open('c:/Users/cambl/vinsmiles/treatments.html', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    'treatments/smiledesigning.webp',
    'treatments/conservative-dentistry.webp',
    'treatments/conservative-dentistry.webp',
    'treatments/smiledesigning.webp',
    'treatments/dental-implants.webp',
    'treatments/dental-implants.webp',
    'treatments/Prosthodontics.webp',
    'treatments/fullmouthrehabiliation.webp',
    'treatments/orthodontics.webp',
    'treatments/orthodontics.webp',
    'treatments/orthodontics.webp',
    'treatments/Periodontics.webp',
    'treatments/Periodontics.webp',
    'treatments/Endodontics.webp',
    'treatments/oralandmaxillofacialsurgery.jpg'
]

matches = list(re.finditer(r'svg:\s*`.*?`', content, re.DOTALL))
if len(matches) == 15:
    print('Found exactly 15 matches')
    new_content = content
    for i in range(14, -1, -1):
        m = matches[i]
        start, end = m.span()
        new_content = new_content[:start] + f"image: '{replacements[i]}'" + new_content[end:]
    with open('c:/Users/cambl/vinsmiles/treatments.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
else:
    print(f'Found {len(matches)} matches, expected 15')
