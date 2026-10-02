import os

filepath = 'src/components/Lobby.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# The string that was accidentally duplicated everywhere
button_str = '<button type="button" onClick={() => setShowSettings(!showSettings)} className="fixed bottom-4 right-4 z-50 p-3 bg-white border border-duo-gray-dark rounded-full shadow-lg text-duo-dark hover:bg-duo-gray"><Settings className="w-5 h-5" /></button>\n'

# It might not have the \n if it was replaced inline on a single line, but my sed was:
# s/    <\/div>/      <button ...>\n    <\/div>/

bad_replacement = '      <button type="button" onClick={() => setShowSettings(!showSettings)} className="fixed bottom-4 right-4 z-50 p-3 bg-white border border-duo-gray-dark rounded-full shadow-lg text-duo-dark hover:bg-duo-gray"><Settings className="w-5 h-5" /></button>\n    </div>'

# We replace the bad replacement back to just '    </div>'
content = content.replace(bad_replacement, '    </div>')

# Just in case there are inline ones without the \n prefix/suffix:
single_button = '<button type="button" onClick={() => setShowSettings(!showSettings)} className="fixed bottom-4 right-4 z-50 p-3 bg-white border border-duo-gray-dark rounded-full shadow-lg text-duo-dark hover:bg-duo-gray"><Settings className="w-5 h-5" /></button>'
content = content.replace(single_button, '')

# Now, we insert exactly ONE button at the very end.
# We find the LAST occurrence of '</div>\n  );\n}' and replace it.

end_tag = '</div>\n  );\n}'
if end_tag in content:
    content = content.replace(end_tag, '  ' + single_button + '\n    ' + end_tag)
else:
    print("Could not find the end tag. Appending manually.")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed the duplicate settings buttons.")
