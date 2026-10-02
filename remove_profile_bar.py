import os

filepath = 'src/components/Lobby.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if "{/* Student Profile Bar */}" in line:
        start_idx = i
        break

if start_idx != -1:
    depth = 0
    # The div starts at start_idx + 1
    for i in range(start_idx + 1, len(lines)):
        line = lines[i]
        if "<div" in line:
            depth += line.count("<div")
        if "</div" in line:
            depth -= line.count("</div")
        
        if depth == 0:
            end_idx = i
            break

if start_idx != -1 and end_idx != -1:
    new_lines = lines[:start_idx] + lines[end_idx+1:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print(f"Successfully removed Student Profile Bar (lines {start_idx} to {end_idx})")
else:
    print(f"Could not find start/end {start_idx} {end_idx}")
