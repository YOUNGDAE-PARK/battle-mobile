import glob
import re

def fix_neon_to_duo(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Colors -> Duo colors
    # Text
    content = re.sub(r'text-cyan-[3456]00', 'text-duo-blue', content)
    content = re.sub(r'text-blue-[3456]00', 'text-duo-blue', content)
    content = re.sub(r'text-indigo-[3456]00', 'text-duo-blue', content)
    
    content = re.sub(r'text-red-[3456]00', 'text-duo-red', content)
    content = re.sub(r'text-rose-[3456]00', 'text-duo-red', content)
    
    content = re.sub(r'text-emerald-[3456]00', 'text-duo-green', content)
    content = re.sub(r'text-green-[3456]00', 'text-duo-green', content)
    
    content = re.sub(r'text-yellow-[3456]00', 'text-duo-yellow', content)
    content = re.sub(r'text-amber-[3456]00', 'text-duo-yellow', content)
    
    content = re.sub(r'text-purple-[3456]00', 'text-duo-dark', content)

    # Backgrounds
    content = re.sub(r'bg-cyan-[456]00', 'bg-duo-blue', content)
    content = re.sub(r'bg-blue-[456]00', 'bg-duo-blue', content)
    content = re.sub(r'bg-indigo-[456]00', 'bg-duo-blue', content)
    
    content = re.sub(r'bg-red-[456]00', 'bg-duo-red', content)
    content = re.sub(r'bg-rose-[456]00', 'bg-duo-red', content)
    
    content = re.sub(r'bg-emerald-[456]00', 'bg-duo-green', content)
    content = re.sub(r'bg-green-[456]00', 'bg-duo-green', content)
    
    content = re.sub(r'bg-yellow-[456]00', 'bg-duo-yellow', content)
    content = re.sub(r'bg-amber-[456]00', 'bg-duo-yellow', content)
    
    content = re.sub(r'bg-purple-[456]00', 'bg-duo-gray', content)

    # Borders
    content = re.sub(r'border-cyan-[3456]00(?:/[0-9]+)?', 'border-duo-blue', content)
    content = re.sub(r'border-blue-[3456]00(?:/[0-9]+)?', 'border-duo-blue', content)
    content = re.sub(r'border-indigo-[3456]00(?:/[0-9]+)?', 'border-duo-blue', content)
    
    content = re.sub(r'border-red-[3456]00(?:/[0-9]+)?', 'border-duo-red', content)
    content = re.sub(r'border-rose-[3456]00(?:/[0-9]+)?', 'border-duo-red', content)
    
    content = re.sub(r'border-emerald-[3456]00(?:/[0-9]+)?', 'border-duo-green', content)
    content = re.sub(r'border-green-[3456]00(?:/[0-9]+)?', 'border-duo-green', content)
    
    content = re.sub(r'border-yellow-[3456]00(?:/[0-9]+)?', 'border-duo-yellow', content)
    content = re.sub(r'border-amber-[3456]00(?:/[0-9]+)?', 'border-duo-yellow', content)
    
    # Remove neon glowing classes like drop-shadow-[0_0_...], shadow-cyan, etc.
    content = re.sub(r'drop-shadow-\[[^\]]+\]', '', content)
    content = re.sub(r'shadow-(cyan|indigo|blue|red|rose|emerald|green|yellow|amber|purple)-[0-9]{3}(/[0-9]+)?', 'shadow-sm', content)
    
    # Text glow (e.g. drop-shadow-md for text)
    content = content.replace("drop-shadow-md", "")
    content = content.replace("drop-shadow-lg", "")
    
    # Rings
    content = re.sub(r'ring-(cyan|indigo|blue|red|rose|emerald|green|yellow|amber|purple)-[0-9]{3}(/[0-9]+)?', 'ring-duo-blue', content)

    # Gradients remaining
    content = re.sub(r'from-(cyan|indigo|blue|red|rose|emerald|green|yellow|amber|purple)-[0-9]{3}', 'from-white', content)
    content = re.sub(r'to-(cyan|indigo|blue|red|rose|emerald|green|yellow|amber|purple)-[0-9]{3}', 'to-duo-gray', content)
    content = re.sub(r'via-(cyan|indigo|blue|red|rose|emerald|green|yellow|amber|purple)-[0-9]{3}', 'via-duo-gray', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for f in glob.glob("src/components/*.tsx") + glob.glob("src/app/*.tsx"):
    fix_neon_to_duo(f)

print("Neon fixed")
