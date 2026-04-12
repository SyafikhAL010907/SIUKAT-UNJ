import os
import re

files_to_update = [
    'wali.go', 'rumah.go', 'listrik.go', 'kendaraan.go', 'pendukung.go', 'ukt.go'
]

routes_dir = r'c:\Project Coding Syafikh\ProjectSiukat\BackEnd-Siukat\routes'

# Search patterns for POST/PUT routes
# Looks for: authGroup.POST("/...", func(c *gin.Context)
# Replaces with: authGroup.POST("/...", middlewares.RoleAuth("developer", "operator"), func(c *gin.Context)
patterns = [
    (r'(authGroup\.(POST|PUT)\("(/[^"]*)"\),\s*func\(c \*gin\.Context\))', r'authGroup.\2("\3", middlewares.RoleAuth("developer", "operator"), func(c *gin.Context))'),
    (r'(authGroup\.(POST|PUT)\("(/[^"]*)"\)\s*func\(c \*gin\.Context\))', r'authGroup.\2("\3", middlewares.RoleAuth("developer", "operator"), func(c *gin.Context))')
]

# Specifically handle "authGroup.POST("/add", func(c *gin.Context) {"
specific_pattern = r'(authGroup\.(POST|PUT)\("([^"]+)",?\s*)func'
replacement = r'\1middlewares.RoleAuth("developer", "operator"), func'

for filename in files_to_update:
    filepath = os.path.join(routes_dir, filename)
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        continue
        
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Apply replacement
    new_content = re.sub(specific_pattern, replacement, content)
    
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated: {filename}")
    else:
        print(f"No changes for: {filename} (Pattern match failed)")
