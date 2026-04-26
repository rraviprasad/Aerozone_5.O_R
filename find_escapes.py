import os
import json
import re

env_path = r'c:\Users\ravip\OneDrive\Documents\github\Aerozone_5.O\backend\.env'
with open(env_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for line in lines:
    if line.startswith('GOOGLE_APPLICATION_CREDENTIALS_JSON='):
        json_str = line.split('=', 1)[1].strip()
        # Find all backslashes
        for match in re.finditer(r'\\.', json_str):
            esc = match.group()
            if esc not in ['\\n', '\\"', '\\\\', '\\/', '\\b', '\\f', '\\r', '\\t', '\\u']:
                print(f"Invalid escape found: {esc} at position {match.start()}")
