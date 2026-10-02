import glob
import re

def fix_gradients(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # BattleArena gradient
    content = content.replace("from-slate-900 via-slate-950 to-black opacity-90", "from-white via-duo-gray to-duo-gray opacity-50")
    
    # ResultPage gradients
    content = content.replace("from-slate-700 to-slate-900", "from-duo-gray to-duo-gray-dark")
    content = content.replace("from-indigo-300 via-white to-cyan-300", "from-duo-blue via-duo-blue-dark to-duo-blue")
    content = content.replace("from-white to-slate-400", "from-duo-dark to-duo-gray-dark")
    
    # Other places
    content = re.sub(r'bg-slate-[0-9]+', 'bg-white', content)
    content = content.replace("text-white", "text-duo-dark")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for f in glob.glob("src/components/*.tsx") + glob.glob("src/app/*.tsx"):
    fix_gradients(f)
