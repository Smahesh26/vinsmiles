import re, glob

for f in glob.glob('*.html'):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # We will replace both the 120px and 90px versions
    # The 120px version might have a newline before `style=` in some files like index.html
    
    def replacer(match):
        return r'<img src="images/VinSmiles.png" alt="" style="height: 160px; width: auto; object-fit: contain; margin-top: -30px; margin-bottom: -30px;">'
        
    new_content = re.sub(
        r'<img src="images/VinSmiles\.png" alt=""\s*style="height: (?:120px|90px); width: auto; object-fit: contain; margin-top: (?:-10px|-8px); margin-bottom: (?:-10px|-8px);">',
        replacer,
        content
    )
    
    if new_content != content:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f"Updated {f}")
