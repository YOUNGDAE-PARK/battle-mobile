import os
import glob
import re

def fix_slate(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Backgrounds
    content = re.sub(r'bg-slate-[89]00(?:/[0-9]+)?', 'bg-white', content)
    content = re.sub(r'bg-slate-950(?:/[0-9]+)?', 'bg-duo-gray', content)
    content = re.sub(r'bg-slate-850(?:/[0-9]+)?', 'bg-duo-gray', content)
    content = re.sub(r'bg-slate-[67]00(?:/[0-9]+)?', 'bg-duo-gray-dark', content)
    
    # Text
    content = re.sub(r'text-slate-[1234]00(?:/[0-9]+)?', 'text-duo-dark', content)
    content = re.sub(r'text-slate-[56]00(?:/[0-9]+)?', 'text-duo-gray-dark', content)
    content = re.sub(r'text-slate-[789]00(?:/[0-9]+)?', 'text-duo-dark', content)
    content = re.sub(r'text-slate-950(?:/[0-9]+)?', 'text-duo-dark', content)

    # Borders
    content = re.sub(r'border-slate-[789]00(?:/[0-9]+)?', 'border-duo-gray-dark', content)
    content = re.sub(r'border-slate-850(?:/[0-9]+)?', 'border-duo-gray-dark', content)
    content = re.sub(r'border-slate-[1234]00(?:/[0-9]+)?', 'border-duo-gray-dark', content)
    
    # Ring
    content = re.sub(r'ring-slate-[789]00(?:/[0-9]+)?', 'ring-duo-gray-dark', content)

    # Some remaining bg-black
    content = re.sub(r'bg-black(?:/[0-9]+)?', 'bg-duo-gray', content)

    # Change default container wrappers
    # Wait, LandingPage used `duo-card` for cards, `btn-duo-primary` for buttons. 
    # That is harder with regex, but at least getting rid of slate fixes the blackness.

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for f in glob.glob("src/components/*.tsx") + glob.glob("src/app/*.tsx"):
    fix_slate(f)
print("Slate fixed")
