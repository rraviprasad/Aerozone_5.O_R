import os
import json
import base64

env_path = r'c:\Users\ravip\OneDrive\Documents\github\Aerozone_5.O\backend\.env'
with open(env_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for line in lines:
    if line.startswith('GOOGLE_APPLICATION_CREDENTIALS_JSON='):
        json_str = line.split('=', 1)[1].strip()
        obj = json.loads(json_str)
        pk = obj['private_key']
        # Remove PEM headers and whitespace
        b64 = pk.replace('-----BEGIN PRIVATE KEY-----', '').replace('-----END PRIVATE KEY-----', '').replace('\n', '').replace('\r', '').strip()
        print(f"B64 length: {len(b64)}")
        
        # Check for the known repetition
        if 'HQ+vHQ+v' in b64:
            print("Found HQ+vHQ+v repetition!")
        
        # Split into 64-char chunks and see if any are weird
        for i in range(0, len(b64), 64):
            chunk = b64[i:i+64]
            if len(chunk) != 64 and i + 64 <= len(b64):
                print(f"Chunk at {i} has weird length? {len(chunk)}")
            # Look for repetitions within chunks or across boundaries
            pass
        
        # Try to decode
        try:
            der = base64.b64decode(b64)
            print(f"DER length: {len(der)}")
            # A valid RSA private key is a sequence of integers
            # If it's too long, it might have been doubled.
        except Exception as e:
            print(f"B64 decode failure: {e}")
