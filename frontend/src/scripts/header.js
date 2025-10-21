document.addEventListener('DOMContentLoaded', () => {
    const headerElement = document.getElementsByClassName('header')[0];

    const headerHtmlContent = `
        <div class="header-container">
            <a href="index.html" class="logo">
                <img src="./src/assets/CineVerse.svg" alt="Logo Cineverse">
            </a>
            
            <nav class="navbar">
                <ul class="nav-links">
                    <li><a href="#" class="active">Accueil</a></li>
                    <li><a href="#">Catalogue</a></li>
                    <li><a href="#">Artistes</a></li>
                    <li><a href="#">À propos</a></li>
                </ul>
            </nav>
            
            <div class="search-wrapper">
                <button class="search-btn" aria-label="Lancer la recherche">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </button>
                <input type="text" class="search-input" placeholder="Rechercher un film, un artiste..." aria-label="Rechercher">
            </div>
            
            <div class="burger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
        
        <div class="mobile-menu">
            <div class="mobile-search">
                <button class="search-btn">
                    <i class="fas fa-search"></i>
                </button>
                <input type="text" placeholder="Rechercher...">
            </div>
            
            <ul>
                <li><a href="#" class="active">Accueil</a></li>
                <li><a href="#">Catalogue</a></li>
                <li><a href="#">Artistes</a></li>
                <li><a href="#">À propos</a></li>
            </ul>
        </div>
        
        <hr class="borderheader">
    `;

    if (headerElement) {
    headerElement.innerHTML = headerHtmlContent;
    
     // Burger menu 
    const burger = headerElement.querySelector('.burger');
    const mobileMenu = headerElement.querySelector('.mobile-menu');

    if (burger && mobileMenu) {
      burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
      });
    }
  } 
  
  // === Search bar ===
  const searchWrapper = headerElement.querySelector(".search-wrapper");
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
});