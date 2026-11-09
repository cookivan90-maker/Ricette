import json
import re
from pathlib import Path

recipes_folder = Path("recipes")
recipes = []


def read_categories(text):
    """Legge il commento <!-- categoria: ... --> in cima al file."""
    match = re.search(r"<!--\s*categori[ae]\s*:\s*(.*?)\s*-->", text, re.IGNORECASE)

    if not match:
        return []

    return [c.strip() for c in match.group(1).split(",") if c.strip()]


for file in recipes_folder.glob("*.md"):
    text = file.read_text(encoding="utf-8")
    categories = read_categories(text) or ["Altro"]

    recipes.append({
        "title": file.stem,
        "file": file.name,
        "categories": categories
    })

recipes.sort(key=lambda recipe: recipe["title"].lower())

with open("recipes.json", "w", encoding="utf-8") as f:
    json.dump(recipes, f, ensure_ascii=False, indent=4)

print(f"Generate {len(recipes)} recipes.")
