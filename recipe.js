const params = new URLSearchParams(window.location.search);

const recipeFile =
    "recipes/" + params.get("recipe");

fetch(recipeFile)
    .then(response => {
        if (!response.ok) {
            throw new Error("Impossibile caricare la ricetta.");
        }

        return response.text();
    })
    
    .then(markdown => {

        const recipeContent = document.getElementById("recipe-content");

        recipeContent.innerHTML = marked.parse(markdown);

        // Trasforma i paragrafi numerati in blocchi "step"
        const paragraphs = recipeContent.querySelectorAll("p");

        paragraphs.forEach(paragraph => {

            const strong = paragraph.querySelector("strong");

            if (!strong) return;

            const match = strong.textContent.match(/^(\d+)\.\s*(.+)$/);

            if (!match) return;

            const number = match[1].padStart(2, "0");
            const title = match[2];

            const fullText = paragraph.innerHTML;
            const description = fullText
                .replace(strong.outerHTML, "")
                .replace(/^<br\s*\/?>/, "")
                .trim();

            paragraph.classList.add("recipe-step");

            paragraph.innerHTML = `
                <span class="step-number">${number}</span>
                <span class="step-title">${title}</span>
                <span class="step-description">${description}</span>
            `;
        });

    })
    .catch(error => {

        document.getElementById("recipe-content").innerHTML =
            "<p>Errore nel caricamento della ricetta.</p>";

        console.error(error);
    });