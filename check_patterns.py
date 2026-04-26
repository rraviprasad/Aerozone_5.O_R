import os

env_path = r'c:\Users\ravip\OneDrive\Documents\github\Aerozone_5.O\backend\.env'
with open(env_path, 'rb') as f:
    text = f.read()

print(f"HQ+vHQ+v count: {text.count(b'HQ+vHQ+v')}")
print(f"\\\\nnZ8Nx6bA count: {text.count(b'\\\\nnZ8Nx6bA')}")
print(f"\\\\nXCqlS273 count: {text.count(b'\\\\nXCqlS273')}")
