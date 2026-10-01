import json
from pathlib import Path

recipes_folder = Path("recipes")
recipes = []

for file in recipes_folder.glob("*.md"):
    title = file.stem

    recipes.append({
        "title": title,
        "file": file.name
    })

recipes.sort(key=lambda recipe: recipe["title"].lower())

with open("recipes.json", "w", encoding="utf-8") as f:
    json.dump(recipes, f, ensure_ascii=False, indent=4)

print(f"Generate {len(recipes)} recipes.")