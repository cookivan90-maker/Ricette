import json
from pathlib import Path

recipes_folder = Path("recipes")
recipes = []


def read_categories(text):
    """Legge la riga 'categoria:' dall'intestazione tra --- in cima al file."""
    lines = text.lstrip("﻿").splitlines()

    if not lines or lines[0].strip() != "---":
        return []

    for line in lines[1:]:
        if line.strip() == "---":
            break

        key, _, value = line.partition(":")

        if key.strip().lower() in ("categoria", "categorie"):
            return [c.strip() for c in value.split(",") if c.strip()]

    return []


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
