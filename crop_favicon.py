from PIL import Image
import os

path = r"c:\Users\gmara\OneDrive\Desktop\Directory Dev\Teknovra - Smart Analysis System\src\imports\logo_teknovra.png"
out_path = r"c:\Users\gmara\OneDrive\Desktop\Directory Dev\Teknovra - Smart Analysis System\public\favicon.ico"

img = Image.open(path).convert("RGBA")
bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)

# The logogram is on the left. We assume it's roughly square.
h = img.height
# Crop a square from the left
logogram = img.crop((0, 0, h, h))

logogram.save(out_path, format='ICO', sizes=[(32, 32), (64, 64)])
print("Favicon saved to", out_path)
