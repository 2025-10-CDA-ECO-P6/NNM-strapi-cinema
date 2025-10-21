document.addEventListener('DOMContentLoaded', () => {
  const headerElement = document.querySelector('.header');

  // ===== STRUCTURE DU HEADER =====
  const headerHtmlContent = `
    <div class="header-container">
      <!-- Logo -->
      <a href="./index.html" class="logo">
        <img src="./src/assets/CineVerse.svg" alt="Logo CineVerse">
      </a>
      
      <!-- Navigation principale -->
      <nav class="navbar">
        <ul class="nav-links">
          <li><a href="./index.html">Accueil</a></li>
          <li><a href="./catalogue.html">Catalogue</a></li>
          <li><a href="./artistes.html">Artistes</a></li>
          <li><a href="./apropos.html">À propos</a></li>
        </ul>
      </nav>
      
      <!-- Barre de recherche -->
      <div class="search-wrapper">
        <button class="search-btn" aria-label="Lancer la recherche">
          <i class="fa-solid fa-magnifying-glass"></i>
        </button>
        <input
          type="text"
          class="search-input"
          placeholder="Rechercher un film, un artiste..."
          aria-label="Rechercher">
      </div>
      
      <!-- Burger menu (mobile) -->
      <div class="burger">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <!-- Menu mobile -->
    <div class="mobile-menu">
      <div class="mobile-search">
        <button class="search-btn">
          <i class="fas fa-search"></i>
        </button>
        <input type="text" placeholder="Rechercher...">
      </div>
      
      <ul>
        <li><a href="./index.html" class="active">Accueil</a></li>
        <li><a href="./catalogue.html">Catalogue</a></li>
        <li><a href="./artistes.html">Artistes</a></li>
        <li><a href="./apropos.html">À propos</a></li>
      </ul>
    </div>
    
    <hr class="borderheader">
  `;

  // ===== INJECTION DU HEADER =====
  if (headerElement) {
    headerElement.innerHTML = headerHtmlContent;

    // === Gestion du menu burger ===
    const burger = headerElement.querySelector('.burger');
    const mobileMenu = headerElement.querySelector('.mobile-menu');

    if (burger && mobileMenu) {
      burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
      });
    }

    // === Marquer le lien actif selon la page ===
    let currentPage = window.location.pathname.split("/").pop();

    // Siracine "/" sans fichier = "index.html"
    if (currentPage === "" || currentPage === "/") {
      currentPage = "index.html";
    }

    headerElement.querySelectorAll(".nav-links a, .mobile-menu a").forEach((link) => {
      const href = link.getAttribute("href");

      if (href && href.includes(currentPage)) {
        link.classList.add("active");
      }
    });

    // === Barre de recherche DESKTOP ===
    const searchWrapper = headerElement.querySelector('.search-wrapper');
    if (searchWrapper) {
      const input = searchWrapper.querySelector('.search-input');
      const button = searchWrapper.querySelector('.search-btn');

      function goToSearch() {
        const query = input.value.trim();
        if (!query) return;
        const encoded = encodeURIComponent(query);

        // Redirection (index.html et search.html dans le même dossier)
        window.location.href = "./search.html?q=" + encoded;
      }

      button.addEventListener('click', (e) => {
        e.preventDefault();
        goToSearch();
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          goToSearch();
        }
      });
    }

    // === Barre de recherche MOBILE  ===
    const mobileSearch = headerElement.querySelector('.mobile-search');
      if (mobileSearch) {

        const mobileInput = mobileSearch.querySelector('.mobile-input') || mobileSearch.querySelector('input');
        const mobileButton = mobileSearch.querySelector('.search-btn');

        const goToSearchMobile = () => {
          const q = mobileInput.value.trim();
          if (!q) return;
          window.location.href = `./search.html?q=${encodeURIComponent(q)}`;
        };

        mobileButton.addEventListener('click', (e) => { e.preventDefault(); goToSearchMobile(); });
        mobileInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') { e.preventDefault(); goToSearchMobile(); }
        });
    }
  }
});