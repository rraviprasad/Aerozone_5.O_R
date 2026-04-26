import os
import json
import re

env_path = r'c:\Users\ravip\OneDrive\Documents\github\Aerozone_5.O\backend\.env'
with open(env_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Pattern to find backslash followed by anything except 'n', '"', '\'
matches = re.findall(r'\\([^n"\\])', text)
print(f"Strange escapes: {matches}")
