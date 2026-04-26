import os

env_path = r'c:\Users\ravip\OneDrive\Documents\github\Aerozone_5.O\backend\.env'
with open(env_path, 'rb') as f:
    text = f.read()

# Fix 1: Restore k in \knZ -> \nnZ
text = text.replace(b'\\nnZ8Nx6bA', b'\\nknZ8Nx6bA')

# Fix 2: Remove HQ+v repetition
text = text.replace(b'HQ+vHQ+v', b'HQ+v')

with open(env_path, 'wb') as f:
    f.write(text)

print("Applied fixes.")
