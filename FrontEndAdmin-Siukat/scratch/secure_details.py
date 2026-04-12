import os
import re

details_dir = r'c:\Project Coding Syafikh\ProjectSiukat\FrontEndAdmin-Siukat\src\views\pages\peserta\details'
files = [
    'Pribadi.js', 'Ayah.js', 'Ibu.js', 'Wali.js', 'Rumah.js', 'Listrik.js', 'Kendaraan.js', 'Pendukung.js'
]

# Patterns to find the edit buttons
# pribadI: <button onClick={this.modalToggle} ...> ... </button>
# others usually have similar structure
button_pattern = r'(<button\s+onClick=\{this\.modalToggle\}[^>]*>.*?</button>)'

for filename in files:
    filepath = os.path.join(details_dir, filename)
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        continue
        
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Check if this.props.editable is already being used or handle with ternary
    if 'this.props.editable' not in content and 'editable' not in content:
         print(f"Warning: {filename} does not seem to use 'editable' prop yet")

    new_content = re.sub(button_pattern, r'{this.props.editable && (\1)}', content, flags=re.DOTALL)
    
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated: {filename}")
    else:
        print(f"No changes for: {filename} (Button not found or already wrapped)")
