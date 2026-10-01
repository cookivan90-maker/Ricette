const searchInput = document.getElementById("search-input");
const recipeList = document.querySelector(".recipe-list");

let recipes = [];

function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function renderRecipes(list) {
    recipeList.innerHTML = "";

    if (list.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "no-results";
        emptyMessage.textContent = "Nessuna ricetta trovata.";
        recipeList.appendChild(emptyMessage);
        return;
    }

    list.forEach(recipe => {
        const link = document.createElement("a");

        link.href = `recipe.html?recipe=${encodeURIComponent(recipe.file)}`;
        link.textContent = recipe.title;

        recipeList.appendChild(link);
    });
}

fetch("recipes.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Impossibile caricare recipes.json");
        }

        return response.json();
    })
    .then(data => {
        recipes = data.sort((a, b) =>
            a.title.localeCompare(b.title, "it")
        );

        renderRecipes(recipes);

        if (searchInput) {
            searchInput.addEventListener("input", () => {
                const searchTerm = normalizeText(searchInput.value.trim());

                const filteredRecipes = recipes.filter(recipe =>
                    normalizeText(recipe.title).includes(searchTerm)
                );

                renderRecipes(filteredRecipes);
            });
        }
    })
    .catch(error => {
        recipeList.innerHTML =
            "<p>Errore nel caricamento delle ricette.</p>";

        console.error(error);
    });