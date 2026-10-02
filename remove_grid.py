import re

def remove_4card_grid(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the start of the 4-Card grid
    # It starts with:
    #         {/* 4-Card Grid */}
    #         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    
    start_str = "        {/* 4-Card Grid */}"
    start_idx = content.find(start_str)
    
    if start_idx == -1:
        print("Not found")
        return
        
    # Find the end of this div. The div opens at `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">`
    # We can just count braces/divs or use regex. Since it's exactly 4 cards, we can find the end of Card 4.
    
    end_str = "{/* Main Content Area */}"
    end_idx = content.find(end_str)
    
    if end_idx == -1:
        # Fallback to finding the next major section
        end_str = "        {/* Main Content Area */}"
        end_idx = content.find(end_str)

    if end_idx != -1:
        new_content = content[:start_idx] + content[end_idx:]
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Removed 4-Card Grid successfully")
    else:
        print("Could not find end index")

remove_4card_grid("src/components/Lobby.tsx")
