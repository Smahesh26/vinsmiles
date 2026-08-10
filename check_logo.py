import re, glob

for f in glob.glob('*.html'):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    matches = re.findall(r'<a href="index\.html" class="nav-logo">.*?<img src="images/VinSmiles\.png" alt=""[^>]*>', content, re.DOTALL)
    if matches:
        print(f'{f}: {matches[0].strip()}')
