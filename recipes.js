fetch("recipes.json")
    .then(response => response.json())
    .then(recipes => {

        recipes.sort((a, b) =>
            a.title.localeCompare(b.title, "it")
        );

        const list = document.querySelector(".recipe-list");

        recipes.forEach(recipe => {

            const link = document.createElement("a");

            link.href = `recipe.html?recipe=${encodeURIComponent(recipe.file)}`;
            link.textContent = recipe.title;

            list.appendChild(link);
        });

    })
    .catch(error => {
        console.error("Errore nel caricamento delle ricette:", error);
    });