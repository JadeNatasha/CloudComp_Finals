// Wait until the complete HTML page is fully loaded by the browser
document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. SEARCH FILTER FUNCTIONALITY
    // ==========================================
    const searchInput = document.querySelector(".search-box input");
    const searchButton = document.querySelector(".search-box button");
    const productCards = document.querySelectorAll(".prod-card");

    function handleProductSearch() {
        // Grab the text the user typed and convert it to lowercase
        const searchTerm = searchInput.value.toLowerCase().trim();

        // Loop through all 25 product cards on the screen
        productCards.forEach(card => {
            // Get the name text inside the current product card paragraph
            const productName = card.querySelector("p").innerText.toLowerCase();

            // If the product name contains the search term, show it. Otherwise, hide it!
            if (productName.includes(searchTerm)) {
                card.style.display = "block"; // Shows the card
                card.style.opacity = "1";
            } else {
                card.style.display = "none";  // Hides the card from the screen
            }
        });
    }

    // Trigger search when the user clicks the blue magnifying glass button
    searchButton.addEventListener("click", handleProductSearch);

    // Trigger search instantly if the user presses the "Enter" key inside the input box
    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            handleProductSearch();
        }
    });


    // ==========================================
    // 2. SMOOTH SCROLL TO CATEGORIES
    // ==========================================
    const categoryCards = document.querySelectorAll(".cat-card");
    const categoryBlocks = document.querySelectorAll(".category-block");

    // Loop through each of the 5 top category cards
    categoryCards.forEach(card => {
        card.addEventListener("click", () => {
            // Get the text name of the category clicked (e.g., "Electronics")
            const clickedCategoryName = card.querySelector("h4").innerText.toLowerCase().trim();

            // Find the matching product section row down below
            categoryBlocks.forEach(block => {
                const blockTitle = block.querySelector(".category-block-title").innerText.toLowerCase();

                // If it matches, scroll smoothly to that section of the webpage
                if (blockTitle.includes(clickedCategoryName)) {
                    block.scrollIntoView({ 
                        behavior: "smooth", 
                        block: "center" 
                    });

                    // Add a brief subtle visual flash effect to show it was selected
                    block.style.transition = "background-color 0.3s ease";
                    block.style.backgroundColor = "#EEF2FF";
                    setTimeout(() => {
                        block.style.backgroundColor = "#FFFFFF";
                    }, 600);
                }
            });
        });
    });

});