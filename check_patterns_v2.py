import os

env_path = r'c:\Users\ravip\OneDrive\Documents\github\Aerozone_5.O\backend\.env'
with open(env_path, 'rb') as f:
    text = f.read()

# literal \ then n then n then Z ...
p1 = b'\\nnZ8Nx6bA'
print(f"p1 count: {text.count(p1)}")

# literal \ then n then X ...
p2 = b'\\nXCqlS273'
print(f"p2 count: {text.count(p2)}")

# repetition
p3 = b'HQ+vHQ+v'
print(f"p3 count: {text.count(p3)}")
