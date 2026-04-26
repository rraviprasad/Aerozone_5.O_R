import os
import json

env_path = r'c:\Users\ravip\OneDrive\Documents\github\Aerozone_5.O\backend\.env'
with open(env_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for line in lines:
    if line.startswith('GOOGLE_APPLICATION_CREDENTIALS_JSON='):
        json_str = line.split('=', 1)[1].strip()
        try:
            json.loads(json_str)
            print("JSON is valid")
        except json.JSONDecodeError as e:
            print(f"JSON validation failed: {e}")
            print(f"Error at position {e.pos}: {json_str[max(0, e.pos-20):e.pos+20]}")
