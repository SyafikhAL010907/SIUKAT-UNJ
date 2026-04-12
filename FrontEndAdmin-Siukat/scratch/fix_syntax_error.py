import os
import re

details_dir = r'c:\Project Coding Syafikh\ProjectSiukat\FrontEndAdmin-Siukat\src\views\pages\peserta\details'
files = [
    'Ayah.js', 'Ibu.js', 'Wali.js', 'Rumah.js', 'Listrik.js', 'Kendaraan.js', 'Pendukung.js'
]

# Pattern to find the nested braces issue
# { isModeSanggah && (
#    {this.props.editable && (<button onClick={this.modalToggle} ...> ... </button>)}
# )}
nested_pattern = r'\{\s*isModeSanggah\s*&&\s*\(\s*\{\s*this\.props\.editable\s*&&\s*\((<button\s+onClick=\{this\.modalToggle\}[^>]*>.*?</button>)\s*)\}\s*\)\s*\}'

for filename in files:
    filepath = os.path.join(details_dir, filename)
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        continue
        
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Replacement: Merge the conditions and remove the extra braces
    new_content = re.sub(nested_pattern, r'{isModeSanggah && this.props.editable && (\1)}', content, flags=re.DOTALL)
    
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Fixed: {filename}")
    else:
        # Try a more flexible pattern if the first one fails
        flexible_pattern = r'\{\s*isModeSanggah\s*&&\s*\(\s*\{\s*this\.props\.editable\s*&&\s*(<button.*?/button>)\s*\}\s*\)\s*\}'
        new_content = re.sub(flexible_pattern, r'{isModeSanggah && this.props.editable && (\1)}', content, flags=re.DOTALL)
        if new_content != content:
            with open(filepath, 'w') as f:
                f.write(new_content)
            print(f"Fixed (flexible): {filename}")
        else:
            print(f"No changes for: {filename} (Pattern not found)")
