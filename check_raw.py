import os

env_path = r'c:\Users\ravip\OneDrive\Documents\github\Aerozone_5.O\backend\.env'
with open(env_path, 'rb') as f:
    content = f.read()

# Find the start of the JSON
idx = content.find(b'GOOGLE_APPLICATION_CREDENTIALS_JSON=')
if idx != -1:
    val = content[idx + len(b'GOOGLE_APPLICATION_CREDENTIALS_JSON='):]
    # Print first 200 and characters around suspected positions
    print(f"Start: {val[:100]}")
    # Search for \k
    k_idx = val.find(b'\\k')
    if k_idx != -1:
        print(f"Found \\k at {k_idx}: {val[k_idx-20:k_idx+20]}")
    else:
        print("\\k not found in raw bytes")
    
    x_idx = val.find(b'\\x')
    if x_idx != -1:
        print(f"Found \\x at {x_idx}: {val[x_idx-20:x_idx+20]}")
    else:
        print("\\x not found in raw bytes")
else:
    print("Variable not found")
