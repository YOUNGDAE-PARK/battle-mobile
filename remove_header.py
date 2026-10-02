import os

filepath = 'src/components/Lobby.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if "{/* Header bar */}" in line:
        start_idx = i
        break

if start_idx != -1:
    depth = 0
    for i in range(start_idx + 1, len(lines)):
        line = lines[i]
        if "<header" in line:
            depth += line.count("<header")
        if "</header>" in line:
            depth -= line.count("</header>")
        
        if depth <= 0 and "</header>" in line:
            end_idx = i
            break

if start_idx != -1 and end_idx != -1:
    new_lines = lines[:start_idx] + lines[end_idx+1:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print(f"Successfully removed Header from Lobby.tsx (lines {start_idx} to {end_idx})")
else:
    print(f"Could not find start/end {start_idx} {end_idx}")
