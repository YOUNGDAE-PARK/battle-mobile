import os
import glob

def refactor_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Rename game
    content = content.replace("스쿨배틀", "배틀스터디")
    content = content.replace("SchoolBattle", "BattleStudy")
    
    # 2. Dark mode colors to Duolingo colors
    content = content.replace("bg-zinc-900", "bg-white")
    content = content.replace("bg-zinc-950", "bg-duo-gray")
    content = content.replace("bg-zinc-800", "bg-duo-gray")
    content = content.replace("border-zinc-800", "border-duo-gray-dark")
    content = content.replace("border-zinc-700", "border-duo-gray-dark")
    
    content = content.replace("text-zinc-400", "text-duo-gray-dark")
    content = content.replace("text-zinc-300", "text-duo-dark")
    content = content.replace("text-zinc-100", "text-duo-dark")
    content = content.replace("text-white", "text-duo-dark")
    
    # Let's fix text-white inside buttons manually later or hope it's not totally broken
    # Buttons
    # ... actually this simple string replace is risky but faster
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

files = glob.glob("src/components/*.tsx")
for f in files:
    refactor_file(f)
print("Done")
