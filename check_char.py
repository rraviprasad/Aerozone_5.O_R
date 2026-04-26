from dotenv import load_dotenv
import os
import json

env_path = r'c:\Users\ravip\OneDrive\Documents\github\Aerozone_5.O\backend\.env'
load_dotenv(env_path)

creds = os.getenv('GOOGLE_APPLICATION_CREDENTIALS_JSON')
if creds:
    print(f"Char at 1353: {creds[1353]}")
    print(f"Around 1353: {creds[1353-20:1353+20]}")
    # Search for any backslashes in the string itself
    print(f"Backslash indices: {[i for i, c in enumerate(creds) if c == '\\']}")
