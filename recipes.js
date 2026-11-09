const searchInput = document.getElementById("search-input");
const recipeList = document.querySelector(".recipe-list");
const listHeading = document.getElementById("list-heading");

// Ordine in cui compaiono le categorie nel menu.
// Le categorie non presenti qui vengono aggiunte in fondo, in ordine alfabetico.
const CATEGORY_ORDER = [
    "Antipasti e secondi",
    "Primi e noodles",
    "Ravioli e dumpling",
    "Zuppe e vellutate",
    "Contorni",
    "Pane e lievitati",
    "Dolci",
    "Salse e conserve",
    "Altro"
];

const params = new URLSearchParams(window.location.search);
const currentCategory = params.get("categoria");

let recipes = [];

function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "");
}

function getCategories(recipe) {
    return recipe.categories && recipe.categories.length
        ? recipe.categories
        : ["Altro"];
}

function showMessage(text) {
    const message = document.createElement("p");
    message.className = "no-results";
    message.textContent = text;
    recipeList.appendChild(message);
}

function setHeading(html) {
    if (!listHeading) return;
    listHeading.innerHTML = html;
    listHeading.hidden = !html;
}

function renderRecipes(list) {
    recipeList.innerHTML = "";

    if (list.length === 0) {
        showMessage("Nessuna ricetta trovata.");
        return;
    }

    list.forEach(recipe => {
        const link = document.createElement("a");

        link.href = `recipe.html?recipe=${encodeURIComponent(recipe.file)}`;
        link.textContent = recipe.title;

        recipeList.appendChild(link);
    });
}

function renderCategories() {
    recipeList.innerHTML = "";

    const counts = {};

    recipes.forEach(recipe => {
        getCategories(recipe).forEach(category => {
            counts[category] = (counts[category] || 0) + 1;
        });
    });

    const categories = Object.keys(counts).sort((a, b) => {
        const ia = CATEGORY_ORDER.indexOf(a);
        const ib = CATEGORY_ORDER.indexOf(b);

        if (ia === -1 && ib === -1) return a.localeCompare(b, "it");
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia - ib;
    });

    categories.forEach((category, index) => {
        const link = document.createElement("a");
        link.className = "category-link";
        link.href = `recipes.html?categoria=${encodeURIComponent(category)}`;

        const number = document.createElement("span");
        number.className = "category-number";
        number.textContent = String(index + 1).padStart(2, "0");

        const name = document.createElement("span");
        name.className = "category-title";
        name.textContent = category;

        link.append(number, name);
        recipeList.appendChild(link);
    });
}

// Vista "normale" (senza ricerca): menu categorie oppure ricette di una categoria
function renderDefaultView() {
    if (currentCategory) {
        const inCategory = recipes.filter(recipe =>
            getCategories(recipe).includes(currentCategory)
        );

        setHeading(
            `<a href="recipes.html" class="category-back">← TUTTE LE CATEGORIE</a>` +
            `<span class="category-name"></span>`
        );
        listHeading.querySelector(".category-name").textContent = currentCategory;

        renderRecipes(inCategory);
    } else {
        setHeading(`<span class="category-name">CATEGORIE</span>`);
        renderCategories();
    }
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

        renderDefaultView();

        if (searchInput) {
            searchInput.addEventListener("input", () => {
                const searchTerm = normalizeText(searchInput.value.trim());

                // Barra vuota: si torna al menu (o alla categoria aperta)
                if (!searchTerm) {
                    renderDefaultView();
                    return;
                }

                // La ricerca cerca sempre in tutte le ricette
                const filteredRecipes = recipes.filter(recipe =>
                    normalizeText(recipe.title).includes(searchTerm)
                );

                setHeading(`<span class="category-name">RISULTATI</span>`);
                renderRecipes(filteredRecipes);
            });
        }
    })
    .catch(error => {
        recipeList.innerHTML =
            "<p>Errore nel caricamento delle ricette.</p>";

        console.error(error);
    });
