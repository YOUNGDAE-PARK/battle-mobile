import os

filepath = 'src/components/BattleArena.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = '''className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black text-7xl md:text-8xl pointer-events-none select-none ${
            "text-duo-dark/5"
          }`}'''

replacement = 'className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black text-7xl md:text-8xl pointer-events-none select-none text-duo-dark/5"'

content = content.replace(target, replacement)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
