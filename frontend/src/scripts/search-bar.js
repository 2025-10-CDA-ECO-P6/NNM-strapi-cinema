 // Sélecteurs
const searchWrapper = document.querySelector(".search-wrapper");
if (searchWrapper) {
  const input = searchWrapper.querySelector(".search-input");
  const button = searchWrapper.querySelector(".search-btn");

  function goToSearch() {
    const query = input.value.trim();
    if (!query) return; 
    const encoded = encodeURIComponent(query);


    window.location.href = "search.html?q=" + encoded;

  }

  button.addEventListener("click", (e) => {
    e.preventDefault();
    goToSearch();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goToSearch();
    }
  });
}