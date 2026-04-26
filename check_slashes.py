import os

env_path = r'c:\Users\ravip\OneDrive\Documents\github\Aerozone_5.O\backend\.env'
with open(env_path, 'rb') as f:
    text = f.read()

indices = [i for i, b in enumerate(text) if b == ord('\\')]
print(f"Total backslashes: {len(indices)}")
for idx in indices:
    print(f"Backslash at {idx}: {text[idx:idx+10]}")
