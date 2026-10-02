import glob

def fix_contrast(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Change unreadable light gray text to standard dark text
    content = content.replace("text-duo-gray-dark", "text-duo-dark")
    
    # Change backgrounds that use the border color (duo-gray-dark) to the standard gray
    content = content.replace("bg-duo-gray-dark", "bg-duo-gray")

    # If there are any text-slate-300 or similar that I missed
    content = content.replace("text-slate-400", "text-slate-500") # slate-500 is readable gray
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for f in glob.glob("src/components/*.tsx") + glob.glob("src/app/*.tsx"):
    fix_contrast(f)
