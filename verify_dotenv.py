from dotenv import load_dotenv
import os
import json

env_path = r'c:\Users\ravip\OneDrive\Documents\github\Aerozone_5.O\backend\.env'
load_dotenv(env_path)

creds = os.getenv('GOOGLE_APPLICATION_CREDENTIALS_JSON')
if creds:
    print(f"Creds length: {len(creds)}")
    try:
        json.loads(creds)
        print("JSON is valid in environment")
    except Exception as e:
        print(f"JSON invalid in environment: {e}")
        print(f"Creds start: {creds[:100]}")
        print(f"Creds end: {creds[-100:]}")
else:
    print("Creds not found in environment")
