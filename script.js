let themeSelector = document.getElementById("theme-selector");
let searchInput = document.getElementById("search-input");

themeSelector.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode-bg");
})